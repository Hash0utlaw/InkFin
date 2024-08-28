'use client';

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">InkFinder</Link>
          <div className="hidden md:flex items-center space-x-4">
            <ul className="flex space-x-4">
              <li><Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300">Home</Link></li>
              <li><Link href="/search" className="hover:text-gray-600 dark:hover:text-gray-300">Search</Link></li>
              <li><Link href="/design" className="hover:text-gray-600 dark:hover:text-gray-300">Design</Link></li>
              <li><Link href="/about" className="hover:text-gray-600 dark:hover:text-gray-300">About Us</Link></li>
              <li><Link href="/signin" className="hover:text-gray-600 dark:hover:text-gray-300">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-gray-600 dark:hover:text-gray-300">Sign Up</Link></li>
            </ul>
            <ThemeToggle />
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-gray-700">Home</Link>
            <Link href="/search" className="block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-gray-700">Search</Link>
            <Link href="/design" className="block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-gray-700">Design</Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-gray-700">About Us</Link>
            <Link href="/signin" className="block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-gray-700">Sign In</Link>
            <Link href="/signup" className="block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-gray-700">Sign Up</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}