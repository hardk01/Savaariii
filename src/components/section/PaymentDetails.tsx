"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

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

export interface AuthTokenPayload {
    userId: string;
    fullName?: string;
    name?: string;
    email: string;
    phone: string;
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

const PaymentDetails = () => {
    const router = useRouter()
    const [userFormData, setUserFormData] = useState<UserFormData | any>(null);
    const [userCarData, setUserCarData] = useState<Car | any>(null);
    const [user, setUser] = useState<user>()
    const [couponCode, setCouponCode] = useState("");
    // const [paymentId, setPaymentId] = useState();
    const [selectedDiscount, setSelectedDiscount] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
    const [finalPayableAmount, setFinalPayableAmount] = useState<number | null>(null);
    const [discountAmount, setDiscountAmount] = useState<number | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedSelectedCars = localStorage.getItem("selectedCarsInfo");
            if (storedSelectedCars) {
                const parsedCarData = JSON.parse(storedSelectedCars);
                setUserCarData(parsedCarData);
                setDiscountedPrice(parsedCarData.price);
                setFinalPayableAmount(parsedCarData.price);
                setDiscountAmount(0);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedFormData = localStorage.getItem("formDataObj");
            if (storedFormData) {
                setUserFormData(JSON.parse(storedFormData));
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserInfo = localStorage.getItem("userInfoObj");
            if (storedUserInfo) {
                setUser(JSON.parse(storedUserInfo));
            }
        }
    }, []);

    // useEffect(() => {
    //     const storedData = localStorage.getItem('userInfoObj');
    //     if (storedData) {
    //         setEmailId(JSON.parse(storedData));
    //     }
    // }, []);

    // useEffect(() => {
    //     const storedData = localStorage.getItem("selectedCarsInfo");
    //     const existingSelectedCars = JSON.parse(localStorage.getItem("selectedAllData") || "[]");
    //     if (storedData) {
    //         const parsedCarInfo = JSON.parse(storedData);

    //         if (emailId?.email) {
    //             const updatedCarInfo = {
    //                 ...parsedCarInfo,
    //                 ['email']: emailId.email,
    //             };
    //             const updatedSelectedCars: any = [...existingSelectedCars, updatedCarInfo];
    //             localStorage.setItem("selectedAllData", JSON.stringify(updatedSelectedCars));
    //         }
    //     }
    // }, [emailId]);

    // useEffect(() => {
    //     const storedSelectedCars = localStorage.getItem("selectedCarsInfo");
    //     if (storedSelectedCars) {
    //         setUserCarData(JSON.parse(storedSelectedCars));
    //     }
    // }, []);

    // payment 

    // useEffect(() => {
    //     const storedSelectedCars = localStorage.getItem("selectedCarsInfo");
    //     if (storedSelectedCars) {
    //         setCarDetails(JSON.parse(storedSelectedCars));
    //     }
    // }, []);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    let userId: string | undefined;
    let fullName: string | undefined;
    let email: string | undefined;
    let phone: string | undefined;

    if (token) {
        const decoded: AuthTokenPayload = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        userId = decoded.userId;
        fullName = decoded.fullName || decoded.name; // Use the correct field
        email = decoded.email;
        phone = decoded.phone;
    }

    if (!userId) {
        return;
    }

    const handleDiscountChange = (discount: number) => {
        setSelectedDiscount(discount);

        if (discountedPrice !== null) {
            const payable = discountedPrice * (discount / 100);
            setFinalPayableAmount(payable);
        }
    };

