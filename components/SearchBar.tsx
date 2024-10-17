'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, ChevronDown, Loader, Zap, DollarSign, Palette } from 'lucide-react'

export interface SearchFilters {
  style: string
  priceRange: string
  type: 'artist' | 'shop' | 'both'
}

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters, searchType: 'general' | 'ai') => Promise<void>
  onError: (error: string) => void
}

export default function SearchBar({ onSearch, onError }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    style: '',
    priceRange: '',
    type: 'both'
  })
  const [location, setLocation] = useState('')
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchType, setSearchType] = useState<'general' | 'ai'>('general')

  useEffect(() => {
    if (useCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude},${longitude}`)
        },
        (error) => {
          console.error("Error getting location:", error)
          onError("Failed to get current location. Please enter location manually.")
          setUseCurrentLocation(false)
        }
      )
    }
  }, [useCurrentLocation, onError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSearch(searchType === 'general' ? location : query, filters, searchType)
    } catch (error) {
      console.error("Search error:", error)
      onError("An error occurred while searching. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center space-x-6 mb-6">
        <motion.label
          className={`flex items-center space-x-2 cursor-pointer ${
            searchType === 'general' ? 'text-purple-400' : 'text-gray-400'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <input
            type="radio"
            value="general"
            checked={searchType === 'general'}
            onChange={() => setSearchType('general')}
            className="form-radio text-purple-500 hidden"
          />
          <MapPin className="w-5 h-5" />
          <span>General Search</span>
        </motion.label>
        <motion.label
          className={`flex items-center space-x-2 cursor-pointer ${
            searchType === 'ai' ? 'text-purple-400' : 'text-gray-400'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <input
            type="radio"
            value="ai"
            checked={searchType === 'ai'}
            onChange={() => setSearchType('ai')}
            className="form-radio text-purple-500 hidden"
          />
          <Zap className="w-5 h-5" />
          <span>AI Search</span>
        </motion.label>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <motion.div
          className="flex-grow relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {searchType === 'ai' ? (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
          ) : (
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
          )}
          <input
            type="text"
            value={searchType === 'ai' ? query : location}
            onChange={(e) => searchType === 'ai' ? setQuery(e.target.value) : setLocation(e.target.value)}
            placeholder={searchType === 'ai' ? "Search for artists, styles, or shops" : "Enter state or zip code"}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            disabled={searchType === 'general' && useCurrentLocation}
          />
        </motion.div>
        <motion.button 
          type="submit" 
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 flex items-center justify-center"
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? <Loader className="animate-spin" /> : 'Search'}
        </motion.button>
      </div>
      
      {searchType === 'general' && (
        <motion.div
          className="flex items-center space-x-2 text-sm text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useCurrentLocation}
              onChange={() => setUseCurrentLocation(!useCurrentLocation)}
              className="form-checkbox h-4 w-4 text-purple-500 rounded focus:ring-2 focus:ring-purple-500"
            />
            <span>Use my current location</span>
          </label>
        </motion.div>
      )}

      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="text-sm text-purple-400 hover:text-purple-300 flex items-center focus:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Advanced filters
          <ChevronDown className={`ml-1 transform transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`} />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isAdvancedOpen && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
              <select
                value={filters.style}
                onChange={(e) => setFilters({...filters, style: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none"
                aria-label="Select tattoo style"
              >
                <option value="">Select Style</option>
                <option value="Traditional">Traditional</option>
                <option value="Realism">Realism</option>
                <option value="Watercolor">Watercolor</option>
                <option value="Blackwork">Blackwork</option>
                <option value="New School">New School</option>
                <option value="Neo-Traditional">Neo-Traditional</option>
              </select>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none"
                aria-label="Select price range"
              >
                <option value="">Select Price Range</option>
                <option value="Budget">Budget</option>
                <option value="Mid-range">Mid-range</option>
                <option value="High-end">High-end</option>
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value as 'artist' | 'shop' | 'both'})}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none"
                aria-label="Select search type"
              >
                <option value="both">Artists & Shops</option>
                <option value="artist">Artists Only</option>
                <option value="shop">Shops Only</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  )
}
