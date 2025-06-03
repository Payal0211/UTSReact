import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Select, Input, Tabs } from 'antd';
import pcsStyles from './potentialClosuresSheet.module.css';
import { ReportDAO } from 'core/report/reportDAO';
import moment from 'moment';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import Diamond from 'assets/svg/diamond.svg';
import TabPane from 'antd/lib/tabs/TabPane';


const { Title } = Typography;
const { Option } = Select;

export default function PotentialClosuresSheet() {
    
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false); 
    const [activeTab, setActiveTab] = useState("G"); 

  const columns = [
    {
        title: <div style={{ textAlign: 'center' }}>Team</div>,
        dataIndex: 'hR_Team',
        key: 'hR_Team',
        fixed: 'left',
        width: 100,
        className: pcsStyles.headerCell,
    },
    {
        title: <div style={{ textAlign: 'center' }}>Date <br/> Created</div>,
        dataIndex: 'createdByDatetime',
        key: 'createdByDatetime',
        fixed: 'left',
        width: 110,
        className: pcsStyles.headerCell,
        render: (text) => text ? moment(text).format("DD/MM/YYYY") : "-"
    },
    {
        title: <div style={{ textAlign: 'center' }}>Open<br/>since how <br/> many<br/> days</div>,
        dataIndex: 'hrOpenSinceDays',
        key: 'hrOpenSinceDays',
        fixed: 'left',
        width: 90,
        align: 'center',
        className: pcsStyles.headerCell,
    },
    {
        title: <div style={{ textAlign: 'center' }}>HR ID</div>,
        dataIndex: 'hR_Number',
        key: 'hR_Number',
        width: 150,
        fixed: 'left',
        className: pcsStyles.headerCell,
        render: (text, result) => text 
            ? <a href={`/allhiringrequest/${result.hiringRequest_ID}`} style={{ textDecoration: 'underline' }} target="_blank" rel="noreferrer">{text}</a>
            : text
    },
    {
        title: <div style={{ textAlign: 'center' }}>HR Status</div>,
        dataIndex: 'hrStatus',
        key: 'hrStatus',
        fixed: 'left',
        className: pcsStyles.headerCell,
        width: "180px",
        render: (_, param) => All_Hiring_Request_Utils.GETHRSTATUS(param?.hrStatusCode, param?.hrStatus),
    },
    {
        title: <div style={{ textAlign: 'center' }}>Engagement <br/> Model</div>,
        dataIndex: 'hrModel',
        key: 'hrModel',
        width: 120,
        fixed: 'left',
        className: pcsStyles.headerCell,
    },
    {
        title: <div style={{ textAlign: 'center' }}>Sales Rep</div>,
        dataIndex: 'salesPerson',
        key: 'salesPerson',
        width: 150,
        fixed: 'left',
        className: pcsStyles.headerCell,
    },
    {
        title: <div style={{ textAlign: 'center' }}>Company</div>,
        dataIndex: 'company',
        key: 'company',
        width: 150,
        fixed: 'left',
        className: pcsStyles.headerCell,
        render: (text, record) =>
            record?.companyCategory === 'Diamond' ? (
                <>
                    <span>{text}</span>
                    &nbsp;<img src={Diamond} alt="info" style={{ width: "16px", height: "16px" }} />
                </>
            ) : text
    },
    {
        title: <div style={{ textAlign: 'center' }}>Company<br/>Size</div>,
        dataIndex: 'companySize',
        key: 'companySize',
        width: 90,
        className: pcsStyles.headerCell,
    },
    {
        title: <div style={{ textAlign: 'center' }}>Product /<br/>Non Product</div>,
        dataIndex: 'productType',
        key: 'productType',
        width: 120,
        align: 'center',
        render: (value, record, index) =>
            renderYesNoSelect(value, record, index, 'productType', handleFieldChange),
    },
    {
        title: <div style={{ textAlign: 'center' }}>Position</div>,
        dataIndex: 'position',
        key: 'position',
        width: 180,
    },
    {
        title: <div style={{ textAlign: 'center' }}>Potential</div>,
        dataIndex: 'potentialType',
        key: 'potentialType',
        width: 100,
        align: 'center',
        render: (value, record, index) =>
            renderYesNoSelect(value, record, index, 'potentialType', handleFieldChange),
    },
    {
        title: <div style={{ textAlign: 'center' }}>Closure by<br/>Weekend</div>,
        dataIndex: 'closurebyWeekend',
        key: 'closurebyWeekend',
        width: 100,
        align: 'center',
        render: (value, record, index) =>
            renderInputField(value, record, index, 'closurebyWeekend', handleFieldChange),
    },
    {
        title: <div style={{ textAlign: 'center' }}>Closure by<br/>EOM</div>,
        dataIndex: 'closurebyMonth',
        key: 'closurebyMonth',
        width: 100,
        align: 'center',
        render: (value, record, index) =>
            renderInputField(value, record, index, 'closurebyMonth', handleFieldChange),
    },
    {
        title: <div style={{ textAlign: 'center' }}>Number of<br/>TRs</div>,
        dataIndex: 'noofTR',
        key: 'noofTR',
        width: 100,
        align: 'center',
        className: pcsStyles.headerCell,
    },
    {
        title: <div style={{ textAlign: 'center' }}>Average Value<br/>(USD)</div>,
        dataIndex: 'averageValue',
        key: 'averageValue',
        width: 120,
        align: 'right',
        className: pcsStyles.headerCell,
    },
    {
        title: <div style={{ textAlign: 'center' }}>Talent Pay Rate/ <br/>Client Budget</div>,
        dataIndex: 'talentPayStr',
        key: 'talentPayStr',
        width: 280,
        className: pcsStyles.headerCell,
    },
    {
        title: <div style={{ textAlign: 'center' }}>Uplers Fees %</div>,
        dataIndex: 'uplersFeesPer',
        key: 'uplersFeesPer',
        width: 120,
        align: 'center',
        className: pcsStyles.headerCell,
    },
    {
        title: <div style={{ textAlign: 'center' }}>Uplers Fees</div>,
        dataIndex: 'uplersFeeStr',
        key: 'uplersFeeStr',
        width: 150,
        align: 'left',
        className: pcsStyles.headerCell,
    },
    {
        title: <div style={{ textAlign: 'center' }}>Above 35<br/> LPA</div>,
        dataIndex: 'above35LPA',
        key: 'above35LPA',
        width: 100,
        align: 'center',
        className: pcsStyles.headerCell,
    },
    {
        title: <div style={{ textAlign: 'center' }}>Lead</div>,
        dataIndex: 'leadType',
        key: 'leadType',
        width: 100,
        align: 'center',
        className: pcsStyles.headerCell,
    },
];

    
    useEffect(() => {
        fetchPotentialClosuresListData(activeTab);
    }, [activeTab])

     const handleTabChange = (key) => {
        setActiveTab(key);
    };

     const fetchPotentialClosuresListData = async (businessType) => {
        let payload = {
            "hR_BusinessType": businessType,
            "searchText": "",
            "hrStatusIDs": "",
            "modelType": ""
        }

        setLoading(true)
        const apiResult = await ReportDAO.PotentialClosuresListDAO(payload);
        setLoading(false)
        if (apiResult?.statusCode === 200) {            
            setData(apiResult.responseBody);
        } else if (apiResult?.statusCode === 404) {
            setData([]);
        }
    }

    const renderYesNoSelect = (value, record, index, dataIndex, handleChange) => {
        return (
            <Select
            value={value}
            onChange={(newValue) => handleChange(newValue, record, index, dataIndex)}
            style={{ width: '100%' }}
            size="small"
            >
            <Option value="Yes">Yes</Option>
            <Option value="No">No</Option>
            </Select>
        );
    };

   const renderInputField = (value, record, index, dataIndex, handleChange) => {
    return (
        <Input
            value={value}
            onChange={(e) => handleChange(e.target.value, record, index, dataIndex)}
            onBlur={() => {
                if (dataIndex === 'closurebyWeekend' || dataIndex === 'closurebyMonth') {
                    updatePotentialClosuresRowValue(data[index]);
                }
            }}
            style={{ width: '100%' }}
            size="small"
        />
        );
    };

    
    const handleFieldChange = (newValue, record, index, field) => {
        const updatedData = [...data];
        updatedData[index] = { ...record, [field]: newValue };
        setData(updatedData);

        if (field === 'productType' || field === 'potentialType') {
            updatePotentialClosuresRowValue(updatedData[index]);
        }
    };

    const updatePotentialClosuresRowValue = async (updatedData) => {
        const pl = {
            HRID: updatedData?.hiringRequest_ID,
            ProductType: updatedData?.productType,
            PotentialType: updatedData?.potentialType,
            ClosurebyWeekend: updatedData?.closurebyWeekend,
            ClosurebyMonth: updatedData?.closurebyMonth,
        };

        await ReportDAO.PotentialClosuresUpdateDAO(pl);
    };

    return (
        <div className={pcsStyles.snapshotContainer}>

                <div className={pcsStyles.filterContainer}>
                    <div className={pcsStyles.filterSets}>
                        <div className={pcsStyles.filterSetsInner}>
                            <Title level={3} style={{ margin: 0 }}>Potential Closures List</Title>
                        </div>
                   
                    </div>
                </div>
            
            <Tabs activeKey={activeTab}             
                onChange={handleTabChange} 
                style={{ marginBottom: 16 }} 
                destroyInactiveTabPane={false} 
                animated={true}
                tabBarGutter={50}
                tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}>
                <TabPane tab="Global" key="G" />
                <TabPane tab="India" key="I" />
            </Tabs>

            <Card bordered={false}>
            <div className={pcsStyles.tableContainer}>
                {isLoading ? (
                <TableSkeleton />
                ) : (
                data?.length > 0 ? 
                <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                    pagination={{ pageSize: 500 }}
                    size="middle"
                    scroll={{ x: 'max-content',y:1000 }}
                    rowClassName={(record, index) => index % 2 === 0 ? pcsStyles.evenRow : pcsStyles.oddRow}                    
                />:
                <Table
                    columns={columns}
                    dataSource={[]}
                    bordered
                    size="middle"                 
                />

                )}
            </div>
            </Card>
        </div>
    );
}