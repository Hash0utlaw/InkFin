
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">InkFinder</Link>
        <ul className="flex space-x-4">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/search">Search</Link></li>
          <li><Link href="/design">Design</Link></li>
          <li><Link href="/about">About Us</Link></li>
        </ul>
      </div>
    </nav>
  )
}