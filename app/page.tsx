'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Search, Palette } from 'lucide-react'


const titleText = "Welcome to InkFinder"

export default function Home() {
  return (
    <main className="min-h-screen bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: "url('/images/home-background.jpg.png')" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-white">
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold mb-6 relative"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.04,
                delayChildren: 0.2,
              },
            },
          }}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 opacity-50 bg-[length:200%_100%] animate-gradient-x"></span>
          {titleText.split("").map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              className="relative inline-block"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    damping: 12,
                    stiffness: 200,
                  },
                },
              }}
              whileHover={{
                scale: 1.1,
                rotate: Math.random() * 10 - 5,
                transition: { duration: 0.2 },
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-300 text-center"
        >
          Discover talented tattoo artists and bring your ink ideas to life with AI-powered design generation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="grid md:grid-cols-2 gap-6 w-full max-w-md"
        >
          <Link href="/search" className="group bg-white text-gray-800 px-6 py-4 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search Artists</span>
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
          </Link>
          <Link href="/design" className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition duration-300 flex items-center justify-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Create Design</span>
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
          </Link>
        </motion.div>
      </div>
    </main>
  )
}