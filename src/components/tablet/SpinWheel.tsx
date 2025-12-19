import { useState, useRef } from 'react';
import { X, Gift, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const prizes = [
  { id: 1, label: '%10 İndirim', color: 'hsl(201, 96%, 32%)' },
  { id: 2, label: 'Ücretsiz İçecek', color: 'hsl(174, 72%, 45%)' },
  { id: 3, label: '%15 İndirim', color: 'hsl(24, 95%, 53%)' },
  { id: 4, label: 'Tekrar Dene', color: 'hsl(199, 89%, 48%)' },
  { id: 5, label: '%20 İndirim', color: 'hsl(45, 93%, 47%)' },
  { id: 6, label: 'Sürpriz Hediye', color: 'hsl(340, 82%, 52%)' },
];

interface SpinWheelProps {
  onClose: () => void;
  onWin: (prize: string) => void;
}

export const SpinWheel = ({ onClose, onWin }: SpinWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setPrize(null);
    
    const randomPrize = Math.floor(Math.random() * prizes.length);
    const degreesPerPrize = 360 / prizes.length;
    const targetDegree = 360 * 5 + (360 - randomPrize * degreesPerPrize - degreesPerPrize / 2);
    
    setRotation(rotation + targetDegree);
    
    setTimeout(() => {
      setIsSpinning(false);
      setPrize(prizes[randomPrize].label);
    }, 4000);
  };

  const handleClaim = () => {
    if (prize && prize !== 'Tekrar Dene') {
      onWin(prize);
    }
    onClose();
  };

  const segmentAngle = 360 / prizes.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-md animate-scale-in">
      <div className="bg-card rounded-3xl shadow-elevated w-full max-w-lg mx-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-highlight/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-highlight" />
            </div>
            <span className="font-bold text-foreground text-lg">Şans Çarkı</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Wheel */}
        <div className="p-8 flex flex-col items-center">
          <p className="text-muted-foreground text-center mb-6">
            Çarkı çevir ve özel ödüller kazan!
          </p>
          
          <div className="relative w-72 h-72 mb-8">
            {/* Arrow pointer */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-highlight drop-shadow-lg" />
            
            {/* Wheel */}
            <div 
              ref={wheelRef}
              className="w-full h-full rounded-full shadow-elevated overflow-hidden"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {prizes.map((item, index) => {
                  const startAngle = index * segmentAngle;
                  const endAngle = (index + 1) * segmentAngle;
                  const startRad = (startAngle - 90) * Math.PI / 180;
                  const endRad = (endAngle - 90) * Math.PI / 180;
                  
                  const x1 = 50 + 50 * Math.cos(startRad);
                  const y1 = 50 + 50 * Math.sin(startRad);
                  const x2 = 50 + 50 * Math.cos(endRad);
                  const y2 = 50 + 50 * Math.sin(endRad);
                  
                  const largeArc = segmentAngle > 180 ? 1 : 0;
                  
                  const midAngle = (startAngle + endAngle) / 2 - 90;
                  const midRad = midAngle * Math.PI / 180;
                  const textX = 50 + 32 * Math.cos(midRad);
                  const textY = 50 + 32 * Math.sin(midRad);
                  
                  return (
                    <g key={item.id}>
                      <path
                        d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={item.color}
                        stroke="white"
                        strokeWidth="0.5"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="4"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                      >
                        {item.label}
                      </text>
                    </g>
                  );
                })}
                <circle cx="50" cy="50" r="10" fill="white" className="drop-shadow-lg" />
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="bold" fill="hsl(201, 96%, 32%)">
                  🎁
                </text>
              </svg>
            </div>
          </div>
          
          {/* Prize Result */}
          {prize && (
            <div className="text-center mb-6 animate-scale-in">
              <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-highlight/20 to-reward/20 border border-highlight/30">
                <p className="text-sm text-muted-foreground mb-1">Tebrikler! Kazandınız:</p>
                <p className="text-2xl font-bold text-highlight">{prize}</p>
              </div>
            </div>
          )}
          
          {/* Spin Button */}
          {!prize ? (
            <Button 
              onClick={spin}
              disabled={isSpinning}
              className="btn-reward text-lg w-full"
            >
              {isSpinning ? 'Çevriliyor...' : 'Çarkı Çevir!'}
            </Button>
          ) : (
            <Button 
              onClick={handleClaim}
              className="btn-primary-gradient text-lg w-full"
            >
              {prize === 'Tekrar Dene' ? 'Kapat' : 'Ödülü Al'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
        
        {/* Sponsor */}
        <div className="px-6 py-4 bg-muted/30 text-center">
          <p className="text-xs text-muted-foreground">
            Bu ödül <span className="font-semibold text-foreground">Escape Beach Club</span> sponsorluğundadır
          </p>
        </div>
      </div>
    </div>
  );
};
