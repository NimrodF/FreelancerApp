import { useState } from 'react';
import { fmt } from '../utils/formatters';
import {
  ANNUAL_PENSION,
  ANNUAL_HISTALMUT,
  INPUT_CONSTRAINTS,
} from '../utils/taxConfig';

const FIELDS = [
  {
    key: 'monthlyInvoice',
    label: 'שכר טרחה חודשי (חשבונית ללקוח)',
    ...INPUT_CONSTRAINTS.monthlyInvoice,
    sliderStep: 1000,
    suffix: '₪',
  },
  {
    key: 'monthlyExpenses',
    label: 'הוצאות מוכרות חודשיות',
    ...INPUT_CONSTRAINTS.monthlyExpenses,
    sliderStep: 500,
    suffix: '₪',
  },
  {
    key: 'creditPointsFreelancer',
    label: 'נקודות זיכוי עצמאי',
    ...INPUT_CONSTRAINTS.creditPointsFreelancer,
    sliderStep: 0.25,
    suffix: '',
    decimal: true,
  },
  {
    key: 'spouseGrossSalary',
    label: 'שכר בת/בן זוג (ברוטו)',
    ...INPUT_CONSTRAINTS.spouseGrossSalary,
    sliderStep: 500,
    suffix: '₪',
  },
  {
    key: 'creditPointsSpouse',
    label: "נק' זיכוי בת/בן זוג",
    ...INPUT_CONSTRAINTS.creditPointsSpouse,
    sliderStep: 0.25,
    suffix: '',
    decimal: true,
  },
  {
    key: 'spouseMicroBizIncome',
    label: 'הכנסות עוסק זעיר',
    ...INPUT_CONSTRAINTS.spouseMicroBizIncome,
    sliderStep: 100,
    suffix: '₪',
  },
];

const FIXED_VALUES = [
  {
    label: 'הפקדה שנתית לפנסיה',
    value: ANNUAL_PENSION,
    suffix: '₪',
    note: 'מקסימום הטבת מס',
  },
  {
    label: 'הפקדה שנתית לקרן השתלמות',
    value: ANNUAL_HISTALMUT,
    suffix: '₪',
    note: 'מקסימום הטבת מס',
  },
];

function FormattedInput({ field, value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const displayValue = editing
    ? draft
    : field.decimal ? String(value) : fmt(value);

  const handleFocus = () => {
    setDraft(String(value));
    setEditing(true);
  };

  const handleBlur = () => {
    onChange(field.key, draft);
    setEditing(false);
  };

  const handleChange = (e) => {
    setDraft(e.target.value);
  };

  return (
    <input
      type='text'
      inputMode='decimal'
      value={displayValue}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      className='input-number'
    />
  );
}

export default function InputPanel({ inputs, onChange }) {
  return (
    <div className='input-panel'>
      <h2>נתוני קלט</h2>
      <p className='input-hint'>הזן נתונים - החישוב יתעדכן אוטומטית</p>
      {FIELDS.map((f) => (
        <div key={f.key} className='input-group'>
          <label>{f.label}</label>
          <div className='input-row'>
            <input
              type='range'
              min={f.min}
              max={f.max}
              step={f.sliderStep}
              value={inputs[f.key]}
              onChange={(e) => onChange(f.key, Number(e.target.value))}
            />
            <div className='input-value-wrap'>
              <FormattedInput field={f} value={inputs[f.key]} onChange={onChange} />
              {f.suffix && <span className='input-suffix'>{f.suffix}</span>}
            </div>
          </div>
        </div>
      ))}
      <div className='fixed-values-section'>
        <h3>ערכים קבועים (מקסימום הטבות מס)</h3>
        {FIXED_VALUES.map((f) => (
          <div key={f.label} className='fixed-value-row'>
            <span className='fixed-label'>{f.label}</span>
            <span className='fixed-amount'>
              {f.suffix} {fmt(f.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
