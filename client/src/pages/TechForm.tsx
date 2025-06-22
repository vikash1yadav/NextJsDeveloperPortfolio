import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLocation } from 'wouter';
import { useAdminAuth, useAdminRequest } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { insertTechStackSchema, type InsertTechStack, type TechStack } from '@shared/schema';
import { ArrowLeft, Code } from 'lucide-react';

const TECH_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Mobile',
  'Design',
  'Testing',
  'Cloud',
];

const BG_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-indigo-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-cyan-500',
];

export default function TechForm() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAdminAuth();
  const adminRequest = useAdminRequest();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isEdit = location.includes('/edit/');
  const techId = isEdit ? parseInt(location.split('/').pop() || '0') : null;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, setLocation]);

  const { data: tech } = useQuery<TechStack>({
    queryKey: ['/api/tech-stack', techId],
    queryFn: async () => {
      const response = await fetch(`/api/tech-stack/${techId}`);
      if (!response.ok) throw new Error('Failed to fetch technology');
      return response.json();
    },
    enabled: isEdit && !!techId,
  });

  const form = useForm<InsertTechStack>({
    resolver: zodResolver(insertTechStackSchema),
    defaultValues: {
      name: '',
      icon: '',
      category: '',
      bg: 'bg-blue-500',
    },
  });

  // Update form when tech data loads
  useEffect(() => {
    if (tech) {
      form.reset({
        name: tech.name,
        icon: tech.icon,
        category: tech.category,
        bg: tech.bg,
      });
    }
  }, [tech, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertTechStack) => {
      const response = await adminRequest('/api/admin/tech-stack', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create technology');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tech-stack'] });
      toast({
        title: "Success!",
        description: "Technology created successfully.",
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
    mutationFn: async (data: InsertTechStack) => {
      const response = await adminRequest(`/api/admin/tech-stack/${techId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update technology');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tech-stack'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tech-stack', techId] });
      toast({
        title: "Success!",
        description: "Technology updated successfully.",
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

  const onSubmit = (data: InsertTechStack) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
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
            {isEdit ? 'Edit Technology' : 'Add New Technology'}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            {isEdit ? 'Update technology information' : 'Add a new technology to your stack'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Technology Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technology Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., React, Node.js, PostgreSQL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Text</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Short text or symbol (e.g., JS, ⚛️, 🚀)"
                          {...field} 
                        />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TECH_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Color</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a background color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BG_COLORS.map((color) => (
                            <SelectItem key={color} value={color}>
                              <div className="flex items-center">
                                <div className={`w-4 h-4 ${color} rounded mr-2`}></div>
                                {color.replace('bg-', '').replace('-500', '')}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preview */}
                {form.watch('name') && (
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-2">Preview</h3>
                    <div className={`${form.watch('bg')} p-4 rounded-xl text-white inline-block`}>
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-2">
                          {form.watch('icon') || '?'}
                        </div>
                        <div className="text-sm font-medium">
                          {form.watch('name')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? (isEdit ? 'Updating...' : 'Creating...')
                      : (isEdit ? 'Update Technology' : 'Add Technology')
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