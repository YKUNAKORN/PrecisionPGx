"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { fetchUser } from "@/lib/fetch/user";
import { getdetailUserModel } from "@/lib/fetch/model/User";
import { deleteUserById } from "@/lib/fetch/deuser";
import { KeyIcon, EyeIcon } from "@heroicons/react/24/outline";
import { logout } from "@/lib/fetch/authlogout";
import { updateUserById } from "@/lib/fetch/updateUser";

type TabKey = "profile" | "security" | "preferences";
const TABS: { key: TabKey; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "security", label: "Security" },
  { key: "preferences", label: "Preferences" },
];

export default function AccountSettingsPage() {
  const [tab, setTab] = React.useState<TabKey>("profile");

  const router = useRouter();
  const isLoggedIn = true;

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) {
      alert("Logged out successfully.");
      router.push("/");
      router.refresh?.();
    } else {
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-dvh px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-6xl mx-auto relative">
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="absolute top-0 right-0 rounded-lg border border-destructive text-destructive hover:bg-destructive hover:text-white px-4 py-2 text-sm font-medium shadow-sm transition"
          >
            ⎋ Log Out
          </button>
        )}

        <header className="mb-4 pr-28">
          <h1 className="text-2xl font-semibold leading-tight">Account Settings</h1>
          <p className="mt-1 text-sm">Manage your profile, preferences, and security settings</p>
        </header>

        <div className="mb-6">
          <nav aria-label="Tabs">
            <ul className="flex w-full rounded-3xl border">
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
                        active ? "bg-primary shadow-sm" : "hover:bg-primary/60",
                      ].join(" ")}
                    >
                      <span className="font-medium">{t.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {tab === "profile" && <ProfilePanel />}
        {tab === "security" && <SecurityPanel />}
        {tab === "preferences" && <PreferencesPanel />}
      </div>
    </div>
  );
}

/* ========================= Profile ========================= */

