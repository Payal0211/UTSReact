import React, { useEffect,useState, useMemo} from 'react'
import TalentAcceptanceStyle from './talentAcceptance.module.css';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import { HTTPStatusCode } from 'constants/network';
import { Table } from 'antd';
import { Link } from 'react-router-dom';

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
          width:'200px',
          render:(text,result)=> {
            return    <Link
                        target="_blank"
                        to={`/allhiringrequest/${result?.hiringRequestID}`}
                        style={{ color: "rgb(0, 102, 153)", textDecoration: "underline" }}
                        onClick={() => localStorage.removeItem("dealID")}
                      >
                        {text}
                      </Link>
          }
        },
       
        // {
        //   title: "Client Email",
        //   dataIndex: "clientEmail",
        //   key: "clientEmail",
        //   align: "left",
        // },
        {
          title: "Company",
          dataIndex: "company",
          key: "company",
          align: "left",
        },
        {
            title: "Client",
            dataIndex: "clientName",
            key: "clientName",
            align: "left",
            width:'200px',
            render:(text,result)=>{
              return `${text} ( ${result?.clientEmail} )`
            }
          },
        {
          title: "Talent Status",
          dataIndex: "talent",
          key: "talent",
          align: "left",
        },
        {
          title: "BR",
          dataIndex: "final_HR_CostStr",
          key: "final_HR_CostStr",
          align: "left",
        //   width: '150px', 
          render:(text,result)=>{
            return   `${text}`
          }
        },
        {
          title: "PR",
          dataIndex: "talent_CostStr",
          key: "talent_CostStr",
          align: "left",
        //   width: '150px', 
          render:(text,result)=>{
            return   `${text} `
          }
        },
        {
          title: "Uplers Fees",
          dataIndex: "uplersFees",
          key: "uplersFees",
          align: "left",
        //   width: '150px', 
         
        },
        {
          title: "NR / DP (%)",
          dataIndex: "nrPercentage",
          key: "nrPercentage",
          align: "left",
          width: '100px', 
          render:(text,result)=>{
            return `${result.nrPercentage !== 0 ? result.nrPercentage : ''}  ${+result.dP_Percentage !== 0 ? result.dP_Percentage : ''}`
          }
        },
      ]
    },[otherDetailsList])


  return (
    <div className={TalentAcceptanceStyle.container} style={{margin:0}}>
			<div className={TalentAcceptanceStyle.modalTitle}>
				<h2>{talentData?.talentName ? `${talentData?.talentName}'s` : ''} Other HR Details</h2>
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
