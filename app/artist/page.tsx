'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

type Artist = Database['public']['Tables']['artists']['Row'];

export default function ArtistIndexPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function fetchArtists() {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .limit(10);  // Adjust this limit as needed

      if (error) {
        setError(error.message);
      } else {
        setArtists(data || []);
      }
      setIsLoading(false);
    }

    fetchArtists();
  }, [supabase]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Artists</h1>
      {artists.map((artist) => (
        <div key={artist.id}>
          <Link href={`/artist/${artist.id}`}>
            {artist.name}
          </Link>
        </div>
      ))}
    </div>
  );
}