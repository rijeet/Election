'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface URLPreviewProps {
  url: string;
  type: 'news' | 'youtube';
  children?: React.ReactNode;
  displayMode?: 'hover' | 'inline';
  className?: string;
}

interface PreviewData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  loading?: boolean;
  error?: string;
}

export default function URLPreview({
  url,
  type,
  children,
  displayMode = 'hover',
  className
}: URLPreviewProps) {
  const [preview, setPreview] = useState<PreviewData>({ loading: true });
  const [showPreview, setShowPreview] = useState(false);

  const isInline = displayMode === 'inline';

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
    setPreview({ loading: true });
  }, [url, type]);

  useEffect(() => {
    const shouldLoadPreview = isInline || showPreview;

    if (shouldLoadPreview && preview.loading) {
      fetchPreviewData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInline, showPreview, preview.loading, url, type]);

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

  const renderPreviewContent = () => {
    if (preview.loading) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span>প্রিভিউ লোড হচ্ছে...</span>
        </div>
      );
    }

    if (preview.error) {
      return (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-900">{preview.title}</h4>
          <p className="text-xs text-gray-600">{getPlaceholderDescription()}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="h-2 w-2 rounded-full bg-gray-400"></span>
            <span>{preview.siteName || (type === 'youtube' ? 'YouTube' : 'News')}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {preview.image && (
          <div className="h-40 w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={preview.image}
              alt={preview.title || 'Preview image'}
              width={320}
              height={160}
              className="h-full w-full object-cover"
              unoptimized
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="space-y-2">
          <h4 className="line-clamp-2 text-sm font-semibold text-gray-900">{preview.title}</h4>
          <p className="line-clamp-3 text-xs text-gray-600">{preview.description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="h-2 w-2 rounded-full bg-blue-400"></span>
            <span>{preview.siteName}</span>
          </div>
        </div>
      </div>
    );
  };

  if (isInline) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block rounded-2xl border border-gray-200 bg-white p-4 shadow-md transition hover:shadow-lg ${className || ''}`.trim()}
      >
        {renderPreviewContent()}
      </a>
    );
  }

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
        className={`inline-block ${className || ''}`.trim()}
      >
        {children}
      </div>

      {showPreview && (
        <div className="absolute -top-2 left-1/2 z-50 w-80 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
          {renderPreviewContent()}
        </div>
      )}
    </div>
  );
}
