import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Settings, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  FolderOpen,
  Code,
  User
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAdminAuth, useAdminRequest } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import type { Project, TechStack } from '@shared/schema';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { admin, isAuthenticated, logout } = useAdminAuth();
  const adminRequest = useAdminRequest();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, setLocation]);

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    enabled: isAuthenticated,
  });

  const { data: techStack, isLoading: techLoading } = useQuery<TechStack[]>({
    queryKey: ['/api/tech-stack'],
    enabled: isAuthenticated,
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await adminRequest(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete project');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Success!",
        description: "Project deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTechMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await adminRequest(`/api/admin/tech-stack/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete tech stack');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tech-stack'] });
      toast({
        title: "Success!",
        description: "Technology deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logout();
    setLocation('/admin/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                <Settings className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-slate-500">Portfolio Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <User className="w-4 h-4 mr-2" />
                Welcome, {admin?.username}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FolderOpen className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Projects</p>
                  <p className="text-2xl font-bold">{projects?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Code className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Technologies</p>
                  <p className="text-2xl font-bold">{techStack?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Settings className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Admin Status</p>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Projects Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2" />
                  Featured Projects
                </CardTitle>
                <Link href="/admin/projects/new">
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-1">{project.description}</p>
                        <div className="flex gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {project.category}
                          </Badge>
                          {project.tags.slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link href={`/admin/projects/edit/${project.id}`}>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteProjectMutation.mutate(project.id)}
                          disabled={deleteProjectMutation.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">No projects found</p>
                  <Link href="/admin/projects/new">
                    <Button size="sm" className="mt-4">
                      Add Your First Project
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tech Stack Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Technology Stack
                </CardTitle>
                <Link href="/admin/tech-stack/new">
                  <Button size="sm" className="bg-green-500 hover:bg-green-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Technology
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {techLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <Skeleton className="h-8 w-8 rounded mr-3" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : techStack && techStack.length > 0 ? (
                <div className="space-y-3">
                  {techStack.map((tech) => (
                    <div key={tech.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 ${tech.bg} rounded flex items-center justify-center text-white text-xs font-bold mr-3`}>
                          {tech.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{tech.name}</h4>
                          <p className="text-xs text-slate-500">{tech.category}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/tech-stack/edit/${tech.id}`}>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteTechMutation.mutate(tech.id)}
                          disabled={deleteTechMutation.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Code className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">No technologies found</p>
                  <Link href="/admin/tech-stack/new">
                    <Button size="sm" className="mt-4">
                      Add Your First Technology
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/blog">
                <Button variant="outline" className="w-full justify-start">
                  View Blog
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full justify-start">
                  View Portfolio
                </Button>
              </Link>
              <Link href="/admin/projects/new">
                <Button variant="outline" className="w-full justify-start">
                  Add Project
                </Button>
              </Link>
              <Link href="/admin/tech-stack/new">
                <Button variant="outline" className="w-full justify-start">
                  Add Technology
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}