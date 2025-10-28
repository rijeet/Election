import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="relative bg-gradient-to-r from-green-700 via-green-800 to-green-900 text-white shadow-xl">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-800/20 to-green-900/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <Image
                src="/assets/election_logo.png"
                alt="Bangladesh Election Map"
                width={80}
                height={80}
                className="rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                priority
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                বাংলাদেশ নির্বাচন
              </h1>
              <p className="text-sm text-green-200 font-medium">Election Information System</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="relative px-3 py-2 text-sm font-medium text-white hover:text-green-200 transition-colors duration-200 group"
            >
              <span className="relative z-10">হোম</span>
              <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <Link 
              href="/candidates" 
              className="relative px-3 py-2 text-sm font-medium text-white hover:text-green-200 transition-colors duration-200 group"
            >
              <span className="relative z-10">প্রার্থী</span>
              <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <Link 
              href="/elections" 
              className="relative px-3 py-2 text-sm font-medium text-white hover:text-green-200 transition-colors duration-200 group"
            >
              <span className="relative z-10">নির্বাচন</span>
              <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <Link 
              href="/constituencies" 
              className="relative px-3 py-2 text-sm font-medium text-white hover:text-green-200 transition-colors duration-200 group"
            >
              <span className="relative z-10">নির্বাচনী এলাকা</span>
              <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <Link 
              href="/contact" 
              className="relative px-3 py-2 text-sm font-medium text-white hover:text-green-200 transition-colors duration-200 group"
            >
              <span className="relative z-10">যোগাযোগ</span>
              <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            
            <div className="h-6 w-px bg-green-300/30"></div>
            
            <Link 
              href="/admin/login" 
              className="relative px-4 py-2 text-sm font-semibold text-green-100 bg-green-700/30 hover:bg-green-600/40 rounded-lg border border-green-500/30 hover:border-green-400/50 transition-all duration-200 group"
            >
              <span className="relative z-10">Admin Panel</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-green-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
