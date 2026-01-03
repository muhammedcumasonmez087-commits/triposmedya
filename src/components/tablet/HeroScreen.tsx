import { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Wifi, Gamepad2, Globe, X, Tag, Clock, Phone, QrCode, ChevronLeft, Info, Sparkles, Star, ArrowRight, Play, Crown, Medal, Award, TrendingUp, Zap, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import heroImage from '@/assets/hero-cyprus.jpg';
import { JourneyTracker } from './JourneyTracker';
import { contextualAds, tierConfig, SponsorBadge, ContextualAd } from './ContextualAdEngine';

interface HeroScreenProps {
  onStart: (interests?: string[]) => void;
  onWifiRequest: () => void;
  onGames: () => void;
  onExplore: () => void;
}

// Platinum sponsor reklamları al
const platinumAds = contextualAds.filter(ad => ad.tier === 'platinum');
const goldAds = contextualAds.filter(ad => ad.tier === 'gold').slice(0, 4);

// Reklam Detay Modalı - Premium Tasarım
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
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      
      <motion.div
        className={`relative w-full max-w-2xl overflow-hidden rounded-[2rem] shadow-2xl ${config.glowColor}`}
        initial={{ scale: 0.9, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        {/* Header with Image */}
        <div className="relative h-56">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${ad.image})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${config.bgGradient}`} />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/20"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="absolute top-4 left-4">
            <SponsorBadge tier={ad.tier} size="lg" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end gap-4">
              <motion.div 
                className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-4xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {ad.logo}
              </motion.div>
              <div className="flex-1">
                <Badge className="bg-white/20 text-white border-none mb-2">
                  {ad.category}
                </Badge>
                <h2 className="text-3xl font-black text-white">{ad.name}</h2>
                <p className="text-white/70">{ad.slogan}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white p-6">
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">{ad.fullDesc}</p>
          
          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ad.accentColor}20` }}>
                <MapPin className="w-5 h-5" style={{ color: ad.accentColor }} />
              </div>
              <span className="text-gray-700 text-sm">{ad.location}</span>
            </div>
            {ad.phone && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ad.accentColor}20` }}>
                  <Phone className="w-5 h-5" style={{ color: ad.accentColor }} />
                </div>
                <span className="text-gray-700 text-sm">{ad.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 col-span-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ad.accentColor}20` }}>
                <Clock className="w-5 h-5" style={{ color: ad.accentColor }} />
              </div>
              <span className="text-gray-700 text-sm">{ad.validUntil}'e kadar</span>
            </div>
          </div>
          
          {/* Offer & QR */}
          <div className={`bg-gradient-to-r ${config.gradient} rounded-2xl p-6`}>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <p className="text-white/70 text-sm mb-1">ÖZEL TEKLİF</p>
                <p className="text-white font-black text-3xl mb-3">{ad.offer}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                  <Tag className="w-4 h-4 text-white" />
                  <span className="text-white font-mono font-bold">{ad.couponCode}</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-lg">
                <QRCode value={`https://tripos.app/coupon/${ad.couponCode}`} size={100} />
              </div>
            </div>
            <p className="text-white/60 text-xs mt-4 text-center">
              Bu kodu işletmede gösterin • tripos.app/c/{ad.couponCode.toLowerCase()}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const HeroScreen = ({ onStart, onWifiRequest, onGames, onExplore }: HeroScreenProps) => {
  const [showJourney, setShowJourney] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showAdDetail, setShowAdDetail] = useState<ContextualAd | null>(null);
  const [adProgress, setAdProgress] = useState(0);

  // 10 saniyede bir reklam değiştir
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          setCurrentAdIndex(i => (i + 1) % platinumAds.length);
          return 0;
        }
        return prev + 1;
      });
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, []);

  const handlePrevAd = () => {
    setCurrentAdIndex(prev => (prev - 1 + platinumAds.length) % platinumAds.length);
    setAdProgress(0);
  };

  const handleNextAd = () => {
    setCurrentAdIndex(prev => (prev + 1) % platinumAds.length);
    setAdProgress(0);
  };

  const currentAd = platinumAds[currentAdIndex];
  const config = tierConfig[currentAd.tier];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentAd.image})` }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
        <div className={`absolute inset-0 bg-gradient-to-r ${config.bgGradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Premium Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
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
              <h1 className="font-black text-white text-2xl tracking-tight">TripOS</h1>
              <p className="text-white/60 text-sm">Kuzey Kıbrıs Keşif Rehberi</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-3"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Sürücü Bilgisi Butonu */}
            <button 
              onClick={() => setShowJourney(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-green-500/20 backdrop-blur-xl border border-green-500/30 text-white hover:bg-green-500/30 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium">Yolculuk Bilgisi</span>
            </button>

            <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10">
              <span className="text-white font-medium">14:30</span>
              <span className="text-white/50">|</span>
              <span className="text-white">28°C</span>
              <span className="text-lg">☀️</span>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20 transition-all">
              <Globe className="w-4 h-4" />
              <span className="font-medium">TR</span>
            </button>
          </motion.div>
        </header>
        
        {/* Main Content - Premium Split Layout */}
        <div className="flex-1 flex px-8 gap-8 pb-6">
          {/* Left Column - Welcome & CTA (25%) */}
          <motion.div 
            className="w-[25%] flex flex-col justify-center"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-white/90 text-sm font-medium">HOŞ GELDİNİZ</span>
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-5xl font-black text-white mb-4 leading-[1.1]"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Akdeniz'in
              <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}`}>
                İncisini Keşfet
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-white/60 text-lg mb-8 leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Tarihi dokusu, eşsiz plajları ve lezzet duraklarıyla Kuzey Kıbrıs sizi bekliyor.
            </motion.p>
            
            {/* Primary CTA - Keşfetmeye Başla */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button 
                onClick={onExplore}
                className={`bg-gradient-to-r ${config.gradient} text-white text-lg px-8 py-7 rounded-2xl shadow-2xl group w-full mb-4 border-none hover:opacity-90 transition-opacity`}
              >
                <span className="flex items-center justify-center gap-3">
                  <Zap className="w-5 h-5" />
                  Keşfetmeye Başla
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>

            {/* Sponsor Tier Stats */}
            <motion.div 
              className="flex items-center gap-2 mb-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.85 }}
            >
              <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
                <Crown className="w-4 h-4 text-purple-400" />
                <span className="text-white text-sm">{platinumAds.length} Platinum</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
                <Medal className="w-4 h-4 text-amber-400" />
                <span className="text-white text-sm">{goldAds.length} Gold</span>
              </div>
            </motion.div>
            
            {/* Secondary CTAs */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <button 
                onClick={onWifiRequest}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white font-medium hover:bg-white/20 transition-all"
              >
                <Wifi className="w-5 h-5" />
                <span>Free WiFi</span>
              </button>
              
              <button 
                onClick={onGames}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white font-medium hover:bg-white/20 transition-all"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Oyunlar</span>
              </button>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Premium Ad Showcase (75%) */}
          <motion.div 
            className="w-[75%] flex flex-col"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            {/* Main Featured Platinum Ad */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAd.id}
                  className="absolute inset-0 rounded-[2rem] overflow-hidden cursor-pointer group border-2 border-purple-500/30"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -20 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  onClick={() => setShowAdDetail(currentAd)}
                >
                  {/* Background */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${currentAd.image})` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${config.bgGradient} opacity-80`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    {/* Top */}
                    <div className="flex items-start justify-between">
                      <motion.div 
                        className="flex items-center gap-3"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <SponsorBadge tier={currentAd.tier} size="lg" />
                        <Badge className="bg-black/30 backdrop-blur-xl text-white border-none px-4 py-2">
                          {currentAd.category}
                        </Badge>
                      </motion.div>
                      
                      {/* Progress indicator */}
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-sm">{currentAdIndex + 1}/{platinumAds.length}</span>
                        <div className="w-20 h-1 rounded-full bg-white/20 overflow-hidden">
                          <motion.div 
                            className="h-full bg-white rounded-full"
                            style={{ width: `${adProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom */}
                    <div className="flex items-end gap-8">
                      <div className="flex-1">
                        <motion.div 
                          className="flex items-center gap-4 mb-4"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                            <span className="text-5xl">{currentAd.logo}</span>
                          </div>
                          <div>
                            <h3 className="text-4xl font-black text-white mb-1">{currentAd.name}</h3>
                            <p className="text-white/70 text-lg">{currentAd.slogan}</p>
                          </div>
                        </motion.div>
                        
                        <motion.p 
                          className="text-white/80 text-xl mb-6 max-w-xl"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {currentAd.description}
                        </motion.p>
                        
                        <motion.div 
                          className="flex items-center gap-4"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${config.gradient} text-white font-bold text-lg`}>
                            <Gift className="w-5 h-5" />
                            {currentAd.offer}
                          </div>
                          
                          <button 
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAdDetail(currentAd);
                            }}
                          >
                            <Info className="w-5 h-5" />
                            Detayları Gör
                          </button>
                          
                          <button 
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAdDetail(currentAd);
                            }}
                          >
                            <QrCode className="w-5 h-5" />
                            Kuponu Al
                          </button>
                        </motion.div>
                      </div>
                      
                      {/* Mini QR */}
                      <motion.div 
                        className="bg-white p-4 rounded-2xl shadow-2xl"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7, type: 'spring' }}
                      >
                        <QRCode value={`https://tripos.app/coupon/${currentAd.couponCode}`} size={100} />
                        <p className="text-center text-gray-600 text-sm font-mono mt-2">{currentAd.couponCode}</p>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Navigation Arrows */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePrevAd(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center hover:bg-black/50 transition-all border border-white/10"
                  >
                    <ChevronLeft className="w-7 h-7 text-white" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleNextAd(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center hover:bg-black/50 transition-all border border-white/10"
                  >
                    <ChevronRight className="w-7 h-7 text-white" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Gold Sponsor Thumbnails */}
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {/* Platinum Thumbnails */}
              {platinumAds.map((ad, index) => (
                <motion.div
                  key={ad.id}
                  className={`relative flex-shrink-0 w-44 h-28 rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                    index === currentAdIndex 
                      ? 'border-purple-400 shadow-lg shadow-purple-500/30 scale-105' 
                      : 'border-purple-400/30 opacity-60 hover:opacity-90'
                  }`}
                  onClick={() => { setCurrentAdIndex(index); setAdProgress(0); }}
                  whileHover={{ scale: index === currentAdIndex ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${ad.image})` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${tierConfig[ad.tier].bgGradient} opacity-70`} />
                  <div className="absolute inset-0 p-2 flex flex-col justify-between">
                    <div className="flex items-center gap-1">
                      <Crown className="w-3 h-3 text-purple-300" />
                      <span className="text-white text-xs font-medium">Platinum</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{ad.logo}</span>
                      <span className="text-white text-sm font-bold truncate">{ad.name}</span>
                    </div>
                  </div>
                  {index === currentAdIndex && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center"
                    >
                      <Play className="w-3 h-3 text-white fill-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
              
              {/* Gold Thumbnails */}
              {goldAds.map((ad) => (
                <motion.div
                  key={ad.id}
                  className="relative flex-shrink-0 w-36 h-28 rounded-xl overflow-hidden cursor-pointer transition-all border border-amber-400/30 opacity-70 hover:opacity-100"
                  onClick={() => setShowAdDetail(ad)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${ad.image})` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${tierConfig[ad.tier].bgGradient} opacity-70`} />
                  <div className="absolute inset-0 p-2 flex flex-col justify-between">
                    <div className="flex items-center gap-1">
                      <Medal className="w-3 h-3 text-amber-300" />
                      <span className="text-white text-xs font-medium">Gold</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{ad.logo}</span>
                      <span className="text-white text-xs font-bold truncate">{ad.name}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Journey Tracker */}
        <JourneyTracker isVisible={showJourney} onClose={() => setShowJourney(false)} />
        
        {/* Bottom Bar */}
        <motion.div 
          className="flex items-center justify-center px-8 py-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-6 px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-2 text-white/70">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm">Bağlamsal reklamcılık aktif</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <span className="text-sm">🎧 Sesli Rehber</span>
            </button>
          </div>
        </motion.div>
      </div>
      
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
