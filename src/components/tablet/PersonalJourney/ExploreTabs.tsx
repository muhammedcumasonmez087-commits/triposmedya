import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryId, JourneyAd } from './types';
import { journeyAds } from './journeyData';
import { AdDetailModal } from './AdDetailModal';

// Import category images
import categoryBeach from '@/assets/category-beach.jpg';
import categoryFood from '@/assets/category-food.jpg';
import categoryNightlife from '@/assets/category-nightlife.jpg';
import categoryHistory from '@/assets/category-history.jpg';
import categoryNature from '@/assets/category-nature.jpg';

interface ExploreTabsProps {
  selectedCategories: CategoryId[];
  onHome: () => void;
  onBack: () => void;
  onPlayRewardGame: () => void;
  earnedPoints: number;
}

// Tab navigation items
const tabItems = [
  { id: 'explore', label: 'KEŞFET' },
  { id: 'events', label: 'ETKİNLİKLER' },
  { id: 'categories', label: 'KATEGORİLER' },
  { id: 'more', label: 'DAHA FAZLA' },
  { id: 'recommendations', label: 'ÖNERİLER' },
];

// Main hero carousel ads
const heroCarouselAds = [
  {
    id: 'hero-1',
    name: 'Escape Beach Club',
    title: 'Gün Batımı Partisi & Kokteyller',
    image: categoryBeach,
    offer: 'Rezervasyon Yap - %10 indirim',
    category: 'beach',
  },
  {
    id: 'hero-2',
    name: 'Merit Royal Premium',
    title: 'Denize Sıfır Tatil Deneyimi',
    image: categoryNature,
    offer: 'Erken Rezervasyon %25 İndirim',
    category: 'hotel',
  },
  {
    id: 'hero-3',
    name: 'Bellapais Manastırı',
    title: 'Tarihi Kıbrıs Turu',
    image: categoryHistory,
    offer: 'Rehberli Tur - %15 İndirim',
    category: 'history',
  },
  {
    id: 'hero-4',
    name: 'Nicosia Night Club',
    title: 'Canlı Müzik & DJ Performansları',
    image: categoryNightlife,
    offer: 'İlk İçki Bedava',
    category: 'nightlife',
  },
  {
    id: 'hero-5',
    name: 'Cyprian Fine Dining',
    title: 'Akdeniz Mutfağının En İyisi',
    image: categoryFood,
    offer: '2 Kişilik Menü %20 İndirim',
    category: 'food',
  },
];

