import { X, Download, Share2, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QRCode from 'react-qr-code';

interface QRRewardProps {
  prize: string;
  offerTitle: string;
  onClose: () => void;
}

export const QRReward = ({ prize, offerTitle, onClose }: QRRewardProps) => {
  const rewardCode = `KKTC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-md animate-scale-in">
      <div className="bg-card rounded-3xl shadow-elevated w-full max-w-md mx-6 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary to-secondary text-center">
          <span className="text-4xl mb-2 block">🎉</span>
          <h2 className="text-2xl font-bold text-primary-foreground mb-1">Tebrikler!</h2>
          <p className="text-primary-foreground/80">Ödülünüz hazır</p>
        </div>
        
        {/* Content */}
        <div className="p-8">
          {/* Prize Info */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-1">Kazandığınız ödül</p>
            <p className="text-2xl font-bold text-foreground">{prize}</p>
            <p className="text-primary font-medium mt-1">{offerTitle}</p>
          </div>
          
          {/* QR Code */}
          <div className="qr-container mx-auto w-fit mb-6">
            <QRCode 
              value={rewardCode}
              size={180}
              level="H"
              bgColor="white"
              fgColor="hsl(201, 96%, 32%)"
            />
          </div>
          
          {/* Reward Code */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-1">Ödül Kodu</p>
            <div className="inline-block px-6 py-3 rounded-xl bg-muted font-mono text-xl font-bold text-foreground tracking-wider">
              {rewardCode}
            </div>
          </div>
          
          {/* Details */}
          <div className="flex justify-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>24 saat geçerli</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Mekanda gösterin</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Kaydet
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl">
              <Share2 className="w-4 h-4 mr-2" />
              Paylaş
            </Button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-muted/30 border-t border-border">
          <Button 
            onClick={onClose}
            className="w-full btn-primary-gradient rounded-xl"
          >
            Keşfetmeye Devam Et
          </Button>
        </div>
      </div>
    </div>
  );
};
