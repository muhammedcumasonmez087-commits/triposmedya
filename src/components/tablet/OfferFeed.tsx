import { useState } from 'react';
import { Star, MapPin, Percent, Gift, ChevronRight, Navigation, Info, Anchor, Building2, Ship } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from './Header';
import categoryBeach from '@/assets/category-beach.jpg';
import categoryHistory from '@/assets/category-history.jpg';
import categoryFood from '@/assets/category-food.jpg';

interface Offer {
  id: string;
  type: 'featured' | 'regular';
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  location: string;
  distance: string;
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
    description: 'Altın kumlarda eşsiz bir gün geçirin. Bu taksiye özel, giriş ücretinde anında %10 indirim fırsatı sizi bekliyor. Kodunuzu girişte göstermeniz yeterli.',
    location: 'Alsancak, Girne',
    distance: '12km uzakta',
    rating: 4.9,
    image: categoryBeach,
    discount: '%10 İndirim',
    perks: ['Şezlong Dahil', 'Hoşgeldin İçeceği'],
    sponsored: true,
  },
  {
    id: '2',
    type: 'regular',
    category: 'food',
    categoryLabel: 'RESTORAN',
    title: 'Bellapais Garden',
    description: 'Manastır manzaralı romantik bir akşam yemeği. Dünya mutfağından seçkin lezzetler.',
    location: 'Girne Merkez',
    distance: '5km',
    rating: 4.8,
    image: categoryFood,
  },
  {
    id: '3',
    type: 'regular',
    category: 'history',
    categoryLabel: 'TARİHİ YER',
    title: 'St. Hilarion Kalesi',
    description: 'Beşparmak dağlarının zirvesinde, masalsı bir manzara ve tarih yolculuğu.',
    location: 'Dağ Yolu',
    distance: '8km',
    rating: 4.7,
    image: categoryHistory,
  },
  {
    id: '4',
    type: 'regular',
    category: 'activity',
    categoryLabel: 'AKTİVİTE',
    title: 'Girne Yat Turu',
    description: "Akdeniz'in maviliklerini keşfedin. Gün batımı turları ve önerilerimiz.",
    location: 'Eski Liman',
    distance: '2km',
    rating: 4.6,
    image: categoryBeach,
    sponsored: true,
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
}

export const OfferFeed = ({ selectedInterests, onPlayGame, onClaimOffer }: OfferFeedProps) => {
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
  const regularOffers = offers.filter(o => o.type === 'regular');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="px-8 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sizin İçin Önerilen Fırsatlar</h1>
            <p className="text-muted-foreground">
              {interestLabels.length > 0 ? (
                <>
                  <span className="text-primary font-medium">{interestLabels.join(', ')}</span>
                  {' '}sevenler için özel seçtilerimiz
                </>
              ) : (
                'En popüler mekanları keşfedin'
              )}
            </p>
          </div>
          
          <Button 
            onClick={onPlayGame}
            className="bg-highlight hover:bg-highlight/90 text-highlight-foreground rounded-xl px-6"
          >
            <Gift className="w-4 h-4 mr-2" />
            İlgi Alanlarını Değiştir
          </Button>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
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
        
        {/* Featured Offer */}
        {featuredOffer && (
          <div className="card-offer mb-8 overflow-hidden">
            <div className="flex">
              <div className="flex-1 p-6">
                <span className="inline-block px-3 py-1 rounded-full bg-highlight/20 text-highlight text-xs font-semibold mb-4">
                  {featuredOffer.categoryLabel}
                </span>
                
                <h2 className="text-2xl font-bold text-foreground mb-2">{featuredOffer.title}</h2>
                
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-reward fill-reward" />
                    <span className="font-medium text-foreground">{featuredOffer.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{featuredOffer.location}</span>
                  <span>•</span>
                  <span className="text-primary font-medium">{featuredOffer.distance}</span>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {featuredOffer.description}
                </p>
                
                {/* Perks */}
                <div className="flex gap-6 mb-6">
                  {featuredOffer.discount && (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-highlight/10 flex items-center justify-center">
                        <Percent className="w-5 h-5 text-highlight" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">İndirim</p>
                        <p className="font-semibold text-foreground">{featuredOffer.discount}</p>
                      </div>
                    </div>
                  )}
                  {featuredOffer.perks?.map((perk, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Gift className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Bonus</p>
                        <p className="font-semibold text-foreground">{perk}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => onClaimOffer(featuredOffer.id)}
                    className="btn-primary-gradient rounded-xl"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Fırsatı Yakala
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    <Navigation className="w-4 h-4 mr-2" />
                    Yol Tarifi
                  </Button>
                </div>
              </div>
              
              <div className="relative w-80">
                <img 
                  src={featuredOffer.image} 
                  alt={featuredOffer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                  Plaj & Eğlence
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Regular Offers Grid */}
        <div className="grid grid-cols-3 gap-6">
          {regularOffers.map(offer => (
            <div key={offer.id} className="card-offer overflow-hidden group">
              <div className="relative aspect-[4/3]">
                <img 
                  src={offer.image} 
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-card/90 backdrop-blur">
                  <Star className="w-3.5 h-3.5 text-reward fill-reward" />
                  <span className="text-sm font-semibold text-foreground">{offer.rating}</span>
                </div>
                {offer.sponsored && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-highlight text-highlight-foreground text-xs font-medium">
                    Popüler
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-1">{offer.categoryLabel}</p>
                <h3 className="font-bold text-foreground mb-2">{offer.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{offer.description}</p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{offer.location}</span>
                  <span>•</span>
                  <span>{offer.distance}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg">
                    Detaylar
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 rounded-lg bg-primary hover:bg-primary/90"
                    onClick={() => onClaimOffer(offer.id)}
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Git
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Playable Ad Banner */}
        <div 
          onClick={onPlayGame}
          className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-highlight/10 via-reward/10 to-accent/10 border-2 border-dashed border-highlight/30 cursor-pointer hover:border-highlight transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-highlight/20 flex items-center justify-center animate-bounce-soft">
                <Gift className="w-8 h-8 text-highlight" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">🎡 Şans Çarkını Çevir!</h3>
                <p className="text-muted-foreground">Özel indirimler ve hediyeler kazanma şansı yakala</p>
              </div>
            </div>
            <Button className="btn-reward text-lg">
              Hemen Oyna
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
