import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Check } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  options: string[];
  maxSelections?: number;
  description?: string;
}

type BreakfastType = 'clasico' | 'personalizado';

const CLASICO_INCLUSIONS = [
  "Caja de madera pintada a mano",
  "Cinta de raso",
  "Cubiertos de bambú y servilletas",
  "Ensalada de frutas de estación",
  "Endulzantes",
  "Obsequio"
];

const PERSONALIZADO_INCLUSIONS = [
  "Caja de madera pintada a mano según temática",
  "Cubiertos de bambú y servilletas",
  "Cinta de raso",
  "Taza personalizada según temática",
  "Ensalada de frutas de estación",
  "Mix de golosinas"
];

const SHIPPING_COSTS: Record<string, number> = {
  'Retirar sin costo': 0,
  'Centro': 4000,
  'Godoy Cruz': 4000,
  'Las Heras': 5000,
  'Luján de Cuyo': 5000,
  'Guaymallén': 3000,
  'Maipú': 3000
};

const CLASICO_CATEGORIES: Category[] = [
  {
    id: 'infusion',
    name: 'Infusión',
    options: ['Mate con yerba orgánica', 'Taza con tés en hebras'],
  },
  {
    id: 'bebida',
    name: 'Bebida',
    options: ['Jugo de naranja', 'Limonada', 'Jugo de naranja-zanahoria-jengibre'],
  },
  {
    id: 'salado',
    name: 'Para comer salado',
    options: ['Sandwich de jamón y queso', '3 Chipás grandes'],
  },
  {
    id: 'dulce',
    name: 'Para comer dulce',
    options: ['Porción de budín', 'Cupcake', '2 Medialunas'],
    maxSelections: 3,
    description: 'más de 1 opción valor adicional de $2000'
  },
  {
    id: 'waffle',
    name: 'Waffle',
    options: ['Dip de miel', 'Dip de dulce de leche'],
  },
  {
    id: 'minitorta',
    name: 'Minitorta',
    options: ['Lemon pie', 'Cheesecake', 'Chocotorta'],
  },
  {
    id: 'envio',
    name: 'Envío o Retiro',
    options: Object.keys(SHIPPING_COSTS),
  }
];

const PERSONALIZADO_CATEGORIES: Category[] = [
  {
    id: 'bebida',
    name: 'Bebida',
    options: ['Jugo de naranja', 'Chocolatada Cindor'],
    maxSelections: 2,
    description: 'más de 1 opción valor adicional de $2000'
  },
  {
    id: 'salado',
    name: 'Para comer salado',
    options: ['Sandwich de jamón y queso', '3 Chipás grandes'],
  },
  {
    id: 'dulce',
    name: 'Para comer dulce',
    options: ['Porción de budín', 'Cupcake', '2 Medialunas'],
    maxSelections: 3,
    description: 'más de 1 opción valor adicional de $2000'
  },
  {
    id: 'waffle',
    name: 'Waffle',
    options: ['Dip de dulce de leche', 'Dip de miel', 'Dip de nutella'],
  },
  {
    id: 'minitorta',
    name: 'Minitorta',
    options: ['Lemon pie', 'Cheesecake', 'Chocotorta'],
  },
  {
    id: 'envio',
    name: 'Envío o Retiro',
    options: Object.keys(SHIPPING_COSTS),
  },
];

