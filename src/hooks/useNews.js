import { useState, useEffect, useCallback } from 'react';
import { newsData as staticNews } from '../data/companies';

// RSS feed sources for maritime/shipping news
const RSS_FEEDS = [
  {
    url: 'https://gcaptain.com/feed/',
    source: 'gCaptain',
    category: 'market',
  },
  {
    url: 'https://splash247.com/feed/',
    source: 'Splash247',
    category: 'market',
  },
  {
    url: 'https://www.hellenicshippingnews.com/feed/',
    source: 'Hellenic Shipping News',
    category: 'market',
  },
  {
    url: 'https://www.seatrade-maritime.com/rss.xml',
    source: 'Seatrade Maritime',
    category: 'fleet',
  },
  {
    url: 'https://theloadstar.com/feed/',
    source: 'The Loadstar',
    category: 'market',
  },
];

// CORS proxy for fetching RSS feeds from the browser
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

// Shipping company keywords for categorization and matching
const COMPANY_KEYWORDS = {
  nyk: ['nyk', 'nippon yusen', '日本郵船', '日本邮船'],
  mol: ['mol', 'mitsui o.s.k', 'mitsui osk', '商船三井'],
  kline: ['k line', 'k-line', 'kawasaki kisen', '川崎汽船'],
  maersk: ['maersk', 'mærsk'],
  cosco: ['cosco', 'china ocean', '中远海控', '中远'],
  evergreen: ['evergreen', '長榮', '长荣'],
  hapag: ['hapag-lloyd', 'hapag lloyd'],
  yangming: ['yang ming', '陽明', '阳明'],
  zim: ['zim'],
  hmmarine: ['hmm', 'hyundai merchant', '현대상선'],
};

const CATEGORY_KEYWORDS = {
  earnings: ['earnings', 'profit', 'revenue', 'results', 'financial', 'quarterly', 'annual', 'income', 'EBITDA', 'dividend', '業績', '決算', '财报', '利润'],
  fleet: ['fleet', 'vessel', 'ship', 'container', 'tanker', 'bulker', 'LNG', 'order', 'newbuild', 'delivery', 'shipyard', '船舶', '船队', '船隊'],
  market: ['freight', 'rate', 'trade', 'demand', 'supply', 'index', 'BDI', 'SCFI', 'market', 'cargo', 'port', 'route', '市場', '运价', '市场'],
  regulation: ['regulation', 'IMO', 'emission', 'carbon', 'environment', 'compliance', 'safety', 'sanction', 'policy', '規制', '法规', '排放'],
};

function categorizeArticle(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
      return category;
    }
  }
  return 'market';
}

function matchCompany(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  for (const [companyId, keywords] of Object.entries(COMPANY_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
      return companyId;
    }
  }
  return null;
}

function parseRSSItem(item, source, defaultCategory) {
  const parser = new DOMParser();

  // Extract title
  const titleEl = item.querySelector('title');
  const title = titleEl?.textContent?.trim() || '';

  // Extract link
  const linkEl = item.querySelector('link');
  const link = linkEl?.textContent?.trim() || linkEl?.getAttribute('href') || '';

  // Extract date
  const pubDateEl = item.querySelector('pubDate');
  const dcDateEl = item.querySelector('date');
  const dateStr = pubDateEl?.textContent || dcDateEl?.textContent || '';
  const date = dateStr ? new Date(dateStr) : new Date();

  // Extract description/summary
  const descEl = item.querySelector('description');
  const contentEl = item.querySelector('encoded') || item.querySelector('content');
  let description = descEl?.textContent?.trim() || contentEl?.textContent?.trim() || '';

  // Strip HTML from description
  const tempDoc = parser.parseFromString(`<div>${description}</div>`, 'text/html');
  description = tempDoc.body.textContent?.trim() || '';

  // Limit description length
  if (description.length > 200) {
    description = description.substring(0, 200).trim() + '...';
  }

  const category = categorizeArticle(title, description);
  const companyId = matchCompany(title, description);

  return {
    title,
    link,
    date: date.toISOString().split('T')[0],
    dateObj: date,
    description,
    source,
    category,
    companyId,
  };
}

function parseRSS(xmlText, source, defaultCategory) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');

    // Check for parse errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) return [];

    // Try RSS format (item elements)
    let items = Array.from(doc.querySelectorAll('item'));

    // Try Atom format (entry elements)
    if (items.length === 0) {
      items = Array.from(doc.querySelectorAll('entry'));
    }

    return items
      .slice(0, 15) // Take max 15 per feed
      .map(item => parseRSSItem(item, source, defaultCategory))
      .filter(item => item.title); // Filter out empty titles
  } catch (e) {
    console.warn(`Failed to parse RSS from ${source}:`, e);
    return [];
  }
}

async function fetchFeed(feed) {
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(proxy + encodeURIComponent(feed.url), {
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) continue;
      const text = await response.text();
      return parseRSS(text, feed.source, feed.category);
    } catch (e) {
      continue;
    }
  }
  return [];
}

// Convert static news to the same format
function convertStaticNews(language) {
  return staticNews.map((item, index) => ({
    id: `static-${item.id}`,
    title: typeof item.title === 'object' ? item.title[language] || item.title.en : item.title,
    description: typeof item.summary === 'object' ? item.summary[language] || item.summary.en : (item.summary || ''),
    date: item.date,
    dateObj: new Date(item.date),
    source: item.source || 'Industry Report',
    category: item.category,
    companyId: item.companyId || null,
    link: null,
    isStatic: true,
  }));
}

export function useNews(language = 'en') {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  const [liveCount, setLiveCount] = useState(0);

  const fetchAllNews = useCallback(async () => {
    setLoading(true);

    // Fetch live RSS feeds in parallel
    const feedPromises = RSS_FEEDS.map(feed => fetchFeed(feed));
    const results = await Promise.allSettled(feedPromises);

    const liveArticles = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value)
      .map((article, index) => ({
        ...article,
        id: `live-${index}`,
        isStatic: false,
      }));

    // Get static news as fallback
    const staticArticles = convertStaticNews(language);

    // Combine: live news first, then static
    const allNews = [...liveArticles, ...staticArticles]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Deduplicate by similar titles
    const seen = new Set();
    const deduped = allNews.filter(article => {
      const key = article.title.toLowerCase().substring(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setNews(deduped);
    setLiveCount(liveArticles.length);
    setLastFetched(new Date());
    setLoading(false);
  }, [language]);

  useEffect(() => {
    fetchAllNews();

    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchAllNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllNews]);

  return { news, loading, lastFetched, liveCount, refresh: fetchAllNews };
}
