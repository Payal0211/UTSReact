import React, { useEffect, useMemo, useState } from "react";
import taStyles from "./tadashboard.module.css";
import { Tabs, Select, Table, Modal, Tooltip } from "antd";
import { EmailRegEx, InputType } from "constants/application";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";

const rawData = [
  {
    ta: 'Mazaha',
    companyName: 'Hireology*',
    hrId: 'HR080425225017',
    hrTitle: 'Senior Cloud Engineer',
    priority: 'P1',
    interviewRounds: 3,
    inout: 'Partnership',
    status: 'Fasttrack',
    activeTRs: 1,
    sales: 'Nandni',
    ctcBudget: '38 LPA',
    revenueOpp: 380000,
    totalRevenueOpp: 380000,
    contractDP: 'DP',
    hrStatus: 'In Process',
    createdDate: '9-Apr-2025',
    openMoreThan1Month: 'No',
    profilesCount: 0
  },
  {
    ta: 'Mazaha',
    companyName: 'Hireology*',
    hrId: 'HR120225113720',
    hrTitle: 'Senior Software Engineer',
    priority: 'P1',
    interviewRounds: 3,
    inout: 'Partnership',
    status: 'Fasttrack',
    activeTRs: 1,
    sales: 'Nandni',
    ctcBudget: '35 LPA',
    revenueOpp: 350000,
    totalRevenueOpp: 700000,
    contractDP: 'DP',
    hrStatus: 'In Process',
    createdDate: '12-Feb-2025',
    openMoreThan1Month: 'No',
    profilesCount: 2
  },
  {
    ta: 'Mazaha',
    companyName: 'Delightex*',
    hrId: 'HR270225011923',
    hrTitle: 'Backend- NodeJS',
    priority: 'P1',
    interviewRounds: 3,
    inout: 'Outbound',
    status: 'Slow',
    activeTRs: 1,
    sales: 'Sappy',
    ctcBudget: '25 LPA',
    revenueOpp: 250000,
    totalRevenueOpp: 250000,
    contractDP: 'DP',
    hrStatus: 'In Process',
    createdDate: '26-Feb-2025',
    openMoreThan1Month: 'No',
    profilesCount: 4
  },
  {
    ta: 'Mazaha',
    companyName: 'Odin AI',
    hrId: 'HR210325160158',
    hrTitle: 'Lead Fullstack Engineer',
    priority: 'P1',
    interviewRounds: 3,
    inout: 'Outbound',
    status: 'Slow',
    activeTRs: 1,
    sales: 'Nikita',
    ctcBudget: '70 LPA',
    revenueOpp: 700000,
    totalRevenueOpp: 700000,
    contractDP: 'DP',
    hrStatus: 'In Process',
    createdDate: '21-Mar-2025',
    openMoreThan1Month: 'No',
    profilesCount: 5
  },
  {
    ta: 'Rahana',
    companyName: 'Plentum*',
    hrId: 'HR270125124109',
    hrTitle: 'Growth Marketing',
    priority: 'P1',
    interviewRounds: 3,
    inout: 'Partnership',
    status: 'Fasttrack',
    activeTRs: 1,
    sales: 'Nandni',
    ctcBudget: '30 LPA',
    revenueOpp: 300000,
    totalRevenueOpp: 300000,
    contractDP: 'DP',
    hrStatus: 'In Process',
    createdDate: '28-Jan-2025',
    openMoreThan1Month: 'No',
    profilesCount: 3
  },
  {
    ta: 'Rahana',
    companyName: 'Pluto',
    hrId: 'HR260325124222',
    hrTitle: 'Brand & Content Growth',
    priority: 'P1',
    interviewRounds: 3,
    inout: 'Inbound',
    status: 'Slow',
    activeTRs: 1,
    sales: 'Sappy',
    ctcBudget: '30 LPA',
    revenueOpp: 300000,
    totalRevenueOpp: 300000,
    contractDP: 'DP',
    hrStatus: 'In Process',
    createdDate: '26-Mar-2025',
    openMoreThan1Month: 'No',
    profilesCount: 2
  },
  {
    ta: 'Test',
    companyName: 'Plentum*',
    hrId: 'HR270125124109',
    hrTitle: 'Growth Marketing',
    priority: 'P1',
    interviewRounds: 3,
    inout: 'Partnership',
    status: 'Fasttrack',
    activeTRs: 1,
    sales: 'Nandni',
    ctcBudget: '30 LPA',
    revenueOpp: 300000,
    totalRevenueOpp: 300000,
    contractDP: 'DP',
    hrStatus: 'In Process',
    createdDate: '28-Jan-2025',
    openMoreThan1Month: 'No',
    profilesCount: 3
  },
  {
    ta: 'Test',
    companyName: 'Pluto',
    hrId: 'HR260325124222',
    hrTitle: 'Brand & Content Growth',
    priority: 'P1',
    interviewRounds: 3,
    inout: 'Inbound',
    status: 'Slow',
    activeTRs: 1,
    sales: 'Sappy',
    ctcBudget: '30 LPA',
    revenueOpp: 300000,
    totalRevenueOpp: 300000,
    contractDP: 'DP',
    hrStatus: 'In Process',
    createdDate: '26-Mar-2025',
    openMoreThan1Month: 'No',
    profilesCount: 2
  }
];


