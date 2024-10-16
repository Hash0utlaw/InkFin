'use client'

import React from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, Variants } from 'framer-motion'
import { Palette, Users, Zap, Heart } from 'lucide-react'

export default function AboutPage() {
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2])

  const fadeInUp: Variants = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 }
  }

  const fadeInUpTransition = { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-12 text-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-gradient-x">
            About InkFinder
          </span>
        </motion.h1>

        <motion.div 
          className="grid md:grid-cols-2 gap-12 items-center"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div>
            <motion.p 
              className="text-xl mb-6 leading-relaxed"
              variants={fadeInUp}
            >
              InkFinder isn&apos;t just a tattoo design app; it&apos;s a gateway to self-expression and creativity. Our platform combines cutting-edge AI technology with a passion for artistic expression, making it easier than ever to bring your tattoo ideas to life.
            </motion.p>
            <motion.p 
              className="text-xl mb-6 leading-relaxed"
              variants={fadeInUp}
            >
              Whether you&apos;re a first-time tattoo enthusiast or a seasoned collector, InkFinder provides the tools and inspiration you need to find your perfect design.
            </motion.p>
          </div>
          <motion.div 
            className="relative h-80 rounded-lg overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ scale }}
          >
            <Image 
              src="/images/about-image.jpg" 
              alt="Tattoo artist at work" 
              layout="fill"
              objectFit="cover"
            />
          </motion.div>
        </motion.div>

        <motion.h2 
          className="text-3xl md:text-5xl font-bold mt-16 mb-8 text-center"
          variants={fadeInUp}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500">
            Our Mission
          </span>
        </motion.h2>

        <motion.p 
          className="text-xl text-center mb-12 max-w-3xl mx-auto"
          variants={fadeInUp}
        >
          To empower individuals to express themselves through unique, personalized tattoo designs, bridging the gap between imagination and reality.
        </motion.p>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
          variants={fadeInUp}
        >
          {[
            { icon: Palette, title: "Artistic Innovation", description: "Pushing the boundaries of tattoo design with AI" },
            { icon: Users, title: "Community-Driven", description: "Connecting artists and enthusiasts worldwide" },
            { icon: Zap, title: "Instant Inspiration", description: "Generate unique designs in seconds" },
            { icon: Heart, title: "Passion for Art", description: "Celebrating the beauty of tattoo culture" },
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="bg-gray-900 p-6 rounded-lg shadow-lg border border-red-500"
              whileHover={{ scale: 1.05, borderColor: "#FFD700" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <item.icon className="w-12 h-12 mb-4 text-yellow-500" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-red-400">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-20 text-center"
          variants={fadeInUp}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-red-500">
              Join the InkFinder Revolution
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Be part of a community that&apos;s redefining the future of tattoo art.
          </motion.p>
          <motion.button 
            className="bg-gradient-to-r from-red-600 to-yellow-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
