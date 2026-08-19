import React, {
    useState,
    useCallback,
    useEffect,
} from 'react';
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
// filterParams: { type: 'number' }
const isNumericColumn = (colDef) =>
    colDef?.filterParams?.type === 'number';

const newCondition = (joiner, numeric) =>
    numeric
        ? {
              operator: 'equals',
              value: '',
              valueTo: '',
              joiner,
          }
        : {
              operator: 'contains',
              value: '',
              joiner,
          };

// Strips currency symbols / commas / etc.
// Example: "₹1,20,000" -> 120000
function parseNumeric(raw) {
    if (
        raw === null ||
        raw === undefined ||
        raw === ''
    ) {
        return null;
    }

    if (typeof raw === 'number') {
        return raw;
    }

    const cleaned = String(raw).replace(
        /[^0-9.-]/g,
        ''
    );

    if (
        cleaned === '' ||
        isNaN(cleaned)
    ) {
        return null;
    }

    return Number(cleaned);
}

function evaluateText(cellValue, condition) {
    const cell = (cellValue ?? '')
        .toString()
        .toLowerCase();

    const val = (condition.value ?? '')
        .toString()
        .toLowerCase();

    switch (condition.operator) {
        case 'contains':
            return cell.includes(val);

        case 'notContains':
            return !cell.includes(val);

        case 'equals':
            return cell === val;

        case 'notEqual':
            return cell !== val;

        case 'startsWith':
            return cell.startsWith(val);

        case 'endsWith':
            return cell.endsWith(val);

        case 'blank':
            return cell === '';

        case 'notBlank':
            return cell !== '';

        default:
            return true;
    }
}

function evaluateNumber(cellValue, condition) {
    if (condition.operator === 'blank') {
        return (
            cellValue === null ||
            cellValue === undefined ||
            cellValue === ''
        );
    }

    if (condition.operator === 'notBlank') {
        return !(
            cellValue === null ||
            cellValue === undefined ||
            cellValue === ''
        );
    }

    const cellNum = parseNumeric(cellValue);
    const val = parseFloat(condition.value);

    if (
        cellNum === null ||
        isNaN(val)
    ) {
        return false;
    }

    switch (condition.operator) {
        case 'equals':
            return cellNum === val;

        case 'notEqual':
            return cellNum !== val;

        case 'greaterThan':
            return cellNum > val;

        case 'greaterThanOrEqual':
            return cellNum >= val;

        case 'lessThan':
            return cellNum < val;

        case 'lessThanOrEqual':
            return cellNum <= val;

        case 'inRange': {
            const valTo = parseFloat(
                condition.valueTo
            );

            if (isNaN(valTo)) {
                return cellNum >= val;
            }

            const lo = Math.min(
                val,
                valTo
            );

            const hi = Math.max(
                val,
                valTo
            );

            return (
                cellNum >= lo &&
                cellNum <= hi
            );
        }

        default:
            return true;
    }
}

const isConditionUsable = (
    condition,
    numeric
) => {
    if (
        NO_VALUE_OPERATORS.includes(
            condition.operator
        )
    ) {
        return true;
    }

    if (
        numeric &&
        condition.operator === 'inRange'
    ) {
        return (
            (condition.value ?? '') !== '' ||
            (condition.valueTo ?? '') !== ''
        );
    }

    return (
        (condition.value ?? '') !== ''
    );
};

