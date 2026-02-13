import React from 'react'
import styles from './n_hrFields.module.css'
import ReactQuill from "react-quill";

import {
    Button,
    Checkbox,
    Divider,
    Space,
    message,
    AutoComplete,
    Modal,
    Radio,
    Tooltip,
    Select,
    Avatar,
    Spin,
} from "antd";
import {
    ClientHRURL,
    EmailRegEx,
    GoogleDriveCredentials,
    InputType,
    SubmitType,
    WorkingMode,
} from "constants/application";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HRInputField from "../hrInputFields/hrInputFields";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import HRFieldStyle from "./hrFIelds.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { ReactComponent as UploadSVG } from "assets/svg/upload.svg";
import UploadModal from "shared/components/uploadModal/uploadModal";
import HRSelectField from "../hrSelectField/hrSelectField";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import { _isNull, getPayload } from "shared/utils/basic_utils";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { hrUtils } from "modules/hiring request/hrUtils";
import { MasterDAO } from "core/master/masterDAO";
import useDrivePicker from "react-google-drive-picker/dist";
import useDebounce from "shared/hooks/useDebounce";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { UserAccountRole } from "constants/application";
import LogoLoader from "shared/components/loader/logoLoader";
import { HttpStatusCode } from "axios";
import infoIcon from "assets/svg/info.svg";
import plusSkill from "assets/svg/plusSkill.svg";
import { HubSpotDAO } from "core/hubSpot/hubSpotDAO";
import DOMPurify from "dompurify";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import JobDescriptionComponent from "../jdComponent/jdComponent";
import PhoneIcon from "assets/svg/phoneIcon.svg";
import DeleteCircleIcon from "assets/svg/deleteCircleIcon.svg";
import infoSmallIcon from "assets/svg/infoSmallIcon.svg";
import MailIcon from "assets/svg/mailIcon.svg";
import { isEmptyOrWhitespace, convertCurrency, sanitizeLinks } from "modules/hiring request/screens/allHiringRequest/previewHR/services/commonUsedVar";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import CheckRadioIcon from "assets/svg/CheckRadioIcon.svg";

import debounce from "lodash.debounce";
import CompanyConfirmationFields from "modules/company/screens/addCompany/CompanyConfirmationFields";
import { h } from '@fullcalendar/core/preact';
import { NewPagesRouts } from 'constants/routes';



