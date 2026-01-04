import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Settings, X, Hotel, Utensils, Umbrella, MapPin, Star, Clock, Phone } from 'lucide-react';

interface PlaceMarker {
  id: string;
  name: string;
  type: 'hotel' | 'restaurant' | 'beach';
  coordinates: [number, number];
  rating: number;
  description: string;
  image: string;
  hours?: string;
  phone?: string;
}

const places: PlaceMarker[] = [
  // Hotels
  {
    id: 'h1',
    name: 'Merit Royal Hotel',
    type: 'hotel',
    coordinates: [33.3150, 35.3450],
    rating: 5,
    description: 'Lüks 5 yıldızlı otel, özel plaj ve spa',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop',
    phone: '+90 392 650 0000',
  },
  {
    id: 'h2',
    name: 'Elexus Hotel',
    type: 'hotel',
    coordinates: [33.3320, 35.3420],
    rating: 5,
    description: 'Ultra her şey dahil tatil köyü',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=200&fit=crop',
    phone: '+90 392 650 1000',
  },
  {
    id: 'h3',
    name: 'Acapulco Resort',
    type: 'hotel',
    coordinates: [33.3280, 35.3380],
    rating: 4,
    description: 'Eğlence merkezli aile oteli',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300&h=200&fit=crop',
    phone: '+90 392 824 4949',
  },
  // Restaurants
  {
    id: 'r1',
    name: 'Niazi\'s Restaurant',
    type: 'restaurant',
    coordinates: [33.3231, 35.3375],
    rating: 4.8,
    description: 'Geleneksel Kıbrıs mutfağı ve deniz ürünleri',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop',
    hours: '12:00 - 23:00',
    phone: '+90 392 815 2160',
  },
  {
    id: 'r2',
    name: 'The Stone Castle',
    type: 'restaurant',
    coordinates: [33.3180, 35.2850],
    rating: 4.6,
    description: 'Tarihi kalede meze ve şarap keyfi',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=300&h=200&fit=crop',
    hours: '18:00 - 00:00',
    phone: '+90 392 815 7749',
  },
  {
    id: 'r3',
    name: 'Bellapais Gardens',
    type: 'restaurant',
    coordinates: [33.3550, 35.3100],
    rating: 4.9,
    description: 'Muhteşem manzaralı romantik akşam yemeği',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300&h=200&fit=crop',
    hours: '19:00 - 23:30',
    phone: '+90 392 815 6066',
  },
  // Beaches
  {
    id: 'b1',
    name: 'Escape Beach Club',
    type: 'beach',
    coordinates: [33.3050, 35.3520],
    rating: 4.7,
    description: 'DJ setleri ve pool party\'ler',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop',
    hours: '09:00 - 02:00',
  },
  {
    id: 'b2',
    name: 'Alagadi Kaplumbağa Plajı',
    type: 'beach',
    coordinates: [33.4800, 35.3350],
    rating: 4.9,
    description: 'Deniz kaplumbağalarının yuvalama alanı',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=300&h=200&fit=crop',
    hours: '06:00 - 20:00',
  },
  {
    id: 'b3',
    name: 'Glapsides Beach',
    type: 'beach',
    coordinates: [33.9500, 35.1250],
    rating: 4.5,
    description: 'Altın kumlu uzun sahil şeridi',
    image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=300&h=200&fit=crop',
    hours: '07:00 - 19:00',
  },
];

const typeConfig = {
  hotel: {
    color: '#8b5cf6',
    bgColor: 'bg-violet-500',
    icon: Hotel,
    label: 'Oteller',
  },
  restaurant: {
    color: '#f97316',
    bgColor: 'bg-orange-500',
    icon: Utensils,
    label: 'Restoranlar',
  },
  beach: {
    color: '#06b6d4',
    bgColor: 'bg-cyan-500',
    icon: Umbrella,
    label: 'Plajlar',
  },
};

