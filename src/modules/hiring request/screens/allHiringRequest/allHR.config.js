import { HiringRequestHRStatus, ProfileLog } from "constants/application";
import { Link } from "react-router-dom";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { ReactComponent as CloneHRSVG } from "assets/svg/cloneHR.svg";
import { ReactComponent as ReopenHR } from "assets/svg/reopen.svg";
import { ReactComponent as CloseHR } from "assets/svg/power.svg";
import { ReactComponent as FocusedRole } from "assets/svg/FocusRole.svg";
import { Tooltip, message, Checkbox } from "antd";
import eyeIcon from 'assets/svg/eye.svg'
import moment from "moment";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { HTTPStatusCode } from "constants/network";
export const allHRConfig = {
  tableConfig: (
    togglePriority,
    setCloneHR,
    setHRID,
    setHRNumber,
    setReopenHRData,
    setReopenHrModal,
    setCloseHRDetail,
    setCloseHrModal,
    LoggedInUserTypeID,
    setLoading,
    handleDemoCloneCheckboxChange,
    selectedCheckboxes,    
    showCloneHRToDemoAccount,
    setIsPreviewModal,
    setpreviewIDs,
    getPreviewPostData,
    setRepostHrModal
  ) => {

    const getColorCode = (doneBy)=>{
      if(doneBy === 2){
        // ATS
        return {color: 'rgb(179, 76, 1)', background: 'rgb(249, 231, 218)'}
      } 
      if(doneBy === 3){
        // Sales portal
        return  {color: 'rgb(23, 98, 10)' , background:'rgb(230, 247, 219)'} 
      } 
      if(doneBy === 4){
        // client portal
        return {color: 'rgb(0, 112, 224)' , background:'rgb(232, 242, 253)'}
      } 
    }

    return [
      // {
      //   title: " ",
      //   dataIndex: "isHRFocused",
      //   key: "isHRFocused",
      //   align: "center",
      //   width: "50px",
      //   render: (val) => {
      //     return val ? <FocusedRole /> : null;
      //   },
      // },

      {
        title: " ",
        dataIndex: "isHRFocused",
        key: "isHRFocused",
        align: "center",
        width: "60px",
        render: (val,result) => {
          if(result.isDraftHR){
            return
          }
          return <Tooltip title="Preview/Edit HR" placement="right" >  
               <img src={eyeIcon} alt='info' style={{cursor:'pointer'}} width="22" height="22" onClick={()=>{setIsPreviewModal(true);setpreviewIDs({hrID:result?.HRID,companyID: result?.companyID});getPreviewPostData(result?.HRID,result.HR_ID,result?.companyID)}}  />	

      </Tooltip> ;
        },
      },

      {
        title: " ",
        dataIndex: "showCloneToDemoAccount",
        key: "showCloneToDemoAccount",
        align: "center",
        width: showCloneHRToDemoAccount === true ? "32px": "0",     
        render: (text, result) => {
          if(showCloneHRToDemoAccount === true)
          {
            return (
              <>
              {result?.showCloneToDemoAccount === true ? (
              <Tooltip placement="bottom" title={"Clone HR to Demo Account"}>
                    <a href="javascript:void(0);" style={{display: 'inline-flex'}}> 
                    <Checkbox
                      checked={selectedCheckboxes.map(item=> item.hRID)?.includes(result.HRID)}
                      onClick={() => handleDemoCloneCheckboxChange(result)}
                    >              
                    </Checkbox> 
                    </a>
                  </Tooltip>) : ""}
              </>
            );
        }
        },
      },

      {
        title: " ",
        dataIndex: "starStatus",
        key: "starStatus",
        align: "center",
        width: "42px",
        render: (_, param) => {
          let response = All_Hiring_Request_Utils.GETHRPRIORITY(
            param?.starStatus,
            param?.salesRep,
            param?.key,
            togglePriority
          );

          return response;
        },
      },
      {
        title: " ",
        dataIndex: "reopenHR",
        key: "reopenHR",
        width: "42px",
        align: "center",
        render: (text, result) => {
          return (
            <>
              {result?.reopenHR === 0 && result?.isDisplayReopenOrCloseIcon === true ? (
                <Tooltip placement="bottom" title={"Close HR"}>
                  <a href="javascript:void(0);" style={{display: 'inline-flex'}}>
                    <CloseHR
                      style={{ fontSize: "16px" }}
                      onClick={() => {
                        setCloseHRDetail({ ...result, HR_Id: result?.HRID });
                        setCloseHrModal(true);
                      }}
                    />
                  </a>
                </Tooltip>
              ) : 
              // LoggedInUserTypeID !== 5 && LoggedInUserTypeID !== 10 &&
               result?.isDisplayReopenOrCloseIcon === true ? (
                <Tooltip placement="bottom" title={result?.companyModel === 'Pay Per Credit' ? "Re-post HR" :"Reopen HR"}>
                  <a href="javascript:void(0);" style={{display: 'inline-flex'}}>
                    <ReopenHR
                      style={{ fontSize: "16px", width: "20px" }}
                      onClick={() => {
                        if(result?.companyModel === 'Pay Per Credit'){
                          setReopenHRData({
                            ...result,
                            HR_Id: result?.HRID,
                            ClientDetail: { NoOfTalents: result?.TR },
                          });
                          setRepostHrModal(true)
                        }else{
                         setReopenHRData({
                          ...result,
                          HR_Id: result?.HRID,
                          ClientDetail: { NoOfTalents: result?.TR },
                        });
                        setReopenHrModal(true);  
                        }
                       
                      }}
                    />
                  </a>
                </Tooltip>
              ) : (
                ""
              )}
            </>
          );
        },
      },
      {
        title: " ",
        dataIndex: "cloneHR",
        key: "cloneHR",
        width: "42px",
        align: "center",
        render: (text, result) => {
          // if (LoggedInUserTypeID === 5 || LoggedInUserTypeID === 10) {
          //   return;
          // }
          return (
            <>
              <Tooltip placement="bottom" title={"Clone HR"}>
                <a href="javascript:void(0);" style={{display: 'inline-flex'}}>
                  <CloneHRSVG
                    style={{ fontSize: "16px" }}
                    onClick={() => {
                      setCloneHR(true);
                      setHRID(result?.key);
                      setHRNumber({hrNumber:result?.HR_ID, isHybrid:result?.isHybrid,companyID:result?.companyID});
                    }}
                  />
                </a>
              </Tooltip>
            </>
          );
        },
      },
      // {
      // 	title: 'O/P',
      // 	dataIndex: 'adHocHR',
      // 	key: 'adHocHR',
      // 	align: 'left',
      // },
      {
        title: "Created Date",
        dataIndex: "Date",
        key: "Date",
        align: "left",
        width: "120px",
      },
      {
        title: "HR ID",
        dataIndex: "HR_ID",
        key: "HR_ID",
        align: "left",
        width: "176px",
        render: (text, result) => (
          <>
          <Link
            target="_blank"
            to={`/allhiringrequest/${result?.key}`}
            style={{ color: "black", textDecoration: "underline" }}
            onClick={() => localStorage.removeItem("dealID")}
          >
            {text}
          </Link><br/>
          {result?.hrPostedFromPlatform && <p style={{
            color: getColorCode(result?.appActionDoneBy)?.color,
            background: getColorCode(result?.appActionDoneBy)?.background,
            padding:'5px',
            width:'fit-content',
            borderRadius: '6px',
            marginTop:'2px'
          }} >({result?.hrPostedFromPlatform})</p>}
          </>
        ),
      },
      {
        title: "TR",
        dataIndex: "TR",
        key: "TR",
        width: "70px",
        align: "left",
      },
      {
        title: "Position",
        dataIndex: "Position",
        key: "position",
        align: "left",
        width: "150px",
      },
      {
        title: "Company",
        dataIndex: "Company",
        key: "company",
        align: "left",
        width: "200px",
        // render: (text) => {
        // 	return (
        // 		<a
        // 			target="_blank"
        // 			href=""
        // 			style={{
        // 				color: `var(--uplers-black)`,
        // 				textDecoration: 'underline',
        // 			}}>
        // 			{text}
        // 		</a>
        // 	);
        // },
      },
      // {
      //   title: "Company Type",
      //   dataIndex: "companyModel",
      //   key: "companyModel",
      //   align: "left",
      //   width: "30px",
      // },
      {
        title: "HR Type",
        dataIndex: "hrTypeName",
        key: "hrTypeName",
        align: "left",
        width: "160px",
      },
      {
        title: "Engagement Type",
        dataIndex: "hrEngagementType",
        key: "hrEngagementType",
        align: "left",
        width: "180px",
      },
      {
        title: "Salary/Client Budget",
        dataIndex: "salaryBudget",
        key: "salaryBudget",
        align: "left",
        width: "200px",
      },
      {
        title: "HR Status",
        dataIndex: "hrStatus",
        key: "hr_status",
        align: "left",
        width: "200px",
        render: (_, param) => {
          return All_Hiring_Request_Utils.GETHRSTATUS(
            param?.hrStatusCode,
            param?.hrStatus
          );
        },
      },
      // {
      //   title: "Time",
      //   dataIndex: "Time",
      //   key: "time",
      //   align: "left",
      //   width: "5%",
      // },
      {
        title: "FTE/PTE",
        dataIndex: "typeOfEmployee",
        key: "fte_pte",
        align: "left",
        width: "100px",
      },
      {
        title: "Sales Rep",
        dataIndex: "salesRep",
        key: "sales_rep",
        align: "left",
        width: "180px",
        render: (text, result) => {
          // return (
          //   // <Link
          //   //   to={`/user/${result?.userId}`}
          //   //   style={{
          //   //     color: `var(--uplers-black)`,
          //   //     textDecoration: "underline",
          //   //   }}
          //   // >
          //   //   {text}
          //   // </Link>
          // );
          return text
        },
      },
      {
        title: `HR Published Since`,
        // title: (
        //   <>
        //     HR Published <br /> Since
        //   </>
        // ),
        dataIndex: "hrAcceptedSince",
        key: "HRAcceptedSince",
        width: "164px",
        align: "left",
      },
    ];
  },
  hrFilterListConfig: () => {
    return [
      { name: "Tenure" },
      { name: "ODR" },
      { name: "Profile Shared" },
      { name: "Data Analyst" },
      { name: "ODR" },
      { name: "Data Analyst" },
    ];
  },
  hrFilterTypeConfig: (filterList) => {
    return [
      // {
      // 	label: 'ODR/Pool',
      // 	name: 'isPoolODRBoth',
      // 	child: [
      // 		{
      // 			disabled: false,
      // 			group: null,
      // 			selected: false,
      // 			text: '1',
      // 			value: 'ODR',
      // 		},
      // 		{
      // 			disabled: false,
      // 			group: null,
      // 			selected: false,
      // 			text: '2',
      // 			value: 'Pool',
      // 		},
      // 	],
      // 	isSearch: false,
      // },
      {
        label: "HR Status",
        name: "hrStatus",
        child: filterList?.hrStatusList?.map(it=>( {
              disabled: false,
              group: null,
              selected: false,
              statusCode: it.statusCode,
              label: it.title,
              value: it.title,
              text: it.statusCode.toString(),
            })),
        // child: [
        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.DRAFT,
        //     label: "Draft",
        //     value: "Draft",
        //     text: HiringRequestHRStatus.DRAFT.toString(),
        //   },

        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.HR_ACCEPTED,
        //     label: "HR Accepted",
        //     value: "HR Accepted",
        //     text: HiringRequestHRStatus.HR_ACCEPTED.toString(),
        //   },
        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.ACCEPTANCE_PENDING,
        //     label: "Acceptance Pending",
        //     text: HiringRequestHRStatus.ACCEPTANCE_PENDING.toString(),
        //     value: "Acceptance Pending",
        //   },
        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.INFO_PENDING,
        //     label: "Info Pending",
        //     text: HiringRequestHRStatus.INFO_PENDING.toString(),
        //     value: "Info Pending",
        //   },
        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.COMPLETED,
        //     label: "Completed",
        //     text: HiringRequestHRStatus.COMPLETED.toString(),
        //     value: "Completed",
        //   },

        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.IN_PROCESS,
        //     label: "In Process",
        //     text: HiringRequestHRStatus.IN_PROCESS.toString(),
        //     value: "In Process",
        //   },
        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.CANCELLED,
        //     label: "Cancelled",
        //     text: HiringRequestHRStatus.CANCELLED.toString(),
        //     value: "Cancelled",
        //   },
        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.LOST,
        //     label: "Lost",
        //     text: HiringRequestHRStatus.LOST.toString(),
        //     value: "Lost",
        //   },
          
        // ],
        isSearch: false,
      },
      {
        label: "Tenure",
        name: "tenure",
        child: [],
        isSearch: false,
        isNumber: true,
      },
      {
        label: "Talent Request",
        name: "tr",
        child: [],
        isSearch: false,
        isNumber: true,
      },
      {
        label: "Position",
        name: "position",
        child: filterList?.positions,
        isSearch: true,
      },
      // {
      // 	label: 'Company',
      // 	name: 'company',
      // 	child: filterList?.companies,
      // 	isSearch: true,
      // },
      {
        label: "FTE/PTE",
        name: "typeOfEmployee",
        child: [
          {
            disabled: false,
            group: null,
            selected: false,
            text: "FTE",
            value: "FTE",
          },
          {
            disabled: false,
            group: null,
            selected: false,
            text: "PTE",
            value: "PTE",
          },
        ],
        isSearch: false,
      },
      {
        label: "Manager",
        name: "manager",
        child: filterList?.managers,
        isSearch: true,
      },
      {
        label: 'Lead Type',
        name: 'leadUserId',
        child: filterList?.leadTypeList,
        isSearch: false,
        isSingleSelect:true
    },
      {
        label: "Sales Representative",
        name: "salesRep",
        child: filterList?.salesReps,
        isSearch: true,
      },
      {
        label: "Type of HR",
        name: "HRType",
        child: [
          {
            disabled: false,
            group: null,
            selected: false,
            text: "Contractual",
            value: "Contractual",
          },
          {
            disabled: false,
            group: null,
            selected: false,
            text: "Direct Placement",
            value: "Direct Placement",
          },
        ],
        isSearch: false,
      },
      {
        label: "Company Type",
        name: "companyTypeIds",
        child: filterList?.companyModel,
        isSearch: false,
      },
      {
        label: "GEO",
        name: "Geos",
        child: filterList?.geoList,
        isSearch: false,
      },
    ];
  },
  profileLogConfig: (profileLog) => {
    return [
      {
        id: "profileShared",
        // score: profileLog?.profileSharedCount,
        score: 60,
        label: "Profile Shared",
        activeColor: `var(--color-purple)`,
        typeID: ProfileLog.PROFILE_SHARED,
      },
      {
        id: "feedback",
        // score: profileLog?.feedbackCount,\
        score: 60,
        label: "Feedback Received",
        activeColor: `var(--color-cyan)`,
        typeID: ProfileLog.FEEDBACK,
      },
      {
        id: "rejected",
        // score: profileLog?.rejectedCount,
        score: 60,
        label: "Rejected",
        activeColor: `var(--color-danger)`,
        typeID: ProfileLog.REJECTED,
      },
      {
        id: "selected",
        // score: profileLog?.selectedForCount,
        score: 60,
        label: "Selected For",
        activeColor: `var(--color-success)`,
        typeID: ProfileLog.SELECTED,
      },
    ];
  },

  lostTabelConfig: (talentDtailOpen) => {
    return [
      {
        title: "HR #",
        dataIndex: "hR_Number",
        key: "hR_Number",
        align: "left",
        // render:(val)=> {
        // 	return val ? <FocusedRole /> : null
        // }
        width: '12%',
      },
      {
        title: "Sales User",
        dataIndex: "salesUser",
        key: "salesUser",
        align: "left",
        width:'120px'
      },
      {
        title: "Client Type",
        dataIndex: "clientType",
        key: "clientType",
        align: "left",
        width:'100px'
      },
      {
        title: "Client Email",
        dataIndex: "client",
        key: "client",
        align: "left",
		    width:'16%',
      },
      {
        title: "Company",
        dataIndex: "company",
        key: "company",
        align: "left",
        width:'10%',
      },
      {
        title: "Total TR",
        dataIndex: "totalTR",
        key: "totalTR",
        align: "left",
		    width:'70px',
      },
      {
        title: "Lost TR",
        dataIndex: "trLostCount",
        key: "trLostCount",
        align: "left",
		    width:'60px'
      },
      {
        title: "Created Date",
        dataIndex: "hrCreatedDate",
        key: "hrCreatedDate",
        align: "left",
        width: '8%',
        render: (val) => {
          return moment(val).format("DD-MM-yyyy");
        },
      },
      {
        title: "Lost Date",
        dataIndex: "lostDate",
        key: "lostDate",
        align: "left",
        width:'8%',
        render: (val) => {
          return moment(val).format("DD-MM-yyyy");
        },
      },
      {
        title: "Lost Reason",
        dataIndex: "lostReason",
        key: "lostReason",
        align: "left",
        width:'400px'
      },
      {
        title: "Lost Done By",
        dataIndex: "lostDoneBy",
        key: "lostDoneBy",
        align: "left",
        width:'100px'
      },
      {
        title: "Talent Details",
        dataIndex: ' ',
        key: ' ',
        align: "left",
        width: '10%',
        render: (_, values) => {
          return (
            <button
              className="telentDetailBtn"
              style={{
                background: "#FFDA30",
                border: "1px solid transparent",
                borderRadius: "8px",
                fontFamily: "Montserrat",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                padding: "7px",
                whiteSpace: "nowrap",
              }}
              onClick={() => talentDtailOpen(values)}
            >
              Talent Detail
            </button>
          );
        },
      },
    ];
  },
  lostTanlentTabelConfig: () => {
    return [
      {
        title: "Talent Name",
        dataIndex: "talentName",
        key: "talentName",
        align: "left",
      },
      {
        title: "Talent Email",
        dataIndex: "talentEmail",
        key: "talentEmail",
        align: "left",
      },
      {
        title: "Talent Status",
        dataIndex: "talentStatus",
        key: "talentStatus",
        align: "left",
      },
    ];
  },
};

