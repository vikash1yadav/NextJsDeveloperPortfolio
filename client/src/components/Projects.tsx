import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PROJECTS } from '@/lib/constants';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'web-app', label: 'Web Apps' },
  { id: 'api', label: 'APIs' },
  { id: 'tools', label: 'Tools' },
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = activeFilter === 'all' 
    ? PROJECTS 
    : PROJECTS.filter(project => project.category === activeFilter);

  return (
    <section id="projects" className="py-20 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            A collection of my recent work showcasing modern web applications built with Next.js, React, and innovative technologies.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              variant={activeFilter === category.id ? "default" : "outline"}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeFilter === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-500 hover:text-white'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                    <a 
                      href={project.demoUrl} 
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-blue-500 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a 
                      href={project.githubUrl} 
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-blue-500 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold group-hover:text-blue-500 transition-colors duration-200">
                    {project.title}
                  </h3>
                  <div className="flex space-x-1">
                    {project.primaryTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <button className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center">
                    View Details <ArrowRight className="ml-1 w-4 h-4" />
                  </button>
                  <div className="flex space-x-3">
                    <a 
                      href={project.demoUrl} 
                      className="text-slate-400 hover:text-blue-500 transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a 
                      href={project.githubUrl} 
                      className="text-slate-400 hover:text-blue-500 transition-colors duration-200"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline"
            size="lg"
            className="px-8 py-4 border-2 border-blue-500 text-blue-500 font-semibold rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-200"
          >
            <Github className="mr-2 h-5 w-5" />
            View All Projects on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
