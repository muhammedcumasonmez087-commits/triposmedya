import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Home, Compass, Gamepad2, Music, Wifi, MapPin, Mic2, Theater, PartyPopper, Trophy } from 'lucide-react';
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

// Events data
const featuredEvents = [
  {
    id: 'event-1',
    name: 'Uluslararası Mağusa Kültür Sanat ve Turizm Festivali',
    image: heroCyprus,
    buttonText: 'Bilet Al',
  },
  {
    id: 'event-2',
    name: 'Girne Caz Festivali',
    image: categoryNightlife,
    buttonText: 'Bilet Al',
  },
  {
    id: 'event-3',
    name: 'Kıbrıs Lezzet Festivali',
    image: categoryFood,
    buttonText: 'Bilet Al',
  },
];

const upcomingEvents = [
  {
    id: 'upcoming-1',
    name: 'Girne Caz Festivali - Girne Limanı',
    date: '15-18 Ekim',
    price: 'Ücretsiz',
    image: categoryNightlife,
  },
  {
    id: 'upcoming-2',
    name: 'Kıbrıs Tiyatro Festivali: "Bir Delinin Hatıra Defteri" - Lefkoşa',
    date: '22 Ekim, 20:00',
    price: '150₺',
    image: categoryHistory,
  },
  {
    id: 'upcoming-3',
    name: 'Kuzey Kıbrıs Lezzet Festivali - Gazimağusa',
    date: '1-3 Kasım',
    price: 'Giriş 50₺',
    image: categoryFood,
  },
  {
    id: 'upcoming-4',
    name: 'Girne Resort & Casino Konser Gecesi',
    date: '1-3 Kasım',
    price: '200₺',
    image: categoryBeach,
  },
];