    const applyCoupon = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/coupons/${couponCode}`);

            if (!response.ok) {
                throw new Error("Invalid coupon code");
            }

            const data = await response.json();
            const discount = data.data.discount;

            if (userCarData && discount !== null) {
                const discountAmount = (userCarData.price * discount) / 100;
                const updatedPrice = userCarData.price - discountAmount;

                setDiscountAmount(discountAmount);
                setDiscountedPrice(updatedPrice);
                setFinalPayableAmount(updatedPrice * (selectedDiscount / 100));
            }
        } catch (error) {
            console.error("Error applying coupon:", error);
            if (userCarData) {
                setDiscountAmount(0);
                setDiscountedPrice(userCarData.price);
                setFinalPayableAmount(userCarData.price * (selectedDiscount / 100));
            }
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const storePaymentData = async (paymentMethod: "cod" | "online"): Promise<string | null> => {
        // const paymentData = {
        //     initialPrice: userCarData.price,
        //     discountedPrice: discountedPrice,
        //     finalPayableAmount: finalPayableAmount,
        //     couponCode: couponCode,
        //     selectedDiscount: selectedDiscount,
        //     paymentMethod: paymentMethod,
        //     id: paymentId,
        // };

        const bookingData = {
            userId: userId,
            bookingType: userFormData.bookingType,
            totalAmount: userCarData.price,
            CityRouteFareid: userCarData._id,
            from: userCarData?.from,
            to: userCarData?.to,
            pickupdate: userFormData?.pickUpDate,
            returnDate: userFormData?.returnDate,
            pickuptime: userFormData?.pickUpTime,
            pickupAddress: userFormData?.pickupAddress,
            dropAddress: userFormData?.dropAddress,
            trip: userFormData?.trip,
            fullname: fullName || user?.name,
            email: email || user?.email,
            phoneno: phone || user?.phoneNumber,
            pic: userCarData?.from,
            drop: userCarData?.to,
            status: "pending",
            paymentMethod: paymentMethod,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/cab-bookings/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                throw new Error("Failed to create booking.");
            }

            const data = await response.json();

            if (data.data._id) {
                return data.data._id;
            } else {
                console.error("Booking ID (_id) not found in the response.");
                return null;
            }
        } catch (error) {
            console.error("Error creating booking:", error);
            return null;
        }
    };

    const proceedToPayment = async () => {
        const paymentMethod = selectedDiscount === 0 ? "cod" : "online";

        if (paymentMethod === "cod") {
            const bookingId = await storePaymentData("cod");

            if (!bookingId) {
                alert("Missing booking ID. Cannot proceed.");
                return;
            }

            try {
                await updateBooking(bookingId, paymentMethod);
                router.push(`/payment-details?bookingId=${bookingId}`);
            } catch (error) {
                console.error("Error handling COD booking:", error);
                alert("Failed to process COD booking. Please try again.");
            }
            return;
        }

        const bookingId = await storePaymentData("online");

        if (!bookingId) {
            alert("Missing booking ID. Cannot proceed.");
            return;
        }

        const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/payments/create-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                bookingId: bookingId,
                amount: finalPayableAmount,
            }),
        });

        if (!orderResponse.ok) {
            throw new Error("Failed to create Razorpay order.");
        }

        const orderData = await orderResponse.json();

        const razorpayOrderId = orderData.payment.orderId;

        try {
            const isRazorpayLoaded = await loadRazorpayScript();
            if (!isRazorpayLoaded) {
                alert("Failed to load Razorpay SDK. Please try again.");
                return;
            }
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: Math.round(finalPayableAmount! * 100),
                currency: "INR",
                name: "Car Payment",
                description: "Partial or Full Payment",
                order_id: razorpayOrderId,
                handler: async function (response: any) {
                    const razorpayPaymentId = response.razorpay_payment_id;
                    const razorpayOrderId = response.razorpay_order_id;
                    const razorpaySignature = response.razorpay_signature;

                    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
                        return;
                    }
                    // setPaymentId(razorpayPaymentId);
                    await verifyPayment(
                        razorpayOrderId,
                        razorpayPaymentId,
                        razorpaySignature,
                        bookingId,
                        "online",
                        response,
                        finalPayableAmount
                    );
                },
                prefill: {
                    name: fullName || user?.name || "John Doe",
                    email: email || user?.email || "john.doe@example.com",
                    contact: phone || user?.phoneNumber || "9999999999",
                },
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on("payment.failed", function (response: any) {
                alert(`Payment failed! Reason: ${response.error.description}`);
            });
            rzp.open();
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    const updateBooking = async (bookingId: string, paymentMethod: string) => {
        const token = localStorage.getItem("token");

        if (!bookingId || !paymentMethod) {
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/cab-bookings/${bookingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    totalAmount: userCarData.price,
                    paymentMethod: paymentMethod,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update booking.");
            }
        } catch (error) {
            console.error("Error updating booking:", error);
            alert("Failed to update booking. Please try again.");
        }
    };

    const verifyPayment = async (
        orderId: string, paymentId: string, signature: string, bookingId: string, paymentMethod: any, paymentDetails: any, finalPayableAmount: number | null,) => {

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/payments/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    orderId,
                    paymentId,
                    signature,
                    bookingId,
                    paymentMethod,
                    paymentDetails,
                    amount: finalPayableAmount
                }),
            });

            if (!response.ok) {
                throw new Error("Payment verification failed.");
            }
            router.push(`/payment-details?bookingId=${bookingId}`);
        } catch (error) {
            console.error("Error verifying payment:", error);
            // alert("Payment verification failed. Please contact support.");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <>
            <section className="section-cta-6 background-body py-96">
                <div className="box-cta-6">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-5">
                                <span className="btn btn-signin bg-2 text-dark mb-4 wow fadeInUp">Payment</span>
                                <div className="row pt-3 pb-4">
                                    <div className="col-md-5 col-8 d-flex flex-column gap-1">
                                        <p className="text-sm-bold neutral-1000">Itinerary :</p>
                                        <p className="text-sm-bold neutral-1000">Pickup Date :</p>
                                        <p className="text-sm-bold neutral-1000">Car Type :</p>
                                        <p className="text-sm-bold neutral-1000">KMs Included :</p>
                                        <p className="text-sm-bold neutral-1000">Initial Price :</p>
                                        <p className="text-sm-bold neutral-1000">Discounted Price :</p>
                                        <p className="text-sm-bold neutral-1000">Payable Amount :</p>
                                    </div>
                                    <div className="col-md-7 col-4 d-flex flex-column gap-1 align-items-end align-items-md-start">
                                        <p className="text-sm-bold neutral-1000">{userFormData?.from} {">"} {userFormData?.to}</p>
                                        <p className="text-sm-bold neutral-1000">{userFormData?.pickUpDate ? formatDate(userFormData.pickUpDate) : ""} {" > "} {userFormData?.pickUpTime}</p>
                                        <p className="text-sm-bold text-primary-dark">{userCarData?.selectedCar}</p>
                                        <p className="text-sm-bold text-primary-dark">{userCarData?.distance?.toFixed(0)} km</p>
                                        <p className="text-sm-bold neutral-1000">₹{userCarData?.price}</p>
                                        <p className="text-sm-bold text-primary-dark">₹{discountAmount !== null ? discountAmount.toFixed(2) : "Loading..."}</p>
                                        <p className="text-sm-bold text-primary-dark">₹{finalPayableAmount !== null ? finalPayableAmount : "Loading..."}</p>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="text-sm-medium neutral-1000">Apply Coupon</label>
                                        <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                                            <input
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                className="form-control"
                                                type="text"
                                                placeholder="Enter Coupon Code"
                                                style={{ paddingRight: "2rem" }}
                                            />
                                            <svg
                                                onClick={applyCoupon}
                                                width={17}
                                                height={16}
                                                viewBox="0 0 17 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                style={{
                                                    position: "absolute",
                                                    right: "10px",
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    color: "#666",
                                                    cursor: "pointer",
                                                }}>
                                                <path
                                                    d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="pricing-options">
                                        {["0", "25", "50", "100"].map((option, index) => (
                                            <label
                                                className={`plan-card ${selectedDiscount === Number(option) ? "active" : ""}`}
                                                key={index}
                                                onClick={() => handleDiscountChange(Number(option))}
                                            >
                                                <input
                                                    type="radio"
                                                    name="plan"
                                                    value={option}
                                                    checked={selectedDiscount === Number(option)}
                                                    onChange={() => handleDiscountChange(Number(option))}
                                                />
                                                <div className="plan-content">
                                                    <div className="plan-price">
                                                        <strong>{option}%</strong> <span>Pay</span>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                        <style>{`
          .pricing-options {
            display: flex;
            gap: 1rem;
            padding: 1.5rem 0px;
            border-radius: 10px;
            justify-content: center;
          }

