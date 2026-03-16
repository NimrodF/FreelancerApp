import { useState } from 'react';
import { fmt } from '../utils/formatters';
import { TAX_BRACKETS, NI_FREELANCER, NI_EMPLOYEE, TAX_YEAR } from '../utils/taxConfig';

// Derive display data from config constants
const incomeTaxBrackets = TAX_BRACKETS.map((b, i) => {
  const prevLimit = i === 0 ? 0 : TAX_BRACKETS[i - 1].limit;
  const range = b.limit === Infinity
    ? `${fmt(prevLimit + 1)}+`
    : i === 0
      ? `עד ${fmt(b.limit)}`
      : `${fmt(prevLimit + 1)} - ${fmt(b.limit)}`;
  return { range, rate: `${(b.rate * 100).toFixed(0)}%`, limit: b.limit };
});

const niFreelancerBrackets = [
  {
    range: `עד ${fmt(NI_FREELANCER.threshold1)} (60% מהשכר הממוצע)`,
    rateNI: `${(NI_FREELANCER.rateNI_low * 100).toFixed(2)}%`,
    rateHealth: `${(NI_FREELANCER.rateHealth_low * 100).toFixed(2)}%`,
    rateTotal: `${((NI_FREELANCER.rateNI_low + NI_FREELANCER.rateHealth_low) * 100).toFixed(2)}%`,
  },
  {
    range: `${fmt(NI_FREELANCER.threshold1 + 1)} - ${fmt(NI_FREELANCER.maxNI)}`,
    rateNI: `${(NI_FREELANCER.rateNI_high * 100).toFixed(2)}%`,
    rateHealth: `${(NI_FREELANCER.rateHealth_high * 100).toFixed(2)}%`,
    rateTotal: `${((NI_FREELANCER.rateNI_high + NI_FREELANCER.rateHealth_high) * 100).toFixed(2)}%`,
  },
];

const niEmployeeBrackets = [
  {
    range: `עד ${fmt(NI_EMPLOYEE.threshold1_monthly)} (חודשי)`,
    rateEmployee: `${(NI_EMPLOYEE.employeeNI_low * 100).toFixed(2)}%`,
    rateEmployer: `${(NI_EMPLOYEE.employerNI_low * 100).toFixed(2)}%`,
    rateTotal: `${((NI_EMPLOYEE.employeeNI_low + NI_EMPLOYEE.employerNI_low) * 100).toFixed(2)}%`,
  },
  {
    range: `${fmt(NI_EMPLOYEE.threshold1_monthly + 1)} - ${fmt(NI_EMPLOYEE.threshold2_monthly)} (חודשי)`,
    rateEmployee: `${(NI_EMPLOYEE.employeeNI_high * 100).toFixed(2)}%`,
    rateEmployer: `${(NI_EMPLOYEE.employerNI_high * 100).toFixed(2)}%`,
    rateTotal: `${((NI_EMPLOYEE.employeeNI_high + NI_EMPLOYEE.employerNI_high) * 100).toFixed(2)}%`,
  },
];

export default function TaxBrackets({ taxableIncome }) {
  const [subTab, setSubTab] = useState('income');
  const limits = TAX_BRACKETS.map(b => b.limit);

  const subTabs = [
    { id: 'income', label: 'מס הכנסה' },
    { id: 'ni', label: 'ביטוח לאומי' },
  ];

  return (
    <div className="brackets-section">
      <nav className="brackets-tabs">
        {subTabs.map(t => (
          <button
            key={t.id}
            className={`brackets-tab ${subTab === t.id ? 'brackets-tab-active' : ''}`}
            onClick={() => setSubTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {subTab === 'income' && (
        <>
          <h3>מדרגות מס הכנסה {TAX_YEAR}</h3>
          <div className="brackets-visual">
            {incomeTaxBrackets.map((b, i) => {
              const active = taxableIncome > (i === 0 ? 0 : limits[i - 1]);
              return (
                <div key={i} className={`bracket ${active ? 'bracket-active' : ''}`}>
                  <span className="bracket-rate">{b.rate}</span>
                  <span className="bracket-range">{b.range}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {subTab === 'ni' && (
        <>
          <h3>ביטוח לאומי + בריאות - עצמאי (שנתי)</h3>
          <table className="ni-brackets-table">
            <thead>
              <tr>
                <th>טווח הכנסה</th>
                <th>ביטוח לאומי</th>
                <th>ביטוח בריאות</th>
                <th>סה"כ</th>
              </tr>
            </thead>
            <tbody>
              {niFreelancerBrackets.map((b, i) => (
                <tr key={i}>
                  <td>{b.range}</td>
                  <td>{b.rateNI}</td>
                  <td>{b.rateHealth}</td>
                  <td className="ni-total">{b.rateTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: 32 }}>ביטוח לאומי - שכיר (חודשי)</h3>
          <table className="ni-brackets-table">
            <thead>
              <tr>
                <th>טווח שכר</th>
                <th>עובד</th>
                <th>מעסיק</th>
                <th>סה"כ</th>
              </tr>
            </thead>
            <tbody>
              {niEmployeeBrackets.map((b, i) => (
                <tr key={i}>
                  <td>{b.range}</td>
                  <td>{b.rateEmployee}</td>
                  <td>{b.rateEmployer}</td>
                  <td className="ni-total">{b.rateTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
