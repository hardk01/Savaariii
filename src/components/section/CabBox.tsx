"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from "next/navigation";

type UserFormData = {
    to: any;
    from: any;
    cityFrom?: string;
    cityTo?: string;
    pickUpDate?: string;
    pickUpTime?: string;
    returnDate?: string;
    pickupAddress?: string;
    city?: string;
};

type RouteFare = {
    _id: string;
    car: string;
    price: number;
    distance: number;
    from: string;
    to: string;
};

type Booking = {
    _id: any;
    car: any;
    to: any;
    from: any;
    cityFrom: string;
    cityTo: string;
    selectedCar: string;
    price: number;
    distance: number;
};

const CabBox = () => {
    const router = useRouter()
    const [userFormData, setUserFormData] = useState<UserFormData | null>(null);
    const [filteredData, setFilteredData] = useState<RouteFare[]>([]);
    const searchParams = useSearchParams();
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    useEffect(() => {
        const fetchBookings = async () => {
            if (!from || !to) {
                console.error("Missing `from` or `to` parameters.");
                return;
            }

            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}v1/cityroutefares?from=${from}&to=${to}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch booking data.");
                }

                const result = await response.json();
                const allData: RouteFare[] = result.data;
                // Filter data where `from` and `to` match exactly
                const filtered = allData.filter(
                    (item) => item.from === from && item.to === to
                );

                setFilteredData(filtered);
            } catch (error) {
                console.error("Error fetching booking data:", error);
            }
        };

        fetchBookings();
    }, [from, to]);

    // useEffect(() => {
    //     const storedSelectedCars = localStorage.getItem("formDataObj");
    //     if (storedSelectedCars) {
    //         const parsedData = JSON.parse(storedSelectedCars);
    //         setUserFormData(parsedData);

    //         if (carData && Array.isArray(carData)) {
    //             const filteredCabs = carData.filter(
    //                 (cab: any) => cab.from === parsedData.from && cab.to === parsedData.to
    //             );
    //             setFilteredData(filteredCabs);
    //         }
    //     }
    // }, [carData]);

    useEffect(() => {
        const storedSelectedCars = localStorage.getItem("formDataObj");
        if (storedSelectedCars) {
            const parsedData = JSON.parse(storedSelectedCars);
            setUserFormData(parsedData);
        }
    }, []);

    const handleSelect = (booking: Booking) => {

        const carWithDetails: any = {
            _id: booking._id,
            from: booking.from,
            to: booking.to,
            selectedCar: booking.car,
            price: booking.price,
            distance: booking.distance,
        };

        localStorage.setItem("selectedCarsInfo", JSON.stringify(carWithDetails))
        router.push("/user-contact");
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <section className="box-section box-search-advance-home10 background-100">
            <div className="container">
                <div className="box-search-advance background-card wow fadeIn">
                    <div className="box-top-search">
                        <div style={{
                            display: "flex", gap: "38px"
                        }} className="left-top-search">
                            <span
                                className={`category-span text-sm-bold btn-click`}
                            >
                                City : {userFormData?.from} {">"} {userFormData?.to}
                            </span>
                            <span
                                className={`category-span text-sm-bold btn-click`}

                            >
                                Date : {userFormData?.pickUpDate ? formatDate(userFormData.pickUpDate) : ""}
                            </span>
                            <span
                                className={`category-span text-sm-bold btn-click`}

                            >
                                Time : {userFormData?.pickUpTime}
                            </span>
                            <span
                                className={`category-span text-sm-bold btn-click`}>
                                {userFormData?.returnDate && (
                                    <span>Return Date : {userFormData?.returnDate ? formatDate(userFormData.returnDate) : ""}</span>
                                )}
                            </span>
                        </div>
                    </div>
                    {filteredData.map((item: any, index: number) => (
                        <div key={index} className="box-bottom-search background-card">
                            <div className="item-search bd-none">
                                <div className="dropdown">
                                    <img
                                        width={80}
                                        height={60}
                                        src={item.carImage} alt="Car" />
                                </div>
                            </div>
                            <div className="item-search">
                                <div className="dropdown">
                                    <div className="text-sm-bold neutral-500">{item.car}</div>

                                </div>
                            </div>
                            <div className="item-search">
                                <div className="dropdown">
                                    {/* <img src='/assets/imgs/car/certified.png' alt='' /> */}
                                    <div className="text-sm-bold neutral-500">Top Rated Cabs</div>
                                </div>
                            </div>
                            <div className="item-search item-search-2">
                                <div className="dropdown">
                                    {/* <img src='/assets/imgs/car/certified.png' alt='' /> */}
                                    <div className="text-sm-bold neutral-500">₹240 Toll </div>
                                </div>
                            </div>
                            <div className="item-search item-search-3">
                                <div className="dropdown">

                                    <div className="text-sm-bold neutral-500">{item.price}</div>
                                </div>
                            </div>
                            <div className="item-search bd-none">

                                <div className="dropdown">

                                    <div className="text-sm-bold neutral-500">{item.distance}</div>
                                </div>
                            </div>

                            <div className="item-search bd-none d-flex justify-content-end">
                                <button onClick={() => handleSelect(item)} className="btn btn-brand-2 text-nowrap">
                                    Select
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CabBox
