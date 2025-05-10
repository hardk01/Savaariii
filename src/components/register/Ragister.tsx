"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

const Register = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [formData, setFormData] = useState({
        fs: "",
        ls: "",
        email: "",
        password: "",
        phone: "",
        postcode: "",
    });

    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //         setIsLoggedIn(true);
    //     }
    // }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userData: any = { ...formData };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error("Failed to register user");
            }

            const result = await response.json();

            localStorage.setItem("token", result.data.token);
            // console.log("Registration Success:", result);
            localStorage.setItem("userDataObj", JSON.stringify(result));
            router.push("/");

            // Reset form
            setFormData({
                fs: "",
                ls: "",
                email: "",
                password: "",
                phone: "",
                postcode: "",
            });

        } catch (error) {
            console.error("Registration Error:", error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const googleUserData = {
                uid: user.uid,
                fs: user.displayName?.split(" ")[0],
                ls: user.displayName?.split(" ")[1],
                email: user.email,
                phone: user.phoneNumber || "",
                postcode: "",
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/google-register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(googleUserData),
            });

            if (!response.ok) {
                throw new Error("Failed to register user with Google");
            }
            const token = await user.getIdToken();
            localStorage.setItem("token", token);
            setIsLoggedIn(true);
            router.push("/");
        } catch (error: any) {
            console.error("Google login error:", error);
            if (error.code === "auth/configuration-not-found") {
                alert("Google Sign-In is not configured. Please check your Firebase settings.");
            } else {
                alert("Google sign-in failed. Please try again.");
            }
        }
    };


    return (
        <>
            <div className="container pt-140 pb-170">
                <div className="row">
                    <div className="col-lg-5 mx-auto">
                        <div className="register-content border rounded-3 px-md-5 px-3 ptb-50">
                            <div className="text-center">
                                <p className="neutral-1000 px-4 py-2 bg-2 text-sm-bold rounded-12 d-inline-flex align-items-center">Register</p>
                                <h4 className="neutral-1000">Create an Account</h4>
                            </div>
                            <div className="form-login mt-30">
                                <form onSubmit={handleSubmit} action="#">
                                    <div className="form-group">
                                        <input type="text"
                                            name="fs"
                                            value={formData.fs}
                                            onChange={handleChange} className="form-control username" placeholder="First Name" />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="ls"
                                            value={formData.ls}
                                            onChange={handleChange} className="form-control username" placeholder="Last Name" />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange} className="form-control username" placeholder="Phone Number" />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="postcode"
                                            value={formData.postcode}
                                            onChange={handleChange} className="form-control username" placeholder="Post Code" />
                                    </div>
                                    <div className="form-group">
                                        <input name="email" value={formData.email}
                                            onChange={handleChange} className="form-control email" type="text" placeholder="Email / Username" />
                                    </div>
                                    <div className="form-group">
                                        <input name="password" value={formData.password}
                                            onChange={handleChange} className="form-control password" type="password" placeholder="***********" />
                                    </div>
                                    <div className="form-group mb-30">
                                        <button type="submit" className="btn btn-primary w-100">Sign up
                                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-md-medium neutral-500 text-center">Or connect with your social account</p>

                                </form>
                                <div className="box-button-logins">
                                    <button onClick={handleGoogleLogin} className="btn btn-login btn-google mr-10">
                                        <img src="/assets/imgs/template/popup/google.svg" alt="Carento" />
                                        <span className="text-sm-bold">Sign up with Google</span>
                                    </button>
                                    <Link className="btn btn-login mr-10" href="#">
                                        <img src="/assets/imgs/template/popup/facebook.svg" alt="Carento" />
                                    </Link>
                                    <Link className="btn btn-login" href="#">
                                        <img src="/assets/imgs/template/popup/apple.svg" alt="Carento" />
                                    </Link>
                                </div>
                                <p className="text-sm-medium neutral-500 text-center mt-70">Already have an account? <Link className="neutral-1000" href="/login">Login Here !</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;

