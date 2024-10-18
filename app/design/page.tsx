'use client'

import React from 'react'
import TattooDesignGenerator from '@/components/TattooDesignGenerator'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'


export default function DesignPage() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed relative overflow-hidden design-background">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 to-pink-600/70 mix-blend-overlay"></div>
      <div className="relative z-10 min-h-screen">
        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                yoyo: Infinity,
                repeatDelay: 5
              }}
            >
              Create Your Custom Tattoo Design
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-yellow-300 max-w-3xl mx-auto font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5, staggerChildren: 0.1 }}
              >
                {["Use", "our", "AI-powered", "tool", "to", "bring", "your", "tattoo", "ideas", "to", "life.", "Describe", "your", "vision,", "and", "watch", "as", "we", "generate", "a", "unique", "design", "just", "for", "you."].map((word, index) => (
                  <motion.span
                    key={index}
                    className="inline-block mr-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.span>
            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white text-purple-700">
                <Sparkles className="w-5 h-5 mr-2" />
                AI-Powered Design
              </span>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <TattooDesignGenerator />
          </motion.div>
        </main>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
    </div>
  )
}
