'use client'

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import type { Database } from '@/lib/database.types';

interface SavedDesign {
  id: string;
  user_id: string;
  prompt: string;
  image_path?: string;
  image_url?: string;
  created_at: string;
}

export default function GalleryView() {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [signedUrls, setSignedUrls] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchSavedDesigns();
  }, []);

  const fetchSavedDesigns = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Please sign in to view your saved designs.');
        return;
      }

      const { data, error } = await supabase
        .from('saved_designs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigns(data || []);

      // Fetch signed URLs for all designs
      const urls: { [key: string]: string } = {};
      for (const design of data || []) {
        const imagePath = design.image_path || design.image_url;
        if (imagePath) {
          const signedUrl = await fetchSignedUrl(imagePath);
          urls[design.id] = signedUrl;
        }
      }
      setSignedUrls(urls);
    } catch (err) {
      setError('Failed to fetch saved designs');
      console.error('Error fetching saved designs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSignedUrl = async (imagePath: string): Promise<string> => {
    try {
      const response = await fetch(`/api/get-signed-url?path=${encodeURIComponent(imagePath)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch signed URL');
      }
      const data = await response.json();
      return data.signedUrl;
    } catch (error) {
      console.error('Error fetching signed URL:', error);
      return '';
    }
  };

  if (loading) return <div className="text-center">Loading your designs...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Tattoo Design Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design) => (
          <Link href={`/gallery/${design.id}`} key={design.id}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105">
              <div className="relative h-48">
                {signedUrls[design.id] && (
                  <Image 
                    src={signedUrls[design.id]}
                    alt={design.prompt}
                    layout="fill"
                    objectFit="cover"
                  />
                )}
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{design.prompt}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(design.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {designs.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-lg mb-4">You haven't saved any designs yet. Start by generating a design!</p>
          <Link href="/design" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300">
            Create a Design
          </Link>
        </div>
      )}
    </div>
  );
}