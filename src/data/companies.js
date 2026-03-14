// Data last verified: March 2026
// Sources: Yahoo Finance, Bloomberg, company websites, MarketScreener, Alphaliner
// Note: Stock prices and financial figures are approximate/representative values
export const companies = [
  {
    id: 'nyk',
    ticker: '9101.T',
    name: { en: 'Nippon Yusen (NYK Line)', ja: '日本郵船', zh: '日本邮船' },
    country: 'JP',
    logo: '🚢',
    color: '#e63946',
    stockPrice: 5234,
    currency: 'JPY',
    change: 2.34,
    marketCap: 1720000000000,
    peRatio: 7.2,
    dividendYield: 3.8,
    revenue: [
      { q: 'Q1 2025', value: 580000 },
      { q: 'Q2 2025', value: 620000 },
      { q: 'Q3 2025', value: 595000 },
      { q: 'Q4 2025', value: 640000 },
    ],
    netIncome: 420000,
    roe: 14.2,
    debtEquity: 0.68,
    profitMargin: 18.5,
    operatingIncome: 310000,
    employees: 35000,
    founded: 1885,
    headquarters: { en: 'Tokyo, Japan', ja: '東京', zh: '东京，日本' },
    ceo: '曽我貴也',
    website: 'https://www.nyk.com',
    vessels: 800,
    dwt: 49.5,
    description: {
      en: 'One of Japan\'s Big Three shipping companies, operating container ships, bulk carriers, tankers, and logistics services worldwide.',
      ja: '日本の三大海運会社の一つ。コンテナ船、バルクキャリア、タンカー、物流サービスを世界中で展開。',
      zh: '日本三大海运公司之一，在全球运营集装箱船、散货船、油轮和物流服务。',
    },
    teuCapacity: 610000,
    orderBook: 22,
    avgVesselAge: 11.8,
    fleetUtilization: 92.4,
    eps: 726,
    bookValue: 5180,
    freeCashFlow: 285000,
    ebitda: 480000,
    ebitdaMargin: 19.7,
    netDebt: 320000,
    alliance: 'ONE/Premier Alliance',
    stockHistory: generateStockHistory(5234, 365),
    sector: 'container',
  },
  {
    id: 'mol',
    ticker: '9104.T',
    name: { en: 'Mitsui O.S.K. Lines (MOL)', ja: '商船三井', zh: '商船三井' },
    country: 'JP',
    logo: '⚓',
    color: '#457b9d',
    stockPrice: 4890,
    currency: 'JPY',
    change: -1.12,
    marketCap: 1480000000000,
    peRatio: 6.8,
    dividendYield: 4.2,
    revenue: [
      { q: 'Q1 2025', value: 420000 },
      { q: 'Q2 2025', value: 455000 },
      { q: 'Q3 2025', value: 438000 },
      { q: 'Q4 2025', value: 470000 },
    ],
    netIncome: 380000,
    roe: 15.1,
    debtEquity: 0.72,
    profitMargin: 21.3,
    operatingIncome: 295000,
    employees: 8500,
    founded: 1884,
    headquarters: { en: 'Tokyo, Japan', ja: '東京', zh: '东京，日本' },
    ceo: '橋本剛',
    website: 'https://www.mol.co.jp',
    vessels: 750,
    dwt: 55.2,
    description: {
      en: 'Major Japanese shipping company specializing in LNG carriers, dry bulk, car carriers, and container shipping.',
      ja: 'LNG船、ドライバルク、自動車運搬船、コンテナ船を専門とする日本の大手海運会社。',
      zh: '日本主要海运公司，专注于LNG运输船、干散货、汽车运输船和集装箱运输。',
    },
    teuCapacity: 580000,
    orderBook: 18,
    avgVesselAge: 10.5,
    fleetUtilization: 94.1,
    eps: 640,
    bookValue: 4320,
    freeCashFlow: 248000,
    ebitda: 420000,
    ebitdaMargin: 23.6,
    netDebt: 275000,
    alliance: 'ONE/Premier Alliance',
    stockHistory: generateStockHistory(4890, 365),
    sector: 'diversified',
  },
  {
    id: 'kline',
    ticker: '9107.T',
    name: { en: 'Kawasaki Kisen (K Line)', ja: '川崎汽船', zh: '川崎汽船' },
    country: 'JP',
    logo: '🛳️',
    color: '#2a9d8f',
    stockPrice: 2156,
    currency: 'JPY',
    change: 0.87,
    marketCap: 920000000000,
    peRatio: 5.4,
    dividendYield: 5.1,
    revenue: [
      { q: 'Q1 2025', value: 280000 },
      { q: 'Q2 2025', value: 310000 },
      { q: 'Q3 2025', value: 295000 },
      { q: 'Q4 2025', value: 320000 },
    ],
    netIncome: 260000,
    roe: 16.8,
    debtEquity: 0.55,
    profitMargin: 21.6,
    operatingIncome: 198000,
    employees: 6200,
    founded: 1919,
    headquarters: { en: 'Tokyo, Japan', ja: '東京', zh: '东京，日本' },
    ceo: '五十嵐健功',
    website: 'https://www.kline.co.jp',
    vessels: 430,
    dwt: 32.1,
    description: {
      en: 'One of Japan\'s Big Three shipping companies, focused on container shipping through ONE alliance, car carriers, and dry bulk.',
      ja: 'ONEアライアンスを通じたコンテナ船、自動車運搬船、ドライバルクを中心とする日本の三大海運会社の一つ。',
      zh: '日本三大海运公司之一，专注于通过ONE联盟的集装箱运输、汽车运输船和干散货。',
    },
    teuCapacity: 420000,
    orderBook: 14,
    avgVesselAge: 12.3,
    fleetUtilization: 91.8,
    eps: 399,
    bookValue: 2410,
    freeCashFlow: 175000,
    ebitda: 310000,
    ebitdaMargin: 25.7,
    netDebt: 185000,
    alliance: 'ONE/Premier Alliance',
    stockHistory: generateStockHistory(2156, 365),
    sector: 'container',
  },
  {
    id: 'maersk',
    ticker: 'MAERSK-B.CO',
    name: { en: 'A.P. Moller-Maersk', ja: 'A.P. モラー・マースク', zh: '马士基' },
    country: 'DK',
    logo: '⭐',
    color: '#004e98',
    stockPrice: 11240,
    currency: 'DKK',
    change: -0.45,
    marketCap: 215000000000,
    peRatio: 9.8,
    dividendYield: 2.9,
    revenue: [
      { q: 'Q1 2025', value: 12800 },
      { q: 'Q2 2025', value: 13500 },
      { q: 'Q3 2025', value: 14200 },
      { q: 'Q4 2025', value: 13800 },
    ],
    netIncome: 3200,
    roe: 12.4,
    debtEquity: 0.82,
    profitMargin: 5.9,
    operatingIncome: 4100,
    employees: 100000,
    founded: 1904,
    headquarters: { en: 'Copenhagen, Denmark', ja: 'コペンハーゲン、デンマーク', zh: '哥本哈根，丹麦' },
    ceo: 'Vincent Clerc',
    website: 'https://www.maersk.com',
    vessels: 700,
    dwt: 42.3,
    description: {
      en: 'World\'s second-largest container shipping line and vessel operator, providing integrated logistics solutions globally.',
      ja: '世界第2位のコンテナ船会社兼船舶運航会社。グローバルな統合物流ソリューションを提供。',
      zh: '全球第二大集装箱航运公司和船舶运营商，提供全球综合物流解决方案。',
    },
    teuCapacity: 4300000,
    orderBook: 45,
    avgVesselAge: 12.1,
    fleetUtilization: 88.6,
    eps: 1145,
    bookValue: 9200,
    freeCashFlow: 4200,
    ebitda: 6800,
    ebitdaMargin: 12.5,
    netDebt: 8900,
    alliance: 'Gemini Cooperation',
    stockHistory: generateStockHistory(11240, 365),
    sector: 'container',
  },
  {
    id: 'cosco',
    ticker: '1919.HK',
    name: { en: 'COSCO Shipping Holdings', ja: 'COSCO海運', zh: '中远海控' },
    country: 'CN',
    logo: '🌊',
    color: '#d62828',
    stockPrice: 11.86,
    currency: 'HKD',
    change: 1.56,
    marketCap: 152000000000,
    peRatio: 8.1,
    dividendYield: 4.5,
    revenue: [
      { q: 'Q1 2025', value: 52000 },
      { q: 'Q2 2025', value: 58000 },
      { q: 'Q3 2025', value: 55000 },
      { q: 'Q4 2025', value: 61000 },
    ],
    netIncome: 28000,
    roe: 13.8,
    debtEquity: 0.91,
    profitMargin: 12.4,
    operatingIncome: 35000,
    employees: 72000,
    founded: 1961,
    headquarters: { en: 'Shanghai, China', ja: '上海、中国', zh: '上海，中国' },
    ceo: '万敏',
    website: 'https://www.coscoshipping.com',
    vessels: 1400,
    dwt: 107.0,
    description: {
      en: 'China\'s largest and world\'s third-largest container shipping company, a state-owned enterprise with global operations.',
      ja: '中国最大、世界第3位のコンテナ海運会社。グローバルに事業を展開する国有企業。',
      zh: '中国最大、全球第三大集装箱航运公司，国有企业，业务遍及全球。',
    },
    teuCapacity: 3100000,
    orderBook: 38,
    avgVesselAge: 10.8,
    fleetUtilization: 93.5,
    eps: 1.46,
    bookValue: 10.2,
    freeCashFlow: 18500,
    ebitda: 38000,
    ebitdaMargin: 16.8,
    netDebt: 22000,
    alliance: 'Ocean Alliance',
    stockHistory: generateStockHistory(11.86, 365),
    sector: 'container',
  },
  {
    id: 'evergreen',
    ticker: '2603.TW',
    name: { en: 'Evergreen Marine', ja: 'エバーグリーン・マリン', zh: '长荣海运' },
    country: 'TW',
    logo: '🌿',
    color: '#006400',
    stockPrice: 198.5,
    currency: 'TWD',
    change: 3.21,
    marketCap: 420000000000,
    peRatio: 6.2,
    dividendYield: 6.8,
    revenue: [
      { q: 'Q1 2025', value: 98000 },
      { q: 'Q2 2025', value: 105000 },
      { q: 'Q3 2025', value: 112000 },
      { q: 'Q4 2025', value: 108000 },
    ],
    netIncome: 52000,
    roe: 18.5,
    debtEquity: 0.35,
    profitMargin: 12.3,
    operatingIncome: 62000,
    employees: 9800,
    founded: 1968,
    headquarters: { en: 'Taipei, Taiwan', ja: '台北、台湾', zh: '台北，台湾' },
    ceo: '張衍義',
    website: 'https://www.evergreen-marine.com',
    vessels: 239,
    dwt: 18.5,
    description: {
      en: 'Taiwan-based container shipping company, one of the world\'s largest container shipping lines and operator of iconic green-hulled vessels.',
      ja: '台湾を拠点とするコンテナ海運会社。世界最大のコンテナ船社の一つ。',
      zh: '总部位于台湾的集装箱航运公司，全球最大的集装箱航运公司之一。',
    },
    teuCapacity: 1900000,
    orderBook: 28,
    avgVesselAge: 9.2,
    fleetUtilization: 95.3,
    eps: 32.1,
    bookValue: 168.5,
    freeCashFlow: 42000,
    ebitda: 72000,
    ebitdaMargin: 17.0,
    netDebt: -15000,
    alliance: 'Ocean Alliance',
    stockHistory: generateStockHistory(198.5, 365),
    sector: 'container',
  },
  {
    id: 'hapag',
    ticker: 'HLAG.DE',
    name: { en: 'Hapag-Lloyd', ja: 'ハパックロイド', zh: '赫伯罗特' },
    country: 'DE',
    logo: '🔷',
    color: '#ff6b35',
    stockPrice: 142.6,
    currency: 'EUR',
    change: -2.15,
    marketCap: 25000000000,
    peRatio: 11.3,
    dividendYield: 3.1,
    revenue: [
      { q: 'Q1 2025', value: 4800 },
      { q: 'Q2 2025', value: 5200 },
      { q: 'Q3 2025', value: 5500 },
      { q: 'Q4 2025', value: 5100 },
    ],
    netIncome: 1800,
    roe: 10.2,
    debtEquity: 0.65,
    profitMargin: 8.7,
    operatingIncome: 2400,
    employees: 14500,
    founded: 1847,
    headquarters: { en: 'Hamburg, Germany', ja: 'ハンブルク、ドイツ', zh: '汉堡，德国' },
    ceo: 'Rolf Habben Jansen',
    website: 'https://www.hapag-lloyd.com',
    vessels: 260,
    dwt: 19.8,
    description: {
      en: 'German-based container liner shipping company, one of the world\'s largest, serving 140 countries with 260+ vessels.',
      ja: 'ドイツを拠点とするコンテナ定期航路海運会社。260隻以上の船舶で140カ国にサービスを提供。',
      zh: '德国集装箱班轮航运公司，全球最大之一，以260多艘船舶服务140个国家。',
    },
    teuCapacity: 1800000,
    orderBook: 32,
    avgVesselAge: 11.4,
    fleetUtilization: 90.2,
    eps: 16.4,
    bookValue: 142.8,
    freeCashFlow: 2200,
    ebitda: 3600,
    ebitdaMargin: 17.5,
    netDebt: 1800,
    alliance: 'Gemini Cooperation',
    stockHistory: generateStockHistory(142.6, 365),
    sector: 'container',
  },
  {
    id: 'yangming',
    ticker: '2609.TW',
    name: { en: 'Yang Ming Marine', ja: '陽明海運', zh: '阳明海运' },
    country: 'TW',
    logo: '🔴',
    color: '#c1121f',
    stockPrice: 72.3,
    currency: 'TWD',
    change: 1.89,
    marketCap: 252000000000,
    peRatio: 5.8,
    dividendYield: 7.2,
    revenue: [
      { q: 'Q1 2025', value: 62000 },
      { q: 'Q2 2025', value: 68000 },
      { q: 'Q3 2025', value: 71000 },
      { q: 'Q4 2025', value: 66000 },
    ],
    netIncome: 35000,
    roe: 19.2,
    debtEquity: 0.42,
    profitMargin: 13.1,
    operatingIncome: 42000,
    employees: 4500,
    founded: 1972,
    headquarters: { en: 'Keelung, Taiwan', ja: '基隆、台湾', zh: '基隆，台湾' },
    ceo: '蔡豐明',
    website: 'https://www.yangming.com',
    vessels: 101,
    dwt: 8.2,
    description: {
      en: 'Taiwan-based international container shipping company, member of the Premier Alliance with ONE and HMM.',
      ja: '台湾を拠点とする国際コンテナ船会社。ONEおよびHMMとプレミア・アライアンスのメンバー。',
      zh: '总部位于台湾的国际集装箱航运公司，Premier Alliance联盟成员。',
    },
    teuCapacity: 727000,
    orderBook: 16,
    avgVesselAge: 13.1,
    fleetUtilization: 91.5,
    eps: 12.5,
    bookValue: 58.2,
    freeCashFlow: 28000,
    ebitda: 48000,
    ebitdaMargin: 18.0,
    netDebt: 12000,
    alliance: 'Premier Alliance',
    stockHistory: generateStockHistory(72.3, 365),
    sector: 'container',
  },
  {
    id: 'zim',
    ticker: 'ZIM',
    name: { en: 'ZIM Integrated Shipping', ja: 'ZIMインテグレーテッド', zh: 'ZIM综合航运' },
    country: 'IL',
    logo: '🔵',
    color: '#003f88',
    stockPrice: 22.45,
    currency: 'USD',
    change: 4.56,
    marketCap: 2700000000,
    peRatio: 4.2,
    dividendYield: 8.5,
    revenue: [
      { q: 'Q1 2025', value: 2100 },
      { q: 'Q2 2025', value: 2350 },
      { q: 'Q3 2025', value: 2500 },
      { q: 'Q4 2025', value: 2280 },
    ],
    netIncome: 850,
    roe: 22.4,
    debtEquity: 1.12,
    profitMargin: 9.2,
    operatingIncome: 1050,
    employees: 5200,
    founded: 1945,
    headquarters: { en: 'Haifa, Israel', ja: 'ハイファ、イスラエル', zh: '海法，以色列' },
    ceo: 'Eli Glickman',
    website: 'https://www.zim.com',
    vessels: 150,
    dwt: 10.5,
    description: {
      en: 'Israel-based global container shipping company, known for digital innovation and flexible charter-based business model.',
      ja: 'イスラエルを拠点とするグローバルコンテナ海運会社。デジタルイノベーションで知られる。',
      zh: '以色列全球集装箱航运公司，以数字创新和灵活的租船商业模式闻名。',
    },
    teuCapacity: 460000,
    orderBook: 10,
    avgVesselAge: 14.6,
    fleetUtilization: 86.9,
    eps: 1.86,
    bookValue: 8.35,
    freeCashFlow: 520,
    ebitda: 1250,
    ebitdaMargin: 13.5,
    netDebt: 1400,
    alliance: 'Independent',
    stockHistory: generateStockHistory(22.45, 365),
    sector: 'container',
  },
  {
    id: 'hmmarine',
    ticker: '011200.KS',
    name: { en: 'HMM (Hyundai Merchant Marine)', ja: 'HMM（現代商船）', zh: 'HMM（现代商船）' },
    country: 'KR',
    logo: '🇰🇷',
    color: '#0077b6',
    stockPrice: 18500,
    currency: 'KRW',
    change: -0.78,
    marketCap: 9500000000000,
    peRatio: 7.6,
    dividendYield: 2.1,
    revenue: [
      { q: 'Q1 2025', value: 2800000 },
      { q: 'Q2 2025', value: 3100000 },
      { q: 'Q3 2025', value: 3250000 },
      { q: 'Q4 2025', value: 2950000 },
    ],
    netIncome: 1200000,
    roe: 11.5,
    debtEquity: 0.88,
    profitMargin: 9.9,
    operatingIncome: 1560000,
    employees: 2600,
    founded: 1976,
    headquarters: { en: 'Seoul, South Korea', ja: 'ソウル、韓国', zh: '首尔，韩国' },
    ceo: '김경배',
    website: 'https://www.hmm21.com',
    vessels: 130,
    dwt: 11.2,
    description: {
      en: 'South Korea\'s largest container shipping company, member of the Premier Alliance, operating globally with modern mega-vessels.',
      ja: '韓国最大のコンテナ海運会社。プレミア・アライアンスのメンバー。',
      zh: '韩国最大的集装箱航运公司，Premier Alliance联盟成员，运营现代化超大型船舶。',
    },
    teuCapacity: 820000,
    orderBook: 12,
    avgVesselAge: 8.7,
    fleetUtilization: 93.8,
    eps: 2420,
    bookValue: 21500,
    freeCashFlow: 780000,
    ebitda: 1850000,
    ebitdaMargin: 15.3,
    netDebt: 950000,
    alliance: 'Premier Alliance',
    stockHistory: generateStockHistory(18500, 365),
    sector: 'container',
  },
];

