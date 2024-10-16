import React, { useState } from 'react';
import Image from 'next/image';
import { Database } from '@/lib/database.types';
import ArtistForm from './ArtistForm';

type Artist = Database['public']['Tables']['artists']['Row'];

interface ArtistProfileProps {
  artist: Artist;
  isEditable?: boolean;
  onSave?: (data: Partial<Artist>) => void;
}

export default function ArtistProfile({ artist, isEditable = false, onSave }: ArtistProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (data: Partial<Artist>) => {
    if (onSave) {
      onSave(data);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return <ArtistForm initialData={artist} onSubmit={handleSave} />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{artist.name}</h1>
          {isEditable && (
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Edit Profile
            </button>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{artist.bio}</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Location</h2>
            <p className="text-gray-600 dark:text-gray-300">{artist.location}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Experience</h2>
            <p className="text-gray-600 dark:text-gray-300">{artist.years_of_experience} years</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Styles</h2>
            <p className="text-gray-600 dark:text-gray-300">{artist.styles?.join(', ')}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Price Range</h2>
            <p className="text-gray-600 dark:text-gray-300">{artist.price_range}</p>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Portfolio</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {artist.portfolio_images?.map((image, index) => (
              <div key={index} className="relative h-48">
                <Image
                  src={image}
                  alt={`Portfolio image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Contact</h2>
          {artist.instagram_handle && (
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Instagram: <a href={`https://www.instagram.com/${artist.instagram_handle}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">@{artist.instagram_handle}</a>
            </p>
          )}
          {artist.website_url && (
            <p className="text-gray-600 dark:text-gray-300">
              Website: <a href={artist.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">{artist.website_url}</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}