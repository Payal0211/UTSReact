import React from 'react';
import { Table, Card, Typography, Tag } from 'antd';
import pcsStyles from './potentialClosuresSheet.module.css';

const { Title } = Typography;

const renderHighlightedText = (text, highlightColor, textColor = 'black') => {
    if (!text) return null;
    return (
        <span style={{ 
            backgroundColor: highlightColor, 
            padding: '2px 4px', 
            borderRadius: '3px', 
            fontWeight: 'bold',
            color: textColor,
            display: 'inline-block' // Ensures background covers text properly
        }}>
            {text}
        </span>
    );
};

const renderYesNoTag = (text) => {
    if (text === 'Yes') {
        return <Tag color="success">{text}</Tag>;
    } else if (text === 'No') {
        return <Tag color="error">{text}</Tag>;
    }
    return text;
};


const columns = [
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        fixed: 'left',
        width: 80,
        className: pcsStyles.headerCell,
    },
    {
        title: 'Date Created',
        dataIndex: 'dateCreated',
        key: 'dateCreated',
        fixed: 'left',
        width: 110,
        className: pcsStyles.headerCell,
    },
    {
        title: <>Open since <br/>how many<br/> days</>,
        dataIndex: 'openSinceDays',
        key: 'openSinceDays',
        width: 100,
        align: 'center',
        className: pcsStyles.headerCell,
    },
    {
        title: 'HR ID',
        dataIndex: 'hrId',
        key: 'hrId',
        width: 150,
        className: pcsStyles.headerCell,
        render: (text) => <a href="#">{text}</a>, // Assuming HR IDs are links
    },
    {
        title: 'HR Status',
        dataIndex: 'hrStatus',
        key: 'hrStatus',
        width: 120,
        className: pcsStyles.headerCell,
    },
    {
        title: 'Engagement Model',
        dataIndex: 'engagementModel',
        key: 'engagementModel',
        width: 180,
        className: pcsStyles.headerCell,
    },
    {
        title: 'Sales Rep',
        dataIndex: 'salesRep',
        key: 'salesRep',
        width: 150,
        className: pcsStyles.headerCell,
    },
    {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 250,
        className: pcsStyles.headerCell,
        render: (text, record) => {
            if (record.companyHighlight === 'yellow') {
                return renderHighlightedText(text, '#FFFF00'); // Yellow
            }
            if (record.companyHighlight === 'blue') {
                return renderHighlightedText(text, '#CCEEFF'); // Light Blue
            }
            return text;
        },
    },
    {
        title: 'Company Size',
        dataIndex: 'companySize',
        key: 'companySize',
        width: 120,
        className: pcsStyles.headerCell,
    },
    {
        title:<>Product /<br/>Non Product</>,
        dataIndex: 'productNonProduct',
        key: 'productNonProduct',
        width: 120,
        align: 'center',
        className: pcsStyles.headerCell,
        render: renderYesNoTag
    },
    {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
        width: 250,
        className: pcsStyles.headerCell,
    },
    {
        title: 'Potential',
        dataIndex: 'potential',
        key: 'potential',
        width: 100,
        align: 'center',
        className: pcsStyles.headerCell,
        render: renderYesNoTag,
    },
    {
        title:<>Closure by<br/>Weekend</>,
        dataIndex: 'closureByWeekend',
        key: 'closureByWeekend',
        width: 100,
        align: 'center',
        className: pcsStyles.headerCell,
        render: (text) => (text === '0' ? 0 : renderYesNoTag(text)),
    },
    {
        title: <>Closure by<br/>EOM</>,
        dataIndex: 'closureByEOM',
        key: 'closureByEOM',
        width: 100,
        align: 'center',
        className: pcsStyles.headerCell,
    },
    {
        title: <>Number of<br/>TRs</>,
        dataIndex: 'numberOfTRs',
        key: 'numberOfTRs',
        width: 100,
        align: 'center',
        className: pcsStyles.headerCell,
    },
    // Columns from the second screenshot (scrolled view)
    {
        title: <>Avg. MRR<br/>(USD)</>,
        dataIndex: 'avgMrrUSD',
        key: 'avgMrrUSD',
        width: 120,
        align: 'right',
        className: pcsStyles.headerCell,
        render: (val) => val ? parseFloat(val).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : '-',
    },
    {
        title: <>Talent Pay Rate/ <br/>Client Budget (Format: USD)</>,
        dataIndex: 'talentPayRateClientBudget_USD',
        key: 'talentPayRateClientBudget_USD',
        width: 280,
        className: pcsStyles.headerCell,
    },
    {
        title: <>Talent Pay Rate/ <br/>Client Budget <br/>(Annual CTC)</>,
        dataIndex: 'talentPayRateClientBudget_AnnualCTC',
        key: 'talentPayRateClientBudget_AnnualCTC',
        width: 150,
        align: 'right',
        className: pcsStyles.headerCell,
        render: (val) => val ? parseInt(val).toLocaleString('en-US') : '-',
    },
    {
        title: 'Uplers Fees %',
        dataIndex: 'uplersFeesPercent',
        key: 'uplersFeesPercent',
        width: 120,
        align: 'center',
        className: pcsStyles.headerCell,
    },
    {
        title: <>Uplers Fees /<br/> Month (TR/Emp)</>,
        dataIndex: 'uplersFeesPerMonth',
        key: 'uplersFeesPerMonth',
        width: 150,
        align: 'right',
        className: pcsStyles.headerCell,
        render: (val) => val ? parseFloat(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
    },
    {
        title: 'Multiple',
        dataIndex: 'multiple',
        key: 'multiple',
        width: 100,
        align: 'center',
        className: pcsStyles.headerCell,
    },
];

