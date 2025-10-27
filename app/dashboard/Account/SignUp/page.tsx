"use client";
import * as React from "react";

export default function RegisterForm() {
  return (
    <div className="min-h-dvh grid place-items-center ">


    <div className="justify-center items-center w-full  rounded-2xl border border-neutral-300 p-6 space-y-6 ">
      {/* Header */}
      <header className="text-center">
        <h2 className="text-xl font-semibold">Create an Account</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Fill in the information below to register
        </p>  
      </header>

      <form className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="fullname" className="text-sm font-medium">
            Full Name
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 shadow-inner">
            <span className="i-heroicons-user text-neutral-500" aria-hidden />
            <input
              id="fullname"
              name="fullname"
              type="text"
              placeholder="Firstname Lastname"
              className="w-full bg-transparent outline-none placeholder:text-neutral-400"
              />
          </div>
        </div>

        {/* Position */}
        <div className="space-y-1">
          <label htmlFor="position" className="text-sm font-medium">
            Position
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 shadow-inner">
            <span className="i-heroicons-briefcase text-neutral-500" aria-hidden />
            <input
              id="position"
              name="position"
              type="text"
              placeholder="Your position"
              className="w-full bg-transparent outline-none placeholder:text-neutral-400"
              />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 shadow-inner">
            <span className="i-heroicons-envelope text-neutral-500" aria-hidden />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="user.example@gmail.com"
              className="w-full bg-transparent outline-none placeholder:text-neutral-400"
              />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 shadow-inner">
            <span className="i-heroicons-lock-closed text-neutral-500" aria-hidden />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full bg-transparent outline-none placeholder:text-neutral-400"
              />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 shadow-inner">
            <span className="i-heroicons-lock-closed text-neutral-500" aria-hidden />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="w-full bg-transparent outline-none placeholder:text-neutral-400"
              />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-2.5 font-medium hover transition"
          >
          Register
        </button>
      </form>
    </div>
    </div>
  );
}
