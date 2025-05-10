"use client"
// import { getDiscountFromCoupon } from '@/utility/coupon';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


const UserPaymentMethod = ({ userCarData }: any) => {
    const router = useRouter();
    const [couponCode, setCouponCode] = useState("");
    const [paymentId, setPaymentId] = useState();
    const [selectedDiscount, setSelectedDiscount] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
    const [finalPayableAmount, setFinalPayableAmount] = useState<number | null>(null);

    useEffect(() => {
        if (userCarData) {
            setDiscountedPrice(userCarData.price);
            setFinalPayableAmount(userCarData.price);
        }
    }, [userCarData]);

    const handleDiscountChange = (discount: number) => {
        setSelectedDiscount(discount);
        setErrorMessage("");

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

            console.log(data.data, "data from coupon code");

            const discount = data.data.discount;

            if (userCarData && discount !== null) {
                const discountAmount = (userCarData.price * discount) / 100;
                const updatedPrice = userCarData.price - discountAmount;

                setDiscountedPrice(updatedPrice);
                setFinalPayableAmount(updatedPrice * (selectedDiscount / 100));
                setErrorMessage("");
            }
        } catch (error) {
            setErrorMessage("Invalid coupon code. Please try again.");
            if (userCarData) {
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

    const storePaymentData = async (paymentMethod: "cod" | "online") => {

        const token = localStorage.getItem("token");

        const paymentData = {
            initialPrice: userCarData.price,
            discountedPrice: discountedPrice,
            finalPayableAmount: finalPayableAmount,
            couponCode: couponCode,
            selectedDiscount: selectedDiscount,
            paymentMethod: paymentMethod,
            id: paymentId
        };

        // Save to localStorage (optional)
        const bookingId = localStorage.getItem("bookingId");

        if (!bookingId) {
            alert("Booking ID is missing. Cannot proceed.");
            return;
        }

        const existingData = JSON.parse(localStorage.getItem("paymentData") || "[]");
        const updatedData = [...existingData, paymentData];
        localStorage.setItem("payment", JSON.stringify(paymentData));
        localStorage.setItem("paymentData", JSON.stringify(updatedData));

        // Send to backend
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/cab-bookings/${bookingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                totalAmount: finalPayableAmount,
                paymentMethod: paymentMethod,
            }),
        });
    };

    const proceedToPayment = async () => {
        const paymentMethod = selectedDiscount === 0 ? "cod" : "online";

        if (paymentMethod === "cod") {
            await storePaymentData(paymentMethod);
            router.push("/payment-details");
            return;
        }

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
            handler: async function (response: any) {
                alert(`Payment successful! Razorpay ID: ${response.razorpay_payment_id}`);
                setPaymentId(response.razorpay_payment_id);
                await storePaymentData(paymentMethod); // send API call here
                router.push("/payment");
            },
            prefill: {
                name: "John Doe",
                email: "john.doe@example.com",
                contact: "9999999999",
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
    };

    return (
        <section className="box-cta-7 background-body py-96">
            <div className="container position-relative z-1">
                <div className="bg-shape" />
                <div className="row position-relative z-1">
                    <div className="col-lg-6 p-md-5 p-4">
                        <div className="background-card p-md-5 p-4 rounded-3 my-3">
                            <h5 className="neutral-1000 mb-2">Payment</h5>
                            <p className="text-sm-medium neutral-500 mb-25">Estimate your monthly auto loan payments with this calculator.</p>
                            <div className="form-contact">
                                <div className="row">
                                    <div className="row pt-3 pb-4">
                                        <div className="col-md-5 col-8 d-flex flex-column gap-1">
                                            <p className="text-sm-bold neutral-1000">Initial Price :</p>
                                            <p className="text-sm-bold neutral-1000">Discounted Price :</p>
                                            <p className="text-sm-bold neutral-1000">Payable Amount :</p>
                                        </div>
                                        <div className="col-md-7 col-4 d-flex flex-column gap-1 align-items-end align-items-md-start">
                                            <p className="text-sm-bold neutral-1000">₹{userCarData?.price}</p>
                                            <p className="text-sm-bold neutral-1000">₹{discountedPrice}</p>
                                            <p className="text-sm-bold text-primary-dark">₹{finalPayableAmount}</p>
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
                                                    }}
                                                >
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

                                            {/* Inline CSS */}
                                            <style>{`
          .pricing-options {
            display: flex;
            gap: 1rem;
            padding: 1.5rem;
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
                                    <div className="col-lg-12">
                                        <button onClick={proceedToPayment} className="btn btn-book">
                                            {selectedDiscount === 0 ? "Pay on Delivery" : "Proceed to Payment"}
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
            </div>

        </section>

    )
}

export default UserPaymentMethod
