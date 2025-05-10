"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../layout/Layout";

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (isAdminLoggedIn === "true") {
      router.push("/admin"); 
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminCredentials = {
      email,
      password,
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminCredentials),
      });
  
      if (!response.ok) {
        throw new Error("Login failed");
      }
  
      const result = await response.json();
      console.log("Login successful:", result);
  
      localStorage.setItem("token", result.data.token);
  
      localStorage.setItem("isAdminLoggedIn", "true");
      router.push("/admin");
  
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  

  return (
    <Layout footerStyle={1}>
      <div className="container pt-140 pb-170">
        <div className="row">
          <div className="col-lg-5 mx-auto">
            <div className="border rounded-3 px-md-5 px-3 ptb-50">
              <div className="login-content">
                <div className="text-center">
                  <p className="neutral-1000 px-4 py-2 bg-2 text-sm-bold rounded-12 d-inline-flex align-items-center">Admin Login</p>
                  <h4 className="neutral-1000">Welcome back</h4>
                </div>
                <div className="form-login mt-30">
                  <form onSubmit={handleLogin}>
                    <div className="form-group">
          <input
            value={email}
            onChange={(e) => setUsername(e.target.value)}
            required
                        className="form-control username" type="text" placeholder="Email / Username" />
                    </div>
                    <div className="form-group">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
                        className="form-control password" type="password" placeholder="****************" />
                    </div>
                    <div className="form-group mb-30">
                      <button type="submit" className="btn btn-primary w-100">Sign in
                        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
          </button>
                    </div>
        </form>
      </div>
    </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
