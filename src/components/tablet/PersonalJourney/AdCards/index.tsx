import { motion, AnimatePresence } from 'framer-motion';
import { Home, X, Heart, Sparkles, ChevronRight, ArrowLeft, Crown, Star, Gift, Play, MapPin, Phone, Clock, QrCode } from 'lucide-react';
import { JourneyAd, CategoryId } from '../types';
import { journeyCategories, getAdsByCategory, getCategoryById } from '../journeyData';
import { HotelAdCard } from './HotelAdCard';
import { BeachAdCard } from './BeachAdCard';
import { RestaurantAdCard } from './RestaurantAdCard';
import { HistoryAdCard } from './HistoryAdCard';
import { EntertainmentAdCard } from './EntertainmentAdCard';
import { ShoppingAdCard } from './ShoppingAdCard';

export { HotelAdCard } from './HotelAdCard';
export { BeachAdCard } from './BeachAdCard';
export { RestaurantAdCard } from './RestaurantAdCard';
export { HistoryAdCard } from './HistoryAdCard';
export { EntertainmentAdCard } from './EntertainmentAdCard';
export { ShoppingAdCard } from './ShoppingAdCard';

// Kategori ID'sine göre doğru kart bileşenini döndür
export const renderAdCard = (
  ad: JourneyAd, 
  onSelect: (ad: JourneyAd) => void, 
  index: number
) => {
  switch (ad.categoryId) {
    case 'hotel':
      return <HotelAdCard key={ad.id} ad={ad} onSelect={onSelect} index={index} />;
    case 'beach':
      return <BeachAdCard key={ad.id} ad={ad} onSelect={onSelect} index={index} />;
    case 'restaurant':
      return <RestaurantAdCard key={ad.id} ad={ad} onSelect={onSelect} index={index} />;
    case 'history':
      return <HistoryAdCard key={ad.id} ad={ad} onSelect={onSelect} index={index} />;
    case 'entertainment':
      return <EntertainmentAdCard key={ad.id} ad={ad} onSelect={onSelect} index={index} />;
    case 'shopping':
      return <ShoppingAdCard key={ad.id} ad={ad} onSelect={onSelect} index={index} />;
    default:
      return <HotelAdCard key={ad.id} ad={ad} onSelect={onSelect} index={index} />;
  }
};
