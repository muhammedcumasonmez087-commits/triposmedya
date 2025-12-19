import { Wifi, Clock, Sun } from 'lucide-react';

interface HeaderProps {
  showLogo?: boolean;
  transparent?: boolean;
}

export const Header = ({ showLogo = true, transparent = false }: HeaderProps) => {
  const currentTime = new Date().toLocaleTimeString('tr-TR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <header className={`flex items-center justify-between px-8 py-4 ${transparent ? '' : 'bg-card/80 backdrop-blur-lg'}`}>
      {showLogo && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">K</span>
          </div>
          <div>
            <h1 className="font-bold text-foreground text-lg">Kuzey Kıbrıs</h1>
            <p className="text-xs text-muted-foreground">KEŞİF REHBERİ</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-6 ml-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="font-medium">{currentTime}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sun className="w-4 h-4 text-highlight" />
          <span className="font-medium">28°C</span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20">
          <Wifi className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">Free WiFi</span>
        </div>
      </div>
    </header>
  );
};
