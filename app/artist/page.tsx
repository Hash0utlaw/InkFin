'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Loader2, ArrowLeft } from 'lucide-react'

type Artist = Database['public']['Tables']['artists']['Row']

export default function ArtistIndexPage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function fetchArtists() {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .limit(10)  // Adjust this limit as needed

      if (error) {
        setError(error.message)
      } else {
        setArtists(data || [])
      }
      setIsLoading(false)
    }

    fetchArtists()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-xl text-gray-300">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/profile" className="inline-flex items-center mb-8 text-purple-400 hover:text-purple-300 transition-colors duration-300">
          <ArrowLeft className="mr-2" /> Back to My Profile
        </Link>
      </motion.div>

      <motion.h1
        className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Featured Artists
      </motion.h1>

      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {artists.map((artist) => (
            <motion.div
              key={artist.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <Link href={`/artist/${artist.id}`} className="block p-6 hover:bg-gray-700 transition duration-300">
                <h2 className="text-2xl font-semibold mb-2 text-purple-400">{artist.name}</h2>
                <p className="text-gray-400 mb-4">{artist.bio ? artist.bio.substring(0, 100) + '...' : 'No bio available'}</p>
                <div className="flex items-center text-pink-500">
                  <Users className="w-5 h-5 mr-2" />
                  <span>View Profile</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}