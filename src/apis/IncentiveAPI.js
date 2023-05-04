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
};
