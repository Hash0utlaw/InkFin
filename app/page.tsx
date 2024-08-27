'use client'
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/images/home-background.jpg.png')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">Welcome to InkFinder</h1>
        <p className="text-xl mb-12 text-center max-w-2xl">
          Discover talented tattoo artists and bring your ink ideas to life with AI-powered design generation.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/search" className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
            Search Artists
          </Link>
          <Link href="/design" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300">
            Create Design
          </Link>
        </div>
      </div>
    </main>
  );
}
