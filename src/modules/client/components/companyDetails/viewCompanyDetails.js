import React, { useEffect, useState, useMemo, useCallback } from "react";
import AddNewClientStyle from "../../screens/addnewClient/add_new_client.module.css";
import dealDetailsStyles from '../../../viewClient/viewClientDetails.module.css';
import { useParams , useNavigate} from "react-router-dom";
import { HubSpotDAO } from "core/hubSpot/hubSpotDAO";
import { MasterDAO } from "core/master/masterDAO";
import { DateTimeUtils } from "shared/utils/basic_utils";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import { Avatar, Tabs, Table, Skeleton, Checkbox, message, Modal } from "antd";
import { allClientRequestDAO } from "core/allClients/allClientsDAO";
import { allClientsConfig } from "modules/hiring request/screens/allClients/allClients.config";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import greenArrowLeftImage from "assets/svg/greenArrowLeft.svg";
import redArrowRightImage from "assets/svg/redArrowRight.svg";
import UTSRoutes from 'constants/routes';
import { Link } from "react-router-dom";
import Star from 'assets/svg/selectStarFill.svg';

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
    title: "Credit/Price",
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
  const [companyDetails, setCompanyDetails] = useState({});
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

  useEffect(() => {
    getCompanyDetails(CompanyID);
    getSalesMan();
    getCreditUtilization(CompanyID);
  }, [CompanyID]);

  const CompDetails = () => {
    return (
      <>
        <div
          className={AddNewClientStyle.viewHRDetailsItem}
          style={{ marginTop: "32px", marginBottom: "32px" }}
        >
          <div className={AddNewClientStyle.viewHRLeftDetails}>
            <h2>Company Details</h2>
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
                  }}
                >
                  {!companyDetails?.companyLogo ? (
                    <Avatar
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                      size="large"
                    >
                      {companyDetails?.companyName
                        ?.substring(0, 2)
                        .toUpperCase()}
                    </Avatar>
                  ) : (
                    <img
                      style={{
                        width: "145px",
                        height: "145px",
                        borderRadius: "50%",
                      }}
                      src={
                        NetworkInfo.PROTOCOL +
                        NetworkInfo.DOMAIN +
                        "Media/CompanyLogo/" +
                        companyDetails?.companyLogo
                      }
                      alt="preview"
                    />
                  )}
                </div>
                <div
                  className={AddNewClientStyle.viewHRDetailsBoxWrap}
                  style={{ marginTop: "10px" }}
                >
                  <div className={AddNewClientStyle.row}>
                    <div className={AddNewClientStyle.colLg6}>
                      <div className={AddNewClientStyle.viewHRDetailsBox}>
                        <ul>
                          <li>
                            <span>Company Name:</span>{" "}
                            {companyDetails?.companyName ?? "NA"}
                          </li>
                          <li>
                            <span>Company Location:</span>{" "}
                            {companyDetails?.location
                              ? companyDetails?.location
                              : "NA"}
                          </li>
                          <li>
                            {/* <span>Client Model:</span>{" "} */}
                            <Checkbox
                              value={2}
                              // onChange={(e)=>{setCheckPayPer({...checkPayPer,companyTypeID:e.target.checked===true ? e.target.value:0});setPayPerError(false);
                              // setIsChecked({...IsChecked,isPostaJob:false,isProfileView:false})}}
                              checked={companyDetails?.companyTypeID}
                              disabled={true}
                            >
                              Pay Per Credit
                            </Checkbox>
                            <Checkbox
                              value={1}
                              // onChange={(e)=>{setCheckPayPer({...checkPayPer,anotherCompanyTypeID:e.target.checked===true ? e.target.value:0});setPayPerError(false);setTypeOfPricing(null)}}
                              checked={companyDetails?.anotherCompanyTypeID}
                              disabled={true}
                            >
                              Pay Per Hire
                            </Checkbox>
                          </li>
                          {companyDetails?.companyTypeID !== 0 &&
                            companyDetails?.companyTypeID !== null && (
                              <li>
                                <span>Currency:</span>{" "}
                                {companyDetails?.creditCurrency
                                  ? companyDetails?.creditCurrency
                                  : "NA"}
                              </li>
                            )}

                          {companyDetails?.companyTypeID !== 0 &&
                            companyDetails?.companyTypeID !== null && (
                              <li>
                                <Checkbox
                                  name="IsPostaJob"
                                  checked={companyDetails?.isPostaJob}
                                  disabled={true}
                                >
                                  Credit per post a job.
                                </Checkbox>
                                {/* <Checkbox
                                  name="IsProfileView"
                                  checked={companyDetails?.isProfileView}
                                  disabled={true}
                                >
                                  Credit per profile view.
                                </Checkbox> */}
                              </li>
                            )}

                          {companyDetails?.companyTypeID !== 0 &&
                            companyDetails?.companyTypeID !== null &&
                            companyDetails?.isPostaJob && (
                              <li>
                                <span>Job post credit:</span>{" "}
                                {companyDetails?.jobPostCredit
                                  ? companyDetails?.jobPostCredit
                                  : "NA"}
                              </li>
                            )}

                            {!(companyDetails?.companyTypeID === 2 && companyDetails?.anotherCompanyTypeID === 0) && companyDetails?.isTransparentPricing !== null && <li>
                            <span>Type Of Pricing:</span>{" "}
                            {companyDetails?.isTransparentPricing
                              ? "Transparent Pricing"
                              : "Non Transparent Pricing"}
                          </li>}
                          
                          <li>
                            <span>Company Address:</span>{" "}
                            {companyDetails?.address
                              ? companyDetails?.address
                              : "NA"}
                          </li>

                          <li>
                            <span>Phone Number:</span>{" "}
                            {companyDetails?.phone
                              ? companyDetails?.phone
                              : "NA"}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className={AddNewClientStyle.colLg6}>
                      <div className={AddNewClientStyle.viewHRDetailsBox}>
                        <ul>
                          <li>
                            <span>Company URL:</span>{" "}
                            {companyDetails?.website ? (
                              <a
                                href={"//" + companyDetails?.website}
                                target="_blank"
                              >
                                {companyDetails?.website}
                              </a>
                            ) : (
                              "NA"
                            )}
                          </li>
                          <li>
                            <span>Company Size:</span>{" "}
                            {companyDetails?.companySize ?? "NA"}
                          </li>
                          {companyDetails?.companyTypeID !== 0 &&
                            companyDetails?.companyTypeID !== null && (
                              <>
                                <li>
                                  <span>Per credit amount:</span>{" "}
                                  {companyDetails?.creditAmount
                                    ? companyDetails?.creditAmount
                                    : "NA"}
                                </li>
                                <li>
                                  <span>Remaining Credit:</span>{" "}
                                  {companyDetails?.jpCreditBalance
                                    ? companyDetails?.jpCreditBalance
                                    : "NA"}
                                </li>

                                {companyDetails?.isProfileView && (
                                  <>
                                    {" "}
                                    <li>
                                      <span>Vetted Profile Credit:</span>{" "}
                                      {companyDetails?.vettedProfileViewCredit}
                                    </li>
                                    <li>
                                      <span>Non Vetted Profile Credit:</span>{" "}
                                      {
                                        companyDetails?.nonVettedProfileViewCredit
                                      }
                                    </li>
                                  </>
                                )}
                              </>
                            )}

                          <li>
                            <span>Linkedin Profile:</span>{" "}
                            {companyDetails?.linkedInProfile ? (
                              <a href={companyDetails?.link}>
                                {companyDetails?.linkedInProfile}
                              </a>
                            ) : (
                              "NA"
                            )}
                          </li>
                          <li>
                            <span>Lead Source:</span>{" "}
                            {companyDetails?.leadType
                              ? companyDetails?.leadType
                              : "NA"}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={AddNewClientStyle.viewHRDetailsBoxWrap}
                  style={{ marginTop: "10px" }}
                >
                  <div className={AddNewClientStyle.row}>
                    <div className={AddNewClientStyle.viewHRDetailsBox}>
                      <div className={AddNewClientStyle.colLg12}>
                        <ul>
                          <li>
                            <span>About Company:</span>{" "}
                            {companyDetails?.aboutCompanyDesc ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: companyDetails?.aboutCompanyDesc,
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

        <div className={AddNewClientStyle.viewHRDetailsItem}>
          <div className={AddNewClientStyle.viewHRLeftDetails}>
            <h2>Client Details</h2>
          </div>

          <div className={AddNewClientStyle.viewHRRightDetails}>
            {/* <div
style={{
width: "145px",
height: "145px",
backgroundColor: "#EBEBEB",
borderRadius: "50%",
display: "flex",
alignItems: "center",
textAlign: "center",
}}
>         
{!companyDetails?.companyLogo ? (
<Avatar 
style={{ width: "100%",
height: "100%", display: "flex",alignItems: "center"}} 
size="large">
{companyDetails?.companyName?.substring(0, 2).toUpperCase()}
</Avatar>
) : (
<img
style={{
width: "145px",
height: "145px",
borderRadius: "50%",
}}
src={
NetworkInfo.PROTOCOL +
NetworkInfo.DOMAIN +
"Media/CompanyLogo/" +
companyDetails?.companyLogo
}
alt="preview"
/>
)}
</div> */}

            {isSavedLoading ? (
              <Skeleton active />
            ) : (
              contactDetails?.map((contact, index) => (
                <div
                  className={AddNewClientStyle.viewHRDetailsBoxWrap}
                  key={contact?.fullName}
                  style={{ marginTop: index === 0 ? "0" : "10px" }}
                >
                  {" "}
                  <div className={AddNewClientStyle.row}>
                    <div className={AddNewClientStyle.colLg6}>
                      <div className={AddNewClientStyle.viewHRDetailsBox}>
                        <ul>
                          <li>
                            <span>Client Full Name:</span>{" "}
                            {contact?.fullName ? contact?.fullName : "NA"}
                          </li>
                          <li>
                            <span>Client's Phone Number:</span>{" "}
                            {contact?.contactNo ? contact?.contactNo : "NA"}
                          </li>
                          <li>
                            <span>Client Linkedin Profile:</span>{" "}
                            {contact?.linkedIn ? contact?.linkedIn : "NA"}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className={AddNewClientStyle.colLg6}>
                      <div className={AddNewClientStyle.viewHRDetailsBox}>
                        <ul>
                          <li>
                            <span>Client Email ID:</span>{" "}
                            {contact?.emailID ? contact?.emailID : "NA"}
                          </li>
                          <li>
                            <span>Designation:</span>{" "}
                            {contact?.designation ? contact?.designation : "NA"}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={AddNewClientStyle.viewHRDetailsItem}>
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
</li> */}
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
        </div>

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
            Credit/Price :{" "}
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
    if(contactDetails.length){
      getDataForViewClient(CompanyID,contactDetails[0].id)
    }
  },[
    CompanyID,contactDetails
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
        <div className={AddNewClientStyle.addHRTitle}>{companyDetails?.companyName ?? 'Company'} Details</div>

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
            companyDetails?.companyTypeID && {
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
