import React, { useState, useEffect } from "react";
import { getDiscountFromCoupon } from "@/utility/coupon";
import { useRouter } from "next/navigation";

const PaymentComponent = ({ userCarData }: any) => {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentId, setPaymentId] = useState()
  const [selectedDiscount, setSelectedDiscount] = useState(0);
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

  const applyCoupon = () => {
    const discount = getDiscountFromCoupon(couponCode);
    if (userCarData && discount !== null) {
      const discountAmount = (userCarData.price * discount) / 100;
      const updatedPrice = userCarData.price - discountAmount;

      setDiscountedPrice(updatedPrice);
      setFinalPayableAmount(updatedPrice * (selectedDiscount / 100));
      setErrorMessage("");
    } else {
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

  const storePaymentData = () => {
    const paymentData = {
      initialPrice: userCarData.price,
      discountedPrice: discountedPrice,
      finalPayableAmount: finalPayableAmount,
      couponCode: couponCode,
      selectedDiscount: selectedDiscount,
      id: paymentId
    };

    // Fetch existing payment data from localStorage
    const existingData = JSON.parse(localStorage.getItem("paymentData") || "[]");

    // Add the new payment data
    const updatedData = [...existingData, paymentData];

    // Save back to localStorage
    localStorage.setItem("payment", JSON.stringify(paymentData));
    localStorage.setItem("paymentData", JSON.stringify(updatedData));
  };

  const proceedToPayment = async () => {
    if (selectedDiscount === 0) {
      storePaymentData();
      // Handle Cash Payment
      router.push("/payment"); 
      return;
    }

    const isRazorpayLoaded = await loadRazorpayScript();

    if (!isRazorpayLoaded) {
      alert("Failed to load Razorpay SDK. Please try again.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(finalPayableAmount! * 100), // Razorpay amount is in paise
      currency: "INR",
      name: "Car Payment",
      description: "Partial or Full Payment",
      handler: function (response: any) {
        alert(`Payment successful! Razorpay ID: ${response.razorpay_payment_id}`);
        setPaymentId(response.razorpay_payment_id)
        storePaymentData();
        router.push("/payment"); // Redirect to Thank You page
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
    <div>
      <h1>Payment</h1>
      {userCarData && (
        <>
          <p>Initial Price: ₹{userCarData.price}</p>
          <p>Discounted Price: ₹{discountedPrice}</p>
          <p>Payable Amount: ₹{finalPayableAmount}</p>
        </>
      )}

      <input
        type="text"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        placeholder="Enter Coupon Code"
      />
      <button onClick={applyCoupon}>Apply Coupon</button>

      <div>
        {["0", "25", "50", "100"].map((value) => (
          <label key={value}>
            <input
              type="radio"
              name="discount"
              value={value}
              checked={selectedDiscount === Number(value)}
              onChange={() => handleDiscountChange(Number(value))}
            />
            {value}% Pay
          </label>
        ))}
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <button onClick={proceedToPayment}>
        {selectedDiscount === 0 ? "Pay on Delivery" : "Proceed to Payment"}
      </button>
    </div>
  );
};

export default PaymentComponent;
