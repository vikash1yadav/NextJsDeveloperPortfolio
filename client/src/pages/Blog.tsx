import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, ArrowRight, Plus } from 'lucide-react';
import { Link } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import type { BlogPost } from '@shared/schema';
import { format } from 'date-fns';

export default function Blog() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Thoughts, tutorials, and insights on web development, technology, and design.
            </p>
            <div className="mt-8">
              <Link href="/blog/new">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Write New Post
                </Button>
              </Link>
            </div>
          </div>

          {/* Blog Posts */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                  {post.featuredImage && (
                    <div className="overflow-hidden">
                      <img 
                        src={post.featuredImage} 
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(post.publishedAt || post.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {Math.ceil(post.content.length / 1000)} min read
                      </div>
                      
                      <Link href={`/blog/${post.id}`}>
                        <Button variant="ghost" size="sm" className="group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">No blog posts yet</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-8">
                Be the first to write a blog post and share your thoughts!
              </p>
              <Link href="/blog/new">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Write Your First Post
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}