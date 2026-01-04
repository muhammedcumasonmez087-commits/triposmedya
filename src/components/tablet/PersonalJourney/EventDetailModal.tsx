import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Clock, Calendar, Ticket, ExternalLink,
  Heart, Share2, Users, Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import QRCode from 'react-qr-code';

export interface EventData {
  id: string;
  name: string;
  artist?: string;
  image: string;
  date: string;
  time?: string;
  venue: string;
  location: string;
  price: string;
  description?: string;
  category?: string;
  ticketUrl?: string;
}

interface EventDetailModalProps {
  event: EventData;
  onClose: () => void;
}

export const EventDetailModal = ({ event, onClose }: EventDetailModalProps) => {
  const [showQR, setShowQR] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleGetTicket = () => {
    setShowQR(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden bg-gray-900"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Hero Section */}
          <div className="relative h-64">
            <img 
              src={event.image} 
              alt={event.name}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

            {/* Category Badge */}
            {event.category && (
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary">
                  <Music className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-bold">{event.category}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-16 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setLiked(!liked)}
                className={`w-10 h-10 rounded-full backdrop-blur-lg flex items-center justify-center ${liked ? 'bg-red-500' : 'bg-white/20'}`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'text-white fill-white' : 'text-white'}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Event Name */}
            <div className="absolute bottom-4 left-4 right-4">
              {event.artist && (
                <p className="text-primary font-bold text-lg mb-1">{event.artist}</p>
              )}
              <h2 className="text-2xl font-bold text-white leading-tight">{event.name}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Event Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Tarih</p>
                  <p className="text-white font-semibold">{event.date}</p>
                </div>
              </div>

              {event.time && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Saat</p>
                    <p className="text-white font-semibold">{event.time}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Mekan</p>
                  <p className="text-white font-semibold">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Bilet</p>
                  <p className="text-white font-semibold">{event.price}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-white/70 mb-6">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>

            {/* Description */}
            {event.description && (
              <p className="text-white/80 text-base mb-6 leading-relaxed">
                {event.description}
              </p>
            )}

            {/* QR Code Section */}
            <AnimatePresence>
              {showQR && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="bg-white rounded-2xl p-6 text-center">
                    <h3 className="text-gray-900 font-bold text-lg mb-2">Bilet QR Kodunuz</h3>
                    <p className="text-gray-500 text-sm mb-4">Bu QR kodu gişede gösterin veya online satın alın</p>
                    <div className="flex justify-center mb-4">
                      <QRCode 
                        value={event.ticketUrl || `https://gisekibris.com/event/${event.id}`}
                        size={150}
                      />
                    </div>
                    <p className="text-gray-500 text-sm">Kod: {event.id.toUpperCase()}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetTicket}
                className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-primary to-pink-600 text-white font-bold text-lg"
              >
                <Ticket className="w-6 h-6" />
                {showQR ? 'QR Kod Hazır!' : 'Bilet Al'}
              </motion.button>
              
              {event.ticketUrl && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open(event.ticketUrl, '_blank')}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium"
                >
                  <ExternalLink className="w-5 h-5" />
                  gisekibris.com
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
