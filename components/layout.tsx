'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <html lang="en" className={theme}>
      <body>
        <button
          className="fixed top-4 right-4 p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        {children}
      </body>
    </html>
  )
}