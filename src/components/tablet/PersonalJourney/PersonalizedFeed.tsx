import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, ArrowLeft, Sparkles, Gift, Trophy, ChevronRight, 
  Star, Crown, Filter, Grid, List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JourneyAd, CategoryId } from './types';
import { journeyCategories, getPersonalizedAds, getCategoryById } from './journeyData';
import { renderAdCard } from './AdCards';
import { AdDetailModal } from './AdDetailModal';

interface PersonalizedFeedProps {
  selectedCategories: CategoryId[];
  onHome: () => void;
  onBack: () => void;
  onPlayRewardGame: () => void;
  earnedPoints: number;
}

export const PersonalizedFeed = ({ 
  selectedCategories, 
  onHome, 
  onBack, 
  onPlayRewardGame,
  earnedPoints 
}: PersonalizedFeedProps) => {
  const [selectedAd, setSelectedAd] = useState<JourneyAd | null>(null);
  const [activeFilter, setActiveFilter] = useState<CategoryId | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [claimedOffers, setClaimedOffers] = useState<string[]>([]);
  const [points, setPoints] = useState(earnedPoints);

  // Get personalized ads based on selected categories
  const allAds = getPersonalizedAds(selectedCategories);
  
  // Filter ads based on active filter
  const filteredAds = activeFilter === 'all' 
    ? allAds 
    : allAds.filter(ad => ad.categoryId === activeFilter);

  // Group ads by tier
  const platinumAds = filteredAds.filter(ad => ad.tier === 'platinum');
  const goldAds = filteredAds.filter(ad => ad.tier === 'gold');
  const bronzeAds = filteredAds.filter(ad => ad.tier === 'bronze');

  const handleSelectAd = (ad: JourneyAd) => {
    setSelectedAd(ad);
    // Award points for viewing ad
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

  const handleCloseModal = () => {
    setSelectedAd(null);
  };

  // Get category chips for filter
  const selectedCategoryData = selectedCategories.map(id => getCategoryById(id)).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 overflow-hidden">
      {/* Header */}
      <header className="relative flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onHome}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <Home className="w-5 h-5 text-white" />
          </motion.button>
          
          <div className="ml-2">
            <h1 className="text-xl font-bold text-white">Size Özel Teklifler</h1>
            <p className="text-white/50 text-sm">{filteredAds.length} teklif bulundu</p>
          </div>
        </div>

        {/* Points & Reward */}
        <div className="flex items-center gap-4">
          <motion.div 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="w-4 h-4 text-white fill-white" />
            <span className="text-white font-bold">{points} Puan</span>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayRewardGame}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
          >
            <Gift className="w-5 h-5" />
            Çark Çevir
          </motion.button>
        </div>
      </header>

      {/* Category Filters */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-gray-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Filter className="w-4 h-4" />
            Tümü
          </motion.button>
          
          {selectedCategoryData.map(cat => cat && (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                activeFilter === cat.id
                  ? `bg-gradient-to-r ${cat.gradient} text-white`
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              {cat.nameTR}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Platinum Section */}
        {platinumAds.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-600">
                <Crown className="w-4 h-4 text-white" />
                <span className="text-white font-bold">Platinum Sponsorlar</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platinumAds.map((ad, i) => renderAdCard(ad, handleSelectAd, i))}
            </div>
          </section>
        )}

        {/* Gold Section */}
        {goldAds.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500">
                <Star className="w-4 h-4 text-white fill-white" />
                <span className="text-white font-bold">Gold Teklifler</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-amber-500/50 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {goldAds.map((ad, i) => renderAdCard(ad, handleSelectAd, i))}
            </div>
          </section>
        )}

        {/* Bronze Section */}
        {bronzeAds.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-600">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white font-bold">Diğer Teklifler</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500/50 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bronzeAds.map((ad, i) => renderAdCard(ad, handleSelectAd, i))}
            </div>
          </section>
        )}

        {/* Reward CTA at bottom */}
        <motion.div 
          className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white">Ödülünüzü Kazanın!</h3>
                <p className="text-white/70">{points} puanınız var. Çarkı çevirerek ekstra ödüller kazanın.</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlayRewardGame}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg"
            >
              Çark Çevir
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Ad Detail Modal */}
      <AnimatePresence>
        {selectedAd && (
          <AdDetailModal 
            ad={selectedAd} 
            onClose={handleCloseModal}
            onClaim={handleClaimOffer}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