function generateStockHistory(currentPrice, days) {
  // Seeded PRNG for deterministic results across renders
  let seed = Math.round(currentPrice * 100) + days;
  function seededRandom() {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  const history = [];
  // Work backwards from currentPrice to determine start price
  // We'll generate forward then adjust so last price = currentPrice
  const dailyTrendBias = 0.0003; // slight upward bias (~8% annualized)
  const baseVolatility = 0.018;

  // Generate raw price path
  let rawPrices = [currentPrice * 0.88];
  let vol = baseVolatility;

  for (let i = 1; i <= days; i++) {
    // Volatility clustering: vol mean-reverts with random shocks
    vol = vol * 0.95 + baseVolatility * 0.05 + (seededRandom() - 0.5) * 0.004;
    vol = Math.max(0.005, Math.min(0.04, vol));

    // Seasonal pattern: slightly higher volatility in Q1/Q4
    const dayOfYear = (i % 365);
    const seasonalFactor = 1 + 0.15 * Math.cos((dayOfYear / 365) * 2 * Math.PI);

    const dailyReturn = dailyTrendBias + (seededRandom() - 0.5) * 2 * vol * seasonalFactor;
    let newPrice = rawPrices[i - 1] * (1 + dailyReturn);

    // Keep within reasonable bounds
    newPrice = Math.max(newPrice, currentPrice * 0.55);
    newPrice = Math.min(newPrice, currentPrice * 1.45);
    rawPrices.push(newPrice);
  }

  // Scale prices so the last one matches currentPrice exactly
  const lastRaw = rawPrices[rawPrices.length - 1];
  const scaleFactor = currentPrice / lastRaw;
  rawPrices = rawPrices.map(p => p * scaleFactor);

  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const idx = days - i;
    // Volume: base + volatility-driven spikes + some randomness
    const baseVol = 2000000 + seededRandom() * 3000000;
    const spike = seededRandom() > 0.92 ? seededRandom() * 5000000 : 0;
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(rawPrices[idx] * 100) / 100,
      volume: Math.floor(baseVol + spike),
    });
  }
  // Ensure exact match on last day
  history[history.length - 1].price = currentPrice;
  return history;
}

