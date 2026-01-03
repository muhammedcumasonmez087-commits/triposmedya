import { useState } from 'react';
import { Wifi, ChevronRight, Home, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface WifiLoginScreenProps {
  onComplete: (userData: { email: string; name: string }) => void;
  onSkip: () => void;
  onHome: () => void;
}

export const WifiLoginScreen = ({ onComplete, onSkip, onHome }: WifiLoginScreenProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showOptionalForm, setShowOptionalForm] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // Hızlı bağlantı - sadece onay
  const handleQuickConnect = () => {
    if (acceptedTerms) {
      onSkip();
    }
  };

  // Opsiyonel form ile bağlan
  const handleOptionalSubmit = () => {
    onComplete({ email, name });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-6">
      {/* Home Button */}
      <button 
        onClick={onHome}
        className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <Home className="w-6 h-6 text-white" />
      </button>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6"
        >
          <Wifi className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-2">Ücretsiz WiFi</h2>
        <p className="text-white/60 text-center mb-8">Hızlı ve güvenli internet bağlantısı</p>
        
        {!showOptionalForm ? (
          <>
            {/* Quick Connect - Main Option */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-4">
              <h3 className="text-white font-semibold mb-4 text-center">Hızlı Bağlan</h3>
              
              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group mb-4">
                <div 
                  onClick={() => setAcceptedTerms(!acceptedTerms)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                    acceptedTerms 
                      ? 'bg-primary border-primary' 
                      : 'border-white/30 group-hover:border-white/50'
                  }`}
                >
                  {acceptedTerms && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="text-sm text-white/70">
                  <span className="text-primary cursor-pointer hover:underline">Kullanım Koşulları</span>'nı okudum ve kabul ediyorum.
                </span>
              </label>
              
              <Button
                onClick={handleQuickConnect}
                disabled={!acceptedTerms}
                className="w-full py-5 text-lg rounded-xl bg-primary hover:bg-primary/90 disabled:bg-primary/30 disabled:cursor-not-allowed"
              >
                <Wifi className="w-5 h-5 mr-2" />
                Bağlan
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            {/* Optional Profile - Secondary */}
            <button 
              onClick={() => setShowOptionalForm(true)}
              className="w-full text-center text-white/50 hover:text-white/70 text-sm transition-colors py-3"
            >
              Daha iyi öneriler için profil oluştur →
            </button>
          </>
        ) : (
          <>
            {/* Optional Form */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-4">
              <h3 className="text-white font-semibold mb-2 text-center">Kişiselleştirilmiş Öneriler</h3>
              <p className="text-white/50 text-xs text-center mb-4">İsteğe bağlı - daha iyi öneriler için</p>
              
              <div className="space-y-3 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta (isteğe bağlı)"
                  className="w-full h-12 bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız (isteğe bağlı)"
                  className="w-full h-12 bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4"
                />
              </div>
              
              <Button
                onClick={handleOptionalSubmit}
                className="w-full py-5 text-lg rounded-xl bg-primary hover:bg-primary/90"
              >
                Kaydet ve Bağlan
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <button 
              onClick={() => setShowOptionalForm(false)}
              className="w-full text-center text-white/50 hover:text-white/70 text-sm transition-colors py-3"
            >
              ← Hızlı bağlantıya dön
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};
