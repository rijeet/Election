'use client';

import Link from 'next/link';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';

const translations = {
  bn: {
    hero: {
      title: 'বাংলাদেশ নির্বাচন তথ্য ব্যবস্থা',
      subtitle: 'Bangladesh Election Information System',
      description: '১৯৭৩ থেকে ২০২৪ পর্যন্ত বাংলাদেশের গণতান্ত্রিক যাত্রার নির্বাচনী তথ্য, সংসদীয় ইতিহাস, নির্বাচনী এলাকার বিস্তারিত এবং ইন্টারেক্টিভ ভিজ্যুয়ালাইজেশন অন্বেষণ করুন।',
      exploreElections: 'নির্বাচন অন্বেষণ করুন',
    },
    featureCards: {
      elections: { title: 'নির্বাচন', subtitle: 'সময়সূচী ও বিবরণ' },
      candidates: { title: 'প্রার্থী', subtitle: 'প্রোফাইল ও তথ্য' },
      constituencies: { title: 'নির্বাচনী এলাকা', subtitle: 'নির্বাচনী অঞ্চল' },
      visualization: { title: 'ভিজ্যুয়ালাইজেশন', subtitle: 'সংসদ চার্ট' },
    },
    schedule: {
      title: 'নির্বাচনের সময়সূচি',
      subtitle: 'Election Schedule',
      items: [
        { date: 'November 30, 2023', description: 'মনোনয়নপত্র জমা দেওয়ার শেষ দিন' },
        { date: 'December 01, 2023', description: 'মনোনয়নপত্র বাছাই' },
        { date: 'December 17, 2023', description: 'মনোনয়নপত্র প্রত্যাহারের শেষ দিন' },
        { date: 'January 05, 2024', description: 'নির্বাচনী প্রচারের শেষ সময়' },
        { date: 'January 07, 2024', description: 'ভোট গ্রহণ' },
      ],
    },
    summary: {
      title: 'সংক্ষিপ্ত তথ্য',
      subtitle: 'Summary Information',
      items: [
        { label: 'মোট ভোটার', value: '১১,৯৬,৯১,৬৩৩', valueEn: '119,691,633' },
        { label: 'পুরুষ ভোটার', value: '৬,০৭,৭১,৫৭৯', valueEn: '60,771,579' },
        { label: 'নারী ভোটার', value: '৫,৮৯,১৯,২০২', valueEn: '58,919,202' },
        { label: 'তৃতীয় লিঙ্গের ভোটার', value: '৮৫২', valueEn: '852' },
        { label: 'আসন সংখ্যা', value: '৩০০', valueEn: '300' },
        { label: 'মোট প্রার্থী', value: '১,৯৭১', valueEn: '1,971' },
        { label: 'স্বতন্ত্র প্রার্থী', value: '৪৩৬', valueEn: '436' },
        { label: 'দল', value: '২৮', valueEn: '28' },
      ],
    },
  },
  en: {
    hero: {
      title: 'Bangladesh Election Information System',
      subtitle: 'বাংলাদেশ নির্বাচন তথ্য ব্যবস্থা',
      description: 'Explore comprehensive election data, parliamentary history, constituency details, and interactive visualizations of Bangladesh\'s democratic journey from 1973 to 2024.',
      exploreElections: 'Explore Elections',
    },
    featureCards: {
      elections: { title: 'Elections', subtitle: 'Timeline & Details' },
      candidates: { title: 'Candidates', subtitle: 'Profile & Information' },
      constituencies: { title: 'Constituencies', subtitle: 'Electoral Areas' },
      visualization: { title: 'Visualization', subtitle: 'Parliament Charts' },
    },
    schedule: {
      title: 'Election Schedule',
      subtitle: 'নির্বাচনের সময়সূচি',
      items: [
        { date: 'November 30, 2023', description: 'Last day for submitting nomination papers' },
        { date: 'December 01, 2023', description: 'Scrutiny of nomination papers' },
        { date: 'December 17, 2023', description: 'Last day for withdrawing nomination papers' },
        { date: 'January 05, 2024', description: 'Last time for election campaign' },
        { date: 'January 07, 2024', description: 'Voting day' },
      ],
    },
    summary: {
      title: 'Summary Information',
      subtitle: 'সংক্ষিপ্ত তথ্য',
      items: [
        { label: 'Total Voters', value: '১১,৯৬,৯১,৬৩৩', valueEn: '119,691,633' },
        { label: 'Male Voters', value: '৬,০৭,৭১,৫৭৯', valueEn: '60,771,579' },
        { label: 'Female Voters', value: '৫,৮৯,১৯,২০২', valueEn: '58,919,202' },
        { label: 'Third Gender Voters', value: '৮৫২', valueEn: '852' },
        { label: 'Number of Seats', value: '৩০০', valueEn: '300' },
        { label: 'Total Candidates', value: '১,৯৭১', valueEn: '1,971' },
        { label: 'Independent Candidates', value: '৪৩৬', valueEn: '436' },
        { label: 'Parties', value: '২৮', valueEn: '28' },
      ],
    },
  },
};

