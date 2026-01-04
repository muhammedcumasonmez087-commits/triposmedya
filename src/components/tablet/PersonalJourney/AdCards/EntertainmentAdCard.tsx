import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Music, Play, Sparkles, Ticket, ChevronRight } from 'lucide-react';
import { JourneyAd } from '../types';

interface EntertainmentAdCardProps {
  ad: JourneyAd;
  onSelect: (ad: JourneyAd) => void;
  index: number;
}

export const EntertainmentAdCard = ({ ad, onSelect, index }: EntertainmentAdCardProps) => {
  const tierStyles = {
    platinum: {
      gradient: 'from-pink-500 via-fuchsia-500 to-purple-600',
      glow: 'shadow-[0_0_40px_rgba(236,72,153,0.3)]',
      accent: 'text-pink-400',
    },
    gold: {
      gradient: 'from-fuchsia-500 via-purple-500 to-violet-500',
      glow: 'shadow-[0_0_30px_rgba(217,70,239,0.25)]',
      accent: 'text-fuchsia-400',
    },
    bronze: {
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      glow: 'shadow-[0_0_20px_rgba(139,92,246,0.2)]',
      accent: 'text-purple-400',
    },
  };

  const style = tierStyles[ad.tier];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.03, rotate: 1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(ad)}
      className={`relative rounded-3xl overflow-hidden cursor-pointer group ${style.glow}`}
      style={{ 
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.1))',
      }}
    >
      {/* Animated Gradient Border */}
      <motion.div 
        className="absolute inset-0 rounded-3xl p-[2px] opacity-60"
        style={{
          background: `linear-gradient(45deg, #ec4899, #8b5cf6, #ec4899)`,
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-[2px] rounded-3xl bg-gray-900" />
      </motion.div>

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-pink-500/50"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      <div className="relative">
        {/* Image with Neon Effect */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={ad.image} 
            alt={ad.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-40 mix-blend-overlay`} />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

          {/* Video Badge with Pulse */}
          {ad.videoUrl && (
            <motion.div 
              className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Play className="w-4 h-4 text-white fill-white" />
              <span className="text-white text-sm font-bold">CANLI</span>
            </motion.div>
          )}

          {/* VIP Badge */}
          {ad.tier === 'platinum' && (
            <motion.div
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
              animate={{ 
                boxShadow: [
                  '0 0 10px rgba(251, 191, 36, 0.5)',
                  '0 0 20px rgba(251, 191, 36, 0.8)',
                  '0 0 10px rgba(251, 191, 36, 0.5)',
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-black">VIP</span>
            </motion.div>
          )}

          {/* Music Note Animation */}
          <motion.div
            className="absolute bottom-4 right-4"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Music className="w-8 h-8 text-pink-400" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <motion.div 
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/30 to-purple-600/30 flex items-center justify-center text-3xl border border-pink-500/30"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {ad.logo}
            </motion.div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{ad.name}</h3>
              <p className={`text-sm ${style.accent}`}>{ad.tagline}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white font-bold">{ad.rating}</span>
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

          {/* Neon Highlights */}
          <div className="flex flex-wrap gap-2 mb-4">
            {ad.highlights.map((item, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 text-sm font-medium border border-pink-500/30"
              >
                {item}
              </motion.span>
            ))}
          </div>

          {/* Offer with Ticket Style */}
          <motion.div 
            className={`relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r ${style.gradient} mb-4`}
            whileHover={{ scale: 1.02 }}
          >
            {/* Sparkle Animation */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">{ad.offer}</p>
                <p className="text-white/80 text-sm">{ad.offerValue}</p>
              </div>
            </div>
          </motion.div>

          {/* CTA with Glow */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(236, 72, 153, 0.4)' }}
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
