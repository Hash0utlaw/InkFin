'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { Users, Store, ArrowLeft, Trash2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Profile = {
  type: 'artist' | 'shop'
  id: string
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function checkProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/signin')
        return
      }

      const { data: artist } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (artist) {
        setProfile({ type: 'artist', id: artist.id })
        setIsLoading(false)
        return
      }

      const { data: shop } = await supabase
        .from('shops')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (shop) {
        setProfile({ type: 'shop', id: shop.id })
        setIsLoading(false)
        return
      }

      setProfile(null)
      setIsLoading(false)
    }

    checkProfile()
  }, [router, supabase])

  const handleDeleteProfile = async () => {
    if (!profile) return

    const confirmDelete = window.confirm(`Are you sure you want to delete your ${profile.type} profile? This action cannot be undone.`)
    
    if (confirmDelete) {
      const { error } = await supabase
        .from(profile.type === 'artist' ? 'artists' : 'shops')
        .delete()
        .eq('id', profile.id)

      if (error) {
        console.error('Error deleting profile:', error)
        alert('Failed to delete profile. Please try again.')
      } else {
        setProfile(null)
        alert('Profile deleted successfully.')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
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
          <Link href="/" className="inline-flex items-center mb-8 text-purple-400 hover:text-purple-300 transition-colors duration-300">
            <ArrowLeft className="mr-2" /> Back to Home
          </Link>
        </motion.div>
        
        <motion.h1
          className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          My Profile
        </motion.h1>
        
        <AnimatePresence mode="wait">
          {profile ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 shadow-lg rounded-lg p-8 border border-purple-500"
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center text-purple-400">
                {profile.type === 'artist' ? <Users className="mr-2" /> : <Store className="mr-2" />}
                {profile.type === 'artist' ? 'Artist Profile' : 'Shop Profile'}
              </h2>
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <Link href={`/${profile.type}/${profile.id}`} className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-md hover:from-purple-600 hover:to-pink-600 transition duration-300 text-center">
                  View Profile
                </Link>
                <button onClick={handleDeleteProfile} className="w-full sm:w-auto bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition duration-300 flex items-center justify-center">
                  <Trash2 className="mr-2" /> Delete Profile
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="create-profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gray-800 shadow-lg rounded-lg p-8 border border-purple-500"
              >
                <h2 className="text-2xl font-semibold mb-4 flex items-center text-purple-400">
                  <Users className="mr-2" /> Artist Profile
                </h2>
                <p className="mb-6 text-gray-300">Create a profile to showcase your work and connect with potential clients.</p>
                <Link href="/artist/create" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-md hover:from-purple-600 hover:to-pink-600 transition duration-300 inline-flex items-center justify-center w-full">
                  <Users className="mr-2" /> Create Artist Profile
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gray-800 shadow-lg rounded-lg p-8 border border-pink-500"
              >
                <h2 className="text-2xl font-semibold mb-4 flex items-center text-pink-400">
                  <Store className="mr-2" /> Shop Profile
                </h2>
                <p className="mb-6 text-gray-300">Create a profile for your tattoo shop to attract customers and showcase your artists.</p>
                <Link href="/shop/create" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-md hover:from-pink-600 hover:to-purple-600 transition duration-300 inline-flex items-center justify-center w-full">
                  <Store className="mr-2" /> Create Shop Profile
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}