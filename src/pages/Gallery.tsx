import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  images?: string[];
}

const GalleryCard = ({ item }: { item: GalleryItem; key?: React.Key }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && item.images && item.images.length > 1) {
      // Start cycling After a small delay or immediately
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % item.images!.length);
      }, 1200);
    } else {
      setCurrentIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, item.images]);

  const hasMultipleImages = item.images && item.images.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="break-inside-avoid relative group overflow-hidden editorial-card p-3"
    >
      <div className="relative overflow-hidden aspect-square md:aspect-auto">
        <img 
          src={hasMultipleImages && isHovered ? item.images![currentIndex] : item.imageUrl} 
          alt={item.title} 
          className={`w-full object-cover transition-all duration-500 ${hasMultipleImages ? 'group-hover:scale-105' : 'group-hover:scale-105'}`}
        />
        {hasMultipleImages && (
          <div className="absolute bottom-2 right-2 flex gap-1 group-hover:opacity-100 opacity-0 transition-opacity">
            {item.images!.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 text-left">
        <p className="text-[10px] font-sans italic text-brand-brown/50 uppercase tracking-tighter">"{item.title}"</p>
      </div>
    </motion.div>
  );
};

export default function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'gallery'));
        const imagesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GalleryItem[];

        if (imagesData.length === 0) {
          const galleryItems = [
            { id: '1', title: 'DÍA DE LA MADRE', imageUrl: '/gallery/Des 1.jpeg', images: ['/gallery/Des 1.jpeg', '/gallery/Des 14.jpeg'] },
            { id: '2', title: 'DESAYUNO CLÁSICO', imageUrl: '/gallery/Des 2.jpeg', images: ['/gallery/Des 2.jpeg', '/gallery/Des 24.jpeg'] },
            { id: '3', title: 'DESAYUNO CLÁSICO', imageUrl: '/gallery/Des 3.jpeg' },
            { id: '4', title: 'FECHA ESPECIAL', imageUrl: '/gallery/Des 4.jpeg' },
            { id: '5', title: 'PERSONALIZADO "Barbie"', imageUrl: '/gallery/Des 5.jpeg' },
            { id: '6', title: 'DÍA DEL PADRE', imageUrl: '/gallery/Des 6.jpeg' },
            { id: '7', title: 'PERSONALIZADO "Equipo de fútbol"', imageUrl: '/gallery/Des 7.jpeg', images: ['/gallery/Des 7.jpeg', '/gallery/Des 15.jpeg', '/gallery/Des 17.jpeg', '/gallery/Des 19.jpeg'] },
            { id: '8', title: 'PERSONALIZADO "Superhéroes"', imageUrl: '/gallery/Des 8.jpeg', images: ['/gallery/Des 8.jpeg', '/gallery/Des 18.jpeg'] },
            { id: '9', title: 'PERSONALIZADO "Disney"', imageUrl: '/gallery/Des 9.jpeg', images: ['/gallery/Des 9.jpeg', '/gallery/Des 21.jpeg'] },
            { id: '10', title: 'PERSONALIZADO "Princesas"', imageUrl: '/gallery/Des 10.jpeg' },
            { id: '11', title: 'PERSONALIZADO', imageUrl: '/gallery/Des 11.jpeg', images: ['/gallery/Des 11.jpeg', '/gallery/Des 13.jpeg'] },
            { id: '12', title: 'PERSONALIZADO "Harry Potter"', imageUrl: '/gallery/Des 12.jpeg', images: ['/gallery/Des 12.jpeg', '/gallery/Des 16.jpeg'] },
          ];
          
          setImages(galleryItems);
        } else {
          setImages(imagesData);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'gallery');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <div className="max-w-2xl mx-auto mb-20">
        <h1 className="text-6xl font-light italic mb-6">Pedidos Realizados</h1>
        <p className="font-sans-ui text-brand-brown/40">Inspiración de nuestros clientes</p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10 px-6">
        {images.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
