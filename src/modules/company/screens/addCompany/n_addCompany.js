import React, { useEffect, useState, useCallback, useRef } from "react";
import companyStyles from "./n_addCompany.module.css";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { useFieldArray, useForm } from "react-hook-form";
import { Modal, Skeleton, message, Select, Radio } from "antd";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import ReactQuill from "react-quill";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CompanySection from "./companySection";
import FundingSection from "./fundingSection";
import CultureAndPerks from "./cultureAndPerks";
import ClientSection from "./clientSection";
import EngagementSection from "./engagementSection";
import { ClientsAPI, HTTPStatusCode, NetworkInfo } from "constants/network";
import { MasterDAO } from "core/master/masterDAO";
import LogoLoader from "shared/components/loader/logoLoader";
import { v4 as uuidv4 } from 'uuid';
import { encrypt } from 'modules/EncryptionDecryption/encryptiondescryption.js';
import { allClientRequestDAO } from "core/allClients/allClientsDAO";
import UTSRoutes from "constants/routes";
import { InputType, EmailRegEx, ValidateFieldURL } from "constants/application";
import PreviewClientModal from "modules/client/components/previewClientDetails/previewClientModal";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'



export const secondaryClient = {
  clientProfilePic: "",
  companyID: 0,
  contactNo: "",
  designation: "",
  emailID: "",
  firstName: "",
  fullName: "",
  id: 0,
  isPrimary: true,
  lastName: "",
  linkedIn: "",
  resendInviteEmail: false,
  roleID: 3,
  countryCode: "",
  isNewClient: true,
  isClientNotificationSend: true
};

