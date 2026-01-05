import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Waves, Landmark, UtensilsCrossed, PartyPopper, Mountain, Palette, 
  Star, MapPin, Phone, Globe, Clock, ChevronLeft, ChevronRight, 
  ArrowUpRight, X, Smartphone, Wifi, Car, Coffee, Dumbbell, Sparkles,
  Users, Music, Camera, Award, Heart
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import QRCode from 'react-qr-code';

// Import category images
import categoryBeach from '@/assets/category-beach.jpg';
import categoryFood from '@/assets/category-food.jpg';
import categoryNightlife from '@/assets/category-nightlife.jpg';
import categoryHistory from '@/assets/category-history.jpg';
import categoryNature from '@/assets/category-nature.jpg';
import categoryShopping from '@/assets/category-shopping.jpg';

// Types
interface CategoryPlace {
  id: string;
  name: string;
  description: string;
  region: string;
  rating: number;
  priceRange?: string;
  images: string[];
  website?: string;
  phone?: string;
  hours?: string;
  address?: string;
  features: string[];
  menuHighlights?: string[]; // For restaurants
  roomTypes?: string[]; // For hotels
  activities?: string[]; // For beaches/nature
  highlights?: string[]; // General highlights
  sponsored?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  image: string;
  sponsorName: string;
  sponsorPlaceCount: number;
  places: CategoryPlace[];
}

