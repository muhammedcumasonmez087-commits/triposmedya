import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { 
  X, Heart, ChevronRight, Sparkles, Home, Crown, Medal, Award, 
  Gift, Star, Tag, QrCode, ArrowRight, Zap, TrendingUp, Play,
  Waves, Utensils, Moon, Landmark, Mountain, ShoppingBag, Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import QRCode from 'react-qr-code';
import categoryBeach from '@/assets/category-beach.jpg';
import categoryHistory from '@/assets/category-history.jpg';
import categoryFood from '@/assets/category-food.jpg';
import categoryNightlife from '@/assets/category-nightlife.jpg';
import categoryNature from '@/assets/category-nature.jpg';
import categoryShopping from '@/assets/category-shopping.jpg';
import { 
  contextualAds, 
  getContextualAds, 
  tierConfig, 
  SponsorBadge, 
  AdCard, 
  AdDetailModal,
  ContextualAd 
} from './ContextualAdEngine';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  gradient: string;
  icon: React.ReactNode;
  sponsorCount: number;
}

const categories: Category[] = [
  { 
    id: 'beach', 
    name: 'Deniz & Plaj', 
    description: 'Kristal berrak sularda yüzün',
    image: categoryBeach,
    gradient: 'from-cyan-400/80 via-blue-500/60 to-transparent',
    icon: <Waves className="w-8 h-8" />,
    sponsorCount: 4,
  },
  { 
    id: 'history', 
    name: 'Tarihi & Kültürel', 
    description: 'Antik kaleler ve müzeler keşfedin',
    image: categoryHistory,
    gradient: 'from-amber-500/80 via-orange-400/60 to-transparent',
    icon: <Landmark className="w-8 h-8" />,
    sponsorCount: 3,
  },
  { 
    id: 'food', 
    name: 'Yeme & İçme', 
    description: 'Akdeniz lezzetlerinin tadını çıkarın',
    image: categoryFood,
    gradient: 'from-red-400/80 via-pink-500/60 to-transparent',
    icon: <Utensils className="w-8 h-8" />,
    sponsorCount: 6,
  },
  { 
    id: 'nightlife', 
    name: 'Gece Hayatı', 
    description: 'Gün doğana kadar eğlenin',
    image: categoryNightlife,
    gradient: 'from-purple-500/80 via-pink-500/60 to-transparent',
    icon: <Moon className="w-8 h-8" />,
    sponsorCount: 3,
  },
  { 
    id: 'nature', 
    name: 'Doğa & Macera', 
    description: 'Dağları ve vadileri keşfedin',
    image: categoryNature,
    gradient: 'from-green-500/80 via-emerald-400/60 to-transparent',
    icon: <Mountain className="w-8 h-8" />,
    sponsorCount: 2,
  },
  { 
    id: 'shopping', 
    name: 'Alışveriş', 
    description: 'Butik mağazaları ve pazarları gezin',
    image: categoryShopping,
    gradient: 'from-rose-400/80 via-fuchsia-500/60 to-transparent',
    icon: <ShoppingBag className="w-8 h-8" />,
    sponsorCount: 4,
  },
];

interface ExploreScreenProps {
  onComplete: (selected: string[]) => void;
  onHome: () => void;
}

// Swipe Kart Komponenti
interface SwipeCardProps {
  category: Category;
  onSwipe: (direction: 'left' | 'right') => void;
  isAnimating: boolean;
  relevantAds: ContextualAd[];
}

