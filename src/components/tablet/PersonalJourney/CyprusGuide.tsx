import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, MapPin, Info, Landmark, 
  UtensilsCrossed, Hotel, Waves, Car, CreditCard, Plug, 
  Clock, Plane, Ship, Sun, Sparkles, Star, BadgeCheck,
  Phone, Globe, Instagram, X
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

interface RegionPlace {
  id: string;
  name: string;
  type: 'otel' | 'restoran' | 'aktivite';
  description: string;
  image: string;
  rating?: number;
  priceRange?: string;
  sponsored?: boolean;
}

interface Region {
  id: string;
  name: string;
  description: string;
  image: string;
  highlights: string[];
  hotels: RegionPlace[];
  restaurants: RegionPlace[];
  activities: RegionPlace[];
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
  phone?: string;
  website?: string;
  instagram?: string;
  rating?: number;
  priceRange?: string;
}

// Data
const regions: Region[] = [
  {
    id: 'lefkosa',
    name: 'Lefkoşa',
    description: 'Dünyanın ikiye bölünmüş tek başkenti. Osmanlı, Venedik ve İngiliz mimarisinin iç içe geçtiği tarihi surlar içinde keşfedilecek çok şey var.',
    image: categoryHistory,
    highlights: ['Büyük Han', 'Selimiye Camii', 'Yeşil Hat', 'Zehra Sokak Kafeleri', 'Rüstem Kitabevi'],
    hotels: [
      { id: 'lef-h1', name: 'TasEV Guesthouse', type: 'otel', description: 'Venedik Sütunu yakınında butik konukevi', image: categoryHistory, rating: 4.5, priceRange: '$' },
      { id: 'lef-h2', name: 'Djumba Hotel & Cafe', type: 'otel', description: 'Havaalanı servisi ve restoranı bulunan otel', image: heroCyprus, rating: 4.2, priceRange: '$$' },
      { id: 'lef-h3', name: 'Hotel Sun', type: 'otel', description: 'Çatı havuzu olan üç yıldızlı konaklama', image: categoryNature, rating: 4.0, priceRange: '$$', sponsored: true }
    ],
    restaurants: [
      { id: 'lef-r1', name: 'The Soulist Coffee & Music House', type: 'restoran', description: 'Canlı müzik ve özel kahve deneyimi', image: categoryFood, rating: 4.7 },
      { id: 'lef-r2', name: 'Tezgah Cafe', type: 'restoran', description: 'Nostaljik ambiyans, taze cheesecake', image: categoryFood, rating: 4.5 },
      { id: 'lef-r3', name: 'Rest', type: 'restoran', description: 'Modern Kıbrıs mutfağı', image: categoryFood, rating: 4.3, sponsored: true }
    ],
    activities: [
      { id: 'lef-a1', name: 'Büyük Han Turu', type: 'aktivite', description: 'Osmanlı kervansarayında el sanatları keşfi', image: categoryHistory },
      { id: 'lef-a2', name: 'Yeşil Hat Yürüyüşü', type: 'aktivite', description: 'İkiye bölünmüş şehrin sınır hattı gezisi', image: categoryHistory },
      { id: 'lef-a3', name: 'Zehra Sokak Kafeleri', type: 'aktivite', description: 'Şehrin en hip bölgesinde takılmak', image: categoryFood }
    ]
  },
  {
    id: 'girne',
    name: 'Girne',
    description: 'Tarihi limanı, muhteşem kaleleri ve Beşparmak Dağları manzarasıyla Kıbrıs\'ın en çekici bölgesi.',
    image: heroCyprus,
    highlights: ['Girne Kalesi', 'Bellapais Manastırı', 'St. Hilarion Kalesi', 'Karmi Köyü', 'Escape Beach'],
    hotels: [
      { id: 'gir-h1', name: 'Cratos Premium Hotel', type: 'otel', description: '5 yıldızlı casino oteli, özel plaj', image: heroCyprus, rating: 4.8, priceRange: '$$$', sponsored: true },
      { id: 'gir-h2', name: 'Merit Royal Premium', type: 'otel', description: 'Denize sıfır, spa merkezi', image: categoryBeach, rating: 4.7, priceRange: '$$$', sponsored: true },
      { id: 'gir-h3', name: 'Bellapais Gardens', type: 'otel', description: 'Manastır manzaralı butik otel', image: categoryNature, rating: 4.6, priceRange: '$$' },
      { id: 'gir-h4', name: 'Kaya Palazzo Resort', type: 'otel', description: 'Aile dostu, 3 havuzlu resort', image: heroCyprus, rating: 4.5, priceRange: '$$$', sponsored: true }
    ],
    restaurants: [
      { id: 'gir-r1', name: 'Bellapais Gardens Restaurant', type: 'restoran', description: 'Manzaralı, şömineli atmosfer', image: categoryFood, rating: 4.8, sponsored: true },
      { id: 'gir-r2', name: 'Nima Restaurant & Lounge', type: 'restoran', description: 'Modern tasarım, zarif sunumlar', image: categoryFood, rating: 4.6, sponsored: true },
      { id: 'gir-r3', name: 'Niazi\'s Restaurant', type: 'restoran', description: 'Geleneksel Kıbrıs lezzetleri', image: categoryFood, rating: 4.4 },
      { id: 'gir-r4', name: 'The Archway', type: 'restoran', description: 'Liman manzaralı deniz ürünleri', image: categoryFood, rating: 4.5 }
    ],
    activities: [
      { id: 'gir-a1', name: 'Escape Beach Club', type: 'aktivite', description: 'Gün batımı partileri ve kokteyller', image: categoryBeach, sponsored: true },
      { id: 'gir-a2', name: 'St. Hilarion Kalesi Turu', type: 'aktivite', description: 'Masalsı kale ve panoramik manzara', image: categoryHistory },
      { id: 'gir-a3', name: 'Karmi Köyü Gezisi', type: 'aktivite', description: 'Pitoresk İngiliz kolonisi köyü', image: categoryNature },
      { id: 'gir-a4', name: 'Dalış Turu', type: 'aktivite', description: 'Akdeniz\'in berrak sularında dalış', image: categoryBeach }
    ]
  },
  {
    id: 'gazimagusa',
    name: 'Gazimağusa',
    description: 'Antik Salamis kalıntıları, Gotik mimarisi ve hayalet şehir Kapalı Maraş ile tarihin canlı bir müzesi.',
    image: categoryNature,
    highlights: ['Kapalı Maraş', 'Lala Mustafa Paşa Camii', 'Salamis Harabeleri', 'Othello Kalesi', 'St. Barnabas Manastırı'],
    hotels: [
      { id: 'gaz-h1', name: 'La Regina Veneziana', type: 'otel', description: 'Othello Kalesi yakınında otantik konak', image: categoryHistory, rating: 4.4, priceRange: '$$' },
      { id: 'gaz-h2', name: 'Salamis Bay Conti Resort', type: 'otel', description: 'Plaj kenarında her şey dahil', image: categoryBeach, rating: 4.3, priceRange: '$$', sponsored: true },
      { id: 'gaz-h3', name: 'Noah\'s Ark Deluxe', type: 'otel', description: 'Aquapark ve eğlence kompleksi', image: categoryNature, rating: 4.2, priceRange: '$$' }
    ],
    restaurants: [
      { id: 'gaz-r1', name: 'Petek Pastahanesi', type: 'restoran', description: 'Geleneksel tatlılar ve kahvaltı', image: categoryFood, rating: 4.5 },
      { id: 'gaz-r2', name: 'Garavolli Cafe Bar', type: 'restoran', description: 'Surlar içinde atmosferik mekan', image: categoryFood, rating: 4.3 },
      { id: 'gaz-r3', name: 'Caleo Fine Dining', type: 'restoran', description: 'İnce yemek deneyimi', image: categoryFood, rating: 4.6, sponsored: true }
    ],
    activities: [
      { id: 'gaz-a1', name: 'Kapalı Maraş Turu', type: 'aktivite', description: 'Hayalet şehri bisikletle keşfet', image: categoryNature },
      { id: 'gaz-a2', name: 'Salamis Antik Kenti', type: 'aktivite', description: 'Roma dönemi harabeleri gezisi', image: categoryHistory },
      { id: 'gaz-a3', name: 'Palm Beach Plajı', type: 'aktivite', description: 'Maraş manzaralı kumsalda yüzme', image: categoryBeach }
    ]
  },
  {
    id: 'karpaz',
    name: 'Karpaz Yarımadası',
    description: 'El değmemiş plajları, yabani eşekleri ve Apostolos Andreas Manastırı ile Kıbrıs\'ın en bakir bölgesi.',
    image: categoryBeach,
    highlights: ['Altın Kumsal', 'Apostolos Andreas Manastırı', 'Dipkarpaz Milli Parkı', 'Yabani Eşekler', 'Zafer Burnu'],
    hotels: [
      { id: 'kar-h1', name: 'Karpaz Gate Marina Hotel', type: 'otel', description: 'Marina kenarında lüks konaklama', image: heroCyprus, rating: 4.5, priceRange: '$$$' },
      { id: 'kar-h2', name: 'Theresa Hotel', type: 'otel', description: 'Yabani eşeklerin yakınında butik otel', image: categoryNature, rating: 4.2, priceRange: '$$' }
    ],
    restaurants: [
      { id: 'kar-r1', name: 'Big Sand Beach Restaurant', type: 'restoran', description: 'Altın Kumsal\'da deniz ürünleri', image: categoryFood, rating: 4.4 },
      { id: 'kar-r2', name: 'Dipkarpaz Köy Kahvesi', type: 'restoran', description: 'Otantik köy kahvaltısı', image: categoryFood, rating: 4.3 }
    ],
    activities: [
      { id: 'kar-a1', name: 'Altın Kumsal', type: 'aktivite', description: 'Kıbrıs\'ın en bakir plajında yüzme', image: categoryBeach },
      { id: 'kar-a2', name: 'Yabani Eşek Safari', type: 'aktivite', description: 'Doğal yaşam alanında eşek gözlemi', image: categoryNature },
      { id: 'kar-a3', name: 'Apostolos Andreas Manastırı', type: 'aktivite', description: 'Yarımadanın ucundaki kutsal mekan', image: categoryHistory }
    ]
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
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    location: 'Catalkoy, Girne',
    featured: true,
    sponsorBadge: 'Önerilen',
    phone: '+90 392 650 0500',
    website: 'cratospremium.com',
    instagram: '@cratospremiumhotel',
    rating: 4.8,
    priceRange: '$$$'
  },
  {
    id: 'rec-2',
    name: 'Bellapais Gardens Restaurant',
    type: 'restoran',
    description: 'Bellapais Manastırı yanında, manzaralı ve şömineli sıcak atmosferiyle benzersiz bir deneyim.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    location: 'Bellapais, Girne',
    featured: true,
    sponsorBadge: 'Partner',
    phone: '+90 392 815 6066',
    instagram: '@bellapaisgarden',
    rating: 4.7,
    priceRange: '$$'
  },
  {
    id: 'rec-3',
    name: 'Escape Beach Club',
    type: 'plaj',
    description: 'Gün batımı partileri ve kokteyller eşliğinde Akdeniz\'in keyfini çıkarın.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    location: 'Alsancak, Girne',
    featured: true,
    sponsorBadge: 'Önerilen',
    phone: '+90 533 888 0088',
    instagram: '@escapebeachclubcyprus',
    rating: 4.6
  },
  {
    id: 'rec-4',
    name: 'Merit Royal Premium',
    type: 'otel',
    description: 'Denize sıfır konumu, özel plajı ve spa merkezi ile lüks tatil deneyimi.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    location: 'Alsancak, Girne',
    sponsorBadge: 'Partner',
    phone: '+90 392 650 0000',
    website: 'merithotels.com',
    instagram: '@meritroyalpremium',
    rating: 4.7,
    priceRange: '$$$'
  },
  {
    id: 'rec-5',
    name: 'Nima Restaurant & Lounge',
    type: 'restoran',
    description: 'Modern tasarımı ve zarif sunumlu tabakları ile Kordon Boyu\'nun gözdesi.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    location: 'Girne Limanı',
    sponsorBadge: 'Önerilen',
    phone: '+90 392 815 2121',
    instagram: '@nimacyprus',
    rating: 4.5,
    priceRange: '$$'
  },
  {
    id: 'rec-6',
    name: 'Kaya Palazzo Resort',
    type: 'otel',
    description: 'Üç yüzme havuzu, spa merkezi ve özel plaj alanıyla aile dostu lüks tatil.',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    location: 'Catalkoy, Girne',
    sponsorBadge: 'Partner',
    phone: '+90 392 650 2100',
    website: 'kayahotels.com',
    instagram: '@kayapalazzocyprus',
    rating: 4.6,
    priceRange: '$$$'
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
  const [selectedPlace, setSelectedPlace] = useState<RecommendedPlace | null>(null);
  
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
            onClick={() => setSelectedPlace(place)}
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

              {/* Rating */}
              {place.rating && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-xs font-medium">{place.rating}</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white font-semibold">{place.name}</h4>
                {place.priceRange && (
                  <span className="text-primary text-xs font-bold">{place.priceRange}</span>
                )}
              </div>
              <p className="text-white/60 text-xs flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3" />
                {place.location}
              </p>
              <p className="text-white/70 text-sm line-clamp-2">{place.description}</p>
              
              {/* Contact Icons */}
              <div className="flex items-center gap-2 mt-3">
                {place.phone && (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 text-white/70" />
                  </div>
                )}
                {place.instagram && (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <Instagram className="w-3.5 h-3.5 text-white/70" />
                  </div>
                )}
                {place.website && (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <Globe className="w-3.5 h-3.5 text-white/70" />
                  </div>
                )}
                <Button 
                  size="sm" 
                  className="ml-auto bg-primary/90 hover:bg-primary text-primary-foreground text-xs font-semibold h-7 px-3"
                >
                  İncele
                </Button>
              </div>
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
            onClick={() => setSelectedPlace(place)}
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
                {place.rating && (
                  <span className="text-yellow-400 text-xs flex items-center gap-0.5 ml-auto">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    {place.rating}
                  </span>
                )}
              </div>
              <p className="text-white/50 text-xs truncate">{place.location}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Place Detail Modal */}
      <AnimatePresence>
        {selectedPlace && (
          <PlaceDetailModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// Place Detail Modal
const PlaceDetailModal = ({ place, onClose }: { place: RecommendedPlace; onClose: () => void }) => (
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
      className="relative bg-card rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl"
    >
      {/* Header Image */}
      <div className="relative h-[200px]">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {place.sponsorBadge && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4" />
              {place.sponsorBadge}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 -mt-10 relative">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-foreground text-xl font-bold">{place.name}</h2>
          {place.rating && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/20">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-yellow-500 font-bold">{place.rating}</span>
            </div>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm flex items-center gap-1.5 mb-4">
          <MapPin className="w-4 h-4" />
          {place.location}
          {place.priceRange && (
            <span className="ml-2 text-primary font-bold">{place.priceRange}</span>
          )}
        </p>
        
        <p className="text-muted-foreground leading-relaxed mb-6">{place.description}</p>

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          {place.phone && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium">{place.phone}</p>
                <p className="text-muted-foreground text-xs">Telefon</p>
              </div>
            </div>
          )}
          
          {place.instagram && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                <Instagram className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="text-foreground font-medium">{place.instagram}</p>
                <p className="text-muted-foreground text-xs">Instagram</p>
              </div>
            </div>
          )}
          
          {place.website && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-foreground font-medium">{place.website}</p>
                <p className="text-muted-foreground text-xs">Website</p>
              </div>
            </div>
          )}
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          Rezervasyon Yap
        </Button>
      </div>
    </motion.div>
  </motion.div>
);

// Region Detail Modal with Hotels, Restaurants, Activities
const RegionDetailModal = ({ region, onClose }: { region: Region; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'highlights' | 'hotels' | 'restaurants' | 'activities'>('highlights');
  
  const tabs = [
    { id: 'highlights', label: 'Önemli Noktalar', icon: Landmark },
    { id: 'hotels', label: 'Oteller', icon: Hotel, count: region.hotels.length },
    { id: 'restaurants', label: 'Restoranlar', icon: UtensilsCrossed, count: region.restaurants.length },
    { id: 'activities', label: 'Aktiviteler', icon: Waves, count: region.activities.length }
  ];

  return (
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
        className="relative bg-card rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl max-h-[85vh] flex flex-col"
      >
        {/* Header Image */}
        <div className="relative h-[180px] shrink-0">
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
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="absolute bottom-4 left-6">
            <h2 className="text-white text-2xl font-bold">{region.name}</h2>
            <p className="text-white/70 text-sm mt-1 line-clamp-2 max-w-lg">{region.description}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 py-3 border-b border-border/50 shrink-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-muted-foreground/20'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'highlights' && (
              <motion.div
                key="highlights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex flex-wrap gap-2">
                  {region.highlights.map((highlight, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'hotels' && (
              <motion.div
                key="hotels"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-2 gap-4"
              >
                {region.hotels.map((hotel, i) => (
                  <PlaceCard key={hotel.id} place={hotel} index={i} />
                ))}
              </motion.div>
            )}

            {activeTab === 'restaurants' && (
              <motion.div
                key="restaurants"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-2 gap-4"
              >
                {region.restaurants.map((restaurant, i) => (
                  <PlaceCard key={restaurant.id} place={restaurant} index={i} />
                ))}
              </motion.div>
            )}

            {activeTab === 'activities' && (
              <motion.div
                key="activities"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-2 gap-4"
              >
                {region.activities.map((activity, i) => (
                  <PlaceCard key={activity.id} place={activity} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Place Card Component for Region Modal
const PlaceCard = ({ place, index }: { place: RegionPlace; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-muted/50 rounded-xl overflow-hidden group cursor-pointer hover:bg-muted transition-colors"
  >
    <div className="relative h-[100px]">
      <img
        src={place.image}
        alt={place.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {place.sponsored && (
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold">
            Önerilen
          </span>
        </div>
      )}
      {place.rating && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs">{place.rating}</span>
        </div>
      )}
    </div>
    <div className="p-3">
      <div className="flex items-center justify-between mb-1">
        <h5 className="text-foreground font-semibold text-sm">{place.name}</h5>
        {place.priceRange && (
          <span className="text-primary text-xs font-bold">{place.priceRange}</span>
        )}
      </div>
      <p className="text-muted-foreground text-xs line-clamp-2">{place.description}</p>
    </div>
  </motion.div>
);
