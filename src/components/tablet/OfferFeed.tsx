import { useState, useEffect } from 'react';
import { Star, MapPin, Gift, ChevronRight, Crown, Medal, Award, Home, Clock, Tag, QrCode, X, Sparkles, TrendingUp, Eye, Phone, Timer, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from './Header';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { 
  contextualAds, 
  getContextualAds, 
  tierConfig, 
  SponsorBadge, 
  AdDetailModal,
  ContextualAd,
  SponsorTier
} from './ContextualAdEngine';

const filterTabs = [
  { id: 'all', label: 'Tümü', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'platinum', label: 'Platinum', icon: <Crown className="w-4 h-4" />, color: 'text-purple-400' },
  { id: 'gold', label: 'Gold', icon: <Medal className="w-4 h-4" />, color: 'text-amber-400' },
  { id: 'bronze', label: 'Bronze', icon: <Award className="w-4 h-4" />, color: 'text-orange-400' },
];

interface OfferFeedProps {
  selectedInterests: string[];
  onPlayGame: () => void;
  onClaimOffer: (offerId: string) => void;
  onHome: () => void;
}

// Offer Card Component
const OfferCard = ({ 
  ad, 
  variant = 'compact',
  onDetails,
  onClaim 
}: { 
  ad: ContextualAd; 
  variant?: 'featured' | 'compact' | 'sponsor';
  onDetails: (ad: ContextualAd) => void;
  onClaim: (ad: ContextualAd) => void;
}) => {
  const config = tierConfig[ad.tier];
  const TierIcon = config.icon;

  if (variant === 'featured') {
    return (
      <motion.div 
        className={`card-offer overflow-hidden ${config.borderColor} border-2`}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="flex">
          <div className="flex-1 p-5">
            <div className="flex items-center gap-2 mb-3">
              <SponsorBadge tier={ad.tier} size="md" />
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                Açık
              </span>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{ad.logo}</span>
              <div>
                <h2 className="text-xl font-bold text-foreground">{ad.name}</h2>
                <p className="text-muted-foreground text-sm">{ad.slogan}</p>
              </div>
            </div>
            
            {/* Quick Info Row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
              {ad.metrics && (
                <>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-medium text-foreground">{ad.metrics.rating}</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                </>
              )}
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{ad.location}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{ad.validUntil}'e kadar</span>
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {ad.description}
            </p>

            {/* Offer Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${config.gradient} text-white font-bold mb-4`}>
              <Gift className="w-4 h-4" />
              {ad.offer}
            </div>
            
            {/* CTAs - Haritada Aç kaldırıldı, taksi içinde kullanılamaz */}
            <div className="flex gap-3">
              <Button 
                onClick={() => onClaim(ad)}
                className={`btn-primary-gradient rounded-xl flex items-center gap-2`}
              >
                <QrCode className="w-4 h-4" />
                Kuponu Al
              </Button>
              <Button 
                variant="outline"
                onClick={() => onDetails(ad)}
                className="rounded-xl flex items-center gap-2"
              >
                Detaylar
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative w-64 shrink-0">
            <img 
              src={ad.image} 
              alt={ad.name}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-l ${config.bgGradient} opacity-30`} />
          </div>
        </div>
      </motion.div>
    );
  }

  // Compact variant
  return (
    <motion.div 
      className={`card-offer overflow-hidden group cursor-pointer ${config.borderColor} border`}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={() => onDetails(ad)}
    >
      <div className="relative aspect-[4/3]">
        <img 
          src={ad.image} 
          alt={ad.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${config.bgGradient} opacity-50`} />
        
        {/* Tier Badge */}
        <div className="absolute top-2 left-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${config.badge} text-white`}>
            <TierIcon className="w-3 h-3" />
            <span className="text-xs font-semibold">{ad.tier}</span>
          </div>
        </div>
        
        {/* Rating */}
        {ad.metrics && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-white">{ad.metrics.rating}</span>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{ad.logo}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-sm truncate">{ad.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{ad.category}</p>
          </div>
        </div>
        
        {/* Quick Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{ad.location}</span>
        </div>

        {/* Offer Badge */}
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r ${config.gradient} text-white text-xs font-semibold mb-3`}>
          <Tag className="w-3 h-3" />
          {ad.offer}
        </div>
        
        {/* CTA */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 rounded-lg bg-primary hover:bg-primary/90 text-xs"
            onClick={(e) => { e.stopPropagation(); onClaim(ad); }}
          >
            <QrCode className="w-3 h-3 mr-1" />
            Kupon Al
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export const OfferFeed = ({ selectedInterests, onPlayGame, onClaimOffer, onHome }: OfferFeedProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAd, setSelectedAd] = useState<ContextualAd | null>(null);
  const [personalizedAds, setPersonalizedAds] = useState<{ platinum: ContextualAd[]; gold: ContextualAd[]; bronze: ContextualAd[] }>({ platinum: [], gold: [], bronze: [] });

  // Kişiselleştirilmiş reklamları al
  useEffect(() => {
    const ads = getContextualAds(selectedInterests);
    setPersonalizedAds(ads);
  }, [selectedInterests]);
  
  const interestLabels = selectedInterests.length > 0 
    ? selectedInterests.map(i => {
        switch(i) {
          case 'beach': return 'Deniz & Plaj';
          case 'history': return 'Tarih';
          case 'food': return 'Yeme & İçme';
          case 'nightlife': return 'Gece Hayatı';
          case 'nature': return 'Doğa';
          case 'shopping': return 'Alışveriş';
          default: return i;
        }
      })
    : [];

  // Aktif filtreye göre reklamları filtrele
  const getFilteredAds = () => {
    const allAds = [...personalizedAds.platinum, ...personalizedAds.gold, ...personalizedAds.bronze];
    
    if (activeTab === 'all') return allAds;
    if (activeTab === 'platinum') return personalizedAds.platinum;
    if (activeTab === 'gold') return personalizedAds.gold;
    if (activeTab === 'bronze') return personalizedAds.bronze;
    
    return allAds;
  };

  const filteredAds = getFilteredAds();
  const featuredAd = personalizedAds.platinum[0];

  const handleClaimAd = (ad: ContextualAd) => {
    setSelectedAd(ad);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="px-8 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Home Button */}
            <button 
              onClick={onHome}
              className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors shadow-lg"
            >
              <Home className="w-6 h-6 text-foreground" />
            </button>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">Sizin İçin Önerilen</h1>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  Kişiselleştirildi
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                {interestLabels.length > 0 ? (
                  <>
                    <span className="text-primary font-medium">{interestLabels.join(', ')}</span>
                    {' '}kategorisinde {filteredAds.length} teklif
                  </>
                ) : (
                  `${filteredAds.length} sponsor teklifi mevcut`
                )}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Crown className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">{personalizedAds.platinum.length} Platinum</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Medal className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">{personalizedAds.gold.length} Gold</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Award className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">{personalizedAds.bronze.length} Bronze</span>
            </div>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? tab.id === 'platinum' ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white'
                  : tab.id === 'gold' ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white'
                  : tab.id === 'bronze' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white'
                  : 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
              }`}
            >
              <span className={activeTab !== tab.id ? tab.color : ''}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Featured Platinum Offer */}
        {activeTab === 'all' && featuredAd && (
          <div className="mb-6">
            <OfferCard 
              ad={featuredAd} 
              variant="featured" 
              onDetails={setSelectedAd}
              onClaim={handleClaimAd}
            />
          </div>
        )}
        
        {/* Offers Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {filteredAds
            .filter(ad => activeTab === 'all' ? ad.id !== featuredAd?.id : true)
            .slice(0, 8)
            .map((ad, index) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <OfferCard 
                  ad={ad} 
                  variant="compact"
                  onDetails={setSelectedAd}
                  onClaim={handleClaimAd}
                />
              </motion.div>
            ))}
        </div>
        
        {/* Contextual Ad Info Banner */}
        <motion.div 
          className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground">Bağlamsal Reklamcılık Aktif</h3>
              <p className="text-sm text-muted-foreground">
                Teklifler ilgi alanlarınıza, günün saatine ve konumunuza göre özelleştirildi
              </p>
            </div>
            <div className="flex items-center gap-2 text-purple-400 text-sm">
              <Eye className="w-4 h-4" />
              <span>Akıllı Hedefleme</span>
            </div>
          </div>
        </motion.div>
        
        {/* Reward Banner */}
        <div 
          onClick={onPlayGame}
          className="p-4 rounded-2xl bg-gradient-to-r from-highlight/10 via-reward/10 to-accent/10 border border-highlight/20 cursor-pointer hover:border-highlight/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-highlight/20 flex items-center justify-center">
                <Gift className="w-6 h-6 text-highlight" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">🎁 Ekstra Ödül Kazan</h3>
                <p className="text-sm text-muted-foreground">Şans çarkını çevir, kupon kazan</p>
              </div>
            </div>
            <Button size="sm" className="btn-reward rounded-xl">
              Oyna
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>

      {/* Ad Detail Modal */}
      <AnimatePresence>
        {selectedAd && (
          <AdDetailModal 
            ad={selectedAd} 
            onClose={() => setSelectedAd(null)}
            onClaim={(ad) => {
              onClaimOffer(ad.id);
              setSelectedAd(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
