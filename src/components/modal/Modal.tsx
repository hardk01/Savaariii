"use client"
import React from 'react'

const Modal = ({ handleSave, formValues, handleInputChangeModal, setIsModalOpen, cities, city1, city2, setCity1, setCity2, }: any) => {

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "10px",
                        width: "300px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h3>Edit Form Data</h3>

                    {formValues.city1 && (
                        <div style={{ marginBottom: "10px" }}>
                            <label htmlFor="city1">From</label>
                            <select
                                name="city1"
                                value={city1}
                                onChange={(e) => {
                                    setCity1(e.target.value);
                                    if (e.target.value === city2) setCity2("");
                                }}
                                required
                            >
                                <option value="">Select City</option>
                                {cities.map((city: any) => (
                                    <option key={city.city} value={city.city}>
                                        {city.city}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {formValues.city2 && (
                        <div style={{ marginBottom: "10px" }}>
                            <label htmlFor="city2">To</label>
                            <select
                                name="city2"
                                value={city2}
                                onChange={(e) => setCity2(e.target.value)}
                                required
                            >
                                <option value="">Select City</option>
                                {cities
                                    .filter((city: any) => city.city !== city1)
                                    .map((city: any) => (
                                        <option key={city.city} value={city.city}>
                                            {city.city}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

                    {formValues.pickUpDate && (
                        <div style={{ marginBottom: "10px" }}>
                            <label>Pick Up Date:</label>
                            <input
                                type="date"
                                name="pickUpDate"
                                value={formValues.pickUpDate}
                                onChange={handleInputChangeModal}
                                style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                            />
                        </div>
                    )}
                    {formValues.pickUpTime && (
                        <div style={{ marginBottom: "10px" }}>
                            <label>Pick Up Time:</label>
                            <input
                                type="time"
                                name="pickUpTime"
                                value={formValues.pickUpTime}
                                onChange={handleInputChangeModal}
                                style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                            />
                        </div>
                    )}
                    {formValues.returnDate && (
                        <div style={{ marginBottom: "10px" }}>
                            <label>RETURN DATE</label>
                            <input
                                type="date"
                                name="returnDate"
                                value={formValues.returnDate}
                                onChange={handleInputChangeModal}
                            />
                        </div>
                    )}

                    {formValues.city && (
                        <div style={{ marginBottom: "10px" }}>
                            <label htmlFor="city1">City: </label>
                            <input
                                type="text"
                                name="city"
                                value={formValues.city}
                                onChange={handleInputChangeModal}
                                required
                            />
                        </div>
                    )}
                    {formValues.pickupAddress && (
                        <div style={{ marginBottom: "10px" }}>
                            <label htmlFor="city1">TRIP :</label>
                            <select
                                name="pickupAddress"
                                value={formValues.pickupAddress}
                                onChange={handleInputChangeModal}
                                required
                            >
                                <option value="Pickup from Airport"> Pickup from Airport </option>
                                <option value="Drop to Airport"> Drop to Airport </option>
                            </select>
                        </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <button
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#0070f3",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#ddd",
                                color: "#333",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal
