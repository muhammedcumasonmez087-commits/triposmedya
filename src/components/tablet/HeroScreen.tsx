import { useState } from 'react';
import { ChevronRight, MapPin, Wifi, Gamepad2, Navigation, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-cyprus.jpg';
import { JourneyTracker } from './JourneyTracker';
import { InterestChipSelector } from './InterestChipSelector';

interface HeroScreenProps {
  onStart: (interests?: string[]) => void;
  onWifiRequest: () => void;
  onGames: () => void;
}

export const HeroScreen = ({ onStart, onWifiRequest, onGames }: HeroScreenProps) => {
  const [showJourney, setShowJourney] = useState(true);
  const [showInterestModal, setShowInterestModal] = useState(false);

  const handleExplore = () => {
    // İlk kullanımda modal göster (localStorage ile kontrol edilebilir)
    const hasSeenOnboarding = localStorage.getItem('tripOS_onboarding_done');
    if (!hasSeenOnboarding) {
      setShowInterestModal(true);
    } else {
      onStart([]);
    }
  };

  const handleInterestComplete = (interests: string[]) => {
    localStorage.setItem('tripOS_onboarding_done', 'true');
    setShowInterestModal(false);
    onStart(interests);
  };

  const handleSkipInterests = () => {
    localStorage.setItem('tripOS_onboarding_done', 'true');
    setShowInterestModal(false);
    onStart([]);
  };

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
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/20 backdrop-blur-md">
              <span className="text-card/90 text-sm font-medium">14:30</span>
            </div>
            
            {/* Journey Toggle - Chip Style */}
            <button 
              onClick={() => setShowJourney(!showJourney)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md text-sm transition-all ${
                showJourney 
                  ? 'bg-green-500 text-white' 
                  : 'bg-card/20 text-card hover:bg-card/30'
              }`}
            >
              <Navigation className="w-4 h-4" />
              {showJourney && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
            </button>
            
            {/* Language Chip */}
            <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-card/20 backdrop-blur-md text-card text-sm hover:bg-card/30 transition-all">
              <Globe className="w-4 h-4" />
              <span>TR</span>
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
          
          <p className="text-card/80 text-lg max-w-xl mb-10">
            Tarihi dokusu, eşsiz plajları ve lezzet duraklarıyla Kuzey Kıbrıs sizi bekliyor.
          </p>
          
          {/* Primary CTA - Single Big Button */}
          <Button 
            onClick={handleExplore}
            className="btn-primary-gradient text-xl px-14 py-7 rounded-2xl shadow-elevated group mb-6"
          >
            <span className="flex items-center gap-3">
              Keşfet
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
          
          {/* Secondary CTAs - Small Chips */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onWifiRequest}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/90 backdrop-blur text-foreground text-sm font-medium hover:bg-card transition-all shadow-lg"
            >
              <Wifi className="w-4 h-4 text-primary" />
              <span>Free WiFi</span>
            </button>
            
            <button 
              onClick={onGames}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/90 backdrop-blur text-foreground text-sm font-medium hover:bg-card transition-all shadow-lg"
            >
              <Gamepad2 className="w-4 h-4 text-purple-500" />
              <span>Oyun</span>
            </button>
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
      
      {/* Interest Selector Modal */}
      {showInterestModal && (
        <InterestChipSelector 
          onComplete={handleInterestComplete}
          onSkip={handleSkipInterests}
        />
      )}
    </div>
  );
};
