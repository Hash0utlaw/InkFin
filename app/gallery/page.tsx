'use client'

import React from 'react';
import GalleryView from '@/components/GalleryView';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/gallery-background.jpg.png')" }}>
      <div className="bg-white bg-opacity-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">Your Tattoo Design Gallery</h1>
          <GalleryView />
        </div>
      </div>
    </div>
  );
}