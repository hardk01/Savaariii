"use client"
import Layout from '@/components/layout/Layout';
import UserPaymentMethod from '@/components/section/UserPaymentMethod';
import React, { useEffect, useState } from 'react';

type Car = {
  cityFrom: string;
  cityTo: string;
  selectedCar: string;
  distance: number;
  price: number;
};

const PaymentMethod = () => {
  const [userCarData, setUserCarData] = useState<Car | any>(null);

  useEffect(() => {
    const storedSelectedCars = localStorage.getItem("selectedCarsInfo");
    if (storedSelectedCars) {
      setUserCarData(JSON.parse(storedSelectedCars));
    }
  }, []);
  return (
    <>
      <Layout>
        <UserPaymentMethod userCarData={userCarData} />
      </Layout>
    </>
  )
}

export default PaymentMethod;