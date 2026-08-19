import React, { useState, useCallback, useEffect } from 'react';
import { useGridFilter } from 'ag-grid-react';

// ---------- Operator sets ----------
const TEXT_OPERATORS = [
    { value: 'contains', label: 'Contains' },
    { value: 'notContains', label: 'Not contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'notEqual', label: 'Not equal' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
    { value: 'blank', label: 'Blank' },
    { value: 'notBlank', label: 'Not blank' },
];

const NUMBER_OPERATORS = [
    { value: 'equals', label: 'Equals' },
    { value: 'notEqual', label: 'Not equal' },
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'greaterThanOrEqual', label: 'Greater than or equal' },
    { value: 'lessThan', label: 'Less than' },
    { value: 'lessThanOrEqual', label: 'Less than or equal' },
    { value: 'inRange', label: 'In range' },
    { value: 'blank', label: 'Blank' },
    { value: 'notBlank', label: 'Not blank' },
];

const NO_VALUE_OPERATORS = ['blank', 'notBlank'];

// A column is treated as numeric when its colDef declares:
//   filterParams: { type: 'number' }
const isNumericColumn = (colDef) => colDef?.filterParams?.type === 'number';

const newCondition = (joiner, numeric) =>
    numeric
        ? { operator: 'equals', value: '', valueTo: '', joiner }
        : { operator: 'contains', value: '', joiner };

// Strips currency symbols / commas / etc so fields like "₹1,20,000" or
// formatted strings still compare correctly as numbers.
function parseNumeric(raw) {
    if (raw === null || raw === undefined || raw === '') return null;
    if (typeof raw === 'number') return raw;
    const cleaned = String(raw).replace(/[^0-9.-]/g, '');
    if (cleaned === '' || isNaN(cleaned)) return null;
    return Number(cleaned);
}

function evaluateText(cellValue, condition) {
    const cell = (cellValue ?? '').toString().toLowerCase();
    const val = (condition.value ?? '').toString().toLowerCase();

    switch (condition.operator) {
        case 'contains': return cell.includes(val);
        case 'notContains': return !cell.includes(val);
        case 'equals': return cell === val;
        case 'notEqual': return cell !== val;
        case 'startsWith': return cell.startsWith(val);
        case 'endsWith': return cell.endsWith(val);
        case 'blank': return cell === '';
        case 'notBlank': return cell !== '';
        default: return true;
    }
}

function evaluateNumber(cellValue, condition) {
    if (condition.operator === 'blank') {
        return cellValue === null || cellValue === undefined || cellValue === '';
    }
    if (condition.operator === 'notBlank') {
        return !(cellValue === null || cellValue === undefined || cellValue === '');
    }

    const cellNum = parseNumeric(cellValue);
    const val = parseFloat(condition.value);
    if (cellNum === null || isNaN(val)) return false;

    switch (condition.operator) {
        case 'equals': return cellNum === val;
        case 'notEqual': return cellNum !== val;
        case 'greaterThan': return cellNum > val;
        case 'greaterThanOrEqual': return cellNum >= val;
        case 'lessThan': return cellNum < val;
        case 'lessThanOrEqual': return cellNum <= val;
        case 'inRange': {
            const valTo = parseFloat(condition.valueTo);
            if (isNaN(valTo)) return cellNum >= val;
            const lo = Math.min(val, valTo);
            const hi = Math.max(val, valTo);
            return cellNum >= lo && cellNum <= hi;
        }
        default: return true;
    }
}

const isConditionUsable = (c, numeric) => {
    if (NO_VALUE_OPERATORS.includes(c.operator)) return true;
    if (numeric && c.operator === 'inRange') {
        return (c.value ?? '') !== '' || (c.valueTo ?? '') !== '';
    }
    return (c.value ?? '') !== '';
};

