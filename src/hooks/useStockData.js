import { useState, useEffect, useCallback } from 'react';
import { companies as staticCompanies } from '../data/companies';

// Yahoo Finance tickers for our companies
const TICKERS = {
  nyk: '9101.T',
  mol: '9104.T',
  kline: '9107.T',
  maersk: 'MAERSK-B.CO',
  cosco: '1919.HK',
  evergreen: '2603.TW',
  hapag: 'HLAG.DE',
  yangming: '2609.TW',
  zim: 'ZIM',
  hmmarine: '011200.KS',
};

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

async function fetchWithProxy(url) {
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(proxy + encodeURIComponent(url), {
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      continue;
    }
  }
  return null;
}

async function fetchYahooQuotes(tickers) {
  try {
    const symbols = tickers.join(',');
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketTime,marketCap,trailingPE,dividendYield`;
    const data = await fetchWithProxy(url);
    if (data?.quoteResponse?.result) {
      return data.quoteResponse.result;
    }
  } catch (e) {
    console.warn('Yahoo Finance API failed:', e);
  }
  return null;
}

// Alternative: use Yahoo Finance v8 chart API for individual stocks
async function fetchStockPrice(ticker) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
    const data = await fetchWithProxy(url);
    if (data?.chart?.result?.[0]) {
      const result = data.chart.result[0];
      const meta = result.meta;
      return {
        price: meta.regularMarketPrice,
        previousClose: meta.previousClose || meta.chartPreviousClose,
        change: ((meta.regularMarketPrice - (meta.previousClose || meta.chartPreviousClose)) / (meta.previousClose || meta.chartPreviousClose)) * 100,
        currency: meta.currency,
        timestamp: meta.regularMarketTime * 1000,
      };
    }
  } catch (e) {
    // silently fail
  }
  return null;
}

export function useStockData() {
  const [companies, setCompanies] = useState(staticCompanies);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchStockData = useCallback(async () => {
    setLoading(true);

    // Try batch fetch first
    const allTickers = Object.values(TICKERS);
    const quotes = await fetchYahooQuotes(allTickers);

    if (quotes && quotes.length > 0) {
      // Batch fetch succeeded
      const quoteMap = {};
      quotes.forEach(q => {
        quoteMap[q.symbol] = q;
      });

      const updated = staticCompanies.map(company => {
        const ticker = TICKERS[company.id];
        const quote = quoteMap[ticker];
        if (quote) {
          return {
            ...company,
            stockPrice: quote.regularMarketPrice || company.stockPrice,
            change: quote.regularMarketChangePercent || company.change,
            marketCap: quote.marketCap || company.marketCap,
            peRatio: quote.trailingPE || company.peRatio,
            dividendYield: quote.dividendYield ? quote.dividendYield * 100 : company.dividendYield,
          };
        }
        return company;
      });

      setCompanies(updated);
      setLastUpdated(new Date());
      setIsLive(true);
      setLoading(false);
      return;
    }

    // Fallback: fetch individual stocks
    const fetchPromises = Object.entries(TICKERS).map(async ([companyId, ticker]) => {
      const data = await fetchStockPrice(ticker);
      return { companyId, data };
    });

    const results = await Promise.allSettled(fetchPromises);
    let anySuccess = false;

    const updated = staticCompanies.map(company => {
      const result = results.find(r =>
        r.status === 'fulfilled' && r.value.companyId === company.id && r.value.data
      );
      if (result) {
        anySuccess = true;
        const { data } = result.value;
        return {
          ...company,
          stockPrice: data.price || company.stockPrice,
          change: data.change ?? company.change,
        };
      }
      return company;
    });

    setCompanies(updated);
    if (anySuccess) {
      setLastUpdated(new Date());
      setIsLive(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStockData();

    // Refresh every 5 minutes during market hours
    const interval = setInterval(fetchStockData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchStockData]);

  return { companies, lastUpdated, isLive, loading, refresh: fetchStockData };
}