export const ExploreMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceMarker | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<'hotel' | 'restaurant' | 'beach'>>(
    new Set(['hotel', 'restaurant', 'beach'])
  );

  // Load token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [33.4, 35.25],
        zoom: 9.5,
        pitch: 30,
        antialias: true,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        'top-right'
      );

      map.current.on('load', () => {
        setIsMapReady(true);
      });

    } catch (error) {
      console.error('Map initialization error:', error);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Add markers when map is ready
  useEffect(() => {
    if (!map.current || !isMapReady) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add filtered markers
    places
      .filter(place => activeFilters.has(place.type))
      .forEach(place => {
        const config = typeConfig[place.type];
        
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = `
          <div style="
            width: 44px;
            height: 44px;
            background: ${config.color};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
          ">
            <div style="transform: rotate(45deg); color: white; font-size: 18px;">
              ${place.type === 'hotel' ? '🏨' : place.type === 'restaurant' ? '🍽️' : '🏖️'}
            </div>
          </div>
        `;

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
          el.style.zIndex = '10';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          el.style.zIndex = '1';
        });
        el.addEventListener('click', () => {
          setSelectedPlace(place);
          map.current?.flyTo({
            center: place.coordinates,
            zoom: 14,
            duration: 1000,
          });
        });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(place.coordinates)
          .addTo(map.current!);

        markersRef.current.push(marker);
      });
  }, [isMapReady, activeFilters]);

  const toggleFilter = (type: 'hotel' | 'restaurant' | 'beach') => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const handleTokenSubmit = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('mapbox_token', tokenInput.trim());
      setMapboxToken(tokenInput.trim());
      setShowTokenInput(false);
    }
  };

  // No token state
  if (!mapboxToken) {
    return (
      <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          {showTokenInput ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm bg-card/90 backdrop-blur-xl rounded-2xl p-6 border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-foreground">Mapbox Token</span>
                <button 
                  onClick={() => setShowTokenInput(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="pk.eyJ1..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleTokenSubmit}
                className="w-full mt-4 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Haritayı Aktifleştir
              </button>
              <p className="mt-3 text-sm text-muted-foreground text-center">
                <a 
                  href="https://mapbox.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  mapbox.com
                </a>
                {' '}adresinden ücretsiz token alabilirsiniz
              </p>
            </motion.div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Map className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">İnteraktif Harita</h3>
              <p className="text-muted-foreground mb-6 max-w-xs">
                Oteller, restoranlar ve plajları haritada keşfetmek için Mapbox token ekleyin
              </p>
              <button
                onClick={() => setShowTokenInput(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors mx-auto"
              >
                <Settings className="w-5 h-5" />
                Token Ekle
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full rounded-2xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Filter buttons */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        {(Object.entries(typeConfig) as [keyof typeof typeConfig, typeof typeConfig[keyof typeof typeConfig]][]).map(([type, config]) => {
          const Icon = config.icon;
          const isActive = activeFilters.has(type);
          return (
            <motion.button
              key={type}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleFilter(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive 
                  ? `${config.bgColor} text-white shadow-lg` 
                  : 'bg-card/90 text-muted-foreground backdrop-blur-sm'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{config.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Selected place card */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-4 left-4 right-4 z-20"
          >
            <div className="bg-card/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-border shadow-2xl">
              <div className="flex">
                <img 
                  src={selectedPlace.image} 
                  alt={selectedPlace.name}
                  className="w-32 h-32 object-cover"
                />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${typeConfig[selectedPlace.type].bgColor}`}>
                          {typeConfig[selectedPlace.type].label.slice(0, -3)}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-medium">{selectedPlace.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{selectedPlace.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{selectedPlace.description}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedPlace(null)}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    {selectedPlace.hours && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{selectedPlace.hours}</span>
                      </div>
                    )}
                    {selectedPlace.phone && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{selectedPlace.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Yol Tarifi Al
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-xl px-4 py-3 z-10">
        <p className="text-xs text-muted-foreground mb-2">Mekanlar</p>
        <div className="flex flex-col gap-1.5">
          {Object.entries(typeConfig).map(([type, config]) => (
            <div key={type} className="flex items-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${config.bgColor}`} />
              <span className="text-foreground">{config.label}</span>
              <span className="text-muted-foreground">
                ({places.filter(p => p.type === type).length})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
