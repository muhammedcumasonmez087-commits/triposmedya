import { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Wifi, Gamepad2, Navigation, Globe, X, Tag, Clock, Phone, QrCode, ChevronLeft, Info } from 'lucide-react';
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
    color: 'from-emerald-600 to-teal-700',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
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
    color: 'from-purple-600 to-indigo-700',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
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
    color: 'from-orange-600 to-red-700',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
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
    color: 'from-yellow-500 to-amber-600',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
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
    color: 'from-blue-600 to-indigo-700',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570b5e2c0a?w=800',
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
    color: 'from-cyan-600 to-blue-700',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
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
    color: 'from-green-600 to-emerald-700',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
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
    color: 'from-pink-600 to-rose-700',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
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
    color: 'from-amber-600 to-orange-700',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
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
    color: 'from-gray-800 to-gray-900',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
  },
];

// Sponsor Reklam Kartı Bileşeni
const SponsorAdCard = ({ 
  ad, 
  isActive, 
  onShowDetail 
}: { 
  ad: typeof kktcAds[0]; 
  isActive: boolean;
  onShowDetail: () => void;
}) => (
  <motion.div
    className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
      isActive ? 'ring-4 ring-white/50 shadow-2xl scale-100' : 'opacity-60 scale-95'
    }`}
    onClick={onShowDetail}
    whileHover={{ scale: isActive ? 1.02 : 0.98 }}
    whileTap={{ scale: 0.95 }}
  >
    {/* Background Image */}
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${ad.image})` }}
    />
    <div className={`absolute inset-0 bg-gradient-to-t ${ad.color} opacity-80`} />
    
    {/* Content */}
    <div className="relative p-5 h-full flex flex-col justify-between min-h-[180px]">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-white/20 text-white text-xs">
            Sponsorlu
          </Badge>
          <span className="text-3xl">{ad.logo}</span>
        </div>
        <h3 className="text-white font-bold text-lg mb-1">{ad.name}</h3>
        <p className="text-white/80 text-sm">{ad.shortDesc}</p>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <Badge className="bg-white text-gray-900 font-bold">
          <Tag className="w-3 h-3 mr-1" />
          {ad.offer}
        </Badge>
        <button className="flex items-center gap-1 text-white text-sm font-medium hover:underline">
          <Info className="w-4 h-4" />
          Detay
        </button>
      </div>
    </div>
  </motion.div>
);

