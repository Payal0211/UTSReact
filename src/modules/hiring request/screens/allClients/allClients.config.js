import { Link } from "react-router-dom";
import clienthappinessSurveyStyles from "../../../survey/client_happiness_survey.module.css";
import { ReactComponent as PencilSVG } from 'assets/svg/pencil.svg';
import { ReactComponent as NextWeekPriorityStar } from 'assets/svg/nextWeekPriorityStar.svg';
import { ReactComponent as NoPriorityStar } from 'assets/svg/noPriorityStar.svg';
import eyeIcon from 'assets/svg/eye.svg'
import { Button, Tooltip } from "antd";
import dealDetailsStyles from "../../../../modules/viewClient/viewClientDetails.module.css";
import moment from "moment";
import { result } from "lodash";
export const allClientsConfig = {
    allClientsTypeConfig : (filterList) => {
        return [
			// {
			// 	label: 'Status',
			// 	name: 'companyStatus',
			// 	child: filterList?.ContactStatus,
			// 	isSearch: false,
			// },
			{
				label: 'GEO',
				name: 'geo',
				child: filterList?.Geo,
				isSearch: true,
			},
            {
                label: 'Adding Source',
				name: 'addingSource',
				child: filterList?.AddingSource,
				isSearch: false,
            },
            {
                label: 'Lead Type',
				name: 'leadUserId',
				child: filterList?.LeadTypeList.filter(
					(item, index) => index !== 0 && item,
				),
				isSearch: false,
                isSingleSelect:true
            },
            {
                label: 'Category',
				name: 'category',
				child: filterList?.CompanyCategory,
				isSearch: false,
            },
            {
                label: 'POC',
				name: 'poc',
				child: filterList?.POCList,
				isSearch: true,
            },
            {
                label: 'Company Type',
				name: 'searchCompanyModel',
				child: filterList?.CompanyModel,
				// isSearch: true,
            }            		
		];
    },
    tableConfig : (editAMHandler,isShowAddClientCredit,createGspaceAPI,LoggedInUserTypeID,setIsPreviewModal,setcompanyID) => {
        // && LoggedInUserTypeID?.LoggedInUserTypeID == 2
        if(isShowAddClientCredit === true){
            return [
                {
                    title: 'SSO Login',
                    dataIndex: 'ssO_Login',
                    key: 'ssO_Login',
                    width: '150px',
                    render: (text, result) => {
                        let url = text + `&isInternal=${true}`
                        return (
                            result?.isActive === "yes" && result?.companyID !==0 && result?.clientID!==0 &&
                                <a
                                href={url}
                                target="_blank"
                                className={clienthappinessSurveyStyles.linkForSSO}
                                >
                                <button  className={clienthappinessSurveyStyles.btnPrimaryResendBtn}>Login with SSO</button>
                            </a>
                        );
                    },
                },
                {
                    title: '',
                    dataIndex: 'Edit',
                    key: 'edit',
                    align: 'center',
                    width: '60px',
                    render:(_,result) => {
                        return (<div style={{display:'flex'}}>
                        {isShowAddClientCredit=== true && result?.companyID !==0 && result?.clientID!==0 &&<Link
                            to={`/addNewCompany/${result.companyID}`}
                            style={{ color: 'black', textDecoration: 'underline' }}
                            onClick={()=>localStorage.setItem("clientID",result?.clientID)}>
                            <PencilSVG />
                        </Link>}
                        {(result.companyID !== 0  || result.clientID !== 0) &&  <div style={{marginLeft:'auto', cursor:'pointer',marginLeft:'10px'}}>
                                <Tooltip title="View Company Details" placement="right" >
                                <a href={`/viewCompanyDetails/${result.companyID}`} target="_blank">
                                    <img src={eyeIcon} alt='info' width="22" height="22"  />	
                                    {/* <EyeIcon /> */}
                                    </a>                               
                            </Tooltip> 
                            </div>}
                        </div>
                        
                        )
                    }
                },

                // {
                //     title: '',
                //     dataIndex: 'PreviewPage',
                //     key: 'preview',
                //     align: 'center',
                //     width: '50px',
                //     render:(_,result) => {
                //         return (
                //         isShowAddClientCredit=== true && result?.companyID !==0 && result?.clientID!==0 &&<div
                //             // to={`/editclient/${result.companyID}`}
                //             style={{ color: 'black', textDecoration: 'underline',cursor:"pointer" }}
                //             onClick={()=>{localStorage.setItem("clientID",result?.clientID);setIsPreviewModal(true);setcompanyID(result?.companyID)}}>
                //             <PencilSVG />
                //         </div>
                //         )
                //     }
                // },
            //     {
            //         title:'',
            //     dataIndex: 'View',
            //     key: 'view',
            //     align: 'center',
            //     width: '60px',
            // render:(_,result) => {
            //     if(result.companyID !== 0  || result.clientID !== 0){
            //     return <div style={{marginLeft:'auto', cursor:'pointer'}}>
            //                     <Tooltip title="View Company Details" placement="right" >
            //                     <a href={`/viewCompanyDetails/${result.companyID}`} target="_blank">
            //                         <img src={eyeIcon} alt='info' width="22" height="22"  />	
            //                         {/* <EyeIcon /> */}
            //                         </a>                               
            //                 </Tooltip> 
            //                 </div>
            //     }
                
            // }
            // },
                {
                    title: 'Added Date',
                    dataIndex: 'addedDate',
                    key: 'addedDate',
                    width: '120px',
                },
                {
                    title: 'Company',
                    dataIndex: 'companyName',
                    key: 'companyName',
                    width: '210px',
                    render: (text, result) => {
                        if(result.companyID === 0  || result.clientID=== 0){
                            return text
                        }
                        return (<div style={{display:'flex',alignItems:'center'}}> <Link
                                // to={`/viewClient/${result.companyID}~${result.clientID}`}
                                to={`/viewClient/${result.companyID}/${result.clientID}`}
                                target="_blank"
                                style={{
                                    color: `var(--uplers-black)`,
                                    textDecoration: 'underline',
                                }}>
                                {text}
                            </Link>
                            {/* <div style={{marginLeft:'auto', cursor:'pointer'}}>
                               <Tooltip title="View Company Details" placement="right" >
                                <a href={`/viewCompanyDetails/${result.companyID}`} target="_blank"><img src={eyeIcon} alt='info'  />	</a>                               
                            </Tooltip> 
                            </div> */}
                            
                            </div>
                           
                        );
                    },
                },
                {
                    title: 'Company Type',
                    dataIndex: 'companyModel',
                    key: 'companyModel',
                    width: '150px',
                },
                {
                    title: 'Credit Utilization',
                    dataIndex: 'creditUtilization',
                    key: 'creditUtilization',
                    width: '150px',
                },
                {
                    title: 'Client',
                    dataIndex: 'clientName',
                    key: 'clientName',
                    width: '150px',
                },
                {
                    title: 'Client Email',
                    dataIndex: 'clientEmail',
                    key: 'clientEmail',
                    width: '250px',
                },
                {
                    title: 'POC',
                    dataIndex: 'poc',
                    key: 'poc',
                    width: '200px',
                    // render: (text, result) => {
                    // 	return (
                    // 		<Link
                    // 			to={`/allclients`}
                    // 			style={{
                    // 				color: `var(--uplers-black)`,
                    // 				textDecoration: 'underline',
                    // 			}}>
                    // 			{text}
                    // 		</Link>
                    // 	);
                    // },
                },
                {
                    title: 'AM',
                    dataIndex: 'aM_UserName',
                    key: 'aM_UserName',
                    width: '200px',
                    render:(text,result)=>{
                        let data = {clientID: result?.clientID, companyID: result?.companyID }
                        return text ? <div className={clienthappinessSurveyStyles.AMNAME}  onClick={()=>editAMHandler(data)}>{text}</div> : null
                    }
                },
                // {
                //     title: 'Geo',
                //     dataIndex: 'geo',
                //     key: 'geo',
                //     width: '100px',
                // },
                {
                    title: 'Source',
                    dataIndex: 'inputSource',
                    key: 'inputSource',
                    width: '150px',            },
                {
                    title: 'Source Category',
                    dataIndex: 'sourceCategory',
                    key: 'sourceCategory',
                    width: '150px',            },
                // {
                //     title: 'Status',
                //     dataIndex: 'status',
                //     key: 'status',
                //     width: '150px',
                //     render: (text,result) => {
                //         return (
                //             text && <span 
                //              className={clienthappinessSurveyStyles.StatusOpportunity} 
                //              style={{backgroundColor:`${result.statusColor}`}} >{text}</span>			
                //         );
                //     },
                // },
                {
                    title: 'Invited By',
                    dataIndex: 'inviteName',
                    key: 'inviteName',
                    width: '150px',
                },
                {
                    title: 'Invited Date',
                    dataIndex: 'inviteDate',
                    key: 'inviteDate',
                    width: '150px',
                    render: (text) => {
                        if (!text) return null;
                        return text
                    },
                },
                {
                    title: 'Is Active',
                    dataIndex: 'isActive',
                    key: 'isActive',
                    width: '100px',                   
                },
              ]; 
        }else if (LoggedInUserTypeID?.LoggedInUserTypeID == 2){
            return [
                {
                    title: 'Create G-Space',
                    dataIndex: 'create_gspace',
                    key: 'create_gspace',
                    width: '150px',
                    render: (text, result) => {
                        if(result?.isGSpaceCreated === false){
                            return (                                    
                                <button  className={clienthappinessSurveyStyles.btnPrimaryResendBtn} onClick={()=>createGspaceAPI(result?.companyName,result?.clientEmail)}>Create G-Space</button>
                            );
                        }else{
                            return <span 
                             style={{color:"green",fontSize:"11px",fontWeight:"500"}} >G-Space Created</span>
                        }
                    },
                },
                {
                    title: '',
                    dataIndex: 'Edit',
                    key: 'edit',
                    align: 'center',
                    width: '50px',
                    render:(_,result) => {
                        return (
                        isShowAddClientCredit=== true && result?.companyID !==0 && result?.clientID!==0 &&<Link
                            to={`/editclient/${result.companyID}`}
                            style={{ color: 'black', textDecoration: 'underline' }}
                            onClick={()=>localStorage.setItem("clientID",result?.clientID)}>
                            <PencilSVG />
                        </Link>
                        )
                    }
                },

                // {
                //     title: '',
                //     dataIndex: 'PreviewPage',
                //     key: 'preview',
                //     align: 'center',
                //     width: '50px',
                //     render:(_,result) => {
                //         return (
                //         isShowAddClientCredit=== true && result?.companyID !==0 && result?.clientID!==0 &&<div
                //             // to={`/editclient/${result.companyID}`}
                //             style={{ color: 'black', textDecoration: 'underline',cursor:"pointer" }}
                //             onClick={()=>{localStorage.setItem("clientID",result?.clientID);setIsPreviewModal(true)}}>
                //             <PencilSVG />
                //         </div>
                //         )
                //     }
                // },
                
                {
                    title: 'Added Date',
                    dataIndex: 'addedDate',
                    key: 'addedDate',
                    width: '120px',
                },
                {
                    title: 'Company',
                    dataIndex: 'companyName',
                    key: 'companyName',
                    width: '210px',
                    render: (text, result) => {
                        if(result.companyID === 0  || result.clientID=== 0){
                            return text
                        }
                        return (
                            <Link
                                // to={`/viewClient/${result.companyID}~${result.clientID}`}
                                to={`/viewClient/${result.companyID}/${result.clientID}`}
                                target="_blank"
                                style={{
                                    color: `var(--uplers-black)`,
                                    textDecoration: 'underline',
                                }}>
                                {text}
                            </Link>
                        );
                    },
                },
                {
                    title: 'Company Type',
                    dataIndex: 'companyModel',
                    key: 'companyModel',
                    width: '150px',
                },
                {
                    title: 'Credit Utilization',
                    dataIndex: 'creditUtilization',
                    key: 'creditUtilization',
                    width: '150px',
                },
                {
                    title: 'Client',
                    dataIndex: 'clientName',
                    key: 'clientName',
                    width: '150px',
                },
                {
                    title: 'Client Email',
                    dataIndex: 'clientEmail',
                    key: 'clientEmail',
                    width: '200px',
                },
                {
                    title: 'POC',
                    dataIndex: 'poc',
                    key: 'poc',
                    width: '150px',
                    // render: (text, result) => {
                    // 	return (
                    // 		<Link
                    // 			to={`/allclients`}
                    // 			style={{
                    // 				color: `var(--uplers-black)`,
                    // 				textDecoration: 'underline',
                    // 			}}>
                    // 			{text}
                    // 		</Link>
                    // 	);
                    // },
                },
                {
                    title: 'AM',
                    dataIndex: 'aM_UserName',
                    key: 'aM_UserName',
                    width: '250px',
                    render:(text,result)=>{
                        let data = {clientID: result?.clientID, companyID: result?.companyID }
                        return text ? <div className={clienthappinessSurveyStyles.AMNAME}  onClick={()=>editAMHandler(data)}>{text}</div> : null
                    }
                },
                // {
                //     title: 'Geo',
                //     dataIndex: 'geo',
                //     key: 'geo',
                //     width: '100px',
                // },
                {
                    title: 'Source',
                    dataIndex: 'inputSource',
                    key: 'inputSource',
                    width: '150px',            },
                {
                    title: 'Source Category',
                    dataIndex: 'sourceCategory',
                    key: 'sourceCategory',
                    width: '150px',            },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    width: '150px',
                    render: (text,result) => {
                        return (
                            text && <span 
                             className={clienthappinessSurveyStyles.StatusOpportunity} 
                             style={{backgroundColor:`${result.statusColor}`}} >{text}</span>			
                        );
                    },
                },
                {
                    title: 'Invited By',
                    dataIndex: 'inviteName',
                    key: 'inviteName',
                    width: '150px',
                },
                {
                    title: 'Invited Date',
                    dataIndex: 'inviteDate',
                    key: 'inviteDate',
                    width: '150px',
                    render: (text) => {
                        if (!text) return null;
                        return moment(text).format('DD/MM/YYYY')
                    },
                },
                {
                    title: 'Is Active',
                    dataIndex: 'isActive',
                    key: 'isActive',
                    width: '100px',                   
                },
                // {
                //     title: 'SSO',
                //     dataIndex: 'ssO_Login',
                //     key: 'ssO_Login',
                //     width: '150px',
                //     render: (text, result) => {
                //         return (
                //             <a
                //                 href={text}
                //                 target="_blank"
                //                 className={clienthappinessSurveyStyles.linkForSSO}
                //                 >
                //                 <button  className={clienthappinessSurveyStyles.btnPrimaryResendBtn}>Login with SSO</button>
                //             </a>
                //         );
                //     },
                // },
              ]; 
        }else{
            return [
                {
                    title: '',
                    dataIndex: 'Edit',
                    key: 'edit',
                    align: 'center',
                    width: '50px',
                    render:(_,result) => {
                        return (
                        isShowAddClientCredit=== true && result?.companyID !==0 && result?.clientID!==0 &&<Link
                            to={`/editclient/${result.companyID}`}
                            style={{ color: 'black', textDecoration: 'underline' }}
                            onClick={()=>localStorage.setItem("clientID",result?.clientID)}>
                            <PencilSVG />
                        </Link>
                        )
                    }
                },

                // {
                //     title: '',
                //     dataIndex: 'PreviewPage',
                //     key: 'preview',
                //     align: 'center',
                //     width: '50px',
                //     render:(_,result) => {
                //         return (
                //         isShowAddClientCredit=== true && result?.companyID !==0 && result?.clientID!==0 &&<div
                //             // to={`/editclient/${result.companyID}`}
                //             style={{ color: 'black', textDecoration: 'underline',cursor:"pointer" }}
                //             onClick={()=>{localStorage.setItem("clientID",result?.clientID);setIsPreviewModal(true)}}>
                //             <PencilSVG />
                //         </div>
                //         )
                //     }
                // },
                
                {
                    title: 'Added Date',
                    dataIndex: 'addedDate',
                    key: 'addedDate',
                    width: '120px',
                },
                {
                    title: 'Company',
                    dataIndex: 'companyName',
                    key: 'companyName',
                    width: '210px',
                    render: (text, result) => {
                        if(result.companyID === 0  || result.clientID=== 0){
                            return text
                        }
                        return (
                            <Link
                                // to={`/viewClient/${result.companyID}~${result.clientID}`}
                                to={`/viewClient/${result.companyID}/${result.clientID}`}
                                target="_blank"
                                style={{
                                    color: `var(--uplers-black)`,
                                    textDecoration: 'underline',
                                }}>
                                {text}
                            </Link>
                        );
                    },
                },
                {
                    title: 'Company Type',
                    dataIndex: 'companyModel',
                    key: 'companyModel',
                    width: '150px',
                },
                {
                    title: 'Credit Utilization',
                    dataIndex: 'creditUtilization',
                    key: 'creditUtilization',
                    width: '150px',
                },
                {
                    title: 'Client',
                    dataIndex: 'clientName',
                    key: 'clientName',
                    width: '150px',
                },
                {
                    title: 'Client Email',
                    dataIndex: 'clientEmail',
                    key: 'clientEmail',
                    width: '200px',
                },
                {
                    title: 'POC',
                    dataIndex: 'poc',
                    key: 'poc',
                    width: '150px',
                    // render: (text, result) => {
                    // 	return (
                    // 		<Link
                    // 			to={`/allclients`}
                    // 			style={{
                    // 				color: `var(--uplers-black)`,
                    // 				textDecoration: 'underline',
                    // 			}}>
                    // 			{text}
                    // 		</Link>
                    // 	);
                    // },
                },
                {
                    title: 'AM',
                    dataIndex: 'aM_UserName',
                    key: 'aM_UserName',
                    width: '250px',
                    render:(text,result)=>{
                        let data = {clientID: result?.clientID, companyID: result?.companyID }
                        return text ? <div className={clienthappinessSurveyStyles.AMNAME}  onClick={()=>editAMHandler(data)}>{text}</div> : null
                    }
                },
                // {
                //     title: 'Geo',
                //     dataIndex: 'geo',
                //     key: 'geo',
                //     width: '100px',
                // },
                {
                    title: 'Source',
                    dataIndex: 'inputSource',
                    key: 'inputSource',
                    width: '150px',            },
                {
                    title: 'Source Category',
                    dataIndex: 'sourceCategory',
                    key: 'sourceCategory',
                    width: '150px',            },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    width: '150px',
                    render: (text,result) => {
                        return (
                            text && <span 
                             className={clienthappinessSurveyStyles.StatusOpportunity} 
                             style={{backgroundColor:`${result.statusColor}`}} >{text}</span>			
                        );
                    },
                },
                {
                    title: 'Invited By',
                    dataIndex: 'inviteName',
                    key: 'inviteName',
                    width: '150px',
                },
                {
                    title: 'Invited Date',
                    dataIndex: 'inviteDate',
                    key: 'inviteDate',
                    width: '150px',
                    render: (text) => {
                        if (!text) return null;
                        return moment(text).format('DD/MM/YYYY')
                    },
                },
                {
                    title: 'Is Active',
                    dataIndex: 'isActive',
                    key: 'isActive',
                    width: '100px',                   
                },
                // {
                //     title: 'SSO',
                //     dataIndex: 'ssO_Login',
                //     key: 'ssO_Login',
                //     width: '150px',
                //     render: (text, result) => {
                //         return (
                //             <a
                //                 href={text}
                //                 target="_blank"
                //                 className={clienthappinessSurveyStyles.linkForSSO}
                //                 >
                //                 <button  className={clienthappinessSurveyStyles.btnPrimaryResendBtn}>Login with SSO</button>
                //             </a>
                //         );
                //     },
                // },
              ]; 
        }
       
    },
    ViewClienttableConfig : (togglePriority,setModaljobpostDraft,setGuid) => {
        return [
            {
                title: '',
                dataIndex: 'starMarked',
                key: 'starMarked',
                width:'100px',
                render:(isMarked, result) => {
                if(result.hR_ID !== 0) 
                {
                    if(isMarked === true) {
                        return  <a href="javascript:void(0);" onClick={() => {
                                        let priorityObject = {
                                            isNextWeekStarMarked: '0',
                                            hRID: result.hR_ID,
                                            person: result.salesUserName,
                                        };
                                        togglePriority(priorityObject);
                                }
                        }><NextWeekPriorityStar />
                    </a>
                    }else {
                    return 	<a href="javascript:void(0);" onClick={() => {
                                        let priorityObject = {
                                            isNextWeekStarMarked: '1',
                                            hRID: result.hR_ID,
                                            person: result.salesUserName,
                                        };
                                        togglePriority(priorityObject);
                                }
                        }>
                            <NoPriorityStar />
                    </a>
                    }
                }
                }
            },
            {
                title: 'Created Date',
                dataIndex: 'createdDateTime',
                key: 'createdDateTime',
                width:'150px',
                render: (text, result) =>{                     
                    return (text.split('T')[0])
                },
            },
            {
                title: 'HR ID',
                dataIndex: 'hrNumber',
                key: 'hrNumber',
                width:'200px',
                render:(text,result) => {
                    return result.hR_ID === 0 ? <Button type="primary" className={dealDetailsStyles.viewJobBtn} onClick={() => {setModaljobpostDraft(true);setGuid(result.guid)}}>
                    View Job Post in Draft
                </Button> : text
                }
            },
            {
                title: 'TR',
                dataIndex: 'totalTR',
                key: 'totalTR',
                width:'100px'
            },
            {
                title: 'Position',
                dataIndex: 'position',
                key: 'position',
            },
            {
                title: 'Budget/Mo',
                dataIndex: 'cost',
                key: 'cost',
            },
            {
                title: 'Notice',
                dataIndex: 'notice',
                key: 'notice',
                width:'100px'
            },
            {
                title: 'FTE/PTE',
                dataIndex: 'ftE_PTE',
                key: 'ftE_PTE',
                width:'100px'
            },
            ]
    }
}