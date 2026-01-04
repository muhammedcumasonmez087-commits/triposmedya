import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, ChevronRight, Star, MapPin, Play, Search, Bell,
  Heart, ChevronLeft, Sparkles, Trophy, Gift,
  Utensils, Umbrella, Building2, Landmark, PartyPopper, ShoppingBag, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryId, JourneyAd } from './types';
import { journeyCategories, journeyAds } from './journeyData';
import { AdDetailModal } from './AdDetailModal';

interface PersonalizedFeedProps {
  selectedCategories: CategoryId[];
  onHome: () => void;
  onBack: () => void;
  onPlayRewardGame: () => void;
  earnedPoints: number;
}

// Category navigation items with icons
const categoryNavItems = [
  { id: 'all' as const, icon: Home, label: 'Ana Sayfa' },
  { id: 'restaurant' as CategoryId, icon: Utensils, label: 'Restoranlar' },
  { id: 'beach' as CategoryId, icon: Umbrella, label: 'Plajlar' },
  { id: 'hotel' as CategoryId, icon: Building2, label: 'Oteller' },
  { id: 'history' as CategoryId, icon: Landmark, label: 'Tarih' },
  { id: 'entertainment' as CategoryId, icon: PartyPopper, label: 'Etkinlikler' },
  { id: 'shopping' as CategoryId, icon: ShoppingBag, label: 'Alışveriş' },
];

