import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { WatchlistProvider } from './contexts/WatchlistContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import News from './pages/News';
import Compare from './pages/Compare';
import Watchlist from './pages/Watchlist';
import Screener from './pages/Screener';
import MarketAnalysis from './pages/MarketAnalysis';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <WatchlistProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/company/:id" element={<CompanyDetail />} />
                <Route path="/news" element={<News />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/screener" element={<Screener />} />
                <Route path="/market-analysis" element={<MarketAnalysis />} />
              </Route>
            </Routes>
          </WatchlistProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
