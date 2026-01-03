import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Medal, Award, Star, Tag, QrCode, Clock, MapPin, Phone, X, ChevronRight, Sparkles, Zap, Heart, TrendingUp, Eye, Users, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import QRCode from 'react-qr-code';

// Sponsor seviyeleri
export type SponsorTier = 'platinum' | 'gold' | 'bronze';

// Kategori bazlı reklamlar
export interface ContextualAd {
  id: string;
  tier: SponsorTier;
  name: string;
  logo: string;
  slogan: string;
  description: string;
  fullDesc: string;
  offer: string;
  couponCode: string;
  website: string;
  phone: string;
  location: string;
  category: string;
  categories: string[]; // Hangi ilgi alanlarını hedefliyor
  validUntil: string;
  image: string;
  accentColor: string;
  metrics?: {
    views: number;
    claims: number;
    rating: number;
  };
}

// Bağlamsal Reklam Veritabanı - Kategorilere göre
export const contextualAds: ContextualAd[] = [
  // PLATINUM SPONSORS
  {
    id: 'merit-platinum',
    tier: 'platinum',
    name: 'Merit Hotels',
    logo: '👑',
    slogan: 'KKTC\'nin En Prestijli Otel Zinciri',
    description: '5 yıldızlı lüks, casino ve spa deneyimi',
    fullDesc: 'Merit Hotels olarak sizlere dünya standartlarında konaklama, gastronomi ve eğlence sunuyoruz. Casino, spa, özel plaj ve gece kulübü ile unutulmaz bir tatil.',
    offer: '2 Gece Kal 1 Öde',
    couponCode: 'MERITPLATINUM',
    website: 'merithotels.com',
    phone: '+90 392 650 0500',
    location: 'Girne & Lefkoşa',
    category: 'Otel & Casino',
    categories: ['nightlife', 'beach', 'food'],
    validUntil: '28 Şubat 2026',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    accentColor: '#a855f7',
    metrics: { views: 45230, claims: 2341, rating: 4.9 }
  },
  {
    id: 'cratos-platinum',
    tier: 'platinum',
    name: 'Cratos Premium Hotel',
    logo: '🏰',
    slogan: 'All-Inclusive Lüks Tatil',
    description: 'Özel plaj, aquapark ve 7 restoran',
    fullDesc: 'Cratos Premium Hotel, aileniz veya sevdiklerinizle geçireceğiniz mükemmel tatil için her şeyi bir arada sunuyor. Denize sıfır konum, aquapark ve dünya mutfağı.',
    offer: 'Çocuklar Ücretsiz + Spa',
    couponCode: 'CRATOSVIP',
    website: 'cratoshotel.com',
    phone: '+90 392 650 0000',
    location: 'Girne',
    category: 'Resort',
    categories: ['beach', 'food', 'nature'],
    validUntil: '30 Nisan 2026',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    accentColor: '#f59e0b',
    metrics: { views: 38540, claims: 1892, rating: 4.8 }
  },

  // GOLD SPONSORS
  {
    id: 'colony-gold',
    tier: 'gold',
    name: 'Colony Garden Hotel',
    logo: '🏨',
    slogan: "Girne'nin Kalbinde",
    description: 'Deniz manzaralı lüks odalar',
    fullDesc: 'Colony Garden Hotel ile Girne\'nin en güzel noktasında konaklayın. Açık havuz, spa ve gurme restoran ile unutulmaz anlar.',
    offer: '%30 İndirim',
    couponCode: 'COLONY30',
    website: 'colonyhotel.com',
    phone: '+90 392 815 1234',
    location: 'Girne Merkez',
    category: 'Otel',
    categories: ['beach', 'food'],
    validUntil: '31 Mart 2026',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    accentColor: '#14b8a6',
    metrics: { views: 22450, claims: 1123, rating: 4.7 }
  },
  {
    id: 'niazi-gold',
    tier: 'gold',
    name: "Niazi's Restaurant",
    logo: '🍖',
    slogan: 'Efsanevi Kıbrıs Lezzetleri',
    description: '1949\'dan beri şeftali kebabı',
    fullDesc: 'Üç nesil boyunca aynı tariflerle hazırlanan otantik Kıbrıs mutfağı. Meşhur şeftali kebabımızı mutlaka deneyin.',
    offer: 'Tatlı + İçecek Hediye',
    couponCode: 'NIAZI2025',
    website: 'niazis.com',
    phone: '+90 392 815 2160',
    location: 'Girne Limanı',
    category: 'Restoran',
    categories: ['food', 'history'],
    validUntil: '15 Mart 2026',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    accentColor: '#f97316',
    metrics: { views: 18930, claims: 2567, rating: 4.9 }
  },
  {
    id: 'dome-gold',
    tier: 'gold',
    name: 'Dome Hotel',
    logo: '⛵',
    slogan: "Tarihi Liman'da Konaklama",
    description: 'Akdeniz manzaralı butik otel',
    fullDesc: 'Girne\'nin tarihi limanına nazır ikonik otel. Deniz manzaralı odalar, teras restoran ve özel tekne turları.',
    offer: '%25 Erken Rezervasyon',
    couponCode: 'DOME25',
    website: 'domehotel.com',
    phone: '+90 392 815 2453',
    location: 'Girne Limanı',
    category: 'Butik Otel',
    categories: ['history', 'beach', 'food'],
    validUntil: '31 Mart 2026',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    accentColor: '#0ea5e9',
    metrics: { views: 15670, claims: 892, rating: 4.6 }
  },
  {
    id: 'bellapais-gold',
    tier: 'gold',
    name: 'Bellapais Gardens',
    logo: '🏛️',
    slogan: 'Manastır Manzaralı Fine Dining',
    description: 'Romantik akşam yemeği deneyimi',
    fullDesc: 'Bellapais Manastırı\'nın büyüleyici manzarası eşliğinde dünya mutfağından lezzetler. Özel günler için mükemmel mekan.',
    offer: 'Şampanya İkramı',
    couponCode: 'BELLA2025',
    website: 'bellapaisgardens.com',
    phone: '+90 392 815 6066',
    location: 'Bellapais',
    category: 'Fine Dining',
    categories: ['food', 'history', 'nature'],
    validUntil: '28 Şubat 2026',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    accentColor: '#a855f7',
    metrics: { views: 12340, claims: 678, rating: 4.8 }
  },

  // BRONZE SPONSORS
  {
    id: 'cafe-nero-bronze',
    tier: 'bronze',
    name: 'Caffè Nero',
    logo: '☕',
    slogan: 'İtalyan Kahve Kültürü',
    description: 'Premium espresso deneyimi',
    fullDesc: 'Özenle seçilmiş kahve çekirdekleri, taze pastalar ve sıcak atmosfer.',
    offer: '2. Kahve Hediye',
    couponCode: 'NERO2025',
    website: 'caffenero.com',
    phone: '',
    location: 'Girne & Lefkoşa',
    category: 'Kafe',
    categories: ['food', 'shopping'],
    validUntil: '28 Şubat 2026',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
    accentColor: '#64748b',
    metrics: { views: 8760, claims: 1234, rating: 4.5 }
  },
  {
    id: 'telsim-bronze',
    tier: 'bronze',
    name: 'Telsim',
    logo: '📱',
    slogan: 'Bağlantıda Kal',
    description: 'Turist SIM kartı anında aktif',
    fullDesc: 'KKTC\'de en geniş kapsama alanı. Turist paketleri ile sınırsız internet.',
    offer: '10GB Ücretsiz Data',
    couponCode: 'TELSIM10',
    website: 'telsim.com.tr',
    phone: '+90 392 600 0000',
    location: 'Tüm KKTC',
    category: 'GSM',
    categories: ['shopping'],
    validUntil: '28 Şubat 2026',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
    accentColor: '#06b6d4',
    metrics: { views: 6540, claims: 2890, rating: 4.3 }
  },
  {
    id: 'lemar-bronze',
    tier: 'bronze',
    name: 'Lemar Market',
    logo: '🛒',
    slogan: 'Günlük İhtiyaçlarınız',
    description: 'Taze ürünler, uygun fiyatlar',
    fullDesc: 'KKTC\'nin en büyük süpermarket zinciri. Online sipariş ile eve teslimat.',
    offer: '%15 İndirim',
    couponCode: 'LEMAR15',
    website: 'lemar.com.tr',
    phone: '+90 392 444 5363',
    location: 'Tüm KKTC',
    category: 'Market',
    categories: ['shopping', 'food'],
    validUntil: '15 Şubat 2026',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    accentColor: '#22c55e',
    metrics: { views: 5430, claims: 892, rating: 4.2 }
  },
  {
    id: 'st-hilarion-bronze',
    tier: 'bronze',
    name: 'St. Hilarion Tur',
    logo: '🏔️',
    slogan: 'Masalsı Kale Turu',
    description: 'Rehberli tarihi gezi',
    fullDesc: 'Beşparmak dağlarının zirvesinde masalsı St. Hilarion Kalesi\'ni profesyonel rehber eşliğinde keşfedin.',
    offer: 'Grup İndirimi %20',
    couponCode: 'HILARION20',
    website: 'northcyprustours.com',
    phone: '+90 533 845 1234',
    location: 'Girne Dağları',
    category: 'Tur',
    categories: ['history', 'nature'],
    validUntil: '30 Nisan 2026',
    image: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=800',
    accentColor: '#78716c',
    metrics: { views: 4320, claims: 567, rating: 4.7 }
  },
  {
    id: 'escape-beach-bronze',
    tier: 'bronze',
    name: 'Escape Beach Club',
    logo: '🏖️',
    slogan: 'Günlük Plaj Keyfi',
    description: 'Şezlong, restoran ve su sporları',
    fullDesc: 'Altın kumlarda eşsiz bir gün. DJ performansları ve gün batımı partileri.',
    offer: 'Şezlong + Kokteyl',
    couponCode: 'ESCAPE2025',
    website: 'escapebeach.com',
    phone: '+90 533 876 5432',
    location: 'Alsancak, Girne',
    category: 'Plaj Kulübü',
    categories: ['beach', 'nightlife', 'food'],
    validUntil: '31 Ağustos 2026',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    accentColor: '#0891b2',
    metrics: { views: 7890, claims: 1456, rating: 4.6 }
  },
  {
    id: 'deniz-plaza-bronze',
    tier: 'bronze',
    name: 'Deniz Plaza',
    logo: '🛍️',
    slogan: 'Alışverişin Merkezi',
    description: '150+ mağaza ve sinema',
    fullDesc: 'KKTC\'nin en büyük AVM\'si. Moda, teknoloji, sinema ve food court.',
    offer: '%40\'a Varan İndirim',
    couponCode: 'DENIZ40',
    website: 'denizplaza.com',
    phone: '+90 392 228 5555',
    location: 'Lefkoşa',
    category: 'AVM',
    categories: ['shopping'],
    validUntil: '31 Ocak 2026',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570b5e2c0a?w=800',
    accentColor: '#3b82f6',
    metrics: { views: 9870, claims: 2134, rating: 4.4 }
  },
];

