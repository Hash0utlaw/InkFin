'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useAnimation, useInView } from 'framer-motion'
import { ArrowRight, Search, Palette } from 'lucide-react'

const titleText = "Welcome to InkFinder"

export default function Home() {
  const controls = useAnimation()
  const titleRef = useRef(null)
  const isInView = useInView(titleRef, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  useEffect(() => {
    const interval = setInterval(() => {
      controls.start((i) => ({
        y: Math.random() * 10 - 5,
        transition: { duration: 0.5 + Math.random() * 0.5 },
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        duration: 0.5,
      },
    },
  };

  return (
    <main className="min-h-screen bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: "url('/images/home-background.jpg.png')" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 text-white">
        <motion.h1 
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 relative"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 opacity-50 bg-[length:200%_100%] animate-gradient-x"></span>
          {titleText.split("").map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              className="relative inline-block"
              variants={letterVariants}
              whileHover={{
                scale: 1.2,
                rotate: Math.random() * 10 - 5,
                transition: { type: "spring", stiffness: 300, damping: 10 },
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
          className="text-lg sm:text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-300 text-center px-4"
        >
          Discover talented tattoo artists and bring your ink ideas to life with AI-powered design generation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="grid sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-md px-4"
        >
          <Link href="/search" className="group bg-white text-gray-800 px-6 py-4 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center space-x-2 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-pink-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="transition-transform duration-300 group-hover:translate-x-1">Search Artists</span>
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-all duration-300 absolute right-4" />
          </Link>
          <Link href="/design" className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition duration-300 flex items-center justify-center space-x-2 overflow-hidden relative">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <Palette className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="transition-transform duration-300 group-hover:translate-x-1">Create Design</span>
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-all duration-300 absolute right-4" />
          </Link>
        </motion.div>
      </div>
    </main>
  )
}