          .plan-card {
            background: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: box-shadow 0.3s ease, border-color 0.3s ease;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
            position: relative;
          }

          .plan-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .plan-card input[type="radio"] {
            appearance: none;
            -webkit-appearance: none;
            height: 16px;
            width: 16px;
            border: 2px solid #ccc;
            border-radius: 50%;
            position: absolute;
            top: 12px;
            right: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .plan-card input[type="radio"]:checked {
            border-color: #28a745;
            background-color: #28a745;
          }

          .plan-card.active {
            border-color: #28a745;
            box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
          }

          .plan-content {
            text-align: left;
          }

          .plan-title {
            font-weight: bold;
            margin-bottom: 0.25rem;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
          }

          .plan-price {
            font-size: 1rem;
            color: #333;
          }

          .plan-price strong {
            font-size: 1.2rem;
          }

          .plan-price span {
            color: #888;
            font-size: 0.9rem;
}`}</style>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <button onClick={proceedToPayment} className="btn btn-book">
                                        {selectedDiscount === 0 ? "Pay on Delivery" : "Proceed to Payment"}
                                        <svg width={17} height={16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-6 offset-lg-1 position-relative z-1 mt-lg-0 mt-4">
                                <div className="position-relative">
                                    <div className="row align-items-center">
                                        <div className="col-sm-6">
                                            <img className="bdrd8 w-100 mb-15 wow fadeInUp" src="/assets/imgs/cta/cta-6/img-1.png" alt="Carento" />
                                            <img className="bdrd8 w-100 mb-15 wow fadeInUp" src="/assets/imgs/cta/cta-6/img-2.png" alt="Carento" />
                                        </div>
                                        <div className="col-sm-6 mt-md-50">
                                            <img className="bdrd8 w-100 mb-15 wow fadeInUp" src="/assets/imgs/cta/cta-6/img-3.png" alt="Carento" />
                                            <img className="bdrd8 w-100 wow fadeInUp" src="/assets/imgs/cta/cta-6/img-4.png" alt="Carento" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-overlay position-absolute bottom-0 end-0 h-75 background-brand-2 opacity-25 z-0 rounded-start-pill" />
                </div>
            </section>
        </>
    )
}

export default PaymentDetails
