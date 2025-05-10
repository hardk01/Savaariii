'use client'
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export interface AuthTokenPayload {
    userId: string;
    iat?: number;
    exp?: number;
}

type City = {
    city: string;
    lat: string;
    lng: string;
    country: string;
    iso2: string;
    admin_name: string;
    capital: string;
    population: string;
    population_proper: string;
};

type Booking = {
    _id: string;
    cityFrom: string;
    cityTo: string;
    car: string;
    price: string;
    distance: number;
};

const CarsSelect = () => {
    const [from, setCityFrom] = useState("");
    const [to, setCityTo] = useState("");
    const [cities, setCities] = useState<City[]>([]);
    const [car, setSelectedCar] = useState("");
    const [price, setPrice] = useState("");
    const [distance, setDistance] = useState("");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // console.log(bookings, "bookings");
    

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch("/api/cites");
                const data = await response.json();
                setCities(data);
            } catch (error) {
                console.log("Failed to load city data", error);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem("token");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/cityroutefares`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setBookings(data.data);
            }
        };

        fetchBookings();
    }, []);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!from || !to || !car || !price) {
            alert("Please fill out all fields!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            let userId: string | undefined;
    
            if (token) {
                const decoded: AuthTokenPayload = jwtDecode(token);
                userId = decoded.userId;
            }
    
            if (!userId) {
                alert("User ID not found in token");
                return;
            }
    
            const bookingData = {
                from,
                to,
                car,
                price: Number(price),
                userId,
                distance: Number(distance),
            };
    
            let response;
    
            if (isEditing && editingId) {
                // 🛠 PUT request for editing
                response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/cityroutefares/${editingId}`, {
                    method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(bookingData),
                });
                } else {
                // ✨ POST request for new booking
                response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/cityroutefares`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(bookingData),
                });
            }
    
            if (response.ok) {
                const result = await response.json();
    
                if (isEditing && editingId) {
                    // 🔁 Update edited booking in state
                    setBookings((prev) =>
                        prev.map((b) => (b._id === editingId ? result.data : b))
                    );
                    alert("Booking updated successfully!");
                } else {
                    // ➕ Add new booking to state
                    setBookings((prev) => [...prev, result.data]);
                    alert("Booking added successfully!");
                }

                // 🔄 Reset form and states
                setCityFrom("");
                setCityTo("");
                setSelectedCar("");
                setPrice("");
                setDistance("");
                setIsEditing(false);
                setEditingId(null);
            } else {
                alert("Failed to save booking. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while saving the booking.");
        }
    };


    const handleEdit = (index: number) => {
        const booking = bookings[index];
    
        setCityFrom(booking.cityFrom);
        setCityTo(booking.cityTo);
        setSelectedCar(booking.car);
        setPrice(String(booking.price));
        setDistance(String(booking.distance));
    
        setIsEditing(true);
        setEditingId(booking._id);
    };

    const handleDelete = async (index: number) => {
        const booking = bookings[index];
        const token = localStorage.getItem("token");
    
        if (!booking._id) {
            alert("Booking ID not found.");
            return;
        }
    
        const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
        if (!confirmDelete) return;
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/cityroutefares/${booking._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
        const updatedBookings = bookings.filter((_, i) => i !== index);
        setBookings(updatedBookings);

                // Optional: If you're storing bookings in localStorage
        localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    
                alert("Booking deleted successfully.");
            } else {
                alert("Failed to delete booking.");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting the booking.");
        }
    };


    return (
        <>
            <div className="max-w-6xl mx-auto mt-10">
                <h1 className="text-xl font-bold mb-4">Booking Manager</h1>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    {/* Car Select Field */}
                    <div className="grid grid-cols-2 gap-4">
                        <select
                            id="carSelect"
                            value={car}
                            onChange={(e) => setSelectedCar(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select a car</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Hatchback">Hatchback</option>
                            <option value="Luxury">Luxury</option>
                        </select>
                    </div>
                    {/* City From Field */}
                    <div className="grid grid-cols-2 gap-4">
                        <select
                            id="cityFrom"
                            value={from}
                            onChange={(e) => setCityFrom(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.city} value={city.city}>
                                    {city.city}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* City To Field */}
                    <div className="grid grid-cols-2 gap-4">
                        <select
                            id="cityTo"
                            value={to}
                            onChange={(e) => setCityTo(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select a city</option>
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.city} value={city.city}>
                                    {city.city}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Price Input Field */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter price"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            id="distance"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            placeholder="Enter Distance"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    {/* Submit Button */}
                    <div>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Submit
                        </button>
                    </div>
                </form>

                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">City From</th>
                            <th className="border border-gray-300 px-4 py-2">City To</th>
                            <th className="border border-gray-300 px-4 py-2">Car</th>
                            <th className="border border-gray-300 px-4 py-2">Price</th>
                            <th className="border border-gray-300 px-4 py-2">Distance (km)</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings?.map((booking: any, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">
                                    {booking.from}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {booking.to}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {booking.car}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">₹{booking.price}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {booking.distance?.toFixed(0)}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        onClick={() => handleEdit(index)}
                                        className="mr-2 px-2 py-1 bg-green-700 text-white rounded"
                                    >
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(index)} className="px-2 py-1 bg-red-500 text-white rounded">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default CarsSelect
