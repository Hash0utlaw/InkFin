'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SearchBar, { SearchFilters } from '@/components/SearchBar'
import ArtistCard, { Artist } from '@/components/ArtistCard'
import ShopCard, { Shop } from '@/components/ShopCard'
import { Database } from '@/lib/database.types'
import { Loader2 } from 'lucide-react'

type BusinessData = Database['public']['Tables']['business_data']['Row']

interface SearchResults {
  dbResults: BusinessData[]
  aiResults: any[]
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchCriteria, setSearchCriteria] = useState<string | null>(null)

  const handleSearch = async (query: string, filters: SearchFilters, location: string) => {
    setIsLoading(true)
    setError(null)
    setSearchResults(null)
    setSearchCriteria(`Query: ${query}\nFilters: ${JSON.stringify(filters, null, 2)}\nLocation: ${location}`)

    try {
      console.log('Sending search request with:', { query, filters, location })
      const response = await fetch('/api/hybrid-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm: query, filters, location }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }

      const data: SearchResults = await response.json()
      console.log('Raw API response:', data)

      setSearchResults(data)
      if (data.dbResults.length === 0 && data.aiResults.length === 0) {
        setError('No results found matching your criteria. Try adjusting your search.')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while searching. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isArtist = (result: BusinessData | any): boolean => {
    return (
      (result.Types?.toLowerCase().includes('artist') || 
      result.Types?.toLowerCase().includes('tattoo') || 
      result.Types?.toLowerCase().includes('piercing') ||
      result.type?.toLowerCase() === 'artist') ?? false
    )
  }

  const isShop = (result: BusinessData | any): boolean => {
    return (
      (result.Types?.toLowerCase().includes('shop') || 
      result.Types?.toLowerCase().includes('store') ||
      result.Types?.toLowerCase().includes('studio') ||
      result.type?.toLowerCase() === 'shop') ?? false
    )
  }

  const mapToArtist = (data: BusinessData | any): Artist => ({
    name: data.Name || data.name,
    type: 'artist',
    location: data.Address || data.location,
    priceRange: data.Rating ? `${data.Rating.toFixed(1)}/5` : (data.priceRange || 'N/A'),
    image: '/images/placeholder-artist.jpg.png',
    style: data.Types || data.style || 'Unknown',
  })

  const mapToShop = (data: BusinessData | any): Shop => ({
    name: data.Name || data.name,
    type: 'shop',
    location: data.Address || data.location,
    priceRange: data.Rating ? `${data.Rating.toFixed(1)}/5` : (data.priceRange || 'N/A'),
    image: '/images/placeholder-artist.jpg.png',
    style: data.Types || data.style || 'Unknown',
  })

  const renderResults = (results: BusinessData[] | any[]) => {
    return results.map((result, index) => {
      console.log('Processing result:', result)
      try {
        if (isArtist(result)) {
          const artistData = mapToArtist(result)
          console.log('Mapped artist data:', artistData)
          return <ArtistCard key={result.id || index} artist={artistData} />
        } else if (isShop(result)) {
          const shopData = mapToShop(result)
          console.log('Mapped shop data:', shopData)
          return <ShopCard key={result.id || index} shop={shopData} />
        } else {
          console.log('Result is neither artist nor shop:', result)
          return null
        }
      } catch (error) {
        console.error('Error processing result:', error)
        return null
      }
    })
  }

  const titleWords = "Search Tattoo Artists and Shops".split(" ")

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/search-background.jpg.png')" }}>
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
                key={index}
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
            <SearchBar onSearch={handleSearch} />
          </motion.div>
          {isLoading && (
            <motion.div 
              className="flex justify-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </motion.div>
          )}
          {error && (
            <motion.p 
              className="text-center mt-4 text-red-500 bg-white bg-opacity-80 p-4 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.p>
          )}
          {searchCriteria && !isLoading && !error && (
            <motion.div 
              className="mt-4 p-4 bg-white bg-opacity-80 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-2">Search Criteria:</h2>
              <pre className="whitespace-pre-wrap">{searchCriteria}</pre>
            </motion.div>
          )}
          {searchResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Supabase Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderResults(searchResults.dbResults)}
              </div>
              <h2 className="text-2xl font-bold mt-8 mb-4 text-white">OpenAI Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderResults(searchResults.aiResults)}
              </div>
            </motion.div>
          )}
          {searchResults && searchResults.dbResults.length === 0 && searchResults.aiResults.length === 0 && !isLoading && !error && (
            <motion.p 
              className="text-center mt-4 text-white bg-black bg-opacity-50 p-4 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No results found. Try adjusting your search criteria.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  )
}