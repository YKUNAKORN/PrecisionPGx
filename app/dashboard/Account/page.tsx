'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'

type TabKey = 'profile' | 'security' | 'preferences' | 'notifications'

/** ---------- Types that your API should return ---------- */
type AccountSettingsPayload = {
  profile: {
    displayName: string
    avatarInitials: string
    title: string
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    department: string
    labId: string
    employeeId: string
    accessLevel: string
  }
  security: {
    sms2fa: boolean
    app2fa: boolean
    sessions: Array<{
      label: string
      sub: string
      ip: string
      current?: boolean
    }>
  }
  preferences: {
    theme: 'Dark Mode' | 'Light Mode' | 'System'
    language: 'English' | 'ไทย' | 'Español'
    timezone: string
    defaultSampleView: 'Table View' | 'Card View'
    resultsPerPage: '10 results' | '25 results' | '50 results'
    autoRefresh: boolean
    showSampleIds: boolean
  }
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    security: boolean
    labQualityControl: boolean
    labReportGeneration: boolean
  }
}

/** Minimal helper to load JSON */
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return (await res.json()) as T
}

export default function AccountSettingsPage() {
  const [tab, setTab] = useState<TabKey>('profile')
  const [data, setData] = useState<AccountSettingsPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // auth + modal state
  const [isAuthed, setIsAuthed] = useState<boolean>(false)
  const [showLogin, setShowLogin] = useState<boolean>(false)

  // Fetch only AFTER login
  useEffect(() => {
    if (!isAuthed) return
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const payload = await fetchJSON<AccountSettingsPayload>('/api/account/settings')
        if (mounted) setData(payload)
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Failed to load settings')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [isAuthed])

  return (
    <div className="min-h-dvh text-neutral-900 text-[17px] md:text-[18px]">
      <main className="px-4 pb-14">
        {/* Centered container on all screens */}
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="sticky top-0 z-10 -mx-4 mb-6 border-b border-neutral-200 px-4 py-4 md:mx-0 md:px-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Account Settings</h1>
                <p className="mt-1 text-sm text-neutral-600">
                  Manage your profile, preferences, and security settings
                </p>
              </div>

              {/* Right button: Login (when not authed) / Log Out (when authed) */}
              {!isAuthed ? (
                <button
                  onClick={() => setShowLogin(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-400 px-4 py-2 text-base font-medium"
                >
                  <LoginIcon className="size-5" /> Login
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthed(false)
                    setData(null)
                    setError(null)
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-base font-medium text-red-600"
                >
                  <LogoutIcon className="size-5" /> Log Out
                </button>
              )}
            </div>

            {/* Tabs: show only after login */}
            {isAuthed && (
              <div
                role="tablist"
                aria-label="Account sections"
                className="mt-5 inline-flex w-full rounded-2xl border border-neutral-200 p-1 text-base"
              >
                <TabButton active={tab === 'profile'} onClick={() => setTab('profile')}>
                  <UserIcon className="size-5" /> Profile
                </TabButton>
                <TabButton active={tab === 'security'} onClick={() => setTab('security')}>
                  <LockIcon className="size-5" /> Security
                </TabButton>
                <TabButton active={tab === 'preferences'} onClick={() => setTab('preferences')}>
                  <SparkIcon className="size-5" /> Preferences
                </TabButton>
                <TabButton active={tab === 'notifications'} onClick={() => setTab('notifications')}>
                  <BellIcon className="size-5" /> Notifications
                </TabButton>
              </div>
            )}
          </header>

          {/* Content — show only after login */}
          {isAuthed ? (
            <section className="space-y-8">
              {error && (
                <div className="rounded-xl border border-red-300 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {loading && <SkeletonAll />}

              {!loading && data && (
                <>
                  {tab === 'profile' && <ProfilePanel data={data.profile} />}
                  {tab === 'security' && <SecurityPanel data={data.security} />}
                  {tab === 'preferences' && <PreferencesPanel data={data.preferences} />}
                  {tab === 'notifications' && <NotificationsPanel data={data.notifications} />}
                </>
              )}
            </section>
          ) : (
            // When not authed, keep area visually centered/clean
            <div className="grid place-items-center py-20">
              <div className="text-center">
                <p className="text-neutral-600">Please login to view your account settings.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <LoginDialog
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false)
            setIsAuthed(true)
          }}
        />
      )}
    </div>
  )
}

/* ----------------------------- Skeletons ------------------------------ */

function SkeletonAll() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card><div className="h-36 rounded-xl border border-neutral-200" /></Card>
        <Card title="Personal Information"><div className="h-36 rounded-xl border border-neutral-200" /></Card>
      </div>
      <Card title="Laboratory Information"><div className="h-20 rounded-xl border border-neutral-200" /></Card>
    </div>
  )
}

/* ----------------------------- Login Dialog ---------------------------- */

function LoginDialog({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSubmitting(true)
      setErr(null)
      // TODO: replace with your real login API
      // await fetch('/api/auth/login', { method:'POST', body: JSON.stringify({email,password}) })
      await new Promise((r) => setTimeout(r, 800))
      onSuccess()
    } catch (e: any) {
      setErr(e?.message ?? 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Login"
    >
      {/* Overlay without bg color: use blur + click to close */}
      <button className="absolute inset-0 backdrop-blur-sm" onClick={onClose} aria-label="Close login overlay" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-neutral-300 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Login</h3>
          <button onClick={onClose} className="rounded-lg border border-neutral-300 px-2 py-1 text-sm">Close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <div className="mb-1 text-sm font-medium text-neutral-700">Email</div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-base outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-medium text-neutral-700">Password</div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-base outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              placeholder="••••••••"
            />
          </label>

          {err && <div className="rounded-lg border border-red-300 p-2 text-sm text-red-700">{err}</div>}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-xl border border-neutral-300 px-4 py-2 text-base">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl border border-neutral-400 px-4 py-2 text-base font-medium"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ----------------------------- Profile Panel ----------------------------- */

function ProfilePanel({ data }: { data: AccountSettingsPayload['profile'] }) {
  return (
    <>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative">
              <div className="grid size-28 place-items-center rounded-full border border-neutral-300 text-2xl font-semibold text-neutral-700">
                {data.avatarInitials || '??'}
              </div>
              <button
                title="Change photo"
                className="absolute -bottom-1 -right-1 grid size-9 place-items-center rounded-full border border-neutral-300"
              >
                <CameraIcon className="size-4" />
              </button>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold">{data.displayName || '—'}</h3>
              <p className="text-sm text-neutral-600">{data.title || '—'}</p>
              <div className="mt-2 inline-flex rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700">
                {data.department || '—'}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Personal Information" action={<button className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium">Edit</button>}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="First Name"><Input defaultValue={data.firstName} icon={<UserIcon className="size-5" />} /></Field>
            <Field label="Last Name"><Input defaultValue={data.lastName} /></Field>
            <Field className="md:col-span-2" label="Email Address"><Input defaultValue={data.email} icon={<MailIcon className="size-5" />} /></Field>
            <Field className="md:col-span-2 md:col-start-1" label="Phone Number"><Input defaultValue={data.phone} icon={<PhoneIcon className="size-5" />} /></Field>
            <Field label="Role"><Input defaultValue={data.role} /></Field>
            <Field label="Department"><Input defaultValue={data.department} icon={<BeakerIcon className="size-5" />} /></Field>
          </div>
        </Card>
      </div>

      <Card title="Laboratory Information">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Laboratory ID"><Input defaultValue={data.labId} /></Field>
          <Field label="Employee ID"><Input defaultValue={data.employeeId} /></Field>
          <Field label="Access Level">
            <span className="inline-flex rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700">
              {data.accessLevel || '—'}
            </span>
          </Field>
        </div>
      </Card>
    </>
  )
}

/* ----------------------------- Security Panel ---------------------------- */

function SecurityPanel({ data }: { data: AccountSettingsPayload['security'] }) {
  const [sms2fa, setSms2fa] = useState<boolean>(data.sms2fa)
  const [app2fa, setApp2fa] = useState<boolean>(data.app2fa)

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2">
        <Card title="Password & Security">
          <div className="grid gap-4">
            <Field label="Current Password"><Input type="password" placeholder="Enter current password" icon={<KeyIcon className="size-5" />} /></Field>
            <Field label="New Password"><Input type="password" placeholder="Enter new password" /></Field>
            <Field label="Confirm New Password"><Input type="password" placeholder="Confirm new password" /></Field>
            <button className="mt-2 inline-flex items-center justify-center rounded-xl border border-neutral-300 px-5 py-2 text-base font-medium">
              Update Password
            </button>
          </div>
        </Card>

        <Card title="Two-Factor Authentication">
          <div className="space-y-4">
            <Row>
              <div>
                <div className="font-medium">SMS Authentication</div>
                <div className="text-sm text-neutral-600">Receive codes via SMS</div>
              </div>
              <Switch checked={sms2fa} onChange={setSms2fa} />
            </Row>
            <Row>
              <div>
                <div className="font-medium">Authenticator App</div>
                <div className="text-sm text-neutral-600">Use Google Authenticator</div>
              </div>
              <Switch checked={app2fa} onChange={setApp2fa} />
            </Row>
            <div className="pt-2">
              <div className="font-medium">Backup Codes</div>
              <p className="text-sm text-neutral-600">Generate backup codes in case you lose access to your phone</p>
              <button className="mt-2 rounded-xl border border-neutral-300 px-4 py-2 text-base font-medium">
                Generate Backup Codes
              </button>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Active Sessions">
        <div className="flex items-center justify-end">
          <button className="mb-3 inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-base font-medium text-red-600">
            <LogoutIcon className="size-5" /> Log Out All Devices
          </button>
        </div>
        <div className="space-y-3">
          {data.sessions.map((s, i) => (
            <SessionItem
              key={i}
              label={s.label}
              sub={s.sub}
              ip={s.ip}
              chip={s.current ? 'Current' : undefined}
            />
          ))}
        </div>
      </Card>
    </>
  )
}

/* --------------------------- Preferences Panel --------------------------- */

function PreferencesPanel({ data }: { data: AccountSettingsPayload['preferences'] }) {
  const [pref, setPref] = useState(data)

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card title="Theme & Display">
        <div className="grid gap-4">
          <Field label="Theme">
            <Select
              options={['Dark Mode', 'Light Mode', 'System']}
              defaultValue={pref.theme}
              onChange={(v) => setPref({ ...pref, theme: v as any })}
            />
          </Field>
          <Field label="Language">
            <Select
              options={['English', 'ไทย', 'Español']}
              defaultValue={pref.language}
              onChange={(v) => setPref({ ...pref, language: v as any })}
            />
          </Field>
          <Field label="Timezone">
            <Select
              options={['Eastern Time (UTC-5)', 'UTC', 'Bangkok (UTC+7)']}
              defaultValue={pref.timezone}
              onChange={(v) => setPref({ ...pref, timezone: v })}
            />
          </Field>
        </div>
      </Card>

      <Card title="Laboratory Preferences">
        <div className="grid gap-4">
          <Field label="Default Sample View">
            <Select
              options={['Table View', 'Card View']}
              defaultValue={pref.defaultSampleView}
              onChange={(v) => setPref({ ...pref, defaultSampleView: v as any })}
            />
          </Field>
          <Field label="Results Per Page">
            <Select
              options={['10 results', '25 results', '50 results']}
              defaultValue={pref.resultsPerPage}
              onChange={(v) => setPref({ ...pref, resultsPerPage: v as any })}
            />
          </Field>

          <Row>
            <div>
              <div className="font-medium">Auto-refresh Data</div>
              <div className="text-sm text-neutral-600">Automatically refresh sample data</div>
            </div>
            <Switch checked={pref.autoRefresh} onChange={(v) => setPref({ ...pref, autoRefresh: v })} />
          </Row>

          <Row>
            <div>
              <div className="font-medium">Show Sample IDs</div>
              <div className="text-sm text-neutral-600">Display full sample identifiers</div>
            </div>
            <Switch checked={pref.showSampleIds} onChange={(v) => setPref({ ...pref, showSampleIds: v })} />
          </Row>
        </div>
      </Card>
    </div>
  )
}

/* -------------------------- Notifications Panel ------------------------- */

function NotificationsPanel({ data }: { data: AccountSettingsPayload['notifications'] }) {
  const [n, setN] = useState(data)

  return (
    <>
      <Card title="Notification Preferences">
        <div className="space-y-4">
          <Row>
            <NotifyIcon label="Email Notifications" desc="Receive updates via email" icon={<MailIcon className="size-5" />} />
            <Switch checked={n.email} onChange={(v) => setN({ ...n, email: v })} />
          </Row>
          <Row>
            <NotifyIcon label="Push Notifications" desc="Browser and mobile notifications" icon={<BellIcon className="size-5" />} />
            <Switch checked={n.push} onChange={(v) => setN({ ...n, push: v })} />
          </Row>
          <Row>
            <NotifyIcon label="SMS Notifications" desc="Critical alerts via text message" icon={<PhoneIcon className="size-5" />} />
            <Switch checked={n.sms} onChange={(v) => setN({ ...n, sms: v })} />
          </Row>
          <Row>
            <NotifyIcon label="Security Alerts" desc="Login attempts and security events" icon={<ShieldIcon className="size-5" />} />
            <Switch checked={n.security} onChange={(v) => setN({ ...n, security: v })} />
          </Row>
        </div>

        <div className="mt-6 border-t border-neutral-200 pt-6">
          <h4 className="text-base font-semibold">Laboratory Notifications</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Row>
              <div className="font-medium">Sample Status Updates</div>
              <Switch checked={n.labQualityControl} onChange={(v) => setN({ ...n, labQualityControl: v })} />
            </Row>
            <Row>
              <div className="font-medium">Report Generation</div>
              <Switch checked={n.labReportGeneration} onChange={(v) => setN({ ...n, labReportGeneration: v })} />
            </Row>
          </div>
        </div>
      </Card>

      <Card>
        <div className="rounded-2xl border border-red-300 p-4">
          <h4 className="text-base font-semibold text-red-700">Danger Zone</h4>
          <p className="mt-1 text-sm text-red-700/80">
            Permanently delete your account and all associated data
          </p>
          <button className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-400 px-4 py-2 text-base font-medium text-red-700">
            <TrashIcon className="size-5" /> Delete Account
          </button>
        </div>
      </Card>
    </>
  )
}

/* --------------------------------- UI ----------------------------------- */

function Card({ title, action, children }: { title?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 p-5 shadow-sm md:p-6">
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h3 className="text-lg font-semibold">{title}</h3> : <span />}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <div className="mb-1 text-sm font-medium text-neutral-700">{label}</div>
      {children}
    </label>
  )
}

