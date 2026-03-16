import { useState, useMemo } from 'react';
import { Sun, Moon, Calculator } from 'lucide-react';
import { calculate } from './utils/taxEngine';
import { DEFAULT_INPUTS, TAX_YEAR } from './utils/taxConfig';
import { sanitizeInputForKey } from './utils/inputSanitization';
import InputPanel from './components/InputPanel';
import SummaryCards from './components/SummaryCards';
import BreakdownTable from './components/BreakdownTable';
import { IncomeBreakdownPie, GrossBreakdownBars, IncomeBreakdownBars } from './components/Charts';
import Heatmap from './components/Heatmap';
import TaxBrackets from './components/TaxBrackets';
import './App.css';

export default function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [dark, setDark] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  const results = useMemo(() => calculate(inputs), [inputs]);

  const handleChange = (key, value) => {
    setInputs(prev => ({
      ...prev,
      [key]: sanitizeInputForKey(key, value, prev[key]),
    }));
  };

  const tabs = [
    { id: 'summary', label: 'סיכום' },
    { id: 'charts', label: 'גרפים' },
    { id: 'heatmap', label: 'מפת רגישות' },
    { id: 'brackets', label: 'מדרגות מס' },
  ];

  return (
    <div className={`app ${dark ? 'dark' : 'light'}`} dir="rtl">
      <header className="header">
        <div className="header-title">
          <Calculator size={28} />
          <h1>מחשבון עצמאי</h1>
          <span className="badge">{TAX_YEAR}</span>
        </div>
        <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle theme">
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="main">
        <aside className="sidebar">
          <InputPanel inputs={inputs} onChange={handleChange} />
        </aside>

        <section className="content">
          <SummaryCards results={results} />

          <nav className="tabs">
            {tabs.map(t => (
              <button key={t.id} className={`tab ${activeTab === t.id ? 'tab-active' : ''}`} onClick={() => setActiveTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>

          <div className="tab-content">
            {activeTab === 'summary' && <BreakdownTable results={results} />}
            {activeTab === 'charts' && (
              <div className="charts-grid">
                <IncomeBreakdownPie results={results} />
                <GrossBreakdownBars results={results} />
                <IncomeBreakdownBars results={results} />
              </div>
            )}
            {activeTab === 'heatmap' && <Heatmap inputs={inputs} />}
            {activeTab === 'brackets' && <TaxBrackets taxableIncome={results.taxableIncomeAfterDeductions} />}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>מחשבון לצורכי הערכה בלבד - אין לראות בתוצאות ייעוץ מס מקצועי</p>
      </footer>
    </div>
  );
}