export default function HomeContent() {
  const { language, setLanguage, ready } = useLanguagePreference('bn');
  const t = translations[language];

  if (!ready) {
    return null; // Prevent hydration mismatch
  }

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {/* Language Toggle Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="font-medium">{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.hero.title}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            {t.hero.subtitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            {t.hero.description}
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Elections Card */}
            <Link
              href="/elections"
              className="bg-green-50 hover:bg-green-100 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.featureCards.elections.title}</h3>
              <p className="text-sm text-gray-600">{t.featureCards.elections.subtitle}</p>
            </Link>

            {/* Candidates Card */}
            <Link
              href="/candidates"
              className="bg-blue-50 hover:bg-blue-100 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.featureCards.candidates.title}</h3>
              <p className="text-sm text-gray-600">{t.featureCards.candidates.subtitle}</p>
            </Link>

            {/* Constituencies Card */}
            <Link
              href="/elections"
              className="bg-purple-50 hover:bg-purple-100 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.featureCards.constituencies.title}</h3>
              <p className="text-sm text-gray-600">{t.featureCards.constituencies.subtitle}</p>
            </Link>

            {/* Visualization Card */}
            <Link
              href="/analysis"
              className="bg-orange-50 hover:bg-orange-100 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.featureCards.visualization.title}</h3>
              <p className="text-sm text-gray-600">{t.featureCards.visualization.subtitle}</p>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/elections"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span>→ {t.hero.exploreElections}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Election Schedule Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            {t.schedule.title}
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center">
            {t.schedule.subtitle}
          </p>
          
          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
              {/* Timeline Items */}
              {t.schedule.items.map((item, index) => {
                const colors = [
                  { bg: 'bg-blue-100', hover: 'bg-blue-200', text: 'text-blue-600', hoverText: 'text-blue-600' },
                  { bg: 'bg-green-100', hover: 'bg-green-200', text: 'text-green-600', hoverText: 'text-green-600' },
                  { bg: 'bg-purple-100', hover: 'bg-purple-200', text: 'text-purple-600', hoverText: 'text-purple-600' },
                  { bg: 'bg-orange-100', hover: 'bg-orange-200', text: 'text-orange-600', hoverText: 'text-orange-600' },
                  { bg: 'bg-red-100', hover: 'bg-red-200', text: 'text-red-600', hoverText: 'text-red-600' },
                ];
                const color = colors[index];
                const icons = [
                  <svg key="doc" className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>,
                  <svg key="check" className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>,
                  <svg key="minus" className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                  </svg>,
                  <svg key="calendar" className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>,
                  <svg key="vote" className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>,
                ];
                const hoverColorClasses = [
                  'hover:text-blue-600',
                  'hover:text-green-600',
                  'hover:text-purple-600',
                  'hover:text-orange-600',
                  'hover:text-red-600',
                ];
                const hoverBgClasses = [
                  'hover:bg-blue-200',
                  'hover:bg-green-200',
                  'hover:bg-purple-200',
                  'hover:bg-orange-200',
                  'hover:bg-red-200',
                ];
                return (
                  <div key={index} className="relative text-center cursor-pointer transition-all duration-300 hover:-translate-y-2">
                    <div className={`w-24 h-24 ${color.bg} ${hoverBgClasses[index]} rounded-full flex items-center justify-center mb-4 mx-auto relative z-10 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-110 ${color.text}`}>
                      {icons[index]}
                    </div>
                    <div className={`text-sm font-semibold text-gray-900 mb-1 transition-colors duration-300 ${hoverColorClasses[index]}`}>
                      {item.date}
                    </div>
                    <div className="text-xs text-gray-600 transition-colors duration-300 hover:text-gray-900">
                      {item.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Summary Information Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            {t.summary.title}
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center">
            {t.summary.subtitle}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.summary.items.map((item, index) => {
              const iconColors = [
                { bg: 'bg-red-700', hover: 'bg-red-800', text: 'text-red-600' },
                { bg: 'bg-teal-700', hover: 'bg-teal-800', text: 'text-teal-600' },
                { bg: 'bg-blue-700', hover: 'bg-blue-800', text: 'text-blue-600' },
                { bg: 'bg-orange-500', hover: 'bg-orange-600', text: 'text-orange-600' },
                { bg: 'bg-blue-400', hover: 'bg-blue-500', text: 'text-blue-500' },
                { bg: 'bg-green-700', hover: 'bg-green-800', text: 'text-green-600' },
                { bg: 'bg-purple-700', hover: 'bg-purple-800', text: 'text-purple-600' },
                { bg: 'bg-red-600', hover: 'bg-red-700', text: 'text-red-600' },
              ];
              const iconColor = iconColors[index];
              const icons = [
                <svg key="people1" className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>,
                <svg key="male" className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>,
                <svg key="female" className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>,
                <svg key="gender3" className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>,
                <svg key="seat" className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>,
                <svg key="people2" className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>,
                <svg key="person" className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>,
                <svg key="flag" className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>,
              ];
              const groupHoverBgClasses = [
                'group-hover:bg-red-800',
                'group-hover:bg-teal-800',
                'group-hover:bg-blue-800',
                'group-hover:bg-orange-600',
                'group-hover:bg-blue-500',
                'group-hover:bg-green-800',
                'group-hover:bg-purple-800',
                'group-hover:bg-red-700',
              ];
              const groupHoverTextClasses = [
                'group-hover:text-red-600',
                'group-hover:text-teal-600',
                'group-hover:text-blue-600',
                'group-hover:text-orange-600',
                'group-hover:text-blue-500',
                'group-hover:text-green-600',
                'group-hover:text-purple-600',
                'group-hover:text-red-600',
              ];
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl flex items-center gap-4 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                  <div className={`w-16 h-16 ${iconColor.bg} ${groupHoverBgClasses[index]} rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 transform group-hover:scale-110`}>
                    {icons[index]}
                  </div>
                  <div>
                    <div className={`text-sm text-gray-600 mb-1 ${groupHoverTextClasses[index]} transition-colors duration-300`}>
                      {item.label}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.valueEn}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

