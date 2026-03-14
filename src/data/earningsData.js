// Earnings and dividend calendar data for all 10 companies
// Japanese companies: fiscal year ends March, Q4=May, Q1=Aug, Q2=Nov, Q3=Feb
// Western/Asian companies: calendar quarters Jan/Apr/Jul/Oct
export const earningsCalendar = [
  // NYK (9101.T) - Japanese FY ending March
  { companyId: 'nyk', type: 'earnings', date: '2026-05-08', quarter: 'Q4' },
  { companyId: 'nyk', type: 'dividend_ex', date: '2026-03-27' },
  { companyId: 'nyk', type: 'dividend_pay', date: '2026-06-01' },
  { companyId: 'nyk', type: 'earnings', date: '2026-08-06', quarter: 'Q1' },
  { companyId: 'nyk', type: 'dividend_ex', date: '2026-09-28' },

  // MOL (9104.T) - Japanese FY ending March
  { companyId: 'mol', type: 'earnings', date: '2026-04-30', quarter: 'Q4' },
  { companyId: 'mol', type: 'dividend_ex', date: '2026-03-27' },
  { companyId: 'mol', type: 'dividend_pay', date: '2026-06-03' },
  { companyId: 'mol', type: 'earnings', date: '2026-08-04', quarter: 'Q1' },
  { companyId: 'mol', type: 'dividend_ex', date: '2026-09-28' },

  // K-Line (9107.T) - Japanese FY ending March
  { companyId: 'kline', type: 'earnings', date: '2026-05-12', quarter: 'Q4' },
  { companyId: 'kline', type: 'dividend_ex', date: '2026-03-27' },
  { companyId: 'kline', type: 'dividend_pay', date: '2026-06-05' },
  { companyId: 'kline', type: 'earnings', date: '2026-08-07', quarter: 'Q1' },
  { companyId: 'kline', type: 'dividend_ex', date: '2026-09-28' },

  // Maersk (MAERSK-B.CO) - Calendar FY
  { companyId: 'maersk', type: 'earnings', date: '2026-04-29', quarter: 'Q1' },
  { companyId: 'maersk', type: 'dividend_ex', date: '2026-03-18' },
  { companyId: 'maersk', type: 'dividend_pay', date: '2026-03-23' },
  { companyId: 'maersk', type: 'earnings', date: '2026-08-05', quarter: 'Q2' },

  // COSCO (1919.HK) - Calendar FY
  { companyId: 'cosco', type: 'earnings', date: '2026-04-28', quarter: 'Q1' },
  { companyId: 'cosco', type: 'dividend_ex', date: '2026-06-18' },
  { companyId: 'cosco', type: 'dividend_pay', date: '2026-07-10' },
  { companyId: 'cosco', type: 'earnings', date: '2026-08-27', quarter: 'Q2' },

  // Evergreen (2603.TW) - Calendar FY
  { companyId: 'evergreen', type: 'earnings', date: '2026-05-15', quarter: 'Q1' },
  { companyId: 'evergreen', type: 'dividend_ex', date: '2026-07-15' },
  { companyId: 'evergreen', type: 'dividend_pay', date: '2026-08-12' },
  { companyId: 'evergreen', type: 'earnings', date: '2026-08-14', quarter: 'Q2' },

  // Hapag-Lloyd (HLAG.DE) - Calendar FY
  { companyId: 'hapag', type: 'earnings', date: '2026-05-14', quarter: 'Q1' },
  { companyId: 'hapag', type: 'dividend_ex', date: '2026-05-22' },
  { companyId: 'hapag', type: 'dividend_pay', date: '2026-05-27' },
  { companyId: 'hapag', type: 'earnings', date: '2026-08-13', quarter: 'Q2' },

  // Yang Ming (2609.TW) - Calendar FY
  { companyId: 'yangming', type: 'earnings', date: '2026-05-11', quarter: 'Q1' },
  { companyId: 'yangming', type: 'dividend_ex', date: '2026-07-20' },
  { companyId: 'yangming', type: 'dividend_pay', date: '2026-08-17' },
  { companyId: 'yangming', type: 'earnings', date: '2026-08-10', quarter: 'Q2' },

  // ZIM (ZIM) - Calendar FY
  { companyId: 'zim', type: 'earnings', date: '2026-05-19', quarter: 'Q1' },
  { companyId: 'zim', type: 'dividend_ex', date: '2026-06-03' },
  { companyId: 'zim', type: 'dividend_pay', date: '2026-06-25' },
  { companyId: 'zim', type: 'earnings', date: '2026-08-18', quarter: 'Q2' },

  // HMM (011200.KS) - Calendar FY
  { companyId: 'hmmarine', type: 'earnings', date: '2026-05-07', quarter: 'Q1' },
  { companyId: 'hmmarine', type: 'dividend_ex', date: '2026-03-30' },
  { companyId: 'hmmarine', type: 'dividend_pay', date: '2026-04-20' },
  { companyId: 'hmmarine', type: 'earnings', date: '2026-08-11', quarter: 'Q2' },
];
