export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}

// // tailwind.config.ts
// import type { Config } from "tailwindcss"

// export default {
//   darkMode: ["class"],
//   content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         background: "oklch(var(--color-background) / <alpha-value>)",
//         foreground: "oklch(var(--color-foreground) / <alpha-value>)",

//         primary: "oklch(var(--color-primary) / <alpha-value>)",
//         "primary-foreground": "oklch(var(--color-primary-foreground) / <alpha-value>)",

//         secondary: "oklch(var(--color-secondary) / <alpha-value>)",
//         "secondary-foreground": "oklch(var(--color-secondary-foreground) / <alpha-value>)",

//         muted: "oklch(var(--color-muted) / <alpha-value>)",
//         "muted-foreground": "oklch(var(--color-muted-foreground) / <alpha-value>)",

//         accent: "oklch(var(--color-accent) / <alpha-value>)",
//         "accent-foreground": "oklch(var(--color-accent-foreground) / <alpha-value>)",

//         destructive: "oklch(var(--color-destructive) / <alpha-value>)",
//         "destructive-foreground": "oklch(var(--color-destructive-foreground) / <alpha-value>)",

//         border: "oklch(var(--color-border) / <alpha-value>)",
//         input: "oklch(var(--color-input) / <alpha-value>)",
//         ring: "oklch(var(--color-ring) / <alpha-value>)",

//         // ถ้ามี sidebar/chart ด้วยก็ใส่แบบเดียวกัน
//         sidebar: "oklch(var(--color-sidebar) / <alpha-value>)",
//         "sidebar-foreground": "oklch(var(--color-sidebar-foreground) / <alpha-value>)",
//         // ...
//       },
//     },
//   },
//   plugins: [],
// } satisfies Config
