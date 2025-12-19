import { useState } from 'react';
import { ChevronRight, MapPin, Utensils, Wifi, Gamepad2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-cyprus.jpg';
import { JourneyTracker } from './JourneyTracker';

interface HeroScreenProps {
  onStart: () => void;
  onWifiRequest: () => void;
  onGames: () => void;
}

export const HeroScreen = ({ onStart, onWifiRequest, onGames }: HeroScreenProps) => {
  const [showJourney, setShowJourney] = useState(true);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-card/90 backdrop-blur flex items-center justify-center shadow-lg">
              <span className="text-primary font-bold text-xl">K</span>
            </div>
            <div>
              <h1 className="font-bold text-card text-xl">Kuzey Kıbrıs</h1>
              <p className="text-xs text-card/80">KEŞİF REHBERİ</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/20 backdrop-blur-md">
              <span className="text-card/90 text-sm font-medium">14:30</span>
            </div>
            
            {/* Journey Toggle Button */}
            <button 
              onClick={() => setShowJourney(!showJourney)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md font-medium transition-all ${
                showJourney 
                  ? 'bg-green-500 text-white shadow-glow' 
                  : 'bg-card/20 text-card hover:bg-card/30'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span className="text-sm">Yolculuk</span>
              {showJourney && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </button>
            
            {/* WiFi Button - Prominent */}
            <button 
              onClick={onWifiRequest}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent backdrop-blur-md text-accent-foreground font-medium shadow-glow hover:scale-105 transition-all animate-pulse-soft"
            >
              <Wifi className="w-4 h-4" />
              <span className="text-sm">Free WiFi</span>
            </button>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-highlight/90 text-highlight-foreground text-sm font-medium mb-6 animate-bounce-soft">
            HOŞ GELDİNİZ
          </span>
          
          <h2 className="text-5xl md:text-6xl font-bold text-card mb-4 leading-tight">
            Akdeniz'in İncisini
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
              Keşfetmeye Başla
            </span>
          </h2>
          
          <p className="text-card/80 text-lg max-w-xl mb-12">
            Tarihi dokusu, eşsiz plajları ve lezzet duraklarıyla Kuzey Kıbrıs sizi bekliyor.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={onStart}
              className="btn-primary-gradient text-lg px-10 py-6 rounded-2xl shadow-elevated group"
            >
              <span className="flex items-center gap-3">
                İlgi Alanlarınızı Seçin
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            
            {/* Prominent WiFi CTA */}
            <Button 
              onClick={onWifiRequest}
              variant="outline"
              className="text-lg px-8 py-6 rounded-2xl bg-card/90 backdrop-blur border-2 border-accent text-foreground hover:bg-accent hover:text-accent-foreground group"
            >
              <span className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-accent group-hover:text-accent-foreground" />
                İnternete Bağlan
              </span>
            </Button>
            
            {/* Games CTA */}
            <Button 
              onClick={onGames}
              className="text-lg px-8 py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg group"
            >
              <span className="flex items-center gap-3">
                <Gamepad2 className="w-5 h-5" />
                Oyun Oyna
              </span>
            </Button>
          </div>
          
          {/* Quick Categories */}
          <div className="flex gap-4 mt-8">
            <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-card/90 backdrop-blur shadow-lg cursor-pointer hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5 text-highlight" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">ÖNERİLEN</p>
                <p className="font-semibold text-foreground">Lezzet Turu</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-card/90 backdrop-blur shadow-lg cursor-pointer hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">POPÜLER</p>
                <p className="font-semibold text-foreground">En İyi Plajlar</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Journey Tracker */}
        <JourneyTracker isVisible={showJourney} onClose={() => setShowJourney(false)} />
        
        {/* Bottom Bar */}
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/90 backdrop-blur cursor-pointer hover:bg-primary transition-colors">
            <div className="w-8 h-8 rounded-lg bg-card/20 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-primary-foreground/70">TELEFONA AKTAR</p>
              <p className="text-sm font-semibold text-primary-foreground">Rehberi Yanına Al</p>
            </div>
          </div>
          
          <div className="text-center text-card">
            <p className="text-3xl font-bold">28°</p>
            <p className="text-xs text-card/70">Güneş, Parçalı Bulutlu</p>
          </div>
          
          <div className="w-12 h-12 rounded-full bg-card/20 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-card/30 transition-colors">
            <span className="text-card text-xl">🎧</span>
          </div>
        </div>
      </div>
    </div>
  );
};
