import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Utensils, Play, Flame, ChevronRight } from 'lucide-react';
import { JourneyAd } from '../types';

interface RestaurantAdCardProps {
  ad: JourneyAd;
  onSelect: (ad: JourneyAd) => void;
  index: number;
}

export const RestaurantAdCard = ({ ad, onSelect, index }: RestaurantAdCardProps) => {
  const tierStyles = {
    platinum: {
      gradient: 'from-orange-500 via-red-500 to-rose-600',
      bg: 'rgba(249, 115, 22, 0.1)',
      accent: 'text-orange-400',
    },
    gold: {
      gradient: 'from-orange-400 via-amber-500 to-yellow-500',
      bg: 'rgba(245, 158, 11, 0.1)',
      accent: 'text-amber-400',
    },
    bronze: {
      gradient: 'from-rose-500 via-pink-500 to-orange-500',
      bg: 'rgba(236, 72, 153, 0.1)',
      accent: 'text-rose-400',
    },
  };

  const style = tierStyles[ad.tier];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(ad)}
      className="relative rounded-3xl overflow-hidden cursor-pointer group"
      style={{ background: style.bg }}
    >
      {/* Warm Glow Effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-orange-500/20 blur-3xl" />
      
      <div className="relative">
        {/* Image with Food Styling */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={ad.image} 
            alt={ad.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-30`} />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

          {/* Video Badge */}
          {ad.videoUrl && (
            <motion.div 
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-full bg-red-500/80 backdrop-blur"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Play className="w-4 h-4 text-white fill-white" />
              <span className="text-white text-xs font-bold">Mutfaktan</span>
            </motion.div>
          )}

          {/* Price Range */}
          {ad.priceRange && (
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-lg">
              <span className="text-orange-400 font-bold">{ad.priceRange}</span>
            </div>
          )}

          {/* Flame for Hot Deals */}
          {ad.tier === 'platinum' && (
            <motion.div
              className="absolute bottom-4 right-4"
              animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                <Flame className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-bold">Popüler</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Restaurant Header */}
          <div className="flex items-start gap-4 mb-4">
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center text-4xl border border-orange-500/30"
              whileHover={{ rotate: [0, -5, 5, 0] }}
            >
              {ad.logo}
            </motion.div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{ad.name}</h3>
              <p className={`text-sm ${style.accent}`}>{ad.tagline}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-semibold text-sm">{ad.rating}</span>
                </div>
                <span className="text-white/40">•</span>
                <span className="text-white/60 text-sm">{ad.reviewCount} yorum</span>
              </div>
            </div>
          </div>

          {/* Location & Time */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1.5 text-white/70">
              <MapPin className="w-4 h-4" />
              <span>{ad.location}</span>
            </div>
            {ad.distance && (
              <div className="flex items-center gap-1.5 text-white/70">
                <Clock className="w-4 h-4" />
                <span>{ad.distance}</span>
              </div>
            )}
          </div>

          {/* Menu Highlights */}
          <div className="flex flex-wrap gap-2 mb-4">
            {ad.highlights.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
              >
                <Utensils className="w-3 h-3 text-orange-400" />
                <span className="text-white/80 text-xs">{item}</span>
              </motion.div>
            ))}
          </div>

          {/* Offer */}
          <motion.div 
            className={`p-4 rounded-2xl bg-gradient-to-r ${style.gradient} mb-4`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                🎁
              </div>
              <div>
                <p className="text-white font-bold">{ad.offer}</p>
                <p className="text-white/80 text-sm">{ad.offerValue}</p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r ${style.gradient} text-white font-bold`}
          >
            {ad.ctaText}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
