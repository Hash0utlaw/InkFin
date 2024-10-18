import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Phone, Globe, MapPin, Star, Palette, Clock, Award, Mail, Instagram, Facebook, Twitter } from 'lucide-react'

export interface Artist {
  id: number
  name: string
  type: 'artist'
  image?: string
  style?: string
  location: string
  priceRange: string
  Phone?: string
  Website?: string
  Email?: string
  Rating?: number
  Reviews?: number
  clean_address?: string
  State?: string
  experience?: string
  specialties?: string[]
  portfolio?: string
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

export default function ArtistCard({ artist, searchType }: { artist: Artist, searchType: 'location' | 'general' }) {
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
          src={artist.image || '/images/placeholder-artist.jpg'}
          alt={artist.name}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <h2 className="text-2xl font-bold p-4 text-white">{artist.name}</h2>
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
          {searchType === 'location' ? artist.clean_address : artist.location}
          {artist.State && `, ${artist.State}`}
        </motion.p>
        {artist.style && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Palette size={16} className="mr-2 text-purple-500" />
            {artist.style}
          </motion.p>
        )}
        {artist.Rating && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Star size={16} className="mr-2 text-yellow-500" />
            {artist.Rating.toFixed(1)}/5 ({artist.Reviews} reviews)
          </motion.p>
        )}
        <motion.p 
          className="text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Price Range: <span className="text-green-400">{artist.priceRange}</span>
        </motion.p>
        {artist.experience && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Clock size={16} className="mr-2 text-blue-500" />
            Experience: {artist.experience}
          </motion.p>
        )}
        {artist.specialties && artist.specialties.length > 0 && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Award size={16} className="mr-2 text-indigo-500" />
            Specialties: {artist.specialties.join(', ')}
          </motion.p>
        )}
        {artist.Phone && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Phone size={16} className="mr-2 text-blue-500" />
            <a href={`tel:${artist.Phone}`} className="hover:text-blue-400 transition-colors">{artist.Phone}</a>
          </motion.p>
        )}
        {artist.Email && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Mail size={16} className="mr-2 text-teal-500" />
            <a href={`mailto:${artist.Email}`} className="hover:text-teal-400 transition-colors">{artist.Email}</a>
          </motion.p>
        )}
        {artist.Website && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <Globe size={16} className="mr-2 text-indigo-500" />
            <a href={ensureHttps(artist.Website)} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              Visit Website
            </a>
          </motion.p>
        )}
        {artist.portfolio && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <Globe size={16} className="mr-2 text-pink-500" />
            <a href={ensureHttps(artist.portfolio)} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
              View Portfolio
            </a>
          </motion.p>
        )}
        {artist.instagram && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Instagram size={16} className="mr-2 text-pink-500" />
            <a href={`https://instagram.com/${artist.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
              @{artist.instagram}
            </a>
          </motion.p>
        )}
        {artist.facebook && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <Facebook size={16} className="mr-2 text-blue-600" />
            <a href={`https://facebook.com/${artist.facebook}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              Facebook
            </a>
          </motion.p>
        )}
        {artist.twitter && (
          <motion.p 
            className="text-gray-300 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <Twitter size={16} className="mr-2 text-sky-500" />
            <a href={`https://twitter.com/${artist.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
              @{artist.twitter}
            </a>
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}