const eventCategories = [
  { id: 'concerts', name: 'Konserler', icon: Mic2, color: 'bg-orange-500' },
  { id: 'theaters', name: 'Tiyatrolar', icon: Theater, color: 'bg-amber-600' },
  { id: 'festivals', name: 'Festivaller', icon: PartyPopper, color: 'bg-rose-500' },
  { id: 'sports', name: 'Spor Etkinlikleri', icon: Trophy, color: 'bg-sky-500' },
];

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
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [selectedAd, setSelectedAd] = useState<JourneyAd | null>(null);
  const [savedAds, setSavedAds] = useState<string[]>([]);
  
  // Hero carousel state
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const heroIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Progress bar state
  const [progress, setProgress] = useState(0);
  const [eventProgress, setEventProgress] = useState(0);
  const SLIDE_DURATION = 5000; // 5 seconds per slide

  // Auto-rotate hero carousel with progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentHeroIndex(current => (current + 1) % heroCarouselAds.length);
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / 50)); // Update every 50ms
      });
    }, 50);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  // Events carousel auto-rotate
  useEffect(() => {
    if (activeTab !== 'events') return;
    
    const progressInterval = setInterval(() => {
      setEventProgress(prev => {
        if (prev >= 100) {
          setCurrentEventIndex(current => (current + 1) % featuredEvents.length);
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [activeTab]);

  // Reset progress when manually changing slides
  const handleSlideChange = (index: number) => {
    setCurrentHeroIndex(index);
    setProgress(0);
  };

  const handleEventSlideChange = (index: number) => {
    setCurrentEventIndex(index);
    setEventProgress(0);
  };

  // Handle bottom navigation
  const handleNavClick = (navId: string) => {
    setActiveNavItem(navId);
    if (navId === 'explore') {
      setActiveTab('explore');
    } else if (navId === 'games') {
      onPlayRewardGame();
    } else if (navId === 'home') {
      setActiveTab('explore');
    }
  };

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

                        {/* Progress Bars at Top */}
                        <div className="absolute top-4 left-4 right-4 flex gap-2">
                          {heroCarouselAds.map((_, index) => (
                            <div
                              key={index}
                              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                              onClick={() => handleSlideChange(index)}
                            >
                              <motion.div
                                className="h-full bg-white rounded-full"
                                initial={{ width: 0 }}
                                animate={{ 
                                  width: index === currentHeroIndex 
                                    ? `${progress}%` 
                                    : index < currentHeroIndex 
                                      ? '100%' 
                                      : '0%' 
                                }}
                                transition={{ duration: 0.05, ease: 'linear' }}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Navigation Arrows */}
                        <button
                          onClick={() => handleSlideChange(currentHeroIndex === 0 ? heroCarouselAds.length - 1 : currentHeroIndex - 1)}
                          className="absolute right-14 top-12 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => handleSlideChange((currentHeroIndex + 1) % heroCarouselAds.length)}
                          className="absolute right-4 top-12 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
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

                </div>

                {/* Featured Hotels Section */}
                <FeaturedHotelsRow />
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex gap-6">
                  {/* Events Hero Carousel */}
                  <div className="flex-1 max-w-[600px]">
                    <div className="relative h-[280px] rounded-2xl overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentEventIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0"
                        >
                          <img
                            src={featuredEvents[currentEventIndex].image}
                            alt={featuredEvents[currentEventIndex].name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                          
                          {/* Featured Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-lg">
                              Öne Çıkan Etkinlik
                            </span>
                          </div>

                          {/* Navigation Arrows */}
                          <button
                            onClick={() => handleEventSlideChange(currentEventIndex === 0 ? featuredEvents.length - 1 : currentEventIndex - 1)}
                            className="absolute right-14 top-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => handleEventSlideChange((currentEventIndex + 1) % featuredEvents.length)}
                            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4 text-white" />
                          </button>

                          {/* Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h2 className="text-white text-xl font-bold leading-tight mb-4">
                              {featuredEvents[currentEventIndex].name}
                            </h2>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-lg">
                              {featuredEvents[currentEventIndex].buttonText}
                            </Button>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-3">
                      {featuredEvents.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleEventSlideChange(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            index === currentEventIndex ? 'bg-white w-6' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Categories Section */}
                  <div className="w-[220px] shrink-0">
                    <h3 className="text-foreground text-lg font-semibold mb-4">Kategorilere Göz At</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {eventCategories.map((cat) => (
                        <button
                          key={cat.id}
                          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/80 hover:bg-secondary transition-colors"
                        >
                          <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center`}>
                            <cat.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-foreground text-xs font-medium text-center">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <UpcomingEventsRow />
              </motion.div>
            )}

            {(activeTab === 'categories' || activeTab === 'more' || activeTab === 'recommendations') && (
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

      {/* Bottom Navigation Bar */}
      <nav className="shrink-0 bg-card/95 backdrop-blur-xl border-t border-border/50 px-6 py-3">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          <BottomNavItem icon={<MapPin className="w-5 h-5" />} label="Lefkoşa" sublabel="Kalkış" active={activeNavItem === 'location'} onClick={() => handleNavClick('location')} />
          <BottomNavItem icon={<Home className="w-5 h-5" />} label="Ana Sayfa" active={activeNavItem === 'home'} onClick={() => handleNavClick('home')} />
          <BottomNavItem icon={<Gamepad2 className="w-5 h-5" />} label="Oyunlar" active={activeNavItem === 'games'} onClick={() => handleNavClick('games')} />
          <button 
            onClick={() => { setActiveTab('explore'); setActiveNavItem('explore'); }}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm"
          >
            <Compass className="w-5 h-5" />
            KEŞFET
          </button>
          <BottomNavItem icon={<Music className="w-5 h-5" />} label="Müzik" active={activeNavItem === 'music'} onClick={() => handleNavClick('music')} />
          <BottomNavItem icon={<Wifi className="w-5 h-5" />} label="WiFi" active={activeNavItem === 'wifi'} onClick={() => handleNavClick('wifi')} />
        </div>
      </nav>

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

// Bottom Navigation Item Component
const BottomNavItem = ({ 
  icon, 
  label, 
  sublabel, 
  active = false,
  onClick
}: { 
  icon: React.ReactNode; 
  label: string; 
  sublabel?: string; 
  active?: boolean;
  onClick?: () => void;
}) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
      active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
    }`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
    {sublabel && <span className="text-[10px] opacity-70">{sublabel}</span>}
  </button>
);

// Upcoming Events Row Component
const UpcomingEventsRow = () => {
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
      <h3 className="text-foreground text-xl font-semibold mb-4">Yaklaşan Etkinlikler</h3>
      
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors border border-white/10"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors border border-white/10"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[200px] cursor-pointer group"
            >
              <div className="relative h-[120px] rounded-xl overflow-hidden mb-2">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <h4 className="text-foreground font-semibold text-sm leading-tight line-clamp-2">{event.name}</h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-muted-foreground text-xs">{event.date}</span>
                <span className="text-primary text-xs font-semibold">{event.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
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