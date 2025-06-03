import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Select, Input } from 'antd';
import pcsStyles from './potentialClosuresSheet.module.css';
import { ReportDAO } from 'core/report/reportDAO';
import moment from 'moment';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';

const { Title } = Typography;
const { Option } = Select;

export default function PotentialClosuresSheet() {
    
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false); 

    const columns = [
        {
            title: 'Team',
            dataIndex: 'hR_Team',
            key: 'hR_Team',
            fixed: 'left',
            width: 100,
            className: pcsStyles.headerCell,
        },
        {
            title: <>Date <br/> Created</>,
            dataIndex: 'createdByDatetime',
            key: 'createdByDatetime',
            fixed: 'left',
            width: 110,
            className: pcsStyles.headerCell,
            render: (text, record) => {
                if (text) {
                    return moment(text).format("DD/MM/YYYY");
                }       
                else{
                    return "-"
                }         
            },
        },
        {
            title: <>Open<br/>since how <br/> many<br/> days</>,
            dataIndex: 'hrOpenSinceDays',
            key: 'hrOpenSinceDays',
            fixed: 'left',
            width: 90,
            align: 'center',
            className: pcsStyles.headerCell,
        },
        {
            title: 'HR ID',
            dataIndex: 'hR_Number',
            key: 'hR_Number',
            width: 150,
            fixed: 'left',
            className: pcsStyles.headerCell,
            render: (text, result) => {
            return text 
              ? <a href={`/allhiringrequest/${result.hiringRequest_ID}`} style={{textDecoration:'underline'}} target="_blank" rel="noreferrer">{text}</a>
              : text;
          },
        },
        {
            title: 'HR Status',
            dataIndex: 'hrStatus',
            key: 'hrStatus',
            width: 100,
            fixed: 'left',
            className: pcsStyles.headerCell,
        },
        {
            title: <>Engagement <br/> Model</>,
            dataIndex: 'hrModel',
            key: 'hrModel',
            width: 120,
            fixed: 'left',
            className: pcsStyles.headerCell,
        },
        {
            title: 'Sales Rep',
            dataIndex: 'salesPerson',
            key: 'salesPerson',
            width: 150,
            fixed: 'left',
            className: pcsStyles.headerCell,
        },
        {
            title: 'Company Name',
            dataIndex: 'company',
            key: 'company',
            width: 150,
            fixed: 'left',
            className: pcsStyles.headerCell,
            render: (text, record) => {                
                return text;
            },
        },
        {
            title: <>Company<br/>Size</>,
            dataIndex: 'companySize',
            key: 'companySize',
            width: 90,
            className: pcsStyles.headerCell,
        },
        {
            title:<>Product /<br/>Non Product</>,
            dataIndex: 'productType',
            key: 'productType',
            width: 120,
            align: 'center',
            render: (value, record, index) =>
            renderYesNoSelect(value, record, index, 'productType', handleFieldChange)
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            width: 180,
        },
        {
            title: 'Potential',
            dataIndex: 'potentialType',
            key: 'potentialType',
            width: 100,
            align: 'center',
            render: (value, record, index) =>
            renderYesNoSelect(value, record, index, 'potentialType', handleFieldChange),
        },
        {
            title:<>Closure by<br/>Weekend</>,
            dataIndex: 'closurebyWeekend',
            key: 'closurebyWeekend',
            width: 100,
            align: 'center',
            render: (value, record, index) =>
                renderInputField(value, record, index, 'closurebyWeekend', handleFieldChange),           
        },
        {
            title: <>Closure by<br/>EOM</>,
            dataIndex: 'closurebyMonth',
            key: 'closurebyMonth',
            width: 100,
            align: 'center',
            render: (value, record, index) =>
                renderInputField(value, record, index, 'closurebyMonth', handleFieldChange),
        },
        {
            title: <>Number of<br/>TRs</>,
            dataIndex: 'noofTR',
            key: 'noofTR',
            width: 100,
            align: 'center',
            className: pcsStyles.headerCell,
        },        
        {
            title: <>Avg. MRR<br/>(USD)</>,
            dataIndex: 'averageValue',
            key: 'averageValue',
            width: 120,
            align: 'right',
            className: pcsStyles.headerCell,
        },
        {
            title: <>Talent Pay Rate/ <br/>Client Budget</>,
            dataIndex: 'talentPayStr',
            key: 'talentPayStr',
            width: 280,
            className: pcsStyles.headerCell,
        },
        // {
        //     title: <>Talent Pay Rate/ <br/>Client Budget <br/>(Annual CTC)</>,
        //     dataIndex: 'talentPayRateClientBudget_AnnualCTC',
        //     key: 'talentPayRateClientBudget_AnnualCTC',
        //     width: 150,
        //     align: 'right',
        //     className: pcsStyles.headerCell,
        //     render: (val) => val ? parseInt(val).toLocaleString('en-US') : '-',
        // },
        {
            title: 'Uplers Fees %',
            dataIndex: 'uplersFeesPer',
            key: 'uplersFeesPer',
            width: 120,
            align: 'center',
            className: pcsStyles.headerCell,
        },
        {
            title: <>Uplers Fees</>,
            dataIndex: 'uplersFeeStr',
            key: 'uplersFeeStr',
            width: 150,
            align: 'right',
            className: pcsStyles.headerCell,
        },
        {
            title: <>Above 35<br/> LPA</>,
            dataIndex: 'above35LPA',
            key: 'above35LPA',
            width: 100,
            align: 'center',
            className: pcsStyles.headerCell,
        },
        {
            title: 'Lead',
            dataIndex: 'leadType',
            key: 'leadType',
            width: 100,
            align: 'center',
            className: pcsStyles.headerCell,
        },
    ];
    
    useEffect(() => {
        fetchPotentialClosuresListData();
    }, [])

    const fetchPotentialClosuresListData = async () => {
        let payload = {
            "hR_BusinessType": "G",
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

            <Card bordered={false}>
                <div className={pcsStyles.tableContainer}>
                {isLoading ? <TableSkeleton /> :
                    <Table
                        columns={columns}
                        dataSource={data}
                        bordered
                        pagination={{ pageSize: 15 }}
                        size="middle"
                        scroll={{ x: 'max-content', y: 500 }}
                        rowClassName={(record, index) => index % 2 === 0 ? pcsStyles.evenRow : pcsStyles.oddRow}
                    />
                }
                </div>
            </Card>
        </div>
    );
}