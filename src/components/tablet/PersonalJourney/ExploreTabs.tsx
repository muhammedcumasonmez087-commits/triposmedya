import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Home, Compass, Gamepad2, Music, Wifi, MapPin, Mic2, Theater, PartyPopper, Trophy, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryId, JourneyAd } from './types';
import { journeyAds } from './journeyData';
import { AdDetailModal } from './AdDetailModal';
import { EventDetailModal, EventData } from './EventDetailModal';
import { ExploreMap } from './ExploreMap';
import { CyprusGuide } from './CyprusGuide';
import { CategoriesExplore } from './CategoriesExplore';

// Import category images
import categoryBeach from '@/assets/category-beach.jpg';
import categoryFood from '@/assets/category-food.jpg';
import categoryNightlife from '@/assets/category-nightlife.jpg';
import categoryHistory from '@/assets/category-history.jpg';
import categoryNature from '@/assets/category-nature.jpg';
import heroCyprus from '@/assets/hero-cyprus.jpg';

// Events data from gisekibris.com
const featuredEvents: EventData[] = [
  {
    id: 'oguzhanlezzet-1',
    name: 'Cratos Premium Hotel Golden Cage',
    artist: 'Oğuzhan ve Lezzet-i Şahane Orkestrası',
    image: 'https://firebasestorage.googleapis.com/v0/b/gisekibris-8b11d.appspot.com/o/events-v2%2F8isNNt7LIrqjK3Gx4DUo%2Fbanner?alt=media&token=aa3a6405-6694-4626-84f4-d55c38c719e6',
    date: '9 Ocak 2026',
    time: '19:00',
    venue: 'Golden Cage',
    location: 'Cratos Premium Hotel, Girne',
    price: '€50',
    category: 'Canlı Müzik',
    description: 'Oğuzhan ve Lezzet-i Şahane Orkestrası ile unutulmaz bir gece! Türk müziğinin en güzel parçaları eşliğinde keyifli bir akşam.',
    ticketUrl: 'https://www.gisekibris.com/',
  },
  {
    id: 'emrealtug-1',
    name: 'Rocks LYRA Konseri',
    artist: 'Emre Altuğ',
    image: 'https://firebasestorage.googleapis.com/v0/b/gisekibris-8b11d.appspot.com/o/events-v2%2FaP3EEyo4eSKH2Tb4UDyU%2Fbanner.jpg?alt=media&token=65897a6b-ff05-4112-ab9b-326069193558',
    date: '24 Ocak 2026',
    time: '20:00',
    venue: 'Rocks LYRA',
    location: 'Girne',
    price: '€75',
    category: 'Konser',
    description: 'Emre Altuğ\'un muhteşem sesi ve enerjisiyle dolu bir konser gecesi. Hit şarkılarıyla eğlenceye hazır olun!',
    ticketUrl: 'https://www.gisekibris.com/',
  },
  {
    id: 'mehmeterdem-1',
    name: 'Acapulco Live',
    artist: 'Mehmet Erdem',
    image: 'https://firebasestorage.googleapis.com/v0/b/gisekibris-8b11d.appspot.com/o/events-v2%2FxwkGnE2ajvPXwDZr0A46%2Fbanner.jpg?alt=media&token=b116c56f-60f7-402c-a21a-cd7227522c73',
    date: '31 Ocak 2026',
    time: '21:00',
    venue: 'Acapulco Resort',
    location: 'Girne',
    price: '€80',
    category: 'Canlı Müzik',
    description: 'Mehmet Erdem\'in duygusal sesi ve hit şarkılarıyla romantik bir gece. "Herkes Aynı Hayatta" ve daha fazlası!',
    ticketUrl: 'https://www.gisekibris.com/',
  },
];

