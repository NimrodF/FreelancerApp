export const fmt = (n) => Math.round(n).toLocaleString('he-IL');
export const fmtCurrency = (n) => `₪ ${fmt(n)}`;
export const fmtPercent = (n) => `${(n * 100).toFixed(1)}%`;
