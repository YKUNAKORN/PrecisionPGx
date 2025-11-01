'use client'

import * as React from 'react'

type TabKey = 'profile' | 'security' | 'preferences'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'security', label: 'Security' },
  { key: 'preferences', label: 'Preferences' },
]

export default function AccountSettingsPage() {
  const [tab, setTab] = React.useState<TabKey>('profile')

  // ถ้ามี sidebar fixed ซ้าย 64px/80px ให้เปลี่ยน pl-20 ตามขนาด sidebar
  return (
    <div className="min-h-dvh px-4 sm:px-6 lg:px-8 py-8">
      {/* wrapper ที่ทำให้คอนเทนอยู่กลางจอ */}
      <div className="w-full max-w-6xl mx-auto">
        {/* Page header */}
        <header className="mb-4">
          <h1 className="text-2xl font-semibold leading-tight">Account Settings</h1>
          <p className="mt-1 text-sm">
            Manage your profile, preferences, and security settings
          </p>
        </header>

        {/* Tabs */}
        <div className="rounded-xl border shadow-sm p-3 mb-6">
          <nav aria-label="Tabs">
            <ul className="flex flex-wrap gap-2">
              {TABS.map((t) => {
                const active = t.key === tab
                return (
                  <li key={t.key}>
                    <button
                      type="button"
                      onClick={() => setTab(t.key)}
                      aria-current={active ? 'page' : undefined}
                      className={[
                        'rounded-xl px-4 py-2 text-sm border shadow-sm',
                        'outline-offset-2 focus-visible:outline',
                        active ? 'font-semibold' : '',
                      ].join(' ')}
                    >
                      {t.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* Panels */}
        {tab === 'profile' && <ProfilePanel />}
        {tab === 'security' && <SecurityPanel />}
        {tab === 'preferences' && <PreferencesPanel />}
      </div>
    </div>
  )
}

/* ========================= Profile ========================= */
function ProfilePanel() {
  return (
    <section className="space-y-6">
      {/* Summary + Form */}
      <div className="rounded-2xl border shadow-sm p-6">
        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          {/* Summary card (left) */}
          <div className="rounded-xl border shadow-sm p-5">
            <div className="flex items-center gap-4">
              <div className="grid place-items-center rounded-full border shadow-sm w-18 h-18 text-base font-semibold">
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
              <Input defaultValue="Sarah" />
            </Field>
            <Field label="Last Name">
              <Input defaultValue="Johnson" />
            </Field>

            <Field label="Email Address">
              <Input type="email" defaultValue="sarah.johnson@medslab.com" />
            </Field>
            <Field label="Phone Number">
              <Input placeholder="+1 (555) 123-4567" />
            </Field>

            <Field label="Role" full>
              <Input defaultValue="Senior Laboratory Technician" />
            </Field>
            <Field label="Department" full>
              <Input defaultValue="Molecular Diagnostics" />
            </Field>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button type="button" className="rounded-lg border px-4 py-2 text-sm shadow-sm">
                Cancel
              </button>
              <button type="submit" className="rounded-lg border px-4 py-2 text-sm shadow-sm font-medium">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Laboratory info */}
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

      {/* Delete profile */}
      <div className="rounded-2xl border shadow-sm p-6">
        <h3 className="text-sm font-semibold">Delete Profile</h3>
        <p className="mt-1 text-sm">Permanently delete your profile and all associated data.</p>
        <div className="mt-3">
          <button className="rounded-lg border px-4 py-2 text-sm shadow-sm">
            Delete Profile
          </button>
        </div>
      </div>
    </section>
  )
}

/* ========================= Security ========================= */
function SecurityPanel() {
  const [show, setShow] = React.useState(false)
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold">Password</h2>
        <div className="mt-4 grid gap-4 md:max-w-2xl">
          <Field label="Current Password">
            <div className="flex items-stretch gap-2">
              <Input type={show ? 'text' : 'password'} />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="rounded-lg border px-3 text-sm shadow-sm"
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </Field>

          <Field label="New Password">
            <Input type="password" />
          </Field>

          <Field label="Confirm New Password">
            <Input type="password" />
          </Field>

          <div className="flex justify-end pt-2">
            <button className="rounded-lg border px-4 py-2 text-sm shadow-sm">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================= Preferences ========================= */
type ThemeMode = 'system' | 'light' | 'dark'
function PreferencesPanel() {
  const [mode, setMode] = React.useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system'
    return (localStorage.getItem('theme') as ThemeMode) || 'system'
  })

  React.useEffect(() => {
    if (mode === 'system') {
      document.documentElement.classList.remove('dark')
      localStorage.removeItem('theme')
    } else if (mode === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [mode])

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold">Theme</h2>
        <div className="mt-4 grid gap-4 md:max-w-md">
          <Field label="Theme Mode">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as ThemeMode)}
              className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </Field>
        </div>
      </div>
    </section>
  )
}

/* ========================= Small UI helpers ========================= */
function Field({
  label,
  children,
  full,
}: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={['grid gap-1', full ? 'md:col-span-2' : ''].join(' ')}>
      <span className="text-xs">{label}</span>
      {children}
    </label>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        'w-full rounded-lg border px-3 py-2 text-sm shadow-sm',
        props.className || '',
      ].join(' ')}
    />
  )
}