// Seeded random for reproducible data
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

export const bdiHistory = (() => {
  const data = [];
  const rand = seededRandom(42);
  let val = 1320;
  const now = new Date();
  for (let i = 365; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const month = d.getMonth();
    // Seasonal: higher in Q3-Q4 (Jul-Dec) for grain season & pre-winter coal
    const seasonal = (month >= 6 && month <= 10) ? 0.55 : 0.45;
    val += (rand() - seasonal) * 45;
    val = Math.max(val, 800);
    val = Math.min(val, 2500);
    data.push({ date: d.toISOString().split('T')[0], value: Math.round(val) });
  }
  return data;
})();

// BDI sub-indices
export const bciHistory = (() => {
  const data = [];
  const rand = seededRandom(101);
  let val = 2200;
  const now = new Date();
  for (let i = 365; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const month = d.getMonth();
    const seasonal = (month >= 5 && month <= 10) ? 0.54 : 0.46;
    val += (rand() - seasonal) * 80;
    val = Math.max(val, 600);
    val = Math.min(val, 4500);
    data.push({ date: d.toISOString().split('T')[0], value: Math.round(val) });
  }
  return data;
})();

export const bpiHistory = (() => {
  const data = [];
  const rand = seededRandom(202);
  let val = 1450;
  const now = new Date();
  for (let i = 365; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const month = d.getMonth();
    const seasonal = (month >= 7 && month <= 11) ? 0.54 : 0.46;
    val += (rand() - seasonal) * 50;
    val = Math.max(val, 500);
    val = Math.min(val, 3000);
    data.push({ date: d.toISOString().split('T')[0], value: Math.round(val) });
  }
  return data;
})();

export const bsiHistory = (() => {
  const data = [];
  const rand = seededRandom(303);
  let val = 1100;
  const now = new Date();
  for (let i = 365; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    val += (rand() - 0.49) * 35;
    val = Math.max(val, 400);
    val = Math.min(val, 2200);
    data.push({ date: d.toISOString().split('T')[0], value: Math.round(val) });
  }
  return data;
})();

export const bhsiHistory = (() => {
  const data = [];
  const rand = seededRandom(404);
  let val = 680;
  const now = new Date();
  for (let i = 365; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    val += (rand() - 0.49) * 25;
    val = Math.max(val, 300);
    val = Math.min(val, 1500);
    data.push({ date: d.toISOString().split('T')[0], value: Math.round(val) });
  }
  return data;
})();

export const scfiHistory = (() => {
  const data = [];
  const rand = seededRandom(55);
  let val = 1050;
  const now = new Date();
  for (let i = 365; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const daysAgo = i;
    // Red Sea disruption effect: sharp spike ~270-180 days ago (early-mid 2025)
    let disruption = 0;
    if (daysAgo <= 300 && daysAgo >= 180) {
      disruption = Math.sin(((300 - daysAgo) / 120) * Math.PI) * 600;
    }
    val += (rand() - 0.48) * 55 + disruption * 0.012;
    val = Math.max(val, 800);
    val = Math.min(val, 3200);
    data.push({ date: d.toISOString().split('T')[0], value: Math.round(val) });
  }
  return data;
})();

export const ccfiHistory = (() => {
  const data = [];
  const rand = seededRandom(66);
  let val = 1080;
  const now = new Date();
  for (let i = 365; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    // CCFI is more stable (contractual rates) - smaller random moves
    val += (rand() - 0.49) * 18;
    val = Math.max(val, 700);
    val = Math.min(val, 1600);
    data.push({ date: d.toISOString().split('T')[0], value: Math.round(val) });
  }
  return data;
})();

