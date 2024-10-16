import React, { useState } from 'react';
import Image from 'next/image';
import { Database } from '@/lib/database.types';
import ShopForm from './ShopForm';

type Shop = Database['public']['Tables']['shops']['Row'];

interface ShopProfileProps {
  shop: Shop;
  isEditable?: boolean;
  onSave?: (data: Partial<Shop>) => void;
}

export default function ShopProfile({ shop, isEditable = false, onSave }: ShopProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (data: Partial<Shop>) => {
    if (onSave) {
      onSave(data);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return <ShopForm initialData={shop} onSubmit={handleSave} />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{shop.name}</h1>
          {isEditable && (
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Edit Shop
            </button>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{shop.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Location</h2>
            <p className="text-gray-600 dark:text-gray-300">{shop.location}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Price Range</h2>
            <p className="text-gray-600 dark:text-gray-300">{shop.price_range}</p>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Services</h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
            {shop.services?.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {shop.images?.map((image, index) => (
              <div key={index} className="relative h-48">
                <Image
                  src={image}
                  alt={`Shop image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
        {shop.website_url && (
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Website</h2>
            <p className="text-gray-600 dark:text-gray-300">
              <a href={shop.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">{shop.website_url}</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}