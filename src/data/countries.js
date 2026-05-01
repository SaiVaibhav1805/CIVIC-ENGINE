export const COUNTRIES = {
  IN: {
    name: 'India', flag: '🇮🇳', system: 'Parliamentary FPTP',
    color: '#FF9933', seats: 543, majority: 272,
    portal: 'https://electoralsearch.eci.gov.in',
    parties: ['BJP', 'INC', 'SP', 'TMC', 'OTH'],
  },
  US: {
    name: 'United States', flag: '🇺🇸', system: 'Presidential Electoral College',
    color: '#3C6EB4', seats: 538, majority: 270,
    portal: 'https://vote.gov',
    parties: ['Democrat', 'Republican', 'Independent', 'Green'],
  },
  UK: {
    name: 'United Kingdom', flag: '🇬🇧', system: 'Parliamentary FPTP',
    color: '#C8102E', seats: 650, majority: 326,
    portal: 'https://www.gov.uk/register-to-vote',
    parties: ['Labour', 'Conservative', 'Lib Dems', 'SNP', 'Other'],
  },
  EU: {
    name: 'European Union', flag: '🇪🇺', system: 'Proportional Representation',
    color: '#003399', seats: 720, majority: 361,
    portal: 'https://european-union.europa.eu',
    parties: ['EPP', 'S&D', 'ECR', 'Renew', 'Other'],
  },
}

export const BASE_RESULTS = {
  IN: {
    votes: { BJP: 37.4, INC: 21.2, SP: 5.5, TMC: 7.5, OTH: 28.4 },
    seats: { BJP: 240, INC: 99,  SP: 37,  TMC: 29,  OTH: 138 },
  },
  US: {
    votes: { Democrat: 51.3, Republican: 46.8, Independent: 1.9, Green: 0.0 },
    seats: { Democrat: 306, Republican: 232, Independent: 0, Green: 0 },
  },
  UK: {
    votes: { Labour: 33.7, Conservative: 23.7, 'Lib Dems': 12.2, SNP: 2.5, Other: 27.9 },
    seats: { Labour: 412, Conservative: 121, 'Lib Dems': 72, SNP: 9, Other: 36 },
  },
  EU: {
    votes: { EPP: 26.0, 'S&D': 19.0, ECR: 10.5, Renew: 9.7, Other: 34.8 },
    seats: { EPP: 188, 'S&D': 136, ECR: 78, Renew: 77, Other: 241 },
  },
}

export const PARTY_COLORS = {
  // India
  BJP: '#FF9933', INC: '#00BFFF', SP: '#FF0000', TMC: '#2FCC40', OTH: '#888888',
  // US
  Democrat: '#3C6EB4', Republican: '#BF4040', Independent: '#7A7A8A', Green: '#3D8F6E',
  // UK
  Labour: '#E4003B', Conservative: '#0087DC', 'Lib Dems': '#FAA61A', SNP: '#FDF38E', Other: '#888888',
  // EU
  EPP: '#3399FF', 'S&D': '#FF1A1A', ECR: '#2299BB', Renew: '#FFCC00',
}
