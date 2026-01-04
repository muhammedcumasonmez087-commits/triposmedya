import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryId } from './types';
import { InterestDiscovery } from './InterestDiscovery';
import { ExploreTabs } from './ExploreTabs';
import { SpinWheel } from '../SpinWheel';
import { QRReward } from '../QRReward';

type JourneyStep = 'discovery' | 'feed' | 'reward';

interface PersonalJourneyProps {
  onComplete: (selectedCategories: CategoryId[]) => void;
  onHome: () => void;
  onWifi?: () => void;
  onGames?: () => void;
}

export const PersonalJourney = ({ onComplete, onHome, onWifi, onGames }: PersonalJourneyProps) => {
  const [currentStep, setCurrentStep] = useState<JourneyStep>('discovery');
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showRewardGame, setShowRewardGame] = useState(false);
  const [showQRReward, setShowQRReward] = useState(false);
  const [currentPrize, setCurrentPrize] = useState('');

  const handleDiscoveryComplete = (categories: CategoryId[]) => {
    setSelectedCategories(categories);
    // Award points for completing discovery
    setEarnedPoints(categories.length * 20);
    setCurrentStep('feed');
  };

  const handlePlayRewardGame = () => {
    setShowRewardGame(true);
  };

  const handleWinPrize = (prize: string) => {
    setCurrentPrize(prize);
    setShowRewardGame(false);
    setShowQRReward(true);
    setEarnedPoints(prev => prev + 100);
  };

  const handleCloseRewardGame = () => {
    setShowRewardGame(false);
  };

  const handleCloseQRReward = () => {
    setShowQRReward(false);
  };

  const handleBackToDiscovery = () => {
    setCurrentStep('discovery');
    setSelectedCategories([]);
    setEarnedPoints(0);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {currentStep === 'discovery' && (
          <motion.div
            key="discovery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <InterestDiscovery 
              onComplete={handleDiscoveryComplete}
              onHome={onHome}
            />
          </motion.div>
        )}

        {currentStep === 'feed' && (
          <motion.div
            key="feed"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <ExploreTabs 
              selectedCategories={selectedCategories}
              onHome={onHome}
              onBack={handleBackToDiscovery}
              onPlayRewardGame={handlePlayRewardGame}
              onWifi={onWifi}
              onGames={onGames}
              earnedPoints={earnedPoints}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Game Modal */}
      {showRewardGame && (
        <SpinWheel 
          onClose={handleCloseRewardGame}
          onWin={handleWinPrize}
        />
      )}

      {/* QR Reward Modal */}
      {showQRReward && (
        <QRReward 
          prize={currentPrize}
          offerTitle="Kişisel Yolculuk Ödülü"
          onClose={handleCloseQRReward}
        />
      )}
    </>
  );
};

export default PersonalJourney;
