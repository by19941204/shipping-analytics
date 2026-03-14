export const globalFleet = [
  { segment: 'container', vessels: 5600, teu: 28500000, growth: 4.2 },
  { segment: 'dryBulk', vessels: 12800, dwt: 950000000, growth: 2.8 },
  { segment: 'tanker', vessels: 8200, dwt: 620000000, growth: 1.5 },
  { segment: 'lng', vessels: 780, cbm: 120000000, growth: 8.5 },
  { segment: 'lpg', vessels: 420, cbm: 35000000, growth: 3.2 },
];

export const orderbook = [
  { year: 2025, container: 180, dryBulk: 250, tanker: 120, lng: 95 },
  { year: 2026, container: 220, dryBulk: 180, tanker: 95, lng: 110 },
  { year: 2027, container: 150, dryBulk: 120, tanker: 60, lng: 85 },
  { year: 2028, container: 80, dryBulk: 60, tanker: 30, lng: 45 },
];

export const fleetGrowth = [
  { year: 2022, netGrowth: 3.2, deliveries: 1250, demolitions: 380 },
  { year: 2023, netGrowth: 3.8, deliveries: 1420, demolitions: 350 },
  { year: 2024, netGrowth: 4.1, deliveries: 1580, demolitions: 310 },
  { year: 2025, netGrowth: 3.5, deliveries: 1380, demolitions: 420 },
  { year: 2026, netGrowth: 2.8, deliveries: 1100, demolitions: 480 },
];
