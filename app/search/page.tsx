'use client'
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import ArtistCard from '@/components/ArtistCard';

interface Artist {
  name: string;
  style: string;
  location: string;
  priceRange: string;
  image?: string;
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setSearchResults([]);
    setSearchCriteria(query);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      console.log('API response in SearchPage:', data);

      if (Array.isArray(data.artists)) {
        setSearchResults(data.artists);
        console.log('Set search results:', data.artists);
        if (data.artists.length === 0) {
          setError('No artists found matching your criteria. Try adjusting your search.');
        }
      } else {
        console.error('Unexpected API response format:', data);
        setError(data.error || 'Received unexpected data format from server.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  console.log('Current searchResults:', searchResults);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Search Tattoo Artists</h1>
      <SearchBar onSearch={handleSearch} />
      {isLoading && <p className="text-center mt-4">Searching for artists...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      {searchCriteria && !isLoading && !error && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">Search Criteria:</h2>
          <p className="whitespace-pre-wrap">{searchCriteria}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {searchResults.map((artist, index) => (
          <ArtistCard key={index} artist={artist} />
        ))}
      </div>
      {searchResults.length === 0 && !isLoading && !error && searchCriteria && (
        <p className="text-center mt-4">No results found. Try adjusting your search criteria.</p>
      )}
    </div>
  );
}