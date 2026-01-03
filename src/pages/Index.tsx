import { useState } from 'react';
import { HeroScreen } from '@/components/tablet/HeroScreen';
import { ExploreScreen } from '@/components/tablet/ExploreScreen';
import { OfferFeed } from '@/components/tablet/OfferFeed';
import { SpinWheel } from '@/components/tablet/SpinWheel';
import { ScratchCard } from '@/components/tablet/ScratchCard';
import { QRReward } from '@/components/tablet/QRReward';
import { WifiAdScreen } from '@/components/tablet/WifiAdScreen';
import { WifiLoginScreen } from '@/components/tablet/WifiLoginScreen';
import { WifiSuccessScreen } from '@/components/tablet/WifiSuccessScreen';
import { GamesHub, Game } from '@/components/tablet/GamesHub';
import { GamePlayer } from '@/components/tablet/GamePlayer';

type Screen = 'hero' | 'explore' | 'feed' | 'games';
type GameType = 'spin' | 'scratch' | null;
type WifiStep = null | 'login' | 'ad' | 'success';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('hero');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [showQR, setShowQR] = useState(false);
  const [currentPrize, setCurrentPrize] = useState('');
  const [currentOffer, setCurrentOffer] = useState('');
  const [wifiStep, setWifiStep] = useState<WifiStep>(null);
  const [userData, setUserData] = useState<{ email: string; name: string } | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleGoHome = () => {
    setCurrentScreen('hero');
    setWifiStep(null);
    setSelectedGame(null);
  };

  const handleOpenGames = () => {
    setCurrentScreen('games');
  };

  const handlePlayMiniGame = (game: Game) => {
    setSelectedGame(game);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
  };

  // Yeni: Keşfetmeye Başla - ExploreScreen'e git
  const handleExplore = () => {
    setCurrentScreen('explore');
  };

  // ExploreScreen tamamlandığında
  const handleExploreComplete = (interests: string[]) => {
    setSelectedInterests(interests);
    setCurrentScreen('feed');
  };

  const handleStartExperience = (interests?: string[]) => {
    if (interests) {
      setSelectedInterests(interests);
      setCurrentScreen('feed');
    } else {
      setCurrentScreen('feed');
    }
  };

  const handlePlayGame = () => {
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

  // WiFi Flow Handlers
  const handleWifiRequest = () => {
    setWifiStep('login');
  };

  const handleWifiLogin = (data: { email: string; name: string }) => {
    setUserData(data);
    setWifiStep('ad');
  };

  const handleWifiLoginSkip = () => {
    setWifiStep('ad');
  };

  const handleAdComplete = () => {
    setWifiStep('success');
  };

  const handleWifiContinue = () => {
    setWifiStep(null);
    setCurrentScreen('explore');
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Main Screens */}
      {currentScreen === 'hero' && !wifiStep && (
        <HeroScreen 
          onStart={handleStartExperience} 
          onWifiRequest={handleWifiRequest}
          onGames={handleOpenGames}
          onExplore={handleExplore}
        />
      )}

      {/* Explore Screen - Yeni yaratıcı ilgi alanı seçici */}
      {currentScreen === 'explore' && !wifiStep && (
        <ExploreScreen 
          onComplete={handleExploreComplete}
          onHome={handleGoHome}
        />
      )}
      
      {/* Games Hub */}
      {currentScreen === 'games' && !selectedGame && (
        <GamesHub 
          onBack={handleGoHome}
          onPlayGame={handlePlayMiniGame}
        />
      )}
      
      {/* Game Player */}
      {currentScreen === 'games' && selectedGame && (
        <GamePlayer 
          game={selectedGame}
          onBack={handleBackToGames}
          onHome={handleGoHome}
        />
      )}
      
      {currentScreen === 'feed' && !wifiStep && (
        <OfferFeed 
          selectedInterests={selectedInterests}
          onPlayGame={handlePlayGame}
          onClaimOffer={handleClaimOffer}
          onHome={handleGoHome}
        />
      )}
      
      {/* WiFi Flow */}
      {wifiStep === 'login' && (
        <WifiLoginScreen 
          onComplete={handleWifiLogin}
          onSkip={handleWifiLoginSkip}
          onHome={handleGoHome}
        />
      )}
      
      {wifiStep === 'ad' && (
        <WifiAdScreen 
          onComplete={handleAdComplete}
          sponsorName="Eziç Restaurant"
          onHome={handleGoHome}
        />
      )}
      
      {wifiStep === 'success' && (
        <WifiSuccessScreen 
          onContinue={handleWifiContinue}
          onHome={handleGoHome}
          userName={userData?.name}
        />
      )}
      
      {/* Game Modals */}
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
