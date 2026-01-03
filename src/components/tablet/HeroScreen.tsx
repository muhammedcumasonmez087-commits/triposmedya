import { useState, useEffect } from 'react';
import { ChevronRight, Wifi, Gamepad2, Compass, X, Tag, MapPin, Home, Music, Info, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { JourneyTracker } from './JourneyTracker';

interface HeroScreenProps {
  onStart: (interests?: string[]) => void;
  onWifiRequest: () => void;
  onGames: () => void;
  onExplore: () => void;
}

// Premium reklamlar - farklı kategorilerde 6 reklam
const premiumAds = [
  {
    id: 'salamis-bay',
    brand: 'SALAMIS BAY',
    subtitle: 'RESORT HOTEL & CONTİ',
    campaignTag: '01-16 ŞUBAT ÖZEL',
    headline: 'KKTC HALKINA',
    subHeadline: 'Özel Fırsat',
    priceLabel: 'Kişi Başı Gecelik',
    price: '3.750',
    currency: '₺',
    priceNote: 'ULTRA HER ŞEY DAHİL',
    category: 'Otel',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80',
    couponCode: 'SALAMIS2024',
    location: 'Gazimağusa',
    description: 'Kuzey Kıbrıs\'ın en prestijli tatil köyü. Özel plaj, 5 yıldızlı hizmet ve eşsiz Akdeniz manzarası.'
  },
  {
    id: 'merit-royal',
    brand: 'MERIT ROYAL',
    subtitle: 'PREMIUM HOTEL & SPA',
    campaignTag: 'SINIRLI TEKLİF',
    headline: 'TATİLİN',
    subHeadline: 'Lüks Adresi',
    priceLabel: 'Çift Kişi Gecelik',
    price: '5.200',
    currency: '₺',
    priceNote: 'TAM PANSİYON PLUS',
    category: 'Otel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80',
    couponCode: 'MERIT2024',
    location: 'Girne',
    description: 'Dünya standartlarında lüks konaklama. Casino, spa ve fine dining deneyimi bir arada.'
  },
  {
    id: 'camelot-beach',
    brand: 'CAMELOT',
    subtitle: 'BEACH CLUB',
    campaignTag: 'YAZ SEZONU',
    headline: 'SAHİLİN EN',
    subHeadline: 'Cool Noktası',
    priceLabel: 'Giriş + Şezlong',
    price: '450',
    currency: '₺',
    priceNote: '1 İÇECEK DAHİL',
    category: 'Beach Club',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    couponCode: 'CAMELOT24',
    location: 'Escape Beach, Girne',
    description: 'Altın kumsalda beach party, canlı DJ ve enfes deniz lezzetleri. Yazın kalbi burada atıyor.'
  },
  {
    id: 'niaziis-restaurant',
    brand: 'NİAZİ\'S',
    subtitle: 'AUTHENTIC CYPRUS CUISINE',
    campaignTag: 'LEZZETİN ADRESİ',
    headline: 'ŞEFTALİ KEBABI',
    subHeadline: 'Efsanesi Burada',
    priceLabel: '2 Kişilik Menü',
    price: '780',
    currency: '₺',
    priceNote: 'TATLI İKRAMI HEDİYE',
    category: 'Restoran',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80',
    couponCode: 'NIAZI50',
    location: 'Girne Limanı',
    description: '50 yıllık geleneğiyle KKTC\'nin en ünlü restoranı. Otantik Kıbrıs mutfağının en iyi hali.'
  },
  {
    id: 'colony-garden',
    brand: 'COLONY GARDEN',
    subtitle: 'BOUTIQUE HOTEL',
    campaignTag: 'HUZURUN ADRESİ',
    headline: 'DOĞAYLA İÇ İÇE',
    subHeadline: 'Butik Konaklama',
    priceLabel: 'Kişi Başı Gecelik',
    price: '2.100',
    currency: '₺',
    priceNote: 'KAHVALTI DAHİL',
    category: 'Butik Otel',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
    couponCode: 'COLONY25',
    location: 'Bellapais, Girne',
    description: 'Bellapais Manastırı manzaralı butik otel. Organik bahçe ve yoga ile huzur dolu konaklama.'
  },
  {
    id: 'elexus-hotel',
    brand: 'ELEXUS',
    subtitle: 'HOTEL RESORT & SPA',
    campaignTag: 'VIP FIRSAT',
    headline: 'AKDENİZ\'İN',
    subHeadline: 'İncisi',
    priceLabel: 'Kişi Başı Gecelik',
    price: '4.500',
    currency: '₺',
    priceNote: 'ULTRA HER ŞEY DAHİL',
    category: 'Otel',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1920&q=80',
    couponCode: 'ELEXUS2024',
    location: 'Çatalköy, Girne',
    description: 'Akdeniz\'in en güzel sahilinde 5 yıldızlı tatil. Aquapark, spa ve dünya mutfağı.'
  }
];

// Reklam Detay Modalı
const AdDetailModal = ({ 
  ad, 
  onClose 
}: { 
  ad: typeof premiumAds[0]; 
  onClose: () => void;
}) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl" 
        onClick={onClose}
      />
      
      <motion.div
        className="relative w-full max-w-4xl h-[80vh] overflow-hidden rounded-[2rem] shadow-2xl flex bg-white"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <Badge className="self-start mb-3 bg-orange-500 text-white border-none">
              {ad.campaignTag}
            </Badge>
            <h2 className="text-3xl font-black text-white mb-1">{ad.brand}</h2>
            <p className="text-white/80">{ad.subtitle}</p>
          </div>
        </div>
        
        {/* Right - Content */}
        <div className="w-1/2 p-8 flex flex-col">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          
          <Badge className="self-start mb-4 bg-gray-100 text-gray-700 border-none">
            {ad.category}
          </Badge>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {ad.headline} <span className="text-orange-500 italic">{ad.subHeadline}</span>
          </h3>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-6 flex-1">
            {ad.description}
          </p>
          
          {/* Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{ad.location}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{ad.campaignTag}</span>
            </div>
          </div>
          
          {/* Offer Box */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-white/70 text-sm mb-1">{ad.priceLabel}</p>
                <p className="text-white font-black text-3xl mb-1">{ad.price}<span className="text-lg">{ad.currency}</span></p>
                <p className="text-white/80 text-sm">{ad.priceNote}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 mt-3">
                  <Tag className="w-4 h-4 text-white" />
                  <span className="text-white font-mono font-bold text-sm">{ad.couponCode}</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl">
                <QRCode value={`https://tripos.app/c/${ad.couponCode}`} size={72} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const HeroScreen = ({ onStart, onWifiRequest, onGames, onExplore }: HeroScreenProps) => {
  const [showJourney, setShowJourney] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showAdDetail, setShowAdDetail] = useState<typeof premiumAds[0] | null>(null);
  const [adProgress, setAdProgress] = useState(0);
  const [activeNav, setActiveNav] = useState('home');

  // 10 saniyede bir reklam değiştir
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          setCurrentAdIndex(i => (i + 1) % premiumAds.length);
          return 0;
        }
        return prev + 1;
      });
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, []);

  const currentAd = premiumAds[currentAdIndex];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Full Screen Ad Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAd.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8 }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentAd.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Brand Header - Top Left */}
      <header className="absolute top-0 left-0 right-0 z-20 px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-light tracking-wider text-white">
              {currentAd.brand}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1 h-5 bg-orange-500 rounded-full" />
              <p className="text-white/70 text-sm tracking-widest">{currentAd.subtitle}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </header>

      {/* Campaign Tag - Left Side */}
      <div className="absolute left-8 top-32 z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge className="bg-black/50 backdrop-blur-sm text-white border-white/20 px-4 py-2 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              {currentAd.campaignTag}
            </Badge>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Headline - Left Center */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl font-black text-white leading-tight mb-2">
              {currentAd.headline}
            </h2>
            <p className="text-5xl font-light italic text-orange-400">
              {currentAd.subHeadline}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Price Card - Right Side */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 min-w-[200px]"
          >
            <p className="text-white/70 text-sm mb-2">{currentAd.priceLabel}</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-black text-white">{currentAd.price}</span>
              <span className="text-orange-400 text-xl font-bold">{currentAd.currency}</span>
            </div>
            <p className="text-white/60 text-xs tracking-wider">{currentAd.priceNote}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* More Info Button - Below Price Card */}
      <div className="absolute right-8 top-[65%] z-20">
        <AnimatePresence mode="wait">
          <motion.button
            key={currentAd.id}
            onClick={() => setShowAdDetail(currentAd)}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all shadow-lg hover:shadow-orange-500/30"
          >
            <Info className="w-5 h-5" />
            <span>Daha Fazla Bilgi</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </AnimatePresence>
      </div>

      {/* Ad Progress Dots - Right Side */}
      <div className="absolute right-8 top-1/4 z-20 flex flex-col gap-2">
        {premiumAds.map((ad, index) => (
          <button
            key={ad.id}
            onClick={() => { setCurrentAdIndex(index); setAdProgress(0); }}
            className={`relative w-2.5 h-2.5 rounded-full transition-all ${
              index === currentAdIndex ? 'bg-orange-500 scale-125' : 'bg-white/30 hover:bg-white/50'
            }`}
          >
            {index === currentAdIndex && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-orange-400"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {/* Progress Bar */}
        <div className="w-full h-0.5 bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
            style={{ width: `${adProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        
        {/* Bottom Navigation */}
        <div className="flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-xl">
          {/* Left - Location & Weather */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/70">
              <span className="text-lg">☀️</span>
              <div>
                <p className="text-white text-sm font-medium">LEFKOŞA</p>
                <p className="text-white/60 text-xs">24°C</p>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex items-center gap-2 text-white/70">
              <span className="text-lg">🚕</span>
              <div>
                <p className="text-white text-sm font-medium">KALKIŞ</p>
                <p className="text-white/60 text-xs">12 dk</p>
              </div>
            </div>
          </div>

          {/* Center - Navigation */}
          <div className="flex items-center gap-2 bg-black/50 rounded-2xl p-1.5">
            <button 
              onClick={() => setActiveNav('home')}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all ${
                activeNav === 'home' ? 'bg-orange-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-medium">ANA SAYFA</span>
            </button>
            <button 
              onClick={() => { setActiveNav('games'); onGames(); }}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all ${
                activeNav === 'games' ? 'bg-orange-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
              <span className="text-[10px] font-medium">OYUNLAR</span>
            </button>
            <button 
              onClick={() => setActiveNav('music')}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all ${
                activeNav === 'music' ? 'bg-orange-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <Music className="w-5 h-5" />
              <span className="text-[10px] font-medium">MÜZİK</span>
            </button>
            <button 
              onClick={() => { setActiveNav('wifi'); onWifiRequest(); }}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all ${
                activeNav === 'wifi' ? 'bg-orange-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <Wifi className="w-5 h-5" />
              <span className="text-[10px] font-medium">WIFI</span>
            </button>
          </div>

          {/* Right - Explore Button */}
          <button 
            onClick={onExplore}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-lg hover:shadow-orange-500/30"
          >
            <span>KEŞFET</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
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