export default function MultiConditionTextFilter({ model, onModelChange, colDef, valueGetter }) {
//     console.log("FILTER COLUMN:", colDef?.field);
// console.log("FILTER PARAMS:", colDef?.filterParams);
// console.log("NUMERIC:", colDef?.filterParams?.type);

const numeric = isNumericColumn(colDef);
   
    const OPERATORS = numeric ? NUMBER_OPERATORS : TEXT_OPERATORS;
    const evaluate = numeric ? evaluateNumber : evaluateText;

    const [conditions, setConditions] = useState(
        model?.conditions ?? [newCondition(null, numeric), newCondition('AND', numeric)]
    );

    // --- Required filter lifecycle methods, registered via the hook ---
    const doesFilterPass = useCallback(
        (params) => {
            const field = colDef.field;
            const cellValue = valueGetter ? valueGetter(params) : params.data[field];

            const active = conditions.filter((c) => isConditionUsable(c, numeric));
            if (active.length === 0) return true;

            let result = evaluate(cellValue, active[0]);
            for (let i = 1; i < active.length; i++) {
                const pass = evaluate(cellValue, active[i]);
                result = active[i].joiner === 'OR' ? (result || pass) : (result && pass);
            }
            return result;
        },
        [conditions, colDef, valueGetter, numeric, evaluate]
    );

    const isFilterActive = useCallback(
        () => conditions.some((c) => isConditionUsable(c, numeric)),
        [conditions, numeric]
    );

    useGridFilter({ doesFilterPass, isFilterActive });

    // Whenever conditions change, tell AG Grid the model changed —
    // this is the replacement for the old filterChangedCallback().
    useEffect(() => {
        const active = conditions.some((c) => isConditionUsable(c, numeric));
        onModelChange(active ? { conditions } : null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conditions]);

    const updateCondition = (index, key, value) => {
        setConditions((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [key]: value };
            return next;
        });
    };

    const resetConditions = () => {
        setConditions([newCondition(null, numeric), newCondition('AND', numeric)]);
    };

    const addCondition = () => setConditions((prev) => [...prev, newCondition('AND', numeric)]);
    const removeCondition = (index) => setConditions((prev) => prev.filter((_, i) => i !== index));

    return (
        <div style={{ padding: 12, width: 260, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {conditions.map((cond, i) => (
                <div key={i}>
                    {i > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, margin: '8px 0' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                                <input
                                    type="radio"
                                    checked={cond.joiner === 'AND'}
                                    onChange={() => updateCondition(i, 'joiner', 'AND')}
                                />
                                AND
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                                <input
                                    type="radio"
                                    checked={cond.joiner === 'OR'}
                                    onChange={() => updateCondition(i, 'joiner', 'OR')}
                                />
                                OR
                            </label>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <select
                            value={cond.operator}
                            onChange={(e) => updateCondition(i, 'operator', e.target.value)}
                            style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd' }}
                        >
                            {OPERATORS.map((op) => (
                                <option key={op.value} value={op.value}>{op.label}</option>
                            ))}
                        </select>

                        {conditions.length > 1 && (
                            <button
                                onClick={() => removeCondition(i)}
                                title="Remove condition"
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#999', fontSize: 16 }}
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {!NO_VALUE_OPERATORS.includes(cond.operator) && (
                        numeric ? (
                            cond.operator === 'inRange' ? (
                                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                                    <input
                                        type="number"
                                        value={cond.value}
                                        placeholder="From..."
                                        onChange={(e) => updateCondition(i, 'value', e.target.value)}
                                        style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', boxSizing: 'border-box' }}
                                    />
                                    <input
                                        type="number"
                                        value={cond.valueTo}
                                        placeholder="To..."
                                        onChange={(e) => updateCondition(i, 'valueTo', e.target.value)}
                                        style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', boxSizing: 'border-box' }}
                                    />
                                </div>
                            ) : (
                                <input
                                    type="number"
                                    value={cond.value}
                                    placeholder="Filter value..."
                                    onChange={(e) => updateCondition(i, 'value', e.target.value)}
                                    style={{ width: '100%', padding: '6px 8px', marginTop: 6, borderRadius: 6, border: '1px solid #ddd', boxSizing: 'border-box' }}
                                />
                            )
                        ) : (
                            <input
                                type="text"
                                value={cond.value}
                                placeholder="Filter value..."
                                onChange={(e) => updateCondition(i, 'value', e.target.value)}
                                style={{ width: '100%', padding: '6px 8px', marginTop: 6, borderRadius: 6, border: '1px solid #ddd', boxSizing: 'border-box' }}
                            />
                        )
                    )}
                </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                    onClick={addCondition}
                    style={{
                        flex: 1,
                        padding: '6px 10px',
                        border: '1px dashed #bbb',
                        borderRadius: 6,
                        background: '#fafafa',
                        cursor: 'pointer',
                        fontSize: 13,
                    }}
                >
                    + Add condition
                </button>

                <button
                    onClick={resetConditions}
                    style={{
                        padding: '6px 10px',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: '#666',
                    }}
                >
                    Reset
                </button>
            </div>

        </div>
    );
}