import { Button } from '@/components/ui/button';
import { SOCIAL_LINKS } from '@/lib/constants';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { Eye, Download } from 'lucide-react';

export default function Hero() {
  const { scrollToSection } = useSmoothScroll();

  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 animate-gradient bg-[length:400%_400%]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Available for freelance work
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Full Stack Developer
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
                & Next.js Expert
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              I create modern, scalable web applications using Next.js, React, and cutting-edge technologies. 
              Passionate about clean code, exceptional user experiences, and innovative solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => scrollToSection('projects')}
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transform transition-all duration-200"
              >
                <Eye className="mr-2 h-5 w-5" />
                View My Work
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200"
              >
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </Button>
            </div>
            
            <div className="flex justify-center lg:justify-start space-x-6 mt-8">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-500 hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <i className={`${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern developer workspace with computer setup" 
                className="rounded-2xl shadow-2xl w-full max-w-lg animate-float" 
              />
              
              <div className="absolute -top-4 -left-4 bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg animate-float" style={{animationDelay: '-2s'}}>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white text-xs font-bold">Next</div>
                  <span className="text-sm font-medium">Next.js</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg animate-float" style={{animationDelay: '-4s'}}>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">React</div>
                  <span className="text-sm font-medium">React</span>
                </div>
              </div>
              
              <div className="absolute top-1/2 -right-8 bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg animate-float" style={{animationDelay: '-1s'}}>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">JS</div>
                  <span className="text-sm font-medium">JavaScript</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
