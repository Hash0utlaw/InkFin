'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('ThemeToggle mounted, current theme:', theme);
  }, [theme])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('Toggling theme to:', newTheme);
    setTheme(newTheme);
  }

  return (
    <button
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? '🌞' : '🌙'} (Current: {theme})
    </button>
  )
}