export default function MultiConditionTextFilter({
    model,
    onModelChange,
    colDef,
    valueGetter,
}) {
    const numeric = isNumericColumn(colDef);

    const isStatusFilter =
        colDef?.filterParams?.type === 'status';

    const OPERATORS = numeric
        ? NUMBER_OPERATORS
        : TEXT_OPERATORS;

    const evaluate = numeric
        ? evaluateNumber
        : evaluateText;

    // =========================================================
    // NORMAL FILTER CONDITIONS
    // =========================================================

    const [conditions, setConditions] =
        useState(
            model?.conditions ??
                [
                    newCondition(
                        null,
                        numeric
                    ),
                    newCondition(
                        'AND',
                        numeric
                    ),
                ]
        );

    // =========================================================
    // STATUS FILTER
    // =========================================================

    const [selectedStatuses, setSelectedStatuses] =
        useState(
            model?.values ?? []
        );

    const [statusSearch, setStatusSearch] =
        useState('');

    // =========================================================
    // Sync model -> local state
    // =========================================================

    useEffect(() => {
        if (isStatusFilter) {
            setSelectedStatuses(
                model?.values ?? []
            );
        } else {
            setConditions(
                model?.conditions ??
                    [
                        newCondition(
                            null,
                            numeric
                        ),
                        newCondition(
                            'AND',
                            numeric
                        ),
                    ]
            );
        }
    }, [
        model,
        isStatusFilter,
        numeric,
    ]);

    // =========================================================
    // FILTER PASS
    // =========================================================

    const doesFilterPass = useCallback(
        (params) => {
            // =================================================
            // STATUS CHECKBOX FILTER
            // =================================================

            if (isStatusFilter) {
                // No selected status means no filter
                if (
                    selectedStatuses.length === 0
                ) {
                    return true;
                }

                const field =
                    colDef.field;

                const cellValue =
                    valueGetter
                        ? valueGetter(params)
                        : params.data?.[field];

                return selectedStatuses.includes(
                    cellValue
                );
            }

            // =================================================
            // NORMAL FILTER
            // =================================================

            const field =
                colDef.field;

            const cellValue =
                valueGetter
                    ? valueGetter(params)
                    : params.data?.[field];

            const active =
                conditions.filter(
                    (condition) =>
                        isConditionUsable(
                            condition,
                            numeric
                        )
                );

            if (
                active.length === 0
            ) {
                return true;
            }

            let result = evaluate(
                cellValue,
                active[0]
            );

            for (
                let i = 1;
                i < active.length;
                i++
            ) {
                const pass =
                    evaluate(
                        cellValue,
                        active[i]
                    );

                result =
                    active[i].joiner ===
                    'OR'
                        ? result || pass
                        : result && pass;
            }

            return result;
        },
        [
            isStatusFilter,
            selectedStatuses,
            conditions,
            colDef,
            valueGetter,
            numeric,
            evaluate,
        ]
    );

    // =========================================================
    // IS FILTER ACTIVE
    // =========================================================

    const isFilterActive =
        useCallback(() => {
            // Status filter
            if (isStatusFilter) {
                return (
                    selectedStatuses.length >
                    0
                );
            }

            // Normal filter
            return conditions.some(
                (condition) =>
                    isConditionUsable(
                        condition,
                        numeric
                    )
            );
        }, [
            isStatusFilter,
            selectedStatuses,
            conditions,
            numeric,
        ]);

    // Register filter lifecycle
    useGridFilter({
        doesFilterPass,
        isFilterActive,
    });

    // =========================================================
    // NORMAL FILTER MODEL CHANGE
    // =========================================================

    useEffect(() => {
        // VERY IMPORTANT:
        // Do NOT update the normal conditions model
        // when this is a status filter.

        if (isStatusFilter) {
            return;
        }

        const active =
            conditions.some(
                (condition) =>
                    isConditionUsable(
                        condition,
                        numeric
                    )
            );

        onModelChange(
            active
                ? {
                      conditions,
                  }
                : null
        );
    }, [
        conditions,
        numeric,
        isStatusFilter,
        onModelChange,
    ]);

    // =========================================================
    // UPDATE NORMAL CONDITION
    // =========================================================

    const updateCondition = (
        index,
        key,
        value
    ) => {
        setConditions((prev) => {
            const next = [...prev];

            next[index] = {
                ...next[index],
                [key]: value,
            };

            return next;
        });
    };

    // =========================================================
    // RESET NORMAL FILTER
    // =========================================================

    const resetConditions = () => {
        setConditions([
            newCondition(
                null,
                numeric
            ),
            newCondition(
                'AND',
                numeric
            ),
        ]);

        onModelChange(null);
    };

    // =========================================================
    // ADD NORMAL CONDITION
    // =========================================================

    const addCondition = () =>
        setConditions((prev) => [
            ...prev,
            newCondition(
                'AND',
                numeric
            ),
        ]);

    // =========================================================
    // REMOVE NORMAL CONDITION
    // =========================================================

    const removeCondition = (
        index
    ) => {
        setConditions((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );
    };

    // =========================================================
    // STATUS LIST
    // =========================================================

    if (isStatusFilter) {
        const statusList =
            colDef?.filterParams?.list ||
            [];

        const allStatuses =
            statusList.map(
                (item) => item.data
            );

        const filteredStatusList =
            statusList.filter((item) =>
                String(
                    item.data ?? ''
                )
                    .toLowerCase()
                    .includes(
                        statusSearch.toLowerCase()
                    )
            );

        const isAllSelected =
            allStatuses.length > 0 &&
            allStatuses.every(
                (status) =>
                    selectedStatuses.includes(
                        status
                    )
            );

        // =====================================================
        // TOGGLE STATUS
        // =====================================================

        const toggleStatus = (
            status
        ) => {
            setSelectedStatuses(
                (prev) => {
                    let nextValues;

                    if (
                        prev.includes(
                            status
                        )
                    ) {
                        nextValues =
                            prev.filter(
                                (value) =>
                                    value !==
                                    status
                            );
                    } else {
                        nextValues = [
                            ...prev,
                            status,
                        ];
                    }

                    // Immediately update AG Grid
                    onModelChange(
                        nextValues.length >
                            0
                            ? {
                                  values:
                                      nextValues,
                              }
                            : null
                    );

                    return nextValues;
                }
            );
        };

        // =====================================================
        // SELECT ALL
        // =====================================================

        const selectAll = () => {
            setSelectedStatuses(
                allStatuses
            );

            onModelChange({
                values: allStatuses,
            });
        };

        // =====================================================
        // CLEAR
        // =====================================================

        const clearAll = () => {
            setSelectedStatuses([]);

            onModelChange(null);
        };

        return (
            <div
                style={{
                    padding: 12,
                    width: 300,
                    boxSizing:
                        'border-box',
                    display: 'flex',
                    flexDirection:
                        'column',
                    gap: 10,
                }}
            >
                {/* ==========================================
                    HEADER
                ========================================== */}

                <div
                    style={{
                        display: 'flex',
                        justifyContent:
                            'space-between',
                        alignItems:
                            'center',
                        paddingBottom: 8,
                        borderBottom:
                            '1px solid #ddd',
                    }}
                >
                    <button
                        type="button"
                        onClick={
                            selectAll
                        }
                        disabled={
                            isAllSelected
                        }
                        style={{
                            border: 'none',
                            background:
                                'none',
                            color:
                                isAllSelected
                                    ? '#999'
                                    : '#1677ff',
                            textDecoration:
                                'underline',
                            cursor:
                                isAllSelected
                                    ? 'default'
                                    : 'pointer',
                            padding: 0,
                            fontSize: 14,
                        }}
                    >
                        Select all{' '}
                        {
                            allStatuses.length
                        }
                    </button>

                    <button
                        type="button"
                        onClick={
                            clearAll
                        }
                        style={{
                            border: 'none',
                            background:
                                'none',
                            color: '#1677ff',
                            textDecoration:
                                'underline',
                            cursor:
                                'pointer',
                            padding: 0,
                            fontSize: 14,
                        }}
                    >
                        Clear
                    </button>
                </div>

                {/* ==========================================
                    SEARCH
                ========================================== */}

                <input
                    type="text"
                    value={
                        statusSearch
                    }
                    placeholder="Search..."
                    onChange={(e) =>
                        setStatusSearch(
                            e.target.value
                        )
                    }
                    style={{
                        width: '100%',
                        height: 38,
                        padding:
                            '6px 10px',
                        border:
                            '1px solid #d9d9d9',
                        borderRadius: 6,
                        outline: 'none',
                        boxSizing:
                            'border-box',
                        fontSize: 14,
                    }}
                />

                {/* ==========================================
                    STATUS CHECKBOXES
                ========================================== */}

                <div
                    style={{
                        display: 'flex',
                        flexDirection:
                            'column',
                        gap: 12,
                        maxHeight: 220,
                        overflowY:
                            'auto',
                        paddingRight: 4,
                    }}
                >
                    {filteredStatusList.map(
                        (
                            item,
                            index
                        ) => {
                            const status =
                                item.data;

                            const checked =
                                selectedStatuses.includes(
                                    status
                                );

                            return (
                                <label
                                    key={`${status}-${index}`}
                                    style={{
                                        display:
                                            'flex',
                                        alignItems:
                                            'center',
                                        gap: 10,
                                        cursor:
                                            'pointer',
                                        fontSize: 15,
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={
                                            checked
                                        }
                                        onChange={() =>
                                            toggleStatus(
                                                status
                                            )
                                        }
                                        style={{
                                            width: 16,
                                            height: 16,
                                            cursor:
                                                'pointer',
                                            margin: 0,
                                        }}
                                    />

                                    <span>
                                        {
                                            status
                                        }
                                    </span>
                                </label>
                            );
                        }
                    )}
                </div>
            </div>
        );
    }

    // =========================================================
    // NORMAL FILTER UI
    // =========================================================

    return (
        <div
            style={{
                padding: 12,
                width: 260,
                display: 'flex',
                flexDirection:
                    'column',
                gap: 10,
            }}
        >
            {conditions.map(
                (cond, i) => (
                    <div key={i}>
                        {/* ==================================
                            AND / OR
                        ================================== */}

                        {i > 0 && (
                            <div
                                style={{
                                    display:
                                        'flex',
                                    justifyContent:
                                        'center',
                                    gap: 16,
                                    margin:
                                        '8px 0',
                                }}
                            >
                                <label
                                    style={{
                                        display:
                                            'flex',
                                        alignItems:
                                            'center',
                                        gap: 4,
                                        fontSize: 13,
                                    }}
                                >
                                    <input
                                        type="radio"
                                        checked={
                                            cond.joiner ===
                                            'AND'
                                        }
                                        onChange={() =>
                                            updateCondition(
                                                i,
                                                'joiner',
                                                'AND'
                                            )
                                        }
                                    />

                                    AND
                                </label>

                                <label
                                    style={{
                                        display:
                                            'flex',
                                        alignItems:
                                            'center',
                                        gap: 4,
                                        fontSize: 13,
                                    }}
                                >
                                    <input
                                        type="radio"
                                        checked={
                                            cond.joiner ===
                                            'OR'
                                        }
                                        onChange={() =>
                                            updateCondition(
                                                i,
                                                'joiner',
                                                'OR'
                                            )
                                        }
                                    />

                                    OR
                                </label>
                            </div>
                        )}

                        {/* ==================================
                            OPERATOR
                        ================================== */}

                        <div
                            style={{
                                display:
                                    'flex',
                                gap: 6,
                                alignItems:
                                    'center',
                            }}
                        >
                            <select
                                value={
                                    cond.operator
                                }
                                onChange={(
                                    e
                                ) =>
                                    updateCondition(
                                        i,
                                        'operator',
                                        e
                                            .target
                                            .value
                                    )
                                }
                                style={{
                                    flex: 1,
                                    padding:
                                        '6px 8px',
                                    borderRadius: 6,
                                    border:
                                        '1px solid #ddd',
                                }}
                            >
                                {OPERATORS.map(
                                    (op) => (
                                        <option
                                            key={
                                                op.value
                                            }
                                            value={
                                                op.value
                                            }
                                        >
                                            {
                                                op.label
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            {/* Remove */}
                            {conditions.length >
                                1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        removeCondition(
                                            i
                                        )
                                    }
                                    title="Remove condition"
                                    style={{
                                        border:
                                            'none',
                                        background:
                                            'none',
                                        cursor:
                                            'pointer',
                                        color:
                                            '#999',
                                        fontSize: 16,
                                    }}
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* ==================================
                            VALUE
                        ================================== */}

                        {!NO_VALUE_OPERATORS.includes(
                            cond.operator
                        ) &&
                            (numeric ? (
                                cond.operator ===
                                'inRange' ? (
                                    <div
                                        style={{
                                            display:
                                                'flex',
                                            gap: 6,
                                            marginTop:
                                                6,
                                        }}
                                    >
                                        <input
                                            type="number"
                                            value={
                                                cond.value
                                            }
                                            placeholder="From..."
                                            onChange={(
                                                e
                                            ) =>
                                                updateCondition(
                                                    i,
                                                    'value',
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            style={{
                                                width:
                                                    '100%',
                                                padding:
                                                    '6px 8px',
                                                borderRadius: 6,
                                                border:
                                                    '1px solid #ddd',
                                                boxSizing:
                                                    'border-box',
                                            }}
                                        />

                                        <input
                                            type="number"
                                            value={
                                                cond.valueTo
                                            }
                                            placeholder="To..."
                                            onChange={(
                                                e
                                            ) =>
                                                updateCondition(
                                                    i,
                                                    'valueTo',
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            style={{
                                                width:
                                                    '100%',
                                                padding:
                                                    '6px 8px',
                                                borderRadius: 6,
                                                border:
                                                    '1px solid #ddd',
                                                boxSizing:
                                                    'border-box',
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type="number"
                                        value={
                                            cond.value
                                        }
                                        placeholder="Filter value..."
                                        onChange={(
                                            e
                                        ) =>
                                            updateCondition(
                                                i,
                                                'value',
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        style={{
                                            width:
                                                '100%',
                                            padding:
                                                '6px 8px',
                                            marginTop:
                                                6,
                                            borderRadius: 6,
                                            border:
                                                '1px solid #ddd',
                                            boxSizing:
                                                'border-box',
                                        }}
                                    />
                                )
                            ) : (
                                <input
                                    type="text"
                                    value={
                                        cond.value
                                    }
                                    placeholder="Filter value..."
                                    onChange={(
                                        e
                                    ) =>
                                        updateCondition(
                                            i,
                                            'value',
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    style={{
                                        width:
                                            '100%',
                                        padding:
                                            '6px 8px',
                                        marginTop:
                                            6,
                                        borderRadius: 6,
                                        border:
                                            '1px solid #ddd',
                                        boxSizing:
                                            'border-box',
                                    }}
                                />
                            ))}
                    </div>
                )
            )}

            {/* ==============================================
                ACTIONS
            ============================================== */}

            <div
                style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 4,
                }}
            >
                <button
                    type="button"
                    onClick={
                        addCondition
                    }
                    style={{
                        flex: 1,
                        padding:
                            '6px 10px',
                        border:
                            '1px dashed #bbb',
                        borderRadius: 6,
                        background:
                            '#fafafa',
                        cursor:
                            'pointer',
                        fontSize: 13,
                    }}
                >
                    + Add condition
                </button>

                <button
                    type="button"
                    onClick={
                        resetConditions
                    }
                    style={{
                        padding:
                            '6px 10px',
                        border:
                            '1px solid #ddd',
                        borderRadius: 6,
                        background:
                            '#fff',
                        cursor:
                            'pointer',
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