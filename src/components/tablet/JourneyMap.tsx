import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { Map, Settings, X } from 'lucide-react';

interface JourneyMapProps {
  progress: number;
  mapboxToken?: string;
  onTokenRequest?: () => void;
}

// Route coordinates: Ercan Airport to Kyrenia Marina
const routeCoordinates: [number, number][] = [
  [33.4961, 35.1548], // Ercan Airport
  [33.4500, 35.1750], // Lefkoşa outskirts
  [33.3800, 35.1900], // Gönyeli
  [33.3400, 35.2200], // Girne road
  [33.3200, 35.2800], // Alsancak
  [33.3231, 35.3375], // Kyrenia Marina
];

// Interpolate position along route based on progress
const getPositionOnRoute = (progress: number): [number, number] => {
  const totalSegments = routeCoordinates.length - 1;
  const segmentIndex = Math.min(Math.floor(progress * totalSegments), totalSegments - 1);
  const segmentProgress = (progress * totalSegments) - segmentIndex;
  
  const start = routeCoordinates[segmentIndex];
  const end = routeCoordinates[Math.min(segmentIndex + 1, routeCoordinates.length - 1)];
  
  return [
    start[0] + (end[0] - start[0]) * segmentProgress,
    start[1] + (end[1] - start[1]) * segmentProgress,
  ];
};

export const JourneyMap = ({ progress, mapboxToken, onTokenRequest }: JourneyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const vehicleMarker = useRef<mapboxgl.Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenInput, setTokenInput] = useState('');

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/navigation-night-v1',
        center: [33.4, 35.25],
        zoom: 10,
        pitch: 45,
        bearing: -20,
        antialias: true,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        'top-right'
      );

      map.current.on('load', () => {
        if (!map.current) return;

        // Add route line
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: routeCoordinates,
            },
          },
        });

        // Traveled route (gradient)
        map.current.addLayer({
          id: 'route-traveled',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#22c55e',
            'line-width': 6,
            'line-opacity': 0.9,
          },
        });

        // Remaining route
        map.current.addLayer({
          id: 'route-remaining',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#6366f1',
            'line-width': 4,
            'line-opacity': 0.6,
            'line-dasharray': [2, 2],
          },
        });

        // Add start marker
        new mapboxgl.Marker({ color: '#22c55e' })
          .setLngLat(routeCoordinates[0])
          .setPopup(new mapboxgl.Popup().setHTML('<strong>Ercan Havalimanı</strong>'))
          .addTo(map.current);

        // Add end marker
        new mapboxgl.Marker({ color: '#6366f1' })
          .setLngLat(routeCoordinates[routeCoordinates.length - 1])
          .setPopup(new mapboxgl.Popup().setHTML('<strong>Girne Marina</strong>'))
          .addTo(map.current);

        // Create vehicle marker element
        const vehicleEl = document.createElement('div');
        vehicleEl.className = 'vehicle-marker';
        vehicleEl.innerHTML = `
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <path d="M9 17h6"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
        `;

        vehicleMarker.current = new mapboxgl.Marker({ element: vehicleEl })
          .setLngLat(getPositionOnRoute(progress))
          .addTo(map.current);

        setIsMapReady(true);
      });

      // Add pulse animation style
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 4px 15px rgba(99, 102, 241, 0.5); }
          50% { transform: scale(1.1); box-shadow: 0 4px 25px rgba(99, 102, 241, 0.8); }
          100% { transform: scale(1); box-shadow: 0 4px 15px rgba(99, 102, 241, 0.5); }
        }
      `;
      document.head.appendChild(style);

    } catch (error) {
      console.error('Map initialization error:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update vehicle position
  useEffect(() => {
    if (!vehicleMarker.current || !isMapReady) return;

    const newPosition = getPositionOnRoute(progress);
    vehicleMarker.current.setLngLat(newPosition);

    // Smoothly pan to vehicle
    map.current?.easeTo({
      center: newPosition,
      duration: 1000,
    });
  }, [progress, isMapReady]);

  const handleTokenSubmit = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('mapbox_token', tokenInput.trim());
      window.location.reload();
    }
  };

  // No token state
  if (!mapboxToken) {
    return (
      <div className="relative h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          {showTokenInput ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Mapbox Token</span>
                <button 
                  onClick={() => setShowTokenInput(false)}
                  className="p-1 rounded-full hover:bg-muted"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="pk.eyJ1..."
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleTokenSubmit}
                className="w-full mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Haritayı Aktifleştir
              </button>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                <a 
                  href="https://mapbox.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  mapbox.com
                </a>
                {' '}adresinden token alabilirsiniz
              </p>
            </motion.div>
          ) : (
            <>
              <Map className="w-10 h-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-3 text-center">
                Gerçek harita için Mapbox token gerekli
              </p>
              <button
                onClick={() => setShowTokenInput(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Token Ekle
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-40 rounded-2xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-card/20 to-transparent" />
      
      {/* Live label */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-2 left-2 flex items-center gap-2 px-2 py-1 rounded-lg bg-card/90 backdrop-blur text-xs"
      >
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-green-500"
        />
        <span className="text-foreground font-medium">Canlı GPS</span>
      </motion.div>
      
      {/* Progress indicator */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-card/50 backdrop-blur rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-green-500 to-primary rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-xs text-card font-bold bg-primary/80 px-2 py-0.5 rounded">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  );
};
