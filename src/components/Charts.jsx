import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fmt } from '../utils/formatters';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6'];
const LABEL_COLOR = '#e0e0f0';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const total = payload[0].payload?.total;
  const pct = total ? ` (${Math.round((payload[0].value / total) * 100)}%)` : '';
  return (
    <div className="chart-tooltip">
      <p>{payload[0].name}: ₪ {fmt(payload[0].value)}{pct}</p>
    </div>
  );
};

export function IncomeBreakdownPie({ results }) {
  const raw = [
    { name: 'נטו "לחיים"', value: Math.max(results.netForLiving, 0) },
    { name: 'מס הכנסה', value: results.totalIncomeTax },
    { name: 'ביטוח לאומי', value: results.totalNI },
    { name: 'קרנות השתלמות', value: results.totalHistalmut },
    { name: 'פנסיות', value: results.totalPensions },
  ];
  const total = raw.reduce((s, d) => s + d.value, 0);
  const data = raw.map(d => ({ ...d, total }));

  return (
    <div className="chart-container">
      <h3>פילוח הכנסה שנתית</h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius="80%" innerRadius="36%" dataKey="value" label={false} labelLine={false}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={12}
            wrapperStyle={{ paddingTop: 12 }}
            formatter={(value, entry) => {
              const pct = total > 0 ? Math.round((entry.payload.value / total) * 100) : 0;
              return <span style={{ color: LABEL_COLOR, fontSize: 14, fontWeight: 600 }}>{value} {pct}%</span>;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GrossBreakdownBars({ results }) {
  const totalIncome = results.annualInvoice + results.microBizAnnual;
  if (totalIncome <= 0) return null;
  const items = [
    { label: 'נטו "לחיים"', rate: results.netForLiving / totalIncome, color: '#10b981' },
    { label: 'מס הכנסה', rate: results.totalIncomeTax / totalIncome, color: '#ef4444' },
    { label: 'ביטוח לאומי + בריאות', rate: results.totalNI / totalIncome, color: '#f59e0b' },
    { label: 'קרנות השתלמות', rate: results.totalHistalmut / totalIncome, color: '#8b5cf6' },
    { label: 'פנסיות', rate: results.totalPensions / totalIncome, color: '#3b82f6' },
  ];

  return (
    <div className="efficiency-card">
      <h3>חלוקת הכנסה ברוטו (100%)</h3>
      <div className="gauge-bars">
        {items.map(item => (
          <div key={item.label} className="gauge-item">
            <span className="gauge-label">{item.label}</span>
            <div className="gauge-bar">
              <div className="gauge-fill" style={{ width: `${item.rate * 100}%`, background: item.color }} />
            </div>
            <span className="gauge-value">{(item.rate * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IncomeBreakdownBars({ results }) {
  const cash = results.monthlyNetForLiving;
  const pension = results.totalPensions / 12;
  const histalmut = results.totalHistalmut / 12;
  const netEconomic = results.monthlyNetEconomic;

  const segments = [
    { name: 'מזומן (נטו "לחיים")', value: cash, color: '#10b981' },
    { name: 'פנסיות', value: pension, color: '#3b82f6' },
    { name: 'קרנות השתלמות', value: histalmut, color: '#8b5cf6' },
  ];

  return (
    <div className="efficiency-card">
      <h3>נטו כלכלי חודשי - ₪{fmt(Math.round(netEconomic))}</h3>
      <div className="net-breakdown-bar">
        {segments.map(seg => {
          const pct = netEconomic > 0 ? (seg.value / netEconomic * 100) : 0;
          return (
            <div
              key={seg.name}
              className="net-segment"
              style={{ width: `${pct}%`, background: seg.color }}
              title={`${seg.name}: ₪${fmt(Math.round(seg.value))} (${pct.toFixed(1)}%)`}
            />
          );
        })}
      </div>
      <div className="net-breakdown-legend">
        {segments.map(seg => {
          const pct = netEconomic > 0 ? (seg.value / netEconomic * 100).toFixed(1) : 0;
          return (
            <div key={seg.name} className="net-legend-item">
              <span className="net-legend-dot" style={{ background: seg.color }} />
              <span className="net-legend-label">{seg.name}</span>
              <span className="net-legend-value">₪{fmt(Math.round(seg.value))}</span>
              <span className="net-legend-pct">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
