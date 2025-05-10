"use client"
import React, { useEffect, useState } from 'react'
import CounterUp from '../elements/CounterUp'
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export interface AuthTokenPayload {
    userId: string;
    iat?: number;
    exp?: number;
}

interface user {
    name: string;
    email: string;
    phoneNumber: string;
    pickUp: string;
    drop: string
}

interface paymentData {
    amount: any;
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
    from: string;
    to: string;
    distance: string;
    price: string;
    paymentMethod?: string;
}

const UserPaymentDetails = () => {
    const router = useRouter()
    const [paymentData, setPaymentData] = useState<paymentData>();
    const [userFormData, setUserFormData] = useState<userFormData>();
    const [carDetails, setCarDetails] = useState<paymentData>()
    const [user, setUser] = useState<user>()
    const [cabId, setCabId] = useState<{ userId: string } | null>(null)


    useEffect(() => {
        const storedSelectedCars = localStorage.getItem("selectedCarsInfo");
        if (storedSelectedCars) {
            setCarDetails(JSON.parse(storedSelectedCars));
        }
    }, []);

    useEffect(() => {
        const storedSelectedCars = localStorage.getItem("cabResults");
        if (storedSelectedCars) {
            setCabId(JSON.parse(storedSelectedCars));
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

    const saveOrderDetails = async () => {
        router.push("thankyou")
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <>

            <section className="box-cta-2 background-body overflow-hidden py-96">
                <div className="bg-shape top-50 start-50 translate-middle" />
                <div className="container position-relative z-1">
                    <div className="row ">
                        <div className="col-lg-5 pe-lg-5 ">
                            <h3 className="text-white wow fadeInDown">Car Payment Details</h3>
                            <p className="text-lg-medium text-white wow fadeInUp">Match with up to 4 lenders to get the lowest
                                rate available with no markups, no fees, and no obligations.</p>
                        </div>
                        <div className="col-lg-6 offset-lg-1">
                            <div className="mb-30 background-card p-md-5 p-4 rounded-3 mt-lg-0 mt-30 wow fadeIn">
                                <h5 className="neutral-1000 mb-2">Your Payment Details</h5>
                                <div className="form-contact">
                                    <div className="row">
                                        <div className="row py-4">
                                            <div className="col-md-5 col-8 d-flex flex-column gap-1">
                                                <p className="text-sm-bold neutral-1000">Name :</p>
                                                <p className="text-sm-bold neutral-1000">Email :</p>
                                                <p className="text-sm-bold neutral-1000">Contact Number :</p>
                                                <p className="text-sm-bold neutral-1000">Car :</p>
                                                <p className="text-sm-bold neutral-1000">City :</p>
                                                <p className="text-sm-bold neutral-1000">Distance :</p>
                                                <p className="text-sm-bold neutral-1000">PICK UP Date :</p>
                                                <p className="text-sm-bold neutral-1000">PICK UP Time :</p>
                                                {userFormData?.city && (
                                                    <p className="text-sm-bold neutral-1000">City :</p>
                                                )}
                                                {userFormData?.returnDate && (
                                                    <p className="text-sm-bold neutral-1000">Return Date :</p>
                                                )}
                                                <p className="text-sm-bold neutral-1000">Rate :</p>
                                                <p className="text-sm-bold neutral-1000">Payment Amount :</p>
                                            </div>
                                            <div className="col-md-7 col-4 d-flex flex-column gap-1 align-items-end align-items-md-start">
                                                <p className="text-sm-bold neutral-1000">{user?.name}</p>
                                                <p className="text-sm-bold neutral-1000">{user?.email}</p>
                                                <p className="text-sm-bold neutral-1000">{user?.phoneNumber}</p>
                                                <p className="text-sm-bold neutral-1000">{carDetails?.selectedCar}</p>
                                                <p className="text-sm-bold neutral-1000">{carDetails?.from} {">"} {carDetails?.to}</p>
                                                <p className="text-sm-bold neutral-1000">{carDetails?.distance}</p>
                                                <p className="text-sm-bold neutral-1000">{userFormData?.pickUpDate ? formatDate(userFormData.pickUpDate) : ""}</p>
                                                <p className="text-sm-bold neutral-1000">{userFormData?.pickUpTime}</p>
                                                {userFormData?.city && (
                                                    <p className="text-sm-bold neutral-1000">{userFormData?.city}</p>
                                                )}
                                                {userFormData?.returnDate && (
                                                    <p className="text-sm-bold neutral-1000">{userFormData?.returnDate ? formatDate(userFormData.returnDate) : ""}</p>
                                                )}
                                                <p className="text-sm-bold text-primary-dark">{carDetails?.price}₹</p>
                                                {/* Conditionally render payment amount */}
                                                {paymentData?.paymentMethod === "online" ? (
                                                    <p className="text-sm-bold text-primary-dark">{paymentData?.finalPayableAmount}₹ (Online Payment)</p>
                                                ) : (
                                                    <p className="text-sm-bold text-primary-dark">{carDetails?.price}₹ (COD)</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <button onClick={saveOrderDetails} className="btn btn-book">
                                                Place Order
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
                    <div className="row align-items-center">
                        <div className="border-top py-3 mt-3" />
                        <div className="col-lg-7 mb-20 wow fadeIn">
                            <div className="row">
                                <div className="col-md-3 col-6 mb-md-0 mb-4 d-flex flex-column align-items-center align-items-md-start">
                                    <div className="d-flex justify-content-center justify-content-md-start">
                                        <h3 className="count text-white"><CounterUp count={45} /></h3>
                                        <h3 className="text-white">+</h3>
                                    </div>
                                    <div className="position-relative">
                                        <p className="text-lg-bold text-white">Global</p>
                                        <p className="text-lg-bold text-white">Branches</p>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6 mb-md-0 mb-4 d-flex flex-column align-items-center align-items-md-start">
                                    <div className="d-flex justify-content-center justify-content-md-start">
                                        <h3 className="count text-white"><CounterUp count={29} /></h3>
                                        <h3 className="text-white">K</h3>
                                    </div>
                                    <div className="position-relative">
                                        <p className="text-lg-bold text-white">Destinations</p>
                                        <p className="text-lg-bold text-white">Collaboration</p>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6 mb-md-0 mb-4 d-flex flex-column align-items-center align-items-md-start">
                                    <div className="d-flex justify-content-center justify-content-md-start">
                                        <h3 className="count text-white"><CounterUp count={20} /></h3>
                                        <h3 className="text-white">+</h3>
                                    </div>
                                    <div className="position-relative">
                                        <p className="text-lg-bold text-white">Years</p>
                                        <p className="text-lg-bold text-white">Experience</p>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6 mb-md-0 mb-4 d-flex flex-column align-items-center align-items-md-start">
                                    <div className="d-flex justify-content-center justify-content-md-start">
                                        <h3 className="count text-white"><CounterUp count={168} /></h3>
                                        <h3 className="text-white">K</h3>
                                    </div>
                                    <div className="position-relative">
                                        <p className="text-lg-bold text-white">Happy</p>
                                        <p className="text-lg-bold text-white">Customers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 offset-lg-1 wow fadeIn">
                            <div className="box-authors-partner background-body wow fadeInUp p-4">
                                <div className="authors-partner-left">
                                    <img src="/assets/imgs/page/homepage5/author.png" alt="Carento" /><img src="/assets/imgs/page/homepage5/author2.png" alt="Carento" /><img src="/assets/imgs/page/homepage5/author3.png" alt="Carento" />
                                    <span className="item-author">
                                        <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.5" y="7.448" width={17} height="2.31818" fill="black" />
                                            <rect x="7.84082" y="17.1072" width={17} height="2.31818" transform="rotate(-90 7.84082 17.1072)" fill="black" />
                                        </svg>
                                    </span>
                                </div>
                                <div className="authors-partner-right">
                                    <p className="text-sm neutral-1000">1684 people used <strong>Carento </strong>in the last
                                        <strong>24 hours</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default UserPaymentDetails
