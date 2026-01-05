import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Trophy, Star, Flame, Clock, Search, Heart, Zap, Target, Puzzle, Dices, Crown, Sparkles, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BottomNavBar, NavItemId } from './BottomNavBar';

interface GamesHubProps {
  onBack: () => void;
  onPlayGame: (game: Game) => void;
  onHome?: () => void;
  onExplore?: () => void;
  onWifi?: () => void;
}

export interface Game {
  id: string;
  name: string;
  category: string;
  plays: string;
  thumbnail: string;
  sponsor?: string;
  sponsorLogo?: string;
  isNew?: boolean;
  isHot?: boolean;
  isFeatured?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  rewardMultiplier?: number;
}

const categories = [
  { id: 'all', name: 'Tüm Oyunlar', icon: Gamepad2, color: 'from-purple-500 to-pink-500' },
  { id: 'puzzle', name: 'Bulmaca', icon: Puzzle, color: 'from-blue-500 to-cyan-500' },
  { id: 'arcade', name: 'Arcade', icon: Zap, color: 'from-orange-500 to-red-500' },
  { id: 'card', name: 'Kart', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'sports', name: 'Spor', icon: Trophy, color: 'from-green-500 to-emerald-500' },
  { id: 'strategy', name: 'Strateji', icon: Target, color: 'from-indigo-500 to-purple-500' },
  { id: 'casual', name: 'Gündelik', icon: Dices, color: 'from-yellow-500 to-orange-500' },
];

