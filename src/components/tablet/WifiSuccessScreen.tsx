import { Wifi, CheckCircle, QrCode, ChevronRight, Star, MapPin, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import categoryFood from '@/assets/category-food.jpg';

interface WifiSuccessScreenProps {
  onContinue: () => void;
  userName?: string;
}

export const WifiSuccessScreen = ({ onContinue, userName }: WifiSuccessScreenProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <Wifi className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-lg">Taksi Wi-Fi</h1>
              <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">Çevrimiçi</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">Konum</span>
          <span className="text-white font-medium">Lefkoşa, KKTC</span>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <span className="text-white">⚙️</span>
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-accent" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.3 }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center"
          >
            <span className="text-accent-foreground font-bold">✓</span>
          </motion.div>
        </motion.div>
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-3">İnternet Bağlantısı Başarılı</h2>
          <p className="text-white/60 max-w-md">
            Hoş geldiniz{userName ? ` ${userName}` : ''}! Şimdi KKTC'nin en iyi fırsatlarını keşfetme ve yolculuğunuzun tadını çıkarma zamanı.
          </p>
        </motion.div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
          {/* QR Code Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
          >
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-white rounded-xl p-2 flex-shrink-0">
                <QRCode 
                  value="https://kktc-taxi.app/download"
                  size={80}
                  level="M"
                />
              </div>
              
              <div className="flex-1">
                <span className="inline-block px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium mb-2">
                  #Kolaylık
                </span>
                <h3 className="text-xl font-bold text-white mb-2">Fırsatları Telefona Kaydet</h3>
                <p className="text-sm text-white/60 mb-4">
                  Yolculuktan sonra da indirimleri ve mekan önerilerini kaçırmamak için kameranızı okutun.
                </p>
                <Button className="bg-primary/20 hover:bg-primary/30 text-primary rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Uygulamayı Alin
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Sponsored Ad Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative rounded-3xl overflow-hidden group cursor-pointer"
          >
            <img 
              src={categoryFood}
              alt="Sponsor"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Sponsor Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-highlight/90 text-highlight-foreground text-xs font-bold">
              SPONSORLU
            </div>
            
            {/* Like Button */}
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
              <span className="text-white">♡</span>
            </button>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-1">Eziç'te %10 İndirim</h3>
              <p className="text-white/70 text-sm mb-4">
                Başkent'in yemeklerinde kendi yakasını bir taraftan indirimleri deneyimleyin.
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-reward/90 text-reward-foreground">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-sm font-bold">4.9</span>
                  </div>
                  <span className="text-white/50 text-sm">0.2km</span>
                </div>
                
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl">
                  Detayları Gör
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <button 
            onClick={onContinue}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            QR kodunu geç ve tabletten devam et
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
