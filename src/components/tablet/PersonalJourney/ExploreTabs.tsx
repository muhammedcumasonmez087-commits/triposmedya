import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Star, MapPin, Heart, 
  Home, Sparkles, Trophy, Gift, Bell, Search, Calendar,
  Utensils, Umbrella, Building2, Landmark, PartyPopper, ShoppingBag,
  Play, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryId, JourneyAd } from './types';
import { journeyCategories, journeyAds } from './journeyData';
import { AdDetailModal } from './AdDetailModal';

// Import category images
import categoryBeach from '@/assets/category-beach.jpg';
import categoryFood from '@/assets/category-food.jpg';
import categoryNightlife from '@/assets/category-nightlife.jpg';
import categoryHistory from '@/assets/category-history.jpg';
import categoryNature from '@/assets/category-nature.jpg';
import categoryShopping from '@/assets/category-shopping.jpg';

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

// Category navigation items with icons and images
const categoryNavItems = [
  { id: 'all' as const, icon: Home, label: 'Ana Sayfa', image: null },
  { id: 'restaurant' as CategoryId, icon: Utensils, label: 'Restoranlar', image: categoryFood },
  { id: 'beach' as CategoryId, icon: Umbrella, label: 'Plajlar', image: categoryBeach },
  { id: 'hotel' as CategoryId, icon: Building2, label: 'Oteller', image: categoryNature },
  { id: 'history' as CategoryId, icon: Landmark, label: 'Tarih', image: categoryHistory },
  { id: 'entertainment' as CategoryId, icon: PartyPopper, label: 'Etkinlikler', image: categoryNightlife },
  { id: 'shopping' as CategoryId, icon: ShoppingBag, label: 'Alışveriş', image: categoryShopping },
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
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  
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

  // Filter ads by active category
  const getFilteredAds = () => {
    if (activeCategory === 'all') {
      return selectedCategories.length > 0 
        ? journeyAds.filter(ad => selectedCategories.includes(ad.categoryId))
        : journeyAds;
    }
    return journeyAds.filter(ad => ad.categoryId === activeCategory);
  };

  const filteredAds = getFilteredAds();
  const popularAds = filteredAds.filter(ad => ad.tier === 'platinum' || ad.tier === 'gold');
  const getCategoryAds = (categoryId: CategoryId) => 
    filteredAds.filter(ad => ad.categoryId === categoryId);

  // Get hotel ads for "Öne Çıkan Oteller" section
  const hotelAds = journeyAds.filter(ad => ad.categoryId === 'hotel');
  const restaurantAds = journeyAds.filter(ad => ad.categoryId === 'restaurant');
  const beachAds = journeyAds.filter(ad => ad.categoryId === 'beach');

  return (
    <div className="fixed inset-0 flex overflow-hidden" style={{
      background: 'linear-gradient(135deg, #e8dfd4 0%, #f2ebe4 50%, #e8e0d8 100%)'
    }}>
      {/* Left Sidebar - Compact with Category Images */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="relative z-20 flex flex-col py-4 w-20"
        style={{
          background: 'linear-gradient(180deg, rgba(232,223,212,0.98) 0%, rgba(242,235,228,0.98) 100%)',
          borderRight: '1px solid rgba(0,0,0,0.08)'
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6b8fa8] to-[#5a7d96] flex items-center justify-center shadow-md"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Category Navigation with Images */}
        <nav className="flex-1 flex flex-col items-center gap-2 px-2 overflow-y-auto scrollbar-hide">
          {categoryNavItems.map((item, index) => {
            const isActive = activeCategory === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setActiveCategory(item.id);
                  if (activeTab !== 'categories') setActiveTab('categories');
                }}
                className={`relative w-14 flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-white shadow-md' 
                    : 'hover:bg-white/50'
                }`}
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-[#6b8fa8] text-white' : 'bg-gray-200/80 text-gray-600'
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                
                {/* Category Image */}
                {item.image ? (
                  <div className="w-12 h-8 rounded-md overflow-hidden shadow-sm">
                    <img 
                      src={item.image} 
                      alt={item.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-8 rounded-md bg-gradient-to-br from-[#6b8fa8] to-[#5a7d96] flex items-center justify-center">
                    <Home className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-[#6b8fa8]"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Points & Reward */}
        <div className="flex flex-col items-center gap-2 px-2 pt-2 border-t border-gray-200/50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onPlayRewardGame}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 shadow-md flex items-center justify-center"
          >
            <Gift className="w-5 h-5 text-white" />
          </motion.button>
          
          <div className="flex flex-col items-center">
            <Trophy className="w-4 h-4 text-amber-500 mb-0.5" />
            <span className="text-amber-600 font-bold text-xs">{earnedPoints}</span>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Tab Navigation */}
        <header className="flex items-center justify-center py-4 px-6" style={{
          background: 'linear-gradient(180deg, rgba(242,235,228,0.98) 0%, transparent 100%)'
        }}>
          <div className="flex items-center gap-2 bg-gray-800/90 rounded-full px-2 py-1">
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
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-6">
          <AnimatePresence mode="wait">
            {activeTab === 'explore' && (
              <motion.div
                key="explore"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ExploreMainView 
                  heroAds={heroCarouselAds}
                  currentHeroIndex={currentHeroIndex}
                  setCurrentHeroIndex={setCurrentHeroIndex}
                  hotelAds={hotelAds}
                  restaurantAds={restaurantAds}
                  beachAds={beachAds}
                  onAdClick={setSelectedAd}
                  onSave={toggleSave}
                  savedAds={savedAds}
                />
              </motion.div>
            )}

            {activeTab === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CategoriesView
                  activeCategory={activeCategory}
                  filteredAds={filteredAds}
                  popularAds={popularAds}
                  getCategoryAds={getCategoryAds}
                  onAdClick={setSelectedAd}
                  onSave={toggleSave}
                  savedAds={savedAds}
                />
              </motion.div>
            )}

            {(activeTab === 'events' || activeTab === 'more' || activeTab === 'recommendations') && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-center h-[400px]"
              >
                <div className="text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-gray-600 text-xl font-semibold">Yakında</h3>
                  <p className="text-gray-400 text-sm mt-2">Bu bölüm hazırlanıyor...</p>
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

// Explore Main View Component - Hero Carousel + Horizontal Rows
interface ExploreMainViewProps {
  heroAds: typeof heroCarouselAds;
  currentHeroIndex: number;
  setCurrentHeroIndex: (index: number) => void;
  hotelAds: JourneyAd[];
  restaurantAds: JourneyAd[];
  beachAds: JourneyAd[];
  onAdClick: (ad: JourneyAd) => void;
  onSave: (adId: string) => void;
  savedAds: string[];
}

const ExploreMainView = ({
  heroAds,
  currentHeroIndex,
  setCurrentHeroIndex,
  hotelAds,
  restaurantAds,
  beachAds,
  onAdClick,
  onSave,
  savedAds
}: ExploreMainViewProps) => {
  const currentHeroAd = heroAds[currentHeroIndex];

  return (
    <div className="space-y-6">
      {/* Hero Carousel */}
      <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-lg">
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
              style={{ backgroundImage: `url(${currentHeroAd.image})` }}
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
          onClick={() => setCurrentHeroIndex((currentHeroIndex - 1 + heroAds.length) % heroAds.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => setCurrentHeroIndex((currentHeroIndex + 1) % heroAds.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white" />
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
              {currentHeroAd.name}: {currentHeroAd.title}
            </h2>
            <Button className="mt-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6">
              {currentHeroAd.offer}
            </Button>
          </motion.div>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {heroAds.map((_, index) => (
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
        onAdClick={onAdClick}
        onSave={onSave}
        savedAds={savedAds}
      />

      {/* Popüler Restoranlar */}
      <HorizontalAdRow
        title="Popüler Restoranlar"
        ads={restaurantAds}
        onAdClick={onAdClick}
        onSave={onSave}
        savedAds={savedAds}
      />

      {/* Plajlar */}
      <HorizontalAdRow
        title="En İyi Plajlar"
        ads={beachAds}
        onAdClick={onAdClick}
        onSave={onSave}
        savedAds={savedAds}
      />
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

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
  }, [ads]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (ads.length === 0) return null;

  return (
    <section className="relative group">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-gray-800 font-bold text-lg">{title}</h2>
        <button className="text-gray-500 hover:text-orange-500 text-sm font-medium flex items-center gap-1 transition-colors">
          Tümünü Gör
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Scroll Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 mt-6 z-10 w-10 h-10 rounded-full bg-white/90 text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg -translate-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 mt-6 z-10 w-10 h-10 rounded-full bg-white/90 text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg translate-x-2"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Scrollable Row */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        onScroll={checkScrollButtons}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {ads.map((ad, index) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex-shrink-0 w-[220px] cursor-pointer group/card"
            onClick={() => onAdClick(ad)}
          >
            {/* Card Image */}
            <div className="relative h-36 rounded-xl overflow-hidden mb-2 shadow-md">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/card:scale-110"
                style={{ backgroundImage: `url(${ad.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Sponsor Badge */}
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 rounded bg-orange-500/90 text-white text-[10px] font-semibold">
                  Sponsorlu
                </span>
              </div>

              {/* CTA Button */}
              <div className="absolute bottom-2 right-2">
                <Button 
                  size="sm" 
                  className="bg-white/90 hover:bg-white text-gray-800 text-xs font-medium px-3 h-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdClick(ad);
                  }}
                >
                  {ad.tier === 'platinum' ? 'İncele & Rezervasyon Yap' : 
                   ad.tier === 'gold' ? 'Fırsatları Gör' : 'Detaylı Bilgi'}
                </Button>
              </div>

              {/* Heart Button */}
              <button 
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(ad.id);
                }}
              >
                <Heart className={`w-4 h-4 ${savedAds.includes(ad.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Card Info */}
            <div>
              <h3 className="text-gray-800 font-semibold text-sm truncate">{ad.name}</h3>
              <p className="text-gray-500 text-xs truncate">{ad.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// Categories View Component - Current PersonalizedFeed design
interface CategoriesViewProps {
  activeCategory: CategoryId | 'all';
  filteredAds: JourneyAd[];
  popularAds: JourneyAd[];
  getCategoryAds: (categoryId: CategoryId) => JourneyAd[];
  onAdClick: (ad: JourneyAd) => void;
  onSave: (adId: string) => void;
  savedAds: string[];
}

const CategoriesView = ({
  activeCategory,
  filteredAds,
  popularAds,
  getCategoryAds,
  onAdClick,
  onSave,
  savedAds
}: CategoriesViewProps) => {
  const featuredAd = filteredAds.find(ad => ad.tier === 'platinum') || filteredAds[0];

  return (
    <div className="space-y-6">
      {/* Hero Section - Featured Ad */}
      {featuredAd && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[280px] rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => onAdClick(featuredAd)}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${featuredAd.image})` }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="max-w-lg">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.1) 100%)',
                  border: '1px solid rgba(251,191,36,0.3)'
                }}
              >
                <span className="text-lg">{featuredAd.logo}</span>
                <span className="text-amber-400 text-xs font-semibold">ÖNE ÇIKAN</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                {featuredAd.name}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-3 text-white/60 text-sm mb-3">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {featuredAd.rating}
                </span>
                <span>{featuredAd.distance}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {featuredAd.location}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-5 gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  İncele
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave(featuredAd.id);
                  }}
                >
                  <Heart className={`w-4 h-4 ${savedAds.includes(featuredAd.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Offer Badge */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.9) 0%, rgba(220,38,38,0.9) 100%)',
              boxShadow: '0 8px 20px -4px rgba(239,68,68,0.4)'
            }}
          >
            <p className="text-white font-bold text-sm">{featuredAd.offer}</p>
          </div>
        </motion.div>
      )}

      {/* Content Rows */}
      {activeCategory === 'all' ? (
        <>
          <ContentRow 
            title="Popüler" 
            ads={popularAds} 
            onAdClick={onAdClick}
            onSave={onSave}
            savedAds={savedAds}
          />

          {journeyCategories.map(cat => {
            const categoryAds = getCategoryAds(cat.id);
            if (categoryAds.length === 0) return null;
            
            return (
              <ContentRow 
                key={cat.id}
                title={cat.nameTR} 
                ads={categoryAds} 
                onAdClick={onAdClick}
                onSave={onSave}
                savedAds={savedAds}
              />
            );
          })}
        </>
      ) : (
        <ContentRow 
          title={categoryNavItems.find(c => c.id === activeCategory)?.label || ''} 
          ads={filteredAds} 
          onAdClick={onAdClick}
          onSave={onSave}
          savedAds={savedAds}
        />
      )}
    </div>
  );
};

// Content Row Component
interface ContentRowProps {
  title: string;
  ads: JourneyAd[];
  onAdClick: (ad: JourneyAd) => void;
  onSave: (adId: string) => void;
  savedAds: string[];
}

const ContentRow = ({ title, ads, onAdClick, onSave, savedAds }: ContentRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
  }, [ads]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (ads.length === 0) return null;

  return (
    <section className="relative group">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-gray-800 font-bold text-lg tracking-tight">{title}</h2>
        <button className="text-gray-500 hover:text-[#6b8fa8] text-sm font-medium flex items-center gap-1 transition-colors">
          Tümünü gör
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Scroll Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 mt-4 z-10 w-9 h-9 rounded-full bg-white/90 text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md -translate-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 mt-4 z-10 w-9 h-9 rounded-full bg-white/90 text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md translate-x-2"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Scrollable Row */}
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2"
        onScroll={checkScrollButtons}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {ads.map((ad, index) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -6 }}
            className="flex-shrink-0 w-40 cursor-pointer group/card"
            onClick={() => onAdClick(ad)}
          >
            {/* Card Image */}
            <div className="relative h-56 rounded-xl overflow-hidden mb-2 shadow-md">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/card:scale-110"
                style={{ backgroundImage: `url(${ad.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
              
              {/* Hover Actions */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                  <button 
                    className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdClick(ad);
                    }}
                  >
                    <Play className="w-4 h-4 text-gray-900 fill-gray-900 ml-0.5" />
                  </button>
                  <button 
                    className="w-7 h-7 rounded-full bg-black/60 border border-white/30 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSave(ad.id);
                    }}
                  >
                    <Heart className={`w-3 h-3 ${savedAds.includes(ad.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                  </button>
                </div>
              </div>

              {/* Rating Badge */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-white text-xs font-semibold">{ad.rating}</span>
              </div>

              {/* Premium indicator for top 3 */}
              {index < 3 && (
                <div 
                  className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#1a1a1a'
                  }}
                >
                  {index + 1}
                </div>
              )}
            </div>

            {/* Card Info */}
            <div className="px-0.5">
              <h3 className="text-gray-800 font-semibold text-sm truncate mb-0.5">{ad.name}</h3>
              <p className="text-gray-500 text-xs truncate">{ad.distance} • {ad.priceRange}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
