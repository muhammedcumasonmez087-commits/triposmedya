import { motion } from 'framer-motion';
import { Crown, Star, MapPin, Clock, Sparkles, Play, ChevronRight } from 'lucide-react';
import { JourneyAd } from '../types';

interface HotelAdCardProps {
  ad: JourneyAd;
  onSelect: (ad: JourneyAd) => void;
  index: number;
}

export const HotelAdCard = ({ ad, onSelect, index }: HotelAdCardProps) => {
  const tierColors = {
    platinum: 'from-violet-600 via-purple-600 to-indigo-600',
    gold: 'from-amber-500 via-yellow-500 to-orange-500',
    bronze: 'from-orange-600 via-amber-600 to-yellow-700',
  };

  const tierBadges = {
    platinum: { icon: Crown, text: 'Platinum', bg: 'bg-gradient-to-r from-violet-500 to-purple-600' },
    gold: { icon: Crown, text: 'Gold', bg: 'bg-gradient-to-r from-amber-400 to-orange-500' },
    bronze: { icon: Crown, text: 'Bronze', bg: 'bg-gradient-to-r from-orange-500 to-amber-600' },
  };

  const TierIcon = tierBadges[ad.tier].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(ad)}
      className="relative rounded-3xl overflow-hidden cursor-pointer group"
      style={{ 
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.05))',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Luxury Gold Border Effect for Platinum */}
      {ad.tier === 'platinum' && (
        <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 opacity-60">
          <div className="absolute inset-[2px] rounded-3xl bg-gray-900" />
        </div>
      )}

      <div className="relative">
        {/* Image with Video Indicator */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={ad.image} 
            alt={ad.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${tierColors[ad.tier]} opacity-40`} />
          
          {/* Video Badge */}
          {ad.videoUrl && (
            <motion.div 
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-md"
              whileHover={{ scale: 1.1 }}
            >
              <Play className="w-4 h-4 text-white fill-white" />
              <span className="text-white text-xs font-medium">Video Tur</span>
            </motion.div>
          )}

          {/* Tier Badge */}
          <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full ${tierBadges[ad.tier].bg}`}>
            <TierIcon className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-bold">{tierBadges[ad.tier].text}</span>
          </div>

          {/* Price Range */}
          {ad.priceRange && (
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              <span className="text-white font-bold text-sm">{ad.priceRange}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center text-2xl">
                {ad.logo}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{ad.name}</h3>
                <p className="text-white/60 text-sm">{ad.tagline}</p>
              </div>
            </div>
          </div>

          {/* Rating & Location */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white font-semibold">{ad.rating}</span>
              <span className="text-white/50">({ad.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <MapPin className="w-4 h-4" />
              <span>{ad.location}</span>
            </div>
            {ad.distance && (
              <div className="flex items-center gap-1 text-white/60">
                <Clock className="w-4 h-4" />
                <span>{ad.distance}</span>
              </div>
            )}
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2 mb-4">
            {ad.highlights.slice(0, 4).map((highlight, i) => (
              <span 
                key={i}
                className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium"
              >
                {highlight}
              </span>
            ))}
          </div>

          {/* Offer */}
          <div className={`flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r ${tierColors[ad.tier]} mb-4`}>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-white" />
              <div>
                <p className="text-white font-bold text-sm">{ad.offer}</p>
                <p className="text-white/80 text-xs">{ad.offerValue}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white text-gray-900 font-bold"
          >
            {ad.ctaText}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
