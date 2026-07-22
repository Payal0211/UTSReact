import React, { useState, useCallback, useEffect } from 'react';
import { useGridFilter } from 'ag-grid-react';

const OPERATORS = [
    { value: 'contains', label: 'Contains' },
    { value: 'notContains', label: 'Not contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'notEqual', label: 'Not equal' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
    { value: 'blank', label: 'Blank' },
    { value: 'notBlank', label: 'Not blank' },
];

const newCondition = (joiner) => ({ operator: 'contains', value: '', joiner });

function evaluate(cellValue, condition) {
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

const isConditionUsable = (c) =>
    c.operator === 'blank' || c.operator === 'notBlank' || (c.value ?? '') !== '';

export default function MultiConditionTextFilter({ model, onModelChange, colDef, valueGetter }) {
    const [conditions, setConditions] = useState(
        model?.conditions ?? [newCondition(null), newCondition('AND')]
    );

    // --- Required filter lifecycle methods, registered via the hook ---
    const doesFilterPass = useCallback(
        (params) => {
            const field = colDef.field;
            const cellValue = valueGetter ? valueGetter(params) : params.data[field];

            const active = conditions.filter(isConditionUsable);
            if (active.length === 0) return true;

            let result = evaluate(cellValue, active[0]);
            for (let i = 1; i < active.length; i++) {
                const pass = evaluate(cellValue, active[i]);
                result = active[i].joiner === 'OR' ? (result || pass) : (result && pass);
            }
            return result;
        },
        [conditions, colDef, valueGetter]
    );

    const isFilterActive = useCallback(
        () => conditions.some(isConditionUsable),
        [conditions]
    );

    useGridFilter({ doesFilterPass, isFilterActive });

    // Whenever conditions change, tell AG Grid the model changed —
    // this is the replacement for the old filterChangedCallback().
    useEffect(() => {
        const active = conditions.some(isConditionUsable);
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
    setConditions([newCondition(null), newCondition('AND')]);
};

    const addCondition = () => setConditions((prev) => [...prev, newCondition('AND')]);
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

                    {cond.operator !== 'blank' && cond.operator !== 'notBlank' && (
                        <input
                            type="text"
                            value={cond.value}
                            placeholder="Filter value..."
                            onChange={(e) => updateCondition(i, 'value', e.target.value)}
                            style={{ width: '100%', padding: '6px 8px', marginTop: 6, borderRadius: 6, border: '1px solid #ddd', boxSizing: 'border-box' }}
                        />
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