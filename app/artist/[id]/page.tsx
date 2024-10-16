'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ArtistProfile from '@/components/ArtistProfile';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

type Artist = Database['public']['Tables']['artists']['Row'];

export default function ArtistPage() {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function fetchArtist() {
      if (!params.id || typeof params.id !== 'string') {
        setError('Invalid artist ID');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setArtist(data);
      }
      setIsLoading(false);
    }

    fetchArtist();
  }, [params.id, supabase]);

  const handleSave = async (updatedData: Partial<Artist>) => {
    if (!artist) return;

    const { data, error } = await supabase
      .from('artists')
      .update(updatedData)
      .eq('id', artist.id)
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else {
      setArtist(data);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!artist) return <div>Artist not found</div>;

  return <ArtistProfile artist={artist} isEditable={true} onSave={handleSave} />;
}