const games: Game[] = [
  // Puzzle Games
  {
    id: '1',
    name: '2048',
    category: 'puzzle',
    plays: '1.2M',
    thumbnail: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=300&h=200&fit=crop',
    sponsor: 'Turkcell',
    isHot: true,
    isFeatured: true,
    difficulty: 'medium',
    rewardMultiplier: 2,
  },
  {
    id: '2',
    name: 'Sudoku Master',
    category: 'puzzle',
    plays: '856K',
    thumbnail: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=300&h=200&fit=crop',
    sponsor: 'Vodafone',
    isNew: true,
    difficulty: 'hard',
  },
  {
    id: '5',
    name: 'Chess Pro',
    category: 'puzzle',
    plays: '654K',
    thumbnail: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=300&h=200&fit=crop',
    isNew: true,
    difficulty: 'hard',
    rewardMultiplier: 3,
  },
  {
    id: '6',
    name: 'Mahjong Zen',
    category: 'puzzle',
    plays: '987K',
    thumbnail: 'https://images.unsplash.com/photo-1596451190630-186aff535bf2?w=300&h=200&fit=crop',
    sponsor: 'Turkish Airlines',
    isFeatured: true,
    difficulty: 'medium',
  },
  {
    id: '8',
    name: 'Word Search',
    category: 'puzzle',
    plays: '723K',
    thumbnail: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=300&h=200&fit=crop',
    sponsor: 'Migros',
    difficulty: 'easy',
  },
  {
    id: '11',
    name: 'Crossword Daily',
    category: 'puzzle',
    plays: '445K',
    thumbnail: 'https://images.unsplash.com/photo-1591462235228-f11c9e81c4b4?w=300&h=200&fit=crop',
    isNew: true,
    difficulty: 'medium',
  },
  {
    id: '12',
    name: 'Block Puzzle',
    category: 'puzzle',
    plays: '1.8M',
    thumbnail: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=300&h=200&fit=crop',
    sponsor: 'Getir',
    isHot: true,
    difficulty: 'easy',
    rewardMultiplier: 1.5,
  },
  // Arcade Games
  {
    id: '4',
    name: 'Bubble Shooter',
    category: 'arcade',
    plays: '1.8M',
    thumbnail: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=300&h=200&fit=crop',
    sponsor: 'Coca-Cola',
    isHot: true,
    difficulty: 'easy',
    rewardMultiplier: 2,
  },
  {
    id: '9',
    name: 'Tetris Rush',
    category: 'arcade',
    plays: '1.5M',
    thumbnail: 'https://images.unsplash.com/photo-1493711662062-fa541f7f0176?w=300&h=200&fit=crop',
    isNew: true,
    isHot: true,
    isFeatured: true,
    difficulty: 'medium',
  },
  {
    id: '13',
    name: 'Pac-Man Classic',
    category: 'arcade',
    plays: '2.3M',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop',
    sponsor: 'Pepsi',
    isFeatured: true,
    difficulty: 'medium',
    rewardMultiplier: 2.5,
  },
  {
    id: '14',
    name: 'Space Invaders',
    category: 'arcade',
    plays: '890K',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&h=200&fit=crop',
    isNew: true,
    difficulty: 'hard',
  },
  {
    id: '15',
    name: 'Fruit Ninja',
    category: 'arcade',
    plays: '1.1M',
    thumbnail: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=200&fit=crop',
    sponsor: 'Eti',
    isHot: true,
    difficulty: 'easy',
  },
  {
    id: '16',
    name: 'Flappy Bird',
    category: 'arcade',
    plays: '3.2M',
    thumbnail: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=300&h=200&fit=crop',
    isFeatured: true,
    difficulty: 'hard',
    rewardMultiplier: 3,
  },
  // Card Games
  {
    id: '3',
    name: 'Solitaire Classic',
    category: 'card',
    plays: '2.1M',
    thumbnail: 'https://images.unsplash.com/photo-1529480780361-266a3436e021?w=300&h=200&fit=crop',
    isFeatured: true,
    difficulty: 'easy',
  },
  {
    id: '10',
    name: 'Poker Night',
    category: 'card',
    plays: '892K',
    thumbnail: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=300&h=200&fit=crop',
    sponsor: 'Garanti BBVA',
    difficulty: 'medium',
  },
  {
    id: '17',
    name: 'Blackjack Pro',
    category: 'card',
    plays: '567K',
    thumbnail: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=300&h=200&fit=crop',
    isNew: true,
    difficulty: 'medium',
    rewardMultiplier: 2,
  },
  {
    id: '18',
    name: 'UNO Online',
    category: 'card',
    plays: '1.4M',
    thumbnail: 'https://images.unsplash.com/photo-1606503153255-59d7b3b2036e?w=300&h=200&fit=crop',
    sponsor: 'Netflix',
    isHot: true,
    isFeatured: true,
    difficulty: 'easy',
  },
  // Sports Games
  {
    id: '7',
    name: 'Basketball Stars',
    category: 'sports',
    plays: '445K',
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop',
    isHot: true,
    difficulty: 'medium',
  },
  {
    id: '19',
    name: 'Football Manager',
    category: 'sports',
    plays: '1.2M',
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop',
    sponsor: 'beIN Sports',
    isFeatured: true,
    difficulty: 'hard',
    rewardMultiplier: 2.5,
  },
  {
    id: '20',
    name: 'Tennis Ace',
    category: 'sports',
    plays: '334K',
    thumbnail: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&h=200&fit=crop',
    isNew: true,
    difficulty: 'medium',
  },
  {
    id: '21',
    name: 'Golf Master',
    category: 'sports',
    plays: '289K',
    thumbnail: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=300&h=200&fit=crop',
    sponsor: 'Rolex',
    difficulty: 'hard',
  },
  // Strategy Games
  {
    id: '22',
    name: 'Clash of Towers',
    category: 'strategy',
    plays: '789K',
    thumbnail: 'https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?w=300&h=200&fit=crop',
    sponsor: 'Supercell',
    isHot: true,
    isFeatured: true,
    difficulty: 'hard',
    rewardMultiplier: 3,
  },
  {
    id: '23',
    name: 'Checkers King',
    category: 'strategy',
    plays: '456K',
    thumbnail: 'https://images.unsplash.com/photo-1611329532992-0b7ba27d85fb?w=300&h=200&fit=crop',
    difficulty: 'medium',
  },
  {
    id: '24',
    name: 'Risk Empire',
    category: 'strategy',
    plays: '345K',
    thumbnail: 'https://images.unsplash.com/photo-1606503153255-59d7b3b2036e?w=300&h=200&fit=crop',
    isNew: true,
    difficulty: 'hard',
  },
  // Casual Games
  {
    id: '25',
    name: 'Candy Match',
    category: 'casual',
    plays: '2.8M',
    thumbnail: 'https://images.unsplash.com/photo-1581798269146-6a0f4d1c6b8b?w=300&h=200&fit=crop',
    sponsor: 'Haribo',
    isHot: true,
    isFeatured: true,
    difficulty: 'easy',
    rewardMultiplier: 1.5,
  },
  {
    id: '26',
    name: 'Angry Birds',
    category: 'casual',
    plays: '4.5M',
    thumbnail: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=300&h=200&fit=crop',
    isFeatured: true,
    difficulty: 'easy',
  },
  {
    id: '27',
    name: 'Temple Run',
    category: 'casual',
    plays: '3.1M',
    thumbnail: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=200&fit=crop',
    sponsor: 'Adidas',
    isHot: true,
    difficulty: 'medium',
    rewardMultiplier: 2,
  },
  {
    id: '28',
    name: 'Subway Surfers',
    category: 'casual',
    plays: '5.2M',
    thumbnail: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=300&h=200&fit=crop',
    isFeatured: true,
    isHot: true,
    difficulty: 'medium',
  },
];

