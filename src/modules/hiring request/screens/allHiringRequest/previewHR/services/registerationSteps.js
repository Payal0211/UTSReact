import { NetworkInfo, RegisterSteps, SubDomain} from "constants/network";
import { HttpServices } from 'shared/services/http/http_service';


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