const upcomingEvents: EventData[] = [
  // Konserler
  {
    id: 'oguzhanlezzet-2',
    name: 'Oğuzhan ve Lezzet-i Şahane Orkestrası',
    artist: 'Oğuzhan',
    date: '10 Ocak 2026',
    time: '19:00',
    price: '€50',
    image: 'https://firebasestorage.googleapis.com/v0/b/gisekibris-8b11d.appspot.com/o/events-v2%2Fda2Wv536oknAkuKrKkQb%2Fbanner?alt=media&token=819e556a-d582-40d6-8ebc-1b56e57b4c22',
    venue: 'Golden Cage',
    location: 'Cratos Premium Hotel, Girne',
    category: 'Konser',
    ticketUrl: 'https://www.gisekibris.com/',
  },
  {
    id: 'emrealtug-concert',
    name: 'Emre Altuğ Konseri',
    artist: 'Emre Altuğ',
    date: '24 Ocak 2026',
    time: '20:00',
    price: '€75',
    image: 'https://firebasestorage.googleapis.com/v0/b/gisekibris-8b11d.appspot.com/o/events-v2%2FaP3EEyo4eSKH2Tb4UDyU%2Fbanner.jpg?alt=media&token=65897a6b-ff05-4112-ab9b-326069193558',
    venue: 'Rocks LYRA',
    location: 'Girne',
    category: 'Konser',
    ticketUrl: 'https://www.gisekibris.com/',
  },
  {
    id: 'mehmeterdem-acapulco',
    name: 'Mehmet Erdem Live',
    artist: 'Mehmet Erdem',
    date: '31 Ocak 2026',
    time: '21:00',
    price: '€80',
    image: 'https://firebasestorage.googleapis.com/v0/b/gisekibris-8b11d.appspot.com/o/events-v2%2FxwkGnE2ajvPXwDZr0A46%2Fbanner.jpg?alt=media&token=b116c56f-60f7-402c-a21a-cd7227522c73',
    venue: 'Acapulco Resort',
    location: 'Girne',
    category: 'Konser',
    ticketUrl: 'https://www.gisekibris.com/',
  },
  {
    id: 'sezen-aksu',
    name: 'Sezen Aksu Konseri',
    artist: 'Sezen Aksu',
    date: '14 Şubat 2026',
    time: '21:00',
    price: '€120',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    venue: 'Merit Royal Arena',
    location: 'Girne',
    category: 'Konser',
    ticketUrl: 'https://www.gisekibris.com/',
  },
  // Tiyatrolar
  {
    id: 'tiyatro-1',
    name: 'Hisseli Harikalar Kumpanyası',
    artist: 'Tiyatro Oyunu',
    date: '12 Ocak 2026',
    time: '20:30',
    price: '€35',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
    venue: 'Lefkoşa Belediye Tiyatrosu',
    location: 'Lefkoşa',
    category: 'Tiyatro',
    ticketUrl: 'https://www.gisekibris.com/',
  },
  {
    id: 'tiyatro-2',
    name: 'Bir Delinin Hatıra Defteri',
    artist: 'Tek Kişilik Oyun',
    date: '18 Ocak 2026',
    time: '19:30',
    price: '€40',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    venue: 'Girne Amfitiyatro',
    location: 'Girne',
    category: 'Tiyatro',
    ticketUrl: 'https://www.gisekibris.com/',
  },
  {
    id: 'tiyatro-3',
    name: 'Keşanlı Ali Destanı',
    artist: 'Müzikal',
    date: '25 Ocak 2026',
    time: '20:00',
    price: '€45',
    image: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800',
    venue: 'Merit Crystal Kongre Salonu',
    location: 'Lefkoşa',
    category: 'Tiyatro',
    ticketUrl: 'https://www.gisekibris.com/',
  },
  // Festivaller
  {
    id: 'girne-jazz',
    name: 'Girne Caz Festivali',
    date: '15-18 Şubat 2026',
    price: 'Ücretsiz',
    image: categoryNightlife,
    venue: 'Girne Limanı',
    location: 'Girne',
    category: 'Festival',
    ticketUrl: 'https://www.gisekibris.com/',
  },
  {
    id: 'festival-2',
    name: 'Kıbrıs Yaz Festivali',
    date: '20-22 Haziran 2026',
    price: '€25',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    venue: 'Salamis Antik Tiyatro',
    location: 'Gazimağusa',
    category: 'Festival',
    ticketUrl: 'https://www.gisekibris.com/',
  },
  {
    id: 'festival-3',
    name: 'Zeytinlik Müzik Festivali',
    date: '5-7 Temmuz 2026',
    price: '€60',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    venue: 'Zeytinlik Köyü',
    location: 'Girne',
    category: 'Festival',
    ticketUrl: 'https://www.gisekibris.com/',
  },
  // Spor Etkinlikleri
  {
    id: 'spor-1',
    name: 'Kıbrıs Maratonu 2026',
    date: '8 Mart 2026',
    time: '07:00',
    price: '€30',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    venue: 'Girne - Lefkoşa Parkuru',
    location: 'Girne',
    category: 'Spor',
    ticketUrl: 'https://www.gisekibris.com/',
  },
  {
    id: 'spor-2',
    name: 'Beach Volleyball Turnuvası',
    date: '15 Mayıs 2026',
    time: '10:00',
    price: 'Ücretsiz',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    venue: 'Escape Beach',
    location: 'Girne',
    category: 'Spor',
    ticketUrl: 'https://www.gisekibris.com/',
  },
  {
    id: 'spor-3',
    name: 'Kıbrıs Golf Şampiyonası',
    date: '22 Nisan 2026',
    time: '09:00',
    price: '€100',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
    venue: 'Korineum Golf Resort',
    location: 'Esentepe',
    category: 'Spor',
    ticketUrl: 'https://www.gisekibris.com/',
  },
];

