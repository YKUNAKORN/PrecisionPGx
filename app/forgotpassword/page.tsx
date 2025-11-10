"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
const logoSrc = "/LOGO-login-kongjing.png";
import "@/app/style/forgotpassword.css";
import { createClient } from "@/lib/supabase/client";
import { set } from "date-fns";

const supabase = createClient();


export default function Forgotpassword() {
    // const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [Isloading, setIsloading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const handleSendResetEmail = async () => {
        setIsloading(true);
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `http://localhost:3000/reset-password`,
            })
            if (error) {
                alert(error.message);
                throw error;
            }
            setSuccess("You will receive a reset password email shortly.");
            alert(success);
            setError("");
        } catch (error) {
            setError("Failed to send reset password email.");
            setSuccess("");
        } finally {
            setIsloading(false);
        }
    }
    return (
        <section className="big-box">
            <div className="box-container">
                <div className="logo-area">
                    <Image
                        src={logoSrc}
                        alt="Logo"
                        width={220}
                        height={220}
                        className="logo"
                        priority
                    />
                    <h1 className="title">Forgot password</h1>
                </div>

                <div className="card">
                    <>
                        <header className="header">
                            <h2>Reset password</h2>
                            <p>Enter your email address to reset your password.</p>
                        </header>

                        <label className="label">Email</label>
                        <input
                            className="input"
                            placeholder="Enter your email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <button className="enter-btn" onClick={handleSendResetEmail} disabled={Isloading}>{Isloading ? "Loading..." : "Enter"}</button>
                    </>



                </div>
            </div>
        </section>
    );
}