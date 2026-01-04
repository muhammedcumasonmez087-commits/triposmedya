import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ChevronRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryId } from './types';
import { journeyCategories } from './journeyData';

interface InterestDiscoveryProps {
  onComplete: (selectedCategories: CategoryId[]) => void;
  onHome: () => void;
}

export const InterestDiscovery = ({ onComplete, onHome }: InterestDiscoveryProps) => {
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);

  const toggleCategory = (id: CategoryId) => {
    setSelectedCategories(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const handleComplete = () => {
    onComplete(selectedCategories);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* Animated Dark Gradient Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
          }}
          animate={{
            background: [
              'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
              'linear-gradient(135deg, #16213e 0%, #0f0f23 50%, #1a1a2e 100%)',
              'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
          style={{ top: '-10%', right: '-10%' }}
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-blue-600/15 blur-3xl"
          style={{ bottom: '-5%', left: '-5%' }}
          animate={{ 
            x: [0, -30, 0], 
            y: [0, -40, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-amber-500/10 blur-3xl"
          style={{ top: '40%', left: '30%' }}
          animate={{ 
            x: [0, 40, 0], 
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      
      {/* Header */}
      <header className="relative flex items-center justify-between px-8 py-6">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onHome}
          className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <Home className="w-5 h-5 text-white" />
        </motion.button>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-black text-white tracking-tight">
            İlgi Alanlarınız
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Size özel içerikler için seçim yapın
          </p>
        </motion.div>
        
        <div className="w-12" /> {/* Spacer for centering */}
      </header>
      
      {/* Category Grid */}
      <div className="relative flex-1 flex items-center justify-center px-8 py-4">
        <div className="grid grid-cols-3 gap-6 max-w-4xl w-full">
          {journeyCategories.map((category, index) => {
            const isSelected = selectedCategories.includes(category.id);
            
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleCategory(category.id)}
                className={`relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-300 ${
                  isSelected 
                    ? 'ring-4 ring-white/80 ring-offset-4 ring-offset-transparent' 
                    : 'ring-1 ring-white/20'
                }`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`} />
                
                {/* Glass overlay */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${
                  isSelected ? 'bg-black/10' : 'bg-black/30'
                }`} />
                
                {/* Pattern overlay */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                />
                
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-4">
                  <motion.span 
                    className="text-5xl mb-3"
                    animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {category.icon}
                  </motion.span>
                  <span className="text-white font-bold text-lg tracking-wide">
                    {category.nameTR}
                  </span>
                  <span className="text-white/60 text-sm mt-1">
                    {category.description}
                  </span>
                </div>
                
                {/* Selected Checkmark */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg"
                    >
                      <Check className="w-5 h-5 text-gray-900" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Shine effect on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)'
                  }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Bottom Action Bar */}
      <div className="relative px-8 py-6">
        <div className="glass-card-dark p-4 flex items-center justify-between max-w-4xl mx-auto">
          {/* Selected count */}
          <div className="flex items-center gap-3">
            {selectedCategories.length > 0 ? (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <div className="flex -space-x-2">
                  {selectedCategories.slice(0, 4).map(catId => {
                    const cat = journeyCategories.find(c => c.id === catId);
                    return (
                      <motion.div
                        key={catId}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${cat?.gradient} flex items-center justify-center border-2 border-gray-900`}
                      >
                        <span className="text-lg">{cat?.icon}</span>
                      </motion.div>
                    );
                  })}
                  {selectedCategories.length > 4 && (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-900 text-white text-sm font-bold">
                      +{selectedCategories.length - 4}
                    </div>
                  )}
                </div>
                <span className="text-white/70 text-sm ml-2">
                  {selectedCategories.length} kategori seçildi
                </span>
              </motion.div>
            ) : (
              <span className="text-white/50 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Kategori seçin veya tümünü keşfedin
              </span>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => onComplete([])}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              Tümünü Gör
            </Button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-lg shadow-orange-500/30"
            >
              Keşfet
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
