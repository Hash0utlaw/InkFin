'use client'

import React, { useState } from 'react'

export interface SearchFilters {
  type: 'artist' | 'shop' | 'both';
  priceRange: string;
  location: string;
  style: string;
}

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => Promise<void>;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'both',
    priceRange: '',
    location: '',
    style: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSearch(query, filters)
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <div className="mb-4">
        <input 
          type="text"
          placeholder="Search for artists, shops, or styles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <select
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value as 'artist' | 'shop' | 'both'})}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="both">Artists & Shops</option>
          <option value="artist">Artists Only</option>
          <option value="shop">Shops Only</option>
        </select>

        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({...filters, location: e.target.value})}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <select
          value={filters.priceRange}
          onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Any Price Range</option>
          <option value="budget">Budget</option>
          <option value="mid-range">Mid-Range</option>
          <option value="high-end">High-End</option>
          <option value="luxury">Luxury</option>
        </select>

        <input
          type="text"
          placeholder="Style (e.g., Traditional, Realism)"
          value={filters.style}
          onChange={(e) => setFilters({...filters, style: e.target.value})}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <button 
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out disabled:bg-blue-300 dark:disabled:bg-blue-800"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}