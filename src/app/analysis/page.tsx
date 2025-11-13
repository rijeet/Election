'use client';

import Header from '@/components/Header';
import SwingStateMap from '@/components/SwingStateMap';

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            নির্বাচনী বিশ্লেষণ
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore swing state patterns and blunder analysis to understand electoral dynamics across Bangladesh&apos;s parliamentary history.
          </p>
        </div>

        {/* Swing State Analysis and Blunder Analysis */}
        <div className="mb-16">
          <SwingStateMap />
        </div>
      </main>

      <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <p>© {new Date().getFullYear()} Bangladesh Election Insights</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