function NewHRFields() {
    const { hrid } = useParams()
    const navigate = useNavigate();
    const [basicFormFields, setBasicFormFields] = useState({
        companyName: '',
        clientFullName: '',
        salesPerson: undefined,
        availability: undefined,
        payroll: undefined,
        hiringPricingType: undefined,
        NRMargin: '',
        contractDuration: undefined,
        payrollPartnerName: ''
    })

    const [companyConfidentailFields, setCompanyConfidentialFields] = useState({
        companyURL: '',
        companyLogoAlias: '',
        headquaters: '',
        headquatersAlias: '',
        companyNameAlias: '',
        companyLinkedinURL: '',
        companyLogo: ''
    })

     const secondaryClient = {
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
    roleID: 3,
    countryCode: "",
    isNewClient:true
  };

    const [clientFieldsDetails,setClientFieldsDetails] = useState([])

    const [roleReqFormFields, setRoleReqFormFields] = useState({
        roleTitle: '',
        minExp: '',
        maxExp: '',
        modeOfWorking: undefined,
        location: [],
        frequency: undefined,
        timeZone: undefined,
        startTime: undefined,
        endTime: undefined,
        noticePeriod: undefined,
        interviewRounds: '',
        numberOfTalents: ''
    })


    const [mustHaveSkills, setMustHaveSkills] = useState([]);
    const [goodToHaveSkills, setGoodToHaveSkills] = useState([]);
    const [jobDesData, setJobDesData] = useState({
        jobDescription: '',
        jdURL: '',
        jdFile: ''
    })
    const jdFileRef = useRef(null);
    const [isHaveJD, setIsHaveJD] = useState(0);
    const [parseType, setParseType] = useState("Text_Parsing");
    const [pathName, setPathName] = useState("");
    const [budgetFormFields, setBudgetFormFields] = useState({
        currency: undefined,
        minBudget: '',
        maxBudget: '',
        type: undefined,
        isConfidential: false,
        compensationOptions: []
    })

    const [enhanceMatchmakingFormFields, setEnhanceMatchmakingFormFields] = useState({
        industry: undefined,
        peopleManagement: false,
        highlight: ''
    })

    const [isLoading, setIsLoading] = useState(false);
    const [getCompanyNameSuggestion, setCompanyNameSuggestion] = useState([]);

    const [companyID, setCompanyID] = useState(null);
    const [getClientNameSuggestion, setClientNameSuggestion] = useState([]);
    const [getClientNameMessage, setClientNameMessage] = useState("");
    const [showAddClient, setAddClient] = useState(false);
    const [companyNameError, setCompanyNameError] = useState('')
    const [getCompanyNameMessage, setCompanyNameMessage] = useState("");
    const [activeUserData, setActiveUserData] = useState([]);
    const [activeUserDataList, setActiveUserDataList] = useState([]);
    const [clientDetails, setClientDetails] = useState({});
    const [isProfileView, setIsProfileView] = useState(false);
    const [isPostaJob, setIsPostaJob] = useState(false);
    const [isVettedProfile, setIsVettedProfile] = useState(true);
    const [confidentialInfo, setConfidentialInfo] = useState(false);
    const [salesPerson, setSalesPerson] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [JobTypes, setJobTypes] = useState([]);
    const [payRollTypes, setPayRollTypes] = useState([]);
    const [hrPricingTypes, setHRPricingTypes] = useState([]);
    const [howSoon, setHowSoon] = useState([]);
    const [workingMode, setWorkingMode] = useState([]);
    const [frequencyData, setFrequencyData] = useState([]);
    const [contractDurations, setcontractDurations] = useState([]);
    const [NearByCitesValues, setNearByCitesValues] = useState([]);
    const [timeZoneList, setTimezoneList] = useState([]);
    const [locationSelectValidation, setLocationSelectValidation] = useState(false);
    const [locationList, setLocationList] = useState([]);
    const [selectedCitiesIDS, setSelectedCitiesIDS] = useState([]);
    const [getStartEndTimes, setStaryEndTimes] = useState([]);
    const [talentRole, setTalentRole] = useState([]);
    const [skills, setSkills] = useState([]);
    const [combinedSkillsMemo, setCombinedSkillsMemo] = useState([])
    const [SkillMemo, setSkillMemo] = useState([])
    const [currency, setCurrency] = useState([]);
    const [formValidationError, setFormValidationError] = useState(false);
    const [allCities, setAllCities] = useState([]);
    const [nearByCitiesData, setNearByCitiesData] = useState([]);
    const [uploading, setUploading] = useState(false)
    const [getContactAndSaleID, setContactAndSalesID] = useState({
        contactID: "",
        salesID: "",
    });
    const [checkCreditAvailability, setCheckCreditAvailability] = useState({});
    const [isSavedLoading, setIsSavedLoading] = useState(false);
    const [AboutCompanyDesc, setAboutCompanyDesc] = useState(null)
    const [userCompanyTypeID, setUserCompanyTypeID] = useState(0)
    const [typeOfPricing, setTypeOfPricing] = useState(null);
    const [transactionMessage, setTransactionMessage] = useState("");
    const [disableYypeOfPricing, setDisableTypeOfPricing] = useState(false);
    const [getHRDetails, setHRDetails] = useState({})

    const [userData, setUserData] = useState({});
    useEffect(() => {
        const getUserResult = async () => {
            let userData = UserSessionManagementController.getUserSession();
            if (userData) setUserData(userData);
        };
        getUserResult();
    }, []);


    const compensationOptions = [
        "Performance bonus",
        "Stock options (ESOPs/ESPPS)",
        "Incentive",
        "Profit sharing",
        "Signing bonus",
        "Retention bonus",
        "Overtime pay",
        "Allowances (e.g. travel, housing, medical, education)",
        "Restricted stock units (RSUs)",
        "Custom"
    ];

    //   useEffect(()=>{

    //     if(getHRDetails?.clientDetails_Result){
    //       let companyInfo = getHRDetails?.companyInfo
    //     let clientResult = getHRDetails?.clientDetails_Result;


    //     setConfidentialInfo(clientResult?.isCompanyConfidential)
    //     if(companyInfo?.companyLogo || companyInfo?.companyLogoAwsUrl){
    //       setValue("companyLogo",companyInfo?.companyLogoAwsUrl ?  companyInfo?.companyLogoAwsUrl : companyInfo?.companyLogo ?? "")   
    //     }
    //     clientResult?.companyAlias && setValue('companyNameAlias',clientResult?.companyAlias)
    //     clientResult?.companyHQAlias && setValue('headquatersAlias',clientResult?.companyHQAlias)
    //     clientResult?.headquaters && setValue('headquaters',clientResult?.headquaters)
    //     clientResult?.companyLogoAlias && setValue('companyLogoAlias',clientResult?.companyLogoAlias)
    //     clientResult?.companyURL &&  setValue('companyURL',clientResult?.companyURL)
    //     clientResult?.linkedInProfile && setValue('companyLinkedinURL',clientResult?.linkedInProfile)      
    //     }


    //   },[getHRDetails])

    const getHRdetailsHandler = async (hrId) => {
        setIsSavedLoading(true)
        const response = await hiringRequestDAO.getHRDetailsRequestDAO(hrId);
        setIsSavedLoading(false)
        if (response.statusCode === HTTPStatusCode.OK) {
            // console.log(response?.responseBody?.details);

            let data = response?.responseBody?.details

            let availabilityId = availability?.find(v => v.value === data?.addHiringRequest?.availability)?.id
            let noticePeriodId = howSoon?.find(v => v.value === data?.salesHiringRequest_Details?.howSoon)?.id
            let currencyId = currency.find(c => c.value=== data?.salesHiringRequest_Details?.currency)?.id

            getTransparentEngType(data?.companyInfo?.companyID, data?.addHiringRequest?.hiringTypePricingId)

            setHRDetails(data)
            setClientDetails({
                ...data?.companyInfo,
                "companyId": data?.companyInfo?.companyID,
                "company": data?.companyInfo?.companyName,
                "companyURL": data?.companyInfo?.website,
                "companyLinkedIn": data?.companyInfo?.linkedInURL,
                "isTransparentPricing": data?.addHiringRequest?.isTransparentPricing,
            })


            setIsVettedProfile(data?.addHiringRequest?.isVettedProfile);
            setBasicFormFields({
                companyName: data?.company,
                clientFullName: data?.fullClientName,
                salesPerson: data?.addHiringRequest?.salesUserId,
                availability: availabilityId,
                payroll: data?.addHiringRequest?.payrollTypeId,
                hiringPricingType: data?.addHiringRequest?.hiringTypePricingId,
                NRMargin: data?.addHiringRequest?.isHrtypeDp === true
                    ? data?.addHiringRequest?.dppercentage
                    : data?.addHiringRequest?.talentCostCalcPercentage,
                contractDuration: data?.contractDuration === "-1"
                    ? "Indefinite"
                    : data?.contractDuration,
                payrollPartnerName: data?.addHiringRequest?.payrollTypeId === 3 ? data?.addHiringRequest?.payrollPartnerName : ''
            })

            setConfidentialInfo(data?.clientDetails_Result?.isCompanyConfidential)

            setRoleReqFormFields({
                roleTitle: data?.nameOfHiringRequest,
                minExp: data?.clientDetails_Result?.minYearOfExp,
                maxExp: data?.clientDetails_Result?.maxYearOfExp,
                modeOfWorking: data?.hdnModeOfWork,
                location: data?.atS_Joblocation?.map((item) => item.atS_City_Name),
                frequency: data?.directPlacement?.frequencyOfficeVisitId ?? '',
                timeZone: data?.salesHiringRequest_Details?.timezoneId,
                startTime: data?.salesHiringRequest_Details?.timeZoneFromTime,
                endTime: data?.salesHiringRequest_Details?.timeZoneEndTime,
                noticePeriod: noticePeriodId,
                interviewRounds: data?.addHiringRequest?.interviewRounds,
                numberOfTalents: data?.salesHiringRequest_Details?.noofEmployee
            })

            setNearByCitesValues(data?.directPlacement?.nearByCities?.split(","))

            setMustHaveSkills(data?.skillmulticheckbox?.map((item) => item?.text))
            setGoodToHaveSkills(data?.allSkillmulticheckbox?.map((item) => item?.text))

            setBudgetFormFields({
                // currency: data?.salesHiringRequest_Details?.currency,
                currency:currencyId,
                minBudget:data?.budgetType === "1" ? data?.salesHiringRequest_Details?.adhocBudgetCost : data?.salesHiringRequest_Details?.budgetFrom,
                maxBudget: data?.salesHiringRequest_Details?.budgetTo,
                type: data?.budgetType === "1" ? "Fixed" : "Range",
                isConfidential: data?.salesHiringRequest_Details?.isConfidentialBudget,
                compensationOptions: data?.compensationOption ? data?.compensationOption?.split("^") : []
            })

            setEnhanceMatchmakingFormFields(
                {
                    industry: data?.hrIndustryType.length ? data?.hrIndustryType?.split("^") : undefined,
                    peopleManagement: data?.hasPeopleManagementExp,
                    highlight: data?.prerequisites
                }
            )

           
       setJobDesData(prev=>({jdFile:data?.addHiringRequest?.jdfilename,jobDescription:data?.salesHiringRequest_Details?.jobDescription,
        jdURL:data?.addHiringRequest?.jdurl}))
        setIsHaveJD(0)
            setParseType("Text_Parsing"); 

        }
    };

    useEffect(() => {
       +hrid > 0 && setIsSavedLoading(true)
        if (+hrid > 0 && availability.length && howSoon.length && currency.length) {
            getHRdetailsHandler(hrid)
        }
    }, [hrid, availability, howSoon])

    useEffect(() => { getCities() }, [selectedCitiesIDS])

    const getCities = async (locationId) => {
        setIsLoading(true);
        // let _res = await MasterDAO.getNearByCitiesDAO(locationId);
        // console.log('locationId', roleReqFormFields?.location, selectedCitiesIDS)
        let _res = await MasterDAO.getNearByCitiesMultipleDAO(selectedCitiesIDS.map(i => i.id).join(','));
        setIsLoading(false);
        let citiesValues = [];
        if (_res?.statusCode === 200) {
            citiesValues = _res?.responseBody?.details?.map((city) => ({
                value: city.nearByDistrictID,
                label: city.nearByDistrictName,
            }));
            // return citiesValues || [];
            setNearByCitiesData(citiesValues || []);
        } else {
            // return [];
            setNearByCitiesData([]);
        }
    };


    const getSalesPerson = useCallback(async () => {
        const salesPersonResponse = await MasterDAO.getSalesManRequestDAO();
        setSalesPerson(
            salesPersonResponse && salesPersonResponse?.responseBody?.details
        );
        if (userData.LoggedInUserTypeID === UserAccountRole.SALES) {
            const valueToSet = salesPersonResponse?.responseBody?.details.filter(
                (detail) => detail.value === userData.FullName
            )[0];
            setBasicFormFields(prev => ({ ...prev, salesPerson: valueToSet.id }));
        }
    }, [userData.LoggedInUserTypeID, userData.FullName]);

    useEffect(() => {
        getSalesPerson();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

    const getClientNameSuggestionHandler = useCallback(
        async (clientName, cid) => {
            let response = await MasterDAO.getEmailSuggestionDAO(
                clientName,
                cid ? cid : companyID
            );

            if (response?.statusCode === HTTPStatusCode.OK) {
                setClientNameSuggestion(response?.responseBody?.details);
                setClientNameMessage("");
                setAddClient(false);
            } else if (
                response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
                response?.statusCode === HTTPStatusCode.NOT_FOUND
            ) {
                setCompanyNameError("We couldn't find the client. Add Client to this Company");
                setAddClient(true);
                setClientNameSuggestion([]);
                setClientNameMessage(response?.responseBody);
                //TODO:- JD Dump ID
            }
        },
        [companyID]
    );

    const getPOCUsers = async (companyID) => {
        let response = await MasterDAO.getEmailSuggestionDAO("", companyID);
        // console.log("poc users",response)
        setActiveUserData([
            ...response?.responseBody?.details?.map((item) => ({
                value: item?.contactId,
                label: item?.contactName,
            })),
        ]);
        setActiveUserDataList(response?.responseBody?.details);
    };

    const getCompanyNameSuggestionHandler = useCallback(
        async (companyName, cid) => {
            setClientNameMessage("");
            setBasicFormFields(prev => ({ ...prev, clientFullName: '' }));
            setAddClient(false);
            setCompanyID(null);
            let response = await MasterDAO.getCompanySuggestionDAO(companyName);

            if (response?.statusCode === HTTPStatusCode.OK) {
                setCompanyNameError("");

                setCompanyNameSuggestion(
                    response?.responseBody?.details.map((item) => ({
                        ...item,
                        value: item.companyName,
                    }))
                );
                // setCompanyID(result.details.companyID)
                // getClientNameSuggestionHandler('',result.details.companyID)
                // getPOCUsers(result.details.companyID)
            } else if (
                response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
                response?.statusCode === HTTPStatusCode.NOT_FOUND
            ) {
                setCompanyNameSuggestion([]);
                setCompanyNameMessage(response?.responseBody);
                setCompanyNameError("We couldn't find the company. Create company");

                //TODO:- JD Dump ID
            }
        },
        [companyID]
    );

     useEffect(()=>{
       
        if(getHRDetails?.clientDetails_Result){
          let companyInfo = getHRDetails?.companyInfo
        let clientResult = getHRDetails?.clientDetails_Result;
        
    
        setConfidentialInfo(clientResult?.isCompanyConfidential)
         setCompanyConfidentialFields({
            companyURL: clientResult?.companyURL,
            companyLogoAlias: clientResult?.companyLogoAlias,
            headquaters: clientResult?.headquaters,
            headquatersAlias: clientResult?.companyHQAlias,
            companyNameAlias: clientResult?.companyAlias,
            companyLinkedinURL: clientResult?.linkedInProfile,
            companyLogo: companyInfo?.companyLogoAwsUrl ?  companyInfo?.companyLogoAwsUrl : companyInfo?.companyLogo ?? ""
        })
    
      
     
            setClientFieldsDetails([{...secondaryClient,
      fullName: clientResult?.clientName ,
      fullNameAlias: clientResult?.clientPOCNameAlias,
      emailID:clientResult?.clientEmail,
      emailIDAlias:clientResult?.clientPOCEmailAlias,
      id:clientResult?.contactId
    }])
 
       
        }
        
    
      },[getHRDetails])

    const getClientNameValue = (clientName, clientData) => {
        setBasicFormFields(prev => ({ ...prev, clientFullName: clientName }));
        setClientDetails(clientData);
        setIsPostaJob(clientData?.isPostaJob);
        setIsProfileView(clientData?.isProfileView);
        setIsVettedProfile(clientData?.isVettedProfile);
        // console.log("clientData", clientData)

        setConfidentialInfo(clientData?.isCompanyConfidential)


        setCompanyConfidentialFields({
            companyURL: clientData?.companyURL,
            companyLogoAlias: clientData?.companyLogoAlias,
            headquaters: clientData?.companyHQ,
            headquatersAlias: clientData?.companyHQAlias,
            companyNameAlias: clientData?.companyAlias,
            companyLinkedinURL: clientData?.companyLinkedIn,
            companyLogo: clientData?.companyLogoAwsUrl ? clientData?.companyLogoAwsUrl : clientData?.companyLogo ?? ""
        })

        setClientFieldsDetails([{...secondaryClient,
      id: clientData?.contactId,
      fullName: clientData?.contactName ,
      fullNameAlias: clientData?.clientPOCNameAlias,
      emailID:clientData?.emailId,
      emailIDAlias: clientData?.clientPOCEmailAlias,
    }])

        clientData?.companyId && getTransparentEngType(clientData?.companyId, clientData?.hiringTypePricingId)
        clientData?.companyTypeID && setBasicFormFields(prev => ({ ...prev, availability: clientData?.companyTypeID === 2 ? 1 : 2 }));

        let salesPersonID = salesPerson.map(i => i.id)
        // console.log("salesPersonID", salesPersonID, +clientData.contactId, salesPersonID.includes(+clientData.contactId))
        if (salesPersonID.includes(+clientData.contactId)) {
            setBasicFormFields(prev => ({ ...prev, salesPerson: +clientData.contactId }));
        }


        const poctoadd = {
            hiringRequestId: 0,
            hrwiseContactId: clientData?.contactId,
            guid: "",
            fullName: clientData.contactName,
            emailID: clientData.emailId,
            contactNo: clientData.contactNumber,
            showEmailToTalent: false,
            showContactNumberToTalent: false,
            isDefaultUser: false,
            iInfoMsg: "",
        };
        //   setJobPostUsersDetails([poctoadd]);
        //   // to unfocus or blur client name field
        //   document.activeElement.blur();
        //   setError("clientName", {
        //     type: "validate",
        //     message: "",
        //   });
    };

    const getAvailability = useCallback(async () => {
        const availabilityResponse = await MasterDAO.getFixedValueRequestDAO();
        const JobTypesResponse = await MasterDAO.getJobTypesRequestDAO();
        setAvailability(
            availabilityResponse &&
            availabilityResponse.responseBody?.BindHiringAvailability.reverse()
        );
        setJobTypes(JobTypesResponse && JobTypesResponse?.responseBody);
    }, []);

    const getPayrollType = useCallback(async () => {
        const payRollsResponse = await MasterDAO.getPayRollTypeDAO();
        setPayRollTypes(payRollsResponse && payRollsResponse.responseBody);
    }, []);

    const getHowSoon = useCallback(async () => {
        const howSoonResponse = await MasterDAO.getHowSoonRequestDAO();
        setHowSoon(howSoonResponse && howSoonResponse.responseBody);
    }, []);

    const getWorkingMode = useCallback(async () => {
        const workingModeResponse = await MasterDAO.getModeOfWorkDAO();
        setWorkingMode(
            workingModeResponse && workingModeResponse?.responseBody?.details
        );
    }, []);



    const getFrequencyData = async () => {
        let response = await MasterDAO.getFrequencyDAO();
        setFrequencyData(
            response?.responseBody?.details?.map((fre) => ({
                id: fre.id,
                value: fre.frequency,
            }))
        );
    };

    const getTransparentEngType = async (compID, hrtypeid) => {
        let response = await MasterDAO.getEngTypesRequestDAO("", compID);

        // setTransparentEngType(response?.responseBody?.map(item=> ( { value: item.id, label: item.type})));
        if (response.statusCode === 200) {
            let types = response.responseBody
            setHRPricingTypes(types);
            let current = types.find(item => item.id === hrtypeid)
            // setControlledHiringPricingTypeValue(current.type)
          hrid === '0' &&  setBasicFormFields(prev => ({ ...prev, hiringPricingType: current.id, NRMargin: current.pricingPercent }))

        }
    }
    const contractDurationHandler = useCallback(async () => {
        let response = await MasterDAO.getContractDurationRequestDAO();
        setcontractDurations(response && response?.responseBody);
    }, []);


    const getTimeZoneList = useCallback(async () => {
        let response = await MasterDAO.getTimeZoneRequestDAO();
        setTimezoneList(response && response?.responseBody);
    }, [setTimezoneList]);

    const getStartEndTimeHandler = useCallback(async () => {
        const durationTypes = await MasterDAO.getStartEndTimeDAO();
        setStaryEndTimes(durationTypes && durationTypes?.responseBody);
        // console.log("durationTypes", durationTypes)
        // setValue("fromTime", { id: "", value:"9:00 AM" });
        setRoleReqFormFields(prev => ({ ...prev, startTime: "9:00 AM", endTime: "6:00 PM" }))
        // setValue("endTime", { id: "", value: "6:00 PM"});

    }, []);

    const getTalentRole = useCallback(async () => {
        const talentRole = await MasterDAO.getTalentsRoleRequestDAO();
        setTalentRole(talentRole && talentRole.responseBody);
    }, []);

    const getSkills = useCallback(async () => {
        const response = await MasterDAO.getSkillsRequestDAO();
        setSkills(response && response.responseBody);
    }, []);

    useEffect(() => {
        const combinedData = [
            ...skills,
        ];

        // remove selected skill for other skill list 
        setSkillMemo(combinedData.filter((o) => !mustHaveSkills?.includes(o?.value)))
        setCombinedSkillsMemo(combinedData.filter((o) => !goodToHaveSkills?.includes(o?.value)))
    }, [skills, mustHaveSkills, goodToHaveSkills])

    const getCurrencyHandler = useCallback(async () => {
        const response = await MasterDAO.getCurrencyRequestDAO();
        setCurrency(response && response?.responseBody);
    }, []);

    const fetchCities = useCallback(async () => {
        setIsLoading(true);
        const _res = await MasterDAO.getAutoCompleteCity("");
        setIsLoading(false);
        let citiesValues = [];
        if (_res?.statusCode === 200) {
            citiesValues = _res?.responseBody?.details?.map((city) => ({
                value: city.row_ID,
                label: city.location,
            }));
            setAllCities(citiesValues || []);
        } else {
            setAllCities([]);
        }
    });


    useEffect(
        () => {
            getAvailability();
            getPayrollType();
            getWorkingMode();
            getHowSoon();
            getFrequencyData();
            contractDurationHandler()
            getTimeZoneList()
            getStartEndTimeHandler()
            getTalentRole()
            getSkills()
            getCurrencyHandler()
            fetchCities()
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [
            // getCurrencyHandler,
            // getAvailability,
            // getSalesPerson,
            // getTalentRole,
            // getTimeZonePreference,
            // getRegion,
            // getHowSoon,
            // getWorkingMode,
            // contractDurationHandler,
            // getPartialEngHandler,
            // getBudgetHandler,
            // // postalCodeHandler,
            // getNRMarginHandler,
            // getDurationTypes,
            // getStartEndTimeHandler
        ]
    );

    const getHRClientName = useCallback(
        async (watchClientName) => {
            setIsSavedLoading(true);
            if (basicFormFields?.clientFullName) {
                let existingClientDetails =
                    await hiringRequestDAO.getClientDetailRequestDAO(
                        basicFormFields?.clientFullName?.match(/\(([^)]+)\)/)?.[1]?.trim()
                    );

                // existingClientDetails?.statusCode === HTTPStatusCode.OK &&
                //   setContactAndSalesID((prev) => ({
                //     ...prev,
                //     contactID: existingClientDetails?.responseBody?.contactid,
                //   }));

                if (existingClientDetails?.statusCode === HTTPStatusCode.OK) {
                    setIsSavedLoading(false);
                    setContactAndSalesID((prev) => ({
                        ...prev,
                        contactID: existingClientDetails?.responseBody?.contactid,
                    }));
                 
                    // setBasicFormFields(prev => ({
                    //     ...prev, 
                    //     companyName: existingClientDetails?.responseBody?.name,
                    //     clientFullName: existingClientDetails?.responseBody?.email
                    // }))
                  

                    setCheckCreditAvailability(
                        existingClientDetails?.responseBody?.CheckCreditAvailablilty
                    );

                    setAboutCompanyDesc(
                        existingClientDetails?.responseBody?.AboutCompanyDesc ?? null
                    );
                    if (clientDetails?.isHybrid === false) {
                        let companyType =
                            existingClientDetails?.responseBody.CompanyTypes?.find(
                                (item) => item.isActive
                            );

                        setUserCompanyTypeID(companyType.id);
                    } else {
                        setUserCompanyTypeID(1);
                    }

                    if (
                        existingClientDetails?.responseBody?.isTransparentPricing !== null
                    ) {
                        setTypeOfPricing(
                            existingClientDetails?.responseBody?.isTransparentPricing === true
                                ? 1
                                : 0
                        );
                        setDisableTypeOfPricing(true);
                        setTransactionMessage(
                            "*This client has been selected in past for below pricing model. To change and update pricing model go to Company and make the changes to reflect right while submitting this HR."
                        );
                    } else {
                        setTypeOfPricing(null);
                        setDisableTypeOfPricing(false);
                        setTransactionMessage(
                            "*You are creating this HR for the first time for this Client after roll out of Transparent Pricing, help us select if this client and HR falls under transparent or non transparent pricing."
                        );
                    }

                   
                }

                /* setError('clientName', {
                    type: 'duplicateCompanyName',
                    message:
                        existingClientDetails?.statusCode === HTTPStatusCode.NOT_FOUND &&
                        'Client email does not exist.',
                }); */

                // for manage and fetch from HubSpot
                if (existingClientDetails.statusCode === HTTPStatusCode.NOT_FOUND) {
                    let email = basicFormFields?.clientFullName?.match(/\(([^)]+)\)/)?.[1]?.trim();
                    if (EmailRegEx.email.test(email)) {
                        let response = await HubSpotDAO.getContactsByEmailDAO(email);
                        if (response.statusCode === HTTPStatusCode.OK) {
                            getHRClientName(watchClientName);
                        } else {
                            message.error(response?.responseBody);
                        }
                        setIsSavedLoading(false);
                        // setBasicFormFields(prev => ({
                        //     ...prev, companyName: existingClientDetails?.responseBody?.name,
                        //     clientFullName: existingClientDetails?.responseBody?.email
                        // }))
                        setIsLoading(false);
                    } else {
                        setIsSavedLoading(false);
                        setIsLoading(false);
                    }
                }
                setIsSavedLoading(false);
                setIsLoading(false);
            }
            setIsSavedLoading(false);
        },
        [

            basicFormFields?.clientFullName,
            clientDetails?.isHybrid,
        ]
    );

    useEffect(() => {
        let timer;
        if (!_isNull(basicFormFields?.clientFullName)) {
            timer =
                setTimeout(() => {
                    setIsLoading(true);
                    getHRClientName(basicFormFields?.clientFullName);
                }, 500);
        }
        return () => clearTimeout(timer);
    }, [getHRClientName, basicFormFields?.clientFullName, pathName]);

    const onChangeLocation = async (val) => {
        if (typeof val === "number") return;
        fetchLocations(val);
    };

    const fetchLocations = useCallback(
        debounce(async (val) => {
            if (val.trim() === "") return; // Avoid calling the API if the input is empty
            const controller = new AbortController();
            const signal = controller.signal;
            // fetchController.current = controller;

            try {
                setIsLoading(true);
                const _res = await MasterDAO.getAutoCompleteCityStateDAO(val, {
                    signal,
                });
                setIsLoading(false);
                let locations = [];
                if (_res?.statusCode === 200) {
                    locations = _res?.responseBody?.details?.map((location) => ({
                        id: location.row_ID,
                        value: location.location,
                    }));
                    setLocationList(locations || []);
                } else {
                    setLocationList([]);
                }
            } catch (error) {
                if (error.name === "AbortError") {
                    console.log("Fetch aborted");
                } else {
                    console.error("Error fetching locations:", error);
                    setLocationList([]);
                }
            }
        }, 300),
        []
    );

    const getNearByCitiesForAts = () => {
        return NearByCitesValues.length ? NearByCitesValues.map((val) => typeof val === 'string' ? allCities.find(c => c.label === val)?.value : val).join(",") : []
    };


    const getParsingType = (isHaveJD, parseType) => {
        if (isHaveJD === 1) {
            return "DonotHaveJD";
        }
        if (isHaveJD === 0) {
            if (parseType === "JDFileUpload") {
                return "FileUpload";
            }
            if (parseType === "Text_Parsing") {
                return "CopyPaste";
            }
        }
    };

      const updateCompanyDetails = useCallback(async () => {
        let payload = {
          "basicDetails": {
            "companyID": clientDetails?.companyId,    
            "isCompanyConfidential": confidentialInfo
          }, 
          
        }
    
        if(confidentialInfo) {
          payload["clientDetails"] = [
            {
              "clientID": clientFieldsDetails[0]?.id,     
              "emailId" :clientFieldsDetails[0]?.emailID,
              "clientPOCNameAlias": clientFieldsDetails[0]?.fullNameAlias,
              "clientPOCEmailAlias": clientFieldsDetails[0]?.emailIDAlias
            }
          ]  
          payload["companyConfidentialDetails"] = {
            "companyAlias": companyConfidentailFields.companyNameAlias,
            "companyURLAlias": null,
            "companyLinkedInAlias": null,
            "companyHQAlias": companyConfidentailFields.headquatersAlias  ,
            "companyLogoAlias": companyConfidentailFields.companyLogoAlias 
          }
        }
    
        const result = await allCompanyRequestDAO.updateCompanyConfidentialDAO(payload)
    
        // if(result.statusCode === 200){
        //   message.success('Successfully Updated Company profile details')
        // }
      },[confidentialInfo,clientDetails]) 

    const createHRHandler = async (pl, isDraft) => {
        setIsSavedLoading(true)
        const result = await hiringRequestDAO.createNEWHRDAO(pl)
        setIsSavedLoading(false)
        // console.log('result,result', result)

        if (result.statusCode === HTTPStatusCode.OK) {
            updateCompanyDetails()
            if (isDraft) {
                // navigate('/w_previewHR/'+result?.responseBody?.id) 
                message.success("HR details has been saved to draft.")
                navigate("/allhiringrequest");
            } else {
                if(+hrid > 0){
                message.success("HR details has been updated.")
                navigate("/allhiringrequest");
                }else{
                   navigate('/w_previewHR/' + result?.responseBody?.details?.id)  
                }
               

            }
        }
    }

    const isQuillEmpty = (html) => {
  const text = html
    .replace(/<(.|\n)*?>/g, '')
    .replace(/&nbsp;/g, '')
    .trim();

  return text.length === 0;
};

    const handleNext = (isDraft) => {
        let isValid = true;
        setFormValidationError(false)

        if (!isDraft) {
            if (basicFormFields.companyName?.trim() === '') {
                isValid = false;
            }

            if (basicFormFields.clientFullName?.trim() === '') {
                isValid = false;
            }

            if (basicFormFields.salesPerson === undefined) {
                isValid = false;
            }

            if (basicFormFields.availability === undefined) {
                isValid = false;
            }

            if (basicFormFields.hiringPricingType === undefined) {
                isValid = false;
            }

            if (basicFormFields?.hiringPricingType === 3 ||
                basicFormFields?.hiringPricingType === 6) {
                if (basicFormFields.payroll === undefined) {
                    isValid = false;
                }
            }

            if (basicFormFields?.hiringPricingType === 1 || basicFormFields?.hiringPricingType === 2 || basicFormFields.payroll === 4) {
                if (basicFormFields.contractDuration === undefined) {
                    isValid = false;
                }
            }

            if (basicFormFields.payroll === 3) {
                if (basicFormFields.payrollPartnerName?.trim() === '') {
                    isValid = false;
                }
            }

            if (basicFormFields.NRMargin <= 0 || basicFormFields.NRMargin === '' || basicFormFields.NRMargin > 100) {
                isValid = false;
            }

            if (roleReqFormFields.roleTitle?.trim() === '') {
                isValid = false;
            }

            if (roleReqFormFields.minExp === '' || roleReqFormFields.maxExp === '') {
                isValid = false;
            }

            if (roleReqFormFields.maxExp <= roleReqFormFields.minExp || roleReqFormFields.minExp < 0 || roleReqFormFields.maxExp > 60 || roleReqFormFields.minExp > 60) {
                isValid = false;
            }

            if (roleReqFormFields.modeOfWorking === undefined) {
                isValid = false;
            }

            if (roleReqFormFields?.modeOfWorking === 'Hybrid' || roleReqFormFields?.modeOfWorking === 'Office') {
                if (roleReqFormFields.location.length === 0) {
                    isValid = false;
                }
                if (NearByCitesValues.length === 0) {
                    isValid = false
                }
            }

            if (roleReqFormFields?.modeOfWorking === 'Hybrid') {
                if (roleReqFormFields.frequency === '') {
                    isValid = false;
                }
            }

            if (roleReqFormFields.timeZone === undefined) {
                isValid = false;
            }

            if (roleReqFormFields.startTime === undefined || roleReqFormFields.endTime === undefined) {
                isValid = false;
            }

            if (roleReqFormFields.noticePeriod === undefined) {
                isValid = false;
            }

            if (roleReqFormFields.interviewRounds === '' || isNaN(roleReqFormFields.interviewRounds) || parseInt(roleReqFormFields.interviewRounds) <= 0 || parseInt(roleReqFormFields.interviewRounds) > 10) {
                isValid = false;
            }

            if (roleReqFormFields?.numberOfTalents === '' || isNaN(roleReqFormFields.numberOfTalents) || parseInt(roleReqFormFields.numberOfTalents) <= 0 || parseInt(roleReqFormFields.numberOfTalents) > 99) {
                isValid = false;
            }

            if (mustHaveSkills.length === 0 || mustHaveSkills.length > 8 || goodToHaveSkills.length === 0) {
                isValid = false;
            }

           if (isQuillEmpty(jobDesData?.jobDescription)) {
                    isValid = false;
                }



            if (budgetFormFields?.currency === undefined || budgetFormFields?.type === undefined) {
                isValid = false
            }

            if (budgetFormFields?.type === 'Range') {
                if (budgetFormFields?.minBudget === '' || budgetFormFields?.maxBudget === '' || +budgetFormFields?.maxBudget <= +budgetFormFields?.minBudget) {
                    isValid = false
                }
            }

            if (budgetFormFields?.type === 'Fixed') {
                if (budgetFormFields?.minBudget === '') {
                    isValid = false
                }
            }

            if(confidentialInfo === true){
                if(companyConfidentailFields.companyNameAlias?.trim() === '' || companyConfidentailFields?.companyLogoAlias?.trim() === ''){
                    isValid = false
                }
            }

        }

        if (isDraft) {
            if (basicFormFields.clientFullName?.trim() === '') {
                message.error("Please enter the client full-name.")
                return
            }

            if (basicFormFields.salesPerson === undefined) {
                message.error("Please select hiring request sales person")
                return
            }
            if (roleReqFormFields?.numberOfTalents === '' || isNaN(roleReqFormFields.numberOfTalents) || roleReqFormFields.numberOfTalents <= 0 || roleReqFormFields.numberOfTalents > 99) {
                message.error("Please enter valid No. of talents")
                return
            }
        }




        if (!isValid) {
            setFormValidationError(true)
            message.error('Please fill all mandatory fields correctly')
            return;
        }


        let pl = {
            basicFormFields,
            roleReqFormFields,
            mustHaveSkills,
            goodToHaveSkills,
            jobDesData,
            budgetFormFields,
            enhanceMatchmakingFormFields
        }

        const selectedLabels = allCities?.filter(item => NearByCitesValues?.includes(item.value))?.map(item => item.label);
        const nonNumericValues = NearByCitesValues?.filter(value => typeof value === 'string' && !selectedLabels.includes(value));

        let formPayload = {
            "en_Id": getHRDetails?.en_Id ? getHRDetails?.en_Id : "",
            "Id": +hrid,
            "ActionType" : +hrid === 0 ? "Save" : 'Edit',
            "contactId": getContactAndSaleID?.contactID,
            "clientName": basicFormFields?.clientFullName,
            "companyName": basicFormFields?.companyName,
            "hrTitle": roleReqFormFields?.roleTitle,
            "availability": availability?.find(v => v.id === +basicFormFields?.availability)?.value,
            "IsCompanyConfidential": confidentialInfo,
            "BudgetType": budgetFormFields?.type === "Fixed" ? '1' : '2',
            "Currency": currency.find(c => c.id === budgetFormFields?.currency)?.value,


            "adhocBudgetCost": budgetFormFields?.type === "Fixed" ? +budgetFormFields?.minBudget : 0,
            "minimumBudget":  budgetFormFields?.type === "Range" ? +budgetFormFields?.minBudget : 0,
            "maximumBudget": budgetFormFields?.type === "Range" ? +budgetFormFields?.maxBudget : 0,

            "NRMargin": basicFormFields?.hiringPricingType !== 3 ? basicFormFields?.NRMargin :  0,
            "salesPerson": basicFormFields?.salesPerson,
            "contractDuration": basicFormFields?.contractDuration,
            "howSoon": howSoon?.find(v => v.id === +roleReqFormFields?.noticePeriod)?.value,

            "years": roleReqFormFields?.minExp ? roleReqFormFields?.minExp : 0,
            "minExpYears": roleReqFormFields?.minExp ? roleReqFormFields?.minExp : 0,
            "maxExpYears": roleReqFormFields?.maxExp ? roleReqFormFields?.maxExp : 0,


            "timeZone": roleReqFormFields?.timeZone,
            "TimeZoneFromTime": roleReqFormFields?.startTime,
            "TimeZoneEndTime": roleReqFormFields?.endTime,

            "talentsNumber": +roleReqFormFields?.numberOfTalents,
            "InterviewRounds": +roleReqFormFields?.interviewRounds,

            "modeOfWorkingId": roleReqFormFields?.modeOfWorking,

            "PayPerType": userCompanyTypeID,
            "isHRTypeDP": basicFormFields?.hiringPricingType === 3 ? true: false,
            "issaveasdraft": isDraft,

            "directPlacement": {
                "hiringRequestId": +hrid,
                "modeOfWork": roleReqFormFields?.modeOfWorking,
                "dpPercentage": basicFormFields?.hiringPricingType === 3 ? basicFormFields?.NRMargin :  0,
                "address": null,
                "city": null,
                "state": null,
                "country": "0",
                "postalCode": null
            },

            "IsConfidentialBudget": budgetFormFields?.isConfidential,
            "IsFresherAllowed": false,

            "CompensationOption": budgetFormFields?.compensationOptions.join("^"),

            "HasPeopleManagementExp": enhanceMatchmakingFormFields?.peopleManagement,
            "Prerequisites": enhanceMatchmakingFormFields?.highlight,
            "HRIndustryType": enhanceMatchmakingFormFields?.industry ? enhanceMatchmakingFormFields?.industry.join('^') : '',
            "StringSeparator": "^",

            "jdFileTypeID": parseType === 'JDFileUpload' ? 1 : parseType === 'Manual' ? 3 : 2,
            "JobTypeID": workingMode?.find(v => v.value === roleReqFormFields?.modeOfWorking)?.id,
            "JobLocation": roleReqFormFields?.location?.join(','),

            "FrequencyOfficeVisitID": roleReqFormFields?.modeOfWorking === "Hybrid" ? roleReqFormFields?.frequency : null,
            "NearByCities": selectedLabels?.concat(nonNumericValues)?.join(',') ?? null,

            "ShowHRPOCDetailsToTalents": false,

            "HRPOCUserDetails": [],

            "ATS_Joblocation": roleReqFormFields?.modeOfWorking === "Hybrid" || roleReqFormFields?.modeOfWorking === "Office" ? selectedCitiesIDS.map((item) => ({
                "id": item.id,
                "city_name": item.value
            }))
                : [],

            "IsPostaJob": isPostaJob,
            "IsProfileView": isProfileView,
            "IsVettedProfile": isVettedProfile,

            "ParsingType": getParsingType(isHaveJD, parseType),

            "skills": mustHaveSkills.join(','),
            "Allskills": goodToHaveSkills.join(','),

            "IsMustHaveSkillschanged": true,
            "IsGoodToHaveSkillschanged": false,

            "IsTransparentPricing": clientDetails?.isTransparentPricing,
            "HrTypePricingId": basicFormFields.hiringPricingType,
            "HrTypeId":basicFormFields.hiringPricingType,


            "companyInfo": {
                "companyID": clientDetails?.companyId,
                "companyName": clientDetails?.company,
                "website": clientDetails?.companyURL,
                "linkedInURL": clientDetails?.companyLinkedIn,
            },

            "PayrollPartnerName": basicFormFields?.payrollPartnerName,
            "PayrollTypeId": basicFormFields?.payroll ?? '',
            "jdURL": jobDesData?.jdURL ? jobDesData.jdURL : null,
            "jDFilename": jobDesData?.jdFile,
            "jDDescription": jobDesData?.jobDescription ? jobDesData?.jobDescription : null,
            "industryType": enhanceMatchmakingFormFields?.industry ? enhanceMatchmakingFormFields?.industry : '',
            "ATS_JobLocationID": (roleReqFormFields?.modeOfWorking === "Hybrid" || roleReqFormFields?.modeOfWorking === "Office") ? +selectedCitiesIDS[0]?.id : null,
            "ATS_NearByCities": (roleReqFormFields?.modeOfWorking === "Hybrid" || roleReqFormFields?.modeOfWorking === "Office") ? getNearByCitiesForAts() ?? null : null,
            "showHRPOCDetailsToTalents": null,
            "hrpocUserDetails": [],
            "jobTypeId": workingMode.find(v => v.value === roleReqFormFields?.modeOfWorking)?.id,
        }


        // console.log("pl", pl, formPayload)
        createHRHandler(formPayload, isDraft)
    }

    const handleJDUpload = async (fileData) => {
        setUploading(true);
        let formData = new FormData();
        formData.append("File", fileData);
        formData.append(
            "clientemail",
            clientDetails.emailId
        );
        let uploadFileResponse = await hiringRequestDAO.uploadFileDAO(formData);
        setUploading(false);
        if (uploadFileResponse.statusCode === 400) {

            message.error(uploadFileResponse?.responseBody)
        }
        if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
            if (
                fileData?.type === "image/png" ||
                fileData?.type === "image/jpeg"
            ) {
                setJobDesData(prev => ({ ...prev, jdFile: uploadFileResponse?.responseBody?.details?.FileName}))

                // setJDParsedSkills(
                // 	uploadFileResponse && uploadFileResponse?.responseBody?.details,
                // );
                message.success("File uploaded successfully");
            } else if (
                fileData?.type === "application/pdf" ||
                fileData?.type === "application/docs" ||
                fileData?.type === "application/msword" ||
                fileData?.type === "text/plain" ||
                fileData?.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
                setJobDesData(prev => ({ ...prev, jdFile: uploadFileResponse?.responseBody?.details?.FileName }))
                // setJDParsedSkills(
                // 	uploadFileResponse && uploadFileResponse?.responseBody?.details,
                // );
                // setJDDumpID(
                // 	uploadFileResponse &&
                // 		uploadFileResponse?.responseBody?.details?.JDDumpID,
                // );

                message.success("File uploaded successfully");
            }
        }


    }


    return (
        <main className={`${styles["main-content"]}`}>
            {/* <!-- Content Section --> */}
            <LogoLoader visible={isSavedLoading} />
            <div className={`${styles["content-wrapper"]}`}>
                {/* <!-- New Hiring Request Form --> */}
                <div className={`${styles["new-hr-form-wrapper"]}`}>
                    <form className={`${styles["new-hr-form"]}`}>
                        <h1 className={`${styles["page-title"]}`}>{+hrid === 0 ? 'New' : 'Edit' } Hiring Request</h1>

                        {/* <!-- Basic Details Section --> */}
                        <section className={`${styles["form-section"]}`}>
                            <h2 className={`${styles["section-title"]}`}>Basic details</h2>
                            <div className={`${styles["form-rows"]}`}>
                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            {/* <input type="text" className={`${styles["form-input"]}`} placeholder="Company name *" required /> */}

                                            <AutoComplete
                                                // className={`${styles["form-input"]}`}
                                                options={getCompanyNameSuggestion}
                                                onSelect={(companyName, _obj) => {
                                                    // console.log(_obj)
                                                    setBasicFormFields(prev => ({ ...prev, companyName: companyName }));

                                                    setCompanyID(_obj.companyID);
                                                    getClientNameSuggestionHandler("", _obj.companyID);
                                                    getPOCUsers(_obj.companyID);
                                                }}
                                                filterOption={true}
                                                onSearch={(searchValue) => {

                                                    if (searchValue) {
                                                        setCompanyNameSuggestion([]);
                                                        getCompanyNameSuggestionHandler(searchValue);
                                                    } else {
                                                        setClientNameMessage("");
                                                        setBasicFormFields(prev => ({ ...prev, clientFullName: '' }))
                                                        setAddClient(false);
                                                        setCompanyID(null);
                                                        setCompanyNameError("");

                                                    }
                                                }}
                                                value={basicFormFields?.companyName}
                                                onChange={(CompanyName) =>
                                                    setBasicFormFields(prev => ({ ...prev, companyName: CompanyName }))
                                                }
                                                placeholder="Company name *"
                                                disabled={hrid > 0}
                                            // ref={controllerCompanyRef}
                                            />
                                            {companyNameError.length > 0 && <p className={`${styles["fieldError"]}`}>{companyNameError}</p>}
                                            {formValidationError && basicFormFields.companyName?.trim() === '' && <p className={`${styles["fieldError"]}`}>please select company name</p>}

                                        </div>
                                    </div>
                                    <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            {/* <input type="text" className={`${styles["form-input"]}`} placeholder="Client full-name *" required /> */}
                                            <AutoComplete
                                                disabled={
                                                    companyID === undefined || companyID === null
                                                        ? true
                                                        : false
                                                }
                                                options={getClientNameSuggestion}
                                                onSelect={(clientName, _obj) => {
                                                    getClientNameValue(clientName, _obj);

                                                }}
                                                filterOption={true}
                                                onSearch={(searchValue) => {
                                                    setClientNameSuggestion([]);
                                                    getClientNameSuggestionHandler(searchValue);

                                                }}
                                                value={basicFormFields?.clientFullName}
                                                onChange={(clientName, obj) => {
                                                    setBasicFormFields(prev => ({ ...prev, clientFullName: clientName }))
                                                }
                                                }
                                                placeholder={"Client full-name *"}
                                            // ref={controllerRef}
                                            />

                                            {formValidationError && basicFormFields.clientFullName?.trim() === '' && <p className={`${styles["fieldError"]}`}>please select client full name</p>}
                                        </div>
                                    </div>
                                    {+hrid === 0 &&               <div className={`${styles["cols"]} ${styles["col-lg-2-5"]}`}>
                                        <div className={`${styles["form-group"]} ${styles["form-group-button"]}`}>
                                            <button type="button" className={`${styles["btn-add-company"]}`}
                                                onClick={() => navigate("/addNewCompany/0", {
                                                    state: {
                                                        createHR: true,
                                                        companyName: basicFormFields?.companyName,
                                                    },
                                                })}>

                                                <span className={`${styles["btn-add-icon"]}`}>
                                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M15 7.5C15 7.66576 14.9342 7.82473 14.8169 7.94194C14.6997 8.05915 14.5408 8.125 14.375 8.125H8.125V14.375C8.125 14.5408 8.05915 14.6997 7.94194 14.8169C7.82473 14.9342 7.66576 15 7.5 15C7.33424 15 7.17527 14.9342 7.05806 14.8169C6.94085 14.6997 6.875 14.5408 6.875 14.375V8.125H0.625C0.45924 8.125 0.300269 8.05915 0.183058 7.94194C0.0658481 7.82473 0 7.66576 0 7.5C0 7.33424 0.0658481 7.17527 0.183058 7.05806C0.300269 6.94085 0.45924 6.875 0.625 6.875H6.875V0.625C6.875 0.45924 6.94085 0.300269 7.05806 0.183058C7.17527 0.0658481 7.33424 0 7.5 0C7.66576 0 7.82473 0.0658481 7.94194 0.183058C8.05915 0.300269 8.125 0.45924 8.125 0.625V6.875H14.375C14.5408 6.875 14.6997 6.94085 14.8169 7.05806C14.9342 7.17527 15 7.33424 15 7.5Z" fill="white" />
                                                    </svg>
                                                </span>
                                                <span className={`${styles["btn-add-text"]}`}>ADD NEW COMPANY</span>
                                            </button>
                                        </div>
                                    </div>}
                      
                                </div>
                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            {/* <div className={`${styles["autocomplete-wrapper"]}`} data-autocomplete="sales-person">
                                            <input type="text" className={`${styles["form-input"]} ${styles["form-input-autocomplete"]}`} placeholder="Sales person *" required autocomplete="off" />
                                            <div className={`${styles["autocomplete-dropdown"]} ${styles["show"]}`}>
                                                <div class="autocomplete-item" data-value="David Brown">David Brown</div>
                                                {salesPerson.map((person)=>(
                                                  <div className={`${styles["autocomplete-item"]}`} data-value={person.id} onClick={()=>{
                                                    setBasicFormFields(prev=>({...prev,salesPerson:person.id}))
                                                  }}>{person.value}</div>
                                                ))}
                                            </div>
                                        </div> */}

                                            <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.value?.toLowerCase().includes(input.toLowerCase())
                                                }
                                                fieldNames={{
                                                    value: "id",      // stored value
                                                    label: "value"    // display text
                                                }}
                                                placeholder="Sales person *"
                                                options={salesPerson && salesPerson}
                                                value={basicFormFields?.salesPerson}
                                                onChange={(val, valObj) => {
                                                    setBasicFormFields(prev => ({ ...prev, salesPerson: val }))
                                                }}
                                            />
                                            {formValidationError && basicFormFields.salesPerson === undefined && <p className={`${styles["fieldError"]}`}>please select sales person</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                                <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.value?.toLowerCase().includes(input.toLowerCase())
                                                }
                                                fieldNames={{
                                                    value: "id",      // stored value
                                                    label: "value"    // display text
                                                }}
                                                placeholder="Engagement model *"
                                                options={availability && availability}
                                                value={basicFormFields.availability}
                                                onChange={(val, valObj) => {
                                                    console.log(val,valObj)
                                                    setBasicFormFields(prev => ({ ...prev, availability: val , hiringPricingType: undefined, payroll: undefined, contractDuration: undefined, payrollPartnerName: ''  }))
                                                }}
                                            />
                                            {/* <select className={`${styles["form-select"]}`} required
                                                value={basicFormFields.availability}
                                                onChange={(e) =>
                                                    setBasicFormFields(prev => ({ ...prev, availability: e.target.value, hiringPricingType: "", payroll: '', contractDuration: '', payrollPartnerName: '' }))}>
                                                <option className={`${styles["custom-select-option"]}`} value="">Engagement model *</option>

                                                {availability.map((engagement) => (
                                                    <option className={`${styles["custom-select-option"]}`} value={engagement.id}>{engagement.value}</option>
                                                ))}
                                            </select> */}
                                            {formValidationError && basicFormFields.availability === undefined && <p className={`${styles["fieldError"]}`}>please select engagement model</p>}
                                        </div>
                                    </div>
                                    {(basicFormFields?.hiringPricingType === 3 ||
                                        basicFormFields?.hiringPricingType === 6) && (<div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                   <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.value?.toLowerCase().includes(input.toLowerCase())
                                                }
                                                fieldNames={{
                                                    value: "id",      // stored value
                                                    label: "value"    // display text
                                                }}
                                                placeholder="Payroll *"
                                                options={payRollTypes && payRollTypes}
                                                value={basicFormFields.payroll}
                                                onChange={(val, valObj) => {
                                                  
                                                     setBasicFormFields(prev => ({ ...prev, payroll: val, contractDuration: undefined, payrollPartnerName: '' }))
                                                }}
                                            />
                                                {/* <select className={`${styles["form-select"]}`} required value={basicFormFields.payroll} onChange={(e) => {
                                                    setBasicFormFields(prev => ({ ...prev, payroll: e.target.value, contractDuration: '', payrollPartnerName: '' }))
                                                }}>
                                                    <option className={`${styles["custom-select-option"]}`} value="">Payroll *</option>
                                                    {payRollTypes.map((payroll) => (
                                                        <option className={`${styles["custom-select-option"]}`} value={payroll.id}>{payroll.value}</option>
                                                    ))}
                                                </select> */}
                                                {formValidationError && basicFormFields.payroll === undefined && <p className={`${styles["fieldError"]}`}>please select payroll</p>}
                                            </div>
                                        </div>)}

                                </div>
                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                               <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.value?.toLowerCase().includes(input.toLowerCase())
                                                }
                                                fieldNames={{
                                                    value: "id",      // stored value
                                                    label: "value"    // display text
                                                }}
                                                placeholder="Engagement type *"
                                                options={hrPricingTypes && basicFormFields.availability === 1 ? hrPricingTypes.map((item) => ({ id: item.id, value: item.type, showPartTime: item.showPartTime })).filter(i => (i.id !== 3 && i.showPartTime === true))
                                                    : hrPricingTypes.map((item) => ({ id: item.id, value: item.type, showPartTime: item.showPartTime }))}
                                                value={basicFormFields.availability}
                                                onChange={(val, valObj) => {
                    
                                                    setBasicFormFields(prev => ({ ...prev, hiringPricingType:  val, payroll: undefined, contractDuration: undefined, payrollPartnerName: '' }))
                                                   
                                                }}
                                            />
                                            {/* <select className={`${styles["form-select"]}`} required value={basicFormFields?.hiringPricingType} onChange={(e) => {
                                                setBasicFormFields(prev => ({ ...prev, hiringPricingType: e.target.value, payroll: '', contractDuration: '', payrollPartnerName: '' }))
                                            }}>
                                                <option className={`${styles["custom-select-option"]}`} value="">Engagement type *</option>
                                                {hrPricingTypes && basicFormFields.availability === 1 ? hrPricingTypes.map((item) => ({ id: item.id, value: item.type, showPartTime: item.showPartTime })).filter(i => (i.id !== 3 && i.showPartTime === true)).map(val => (<option className={`${styles["custom-select-option"]}`} value={val.id}>{val.value}</option>))
                                                    : hrPricingTypes.map((val) => (<option className={`${styles["custom-select-option"]}`} value={val.id}>{val.type}</option>))}
                                            </select> */}
                                            {formValidationError && basicFormFields.hiringPricingType === undefined && <p className={`${styles["fieldError"]}`}>please select engagement type</p>}
                                        </div>
                                    </div>
                                    <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            <input type="number" className={`${styles["form-input"]}`} placeholder="Uplers success fee (%) *" required value={basicFormFields?.NRMargin} min={0} max={100}
                                                onChange={(e) => setBasicFormFields(prev => ({ ...prev, NRMargin: e.target.value }))} />
                                            {formValidationError && (basicFormFields.NRMargin <= 0 || basicFormFields.NRMargin === '' || basicFormFields.NRMargin > 100) && <p className={`${styles["fieldError"]}`}>please enter valid (1 to 100) fee percentage</p>}
                                        </div>

                                    </div>
                                </div>
                                <div className={`${styles["row"]}`}>
                                    {(basicFormFields?.hiringPricingType === 1 || basicFormFields?.hiringPricingType === 2 || basicFormFields.payroll === 4) && <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                               <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.value?.toLowerCase().includes(input.toLowerCase())
                                                }
                                                fieldNames={{
                                                    value: "id",      // stored value
                                                    label: "value"    // display text
                                                }}
                                                placeholder="Contract Duration (in months) *"
                                                options={contractDurations && contractDurations.filter((item) => {
                                                   
                                                    if (basicFormFields.availability === 4) {
                                                        return item.value !== "Indefinite";
                                                    }
                                                    return true;
                                                }).map((item) => ({
                              id: item.value,
                              label: item.text,
                              value: item.text,
                            }))}
                                                value={basicFormFields?.contractDuration}
                                                onChange={(val, valObj) => {
                                                    setBasicFormFields(prev => ({ ...prev, contractDuration: val }))
                                                   
                                                }}
                                            />
                                            {/* <select className={`${styles["form-select"]}`} required value={basicFormFields?.contractDuration} onChange={(e) => {
                                                setBasicFormFields(prev => ({ ...prev, contractDuration: e.target.value }))
                                            }}>
                                                <option className={`${styles["custom-select-option"]}`} value="">Contract Duration (in months) *</option>
                                                {contractDurations.filter((item) => {
                                                    // if(watch('hiringPricingType')?.id === 1 || watch('hiringPricingType')?.id === 7)  return item?.value !== "-1" || item?.value !== "Indefinite"
                                                    // return item?.value !== "-1"
                                                    if (basicFormFields.availability === 4) {
                                                        return item.value !== "Indefinite";
                                                    }
                                                    return true;
                                                })
                                                    .map((item) => (<option className={`${styles["custom-select-option"]}`} value={item.value}>{item.text}</option>))}
                                            </select> */}
                                            {formValidationError && basicFormFields.contractDuration === undefined && <p className={`${styles["fieldError"]}`}>please select contract duration</p>}
                                        </div> </div>}


                                    {basicFormFields.payroll === 3 && <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            <input type="text" className={`${styles["form-input"]}`} placeholder="Payroll Partner Name *" required value={basicFormFields?.payrollPartnerName}
                                                onChange={(e) => setBasicFormFields(prev => ({ ...prev, payrollPartnerName: e.target.value }))} />
                                            {formValidationError && basicFormFields.payrollPartnerName?.trim() === '' && <p className={`${styles["fieldError"]}`}>please enter payroll partner name</p>}
                                        </div>

                                    </div>}

                                </div>

                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles["col-lg-12"]}`}>
                                        <div className={`${styles["form-group"]} ${styles["checkbox-group"]}`}>
                                            <label className={`${styles["checkbox-label"]}`}>
                                                <input type="checkbox" className={`${styles["form-checkbox"]}`} checked={confidentialInfo} onClick={() => setConfidentialInfo(prev => !prev)} />
                                                <span>Keep client information confidential</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                               
                            </div>

                        </section>

                        {confidentialInfo &&
                            <section className={`${styles["form-section"]}`}>
                                  <p style={{marginBottom:'10px'}} className={`${styles["teansactionMessage"]}`}>Be careful not to use company names in About, Culture, Job description if you choose to keep information confidential. </p>
                                <div className={`${styles["form-rows"]}`}>
                                    <div className={`${styles["row"]}`}>
                                        <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <div className={`${styles["form-group"]}`}>
                                                    <input type="text" className={`${styles["form-input"]}`} placeholder="Company Name" disabled={true} value={basicFormFields?.companyName}
                                                    />

                                                </div>
                                            </div>
                                        </div>

                                        <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <div className={`${styles["form-group"]}`}>
                                                    <input type="text" className={`${styles["form-input"]}`} placeholder="Company Name Alias  *" required value={companyConfidentailFields?.companyNameAlias}
                                                        onChange={(e) => setCompanyConfidentialFields(prev => ({ ...prev, companyNameAlias: e.target.value }))} />
                                                    {formValidationError && (companyConfidentailFields?.companyNameAlias?.trim() === '') && <p className={`${styles["fieldError"]}`}>please enter company name alias</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                     <div className={`${styles["row"]}`}>
                                        <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <div className={`${styles["form-group"]}`}>
                                                    <input type="text" className={`${styles["form-input"]}`} placeholder="Company Logo" disabled={true} value={companyConfidentailFields?.companyLogo}
                                                    />

                                                </div>
                                            </div>
                                        </div>

                                        <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <div className={`${styles["form-group"]}`}>
                                                    <input type="text" className={`${styles["form-input"]}`} placeholder="Company Logo Alias  *" required value={companyConfidentailFields?.companyLogoAlias}
                                                        onChange={(e) => setCompanyConfidentialFields(prev => ({ ...prev, companyLogoAlias: e.target.value }))} />
                                                    {formValidationError && (companyConfidentailFields?.companyLogoAlias?.trim() === '') && <p className={`${styles["fieldError"]}`}>please enter company logo alias</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

 <div className={`${styles["row"]}`}>
                                        <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <div className={`${styles["form-group"]}`}>
                                                    <input type="text" className={`${styles["form-input"]}`} placeholder="Company URL" disabled={true} value={companyConfidentailFields?.companyURL}
                                                    />

                                                </div>
                                            </div>
                                        </div>

                                      
                                    </div>

                                     <div className={`${styles["row"]}`}>
                                        <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <div className={`${styles["form-group"]}`}>
                                                    <input type="text" className={`${styles["form-input"]}`} placeholder="Company Linkedin" disabled={true} value={companyConfidentailFields?.companyLinkedinURL}
                                                    />

                                                </div>
                                            </div>
                                        </div>

                                      
                                    </div>

                                    <p className={styles.teansactionMessage}>If the client POC details are not added then it will be considered as "N/A."</p>

                                {clientFieldsDetails.map((val,ind)=>{
                                    return <>
                                    <div className={`${styles["row"]}`}>
                                        <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <div className={`${styles["form-group"]}`}>
                                                    <input type="text" className={`${styles["form-input"]}`} placeholder="Client POC Full Name" disabled={true} value={val.fullName}
                                                    />

                                                </div>
                                            </div>
                                        </div>

                                        <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <div className={`${styles["form-group"]}`}>
                                                    <input type="text" className={`${styles["form-input"]}`} placeholder="Client POC Full Name Alias" required value={val.fullNameAlias}
                                                        onChange={(e) => setClientFieldsDetails(prev => {
                                                            let arr = [...prev]
                                                            arr[ind] = {...arr[ind],fullNameAlias:e.target.value}

                                                            return arr
                                                        })} />
                                                
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`${styles["row"]}`}>
                                        <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <div className={`${styles["form-group"]}`}>
                                                    <input type="text" className={`${styles["form-input"]}`} placeholder="Client POC Email" disabled={true} value={val.emailID}
                                                    />

                                                </div>
                                            </div>
                                        </div>

                                        <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <div className={`${styles["form-group"]}`}>
                                                    <input type="text" className={`${styles["form-input"]}`} placeholder="Client POC Email Alias" required value={val.emailIDAlias}
                                                        onChange={(e) => setClientFieldsDetails(prev => {
                                                            let arr = [...prev]
                                                            arr[ind] = {...arr[ind],emailIDAlias:e.target.value}

                                                            return arr
                                                        })} />
                             
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                })}


                                  <div className={`${styles["row"]}`}>
                                        <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <div className={`${styles["form-group"]}`}>
                                                    <input type="text" className={`${styles["form-input"]}`} placeholder="Company Headquarters" disabled={true} value={companyConfidentailFields?.headquaters}
                                                    />

                                                </div>
                                            </div>
                                        </div>

                                        <div className={`${styles["cols"]} ${styles["col-lg-4-75"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <div className={`${styles["form-group"]}`}>
                                                    <input type="text" className={`${styles["form-input"]}`} placeholder="Company Headquarters Alias" required value={companyConfidentailFields?.headquatersAlias}
                                                        onChange={(e) => setCompanyConfidentialFields(prev => ({ ...prev, headquatersAlias: e.target.value }))} />
                                                   
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                       

                                </div>
                            </section>
                        }

                        {/* <!-- Role Requirements Section --> */}
                        <section className={`${styles["form-section"]}`}>
                            <h2 className={`${styles["section-title"]}`}>Role Requirements</h2>
                            <div className={`${styles["form-rows"]}`}>
                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]}  ${styles["col-lg-6"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            {/* <input type="text" className={`${styles["form-input"]}`} placeholder="Role title *" required
                                                value={roleReqFormFields?.roleTitle}
                                                onChange={(e) => {
                                                    setRoleReqFormFields(prev => ({ ...prev, roleTitle: e.target.value }))
                                                }}
                                            /> */}
                                            {console.log('talentRole',talentRole)}
                                            <AutoComplete
                                                options={talentRole && talentRole.filter(item => item.value !== null)}
                                                filterOption={true}
                                                onChange={(hrTitle) => {

                                                    setRoleReqFormFields(prev => ({ ...prev, roleTitle: hrTitle }))
                                                }}
                                                placeholder="Role title *"
                                                //   ref={controllerRef}
                                                value={roleReqFormFields?.roleTitle}
                                            />
                                            {formValidationError && roleReqFormFields.roleTitle?.trim() === '' && <p className={`${styles["fieldError"]}`}>please select role title</p>}
                                        </div>
                                    </div>
                                    <div className={`${styles["cols"]} ${styles["col-lg-2-5"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            <input type="number" className={`${styles["form-input"]}`} placeholder="Min. Experience *" required
                                                value={roleReqFormFields?.minExp} onChange={e => {
                                                    setRoleReqFormFields(prev => ({ ...prev, minExp: e.target.value }))
                                                }}
                                            />
                                            {formValidationError && (roleReqFormFields.minExp === '' || roleReqFormFields.minExp < 0 || roleReqFormFields.minExp > 60) && <p className={`${styles["fieldError"]}`}>please enter min experience (0 to 60) </p>}
                                        </div>
                                    </div>
                                    <div className={`${styles["cols"]} ${styles["col-lg-2-5"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            <input type="number" className={`${styles["form-input"]}`} placeholder="Max. Experience *" required
                                                value={roleReqFormFields?.maxExp} onChange={e => {
                                                    setRoleReqFormFields(prev => ({ ...prev, maxExp: e.target.value }))
                                                }} />

                                            {formValidationError && (roleReqFormFields.maxExp === '' || roleReqFormFields.maxExp <= roleReqFormFields.minExp || roleReqFormFields.maxExp > 60) && <p className={`${styles["fieldError"]}`}>please enter valid max experience </p>}
                                        </div>
                                    </div>
                                </div>

                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles["col-lg-3"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                               <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.value?.toLowerCase().includes(input.toLowerCase())
                                                }
                                                fieldNames={{
                                                    value: "id",      // stored value
                                                    label: "value"    // display text
                                                }}
                                                placeholder="Mode of working *"
                                                options={['Remote','Hybrid', 'Office'].map(i=>({id:i,value:i}))}
                                                value={roleReqFormFields.modeOfWorking}
                                                onChange={(val, valObj) => {
                                                    setRoleReqFormFields({ ...roleReqFormFields, modeOfWorking: val })
                                                }}
                                            />
                                            {/* <select className={`${styles["form-select"]} ${styles["mode-of-working"]}`} required value={roleReqFormFields.modeOfWorking} onChange={(e) => setRoleReqFormFields({ ...roleReqFormFields, modeOfWorking: e.target.value })}>
                                                <option className={`${styles["custom-select-option"]}`} value="">Mode of working *</option>
                                                <option className={`${styles["custom-select-option"]}`} value="Remote">Remote</option>
                                                <option className={`${styles["custom-select-option"]}`} value="Hybrid">Hybrid</option>
                                                <option className={`${styles["custom-select-option"]}`} value="Office">Office</option>
                                            </select> */}
                                            {formValidationError && roleReqFormFields.modeOfWorking === undefined && <p className={`${styles["fieldError"]}`}>please select mode of working</p>}
                                        </div>
                                    </div>

                                    {(roleReqFormFields?.modeOfWorking === 'Hybrid' || roleReqFormFields?.modeOfWorking === 'Office') && (<div className={`${styles["cols"]} ${styles["col-lg-3"]} ${styles["location-field-wrapper"]}`}>
                                        <div className={`${styles["form-group"]} ${styles["multiselect"]}`}>
                                            {/* <div className={`${styles["autocomplete-wrapper"]}`} data-autocomplete="location">
                                            <input type="text" className={`${styles["form-input"]} ${styles["form-input-autocomplete"]}`} placeholder="Location *" autocomplete="off" />
                                            <div className={`${styles["autocomplete-dropdown"]}`}></div>
                                        </div> */}
                                            <Select

                                                mode="multiple"
                                                style={{ width: "100%" }}
                                                options={locationList ?? []}
                                                onSelect={async (locName, _obj) => {

                                                    setSelectedCitiesIDS(prev => [...prev, _obj])

                                                }}

                                                onDeselect={(val, val2) => {

                                                    setSelectedCitiesIDS(prev => prev.filter(item => item.id !== val2.id))
                                                }}
                                                filterOption={true}
                                                onSearch={(searchValue) => {
                                                    // setClientNameSuggestion([]);
                                                    setNearByCitesValues([])
                                                    onChangeLocation(searchValue);
                                                }}
                                                onChange={(locName) => {

                                                    setRoleReqFormFields(prev => ({ ...prev, location: locName }))
                                                }}

                                                placeholder="Location *"

                                                value={roleReqFormFields?.location}
                                            />
                                            {formValidationError && roleReqFormFields?.location?.length === 0 && <p className={`${styles["fieldError"]}`}>please select location</p>}
                                        </div>
                                    </div>)}

                                    {roleReqFormFields?.modeOfWorking === 'Hybrid' && (<div className={`${styles["cols"]} ${styles["col-lg-3"]} ${styles["frequency-field-wrapper"]}`} >
                                        {/* <div className={`${styles["form-group"]}`}>
                                        <div className={`${styles["autocomplete-wrapper"]}`} data-autocomplete="frequency">
                                            <input type="text" className={`${styles["form-input"]} ${styles['form-input-autocomplete']}`} placeholder="Frequency *" autocomplete="off" />
                                            <div className={`${styles["autocomplete-dropdown"]}`}></div>
                                        </div>
                                    </div> */}
                                        <div className={`${styles["form-group"]}`}>
                                             <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.value?.toLowerCase().includes(input.toLowerCase())
                                                }
                                                fieldNames={{
                                                    value: "id",      // stored value
                                                    label: "value"    // display text
                                                }}
                                                placeholder="Frequency *"
                                                options={frequencyData && frequencyData}
                                                value={roleReqFormFields?.frequency}
                                                onChange={(val, valObj) => {
                                                setRoleReqFormFields({ ...roleReqFormFields, frequency: val })
                                                }}
                                            />
                                            {/* <select className={`${styles["form-select"]}`} required value={roleReqFormFields?.frequency} onChange={(e) => {
                                                setRoleReqFormFields(prev => ({ ...prev, frequency: e.target.value }))
                                            }}>
                                                <option className={`${styles["custom-select-option"]}`} value="">Frequency *</option>
                                                {frequencyData.map((item) => (<option className={`${styles["custom-select-option"]}`} value={item.id}>{item.value}</option>))}
                                            </select> */}
                                            {formValidationError && roleReqFormFields?.frequency === undefined && <p className={`${styles["fieldError"]}`}>please select frequency</p>}
                                        </div>
                                    </div>)}


                                </div>
                                {(roleReqFormFields?.modeOfWorking === 'Hybrid' || roleReqFormFields?.modeOfWorking === 'Office') && <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]}  ${styles["col-lg-6"]}`}>
                                        <div className={`${styles["form-group"]}  ${styles["multiselect"]}`}>
                                            <Select
                                                mode="multiple"
                                                //   style={{ width: "100%" }}
                                                value={NearByCitesValues}
                                                showSearch={true}
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={allCities.filter(cit => cit.value !== locationList.find(loc => loc.value === roleReqFormFields?.location)?.id)}
                                                // options={nearByCitiesData}
                                                onChange={(values, _) => {
                                                    setNearByCitesValues(values)
                                                }}
                                                placeholder="Show me candidates from following cities *"
                                                tokenSeparators={[","]}
                                            />

                                            {/* {nearByCityError && (
                  <div className={HRFieldStyle.error}>
                    * Please Select Locations
                  </div>
                )} */}

                                            {formValidationError && NearByCitesValues.length === 0 && <p className={`${styles["fieldError"]}`}>please select cities</p>}

                                            {nearByCitiesData
                                                ?.filter(
                                                    (option) => !NearByCitesValues?.includes(option.label)
                                                ).length > 0 && <p>Here are cities with high probability of candidates open to travel to your specified location</p>}

                                            <ul className={HRFieldStyle.selectFieldBox}>
                                                {
                                                    nearByCitiesData
                                                        ?.filter(
                                                            (option) => !NearByCitesValues?.includes(option.label)
                                                        )
                                                        .map((option) => (
                                                            <li
                                                                key={option.value}
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() =>
                                                                    setNearByCitesValues([
                                                                        ...NearByCitesValues,
                                                                        option?.label,
                                                                    ])
                                                                }
                                                            >
                                                                <span>
                                                                    {option.label}{" "}
                                                                    <img src={plusSkill} loading="lazy" alt="star" />
                                                                </span>
                                                            </li>
                                                        ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>}


                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles["col-lg-3"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            {/* <div className={`${styles["autocomplete-wrapper"]}`} data-autocomplete="timezone">
                                            <input type="text" className={`${styles["form-input"]} ${styles['form-input-autocomplete']}`} placeholder="Time zone *" required autocomplete="off" />
                                            <div className={`${styles["autocomplete-dropdown"]}`}></div>
                                        </div> */}
                                            {/* <div className={`${styles["form-group"]}`}>
                                        <select className={`${styles["form-select"]}`} required value={basicFormFields?.contractDuration} onChange={(e)=>{
                                            setBasicFormFields(prev=>({...prev,contractDuration:e.target.value}))
                                        }}>
                                            <option value="">Time zone *</option>
{timeZoneList.map((item) =>(  <option value={item.id}>{item.value}</option>))}
                                        </select>
                                    </div> */}

                                            <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.value?.toLowerCase().includes(input.toLowerCase())
                                                }
                                                fieldNames={{
                                                    value: "id",      // stored value
                                                    label: "value"    // display text
                                                }}
                                                placeholder="Time zone *"
                                                options={timeZoneList && timeZoneList}
                                                value={roleReqFormFields?.timeZone}
                                                onChange={(val, valObj) => {
                                                    // console.log(val, valObj)
                                                    setRoleReqFormFields(prev => ({ ...prev, timeZone: valObj.id }))
                                                }}
                                            />
                                            {formValidationError && (roleReqFormFields.timeZone === undefined) && <p className={`${styles["fieldError"]}`}>please select time zone</p>}
                                        </div>
                                    </div>
                                    <div className={`${styles["cols"]} ${styles["col-lg-3"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            {/* <div className={`${styles["autocomplete-wrapper"]}`} data-autocomplete="start-time">
                                                <input type="text" className={`${styles["form-input"]} ${styles['form-input-autocomplete']}`} placeholder="Start time *" required autocomplete="off" />
                                                <div className={`${styles["autocomplete-dropdown"]}`}></div>
                                            </div> */}
                                            <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.value?.toLowerCase().includes(input.toLowerCase())
                                                }
                                                fieldNames={{
                                                    value: "id",      // stored value
                                                    label: "value"    // display text
                                                }}
                                                placeholder="Start time *"
                                                options={getStartEndTimes && getStartEndTimes.map((item) => ({
                                                    id: item.value,
                                                    value: item.value,
                                                }))}
                                                value={roleReqFormFields?.startTime}
                                                onChange={(val, valObj) => {
                                                    // console.log(val, valObj)

                                                    let index = getStartEndTimes.findIndex(
                                                        (item) => item.value === val
                                                    );
                                                    if (index >= getStartEndTimes.length - 18) {
                                                        let newInd = index - (getStartEndTimes.length - 18);
                                                        let endtime = getStartEndTimes[newInd];
                                                        setRoleReqFormFields(prev => ({ ...prev, startTime: valObj.id, endTime: endtime.value }))

                                                    } else {
                                                        let endtime = getStartEndTimes[index + 18];

                                                        setRoleReqFormFields(prev => ({ ...prev, startTime: valObj.id, endTime: endtime.value }))
                                                    }
                                                }}
                                            />
                                            {formValidationError && (roleReqFormFields.startTime === undefined) && <p className={`${styles["fieldError"]}`}>please select start time</p>}
                                        </div>
                                    </div>
                                    <div className={`${styles["cols"]} ${styles["col-lg-3"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            {/*   <div className={`${styles["autocomplete-wrapper"]}`} data-autocomplete="end-time">
                                                <input type="text" className={`${styles["form-input"]} ${styles["form-input-autocomplete"]}`} placeholder="End time *" required autocomplete="off" />
                                                <div className={`${styles["autocomplete-dropdown"]}`}></div>
                                            </div> */}
                                            <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.value?.toLowerCase().includes(input.toLowerCase())
                                                }
                                                fieldNames={{
                                                    value: "id",      // stored value
                                                    label: "value"    // display text
                                                }}
                                                placeholder="Start time *"
                                                options={getStartEndTimes && getStartEndTimes.map((item) => ({
                                                    id: item.value,
                                                    value: item.value,
                                                }))}
                                                value={roleReqFormFields?.endTime}
                                                onChange={(val, valObj) => {
                                                    // console.log(val, valObj)
                                                    setRoleReqFormFields(prev => ({ ...prev, endTime: valObj.id }))
                                                }}
                                            />
                                            {formValidationError && (roleReqFormFields.endTime === undefined) && <p className={`${styles["fieldError"]}`}>please select end time</p>}
                                        </div>

                                    </div>
                                </div>
                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles["col-lg-3"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                               <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.value?.toLowerCase().includes(input.toLowerCase())
                                                }
                                                fieldNames={{
                                                    value: "id",      // stored value
                                                    label: "value"    // display text
                                                }}
                                                placeholder="Notice period *"
                                                options={howSoon && howSoon}
                                                value={roleReqFormFields.noticePeriod}
                                                onChange={(val, valObj) => {
                                                setRoleReqFormFields({ ...roleReqFormFields, noticePeriod: val })
                                                }}
                                            />
                                            {/* <select className={`${styles["form-select"]}`} required value={roleReqFormFields.noticePeriod} onChange={(e) => setRoleReqFormFields({ ...roleReqFormFields, noticePeriod: e.target.value })}>
                                                <option className={`${styles["custom-select-option"]}`} value="">Notice period *</option>
                                                {howSoon.map((item) => (<option className={`${styles["custom-select-option"]}`} value={item.id}>{item.value}</option>))}
                                            </select> */}
                                            {formValidationError && (roleReqFormFields.noticePeriod === '') && <p className={`${styles["fieldError"]}`}>please select notice period</p>}
                                        </div>
                                    </div>
                                    <div className={`${styles["cols"]} ${styles["col-lg-3"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            <input type="number" className={`${styles["form-input"]}`} placeholder="Interview rounds *" required min={1} max={5}
                                                value={roleReqFormFields.interviewRounds}
                                                onChange={e => setRoleReqFormFields(prev => ({ ...prev, interviewRounds: e.target.value }))}
                                            />
                                            {formValidationError && (roleReqFormFields.interviewRounds === '' || isNaN(roleReqFormFields.interviewRounds) || parseInt(roleReqFormFields.interviewRounds) <= 0 || parseInt(roleReqFormFields.interviewRounds) > 10) && <p className={`${styles["fieldError"]}`}>please enter interview rounds (1 to 5 )</p>}
                                        </div>
                                    </div>
                                    <div className={`${styles["cols"]} ${styles["col-lg-3"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            <input type="number" className={`${styles["form-input"]}`} placeholder="No. of talents needed *" required min={1} max={99}
                                                value={roleReqFormFields?.numberOfTalents} onChange={e => setRoleReqFormFields(prev => ({ ...prev, numberOfTalents: e.target.value }))} />
                                            {formValidationError && (roleReqFormFields?.numberOfTalents === '' || isNaN(roleReqFormFields.numberOfTalents) || parseInt(roleReqFormFields.numberOfTalents) <= 0 || parseInt(roleReqFormFields.numberOfTalents) > 99) && <p className={`${styles["fieldError"]}`}>please enter no of talents ( 1 to 99 )</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles["col-lg-12"]}`}>
                                        <div className={`${styles["form-group"]} ${styles["multiselect"]}`}>
                                            {/* <select className={`${styles["form-select"]}`} required>
                                                <option value="">Must have skills *</option>
                                            </select> */}
                                            <Select
                                                showSearch
                                                mode="tags"
                                                style={{ width: '100%' }}
                                                placeholder="Must have skills *"
                                                options={combinedSkillsMemo}
                                                onChange={options => {
                                                    setMustHaveSkills(options)
                                                }}
                                                value={mustHaveSkills}
                                            />
                                            {formValidationError && (mustHaveSkills.length === 0 || mustHaveSkills.length > 8) && <p className={`${styles["fieldError"]}`}>please select must have skills ( up to 8 )</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles["col-lg-12"]}`}>
                                        <div className={`${styles["form-group"]} ${styles["multiselect"]}`}>
                                            {/* <select className={`${styles["form-select"]}`}>
                                                <option value="">Good to have skills (optional)</option>
                                            </select> */}
                                            <Select
                                                showSearch
                                                mode="tags"
                                                style={{ width: '100%' }}
                                                placeholder="Good to have skills *"
                                                options={SkillMemo}
                                                onChange={options => {
                                                    setGoodToHaveSkills(options)
                                                }}
                                                value={goodToHaveSkills}
                                            />
                                            {formValidationError && (goodToHaveSkills.length === 0) && <p className={`${styles["fieldError"]}`}>please select good to have skills</p>}
                                        </div>
                                    </div>
                                </div>

                              {/* {+hrid === 0 &&  <div className={`${styles["row"]} ${styles['mt-2']}`}>
                                    <div className={`${styles["cols"]} ${styles["col-lg-12"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            <Radio.Group
                                                className="customradio newradiodes"
                                                name="employmentType"
                                                value={isHaveJD}
                                            >
                                                <Radio.Button value={0} onClick={() => setIsHaveJD(0)} >
                                                    <div style={{ display: 'flex', gap: '5px' }}>
                                                        <svg
                                                            width="18"
                                                            height="17"
                                                            viewBox="0 0 18 17"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M1.65306 1.26172H5.57143V9.64267H1.65306C1.47986 9.64267 1.31375 9.57475 1.19128 9.45385C1.0688 9.33294 1 9.16896 1 8.99798V1.90641C1 1.73543 1.0688 1.57145 1.19128 1.45054C1.31375 1.32964 1.47986 1.26172 1.65306 1.26172Z"
                                                                stroke="#676767"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                            <path
                                                                d="M5.57129 9.44391L8.62218 15.7379C9.26949 15.7379 9.8903 15.4727 10.348 15.0005C10.8057 14.5284 11.0629 13.888 11.0629 13.2203V11.3321H15.7841C15.9572 11.3326 16.1283 11.2948 16.286 11.2214C16.4437 11.1479 16.5844 11.0405 16.6985 10.9064C16.8127 10.7723 16.8977 10.6145 16.9478 10.4436C16.998 10.2728 17.0121 10.0929 16.9892 9.91596L16.074 2.36317C16.0369 2.05997 15.8942 1.78102 15.6725 1.57835C15.4508 1.37568 15.1651 1.26314 14.8689 1.26172H5.57129"
                                                                stroke="#676767"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                        </svg>
                                                        I have a JD with me
                                                        <img
                                                            className="checkIcon"
                                                            src={CheckRadioIcon}
                                                            alt="check"
                                                        />
                                                    </div>

                                                </Radio.Button>

                                                <Radio.Button value={1} onClick={() => {
                                                    setIsHaveJD(1);
                                                    setParseType("Manual");
                                                    setJobDesData({
                                                        jobDescription: '',
                                                        jdURL: '',
                                                        jdFile: ''
                                                    })
                                                }}
                                                >
                                                    <div style={{ display: 'flex', gap: '5px' }}>
                                                        <svg
                                                            width="18"
                                                            height="17"
                                                            viewBox="0 0 18 17"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M1.65306 1.26172H5.57143V9.64267H1.65306C1.47986 9.64267 1.31375 9.57475 1.19128 9.45385C1.0688 9.33294 1 9.16896 1 8.99798V1.90641C1 1.73543 1.0688 1.57145 1.19128 1.45054C1.31375 1.32964 1.47986 1.26172 1.65306 1.26172Z"
                                                                stroke="#676767"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                            <path
                                                                d="M5.57129 9.44391L8.62218 15.7379C9.26949 15.7379 9.8903 15.4727 10.348 15.0005C10.8057 14.5284 11.0629 13.888 11.0629 13.2203V11.3321H15.7841C15.9572 11.3326 16.1283 11.2948 16.286 11.2214C16.4437 11.1479 16.5844 11.0405 16.6985 10.9064C16.8127 10.7723 16.8977 10.6145 16.9478 10.4436C16.998 10.2728 17.0121 10.0929 16.9892 9.91596L16.074 2.36317C16.0369 2.05997 15.8942 1.78102 15.6725 1.57835C15.4508 1.37568 15.1651 1.26314 14.8689 1.26172H5.57129"
                                                                stroke="#676767"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                        </svg>
                                                        I don’t have a JD
                                                        <img
                                                            className="checkIcon"
                                                            src={CheckRadioIcon}
                                                            alt="check"
                                                        />
                                                    </div>

                                                </Radio.Button>
                                            </Radio.Group>
                                        </div>

                                    </div>
                                </div>}   */}

                                {+hrid > 0 ?
                                <>
                                  <div className={`${styles["row"]} ${styles['mt-2']}`}>
                                        <div className={`${styles["cols"]} ${styles["col-lg-12"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <label className={`${styles["form-label"]}`}>Job Description *</label>
                                                <ReactQuill

                                                    theme="snow"
                                                    className="newQuillEditor"
                                                    value={jobDesData?.jobDescription}
                                                    name="parametersHighlight"
                                                    onChange={(val) => {
                                                        // setParseType("Text_Parsing");
                                                        setJobDesData(prev => ({ ...prev, jobDescription: val, }))
                                                        //   let sanitizedContent = sanitizeLinks(val);
                                                        //   // let _updatedVal = sanitizedContent?.replace(/<img\b[^>]*>/gi, '');
                                                        //   setValue("parametersHighlight", sanitizedContent)
                                                    }}

                                                />
                                  <a
                                                                                              rel="noreferrer"
                                                                                              href={
                                                                                                NetworkInfo.PROTOCOL +
                                                                                                NetworkInfo.DOMAIN +
                                                                                                "Media/JDParsing/JDfiles/" +
                                                                                                jobDesData?.jdFile
                                                                                              }
                                                                                              style={{ textDecoration: "underline", marginTop:'10px' }}
                                                                                              target="_blank"
                                                                                            >{jobDesData?.jdFile}</a>

                                                                                                <a
                                                                                              rel="noreferrer"
                                                                                              href={jobDesData?.jdURL}
                                                                                              style={{ textDecoration: "underline", marginTop:'10px' }}
                                                                                              target="_blank"
                                                                                            >{jobDesData?.jdURL}</a>

                                                                                            {formValidationError && (isQuillEmpty(jobDesData?.jobDescription))  && <p className={`${styles["fieldError"]}`}>please provide Job description </p>}
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                  {isHaveJD === 0 ? <>
                                    <div className={`${styles["row"]} ${styles['mt-2']}`}>
                                        <div className={`${styles["cols"]} ${styles["col-lg-12"]}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <label className={`${styles["form-label"]}`}>Job Description *</label>
                                                <ReactQuill

                                                    theme="snow"
                                                    className="newQuillEditor"
                                                    value={jobDesData?.jobDescription}
                                                    name="parametersHighlight"
                                                    onChange={(val) => {
                                                        // setParseType("Text_Parsing");
                                                        setJobDesData(prev => ({ ...prev, jobDescription: val}))
                                                        //   let sanitizedContent = sanitizeLinks(val);
                                                        //   // let _updatedVal = sanitizedContent?.replace(/<img\b[^>]*>/gi, '');
                                                        //   setValue("parametersHighlight", sanitizedContent)
                                                    }}

                                                />

                                                 {formValidationError && (isQuillEmpty(jobDesData?.jobDescription))  && <p className={`${styles["fieldError"]}`}>please provide Job description </p>}
                                                {/* <div className={`${styles["rich-text-editor-wrapper"]}`}>
                                            <div id="job-description-toolbar" className={`${styles["ql-toolbar"]} ${styles["ql-snow"]}`}>
                                                <span className={`${styles["ql-formats"]}`}>
                                                    <button type="button" className={`${styles["ql-bold"]}`}><svg viewBox="0 0 18 18"> <path class="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"></path> <path class="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"></path> </svg></button>
                                                    <button type="button" className={`${styles["ql-italic"]}`}></button>
                                                    <button type="button" className={`${styles["ql-underline"]}`}></button>
                                                </span>
                                                <span className={`${styles["ql-formats"]}`}>
                                                    <button type="button" className={`${styles["ql-align"]}`} value=""></button>
                                                    <button type="button" className={`${styles["ql-align" ]}`}value="center"></button>
                                                    <button type="button" className={`${styles["ql-align"]}`} value="right"></button>
                                                    <button type="button" className={`${styles["ql-align"]}`} value="justify"></button>
                                                </span>
                                                <span className={`${styles["ql-formats"]}`}>
                                                    <button type="button" className={`${styles["ql-list"]}`} value="bullet"></button>
                                                    <button type="button" className={`${styles["ql-list"]}`} value="ordered"></button>
                                                </span>
                                            </div>
                                            <div id="job-description-editor" className={`${styles["rich-text-editor"]}`}></div>
                                            <input type="hidden" name="job-description" id="job-description-input" />
                                        </div> */}
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className={`${styles["row"]} ${styles['form-separator-wrapper']}`}>
                                        <div className={`${styles["cols"]} ${styles["col-lg-3"]}`}>
                                            <div className={`${styles["form-separator"]}`}>
                                                <span className={`${styles["separator-text"]}`}>OR</span>
                                            </div>
                                        </div>
                                    </div> */}

                                    <div className={`${styles["row"]}`}>
                                        <div className={`${styles["cols"]} ${styles['col-lg-5-5']}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <div className={`${styles["input-with-icon"]}`}>
                                                    <textarea className={`${styles["form-textarea"]}`} placeholder="Paste the job description link" value={jobDesData?.jdURL} onChange={e => {
                                                        setJobDesData(prev => ({ ...prev, jdURL: e.target.value }))
                                                    }}></textarea>
                                                    <img src="images/link-simple-ic.svg" alt="Link Icon" className={`${styles["input-icon-right"]}`} />
                                                </div>
                                            </div>
                                        </div>

                                                                      
                                    
                                          <div className={`${styles["cols"]} ${styles["col-lg-1"]}`} >
                                             <div className={`${styles["form-separator"]}`} style={{height:'80%'}}><span className={`${styles["separator-text"]}`}>OR</span></div>
                                            
                                          </div>
                                                
                                         
                                        
                              
                                        <div className={`${styles["cols"]} ${styles['col-lg-5-5']}`}>
                                            <div className={`${styles["form-group"]}`}>
                                                <div className={`${styles["file-upload-area"]}`} onClick={() => jdFileRef.current.click()}>
                                                    {uploading ? <Spin className={`${styles["upload-icon"]}`} /> : <img src="images/folder-open-ic.svg" alt="Folder Icon" className={`${styles["upload-icon"]}`} />}
                                                    <p className={`${styles["upload-text"]}`}>Click to upload or drag and drop <br />(supported files: PDF, DOC, DOCX)</p>
                                                    <input ref={jdFileRef} type="file" className={`${styles["file-input"]}`} accept=".pdf,.doc,.docx" multiple onChange={e => {
                                                        // setParseType('JDFileUpload');
                                                        const MAX_FILE_SIZE = 500 * 1024; // 500 KB in bytes
                                                        const isFileSizeValid = e.target.files[0].size <= MAX_FILE_SIZE;
                                                        if (!isFileSizeValid) {
                                                            message?.error('Max file size 500 KB');
                                                            return
                                                        }
                                                        handleJDUpload(e.target.files[0])
                                                        // setJobDesData(prev => ({ ...prev, jdFile: e.target.files[0], jobDescription: '', jdURL: '' }))
                                                    }} />
                                                    <div className={`${styles["file-list"]}`} style={{ display: jobDesData?.jdFile?.length === 0 ? 'none' : 'block' }} onClick={e => {
                                                                e.stopPropagation();
                                                            }}>
                                                        {jobDesData?.jdFile?.length && <div className={`${styles["file-item"]}`}>
                                                            <span className={`${styles["file-name"]}`}>
                                                                
                                                                 <a
                                                                                              rel="noreferrer"
                                                                                              href={
                                                                                                NetworkInfo.PROTOCOL +
                                                                                                NetworkInfo.DOMAIN +
                                                                                                "Media/JDParsing/JDfiles/" +
                                                                                                jobDesData?.jdFile
                                                                                              }
                                                                                              style={{ textDecoration: "underline" }}
                                                                                              target="_blank"
                                                                                            >{jobDesData?.jdFile}</a></span>
                                                            <button type="button" className={`${styles["file-delete"]}`} onClick={e => {
                                                                e.stopPropagation();
                                                                setJobDesData(prev => ({ ...prev, jdFile: ''}))
                                                            }}></button>
                                                        </div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                   
                                </> :
                                    <div className="noJobDesInfo">
                                        No job description? No problem! We'll help you create one. Just fill out the form and we'll generate a custom job <br />description based on your input.
                                    </div>
                                }
                                </>
                                }

                              


                            </div>

                        </section>

                        {/* <!-- Budget Section --> */}
                        <section className={`${styles["form-section"]}`}>
                            <h2 className={`${styles["section-title"]}`}>Budget</h2>
                            <div className={`${styles["form-rows"]}`}>
                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles["col-lg-2"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            {/* <div className={`${styles["autocomplete-wrapper"]}`} data-autocomplete="currency">
                                                <input type="text" className={`${styles["form-input"]} ${styles["form-input-autocomplete"]}`} placeholder="Currency *" required autocomplete="off" />
                                                <div className={`${styles["autocomplete-dropdown"]}`}></div>
                                            </div> */}
                                            <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.value?.toLowerCase().includes(input.toLowerCase())
                                                }
                                                fieldNames={{
                                                    value: "id",      // stored value
                                                    label: "value"    // display text
                                                }}
                                                placeholder="Currency *"
                                                options={currency && currency}
                                                value={budgetFormFields?.currency}
                                                onChange={(val, valObj) => {
                                                    // console.log(val, valObj)
                                                    setBudgetFormFields(prev => ({ ...prev, currency: valObj.id }))
                                                }}
                                            />
                                            {formValidationError && (budgetFormFields?.currency === undefined) && <p className={`${styles["fieldError"]}`}>please select currency</p>}
                                        </div>
                                    </div>

                                    <div className={`${styles["cols"]} ${styles["col-lg-2"]}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            {/* <div className={`${styles["autocomplete-wrapper"]}`} data-autocomplete="currency">
                                                <input type="text" className={`${styles["form-input"]} ${styles["form-input-autocomplete"]}`} placeholder="Currency *" required autocomplete="off" />
                                                <div className={`${styles["autocomplete-dropdown"]}`}></div>
                                            </div> */}
                                            <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.value?.toLowerCase().includes(input.toLowerCase())
                                                }
                                                fieldNames={{
                                                    value: "id",      // stored value
                                                    label: "value"    // display text
                                                }}
                                                placeholder="Budget Type *"
                                                options={[{ id: 'Fixed', value: 'Fixed' }, { id: 'Range', value: 'Range' }]}
                                                value={budgetFormFields?.type}
                                                onChange={(val, valObj) => {
                                                    // console.log(val, valObj)
                                                    setBudgetFormFields(prev => ({ ...prev, type: valObj.id }))
                                                }}
                                            />
                                            {formValidationError && (budgetFormFields?.type === undefined) && <p className={`${styles["fieldError"]}`}>please select budget type</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles['col-lg-12']}`}>
                                        <div className={`${styles["form-group"]} ${styles["mb-0"]}`}>
                                            <label className={`${styles["form-label"]}`}>{budgetFormFields?.type ? budgetFormFields?.type : 'Fixed'} pay</label>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles['col-lg-3-75']}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            <input type="number" className={`${styles["form-input"]}`} placeholder={budgetFormFields?.type === 'Range' ? "Min. range *" : "Budget *"} required
                                                value={budgetFormFields?.minBudget} onChange={e => {
                                                    setBudgetFormFields(prev => ({ ...prev, minBudget: e.target.value }))
                                                }} />
                                            {formValidationError && (budgetFormFields?.minBudget === '') && <p className={`${styles["fieldError"]}`}>please enter {budgetFormFields?.type === 'Range' ? "min. range " : "budget *"}</p>}
                                        </div>
                                    </div>

                                    {budgetFormFields?.type === 'Range' && (<div className={`${styles["cols"]} ${styles['col-lg-3-75']}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            <input type="number" className={`${styles["form-input"]}`} placeholder="Max range *" required value={budgetFormFields?.maxBudget} onChange={e => {
                                                setBudgetFormFields(prev => ({ ...prev, maxBudget: e.target.value }))
                                            }} />
                                            {formValidationError && (budgetFormFields?.maxBudget === '' || +budgetFormFields?.maxBudget <= +budgetFormFields?.minBudget) && <p className={`${styles["fieldError"]}`}>please enter valid max. range</p>}
                                        </div>
                                    </div>)}

                                </div>

                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles['col-lg-12']}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            <label className={`${styles["form-label"]}`}>Variable & equity (optional)</label>
                                            <input type="hidden" name="variable-equity" id="variable-equity-input" />
                                            <div className={`${styles["pill-container"]} ${styles["pill-container-variable-equity"]}`}>
                                                {compensationOptions.map((item, index) => {
                                                    return <button type="button" className={`${styles["pill"]}  ${budgetFormFields?.compensationOptions.includes(item) ? styles["pill-selected"] : ''}`}
                                                        onClick={() => {
                                                            if (budgetFormFields?.compensationOptions.includes(item)) {
                                                                setBudgetFormFields(prev => ({ ...prev, compensationOptions: prev.compensationOptions.filter(i => i !== item) }))
                                                            } else {
                                                                setBudgetFormFields(prev => ({ ...prev, compensationOptions: [...prev.compensationOptions, item] }))
                                                            }

                                                        }}
                                                    >
                                                        <span>{item}</span>
                                                        <span className={`${budgetFormFields?.compensationOptions.includes(item) ? styles["pill-close"] : styles["pill-add"]}`}></span>
                                                    </button>
                                                })}

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles['col-lg-12']}`}>
                                        <div className={`${styles["form-group"]} ${styles['checkbox-group']}`}>
                                            <label className={`${styles["checkbox-label"]}`}>
                                                <input type="checkbox" className={`${styles["form-checkbox"]}`} checked={budgetFormFields?.isConfidential} onClick={() => setBudgetFormFields(prev => ({ ...prev, isConfidential: !prev.isConfidential }))} />
                                                <span>Keep the budget confidential</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* <!-- Enhance Talent Matchmaking Section --> */}
                        <section className={`${styles["form-section"]}`}>
                            <h2 className={`${styles["section-title"]} ${styles["md-1"]}`}>Enhance talent matchmaking (optional)</h2>
                            <p className={`${styles["section-description"]}`}>This information will not be visible to the talent or on job board, but will be used by the system/internal team to find more accurate match for this HR/job.</p>
                            <div className={`${styles["form-rows"]}`}>
                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles['col-lg-6']}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            {/* <div className={`${styles["multiselect-autocomplete-wrapper"]}`} data-autocomplete="industry">
                                                <div className={`${styles["multiselect-tags-container"]}`}></div>
                                                <input type="text" className={`${styles["form-input"]} ${styles["multiselect-input"]}`} placeholder="Industry" autocomplete="off" />
                                                <div className={`${styles["autocomplete-dropdown"]}`}></div>
                                            </div> */}
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
                                                placeholder="Industry"
                                                options={[{ id: 'Product', value: 'Product' }, { id: 'Service', value: 'Service' }]}
                                                value={enhanceMatchmakingFormFields?.industry}
                                                onChange={(val, valObj) => {
                                                    // console.log(val, valObj)
                                                    setEnhanceMatchmakingFormFields(prev => ({ ...prev, industry: valObj.id }))
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={`${styles["row"]}`}>
                                    <div className={`${styles["cols"]} ${styles['col-lg-12']}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            <label className={`${styles["form-label"]}`}>Does the client require a talent with people management experience?</label>
                                            <div className={`${styles["radio-group"]}`}>
                                                <label className={`${styles["radio-label"]}`}>
                                                    <input type="radio" name="people-management" value={true} className={`${styles["form-radio"]}`} checked={enhanceMatchmakingFormFields?.peopleManagement}
                                                        onChange={() => { setEnhanceMatchmakingFormFields(prev => ({ ...prev, peopleManagement: true })) }} />
                                                    <span>Yes</span>
                                                </label>
                                                <label className={`${styles["radio-label"]}`}>
                                                    <input type="radio" name="people-management" value={false} className={`${styles["form-radio"]}`} checked={!enhanceMatchmakingFormFields?.peopleManagement}
                                                        onChange={() => { setEnhanceMatchmakingFormFields(prev => ({ ...prev, peopleManagement: false })) }} />
                                                    <span>No</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${styles["row"]} ${styles['mt-2']}`}>
                                    <div className={`${styles["cols"]} ${styles['col-lg-12']}`}>
                                        <div className={`${styles["form-group"]}`}>
                                            <label className={`${styles["form-label"]}`}>Highlight any key parameters or things to consider for finding the best match talents</label>
                                            <ReactQuill

                                                theme="snow"
                                                className="newQuillEditor"
                                                value={enhanceMatchmakingFormFields?.highlight}
                                                name="parametersHighlight"
                                                onChange={(val) => {
                                                    setEnhanceMatchmakingFormFields(prev => ({ ...prev, highlight: val }))

                                                }}

                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>

                        {/* <!-- Form Actions --> */}
                        <section className={`${styles["form-actions"]}`}>
                          {+hrid === 0 && <button type="button" name="save" className={`${styles["btn-save"]}`} onClick={() => handleNext(true)}>Save As Draft</button>} 
                            <button type="button" name="next" className={`${styles["btn-next"]}`} onClick={() => handleNext(false)}>{+hrid === 0 ? "Create" : "Edit"} HR</button>
                        </section>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default NewHRFields