export const PersonalizedFeed = ({
  selectedCategories,
  onHome,
  onBack,
  onPlayRewardGame,
  earnedPoints
}: PersonalizedFeedProps) => {
  const [selectedAd, setSelectedAd] = useState<JourneyAd | null>(null);
  const [savedAds, setSavedAds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');

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

  // Get featured ad for hero
  const featuredAd = filteredAds.find(ad => ad.tier === 'platinum') || filteredAds[0];

  // Group ads by category for rows
  const getCategoryAds = (categoryId: CategoryId) => 
    filteredAds.filter(ad => ad.categoryId === categoryId);

  // Get popular ads (platinum + gold tier)
  const popularAds = filteredAds.filter(ad => ad.tier === 'platinum' || ad.tier === 'gold');

  const toggleSave = (adId: string) => {
    setSavedAds(prev => 
      prev.includes(adId) ? prev.filter(id => id !== adId) : [...prev, adId]
    );
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0d0d1a 100%)'
    }}>
      {/* Left Sidebar - Compact with Categories */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="relative z-20 flex flex-col py-4 w-16"
        style={{
          background: 'linear-gradient(180deg, rgba(20,20,30,0.95) 0%, rgba(15,15,25,0.98) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Category Navigation */}
        <nav className="flex-1 flex flex-col items-center gap-1 px-2">
          {categoryNavItems.map((item, index) => {
            const isActive = activeCategory === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setActiveCategory(item.id)}
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all group ${
                  isActive 
                    ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20' 
                    : 'hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-white/50 group-hover:text-white/80'}`} />
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-amber-400"
                  />
                )}

                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-black/90 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.label}
                </div>
              </motion.button>
            );
          })}
        </nav>

        {/* Points & Reward */}
        <div className="flex flex-col items-center gap-2 px-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onPlayRewardGame}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center group"
          >
            <Gift className="w-5 h-5 text-amber-400" />
            <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-black/90 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              Çark Çevir
            </div>
          </motion.button>
          
          <div className="flex flex-col items-center">
            <Trophy className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-amber-400 font-bold text-xs">{earnedPoints}</span>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center Content - Expanded */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Top Navigation */}
          <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4" style={{
            background: 'linear-gradient(180deg, rgba(15,15,26,0.95) 0%, transparent 100%)'
          }}>
            {/* Category Title */}
            <div className="flex items-center gap-4">
              <h1 className="text-white font-bold text-xl">
                {activeCategory === 'all' 
                  ? 'Keşfet' 
                  : categoryNavItems.find(c => c.id === activeCategory)?.label}
              </h1>
              <div className="flex items-center gap-2">
                {selectedCategories.slice(0, 3).map(catId => {
                  const cat = journeyCategories.find(c => c.id === catId);
                  return (
                    <span
                      key={catId}
                      className="text-white/40 text-xs px-2 py-1 rounded-full bg-white/5"
                    >
                      {cat?.icon} {cat?.nameTR}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Search & Notifications */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Ara..."
                  className="w-48 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <button className="relative p-2 rounded-xl hover:bg-white/10 transition-colors">
                <Bell className="w-5 h-5 text-white/60" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
              </button>
            </div>
          </header>

          {/* Hero Section - Featured Ad */}
          {featuredAd && (
            <section className="px-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-[320px] rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setSelectedAd(featuredAd)}
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
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                      style={{
                        background: 'linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.1) 100%)',
                        border: '1px solid rgba(251,191,36,0.3)'
                      }}
                    >
                      <span className="text-lg">{featuredAd.logo}</span>
                      <span className="text-amber-400 text-xs font-semibold">ÖNE ÇIKAN</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-black text-white mb-2 tracking-tight"
                    >
                      {featuredAd.name}
                    </motion.h1>

                    {/* Meta */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-3 text-white/60 text-sm mb-3"
                    >
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        {featuredAd.rating}
                      </span>
                      <span>{featuredAd.distance}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {featuredAd.location}
                      </span>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-3"
                    >
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
                          toggleSave(featuredAd.id);
                        }}
                      >
                        <Heart className={`w-4 h-4 ${savedAds.includes(featuredAd.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Offer Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.9) 0%, rgba(220,38,38,0.9) 100%)',
                    boxShadow: '0 8px 20px -4px rgba(239,68,68,0.4)'
                  }}
                >
                  <p className="text-white font-bold text-sm">{featuredAd.offer}</p>
                </motion.div>
              </motion.div>
            </section>
          )}

          {/* Content Rows based on active category */}
          {activeCategory === 'all' ? (
            <>
              {/* Popular Row */}
              <ContentRow 
                title="Popüler" 
                ads={popularAds} 
                onAdClick={setSelectedAd}
                onSave={toggleSave}
                savedAds={savedAds}
              />

              {/* Category Rows */}
              {journeyCategories.map(cat => {
                const categoryAds = getCategoryAds(cat.id);
                if (categoryAds.length === 0) return null;
                
                return (
                  <ContentRow 
                    key={cat.id}
                    title={cat.nameTR} 
                    ads={categoryAds} 
                    onAdClick={setSelectedAd}
                    onSave={toggleSave}
                    savedAds={savedAds}
                  />
                );
              })}
            </>
          ) : (
            <ContentRow 
              title={categoryNavItems.find(c => c.id === activeCategory)?.label || ''} 
              ads={filteredAds} 
              onAdClick={setSelectedAd}
              onSave={toggleSave}
              savedAds={savedAds}
            />
          )}

          {/* Bottom padding */}
          <div className="h-8" />
        </main>

        {/* Right Sidebar - Single Ad Banner */}
        <aside 
          className="w-72 border-l overflow-hidden flex flex-col"
          style={{
            background: 'linear-gradient(180deg, rgba(20,20,30,0.6) 0%, rgba(15,15,25,0.8) 100%)',
            borderColor: 'rgba(255,255,255,0.06)'
          }}
        >
          {/* Ad Banner Header */}
          <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <span className="text-white/40 text-xs uppercase tracking-wider">Sponsor</span>
          </div>

          {/* Single Ad Banner - Canva Style */}
          <div className="flex-1 p-4 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 rounded-2xl overflow-hidden relative group cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)'
              }}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-pink-500/20 blur-xl" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col p-5">
                {/* Logo */}
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-2xl">🎨</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-xl mb-2">
                  Canva Pro
                </h3>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">
                  Profesyonel tasarımlar oluşturun. 30 gün ücretsiz deneyin!
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-white/70 text-xs">
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-white text-[10px]">✓</span>
                    </div>
                    <span>100M+ şablon</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs">
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-white text-[10px]">✓</span>
                    </div>
                    <span>Sınırsız stok fotoğraf</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs">
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-white text-[10px]">✓</span>
                    </div>
                    <span>AI ile tasarım</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  <Button 
                    className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold"
                  >
                    Ücretsiz Başla
                  </Button>
                  <p className="text-center text-white/50 text-[10px] mt-2">
                    Kredi kartı gerektirmez
                  </p>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            {/* Ad Info */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-white/30 text-[10px]">Reklam</span>
              <button className="text-white/30 text-[10px] hover:text-white/50">
                Neden bu reklam?
              </button>
            </div>
          </div>
        </aside>
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

// Horizontal Content Row Component
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="mb-6 relative group">
      {/* Header */}
      <div className="flex items-center justify-between px-6 mb-3">
        <h2 className="text-white font-bold text-lg tracking-tight">{title}</h2>
        <button className="text-white/50 hover:text-amber-400 text-sm font-medium flex items-center gap-1 transition-colors">
          Tümünü gör
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Scroll Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 mt-4 z-10 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-[300px] top-1/2 mt-4 z-10 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Scrollable Row */}
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-6 pb-2"
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
            <div className="relative h-56 rounded-xl overflow-hidden mb-2">
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
              <h3 className="text-white font-semibold text-sm truncate mb-0.5">{ad.name}</h3>
              <p className="text-white/50 text-xs truncate">{ad.distance} • {ad.priceRange}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
