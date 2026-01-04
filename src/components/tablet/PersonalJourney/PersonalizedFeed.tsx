import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, ArrowLeft, Gift, Star, MapPin, Clock, 
  ChevronRight, Play, Search, Bell, Volume2, Globe
} from 'lucide-react';
import { JourneyAd, CategoryId } from './types';
import { journeyCategories, getPersonalizedAds, getCategoryById } from './journeyData';
import { AdDetailModal } from './AdDetailModal';

interface PersonalizedFeedProps {
  selectedCategories: CategoryId[];
  onHome: () => void;
  onBack: () => void;
  onPlayRewardGame: () => void;
  earnedPoints: number;
}

// Horizontal scroll row component
const HorizontalRow = ({ 
  title, 
  ads, 
  onSelect,
  showRank = false
}: { 
  title: string; 
  ads: JourneyAd[]; 
  onSelect: (ad: JourneyAd) => void;
  showRank?: boolean;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (ads.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <button className="text-white/50 hover:text-white text-sm flex items-center gap-1 transition-colors">
          Tümünü Gör <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div 
        ref={scrollRef}
        className="horizontal-scroll-row px-6"
      >
        {ads.map((ad, index) => {
          const category = getCategoryById(ad.categoryId);
          
          return (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(ad)}
              className="scroll-card relative group"
              style={{ width: '220px', height: '140px' }}
            >
              {/* Card Image */}
              <img 
                src={ad.image} 
                alt={ad.name}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              {/* Rank number (for first 3) */}
              {showRank && index < 3 && (
                <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-black font-black text-lg">{index + 1}</span>
                </div>
              )}
              
              {/* Video indicator */}
              {ad.videoUrl && (
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
              )}
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-base">{category?.icon}</span>
                  <span className="text-white/60 text-xs">{category?.nameTR}</span>
                </div>
                <h4 className="text-white font-bold text-sm line-clamp-1">{ad.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-white text-xs">{ad.rating}</span>
                  </div>
                  <span className="text-white/40 text-xs">•</span>
                  <span className="text-white/60 text-xs">{ad.distance}</span>
                </div>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

// Sidebar nearby item
const NearbyItem = ({ ad, onSelect }: { ad: JourneyAd; onSelect: () => void }) => {
  const category = getCategoryById(ad.categoryId);
  
  return (
    <motion.button
      whileHover={{ x: 4 }}
      onClick={onSelect}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors w-full text-left"
    >
      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
        <img src={ad.image} alt={ad.name} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-br ${category?.gradient} opacity-30`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">{category?.icon}</span>
          <span className="text-white font-semibold text-sm truncate">{ad.name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
          <MapPin className="w-3 h-3" />
          <span>{ad.distance}</span>
          <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-medium">
            Açık
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export const PersonalizedFeed = ({ 
  selectedCategories, 
  onHome, 
  onBack, 
  onPlayRewardGame,
  earnedPoints 
}: PersonalizedFeedProps) => {
  const [selectedAd, setSelectedAd] = useState<JourneyAd | null>(null);
  const [activeTab, setActiveTab] = useState<CategoryId | 'all'>('all');
  const [claimedOffers, setClaimedOffers] = useState<string[]>([]);
  const [points, setPoints] = useState(earnedPoints);

  // Get all ads based on selection
  const allAds = getPersonalizedAds(selectedCategories);
  
  // Filter by active tab
  const filteredAds = activeTab === 'all' 
    ? allAds 
    : allAds.filter(ad => ad.categoryId === activeTab);
  
  // Hero ad (first platinum or first ad)
  const heroAd = filteredAds.find(ad => ad.tier === 'platinum') || filteredAds[0];
  
  // Group remaining ads
  const remainingAds = filteredAds.filter(ad => ad.id !== heroAd?.id);
  const trendingAds = remainingAds.slice(0, 6);
  const nearbyAds = remainingAds.slice(0, 4);
  
  // Get unique categories from ads for tabs
  const availableCategories = selectedCategories.length > 0 
    ? selectedCategories 
    : [...new Set(allAds.map(ad => ad.categoryId))];

  const handleSelectAd = (ad: JourneyAd) => {
    setSelectedAd(ad);
    if (!claimedOffers.includes(ad.id)) {
      setPoints(prev => prev + 10);
    }
  };

  const handleClaimOffer = (ad: JourneyAd) => {
    if (!claimedOffers.includes(ad.id)) {
      setClaimedOffers(prev => [...prev, ad.id]);
      setPoints(prev => prev + 50);
    }
  };

  const heroCategory = heroAd ? getCategoryById(heroAd.categoryId) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f0f23 100%)'
        }}
      />
      
      <div className="relative h-full flex">
        {/* Left Sidebar - Nearby */}
        <aside className="w-64 glass-sidebar flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-white/80 mb-4">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="font-semibold">Yakınlarda</span>
            </div>
          </div>
          
          {/* Nearby List */}
          <div className="flex-1 overflow-y-auto p-2">
            {nearbyAds.map((ad, index) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NearbyItem ad={ad} onSelect={() => handleSelectAd(ad)} />
              </motion.div>
            ))}
          </div>
          
          {/* Reward Button */}
          <div className="p-4 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPlayRewardGame}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg"
            >
              <Gift className="w-5 h-5" />
              Çark Çevir
            </motion.button>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-amber-400 font-bold">{points} Puan</span>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onHome}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Home className="w-5 h-5 text-white" />
              </motion.button>
              
              {/* Search */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 ml-4">
                <Search className="w-4 h-4 text-white/50" />
                <input 
                  type="text"
                  placeholder="Anlık ruh haline göre ara..."
                  className="bg-transparent border-none outline-none text-white placeholder:text-white/40 text-sm w-48"
                />
              </div>
            </div>
            
            {/* Category Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'all'
                    ? 'bg-white text-gray-900'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Keşfet
              </button>
              {availableCategories.slice(0, 5).map(catId => {
                const cat = getCategoryById(catId);
                return cat ? (
                  <button
                    key={catId}
                    onClick={() => setActiveTab(catId)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === catId
                        ? `bg-gradient-to-r ${cat.gradient} text-white`
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {cat.nameTR}
                  </button>
                ) : null;
              })}
            </div>
            
            {/* Right actions */}
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Bell className="w-5 h-5 text-white" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold">
                JD
              </div>
            </div>
          </header>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Hero Banner */}
            {heroAd && (
              <section className="px-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-hero relative h-72 cursor-pointer group"
                  onClick={() => handleSelectAd(heroAd)}
                >
                  {/* Background Image */}
                  <img 
                    src={heroAd.image} 
                    alt={heroAd.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  
                  {/* Weather badge */}
                  <div className="absolute top-4 right-4 glass-card px-3 py-2 flex items-center gap-2">
                    <span className="text-lg">☀️</span>
                    <span className="text-white font-semibold">32°C Güneşli</span>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 rounded bg-amber-500 text-black text-xs font-bold">
                        GÜNÜN ÖNERİSİ
                      </span>
                      <span className="text-white/60 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {heroAd.distance} • {heroAd.location}
                      </span>
                    </div>
                    
                    <h2 className="text-5xl font-black text-white mb-2 tracking-tight">
                      {heroAd.name}
                    </h2>
                    
                    <p className="text-white/70 text-lg mb-6 max-w-xl">
                      {heroAd.description}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 backdrop-blur text-white font-semibold hover:bg-white/30 transition-colors"
                      >
                        <Search className="w-5 h-5" />
                        Detayları İncele
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-bold"
                      >
                        <MapPin className="w-5 h-5" />
                        Rotaya Ekle
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Video play button if has video */}
                  {heroAd.videoUrl && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
                      >
                        <Play className="w-10 h-10 text-white fill-white ml-1" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </section>
            )}
            
            {/* Trending Row */}
            <HorizontalRow 
              title="Şehrin Ritmi" 
              ads={trendingAds} 
              onSelect={handleSelectAd}
              showRank={true}
            />
            
            {/* Category-based rows */}
            {availableCategories.slice(0, 3).map(catId => {
              const cat = getCategoryById(catId);
              const categoryAds = allAds.filter(ad => ad.categoryId === catId).slice(0, 5);
              
              return cat && categoryAds.length > 0 ? (
                <HorizontalRow
                  key={catId}
                  title={`${cat.icon} ${cat.nameTR}`}
                  ads={categoryAds}
                  onSelect={handleSelectAd}
                />
              ) : null;
            })}
            
            {/* Special Offers Section */}
            <section className="px-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                Size Özel Anlık Fırsatlar
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {filteredAds.slice(0, 2).map((ad, index) => {
                  const cat = getCategoryById(ad.categoryId);
                  return (
                    <motion.div
                      key={ad.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSelectAd(ad)}
                      className="glass-card-dark p-4 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl">
                        {cat?.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white">{ad.offer}</span>
                          <span className="px-1.5 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold">YENİ</span>
                        </div>
                        <p className="text-white/60 text-sm">{ad.name} - {ad.offerValue}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-bold"
                      >
                        Kullan
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          </div>
          
          {/* Bottom Navigation */}
          <footer className="glass-card-dark mx-6 mb-4 px-6 py-3 flex items-center justify-between rounded-2xl">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                <Volume2 className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg/1200px-Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg.png" 
                  alt="KKTC"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <div className="text-white font-bold">Girne Merkez</div>
                <div className="text-white/50 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Varış: 12 dk • 5.2 km
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Globe className="w-5 h-5 text-white" />
              </button>
            </div>
          </footer>
        </main>
      </div>
      
      {/* Ad Detail Modal */}
      <AnimatePresence>
        {selectedAd && (
          <AdDetailModal 
            ad={selectedAd} 
            onClose={() => setSelectedAd(null)}
            onClaim={handleClaimOffer}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
