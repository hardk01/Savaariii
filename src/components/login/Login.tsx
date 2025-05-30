"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            router.push("/");
        }
    }, []);

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             setIsLoggedIn(true);
    //             router.push("/");
    //         }
    //     });

    //     return () => unsubscribe();
    // }, []);

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
            const data = await response.json();
            localStorage.setItem("token", data.data.token);
            setIsLoggedIn(true);
            router.push("/");
        } catch (error: any) {
            console.error("Google login error:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            localStorage.setItem("token", data.data.token);
            setIsLoggedIn(true);
            router.push("/");

        } catch (error) {
            console.error("Login error:", error);
            // alert("Invalid email or password.");
        }
    };

    if (isLoggedIn) {
        return null;
    }

    return (
        <div className="container pt-140 pb-170">
            <div className="row">
                <div className="col-lg-5 mx-auto">
                    <div className="border rounded-3 px-md-5 px-3 ptb-50">
                        <div className="login-content">
                            <div className="text-center">
                                <p className="neutral-1000 px-4 py-2 bg-2 text-sm-bold rounded-12 d-inline-flex align-items-center">Sign in</p>
                                <h4 className="neutral-1000">Welcome back</h4>
                            </div>
                            <div className="form-login mt-30">
                                <form onSubmit={handleLogin}>
                                    <div className="form-group">
                                        <input
                                            name="email"
                                            value={credentials.email}
                                            onChange={handleChange} className="form-control username" type="text" required placeholder="Email / Username" />
                                    </div>
                                    <div className="form-group">
                                        <input type="password"
                                            name="password"
                                            value={credentials.password}
                                            onChange={handleChange} className="form-control password" required placeholder="****************" />
                                    </div>
                                    <div className="form-group">
                                        <div className="box-remember-forgot">
                                            <div className="remeber-me">
                                                <label className="text-xs-medium neutral-500"> <input className="cb-remember" type="checkbox" />Remember me </label>
                                            </div>
                                            <div className="forgotpass"><Link className="text-xs-medium neutral-500" href="#">Forgot password?</Link></div>
                                        </div>
                                    </div>
                                    <div className="form-group mb-30">
                                        <button type="submit" className="btn btn-primary w-100">Sign in
                                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-md-medium neutral-500 text-center">Or connect with your social account</p>
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
                                    <p className="text-sm-medium neutral-500 text-center mt-70">Don’t have an account? <Link className="neutral-1000" href="/register">Register Here !</Link></p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
