import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ShoppingBag, X, MessageCircle, Send } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { addDoc, serverTimestamp } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Checkout form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        
        // If empty, we can keep it empty or add sample yerba
        if (productsData.length === 0) {
          setProducts([]);
        } else {
          setProducts(productsData.filter(p => p.category === 'yerba'));
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products;

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = {
      customerName,
      customerPhone,
      cardMessage,
      items: cart.map(i => ({ id: i.id, name: i.name, price: i.price })),
      total: totalPrice,
      status: 'pending',
      createdAt: serverTimestamp()
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderComplete(docRef.id);
      setCart([]);
      setIsCheckingOut(false);
      setIsCartOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-32">
      {/* Floating Cart Button */}
      {cart.length > 0 && !isCartOpen && (
        <motion.button 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-40 bg-brand-green text-brand-cream w-16 h-16 rounded-full flex items-center justify-center luxury-shadow-lg shadow-2xl"
        >
          <div className="absolute -top-1 -right-1 bg-brand-red text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-brand-cream font-bold">
            {cart.length}
          </div>
          <ShoppingBag size={28} />
        </motion.button>
      )}

      <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8 border-b border-brand-red/10 pb-10">
        <div>
          <h1 className="text-6xl font-bold uppercase tracking-tighter mb-4 text-brand-brown">CATÁLOGO YERBAS</h1>
          <p className="font-sans-ui text-brand-brown/40 uppercase tracking-widest text-[10px]">Cosechas seleccionadas de autor</p>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full flex flex-col items-center justify-center py-32 border-2 border-dashed border-brand-red/10 rounded-[40px] text-center"
        >
          <h2 className="text-5xl font-light italic text-brand-brown/60 mb-4">PRÓXIMAMENTE</h2>
          <p className="font-sans-ui text-brand-brown/40 max-w-md mx-auto">
            Estamos seleccionando las mejores yerbas de autor para completar nuestra propuesta.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {filteredProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              className="group flex flex-col"
            >
              <div className="relative aspect-square bg-brand-sand mb-6 overflow-hidden">
                <div className="absolute inset-0 border-[8px] border-white/40 z-10" />
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <button 
                  onClick={() => addToCart(product)}
                  className="absolute bottom-4 right-4 bg-white text-brand-green px-4 py-2 font-sans-ui hover:bg-brand-green hover:text-white transition-all z-20 shadow-sm"
                >
                  + AGREGAR
                </button>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="font-sans-ui text-brand-red text-[8px] opacity-60 uppercase tracking-widest">
                  COSECHA SELECCIONADA
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight leading-tight">{product.name}</h3>
                <p className="text-[11px] text-brand-brown/60 italic font-serif mb-3 leading-relaxed">{product.description}</p>
                <p className="text-lg font-bold text-brand-red font-sans">${product.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-brand-brown/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-brand-cream shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-serif text-brand-brown">Tu Selección</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-brand-brown/5 rounded-full"><X /></button>
              </div>

              <div className="flex-grow overflow-y-auto space-y-6">
                {cart.length === 0 ? (
                  <p className="text-center text-brand-brown/40 italic py-12">No hay productos seleccionados.</p>
                ) : (
                  cart.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <img src={item.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-grow">
                        <h4 className="font-serif text-lg">{item.name}</h4>
                        <p className="text-brand-green font-bold text-sm">${item.price}</p>
                      </div>
                      <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="text-brand-red/50 hover:text-brand-red">
                        <X size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="mt-8 pt-8 border-t border-brand-brown/10">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-lg font-serif">Total</span>
                    <span className="text-2xl font-bold text-brand-green">${totalPrice}</span>
                  </div>
                  <button 
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full bg-brand-green text-brand-cream py-4 rounded-full font-bold luxury-shadow hover:bg-brand-brown transition-colors"
                  >
                    Confirmar Pedido
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckingOut && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCheckingOut(false)}
              className="absolute inset-0 bg-brand-brown/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-brand-cream rounded-[40px] p-8 shadow-2xl"
            >
              <h3 className="text-3xl font-serif mb-2">Finalizar Pedido</h3>
              <p className="text-brand-brown/60 mb-8 italic">Completa tus datos para coordinar la entrega y el pago.</p>

              <form onSubmit={handleCheckout} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-brown/40 mb-2">Nombre Completo</label>
                  <input 
                    required 
                    value={customerName} onChange={e => setCustomerName(e.target.value)}
                    className="w-full bg-brand-cream-dark border-2 border-brand-brown/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-green" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-brown/40 mb-2">Teléfono de Contacto</label>
                  <input 
                    required 
                    value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full bg-brand-cream-dark border-2 border-brand-brown/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-green" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-brown/40 mb-2">Mensaje para la Tarjeta (Opcional)</label>
                  <textarea 
                    value={cardMessage} onChange={e => setCardMessage(e.target.value)}
                    placeholder="Escribe aquí el mensaje personalizado..."
                    rows={4}
                    className="w-full bg-brand-cream-dark border-2 border-brand-brown/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-green resize-none" 
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" onClick={() => setIsCheckingOut(false)}
                    className="flex-1 border-2 border-brand-brown/10 py-4 rounded-full font-bold opacity-60 hover:opacity-100"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-brand-green text-brand-cream py-4 rounded-full font-bold luxury-shadow flex items-center justify-center gap-2 hover:bg-brand-brown transition-colors"
                  >
                    Enviar Pedido <Send size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {orderComplete && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div className="absolute inset-0 bg-brand-green/90 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-md text-center text-brand-cream px-8"
            >
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-serif mb-4">Pedido Enviado</h2>
              <p className="text-brand-cream/80 mb-4">Tu pedido ha sido registrado con éxito.</p>
              <div className="bg-white/10 p-6 rounded-2xl mb-8 border border-white/20">
                <p className="text-xs uppercase tracking-[0.2em] opacity-60 mb-2">ID de seguimiento</p>
                <p className="text-2xl font-bold tracking-widest">{orderComplete}</p>
              </div>
              <p className="text-sm italic opacity-80 mb-12">Te contactaremos por WhatsApp a la brevedad para coordinar pago y entrega.</p>
              
              <div className="flex flex-col gap-4">
                <a 
                  href={`https://wa.me/5492616625188?text=Hola!%20Realicé%20el%20pedido%20MH-${orderComplete}`} 
                  target="_blank" rel="noopener noreferrer"
                  className="bg-white text-brand-green py-4 rounded-full font-bold flex items-center justify-center gap-2"
                >
                  Confirmar por WhatsApp <MessageCircle size={20} />
                </a>
                <button onClick={() => setOrderComplete(null)} className="text-white/60 hover:text-white transition-colors underline text-sm">
                  Cerrar ventana
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

