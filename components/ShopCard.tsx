import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Phone, Globe, MapPin, Star, DollarSign } from 'lucide-react'

export interface Shop {
  id: number
  name: string
  type: 'shop'
  image?: string
  location: string
  priceRange: string
  style?: string
  Phone?: string
  Website?: string
  Email?: string
  Rating?: number
  Reviews?: number
  clean_address?: string
  State?: string
}

export default function ShopCard({ shop, searchType }: { shop: Shop, searchType: 'location' | 'general' }) {
  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="relative h-48 w-full">
        <Image 
          src={shop.image || '/images/placeholder-artist.jpg'}
          alt={shop.name}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <h2 className="text-2xl font-bold p-4 text-white">{shop.name}</h2>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <motion.p 
          className="text-gray-300 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <MapPin size={16} className="mr-2 text-red-500" />
          {searchType === 'location' ? shop.clean_address : shop.location}
          {shop.State && `, ${shop.State}`}
        </motion.p>
        {shop.style && (
          <motion.p 
            className="text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Style: <span className="text-purple-400">{shop.style}</span>
          </motion.p>
        )}
        {shop.Rating && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Star size={16} className="mr-2 text-yellow-500" />
            {shop.Rating.toFixed(1)}/5 ({shop.Reviews} reviews)
          </motion.p>
        )}
        <motion.p 
          className="text-gray-300 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <DollarSign size={16} className="mr-2 text-green-500" />
          {shop.priceRange}
        </motion.p>
        {shop.Phone && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Phone size={16} className="mr-2 text-blue-500" />
            <a href={`tel:${shop.Phone}`} className="hover:text-blue-400 transition-colors">{shop.Phone}</a>
          </motion.p>
        )}
        {shop.Website && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Globe size={16} className="mr-2 text-indigo-500" />
            <a href={shop.Website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              Visit Website
            </a>
          </motion.p>
        )}
        {shop.Email && (
          <motion.p 
            className="text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Email: <span className="text-teal-400">{shop.Email}</span>
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}