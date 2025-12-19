import { useState, useRef, useEffect } from 'react';
import { X, Gift, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScratchCardProps {
  onClose: () => void;
  onReveal: (prize: string) => void;
  sponsorName: string;
}

export const ScratchCard = ({ onClose, onReveal, sponsorName }: ScratchCardProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);

  const prize = '%15 İndirim Kuponu';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with scratch surface
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#C0C0C0');
    gradient.addColorStop(0.5, '#A8A8A8');
    gradient.addColorStop(1, '#D0D0D0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add pattern
    ctx.fillStyle = '#B0B0B0';
    for (let i = 0; i < canvas.width; i += 20) {
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.beginPath();
        ctx.arc(i + 10, j + 10, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Add text
    ctx.fillStyle = '#888';
    ctx.font = 'bold 24px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Kazı ve Kazan!', canvas.width / 2, canvas.height / 2);
  }, []);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }
    const progress = (transparent / (imageData.data.length / 4)) * 100;
    setScratchProgress(progress);

    if (progress > 50 && !isRevealed) {
      setIsRevealed(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-md animate-scale-in">
      <div className="bg-card rounded-3xl shadow-elevated w-full max-w-md mx-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-reward/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-reward" />
            </div>
            <span className="font-bold text-foreground text-lg">Kazı Kazan</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Scratch Area */}
        <div className="p-8">
          <p className="text-muted-foreground text-center mb-6">
            Gri alanı kazıyarak ödülünüzü ortaya çıkarın!
          </p>
          
          <div 
            ref={containerRef}
            className="relative w-full aspect-video rounded-2xl overflow-hidden border-4 border-dashed border-reward/30"
          >
            {/* Prize underneath */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-reward/10 to-highlight/10">
              <Gift className="w-12 h-12 text-reward mb-3" />
              <p className="text-2xl font-bold text-foreground">{prize}</p>
              <p className="text-sm text-muted-foreground mt-1">{sponsorName}</p>
            </div>
            
            {/* Scratch canvas overlay */}
            <canvas
              ref={canvasRef}
              width={400}
              height={225}
              className="absolute inset-0 w-full h-full cursor-pointer"
              onMouseDown={() => isDrawing.current = true}
              onMouseUp={() => isDrawing.current = false}
              onMouseLeave={() => isDrawing.current = false}
              onMouseMove={scratch}
              onTouchStart={() => isDrawing.current = true}
              onTouchEnd={() => isDrawing.current = false}
              onTouchMove={scratch}
            />
          </div>
          
          {/* Progress */}
          <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-reward to-highlight transition-all duration-300"
              style={{ width: `${Math.min(scratchProgress * 2, 100)}%` }}
            />
          </div>
          
          {isRevealed && (
            <div className="mt-6 text-center animate-scale-in">
              <p className="text-xl font-bold text-reward mb-4">🎉 Tebrikler!</p>
              <Button 
                onClick={() => onReveal(prize)}
                className="btn-reward w-full"
              >
                Ödülü Al
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Sponsor */}
        <div className="px-6 py-4 bg-muted/30 text-center">
          <p className="text-xs text-muted-foreground">
            Bu ödül <span className="font-semibold text-foreground">{sponsorName}</span> sponsorluğundadır
          </p>
        </div>
      </div>
    </div>
  );
};
