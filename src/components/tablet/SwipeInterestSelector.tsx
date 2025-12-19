import { useState, useRef } from 'react';
import { X, Heart, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import categoryBeach from '@/assets/category-beach.jpg';
import categoryHistory from '@/assets/category-history.jpg';
import categoryFood from '@/assets/category-food.jpg';
import categoryNightlife from '@/assets/category-nightlife.jpg';
import categoryNature from '@/assets/category-nature.jpg';
import categoryShopping from '@/assets/category-shopping.jpg';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  gradient: string;
}

const categories: Category[] = [
  { 
    id: 'beach', 
    name: 'Deniz & Plaj', 
    description: 'Kristal berrak sularda yüzün',
    image: categoryBeach,
    gradient: 'from-cyan-400/80 via-blue-500/60 to-transparent'
  },
  { 
    id: 'history', 
    name: 'Tarihi & Kültürel', 
    description: 'Antik kaleler ve müzeler keşfedin',
    image: categoryHistory,
    gradient: 'from-amber-500/80 via-orange-400/60 to-transparent'
  },
  { 
    id: 'food', 
    name: 'Yeme & İçme', 
    description: 'Akdeniz lezzetlerinin tadını çıkarın',
    image: categoryFood,
    gradient: 'from-red-400/80 via-pink-500/60 to-transparent'
  },
  { 
    id: 'nightlife', 
    name: 'Gece Hayatı', 
    description: 'Gün doğana kadar eğlenin',
    image: categoryNightlife,
    gradient: 'from-purple-500/80 via-pink-500/60 to-transparent'
  },
  { 
    id: 'nature', 
    name: 'Doğa & Macera', 
    description: 'Dağları ve vadileri keşfedin',
    image: categoryNature,
    gradient: 'from-green-500/80 via-emerald-400/60 to-transparent'
  },
  { 
    id: 'shopping', 
    name: 'Alışveriş', 
    description: 'Butik mağazaları ve pazarları gezin',
    image: categoryShopping,
    gradient: 'from-rose-400/80 via-fuchsia-500/60 to-transparent'
  },
];

interface SwipeInterestSelectorProps {
  onComplete: (selected: string[]) => void;
}

interface SwipeCardProps {
  category: Category;
  onSwipe: (direction: 'left' | 'right') => void;
  isAnimating: boolean;
}

const SwipeCard = ({ category, onSwipe, isAnimating }: SwipeCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

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
      style={{ x, rotate }}
      drag={!isAnimating ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      className="absolute inset-0 rounded-3xl overflow-hidden shadow-elevated cursor-grab"
    >
      {/* Image */}
      <img 
        src={category.image} 
        alt={category.name}
        className="w-full h-full object-cover"
        draggable={false}
      />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient}`} />
      
      {/* NOPE Indicator */}
      <motion.div 
        style={{ opacity: nopeOpacity }}
        className="absolute top-8 left-8 px-4 py-2 rounded-xl bg-destructive/90 text-destructive-foreground font-bold text-lg border-4 border-destructive-foreground transform -rotate-12"
      >
        GEÇ
      </motion.div>
      
      {/* LIKE Indicator */}
      <motion.div 
        style={{ opacity: likeOpacity }}
        className="absolute top-8 right-8 px-4 py-2 rounded-xl bg-accent/90 text-accent-foreground font-bold text-lg border-4 border-accent-foreground transform rotate-12"
      >
        BEĞENDİM
      </motion.div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-card">
        <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">
          {category.name}
        </h3>
        <p className="text-lg text-card/90 drop-shadow-md">
          {category.description}
        </p>
      </div>
    </motion.div>
  );
};

export const SwipeInterestSelector = ({ onComplete }: SwipeInterestSelectorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentCategory = categories[currentIndex];
  const isComplete = currentIndex >= categories.length;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating || isComplete) return;
    
    setIsAnimating(true);
    setExitDirection(direction);
    
    if (direction === 'right') {
      setSelectedInterests(prev => [...prev, currentCategory.id]);
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setExitDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleComplete = () => {
    onComplete(selectedInterests);
  };

  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center px-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-12 h-12 text-accent" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-foreground mb-3">Mükemmel!</h2>
          <p className="text-muted-foreground mb-2">
            {selectedInterests.length > 0 
              ? `${selectedInterests.length} ilgi alanı seçtiniz`
              : 'Hiç ilgi alanı seçmediniz'
            }
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Size özel fırsatları hazırlıyoruz...
          </p>
          
          <Button 
            onClick={handleComplete}
            className="btn-primary-gradient text-lg px-10 py-6 rounded-2xl"
          >
            <span className="flex items-center gap-3">
              Fırsatları Keşfet
              <ChevronRight className="w-5 h-5" />
            </span>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Sizi ne KKTC'ye getirdi?
        </h2>
        
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {categories.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-primary' 
                  : index < currentIndex 
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>
        
        <p className="text-muted-foreground text-sm">
          İlgileniyorsanız sağa, geç için sola kaydırın
        </p>
      </div>
      
      {/* Card Stack */}
      <div className="relative w-full max-w-sm aspect-[3/4] mb-8">
        {/* Background cards for stack effect */}
        {currentIndex + 2 < categories.length && (
          <div className="absolute inset-4 top-6 rounded-3xl bg-muted/50 transform scale-90" />
        )}
        {currentIndex + 1 < categories.length && (
          <div className="absolute inset-2 top-4 rounded-3xl bg-muted transform scale-95 shadow-lg overflow-hidden">
            <img 
              src={categories[currentIndex + 1]?.image} 
              alt=""
              className="w-full h-full object-cover opacity-50"
            />
          </div>
        )}
        
        {/* Active Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ 
              x: exitDirection === 'right' ? 300 : -300,
              rotate: exitDirection === 'right' ? 20 : -20,
              opacity: 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute inset-0"
          >
            <SwipeCard 
              category={currentCategory}
              onSwipe={handleSwipe}
              isAnimating={isAnimating}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('left')}
          disabled={isAnimating}
          className="w-16 h-16 rounded-full bg-card border-2 border-border shadow-lg flex items-center justify-center hover:border-destructive hover:text-destructive transition-colors disabled:opacity-50"
        >
          <X className="w-8 h-8" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('right')}
          disabled={isAnimating}
          className="w-20 h-20 rounded-full bg-accent shadow-lg flex items-center justify-center text-accent-foreground hover:shadow-glow transition-shadow disabled:opacity-50"
        >
          <Heart className="w-10 h-10 fill-current" />
        </motion.button>
      </div>
      
      {/* Skip All */}
      <button 
        onClick={() => onComplete([])}
        className="mt-8 text-muted-foreground hover:text-foreground transition-colors text-sm"
      >
        Hepsini Atla →
      </button>
      
      {/* Selected Count */}
      {selectedInterests.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-8 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium"
        >
          ❤️ {selectedInterests.length} ilgi alanı seçildi
        </motion.div>
      )}
    </div>
  );
};
