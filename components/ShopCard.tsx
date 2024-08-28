import React from 'react';
import Image from 'next/image';

export interface Shop {
  name: string;
  type: 'shop';
  image?: string;
  location: string;
  priceRange: string;
  style?: string;
}

export default function ShopCard({ shop }: { shop: Shop }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="relative h-48 w-full">
        <Image 
          src={shop.image || '/images/placeholder-artist.jpg.png'}
          alt={shop.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{shop.name} </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Type: Tattoo Shop</p>
        {shop.style && <p className="text-gray-600 dark:text-gray-300 mb-2">Style: {shop.style}</p>}
        <p className="text-gray-600 dark:text-gray-300 mb-2">Location: {shop.location}</p>
        <p className="text-gray-600 dark:text-gray-300">Price Range: {shop.priceRange}</p>
      </div>
    </div>
  );
}