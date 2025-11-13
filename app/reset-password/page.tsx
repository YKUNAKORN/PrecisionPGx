"use client";

import React, { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const logoSrc = "/LOGO-login-kongjing.png";
const supabase = createClient();
interface UpdatedPassword {
    password: string;
}

export default function ResetPassword() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [Isloading, setIsloading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSendResetPassword = async () => {
        setError("");
        setSuccess("");
        
        if (!password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        
        setIsloading(true);
        try {
            const { data, error } = await supabase.auth.updateUser({ password: password } as UpdatedPassword);
            if (data){
                console.log("Password updated:", data);
                setSuccess("Password updated successfully. Redirecting to login...");
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            }
            if (error){
                setError(error.message);
            }
        } catch (error) {
            setError("Failed to reset password.");
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
                    <h1 className="text-xl font-semibold">Reset password</h1>
                </div>

                <div className="rounded-2xl border border-[#B8A8D8] p-6 dark:border-neutral-700" style={{ boxShadow: '0 10px 30px rgba(185, 169, 217, 0.4)' }}>
                    <header className="space-y-1 mb-4">
                        <h2 className="text-lg font-semibold">Set new password</h2>
                        <p className="text-sm text-neutral-500">
                            Enter and confirm your new password below.
                        </p>
                    </header>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-sm font-medium">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-[#B8A8D8] px-3 py-2 pr-10 outline-none focus:border-neutral-400 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute inset-y-0 right-0 px-3 text-sm text-neutral-500 hover:text-neutral-700 cursor-pointer transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-[#B8A8D8] px-3 py-2 pr-10 outline-none focus:border-neutral-400 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((s) => !s)}
                                    className="absolute inset-y-0 right-0 px-3 text-sm text-neutral-500 hover:text-neutral-700 cursor-pointer transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}
                        {success && <p className="text-sm text-green-600">{success}</p>}

                        <button 
                            onClick={handleSendResetPassword} 
                            disabled={Isloading}
                            className="w-full rounded-lg border border-purple-500 bg-purple-500 py-2 
                                       font-medium text-white shadow-sm transition-colors cursor-pointer
                                       hover:bg-purple-400 hover:border-purple-400 
                                       active:scale-[0.99] disabled:opacity-70"
                        >
                            {Isloading ? "Updating..." : "Save Password"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}