'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import type { Database } from '@/lib/database.types';

export default function GalleryItemPage({ params }: { params: { id: string } }) {
  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchDesign();
  }, [params.id]);

  const fetchDesign = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_designs')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setDesign(data);
    } catch (err) {
      setError('Failed to fetch design');
      console.error('Error fetching design:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading design...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!design) return <div className="text-center">Design not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Tattoo Design</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <Image 
            src={design.design}
            alt={design.prompt}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="p-4">
          <p className="text-lg mb-2">{design.prompt}</p>
          <p className="text-sm text-gray-500">
            Created on: {new Date(design.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <button
        onClick={() => router.push('/gallery')}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Back to Gallery
      </button>
    </div>
  );
}