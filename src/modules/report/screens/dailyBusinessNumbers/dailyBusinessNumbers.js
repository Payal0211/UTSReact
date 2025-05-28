import React, { useState } from "react";
import { Table, Card, Typography } from "antd";
import DatePicker from "react-datepicker";
import styles from "./dailyBusinessNumbers.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";

const { Title } = Typography;

export default function DailyBusinessNumbersPage() {
  
    const [monthDate, setMonthDate] = useState(new Date());

    const selectedYear = monthDate.getFullYear();

    const getColumns = () => [
    {
        title: 'Stages',
        dataIndex: 'stage',
        key: 'stage',
        fixed: 'left',
        width: 200,
        className: `${styles.stagesHeaderCell} ${styles.headerCommonConfig}`,
        render: (text, record) => {
        if (record.isCategory) {
            return {
            children: <strong style={{ paddingLeft: '5px' }}>{text}</strong>,
            props: {
                colSpan: 15, // Total number of sub-columns (5 Rec + 5 OneOff + 4 Num + 1 Stage = 15 is wrong. It's sum of all leaf columns)
                            // Stages (1) + Rec (5) + OneOff (5) + Numbers (4) = 15 leaf columns.
                            // So this cell should span 15.
                style: { backgroundColor: '#FFC000', fontWeight: 'bold', borderRight: '1px solid #d9d9d9', padding: '8px' }
            },
            };
        }
        if (record.isSpacer) {
            return {
            children: <div style={{ height: '10px' }}> </div>, // Add height to spacer
            props: {
                colSpan: 15,
                style: { padding: '0px', backgroundColor: '#ffffff', border: 'none' }
            },
            };
        }
        
        let cellStyle = { padding: '8px', margin: '-8px -8px', display: 'flex', alignItems: 'center', height: 'calc(100% + 16px)', width: 'calc(100% + 16px)'};
        let content = text || '\u00A0'; // Use non-breaking space for empty cells

        if (record.stage === 'Closures') cellStyle = { ...cellStyle, backgroundColor: '#70AD47', color: 'white', fontWeight:'bold' };
        else if (record.stage === 'Churn') cellStyle = { ...cellStyle, backgroundColor: '#ED7D31', color: 'white', fontWeight:'bold' }; // Orange/Red for Churn
        else if (record.stage === 'C2H') cellStyle = { ...cellStyle, backgroundColor: '#595959', color: 'white', fontWeight:'bold' };
        else if (record.isPipelineRow) cellStyle = { ...cellStyle, backgroundColor: '#FFFF00', fontWeight: 'bold', color: 'black' };

        if (record.key === 'inbound_desc' && text === '') {
            return <div style={cellStyle}> </div>;
        }
        return <div style={cellStyle}><span style={{paddingLeft: '5px'}}>{content}</span></div>;
        },
    },
    {
        title: 'Recurring',
        className: `${styles.recurringGroupHeader} ${styles.headerCommonConfig}`,
        children: [
        { title: 'Goal', dataIndex: ['recurring', 'goal'], key: 'recurring_goal', width: 100, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: 'right', isCurrency: true, isC2S: rec.stage === 'C2S%' }) },
        { title: 'Goal till date', dataIndex: ['recurring', 'goalTillDate'], key: 'recurring_goalTillDate', width: 110, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: 'right', isCurrency: true }) },
        { title: 'Potential', dataIndex: ['recurring', 'potential'], key: 'recurring_potential', width: 100, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: rec.key === 'inbound_desc' ? 'left' : 'center', isPotential: true, isItalic: rec.key === 'inbound_desc' }) },
        { title: 'Achieved', dataIndex: ['recurring', 'achieved'], key: 'recurring_achieved', width: 100, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: 'right', isCurrency: true, isC2S: rec.stage === 'C2S%' }) },
        { title: 'Achieved%', dataIndex: ['recurring', 'achievedPercent'], key: 'recurring_achievedPercent', width: 100, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: 'center', isPercent: true, isYellow: rec.isPipelineRow }) },
        ],
    },
    {
        title: 'One-Off (DP)',
        className: `${styles.oneOffGroupHeader} ${styles.headerCommonConfig}`,
        children: [
        { title: 'Goal', dataIndex: ['oneOff', 'goal'], key: 'oneOff_goal', width: 100, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: 'right', isCurrency: true }) },
        { title: 'Goal till date', dataIndex: ['oneOff', 'goalTillDate'], key: 'oneOff_goalTillDate', width: 110, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: 'right', isCurrency: true }) },
        { title: 'Potential', dataIndex: ['oneOff', 'potential'], key: 'oneOff_potential', width: 100, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: 'center', isPotential: true }) },
        { title: 'Achieved', dataIndex: ['oneOff', 'achieved'], key: 'oneOff_achieved', width: 110, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: 'right', isCurrency: true }) },
        { title: 'Achieved%', dataIndex: ['oneOff', 'achievedPercent'], key: 'oneOff_achievedPercent', width: 100, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: 'center', isPercent: true, isYellow: rec.isPipelineRow }) },
        ],
    },
    {
        title: 'Numbers',
        className: `${styles.numbersGroupHeader} ${styles.headerCommonConfig}`,
        children: [
        { title: 'Goal', dataIndex: ['numbers', 'goal'], key: 'numbers_goal', width: 80, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: 'center' }) },
        { title: 'Goal till date', dataIndex: ['numbers', 'goalTillDate'], key: 'numbers_goalTillDate', width: 100, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: 'center' }) },
        { title: 'Achieved', dataIndex: ['numbers', 'achieved'], key: 'numbers_achieved', width: 80, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: 'center', isC2S: rec.stage === 'C2S%' }) },
        { title: 'Achieved%', dataIndex: ['numbers', 'achievedPercent'], key: 'numbers_achievedPercent', width: 100, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: 'center', isPercent: true }) },
        ],
    },
    ];

    // Helper function to render common cell types
    const renderCell = (value, record, { align = 'left', isCurrency = false, isPercent = false, isPotential = false, isYellow = false, isItalic = false, isC2S = false } = {}) => {
    if (record.isCategory || record.isSpacer) {
        return { props: { colSpan: 0 } };
    }

    let cellStyle = {
        padding: '8px', margin: '-8px', display: 'flex', alignItems: 'center', justifyContent: align,
        height: 'calc(100% + 16px)', width: 'calc(100% + 16px)', // Fill cell
    };
    let content = value;

    if (isPotential && value === '-') {
        cellStyle.backgroundColor = '#BFBFBF'; // Gray background
        // cellStyle.color = '#BFBFBF'; // Optional: make hyphen blend
    } else if (value === null || value === undefined || value === "") {
        content = (isPotential || record.stage === 'Churn') ? '-' : '\u00A0'; // Show '-' for potential/churn, else non-breaking space
    }

    if (isYellow) cellStyle = { ...cellStyle, backgroundColor: '#FFFF00', fontWeight: 'bold', color: 'black' };
    if (isItalic) cellStyle.fontStyle = 'italic';
    
    // For C2S% rows, "Goal" and "Achieved" display percentages directly
    if (isC2S && (align === 'right' || align === 'center')) { // Typically for 'Goal'/'Achieved' columns if they are percentages
        // no specific style needed unless different from regular numbers/percentages
    }

    // Make sure content is not an object (e.g. from a bad dataIndex)
    if (typeof content === 'object' && content !== null) content = '-';

    return <div style={cellStyle}>{(align === 'left' || align === 'center') ? <span style={{paddingLeft: align === 'left' ? '5px': '0px'}}>{content}</span> : content}</div>;
    };

    const revenueDataSource = [
    { key: 'cat1', stage: 'Uplers Business (Total)', isCategory: true },
    {
        key: 'row1', stage: 'TRs',
        recurring: { goal: '$29,715', goalTillDate: '$24,312', potential: null, achieved: '$19,516.90', achievedPercent: '65.68%' },
        oneOff: { goal: '$130,550.00', goalTillDate: '$106,813.64', potential: null, achieved: '$158,291.50', achievedPercent: '121.25%' },
        numbers: { goal: '91', goalTillDate: '74.45', achieved: '72', achievedPercent: '79.12%' },
    },
    {
        key: 'row2', stage: 'HRs (New)',
        recurring: { achieved: '$24,874.90' },
        oneOff: { achieved: '$130,878.60' },
    },
    {
        key: 'row3', stage: 'HRs (Carry Fwd)',
        recurring: { goal: '$17,926.00', goalTillDate: '$14,666.73', potential: '-', achieved: '$4,899.55', achievedPercent: '27.33%' },
        oneOff: { goal: '$75,600.00', goalTillDate: '$61,854.55', potential: '-', achieved: '$54,682.43', achievedPercent: '72.33%' },
        numbers: { goal: '46', goalTillDate: '37.64', achieved: '20.5', achievedPercent: '44.57%' },
    },
    { key: 'row4', stage: 'Closures', recurring: { achieved: '$8,816.75' }, numbers: { achieved: '11' } },
    { key: 'row5', stage: 'Churn' },
    { key: 'row6', stage: 'C2H', recurring: { achieved: '$17,771.00' } },
    { key: 'row7', stage: 'Pipeline to Closure %', isPipelineRow: true, recurring: { achievedPercent: '12.73%' }, oneOff: { achievedPercent: '20.95%' } },
    { key: 'spacer1', stage: '', isSpacer: true },

    { key: 'cat2', stage: 'Inbound', isCategory: true },
    { key: 'inbound_desc', stage: '', recurring: { potential: 'Avg value' } },
    {
        key: 'row9', stage: 'HRs (New)',
        recurring: { goal: '$11,250', goalTillDate: '$9,205', achieved: '$8,982.10', achievedPercent: '79.84%' },
        oneOff: { goal: '$15,000.00', goalTillDate: '$12,272.73', achieved: '$8,598.00', achievedPercent: '57.32%' },
        numbers: { goal: '20', goalTillDate: '16.36', achieved: '8', achievedPercent: '40.00%' },
    },
    {
        key: 'row10', stage: 'HRs (Carry Fwd)',
        recurring: { achieved: '$1,503.30' },
        oneOff: { achieved: '$0.00' },
    },
    {
        key: 'row11', stage: 'Closures',
        recurring: { goal: '$5,625.00', goalTillDate: '$4,602.27', potential: '-', achieved: '$700.00', achievedPercent: '12.44%' },
        oneOff: { goal: '$7,500.00', goalTillDate: '$6,136.36', potential: '-', achieved: '$3,280.22', achievedPercent: '43.74%' },
        numbers: { goal: '10', goalTillDate: '8.18', achieved: '2', achievedPercent: '20.00%' },
    },
    { key: 'row12', stage: 'C2S%', recurring: { goal: '50%', achieved: '6.68%' }, numbers: { achieved: '25.00%'} },
    { key: 'row13', stage: 'Pipeline to Closure %', isPipelineRow: true, recurring: { achievedPercent: '19.28%' }, oneOff: { achievedPercent: '23.84%' } },
    { key: 'spacer2', stage: '', isSpacer: true },

    { key: 'cat3', stage: 'Outbound', isCategory: true },
    {
        key: 'row14', stage: 'HRs (New)',
        recurring: { goal: '$3,714', goalTillDate: '$3,039', achieved: '$3,437.00', achievedPercent: '92.54%' },
        oneOff: { goal: '$44,550.00', goalTillDate: '$36,450.00', achieved: '$119,600.10', achievedPercent: '268.46%' },
        numbers: { goal: '20', goalTillDate: '16.36', achieved: '27', achievedPercent: '135.00%' },
    },
    {
        key: 'row15', stage: 'HRs (Carry Fwd)',
        recurring: { achieved: '$1,044.00' },
        oneOff: { achieved: '$54,579.30' },
    },
    {
        key: 'row16', stage: 'Closures',
        recurring: { goal: '$1,238.00', goalTillDate: '$1,012.91', potential: '-', achieved: '$0.00', achievedPercent: '0.00%' },
        oneOff: { goal: '$14,850.00', goalTillDate: '$12,150.00', potential: '-', achieved: '$8,799.09', achievedPercent: '59.25%' },
        numbers: { goal: '7', goalTillDate: '5.73', achieved: '3', achievedPercent: '42.86%' },
    },
    { key: 'row17', stage: 'C2S%', recurring: { goal: '33%', achieved: '0.00%' }, numbers: { achieved: '11.11%'} },
    { key: 'row18', stage: 'Pipeline to Closure %', isPipelineRow: true, recurring: { achievedPercent: '0.00%' }, oneOff: { achievedPercent: '6.16%' } },
    ];

    const onMonthCalenderFilter = (date) => {
        setMonthDate(date);
    };
  return (
   <div className={styles.snapshotContainer}>

                <div className={styles.filterContainer}>
                    <div className={styles.filterSets}>
                    <div className={styles.filterSetsInner}>
                        <Title level={3} style={{ margin: 0 }}>
                        {`${monthDate?.toLocaleString("default", { month: "long" })} ${selectedYear} - Daily Business Numbers`}
                        </Title>
                    </div>
                    <div className={styles.filterRight}>
                        <div className={styles.calendarFilterSet}>
                        <div className={styles.label}>Month-Year</div>
                        <div className={styles.calendarFilter}>
                            <CalenderSVG style={{ height: "16px", marginRight: "8px" }} />
                            <DatePicker
                                onKeyDown={(e) => e.preventDefault()}
                                className={styles.dateFilter}
                                placeholderText="Month - Year"
                                selected={monthDate}
                                onChange={onMonthCalenderFilter}
                                dateFormat="MM-yyyy"
                                showMonthYearPicker
                            />
                        </div>
                        </div>
                    </div>
                    </div>
                </div>


            <Card bordered={false}>
                <div className={styles.customTableContainer}>
                    <Table
                        columns={getColumns()}
                        dataSource={revenueDataSource}
                        bordered
                        pagination={false}
                        size="middle"
                        scroll={{ x: "max-content" }}
                        rowClassName={(record) => record.isSpacer ? styles.spacerRow : ""}
                    />
                </div>
            </Card>
        </div>
  );
}
