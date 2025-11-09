'use client'
import { useEffect, useState } from 'react'

export function ThemeDebug() {
  const [cls, setCls] = useState('')
  const [bg, setBg] = useState('')

  useEffect(() => {
    const html = document.documentElement
    setCls(html.className)
    setBg(getComputedStyle(html).getPropertyValue('--color-background').trim())
  }, [])

  return (
    <pre className="fixed bottom-3 right-3 bg-card border border-border rounded-md p-2 text-xs z-50">
      html.class = "{cls}"{'\n'}
      --color-background = {bg}
    </pre>
  )
}
