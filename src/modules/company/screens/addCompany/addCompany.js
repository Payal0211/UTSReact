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

function AddCompany() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { companyID } = useParams();
  const [getCompanyDetails, setCompanyDetails] = useState({});
  const [getValuesForDD, setValuesForDD] = useState({});
  const [allPocs, setAllPocs] = useState([]);
  const [controlledPOC, setControlledPOC] = useState([]);
  const [isSelfFunded,setIsSelfFunded] = useState(false)
  const [pricingTypeError, setPricingTypeError] = useState(false);
  const [payPerError, setPayPerError] = useState(false);
  const [creditError, setCreditError] = useState(false);

  const [loadingDetails,setLoadingDetails] = useState(false)
  const [disableSubmit , setDisableSubmit] = useState(false)


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
      setLoadingDetails(false)
    }
    setLoadingDetails(false)
  };

  const getDetailsForAutoFetchAI = async (compURL) => {
    setLoadingDetails(true)
    const result = await allCompanyRequestDAO.getCompanyDetailDAO(0,compURL);

    if (result?.statusCode === HTTPStatusCode.OK) {
      let newresponse = {...result?.responseBody,basicDetails: {...result?.responseBody?.basicDetails,
        companyLogo: `${NetworkInfo.PROTOCOL}${NetworkInfo.DOMAIN}Media/companylogo/${result?.responseBody?.basicDetails?.companyLogo}`      }      }
      setCompanyDetails(newresponse);
      setLoadingDetails(false)
    }
    setLoadingDetails(false)
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
    if (getCompanyDetails?.pocUserIds?.length && allPocs?.length) {
      // let SelectedPocs = getCompanyDetails?.pocUserIds.map((pocId) => {
      //   let data = allPocs.find((item) => item.id === pocId);
      //   return {
      //     id: data.id,
      //     value: data.value,
      //   };
      // });
      // setValue("uplersPOCname", SelectedPocs);
      // setControlledPOC(SelectedPocs);
      let data = allPocs.find((item) => item.id === getCompanyDetails?.pocUserIds[0]);
      setValue("uplersPOCname", {
        id: data.id,
        value: data.value,
      });
      setControlledPOC({
        id: data.id,
        value: data.value,
      });
      
    }
  }, [getCompanyDetails?.pocUserIds, allPocs]);

  const clientSubmitHandler = async (d) => {
    setLoadingDetails(true)
    setDisableSubmit(true)
    if(typeOfPricing === null && checkPayPer?.anotherCompanyTypeID==1 && (checkPayPer?.companyTypeID==0 || checkPayPer?.companyTypeID==2)){
			setPricingTypeError(true)
      setLoadingDetails(false)
      setDisableSubmit(false)
			return
		}

    if(checkPayPer?.anotherCompanyTypeID==0 && checkPayPer?.companyTypeID==0){
      setLoadingDetails(false)
      setDisableSubmit(false)
			setPayPerError(true)
			return
		}

    if(checkPayPer?.companyTypeID===2 && IsChecked?.isPostaJob===false && IsChecked?.isProfileView===false){
			setLoadingDetails(false)
      setDisableSubmit(false)
			setCreditError(true)
			return
		}

    // check for at lest one admin client
    let isAdmin = false

    d.clientDetails.map((client) => {
      if(client.roleID === 1){
        isAdmin = true
      }
    })

    if(!isAdmin){
      message.error(" Please Select a client as Admin")
      setLoadingDetails(false)
      setDisableSubmit(false)
      return
    }

    let modClientDetails = d.clientDetails.map((client) =>({
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
        "companyName": d.companyName,
        "companyLogo": getCompanyDetails?.basicDetails?.companyLogo,
        "websiteUrl": d.companyURL,
        "foundedYear": d.foundedIn,
        "companySize": +d.teamSize,
        "companyType": d.companyType,
        "industry": d.industry,
        "headquaters": d.headquaters,
        "aboutCompanyDesc": d.aboutCompany,
        "culture": d.culture,
        "linkedInProfile": d.companyLinkedinURL,
        "isSelfFunded": isSelfFunded
      },
      "fundingDetails": d.fundingDetails,
      "cultureDetails": modCultureDetails,
      "perkDetails": d.perksAndAdvantages?.map(it=> it.value),
      "youTubeDetails": getCompanyDetails?.youTubeDetails,
      "clientDetails": modClientDetails,
      "engagementDetails": {
        "companyTypeID": checkPayPer?.companyTypeID,
        "anotherCompanyTypeID": checkPayPer?.anotherCompanyTypeID,
        "isPostaJob": IsChecked.isPostaJob,
        "isProfileView": IsChecked.isProfileView,
        "jpCreditBalance": checkPayPer?.companyTypeID===2 ? +d.freeCredit ?? null : null,
        "isTransparentPricing": typeOfPricing === 1 ? true :  typeOfPricing === 0 ?  false : null,
        "isVettedProfile": true,
        "creditAmount": (checkPayPer?.companyTypeID===2) ? +d.creditAmount : null,
        "creditCurrency":checkPayPer?.companyTypeID===2 ? d.creditCurrency : null,
        "jobPostCredit": (checkPayPer?.companyTypeID===2 && IsChecked?.isPostaJob=== true) ? +d.jobPostCredit ?? null : null,
        "vettedProfileViewCredit": (checkPayPer?.companyTypeID===2 && IsChecked?.isProfileView===true) ?  +d.vettedProfileViewCredit ?? null : null,
        "nonVettedProfileViewCredit": (checkPayPer?.companyTypeID===2 && IsChecked?.isProfileView===true) ? +d.nonVettedProfileViewCredit?? null : null,
        "hiringTypePricingId": checkPayPer?.anotherCompanyTypeID === 1 ? d.hiringPricingType?.id : null
      },
      // "pocIds": d.uplersPOCname?.map(poc=> poc.id),
      "pocIds": [d.uplersPOCname?.id],
      "IsRedirectFromHRPage" : state?.createHR ? true : false
    }


    // console.log("plaod",payload)

    let submitresult = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload)
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
        getDetailsForAutoFetchAI={getDetailsForAutoFetchAI}
      />

      <FundingSection
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
        companyDetails={getCompanyDetails?.basicDetails}
        fundingDetails={getCompanyDetails?.fundingDetails}
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
            <h3>Add POC</h3>
            <p>Please provide the necessary details.</p>
          </div>
          <div className={AddNewClientStyle.tabsRightPanel}>
            <div className={AddNewClientStyle.row}>
              <div className={AddNewClientStyle.colMd12}>
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
                  label="Uplers's POC name"
                  defaultValue="Enter POC name"
                  options={allPocs}
                  required
                  isError={errors["uplersPOCname"] && errors["uplersPOCname"]}
                  errorMsg="Please select POC name."
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
    </div>
  );
}

export default AddCompany;
