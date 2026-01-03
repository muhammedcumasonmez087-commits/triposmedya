import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Wifi, Gamepad2, Compass, X, Tag, Clock, Phone, MapPin, Star, Globe, Volume2, VolumeX } from 'lucide-react';
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

// Premium reklamlar - yüksek kaliteli içerik
const premiumAds = [
  {
    id: 'merit-crystal',
    name: 'Merit Crystal Cove',
    logo: '🏨',
    tagline: 'Akdeniz\'in Eşsiz Lüksü',
    description: 'KKTC\'nin en prestijli 5 yıldızlı oteli. Özel plaj, dünya mutfağı ve spa deneyimi ile unutulmaz bir konaklama.',
    offer: 'İlk gece %30 indirim',
    couponCode: 'CRYSTAL30',
    rating: 4.9,
    reviews: 2847,
    location: 'Alsancak, Girne',
    category: 'Konaklama',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80',
    accent: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'camelot-beach',
    name: 'Camelot Beach Club',
    logo: '🏖️',
    tagline: 'Gündüzleri Cennet, Geceleri Eğlence',
    description: 'Altın sarısı kumsalda beach party\'ler, canlı DJ performansları ve enfes deniz ürünleri. Yaz hiç bitmesin.',
    offer: 'Ücretsiz şezlong + içecek',
    couponCode: 'CAMELOT2024',
    rating: 4.7,
    reviews: 1523,
    location: 'Escape Beach, Girne',
    category: 'Beach & Eğlence',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    accent: 'from-amber-500 to-orange-500'
  },
  {
    id: 'bellapais-gardens',
    name: 'Bellapais Gardens',
    logo: '🌿',
    tagline: 'Tarihin İçinde Huzur',
    description: 'Bellapais Manastırı manzaralı butik otel. Organik bahçe restoranı, yoga seansları ve doğayla iç içe konaklama.',
    offer: 'Kahvaltı dahil konaklama',
    couponCode: 'BELLA25',
    rating: 4.8,
    reviews: 892,
    location: 'Bellapais, Girne',
    category: 'Butik Otel',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
    accent: 'from-emerald-600 to-teal-500'
  },
  {
    id: 'niazi-kebab',
    name: 'Niazi\'s Restaurant',
    logo: '🍖',
    tagline: 'Efsanevi Kıbrıs Lezzetleri',
    description: '50 yıllık geleneğiyle KKTC\'nin en ünlü restoranı. Şeftali kebabı, hellim ve otantik Kıbrıs mutfağı.',
    offer: 'Tatlı ikramı',
    couponCode: 'NIAZI50',
    rating: 4.6,
    reviews: 3241,
    location: 'Girne Limanı',
    category: 'Restoran',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80',
    accent: 'from-red-600 to-rose-500'
  },
  {
    id: 'salamis-tours',
    name: 'Salamis Antik Kent',
    logo: '🏛️',
    tagline: '3000 Yıllık Tarih',
    description: 'Akdeniz\'in en iyi korunmuş antik kentlerinden biri. Profesyonel rehberli turlarla tarihe yolculuk.',
    offer: 'Rehberli tur %20 indirim',
    couponCode: 'SALAMIS20',
    rating: 4.9,
    reviews: 1876,
    location: 'Gazimağusa',
    category: 'Kültür & Tarih',
    image: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=1920&q=80',
    accent: 'from-stone-600 to-amber-600'
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
          <div className={`absolute inset-0 bg-gradient-to-t ${ad.accent} opacity-40`} />
          
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center mb-4">
              <span className="text-5xl">{ad.logo}</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-1">{ad.name}</h2>
            <p className="text-white/80">{ad.tagline}</p>
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
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-gray-700">{ad.rating} ({ad.reviews.toLocaleString()} değerlendirme)</span>
            </div>
          </div>
          
          {/* Offer Box */}
          <div className={`bg-gradient-to-r ${ad.accent} rounded-2xl p-6`}>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-white/70 text-sm mb-1">ÖZEL TEKLİF</p>
                <p className="text-white font-bold text-xl mb-2">{ad.offer}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20">
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
  const [isMuted, setIsMuted] = useState(true);

  // 10 saniyede bir reklam değiştir
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          setCurrentAdIndex(i => (i + 1) % premiumAds.length);
          return 0;
        }
        return prev + 1; // 10 saniye
      });
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, []);

  const handlePrevAd = () => {
    setCurrentAdIndex(prev => (prev - 1 + premiumAds.length) % premiumAds.length);
    setAdProgress(0);
  };

  const handleNextAd = () => {
    setCurrentAdIndex(prev => (prev + 1) % premiumAds.length);
    setAdProgress(0);
  };

  const currentAd = premiumAds[currentAdIndex];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Full Screen Ad Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAd.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8 }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentAd.image})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${currentAd.accent} opacity-30`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Arrows - Minimal */}
      <button 
        onClick={handlePrevAd}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-all"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button 
        onClick={handleNextAd}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-all"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Minimal Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
            <span className="text-white font-black text-lg">T</span>
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">TripOS</h1>
            <p className="text-white/50 text-xs">Hoş Geldiniz</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <button 
            onClick={() => setShowJourney(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/20 backdrop-blur border border-green-500/30 text-white hover:bg-green-500/30 transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium">Yolculuk</span>
          </button>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/10">
            <span className="text-white text-sm">28°C</span>
            <span className="text-sm">☀️</span>
          </div>
          
          <button className="px-3 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-white hover:bg-white/20 transition-all">
            <Globe className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </motion.div>
      </header>

      {/* Main Content - Left Side */}
      <div className="absolute left-0 top-0 bottom-0 w-[55%] flex items-center px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 30, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            {/* Brand */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                <span className="text-4xl">{currentAd.logo}</span>
              </div>
              <div>
                <Badge className="bg-white/20 text-white border-none text-xs mb-1">
                  {currentAd.category}
                </Badge>
                <h2 className="text-4xl font-black text-white">{currentAd.name}</h2>
              </div>
            </div>
            
            {/* Tagline */}
            <p className="text-white/60 text-xl mb-4">{currentAd.tagline}</p>
            
            {/* Description */}
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              {currentAd.description}
            </p>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-white font-bold">{currentAd.rating}</span>
                <span className="text-white/50">({currentAd.reviews.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{currentAd.location}</span>
              </div>
            </div>
            
            {/* CTA */}
            <button 
              onClick={() => setShowAdDetail(currentAd)}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r ${currentAd.accent} text-white font-bold text-lg shadow-2xl hover:scale-[1.02] transition-transform`}
            >
              <span>{currentAd.offer}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Dots - Right Side Center */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {premiumAds.map((ad, index) => (
          <button
            key={ad.id}
            onClick={() => { setCurrentAdIndex(index); setAdProgress(0); }}
            className={`relative w-3 h-3 rounded-full transition-all ${
              index === currentAdIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'
            }`}
          >
            {index === currentAdIndex && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 2, opacity: 0.5 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Bottom Bar - Clean & Minimal */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-6">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${currentAd.accent}`}
            style={{ width: `${adProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        
        {/* Bottom Actions */}
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={onWifiRequest}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur border border-white/10 text-white font-medium hover:bg-white/20 transition-all"
          >
            <Wifi className="w-5 h-5" />
            <span>Free WiFi</span>
          </button>
          
          <button 
            onClick={onGames}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur border border-white/10 text-white font-medium hover:bg-white/20 transition-all"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>Oyunlar</span>
          </button>
          
          <button 
            onClick={onExplore}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
          >
            <Compass className="w-5 h-5" />
            <span>Keşfet</span>
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