export default function TADashboard() {
  const [selectedAM, setSelectedAM] = useState([]);
  const [amList, setAMList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const groupedData = groupByRowSpan(rawData, 'ta');

  function groupByRowSpan(data, groupField) {
    const grouped = {};
    
    // Step 1: Group by the field (e.g., 'ta')
    data.forEach(item => {
      const key = item[groupField];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
  
    // Step 2: Add rowSpan metadata
    const finalData = [];
    Object.entries(grouped).forEach(([key, rows]) => {
      rows.forEach((row, index) => {
        finalData.push({
          ...row,
          rowSpan: index === 0 ? rows.length : 0,
        });
      });
    });
  
    return finalData;
  }

  const columns = [
    {
      title: 'TA',
      dataIndex: 'ta',
      render: (value, row, index) => {
        return {
          children: <div style={{ verticalAlign: 'top' }}>{value}</div>,
          props: {
            rowSpan: row.rowSpan,
            style: { verticalAlign: 'top' }, // This aligns the merged cell content to the top
          },
        };
      },
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'HR ID',
      dataIndex: 'hrId',
      key: 'hrId',
    },
    {
      title: 'HR Title',
      dataIndex: 'hrTitle',
      key: 'hrTitle',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
    },
    {
      title: '#Interview Rounds',
      dataIndex: 'interviewRounds',
      key: 'interviewRounds',
    },
    {
      title: 'Inbound / Outbound',
      dataIndex: 'inout',
      key: 'inout',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Active TRs',
      dataIndex: 'activeTRs',
      key: 'activeTRs',
    },
    {
      title: 'Sales',
      dataIndex: 'sales',
      key: 'sales',
    },
    {
      title: 'Talent Annual CTC Budget (INR)',
      dataIndex: 'ctcBudget',
      key: 'ctcBudget',
    },
    {
      title: 'Revenue Opportunity',
      dataIndex: 'revenueOpp',
      key: 'revenueOpp',
      render: (value) => `₹${value.toLocaleString()}`
    },
    {
      title: 'Total Revenue Opportunity',
      dataIndex: 'totalRevenueOpp',
      key: 'totalRevenueOpp',
      render: (value) => `₹${value.toLocaleString()}`
    },
    {
      title: 'Contract / DP',
      dataIndex: 'contractDP',
      key: 'contractDP',
    },
    {
      title: 'HR Status',
      dataIndex: 'hrStatus',
      key: 'hrStatus',
    },
    {
      title: 'HR Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Open Since > 1 Month',
      dataIndex: 'openMoreThan1Month',
      key: 'openMoreThan1Month',
    },
    {
      title: 'No. of Profiles till Date',
      dataIndex: 'profilesCount',
      key: 'profilesCount',
    },
  ];
  return (
    <div className={taStyles.hiringRequestContainer}>
      {/* <div className={taStyles.addnewHR} style={{ margin: "0" }}>
        <div className={taStyles.hiringRequest}>TA Dashboard</div>
      </div> */}
      <div className={taStyles.filterContainer}>
        <div className={taStyles.filterSets}>
          <div className={taStyles.filterSetsInner}>
            <Select
              id="selectedValue"
              placeholder="Select TA"
              mode="multiple"
              value={selectedAM}
              showSearch={true}
              onChange={(value, option) => {
                console.log({ value, option });
                setSelectedAM(value);
              }}
              options={amList}
              optionFilterProp="label"
              getPopupContainer={(trigger) => trigger.parentElement}
            />
            <div
              className={taStyles.searchFilterSet}
              style={{ marginLeft: "15px" }}
            >
              <SearchSVG style={{ width: "16px", height: "16px" }} />
              <input
                type={InputType.TEXT}
                className={taStyles.searchInput}
                placeholder="Search Table"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
              {searchText && (
                <CloseSVG
                  style={{
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSearchText("");
                  }}
                />
              )}
            </div>
            <button
              style={{ marginLeft: "15px" }}
              type="submit"
              className={taStyles.btnPrimary}
              onClick={() => {}}
            >
              Search
            </button>
            <p
              className={taStyles.resetText}
              style={{ width: "190px" }}
              onClick={() => {
                setSelectedAM([]);
              }}
            >
              Reset Filter
            </p>
          </div>

          <div className={taStyles.filterRight}>
            <button className={taStyles.btnPrimary} onClick={() => {}}>
              Export
            </button>
          </div>
        </div>
      </div>

      <Table
  dataSource={groupedData}
  columns={columns}
  // bordered
  pagination={false}
/>
    </div>
  );
}
