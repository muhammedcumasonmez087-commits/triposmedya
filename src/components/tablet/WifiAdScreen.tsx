import { useState, useEffect, useMemo } from 'react';
import { Wifi, Play, Pause, Volume2, VolumeX, Home, MapPin, Phone, Globe, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { contextualAds, tierConfig, SponsorBadge, ContextualAd } from './ContextualAdEngine';

interface WifiAdScreenProps {
  onComplete: () => void;
  userInterests?: string[];
  onHome: () => void;
}

// Platinum veya Gold sponsordan rastgele seç
const getRandomSponsor = (interests: string[] = []): ContextualAd => {
  const priorityAds = contextualAds.filter(ad => ad.tier === 'platinum' || ad.tier === 'gold');
  
  // İlgi alanlarına göre skorla
  if (interests.length > 0) {
    const scored = priorityAds.map(ad => ({
      ...ad,
      score: ad.categories.filter(cat => interests.includes(cat)).length
    })).sort((a, b) => b.score - a.score);
    
    // En yüksek skorlu ilk 3'ten rastgele seç
    const topAds = scored.slice(0, 3);
    return topAds[Math.floor(Math.random() * topAds.length)];
  }
  
  return priorityAds[Math.floor(Math.random() * priorityAds.length)];
};

export const WifiAdScreen = ({ onComplete, userInterests = [], onHome }: WifiAdScreenProps) => {
  const sponsor = useMemo(() => getRandomSponsor(userInterests), []);
  const config = tierConfig[sponsor.tier];
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [adComplete, setAdComplete] = useState(false);
  
  const adDuration = 10; // seconds (10-15 sn ideal)
  const remainingSeconds = Math.max(0, adDuration - Math.floor(progress / 100 * adDuration));

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAdComplete(true);
          return 100;
        }
        return prev + (100 / (adDuration * 10));
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Auto-transition when ad is complete
  useEffect(() => {
    if (adComplete) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 1500); // 1.5 saniye sonra otomatik geçiş
      return () => clearTimeout(timeout);
    }
  }, [adComplete, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-4">
          {/* Home Button */}
          <button 
            onClick={onHome}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Home className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">WiFi Bağlantısı</h1>
              <p className="text-xs text-white/60">Reklam sonrası bağlanacaksınız</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Sponsor Card Container */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-2xl ${config.glowColor} ${config.borderColor} border-2`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${sponsor.image})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${config.bgGradient}`} />
          
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
            <div className="px-3 py-1 rounded bg-black/50 text-white/80 text-xs font-medium backdrop-blur-sm">
              REKLAM
            </div>
            <SponsorBadge tier={sponsor.tier} size="sm" />
          </div>
          
          {/* Main Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            {/* Logo & Name */}
            <div className="flex items-center gap-4 mb-3">
              <motion.div 
                className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-4xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {sponsor.logo}
              </motion.div>
              <div>
                <h3 className="text-2xl font-black text-white">{sponsor.name}</h3>
                <p className="text-white/70 text-sm">{sponsor.slogan}</p>
              </div>
            </div>
            
            {/* Offer Badge */}
            <motion.div 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${config.gradient} text-white font-bold mb-3 self-start`}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Gift className="w-5 h-5" />
              {sponsor.offer}
            </motion.div>
            
            {/* Description */}
            <p className="text-white/80 text-sm mb-4 line-clamp-2">{sponsor.description}</p>
            
            {/* Info Row */}
            <div className="flex items-center gap-4 text-white/60 text-xs">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {sponsor.location}
              </span>
              {sponsor.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {sponsor.phone}
                </span>
              )}
            </div>
          </div>
          
          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <button 
                onClick={() => setIsPlaying(true)}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Play className="w-10 h-10 text-white fill-white ml-1" />
              </button>
            </div>
          )}
          
          {/* Bottom Controls */}
          <div className="absolute bottom-4 right-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                )}
              </button>
              
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Large Remaining Time Display */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm mb-2">Kalan Süre</p>
          <div className="text-5xl font-bold text-white font-mono">
            00:{String(remainingSeconds).padStart(2, '0')}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mt-4">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
        
        {/* Status / CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 w-full max-w-2xl"
        >
          {adComplete ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/20 text-green-400 font-medium mb-4">
                <Wifi className="w-5 h-5" />
                Bağlandınız!
              </div>
              <p className="text-white/60 text-sm">Otomatik yönlendiriliyorsunuz...</p>
            </div>
          ) : (
            <Button
              disabled
              className="w-full py-6 text-lg rounded-2xl bg-primary/30 cursor-not-allowed"
            >
              <Wifi className="w-5 h-5 mr-2" />
              Reklam İzleniyor...
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};
