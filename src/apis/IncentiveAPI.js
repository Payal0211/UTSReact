import {
  ClientsAPI,
  NetworkInfo,
  SubDomain,
  IncentiveReport,
} from "constants/network";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { HttpServices } from "shared/services/http/http_service";
import { errorDebug } from "shared/utils/error_debug_utils";

export const IncentiveReportAPI = {
  getUserRolerequest: async function () {
    let httpService = new HttpServices();
    httpService.URL =
      NetworkInfo.NETWORK +
      SubDomain.INCENTIVE_REPORT +
      IncentiveReport.GET_USER_ROLE;
    httpService.setAuthRequired = true;
    httpService.setAuthToken = UserSessionManagementController.getAPIKey();
    try {
      let response = await httpService.sendGetRequest();
      return response;
    } catch (error) {
      return errorDebug(error, "ClientAPI.getPOCRequest");
    }
  },
  getMonthYearFilter: async function () {
    let httpService = new HttpServices();
    httpService.URL =
      NetworkInfo.NETWORK +
      SubDomain.INCENTIVE_REPORT +
      IncentiveReport.MONTH_YEAR_FILER;
    httpService.setAuthRequired = true;
    httpService.setAuthToken = UserSessionManagementController.getAPIKey();
    try {
      let response = await httpService.sendGetRequest();
      return response;
    } catch (error) {
      return errorDebug(error, "ClientAPI.getPOCRequest");
    }
  },
  getSalesUsersBasedOnUserRole: async function (data) {
    let httpService = new HttpServices();
    httpService.URL =
      NetworkInfo.NETWORK +
      SubDomain.INCENTIVE_REPORT +
      IncentiveReport.GET_SALES_USERS_BASED_ON_USER_ROLE + `?UserRoleId=${data}`;
    httpService.setAuthRequired = true;
    httpService.setAuthToken = UserSessionManagementController.getAPIKey();
    try {
      let response = await httpService.sendPostRequest();
      return response;
    } catch (error) {
      return errorDebug(error, "ClientAPI.getPOCRequest");
    }
  },
  getUserHierarchy: async function (data) {
    let httpService = new HttpServices();
    httpService.URL =
      NetworkInfo.NETWORK +
      SubDomain.INCENTIVE_REPORT +
      IncentiveReport.GET_USER_HIERARCHY + `?Parentid=${data}`;
    httpService.setAuthRequired = true;
    httpService.setAuthToken = UserSessionManagementController.getAPIKey();
    try {
      let response = await httpService.sendGetRequest();
      return response;
    } catch (error) {
      return errorDebug(error, "ClientAPI.getPOCRequest");
    }
  },

  getUserListInIncentive: async function (month, year, managerId) {
    let httpService = new HttpServices();
    httpService.URL =
      NetworkInfo.NETWORK +
      SubDomain.INCENTIVE_REPORT +
      IncentiveReport.GET_LIST + `?month=${month}&year=${year}&salesManagerId=${managerId}`;
    httpService.setAuthRequired = true;
    httpService.setAuthToken = UserSessionManagementController.getAPIKey();
    try {
      let response = await httpService.sendGetRequest();
      return response;
    } catch (error) {
      return errorDebug(error, "ClientAPI.getPOCRequest");
    }
  },
  getUserListInIncentiveDetails: async function (month, userId, isSelfTargets, year) {
    let httpService = new HttpServices();
    httpService.URL =
      NetworkInfo.NETWORK +
      SubDomain.INCENTIVE_REPORT +
      IncentiveReport.GET_INCENTIVE_REPORT_DETAILS + `?month=${month}&userId=${userId}&isSelfTargets=${isSelfTargets}&year=${year}`;
    httpService.setAuthRequired = true;
    httpService.setAuthToken = UserSessionManagementController.getAPIKey();
    try {
      let response = await httpService.sendPostRequest();
      return response;
    } catch (error) {
      return errorDebug(error, "ClientAPI.getPOCRequest");
    }
  },
  getIncentiveReportDetailsContractBooster: async function (month, userId, isSelfTargets, year) {
    let httpService = new HttpServices();
    httpService.URL =
      NetworkInfo.NETWORK +
      SubDomain.INCENTIVE_REPORT +
      IncentiveReport.GET_CONTRACT_BOOSTER + `?userId=${userId}&month=${month}&year=${year}&isSelfTargets=${isSelfTargets}`;
    httpService.setAuthRequired = true;
    httpService.setAuthToken = UserSessionManagementController.getAPIKey();
    try {
      let response = await httpService.sendPostRequest();
      return response;
    } catch (error) {
      return errorDebug(error, "ClientAPI.getPOCRequest");
    }
  },
  getIncentiveReportDetailsAMNR: async function (month, userId, isSelfTargets, year) {
    let httpService = new HttpServices();
    httpService.URL =
      NetworkInfo.NETWORK +
      SubDomain.INCENTIVE_REPORT +
      IncentiveReport.GET_INCENTIVE_REPORT_AMNR + `?month=${month}&userId=${userId}&year=${year}&isSelfTargets=${isSelfTargets}`;
    httpService.setAuthRequired = true;
    httpService.setAuthToken = UserSessionManagementController.getAPIKey();
    try {
      let response = await httpService.sendPostRequest();
      return response;
    } catch (error) {
      return errorDebug(error, "ClientAPI.getPOCRequest");
    }
  },
  calculateValidation: async function (userId,month,year) {
    let httpService = new HttpServices();
    httpService.URL =
      NetworkInfo.NETWORK +
      SubDomain.INCENTIVE_REPORT +
      IncentiveReport.CHECK_VALIDATION + `?userId=${userId}&month=${month}&year=${year}`;
    httpService.setAuthRequired = true;
    httpService.setAuthToken = UserSessionManagementController.getAPIKey();
    try {
      let response = await httpService.sendPostRequest();
      return response;
    } catch (error) {
      return errorDebug(error, "ClientAPI.getPOCRequest");
    }
  },
};
