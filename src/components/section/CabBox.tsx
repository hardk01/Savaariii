"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

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
    const [filteredData, setFilteredData] = useState<{ _id: string; car: string; price: number; distance: number }[]>([]);

useEffect(() => {
    const storedData = localStorage.getItem("cabResults");
    const storedFormData = localStorage.getItem("formDataObj");

    if (storedData && storedFormData) {
        try {
            const parsedData = JSON.parse(storedData);
            const formData = JSON.parse(storedFormData);

            // Filter cabs based on the selected route (from and to)
            const filteredCabs = parsedData.filter(
                (cab: any) => cab.from === formData.from && cab.to === formData.to
            );

            setFilteredData(filteredCabs);
            setUserFormData(formData);
        } catch (error) {
            console.error("Error parsing data from localStorage:", error);
            setFilteredData([]);
        }
    } else {
        setFilteredData([]);
    }
}, []);


    useEffect(() => {
        const storedSelectedCars = localStorage.getItem("formDataObj");
        if (storedSelectedCars) {
            const parsedData = JSON.parse(storedSelectedCars);
            setUserFormData(parsedData);
        }
    }, []);

    // useEffect(() => {
    //     if (filteredData && Array.isArray(filteredData) && filteredData.length > 0) {
    //         const id = filteredData[0]._id;
    //         if (id) {
    //             localStorage.setItem("selectedCarId", id);
    //         }
    //     }
    // }, [filteredData]);

    const handleSelect = (booking: Booking) => {

        const carWithDetails: any = {
            from: booking.from,
            to: booking.to,
            selectedCar: booking.car,
            price: booking.price,
            distance: booking.distance,
        };

        const existingCars = JSON.parse(localStorage.getItem('selectedCars') || '[]');
        const updatedSelectedCars = [...existingCars, carWithDetails];
        localStorage.setItem('selectedCars', JSON.stringify(updatedSelectedCars));
        localStorage.setItem("selectedCarsInfo", JSON.stringify(carWithDetails))
        router.push("/user-contact");

    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
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
