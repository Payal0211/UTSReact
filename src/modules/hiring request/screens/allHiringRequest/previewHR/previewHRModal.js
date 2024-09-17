import { AutoComplete, Avatar, Checkbox, Popconfirm, Radio, Select, Space, Spin, Tooltip, message } from "antd";
import Modal from "antd/es/modal/Modal";
import "./css/previewHR.css";
import 'react-quill/dist/quill.snow.css'
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import { useCallback, useEffect, useRef, useState } from "react";
import infosmallIcon from "assets/svg/infoSmallIcon.svg";
import EditnewIcon from "assets/svg/editnewIcon.svg";
import SmallDownArrow from "assets/svg/smallDownArrow.svg";
import businessIconImage from "assets/svg/businessIcon.svg";
import umbrellaIconImage from "assets/svg/umbrellaIcon.svg";
import clockIconImage from "assets/svg/clockIcon.svg";
import locationIconImage from "assets/svg/locationIcon.svg";
import awardIconImage from "assets/svg/awardIcon.svg";
import CheckRadioIcon from "assets/svg/CheckRadioIcon.svg";
import plusImage from "assets/svg/plus.svg";
import plusIcon from "assets/svg/plusIcon.svg";
import currencyIcon from "assets/svg/currencyIcon.svg"
import selectStarFillImage from "assets/svg/selectStarFill.svg";
import { AiFillStar } from "react-icons/ai";
import ReactQuill from "react-quill";
import getSymbolFromCurrency from "currency-symbol-map";
import moment from 'moment-timezone';
import infoIcon from "assets/svg/infoIcon.svg";
import rightGreen from "assets/svg/rightGreen.svg";
import { getDataFromLocalStorage, trackingDetailsAPI, convertCurrency, EngOptions, sanitizeLinks, compensationOptions, industryOptions, seriesOptions, monthOptions, foundedIn, formatSkill ,isEmptyOrWhitespace} from "./services/commonUsedVar";
// import { DeleteCultureImage, DeleteYoutubeLink, UpdateDetails, getCompanyPerks } from "../../../services/companyProfileApi";
import debounce from 'lodash.debounce';

import deleteIcon from "assets/svg/delete.svg";
import DeleteIcon from "assets/svg/delete-icon.svg";
import DeleteImg from "assets/svg/delete-icon.svg";
import MailIcon from "assets/svg/mailIcon.svg";
import PhoneIcon from "assets/svg/phoneIcon.svg";
import DeleteCircleIcon from "assets/svg/deleteCircleIcon.svg";
import EditCircleIcon from "assets/svg/editCircleIcon.svg";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import { MasterDAO } from "core/master/masterDAO";
import YouTubeVideo from "modules/client/components/previewClientDetails/youTubeVideo";
import { NetworkInfo } from "constants/network";
import confirm from "antd/es/modal/confirm";
import HSContent from "constants/CommonEditorPreview/HSContent";


