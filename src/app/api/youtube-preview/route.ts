import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID parameter is required' },
        { status: 400 }
      );
    }

    // For demo purposes, return mock YouTube data
    const mockYouTubeData = getMockYouTubeData(videoId);
    
    return NextResponse.json(mockYouTubeData);
  } catch (error) {
    console.error('Error fetching YouTube preview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch YouTube preview' },
      { status: 500 }
    );
  }
}

function getMockYouTubeData(videoId: string) {
  // Mock data for different video IDs
  const mockVideos: { [key: string]: { title: string; description: string; thumbnail: string; channelTitle: string } } = {
    'N81lyU7BnmA': {
      title: 'নির্বাচন সংলাপ - পর্ব ১৭: Subhash Singha এবং Dr Sakhawat Hossain',
      description: 'নির্বাচন নিয়ে বিশেষ আলোচনা। রাজনৈতিক বিশ্লেষকদের সাথে নির্বাচন প্রক্রিয়া, রাজনৈতিক দলগুলোর অবস্থান এবং ভবিষ্যতের সম্ভাবনা নিয়ে বিস্তারিত আলোচনা।',
      thumbnail: '/youtube-election-dialogue.jpg',
      channelTitle: 'Election Dialogue Channel'
    },
    'default': {
      title: 'নির্বাচন সংক্রান্ত ভিডিও',
      description: 'নির্বাচন ও রাজনীতি নিয়ে গুরুত্বপূর্ণ আলোচনা এবং বিশ্লেষণ।',
      thumbnail: '/youtube-election-video.jpg',
      channelTitle: 'Political Analysis Channel'
    }
  };

  return mockVideos[videoId] || mockVideos['default'];
}
