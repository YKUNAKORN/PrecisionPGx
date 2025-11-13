"use client";

import React, { useState } from "react";
import Image from "next/image";
const logoSrc = "/LOGO-login-kongjing.png";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function Forgotpassword() {
    const [email, setEmail] = useState("");
    const [Isloading, setIsloading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const handleSendResetEmail = async () => {
        setIsloading(true);
        setError("");
        setSuccess("");
        
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `http://localhost:3000/reset-password`,
            })
            if (error) {
                setError(error.message);
                throw error;
            }
            setSuccess("You will receive a reset password email shortly.");
        } catch (error) {
            setError("Failed to send reset password email.");
        } finally {
            setIsloading(false);
        }
    }
    
    return (
        <section className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <Image
                        src={logoSrc}
                        alt="Logo"
                        width={220}
                        height={220}
                        className="mx-auto mb-10"
                        priority
                    />
                    <h1 className="text-xl font-semibold">Forgot password</h1>
                </div>

                <div className="rounded-2xl border border-neutral-300 p-6 dark:border-neutral-700" style={{ boxShadow: '0 10px 30px rgba(185, 169, 217, 0.4)' }}>
                    <header className="space-y-1 mb-4">
                        <h2 className="text-lg font-semibold">Reset password</h2>
                        <p className="text-sm text-neutral-500">
                            Enter your email address to reset your password.
                        </p>
                    </header>

                    <div className="space-y-4">
                        <label htmlFor="email" className="block space-y-1.5">
                            <span className="text-sm font-medium">Email</span>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                            />
                        </label>

                        {error && <p className="text-sm text-red-500">{error}</p>}
                        {success && <p className="text-sm text-green-600">{success}</p>}

                        <button 
                            onClick={handleSendResetEmail} 
                            disabled={Isloading}
                            className="w-full rounded-lg border border-purple-500 bg-purple-500 py-2 
                                       font-medium text-white shadow-sm transition-colors cursor-pointer
                                       hover:bg-purple-400 hover:border-purple-400 
                                       active:scale-[0.99] disabled:opacity-70"
                        >
                            {Isloading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}