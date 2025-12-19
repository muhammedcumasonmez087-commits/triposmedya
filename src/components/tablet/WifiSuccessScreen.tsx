import { Wifi, Copy, Check, QrCode, ChevronRight, Star, Download, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import categoryFood from '@/assets/category-food.jpg';

interface WifiSuccessScreenProps {
  onContinue: () => void;
  onHome: () => void;
  userName?: string;
}

export const WifiSuccessScreen = ({ onContinue, onHome, userName }: WifiSuccessScreenProps) => {
  const [copied, setCopied] = useState(false);
  const wifiPassword = "Taxi1234";

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(wifiPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <Wifi className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white text-lg">Taksi Wi-Fi</h1>
                <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">Hazır</span>
              </div>
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
        {/* WiFi Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="relative mb-6"
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
            <Wifi className="w-16 h-16 text-white" />
          </div>
        </motion.div>
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Wi-Fi Şifresi</h2>
          <p className="text-white/60 max-w-md">
            Hoş geldiniz{userName ? ` ${userName}` : ''}! Aşağıdaki şifreyi kullanarak internete bağlanabilirsiniz.
          </p>
        </motion.div>
        
        {/* Password Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md mb-8"
        >
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <p className="text-white/50 text-sm mb-2">Ağ Adı (SSID)</p>
              <p className="text-xl font-semibold text-white">KKTC_Taxi_WiFi</p>
            </div>
            
            <div className="h-px bg-white/10 mb-6" />
            
            <div className="text-center">
              <p className="text-white/50 text-sm mb-3">Şifre</p>
              <div className="flex items-center justify-center gap-4">
                <div className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-dashed border-primary/50">
                  <span className="text-4xl font-mono font-bold text-white tracking-widest">
                    {wifiPassword}
                  </span>
                </div>
                <button
                  onClick={handleCopyPassword}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                    copied 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                </button>
              </div>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-accent text-sm mt-3"
                >
                  Şifre kopyalandı!
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
          {/* QR Code Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
          >
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-white rounded-xl p-2 flex-shrink-0">
                <QRCode 
                  value="https://kktc-taxi.app/download"
                  size={64}
                  level="M"
                />
              </div>
              
              <div className="flex-1">
                <span className="inline-block px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium mb-2">
                  #Kolaylık
                </span>
                <h3 className="text-lg font-bold text-white mb-2">Fırsatları Telefona Kaydet</h3>
                <p className="text-sm text-white/60 mb-3">
                  İndirimleri kaçırmamak için QR kodu okutun.
                </p>
                <Button size="sm" className="bg-primary/20 hover:bg-primary/30 text-primary rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Uygulamayı Al
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Sponsored Ad Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative rounded-3xl overflow-hidden group cursor-pointer"
          >
            <img 
              src={categoryFood}
              alt="Sponsor"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-highlight/90 text-highlight-foreground text-xs font-bold">
              SPONSORLU
            </div>
            
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
              <span className="text-white">♡</span>
            </button>
            
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-xl font-bold text-white mb-1">Eziç'te %10 İndirim</h3>
              <p className="text-white/70 text-sm mb-3">
                Lezzetli yemeklerle yolculuğunuzu tatlandırın.
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-reward/90 text-reward-foreground">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-sm font-bold">4.9</span>
                  </div>
                  <span className="text-white/50 text-sm">0.2km</span>
                </div>
                
                <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl">
                  Detaylar
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
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Button 
            onClick={onContinue}
            className="btn-primary-gradient px-8 py-6 rounded-2xl text-lg"
          >
            KKTC'yi Keşfetmeye Başla
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
