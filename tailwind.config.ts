export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: { extend: {
    colors: {
      bg: 'var(--color-bg)',
      card: 'var(--color-card)',
      border: 'var(--color-border)',
      foreground: 'var(--color-foreground)',
      muted: 'var(--color-muted)',

      'status-pass': 'var(--status-pass)',
      'status-warn': 'var(--status-warn)',
      'status-fail': 'var(--status-fail)',
      'status-info': 'var(--status-info)',
    },
  } },
  plugins: [],
}


