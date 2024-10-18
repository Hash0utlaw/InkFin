import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Phone, Globe, MapPin, Star, DollarSign, Users, Briefcase, Mail, Instagram, Facebook, Twitter } from 'lucide-react'

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
  services?: string[]
  artistCount?: number
  instagram?: string
  facebook?: string
  twitter?: string
}

// Helper function to ensure URL has a protocol
const ensureHttps = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

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
          src={shop.image || '/images/placeholder-shop.jpg'}
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
        {shop.artistCount !== undefined && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Users size={16} className="mr-2 text-blue-500" />
            Artists: {shop.artistCount}
          </motion.p>
        )}
        {shop.services && shop.services.length > 0 && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Briefcase size={16} className="mr-2 text-indigo-500" />
            Services: {shop.services.join(', ')}
          </motion.p>
        )}
        {shop.Phone && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Phone size={16} className="mr-2 text-blue-500" />
            <a href={`tel:${shop.Phone}`} className="hover:text-blue-400 transition-colors">{shop.Phone}</a>
          </motion.p>
        )}
        {shop.Email && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Mail size={16} className="mr-2 text-teal-500" />
            <a href={`mailto:${shop.Email}`} className="hover:text-teal-400 transition-colors">{shop.Email}</a>
          </motion.p>
        )}
        {shop.Website && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <Globe size={16} className="mr-2 text-indigo-500" />
            <a href={ensureHttps(shop.Website)} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              Visit Website
            </a>
          </motion.p>
        )}
        {shop.instagram && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <Instagram size={16} className="mr-2 text-pink-500" />
            <a href={`https://instagram.com/${shop.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
              @{shop.instagram}
            </a>
          </motion.p>
        )}
        {shop.facebook && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Facebook size={16} className="mr-2 text-blue-600" />
            <a href={`https://facebook.com/${shop.facebook}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              Facebook
            </a>
          </motion.p>
        )}
        {shop.twitter && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <Twitter size={16} className="mr-2 text-sky-500" />
            <a href={`https://twitter.com/${shop.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
              @{shop.twitter}
            </a>
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}