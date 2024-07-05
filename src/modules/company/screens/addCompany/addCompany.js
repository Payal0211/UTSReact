import React, { useEffect, useState, useCallback } from "react";
import AddNewClientStyle from "./addclient.module.css";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { useFieldArray, useForm } from "react-hook-form";
import { Skeleton, message } from "antd";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { allCompanyRequestDAO } from "core/company/companyDAO";

import CompanySection from "./companySection";
import FundingSection from "./fundingSection";
import CultureAndPerks from "./cultureAndPerks";
import ClientSection from "./clientSection";
import EngagementSection from "./engagementSection";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import { MasterDAO } from "core/master/masterDAO";
import LogoLoader from "shared/components/loader/logoLoader";

function AddCompany() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { companyID } = useParams();
  const [getCompanyDetails, setCompanyDetails] = useState({});
  const [getFundingDetails,setFundingDetails] = useState([]);
  const [getValuesForDD, setValuesForDD] = useState({});
  const [allPocs, setAllPocs] = useState([]);
  const [controlledPOC, setControlledPOC] = useState([]);
  const [isSelfFunded,setIsSelfFunded] = useState(false)
  const [pricingTypeError, setPricingTypeError] = useState(false);
  const [payPerError, setPayPerError] = useState(false);
  const [creditError, setCreditError] = useState(false);
  const [aboutCompanyError, setAboutCompanyError] = useState(false);

  const [loadingDetails,setLoadingDetails] = useState(false)
  const [isLogoLoader,setIsLogoLoader] = useState(false)
  const [disableSubmit , setDisableSubmit] = useState(false)
  const [ loadingCompanyDetails , setLoadingCompanyDetails] = useState(false)
  const [showFetchATButton,setShowFetchAIButton] = useState(false);


  // engagement Values 
  const [typeOfPricing, setTypeOfPricing] = useState(null);
  const [checkPayPer, setCheckPayPer] = useState({
    companyTypeID: 0,
    anotherCompanyTypeID: 0,
  });
  const [IsChecked, setIsChecked] = useState({
    isPostaJob: false,
    isProfileView: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    clearErrors,
    unregister,
    getValues,
    resetField,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clientDetails: [],
      fundingList: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "clientDetails",
  });

  const { fields:fundingFields, append:appendFunding, remove:removeFunding } = useFieldArray({
    control,
    name: "fundingDetails",
  });

  const getDetails = async () => {
    setLoadingDetails(true)
    const result = await allCompanyRequestDAO.getCompanyDetailDAO(companyID);
  
    if (result?.statusCode === HTTPStatusCode.OK) {
      setCompanyDetails(result?.responseBody);
      setFundingDetails(result?.responseBody.fundingDetails)
      setLoadingDetails(false)
    }
    setLoadingDetails(false)
  };

  const getDetailsForAutoFetchAI = async (compURL) => {
    setShowFetchAIButton(false)
    setLoadingCompanyDetails(true)
    const result = await allCompanyRequestDAO.getCompanyDetailDAO(0,compURL);

    if (result?.statusCode === HTTPStatusCode.OK) {
      if(result?.responseBody?.basicDetails?.companyLogo !== null) {
         let newresponse = {...result?.responseBody,basicDetails: {...result?.responseBody?.basicDetails,
        companyLogo: `${NetworkInfo.PROTOCOL}${NetworkInfo.DOMAIN}Media/companylogo/${result?.responseBody?.basicDetails?.companyLogo}`      }      }
      setCompanyDetails(newresponse);
      }else{
        message.warn("No Detail Fetched From AI")
      }
     
      setLoadingCompanyDetails(false)
    }
    setLoadingCompanyDetails(false)
  };

  const getAllValuesForDD = useCallback(async () => {
    const getDDResponse = await MasterDAO.getFixedValueRequestDAO();
    setValuesForDD(getDDResponse && getDDResponse?.responseBody);
  }, []);

  const getAllSalesPerson = useCallback(async () => {
    const allSalesResponse = await MasterDAO.getSalesManRequestDAO();
    setAllPocs(allSalesResponse && allSalesResponse?.responseBody?.details);
  }, []);

  useEffect(() => {
    getAllValuesForDD();
    getAllSalesPerson();
  }, []);

  useEffect(() => {
    if (companyID !== '0') {
      getDetails();
    }else{
      setCompanyDetails({basicDetails:{
        "companyID": 0,
        "companyName": "",
        "companyLogo": "",
        "websiteUrl": "",
        "foundedYear": "",
        "companySize": "",
        "companyType": "",
        "industry": "",
        "headquaters": "",
        "aboutCompanyDesc": "",
        "culture": "",
        "isSelfFunded": true
    },
    cultureDetails:[],
    youTubeDetails:[]})
    }
  }, [companyID]);

  useEffect(() => {
    if (getCompanyDetails?.pocUserDetailsEdit?.pocUserID && allPocs?.length) {
      // let SelectedPocs = getCompanyDetails?.pocUserIds.map((pocId) => {
      //   let data = allPocs.find((item) => item.id === pocId);
      //   return {
      //     id: data.id,
      //     value: data.value,
      //   };
      // });
      // setValue("uplersPOCname", SelectedPocs);
      // setControlledPOC(SelectedPocs);
      let data = allPocs.find((item) => item.id === getCompanyDetails?.pocUserDetailsEdit?.pocUserID);
      setValue("uplersPOCname", {
        id: data?.id,
        value: data?.value,
      });
      setControlledPOC({
        id: data?.id,
        value: data?.value,
      });
      
    }
  }, [getCompanyDetails?.pocUserIds, allPocs]);

  const clientSubmitHandler = async (d) => {
    // console.log(d,"aboutCompanyaboutCompanyaboutCompany");
    setLoadingDetails(true)
    setIsLogoLoader(true)
    setDisableSubmit(true)
    if(typeOfPricing === null && checkPayPer?.anotherCompanyTypeID==1 && (checkPayPer?.companyTypeID==0 || checkPayPer?.companyTypeID==2)){
			setPricingTypeError(true)
      setLoadingDetails(false)
      setIsLogoLoader(false)
      setDisableSubmit(false)
			return
		}

    if(checkPayPer?.anotherCompanyTypeID==0 && checkPayPer?.companyTypeID==0){
      setLoadingDetails(false)
      setDisableSubmit(false)
      setIsLogoLoader(false)
			setPayPerError(true)
			return
		}

    if(checkPayPer?.companyTypeID===2 && IsChecked?.isPostaJob===false && IsChecked?.isProfileView===false){
			setLoadingDetails(false)
      setIsLogoLoader(false)
      setDisableSubmit(false)
			setCreditError(true)
			return
		}

  

    if(!watch("aboutCompany")){
      setAboutCompanyError(true);
      setLoadingDetails(false)
      setIsLogoLoader(false)
      setDisableSubmit(false)
      return;
    }

    // check for at lest one admin client
    let isAdmin = false

    d?.clientDetails.map((client) => {
      if(client.roleID === 1){
        isAdmin = true
      }
    })

    if(!isAdmin){
      message.error(" Please Select a client as Admin")
      setLoadingDetails(false)
      setIsLogoLoader(false)
      setDisableSubmit(false)
      return
    }

    let modClientDetails = d?.clientDetails.map((client) =>({
      "clientID": client.id,
      "en_Id": client.en_Id,
      "isPrimary": client.isPrimary,
      "fullName": client.fullName,
      "emailId": client.emailID,
      "designation": client.designation,
      "phoneNumber": client.countryCode+ client.contactNo,
      "accessRoleId": client.roleID
    }))

    let modCultureDetails = getCompanyDetails?.cultureDetails.map((culture) =>({
      cultureID:culture.cultureID,
      culture_Image: culture.cultureImage
    }))

    let payload = {
      "basicDetails": {
        "companyID": companyID,
        "companyName": d?.companyName,
        "companyLogo": getCompanyDetails?.basicDetails?.companyLogo,
        "websiteUrl": d?.companyURL,
        "foundedYear": d?.foundedIn,
        // "companySize": +d.teamSize,
        "teamSize": d?.teamSize,
        "companyType": d?.companyType,
        "industry": d?.industry,
        "headquaters": d?.headquaters,
        "aboutCompanyDesc": d?.aboutCompany,
        "culture": d?.culture,
        "linkedInProfile": d?.companyLinkedinURL,
        "isSelfFunded": isSelfFunded
      },
      "fundingDetails": d?.fundingDetails,
      "cultureDetails": modCultureDetails,
      "perkDetails": d?.perksAndAdvantages?.map(it=> it.value),
      "youTubeDetails": getCompanyDetails?.youTubeDetails,
      "clientDetails": modClientDetails,
      "engagementDetails": {
        "companyTypeID": checkPayPer?.companyTypeID,
        "anotherCompanyTypeID": checkPayPer?.anotherCompanyTypeID,
        "isPostaJob": IsChecked.isPostaJob,
        "isProfileView": IsChecked.isProfileView,
        "jpCreditBalance": checkPayPer?.companyTypeID===2 ? +d?.freeCredit ?? null : null,
        "isTransparentPricing": typeOfPricing === 1 ? true :  typeOfPricing === 0 ?  false : null,
        "isVettedProfile": true,
        "creditAmount": (checkPayPer?.companyTypeID===2) ? +d?.creditAmount : null,
        "creditCurrency":checkPayPer?.companyTypeID===2 ? d?.creditCurrency : null,
        "jobPostCredit": (checkPayPer?.companyTypeID===2 && IsChecked?.isPostaJob=== true) ? +d?.jobPostCredit ?? null : null,
        "vettedProfileViewCredit": (checkPayPer?.companyTypeID===2 && IsChecked?.isProfileView===true) ?  +d?.vettedProfileViewCredit ?? null : null,
        "nonVettedProfileViewCredit": (checkPayPer?.companyTypeID===2 && IsChecked?.isProfileView===true) ? +d?.nonVettedProfileViewCredit?? null : null,
        "hiringTypePricingId": checkPayPer?.anotherCompanyTypeID === 1 ? d?.hiringPricingType?.id : null
      },
      // "pocIds": d.uplersPOCname?.map(poc=> poc.id),
      "pocId": d?.uplersPOCname?.id,
      "HRID":getCompanyDetails?.pocUserDetailsEdit?.hrid ?? 0,
      "Sales_AM_NBD":getCompanyDetails?.pocUserDetailsEdit?.sales_AM_NBD ?? '',
      "IsRedirectFromHRPage" : state?.createHR ? true : false
    }


    // console.log("plaod",payload)

    let submitresult = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload)
    setCompanyDetails(prev=> ({...prev,
      basicDetails: payload.basicDetails}))