// Reklam Detay Modalı
const AdDetailModal = ({ 
  ad, 
  onClose 
}: { 
  ad: typeof kktcAds[0]; 
  onClose: () => void;
}) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
    
    <motion.div
      className="relative bg-card rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
      initial={{ scale: 0.8, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.8, y: 50 }}
    >
      {/* Header Image */}
      <div className="relative h-48">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${ad.image})` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${ad.color} opacity-70`} />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center hover:bg-black/50 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        
        <div className="absolute bottom-4 left-4 right-4">
          <Badge className="bg-white/20 text-white mb-2">
            {ad.category}
          </Badge>
          <h2 className="text-2xl font-black text-white">{ad.name}</h2>
          <p className="text-white/80">{ad.slogan}</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <p className="text-muted-foreground mb-6">{ad.fullDesc}</p>
        
        {/* Info Grid */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{ad.location}</span>
          </div>
          {ad.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span>{ad.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span>Geçerlilik: {ad.validUntil}</span>
          </div>
        </div>
        
        {/* Offer & QR */}
        <div className={`bg-gradient-to-r ${ad.color} rounded-2xl p-6 text-center`}>
          <Badge className="bg-white text-gray-900 font-bold mb-4 text-lg px-4 py-2">
            <Tag className="w-5 h-5 mr-2" />
            {ad.offer}
          </Badge>
          
          <div className="bg-white p-4 rounded-xl inline-block mb-4">
            <QRCode value={`https://tripos.app/coupon/${ad.couponCode}`} size={120} />
          </div>
          
          <div className="space-y-2">
            <p className="text-white/80 text-sm">Kupon Kodu:</p>
            <p className="text-xl font-mono font-bold text-white bg-white/20 rounded-lg py-2 px-4 inline-block">
              {ad.couponCode}
            </p>
            <p className="text-white/70 text-xs mt-2">
              Bu kodu işletmede gösterin
            </p>
            <p className="text-white/60 text-xs">
              tripos.app/c/{ad.couponCode.toLowerCase()}
            </p>
          </div>
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

  // 10 saniyede bir reklam değiştir
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % kktcAds.length);
    }, 10000);
    
    return () => clearInterval(interval);
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
  };

  const handleNextAd = () => {
    setCurrentAdIndex(prev => (prev + 1) % kktcAds.length);
  };

  const currentAd = kktcAds[currentAdIndex];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-card/90 backdrop-blur flex items-center justify-center shadow-lg">
              <span className="text-primary font-bold text-xl">K</span>
            </div>
            <div>
              <h1 className="font-bold text-card text-xl">Kuzey Kıbrıs</h1>
              <p className="text-xs text-card/80">KEŞİF REHBERİ</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/20 backdrop-blur-md">
              <span className="text-card/90 text-sm font-medium">14:30</span>
            </div>
            
            <button 
              onClick={() => setShowJourney(!showJourney)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md text-sm transition-all ${
                showJourney 
                  ? 'bg-green-500 text-white' 
                  : 'bg-card/20 text-card hover:bg-card/30'
              }`}
            >
              <Navigation className="w-4 h-4" />
              {showJourney && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-card/20 backdrop-blur-md text-card text-sm hover:bg-card/30 transition-all">
              <Globe className="w-4 h-4" />
              <span>TR</span>
            </button>
          </div>
        </header>
        
        {/* Main Content - Two Column Layout */}
        <div className="flex-1 flex px-8 gap-6">
          {/* Left Column - Welcome & CTA (30%) */}
          <div className="w-[30%] flex flex-col justify-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-highlight/90 text-highlight-foreground text-sm font-medium mb-6 w-fit animate-bounce-soft">
              HOŞ GELDİNİZ
            </span>
            
            <h2 className="text-4xl font-bold text-card mb-4 leading-tight">
              Akdeniz'in İncisini
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
                Keşfetmeye Başla
              </span>
            </h2>
            
            <p className="text-card/80 text-base max-w-md mb-8">
              Tarihi dokusu, eşsiz plajları ve lezzet duraklarıyla Kuzey Kıbrıs sizi bekliyor.
            </p>
            
            {/* Primary CTA */}
            <Button 
              onClick={handleExplore}
              className="btn-primary-gradient text-lg px-10 py-6 rounded-2xl shadow-elevated group w-fit mb-4"
            >
              <span className="flex items-center gap-3">
                Keşfet
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            
            {/* Secondary CTAs */}
            <div className="flex items-center gap-3">
              <button 
                onClick={onWifiRequest}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 backdrop-blur text-foreground text-sm font-medium hover:bg-card transition-all shadow-lg"
              >
                <Wifi className="w-4 h-4 text-primary" />
                <span>Free WiFi</span>
              </button>
              
              <button 
                onClick={onGames}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 backdrop-blur text-foreground text-sm font-medium hover:bg-card transition-all shadow-lg"
              >
                <Gamepad2 className="w-4 h-4 text-purple-500" />
                <span>Oyun</span>
              </button>
            </div>
          </div>
          
          {/* Right Column - Sponsor Ads (70%) */}
          <div className="w-[70%] flex flex-col justify-center">
            {/* Main Ad Card */}
            <div className="relative mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAd.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="relative rounded-3xl overflow-hidden cursor-pointer shadow-2xl"
                  onClick={() => setShowAdDetail(currentAd)}
                >
                  {/* Background */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${currentAd.image})` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${currentAd.color} opacity-75`} />
                  
                  {/* Content */}
                  <div className="relative p-8 min-h-[280px] flex items-center">
                    <div className="flex-1">
                      <Badge className="bg-white/20 text-white mb-4">
                        Sponsorlu Reklam
                      </Badge>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-6xl">{currentAd.logo}</span>
                        <div>
                          <h3 className="text-3xl font-black text-white">{currentAd.name}</h3>
                          <p className="text-white/80 text-lg">{currentAd.slogan}</p>
                        </div>
                      </div>
                      
                      <p className="text-white/90 text-lg mb-6 max-w-lg">
                        {currentAd.shortDesc}
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <Badge className="bg-white text-gray-900 font-bold text-lg px-4 py-2">
                          <Tag className="w-5 h-5 mr-2" />
                          {currentAd.offer}
                        </Badge>
                        
                        <Button 
                          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAdDetail(currentAd);
                          }}
                        >
                          <Info className="w-4 h-4 mr-2" />
                          Detayları Gör
                        </Button>
                        
                        <Button 
                          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAdDetail(currentAd);
                          }}
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Kuponu Al
                        </Button>
                      </div>
                    </div>
                    
                    {/* Mini QR Preview */}
                    <div className="bg-white p-3 rounded-xl shadow-lg ml-4">
                      <QRCode value={`https://tripos.app/coupon/${currentAd.couponCode}`} size={80} />
                      <p className="text-center text-xs text-gray-600 mt-1">{currentAd.couponCode}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation Arrows */}
              <button 
                onClick={handlePrevAd}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button 
                onClick={handleNextAd}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {/* Ad Thumbnails - Scrollable */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {kktcAds.map((ad, index) => (
                <motion.div
                  key={ad.id}
                  className={`flex-shrink-0 w-32 h-20 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    index === currentAdIndex 
                      ? 'ring-2 ring-white shadow-lg scale-105' 
                      : 'opacity-60 hover:opacity-80'
                  }`}
                  onClick={() => setCurrentAdIndex(index)}
                  whileHover={{ scale: index === currentAdIndex ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div 
                    className="w-full h-full bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${ad.image})` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-t ${ad.color} opacity-60`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">{ad.logo}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {kktcAds.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentAdIndex 
                      ? 'w-8 bg-white' 
                      : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Journey Tracker */}
        <JourneyTracker isVisible={showJourney} onClose={() => setShowJourney(false)} />
        
        {/* Bottom Bar */}
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/90 backdrop-blur cursor-pointer hover:bg-primary transition-colors">
            <div className="w-8 h-8 rounded-lg bg-card/20 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-primary-foreground/70">TELEFONA AKTAR</p>
              <p className="text-sm font-semibold text-primary-foreground">Rehberi Yanına Al</p>
            </div>
          </div>
          
          <div className="text-center text-card">
            <p className="text-3xl font-bold">28°</p>
            <p className="text-xs text-card/70">Güneş, Parçalı Bulutlu</p>
          </div>
          
          <div className="w-12 h-12 rounded-full bg-card/20 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-card/30 transition-colors">
            <span className="text-card text-xl">🎧</span>
          </div>
        </div>
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
