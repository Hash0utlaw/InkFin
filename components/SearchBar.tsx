'use client'

import React, { useState, useEffect } from 'react'
import { Search, MapPin, ChevronDown, Loader } from 'lucide-react'

export interface SearchFilters {
  style: string
  priceRange: string
  type: 'artist' | 'shop' | 'both'
}

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters, location: string) => Promise<void>
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
      await onSearch(query, filters, location)
    } catch (error) {
      console.error("Search error:", error)
      onError("An error occurred while searching. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            id="search-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for artists, styles, or shops"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            id="location-input"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            disabled={useCurrentLocation}
          />
        </div>
        <button 
          type="submit" 
          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-300 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin" /> : 'Search'}
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={useCurrentLocation}
            onChange={() => setUseCurrentLocation(!useCurrentLocation)}
            className="form-checkbox h-4 w-4 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
          />
          <span>Use my current location</span>
        </label>
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="text-sm text-primary-500 hover:text-primary-600 flex items-center focus:outline-none focus:underline"
        >
          Advanced filters
          <ChevronDown className={`ml-1 transform transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isAdvancedOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <select
            id="style-select"
            value={filters.style}
            onChange={(e) => setFilters({...filters, style: e.target.value})}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
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
          <select
            id="price-range-select"
            value={filters.priceRange}
            onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            aria-label="Select price range"
          >
            <option value="">Select Price Range</option>
            <option value="Budget">Budget</option>
            <option value="Mid-range">Mid-range</option>
            <option value="High-end">High-end</option>
          </select>
          <select
            id="type-select"
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value as 'artist' | 'shop' | 'both'})}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            aria-label="Select search type"
          >
            <option value="both">Artists & Shops</option>
            <option value="artist">Artists Only</option>
            <option value="shop">Shops Only</option>
          </select>
        </div>
      )}
    </form>
  )
}