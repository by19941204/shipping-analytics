export function formatCurrency(value, currency) {
  const symbols = { JPY: '¥', USD: '$', EUR: '€', HKD: 'HK$', DKK: 'kr', TWD: 'NT$', KRW: '₩' };
  const sym = symbols[currency] || currency + ' ';
  if (currency === 'JPY' || currency === 'KRW') {
    return `${sym}${Math.round(value).toLocaleString()}`;
  }
  return `${sym}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatMarketCap(value, language = 'en') {
  if (language === 'ja') {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}兆`;
    if (value >= 1e8) return `${(value / 1e8).toFixed(0)}億`;
    return `${(value / 1e6).toFixed(0)}百万`;
  }
  if (language === 'zh') {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}万亿`;
    if (value >= 1e8) return `${(value / 1e8).toFixed(0)}亿`;
    return `${(value / 1e6).toFixed(0)}百万`;
  }
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}

export function formatPercent(value) {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

export function formatNumber(value) {
  return value?.toLocaleString() ?? '-';
}

// Approximate exchange rates to USD (as of March 2026)
export const FX_RATES = {
  USD: 1,
  JPY: 0.0067,    // ~149 JPY/USD
  EUR: 1.09,
  HKD: 0.128,
  DKK: 0.146,
  TWD: 0.031,
  KRW: 0.00073,   // ~1370 KRW/USD
};

// Convert any currency amount to USD
export function toUSD(value, currency) {
  return value * (FX_RATES[currency] || 1);
}

// Format value in USD with B/M suffix
export function formatUSD(value) {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

// Format market cap always in USD for comparison
export function formatMarketCapUSD(value, currency) {
  const usd = toUSD(value, currency);
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(1)}B`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(0)}M`;
  return `$${usd.toLocaleString()}`;
}
