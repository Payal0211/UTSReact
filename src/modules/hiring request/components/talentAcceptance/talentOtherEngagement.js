import React, { useEffect,useState, useMemo} from 'react'
import TalentAcceptanceStyle from './talentAcceptance.module.css';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import { HTTPStatusCode } from 'constants/network';
import { Table } from 'antd';

export default function TalentOtherEngagement({talentData,closeModal}) {
const [otherDetailsList,setOtherDetailsList] = useState([]);
 const getOtherDetailsTableData = async (payload) => {
    
    let result = await engagementRequestDAO.getTalentOtherDetailsOtherListDAO(payload);

    if (result.statusCode === HTTPStatusCode.OK) {
      setOtherDetailsList(result.responseBody?.Data?.getTalentInfo);
    }
  };

  useEffect(()=>{
    getOtherDetailsTableData({onboardID: 0,talentID: talentData?.TalentID,hrID: talentData?.HiringDetailID})
  },[talentData])

    const otherDetailsColumns = useMemo(() => {
      return [
        {
          title: "HR #",
          dataIndex: "hR_Number",
          key: "hR_Number",
          align: "left",
        },
        {
          title: "Client Name",
          dataIndex: "clientName",
          key: "clientName",
          align: "left",
        },
        {
          title: "Client Email",
          dataIndex: "clientEmail",
          key: "clientEmail",
          align: "left",
        },
        {
          title: "Company",
          dataIndex: "company",
          key: "company",
          align: "left",
        },
        {
          title: "Talent Status",
          dataIndex: "talent",
          key: "talent",
          align: "left",
        },
        {
          title: "Actual BR",
          dataIndex: "final_HR_Cost",
          key: "final_HR_Cost",
          align: "left",
        //   width: '150px', 
          render:(text,result)=>{
            return   `${text}`
          }
        },
        {
          title: "Actual PR",
          dataIndex: "talent_Cost",
          key: "talent_Cost",
          align: "left",
        //   width: '150px', 
          render:(text,result)=>{
            return   `${text} `
          }
        },
        {
          title: "Uplers Fees",
          dataIndex: "",
          key: "",
          align: "left",
        //   width: '150px', 
          render:(_,result)=>{
            return (+result.final_HR_Cost - +result.talent_Cost).toFixed(2) 
          }
        },
        {
          title: "NR / DP (%)",
          dataIndex: "nrPercentage",
          key: "nrPercentage",
          align: "left",
        //   width: '150px', 
          render:(text,result)=>{
            return `${result.nrPercentage !== 0 ? result.nrPercentage : ''}  ${+result.dP_Percentage !== 0 ? result.dP_Percentage : ''}`
          }
        },
      ]
    },[otherDetailsList])


  return (
    <div className={TalentAcceptanceStyle.container} style={{margin:0}}>
			<div className={TalentAcceptanceStyle.modalTitle}>
				<h2>Other Engagements</h2>
			</div>
            <div className={TalentAcceptanceStyle.panelBody}>
            <Table
            scroll={{ y: "100vh" }}
            dataSource={otherDetailsList ? otherDetailsList : []}
            columns={otherDetailsColumns}
            pagination={false}
          />
            </div>

    </div>
  )
}
