import { useState } from 'react';
import { X, Check, ChevronRight, Waves, Building2, UtensilsCrossed, PartyPopper, TreePine, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import categoryBeach from '@/assets/category-beach.jpg';
import categoryHistory from '@/assets/category-history.jpg';
import categoryFood from '@/assets/category-food.jpg';
import categoryNightlife from '@/assets/category-nightlife.jpg';
import categoryNature from '@/assets/category-nature.jpg';
import categoryShopping from '@/assets/category-shopping.jpg';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  image: string;
}

const categories: Category[] = [
  { id: 'beach', name: 'Deniz & Plaj', icon: <Waves className="w-5 h-5" />, image: categoryBeach },
  { id: 'history', name: 'Tarihi & Kültürel', icon: <Building2 className="w-5 h-5" />, image: categoryHistory },
  { id: 'food', name: 'Yeme & İçme', icon: <UtensilsCrossed className="w-5 h-5" />, image: categoryFood },
  { id: 'nightlife', name: 'Gece Hayatı', icon: <PartyPopper className="w-5 h-5" />, image: categoryNightlife },
  { id: 'nature', name: 'Doğa & Macera', icon: <TreePine className="w-5 h-5" />, image: categoryNature },
  { id: 'shopping', name: 'Alışveriş', icon: <ShoppingBag className="w-5 h-5" />, image: categoryShopping },
];

interface InterestSelectorProps {
  onClose: () => void;
  onComplete: (selected: string[]) => void;
}

export const InterestSelector = ({ onClose, onComplete }: InterestSelectorProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm animate-scale-in">
      <div className="bg-card rounded-3xl shadow-elevated w-full max-w-3xl mx-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">K</span>
            </div>
            <span className="font-semibold text-foreground">Kıbrıs Rehberi</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">
            KKTC'de nasıl bir deneyim arıyorsunuz?
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Size özel fırsatları göstermek için ilgi alanlarınızı seçin.
          </p>
          
          {/* Category Grid */}
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`relative aspect-[4/3] rounded-2xl overflow-hidden group transition-all duration-300 ${
                  selected.includes(category.id) 
                    ? 'ring-4 ring-primary scale-[1.02]' 
                    : 'hover:scale-[1.02]'
                }`}
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 transition-colors ${
                  selected.includes(category.id) 
                    ? 'bg-primary/40' 
                    : 'bg-foreground/30 group-hover:bg-foreground/40'
                }`} />
                
                {/* Check mark */}
                {selected.includes(category.id) && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 text-card">
                    {category.icon}
                    <span className="font-semibold">{category.name}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <button 
            onClick={() => onComplete([])}
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Şimdilik Atla
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {selected.length} seçim yapıldı
            </span>
            <Button 
              onClick={() => onComplete(selected)}
              disabled={selected.length === 0}
              className="btn-primary-gradient rounded-xl px-6"
            >
              <span className="flex items-center gap-2">
                Fırsatları Gör
                <ChevronRight className="w-4 h-4" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
