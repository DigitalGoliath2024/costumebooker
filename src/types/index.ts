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
    cities: ['Birmingham', 'Huntsville', 'Mobile', 'Montgomery', 'Tuscaloosa']
  },
  {
    name: 'Alaska',
    abbreviation: 'AK',
    cities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Wasilla']
  },
  {
    name: 'Arizona',
    abbreviation: 'AZ',
    cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Gilbert', 'Glendale', 'Tempe']
  },
  {
    name: 'Arkansas',
    abbreviation: 'AR',
    cities: ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro']
  },
  {
    name: 'California',
    abbreviation: 'CA',
    cities: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside']
  },
  {
    name: 'Colorado',
    abbreviation: 'CO',
    cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Boulder']
  },
  {
    name: 'Connecticut',
    abbreviation: 'CT',
    cities: ['Bridgeport', 'New Haven', 'Stamford', 'Hartford', 'Waterbury']
  },
  {
    name: 'Delaware',
    abbreviation: 'DE',
    cities: ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna']
  },
  {
    name: 'Florida',
    abbreviation: 'FL',
    cities: ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Tallahassee', 'Fort Lauderdale', 'Port St. Lucie', 'Cape Coral']
  },
  {
    name: 'Georgia',
    abbreviation: 'GA',
    cities: ['Atlanta', 'Augusta', 'Columbus', 'Macon', 'Savannah', 'Athens', 'Sandy Springs']
  },
  {
    name: 'Hawaii',
    abbreviation: 'HI',
    cities: ['Honolulu', 'Pearl City', 'Hilo', 'Kailua', 'Waipahu']
  },
  {
    name: 'Idaho',
    abbreviation: 'ID',
    cities: ['Boise', 'Nampa', 'Meridian', 'Idaho Falls', 'Pocatello']
  },
  {
    name: 'Illinois',
    abbreviation: 'IL',
    cities: ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville', 'Springfield', 'Peoria']
  },
  {
    name: 'Indiana',
    abbreviation: 'IN',
    cities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel']
  },
  {
    name: 'Iowa',
    abbreviation: 'IA',
    cities: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City']
  },
  {
    name: 'Kansas',
    abbreviation: 'KS',
    cities: ['Wichita', 'Overland Park', 'Kansas City', 'Olathe', 'Topeka']
  },
  {
    name: 'Kentucky',
    abbreviation: 'KY',
    cities: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington']
  },
  {
    name: 'Louisiana',
    abbreviation: 'LA',
    cities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles']
  },
  {
    name: 'Maine',
    abbreviation: 'ME',
    cities: ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn']
  },
  {
    name: 'Maryland',
    abbreviation: 'MD',
    cities: ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie']
  },
  {
    name: 'Massachusetts',
    abbreviation: 'MA',
    cities: ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge']
  },
  {
    name: 'Michigan',
    abbreviation: 'MI',
    cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Lansing', 'Ann Arbor']
  },
  {
    name: 'Minnesota',
    abbreviation: 'MN',
    cities: ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth', 'Bloomington']
  },
  {
    name: 'Mississippi',
    abbreviation: 'MS',
    cities: ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi']
  },
  {
    name: 'Missouri',
    abbreviation: 'MO',
    cities: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence']
  },
  {
    name: 'Montana',
    abbreviation: 'MT',
    cities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte']
  },
  {
    name: 'Nebraska',
    abbreviation: 'NE',
    cities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney']
  },
  {
    name: 'Nevada',
    abbreviation: 'NV',
    cities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks']
  },
  {
    name: 'New Hampshire',
    abbreviation: 'NH',
    cities: ['Manchester', 'Nashua', 'Concord', 'Dover', 'Rochester']
  },
  {
    name: 'New Jersey',
    abbreviation: 'NJ',
    cities: ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Edison']
  },
  {
    name: 'New Mexico',
    abbreviation: 'NM',
    cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell']
  },
  {
    name: 'New York',
    abbreviation: 'NY',
    cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany']
  },
  {
    name: 'North Carolina',
    abbreviation: 'NC',
    cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville']
  },
  {
    name: 'North Dakota',
    abbreviation: 'ND',
    cities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo']
  },
  {
    name: 'Ohio',
    abbreviation: 'OH',
    cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron']
  },
  {
    name: 'Oklahoma',
    abbreviation: 'OK',
    cities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond']
  },
  {
    name: 'Oregon',
    abbreviation: 'OR',
    cities: ['Portland', 'Salem', 'Eugene', 'Gresham', 'Hillsboro']
  },
  {
    name: 'Pennsylvania',
    abbreviation: 'PA',
    cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading']
  },
  {
    name: 'Rhode Island',
    abbreviation: 'RI',
    cities: ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence']
  },
  {
    name: 'South Carolina',
    abbreviation: 'SC',
    cities: ['Columbia', 'Charleston', 'North Charleston', 'Mount Pleasant', 'Rock Hill']
  },
  {
    name: 'South Dakota',
    abbreviation: 'SD',
    cities: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown']
  },
  {
    name: 'Tennessee',
    abbreviation: 'TN',
    cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville']
  },
  {
    name: 'Texas',
    abbreviation: 'TX',
    cities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Laredo']
  },
  {
    name: 'Utah',
    abbreviation: 'UT',
    cities: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem']
  },
  {
    name: 'Vermont',
    abbreviation: 'VT',
    cities: ['Burlington', 'South Burlington', 'Rutland', 'Barre', 'Montpelier']
  },
  {
    name: 'Virginia',
    abbreviation: 'VA',
    cities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News']
  },
  {
    name: 'Washington',
    abbreviation: 'WA',
    cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue']
  },
  {
    name: 'West Virginia',
    abbreviation: 'WV',
    cities: ['Charleston', 'Huntington', 'Parkersburg', 'Morgantown', 'Wheeling']
  },
  {
    name: 'Wisconsin',
    abbreviation: 'WI',
    cities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine']
  },
  {
    name: 'Wyoming',
    abbreviation: 'WY',
    cities: ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs']
  }
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
  travelRadius?: TravelRadius;
  availableForTravel?: boolean;
  availableVirtual?: boolean;
  requireTravelExpenses?: boolean;
  requireDeposit?: boolean;
  bringOwnCostume?: boolean;
  performOutdoors?: boolean;
  requireDressingRoom?: boolean;
  familyFriendlyOnly?: boolean;
  adultThemesOk?: boolean;
  groupPerformer?: boolean;
  backgroundCheck?: boolean;
  contactEmail?: string;
};