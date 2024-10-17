'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Search, Users, User, Store, Palette, Image, Info, LogIn, UserPlus, UserCircle } from 'lucide-react'
import SignOutButton from './SignOutButton'
import ThemeToggle from './ThemeToggle'

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/profile', label: 'My Profile', icon: UserCircle },
  { href: '/artist', label: 'Artists', icon: Users },
  { href: '/shop', label: 'Shops', icon: Store },
  { href: '/design', label: 'Design', icon: Palette },
  { href: '/gallery', label: 'Gallery', icon: Image },
  { href: '/about', label: 'About Us', icon: Info },
  { href: '/signin', label: 'Sign In', icon: LogIn },
  { href: '/signup', label: 'Sign Up', icon: UserPlus },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            InkFinder
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <ul className="flex space-x-4">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <SignOutButton />
            <ThemeToggle />
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition duration-150 ease-in-out"
              aria-label="Toggle menu"
            >
              {!isOpen ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            {menuItems.map((item) => (
              <motion.div
                key={item.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-3 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <div className="px-4 py-3">
              <SignOutButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}