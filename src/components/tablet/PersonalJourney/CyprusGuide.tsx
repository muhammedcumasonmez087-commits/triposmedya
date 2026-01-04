import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, MapPin, Info, Landmark, 
  UtensilsCrossed, Hotel, Waves, Car, CreditCard, Plug, 
  Clock, Plane, Ship, Sun, Sparkles, Star, BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import images
import heroCyprus from '@/assets/hero-cyprus.jpg';
import categoryBeach from '@/assets/category-beach.jpg';
import categoryFood from '@/assets/category-food.jpg';
import categoryHistory from '@/assets/category-history.jpg';
import categoryNature from '@/assets/category-nature.jpg';

// Guide sections
type GuideSection = 'regions' | 'practical' | 'attractions' | 'recommended';

interface Region {
  id: string;
  name: string;
  description: string;
  image: string;
  highlights: string[];
}

interface PracticalInfo {
  id: string;
  icon: React.ElementType;
  title: string;
  content: string;
}

interface Attraction {
  id: string;
  name: string;
  region: string;
  description: string;
  image: string;
  type: 'tarihi' | 'plaj' | 'doga' | 'kultur';
}

interface RecommendedPlace {
  id: string;
  name: string;
  type: 'otel' | 'restoran' | 'plaj' | 'eglence';
  description: string;
  image: string;
  location: string;
  featured?: boolean;
  sponsorBadge?: string;
}

// Data
const regions: Region[] = [
  {
    id: 'lefkosa',
    name: 'Lefkoşa',
    description: 'Dünyanın ikiye bölünmüş tek başkenti. Osmanlı, Venedik ve İngiliz mimarisinin iç içe geçtiği tarihi surlar içinde keşfedilecek çok şey var.',
    image: categoryHistory,
    highlights: ['Büyük Han', 'Selimiye Camii', 'Yeşil Hat', 'Zehra Sokak Kafeleri', 'Rüstem Kitabevi']
  },
  {
    id: 'girne',
    name: 'Girne',
    description: 'Tarihi limanı, muhteşem kaleleri ve Beşparmak Dağları manzarasıyla Kıbrıs\'ın en çekici bölgesi.',
    image: heroCyprus,
    highlights: ['Girne Kalesi', 'Bellapais Manastırı', 'St. Hilarion Kalesi', 'Karmi Köyü', 'Escape Beach']
  },
  {
    id: 'gazimagusa',
    name: 'Gazimağusa',
    description: 'Antik Salamis kalıntıları, Gotik mimarisi ve hayalet şehir Kapalı Maraş ile tarihin canlı bir müzesi.',
    image: categoryNature,
    highlights: ['Kapalı Maraş', 'Lala Mustafa Paşa Camii', 'Salamis Harabeleri', 'Othello Kalesi', 'St. Barnabas Manastırı']
  },
  {
    id: 'karpaz',
    name: 'Karpaz Yarımadası',
    description: 'El değmemiş plajları, yabani eşekleri ve Apostolos Andreas Manastırı ile Kıbrıs\'ın en bakir bölgesi.',
    image: categoryBeach,
    highlights: ['Altın Kumsal', 'Apostolos Andreas Manastırı', 'Dipkarpaz Milli Parkı', 'Yabani Eşekler', 'Zafer Burnu']
  }
];

const practicalInfos: PracticalInfo[] = [
  {
    id: 'visa',
    icon: Plane,
    title: 'Vize & Pasaport',
    content: 'Türk vatandaşları sadece kimlik kartı ile giriş yapabilir. Pasaport damgası vurulmamasını talep edin.'
  },
  {
    id: 'currency',
    icon: CreditCard,
    title: 'Para Birimi',
    content: 'Türk Lirası geçerli. Euro ve Sterlin de kabul edilir. Çoğu mekan döviz cinsinden fiyatlandırma yapar.'
  },
  {
    id: 'plug',
    icon: Plug,
    title: 'Priz Tipi',
    content: 'İngiliz tipi (Type G) üç girişli prizler kullanılır. Adaptör yanınızda bulundurun.'
  },
  {
    id: 'traffic',
    icon: Car,
    title: 'Trafik Kuralları',
    content: 'Sol şerit trafiği! Direksiyon sağda. Türk ehliyeti geçerli. Araç kiralama önerilir.'
  },
  {
    id: 'weather',
    icon: Sun,
    title: 'İdeal Zaman',
    content: 'Nisan-Mayıs ve Eylül-Ekim en ideal dönemler. Yaz ayları çok sıcak ve nemli olabilir.'
  },
  {
    id: 'transport',
    icon: Ship,
    title: 'Ulaşım',
    content: 'Ercan Havalimanı\'na direkt uçuşlar var. Mersin\'den feribot ile de ulaşılabilir.'
  }
];

