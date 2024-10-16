import React, { useState } from 'react';
import { Database } from '@/lib/database.types';

type Artist = Database['public']['Tables']['artists']['Row'];

interface ArtistFormProps {
  initialData?: Partial<Artist>;
  onSubmit: (data: Partial<Artist>) => void;
}

export default function ArtistForm({ initialData, onSubmit }: ArtistFormProps) {
  const [formData, setFormData] = useState<Partial<Artist>>(initialData || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="years_of_experience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
        <input
          type="number"
          id="years_of_experience"
          name="years_of_experience"
          value={formData.years_of_experience || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="price_range" className="block text-sm font-medium text-gray-700">Price Range</label>
        <input
          type="text"
          id="price_range"
          name="price_range"
          value={formData.price_range || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="instagram_handle" className="block text-sm font-medium text-gray-700">Instagram Handle</label>
        <input
          type="text"
          id="instagram_handle"
          name="instagram_handle"
          value={formData.instagram_handle || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">Website URL</label>
        <input
          type="url"
          id="website_url"
          name="website_url"
          value={formData.website_url || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Save Profile
      </button>
    </form>
  );
}