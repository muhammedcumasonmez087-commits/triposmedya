import { useState } from 'react';
import { Star, MapPin, Gift, ChevronRight, Navigation, Anchor, Building2, Home, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from './Header';
import categoryBeach from '@/assets/category-beach.jpg';
import categoryHistory from '@/assets/category-history.jpg';
import categoryFood from '@/assets/category-food.jpg';

interface Offer {
  id: string;
  type: 'featured' | 'regular' | 'sponsor';
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  location: string;
  distance: string;
  duration?: string;
  isOpen?: boolean;
  rating: number;
  image: string;
  discount?: string;
  perks?: string[];
  sponsored?: boolean;
}

const offers: Offer[] = [
  {
    id: '1',
    type: 'featured',
    category: 'beach',
    categoryLabel: 'GÜNÜN FIRSATI',
    title: 'Escape Beach Club',
    description: 'Altın kumlarda eşsiz bir gün geçirin. Bu taksiye özel %10 indirim.',
    location: 'Alsancak, Girne',
    distance: '12 km',
    duration: '~18 dk',
    isOpen: true,
    rating: 4.9,
    image: categoryBeach,
    discount: '%10 İndirim',
    perks: ['Şezlong Dahil'],
    sponsored: true,
  },
  {
    id: '2',
    type: 'regular',
    category: 'food',
    categoryLabel: 'RESTORAN',
    title: 'Bellapais Garden',
    description: 'Manastır manzaralı romantik akşam yemeği.',
    location: 'Girne Merkez',
    distance: '5 km',
    duration: '~8 dk',
    isOpen: true,
    rating: 4.8,
    image: categoryFood,
  },
  {
    id: '3',
    type: 'regular',
    category: 'history',
    categoryLabel: 'TARİHİ YER',
    title: 'St. Hilarion Kalesi',
    description: 'Beşparmak dağlarının zirvesinde masalsı manzara.',
    location: 'Dağ Yolu',
    distance: '8 km',
    duration: '~12 dk',
    isOpen: true,
    rating: 4.7,
    image: categoryHistory,
  },
  {
    id: '4',
    type: 'sponsor',
    category: 'activity',
    categoryLabel: 'SPONSORLU',
    title: 'Girne Yat Turu',
    description: "Akdeniz'in maviliklerini keşfedin. Gün batımı turları.",
    location: 'Eski Liman',
    distance: '2 km',
    duration: '~4 dk',
    isOpen: true,
    rating: 4.6,
    image: categoryBeach,
    sponsored: true,
    discount: '%15 İndirim',
  },
];

const filterTabs = [
  { id: 'all', label: 'Tümü', icon: null },
  { id: 'food', label: 'Yeme & İçme', icon: <Building2 className="w-4 h-4" /> },
  { id: 'beach', label: 'Deniz & Plaj', icon: <Anchor className="w-4 h-4" /> },
  { id: 'nightlife', label: 'Gece Hayatı', icon: <Star className="w-4 h-4" /> },
  { id: 'history', label: 'Tarihi Yerler', icon: <Building2 className="w-4 h-4" /> },
];

interface OfferFeedProps {
  selectedInterests: string[];
  onPlayGame: () => void;
  onClaimOffer: (offerId: string) => void;
  onHome: () => void;
}

export const OfferFeed = ({ selectedInterests, onPlayGame, onClaimOffer, onHome }: OfferFeedProps) => {
  const [activeTab, setActiveTab] = useState('all');
  
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

  const featuredOffer = offers.find(o => o.type === 'featured');
  // Top 3 regular + 1 sponsor (max 4 cards)
  const regularOffers = offers.filter(o => o.type === 'regular').slice(0, 3);
  const sponsorOffer = offers.find(o => o.type === 'sponsor');

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
              <h1 className="text-2xl font-bold text-foreground">Sizin İçin Önerilen</h1>
              <p className="text-muted-foreground text-sm">
                {interestLabels.length > 0 ? (
                  <>
                    <span className="text-primary font-medium">{interestLabels.join(', ')}</span>
                    {' '}kategorisinde
                  </>
                ) : (
                  'En popüler mekanlar'
                )}
              </p>
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
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Featured Offer - Compact */}
        {featuredOffer && (
          <div className="card-offer mb-6 overflow-hidden">
            <div className="flex">
              <div className="flex-1 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded-full bg-highlight/20 text-highlight text-xs font-semibold">
                    {featuredOffer.categoryLabel}
                  </span>
                  {featuredOffer.sponsored && (
                    <span className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                      Özel Teklif
                    </span>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-foreground mb-2">{featuredOffer.title}</h2>
                
                {/* Quick Info Row */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-reward fill-reward" />
                    <span className="font-medium text-foreground">{featuredOffer.rating}</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{featuredOffer.distance}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredOffer.duration}</span>
                  </div>
                  {featuredOffer.isOpen && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                      <span className="text-green-500 font-medium">Açık</span>
                    </>
                  )}
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {featuredOffer.description}
                </p>
                
                {/* Standardized CTAs */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="rounded-xl flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Haritada Aç
                  </Button>
                  <Button 
                    onClick={() => onClaimOffer(featuredOffer.id)}
                    className="btn-primary-gradient rounded-xl flex items-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    Teklifi Al
                  </Button>
                </div>
              </div>
              
              <div className="relative w-64 shrink-0">
                <img 
                  src={featuredOffer.image} 
                  alt={featuredOffer.title}
                  className="w-full h-full object-cover"
                />
                {featuredOffer.discount && (
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-highlight text-highlight-foreground text-sm font-bold">
                    {featuredOffer.discount}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Regular Offers Grid - Max 3 + 1 Sponsor */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {regularOffers.map(offer => (
            <div key={offer.id} className="card-offer overflow-hidden group">
              <div className="relative aspect-[4/3]">
                <img 
                  src={offer.image} 
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-card/90 backdrop-blur">
                  <Star className="w-3 h-3 text-reward fill-reward" />
                  <span className="text-xs font-semibold text-foreground">{offer.rating}</span>
                </div>
              </div>
              
              <div className="p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">{offer.categoryLabel}</p>
                <h3 className="font-bold text-foreground text-sm mb-1 truncate">{offer.title}</h3>
                
                {/* Quick Info */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span>{offer.distance}</span>
                  <span>•</span>
                  <span>{offer.duration}</span>
                  {offer.isOpen && (
                    <>
                      <span>•</span>
                      <span className="text-green-500">Açık</span>
                    </>
                  )}
                </div>
                
                {/* Standardized CTAs */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg text-xs">
                    <Navigation className="w-3 h-3 mr-1" />
                    Harita
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 rounded-lg bg-primary hover:bg-primary/90 text-xs"
                    onClick={() => onClaimOffer(offer.id)}
                  >
                    <Gift className="w-3 h-3 mr-1" />
                    Teklif Al
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Sponsor Card */}
          {sponsorOffer && (
            <div className="card-offer overflow-hidden group border-2 border-accent/30">
              <div className="relative aspect-[4/3]">
                <img 
                  src={sponsorOffer.image} 
                  alt={sponsorOffer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-medium">
                  Sponsorlu
                </div>
                {sponsorOffer.discount && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-highlight text-highlight-foreground text-xs font-bold">
                    {sponsorOffer.discount}
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 className="font-bold text-foreground text-sm mb-1 truncate">{sponsorOffer.title}</h3>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span>{sponsorOffer.distance}</span>
                  <span>•</span>
                  <span>{sponsorOffer.duration}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg text-xs">
                    <Navigation className="w-3 h-3 mr-1" />
                    Harita
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 rounded-lg bg-accent hover:bg-accent/90 text-xs"
                    onClick={() => onClaimOffer(sponsorOffer.id)}
                  >
                    <Gift className="w-3 h-3 mr-1" />
                    Teklif Al
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* See More Link */}
        <div className="text-center mb-6">
          <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 mx-auto">
            Daha Fazla Göster
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        
        {/* Reward Banner - Small */}
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
                <h3 className="font-bold text-foreground">🎁 Ödül Kazan</h3>
                <p className="text-sm text-muted-foreground">Şans çarkını çevir</p>
              </div>
            </div>
            <Button size="sm" className="btn-reward rounded-xl">
              Oyna
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
