import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PROJECTS } from '@/lib/constants';
import { ArrowLeft, ExternalLink, Github, Calendar, Users, Code, Lightbulb } from 'lucide-react';
import { Link } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ProjectDetail() {
  const [, params] = useRoute('/project/:id');
  const projectId = parseInt(params?.id || '0');
  const project = PROJECTS.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Extended project data for detail view
  const projectDetails = {
    ...project,
    overview: "This project represents a comprehensive solution built with modern web technologies. It demonstrates advanced development practices, scalable architecture, and user-focused design principles.",
    features: [
      "Responsive design optimized for all devices",
      "Real-time data synchronization",
      "Advanced user authentication and authorization",
      "Comprehensive error handling and logging",
      "Performance optimization and caching",
      "Automated testing and CI/CD pipeline"
    ],
    challenges: [
      "Implementing real-time updates across multiple user sessions",
      "Optimizing database queries for large datasets",
      "Creating intuitive user interface for complex workflows",
      "Ensuring cross-browser compatibility and accessibility"
    ],
    screenshots: [
      project.image,
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
    ],
    duration: "3 months",
    team: "Solo Developer",
    status: "Completed"
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="flex items-center text-slate-600 dark:text-slate-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Button>
            </Link>
          </div>

          {/* Project Header */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  {project.category.toUpperCase()}
                </Badge>
                <span className="text-sm text-slate-500 dark:text-slate-400">{projectDetails.duration}</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">{project.title}</h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                {project.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600">
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    View Code
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={project.image}
                alt={project.title}
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>

          {/* Project Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="bg-slate-50 dark:bg-slate-800">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Duration</h3>
                <p className="text-slate-600 dark:text-slate-300">{projectDetails.duration}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-50 dark:bg-slate-800">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Team</h3>
                <p className="text-slate-600 dark:text-slate-300">{projectDetails.team}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-50 dark:bg-slate-800">
              <CardContent className="p-6 text-center">
                <Code className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Status</h3>
                <p className="text-slate-600 dark:text-slate-300">{projectDetails.status}</p>
              </CardContent>
            </Card>
          </div>

          {/* Technology Stack */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Technology Stack</h2>
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="px-4 py-2 text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Project Overview */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Project Overview</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {projectDetails.overview}
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-8">Key Features</h2>
              <ul className="space-y-4">
                {projectDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-8">Challenges & Solutions</h2>
              <ul className="space-y-4">
                {projectDetails.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Screenshots Gallery */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Screenshots</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectDetails.screenshots.map((screenshot, index) => (
                <div key={index} className="relative group overflow-hidden rounded-xl">
                  <img 
                    src={screenshot}
                    alt={`${project.title} screenshot ${index + 1}`}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-violet-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Interested in Similar Work?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              I'd love to discuss how I can help bring your next project to life with modern technologies and best practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => {
                  window.location.href = '/#contact';
                }}
              >
                Get In Touch
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  window.location.href = '/#projects';
                }}
              >
                View More Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}