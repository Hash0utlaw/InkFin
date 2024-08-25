import React, { useState } from 'react';

const priceRanges = ['$', '$$', '$$$', '$$$$'];
const styles = ['Traditional', 'Realism', 'Neo-traditional', 'Watercolor', 'Japanese', 'Blackwork', 'Tribal', 'New School', 'Biomechanical', 'Other'];

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [step, setStep] = useState(1);
  const [priceRange, setPriceRange] = useState('');
  const [location, setLocation] = useState('');
  const [style, setStyle] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = `Find tattoo artists with the following criteria:
    Price Range: ${priceRange}
    Location: ${location}
    Style: ${style}
    Additional Information: ${additionalInfo}`;
    onSearch(query);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Select Price Range:</h3>
            <div className="flex space-x-2">
              {priceRanges.map((range) => (
                <button
                  key={range}
                  className={`px-4 py-2 rounded ${priceRange === range ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => { setPriceRange(range); setStep(2); }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Enter Location:</h3>
            <input
              type="text"
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="City, State or Country"
            />
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setStep(3)}
            >
              Next
            </button>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Select Tattoo Style:</h3>
            <select
              value={style}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStyle(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a style</option>
              {styles.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setStep(4)}
            >
              Next
            </button>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Additional Information:</h3>
            <textarea
              value={additionalInfo}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAdditionalInfo(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Any specific details or preferences?"
              rows={3}
            />
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)}
            >
              Search
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        {renderStep()}
      </form>
    </div>
  );
}