const attractions: Attraction[] = [
  {
    id: 'bellapais',
    name: 'Bellapais Manastırı',
    region: 'Girne',
    description: 'Doğu Akdeniz\'deki en güzel Gotik yapılardan biri. 13. yüzyılda Fransız rahipler tarafından inşa edilmiş.',
    image: categoryHistory,
    type: 'tarihi'
  },
  {
    id: 'kapali-maras',
    name: 'Kapalı Maraş (Varosha)',
    region: 'Gazimağusa',
    description: '1974\'ten beri kapalı olan hayalet şehir. Dünyanın en büyük terk edilmiş yerleşimlerinden biri.',
    image: categoryNature,
    type: 'tarihi'
  },
  {
    id: 'salamis',
    name: 'Salamis Antik Kenti',
    region: 'Gazimağusa',
    description: 'Kıbrıs\'ın en büyük antik şehri. Roma dönemi tiyatrosu, hamamları ve sütunları görülebilir.',
    image: categoryHistory,
    type: 'kultur'
  },
  {
    id: 'altin-kumsal',
    name: 'Altın Kumsal',
    region: 'Karpaz',
    description: 'Kıbrıs\'ın en uzun ve en bakir plajı. Caretta caretta kaplumbağalarının yuvalama alanı.',
    image: categoryBeach,
    type: 'plaj'
  },
  {
    id: 'girne-kalesi',
    name: 'Girne Kalesi',
    region: 'Girne',
    description: 'Bizans döneminden kalma kale. İçinde 2.300 yıllık dünyanın en eski batık gemisi sergileniyor.',
    image: heroCyprus,
    type: 'tarihi'
  },
  {
    id: 'buyuk-han',
    name: 'Büyük Han',
    region: 'Lefkoşa',
    description: 'Osmanlı döneminden kalma tarihi kervansaray. Şimdi butik dükkanlar ve kafeler barındırıyor.',
    image: categoryFood,
    type: 'kultur'
  }
];

const recommendedPlaces: RecommendedPlace[] = [
  {
    id: 'rec-1',
    name: 'Cratos Premium Hotel',
    type: 'otel',
    description: 'Girne\'nin en lüks 5 yıldızlı casino oteli. Denize sıfır konumu ve özel plajıyla öne çıkıyor.',
    image: heroCyprus,
    location: 'Girne',
    featured: true,
    sponsorBadge: 'Önerilen'
  },
  {
    id: 'rec-2',
    name: 'Bellapais Gardens Restaurant',
    type: 'restoran',
    description: 'Bellapais Manastırı yanında, manzaralı ve şömineli sıcak atmosferiyle benzersiz bir deneyim.',
    image: categoryFood,
    location: 'Bellapais, Girne',
    featured: true,
    sponsorBadge: 'Partner'
  },
  {
    id: 'rec-3',
    name: 'Escape Beach Club',
    type: 'plaj',
    description: 'Gün batımı partileri ve kokteyller eşliğinde Akdeniz\'in keyfini çıkarın.',
    image: categoryBeach,
    location: 'Girne',
    featured: true,
    sponsorBadge: 'Önerilen'
  },
  {
    id: 'rec-4',
    name: 'Merit Royal Premium',
    type: 'otel',
    description: 'Denize sıfır konumu, özel plajı ve spa merkezi ile lüks tatil deneyimi.',
    image: categoryNature,
    location: 'Girne',
    sponsorBadge: 'Partner'
  },
  {
    id: 'rec-5',
    name: 'Nima Restaurant & Lounge',
    type: 'restoran',
    description: 'Modern tasarımı ve zarif sunumlu tabakları ile Kordon Boyu\'nun gözdesi.',
    image: categoryFood,
    location: 'Girne Limanı',
    sponsorBadge: 'Önerilen'
  },
  {
    id: 'rec-6',
    name: 'Kaya Palazzo Resort',
    type: 'otel',
    description: 'Üç yüzme havuzu, spa merkezi ve özel plaj alanıyla aile dostu lüks tatil.',
    image: heroCyprus,
    location: 'Girne',
    sponsorBadge: 'Partner'
  }
];

const sectionTabs = [
  { id: 'regions', label: 'Bölgeler', icon: MapPin },
  { id: 'practical', label: 'Pratik Bilgiler', icon: Info },
  { id: 'attractions', label: 'Gezilecek Yerler', icon: Landmark },
  { id: 'recommended', label: 'Önerilen Mekanlar', icon: Sparkles }
];

