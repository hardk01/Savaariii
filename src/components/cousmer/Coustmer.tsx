'use client'
import React, { useEffect, useState } from 'react'

interface user {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    postCode: number
  }

const Coustmer = () => {
    const [formData, setFormData] = useState<user[]>([])
    useEffect(() => {
        const storedData = localStorage.getItem('users');
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }
    }, []);
    return (
        <div>
            <div className="max-w-3xl mx-auto mt-10">
                <h2 className="text-xl font-semibold mb-4">Coustmer Details</h2>
                {formData.map((data, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
                        <h3 className="text-lg font-bold">No.{index + 1}</h3>
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Full Name: </span>{data.firstName} {" "} {data.lastName}</p>
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Email: </span>{data.email}</p>
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Phone Number: </span>{data.phoneNumber}</p>
                        <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Post Code: </span>{data.postCode}</p>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Coustmer
