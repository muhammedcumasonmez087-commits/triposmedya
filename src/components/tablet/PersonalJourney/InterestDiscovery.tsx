import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryId } from './types';
import { journeyCategories } from './journeyData';

// Import category images
import categoryBeach from '@/assets/category-beach.jpg';
import categoryFood from '@/assets/category-food.jpg';
import categoryNightlife from '@/assets/category-nightlife.jpg';
import categoryHistory from '@/assets/category-history.jpg';
import categoryNature from '@/assets/category-nature.jpg';
import categoryShopping from '@/assets/category-shopping.jpg';

interface InterestDiscoveryProps {
  onComplete: (selectedCategories: CategoryId[]) => void;
  onHome: () => void;
}

// Category data with pastel colors matching reference
const categories = [
  { 
    id: 'beach' as CategoryId, 
    name: 'Plaj & Deniz', 
    description: 'Berrak sular, altın kumsallar',
    icon: '☂️',
    bgColor: 'bg-[#d4e5f7]',
    iconBg: 'bg-[#e8f4fc]',
    image: categoryBeach
  },
  { 
    id: 'history' as CategoryId, 
    name: 'Tarih & Kültür', 
    description: 'Antik kaleler, müzeler',
    icon: '🏛️',
    bgColor: 'bg-[#fce8dc]',
    iconBg: 'bg-[#fff5f0]',
    image: categoryHistory
  },
  { 
    id: 'entertainment' as CategoryId, 
    name: 'Gece Hayatı', 
    description: 'Barlar, kulüpler, canlı müzik',
    icon: '🎵',
    bgColor: 'bg-[#f5d4d4]',
    iconBg: 'bg-[#fce8e8]',
    image: categoryNightlife
  },
  { 
    id: 'hotel' as CategoryId, 
    name: 'Aile Aktiviteleri', 
    description: 'Çocuklarla eğlence',
    icon: '👨‍👩‍👧',
    bgColor: 'bg-[#e8f4f4]',
    iconBg: 'bg-[#f0fafa]',
    image: categoryNature
  },
  { 
    id: 'shopping' as CategoryId, 
    name: 'İş Seyahati', 
    description: 'Toplantı, networking',
    icon: '💼',
    bgColor: 'bg-[#e8e4f4]',
    iconBg: 'bg-[#f4f0fc]',
    image: categoryShopping
  },
  { 
    id: 'restaurant' as CategoryId, 
    name: 'Gastronomi', 
    description: 'Yerel lezzetler, restoranlar',
    icon: '🍴',
    bgColor: 'bg-[#faf0d4]',
    iconBg: 'bg-[#fcf5e0]',
    image: categoryFood
  },
];

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
    <div 
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #e8dfd4 0%, #f2ebe4 50%, #e8e0d8 100%)'
      }}
    >
      {/* Header */}
      <header className="relative flex items-center px-8 py-6">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onHome}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>
      </header>

      {/* Title Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-8 mb-8"
      >
        <p className="text-gray-500 text-sm mb-2">Adım 1/2</p>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Ne Keşfetmek İstersiniz?
        </h1>
        <p className="text-gray-500">
          Size özel öneriler için ilgi alanlarınızı seçin
        </p>
      </motion.div>
      
      {/* Category Grid */}
      <div className="relative flex-1 flex items-start justify-center px-8 py-4">
        <div className="grid grid-cols-4 gap-5 max-w-4xl w-full">
          {categories.slice(0, 4).map((category, index) => {
            const isSelected = selectedCategories.includes(category.id);
            
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleCategory(category.id)}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${category.bgColor} ${
                  isSelected 
                    ? 'ring-3 ring-[#5a8bbd] shadow-lg' 
                    : 'shadow-md hover:shadow-lg'
                }`}
                style={{ aspectRatio: '1 / 1.1' }}
              >
                {/* Content */}
                <div className="h-full flex flex-col items-center justify-center p-4">
                  {/* Icon Circle */}
                  <div className={`w-16 h-16 rounded-full ${category.iconBg} flex items-center justify-center mb-4 shadow-sm`}>
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  
                  <span className="text-gray-800 font-semibold text-base text-center mb-1">
                    {category.name}
                  </span>
                  <span className="text-gray-500 text-xs text-center">
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
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#5a8bbd] flex items-center justify-center shadow-md"
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Second Row */}
      <div className="relative flex justify-center px-8 pb-4 -mt-4">
        <div className="grid grid-cols-3 gap-5 max-w-3xl w-full">
          {categories.slice(4).concat([
            { 
              id: 'nature' as CategoryId, 
              name: 'Macera & Doğa', 
              description: 'Trekking, dalış, safari',
              icon: '🏔️',
              bgColor: 'bg-[#d8e8dc]',
              iconBg: 'bg-[#e8f4ec]',
              image: categoryNature
            }
          ]).map((category, index) => {
            const isSelected = selectedCategories.includes(category.id);
            
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 4) * 0.08 }}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleCategory(category.id)}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${category.bgColor} ${
                  isSelected 
                    ? 'ring-3 ring-[#5a8bbd] shadow-lg' 
                    : 'shadow-md hover:shadow-lg'
                }`}
                style={{ aspectRatio: '1 / 1.1' }}
              >
                {/* Content */}
                <div className="h-full flex flex-col items-center justify-center p-4">
                  {/* Icon Circle */}
                  <div className={`w-16 h-16 rounded-full ${category.iconBg} flex items-center justify-center mb-4 shadow-sm`}>
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  
                  <span className="text-gray-800 font-semibold text-base text-center mb-1">
                    {category.name}
                  </span>
                  <span className="text-gray-500 text-xs text-center">
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
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#5a8bbd] flex items-center justify-center shadow-md"
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Bottom Action */}
      <div className="relative px-8 py-8 flex flex-col items-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleComplete}
          disabled={selectedCategories.length === 0}
          className={`flex items-center justify-center gap-2 px-16 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${
            selectedCategories.length > 0
              ? 'bg-[#6b8fa8] hover:bg-[#5a7d96] text-white shadow-[#6b8fa8]/30'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Devam Et
          <ChevronRight className="w-5 h-5" />
        </motion.button>
        
        <p className="text-gray-400 text-sm mt-3">
          En az bir kategori seçin
        </p>
      </div>
    </div>
  );
};
