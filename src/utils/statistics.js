/**
 * Pearson correlation coefficient between two arrays.
 * Returns a value between -1 and 1.
 */
export function pearsonCorrelation(x, y) {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
    sumY2 += y[i] * y[i];
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  return numerator / denominator;
}

/**
 * Calculate daily percentage returns from a price history array.
 * Expects objects with a `price` property.
 */
export function calculateReturns(priceHistory) {
  const returns = [];
  for (let i = 1; i < priceHistory.length; i++) {
    const prev = priceHistory[i - 1].price;
    if (prev === 0) {
      returns.push(0);
    } else {
      returns.push((priceHistory[i].price - prev) / prev);
    }
  }
  return returns;
}
