import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-green-800 text-white py-4">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <Image
              src="/assets/election_logo.png"
              alt="Bangladesh Election Map"
              width={80}
              height={80}
              className="rounded-lg"
              priority
            />
            <div>
              <h1 className="text-xl font-bold">বাংলাদেশ নির্বাচন</h1>
              <p className="text-sm text-green-200">Election Information System</p>
            </div>
          </Link>
          
          <nav className="flex space-x-6">
            <Link 
              href="/" 
              className="hover:text-green-200 transition-colors font-medium"
            >
              হোম
            </Link>
            <Link 
              href="/candidates" 
              className="hover:text-green-200 transition-colors font-medium"
            >
              প্রার্থী
            </Link>
            <Link 
              href="/elections" 
              className="hover:text-green-200 transition-colors font-medium"
            >
              নির্বাচন
            </Link>
            <Link 
              href="/constituencies" 
              className="hover:text-green-200 transition-colors font-medium"
            >
              নির্বাচনী এলাকা
            </Link>
            <span className="text-green-200">|</span>
            <Link 
              href="/admin/login" 
              className="text-green-300 text-sm hover:text-green-100 transition-colors"
            >
              Admin Panel
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