export const unassignedHRsConfig = {
  tableConfig: (
    ControlledTitleComp,
    setCloneHR,
    setHRID,
    setHRNumber,
    setReopenHRData,
    setReopenHrModal,
    setCloseHRDetail,
    setCloseHrModal,
    LoggedInUserTypeID,
    setLoading,
    handleDemoCloneCheckboxChange,
    selectedCheckboxes,    
    showCloneHRToDemoAccount,
    setIsPreviewModal,
    setpreviewIDs,
    getPreviewPostData
  ) => {
    return [
     
      {
				title: 'Assigned POC',
				dataIndex: 'assignedPOC',
				key: 'assignedPOC',
        width: "300px",
				render: (data, param) => {	
 					return <ControlledTitleComp text={data} values={param} />
					// return (
					// 	<>
					// 		{/* <Button style={{ color: 'black', textDecoration: 'underline' }}> */}
					// 			<PencilSVG  onClick={onEditTitle}/>
					// 		{/* </Button> */} &nbsp;&nbsp;
					// 	{isEdit ? <input  onChange={(e) => onChangeTitle(e)} type='text'/> :  data }
					// 	</>
					// );
				},		
			},
      {
        title: "Created Date",
        dataIndex: "Date",
        key: "Date",
        align: "left",
        // width: "8%",
        width: "130px",
      },
      {
        title: "HR ID",
        dataIndex: "HR_ID",
        key: "HR_ID",
        align: "left",
        width: "190px",
        // render: (text, result) => (
        //   <Link
        //     target="_blank"
        //     to={`/allhiringrequest/${result?.key}`}
        //     style={{ color: "black", textDecoration: "underline" }}
        //     onClick={() => localStorage.removeItem("dealID")}
        //   >
        //     {text}
        //   </Link>
        // ),
      },
      {
        title: "HR Published Since",
        dataIndex: "hrAcceptedSince",
        key: "hrAcceptedSince",
        width: "150px",
        align: "left",
      },
      {
        title: "TR",
        dataIndex: "TR",
        key: "TR",
        // width: "4%",
        width: "70px",
        align: "left",
      },
      {
        title: "Position",
        dataIndex: "Position",
        key: "position",
        align: "left",
        width: "180px",
      },
      {
        title: "Company",
        dataIndex: "Company",
        key: "company",
        align: "left",
        width: "240px",
        // render: (text) => {
        // 	return (
        // 		<a
        // 			target="_blank"
        // 			href=""
        // 			style={{
        // 				color: `var(--uplers-black)`,
        // 				textDecoration: 'underline',
        // 			}}>
        // 			{text}
        // 		</a>
        // 	);
        // },
      },
      // {
      //   title: "Company Type",
      //   dataIndex: "companyModel",
      //   key: "companyModel",
      //   align: "left",
      //   width: "150px",
      // },
      {
        title: "HR Type",
        dataIndex: "hrTypeName",
        key: "hrTypeName",
        align: "left",
        width: "80px",
      },
      {
        title: "Engagement Type",
        dataIndex: "hrEngagementType",
        key: "hrEngagementType",
        align: "left",
        width: "150px",
      },
      {
        title: "Salary/Client Budget",
        dataIndex: "salaryBudget",
        key: "salaryBudget",
        align: "left",
        width: "170px",
      },
    ];
  },
  hrFilterListConfig: () => {
    return [
      { name: "Tenure" },
      { name: "ODR" },
      { name: "Profile Shared" },
      { name: "Data Analyst" },
      { name: "ODR" },
      { name: "Data Analyst" },
    ];
  },
  hrFilterTypeConfig: (filterList) => {
    return [
      // {
      // 	label: 'ODR/Pool',
      // 	name: 'isPoolODRBoth',
      // 	child: [
      // 		{
      // 			disabled: false,
      // 			group: null,
      // 			selected: false,
      // 			text: '1',
      // 			value: 'ODR',
      // 		},
      // 		{
      // 			disabled: false,
      // 			group: null,
      // 			selected: false,
      // 			text: '2',
      // 			value: 'Pool',
      // 		},
      // 	],
      // 	isSearch: false,
      // },
      {
        label: "HR Status",
        name: "hrStatus",
        child: filterList?.hrStatusList?.map(it=>( {
              disabled: false,
              group: null,
              selected: false,
              statusCode: it.statusCode,
              label: it.title,
              value: it.title,
              text: it.statusCode.toString(),
            })),
        // child: [
        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.DRAFT,
        //     label: "Draft",
        //     value: "Draft",
        //     text: HiringRequestHRStatus.DRAFT.toString(),
        //   },

        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.HR_ACCEPTED,
        //     label: "HR Accepted",
        //     value: "HR Accepted",
        //     text: HiringRequestHRStatus.HR_ACCEPTED.toString(),
        //   },
        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.ACCEPTANCE_PENDING,
        //     label: "Acceptance Pending",
        //     text: HiringRequestHRStatus.ACCEPTANCE_PENDING.toString(),
        //     value: "Acceptance Pending",
        //   },
        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.INFO_PENDING,
        //     label: "Info Pending",
        //     text: HiringRequestHRStatus.INFO_PENDING.toString(),
        //     value: "Info Pending",
        //   },
        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.COMPLETED,
        //     label: "Completed",
        //     text: HiringRequestHRStatus.COMPLETED.toString(),
        //     value: "Completed",
        //   },

        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.IN_PROCESS,
        //     label: "In Process",
        //     text: HiringRequestHRStatus.IN_PROCESS.toString(),
        //     value: "In Process",
        //   },
        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.CANCELLED,
        //     label: "Cancelled",
        //     text: HiringRequestHRStatus.CANCELLED.toString(),
        //     value: "Cancelled",
        //   },
        //   {
        //     disabled: false,
        //     group: null,
        //     selected: false,
        //     statusCode: HiringRequestHRStatus.LOST,
        //     label: "Lost",
        //     text: HiringRequestHRStatus.LOST.toString(),
        //     value: "Lost",
        //   },
          
        // ],
        isSearch: false,
      },
      {
        label: "Tenure",
        name: "tenure",
        child: [],
        isSearch: false,
        isNumber: true,
      },
      {
        label: "Talent Request",
        name: "tr",
        child: [],
        isSearch: false,
        isNumber: true,
      },
      {
        label: "Position",
        name: "position",
        child: filterList?.positions,
        isSearch: true,
      },
      // {
      // 	label: 'Company',
      // 	name: 'company',
      // 	child: filterList?.companies,
      // 	isSearch: true,
      // },
      {
        label: "FTE/PTE",
        name: "typeOfEmployee",
        child: [
          {
            disabled: false,
            group: null,
            selected: false,
            text: "FTE",
            value: "FTE",
          },
          {
            disabled: false,
            group: null,
            selected: false,
            text: "PTE",
            value: "PTE",
          },
        ],
        isSearch: false,
      },
      {
        label: "Manager",
        name: "manager",
        child: filterList?.managers,
        isSearch: true,
      },
      {
        label: 'Lead Type',
        name: 'leadUserId',
        child: filterList?.leadTypeList,
        isSearch: false,
        isSingleSelect:true
    },
      {
        label: "Sales Representative",
        name: "salesRep",
        child: filterList?.salesReps,
        isSearch: true,
      },
      {
        label: "Type of HR",
        name: "HRType",
        child: [
          {
            disabled: false,
            group: null,
            selected: false,
            text: "Contractual",
            value: "Contractual",
          },
          {
            disabled: false,
            group: null,
            selected: false,
            text: "Direct Placement",
            value: "Direct Placement",
          },
        ],
        isSearch: false,
      },
      {
        label: "Company Type",
        name: "companyTypeIds",
        child: filterList?.companyModel,
        isSearch: false,
      },
    ];
  },
  profileLogConfig: (profileLog) => {
    return [
      {
        id: "profileShared",
        // score: profileLog?.profileSharedCount,
        score: 60,
        label: "Profile Shared",
        activeColor: `var(--color-purple)`,
        typeID: ProfileLog.PROFILE_SHARED,
      },
      {
        id: "feedback",
        // score: profileLog?.feedbackCount,\
        score: 60,
        label: "Feedback Received",
        activeColor: `var(--color-cyan)`,
        typeID: ProfileLog.FEEDBACK,
      },
      {
        id: "rejected",
        // score: profileLog?.rejectedCount,
        score: 60,
        label: "Rejected",
        activeColor: `var(--color-danger)`,
        typeID: ProfileLog.REJECTED,
      },
      {
        id: "selected",
        // score: profileLog?.selectedForCount,
        score: 60,
        label: "Selected For",
        activeColor: `var(--color-success)`,
        typeID: ProfileLog.SELECTED,
      },
    ];
  },

  lostTabelConfig: (talentDtailOpen) => {
    return [
      {
        title: "HR #",
        dataIndex: "hR_Number",
        key: "hR_Number",
        align: "left",
        // render:(val)=> {
        // 	return val ? <FocusedRole /> : null
        // }
        width: '12%',
      },
      {
        title: "Sales User",
        dataIndex: "salesUser",
        key: "salesUser",
        align: "left",
        width:'120px'
      },
      {
        title: "Client Type",
        dataIndex: "clientType",
        key: "clientType",
        align: "left",
        width:'100px'
      },
      {
        title: "Client Email",
        dataIndex: "client",
        key: "client",
        align: "left",
		    width:'16%',
      },
      {
        title: "Company",
        dataIndex: "company",
        key: "company",
        align: "left",
        width:'10%',
      },
      {
        title: "Total TR",
        dataIndex: "totalTR",
        key: "totalTR",
        align: "left",
		    width:'70px',
      },
      {
        title: "Lost TR",
        dataIndex: "trLostCount",
        key: "trLostCount",
        align: "left",
		    width:'60px'
      },
      {
        title: "Created Date",
        dataIndex: "hrCreatedDate",
        key: "hrCreatedDate",
        align: "left",
        width: '8%',
        render: (val) => {
          return moment(val).format("DD-MM-yyyy");
        },
      },
      {
        title: "Lost Date",
        dataIndex: "lostDate",
        key: "lostDate",
        align: "left",
        width:'8%',
        render: (val) => {
          return moment(val).format("DD-MM-yyyy");
        },
      },
      {
        title: "Lost Reason",
        dataIndex: "lostReason",
        key: "lostReason",
        align: "left",
        width:'400px'
      },
      {
        title: "Lost Done By",
        dataIndex: "lostDoneBy",
        key: "lostDoneBy",
        align: "left",
        width:'100px'
      },
      {
        title: "Talent Details",
        dataIndex: ' ',
        key: ' ',
        align: "left",
        width: '10%',
        render: (_, values) => {
          return (
            <button
              className="telentDetailBtn"
              style={{
                background: "#FFDA30",
                border: "1px solid transparent",
                borderRadius: "8px",
                fontFamily: "Montserrat",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                padding: "7px",
                whiteSpace: "nowrap",
              }}
              onClick={() => talentDtailOpen(values)}
            >
              Talent Detail
            </button>
          );
        },
      },
    ];
  },
  lostTanlentTabelConfig: () => {
    return [
      {
        title: "Talent Name",
        dataIndex: "talentName",
        key: "talentName",
        align: "left",
      },
      {
        title: "Talent Email",
        dataIndex: "talentEmail",
        key: "talentEmail",
        align: "left",
      },
      {
        title: "Talent Status",
        dataIndex: "talentStatus",
        key: "talentStatus",
        align: "left",
      },
    ];
  },
};
