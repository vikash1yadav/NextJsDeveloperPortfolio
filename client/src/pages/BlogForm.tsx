import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { insertBlogPostSchema, type InsertBlogPost, type BlogPost } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useState } from 'react';

export default function BlogForm() {
  const [, params] = useRoute('/blog/edit/:id');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const postId = params?.id ? parseInt(params.id) : null;
  const isEditing = !!postId;
  
  const [tagInput, setTagInput] = useState('');

  // Fetch existing post if editing
  const { data: existingPost, isLoading } = useQuery<BlogPost>({
    queryKey: ['/api/blog', postId],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch blog post');
      return response.json();
    },
    enabled: isEditing,
  });

  const form = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: '',
      featuredImage: '',
      tags: [],
      isPublished: 1,
    },
  });

  // Update form when existing post loads
  if (existingPost && isEditing && !form.formState.isDirty) {
    form.reset({
      title: existingPost.title,
      slug: existingPost.slug,
      content: existingPost.content,
      excerpt: existingPost.excerpt,
      category: existingPost.category,
      featuredImage: existingPost.featuredImage || '',
      tags: existingPost.tags,
      isPublished: existingPost.isPublished,
    });
  }

  const createMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      return apiRequest('/api/blog', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      toast({
        title: "Success!",
        description: "Blog post created successfully.",
      });
      setLocation('/blog');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      return apiRequest(`/api/blog/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog', postId] });
      toast({
        title: "Success!",
        description: "Blog post updated successfully.",
      });
      setLocation('/blog');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBlogPost) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues('tags');
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue('tags', [...currentTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  if (isEditing && isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-32 mb-8" />
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="ghost" className="flex items-center text-slate-600 dark:text-slate-300 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter post title" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                if (!isEditing || !form.getValues('slug')) {
                                  form.setValue('slug', generateSlug(e.target.value));
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug (URL)</FormLabel>
                          <FormControl>
                            <Input placeholder="post-url-slug" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of your post..." 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your blog post content here..." 
                            rows={12}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Technology, Tutorial" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featuredImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags</label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        placeholder="Add a tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.watch('tags').map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Publish Post</FormLabel>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Make this post visible to readers
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === 1}
                            onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 pt-6">
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? 'Update Post' : 'Create Post'}
                    </Button>
                    
                    <Link href="/blog">
                      <Button variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}