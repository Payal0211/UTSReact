import React, { useEffect, useState, useMemo, useCallback } from "react";
import AddNewClientStyle from "../../modules/client/screens/addnewClient/add_new_client.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import {
  Avatar,
  Tabs,
  Table,
  Skeleton,
  Checkbox,
  message,
  Modal,
  Select,
  Tooltip,
} from "antd";

import { engagementRequestDAO } from "core/engagement/engagementDAO";
import EngagementOnboard from "modules/engagement/screens/engagementOnboard/engagementOnboard";
import EngagementFeedback from "modules/engagement/screens/engagementFeedback/engagementFeedback";
import { allEngagementConfig } from "modules/engagement/screens/engagementList/allEngagementConfig";
import { engagementUtils } from "modules/engagement/screens/engagementList/engagementUtils";
import { useForm } from "react-hook-form";
import EngagementAddFeedback from "modules/engagement/screens/engagementAddFeedback/engagementAddFeedback";
import UTSRoutes from "constants/routes";
import { FaDownload } from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import { IoIosRemoveCircle } from "react-icons/io";
import { IconContext } from "react-icons";
import AddTalentDocuments from "modules/engagement/screens/engagementAddFeedback/addTalentDocuments";

export default function ViewOnBoardDetails() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("OnBoard Details");
  const { onboardID , isOngoing} = useParams();
  const [isLoading, setLoading] = useState(false);
  const [getOnboardFormDetails, setOnboardFormDetails] = useState({});
  const [allBRPRlist, setAllBRPRList] = useState([]);
  const [otherDetailsList,setOtherDetailsList] = useState([]);
  const [getFeedbackFormContent, setFeedbackFormContent] = useState({});
  const [feedBackSave, setFeedbackSave] = useState(false);
  const [feedBackTypeEdit, setFeedbackTypeEdit] = useState('Please select');
  const [documentsList,setDocumentsList] = useState([]);
  const [docTypeList,setDocTypeList] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    getValues,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm();

  const [getHRAndEngagementId, setHRAndEngagementId] = useState({
    hrNumber: '',
    engagementID: '',
    talentName: '',
    onBoardId: '',
    hrId: '',
  });

  const [getFeedbackPagination, setFeedbackPagination] = useState({
    totalRecords: 0,
    pageIndex: 1,
    pageSize: 10,
  });

  const [feedBackData, setFeedBackData] = useState({
    totalRecords: 10,
    pagenumber: 1,
    onBoardId: '',
  });
  const [getEngagementModal, setEngagementModal] = useState({
    engagementFeedback: false,
    engagementAddFeedback: false,
    addDocumentModal:false
  });

  const [getClientFeedbackList, setClientFeedbackList] = useState([]);

  const feedbackTableColumnsMemo = useMemo(
    () => allEngagementConfig.clientFeedbackTypeConfig(),
    [],
  );

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
        width: '150px', 
        render:(text,result)=>{
          return   `${text}`
        }
      },
      {
        title: "Actual PR",
        dataIndex: "talent_Cost",
        key: "talent_Cost",
        align: "left",
        width: '150px', 
        render:(text,result)=>{
          return   `${text} `
        }
      },
      {
        title: "Uplers Fees",
        dataIndex: "",
        key: "",
        align: "left",
        width: '150px', 
        render:(_,result)=>{
          return (+result.final_HR_Cost - +result.talent_Cost).toFixed(2) 
        }
      },
      {
        title: "NR / DP (%)",
        dataIndex: "nrPercentage",
        key: "nrPercentage",
        align: "left",
        width: '150px', 
        render:(text,result)=>{
          return `${result.nrPercentage !== 0 ? result.nrPercentage : ''}  ${+result.dP_Percentage !== 0 ? result.dP_Percentage : ''}`
        }
      },
    ]
  },[otherDetailsList])

  const documentsColumns = useMemo(() => {
    return [
      {
        title: "Document Name",
        dataIndex: "documentName",
        key: "documentName",
        align: "left",
        // render: (value, data) => {
        //   return `${data.monthNames} ( ${data.years} )`;
        // },
      },
      {
        title: "Document Type",
        dataIndex: "documentType",
        key: "documentType",
        align: "left",
        render: (value, data) => {
          return value;
        },
      },
      {
        title: "Uploaded Date",
        dataIndex: "uploadDate",
        key: "uploadDate",
        align: "left",
        width:'150px',
        render: (value, data) => {
          return  value ;
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        align: "left",
        width:'150px',
        render: (value, data) => {
          return   <div className={`${AddNewClientStyle.documentStatus} ${value === 'Not Verified' ? AddNewClientStyle.red : value === 'Verified'?  AddNewClientStyle.green :  AddNewClientStyle.darkred }`}>
          <div className={`${AddNewClientStyle.documentStatusText} ${value === 'Not Verified' ? AddNewClientStyle.red : value === 'Verified'?  AddNewClientStyle.green :  AddNewClientStyle.darkred }`}> <span> {value}</span></div>
        </div>
        },
      },
      {
        title: "Action",
        dataIndex: "talentDocumentID",
        key: "talentDocumentID",
        align: "left",
        width:'250px',
        render: (value, data) => {
          return data.status === 'Inactive'? null : <div>
           
              <IconContext.Provider value={{ color: '#FFDA30', style: { width:'15px',height:'15px' } }}> <Tooltip title="Download" placement="top" >
              <span
              // style={{
              //   background: 'green'
              // }}
              onClick={()=> window.open(`${NetworkInfo.NETWORK}Media/TalentDocuments/${data.documentName}`, '_blank')}
              className={AddNewClientStyle.feedbackLabel}>
              {' '}
              <FaDownload />
            </span>   </Tooltip>
            </IconContext.Provider>
           
            
            {data.status !== 'Verified' &&  <IconContext.Provider value={{ color: 'green', style: { width:'15px',height:'15px' } }}><Tooltip title="Verify"  placement="top">
              <span
						// style={{
						// 	background: '#FFDA30'
						// }}
            onClick={()=>handleVerifyDocument(data.talentDocumentID)}
						className={AddNewClientStyle.feedbackLabel}>
						{' '}
						<MdOutlineVerified />
					</span> </Tooltip>
            </IconContext.Provider>}
           
           
          
            
            <IconContext.Provider value={{ color: 'red', style: { width:'15px',height:'15px' } }}><Tooltip title="Remove" placement="top" >
              <span
              // style={{
              //   background: 'red'
              // }}
              onClick={()=>handleRemoveDocument(data.talentDocumentID)}
              className={AddNewClientStyle.feedbackLabel}>
              {' '}
              <IoIosRemoveCircle />
            </span>        </Tooltip>
            </IconContext.Provider>
    
          </div>
        },
      },
    ];
  }, [documentsList]);

  const columns = useMemo(() => {
    return [
      {
        title: "Months",
        dataIndex: "monthNames",
        key: "monthNames",
        align: "left",
        render: (value, data) => {
          return `${data.monthNames} ( ${data.years} )`;
        },
      },
      {
        title: "Contract Type",
        dataIndex: "contractType",
        key: "contractType",
        align: "left",
        render: (value, data) => {
          return value;
        },
      },
      {
        title: "BR",
        dataIndex: "br",
        key: "br",
        align: "left",
        render: (value, data) => {
          return `${data.currency} ` + value ;
        },
      },
      {
        title: "PR",
        dataIndex: "pr",
        key: "pr",
        align: "left",
        render: (value, data) => {
          return `${data.currency} ` + value;
        },
      },
      {
        title: "NR",
        dataIndex: "nR_DP_Value",
        key: "nR_DP_Value",
        align: "left",
        render: (value, data) => {
          return `${data.currency} ` + value;
        },
      },
      {
        title: "NR%",
        dataIndex: "actual_NR_Percentage",
        key: "actual_NR_Percentage",
        align: "left",
      },
    ];
  }, [allBRPRlist]);

  const getAllBRPRTableData = async (onboardID) => {
    let result = await engagementRequestDAO.getAllBRPRListDAO(onboardID);
    // console.log("getAllBRPRTableData",result)
    if (result.statusCode === HTTPStatusCode.OK) {
      setAllBRPRList(result.responseBody);
    }
  };

  const getOtherDetailsTableData = async (payload) => {
    let result = await engagementRequestDAO.getTalentOtherDetailsOtherListDAO(payload);

    if (result.statusCode === HTTPStatusCode.OK) {
      setOtherDetailsList(result.responseBody?.Data?.getTalentInfo);
    }
  };

  const getFeedbackFormDetails = async (getHRAndEngagementId) => {
    setFeedbackFormContent({});
    const response = await engagementRequestDAO.getFeedbackFormContentDAO(
      getHRAndEngagementId,
    );
    if (response?.statusCode === HTTPStatusCode.OK) {
      setFeedbackFormContent(response?.responseBody?.details);
    } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      return 'NO DATA FOUND';
    }
  };

  useEffect(() => {
    if(getEngagementModal?.engagementAddFeedback || getEngagementModal?.addDocumentModal ){
       getFeedbackFormDetails(getHRAndEngagementId);
    }
     
  }, [getEngagementModal?.engagementAddFeedback, getEngagementModal?.addDocumentModal]);

  const getFeedbackList = async (feedBackData) => {
    setLoading(true);
    const response = await engagementRequestDAO.getFeedbackListDAO(
      feedBackData,
    );
    if (response?.statusCode === HTTPStatusCode.OK) {
      setClientFeedbackList(
        engagementUtils.modifyEngagementFeedbackData(response && response),
      );
      setFeedbackPagination((prev) => ({
        ...prev,
        totalRecords: response.responseBody.details.totalrows,
      }));
      setLoading(false);
    }
     else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      setLoading(false);
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } 
    else {
      setLoading(false);
      setClientFeedbackList([]);
      return 'NO DATA FOUND';
    }
  };

  const getDocumentsDetails = async (talentID) =>{
    setLoading(true);
   const  result = await engagementRequestDAO.viewDocumentsDetailsDAO(talentID)
   setLoading(false);
  
   const docTypeRes = await engagementRequestDAO.getDocumentTypeDAO()

   if(docTypeRes.statusCode === HTTPStatusCode.OK){
      setDocTypeList(docTypeRes.responseBody.details.documentType)
   }

   if(result.statusCode === HTTPStatusCode.OK){
    setDocumentsList(result.responseBody.details)
   }
   if(result.statusCode === HTTPStatusCode.NOT_FOUND){
    setDocumentsList([])
   }
  }

  const handleVerifyDocument = async (docId)=>{
    setLoading(true);
    let result = await engagementRequestDAO.verifyDocumentRequestDAO(docId)
    setLoading(false);
    if(result.statusCode === 200){
      message.success('Document Verify')
      getDocumentsDetails(getOnboardFormDetails.onboardContractDetails.talentID)
    }
  }

  const handleRemoveDocument = async (docId)=>{
    setLoading(true);
    let result = await engagementRequestDAO.removeDocumentRequestDAO(docId)
    setLoading(false);
    if(result.statusCode === 200){
      message.success('Document Removed')
      getDocumentsDetails(getOnboardFormDetails.onboardContractDetails.talentID)
    }
  }

  const getOnboardingForm = async (getOnboardID) => {
    setOnboardFormDetails({});
    setLoading(true);
    const response = await engagementRequestDAO.viewOnboardDetailsDAO(
      getOnboardID
    );
    if (response?.statusCode === HTTPStatusCode.OK) {
      setOnboardFormDetails(response?.responseBody?.details);
      let feedbackPayload = {
        hrNumber: response?.responseBody?.details?.onboardContractDetails?.hrNumber,
        engagementID: response?.responseBody?.details?.onboardContractDetails?.engagemenID,
        talentName: response?.responseBody?.details?.onboardContractDetails?.talentName,
        onBoardId: getOnboardID,
        hrId: response?.responseBody?.details?.onboardContractDetails?.hR_ID,
      }
      setHRAndEngagementId(feedbackPayload)
      setFeedBackData(prev => ({...prev,onBoardId: getOnboardID}))
      getFeedbackList({...feedBackData,onBoardId: getOnboardID})
      getOtherDetailsTableData({onboardID: getOnboardID,talentID: response?.responseBody?.details?.onboardContractDetails?.talentID})
      getDocumentsDetails(response?.responseBody?.details?.onboardContractDetails?.talentID)
      setLoading(false);
    } else {
      setOnboardFormDetails({});
      setLoading(false);
    }
  };

  useEffect(() => {
    if (onboardID !== undefined) {
      getOnboardingForm(onboardID);
      getAllBRPRTableData(onboardID);
    }
  }, [onboardID]);

  const DetailComp = () => {
    return (
      <div className={AddNewClientStyle.onboardDetailsContainer}>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <EngagementOnboard
            getOnboardFormDetails={getOnboardFormDetails}
            getHRAndEngagementId={{
              onBoardId: onboardID,
              talentName: `${getOnboardFormDetails?.onboardContractDetails?.talentName} (${getOnboardFormDetails?.onboardContractDetails?.talentEmail})`,
            }}
            getOnboardingForm={getOnboardingForm}
            hideHeader={true}
          />
        )}
      </div>
    );
  };

  const HrsDetails = () => {
    return (
      <div className={AddNewClientStyle.onboardDetailsContainer}>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <Table
            scroll={{ y: "100vh" }}
            dataSource={allBRPRlist ? allBRPRlist : []}
            columns={columns}
            pagination={false}
          />
        )}
      </div>
    );
  };

  const DocumentsDetails = () => {
    return (<>
    <div className={AddNewClientStyle.engagementModalHeaderButtonContainer}>
      <button className={AddNewClientStyle.engagementModalHeaderAddBtn} 
				  onClick={()=> {
					// setHRAndEngagementId({
					// 	talentName: getHRAndEngagementId?.talentName,
					// 	engagementID: getHRAndEngagementId?.engagementID,
					// 	hrNumber: getHRAndEngagementId?.hrNumber,
					// 	onBoardId: getHRAndEngagementId?.onBoardId,
					// 	hrId: getHRAndEngagementId?.hrId,
					// });
					setEngagementModal(pre => ({...pre,addDocumentModal:true}));
				  }}
				  >Upload Document</button>
    </div>


           <div className={AddNewClientStyle.onboardDetailsContainer}>
        
        {isLoading ? (
          <Skeleton active />
        ) : (
          <Table
            scroll={{ y: "100vh" }}
            dataSource={documentsList ? documentsList : []}
            columns={documentsColumns}
            pagination={false}
          />         
        )}
      </div>
    </>
     
    );
  };
  
  const OtherDetails = () => {
    return (
      <div className={AddNewClientStyle.onboardDetailsContainer}>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <Table
            scroll={{ y: "100vh" }}
            dataSource={otherDetailsList ? otherDetailsList : []}
            columns={otherDetailsColumns}
            pagination={false}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className={AddNewClientStyle.addNewContainer}>
        <div className={AddNewClientStyle.addHRTitle}>{getOnboardFormDetails?.onboardContractDetails?.talentName ? `${getOnboardFormDetails?.onboardContractDetails?.talentName} Engagement Details` : ''} </div>

        <Tabs
          onChange={(e) => setTitle(e)}
          defaultActiveKey="1"
          activeKey={title}
          animated={true}
          tabBarGutter={50}
          tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
          items={[
            {
              label: "OnBoard Details",
              key: "OnBoard Details",
              children: <DetailComp />,
            },
            isOngoing === 'false' && {
              label: "BR PR Details",
              key: "BR PR Details",
              children: <HrsDetails />,
            },
            {
              label: "Documents",
              key: "Documents",
              children: <DocumentsDetails />,
            },
            {
              label: "Client Feedback",
              key: "Client Feedback",
              children: <EngagementFeedback 
                  getHRAndEngagementId={getHRAndEngagementId}
                  feedbackTableColumnsMemo={feedbackTableColumnsMemo}
                  getClientFeedbackList={getClientFeedbackList}
                  isLoading={isLoading}
                  pageFeedbackSizeOptions={[10, 20, 30, 50, 100]}
                  getFeedbackPagination={getFeedbackPagination}
                  setFeedbackPagination={setFeedbackPagination}
                  setFeedBackData={setFeedBackData}
                  feedBackData={feedBackData}
                  setEngagementModal={setEngagementModal}
                  setHRAndEngagementId={setHRAndEngagementId}
              />,
            },
            {
              label: "Talent's Other Eng. Details",
              key: "Talent's Other Eng. Details",
              children: <OtherDetails />,
            },
            // companyPreviewData?.engagementDetails?.companyTypeID && {
            //   label: "Credit Utilize",
            //   key: "Credit Utilize",
            //   children: <CredUtilize />,
            // },
          ]}
        />

        {/** Add Document Modal **/}
          {getEngagementModal.addDocumentModal && 	<Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						className="engagementAddFeedbackModal"
						open={getEngagementModal.addDocumentModal}
						onCancel={() =>{
              setEngagementModal({
                ...getEngagementModal,
                addDocumentModal: false,
              })
              reset()
            }
						}>
              <AddTalentDocuments
                docTypeList={docTypeList.length ? docTypeList.map(item=>({label:item.text,value:item.value})) : []}
                getDocumentsDetails={getDocumentsDetails}
                getFeedbackFormContent={getFeedbackFormContent}
                getHRAndEngagementId={getHRAndEngagementId}
                onCancel={() =>{
                  setEngagementModal({
                    ...getEngagementModal,
                    addDocumentModal: false,
                  })
                  reset()
                }
                }
                setFeedbackSave={setFeedbackSave}
                feedBackSave={feedBackSave}
                register={register}
                handleSubmit={handleSubmit}
                setValue={setValue}
                control={control}
                setError={setError}
                getValues={getValues}
                watch={watch}
                reset={reset}
                resetField={resetField}
                errors={errors}
                feedBackTypeEdit={feedBackTypeEdit}
                setFeedbackTypeEdit={setFeedbackTypeEdit}
                setClientFeedbackList={setClientFeedbackList}
              />

          </Modal> }

        {/** ============ MODAL FOR ENGAGEMENT ADD FEEDBACK ================ */}
				{getEngagementModal.engagementAddFeedback && (
					<Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						className="engagementAddFeedbackModal"
						open={getEngagementModal.engagementAddFeedback}
						onCancel={() =>{
              setEngagementModal({
                ...getEngagementModal,
                engagementAddFeedback: false,
              })
              reset()
            }
						}>

						<EngagementAddFeedback
							getFeedbackFormContent={getFeedbackFormContent}
							getHRAndEngagementId={getHRAndEngagementId}
							onCancel={() =>{
								setEngagementModal({
									...getEngagementModal,
									engagementAddFeedback: false,
								})
                reset()
              }
							}
							setFeedbackSave={setFeedbackSave}
							feedBackSave={feedBackSave}
							register={register}
							handleSubmit={handleSubmit}
							setValue={setValue}
							control={control}
							setError={setError}
							getValues={getValues}
							watch={watch}
							reset={reset}
							resetField={resetField}
							errors={errors}
							feedBackTypeEdit={feedBackTypeEdit}
							setFeedbackTypeEdit={setFeedbackTypeEdit}
              setClientFeedbackList={setClientFeedbackList}
						/>
					</Modal>
				)}
      </div>
    </>
  );
}
