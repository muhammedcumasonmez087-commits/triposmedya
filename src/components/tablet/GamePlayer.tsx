import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, X, Volume2, VolumeX, Maximize, Gift, Trophy, Star, Sparkles, Zap, Crown, Info, QrCode, Tag, MapPin, Clock, Phone, Globe, Play, Pause, ChevronRight } from 'lucide-react';
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
    accentColor: '#059669',
    offer: '%25 İndirim',
    couponCode: 'COLONY25',
    website: 'colonyhotel.com',
    phone: '+90 392 815 1234',
    location: 'Girne, Kuzey Kıbrıs',
    category: 'Otel',
    validUntil: '31 Ocak 2026',
    promoImages: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400',
    ],
  },
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    logo: '🥤',
    slogan: 'Serinliğin Tadı',
    message: 'Her yudumda mutluluk! Yaz kampanyamızı kaçırma.',
    color: 'from-red-600 via-red-700 to-red-900',
    accentColor: '#dc2626',
    offer: '2 Al 1 Öde',
    couponCode: 'COLA2025',
    website: 'coca-cola.com.tr',
    phone: '',
    location: 'Tüm KKTC',
    category: 'İçecek',
    validUntil: '28 Şubat 2026',
    promoImages: [
      'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
      'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    ],
  },
  {
    id: 'merit',
    name: 'Merit Hotels',
    logo: '🎰',
    slogan: 'Lüksün Adresi',
    message: '5 yıldızlı konfor ve eğlence. Spa paketi hediye!',
    color: 'from-purple-600 via-purple-700 to-indigo-800',
    accentColor: '#7c3aed',
    offer: 'Ücretsiz Spa',
    couponCode: 'MERIT2025',
    website: 'merithotels.com',
    phone: '+90 392 650 0500',
    location: 'Girne & Lefkoşa',
    category: 'Otel & Casino',
    validUntil: '31 Mart 2026',
    promoImages: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
    ],
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

