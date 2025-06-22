import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { useAdminAuth, useAdminRequest } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { insertProjectSchema, type InsertProject, type Project } from '@shared/schema';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useState } from 'react';

export default function ProjectForm() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const adminRequest = useAdminRequest();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const isEdit = location.includes('/edit/');
  const projectId = isEdit ? parseInt(location.split('/').pop() || '0') : null;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch project');
      return response.json();
    },
    enabled: isEdit && !!projectId,
  });

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      category: '',
      tags: [],
      githubUrl: '',
      liveUrl: '',
      technologies: [],
      featured: 0,
    },
  });

  // Update form when project data loads
  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        description: project.description,
        image: project.image,
        category: project.category,
        tags: project.tags,
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        technologies: project.technologies,
        featured: project.featured,
      });
      setTags(project.tags);
    }
  }, [project, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await adminRequest('/api/admin/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Success!",
        description: "Project created successfully.",
      });
      setLocation('/admin');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await adminRequest(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update project');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId] });
      toast({
        title: "Success!",
        description: "Project updated successfully.",
      });
      setLocation('/admin');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    // Include tags in the submission
    const projectData = { ...data, tags };
    
    if (isEdit) {
      updateMutation.mutate(projectData);
    } else {
      createMutation.mutate(projectData);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">
            {isEdit ? 'Edit Project' : 'Add New Project'}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            {isEdit ? 'Update project information' : 'Create a new featured project'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
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
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Full-Stack, Frontend, Backend" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your project..."
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/project-image.jpg"
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
                    name="githubUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://github.com/username/repo"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="liveUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Live Demo URL (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://project-demo.com"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags</label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        placeholder="Add a tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        onClick={addTag}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="pl-3 pr-1 py-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-slate-500 hover:text-slate-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies (comma-separated)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="React, TypeScript, Node.js, PostgreSQL"
                          {...field}
                          onChange={(e) => {
                            const techs = e.target.value.split(',').map(tech => tech.trim()).filter(Boolean);
                            field.onChange(techs);
                          }}
                          value={field.value?.join(', ') || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.watch('featured') === 1}
                    onChange={(e) => form.setValue('featured', e.target.checked ? 1 : 0)}
                    className="rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Mark as Featured Project
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? (isEdit ? 'Updating...' : 'Creating...')
                      : (isEdit ? 'Update Project' : 'Create Project')
                    }
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setLocation('/admin')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}