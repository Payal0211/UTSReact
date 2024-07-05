import { getDataFromLocalStorage, trackingDetails, trackingDetailsAPI } from "../constants/commonUsedVar";
import { NetworkInfo, RegisterSteps, SubDomain, JobPost,JobDescription , TextExtraction, UPScreen} from "../constants/network";
import { HttpServices } from "./http/http_service";

export const jdlinkApi = async (link,processType) => {
  try {
      let httpService = new HttpServices();
      httpService.setAuthRequired = true;
      // httpService.URL = NetworkInfo.NETWORK + RegisterSteps.TEXTEXTRACTION + RegisterSteps.EXTRACTTEXT + `?psUrl=${link}&processType=${processType}` ;
      httpService.URL = NetworkInfo.NETWORK + RegisterSteps.TEXTEXTRACTION + RegisterSteps.EXTRACTTEXTAI + `?psUrl=${link}` ;
      let _token = localStorage.getItem('Token');
      httpService.setAuthToken = _token;
      let response = await httpService.sendGetRequest();
      return response;
  } catch (error) {
    return error
  }
}  

export const saveRoleDetails = async (roleReqData) => {
    try {
        let httpService = new HttpServices();
        httpService.setAuthRequired = true;
        httpService.URL = NetworkInfo.NETWORK + SubDomain.ROLE_HIRING_DETAILS + RegisterSteps.SAVEROLEANDHIRINGTYPEDETAILS;
        httpService.dataToSend = roleReqData;
        let _token = localStorage.getItem('Token');
        httpService.setAuthToken = _token;
        let response = await httpService.sendPostRequest();
        return response;
    } catch (error) {
      return error;
    }
};

export const getTalentsRolesData = async () => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.ROLE_HIRING_DETAILS + RegisterSteps.GETTALENTSROLES;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error;
  }
}

export const getAchievement = async () => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + RegisterSteps.EMPLOYEEMENTDETAILS + RegisterSteps.GETACHIEVEMENT ;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error;
  }
}

export const saveEmploymentDetails = async (reqData) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + RegisterSteps.EMPLOYEEMENTDETAILS + RegisterSteps.SAVEEMPLOYEMENTDETAILS ;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    httpService.dataToSend = reqData;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error;
  }
}

export const getSkillsAndBudget = async (rollID) =>{
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.SKILL_AND_BUDGET_DETAILS + RegisterSteps.GET_SKILLS_AND_BUDGET + `?id=${rollID}`;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error;
  }
}

export const getSkills = async (rollID) =>{
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.SKILL_AND_BUDGET_DETAILS + RegisterSteps.GET_SKILLS + `?roleId=${rollID}`;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error;
  }
}

export const getCurrency = async (rollID) =>{
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.SKILL_AND_BUDGET_DETAILS + RegisterSteps.GET_CURRENCY ;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error;
  }
}

export const saveSkillsAndBudget = async (data)=>{
  try{
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.SKILL_AND_BUDGET_DETAILS + RegisterSteps.SAVE_SKILLS_AND_BUGET ;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    httpService.dataToSend = data;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error;
  }
}

export const getTimeZonePreference = async (id) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + RegisterSteps.EMPLOYEEMENTDETAILS + RegisterSteps.GETTIMEZONEPREFERENCE +"?timezoneId="+id ;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error;
  }
}

export const getContactTimeZone = async () => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + RegisterSteps.EMPLOYEEMENTDETAILS + RegisterSteps.GETCONTACTTIMEZONE;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error
    
  }
}

export const getTalentTimeZone = async () => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + RegisterSteps.EMPLOYEEMENTDETAILS + RegisterSteps.GETTALENTTIMEZONE;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();   
    return response;
  } catch (error) {
    return error;
  }
}

export const getStartEndTime = async () => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + RegisterSteps.EMPLOYEEMENTDETAILS + RegisterSteps.GETSTARTENDTIME;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const getUnfinishedJobPost = async () => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    let _obj = getDataFromLocalStorage();
    httpService.URL = NetworkInfo.NETWORK + SubDomain.POST_JOB +  JobPost.GET_UNFINISHED_JOB  + `?anotherCompanyId=${_obj?.CompanyTypeId}`;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const getUnfinishedJobPostEditDraft = async (guid) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    let _obj = getDataFromLocalStorage();
    httpService.URL = NetworkInfo.NETWORK + SubDomain.POST_JOB +  JobPost.GET_UNFINISHED_JOB  + `?anotherCompanyId=${_obj?.CompanyTypeId}&guid=${guid}`;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const getPreviewPost = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.POST_JOB +  JobPost.PREVIEW + `?contactId=${data.contactId}&guid=${data.guid}&hrId=${data.hrId}`;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const getAssismentQuestions = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL =  NetworkInfo.UPSCREEN_DOMAIN + UPScreen.GET_QUESTIONS;
    let _token = process.env.REACT_APP_UP_SCREEN_TOKEN;
    httpService.dataToSend = data
    httpService.setAuthToken = _token;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const checkAssismentQuestionGenerated = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL =  NetworkInfo.UPSCREEN_DOMAIN + UPScreen.CHECK_ASSESSMENT_QUESTION_GENERATED;
    let _token = process.env.REACT_APP_UP_SCREEN_TOKEN;
    httpService.dataToSend = data
    httpService.setAuthToken = _token;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const updateAssismentQuestions = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL =  NetworkInfo.UPSCREEN_DOMAIN + UPScreen.UPDATE_QUESTIONS;
    let _token = process.env.REACT_APP_UP_SCREEN_TOKEN;
    httpService.dataToSend = data
    httpService.setAuthToken = _token;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}


