'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Search, Users, Store, Palette, Image, Info, LogIn, UserPlus, UserCircle } from 'lucide-react'
import SignOutButton from './SignOutButton'
import ThemeToggle from './ThemeToggle'

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/explore', label: 'Explore', icon: Users, subItems: [
    { href: '/artist', label: 'Artists', icon: Users },
    { href: '/shop', label: 'Shops', icon: Store },
  ]},
  { href: '/create', label: 'Create', icon: Palette, subItems: [
    { href: '/design', label: 'Design', icon: Palette },
    { href: '/gallery', label: 'Gallery', icon: Image },
  ]},
  { href: '/about', label: 'About', icon: Info },
  { href: '/signin', label: 'Account', icon: LogIn, subItems: [
    { href: '/signin', label: 'Sign In', icon: LogIn },
    { href: '/signup', label: 'Sign Up', icon: UserPlus },
  ]},
]

const MotionLink = motion(Link)

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/80 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <MotionLink
            href="/"
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            InkFinder
          </MotionLink>
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <motion.div key={item.href} className="relative group">
                <MotionLink
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                    pathname === item.href || (item.subItems && item.subItems.some(subItem => pathname === subItem.href))
                      ? 'text-purple-500 bg-gray-800/50'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </MotionLink>
                {item.subItems && (
                  <motion.div
                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <div className="py-1">
                      {item.subItems.map((subItem) => (
                        <MotionLink
                          key={subItem.href}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                          whileHover={{ x: 5 }}
                        >
                          <subItem.icon className="w-4 h-4 inline-block mr-2" />
                          {subItem.label}
                        </MotionLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
            <SignOutButton />
            <ThemeToggle />
          </div>
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition duration-150 ease-in-out"
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {!isOpen ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-gray-900/95 backdrop-blur-md"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <MotionLink
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-base font-medium transition duration-150 ease-in-out ${
                    pathname === item.href
                      ? 'text-purple-500 bg-gray-800/50'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                  onClick={() => !item.subItems && setIsOpen(false)}
                  whileHover={{ x: 5 }}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </MotionLink>
                {item.subItems && (
                  <div className="ml-6 mt-2 space-y-2">
                    {item.subItems.map((subItem) => (
                      <MotionLink
                        key={subItem.href}
                        href={subItem.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-400 hover:text-white transition duration-150 ease-in-out"
                        onClick={() => setIsOpen(false)}
                        whileHover={{ x: 5 }}
                      >
                        <subItem.icon className="w-4 h-4 mr-2" />
                        {subItem.label}
                      </MotionLink>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: menuItems.length * 0.05 }}
              className="px-4 py-3 space-y-3"
            >
              <SignOutButton />
              <ThemeToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}