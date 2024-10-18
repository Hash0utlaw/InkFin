
'use client'

import React, { useState } from 'react';
import { Database } from '@/lib/database.types';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MapPin, DollarSign, Globe } from 'lucide-react';

type Shop = Database['public']['Tables']['shops']['Row'];

interface ShopFormProps {
  initialData?: Partial<Shop>;
  onSubmit: (data: Partial<Shop>) => void;
}

export default function ShopForm({ initialData, onSubmit }: ShopFormProps) {
  const [formData, setFormData] = useState<Partial<Shop>>(initialData || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6 bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-xl shadow-lg"
    >
      <div>
        <Label htmlFor="name" className="text-lg font-semibold text-gray-700">Shop Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          className="mt-1 w-full bg-white/50 backdrop-blur-sm"
          required
        />
      </div>
      <div>
        <Label htmlFor="description" className="text-lg font-semibold text-gray-700">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 w-full bg-white/50 backdrop-blur-sm"
        />
      </div>
      <div>
        <Label htmlFor="location" className="text-lg font-semibold text-gray-700 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-500" /> Location
        </Label>
        <Input
          type="text"
          id="location"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          className="mt-1 w-full bg-white/50 backdrop-blur-sm"
        />
      </div>
      <div>
        <Label htmlFor="price_range" className="text-lg font-semibold text-gray-700 flex items-center">
          
          <DollarSign className="w-5 h-5 mr-2 text-green-500" /> Price Range
        </Label>
        <Input
          type="text"
          id="price_range"
          name="price_range"
          value={formData.price_range || ''}
          onChange={handleChange}
          className="mt-1 w-full bg-white/50 backdrop-blur-sm"
        />
      </div>
      <div>
        <Label htmlFor="website_url" className="text-lg font-semibold text-gray-700 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-purple-500" /> Website URL
        </Label>
        <Input
          type="url"
          id="website_url"
          name="website_url"
          value={formData.website_url || ''}
          onChange={handleChange}
          className="mt-1 w-full bg-white/50 backdrop-blur-sm"
        />
      </div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition duration-300">
          Save Shop Profile
        </Button>
      </motion.div>
    </motion.form>
  );
}