export const creatJobPost = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.POST_JOB +  JobPost.CREATE_JOB_POST ;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    httpService.dataToSend = data
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const updateJobPost = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.POST_JOB +  JobPost.UPDATE_PREVIEW_DETAILS ;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    httpService.dataToSend = data
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const saveJDDetails = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.JOB_DESCRIPTION +  JobDescription.SAVE_JD_Details;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    httpService.dataToSend = data;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const submitStandOutDetails = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.POST_JOB +  JobPost.SAVE_STANDOUT_Details;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    httpService.dataToSend = data;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const SaveStepsInfoPostaJobForJD = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    if(data?.isDraft){
      httpService.URL = NetworkInfo.NETWORK + SubDomain.JOB_POST_STEPS_INFO + TextExtraction.SAVE_STEP_INFO_JOB + `?guid=${data?.guid}&AnotherCompanyTypeID=${data?.AnotherCompanyTypeID}&isDraft=${data?.isDraft}`;
    }else{
      httpService.URL = NetworkInfo.NETWORK + SubDomain.JOB_POST_STEPS_INFO + TextExtraction.SAVE_STEP_INFO_JOB + `?guid=${data?.guid}&AnotherCompanyTypeID=${data?.AnotherCompanyTypeID}`;
    }    
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const getJDUsingPython = async (ID) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.TEXT_EXTRACTION + TextExtraction.EXTRACT_JD_USING_PYTHON + `?guid=${ID}`  ;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const getSuggestedSkills = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.TEXT_EXTRACTION + TextExtraction.EXTRACT_SKILLS_USING_PYTHON ;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    httpService.dataToSend = data;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const checkJobPostStatus = async () => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.ACCOUNT + `CheckIfJobPostedForCompany`;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const getAllCountriesData = async (values) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.ROLE_HIRING_DETAILS + RegisterSteps.GET_COUNTRY_LIST + "?postalcode=" +values.postalcode +"&CountryCode="+values.CountryCode;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const getHiringRequestSLADetails = async (hrId) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.POST_JOB + `GetHiringRequestSLADetails?hrId=${hrId}`;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const GetTimeZone = async () => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.INTERVIEW + JobPost.GET_TIMEZONE ;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const GetTalentDetails = async (talentID,HRID, ATS_TalentID='') => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.INTERVIEW + JobPost.GET_TALENT_DETAILS + `?talentID=${talentID}&HRID=${HRID}&ATS_TalentID=${ATS_TalentID}` ;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const SaveInterviewDetails = async (reqPayload) => {
  let TrackData = {
    trackingDetails: trackingDetailsAPI()
  };
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK +  SubDomain.INTERVIEW  + JobPost.SAVE_INTERVIEW_DETAILS;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    httpService.dataToSend ={...reqPayload,  trackingDetails: { ...TrackData.trackingDetails}}
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}
export const getAllDetailsFromText = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.TEXT_EXTRACTION + TextExtraction.GET_ALL_DETAILS_FROM_TEXT;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    httpService.dataToSend = {"pdfText":data};
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const saveStepsInfoData = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.JOB_POST_STEPS_INFO + RegisterSteps.SAVE_STEPS_INFO;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    httpService.dataToSend = data;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const getHiringTypePricing = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.TRANSPARENT_PRICING + RegisterSteps.GET_HIRING_TYPE_PRICING + `?engagementType=${data}`;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const getPayrollType = async () => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.TRANSPARENT_PRICING + RegisterSteps.GET_PAYROLL_TYPE ;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const fetchCountriesBasedonCity = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.TEXT_EXTRACTION +  RegisterSteps.FETCH_COUNTRIES_BASED_ON_CITY;
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    httpService.dataToSend = data;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const extractJobDescriptionUsingClaudAI = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.TEXT_EXTRACTION +  TextExtraction.EXTRACT_JOB_DESCRIPTION_CLAUD_AI;
    
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    httpService.dataToSend = data;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}

export const captureScreeningActions = async (data) => {
  try {
    let httpService = new HttpServices();
    httpService.setAuthRequired = true;
    httpService.URL = NetworkInfo.NETWORK + SubDomain.TALENT +  JobPost.CAPTURE_SCREENING_ACTIONS;    
    let _token = localStorage.getItem('Token');
    httpService.setAuthToken = _token;
    httpService.dataToSend = data;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    return error
  }
}