// console.log("submited res",submitresult)
    if(submitresult?.statusCode === HTTPStatusCode.OK){
      if(state?.createHR){
        navigate('/allhiringrequest/addnewhr',{
          state:{
            companyID:submitresult?.responseBody?.companyID ,     
            companyName: submitresult?.responseBody?.companyName,
            clientDetails: submitresult?.responseBody?.summaryClients
          }})
          window.scrollTo(0,0)
      }else{
         navigate('/allClients')
      }
     
    }

    if(submitresult?.statusCode === HTTPStatusCode.BAD_REQUEST){
      message.error("Validation Error : "+ submitresult?.responseBody)
    }

    setLoadingDetails(false)
    setIsLogoLoader(false)
      setDisableSubmit(false)
  };

  // When From Create HR page
  useEffect(()=>{
    if(state?.createHR){
      setValue('companyName', state?.companyName)
    }
  },[state])

  return (
    <div className={AddNewClientStyle.addNewContainer}>
      <div className={AddNewClientStyle.addHRTitle}>
        {companyID !== '0' ? "Edit" : "Add New"} Company/Client Details
      </div>

      <CompanySection
        companyID={companyID}
        register={register}
        errors={errors}
        setValue={setValue}
        clearErrors={clearErrors}
        setError={setError}
        watch={watch}
        companyDetails={getCompanyDetails?.basicDetails}
        setCompanyDetails={setCompanyDetails}
        loadingDetails={loadingDetails}
        setDisableSubmit={setDisableSubmit}
        aboutCompanyError={aboutCompanyError}
        getDetailsForAutoFetchAI={getDetailsForAutoFetchAI}
        loadingCompanyDetails={loadingCompanyDetails}
        showFetchATButton={showFetchATButton}
        setShowFetchAIButton={setShowFetchAIButton}
      />

      <FundingSection
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
        companyDetails={getCompanyDetails?.basicDetails}
        fundingDetails={getFundingDetails}
        companyID={companyID}
        isSelfFunded={isSelfFunded} 
        setIsSelfFunded={setIsSelfFunded}
        fields={fundingFields}
        append={appendFunding}
        remove={removeFunding} 
        loadingDetails={loadingDetails}  
      />

      <CultureAndPerks
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
        companyDetails={getCompanyDetails?.basicDetails}
        cultureDetails={getCompanyDetails?.cultureDetails ?? []}
        youTubeDetails={getCompanyDetails?.youTubeDetails ?? []}
        perkDetails={getCompanyDetails?.perkDetails ?? []}
        setCompanyDetails={setCompanyDetails}
        companyID={companyID}
        cultureAndParksValue={getValuesForDD?.CompanyPerks}
        loadingDetails={loadingDetails}
      />

      <ClientSection
        companyID={companyID}
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
        fields={fields}
        append={append}
        remove={remove}
        clearErrors={clearErrors}
        setError={setError}
        contactDetails={getCompanyDetails?.contactDetails}
        accessTypes={getValuesForDD?.BindAccessRoleType}
        loadingDetails={loadingDetails}
        setDisableSubmit={setDisableSubmit}
      />

      <EngagementSection
        companyID={companyID}
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
        resetField={resetField}
        unregister={unregister}
        engagementDetails={getCompanyDetails?.engagementDetails}
        hooksProps={{checkPayPer, setCheckPayPer, IsChecked, setIsChecked,typeOfPricing, setTypeOfPricing,pricingTypeError, setPricingTypeError,payPerError, setPayPerError,creditError, setCreditError}}
        loadingDetails={loadingDetails}
      />

      <div className={AddNewClientStyle.tabsFormItem}>
        {loadingDetails ? <Skeleton active /> : <div className={AddNewClientStyle.tabsFormItemInner}>
          <div className={AddNewClientStyle.tabsLeftPanel}>
            <h3>{companyID === '0' && "Add"} Salesperson (NBD/AM)</h3>
            <p>Please provide the necessary details.</p>
          </div>
          <div className={AddNewClientStyle.tabsRightPanel}>
            <div className={AddNewClientStyle.row}>
              <div className={AddNewClientStyle.colMd6}>
                <div className={AddNewClientStyle.formGroup}>
                   <HRSelectField
                  isControlled={true}
                  controlledValue={controlledPOC}
                  setControlledValue={setControlledPOC}
                  setValue={setValue}
                  // mode={"multiple"}
                  searchable={true}
                  mode={"id/value"}
                  register={register}
                  name="uplersPOCname"
                  label="Uplers's Salesperson (NBD/AM)"
                  defaultValue="Select Salesperson (NBD/AM)"
                  options={allPocs}
                  required
                  isError={errors["uplersPOCname"] && errors["uplersPOCname"]}
                  errorMsg="Please select Salesperson (NBD/AM)."
                />
                </div>
               
              </div>
            </div>
          </div>
        </div>}
        
      </div>
       
     

      <div className={AddNewClientStyle.formPanelAction}>
        <button onClick={() => navigate(-1)} className={AddNewClientStyle.btn}>
          Cancel
        </button>
        <button
          disabled={disableSubmit}
          style={{cursor:disableSubmit? "not-allowed" :"pointer"}}
          type="submit"
          onClick={handleSubmit(clientSubmitHandler)}
          className={AddNewClientStyle.btnPrimary}
        >
          Save
        </button>
      </div>

      <LogoLoader visible={isLogoLoader} />
    </div>
  );
}

export default AddCompany;
