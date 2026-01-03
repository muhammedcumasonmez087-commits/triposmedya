import { useState } from 'react';
import { X, ChevronRight, Waves, Utensils, Moon, Landmark, Mountain, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface Interest {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const interests: Interest[] = [
  { id: 'beach', name: 'Deniz & Plaj', icon: <Waves className="w-6 h-6" />, color: 'from-cyan-400 to-blue-500' },
  { id: 'food', name: 'Yeme & İçme', icon: <Utensils className="w-6 h-6" />, color: 'from-orange-400 to-red-500' },
  { id: 'nightlife', name: 'Gece Hayatı', icon: <Moon className="w-6 h-6" />, color: 'from-purple-400 to-pink-500' },
  { id: 'history', name: 'Tarih & Kültür', icon: <Landmark className="w-6 h-6" />, color: 'from-amber-400 to-orange-500' },
  { id: 'nature', name: 'Doğa & Aktivite', icon: <Mountain className="w-6 h-6" />, color: 'from-green-400 to-emerald-500' },
];

interface InterestChipSelectorProps {
  onComplete: (selected: string[]) => void;
  onSkip: () => void;
}

export const InterestChipSelector = ({ onComplete, onSkip }: InterestChipSelectorProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleContinue = () => {
    onComplete(selectedInterests);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-3xl shadow-elevated w-full max-w-lg mx-6 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Sizi neler ilgilendiriyor?</h2>
            <p className="text-sm text-muted-foreground">Size özel öneriler için seçin</p>
          </div>
          <button 
            onClick={onSkip}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Interest Chips */}
        <div className="p-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <AnimatePresence>
              {interests.map((interest, index) => (
                <motion.button
                  key={interest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleInterest(interest.id)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-medium transition-all ${
                    selectedInterests.includes(interest.id)
                      ? `bg-gradient-to-r ${interest.color} text-white shadow-lg scale-105`
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {interest.icon}
                  <span>{interest.name}</span>
                  {selectedInterests.includes(interest.id) && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Selected Count */}
          {selectedInterests.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-muted-foreground mt-4"
            >
              {selectedInterests.length} ilgi alanı seçildi
            </motion.p>
          )}
        </div>
        
        {/* Actions */}
        <div className="p-6 pt-0 space-y-3">
          <Button 
            onClick={handleContinue}
            className="w-full btn-primary-gradient py-5 text-lg rounded-xl"
          >
            <span className="flex items-center gap-2">
              {selectedInterests.length > 0 ? 'Devam Et' : 'Tümünü Göster'}
              <ChevronRight className="w-5 h-5" />
            </span>
          </Button>
          
          <button 
            onClick={onSkip}
            className="w-full text-center text-muted-foreground hover:text-foreground transition-colors py-2 text-sm font-medium"
          >
            Atla, Hemen Keşfet →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
