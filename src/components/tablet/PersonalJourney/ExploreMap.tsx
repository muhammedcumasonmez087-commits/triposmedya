import { motion } from 'framer-motion';
import { MapPin, Compass, Navigation } from 'lucide-react';

export const ExploreMap = () => {
  const googleMapsUrl = "https://www.google.com/maps/d/embed?mid=128PJmjMY7206PsTudNDqrC7agAbZEK4&ehbc=2E312F&ll=35.385254683777575%2C33.69330265000001&z=10";

  return (
    <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden">
      {/* Google Maps Embed */}
      <iframe
        src={googleMapsUrl}
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Kuzey Kıbrıs Haritası"
      />
      
      {/* Overlay Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 right-4 z-10"
      >
        <div className="bg-card/90 backdrop-blur-xl rounded-xl px-5 py-3 border border-border/50 shadow-lg inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground font-bold text-lg">Kuzey Kıbrıs Keşfet</h3>
            <p className="text-muted-foreground text-sm">Haritada gezinin, mekanları keşfedin</p>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-4 right-4 z-10"
      >
        <div className="bg-card/90 backdrop-blur-xl rounded-xl px-4 py-3 border border-border/50 shadow-lg">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Harita Gösterimleri</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-foreground">Gezilecek Yerler</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-foreground">Yeme-İçme</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-foreground">Plajlar</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Access Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-4 left-4 z-10 flex gap-2"
      >
        <a
          href="https://www.google.com/maps/d/u/0/viewer?mid=128PJmjMY7206PsTudNDqrC7agAbZEK4"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg"
        >
          <Navigation className="w-4 h-4" />
          Tam Ekran Aç
        </a>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card/90 backdrop-blur-xl text-foreground font-medium text-sm hover:bg-card transition-colors border border-border/50 shadow-lg">
          <MapPin className="w-4 h-4" />
          Konumum
        </button>
      </motion.div>
    </div>
  );
};
