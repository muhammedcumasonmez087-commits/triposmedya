import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, X, Volume2, VolumeX, Maximize, Gift, Trophy, Star, Sparkles, Zap, Crown, Info, QrCode, Tag, MapPin, Clock, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import QRCode from 'react-qr-code';
import type { Game } from './GamesHub';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
  onHome: () => void;
}

type AdPhase = 'pre-roll' | 'playing' | 'mid-roll' | 'reward' | 'completed';

// KKTC'deki gerçek/aktif işletmeler ve markalar
const kktcSponsors = [
  {
    id: 'colony',
    name: 'Colony Garden',
    logo: '🏨',
    slogan: 'Girne\'nin En İyi Oteli',
    message: 'Lüks konaklama deneyimi. İlk rezervasyona %25 indirim!',
    color: 'from-emerald-600 via-emerald-700 to-teal-800',
    bgPattern: 'emerald',
    offer: '%25 İndirim',
    couponCode: 'COLONY25',
    website: 'colonyhotel.com',
    phone: '+90 392 815 1234',
    location: 'Girne, Kuzey Kıbrıs',
    category: 'Otel',
    validUntil: '31 Ocak 2026',
  },
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    logo: '🥤',
    slogan: 'Serinliğin Tadı',
    message: 'Her yudumda mutluluk! Yaz kampanyamızı kaçırma.',
    color: 'from-red-600 via-red-700 to-red-900',
    bgPattern: 'red',
    offer: '2 Al 1 Öde',
    couponCode: 'COLA2025',
    website: 'coca-cola.com.tr',
    phone: '',
    location: 'Tüm KKTC',
    category: 'İçecek',
    validUntil: '28 Şubat 2026',
  },
  {
    id: 'dome',
    name: 'Dome Hotel',
    logo: '🏰',
    slogan: 'Tarihi Girne Limanı\'nda',
    message: 'Akdeniz manzaralı unutulmaz bir konaklama. Erken rezervasyona özel fiyatlar!',
    color: 'from-amber-600 via-orange-600 to-amber-800',
    bgPattern: 'amber',
    offer: '%30 Erken Rezervasyon',
    couponCode: 'DOME30',
    website: 'domehotel.com',
    phone: '+90 392 815 2453',
    location: 'Girne Limanı',
    category: 'Otel',
    validUntil: '15 Mart 2026',
  },
  {
    id: 'deniz-plaza',
    name: 'Deniz Plaza',
    logo: '🛍️',
    slogan: 'Alışverişin Merkezi',
    message: 'Moda, teknoloji ve daha fazlası tek çatı altında. Kış indirimleri başladı!',
    color: 'from-blue-600 via-blue-700 to-indigo-800',
    bgPattern: 'blue',
    offer: '%40\'a Varan İndirim',
    couponCode: 'DENIZ40',
    website: 'denizplaza.com',
    phone: '+90 392 228 5555',
    location: 'Lefkoşa',
    category: 'AVM',
    validUntil: '31 Ocak 2026',
  },
  {
    id: 'niazi',
    name: 'Niazi\'s Restaurant',
    logo: '🍖',
    slogan: 'Efsanevi Kıbrıs Lezzetleri',
    message: '1949\'dan beri en lezzetli şeftali kebabı. Aile sofrasına özel menü!',
    color: 'from-orange-600 via-red-600 to-orange-800',
    bgPattern: 'orange',
    offer: 'Tatlı İkramı',
    couponCode: 'NIAZI2025',
    website: 'niazis.com',
    phone: '+90 392 815 2160',
    location: 'Girne',
    category: 'Restoran',
    validUntil: '28 Şubat 2026',
  },
  {
    id: 'lemar',
    name: 'Lemar',
    logo: '🛒',
    slogan: 'Her Şey Elinizin Altında',
    message: 'Taze ürünler, uygun fiyatlar. Online siparişe özel indirimler!',
    color: 'from-green-600 via-green-700 to-emerald-800',
    bgPattern: 'green',
    offer: '%15 Online İndirim',
    couponCode: 'LEMAR15',
    website: 'lemar.com.tr',
    phone: '+90 392 444 5363',
    location: 'Tüm KKTC',
    category: 'Market',
    validUntil: '15 Şubat 2026',
  },
  {
    id: 'merit',
    name: 'Merit Hotels',
    logo: '🎰',
    slogan: 'Lüksün Adresi',
    message: '5 yıldızlı konfor ve eğlence. Spa paketi hediye!',
    color: 'from-purple-600 via-purple-700 to-indigo-800',
    bgPattern: 'purple',
    offer: 'Ücretsiz Spa',
    couponCode: 'MERIT2025',
    website: 'merithotels.com',
    phone: '+90 392 650 0500',
    location: 'Girne & Lefkoşa',
    category: 'Otel & Casino',
    validUntil: '31 Mart 2026',
  },
  {
    id: 'cratos',
    name: 'Cratos Premium',
    logo: '👑',
    slogan: 'Premium Tatil Deneyimi',
    message: 'All-inclusive lüks tatil. Çocuklara özel aktiviteler!',
    color: 'from-yellow-500 via-amber-600 to-yellow-700',
    bgPattern: 'yellow',
    offer: 'Çocuk Ücretsiz',
    couponCode: 'CRATOS2025',
    website: 'cratoshotel.com',
    phone: '+90 392 650 0000',
    location: 'Girne',
    category: 'Resort',
    validUntil: '30 Nisan 2026',
  },
  {
    id: 'telsim',
    name: 'Telsim',
    logo: '📱',
    slogan: 'Bağlantıda Kal',
    message: 'Sınırsız internet paketleri. Turist SIM kartı anında aktif!',
    color: 'from-cyan-600 via-cyan-700 to-blue-800',
    bgPattern: 'cyan',
    offer: '10GB Ücretsiz',
    couponCode: 'TELSIM10',
    website: 'telsim.com.tr',
    phone: '+90 392 600 0000',
    location: 'Tüm KKTC',
    category: 'GSM',
    validUntil: '28 Şubat 2026',
  },
  {
    id: 'golden-tulip',
    name: 'Golden Tulip',
    logo: '🌷',
    slogan: 'Lefkoşa\'nın Kalbinde',
    message: 'İş ve tatil için ideal konum. Kahvaltı dahil konaklama!',
    color: 'from-pink-600 via-rose-600 to-pink-800',
    bgPattern: 'pink',
    offer: 'Kahvaltı Dahil',
    couponCode: 'TULIP2025',
    website: 'goldentulip.com',
    phone: '+90 392 228 8888',
    location: 'Lefkoşa Merkez',
    category: 'Otel',
    validUntil: '15 Mart 2026',
  },
];

