'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import '@/styles/gallery-item.css';

export default function GalleryItemPage({ params }: { params: { id: string } }) {
  const [design, setDesign] = useState<Database['public']['Tables']['saved_designs']['Row'] | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

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

  const fetchDesign = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_designs')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setDesign(data);

      if (data) {
        const imagePath = data.image_path || data.image_url; // Handle both old and new formats
        if (imagePath) {
          const signedUrlData = await fetchSignedUrl(imagePath);
          setSignedUrl(signedUrlData);
        }
      }
    } catch (err) {
      setError('Failed to fetch design');
      console.error('Error fetching design:', err);
    } finally {
      setLoading(false);
    }
  }, [params.id, supabase]);

  useEffect(() => {
    fetchDesign();
  }, [fetchDesign]);

  if (loading) return <div className="text-center">Loading design...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!design) return <div className="text-center">Design not found</div>;

  return (
    <div className="min-h-screen gallery-item-background">
      <div className="bg-black bg-opacity-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4 text-white">Tattoo Design</h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-96">
              {signedUrl && (
                <Image 
                  src={signedUrl}
                  alt={design.prompt}
                  fill
                  style={{ objectFit: "contain" }}
                />
              )}
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
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
