// Kişisel Yolculuk Tipleri

export type CategoryId = 'hotel' | 'beach' | 'restaurant' | 'history' | 'entertainment' | 'shopping';

export interface JourneyCategory {
  id: CategoryId;
  name: string;
  nameTR: string;
  description: string;
  icon: string;
  gradient: string;
  accentColor: string;
  cardStyle: 'luxury' | 'vibrant' | 'warm' | 'classic' | 'dynamic' | 'elegant';
}

export interface JourneyAd {
  id: string;
  categoryId: CategoryId;
  tier: 'platinum' | 'gold' | 'bronze';
  name: string;
  logo: string;
  tagline: string;
  description: string;
  fullDescription: string;
  offer: string;
  offerValue: string;
  couponCode: string;
  image: string;
  videoUrl?: string;
  location: string;
  distance?: string;
  rating: number;
  reviewCount: number;
  priceRange?: string;
  highlights: string[];
  validUntil: string;
  ctaText: string;
  ctaAction: 'reserve' | 'book' | 'menu' | 'visit' | 'tickets' | 'shop';
}

export interface JourneyStep {
  type: 'discovery' | 'personalized-feed' | 'detail' | 'reward';
}

export interface UserJourneyState {
  selectedCategories: CategoryId[];
  viewedAds: string[];
  claimedOffers: string[];
  rewardPoints: number;
}
