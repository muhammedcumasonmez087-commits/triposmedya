import { useState, useEffect } from 'react';
import { Wifi, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import categoryFood from '@/assets/category-food.jpg';

interface WifiAdScreenProps {
  onComplete: () => void;
  sponsorName: string;
  sponsorLogo?: string;
}

export const WifiAdScreen = ({ onComplete, sponsorName }: WifiAdScreenProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [adComplete, setAdComplete] = useState(false);
  
  const adDuration = 5; // seconds

  useEffect(() => {
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
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Wifi className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">KKTC Taksi Wi-Fi</h1>
            <p className="text-xs text-white/60">Ücretsiz İnternet Hizmeti</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-white/60">34 TKS 1923</p>
          <p className="text-xs text-white/40">Lefkoşa</p>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            İnternete bağlanmak için
          </h2>
          <h2 className="text-3xl font-bold text-primary mb-4">
            lütfen reklamı izleyiniz
          </h2>
          <p className="text-white/60">
            Sponsorlu içerik gösterimi sonrası bağlantı sağlanacaktır.
          </p>
        </motion.div>
        
        {/* Video Player Container */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden bg-slate-800 shadow-2xl"
        >
          {/* Fake video content - sponsor image */}
          <img 
            src={categoryFood}
            alt="Sponsor Ad"
            className="w-full h-full object-cover"
          />
          
          {/* Overlay gradient */}
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
        
        {/* Progress Section */}
        <div className="w-full max-w-2xl mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2 text-primary">
              <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Kalan Süre</span>
            </div>
            <span className="text-white font-mono">
              00:{String(Math.max(0, adDuration - Math.floor(progress / 100 * adDuration))).padStart(2, '0')}
            </span>
          </div>
          
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-white/40 mt-2">
            <span>Yükleniyor...</span>
            <span>%{Math.floor(progress)}</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: adComplete ? 1 : 0.5 }}
          className="mt-8 w-full max-w-2xl"
        >
          <Button
            onClick={onComplete}
            disabled={!adComplete}
            className="w-full py-6 text-lg rounded-2xl bg-primary hover:bg-primary/90 disabled:bg-primary/30 disabled:cursor-not-allowed"
          >
            <Wifi className="w-5 h-5 mr-2" />
            {adComplete ? 'Devam Et ve Bağlan' : 'Reklam İzleniyor...'}
          </Button>
          
          <p className="text-center text-xs text-white/40 mt-4">
            "Devam Et" butonuna tıklayarak <span className="text-primary cursor-pointer hover:underline">Kullanım Koşulları</span>'nı kabul etmiş olursunuz.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
