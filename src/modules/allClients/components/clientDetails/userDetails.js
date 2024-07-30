import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import userDetails from "./userDetails.module.css";
import { InputType } from "constants/application";
import { useForm } from "react-hook-form";
import { _isNull } from "shared/utils/basic_utils";
import { useCallback, useEffect, useState } from "react";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { HTTPStatusCode } from "constants/network";
import { allClientRequestDAO } from "core/allClients/allClientsDAO";
import { useNavigate } from "react-router-dom";
import UTSRoutes from "constants/routes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AutoComplete, Checkbox, Dropdown, Menu, Radio, Select, Spin } from "antd";
import LogoLoader from "shared/components/loader/logoLoader";
import WithLoader from "shared/components/loader/loader";

const UserDetails = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [IsChecked, setIsChecked] = useState({
    IsPostaJob: false,
    IsProfileView: false,
    IsHybridModel: false,
  });


  const [clientModel, setClientModel] = useState({
    PayPerCredit:false,
    PayPerHire:false
  });
  const[pricingOption,setPricingOption]=useState(null)
  const[pricingOptionError,setPricingOptionError]=useState(false)
  const[currency,setcurrency]=useState("")

  const [error, setErrors] = useState(false);
  const [errorClient, seterrorClient] = useState(false);

  const [errorPOCName, setErrorsPocName] = useState(false);
  const [profileSharingOptionError, setProfileSharingOptionError] =
  useState(false);
  const [profileSharingOption, setProfileSharingOption] = useState(null);
  const [errorData, setErrorsData] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [errorCurrency, seterrorCurrency] = useState(false);

  const [pocName, setPOCName] = useState([]);
  let fullname = JSON.parse(localStorage.getItem('userSessionInfo'))
  const [inputValue, setInputValue] = useState({
    id:"",
    value:"",
  });
  const {
    watch,
    register,
    setError,
    formState: { errors },
  } = useForm();

  let full_name = watch("fullName");
  let company_name = watch("companyName");
  let company_URL = watch("companyURL")
  let work_email = watch("workEmail");
  let free_credits = watch("freeCredits");
  let creditAmount= watch("creditAmount");
  let jobPostCredit=watch("jobPostCredit");
  let vettedProfileViewCredit= watch("vettedProfileViewCredit");
  let nonVettedProfileViewCredit= watch("nonVettedProfileViewCredit");
  const handleChange=(value)=>{
     setcurrency(value);
     seterrorCurrency(false);
  }
  useEffect(() => {
    if (nonVettedProfileViewCredit) {
      setError("nonVettedProfileViewCredit", null);
    }
  }, [nonVettedProfileViewCredit]);
  
  useEffect(() => {
    if (vettedProfileViewCredit) {
      setError("vettedProfileViewCredit", null);
    }
  }, [vettedProfileViewCredit]);
  useEffect(() => {
    if (jobPostCredit) {
      setError("jobPostCredit", null);
    }
  }, [jobPostCredit]);
  useEffect(() => {
    if (full_name) {
      setError("fullName", null);
    }
  }, [full_name]);
  useEffect(() => {
    if (company_name) {
      setError("companyName", null);
    }
  }, [company_name]);
  useEffect(() => {
    if(company_URL){
      setError("companyURL",null);
    }
  },[company_URL])
  useEffect(() => {
    if (work_email) {
      setError("workEmail", null);
    }
  }, [work_email]);
  useEffect(() => {
    if (creditAmount) {
      setError("creditAmount", null);
    }
  }, [creditAmount]);
  useEffect(() => {
    if (free_credits) {
      setError("freeCredits", null);
    }
  }, [free_credits]);
 

  const handleSubmit = () => {
    let isValid = true;
    let emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    // let companyurlRegex =  /^(http|https):\/\/[a-zA-Z0-9. -]+\.[a-zA-Z]{2,}$/;
    let companyurlRegex =  /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\.[a-zA-Z]{2,})?\/?\/?.*$/i;
    if (_isNull(full_name)) {
      isValid = false;
      setError("fullName", {
        type: "fullName",
        message: "please enter client full name.",
      });
    }
    if (_isNull(company_name)) {
      isValid = false;
      setError("companyName", {
        type: "companyName",
        message: "please enter company name.",
      });
    }
    if (_isNull(company_URL)) {
      isValid = false;
      setError("companyURL", {
        type: "companyURL",
        message: "please enter company url.",
      });
    }else if(!companyurlRegex.test(company_URL)){
      isValid = false;
      setError("companyURL", {
        type: "companyURL",
        message: "please enter a valid company url.",
      });
    }
    if (_isNull(work_email)) {
      isValid = false;
      setError("workEmail", {
        type: "workEmail",
        message: "please enter work email.",
      });
    } else if (!emailRegex.test(work_email)) {
      isValid = false;
      setError("workEmail", {
        type: "workEmail",
        message: "Please enter a valid work email.",
      });
    }
    if(clientModel?.PayPerCredit){
      if (IsChecked?.IsPostaJob === false && IsChecked?.IsProfileView === false) {
        setErrors(true);
        isValid = false;
      }
      if (_isNull(free_credits)) {
        isValid = false;
        setError("freeCredits", {
          type: "freeCredits",
          message: "please enter free credits.",
        });
      } else if (free_credits < 1) {
        isValid = false;
        setError("freeCredits", {
          type: "freeCredits",
          message: "please enter value more than 0.",
        });
      } else if (free_credits > 999) {
        isValid = false;
        setError("freeCredits", {
          type: "freeCredits",
          message: "please do not enter value more than 3 digits.",
        });
      }
      if(_isNull(creditAmount)){
        isValid = false;
        setError("creditAmount", {
          type: "creditAmount",
          message: "please enter credits amount.",
        });
      }
      if(clientModel.PayPerCredit && currency ===  ""){
        isValid = false;
       seterrorCurrency(true)
      }
      if(IsChecked?.IsPostaJob && _isNull(jobPostCredit)){
        isValid = false;
        setError("jobPostCredit", {
          type: "jobPostCredit",
          message: "please enter job post credits.",
        });
      }
    }  
    if(clientModel?.PayPerCredit  === false && clientModel?.PayPerHire === false){
      seterrorClient(true);
        isValid = false;
    } 
    if (inputValue?.id===undefined && inputValue?.value===undefined) {
      setErrorsPocName(true);
      isValid = false;
    }
    if(clientModel.PayPerHire === true && pricingOption === null){
      setPricingOptionError(true);
      isValid = false;
    }
    // if (IsChecked?.IsProfileView === true && profileSharingOption === null) {
    //   setProfileSharingOptionError(true);
    //   isValid = false;
    // }
    if (IsChecked?.IsProfileView === true && _isNull(vettedProfileViewCredit)) {
      isValid = false;
      setError("vettedProfileViewCredit", {
        type: "vettedProfileViewCredit",
        message: "please enter vetted profile credit.",
      });
    }
    if (IsChecked?.IsProfileView === true && _isNull(nonVettedProfileViewCredit)  ) {
      isValid = false;
      setError("nonVettedProfileViewCredit", {
        type: "nonVettedProfileViewCredit",
        message: "please enter non vetted profile credit.",
      });
    }
    if (isValid) {
      onSubmitData();
    }
  };

  const onSubmitData = async () => {
    setIsLoading(true);
    let payload = {
      fullName: full_name,
      workEmail: work_email,
      companyName: company_name,
      companyURL:company_URL,
      freeCredit:clientModel.PayPerCredit === true ? Number(free_credits):0,
      IsPostaJob: clientModel.PayPerCredit === true ?IsChecked?.IsPostaJob :false,
      IsHybridModel: clientModel.PayPerCredit === true && clientModel.PayPerHire=== true ? true:false ,
      IsVettedProfile: IsChecked.IsProfileView ? profileSharingOption:null,
      poC_ID:inputValue?.id,
      isTransparentPricing:clientModel.PayPerHire ?pricingOption:null,
      creditCurrency:clientModel.PayPerCredit === true ?currency:null,
      isProfileView:clientModel.PayPerCredit === true ?IsChecked?.IsProfileView:false,
      creditAmount:clientModel.PayPerCredit === true ?parseInt(creditAmount):0,
      jobPostCredit:clientModel.PayPerCredit === true && IsChecked.IsPostaJob?parseInt(jobPostCredit):0,
      vettedProfileViewCredit: clientModel.PayPerCredit === true &&IsChecked.IsProfileView ?vettedProfileViewCredit:0,
      nonVettedProfileViewCredit:clientModel.PayPerCredit === true &&IsChecked.IsProfileView ?nonVettedProfileViewCredit:0,
      isPayPerCredit:clientModel.PayPerCredit,
      isPayPerHire:clientModel?.PayPerHire
    };
    
    const response = await allClientRequestDAO.userDetailsDAO(payload);
    if (response.statusCode === HTTPStatusCode.OK) {
      toast.success("Data save successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate(UTSRoutes.ALLCLIENTS);
      }, 1000);
      setErrorsData(false);
    } else if (response.statusCode === HTTPStatusCode.BAD_REQUEST) {
      // toast.error(response.responseBody, {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 2000,
      //   });
      setErrorsData(true);
      setErrorMessage(response?.responseBody);
    }
    setIsLoading(false);
  };

  // const getCompanyPOCList = async () =>{
  //   const response = await allClientRequestDAO.getActiveSalesUserListDAO();
  //   console.log(response?.responseBody,"responeresponerespone");
  //   setPOCName(response?.responseBody);
  // }

  const getCompanyPOCList = useCallback(
    async (clientEmail) => {
      setIsLoading(true)
      let response =  await allClientRequestDAO.getActiveSalesUserListDAO(clientEmail);
      if (response?.statusCode === HTTPStatusCode.OK) {
        setPOCName(response?.responseBody.map(data=>({
          value:data?.fullName,
          id:data?.id,
          EmpId:data?.employeeID
        })));
      } else if (
        response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
        response?.statusCode === HTTPStatusCode.NOT_FOUND
      ) {
        setPOCName([]);
      }
      setIsLoading(false);
    },
    []
  );

  useEffect(() => {
    getCompanyPOCList()
  }, [])
  
  useEffect(() => {
    const data = pocName.filter((item)=>item?.EmpId===fullname?.EmployeeID);
    setInputValue({...inputValue,id:data[0]?.id,value:data[0]?.value})
  }, [pocName])

  return (
    <WithLoader className="pageMainLoader" showLoader={isLoading}>
    <div className={userDetails.addNewContainer}>
      <LogoLoader visible={isLoading} />
      <div className={userDetails.tabsBody}>
        <div className={userDetails.tabsFormItem}>
          <div className={userDetails.tabsFormItemInner}>
            <>
              <div className={userDetails.tabsLeftPanel}>
                <h3>Invite client</h3>
                {/* <p>Please provide the necessary details</p> */}
              </div>
              <div className={userDetails.tabsRightPanel}>
                {/* {isLoading ? <div className={userDetails.spin}> <Spin/> </div>:  */}
                <form
                  id="userDetailsform"
                  className={userDetails.hrFieldRightPane}
                >
                  <ToastContainer />
                  Client Model <span className={userDetails.reqField}>*</span>
                  <div className={userDetails.checkbox}>
                    <Checkbox
                      name="PayPerCredit"
                      checked={clientModel?.PayPerCredit}
                      onChange={(e) => {
                        setClientModel({
                          ...clientModel,
                          PayPerCredit: e.target.checked,
                        });
                        seterrorClient(false);
                      }}
                    >
                      Pay Per Credit
                    </Checkbox>
                    <Checkbox
                      name="PayPerHire"
                      checked={clientModel?.PayPerHire}
                      onChange={(e) => {
                        setClientModel({
                          ...clientModel,
                          PayPerHire: e.target.checked,
                        });
                        seterrorClient(false);
                        setPricingOption(null)
                      }}
                    >
                      Pay Per Hire
                    </Checkbox>
                  
                
                  </div>
                  {errorClient && (
                    <p className={userDetails.error}>
                      * Please select option per client model.
                    </p>
                  )}
                  {clientModel?.PayPerHire && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: "20px",
                        marginLeft: "188px",
                        marginTop: "0px",
                      }}
                    >
                      <label className={userDetails.formGroupLabel}>Type of Pricing <span className={userDetails.reqField}>*</span></label>
                      <Radio.Group
                        onChange={(e) => {
                          setPricingOption(e.target.value);
                          setPricingOptionError(false);
                        }}
                        value={pricingOption}
                      >
                        <Radio value={true}>Transparent Pricing</Radio>
                        <Radio value={false}>Non Transparent Pricing</Radio>
                      </Radio.Group>
                      {pricingOptionError && (
                        <p
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: "15px",
                          }}
                          className={userDetails.error}
                        >
                          * Please select type of pricing options
                        </p>
                      )}
                    </div>
                  )}

