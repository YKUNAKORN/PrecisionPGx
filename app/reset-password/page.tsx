"use client";

import React, { useState } from "react";
import Image from "next/image";
const logoSrc = "/LOGO-login-kongjing.png";
import "@/app/style/forgotpassword.css";


export default function Forgotpassword(){
    const [step, setStep] = useState(1);
    return(
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
                {step === 1 ? (
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
                    />

                    <button className="enter-btn" onClick={() => setStep(2)}>
                        Enter
                    </button>
                    </>
                ) : (
                    <>
                    <header className="header">
                        <h2>Set new password</h2>
                        <p>Enter and confirm your new password below.</p>
                    </header>

                    <label className="label">New Password</label>
                    <input
                        className="input"
                        placeholder="Enter new password"
                        type="password"
                    />

                    <label className="label">Confirm Password</label>
                    <input
                        className="input"
                        placeholder="Confirm new password"
                        type="password"
                    />

                    <button className="enter-btn">Save</button>
                    </>
                )}
                </div>
            </div>
        </section>
    );
}