const dataSource = [
    {
        key: '1',
        team: 'Brand',
        dateCreated: '21-Apr-25',
        openSinceDays: 35,
        hrId: 'HR210425101942',
        hrStatus: 'Active',
        engagementModel: 'Hire a Contractor ()',
        salesRep: 'Brand Mawlers',
        companyName: 'Yunoieno',
        companyHighlight: 'yellow',
        companySize: '100',
        productNonProduct: 'Yes',
        position: 'Senior Adobe Commerce Magento',
        potential: '',
        closureByWeekend: '',
        closureByEOM: '',
        numberOfTRs: 1,
        avgMrrUSD: '1833.3',
        talentPayRateClientBudget_USD: '$ 5,000.00 to $ 6,000.00 USD / Month',
        talentPayRateClientBudget_AnnualCTC: '4000',
        uplersFeesPercent: '15%',
        uplersFeesPerMonth: '3000',
        multiple: '1',
    },
    {
        key: '2',
        team: 'Brand',
        dateCreated: '14-Apr-25',
        openSinceDays: 42,
        hrId: 'HR140425103327',
        hrStatus: 'Active',
        engagementModel: 'Hire a Contractor ()',
        salesRep: 'Brand Mawlers',
        companyName: 'Yunoieno',
        companyHighlight: 'yellow',
        productNonProduct: 'No',
        companySize: '900',        
        position: 'Senior Sitecore Scrum Master',
        potential: '',
        closureByWeekend: '',
        closureByEOM: '',
        numberOfTRs: 1,
        avgMrrUSD: '8333.3',
        talentPayRateClientBudget_USD: '$ 2,400.00 to $ 3,500.00 USD / Month',
        talentPayRateClientBudget_AnnualCTC: '2600',
        uplersFeesPercent: '15%',
        uplersFeesPerMonth: '833',
        multiple: '1',
    },
    {
        key: '3',
        team: 'Brand',
        dateCreated: '5-Apr-25',
        openSinceDays: 49,
        hrId: 'HR050425105912',
        hrStatus: 'Active',
        engagementModel: 'Hire a Contractor ()',
        salesRep: 'Brand Mawlers',
        companyName: 'AIM5000 - 3 decade old Fashion ERP company from USA',
        companySize: '500',
        productNonProduct: 'Yes',
        position: 'Senior SAP ERP Consultant',
        potential: '',
        closureByWeekend: '',
        closureByEOM: '',
        numberOfTRs: 1,
        avgMrrUSD: '15000.0',
        talentPayRateClientBudget_USD: '$ 80,000.00 to $ 90,000.00 USD / ...',
        talentPayRateClientBudget_AnnualCTC: '55556', // Approximation
        uplersFeesPercent: '15%',
        uplersFeesPerMonth: '2016.67',
        multiple: '1',
    },
    {
        key: '4',
        team: 'Partnership',
        dateCreated: '4-Apr-25',
        openSinceDays: 52,
        hrId: 'HR040425110206',
        hrStatus: 'Active',
        engagementModel: 'Direct Hire (Transparent)',
        salesRep: 'Deepshikha Shukla',
        companyName: 'Company USA',
        position: 'Senior C# Developer',
        potential: 'Yes',
        closureByWeekend: '',
        closureByEOM: '',
        numberOfTRs: 1,
        avgMrrUSD: '4500.0',
        talentPayRateClientBudget_USD: '$ 40,000.00 to $ 60,000.00 USD / ...',
        talentPayRateClientBudget_AnnualCTC: '40000',
        uplersFeesPercent: '18%',
        uplersFeesPerMonth: '3600',
        multiple: '1',
    },
    {
        key: '5',
        team: 'AM',
        dateCreated: '7-May-25',
        openSinceDays: 18,
        hrId: 'HR070525171429',
        hrStatus: 'Re-Open',
        engagementModel: 'Direct Hire (Transparent)',
        salesRep: 'Deepshikha Shukla',
        companyName: 'Anxela',
        position: 'Senior DBA - JOB-36771',
        potential: '',
        closureByWeekend: '',
        closureByEOM: '',
        numberOfTRs: 1,
        avgMrrUSD: '6666.6',
        talentPayRateClientBudget_USD: '$ 72,000.00 to $ 84,000.00 USD / ...',
        talentPayRateClientBudget_AnnualCTC: '33000',
        uplersFeesPercent: '8%',
        uplersFeesPerMonth: '4529',
        multiple: '1',
    },
     {
        key: '6',
        team: 'AM',
        dateCreated: '8-May-25',
        openSinceDays: 11, // (via Sales Portal)
        hrId: 'HR280125221735',
        hrStatus: 'Active',
        engagementModel: 'Direct Hire (Transparent)',
        salesRep: 'Deepshikha Shukla',
        companyName: 'Knit',
        companyHighlight: 'yellow',
        productNonProduct: '',
        position: 'Sr. AI Engineer (MLOps)',
        potential: '',
        closureByWeekend: '',
        closureByEOM: '',
        numberOfTRs: 1,
        avgMrrUSD: '9195.8', // Approx
        talentPayRateClientBudget_USD: '$ 95,00.00 to $ 1,05,00.00 / Annum',
        talentPayRateClientBudget_AnnualCTC: '9500000', // Assuming typo and it is 95,000
        uplersFeesPercent: '7.50%',
        uplersFeesPerMonth: '3073',
        multiple: '0.0833766'
    },
    {
        key: '7',
        team: 'AM',
        dateCreated: '28-Jan-25',
        openSinceDays: 117,
        hrId: 'HR280125221735', // Same HR ID in image
        hrStatus: 'Active',
        engagementModel: 'Direct Hire (Transparent)',
        salesRep: 'Deepshikha Shukla',
        companyName: 'Unit',
        companyHighlight: 'yellow',
        productNonProduct: 'Yes',
        position: 'Senior AI Engineer, NLP',
        potential: 'No',
        closureByWeekend: '0',
        closureByEOM: '',
        numberOfTRs: 1,
        avgMrrUSD: '1072.9', // Approx
        talentPayRateClientBudget_USD: '$ 95,00.00 to $ 1,05,00.00 / Annum', // Assuming this is related, value different
        talentPayRateClientBudget_AnnualCTC: '9500000', // Assuming typo and it is 95,000
        uplersFeesPercent: '7.50%',
        uplersFeesPerMonth: '3073',
        multiple: '0.0833766'
    },
    {
        key: '8',
        team: 'NBD',
        dateCreated: '18-Mar-25',
        openSinceDays: 61,
        hrId: 'HR180325232339',
        hrStatus: 'Active - Reposted',
        engagementModel: 'Direct Hire (Transparent)',
        salesRep: 'Deepshikha Shukla',
        companyName: 'Sphereon',
        companyHighlight: 'blue',
        productNonProduct: '',
        position: 'Backend Developer',
        potential: 'No',
        closureByWeekend: '',
        closureByEOM: '',
        numberOfTRs: 1,
        avgMrrUSD: '594.9',
        talentPayRateClientBudget_USD: '$ 24,000.00 to $ 30,000.00 USD / Month',
        talentPayRateClientBudget_AnnualCTC: '2000',
        uplersFeesPercent: '18%',
        uplersFeesPerMonth: '2400',
        multiple: '1'
    },
    // Add more data rows as needed based on the image
];


export default function PotentialClosuresSheet() {
    return (
        <div className={pcsStyles.snapshotContainer}>

                <div className={pcsStyles.filterContainer}>
                    <div className={pcsStyles.filterSets}>
                        <div className={pcsStyles.filterSetsInner}>
                            <Title level={3} style={{ margin: 0 }}>Potential Closures List</Title>
                        </div>
                   
                    </div>
                </div>

            <Card bordered={false}>
                <div className={pcsStyles.tableContainer}>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        bordered
                        pagination={{ pageSize: 15 }} // Or false if no pagination desired
                        size="middle"
                        scroll={{ x: 'max-content', y: 500 }} // Added y-scroll for many rows
                        rowClassName={(record, index) => index % 2 === 0 ? pcsStyles.evenRow : pcsStyles.oddRow}
                    />
                </div>
            </Card>
        </div>
    );
}