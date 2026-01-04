import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Compass, Bookmark, Download, Settings, HelpCircle,
  ChevronRight, Star, MapPin, Clock, Gift, Play, Search, Bell,
  Heart, ChevronLeft, Sparkles, Trophy
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

// Sidebar navigation items
const sidebarItems = [
  { icon: Home, label: 'Ana Sayfa', active: true },
  { icon: Compass, label: 'Keşfet', active: false },
  { icon: Bookmark, label: 'Kaydedilenler', active: false },
  { icon: Download, label: 'İndirimler', active: false },
  { icon: Settings, label: 'Ayarlar', active: false },
  { icon: HelpCircle, label: 'Yardım', active: false },
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Filter ads by selected categories
  const filteredAds = selectedCategories.length > 0 
    ? journeyAds.filter(ad => selectedCategories.includes(ad.categoryId))
    : journeyAds;

  // Get featured ad for hero
  const featuredAd = filteredAds.find(ad => ad.tier === 'platinum') || filteredAds[0];

  // Group ads by category for rows
  const getCategoryAds = (categoryId: CategoryId) => 
    filteredAds.filter(ad => ad.categoryId === categoryId);

  // Get popular ads (platinum + gold tier)
  const popularAds = filteredAds.filter(ad => ad.tier === 'platinum' || ad.tier === 'gold');

  // Get "coming this week" / special offers
  const specialOffers = filteredAds.filter(ad => ad.tier === 'platinum').slice(0, 3);

  // Get recently added (bronze tier)
  const recentlyAdded = filteredAds.filter(ad => ad.tier === 'bronze');

  const toggleSave = (adId: string) => {
    setSavedAds(prev => 
      prev.includes(adId) ? prev.filter(id => id !== adId) : [...prev, adId]
    );
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0d0d1a 100%)'
    }}>
      {/* Left Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`relative z-20 flex flex-col py-6 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(20,20,30,0.95) 0%, rgba(15,15,25,0.98) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        {/* Logo / Home */}
        <div className="px-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="flex items-center gap-3 text-white"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-lg tracking-tight">Keşfet</span>
            )}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {sidebarItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5 }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                item.active 
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-amber-400' : ''}`} />
              {!sidebarCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Points Display */}
        <div className="px-4 mt-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.08) 100%)',
              border: '1px solid rgba(251,191,36,0.2)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <p className="text-white/60 text-xs">Puanlarınız</p>
                  <p className="text-amber-400 font-bold text-xl">{earnedPoints}</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <Button
                onClick={onPlayRewardGame}
                className="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-sm py-2"
              >
                <Gift className="w-4 h-4 mr-2" />
                Çark Çevir
              </Button>
            )}
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Top Navigation */}
          <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4" style={{
            background: 'linear-gradient(180deg, rgba(15,15,26,0.95) 0%, transparent 100%)'
          }}>
            {/* Category Tabs */}
            <div className="flex items-center gap-6">
              <button className="text-white font-semibold text-sm hover:text-amber-400 transition-colors">
                Tümü
              </button>
              {selectedCategories.slice(0, 4).map(catId => {
                const cat = journeyCategories.find(c => c.id === catId);
                return (
                  <button
                    key={catId}
                    className="text-white/60 font-medium text-sm hover:text-white transition-colors"
                  >
                    {cat?.nameTR}
                  </button>
                );
              })}
            </div>

            {/* Search & Notifications */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Ara..."
                  className="w-56 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <button className="relative p-2 rounded-xl hover:bg-white/10 transition-colors">
                <Bell className="w-5 h-5 text-white/60" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
              </button>
            </div>
          </header>

          {/* Hero Section - Featured Ad */}
          <section className="px-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-[380px] rounded-3xl overflow-hidden cursor-pointer group"
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
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="max-w-xl">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
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
                    className="text-4xl font-black text-white mb-2 tracking-tight"
                  >
                    {featuredAd.name}
                  </motion.h1>

                  {/* Meta */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-4 text-white/60 text-sm mb-4"
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

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-2"
                  >
                    {featuredAd.fullDescription}
                  </motion.p>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-3"
                  >
                    <Button 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-6 gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      İncele
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/20 bg-white/10 hover:bg-white/20 text-white gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(featuredAd.id);
                      }}
                    >
                      <Bookmark className={`w-4 h-4 ${savedAds.includes(featuredAd.id) ? 'fill-white' : ''}`} />
                      Listeye Ekle
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Offer Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute top-6 right-6 px-4 py-2 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.9) 0%, rgba(220,38,38,0.9) 100%)',
                  boxShadow: '0 10px 30px -5px rgba(239,68,68,0.4)'
                }}
              >
                <p className="text-white font-bold text-sm">{featuredAd.offer}</p>
                <p className="text-white/80 text-xs">{featuredAd.offerValue}</p>
              </motion.div>
            </motion.div>
          </section>

          {/* Popular Row */}
          <ContentRow 
            title="Popüler" 
            ads={popularAds} 
            onAdClick={setSelectedAd}
            onSave={toggleSave}
            savedAds={savedAds}
          />

          {/* Category Rows */}
          {selectedCategories.length > 0 ? (
            selectedCategories.map(catId => {
              const cat = journeyCategories.find(c => c.id === catId);
              const categoryAds = getCategoryAds(catId);
              if (categoryAds.length === 0) return null;
              
              return (
                <ContentRow 
                  key={catId}
                  title={cat?.nameTR || ''} 
                  ads={categoryAds} 
                  onAdClick={setSelectedAd}
                  onSave={toggleSave}
                  savedAds={savedAds}
                />
              );
            })
          ) : (
            journeyCategories.map(cat => {
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
            })
          )}

          {/* Bottom padding */}
          <div className="h-8" />
        </main>

        {/* Right Sidebar */}
        <aside 
          className="w-80 border-l overflow-y-auto py-6 px-5"
          style={{
            background: 'linear-gradient(180deg, rgba(20,20,30,0.6) 0%, rgba(15,15,25,0.8) 100%)',
            borderColor: 'rgba(255,255,255,0.06)'
          }}
        >
          {/* Coming This Week */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Bu Hafta</h3>
              <button className="text-amber-400 text-sm hover:underline">Tümü</button>
            </div>

            {specialOffers.slice(0, 1).map((ad, index) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer mb-4"
                onClick={() => setSelectedAd(ad)}
              >
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${ad.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white font-bold mb-1">{ad.name}</h4>
                  <p className="text-white/60 text-xs">{ad.tagline}</p>
                </div>
              </motion.div>
            ))}

            {specialOffers.slice(1, 2).map((ad) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
                onClick={() => setSelectedAd(ad)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${ad.image})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm truncate">{ad.name}</h4>
                    <p className="text-white/50 text-xs truncate">{ad.tagline}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full mt-3 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Hatırlat
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Recently Added */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Yeni Eklenenler</h3>
            </div>

            <div className="space-y-3">
              {recentlyAdded.slice(0, 3).map((ad, index) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: -5 }}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-white/5"
                  onClick={() => setSelectedAd(ad)}
                >
                  <div 
                    className="w-20 h-28 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${ad.image})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm mb-1 truncate">{ad.name}</h4>
                    <p className="text-white/50 text-xs mb-2 line-clamp-2">{ad.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                        {ad.offer}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
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
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="mb-8 relative group">
      {/* Header */}
      <div className="flex items-center justify-between px-8 mb-4">
        <h2 className="text-white font-bold text-xl tracking-tight">{title}</h2>
        <button className="text-white/50 hover:text-amber-400 text-sm font-medium flex items-center gap-1 transition-colors">
          Tümünü gör
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Scroll Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 mt-4 z-10 w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-[340px] top-1/2 mt-4 z-10 w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Scrollable Row */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-8 pb-2"
        onScroll={checkScrollButtons}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
        {ads.map((ad, index) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -8 }}
            className="flex-shrink-0 w-44 cursor-pointer group/card"
            onClick={() => onAdClick(ad)}
          >
            {/* Card Image */}
            <div className="relative h-64 rounded-xl overflow-hidden mb-2">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/card:scale-110"
                style={{ backgroundImage: `url(${ad.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
              
              {/* Hover Actions */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                  <button 
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdClick(ad);
                    }}
                  >
                    <Play className="w-4 h-4 text-gray-900 fill-gray-900 ml-0.5" />
                  </button>
                  <button 
                    className="w-8 h-8 rounded-full bg-black/60 border border-white/30 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSave(ad.id);
                    }}
                  >
                    <Heart className={`w-4 h-4 ${savedAds.includes(ad.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                  </button>
                </div>
              </div>

              {/* Rating Badge */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-white text-xs font-semibold">{ad.rating}</span>
              </div>

              {/* Premium indicator for top 3 */}
              {index < 3 && (
                <div 
                  className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
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
            <div className="px-1">
              <h3 className="text-white font-semibold text-sm truncate mb-0.5">{ad.name}</h3>
              <p className="text-white/50 text-xs truncate">{ad.distance} • {ad.priceRange}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
