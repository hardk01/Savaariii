'use client'
import React, { useEffect, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import MyDatePicker from './MyDatePicker'
import { useRouter } from 'next/navigation'
import PhoneVerificationModal from './PhoneVerificationModal'

type Booking = {
	to: any;
	from: any;
	cityFrom: string;
	cityTo: string;
	car: string;
	price: number;
	distance: number;
};

export default function HeroSearch({ selectedOption }: { selectedOption: string }) {
	const router = useRouter();
	const [from, setCityFrom] = useState<string>("");
	const [to, setCityTo] = useState<string>("");
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [formData, setformData] = useState({
		from: from,
		to: to,
		pickUpDate: "",
		pickUpTime: "00:00",
		returnDate: "",
		city: '',
		pickupAddress: "",
		dropAirport: "",
		bookingType: selectedOption,
	});

	useEffect(() => {
		const storedFormData = localStorage.getItem("formDataObj");
		if (storedFormData) {
			const parsedData = JSON.parse(storedFormData);
			setformData(parsedData);
			setCityFrom(parsedData.from || "");
			setCityTo(parsedData.to || "");
		}
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

	useEffect(() => {
		setformData((prev) => ({
			...prev,
			bookingType: selectedOption,
		}));
	}, [selectedOption]);

	const handlePickupSelect = (city: string) => {
		setCityFrom(city);
		setCityTo("");
		setformData((prev) => ({
			...prev,
			from: city,
			to: "",
			city: city,
		}));
	};

	const handleDropoffSelect = (city: string) => {
		setCityTo(city);
		setformData((prev) => ({
			...prev,
			to: city,
		}));
	};

	const handleSubmitData = async (e: React.FormEvent) => {
		e.preventDefault();

		// if (!isPhoneVerified) {
		// 	setShowVerificationModal(true);
		// 	return;
		// }

		if (selectedOption === "local" && !formData.city) {
			alert("Please select a city for local booking.");
			return;
		} else if (
			(selectedOption === "one-way" || selectedOption === "round-trip" || selectedOption === "airport") &&
			(!formData.from || !formData.to)
		) {
			alert("Please select both pickup and drop-off locations.");
			return;
		}

		if (!formData.pickUpDate || !formData.pickUpTime) {
			alert("Please select pickup date and time.");
			return;
		}

		if (selectedOption === "round-trip" && !formData.returnDate) {
			alert("Please select a return date for round-trip bookings.");
			return;
		}

		if (selectedOption === "airport" && !formData.dropAirport) {
			alert("Please select a trip type (Pickup from Airport or Drop TO Airport).");
			return;
		}

		let dataToSend: any = {
			bookingType: selectedOption,
		};

		const tripMapping: { [key: string]: string } = {
			"Pickup from Airport": "pickup",
			"Drop TO Airport": "drop",
		};

		if (selectedOption === "local") {
			dataToSend = {
				...dataToSend,
				city: formData.city,
				pickUpDate: formData.pickUpDate,
				pickUpTime: formData.pickUpTime,
			};
		} else if (selectedOption === "one-way") {
			dataToSend = {
				...dataToSend,
				from: formData.from,
				to: formData.to,
				pickUpDate: formData.pickUpDate,
				pickUpTime: formData.pickUpTime,
			};
		} else if (selectedOption === "round-trip") {
			dataToSend = {
				...dataToSend,
				from: formData.from,
				to: formData.to,
				pickUpDate: formData.pickUpDate,
				pickUpTime: formData.pickUpTime,
				returnDate: formData.returnDate,
			};

		} else if (selectedOption === "airport") {
			dataToSend = {
				...dataToSend,
				pickupAddress: formData.from,
				dropAddress: formData.to,
				from: formData.from,
				to: formData.to,
				pickUpDate: formData.pickUpDate,
				pickUpTime: formData.pickUpTime,
				trip: tripMapping[formData.dropAirport],
			};
		}

		localStorage.setItem("formDataObj", JSON.stringify(dataToSend));

		try {
			const queryParams = new URLSearchParams(dataToSend);
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}v1/cityroutefares/search/locations?${queryParams.toString()}`,
				{
					method: "GET",
					headers: { "Content-Type": "application/json" },
				}
			);

			if (!response.ok) {
				alert("Failed to fetch data from the API.");
				return;
			}
			const data = await response.json();

			localStorage.setItem("cabResults", JSON.stringify(data.data));

			router.push("/booking-info");
		} catch (err) {
			console.error(err);
			alert("An error occurred while fetching data.");
		}
	};

	function isValidTime(time: any): time is string {
		if (typeof time !== "string") return false;
		const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
		return timeRegex.test(time);
	}

	function parseDate(dateString: string | null): Date | null {
		if (!dateString) return null;
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? null : date;
	}


	const pickupOptions = [...new Set(bookings.map((item) => item.from))];
	const dropoffOptions = [...new Set(bookings.filter((item) => item.from === formData.from).map((item) => item.to))];




	return (
		<>
			<form onSubmit={handleSubmitData}>
				{selectedOption === "one-way" && (
					<div className="box-bottom-search background-card">
						{/* Pickup Dropdown */}
						<div className="item-search">
							<label className="text-sm-bold neutral-500">Pick Up Location</label>
							<Dropdown>
								<Dropdown.Toggle className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search">
									{formData.from || "Select Pickup"}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									{pickupOptions.map((city, idx) => (
										<Dropdown.Item key={idx} onClick={() => handlePickupSelect(city)}>
											{city}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
						</div>
						{/* Dropoff Dropdown */}
						<div className="item-search item-search-2">
							<label className="text-sm-bold neutral-500">Drop Off Location</label>
							<Dropdown>
								<Dropdown.Toggle className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search">
									{formData.to || "Select Dropoff"}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									{dropoffOptions.map((city, idx) => (
										<Dropdown.Item key={idx} onClick={() => handleDropoffSelect(city)}>
											{city}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
						</div>
						{/* Date Pickers */}
						<div className="item-search item-search-3">
							<label className="text-sm-bold neutral-500">Pick Up Date</label>
							<div className="box-calendar-date">
								<MyDatePicker
									selected={parseDate(formData.pickUpDate)}
									onChange={(date: Date | null) => {
										if (date) {
											setformData(prev => ({
												...prev,
												pickUpDate: date.toISOString(),
											}));
										}
									}}
									dateFormat="dd-MM-yyyy"
								/>
							</div>
						</div>

						<div className="item-search bd-none">
							<label className="text-sm-bold neutral-500">Pick Up Time</label>
							<div className="box-calendar-date">
								<MyDatePicker
									selected={formData.pickUpTime ? new Date(`1970-01-01T${formData.pickUpTime}`) : null}
									onChange={(time: Date | null) => {
										if (time) {
											const hh = time.getHours().toString().padStart(2, "0");
											const mm = time.getMinutes().toString().padStart(2, "0");
											setformData(prev => ({ ...prev, pickUpTime: `${hh}:${mm}` }));
										}
									}}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									timeCaption="Time"
									dateFormat="HH:mm"
								/>
							</div>
						</div>

						{/* Submit Button */}
						<div className="item-search bd-none d-flex justify-content-end">
							<button type="submit" className="btn btn-brand-2 text-nowrap">
								<svg className="me-2" width={20} height={20} viewBox="0 0 20 20" fill="none">
									<path d="M19 19L14.6569 14.6569M14.6569 14.6569C16.1046 13.2091 17 11.2091 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C11.2091 17 13.2091 16.1046 14.6569 14.6569Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								Find a Vehicle
							</button>
						</div>
					</div>
				)}
				{selectedOption === "round-trip" && (
					<div className="box-bottom-search background-card">
						<div className="item-search">
							<label className="text-sm-bold neutral-500">Pick Up Location</label>
							<Dropdown>
								<Dropdown.Toggle className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search">
									{formData.from || "Select Pickup"}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									{pickupOptions.map((city, idx) => (
										<Dropdown.Item key={idx} onClick={() => handlePickupSelect(city)}>
											{city}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
						</div>
						{/* Dropoff Dropdown */}
						<div className="item-search item-search-2">
							<label className="text-sm-bold neutral-500">Drop Off Location</label>
							<Dropdown>
								<Dropdown.Toggle className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search">
									{formData.to || "Select Dropoff"}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									{dropoffOptions.map((city, idx) => (
										<Dropdown.Item key={idx} onClick={() => handleDropoffSelect(city)}>
											{city}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
						</div>
						{/* Date Pickers */}
						<div className="item-search item-search-3">
							<label className="text-sm-bold neutral-500">Pick Up Date</label>
							<div className="box-calendar-date">
								<MyDatePicker
									selected={parseDate(formData.pickUpDate)}
									onChange={(date: Date | null) => {
										if (date) {
											setformData(prev => ({
												...prev,
												pickUpDate: date.toISOString(),
											}));
										}
									}}
									dateFormat="dd-MM-yyyy" />
							</div>
						</div>
						<div className="item-search bd-none">
							<label className="text-sm-bold neutral-500">Return Date</label>
							<div className="box-calendar-date">
								<MyDatePicker
									selected={parseDate(formData.returnDate)}
									onChange={(date: Date | null) => {
										if (date) {
											setformData(prev => ({
												...prev,
												returnDate: date.toISOString(),
											}));
										}
									}}
									dateFormat="dd-MM-yyyy" />
							</div>
						</div>
						<div className="item-search bd-none">
							<label className="text-sm-bold neutral-500">Pick Up Time</label>
							<div className="box-calendar-date">
								<MyDatePicker
									selected={
										isValidTime(formData.pickUpTime)
											? new Date(`1970-01-01T${formData.pickUpTime}`)
											: null
									}
									onChange={(time: Date | null) => {
										if (time instanceof Date && !isNaN(time.getTime())) {
											const hh = time.getHours().toString().padStart(2, "0");
											const mm = time.getMinutes().toString().padStart(2, "0");
											setformData(prev => ({ ...prev, pickUpTime: `${hh}:${mm}` }));
										}
									}}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									timeCaption="Time"
									dateFormat="HH:mm" />
							</div>
						</div>
						<div className="item-search bd-none d-flex justify-content-end">
							<button type="submit" className="btn btn-brand-2 text-nowrap">
								<svg className="me-2" width={20} height={20} viewBox="0 0 20 20" fill="none">
									<path d="M19 19L14.6569 14.6569M14.6569 14.6569C16.1046 13.2091 17 11.2091 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C11.2091 17 13.2091 16.1046 14.6569 14.6569Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								Find a Vehicle
							</button>
						</div>
					</div>
				)}
				{selectedOption === "local" && (
					<div className="box-bottom-search background-card">
						<div className="item-search">
							<label className="text-sm-bold neutral-500">Pick Up Location</label>
							<Dropdown>
								<Dropdown.Toggle className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search">
									{formData.from || "Select Pickup"}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									{pickupOptions.map((city, idx) => (
										<Dropdown.Item key={idx} onClick={() => handlePickupSelect(city)}>
											{city}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
						</div>

						{/* Date Pickers */}
						<div className="item-search item-search-3">
							<label className="text-sm-bold neutral-500">Pick Up Date</label>
							<div className="box-calendar-date">
								<MyDatePicker
									selected={parseDate(formData.pickUpDate)}
									onChange={(date: Date | null) => {
										if (date) {
											setformData(prev => ({
												...prev,
												pickUpDate: date.toISOString(),
											}));
										}
									}}
									dateFormat="dd-MM-yyyy"
								/>
							</div>
						</div>
						<div className="item-search bd-none">
							<label className="text-sm-bold neutral-500">Time</label>
							<div className="box-calendar-date">
								<MyDatePicker
									selected={formData.pickUpTime ? new Date(`1970-01-01T${formData.pickUpTime}`) : null}
									onChange={(time: Date | null) => {
										if (time) {
											const hh = time.getHours().toString().padStart(2, "0");
											const mm = time.getMinutes().toString().padStart(2, "0");
											setformData(prev => ({ ...prev, pickUpTime: `${hh}:${mm}` }));
										}
									}}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									timeCaption="Time"
									dateFormat="HH:mm"
								/>
							</div>
						</div>
						<div className="item-search bd-none d-flex justify-content-end">
							<button type="submit" className="btn btn-brand-2 text-nowrap">
								<svg className="me-2" width={20} height={20} viewBox="0 0 20 20" fill="none">
									<path d="M19 19L14.6569 14.6569M14.6569 14.6569C16.1046 13.2091 17 11.2091 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C11.2091 17 13.2091 16.1046 14.6569 14.6569Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								Find a Vehicle
							</button>
						</div>
					</div>
				)}
				{selectedOption === "airport" && (
					<div className="box-bottom-search background-card">
						<div className="item-search item-search-2">
							<label className="text-sm-bold neutral-500">Trip</label>
							<Dropdown className="dropdown">
								<Dropdown.Toggle as="div" className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search">
									{formData.dropAirport || "Select Your Trip"}
								</Dropdown.Toggle>
								<Dropdown.Menu as="ul" className="dropdown-menu">
									<li
										onClick={() =>
											setformData((prev) => ({
												...prev,
												dropAirport: "Pickup from Airport",
											}))}>
										Pickup from Airport
									</li>
									<li
										onClick={() =>
											setformData((prev) => ({
												...prev,
												dropAirport: "Drop TO Airport",
											}))}>Drop TO Airport</li>
								</Dropdown.Menu>
							</Dropdown>
						</div>
						<div className="item-search">
							<label className="text-sm-bold neutral-500">Pick Up Location</label>
							<Dropdown>
								<Dropdown.Toggle className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search">
									{formData.from || "Select Pickup"}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									{pickupOptions.map((city, idx) => (
										<Dropdown.Item key={idx} onClick={() => handlePickupSelect(city)}>
											{city}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
						</div>
						<div className="item-search item-search-2">
							<label className="text-sm-bold neutral-500">Drop Off Location</label>
							<Dropdown>
								<Dropdown.Toggle className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search">
									{formData.to || "Select Dropoff"}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									{dropoffOptions.map((city, idx) => (
										<Dropdown.Item key={idx} onClick={() => handleDropoffSelect(city)}>
											{city}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
						</div>
						<div className="item-search item-search-3">
							<label className="text-sm-bold neutral-500">Pick Up Date</label>
							<div className="box-calendar-date">
								<MyDatePicker
									selected={parseDate(formData.pickUpDate)}
									onChange={(date: Date | null) => {
										if (date) {
											setformData(prev => ({
												...prev,
												pickUpDate: date.toISOString(),
											}));
										}
									}} dateFormat="dd-MM-yyyy" />
							</div>
						</div>
						<div className="item-search bd-none">
							<label className="text-sm-bold neutral-500">Time</label>
							<div className="box-calendar-date">
								<MyDatePicker
									selected={formData.pickUpTime ? new Date(`1970-01-01T${formData.pickUpTime}`) : null}
									onChange={(time: Date | null) => {
										if (time) {
											const hh = time.getHours().toString().padStart(2, "0");
											const mm = time.getMinutes().toString().padStart(2, "0");
											setformData(prev => ({ ...prev, pickUpTime: `${hh}:${mm}` }));
										}
									}}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									timeCaption="Time"
									dateFormat="HH:mm" />
							</div>
						</div>

						{/* Submit Button */}
						<div className="item-search bd-none d-flex justify-content-end">
							<button type="submit" className="btn btn-brand-2 text-nowrap">
								<svg className="me-2" width={20} height={20} viewBox="0 0 20 20" fill="none">
									<path d="M19 19L14.6569 14.6569M14.6569 14.6569C16.1046 13.2091 17 11.2091 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C11.2091 17 13.2091 16.1046 14.6569 14.6569Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								Find a Vehicle
							</button>
						</div>
					</div>
				)}
			</form>
				
		</>
	)
}
