import { Link, Outlet } from 'react-router-dom';
import { MessageCircle, Instagram, Menu, X, Coffee, Leaf } from 'lucide-react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo Yerbas', href: '/catalog' },
    { name: 'Galería', href: '/gallery' },
    { name: 'Desayuno', href: '/desayuno' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-serif">
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-brand-red/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-10 h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group py-2">
            <div className="w-14 h-14 flex items-center justify-center relative">
              {/* Fallback Icon (Visible if image fails) */}
              <Leaf className="text-brand-green absolute inset-0 w-full h-full opacity-100 group-hover:scale-110 transition-transform p-3" strokeWidth={1.5} />
              
              {/* Actual Logo Image */}
              <img 
                src="/logo.png" 
                alt="Mate Haría Logo" 
                className="w-full h-full object-contain relative z-10"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold tracking-tighter text-brand-green flex flex-col leading-[0.7]">
                <span>MATE</span>
                <span className="flex items-center gap-2">
                  <div className="h-[3px] w-8 bg-brand-green mt-1"></div>
                  HARÍA
                </span>
              </h1>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                className="font-sans-ui text-brand-brown/70 hover:text-brand-green transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <a 
              href="https://wa.me/5492616625188" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-brand-green text-white px-8 py-2.5 rounded-full font-sans-ui hover:bg-brand-red transition-all"
            >
              WhatsApp
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-brand-brown"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-24 left-0 w-full bg-brand-cream border-b border-brand-red/20 md:hidden overflow-hidden"
            >
              <div className="p-10 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl italic font-serif text-brand-brown py-2 border-b border-brand-red/5"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow pt-24 bg-brand-cream">
        <Outlet />
      </main>

      <footer className="bg-brand-brown text-white py-12 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[9px] font-sans uppercase tracking-[0.2em]">
          <div className="md:-ml-4">© {new Date().getFullYear()} Mate Haría</div>
          <div className="flex flex-col md:flex-row items-center gap-6 mt-6 md:mt-0">
            <span className="opacity-60 text-center">ENVÍOS A DOMICILIO CON CARGO</span>
            <span className="opacity-60">Mendoza, Argentina</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
