import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Dropdown } from "react-bootstrap";
import Table from "./elements/Table";
import data from "../../../utility/in.json";

type City = {
    city: string;
};

type AuthTokenPayload = {
    userId: string;
};

type Booking = {
    _id: string;
    from: string;
    to: string;
    car: string;
    price: number;
    userId: string;
    distance: number;
};

const SelectedCar = () => {
    const [cities, setCities] = useState<City[]>([]);
    const [from, setCityFrom] = useState("");
    const [to, setCityTo] = useState("");
    const [car, setSelectedCar] = useState("");
    const [price, setPrice] = useState("");
    const [distance, setDistance] = useState("");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [carList, setCarList] = useState("");
    const [CarImage, setCarImage] = useState<string | null>(null);


    const fetchCarList = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}v1/cars?page=${currentPage}&limit=8`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch cars');
            }

            const data = await response.json();

            const carArray = Array.isArray(data.data) ? data.data : [];
            setCarList(carArray);
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    useEffect(() => {
        fetchCarList();
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem("token");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/cityroutefares?page=${currentPage}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                // console.log(data.data, "data.data");

                setBookings(data.data);
                setTotalPages(data.totalPages || 1);
            }
        };

        fetchBookings();
    }, [currentPage]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!from || !to || !car || !price) {
            alert("Please fill in all required fields.");
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
                alert("User ID is missing. Please log in again.");
                return;
            }

            const bookingData = {
                from,
                to,
                car,
                CarImage,
                price: Number(price),
                userId,
                distance: Number(distance),
            };

            let response;

            if (isEditing && editingId) {
                response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/cityroutefares/${editingId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(bookingData),
                });
            } else {
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
                    setBookings((prev) =>
                        prev.map((b) => (b._id === editingId ? result.data : b))
                    );
                } else {
                    setBookings((prev) => [...prev, result.data]);
                }

                setCityFrom("");
                setCityTo("");
                setSelectedCar("");
                setCarImage(null);
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

    const handleEdit = (car: Booking) => {
        setIsEditing(true);
        setEditingId(car._id);
        setCityFrom(car.from);
        setCityTo(car.to);
        setSelectedCar(car.car);
        setPrice(car.price.toString());
        setDistance(car.distance.toString());
    };

    const handleDelete = async (carId: string) => {
        if (!confirm("Are you sure you want to delete this car?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/cityroutefares/${carId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error deleting car:", errorData);
                return;
            }
            setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== carId));
        } catch (error) {
            console.error("Error deleting car:", error);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };


    return (
        <>
            <div className="container">
                <div style={{ top: "10px" }} className="box-search-advance background-card wow fadeIn">
                    <div className="box-bottom-search background-card">
                        <div className="item-search">
                            <label className="text-sm-bold neutral-500">Select Your Car</label>
                            <Dropdown className="dropdown">
                                <Dropdown.Toggle as="div" className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search">
                                    {car || "Car"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }} as="ul" className="dropdown-menu">
                                    {Array.isArray(carList) && carList.length > 0 ? (
                                        carList.map((carItem: any, index: number) => (
                                            <Dropdown.Item
                                                as="li"
                                                key={index}
                                                onClick={() => {
                                                    setSelectedCar(carItem.name); // Set the selected car name
                                                    setCarImage(carItem.carImage); // Set the corresponding car image
                                                }}
                                            >
                                                {carItem.name}
                                            </Dropdown.Item>
                                        ))
                                    ) : (
                                        <Dropdown.Item as="li" disabled>
                                            No cars available
                                        </Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="item-search">
                            <label className="text-sm-bold neutral-500">Pick Up Location</label>
                            <Dropdown className="dropdown">
                                <Dropdown.Toggle as="div" className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search">
                                    {from || "Pick Up"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }} as="ul" className="dropdown-menu">
                                    {data.length > 0 ? (
                                        data.map((city, index) => (
                                            <Dropdown.Item
                                                as="li"
                                                key={index}
                                                onClick={() => setCityFrom(city.city)}
                                            >
                                                {city.city}
                                            </Dropdown.Item>
                                        ))
                                    ) : (
                                        <Dropdown.Item as="li" disabled>
                                            No cities available
                                        </Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        <div className="item-search item-search-2">
                            <label className="text-sm-bold neutral-500">Drop Off Location</label>
                            <Dropdown className="dropdown">
                                <Dropdown.Toggle as="div" className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search">
                                    {to || "Drop"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }} as="ul" className="dropdown-menu">
                                    {data.length > 0 ? (
                                        data.map((city, index) => (
                                            <Dropdown.Item
                                                as="li"
                                                key={index}
                                                onClick={() => setCityTo(city.city)}
                                            >
                                                {city.city}
                                            </Dropdown.Item>
                                        ))
                                    ) : (
                                        <Dropdown.Item as="li" disabled>
                                            No cities available
                                        </Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="item-search item-search-3">
                            <input
                                style={{ border: "none" }}
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                name="distance"
                                className="form-control username"
                                type="text"
                                placeholder="Distance"
                            />
                        </div>
                        <div className="item-search bd-none">
                            <input
                                style={{ border: "none" }}
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                name="pickUp"
                                className="form-control username"
                                type="text"
                                placeholder="Price"
                            />
                        </div>
                        <div className="item-search bd-none d-flex justify-content-end">
                            <button
                                className="btn btn-brand-2 text-nowrap"
                                onClick={handleFormSubmit}
                            >
                                <svg className="me-2" width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 19L14.6569 14.6569M14.6569 14.6569C16.1046 13.2091 17 11.2091 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C11.2091 17 13.2091 16.1046 14.6569 14.6569Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Add Car
                            </button>
                        </div>
                    </div>

                </div>
                <Table
                    handleNextPage={handleNextPage}
                    handlePreviousPage={handlePreviousPage}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    bookings={bookings}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </div>



        </>
    );
};

export default SelectedCar;