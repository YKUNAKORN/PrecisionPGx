"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Darkmode() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="!border-none">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// 'use client'
// import { useEffect, useState } from 'react'
// import { useTheme } from 'next-themes'

// export function Darkmode() {
//   const { theme, setTheme, systemTheme } = useTheme()
//   const [mounted, setMounted] = useState(false)
//   useEffect(() => setMounted(true), [])
//   if (!mounted) return null

//   const current = theme === 'system' ? systemTheme : theme

//   return (
//     <div className="inline-flex items-center gap-2">
//       <button
//         onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
//         className="rounded-lg border border-border px-3 py-1.5 bg-card"
//         title="Toggle theme"
//       >
//         {current === 'dark' ? '🌙 Dark' : '☀️ Light'}
//       </button>

//       <select
//         onChange={(e) => setTheme(e.target.value)}
//         value={theme}
//         className="rounded-md border border-border bg-card px-2 py-1 text-sm"
//       >
//         <option value="system">System</option>
//         <option value="light">Light</option>
//         <option value="dark">Dark</option>
//       </select>
//     </div>
//   )
// }
