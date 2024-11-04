import React, { useEffect, useState, useMemo, useCallback } from "react";
import AddNewClientStyle from "../../screens/addnewClient/add_new_client.module.css";
import dealDetailsStyles from '../../../viewClient/viewClientDetails.module.css';
import { useParams , useNavigate} from "react-router-dom";
import { HubSpotDAO } from "core/hubSpot/hubSpotDAO";
import { MasterDAO } from "core/master/masterDAO";
import { DateTimeUtils } from "shared/utils/basic_utils";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import { Avatar, Tabs, Table, Skeleton, Checkbox, message, Modal, Select } from "antd";
import { allClientRequestDAO } from "core/allClients/allClientsDAO";
import { allClientsConfig } from "modules/hiring request/screens/allClients/allClients.config";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import greenArrowLeftImage from "assets/svg/greenArrowLeft.svg";
import redArrowRightImage from "assets/svg/redArrowRight.svg";
import WhatsAppBTN from 'assets/svg/WhatsApp.svg'
import ManageWhatsAppBTN from 'assets/svg/ManageWhatsApp.svg'
import UTSRoutes from 'constants/routes';
import { Link } from "react-router-dom";
import Star from 'assets/svg/selectStarFill.svg';
import spinGif from "assets/gif/RefreshLoader.gif";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import { allCompanyRequestDAO } from "core/company/companyDAO";
import YouTubeVideo from "../previewClientDetails/youTubeVideo";

const creditColumn = [
  {
    title: "Transaction Date",
    dataIndex: "createdByDate",
    key: "createdByDate",
    align: "left",
    width: "150px",
  },
   {
    title: "Client",
    dataIndex: "company",
    key: "company",
    align: "left",
    width: "160px",
    render: (_, val) => {
      return `${val.client}`;
    },
  },
  {
    title: "HR # / Job Title",
    dataIndex: "hrNumber",
    key: "hrNumber",
    align: "left",
    width: "250px",
    render: (text, result) => (<div style={{display:'flex', flexDirection:'column'}}> 
    <Link
        target="_blank"
        to={`/allhiringrequest/${result?.hrid}`}
        style={{ color: "black", textDecoration: "underline" , marginBottom:'5px'}}
        onClick={() => localStorage.removeItem("dealID")}
      >
        {text}
      </Link>
     {text && `${result.requestTalent}`} 
    </div>
     
    ),
  },
  {
    title: "Action",
    dataIndex: "actionDescription",
    key: "actionDescription",
    align: "left",
    width: "150px",
  },
 
 

  // {
  //   title: "Talent",
  //   dataIndex: "talentName",
  //   key: "talentName",
  //   align: "left",
  //   width: "200px",
  // },
  {
    title: "Credit Utilization",
    dataIndex: "creditUsed",
    key: "creditUsed",
    align: "left",
    width: "150px",
    render:(_,values) =>{
     return  <div className="balanceCredit">
      <h4>
        {values?.creditSpent}{" "}
        <img
          src={
            values?.creditDebit?.toLowerCase() === "credit"
              ? greenArrowLeftImage
              : redArrowRightImage
          }
          alt="icon"
        />
      </h4>
      <p>{values?.creditBalanceAfterSpent}</p>
    </div>
    }
  },
  // {
  //   title: "Credit Used",
  //   dataIndex: "creditUsed",
  //   key: "creditUsed",
  //   align: "left",
  //   width: "150px",
  // },

  {
    title: "Price/Credit",
    dataIndex: "amountPerCredit",
    key: "amountPerCredit",
    align: "left",
    width: "100px",
  },
  // {
  //   title: "Total",
  //   dataIndex: "amountPerCredit",
  //   key: "amountPerCredit",
  //   align: "left",
  //   width: "100px",
  //   render: (_, val) => {
  //     return val.amountPerCredit * val.creditUsed;
  //   },
  // },
  {
    title: "Currency",
    dataIndex: "creditCurrency",
    key: "creditCurrency",
    align: "left",
    width: "100px",
  },
];

