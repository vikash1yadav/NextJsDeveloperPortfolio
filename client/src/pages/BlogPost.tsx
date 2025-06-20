import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { Link } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import type { BlogPost } from '@shared/schema';
import { format } from 'date-fns';

export default function BlogPostPage() {
  const [, params] = useRoute('/blog/:id');
  const postId = parseInt(params?.id || '0');
  
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['/api/blog', postId],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch blog post');
      return response.json();
    },
    enabled: !!postId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-full mb-4" />
            <div className="flex gap-4 mb-8">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="w-full h-64 rounded-xl mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="ghost" className="flex items-center text-slate-600 dark:text-slate-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Post Header */}
          <article>
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  {post.category}
                </Badge>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(post.publishedAt || post.createdAt), 'MMMM d, yyyy')}
                </div>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {Math.ceil(post.content.length / 1000)} min read
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-4 mb-8">
                <Link href={`/blog/edit/${post.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Post
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Post
                </Button>
              </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-8">
                <img 
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full rounded-xl shadow-lg"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed">
                {post.content}
              </div>
            </div>
          </article>

          {/* Post Footer */}
          <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Last updated: {format(new Date(post.updatedAt), 'MMMM d, yyyy')}
              </div>
              <div className="flex gap-2">
                <Link href="/blog">
                  <Button variant="outline">
                    More Posts
                  </Button>
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </main>

      <Footer />
    </div>
  );
}