import { fmt } from '../utils/formatters';

const rows = [
  { key: 'annualInvoice', label: 'הכנסה מחשבוניות', type: 'income' },
  { key: 'microBizAnnual', label: 'הכנסה מעסק זעיר', type: 'income' },
  { key: 'totalIncomeTax', label: 'מס הכנסה', type: 'expense' },
  { key: 'totalNI', label: 'ביטוח לאומי + בריאות', type: 'expense' },
  { key: 'totalHistalmut', label: 'קרנות השתלמות', type: 'saving' },
  { key: 'totalPensions', label: 'פנסיות', type: 'saving' },
  { key: 'netForLiving', label: 'נטו "לחיים"', type: 'total' },
  { key: 'netEconomic', label: 'נטו כלכלי', type: 'total-alt' },
];

export default function BreakdownTable({ results }) {
  return (
    <div className="breakdown-section">
      <h2>סיכום שנתי</h2>
      <table className="breakdown-table">
        <thead>
          <tr>
            <th>רכיב</th>
            <th>שנתי (₪)</th>
            <th>חודשי (₪)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.key} className={`row-${r.type}`}>
              <td>{r.label}</td>
              <td>{fmt(results[r.key])}</td>
              <td>{fmt(results[r.key] / 12)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
