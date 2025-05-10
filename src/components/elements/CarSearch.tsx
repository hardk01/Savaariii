import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

export interface AuthTokenPayload {
	userId: string;
	iat?: number;
	exp?: number;
}

type City = {
	name(name: any): void;
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

const CarSearch = () => {
	const [cities, setCities] = useState<City[]>([]);
	const [from, setCityFrom] = useState("");
	const [to, setCityTo] = useState("");
	const [car, setSelectedCar] = useState("");
	const [price, setPrice] = useState("");
	const [distance, setDistance] = useState("");
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);

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

				console.log("Booking result:", result);
				

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


	return (
		<>
			<div className="box-bottom-search background-card">
				<div className="item-search">
					<label className="text-sm-bold neutral-500">Select Your Car</label>
					<Dropdown className="dropdown">
						<Dropdown.Toggle as="div" className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search">
							{car || "Select Car"}
						</Dropdown.Toggle>
						<Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }} as="ul" className="dropdown-menu">
							<Dropdown.Item as="li" onClick={() => setSelectedCar("SUV")}>SUV</Dropdown.Item>
							<Dropdown.Item as="li" onClick={() => setSelectedCar("Wegener")}>Wegener</Dropdown.Item>
							<Dropdown.Item as="li" onClick={() => setSelectedCar("Swift")}>Swift</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
				<div className="item-search">
					<label className="text-sm-bold neutral-500">Pick Up Location</label>
					<Dropdown className="dropdown">
						<Dropdown.Toggle as="div" className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search">
							{from || "Select City"}
						</Dropdown.Toggle>
						<Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }} as="ul" className="dropdown-menu">
							{cities.map((city, index) => (
								<Dropdown.Item
									as="li"
									key={index}
									onClick={() => setCityFrom(city.city)}
								>
									{city.city}
								</Dropdown.Item>
							))}
						</Dropdown.Menu>
					</Dropdown>
				</div>

				<div className="item-search item-search-2">
					<label className="text-sm-bold neutral-500">Drop Off Location</label>
					<Dropdown className="dropdown">
						<Dropdown.Toggle as="div" className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search">
							{to || "Select City"}
						</Dropdown.Toggle>
						<Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }} as="ul" className="dropdown-menu">
							{cities.map((city, index) => (
								<Dropdown.Item
									as="li"
									key={index}
									onClick={() => setCityTo(city.city)}
								>
									{city.city}
								</Dropdown.Item>
							))}
						</Dropdown.Menu>
					</Dropdown>
				</div>
				<div className="item-search item-search-3">
					<input style={{ border: "none" }} value={distance} onChange={(e) => setDistance(e.target.value)} name="distance" className="form-control username" type="text" placeholder="Distance" />
				</div>
				<div className="item-search bd-none">
					<input style={{ border: "none" }} value={price} onChange={(e) => setPrice(e.target.value)} name="price" className="form-control username" type="text" placeholder="Price" />
				</div>
				<div className="item-search bd-none d-flex justify-content-end">
					<button onClick={handleFormSubmit} className="btn btn-brand-2 text-nowrap">
						<svg className="me-2" width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M19 19L14.6569 14.6569M14.6569 14.6569C16.1046 13.2091 17 11.2091 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C11.2091 17 13.2091 16.1046 14.6569 14.6569Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						Add Car
					</button>
				</div>
			</div>
		</>
	)
}

export default CarSearch
