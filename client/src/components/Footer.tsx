import { SOCIAL_LINKS } from '@/lib/constants';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

const navigationLinks = [
  { name: 'Home', href: 'home' },
  { name: 'Projects', href: 'projects' },
  { name: 'Tech Stack', href: 'tech-stack' },
  { name: 'Contact', href: 'contact' },
];

export default function Footer() {
  const { scrollToSection } = useSmoothScroll();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3">
              AC
            </div>
            <span className="text-xl font-bold text-white">Vikas Kumar</span>
          </div>
          
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            {navigationLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="hover:text-blue-400 transition-colors duration-200"
              >
                {link.name}
              </button>
            ))}
          </div>
          
          <div className="text-center md:text-right">
            <div className="text-sm">
              © 2024 Vikas Kumar. All rights reserved.
            </div>
            <div className="text-xs mt-1 text-slate-400">
              Built with Next.js & ❤️
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
