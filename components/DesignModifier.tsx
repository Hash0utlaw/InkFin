// components/DesignModifier.tsx
import React, { useState } from 'react';

interface DesignModifierProps {
  onModifyDesign: (colors: string[], style: string) => void;
}

const tattooStyles = [
  "Traditional",
  "Neo-traditional",
  "Realistic",
  "Watercolor",
  "Tribal",
  "Japanese",
  "Blackwork",
  "Dotwork",
  "Geometric",
  "Minimalist",
  "New School",
  "Sketch",
];

export default function DesignModifier({ onModifyDesign }: DesignModifierProps) {
  const [colors, setColors] = useState<string[]>(['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff']);
  const [selectedStyle, setSelectedStyle] = useState<string>('');

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStyle(e.target.value);
  };

  const handleModify = () => {
    onModifyDesign(colors, selectedStyle);
  };

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold mb-2">Modify Design</h4>
      <div className="mb-4">
        <label htmlFor="style" className="block text-sm font-medium text-gray-700">Select Style</label>
        <select
          id="style"
          value={selectedStyle}
          onChange={handleStyleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Choose a style</option>
          {tattooStyles.map((style) => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
      </div>
      <button
        onClick={handleModify}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
        disabled={!selectedStyle}
      >
        Modify Design
      </button>
    </div>
  );
}