{clientModel?.PayPerCredit && (
                  <>
                  <div className={userDetails.row}>
                    <div className={userDetails.colMd6}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Free Credits"
                        name="freeCredits"
                        type={InputType.NUMBER}
                        placeholder="Enter free credits"
                        required
                        onKeyDownHandler={(e) => {
                          if (
                            e.key === "-" ||
                            e.key === "+" ||
                            e.key === "E" ||
                            e.key === "e"
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                 
                <div className={userDetails.colMd6}>
                  <HRInputField
                    register={register}
                    errors={errors}
                    label="Per credit amount"
                    name="creditAmount"
                    type={InputType.NUMBER}
                    placeholder="Enter per credit amount"
                    required
                  />
                </div>
               
                  <div className={userDetails.colMd6}>
                  <label style={{ marginBottom: "12px" }}>
                     Currency
                        <span className={userDetails.reqField}>*</span>
                      </label>
                  <Select onChange={handleChange} name="creditCurrency">
                  <Select.Option value="INR">INR</Select.Option>
                  <Select.Option value="USD">USD</Select.Option>
                </Select>
                {errorCurrency &&  <p
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            // marginTop: "15px",
                          }}
                          className={userDetails.error}
                        >
                         *  Please select currency
                        </p>}

                  </div>
                </div>

          <div className={userDetails.checkbox}>
                    <Checkbox
                      name="IsPostaJob"
                      checked={IsChecked?.IsPostaJob}
                      onChange={(e) => {
                        setIsChecked({
                          ...IsChecked,
                          IsPostaJob: e.target.checked,
                        });
                        setErrors(false);
                      }}
                    >
                      Credit per post a job.
                    </Checkbox>
                    {/* <Checkbox
                      name="IsProfileView"
                      checked={IsChecked?.IsProfileView}
                      onChange={(e) => {
                        setIsChecked({
                          ...IsChecked,
                          IsProfileView: e.target.checked,
                        });
                        setErrors(false);
                        setProfileSharingOption(null);
                        setProfileSharingOptionError(false);
                      }}
                    >
                      Credit per profile view.
                    </Checkbox> */}
                  </div> 
                   {error && (
                    <p className={userDetails.error}>
                      * Please select option per post a job or per profile view.
                    </p>
                  )}
                       <div className={userDetails.row}>
                  {IsChecked?.IsPostaJob && (
                      <div className={userDetails.colMd6}>
                         <HRInputField
                           register={register}
                           errors={errors}
                           label="Job post credit"
                           name="jobPostCredit"
                           type={InputType.NUMBER}
                           placeholder="Enter Job post credit"
                           required
                         />
                       </div>
                  )}
                        {/* {IsChecked?.IsProfileView && (
                          <>
                        <div className={userDetails.colMd6}>
                       <HRInputField
                           register={register}
                           errors={errors}
                           label="Vetted Profile Credit"
                           name="vettedProfileViewCredit"
                           type={InputType.NUMBER}
                           placeholder="Enter Vetted Profile Credit"
                           required
                         />
                         </div>
                         <div className={userDetails.colMd6}>
                        <HRInputField
                            register={register}
                            errors={errors}
                            label="Non Vetted Profile Credit"
                            name="nonVettedProfileViewCredit"
                            type={InputType.NUMBER}
                            placeholder="Enter Non Vetted Profile Credit"
                            required
                          />
                       </div></>)} */}
                       </div>
                  {/* {IsChecked?.IsProfileView && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: "20px",
                        marginLeft: "188px",
                        marginTop: "0px",
                      }}
                    >
                      <label style={{ marginBottom: "12px" }}>
                        Profile Sharing Options
                        <span className={userDetails.reqField}>*</span>
                      </label>
                      <Radio.Group
                        onChange={(e) => {
                          setProfileSharingOption(e.target.value);
                          setProfileSharingOptionError(false);
                        }}
                        value={profileSharingOption}
                      >
                        <Radio value={true}>Vetted Profile</Radio>
                        <Radio value={false}>Fast Profile</Radio>
                      </Radio.Group>
                      {profileSharingOptionError && (
                        <p
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: "15px",
                          }}
                          className={userDetails.error}
                        >
                          * Please select profile sharing options
                        </p>
                      )}

                      {/* <div className={userDetails.row}>
                       <div className={userDetails.colMd6}>
                         
                       </div>
                     
                       <div className={userDetails.colMd6}>
                        <HRInputField
                            register={register}
                            errors={errors}
                            label="Non Vetted Profile View Credit"
                            name="nonVettedProfileViewCredit"
                            type={InputType.NUMBER}
                            placeholder="Enter Non Vetted Profile View Credit"
                            required
                          />
                       </div>
                       </div> 
                     /}
                    </div>
                  )} */}
                </>
                  )}
               
                  <div className={userDetails.row}>

                    <div className={userDetails.colMd6}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Company Name"
                        name="companyName"
                        type={InputType.TEXT}
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                    <div className={userDetails.colMd6}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Company URL"
                        name="companyURL"
                        type={InputType.TEXT}
                        placeholder="Enter company url"
                        required
                      />
                    </div>
                  </div>

                  {/* <div className={userDetails.row}>
                    
                  </div> */}


                  <div className={userDetails.row}>                                 
                    <div className={userDetails.colMd6}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Work Email"
                        name="workEmail"
                        type={InputType.TEXT}
                        placeholder="Enter work email"
                        required
                      />
                    </div>                
                    <div className={userDetails.colMd6}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Client Full Name"
                        name="fullName"
                        type={InputType.TEXT}
                        placeholder="Enter client full name"
                        required
                      />
                    </div>
                  </div>
                   
                  {/* <div className={userDetails.row}>
                    
                  </div> */}
                  <div className={userDetails.row}>
                  <div className={userDetails.colMd6}>
                    <div className={userDetails.formGroup}>
                      <label>
                      POC Name <b className={userDetails.error}>*</b>
                      </label>
                      <AutoComplete
                        value={inputValue?.value}
                        options={pocName}
                        // autoFocus={true}
                        filterOption={true}
                        placeholder="Enter POC Name"
                        onChange={(e,val)=>{
                          setInputValue({...inputValue,id:val?.id,value:val?.value});
                          setErrorsPocName(false);
                          }}
                      />
                       {errorPOCName && (<p className={userDetails.error}>
                        * Please select POC Name
                      </p>)}
                    </div>
                  </div>  
                  </div>
               
                  {/* <div className={userDetails.checkbox}>
                    <Checkbox
                      name="IsHybridModel"
                      checked={IsChecked?.IsHybridModel}
                      onChange={(e) =>
                        setIsChecked({
                          ...IsChecked,
                          IsHybridModel: e.target.checked,
                        })
                      }
                    >
                      Do you want to continue with <b>Pay Per Hire</b> ?
                    </Checkbox>
                  </div> */}
                  {errorData && (
                    <p className={userDetails.error}>{errorMessage}</p>
                  )}
                  <div>
                    <button
                      type="button"
                      className={userDetails.btn}
                      onClick={handleSubmit}
                    >
                      SUBMIT
                    </button>
                  </div>
                </form>
                {/* } */}
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
    </WithLoader>
  );
};

export default UserDetails;
