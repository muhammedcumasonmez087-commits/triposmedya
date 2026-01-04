import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, X, Heart, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JourneyCategory, CategoryId } from './types';
import { journeyCategories } from './journeyData';
import { CategorySwipeCard } from './CategorySwipeCard';

interface InterestDiscoveryProps {
  onComplete: (selectedCategories: CategoryId[]) => void;
  onHome: () => void;
}

export const InterestDiscovery = ({ onComplete, onHome }: InterestDiscoveryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentCategory = journeyCategories[currentIndex];
  const isComplete = currentIndex >= journeyCategories.length;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating || isComplete) return;
    
    setIsAnimating(true);
    setExitDirection(direction);
    
    if (direction === 'right') {
      setSelectedCategories(prev => [...prev, currentCategory.id]);
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setExitDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleComplete = () => {
    onComplete(selectedCategories);
  };

  // Completion Screen
  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900"
            animate={{
              background: [
                'linear-gradient(135deg, #581c87, #5b21b6, #312e81)',
                'linear-gradient(135deg, #312e81, #581c87, #5b21b6)',
                'linear-gradient(135deg, #5b21b6, #312e81, #581c87)',
              ],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative text-center px-8 max-w-lg"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative w-32 h-32 mx-auto mb-8"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-50" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          <motion.h2 
            className="text-4xl font-black text-white mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Mükemmel Seçim!
          </motion.h2>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {selectedCategories.length > 0 ? (
              <div className="mb-8">
                <p className="text-white/70 mb-4">
                  {selectedCategories.length} ilgi alanı seçtiniz
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {selectedCategories.map(catId => {
                    const cat = journeyCategories.find(c => c.id === catId);
                    return cat ? (
                      <motion.span 
                        key={catId}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`px-5 py-2.5 rounded-full bg-gradient-to-r ${cat.gradient} text-white text-sm font-bold shadow-lg`}
                      >
                        {cat.icon} {cat.nameTR}
                      </motion.span>
                    ) : null;
                  })}
                </div>
              </div>
            ) : (
              <p className="text-white/70 mb-8">
                Tüm kategorileri keşfetmek için hazırsınız!
              </p>
            )}
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              onClick={handleComplete}
              className="bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white text-xl px-12 py-8 rounded-2xl shadow-2xl hover:opacity-90 transition-opacity border-none"
            >
              <span className="flex items-center gap-3">
                Teklifleri Keşfet
                <ChevronRight className="w-6 h-6" />
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950 px-6">
      {/* Home Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onHome}
        className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <Home className="w-6 h-6 text-white" />
      </motion.button>
      
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl font-black text-white mb-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Ne keşfetmek istersiniz?
        </motion.h2>
        
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {journeyCategories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? `w-10 bg-gradient-to-r ${cat.gradient}` 
                  : index < currentIndex 
                    ? selectedCategories.includes(cat.id)
                      ? 'w-3 bg-green-500'
                      : 'w-2 bg-white/30'
                    : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
        
        <p className="text-white/60 text-sm">
          İlgileniyorsanız sağa, geç için sola kaydırın
        </p>
      </div>
      
      {/* Card Stack */}
      <div className="relative w-full max-w-md aspect-[3/4] mb-8">
        {/* Background cards for stack effect */}
        {currentIndex + 2 < journeyCategories.length && (
          <div className="absolute inset-4 top-6 rounded-3xl bg-white/5 transform scale-90" />
        )}
        {currentIndex + 1 < journeyCategories.length && (
          <div className="absolute inset-2 top-4 rounded-3xl bg-white/10 transform scale-95 overflow-hidden">
            <div className="w-full h-full bg-gray-800" />
          </div>
        )}
        
        {/* Active Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ 
              x: exitDirection === 'right' ? 400 : -400,
              rotate: exitDirection === 'right' ? 25 : -25,
              opacity: 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute inset-0"
          >
            <CategorySwipeCard 
              category={currentCategory}
              onSwipe={handleSwipe}
              isAnimating={isAnimating}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-8">
        <motion.button
          whileHover={{ scale: 1.15, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('left')}
          disabled={isAnimating}
          className="w-18 h-18 rounded-full bg-white/10 border-2 border-red-500/50 shadow-lg flex items-center justify-center hover:border-red-500 hover:bg-red-500/10 transition-all disabled:opacity-50"
          style={{ width: 72, height: 72 }}
        >
          <X className="w-9 h-9 text-red-500" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('right')}
          disabled={isAnimating}
          className="w-22 h-22 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-xl flex items-center justify-center text-white hover:shadow-green-500/30 transition-shadow disabled:opacity-50"
          style={{ width: 88, height: 88 }}
        >
          <Heart className="w-11 h-11 fill-white" />
        </motion.button>
      </div>
      
      {/* Skip All */}
      <button 
        onClick={() => onComplete([])}
        className="mt-8 text-white/50 hover:text-white transition-colors text-sm"
      >
        Hepsini Atla →
      </button>
      
      {/* Selected Count */}
      {selectedCategories.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-8 px-5 py-2.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium"
        >
          ✓ {selectedCategories.length} kategori seçildi
        </motion.div>
      )}
    </div>
  );
};
