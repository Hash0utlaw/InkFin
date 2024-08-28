'use client'

import React, { useState } from 'react';
import Image from 'next/image';

interface DesignResult {
  imageUrl: string;
  error?: string;
}

export default function TattooDesignGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<DesignResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);

    try {
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate design');
      }

      const result: DesignResult = await response.json();
      if (result.error) {
        setError(result.error);
      } else if (result.imageUrl) {
        setGeneratedImage(result);
      } else {
        setError('No image was generated. Please try again.');
      }
    } catch (error) {
      console.error('Error generating tattoo design:', error);
      setError('Failed to generate design. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          rows={4}
          placeholder="Describe your tattoo idea in detail..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button 
          type="submit" 
          className="mt-4 w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out disabled:bg-blue-300 dark:disabled:bg-blue-800"
          disabled={isLoading}
        >
          {isLoading ? 'Generating Your Design...' : 'Generate Tattoo Design'}
        </button>
      </form>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-center mt-4">{error}</p>
      )}
      {generatedImage && generatedImage.imageUrl && (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your Generated Design:</h3>
          <div className="relative w-full h-64 md:h-96">
            <Image 
              src={generatedImage.imageUrl} 
              alt="Generated tattoo design" 
              layout="fill"
              objectFit="contain"
              className="rounded-md shadow-lg"
            />
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            This is an AI-generated design based on your description. Feel free to use this as inspiration for your tattoo artist.
          </p>
        </div>
      )}
    </div>
  );
}