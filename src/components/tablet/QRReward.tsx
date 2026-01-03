import { useState } from 'react';
import { X, Download, Clock, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';

interface QRRewardProps {
  prize: string;
  offerTitle: string;
  onClose: () => void;
}

export const QRReward = ({ prize, offerTitle, onClose }: QRRewardProps) => {
  const [copied, setCopied] = useState(false);
  const rewardCode = `KKTC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const shortLink = `trp.os/${rewardCode.toLowerCase()}`;
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(rewardCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-3xl shadow-elevated w-full max-w-md mx-6 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary to-secondary text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <span className="text-4xl mb-2 block">🎉</span>
          <h2 className="text-2xl font-bold text-primary-foreground mb-1">Tebrikler!</h2>
          <p className="text-primary-foreground/80">Ödülünüz hazır</p>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Prize Info */}
          <div className="text-center mb-5">
            <p className="text-sm text-muted-foreground mb-1">Kazandığınız ödül</p>
            <p className="text-2xl font-bold text-foreground">{prize}</p>
            <p className="text-primary font-medium">{offerTitle}</p>
          </div>
          
          {/* QR Code */}
          <div className="qr-container mx-auto w-fit mb-5">
            <QRCode 
              value={rewardCode}
              size={160}
              level="H"
              bgColor="white"
              fgColor="hsl(201, 96%, 32%)"
            />
          </div>
          
          {/* Reward Code with Copy */}
          <div className="text-center mb-5">
            <p className="text-sm text-muted-foreground mb-2">Ödül Kodu</p>
            <div className="flex items-center justify-center gap-2">
              <div className="px-5 py-2.5 rounded-xl bg-muted font-mono text-lg font-bold text-foreground tracking-wider">
                {rewardCode}
              </div>
              <button 
                onClick={handleCopyCode}
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
            
            {/* Short Link */}
            <p className="text-xs text-muted-foreground mt-2">
              veya ziyaret edin: <span className="text-primary font-medium">{shortLink}</span>
            </p>
          </div>
          
          {/* Clear Instruction */}
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center mb-5">
            <p className="text-sm text-foreground font-medium">
              📍 Bu kodu işletmede gösterin
            </p>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>24 saat geçerli</span>
            </div>
          </div>
          
          {/* Single Action */}
          <Button variant="outline" className="w-full rounded-xl mb-3">
            <Download className="w-4 h-4 mr-2" />
            Telefona Kaydet
          </Button>
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
      </motion.div>
    </motion.div>
  );
};
