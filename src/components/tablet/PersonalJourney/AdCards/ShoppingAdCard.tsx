import { motion } from 'framer-motion';
import { Star, MapPin, Clock, ShoppingBag, Play, Tag, Percent, ChevronRight } from 'lucide-react';
import { JourneyAd } from '../types';

interface ShoppingAdCardProps {
  ad: JourneyAd;
  onSelect: (ad: JourneyAd) => void;
  index: number;
}

export const ShoppingAdCard = ({ ad, onSelect, index }: ShoppingAdCardProps) => {
  const tierStyles = {
    platinum: {
      gradient: 'from-emerald-500 via-green-500 to-teal-600',
      bg: 'rgba(16, 185, 129, 0.1)',
      accent: 'text-emerald-400',
    },
    gold: {
      gradient: 'from-green-500 via-emerald-500 to-cyan-500',
      bg: 'rgba(34, 197, 94, 0.08)',
      accent: 'text-green-400',
    },
    bronze: {
      gradient: 'from-teal-500 via-cyan-500 to-emerald-500',
      bg: 'rgba(20, 184, 166, 0.06)',
      accent: 'text-teal-400',
    },
  };

  const style = tierStyles[ad.tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(ad)}
      className="relative rounded-3xl overflow-hidden cursor-pointer group"
      style={{ background: style.bg }}
    >
      {/* Sale Tag Animation */}
      {ad.tier === 'platinum' && (
        <motion.div
          className="absolute -top-2 -right-2 z-20"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
            <div className="text-center">
              <Percent className="w-5 h-5 text-white mx-auto" />
              <span className="text-white text-xs font-bold">MEGA</span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="relative">
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <img 
            src={ad.image} 
            alt={ad.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-25`} />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

          {/* Video Badge */}
          {ad.videoUrl && (
            <motion.div 
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-500/80 backdrop-blur"
            >
              <Play className="w-4 h-4 text-white fill-white" />
              <span className="text-white text-xs font-medium">Mağaza Turu</span>
            </motion.div>
          )}

          {/* Price Tag Style Badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Tag className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-bold capitalize">{ad.tier}</span>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-4 mb-3">
            <motion.div 
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center text-3xl border border-emerald-500/30"
              whileHover={{ rotate: [0, -10, 10, 0] }}
            >
              {ad.logo}
            </motion.div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{ad.name}</h3>
              <p className={`text-sm ${style.accent}`}>{ad.tagline}</p>
            </div>
          </div>

          {/* Rating & Location */}
          <div className="flex items-center gap-3 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white font-semibold">{ad.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <MapPin className="w-3.5 h-3.5" />
              <span>{ad.location}</span>
            </div>
            {ad.distance && (
              <div className="flex items-center gap-1 text-white/60">
                <Clock className="w-3.5 h-3.5" />
                <span>{ad.distance}</span>
              </div>
            )}
          </div>

          {/* Shopping Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {ad.highlights.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30"
              >
                <ShoppingBag className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-200 text-xs">{item}</span>
              </motion.div>
            ))}
          </div>

          {/* Offer with Shopping Bag Style */}
          <motion.div 
            className={`relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r ${style.gradient} mb-4`}
            whileHover={{ scale: 1.02 }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            />
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                🛒
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
