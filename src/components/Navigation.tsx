'use client';

import { useState } from 'react';

export default function Navigation() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'parties', label: 'Parties' },
    { id: 'seats', label: 'Seats' },
    { id: 'candidates', label: 'Candidates' },
    { id: 'results', label: 'Results' },
    { id: 'manifesto', label: 'Manifesto' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-green-900 py-3">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-green-700 text-white'
                  : 'text-green-200 hover:text-white hover:bg-green-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
