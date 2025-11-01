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
          <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl border border-neutral-300 dark:border-neutral-700">
            <span className="text-lg font-semibold">◎</span>
          </div>
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

function SignInForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
      />
      <PasswordField
        id="password"
        label="Password"
        placeholder="Enter your password"
      />

      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 rounded border-neutral-300 dark:border-neutral-700"
          />
          Remember me
        </label>
        <a href="#" className="text-sm underline underline-offset-4">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg border border-neutral-300 py-2 font-medium shadow-sm active:scale-[0.99] dark:border-neutral-700"
      >
        Sign In
      </button>
    </form>
  );
}

function SignUpForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
      />
      <TextField
        id="email2"
        label="Email"
        type="email"
        placeholder="Enter your email"
      />
      <TextField
        id="position"
        label="Position"
        placeholder="Select your position"
      />

      {/* Team toggle (Join / Create) */}
      <fieldset className="space-y-2">
        <label className="block text-sm font-medium">Team Setup</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="rounded-lg border border-neutral-300 py-2 shadow-sm dark:border-neutral-700"
          >
            Join Team
          </button>
          <button
            type="button"
            className="rounded-lg border border-neutral-300 py-2 shadow-sm dark:border-neutral-700"
          >
            Create Team
          </button>
        </div>
      </fieldset>

      <TextField
        id="teamCode"
        label="Team Code"
        placeholder="Enter team code (e.g., ABC12345)"
      />
      <PasswordField
        id="password2"
        label="Password"
        placeholder="Create a password"
      />
      <PasswordField
        id="confirm"
        label="Confirm Password"
        placeholder="Confirm your password"
      />

      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4 rounded border-neutral-300 dark:border-neutral-700"
        />
        I agree to the{" "}
        <a href="#" className="underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4">
          Privacy Policy
        </a>
      </label>

      <button
        type="submit"
        className="w-full rounded-lg border border-neutral-300 py-2 font-medium shadow-sm active:scale-[0.99] dark:border-neutral-700"
      >
        Create Account
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
}) {
  const { id, label, type = "text", placeholder } = props;
  return (
    <label htmlFor={id} className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-700"
      />
    </label>
  );
}

function PasswordField(props: {
  id: string;
  label: string;
  placeholder?: string;
}) {
  const { id, label, placeholder } = props;
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
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 pr-10 outline-none focus:border-neutral-400 dark:border-neutral-700"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 px-3 text-sm text-neutral-500"
          aria-label={show ? "Hide password" : "Show password"}
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
