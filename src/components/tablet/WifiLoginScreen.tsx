import { useState } from 'react';
import { Wifi, Mail, User, ChevronRight, Globe, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface WifiLoginScreenProps {
  onComplete: (userData: { email: string; name: string }) => void;
  onSkip: () => void;
  onHome: () => void;
}

const socialButtons = [
  { id: 'google', icon: '🔍', label: 'Google' },
  { id: 'facebook', icon: '📘', label: 'Facebook' },
  { id: 'instagram', icon: '📷', label: 'Instagram' },
];

export const WifiLoginScreen = ({ onComplete, onSkip, onHome }: WifiLoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = () => {
    if (email || name) {
      onComplete({ email, name });
    } else {
      onSkip();
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Simulate social login
    onComplete({ email: `user@${provider}.com`, name: 'Sosyal Kullanıcı' });
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
        <h2 className="text-3xl font-bold text-white text-center mb-2">Hoş Geldiniz</h2>
        <p className="text-white/60 text-center mb-8">Ücretsiz internet erişimi için lütfen giriş yapın.</p>
        
        {/* Social Logins */}
        <div className="flex justify-center gap-4 mb-6">
          {socialButtons.map((btn) => (
            <motion.button
              key={btn.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSocialLogin(btn.id)}
              className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <span className="text-2xl">{btn.icon}</span>
              <span className="text-xs text-white/70">{btn.label}</span>
            </motion.button>
          ))}
        </div>
        
        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/40 text-sm">- veya -</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        
        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/60 mb-2 block">E-posta veya Telefon Numarası *</label>
            <div className="relative">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com / 05xxxxxxxx"
                className="w-full h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl pr-12"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-white/60 mb-2 block">Ad Soyad <span className="text-white/30">İsteğe bağlı</span></label>
            <div className="relative">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız Soyadınız"
                className="w-full h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl pr-12"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            </div>
          </div>
          
          {/* Age & Gender Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/60 mb-2 block">Yaş Aralığı <span className="text-white/30">İsteğe bağlı</span></label>
              <select className="w-full h-12 bg-white/5 border border-white/10 text-white/70 rounded-xl px-4 appearance-none cursor-pointer hover:bg-white/10 transition-colors">
                <option value="">Seçiniz</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45+">45+</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm text-white/60 mb-2 block">Cinsiyet <span className="text-white/30">İsteğe bağlı</span></label>
              <div className="flex gap-2">
                <button className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-primary/50 transition-all">
                  Kadın
                </button>
                <button className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-primary/50 transition-all">
                  Erkek
                </button>
              </div>
            </div>
          </div>
          
          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div 
              onClick={() => setAcceptedTerms(!acceptedTerms)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
                acceptedTerms 
                  ? 'bg-primary border-primary' 
                  : 'border-white/30 group-hover:border-white/50'
              }`}
            >
              {acceptedTerms && <span className="text-white text-xs">✓</span>}
            </div>
            <span className="text-sm text-white/60">
              <span className="text-primary cursor-pointer hover:underline">Aydınlatma Metni</span>'ni okudum ve kişisel verilerimin bu kapsamda işlenmesini onaylıyorum.
            </span>
          </label>
        </div>
        
        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full mt-8 py-6 text-lg rounded-2xl bg-primary hover:bg-primary/90"
        >
          İnternete Bağlan
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
        
        {/* Skip Link */}
        <button 
          onClick={onSkip}
          className="w-full mt-4 text-white/40 hover:text-white/60 text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Globe className="w-4 h-4" />
          Güvenli Bağlan
        </button>
      </motion.div>
    </div>
  );
};
