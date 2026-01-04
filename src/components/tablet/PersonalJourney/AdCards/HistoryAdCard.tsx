import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Landmark, Play, BookOpen, Camera, ChevronRight } from 'lucide-react';
import { JourneyAd } from '../types';

interface HistoryAdCardProps {
  ad: JourneyAd;
  onSelect: (ad: JourneyAd) => void;
  index: number;
}

export const HistoryAdCard = ({ ad, onSelect, index }: HistoryAdCardProps) => {
  const tierStyles = {
    platinum: {
      gradient: 'from-amber-600 via-yellow-600 to-orange-600',
      border: 'border-amber-500/50',
      accent: 'text-amber-400',
    },
    gold: {
      gradient: 'from-yellow-600 via-amber-500 to-orange-500',
      border: 'border-yellow-500/40',
      accent: 'text-yellow-400',
    },
    bronze: {
      gradient: 'from-orange-600 via-amber-600 to-yellow-600',
      border: 'border-orange-500/30',
      accent: 'text-orange-400',
    },
  };

  const style = tierStyles[ad.tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6, type: 'spring' }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(ad)}
      className={`relative rounded-3xl overflow-hidden cursor-pointer group ${style.border} border-2`}
      style={{ 
        background: 'linear-gradient(145deg, rgba(217, 119, 6, 0.1), rgba(180, 83, 9, 0.05))',
      }}
    >
      {/* Antique Paper Texture Effect */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative">
        {/* Image with Vintage Filter */}
        <div className="relative h-52 overflow-hidden">
          <img 
            src={ad.image} 
            alt={ad.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{ filter: 'sepia(10%)' }}
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-20`} />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

          {/* Video Badge */}
          {ad.videoUrl && (
            <motion.div 
              className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/80 backdrop-blur border border-amber-500/30"
            >
              <Play className="w-4 h-4 text-amber-400" />
              <span className="text-amber-200 text-sm font-medium">Sanal Tur</span>
            </motion.div>
          )}

          {/* UNESCO Badge for Platinum */}
          {ad.tier === 'platinum' && (
            <motion.div
              className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Landmark className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-bold">UNESCO Aday</span>
            </motion.div>
          )}

          {/* Photo Opportunity Badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 rounded-full bg-black/50 backdrop-blur">
            <Camera className="w-4 h-4 text-white" />
            <span className="text-white/80 text-xs">Fotoğraf Noktası</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Header with Scroll Icon */}
          <div className="flex items-start gap-4 mb-4">
            <motion.div 
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-600/20 flex items-center justify-center text-3xl border border-amber-500/30"
              animate={{ rotateY: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {ad.logo}
            </motion.div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{ad.name}</h3>
              <p className={`text-sm ${style.accent}`}>{ad.tagline}</p>
            </div>
          </div>

          {/* Rating & Info */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white font-semibold">{ad.rating}</span>
              <span className="text-white/50">({ad.reviewCount})</span>
            </div>
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

          {/* Historical Highlights */}
          <div className="flex flex-wrap gap-2 mb-4">
            {ad.highlights.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30"
              >
                <BookOpen className="w-3 h-3 text-amber-400" />
                <span className="text-amber-200 text-xs">{item}</span>
              </motion.div>
            ))}
          </div>

          {/* Offer with Parchment Style */}
          <div className={`relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r ${style.gradient} mb-4`}>
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                🎫
              </div>
              <div>
                <p className="text-white font-bold">{ad.offer}</p>
                <p className="text-white/80 text-sm">{ad.offerValue}</p>
              </div>
            </div>
          </div>

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
