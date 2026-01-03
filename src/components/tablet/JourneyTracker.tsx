import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  Star, 
  Phone, 
  MessageCircle,
  Car,
  Route,
  ThermometerSun,
  Shield,
  Zap
} from 'lucide-react';
import { JourneyMap } from './JourneyMap';

interface JourneyTrackerProps {
  isVisible?: boolean;
  onClose?: () => void;
}

// Simulated journey data
const journeyData = {
  driver: {
    name: 'Mehmet Yılmaz',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    trips: 2847,
    verified: true,
    vehicle: {
      model: 'Mercedes Vito',
      plate: '34 ABC 123',
      color: 'Gümüş Gri'
    }
  },
  route: {
    from: 'Ercan Havalimanı',
    to: 'Girne Marina',
    distance: '45 km',
    duration: 35, // minutes
    currentProgress: 0.35, // 35% complete
    currentLocation: 'Lefkoşa Çevre Yolu'
  },
  conditions: {
    traffic: 'Hafif',
    weather: '28°C Güneşli',
    fuelLevel: 85
  }
};

export const JourneyTracker = ({ isVisible = true, onClose }: JourneyTrackerProps) => {
  const [eta, setEta] = useState(journeyData.route.duration);
  const [progress, setProgress] = useState(journeyData.route.currentProgress);
  const [currentLocation, setCurrentLocation] = useState(journeyData.route.currentLocation);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  // Load Mapbox token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('mapbox_token');
    if (token) {
      setMapboxToken(token);
    }
  }, []);
  // Simulate journey progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 0.005, 1);
        return newProgress;
      });
      setEta(prev => Math.max(prev - 0.5, 0));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Simulate location updates
  useEffect(() => {
    const locations = [
      'Ercan Çıkışı',
      'Lefkoşa Çevre Yolu',
      'Gönyeli Kavşağı',
      'Girne Yolu',
      'Alsancak',
      'Girne Marina'
    ];
    
    const locationIndex = Math.floor(progress * (locations.length - 1));
    setCurrentLocation(locations[locationIndex]);
  }, [progress]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-24 left-4 right-4 z-20"
        >
          <div className="bg-card/95 backdrop-blur-xl rounded-3xl shadow-elevated border border-border/50 overflow-hidden">
            {/* Close Button */}
            {onClose && (
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-foreground text-lg">✕</span>
              </motion.button>
            )}

            {/* GPS Pulse Effect */}
            <div className="absolute top-4 right-16 z-10">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 w-3 h-3 rounded-full bg-green-500"
                />
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-glow" />
              </div>
            </div>

            {/* Live Tag */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute top-4 left-4 z-10"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/90 text-white text-xs font-bold">
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-white"
                />
                CANLI
              </div>
            </motion.div>

            {/* Header - Driver Info */}
            <div className="p-4 pt-12 pb-3 border-b border-border/30">
              <div className="flex items-center gap-4">
                {/* Driver Photo */}
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={journeyData.driver.photo} 
                    alt={journeyData.driver.name}
                    className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                  />
                  {journeyData.driver.verified && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg"
                    >
                      <Shield className="w-3.5 h-3.5 text-primary-foreground" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Driver Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-lg">{journeyData.driver.name}</h3>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-yellow-600">{journeyData.driver.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{journeyData.driver.trips.toLocaleString()} yolculuk</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {journeyData.driver.vehicle.model} • {journeyData.driver.vehicle.plate}
                    </span>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-primary" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-accent" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Route Progress */}
            <div className="p-4 pb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-foreground">{journeyData.route.from}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{journeyData.route.to}</span>
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 via-accent to-primary rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Vehicle Icon on Progress */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `calc(${progress * 100}% - 12px)` }}
                >
                  <motion.div
                    animate={{ y: [-1, 1, -1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-6 h-6 rounded-full bg-card shadow-lg flex items-center justify-center border-2 border-primary"
                  >
                    <Car className="w-3.5 h-3.5 text-primary" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Current Location */}
              <motion.div 
                key={currentLocation}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-muted/50"
              >
                <Navigation className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-sm text-muted-foreground">Şu an:</span>
                <span className="text-sm font-semibold text-foreground">{currentLocation}</span>
              </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3 px-4 pb-4">
              {/* ETA */}
              <motion.div 
                className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-3 text-center"
                whileHover={{ scale: 1.02 }}
              >
                <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                <motion.p 
                  key={Math.floor(eta)}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-foreground"
                >
                  {Math.floor(eta)}
                </motion.p>
                <p className="text-xs text-muted-foreground">dakika</p>
              </motion.div>

              {/* Distance */}
              <motion.div 
                className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl p-3 text-center"
                whileHover={{ scale: 1.02 }}
              >
                <Route className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-2xl font-bold text-foreground">{journeyData.route.distance}</p>
                <p className="text-xs text-muted-foreground">mesafe</p>
              </motion.div>

              {/* Weather */}
              <motion.div 
                className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 rounded-2xl p-3 text-center"
                whileHover={{ scale: 1.02 }}
              >
                <ThermometerSun className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-foreground">28°</p>
                <p className="text-xs text-muted-foreground">güneşli</p>
              </motion.div>

              {/* Traffic */}
              <motion.div 
                className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl p-3 text-center"
                whileHover={{ scale: 1.02 }}
              >
                <Zap className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">Hafif</p>
                <p className="text-xs text-muted-foreground">trafik</p>
              </motion.div>
            </div>

            {/* Real Mapbox Map */}
            <div className="px-4 pb-4">
              <JourneyMap 
                progress={progress} 
                mapboxToken={mapboxToken || undefined}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
