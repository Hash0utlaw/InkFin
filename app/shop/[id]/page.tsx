'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ShopProfile from '@/components/ShopProfile';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

type Shop = Database['public']['Tables']['shops']['Row'];

export default function ShopPage() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function fetchShop() {
      if (!params.id || typeof params.id !== 'string') {
        setError('Invalid shop ID');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setShop(data);
      }
      setIsLoading(false);
    }

    fetchShop();
  }, [params.id, supabase]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!shop) return <div>Shop not found</div>;

  return <ShopProfile shop={shop} />;
}