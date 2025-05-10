"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface user {
    name: string;
    email: string;
    phoneNumber: string;
}

interface paymentData {
    discountedPrice: string;
    finalPayableAmount: string;
}

interface userFormData {
    pickUpDate: string;
    pickUpTime: string;
    city: string;
    returnDate: string;
    price: string;
}

interface paymentData {
    selectedCar: string;
    cityFrom: string;
    cityTo: string;
    distance: string;
    price: string;
}

const Payment = () => {
    const router = useRouter()
    const [paymentData, setPaymentData] = useState<paymentData>();
    const [userFormData, setUserFormData] = useState<userFormData>();
    const [carDetails, setCarDetails] = useState<paymentData>()
    const [user, setUser] = useState<user>()

    useEffect(() => {
        const storedSelectedCars = localStorage.getItem("selectedCarsInfo");
        if (storedSelectedCars) {
            setCarDetails(JSON.parse(storedSelectedCars));
        }
    }, []);

    useEffect(() => {
        const storedSelectedCars = localStorage.getItem("payment");
        if (storedSelectedCars) {
            setPaymentData(JSON.parse(storedSelectedCars));
        }
    }, []);

    useEffect(() => {
        const storedSelectedCars = localStorage.getItem("formDataObj");
        if (storedSelectedCars) {
            setUserFormData(JSON.parse(storedSelectedCars));
        }
    }, []);

    useEffect(() => {
        const storedSelectedCars = localStorage.getItem("userInfoObj");
        if (storedSelectedCars) {
            setUser(JSON.parse(storedSelectedCars));
        }
    }, []);

    const saveOrderDetails = () => {
        const orderDetails = {
            name: user?.name,
            email: user?.email,
            phoneNumber: user?.phoneNumber,
            selectedCar: carDetails?.selectedCar,
            from: carDetails?.cityFrom,
            to: carDetails?.cityTo,
            distance: carDetails?.distance,
            price: carDetails?.price,
            city: userFormData?.city,
            pickUpDate: userFormData?.pickUpDate,
            pickUpTime: userFormData?.pickUpTime,
            returnDate: userFormData?.returnDate,
            discountedPrice: paymentData?.discountedPrice,
            finalPayableAmount: paymentData?.finalPayableAmount,
        };

        // Retrieve existing orders from localStorage
        const existingOrders = localStorage.getItem("orderHistory");
        const orders = existingOrders ? JSON.parse(existingOrders) : [];

        // Add the new order
        orders.push(orderDetails);

        // Save back to localStorage
        localStorage.setItem("orderHistory", JSON.stringify(orders));

        router.push('/deshboard')
    };

    return (
        <>
            <div className='min-h-screen bg-gray-100'>
                <div className="max-w-3xl mx-auto mt-10">
                    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                        <h3 className="text-lg font-bold">No.</h3>
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Name: </span>{user?.name}</p>
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Email: </span>{user?.email}</p>
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Contact Number: </span> {user?.phoneNumber}</p>
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Car: </span> {carDetails?.selectedCar}</p>
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">City: </span> {carDetails?.cityFrom} {">"} {carDetails?.cityTo}</p>
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Distance: </span>{carDetails?.distance}</p>
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">PICK UP Date: </span>{userFormData?.pickUpDate}</p>
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">PICK UP Time: </span>{userFormData?.pickUpTime}</p>
                        {userFormData?.city && (
                            <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">City: </span>{userFormData?.city}</p>
                        )}
                        {userFormData?.returnDate && (
                            <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Return Date: </span>{userFormData?.returnDate}</p>
                        )}
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Rate: </span>{carDetails?.price}₹</p>
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Cash On Pay: </span>{paymentData?.discountedPrice}₹</p>
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Online Payment : </span>{paymentData?.finalPayableAmount}₹</p>
                    </div>
                    <button onClick={saveOrderDetails} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Place Order
                    </button>
                </div>

            </div>

        </>
    )
}

export default Payment
