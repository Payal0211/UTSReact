import React, { useState } from 'react';
import { Select } from 'antd';
import moment from 'moment';
import { HTTPStatusCode } from 'constants/network';
import { TaDashboardDAO } from 'core/taDashboard/taDashboardDRO';
import stylesOBj from './scrumStructure.module.css';

const { Option } = Select;

/**
 * ag-Grid cellRenderer for the "Status" column.
 * All app-level state/callbacks are read from props.context (set on <AgGridReact context={...} />)
 * so this stays a pure, reusable renderer instead of a closure defined inline on every render.
 */
function TaskStatusCell(props) {
    const { value, data } = props;
    const {
        filtersList,
        selectedHead,
        targetValue,
        startDate,
        updateTARowValue,
        getRowIndex,
        setShowProfileTarget,
        setStartTargetDate,
        setProfileTargetDetails,
        setGoalList,
        setTargetValue,
        setLoadingTalentProfile,
    } = props.context;

    const [localValue, setLocalValue] = useState(value ?? '');
    const colorCode =
        filtersList?.TaskStatus?.find((v) => v.data === localValue)?.colorCode ?? '';

    return (
        <div className={stylesOBj.tableSelectField} onClick={(e) => e.stopPropagation()}>
            <Select
                defaultValue={localValue}
                size="small"
                style={{ color: colorCode, width: '130px' }}
                onChange={async (val) => {
                    const index = getRowIndex(data);

                    if (localValue === 'Fasttrack' && val !== 'Fasttrack') {
                        const pl = {
                            task_ID: data?.id,
                            tA_Head_UserID: selectedHead,
                            tA_UserID: data?.tA_UserID,
                            target_StageID: 1,
                            target_Number: targetValue,
                            target_Date: moment(startDate).format('YYYY-MM-DD'),
                            IsStatusChangedToSlow: true,
                        };
                        setLoadingTalentProfile(true);
                        const response = await TaDashboardDAO.insertProfileShearedTargetDAO(pl);
                        setLoadingTalentProfile(false);
                        if (response.statusCode === HTTPStatusCode.OK) {
                            setGoalList(response.responseBody);
                            setTargetValue(5);
                            setStartTargetDate(new Date());
                        }
                    }

                    setLocalValue(val);
                    const valobj = filtersList?.TaskStatus?.find((i) => i.data === val);

                    if (val === 'Fasttrack') {
                        setShowProfileTarget(true);
                        setStartTargetDate(startDate);
                        setProfileTargetDetails({ ...data, index });
                        return;
                    }

                    updateTARowValue(valobj, 'task_StatusID', data, index);
                }}
            >
                {filtersList?.TaskStatus?.map((v) => (
                    <Option key={v.data} style={{ color: v.colorCode }} value={v.data}>
                        {v.data}
                    </Option>
                ))}
            </Select>
        </div>
    );
}

export default TaskStatusCell;