// Sponsor seviyesine göre ikon ve renk
export const tierConfig = {
  platinum: {
    icon: Crown,
    label: 'Öne Çıkan Sponsor',
    gradient: 'from-purple-500 via-violet-500 to-indigo-600',
    bgGradient: 'from-purple-900/95 via-violet-900/90 to-indigo-900/95',
    borderColor: 'border-purple-400/50',
    glowColor: 'shadow-purple-500/30',
    badge: 'bg-gradient-to-r from-purple-500 to-violet-500',
  },
  gold: {
    icon: Medal,
    label: 'Özel Teklifler',
    gradient: 'from-amber-400 via-yellow-500 to-orange-400',
    bgGradient: 'from-amber-900/95 via-yellow-900/90 to-orange-900/95',
    borderColor: 'border-amber-400/50',
    glowColor: 'shadow-amber-500/30',
    badge: 'bg-gradient-to-r from-amber-400 to-orange-400',
  },
  bronze: {
    icon: Award,
    label: 'Yakınındaki Seçenekler',
    gradient: 'from-orange-600 via-amber-700 to-yellow-700',
    bgGradient: 'from-orange-900/95 via-amber-900/90 to-yellow-900/95',
    borderColor: 'border-orange-400/30',
    glowColor: 'shadow-orange-500/20',
    badge: 'bg-gradient-to-r from-orange-600 to-amber-600',
  },
};

