'use client'
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to InkFinder</h1>
        <p className="text-xl mb-12">
          Discover talented tattoo artists and bring your ink ideas to life with AI-powered design generation.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <FeatureCard 
            title="Find Tattoo Artists" 
            description="Search for talented tattoo artists based on style, location, and more. Connect with the perfect artist for your next ink."
            link="/search"
            linkText="Search Artists"
          />
          <FeatureCard 
            title="AI Tattoo Design" 
            description="Use our cutting-edge AI to generate unique tattoo designs based on your ideas. Get inspired and visualize your next tattoo."
            link="/design"
            linkText="Create Design"
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description, link, linkText }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
      </div>
      <Link href={link} className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300 inline-block">
        {linkText}
      </Link>
    </div>
  );
}