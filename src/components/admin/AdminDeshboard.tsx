'use client';

import React, { useEffect, useState } from 'react';
// import Deshboard from './components/Deshboard';
import SelectedCar from './components/SelectedCar';
import BlogAdmin from './components/BlogAdmin';
import UserAdmin from './components/UserAdmin';
import BookingAdminInfo from './components/BookingAdminInfo';
import CouponAdd from './components/CouponAdd';
import AddCar from './components/AddCar';
import Contect from './components/Contect';
import { useRouter } from 'next/navigation';


const AdminDashboard = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState("User");

  useEffect(() => {
      const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
      if (isAdminLoggedIn !== "true") {
        router.push("/loginadmin"); 
      }
    }, [router]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/analytics/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch analytics data: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        // console.log(data);

      } catch (err: any) {
        console.error('Error fetching analytics data:', err);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className="d-flex">
      {sidebarOpen && (
        <nav className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: "250px", height: "100vh" }}>
          <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <span className="fs-4">Dash UI</span>
          </a>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            {/* <li className="nav-item">
              <button onClick={() => setSelectedOption("Dashboard")} className="nav-link active text-white" aria-current="page">Dashboard</button>
            </li> */}
            <li><button onClick={() => setSelectedOption("User")} className="nav-link text-white">User Information</button></li>
            <li><button onClick={() => setSelectedOption("Booking")} className="nav-link text-white">Booking Information</button></li>
            <li><button onClick={() => setSelectedOption("Add")} className="nav-link text-white">Add Cars</button></li>
            <li><button onClick={() => setSelectedOption("Cars")} className="nav-link text-white">Cars</button></li>
            <li><button onClick={() => setSelectedOption("Blog")} className="nav-link text-white">Blog</button></li>
            <li><button onClick={() => setSelectedOption("Coupon")} className="nav-link text-white">Coupon Code</button></li>
            <li><button onClick={() => setSelectedOption("Contect")} className="nav-link text-white">Contect Details</button></li>
          </ul>
          <hr />
          <div className="dropdown">
            <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
              <img src="/user.jpg" alt="" width="32" height="32" className="rounded-circle me-2" />
              <strong>User</strong>
            </a>
          </div>
        </nav>
      )}
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-outline-primary d-md-none" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? 'Hide Menu' : 'Show Menu'}
          </button>
          <h1 className="h4">Projects</h1>
          <button className="btn btn-primary">Create New Project</button>
        </div>

        {selectedOption === "User" && (
          <>
            <UserAdmin />
          </>
        )}
        {selectedOption === "Booking" && (
          <>
            <BookingAdminInfo />
          </>
        )}
        {selectedOption === "Add" && (
          <>
            <section className="box-section box-search-advance-home10">
              <AddCar />
            </section>
          </>
        )}
        {selectedOption === "Cars" && (
          <>
            <section className="box-section box-search-advance-home10">
              <SelectedCar />
            </section>
          </>
        )}

        {selectedOption === "Blog" && (
          <>
            <BlogAdmin />
          </>
        )}
        {selectedOption === "Coupon" && (
          <>
            <CouponAdd />
          </>
        )}
        {selectedOption === "Contect" && (
          <>
            <Contect />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