const rewards = [
  { name: '%20 İndirim Kuponu', icon: '🎫', color: 'from-purple-500 to-pink-500' },
  { name: '2x Puan Bonusu', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  { name: 'Ücretsiz Kahve', icon: '☕', color: 'from-amber-600 to-amber-800' },
  { name: '50₺ Hediye Çeki', icon: '💳', color: 'from-green-500 to-emerald-600' },
  { name: 'VIP Üyelik (1 Hafta)', icon: '👑', color: 'from-yellow-400 to-amber-500' },
  { name: '%30 Yemek İndirimi', icon: '🍕', color: 'from-red-500 to-orange-500' },
];

// Floating particles component
const FloatingParticles = ({ count = 20, color = 'white' }: { count?: number; color?: string }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute w-2 h-2 rounded-full bg-${color}/30`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

// Confetti explosion component
const ConfettiExplosion = () => {
  const particles = useMemo(() => 
    [...Array(50)].map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      rotation: Math.random() * 720 - 360,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#F857A6', '#FF5E5B'][Math.floor(Math.random() * 6)],
      size: 8 + Math.random() * 12,
    })), []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-sm"
          style={{
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [1, 1, 0],
            rotate: p.rotation,
            scale: [0, 1, 0.5],
          }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

// Sponsor Banner Component - Her yerde aynı sponsor gösterilir
const SponsorBanner = ({ sponsor, position, onClick }: { 
  sponsor: typeof kktcSponsors[0]; 
  position: 'left' | 'right' | 'top' | 'bottom';
  onClick: () => void;
}) => {
  const isVertical = position === 'left' || position === 'right';
  
  return (
    <motion.div
      className={`absolute z-20 cursor-pointer ${
        position === 'left' ? 'left-0 top-20 bottom-20 w-24' :
        position === 'right' ? 'right-0 top-20 bottom-20 w-24' :
        position === 'top' ? 'top-16 left-28 right-28 h-16' :
        'bottom-0 left-28 right-28 h-20'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      onClick={onClick}
    >
      <div className={`w-full h-full bg-gradient-to-${isVertical ? 'b' : 'r'} ${sponsor.color} rounded-lg overflow-hidden relative`}>
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
        
        <div className={`relative h-full flex ${isVertical ? 'flex-col' : 'flex-row'} items-center justify-center gap-2 p-2`}>
          <span className={`${isVertical ? 'text-3xl' : 'text-2xl'}`}>{sponsor.logo}</span>
          
          {isVertical ? (
            <div className="flex flex-col items-center">
              <p className="text-white font-bold text-xs text-center leading-tight" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                {sponsor.name}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div>
                <p className="text-white font-bold text-sm">{sponsor.name}</p>
                <p className="text-white/80 text-xs">{sponsor.offer}</p>
              </div>
              <Badge className="bg-white/20 text-white text-xs shrink-0">
                <Info className="w-3 h-3 mr-1" />
                Detay
              </Badge>
            </div>
          )}
          
          {isVertical && (
            <Badge className="bg-white/20 text-white text-[10px] px-1 py-0.5">
              {sponsor.offer}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Sponsor Detail Modal
const SponsorDetailModal = ({ sponsor, onClose }: { sponsor: typeof kktcSponsors[0]; onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
    
    <motion.div
      className={`relative bg-gradient-to-br ${sponsor.color} rounded-3xl p-8 max-w-lg w-full shadow-2xl`}
      initial={{ scale: 0.8, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.8, y: 50 }}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>
      
      <div className="text-center mb-6">
        <motion.div 
          className="text-7xl mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {sponsor.logo}
        </motion.div>
        <h2 className="text-3xl font-black text-white mb-2">{sponsor.name}</h2>
        <p className="text-white/80">{sponsor.slogan}</p>
      </div>
      
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
        <p className="text-white text-lg mb-4">{sponsor.message}</p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-white/90">
            <MapPin className="w-5 h-5" />
            <span>{sponsor.location}</span>
          </div>
          {sponsor.phone && (
            <div className="flex items-center gap-3 text-white/90">
              <Phone className="w-5 h-5" />
              <span>{sponsor.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-white/90">
            <Globe className="w-5 h-5" />
            <span>{sponsor.website}</span>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <Clock className="w-5 h-5" />
            <span>Geçerlilik: {sponsor.validUntil}</span>
          </div>
        </div>
      </div>
      
      {/* Offer & QR */}
      <div className="bg-white rounded-2xl p-6 text-center">
        <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold mb-4 text-lg px-4 py-2">
          <Tag className="w-5 h-5 mr-2" />
          {sponsor.offer}
        </Badge>
        
        <div className="bg-white p-4 rounded-xl inline-block mb-4">
          <QRCode value={`https://tripos.app/coupon/${sponsor.couponCode}`} size={120} />
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-600 text-sm">Kupon Kodu:</p>
          <p className="text-2xl font-mono font-bold text-gray-900 bg-gray-100 rounded-lg py-2 px-4 inline-block">
            {sponsor.couponCode}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Bu kodu işletmede gösterin • {sponsor.validUntil}'e kadar geçerli
          </p>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export const GamePlayer = ({ game, onBack, onHome }: GamePlayerProps) => {
  const [phase, setPhase] = useState<AdPhase>('pre-roll');
  const [adProgress, setAdProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // Varsayılan mute
  const [score, setScore] = useState(0);
  const [showRewardOffer, setShowRewardOffer] = useState(false);
  const [earnedReward, setEarnedReward] = useState<typeof rewards[0] | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSponsorDetail, setShowSponsorDetail] = useState(false);

  // Her oyun için tek bir sponsor seç (tüm reklamlar aynı olacak)
  const gameSponsor = useMemo(() => {
    const index = Math.floor(Math.random() * kktcSponsors.length);
    return kktcSponsors[index];
  }, []);

  // Pre-roll ad timer
  useEffect(() => {
    if (phase === 'pre-roll') {
      const interval = setInterval(() => {
        setAdProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setPhase('playing');
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Mid-roll ad timer
  useEffect(() => {
    if (phase === 'mid-roll') {
      const interval = setInterval(() => {
        setAdProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setPhase('reward');
            return 100;
          }
          return prev + 2.5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Simulate game scoring
  useEffect(() => {
    if (phase === 'playing') {
      const interval = setInterval(() => {
        setScore(prev => prev + Math.floor(Math.random() * 50));
      }, 2000);

      // Show reward offer after 10 seconds
      const rewardTimer = setTimeout(() => {
        setShowRewardOffer(true);
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(rewardTimer);
      };
    }
  }, [phase]);

  const handleWatchRewardAd = () => {
    setShowRewardOffer(false);
    setPhase('mid-roll');
    setAdProgress(0);
  };

  const handleClaimReward = () => {
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    setEarnedReward(reward);
    setShowConfetti(true);
    setPhase('completed');
    setTimeout(() => setShowConfetti(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${gameSponsor.color} opacity-30`} />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Sponsor Banners - Oyun sırasında tüm kenarlarda aynı sponsor */}
      {phase === 'playing' && (
        <>
          <SponsorBanner sponsor={gameSponsor} position="left" onClick={() => setShowSponsorDetail(true)} />
          <SponsorBanner sponsor={gameSponsor} position="right" onClick={() => setShowSponsorDetail(true)} />
          <SponsorBanner sponsor={gameSponsor} position="bottom" onClick={() => setShowSponsorDetail(true)} />
        </>
      )}

      {/* Header */}
      <motion.div 
        className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={onHome}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <Home className="w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={onBack}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </motion.div>
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-xl">{game.name}</h2>
              {/* Game Sponsor Badge */}
              <Badge 
                className={`bg-gradient-to-r ${gameSponsor.color} text-white font-semibold cursor-pointer`}
                onClick={() => setShowSponsorDetail(true)}
              >
                {gameSponsor.logo} {gameSponsor.name} Sunuyor
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.div 
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-lg">{score.toLocaleString()}</span>
            </motion.div>
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Pre-roll Ad - Sponsor ile */}
      <AnimatePresence>
        {phase === 'pre-roll' && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gameSponsor.color}`} />
            <FloatingParticles count={30} />
            
            {/* Animated background pattern */}
            <motion.div 
              className="absolute inset-0"
              animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px',
              }}
            />
            
            <motion.div 
              className="relative text-center p-8 max-w-3xl"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
              >
                <Badge className="bg-white/20 text-white backdrop-blur-sm mb-6 px-6 py-2 text-lg">
                  SPONSOR REKLAM
                </Badge>
              </motion.div>
              
              <motion.div 
                className="text-[120px] mb-6 filter drop-shadow-2xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {gameSponsor.logo}
              </motion.div>
              
              <motion.h2 
                className="text-5xl font-black mb-4 text-shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {gameSponsor.name}
              </motion.h2>
              
              <motion.p 
                className="text-2xl text-white/90 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {gameSponsor.message}
              </motion.p>

              <motion.div
                className="mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <Badge className="bg-white text-gray-900 font-bold text-xl px-6 py-3">
                  <Tag className="w-5 h-5 mr-2" />
                  {gameSponsor.offer}
                </Badge>
              </motion.div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-white/80">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  <span className="text-lg">Oyun {Math.ceil((100 - adProgress) / 20)} saniye içinde başlıyor</span>
                </div>
                
                <div className="relative h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-white to-white/80 rounded-full"
                    style={{ width: `${adProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
                    style={{ backgroundSize: '200% 100%' }}
                  />
                </div>
              </div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4 justify-center mt-8"
              >
                <Button 
                  className="bg-white text-black hover:bg-white/90 font-bold px-8 py-6 text-lg rounded-2xl shadow-2xl"
                  onClick={() => setShowSponsorDetail(true)}
                >
                  <Info className="w-5 h-5 mr-2" />
                  Detayları Gör
                </Button>
                <Button 
                  className="bg-white/20 text-white hover:bg-white/30 font-bold px-8 py-6 text-lg rounded-2xl"
                  onClick={() => setShowSponsorDetail(true)}
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Kuponu Al
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mid-roll Reward Ad - Aynı sponsor ile */}
      <AnimatePresence>
        {phase === 'mid-roll' && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gameSponsor.color}`} />
            <FloatingParticles count={40} />
            
            <motion.div 
              className="relative text-center p-8 max-w-2xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring' }}
            >
              <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black mb-6 px-6 py-2 text-lg font-bold animate-pulse">
                🎁 {gameSponsor.name} ÖDÜL FIRSATI
              </Badge>
              
              <motion.div 
                className="text-[100px] mb-6"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {gameSponsor.logo}
              </motion.div>
              
              <h2 className="text-4xl font-black mb-4">{gameSponsor.offer}</h2>
              <p className="text-xl text-white/90 mb-8">
                {gameSponsor.message}
              </p>
              
              <div className="space-y-4">
                <div className="relative h-4 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-full"
                    style={{ width: `${adProgress}%` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" 
                    style={{ backgroundSize: '200% 100%' }}
                  />
                </div>
                <span className="text-white/80 text-lg">%{Math.round(adProgress)} tamamlandı</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Claim */}
      <AnimatePresence>
        {phase === 'reward' && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700" />
            <FloatingParticles count={50} />
            
            <motion.div 
              className="relative text-center p-8 max-w-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <motion.div 
                className="text-[140px] mb-6"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                🎉
              </motion.div>
              
              <h2 className="text-5xl font-black mb-4">Tebrikler!</h2>
              <p className="text-2xl text-white/90 mb-10">
                {gameSponsor.name} ödülünüzü kazandınız!
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleClaimReward}
                  className="bg-white text-emerald-700 hover:bg-white/90 text-xl px-12 py-8 rounded-2xl font-bold shadow-2xl"
                >
                  <Gift className="w-8 h-8 mr-3" />
                  Ödülü Al
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Completed */}
      <AnimatePresence>
        {phase === 'completed' && earnedReward && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${earnedReward.color}`} />
            {showConfetti && <ConfettiExplosion />}
            <FloatingParticles count={30} />
            
            <motion.div 
              className="relative text-center p-8 max-w-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <motion.div 
                className="text-[120px] mb-4"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                🏆
              </motion.div>
              
              <h2 className="text-5xl font-black mb-6">Ödülünüz Hazır!</h2>
              
              <motion.div 
                className="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/30"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div 
                  className="text-8xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {earnedReward.icon}
                </motion.div>
                <p className="text-3xl font-bold">{earnedReward.name}</p>
                <p className="text-white/80 mt-3 text-lg">
                  {gameSponsor.name} tarafından sunuldu
                </p>
                
                {/* QR Code for reward */}
                <div className="bg-white p-4 rounded-xl inline-block mt-4">
                  <QRCode value={`https://tripos.app/reward/${gameSponsor.couponCode}`} size={100} />
                </div>
                <p className="text-white/70 text-sm mt-2">Kod: {gameSponsor.couponCode}</p>
              </motion.div>
              
              <div className="flex gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => {
                      setPhase('playing');
                      setShowRewardOffer(false);
                    }}
                    className="bg-white text-gray-900 hover:bg-white/90 font-bold px-8 py-6 text-lg rounded-2xl"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Oyuna Dön
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={onBack}
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/20 font-bold px-8 py-6 text-lg rounded-2xl"
                  >
                    Oyunlara Git
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Area */}
      {phase === 'playing' && (
        <motion.div 
          className="relative h-screen flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center px-28">
            <motion.img
              src={game.thumbnail}
              alt={game.name}
              className="w-[500px] h-[320px] object-cover rounded-3xl mb-8 shadow-2xl mx-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
              style={{ boxShadow: '0 25px 80px -20px rgba(168, 85, 247, 0.5)' }}
            />
            <h2 className="text-4xl font-bold mb-4">{game.name}</h2>
            <p className="text-white/60 mb-6">
              Oyun simülasyonu aktif - Gerçek oyun entegrasyonu için API gerekli
            </p>
            <motion.div 
              className="flex items-center justify-center gap-3"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
              <span className="text-green-400 font-medium text-lg">Oyun Aktif</span>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Reward Offer Popup */}
      <AnimatePresence>
        {showRewardOffer && phase === 'playing' && (
          <motion.div 
            className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30"
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div 
              className={`bg-gradient-to-r ${gameSponsor.color} rounded-3xl p-5 shadow-2xl max-w-md border border-white/20`}
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(168, 85, 247, 0.3)',
                  '0 0 40px rgba(168, 85, 247, 0.5)',
                  '0 0 20px rgba(168, 85, 247, 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  className="text-5xl"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {gameSponsor.logo}
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-1">{gameSponsor.name} Ödülü!</h3>
                  <p className="text-sm text-white/80 mb-4">
                    {gameSponsor.offer} - Kısa reklamı izleyerek kazan!
                  </p>
                  <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleWatchRewardAd}
                        size="sm"
                        className="bg-white text-gray-900 hover:bg-white/90 font-bold rounded-xl"
                      >
                        <Gift className="w-4 h-4 mr-1" />
                        İzle & Kazan
                      </Button>
                    </motion.div>
                    <Button
                      onClick={() => setShowRewardOffer(false)}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 rounded-xl"
                    >
                      Sonra
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sponsor Detail Modal */}
      <AnimatePresence>
        {showSponsorDetail && (
          <SponsorDetailModal 
            sponsor={gameSponsor} 
            onClose={() => setShowSponsorDetail(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamePlayer;