export const GamesHub = ({ onBack, onPlayGame, onHome, onExplore, onWifi }: GamesHubProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  const handleNavClick = (id: NavItemId) => {
    switch (id) {
      case 'home':
        if (onHome) onHome();
        else onBack();
        break;
      case 'explore':
        if (onExplore) onExplore();
        break;
      case 'wifi':
        if (onWifi) onWifi();
        break;
      case 'games':
        // Already on games
        break;
      default:
        break;
    }
  };

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredGames = games.filter(g => g.isFeatured);
  const hotGames = games.filter(g => g.isHot);
  const newGames = games.filter(g => g.isNew);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onBack}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </motion.div>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Gamepad2 className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Oyun Merkezi
                </h1>
                <p className="text-xs text-white/60">Oyna, Kazan, Eğlen!</p>
              </div>
            </div>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <Input
              placeholder="Oyun ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full h-12 focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Categories with smooth scroll */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                onClick={() => setSelectedCategory(cat.id)}
                variant="ghost"
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2 transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-purple-500/30`
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 p-6 space-y-10">
        {/* Premium Sponsor Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 animate-gradient-shift" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.08%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
          
          <div className="relative flex items-center justify-between p-8">
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <Badge className="bg-yellow-500 text-black font-bold px-4 py-1 text-sm animate-pulse-soft">
                  🎮 MEGA TURNUVA
                </Badge>
              </motion.div>
              <h2 className="text-4xl font-black">Coca-Cola Oyun Maratonu</h2>
              <p className="text-white/90 text-lg max-w-md">
                Oyun oyna, puan kazan, muhteşem ödülleri kap! 
                <span className="text-yellow-300 font-bold"> 50.000₺ ödül havuzu!</span>
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-white text-red-600 hover:bg-white/90 font-bold px-8 py-6 text-lg rounded-2xl shadow-xl">
                  <Trophy className="w-6 h-6 mr-2" />
                  Yarışmaya Katıl
                </Button>
              </motion.div>
            </div>
            <motion.div 
              className="text-9xl"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🏆
            </motion.div>
          </div>
        </motion.div>

        {/* Featured Games */}
        {selectedCategory === 'all' && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                <Crown className="w-7 h-7 text-yellow-400" />
              </motion.div>
              <h2 className="text-2xl font-bold">Öne Çıkanlar</h2>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-5">
              {featuredGames.slice(0, 6).map((game, index) => (
                <motion.div key={game.id} variants={itemVariants}>
                  <GameCard 
                    game={game} 
                    onPlay={onPlayGame} 
                    size="large"
                    isHovered={hoveredGame === game.id}
                    onHover={setHoveredGame}
                    delay={index * 0.1}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Hot Games */}
        {selectedCategory === 'all' && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <Flame className="w-7 h-7 text-orange-500" />
              </motion.div>
              <h2 className="text-2xl font-bold">En Popülerler</h2>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">HOT</Badge>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {hotGames.map((game, index) => (
                <motion.div key={game.id} variants={itemVariants}>
                  <GameCard 
                    game={game} 
                    onPlay={onPlayGame}
                    isHovered={hoveredGame === game.id}
                    onHover={setHoveredGame}
                    delay={index * 0.05}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* New Games */}
        {selectedCategory === 'all' && newGames.length > 0 && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-7 h-7 text-green-400" />
              <h2 className="text-2xl font-bold">Yeni Eklenenler</h2>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">NEW</Badge>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {newGames.map((game, index) => (
                <motion.div key={game.id} variants={itemVariants}>
                  <GameCard 
                    game={game} 
                    onPlay={onPlayGame}
                    isHovered={hoveredGame === game.id}
                    onHover={setHoveredGame}
                    delay={index * 0.05}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* All/Filtered Games */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex items-center gap-3 mb-6">
            <Gamepad2 className="w-7 h-7 text-purple-400" />
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'all' ? 'Tüm Oyunlar' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <Badge variant="outline" className="text-white/60 border-white/20">
              {filteredGames.length} oyun
            </Badge>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game, index) => (
                <motion.div 
                  key={game.id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <GameCard 
                    game={game} 
                    onPlay={onPlayGame}
                    isHovered={hoveredGame === game.id}
                    onHover={setHoveredGame}
                    delay={index * 0.03}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Daily Mission Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          
          <div className="relative flex items-center justify-between p-8">
            <div className="space-y-4">
              <Badge className="bg-white/20 text-white backdrop-blur-sm px-4 py-1">
                🎁 GÜNLÜK GÖREV
              </Badge>
              <h2 className="text-3xl font-bold">Günlük Oyun Görevi</h2>
              <p className="text-white/80 text-lg">3 oyun oyna, sponsor kuponlarını kazan!</p>
              <div className="flex gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                  <div className="text-3xl font-black">0/3</div>
                  <div className="text-sm text-white/70">Oyun</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                  <div className="text-3xl font-black">0</div>
                  <div className="text-sm text-white/70">Puan</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                  <div className="text-3xl font-black">3</div>
                  <div className="text-sm text-white/70">Kupon</div>
                </div>
              </div>
            </div>
            <motion.div 
              className="text-9xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎁
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        activeItem="games"
        onNavClick={handleNavClick}
        onBack={onBack}
        showBackButton={true}
      />
    </div>
  );
};

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
  size?: 'normal' | 'large';
  isHovered?: boolean;
  onHover?: (id: string | null) => void;
  delay?: number;
}

const GameCard = ({ game, onPlay, size = 'normal', isHovered, onHover, delay = 0 }: GameCardProps) => {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      onClick={() => onPlay(game)}
      onMouseEnter={() => onHover?.(game.id)}
      onMouseLeave={() => onHover?.(null)}
      whileHover={{ 
        scale: 1.05,
        y: -8,
        transition: { type: 'spring', stiffness: 400, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
        size === 'large' ? 'aspect-[16/10]' : 'aspect-[4/3]'
      }`}
      style={{ 
        boxShadow: isHovered 
          ? '0 25px 50px -12px rgba(168, 85, 247, 0.5), 0 0 30px rgba(168, 85, 247, 0.3)' 
          : '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
      }}
    >
      <img
        src={game.thumbnail}
        alt={game.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      
      {/* Difficulty indicator */}
      {game.difficulty && (
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${getDifficultyColor(game.difficulty)}`} />
        </div>
      )}
      
      {/* Badges */}
      <div className="absolute top-2 left-2 flex gap-1 flex-wrap max-w-[80%]">
        {game.isNew && (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] px-2 py-0.5 animate-pulse">
            YENİ
          </Badge>
        )}
        {game.isHot && (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] px-2 py-0.5">
            🔥 HOT
          </Badge>
        )}
        {game.rewardMultiplier && game.rewardMultiplier > 1 && (
          <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-[10px] px-2 py-0.5 font-bold">
            {game.rewardMultiplier}x ÖDÜL
          </Badge>
        )}
      </div>

      {/* Sponsor Badge */}
      {game.sponsor && (
        <motion.div 
          className="absolute top-2 right-2"
          animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-[10px] px-2 py-0.5 font-semibold shadow-lg">
            ⭐ {game.sponsor}
          </Badge>
        </motion.div>
      )}

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className={`font-bold text-white drop-shadow-lg ${size === 'large' ? 'text-xl' : 'text-sm'}`}>
          {game.name}
        </h3>
        <div className="flex items-center gap-2 text-white/80 text-xs mt-1">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {game.plays}
          </div>
          {game.category && (
            <Badge variant="outline" className="text-[10px] text-white/70 border-white/30 px-1.5 py-0">
              {categories.find(c => c.id === game.category)?.name}
            </Badge>
          )}
        </div>
      </div>

      {/* Play overlay */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-br from-white to-gray-200 flex items-center justify-center shadow-2xl"
          initial={{ scale: 0 }}
          animate={{ scale: isHovered ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <div className="w-0 h-0 border-l-[28px] border-l-purple-600 border-y-[18px] border-y-transparent ml-2" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default GamesHub;