"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SelectedCars from "../cars/SelectedCars";

// type City = {
//     city: string;
//     lat: string;
//     lng: string;
//     country: string;
//     iso2: string;
//     admin_name: string;
//     capital: string;
//     population: string;
//     population_proper: string;
// };

// interface Booking {
//     cityFrom: string;
//     cityTo: string;
//     selectedCar: string;
//     price: string;
//     distance: number;
//     pickUpDate: string,
//     pickUpTime: string
// }

type Car = {
    cityFrom: string;
    cityTo: string;
    selectedCar: string;
    distance: number;
    price: number;
  };
  
  type Booking = {
    cityFrom: string;
    cityTo: string;
    selectedCar: string;
    price: number;
    distance: number;
  };
  
  type SelectedCarsProps = {
    filteredData: Car[]; 
  };

const Form = () => {
    const router = useRouter();
    const [filterCityData, setFilterCityData] = useState<Booking[]>([]);
    const [filteredData, setFilteredData] = useState<Booking[]>([]);
    const [cityFrom, setCityFrom] = useState<string>("");
    const [cityTo, setCityTo] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState('oneWay');
    // const [city1, setCity1] = useState<string>("");
    // const [city2, setCity2] = useState<string>("");
    // const [cities, setCities] = useState<City[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showTable, setShowTable] = useState(false);
    const [formData, setformData] = useState({
        from: cityFrom,
        to: cityTo,
        pickUpDate: "",
        pickUpTime: "",
        returnDate: "",
        city: '',
        pickupAddress: "",
        dropAirport: "",
    });

    useEffect(() => {
        const storedData = localStorage.getItem("bookings");
        if (storedData) {
            setFilterCityData(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        if (cityFrom && cityTo) {
            const filtered = filterCityData.filter(
                (booking) =>
                    booking.cityFrom === cityFrom && booking.cityTo === cityTo
            );
            setFilteredData(filtered);
        } else {
            setFilteredData([]);
        }
    }, [cityFrom, cityTo, filterCityData]);

    // useEffect(() => {
    //     const fetchCities = async () => {
    //         try {
    //             const response = await fetch("/api/cites");
    //             const data = await response.json();
    //             setCities(data);
    //         } catch (error) {
    //             setError("Failed to load city data");
    //         }
    //     };
    //     fetchCities();
    // }, []);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;

        setformData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmitData = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        // Basic validation
        if (selectedOption === "local" && !formData.city) {
            setError("Please enter the city for a local trip.");
            return;
        } else if ((selectedOption === "oneWay" || selectedOption === "roundTrip") && (!cityFrom || !cityTo)) {
            setError("Please select both cities.");
            return;
        }

        // Data to send based on selected option
        const dataToSend = {
            cityFrom,
            cityTo,
            ...formData,
        };

        try {
            // Dispatch data to Redux
            // dispatch(addFormData(dataToSend));

            // Save data to local storage for persistence
            const storedData = JSON.parse(localStorage.getItem("formDataArray") || "[]");
            const dataArray = Array.isArray(storedData) ? storedData : [];
            dataArray.push(dataToSend);
            localStorage.setItem("formDataArray", JSON.stringify(dataArray));

            // Save the current form data object
            localStorage.setItem("formDataObj", JSON.stringify(dataToSend));

            // Send a request to the backend API
            const response = await fetch("/api/distance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            // Handle response
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || "Something went wrong with the distance calculation.");
                return;
            }

            const data = await response.json();
            localStorage.setItem("distance", JSON.stringify(data.distance));

            // Navigate to the next page

        } catch (err: any) {
            // Handle errors
            setError(err.message || "Failed to submit the form.");
        }
        setShowTable(true);
    };

    const handleRadioChange = (e: any) => {
        setSelectedOption(e.target.value);
    };

    return (
        <>
            <div>
                {!showTable ? (
                    <form onSubmit={handleSubmitData}>
                        <div className="form-radio">
                            <div><label htmlFor="">One Way <input checked={selectedOption === 'oneWay'} value="oneWay" onChange={handleRadioChange} type="radio" /></label></div>
                            <div><label htmlFor="">Round Trip <input checked={selectedOption === 'roundTrip'} value="roundTrip" onChange={handleRadioChange} type="radio" /></label></div>
                            <div><label htmlFor="">Local <input checked={selectedOption === 'local'} value="local" onChange={handleRadioChange} type="radio" /></label></div>
                            <div><label htmlFor="">Airport <input checked={selectedOption === 'airport'} value="airport" onChange={handleRadioChange} type="radio" /></label></div>
                        </div>
                        {selectedOption === "oneWay" && (
                            <div className="form-box">
                                <div>
                                    <label htmlFor="city1">From</label>
                                    <select
                                        name="cityFrom"
                                        value={cityFrom}
                                        onChange={(e) => {
                                            setCityFrom(e.target.value);
                                            setCityTo("");
                                        }}
                                    >
                                        <option value="">Select City</option>
                                        {[...new Set(filterCityData.map((item) => item.cityFrom))].map(
                                            (city, index) => (
                                                <option key={index} value={city}>
                                                    {city}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="city2">To</label>
                                    <select
                                        name="cityTo"
                                        value={cityTo}
                                        onChange={(e) => setCityTo(e.target.value)}
                                        disabled={!cityFrom} // Disable if no "From" city is selected
                                    >
                                        <option value="">Select City</option>
                                        {[...new Set(
                                            filterCityData
                                                .filter((item) => item.cityFrom === cityFrom)
                                                .map((item) => item.cityTo)
                                        )].map((city, index) => (
                                            <option key={index} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Add other form fields like pickup date, time, etc. */}
                                <div>
                                    <label>PICK UP DATE</label>
                                    <input
                                        type="date"
                                        name="pickUpDate"
                                        value={formData.pickUpDate}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div>
                                    <label>PICK UP TIME</label>
                                    <input
                                        type="time"
                                        name="pickUpTime"
                                        value={formData.pickUpTime}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        )}
                        {selectedOption === "roundTrip" && (
                            <div className="form-box">
                                <div>
                                    <label htmlFor="city1">From</label>
                                    <select
                                        name="cityFrom"
                                        value={cityFrom}
                                        onChange={(e) => {
                                            setCityFrom(e.target.value);
                                            setCityTo("");
                                        }}
                                    >
                                        <option value="">Select City</option>
                                        {[...new Set(filterCityData.map((item) => item.cityFrom))].map(
                                            (city, index) => (
                                                <option key={index} value={city}>
                                                    {city}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="city2">To</label>
                                    <select
                                        name="cityTo"
                                        value={cityTo}
                                        onChange={(e) => setCityTo(e.target.value)}
                                        disabled={!cityFrom} // Disable if no "From" city is selected
                                    >
                                        <option value="">Select City</option>
                                        {[...new Set(
                                            filterCityData
                                                .filter((item) => item.cityFrom === cityFrom)
                                                .map((item) => item.cityTo)
                                        )].map((city, index) => (
                                            <option key={index} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Add other form fields like pickup date, time, etc. */}
                                <div>
                                    <label>PICK UP DATE</label>
                                    <input
                                        type="date"
                                        name="pickUpDate"
                                        value={formData.pickUpDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>RETURN DATE</label>
                                    <input
                                        type="date"
                                        name="returnDate"
                                        value={formData.returnDate}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div>
                                    <label>PICK UP TIME</label>
                                    <input
                                        type="time"
                                        name="pickUpTime"
                                        value={formData.pickUpTime}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        )}
                        {selectedOption === "local" && (
                            <div className="form-box">
                                <div>
                                    <label htmlFor="city1">City: </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>PICK UP DATE</label>
                                    <input
                                        type="date"
                                        name="pickUpDate"
                                        value={formData.pickUpDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>PICK UP TIME</label>
                                    <input
                                        type="time"
                                        name="pickUpTime"
                                        value={formData.pickUpTime}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        )}

                        {selectedOption === "airport" && (
                            <div className="form-box">
                                <div>
                                    <label htmlFor="city1">TRIP :</label>
                                    <select
                                        name="pickupAddress"
                                        value={formData.pickupAddress}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Pickup from Airport"> Pickup from Airport </option>
                                        <option value="Drop to Airport"> Drop to Airport </option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="city1">From</label>
                                    <select
                                        name="cityFrom"
                                        value={cityFrom}
                                        onChange={(e) => {
                                            setCityFrom(e.target.value);
                                            setCityTo("");
                                        }}
                                    >
                                        <option value="">Select City</option>
                                        {[...new Set(filterCityData.map((item) => item.cityFrom))].map(
                                            (city, index) => (
                                                <option key={index} value={city}>
                                                    {city}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="city2">To</label>
                                    <select
                                        name="cityTo"
                                        value={cityTo}
                                        onChange={(e) => setCityTo(e.target.value)}
                                        disabled={!cityFrom} // Disable if no "From" city is selected
                                    >
                                        <option value="">Select City</option>
                                        {[...new Set(
                                            filterCityData
                                                .filter((item) => item.cityFrom === cityFrom)
                                                .map((item) => item.cityTo)
                                        )].map((city, index) => (
                                            <option key={index} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Add other form fields like pickup date, time, etc. */}
                                <div>
                                    <label>PICK UP DATE</label>
                                    <input
                                        type="date"
                                        name="pickUpDate"
                                        value={formData.pickUpDate}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div>
                                    <label>PICK UP TIME</label>
                                    <input
                                        type="time"
                                        name="pickUpTime"
                                        value={formData.pickUpTime}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        )}
                        {/* Additional fields as required */}
                        <div>
                            <button type="submit">Explore Cabs</button>
                        </div>
                    </form>
                ) : (
                    <div>
                       <SelectedCars filteredData={filteredData}  />
                    </div>
                )}
            </div>
        </>
    );
};

export default Form;
