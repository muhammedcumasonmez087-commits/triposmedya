import { useState, useEffect } from 'react';
import { Home, X, Volume2, VolumeX, Maximize, Gift, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Game } from './GamesHub';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
  onHome: () => void;
}

type AdPhase = 'pre-roll' | 'playing' | 'mid-roll' | 'reward' | 'completed';

export const GamePlayer = ({ game, onBack, onHome }: GamePlayerProps) => {
  const [phase, setPhase] = useState<AdPhase>('pre-roll');
  const [adProgress, setAdProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [score, setScore] = useState(0);
  const [showRewardOffer, setShowRewardOffer] = useState(false);
  const [earnedReward, setEarnedReward] = useState<string | null>(null);

  // Pre-roll ad timer
  useEffect(() => {
    if (phase === 'pre-roll') {
      const interval = setInterval(() => {
        setAdProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setPhase('playing');
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Simulate game scoring
  useEffect(() => {
    if (phase === 'playing') {
      const interval = setInterval(() => {
        setScore(prev => prev + Math.floor(Math.random() * 50));
      }, 2000);

      // Show reward offer after 10 seconds
      const rewardTimer = setTimeout(() => {
        setShowRewardOffer(true);
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(rewardTimer);
      };
    }
  }, [phase]);

  const handleWatchRewardAd = () => {
    setShowRewardOffer(false);
    setPhase('mid-roll');
    setAdProgress(0);

    const interval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase('reward');
          return 100;
        }
        return prev + 2.5;
      });
    }, 100);
  };

  const handleClaimReward = () => {
    const rewards = ['%20 İndirim Kuponu', '2x Puan Bonusu', 'Ücretsiz Kahve', 'Hediye Çeki'];
    setEarnedReward(rewards[Math.floor(Math.random() * rewards.length)]);
    setPhase('completed');
  };

  const getSponsorAd = () => {
    const sponsors = [
      {
        name: 'Turkish Airlines',
        message: 'Hayallerinize uçun! Yurt dışı uçuşlarda %25 indirim.',
        color: 'from-red-600 to-red-800',
        emoji: '✈️',
      },
      {
        name: 'Coca-Cola',
        message: 'Serinliğin tadını çıkar! Yeni kampanyamızı keşfet.',
        color: 'from-red-500 to-red-700',
        emoji: '🥤',
      },
      {
        name: 'Turkcell',
        message: 'Sınırsız internet paketleri şimdi %50 indirimli!',
        color: 'from-yellow-500 to-yellow-700',
        emoji: '📱',
      },
      {
        name: 'Migros',
        message: 'Taze ürünler kapınızda. İlk siparişe %30 indirim.',
        color: 'from-orange-500 to-orange-700',
        emoji: '🛒',
      },
    ];
    return sponsors[Math.floor(Math.random() * sponsors.length)];
  };

  const currentAd = getSponsorAd();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={onHome}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
            <h2 className="font-bold text-lg">{game.name}</h2>
            {game.sponsor && (
              <Badge className="bg-yellow-500/90 text-black">
                ⭐ {game.sponsor} Sponsorluğunda
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="font-bold">{score.toLocaleString()}</span>
            </div>
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Pre-roll Ad */}
      {phase === 'pre-roll' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className={`absolute inset-0 bg-gradient-to-br ${currentAd.color}`} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
          
          <div className="relative text-center p-8 max-w-2xl">
            <Badge className="bg-white/20 text-white mb-4">SPONSOR REKLAM</Badge>
            <div className="text-8xl mb-6">{currentAd.emoji}</div>
            <h2 className="text-4xl font-bold mb-4">{currentAd.name}</h2>
            <p className="text-xl text-white/90 mb-8">{currentAd.message}</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-white/70">
                <span>Oyun {Math.ceil((100 - adProgress) / 20)} saniye içinde başlıyor</span>
              </div>
              <Progress value={adProgress} className="h-2 bg-white/20" />
            </div>

            <Button className="mt-6 bg-white text-black hover:bg-white/90">
              Kampanyayı İncele
            </Button>
          </div>
        </div>
      )}

      {/* Mid-roll Reward Ad */}
      {phase === 'mid-roll' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
          
          <div className="relative text-center p-8 max-w-2xl">
            <Badge className="bg-yellow-500 text-black mb-4">🎁 ÖDÜL REKLAMI</Badge>
            <div className="text-8xl mb-6">🎁</div>
            <h2 className="text-4xl font-bold mb-4">Ödülünüzü Kazanmak İçin İzleyin</h2>
            <p className="text-xl text-white/90 mb-8">
              Bu kısa reklamı izleyerek özel ödül kazanacaksınız!
            </p>
            
            <div className="space-y-3">
              <Progress value={adProgress} className="h-2 bg-white/20" />
              <span className="text-white/70">%{Math.round(adProgress)} tamamlandı</span>
            </div>
          </div>
        </div>
      )}

      {/* Reward Claim */}
      {phase === 'reward' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700" />
          
          <div className="relative text-center p-8 max-w-2xl animate-scale-in">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-4xl font-bold mb-4">Tebrikler!</h2>
            <p className="text-xl text-white/90 mb-8">
              Reklamı izlediğiniz için özel ödül kazandınız!
            </p>
            
            <Button
              onClick={handleClaimReward}
              className="bg-white text-emerald-700 hover:bg-white/90 text-lg px-8 py-6"
            >
              <Gift className="w-6 h-6 mr-2" />
              Ödülü Al
            </Button>
          </div>
        </div>
      )}

      {/* Reward Completed */}
      {phase === 'completed' && earnedReward && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-600" />
          
          <div className="relative text-center p-8 max-w-2xl animate-scale-in">
            <div className="text-8xl mb-6">🏆</div>
            <h2 className="text-4xl font-bold mb-4">Ödülünüz Hazır!</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <Star className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
              <p className="text-2xl font-bold">{earnedReward}</p>
              <p className="text-white/80 mt-2">Kupon telefonunuza gönderildi</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setPhase('playing');
                  setShowRewardOffer(false);
                }}
                className="bg-white text-orange-600 hover:bg-white/90"
              >
                Oyuna Dön
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="border-white text-white hover:bg-white/20"
              >
                Oyunlara Git
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Game Area */}
      {phase === 'playing' && (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="text-center">
            <img
              src={game.thumbnail}
              alt={game.name}
              className="w-96 h-64 object-cover rounded-2xl mb-6 shadow-2xl"
            />
            <h2 className="text-3xl font-bold mb-4">{game.name}</h2>
            <p className="text-white/70 mb-6">
              Oyun simülasyonu aktif - Gerçek oyun entegrasyonu için API gerekli
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400">Oyun Aktif</span>
            </div>
          </div>
        </div>
      )}

      {/* Reward Offer Popup */}
      {showRewardOffer && phase === 'playing' && (
        <div className="absolute bottom-24 right-6 z-20 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 shadow-2xl max-w-xs">
            <div className="flex items-start gap-3">
              <div className="text-4xl">🎁</div>
              <div>
                <h3 className="font-bold text-lg">Bonus Ödül!</h3>
                <p className="text-sm text-white/80 mb-3">
                  Kısa bir reklam izleyerek özel kupon kazan!
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleWatchRewardAd}
                    size="sm"
                    className="bg-white text-purple-600 hover:bg-white/90"
                  >
                    <Gift className="w-4 h-4 mr-1" />
                    İzle & Kazan
                  </Button>
                  <Button
                    onClick={() => setShowRewardOffer(false)}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    Sonra
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePlayer;
