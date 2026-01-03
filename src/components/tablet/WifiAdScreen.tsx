import { useState, useEffect } from 'react';
import { Wifi, Play, Pause, Volume2, VolumeX, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import categoryFood from '@/assets/category-food.jpg';

interface WifiAdScreenProps {
  onComplete: () => void;
  sponsorName: string;
  sponsorLogo?: string;
  onHome: () => void;
}

export const WifiAdScreen = ({ onComplete, sponsorName, onHome }: WifiAdScreenProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Default MUTE
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
        {/* Video Player Container */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden bg-slate-800 shadow-2xl"
        >
          {/* Video content */}
          <img 
            src={categoryFood}
            alt="Sponsor Ad"
            className="w-full h-full object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          
          {/* REKLAM Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded bg-black/50 text-white/80 text-xs font-medium backdrop-blur-sm">
            REKLAM
          </div>
          
          {/* Sponsor Badge */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md text-white text-sm font-medium">
            {sponsorName}
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
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                )}
              </button>
              
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
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