// import "../../CompanyDetails/companyDetails.css";
function PreviewHRModal({
  setViewPosition,
  ViewPosition,
  setJobPreview,
  jobPreview,
  hrIdforPreview,
  setChangeStatus,
  hrNumber,
  allData,
  ispreviewLoading,
  previewIDs
}) {
  const isCloseJob = localStorage.getItem("isCloseJob");
  const getcompanyID = jobPreview?.hrTypeId === 1 ? 1 :  2 
  const userData = getDataFromLocalStorage();
  const [error, setError] = useState({});
  const [iseditRoleName, setiseditRoleName] = useState(false);
  const [editRoleName, seteditRoleName] = useState("");
  const [rolesData, setRolesData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [iseditBudget, setisEditBudget] = useState(false);
  const [editBudget, setEditBudget] = useState({
    currency: "USD",
    budgetFrom: "",
    budgetTo: "",
    convertedFromValue: 2000,
    budgetType: "",
    isConfidentialBudget: false,
  });
  const [iseditDuration, setisEditDuration] = useState(false);
  const [editDuration, seteditDuration] = useState({
    employmentType: "Full Time",
    contractDuration: "",
    hiringTypePricingId: "",
    payrollPartnerName: "",
    payrollType: "",
    payrollTypeId: "",
  });
  const [iseditNoticePeriod, setisEditNoticePeriod] = useState(false);
  const [editNoticePeriod, setEditNoticePeriod] = useState({ howsoon: "" });
  const [iseditLocation, setisEditLocation] = useState(false);
  const [editLocation, setEditLocation] = useState({workingModeId: "",
    JobLocation:"",
    FrequencyOfficeVisitID:null,
    IsOpenToWorkNearByCities:null,
    NearByCities:[],
    ATS_JobLocationID:null,
    ATS_NearByCities:""});  
  const [iseditExp, setisEditExp] = useState(false);
  const [editExp, seteditExp] = useState("");
  const [iseditSkills, setisEditSkills] = useState(false);
  const selectTopRef = useRef(null);
  const [editTopSkills, setEditTopSkills] = useState([]);
  const [editskills, setEditSkills] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [Skills, setSkills] = useState([]);
  const [topSkilladdedError, setTopSkillAddedError] = useState(false);
  const [goodtoHaveSkillAddedError, setGoodToHaveSkillAddedError] =
    useState(false);
  const [skillErrors, setskillsErrors] = useState(false);
  const [iseditRolesAndRes, setisEditRolesAndRes] = useState(false);
  const [editRolesAndRes, setEditRolesAndRes] = useState("");
  const [iseditRequirenments, setisEditRequirenments] = useState(false);
  const [editRequirenments, setEditRequirenments] = useState("");
  const [editWhatWeOffer, setEditWhatWeOffer] = useState('')
  const [iseditWhatWeOffer, setisEditWhatWeoffer] = useState(false)
  const [editRoleOverview, setEditroleOverview] = useState('')
  const [iseditRoleOverview, setisEditroleOverview] = useState(false)
  const [hiringTypePricing, setHiringTypePricing] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [payrollList, setPayrollList] = useState([]);
  const [iseditShift, setisEditShift] = useState(false);
  const [companyPerks, setCompanyPerks] = useState([]);
  const [jobTypes,setJobTypes] = useState([]);
  const[isAutogenerateQuestions,setIsAutogenerateQuestions] = useState(false);
  const[open,setIsOpen] = useState(false);
  const [isSaveAllChanges,setIsSaveAllChanges] = useState(false);
  const [isAnyFieldUpdate,setIsAnyFieldUpdate] = useState(false);

  const [editShift, setEditShift] = useState({
    timeZone: "",
    timeZoneFromTime: "",
    timeZoneEndTime: "",
  });
  const[frequencyData,setFrequencyData] = useState([]);
  const[nearByCitiesData,setNearByCitiesData] = useState([]);
  const[allCities,setAllCities] = useState([]);

  const[locationList,setLocationList] = useState([]);

  const [CurrencyList, setCurrencyList] = useState([]);
  const [isFreshersAllowed, setIsFreshersAllowed] = useState(false)
  const [isExpDisabled, setIsExpDisabled] = useState(false)
  const [isFresherDisabled, setIsFresherDisabled] = useState(false)

  const [timeZone, setTimeZone] = useState([]);
  const [startEndTime, setStartEndTime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddMonth, setIsAddMonth] = useState(false);

  const[isEditUserInfo,setIsEditUserInfo] = useState(false);
  const [hrpocUserID,sethrpocUserID] = useState([]);
  const [activeUserData,setActiveUserData] = useState([]);
  const[showHRPOCDetailsToTalents,setshowHRPOCDetailsToTalents] = useState(null);

  const [isCompensationOptionOpen, setisCompensationOptionOpen] = useState(false);
  const [CompensationValues, setCompensationValues] = useState([]);
  const [isIndustryCandidatesOpen, setisIndustryCandidatesOpen] = useState(false);
  const [specificIndustry, setSpecificIndustry] = useState([]);
  const [isCandidatePeopleOpen, setisCandidatePeopleOpen] = useState(false);
  const [isPrerequisites, setIsPrerequisites] = useState(false);
  const [hasPeopleManagementExp, setHasPeopleManagementExp] = useState(null);
  const [prerequisites, setPrerequisites] = useState(null);


  const [isCompanyNameChange, setIsCompanyNameChange] = useState(false);
  const [companyNameChangeValue, setIsCompanyNameChangeValue] = useState('');
  const [companyURLChangeValue, setIsCompanyURLChangeValue] = useState('');

  const [isCompanyFoundedOpen, setisCompanyFoundedOpen] = useState(false);
  const [companyFoundedValue, setCompanyFoundedValue] = useState('');

  const [iseditCompanySize, setisEditCompanySize] = useState(false);
  const [editCompanySizeValue, setEditCompanySizeValue] = useState('');

  const [isCompanyIndustryOpen, setisCompanyIndustryOpen] = useState(false);
  const [companyIndustryValue, setCompanyIndustryValue] = useState('');

  const [iseditCompanyLocation, setisEditCompanyLocation] = useState(false);
  const [editCompanyLocationValue, setEditCompanyLocationValue] = useState('');

  const [isAboutCompany, setisAboutCompany] = useState(false);
  const [aboutCompanyValue, setAboutCompanyValue] = useState('');

  const [isFundingDetails, setIsFundingDetails] = useState(false);
  const [fundingData, setFundingData] = useState([]);

  const [isCompanyLinkedIn, setIsCompanyLinkedIn] = useState(false);
  const [companyLinkedInValue, setCompanyLinkedInValue] = useState('');

  const [isCulture, setIsCulture] = useState(false);
  const [culture, setCulture] = useState("");
  const [isCompanyBenefits, setIsCompanyBenefits] = useState(false);
  const [perkDetailsValue, setPerkDetailsValue] = useState([]);
  const [basicDetails, setBasicDetails] = useState();
  const [fundingDetails, setFundingDetails] = useState([]);
  const [cultureDetails, setCultureDetails] = useState([]);
  const [perkDetails, setPerkDetails] = useState([]);
  const [youTubeDetails, setYouTubeDetails] = useState([]);
  const [youTubeValue, setYoutubeValue] = useState();
  const [totalFundingDetails, setTotalFundingDetails] = useState();
  const [showAllInvestors, setShowAllInvestors] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(basicDetails?.companyLogo);
  const [estimatedFromSalaryBudget, setFromEstimatedBudget] = useState(0);
  const [estimatedToSalaryBudget, setToEstimatedBudget] = useState(0);
  const [calculatedUplersFees, setCalculateUplersFees] = useState({
    from: "", to: ""
  })
  const [uplersFees, setUplersFees] = useState(0);

  let details = fundingDetails && fundingDetails[0] ? fundingDetails[0] : {};
  let allInvestors = details?.allInvestors ? details?.allInvestors?.split(",") : [];
  let displayedInvestors = showAllInvestors ? allInvestors : allInvestors.slice(0, 4);

  const [countryCodeData,setCountryCodeData] = useState("in");
  const[hrpocUserDetails,sethrpocUserDetails] = useState([]);
  const [allUserData,setAllUserData] = useState([]);
  const [isContactEdit,setIsContactEdit] = useState(false);
  const [pocDetails,setPOCDetails] = useState({
    pocId:"",
    contactNo:"",
    guid:"",
    showContactNumberToTalent:null,
    isEdit:null
  });

  const [transparentEngType,setTransparentEngType] = useState([])
  // const dispatch = useDispatch();

  useEffect(() => {
    if(hrIdforPreview){
      //  getRolesCurrencyList();
    // getSkillList();
    // getTimeZoneValues();
    // getStartEndTimeData();
    // GetPayrollType();
    getPOCUsers();
    // getJobType();
    // getFrequencyData(); 
    // getLocationInfo();
    // getPostPreview({
    //   contactId:_user.LoggedInUserID,
    //   guid:_guid
    // });
    getCompanyPerksDetails();
    // fetchCities();
    }
  }, [hrIdforPreview]);

  useEffect(()=>{
    if(jobPreview?.isTransparentPricing === true){
      setTransparentEngType([])
    }else{
      getTransparentEngType(hrIdforPreview)
    }
  },[hrIdforPreview,jobPreview])
  
  const getCompanyPerksDetails = async () => {
    // let res = await getCompanyPerks();
    // setCompanyPerks(res?.responseBody?.details)
  }

  useEffect(() => {
    setPreviewLogo(allData?.CompanyDetails?.basicDetails?.companyLogo);
    setBasicDetails(allData?.CompanyDetails?.basicDetails ? allData?.CompanyDetails?.basicDetails : []);
    setFundingDetails(allData?.CompanyDetails?.fundingDetails ? allData?.CompanyDetails?.fundingDetails : []);
    setCultureDetails(allData?.CompanyDetails?.cultureDetails ? allData?.CompanyDetails?.cultureDetails : []);
    setPerkDetails(allData?.CompanyDetails?.perkDetails ? allData?.CompanyDetails?.perkDetails : []);
    setYouTubeDetails(allData?.CompanyDetails?.youTubeDetails ? allData?.CompanyDetails?.youTubeDetails : []);

  }, [allData]);
  const toolbarOptions = [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link'],
    [{ 'align': [] }],
    ['clean']
  ];

  const modules = {
    toolbar: toolbarOptions,
  };
  let TrackData = {
    trackingDetails: trackingDetailsAPI()
  };

  const CalculateEstimatedUplersFees = (fromSalaryBudget, toSalaryBudget) => {
    let fromBudget = 0;
    let toBudget = 0;
    let newFromBudget = 0;
    let newToBudget = 0;
    let calculatedToBudget = 0;
    let calculateFromBudget = 0;

    if (getcompanyID === 1) {
      if (jobPreview?.hiringTypePricingId === 1 || jobPreview?.hiringTypePricingId === 2) {
        let fees = 35;
        setUplersFees(fees);

        let _calVal = { ...calculatedUplersFees };
        if (fromSalaryBudget || fromBudget === 0) {
          fromBudget = (fromSalaryBudget || fromBudget === 0) ? fromSalaryBudget : estimatedFromSalaryBudget;
          newFromBudget = (fromBudget * 100 / (100 + fees)).toFixed(0);
          setFromEstimatedBudget(newFromBudget);
          calculateFromBudget = Number(fromBudget) - Number(newFromBudget);
          _calVal.from = calculateFromBudget;
        }
        if (toSalaryBudget) {
          toBudget = toSalaryBudget ? toSalaryBudget : estimatedToSalaryBudget;
          newToBudget = (toBudget * 100 / (100 + fees)).toFixed(0);
          setToEstimatedBudget(newToBudget);
          calculatedToBudget = Number(toBudget) - Number(newToBudget);
          _calVal.to = calculatedToBudget;
        }
        setCalculateUplersFees(_calVal);
      }
      else {
        let fees = TrackData?.trackingDetails?.country == "IN" ? 7.5 : 10;
        setUplersFees(fees);
        if (fromSalaryBudget) {
          fromBudget = (fromSalaryBudget ? fromSalaryBudget : estimatedFromSalaryBudget);
          let percentValuesFromBudget = (((fromBudget) * fees) / 100);
          setFromEstimatedBudget(percentValuesFromBudget);
        }
        if (toSalaryBudget) {
          toBudget = (toSalaryBudget ? toSalaryBudget : estimatedToSalaryBudget);
          let percentValuesToBudget = (((toBudget) * fees) / 100);
          setToEstimatedBudget(percentValuesToBudget);
        }
      }
    }
  }
  const updateCompanyDetails = async (name, value, closeState, resetValState) => {
    setIsLoading(true);
    let linkedinRegex = /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile|company)\/[A-z0-9_-]+\/?/i;
    let payload;

    if (name === "companyName") {
      payload = {
        IsUpdateFromPreviewPage:true,
        "basicDetails": {
          "companyID": previewIDs?.companyID,
          [name]: value,
          "website": companyURLChangeValue ? companyURLChangeValue : basicDetails?.website
        }
      };
    } else if (name === 'linkedInProfile') {
      if (value && !linkedinRegex.test(value)) {
        message.error("Please enter valid linkedin URL");
        return;
      }
      payload = {
        IsUpdateFromPreviewPage:true,
        "basicDetails": {
          "companyID": previewIDs?.companyID,
          "linkedInProfile": value ? value : basicDetails?.linkedInProfile
        }
      };
    } else if (name === "culture") {
      payload = {
        IsUpdateFromPreviewPage:true,
        "basicDetails": {
          "companyID": previewIDs?.companyID,
          [name]: value,
        },
        "cultureDetails": cultureDetails,
        "youTubeDetails": youTubeDetails
      };
    } else if (name === "teamSize") {
      payload = {
        IsUpdateFromPreviewPage:true,
        "basicDetails": {
          "companyID": previewIDs?.companyID,
          [name]: value?.toString(),
          "companySize": value
        }
      };
    } else if (name === "fundingDetails") {
      let _objVal = {
        fundingID: value[0]?.fundingId ? value[0]?.fundingId : null,
        month: value[0]?.fundingMonth?.toString(),
        year: value[0]?.fundingYear?.toString(),
        fundingAmount: value[0]?.fundingAmount,
        fundingRound: value[0]?.fundingRound,
        series: value[0]?.series,
        investors: value[0]?.investors,
        additionalInformation: value[0]?.additionalInformation
      };
      payload = {
        IsUpdateFromPreviewPage:true,
        "basicDetails": {
          "companyID": previewIDs?.companyID,
          "isSelfFunded": basicDetails?.isSelfFunded,
        },
        "fundingDetails": [_objVal],
      };
    } else {
      payload = {
        IsUpdateFromPreviewPage:true,
        "basicDetails": {
          "companyID": previewIDs?.companyID,
          [name]: value?.toString()
        }
      };
    }

    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    if (res.statusCode === 200) {
      messageApi.open({
        type: "success",
        content: `${name} updated`,
      });

      if (name == 'aboutCompanyDesc') {
        setBasicDetails({ ...basicDetails, ['aboutCompany']: value });
      } else if (name === "companyName") {
        setBasicDetails({ ...basicDetails, [name]: value, "website": companyURLChangeValue ? companyURLChangeValue : basicDetails?.website });
      } else if (name === 'industry') {
        setBasicDetails({ ...basicDetails, ['companyIndustry']: value });
      } else {
        setBasicDetails({ ...basicDetails, [name]: value });
      }
      closeState(false);
      if (name === "fundingDetails") {
        resetValState([]);
        setFundingDetails(value);
        if (!basicDetails?.isSelfFunded) {
          details = value[0] ? value[0] : null;
          allInvestors = details?.investors ? details?.investors?.split(",") : [];
          displayedInvestors = showAllInvestors ? allInvestors : allInvestors.slice(0, 4);
        }

      } else {
        resetValState('');
      }
    }
    setIsLoading(false);
  };

  const updateCompensationOptions = async () => {
    if (CompensationValues) {
      setIsLoading(true);
      let update = await updateJobPostDetail({ "compensationOption": CompensationValues?.join('^') });
      setIsLoading(false);
      if (update.statusCode === 200) {
        messageApi.open({
          type: "success",
          content: "Compensation Beyond Salary updated",
        });
        setJobPreview(prev => ({ ...prev, compensationOption: CompensationValues?.join('^') }));
        let data = { ...jobPreview };
        data.compensationOption = CompensationValues?.join('^');
        // dispatch({ type: 'FILL_STEPS_DATA', payload: data });
        setisCompensationOptionOpen(false);
      }
    }
  }
  const updateIndustry = async () => {
    if (specificIndustry) {
      setIsLoading(true);
      let update = await updateJobPostDetail({ "industryType": specificIndustry?.join('^') });
      setIsLoading(false);
      if (update.statusCode === 200) {
        messageApi.open({
          type: "success",
          content: "Industry type updated",
        });
        setJobPreview(prev => ({ ...prev, industryType: specificIndustry?.join('^') }));
        let data = { ...jobPreview };
        data.industryType = specificIndustry?.join('^');
        // dispatch({ type: 'FILL_STEPS_DATA', payload: data });
        setisIndustryCandidatesOpen(false);
      }
    }
  }
  const updateCandidateManagement = async () => {
    setIsLoading(true);
    let update = await updateJobPostDetail({ "hasPeopleManagementExp": hasPeopleManagementExp });
    setIsLoading(false);
    if (update.statusCode === 200) {
      messageApi.open({
        type: "success",
        content: "Candidate with people management experience updated",
      });
      setJobPreview(prev => ({ ...prev, hasPeopleManagementExp: hasPeopleManagementExp }));
      let data = { ...jobPreview };
      data.hasPeopleManagementExp = hasPeopleManagementExp;
      // dispatch({ type: 'FILL_STEPS_DATA', payload: data });
      setisCandidatePeopleOpen(false);
    }
  }

  const updatePrerequisites = async () => {
    setIsLoading(true);
    let update = await updateJobPostDetail({ "prerequisites": prerequisites });
    setIsLoading(false);
    if (update.statusCode === 200) {
      messageApi.open({
        type: "success",
        content: "Prerequisites or key highlights updated",
      });
      setJobPreview(prev => ({ ...prev, prerequisites: prerequisites }));
      let data = { ...jobPreview };
      data.prerequisites = prerequisites;
      // dispatch({ type: 'FILL_STEPS_DATA', payload: data });
      setIsPrerequisites(false);
    }
  }

  const updateRoleName = async () => {
    let valid = true;
    let _errors = { ...error };
    if (!editRoleName) {
      _errors.editRoleName = `Please enter rolename.`;
      valid = false;
    }
    setError(_errors);

    if (valid) {

      setIsLoading(true)
      let update = await updateJobPostDetail({ roleName: editRoleName });
      if (update.statusCode === 200) {
        messageApi.open({
          type: "success",
          content: "Role Updated",
        });
        setIsAutogenerateQuestions(true);
        setJobPreview((prev) => ({ ...prev, roleName: editRoleName }));
        setiseditRoleName(false);
        setError({});
      }
      setIsLoading(false)
    }
  };

  const topskillexistsError = () => {
    setTopSkillAddedError(true);
    setTimeout(() => setTopSkillAddedError(false), 5000);
  };

  const goodTohaveskillexistsError = () => {
    setGoodToHaveSkillAddedError(true);
    setTimeout(() => setGoodToHaveSkillAddedError(false), 5000);
  };

  const goodtoHaveSkillSelect = (values) => {

    values = [...new Set(values.map(skill => formatSkill(skill?.trim())))];
    let existInOther = false;
    values.forEach((skill) => {
      if (editTopSkills?.map(val => val.toLowerCase()).includes(skill.toLowerCase())) {
        setEditTopSkills(prev => prev.filter(item => item.toLowerCase() !== skill.toLowerCase()));
      }
    });

    setEditSkills(values);

  };

  const handleTopSkillsInputKeyDown = (e) => {
    if (selectTopRef.current && e.key === "Enter") {
      selectTopRef.current.blur();
    }
  };

  const topSkillSelect = (values) => {
    values = [...new Set(values.map(skill => formatSkill(skill?.trim())))];
    let existInOther = false;
    values.forEach((skill) => {
      if (editskills?.map(val => val.toLowerCase()).includes(skill.toLowerCase())) {
        setEditSkills(prev => prev.filter(item => formatSkill(item.toLowerCase()) !== formatSkill(skill.toLowerCase())));
      }
    });
    let _topskills = [...topSkills];
    values?.forEach(skill => {
      if (!_topskills?.some(option => option.value.toLowerCase() === formatSkill(skill.toLowerCase()))) {
        let index = _topskills?.findIndex((skillVal) => skillVal?.value.toLowerCase() === skill.toLowerCase());
        if (index === -1) {
          _topskills.push({ value: formatSkill(skill?.trim()), label: <><AiFillStar /> {formatSkill(skill)}</> });
        } else {
          let _obj = {
            value: formatSkill(skill?.trim()),
            label: <><AiFillStar /> {formatSkill(skill)}</>
          }
          _topskills[index] = _obj;
        }
      }
    });
    if(values.length > 8){
      message.error('More then 8 skills not allowed')
      return
    }
    setTopSkills(_topskills);
    setEditTopSkills(values);
    // editskills.forEach((skill) => {
    //   if (values?.map(val => val.toLowerCase()).includes(skill.toLowerCase().trim())) {
    //     existInOther = true;
    //   }
    // });
    // if (existInOther) {
    //   topskillexistsError();
    // } else {
    //   setEditTopSkills(values);
    // }
  };

  const updateSkills = async () => {
    let isValid = true;
    setskillsErrors(false);

    if (editTopSkills?.length === 0) {
      isValid = false;
      setskillsErrors(true);
    }
    if (isValid) {

      setIsLoading(true);
      const normalize = (skills) => skills.map(skill => skill.trim().toLowerCase());
      const arrayEquals = (a, b) => {
        if (a.length !== b.length) return false;
        let aSet = new Set(a);
        let bSet = new Set(b);
        for (let item of aSet) {
          if (!bSet.has(item)) return false;
        }
        return true;
      };

      const currentSkills = jobPreview?.skills ? normalize(jobPreview.skills.split(",")) : [];
      const currentAllSkills = jobPreview?.allSkills ? normalize(jobPreview.allSkills.split(",")) : [];

      const normalizedEditTopSkills = normalize(editTopSkills);
      const normalizedEditskills = normalize(editskills);
      const areMustHaveSkillsChanged = !arrayEquals(currentSkills, normalizedEditTopSkills);
      const areGoodToHaveSkillsChanged = !arrayEquals(currentAllSkills, normalizedEditskills);

      let payload = {
        skills: editTopSkills?.join(","),
        allSkills: editskills?.join(","),
        IsGoodToHaveSkillschanged: areGoodToHaveSkillsChanged,
        IsMustHaveSkillschanged: areMustHaveSkillsChanged
      };

      let result = await updateJobPostDetail(payload);
      if (result.statusCode === 200) {
        messageApi.open({
          type: "success",
          content: "Skills Updated",
        });
        setIsAutogenerateQuestions(true);
        setJobPreview((prev) => ({
          ...prev,
          ...{
            skills: editTopSkills.join(","),
            allSkills: editskills.join(","),
          },
        }));
        setisEditSkills(false);
      }
      setIsLoading(false)
    }
  };
  const addAMPMFormat = (time) => {
    const [hours, minutes] = time.split(':');
    let formattedHours = parseInt(hours, 10);
    // const suffix = formattedHours >= 12 ? 'PM' : 'AM';
    formattedHours = formattedHours % 12 || 12;
    const formattedMinutes = minutes.padStart(2, '0');
    // return `${formattedHours}:${formattedMinutes} ${suffix}`;
    return `${formattedHours}:${formattedMinutes}`;
  };
  const editSkills = () => {
    // setisEditSkills(true);
    // setEditTopSkills([...new Set(jobPreview?.skills?.split(","))]);
    // if(jobPreview?.allSkills){      
    //   setEditSkills([...new Set(jobPreview?.allSkills?.split(",").filter(skill => skill.trim()))]);
    // }else{
    //   setEditSkills([]);
    // }
getSkillList();
    setisEditSkills(true);
    let _topskills = [...topSkills];
    let _skills = [...new Set(jobPreview?.skills?.split(",").filter(skill => skill.trim()))];
    _skills?.forEach(skill => {
      if (!_topskills?.some(option => option.value.toLowerCase() === skill.toLowerCase())) {
        _topskills.push({ value: skill, label: <><AiFillStar /> {formatSkill(skill)}</> });
      }
    });
    setTopSkills(_topskills);
    setEditTopSkills(_skills);
    if (jobPreview?.allSkills) {
      setEditSkills([...new Set(jobPreview?.allSkills?.split(",").filter(skill => skill.trim()))]);
    } else {
      setEditSkills([]);
    }
  };

  const updateJobPostDetail = async (obj) => {
    let TrackData = {
      trackingDetails: trackingDetailsAPI()
    };
    let payload = {
      HRID: hrIdforPreview,
      roleName: null,
      experienceYears: null,
      noOfTalents: null,
      isHiringLimited: null,
      availability: null,
      contractDuration: null,
      skills: null,
      allSkills: null,
      currency: null,
      currencySign: null,
      budgetFrom: null,
      budgetTo: null,
      employmentType: null,
      howSoon: null,
      workingModeID: null,
      companyLocation: null,
      achievementID: null,
      timezone_Preference_ID: null,
      timeZoneId: null,
      timeZone_FromTime: null,
      timeZone_EndTime: null,
      isHrTypeDP: null,
      reason: null,
      timeZone: null,
      region: null,
      rolesResponsibilities: null,
      requirements: null,
      roleOverviewDescription: null,
      whatweoffer: null,
      jdFileName: null,
      currentStepId: null,
      nextStepId: null,
      processType: null,
      isT_TimeZone_FromTime: null,
      isT_TimeZone_EndTime: null,
      city: null,
      state: null,
      postalCode: null,
      country: null,
      countryID: null,
      budgetType: null,
      gptJdId: null,
      ipAddress: null,
      hiringTypePricingId: null,
      payrollTypeId: null,
      payrollPartnerName: null,
      jobDescription: null,
      isConfidentialBudget: null,
      jobTypeID:null,
      utmCountry: TrackData?.trackingDetails?.country,
      // utmState:ipData.utmState,
      // utmCity:ipData.utmCity,
      // utmBrowser:navigator.userAgent,
      // utmDevice:window.navigator.platform,
      // ipAddress:ipData.clientIPAddress,
      guid: jobPreview?.guid ? jobPreview?.guid : hrIdforPreview.toString(),
    };

    Object.keys(obj).forEach((key) => {
      payload[key] = obj[key];
    });

    let result = await allCompanyRequestDAO.updateHrPreviewDetailsDAO(payload);
    setIsAnyFieldUpdate(true);
    setIsSaveAllChanges(false);
    return result;
  };

  const updateRolesAndRes = async () => {
    if (editRolesAndRes == "<p><br></p>" || !editRolesAndRes) return;
    if (editRolesAndRes) {

      setIsLoading(true);
      let update = await updateJobPostDetail({
        rolesResponsibilities: editRolesAndRes,
      });

      if (update.statusCode === 200) {
        messageApi.open({
          type: "success",
          content: "Roles and Responsibilities Updated",
        });

        setJobPreview((prev) => ({
          ...prev,
          ...{
            rolesResponsibilities: editRolesAndRes,
          },
        }));
        setisEditRolesAndRes(false);
      }
      setIsLoading(false);

    }
  };
  const startYear = 1900;
  const endYear = new Date().getFullYear();

  const generateYears = (startYear, endYear) => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years?.reverse();
  };

  const yearOptions = generateYears(startYear, endYear)?.map((year) => ({
    label: year.toString(),
    value: year,
  }));
  const toggleInvestors = () => {
    setShowAllInvestors((prev) => !prev);
  };
  const updateRequirenments = async () => {
    if (editRequirenments == "<p><br></p>" || !editRequirenments) return;
    if (editRequirenments) {
      setIsLoading(true)
      let update = await updateJobPostDetail({
        requirements: editRequirenments,
      });

      if (update.statusCode === 200) {
        messageApi.open({
          type: "success",
          content: "Project requirements Updated",
        });
        setJobPreview((prev) => ({
          ...prev,
          ...{
            requirements: editRequirenments,
          },
        }));
        setisEditRequirenments(false);
      }
      setIsLoading(false)
    }
  };

  const updateRoleOverView = async () => {

    if (editRoleOverview == '<p><br></p>' || !editRoleOverview) return
    if (editRoleOverview) {
      let update = await updateJobPostDetail({ "roleOverviewDescription": editRoleOverview });

      if (update.statusCode === 200) {
        messageApi.open({
          type: "success",
          content: "Role Over View Updated",
        });
        setJobPreview(prev => ({ ...prev, roleOverviewDescription: editRoleOverview }))
        setisEditroleOverview(false);
      }
    }
  };
  const updateWhatWeOffer = async () => {
    if (editWhatWeOffer == '<p><br></p>' || !editWhatWeOffer) return
    if (editWhatWeOffer) {
      setIsLoading(true);
      let update = await updateJobPostDetail({ "jobDescription": editWhatWeOffer });

      if (update.statusCode === 200) {
        messageApi.open({
          type: "success",
          content: "job Description Updated",
        });
        setIsAutogenerateQuestions(true);
        setJobPreview(prev => ({ ...prev, whatweoffer: editWhatWeOffer }))
        setisEditWhatWeoffer(false);
      }
      setIsLoading(false);
    }
  };

  const checkBudgetValue = async (value) => {
    const response = await fetch(`https://open.er-api.com/v6/latest/USD`);
    const data = await response?.json();
    const rate = data?.rates[value];

    let _budgetVal = { ...editBudget };
    _budgetVal.budgetFrom = convertCurrency(_budgetVal.currency, value, _budgetVal.budgetFrom, data?.rates);
    _budgetVal.budgetTo = convertCurrency(_budgetVal.currency, value, _budgetVal.budgetTo, data?.rates);
    setEditBudget(_budgetVal);
    CalculateEstimatedUplersFees(_budgetVal.budgetFrom, _budgetVal.budgetTo);

    if (rate !== null) {
      const converted = (2000 * rate).toFixed(2);
      return converted;
    }
  };

  const updateBudget = async () => {
    let valid = true;
    let _errors = { ...error };
    if (editBudget?.budgetType !== 2 && editBudget?.budgetType !== 1) {
      _errors.budgetType = "Please select budget type";
      valid = false;
    }
    if (
      (editBudget?.budgetType === 2 || editBudget?.budgetType === 1) &&
      !editBudget?.budgetFrom
    ) {
      _errors.budgetFrom = `Minimum budget should be atleast ${editBudget.convertedFromValue} ${editBudget?.currency}.`;
      valid = false;
    }
    if (
      (editBudget?.budgetType === 2 || editBudget?.budgetType === 1) &&
      !editBudget?.currency
    ) {
      _errors.currency = "Please select currency";
      valid = false;
    }
    if (editBudget?.budgetType === 2 && !editBudget?.budgetTo) {
      _errors.budgetTo = "Please enter valid budget";
      valid = false;
    }
    if (editBudget.budgetType === 2) {
      if (
        editBudget.budgetTo <= 0 ||
        parseInt(editBudget.budgetFrom) > parseInt(editBudget.budgetTo)
      ) {
        _errors.budgetTo =
          "Please enter valid budget. The minimum budget should not exceed the maximum budget value.";
        valid = false;
      }
    }


    if(!isFreshersAllowed && editBudget?.employmentType?.toLocaleLowerCase() !== 'part time'){
      if(editBudget.currency === 'INR'){
        if(Number(editBudget?.budgetFrom) < 100000){
           _errors.budgetFrom = "Minimum valid value should be 6 digits."
        valid = false;
        }
       
      }else{
        if(Number(editBudget?.budgetFrom) < 1000){
          _errors.budgetFrom = "Minimum valid value should be 4 digits."
          valid = false;
       }
      }
    }


    setError(_errors);

    if (valid) {

      let payload = {
        currency: editBudget.budgetType === 3 ? null : editBudget.currency ? editBudget.currency : null,
        budgetFrom: editBudget.budgetType === 2 || editBudget.budgetType === 1 ? editBudget.budgetFrom ? editBudget.budgetFrom : null : null,
        budgetTo: editBudget.budgetType === 2 ? editBudget.budgetTo ? editBudget.budgetTo : null : null,
        noBudgetBar: editBudget.budgetType === 3 ? true : false,
        budgetType: editBudget.budgetType ? editBudget.budgetType : null,
        isConfidentialBudget: editBudget?.isConfidentialBudget
      };
      setIsLoading(true)
      let result = await updateJobPostDetail(payload);
      // console.log('res for budget', result);
      if (result?.statusCode === 200) {
        setisEditBudget(false);
        messageApi.open({
          type: "success",
          content: "Budget Updated",
        });

        setJobPreview((prev) => ({
          ...prev,
          ...{
            currencySign: getSymbolFromCurrency(editBudget.currency),
            currency: editBudget.currency,
            budgetFrom: result?.responseBody?.budgetFrom,
            budgetFromStr: result?.responseBody?.budgetFromStr,
            hrCost: result?.responseBody?.hrCost,
            budgetToStr: result?.responseBody?.budgetToStr,
            budgetTo: result?.responseBody?.budgetTo,
            budgetType: editBudget?.budgetType,
            noBudgetBar: editBudget.budgetType === 3 ? true : false,
            isConfidentialBudget: editBudget?.isConfidentialBudget,
            toolTipMessage: result?.responseBody?.toolTipMessage ? result?.responseBody?.toolTipMessage : editDuration?.toolTipMessage

          },
        }));
        setError({});
      }
      setIsLoading(false)

    }
  };

  const  updatePOCContact = async ()=>{
    if(pocDetails?.contactNo){
      const regex = /^[6-9]\d{9}$/;
    if (!regex.test(pocDetails?.contactNo)) {      
      return message.error('Invalid phone number. Must be 10 digits and start with 6-9.');
    }
      setIsLoading(true);   
      let payload = {
        contactNo:pocDetails?.contactNo,
        contactID:pocDetails?.pocId,
        hrid:previewIDs?.hrID ,          
        // guid:pocDetails?.guid,
        showEmailToTalent:null,
        showContactNumberToTalent: pocDetails?.showContactNumberToTalent         
      }   
    const result =  await MasterDAO.updatePocContactDAO(payload);
    if (result.statusCode === 200) {
      messageApi.open({
          type: "success",
          content: "POC details updated",
      });  
      setIsContactEdit(false);
      setPOCDetails({
        pocId:"",
        contactNo:"",
        guid:"",
        isEdit:null
      });          
      // setJobPreview((prev) => ({...prev,  
      //   hrpocUserID:result?.responseBody?.details
      // }));
      let oldPOCS = jobPreview?.hrpocUserID
      let index = oldPOCS.findIndex(val => val.hrwiseContactId ===   pocDetails?.pocId )
  
      oldPOCS[index] = {...oldPOCS[index], contactNo: pocDetails?.contactNo ,showContactNumberToTalent: pocDetails?.showContactNumberToTalent  }
  
      setJobPreview((prev) => ({...prev,  
        hrpocUserID:oldPOCS
      })); 
      sethrpocUserDetails(prev => {    
        prev[index] = {
          contactNo: oldPOCS[index].contactNo ,
          email: oldPOCS[index].emailID ,
          fullName: oldPOCS[index].fullName   , 
          pocUserID: oldPOCS[index].hrwiseContactId ,
          showContactNumberToTalent:  oldPOCS[index].showContactNumberToTalent,
          showEmailToTalent  :oldPOCS[index].showEmailToTalent }
        return prev
      });
    }
    setIsLoading(false);
    }else{
      message.error(`Please provide valid phone number`);
    }
    
  }

  const updateDuration = async () => {
    let isValid = true;
    setError({});

    if (editDuration?.hiringTypePricingId == 3 && !editDuration.payrollTypeId) {
      message.error(`Please select payrollType`);
      return
    }
    if ((editDuration?.hiringTypePricingId == 1 || editDuration?.hiringTypePricingId == 2) && !editDuration.contractDuration) {
      if(editDuration?.employmentType !== "Permanent"){
         message.error(`Please select contract duration`);
      return
      }
     
    }else if(getcompanyID === 2 && (editDuration?.jobTypeID !== 1) && !editDuration?.contractDuration){
      message.error(`Please select contract duration`);
      return
    } 
    
    if (editDuration?.hiringTypePricingId == 3 && editDuration.payrollTypeId == 4 && !editDuration.contractDuration) {
      message.error(`Please select contract duration`);
      return
    }

    if (editDuration?.hiringTypePricingId == 3 && editDuration.payrollTypeId == 3 && !editDuration.payrollPartnerName) {
      message.error("Please enter Partner's name");
      return
    }

    if (isValid) {
      let payload = {};
      if(getcompanyID === 2){
        payload = {
          contractDuration:(editDuration?.jobTypeID !== 1) ?  editDuration.contractDuration : null,
          employmentType: editDuration.employmentType ? editDuration.employmentType : null ,
          hiringTypePricingId:editDuration.hiringTypePricingId,
          payrollTypeId:editDuration.payrollTypeId,
          payrollType:editDuration.payrollType,
          payrollPartnerName:editDuration.payrollPartnerName,   
          jobTypeID:editDuration?.jobTypeID,   
          isHiringLimited:editDuration.isHiringLimited ? editDuration.isHiringLimited : null,    
        };                    
      }else{
        payload = {
          contractDuration: editDuration.contractDuration ? editDuration.contractDuration : null,
          employmentType: editDuration.employmentType,
          hiringTypePricingId:editDuration.hiringTypePricingId,
          payrollTypeId:editDuration.payrollTypeId,
          payrollType:editDuration.payrollType,
          jobTypeID:0, 
          payrollPartnerName:editDuration.payrollPartnerName,        
        };  
      }       
      setIsLoading(true);
      let result = await updateJobPostDetail(payload);
      if (result.statusCode === 200) {
        setisEditDuration(false);
        messageApi.open({
          type: "success",
          content: "Duration Updated",
        });
        setJobPreview((prev) => ({
          ...prev,
          ...{
            contractDuration: editDuration.contractDuration ? editDuration.contractDuration : null,
            employmentType: editDuration.employmentType ? editDuration.employmentType : null,
            isHiringLimited:editDuration.isHiringLimited ? editDuration.isHiringLimited : null,
            hiringTypePricingId: editDuration.hiringTypePricingId,
            // payrollTypeId: editDuration.payrollTypeId,
            // payrollType: editDuration.payrollType,
            // payrollPartnerName: editDuration.payrollPartnerName,
            toolTipMessage: result?.responseBody?.toolTipMessage ?  result?.responseBody?.toolTipMessage : editDuration?.toolTipMessage,
            // hrCost : result?.responseBody?.details?.hrCost,
            // budgetFrom : result?.responseBody?.details?.budgetFrom,
            // budgetTo : result?.responseBody?.details?.budgetTo,
            jobTypeID:result?.responseBody?.jobTypeID,
            availability:result?.responseBody?.availability
          },
        }));
        setIsLoading(false);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const acceptedTypes = ["image/jpeg", "image/png"];
    if (!acceptedTypes.includes(file.type)) {
      message.info(
        "Please select a valid image file (JPEG or PNG)."
      );
      return;
    }

    if (file.size > 1024 * 1024) {
      message.info("Please select image up to 1 MB");
      return;
    }

    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = async () => {
      const reader = new FileReader();
      const loadEndPromise = new Promise(
        (resolve, reject) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = (error) => {
            reject(error);
          };
        }
      );

      reader.readAsDataURL(file);
      try {
        setIsLoading(true);
        const result = await loadEndPromise;
        setIsLoading(false);
        let payload = {
          IsUpdateFromPreviewPage:true,
          "basicDetails": {
            "companyID": previewIDs?.companyID,
            "companyLogo": file.name,
          }
        }
        setIsLoading(true);
       
        let filesToUpload = new FormData();
        filesToUpload.append("Files", file);
        filesToUpload.append("IsCompanyLogo", true);
        filesToUpload.append("IsCultureImage", false);

        let res = await allCompanyRequestDAO.uploadImageDAO(filesToUpload);
        setIsLoading(false);
        if (res.statusCode === 200) {
          // messageApi.open({
          //   type: "success",
          //   content: `Logo updated`,
          // });
          message.success(`Logo updated`)
          let imgUrls = res?.responseBody;
          // setBasicDetails({
          //   ...basicDetails,
          //   companyLogo: result,
          // });
          setBasicDetails({
            ...basicDetails,
            companyLogo: imgUrls[0],
          });
          //to update comp info in BE
           allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
          let data = { ...jobPreview };
          data['companyLogo'] = result;
          // dispatch({ type: 'FILL_STEPS_DATA', payload: data });
          let _userData = JSON.parse(localStorage.getItem('user'));
          _userData.LoggedInUserProfilePic = result;
          localStorage.setItem("user", JSON.stringify(_userData));
          // dispatch({ type: 'FETCH_USER_DATA', payload: _userData });
          setPreviewLogo('');
        }

      } catch (error) {
        console.error("Error reading the file:", error);
        // Handle error
      }
    };
    image.onerror = (error) => {
      console.error("Error loading the image:", error);
      // Handle error
    };
  }

  const updateNoticePeriod = async () => {
    setIsLoading(true)
    let payload = { howsoon: editNoticePeriod?.howsoon };
    let result = await updateJobPostDetail(payload);

    if (result.statusCode === 200) {
      setisEditNoticePeriod(false);
      messageApi.open({
        type: "success",
        content: "Notice Period Updated",
      });


      setJobPreview((prev) => ({
        ...prev,
        ...{
          howSoon: editNoticePeriod?.howsoon,
        },
      }));
    }
    setIsLoading(false)
  };

  const getSkillList = async () => {

    // let skillresult = await getSkills(localStorage.getItem("roleId"));
    let skillresult = await MasterDAO.getSkillsRequestDAO();
    // console.log("skillresult: ", skillresult)

    if (skillresult.statusCode === 200) {
      const uniqueValues = new Set();
      setSkills(
        skillresult.responseBody
          .filter((skill) => !uniqueValues.has(skill.value) && uniqueValues.add(skill.value))
          .map((skill) => ({
            value: skill.value,
            label: skill.value,
          }))
      );
      // setSkills(
      //   skillresult.responseBody.details.map((skill) => ({
      //     value: skill.value,
      //     label: skill.value,
      //   }))
      // );
      setTopSkills(
        skillresult.responseBody.map((item) => ({
          value: item.value,
          label: (
            <>
              <img src={selectStarFillImage} alt="star" /> {item.value}
            </>
          ),
        }))
      );
    }
  };

  const getTimeZoneValues = async () => {
    let response = await MasterDAO.getTimeZoneRequestDAO();
    let _list = [];

    if (response?.responseBody) {
      for (let val of response?.responseBody) {
        let obj = {};
        obj.label = val.value;
        obj.value = val.id;
        _list.push(obj);
      }
      setTimeZone(_list);
    }
  };

  const getStartEndTimeData = async () => {
    let response = await MasterDAO.getStartEndTimeDAO();
    let _list = [];
    for (let val of response?.responseBody) {
      let obj = {};
      obj.label = val.text;
      obj.value = val.value;
      _list.push(obj);
    }
    setStartEndTime(_list);
  };

  const getFrequencyData = async () => {
    let response = await  MasterDAO.getFrequencyDAO();    
    setFrequencyData(response?.responseBody?.details?.map((fre) => ({
      value: fre.id,
      label: fre.frequency,                
  })))
  }

  const getJobType = async () => {
    let response = await  MasterDAO.getJobTypesRequestDAO();        
    setJobTypes(response?.responseBody);
  } 

  const getTransparentEngType = async (ID) => {
    let response = await  MasterDAO.getEngTypesRequestDAO(ID);     
    setTransparentEngType(response?.responseBody?.map(item=> ( { value: item.id, label: item.type})));
  } 

  const getPOCUsers = async () => {              
    let response = await MasterDAO.getEmailSuggestionDAO('',previewIDs?.companyID);   
    setActiveUserData([...response?.responseBody?.details?.map((item)=>({
      value : item?.contactId,
      label : item?.contactName
    }))]);
    setAllUserData(response?.responseBody?.details ?? []);
} 

  const GetPayrollType = async () => {
    let res = await MasterDAO.getPayRollTypeDAO();
    if (res?.statusCode === 200) {
      setPayrollList(res.responseBody);
    }
  };

  const getRolesCurrencyList = async () => {
    let res = await MasterDAO.getTalentsRoleRequestDAO();
    // let currencyresult = await MasterDAO.getCurrencyRequestDAO();
    if (res.statusCode === 200) {
      setRolesData(res.responseBody);
    }
    // if (currencyresult.statusCode === 200) {
    //   setCurrencyList(
    //     currencyresult.responseBody.map((currency) => ({
    //       value: currency.value,
    //       label: currency.value,
    //     }))
    //   );
    // }
  };

  const getCurrencyList = async () => {

    let currencyresult = await MasterDAO.getCurrencyRequestDAO();
    if (currencyresult.statusCode === 200) {
      setCurrencyList(
        currencyresult.responseBody.map((currency) => ({
          value: currency.value,
          label: currency.value,
        }))
      );
    }
  };


  const deleteHRPOC =async (pocID)=>{
    const result = await MasterDAO.deletePOCUserDAO(pocID,previewIDs?.hrID);
    // console.log("previewIDs",result)
    return result
  }

  const updateLocation = async () => {
    let isValid = true;
        let _errors = { ...error };
   
        if (!editLocation.workingModeId) {
          _errors.workingModeId = "Please select location."
          isValid = false;
        }
        if((editLocation.workingModeId === 2 || editLocation.workingModeId === 3) && !editLocation?.JobLocation ){
            _errors.JobLocation = "Please select job location."
            isValid = false;
        }else if((editLocation.workingModeId === 2 || editLocation.workingModeId === 3) && !locationList?.some((location) => location.label === editLocation?.JobLocation)){
          _errors.JobLocation = "Choose a valid location from the suggestions."
          isValid = false;
        }
        if(editLocation.workingModeId === 2 && !editLocation?.FrequencyOfficeVisitID){
            _errors.FrequencyOfficeVisitID = "Please select frequency of office visits."
            isValid = false;
        }
        if((editLocation.workingModeId === 2 || editLocation.workingModeId === 3) && editLocation?.IsOpenToWorkNearByCities === null){
            _errors.IsOpenToWorkNearByCities = "Please select open to applicants from nearby cities."
            isValid = false;
        }        
        if((editLocation.workingModeId === 2 || editLocation.workingModeId === 3)  && editLocation?.IsOpenToWorkNearByCities && (!editLocation?.NearByCities || editLocation?.NearByCities?.length  === 0)){
            _errors.NearByCities = "Please enter near by cities."
            isValid = false;
        }
        setError(_errors);
    if (isValid) {
      setError({});
      const selectedLabels = allCities?.filter(item => editLocation?.NearByCities?.includes(item.value))?.map(item => item.label);
      const nonNumericValues = editLocation?.NearByCities?.filter(value => typeof value === 'string' && !selectedLabels.includes(value));      
      let payload = {
        workingModeID: editLocation.locationValue === 'Hybrid' ? 2 :editLocation.locationValue === 'Onsite' ? 3 : editLocation.workingModeId,
        JobLocation : (editLocation.workingModeId === 2 || editLocation.workingModeId === 3) ? editLocation?.JobLocation : null,
        FrequencyOfficeVisitID : editLocation.workingModeId === 2 ? editLocation?.FrequencyOfficeVisitID : null,
        IsOpenToWorkNearByCities : editLocation?.IsOpenToWorkNearByCities,                        
        NearByCities : selectedLabels?.concat(nonNumericValues)?.join(','),            
        ATS_JobLocationID : editLocation?.ATS_JobLocationID,
        ATS_NearByCities : editLocation?.NearByCities?.join(','),
      }; 

      setIsLoading(true)
      let result = await updateJobPostDetail(payload);
      if (result.statusCode === 200) {
        setisEditLocation(false);
        messageApi.open({
          type: "success",
          content: "Location Updated",
        });
        setJobPreview((prev) => ({...prev,  
          workingModeId: editLocation.workingModeId ? editLocation.workingModeId  : null ,
          jobLocation:(editLocation.workingModeId === 2 || editLocation.workingModeId === 3) ? editLocation?.JobLocation : null,
          frequencyOfficeVisitID: editLocation.workingModeId === 2 ? editLocation?.FrequencyOfficeVisitID : null,
          isOpenToWorkNearByCities:editLocation?.IsOpenToWorkNearByCities,
          nearByCities:selectedLabels?.concat(nonNumericValues)?.join(','),
          atS_JobLocationID:editLocation?.ATS_JobLocationID,
          atS_NearByCities:editLocation?.NearByCities?.join(',')
         }));
         setEditLocation({workingModeId: "",
          JobLocation:"",
          FrequencyOfficeVisitID:null,
          IsOpenToWorkNearByCities:null,
          NearByCities:[],
          ATS_JobLocationID:null,
          ATS_NearByCities:""});
      }
      setIsLoading(false)
    }
  };

  const convertTimeToDate = (customTime) => {
    if (customTime) {
      const [hours, minutes] = customTime?.split(":");
      let [time, period] = minutes?.split(" ");
      let isPM = period === "PM";

      let hours24 = parseInt(hours, 10);
      if (hours24 === 12 && !isPM) {
        hours24 = 0;
      }
      if (isPM && hours24 !== 12) {
        hours24 += 12;
      }
      const currentDate = new Date();
      currentDate.setHours(hours24, parseInt(time, 10), 0, 0);
      return currentDate;
    }
  };
  const formateTime = (time) => {
    const [hours, minutes] = time.split(':');
    const formattedHours = hours.padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  }

  const updateShift = async () => {
    if (editShift.timeZoneFromTime == editShift.timeZoneEndTime) {
      return setError({
        ...error,
        ["timeZoneEndTime"]: "Start & End Time is same.",
      });
    }

    if (
      convertTimeToDate(editShift.timeZoneFromTime) >
      convertTimeToDate(editShift.timeZoneEndTime)
    ) {
      return setError({
        ...error,
        ["timeZoneFromTime"]: "Invalid time selection.",
      });
    }

    if (
      editShift.timeZone ||
      editShift.timeZoneFromTime ||
      editShift.timeZoneEndTime
    ) {
      let timeZoneVales = timeZone.filter(
        (timeZone) => timeZone.label === editShift.timeZone
      )[0];
      let payload = {
        timeZone: timeZoneVales.label,
        timezonePreferenceId: timeZoneVales.value,
        timeZoneFromTime: editShift.timeZoneFromTime,
        timeZoneEndTime: editShift.timeZoneEndTime,
      };

      setIsLoading(true);
      let result = await updateJobPostDetail(payload);
      if (result.statusCode === 200) {
        setisEditShift(false);
        messageApi.open({
          type: "success",
          content: "Shift Updated",
        });
        setEditShift({
          timeZone: "",
          timeZoneFromTime: "",
          timeZoneEndTime: "",
        });
        let stime = editShift.timeZoneFromTime.split(" ")[0];
        let etime = editShift.timeZoneEndTime.split(" ")[0];
        let _sDate = formateTime(stime);
        let _eDate = formateTime(etime);
        const sString = moment().format('YYYY-MM-DD') + ' ' + _sDate;
        const eString = moment().format('YYYY-MM-DD') + ' ' + _eDate;
        let _timeZone = editShift.timeZone.split(" ")[1];
        const sconvertedTimeMoment = moment.tz(sString, _timeZone).tz('Asia/Kolkata');
        const econvertedTimeMoment = moment.tz(eString, _timeZone).tz('Asia/Kolkata');
        const sformattedConvertedTime = sconvertedTimeMoment.format('HH:mm');
        const eformattedConvertedTime = econvertedTimeMoment.format('HH:mm');
        const fsDate = addAMPMFormat(sformattedConvertedTime);
        const feDate = addAMPMFormat(eformattedConvertedTime);
        setJobPreview((prev) => ({
          ...prev,
          ...{
            timeZone: timeZoneVales.label,
            timezonePreferenceId: timeZoneVales.value,
            timeZoneFromTime: editShift.timeZoneFromTime,
            timeZoneEndTime: editShift.timeZoneEndTime,
            isT_TimeZone_FromTime: fsDate,
            isT_TimeZone_EndTime: feDate
          },
        }));
      }
      setIsLoading(false);
    }
  };

  const fetchController = useRef();

  const onChangeLocation = async (val) => {
    if (typeof val === 'number') return;
    if (fetchController.current) {
        fetchController.current.abort();
    }
    setEditLocation((prev) => ({
        ...prev,
        JobLocation: val,
        NearByCities: [],
    }));
    setError({...error,['JobLocation'] : ""});
    fetchLocations(val);      
  }; 

  const fetchLocations = useCallback(
    debounce(async (val) => {
        if (val.trim() === '') return; // Avoid calling the API if the input is empty
        const controller = new AbortController();
        const signal = controller.signal;
        fetchController.current = controller;

        try {
            setIsLoading(true);
            const _res = await MasterDAO.getAutoCompleteCityStateDAO(val, { signal });
            setIsLoading(false);
            let locations = [];
            if (_res?.statusCode === 200) {
                locations = _res?.responseBody?.details?.map((location) => ({
                    value: location.row_ID,
                    label: location.location,
                }));
                setLocationList(locations || []);
            } else {
                setLocationList([]);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
            } else {
                console.error('Error fetching locations:', error);
                setLocationList([]);
            }
        }
    }, 300),
    []
  );

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

  const getCities = async (locationId) => {
    setIsLoading(true);
    let _res = await MasterDAO.getNearByCitiesDAO(locationId);
    setIsLoading(false);
    let citiesValues = [];
    if (_res?.statusCode === 200) {                
        citiesValues = _res?.responseBody?.details?.map((city) => ({
            value: city.nearByDistrictID,
            label: city.nearByDistrictName,
        }));                       
        return citiesValues || [];                                                            
    }else{
      return []
    }    
  }

  const handleBlur = () => {      
    const isValidSelection = locationList?.some(
        (location) => location.label === editLocation?.JobLocation
    );

    if(!editLocation?.JobLocation || locationList?.length === 0){
      setEditLocation((prev) => ({
        ...prev,
        NearByCities:[] 
    }));
      return
    }  
    if (!isValidSelection) {
      if(nearByCitiesData?.length>0){
         setEditLocation((prev) => ({
            ...prev,
            JobLocation: '',
            ATS_JobLocationID: null,
            NearByCities:[nearByCitiesData?.length>0 && nearByCitiesData[0]?.label] 
        }));
        setError({...error,['JobLocation'] : "Choose a valid location from the suggestions."}); 
      }else{
        setEditLocation((prev) => ({
          ...prev,
          NearByCities:[] }));
      }       
    }else{
      if(nearByCitiesData?.length>0){
         setEditLocation((prev) => ({
        ...prev,
        NearByCities:[nearByCitiesData?.length>0 && nearByCitiesData[0]?.label] 
    }));
      }else{
        setEditLocation((prev) => ({
          ...prev,
          NearByCities:[] }));
      }     
    }
  };

  const updateUserInfo = async () => {    
    // sethrpocUserID([...jobPreview?.hrpocUserID?.map((item)=>({
    //   value : item?.id,
    //   label : item?.fullName
    // }))]);
    let payload = {                     
      hrpocUserDetails : hrpocUserDetails?.map(user => ({
      pocUserID: user.pocUserID,
      contactNo: user.contactNo,
      showEmailToTalent: user.showEmailToTalent,
      showContactNumberToTalent: user.showContactNumberToTalent
    }))
   };
    
    // let payload = { 
    //   showHRPOCDetailsToTalents : showHRPOCDetailsToTalents,
    //   hrpocUserID : (hrpocUserID?.length == 0 || !hrpocUserID) ? null : hrpocUserID?.map((a) => a.toString())
    //  };
    setIsLoading(true);
    let result = await updateJobPostDetail(payload);
    if (result.statusCode === 200) {
      setIsEditUserInfo(false);
      messageApi.open({
        type: "success",
        content: "Users details updated",
      }); 
      sethrpocUserDetails(result?.responseBody?.hrpocUserID ? result?.responseBody?.hrpocUserID : []);
      setJobPreview((prev) => ({...prev, 
        hrpocUserID : result?.responseBody?.hrpocUserID ? result?.responseBody?.hrpocUserID : []}));               
      // let _data = {...jobPreview};      
      // _data.showHRPOCDetailsToTalents = showHRPOCDetailsToTalents;
      // _data.hrpocUserID =  result?.responseBody?.details?.hrpocUserID ? result?.responseBody?.details?.hrpocUserID : [];
    
    }
    sethrpocUserID([]);
    setIsLoading(false);
};  
  const updateExp = async () => {
    let valid = true;
    let _errors = { ...error };
    // if (!editExp) {
    //   _errors.editExp = `Please Enter valid Years of Experience.`;
    //   valid = false;
    // }else if(editExp<1){
    //   _errors.editExp = `Please Enter atlest 1.`;
    //   valid = false;
    // }else 
    if (editExp > 100) {
      _errors.editExp = `Please Enter maxmimum 100 value.`;
      valid = false;
    } else if (!isFreshersAllowed && editExp == 0) {
      _errors.editExp = `Please enter digits only, eg : 1, 2, 3.`;
      valid = false;
    }
    setError(_errors);
    if (valid) {
      let payload = { experienceYears: editExp, isFresherAllowed: isFreshersAllowed };

      setIsLoading(true);
      let result = await updateJobPostDetail(payload);
      if (result.statusCode === 200) {
        setisEditExp(false);
        messageApi.open({
          type: "success",
          content: "Experience Updated",
        });
        setIsAutogenerateQuestions(true);
        setJobPreview((prev) => ({
          ...prev,
          experienceYears: editExp,
          isFresherAllowed: isFreshersAllowed
        }));
        seteditExp("");
      }
      setIsLoading(false);
      setError({})
    }
  };

  useEffect(() => {
    if (editDuration.employmentType) {
      GetHiringTypePricing(editDuration.employmentType);
    }
  }, [editDuration.employmentType]);

  const UpdateSaveDataToATS = async() => {    
    if(isAutogenerateQuestions && jobPreview?.screeningQuestionsExternallyModified){  
      setIsOpen(true);        
    }else{
      setIsLoading(true);
      setIsSaveAllChanges(true);
      let res = await MasterDAO.updateJobPostDataToATSDAO(hrIdforPreview,null);
      if (res?.statusCode === 200) {
        messageApi.open({
          type: "success",
          content: "All edits are updated successfully",
        });
      }
      setIsLoading(false);
      setViewPosition(false);
      setisEditRolesAndRes(false)
      setisEditRequirenments(false)
      setisEditSkills(false)
      setChangeStatus(true)
      setEditWhatWeOffer('')
      setIsAutogenerateQuestions(false)       
    }    
  }
  const handleOk = async () => {
    setIsOpen(false);
    setIsLoading(true);
    setIsSaveAllChanges(true);
    let res = await MasterDAO.updateJobPostDataToATSDAO(hrIdforPreview,true);
    if (res?.statusCode === 200) {
      messageApi.open({
        type: "success",
        content: "All edits are updated successfully",
      });
    }
    setIsLoading(false);
    setIsAutogenerateQuestions(false); 
    setViewPosition(false);
    setisEditRolesAndRes(false)
    setisEditRequirenments(false)
    setisEditSkills(false)
    setChangeStatus(true)
    setEditWhatWeOffer('')
    
  }  
  const handleCancel = async () => {
    setIsOpen(false);
    setIsLoading(true);
    setIsSaveAllChanges(true);
    let res = await MasterDAO.updateJobPostDataToATSDAO(hrIdforPreview,false);
    if (res?.statusCode === 200) {
      messageApi.open({
        type: "success",
        content: "All edits are updated successfully",
      });
    }   
    setIsLoading(false);    
    setIsAutogenerateQuestions(false);
    setViewPosition(false);
    setisEditRolesAndRes(false)
    setisEditRequirenments(false)
    setisEditSkills(false)
    setChangeStatus(true)
    setEditWhatWeOffer('')
  }


  const GetHiringTypePricing = async () => {
    setIsLoading(true);
    // let res = await getHiringTypePricing(
    //   editDuration?.employmentType?.split(" ").join("")
    // );
    let res = await MasterDAO.getHRPricingTypeDAO();
    if (res?.statusCode === 200) {
      setHiringTypePricing(res?.responseBody);
    }
    setIsLoading(false);
  };

  const handleContactNoChange = (index, newValue) => {
    const regex = /^[0-9]\d*$/;
    if (regex.test(newValue) || newValue === "") {
      if(newValue === ""){
        handleCheckboxChange(index, 'showContactNumberToTalent', false)
    }
    sethrpocUserDetails(prevDetails =>
      prevDetails.map((detail, i) =>
        i === index ? { ...detail, contactNo: newValue } : detail
      )
    );
    }   
  };
  
  const handleCheckboxChange = (index, field, checked) => {
    sethrpocUserDetails(prevDetails =>
      prevDetails.map((detail, i) =>
        i === index ? { ...detail, [field]: checked } : detail
      )
    );
  };
  
  const handleDelete = (pocUserID) => {
    sethrpocUserDetails(prevDetails =>
      prevDetails.filter(detail => detail.pocUserID !== pocUserID)
    );
    
    // const hrwiseContactIds = jobPreview?.hrpocUserID?.map(user => Number(user.hrwiseContactId));
    // sethrpocUserID(hrwiseContactIds);  
  };
  let data = `<h3><span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; vertical-align: baseline; white-space-collapse: preserve;"><b>Not Just Another Java Developer:</b></span><span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; vertical-align: baseline; white-space-collapse: preserve;"> We're looking for someone who has </span><span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; vertical-align: baseline; white-space-collapse: preserve;">moved beyond just building applications with Spring Boot</span><span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; vertical-align: baseline; white-space-collapse: preserve;"> or similar frameworks. You should have an experience that demonstrates a deep understanding of Java, including direct manipulation of bytecode, custom library creation, and performance optimization.</span><br></h3><h3 dir="ltr" style="line-height:1.38;background-color:#ffffff;margin-top:0pt;margin-bottom:0pt;padding:0pt 0pt 7pt 0pt;"><span id="docs-internal-guid-7360c499-7fff-3bcb-8ebc-5d825d46fbbb"></span></h3><h3 dir="ltr" style="line-height:1.38;background-color:#ffffff;margin-top:0pt;margin-bottom:7pt;"><span style="font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"><b>A True Java Enthusiast: </b></span><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">You find excitement in exploring Java beyond the surface level, delving into its internals, and leveraging this knowledge to build innovative solutions.</span></h3><h3><span><span id="docs-internal-guid-6bb6224d-7fff-05ca-b573-ac1cc7d15e92"></span><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space-collapse: preserve;"><span id="docs-internal-guid-07c09f7d-7fff-dd32-3d7e-028182257644"></span>
</span></p></span></h3><h3 dir="ltr" style="line-height:1.38;background-color:#ffffff;margin-top:0pt;margin-bottom:7pt;"><span style="font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"><b>Roles &amp; Responsibilities</b></span></h3><h3><span><div><b style="" id="docs-internal-guid-78e0a3ae-7fff-ce9a-7b62-ef98c61be725"><ul style="margin-top: 0px; margin-bottom: 0px; padding-inline-start: 48px;"><li style=""><span style="font-weight: 400; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Develop the</span><span style="font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"> HyperTest Java SDK</span><span style="font-weight: 400; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">, employing advanced Java techniques for runtime library manipulation and data mocking.</span></li><li style=""><span style="font-weight: 400; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Extend</span><span style="font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"> OpenTelemetry for observability </span><span style="font-weight: 400; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">and monitoring in distributed systems, ensuring our SDK integrates seamlessly with modern development ecosystems.</span></li></ul></b></div></span></h3><h3><span><div><b style="font-weight:normal;"><ul style="margin-top:0;margin-bottom:0;padding-inline-start:48px;"><li><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Create solutions for simulated testing environments that operate in various modes without modifying the original application code.</span></li></ul></b></div></span></h3><h3><span><div><b style=""><ul style="margin-top: 0px; margin-bottom: 0px; padding-inline-start: 48px;"><li style=""><span style="font-weight: 400; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Serve as a Java subject matter expert, </span><span style="font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">guiding the team in best practices</span><span style="font-weight: 400; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"> and innovative software development approaches.</span></li></ul></b></div></span></h3><h3 dir="ltr" style="line-height:1.38;background-color:#ffffff;margin-top:0pt;margin-bottom:7pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br></span><span style="font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"><b>Requirement</b></span></h3><h3><ul><li dir="ltr" style="list-style-type: disc; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space: pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size: 11pt; font-family: Arial, sans-serif; background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; text-wrap: wrap;">Java Expertise</span><span style="font-size: 11pt; font-family: Arial, sans-serif; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; text-wrap: wrap;">: Extensive experience in Java, including familiarity with its internals, memory model, concurrency, and performance optimization. Not just experience with high-level frameworks, but a solid understanding of underlying principles and the ability to manipulate Java's core functionalities.</span></p></li></ul><ul><li dir="ltr" style="list-style-type: disc; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space: pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size: 11pt; font-family: Arial, sans-serif; background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; text-wrap: wrap;">Software Architecture</span><span style="font-size: 11pt; font-family: Arial, sans-serif; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; text-wrap: wrap;">: Strong grasp of software design patterns, architectural principles, and the ability to solve complex problems with efficient, scalable solutions.</span></p></li></ul><ul><li dir="ltr" style="list-style-type: disc; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space: pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size: 11pt; font-family: Arial, sans-serif; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; text-wrap: wrap;">Analytical Skills: Exceptional problem-solving abilities, capable of addressing complex challenges and driving innovative solutions.</span></p></li></ul><ul><li dir="ltr" style="list-style-type: disc; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space: pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size: 11pt; font-family: Arial, sans-serif; background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; text-wrap: wrap;">Specialized Knowledge</span><span style="font-size: 11pt; font-family: Arial, sans-serif; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; text-wrap: wrap;">: Experience with bytecode manipulation, library patching (e.g., Byte Buddy), and a clear understanding of Java's compilation and execution process.</span></p></li></ul></h3><h3><br></h3><h3><span id="docs-internal-guid-35acbabc-7fff-9ed3-2149-d24abe76f9f1"><b style="background-color: transparent; color: rgb(0, 0, 0); font-size: 11pt; white-space-collapse: preserve;">What We Offer</b><br><ol><li dir="ltr" style="list-style-type: disc; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space: pre;" aria-level="1"><p dir="ltr" style="line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;" role="presentation"><span style="font-size: 11pt; font-family: Arial, sans-serif; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; text-wrap: wrap;">A dynamic work environment</span></p></li></ol><ol><li dir="ltr" style="list-style-type: disc; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space: pre;" aria-level="1"><p dir="ltr" style="line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt; padding: 0pt 0pt 11pt;" role="presentation"><span style="font-size: 11pt; font-family: Arial, sans-serif; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; text-wrap: wrap;">Opportunities for professional growth</span></p></li><li dir="ltr" style="list-style-type: disc; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space: pre;" aria-level="1"><p dir="ltr" style="line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt; padding: 0pt 0pt 11pt;" role="presentation"><span style="background-color: transparent; font-family: Arial, sans-serif; font-size: 11pt; text-wrap: wrap;">The chance to make a significant impact on our product and the wider development community</span></p></li></ol><span id="docs-internal-guid-9ae09089-7fff-b2c4-6beb-801f533e09d6"><p dir="ltr" style="line-height: 1.38; margin-top: 0pt; margin-bottom: 11pt;"><span style="font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space-collapse: preserve;"><b>Interview Process</b></span></p><p dir="ltr" style="line-height: 1.38; margin-top: 0pt; margin-bottom: 11pt;"><span style="font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space-collapse: preserve;"><span id="docs-internal-guid-fbf606f9-7fff-e78c-8bc7-953b68199fcc"></span></span></p><ul style="margin-top:0;margin-bottom:0;padding-inline-start:48px;"><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;background-color:#ffffff;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">First 15 minutes discussion with the CTO</span></p></li></ul><div><font color="#000000" face="Arial, sans-serif"><span style="font-size: 14.6667px; white-space-collapse: preserve;"><br></span></font></div><ul style="margin-top:0;margin-bottom:0;padding-inline-start:48px;"><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;background-color:#ffffff;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Second Round - Take home assessment</span></p></li></ul><div><font color="#000000" face="Arial, sans-serif"><span style="font-size: 14.6667px; white-space-collapse: preserve;"><br></span></font></div><ul style="margin-top:0;margin-bottom:0;padding-inline-start:48px;"><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;background-color:#ffffff;margin-top:0pt;margin-bottom:11pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Third round - General discussion</span></p></li></ul><div><span id="docs-internal-guid-98b46740-7fff-32ce-43db-b26231a857b5"><p dir="ltr" style="line-height: 1.38; margin-top: 0pt; margin-bottom: 11pt;"><span style="font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space-collapse: preserve;"><b>Benefits</b></span></p><ul style="margin-bottom: 0px; padding-inline-start: 48px;"><li dir="ltr" style="list-style-type: disc; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space: pre;" aria-level="1"><p dir="ltr" style="line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt; padding: 0pt 0pt 11pt;" role="presentation"><span style="font-size: 11pt; font-family: Arial, sans-serif; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; text-wrap: wrap;">Unlimited leaves</span></p></li><li dir="ltr" style="list-style-type: disc; font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space: pre;" aria-level="1"><p dir="ltr" style="line-height: 1.38; margin-top: 0pt; margin-bottom: 11pt;" role="presentation"><span style="font-size: 11pt; font-family: Arial, sans-serif; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; text-wrap: wrap;">PF</span></p></li></ul></span></div><div><span style="font-size: 11pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space-collapse: preserve;"><br></span></div></span></span></h3>`

  return (
    <>
      {/* {isLoading && (
        <Space size="middle">
          <Spin size="large" />
        </Space>
      )} */}
      {contextHolder}
      <Modal
        centered
        open={ViewPosition}
        onOk={() => setViewPosition(false)}
        onCancel={() => {
          if(isAnyFieldUpdate && !isSaveAllChanges){
            confirm({
              title: 'Please save your changes before leaving this page to avoid losing any unsaved data.',
              okText: 'SAVE CHANGES',
              okButtonProps: {
                style: {
                  fontSize:"14px",
                  fontWeight:700,                              
                  height: "41px",
                  minHeight:"46px",
                  color: "#232323",
                  fontStyle: "normal",
                  lineHeight: "normal",                                                            
                  border: 0,
                  transition: "0.5s all",
                  background: "#FFDA30",
                  padding: "0 25px",                                                            
                  borderRadius: "27px",                                    
                },
              },
              okCancel:"",
              onOk() {
                UpdateSaveDataToATS();
              },    
              onCancel(){

              }                           
            });  
          }else{
            setViewPosition(false);
            setError({});
            setisEditRolesAndRes(false)
            setisEditRequirenments(false)
            setisEditSkills(false)
            setChangeStatus(true)
            setEditWhatWeOffer("");          
            setIsAutogenerateQuestions(false)
          }                 
        }}
        footer={null}
        width={1080}
        className="PostNewJobModal editJobPostModal previewHRModal"
        maskClosable={false}
      >

        <div className="PostNewJobModal-Content poup-new-content">      
       
          <div className="PreviewpageMainWrap">
            <div className="PreviewStickyContent">
              
                <div className="Post-Header Post-Header-Edit-Modal" style={{display:"flex",justifyContent:"space-between"}}>
                  <h4>Preview/Edit HR</h4>
                  <div className="PreviewBtnHead">              
                    <Popconfirm                  
                      title={jobPreview?.totalScreeningQuestions > 10 ? 'There were few custom changes made to AI video vetting questions earlier. Do you want to regenerate the new questions on the basis of new information you edit related to the job ?' : 'There were few custom changes made to AI video vetting questions earlier. Do you want to regenerate the new questions on the basis of new information you edit related to the job ? Upon regeneration there will be a set of at least 10 questions asked to the candidate.'}
                      open={open}
                      onConfirm={handleOk}
                      onCancel={handleCancel}
                      overlayStyle={{ width: "500px" }}  
                      okText="Yes" 
                      cancelText="No" 
                      okButtonProps={{ style: {
                        fontSize:"14px",
                        fontWeight:700,                              
                        height: "30px",
                        minHeight:"35px",
                        color: "#232323",
                        fontStyle: "normal",
                        lineHeight: "normal",                                                            
                        border: 0,
                        transition: "0.5s all",
                        background: "#FFDA30",
                        padding: "0 25px",                                                            
                        borderRadius: "27px",                                    
                      }, }} 
                      cancelButtonProps={{ style: {
                        fontSize:"14px",
                        fontWeight:700,                              
                        height: "30px",
                        minHeight:"35px",
                        color: "#232323",
                        fontStyle: "normal",
                        lineHeight: "normal",                                                            
                        border: 0,
                        transition: "0.5s all",
                        background: "#FFDA30",
                        padding: "0 25px",                                                            
                        borderRadius: "27px",                                    
                      }, }}                  
                    >
                    <button type="button" className="btnPrimary" onClick={() => UpdateSaveDataToATS()}>Save Changes</button>
                    </Popconfirm>
                  </div>             
                </div>
              {ispreviewLoading ? <div style={{display:'flex',justifyContent:'center'}}>
                <Space size="large">
                  <Spin size="large" />
                </Space> </div>  :  <div className="PostJobStepSecondWrap">
                <div className="formFields">
                  <div className="formFields-box">
                    <div className="formFields-box-inner">
                      {!iseditRoleName ? (
                        <>
                          <h2 className="postJobFirstStepTitle formFields-box-title">
                            {jobPreview?.roleName}
                            {hrNumber && <span className="boxInnerInfo">({hrNumber})</span>}

                            <span className="editNewIcon"
                              onClick={() => {                              
                                  setiseditRoleName(true);
                                seteditRoleName(jobPreview?.roleName);
                                getRolesCurrencyList();
                              }}
                            ><img src={EditnewIcon} /></span>
                          </h2>
                        </>
                      ) : (
                        <div className="previewFieldEdit" style={{ padding: "16px 32px" }}>
                          <AutoComplete
                            value={editRoleName}
                            options={rolesData}
                            filterOption={true}
                            style={{ width: "100%" }}
                            onChange={(val) => {
                              seteditRoleName(val);
                            }}
                            className="customSelect"
                          />
                          {error.editRoleName && (
                            <span className="error">{error.editRoleName}</span>
                          )}
                          <div className="buttonEditGroup justify-content-end">
                            <button
                              type="button"
                              class="btnPrimary blank"
                              onClick={() => {
                                setiseditRoleName(false);
                                setError({});
                              }}
                            >
                              Cancel
                            </button>
                            {isLoading ? <Spin size="large" /> : <button
                              type="button"
                              class="btnPrimary"
                              onClick={() => updateRoleName()}
                              disabled={isLoading}
                            >
                             SAVE
                            </button>}
                            
                          </div>
                        </div>
                      )}
                          
                      <div className="FieldsBoxInner-Content">
                        <ul className="previewstepBox">
                          <li>
                            <img src={currencyIcon} className="currency" />
                            {jobPreview?.isConfidentialBudget === true
                              ?
                              <div>
                                Budget is confidential
                                &nbsp;
                                <Tooltip placement="bottom"
                                  title={
                                    <>
                                      <div className="budgetSet">
                                        {jobPreview?.hrCost ? jobPreview?.hrCost : "NA"}
                                      </div>
                                      <div className="budgetConfidential">
                                        <img src={rightGreen} className="rightGreenIcon" />
                                        <div>
                                          <p> The budget is kept confidential from candidates.</p>
                                        </div>
                                      </div>
                                    </>
                                  }>
                                  <span className="editDevloper">
                                    <img src={infoIcon} className="edit" />
                                  </span>
                                </Tooltip>
                              </div>
                              : jobPreview?.hrCost ? jobPreview?.hrCost : "NA"}

                            <span className="editNewIcon"
                              onClick={() => {
                                setisEditBudget(true);
                                getCurrencyList();
                                setEditBudget({
                                  ...editBudget,
                                  currency: jobPreview?.currency,
                                  budgetFrom: jobPreview?.budgetFrom,
                                  budgetTo: jobPreview?.budgetTo,
                                  budgetType: jobPreview?.budgetType,
                                  isConfidentialBudget: jobPreview?.isConfidentialBudget,
                                });
                                CalculateEstimatedUplersFees(Number(jobPreview?.budgetFrom), Number(jobPreview?.budgetTo))
                              }}
                            ><img src={EditnewIcon} /></span>
                            <Tooltip placement="bottom" title={<div dangerouslySetInnerHTML={{ __html: jobPreview?.toolTipMessage }} />} >
                              <span className="editDevloper">
                                <img src={infosmallIcon} className="edit" height={'12px'} style={{ display: 'flex' }} />
                              </span>
                            </Tooltip>
                          </li>

                          <li>
                            <img src={businessIconImage} className="business" />
                            {/* {jobPreview?.employmentType === "Part Time"
                              ? `Part Time contract for ${jobPreview?.contractDuration === -1 ? 'Indefinite' : jobPreview?.contractDuration} months`
                              : jobPreview?.isHiringLimited === "Temporary"
                                ? `Full Time contract for ${jobPreview?.contractDuration === -1 ? 'Indefinite' : jobPreview?.contractDuration} months`
                                : `Full Time ${jobPreview?.contractDuration ? jobPreview?.contractDuration == -1 ? "Indefinite" : `${jobPreview?.contractDuration} months` : ""}`} */}
                                {/* {jobPreview?.contractDuration ? `${jobPreview?.employmentType} contract for ${jobPreview?.contractDuration == -1 ? "Indefinite" : 
                                      jobPreview?.contractDuration} months` : `${jobPreview?.employmentType}` }  */}
                                {jobPreview?.availability}
                            <span className="editNewIcon"
                              onClick={() => {
                                setisEditDuration(true);
                                GetPayrollType();
                                getJobType();
                                setError({});
                                // let _empType = getcompanyID == 2 ?
                                //   jobPreview.employmentType === 'Part Time' ? jobPreview.employmentType : jobPreview?.isHiringLimited === 'Temporary' ? 'Temporary' : jobPreview?.isHiringLimited === 'Permanent' ? 'Permanent' : ''
                                //   : jobPreview.employmentType
                                seteditDuration({
                                  hiringTypePricingId: jobPreview?.hiringTypePricingId,
                                  payrollPartnerName: jobPreview?.payrollPartnerName ? jobPreview?.payrollPartnerName : null,
                                  payrollType: jobPreview?.payrollType ? jobPreview?.payrollType : null,
                                  payrollTypeId: jobPreview?.payrollTypeId ? jobPreview?.payrollTypeId : null,
                                  contractDuration: jobPreview?.contractDuration,
                                  toolTipMessage: jobPreview?.toolTipMessage,
                                  employmentType:jobPreview?.employmentType,
                                  jobTypeID:jobPreview?.jobTypeID ? jobPreview?.jobTypeID : null,
                                  isHiringLimited:jobPreview?.isHiringLimited
                                });
                              }}
                            ><img src={EditnewIcon} /></span>
                          </li>
                          <li>
                            {" "}
                            <img src={umbrellaIconImage} className="edit" />
                            Notice Period - {jobPreview?.howSoon ? jobPreview?.howSoon : ""}
                            {/* Notice Period -  {jobPreview?.howsoon} */}

                            <span className="editNewIcon"
                              onClick={() => {
                                setisEditNoticePeriod(true);
                                setEditNoticePeriod({
                                  ...editNoticePeriod,
                                  howsoon: jobPreview?.howSoon,
                                });
                              }}
                            ><img src={EditnewIcon} /></span>
                          </li>
                          <li className={`canJobLocInfoBtn ${iseditLocation ? "showInfo" : ""}`}>
                                        <div className="canJobLocInfoInner">
                                          <img src={locationIconImage} className="business" />{" "}
                                          {jobPreview?.workingModeId === 1 ? "Work from anywhere" : jobPreview?.workingModeId == 2 ? "Hybrid" :jobPreview?.workingModeId == 3 ?  "On-site" : "-"}
                                          <span className="editNewIcon" onClick={() => { 
                                              setisEditLocation(true);
                                              // getcountryData();
                                              getFrequencyData()
                                              fetchCities()
                                              setEditLocation({
                                                ...editLocation,
                                                workingModeId: jobPreview?.workingModeId,
                                                JobLocation : (jobPreview?.workingModeId === 2 || jobPreview?.workingModeId === 3) ? jobPreview?.jobLocation : null,
                                                FrequencyOfficeVisitID : jobPreview.workingModeId === 2 ? jobPreview?.frequencyOfficeVisitID : null,
                                                IsOpenToWorkNearByCities : jobPreview?.isOpenToWorkNearByCities,                    
                                                NearByCities : jobPreview?.nearByCities?.split(','),            
                                                ATS_JobLocationID : jobPreview?.atS_JobLocationID,
                                                ATS_NearByCities: jobPreview?.atS_NearByCities ? jobPreview?.atS_NearByCities : null                                
                                              });
                                              fetchLocations((jobPreview?.workingModeId === 2 || jobPreview?.workingModeId === 3) ? jobPreview?.jobLocation?.substring(0,3) : null); 
                                          }} >  <img src={EditnewIcon}/></span>
                                          <span className="downArrowBtn"  onClick={() => {
                                            setisEditLocation(!iseditLocation);
                                            getFrequencyData()
                                            fetchCities()
                                            setEditLocation({
                                              ...editLocation,
                                              workingModeId: jobPreview?.workingModeId,
                                              JobLocation : (jobPreview?.workingModeId === 2 || jobPreview?.workingModeId === 3) ? jobPreview?.jobLocation : null,
                                              FrequencyOfficeVisitID : jobPreview.workingModeId === 2 ? jobPreview?.frequencyOfficeVisitID : null,
                                              IsOpenToWorkNearByCities : jobPreview?.isOpenToWorkNearByCities,                    
                                              NearByCities : jobPreview?.nearByCities?.split(','),            
                                              ATS_JobLocationID : jobPreview?.atS_JobLocationID,
                                              ATS_NearByCities: jobPreview?.atS_NearByCities ? jobPreview?.atS_NearByCities : null                                
                                            });
                                            fetchLocations((jobPreview?.workingModeId === 2 || jobPreview?.workingModeId === 3) ? jobPreview?.jobLocation?.substring(0,3) : null); 
                                          }}>
                                            <img src={SmallDownArrow} alt="small-down-arrow"/>
                                          </span> 
                                        </div> 
                                      </li>
                          <li>
                            <img src={awardIconImage} className="business" />
                            {jobPreview?.isFresherAllowed ? 'Fresher' : jobPreview?.experienceYears !== ''
                              ? `${jobPreview?.experienceYears} Years Exp`
                              : ""}


                            <span className="editNewIcon"
                              onClick={() => {
                                  setisEditExp(true);
                                setIsExpDisabled(false);
                                seteditExp(jobPreview?.experienceYears);
                                setIsFreshersAllowed(jobPreview?.isFresherAllowed)
                              }}
                            ><img src={EditnewIcon} /></span>
                          </li>
                          <Tooltip placement="top" title={`India Standard Time ${jobPreview?.isT_TimeZone_FromTime} to ${jobPreview?.isT_TimeZone_EndTime}`}>

                            <li>
                              <img src={clockIconImage} className="business" />
                              {`${jobPreview?.timeZone ? jobPreview?.timeZone : ""} ${jobPreview?.timeZoneFromTime
                                ? jobPreview?.timeZoneFromTime
                                : ""
                                } to ${jobPreview?.timeZoneEndTime
                                  ? jobPreview?.timeZoneEndTime
                                  : ""
                                } `}

                              <span className="editNewIcon"
                                onClick={() => {
                                  getTimeZoneValues();
                                  getStartEndTimeData();
                                    setisEditShift(true);
                                  setEditShift({
                                    timeZone: jobPreview?.timeZone,
                                    timeZoneFromTime: jobPreview?.timeZoneFromTime,
                                    timeZoneEndTime: jobPreview?.timeZoneEndTime,
                                  });
                                }}
                              ><img src={EditnewIcon} /></span>
                            </li>
                          </Tooltip>
                          {iseditLocation && 
                            <li className="canJobLocInfoBox">
                              <div className="row">
                                <div className="col-12">
                                  <div className="form-group">
                                    <label>Change job location </label>
                                    <div>
                                      <Radio.Group
                                        className="customradio newradiodes small"
                                        name="workingModeID"
                                        value={editLocation.workingModeId}
                                        onChange={(e) => {
                                          setEditLocation({
                                            ...editLocation,
                                            workingModeId: e.target.value,
                                            JobLocation:"",
                                            FrequencyOfficeVisitID:null,
                                            IsOpenToWorkNearByCities:null,
                                            NearByCities:[],
                                            ATS_JobLocationID:null,
                                            ATS_NearByCities:""
                                          });
                                        }}
                                      >
                                        <Radio.Button value={1}>
                                          Remote{" "}
                                          <img
                                            className="checkIcon"
                                            src={CheckRadioIcon}
                                            alt="check"
                                          />
                                        </Radio.Button>
                                        <Radio.Button value={3}>
                                          On-site{" "}
                                          <img
                                            className="checkIcon"
                                            src={CheckRadioIcon}
                                            alt="check"
                                          />
                                        </Radio.Button>
                                        <Radio.Button value={2}>
                                          Hybrid{" "}
                                          <img
                                            className="checkIcon"
                                            src={CheckRadioIcon}
                                            alt="check"
                                          />
                                        </Radio.Button>
                                      </Radio.Group>
                                    </div>
                                  </div>
                                </div>
                                {editLocation.workingModeId !== 1 && (
                                  <>
                                    <div className="col-md-6">
                                        <div className={`form-group`}>
                                            <h3>Location <span>*</span></h3>
                                            <div className='cutomeAutoCompliteArrow'>
                                                <AutoComplete
                                                    value={editLocation?.JobLocation}
                                                    options={locationList ?? []}
                                                    onChange={onChangeLocation}
                                                    onSelect={async (value, option) => {                                                                                                                                    
                                                      let citiesVal = await getCities(option.value);                                                                 
                                                      setEditLocation({...editLocation,
                                                        JobLocation: option.label,
                                                        ATS_JobLocationID: option.value,
                                                        NearByCities:[citiesVal?.length>0 && citiesVal[0]?.label]  
                                                      });                                                                                                                                                                                                                                              
                                                      setNearByCitiesData(citiesVal);                                                                 
                                                      setError({...error,['JobLocation'] : ""});                                                           
                                                  }}                       
                                                    onBlur={handleBlur}                                 
                                                    placeholder='Select location'
                                                    className='customSelectAutoField'                                                       
                                                />
                                                <span className='downArrowCus'></span>
                                            </div>
                                            {error?.JobLocation && <span className='error'>{error?.JobLocation}</span>}
                                        </div>
                                    </div>
                                    {editLocation?.workingModeId === 2 && 
                                    <div className="col-md-6">
                                          <div className={`form-group`}>
                                              <h3>Frequency of Office Visits <span>*</span></h3>
                                              <Select
                                                  placeholder='Select frequency of office visits'
                                                  tokenSeparators={[","]}
                                                  onSelect={(e) => {
                                                      setEditLocation((prev) => ({
                                                          ...prev,
                                                          FrequencyOfficeVisitID: e,
                                                      }));
                                                      setError({...error,['FrequencyOfficeVisitID'] : ""});
                                                  }}                                                         
                                                  value={editLocation?.FrequencyOfficeVisitID}
                                                  options={frequencyData}
                                              />
                                              {error?.FrequencyOfficeVisitID && <span className='error'>{error?.FrequencyOfficeVisitID}</span>}
                                          </div>
                                    </div>}
                                    <div className="col-12">
                                        <div className={`form-group`}>
                                            <h3>Open to applicants from other cities<span>*</span></h3>
                                            <Radio.Group
                                                className="customradio newradiodes small"
                                                value={editLocation?.IsOpenToWorkNearByCities}
                                                onChange={async (e) => {
                                                    setEditLocation({...editLocation,IsOpenToWorkNearByCities:e.target.value})
                                                    // if(e.target.value && editLocation?.workingModeId === 2){                                                                
                                                    //     getCities(editLocation?.ATS_JobLocationID);
                                                    // }
                                                    setError({...error,['IsOpenToWorkNearByCities'] : ""});
                                                }}
                                            >
                                                <Radio.Button value={true}>
                                                Yes <img className='checkIcon' src={CheckRadioIcon} alt='check' />
                                                </Radio.Button>
                                                <Radio.Button value={false}>
                                                No <img className='checkIcon' src={CheckRadioIcon} alt='check' />
                                                </Radio.Button>                                               
                                            </Radio.Group>
                                            {error?.IsOpenToWorkNearByCities && <span className='error'>{error?.IsOpenToWorkNearByCities}</span>}
                                        </div>
                                    </div>
                                    {editLocation?.IsOpenToWorkNearByCities &&
                                    <div className="col-12">
                                        <div className={`form-group prevSkillTwopart`}>
                                            <h3>Other cities</h3>
                                            <Select
                                                mode="tags"
                                                style={{ width: "100%" }}
                                                value={editLocation?.NearByCities}
                                                options={allCities}
                                                onChange={(values, _) => {
                                                    setEditLocation({ ...editLocation, NearByCities: values });
                                                    setError({...error,['NearByCities'] : ""});
                                                }}
                                                placeholder="Enter cities"
                                                tokenSeparators={[","]}
                                                showSearch={true}
                                                filterOption={(input, option) => 
                                                  option.label.toLowerCase().includes(input.toLowerCase())
                                                } 
                                            />                                                                                                  
                                            {error?.NearByCities && <span className='error'>{error?.NearByCities}</span>}  
                                            <ul className="SlillBtnBox">
                                              {nearByCitiesData
                                                ?.filter(option => !editLocation?.NearByCities?.includes(option.label))
                                                .map((option) =>{                                                                                                                   
                                                  return (
                                                    <li key={option.value} style={{ cursor: "pointer" }} onClick={() => {  
                                                      let updatedCities = [...editLocation?.NearByCities, option.value];
                                                      setEditLocation({...editLocation, NearByCities: updatedCities});
                                                      setError({...error, ['NearByCities']: ""});
                                                    }}>
                                                      <span>{option.label} <img src={plusImage} loading="lazy" alt="star" /></span>
                                                    </li>
                                                  )
                                                } )}
                                            </ul>                                                              
                                        </div>
                                    </div>}
                                  </>
                                )}
                                <div className="buttonEditGroup col-12 mb-2 mt-0">
                                  <button
                                    type="button"
                                    class="btnPrimary blank"
                                    onClick={() => {
                                      setisEditLocation(false);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    class="btnPrimary"
                                    onClick={() => updateLocation()}
                                  >
                                    SAVE
                                  </button>
                                </div>
                              </div>
                            </li>
                          }

                        </ul>

                        <div className="prevSkillTwopart">
                          <div className="prevSkillLeftside">
                            {iseditSkills ? (
                              <div className="row">
                                <div className="col-12">
                                  <div className="form-group">
                                    <label>
                                      Please add must have skills (Upto 5 skills recommended) <span>*</span>
                                    </label>
                                    <Select
                                      ref={selectTopRef}
                                      mode="tags"
                                      style={{ width: "100%" }}
                                      value={editTopSkills}
                                      onChange={(values) => topSkillSelect(values.map(skill => skill.trim()))}
                                      placeholder="Type Skill"
                                      tokenSeparators={[","]}
                                      options={topSkills}
                                      onInputKeyDown={(e) => handleTopSkillsInputKeyDown(e)}
                                      onSelect={e => {
                                        if (editskills?.map(skill => formatSkill(skill?.trim()?.toLowerCase())).includes(formatSkill(e?.trim()?.toLowerCase()))) {
                                          selectTopRef.current.blur();
                                        }
                                      }}
                                    />
                                    {skillErrors && editTopSkills?.length === 0 && (
                                      <span className="error">Please select Skills</span>
                                    )}
                                    {topSkilladdedError && (
                                      <span className="error"> This Skill already added below </span>
                                    )}
                                  </div>
                                </div>

                                <div className="col-12">
                                  <div className="form-group mb-0">
                                    <label>
                                      Please add good to have skills
                                    </label>
                                    <Select
                                      mode="tags"
                                      ref={selectTopRef}
                                      onInputKeyDown={(e) => handleTopSkillsInputKeyDown(e)}
                                      style={{ width: "100%" }}
                                      onChange={(values) => goodtoHaveSkillSelect(values.map(skill => skill.trim()))}
                                      placeholder="Type Skill"
                                      tokenSeparators={[","]}
                                      options={Skills}
                                      value={editskills}
                                      onSelect={(e) => {
                                        if (editTopSkills?.map((skill) => skill.toLowerCase()).includes(e.toLowerCase())) {
                                          selectTopRef.current.blur();
                                        }
                                      }}
                                    />
                                    {goodtoHaveSkillAddedError && (
                                      <span className="error">
                                        This Skill already added above
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="col-12">
                                  <div className="buttonEditGroup mt-2">
                                    <button
                                      type="button"
                                      class="btnPrimary blank"
                                      onClick={() => {
                                        setisEditSkills(false);
                                        setEditTopSkills([]);
                                        setEditSkills([]);
                                      }}
                                    >
                                      Cancel
                                    </button>
                                    {isLoading ? <Spin size="large" /> : <button
                                      type="button"
                                      class="btnPrimary"
                                      onClick={() => updateSkills()}
                                    >
                                      SAVE
                                    </button>}
                                    
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="topFillFileldRead">
                                <h6>Top Skills
                                  <span className="editNewIcon"
                                    onClick={editSkills}
                                  ><img src={EditnewIcon} /></span>
                                </h6>
                                <ul className="SlillBtnBox">
                                  {jobPreview?.skills
                                    ? [...new Set(jobPreview?.skills?.split(","))]?.map((skill, index) => (
                                      <li key={index}>
                                        <AiFillStar />
                                        {skill}
                                      </li>
                                    ))
                                    : null}
                                </ul>
                                <ul className="SlillBtnBox">
                                  {jobPreview?.allSkills
                                    ? [...new Set(jobPreview?.allSkills?.split(","))]
                                      ?.map((skill, index) => (
                                        <li key={index} >
                                          {skill}
                                        </li>
                                      ))
                                    : null}
                                </ul>
                              </div>
                            )}

                            <div className="RolesResponsibilitiesDetail">
                              <h6>
                                Job description
                                <span className="editNewIcon"
                                  onClick={() => {
                                    setisEditWhatWeoffer(true);
                                    const mergedContent = `
                                    ${jobPreview?.roleOverviewDescription ? `<h3>Role Overview Description</h3>${jobPreview?.roleOverviewDescription}<br><br>` : ''}
                                    ${jobPreview?.rolesResponsibilities ? `<h3>Roles & Responsibilities</h3>${jobPreview?.rolesResponsibilities}<br><br>` : ''}
                                    ${jobPreview?.requirements ? `<h3>Requirements</h3>${jobPreview?.requirements}<br><br>` : ''}
                                    ${jobPreview?.whatweoffer ? `<h3>What We Offer</h3>${jobPreview?.whatweoffer}` : ''}
                                  `;
                                    setEditWhatWeOffer(editWhatWeOffer ? editWhatWeOffer : jobPreview?.jobDescription ? jobPreview?.jobDescription : mergedContent);
                                  }}
                                ><img src={EditnewIcon} /></span>
                              </h6>
                              {iseditWhatWeOffer ? (
                                <>
                                  <ReactQuill
                                    theme="snow"
                                    className="heightSize"
                                    value={editWhatWeOffer}
                                    onChange={(val) => {
                                      let _updatedVal = val?.replace(/<img\b[^>]*>/gi, '');
                                      setEditWhatWeOffer(_updatedVal)
                                    }}
                                  />
                                  {(!editWhatWeOffer ||
                                    editWhatWeOffer == "<p><br></p>") && (
                                      <span className="error">
                                        Please enter job description
                                      </span>
                                    )}
                                  <div className="buttonEditGroup mt-2 justify-content-end">
                                    <button
                                      type="button"
                                      class="btnPrimary blank"
                                      onClick={() => {
                                        setisEditWhatWeoffer(false);
                                      }}
                                    >
                                      Cancel
                                    </button>
                                    {isLoading ? <Spin size="large" /> : <button
                                      type="button"
                                      class="btnPrimary"
                                      onClick={() => updateWhatWeOffer()}
                                    >
                                      SAVE
                                    </button>}
                                    
                                  </div>
                                </>
                              ) : (
                                <div>
                                  {/* <ReactQuill
                            theme="snow"                            
                            value={editWhatWeOffer ? editWhatWeOffer : jobPreview?.jobDescription ? jobPreview?.jobDescription : `
                            ${jobPreview?.roleOverviewDescription ? `<h3>Role Overview Description</h3>${jobPreview?.roleOverviewDescription}<br><br>` : ''}
                            ${jobPreview?.rolesResponsibilities ? `<h3>Roles & Responsibilities</h3>${jobPreview?.rolesResponsibilities}<br><br>` : ''}
                            ${jobPreview?.requirements ? `<h3>Requirements</h3>${jobPreview?.requirements}<br><br>` : ''}
                            ${jobPreview?.whatweoffer ? `<h3>What We Offer</h3>${jobPreview?.whatweoffer}` : ''}
                          `}
                          // value={data}
                            readOnly
                            modules={{ toolbar: false }}
                            className="reactQuillEdit"
                            style={{
                              border: "none !important",
                            }}
                          /> */}
                                  {/* <div className="jobDescrition" dangerouslySetInnerHTML={{
                                    __html: editWhatWeOffer ? editWhatWeOffer?.replace(/\s+/g, ' ')?.replace(/>\s+</g, '><')?.trim() : jobPreview?.jobDescription ? jobPreview?.jobDescription?.replace(/\s+/g, ' ')?.replace(/>\s+</g, '><')?.trim() : `
                            ${jobPreview?.roleOverviewDescription ? `<h3>Role Overview Description</h3>${jobPreview?.roleOverviewDescription}<br><br>` : ''}
                            ${jobPreview?.rolesResponsibilities ? `<h3>Roles & Responsibilities</h3>${jobPreview?.rolesResponsibilities}<br><br>` : ''}
                            ${jobPreview?.requirements ? `<h3>Requirements</h3>${jobPreview?.requirements}<br><br>` : ''}
                            ${jobPreview?.whatweoffer ? `<h3>What We Offer</h3>${jobPreview?.whatweoffer}` : ''}`
                                  }} /> */}
                                  <HSContent data={jobPreview?.jobDescription && jobPreview?.jobDescription?.replace(/\s+/g, ' ')?.replace(/>\s+</g, '><')?.trim()} />
                                </div>
                              )}
                            </div>

                            <div className="mt-3">
                            <h6>Compensation options
                                <span className="editNewIcon"  onClick={() => {
                                    setisCompensationOptionOpen(true);
                                    setCompensationValues(jobPreview?.compensationOption ? jobPreview?.compensationOption?.split("^") : []);
                                  }} ><img src={EditnewIcon} /></span>
                                </h6>
                                <div className="company-benefits">
                                  <ul>
                                    {(!jobPreview?.compensationOption || jobPreview?.compensationOption?.length == 0) ? "NA" :
                                      jobPreview?.compensationOption?.split("^")?.map((val, index) => {
                                        return (
                                          <li key={index}><span>{val}</span></li>
                                        )
                                      })}
                                  </ul>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                     
                    </div>
                  </div>
                </div>

                <div className="formFields">
                  <div className="formFields-box">
                    <div className="formFields-box-inner">
                      <h2 className="formFields-box-title">Company Details</h2>

                      <div class="company-details">
                        <div className="top-details">
                          <div className="companyDetailsHead">
                            <div className="thumbImages">
                              {basicDetails?.companyLogo ?
                                <img src={basicDetails?.companyLogo?.includes(NetworkInfo.PROTOCOL +
                                  NetworkInfo.DOMAIN)? basicDetails?.companyLogo :  NetworkInfo.PROTOCOL + NetworkInfo.DOMAIN +
                                  "Media/CompanyLogo/" + basicDetails?.companyLogo} alt="CompanyProfileImg" /> :
                                <Avatar
                                  style={{
                                    width: "100%",
                                    height: "100%", display: "flex", alignItems: "center"
                                  }}
                                  size="large">{basicDetails?.companyName?.substring(0, 2).toUpperCase()}</Avatar>}

                              <span className="editNameBtn">
                                <label htmlFor="fileInput">
                                  <img src={EditnewIcon} className="editNewIcon" width={12} />
                                </label>
                                <input
                                  id="fileInput"
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={handleFileChange}
                                />
                              </span>
                            </div>
                            <p>
                              {basicDetails?.companyName}
                              <a
                                href={basicDetails?.website?.startsWith('http') ? basicDetails?.website : 'http://' + basicDetails?.website} target="_blank"
                                style={{ cursor: "pointer" }}
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12.7171 7.33498C12.7171 8.4365 12.7171 9.53477 12.7171 10.6363C12.7171 10.8793 12.7171 11.1223 12.7171 11.3652C12.7171 11.4203 12.7171 11.4786 12.7171 11.5337C12.7171 11.5402 12.7171 11.5467 12.7171 11.5531C12.7171 11.5758 12.7235 11.7249 12.7073 11.7346C12.7138 11.7313 12.7333 11.5953 12.7138 11.6957C12.7041 11.7378 12.6976 11.7832 12.6847 11.8253C12.6717 11.8804 12.6523 11.9354 12.6328 11.9905C12.5939 12.1136 12.649 11.9516 12.649 11.9549C12.6523 11.9614 12.6166 12.0197 12.6134 12.0326C12.5875 12.0845 12.5583 12.1331 12.5291 12.1817C12.5097 12.2108 12.4838 12.24 12.4708 12.2691C12.4384 12.3372 12.5583 12.1719 12.4806 12.2562C12.4482 12.2886 12.2829 12.5056 12.2376 12.4927C12.2408 12.4927 12.351 12.4149 12.2667 12.4668C12.2376 12.4862 12.2084 12.5056 12.1793 12.5251C12.1242 12.5575 12.0691 12.5866 12.0108 12.6158C11.8974 12.6741 12.0464 12.5996 12.0464 12.6028C12.0464 12.6061 11.9751 12.6287 11.9654 12.632C11.9039 12.6514 11.8391 12.6709 11.7775 12.6838C11.7484 12.6903 11.7192 12.6935 11.6901 12.7C11.6026 12.7162 11.8196 12.6903 11.7289 12.6935C11.6771 12.6935 11.622 12.7 11.5702 12.7C11.554 12.7 11.5378 12.7 11.5216 12.7C10.6112 12.7033 9.70408 12.7 8.7937 12.7C7.37793 12.7 5.96215 12.7 4.54638 12.7C4.03125 12.7 3.51289 12.7 2.99777 12.7C2.85522 12.7 2.71591 12.7 2.57336 12.7C2.54096 12.7 2.50533 12.7 2.47293 12.7C2.46645 12.7 2.45997 12.7 2.45349 12.7H2.45025C2.42109 12.7 2.3887 12.7 2.35954 12.6968C2.33686 12.6968 2.31418 12.6935 2.2915 12.6935C2.23967 12.6903 2.26235 12.6935 2.35306 12.7033C2.3077 12.7389 2.06796 12.6352 2.01612 12.619C1.89301 12.5802 2.055 12.6352 2.05176 12.6352C2.04528 12.6385 1.98697 12.6028 1.97401 12.5996C1.90921 12.5672 1.84766 12.5316 1.78934 12.4927C1.79258 12.4959 1.71807 12.4506 1.71807 12.4441C1.71807 12.4441 1.82174 12.5348 1.75046 12.4668C1.70835 12.4279 1.66623 12.3922 1.62735 12.3501C1.61115 12.3339 1.51072 12.2432 1.51396 12.2238C1.50748 12.2432 1.59171 12.3404 1.52692 12.2367C1.50748 12.2076 1.48804 12.1784 1.4686 12.146C1.43945 12.0974 1.41353 12.0456 1.38761 11.9938C1.32929 11.8804 1.40381 12.0294 1.40057 12.0294C1.39733 12.0294 1.37465 11.9581 1.37141 11.9484C1.35197 11.8868 1.33253 11.822 1.31957 11.7605C1.3131 11.7313 1.30986 11.7022 1.30338 11.673C1.28718 11.592 1.3131 11.8123 1.30662 11.6892C1.30338 11.6341 1.30014 11.5791 1.30014 11.5207C1.30014 11.2097 1.30014 10.8955 1.30014 10.5845C1.30014 9.24968 1.30014 7.91489 1.30014 6.58011C1.30014 5.49155 1.30014 4.40299 1.30014 3.31767C1.30014 3.25288 1.30014 3.18808 1.30014 3.12329C1.30014 3.07793 1.30338 3.03257 1.30662 2.98722C1.30986 2.88678 1.29042 3.01637 1.2969 3.02609C1.29366 3.01961 1.31309 2.93862 1.31309 2.93862C1.32605 2.88031 1.33901 2.82523 1.35521 2.77015C1.36493 2.741 1.37465 2.71508 1.38113 2.68916C1.42325 2.54985 1.31633 2.81227 1.38113 2.68592C1.40057 2.65028 1.51396 2.3911 1.55608 2.39434C1.55608 2.39434 1.46536 2.49801 1.5334 2.42674C1.55284 2.4073 1.56904 2.38462 1.58847 2.36194C1.63707 2.31011 1.68891 2.26475 1.74074 2.21615C1.81202 2.14812 1.70835 2.23883 1.70835 2.23883C1.70835 2.23235 1.77962 2.187 1.77962 2.19024C1.82822 2.15784 1.87681 2.12868 1.92541 2.10276C1.95133 2.0898 1.97725 2.07684 2.00316 2.06389C2.11656 2.00557 1.96753 2.08008 1.96753 2.07684C1.97077 2.05741 2.14895 2.01853 2.17487 2.01205C2.20403 2.00557 2.3239 1.96021 2.34658 1.97641C2.33686 1.96993 2.20727 1.98937 2.3077 1.98613C2.33686 1.98613 2.36926 1.98289 2.39842 1.98289C2.42109 1.98289 2.44053 1.98289 2.46321 1.98289C2.61224 1.98289 2.76127 1.98289 2.9103 1.98289C4.17704 1.98289 5.44055 1.98289 6.7073 1.98289C6.80773 1.98289 6.90492 1.98289 7.00536 1.98289C7.34553 1.98289 7.66951 1.68483 7.65331 1.33494C7.63711 0.985045 7.36821 0.686987 7.00536 0.686987C5.89088 0.686987 4.77964 0.686987 3.66516 0.686987C3.26019 0.686987 2.85198 0.683747 2.44701 0.686987C1.15111 0.699946 0.107904 1.70751 0.0107111 2.99046C-0.00872751 3.25612 0.00423151 3.52826 0.00423151 3.79392C0.00423151 4.3706 0.00423151 4.94727 0.00423151 5.52071C0.00423151 6.95916 0.00423151 8.40086 0.00423151 9.83931C0.00423151 10.3156 0.00423151 10.7918 0.00423151 11.268C0.00423151 11.8382 0.0690267 12.402 0.402722 12.8912C0.895166 13.6169 1.67271 13.9992 2.54096 13.9992C2.90382 13.9992 3.26667 13.9992 3.62952 13.9992C5.01614 13.9992 6.406 13.9992 7.79262 13.9992C8.94597 13.9992 10.0993 13.9992 11.2494 13.9992C11.7808 13.9992 12.2926 13.9506 12.7689 13.6817C13.3132 13.3739 13.7181 12.8523 13.8996 12.2594C13.9838 11.9873 14 11.6989 14 11.4138C14 10.1698 14 8.9257 14 7.68163C14 7.56824 14 7.45809 14 7.3447C14 7.00452 13.7019 6.68054 13.352 6.69674C13.0151 6.70322 12.7171 6.97212 12.7171 7.33498Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M9.28275 1.9336C10.3 1.9336 11.3141 1.9336 12.3314 1.9336C12.4091 1.9336 12.4869 1.9336 12.5614 1.9336C12.5808 1.9336 12.6003 1.9336 12.6165 1.9336C12.6197 1.9336 12.6229 1.9336 12.6262 1.9336C12.7525 1.92712 12.5063 1.90768 12.6229 1.9336C12.7201 1.95628 12.5743 1.94008 12.5841 1.91416C12.5808 1.92064 12.6651 1.94656 12.6553 1.95628C12.6456 1.966 12.5387 1.84613 12.6165 1.93684C12.6165 1.93684 12.542 1.82669 12.5776 1.885C12.5808 1.89148 12.5841 1.89796 12.5873 1.9012C12.6132 1.9498 12.6132 1.9498 12.5905 1.89796C12.5841 1.885 12.5808 1.87204 12.5743 1.85909C12.5808 1.87852 12.5873 1.89796 12.5938 1.92064C12.5679 1.98544 12.597 1.83965 12.5873 1.85261C12.5743 1.87204 12.5905 1.88176 12.5873 1.89796C12.5873 1.93684 12.5873 1.97572 12.5873 2.01783C12.5873 2.57831 12.5873 3.13879 12.5873 3.69927C12.5873 4.19171 12.5873 4.68416 12.5873 5.17984C12.5873 5.52002 12.8854 5.84399 13.2353 5.82779C13.5852 5.81159 13.8832 5.54269 13.8832 5.17984C13.8832 4.14312 13.8832 3.10639 13.8832 2.06643C13.8832 1.75541 13.8508 1.4444 13.6564 1.18198C13.3778 0.806163 12.989 0.637695 12.5322 0.637695C11.9685 0.637695 11.4048 0.637695 10.8411 0.637695C10.3227 0.637695 9.80111 0.637695 9.28275 0.637695C8.94258 0.637695 8.6186 0.935753 8.6348 1.28565C8.651 1.63554 8.9199 1.9336 9.28275 1.9336Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M12.5682 1.05622C11.6416 1.98279 10.7183 2.90612 9.79171 3.83269C9.02389 4.60051 8.25283 5.3651 7.48824 6.1394C6.93749 6.69664 6.38997 7.25388 5.83921 7.81112C5.59946 8.0541 5.58002 8.48823 5.83921 8.72797C6.09515 8.96447 6.50012 8.98715 6.75606 8.72797C7.49472 7.97634 8.23015 7.22148 8.97529 6.47634C10.1092 5.34242 11.2464 4.20526 12.3803 3.07135C12.7464 2.70525 13.1125 2.33916 13.4818 1.96983C13.7215 1.73009 13.741 1.28948 13.4818 1.05298C13.2259 0.819713 12.8241 0.800274 12.5682 1.05622Z"
                                    fill="black"
                                  />
                                </svg>
                              </a>
                              <span className="editNameBtn" onClick={() => {
                                setIsCompanyNameChange(true);
                                setIsCompanyNameChangeValue(basicDetails?.companyName);
                                setIsCompanyURLChangeValue(basicDetails?.website);
                              }}><img src={EditnewIcon} className="editNewIcon" width={12} /></span>
                              {/* <a 
                                        href={basicDetails?.LinkedInProfile?.startsWith('http') ? basicDetails?.LinkedInProfile : 'http://' + basicDetails?.LinkedInProfile} target="_blank"
                                        style={{cursor:"pointer"}}
                                      >
                                      <FaLinkedin size={15} style={{marginLeft:'10px'}} />
                                    </a> */}
                            </p>
                          </div>
                        </div>

                        <div class="company-details-inner dtlQuillEdit">
                          <div class="company-details-top">
                            <ul>
                              <li>
                                <span onClick={() => { setIsCompanyLinkedIn(true); setCompanyLinkedInValue(basicDetails?.linkedInProfile) }}> Company Linkedin <img src={EditnewIcon} className="editNewIcon" /></span>
                                <p>{basicDetails?.linkedInProfile ? <a href={basicDetails?.linkedInProfile} target="_blank">{basicDetails?.linkedInProfile}</a> : "NA"}</p>
                              </li>
                              <li><span onClick={() => { setisCompanyFoundedOpen(true); setCompanyFoundedValue(basicDetails?.foundedYear) }}>Founded in <img src={EditnewIcon} className="editNewIcon" /></span><p>{basicDetails?.foundedYear ? basicDetails?.foundedYear : 'NA'}</p></li>
                              <li><span onClick={() => { setisEditCompanySize(true); setEditCompanySizeValue(basicDetails?.teamSize) }}>Team Size <img src={EditnewIcon} className="editNewIcon" /></span><p>{basicDetails?.teamSize ? basicDetails?.teamSize + " employees" : 'NA'}  </p></li>
                              {/* <li><span onClick={() => {setIsCompanyTypeOpen(true);setCompanyTypeValue(basicDetails?.companyType)}}>Company Type <img src={EditnewIcon} className="editNewIcon"/></span><p>{basicDetails?.companyType ? basicDetails?.companyType : 'NA'}</p></li> */}
                              <li><span onClick={() => { setisCompanyIndustryOpen(true); setCompanyIndustryValue(basicDetails?.companyIndustry) }}>Company Industry <img src={EditnewIcon} className="editNewIcon" /></span><p>{basicDetails?.companyIndustry ? basicDetails?.companyIndustry : "NA"}</p></li>
                              <li><span onClick={() => { setisEditCompanyLocation(true); setEditCompanyLocationValue(basicDetails?.headquaters) }}>Headquarters <img src={EditnewIcon} className="editNewIcon" /></span><p>{basicDetails?.headquaters ? basicDetails?.headquaters : "NA"}</p></li>
                            </ul>
                          </div>
                          <h6>About us <span className="editNewIcon" onClick={() => { setisAboutCompany(true); setAboutCompanyValue(basicDetails?.aboutCompany) }}><img src={EditnewIcon} /></span></h6>
                          {!isAboutCompany ?
                            basicDetails?.aboutCompany ?
                              // <ReactQuill
                              //   theme="snow"
                              //   value={basicDetails?.aboutCompany}  
                              //   readOnly
                              //   modules={{ toolbar: false }}    
                              //   className="reactQuillEdit"             
                              //   style={{
                              //   border:"none !important",
                              // }}                 
                              // />: "NA" : 
                              <div className="jobDescrition" dangerouslySetInnerHTML={{ __html: basicDetails?.aboutCompany }} /> : "NA" :
                            <>
                              <ReactQuill
                                theme="snow"
                                value={aboutCompanyValue}
                                onChange={(val) => {
                                  let sanitizedContent = sanitizeLinks(val);
                                  setAboutCompanyValue(sanitizedContent)
                                }}
                                className="heightSize"
                              />
                              <div className="buttonEditGroup mt-4">
                                <button
                                  type="button"
                                  class="btnPrimary blank"
                                  onClick={() => {
                                    setisAboutCompany(false);
                                    setAboutCompanyValue("");
                                  }}
                                >
                                  Cancel
                                </button>
                                {isLoading ? <Spin size="large" /> :  <button
                                  type="button"
                                  class="btnPrimary"
                                  onClick={() => updateCompanyDetails('aboutCompanyDesc', aboutCompanyValue, setisAboutCompany, setAboutCompanyValue)}
                                >
                                  SAVE
                                </button>}
                               
                              </div>
                            </>
                          }
                          <hr />
                          <h6>Funding
                            <span className="editNewIcon" onClick={() => { setIsFundingDetails(true); setFundingData(fundingDetails) }}><img src={EditnewIcon} /></span>
                          </h6>
                          {isFundingDetails ?
                            <div className="editinfo-details-form" >
                              <Checkbox checked={basicDetails?.isSelfFunded} name="isSelfFunded" onChange={(e) => {
                                setBasicDetails({ ...basicDetails, ["isSelfFunded"]: e.target.checked })
                              }}>Self-funded (bootstrapped) company without external investments.</Checkbox>

                              <div className="formFields">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label>Funding Amount</label>
                                      <input
                                        type="text"
                                        placeholder="Ex: 500K, 600K, 2M, 2B...."
                                        value={fundingData && fundingData[0]?.fundingAmount}
                                        name="fundingAmount"
                                        onChange={(e) => {
                                          let _fundValues = [...fundingData];
                                          if (_fundValues[0] === undefined) {
                                            _fundValues[0] = {};
                                          }
                                          _fundValues[0][e.target.name] = e.target.value;
                                          setFundingData(_fundValues);
                                        }}
                                        disabled={basicDetails?.isSelfFunded}
                                        className={`form-control ${basicDetails?.isSelfFunded ? 'disabled-input' : ''}`}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label>Funding Round/Series</label>
                                      <Select
                                        options={seriesOptions}
                                        value={fundingData && fundingData[0]?.series}
                                        onChange={(e) => {
                                          let _fun = [...fundingData];
                                          if (_fun[0] === undefined) {
                                            _fun[0] = {};
                                          }
                                          _fun[0].series = e;
                                          setFundingData(_fun);
                                        }}
                                        disabled={basicDetails?.isSelfFunded}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label>Date</label>
                                      <div className="date-select">
                                        <Select
                                          options={monthOptions}
                                          placeholder="Select month"
                                          value={fundingData && fundingData[0]?.fundingMonth}
                                          onSelect={(e) => {
                                            let _fun = [...fundingData];
                                            if (_fun[0] === undefined) {
                                              _fun[0] = {};
                                            }
                                            _fun[0].fundingMonth = e;
                                            setFundingData(_fun);
                                          }}
                                          showSearch
                                          disabled={basicDetails?.isSelfFunded}
                                        />
                                        <Select
                                          options={yearOptions}
                                          placeholder="Select year"
                                          value={fundingData && fundingData[0]?.fundingYear}
                                          onSelect={(e) => {
                                            let _fun = [...fundingData];
                                            if (_fun[0] === undefined) {
                                              _fun[0] = {};
                                            }
                                            _fun[0].fundingYear = e;
                                            setFundingData(_fun);
                                          }}
                                          showSearch
                                          disabled={basicDetails?.isSelfFunded}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label>Investors</label>
                                      <input
                                        type="text"
                                        value={fundingData && fundingData[0]?.investors}
                                        name="investors"
                                        onChange={(e) => {
                                          let _fundValues = [...fundingData];
                                          if (_fundValues[0] === undefined) {
                                            _fundValues[0] = {};
                                          }
                                          _fundValues[0][e.target.name] = e.target.value;
                                          _fundValues[0]['allInvestors'] = e.target.value;
                                          setFundingData(_fundValues);
                                        }}
                                        disabled={basicDetails?.isSelfFunded}
                                        className={`form-control ${basicDetails?.isSelfFunded ? 'disabled-input' : ''}`}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-12">
                                    <div className="form-group">
                                      <label>Additional Information</label>
                                      <ReactQuill
                                        style={{ width: "100%" }}
                                        value={fundingData && fundingData[0]?.additionalInformation}
                                        onChange={(e) => {
                                          let _fundValues = [...fundingData];
                                          if (_fundValues[0] === undefined) {
                                            _fundValues[0] = {};
                                          }
                                          let sanitizedContent = sanitizeLinks(e);
                                          _fundValues[0].additionalInformation = sanitizedContent;
                                          setFundingData(_fundValues);

                                        }}
                                        className={`heightSize  ${basicDetails?.isSelfFunded ? 'disabled-input' : ''}`}
                                        modules={modules}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="buttonEditGroup">
                                  <button
                                    type="button"
                                    class="btnPrimary blank"
                                    onClick={() => {
                                      setIsFundingDetails(false);
                                      setFundingData([]);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  {isLoading ? <Spin size="large" /> :  <button
                                    type="button"
                                    class="btnPrimary"
                                    onClick={() => updateCompanyDetails('fundingDetails', fundingData, setIsFundingDetails, setFundingData)}
                                  >
                                    SAVE
                                  </button>}
                                 
                                </div>

                              </div>
                            </div>
                            :
                            !basicDetails?.isSelfFunded ?
                              <>
                                <div className="funding-rounds">
                                  <ul>
                                    <li>
                                      <span>Funding Round/Series</span>
                                      <p>{fundingDetails && fundingDetails[0]?.series ? fundingDetails[0]?.series : "NA"}</p>
                                    </li>

                                    <li>
                                      <span>Funding Amount</span>
                                      <p>{fundingDetails && fundingDetails[0]?.fundingAmount ? fundingDetails[0]?.fundingAmount : "NA"}</p>
                                    </li>

                                    <li>
                                      <span>Last Funding Date</span>
                                      <div style={{ display: "flex" }}>
                                        <p>{fundingDetails && fundingDetails[0]?.fundingMonth ? fundingDetails[0]?.fundingMonth : "NA"}</p>
                                        <p>{fundingDetails && fundingDetails[0]?.fundingYear ? "-" + fundingDetails[0]?.fundingYear : !fundingDetails[0]?.fundingMonth ? "" : "NA"}</p>
                                      </div>
                                    </li>

                                    <li>
                                      <span>Investors</span>
                                      <p>
                                        {displayedInvestors?.length > 0 ? displayedInvestors.join(', ') : "NA"}
                                        {allInvestors?.length > 4 && (
                                          <span>
                                            ... <a href="#" onClick={(e) => { e.preventDefault(); toggleInvestors(); }} title="view all">
                                              {showAllInvestors ? 'Show Less' : 'View All'}
                                            </a>
                                          </span>
                                        )}
                                      </p>
                                    </li>
                                  </ul>
                                </div>
                                <div>
                                  <span style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "#232323",
                                    marginBottom: "10px"
                                  }}>Additional Information</span>
                                  {/* <ReactQuill
                                                style={{width:'100%'}}
                                                value={fundingDetails[0]?.additionalInformation}
                                                readOnly  
                                                className="reactQuillEdit"
                                                modules={{toolbar:false}}                                          
                                              />    */}
                                  <div className="jobDescrition" dangerouslySetInnerHTML={{ __html: fundingDetails[0]?.additionalInformation }} />
                                </div>
                              </> :
                              <span>Self-funded (bootstrapped) company without external investments.</span>
                          }

                          <hr />
                          <h6>Culture
                            <span className="editNewIcon" onClick={() => { setIsCulture(true); setCulture(basicDetails?.culture) }}><img src={EditnewIcon} /></span>
                          </h6>
                          {!isCulture &&
                            // <ReactQuill 
                            //   // theme="snow"
                            //   value={basicDetails?.culture}
                            //   readOnly
                            //   modules={{ toolbar: false }}    
                            //   className="reactQuillEdit"
                            // /> 
                            <div className="jobDescrition" dangerouslySetInnerHTML={{ __html: basicDetails?.culture }} />
                          }
                          {isCulture &&
                            <ReactQuill
                              theme="snow"
                              value={culture}
                              className="heightSize"
                              onChange={(e) => {
                                let sanitizedContent = sanitizeLinks(e);
                                setCulture(sanitizedContent)
                              }}
                              modules={modules}
                            />
                          }

                          {!isCulture ?
                            <>
                              <div className="img-section mt-24">
                                {cultureDetails?.map((img, index) => {
                                  return (
                                    <div className="img-thumb" key={index}>
                                      <img src={img?.cultureImage} alt={index} />
                                      <span className="DeleteBtn"
                                        onClick={async () => {
                                          let _culDetails = [...cultureDetails];
                                          if (img?.internalId) {
                                            let index = _culDetails.findIndex(
                                              (val) => val.internalId === img.internalId
                                            );
                                            _culDetails.splice(index, 1);
                                          } else {
                                            setIsLoading(true);
                                            // let res = await DeleteCultureImage({
                                            //   cultureID: img?.cultureID,
                                            //   companyID: previewIDs?.companyID,
                                            //   culture_Image: img?.internalName ? img?.internalName : img?.cultureImage
                                            // });
                                            setIsLoading(false);
                                            let index = _culDetails.findIndex(
                                              (val) => val.cultureID === img.cultureID
                                            );
                                            _culDetails.splice(index, 1);
                                          }
                                          setCultureDetails(_culDetails);
                                        }}
                                      ><img src={DeleteImg} alt="delete" /></span>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="img-section mt-24">
                                {youTubeDetails && youTubeDetails?.map((link, index) => {
                                  return (
                                
                                    <YouTubeVideo key={index} videoLink={link?.youtubeLink} onDelete={async () => {
                                      let _youtubeVal = [...youTubeDetails];
                                      if (link?.internalId) {
                                        let index = _youtubeVal?.findIndex((val) => val?.internalId === link?.internalId);
                                        _youtubeVal.splice(index, 1);
                                      } else {
                                        let index = _youtubeVal?.findIndex((val) => val?.youtubeID === link?.youtubeID);
                                        _youtubeVal.splice(index, 1);
                                        setIsLoading(true);
                                        // let res = await DeleteYoutubeLink({
                                        //   youtubeID: link?.youtubeID,
                                        //   companyID: previewIDs?.companyID,
                                        // });
                                        setIsLoading(false);
                                      }
                                      setYouTubeDetails(_youtubeVal);
                                    }} />
                                
                                  )
                                })
                                }
                              </div>
                            </>
                            :
                            <>
                              <div className="mt-4">
                                <h3>Pictures</h3>
                                <label
                                  className="FilesDragAndDrop__area"
                                  style={{ width: "100%", cursor: "pointer" }}
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M8.99994 17.7505C8.58994 17.7505 8.24994 17.4105 8.24994 17.0005V12.8105L7.52994 13.5305C7.23994 13.8205 6.75994 13.8205 6.46994 13.5305C6.17994 13.2405 6.17994 12.7605 6.46994 12.4705L8.46994 10.4705C8.67994 10.2605 9.00994 10.1905 9.28994 10.3105C9.56994 10.4205 9.74994 10.7005 9.74994 11.0005V17.0005C9.74994 17.4105 9.40994 17.7505 8.99994 17.7505Z"
                                      fill="#F52887"
                                    />
                                    <path
                                      d="M10.9999 13.7495C10.8099 13.7495 10.6199 13.6795 10.4699 13.5295L8.46994 11.5295C8.17994 11.2395 8.17994 10.7595 8.46994 10.4695C8.75994 10.1795 9.23994 10.1795 9.52994 10.4695L11.5299 12.4695C11.8199 12.7595 11.8199 13.2395 11.5299 13.5295C11.3799 13.6795 11.1899 13.7495 10.9999 13.7495Z"
                                      fill="#F52887"
                                    />
                                    <path
                                      d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H14C14.41 1.25 14.75 1.59 14.75 2C14.75 2.41 14.41 2.75 14 2.75H9C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V10C21.25 9.59 21.59 9.25 22 9.25C22.41 9.25 22.75 9.59 22.75 10V15C22.75 20.43 20.43 22.75 15 22.75Z"
                                      fill="#F52887"
                                    />
                                    <path
                                      d="M22 10.7505H18C14.58 10.7505 13.25 9.42048 13.25 6.00048V2.00048C13.25 1.70048 13.43 1.42048 13.71 1.31048C13.99 1.19048 14.31 1.26048 14.53 1.47048L22.53 9.47048C22.74 9.68048 22.81 10.0105 22.69 10.2905C22.57 10.5705 22.3 10.7505 22 10.7505ZM14.75 3.81048V6.00048C14.75 8.58048 15.42 9.25048 18 9.25048H20.19L14.75 3.81048Z"
                                      fill="#F52887"
                                    />
                                  </svg>
                                  <p>
                                    <span>Click to Upload</span>
                                  </p>
                                  <span> (Max. File size: 25 MB)</span>
                                  <input
                                    type="file"
                                    style={{ display: "none" }}
                                    name="cultureImage"
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

                                      const maxSize = 25 * 1024 * 1024;
                                      if (file.size > maxSize) {
                                        message.error("Maximum image size are 25 MB.");
                                        return;
                                      }

                                      const reader = new FileReader();
                                      const loadEndPromise = new Promise((resolve, reject) => {
                                        reader.onloadend = () => {
                                          resolve(reader.result);
                                        };
                                        reader.onerror = (error) => {
                                          reject(error);
                                        };
                                      });
                                      reader.readAsDataURL(file);
                                      try {
                                        setIsLoading(true);
                                        const result = await loadEndPromise;
                                        setIsLoading(false);
                                        let _culVal = [...cultureDetails];
                                        _culVal.push({
                                          cultureImage: result,
                                          internalId: Math.random(),
                                          cultureID: null,
                                          internalName: file.name,
                                          fileUpload: {
                                            base64ProfilePic: result,
                                            extenstion: file.name.split(".").pop(),
                                          },
                                        });
                                        setCultureDetails(_culVal);
                                      } catch (error) {
                                        console.error("Error reading the file:", error);
                                      }
                                    }}
                                  />
                                </label>

                                <div className="img-section">
                                  {cultureDetails?.map((img, index) => {
                                    return (
                                      <div className="uploaded-content" key={index}>
                                        <img src={img?.cultureImage} alt={index} />
                                        <a
                                          onClick={async () => {
                                            let _culDetails = [...cultureDetails];
                                            if (img?.internalId) {
                                              let index = _culDetails.findIndex(
                                                (val) => val.internalId === img.internalId
                                              );
                                              _culDetails.splice(index, 1);
                                            } else {
                                              setIsLoading(true);
                                              // let res = await DeleteCultureImage({
                                              //   cultureID: img?.cultureID,
                                              //   companyID: previewIDs?.companyID,
                                              //   culture_Image: img?.internalName ? img?.internalName : img?.cultureImage
                                              // });
                                              setIsLoading(false);
                                              let index = _culDetails.findIndex(
                                                (val) => val.cultureID === img.cultureID
                                              );
                                              _culDetails.splice(index, 1);
                                            }
                                            setCultureDetails(_culDetails);
                                          }}
                                          className="delete-uploaded"
                                        >
                                          <img src={DeleteIcon} alt={index} />
                                        </a>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="mb-4 mt-2">
                                <label>YouTube Links</label>
                                <input
                                  type="text"
                                  value={youTubeValue}
                                  name="investors"
                                  className="form-control"
                                  onChange={(e) => {
                                    setYoutubeValue(e.target.value);
                                  }}
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?(\S+)$/;
                                      if (!regex.test(e.target.value)) {
                                        return message.error('Youtube link is not valid')
                                      }
                                      let _youtubeVal = [...youTubeDetails];
                                      let index = _youtubeVal?.findIndex((val) => val?.youtubeLink === e.target.value);
                                      if (index === -1) {
                                        _youtubeVal.push({ youtubeID: null, internalId: Math.random(), youtubeLink: youTubeValue });
                                      }
                                      setYouTubeDetails(_youtubeVal);
                                      setYoutubeValue("")
                                    }
                                  }}
                                // onBlur={(e) => {
                                //   let _youtubeVal = [...youTubeDetails];
                                //   const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?(\S+)$/;
                                //   if(!regex.test(e.target.value)){
                                //     return message.error('Youtube link is not valid')
                                //   }
                                //   let index = _youtubeVal?.findIndex((val) => val?.youtubeLink === e.target.value);
                                //     if(index === -1){
                                //       _youtubeVal.push({youtubeID:null,internalId:Math.random(),youtubeLink:youTubeValue});
                                //     } 
                                //   setYouTubeDetails(_youtubeVal);
                                // }}
                                />
                                {youTubeDetails?.map((link, index) => {
                                  return (
                                    <div className="youtube-links" key={index}>
                                      {link?.youtubeLink} &nbsp;
                                      <img
                                        src={deleteIcon}
                                        alt="delete"
                                        width={10}
                                        onClick={async (e) => {
                                          let _youtubeVal = [...youTubeDetails];
                                          if (link?.internalId) {
                                            let index = _youtubeVal?.findIndex((val) => val?.internalId === link?.internalId);
                                            _youtubeVal.splice(index, 1);
                                          } else {
                                            let index = _youtubeVal?.findIndex((val) => val?.youtubeID === link?.youtubeID);
                                            _youtubeVal.splice(index, 1);
                                            setIsLoading(true);
                                            // let res = await DeleteYoutubeLink({
                                            //   youtubeID: link?.youtubeID,
                                            //   companyID: previewIDs?.companyID,
                                            // });
                                            setIsLoading(false);
                                          }
                                          setYouTubeDetails(_youtubeVal);
                                        }}
                                      />
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="buttonEditGroup mt-4 mb-4">
                                <button
                                  type="button"
                                  class="btnPrimary blank"
                                  onClick={() => {
                                    setIsCulture(false);
                                    setCulture("");
                                  }}
                                >
                                  Cancel
                                </button>
                                {isLoading ? <Spin size="large" /> : <button
                                  type="button"
                                  class="btnPrimary"
                                  onClick={() => updateCompanyDetails('culture', culture, setIsCulture, setCulture)}
                                >
                                  SAVE
                                </button>}
                                
                              </div>
                            </>
                          }

                          <h6>Company perks and benefits
                            <span className="editNewIcon" onClick={() => { setIsCompanyBenefits(true); setPerkDetailsValue(perkDetails) }}><img src={EditnewIcon} /></span></h6>
                          <div className="company-benefits">
                            {isCompanyBenefits ?
                              <>
                                <Select
                                  mode="tags"
                                  onChange={(values) => {
                                    const uniqueValues = Array.from(new Set(values));
                                    setPerkDetailsValue(uniqueValues);
                                  }}
                                  placeholder="Mention perks and advantages"
                                  value={perkDetailsValue}
                                  options={companyPerks?.map((item) => ({ id: item?.id, value: item?.value }))}
                                />
                                <div className="buttonEditGroup mt-4">
                                  <button type="button" class="btnPrimary blank" onClick={() => { setIsCompanyBenefits(false); setPerkDetailsValue([]) }}> Cancel </button>
                                  {isLoading ? <Spin size="large" /> : <button type="button" class="btnPrimary" onClick={async () => {
                                    setPerkDetails(perkDetailsValue);
                                    setIsCompanyBenefits(false);
                                    let payload = {
                                      IsUpdateFromPreviewPage:true,
                                      "basicDetails": {
                                        "companyID": previewIDs?.companyID,
                                      },
                                      "perkDetails": perkDetailsValue
                                    }
                                    setIsLoading(true);
                                    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
                                    setIsLoading(false);
                                  }}> SAVE </button>}
                                  
                                </div>
                              </>
                              :
                              <ul>
                                {perkDetails?.map((perkVal, index) => {
                                  return (
                                    <li key={index}>
                                      <span>{perkVal}</span>
                                    </li>
                                  )
                                })}
                              </ul>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="formFields">
                  <div className="formFields-box">
                    <div className="formFields-box-inner">
                      <h2 className="formFields-box-title">Enhance Candidate Matchmaking <span className="boxInnerInfo">
                        This information will not be visible to the candidates or on job board, but will be used by the system/internal team to find more accurate match for this HR/Job.</span></h2>
                      <div className="vitalInformationContent">
                       
                        <h6>Industry from which candidates are neededs
                          <span className="editNewIcon" onClick={() => {
                            setisIndustryCandidatesOpen(true);
                            setSpecificIndustry(jobPreview?.industryType ? jobPreview?.industryType?.split("^") : [])
                          }} ><img src={EditnewIcon} /></span>
                        </h6>
                        <div className="company-benefits">
                          <ul>
                            {(!jobPreview?.industryType || jobPreview?.industryType?.length == 0) ? "NA" :
                              jobPreview?.industryType?.split("^")?.map((val, index) => {
                                return (
                                  <li key={index}><span>{val}</span></li>
                                )
                              })}
                          </ul>
                        </div>
                        <h6>Need candidate with people management experience?
                          <span className="editNewIcon" onClick={() => {
                            setisCandidatePeopleOpen(true);
                            setHasPeopleManagementExp(jobPreview?.hasPeopleManagementExp)
                          }} ><img src={EditnewIcon} /></span>
                        </h6>
                        <div className="company-benefits">
                          {jobPreview?.hasPeopleManagementExp == null ? "NA" :
                            <ul>
                              <li>
                                {jobPreview?.hasPeopleManagementExp ? <span>Yes</span> : <span>No</span>}
                              </li>
                            </ul>}
                        </div>

                        <h6 className="mt-2">Prerequisites or key highlights

                          <span className="editNewIcon" onClick={() => {
                            setIsPrerequisites(true);
                            setPrerequisites(jobPreview?.prerequisites);
                          }}><img src={EditnewIcon} /></span>
                        </h6>

                        {isPrerequisites ?
                          <div className="row formFields Filescopypaste__area customPlaceHolder">
                            <div className="col-12">
                            {isEmptyOrWhitespace(prerequisites) && 
                            <div className="placeHolderText">
                                <p>Ex:</p>
                                <ul>
                                    <li>Seeking candidates with startup experience, preferably from a fast-paced and agile environment.</li>
                                    <li>Targeting candidates with a background from [Specific Company Name], where they developed [Desirable Skills or Experience]</li>
                                    <li>Looking for candidates who have hands-on experience working with [Specific Tech Environment, e.g. cloud-native, DevOps, etc.], preferably in a similar industry/sector.</li>
                                </ul>
                            </div>}  
                              <ReactQuill
                                theme="snow"
                                className="heightSize"
                                value={prerequisites}
                                onChange={(e) => {
                                  let sanitizedContent = sanitizeLinks(e);
                                  setPrerequisites(sanitizedContent)
                                }}
                                modules={modules}
                              />
                              <div className="buttonEditGroup mt-4">
                                <button type="button" class="btnPrimary blank" onClick={() => { setIsPrerequisites(false); setPrerequisites('') }}> Cancel </button>
                                {isLoading ? <Spin size="large" /> : <button type="button" class="btnPrimary" onClick={updatePrerequisites}> SAVE </button>}
                                
                              </div>
                            </div>
                          </div>
                          :
                          <div className="company-benefits">
                            {/* <ReactQuill
                                          theme="snow"
                                          className="reactQuillEdit" 
                                          value={jobPreview?.prerequisites}
                                          onChange={(e) => setPrerequisites(e)}
                                          modules={{ toolbar: false }}
                                          readOnly                                      
                                        />   */}
                            <div className="jobDescrition prerequisites" dangerouslySetInnerHTML={{ __html: jobPreview?.prerequisites ? jobPreview?.prerequisites : "NA" }} />
                            {/* <h3>{jobPreview?.prerequisites}</h3> */}
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>                
                {getcompanyID === 2 &&  
                <div className="formFields">
                  <div className="formFields-box">
                    <div className="formFields-box-inner">
                      <h2 className="formFields-box-title">Hiring Team</h2>                      
                      <div className="vitalInformationContent preShareDetailsWrap">  
                      {/* { jobPreview?.hrpocUserID?.length === 0 ?
                                   <h3>Need Assistance or Have Questions?
                                  <span className="editNewIcon" 
                                    onClick={() => {
                                      setIsEditUserInfo(true);     
                                      if(jobPreview?.hrpocUserID?.length>0){
                                        sethrpocUserID([...jobPreview?.hrpocUserID?.map(item => Number(item.hrwiseContactId))]);
                                      }else{
                                        sethrpocUserID([]);
                                      }                                             
                                      setshowHRPOCDetailsToTalents(jobPreview?.showHRPOCDetailsToTalents);
                                    }}
                                    >
                                    <img src={EditnewIcon}/>
                                    </span></h3>  :
                      } */}
                      <h3>Need Assistance or Have Questions?</h3>
                      <p>Have questions about this job opportunity? Want to learn more about the role or discuss your candidature? 
                      Contact the recruiter directly to get accurate insights and guidance for the application process.</p> 
                                      <div className="preShareDetailsBox">                      
                                        {
                                          jobPreview?.hrpocUserID?.map((val,index) => {                                            
                                            return(
                                              <div className="preShareDetailsItem" key={index}>                                                
                                                <div className="preShareDetailsAction">  
                                                  {val?.isDefaultUser ? <Tooltip title={val?.iInfoMsg}>
                                  <img src={infosmallIcon} alt="info" />
                                </Tooltip> :<button className="preShareDetailsBtn" title="Delete"
                                                    onClick={async () => {             
                                                      setIsLoading(true);       
                                                      let response = await deleteHRPOC(val?.hrwiseContactId);                                                  
                                                      setJobPreview((prev) => ({...prev,  
                                                        hrpocUserID:response?.responseBody?.details
                                                      }));  
                                                      setIsLoading(false);
                                                  }}
                                                  ><img src={DeleteCircleIcon} alt="delete-icon"/></button>
                                                  }                                               
                                                  
                                                </div>
                                                <div className="thumbImages">                                                
                                                  <Avatar style={{ width: "66px",height: "66px", display: "flex",alignItems: "center"}} size="large">{val?.fullName?.substring(0, 2).toUpperCase()}</Avatar>
                                                </div>
                                                <div className="preShareDetailsInfo">
                                                  <h4>{val?.fullName}
                                                  <span className="preShareToolTip">{val?.hrwiseContactId === userData?.LoggedInUserID &&
                                                        <Tooltip title="You cannot delete this user because you are the default user of this job post. You can choose to show or hide your information from the candidates using the checkbox below."> 
                                                            <img src={infosmallIcon} alt='info' />
                                                        </Tooltip>
                                                        }
                                                  </span>
                                                  </h4>
                                                  <ul>
                                                    <li>
                                                      <img src={MailIcon} alt="email-icon"/> 
                                                      <a href={`mailto:${val?.emailID}`}>{val?.emailID}</a>
                                                      <Tooltip title={val?.showEmailToTalent ? "Email is visible to candidates" : "Email is hidden from candidates"}> 
                                                            <img src={infosmallIcon} alt='info' />
                                                        </Tooltip>
                                                    </li>
                                                    <li><img src={PhoneIcon} alt="phone-icon"/>
                                                    {val?.contactNo ? 
                                                    <>
                                                    <spna>{val?.contactNo}</spna>
                                                    <Tooltip title={val?.showContactNumberToTalent ? "Contact number is visible to candidates" : "Contact number is hidden from candidates"}> 
                                                    <img src={infosmallIcon} alt='info' />
                                                </Tooltip></> : 
                                                    <span className="preShareDeailLink" onClick={() => {
                                                      setIsContactEdit(true);
                                                      // getPOCUsers();
                                                      setPOCDetails({...pocDetails,guid:val?.guid,isEdit:false,pocId:val?.hrwiseContactId,contactNo:"",showContactNumberToTalent:null})
                                                    }}>Add Contact Number</span>
                                                    }
                                                      {val?.contactNo && <img onClick={() => {
                                                          setIsContactEdit(true)
                                                          setPOCDetails({...pocDetails,guid:val?.guid,isEdit:true,pocId:val?.hrwiseContactId,contactNo:val?.contactNo,showContactNumberToTalent:val?.showContactNumberToTalent})
                                                        }} src={EditCircleIcon} alt="edit-icon" className="preShareDeailEdit"/>
                                                      }
                                                    </li>
                                                  </ul>                                                
                                                </div>                                              
                                              </div>
                                            )
                                          })
                                        }                                                                       
                      </div>   
                      {isEditUserInfo ? 
                          <>
                          <div className="form-group mt-4">
                            <label>Assign users to this job post</label>
                            <Select
                              mode="multiple"
                              style={{ width: "100%" }}
                              value={hrpocUserID}
                              onChange={(values, _) => {  
                                if(!values?.includes(jobPreview?.contactId)) return                                                                                                         
                                const newPocDetails = values?.map(id => {   
                                  const existingDetail = hrpocUserDetails?.find(detail => detail.pocUserID === id);
                                  if (existingDetail) return existingDetail;   
                                  let _userData = allUserData.find(user => user.contactId === id);
                                  return {
                                    pocUserID: _userData?.contactId,
                                    contactNo: _userData?.contactNumber,
                                    showEmailToTalent: true,
                                    showContactNumberToTalent: true,
                                    email: _userData?.emailId,
                                    fullName: _userData?.contactName
                                  };
                                }).filter(Boolean);     
                                sethrpocUserID(values);                                     
                                sethrpocUserDetails(newPocDetails);                                                                                 
                            }}
                            tagRender={(props) => {
                              const { label, value, closable, onClose } = props;
                              let pocData =    jobPreview?.hrpocUserID?.find(it => it.hrwiseContactId === value)
                              return (
                                <div className="ant-select-selection-item" style={{ marginRight: 3, fontWeight:'bold',color:'black' }}>
                                  {label}
                                  {!pocData?.isDefaultUser && closable && (
                                    <span
                                      className="ant-select-selection-item-remove"
                                      style={{fontSize:"22px",color: "#232323" , fontWeight:"normal"}}
                                      onClick={onClose}
                                    >
                                      &times;
                                    </span>
                                  )}
                                </div>
                              );
                          }}
                              placeholder="Select users"
                              tokenSeparators={[","]}
                              options={activeUserData}
                              menuIsOpen
                            />                                            
                          </div>
                          <div className="noJobDesInfo mt-4">Candidates can view the contact information (email and mobile number) of the selected users. You can choose which details to share.</div>
                          
                          <div className="preShareDetailsBox hireTeamInfo">
                                  {hrpocUserDetails?.map((Val,index) => {    
                                   
                                    let pocData =    jobPreview?.hrpocUserID?.find(it => it.hrwiseContactId === Val.pocUserID)                                 
                                    return(
                                    <div className="preShareDetailsItem" key={index}>
                                        <div className="preShareDetailsAction">{pocData?.isDefaultUser ? <Tooltip title={pocData?.iInfoMsg}>
                                  <img src={infosmallIcon} alt="info" />
                                </Tooltip> : 
                                            <button className="preShareDetailsBtn" title="Delete" onClick={() => handleDelete(Val.pocUserID)}><img src={DeleteCircleIcon} alt="delete-icon" /></button>
                                       } </div>
                                        <div className="thumbImages">
                                            <Avatar style={{ width: "75px", height: "75px", display: "flex", alignItems: "center" }} size="large">{Val?.fullName?.substring(0, 2).toUpperCase()}</Avatar>
                                        </div>
                                        <div className="preShareDetailsInfo">
                                            <h4>{Val?.fullName} <span className="preShareToolTip">{Val?.pocUserID === userData?.LoggedInUserID &&
                                                <Tooltip title="You cannot delete this user because you are the default user of this job post. You can choose to show or hide your information from the candidates using the checkbox below."> 
                                                    <img src={infosmallIcon} alt='info' />
                                                </Tooltip>
                                                }</span></h4>
                                            <ul>
                                                <li>
                                                    <div className="form-group justifyCenter">
                                                        <i className="fieldIcon"><img src={MailIcon} alt="email-icon" /></i>
                                                        <input type="text" className="form-control" placeholder="Enter email address" value={Val?.email} disabled />
                                                        <Checkbox name="userShow" 
                                                        checked={Val?.showEmailToTalent}
                                                        onChange={(e) => handleCheckboxChange(index, 'showEmailToTalent', e.target.checked)}
                                                        >Show email to candidates</Checkbox>
                                                    </div>
                                                </li> 

                                                <li>
                                                    <div className="phonConturyWrap previewHRPhoneNoField" >
                                                    <PhoneInput
                                                        placeholder="Enter number"
                                                        key={'phoneNumber'}
                                                        value={Val?.contactNo}
                                                        onChange={value => {
                                                          handleContactNoChange(index, value)
                                                        
                                                        }}
                                                        country={countryCodeData}
                                                        disableSearchIcon={true}
                                                        enableSearch={true}
                                                        />
                                                        {/* <i className="fieldIcon"><img src={PhoneIcon} alt="phone-icon" /></i>
                                                        <input type="text" className="form-control" placeholder="Enter mobile number" value={Val?.contactNo} maxLength={10}
                                                        onChange={(e) => handleContactNoChange(index, e.target.value)}
                                                        onBlur={(e) => {
                                                          const regex = /^[6-9]\d{9}$/;                                                                    
                                                            if (e.target.value && !regex.test(e.target.value)) {      
                                                              sethrpocUserDetails(prevDetails =>
                                                                prevDetails.map((detail, i) =>
                                                                  i === index ? { ...detail, contactNo: '' } : detail
                                                                )
                                                              );
                                                              return message.error('Invalid phone number. Must be 10 digits and start with 6-9.');
                                                            }
                                                        }}
                                                        /> */}
                                                        <Checkbox name="userShow" disabled={Val?.contactNo ? false : true} checked={Val?.contactNo?Val?.showContactNumberToTalent:false} onChange={(e) => handleCheckboxChange(index, 'showContactNumberToTalent', e.target.checked)}>Show mobile number to candidates</Checkbox>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    )
                                  })}
                                </div> 

                          <div className="buttonEditGroup mt-4">
                              <button type="button" class="btnPrimary blank" onClick={() => {setIsEditUserInfo(false);sethrpocUserID([]);setshowHRPOCDetailsToTalents(null);}}> Cancel </button>
                              {isLoading ? <Spin size="large" /> : <button type="button" class="btnPrimary" onClick={updateUserInfo}> SAVE </button>}   
                          </div> 
                          </> 
                          : 
                          <h3 className="mt-3 addMorePoc" onClick={() => {
                            setIsEditUserInfo(true);     
                            if(jobPreview?.hrpocUserID?.length>0){
                              sethrpocUserDetails(jobPreview?.hrpocUserID?.map(user => ({
                                pocUserID: user.hrwiseContactId,
                                contactNo: user.contactNo,
                                showEmailToTalent: user.showEmailToTalent,
                                showContactNumberToTalent: user.showContactNumberToTalent,
                                email:user.emailID,
                                fullName:user.fullName
                            })));
                            const hrwiseContactIds = jobPreview?.hrpocUserID?.map(user => Number(user.hrwiseContactId));
                            sethrpocUserID(hrwiseContactIds);   
                            }else{
                              sethrpocUserID([]);
                            }                                             
                            setshowHRPOCDetailsToTalents(jobPreview?.showHRPOCDetailsToTalents);
                          }}>Add {jobPreview?.hrpocUserID.length > 0 && "Another"} User</h3>
                      }
                      </div>
                     
                    </div>
                  </div>
                </div>}              
                <div class="previewHRAction">
                  <button
                    type="button"
                    class="btnPrimary"
                    onClick={() => {
                      if(isAnyFieldUpdate && !isSaveAllChanges){
                        confirm({
                          title: 'Please save your changes before leaving this page to avoid losing any unsaved data.',
                          okText: 'SAVE CHANGES',
                          okButtonProps: {
                            style: {
                              fontSize:"14px",
                              fontWeight:700,                              
                              height: "41px",
                              minHeight:"46px",
                              color: "#232323",
                              fontStyle: "normal",
                              lineHeight: "normal",                                                            
                              border: 0,
                              transition: "0.5s all",
                              background: "#FFDA30",
                              padding: "0 25px",                                                            
                              borderRadius: "27px",                                    
                            },
                          },
                          onOk() {
                            UpdateSaveDataToATS();
                          },                               
                        });  
                      }else{
                        setViewPosition(false);
                        setError({});
                        setisEditRolesAndRes(false)
                        setisEditRequirenments(false)
                        setisEditSkills(false)
                        setChangeStatus(true)
                        setEditWhatWeOffer("");          
                        setIsAutogenerateQuestions(false)
                      } 
                    }}
                  >
                    close
                  </button>
                </div>
              </div>}

              
            </div>
          </div>
         
        </div>
      </Modal>


      {/* Company Linked in Modal */}
      <Modal
        centered
        open={isCompanyLinkedIn}
        onCancel={() => {
          setIsCompanyLinkedIn(false);
          setCompanyLinkedInValue('');
        }}
        className="customModal jobPostEditModal"
        footer={null}
      >
        <div className="modalContent">
          <div className="row formFields">
            <div className="col-12">
              <div className="form-group mb-0">
                <label>Company Linkedin URL</label>
                <input type="text"
                  placeholder="https://www.linkedin.com/company/companyname"
                  className="form-control" value={companyLinkedInValue}
                  onChange={(e) => setCompanyLinkedInValue(e.target.value)} />
                <div className="buttonEditGroup">
                  <button type="button" class="btnPrimary blank" onClick={() => { setIsCompanyLinkedIn(false); setCompanyLinkedInValue('') }}> Cancel </button>
                  {isLoading ? <Spin size="large" /> :  <button type="button" class="btnPrimary" onClick={() => updateCompanyDetails('linkedInProfile', companyLinkedInValue, setIsCompanyLinkedIn, setCompanyLinkedInValue)}> SAVE </button>}
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/*  Founded in Modal */}
      <Modal
        centered
        open={isCompanyFoundedOpen}
        onCancel={() => {
          setisCompanyFoundedOpen(false);
          setCompanyFoundedValue('');
        }}
        width={267}
        className="customModal jobPostEditModal PrevEditmodal"
        footer={null}
      >
        <div className="modalContent">
          <div className="row formFields">
            <div className="col-12">
              <div className="form-group mb-0">
                <label>Founded in</label>
                <Select
                  options={foundedIn}
                  name="foundedYear"
                  placeholder="Select year"
                  showSearch
                  value={companyFoundedValue}
                  onChange={(e) => {
                    setCompanyFoundedValue(e);
                  }}
                />
                <div className="buttonEditGroup">
                  <button type="button" class="btnPrimary blank" onClick={() => { setisCompanyFoundedOpen(false); setCompanyFoundedValue('') }}> Cancel </button>
                  {isLoading ? <Spin size="large" /> :  <button type="button" class="btnPrimary" onClick={() => updateCompanyDetails('foundedYear', companyFoundedValue, setisCompanyFoundedOpen, setCompanyFoundedValue)}> SAVE </button>}
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/*  Company Name in Modal */}
      <Modal
        centered
        open={isCompanyNameChange}
        onCancel={() => {
          setIsCompanyNameChange(false);
          setIsCompanyNameChangeValue('');
          setIsCompanyURLChangeValue('');
        }}
        width={267}
        className="customModal jobPostEditModal PrevEditmodal"
        footer={null}
      >
        <div className="modalContent">
          <div className="row formFields">
            <div className="col-12">
              <div className="form-group mb-2">
                <label>Company Name </label>
                <input
                  type="text"
                  className="form-control"
                  name="companyName"
                  value={companyNameChangeValue}
                  onChange={(e) => setIsCompanyNameChangeValue(e.target.value)}
                  placeholder="Please enter company name"
                />
              </div>
              <div className="form-group mb-0">
                <label>Change company website</label>
                <input
                  type="text"
                  className="form-control"
                  name="companyName"
                  value={companyURLChangeValue}
                  onChange={(e) => setIsCompanyURLChangeValue(e.target.value)}
                  placeholder="Please enter company name"
                />
              </div>
              <div className="buttonEditGroup">
                <button type="button" class="btnPrimary blank" onClick={() => { setIsCompanyNameChange(false); setIsCompanyNameChangeValue(''); setIsCompanyURLChangeValue(''); }}> Cancel </button>
                {isLoading ? <Spin size="large" /> : <button type="button" class="btnPrimary" onClick={() =>
                  updateCompanyDetails('companyName', companyNameChangeValue, setIsCompanyNameChange, setIsCompanyNameChangeValue)
                }> SAVE </button>}
                
              </div>
            </div>
          </div>
        </div>
      </Modal>

      
      {/* Headquarters Location modal */}
      <Modal
        centered
        open={iseditCompanyLocation}
        onCancel={() => {
          setisEditCompanyLocation(false);
          setEditCompanyLocationValue('');
        }}
        width={461}
        className="customModal jobPostEditModal"
        footer={null}
      >
        <div className="modalContent">
          <div className="row formFields" >
            <div className="col-12">
              <div className="form-group mb-0">
                <label>Headquarters</label>
                <input
                  type="text"
                  className="form-control"
                  name="headquaters"
                  value={editCompanyLocationValue}
                  onChange={(e) => setEditCompanyLocationValue(e.target.value)}
                />
                <div className="buttonEditGroup">
                  <button type="button" class="btnPrimary blank" onClick={() => { setisEditCompanyLocation(false); setEditCompanyLocationValue(''); }}> Cancel </button>
                  {isLoading ? <Spin size="large" /> : <button type="button" class="btnPrimary" onClick={() => updateCompanyDetails('headquaters', editCompanyLocationValue, setisEditCompanyLocation, setEditCompanyLocationValue)}> SAVE </button>}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/*  Change team size Modal */}
      <Modal
        centered
        open={iseditCompanySize}
        onCancel={() => {
          setisEditCompanySize(false);
          setEditCompanySizeValue('');
        }}
        width={267}
        className="customModal jobPostEditModal"
        footer={null}
      >
        <div className="modalContent">
          <div className="row formFields">
            <div className="col-12">
              <div className="form-group mb-0">
                <label>Change Company Size</label>
                <input
                  type="text"
                  className="form-control"
                  name="teamSize"
                  value={editCompanySizeValue}
                  placeholder="Please enter company size"
                  onChange={(e) => {
                    const regex = /^[0-9]\d*$/;
                    if (e.target.value === "" || regex.test(e.target.value)) {
                      setEditCompanySizeValue(e.target.value);
                    }
                  }}
                />

                <div className="buttonEditGroup">
                  <button type="button" class="btnPrimary blank" onClick={() => { setisEditCompanySize(false); setEditCompanySizeValue(''); }}> Cancel </button>
                  {isLoading ? <Spin size="large" /> : <button type="button" class="btnPrimary" onClick={() => updateCompanyDetails('teamSize', editCompanySizeValue, setisEditCompanySize, setEditCompanySizeValue)}> SAVE </button>}
                  
                </div>

              </div>
            </div>
          </div>
        </div>

      </Modal>

      {/*  Company industry Modal */}
      <Modal
        centered
        open={isCompanyIndustryOpen}
        onCancel={() => {
          setisCompanyIndustryOpen(false);
          setCompanyIndustryValue('');
        }}
        width={461}
        className="customModal jobPostEditModal PrevEditmodal"
        footer={null}
      >
        <div className="modalContent">
          <div className="row formFields">
            <div className="col-12">
              <div className="form-group mb-0">
                <label>Company industry</label>
                <input type="text" placeholder="Please company industry" className="form-control" value={companyIndustryValue} onChange={(e) => setCompanyIndustryValue(e.target.value)} />
                <div className="buttonEditGroup">
                  <button type="button" class="btnPrimary blank" onClick={() => { setisCompanyIndustryOpen(false); setCompanyIndustryValue(''); }}> Cancel </button>
                  {isLoading ? <Spin size="large" /> : <button type="button" class="btnPrimary" onClick={() => updateCompanyDetails('industry', companyIndustryValue, setisCompanyIndustryOpen, setCompanyIndustryValue)}> SAVE </button>}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Budget Modal */}
      <Modal
        centered
        open={iseditBudget}
        onCancel={() => {
          setisEditBudget(false);
          setEditBudget({
            currency: "USD",
            budgetFrom: 0,
            budgetTo: 0,
            convertedFromValue: 2000,
            isConfidentialBudget: false
          });
          setError({});
        }}
        width={610}
        className="customModal jobPostEditModal"
        maskClosable={false}
        footer={null}
      >
        <div className="modalContent">
          <div className="row formFields">
            <div className="col-12">
              <div className="form-group">

                {editBudget?.budgetType === 3 ?
                  <label>
                    Change {jobPreview?.hiringTypePricingId === 3 || getcompanyID == 2 ? `Salary` : `Total`} Budget <span>*</span>
                  </label> :
                  <label>
                    Change {jobPreview?.hiringTypePricingId === 3 || getcompanyID == 2 ? `Salary` : `Total`} Budget ({jobPreview?.hiringTypePricingId === 3 || getcompanyID == 2 ? `${editBudget.currency}/Annum` : `${editBudget.currency}/Month`})? <span>*</span>
                  </label>}


                <Radio.Group
                  className="customradio newradiodes small"
                  name="budgetType"
                  onChange={(e) => {
                    setEditBudget({
                      ...editBudget,
                      budgetType: e.target.value,
                    });
                    setError({});
                    setFromEstimatedBudget(0);
                    setToEstimatedBudget(0);
                    setCalculateUplersFees({ from: "", to: "" });
                  }}

                  value={editBudget?.budgetType}
                >
                  {/* <Radio.Button value={3}>
                    No bar for right candidate{" "}
                    <img
                      className="checkIcon"
                      src={CheckRadioIcon}
                      alt="check"
                    />
                  </Radio.Button> */}
                  <Radio.Button value={1}>
                    Fixed budget{" "}
                    <img
                      className="checkIcon"
                      src={CheckRadioIcon}
                      alt="check"
                    />
                  </Radio.Button>
                  <Radio.Button value={2}>
                    Add range{" "}
                    <img
                      className="checkIcon"
                      src={CheckRadioIcon}
                      alt="check"
                    />
                  </Radio.Button>
                </Radio.Group>
                {error.budgetType && (
                  <span className="error">{error.budgetType}</span>
                )}
              </div>

              <div className="groupMain-threeWrap form-group mb-0">
                <div className="formgroup-three">
                  <div className="courancy-group">
                    {(editBudget?.budgetType === 2 ||
                      editBudget?.budgetType === 1) && (
                        <div className="form-group-cus">
                          <Select
                            defaultValue="USD"
                            popupClassName="selDropdowncustom"
                            className="customSelect"
                            options={CurrencyList}
                            // disabled={isNoBudgetBar}
                            onChange={async (value) => {
                              let _val = await checkBudgetValue(value);
                              setEditBudget((prev) => ({
                                ...prev,
                                currency: value,
                                convertedFromValue: Number(_val),
                              }));
                            }}
                            value={editBudget.currency}
                          />
                        </div>
                      )}
                  </div>
                  {error.currency && (
                    <span className="error">{error.currency}</span>
                  )}
                  <div className="two-group">
                    <div className="form-group-cus">
                      {(editBudget?.budgetType === 2 ||
                        editBudget?.budgetType === 1) && (
                          <div className="FieldPlaceholderWrap">
                            <input
                              type="text"
                              placeholder="2000"
                              className="form-control"
                              value={editBudget.budgetFrom}
                              // disabled={isNoBudgetBar}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                if (!inputValue || /^[0-9]+$/.test(inputValue)) {
                                  setEditBudget((prev) => ({
                                    ...prev,
                                    budgetFrom: e.target.value,
                                  }))
                                }
                              }
                              }
                              onBlur={async (e) => {
                                CalculateEstimatedUplersFees(Number(e.target.value), (editBudget.budgetType !== 1 || editBudget?.budgetTo >= 0) ? editBudget?.budgetTo : null);
                              }}
                              onKeyPress={(event) => {
                                if (event.key === "e" || event.key === "E" || event.key === "-") {
                                  event.preventDefault();
                                }
                              }}
                            />
                            <span>({jobPreview?.hiringTypePricingId === 3 || getcompanyID == 2 ? `${editBudget.currency}/Annum` : `${editBudget.currency}/Month`})</span>
                          </div>
                        )}
                      {error.budgetFrom && (
                        <span className="error">{error.budgetFrom}</span>
                      )}
                    </div>
                    <div className="form-group-cus">
                      {editBudget?.budgetType === 2 && (
                        <div className="FieldPlaceholderWrap">
                          <input
                            type="text"
                            placeholder="5000"
                            className="form-control"
                            value={editBudget.budgetTo}
                            // disabled={isNoBudgetBar}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              if (!inputValue || /^[0-9]+$/.test(inputValue)) {
                                setEditBudget((prev) => ({
                                  ...prev,
                                  budgetTo: e.target.value,
                                }))
                              }
                            }
                            }
                            onBlur={(e) => {
                              CalculateEstimatedUplersFees(Number(editBudget.budgetFrom), Number(e.target.value));
                            }}
                            onKeyPress={(event) => {
                              if (event.key === "e" || event.key === "E" || event.key === "-") {
                                event.preventDefault();
                              }
                            }}
                          />
                          <span>({jobPreview?.hiringTypePricingId === 3 || getcompanyID == 2 ? `${editBudget.currency}/Annum` : `${editBudget.currency}/Month`})</span>
                        </div>
                      )}
                      {error.budgetTo && (
                        <span className="error">{error.budgetTo}</span>
                      )}
                    </div>
                    {/* {editBudget.budgetType === 2 && (Number(editBudget.budgetFrom) < 0 || !editBudget.budgetTo ) ?
     <span className="error mt-0">Please Enter valid Budget</span> : 
     (editBudget.budgetFrom < 0 || parseInt(editBudget.budgetFrom) > parseInt(editBudget.budgetTo)) && (
         <span className="error mt-0">
           Please enter valid budget. The minimum budget should not exceed the maximum budget value.
         </span>
     )}  */}
                    {/* {editBudget.budgetType === 1 && !Number(editBudget.budgetFrom) && 
       <span className="error mt-0"> Please enter valid budget.</span>
     } */}
                  </div>
                </div>
                <div className="form-group mt-2 mb-0">
                  <Checkbox
                    name="isConfidentialBudget"
                    checked={editBudget.isConfidentialBudget}
                    onClick={(e) => setEditBudget({ ...editBudget, isConfidentialBudget: e.target.checked })}
                  ><span style={{ fontWeight: 400 }} >Keep the Salary Confidential</span></Checkbox>
                </div>

                {getcompanyID === 1 && jobPreview?.isTransparentPricing &&

                  (jobPreview?.hiringTypePricingId === 3 ?
                    (editBudget?.budgetType == 1 && editBudget?.budgetFrom > 0)
                      ?
                      <div className="noJobDesInfo mt-2">
                        Based on your selection of the 'Direct hire on your payroll - {TrackData?.trackingDetails?.country == "IN" ? "7.5%" : "10%"}' model, the one-time Uplers fee will be {editBudget?.currency} {estimatedFromSalaryBudget}
                      </div> : editBudget?.budgetTo > 0 && <div className="noJobDesInfo mt-2">
                        Based on your selection of the 'Direct hire on your payroll - {TrackData?.trackingDetails?.country == "IN" ? "7.5%" : "10%"}' model, the one-time Uplers fee will be {editBudget?.currency} {estimatedFromSalaryBudget} - {estimatedToSalaryBudget}
                      </div>
                    :

                    (editBudget?.budgetType == 1 && editBudget?.budgetFrom > 0)
                      ?
                      <div className="noJobDesInfo">Based on your selection of the
                        {jobPreview?.hiringTypePricingId === 1 ?
                          " Hire a contractor - 35% " : jobPreview?.hiringTypePricingId === 2 ? " Hire an employee on Uplers payroll - 35% " : ` Direct-hire ${TrackData?.trackingDetails?.country == "IN" ? "7.5% " : "10% "}`
                        }
                        model, the candidate payout is {editBudget?.currency} {estimatedFromSalaryBudget}/month, with Uplers fees up to {editBudget?.currency} {calculatedUplersFees?.from}/month.

                      </div> : editBudget?.budgetTo > 0 &&
                      <div className="noJobDesInfo">Based on your selection of the
                        {jobPreview?.hiringTypePricingId === 1 ?
                          " Hire a contractor - 35% " : jobPreview?.hiringTypePricingId === 2 ? " Hire an employee on Uplers payroll - 35% " : ` Direct-hire ${TrackData?.trackingDetails?.country == "IN" ? "7.5% " : "10% "}`
                        }
                        model, the candidate payout is {editBudget?.currency} {estimatedFromSalaryBudget + " - " + estimatedToSalaryBudget}/month, with Uplers fees ranging from  {editBudget?.currency} {calculatedUplersFees?.from + " - " + calculatedUplersFees?.to}/month.

                      </div>)
                }

                <div className="buttonEditGroup justify-content-start">
                  <button
                    type="button"
                    class="btnPrimary blank"
                    onClick={() => {
                      setisEditBudget(false);
                      setEditBudget({
                        currency: "USD",
                        budgetFrom: 0,
                        budgetTo: 0,
                        convertedFromValue: 2000,
                        budgetType: null,
                        isConfidentialBudget: false
                      });
                      setError({});
                    }}
                  >
                    Cancel
                  </button>
                  {isLoading ? <Spin size="large" /> : <button
                    type="button"
                    class="btnPrimary"
                    onClick={() => updateBudget()}
                  >
                    SAVE
                  </button>}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Duration Modal */}
      <Modal
        centered
        open={iseditDuration}
        onCancel={() => {
          setisEditDuration(false);
          setIsAddMonth(false);
          seteditDuration({
            contractDuration: "",
            employmentType: "",
            hiringTypePricingId: "",
          });
        }}
        width={800}
        className="customModal jobPostEditModal"
        maskClosable={false}
        footer={null}
      >
        <div className="modalContent">
          {getcompanyID === 1 ?
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>
                    Change engagement model
                  </label>
                  <Select
                    popupClassName="selDropdowncustom"
                    className="customSelect"
                    options={transparentEngType.length ? transparentEngType : EngOptions}
                    value={editDuration?.hiringTypePricingId}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    onChange={(e) => {
                      seteditDuration({
                        ...editDuration,
                        hiringTypePricingId: e,
                        contractDuration: null,
                        employmentType: null,
                        payrollType: null,
                        payrollTypeId: null,
                        payrollPartnerName: null
                      })
                    }}
                  />
                </div>
              </div>
              {editDuration?.hiringTypePricingId === 1 &&
                <div className="col-12">
                  <div className="form-group">
                    <label>
                      Change employment type
                    </label>
                    <Radio.Group
                      className="customradio newradiodes small"
                      name="employmentType"
                      value={editDuration?.employmentType}
                      onChange={(e) =>
                        seteditDuration((prev) => ({
                          ...prev,
                          employmentType: e.target.value,
                          payrollTypeId: null,
                          payrollType: null,
                          payrollPartnerName: null,
                          contractDuration: null,
                        }))
                      }
                    >
                      <Radio.Button value="Full Time">Full time <img className="checkIcon" src={CheckRadioIcon} alt="check" /></Radio.Button>
                      <Radio.Button value="Part Time">Part time <img className="checkIcon" src={CheckRadioIcon} alt="check" /></Radio.Button>
                    </Radio.Group>

                    {error?.employmentType && (
                      <span className="error">{error?.employmentType}</span>
                    )}
                  </div>
                </div>}

              {editDuration?.hiringTypePricingId === 3 &&
              <div className="col-12">
                <div className="form-group RadioShowSelect mt-3 col-6 mb-3">
                  <label>Who will manage the Payroll<span>*</span></label>
                  <Select
                    className='customSelect'
                    onSelect={(e, val) => {
                      seteditDuration({ ...editDuration, payrollTypeId: val.id, payrollType: e, contractDuration: null });
                    }}
                    value={editDuration.payrollType}
                    options={payrollList}
                    optionLabelProp={true}
                  />
                </div>
                </div>
              }

              {editDuration?.hiringTypePricingId == 3 && editDuration?.payrollTypeId == 3 &&
                <div className="col-12">
                  <div className="form-group mb-0">
                    <label>Enter Payroll Partner's Name<span>*</span></label>
                    <input class="form-control col-6 payrolePartnerName" type="text" placeholder="Enter name" value={editDuration.payrollPartnerName}
                      onChange={(e) => seteditDuration({ ...editDuration, payrollPartnerName: e.target.value })}
                    />
                  </div>
                </div>
              }

              {(editDuration?.hiringTypePricingId == 1 || editDuration?.hiringTypePricingId == 2 || (editDuration?.hiringTypePricingId == 3 && editDuration?.payrollTypeId == 4)) &&
                <div className="col-12">
                  <div className="form-group mb-0">
                    <label>
                      Change contract duration
                    </label>
                    <Radio.Group
                      className="customradio newradiodes small"
                      name="employmentType"
                      value={editDuration?.contractDuration}
                      onChange={(e) =>
                        seteditDuration((prev) => ({
                          ...prev,
                          contractDuration: e.target.value,
                        }))
                      }
                    >
                      {editDuration?.hiringTypePricingId === 1 && <Radio.Button value={3}>3 Months <img className="checkIcon" src={CheckRadioIcon} alt="check" /></Radio.Button>}
                      <Radio.Button value={6}>6 Months <img className="checkIcon" src={CheckRadioIcon} alt="check" /></Radio.Button>
                      <Radio.Button value={9}>9 Months <img className="checkIcon" src={CheckRadioIcon} alt="check" /></Radio.Button>
                      <Radio.Button value={12}>12 Months <img className="checkIcon" src={CheckRadioIcon} alt="check" /></Radio.Button>
                      <Radio.Button value={24}>24 Months <img className="checkIcon" src={CheckRadioIcon} alt="check" /></Radio.Button>
                      <Radio.Button value={36}>36 Months <img className="checkIcon" src={CheckRadioIcon} alt="check" /></Radio.Button>
                      <Radio.Button value={-1}>Indefinite <img className="checkIcon" src={CheckRadioIcon} alt="check" /></Radio.Button>
                    </Radio.Group>

                    {error?.employmentType && (
                      <span className="error">{error?.employmentType}</span>
                    )}
                  </div>
                </div>}

              <div className="col-12">
                <div className="buttonEditGroup">
                  <button
                    type="button"
                    class="btnPrimary blank"
                    onClick={() => {
                      setisEditDuration(false);
                      seteditDuration({
                        contractDuration: "",
                        isHiringLimited: "",
                        employmentType: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                  {isLoading ? <Spin size="large" /> : <button
                    type="button"
                    class="btnPrimary"
                    onClick={() => updateDuration()}
                  >
                    SAVE
                  </button>}
                  
                </div>
              </div>
            </div> :
            <div className="row formFields">
               {isLoading && (
            <Space size="middle">
              <Spin size="large" />
            </Space>
          )}
              <div className="col-12">
                <div className="form-group">
                  <label>
                    Change job type
                  </label>
                  <Radio.Group className="customradio newradiodes small" name='employmentType'                                 
                  value={editDuration.jobTypeID}            
                  onChange={(e) => {
                    let empType;
                    let isHirlmt;
                    if(e.target.id === 1){
                        empType = "Full time";
                        isHirlmt = "Permanent";
                    }else if(e.target.id === 2){
                        empType = "Full time";
                        isHirlmt = "Temporary";
                    }else if(e.target.id === 3){
                        empType = "Part time";
                        isHirlmt = "Temporary";
                    }else if(e.target.id === 4){
                        empType = "Full time";
                        isHirlmt = "Permanent";
                    }
                    seteditDuration((prev) => ({
                          ...prev,
                          employmentType: empType,  
                          contractDuration: (e.target.id === 1 || e.target.id === 4 ) && null ,
                          isHiringLimited:isHirlmt ,
                          jobTypeID:e.target.id                                   
                        })) ;
                    }}
                >                                     
                      {jobTypes?.map((val,index) => {
                        return(
                            <Radio.Button value={val.id}  key={index} id={val.id}>
                                {val?.text}
                                <img
                                    className="checkIcon"
                                    src={CheckRadioIcon}
                                    alt="check"
                                />
                            </Radio.Button>
                        )
                    })}                        
                </Radio.Group>
                </div>
              </div>
              {editDuration?.jobTypeID !== 1 && 
                <div className='col-12'>
                  <div className="form-group">
                    <label>{editDuration?.jobTypeID === 4 ? 'Please select duration for the initial contract period' : 'Please select contract duration'}  <span className='StarRed'>*</span></label>
                    <Radio.Group className="customradio newradiodes small" name='contractDuration'
                      onChange={(e) => {
                        seteditDuration({ ...editDuration, contractDuration: e.target.value });
                        // setIsAddMonth(false);
                      }}
                      value={editDuration.contractDuration}>
                      <Radio.Button value={3}>
                        3 Months <img className='checkIcon' src={CheckRadioIcon} alt='check' />
                      </Radio.Button>
                      <Radio.Button value={6}>
                        6 Months <img className='checkIcon' src={CheckRadioIcon} alt='check' />
                      </Radio.Button>
                      <Radio.Button value={9}>
                        9 Months <img className='checkIcon' src={CheckRadioIcon} alt='check' />
                      </Radio.Button>
                      <Radio.Button value={12}>
                        12 Months <img className='checkIcon' src={CheckRadioIcon} alt='check' />
                      </Radio.Button>
                      <Radio.Button value={24}>
                        24 Months <img className='checkIcon' src={CheckRadioIcon} alt='check' />
                      </Radio.Button>
                      <Radio.Button value={36}>
                        36 Months <img className='checkIcon' src={CheckRadioIcon} alt='check' />
                      </Radio.Button>
                      {editDuration?.jobTypeID !== 4 &&<Radio.Button value={-1}>
                        Indefinite <img className='checkIcon' src={CheckRadioIcon} alt='check' />
                      </Radio.Button>}
                    </Radio.Group>

                    {error?.employmentType && <span className='error'>{error?.employmentType}</span>}
                  </div>
                </div>
              }

              <div className="col-12">
                <div className="buttonEditGroup">
                  <button
                    type="button"
                    class="btnPrimary blank"
                    onClick={() => {
                      setisEditDuration(false);
                    }}
                  >
                    Cancel
                  </button>
                  {isLoading ? <Spin size="large" /> : <button
                    type="button"
                    class="btnPrimary"
                    onClick={() => updateDuration()}
                  >
                    SAVE
                  </button>}
                  
                </div>
              </div>
            </div>}
        </div>
      </Modal>

      {/*  Notice Preiod Modal */}
      <Modal
        centered
        open={iseditNoticePeriod}
        onCancel={() => {
          setisEditNoticePeriod(false);
          setEditNoticePeriod("");
        }}
        width={536}
        className="customModal jobPostEditModal"
        maskClosable={false}
        footer={null}
      >
        <div className="modalContent">
          <div className="row">
            <div className="col-12">
              <div className="form-group mb-0">
                <label>
                  When do you want the talent to start? <span>*</span>
                </label>

                <Radio.Group
                  className="customradio newradiodes small"
                  name="howSoon"
                  value={editNoticePeriod?.howsoon}
                  onChange={(e) =>
                    setEditNoticePeriod({
                      ...editNoticePeriod,
                      howsoon: e.target.value,
                    })
                  }
                  defaultValue="30 Days"
                >
                  <Radio.Button value="15 Days">
                    15 Days{" "}
                    <img
                      className="checkIcon"
                      src={CheckRadioIcon}
                      alt="check"
                    />{" "}
                  </Radio.Button>
                  <Radio.Button value="30 Days">
                    30 Days{" "}
                    <img
                      className="checkIcon"
                      src={CheckRadioIcon}
                      alt="check"
                    />{" "}
                  </Radio.Button>
                  <Radio.Button value="45 Days">
                    45 Days{" "}
                    <img
                      className="checkIcon"
                      src={CheckRadioIcon}
                      alt="check"
                    />{" "}
                  </Radio.Button>
                  <Radio.Button value="90 Days">
                    90 Days{" "}
                    <img
                      className="checkIcon"
                      src={CheckRadioIcon}
                      alt="check"
                    />{" "}
                  </Radio.Button>
                </Radio.Group>
                {!editNoticePeriod?.howsoon && (
                  <span className="error">select Notice Period</span>
                )}
                <div className="buttonEditGroup">
                  <button
                    type="button"
                    class="btnPrimary blank"
                    onClick={() => {
                      setisEditNoticePeriod(false);
                      setEditNoticePeriod("");
                    }}
                  >
                    Cancel
                  </button>
                  {isLoading ? <Spin size="large" /> :  <button
                    type="button"
                    class="btnPrimary"
                    onClick={() => updateNoticePeriod()}
                  >
                    SAVE
                  </button>}
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/*  Location Modal */}
      {/*  <Modal
        centered
        open={iseditLocation}
        onCancel={() => {
          setisEditLocation(false);
          setEditLocation({ workingModeId: "", city: "", country: "" });
        }}
        width={400}
        className="customModal jobPostEditModal"
        maskClosable={false}
        footer={null}
      >
        <div className="modalContent">
          <div className="row formFields">
            <div className="col-12">
              <div className="form-group mb-0">
                <label className="mt-1">Change location </label>
                <div className="row locationRowWrap">
                  <div className="col-md-3 col-12">
                    <div>
                      <Radio.Group
                        className="customradio newradiodes small"
                        name="workingModeID"
                        value={editLocation.workingModeId}
                        onChange={(e) => {
                          setEditLocation({
                            ...editLocation,
                            workingModeId: e.target.value,
                            city: "",
                            country: "",
                          });
                        }}
                      >
                        <Radio.Button value={1}>
                          Remote{" "}
                          <img
                            className="checkIcon"
                            src={CheckRadioIcon}
                            alt="check"
                          />
                        </Radio.Button>
                        <Radio.Button value={3}>
                          On-site{" "}
                          <img
                            className="checkIcon"
                            src={CheckRadioIcon}
                            alt="check"
                          />
                        </Radio.Button>
                        <Radio.Button value={2}>
                          Hybrid{" "}
                          <img
                            className="checkIcon"
                            src={CheckRadioIcon}
                            alt="check"
                          />
                        </Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>
                </div>

                {editLocation.workingModeId !== 1 && (
                  <div className="row mt-3 changeLocationSec">
                    <div className="col-md-6 col-12 mb-2">
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          value={editLocation.city}
                          onChange={(e) => {
                            setEditLocation({
                              ...editLocation,
                              city: e.target.value,
                              country: "",
                            });
                            setError({ ...error, city: "" });
                          }}
                          onBlur={() => {
                            setIsLoading(true);
                            getcountryData();
                          }}
                          placeholder="Enter City"
                        />
                        {error.city && (
                          <span className="error">{error.city}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6 col-12">
                      <div>
                        <Select
                          onSelect={(e) => {
                            setEditLocation((prev) => ({
                              ...prev,
                              country: e.toString(),
                            }));
                          }}
                          key={editLocation.country}
                          className="customSelect"
                          value={country?.find(
                            (option) => option.value == editLocation.country
                          )}
                          placeholder="Please select your country"
                          options={country}
                        />
                        {error.country && (
                          <span className="error">{error.country}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="buttonEditGroup">
                  <button
                    type="button"
                    class="btnPrimary blank"
                    onClick={() => {
                      setisEditLocation(false);
                    }}
                  >
                    Cancel
                  </button>
                  {isLoading ? <Spin size="large" /> : <button
                    type="button"
                    class="btnPrimary"
                    onClick={() => updateLocation()}
                  >
                    SAVE
                  </button>}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>*/}

      {/*  Experience Modal */}
      <Modal
        centered
        open={iseditExp}
        onCancel={() => {
          setisEditExp(false);
          seteditExp("");
        }}
        width={338}
        className="customModal jobPostEditModal"
        maskClosable={false}
        footer={null}
      >
        <div className="modalContent">
          <div className="row formFields">
            <div className="col-12">
              <div className="form-group mb-0">
                <label>
                  Change years of experience? <span>*</span>
                </label>

                <input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="Please enter experience"
                  className="form-control"
                  value={editExp}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      seteditExp('');
                      setIsFresherDisabled(false);
                      return
                    }
                    if ((e.target.value == 0)) {
                      seteditExp(e.target.value)
                      setIsFreshersAllowed(true)
                      setIsExpDisabled(true)
                      setIsFresherDisabled(false)
                      return
                    }
                    if (+e.target.value > 0) {
                      seteditExp(e.target.value)
                      setIsFreshersAllowed(false)
                      setIsExpDisabled(false)
                      setIsFresherDisabled(true)
                      return
                    }
                  }}
                  onKeyPress={(event) => {
                    if (event.key === "e" || event.key === "E") {
                      event.preventDefault();
                    }
                  }}
                  disabled={isExpDisabled}
                />
                {(editExp === '' && !isFreshersAllowed) ? <><span className='error'>Please Enter experience</span><br /></> : parseInt(editExp) < (isFreshersAllowed ? 0 : 1) && <><span className='error'>Please Enter atlest {isFreshersAllowed ? 0 : 1}</span><br /></>}
                <div style={{ margin: '5px 0' }}>
                  <Checkbox checked={isFreshersAllowed} onClick={() => {
                    setIsFreshersAllowed(prev => {
                      if (prev === false) {
                        seteditExp(0)
                        setIsExpDisabled(true)
                      } else {
                        setIsExpDisabled(false)
                        seteditExp('');
                      }
                      return !prev
                    })
                  }} disabled={isFresherDisabled}>
                    Freshers allowed
                  </Checkbox>
                </div>
                <div className="buttonEditGroup">
                  <button
                    type="button"
                    class="btnPrimary blank"
                    onClick={() => {
                      setisEditExp(false);
                      seteditExp("");
                      setError({})
                    }}
                  >
                    Cancel
                  </button>
                  {isLoading ? <Spin size="large" /> :  <button
                    type="button"
                    class="btnPrimary"
                    onClick={() => updateExp()}
                    disabled={editExp === '' ? true : parseInt(editExp) < (isFreshersAllowed ? 0 : 1) ? true : false}
                  >
                    SAVE
                  </button>}
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/*  Shift Modal */}
      <Modal
        centered
        open={iseditShift}
        onCancel={() => {
          setisEditShift(false);
          setEditShift("");
        }}
        width={556}
        className="customModal jobPostEditModal"
        maskClosable={false}
        footer={null}
      >
        <div className="modalContent">
          <div className="row formFields">
            <div className="col-md-12 col-12">
              <div className="form-group mb-3">
                <label>Change Timezone</label>
                <Select
                  value={editShift.timeZone}
                  className="customSelect"
                  popupClassName="selDropdowncustom"
                  placeholder="Please select time zone"
                  options={timeZone}
                  onSelect={(val, obj) => {
                    setEditShift((prev) => ({ ...prev, timeZone: obj.label }));
                  }}
                  filterOption={(inputValue, option) =>
                    option.label
                      .toLowerCase()
                      .indexOf(inputValue.toLowerCase()) !== -1
                  }
                  showSearch={true}
                />
                {!editShift.timeZone && (
                  <span className="error">Please select Time Zone</span>
                )}
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="form-group mb-0">
                <label>Shift Start Time *</label>
                <Select
                  value={editShift.timeZoneFromTime}
                  className="customSelect"
                  popupClassName="selDropdowncustom"
                  placeholder="Please select time"
                  options={startEndTime}
                  onSelect={(val) => {
                    let index = startEndTime.findIndex(
                      (item) => item.value === val
                    );
                    if (index >= startEndTime.length - 18) {
                      let newInd = index - (startEndTime.length - 18);
                      let endtime = startEndTime[newInd];
                      setEditShift((prev) => ({
                        ...prev,
                        timeZoneFromTime: val,
                        timeZoneEndTime: endtime.value,
                      }));
                    } else {
                      let endtime = startEndTime[index + 18];
                      setEditShift((prev) => ({
                        ...prev,
                        timeZoneFromTime: val,
                        timeZoneEndTime: endtime.value,
                      }));
                    }
                    setError({ ...error, ["timeZoneFromTime"]: "" });
                  }}
                  showSearch
                />
                {!editShift.timeZoneFromTime && (
                  <span className="error">Please select</span>
                )}
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="form-group mb-0">
                <label>Shift End Time *</label>
                <Select
                  value={editShift.timeZoneEndTime}
                  className="customSelect"
                  popupClassName="selDropdowncustom"
                  placeholder="Please select time"
                  options={startEndTime}
                  onSelect={(val) => {
                    setEditShift((prev) => ({ ...prev, timeZoneEndTime: val }));
                    setError({ ...error, ["timeZoneEndTime"]: "" });
                  }}
                  showSearch
                />
                {error.timeZoneEndTime && (
                  <span className="error">{error.timeZoneEndTime}</span>
                )}
              </div>
            </div>

            <div className="col-12">
              <div className="buttonEditGroup">
                <button
                  type="button"
                  class="btnPrimary blank"
                  onClick={() => {
                    setisEditShift(false);
                    setEditShift("");
                  }}
                >
                  Cancel
                </button>
                {isLoading ? <Spin size="large" /> :  <button
                  type="button"
                  class="btnPrimary"
                  onClick={() => updateShift()}
                >
                  SAVE
                </button>}
               
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Compensation option Modal */}
      <Modal
        centered
        open={isCompensationOptionOpen}
        onCancel={() => {
          setisCompensationOptionOpen(false);
        }}
        width={620}
        className="customModal jobPostEditModal PrevEditmodal"
        footer={null}
      >
        <div className="modalContent">
          <div className="row formFields">
            <div className="col-12">

              <div className="col-12">
                <div className="form-group prevSkillTwopart">
                  <label>Compensation Beyond Salary</label>
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    value={CompensationValues}
                    options={compensationOptions}
                    onChange={(values, _) => setCompensationValues(values)}
                    placeholder="Enter benefits"
                    tokenSeparators={[","]}
                  />

                  <ul className="SlillBtnBox">
                    {compensationOptions?.map(option => (
                      !CompensationValues?.some(val => val === option.value) && (
                        <li key={option.value} style={{ cursor: "pointer" }} onClick={() => setCompensationValues([...CompensationValues, option?.value])}>
                          <span>{option.label} <img src={plusIcon} loading="lazy" alt="star" /></span>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              </div>

              <div className="buttonEditGroup mt-4">
                <button type="button" class="btnPrimary blank" onClick={() => { setisCompensationOptionOpen(false); setCompensationValues([]) }}> Cancel </button>
                {isLoading ? <Spin size="large" /> : <button type="button" class="btnPrimary" onClick={updateCompensationOptions}> SAVE </button>}
                
              </div>

            </div>
          </div>
        </div>
      </Modal>

      {/* Industry from which candidates Modal */}
      <Modal
        centered
        open={isIndustryCandidatesOpen}
        onCancel={() => {
          setisIndustryCandidatesOpen(false);
          // setCompanyType('');
        }}
        width={780}
        className="customModal jobPostEditModal PrevEditmodal"
        footer={null}
      >
        <div className="modalContent">
          <div className="row formFields">
            <div className="col-12">
              <div className="form-group mb-0 vitalInfoBox">
                <div className="col-12">
                  <div className="form-group prevSkillTwopart">
                    <label>Specify the industry from which you need candidates.</label>
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      value={specificIndustry}
                      onChange={(values, _) => setSpecificIndustry(values)}
                      placeholder="Enter specific industry"
                      tokenSeparators={[","]}
                      options={industryOptions}
                    // onBlur={() => setIsSpecificIndustry(false)}
                    />
                    <ul className="SlillBtnBox">
                      {industryOptions?.map(option => (
                        !specificIndustry?.some(val => val === option.value) && (
                          <li key={option.value} style={{ cursor: "pointer" }} onClick={() => {
                            setSpecificIndustry([...specificIndustry, option?.value])
                          }}
                          >
                            <span>{option.label} <img src={plusIcon} loading="lazy" alt="star" /></span>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="buttonEditGroup">
                  <button type="button" class="btnPrimary blank" onClick={() => {
                    setisIndustryCandidatesOpen(false);
                    setSpecificIndustry([]);
                  }}> Cancel </button>
                  {isLoading ? <Spin size="large" /> : <button type="button" class="btnPrimary" onClick={updateIndustry}> SAVE </button>}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Need candidate with people management  Modal */}
      <Modal
        centered
        open={isCandidatePeopleOpen}
        onCancel={() => {
          setisCandidatePeopleOpen(false);
          // setCompanyType('');
        }}
        width={400}
        className="customModal jobPostEditModal PrevEditmodal"
        footer={null}
      >
        <div className="modalContent">
          <div className="row formFields">
            <div className="col-12">

              <div className="form-group mb-0 vitalInfoBox">
                <label>Need candidate with people management experience?</label>

                <div className="form-group mb-24">
                  <Radio.Group
                    className="customradio newradiodes small"
                    value={hasPeopleManagementExp}
                    onChange={(e) => setHasPeopleManagementExp(e.target.value)}
                  >
                    <Radio.Button value={true}>
                      Yes <img className='checkIcon' src={CheckRadioIcon} alt='check' />
                    </Radio.Button>
                    <Radio.Button value={false}>
                      No <img className='checkIcon' src={CheckRadioIcon} alt='check' />
                    </Radio.Button>
                  </Radio.Group>
                </div>

              </div>

              <div className="buttonEditGroup">
                <button type="button" class="btnPrimary blank" onClick={() => setisCandidatePeopleOpen(false)}> Cancel </button>
                {isLoading ? <Spin size="large" /> : <button type="button" class="btnPrimary" onClick={updateCandidateManagement}> SAVE </button>}               
              </div>

            </div>
          </div>
        </div>
      </Modal>

        {/* Edit POC contact number Modal */}
        <Modal
            centered
            open={isContactEdit}
            onCancel={() => {
              setIsContactEdit(false);             
            }}
            width={355}
            className="customModal jobPostEditModal"
            footer={null}
          >
            {isLoading && (
                  <Space size="middle">
                    <Spin size="large" />
                  </Space>
            )}
            <div className="row formFields">
              <div className="col-12">
                <div className="form-group mb-0">
                <div className="form-group">
                  <label>{pocDetails?.isEdit ? "Edit" :"Add"} mobile number</label>                
                  <div className="phonConturyWrap">
                  <PhoneInput
                                        placeholder="Enter number"
                                        key={'phoneNumber'}
                                        value={pocDetails?.contactNo}
                                        onChange={value => {
                                          if(value ==""){
                                            setPOCDetails({...pocDetails,showContactNumberToTalent: false})
                                          }
                                          setPOCDetails({...pocDetails,contactNo:value})    
                                          // const regex = /^[0-9]\d*$/;
                                          // if (regex.test(value) || value === "") {
                                          //   if(value ==""){
                                          //     setPOCDetails({...pocDetails,showContactNumberToTalent: false})
                                          //   }
                                          //   setPOCDetails({...pocDetails,contactNo:value})                          
                                          // }  
                                        }}
                                        country={countryCodeData}
                                        disableSearchIcon={true}
                                        enableSearch={true}
                                        />
                  {/* <input type="text" className="form-control" placeholder="Edit mobile number" value={pocDetails?.contactNo} maxLength={10}
                    onChange={(e) => {
                      const regex = /^[0-9]\d*$/;
                          if (regex.test(e.target.value) || e.target.value === "") {
                            if(e.target.value ==""){
                              setPOCDetails({...pocDetails,showContactNumberToTalent: false})
                            }
                            setPOCDetails({...pocDetails,contactNo:e.target.value})                          
                          }  
                    }}
                  />     */}
                    <Checkbox name="userShow" disabled={pocDetails?.contactNo ==""?true:false}checked={pocDetails?.contactNo?pocDetails?.showContactNumberToTalent:false} onChange={(e) =>                       
                      setPOCDetails({...pocDetails,showContactNumberToTalent: e.target.checked})                      
                      }>Show mobile number to candidates</Checkbox>              
                  </div>
                </div> 
                <div className="buttonEditGroup">
                    <button type="button" class="btnPrimary blank" onClick={() => setIsContactEdit(false)}> Cancel </button>
                    <button type="button" class="btnPrimary" 
                    onClick={updatePOCContact}
                    
                    > SAVE </button>
                </div>       
                </div>
              </div>
            </div> 
           
          </Modal>
    </>
  );
}

export default PreviewHRModal;