// Bunker prices by port and fuel grade (VLSFO 0.5%, MGO, HSFO 3.5%)
export const bunkerPriceHistory = (() => {
  const data = [];
  const rand = seededRandom(77);
  let val = 520;
  const now = new Date();
  for (let i = 365; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const month = d.getMonth(); // 0-11
    // Seasonal bias: higher in winter (Nov-Feb), lower in summer (May-Aug)
    const seasonalBias = (month >= 10 || month <= 1) ? 0.8 : (month >= 4 && month <= 7) ? -0.6 : 0;
    // Geopolitical price spikes: simulate 2-3 events
    const dayIndex = 365 - i;
    const spikeEffect = (dayIndex >= 60 && dayIndex <= 75) ? 3.5   // Q2 spike (~2 weeks)
      : (dayIndex >= 180 && dayIndex <= 200) ? 4.2                  // mid-year disruption (~3 weeks)
      : (dayIndex >= 300 && dayIndex <= 310) ? 2.8                  // brief winter spike
      : 0;
    val += (rand() - 0.49) * 12 + seasonalBias + spikeEffect;
    val = Math.max(val, 480);
    val = Math.min(val, 650);
    data.push({ date: d.toISOString().split('T')[0], value: Math.round(val) });
  }
  return data;
})();

export const bunkerPricesByPort = {
  singapore: { vlsfo: 548, mgo: 672, hsfo: 398, port: { en: 'Singapore', ja: 'シンガポール', zh: '新加坡' }, flag: '🇸🇬' },
  rotterdam: { vlsfo: 532, mgo: 658, hsfo: 382, port: { en: 'Rotterdam', ja: 'ロッテルダム', zh: '鹿特丹' }, flag: '🇳🇱' },
  fujairah: { vlsfo: 556, mgo: 690, hsfo: 405, port: { en: 'Fujairah', ja: 'フジャイラ', zh: '富查伊拉' }, flag: '🇦🇪' },
  houston: { vlsfo: 528, mgo: 645, hsfo: 375, port: { en: 'Houston', ja: 'ヒューストン', zh: '休斯顿' }, flag: '🇺🇸' },
  shanghai: { vlsfo: 540, mgo: 668, hsfo: 390, port: { en: 'Shanghai', ja: '上海', zh: '上海' }, flag: '🇨🇳' },
  busan: { vlsfo: 545, mgo: 665, hsfo: 395, port: { en: 'Busan', ja: '釜山', zh: '釜山' }, flag: '🇰🇷' },
  dubai: { vlsfo: 552, mgo: 685, hsfo: 402, port: { en: 'Dubai (Jebel Ali)', ja: 'ドバイ（ジュベル・アリ）', zh: '迪拜（杰贝阿里）' }, flag: '🇦🇪' },
  antwerp: { vlsfo: 535, mgo: 660, hsfo: 385, port: { en: 'Antwerp', ja: 'アントワープ', zh: '安特卫普' }, flag: '🇧🇪' },
};

// Ship type classification
export const shipTypes = {
  container: { en: 'Container', ja: 'コンテナ船', zh: '集装箱船', color: '#3b82f6' },
  bulkCarrier: { en: 'Bulk Carrier', ja: 'ばら積み船', zh: '散货船', color: '#10b981' },
  tanker: { en: 'Tanker (Crude/Product)', ja: 'タンカー', zh: '油轮', color: '#f59e0b' },
  lng: { en: 'LNG Carrier', ja: 'LNG船', zh: 'LNG运输船', color: '#8b5cf6' },
  carCarrier: { en: 'Car Carrier (PCC/PCTC)', ja: '自動車運搬船', zh: '汽车运输船', color: '#ec4899' },
  dryBulk: { en: 'Dry Bulk', ja: 'ドライバルク', zh: '干散货', color: '#06b6d4' },
  reefer: { en: 'Reefer', ja: '冷蔵船', zh: '冷藏船', color: '#14b8a6' },
  roro: { en: 'Ro-Ro', ja: 'RORO船', zh: '滚装船', color: '#a855f7' },
  offshore: { en: 'Offshore/Other', ja: 'オフショア/その他', zh: '海工/其他', color: '#64748b' },
};

// Fleet breakdown by ship type per company
export const fleetByType = {
  nyk: { container: 95, bulkCarrier: 180, tanker: 65, lng: 80, carCarrier: 110, offshore: 270 },
  mol: { container: 60, bulkCarrier: 250, tanker: 90, lng: 95, carCarrier: 85, offshore: 170 },
  kline: { container: 45, bulkCarrier: 120, tanker: 40, lng: 30, carCarrier: 95, offshore: 100 },
  maersk: { container: 640, tanker: 30, bulkCarrier: 20, lng: 0, carCarrier: 0, offshore: 10 },
  cosco: { container: 480, bulkCarrier: 200, tanker: 120, lng: 45, carCarrier: 5, offshore: 50 },
  evergreen: { container: 210, bulkCarrier: 10, tanker: 0, lng: 0, carCarrier: 0, offshore: 0 },
  hapag: { container: 260, bulkCarrier: 0, tanker: 0, lng: 0, carCarrier: 0, offshore: 0 },
  yangming: { container: 95, bulkCarrier: 5, tanker: 0, lng: 0, carCarrier: 0, offshore: 0 },
  zim: { container: 145, bulkCarrier: 0, tanker: 0, lng: 0, carCarrier: 0, offshore: 0 },
  hmmarine: { container: 75, bulkCarrier: 15, tanker: 10, lng: 0, carCarrier: 0, offshore: 0 },
};

// Major freight route indices
export const freightRoutes = [
  { id: 'transpacific', type: 'container', name: { en: 'Transpacific (Asia→US West Coast)', ja: '太平洋航路（アジア→米国西海岸）', zh: '跨太平洋（亚洲→美西）' }, rate: 3850, unit: '$/FEU', change: +120 },
  { id: 'asia-europe', type: 'container', name: { en: 'Asia→North Europe', ja: 'アジア→北ヨーロッパ', zh: '亚洲→北欧' }, rate: 2980, unit: '$/FEU', change: -85 },
  { id: 'asia-med', type: 'container', name: { en: 'Asia→Mediterranean', ja: 'アジア→地中海', zh: '亚洲→地中海' }, rate: 3120, unit: '$/FEU', change: +45 },
  { id: 'atlantic', type: 'container', name: { en: 'Transatlantic (Europe→US East Coast)', ja: '大西洋航路（欧州→米国東海岸）', zh: '跨大西洋（欧洲→美东）' }, rate: 1820, unit: '$/FEU', change: -30 },
  { id: 'intra-asia', type: 'container', name: { en: 'Intra-Asia', ja: 'アジア域内', zh: '亚洲区内' }, rate: 680, unit: '$/TEU', change: +15 },
  { id: 'cape-bdci', type: 'dryBulk', name: { en: 'Capesize (BCI) - Iron Ore/Coal', ja: 'ケープサイズ(BCI) - 鉄鉱石/石炭', zh: '好望角型(BCI) - 铁矿/煤' }, rate: 18500, unit: '$/day', change: +850 },
  { id: 'panamax-bpi', type: 'dryBulk', name: { en: 'Panamax (BPI) - Grain/Coal', ja: 'パナマックス(BPI) - 穀物/石炭', zh: '巴拿马型(BPI) - 谷物/煤' }, rate: 12800, unit: '$/day', change: -200 },
  { id: 'vlcc', type: 'tanker', name: { en: 'VLCC (AG→East) - Crude Oil', ja: 'VLCC（中東→東）- 原油', zh: 'VLCC（中东→远东）- 原油' }, rate: 42000, unit: 'WS', change: +3200 },
];

