'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchBar, { SearchFilters } from '@/components/SearchBar'
import ArtistCard, { Artist } from '@/components/ArtistCard'
import ShopCard, { Shop } from '@/components/ShopCard'
import { Database } from '@/lib/database.types'
import { Loader2 } from 'lucide-react'
import '@/styles/search.css'  // Add this import at the top of the file

type BusinessData = Database['public']['Tables']['business_data']['Row']

interface SearchResults {
  results: (BusinessData | any)[]
  totalCount: number
  page: number
  limit: number
  searchType: 'general' | 'ai'
}

const SearchResultsContent = ({ 
  isLoading, 
  error, 
  searchCriteria, 
  searchResults, 
  renderResults 
}: {
  isLoading: boolean
  error: string | null
  searchCriteria: string | null
  searchResults: SearchResults | null
  renderResults: (results: (BusinessData | any)[], searchType: 'general' | 'ai') => React.ReactNode
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center mt-8">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-center mt-4 text-red-500 bg-white bg-opacity-80 p-4 rounded-lg">
        {error}
      </p>
    )
  }

  if (searchCriteria && !searchResults) {
    return (
      <div className="mt-4 p-4 bg-white bg-opacity-80 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Search Criteria:</h2>
        <pre className="whitespace-pre-wrap">{searchCriteria}</pre>
      </div>
    )
  }

  if (searchResults) {
    return (
      <div>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-white">
          {searchResults.searchType === 'general' ? 'General Search Results' : 'AI Search Results'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderResults(searchResults.results, searchResults.searchType)}
        </div>
        {searchResults.results.length === 0 && (
          <p className="text-center mt-4 text-white bg-black bg-opacity-50 p-4 rounded-lg">
            No results found. Try adjusting your search criteria.
          </p>
        )}
      </div>
    )
  }

  return null
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchCriteria, setSearchCriteria] = useState<string | null>(null)

  const handleSearch = useCallback(async (searchTerm: string, filters: SearchFilters, searchType: 'general' | 'ai') => {
    setIsLoading(true)
    setError(null)
    setSearchResults(null)
    setSearchCriteria(`Search Type: ${searchType}\nTerm: ${searchTerm}\nFilters: ${JSON.stringify(filters, null, 2)}`)

    try {
      console.log('Sending search request with:', { searchTerm, filters, searchType })
      const response = await fetch('/api/hybrid-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm, filters, searchType }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }

      const data: SearchResults = await response.json()
      console.log('Raw API response:', data)

      setSearchResults(data)
      if (data.results.length === 0) {
        setError('No results found matching your criteria. Try adjusting your search.')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while searching. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const isArtist = useCallback((result: BusinessData | any): boolean => {
    return (
      (result.Types?.toLowerCase().includes('artist') || 
      result.Types?.toLowerCase().includes('tattoo') || 
      result.Types?.toLowerCase().includes('piercing') ||
      result.type?.toLowerCase() === 'artist') ?? false
    )
  }, [])

  const isShop = useCallback((result: BusinessData | any): boolean => {
    return (
      (result.Types?.toLowerCase().includes('shop') || 
      result.Types?.toLowerCase().includes('store') ||
      result.Types?.toLowerCase().includes('studio') ||
      result.type?.toLowerCase() === 'shop') ?? false
    )
  }, [])

  const mapToArtist = useCallback((data: BusinessData | any, searchType: 'general' | 'ai'): Artist => ({
    id: data.id || Math.random().toString(36).substr(2, 9),
    name: data.Name || data.name,
    type: 'artist',
    location: searchType === 'general' ? (data.clean_address || data.State || '') : (data.location || ''),
    priceRange: data.Rating ? `${data.Rating.toFixed(1)}/5` : (data.priceRange || 'N/A'),
    image: '/images/placeholder-artist.jpg',
    style: data.Types || data.style || 'Unknown',
    Phone: data.Phone,
    Website: data.Website,
    Email: data.Email,
    Rating: data.Rating,
    Reviews: data.Reviews,
    clean_address: data.clean_address,
    State: data.State
  }), [])

  const mapToShop = useCallback((data: BusinessData | any, searchType: 'general' | 'ai'): Shop => ({
    id: data.id || Math.random().toString(36).substr(2, 9),
    name: data.Name || data.name,
    type: 'shop',
    location: searchType === 'general' ? (data.clean_address || data.State || '') : (data.location || ''),
    priceRange: data.Rating ? `${data.Rating.toFixed(1)}/5` : (data.priceRange || 'N/A'),
    image: '/images/placeholder-artist.jpg',
    style: data.Types || data.style || 'Unknown',
    Phone: data.Phone,
    Website: data.Website,
    Email: data.Email,
    Rating: data.Rating,
    Reviews: data.Reviews,
    clean_address: data.clean_address,
    State: data.State
  }), [])

  const renderResults = useCallback((results: (BusinessData | any)[], searchType: 'general' | 'ai') => {
    return results.map((result, index) => {
      console.log('Processing result:', result)
      try {
        if (isArtist(result)) {
          const artistData = mapToArtist(result, searchType)
          console.log('Mapped artist data:', artistData)
          return <ArtistCard key={artistData.id || `artist-${index}`} artist={artistData} searchType={searchType === 'ai' ? 'location' : 'general'} />
        } else if (isShop(result)) {
          const shopData = mapToShop(result, searchType)
          return <ShopCard key={shopData.id || `shop-${index}`} shop={shopData} searchType={searchType === 'ai' ? 'location' : 'general'} />
        } else {
          console.log('Result is neither artist nor shop:', result)
          return null
        }
      } catch (error) {
        console.error('Error processing result:', error)
        return null
      }
    })
  }, [isArtist, isShop, mapToArtist, mapToShop])

  const titleWords = "Search Tattoo Artists and Shops".split(" ")

  return (
    <div className="min-h-screen search-background">
      <div className="bg-black bg-opacity-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-center mb-8 relative overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {titleWords.map((word, index) => (
              <motion.span
                key={`title-word-${index}`}
                className="inline-block mr-2"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      damping: 12,
                      stiffness: 200,
                    },
                  },
                }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-x">
                  {word}
                </span>
              </motion.span>
            ))}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <SearchBar onSearch={handleSearch} onError={setError} />
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={isLoading ? 'loading' : error ? 'error' : searchResults ? 'results' : 'criteria'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SearchResultsContent
                isLoading={isLoading}
                error={error}
                searchCriteria={searchCriteria}
                searchResults={searchResults}
                renderResults={renderResults}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