const SwipeCard = ({ category, onSwipe, isAnimating, relevantAds }: SwipeCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    }
  };

  // Bu kategoriye ait sponsor reklamları
  const categoryAds = relevantAds.slice(0, 3);
  const platinumAd = categoryAds.find(ad => ad.tier === 'platinum');
  const goldAds = categoryAds.filter(ad => ad.tier === 'gold').slice(0, 2);

  return (
    <motion.div
      style={{ x, rotate }}
      drag={!isAnimating ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      className="absolute inset-0 rounded-3xl overflow-hidden shadow-elevated cursor-grab"
    >
      {/* Image */}
      <img 
        src={category.image} 
        alt={category.name}
        className="w-full h-full object-cover"
        draggable={false}
      />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      
      {/* NOPE Indicator */}
      <motion.div 
        style={{ opacity: nopeOpacity }}
        className="absolute top-8 left-8 px-4 py-2 rounded-xl bg-red-500/90 text-white font-bold text-lg border-4 border-white transform -rotate-12"
      >
        GEÇ
      </motion.div>
      
      {/* LIKE Indicator */}
      <motion.div 
        style={{ opacity: likeOpacity }}
        className="absolute top-8 right-8 px-4 py-2 rounded-xl bg-green-500/90 text-white font-bold text-lg border-4 border-white transform rotate-12"
      >
        İLGİLENİYORUM
      </motion.div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {/* Category Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white">
            {category.icon}
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white drop-shadow-lg">
              {category.name}
            </h3>
            <p className="text-lg text-white/80 drop-shadow-md">
              {category.description}
            </p>
          </div>
        </div>

        {/* Sponsor Preview */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-white/70 text-sm font-medium">Bu kategoride {category.sponsorCount} sponsor teklifi</span>
          </div>

          <div className="flex gap-2">
            {platinumAd && (
              <div className="flex-1 flex items-center gap-2 p-2 rounded-lg bg-purple-500/20 border border-purple-400/30">
                <Crown className="w-4 h-4 text-purple-400" />
                <span className="text-white text-sm font-medium truncate">{platinumAd.name}</span>
              </div>
            )}
            {goldAds.map((ad, i) => (
              <div key={ad.id} className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/20 border border-amber-400/30">
                <Medal className="w-4 h-4 text-amber-400" />
                <span className="text-white text-sm font-medium truncate">{ad.logo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Ana Keşif Ekranı
export const ExploreScreen = ({ onComplete, onHome }: ExploreScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [personalizedAds, setPersonalizedAds] = useState<ContextualAd[]>([]);
  const [selectedAd, setSelectedAd] = useState<ContextualAd | null>(null);
  const [countdown, setCountdown] = useState(5);

  const currentCategory = categories[currentIndex];
  const isComplete = currentIndex >= categories.length;

  // Kişiselleştirilmiş reklamları hesapla
  useEffect(() => {
    if (isComplete && selectedInterests.length > 0) {
      const ads = getContextualAds(selectedInterests);
      const allAds = [...ads.platinum, ...ads.gold, ...ads.bronze];
      setPersonalizedAds(allAds);
    }
  }, [isComplete, selectedInterests]);

  // Completion countdown
  useEffect(() => {
    if (showCompletionScreen && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showCompletionScreen, countdown]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating || isComplete) return;
    
    setIsAnimating(true);
    setExitDirection(direction);
    
    if (direction === 'right') {
      setSelectedInterests(prev => [...prev, currentCategory.id]);
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setExitDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleComplete = () => {
    onComplete(selectedInterests);
  };

  // Kategori için ilgili reklamları al
  const getRelevantAdsForCategory = (categoryId: string) => {
    return contextualAds.filter(ad => ad.categories.includes(categoryId));
  };

  // Completion Screen
  if (isComplete) {
    if (!showCompletionScreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900"
              animate={{
                background: [
                  'linear-gradient(135deg, #581c87, #5b21b6, #312e81)',
                  'linear-gradient(135deg, #312e81, #581c87, #5b21b6)',
                  'linear-gradient(135deg, #5b21b6, #312e81, #581c87)',
                ],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -50, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative text-center px-8 max-w-lg"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative w-32 h-32 mx-auto mb-8"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-50" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-white text-lg">✓</span>
              </motion.div>
            </motion.div>

            <motion.h2 
              className="text-4xl font-black text-white mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Mükemmel Seçim!
            </motion.h2>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {selectedInterests.length > 0 ? (
                <div className="mb-6">
                  <p className="text-white/70 mb-4">
                    {selectedInterests.length} ilgi alanı seçtiniz
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selectedInterests.map(interest => {
                      const cat = categories.find(c => c.id === interest);
                      return (
                        <span 
                          key={interest}
                          className="px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white text-sm font-medium border border-white/20"
                        >
                          {cat?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-white/70 mb-6">
                  Tüm kategorileri keşfetmek için hazırsınız!
                </p>
              )}
            </motion.div>

            {/* Personalized Ads Preview */}
            <motion.div
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-white/10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-white/70 text-sm">Size özel teklifler hazırlandı</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-500/30 border border-purple-400/30">
                  <Crown className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm">2 Platinum</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/30 border border-amber-400/30">
                  <Medal className="w-4 h-4 text-amber-400" />
                  <span className="text-white text-sm">4 Gold</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500/30 border border-orange-400/30">
                  <Award className="w-4 h-4 text-orange-400" />
                  <span className="text-white text-sm">6 Bronze</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button 
                onClick={() => setShowCompletionScreen(true)}
                className="bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white text-lg px-10 py-7 rounded-2xl shadow-2xl hover:opacity-90 transition-opacity w-full border-none"
              >
                <span className="flex items-center justify-center gap-3">
                  <Gift className="w-6 h-6" />
                  Teklifleri Gör
                  <ChevronRight className="w-5 h-5" />
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    // Personalized Offers Screen
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Header */}
        <header className="relative flex items-center justify-between px-8 py-6">
          <button 
            onClick={onHome}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </button>

          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Size Özel Teklifler</h1>
            <p className="text-white/50 text-sm">
              {selectedInterests.length} ilgi alanına göre özelleştirildi
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
            <Timer className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-bold">{countdown > 0 ? countdown : 'HAZIR'}</span>
          </div>
        </header>

        {/* Content */}
        <div className="relative flex-1 px-8 pb-8 overflow-y-auto" style={{ height: 'calc(100vh - 100px)' }}>
          {/* Platinum Section */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500">
                <Crown className="w-5 h-5 text-white" />
                <span className="text-white font-bold">Platinum Sponsorlar</span>
              </div>
              <span className="text-white/50 text-sm">Premium deneyim</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {personalizedAds.filter(ad => ad.tier === 'platinum').slice(0, 2).map((ad, i) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <AdCard 
                    ad={ad} 
                    variant="featured"
                    onDetails={setSelectedAd}
                    onClaim={setSelectedAd}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Gold Section */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400">
                <Medal className="w-5 h-5 text-white" />
                <span className="text-white font-bold">Gold Sponsorlar</span>
              </div>
              <span className="text-white/50 text-sm">Özel fırsatlar</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {personalizedAds.filter(ad => ad.tier === 'gold').slice(0, 4).map((ad, i) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <AdCard 
                    ad={ad} 
                    variant="compact"
                    onDetails={setSelectedAd}
                    onClaim={setSelectedAd}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Bronze Section */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600">
                <Award className="w-5 h-5 text-white" />
                <span className="text-white font-bold">Bronze Sponsorlar</span>
              </div>
              <span className="text-white/50 text-sm">Yerel işletmeler</span>
            </div>
            
            <div className="grid grid-cols-6 gap-3">
              {personalizedAds.filter(ad => ad.tier === 'bronze').slice(0, 6).map((ad, i) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.03 }}
                >
                  <AdCard 
                    ad={ad} 
                    variant="mini"
                    onDetails={setSelectedAd}
                    onClaim={setSelectedAd}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Continue Button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              onClick={handleComplete}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-lg px-12 py-6 rounded-2xl shadow-2xl hover:opacity-90 transition-opacity border-none"
              disabled={countdown > 0}
            >
              <span className="flex items-center gap-3">
                {countdown > 0 ? (
                  <>
                    <Timer className="w-5 h-5" />
                    Hazırlanıyor...
                  </>
                ) : (
                  <>
                    Tüm Fırsatları Keşfet
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </span>
            </Button>
          </motion.div>
        </div>

        {/* Ad Detail Modal */}
        <AnimatePresence>
          {selectedAd && (
            <AdDetailModal 
              ad={selectedAd} 
              onClose={() => setSelectedAd(null)}
              onClaim={setSelectedAd}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Swipe Screen
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6">
      {/* Home Button */}
      <button 
        onClick={onHome}
        className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors shadow-lg"
      >
        <Home className="w-6 h-6 text-white" />
      </button>
      
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/10 mb-4"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-white/90 text-sm font-medium">Kişiselleştir</span>
        </motion.div>

        <h2 className="text-3xl font-black text-white mb-3">
          Sizi Ne İlgilendiriyor?
        </h2>
        
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {categories.map((_, index) => (
            <motion.div
              key={index}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 h-2 bg-gradient-to-r from-purple-500 to-pink-500' 
                  : index < currentIndex 
                    ? 'w-2 h-2 bg-green-500'
                    : 'w-2 h-2 bg-white/20'
              }`}
              animate={index === currentIndex ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: index === currentIndex ? Infinity : 0 }}
            />
          ))}
        </div>
        
        <p className="text-white/50 text-sm">
          İlgileniyorsanız <span className="text-green-400">sağa</span>, geç için <span className="text-red-400">sola</span> kaydırın
        </p>
      </div>
      
      {/* Card Stack */}
      <div className="relative w-full max-w-md aspect-[3/4] mb-6">
        {/* Background cards */}
        {currentIndex + 2 < categories.length && (
          <div className="absolute inset-4 top-6 rounded-3xl bg-white/5 transform scale-90" />
        )}
        {currentIndex + 1 < categories.length && (
          <div className="absolute inset-2 top-4 rounded-3xl bg-white/10 transform scale-95 shadow-lg overflow-hidden">
            <img 
              src={categories[currentIndex + 1]?.image} 
              alt=""
              className="w-full h-full object-cover opacity-30"
            />
          </div>
        )}
        
        {/* Active Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ 
              x: exitDirection === 'right' ? 300 : -300,
              rotate: exitDirection === 'right' ? 20 : -20,
              opacity: 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute inset-0"
          >
            <SwipeCard 
              category={currentCategory}
              onSwipe={handleSwipe}
              isAnimating={isAnimating}
              relevantAds={getRelevantAdsForCategory(currentCategory.id)}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('left')}
          disabled={isAnimating}
          className="w-16 h-16 rounded-full bg-white/10 backdrop-blur border-2 border-red-500/50 shadow-lg flex items-center justify-center hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          <X className="w-8 h-8 text-red-400" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('right')}
          disabled={isAnimating}
          className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-xl flex items-center justify-center disabled:opacity-50"
        >
          <Heart className="w-10 h-10 text-white fill-current" />
        </motion.button>
      </div>
      
      {/* Skip All */}
      <button 
        onClick={() => onComplete([])}
        className="mt-6 text-white/40 hover:text-white/70 transition-colors text-sm"
      >
        Hepsini Atla →
      </button>
      
      {/* Selected Count */}
      <AnimatePresence>
        {selectedInterests.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-8 left-8 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium"
          >
            ❤️ {selectedInterests.length} ilgi alanı seçildi
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
