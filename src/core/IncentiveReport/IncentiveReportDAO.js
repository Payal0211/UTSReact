import { IncentiveReportAPI } from "apis/IncentiveAPI";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { Navigate } from "react-router-dom";
import { errorDebug } from "shared/utils/error_debug_utils";

export const IncentiveReportDAO = {
  getUserRoleDAO: async function () {
    try {
      const getUserRole = await IncentiveReportAPI.getUserRolerequest();
      if (getUserRole) {
        const statusCode = getUserRole["statusCode"];
        if (statusCode === HTTPStatusCode.OK) {
          const tempResult = getUserRole.responseBody;
          return {
            statusCode: statusCode,
            responseBody: tempResult.details,
          };
        } else if (statusCode === HTTPStatusCode.NOT_FOUND) return getUserRole;
        else if (statusCode === HTTPStatusCode.BAD_REQUEST) return getUserRole;
        else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
          let deletedResponse =
            UserSessionManagementController.deleteAllSession();
          if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
        }
      }
    } catch (error) {
      return errorDebug(error, "IncentiveReportDAO.getUserRoleDAO");
    }
  },
  getMonthYearFilterDAO: async function () {
    try {
      const getMonthYearInfo = await IncentiveReportAPI.getMonthYearFilter();
      if (getMonthYearInfo) {
        const statusCode = getMonthYearInfo["statusCode"];
        if (statusCode === HTTPStatusCode.OK) {
          const tempResult = getMonthYearInfo.responseBody;
          return {
            statusCode: statusCode,
            responseBody: tempResult.details,
          };
        } else if (statusCode === HTTPStatusCode.NOT_FOUND)
          return getMonthYearInfo;
        else if (statusCode === HTTPStatusCode.BAD_REQUEST)
          return getMonthYearInfo;
        else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
          let deletedResponse =
            UserSessionManagementController.deleteAllSession();
          if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
        }
      }
    } catch (error) {
      return errorDebug(error, "IncentiveReportDAO.getMonthYearFilterDAO");
    }
  },
  getSalesUsersBasedOnUserRoleDAO: async function (data) {
    try {
      const getSalesUserBasedOnUserRoleInfo = await IncentiveReportAPI.getSalesUsersBasedOnUserRole(data);
      if (getSalesUserBasedOnUserRoleInfo) {
        const statusCode = getSalesUserBasedOnUserRoleInfo["statusCode"];
        if (statusCode === HTTPStatusCode.OK) {
          const tempResult = getSalesUserBasedOnUserRoleInfo.responseBody;
          return {
            statusCode: statusCode,
            responseBody: tempResult.details,
          };
        } else if (statusCode === HTTPStatusCode.NOT_FOUND)
          return getSalesUserBasedOnUserRoleInfo;
        else if (statusCode === HTTPStatusCode.BAD_REQUEST)
          return getSalesUserBasedOnUserRoleInfo;
        else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
          let deletedResponse =
            UserSessionManagementController.deleteAllSession();
          if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
        }
      }
    } catch (error) {
      return errorDebug(error, "IncentiveReportDAO.getSalesUsersBasedOnUserRoleDAO");
    }
  },
  getUserHierarchyDAO: async function (data) {
    try {
      const getUserHierarchy = await IncentiveReportAPI.getUserHierarchy(data);
      if (getUserHierarchy) {
        const statusCode = getUserHierarchy["statusCode"];
        if (statusCode === HTTPStatusCode.OK) {
          const tempResult = getUserHierarchy.responseBody;
          return {
            statusCode: statusCode,
            responseBody: tempResult.details,
          };
        } else if (statusCode === HTTPStatusCode.NOT_FOUND)
          return getUserHierarchy;
        else if (statusCode === HTTPStatusCode.BAD_REQUEST)
          return getUserHierarchy;
        else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
          let deletedResponse =
            UserSessionManagementController.deleteAllSession();
          if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
        }
      }
    } catch (error) {
      return errorDebug(error, "IncentiveReportDAO.getUserHierarchyDAO");
    }
  },
  getUserListInIncentiveDAO: async function (month, year, managerId) {
    try {
      const getUserInfo = await IncentiveReportAPI.getUserListInIncentive(month, year, managerId);
      if (getUserInfo) {
        const statusCode = getUserInfo["statusCode"];
        if (statusCode === HTTPStatusCode.OK) {
          const tempResult = getUserInfo.responseBody;
          return {
            statusCode: statusCode,
            responseBody: tempResult.details,
          };
        } else if (statusCode === HTTPStatusCode.NOT_FOUND)
          return getUserInfo;
        else if (statusCode === HTTPStatusCode.BAD_REQUEST)
          return getUserInfo;
        else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
          let deletedResponse =
            UserSessionManagementController.deleteAllSession();
          if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
        }
      }
    } catch (error) {
      return errorDebug(error, "IncentiveReportDAO.getUserListInIncentiveDAO");
    }
  },
  getUserListInIncentiveDetailsDAO: async function (month, userId, isSelfTargets, year) {
    try {
      const getUserInfo = await IncentiveReportAPI.getUserListInIncentiveDetails(month, userId, isSelfTargets, year);
      if (getUserInfo) {
        const statusCode = getUserInfo["statusCode"];
        if (statusCode === HTTPStatusCode.OK) {
          const tempResult = getUserInfo.responseBody;
          return {
            statusCode: statusCode,
            responseBody: tempResult.details,
          };
        } else if (statusCode === HTTPStatusCode.NOT_FOUND)
          return getUserInfo;
        else if (statusCode === HTTPStatusCode.BAD_REQUEST)
          return getUserInfo;
        else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
          let deletedResponse =
            UserSessionManagementController.deleteAllSession();
          if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
        }
      }
    } catch (error) {
      return errorDebug(error, "IncentiveReportDAO.getUserListInIncentiveDetailsDAO");
    }
  },
  getIncentiveReportDetailsContractBoosterDAO: async function (month, userId, isSelfTargets, year) {
    try {
      const getIncentiveReportBooster = await IncentiveReportAPI.getIncentiveReportDetailsContractBooster(month, userId, isSelfTargets, year);
      if (getIncentiveReportBooster) {
        const statusCode = getIncentiveReportBooster["statusCode"];
        if (statusCode === HTTPStatusCode.OK) {
          const tempResult = getIncentiveReportBooster.responseBody;
          return {
            statusCode: statusCode,
            responseBody: tempResult.details,
          };
        } else if (statusCode === HTTPStatusCode.NOT_FOUND)
          return getIncentiveReportBooster;
        else if (statusCode === HTTPStatusCode.BAD_REQUEST)
          return getIncentiveReportBooster;
        else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
          let deletedResponse =
            UserSessionManagementController.deleteAllSession();
          if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
        }
      }
    } catch (error) {
      return errorDebug(error, "IncentiveReportDAO.getIncentiveReportDetailsContractBoosterDAO");
    }
  },
  getIncentiveReportDetailsAMNRDAO: async function (month, userId, isSelfTargets, year) {
    try {
      const getIncentiveReportAMNR = await IncentiveReportAPI.getIncentiveReportDetailsAMNR(month, userId, isSelfTargets, year);
      if (getIncentiveReportAMNR) {
        const statusCode = getIncentiveReportAMNR["statusCode"];
        if (statusCode === HTTPStatusCode.OK) {
          const tempResult = getIncentiveReportAMNR.responseBody;
          return {
            statusCode: statusCode,
            responseBody: tempResult.details,
          };
        } else if (statusCode === HTTPStatusCode.NOT_FOUND)
          return getIncentiveReportAMNR;
        else if (statusCode === HTTPStatusCode.BAD_REQUEST)
          return getIncentiveReportAMNR;
        else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
          let deletedResponse =
            UserSessionManagementController.deleteAllSession();
          if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
        }
      }
    } catch (error) {
      return errorDebug(error, "IncentiveReportDAO.getIncentiveReportDetailsAMNRDAO");
    }
  },
};
