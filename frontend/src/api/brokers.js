const sampleBrokers = [
  {
    id: 1,
    name: 'AlphaTrade',
    tagline: 'Fast execution · Low spreads',
    instruments: ['Stocks', 'Options', 'Futures'],
    rating: 4.6,
    fees: '0.1% per trade',
    website: 'https://alphatrade.example',
    email: 'support@alphatrade.example',
    description: 'AlphaTrade is a low-latency broker focused on active traders and institutional order flow.'
  },
  {
    id: 2,
    name: 'Zenith Brokers',
    tagline: 'Research-driven investing',
    instruments: ['Stocks', 'ETFs', 'Bonds'],
    rating: 4.2,
    fees: 'Flat $4.99 per trade',
    website: 'https://zenith.example',
    email: 'help@zenith.example',
    description: 'Zenith provides premium research and portfolio tools for buy-and-hold investors.'
  },
  {
    id: 3,
    name: 'Delta Securities',
    tagline: 'Access global markets',
    instruments: ['Stocks', 'Forex', 'Crypto'],
    rating: 4.0,
    fees: 'Commission-free equities, spreads apply for FX',
    website: 'https://delta.example',
    email: 'contact@delta.example',
    description: 'Delta Securities offers multi-asset access with competitive pricing and advanced order types.'
  }
];

// add more sample brokers
sampleBrokers.push(
  {
    id: 4,
    name: 'Sigma Capital',
    tagline: 'Institutional-grade execution',
    instruments: ['Stocks', 'Futures', 'Options'],
    rating: 4.7,
    fees: 'Custom pricing',
    website: 'https://sigma.example',
    email: 'sales@sigma.example',
    description: 'Sigma Capital serves high-volume traders with direct market access and smart order routing.'
  },
  {
    id: 5,
    name: 'Vertex Trade',
    tagline: 'Beginner-friendly platform',
    instruments: ['Stocks', 'ETFs'],
    rating: 4.1,
    fees: 'Free trades for equities',
    website: 'https://vertex.example',
    email: 'support@vertex.example',
    description: 'Vertex focuses on retail clients with an easy onboarding and educational resources.'
  },
  {
    id: 6,
    name: 'Nimbus Investments',
    tagline: 'Wealth management and advisory',
    instruments: ['Bonds', 'ETFs', 'Stocks'],
    rating: 4.3,
    fees: 'Advisory fees apply',
    website: 'https://nimbus.example',
    email: 'advisor@nimbus.example',
    description: 'Nimbus provides advisory services and institutional portfolios for long-term investors.'
  }
);

export const listBrokers = async () => {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 120));
  return sampleBrokers;
};
