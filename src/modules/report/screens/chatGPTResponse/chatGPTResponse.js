import React, {useEffect, useState, useMemo} from 'react'
import { MasterDAO } from 'core/master/masterDAO'
import { HTTPStatusCode } from 'constants/network';
import gptStyles from './chatGpt.module.css'
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import WithLoader from 'shared/components/loader/loader';
import { Table,Modal, Checkbox } from 'antd';

const gptTabelConfig = (setModalJDText,setJDTextModal,setModalJDResponse,setResponseModal) => {
    return [
      {
        title: "JD Text",
        dataIndex: "parsingJDText",
        key: "parsingJDText",
        align: "left",
        render:(text)=>{
            const setModalValue = ()=>{
              if(text.includes('~')){
                setModalJDText(text.split('~'))
              }
              else{
                setModalJDText(text)
              }
            }
            return <p style={{color: "rgb(0, 102, 153)",
                textDecoration: 'underline', cursor:'pointer'}} 
                onClick={()=>{setJDTextModal(true) ; setModalValue()}}
                >View</p>
        }
      },
      {
        title: "Parsing URL",
        dataIndex: "parsingURL",
        key: "parsingURL",
        align: "left",
        render:(url)=>{
        return <a href={url} target='_blank' rel="noreferrer" style={{color:'var(--uplers-black)',textDecoration:'underline'}}>{url}</a>
        }
      },
      {
        title: "Created Date",
        dataIndex: "createdDateTime",
        key: "createdDateTime",
        align: "left",
        render:(text)=>{
          let dateArr = text.split(" ")
          return dateArr[0]
        }
      },
      {
        title: "response",
        dataIndex: "response",
        key: "response",
        align: "left",
        render:(text)=>{
            return <p style={{color: "rgb(0, 102, 153)",
                textDecoration: 'underline', cursor:'pointer'}} 
                onClick={()=>{setModalJDResponse(JSON.parse(text));setResponseModal(true)}}
                >View</p>
        }
      },
    ];
  }

