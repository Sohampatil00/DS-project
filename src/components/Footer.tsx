
import { NavLink } from 'react-router-dom';
import { Github, Twitter, Youtube } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-brand-900 border-t border-borderAdaptive/5 relative overflow-hidden pt-16 pb-8">
            {/* Animated top border */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50 animate-shimmer bg-[length:200%_auto]" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
                <div className="col-span-1 md:col-span-2">
                    <NavLink to="/" className="flex items-center text-2xl tracking-tight mb-4">
                        <span className="text-text-1 font-bold">Code</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple font-bold">
                            Viz
                        </span>
                    </NavLink>
                    <p className="text-text-2 text-sm max-w-xs mb-6">
                        A free visual code learning platform. See algorithms come to life through interactive animations.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="text-text-2 hover:text-text-1 transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-text-2 hover:text-text-1 transition-colors"><Github className="w-5 h-5" /></a>
                        <a href="#" className="text-text-2 hover:text-text-1 transition-colors"><Youtube className="w-5 h-5" /></a>
                    </div>
                </div>

                <div>
                    <h4 className="text-text-1 font-medium mb-4">Learn</h4>
                    <ul className="flex flex-col gap-3 text-sm text-text-2">
                        <li><a href="#" className="hover:text-brand-300 transition-colors">Data Structures</a></li>
                        <li><a href="#" className="hover:text-brand-300 transition-colors">Algorithms</a></li>
                        <li><a href="#" className="hover:text-brand-300 transition-colors">Design Patterns</a></li>
                        <li><a href="#" className="hover:text-brand-300 transition-colors">System Design</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-text-1 font-medium mb-4">Languages</h4>
                    <ul className="flex flex-col gap-3 text-sm text-text-2">
                        <li><a href="#" className="hover:text-brand-300 transition-colors">Python</a></li>
                        <li><a href="#" className="hover:text-brand-300 transition-colors">C++</a></li>
                        <li><a href="#" className="hover:text-brand-300 transition-colors">Java</a></li>
                        <li><a href="#" className="hover:text-brand-300 transition-colors">C</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-text-1 font-medium mb-4">Community</h4>
                    <ul className="flex flex-col gap-3 text-sm text-text-2">
                        <li><a href="#" className="hover:text-brand-300 transition-colors">Discord</a></li>
                        <li><a href="#" className="hover:text-brand-300 transition-colors">GitHub</a></li>
                        <li><a href="#" className="hover:text-brand-300 transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-brand-300 transition-colors">About Us</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 border-t border-borderAdaptive/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-text-2 text-sm">© 2026 CodeViz — Free for everyone, always.</p>
                <div className="flex gap-6 text-sm text-text-2">
                    <a href="#" className="hover:text-text-1 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-text-1 transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};