function Input({ icon, className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }) {
  return (
    <div className="relative">
      {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
      <input
        className={`h-11 w-full rounded-xl border border-neutral-300 px-3 text-base outline-none placeholder:text-neutral-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 ${icon ? 'pl-9' : ''} ${className}`}
        {...props}
      />
    </div>
  )
}

function Select({
  options,
  defaultValue,
  onChange,
}: {
  options: string[]
  defaultValue?: string
  onChange?: (value: string) => void
}) {
  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => onChange?.(e.target.value)}
      className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-base outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
}

/** Switch without background color — uses border + moving knob */
function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors ${
        checked ? 'border-indigo-600' : 'border-neutral-300'
      }`}
    >
      <span
        className={`inline-block size-6 translate-x-0.5 rounded-full border border-neutral-300 transition-transform ${
          checked ? 'translate-x-5 border-indigo-600' : ''
        }`}
      />
    </button>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 p-3">{children}</div>
}

function NotifyIcon({ label, desc, icon }: { label: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-neutral-500">{icon}</div>
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-neutral-600">{desc}</div>
      </div>
    </div>
  )
}

function SessionItem({ label, sub, ip, chip }: { label: string; sub: string; ip: string; chip?: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-3">
      <div className="flex items-start gap-3">
        <ScreenIcon className="mt-0.5 size-5 text-neutral-500" />
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-sm text-neutral-600">
            {sub} · IP: {ip}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {chip && <span className="rounded-full border border-indigo-600 px-2 py-0.5 text-xs font-medium text-indigo-700">{chip}</span>}
        <button className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm">End Session</button>
      </div>
    </div>
  )
}

function TabButton({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex w-1/4 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-base font-medium ${
        active ? 'border border-indigo-600 text-indigo-700' : 'text-neutral-700'
      }`}
    >
      {children}
    </button>
  )
}

