import { motion } from 'motion/react';
import { ArrowRight, Leaf, Coffee, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden border-b border-brand-red/10">
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-sans-ui text-brand-green mb-8 block font-bold tracking-widest uppercase text-xs">Mendoza • Cosecha Orgánica</span>
            <h1 className="text-7xl md:text-9xl font-light italic text-brand-brown leading-none mb-12">
              Hecho para <br />
              <span className="text-brand-red font-bold not-italic">disfrutar.</span>
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <Link to="/catalog" className="bg-brand-green text-white px-12 py-4 rounded-full font-sans-ui hover:bg-brand-red transition-all">
                Ver Catálogo
              </Link>
              <Link to="/gallery" className="border border-brand-brown/30 text-brand-brown px-12 py-4 rounded-full font-sans-ui hover:border-brand-brown transition-all">
                Galería
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Teaser */}
      <section className="py-32 px-10 max-w-7xl mx-auto w-full border-b border-brand-red/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <motion.div 
            className="flex flex-col group cursor-pointer"
          >
            <div className="aspect-[4/3] bg-brand-sand mb-8 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
               <img 
                 src="/gallery/Des 21.jpeg" 
                 alt="Desayunos Personalizados"
                 className="w-full h-full object-cover"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 border-[12px] border-white/40" />
            </div>
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-4">DESAYUNOS PERSONALIZADOS</h2>
            <p className="text-brand-brown/60 italic font-serif leading-relaxed mb-6">Cada caja está armada con detalles para que el regalo sea inolvidable.</p>
            <Link to="/desayuno" className="font-sans-ui text-brand-red self-start border-b border-brand-red/30 pb-1">
              Ver Colección
            </Link>
          </motion.div>

          <motion.div 
            className="flex flex-col group cursor-pointer"
          >
            <div className="aspect-[4/3] bg-brand-green/10 mb-8 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
               <img 
                 src="/gallery/Yerbas.jpeg" 
                 alt="Yerba Orgánica"
                 className="w-full h-full object-cover"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 border-[12px] border-brand-green/5" />
            </div>
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-4">Yerba Orgánica</h2>
            <p className="text-brand-brown/60 italic font-serif leading-relaxed mb-6">Un ritual de todos los días que se vuelve especial cuando elegís calidad.</p>
            <Link to="/catalog?category=yerba" className="font-sans-ui text-brand-green self-start border-b border-brand-green/30 pb-1">
              Ver Variedades
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
