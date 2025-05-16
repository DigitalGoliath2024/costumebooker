export type TravelRadius = 
  | 'local_only'      // 0-10 miles
  | 'short_distance'  // 10-25 miles
  | 'medium_distance' // 25-50 miles
  | 'long_distance'   // 50-100 miles
  | 'nationwide';     // Will travel anywhere

export const TRAVEL_RADIUS_OPTIONS = [
  { value: 'local_only', label: 'Local Only (0-10 miles)' },
  { value: 'short_distance', label: '10-25 miles' },
  { value: 'medium_distance', label: '25-50 miles' },
  { value: 'long_distance', label: '50-100 miles' },
  { value: 'nationwide', label: 'Nationwide (Will travel anywhere)' }
];

export type Category = 
  | 'Hero'
  | 'Villain'
  | 'Cosplay'
  | 'Furry'
  | 'Anime/Manga'
  | 'Video Game Character'
  | 'Comic Book Character'
  | 'Fantasy'
  | 'Sci-Fi'
  | 'Historical/Fantasy Crossover'
  | 'Kids\' Parties Only'
  | '18+ Events Only'
  | 'Custom Characters'
  | 'Group/Crew Performer'
  | 'Mascot Style';

export const CATEGORIES: Category[] = [
  'Hero',
  'Villain',
  'Cosplay',
  'Furry',
  'Anime/Manga',
  'Video Game Character',
  'Comic Book Character',
  'Fantasy',
  'Sci-Fi',
  'Historical/Fantasy Crossover',
  'Kids\' Parties Only',
  '18+ Events Only',
  'Custom Characters',
  'Group/Crew Performer',
  'Mascot Style'
];

export type State = {
  name: string;
  abbreviation: string;
  cities: string[];
};

export const STATES: State[] = [
  {
    name: 'Alabama',
    abbreviation: 'AL',
    cities: ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile']
  },
  // ... rest of states array
];

export type Profile = {
  id: string;
  displayName: string;
  bio: string;
  state: string;
  city: string;
  priceMin: number | null;
  priceMax: number | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  twitter: string | null;
  isActive: boolean;
  paymentStatus: 'unpaid' | 'paid' | 'expired';
  paymentExpiry: string | null;
  categories: string[];
  images: {
    id: string;
    url: string;
    position: number;
  }[];
  travelRadius: TravelRadius;
  availableForTravel: boolean;
  availableVirtual: boolean;
  requireTravelExpenses: boolean;
  requireDeposit: boolean;
  bringOwnCostume: boolean;
  performOutdoors: boolean;
  requireDressingRoom: boolean;
  familyFriendlyOnly: boolean;
  adultThemesOk: boolean;
  groupPerformer: boolean;
  backgroundCheck: boolean;
};