import React from 'react';
import Image from 'next/image';

export interface Artist {
  name: string;
  type: 'artist';
  image?: string;
  style?: string;
  location: string;
  priceRange: string;
}

export default function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="relative h-48 w-full">
        <Image 
          src={artist.image || '/images/placeholder-artist.jpg.png'}
          alt={artist.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{artist.name}</h2>
        {artist.style && <p className="text-gray-600 dark:text-gray-300 mb-2">Style: {artist.style}</p>}
        <p className="text-gray-600 dark:text-gray-300 mb-2">Location: {artist.location}</p>
        <p className="text-gray-600 dark:text-gray-300">Price Range: {artist.priceRange}</p>
      </div>
    </div>
  );
}