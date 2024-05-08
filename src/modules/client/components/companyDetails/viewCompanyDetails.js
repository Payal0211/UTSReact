import React, { useEffect, useState } from "react";
import AddNewClientStyle from "../../screens/addnewClient/add_new_client.module.css";
import { useParams } from "react-router-dom";
import { HubSpotDAO } from "core/hubSpot/hubSpotDAO";
import { MasterDAO } from "core/master/masterDAO";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import { Avatar, Tabs, Table, Skeleton, Checkbox } from "antd";
import { allClientRequestDAO } from "core/allClients/allClientsDAO";

const creditColumn = [
  {
    title: "Created Date",
    dataIndex: "createdByDate",
    key: "createdByDate",
    align: "left",
    width: "150px",
  },
  {
    title: "Package",
    dataIndex: "packageName",
    key: "packageName",
    align: "left",
    width: "100px",
  },
  {
    title: "Client (Company)",
    dataIndex: "company",
    key: "company",
    align: "left",
    width: "300px",
    render: (_, val) => {
      return `${val.client} (${val.company})`;
    },
  },
  {
    title: "HR #",
    dataIndex: "hrNumber",
    key: "hrNumber",
    align: "left",
    width: "200px",
  },

  {
    title: "Talent",
    dataIndex: "talentName",
    key: "talentName",
    align: "left",
    width: "200px",
  },
  {
    title: "Credit Used",
    dataIndex: "creditUsed",
    key: "creditUsed",
    align: "left",
    width: "150px",
  },

  {
    title: "Credit/Price",
    dataIndex: "creditBalance",
    key: "creditBalance",
    align: "left",
    width: "150px",
  },
  {
    title: "Total",
    dataIndex: "amountPerCredit",
    key: "amountPerCredit",
    align: "left",
    width: "100px",
    render: (_, val) => {
      return val.creditBalance * val.creditUsed;
    },
  },
  {
    title: "Currency",
    dataIndex: "creditCurrency",
    key: "creditCurrency",
    align: "left",
    width: "100px",
  },
];

export default function ViewCompanyDetails() {
  const { CompanyID } = useParams();
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({});
  const [contactDetails, setContactDetails] = useState([]);
  const [contactPoc, setContactPoc] = useState([]);
  const [companyContract, setCompanyContract] = useState({});
  const [salesMan, setSalesMan] = useState([]);
  const [title, setTitle] = useState("Company Details");
  const [creditUtilize, setCreditUtilize] = useState([]);

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
                                <Checkbox
                                  name="IsProfileView"
                                  checked={companyDetails?.isProfileView}
                                  disabled={true}
                                >
                                  Credit per profile view.
                                </Checkbox>
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
                          <li>
                            <span>Type Of Pricing:</span>{" "}
                            {companyDetails?.isTransparentPricing
                              ? "Transparent Pricing"
                              : "Non Transparent Pricing"}
                          </li>
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

        <div
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
        </div>
      </>
    );
  };

  const CredUtilize = () => {
    return (
      <>
        <div className={AddNewClientStyle.summaryContainer}>
          <div className={AddNewClientStyle.summaryCard}>
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
          </div>
          <div className={AddNewClientStyle.summaryCard}>
            JP Credit Balance:{" "}
            <span>
              {creditUtilize.length > 0
                ? creditUtilize[0].jpCreditBalance
                : "NA"}
            </span>
          </div>
          <div className={AddNewClientStyle.summaryCard}>
            Current Amount:{" "}
            <span>
              {creditUtilize.length > 0 ? creditUtilize[0].currentAmount : "NA"}
            </span>
          </div>
          <div className={AddNewClientStyle.summaryCard}>
            Current Currency:{" "}
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

  return (
    <>
      <div className={AddNewClientStyle.addNewContainer}>
        <div className={AddNewClientStyle.addHRTitle}>Company Details</div>

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
            companyDetails?.companyTypeID && {
              label: "Credit Utilize",
              key: "Credit Utilize",
              children: <CredUtilize />,
            },
          ]}
        />
      </div>
    </>
  );
}
