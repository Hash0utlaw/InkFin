import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">InkFinder</Link>
          <div className="flex items-center space-x-4">
            <ul className="flex space-x-4">
              <li><Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300">Home</Link></li>
              <li><Link href="/search" className="hover:text-gray-600 dark:hover:text-gray-300">Search</Link></li>
              <li><Link href="/design" className="hover:text-gray-600 dark:hover:text-gray-300">Design</Link></li>
              <li><Link href="/about" className="hover:text-gray-600 dark:hover:text-gray-300">About Us</Link></li>
            </ul>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}