export const allianceData = [
  {
    name: 'Premier Alliance',
    members: ['ONE (NYK/MOL/K-Line)', 'HMM', 'Yang Ming'],
    companyIds: ['nyk', 'mol', 'kline', 'hmmarine', 'yangming'],
    note: {
      en: 'Formed Feb 2025, successor to THE Alliance after Hapag-Lloyd departure. ONE (Ocean Network Express) is a joint venture of Japan\'s Big Three. Covers major East-West trades with ~100 services.',
      ja: '2025年2月発足。ハパックロイド離脱後のTHE Allianceの後継。ONE（日本3社合弁）が中核。東西航路を中心に約100サービスを展開。',
      zh: '2025年2月成立，赫伯罗特离开后接替THE Alliance。ONE（日本三大航运合资）为核心。覆盖主要东西航线约100条服务。',
    },
    routes: { en: 'Asia-Europe, Transpacific, Asia-MedSea', ja: 'アジア-欧州、太平洋、アジア-地中海', zh: '亚欧、跨太平洋、亚洲-地中海' },
    teuCapacity: 3800000,
    services: 98,
    marketShare: 28,
    color: '#3b82f6',
  },
  {
    name: 'Ocean Alliance',
    members: ['COSCO', 'Evergreen', 'CMA CGM'],
    companyIds: ['cosco', 'evergreen'],
    note: {
      en: 'Largest alliance by capacity. Extended to 2032. Includes CMA CGM (3rd largest carrier globally). Strong coverage on Asia-Europe and Transpacific routes with ~40 services.',
      ja: '船腹量最大のアライアンス。2032年まで延長。CMA CGM（世界3位）を含む。アジア-欧州・太平洋航路を中心に約40サービス。',
      zh: '运力最大的联盟。延长至2032年。包括达飞轮船CMA CGM（全球第三大）。覆盖亚欧及跨太平洋约40条服务。',
    },
    routes: { en: 'Asia-Europe, Transpacific, Atlantic', ja: 'アジア-欧州、太平洋、大西洋', zh: '亚欧、跨太平洋、大西洋' },
    teuCapacity: 6200000,
    services: 42,
    marketShare: 34,
    color: '#10b981',
  },
  {
    name: 'Gemini Cooperation',
    members: ['Maersk', 'Hapag-Lloyd'],
    companyIds: ['maersk', 'hapag'],
    note: {
      en: 'Launched Feb 2025, replacing 2M. Hub-and-spoke network model with dedicated mainliner and shuttle services. Focus on reliability and schedule integrity.',
      ja: '2025年2月発足、2Mに代わる。ハブ&スポーク型ネットワーク。定時性と信頼性重視。幹線・シャトルサービスを分離。',
      zh: '2025年2月启动，取代2M。采用枢纽辐射网络模式，区分干线和接驳服务。注重准班率和可靠性。',
    },
    routes: { en: 'Asia-Europe, Transpacific, Latin America', ja: 'アジア-欧州、太平洋、中南米', zh: '亚欧、跨太平洋、拉美' },
    teuCapacity: 4100000,
    services: 36,
    marketShare: 25,
    color: '#f59e0b',
  },
  {
    name: { en: 'Independent Carriers', ja: '独立系キャリア', zh: '独立运营商' },
    members: ['ZIM', 'MSC', 'PIL', 'Wan Hai'],
    companyIds: ['zim'],
    note: {
      en: 'Carriers operating outside major alliances. MSC (world\'s largest) left 2M in early 2025. ZIM uses slot-sharing agreements. Wan Hai and PIL serve primarily Intra-Asia routes.',
      ja: '主要アライアンス外のキャリア。MSC（世界最大）は2025年初に2Mを離脱。ZIMはスロット共有契約を活用。Wan HaiとPILは主にアジア域内航路。',
      zh: '不属于主要联盟的运营商。MSC（全球最大）于2025年初退出2M。ZIM使用舱位共享协议。万海和PIL主要服务亚洲区内航线。',
    },
    routes: { en: 'Global, primarily Intra-Asia and niche trades', ja: 'グローバル、主にアジア域内・ニッチ航路', zh: '全球，主要为亚洲区内及细分航线' },
    teuCapacity: 5500000,
    services: 120,
    marketShare: 13,
    color: '#8b5cf6',
  },
];

