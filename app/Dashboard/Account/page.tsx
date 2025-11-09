"use client";

import * as React from "react";
import { useTheme } from "next-themes";


type TabKey = "profile" | "security" | "preferences";
const TABS: { key: TabKey; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "security", label: "Security" },
  { key: "preferences", label: "Preferences" },
];

export default function AccountSettingsPage() {
  const [tab, setTab] = React.useState<TabKey>("profile");

  // TODO: ตรงนี้ให้เปลี่ยนไปเช็คจากระบบจริงของคุณ เช่น session / supabase / clerk
  const isLoggedIn = true;

  const handleLogout = () => {
    // TODO: ตรงนี้ให้เรียก logout จริง เช่น signOut(), supabase.auth.signOut(), clerk.signOut()
    console.log("logging out...");
  };

  // ถ้ามี sidebar fixed ซ้าย 64px/80px ให้เพิ่ม pl-20 ที่ div นอกสุดตัวนี้
  return (
    <div className="min-h-dvh px-4 sm:px-6 lg:px-8 py-8">
      {/* wrapper ที่ทำให้คอนเทนอยู่กลางจอ */}
      <div className="w-full max-w-6xl mx-auto relative">
        {/* ✅ ปุ่ม Log Out มุมขวาบน */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="absolute top-0 right-0 rounded-lg border border-destructive text-destructive hover:bg-destructive hover:text-white px-4 py-2 text-sm font-medium shadow-sm transition"
          >
            ⎋ Log Out
          </button>
        )}

        {/* Page header */}
        {/* ✅ pr-28 กันให้หัวข้อไม่ทับปุ่ม */}
        <header className="mb-4 pr-28">
          <h1 className="text-2xl font-semibold leading-tight">
            Account Settings
          </h1>
          <p className="mt-1 text-sm">
            Manage your profile, preferences, and security settings
          </p>
        </header>

        {/* Tabs */}
        <div className="mb-6">
          <nav aria-label="Tabs">
            <ul
              className="
                flex w-full
                rounded-3xl
                border
              "
            >
              {TABS.map((t) => {
                const active = t.key === tab;
                return (
                    <li key={t.key} className="flex-1">
                      <button
                        type="button"
                        onClick={() => setTab(t.key)}
                        className={[
                          "w-full inline-flex items-center justify-center gap-2",
                  "rounded-2xl px-4 py-2 text-sm font-medium transition-all",
                  "outline-offset-2 focus-visible:outline",
                          active
                            ? "bg-primary shadow-sm"
                            : "hover:bg-primary/60",
                        ].join(" ")}
                      >
                        <span className="text-base leading-none">{t.icon}</span>
                        <span className="font-medium">{t.label}</span>
                      </button>
                    </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Panels */}
        {tab === "profile" && <ProfilePanel />}
        {tab === "security" && <SecurityPanel />}
        {tab === "preferences" && <PreferencesPanel />}
      </div>
    </div>
  );
}



  function ProfilePanel() {
    const [editing, setEditing] = React.useState(false);
    
    const handleToggle = () => {
      // ถ้าอยู่โหมดแก้ แล้วกด Save → ตรงนี้คือจุดยิง API ได้
      if (editing) {
        console.log("save profile...");
      }
    setEditing((v) => !v);
  };
  
  return (
    <section className="space-y-6">
      {/* ================== Personal / Summary + Form ================== */}
      <div className="relative rounded-2xl border shadow-sm p-6">
        {/* ปุ่ม Edit / Save มุมขวาบน */}
        <button
          type="button"
          onClick={handleToggle}
          className="absolute top-2.5 right-5 p-0.5 border rounded-md text-sm bg-primary/60 "
        >
          {editing ? "Save" : "Edit"}
        </button>

        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          {/* Summary card (left) */}
          <div className="rounded-xl border shadow-sm p-5">
            <div className="flex items-center gap-4">
              <div className="grid place-items-center rounded-full border shadow-sm w-16 h-16 text-base font-semibold">
                SJ
              </div>
              <div>
                <div className="text-base font-semibold">Dr. Sarah Johnson</div>
                <div className="text-sm">Senior Laboratory Technician</div>
              </div>
            </div>
          </div>

          {/* Form (right) */}
          <form className="grid gap-4 md:grid-cols-2">
            <Field label="First Name">
              <Input defaultValue="Sarah" readOnly={!editing} />
            </Field>
            <Field label="Last Name">
              <Input defaultValue="Johnson" readOnly={!editing} />
            </Field>

            <Field label="Email Address">
              <Input
                type="email"
                defaultValue="sarah.johnson@medslab.com"
                readOnly={!editing}
                />
            </Field>
            <Field label="Phone Number">
              <Input
                placeholder="+1 (555) 123-4567"
                readOnly={!editing}
                />
            </Field>

            <Field label="Role" full>
              <Input
                defaultValue="Senior Laboratory Technician"
                readOnly={!editing}
              />
            </Field>
            <Field label="Department" full>
              <Input
                defaultValue="Molecular Diagnostics"
                readOnly={!editing}
                />
            </Field>

            
          </form>
        </div>
      </div>

      {/* ================== Laboratory info (อันนี้คงของเดิม) ================== */}
      <div className="rounded-2xl border shadow-sm p-6">
        <h3 className="text-sm font-semibold">Laboratory Information</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Field label="Laboratory ID">
            <Input defaultValue="LAB-001" />
          </Field>
          <Field label="Employee ID">
            <Input defaultValue="EMP-2024-001" />
          </Field>
          <Field label="Access Level">
            <Input defaultValue="Level 3" />
          </Field>
        </div>
      </div>

      {/* ================== Delete profile (คงของเดิม) ================== */}
      <div className="rounded-2xl border border-destructive shadow-sm p-6">
        <h3 className="text-sm font-semibold text-destructive">Delete Profile</h3>
        <p className="mt-1 text-sm">
          Permanently delete your profile and all associated data.
        </p>
        <div className="mt-3">
          <button className="rounded-lg bg-destructive text-white px-4 py-2 text-sm shadow-sm ">
            Delete Profile
          </button>
        </div>
      </div>
    </section>
  );
}
/* ========================= Security ========================= */

import { KeyIcon, EyeIcon } from "@heroicons/react/24/outline";

function SecurityPanel() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border   p-5">
        <h3 className="text-lg font-semibold mb-2">Password &amp; Security</h3>

        <form className="grid gap-4 md:max-w-md">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium ">
              Current Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center">
                <KeyIcon className="size-5 " aria-hidden />
              </span>
              <input
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
                className="w-full rounded-xl border   pl-11 pr-10 py-2.5 text-sm shadow-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-300"
              />
              <span className="absolute inset-y-0 right-2 grid place-items-center rounded-md p-1.5 text-neutral-500">
                <EyeIcon className="size-5" aria-hidden />
              </span>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium ">
              New Password
            </label>
            <div className="relative">
              <input
                name="newPassword"
                type="password"
                placeholder="   Enter new password"
                className="w-full rounded-xl border   pr-10 py-2.5 text-sm shadow-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-300"
              />
              <span className="absolute inset-y-0 right-2 grid place-items-center rounded-md p-1.5 text-neutral-500">
                <EyeIcon className="size-5" aria-hidden />
              </span>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium ">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type="password"
                placeholder="   Confirm new password"
                className="w-full rounded-xl border  pr-10 py-2.5 text-sm shadow-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-300"
              />
              <span className="absolute inset-y-0 right-2 grid place-items-center rounded-md p-1.5 text-neutral-500">
                <EyeIcon className="size-5" aria-hidden />
              </span>
            </div>
          </div>

          {/* Submit (UI only) */}
          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-violet-700 px-5 py-2.5 text-base font-medium text-white shadow hover:bg-violet-800 active:bg-violet-900"
          >
            Update Password
          </button>
        </form>
      </div>
    </section>
  );
}




/* ========================= Preferences ========================= */
type ThemeMode = "system" | "light" | "dark";

function PreferencesPanel() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // กัน hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (theme as ThemeMode) ?? "system" : "system";

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold">Theme</h2>
        <div className="mt-4 grid gap-4 md:max-w-md">
          <Field label="Theme Mode ">
            <select
              value={currentTheme}
              onChange={(e) => setTheme(e.target.value as ThemeMode)}
              className={[
                "w-full rounded-lg border px-3 py-2 text-sm shadow-sm",
                "bg-white text-neutral-900",
                "dark:bg-neutral-900 dark:text-white dark:border-neutral-700",
                "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-neutral-400/50 dark:focus:ring-neutral-500/40",
              ].join(" ")}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </Field>
        </div>
      </div>
    </section>
  );
}

/* ========================= Small UI helpers ========================= */
function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={["grid gap-1", full ? "md:col-span-2" : ""].join(" ")}>
      <span className="text-xs">{label}</span>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const isReadOnly = props.readOnly || props.disabled;
  return (
    <input
      {...props}
      className={[
        "w-full rounded-md border px-3 py-2 text-sm",
        isReadOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white",
        props.className || "",
      ].join(" ")}
    />
  );
}