export const CyprusGuide = () => {
  const [activeSection, setActiveSection] = useState<GuideSection>('regions');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  return (
    <div className="flex flex-col h-full">
      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 justify-center">
        {sectionTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as GuideSection)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeSection === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-black/30 text-white/80 hover:bg-black/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeSection === 'regions' && (
          <motion.div
            key="regions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1"
          >
            <RegionsSection regions={regions} onSelectRegion={setSelectedRegion} />
          </motion.div>
        )}

        {activeSection === 'practical' && (
          <motion.div
            key="practical"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1"
          >
            <PracticalSection infos={practicalInfos} />
          </motion.div>
        )}

        {activeSection === 'attractions' && (
          <motion.div
            key="attractions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1"
          >
            <AttractionsSection attractions={attractions} />
          </motion.div>
        )}

        {activeSection === 'recommended' && (
          <motion.div
            key="recommended"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1"
          >
            <RecommendedSection places={recommendedPlaces} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Region Detail Modal */}
      <AnimatePresence>
        {selectedRegion && (
          <RegionDetailModal region={selectedRegion} onClose={() => setSelectedRegion(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// Regions Section
const RegionsSection = ({ regions, onSelectRegion }: { regions: Region[], onSelectRegion: (r: Region) => void }) => (
  <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
    {regions.map((region, index) => (
      <motion.div
        key={region.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        onClick={() => onSelectRegion(region)}
        className="relative h-[200px] rounded-2xl overflow-hidden cursor-pointer group"
      >
        <img
          src={region.image}
          alt={region.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-white text-xl font-bold mb-1">{region.name}</h3>
          <p className="text-white/70 text-sm line-clamp-2">{region.description}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary text-xs font-medium">{region.highlights.length} önemli nokta</span>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// Practical Info Section
const PracticalSection = ({ infos }: { infos: PracticalInfo[] }) => (
  <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
    {infos.map((info, index) => (
      <motion.div
        key={info.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className="bg-black/40 backdrop-blur-sm rounded-xl p-5 border border-white/10"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
          <info.icon className="w-6 h-6 text-primary" />
        </div>
        <h4 className="text-white font-semibold mb-2">{info.title}</h4>
        <p className="text-white/70 text-sm leading-relaxed">{info.content}</p>
      </motion.div>
    ))}
  </div>
);

// Attractions Section
const AttractionsSection = ({ attractions }: { attractions: Attraction[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', updateScrollButtons);
      return () => ref.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth'
      });
    }
  };

  const typeLabels: Record<string, { label: string; color: string }> = {
    tarihi: { label: 'Tarihi', color: 'bg-amber-600' },
    plaj: { label: 'Plaj', color: 'bg-sky-500' },
    doga: { label: 'Doğa', color: 'bg-emerald-500' },
    kultur: { label: 'Kültür', color: 'bg-purple-500' }
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors border border-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors border border-white/10"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {attractions.map((attraction, index) => (
          <motion.div
            key={attraction.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex-shrink-0 w-[300px] bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 group cursor-pointer"
          >
            <div className="relative h-[160px]">
              <img
                src={attraction.image}
                alt={attraction.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 rounded-md ${typeLabels[attraction.type].color} text-white text-xs font-bold`}>
                  {typeLabels[attraction.type].label}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                  {attraction.region}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-white font-semibold text-lg mb-2">{attraction.name}</h4>
              <p className="text-white/70 text-sm line-clamp-2">{attraction.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Recommended Section - Sponsor/Partner işletmeler
const RecommendedSection = ({ places }: { places: RecommendedPlace[] }) => {
  const typeIcons: Record<string, React.ElementType> = {
    otel: Hotel,
    restoran: UtensilsCrossed,
    plaj: Waves,
    eglence: Star
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Featured Places */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {places.filter(p => p.featured).map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 group cursor-pointer"
          >
            <div className="relative h-[140px]">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              
              {/* Sponsor Badge */}
              {place.sponsorBadge && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    {place.sponsorBadge}
                  </span>
                </div>
              )}

              {/* Type Icon */}
              <div className="absolute top-3 right-3">
                <div className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  {(() => {
                    const Icon = typeIcons[place.type];
                    return <Icon className="w-4 h-4 text-white" />;
                  })()}
                </div>
              </div>
            </div>

            <div className="p-4">
              <h4 className="text-white font-semibold mb-1">{place.name}</h4>
              <p className="text-white/60 text-xs flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3" />
                {place.location}
              </p>
              <p className="text-white/70 text-sm line-clamp-2">{place.description}</p>
              <Button 
                size="sm" 
                className="mt-3 w-full bg-primary/90 hover:bg-primary text-primary-foreground text-xs font-semibold"
              >
                İncele
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* More Places */}
      <h4 className="text-white/80 text-sm font-medium mb-3">Diğer Öneriler</h4>
      <div className="grid grid-cols-3 gap-3">
        {places.filter(p => !p.featured).map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.08 }}
            className="flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-white/5 cursor-pointer hover:bg-black/40 transition-colors"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
              <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                {place.sponsorBadge && (
                  <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                )}
                <h5 className="text-white font-medium text-sm truncate">{place.name}</h5>
              </div>
              <p className="text-white/50 text-xs truncate">{place.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Region Detail Modal
const RegionDetailModal = ({ region, onClose }: { region: Region; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-6"
    onClick={onClose}
  >
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
    
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="relative bg-card rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
    >
      {/* Header Image */}
      <div className="relative h-[200px]">
        <img
          src={region.image}
          alt={region.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white rotate-180" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 -mt-10 relative">
        <h2 className="text-foreground text-2xl font-bold mb-3">{region.name}</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">{region.description}</p>

        <h4 className="text-foreground font-semibold mb-3 flex items-center gap-2">
          <Landmark className="w-4 h-4 text-primary" />
          Önemli Noktalar
        </h4>
        <div className="flex flex-wrap gap-2">
          {region.highlights.map((highlight, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium"
            >
              {highlight}
            </span>
          ))}
        </div>

        <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          Bu Bölgeyi Keşfet
        </Button>
      </div>
    </motion.div>
  </motion.div>
);
