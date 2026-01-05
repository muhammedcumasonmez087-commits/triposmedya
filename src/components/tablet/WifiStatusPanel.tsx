import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, WifiOff, Signal, SignalHigh, SignalLow, SignalMedium,
  ChevronLeft, Check, RefreshCw, Globe, Clock, Zap, Shield, 
  Download, Upload, Router, Smartphone, Laptop, Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNavBar } from './BottomNavBar';

interface WifiStatusPanelProps {
  onBack: () => void;
  onHome: () => void;
  onExplore?: () => void;
  onGames?: () => void;
}

interface NetworkInfo {
  isOnline: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

// Simulate connected devices for kiosk demo
const connectedDevices = [
  { id: 1, name: 'Bu Cihaz (Kiosk)', type: 'tablet', icon: Monitor, connected: true },
  { id: 2, name: 'iPhone 15 Pro', type: 'phone', icon: Smartphone, connected: true },
  { id: 3, name: 'MacBook Pro', type: 'laptop', icon: Laptop, connected: true },
];

export const WifiStatusPanel = ({ onBack, onHome, onExplore, onGames }: WifiStatusPanelProps) => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({ isOnline: true });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionTime, setConnectionTime] = useState(0);
  const [dataUsed, setDataUsed] = useState({ download: 0, upload: 0 });

  // Get network information
  useEffect(() => {
    const updateNetworkInfo = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      setNetworkInfo({
        isOnline: navigator.onLine,
        effectiveType: connection?.effectiveType || '4g',
        downlink: connection?.downlink || 100,
        rtt: connection?.rtt || 50,
        saveData: connection?.saveData || false
      });
    };

    updateNetworkInfo();

    window.addEventListener('online', updateNetworkInfo);
    window.addEventListener('offline', updateNetworkInfo);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
    }

    return () => {
      window.removeEventListener('online', updateNetworkInfo);
      window.removeEventListener('offline', updateNetworkInfo);
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  // Simulate connection timer
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionTime(prev => prev + 1);
      // Simulate data usage
      setDataUsed(prev => ({
        download: prev.download + Math.random() * 0.5,
        upload: prev.upload + Math.random() * 0.1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}s ${mins}dk`;
    }
    return `${mins}dk ${secs}sn`;
  };

  const formatDataSize = (mb: number) => {
    if (mb >= 1000) {
      return `${(mb / 1000).toFixed(2)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const getSignalStrength = () => {
    const downlink = networkInfo.downlink || 0;
    if (downlink >= 10) return { level: 'excellent', icon: SignalHigh, label: 'Mükemmel', color: 'text-green-500' };
    if (downlink >= 5) return { level: 'good', icon: SignalMedium, label: 'İyi', color: 'text-emerald-500' };
    if (downlink >= 1) return { level: 'fair', icon: SignalLow, label: 'Orta', color: 'text-yellow-500' };
    return { level: 'poor', icon: Signal, label: 'Zayıf', color: 'text-red-500' };
  };

  const signal = getSignalStrength();
  const SignalIcon = signal.icon;

  const handleNavClick = (id: string) => {
    switch (id) {
      case 'home':
        onHome();
        break;
      case 'explore':
        if (onExplore) onExplore();
        break;
      case 'games':
        if (onGames) onGames();
        break;
      case 'wifi':
        // Already on wifi
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">WiFi Durumu</h1>
            <p className="text-white/60 text-sm">Bağlantı bilgileri ve ayarlar</p>
          </div>
        </div>
        <motion.button
          onClick={handleRefresh}
          animate={{ rotate: isRefreshing ? 360 : 0 }}
          transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-white" />
        </motion.button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Connection Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-3xl p-6 ${
              networkInfo.isOnline 
                ? 'bg-gradient-to-br from-green-600/20 to-emerald-600/10 border border-green-500/30' 
                : 'bg-gradient-to-br from-red-600/20 to-rose-600/10 border border-red-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  networkInfo.isOnline ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {networkInfo.isOnline ? (
                    <Wifi className="w-8 h-8 text-green-400" />
                  ) : (
                    <WifiOff className="w-8 h-8 text-red-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {networkInfo.isOnline ? 'Bağlı' : 'Bağlantı Yok'}
                  </h2>
                  <p className="text-white/70">TRIPOS_KIOSK_WIFI</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`flex items-center gap-2 ${signal.color}`}>
                  <SignalIcon className="w-6 h-6" />
                  <span className="font-semibold">{signal.label}</span>
                </div>
                <p className="text-white/50 text-sm mt-1">
                  {networkInfo.effectiveType?.toUpperCase() || '4G'}
                </p>
              </div>
            </div>

            {/* Animated signal waves */}
            {networkInfo.isOnline && (
              <div className="absolute top-4 right-4 opacity-20">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-32 h-32 border-2 border-green-400 rounded-full"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: 'easeOut'
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 rounded-2xl p-4 border border-white/10"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-white/50 text-sm">Bağlantı Süresi</p>
              <p className="text-white text-xl font-bold">{formatTime(connectionTime)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/5 rounded-2xl p-4 border border-white/10"
            >
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mb-3">
                <Download className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-white/50 text-sm">İndirme</p>
              <p className="text-white text-xl font-bold">{formatDataSize(dataUsed.download)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 rounded-2xl p-4 border border-white/10"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-white/50 text-sm">Yükleme</p>
              <p className="text-white text-xl font-bold">{formatDataSize(dataUsed.upload)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white/5 rounded-2xl p-4 border border-white/10"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-white/50 text-sm">Hız</p>
              <p className="text-white text-xl font-bold">{networkInfo.downlink || 100} Mbps</p>
            </motion.div>
          </div>

          {/* Network Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 rounded-2xl p-5 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <Router className="w-5 h-5 text-primary" />
              <h3 className="text-white font-semibold">Ağ Bilgileri</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-white/60">Ağ Adı (SSID)</span>
                <span className="text-white font-medium">TRIPOS_KIOSK_WIFI</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-white/60">Güvenlik</span>
                <span className="text-white font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  WPA2-Enterprise
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-white/60">IP Adresi</span>
                <span className="text-white font-medium">192.168.1.{Math.floor(Math.random() * 200 + 50)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-white/60">DNS</span>
                <span className="text-white font-medium">8.8.8.8</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-white/60">Gecikme (Ping)</span>
                <span className="text-white font-medium">{networkInfo.rtt || 50} ms</span>
              </div>
            </div>
          </motion.div>

          {/* Connected Devices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white/5 rounded-2xl p-5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="text-white font-semibold">Bağlı Cihazlar</h3>
              </div>
              <span className="text-white/50 text-sm">{connectedDevices.length} cihaz</span>
            </div>
            
            <div className="space-y-3">
              {connectedDevices.map((device, index) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <device.icon className="w-5 h-5 text-white/70" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{device.name}</p>
                      <p className="text-white/50 text-sm capitalize">{device.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-400 text-sm">Bağlı</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            <Button
              variant="outline"
              className="h-14 rounded-xl border-white/20 text-white hover:bg-white/10"
              onClick={handleRefresh}
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Bağlantıyı Yenile
            </Button>
            <Button
              className="h-14 rounded-xl bg-primary hover:bg-primary/90"
            >
              <Check className="w-5 h-5 mr-2" />
              Bağlantı Testi
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        activeItem="wifi"
        onNavClick={handleNavClick}
        onBack={onBack}
        showBackButton={true}
      />
    </div>
  );
};

export default WifiStatusPanel;