// Bağlamsal reklam filtreleme fonksiyonu
export const getContextualAds = (
  userInterests: string[],
  currentTime?: Date
): { platinum: ContextualAd[]; gold: ContextualAd[]; bronze: ContextualAd[] } => {
  const now = currentTime || new Date();
  const hour = now.getHours();

  // Zaman bazlı ağırlıklandırma
  let timeBoost: string[] = [];
  if (hour >= 6 && hour < 11) {
    timeBoost = ['food']; // Kahvaltı saatleri
  } else if (hour >= 11 && hour < 15) {
    timeBoost = ['beach', 'history', 'nature']; // Gündüz aktiviteleri
  } else if (hour >= 15 && hour < 19) {
    timeBoost = ['shopping', 'food']; // Akşamüstü
  } else if (hour >= 19) {
    timeBoost = ['nightlife', 'food']; // Gece
  }

  const relevantInterests = [...userInterests, ...timeBoost];

  // Reklam skorlama
  const scoredAds = contextualAds.map(ad => {
    let score = 0;
    
    // İlgi alanı eşleşmesi
    ad.categories.forEach(cat => {
      if (relevantInterests.includes(cat)) {
        score += 10;
      }
    });

    // Tier bonus
    if (ad.tier === 'platinum') score += 30;
    if (ad.tier === 'gold') score += 20;
    if (ad.tier === 'bronze') score += 10;

    // Metrik bonus
    if (ad.metrics) {
      score += (ad.metrics.rating / 5) * 5;
    }

    return { ...ad, score };
  });

  // Skorlara göre sırala ve tier'lara ayır
  const sorted = scoredAds.sort((a, b) => b.score - a.score);

  return {
    platinum: sorted.filter(ad => ad.tier === 'platinum').slice(0, 2),
    gold: sorted.filter(ad => ad.tier === 'gold').slice(0, 4),
    bronze: sorted.filter(ad => ad.tier === 'bronze').slice(0, 6),
  };
};

