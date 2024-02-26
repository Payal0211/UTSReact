import UploadModal from "shared/components/uploadModal/uploadModal";
import CompanyDetailsStyle from "./companyDetails.module.css";
import { ReactComponent as UploadSVG } from "assets/svg/upload.svg";
import { ReactComponent as EditSVG } from "assets/svg/EditField.svg";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { InputType, URLRegEx, EmailRegEx } from "constants/application";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { locationFormatter } from "modules/client/clientUtils";
import { useCallback, useEffect, useRef, useState } from "react";
import { MasterDAO } from "core/master/masterDAO";
import { HubSpotDAO } from "core/hubSpot/hubSpotDAO";
import { ClientDAO } from "core/client/clientDAO";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import { _isNull } from "shared/utils/basic_utils";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { MdOutlinePreview } from "react-icons/md";
import { Modal, Tooltip, AutoComplete, Radio, Checkbox } from "antd";
import { Controller } from "react-hook-form";
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import CreditTransactionHistoryModal from "./creditTransactionHistoryModal";

const EditCompanyDetails = ({
  register,
  errors,
  setValue,
  watch,
  setError,
  flagAndCodeMemo,
  base64Image,
  unregister,
  setBase64Image,
  getUploadFileData,
  setUploadFileData,
  setCompanyName,
  companyName,
  control,
  companyDetail,
  setCompanyDetail,
  getCompanyDetails,typeOfPricing,setTypeOfPricing,pricingTypeError,setPricingTypeError,
  controlledFieldsProp,clientPOCs,
  checkPayPer,setCheckPayPer,setIsChecked,IsChecked,payPerError,setPayPerError,payPerCondition,
  setCreditError,creditError
}) => {
  let {
    controlledCompanyLoacation,
    setControlledCompanyLoacation,
    controlledLeadSource,
    setControlledLeadSource,
    controlledLeadOwner,
    setControlledLeadOwner,
    controlledLeadType,
    setControlledLeadType,
  } = controlledFieldsProp;
  const [GEO, setGEO] = useState([]);
  const [leadSource, setLeadSource] = useState([]);
  const [leadOwner, setLeadOwner] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setUploadModal] = useState(false);
  const getGEO = async () => {
    const geoLocationResponse = await MasterDAO.getGEORequestDAO();
    setGEO(geoLocationResponse && geoLocationResponse.responseBody);
  };
  const [checkedValue, setCheckedValue] = useState(true);
  const [checkednoValue, setCheckednoValue] = useState(false);
  const checkedYes = (e) => {
    setCheckedValue(e.target.checked);
    setCheckednoValue(false);
  };
  const checkedNo = (e) => {
    setCheckednoValue(e.target.checked);
    setCheckedValue(false);
  };

  const [toggleImagePreview, setToggleImagePreview] = useState(false);
  const [getValidation, setValidation] = useState({
    systemFileUpload: "",
    googleDriveFileUpload: "",
    linkValidation: "",
  });

  const [getCompanyNameSuggestion, setCompanyNameSuggestion] = useState([]);
  const [getCompanyNameMessage, setCompanyNameMessage] = useState("");
  const [showCompanyEmail, setShowCompanyEmail] = useState(false);
  const [creditTransactionModal,setTransactionModal] = useState(false);
  const [creditTransactionData,setCreditTransactionData] = useState([]);

  let controllerRef = useRef(null);

  const [userData, setUserData] = useState({});

	useEffect(() => {
		const getUserResult = async () => {
			let userData = UserSessionManagementController.getUserSession();
			if (userData) setUserData(userData);
		};
		getUserResult();
	}, []);

  const getLeadOwnerBytype = async (type) => {
    let result = await MasterDAO.getLeadTypeDAO(type);
    // console.log("fatchpreOnBoardInfo", result.responseBody.details);

    if (result?.statusCode === HTTPStatusCode.OK) {
      setLeadOwner(
        result.responseBody.details.Data.LeadTypeList.filter(
          (item) => item.value !== "0"
        ).map((item) => ({ ...item, text: item.value, value: item.text }))
      );
    }
  };

  const watchLeadSource = watch("companyLeadSource");

  useEffect(() => {
    if (watchLeadSource?.value) {
      getLeadOwnerBytype(watchLeadSource.value);
    }
  }, [watchLeadSource]);

  // useEffect(() => {
  //   if (errors?.companyName?.message) {
  //     controllerRef.current.focus();
  //   }
  // }, [errors?.companyName]);

  const watchCompanyLeadSource = watch("companyLeadSource");

  const watchCompanyEmail = watch("companyEmail");

  const convertToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }, []);

  const uploadFileHandler = useCallback(
    async (e) => {
      setIsLoading(true);
      let fileData = e.target.files[0];
      if (
        fileData?.type !== "image/png" &&
        fileData?.type !== "image/jpeg" &&
        fileData?.type !== "image/svg+xml"
      ) {
        setValidation({
          ...getValidation,
          systemFileUpload:
            "Uploaded file is not a valid, Only jpg, jpeg, png, svg files are allowed",
        });
        setIsLoading(false);
      } else if (fileData?.size >= 500000) {
        setValidation({
          ...getValidation,
          systemFileUpload:
            "Upload file size more than 500kb, Please Upload file upto 500kb",
        });
        setIsLoading(false);
      } else {
        const base64 = await convertToBase64(fileData);

        setValidation({
          ...getValidation,
          systemFileUpload: "",
        });
        setIsLoading(false);
        setBase64Image(base64);
        setUploadFileData(fileData.name);
        setUploadModal(false);
      }
    },
    [convertToBase64, getValidation, setBase64Image, setUploadFileData]
  );

  const getLeadSource = useCallback(async () => {
    const getLeadSourceResponse = await MasterDAO.getFixedValueRequestDAO();
    setLeadSource(getLeadSourceResponse && getLeadSourceResponse?.responseBody);
  }, []);

  /** To check Duplicate email exists Start */
  //TODO:- Show loader on Duplicate email caption:- verifying email
  // const watchCompanyName = watch('companyName');

  const getCompanyNameAlreadyExist = useCallback(
    async (data) => {
      let companyNameDuplicate =
        await ClientDAO.getDuplicateCompanyNameRequestDAO(data);
      setError("companyName", {
        type: "duplicateCompanyName",
        message:
          companyNameDuplicate?.statusCode ===
            HTTPStatusCode.DUPLICATE_RECORD &&
          "This company name already exists. Please enter another company name.",
      });
      companyNameDuplicate.statusCode === HTTPStatusCode.DUPLICATE_RECORD &&
        // setValue('companyName', '');
        setIsLoading(false);
    },
    [setError, setValue]
  );

  const getAutocompleteCompanyName = useCallback(
    async (data) => {
      if (data.length >= 4) {
        let companyAutofillData = await HubSpotDAO.getAutoCompleteCompanyDAO(
          data
        );
        setCompanyNameSuggestion([]);
        if (companyAutofillData.statusCode === HTTPStatusCode.OK) {
          setShowCompanyEmail(false);
          setCompanyNameSuggestion(
            companyAutofillData.responseBody.map((item) => ({
              ...item,
              value: item.company,
            }))
          );
        }
        if (companyAutofillData.statusCode === HTTPStatusCode.NOT_FOUND) {
          setShowCompanyEmail(true);
        }
        setIsLoading(false);
      }
    },
    [setError, setValue]
  );

  // useEffect(() => {
  // 	if(companyDetail.phone){
  // 		setValue('phoneNumber',companyDetail.phone.slice(3))
  // 	}
  // },[companyDetail.phone,setValue])  

  useEffect(() => {
    if (companyDetail?.geO_ID) {
      let location = locationFormatter(
        GEO.filter((loc) => loc.id === companyDetail?.geO_ID)
      );
      setValue("companyLocation", location[0]);
      setControlledCompanyLoacation(location[0]?.value);
    }
  }, [GEO, companyDetail, setValue]);

  useEffect(() => {
    if (companyDetail?.leadType) {
      let regForInbound = /Inbound/g;
      let Inboundincludes = companyDetail?.leadType.includes("Inbound");

      if (Inboundincludes) {
        let lead = leadSource?.BindLeadType?.filter(
          (loc) => loc.value === "InBound"
        );
        let leadType = leadSource?.BindInBoundDrp?.filter(
          (loc) => loc.value === companyDetail?.leadType
        );

        if (lead?.length) {
          setValue("companyLeadSource", lead[0]);
          setControlledLeadSource(lead[0].value);
        }
        if (leadType?.length) {
          setValue("companyInboundType", leadType[0]);
          setControlledLeadType(leadType[0].value);
        }
      } else {
        let lead = leadSource?.BindLeadType?.filter(
          (loc) => loc.value === companyDetail?.leadType
        );
        if (lead?.length) {
          setValue("companyLeadSource", lead[0]);
          setControlledLeadSource(lead[0].value);
        }
      }
    }
  }, [leadSource?.BindLeadType, companyDetail, setValue]);

  useEffect(() => {
    if (companyDetail.leadUserID && leadOwner.length > 0) {
      let filteredOwner = leadOwner?.filter(
        (owner) => owner.text == companyDetail.leadUserID
      );
      if (filteredOwner.length) {
        setValue("companyLeadOwner", {
          ...filteredOwner[0],
          id: filteredOwner[0].text,
        });
        setControlledLeadOwner(filteredOwner[0].value);
      }
    }
    // for Transparent Pricing
    if(companyDetail.isTransparentPricing !== null ){
      setTypeOfPricing(companyDetail.isTransparentPricing === true ? 1 : 0)
    }else{
      setTypeOfPricing(null)
    }
  }, [companyDetail, leadOwner]);

  const getCompanyDetailsByEmail = async (email) => {
    let response = await HubSpotDAO.getContactsByEmailDAO(email);

    if (response.statusCode === HTTPStatusCode.OK) {
      let companyAutofillData = await HubSpotDAO.getAutoCompleteCompanyDAO(
        email
      );

      if (companyAutofillData.statusCode === HTTPStatusCode.OK) {
        setShowCompanyEmail(false);
        getCompanyDetails(companyAutofillData.responseBody[0].companyID);
        // setShowCompanyEmail(false)
        // setCompanyNameSuggestion(companyAutofillData.responseBody.map(item => ({...item, value: item.company})))
      }
      // setValue('companyName',response.det)
      // getCompanyDetails()
    }

    if (response.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      setError("companyEmail", {
        type: "validate",
        message:
          "This email id not exist in Hubspot. Please create Client email id with Company",
      });
    }
  };

  //when company Email changed
  // useEffect(()=>{
  // 	if(watchCompanyEmail){
  // 		if(watchCompanyEmail.match(EmailRegEx.email)){
  // 			// get company details by email
  // 			console.log('watch Email', watchCompanyEmail)
  // 			getCompanyDetailsByEmail(watchCompanyEmail)
  // 		}
  // 	}
  // },[watchCompanyEmail])

  const handlefetchWithEmail = () => {
    if (watchCompanyEmail) {
      if (watchCompanyEmail.match(EmailRegEx.email)) {
        // get company details by email
        getCompanyDetailsByEmail(watchCompanyEmail);
      } else {
        setError("companyEmail", {
          type: "validate",
          message: "Entered value does not match email format",
        });
      }
    } else {
      setError("companyEmail", {
        type: "validate",
        message: "Please enter the Company Email.",
      });
    }
  };

  const debounceDuplicateCompanyName = useCallback(
    (data) => {
      let timer;
      if (!_isNull(data)) {
        timer = setTimeout(() => {
          setIsLoading(true);
          // getCompanyNameAlreadyExist(data);
          getAutocompleteCompanyName(data);
        }, 2000);
      }
      return () => clearTimeout(timer);
    },
    [getAutocompleteCompanyName]
  );

  const watchcompanyName = watch("companyName");

  const getCompanyValue = (clientName, data) => {
    setValue("companyName", clientName);
    setError("companyName", {
      type: "validate",
      message: "",
    });

    // get company name
    getCompanyDetails(data.companyID);
  };

  const validate = (clientName) => {
    if (!clientName) {
      return "please enter the company name.";
    } else if (getCompanyNameMessage !== "" && clientName) {
      return getCompanyNameMessage;
    }
    return true;
  };

  const getClientNameSuggestionHandler = useCallback(
    async (clientName) => {
      setCompanyName(clientName);
      debounceDuplicateCompanyName(clientName);
      // 	let response = await MasterDAO.getEmailSuggestionDAO(clientName);

      // 	if (response?.statusCode === HTTPStatusCode.OK) {
      // 		setCompanyNameSuggestion(response?.responseBody?.details);
      // 		setCompanyNameMessage('');
      // 	} else if (
      // 		response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
      // 		response?.statusCode === HTTPStatusCode.NOT_FOUND
      // 	) {
      // 		setError('clientName', {
      // 			type: 'validate',
      // 			message: response?.responseBody,
      // 		});
      // 		setCompanyNameSuggestion([]);
      // 		setCompanyNameMessage(response?.responseBody);
      // 		//TODO:- JD Dump ID
      // 	}
    },
    [setError]
  );

  /** based on  watchCompanyName-- */
  // useEffect(() => {
  // 	let timer;
  // 	if (!_isNull(watchCompanyName)) {
  // 		timer = setTimeout(() => {
  // 			setIsLoading(true);
  // 			getCompanyNameAlreadyExist(watchCompanyName);
  // 		}, 2000);
  // 	}
  // 	return () => clearTimeout(timer);
  // }, [getCompanyNameAlreadyExist, watchCompanyName]);

  /** To check Duplicate email exists End */
  useEffect(() => {
    getGEO();
    getLeadSource();
  }, [getLeadSource]);

  useEffect(() => {
    if (watchCompanyLeadSource?.id !== 1) unregister("companyLeadSource");
  }, [unregister, watchCompanyLeadSource?.id]);

  const getCreditTransactionData = async ()=>{
    setTransactionModal(true)
    let result = await ClientDAO.getCreditTransationHistoryDAO(clientPOCs[0]?.companyId,clientPOCs[0]?.contactId)
    // console.log("fatchpreOnBoardInfo", result.responseBody.details);

    if (result?.statusCode === HTTPStatusCode.OK) {
      setCreditTransactionData(result?.responseBody);
    }
  }

  let _totalSum;
  _totalSum = parseInt(watch("jpCreditBalance"))+parseInt(companyDetail?.jpCreditBalance);

  return (
    <div className={CompanyDetailsStyle.tabsFormItem}>
      <div className={CompanyDetailsStyle.tabsFormItemInner}>
        <div className={CompanyDetailsStyle.tabsLeftPanel}>
          <h3>Company Details</h3>
          <p>Please provide the necessary details</p>
        </div>

        <div className={CompanyDetailsStyle.tabsRightPanel}>
          <div className={CompanyDetailsStyle.row}>
            {/* <div className={CompanyDetailsStyle.colMd6}>
							<HRInputField
								// disabled={isLoading}
								type={InputType.TEXT}
								name="companyName"
								label="HS Company Name"
								errors={errors}
								register={register}
								placeholder="Enter name"
								validationSchema={{
									required: 'Please enter the company name.',
								}}
								onChangeHandler={(e) => {
									setCompanyName(e.target.value);
									debounceDuplicateCompanyName(e.target.value);
								}}
								required
							/>
						</div> */}

            <div className={CompanyDetailsStyle.colMd12}>
              <div
                style={{
                  width: "145px",
                  height: "145px",
                  marginBottom: "20px",
                }}
              >
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
                  {!getUploadFileData ? (
                    <p>Upload Company Logo</p>
                  ) : (
                    <img
                      style={{
                        width: "145px",
                        height: "145px",
                        borderRadius: "50%",
                      }}
                      src={
                        base64Image
                          ? base64Image
                          : NetworkInfo.PROTOCOL +
                            NetworkInfo.DOMAIN +
                            "Media/CompanyLogo/" +
                            getUploadFileData
                      }
                      alt="preview"
                    />
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{background:'var(--color-sunlight)',marginTop:'-25px',marginRight:'11px',display:'flex',padding:'2px',borderRadius:'50%',cursor:'pointer'}}>
                       <EditSVG
                  
                    width={24}
                    height={24}
                    onClick={() => setUploadModal(true)}
                  /> 
                    </div>
                  
                </div>
              </div>
            </div>

            <div className={CompanyDetailsStyle.colMd6}>
              <div className={CompanyDetailsStyle.formGroup}>
                <HRInputField
                register={register}
                errors={errors}
                label="Company Name"
                name="companyName"
                type={InputType.TEXT}
                validationSchema={{
                  required: "Please enter the Company Name",
                  // pattern: {
                  // 	value: URLRegEx.url,
                  // 	message: 'Entered value does not match url format',
                  // },
                }}
                onChangeHandler={(e) => {
									setCompanyName(e.target.value);
									// debounceDuplicateCompanyName(e.target.value);
								}}
                placeholder="Enter Company Name"
                required
              />
              </div>
            </div>

            <div className={CompanyDetailsStyle.colMd6}>
              <HRInputField
                register={register}
                errors={errors}
                label="Company URL"
                name="companyURL"
                type={InputType.TEXT}
                validationSchema={{
                  required: "Please enter the Company link.",
                  pattern: {
                  	value: URLRegEx.url,
                  	message: 'Entered value does not match url format',
                  },
                }}
                placeholder="Enter link"
                required
              />
            </div>

            {showCompanyEmail && (
              <>
                <div className={CompanyDetailsStyle.colMd6}>
                  <HRInputField
                    register={register}
                    errors={errors}
                    label="Company Email"
                    name="companyEmail"
                    type={InputType.TEXT}
                    validationSchema={{
                      required: "Please enter the Company Email.",
                      pattern: {
                        value: EmailRegEx.email,
                        message: "Entered value does not match email format",
                      },
                    }}
                    placeholder="Enter Company Email"
                    required={showCompanyEmail}
                  />
                </div>

                <div
                  className={CompanyDetailsStyle.colMd6}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    paddingTop: "25px",
                  }}
                >
                  <button
                    // disabled={isLoading}
                    type="submit"
                    onClick={() => handlefetchWithEmail()}
                    className={CompanyDetailsStyle.btnHubSpot}
                  >
                    Fetch Details from HubSpot
                  </button>
                </div>
              </>
            )}
          </div>

          <div className={CompanyDetailsStyle.row}>
            <div className={CompanyDetailsStyle.colMd6}>
              <div className={CompanyDetailsStyle.formGroup}>
                <HRSelectField
                  isControlled={true}
                  controlledValue={controlledCompanyLoacation}
                  setControlledValue={setControlledCompanyLoacation}
                  setValue={setValue}
                  mode={"id/value"}
                  register={register}
                  name="companyLocation"
                  label="Company Location"
                  defaultValue="Select location"
                  options={locationFormatter(GEO)}
                  required
                  isError={
                    errors["companyLocation"] && errors["companyLocation"]
                  }
                  errorMsg="Please select a location."
                />
              </div>
            </div>

            <div className={CompanyDetailsStyle.colMd6}>
              <HRInputField
                register={register}
                errors={errors}
                validationSchema={{
                  required: "Please enter the company size.",
                  min: {
                    value: 1,
                    message: `please don't enter the value less than 1`,
                  },
                }}
                label="Company Size"
                name={"companySize"}
                type={InputType.NUMBER}
                placeholder="Company Size "
                required
              />
            </div>
          </div>

          <div className={CompanyDetailsStyle.row}>
						<div className={CompanyDetailsStyle.colMd12}>
							<div style={{display:'flex',flexDirection:'column',marginBottom:'32px'}}> 
								<label style={{marginBottom:"12px"}}>
							Client Model
							 <span className={CompanyDetailsStyle.reqField}>
								*
							</span>
						</label>
            {payPerError && <p className={CompanyDetailsStyle.error}>*Please select client model</p>}
							{/* {pricingTypeError && <p className={CompanyDetailsStyle.error}>*Please select pricing type</p>} */}
							<div className={CompanyDetailsStyle.payPerCheckboxWrap}>
								<Checkbox 
									value={2} 
									onChange={(e)=>{setCheckPayPer({...checkPayPer,companyTypeID:e.target.checked===true ? e.target.value:0});setPayPerError(false);
                  setIsChecked({...IsChecked,isPostaJob:false,isProfileView:false})}}
                  checked={checkPayPer?.companyTypeID}
									>Pay Per Credit</Checkbox>
								<Checkbox 
									value={1} 
									onChange={(e)=>{setCheckPayPer({...checkPayPer,anotherCompanyTypeID:e.target.checked===true ? e.target.value:0});setPayPerError(false);setTypeOfPricing(null)}}
                  checked={checkPayPer?.anotherCompanyTypeID}
									>Pay Per Hire</Checkbox>
							</div>
							</div>												
						</div>
					</div>
					{checkPayPer?.companyTypeID !== 0  &&  checkPayPer?.companyTypeID !== null &&
					<>
          Remaining Credit : <span style={{fontWeight:"bold",marginBottom:"80px",marginTop:"20px"}}>{companyDetail?.jpCreditBalance}</span>
						<div className={CompanyDetailsStyle.row}>
							<div className={CompanyDetailsStyle.colMd6}>
              <label style={{marginBottom:"12px"}}>
							Topup Credit
              <span className={CompanyDetailsStyle.reqField}>
								*
							</span>
             {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Remaining Credit : <span style={{fontWeight:"bold"}}>{companyDetail?.jpCreditBalance}</span> */}
						</label>
            <div className={CompanyDetailsStyle.FreecreditFieldWrap}>
								<HRInputField
									register={register}
									errors={errors}
                  className="yourClassName"
									validationSchema={{
										required: checkPayPer?.companyTypeID !== 0  &&  checkPayPer?.companyTypeID !== null ?'Please enter free credits.':null,
                    min: {
                      value: 0,
                      message: `please don't enter the value less than 0`,
                    },
                    max: {
                      value: 99,
                      message: `please don't enter the value greater than 99`,
                    }
									}}
                  onKeyDownHandler={(e)=>{
                    if (e.key === '-' || e.key === '+' || e.key === 'E' ||  e.key === 'e') {
                      e.preventDefault();
                    }
                  }}
                  // label={`Free Credits Balance Credit : ${companyDetail?.jpCreditBalance}`}
									name={'jpCreditBalance'}
									type={InputType.NUMBER}
									placeholder="Free Credits"
									required={checkPayPer?.companyTypeID !== 0  &&  checkPayPer?.companyTypeID !== null?true:false}
								/>
               {!isNaN(_totalSum) && <label style={{marginBottom:"20px",marginTop:"-26px",display:"block",fontWeight:"bold"}}>Total Credit Balance : <span style={{fontWeight:"bold"}}>{_totalSum}</span> </label>}
                </div>
							</div>
              <div className={CompanyDetailsStyle.colMd6}>
                  <span className={CompanyDetailsStyle.creditTransactionModalLink} onClick={()=>getCreditTransactionData()}>Credit Transaction History</span>
              </div>
						</div>
            <div className={CompanyDetailsStyle.row}>
							<div className={CompanyDetailsStyle.colMd6}>
                
              </div>
            </div>
						<div className={CompanyDetailsStyle.row}>
							<div className={CompanyDetailsStyle.colMd12}>
								<div style={{display:'flex',flexDirection:'column',marginBottom:'32px'}}> 
									{/* <label style={{marginBottom:"12px"}}>
								Client Modal
								<span className={CompanyDetailsStyle.reqField}>
									*
								</span>
							</label> */}
								{/* {pricingTypeError && <p className={CompanyDetailsStyle.error}>*Please select pricing type</p>} */}
								<div className={CompanyDetailsStyle.payPerCheckboxWrap}>
									<Checkbox name='IsPostaJob' 
                    checked={IsChecked?.isPostaJob} 
                    onChange={(e)=>{
                      setIsChecked({...IsChecked,isPostaJob:e.target.checked});setCreditError(false)}}
                    >Credit per post a job.
                  </Checkbox>
									<Checkbox name="IsProfileView" 
                    checked={IsChecked?.isProfileView} 
                    onChange={(e)=>{
                      setIsChecked({...IsChecked,isProfileView:e.target.checked});setCreditError(false)}}>
                      Credit per profile view.
                  </Checkbox>
							  </div>
                {creditError && <p className={CompanyDetailsStyle.error}>*Please select option</p>}
								</div>												
							</div>
						</div>
					</>}

          <div className={CompanyDetailsStyle.row}>
						<div className={CompanyDetailsStyle.colMd12}>
							<div style={{display:'flex',flexDirection:'column',marginBottom:'32px'}}> 
								<label style={{marginBottom:"12px"}}>
							Type Of Pricing 
              <span className={CompanyDetailsStyle.reqField}>
								*
							</span>
						</label>
            {pricingTypeError && <p className={CompanyDetailsStyle.error}>*Please select pricing type</p>}	
						<Radio.Group
              disabled={userData?.LoggedInUserTypeID !== 1 || checkPayPer?.anotherCompanyTypeID==0 && (checkPayPer?.companyTypeID==0 || checkPayPer?.companyTypeID==2) } 
							onChange={e=> {setTypeOfPricing(e.target.value); setPricingTypeError && setPricingTypeError(false)}}
							value={typeOfPricing}
							>
							<Radio value={1}>Transparent Pricing</Radio>
							<Radio value={0}>Non Transparent Pricing</Radio>
						</Radio.Group>
							</div>
				
								
						</div>
					</div>

          <div className={CompanyDetailsStyle.row}>
            <div className={CompanyDetailsStyle.colMd12}>
              <HRInputField
                register={register}
                errors={errors}
                validationSchema={{
                  required: "Please enter the company address.",
                }}
                label="Company Address"
                name={"companyAddress"}
                type={InputType.TEXT}
                placeholder="Company Address "
                required
              />
            </div>
          </div>

          <div className={CompanyDetailsStyle.row}>
            <div className={CompanyDetailsStyle.colMd6}>
              <HRInputField
                register={register}
                errors={errors}
                validationSchema={{
                  required: "please enter the linkedin profile.",
                  // pattern: {
                  // 	value: URLRegEx.url,
                  // 	message: 'Entered value does not match url format',
                  // },
                }}
                label="Linkedin Profile"
                name={"companyLinkedinProfile"}
                type={InputType.TEXT}
                placeholder="Enter linkedin profile "
                required
              />
            </div>

            <div className={CompanyDetailsStyle.colMd6}>
              <div
                className={`${CompanyDetailsStyle.formGroup} ${CompanyDetailsStyle.phoneNoGroup}`}
              >
                <label>
                  Phone number
                  {/* <span className={CompanyDetailsStyle.reqField}>*</span> */}
                </label>
                <div className={CompanyDetailsStyle.phoneNoCode}>
                  <HRSelectField
                    searchable={true}
                    setValue={setValue}
                    register={register}
                    name="companyCountryCode"
                    defaultValue="+91"
                    options={flagAndCodeMemo}
                  />
                </div>
                <div className={CompanyDetailsStyle.phoneNoInput}>
                  <HRInputField
                    register={register}
                    name={"phoneNumber"}
                    type={InputType.NUMBER}
                    placeholder="Enter Phone number"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={CompanyDetailsStyle.row}>
            <div className={CompanyDetailsStyle.colMd12}>
              <div className={CompanyDetailsStyle.radioFormGroup}>
                <label>
                  Does the client have experience hiring remotely?
                  <span className={CompanyDetailsStyle.reqField}>*</span>
                </label>
                <label className={CompanyDetailsStyle.container}>
                  <p>Yes</p>
                  <input
                    {...register("remote")}
                    value={1}
                    type="radio"
                    checked={checkedValue}
                    onChange={(e) => {
                      checkedYes(e);
                    }}
                    id="remote"
                    name="remote"
                  />
                  <span className={CompanyDetailsStyle.checkmark}></span>
                </label>
                <label className={CompanyDetailsStyle.container}>
                  <p>No</p>
                  <input
                    {...register("remote")}
                    value={0}
                    type="radio"
                    checked={checkednoValue}
                    onChange={(e) => {
                      checkedNo(e);
                    }}
                    id="remote"
                    name="remote"
                  />
                  <span className={CompanyDetailsStyle.checkmark}></span>
                </label>
              </div>
            </div>
          </div>
          <div className={CompanyDetailsStyle.row}>
            <div className={CompanyDetailsStyle.colMd6}>
              <div className={CompanyDetailsStyle.formGroup}>
                <HRSelectField
                  isControlled={true}
                  controlledValue={controlledLeadSource}
                  setControlledValue={setControlledLeadSource}
                  mode={"id/value"}
                  setValue={setValue}
                  register={register}
                  name="companyLeadSource"
                  label="Lead Source"
                  defaultValue="Select Lead Source"
                  options={leadSource?.BindLeadType}
                  required
                  isError={
                    errors["companyLeadSource"] && errors["companyLeadSource"]
                  }
                  errorMsg={"Please select lead source"}
                />
              </div>
            </div>

            {leadOwner.length > 0 && (
              <div className={CompanyDetailsStyle.colMd6}>
                <div className={CompanyDetailsStyle.formGroup}>
                  <HRSelectField
                    isControlled={true}
                    controlledValue={controlledLeadOwner}
                    setControlledValue={setControlledLeadOwner}
                    mode={"id/value"}
                    setValue={setValue}
                    register={register}
                    name="companyLeadOwner"
                    label="Lead Owner"
                    defaultValue="Select Lead Owner"
                    options={leadOwner}
                    required={leadOwner.length > 0}
                    isError={
                      errors["companyLeadOwner"] && errors["companyLeadOwner"]
                    }
                    errorMsg={"Please select lead source"}
                    searchable={true}
                  />
                </div>
              </div>
            )}

            {watch("companyLeadSource")?.id === 1 && (
              <div className={CompanyDetailsStyle.colMd6}>
                <div className={CompanyDetailsStyle.formGroup}>
                  <HRSelectField
                    isControlled={true}
                    controlledValue={controlledLeadType}
                    setControlledValue={setControlledLeadType}
                    mode={"id/value"}
                    setValue={setValue}
                    register={register}
                    name="companyInboundType"
                    label="Inbound Type"
                    defaultValue="Please Select"
                    options={leadSource?.BindInBoundDrp}
                    searchable={true}
                  />
                </div>
              </div>
            )}
          </div>
          <div className={CompanyDetailsStyle.row}>
            <div className={CompanyDetailsStyle.colMd12}>
              <HRInputField
                register={register}
                errors={errors}
                validationSchema={{
                  required: "Please enter the about company.",
                }}
                isTextArea={true}
                label="About Company"
                name="aboutCompany"
                type={InputType.TEXT}
                placeholder="About Company"
                required
              />
              {/* {!getUploadFileData ? (
								<HRInputField
									register={register}
									leadingIcon={<UploadSVG />}
									label="Company Logo (JPG, PNG, SVG)"
									name="companyLogo"
									type={InputType.BUTTON}
									value="Upload logo"
									onClickHandler={() => setUploadModal(true)}
								/>
							) : (
								<div className={CompanyDetailsStyle.uploadedJDWrap}>
									<label>Company Logo (JPG, PNG, SVG)</label>
									<div className={CompanyDetailsStyle.uploadedJDName}>
										{getUploadFileData}
										<div
											className={CompanyDetailsStyle.uploadedImgPreview}
											onClick={() => setToggleImagePreview(true)}>
											<Tooltip
												placement="top"
												title={'Image Preview'}>
												<MdOutlinePreview />
											</Tooltip>
										</div>
										<CloseSVG
											className={CompanyDetailsStyle.uploadedJDClose}
											onClick={() => {
												// setJDParsedSkills({});
												setUploadFileData('');
											}}
										/>
									</div>
								</div>
							)} */}
            </div>
            <Modal
              className={CompanyDetailsStyle.imagePreviewModal}
              width={"500px"}
              centered
              footer={false}
              open={toggleImagePreview}
              onCancel={() => setToggleImagePreview(false)}
            >
              <img src={base64Image} alt="preview" />
            </Modal>
            <CreditTransactionHistoryModal 
            creditTransactionModal={creditTransactionModal} 
            setTransactionModal={setTransactionModal}
            creditTransactionData={creditTransactionData}
            />
            {showUploadModal && (
              <UploadModal
                isFooter={false}
                uploadFileHandler={uploadFileHandler}
                modalTitle={"Upload Logo"}
                openModal={showUploadModal}
                cancelModal={() => setUploadModal(false)}
                setValidation={setValidation}
                getValidation={getValidation}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyDetails;
