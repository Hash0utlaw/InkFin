import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import type { Database } from '@/lib/database.types';

interface SavedDesign {
  id: number;
  prompt: string;
  design: string;
  created_at: string;
}

export default function GalleryView() {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
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
    } catch (err) {
      setError('Failed to fetch saved designs');
      console.error('Error fetching saved designs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading your designs...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {designs.map((design) => (
        <Link href={`/gallery/${design.id}`} key={design.id}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <Image 
                src={design.design}
                alt={design.prompt}
                layout="fill"
                objectFit="cover"
              />
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
      {designs.length === 0 && (
        <div className="col-span-full text-center">
          <p>You haven't saved any designs yet. Start by generating a design!</p>
          <Link href="/design" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
            Create a Design
          </Link>
        </div>
      )}
    </div>
  );
}