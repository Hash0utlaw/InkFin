'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Database } from '@/lib/database.types';
import ArtistForm from './ArtistForm';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Palette, DollarSign, Instagram, Globe, Edit } from 'lucide-react';

type Artist = Database['public']['Tables']['artists']['Row'] & { 
  avatar?: string;
  cover_image?: string;
};

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-purple-100 to-pink-100 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="relative h-64">
          <Image
            src={artist.cover_image ?? '/placeholder.svg?height=256&width=512'}
            alt="Cover"
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-full p-1">
            <Image
              src={artist.avatar || '/placeholder.svg?height=100&width=100'}
              alt={artist.name}
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-3xl font-bold text-gray-900">{artist.name}</CardTitle>
            {isEditable && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleEdit} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Edit className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              </motion.div>
            )}
          </div>
          <p className="text-gray-600 mb-6">{artist.bio}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-pink-500" />
              <span className="text-gray-700">{artist.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-500" />
              <span className="text-gray-700">{artist.years_of_experience} years experience</span>
            </div>
            <div className="flex items-center">
              <Palette className="w-5 h-5 mr-2 text-blue-500" />
              <span className="text-gray-700">{artist.styles?.join(', ')}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-500" />
              <span className="text-gray-700">{artist.price_range}</span>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Portfolio</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {artist.portfolio_images?.map((image, index) => (
                <motion.div
                  key={index}
                  className="relative h-48 rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={image}
                    alt={`Portfolio image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Contact</h2>
            {artist.instagram_handle && (
              <div className="flex items-center mb-2">
                <Instagram className="w-5 h-5 mr-2 text-pink-500" />
                <a href={`https://www.instagram.com/${artist.instagram_handle}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">@{artist.instagram_handle}</a>
              </div>
            )}
            {artist.website_url && (
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-500" />
                <a href={artist.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">{artist.website_url}</a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
