import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // For demo purposes, return mock data based on URL patterns
    const mockPreviewData = getMockPreviewData(url);
    
    return NextResponse.json(mockPreviewData);
  } catch (error) {
    console.error('Error fetching URL preview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URL preview' },
      { status: 500 }
    );
  }
}

function getMockPreviewData(url: string) {
  // Prothom Alo patterns
  if (url.includes('prothomalo.com')) {
    return {
      title: 'নির্বাচন সংলাপ: রাজনৈতিক বিশ্লেষণ ও আলোচনা',
      description: 'প্রথম আলোতে প্রকাশিত নির্বাচন সংক্রান্ত বিশেষ প্রতিবেদন। রাজনৈতিক বিশ্লেষকদের সাথে নির্বাচন নিয়ে বিস্তারিত আলোচনা।',
      image: '/prothom-alo-preview.jpg',
      siteName: 'প্রথম আলো'
    };
  }

  // Daily Star patterns
  if (url.includes('thedailystar.net')) {
    return {
      title: 'Election Analysis: Political Commentary',
      description: 'Comprehensive analysis of election trends and political developments in Bangladesh.',
      image: '/daily-star-preview.jpg',
      siteName: 'The Daily Star'
    };
  }

  // BBC Bangla patterns
  if (url.includes('bbc.com/bengali')) {
    return {
      title: 'নির্বাচন: বিশেষ প্রতিবেদন',
      description: 'বিবিসি বাংলায় প্রকাশিত নির্বাচন সংক্রান্ত বিশেষ প্রতিবেদন ও বিশ্লেষণ।',
      image: '/bbc-bangla-preview.jpg',
      siteName: 'বিবিসি বাংলা'
    };
  }

  // Default news preview
  return {
    title: 'নির্বাচন সংক্রান্ত সংবাদ',
    description: 'নির্বাচন ও রাজনীতি নিয়ে গুরুত্বপূর্ণ সংবাদ ও বিশ্লেষণ।',
    image: '/news-preview.jpg',
    siteName: 'সংবাদ মাধ্যম'
  };
}
