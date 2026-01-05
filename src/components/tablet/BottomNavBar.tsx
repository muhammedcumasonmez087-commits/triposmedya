import { Home, Gamepad2, Compass, Music, Wifi, MapPin, ChevronLeft } from 'lucide-react';

export type NavItemId = 'location' | 'home' | 'games' | 'explore' | 'music' | 'wifi';

interface BottomNavBarProps {
  activeItem?: NavItemId;
  onNavClick: (id: NavItemId) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, sublabel, active = false, onClick }: NavItemProps) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
      active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
    }`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
    {sublabel && <span className="text-[10px] opacity-70">{sublabel}</span>}
  </button>
);

export const BottomNavBar = ({ 
  activeItem, 
  onNavClick, 
  onBack,
  showBackButton = false 
}: BottomNavBarProps) => {
  return (
    <nav className="shrink-0 bg-card/95 backdrop-blur-xl border-t border-border/50 px-6 py-3">
      <div className="flex items-center justify-around max-w-2xl mx-auto">
        {showBackButton && onBack ? (
          <button 
            onClick={onBack}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-xs font-medium">Geri</span>
          </button>
        ) : (
          <NavItem 
            icon={<MapPin className="w-5 h-5" />} 
            label="Lefkoşa" 
            sublabel="Kalkış" 
            active={activeItem === 'location'} 
            onClick={() => onNavClick('location')} 
          />
        )}
        <NavItem 
          icon={<Home className="w-5 h-5" />} 
          label="Ana Sayfa" 
          active={activeItem === 'home'} 
          onClick={() => onNavClick('home')} 
        />
        <NavItem 
          icon={<Gamepad2 className="w-5 h-5" />} 
          label="Oyunlar" 
          active={activeItem === 'games'} 
          onClick={() => onNavClick('games')} 
        />
        <NavItem 
          icon={<Compass className="w-5 h-5" />} 
          label="Keşfet" 
          active={activeItem === 'explore'} 
          onClick={() => onNavClick('explore')} 
        />
        <NavItem 
          icon={<Music className="w-5 h-5" />} 
          label="Müzik" 
          active={activeItem === 'music'} 
          onClick={() => onNavClick('music')} 
        />
        <NavItem 
          icon={<Wifi className="w-5 h-5" />} 
          label="WiFi" 
          active={activeItem === 'wifi'} 
          onClick={() => onNavClick('wifi')} 
        />
      </div>
    </nav>
  );
};

export default BottomNavBar;
