"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
const logoSrc = "/LOGO-login-kongjing.png";
import "@/app/style/forgotpassword.css";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface UpdatedPassword {
    password: string;
}
export default function Forgotpassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [Isloading, setIsloading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSendResetPassword = async () => {
        setIsloading(true);
        try {
            const { data, error } = await supabase.auth.updateUser({ password: password } as UpdatedPassword);
            if (data){
                console.log("Password updated:", data);
            }
            if (error){
                alert(error.message);
            }

            setSuccess("Password updated successfully.");
            setError("");
            alert(success);
        } catch (error) {
            setError("Failed to reset password.");
            setSuccess("");
            alert(error);
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
                    <header className="header">
                        <h2>Set new password</h2>
                        <p>Enter and confirm your new password below.</p>
                    </header>

                    <label className="label">New Password</label>
                    <input
                        className="input"
                        placeholder="Enter new password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <label className="label">Confirm Password</label>
                    <input
                        className="input"
                        placeholder="Confirm new password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button className="enter-btn" onClick={handleSendResetPassword} disabled={Isloading}>{Isloading ? "Loading..." : "Save"}</button>
                </div>
            </div>
        </section>
    );
}