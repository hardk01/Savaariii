
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
  car: any;
  to: any;
  from: any;
  cityFrom: string;
  cityTo: string;
  selectedCar: string;
  price: number;
  distance: number;
};


const SelectedCars = ({ filteredData }: any) => {
  const router = useRouter()
  const [userFormData, setUserFormData] = useState<UserFormData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    pickUp: "",
    drop: "",
  });


  useEffect(() => {
    const storedSelectedCars = localStorage.getItem("formDataObj");
    if (storedSelectedCars) {
      const parsedData = JSON.parse(storedSelectedCars);
      setUserFormData(parsedData);
    }
  }, []);

  useEffect(() => {
    if (filteredData && Array.isArray(filteredData) && filteredData.length > 0) {
      const id = filteredData[0]._id;
      if (id) {
        localStorage.setItem("selectedCarId", id);
        console.log("Saved ID to localStorage:", id);
      }
    }
  }, [filteredData]);

  const handleSelect = (booking: Booking) => {
    const carWithDetails: any = {
      from: booking.from,
      to: booking.to,
      selectedCar: booking.car,
      price: booking.price,
      distance: booking.distance,
    };



    // Fetch existing cars from localStorage
    const existingCars = JSON.parse(localStorage.getItem('selectedCars') || '[]');

    // Append the new car
    const updatedSelectedCars = [...existingCars, carWithDetails];

    localStorage.setItem('selectedCars', JSON.stringify(updatedSelectedCars));
    localStorage.setItem("selectedCarsInfo", JSON.stringify(carWithDetails));

    alert(`${booking.car} selected!`);
    setShowDetails(true);

  };

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

    const updatedUserInfoArray = [...(JSON.parse(localStorage.getItem('userInfoArray') || '[]')), combinedData];

    localStorage.setItem('userInfoArray', JSON.stringify(updatedUserInfoArray));
    localStorage.setItem('userInfoObj', JSON.stringify(combinedData));

    setUserInfo({
      name: "",
      email: "",
      phoneNumber: "",
      pickUp: "",
      drop: "",
    });
    router.push("/contact");

  };
  return (
    <div>
      {!showDetails ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                textAlign: "center",
                border: "1px solid #ddd",
                padding: "10px",
              }}>

              <div>
                {userFormData?.from && (
                  <div>FORM: {userFormData?.from}</div>
                )}
                {userFormData?.to && (
                  <div>TO: {userFormData?.to}</div>
                )}
                {userFormData?.pickUpDate && (
                  <div>PICK UP DATE: {userFormData?.pickUpDate}</div>
                )}
                {userFormData?.pickUpTime && (
                  <div>PICK UP TIME: {userFormData?.pickUpTime}</div>
                )}

                {userFormData?.returnDate && (
                  <div>Return Date: {userFormData?.returnDate}</div>
                )}
                {userFormData?.pickupAddress && (
                  <div>PICK UP Address: {userFormData?.pickupAddress}</div>
                )}
                {userFormData?.city && (
                  <div>City: {userFormData?.city}</div>
                )}
              </div>

            </div>
          </div>

          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">City From</th>
                <th className="border border-gray-300 px-4 py-2">City To</th>
                <th className="border border-gray-300 px-4 py-2">Car</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Distance (km)</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((booking: any, index: number) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.from}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.to}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.car}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">₹{booking.price}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.distance?.toFixed(0)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button onClick={() => handleSelect(booking)} className="mr-2 px-2 py-1 bg-green-700 text-white rounded">
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="grid  gap-16 items-center relative overflow-hidden p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-3xl max-w-6xl mx-auto bg-white mt-4 font-[sans-serif] before:absolute before:right-0 before:h-full max-md:before:hidden">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mt-8">
              <input
                onChange={handleInputChange}
                value={userInfo.name}
                name="name"
                type="text"
                placeholder="Full Name"
                required
                className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
              />
              <input
                onChange={handleInputChange}
                value={userInfo.email}
                name="email"
                type="email"
                placeholder="Email"
                required
                className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
              />
              <input
                onChange={handleInputChange}
                value={userInfo.phoneNumber}
                name="phoneNumber"
                type="number"
                placeholder="Phone No."
                required
                className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
              />
              <input
                onChange={handleInputChange}
                value={userInfo.pickUp}
                name="pickUp"
                type="text"
                placeholder="PICKUP"
                required
                className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
              />
              <input
                onChange={handleInputChange}
                value={userInfo.drop}
                name="drop"
                type="text"
                placeholder="DROP"
                required
                className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
              />
              <button type="submit" className="mt-8 flex items-center justify-center text-sm w-full rounded-md px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}


    </div>
  )
}

export default SelectedCars;