export default function ChatGPTResponse() {
    const [GPTData, setGPTData] = useState([])
    const [isLoading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(100);
    const pageSizeOptions = [100, 200, 300, 500, 1000,5000];
    const [totalRecords, setTotalRecords] = useState(0);

    const [modalJDText,setModalJDText] = useState([])
    const [JDTextModal,setJDTextModal] = useState(false)

    const [modalJDResponse,setModalJDResponse] = useState({})
    const [responseModal,setResponseModal] = useState(false)
    const [isOnlyURLParsing, setisOnlyURLParsing] = useState(false);

    const getGPTDetails = async (data)=>{
        setLoading(true)
        let result= await MasterDAO.getChatGPTResponseDAO(data)

        if(result.statusCode === HTTPStatusCode.OK){
            setTotalRecords(result?.responseBody?.details.totalrows);
            setLoading(false);
            setGPTData(result?.responseBody?.details.rows);
        }

        if(result.statusCode === HTTPStatusCode.NOT_FOUND){
            setLoading(false);
            setTotalRecords(0);
            setGPTData([]);
        }
        setLoading(false)
    }

    useEffect(()=>{   
      let payload ={
    "pageIndex": 1,
    "pageSize": 100,
    "sortExpression": "CreatedDateTime",
    "sortDirection": "desc",
    "IsParsingURL":isOnlyURLParsing
  }    
  getGPTDetails(payload)      
  },[isOnlyURLParsing])

    useEffect(()=>{   
        let payload ={
			"pageIndex": pageIndex,
			"pageSize": pageSize,
			"sortExpression": "CreatedDateTime",
			"sortDirection": "desc",
      "IsParsingURL":false
		}    
    getGPTDetails(payload)      
    },[pageIndex,pageSize])

    const tableColumnsMemo = useMemo(
		() =>
        gptTabelConfig(setModalJDText,setJDTextModal,setModalJDResponse,setResponseModal),
		[],
	);

  return (
    <div className={gptStyles.hiringRequestContainer}>
      <WithLoader className="pageMainLoader" showLoader={isLoading}>
        <div className={gptStyles.addnewHR}>
				<div className={gptStyles.hiringRequest}>Chat GPT Response's</div>
                <div className={gptStyles.btn_wrap}>
               
                </div>
        </div>

        <div className={gptStyles.filterContainer}>
				<div className={gptStyles.filterSets}>

					<div className={gptStyles.filterRight}>
					
            <Checkbox checked={isOnlyURLParsing} onClick={()=> setisOnlyURLParsing(prev=> !prev)}>
					 Only URL Parsing Records
						</Checkbox>
						
						
						</div>
				</div>
			</div>

        <div className={gptStyles.tableDetails}>
				{isLoading ? (
					<TableSkeleton />
				) : (
					<WithLoader className="mainLoader">
						<Table
							scroll={{ x: '100vw', y: '100vh' }}
							id="hrListingTable"
							columns={tableColumnsMemo}
							bordered={false}
							dataSource={GPTData}
							pagination={
								 {
											onChange: (pageNum, pageSize) => {
												setPageIndex(pageNum);
												setPageSize(pageSize);
											},
											size: 'small',
											pageSize: pageSize,
											pageSizeOptions: pageSizeOptions,
											total: totalRecords,
											showTotal: (total, range) =>
												`${range[0]}-${range[1]} of ${totalRecords} items`,
											defaultCurrent: pageIndex,
									  }
							}
						/>
					</WithLoader>
				)}
			</div>

            <Modal
				width={'700px'}
				centered
				footer={false}
				open={JDTextModal}
				className="cloneHRConfWrap"
				onCancel={() => {setJDTextModal(false);setModalJDText([])}}>
                   <div>
                   {typeof modalJDText === 'string' ? <p>{modalJDText}</p> :  modalJDText.map(text=> {
                    let str = "You are a Job Description Parser system which sends an output by extracting Job Description as per format mentioned below by analyzing the text provided. Here's the format: {`Requirements` : max 5,  `Roles_And_Responsibilities` : max 5,  `Years_Of_Experience` : integer. Should be greater than 0 and less than 20. If not present: display 0,  `Budget_From` : `decimal. starting salary`,  `Budget_To` : `decimal. ending salary`,  `Max_Salary` : `decimal`,  `Salary_Currency` : `if salary is mentioned, bring currency code else ''`,  `Working_Zone_With_Time_Zone` : `Get Working Zone with Time and Time Zone. If not present: display ''`,  `Type_Of_Job` : `Either 'Part Time' or 'Full Time'`,  'Opportunity_Type` : `whether the job is 'Remote' or 'Hybrid' or 'On Site'`,  `Skills` : `Include comma separated Primary Skills. Also add Skills Mentioned in Roles, Responsibilities, Requirements`,  `Job_Title` : `Job Title`,  `Suggested Skills` : `get comma separated based on job title. Should not repeat from Skills object` }  It should Bring Technical Skills when Job Title is for Technical JOb Posioning otherwise bring Primary Skills based on JOb Title(For Non-tech Roles). The output should be given in Proper and Complete json and it should have proper indentation. In case, there comes multiple Job Title or the text contains more than 1 job, only consider 1 and don't parse other job. Here's the text:There are no recommended jobs Woops! The job that you are trying to apply to has expired For now, there are no recommended jobs for your profile. Find Jobs Footer Need Help? Contact Us Browse All Jobs Search by Location Job Categories Jobs By Company Add your Resume Terms & Conditions Privacy Policy © 2023 CareerBuilder, LLC. All rights reserved. This site uses cookies. To find out more, see our Cookie Policy. Ok"
                            let arr = text.split(':')
                            return <p>{arr[0]} : <b>{arr[1]}</b></p>
                    })} 


                   </div>
            </Modal>    

            <Modal
              width={'700px'}
              centered
              footer={false}
              open={responseModal}
              className="cloneHRConfWrap"
              onCancel={() => {setResponseModal(false);setModalJDResponse({})}}>

                <div>
                          {modalJDResponse?.choices?.length > 0 && modalJDResponse?.choices?.map(choice=>{
                            let content 
                            try{
                              content = JSON.parse(choice?.message.content)
                            }catch{
                              content = {}
                            }

                          return <>
                            <p>Finish Reason : <b>{choice.finish_reason}</b> </p>
                            <p>Role : <b>{choice.message.role}</b></p>
                            {Object.keys(content).map(key=>{
                              if(key === 'Requirements' || key === 'Roles/Responsibilities' || key === 'Roles_And_Responsibilities'){
                                if(typeof content[key] === 'string'){
                                  return <p>{key.replace(/_/g, " ")} : <b>{content[key]}</b> </p>
                                }
                                return <>
                                <p>{key.replace(/_/g, " ")} :</p>
                               {content[key] && <ul>{content[key]?.map(item=> <li>{item}</li>)}</ul>}
                                </>
                              }
                              return content[key] ? <p>{key.replace(/_/g, " ")} : <b>{content[key]}</b> </p> : null}
                              )}
                            {/* {content.Skills && <p>Skills : <b>{content.Skills}</b> </p>}
                            {content['Suggested Skills'] && <p>Suggested Skills : <b>{content['Suggested Skills']}</b> </p>} */}
                            </>
                          })}
                          <div style={{display:'flex', justifyContent:'space-between'}}>
                          <p>Completion Tokens : <b>{modalJDResponse?.usage?.completion_tokens}</b></p>  
                          <p>Total Tokens : <b>{modalJDResponse?.usage?.total_tokens}</b></p>  
                          <p>Prompt Tokens : <b>{modalJDResponse?.usage?.prompt_tokens}</b></p>
                          </div>
                </div>                  
            </Modal>    
    </WithLoader>
    </div>
  )
}
