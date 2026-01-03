import { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Wifi, Gamepad2, Navigation, Globe, X, Tag, Clock, Phone, QrCode, ChevronLeft, Info, Sparkles, Star, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import heroImage from '@/assets/hero-cyprus.jpg';
import { JourneyTracker } from './JourneyTracker';
import { InterestChipSelector } from './InterestChipSelector';

interface HeroScreenProps {
  onStart: (interests?: string[]) => void;
  onWifiRequest: () => void;
  onGames: () => void;
}

// KKTC'deki gerçek/aktif reklamverenler - En az 10 tane
const kktcAds = [
  {
    id: 'colony',
    name: 'Colony Garden Hotel',
    logo: '🏨',
    slogan: "Girne'nin En İyi Oteli",
    shortDesc: 'Lüks konaklama deneyimi',
    fullDesc: 'Girne\'nin kalbinde, deniz manzaralı lüks odalar ve dünya standartlarında hizmet. Açık havuz, spa merkezi ve gurme restoran.',
    offer: '%25 İndirim',
    couponCode: 'COLONY25',
    website: 'colonyhotel.com',
    phone: '+90 392 815 1234',
    location: 'Girne Merkez',
    category: 'Otel',
    validUntil: '31 Ocak 2026',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    bgGradient: 'from-emerald-900/90 to-teal-900/90',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    accentColor: '#14b8a6',
  },
  {
    id: 'merit',
    name: 'Merit Hotels',
    logo: '🎰',
    slogan: 'Lüksün Adresi',
    shortDesc: '5 yıldızlı konfor ve eğlence',
    fullDesc: 'KKTC\'nin en prestijli otel zinciri. Casino, spa, dünya mutfağı restoranları ve unutulmaz eğlence.',
    offer: 'Ücretsiz Spa Paketi',
    couponCode: 'MERITSPA',
    website: 'merithotels.com',
    phone: '+90 392 650 0500',
    location: 'Girne & Lefkoşa',
    category: 'Otel & Casino',
    validUntil: '28 Şubat 2026',
    gradient: 'from-purple-500 via-violet-500 to-indigo-500',
    bgGradient: 'from-purple-900/90 to-indigo-900/90',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    accentColor: '#8b5cf6',
  },
  {
    id: 'niazi',
    name: "Niazi's Restaurant",
    logo: '🍖',
    slogan: 'Efsanevi Kıbrıs Lezzetleri',
    shortDesc: '1949\'dan beri şeftali kebabı',
    fullDesc: 'Üç nesil boyunca aynı tariflerle hazırlanan otantik Kıbrıs mutfağı. Meşhur şeftali kebabımızı mutlaka deneyin.',
    offer: 'Tatlı İkramı',
    couponCode: 'NIAZI2025',
    website: 'niazis.com',
    phone: '+90 392 815 2160',
    location: 'Girne Limanı',
    category: 'Restoran',
    validUntil: '15 Mart 2026',
    gradient: 'from-orange-500 via-red-500 to-rose-500',
    bgGradient: 'from-orange-900/90 to-red-900/90',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    accentColor: '#f97316',
  },
  {
    id: 'cratos',
    name: 'Cratos Premium Hotel',
    logo: '👑',
    slogan: 'Premium Tatil Deneyimi',
    shortDesc: 'All-inclusive lüks tatil',
    fullDesc: 'Özel plaj, aquapark, 7 restoran ve gece kulübü. Aileler için çocuk kulübü ve animasyon.',
    offer: 'Çocuk Ücretsiz',
    couponCode: 'CRATOS2025',
    website: 'cratoshotel.com',
    phone: '+90 392 650 0000',
    location: 'Girne',
    category: 'Resort',
    validUntil: '30 Nisan 2026',
    gradient: 'from-amber-400 via-yellow-500 to-orange-400',
    bgGradient: 'from-amber-900/90 to-orange-900/90',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    accentColor: '#f59e0b',
  },
  {
    id: 'deniz-plaza',
    name: 'Deniz Plaza AVM',
    logo: '🛍️',
    slogan: 'Alışverişin Merkezi',
    shortDesc: 'Moda, teknoloji ve daha fazlası',
    fullDesc: 'KKTC\'nin en büyük alışveriş merkezi. 150+ mağaza, sinema, food court ve çocuk oyun alanı.',
    offer: "%40'a Varan İndirim",
    couponCode: 'DENIZ40',
    website: 'denizplaza.com',
    phone: '+90 392 228 5555',
    location: 'Lefkoşa',
    category: 'AVM',
    validUntil: '31 Ocak 2026',
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    bgGradient: 'from-blue-900/90 to-indigo-900/90',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570b5e2c0a?w=800',
    accentColor: '#3b82f6',
  },
  {
    id: 'telsim',
    name: 'Telsim',
    logo: '📱',
    slogan: 'Bağlantıda Kal',
    shortDesc: 'Turist SIM kartı anında aktif',
    fullDesc: 'KKTC\'de en geniş kapsama alanı. Turist paketleri ile sınırsız internet ve arama dakikaları.',
    offer: '10GB Ücretsiz Data',
    couponCode: 'TELSIM10',
    website: 'telsim.com.tr',
    phone: '+90 392 600 0000',
    location: 'Tüm KKTC',
    category: 'GSM',
    validUntil: '28 Şubat 2026',
    gradient: 'from-cyan-500 via-sky-500 to-blue-500',
    bgGradient: 'from-cyan-900/90 to-blue-900/90',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
    accentColor: '#06b6d4',
  },
  {
    id: 'lemar',
    name: 'Lemar Süpermarket',
    logo: '🛒',
    slogan: 'Her Şey Elinizin Altında',
    shortDesc: 'Taze ürünler, uygun fiyatlar',
    fullDesc: 'KKTC\'nin en büyük süpermarket zinciri. Online sipariş ile eve teslimat, taze meyve-sebze garantisi.',
    offer: '%15 Online İndirim',
    couponCode: 'LEMAR15',
    website: 'lemar.com.tr',
    phone: '+90 392 444 5363',
    location: 'Tüm KKTC',
    category: 'Market',
    validUntil: '15 Şubat 2026',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    bgGradient: 'from-green-900/90 to-emerald-900/90',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    accentColor: '#22c55e',
  },
  {
    id: 'golden-tulip',
    name: 'Golden Tulip Hotel',
    logo: '🌷',
    slogan: "Lefkoşa'nın Kalbinde",
    shortDesc: 'İş ve tatil için ideal konum',
    fullDesc: 'Lefkoşa merkezde modern otel. Toplantı salonları, fitness merkezi ve ücretsiz kahvaltı.',
    offer: 'Kahvaltı Dahil',
    couponCode: 'TULIP2025',
    website: 'goldentulip.com',
    phone: '+90 392 228 8888',
    location: 'Lefkoşa Merkez',
    category: 'Otel',
    validUntil: '15 Mart 2026',
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    bgGradient: 'from-pink-900/90 to-rose-900/90',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    accentColor: '#ec4899',
  },
  {
    id: 'dome',
    name: 'Dome Hotel',
    logo: '🏰',
    slogan: "Tarihi Girne Limanı'nda",
    shortDesc: 'Akdeniz manzaralı konaklama',
    fullDesc: 'Tarihi limana nazır ikonik otel. Deniz manzaralı odalar, teras restoran ve özel plaj.',
    offer: '%30 Erken Rezervasyon',
    couponCode: 'DOME30',
    website: 'domehotel.com',
    phone: '+90 392 815 2453',
    location: 'Girne Limanı',
    category: 'Otel',
    validUntil: '31 Mart 2026',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    bgGradient: 'from-amber-900/90 to-orange-900/90',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    accentColor: '#f59e0b',
  },
  {
    id: 'cafe-nero',
    name: 'Caffè Nero',
    logo: '☕',
    slogan: 'İtalyan Kahve Kültürü',
    shortDesc: 'En kaliteli espresso deneyimi',
    fullDesc: 'Özenle seçilmiş kahve çekirdekleri, taze pastalar ve sıcak atmosfer. KKTC\'nin her yerinde.',
    offer: '2. Kahve Hediye',
    couponCode: 'NERO2025',
    website: 'caffenero.com',
    phone: '',
    location: 'Girne & Lefkoşa',
    category: 'Kafe',
    validUntil: '28 Şubat 2026',
    gradient: 'from-slate-600 via-gray-700 to-slate-800',
    bgGradient: 'from-slate-900/95 to-gray-900/95',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
    accentColor: '#475569',
  },
];

// Reklam Detay Modalı - Premium Tasarım
const AdDetailModal = ({ 
  ad, 
  onClose 
}: { 
  ad: typeof kktcAds[0]; 
  onClose: () => void;
}) => (
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
      className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] shadow-2xl"
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
        <div className={`absolute inset-0 bg-gradient-to-t ${ad.bgGradient}`} />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/20"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        
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
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ad.accentColor}20` }}>
              <Clock className="w-5 h-5" style={{ color: ad.accentColor }} />
            </div>
            <span className="text-gray-700 text-sm">{ad.validUntil}'e kadar</span>
          </div>
        </div>
        
        {/* Offer & QR */}
        <div className={`bg-gradient-to-r ${ad.gradient} rounded-2xl p-6`}>
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

export const HeroScreen = ({ onStart, onWifiRequest, onGames }: HeroScreenProps) => {
  const [showJourney, setShowJourney] = useState(true);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showAdDetail, setShowAdDetail] = useState<typeof kktcAds[0] | null>(null);
  const [adProgress, setAdProgress] = useState(0);

  // 10 saniyede bir reklam değiştir
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          setCurrentAdIndex(i => (i + 1) % kktcAds.length);
          return 0;
        }
        return prev + 1;
      });
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, []);

  const handleExplore = () => {
    const hasSeenOnboarding = localStorage.getItem('tripOS_onboarding_done');
    if (!hasSeenOnboarding) {
      setShowInterestModal(true);
    } else {
      onStart([]);
    }
  };

  const handleInterestComplete = (interests: string[]) => {
    localStorage.setItem('tripOS_onboarding_done', 'true');
    setShowInterestModal(false);
    onStart(interests);
  };

  const handleSkipInterests = () => {
    localStorage.setItem('tripOS_onboarding_done', 'true');
    setShowInterestModal(false);
    onStart([]);
  };

  const handlePrevAd = () => {
    setCurrentAdIndex(prev => (prev - 1 + kktcAds.length) % kktcAds.length);
    setAdProgress(0);
  };

  const handleNextAd = () => {
    setCurrentAdIndex(prev => (prev + 1) % kktcAds.length);
    setAdProgress(0);
  };

  const currentAd = kktcAds[currentAdIndex];

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
        <div className={`absolute inset-0 bg-gradient-to-r ${currentAd.bgGradient}`} />
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
            <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10">
              <span className="text-white font-medium">14:30</span>
              <span className="text-white/50">|</span>
              <span className="text-white">28°C</span>
              <span className="text-lg">☀️</span>
            </div>
            
            <button 
              onClick={() => setShowJourney(!showJourney)}
              className={`p-3 rounded-2xl backdrop-blur-xl transition-all ${
                showJourney 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
              }`}
            >
              <Navigation className="w-5 h-5" />
            </button>
            
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
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentAd.gradient}`}>
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
            
            {/* Primary CTA */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button 
                onClick={handleExplore}
                className={`bg-gradient-to-r ${currentAd.gradient} text-white text-lg px-8 py-7 rounded-2xl shadow-2xl group w-full mb-4 border-none hover:opacity-90 transition-opacity`}
              >
                <span className="flex items-center justify-center gap-3">
                  Keşfetmeye Başla
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
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
            {/* Main Featured Ad */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAd.id}
                  className="absolute inset-0 rounded-[2rem] overflow-hidden cursor-pointer group"
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
                  <div className={`absolute inset-0 bg-gradient-to-t ${currentAd.bgGradient} opacity-80`} />
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
                        <Badge className="bg-white/20 backdrop-blur-xl text-white border-none px-4 py-2">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Sponsorlu
                        </Badge>
                        <Badge className="bg-black/30 backdrop-blur-xl text-white border-none px-4 py-2">
                          {currentAd.category}
                        </Badge>
                      </motion.div>
                      
                      {/* Progress indicator */}
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-sm">{currentAdIndex + 1}/{kktcAds.length}</span>
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
                          {currentAd.shortDesc}
                        </motion.p>
                        
                        <motion.div 
                          className="flex items-center gap-4"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${currentAd.gradient} text-white font-bold text-lg`}>
                            <Tag className="w-5 h-5" />
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
            
            {/* Ad Thumbnails - Premium Carousel */}
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {kktcAds.map((ad, index) => (
                <motion.div
                  key={ad.id}
                  className={`relative flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    index === currentAdIndex 
                      ? 'ring-2 ring-white shadow-lg scale-105' 
                      : 'opacity-50 hover:opacity-80'
                  }`}
                  onClick={() => { setCurrentAdIndex(index); setAdProgress(0); }}
                  whileHover={{ scale: index === currentAdIndex ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${ad.image})` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${ad.bgGradient} opacity-70`} />
                  <div className="absolute inset-0 flex items-center justify-center gap-2">
                    <span className="text-2xl">{ad.logo}</span>
                    {index === currentAdIndex && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
                      >
                        <Play className="w-3 h-3 text-white fill-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Journey Tracker */}
        <JourneyTracker isVisible={showJourney} onClose={() => setShowJourney(false)} />
        
        {/* Bottom Bar - Minimal */}
        <motion.div 
          className="flex items-center justify-center px-8 py-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-6 px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
            <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Rehberi Telefonuna Aktar</span>
            </button>
            <div className="w-px h-4 bg-white/20" />
            <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <span className="text-sm">🎧 Sesli Rehber</span>
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Interest Selector Modal */}
      {showInterestModal && (
        <InterestChipSelector 
          onComplete={handleInterestComplete}
          onSkip={handleSkipInterests}
        />
      )}
      
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