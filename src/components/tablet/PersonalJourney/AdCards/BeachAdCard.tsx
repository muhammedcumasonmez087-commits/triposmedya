import { motion } from 'framer-motion';
import { Crown, Star, MapPin, Clock, Waves, Play, Sun, ChevronRight } from 'lucide-react';
import { JourneyAd } from '../types';

interface BeachAdCardProps {
  ad: JourneyAd;
  onSelect: (ad: JourneyAd) => void;
  index: number;
}

export const BeachAdCard = ({ ad, onSelect, index }: BeachAdCardProps) => {
  const tierColors = {
    platinum: 'from-cyan-500 via-teal-500 to-blue-600',
    gold: 'from-cyan-400 via-teal-400 to-emerald-500',
    bronze: 'from-teal-500 via-cyan-500 to-blue-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5, type: 'spring' }}
      whileHover={{ y: -8, rotateY: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(ad)}
      className="relative rounded-3xl overflow-hidden cursor-pointer group"
      style={{ 
        background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.1), rgba(20, 184, 166, 0.05))',
      }}
    >
      {/* Wave Animation Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -bottom-10 -left-10 -right-10 h-40 bg-gradient-to-t from-cyan-500/20 to-transparent"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img 
            src={ad.image} 
            alt={ad.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${tierColors[ad.tier]} opacity-30`} />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

          {/* Video Badge */}
          {ad.videoUrl && (
            <motion.div 
              className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-lg border border-white/30"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Play className="w-4 h-4 text-white fill-white" />
              <span className="text-white text-sm font-medium">Beach Vibes</span>
            </motion.div>
          )}

          {/* Tier Badge with Wave Icon */}
          <div className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${tierColors[ad.tier]}`}>
            <Waves className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-bold capitalize">{ad.tier}</span>
          </div>

          {/* Sun Animation for Platinum */}
          {ad.tier === 'platinum' && (
            <motion.div
              className="absolute top-16 right-16"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              <Sun className="w-8 h-8 text-yellow-400 opacity-60" />
            </motion.div>
          )}

          {/* Bottom Info Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center text-3xl border border-white/30"
                whileHover={{ rotate: [0, -10, 10, 0] }}
              >
                {ad.logo}
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white">{ad.name}</h3>
                <p className="text-cyan-200 text-sm">{ad.tagline}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Rating & Distance */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white font-bold">{ad.rating}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/70">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{ad.location}</span>
            </div>
            {ad.distance && (
              <div className="flex items-center gap-1.5 text-white/70">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{ad.distance}</span>
              </div>
            )}
          </div>

          {/* Highlights as Beach Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {ad.highlights.map((highlight, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 text-sm font-medium border border-cyan-500/30"
              >
                {highlight}
              </motion.span>
            ))}
          </div>

          {/* Offer Card */}
          <motion.div 
            className={`relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r ${tierColors[ad.tier]} mb-4`}
            whileHover={{ scale: 1.02 }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">{ad.offer}</p>
                <p className="text-white/80 text-sm">{ad.offerValue}</p>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#0891b2' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-cyan-600 text-white font-bold transition-colors"
          >
            {ad.ctaText}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
