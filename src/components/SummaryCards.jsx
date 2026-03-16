import { fmt } from '../utils/formatters';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Shield, Heart } from 'lucide-react';

const cards = [
  { key: 'monthlyNetForLiving', label: 'נטו חודשי "לחיים"', icon: Wallet, color: '#10b981', highlight: true, tooltip: 'הכנסה נטו לאחר כל המסים, ביטוח לאומי, פנסיות וקרנות השתלמות - הסכום שנשאר לחיים' },
  { key: 'monthlyNetEconomic', label: 'נטו כלכלי חודשי', icon: TrendingUp, color: '#3b82f6', tooltip: 'הכנסה נטו לאחר מסים וביטוח לאומי בלבד - פנסיה וקרן השתלמות נחשבות חיסכון ולא הוצאה' },
  { key: 'monthlyIncomeTax', label: 'סה"כ מס הכנסה חודשי', icon: TrendingDown, color: '#ef4444', tooltip: 'כולל מס הכנסה עבור כל התא המשפחתי (עצמאי + בת/בן זוג)' },
  { key: 'monthlyNI', label: 'סה"כ ביטוח לאומי + בריאות', icon: Shield, color: '#f59e0b', tooltip: 'כולל ביטוח לאומי ובריאות עבור כל התא המשפחתי (עצמאי + בת/בן זוג)' },
  { key: 'spouseNetMonthly', label: 'נטו בת/בן זוג', icon: Heart, color: '#ec4899' },
];

export default function SummaryCards({ results }) {
  return (
    <div className="summary-cards">
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <div key={c.key} className={`card ${c.highlight ? 'card-highlight' : ''}`} title={c.tooltip || ''}>
            <div className="card-icon" style={{ background: c.color + '20', color: c.color }}>
              <Icon size={22} />
            </div>
            <div className="card-content">
              <span className="card-label">{c.label}</span>
              <span className="card-value" style={{ color: c.color }}>₪ {fmt(results[c.key])}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