export default function BreakfastBuilder() {
  const [activeType, setActiveType] = useState<BreakfastType>('personalizado');
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [theme, setTheme] = useState("");
  const phone = "5492616625188";
  const activePrice = activeType === 'clasico' ? 79000 : 105000;
  const categories = activeType === 'clasico' ? CLASICO_CATEGORIES : PERSONALIZADO_CATEGORIES;

  const calculateTotal = () => {
    let total = activePrice;
    
    // Additional cost for variety
    categories.forEach(cat => {
      const selectedCount = selections[cat.id]?.length || 0;
      if (categoryHasExtraCost(cat.id) && selectedCount > 1) {
        total += 2000;
      }
    });

    // Shipping cost
    const selectedShipping = selections['envio']?.[0];
    if (selectedShipping) {
      total += SHIPPING_COSTS[selectedShipping] || 0;
    }

    return total;
  };

  const categoryHasExtraCost = (id: string) => ['dulce', 'bebida'].includes(id);

  const currentTotal = calculateTotal();

  const handleTypeChange = (type: BreakfastType) => {
    setActiveType(type);
    setSelections({}); // Reset selections when type changes
  };

  const handleSelect = (categoryId: string, option: string) => {
    const category = categories.find(c => c.id === categoryId);
    const max = category?.maxSelections || 1;

    setSelections(prev => {
      const current = prev[categoryId] || [];
      
      if (current.includes(option)) {
        return {
          ...prev,
          [categoryId]: current.filter(o => o !== option)
        };
      }

      if (current.length >= max) {
        if (max === 1) {
          return {
            ...prev,
            [categoryId]: [option]
          };
        }
        return prev;
      }

      return {
        ...prev,
        [categoryId]: [...current, option]
      };
    });
  };

  const isComplete = categories.every(cat => (selections[cat.id]?.length || 0) > 0) && (activeType === 'clasico' || theme.trim() !== "");

  const handleSendOrder = () => {
    const isClasico = activeType === 'clasico';
    const priceText = ` por un total de *$${currentTotal.toLocaleString('es-AR')}*`;
    let message = `¡Hola! Me gustaría encargar un desayuno *${activeType.toUpperCase()}*${priceText}:\n\n`;
    
    if (!isClasico && theme) {
      message += `*Temática:* ${theme}\n\n`;
    }

    categories.forEach(cat => {
      const selectedItems = selections[cat.id] || [];
      message += `*${cat.name}:* ${selectedItems.join(', ') || 'No seleccionado'}\n`;
    });

    const selectedShipping = selections['envio']?.[0];
    message += `\n*Total:* $${currentTotal.toLocaleString('es-AR')}`;
    message += `\n_(${selectedShipping === 'Retirar sin costo' ? 'Retiro por sucursal' : 'Incluye envío'})_`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-green font-sans font-bold">Experiencia Personalizada</span>
        <h2 className="text-5xl md:text-6xl font-bold text-brand-green mt-4 mb-2 leading-tight">Armá tu Desayuno</h2>
        
        {activeType === 'clasico' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-2xl font-bold text-brand-brown">$ {activePrice.toLocaleString('es-AR')}</span>
            <span className="text-[10px] text-brand-brown/40 uppercase tracking-widest italic">(Sin envío incluido)</span>
          </div>
        )}

        {activeType === 'personalizado' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-2xl font-bold text-brand-brown">$ {activePrice.toLocaleString('es-AR')}</span>
            <span className="text-[10px] text-brand-brown/40 uppercase tracking-widest italic">(Sin envío incluido)</span>
          </div>
        )}
        
        {/* Toggle Sections */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <button
            onClick={() => handleTypeChange('clasico')}
            className={`px-8 py-3 rounded-full font-sans font-bold text-xs tracking-widest transition-all duration-500 ${
              activeType === 'clasico' 
                ? 'bg-brand-green text-white shadow-xl shadow-brand-green/20 scale-105' 
                : 'bg-white text-brand-brown/40 border border-brand-brown/10 hover:border-brand-green/30'
            }`}
          >
            DESAYUNO CLÁSICO
          </button>
          <button
            onClick={() => handleTypeChange('personalizado')}
            className={`px-8 py-3 rounded-full font-sans font-bold text-xs tracking-widest transition-all duration-500 ${
              activeType === 'personalizado' 
                ? 'bg-brand-green text-white shadow-xl shadow-brand-green/20 scale-105' 
                : 'bg-white text-brand-brown/40 border border-brand-brown/10 hover:border-brand-green/30'
            }`}
          >
            DESAYUNO PERSONALIZADO
          </button>
        </div>
      </motion.div>

      {activeType === 'clasico' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-16 p-8 bg-brand-green/5 border border-brand-green/20 rounded-[32px]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white">
              <Check size={20} />
            </div>
            <h3 className="text-xl font-bold text-brand-green uppercase tracking-wider">Incluye en todos los casos:</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {CLASICO_INCLUSIONS.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                <span className="font-sans text-brand-brown/70 text-sm italic">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeType === 'personalizado' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-16 p-8 bg-brand-green/5 border border-brand-green/20 rounded-[32px]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white">
              <Check size={20} />
            </div>
            <h3 className="text-xl font-bold text-brand-green uppercase tracking-wider">Incluye en todos los casos:</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {PERSONALIZADO_INCLUSIONS.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                <span className="font-sans text-brand-brown/70 text-sm italic">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="space-y-16 mt-16">
        {categories.map((category, catIdx) => {
          const catSelections = selections[category.id] || [];
          return (
            <motion.section 
              key={`${activeType}-${category.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <span className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center font-sans text-xs font-bold shrink-0">
                    {catIdx + 1}
                  </span>
                  <h3 className="text-2xl font-bold text-brand-brown uppercase tracking-widest">{category.name}</h3>
                </div>

                {category.description && (
                  <p className="text-brand-red/70 text-[10px] font-sans italic ml-12 mt-1">
                    ({category.description})
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.options.map((option) => {
                  const isSelected = catSelections.includes(option);
                  const isShipping = category.id === 'envio';
                  
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(category.id, option)}
                      className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? 'border-brand-green bg-brand-green/5 ring-1 ring-brand-green shadow-lg shadow-brand-green/10'
                          : 'border-brand-brown/10 hover:border-brand-green/30 bg-white'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className={`font-sans tracking-tight ${
                          isSelected ? 'text-brand-green font-semibold' : 'text-brand-brown'
                        }`}>
                          {option}
                        </span>
                        {isShipping && (
                          <span className="text-[10px] text-brand-brown/40 font-sans tracking-widest mt-1">
                            $ {SHIPPING_COSTS[option].toLocaleString('es-AR')}
                          </span>
                        )}
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-brand-green border-brand-green' : 'border-brand-brown/20'
                      }`}>
                        {isSelected && <Check size={14} className="text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.section>
          );
        })}

        {activeType === 'personalizado' && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-brand-brown/10 pt-16"
          >
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <span className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center font-sans text-xs font-bold shrink-0">
                  {categories.length + 1}
                </span>
                <h3 className="text-2xl font-bold text-brand-brown uppercase tracking-widest">Temática del desayuno</h3>
              </div>
              <p className="text-brand-brown/60 text-xs font-sans italic ml-12">
                Contanos cómo te gustaría que personalicemos tu caja y taza (Podés encontrar inspiración en nuestra GALERÍA)
              </p>
            </div>
            <div className="px-12">
              <textarea
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ej: Futbol, Princesas, Viajes, etc..."
                className="w-full p-6 rounded-2xl border-2 border-brand-brown/10 focus:border-brand-green bg-white font-sans text-brand-brown outline-none transition-colors min-h-[120px]"
              />
            </div>
          </motion.section>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-20 p-10 bg-brand-brown rounded-[40px] text-white text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h4 className="text-3xl font-bold mb-2">¿Todo listo?</h4>
          <p className="text-white/60 mb-6 max-w-md mx-auto italic">
            Revisá tus opciones del desayuno <strong>{activeType === 'clasico' ? 'Clásico' : 'Personalizado'}</strong> y enviá tu pedido.
          </p>
          
          {activeType === 'clasico' ? (
            <div className="mb-10 inline-block p-6 bg-white/10 rounded-3xl border border-white/10">
              <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Total del pedido</span>
              <span className="text-4xl font-bold text-white">$ {currentTotal.toLocaleString('es-AR')}</span>
              <span className="block text-[9px] text-white/40 mt-1 uppercase tracking-tighter italic">
                {selections['envio']?.[0] === 'Retirar sin costo' ? 'Retiro por sucursal' : 'Incluye envío'}
              </span>
            </div>
          ) : (
            <div className="mb-10 inline-block p-6 bg-white/10 rounded-3xl border border-white/10">
              <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Total del pedido</span>
              <span className="text-4xl font-bold text-white">$ {currentTotal.toLocaleString('es-AR')}</span>
              <span className="block text-[9px] text-white/40 mt-1 uppercase tracking-tighter italic">
                {selections['envio']?.[0] === 'Retirar sin costo' ? 'Retiro por sucursal' : 'Incluye envío'}
              </span>
            </div>
          )}
          
          <br />

          <button
            onClick={handleSendOrder}
            disabled={!isComplete}
            className={`group relative inline-flex items-center gap-3 px-10 py-5 rounded-full font-sans font-bold text-lg transition-all ${
              isComplete 
                ? 'bg-brand-green text-white hover:bg-white hover:text-brand-brown animate-pulse' 
                : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/10'
            }`}
          >
            <MessageCircle size={24} />
            ENVIAR PEDIDO POR WHATSAPP
            {isComplete && (
              <span className="absolute -top-3 -right-3 bg-brand-red text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                ¡Listo!
              </span>
            )}
          </button>
          
          {!isComplete && (
            <p className="text-brand-red text-xs mt-4 font-sans-ui uppercase tracking-widest opacity-80">
              * Por favor, selecciona una opción en cada categoría
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
