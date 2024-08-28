import React from 'react';
import Image from 'next/image';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/about-background.jpg.png')" }}>
      <div className="bg-white bg-opacity-45 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">About InkFinder</h1>
          
          <div className="max-w-3xl mx-auto">
            <Image
              src="/images/about-us-header.jpg"
              alt="InkFinder Team"
              width={800}
              height={400}
              className="rounded-lg shadow-lg mb-8"
            />
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-700">
                At InkFinder, we're passionate about connecting tattoo enthusiasts with talented artists. Our mission is to make the process of finding the perfect tattoo artist and design as seamless and inspiring as possible. We believe that every tattoo tells a unique story, and we're here to help you write yours.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <ul className="list-disc list-inside text-gray-700">
                <li>A curated database of skilled tattoo artists across various styles</li>
                <li>Advanced search functionality to find artists based on style, location, and price range</li>
                <li>AI-powered tattoo design generation for inspiration</li>
                <li>A platform for artists to showcase their work and connect with clients</li>
                <li>Educational resources on tattoo aftercare and safety</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-gray-700">
                InkFinder was born out of a shared love for tattoo art and a frustration with the difficulty of finding the right artist. Our team of developers, designers, and tattoo enthusiasts came together to create a platform that simplifies this process and celebrates the art of tattooing. We understand the importance of finding an artist who can bring your vision to life, and we're committed to making that journey easier and more enjoyable.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <ul className="list-disc list-inside text-gray-700">
                <li>Artistic Integrity: We respect and celebrate the unique vision of each artist and client</li>
                <li>Safety First: We promote best practices in tattoo safety and aftercare</li>
                <li>Innovation: We're constantly exploring new ways to enhance the tattoo discovery experience</li>
                <li>Community: We foster a supportive and inclusive environment for all tattoo lovers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
              <p className="text-gray-700">
                Whether you're a first-time tattoo seeker or a seasoned collector, InkFinder is here to help you on your journey. Join our community today and be part of the future of tattoo discovery! Follow us on social media for the latest updates, featured artists, and tattoo inspiration.
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                {/* Add your social media icons/links here */}
                <a href="#" className="text-blue-500 hover:text-blue-700">Facebook</a>
                <a href="#" className="text-blue-400 hover:text-blue-600">Discord</a>
                <a href="#" className="text-pink-500 hover:text-pink-700">Instagram</a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}