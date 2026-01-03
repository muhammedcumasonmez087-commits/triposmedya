import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Wifi, Gamepad2, Globe, X, Tag, Clock, Phone, MapPin, Sparkles, Star, ArrowRight, Crown, Medal, Award, Gift, Eye, Users, Percent, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { JourneyTracker } from './JourneyTracker';
import { contextualAds, tierConfig, SponsorBadge, ContextualAd } from './ContextualAdEngine';

interface HeroScreenProps {
  onStart: (interests?: string[]) => void;
  onWifiRequest: () => void;
  onGames: () => void;
  onExplore: () => void;
}

// Tüm reklamları karıştır
const allAds = [...contextualAds].sort((a, b) => {
  const tierOrder = { platinum: 0, gold: 1, bronze: 2 };
  return tierOrder[a.tier] - tierOrder[b.tier];
});

// Reklam Detay Modalı
const AdDetailModal = ({ 
  ad, 
  onClose 
}: { 
  ad: ContextualAd; 
  onClose: () => void;
}) => {
  const config = tierConfig[ad.tier];
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl" 
        onClick={onClose}
      />
      
      <motion.div
        className="relative w-full max-w-4xl h-[85vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        {/* Left - Image */}
        <div className="relative w-1/2 h-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${ad.image})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${config.bgGradient} opacity-60`} />
          
          <div className="absolute inset-0 p-8 flex flex-col justify-between">
            <SponsorBadge tier={ad.tier} size="lg" />
            
            <div>
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-4">
                <span className="text-6xl">{ad.logo}</span>
              </div>
              <h2 className="text-4xl font-black text-white mb-2">{ad.name}</h2>
              <p className="text-white/70 text-xl">{ad.slogan}</p>
            </div>
          </div>
        </div>
        
        {/* Right - Content */}
        <div className="w-1/2 bg-white p-8 flex flex-col">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          
          <Badge className="self-start mb-4 bg-gray-100 text-gray-700 border-none">
            {ad.category}
          </Badge>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-6 flex-1">
            {ad.fullDesc}
          </p>
          
          {/* Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{ad.location}</span>
            </div>
            {ad.phone && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{ad.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{ad.validUntil}'e kadar geçerli</span>
            </div>
          </div>
          
          {/* Offer Box */}
          <div className={`bg-gradient-to-r ${config.gradient} rounded-2xl p-6`}>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-white/70 text-sm mb-1">ÖZEL TEKLİF</p>
                <p className="text-white font-black text-2xl mb-2">{ad.offer}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20">
                  <Tag className="w-4 h-4 text-white" />
                  <span className="text-white font-mono font-bold text-sm">{ad.couponCode}</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl">
                <QRCode value={`https://tripos.app/coupon/${ad.couponCode}`} size={80} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Reklam Kartı - Tam Ekran
const FullScreenAdCard = ({ 
  ad, 
  isActive,
  onClick 
}: { 
  ad: ContextualAd; 
  isActive: boolean;
  onClick: () => void;
}) => {
  const config = tierConfig[ad.tier];
  
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
    >
      {/* Full Screen Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ad.image})` }}
      />
      
      {/* Gradient Overlays */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.bgGradient} opacity-70`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex">
        {/* Left Content - 45% */}
        <div className="w-[45%] h-full flex flex-col justify-center px-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: isActive ? 0 : -50, opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <SponsorBadge tier={ad.tier} size="lg" />
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-5 mt-6 mb-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: isActive ? 0 : -50, opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
              <span className="text-6xl">{ad.logo}</span>
            </div>
            <div>
              <h2 className="text-5xl font-black text-white leading-tight">{ad.name}</h2>
              <p className="text-white/60 text-xl mt-1">{ad.slogan}</p>
            </div>
          </motion.div>
          
          <motion.p 
            className="text-white/80 text-xl leading-relaxed mb-8 max-w-lg"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: isActive ? 0 : -50, opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {ad.description}
          </motion.p>
          
          {/* Metrics */}
          <motion.div 
            className="flex items-center gap-4 mb-8"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: isActive ? 0 : -50, opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white font-bold">{ad.metrics?.rating}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur">
              <Eye className="w-4 h-4 text-white/60" />
              <span className="text-white/80">{ad.metrics?.views.toLocaleString()} görüntülenme</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur">
              <Users className="w-4 h-4 text-white/60" />
              <span className="text-white/80">{ad.metrics?.claims.toLocaleString()} kullanım</span>
            </div>
          </motion.div>
          
          {/* CTA */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: isActive ? 0 : 30, opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <button 
              onClick={onClick}
              className={`group flex items-center gap-4 px-8 py-5 rounded-2xl bg-gradient-to-r ${config.gradient} text-white font-bold text-xl shadow-2xl hover:scale-105 transition-transform`}
            >
              <Gift className="w-6 h-6" />
              <span>{ad.offer}</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
        
        {/* Right - QR & Category */}
        <div className="w-[55%] h-full flex items-end justify-end p-12">
          <motion.div 
            className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isActive ? 1 : 0.8, opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="text-center mb-4">
              <Badge className="bg-white/20 text-white border-none mb-2">
                {ad.category}
              </Badge>
              <p className="text-white/60 text-sm">Kuponu tara</p>
            </div>
            <div className="bg-white p-4 rounded-2xl">
              <QRCode value={`https://tripos.app/coupon/${ad.couponCode}`} size={140} />
            </div>
            <p className="text-center text-white/50 font-mono text-sm mt-3">{ad.couponCode}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export const HeroScreen = ({ onStart, onWifiRequest, onGames, onExplore }: HeroScreenProps) => {
  const [showJourney, setShowJourney] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showAdDetail, setShowAdDetail] = useState<ContextualAd | null>(null);
  const [adProgress, setAdProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // 8 saniyede bir reklam değiştir
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          setCurrentAdIndex(i => (i + 1) % allAds.length);
          return 0;
        }
        return prev + 1.25; // 8 saniye = 100 / (8000ms / 100ms)
      });
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, []);

  const handlePrevAd = () => {
    setCurrentAdIndex(prev => (prev - 1 + allAds.length) % allAds.length);
    setAdProgress(0);
  };

  const handleNextAd = () => {
    setCurrentAdIndex(prev => (prev + 1) % allAds.length);
    setAdProgress(0);
  };

  const currentAd = allAds[currentAdIndex];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Full Screen Ad Carousel */}
      {allAds.map((ad, index) => (
        <FullScreenAdCard
          key={ad.id}
          ad={ad}
          isActive={index === currentAdIndex}
          onClick={() => setShowAdDetail(ad)}
        />
      ))}
      
      {/* Navigation Arrows */}
      <button 
        onClick={handlePrevAd}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center hover:bg-black/50 transition-all border border-white/10"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>
      <button 
        onClick={handleNextAd}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center hover:bg-black/50 transition-all border border-white/10"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
              <span className="text-white font-black text-2xl">T</span>
            </div>
            <motion.div 
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-black"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="font-black text-white text-2xl">TripOS</h1>
            <p className="text-white/50 text-sm">KKTC'ye Hoş Geldiniz</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <button 
            onClick={() => setShowJourney(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-green-500/20 backdrop-blur-xl border border-green-500/30 text-white hover:bg-green-500/30 transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium">Yolculuk</span>
          </button>
          
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10">
            <span className="text-white font-medium">14:30</span>
            <span className="text-white/30">|</span>
            <span className="text-white">28°C</span>
            <span className="text-lg">☀️</span>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20 transition-all">
            <Globe className="w-4 h-4" />
            <span className="font-medium">TR</span>
          </button>
          
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </motion.div>
      </header>
      
      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-8 pb-6">
        {/* Ad Thumbnails */}
        <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {allAds.map((ad, index) => {
            const adConfig = tierConfig[ad.tier];
            const TierIcon = ad.tier === 'platinum' ? Crown : ad.tier === 'gold' ? Medal : Award;
            const isActive = index === currentAdIndex;
            
            return (
              <motion.div
                key={ad.id}
                className={`relative flex-shrink-0 w-32 h-20 rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                  isActive 
                    ? `${adConfig.borderColor} shadow-lg scale-105` 
                    : 'border-white/10 opacity-50 hover:opacity-80'
                }`}
                onClick={() => { setCurrentAdIndex(index); setAdProgress(0); }}
                whileHover={{ scale: isActive ? 1.05 : 1.02 }}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${ad.image})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${adConfig.bgGradient} opacity-80`} />
                <div className="absolute inset-0 p-2 flex flex-col justify-between">
                  <TierIcon className="w-4 h-4 text-white/80" />
                  <span className="text-white text-xs font-bold truncate">{ad.name}</span>
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <motion.div 
                      className="h-full bg-white"
                      style={{ width: `${adProgress}%` }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* Bottom Actions */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Left - Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Crown className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm font-medium">{allAds.filter(a => a.tier === 'platinum').length} Öne Çıkan</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30">
              <Medal className="w-4 h-4 text-amber-400" />
              <span className="text-white text-sm font-medium">{allAds.filter(a => a.tier === 'gold').length} Özel Teklif</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/20 border border-orange-500/30">
              <Award className="w-4 h-4 text-orange-400" />
              <span className="text-white text-sm font-medium">{allAds.filter(a => a.tier === 'bronze').length} Yakınında</span>
            </div>
          </div>
          
          {/* Center - Ad Counter */}
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10">
            <Percent className="w-5 h-5 text-white/60" />
            <span className="text-white font-medium">{currentAdIndex + 1} / {allAds.length}</span>
            <span className="text-white/40">•</span>
            <span className="text-white/60 text-sm">{allAds.length} özel fırsat</span>
          </div>
          
          {/* Right - Quick Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onWifiRequest}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white font-medium hover:bg-white/20 transition-all"
            >
              <Wifi className="w-5 h-5" />
              <span>Free WiFi</span>
            </button>
            
            <button 
              onClick={onGames}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white font-medium hover:bg-white/20 transition-all"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Oyunlar</span>
            </button>
            
            <Button 
              onClick={onExplore}
              className="flex items-center gap-2 px-6 py-6 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-lg border-none hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-5 h-5" />
              <span>Keşfet</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Journey Tracker */}
      <JourneyTracker isVisible={showJourney} onClose={() => setShowJourney(false)} />
      
      {/* Ad Detail Modal */}
      <AnimatePresence>
        {showAdDetail && (
          <AdDetailModal 
            ad={showAdDetail} 
            onClose={() => setShowAdDetail(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
