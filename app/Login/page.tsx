"use client";

import * as React from "react";

type TabKey = "signin" | "signup";

export default function AuthPage() {
  const [tab, setTab] = React.useState<TabKey>("signin");

  return (
    <section className="min-h-dvh grid place-items-center px-4">
      <div className="w-full max-w-md">
        {/* Brand / Title */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold">Welcome</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Sign in to your account or create a new one to get started
          </p>
        </div>

        {/* Tabs (Sign in / Sign up) */}
        <div
          role="tablist"
          aria-label="Auth tabs"
          className="mb-4 grid grid-cols-2 rounded-full border border-neutral-300 p-1 dark:border-neutral-700"
        >
          <button
            role="tab"
            aria-selected={tab === "signin"}
            onClick={() => setTab("signin")}
            className={[
              "h-9 rounded-full text-sm font-medium transition-colors",
              "dark:bg-neutral",
              "hover:bg-gray-100 dark:hover:bg-neutral-800",
              "data-[active=true]:shadow data-[active=true]:bg-[var(--color-primary)]  dark:data-[active=true]:bg-[var(--color-primary-dark)]",
            ].join(" ")}
            data-active={tab === "signin"}
          >
            Sign In
          </button>

          <button
            role="tab"
            aria-selected={tab === "signup"}
            onClick={() => setTab("signup")}
            className={[
              "h-9 rounded-full text-sm font-medium transition-colors",
              "dark:bg-neutral",
              "hover:bg-gray-100 dark:hover:bg-neutral-800",
              "data-[active=true]:shadow data-[active=true]:bg-[var(--color-primary)]  dark:data-[active=true]:bg-[var(--color-primary-dark)]",
            ].join(" ")}
            data-active={tab === "signup"}
          >
            Sign Up
          </button>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-neutral-300 p-6 shadow-sm dark:border-neutral-700">
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
        router.push("/"); // ไปหน้า home หรือหน้าที่คุณต้องการ
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

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg border border-neutral-300 py-2 font-medium shadow-sm dark:border-neutral-700 disabled:opacity-70"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

function SignUpForm() {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [position, setPosition] = React.useState("");
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
      <TextField
        id="position"
        label="Position"
        placeholder="Select your position"
        value={position}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPosition(e.target.value)
        }
      />

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
        className="w-full rounded-lg border border-neutral-300 py-2 font-medium shadow-sm active:scale-[0.99] dark:border-neutral-700 disabled:opacity-70"
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
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-700"
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
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 pr-10 outline-none focus:border-neutral-400 dark:border-neutral-700"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 px-3 text-sm text-neutral-500"
        >
          {show ? "🙈" : "👁️"}
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
