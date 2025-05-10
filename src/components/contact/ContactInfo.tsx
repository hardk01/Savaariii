"use client"
import React, { useEffect, useState } from 'react'
import PaymentComponent from '../coupon/Coupon';

type UserFormData = {
    cityFrom?: string;
    cityTo?: string;
    pickUpDate?: string;
    pickUpTime?: string;
  };

  type Car = {
    cityFrom: string;
    cityTo: string;
    selectedCar: string;
    distance: number;
    price: number;
  };

const ContactInfo = () => {
    const [selectedOption, setSelectedOption] = useState("inclusions");
    const [userFormData, setUserFormData] = useState<UserFormData | any>(null);
    const [userCarData, setUserCarData] = useState<Car | any>(null);
    const [emailId, setEmailId] = useState<{ email: string } | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('userInfoObj');
        if (storedData) {
            setEmailId(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        const storedData = localStorage.getItem("selectedCarsInfo");
        const existingSelectedCars = JSON.parse(localStorage.getItem("selectedAllData") || "[]");
        if (storedData) {
            const parsedCarInfo = JSON.parse(storedData);

            // If emailId is available, add it to selectedCars and update localStorage
            if (emailId?.email) {
                const updatedCarInfo = {
                    ...parsedCarInfo,
                    ['email']: emailId.email, // Add email as a key with its value
                };
                const updatedSelectedCars: any = [...existingSelectedCars, updatedCarInfo];
                localStorage.setItem("selectedAllData", JSON.stringify(updatedSelectedCars));
            }
        }
    }, [emailId]);

    useEffect(() => {
        const storedSelectedCars = localStorage.getItem("formDataObj");
        if (storedSelectedCars) {
            setUserFormData(JSON.parse(storedSelectedCars));
        }
    }, []);

    useEffect(() => {
        const storedSelectedCars = localStorage.getItem("selectedCarsInfo");
        if (storedSelectedCars) {
            setUserCarData(JSON.parse(storedSelectedCars));
        }
    }, []);

    // useEffect(() => {
    //     const storedData = localStorage.getItem('userData');

    //     if (storedData) {
    //         setUserInfo(JSON.parse(storedData));
    //     }
    // }, []);

    // const handleInputChange = (e: any) => {
    //     const { name, value } = e.target;
    //     setUserInfo((prevState) => ({
    //         ...prevState,
    //         [name]: value
    //     }));
    // };

    // const handleSubmit = (event: React.FormEvent) => {
    //     event.preventDefault();

    //     const combinedData = {
    //         ...userInfo,
    //         selectedCars: selectedCars,
    //     };

    //     const updatedUserInfoArray = [...(JSON.parse(localStorage.getItem('userInfoArray') || '[]')), combinedData];

    //     localStorage.setItem('userInfoArray', JSON.stringify(updatedUserInfoArray));

    //     setUserInfo({
    //         name: "",
    //         email: "",
    //         phoneNumber: "",
    //         pickUp: "",
    //         drop: "",
    //     });

    //     setShowDetails(true);
    // };

    return (
        <>
            <div
                className="grid  gap-16 items-center relative overflow-hidden p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-3xl max-w-6xl mx-auto bg-white mt-4 font-[sans-serif] before:absolute before:right-0 before:h-full max-md:before:hidden">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96 p-6">
                        <div className="flex items-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-slate-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>
                            <h5 className="ml-3 text-slate-800 text-xl font-semibold">
                                Your Booking Details
                            </h5>
                        </div>

                        <div>
                            <p className="block text-slate-600 leading-normal font-light mb-4">
                                <span>Itinerary :</span> {userFormData?.cityFrom} {">"} {userFormData?.cityTo}
                            </p>
                            <p className="block text-slate-600 leading-normal font-light mb-4">
                                <span>Pickup Date :</span> {userFormData?.pickUpDate} {">"} {userFormData?.pickUpTime}
                            </p>
                        </div>

                        <div>
                            <p className="block text-slate-600 leading-normal font-light mb-4">
                                <span>Car Type :</span> {userCarData?.selectedCar}
                            </p>
                            <p className="block text-slate-600 leading-normal font-light mb-4">
                                <span>KMs Included :</span> {userCarData?.distance?.toFixed(0)} Km
                            </p>
                            <p className="block text-slate-600 leading-normal font-light mb-4">
                                <span>Total Fare :</span> {userCarData?.price} Rate
                            </p>
                        </div>

                    </div>
                    <div style={{ width: "-webkit-fill-available" }} className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                            <div className="row flex">
                                <button
                                    onClick={() => setSelectedOption("inclusions")}
                                    className="rounded-md rounded-r-none bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                >
                                    Inclusions
                                </button>
                                <button
                                    onClick={() => setSelectedOption("exclusions")}
                                    className="rounded-none bg-slate-800 py-2 px-4 border-l border-r border-slate-700 text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                >
                                    Exclusions
                                </button>
                                <button
                                    onClick={() => setSelectedOption("tnc")}
                                    className="rounded-md rounded-l-none bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                >
                                    T&C
                                </button>
                            </div>
                        </div>
                        {selectedOption === "inclusions" && (
                            <div>
                                <p className="block text-slate-600 leading-normal font-light mb-4">
                                    Base Fare and Fuel Charges
                                </p>
                                <p className="block text-slate-600 leading-normal font-light mb-4">
                                    Driver Allowance
                                </p>
                                <p className="block text-slate-600 leading-normal font-light mb-4">
                                    State Tax & Toll
                                </p>
                                <p className="block text-slate-600 leading-normal font-light mb-4">
                                    GST (5%)
                                </p>
                            </div>
                        )}
                        {selectedOption === "exclusions" && (
                            <div>
                                <p className="block text-slate-600 leading-normal font-light mb-4">
                                    Pay ₹18/km after 1561 km
                                </p>
                                <p className="block text-slate-600 leading-normal font-light mb-4">
                                    Multiple pickups/drops
                                </p>
                            </div>
                        )}
                        {selectedOption === "tnc" && (
                            <div>
                                <p className="block text-slate-600 leading-normal font-light mb-4">
                                    Your Trip has a KM limit. If your usage exceeds this limit, you will be charged for the excess KM used.
                                </p>
                                <p className="block text-slate-600 leading-normal font-light mb-4">
                                    Your trip includes one pick up in Pick-up city and one drop to destination city. It does not include within city travel.
                                </p>
                                <p className="block text-slate-600 leading-normal font-light mb-4">
                                    If your Trip has Hill climbs, cab AC may be switched off during such climbs.
                                </p>

                            </div>
                        )}

                    </div>
                </div>
                <h2 className="text-gray-800 text-3xl font-extrabold">CONTACT & PICKUP DETAILS</h2>

                {/* <form onSubmit={handleSubmit}>
                        <div className="space-y-4 mt-8">
                            <input
                                onChange={handleInputChange}
                                value={userInfo.name}
                                name="name"
                                type="text"
                                placeholder="Full Name"
                                required
                                className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                            />
                            <input
                                onChange={handleInputChange}
                                value={userInfo.email}
                                name="email"
                                type="email"
                                placeholder="Email"
                                required
                                className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                            />
                            <input
                                onChange={handleInputChange}
                                value={userInfo.phoneNumber}
                                name="phoneNumber"
                                type="number"
                                placeholder="Phone No."
                                required
                                className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                            />
                            <input
                                onChange={handleInputChange}
                                value={userInfo.pickUp}
                                name="pickUp"
                                type="text"
                                placeholder="PICKUP"
                                required
                                className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                            />
                            <input
                                onChange={handleInputChange}
                                value={userInfo.drop}
                                name="drop"
                                type="text"
                                placeholder="DROP"
                                required
                                className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                            />
                            <button type="submit"
                                className="mt-8 flex items-center justify-center text-sm w-full rounded-md px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill='#fff' className="mr-2"
                                    viewBox="0 0 548.244 548.244">
                                    <path fillRule="evenodd"
                                        d="M392.19 156.054 211.268 281.667 22.032 218.58C8.823 214.168-.076 201.775 0 187.852c.077-13.923 9.078-26.24 22.338-30.498L506.15 1.549c11.5-3.697 24.123-.663 32.666 7.88 8.542 8.543 11.577 21.165 7.879 32.666L390.89 525.906c-4.258 13.26-16.575 22.261-30.498 22.338-13.923.076-26.316-8.823-30.728-22.032l-63.393-190.153z"
                                        clipRule="evenodd" data-original="#000000" />
                                </svg>
                                PROCEED
                            </button>
                        </div>
                    </form> */}

                <PaymentComponent userCarData={userCarData} />

                <ul className="mt-4 flex flex-wrap justify-center gap-6">
                    <li className="flex items-center text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill='currentColor'
                            viewBox="0 0 479.058 479.058">
                            <path
                                d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z"
                                data-original="#000000" />
                        </svg>
                        <a href="javascript:void(0)" className="text-sm ml-4">
                            <strong>info@example.com</strong>
                        </a>
                    </li>
                    <li className="flex items-center text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill='currentColor'
                            viewBox="0 0 482.6 482.6">
                            <path
                                d="M98.339 320.8c47.6 56.9 104.9 101.7 170.3 133.4 24.9 11.8 58.2 25.8 95.3 28.2 2.3.1 4.5.2 6.8.2 24.9 0 44.9-8.6 61.2-26.3.1-.1.3-.3.4-.5 5.8-7 12.4-13.3 19.3-20 4.7-4.5 9.5-9.2 14.1-14 21.3-22.2 21.3-50.4-.2-71.9l-60.1-60.1c-10.2-10.6-22.4-16.2-35.2-16.2-12.8 0-25.1 5.6-35.6 16.1l-35.8 35.8c-3.3-1.9-6.7-3.6-9.9-5.2-4-2-7.7-3.9-11-6-32.6-20.7-62.2-47.7-90.5-82.4-14.3-18.1-23.9-33.3-30.6-48.8 9.4-8.5 18.2-17.4 26.7-26.1 3-3.1 6.1-6.2 9.2-9.3 10.8-10.8 16.6-23.3 16.6-36s-5.7-25.2-16.6-36l-29.8-29.8c-3.5-3.5-6.8-6.9-10.2-10.4-6.6-6.8-13.5-13.8-20.3-20.1-10.3-10.1-22.4-15.4-35.2-15.4-12.7 0-24.9 5.3-35.6 15.5l-37.4 37.4c-13.6 13.6-21.3 30.1-22.9 49.2-1.9 23.9 2.5 49.3 13.9 80 17.5 47.5 43.9 91.6 83.1 138.7zm-72.6-216.6c1.2-13.3 6.3-24.4 15.9-34l37.2-37.2c5.8-5.6 12.2-8.5 18.4-8.5 6.1 0 12.3 2.9 18 8.7 6.7 6.2 13 12.7 19.8 19.6 3.4 3.5 6.9 7 10.4 10.6l29.8 29.8c6.2 6.2 9.4 12.5 9.4 18.7s-3.2 12.5-9.4 18.7c-3.1 3.1-6.2 6.3-9.3 9.4-9.3 9.4-18 18.3-27.6 26.8l-.5.5c-8.3 8.3-7 16.2-5 22.2.1.3.2.5.3.8 7.7 18.5 18.4 36.1 35.1 57.1 30 37 61.6 65.7 96.4 87.8 4.3 2.8 8.9 5 13.2 7.2 4 2 7.7 3.9 11 6 .4.2.7.4 1.1.6 3.3 1.7 6.5 2.5 9.7 2.5 8 0 13.2-5.1 14.9-6.8l37.4-37.4c5.8-5.8 12.1-8.9 18.3-8.9 7.6 0 13.8 4.7 17.7 8.9l60.3 60.2c12 12 11.9 25-.3 37.7-4.2 4.5-8.6 8.8-13.3 13.3-7 6.8-14.3 13.8-20.9 21.7-11.5 12.4-25.2 18.2-42.9 18.2-1.7 0-3.5-.1-5.2-.2-32.8-2.1-63.3-14.9-86.2-25.8-62.2-30.1-116.8-72.8-162.1-127-37.3-44.9-62.4-86.7-79-131.5-10.3-27.5-14.2-49.6-12.6-69.7z"
                                data-original="#000000"></path>
                        </svg>
                        <a href="javascript:void(0)" className="text-sm ml-4">
                            <strong>+158 996 888</strong>
                        </a>
                    </li>
                </ul>
            </div>

        </>
    )
}

export default ContactInfo
