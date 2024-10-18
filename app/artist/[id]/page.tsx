'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ArtistProfile from '@/components/ArtistProfile'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'

type Artist = Database['public']['Tables']['artists']['Row']

export default function ArtistPage() {
  const [artist, setArtist] = useState<Artist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function fetchArtist() {
      if (!params.id || typeof params.id !== 'string') {
        setError('Invalid artist ID')
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setArtist(data)
      }
      setIsLoading(false)
    }

    fetchArtist()
  }, [params.id, supabase])

  const handleSave = async (updatedData: Partial<Artist>) => {
    if (!artist) return

    const { data, error } = await supabase
      .from('artists')
      .update(updatedData)
      .eq('id', artist.id)
      .select()
      .single()

    if (error) {
      setError(error.message)
    } else {
      setArtist(data)
    }
  }

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

  if (!artist) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">Artist Not Found</h1>
        <p className="text-xl text-gray-300">The requested artist could not be found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/profile" className="inline-flex items-center mb-8 text-purple-400 hover:text-purple-300 transition-colors duration-300">
            <ArrowLeft className="mr-2" /> Back to My Profile
          </Link>
        </motion.div>

        <AnimatePresence>
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ArtistProfile artist={artist} isEditable={true} onSave={handleSave} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}