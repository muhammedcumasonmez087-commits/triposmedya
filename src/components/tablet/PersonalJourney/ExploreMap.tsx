import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Compass, Navigation, ChevronLeft, ChevronRight, Landmark, Waves, UtensilsCrossed, Castle, Church, Star } from 'lucide-react';

// Import images
import heroCyprus from '@/assets/hero-cyprus.jpg';
import categoryBeach from '@/assets/category-beach.jpg';
import categoryFood from '@/assets/category-food.jpg';
import categoryHistory from '@/assets/category-history.jpg';
import categoryNature from '@/assets/category-nature.jpg';

interface PopularLocation {
  id: string;
  name: string;
  type: 'tarihi' | 'plaj' | 'restoran' | 'doga';
  region: string;
  image: string;
  rating?: number;
  googleMapsUrl: string;
}

const popularLocations: PopularLocation[] = [
  {
    id: 'loc-1',
    name: 'Bellapais Manastırı',
    type: 'tarihi',
    region: 'Girne',
    image: categoryHistory,
    rating: 4.9,
    googleMapsUrl: 'https://www.google.com/maps/place/Bellapais+Manast%C4%B1r%C4%B1'
  },
  {
    id: 'loc-2',
    name: 'Escape Beach Club',
    type: 'plaj',
    region: 'Alsancak',
    image: categoryBeach,
    rating: 4.7,
    googleMapsUrl: 'https://www.google.com/maps/place/Escape+Beach+Club'
  },
  {
    id: 'loc-3',
    name: 'Girne Kalesi',
    type: 'tarihi',
    region: 'Girne',
    image: heroCyprus,
    rating: 4.8,
    googleMapsUrl: 'https://www.google.com/maps/place/Girne+Kalesi'
  },
  {
    id: 'loc-4',
    name: 'Kapalı Maraş',
    type: 'tarihi',
    region: 'Gazimağusa',
    image: categoryNature,
    rating: 4.6,
    googleMapsUrl: 'https://www.google.com/maps/place/Kapal%C4%B1+Mara%C5%9F'
  },
  {
    id: 'loc-5',
    name: 'Niazi\'s Restaurant',
    type: 'restoran',
    region: 'Girne',
    image: categoryFood,
    rating: 4.8,
    googleMapsUrl: 'https://www.google.com/maps/place/Niazi%27s+Restaurant'
  },
  {
    id: 'loc-6',
    name: 'Altın Kumsal',
    type: 'plaj',
    region: 'Karpaz',
    image: categoryBeach,
    rating: 4.9,
    googleMapsUrl: 'https://www.google.com/maps/place/Golden+Beach'
  },
  {
    id: 'loc-7',
    name: 'Salamis Antik Kenti',
    type: 'tarihi',
    region: 'Gazimağusa',
    image: categoryHistory,
    rating: 4.7,
    googleMapsUrl: 'https://www.google.com/maps/place/Salamis+Antik+Kenti'
  },
  {
    id: 'loc-8',
    name: 'Büyük Han',
    type: 'tarihi',
    region: 'Lefkoşa',
    image: categoryFood,
    rating: 4.8,
    googleMapsUrl: 'https://www.google.com/maps/place/B%C3%BCy%C3%BCk+Han'
  },
  {
    id: 'loc-9',
    name: 'Alagadi Plajı',
    type: 'plaj',
    region: 'Girne',
    image: categoryBeach,
    rating: 4.8,
    googleMapsUrl: 'https://www.google.com/maps/place/Alagadi+Turtle+Beach'
  },
  {
    id: 'loc-10',
    name: 'St. Hilarion Kalesi',
    type: 'tarihi',
    region: 'Girne',
    image: categoryNature,
    rating: 4.9,
    googleMapsUrl: 'https://www.google.com/maps/place/St.+Hilarion+Kalesi'
  }
];

const typeConfig = {
  tarihi: { icon: Landmark, color: 'bg-amber-500', label: 'Tarihi' },
  plaj: { icon: Waves, color: 'bg-cyan-500', label: 'Plaj' },
  restoran: { icon: UtensilsCrossed, color: 'bg-orange-500', label: 'Restoran' },
  doga: { icon: Castle, color: 'bg-emerald-500', label: 'Doğa' }
};

export const ExploreMap = () => {
  const googleMapsUrl = "https://www.google.com/maps/d/embed?mid=128PJmjMY7206PsTudNDqrC7agAbZEK4&ehbc=2E312F&ll=35.385254683777575%2C33.69330265000001&z=10";
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', updateScrollButtons);
      return () => ref.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -280 : 280,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Map Container */}
      <div className="relative flex-1 min-h-[380px] rounded-2xl overflow-hidden">
        {/* Google Maps Embed */}
        <iframe
          src={googleMapsUrl}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Kuzey Kıbrıs Haritası"
        />
        
        {/* Overlay Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 z-10"
        >
          <div className="bg-card/90 backdrop-blur-xl rounded-xl px-4 py-2.5 border border-border/50 shadow-lg inline-flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <Compass className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-foreground font-bold">Kuzey Kıbrıs Keşfet</h3>
              <p className="text-muted-foreground text-xs">Haritada gezinin, mekanları keşfedin</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Access Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-4 left-4 z-10 flex gap-2"
        >
          <a
            href="https://www.google.com/maps/d/u/0/viewer?mid=128PJmjMY7206PsTudNDqrC7agAbZEK4"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Navigation className="w-4 h-4" />
            Tam Ekran
          </a>
        </motion.div>

        {/* Legend */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-4 right-4 z-10"
        >
          <div className="bg-card/90 backdrop-blur-xl rounded-xl px-3 py-2 border border-border/50 shadow-lg">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-foreground">Yerler</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-foreground">Yeme-İçme</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-foreground">Plajlar</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Popular Locations Row */}
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-foreground font-semibold">Popüler Lokasyonlar</h3>
          <div className="flex gap-1">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                canScrollLeft 
                  ? 'bg-card/80 hover:bg-card text-foreground' 
                  : 'bg-card/30 text-muted-foreground cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                canScrollRight 
                  ? 'bg-card/80 hover:bg-card text-foreground' 
                  : 'bg-card/30 text-muted-foreground cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {popularLocations.map((location, index) => {
            const config = typeConfig[location.type];
            const Icon = config.icon;
            
            return (
              <motion.a
                key={location.id}
                href={location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[200px] bg-card/60 backdrop-blur-sm rounded-xl overflow-hidden border border-border/30 group cursor-pointer hover:border-primary/50 transition-all"
              >
                <div className="relative h-[100px]">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Type Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 rounded-md ${config.color} text-white text-[10px] font-bold flex items-center gap-1`}>
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </div>

                  {/* Rating */}
                  {location.rating && (
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-sm">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-[10px] font-medium">{location.rating}</span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h4 className="text-foreground font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                    {location.name}
                  </h4>
                  <p className="text-muted-foreground text-xs flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {location.region}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
