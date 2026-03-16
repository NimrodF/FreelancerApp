import { useMemo, useState } from 'react';
import { generateSensitivityData } from '../utils/taxEngine';
import { fmt } from '../utils/formatters';

const invoiceRange = Array.from({ length: 15 }, (_, i) => 35000 + i * 2500);
const spouseRange = Array.from({ length: 13 }, (_, i) => 10000 + i * 500);

function getColor(value, min, max) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  const r = Math.round(220 - t * 210);
  const g = Math.round(40 + t * 190);
  const b = Math.round(40 + t * 80);
  return `rgb(${r},${g},${b})`;
}

export default function Heatmap({ inputs }) {
  const [highlightMax, setHighlightMax] = useState(false);

  const { data, min, max, rowMaxCols } = useMemo(() => {
    const d = generateSensitivityData(inputs, invoiceRange, spouseRange);
    const monthly = d.map(row => {
      const mRow = { invoice: row.invoice };
      spouseRange.forEach(s => { mRow[`s${s}`] = Math.round(row[`s${s}`] / 12); });
      return mRow;
    });
    let mn = Infinity, mx = -Infinity;
    const maxCols = {};
    monthly.forEach(row => {
      let rowMax = -Infinity, rowMaxCol = null;
      spouseRange.forEach(s => {
        const v = row[`s${s}`];
        if (v < mn) mn = v;
        if (v > mx) mx = v;
        if (v > rowMax) { rowMax = v; rowMaxCol = s; }
      });
      maxCols[row.invoice] = rowMaxCol;
    });
    return { data: monthly, min: mn, max: mx, rowMaxCols: maxCols };
  }, [inputs]);

  return (
    <div className="heatmap-section">
      <h2>מפת רגישות - נטו "לחיים" חודשי</h2>
      <p className="heatmap-subtitle">חשבונית חודשית × שכר בת/בן זוג</p>
      <label className="heatmap-toggle">
        <input type="checkbox" checked={highlightMax} onChange={e => setHighlightMax(e.target.checked)} />
        <span className="ios-toggle" />
        <span>הדגש נטו מקסימלי בכל שורה</span>
      </label>
      <div className="heatmap-scroll">
        <table className="heatmap-table">
          <thead>
            <tr>
              <th>חשבונית ↓ / שכר →</th>
              {spouseRange.map(s => <th key={s}>{fmt(s)}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.invoice}>
                <td className="heatmap-row-label">{fmt(row.invoice)}</td>
                {spouseRange.map(s => {
                  const v = row[`s${s}`];
                  const isRowMax = highlightMax && rowMaxCols[row.invoice] === s;
                  return (
                    <td
                      key={s}
                      style={{ background: getColor(v, min, max), color: v > (min + max) / 2 ? '#fff' : '#1a1a2e' }}
                      className={`heatmap-cell${isRowMax ? ' heatmap-cell-max' : ''}`}
                    >
                      {fmt(v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="heatmap-legend">
        <span>₪ {fmt(min)}</span>
        <div className="heatmap-gradient" />
        <span>₪ {fmt(max)}</span>
      </div>
    </div>
  );
}
