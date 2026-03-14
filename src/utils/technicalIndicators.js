// Simple Moving Average
export function calculateSMA(data, period) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push({ date: data[i].date, value: null });
    } else {
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) {
        sum += data[j].price;
      }
      result.push({ date: data[i].date, value: sum / period });
    }
  }
  return result;
}

// Exponential Moving Average
export function calculateEMA(data, period) {
  const result = [];
  const k = 2 / (period + 1);

  // Start with SMA for the first EMA value
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sum += data[i].price;
      result.push({ date: data[i].date, value: null });
    } else if (i === period - 1) {
      sum += data[i].price;
      const sma = sum / period;
      result.push({ date: data[i].date, value: sma });
    } else {
      const prev = result[i - 1].value;
      const ema = data[i].price * k + prev * (1 - k);
      result.push({ date: data[i].date, value: ema });
    }
  }
  return result;
}

// Relative Strength Index (0-100)
export function calculateRSI(data, period = 14) {
  const result = [];
  if (data.length < period + 1) {
    return data.map(d => ({ date: d.date, value: null }));
  }

  // Calculate price changes
  const changes = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].price - data[i - 1].price);
  }

  // First average gain/loss
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 0; i < period; i++) {
    if (changes[i] >= 0) avgGain += changes[i];
    else avgLoss += Math.abs(changes[i]);
  }
  avgGain /= period;
  avgLoss /= period;

  // First data point has no RSI
  result.push({ date: data[0].date, value: null });

  // Fill nulls for the initial period
  for (let i = 1; i <= period; i++) {
    result.push({ date: data[i].date, value: null });
  }

  // Calculate first RSI
  const rs0 = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const rsi0 = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs0);
  result[period] = { date: data[period].date, value: rsi0 };

  // Subsequent values using smoothed averages
  for (let i = period; i < changes.length; i++) {
    const change = changes[i];
    const gain = change >= 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
    result.push({ date: data[i + 1].date, value: rsi });
  }

  return result;
}

// MACD (12,26,9)
export function calculateMACD(data, fast = 12, slow = 26, signal = 9) {
  const emaFast = calculateEMA(data, fast);
  const emaSlow = calculateEMA(data, slow);

  // MACD line = fast EMA - slow EMA
  const macdLine = [];
  for (let i = 0; i < data.length; i++) {
    const f = emaFast[i]?.value;
    const s = emaSlow[i]?.value;
    macdLine.push({
      date: data[i].date,
      value: f != null && s != null ? f - s : null,
    });
  }

  // Signal line = EMA of MACD line
  // Build pseudo-data for EMA calculation
  const macdData = macdLine
    .filter(d => d.value != null)
    .map(d => ({ date: d.date, price: d.value }));

  const signalEma = calculateEMA(macdData, signal);

  // Map signal values back by date
  const signalMap = {};
  signalEma.forEach(d => {
    if (d.value != null) signalMap[d.date] = d.value;
  });

  return data.map(d => {
    const m = macdLine.find(ml => ml.date === d.date);
    const macdVal = m?.value ?? null;
    const sigVal = signalMap[d.date] ?? null;
    return {
      date: d.date,
      macd: macdVal,
      signal: sigVal,
      histogram: macdVal != null && sigVal != null ? macdVal - sigVal : null,
    };
  });
}

// Bollinger Bands (20-day SMA, 2 std dev)
export function calculateBollingerBands(data, period = 20, stdDev = 2) {
  const sma = calculateSMA(data, period);
  const result = [];

  for (let i = 0; i < data.length; i++) {
    if (sma[i].value == null) {
      result.push({ date: data[i].date, upper: null, middle: null, lower: null });
    } else {
      let sumSq = 0;
      for (let j = i - period + 1; j <= i; j++) {
        sumSq += Math.pow(data[j].price - sma[i].value, 2);
      }
      const sd = Math.sqrt(sumSq / period);
      result.push({
        date: data[i].date,
        upper: sma[i].value + stdDev * sd,
        middle: sma[i].value,
        lower: sma[i].value - stdDev * sd,
      });
    }
  }
  return result;
}
