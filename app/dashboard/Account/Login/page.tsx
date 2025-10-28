"use client";

import Link from "next/link";
import * as React from "react";

export default function RegisterPage() {
  return (
    // ตำแหน่งหน้ากลางจอ (ตัดได้ถ้า layout จัดให้แล้ว)
    <section className="min-h-dvh grid place-items-center px-4">
      <RegisterForm />
    </section>
  );
}

function RegisterForm() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-neutral-300/70 dark:border-neutral-700/70 p-6 space-y-6">
      {/* Header */}
      <header className="text-center">
        <h2 className="text-xl font-semibold">Login an Account</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Fill in the information below to Login
        </p>
      </header>

      <form className="space-y-4">
        <Field label="Email" id="email" icon="i-heroicons-envelope">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="momie@gmail.com"
            autoComplete="email"
            className="w-full outline-none placeholder:text-neutral-400 bg-transparent"
          />
        </Field>

        <Field label="Password" id="password" icon="i-heroicons-lock-closed">
          <input
            id="password"
            name="password"
            type="password"
            placeholder="•••"
            autoComplete="new-password"
            className="w-full outline-none placeholder:text-neutral-400 bg-transparent"
          />
        </Field>

        {/* แถวลิงก์ตัวหนังสือขีดเส้นใต้ */}
        <p className="text-sm text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link href="/SignUp" className="text-blue-600 underline hover:text-blue-800">
            Sign up
          </Link>
        </p>

        {/* ปุ่ม Submit */}
        <button
          type="submit"
          className="mt-2 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 font-medium hover:opacity-90 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

/* ฟิลด์แบบใช้ซ้ำ */
function Field({
  label,
  id,
  icon,
  children,
}: {
  label: string;
  id: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div
        className={[
          "flex items-center gap-2 rounded-xl",
          "border border-neutral-300 dark:border-neutral-700",
          "px-3 py-2",
          "focus-within:ring-2 focus-within:ring-neutral-300 dark:focus-within:ring-neutral-700",
        ].join(" ")}
      >
        <span className={`${icon} text-neutral-500`} aria-hidden />
        {children}
      </div>
    </div>
  );
}
