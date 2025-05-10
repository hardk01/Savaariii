// "use client"
// import { addCar } from '@/store/slice/CarSlice';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import Modal from '../modal/Modal';

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

// const Cars = () => {
//     const dispatch = useDispatch();
//     const router = useRouter()
//     const [showDetails, setShowDetails] = useState(false);
//     const [emailId, setEmailId] = useState<any>();
//     const [distance, setDistance] = useState<number | any>(null);
//     const [userFormData, setUserFormData] = useState<string | any>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [city1, setCity1] = useState<string>("");
//     const [city2, setCity2] = useState<string>("");
//     const [cities, setCities] = useState<City[]>([]);
//     const [formValues, setFormValues] = useState({
//         city1: city1,
//         city2: city2,
//         pickUpDate: "",
//         pickUpTime: "",
//         returnDate: "",
//         city: '',
//         pickupAddress: "",
//         dropAirport: "",
//     });
//     const [userInfo, setUserInfo] = useState({
//         name: "",
//         email: "",
//         phoneNumber: "",
//         pickUp: "",
//         drop: "",
//     });
//     const cars = [
//         { name: "Wagonr", rating: "Top Rated Cabs", toll: 330, pricePerKm: distance * 12, email: emailId?.email },
//         { name: "Toyota", rating: "Top Rated Cabs", toll: 238, pricePerKm: distance * 15, email: emailId?.email },
//         { name: "Ertiga", rating: "Top Rated Cabs", toll: 440, pricePerKm: distance * 11, email: emailId?.email },
//         { name: "Innova", rating: "Top Rated Cabs", toll: 130, pricePerKm: distance * 17, email: emailId?.email },
//     ];

//     useEffect(() => {
//         const fetchCities = async () => {
//             try {
//                 const response = await fetch("/api/cites");
//                 const data = await response.json();
//                 setCities(data);
//             } catch (error) {
//                 // setError("Failed to load city data");
//                 console.log(error);

//             }
//         };
//         fetchCities();
//     }, []);

//     useEffect(() => {
//         const storedData = localStorage.getItem('userInfoObj');
//         if (storedData) {
//             setEmailId(JSON.parse(storedData));
//         }
//     }, []);

//     useEffect(() => {
//         const storedSelectedCars = localStorage.getItem("formDataObj");
//         if (storedSelectedCars) {
//             const parsedData = JSON.parse(storedSelectedCars);
//             setUserFormData(parsedData);
//             setFormValues(parsedData);
//         }
//     }, []);
//     useEffect(() => {
//         const storedDistance = localStorage.getItem('distance');
//         if (storedDistance) {
//             setDistance(JSON.parse(storedDistance));
//         }
//     }, []);

//     const handleSelect = (car: any) => {
//         const existingSelectedCars = JSON.parse(localStorage.getItem("selectedCars") || "[]");
//         const carWithDetails = {
//             ...car,
//             distance: distance || 0,
//         };

//         const updatedSelectedCars: any = [...existingSelectedCars, carWithDetails];
//         dispatch(addCar(updatedSelectedCars));
//         // setSelectedCar(updatedSelectedCars);

//         localStorage.setItem("selectedCars", JSON.stringify(updatedSelectedCars));

//         localStorage.setItem("selectedCarsInfo", JSON.stringify(carWithDetails));


//         alert(`${car.name} selected!`);
//         // router.push("/contact");
//         setShowDetails(true);
//     };

//     const handleInputChange = (e: any) => {
//         const { name, value } = e.target;
//         setUserInfo((prevState) => ({
//             ...prevState,
//             [name]: value
//         }));
//     };

//     const handleSubmit = (event: React.FormEvent) => {
//         event.preventDefault();

//         const combinedData = {
//             ...userInfo,
//         };

//         const updatedUserInfoArray = [...(JSON.parse(localStorage.getItem('userInfoArray') || '[]')), combinedData];

//         localStorage.setItem('userInfoArray', JSON.stringify(updatedUserInfoArray));
//         localStorage.setItem('userInfoObj', JSON.stringify(combinedData));

//         setUserInfo({
//             name: "",
//             email: "",
//             phoneNumber: "",
//             pickUp: "",
//             drop: "",
//         });
//         router.push("/contact");

//     };

//     const handleInputChangeModal = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormValues((prev) => ({ ...prev, [name]: value }));
//     };

//     // Save data to localStorage and close modal
//     const handleSave = () => {
//         const dataToSend = {
//             city1,
//             city2,
//             formValues,
//         };
//         setUserFormData(dataToSend);
//         localStorage.setItem("formDataObj", JSON.stringify(dataToSend));
//         setIsModalOpen(false);
//     };
//     return (
//         <>
//             <h1>Savaari</h1>
//             {showDetails ? (
//                 <>
//                     {/* <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//                         <div
//                             style={{
//                                 display: "flex",
//                                 justifyContent: "space-around",
//                                 textAlign: "center",
//                                 border: "1px solid #ddd",
//                                 padding: "10px",
//                             }}>

