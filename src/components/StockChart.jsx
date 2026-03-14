import { useState, useMemo, useEffect } from 'react';
import { ComposedChart, Area, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Cell } from 'recharts';
import { formatCurrency } from '../utils/format';
import { useLanguage } from '../i18n/LanguageContext';
import { calculateSMA, calculateEMA, calculateRSI, calculateMACD, calculateBollingerBands } from '../utils/technicalIndicators';

const STORAGE_KEY = 'shiptracker-indicators';

const INDICATORS = [
  { key: 'sma', label: 'SMA' },
  { key: 'ema', label: 'EMA' },
  { key: 'rsi', label: 'RSI' },
  { key: 'macd', label: 'MACD' },
  { key: 'bb', label: 'BB' },
];

function loadIndicators() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

function CustomTooltip({ active, payload, label, currency, activeIndicators }) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  const pricePayload = payload.find(p => p.dataKey === 'price');
  const price = pricePayload?.value;
  const change = data.dayChange;
  const changeColor = change >= 0 ? '#22c55e' : '#ef4444';

  return (
    <div className="bg-[var(--bg-card)]/95 backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
      <p className="text-sm font-semibold text-[var(--text-primary)]">
        {formatCurrency(price, currency)}
      </p>
      {change !== undefined && change !== null && (
        <p className="text-xs mt-0.5" style={{ color: changeColor }}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </p>
      )}
      {data.volume != null && (
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Vol: {(data.volume / 1e6).toFixed(1)}M
        </p>
      )}
      {activeIndicators.includes('sma') && data.sma20 != null && (
        <p className="text-xs text-blue-400 mt-0.5">SMA(20): {data.sma20.toFixed(2)}</p>
      )}
      {activeIndicators.includes('sma') && data.sma50 != null && (
        <p className="text-xs text-orange-400 mt-0.5">SMA(50): {data.sma50.toFixed(2)}</p>
      )}
      {activeIndicators.includes('ema') && data.ema12 != null && (
        <p className="text-xs text-cyan-400 mt-0.5">EMA(12): {data.ema12.toFixed(2)}</p>
      )}
      {activeIndicators.includes('bb') && data.bbUpper != null && (
        <div className="mt-0.5">
          <p className="text-xs text-blue-300">BB Upper: {data.bbUpper.toFixed(2)}</p>
          <p className="text-xs text-blue-300">BB Lower: {data.bbLower.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

function RsiTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  if (val == null) return null;
  return (
    <div className="bg-[var(--bg-card)]/95 backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
      <p className="text-sm font-semibold text-[var(--text-primary)]">RSI: {val.toFixed(1)}</p>
    </div>
  );
}

function MacdTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  return (
    <div className="bg-[var(--bg-card)]/95 backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
      {data.macd != null && <p className="text-xs text-blue-400">MACD: {data.macd.toFixed(3)}</p>}
      {data.macdSignal != null && <p className="text-xs text-orange-400">Signal: {data.macdSignal.toFixed(3)}</p>}
      {data.macdHist != null && <p className="text-xs text-[var(--text-primary)]">Hist: {data.macdHist.toFixed(3)}</p>}
    </div>
  );
}

export default function StockChart({ data, color = '#3b82f6', currency = 'USD', height = 400 }) {
  const { t } = useLanguage();
  const [range, setRange] = useState('3M');
  const [activeIndicators, setActiveIndicators] = useState(loadIndicators);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeIndicators));
  }, [activeIndicators]);

  function toggleIndicator(key) {
    setActiveIndicators(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const days = range === '1W' ? 7 : range === '1M' ? 30 : range === '3M' ? 90 : range === '6M' ? 180 : 365;
    return data.slice(-days).map((d, i, arr) => ({
      ...d,
      isUp: i === 0 ? true : d.price >= arr[i - 1].price,
      dayChange: i === 0 ? 0 : ((d.price - arr[i - 1].price) / arr[i - 1].price) * 100,
    }));
  }, [data, range]);

  // Calculate indicators on full data then slice to match filtered range
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const days = range === '1W' ? 7 : range === '1M' ? 30 : range === '3M' ? 90 : range === '6M' ? 180 : 365;

    // Calculate on full dataset for accuracy
    const sma20 = activeIndicators.includes('sma') ? calculateSMA(data, 20) : null;
    const sma50 = activeIndicators.includes('sma') ? calculateSMA(data, 50) : null;
    const ema12 = activeIndicators.includes('ema') ? calculateEMA(data, 12) : null;
    const rsi = activeIndicators.includes('rsi') ? calculateRSI(data, 14) : null;
    const macd = activeIndicators.includes('macd') ? calculateMACD(data) : null;
    const bb = activeIndicators.includes('bb') ? calculateBollingerBands(data) : null;

    // Slice to the visible range
    const startIdx = Math.max(0, data.length - days);
    return filteredData.map((d, i) => {
      const fullIdx = startIdx + i;
      const entry = { ...d };
      if (sma20) entry.sma20 = sma20[fullIdx]?.value ?? null;
      if (sma50) entry.sma50 = sma50[fullIdx]?.value ?? null;
      if (ema12) entry.ema12 = ema12[fullIdx]?.value ?? null;
      if (rsi) entry.rsi = rsi[fullIdx]?.value ?? null;
      if (macd) {
        entry.macd = macd[fullIdx]?.macd ?? null;
        entry.macdSignal = macd[fullIdx]?.signal ?? null;
        entry.macdHist = macd[fullIdx]?.histogram ?? null;
      }
      if (bb) {
        entry.bbUpper = bb[fullIdx]?.upper ?? null;
        entry.bbMiddle = bb[fullIdx]?.middle ?? null;
        entry.bbLower = bb[fullIdx]?.lower ?? null;
        // For the shaded area between bands
        entry.bbRange = bb[fullIdx]?.upper != null ? [bb[fullIdx].lower, bb[fullIdx].upper] : null;
      }
      return entry;
    });
  }, [data, range, filteredData, activeIndicators]);

  if (!chartData.length) return null;

  const ranges = ['1W', '1M', '3M', '6M', '1Y'];
  const high = Math.max(...chartData.map(d => d.price));
  const low = Math.min(...chartData.map(d => d.price));
  const avgPrice = chartData.reduce((s, d) => s + d.price, 0) / chartData.length;
  const gradientId = `grad-${color.replace('#', '')}`;

  const showRsi = activeIndicators.includes('rsi');
  const showMacd = activeIndicators.includes('macd');
  const showSma = activeIndicators.includes('sma');
  const showEma = activeIndicators.includes('ema');
  const showBb = activeIndicators.includes('bb');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
          <span>{t('common.high')}: <span className="text-[var(--text-primary)] font-medium">{formatCurrency(high, currency)}</span></span>
          <span>{t('common.low')}: <span className="text-[var(--text-primary)] font-medium">{formatCurrency(low, currency)}</span></span>
          <span>{t('common.avg')}: <span className="text-[var(--text-primary)] font-medium">{formatCurrency(avgPrice, currency)}</span></span>
        </div>
        <div className="flex gap-1">
          {ranges.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                range === r
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Indicator toggles */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {INDICATORS.map(ind => (
          <button
            key={ind.key}
            onClick={() => toggleIndicator(ind.key)}
            className={`px-2.5 py-1 text-[11px] rounded-full font-medium transition-colors ${
              activeIndicators.includes(ind.key)
                ? 'bg-blue-600 text-white'
                : 'bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            {ind.label}
          </button>
        ))}
      </div>

      {/* Main price chart */}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickFormatter={v => v.slice(5)}
            interval="preserveStartEnd"
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
          />
          <YAxis
            yAxisId="price"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
          />
          <YAxis
            yAxisId="volume"
            orientation="right"
            tick={false}
            axisLine={false}
            tickLine={false}
            domain={[0, dataMax => dataMax * 4]}
          />
          <Tooltip content={<CustomTooltip currency={currency} activeIndicators={activeIndicators} />} />
          <ReferenceLine yAxisId="price" y={avgPrice} stroke="#475569" strokeDasharray="3 3" />
          <Bar yAxisId="volume" dataKey="volume" opacity={0.5} isAnimationActive={false}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.isUp ? '#22c55e33' : '#ef444433'} />
            ))}
          </Bar>

          {/* Bollinger Bands shaded area */}
          {showBb && (
            <>
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="bbUpper"
                stroke="none"
                fill="rgba(59,130,246,0.08)"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="bbLower"
                stroke="none"
                fill="#0b0e17"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
              <Line yAxisId="price" type="monotone" dataKey="bbUpper" stroke="#3b82f6" strokeWidth={1} strokeOpacity={0.4} dot={false} activeDot={false} isAnimationActive={false} />
              <Line yAxisId="price" type="monotone" dataKey="bbLower" stroke="#3b82f6" strokeWidth={1} strokeOpacity={0.4} dot={false} activeDot={false} isAnimationActive={false} />
            </>
          )}

          {/* Main price area */}
          <Area
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: '#0f1221', strokeWidth: 2 }}
          />

          {/* SMA lines */}
          {showSma && (
            <>
              <Line yAxisId="price" type="monotone" dataKey="sma20" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 3" dot={false} activeDot={false} isAnimationActive={false} />
              <Line yAxisId="price" type="monotone" dataKey="sma50" stroke="#f97316" strokeWidth={1.5} strokeDasharray="4 3" dot={false} activeDot={false} isAnimationActive={false} />
            </>
          )}

          {/* EMA line */}
          {showEma && (
            <Line yAxisId="price" type="monotone" dataKey="ema12" stroke="#06b6d4" strokeWidth={1.5} dot={false} activeDot={false} isAnimationActive={false} />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* RSI Sub-chart */}
      {showRsi && (
        <div className="mt-2">
          <p className="text-[10px] text-[var(--text-muted)] mb-1 ml-1">RSI (14)</p>
          <ResponsiveContainer width="100%" height={80}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" hide />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                ticks={[30, 50, 70]}
              />
              <Tooltip content={<RsiTooltip />} />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
              <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" strokeOpacity={0.5} />
              <Line type="monotone" dataKey="rsi" stroke="#a855f7" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* MACD Sub-chart */}
      {showMacd && (
        <div className="mt-2">
          <p className="text-[10px] text-[var(--text-muted)] mb-1 ml-1">MACD (12,26,9)</p>
          <ResponsiveContainer width="100%" height={80}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" hide />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<MacdTooltip />} />
              <ReferenceLine y={0} stroke="#475569" strokeDasharray="2 2" />
              <Bar dataKey="macdHist" isAnimationActive={false}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.macdHist >= 0 ? '#22c55e88' : '#ef444488'} />
                ))}
              </Bar>
              <Line type="monotone" dataKey="macd" stroke="#3b82f6" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} isAnimationActive={false} />
              <Line type="monotone" dataKey="macdSignal" stroke="#f97316" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