export const ExploreTabs = ({
  selectedCategories,
  onHome,
  onBack,
  onPlayRewardGame,
  earnedPoints
}: ExploreTabsProps) => {
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedAd, setSelectedAd] = useState<JourneyAd | null>(null);
  const [savedAds, setSavedAds] = useState<string[]>([]);
  
  // Hero carousel state
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const heroIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate hero carousel
  useEffect(() => {
    heroIntervalRef.current = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % heroCarouselAds.length);
    }, 5000);

    return () => {
      if (heroIntervalRef.current) clearInterval(heroIntervalRef.current);
    };
  }, []);

  const toggleSave = (adId: string) => {
    setSavedAds(prev => 
      prev.includes(adId) ? prev.filter(id => id !== adId) : [...prev, adId]
    );
  };

  // Get ads by category
  const hotelAds = journeyAds.filter(ad => ad.categoryId === 'hotel');
  const restaurantAds = journeyAds.filter(ad => ad.categoryId === 'restaurant');
  const beachAds = journeyAds.filter(ad => ad.categoryId === 'beach');

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)'
    }}>
      {/* Top Tab Navigation */}
      <header className="flex items-center justify-center py-4 px-6 shrink-0">
        <div className="flex items-center gap-1 bg-gray-800/90 rounded-full px-2 py-1.5">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content based on active tab */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden px-8 pb-6">
        <AnimatePresence mode="wait">
          {activeTab === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Hero Carousel */}
              <div className="relative h-[280px] rounded-2xl overflow-hidden shadow-xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentHeroIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${heroCarouselAds[currentHeroIndex].image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Sponsor Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-md bg-orange-500 text-white text-xs font-semibold">
                    Sponsorlu
                  </span>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentHeroIndex((currentHeroIndex - 1 + heroCarouselAds.length) % heroCarouselAds.length)}
                  className="absolute right-16 top-4 z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setCurrentHeroIndex((currentHeroIndex + 1) % heroCarouselAds.length)}
                  className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <motion.div
                    key={`content-${currentHeroIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {heroCarouselAds[currentHeroIndex].name}: {heroCarouselAds[currentHeroIndex].title}
                    </h2>
                    <Button className="mt-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 rounded-lg">
                      {heroCarouselAds[currentHeroIndex].offer}
                    </Button>
                  </motion.div>
                </div>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                  {heroCarouselAds.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentHeroIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentHeroIndex 
                          ? 'bg-white w-6' 
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Öne Çıkan Oteller */}
              <HorizontalAdRow
                title="Öne Çıkan Oteller"
                ads={hotelAds}
                onAdClick={setSelectedAd}
                onSave={toggleSave}
                savedAds={savedAds}
              />

              {/* Popüler Restoranlar */}
              <HorizontalAdRow
                title="Popüler Restoranlar"
                ads={restaurantAds}
                onAdClick={setSelectedAd}
                onSave={toggleSave}
                savedAds={savedAds}
              />

              {/* Plajlar */}
              <HorizontalAdRow
                title="En İyi Plajlar"
                ads={beachAds}
                onAdClick={setSelectedAd}
                onSave={toggleSave}
                savedAds={savedAds}
              />
            </motion.div>
          )}

          {(activeTab === 'events' || activeTab === 'categories' || activeTab === 'more' || activeTab === 'recommendations') && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center h-[400px]"
            >
              <div className="text-center">
                <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-gray-300 text-xl font-semibold">Yakında</h3>
                <p className="text-gray-500 text-sm mt-2">Bu bölüm hazırlanıyor...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Ad Detail Modal */}
      <AnimatePresence>
        {selectedAd && (
          <AdDetailModal
            ad={selectedAd}
            onClose={() => setSelectedAd(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Horizontal Ad Row Component
interface HorizontalAdRowProps {
  title: string;
  ads: JourneyAd[];
  onAdClick: (ad: JourneyAd) => void;
  onSave: (adId: string) => void;
  savedAds: string[];
}

const HorizontalAdRow = ({
  title,
  ads,
  onAdClick,
  onSave,
  savedAds
}: HorizontalAdRowProps) => {
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
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      <h3 className="text-white text-lg font-semibold mb-3">{title}</h3>
      
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {ads.map((ad, index) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[280px] cursor-pointer group"
              onClick={() => onAdClick(ad)}
            >
              <div className="relative h-[160px] rounded-xl overflow-hidden shadow-lg">
                <img
                  src={ad.image}
                  alt={ad.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Sponsor Badge */}
                {ad.tier === 'platinum' && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-xs font-medium">
                      Sponsorlu
                    </span>
                  </div>
                )}

                {/* CTA Button */}
                <div className="absolute bottom-12 right-3">
                  <Button 
                    size="sm" 
                    className="bg-white/90 hover:bg-white text-gray-800 text-xs font-medium px-3 py-1 h-auto rounded-lg shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdClick(ad);
                    }}
                  >
                    {ad.categoryId === 'hotel' ? 'İncele & Rezervasyon Yap' : 
                     ad.categoryId === 'restaurant' ? 'Fırsatları Gör' : 'Detaylı Bilgi'}
                  </Button>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h4 className="text-white font-semibold text-sm">{ad.name}</h4>
                  <p className="text-gray-300 text-xs">{ad.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
