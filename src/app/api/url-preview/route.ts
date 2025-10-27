import { NextRequest, NextResponse } from 'next/server';
import { getLinkPreview } from 'link-preview-js';

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
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Ensure URL uses http or https protocol
    if (!['http:', 'https:'].includes(validUrl.protocol)) {
      return NextResponse.json(
        { error: 'URL must use HTTP or HTTPS protocol' },
        { status: 400 }
      );
    }

    try {
      // Extract metadata from the URL
      const previewData = await getLinkPreview(url, {
        timeout: 10000, // 10 second timeout
        followRedirects: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      // Define interface for preview data
      interface PreviewData {
        title?: string;
        description?: string;
        images?: string[];
        siteName?: string;
      }
      
      // Check if previewData has the expected structure
      const hasValidData = previewData && typeof previewData === 'object' && 'title' in previewData;
      
      if (hasValidData) {
        const data = previewData as PreviewData;
        // Format the response data with proper type checking
        const formattedData = {
          title: data.title || 'No title available',
          description: data.description || 'No description available',
          image: data.images && Array.isArray(data.images) && data.images.length > 0 
            ? data.images[0] 
            : null,
          siteName: data.siteName || validUrl.hostname,
          url: url,
          domain: validUrl.hostname
        };

        return NextResponse.json(formattedData);
      } else {
        // Fallback if data structure is unexpected
        return NextResponse.json({
          title: 'Link Preview',
          description: 'Unable to extract metadata from this URL',
          image: null,
          siteName: validUrl.hostname,
          url: url,
          domain: validUrl.hostname,
          error: 'Unexpected response format'
        });
      }
    } catch (previewError) {
      console.error('Error extracting URL metadata:', previewError);
      
      // Fallback response if metadata extraction fails
      return NextResponse.json({
        title: 'Link Preview',
        description: 'Unable to load preview for this URL',
        image: null,
        siteName: validUrl.hostname,
        url: url,
        domain: validUrl.hostname,
        error: 'Failed to extract metadata'
      });
    }
  } catch (error) {
    console.error('Error fetching URL preview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URL preview' },
      { status: 500 }
    );
  }
}
