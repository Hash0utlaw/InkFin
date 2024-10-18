'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Database } from '@/lib/database.types';
import ShopForm from './ShopForm';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, DollarSign, Scissors, Globe, Edit } from 'lucide-react';

type Shop = Database['public']['Tables']['shops']['Row'] & {
  logo?: string;
  cover_image?: string;
};

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-blue-100 to-purple-100 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="relative h-64">
          <Image
            src={shop.cover_image || '/placeholder.svg?height=256&width=512'}
            alt="Cover"
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-full p-1">
            <Image
              src={shop.logo || '/placeholder.svg?height=100&width=100'}
              alt={shop.name}
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-3xl font-bold text-gray-900">{shop.name}</CardTitle>
            {isEditable && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleEdit} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <Edit className="w-4 h-4 mr-2" /> Edit Shop
                </Button>
              </motion.div>
            )}
          </div>
          <p className="text-gray-600 mb-6">{shop.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              <span className="text-gray-700">{shop.location}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-500" />
              <span className="text-gray-700">{shop.price_range}</span>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900 flex items-center">
              <Scissors className="w-6 h-6 mr-2 text-purple-500" /> Services
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {shop.services?.map((service, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {service}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {shop.images?.map((image, index) => (
                <motion.div
                  key={index}
                  className="relative h-48 rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={image}
                    alt={`Shop image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
          {shop.website_url && (
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-500" />
              <a href={shop.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">{shop.website_url}</a>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
