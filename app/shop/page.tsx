'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ShopProfile from '@/components/ShopProfile'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'

type Shop = Database['public']['Tables']['shops']['Row']

export default function ShopPage() {
  const [shop, setShop] = useState<Shop | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function fetchShop() {
      if (!params.id || typeof params.id !== 'string') {
        setError('Invalid shop ID')
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setShop(data)
      }
      setIsLoading(false)
    }

    fetchShop()
  }, [params.id, supabase])

  const handleSave = async (updatedData: Partial<Shop>) => {
    if (!shop) return

    const { data, error } = await supabase
      .from('shops')
      .update(updatedData)
      .eq('id', shop.id)
      .select()
      .single()

    if (error) {
      setError(error.message)
    } else {
      setShop(data)
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

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">Shop Not Found</h1>
        <p className="text-xl text-gray-300">The requested shop could not be found.</p>
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
            key={shop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ShopProfile shop={shop} isEditable={true} onSave={handleSave} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}