'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArtistForm from '@/components/ArtistForm';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

type Artist = Database['public']['Tables']['artists']['Row'];

export default function CreateArtistPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleCreate = async (data: Partial<Artist>) => {
    const { data: newArtist, error } = await supabase
      .from('artists')
      .insert(data)
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else if (newArtist) {
      router.push(`/artist/${newArtist.id}`);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Create Artist Profile</h1>
      <ArtistForm onSubmit={handleCreate} />
    </div>
  );
}