// Categories Data with 10+ places each
const categoriesData: Category[] = [
  {
    id: 'beaches',
    name: 'Plajlar & Koylar',
    icon: Waves,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500',
    image: categoryBeach,
    sponsorName: 'Karpaz Altınkum Beach',
    sponsorPlaceCount: 12,
    places: [
      {
        id: 'beach-1',
        name: 'Escape Beach Club',
        description: 'Kuzey Kıbrıs\'ın en popüler plaj kulübü. DJ performansları, su sporları ve enfes mutfak bir arada. Gün batımı partileriyle ünlü.',
        region: 'Alsancak, Girne',
        rating: 4.8,
        priceRange: '€€€',
        images: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
          'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
        ],
        website: 'escapebeachclub.com',
        phone: '+90 548 850 0000',
        hours: '10:00 - 02:00',
        address: 'Alsancak, Girne',
        features: ['Su Sporları', 'Restoran', 'Bar', 'Canlı DJ', 'Şezlong', 'Duş'],
        activities: ['Jet Ski', 'Parasailing', 'Banana', 'Wakeboard'],
        highlights: ['Gün batımı manzarası', 'VIP Kabinler', 'Pool Party'],
        sponsored: true
      },
      {
        id: 'beach-2',
        name: 'Altınkum Beach (Golden Beach)',
        description: 'Karpaz yarımadasının ucunda bozulmamış doğal plaj. Deniz kaplumbağalarının yuvalama alanı olarak korunmaktadır.',
        region: 'Karpaz',
        rating: 4.9,
        images: [
          'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800',
          'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800'
        ],
        website: 'northcyprus.cc/golden-beach',
        hours: '24 saat açık',
        address: 'Karpaz Yarımadası',
        features: ['Doğal Plaj', 'Kamp Alanı', 'Kaplumbağa Gözlemi', 'Ücretsiz Giriş'],
        activities: ['Yüzme', 'Güneşlenme', 'Kamp', 'Doğa Yürüyüşü'],
        highlights: ['Caretta Caretta yuvalama alanı', 'El değmemiş doğa', 'Gece yıldız gözlemi']
      },
      {
        id: 'beach-3',
        name: 'Alagadi Turtle Beach',
        description: 'Caretta caretta kaplumbağalarının yuvalama alanı. Yaz gecelerinde kaplumbağa gözlem turları düzenlenmektedir.',
        region: 'Girne',
        rating: 4.7,
        images: [
          'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800',
          'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?w=800'
        ],
        website: 'marinecyprus.org',
        phone: '+90 392 815 2122',
        hours: 'Gündoğumu - Gün batımı',
        address: 'Alagadi, Girne',
        features: ['Koruma Alanı', 'Eğitim Turları', 'Gece Gözlemi', 'Gönüllü Programı'],
        activities: ['Kaplumbağa Gözlemi', 'Eğitim Turları', 'Fotoğrafçılık'],
        highlights: ['Haziran-Ekim kaplumbağa sezonu', 'Marine Turtle Conservation Project']
      },
      {
        id: 'beach-4',
        name: 'Kervansaray Beach',
        description: 'Lüks otel kompleksi içinde yer alan özel plaj. Tam donanımlı hizmet ve kristal berraklığında su.',
        region: 'Girne',
        rating: 4.6,
        priceRange: '€€€€',
        images: [
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
        ],
        website: 'kervansarayhotels.com',
        phone: '+90 392 815 2001',
        hours: '09:00 - 19:00',
        address: 'Lapta, Girne',
        features: ['Özel Plaj', 'Havuz', 'Restoran', 'Spa', 'Su Sporları'],
        activities: ['Dalış', 'Snorkeling', 'Kano', 'Plaj Voleybolu'],
        highlights: ['5 yıldızlı hizmet', 'Özel kabinler', 'Plaj restoranı']
      },
      {
        id: 'beach-5',
        name: 'Acapulco Beach',
        description: 'Eğlence ve tatil bir arada. Geniş sahil şeridi, su parkı ve canlı plaj aktiviteleri ile aile dostu.',
        region: 'Girne',
        rating: 4.5,
        priceRange: '€€€',
        images: [
          'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
          'https://images.unsplash.com/photo-1596273501048-cf3f9f32b9f1?w=800'
        ],
        website: 'acapulco.com.tr',
        phone: '+90 392 824 4949',
        hours: '10:00 - 00:00',
        address: 'Çatalköy, Girne',
        features: ['Su Parkı', 'Plaj Barı', 'Canlı Müzik', 'Çocuk Kulübü', 'Restoran'],
        activities: ['Su Parkı', 'Plaj Oyunları', 'Canlı Eğlence'],
        highlights: ['Aile dostu', 'Tüm gün eğlence', 'Akşam partileri']
      },
      {
        id: 'beach-6',
        name: 'Glapsides Beach',
        description: 'Gazimağusa\'nın en güzel plajlarından biri. Tarihi kalenin yakınında, altın sarısı kum.',
        region: 'Gazimağusa',
        rating: 4.4,
        images: [
          'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
        ],
        hours: 'Gündüz saatleri',
        address: 'Gazimağusa',
        features: ['Altın Kum', 'Şezlong', 'Kafeterya', 'Duş'],
        activities: ['Yüzme', 'Güneşlenme', 'Voleybol'],
        highlights: ['Tarihi kale manzarası', 'Sığ ve güvenli su']
      },
      {
        id: 'beach-7',
        name: 'Deniz Kızı Beach',
        description: 'Romantik atmosferi ve muhteşem gün batımı manzarasıyla ünlü butik plaj.',
        region: 'Girne',
        rating: 4.6,
        priceRange: '€€',
        images: [
          'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800',
          'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800'
        ],
        website: 'denizkizihotel.com',
        phone: '+90 392 815 1510',
        hours: '09:00 - 22:00',
        address: 'Alsancak, Girne',
        features: ['Romantik Atmosfer', 'Restoran', 'Bar', 'Gün Batımı'],
        activities: ['Romantik akşam yemeği', 'Gün batımı seyri'],
        highlights: ['Evlilik teklifi lokasyonu', 'Özel akşam yemekleri']
      },
      {
        id: 'beach-8',
        name: 'Silver Beach',
        description: 'Gümüş renkli kumlarıyla dikkat çeken sakin ve huzurlu bir plaj.',
        region: 'Gazimağusa',
        rating: 4.3,
        images: [
          'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800',
          'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=800'
        ],
        hours: 'Gündüz saatleri',
        address: 'Bafra, Gazimağusa',
        features: ['Sakin Ortam', 'Doğal Güzellik', 'Temiz Su'],
        activities: ['Yüzme', 'Dinlenme', 'Kitap okuma'],
        highlights: ['Kalabalıktan uzak', 'Meditasyon için ideal']
      },
      {
        id: 'beach-9',
        name: 'Palm Beach',
        description: 'Palmiyelerle çevrili tropikal atmosfere sahip popüler plaj. Hafta sonu partileriyle ünlü.',
        region: 'Gazimağusa',
        rating: 4.5,
        priceRange: '€€',
        images: [
          'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
          'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800'
        ],
        website: 'palmbeachcyprus.com',
        phone: '+90 392 366 5555',
        hours: '10:00 - 23:00',
        address: 'Gazimağusa',
        features: ['Tropikal Atmosfer', 'Beach Bar', 'Restoran', 'Canlı Müzik'],
        activities: ['Hafta sonu partileri', 'Voleybol', 'Su sporları'],
        highlights: ['DJ performansları', 'Palmiye ağaçları']
      },
      {
        id: 'beach-10',
        name: 'Kaplıca Beach',
        description: 'Doğal termal kaynakların denize aktığı benzersiz bir plaj. Sağlık turizmi için ideal.',
        region: 'Dipkarpaz',
        rating: 4.4,
        images: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
        ],
        hours: '24 saat açık',
        address: 'Kaplıca Köyü, Dipkarpaz',
        features: ['Termal Su', 'Doğal Sağlık', 'Sessiz Ortam'],
        activities: ['Termal banyo', 'Yüzme', 'Wellness'],
        highlights: ['Doğal termal kaynaklar', 'Şifalı sular']
      }
    ]
  },
  {
    id: 'historical',
    name: 'Tarihi Yerler',
    icon: Landmark,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500',
    image: categoryHistory,
    sponsorName: 'Bellapais Monastery',
    sponsorPlaceCount: 15,
    places: [
      {
        id: 'hist-1',
        name: 'Bellapais Manastırı',
        description: '13. yüzyıldan kalma muhteşem Gotik manastır. Akdeniz\'in en iyi korunmuş Gotik yapılarından biri. Lawrence Durrell\'in "Bitter Lemons" kitabında ölümsüzleştirdi.',
        region: 'Girne',
        rating: 4.9,
        images: [
          'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
          'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800',
          'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'
        ],
        website: 'bellapaisfestival.com',
        phone: '+90 392 815 7530',
        hours: '09:00 - 18:00',
        address: 'Bellapais Köyü, Girne',
        features: ['UNESCO Miras Adayı', 'Konser Mekanı', 'Müze', 'Fotoğraf Noktası'],
        highlights: ['Gotik mimari', 'Akdeniz manzarası', 'Müzik festivalleri'],
        sponsored: true
      },
      {
        id: 'hist-2',
        name: 'Girne Kalesi',
        description: 'Girne limanının simgesi olan tarihi kale. İçinde dünyaca ünlü Batık Gemi Müzesi bulunmaktadır. M.Ö. 4. yüzyıldan kalma gemi kalıntıları sergilenmektedir.',
        region: 'Girne',
        rating: 4.8,
        images: [
          'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800',
          'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800'
        ],
        website: 'girnemuzeleri.gov.ct.tr',
        phone: '+90 392 815 2145',
        hours: '09:00 - 17:00',
        address: 'Girne Limanı',
        features: ['Batık Gemi Müzesi', 'Tarihi Kale', 'Liman Manzarası', 'Sergi Salonları'],
        highlights: ['2300 yıllık gemi kalıntısı', 'Bizans ve Osmanlı dönemi eserleri']
      },
      {
        id: 'hist-3',
        name: 'St. Hilarion Kalesi',
        description: 'Dağların zirvesindeki peri masalı kalesi. Walt Disney\'in Pamuk Prenses filmindeki kaleye ilham verdiği söylenir.',
        region: 'Girne Dağları',
        rating: 4.9,
        images: [
          'https://images.unsplash.com/photo-1541417904950-b855846fe074?w=800',
          'https://images.unsplash.com/photo-1568480541481-fc6dbe53a82c?w=800'
        ],
        website: 'sthilarion.com',
        hours: '09:00 - 17:00',
        address: 'Girne Dağları',
        features: ['Dağ Kalesi', 'Panoramik Manzara', 'Yürüyüş Parkuru', 'Fotoğraf Cenneti'],
        highlights: ['700m rakımda', 'Disney\'e ilham verdi', '360 derece manzara']
      },
      {
        id: 'hist-4',
        name: 'Salamis Antik Kenti',
        description: 'Antik dönemin en önemli şehirlerinden biri. Roma hamamları, gymnasium ve antik tiyatro kalıntıları muhteşem durumda korunmuş.',
        region: 'Gazimağusa',
        rating: 4.7,
        images: [
          'https://images.unsplash.com/photo-1601984842924-63d5bd78fe6d?w=800',
          'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'
        ],
        hours: '09:00 - 17:00',
        address: 'Gazimağusa',
        features: ['Antik Kent', 'Roma Hamamları', 'Gymnasium', 'Antik Tiyatro'],
        highlights: ['M.Ö. 11. yüzyıl', 'Denize sıfır arkeoloji alanı', 'UNESCO önerilen liste']
      },
      {
        id: 'hist-5',
        name: 'Büyük Han',
        description: 'Osmanlı döneminden kalma tarihi kervansaray. Bugün kafeler, sanat galerileri ve el sanatları dükkanları barındırmaktadır.',
        region: 'Lefkoşa',
        rating: 4.8,
        images: [
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
          'https://images.unsplash.com/photo-1566404791232-af9fe978f179?w=800'
        ],
        hours: '09:00 - 22:00',
        address: 'Arabahmet, Lefkoşa',
        features: ['Tarihi Kervansaray', 'El Sanatları', 'Kafeler', 'Sanat Galerileri'],
        highlights: ['1572 yılında inşa edildi', 'Osmanlı mimarisi', 'Canlı kültür merkezi']
      },
      {
        id: 'hist-6',
        name: 'Gazimağusa Surları',
        description: 'Dünyanın en iyi korunmuş Venedik surlarından biri. 3.5 km uzunluğundaki surlar şehri çevreler.',
        region: 'Gazimağusa',
        rating: 4.6,
        images: [
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
        ],
        hours: '24 saat açık (dış alan)',
        address: 'Gazimağusa Eski Şehir',
        features: ['Venedik Mimarisi', 'Tarihi Surlar', 'Othello Kalesi', 'Yürüyüş Parkuru'],
        highlights: ['1492-1544 arası inşa', 'Shakespeare\'in Othello\'su', '15 burç']
      },
      {
        id: 'hist-7',
        name: 'Othello Kalesi',
        description: 'Shakespeare\'in ünlü trajedisi Othello\'nun geçtiği yer olarak bilinen Venedik dönemi kalesi.',
        region: 'Gazimağusa',
        rating: 4.5,
        images: [
          'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800',
          'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'
        ],
        phone: '+90 392 366 1718',
        hours: '09:00 - 17:00',
        address: 'Gazimağusa Limanı',
        features: ['Shakespeare Mirası', 'Venedik Kalesi', 'Liman Manzarası'],
        highlights: ['14. yüzyıl', 'Othello hikayesi', 'Limana hakim konum']
      },
      {
        id: 'hist-8',
        name: 'Lala Mustafa Paşa Camii',
        description: 'Eski adıyla St. Nicholas Katedrali. Gotik mimari şaheseri, Kıbrıs\'ın en büyük ortaçağ yapısı.',
        region: 'Gazimağusa',
        rating: 4.8,
        images: [
          'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
          'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800'
        ],
        hours: 'Namaz vakitleri dışında',
        address: 'Gazimağusa Meydanı',
        features: ['Gotik Mimari', 'Aktif Cami', 'Tarihi Değer'],
        highlights: ['1298-1312 arası inşa', 'Lusignan dönemi', 'Fransa\'daki Reims Katedralinden esinlenildi']
      },
      {
        id: 'hist-9',
        name: 'Kantara Kalesi',
        description: 'Beşparmak dağlarındaki üç kaleden biri. Hem kuzeyi hem güneyi gören stratejik konumuyla ünlü.',
        region: 'İskele',
        rating: 4.4,
        images: [
          'https://images.unsplash.com/photo-1541417904950-b855846fe074?w=800',
          'https://images.unsplash.com/photo-1568480541481-fc6dbe53a82c?w=800'
        ],
        hours: '09:00 - 17:00',
        address: 'Kantara, İskele',
        features: ['Dağ Kalesi', 'Panoramik Manzara', 'Yürüyüş'],
        highlights: ['Bizans ve Lüzinyan dönemi', '630m rakım', 'Karşılıklı deniz manzarası']
      },
      {
        id: 'hist-10',
        name: 'Selimiye Camii',
        description: 'Eski adıyla Ayasofya Katedrali. Lefkoşa\'nın simgesi, Lüzinyan döneminin en önemli yapısı.',
        region: 'Lefkoşa',
        rating: 4.7,
        images: [
          'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
          'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800'
        ],
        hours: 'Namaz vakitleri dışında',
        address: 'Selimiye Meydanı, Lefkoşa',
        features: ['Gotik Katedral', 'Osmanlı Minareleri', 'Şehrin Simgesi'],
        highlights: ['1209-1326 arası inşa', 'Kral taç giyme merasimi', 'Lefkoşa\'nın en yüksek yapısı']
      }
    ]
  },
  {
    id: 'food',
    name: 'Yeme İçme',
    icon: UtensilsCrossed,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    image: categoryFood,
    sponsorName: 'Niazi\'s Restaurant',
    sponsorPlaceCount: 14,
    places: [
      {
        id: 'food-1',
        name: 'Niazi\'s Restaurant',
        description: 'Kıbrıs mutfağının efsanevi adresi. 1949\'dan beri aynı tariflerle hazırlanan kebaplar ve mezeler. Bir Kıbrıs klasiği.',
        region: 'Girne',
        rating: 4.8,
        priceRange: '€€',
        images: [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
          'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
          'https://images.unsplash.com/photo-1529543544277-750e-4573-aaee-f31cf9788abe?w=800'
        ],
        website: 'niazis.com',
        phone: '+90 392 815 2160',
        hours: '12:00 - 23:00',
        address: 'Girne Limanı',
        features: ['Kıbrıs Mutfağı', 'Açık Hava', 'Deniz Manzarası', 'Aile Dostu'],
        menuHighlights: ['Şeftali Kebabı', 'Hellim', 'Molehiya', 'Kleftiko', 'Kıbrıs Mezesi'],
        highlights: ['75 yıllık gelenek', 'Orijinal tarifler', 'Liman manzarası'],
        sponsored: true
      },
      {
        id: 'food-2',
        name: 'Archway Restaurant',
        description: 'Girne limanının en ikonik restoranı. Tarihi kemerlerin altında deniz ürünleri ve Akdeniz mutfağı.',
        region: 'Girne',
        rating: 4.7,
        priceRange: '€€€',
        images: [
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
          'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800'
        ],
        website: 'archwayrestaurant.com',
        phone: '+90 392 815 2930',
        hours: '11:00 - 00:00',
        address: 'Girne Antik Liman',
        features: ['Deniz Ürünleri', 'Tarihi Mekan', 'Romantik', 'Canlı Müzik'],
        menuHighlights: ['Taze Balık', 'Karides Güveç', 'Ahtapot Salata', 'Levrek Dolma'],
        highlights: ['Tarihi kemerler altında', 'Liman manzarası', 'Canlı caz geceleri']
      },
      {
        id: 'food-3',
        name: 'Stone Castle Restaurant',
        description: 'St. Hilarion yolunda, panoramik manzaralı lüks restoran. Kıbrıs ve uluslararası mutfak.',
        region: 'Girne',
        rating: 4.6,
        priceRange: '€€€€',
        images: [
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
          'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800'
        ],
        phone: '+90 392 822 2005',
        hours: '19:00 - 23:00',
        address: 'St. Hilarion Yolu',
        features: ['Fine Dining', 'Panoramik Manzara', 'Şarap Mahzeni', 'Özel Günler'],
        menuHighlights: ['Kuzu Tandır', 'Steak', 'Şarap Eşleştirmesi', 'Özel Tatlılar'],
        highlights: ['Girne manzarası', 'Romantik akşam yemeği', 'Premium şaraplar']
      },
      {
        id: 'food-4',
        name: 'Jashan',
        description: 'Kuzey Kıbrıs\'ın en iyi Hint restoranı. Otantik tatlar ve zengin meze çeşitleri.',
        region: 'Girne',
        rating: 4.5,
        priceRange: '€€',
        images: [
          'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
          'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800'
        ],
        website: 'jashancyprus.com',
        phone: '+90 392 815 9191',
        hours: '12:00 - 23:00',
        address: 'Girne',
        features: ['Hint Mutfağı', 'Vejetaryen Seçenekler', 'Baharatlı', 'Taze Naan'],
        menuHighlights: ['Butter Chicken', 'Tandoori', 'Biryani', 'Naan Çeşitleri'],
        highlights: ['Otantik Hint tarifleri', 'Taze baharatlar', 'Vejetaryen dostu']
      },
      {
        id: 'food-5',
        name: 'Ambiance Restaurant',
        description: 'Bellapais\'de, manastır manzaralı şık restoran. Fusion mutfak ve yaratıcı kokteyller.',
        region: 'Bellapais',
        rating: 4.7,
        priceRange: '€€€',
        images: [
          'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800',
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'
        ],
        phone: '+90 392 815 3535',
        hours: '18:00 - 00:00',
        address: 'Bellapais',
        features: ['Manastır Manzarası', 'Fusion', 'Kokteyl Bar', 'Romantik'],
        menuHighlights: ['Fusion Mezeler', 'Grilled Seabass', 'Signature Kokteyller'],
        highlights: ['Bellapais Manastırı manzarası', 'Gün batımı seyreti', 'Özel teras']
      },
      {
        id: 'food-6',
        name: 'Hemingway\'s',
        description: 'Amerikan stili steakhouse ve bar. Kaliteli etler, geniş içki menüsü ve spor yayınları.',
        region: 'Girne',
        rating: 4.4,
        priceRange: '€€€',
        images: [
          'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
          'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=800'
        ],
        phone: '+90 392 815 2121',
        hours: '12:00 - 02:00',
        address: 'Girne Merkez',
        features: ['Steakhouse', 'Spor Bar', 'Canlı Müzik', 'Gece Hayatı'],
        menuHighlights: ['T-Bone Steak', 'Burgurlar', 'Kaburga', 'Craft Biralar'],
        highlights: ['Premium etler', 'Spor yayınları', 'Canlı performanslar']
      },
      {
        id: 'food-7',
        name: 'The Grapevine',
        description: 'Geleneksel Kıbrıs köy evi atmosferinde otantik yemekler. Bağ evinde meze deneyimi.',
        region: 'Girne',
        rating: 4.6,
        priceRange: '€€',
        images: [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'
        ],
        phone: '+90 392 821 4565',
        hours: '18:00 - 23:00',
        address: 'Ozanköy',
        features: ['Köy Mutfağı', 'Otantik Atmosfer', 'Ev Yapımı', 'Şarap'],
        menuHighlights: ['Full Meze', 'Köy Ekmeği', 'Ev Şarabı', 'Tatlılar'],
        highlights: ['Tarihi köy evi', 'Geleneksel tarifler', 'Samimi ortam']
      },
      {
        id: 'food-8',
        name: 'Xinjiang Restaurant',
        description: 'Otantik Çin ve Uygur mutfağı. El yapımı erişte, mantı ve özel soslar.',
        region: 'Girne',
        rating: 4.3,
        priceRange: '€€',
        images: [
          'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
          'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800'
        ],
        phone: '+90 392 815 4888',
        hours: '12:00 - 22:30',
        address: 'Girne',
        features: ['Çin Mutfağı', 'Uygur Yemekleri', 'El Yapımı Erişte', 'Otantik'],
        menuHighlights: ['Laghman', 'Dim Sum', 'Pekin Ördeği', 'Mantı'],
        highlights: ['El çekme erişte', 'Otantik tarifler', 'Aile işletmesi']
      },
      {
        id: 'food-9',
        name: 'Efendi Restaurant',
        description: 'Osmanlı saray mutfağından ilham alan lüks restoran. Tarihi atmosferde özel lezzetler.',
        region: 'Lefkoşa',
        rating: 4.5,
        priceRange: '€€€€',
        images: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'
        ],
        phone: '+90 392 228 1818',
        hours: '19:00 - 23:00',
        address: 'Büyük Han, Lefkoşa',
        features: ['Osmanlı Mutfağı', 'Fine Dining', 'Tarihi Mekan', 'Özel Günler'],
        menuHighlights: ['Hünkar Beğendi', 'Kuzu Tandir', 'Osmanlı Tatlıları'],
        highlights: ['Büyük Han içinde', 'Tarihi atmosfer', 'Saray yemekleri']
      },
      {
        id: 'food-10',
        name: 'D&B Cafe',
        description: 'Modern kafe ve brunch mekanı. Kahvaltı, tatlılar ve özel kahveler.',
        region: 'Girne',
        rating: 4.4,
        priceRange: '€',
        images: [
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'
        ],
        website: 'dbcafecyprus.com',
        phone: '+90 392 815 0505',
        hours: '08:00 - 22:00',
        address: 'Girne Merkez',
        features: ['Kahvaltı', 'Brunch', 'Tatlılar', 'Özel Kahveler'],
        menuHighlights: ['Serpme Kahvaltı', 'Pancake', 'Cheesecake', 'Latte'],
        highlights: ['Instagram mekanı', 'Ev yapımı tatlılar', 'Özel kahve çeşitleri']
      }
    ]
  },
  {
    id: 'nightlife',
    name: 'Gece Hayatı',
    icon: PartyPopper,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    image: categoryNightlife,
    sponsorName: 'Girne Harbour',
    sponsorPlaceCount: 13,
    places: [
      {
        id: 'night-1',
        name: 'Club Lush',
        description: 'Kuzey Kıbrıs\'ın en büyük gece kulübü. Uluslararası DJ\'ler, VIP alanlar ve unutulmaz partiler.',
        region: 'Girne',
        rating: 4.6,
        priceRange: '€€€',
        images: [
          'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800',
          'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800',
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'
        ],
        website: 'clublushnc.com',
        phone: '+90 548 850 5858',
        hours: '23:00 - 05:00',
        address: 'Girne Marina',
        features: ['Gece Kulübü', 'VIP', 'Dans Pisti', 'Uluslararası DJ'],
        activities: ['Dans', 'VIP Party', 'Özel Etkinlikler'],
        highlights: ['1500 kişi kapasiteli', 'Lazer show', 'Foam party'],
        sponsored: true
      },
      {
        id: 'night-2',
        name: 'Rocks Bar & Lounge',
        description: 'Girne\'nin en şık barlarından biri. Canlı müzik, kokteyl menüsü ve muhteşem deniz manzarası.',
        region: 'Girne',
        rating: 4.7,
        priceRange: '€€€',
        images: [
          'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800',
          'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800'
        ],
        phone: '+90 392 815 8000',
        hours: '18:00 - 02:00',
        address: 'Girne Limanı',
        features: ['Lounge Bar', 'Canlı Müzik', 'Kokteyller', 'Deniz Manzarası'],
        activities: ['Canlı performanslar', 'Özel geceler'],
        highlights: ['Hafta sonu DJ setleri', 'Signature kokteyller', 'Teras seating']
      },
      {
        id: 'night-3',
        name: 'Casino & Entertainment Complex',
        description: 'Lüks kumarhane ve eğlence kompleksi. Canlı oyunlar, slot makineleri ve gece kulübü.',
        region: 'Girne',
        rating: 4.4,
        priceRange: '€€€€',
        images: [
          'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800',
          'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800'
        ],
        hours: '24 saat',
        address: 'Merit Royal Hotel',
        features: ['Casino', 'Slot', 'Poker', 'Show'],
        activities: ['Blackjack', 'Rulet', 'Poker Turnuvaları'],
        highlights: ['7/24 açık', 'VIP odalar', 'Canlı showlar']
      },
      {
        id: 'night-4',
        name: 'Café de Paris',
        description: 'Fransız tarzı bistro ve bar. Şık atmosfer, kaliteli içkiler ve hafif yemekler.',
        region: 'Girne',
        rating: 4.3,
        priceRange: '€€',
        images: [
          'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
          'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=800'
        ],
        phone: '+90 392 815 4422',
        hours: '10:00 - 02:00',
        address: 'Girne Merkez',
        features: ['Bistro', 'Şarap', 'Canlı Müzik', 'Teras'],
        activities: ['Wine tasting', 'Caz geceleri'],
        highlights: ['Fransız atmosferi', 'İthal şaraplar', 'Romantik ortam']
      },
      {
        id: 'night-5',
        name: 'Sunset Lounge',
        description: 'Gün batımı manzaralı rooftop bar. Tropikal kokteyller ve chill atmosfer.',
        region: 'Alsancak',
        rating: 4.5,
        priceRange: '€€',
        images: [
          'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800',
          'https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?w=800'
        ],
        hours: '16:00 - 01:00',
        address: 'Alsancak Sahil',
        features: ['Rooftop', 'Sunset View', 'Kokteyller', 'Chill'],
        activities: ['Gün batımı seyri', 'Aperitivo'],
        highlights: ['En iyi gün batımı manzarası', 'Chill müzik', 'Beach vibes']
      },
      {
        id: 'night-6',
        name: 'The Irish Pub',
        description: 'Otantik İrlanda pub\'ı. Guinness, canlı müzik ve spor yayınları.',
        region: 'Girne',
        rating: 4.2,
        priceRange: '€€',
        images: [
          'https://images.unsplash.com/photo-1571024057648-8f52e5b46f4a?w=800',
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'
        ],
        phone: '+90 392 815 1919',
        hours: '12:00 - 02:00',
        address: 'Girne',
        features: ['Pub', 'Canlı Müzik', 'Spor TV', 'Bira'],
        activities: ['Pub quiz', 'Spor maçları', 'Canlı müzik'],
        highlights: ['Guinness tankı', 'Futbol maçları', 'Hafta sonu canlı müzik']
      },
      {
        id: 'night-7',
        name: 'Bellapais Gardens',
        description: 'Manastır manzaralı açık hava barı. Özel etkinlikler ve konserlere ev sahipliği yapıyor.',
        region: 'Bellapais',
        rating: 4.6,
        priceRange: '€€€',
        images: [
          'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
          'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=800'
        ],
        phone: '+90 392 815 7575',
        hours: '19:00 - 01:00',
        address: 'Bellapais',
        features: ['Açık Hava', 'Manastır Manzarası', 'Konserler', 'Özel Geceler'],
        activities: ['Konserler', 'Özel etkinlikler'],
        highlights: ['Yaz konserleri', 'Manastır ışıklandırması', 'Romantik atmosfer']
      },
      {
        id: 'night-8',
        name: 'Elexus Casino',
        description: 'Lüks resort içinde modern casino ve gece kulübü. Dünya standartlarında eğlence.',
        region: 'Girne',
        rating: 4.5,
        priceRange: '€€€€',
        images: [
          'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800',
          'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800'
        ],
        website: 'elexushotel.com',
        hours: '24 saat',
        address: 'Çatalköy, Girne',
        features: ['Casino', 'Gece Kulübü', 'VIP', 'Restaurant'],
        activities: ['Casino oyunları', 'VIP parti', 'Özel showlar'],
        highlights: ['5 yıldızlı casino', 'Uluslararası showlar', 'VIP servis']
      },
      {
        id: 'night-9',
        name: 'Harbour Club',
        description: 'Liman kenarında trendy bar ve restoran. Akşam yemeğinden sonra partiye devam.',
        region: 'Girne',
        rating: 4.3,
        priceRange: '€€',
        images: [
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
          'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800'
        ],
        phone: '+90 392 815 2323',
        hours: '18:00 - 03:00',
        address: 'Girne Limanı',
        features: ['Bar', 'Restoran', 'Dans', 'Liman Manzarası'],
        activities: ['Akşam yemeği', 'Dans', 'Networking'],
        highlights: ['Yemekten partiye geçiş', 'DJ performansları', 'Trendy kalabalık']
      },
      {
        id: 'night-10',
        name: 'Acapulco Disco',
        description: 'Efsanevi disko ve parti mekanı. Retro hitlerden güncel müziğe her şey var.',
        region: 'Girne',
        rating: 4.2,
        priceRange: '€€',
        images: [
          'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800',
          'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800'
        ],
        website: 'acapulco.com.tr',
        phone: '+90 392 824 4949',
        hours: '23:00 - 05:00',
        address: 'Acapulco Resort',
        features: ['Disko', 'Retro', 'Dans Pisti', 'Resort'],
        activities: ['Dans', 'Tema geceleri'],
        highlights: ['80s-90s geceleri', 'Türkçe pop geceleri', 'Yüksek enerji']
      }
    ]
  },
  {
    id: 'nature',
    name: 'Doğa Yürüyüşleri',
    icon: Mountain,
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    image: categoryNature,
    sponsorName: 'Beşparmak Mountains',
    sponsorPlaceCount: 11,
    places: [
      {
        id: 'nature-1',
        name: 'Beşparmak Dağları Trekking',
        description: 'Adanın en ünlü dağ silsilesi. Muhteşem manzaralar, endemik bitkiler ve tarihi kalelerle dolu parkurlar.',
        region: 'Girne',
        rating: 4.9,
        images: [
          'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
          'https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?w=800',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
        ],
        website: 'cyprustrails.com',
        hours: 'Gündoğumu - Gün batımı',
        address: 'Girne Dağları',
        features: ['Trekking', 'Dağ Tırmanışı', 'Manzara', 'Fotoğraf'],
        activities: ['Günlük yürüyüşler', 'Dağ bisikleti', 'Fotoğraf turları'],
        highlights: ['1024m zirve', 'Endemik orkideler', 'Tarihi kaleler'],
        sponsored: true
      },
      {
        id: 'nature-2',
        name: 'Alevkaya Ormanları',
        description: 'Sedir ve çam ormanlarıyla kaplı doğal alan. Piknik, yürüyüş ve kuş gözlemi için ideal.',
        region: 'Girne Dağları',
        rating: 4.6,
        images: [
          'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
          'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800'
        ],
        hours: '24 saat açık',
        address: 'Alevkaya',
        features: ['Orman', 'Piknik Alanı', 'Kuş Gözlemi', 'Sessiz'],
        activities: ['Doğa yürüyüşü', 'Piknik', 'Kuş gözlemi', 'Meditasyon'],
        highlights: ['Sedir ormanları', 'Serin iklim', 'Vahşi yaşam']
      },
      {
        id: 'nature-3',
        name: 'Karpaz Milli Parkı',
        description: 'Kuzey Kıbrıs\'ın en büyük korunan alanı. Yaban eşekleri, kuşlar ve bozulmamış doğa.',
        region: 'Karpaz',
        rating: 4.8,
        images: [
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
          'https://images.unsplash.com/photo-1439853949127-fa647f21dcfe?w=800'
        ],
        hours: '24 saat açık',
        address: 'Karpaz Yarımadası',
        features: ['Milli Park', 'Yaban Hayatı', 'Plajlar', 'Kamp'],
        activities: ['Safari', 'Kuş gözlemi', 'Kamp', 'Fotoğrafçılık'],
        highlights: ['Yaban eşekleri', '300+ kuş türü', 'Bakir plajlar']
      },
      {
        id: 'nature-4',
        name: 'Buffavento Kalesi Yürüyüşü',
        description: 'Orta çağ kalesine zorlu ama ödüllendirici tırmanış. Adanın her iki tarafını gören manzara.',
        region: 'Girne Dağları',
        rating: 4.5,
        images: [
          'https://images.unsplash.com/photo-1541417904950-b855846fe074?w=800',
          'https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?w=800'
        ],
        hours: '09:00 - 17:00',
        address: 'Girne Dağları',
        features: ['Tarihi Kale', 'Zorlu Parkur', 'Panoramik Manzara'],
        activities: ['Dağ tırmanışı', 'Tarihi tur', 'Fotoğrafçılık'],
        highlights: ['954m rakım', 'İki deniz manzarası', 'Orta çağ kalesi']
      },
      {
        id: 'nature-5',
        name: 'Geçitkale Göleti',
        description: 'Flamingo ve göçmen kuşların uğrak noktası. Kuş gözlemcileri için cennet.',
        region: 'Gazimağusa',
        rating: 4.4,
        images: [
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
          'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=800'
        ],
        hours: 'Gündoğumu - Gün batımı',
        address: 'Geçitkale',
        features: ['Kuş Gözlemi', 'Gölet', 'Flamingolar', 'Fotoğraf'],
        activities: ['Kuş gözlemi', 'Doğa fotoğrafçılığı', 'Yürüyüş'],
        highlights: ['Flamingo sürüleri', 'Göçmen kuşlar', 'Kış ayları en iyi zaman']
      },
      {
        id: 'nature-6',
        name: 'Herbarium Girne',
        description: 'Kıbrıs\'ın endemik bitkilerini tanıtan botanik bahçesi ve doğa yolu.',
        region: 'Girne',
        rating: 4.3,
        images: [
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
          'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800'
        ],
        phone: '+90 392 815 2855',
        hours: '09:00 - 17:00',
        address: 'Arapköy, Girne',
        features: ['Botanik Bahçesi', 'Endemik Bitkiler', 'Eğitim', 'Doğa Yolu'],
        activities: ['Botanik turu', 'Eğitim programları', 'Fotoğrafçılık'],
        highlights: ['40+ endemik tür', 'Orkide çeşitleri', 'Kıbrıs siklamen']
      },
      {
        id: 'nature-7',
        name: 'Yeşilırmak Vadisi',
        description: 'Adanın en yeşil vadisi. Kaynak suları, çınarlar ve serinletici atmosfer.',
        region: 'Lefke',
        rating: 4.5,
        images: [
          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
          'https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800'
        ],
        hours: '24 saat açık',
        address: 'Yeşilırmak Köyü',
        features: ['Vadi', 'Kaynak Suları', 'Yürüyüş', 'Serinlik'],
        activities: ['Vadi yürüyüşü', 'Piknik', 'Yüzme'],
        highlights: ['Doğal havuzlar', 'Asırlık çınarlar', 'Yaz serinliği']
      },
      {
        id: 'nature-8',
        name: 'Cape Apostolos Andreas',
        description: 'Karpaz\'ın en ucundaki yarımada. Manastır, deniz feneri ve dramatik manzaralar.',
        region: 'Dipkarpaz',
        rating: 4.7,
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
        ],
        hours: '24 saat açık',
        address: 'Karpaz Ucu',
        features: ['Yarımada Ucu', 'Manastır', 'Deniz Feneri', 'Dramatik Manzara'],
        activities: ['Keşif turu', 'Fotoğrafçılık', 'Gün doğumu/batımı'],
        highlights: ['Adanın en doğu ucu', 'Apostolos Andreas Manastırı', 'Vahşi güzellik']
      },
      {
        id: 'nature-9',
        name: 'Ciklos Trail',
        description: 'Profesyonel yürüyüşçüler için zorlu dağ parkuru. Tam gün yürüyüş gerektiriyor.',
        region: 'Girne Dağları',
        rating: 4.6,
        images: [
          'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
        ],
        hours: 'Gündüz saatleri',
        address: 'Girne Dağları',
        features: ['Zorlu Parkur', 'Profesyonel', 'Tam Gün', 'Ödüllendirici'],
        activities: ['Dağ yürüyüşü', 'Trail running', 'Macera'],
        highlights: ['18km parkur', 'Teknik zorluklar', 'Muhteşem manzaralar']
      },
      {
        id: 'nature-10',
        name: 'Sourp Magar Manastırı Trail',
        description: 'Ermeni manastırına giden tarihi yol. Orman içinden geçen kolay yürüyüş.',
        region: 'Girne Dağları',
        rating: 4.4,
        images: [
          'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
          'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800'
        ],
        hours: 'Gündüz saatleri',
        address: 'Girne Dağları',
        features: ['Kolay Parkur', 'Tarihi Manastır', 'Orman', 'Aile Dostu'],
        activities: ['Yürüyüş', 'Tarihi keşif', 'Piknik'],
        highlights: ['Ermeni mirası', 'Kolay ulaşım', 'Gölgeli yol']
      }
    ]
  },
  {
    id: 'culture',
    name: 'Kültür & Sanat',
    icon: Palette,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500',
    image: categoryShopping,
    sponsorName: 'Lefkoşa Suriçi',
    sponsorPlaceCount: 10,
    places: [
      {
        id: 'culture-1',
        name: 'Derinya Kültür Merkezi',
        description: 'Modern sanat galerileri, konser salonu ve atölye çalışmaları. Kıbrıs\'ın kültürel kalbi.',
        region: 'Girne',
        rating: 4.6,
        images: [
          'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800',
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800',
          'https://images.unsplash.com/photo-1564674556491-2f7b891e8cb4?w=800'
        ],
        phone: '+90 392 815 5050',
        hours: '10:00 - 20:00',
        address: 'Girne Merkez',
        features: ['Sanat Galerisi', 'Konser Salonu', 'Atölyeler', 'Kafe'],
        highlights: ['Yerel sanatçılar', 'Canlı performanslar', 'Seramik atölyeleri'],
        sponsored: true
      },
      {
        id: 'culture-2',
        name: 'Bandabulya - Belediye Pazarı',
        description: 'Lefkoşa\'nın tarihi kapalı çarşısı. El sanatları, yerel ürünler ve otantik atmosfer.',
        region: 'Lefkoşa',
        rating: 4.5,
        images: [
          'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
          'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=800'
        ],
        hours: '09:00 - 18:00 (Pazar kapalı)',
        address: 'Lefkoşa Suriçi',
        features: ['Tarihi Çarşı', 'El Sanatları', 'Yerel Ürünler', 'Kafeler'],
        highlights: ['Osmanlı dönemi yapısı', 'Otantik Lefkoşa', 'Antika dükkanları']
      },
      {
        id: 'culture-3',
        name: 'Girne İkon Müzesi',
        description: 'Bizans dönemi ikonalarının sergilendiği önemli koleksiyon. Tarihi kilise içinde yer alıyor.',
        region: 'Girne',
        rating: 4.4,
        images: [
          'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800',
          'https://images.unsplash.com/photo-1564674556491-2f7b891e8cb4?w=800'
        ],
        phone: '+90 392 815 2125',
        hours: '09:00 - 16:00',
        address: 'Girne Kalesi Yanı',
        features: ['Bizans Sanatı', 'İkona Koleksiyonu', 'Tarihi Kilise'],
        highlights: ['15-18. yüzyıl ikonaları', 'Dini sanat', 'Restorasyon çalışmaları']
      },
      {
        id: 'culture-4',
        name: 'Halk Sanatları Müzesi',
        description: 'Geleneksel Kıbrıs el sanatları ve folklorik eserler. Halı dokuma, nakış ve çömlekçilik.',
        region: 'Lefkoşa',
        rating: 4.3,
        images: [
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800',
          'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800'
        ],
        hours: '09:00 - 17:00',
        address: 'Arabahmet, Lefkoşa',
        features: ['Folklorik Eserler', 'El Sanatları', 'Geleneksel Kostümler'],
        highlights: ['Lefkara danteli', 'Geleneksel dokumalar', 'Köy yaşamı']
      },
      {
        id: 'culture-5',
        name: 'Sanatçılar Çarşısı',
        description: 'Yerel sanatçıların atölye ve galerilerinin bulunduğu sanat sokağı.',
        region: 'Girne',
        rating: 4.4,
        images: [
          'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800',
          'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800'
        ],
        hours: '10:00 - 19:00',
        address: 'Girne Antik Liman',
        features: ['Sanat Galerileri', 'Atölyeler', 'Hediyelik', 'Sanat Kafeleri'],
        highlights: ['Yerel ressamlar', 'El yapımı takılar', 'Seramik atölyeleri']
      },
      {
        id: 'culture-6',
        name: 'Bellapais Müzik Festivali',
        description: 'Her yaz düzenlenen klasik müzik festivali. Manastır avlusunda konserler.',
        region: 'Bellapais',
        rating: 4.8,
        images: [
          'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
          'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800'
        ],
        website: 'bellapaisfestival.com',
        hours: 'Sezonluk (Mayıs-Haziran)',
        address: 'Bellapais Manastırı',
        features: ['Klasik Müzik', 'Açık Hava Konser', 'Uluslararası Sanatçılar'],
        highlights: ['Dünya çapında müzisyenler', 'Tarihi mekanda müzik', 'Akşam konserleri']
      },
      {
        id: 'culture-7',
        name: 'Lefkoşa Şehir Tiyatrosu',
        description: 'Tiyatro oyunları, dans gösterileri ve kültürel etkinlikler.',
        region: 'Lefkoşa',
        rating: 4.5,
        images: [
          'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
          'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'
        ],
        phone: '+90 392 228 1818',
        hours: 'Etkinliklere göre değişir',
        address: 'Lefkoşa Merkez',
        features: ['Tiyatro', 'Dans', 'Kültürel Etkinlikler'],
        highlights: ['Türk ve dünya tiyatrosu', 'Dans gösterileri', 'Çocuk oyunları']
      },
      {
        id: 'culture-8',
        name: 'Mevlevi Tekesi',
        description: 'Osmanlı dönemi mevlevi tekkesi. Sema gösterileri ve tasavvuf kültürü.',
        region: 'Lefkoşa',
        rating: 4.6,
        images: [
          'https://images.unsplash.com/photo-1564674556491-2f7b891e8cb4?w=800',
          'https://images.unsplash.com/photo-1566404791232-af9fe978f179?w=800'
        ],
        hours: '09:00 - 17:00',
        address: 'Lefkoşa Suriçi',
        features: ['Tarihi Tekke', 'Sema Gösterisi', 'Müze', 'Tasavvuf'],
        highlights: ['17. yüzyıl', 'Mevlevi müzesi', 'Özel sema geceleri']
      },
      {
        id: 'culture-9',
        name: 'Arkeoloji Müzesi',
        description: 'Kıbrıs\'ın zengin arkeolojik mirasını sergileyen kapsamlı müze.',
        region: 'Girne',
        rating: 4.4,
        images: [
          'https://images.unsplash.com/photo-1564674556491-2f7b891e8cb4?w=800',
          'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800'
        ],
        hours: '09:00 - 17:00',
        address: 'Girne Kalesi',
        features: ['Arkeolojik Eserler', 'Tarihi Objeler', 'Eğitim'],
        highlights: ['Neolitik dönemden eserler', 'Bronz çağı koleksiyonu', 'Helenistik dönem']
      },
      {
        id: 'culture-10',
        name: 'Kıbrıs Türk Devlet Tiyatrosu',
        description: 'Profesyonel tiyatro prodüksiyonları ve uluslararası işbirlikleri.',
        region: 'Lefkoşa',
        rating: 4.5,
        images: [
          'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
          'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800'
        ],
        website: 'devlettiyatrosu.com',
        hours: 'Gösterilere göre değişir',
        address: 'Lefkoşa',
        features: ['Devlet Tiyatrosu', 'Profesyonel Yapımlar', 'Uluslararası'],
        highlights: ['Türk ve dünya klasikleri', 'Yeni yapımlar', 'Ödüllü oyuncular']
      }
    ]
  }
];

