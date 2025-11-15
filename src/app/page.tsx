import { getPublishedPosts } from '@/lib/blogService';
import Header from '@/components/Header';
import HomeContent from '@/components/HomeContent';
import BlogSection from '@/components/BlogSection';

export default async function HomePage() {
  const allPosts = await getPublishedPosts(10);
  const recentPosts = allPosts.slice(0, 3); // Only show 3 most recent posts
  const recentSidebar = allPosts.slice(0, 5);

  const categoryMap = new Map<string, number>();
  const tagSet = new Set<string>();

  allPosts.forEach((post) => {
    categoryMap.set(post.category, (categoryMap.get(post.category) ?? 0) + 1);
    post.tags.forEach((tag) => tagSet.add(tag));
  });

  const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }));
  const tags = Array.from(tagSet);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <HomeContent />

      <BlogSection 
        posts={recentPosts} 
        recentSidebar={recentSidebar} 
        categories={categories} 
        tags={tags} 
      />
    </div>
  );
}