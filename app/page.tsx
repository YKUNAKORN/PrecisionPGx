"use client";

import * as React from "react";
import Image from "next/image";
const logoSrc = "/LOGO-login-kongjing.png";
type TabKey = "signin" | "signup";

export default function AuthPage() {
  const [tab, setTab] = React.useState<TabKey>("signin");
  const [hoveredTab, setHoveredTab] = React.useState<TabKey | null>(null);

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand / Title */}
        <div className="mb-6 text-center">
          <Image
            src={logoSrc}
            alt="Logo"
            width={220}
            height={220}
            className="mx-auto mb-10"
            priority
          />
          <h1 className="text-xl font-semibold">Welcome</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Sign in to your account or create a new one to get started
          </p>
        </div>

        {/* Tabs (Sign in / Sign up) */}
        <div
          role="tablist"
          aria-label="Auth tabs"
          className="mb-4 relative rounded-full border border-neutral-300 p-1 dark:border-neutral-700 overflow-hidden"
          style={{ boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)' }}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <span
            className="absolute top-1 h-9 w-[calc(50%-0.25rem)] bg-purple-500 rounded-full transition-all duration-500 ease-in-out pointer-events-none"
            style={{
              left: hoveredTab 
                ? (hoveredTab === "signin" ? "0.25rem" : "calc(49% + 0.25rem)")
                : (tab === "signin" ? "0.25rem" : "calc(49% + 0.25rem)"),
            }}
          />
          <div className="relative grid grid-cols-2">
            <button
              role="tab"
              aria-selected={tab === "signin"}
              onClick={() => setTab("signin")}
              onMouseEnter={() => setHoveredTab("signin")}
              className={[
                "h-9 rounded-full text-sm font-medium transition-colors duration-300 z-10 cursor-pointer",
                (hoveredTab === "signin" || (tab === "signin" && !hoveredTab))
                  ? "text-white" 
                  : "text-neutral-700 dark:text-neutral-300"
              ].join(" ")}
            >
              Sign In
            </button>

            <button
              role="tab"
              aria-selected={tab === "signup"}
              onClick={() => setTab("signup")}
              onMouseEnter={() => setHoveredTab("signup")}
              className={[
                "h-9 rounded-full text-sm font-medium transition-colors duration-300 z-10 cursor-pointer",
                (hoveredTab === "signup" || (tab === "signup" && !hoveredTab))
                  ? "text-white" 
                  : "text-neutral-700 dark:text-neutral-300"
              ].join(" ")}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-neutral-300 p-6 dark:border-neutral-700" style={{ boxShadow: '0 10px 30px rgba(185, 169, 217, 0.4)' }}>
          {tab === "signin" ? <SignInForm /> : <SignUpForm />}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Sub-components ----------------------------- */
import { useRouter } from "next/navigation";


function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Email หรือ Password ไม่ถูกต้อง");
      } else {
        // ✅ ได้ cookie แล้ว จาก API
        router.push("/Dashboard/Home"); // ไปหน้า home หรือหน้าที่คุณต้องการ
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Welcome back</h2>
        <p className="text-sm text-neutral-500">
          Enter your credentials to access your account
        </p>
      </header>

      <TextField
        id="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
      />
      <PasswordField
        id="password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      />

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div className="text-right">
        <span
          onClick={() => router.push("/forgotpassword")} 
          className="inline-block text-xs text-neutral-500 hover:text-purple-500 cursor-pointer transition-colors">
          forgot password?
        </span>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg border border-purple-500 bg-purple-500 py-2 
                    font-medium text-white shadow-sm transition-colors cursor-pointer
                    hover:bg-purple-400 hover:border-purple-400 
                    active:scale-[0.99] disabled:opacity-70"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

function SignUpForm() {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [position, setPosition] = React.useState("doctor");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!fullName || !email || !password) {
      setError("กรอกข้อมูลให้ครบก่อน");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);

    try {
      // 👇 สมมติว่าในโปรเจ็กต์คุณมี route นี้อยู่แล้ว
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          fullname: fullName,
          position : position,
          confirmPassword:confirmPassword, // เผื่อฝั่ง API คุณเช็กด้วย
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "สมัครสมาชิกไม่สำเร็จ");
      } else {
        setSuccess("สร้างบัญชีสำเร็จแล้ว! ให้กลับไป Sign in ได้เลย");
        // เคลียร์ฟอร์ม
        setFullName("");
        setEmail("");
        setPosition("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Create account</h2>
        <p className="text-sm text-neutral-500">
          Fill in your information to get started
        </p>
      </header>

      <TextField
        id="fullName"
        label="Full Name"
        placeholder="Enter your full name"
        value={fullName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFullName(e.target.value)
        }
      />
      <TextField
        id="email2"
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
      />
      
      <label htmlFor="position" className="block space-y-1.5">
        <span className="text-sm font-medium">Position</span>
        <select
          id="position"
          name="position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="
                      w-full rounded-lg border border-neutral-300 px-3 pr-10 py-2 outline-none
                      ring-0 cursor-pointer transition-colors bg-white dark:bg-neutral-950
                      hover:border-neutral-400 focus:border-neutral-400 dark:border-neutral-700
                      appearance-none
                      [background-image:linear-gradient(45deg,transparent_50%,#b0b0b0_50%),linear-gradient(-45deg,transparent_50%,#b0b0b0_50%)]
                      [background-position:right_1.5rem_center,right_1.1rem_center]
                      [background-size:6px_6px,6px_6px]
                      bg-no-repeat
                    "
        >
          <option value="doctor">Doctor</option>
          <option value="medtech">Medtech</option>
          <option value="pharmacy">Pharmacy</option>
        </select>
      </label>

      <PasswordField
        id="password2"
        label="Password"
        placeholder="Create a password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      />
      <PasswordField
        id="confirm"
        label="Confirm Password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConfirmPassword(e.target.value)
        }
      />

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {success ? <p className="text-sm text-green-600">{success}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-3 w-full rounded-lg border border-purple-500 bg-purple-500 py-2 
                   font-medium text-white shadow-sm transition-colors 
                   hover:bg-purple-400 hover:border-purple-400 
                   active:scale-[0.99] disabled:opacity-70 cursor-pointer"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}


/* --------------------------------- UI Bits -------------------------------- */

function TextField(props: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { id, label, type = "text", placeholder, value, onChange } = props;
  return (
    <label htmlFor={id} className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-700 bg-white dark:bg-neutral-950"
      />
    </label>
  );
}

function PasswordField(props: {
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { id, label, placeholder, value, onChange } = props;
  const [show, setShow] = React.useState(false);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 pr-10 outline-none focus:border-neutral-400 dark:border-neutral-700 bg-white dark:bg-neutral-950"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 px-3 text-sm text-neutral-500 hover:text-neutral-700 cursor-pointer transition-colors"
        >
          {show ? (
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
  );
}


function Divider({ label }: { label: string }) {
  return (
    <div className="relative my-2">
      <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
      <span className="absolute inset-x-0 -top-2 mx-auto w-max bg-transparent px-2 text-[11px] tracking-wider text-neutral-500">
        {label}
      </span>
    </div>
  );
}
