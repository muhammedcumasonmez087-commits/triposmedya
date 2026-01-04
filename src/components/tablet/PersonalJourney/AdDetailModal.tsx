import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, X, MapPin, Phone, Clock, Star, QrCode, 
  ChevronRight, Gift, Crown, Share2, Heart, ExternalLink,
  Volume2, VolumeX, Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JourneyAd } from './types';
import { getCategoryById } from './journeyData';
import QRCode from 'react-qr-code';

interface AdDetailModalProps {
  ad: JourneyAd;
  onClose: () => void;
  onClaim: (ad: JourneyAd) => void;
}

export const AdDetailModal = ({ ad, onClose, onClaim }: AdDetailModalProps) => {
  const [showQR, setShowQR] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const category = getCategoryById(ad.categoryId);

  const tierConfig = {
    platinum: {
      gradient: 'from-violet-600 via-purple-600 to-indigo-700',
      badge: 'bg-gradient-to-r from-purple-500 to-violet-600',
      icon: Crown,
    },
    gold: {
      gradient: 'from-amber-500 via-yellow-500 to-orange-500',
      badge: 'bg-gradient-to-r from-amber-400 to-orange-500',
      icon: Star,
    },
    bronze: {
      gradient: 'from-orange-600 via-amber-600 to-yellow-700',
      badge: 'bg-gradient-to-r from-orange-500 to-amber-600',
      icon: Star,
    },
  };

  const config = tierConfig[ad.tier];
  const TierIcon = config.icon;

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleClaim = () => {
    setShowQR(true);
    onClaim(ad);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden bg-gray-900"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Hero Section */}
          <div className="relative h-72">
            {/* Video or Image */}
            {ad.videoUrl && !showQR ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={ad.videoUrl}
                  poster={ad.image}
                  loop
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />
                {/* Video Controls */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePlayVideo}
                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center"
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white fill-white" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </motion.button>
                </div>
              </div>
            ) : (
              <img 
                src={ad.image} 
                alt={ad.name}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${config.gradient} opacity-40`} />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

            {/* Tier Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.badge}`}>
                <TierIcon className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-bold capitalize">{ad.tier} Sponsor</span>
              </div>
              {category && (
                <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-lg">
                  <span className="text-white text-sm">{category.icon} {category.nameTR}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-16 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setLiked(!liked)}
                className={`w-10 h-10 rounded-full backdrop-blur-lg flex items-center justify-center ${liked ? 'bg-red-500' : 'bg-white/20'}`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'text-white fill-white' : 'text-white'}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Logo & Name */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center text-4xl border border-white/30"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {ad.logo}
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{ad.name}</h2>
                  <p className="text-white/80">{ad.tagline}</p>
                </div>
              </div>
              
              {ad.priceRange && (
                <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur">
                  <span className="text-white font-bold">{ad.priceRange}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Stats Row */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-white font-bold text-lg">{ad.rating}</span>
                <span className="text-white/50">({ad.reviewCount} yorum)</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="w-5 h-5" />
                <span>{ad.location}</span>
              </div>
              {ad.distance && (
                <div className="flex items-center gap-2 text-white/70">
                  <Clock className="w-5 h-5" />
                  <span>{ad.distance} uzaklıkta</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-white/80 text-lg mb-6 leading-relaxed">
              {ad.fullDescription}
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-3 mb-6">
              {ad.highlights.map((item, i) => (
                <motion.span 
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="px-4 py-2 rounded-full bg-white/10 text-white font-medium border border-white/20"
                >
                  {item}
                </motion.span>
              ))}
            </div>

            {/* Offer Section */}
            <motion.div 
              className={`relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r ${config.gradient} mb-6`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                    <Gift className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl">{ad.offer}</p>
                    <p className="text-white/80">{ad.offerValue}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm">Geçerlilik</p>
                  <p className="text-white font-medium">{ad.validUntil}</p>
                </div>
              </div>
            </motion.div>

            {/* QR Code Section */}
            <AnimatePresence>
              {showQR && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="bg-white rounded-2xl p-6 text-center">
                    <h3 className="text-gray-900 font-bold text-lg mb-2">Kupon Kodunuz</h3>
                    <div className="bg-gray-100 rounded-xl p-3 mb-4">
                      <span className="text-2xl font-mono font-bold text-gray-900">{ad.couponCode}</span>
                    </div>
                    <div className="flex justify-center mb-4">
                      <QRCode 
                        value={`https://redeem.kktc.travel/${ad.couponCode}`}
                        size={150}
                      />
                    </div>
                    <p className="text-gray-500 text-sm">Kasada bu QR kodu gösterin</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClaim}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r ${config.gradient} text-white font-bold text-lg`}
              >
                <QrCode className="w-6 h-6" />
                {showQR ? 'Kupon Alındı!' : 'Kuponu Al'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium"
              >
                <ExternalLink className="w-5 h-5" />
                Web Sitesi
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