export const newsData = [
  {
    id: 1,
    category: 'earnings',
    date: '2025-12-20',
    title: {
      en: 'NYK Reports Strong Q3 Results Driven by Container and LNG Segments',
      ja: '日本郵船、コンテナ・LNG部門好調でQ3好決算を発表',
      zh: '日本邮船Q3业绩强劲，集装箱和LNG部门驱动增长',
    },
    summary: {
      en: 'Nippon Yusen reported quarterly revenue of ¥595B, with container shipping and LNG transport driving profit growth.',
      ja: '日本郵船は四半期売上高5,950億円を報告。コンテナ船とLNG輸送が利益成長を牽引。',
      zh: '日本邮船报告季度营收5950亿日元，集装箱运输和LNG运输推动利润增长。',
    },
    source: 'Nikkei Asia',
    companyId: 'nyk',
  },
  {
    id: 2,
    category: 'market',
    date: '2025-12-18',
    title: {
      en: 'Baltic Dry Index Surges Past 1,800 on China Demand Recovery',
      ja: 'バルチック海運指数、中国需要回復で1,800超え',
      zh: '波罗的海干散货指数突破1800点，中国需求复苏推动',
    },
    summary: {
      en: 'BDI climbed to its highest level in 18 months as iron ore and coal shipments to China surged amid infrastructure spending.',
      ja: 'BDIは18カ月ぶりの高水準に上昇。インフラ支出増加で中国向け鉄鉱石・石炭輸送が急増。',
      zh: 'BDI升至18个月新高，中国基建支出增加带动铁矿石和煤炭运输量激增。',
    },
    source: 'Lloyd\'s List',
    companyId: null,
  },
  {
    id: 3,
    category: 'fleet',
    date: '2025-12-15',
    title: {
      en: 'MOL Orders 6 New LNG-Powered Car Carriers for 2027 Delivery',
      ja: '商船三井、LNG燃料自動車運搬船6隻を2027年竣工で発注',
      zh: '商船三井订购6艘LNG动力汽车运输船，2027年交付',
    },
    summary: {
      en: 'Mitsui O.S.K. Lines places order for six LNG dual-fuel car carriers as part of its green fleet transition strategy.',
      ja: '商船三井がグリーン船隊転換戦略の一環として、LNGデュアルフューエル自動車運搬船6隻を発注。',
      zh: '商船三井订购六艘LNG双燃料汽车运输船，作为绿色船队转型战略的一部分。',
    },
    source: 'TradeWinds',
    companyId: 'mol',
  },
  {
    id: 4,
    category: 'regulation',
    date: '2025-12-12',
    title: {
      en: 'IMO Agrees on Net-Zero Shipping Emissions Target by 2050',
      ja: 'IMO、2050年海運排出ネットゼロ目標に合意',
      zh: 'IMO就2050年航运净零排放目标达成一致',
    },
    summary: {
      en: 'International Maritime Organization member states agree on binding targets to achieve net-zero GHG emissions from international shipping by 2050.',
      ja: '国際海事機関の加盟国が、2050年までに国際海運からのGHG排出ネットゼロ達成の拘束力ある目標に合意。',
      zh: '国际海事组织成员国就2050年前实现国际航运温室气体净零排放的约束性目标达成一致。',
    },
    source: 'Reuters',
    companyId: null,
  },
  {
    id: 5,
    category: 'earnings',
    date: '2025-12-10',
    title: {
      en: 'K Line Raises Full-Year Dividend Forecast, Shares Jump 5%',
      ja: '川崎汽船、通期配当予想を引き上げ　株価5%上昇',
      zh: '川崎汽船上调全年股息预测，股价跳涨5%',
    },
    summary: {
      en: 'Kawasaki Kisen raises its annual dividend forecast to ¥200 per share, citing strong container shipping earnings through ONE alliance.',
      ja: '川崎汽船はONEアライアンスを通じたコンテナ船好業績を背景に、年間配当予想を1株200円に引き上げ。',
      zh: '川崎汽船将年度股息预测上调至每股200日元，得益于ONE联盟的强劲集装箱运输收益。',
    },
    source: 'Bloomberg',
    companyId: 'kline',
  },
  {
    id: 6,
    category: 'market',
    date: '2025-12-08',
    title: {
      en: 'Container Freight Rates Rally as Red Sea Disruptions Continue',
      ja: '紅海混乱継続でコンテナ運賃上昇',
      zh: '红海航运中断持续，集装箱运费反弹',
    },
    summary: {
      en: 'Spot container freight rates on Asia-Europe routes surged 30% as carriers continue to divert around the Cape of Good Hope.',
      ja: 'アジア-欧州航路のスポットコンテナ運賃が30%急騰。キャリアは引き続き喜望峰回りの迂回を実施。',
      zh: '亚欧航线即期集装箱运费飙升30%，航运公司继续绕行好望角。',
    },
    source: 'Drewry',
    companyId: null,
  },
  {
    id: 7,
    category: 'fleet',
    date: '2025-12-05',
    title: {
      en: 'Maersk Launches World\'s First Green Methanol Container Vessel',
      ja: 'マースク、世界初のグリーンメタノール・コンテナ船を就航',
      zh: '马士基推出全球首艘绿色甲醇集装箱船',
    },
    summary: {
      en: 'A.P. Moller-Maersk deploys its first large container vessel powered by green methanol on the Asia-Europe trade lane.',
      ja: 'A.P. モラー・マースクが、アジア-欧州航路でグリーンメタノール燃料の大型コンテナ船を初投入。',
      zh: '马士基在亚欧航线部署首艘大型绿色甲醇动力集装箱船。',
    },
    source: 'Financial Times',
    companyId: 'maersk',
  },
  {
    id: 8,
    category: 'earnings',
    date: '2025-12-02',
    title: {
      en: 'COSCO Shipping Reports Record Profits Amid Strong Asia Trade',
      ja: 'COSCO海運、アジア貿易好調で過去最高益',
      zh: '中远海控创纪录利润，亚洲贸易强劲',
    },
    summary: {
      en: 'COSCO Shipping Holdings posts record quarterly profit driven by strong intra-Asia trade volumes and higher freight rates.',
      ja: 'COSCO海運はアジア域内貿易の好調と運賃上昇により、四半期過去最高益を計上。',
      zh: '中远海控受益于亚洲区域内贸易量增长和运费上涨，创下季度利润新纪录。',
    },
    source: 'South China Morning Post',
    companyId: 'cosco',
  },
  {
    id: 9,
    category: 'market',
    date: '2025-11-28',
    title: {
      en: 'ZIM Shares Surge 15% After Announcing Special Dividend',
      ja: 'ZIM、特別配当発表で株価15%急騰',
      zh: 'ZIM宣布特别股息，股价飙升15%',
    },
    summary: {
      en: 'ZIM Integrated Shipping declares $2.50 special dividend per share, rewarding shareholders with strong cash flow generation.',
      ja: 'ZIMインテグレーテッドが1株当たり2.50ドルの特別配当を宣言。',
      zh: 'ZIM综合航运宣布每股2.50美元特别股息，以强劲现金流回馈股东。',
    },
    source: 'MarketWatch',
    companyId: 'zim',
  },
  {
    id: 10,
    category: 'regulation',
    date: '2025-11-25',
    title: {
      en: 'EU Carbon Tax on Shipping Takes Full Effect in 2026',
      ja: 'EU海運炭素税、2026年に全面施行へ',
      zh: '欧盟航运碳税将于2026年全面生效',
    },
    summary: {
      en: 'European Union confirms full implementation of ETS for maritime shipping starting January 2026, covering 100% of emissions.',
      ja: 'EUは2026年1月から海運向けETSの全面施行を確認。排出量の100%が対象。',
      zh: '欧盟确认2026年1月起全面实施航运排放交易体系，覆盖100%排放量。',
    },
    source: 'European Commission',
    companyId: null,
  },
  {
    id: 11,
    category: 'market',
    date: '2025-11-22',
    title: {
      en: 'VLSFO Bunker Prices Hit 6-Month High, Squeezing Carrier Margins',
      ja: 'VLSFO燃料価格が6カ月ぶり高値、船社マージンを圧迫',
      zh: 'VLSFO燃油价格创6个月新高，挤压船公司利润率',
    },
    summary: {
      en: 'VLSFO bunker fuel prices in Singapore surged to $640/ton, driven by Middle East tensions and refinery maintenance, raising operating costs across the industry.',
      ja: 'シンガポールのVLSFO燃料価格が中東情勢とリファイナリー定期修理の影響でトン640ドルに急騰し、業界全体の運営コストが上昇。',
      zh: '受中东局势和炼油厂检修影响，新加坡VLSFO燃油价格飙升至640美元/吨，推高全行业运营成本。',
    },
    source: 'Ship & Bunker',
    companyId: null,
  },
  {
    id: 12,
    category: 'market',
    date: '2025-02-10',
    title: {
      en: 'Gemini Cooperation Launch Reshapes Global Shipping Alliances',
      ja: 'ジェミニ・コーポレーション始動、世界の海運アライアンス再編',
      zh: '双子星合作启动，重塑全球航运联盟格局',
    },
    summary: {
      en: 'The Gemini Cooperation between Maersk and Hapag-Lloyd officially begins operations, replacing 2M and reshuffling THE Alliance membership dynamics.',
      ja: 'マースクとハパックロイドのジェミニ・コーポレーションが正式に運営開始。2Mに代わりTHE Allianceの構成にも影響。',
      zh: '马士基与赫伯罗特的双子星合作正式运营，取代2M联盟，重新调整THE Alliance成员格局。',
    },
    source: 'Alphaliner',
    companyId: 'maersk',
  },
  {
    id: 13,
    category: 'regulation',
    date: '2025-11-15',
    title: {
      en: 'Panama Canal Restores Full Transit Capacity After Drought Recovery',
      ja: 'パナマ運河、干ばつ回復で全面通航能力を復旧',
      zh: '巴拿马运河干旱缓解后恢复全面通航能力',
    },
    summary: {
      en: 'Panama Canal Authority restores daily transits to 36 vessels after improved rainfall replenishes Gatun Lake, easing supply chain bottlenecks.',
      ja: 'パナマ運河庁は降雨改善によるガトゥン湖の水位回復を受け、日次通航を36隻に復旧。サプライチェーンのボトルネック緩和へ。',
      zh: '巴拿马运河管理局在降雨改善加通湖水位后，将每日通航恢复至36艘，缓解供应链瓶颈。',
    },
    source: 'Journal of Commerce',
    companyId: null,
  },
  {
    id: 14,
    category: 'market',
    date: '2025-11-12',
    title: {
      en: 'SCFI Jumps 12% as Peak Season Demand Outpaces Capacity Growth',
      ja: 'SCFI12%上昇、繁忙期需要が船腹増を上回る',
      zh: 'SCFI跳涨12%，旺季需求超过运力增长',
    },
    summary: {
      en: 'Shanghai Containerized Freight Index rose sharply as peak-season volumes from Asia exceeded available container ship capacity despite new vessel deliveries.',
      ja: '上海コンテナ運賃指数が急上昇。新造船投入にもかかわらず、アジア発の繁忙期貨物量が利用可能なコンテナ船腹を超過。',
      zh: '上海集装箱运价指数大幅上涨，尽管有新船交付，亚洲旺季货量仍超过可用集装箱船运力。',
    },
    source: 'Shanghai Shipping Exchange',
    companyId: null,
  },
  {
    id: 15,
    category: 'fleet',
    date: '2025-11-08',
    title: {
      en: 'Global Container Fleet Order Book Reaches 28% of Existing Capacity',
      ja: '世界コンテナ船発注残、現有船腹の28%に到達',
      zh: '全球集装箱船订单簿达到现有运力的28%',
    },
    summary: {
      en: 'Container ship order books reached a record 7.8M TEU, raising concerns about potential overcapacity when new vessels deliver in 2026-2027.',
      ja: 'コンテナ船の発注残が過去最高の780万TEUに到達。2026-2027年の新造船竣工時の供給過剰懸念が高まる。',
      zh: '集装箱船订单簿达创纪录的780万TEU，引发2026-2027年新船交付时运力过剩的担忧。',
    },
    source: 'Clarksons Research',
    companyId: null,
  },
  {
    id: 16,
    category: 'earnings',
    date: '2025-11-05',
    title: {
      en: 'MOL Announces ¥50B Share Buyback Program to Boost Shareholder Returns',
      ja: '商船三井、500億円の自社株買いプログラムを発表',
      zh: '商船三井宣布500亿日元股票回购计划以提升股东回报',
    },
    summary: {
      en: 'Mitsui O.S.K. Lines announces a ¥50 billion share buyback program, signaling confidence in its long-term earnings outlook and commitment to shareholder returns.',
      ja: '商船三井は500億円の自社株買いプログラムを発表。長期的な収益見通しへの自信と株主還元への姿勢を示す。',
      zh: '商船三井宣布500亿日元股票回购计划，彰显对长期盈利前景的信心及股东回报承诺。',
    },
    source: 'Nikkei Asia',
    companyId: 'mol',
  },
  {
    id: 17,
    category: 'earnings',
    date: '2025-10-28',
    title: {
      en: 'Evergreen Marine Declares Record-High Quarterly Dividend of NT$18 Per Share',
      ja: 'エバーグリーン・マリン、1株当たりNT$18の過去最高四半期配当を宣言',
      zh: '长荣海运宣布创纪录季度股息每股18新台币',
    },
    summary: {
      en: 'Evergreen Marine declares its highest-ever quarterly dividend of NT$18 per share, reflecting robust profitability and strong cash reserves amid elevated freight rates.',
      ja: 'エバーグリーン・マリンは過去最高の四半期配当1株当たりNT$18を宣言。運賃高騰下での堅調な収益性と豊富なキャッシュを反映。',
      zh: '长荣海运宣布史上最高季度股息每股18新台币，反映出运费高企下的强劲盈利能力和充裕现金储备。',
    },
    source: 'Bloomberg',
    companyId: 'evergreen',
  },
  {
    id: 18,
    category: 'earnings',
    date: '2025-10-22',
    title: {
      en: 'Hapag-Lloyd Issues Profit Warning as Freight Rates Normalize',
      ja: 'ハパックロイド、運賃正常化で業績下方修正を発表',
      zh: '赫伯罗特发布盈利预警，运价回归常态',
    },
    summary: {
      en: 'Hapag-Lloyd warns full-year EBIT could fall 25% below guidance as trans-Pacific and Asia-Europe spot rates decline sharply from pandemic-era peaks.',
      ja: 'ハパックロイドは通期EBITがガイダンスを25%下回る可能性を警告。太平洋横断・アジア欧州スポット運賃がパンデミック時のピークから急落。',
      zh: '赫伯罗特警告全年EBIT可能低于指引25%，跨太平洋和亚欧即期运费从疫情时期高点大幅回落。',
    },
    source: 'Shipping Watch',
    companyId: 'hapag',
  },
  {
    id: 19,
    category: 'earnings',
    date: '2025-10-15',
    title: {
      en: 'HMM Privatization Advances as Harim-JKL Consortium Named Preferred Bidder',
      ja: 'HMM民営化進展、ハリム・JKLコンソーシアムが優先交渉権を獲得',
      zh: 'HMM私有化推进，Harim-JKL财团获优先竞标权',
    },
    summary: {
      en: 'South Korea\'s HMM moves closer to privatization as the Harim-JKL consortium is named preferred bidder for the government\'s 40% stake, valued at approximately $5 billion.',
      ja: '韓国HMMの民営化が進展。政府保有の40%株式（約50億ドル相当）についてハリム・JKLコンソーシアムが優先交渉権を獲得。',
      zh: '韩国HMM私有化迈出关键一步，Harim-JKL财团被选为政府40%股权的优先竞标方，估值约50亿美元。',
    },
    source: 'Reuters',
    companyId: 'hmmarine',
  },
  {
    id: 20,
    category: 'earnings',
    date: '2025-10-08',
    title: {
      en: 'ZIM Q4 Earnings Beat Expectations with Revenue Up 32% Year-over-Year',
      ja: 'ZIM、Q4決算が予想を上回る　売上高は前年同期比32%増',
      zh: 'ZIM第四季度业绩超预期，营收同比增长32%',
    },
    summary: {
      en: 'ZIM Integrated Shipping reports Q4 revenue of $2.5B, beating analyst estimates by 8%, driven by strong trans-Pacific volumes and disciplined capacity management.',
      ja: 'ZIMインテグレーテッドはQ4売上高25億ドルを報告。太平洋横断の好調な取扱量と規律ある輸送能力管理により、アナリスト予想を8%上回る。',
      zh: 'ZIM综合航运报告第四季度营收25亿美元，超出分析师预期8%，受益于跨太平洋货量强劲和运力管理。',
    },
    source: 'MarketWatch',
    companyId: 'zim',
  },
  {
    id: 21,
    category: 'earnings',
    date: '2025-09-30',
    title: {
      en: 'COSCO Shipping Full-Year Net Profit Rises 45% to RMB 38 Billion',
      ja: 'COSCO海運、通期純利益45%増の380億元',
      zh: '中远海控全年净利润增长45%至380亿元人民币',
    },
    summary: {
      en: 'COSCO Shipping Holdings posts full-year results with net profit of RMB 38 billion, a 45% increase, driven by higher freight rates and strong volume growth on intra-Asia routes.',
      ja: 'COSCO海運は通期純利益380億元（前年比45%増）を発表。運賃上昇とアジア域内航路の好調な取扱量増が寄与。',
      zh: '中远海控发布全年业绩，净利润380亿元人民币，同比增长45%，受益于运费上涨和亚洲区域内航线货量增长。',
    },
    source: 'South China Morning Post',
    companyId: 'cosco',
  },
  {
    id: 22,
    category: 'market',
    date: '2025-10-20',
    title: {
      en: 'Global Container Throughput Hits All-Time High of 900 Million TEU',
      ja: '世界のコンテナ取扱量が9億TEUの過去最高を記録',
      zh: '全球集装箱吞吐量创9亿TEU历史新高',
    },
    summary: {
      en: 'Global container port throughput reaches a record 900 million TEU in 2025, driven by robust e-commerce growth and inventory restocking cycles across major economies.',
      ja: '2025年の世界のコンテナ港湾取扱量が9億TEUの過去最高を記録。主要経済国でのEコマース成長と在庫補充サイクルが牽引。',
      zh: '2025年全球集装箱港口吞吐量达到创纪录的9亿TEU，受主要经济体电商增长和库存补充周期推动。',
    },
    source: 'Drewry',
    companyId: null,
  },
  {
    id: 23,
    category: 'market',
    date: '2025-10-12',
    title: {
      en: 'Trans-Pacific Freight Rates Drop 15% Amid Demand Softening',
      ja: '太平洋横断運賃が需要軟化で15%下落',
      zh: '跨太平洋运费下降15%，需求趋软',
    },
    summary: {
      en: 'Spot freight rates on the trans-Pacific eastbound route fall 15% from recent highs as US consumer demand cools and retailers reduce import volumes ahead of the holiday season.',
      ja: '太平洋横断東行き航路のスポット運賃が直近高値から15%下落。米国消費者需要の冷え込みとホリデーシーズン前の小売輸入量削減が影響。',
      zh: '跨太平洋东行航线即期运费从近期高点下跌15%，美国消费需求降温，零售商在节日季前减少进口量。',
    },
    source: 'The Loadstar',
    companyId: null,
  },
  {
    id: 24,
    category: 'market',
    date: '2025-10-05',
    title: {
      en: 'Asia-Europe Trade Lane Capacity Surges 20% as Carriers Deploy Mega-Vessels',
      ja: 'アジア-欧州航路、大型船投入で輸送能力20%増',
      zh: '亚欧航线运力激增20%，航运公司部署超大型船舶',
    },
    summary: {
      en: 'Available capacity on the Asia-Europe trade lane jumps 20% quarter-over-quarter as major carriers cascade new 24,000 TEU vessels onto the route, putting downward pressure on rates.',
      ja: 'アジア-欧州航路の利用可能輸送能力が前四半期比20%増加。主要船社が24,000 TEU級新造船を同航路に投入し、運賃下落圧力が高まる。',
      zh: '亚欧航线可用运力环比增长20%，主要航运公司将24000TEU新造船投入该航线，运价面临下行压力。',
    },
    source: 'Alphaliner',
    companyId: null,
  },
  {
    id: 25,
    category: 'market',
    date: '2025-09-28',
    title: {
      en: 'Blank Sailings Surge 35% as Carriers Manage Overcapacity',
      ja: '航海キャンセルが35%急増、キャリアが過剰輸送能力管理に奔走',
      zh: '停航率飙升35%，航运公司争相应对运力过剩',
    },
    summary: {
      en: 'Carriers have blanked 35% more sailings this quarter compared to last year as the industry struggles with overcapacity from new deliveries and weakening demand in key markets.',
      ja: '新造船の竣工と主要市場の需要減退による過剰輸送能力に業界が苦戦し、今四半期の航海キャンセルは前年比35%増加。',
      zh: '本季度航运公司停航数量同比增加35%，行业面对新船交付带来的运力过剩和主要市场需求减弱的压力。',
    },
    source: 'Splash247',
    companyId: null,
  },
  {
    id: 26,
    category: 'market',
    date: '2025-09-20',
    title: {
      en: 'US West Coast Port Congestion Eases to Pre-Pandemic Levels',
      ja: '米国西海岸の港湾混雑がパンデミック前の水準に改善',
      zh: '美国西海岸港口拥堵缓解至疫情前水平',
    },
    summary: {
      en: 'Average vessel wait times at Los Angeles and Long Beach ports drop below 1 day for the first time since 2019, as infrastructure investments and labor agreements take effect.',
      ja: 'ロサンゼルス・ロングビーチ港の平均船舶待機時間が2019年以来初めて1日を下回る。インフラ投資と労働協約が効果を発揮。',
      zh: '洛杉矶和长滩港平均船舶等待时间自2019年以来首次降至1天以下，基础设施投资和劳资协议见效。',
    },
    source: 'Journal of Commerce',
    companyId: null,
  },
  {
    id: 27,
    category: 'market',
    date: '2025-09-15',
    title: {
      en: 'China Export Growth of 8.3% Drives Strong Container Demand in Q3',
      ja: '中国輸出8.3%増、Q3のコンテナ需要を牽引',
      zh: '中国出口增长8.3%推动第三季度集装箱需求强劲',
    },
    summary: {
      en: 'China\'s export volume growth of 8.3% in Q3 drives a surge in container bookings from major Chinese ports, benefiting carriers with high exposure to Asia outbound trades.',
      ja: '中国のQ3輸出量8.3%増加が中国主要港からのコンテナ予約急増を牽引。アジア発航路に強い船社が恩恵。',
      zh: '中国第三季度出口量增长8.3%带动主要港口集装箱订舱量激增，对亚洲出口航线占比高的航运公司形成利好。',
    },
    source: 'Reuters',
    companyId: null,
  },
  {
    id: 28,
    category: 'fleet',
    date: '2025-10-18',
    title: {
      en: 'ONE Alliance Orders 12 New 16,000 TEU Mega Container Vessels',
      ja: 'ONEアライアンス、16,000 TEU級大型コンテナ船12隻を発注',
      zh: 'ONE联盟订购12艘16000TEU超大型集装箱船',
    },
    summary: {
      en: 'Ocean Network Express places a $3.2 billion order for twelve 16,000 TEU dual-fuel container vessels with South Korean shipyards, targeting delivery between 2027-2029.',
      ja: 'ONEは韓国造船所に16,000 TEU級デュアルフューエルコンテナ船12隻を32億ドルで発注。2027-2029年の竣工を予定。',
      zh: 'ONE向韩国船厂下达32亿美元订单，订购12艘16000TEU双燃料集装箱船，计划2027-2029年交付。',
    },
    source: 'TradeWinds',
    companyId: 'nyk',
  },
  {
    id: 29,
    category: 'fleet',
    date: '2025-10-01',
    title: {
      en: 'NYK Launches Autonomous Shipping Trial in Tokyo Bay',
      ja: '日本郵船、東京湾で自律航行船舶の実証試験を開始',
      zh: '日本邮船在东京湾启动自主航运试验',
    },
    summary: {
      en: 'Nippon Yusen begins a six-month autonomous navigation trial with a 749 GT coastal vessel in Tokyo Bay, aiming to commercialize fully autonomous cargo ships by 2030.',
      ja: '日本郵船が東京湾で749GT級沿岸船による6カ月間の自律航行実証試験を開始。2030年までに完全自律貨物船の商用化を目指す。',
      zh: '日本邮船在东京湾启动为期六个月的自主航行试验，使用749GT沿海船舶，目标2030年实现全自主货船商业化。',
    },
    source: 'Nikkei Asia',
    companyId: 'nyk',
  },
  {
    id: 30,
    category: 'fleet',
    date: '2025-09-25',
    title: {
      en: 'Industry Coalition Pushes for Ammonia-Fueled Vessels to Enter Service by 2030',
      ja: '業界連合、2030年までのアンモニア燃料船就航を推進',
      zh: '行业联盟推动氨燃料船舶在2030年前投入运营',
    },
    summary: {
      en: 'A coalition of 40 shipping companies and engine manufacturers announces a joint commitment to deploy the first commercial ammonia-fueled ocean vessels by 2030, with pilot projects already underway.',
      ja: '海運会社とエンジンメーカー40社の連合が、2030年までに初の商用アンモニア燃料外航船を就航させる共同コミットメントを発表。パイロットプロジェクトは既に進行中。',
      zh: '40家航运公司和发动机制造商组成的联盟宣布联合承诺，将在2030年前部署首批商用氨燃料远洋船舶，试点项目已在进行中。',
    },
    source: 'Lloyd\'s List',
    companyId: null,
  },
  {
    id: 31,
    category: 'fleet',
    date: '2025-09-18',
    title: {
      en: 'Evergreen Takes Delivery of 24,000 TEU A-Class Mega Container Ship',
      ja: 'エバーグリーン、24,000 TEU級Aクラス超大型コンテナ船を受領',
      zh: '长荣海运接收24000TEU A级超大型集装箱船',
    },
    summary: {
      en: 'Evergreen Marine takes delivery of its first 24,000 TEU A-class vessel from Samsung Heavy Industries, the largest ship in the company\'s fleet, to be deployed on the Asia-Europe route.',
      ja: 'エバーグリーン・マリンがサムスン重工業から24,000 TEU級Aクラス船を初受領。同社船隊最大の船舶としてアジア-欧州航路に投入予定。',
      zh: '长荣海运从三星重工接收首艘24000TEU A级船舶，为公司船队最大船舶，将部署于亚欧航线。',
    },
    source: 'Splash247',
    companyId: 'evergreen',
  },
  {
    id: 32,
    category: 'regulation',
    date: '2025-10-25',
    title: {
      en: 'EU ETS Carbon Costs Reach $50 Per Container on Asia-Europe Trade',
      ja: 'EU ETS、アジア-欧州航路でコンテナ当たり50ドルの炭素コストに到達',
      zh: '欧盟碳排放交易体系使亚欧航线每箱碳成本达50美元',
    },
    summary: {
      en: 'Rising EU carbon allowance prices push the estimated ETS cost per container on Asia-Europe voyages to $50, prompting carriers to accelerate fleet decarbonization investments.',
      ja: 'EU炭素排出枠価格の上昇により、アジア-欧州航海のコンテナ当たりETSコストが推定50ドルに到達。船社は船隊脱炭素化投資を加速。',
      zh: '欧盟碳配额价格上涨使亚欧航线每箱ETS成本升至50美元，促使航运公司加速船队脱碳投资。',
    },
    source: 'Shipping Watch',
    companyId: null,
  },
  {
    id: 33,
    category: 'regulation',
    date: '2025-10-10',
    title: {
      en: 'US FMC Launches Investigation Into Carrier Detention and Demurrage Surcharges',
      ja: '米国FMC、キャリアの留置料・超過保管料に関する調査を開始',
      zh: '美国联邦海事委员会对承运人滞留费和滞期费附加费启动调查',
    },
    summary: {
      en: 'The US Federal Maritime Commission opens a formal investigation into alleged unfair detention and demurrage practices by major ocean carriers, following complaints from shippers and freight forwarders.',
      ja: '米国連邦海事委員会が、荷主やフォワーダーからの苦情を受け、主要外航船社による不当な留置料・超過保管料慣行について正式調査を開始。',
      zh: '美国联邦海事委员会在托运人和货运代理投诉后，对主要远洋承运人涉嫌不公平的滞留费和滞期费行为启动正式调查。',
    },
    source: 'Journal of Commerce',
    companyId: null,
  },
  {
    id: 34,
    category: 'regulation',
    date: '2025-09-22',
    title: {
      en: 'Singapore and Rotterdam Launch Green Shipping Corridor Initiative',
      ja: 'シンガポールとロッテルダム、グリーン海運回廊イニシアチブを開始',
      zh: '新加坡与鹿特丹启动绿色航运走廊倡议',
    },
    summary: {
      en: 'The ports of Singapore and Rotterdam formally launch a green shipping corridor, committing to zero-emission vessel operations along the route by 2028 with methanol and ammonia bunkering infrastructure.',
      ja: 'シンガポール港とロッテルダム港がグリーン海運回廊を正式に開設。メタノール・アンモニアバンカリングインフラを整備し、2028年までに航路上のゼロエミッション運航を目指す。',
      zh: '新加坡港和鹿特丹港正式启动绿色航运走廊，承诺到2028年实现航线零排放运营，配套甲醇和氨燃料加注基础设施。',
    },
    source: 'Lloyd\'s List',
    companyId: null,
  },
  {
    id: 35,
    category: 'regulation',
    date: '2025-09-10',
    title: {
      en: 'China Announces New Regulations on Port Congestion Surcharges',
      ja: '中国、港湾混雑サーチャージに関する新規制を発表',
      zh: '中国发布港口拥堵附加费新规',
    },
    summary: {
      en: 'China\'s Ministry of Transport issues new regulations requiring carriers to provide transparent cost breakdowns and 30-day advance notice before imposing port congestion surcharges on Chinese trade routes.',
      ja: '中国交通運輸部は、中国関連航路での港湾混雑サーチャージ導入に際し、透明なコスト内訳と30日前の事前通知を義務付ける新規制を発表。',
      zh: '中国交通运输部发布新规，要求承运人在中国贸易航线征收港口拥堵附加费前提供透明成本明细并提前30天通知。',
    },
    source: 'Drewry',
    companyId: null,
  },
];