/* ----------------------------- Inline Icons ----------------------------- */

function LoginIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="1.8" d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
      <path strokeWidth="1.8" d="M9 12H3" />
      <path strokeWidth="1.8" d="M12 9l-3 3 3 3" />
    </svg>
  )
}

function LogoutIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="1.8" d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
      <path strokeWidth="1.8" d="M10 17l5-5-5-5" />
      <path strokeWidth="1.8" d="M15 12H3" />
    </svg>
  )
}

function UserIcon({ className = '' }) { return <Outline className={className} d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm7 9a7 7 0 0 0-14 0" /> }
function CameraIcon({ className = '' }) { return <Outline className={className} d="M4 7h3l2-2h6l2 2h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" /> }
function MailIcon({ className = '' }) { return <Outline className={className} d="M4 6h16v12H4z M22 6L12 13 2 6" /> }
function PhoneIcon({ className = '' }) { return <Outline className={className} d="M22 16.92V21a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72l.45 3a2 2 0 0 1-.57 1.86l-1.27 1.27a16 16 0 0 0 6.11 6.11l1.27-1.27a2 2 0 0 1 1.86-.57l3 .45A2 2 0 0 1 22 16.92z" /> }
function BeakerIcon({ className = '' }) { return <Outline className={className} d="M10 2v6L4 20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2L14 8V2" /> }
function KeyIcon({ className = '' }) { return <Outline className={className} d="M21 7a5 5 0 1 1-9.9 1H5l-3 3v3h3v3h3v3h3l3-3v-6.1A5 5 0 0 1 21 7z" /> }
function ScreenIcon({ className = '' }) { return <Outline className={className} d="M3 4h18v12H3z M8 20h8" /> }
function BellIcon({ className = '' }) { return <Outline className={className} d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" /> }
function SparkIcon({ className = '' }) { return <Outline className={className} d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" /> }
function TrashIcon({ className = '' }) { return <Outline className={className} d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /> }
function LockIcon({ className = '' }) { return <Outline className={className} d="M17 11H7V7a5 5 0 0 1 10 0v4z M5 11h14v10H5z" /> }

function Outline({ d, className = 'size-5' }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d={d} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
