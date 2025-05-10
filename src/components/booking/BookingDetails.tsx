// 'use client';
// import { useState } from 'react';
// import Script from 'next/script';


// function Payment() {
// const Amount = 1000;
// const [isProcessing, setIsProcessing] = useState(false)

// const handlePayment = async () => {
//   setIsProcessing(true)

//   try {
//     const response = await fetch("api/create-order", {method: 'POST'});
//     const data = await response.json();

//     const options = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//       amount: Amount * 100,
//       currency: "INR",
//       name: "STONE",
//       discription: "Test Transactions",
//       order_Id: data.orderId,
//        handler : function (response: any) {
//         console.log("succes", response);
//        },
//        prefill:  {
//         name: "hardik",
//         email: "hardik@gmail.com",
//         contact: "9999999999"
//        }
//     } 
//   } catch (err) {

//   }
// }
 
//  return (
//  <>
 
//  </>
//  );
// }

// export default Payment;

// // "use client"
// // import React, { useEffect, useState } from 'react'

// // interface Booking {
// //     cityFrom: string;
// //     cityTo: string;
// //     selectedCar: string;
// //     price: string;
// //     distance: number;
// // }

// // const BookingDetails = () => {
// //     const [formData, setFormData] = useState<Booking[]>([]);
// //     const [filteredData, setFilteredData] = useState<Booking[]>([]);
// //     const [cityFrom, setCityFrom] = useState<string>("");
// //     const [cityTo, setCityTo] = useState<string>("");

// //     console.log(filteredData, "filteredData");
    
    

// //     useEffect(() => {
// //         const storedData = localStorage.getItem("bookings");
// //         if (storedData) {
// //             setFormData(JSON.parse(storedData));
// //         }
// //     }, []);

// //     useEffect(() => {
// //         if (cityFrom && cityTo) {
// //             const filtered = formData.filter(
// //                 (booking) =>
// //                     booking.cityFrom === cityFrom && booking.cityTo === cityTo
// //             );
// //             setFilteredData(filtered);
// //         } else {
// //             setFilteredData([]);
// //         }
// //     }, [cityFrom, cityTo, formData]);



// //     return (
// //         <div>
// //             <div className="form-box">
// //                 <div>
// //                     <label htmlFor="city1">From</label>
// //                     <select
// //                         name="cityFrom"
// //                         value={cityFrom}
// //                         onChange={(e) => {
// //                             setCityFrom(e.target.value);
// //                             setCityTo(""); 
// //                         }}
// //                     >
// //                         <option value="">Select City</option>
// //                         {[...new Set(formData.map((item) => item.cityFrom))].map(
// //                             (city, index) => (
// //                                 <option key={index} value={city}>
// //                                     {city}
// //                                 </option>
// //                             )
// //                         )}
// //                     </select>
// //                 </div>

// //                 <div>
// //                     <label htmlFor="city2">To</label>
// //                     <select
// //                         name="cityTo"
// //                         value={cityTo}
// //                         onChange={(e) => setCityTo(e.target.value)}
// //                         disabled={!cityFrom} // Disable if no "From" city is selected
// //                     >
// //                         <option value="">Select City</option>
// //                         {[...new Set(
// //                             formData
// //                                 .filter((item) => item.cityFrom === cityFrom)
// //                                 .map((item) => item.cityTo)
// //                         )].map((city, index) => (
// //                             <option key={index} value={city}>
// //                                 {city}
// //                             </option>
// //                         ))}
// //                     </select>
// //                 </div>
// //                 <div>
// //                     <label>PICK UP DATE</label>
// //                     <input
// //                         type="date"
// //                         name="pickUpDate" />
// //                 </div>

// //                 <div>
// //                     <label>PICK UP TIME</label>
// //                     <input
// //                         type="time"
// //                         name="pickUpTime"
// //                     />
// //                 </div>
// //             </div>
// //         </div>
// //     )
// // }

// // export default BookingDetails
