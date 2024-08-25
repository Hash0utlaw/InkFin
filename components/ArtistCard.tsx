import React from 'react';
import Image from 'next/image';

interface Artist {
  name: string;
  image?: string;
  style: string;
  location: string;
  priceRange: string;
}

export default function ArtistCard({ artist }: { artist: Artist }) {
  console.log('Rendering ArtistCard with data:', artist);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="relative h-48 w-full">
        <Image 
          src={artist.image || '/images/placeholder-artist.jpg'}
          alt={artist.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{artist.name}</h2>
        <p className="text-gray-600 mb-2">Style: {artist.style}</p>
        <p className="text-gray-600 mb-2">Location: {artist.location}</p>
        <p className="text-gray-600">Price Range: {artist.priceRange}</p>
      </div>
    </div>
  );
}