// Feature icon mapping
const featureIcons: Record<string, React.ElementType> = {
  'Su Sporları': Waves,
  'Wifi': Wifi,
  'Otopark': Car,
  'Kahvaltı': Coffee,
  'Spor Salonu': Dumbbell,
  'Spa': Sparkles,
  'Aile Dostu': Users,
  'Canlı Müzik': Music,
  'Fotoğraf': Camera,
  'Ödüllü': Award,
  'Romantik': Heart
};

// Place Detail Modal Component
const PlaceDetailModal = ({
  place,
  category,
  isOpen,
  onClose
}: {
  place: CategoryPlace | null;
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!place || !category) return null;

  const Icon = category.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden bg-card border-border/50">
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Image Gallery */}
          <div className="relative h-56">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={place.images[currentImageIndex]}
                alt={place.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Image Navigation */}
            {place.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(prev => prev === 0 ? place.images.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(prev => (prev + 1) % place.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
                
                {/* Image Dots */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {place.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1.5 rounded-lg ${category.bgColor} text-white text-xs font-bold flex items-center gap-1.5`}>
                <Icon className="w-4 h-4" />
                {category.name}
              </span>
              {place.sponsored && (
                <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold">
                  Ana Sponsor
                </span>
              )}
            </div>

            {/* Rating & Price */}
            <div className="absolute top-4 right-16 flex items-center gap-2">
              {place.priceRange && (
                <span className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-bold">
                  {place.priceRange}
                </span>
              )}
              <span className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-sm font-bold">{place.rating}</span>
              </span>
            </div>

            {/* Title */}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-white text-2xl font-bold">{place.name}</h2>
              <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {place.region}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-5">
            {/* Description */}
            <p className="text-foreground/80 text-sm leading-relaxed">
              {place.description}
            </p>

            {/* Features */}
            <div>
              <h4 className="text-foreground font-semibold text-sm mb-2">Özellikler</h4>
              <div className="flex flex-wrap gap-2">
                {place.features.map((feature, idx) => {
                  const FeatureIcon = featureIcons[feature] || Sparkles;
                  return (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1.5"
                    >
                      <FeatureIcon className="w-3 h-3" />
                      {feature}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Menu Highlights (for restaurants) */}
            {place.menuHighlights && place.menuHighlights.length > 0 && (
              <div>
                <h4 className="text-foreground font-semibold text-sm mb-2">Popüler Menü</h4>
                <div className="flex flex-wrap gap-2">
                  {place.menuHighlights.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Activities (for beaches/nature) */}
            {place.activities && place.activities.length > 0 && (
              <div>
                <h4 className="text-foreground font-semibold text-sm mb-2">Aktiviteler</h4>
                <div className="flex flex-wrap gap-2">
                  {place.activities.map((activity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-medium"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {place.highlights && place.highlights.length > 0 && (
              <div>
                <h4 className="text-foreground font-semibold text-sm mb-2">Öne Çıkanlar</h4>
                <div className="flex flex-wrap gap-2">
                  {place.highlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium flex items-center gap-1"
                    >
                      <Award className="w-3 h-3" />
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="space-y-2.5 pt-2 border-t border-border/30">
              {place.hours && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Çalışma Saatleri</p>
                    <p className="text-foreground font-medium">{place.hours}</p>
                  </div>
                </div>
              )}
              
              {place.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Telefon</p>
                    <p className="text-foreground font-medium">{place.phone}</p>
                  </div>
                </div>
              )}
              
              {place.address && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Adres</p>
                    <p className="text-foreground font-medium">{place.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* QR Code Section */}
            {place.website && (
              <div className="pt-4 border-t border-border/30">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-xl">
                    <QRCode 
                      value={`https://${place.website}`} 
                      size={100}
                      level="M"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-semibold mb-1">QR Kodu Tara</p>
                    <p className="text-muted-foreground text-sm mb-2">
                      Telefonunla tarayarak websiteye git
                    </p>
                    <p className="text-primary font-medium">{place.website}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Kapat
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={() => {
                  const locationInfo = `${place.name}\n${place.region}\n${place.website ? `https://${place.website}` : ''}`;
                  navigator.clipboard.writeText(locationInfo);
                }}
              >
                <Smartphone className="w-4 h-4" />
                Cebine Kaydet
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Category Detail View Component
const CategoryDetailView = ({
  category,
  onBack,
  onPlaceSelect
}: {
  category: Category;
  onBack: () => void;
  onPlaceSelect: (place: CategoryPlace) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-foreground text-xl font-bold">{category.name}</h2>
            <p className="text-muted-foreground text-sm">{category.places.length} mekan bulundu</p>
          </div>
        </div>
      </div>

      {/* Sponsor Banner */}
      {category.places.find(p => p.sponsored) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-40 rounded-2xl overflow-hidden mb-6 cursor-pointer group"
          onClick={() => {
            const sponsoredPlace = category.places.find(p => p.sponsored);
            if (sponsoredPlace) onPlaceSelect(sponsoredPlace);
          }}
        >
          <img
            src={category.places.find(p => p.sponsored)?.images[0] || category.image}
            alt="Sponsor"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold">
              Ana Sponsor
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-xl font-bold">
              {category.places.find(p => p.sponsored)?.name}
            </h3>
            <p className="text-white/80 text-sm mt-1">
              {category.places.find(p => p.sponsored)?.description?.substring(0, 80)}...
            </p>
          </div>
          <div className="absolute bottom-4 right-4">
            <ArrowUpRight className="w-6 h-6 text-white" />
          </div>
        </motion.div>
      )}

      {/* Places Grid */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
          {category.places.filter(p => !p.sponsored).map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onPlaceSelect(place)}
              className="bg-card/60 backdrop-blur-sm rounded-xl overflow-hidden border border-border/30 cursor-pointer group hover:border-primary/50 transition-all"
            >
              <div className="relative h-28">
                <img
                  src={place.images[0]}
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                
                {/* Rating */}
                <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-xs font-bold">{place.rating}</span>
                </div>

                {/* Arrow */}
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              
              <div className="p-3">
                <h4 className="text-foreground font-semibold text-sm leading-tight line-clamp-1">{place.name}</h4>
                <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {place.region}
                </p>
                {place.priceRange && (
                  <p className="text-primary text-xs font-semibold mt-1">{place.priceRange}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export const CategoriesExplore = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<CategoryPlace | null>(null);

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-3 gap-4"
          >
            {categoriesData.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedCategory(category)}
                  className="relative h-44 rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Category Icon Badge */}
                  <div className={`absolute top-3 right-3 w-10 h-10 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Category Name */}
                  <div className="absolute top-3 left-3">
                    <h3 className="text-white text-lg font-bold">{category.name}</h3>
                  </div>

                  {/* Sponsor Info */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <p className="text-white/80 text-xs line-clamp-1 flex-1">
                      {category.sponsorName} [cite: {category.sponsorPlaceCount}]
                    </p>
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ml-2">
                      <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <CategoryDetailView
            key="detail"
            category={selectedCategory}
            onBack={() => setSelectedCategory(null)}
            onPlaceSelect={(place) => setSelectedPlace(place)}
          />
        )}
      </AnimatePresence>

      {/* Place Detail Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        category={selectedCategory}
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </div>
  );
};
