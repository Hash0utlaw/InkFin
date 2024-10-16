'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

type Shop = Database['public']['Tables']['shops']['Row'];

export default function ShopIndexPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function fetchShops() {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .limit(10);  // Adjust this limit as needed

      if (error) {
        setError(error.message);
      } else {
        setShops(data || []);
      }
      setIsLoading(false);
    }

    fetchShops();
  }, [supabase]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Shops</h1>
      {shops.map((shop) => (
        <div key={shop.id}>
          <Link href={`/shop/${shop.id}`}>
            {shop.name}
          </Link>
        </div>
      ))}
    </div>
  );
}