function NewAddCompany() {
  const navigate = useNavigate()
  const { state } = useLocation();
  const { companyID } = useParams();
  const companyLogoRef = useRef(null)
  const pictureRef = useRef()
  const [showUploadModal, setUploadModal] = useState(false);
  const [getCompanyDetails, setCompanyDetails] = useState({});
  const [disableSubmit, setDisableSubmit] = useState(false)
  let companyDetails = getCompanyDetails?.basicDetails
  const [isViewCompanyurl, setIsViewCompanyurl] = useState(false);
  const [showFetchATButton, setShowFetchAIButton] = useState(false);
  const [isPreviewModal, setIsPreviewModal] = useState(false);
  const [isViewCompany, setIsViewCompany] = useState(false);
  const [getcompanyID, setcompanyID] = useState("");
  const [getUploadFileData, setUploadFileData] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [loadingCompanyDetails, setLoadingCompanyDetails] = useState(false)
  const [hrPricingTypes, setHRPricingTypes] = useState([]);
  const [uploading, setUploading] = useState(false)
  const [companySectionData, setCompanySectionData] = useState({
    "companyName": '',
    "companyURL": '',
    "companyLinkedinURL": '',
    "foundedIn": null,
    "LeadType": null,
    "LeadUser": null,
    "industry": '',
    "teamSize": '',
    "headquaters": '',
    "Category": null,
    "Geo": null,
    "aboutCompany": '',
    'hiringPricingType': '',
    "creditCurrency": null,
    'creditAmount': '',
    'jobPostCredit': '',
    'freeCredit': '',
  })

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthOptions = monthNames.map((month, index) => ({
    label: month,
    value: month,
  }));
  const [getValuesForDD, setValuesForDD] = useState({});
  const [allPocs, setAllPocs] = useState([]);


  const [getFundingDetails, setFundingDetails] = useState([]);
  const [filtersList, setFiltersList] = useState([]);
  const [companyConfidentailFields, setCompanyConfidentialFields] = useState({
    companyURL: '',
    companyLogoAlias: '',
    headquaters: '',
    headquatersAlias: '',
    companyNameAlias: '',
    companyLinkedinURL: '',
    companyLogo: ''
  })

  const [fundingSectionData, setFundingSectionData] = useState({
    isSelfFunded: false,
    fundingAmount: '',
    series: null,
    month: null,
    year: null,
    investors: '',
    additionalInfo: ''
  })

  const [cultureSectionData, setCultureSectionData] = useState({
    culture: '',
    youtubeLink: '',
    perksAndAdvantages: [],

  })
  const [aboutCompanyError, setAboutCompanyError] = useState(false);
  const [clientFieldsDetails, setClientFieldsDetails] = useState([])
  const [countryCodeData, setCountryCodeData] = useState("in");
  const [combinedPerkMemo, setCombinedPerkMemo] = useState([])
  const [formValidationError, setFormValidationError] = useState(false);
  const [creditError, setCreditError] = useState(false);
  const [typeOfPricing, setTypeOfPricing] = useState(null);
  const [payPerError, setPayPerError] = useState(false);
  const [checkPayPer, setCheckPayPer] = useState({
    companyTypeID: 0,
    anotherCompanyTypeID: 0,
  });
  const [IsChecked, setIsChecked] = useState({
    isPostaJob: false,
    isProfileView: false,
  });
  const [pricingTypeError, setPricingTypeError] = useState(false);
  const [pricingTypeErrorPPH, setPricingTypeErrorPPH] = useState(false);
  const [manageablePricingType, setManageablePricingType] = useState([])
  const [confidentialInfo, setConfidentialInfo] = useState(0);
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [clientsEmailError, setClientsEmailError] = useState({})

  const [uplersPOCname, setUplersPOCName] = useState(null)

  const leadTypeOptions = [{
    id: 12,
    value: 'inbound',
  },
  {
    id: 11,
    value: 'outbound',
  },
  {
    id: 4,
    value: 'referral',
  },
  {
    id: 176,
    value: 'partnership',
  }
  ];

  const seriesOptions = [
    { value: "Seed Round", id: "Seed Round" },
    { value: "Series A Round", id: "Series A Round" },
    { value: "Series B Round", id: "Series B Round" },
    { value: "Series C Round", id: "Series C Round" },
    { value: "Series D Round", id: "Series D Round" },
    { value: "Series E Round", id: "Series E Round" },
    { value: "Series F Round", id: "Series F Round" },
    { value: "Series G Round", id: "Series G Round" },
    { value: "Series H Round", id: "Series H Round" },
    { value: "Series I Round", id: "Series I Round" },
    { value: "IPO", id: "IPO" },
    { value: "Private Equity", id: "Private Equity" },
  ];

  const [clientsData, setClientsData] = useState([{
    clientProfilePic: "",
    companyID: 0,
    contactNo: "",
    designation: "",
    emailID: "",
    firstName: "",
    fullName: "",
    id: 0,
    isPrimary: false,
    lastName: "",
    linkedIn: "",
    resendInviteEmail: false,
    roleID: 1,
    countryCode: "",
    isNewClient: true,
    isClientNotificationSend: true
  }])

  let eReg = new RegExp(EmailRegEx.email);

  const getDetails = async () => {
    setLoadingDetails(true)
    const result = await allCompanyRequestDAO.getCompanyDetailDAO(companyID);
    setLoadingDetails(false)
    if (result?.statusCode === HTTPStatusCode.OK) {
      setCompanyDetails(result?.responseBody);
      setFundingDetails(result?.responseBody.fundingDetails)

    }

  };

  const getFilterRequest = useCallback(async () => {
    const response = await allClientRequestDAO.getClientFilterDAO();

    if (response?.statusCode === HTTPStatusCode.OK) {
      setFiltersList(response && response?.responseBody?.Data);
      // setLoading(false)
    } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      // setLoading(false) 
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      // setLoading(false)
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      // setLoading(false)
      return 'NO DATA FOUND';
    }
  }, [navigate]);

  useEffect(() => {
    getFilterRequest();
  }, [getFilterRequest])

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

  const isQuillEmpty = (html) => {
    const text = html
      .replace(/<(.|\n)*?>/g, '')
      .replace(/&nbsp;/g, '')
      .trim();

    return text.length === 0;
  };

  useEffect(() => {
    if (companyID !== '0') {
      getDetails();
    } else {
      setCompanyDetails({
        basicDetails: {
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
        cultureDetails: [],
        youTubeDetails: []
      })
    }
  }, [companyID]);

  const generateYears = (startYear, endYear) => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  const startYear = 1900;
  const endYear = new Date().getFullYear();

  const yearOptions = generateYears(startYear, endYear).map((year) => ({
    id: year.toString(),
    value: year.toString(),
  }));


  const validateCompanyName = async () => {
    if (companyID === "0") {

      setCompanySectionData(prev => ({ ...prev, "companyURL": "" }))
    }
    if (companySectionData?.companyName) {
      if (companyDetails?.companyName === companySectionData?.companyName) {

        setIsViewCompany(false);
        return;
      }

      let payload = {
        workEmail: "",
        companyName: companySectionData?.companyName,
        currentCompanyID: +companyID,
      };

      const result = await allCompanyRequestDAO.validateClientCompanyDAO(
        payload
      );

      if (result.statusCode === HTTPStatusCode.OK) {

        setIsViewCompany(false);

      }
      if (result.statusCode === HTTPStatusCode.BAD_REQUEST) {
        setDisableSubmit(true);
        setIsViewCompany(true);

        setcompanyID(result?.details?.companyID);
        message.error(result?.responseBody)
        // setError("companyName", {
        //   type: "manual",
        //   message: result?.responseBody,
        // });
      }
    }
  };

  const uploadFileHandler = useCallback(
    async (e) => {
      // setIsLoading(true);
      let fileData = e.target.files[0];
      if (
        fileData?.type !== "image/png" &&
        fileData?.type !== "image/jpeg" &&
        fileData?.type !== "image/svg+xml"
      ) {
        message.error("Uploaded file is not a valid, Only jpg, jpeg, png, svg files are allowed")

        // setIsLoading(false);
      } else if (fileData?.size >= 500000) {
        message.error("Upload file size more than 500kb, Please Upload file upto 500kb")

        // setIsLoading(false);
      } else {
        let filesToUpload = new FormData();
        filesToUpload.append("Files", fileData);
        filesToUpload.append("IsCompanyLogo", true);
        filesToUpload.append("IsCultureImage", false);
        filesToUpload.append("type", "company_logo")

        let Result = await allCompanyRequestDAO.uploadImageDAO(filesToUpload);


        if (Result?.statusCode === HTTPStatusCode.OK) {
          let imgUrls = Result?.responseBody;
          setUploadFileData(imgUrls[0]);
          setCompanyDetails((prev) => ({
            ...prev,
            basicDetails: {
              companyLogo: imgUrls[0],
              // companyLogoAWS: imgUrls[0],
              ...prev.basicDetails?.companyLogo,
            },
          }));
          setUploadModal(false);
        } else {
          message.error('Something went wrong')
          setUploadModal(false);
        }


      }
    },
    [setBase64Image, setUploadFileData]
  );

  const getDetailsForAutoFetchAI = async (compURL) => {
    setShowFetchAIButton(false)
    setLoadingCompanyDetails(true)
    const result = await allCompanyRequestDAO.getCompanyDetailDAO(0, compURL);

    if (result?.statusCode === HTTPStatusCode.OK) {
      if (result?.responseBody?.basicDetails?.companyLogo !== null) {
        let newresponse = {
          ...result?.responseBody, basicDetails: {
            ...result?.responseBody?.basicDetails,
            companyLogo: `${result?.responseBody?.basicDetails?.companyLogo}`
          }
        }
        setCompanyDetails(newresponse);
      } else {
        message.warn("No Detail Fetched From AI")
      }

      setLoadingCompanyDetails(false)
    }
    setLoadingCompanyDetails(false)
  };


  const validateCompanyURL = async () => {
    setShowFetchAIButton(false);
    // clearErrors("companyURL");
    setIsViewCompanyurl(false);

    if (!companySectionData?.companyName) {
      message.error('Company Name / Website URL can not be blank to fetch the company logo')

    }
    if (companySectionData?.companyURL) {
      let linkedInPattern = /linkedin\.com/i;
      if (linkedInPattern.test(companySectionData?.companyURL)) {
        message.error('Entered value does not match url format')

        return
      }

      if (ValidateFieldURL(companySectionData?.companyURL, "website")) {
        if (companyDetails?.website === companySectionData?.companyURL) {

          setDisableSubmit(false);
          setIsViewCompanyurl(false);
          return;
        }
        let payload = {
          workEmail: "",
          companyName: companySectionData?.companyName,
          currentCompanyID: +companyID,
          websiteURL: companySectionData?.companyURL,
        };

        const result = await allCompanyRequestDAO.validateClientCompanyDAO(
          payload
        );

        if (result.statusCode === HTTPStatusCode.OK) {

          setDisableSubmit(false);
          setIsViewCompanyurl(false);
          if (companyID === "0") {
            // setShowFetchAIButton(true);
            getDetailsForAutoFetchAI(companySectionData?.companyURL)
          }
        }
        if (result.statusCode === HTTPStatusCode.BAD_REQUEST) {
          setDisableSubmit(true);
          setIsViewCompanyurl(true);
          setcompanyID(result?.details?.companyID);
          message.error(result?.responseBody)

        }
      } else {
        message.error("Entered value does not match url format")

      }
    }
  };

  useEffect(() => {
    if (getCompanyDetails?.basicDetails) {
      setConfidentialInfo(getCompanyDetails.basicDetails?.isCompanyConfidential === true ? 1 : 0)
    }
    if (getCompanyDetails?.confidentialDetails) {
      setCompanyConfidentialFields({
        companyLogoAlias: getCompanyDetails?.confidentialDetails.companyLogoAlias ?? '',
        headquatersAlias: getCompanyDetails?.confidentialDetails.companyHQAlias ?? '',
        companyNameAlias: getCompanyDetails?.confidentialDetails.companyAlias ?? '',

      })
    }

    if (getCompanyDetails?.contactDetails) {
      let clientsArr = []
      getCompanyDetails?.contactDetails.map(client => {
        clientsArr.push({
          ...client,
          emailIDAlias: client.clientPOCEmail,
          fullNameAlias: client.clientPOCName
        })

      })
    }
  }, [getCompanyDetails?.confidentialDetails])

  const getHRPricingType = useCallback(async () => {
    const HRPricingResponse = await MasterDAO.getHRPricingTypeDAO();
    setHRPricingTypes(
      HRPricingResponse &&
      HRPricingResponse.responseBody
    );
  }, []);

  useEffect(() => {
    getHRPricingType()
  }, [])

  const getRequiredHRPricingType = useCallback(() => {
    let reqOpt = []
    if (typeOfPricing === 1) {
      let Filter = hrPricingTypes.filter(item => item.isActive === true && item.isTransparent === true && item.engagementType === "Full Time")
      if (Filter.length) {
        reqOpt = Filter.map(item => ({ id: item.id, value: item.type }))
      }
    } else {
      let Filter = hrPricingTypes.filter(item => item.isActive === true && item.isTransparent === false && item.engagementType === "Full Time")
      if (Filter.length) {
        reqOpt = Filter.map(item => ({ id: item.id, value: item.type }))
      }
    }

    return reqOpt

  }, [hrPricingTypes, typeOfPricing])

  useEffect(() => {
    if (hrPricingTypes.length > 0) {
      let typeArr = [...hrPricingTypes]
      if (getCompanyDetails?.hiringDetails?.length > 0) {
        getCompanyDetails?.hiringDetails.forEach(item => {
          let ind = typeArr.findIndex(val => val.id === item.hiringTypePricingId)
          typeArr[ind] = { ...typeArr[ind], pricingPercent: item.hiringTypePercentage }
        })
      }
      setManageablePricingType(typeArr)
    }

  }, [hrPricingTypes, getCompanyDetails?.hiringDetails])



  const checkFormValidation = () => {
    setAboutCompanyError(false);
    let valid = true
    if (companySectionData?.companyName.trim() === '') {
      valid = false
    }

    if (companySectionData?.companyURL.trim() === '' || !ValidateFieldURL(companySectionData?.companyURL, "website")) {
      valid = false
    }

    if (companySectionData?.companyLinkedinURL !== '' && !ValidateFieldURL(companySectionData?.companyLinkedinURL, "linkedin")) {
      valid = false
    }

    if (companySectionData?.foundedIn === null || companySectionData?.LeadType === null || companySectionData?.LeadUser === null) {
      valid = false
    }

    if (companySectionData?.teamSize?.trim() === '' || companySectionData?.teamSize < 1) {
      valid = false
    }

    if (companySectionData?.industry.trim() === '') {
      valid = false
    }


    if (isQuillEmpty(companySectionData?.aboutCompany)) {
      setAboutCompanyError(true);
      valid = false

    }


    if (companySectionData?.Category === null || companySectionData?.Geo === null) {
      valid = false
    }

    if (confidentialInfo === 1) {
      if (companyConfidentailFields?.companyNameAlias?.trim() === '' || companyConfidentailFields?.companyNameAlias === null) {
        valid = false
      }
      if (companyConfidentailFields?.companyLogoAlias?.trim() === '' || companyConfidentailFields?.companyLogoAlias === null) {
        valid = false
      }
    }

    if (checkPayPer?.companyTypeID !== 0 &&
      checkPayPer?.companyTypeID !== null) {
      if (companySectionData?.creditCurrency === null || companySectionData?.creditAmount.trim() === '' || companySectionData?.creditAmount < 1) {
        valid = false
      }

      if (IsChecked?.isPostaJob && (companySectionData?.jobPostCredit.trim() === '' || companySectionData?.jobPostCredit < 1)) {
        valid = false
      }
    }

    if (confidentialInfo === 1) {
      if (companyConfidentailFields?.companyNameAlias?.trim() === '' || companyConfidentailFields?.companyNameAlias === null || companyConfidentailFields?.companyLogoAlias?.trim() === '' || companyConfidentailFields?.companyLogoAlias === null) {
        valid = false
      }
    }

    if (uplersPOCname === null) {
      valid = false
    }


    clientsData.forEach(client => {
      if (client.fullName.trim() === '') {
        valid = false
      }

      if (client.emailID.trim() === '' || !eReg.test(client.emailID)) {
        valid = false
      }
    })


    return valid
  }

  const handleCreateCompany = async () => {
    console.log(companySectionData)

    let isValid = true

    isValid = checkFormValidation()


    if (isValid === false) {
      setFormValidationError(true)
      return
    }

    // console.log(d,"aboutCompanyaboutCompanyaboutCompany");

    const allClientEmails = clientsData.map(c => c.emailID)

    const hasDuplicate =
      new Set(allClientEmails).size !== allClientEmails.length;

    if (hasDuplicate) {
      message.error("Duplicate email addresses are not allowed.")
      return
    }

    if (typeOfPricing === null && checkPayPer?.anotherCompanyTypeID == 1 && (checkPayPer?.companyTypeID == 0 || checkPayPer?.companyTypeID == 2)) {
      setPricingTypeError(true)

      return
    }

    if (!companySectionData?.hiringPricingType && checkPayPer?.anotherCompanyTypeID == 1 && (checkPayPer?.companyTypeID == 0 || checkPayPer?.companyTypeID == 2)) {
      setPricingTypeErrorPPH(true)

      return
    }

    if (checkPayPer?.anotherCompanyTypeID == 0 && checkPayPer?.companyTypeID == 0) {


      setPayPerError(true)
      return
    }

    if (checkPayPer?.companyTypeID === 2 && IsChecked?.isPostaJob === false && IsChecked?.isProfileView === false) {
      setCreditError(true)
      return
    }



    // check for at lest one admin client
    let isAdmin = false

    clientsData.map((client) => {
      if (client.roleID === 1) {
        isAdmin = true
      }
    })

    if (!isAdmin) {
      message.error(" Please Select a client as Admin")

      return
    }

    let modClientDetails = clientsData.map((client) => {

      // generate random password and encrypt that            
      const newGuid = uuidv4();
      const shortGuid = newGuid.slice(0, 10); // Pick only the first 10 letters 
      let password = shortGuid;
      let encryptedPassword = encrypt(password);

      return {
        "clientID": companyID !== '0' ? client.id : 0,
        "en_Id": client.en_Id,
        "isPrimary": client.isPrimary,
        "fullName": client.fullName,
        "emailId": client.emailID,
        "designation": client.designation,
        // "phoneNumber": client.countryCode+ client.contactNo,
        "phoneNumber": client.contactNo,
        "accessRoleId": client.roleID,
        "password": password,
        "encryptedPassword": encryptedPassword,
        "clientPOCNameAlias": client.fullNameAlias,
        "clientPOCEmailAlias": client.emailIDAlias,
        "SendEmailNotification": client.isClientNotificationSend,
      }

    })

    let modCultureDetails = getCompanyDetails?.cultureDetails?.map((culture) => ({
      cultureID: culture.cultureID,
      culture_Image: culture.cultureImage
    }))

    console.log(manageablePricingType.filter(i => getRequiredHRPricingType().map(it => it.id).includes(i.id)).map(item => ({
      "hiringTypePricingId": item.id,
      "hiringTypePricingPercentage": item.pricingPercent
    })), checkPayPer?.anotherCompanyTypeID)

    let companyHiringTypePricing = +checkPayPer?.anotherCompanyTypeID === 1 ? manageablePricingType.filter(i => getRequiredHRPricingType().map(it => it.id).includes(i.id)).map(item => ({
      "hiringTypePricingId": item.id,
      "hiringTypePricingPercentage": item.pricingPercent
    })) : undefined

    let valid = true
    if (companyHiringTypePricing) {

      companyHiringTypePricing.forEach(val => {
        if (val.hiringTypePricingPercentage <= 0 || val.hiringTypePricingPercentage >= 100) {
          setLoadingDetails(false)

          setDisableSubmit(false)
          message.error(`Please provide "${getRequiredHRPricingType().find(itm => itm.id === val.hiringTypePricingId)?.value}" % value between 1-99`)
          valid = false
        }
      })
    }
    if (!valid) {
      return
    }

    let geo_id = filtersList.Geo.find(item => item.text === companySectionData?.Geo)?.value

    let usrTypeVal = leadTypeOptions.find(i => i.id === companySectionData.LeadType)?.value

    let fundingObj = [{
      ...fundingSectionData,
      fundingID: 0,
      fundingRound: fundingSectionData?.series,
      month: fundingSectionData?.month ?? '',
      year: fundingSectionData?.year ?? ''
    }]

    let payload = {
      "basicDetails": {
        "companyID": companyID,
        "companyName": companySectionData?.companyName,
        "companyLogo": getCompanyDetails?.basicDetails?.companyLogo,
        "websiteUrl": companySectionData?.companyURL,
        "foundedYear": companySectionData?.foundedIn,
        "company_Category": companySectionData?.Category,
        // "companySize": +d.teamSize,
        'geo_id': companySectionData?.Geo,
        'companyGeo': geo_id,
        "teamSize": companySectionData?.teamSize,
        "companyType": companySectionData?.companyType,
        "industry": companySectionData?.industry,
        "headquaters": companySectionData?.headquaters,
        "aboutCompanyDesc": companySectionData?.aboutCompany,
        "culture": cultureSectionData?.culture?.length > 0 ? cultureSectionData?.culture : undefined,
        "linkedInProfile": companySectionData?.companyLinkedinURL,
        "isSelfFunded": fundingSectionData?.isSelfFunded,
        "isCompanyConfidential": confidentialInfo === 1 ? true : false,
        "leadUserID": companySectionData.LeadUser,
        "leadUserType": usrTypeVal
      },
      "fundingDetails": fundingObj,
      "cultureDetails": modCultureDetails,
      "perkDetails": cultureSectionData?.perksAndAdvantages?.length > 0 ? cultureSectionData?.perksAndAdvantages : undefined,
      "youTubeDetails": getCompanyDetails?.youTubeDetails,
      "clientDetails": modClientDetails,
      "engagementDetails": {
        "companyTypeID": checkPayPer?.companyTypeID,
        "anotherCompanyTypeID": +checkPayPer?.anotherCompanyTypeID,
        "isPostaJob": IsChecked.isPostaJob,
        "isProfileView": IsChecked.isProfileView,
        "jpCreditBalance": +checkPayPer?.companyTypeID === 2 ? +companySectionData?.freeCredit ?? null : null,
        "isTransparentPricing": typeOfPricing === 1 ? true : typeOfPricing === 0 ? false : null,
        "isVettedProfile": true,
        "creditAmount": (+checkPayPer?.companyTypeID === 2) ? +companySectionData?.creditAmount : null,
        "creditCurrency": +checkPayPer?.companyTypeID === 2 ? companySectionData?.creditCurrency : null,
        "jobPostCredit": (+checkPayPer?.companyTypeID === 2 && IsChecked?.isPostaJob === true) ? +companySectionData?.jobPostCredit ?? null : null,
        "vettedProfileViewCredit": (+checkPayPer?.companyTypeID === 2 && IsChecked?.isProfileView === true) ? +companySectionData?.vettedProfileViewCredit ?? null : null,
        "nonVettedProfileViewCredit": (+checkPayPer?.companyTypeID === 2 && IsChecked?.isProfileView === true) ? +companySectionData?.nonVettedProfileViewCredit ?? null : null,
        "hiringTypePricingId": +checkPayPer?.anotherCompanyTypeID === 1 ? companySectionData?.hiringPricingType : null,
        "hiringTypePricingPercentage": +checkPayPer?.anotherCompanyTypeID === 1 ? manageablePricingType.find(itm => itm.id === companySectionData?.hiringPricingType)?.pricingPercent : undefined
      },
      "companyConfidentialDetails": {
        "companyAlias": companyConfidentailFields.companyNameAlias,
        "companyURLAlias": null,
        "companyLinkedInAlias": null,
        "companyHQAlias": companyConfidentailFields.headquatersAlias,
        "companyLogoAlias": companyConfidentailFields.companyLogoAlias
      },
      // "pocIds": uplersPOCname,
      "companyHiringTypePricing": companyHiringTypePricing,
      "pocId": uplersPOCname,
      "HRID": getCompanyDetails?.pocUserDetailsEdit?.hrid ?? 0,
      "Sales_AM_NBD": getCompanyDetails?.pocUserDetailsEdit?.sales_AM_NBD ?? '',
      "IsRedirectFromHRPage": state?.createHR ? true : false
    }

    console.log("payload", payload)
    setLoadingDetails(true)
    setDisableSubmit(true)
    let submitresult = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload)

    setLoadingDetails(false)
    setDisableSubmit(false)

    setCompanyDetails(prev => ({
      ...prev,
      basicDetails: payload.basicDetails
    }))
    // console.log("submited res",submitresult)
    if (submitresult?.statusCode === HTTPStatusCode.OK) {
      if (state?.createHR) {
        navigate('/allhiringrequest/addnewhr', {
          state: {
            companyID: submitresult?.responseBody?.companyID,
            companyName: submitresult?.responseBody?.companyName,
            clientDetails: submitresult?.responseBody?.summaryClients
          }
        })
        window.scrollTo(0, 0)
      } else {
        navigate('/allClients')
      }

    }

    if (submitresult?.statusCode === HTTPStatusCode.BAD_REQUEST) {
      message.error("Validation Error : " + submitresult?.responseBody)
    }



  }

  const validateClientEemailName = async (id, index) => {
    let payload = {
      workEmail: clientsData[index].emailID,
      companyName: companySectionData?.companyName,
      currentCompanyID: +companyID,
    };

    const result = await allCompanyRequestDAO.validateClientCompanyDAO(payload);

    if (result.statusCode === HTTPStatusCode.OK) {
      // clearErrors(`clientDetails.[${index}].emailID`);
      setClientsEmailError(prev => {
        let no = { ...prev }

        delete no[id]
        return no
      })
      setDisableSubmit(false);
    }
    if (result.statusCode === HTTPStatusCode.BAD_REQUEST) {
      setDisableSubmit(true);
      setClientsEmailError(prev => ({ ...prev, [`${id}`]: result?.responseBody }))
      console.log(result?.responseBody)
    }
  };

  useEffect(() => {
    if (getCompanyDetails?.perkDetails?.length > 0) {
      // setValue('perksAndAdvantages',getCompanyDetails?.perkDetails?.map(item=> ({
      //     id: item,
      //     value: item,
      // })))
      setCultureSectionData(p => ({ ...p, perksAndAdvantages: getCompanyDetails?.perkDetails?.map(item => item) }))
      if (getValuesForDD?.CompanyPerks?.length > 0) {
        setCombinedPerkMemo([...getCompanyDetails?.perkDetails?.map(item => ({
          id: item,
          value: item,
        })), ...getValuesForDD?.CompanyPerks?.filter(item => !getCompanyDetails?.perkDetails?.includes(item.value)).map(item => ({
          id: item.value,
          value: item.value,
        }))])
      }

      // setControlledperk(getCompanyDetails?.perkDetails?.map(item=> ({
      //     id: item,
      //     value: item,
      // })))
    } else {
      setCombinedPerkMemo(getValuesForDD?.CompanyPerks?.map(item => ({
        id: item.value,
        value: item.value,
      })))
    }

    // if(companyDetails?.companyName){
    //     companyDetails?.culture && setValue('culture',companyDetails?.culture)
    // }
  }, [getCompanyDetails?.perkDetails, companyDetails, getValuesForDD?.CompanyPerks])

  const uploadCultureImages = async (Files) => {
    setUploading(true)
    let filesToUpload = new FormData()

    for (let i = 0; i < Files.length; i++) {
      filesToUpload.append("Files", Files[i])
    }
    filesToUpload.append('IsCompanyLogo', false)
    filesToUpload.append('IsCultureImage', true)
    filesToUpload.append("type", "culture_images")

    let Result = await allCompanyRequestDAO.uploadImageDAO(filesToUpload)

    if (Result?.statusCode === HTTPStatusCode.OK) {
      let imgUrls = Result?.responseBody

      let imgObj = imgUrls.map(url => (
        {
          "cultureID": 0,
          "cultureImage": url
        }
      ))
      let newCultureObj = [...getCompanyDetails?.cultureDetails]
      setCompanyDetails(prev => ({
        ...prev,
        cultureDetails: [...imgObj, ...newCultureObj]
      }))
    }
    setUploading(false)
  }


  const handleDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files.length) return;

    const acceptedTypes = ["image/jpeg", "image/png"];
    const maxSize = 25 * 1024 * 1024;

    for (const file of files) {
      if (!acceptedTypes.includes(file.type)) {
        message.info("Please select a valid image file (JPEG or PNG).");
        return;
      }

      if (file.size > maxSize) {
        message.error("Maximum image size are 25 MB.");
        return;
      }
    }

    try {
      uploadCultureImages(files);
    } catch (error) {
      console.error("Error reading the file:", error);
    }
  };

  const addnewYoutubeLink = (e) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&=%\?]{11})$/;
    if (!regex.test(e.target.value)) {
      return message.error('Please provide proper youtube video link, channel/page link not allowed.')
    }

    let youtubeDetail = {
      youtubeLink: cultureSectionData?.youtubeLink,
      youtubeID: 0
    }

    let oldLinks = getCompanyDetails?.youTubeDetails?.map(item => item.youtubeLink)
    if (oldLinks?.includes(cultureSectionData?.youtubeLink)) {
      setCultureSectionData(p => ({
        ...p,
        youtubeLink: ''
      }))

      return message.error('Youtube link Already exists')
    }

    let nweyouTubeDetails = [...getCompanyDetails?.youTubeDetails]
    setCompanyDetails(prev => ({ ...prev, youTubeDetails: [youtubeDetail, ...nweyouTubeDetails] }))
    setCultureSectionData(p => ({
      ...p,
      youtubeLink: ''
    }))
  }

  const onAddNewClient = useCallback(
    (e) => {
      e.preventDefault();
      let nClie = { ...secondaryClient }
      let nid = uuidv4()
      setClientsData(prev => [...prev, { ...nClie, id: nid }])
    },
    []
  );
  const onRemoveAddedClient = useCallback(
    (e, index, id) => {
      e.preventDefault();
      // let ind = 
      setClientsData(prev => prev.filter(cli => cli.id !== id))
    },
    []
  );


  return (
    <main className={`${companyStyles["main-content"]}`}>


      {/* <!-- Content Section --> */}
      <div className={`${companyStyles["content-wrapper"]}`}>
        {/* <!-- Add New Company Form --> */}
        <div className={`${companyStyles["new-hr-form-wrapper"]}`}>
          <form className={`${companyStyles["new-hr-form"]} ${companyStyles["add-company-form"]}`}>
            <h1 className={`${companyStyles["page-title"]}`}>Add a new company</h1>

            {/* <!-- Basic Details Section --> */}
            <section className={`${companyStyles["form-section"]}`}>
              <h2 className={`${companyStyles["section-title"]}`}>Basic details</h2>

              <div className={`${companyStyles["form-rows"]}`}>
                {loadingDetails ? <Skeleton active /> : <>
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-12"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <div className={`${companyStyles["company-logo-upload"]}`}>
                          <div className={`${companyStyles["company-logo-placeholder"]}`} id="companyLogoPlaceholder">
                            {!getUploadFileData ?
                              <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 48C0 21.4903 21.4903 0 48 0C74.5097 0 96 21.4903 96 48C96 74.5097 74.5097 96 48 96C21.4903 96 0 74.5097 0 48Z" fill="url(#paint0_linear_6748_10856)" />
                                <path d="M52.1654 34.667H43.832L39.6654 39.667H34.6654C33.7813 39.667 32.9335 40.0182 32.3083 40.6433C31.6832 41.2684 31.332 42.1163 31.332 43.0003V58.0003C31.332 58.8844 31.6832 59.7322 32.3083 60.3573C32.9335 60.9825 33.7813 61.3337 34.6654 61.3337H61.332C62.2161 61.3337 63.0639 60.9825 63.6891 60.3573C64.3142 59.7322 64.6654 58.8844 64.6654 58.0003V43.0003C64.6654 42.1163 64.3142 41.2684 63.6891 40.6433C63.0639 40.0182 62.2161 39.667 61.332 39.667H56.332L52.1654 34.667Z" stroke="#9E9FAB" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M48 54.6666C50.7614 54.6666 53 52.428 53 49.6666C53 46.9052 50.7614 44.6666 48 44.6666C45.2386 44.6666 43 46.9052 43 49.6666C43 52.428 45.2386 54.6666 48 54.6666Z" stroke="#9E9FAB" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round" />
                                <defs>
                                  <linearGradient id="paint0_linear_6748_10856" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#F3F4F6" />
                                    <stop offset="1" stop-color="#E5E7EB" />
                                  </linearGradient>
                                </defs>
                              </svg> :
                              <img
                                style={{
                                  width: "145px",
                                  height: "145px",
                                  borderRadius: "50%",
                                }}
                                src={base64Image ? base64Image : getUploadFileData}
                                alt="preview"
                              />
                            }
                          </div>
                          <button type="button" className={`${companyStyles["logo-edit-btn"]}`} aria-label="Edit logo" onClick={() => setUploadModal(true)}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14.2075 4.5856L11.4144 1.7931C11.3215 1.70021 11.2113 1.62653 11.0899 1.57626C10.9686 1.526 10.8385 1.50012 10.7072 1.50012C10.5759 1.50012 10.4458 1.526 10.3245 1.57626C10.2031 1.62653 10.0929 1.70021 10 1.7931L2.29313 9.49997C2.19987 9.59249 2.12593 9.70263 2.0756 9.82398C2.02528 9.94533 1.99959 10.0755 2.00001 10.2068V13C2.00001 13.2652 2.10536 13.5195 2.2929 13.7071C2.48043 13.8946 2.73479 14 3.00001 14H13.5C13.6326 14 13.7598 13.9473 13.8536 13.8535C13.9473 13.7598 14 13.6326 14 13.5C14 13.3674 13.9473 13.2402 13.8536 13.1464C13.7598 13.0526 13.6326 13 13.5 13H7.20751L14.2075 5.99997C14.3004 5.90711 14.3741 5.79686 14.4243 5.67552C14.4746 5.55418 14.5005 5.42412 14.5005 5.29278C14.5005 5.16144 14.4746 5.03139 14.4243 4.91005C14.3741 4.78871 14.3004 4.67846 14.2075 4.5856ZM5.79313 13H3.00001V10.2068L8.50001 4.70685L11.2931 7.49997L5.79313 13ZM12 6.7931L9.20751 3.99997L10.7075 2.49997L13.5 5.2931L12 6.7931Z" fill="white" />
                            </svg>
                          </button>
                          <input ref={companyLogoRef} type="file" className={`${companyStyles["company-logo-input"]}`} accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml" id="companyLogoInput" style={{ display: " none" }}
                            onChange={uploadFileHandler} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <input type="text" className={`${companyStyles["form-input"]}`} name="companyName" placeholder="Company name *" required
                          value={companySectionData?.companyName}
                          onChange={(e) => {
                            if (companyID === "0") {
                              setShowFetchAIButton(false);

                              setIsViewCompanyurl(false);
                            }
                            setCompanySectionData(prev => ({
                              ...prev,
                              companyName: e.target.value
                            }))
                          }}
                          onBlur={() => validateCompanyName()}
                        />
                      </div>
                      {formValidationError && companySectionData?.companyName.trim() === '' && <p className={`${companyStyles["fieldError"]}`}>*Please enter company name </p>}
                      {isViewCompany && (
                        <button
                          className={companyStyles.btnPrimary}
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsPreviewModal(true)
                          }}
                        >
                          View Company
                        </button>
                      )}
                    </div>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <input type="url" className={`${companyStyles["form-input"]}`} name="companyWebsite" placeholder="Company website URL *"
                          value={companySectionData?.companyURL}
                          onChange={(e) => {

                            setCompanySectionData(prev => ({
                              ...prev,
                              companyURL: e.target.value
                            }))
                          }}
                          onBlur={() => validateCompanyURL()}
                        />
                      </div>
                      {formValidationError && (companySectionData?.companyURL.trim() === '' || !ValidateFieldURL(companySectionData?.companyURL, "website")) && <p className={`${companyStyles["fieldError"]}`}>*Please enter valid company url </p>}
                      {isViewCompanyurl && companySectionData?.companyName && (
                        <button
                          className={companyStyles.btnPrimary}
                          onClick={() => setIsPreviewModal(true)}
                        >
                          View Company
                        </button>
                      )}
                    </div>
                  </div>
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <input type="url" className={`${companyStyles["form-input"]}`} name="companyLinkedIn" placeholder="Company LinkedIn URL"
                          value={companySectionData?.companyLinkedinURL}
                          onChange={(e) => {

                            setCompanySectionData(prev => ({
                              ...prev,
                              companyLinkedinURL: e.target.value
                            }))
                          }}
                        />

                        {formValidationError && (companySectionData?.companyLinkedinURL !== '' && !ValidateFieldURL(companySectionData?.companyLinkedinURL, "linkedin")) && <p className={`${companyStyles["fieldError"]}`}>*Please enter valid linkedin url </p>}
                      </div>
                    </div>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.value?.toLowerCase().includes(input.toLowerCase())
                          }
                          fieldNames={{
                            value: "id",      // stored value
                            label: "value"    // display text
                          }}
                          placeholder="Founded in *"
                          options={yearOptions.reverse()}
                          value={companySectionData?.foundedIn}
                          onChange={(val, valObj) => {
                            setCompanySectionData(p => ({ ...p, foundedIn: val }))
                          }}
                        />
                        {formValidationError && companySectionData?.foundedIn === null && <p className={`${companyStyles["fieldError"]}`}>*Please select founded in </p>}
                        {/* <div className={`${companyStyles["autocomplete-wrapper"]}`} data-autocomplete="foundedIn">
                        <input type="text" className={`${companyStyles["form-input"]} ${companyStyles["form-input-autocomplete"]}`} name="foundedIn" placeholder="Founded in" autocomplete="off" />
                        <div className={`${companyStyles["autocomplete-dropdown"]}`}></div>
                      </div> */}
                      </div>
                    </div>
                  </div>
                  <div className={`${companyStyles["row"]} ${companyStyles["mt-1"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-12"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <label className={`${companyStyles["form-label"]}`}>Engagement model *</label>
                        <div className={`${companyStyles["checkbox-group"]} ${companyStyles["checkbox-inline"]}`}>
                          <label className={`${companyStyles["checkbox-label"]}`}>
                            <input type="checkbox" name="engagementModel[]" value={2} id="engagement-pay-per-credit" className={`${companyStyles["form-checkbox"]}`}
                              checked={checkPayPer?.companyTypeID}
                              onChange={(e) => {
                                // resetField('hiringPricingType')

                                setCheckPayPer({
                                  ...checkPayPer,
                                  companyTypeID:
                                    e.target.checked === true ? e.target.value : 0,
                                });
                                setPayPerError(false);
                                setIsChecked({
                                  ...IsChecked,
                                  isPostaJob: false,
                                  isProfileView: false,
                                });
                              }}
                            />
                            <span>Pay Per Credit</span>
                          </label>
                          <label className={`${companyStyles["checkbox-label"]}`}>
                            <input type="checkbox" name="engagementModel[]" value={1} className={`${companyStyles["form-checkbox"]}`}
                              checked={checkPayPer?.anotherCompanyTypeID}
                              onChange={(e) => {
                                // resetField('hiringPricingType')

                                setCheckPayPer({
                                  ...checkPayPer,
                                  anotherCompanyTypeID:
                                    e.target.checked === true ? e.target.value : 0,
                                });

                                setPayPerError(false);
                                setTypeOfPricing(null);
                              }}
                            />
                            <span>Pay per hire</span>
                          </label>
                          {/* <label className={`${companyStyles["checkbox-label"]}`}>
                                                <input type="checkbox" name="engagementModel[]" value="pay-per-profile" className={`${companyStyles["form-checkbox"]}`}/>
                                                <span>Pay per profile</span>
                                            </label> */}
                        </div>
                        {payPerError && (
                          <p className={`${companyStyles["fieldError"]}`}>
                            *Please select client model
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* PAY Per Credit Fields  */}
                  {checkPayPer?.companyTypeID !== 0 &&
                    checkPayPer?.companyTypeID !== null && <>
                      <div className={`${companyStyles["row"]} ${companyStyles["mt-1"]} ${companyStyles["pay-per-credit-row"]}`}>
                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                          <div className={`${companyStyles["form-group"]}`}>
                            <Select
                              showSearch
                              filterOption={(input, option) =>
                                option.value?.toLowerCase().includes(input.toLowerCase())
                              }
                              fieldNames={{
                                value: "id",      // stored value
                                label: "value"    // display text
                              }}
                              placeholder="currency *"
                              options={['USD', 'INR'].map(v => ({ id: v, value: v }))}
                              value={companySectionData?.creditCurrency}
                              onChange={(val, valObj) => {
                                setCompanySectionData(p => ({ ...p, "creditCurrency": val }))
                              }}
                            />
                            {formValidationError && companySectionData?.creditCurrency === null && <p className={`${companyStyles["fieldError"]}`}>*Please select currency </p>}
                            {/* <select className={`${companyStyles["form-select"]}`} name="currency">
                        <option value="">Currency</option>
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                      </select> */}
                          </div>
                        </div>
                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                          <div className={`${companyStyles["form-group"]}`}>
                            <input type="number" className={`${companyStyles["form-input"]}`} name="per-credit-amount" placeholder="Per Credit Amount *" autocomplete="off"
                              value={companySectionData?.creditAmount}
                              onChange={e => {
                                setCompanySectionData(prev => ({
                                  ...prev,
                                  creditAmount: e.target.value
                                }))
                              }}
                            />
                            {formValidationError && (companySectionData?.creditAmount.trim() === '' || companySectionData?.creditAmount < 1) && <p className={`${companyStyles["fieldError"]}`}>*Please enter credit amount </p>}
                          </div>
                        </div>
                      </div>
                      <div className={`${companyStyles["row"]} ${companyStyles["row"]}`}>
                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                          <div className={`${companyStyles["form-group"]}`}>
                            <input type="number" className={`${companyStyles["form-input"]}`} name="free-credit" placeholder="Free Credit" autocomplete="off"
                              value={companySectionData?.freeCredit}
                              onChange={e => {
                                setCompanySectionData(prev => ({
                                  ...prev,
                                  freeCredit: e.target.value
                                }))
                              }} />
                          </div>

                        </div>
                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                          <div className={`${companyStyles["checkbox-group"]} ${companyStyles["checkbox-inline"]}`}>
                            <label className={`${companyStyles["checkbox-label"]}`}>
                              <input type="checkbox" name="engagementModel[]" value={2} id="engagement-pay-per-credit" className={`${companyStyles["form-checkbox"]}`}
                                checked={IsChecked?.isPostaJob}
                                onChange={(e) => {
                                  setIsChecked({
                                    ...IsChecked,
                                    isPostaJob: e.target.checked,
                                  });
                                  setCreditError(false);
                                }}
                              />
                              <span>Credit per post a job.</span>
                            </label>

                          </div>
                        </div>
                      </div>

                      {IsChecked?.isPostaJob && <div className={`${companyStyles["row"]} ${companyStyles["row"]}`}>
                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                          <div className={`${companyStyles["form-group"]}`}>
                            <input type="number" className={`${companyStyles["form-input"]}`} name="jobPostCredit" placeholder="Credit per post a job *" autocomplete="off"
                              value={companySectionData?.jobPostCredit}
                              onChange={e => {
                                setCompanySectionData(prev => ({
                                  ...prev,
                                  jobPostCredit: e.target.value
                                }))
                              }} />
                            {formValidationError && (companySectionData?.jobPostCredit.trim() === '' || companySectionData?.jobPostCredit < 1) && <p className={`${companyStyles["fieldError"]}`}>*Please enter credit per post </p>}
                          </div>
                        </div>
                      </div>}
                    </>}

                  {!(
                    checkPayPer?.anotherCompanyTypeID == 0 &&
                    (checkPayPer?.companyTypeID == 0 ||
                      checkPayPer?.companyTypeID == 2)
                  ) && <>
                      <div className={`${companyStyles["row"]} ${companyStyles["row"]}`}>
                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                          <div className={`${companyStyles["form-group"]}`}>
                            <label className={companyStyles.label} style={{ marginBottom: "8px" }}>
                              Type Of Pricing
                              <span className={companyStyles.reqField}>*</span>
                            </label>
                            {pricingTypeError && (
                              <p className={companyStyles.error}>
                                *Please select pricing type
                              </p>
                            )}
                            <Radio.Group
                              disabled={
                                // userData?.LoggedInUserTypeID !== 1 ||
                                checkPayPer?.anotherCompanyTypeID == 0 &&
                                (checkPayPer?.companyTypeID == 0 ||
                                  checkPayPer?.companyTypeID == 2)
                              }
                              onChange={(e) => {
                                setTypeOfPricing(+e.target.value);
                                setPricingTypeError && setPricingTypeError(false);
                                setPricingTypeErrorPPH && setPricingTypeErrorPPH(false);
                                setCompanySectionData(p => ({ ...p, "hiringPricingType": '' }))

                              }}
                              value={typeOfPricing}
                            >
                              <Radio value={1}>Transparent Pricing</Radio>
                              <Radio value={0}>Non Transparent Pricing</Radio>
                            </Radio.Group>
                          </div>
                        </div>
                      </div>
                    </>}
                  {/* {console.log('checkPayPer?.anotherCompanyTypeID, typeOfPricing ', checkPayPer?.anotherCompanyTypeID, typeOfPricing)} */}
                  {checkPayPer?.anotherCompanyTypeID == 1 && typeOfPricing !== null && <>
                    <div className={companyStyles.engModelField}>
                      <label className={companyStyles.label} style={{ marginBottom: "8px" }}>
                        Choose Default/Current Engagement Model
                        <span className={companyStyles.reqField}>*</span>
                      </label>
                      <Radio.Group
                        onChange={(e) => {
                          setPricingTypeErrorPPH(false)
                          setCompanySectionData(p => ({
                            ...p,
                            'hiringPricingType': getRequiredHRPricingType().find(item => item.id === e.target.value).id
                          }))

                        }}
                        value={companySectionData?.hiringPricingType}
                      >

                        {
                          getRequiredHRPricingType().map((value, ind) => {
                            let fieldInd = manageablePricingType.findIndex(itm => itm.id === value.id)
                            console.log(manageablePricingType, fieldInd, value)
                            return <>
                              <div className={companyStyles.engModelOption}>
                                <Radio value={value.id}>{value.value}</Radio>
                                {/* <input
                              value={manageablePricingType.find(item=> item.id === value.id).pricingPercent}
                              className={formFieldClasses}
                              type={'number'}
                              onChange={(e) => {
                                setManageablePricingType(prev=> {
                                  let newArr = [...prev]
                                  let i = prev.findIndex(itm=> itm.id === value.id)
                                  newArr[i] = {...newArr[i] ,pricingPercent : + e.target.value }
                                  return newArr
                                })
                              }}

                            />                        */}

                                <div className={`${companyStyles["form-group"]}`}>
                                  <input type="number" className={`${companyStyles["form-input"]}`} name={`pricingPercent_${value?.id}`} placeholder="Pricing %" autocomplete="off"
                                    value={manageablePricingType[fieldInd].pricingPercent}
                                    onChange={e => {
                                      setManageablePricingType(prev => {
                                        let newArr = [...prev]
                                        let i = prev.findIndex(itm => itm.id === value.id)
                                        newArr[i] = { ...newArr[i], pricingPercent: + e.target.value }
                                        return newArr
                                      })
                                    }} /> %
                                </div>


                              </div>
                            </>
                          }

                          )
                        }

                        {/* <Radio value={1}>Hire a Contractor <input type="text" value={}/> </Radio>
                      <Radio value={2}>Hire an employee on Uplers Payroll</Radio>
                      <Radio value={3}>Direct-hire</Radio> */}
                      </Radio.Group>
                    </div>
                    {pricingTypeErrorPPH && (
                      <p className={companyStyles.error}>
                        *Please choose engagement model
                      </p>
                    )}



                  </>}

                  {!(
                    checkPayPer?.anotherCompanyTypeID == 0 &&
                    (checkPayPer?.companyTypeID == 0 ||
                      checkPayPer?.companyTypeID == 2)
                  ) &&
                    <>
                      <div className={`${companyStyles["row"]} ${companyStyles["mt-1"]}`}>
                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-12"]}`}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              marginBottom: "32px",
                            }}
                          >
                            <label className={companyStyles.label} style={{ marginBottom: "8px" }}>
                              Do you wish to keep client information confidential to candidate ?
                              {/* <span className={AddNewClientStyle.reqField}>*</span> */}
                            </label>
                            {/* {pricingTypeError && (
                    <p className={AddNewClientStyle.error}>
                      *Please select pricing type
                    </p>
                  )} */}
                            <Radio.Group

                              onChange={(e) => {
                                setConfidentialInfo(e.target.value);

                              }}
                              value={confidentialInfo}
                            >
                              <Radio value={1}>Yes</Radio>
                              <Radio value={0}>No</Radio>
                            </Radio.Group>
                            {confidentialInfo === 1 && <p style={{ marginTop: '10px', marginBottom: '0' }} className={companyStyles.teansactionMessage}>Be careful not to use company names in About, Culture, Job description if you choose to keep information confidential. </p>}
                          </div>
                        </div>
                      </div>
                    </>
                  }

                  {confidentialInfo === 1 && <>
                    <div className={`${companyStyles["form-rows"]}`}>
                      <div className={`${companyStyles["row"]}`}>
                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-4-75"]}`}>
                          <div className={`${companyStyles["form-group"]}`}>
                            <div className={`${companyStyles["form-group"]}`}>
                              <input type="text" className={`${companyStyles["form-input"]}`} placeholder="Company Name" disabled={true} value={companySectionData?.companyName}
                              />

                            </div>
                          </div>
                        </div>

                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-4-75"]}`}>
                          <div className={`${companyStyles["form-group"]}`}>
                            <div className={`${companyStyles["form-group"]}`}>
                              <input type="text" className={`${companyStyles["form-input"]}`} placeholder="Company Name Alias  *" required value={companyConfidentailFields?.companyNameAlias}
                                onChange={(e) => setCompanyConfidentialFields(prev => ({ ...prev, companyNameAlias: e.target.value }))} />
                              {formValidationError && (companyConfidentailFields?.companyNameAlias?.trim() === '' || companyConfidentailFields?.companyNameAlias === null) && <p className={`${companyStyles["fieldError"]}`}>please enter company name alias</p>}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`${companyStyles["row"]}`}>
                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-4-75"]}`}>
                          <div className={`${companyStyles["form-group"]}`}>
                            <div className={`${companyStyles["form-group"]}`}>
                              <input type="text" className={`${companyStyles["form-input"]}`} placeholder="Company Logo" disabled={true} value={companyConfidentailFields?.companyLogo}
                              />

                            </div>
                          </div>
                        </div>

                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-4-75"]}`}>
                          <div className={`${companyStyles["form-group"]}`}>
                            <div className={`${companyStyles["form-group"]}`}>
                              <input type="text" className={`${companyStyles["form-input"]}`} placeholder="Company Logo Alias  *" required value={companyConfidentailFields?.companyLogoAlias}
                                onChange={(e) => setCompanyConfidentialFields(prev => ({ ...prev, companyLogoAlias: e.target.value }))} />
                              {formValidationError && (companyConfidentailFields?.companyLogoAlias?.trim() === '' || companyConfidentailFields?.companyLogoAlias === null) && <p className={`${companyStyles["fieldError"]}`}>please enter company logo alias</p>}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`${companyStyles["row"]}`}>
                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-4-75"]}`}>
                          <div className={`${companyStyles["form-group"]}`}>
                            <div className={`${companyStyles["form-group"]}`}>
                              <input type="text" className={`${companyStyles["form-input"]}`} placeholder="Company URL" disabled={true} value={companyConfidentailFields?.companyURL}
                              />

                            </div>
                          </div>
                        </div>


                      </div>

                      <div className={`${companyStyles["row"]}`}>
                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-4-75"]}`}>
                          <div className={`${companyStyles["form-group"]}`}>
                            <div className={`${companyStyles["form-group"]}`}>
                              <input type="text" className={`${companyStyles["form-input"]}`} placeholder="Company Linkedin" disabled={true} value={companyConfidentailFields?.companyLinkedinURL}
                              />

                            </div>
                          </div>
                        </div>


                      </div>

                      <p className={companyStyles.teansactionMessage}>If the client POC details are not added then it will be considered as "N/A."</p>

                      {clientFieldsDetails.map((val, ind) => {
                        return <>
                          <div className={`${companyStyles["row"]}`}>
                            <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-4-75"]}`}>
                              <div className={`${companyStyles["form-group"]}`}>
                                <div className={`${companyStyles["form-group"]}`}>
                                  <input type="text" className={`${companyStyles["form-input"]}`} placeholder="Client POC Full Name" disabled={true} value={val.fullName}
                                  />

                                </div>
                              </div>
                            </div>

                            <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-4-75"]}`}>
                              <div className={`${companyStyles["form-group"]}`}>
                                <div className={`${companyStyles["form-group"]}`}>
                                  <input type="text" className={`${companyStyles["form-input"]}`} placeholder="Client POC Full Name Alias" required value={val.fullNameAlias}
                                    onChange={(e) => setClientFieldsDetails(prev => {
                                      let arr = [...prev]
                                      arr[ind] = { ...arr[ind], fullNameAlias: e.target.value }

                                      return arr
                                    })} />

                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={`${companyStyles["row"]}`}>
                            <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-4-75"]}`}>
                              <div className={`${companyStyles["form-group"]}`}>
                                <div className={`${companyStyles["form-group"]}`}>
                                  <input type="text" className={`${companyStyles["form-input"]}`} placeholder="Client POC Email" disabled={true} value={val.emailID}
                                  />

                                </div>
                              </div>
                            </div>

                            <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-4-75"]}`}>
                              <div className={`${companyStyles["form-group"]}`}>
                                <div className={`${companyStyles["form-group"]}`}>
                                  <input type="text" className={`${companyStyles["form-input"]}`} placeholder="Client POC Email Alias" required value={val.emailIDAlias}
                                    onChange={(e) => setClientFieldsDetails(prev => {
                                      let arr = [...prev]
                                      arr[ind] = { ...arr[ind], emailIDAlias: e.target.value }

                                      return arr
                                    })} />

                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      })}


                      <div className={`${companyStyles["row"]}`}>
                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-4-75"]}`}>
                          <div className={`${companyStyles["form-group"]}`}>
                            <div className={`${companyStyles["form-group"]}`}>
                              <input type="text" className={`${companyStyles["form-input"]}`} placeholder="Company Headquarters" disabled={true} value={companyConfidentailFields?.headquaters}
                              />

                            </div>
                          </div>
                        </div>

                        <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-4-75"]}`}>
                          <div className={`${companyStyles["form-group"]}`}>
                            <div className={`${companyStyles["form-group"]}`}>
                              <input type="text" className={`${companyStyles["form-input"]}`} placeholder="Company Headquarters Alias" required value={companyConfidentailFields?.headquatersAlias}
                                onChange={(e) => setCompanyConfidentialFields(prev => ({ ...prev, headquatersAlias: e.target.value }))} />

                            </div>
                          </div>
                        </div>
                      </div>


                    </div>
                  </>}




                  <div className={`${companyStyles["row"]} ${companyStyles["mt-1"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.value?.toLowerCase().includes(input.toLowerCase())
                          }
                          fieldNames={{
                            value: "id",      // stored value
                            label: "value"    // display text
                          }}
                          placeholder="Lead Source *"
                          options={leadTypeOptions}
                          value={companySectionData?.LeadType}
                          onChange={(val, valObj) => {
                            setCompanySectionData(p => ({ ...p, LeadType: val }))
                          }}
                        />
                        {formValidationError && companySectionData?.LeadType === null && <p className={`${companyStyles["fieldError"]}`}>*Please select lead source </p>}
                      </div>
                    </div>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.value?.toLowerCase().includes(input.toLowerCase())
                          }
                          fieldNames={{
                            value: "id",      // stored value
                            label: "value"    // display text
                          }}
                          placeholder="Sales / MDR / SDR *"
                          options={filtersList?.LeadUsers?.filter(val => {
                            if (companySectionData?.LeadType === 12) {
                              return val.userTypeId === 12
                            }
                            else if (companySectionData?.LeadType === 4) {
                              return val.userTypeId === 4
                            }
                            else if (companySectionData?.LeadType === 176) {
                              return val.employeeId === "UP1831"
                            } else {
                              return val.userTypeId === 11
                            }
                          }).map(item => ({
                            id: item.id,
                            value: item.fullName,
                          }))}
                          value={companySectionData?.LeadUser}
                          onChange={(val, valObj) => {
                            setCompanySectionData(p => ({ ...p, LeadUser: val }))
                          }}
                        />
                        {formValidationError && companySectionData?.LeadUser === null && <p className={`${companyStyles["fieldError"]}`}>*Please select lead user </p>}
                        {/* <div className={`${companyStyles["autocomplete-wrapper"]}`} data-autocomplete="sales-mdr-sdr">
                        <input type="text" className={`${companyStyles["form-input"]} ${companyStyles["form-input-autocomplete"]}`} name="salesPerson" placeholder="Sales / MDR / SDR" autocomplete="off" />
                        <div className={`${companyStyles["autocomplete-dropdown"]}`}></div>
                      </div> */}
                      </div>
                    </div>
                  </div>
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <input type="text" className={`${companyStyles["form-input"]}`} name="headquarters" placeholder="Headquarters"
                          value={companySectionData?.headquaters}
                          onChange={(e => {
                            setCompanySectionData(p => ({ ...p, headquaters: e.target.value }))
                          })}
                        />

                      </div>
                    </div>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <input type="text" className={`${companyStyles["form-input"]}`} name="industry" placeholder="Industry *"
                          value={companySectionData?.industry}
                          onChange={(e => {
                            setCompanySectionData(p => ({ ...p, industry: e.target.value }))
                          })} />
                        {formValidationError && companySectionData?.industry.trim() === '' && <p className={`${companyStyles["fieldError"]}`}>*Please enter industry </p>}
                      </div>
                    </div>
                  </div>
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <input type="number" className={`${companyStyles["form-input"]}`} name="teamSize" placeholder="Team size *"
                          value={companySectionData?.teamSize}
                          onChange={(e => {
                            setCompanySectionData(p => ({ ...p, teamSize: e.target.value }))
                          })} />
                        {formValidationError && (companySectionData?.teamSize?.trim() === '' || companySectionData?.teamSize < 1) && <p className={`${companyStyles["fieldError"]}`}>*Please enter team size </p>}
                      </div>
                    </div>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-3"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.value?.toLowerCase().includes(input.toLowerCase())
                          }
                          fieldNames={{
                            value: "id",      // stored value
                            label: "value"    // display text
                          }}
                          placeholder="Category *"
                          options={[{
                            id: 'Diamond',
                            value: 'Diamond',
                          },
                          {
                            id: 'None',
                            value: 'None',
                          },
                          ]}
                          value={companySectionData?.Category}
                          onChange={(val, valObj) => {
                            setCompanySectionData(p => ({ ...p, Category: val }))
                          }}
                        />
                        {formValidationError && companySectionData?.Category === null && <p className={`${companyStyles["fieldError"]}`}>*Please select category </p>}
                      </div>
                    </div>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-3"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.value?.toLowerCase().includes(input.toLowerCase())
                          }
                          fieldNames={{
                            value: "id",      // stored value
                            label: "value"    // display text
                          }}
                          placeholder="Geo *"
                          options={filtersList?.Geo?.map(item => ({
                            id: item.text,
                            value: item.value,
                          }))}
                          value={companySectionData?.Geo}
                          onChange={(val, valObj) => {
                            setCompanySectionData(p => ({ ...p, Geo: val }))
                          }}
                        />
                        {formValidationError && companySectionData?.Geo === null && <p className={`${companyStyles["fieldError"]}`}>*Please select Geo </p>}
                      </div>
                    </div>
                  </div>
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-12"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <label className={`${companyStyles["form-label"]}`}>About company *</label>
                        <ReactQuill

                          theme="snow"
                          className="newQuillEditor"
                          value={companySectionData?.aboutCompany}
                          name="About company"
                          onChange={(val) => {
                            // setParseType("Text_Parsing");
                            setCompanySectionData(prev => ({ ...prev, aboutCompany: val }))
                            //   let sanitizedContent = sanitizeLinks(val);
                            //   // let _updatedVal = sanitizedContent?.replace(/<img\b[^>]*>/gi, '');
                            //   setValue("parametersHighlight", sanitizedContent)
                          }}

                        />

                        {aboutCompanyError && (isQuillEmpty(companySectionData?.aboutCompany)) && <p className={`${companyStyles["fieldError"]}`}>*Please enter About company </p>}

                      </div>
                    </div>
                  </div>
                </>}

              </div>
            </section>

            {/* <!-- Funding Details Section --> */}
            <section className={`${companyStyles["form-section"]}`} id="funding-details-section">
              <h2 className={`${companyStyles["section-title"]}`}>Funding details</h2>
              <div className={`${companyStyles["form-rows"]}`}>
                {loadingDetails ? <Skeleton active /> : <>
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]} ${companyStyles["checkbox-group"]}`}>
                        <label className={`${companyStyles["checkbox-label"]}`}>
                          <input type="checkbox" className={`${companyStyles["form-checkbox"]}`} name="selfFunded" checked={fundingSectionData?.isSelfFunded} onClick={() => {
                            setFundingSectionData(p => ({ ...p, isSelfFunded: !p.isSelfFunded }))
                          }} />
                          <span>Self-funded (bootstrapped) company - without external investments.</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.value?.toLowerCase().includes(input.toLowerCase())
                          }
                          fieldNames={{
                            value: "id",      // stored value
                            label: "value"    // display text
                          }}
                          placeholder="Funding Rounds/Series"
                          options={seriesOptions}
                          value={fundingSectionData?.series}
                          onChange={(val, valObj) => {
                            setFundingSectionData(p => ({ ...p, series: val }))
                          }}
                          disabled={fundingSectionData?.isSelfFunded}
                        />

                      </div>
                    </div>
                  </div>
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <input type="text" className={`${companyStyles["form-input"]}`} name="fundingAmount" placeholder="Funding amount"
                          value={fundingSectionData?.fundingAmount}
                          onChange={(e) => {
                            setFundingSectionData(p => ({ ...p, fundingAmount: e.target.value }))
                          }}
                          disabled={fundingSectionData?.isSelfFunded}
                        />
                      </div>
                    </div>

                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["date-picker-wrapper"]}`}>
                        <div className={`${companyStyles["form-group"]} ${companyStyles["input-with-icon-right"]}`}
                          style={{ flexDirection: 'row', gap: '5px' }}>
                          <Select
                            options={monthOptions}
                            placeholder="Select month"
                            value={fundingSectionData?.month}
                            onSelect={(e) => {
                              setFundingSectionData(p => ({ ...p, month: e }))
                              //  setValue(`fundingDetails.[${index}].month`,e)
                            }}
                            disabled={fundingSectionData?.isSelfFunded}
                          />
                          <Select
                            options={yearOptions}
                            placeholder="Select year"
                            showSearch={true}
                            value={fundingSectionData?.year}
                            onSelect={(e) => {
                              setFundingSectionData(p => ({ ...p, year: e }))
                              //  setValue(`fundingDetails.[${index}].month`,e)
                            }}
                            disabled={fundingSectionData?.isSelfFunded}
                          />
                        </div>



                      </div>
                    </div>
                  </div>
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-12"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <input type="text" className={`${companyStyles["form-input"]}`} name="investors" placeholder="Investors (separated by comma)"
                          value={fundingSectionData?.investors}
                          onChange={e => {
                            setFundingSectionData(p => ({ ...p, investors: e.target.value }))
                          }}
                          disabled={fundingSectionData?.isSelfFunded}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-12"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <textarea className={`${companyStyles["form-textarea"]}`} name="fundingAdditionalInfo" placeholder="Additional information"
                          value={fundingSectionData?.additionalInfo}
                          onChange={e => {
                            setFundingSectionData(p => ({ ...p, additionalInfo: e.target.value }))
                          }}
                          disabled={fundingSectionData?.isSelfFunded}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </>}

              </div>
            </section>

            {/* <!-- Culture and Perks Section --> */}
            <section className={`${companyStyles["form-section"]}`}>
              <h2 className={`${companyStyles["section-title"]}`}>Culture and perks</h2>
              <div className={`${companyStyles["form-rows"]}`}>
                {loadingDetails ? <Skeleton active /> : <>
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-12"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <ReactQuill

                          theme="snow"
                          className="newQuillEditor"
                          value={cultureSectionData?.culture}
                          name="culture"
                          placeholder="Culture Info ..."
                          onChange={(val) => {
                            // setParseType("Text_Parsing");
                            setCultureSectionData(prev => ({ ...prev, culture: val }))

                            //   let sanitizedContent = sanitizeLinks(val);
                            //   // let _updatedVal = sanitizedContent?.replace(/<img\b[^>]*>/gi, '');
                            //   setValue("parametersHighlight", sanitizedContent)
                          }} />
                        {/* <textarea className={`${companyStyles["form-textarea"]}`} name="culture" placeholder="Culture"></textarea> */}
                      </div>
                    </div>
                  </div>
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <div className={`${companyStyles["file-upload-area"]} ${companyStyles["file-upload-photos"]}`}
                          onClick={() => pictureRef && pictureRef.current.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                          onDragLeave={(e) => e.preventDefault()}
                        >
                          <span className={`${companyStyles["upload-label"]}`}>Add photos</span>
                          <svg className={`${companyStyles["upload-icon-svg"]}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 16V4M12 4L8 8M12 4L16 8M4 17V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V17" stroke="#4C4E64" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <p className={`${companyStyles["upload-text"]}`}>Click to upload or drag and drop<br />(supported files: JPG & PNG)</p>
                          <input type="file" ref={pictureRef} className={`${companyStyles["file-input"]}`} accept=".jpg,.jpeg,.png" multiple
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;

                              const acceptedTypes = ["image/jpeg", "image/png"];
                              if (!acceptedTypes.includes(file.type)) {
                                message.info(
                                  "Please select a valid image file (JPEG or PNG)."
                                );
                                return;
                              }

                              try {
                                uploadCultureImages(e.target.files)
                              } catch (error) {
                                console.error("Error reading the file:", error);
                              }
                            }} />
                          <div className={`${companyStyles["file-list"]}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>


                  {getCompanyDetails?.cultureDetails?.length > 0 && <div className={companyStyles.row}>
                    {getCompanyDetails?.cultureDetails?.map(culture => <div className={companyStyles.colMd4} key={`${culture.cultureID} ${culture.cultureImage}`}>
                      <div className={companyStyles.cultureImageContainer}>
                        <img src={culture.cultureImage} alt='culture' className={companyStyles.cultureImage} />
                        {/* <DeleteIcon  className={companyStyles.cultureDelete} onClick={()=> deleteCulturImage(culture)}/> */}
                      </div>
                    </div>)}
                  </div>}
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <input type="text" className={`${companyStyles["form-input"]}`} name="youtubeLinks" placeholder="Add YouTube links"
                          value={cultureSectionData?.youtubeLink}
                          onChange={(e) => {
                            setCultureSectionData(prev => ({ ...prev, youtubeLink: e.target.value }))
                          }}
                          onBlur={e => {
                            if (e.target.value) {
                              addnewYoutubeLink(e)
                            }

                          }}
                          onKeyDown={e => {
                            if (e.keyCode === 13) {
                              addnewYoutubeLink(e)
                            }
                          }}
                        />
                      </div>
                      {getCompanyDetails?.youTubeDetails?.length > 0 && <div className={companyStyles.row} >
                        {getCompanyDetails?.youTubeDetails.map(youtube => <div className={companyStyles["col-lg-6"]} key={`${youtube.youtubeID} ${youtube.youtubeLink}}`}>
                          {/* <iframe
                      src={youtube.youtubeLink}
                      frameborder='0'
                      allow='autoplay; encrypted-media'
                      allowfullscreen
                      title='video'
                    /> */}
                          <div className={companyStyles.youTubeDetails} onClick={() => { }}>
                            {youtube.youtubeLink}
                            {/*  <DeleteIcon style={{marginLeft:'10px',cursor:'pointer'}} onClick={()=>{ removeYoutubelink(youtube)}} /> */}
                          </div>
                        </div>)}

                      </div>}
                    </div>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]} ${companyStyles["multiselect"]}`}>
                        <Select
                          mode="tags"
                          showSearch
                          filterOption={(input, option) =>
                            option.value?.toLowerCase().includes(input.toLowerCase())
                          }
                          fieldNames={{
                            value: "id",      // stored value
                            label: "value"    // display text
                          }}
                          placeholder="Company perks and benefits"
                          options={combinedPerkMemo}

                          value={cultureSectionData?.perksAndAdvantages}
                          onChange={(val) => {
                            setCultureSectionData(p => ({ ...p, perksAndAdvantages: val }))
                          }} />
                        {/* <div className={`${companyStyles["multiselect-autocomplete-wrapper"]}`} data-autocomplete="company-perks">
                        <div className={`${companyStyles["multiselect-tags-container"]}`}></div>

                        <input type="text" className={`${companyStyles["form-input"]} ${companyStyles["multiselect-input"]}`} name="companyPerks" placeholder="Company perks and benefits" autocomplete="off"
                          value={cultureSectionData?.perksAndAdvantages}
                          onChange={(e) => {
                            setCultureSectionData(p => ({ ...p, perksAndAdvantages: e.target.value }))
                          }}
                        />
                        <div className={`${companyStyles["autocomplete-dropdown"]}`}></div>
                      </div> */}
                      </div>
                    </div>
                  </div>
                </>}

              </div>
            </section>

            {/* <!-- Client Details Section --> */}
            <section className={`${companyStyles["form-section"]}`}>
              {loadingDetails ? <Skeleton active /> : <>
                {clientsData.map((client, index) => {
                  return <div key={client.id} className={`${companyStyles["form-rows"]} ${companyStyles["client-details-rows"]}`}>
                    <div className={`${companyStyles["client-detail-block"]}`} data-client-block="template">
                      <h3 className={`${companyStyles["section-title"]}`}>Client details {index > 0 && `- ${index}`}</h3>
                      <div className={`${companyStyles["client-detail-fields"]}`}>
                        <div className={`${companyStyles["row"]}`}>
                          <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                            <div className={`${companyStyles["form-group"]}`}>
                              <input type="text" className={`${companyStyles["form-input"]}`} name="clientFullName[]" placeholder="Client Full Name *" required
                                value={client.fullName}
                                onChange={(e) => {

                                  setClientsData(pArr => {
                                    let newCopy = [...pArr]
                                    newCopy[index] = { ...newCopy[index], fullName: e.target.value }
                                    return newCopy
                                  })
                                }}
                              />
                              {formValidationError && client.fullName.trim() === '' && <p className={`${companyStyles["fieldError"]}`}>*Please enter client full name </p>}
                            </div>
                          </div>
                          <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                            <div className={`${companyStyles["form-group"]}`}>
                              <input type="email" className={`${companyStyles["form-input"]}`} name="workEmail[]" placeholder="Work email *"
                                value={client.emailID}
                                onChange={(e) => {

                                  setClientsData(pArr => {
                                    let newCopy = [...pArr]
                                    newCopy[index] = { ...newCopy[index], emailID: e.target.value }
                                    return newCopy
                                  })
                                }}
                                onBlur={() => {
                                  validateClientEemailName(client.id, index)
                                }}
                              />
                              {console.log(('clientsEmailError', clientsEmailError))}
                              {formValidationError && (client.emailID.trim() === '' || !eReg.test(client.emailID)) && <p className={`${companyStyles["fieldError"]}`}>*Please enter valid email </p>}
                              {clientsEmailError[client.id] && <p className={`${companyStyles["fieldError"]}`}>{clientsEmailError[client.id]} </p>}
                            </div>
                          </div>
                        </div>
                        <div className={`${companyStyles["row"]}`}>
                          <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                            <div className={`${companyStyles["form-group"]}`}>
                              <input type="text" className={`${companyStyles["form-input"]}`} name="designation[]" placeholder="Designation"
                                value={client.designation}
                                onChange={(e) => {

                                  setClientsData(pArr => {
                                    let newCopy = [...pArr]
                                    newCopy[index] = { ...newCopy[index], designation: e.target.value }
                                    return newCopy
                                  })
                                }} />
                            </div>
                          </div>
                          <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                            <div className={`${companyStyles["form-group"]}`}>
                              <Select
                                showSearch
                                filterOption={(input, option) =>
                                  option.value?.toLowerCase().includes(input.toLowerCase())
                                }
                                fieldNames={{
                                  value: "id",      // stored value
                                  label: "value"    // display text
                                }}
                                placeholder="Access type *"
                                options={getValuesForDD?.BindAccessRoleType?.map((item) => ({
                                  id: item.id,
                                  value: item.value,
                                }))}


                                value={client.roleID}
                                onChange={(val, valObj) => {

                                  setClientsData(pArr => {
                                    let newCopy = [...pArr]
                                    newCopy[index] = { ...newCopy[index], roleID: val }
                                    return newCopy
                                  })
                                }}

                              />
                              {/* <select className={`${companyStyles["form-select"]}`} name="accessType[]">
                            <option value="">Access type</option>
                            <option value="Admin">Admin</option>
                            <option value="All Jobs">All Jobs</option>
                            <option value="My Jobs">My Jobs</option>
                            <option value="Interviewer">Interviewer</option>
                          </select> */}
                            </div>
                          </div>
                        </div>
                        <div className={`${companyStyles["row"]}`}>
                          <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                            <div className={`${companyStyles["form-group"]} ${companyStyles["phone-input-group"]} phonConturyWrap`}>
                              <PhoneInput
                                placeholder="Enter number"
                                key={index}
                                value={client.contactNo}
                                onChange={(value) => {
                                  setClientsData(pArr => {
                                    let newCopy = [...pArr]
                                    newCopy[index] = { ...newCopy[index], contactNo: value }
                                    return newCopy
                                  })
                                }}
                                country={countryCodeData}
                                disableSearchIcon={true}
                                enableSearch={true}
                              />
                              {/* <div className={`${companyStyles["phone-input-wrapper"]}`}>
                            <input type="tel" className={`${companyStyles["form-input"]} ${companyStyles["phone-number"]}`} name="phone[]" placeholder="" />
                          </div> */}
                            </div>
                          </div>
                        </div>
                        <div className={`${companyStyles["row"]}`}>
                          <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-12"]}`}>
                            <div className={`${companyStyles["form-group"]} ${companyStyles["checkbox-group"]}`}>
                              <label className={`${companyStyles["checkbox-label"]}`}>
                                <input type="checkbox" className={`${companyStyles["form-checkbox"]}`} name="emailNotification[]"
                                  checked={client.isClientNotificationSend} onClick={() => {
                                    setClientsData(pArr => {
                                      let newCopy = [...pArr]
                                      newCopy[index] = { ...newCopy[index], isClientNotificationSend: !client.isClientNotificationSend }
                                      return newCopy
                                    })
                                  }} />
                                <span>Email notification</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`${companyStyles["row"]} ${companyStyles["client-details-add-row"]}`}>
                      <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-12"]} ${companyStyles["client-details-buttons"]}`}>
                        {index === 0 && clientsData?.length === 1 &&
                          <button type="button" className={`${companyStyles["btn-add-another"]}`} id="addAnotherClient"
                            onClick={e => onAddNewClient(e)}>
                            <span className={`${companyStyles["btn-add-icon"]}`}>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 7.5C15 7.66576 14.9342 7.82473 14.8169 7.94194C14.6997 8.05915 14.5408 8.125 14.375 8.125H8.125V14.375C8.125 14.5408 8.05915 14.6997 7.94194 14.8169C7.82473 14.9342 7.66576 15 7.5 15C7.33424 15 7.17527 14.9342 7.05806 14.8169C6.94085 14.6997 6.875 14.5408 6.875 14.375V8.125H0.625C0.45924 8.125 0.300269 8.05915 0.183058 7.94194C0.0658481 7.82473 0 7.66576 0 7.5C0 7.33424 0.0658481 7.17527 0.183058 7.05806C0.300269 6.94085 0.45924 6.875 0.625 6.875H6.875V0.625C6.875 0.45924 6.94085 0.300269 7.05806 0.183058C7.17527 0.0658481 7.33424 0 7.5 0C7.66576 0 7.82473 0.0658481 7.94194 0.183058C8.05915 0.300269 8.125 0.45924 8.125 0.625V6.875H14.375C14.5408 6.875 14.6997 6.94085 14.8169 7.05806C14.9342 7.17527 15 7.33424 15 7.5Z" fill="white" />
                              </svg>
                            </span>
                            <span>ADD ANOTHER CLIENT</span>
                          </button>

                        }

                        {index > 0 && index + 1 === clientsData?.length &&
                          <button type="button" className={`${companyStyles["btn-add-another"]}`} id="addAnotherClient"
                            onClick={e => onAddNewClient(e)}>
                            <span className={`${companyStyles["btn-add-icon"]}`}>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 7.5C15 7.66576 14.9342 7.82473 14.8169 7.94194C14.6997 8.05915 14.5408 8.125 14.375 8.125H8.125V14.375C8.125 14.5408 8.05915 14.6997 7.94194 14.8169C7.82473 14.9342 7.66576 15 7.5 15C7.33424 15 7.17527 14.9342 7.05806 14.8169C6.94085 14.6997 6.875 14.5408 6.875 14.375V8.125H0.625C0.45924 8.125 0.300269 8.05915 0.183058 7.94194C0.0658481 7.82473 0 7.66576 0 7.5C0 7.33424 0.0658481 7.17527 0.183058 7.05806C0.300269 6.94085 0.45924 6.875 0.625 6.875H6.875V0.625C6.875 0.45924 6.94085 0.300269 7.05806 0.183058C7.17527 0.0658481 7.33424 0 7.5 0C7.66576 0 7.82473 0.0658481 7.94194 0.183058C8.05915 0.300269 8.125 0.45924 8.125 0.625V6.875H14.375C14.5408 6.875 14.6997 6.94085 14.8169 7.05806C14.9342 7.17527 15 7.33424 15 7.5Z" fill="white" />
                              </svg>
                            </span>
                            <span>ADD ANOTHER CLIENT</span>
                          </button>

                        }

                        {index > 0 && <button type="button" className={`${companyStyles["btn-remove-client-last"]}`} id="removeLastClient" title="Remove last client"
                          onClick={e => onRemoveAddedClient(e, index, client.id)}>
                          <span className={`${companyStyles["btn-remove-icon"]}`} aria-hidden="true">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M16.0675 15.1829C16.1256 15.241 16.1717 15.3099 16.2031 15.3858C16.2345 15.4617 16.2507 15.543 16.2507 15.6251C16.2507 15.7072 16.2345 15.7885 16.2031 15.8644C16.1717 15.9403 16.1256 16.0092 16.0675 16.0673C16.0095 16.1254 15.9405 16.1714 15.8647 16.2028C15.7888 16.2343 15.7075 16.2505 15.6253 16.2505C15.5432 16.2505 15.4619 16.2343 15.386 16.2028C15.3102 16.1714 15.2412 16.1254 15.1832 16.0673L10.0003 10.8837L4.81753 16.0673C4.70026 16.1846 4.5412 16.2505 4.37535 16.2505C4.2095 16.2505 4.05044 16.1846 3.93316 16.0673C3.81588 15.95 3.75 15.791 3.75 15.6251C3.75 15.4593 3.81588 15.3002 3.93316 15.1829L9.11675 10.0001L3.93316 4.81729C3.81588 4.70002 3.75 4.54096 3.75 4.3751C3.75 4.20925 3.81588 4.05019 3.93316 3.93292C4.05044 3.81564 4.2095 3.74976 4.37535 3.74976C4.5412 3.74976 4.70026 3.81564 4.81753 3.93292L10.0003 9.11651L15.1832 3.93292C15.3004 3.81564 15.4595 3.74976 15.6253 3.74976C15.7912 3.74976 15.9503 3.81564 16.0675 3.93292C16.1848 4.05019 16.2507 4.20925 16.2507 4.3751C16.2507 4.54096 16.1848 4.70002 16.0675 4.81729L10.8839 10.0001L16.0675 15.1829Z" fill="#4C4E64" fill-opacity="0.87" />
                            </svg>
                          </span> REMOVE
                        </button>}
                      </div>



                    </div>
                  </div>
                })}
              </>}
              {/* <!-- <h2 className={`${companyStyles[]}`}"section-title">Client details</h2> --> */}


            </section>

            {/* <!-- Success Team / Delivery Team POC Section --> */}
            <section className={`${companyStyles["form-section"]}`}>
              <h2 className={`${companyStyles["section-title"]}`}>Success Team / Delivery Team POC</h2>
              {loadingDetails ? <Skeleton active /> : <>
                <div className={`${companyStyles["form-rows"]}`}>
                  <div className={`${companyStyles["row"]}`}>
                    <div className={`${companyStyles["cols"]} ${companyStyles["col-lg-6"]}`}>
                      <div className={`${companyStyles["form-group"]}`}>
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.value?.toLowerCase().includes(input.toLowerCase())
                          }
                          fieldNames={{
                            value: "id",      // stored value
                            label: "value"    // display text
                          }}
                          placeholder="Select *"
                          options={allPocs}


                          value={uplersPOCname}
                          onChange={(val, valObj) => {

                            setUplersPOCName(val)
                          }}

                        />
                        {formValidationError && uplersPOCname === null && <p className={`${companyStyles["fieldError"]}`}>*Please select success team / delivery team POC </p>}
                        {/* <div className={`${companyStyles["autocomplete-wrapper"]}`} data-autocomplete="success-team-poc">
                        <input type="text" className={`${companyStyles["form-input"]} ${companyStyles["form-input-autocomplete"]}`} name="successTeamPoc" placeholder="Select" autocomplete="off" />
                        <div className={`${companyStyles["autocomplete-dropdown"]}`}></div>
                      </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </>}

            </section>

            {/* <!-- Form Actions --> */}
            <div className={`${companyStyles["form-actions"]}`} style={{ marginBottom: '64px' }}>
              <button type="button" name="cancel" className={`${companyStyles["btn-cancel"]}`}>CANCEL</button>
              <button type="button" name="save" className={`${companyStyles["btn-save"]}`}
                disabled={disableSubmit}
                style={{ cursor: disableSubmit ? "not-allowed" : "pointer" }}
                onClick={() => { handleCreateCompany() }}>SAVE</button>
            </div>
          </form>
        </div>
      </div>

      <Modal
        width="440px"
        centered
        footer={false}
        open={showUploadModal}
        onCancel={() => {
          setUploadModal(false)
        }}
      >
        <div className={`${companyStyles["upload-logo-modal"]}`} id="uploadLogoModal" role="dialog" aria-labelledby="uploadLogoModalTitle" aria-modal="true" aria-hidden="true" >
          <div className={`${companyStyles["upload-logo-modal-backdrop"]}`}></div>
          <div className={`${companyStyles["upload-logo-modal-dialog"]}`}>
            <button type="button" className={`${companyStyles["upload-logo-modal-close"]}`} id="uploadLogoModalClose" aria-label="Close" onClick={() => setUploadModal(false)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <h2 className={`${companyStyles["upload-logo-modal-title"]}`} id="uploadLogoModalTitle">Upload Logo</h2>
            <p className={`${companyStyles["upload-logo-modal-hint"]}`}>File should be (JPG, PNG, SVG)</p>
            <div className={`${companyStyles["upload-logo-browse"]}`} id="uploadLogoBrowse" onClick={() => { companyLogoRef.current.click() }}>
              <svg className={`${companyStyles["upload-logo-browse-icon"]}`} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12C8 10.8954 8.89543 10 10 10H20L24 14H38C39.1046 14 40 14.8954 40 16V36C40 37.1046 39.1046 38 38 38H10C8.89543 38 8 37.1046 8 36V12Z" stroke="#9E9FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M24 14V10M24 24V32M20 28H28" stroke="#9E9FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span className={`${companyStyles["upload-logo-browse-text"]}`}>Browse My Device to Upload File</span>
            </div>
          </div>
        </div>

      </Modal>

      <PreviewClientModal
        setIsPreviewModal={setIsPreviewModal}
        isPreviewModal={isPreviewModal}
        setcompanyID={setcompanyID}
        getcompanyID={getcompanyID}
      />
    </main>
  )
}

export default NewAddCompany