export default function ViewCompanyDetails() {
  const navigate = useNavigate();
  const { CompanyID } = useParams();
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const [ isGroupCreating ,setIsgroupCreating] = useState(false)
  const [groupError,setGroupError] = useState('')
  const [companyDetails, setCompanyDetails] = useState({});
  const [companyPreviewData,setCompanyDetailsPreview] = useState({})
  const [contactDetails, setContactDetails] = useState([]);
  const [contactPoc, setContactPoc] = useState([]);
  const [companyContract, setCompanyContract] = useState({});
  const [salesMan, setSalesMan] = useState([]);
  const [title, setTitle] = useState("Company Details");
  const [creditUtilize, setCreditUtilize] = useState([]);
  const [viewDetails,setViewDetails] = useState({});
  const [jobpostDraft, setModaljobpostDraft] = useState(false);
  const [guid,setGuid] = useState('');
  const [draftJObPostDetails,setDraftJobPostDetails] = useState({});
  const [showwhatsAppmodal,setWhatsappModal] = useState(false)
  const [ wUsersToAdd,setWusersToAdd] = useState([]);

  const [selectedUsers,setSelectedUsers] = useState([]);

  const groupMemberColumns = [
    {
      title: "Name (Email)",
      dataIndex: "name",
      key: "name",
      align: "left",
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      key: "isAdmin",
      align: "center",
      render: (val) => {
        return val ? "YES" : "NO";
      },
    },
  ]


  const getCompanyDetails = async (ID) => {
    setIsSavedLoading(true);
    let companyDetailsData = await HubSpotDAO.getCompanyForEditDetailsDAO(ID);

    if (companyDetailsData?.statusCode === HTTPStatusCode.OK) {
      setIsSavedLoading(false);
      // console.log('companyDetailsData',companyDetailsData)
      let data = companyDetailsData.responseBody;
      // setClientDetailCheckList(contactDetails)
      setCompanyDetails(data.companyDetails);
      setContactDetails(data.contactDetails);
      setCompanyContract(data.companyContract);
      setContactPoc(data.contactPoc);
    }
    setIsSavedLoading(false);
  };

  const getSalesMan = async () => {
    let response = await MasterDAO.getSalesManRequestDAO();
    setSalesMan(response?.responseBody?.details);
  };

  const getCreditUtilization = async (ID) => {
    let payload = {
      CompanyId: ID,
      totalrecord: 100,
      pagenumber: 1,
    };
    let response = await allClientRequestDAO.getCreditUtilizationListDAO(
      payload
    );

    // console.log("credit res",response)
    if (response.statusCode === HTTPStatusCode.OK) {
      setCreditUtilize(response.responseBody);
    } else {
      setCreditUtilize([]);
    }
  };

  const getDetails = async (compID) => {
    setIsSavedLoading(true);
    const result = await allCompanyRequestDAO.getCompanyDetailDAO(compID);

    if (result?.statusCode === HTTPStatusCode.OK) {
      const data = result?.responseBody;
      setCompanyDetailsPreview(data)
      setIsSavedLoading(false);
    }
    setIsSavedLoading(false);
  };

  useEffect(() => {
    // getCompanyDetails(CompanyID);
    getDetails(CompanyID)
    getSalesMan();
    getCreditUtilization(CompanyID);
  }, [CompanyID]);

  const CreateWhatsAppGroup = async ()=>{
    setIsgroupCreating(true);
    setGroupError('')
    const selecteUserForGroup = wUsersToAdd.filter(wUser => 
      selectedUsers.map(user => user.userID).includes(wUser.userID)
    );
    
    const payload = {
      "companyID": +CompanyID,
      "companyName": companyPreviewData?.basicDetails?.companyName,
      "pocUserID": companyPreviewData?.pocUserDetailsEdit?.pocUserID,
    }
    let result 

    if(companyPreviewData?.whatsappDetails?.length > 0){
      // let addeUsers = selecteUserForGroup.filter(wUser => !wUser.groupID )
      // let removedUsers = companyPreviewData?.whatsappDetails?.filter(user => !selectedUsers.map(user => user.groupMember).includes(user.groupMember))
   let oldWhatsappusers = companyPreviewData?.whatsappDetails.map(user => {
    if(user.userID === 0){
      return {...user, userID: user.groupMember}
    }
    return user
   })
    let oldIDS = oldWhatsappusers?.map(wUser => wUser.userID).join(',')
    let newIDS = selecteUserForGroup.map(wUser => wUser.userID).join(',')
    // console.log("resadsfdsfds",{wUsersToAdd,selectedUsers,prev:companyPreviewData?.whatsappDetails})
    // console.log(oldIDS, newIDS , oldIDS === newIDS,companyPreviewData?.whatsappDetails , selecteUserForGroup )
      if(oldIDS === newIDS){
        setIsgroupCreating(false);
        message.error('No change applied to the group')
        return
      }
      let removedU =  oldWhatsappusers?.filter(wUser =>  !selectedUsers.map(wUser => wUser.userID).includes(wUser.userID))
      let added = wUsersToAdd.filter(wuser => !oldWhatsappusers?.map(i=> i.userID).includes(wuser.userID)).filter(wuser => selecteUserForGroup.map(wUser => wUser.userID).includes(wuser.userID))
     
// console.log(removedU, added )


      payload["whatsappMemberDetails"] = [...added?.map(item => ({
        "memberName": item.groupMember,
        "whatsappNumber": item.whatsappNumber,
        "userId": typeof item.userID === "string" ? 0 : item.userID,
        "admin": item.isAdmin,
        "memberFlag": "Add"
      })),
      ...removedU.filter(wu=> wu.groupMember  !== null)?.map(item => ({
        "memberName": item.groupMember,
        "whatsappNumber": item.whatsappNumber,
        "userId": typeof item.userID === "string" ? 0 : item.userID,
        "admin": item.isAdmin,
        "memberFlag": "Remove",
        "memberId": item.memberId,
      }))
      ]

      payload["groupId"]  = companyPreviewData?.whatsappDetails[0].groupID 
      payload["inviteLink"]  = companyPreviewData?.whatsappDetails[0].inviteURL
      result = await allCompanyRequestDAO.updateWhatsAppGroupDAO(payload)
    }else{
      payload["whatsappMemberDetails"] = selecteUserForGroup.map(item => ({
        "memberName": item.memberName ?? item.groupMember,
        "whatsappNumber": item.whatsappNumber,
        "userId": typeof item.userID === "string" ? 0 : item.userID,
        "admin": item.isAdmin,
        "memberFlag": "Add"
      }))

      result = await allCompanyRequestDAO.createWhatsAppGroupDAO(payload)
    }  

    if(result?.statusCode === HTTPStatusCode.OK){
      setCompanyDetailsPreview(prev => ({...prev,whatsappDetails:result.responseBody.WhatsappDetails, showWhatsappCTA: result.responseBody.ShowWhatsappCTA}))
      setWhatsappModal(false)
      setGroupError('')
    }

    if(result?.statusCode === HTTPStatusCode.BAD_REQUEST){
     setGroupError(result?.responseBody)
        }
    setIsgroupCreating(false);
  }

  const openWhatsAppmodal = ()=> {
    setWhatsappModal(true)
    let Poc = salesMan.find(val=> val.id === companyPreviewData?.pocUserDetailsEdit?.pocUserID)
 
    let userObj = {
      "detailID": 0,
      "groupID": null,
      "groupName": null,
      "groupCreatedBy": null,
      "groupCreatedDate": null,
      "groupMember": Poc?.value,
      "isAdmin": true,
      "employeeID": null,
      "whatsappNumber": Poc.contactNumber ,
      "memberId": null,
      "userID": Poc?.id
  }
    setWusersToAdd([userObj])
  }

  const openEditWhatsAppmodal =()=>{
    setWhatsappModal(true)
    let addedusers = companyPreviewData?.whatsappDetails?.map(user=> ({...user,userID: user.userID ? user.userID : user.groupMember }))
    setWusersToAdd(addedusers)
    if(addedusers[0].groupMember !== null     ){
      setSelectedUsers(addedusers.map(val=> ({userID: val.userID,groupMember:val.groupMember})))
    }
   
  }

  const addNewUserToAdd = () =>{
    let userObj = {
      "detailID": 0,
      "groupID": null,
      "groupName": null,
      "groupCreatedBy": null,
      "groupCreatedDate": null,
      "groupMember": null,
      "isAdmin": false,
      "employeeID": null,
      "whatsappNumber": null ,
      "memberId": null,
      "userID": null
  }

    setWusersToAdd(prev => [...prev , userObj])
  }

  const companyTypeMessages = [
    companyPreviewData?.engagementDetails?.anotherCompanyTypeID === 1 &&
      `Pay per Hire (${
        companyPreviewData?.engagementDetails?.isTransparentPricing
          ? "Transparent"
          : "Non Transparent"
      })`,
      companyPreviewData?.engagementDetails?.companyTypeID === 2 && "Pay per Credit",
  ]
    .filter(Boolean)
    .join(", ");

  const CompDetails = () => {
    return (
      <>
        <div
          className={AddNewClientStyle.viewHRDetailsItem}
          style={{ marginTop: "32px", marginBottom: "32px" }}
        >
          <div className={AddNewClientStyle.viewHRLeftDetails}>
            <h2>Basic Company Details</h2>
          </div>

          <div className={AddNewClientStyle.viewHRRightDetails}>
            {isSavedLoading ? (
              <Skeleton active />
            ) : (
              <>
                <div
                  style={{
                    width: "145px",
                    height: "145px",
                    backgroundColor: "#EBEBEB",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    marginBottom: '24px',
                  }}
                >
                  {!companyPreviewData?.basicDetails?.companyLogo ? (
                    <Avatar
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                      size="large"
                    >
                      {companyPreviewData?.basicDetails?.companyName
                        ?.substring(0, 2)
                        .toUpperCase()}
                    </Avatar>
                  ) : (
                    <img
                      style={{
                        width: "145px",
                        height: "145px",
                        borderRadius: "50%",
                        objectFit: "contain"
                      }}
                      src={
                        // NetworkInfo.PROTOCOL +
                        // NetworkInfo.DOMAIN +
                        // "Media/CompanyLogo/" +
                        companyPreviewData?.basicDetails?.companyLogo
                      }
                      alt="preview"
                    />
                  )}
                </div>
                <div className={AddNewClientStyle.viewHRDetailsBoxWrap}>
                  <div className={AddNewClientStyle.row}>
                    <div className={AddNewClientStyle.colLg12}>
                      <div className={`${AddNewClientStyle.viewHRDetailsBox} ${AddNewClientStyle.viewComDetails}`}>
                        <ul>
                          <li>
                            <label>Company Name:</label>
                            {companyPreviewData?.basicDetails?.companyName ?companyPreviewData?.basicDetails?.companyName: "NA"}
                          </li>

                          <li>
                            <label>Company Website URL:</label>
                            {companyPreviewData?.basicDetails?.website ? (
                              <a
                                href={"//" + companyPreviewData?.basicDetails?.website}
                                target="_blank"
                              >
                                {/* {companyDetails?.website} */}
                                {companyPreviewData?.basicDetails?.website}
                              </a>
                            ) : (
                              "NA"
                            )}
                          </li>

                          <li>
                            <label>Company Linkedin URL:</label>
                            {companyPreviewData?.basicDetails?.linkedInProfile ? (
                              <a href={companyPreviewData?.basicDetails?.linkedInProfile}>
                                {companyPreviewData?.basicDetails?.linkedInProfile}
                              </a>
                            ) : (
                              "NA"
                            )}
                          </li>

                          <li>
                            <label>Founded in:</label>
                            {companyPreviewData?.basicDetails?.foundedYear ?companyPreviewData?.basicDetails?.foundedYear: "NA"}
                          </li>

                          <li>
                            <label>Team Size:</label>
                            {companyPreviewData?.basicDetails?.teamSize ?? "NA"}
                          </li>

                          <li>
                            <label>Industry:</label>
                            {companyPreviewData?.basicDetails?.companyIndustry ?companyPreviewData?.basicDetails?.companyIndustry: "NA"}
                          </li>

                          <li>
                            <label>Headquarters:</label>
                            {companyPreviewData?.basicDetails?.headquaters
                              ? companyPreviewData?.basicDetails?.headquaters
                              : "NA"}
                          </li>

                        {companyPreviewData?.showWhatsappCTA ? <li>
                          <img
                            src={
                              WhatsAppBTN
                            }
                            style={{height:'40px',cursor:'pointer'}}
                            alt="icon"
                            onClick={() => {
                              // CreateWhatsAppGroup()
                              openWhatsAppmodal()
                            }}
                          />
                          {/* <button
                          type="submit"
                          onClick={() => {
                            // CreateWhatsAppGroup()
                            openWhatsAppmodal()
                          }}
                          disabled={isGroupCreating}
                          className={AddNewClientStyle.btnPrimaryResendBtn}
                        >
                           <img
                              src={
                                WhatsAppBTN
                              }
                              alt="icon"
                            />
                          {/* Create Whatsapp Group  
                        </button> */}

                          {isGroupCreating &&  <p style={{ fontWeight: "bold", color: "green",marginTop:'5px' }}>Creating Group ...  <img src={spinGif} alt="loadgif"  width={16} /></p>}
                            {groupError &&  <p  style={{marginTop:'5px',color:'red',fontWeight: "bold"}}>{groupError}</p>}
                              </li> : companyPreviewData?.whatsappDetails?.length > 0 && <li>
                              <img
                            src={
                              ManageWhatsAppBTN
                            }
                            style={{height:'40px',cursor:'pointer'}}
                            alt="icon"
                            onClick={() => {
                              // CreateWhatsAppGroup()
                              openEditWhatsAppmodal()
                            }}
                          />
                                {/* <button
                                type="submit"
                                onClick={() => {
                                  openEditWhatsAppmodal()
                                }}
                                // disabled={isGroupCreating}
                                className={`${AddNewClientStyle.btnPrimaryResendBtn} ${AddNewClientStyle.m0}`}
                              >
                                Manage Whatsapp Group 
                              </button> */}

                              {/* {isGroupCreating &&  <p style={{ fontWeight: "bold", color: "green",marginTop:'5px' }}>Creating Group ...  <img src={spinGif} alt="loadgif"  width={16} /></p>}
                            {groupError &&  <p  style={{marginTop:'5px',color:'red',fontWeight: "bold"}}>{groupError}</p>} */}
                          </li>}                         

                          <li className={AddNewClientStyle.aboutComDetails}>
                            <label>About Company:</label>{" "}
                            {companyPreviewData?.basicDetails?.aboutCompany ? (
                              <div
                              style={{marginTop:'10px'}}
                                dangerouslySetInnerHTML={{
                                  __html: companyPreviewData?.basicDetails?.aboutCompany,
                                }}
                              />
                            ) : (
                              "NA"
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        { companyPreviewData?.whatsappDetails?.length > 0 &&    <div className={AddNewClientStyle.viewHRDetailsItem}>
          <div className={AddNewClientStyle.viewHRLeftDetails}>
            <h2>Whatsapp Details</h2>
          </div>
          <div className={AddNewClientStyle.viewHRRightDetails}>
          {isSavedLoading ? (
              <Skeleton active />
            ): <div
            className={AddNewClientStyle.viewHRDetailsBoxWrap}
            style={{ marginTop: "10px" }}
          >
            
              <div className={AddNewClientStyle.row}>
                <div className={AddNewClientStyle.colLg12}>
                  <div className={`${AddNewClientStyle.viewHRDetailsBox} ${AddNewClientStyle.comEngDetails}`} style={{width:'100%'}}>
                
                    <ul>
                      <li>
                        <label>Group Name:</label>
                        {companyPreviewData?.whatsappDetails[0]?.groupName ? companyPreviewData?.whatsappDetails[0]?.groupName : (
                          "NA"
                        )}
                      </li>

                      <li>
                        <label>Group Created By:</label>
                        {companyPreviewData?.whatsappDetails[0]?.groupCreatedBy ? companyPreviewData?.whatsappDetails[0]?.groupCreatedBy : (
                          "NA"
                        )}
                      </li>

                      <li>
                        <label>Group Creation Date:</label>
                        {companyPreviewData?.whatsappDetails[0]?.groupCreatedDate ? companyPreviewData?.whatsappDetails[0]?.groupCreatedDate : (
                          "NA"
                        )}
                      </li>

                      <li className={`${AddNewClientStyle.fullWidth} ${AddNewClientStyle.comWAMember}`}>
                        <label>Group Members:</label>
                        <Table 
                    columns={groupMemberColumns}
                    bordered={false}
                    dataSource={
                      companyPreviewData?.whatsappDetails?.map(val=> ({name: val.groupMember, isAdmin: val.isAdmin}))
                    }
                    pagination={false}
                    />
                      </li>
                    </ul>                
                  </div>             
                </div>
            
              </div>
            
          </div> }
         
        
                </div>
        </div> }

        <div className={AddNewClientStyle.viewHRDetailsItem}>
          <div className={AddNewClientStyle.viewHRLeftDetails}>
            <h2>Funding Details</h2>
          </div>

          <div className={AddNewClientStyle.viewHRRightDetails}>
            {isSavedLoading ? (
              <Skeleton active />
            ) : (
              <div className={AddNewClientStyle.viewHRDetailsBoxWrap}>
                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colLg12}>
                    {companyPreviewData?.basicDetails?.isSelfFunded ===
                        false &&
                    
                     ( <div className={`${AddNewClientStyle.viewHRDetailsBox} ${AddNewClientStyle.comFundingDetails}`}>
                        <ul>
                          <li>
                            <label>Funding Round Series:</label>{" "}
                            {companyPreviewData?.fundingDetails[0]?.series ? companyPreviewData?.fundingDetails[0]?.series: "NA"}
                          </li>
                          <li>
                            <label>Funding Amount:</label>{" "}
                            {companyPreviewData?.fundingDetails[0]?.fundingAmount ? companyPreviewData?.fundingDetails[0]?.fundingAmount: "NA"}
                          </li>
                          <li>
                            <label>Latest Funding Round:</label>{" "}
                            {companyPreviewData?.fundingDetails[0]?.lastFundingRound ? companyPreviewData?.fundingDetails[0]?.lastFundingRound : "NA" }
                          </li>
                          <li className={AddNewClientStyle.fullWidth}>
                            <label>Investors:</label>{" "}
                            {companyPreviewData?.fundingDetails[0]?.allInvestors ? companyPreviewData?.fundingDetails[0]?.allInvestors: "NA"}
                          </li>
                          <li className={AddNewClientStyle.fullWidth}>
                              <label>Additional Information:</label>{" "}
                              {companyPreviewData?.fundingDetails[0]?.additionalInformation ? (
                                <div
                                style={{marginTop:'10px'}}
                                  dangerouslySetInnerHTML={{
                                    __html: companyPreviewData?.fundingDetails[0]?.additionalInformation,
                                  }}
                                />
                              ) : (
                                "NA"
                              )}
                          </li>
                        </ul>
                      </div>)}
                  
                  {companyPreviewData?.basicDetails?.isSelfFunded ===
                        true && <div className={`${AddNewClientStyle.viewHRDetailsBox} ${AddNewClientStyle.comFundingDetails}`}>
                          <ul>
                            <li className={AddNewClientStyle.fullWidth}>
                              <label className={AddNewClientStyle.m0}>Self-funded (bootstrapped) company without external investments.</label>
                            </li>
                          </ul>
                   </div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={AddNewClientStyle.viewHRDetailsItem}>
          <div className={AddNewClientStyle.viewHRLeftDetails}>
            <h2>Culture & Perks</h2>
          </div>

          <div className={AddNewClientStyle.viewHRRightDetails}>
            {isSavedLoading ? (
              <Skeleton active />
            ) : (
              <div className={AddNewClientStyle.viewHRDetailsBoxWrap}>
                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colLg12}>
                      <div className={`${AddNewClientStyle.viewHRDetailsBox} ${AddNewClientStyle.comCultureDetails}`}>
                        <ul>
                          <li>
                              <label>Culture:</label>
                              {companyPreviewData?.basicDetails?.culture ? (
                                <div dangerouslySetInnerHTML={{
                                    __html: companyPreviewData?.basicDetails?.culture,
                                  }}
                                />
                              ) : (
                                "NA"
                              )}
                          </li>
                          <li>
                            <div className={AddNewClientStyle.comDetailsImages}>
                              {companyPreviewData?.cultureDetails?.map((img, index) => (
                                <>
                                  <div className={AddNewClientStyle.comDetailsImgItem}>
                                    <div className={AddNewClientStyle.comDetailsImgInner}>
                                      <img src={img?.cultureImage} alt={index} />
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </li>
                          <li>
                            <div className={AddNewClientStyle.comDetailsVideos}>
                              {companyPreviewData?.youTubeDetails && companyPreviewData?.youTubeDetails?.map((link, index) => (
                                <>
                                  <div className={AddNewClientStyle.comDetailsVideoItem}>
                                    <YouTubeVideo
                                    videoLink={link?.youtubeLink}
                                    />
                                  </div>
                                </>
                              ))}
                            </div>
                          </li>
                          <li className={AddNewClientStyle.comHighlightedLabel}>
                            <label>Company perks & benefits:</label>
                            <ul>
                              {
                                companyPreviewData?.perkDetails ? companyPreviewData?.perkDetails?.map((val) => (
                                  <li>
                                    {val}
                                  </li>
                                )) : "NA"}
                            </ul> 
                          </li>
                        </ul>
                      </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      

        <div className={AddNewClientStyle.viewHRDetailsItem}>
          <div className={AddNewClientStyle.viewHRLeftDetails}>
            <h2>Client Details</h2>
          </div>

          <div className={AddNewClientStyle.viewHRRightDetails}>
            {isSavedLoading ? (
              <Skeleton active />
            ) : 
               ( <div
                  className={AddNewClientStyle.viewHRDetailsBoxWrap}
                  // key={contact?.fullName}
                  // style={{ marginTop: index === 0 ? "0" : "10px" }}
                >
                  <div className={AddNewClientStyle.row}>
                    <div className={AddNewClientStyle.colLg12}>
                      <div className={`${AddNewClientStyle.viewHRDetailsBox} ${AddNewClientStyle.comClientDetail}`}>
                        {companyPreviewData?.contactDetails?.map((contact, index) => (
                          <ul>
                            <li>
                              <label>Client Full Name:</label>
                              {contact?.fullName ? contact?.fullName : "NA"}
                            </li>
                            <li>
                              <label>Client’s Work Email:</label>
                              {contact?.emailID ? contact?.emailID : "NA"}
                            </li>
                            <li>
                              <label>Phone Number:</label>
                              {contact?.contactNo ? contact?.contactNo : "NA"}
                            </li>
                            <li>
                              <label>Designation:</label>
                              {contact?.designation ? contact?.designation : "NA"}
                            </li>
                            <li>
                              <label>Access Type:</label>
                              {(contact?.roleID == 1 && "Admin") ||
                                    (contact?.roleID == 2 && "All Jobs") ||
                                    (contact?.roleID == 3 && "My Jobs")}
                            </li>
                          </ul>
                         ))}
                      </div>
                    </div>
                  </div>             
                </div>
            )}
          </div>
        </div>

        <div className={AddNewClientStyle.viewHRDetailsItem}>
          <div className={AddNewClientStyle.viewHRLeftDetails}>
            <h2>Engagement Details</h2>
          </div>

          <div className={AddNewClientStyle.viewHRRightDetails}>
            {isSavedLoading ? (
              <Skeleton active />
            ) : (
              <div className={AddNewClientStyle.viewHRRightDetails}>
                <div
                  className={AddNewClientStyle.viewHRDetailsBoxWrap}>
                    <div className={AddNewClientStyle.row}>
                      <div className={AddNewClientStyle.colLg12}>
                        <div className={`${AddNewClientStyle.viewHRDetailsBox} ${AddNewClientStyle.comEngDetails}`}>
                          <ul>
                            {/* <li>
                              <span>Model:</span>{" "}
                              {companyTypeMessages ? companyTypeMessages : "NA"}
                            </li> */}
                            <li className={`${AddNewClientStyle.fullWidth} ${AddNewClientStyle.comEngCheckBox}`}>
                              <Checkbox
                                value={2}
                                checked={companyPreviewData?.engagementDetails?.companyTypeID}
                                disabled={true}
                              >
                                Pay Per Credit
                              </Checkbox>
                              <Checkbox
                                value={1}
                                checked={companyPreviewData?.engagementDetails?.anotherCompanyTypeID}
                                disabled={true}
                              >
                                Pay Per Hire
                              </Checkbox>
                            </li>
                            <li>
                              <label>Per Credit Amount:</label>
                              {companyPreviewData?.engagementDetails?.creditAmount
                              ? companyPreviewData?.engagementDetails
                                ?.creditAmount
                              : "NA"}
                            </li>
                            <li>
                              <label>Credit for viewing vetted profile:</label>
                              {companyPreviewData?.engagementDetails
                              ?.vettedProfileViewCredit
                              ? companyPreviewData?.engagementDetails
                                ?.vettedProfileViewCredit
                              : "NA"}
                            </li>
                            <li>
                              <label>Credit per post a job:</label>
                              {companyPreviewData?.engagementDetails?.jobPostCredit
                              ? companyPreviewData?.engagementDetails
                                ?.jobPostCredit
                              : "NA"}
                            </li>
                            {companyPreviewData?.engagementDetails?.companyTypeID !== 0 &&
                            companyPreviewData?.engagementDetails?.companyTypeID !== null && (
                              <li className={AddNewClientStyle.comEngCheckBox}>
                                <Checkbox
                                  name="IsPostaJob"
                                  checked={companyPreviewData?.engagementDetails?.isPostaJob}
                                  disabled={true}
                                >
                                  Credit per post a job.
                                </Checkbox>
                              </li>
                            )}

                            <li>
                              <label>Type Of Pricing:</label>
                              {companyPreviewData?.engagementDetails?.anotherCompanyTypeID === 1 ?
                                companyPreviewData?.engagementDetails?.isTransparentPricing ?
                                "Transparent" : "Non Transparent" 
                              :"NA"}
                            </li>

                            <li>
                              <label>Currency (Credit):</label>
                              {companyPreviewData?.engagementDetails
                              ?.creditCurrency
                              ? companyPreviewData?.engagementDetails
                                ?.creditCurrency
                              : "NA"}
                            </li>

                            <li>
                              <label>Total Credit Balance:</label>
                              {companyPreviewData?.engagementDetails
                              ?.totalCreditBalance
                              ? companyPreviewData?.engagementDetails
                                ?.totalCreditBalance
                              : "NA"}
                            </li>

                            <li>
                              <label>Credit for viewing non vetted profile:</label>
                              {companyPreviewData?.engagementDetails
                              ?.nonVettedProfileViewCredit
                              ? companyPreviewData?.engagementDetails
                                ?.nonVettedProfileViewCredit
                              : "NA"}
                            </li>

                            <li>
                              <label>Engagement Mode (Pay per hire):</label>
                              {companyPreviewData?.engagementDetails
                              ?.hiringTypePricingId === 1
                              ? `Hire a Contractor (${companyPreviewData?.hiringDetails?.filter((item)=>(item?.isDefault === true))?.[0]?.hiringTypePercentage}) %`
                              : companyPreviewData?.engagementDetails
                                ?.hiringTypePricingId === 2
                                ? `Hire an employee on Uplers Payroll (${companyPreviewData?.hiringDetails?.filter((item)=>(item?.isDefault === true))?.[0]?.hiringTypePercentage}) %`
                                : companyPreviewData?.engagementDetails
                                  ?.hiringTypePricingId === 3
                                  ? `Direct-hire (${companyPreviewData?.hiringDetails?.filter((item)=>(item?.isDefault === true))?.[0]?.hiringTypePercentage}) %`
                                  : companyPreviewData?.engagementDetails
                                    ?.hiringTypePricingId === 4
                                    ? `Hire a Contractor (${companyPreviewData?.hiringDetails?.filter((item)=>(item?.isDefault === true))?.[0]?.hiringTypePercentage}) %`
                                    : companyPreviewData?.engagementDetails
                                    ?.hiringTypePricingId === 5
                                    ? `Hire an employee on Uplers Payroll (${companyPreviewData?.hiringDetails?.filter((item)=>(item?.isDefault === true))?.[0]?.hiringTypePercentage}) %`:"NA"}
                            </li>

                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            )}
          </div>
        </div>

        <div className={AddNewClientStyle.viewHRDetailsItem}>
          <div className={AddNewClientStyle.viewHRLeftDetails}>
            <h2>Salesperson (NBD/AM)</h2>
          </div>

          <div className={AddNewClientStyle.viewHRRightDetails}>
            {isSavedLoading ? (
              <Skeleton active />
            ) : (
              <div className={AddNewClientStyle.viewHRRightDetails}>
                <div
                  className={AddNewClientStyle.viewHRDetailsBoxWrap}>
                    <div className={AddNewClientStyle.row}>
                      <div className={AddNewClientStyle.colLg12}>
                        <div className={AddNewClientStyle.viewHRDetailsBox}>
                          <div className={AddNewClientStyle.comHighlightedLabel}>
                            <ul>
                              <li>
                                {companyPreviewData?.pocUserDetailsEdit?.pocName ?? "NA"}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            )}
          </div>
        </div>

        {/* <div className={AddNewClientStyle.viewHRDetailsItem}>
          <div className={AddNewClientStyle.viewHRLeftDetails}>
            <h2>Legal Information</h2>
          </div>

          <div className={AddNewClientStyle.viewHRRightDetails}>
            {isSavedLoading ? (
              <Skeleton active />
            ) : (
              <div className={AddNewClientStyle.viewHRDetailsBoxWrap}>
                {" "}
                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colLg6}>
                    <div className={AddNewClientStyle.viewHRDetailsBox}>
                      <ul>
                        <li>
                          <span>Client Full Name:</span>{" "}
                          {companyContract?.signingAuthorityName
                            ? companyContract?.signingAuthorityName
                            : "NA"}
                        </li>
                        {/* <li>
<span>Client's Phone Number:</span>{" "}
{contact?.contactNo ? contact?.contactNo :
"NA"}
</li> 
                        <li>
                          <span>Legal Company Name:</span>{" "}
                          {companyContract?.legalCompanyName
                            ? companyContract?.legalCompanyName
                            : "NA"}
                        </li>
                        <li>
                          <span>Legal Company Address:</span>{" "}
                          {companyContract?.legalCompanyAddress
                            ? companyContract?.legalCompanyAddress
                            : "NA"}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className={AddNewClientStyle.colLg6}>
                    <div className={AddNewClientStyle.viewHRDetailsBox}>
                      <ul>
                        <li>
                          <span>Client Email ID:</span>{" "}
                          {companyContract?.signingAuthorityEmail
                            ? companyContract?.signingAuthorityEmail
                            : "NA"}
                        </li>
                        <li>
                          <span>Designation:</span>{" "}
                          {companyContract?.signingAuthorityDesignation
                            ? companyContract?.signingAuthorityDesignation
                            : "NA"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div> */}

        {/* <div
          className={AddNewClientStyle.viewHRDetailsItem}
          style={{ marginBottom: "30px" }}
        >
          <div className={AddNewClientStyle.viewHRLeftDetails}>
            <h2>Point of Contact</h2>
          </div>

          <div className={AddNewClientStyle.viewHRRightDetails}>
            {isSavedLoading ? (
              <Skeleton active />
            ) : (
              <div className={AddNewClientStyle.viewHRDetailsBoxWrap}>
                {" "}
                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colLg6}>
                    <div className={AddNewClientStyle.viewHRDetailsBox}>
                      <ul>
                        {contactPoc?.map((contact, index) => (
                          <li>
                            <span>{index + 1} :</span>{" "}
                            {
                              salesMan.find(
                                (item) => item.id === contact.userId
                              )?.value
                            }
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div> */}
      </>
    );
  };

  const CredUtilize = () => {
    return (
      <>
        <div className={AddNewClientStyle.summaryContainer}>
        <div className={AddNewClientStyle.summaryCard}>
            Total Credits :{" "}
            <span>
              {creditUtilize[0].creditBalance}
            </span>
          </div>
        <div className={AddNewClientStyle.summaryCard}>
            Credit Used :{" "}
            <span>
              {creditUtilize.map(item=> item.creditUsed).reduce((acc, crrent)=> crrent + acc , 0)}
            </span>
          </div>
          {/* <div className={AddNewClientStyle.summaryCard}>
            Vetted Count:{" "}
            <span>
              {creditUtilize.length > 0 ? creditUtilize[0].vettedCount : "NA"}
            </span>
          </div>
          <div className={AddNewClientStyle.summaryCard}>
            Non-Vetted Count:{" "}
            <span>
              {creditUtilize.length > 0
                ? creditUtilize[0].nonVettedCount
                : "NA"}
            </span>
          </div> */}
          <div className={AddNewClientStyle.summaryCard}>
            Credit Balance :{" "}
            <span>
              {creditUtilize.length > 0
                ? creditUtilize[0].jpCreditBalance
                : "NA"}
            </span>
          </div>     
          <div className={AddNewClientStyle.summaryCard}>
            Price/Credit :{" "}
            <span>
              {creditUtilize.length > 0 ? creditUtilize[0].currentAmount : "NA"}
            </span>
          </div>
          <div className={AddNewClientStyle.summaryCard}>
            Current Currency :{" "}
            <span>
              {creditUtilize.length > 0
                ? creditUtilize[0].currentCurrency
                : "NA"}
            </span>
          </div>
        </div>
        <Table
          scroll={{ y: "100vh" }}
          id="hrListingTable"
          columns={creditColumn}
          bordered={false}
          dataSource={creditUtilize}
          pagination={false}
        />
      </>
    );
  };

  const getDataForViewClient = async (CompanyID,clientID) => {
		// setLoading(true)
		let response = await allClientRequestDAO.getClientDetailsForViewDAO(CompanyID,clientID);	
		// setLoading(false);
		setViewDetails(response?.responseBody);	
	}

  useEffect(() => {
    if(companyPreviewData?.contactDetails?.length){
      getDataForViewClient(CompanyID, companyPreviewData?.contactDetails[0].id)
    }
  },[
    CompanyID, companyPreviewData?.contactDetails
  ])

  const togglePriority = useCallback(
		async (payload) => {
			setIsSavedLoading(true);

			let response = await hiringRequestDAO.setHrPriorityDAO(
				payload.isNextWeekStarMarked,
				payload.hRID,
				payload.person,
			);
			if (response.statusCode === HTTPStatusCode.OK) {
				// const { tempdata, index } = hrUtils.hrTogglePriority(response, viewDetails?.hrList);
				// setAPIdata([
				// 	...viewDetails?.hrList.slice(0, index),
				// 	tempdata,
				// 	...viewDetails?.hrList.slice(index + 1),
				// ]);
				getDataForViewClient(CompanyID,contactDetails[0].id)
				message.success(`priority has been changed.`)
				setIsSavedLoading(false);
			} else if (response.statusCode === HTTPStatusCode.NOT_FOUND) {
				message.error(response.responseBody)
				setIsSavedLoading(false);
			} else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
				setIsSavedLoading(false);
				return navigate(UTSRoutes.LOGINROUTE);
			} else if (
				response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
			) {
				setIsSavedLoading(false);
				return navigate(UTSRoutes.SOMETHINGWENTWRONG);
			} else {
				setIsSavedLoading(false);
				return 'NO DATA FOUND';
			}
		},
		[ navigate],
	);
		

  const columns = useMemo(
		() => allClientsConfig.ViewClienttableConfig(togglePriority,setModaljobpostDraft,setGuid),
	[]); 

  useEffect(() => {
		if(jobpostDraft){
			getJobPostDraftData();
		}else{
			setGuid("");
		}
	},[jobpostDraft]);
	
	const getJobPostDraftData = async () => {
		// setLoading(true)
		let response = await allClientRequestDAO.getDraftJobDetailsDAO(guid,contactDetails[0].id);	
		if(response.statusCode === HTTPStatusCode.Ok){
			setDraftJobPostDetails(response.responseBody);
		}
		// setLoading(false);
	}

  function testJSON(text) {
		if (typeof text !== "string") {
			return false;
		}
		try {
			JSON.parse(text);
			return true;
		} catch (error) {
			return false;
		}
	}

  const HrsDetails = () => {
    return <>
    {isSavedLoading ? (
              <Skeleton active />
            ) :  <Table 
				scroll={{  y: '100vh' }}
				dataSource={viewDetails?.hrList ? viewDetails?.hrList : []} 
				columns={columns} 
				pagination={false}
				/>
        }       
    </>
  }

  return (
    <>
      <div className={AddNewClientStyle.addNewContainer}>
        <div className={AddNewClientStyle.addHRTitle}>{companyPreviewData?.basicDetails?.companyName ?? 'Company'} Details</div>

        <Tabs
          onChange={(e) => setTitle(e)}
          defaultActiveKey="1"
          activeKey={title}
          animated={true}
          tabBarGutter={50}
          tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
          items={[
            {
              label: "Company Details",
              key: "Company Details",
              children: <CompDetails />,
            },
            {
              label: "HR's Details",
              key: "HR's Details",
              children: <HrsDetails />,
            },
            companyPreviewData?.engagementDetails?.companyTypeID && {
              label: "Credit Utilize",
              key: "Credit Utilize",
              children: <CredUtilize />,
            },
           
          ]}
        />
      </div>

      <Modal
				width={'864px'}
				centered
				footer={false}
				open={showwhatsAppmodal}
				className="jobpostDraftModal"
				onOk={() => setWhatsappModal(false)}
				onCancel={() => setWhatsappModal(false)}
			>
         <div className={AddNewClientStyle.engagementModalContainer}>
      <div className={AddNewClientStyle.updateTRTitle}>
        <h2>{companyPreviewData?.whatsappDetails?.length ? "Edit" : "Create"} Whatsapp Group</h2>
        {/* <p>{closeHRDetail?.ClientDetail?.HR_Number}</p> */}
      </div>

      <div className={AddNewClientStyle.row}>
{wUsersToAdd.map((user, index) => <div className={AddNewClientStyle.colMd12}>
          <div className={AddNewClientStyle.groupUserContainer}>
          <div style={{width:'150px'}}>
            {index === 0 ? <p className={AddNewClientStyle.titleName}>Default user</p> : index === wUsersToAdd.length  - 1 ? <div className={AddNewClientStyle.formPanelAction} >
            <button
              type="submit"
              className={AddNewClientStyle.btnPrimary}
              onClick={()=>addNewUserToAdd()}
            >
              Add User
            </button>
          </div> : null}
            </div>

            <div className={AddNewClientStyle.waSelectGroup}>
            <Select
              mode="tags"
              defaultValue={user.groupMember ?? "Select User"}
              value = {user.groupMember ?? []}
              // style={{ width: 120 }}
              disabled={selectedUsers.map(user => user.userID).includes(user.userID)}
              showSearch={true}
              onChange={(val,_)=> {

                if (_?.length === 0){
                  let obj ={
                    ...user,
                    "groupMember": null,
                    "whatsappNumber": '+91' ,
                    "userID": null
                }
                let usersToAddnewArr = [...wUsersToAdd] 
                usersToAddnewArr[index] = obj
                setWusersToAdd(usersToAddnewArr)
                }

                if (_?.length >= 1){
                    if(!_[_?.length - 1].id){
                      let obj ={
                        ...user,
                        "groupMember": val[_?.length - 1],
                        "whatsappNumber": '+91' ,
                        "userID": val[_?.length - 1]
                    }
                    let usersToAddnewArr = [...wUsersToAdd] 
                    usersToAddnewArr[index] = obj
                    setWusersToAdd(usersToAddnewArr)
                    }else{
                      let obj ={
                        ...user,
                        "groupMember": _[_?.length - 1].value,
                        "whatsappNumber": _[_?.length - 1].contactNumber === '' ? '+91' : _[_?.length - 1].contactNumber ,
                        "userID": _[_?.length - 1].id
                    }
                    let usersToAddnewArr = [...wUsersToAdd] 
                    usersToAddnewArr[index] = obj
                    setWusersToAdd(usersToAddnewArr)
                    }
                }else{
                  if(!_[0].id){
                    let obj ={
                      ...user,
                      "groupMember": val[0],
                      "whatsappNumber": '+91' ,
                      "userID": val[0]
                  }
                  let usersToAddnewArr = [...wUsersToAdd] 
                  usersToAddnewArr[index] = obj
                  setWusersToAdd(usersToAddnewArr)
                  }else{
                    let obj ={
                      ...user,
                      "groupMember": _[0].value,
                      "whatsappNumber": _[0].contactNumber === '' ? '+91' : _[0].contactNumber ,
                      "userID": _[0].id
                  }
                  let usersToAddnewArr = [...wUsersToAdd] 
                  usersToAddnewArr[index] = obj
                  setWusersToAdd(usersToAddnewArr)
                  }
                
                }
               
            }
            }
              options={salesMan}
            />
          </div>

          <div>
          <div className="phonConturyWrap">                                 
                                    <PhoneInput
                                        placeholder="Enter number"
                                        key={"Phone " + index}
                                        value={user.whatsappNumber}
                                        onChange={(value,__) => {
                                          let obj ={
                                            ...user,
                                            "whatsappNumber": value,
                                        }
                                        let usersToAddnewArr = [...wUsersToAdd] 
                                        usersToAddnewArr[index] = obj
                                        setWusersToAdd(usersToAddnewArr)
                                        }}
                                        country={'in'}
                                        disableSearchIcon={true}
                                        enableSearch={true}
                                        />
                                  </div>
          </div>
          <div>
          <div className={AddNewClientStyle.userPanelAction}>
            <button
              onClick={() => {
                setSelectedUsers(prev => [...prev, {userID: user.userID,groupMember:user.groupMember}])
              }}
              disabled={!user.groupMember ? !user.groupMember : selectedUsers.map(user => user.userID).includes(user.userID)  }
              className={AddNewClientStyle.btnPrimary}
            >
              Add
            </button>

            <button
              // type="submit"
              className={AddNewClientStyle.btnPrimaryRemove}
              disabled={!selectedUsers.map(user => user.userID).includes(user.userID)}
              onClick={()=>{
                setSelectedUsers(prev=> prev.filter(U=> U.userID !== user.userID))
              }}
            >
             Remove
            </button>
          </div>
          </div>
          </div>
        </div>)}
       
       {wUsersToAdd.length === 1 && <div className={AddNewClientStyle.formPanelAction} style={{marginLeft:'5px',padding:'12px 20px'}}>
            <button
              type="submit"
              className={AddNewClientStyle.btnPrimary}
              onClick={()=>addNewUserToAdd()}
            >
              Add User
            </button>
          </div>} 
      </div>

      <div className={AddNewClientStyle.row} style={{marginTop:'24px'}}>
        <div className={AddNewClientStyle.colMd12}>
          <p className={AddNewClientStyle.titleName}>Selected users to add in the group:</p>
          <ul className={AddNewClientStyle.userNameContainer} style={{padding:'8px 0'}}>
            
            {selectedUsers?.map(user =>{
            return <li>{user.groupMember}</li>
            })}
          </ul>
        </div>
      </div>
      {isGroupCreating &&  <p style={{ fontWeight: "bold", color: "green",marginTop:'5px',marginLeft:'20px' }}>{companyPreviewData?.whatsappDetails?.length ? "Updating" : "Creating"} Group ...  <img src={spinGif} alt="loadgif"  width={16} /></p>}
      {groupError &&  <p  style={{marginTop:'5px',color:'red',fontWeight: "bold",marginLeft:'20px'}}>{groupError}</p>}
      <div className={AddNewClientStyle.formPanelAction} style={{padding:'20px'}}>
            <button
              onClick={() => {
                setWhatsappModal(false)
              }}
              className={AddNewClientStyle.btn}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={AddNewClientStyle.btnPrimary}
              onClick={()=>{CreateWhatsAppGroup()}}
              disabled={selectedUsers.length === 0}
            >
              {companyPreviewData?.whatsappDetails?.length ? "Edit" : "Create"}
            </button>
          </div>
      </div>
    
        </Modal>

      <Modal
				width={'864px'}
				centered
				footer={false}
				open={jobpostDraft}
				className="jobpostDraftModal"
				onOk={() => setModaljobpostDraft(false)}
				onCancel={() => setModaljobpostDraft(false)}
			>
				<h2>Job Post in Draft</h2>
				 <div className={dealDetailsStyles.jobPostDraftContent}>
					<div className={dealDetailsStyles.jobPostDraftBox}>
						<div className={dealDetailsStyles.jobPostTopHeading}>
							<h4>Role and type of hiring</h4>
							<span>Last Edited on: { draftJObPostDetails?.JobDetails?.firstTabDate ? DateTimeUtils.getDateFromString(draftJObPostDetails?.JobDetails?.firstTabDate) : "-"}</span>
						</div>
						<div className={dealDetailsStyles.draftInnerContent}>
							<div className={dealDetailsStyles.jobRoleTypeBox}>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Title for this position</p>
									<h5>{draftJObPostDetails?.JobDetails?.roleName ? draftJObPostDetails?.JobDetails?.roleName : "-"}</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Number of Talents</p>
									<h5>{draftJObPostDetails?.JobDetails?.noOfTalents ? draftJObPostDetails?.JobDetails?.noOfTalents : "-"}</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Contract duration (In Months)</p>
									<h5>{draftJObPostDetails?.JobDetails?.contractDuration ? draftJObPostDetails?.JobDetails?.contractDuration : '-'}</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Years of Experience</p>
									<h5>{draftJObPostDetails?.JobDetails?.experienceYears ? draftJObPostDetails?.JobDetails?.experienceYears : "-"}</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Temporary or permenant hiring</p>
									<h5>{draftJObPostDetails?.JobDetails?.isHiringLimited ? draftJObPostDetails?.JobDetails?.isHiringLimited : "-"}</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Is this is a remote opportunity</p>
									<h5>{draftJObPostDetails?.JobDetails?.modeOfWorking === 'Remote' ? 'Yes' : 'No'}</h5>
								</div>
							</div>
						</div>
					</div>

					<div className={dealDetailsStyles.jobPostDraftBox}>
						<div className={dealDetailsStyles.jobPostTopHeading}>
							<h4>Skills and Budget</h4>
							<span>Last Edited on: {draftJObPostDetails?.JobDetails?.secondTabDate ? DateTimeUtils.getDateFromString(draftJObPostDetails?.JobDetails?.secondTabDate) : "-"}</span>
						</div>
						<div className={dealDetailsStyles.draftInnerContent}>
							<div className={`${dealDetailsStyles.jobRoleTypeBox} ${dealDetailsStyles.SkillBudget}`}>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Top 5 must have skills</p>
									<ul className={dealDetailsStyles.SkillWrapBox}>
										{draftJObPostDetails?.JobDetails?.skills?.split(",")?.map((skill,index) => {
											return <li key={index}><img className={dealDetailsStyles.starIcon} src={Star} alt="star"/> {skill} </li>
										})}								
									</ul>									
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Good to have skills</p>
									<ul className={dealDetailsStyles.SkillWrapBox}>
										{draftJObPostDetails?.JobDetails?.allSkills?.split(",")?.map((skill,index) => {
											return (
												<li key={index}>{skill}</li>
											)
										})}								
									</ul>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Budget in mind (Monthly)</p>
									<h5>{draftJObPostDetails?.JobDetails?.currency} {draftJObPostDetails?.JobDetails?.budgetFrom} - {draftJObPostDetails?.JobDetails?.budgetTo}/month</h5>
								</div>
							</div>
						</div>
					</div>

					<div className={dealDetailsStyles.jobPostDraftBox}>
						<div className={dealDetailsStyles.jobPostTopHeading}>
							<h4>Employment details</h4>
							<span>Last Edited on: {draftJObPostDetails?.JobDetails?.thirdTabDate ? DateTimeUtils.getDateFromString(draftJObPostDetails?.JobDetails?.thirdTabDate) : "-"}</span>
						</div>
						<div className={dealDetailsStyles.draftInnerContent}>
							<div className={`${dealDetailsStyles.jobRoleTypeBox} ${dealDetailsStyles.employDetailWrap}`}>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Employment type </p>
									<h5>{draftJObPostDetails?.JobDetails?.employmentType ? draftJObPostDetails?.JobDetails?.employmentType : "-"}</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Timezone - Shift Time</p>
									<h5>{draftJObPostDetails?.JobDetails?.timeZone} - {draftJObPostDetails?.JobDetails?.timeZone_FromTime}-{draftJObPostDetails?.JobDetails?.timeZone_EndTime}</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Talent to start</p>
									<h5>{draftJObPostDetails?.JobDetails?.howSoon ? draftJObPostDetails?.JobDetails?.howSoon : "-"}</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Achieve with Uplers</p>
									<h5>{draftJObPostDetails?.JobDetails?.reason ? draftJObPostDetails?.JobDetails?.reason : "-"}</h5>
								</div>
							</div>
						</div>
					</div>

					<div className={dealDetailsStyles.jobPostDraftBox}>
						<div className={dealDetailsStyles.jobPostTopHeading}>
							<h4>JD/Responsibilities & requirements</h4>
							<span>Last Edited on: {draftJObPostDetails?.JobDetails?.fourthTabDate ? DateTimeUtils.getDateFromString(draftJObPostDetails?.JobDetails?.fourthTabDate) : "-"}</span>
						</div>
						<div className={dealDetailsStyles.draftInnerContent}>
							<div className={`${dealDetailsStyles.jobRoleTypeBox} ${dealDetailsStyles.SkillBudget}`}>
								{draftJObPostDetails?.JobDetails?.processType === "JDFileUpload"  ? 
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Upload your JD</p>
									<a href={draftJObPostDetails?.JDLink} target="_blank">Download JD</a>
								</div>: 
								(draftJObPostDetails?.JobDetails?.processType === "URL_Parsing"  || draftJObPostDetails?.JobDetails?.processType === "JDURLParsingGenerated")?
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>JD Link</p>
									<a href={draftJObPostDetails?.JDLink} target="_blank">{draftJObPostDetails?.JobDetails?.jdLink}</a>
								</div> : ""								
								}
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Roles & Responsibilities </p>										
									
									{draftJObPostDetails?.JobDetails?.rolesResponsibilities ? testJSON(draftJObPostDetails?.JobDetails?.rolesResponsibilities) ? <ul className={dealDetailsStyles.jdRequrementText}>
									{JSON.parse(draftJObPostDetails?.JobDetails?.rolesResponsibilities).map(text=> <li dangerouslySetInnerHTML={{ __html: text}} />)} </ul>: <div  dangerouslySetInnerHTML={{ __html: draftJObPostDetails?.JobDetails?.rolesResponsibilities}} /> 
									: "-"}									
									
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Requirements</p>
									
										{(!draftJObPostDetails?.JobDetails?.requirements || draftJObPostDetails?.JobDetails?.requirements === "[]") ?  
										"-" : testJSON(draftJObPostDetails?.JobDetails?.requirements) ? <ul className={dealDetailsStyles.jdRequrementText}>{JSON.parse(draftJObPostDetails?.JobDetails?.requirements).map(text=> <li dangerouslySetInnerHTML={{ __html: text}} />)}</ul> : 
										<div  dangerouslySetInnerHTML={{ __html: draftJObPostDetails?.JobDetails?.requirements}} /> }										
									
								</div>
							</div>
						</div>
					</div>

					{/* <div className={dealDetailsStyles.jobPostDraftBox}>
						<div className={dealDetailsStyles.jobPostTopHeading}>
							<h4>Job Description</h4>
							<span>Last Edited on: 2-10-2023</span>
						</div>
						<div className={dealDetailsStyles.draftInnerContent}>
							<div className={`${dealDetailsStyles.jobRoleTypeBox} ${dealDetailsStyles.SkillBudget}`}>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Upload your JD</p>
									<a href="#">Download JD</a>
								</div>
							</div>
						</div>
					</div> */}
				</div>
			</Modal>
    </>
  );
}