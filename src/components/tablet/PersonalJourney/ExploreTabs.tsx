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
import heroCyprus from '@/assets/hero-cyprus.jpg';

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
    buttonText: 'Rezervasyon Yap - %10 indirim',
  },
  {
    id: 'hero-2',
    name: 'Merit Royal Premium',
    title: 'Lüks Tatil Deneyimi',
    image: heroCyprus,
    buttonText: 'Hemen İncele',
  },
  {
    id: 'hero-3',
    name: 'Bellapais Manastırı',
    title: 'Tarihi Kıbrıs Turu',
    image: categoryHistory,
    buttonText: 'Keşfet',
  },
];

// Featured hotels data
const featuredHotels = [
  {
    id: 'hotel-1',
    name: "Lord's Palace Hotel",
    description: "Girne'de Lüks ve Konfor",
    image: heroCyprus,
    buttonText: 'İncele & Rezervasyon Yap',
    sponsored: true,
  },
  {
    id: 'hotel-2',
    name: 'Merit Royal Premium',
    description: 'Denize Sıfır Tatil Deneyimi',
    image: categoryBeach,
    buttonText: 'Fırsatları Gör',
    sponsored: false,
  },
  {
    id: 'hotel-3',
    name: 'Kaya Palazzo Resort',
    description: 'Aile Boyu Eğlence',
    image: categoryNature,
    buttonText: 'Detaylı Bilgi',
    sponsored: false,
  },
  {
    id: 'hotel-4',
    name: 'Elexus Hotel',
    description: "Girne'de Lüks ve Konfor",
    image: categoryFood,
    buttonText: 'Fırsatları Gör',
    sponsored: false,
  },
  {
    id: 'hotel-5',
    name: 'Acapulco Resort',
    description: 'Eğlence ve Konfor Bir Arada',
    image: categoryNightlife,
    buttonText: 'Rezervasyon Yap',
    sponsored: false,
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
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Tab Navigation */}
        <header className="flex items-center justify-center py-6 px-6 shrink-0">
          <div className="flex items-center gap-1 bg-secondary rounded-full px-2 py-1.5">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab ${
                  activeTab === tab.id
                    ? 'nav-tab-active'
                    : 'nav-tab-inactive'
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
                className="space-y-8"
              >
                {/* Hero Carousel */}
                <div className="relative max-w-3xl mx-auto">
                  <div className="relative h-[280px] rounded-2xl overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentHeroIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <img
                          src={heroCarouselAds[currentHeroIndex].image}
                          alt={heroCarouselAds[currentHeroIndex].name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Sponsor Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-lg">
                            Sponsorlu
                          </span>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                          onClick={() => setCurrentHeroIndex(prev => prev === 0 ? heroCarouselAds.length - 1 : prev - 1)}
                          className="absolute right-14 top-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => setCurrentHeroIndex(prev => (prev + 1) % heroCarouselAds.length)}
                          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-white" />
                        </button>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h2 className="text-white text-2xl font-bold leading-tight mb-4">
                            {heroCarouselAds[currentHeroIndex].name}: {heroCarouselAds[currentHeroIndex].title}
                          </h2>
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-lg">
                            {heroCarouselAds[currentHeroIndex].buttonText}
                          </Button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Pagination Dots */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {heroCarouselAds.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentHeroIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index === currentHeroIndex 
                            ? 'bg-primary w-6' 
                            : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Featured Hotels Section */}
                <FeaturedHotelsRow />
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
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-foreground text-xl font-semibold">Yakında</h3>
                  <p className="text-muted-foreground text-sm mt-2">Bu bölüm hazırlanıyor...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

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

// Featured Hotels Row Component
const FeaturedHotelsRow = () => {
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
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      <h3 className="text-foreground text-xl font-semibold mb-4">Öne Çıkan Oteller</h3>
      
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors border border-white/10"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors border border-white/10"
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
          {featuredHotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[280px] cursor-pointer group"
            >
              <div className="relative h-[180px] rounded-xl overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Sponsor Badge */}
                {hotel.sponsored && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[11px] font-bold">
                      Sponsorlu
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white font-bold text-base leading-tight">{hotel.name}</h4>
                  <p className="text-white/70 text-sm mt-0.5">{hotel.description}</p>
                  <Button 
                    size="sm"
                    className="mt-3 bg-primary/90 hover:bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 h-auto rounded-md"
                  >
                    {hotel.buttonText}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};