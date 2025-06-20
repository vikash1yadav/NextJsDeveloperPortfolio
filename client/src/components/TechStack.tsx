import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { TechStack } from '@shared/schema';

export default function TechStack() {
  const { data: techStackData = [], isLoading } = useQuery<TechStack[]>({
    queryKey: ['/api/tech-stack'],
    queryFn: async () => {
      const response = await fetch('/api/tech-stack');
      if (!response.ok) throw new Error('Failed to fetch tech stack');
      return response.json();
    },
  });

  // Group technologies by category
  const groupedTechStack = techStackData.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, TechStack[]>);

  return (
    <section id="tech-stack" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Technology Stack</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            I work with modern technologies and frameworks to build scalable, performant applications.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="tech-category">
                <Skeleton className="h-6 w-24 mb-6 mx-auto" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, j) => (
                    <Card key={j} className="bg-white dark:bg-slate-800 shadow-sm">
                      <CardContent className="flex items-center p-4">
                        <Skeleton className="w-12 h-12 rounded-lg mr-4" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-20 mb-2" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(groupedTechStack).map(([categoryName, technologies]) => (
                <div key={categoryName} className="tech-category">
                  <h3 className="text-xl font-bold mb-6 text-center capitalize">
                    {categoryName === 'tools' ? 'Tools & DevOps' : categoryName}
                  </h3>
                  <div className="space-y-4">
                    {technologies.map((tech) => (
                      <Card 
                        key={tech.name}
                        className="tech-item bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        <CardContent className="flex items-center p-4">
                          <div className={`w-12 h-12 ${tech.bg} rounded-lg flex items-center justify-center text-white font-bold mr-4`}>
                            {tech.icon.startsWith('fab') || tech.icon.startsWith('fas') ? (
                              <i className={`${tech.icon}`}></i>
                            ) : (
                              tech.icon
                            )}
                          </div>
                          <div>
                            <div className="font-semibold">{tech.name}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{tech.description}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