const eventCategories = [
  { id: 'all', name: 'Tümü', icon: Calendar, color: 'bg-primary', filterValue: null },
  { id: 'concerts', name: 'Konserler', icon: Mic2, color: 'bg-orange-500', filterValue: 'Konser' },
  { id: 'theaters', name: 'Tiyatrolar', icon: Theater, color: 'bg-amber-600', filterValue: 'Tiyatro' },
  { id: 'festivals', name: 'Festivaller', icon: PartyPopper, color: 'bg-rose-500', filterValue: 'Festival' },
  { id: 'sports', name: 'Spor', icon: Trophy, color: 'bg-sky-500', filterValue: 'Spor' },
];

interface ExploreTabsProps {
  selectedCategories: CategoryId[];
  onHome: () => void;
  onBack: () => void;
  onPlayRewardGame: () => void;
  onWifi?: () => void;
  onGames?: () => void;
  earnedPoints: number;
}

// Tab navigation items
const tabItems = [
  { id: 'explore', label: 'KEŞFET' },
  { id: 'events', label: 'ETKİNLİKLER' },
  { id: 'categories', label: 'KATEGORİLER' },
  { id: 'more', label: 'DAHA FAZLA' },
  { id: 'guide', label: 'ÖNERİLER' },
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
  onWifi,
  onGames,
  earnedPoints
}: ExploreTabsProps) => {
  const [activeTab, setActiveTab] = useState('explore');
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [selectedAd, setSelectedAd] = useState<JourneyAd | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [savedAds, setSavedAds] = useState<string[]>([]);
  const [selectedEventCategory, setSelectedEventCategory] = useState<string | null>(null);

  // Filter events based on selected category
  const filteredEvents = selectedEventCategory
    ? upcomingEvents.filter(event => event.category === selectedEventCategory)
    : upcomingEvents;
  
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
    switch (navId) {
      case 'home':
        onHome();
        break;
      case 'games':
        if (onGames) onGames();
        else onPlayRewardGame();
        break;
      case 'wifi':
        if (onWifi) onWifi();
        break;
      case 'explore':
        setActiveTab('explore');
        break;
      case 'music':
        // Music functionality - can be added later
        break;
      case 'location':
        // Location functionality - can be added later
        break;
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
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroCyprus})` }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
      
      {/* Content */}
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
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-8 pb-2 flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === 'explore' && (
              <motion.div
                key="explore"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col h-full"
              >
                {/* Hero Carousel */}
                <div className="relative max-w-4xl mx-auto w-full">
                  <div className="relative h-[340px] rounded-2xl overflow-hidden">
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

                        {/* Navigation Arrows - Centered vertically */}
                        <button
                          onClick={() => handleSlideChange(currentHeroIndex === 0 ? heroCarouselAds.length - 1 : currentHeroIndex - 1)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => handleSlideChange((currentHeroIndex + 1) % heroCarouselAds.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-white" />
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
                  <div className="flex justify-center gap-2 mt-3">
                    {heroCarouselAds.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlideChange(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentHeroIndex ? 'bg-white w-6' : 'bg-white/40 w-2'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Featured Hotels Section - pushed to bottom */}
                <div className="mt-auto pt-4">
                  <FeaturedHotelsRow />
                </div>
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col h-full"
              >
                <div className="flex gap-6">
                  {/* Events Hero Carousel */}
                  <div className="flex-1 max-w-4xl">
                    <div className="relative h-[340px] rounded-2xl overflow-hidden">
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

                          {/* Navigation Arrows - Centered vertically */}
                          <button
                            onClick={() => handleEventSlideChange(currentEventIndex === 0 ? featuredEvents.length - 1 : currentEventIndex - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5 text-white" />
                          </button>
                          <button
                            onClick={() => handleEventSlideChange((currentEventIndex + 1) % featuredEvents.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
                          >
                            <ChevronRight className="w-5 h-5 text-white" />
                          </button>

                          {/* Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            {featuredEvents[currentEventIndex].artist && (
                              <p className="text-primary font-bold text-lg mb-1">{featuredEvents[currentEventIndex].artist}</p>
                            )}
                            <h2 className="text-white text-2xl font-bold leading-tight mb-4">
                              {featuredEvents[currentEventIndex].name}
                            </h2>
                            <Button 
                              onClick={() => setSelectedEvent(featuredEvents[currentEventIndex])}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-lg"
                            >
                              Bilet Al
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
                          className={`h-2 rounded-full transition-all ${
                            index === currentEventIndex ? 'bg-white w-6' : 'bg-white/40 w-2'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Categories Section */}
                  <div className="w-[220px] shrink-0">
                    <h3 className="text-white text-lg font-semibold mb-4">Kategorilere Göz At</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {eventCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedEventCategory(cat.filterValue)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl backdrop-blur-sm transition-all ${
                            selectedEventCategory === cat.filterValue
                              ? 'bg-primary/30 ring-2 ring-primary'
                              : 'bg-black/40 hover:bg-black/60'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center`}>
                            <cat.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white text-xs font-medium text-center">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Events - pushed to bottom */}
                <div className="mt-auto pt-4">
                  <UpcomingEventsRow 
                    events={filteredEvents}
                    onEventClick={(event) => setSelectedEvent(event)} 
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col h-full"
              >
                <CategoriesExplore />
              </motion.div>
            )}

            {activeTab === 'more' && (
              <motion.div
                key="more"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col h-full"
              >
                <div className="flex-1 rounded-2xl overflow-hidden relative min-h-[500px]">
                  <ExploreMap />
                </div>
              </motion.div>
            )}

            {activeTab === 'guide' && (
              <motion.div
                key="guide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col h-full"
              >
                <CyprusGuide />
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

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
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
const UpcomingEventsRow = ({ 
  events, 
  onEventClick 
}: { 
  events: EventData[];
  onEventClick?: (event: EventData) => void;
}) => {
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
  }, [events]);

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
      <h3 className="text-foreground text-xl font-semibold mb-4">
        {events.length > 0 ? `Yaklaşan Etkinlikler (${events.length})` : 'Bu kategoride etkinlik bulunamadı'}
      </h3>
      
      {events.length > 0 ? (
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
            {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[200px] cursor-pointer group"
              onClick={() => onEventClick?.(event)}
            >
              <div className="relative h-[120px] rounded-xl overflow-hidden mb-2">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {event.category && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-md bg-primary/90 text-primary-foreground text-[10px] font-bold">
                      {event.category}
                    </span>
                  </div>
                )}
              </div>
              <h4 className="text-foreground font-semibold text-sm leading-tight line-clamp-2">{event.artist || event.name}</h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-muted-foreground text-xs">{event.date}</span>
                <span className="text-primary text-xs font-semibold">{event.price}</span>
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[120px] rounded-xl bg-black/20 backdrop-blur-sm">
          <p className="text-muted-foreground">Bu kategoride henüz etkinlik yok</p>
        </div>
      )}
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