//                             <div>
//                                 {userFormData?.city1 && (
//                                     <div>FORM: {userFormData?.city1}</div>
//                                 )}
//                                 {userFormData?.city2 && (
//                                     <div>TO: {userFormData?.city2}</div>
//                                 )}
//                                 {userFormData?.pickUpDate && (
//                                     <div>PICK UP DATE: {userFormData?.pickUpDate}</div>
//                                 )}
//                                 {userFormData?.pickUpTime && (
//                                     <div>PICK UP TIME: {userFormData?.pickUpTime}</div>
//                                 )}

//                                 {userFormData?.returnDate && (
//                                     <div>Return Date: {userFormData?.returnDate}</div>
//                                 )}
//                                 {userFormData?.pickupAddress && (
//                                     <div>PICK UP Address: {userFormData?.pickupAddress}</div>
//                                 )}
//                                 {userFormData?.city && (
//                                     <div>City: {userFormData?.city}</div>
//                                 )}
//                                 <button
//                                     style={{
//                                         padding: "10px 20px",
//                                         backgroundColor: "#0070f3",
//                                         color: "#fff",
//                                         border: "none",
//                                         borderRadius: "5px",
//                                         cursor: "pointer",
//                                     }}
//                                     onClick={() => setIsModalOpen(true)}
//                                 >
//                                     Edit Form Data
//                                 </button>
//                             </div>

//                         </div>
//                         {isModalOpen && (
//                             <Modal
//                                 formValues={formValues}
//                                 handleInputChangeModal={handleInputChangeModal}
//                                 setIsModalOpen={setIsModalOpen}
//                                 handleSave={handleSave}
//                                 setCity2={setCity2}
//                                 setCity1={setCity1}
//                                 city1={city1}
//                                 city2={city2}
//                                 cities={cities}
//                             />
//                         )}
//                     </div>
//                     <div>
//                         {cars.map((car: any, index: any) => (
//                             <div
//                                 key={index}
//                                 className="table"
//                                 style={{
//                                     display: "flex",
//                                     justifyContent: "space-around",
//                                     textAlign: "center",
//                                     margin: "60px 40px",
//                                     border: "1px solid #0000002e",
//                                     width: "auto",
//                                 }}
//                             >
//                                 <span>{car.name}</span>
//                                 <span>{car.rating}</span>
//                                 <span>{car.toll} Toll</span>
//                                 <span>{car.pricePerKm.toFixed(0)} Rate</span>
//                                 <span>{distance?.toFixed(0)} km</span>
//                                 <span>
//                                     <button onClick={() => handleSelect(car)}>Select</button>
//                                 </span>
//                             </div>
//                         ))}
//                     </div> */}
//                 </>
//             ) : (
//                 <div className="grid  gap-16 items-center relative overflow-hidden p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-3xl max-w-6xl mx-auto bg-white mt-4 font-[sans-serif] before:absolute before:right-0 before:h-full max-md:before:hidden">
//                     <form onSubmit={handleSubmit}>
//                         <div className="space-y-4 mt-8">
//                             <input
//                                 onChange={handleInputChange}
//                                 value={userInfo.name}
//                                 name="name"
//                                 type="text"
//                                 placeholder="Full Name"
//                                 required
//                                 className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
//                             />
//                             <input
//                                 onChange={handleInputChange}
//                                 value={userInfo.email}
//                                 name="email"
//                                 type="email"
//                                 placeholder="Email"
//                                 required
//                                 className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
//                             />
//                             <input
//                                 onChange={handleInputChange}
//                                 value={userInfo.phoneNumber}
//                                 name="phoneNumber"
//                                 type="number"
//                                 placeholder="Phone No."
//                                 required
//                                 className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
//                             />
//                             <input
//                                 onChange={handleInputChange}
//                                 value={userInfo.pickUp}
//                                 name="pickUp"
//                                 type="text"
//                                 placeholder="PICKUP"
//                                 required
//                                 className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
//                             />
//                             <input
//                                 onChange={handleInputChange}
//                                 value={userInfo.drop}
//                                 name="drop"
//                                 type="text"
//                                 placeholder="DROP"
//                                 required
//                                 className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
//                             />
//                             <button type="submit" className="mt-8 flex items-center justify-center text-sm w-full rounded-md px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white">
//                                 Submit
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             )}
//         </>
//     )
// }

// export default Cars
