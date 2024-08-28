'use client'

import React, { useState } from 'react';
import SearchBar, { SearchFilters } from '@/components/SearchBar';
import ArtistCard, { Artist } from '@/components/ArtistCard';
import ShopCard, { Shop } from '@/components/ShopCard';

type SearchResult = Artist | Shop;

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<string | null>(null);

  const handleSearch = async (query: string, filters: SearchFilters) => {
    setIsLoading(true);
    setError(null);
    setSearchResults([]);
    setSearchCriteria(`Query: ${query}\nFilters: ${JSON.stringify(filters, null, 2)}`);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, filters }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      console.log('Raw API response:', data);

      let results: SearchResult[] = [];

      if (Array.isArray(data)) {
        results = data;
      } else if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) {
        results = data.results;
      } else {
        throw new Error('Unexpected data format');
      }

      console.log('Processed search results:', results);

      setSearchResults(results);
      if (results.length === 0) {
        setError('No results found matching your criteria. Try adjusting your search.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isArtist = (result: SearchResult): result is Artist => {
    return result.type === 'artist';
  };

  const isShop = (result: SearchResult): result is Shop => {
    return result.type === 'shop';
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/search-background.jpg.png')" }}>
      <div className="bg-white bg-opacity-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">Search Tattoo Artists and Shops</h1>
          <SearchBar onSearch={handleSearch} />
          {isLoading && <p className="text-center mt-4">Searching...</p>}
          {error && <p className="text-center mt-4 text-red-500">{error}</p>}
          {searchCriteria && !isLoading && !error && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h2 className="text-xl font-semibold mb-2">Search Criteria:</h2>
              <pre className="whitespace-pre-wrap">{searchCriteria}</pre>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {searchResults.map((result, index) => (
              isArtist(result) ? (
                <ArtistCard key={index} artist={result} />
              ) : isShop(result) ? (
                <ShopCard key={index} shop={result} />
              ) : null
            ))}
          </div>
          {searchResults.length === 0 && !isLoading && !error && searchCriteria && (
            <p className="text-center mt-4">No results found. Try adjusting your search criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}