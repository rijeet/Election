'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface URLPreviewProps {
  url: string;
  type: 'news' | 'youtube';
  children: React.ReactNode;
}

interface PreviewData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  loading?: boolean;
  error?: string;
}

export default function URLPreview({ url, type, children }: URLPreviewProps) {
  const [preview, setPreview] = useState<PreviewData>({ loading: true });
  const [showPreview, setShowPreview] = useState(false);

  const fetchPreviewData = async () => {
    try {
      setPreview(prev => ({ ...prev, loading: true, error: undefined }));
      
      // For YouTube videos, extract video ID and get video info
      if (type === 'youtube') {
        const videoId = extractYouTubeVideoId(url);
        if (videoId) {
          const response = await fetch(`/api/youtube-preview?videoId=${videoId}`);
          if (response.ok) {
            const data = await response.json();
            setPreview({
              title: data.title || 'YouTube Video',
              description: data.description || 'Watch this video on YouTube',
              image: data.thumbnail || '/youtube-placeholder.jpg',
              siteName: 'YouTube',
              loading: false
            });
            return;
          }
        }
      }

      // For news articles, try to fetch meta data
      const response = await fetch(`/api/url-preview?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        setPreview({
          title: data.title || 'News Article',
          description: data.description || 'Read more about this news',
          image: data.image || '/news-placeholder.jpg',
          siteName: data.siteName || 'News Source',
          loading: false
        });
      } else {
        throw new Error('Failed to fetch preview data');
      }
    } catch {
      setPreview({
        loading: false,
        error: 'Preview not available',
        title: type === 'youtube' ? 'YouTube Video' : 'News Article',
        description: type === 'youtube' ? 'Watch this video on YouTube' : 'Read this news article'
      });
    }
  };

  useEffect(() => {
    if (showPreview && !preview.title && !preview.error) {
      fetchPreviewData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPreview, url, preview.title, preview.error]);

  const extractYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getPlaceholderDescription = () => {
    if (type === 'youtube') {
      return 'নির্বাচন সংলাপ - পর্ব ১৭: Subhash Singha এবং Dr Sakhawat Hossain এর সাথে নির্বাচন নিয়ে আলোচনা';
    }
    return 'প্রথম আলোতে প্রকাশিত নির্বাচন সংক্রান্ত সংবাদ';
  };

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
        className="inline-block"
      >
        {children}
      </div>

      {showPreview && (
        <div className="absolute z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4 transform -translate-x-1/2 left-1/2 -top-2">
          {preview.loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Loading preview...</span>
            </div>
          ) : preview.error ? (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">
                {preview.title}
              </h4>
              <p className="text-xs text-gray-600">
                {getPlaceholderDescription()}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>{preview.siteName || (type === 'youtube' ? 'YouTube' : 'News')}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {preview.image && (
                <div className="w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                  <Image 
                    src={preview.image} 
                    alt={preview.title || 'Preview image'}
                    width={320}
                    height={128}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {preview.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-3">
                  {preview.description}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>{preview.siteName}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
