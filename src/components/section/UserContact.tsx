"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const UserContact = () => {
    const router = useRouter()
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        pickUp: "",
        drop: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const combinedData = {
            ...userInfo,
        };

        localStorage.setItem('userInfoObj', JSON.stringify(combinedData));

        setUserInfo({
            name: "",
            email: "",
            phoneNumber: "",
            pickUp: "",
            drop: "",
        });
        router.push("/payment");

    };

    return (
        <>
            <section className="box-section box-contact-form background-body">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 mb-30">
                            <div className="form-contact">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label className="text-sm-medium neutral-1000">Full Name</label>
                                            <input name="name" value={userInfo.name} onChange={handleInputChange} className="form-control username" type="text" placeholder="Full Name" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label className="text-sm-medium neutral-1000">Email Adress</label>
                                            <input name="email" value={userInfo.email} onChange={handleInputChange} className="form-control email" type="email" placeholder="email@domain.com" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label className="text-sm-medium neutral-1000">Phone Number</label>
                                            <input name="phoneNumber" value={userInfo.phoneNumber} onChange={handleInputChange} className="form-control phone" type="text" placeholder="Phone number" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label className="text-sm-medium neutral-1000">Pick Up Address</label>
                                            <input name="pickUp" value={userInfo.pickUp} onChange={handleInputChange} className="form-control username" type="text" placeholder="Pick Up Address" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label className="text-sm-medium neutral-1000">Drop Address</label>
                                            <input name="drop" value={userInfo.drop} onChange={handleInputChange} className="form-control username" type="text" placeholder="Drop Address" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <button onClick={handleSubmit} className="btn btn-book">
                                            Send message
                                            <svg width={17} height={16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default UserContact
