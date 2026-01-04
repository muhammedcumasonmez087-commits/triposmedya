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
  { id: 'events', label: 'ETKİNLİKLER' },
  { id: 'categories', label: 'KATEGORİLER' },
  { id: 'more', label: 'DAHA FAZLA' },
  { id: 'recommendations', label: 'ÖNERİLER' },
];

// Main hero carousel ads
const heroCarouselAds = [
  {
    id: 'hero-1',
    name: 'Merit Royal Premium',
    title: 'Lüks Tatil Deneyimi',
    image: heroCyprus,
    buttonText: 'Hemen İncele',
  },
  {
    id: 'hero-2',
    name: 'Escape Beach Club',
    title: 'Gün Batımı Partisi',
    image: categoryBeach,
    buttonText: 'Hemen İncele',
  },
  {
    id: 'hero-3',
    name: 'Bellapais Manastırı',
    title: 'Tarihi Kıbrıs Turu',
    image: categoryHistory,
    buttonText: 'Hemen İncele',
  },
];

export const ExploreTabs = ({
  selectedCategories,
  onHome,
  onBack,
  onPlayRewardGame,
  earnedPoints
}: ExploreTabsProps) => {
  const [activeTab, setActiveTab] = useState('events');
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

// Horizontal Ad Row Component
interface HorizontalAdRowProps {
  title: string;
  ads: JourneyAd[];
  onAdClick: (ad: JourneyAd) => void;
}

const HorizontalAdRow = ({
  title,
  ads,
  onAdClick,
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
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getButtonText = (categoryId: CategoryId) => {
    switch (categoryId) {
      case 'hotel': return 'İncele & Rezervasyon Yap';
      case 'restaurant': return 'Fırsatları Gör';
      case 'beach': return 'Detaylı Bilgi';
      case 'entertainment': return 'Rezervasyon Yap';
      default: return 'Fırsatları Gör';
    }
  };

  return (
    <div className="relative">
      <h3 className="text-foreground text-lg font-semibold mb-4">{title}</h3>
      
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-secondary/60 backdrop-blur-sm flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-secondary/60 backdrop-blur-sm flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
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
              className="flex-shrink-0 w-[200px] cursor-pointer group"
              onClick={() => onAdClick(ad)}
            >
              <div className="relative h-[140px] rounded-xl overflow-hidden glass-card">
                <img
                  src={ad.image}
                  alt={ad.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 gradient-overlay" />
                
                {/* Sponsor Badge - only on first card */}
                {index === 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold">
                      Sponsorlu
                    </span>
                  </div>
                )}

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h4 className="text-foreground font-semibold text-sm leading-tight">{ad.name}</h4>
                  <p className="text-muted-foreground text-xs mt-0.5 truncate">{ad.description}</p>
                  <button 
                    className="text-primary text-xs font-medium mt-2 hover:text-primary/80 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdClick(ad);
                    }}
                  >
                    {getButtonText(ad.categoryId)}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};