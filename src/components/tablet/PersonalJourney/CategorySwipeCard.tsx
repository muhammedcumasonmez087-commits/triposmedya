import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, Sparkles } from 'lucide-react';
import { JourneyCategory } from './types';
import { getAdsByCategory } from './journeyData';

// Kategori fotoğrafları
const categoryImages: Record<string, string> = {
  hotel: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200',
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
  restaurant: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200',
  history: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=1200',
  entertainment: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200',
  shopping: 'https://images.unsplash.com/photo-1519567241046-7f570b5e2c0a?w=1200',
};

interface CategorySwipeCardProps {
  category: JourneyCategory;
  onSwipe: (direction: 'left' | 'right') => void;
  isAnimating: boolean;
}

export const CategorySwipeCard = ({ category, onSwipe, isAnimating }: CategorySwipeCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const likeOpacity = useTransform(x, [0, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, 0], [1, 0]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const categoryAds = getAdsByCategory(category.id);
  const platinumAd = categoryAds.find(ad => ad.tier === 'platinum');

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      style={{ x, rotate, scale }}
      drag={!isAnimating ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl cursor-grab select-none"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${categoryImages[category.id]})` }}
      />
      
      {/* Gradient Overlay - Kategori rengine göre */}
      <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-70`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      
      {/* GEÇ Indicator */}
      <motion.div 
        style={{ opacity: nopeOpacity }}
        className="absolute top-10 left-10 z-20"
      >
        <div className="px-8 py-4 rounded-2xl bg-red-500 text-white font-black text-3xl border-4 border-white transform -rotate-12 shadow-2xl">
          GEÇ
        </div>
      </motion.div>
      
      {/* İLGİLENİYORUM Indicator */}
      <motion.div 
        style={{ opacity: likeOpacity }}
        className="absolute top-10 right-10 z-20"
      >
        <div className="px-6 py-4 rounded-2xl bg-green-500 text-white font-black text-2xl border-4 border-white transform rotate-12 shadow-2xl">
          İLGİLENİYORUM
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
        {/* Category Icon & Name */}
        <div className="flex items-center gap-5 mb-4">
          <motion.div 
            className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-5xl shadow-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {category.icon}
          </motion.div>
          <div>
            <h2 className="text-4xl font-black text-white drop-shadow-lg">
              {category.nameTR}
            </h2>
            <p className="text-xl text-white/80 font-medium">
              {category.description}
            </p>
          </div>
        </div>

        {/* Sponsor Preview */}
        {platinumAd && (
          <motion.div 
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-white/80 font-medium">Bu kategoride öne çıkan teklif</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-3xl">
                {platinumAd.logo}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg">{platinumAd.name}</p>
                <p className="text-amber-400 font-semibold">{platinumAd.offer}</p>
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-bold">
                Platinum
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Swipe Hint */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div 
          className="h-full bg-white/40"
          style={{ 
            width: x.get() > 0 ? `${Math.min(x.get() / 2, 50)}%` : `${Math.min(Math.abs(x.get()) / 2, 50)}%`,
            marginLeft: x.get() > 0 ? '50%' : `${50 - Math.min(Math.abs(x.get()) / 2, 50)}%`,
          }}
        />
      </div>
    </motion.div>
  );
};