// Sponsor Rozeti Komponenti
export const SponsorBadge = ({ tier, size = 'md' }: { tier: SponsorTier; size?: 'sm' | 'md' | 'lg' }) => {
  const config = tierConfig[tier];
  const TierIcon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={`inline-flex items-center ${sizeClasses[size]} rounded-full ${config.badge} text-white font-semibold`}>
      <TierIcon className={iconSizes[size]} />
      <span>{config.label}</span>
    </div>
  );
};

// Reklam Kartı Komponenti
interface AdCardProps {
  ad: ContextualAd;
  variant?: 'compact' | 'featured' | 'mini';
  onDetails: (ad: ContextualAd) => void;
  onClaim: (ad: ContextualAd) => void;
}

export const AdCard = ({ ad, variant = 'compact', onDetails, onClaim }: AdCardProps) => {
  const config = tierConfig[ad.tier];
  const TierIcon = config.icon;

  if (variant === 'mini') {
    return (
      <motion.div
        className={`relative rounded-xl overflow-hidden cursor-pointer group ${config.borderColor} border`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onDetails(ad)}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${ad.image})` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${config.bgGradient}`} />
        <div className="relative p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{ad.logo}</span>
            <TierIcon className="w-4 h-4 text-white/70" />
          </div>
          <p className="text-white font-bold text-sm truncate">{ad.name}</p>
          <p className="text-white/60 text-xs truncate">{ad.offer}</p>
        </div>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        className={`relative rounded-2xl overflow-hidden ${config.borderColor} border-2 shadow-2xl ${config.glowColor}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${ad.image})` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${config.bgGradient}`} />
        
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <SponsorBadge tier={ad.tier} size="lg" />
            {ad.metrics && (
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {(ad.metrics.views / 1000).toFixed(1)}K
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  {ad.metrics.rating}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex items-center gap-4 mb-4">
            <motion.div 
              className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-5xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {ad.logo}
            </motion.div>
            <div>
              <h3 className="text-3xl font-black text-white">{ad.name}</h3>
              <p className="text-white/70">{ad.slogan}</p>
            </div>
          </div>

          <p className="text-white/80 text-lg mb-6">{ad.description}</p>

          {/* Offer */}
          <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r ${config.gradient} text-white font-bold text-xl mb-6`}>
            <Gift className="w-6 h-6" />
            {ad.offer}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white text-gray-900 font-bold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onClaim(ad)}
            >
              <QrCode className="w-5 h-5" />
              Kuponu Al
            </motion.button>
            <motion.button
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 backdrop-blur text-white font-medium border border-white/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDetails(ad)}
            >
              Detaylar
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Compact variant (default)
  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden cursor-pointer group ${config.borderColor} border`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onDetails(ad)}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${ad.image})` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${config.bgGradient}`} />
      
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <SponsorBadge tier={ad.tier} size="sm" />
          <TierIcon className="w-5 h-5 text-white/50" />
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{ad.logo}</span>
          <div>
            <h4 className="text-white font-bold">{ad.name}</h4>
            <p className="text-white/60 text-sm">{ad.category}</p>
          </div>
        </div>

        <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r ${config.gradient} text-white text-sm font-semibold`}>
          <Tag className="w-3 h-3" />
          {ad.offer}
        </div>

        {/* Hover Actions */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-xl translate-y-full group-hover:translate-y-0 transition-transform"
        >
          <div className="flex gap-2">
            <button 
              className="flex-1 py-2 rounded-lg bg-white text-gray-900 text-sm font-bold"
              onClick={(e) => { e.stopPropagation(); onClaim(ad); }}
            >
              Kuponu Al
            </button>
            <button 
              className="px-4 py-2 rounded-lg bg-white/20 text-white text-sm"
              onClick={(e) => { e.stopPropagation(); onDetails(ad); }}
            >
              Detay
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Reklam Detay Modalı
interface AdDetailModalProps {
  ad: ContextualAd;
  onClose: () => void;
  onClaim: (ad: ContextualAd) => void;
}

export const AdDetailModal = ({ ad, onClose, onClaim }: AdDetailModalProps) => {
  const config = tierConfig[ad.tier];
  const TierIcon = config.icon;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
        onClick={onClose}
      />
      
      <motion.div
        className={`relative w-full max-w-2xl overflow-hidden rounded-[2rem] shadow-2xl ${config.glowColor}`}
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
          <div className={`absolute inset-0 bg-gradient-to-t ${config.bgGradient}`} />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/20"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="absolute top-4 left-4">
            <SponsorBadge tier={ad.tier} size="lg" />
          </div>
          
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
          
          {/* Metrics */}
          {ad.metrics && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 rounded-xl bg-gray-50">
                <Eye className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                <p className="font-bold text-gray-900">{(ad.metrics.views / 1000).toFixed(1)}K</p>
                <p className="text-xs text-gray-500">Görüntülenme</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50">
                <Users className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                <p className="font-bold text-gray-900">{ad.metrics.claims}</p>
                <p className="text-xs text-gray-500">Kupon Alımı</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50">
                <Star className="w-5 h-5 mx-auto mb-1 text-amber-400 fill-current" />
                <p className="font-bold text-gray-900">{ad.metrics.rating}</p>
                <p className="text-xs text-gray-500">Puan</p>
              </div>
            </div>
          )}
          
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
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 col-span-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ad.accentColor}20` }}>
                <Clock className="w-5 h-5" style={{ color: ad.accentColor }} />
              </div>
              <span className="text-gray-700 text-sm">{ad.validUntil}'e kadar geçerli</span>
            </div>
          </div>
          
          {/* Offer & QR */}
          <div className={`bg-gradient-to-r ${config.gradient} rounded-2xl p-6`}>
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
};
