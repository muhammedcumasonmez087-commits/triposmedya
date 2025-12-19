import { useState } from 'react';
import { HeroScreen } from '@/components/tablet/HeroScreen';
import { SwipeInterestSelector } from '@/components/tablet/SwipeInterestSelector';
import { OfferFeed } from '@/components/tablet/OfferFeed';
import { SpinWheel } from '@/components/tablet/SpinWheel';
import { ScratchCard } from '@/components/tablet/ScratchCard';
import { QRReward } from '@/components/tablet/QRReward';

type Screen = 'hero' | 'swipe' | 'feed';
type GameType = 'spin' | 'scratch' | null;

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('hero');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [showQR, setShowQR] = useState(false);
  const [currentPrize, setCurrentPrize] = useState('');
  const [currentOffer, setCurrentOffer] = useState('');

  const handleStartExperience = () => {
    setCurrentScreen('swipe');
  };

  const handleSwipeComplete = (interests: string[]) => {
    setSelectedInterests(interests);
    setCurrentScreen('feed');
  };

  const handlePlayGame = () => {
    // Randomly choose between spin wheel and scratch card
    const games: GameType[] = ['spin', 'scratch'];
    setActiveGame(games[Math.floor(Math.random() * games.length)]);
  };

  const handleWinPrize = (prize: string) => {
    setCurrentPrize(prize);
    setCurrentOffer('Escape Beach Club');
    setActiveGame(null);
    setShowQR(true);
  };

  const handleClaimOffer = (offerId: string) => {
    setCurrentPrize('%10 İndirim');
    setCurrentOffer('Escape Beach Club');
    setShowQR(true);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Main Screens */}
      {currentScreen === 'hero' && (
        <HeroScreen onStart={handleStartExperience} />
      )}
      
      {currentScreen === 'swipe' && (
        <SwipeInterestSelector onComplete={handleSwipeComplete} />
      )}
      
      {currentScreen === 'feed' && (
        <OfferFeed 
          selectedInterests={selectedInterests}
          onPlayGame={handlePlayGame}
          onClaimOffer={handleClaimOffer}
        />
      )}
      
      {/* Modals */}
      {activeGame === 'spin' && (
        <SpinWheel 
          onClose={() => setActiveGame(null)}
          onWin={handleWinPrize}
        />
      )}
      
      {activeGame === 'scratch' && (
        <ScratchCard 
          onClose={() => setActiveGame(null)}
          onReveal={handleWinPrize}
          sponsorName="Bellapais Garden"
        />
      )}
      
      {showQR && (
        <QRReward 
          prize={currentPrize}
          offerTitle={currentOffer}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
};

export default Index;
