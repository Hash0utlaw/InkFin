import React from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">InkFinder</Link>
          <ul className="flex space-x-4">
            <li><Link href="/" className="hover:text-blue-200">Home</Link></li>
            <li><Link href="/design" className="hover:text-blue-200">Design Tattoo</Link></li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          © 2024 InkFinder. All rights reserved.
        </div>
      </footer>
    </div>
  );
}