// Interactive Sponsor Panel - Sağ tarafta yaratıcı reklam paneli
const SponsorPanel = ({ sponsor, onShowDetail }: { 
  sponsor: typeof kktcSponsors[0]; 
  onShowDetail: () => void;
}) => {
  const [activePromo, setActivePromo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromo(prev => (prev + 1) % sponsor.promoImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sponsor.promoImages.length]);

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      {/* Sponsor Header */}
      <div className={`bg-gradient-to-r ${sponsor.color} p-6 rounded-t-3xl`}>
        <div className="flex items-center gap-4">
          <motion.div 
            className="text-5xl"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {sponsor.logo}
          </motion.div>
          <div>
            <Badge className="bg-white/20 text-white text-xs mb-1">Sponsorlu</Badge>
            <h3 className="text-white font-bold text-xl">{sponsor.name}</h3>
            <p className="text-white/70 text-sm">{sponsor.slogan}</p>
          </div>
        </div>
      </div>

      {/* Promo Image Slider */}
      <div className="relative aspect-video overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePromo}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${sponsor.promoImages[activePromo]})` }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
        <div className={`absolute inset-0 bg-gradient-to-t ${sponsor.color} opacity-30`} />
        
        {/* Image indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {sponsor.promoImages.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === activePromo ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Offer Card */}
      <div className="flex-1 bg-gradient-to-b from-gray-900 to-black p-6 flex flex-col">
        <motion.div
          className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-4 mb-4 text-center"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-black/70 text-xs font-medium mb-1">ÖZEL TEKLİF</p>
          <p className="text-black font-black text-2xl">{sponsor.offer}</p>
        </motion.div>

        <p className="text-white/80 text-sm mb-4 flex-1">
          {sponsor.message}
        </p>

        {/* Mini QR */}
        <div className="bg-white rounded-xl p-3 mb-4">
          <div className="flex items-center gap-3">
            <QRCode value={`https://tripos.app/coupon/${sponsor.couponCode}`} size={60} />
            <div className="flex-1">
              <p className="text-gray-500 text-xs">Kupon Kodu</p>
              <p className="font-mono font-bold text-gray-900">{sponsor.couponCode}</p>
              <p className="text-gray-400 text-xs">{sponsor.validUntil}'e kadar</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          className={`w-full bg-gradient-to-r ${sponsor.color} text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onShowDetail}
        >
          <Info className="w-5 h-5" />
          Detayları Gör
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Bottom Banner */}
      <div className={`bg-gradient-to-r ${sponsor.color} p-3 rounded-b-3xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-white/70" />
            <span className="text-white/90 text-sm">{sponsor.location}</span>
          </div>
          <motion.div
            className="flex items-center gap-1 text-white/80 text-xs"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400" />
            CANLI
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export const GamePlayer = ({ game, onBack, onHome }: GamePlayerProps) => {
  const [phase, setPhase] = useState<AdPhase>('pre-roll');
  const [adProgress, setAdProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [score, setScore] = useState(0);
  const [showRewardOffer, setShowRewardOffer] = useState(false);
  const [earnedReward, setEarnedReward] = useState<typeof rewards[0] | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSponsorDetail, setShowSponsorDetail] = useState(false);

  // Her oyun için tek bir sponsor seç
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
      {/* Background */}
      <div className="fixed inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${gameSponsor.color} opacity-20`} />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900" />
      </div>

      {/* Pre-roll Full Screen Ad */}
      <AnimatePresence>
        {phase === 'pre-roll' && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gameSponsor.color}`} />
            
            <motion.div 
              className="relative text-center p-8 max-w-3xl"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
            >
              <Badge className="bg-white/20 text-white backdrop-blur-sm mb-6 px-6 py-2 text-lg">
                SPONSOR REKLAM
              </Badge>
              
              <motion.div 
                className="text-[120px] mb-6 filter drop-shadow-2xl"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {gameSponsor.logo}
              </motion.div>
              
              <h2 className="text-5xl font-black mb-4">{gameSponsor.name}</h2>
              <p className="text-2xl text-white/90 mb-6">{gameSponsor.message}</p>

              <Badge className="bg-white text-gray-900 font-bold text-xl px-6 py-3 mb-8">
                <Tag className="w-5 h-5 mr-2" />
                {gameSponsor.offer}
              </Badge>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-white/80">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span className="text-lg">Oyun {Math.ceil((100 - adProgress) / 20)} saniye içinde başlıyor</span>
                </div>
                
                <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-white rounded-full"
                    style={{ width: `${adProgress}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-center mt-8">
                <Button 
                  className="bg-white text-black hover:bg-white/90 font-bold px-8 py-6 text-lg rounded-2xl"
                  onClick={() => setShowSponsorDetail(true)}
                >
                  <Info className="w-5 h-5 mr-2" />
                  Detayları Gör
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Game Layout - Split View */}
      {phase === 'playing' && (
        <div className="fixed inset-0 flex">
          {/* Left Side - Game Area (70%) */}
          <div className="w-[70%] relative flex flex-col">
            {/* Game Header */}
            <div className="bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button onClick={onHome} variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                    <Home className="w-5 h-5" />
                  </Button>
                  <Button onClick={onBack} variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                    <X className="w-5 h-5" />
                  </Button>
                  <h2 className="font-bold text-xl">{game.name}</h2>
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
                  <Button onClick={() => setIsMuted(!isMuted)} variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Game Content */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="relative w-full max-w-2xl aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <div className={`absolute inset-0 bg-gradient-to-br ${gameSponsor.color} opacity-10`} />
                
                {/* Game Simulation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div 
                      className="text-8xl mb-6"
                      animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🎮
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                    <p className="text-white/60">Oyun simülasyonu aktif</p>
                    
                    {/* Animated game elements */}
                    <div className="mt-8 flex justify-center gap-4">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: gameSponsor.accentColor }}
                          animate={{
                            y: [0, -30, 0],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sponsor Watermark */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur rounded-full px-3 py-1.5">
                  <span className="text-lg">{gameSponsor.logo}</span>
                  <span className="text-white/70 text-xs">{gameSponsor.name} Sunuyor</span>
                </div>
              </div>
            </div>

            {/* Reward Offer Popup */}
            <AnimatePresence>
              {showRewardOffer && (
                <motion.div
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                >
                  <div className={`bg-gradient-to-r ${gameSponsor.color} rounded-2xl p-6 shadow-2xl`}>
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="text-4xl"
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        🎁
                      </motion.div>
                      <div>
                        <h4 className="text-white font-bold text-lg">Ödül Kazanmak İster misin?</h4>
                        <p className="text-white/70 text-sm">{gameSponsor.name}'dan özel teklif!</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="bg-white text-black hover:bg-white/90"
                          onClick={handleWatchRewardAd}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          İzle
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="text-white hover:bg-white/20"
                          onClick={() => setShowRewardOffer(false)}
                        >
                          Atla
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side - Sponsor Panel (30%) */}
          <div className="w-[30%] bg-black/50 backdrop-blur-xl p-4">
            <SponsorPanel sponsor={gameSponsor} onShowDetail={() => setShowSponsorDetail(true)} />
          </div>
        </div>
      )}

      {/* Mid-roll Reward Ad */}
      <AnimatePresence>
        {phase === 'mid-roll' && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gameSponsor.color}`} />
            
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
                animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {gameSponsor.logo}
              </motion.div>
              
              <h2 className="text-4xl font-black mb-4">{gameSponsor.offer}</h2>
              <p className="text-xl text-white/90 mb-8">{gameSponsor.message}</p>
              
              <div className="space-y-4">
                <div className="relative h-4 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-full"
                    style={{ width: `${adProgress}%` }}
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
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700" />
            
            <motion.div 
              className="relative text-center p-8 max-w-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <motion.div 
                className="text-[140px] mb-6"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                🎉
              </motion.div>
              
              <h2 className="text-5xl font-black mb-4">Tebrikler!</h2>
              <p className="text-2xl text-white/90 mb-10">
                {gameSponsor.name} ödülünüzü kazandınız!
              </p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleClaimReward}
                  className="bg-white text-black hover:bg-white/90 text-2xl px-12 py-8 rounded-2xl shadow-2xl font-black"
                >
                  <Gift className="w-8 h-8 mr-3" />
                  Ödülü Al
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed / Earned Reward */}
      <AnimatePresence>
        {phase === 'completed' && earnedReward && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${earnedReward.color}`} />
            {showConfetti && <ConfettiExplosion />}
            
            <motion.div 
              className="relative text-center p-8 max-w-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <motion.div 
                className="text-[120px] mb-6"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {earnedReward.icon}
              </motion.div>
              
              <h2 className="text-5xl font-black mb-4">{earnedReward.name}</h2>
              <p className="text-xl text-white/90 mb-8">
                {gameSponsor.name} size bu ödülü hediye etti!
              </p>

              <div className="bg-white rounded-2xl p-6 mb-8 inline-block">
                <QRCode value={`https://tripos.app/reward/${gameSponsor.couponCode}`} size={150} />
                <p className="text-gray-600 text-sm mt-2">{gameSponsor.couponCode}</p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white px-8 py-6 text-lg rounded-xl">
                  Oyunlara Dön
                </Button>
                <Button onClick={onHome} className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg rounded-xl">
                  Ana Sayfa
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sponsor Detail Modal */}
      <AnimatePresence>
        {showSponsorDetail && (
          <SponsorDetailModal sponsor={gameSponsor} onClose={() => setShowSponsorDetail(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};