function ProfilePanel() {
  const router = useRouter();

  // ---------- Hooks ----------
  const [editing, setEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [deleting, setDeleting] = React.useState(false);

  const [data, setData] = useState<getdetailUserModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    fullname: "",
    email: "",
    position: "",
  });

  // โหลดข้อมูลครั้งแรก
  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const userData = await fetchUser();
        if (!active) return;
        setData(userData);
      } catch (err: any) {
        if (!active) return;
        setError("Failed to fetch user data: " + (err?.message ?? String(err)));
        setData(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // sync form เมื่อ data เปลี่ยน
  React.useEffect(() => {
    if (!data) return;
    setForm({
      fullname: data.fullname ?? "",
      email: data.email ?? "",
      position: data.position ?? "",
    });
  }, [data]);

  const initials =
    data?.fullname?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U";

  const handleDelete = async () => {
    if (!data?.id) {
      alert("ไม่พบรหัสผู้ใช้ (id)");
      return;
    }
    if (!confirm("Confirm to Delete Profile?")) return;

    try {
      setDeleting(true);
      const ok = await deleteUserById(String(data.id));
      if (ok) {
        alert("Delete Success!");
        router.push("/");
        router.refresh?.();
      } else {
        alert("Error deleting user. Please try again.");
      }
    } finally {
      setDeleting(false);
    }
  };

  // ✅ กด Edit/Save (แก้ให้ส่ง payload และกันเคสต่าง ๆ)
  const handleEdit = async () => {
    if (!data?.id) return;

    // กดครั้งแรก -> เข้าโหมดแก้ไข
    if (!editing) {
      setEditing(true);
      return;
    }

    try {
      setSaving(true);

      
      // ส่งเฉพาะฟิลด์ที่เปลี่ยนจริง ๆ
      const payload: Record<string, string> = {};
      if (form.fullname !== (data.fullname ?? "")) payload.fullname = form.fullname;
      if (form.email !== (data.email ?? "")) payload.email = form.email;
      if (form.position !== (data.position ?? "")) payload.position = form.position;

      // ถ้าไม่มีอะไรเปลี่ยนเลย
      if (Object.keys(payload).length === 0) {
        setEditing(false);
        return; 
      }

      // 🔧 เรียกอัปเดต (เดิมคุณไม่ได้ส่ง payload ทำให้ server ได้ body ว่าง → 500 ง่ายมาก)
      const updated = await updateUserById(String(data.id), payload);

      if (updated) {
        setData(updated); // useEffect(data) จะ sync form ให้อัตโนมัติ
        alert("Profile updated successfully!");
        window.location.reload();
        
      } else {
        alert("Failed to update profile.");
      }
    } catch (err: any) {
      console.error("update failed:", err);
      alert(`Update failed: ${err?.message ?? err}`);
    } finally {
      setSaving(false);
      setEditing(false);

    }
  };

  // ---------- render ----------
  if (loading) return <div className="p-6">Loading profile...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return <div className="p-6 text-red-600">Profile not found</div>;

  /* ================== Layout Page Account ================== */
  return (
    <section className="space-y-6">
      {/* ================== Personal / Summary + Form ================== */}
      <div className="relative rounded-2xl border shadow-sm p-6 bg-panel">
        <button
          type="button"
          onClick={handleEdit}
          disabled={saving}
          className="absolute top-2.5 right-5 p-0.5 border rounded-md text-sm bg-primary/60 "
        >
          {editing ? (saving ? "Saving..." : "Save") : "Edit"}
        </button>

        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          {/* Summary card (left) */}
          <div className="rounded-xl border shadow-sm p-5">
            <div className="flex items-center gap-4">
              <div className="grid place-items-center rounded-full border shadow-sm w-16 h-16 text-base font-semibold">
                {initials}
              </div>
              <div>
                <div className="text-base font-semibold">{data.fullname}</div>
                <div className="text-sm">{data.position}</div>
              </div>
            </div>
          </div>

          {/* Form (right) — คุมค่าจาก form เสมอ */}
          <form className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name">
              <InputOrText
                value={form.fullname}
                onChange={(v) => setForm((f) => ({ ...f, fullname: v }))}
                readOnly={!editing}
              />
            </Field>

            <Field label="Email Address">
              <InputOrText
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                readOnly={!editing}
              />
            </Field>

            <Field label="Phone Number">
              <InputOrText value={data.phone ?? ""} readOnly />
            </Field>

            <Field label="Position">
              <InputOrText
                value={form.position}
                onChange={(v) => setForm((f) => ({ ...f, position: v }))}
                readOnly={!editing}
              />
            </Field>

            <Field label="Department" full>
              <InputOrText value={data.ward?.name ?? data.ward_id ?? ""} readOnly />
            </Field>
          </form>
        </div>
      </div>

      {/* ================== Laboratory info (ตัวอย่าง UI) ================== */}
      <div className="rounded-2xl border shadow-sm p-6 bg-panel">
        <h3 className="text-sm font-semibold">Laboratory Information</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Field label="Laboratory ID">
            <Input defaultValue="LAB-001" readOnly />
          </Field>
          <Field label="Employee ID">
            <Input defaultValue="EMP-2024-001" readOnly />
          </Field>
          <Field label="Access Level">
            <Input defaultValue="Level 3" readOnly />
          </Field>
        </div>
      </div>

      {/* ================== Delete profile ================== */}
      <div className="rounded-2xl border border-destructive shadow-sm p-6">
        <h3 className="text-sm font-semibold text-destructive">Delete Profile</h3>
        <p className="mt-1 text-sm">Permanently delete your profile and all associated data.</p>
        <div className="mt-3">
          <button
            onClick={handleDelete}
            className="rounded-lg bg-destructive text-white px-4 py-2 text-sm shadow-sm"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Profile"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ========================= Security ========================= */

function SecurityPanel() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border   p-5">
        <h3 className="text-lg font-semibold mb-2">Password &amp; Security</h3>

        <form className="grid gap-4 md:max-w-md">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium ">Current Password</label>
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
            <label className="text-sm font-medium ">New Password</label>
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
            <label className="text-sm font-medium ">Confirm New Password</label>
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

  const currentTheme = mounted ? ((theme as ThemeMode) ?? "system") : "system";

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

function ReadBlock({ value }: { value?: string | null }) {
  return (
    <div className="w-full rounded-md border px-3 py-2 text-sm bg-gray-50">
      {value || "—"}
    </div>
  );
}

type InputOrTextProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "readOnly"
> & {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
};

function InputOrText({
  value,
  onChange,
  readOnly,
  ...rest
}: InputOrTextProps) {
  if (readOnly) return <ReadBlock value={value} />;
  return (
    <input
      {...rest}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={[
        "w-full rounded-md border px-3 py-2 text-sm",
        "bg-white",
        rest.className || "",
      ].join(" ")}
    />
  );
}