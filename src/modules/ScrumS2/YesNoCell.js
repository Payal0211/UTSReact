import React, { useState } from 'react';
import { Select } from 'antd';
import stylesOBj from './scrumStructure.module.css';

const { Option } = Select;

const YES_NO_OPTIONS = [
    { text: 'Yes', value: 'Y' },
    { text: 'No', value: 'N' },
];

/**
 * Generic Yes/No dropdown cell renderer.
 * Which field it edits is passed via colDef.cellRendererParams={ objKey: 'hmAsPOC' }.
 */
function YesNoCell(props) {
    const { value, data, objKey } = props;
    const { updateTARowValue, getRowIndex } = props.context;
    const [localValue, setLocalValue] = useState(value ?? '');

      if (props.node.rowPinned) {
        return "";
            }
    return (
        <div className={stylesOBj.tableSelectField} onClick={(e) => e.stopPropagation()}>
            <Select
                defaultValue={localValue}
                size="small"
                onChange={(val) => {
                    setLocalValue(val);
                    updateTARowValue(val, objKey, data, getRowIndex(data));
                }}
            >
                {YES_NO_OPTIONS.map((v) => (
                    <Option key={v.value} value={v.value}>
                        {v.text}
                    </Option>
                ))}
            </Select>
        </div>
    );
}

export default YesNoCell;
