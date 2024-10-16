'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import Link from 'next/link'
import type { Database } from '@/lib/database.types'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Book, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

interface SavedDesign {
  id: string
  user_id: string
  prompt: string
  image_path?: string
  image_url?: string
  created_at: string
}

export default function GalleryView() {
  const [designs, setDesigns] = useState<SavedDesign[]>([])
  const [signedUrls, setSignedUrls] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const supabase = createClientComponentClient<Database>()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const background = useTransform(
    scrollYProgress,
    [0, 1],
    ["hsl(0, 0%, 100%)", "hsl(0, 0%, 95%)"]
  )

  const fetchSavedDesigns = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Please sign in to view your saved designs.')
        return
      }

      const { data, error } = await supabase
        .from('saved_designs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDesigns(data || [])

      const urls: { [key: string]: string } = {}
      for (const design of data || []) {
        const imagePath = design.image_path || design.image_url
        if (imagePath) {
          const signedUrl = await fetchSignedUrl(imagePath)
          urls[design.id] = signedUrl
        }
      }
      setSignedUrls(urls)
    } catch (err) {
      setError('Failed to fetch saved designs')
      console.error('Error fetching saved designs:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchSavedDesigns()
  }, [fetchSavedDesigns])

  const fetchSignedUrl = async (imagePath: string): Promise<string> => {
    try {
      const response = await fetch(`/api/get-signed-url?path=${encodeURIComponent(imagePath)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch signed URL')
      }
      const data = await response.json()
      return data.signedUrl
    } catch (error) {
      console.error('Error fetching signed URL:', error)
      return ''
    }
  }

  const nextPage = () => {
    if (currentPage < designs.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg shadow-lg">
        <p className="text-xl font-semibold mb-2">Error</p>
        <p>{error}</p>
      </div>
    </div>
  )

  return (
    <motion.div 
      ref={containerRef}
      className="min-h-screen py-16 px-4 flex flex-col items-center justify-center"
      style={{ background }}
    >
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Tattoo Design Portfolio
      </motion.h1>
      {designs.length > 0 ? (
        <div className="w-full max-w-4xl aspect-[3/4] relative bg-white rounded-lg shadow-2xl overflow-hidden">
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {signedUrls[designs[currentPage].id] && (
              <Image 
                src={signedUrls[designs[currentPage].id]}
                alt={designs[currentPage].prompt}
                layout="fill"
                objectFit="contain"
                className="p-8"
              />
            )}
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
            <motion.p 
              className="text-white text-xl mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {designs[currentPage].prompt}
            </motion.p>
            <motion.p 
              className="text-gray-300 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Created on: {new Date(designs[currentPage].created_at).toLocaleDateString()}
            </motion.p>
          </div>
          <div className="absolute top-1/2 left-4 right-4 flex justify-between items-center -translate-y-1/2">
            <motion.button
              className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-gray-800 disabled:opacity-30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-gray-800 disabled:opacity-30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextPage}
              disabled={currentPage === designs.length - 1}
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </div>
      ) : (
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Book className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl mb-6 text-gray-600">Your portfolio is empty. Start by creating your first design!</p>
          <Link href="/design" className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Create a Design
          </Link>
        </motion.div>
      )}
      {designs.length > 0 && (
        <motion.p 
          className="mt-4 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Page {currentPage + 1} of {designs.length}
        </motion.p>
      )}
    </motion.div>
  )
}