import { useState } from 'react';
import { Home, Gamepad2, Trophy, Star, Flame, Clock, Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface GamesHubProps {
  onBack: () => void;
  onPlayGame: (game: Game) => void;
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
}

const categories = [
  { id: 'all', name: 'Tüm Oyunlar', icon: Gamepad2 },
  { id: 'puzzle', name: 'Bulmaca', icon: Star },
  { id: 'arcade', name: 'Arcade', icon: Flame },
  { id: 'card', name: 'Kart', icon: Heart },
  { id: 'sports', name: 'Spor', icon: Trophy },
];

const games: Game[] = [
  {
    id: '1',
    name: '2048',
    category: 'puzzle',
    plays: '1.2M',
    thumbnail: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=300&h=200&fit=crop',
    sponsor: 'Turkcell',
    isHot: true,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Sudoku Master',
    category: 'puzzle',
    plays: '856K',
    thumbnail: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=300&h=200&fit=crop',
    sponsor: 'Vodafone',
    isNew: true,
  },
  {
    id: '3',
    name: 'Solitaire Classic',
    category: 'card',
    plays: '2.1M',
    thumbnail: 'https://images.unsplash.com/photo-1529480780361-266a3436e021?w=300&h=200&fit=crop',
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Bubble Shooter',
    category: 'arcade',
    plays: '1.8M',
    thumbnail: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=300&h=200&fit=crop',
    sponsor: 'Coca-Cola',
    isHot: true,
  },
  {
    id: '5',
    name: 'Chess Pro',
    category: 'puzzle',
    plays: '654K',
    thumbnail: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=300&h=200&fit=crop',
    isNew: true,
  },
  {
    id: '6',
    name: 'Mahjong Zen',
    category: 'puzzle',
    plays: '987K',
    thumbnail: 'https://images.unsplash.com/photo-1596451190630-186aff535bf2?w=300&h=200&fit=crop',
    sponsor: 'Turkish Airlines',
    isFeatured: true,
  },
  {
    id: '7',
    name: 'Basketball Stars',
    category: 'sports',
    plays: '445K',
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop',
    isHot: true,
  },
  {
    id: '8',
    name: 'Word Search',
    category: 'puzzle',
    plays: '723K',
    thumbnail: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=300&h=200&fit=crop',
    sponsor: 'Migros',
  },
  {
    id: '9',
    name: 'Tetris Rush',
    category: 'arcade',
    plays: '1.5M',
    thumbnail: 'https://images.unsplash.com/photo-1493711662062-fa541f7f0176?w=300&h=200&fit=crop',
    isNew: true,
    isHot: true,
  },
  {
    id: '10',
    name: 'Poker Night',
    category: 'card',
    plays: '892K',
    thumbnail: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=300&h=200&fit=crop',
    sponsor: 'Garanti BBVA',
  },
];

export const GamesHub = ({ onBack, onPlayGame }: GamesHubProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredGames = games.filter(g => g.isFeatured);
  const hotGames = games.filter(g => g.isHot);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Home className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-8 h-8 text-yellow-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Oyun Merkezi
              </h1>
            </div>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              placeholder="Oyun ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto">
          {categories.map(cat => (
            <Button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              variant={selectedCategory === cat.id ? 'default' : 'ghost'}
              className={`flex items-center gap-2 whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Sponsor Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-red-800 p-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <Badge className="bg-yellow-500 text-black mb-2">🎮 SPONSOR</Badge>
              <h2 className="text-2xl font-bold mb-2">Coca-Cola Oyun Maratonu</h2>
              <p className="text-white/80 mb-4">Oyun oyna, puan kazan, ödülleri kap!</p>
              <Button className="bg-white text-red-600 hover:bg-white/90">
                <Trophy className="w-4 h-4 mr-2" />
                Yarışmaya Katıl
              </Button>
            </div>
            <div className="text-6xl">🏆</div>
          </div>
        </div>

        {/* Featured Games */}
        {selectedCategory === 'all' && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold">Öne Çıkanlar</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {featuredGames.map(game => (
                <GameCard key={game.id} game={game} onPlay={onPlayGame} size="large" />
              ))}
            </div>
          </section>
        )}

        {/* Hot Games */}
        {selectedCategory === 'all' && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold">Popüler Oyunlar</h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {hotGames.map(game => (
                <GameCard key={game.id} game={game} onPlay={onPlayGame} />
              ))}
            </div>
          </section>
        )}

        {/* All Games */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold">
              {selectedCategory === 'all' ? 'Tüm Oyunlar' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {filteredGames.map(game => (
              <GameCard key={game.id} game={game} onPlay={onPlayGame} />
            ))}
          </div>
        </section>

        {/* Reward Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-white text-emerald-700 mb-2">🎁 ÖDÜL</Badge>
              <h2 className="text-2xl font-bold mb-2">Günlük Oyun Görevi</h2>
              <p className="text-white/80 mb-4">3 oyun oyna, sponsor kuponlarını kazan!</p>
              <div className="flex gap-2">
                <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
                  <div className="text-2xl font-bold">0/3</div>
                  <div className="text-xs text-white/70">Oyun</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-xs text-white/70">Puan</div>
                </div>
              </div>
            </div>
            <div className="text-6xl">🎁</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
  size?: 'normal' | 'large';
}

const GameCard = ({ game, onPlay, size = 'normal' }: GameCardProps) => {
  return (
    <div
      onClick={() => onPlay(game)}
      className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 ${
        size === 'large' ? 'aspect-[16/10]' : 'aspect-[4/3]'
      }`}
    >
      <img
        src={game.thumbnail}
        alt={game.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      
      {/* Badges */}
      <div className="absolute top-2 left-2 flex gap-1">
        {game.isNew && (
          <Badge className="bg-green-500 text-white text-xs">YENİ</Badge>
        )}
        {game.isHot && (
          <Badge className="bg-orange-500 text-white text-xs">🔥 HOT</Badge>
        )}
      </div>

      {/* Sponsor Badge */}
      {game.sponsor && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-yellow-500/90 text-black text-xs">
            ⭐ {game.sponsor}
          </Badge>
        </div>
      )}

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className={`font-bold text-white ${size === 'large' ? 'text-lg' : 'text-sm'}`}>
          {game.name}
        </h3>
        <div className="flex items-center gap-1 text-white/70 text-xs">
          <Clock className="w-3 h-3" />
          {game.plays} oynama
        </div>
      </div>

      {/* Play overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
          <div className="w-0 h-0 border-l-[20px] border-l-purple-600 border-y-[12px] border-y-transparent ml-1" />
        </div>
      </div>
    </div>
  );
};

export default GamesHub;
