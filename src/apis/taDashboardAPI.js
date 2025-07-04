import { NetworkInfo, SubDomain, TaDashboardURL, UsersAPI, ReportsAPI } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const TaDashboardAPI = {
	getAllMasterRequest: async function (type) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_ALL_MASTER_Data + `${type? `?reportType=${type}` : ''}`
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getAllMasterRequest');
		}
	},
    getAllTAListRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_TA_TASK_DETAILS
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getAllTAListRequest');
		}
	},
    updateTAListRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.UPDATE_TA_TASK
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.updateTAListRequest');
		}
	},
    getTACompanyListRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_TA_COMPANY_List
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getTACompanyListRequest');
		}
	},
    getTAHRListFromCompanyRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_HR_LIST_COMPANY
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getTAHRListFromCompanyRequest');
		}
	},
    getHRTalentDetailsRequest: async function (pl) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_HR_TALENT_DETAILS + `?hrID=${pl.hrID}&statusID=${pl.statusID}${pl.stageID ?`&stageID=${pl.stageID}` : ''}${pl.targetDate ? `&targetDate=${pl.targetDate}`:''}`
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getHRTalentDetailsRequest');
		}
	},
	getTotalRevenueRequest: async function (pl) {
		let httpService = new HttpServices();		
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_TOTAL_REVENUE_PER_TA + `?month=${pl?.month}&year=${pl?.year}`
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getHRTalentDetailsRequest');
		}
	},
	getDailyActiveTargetsRequest: async function (pl) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_DAILY_ACTIVE_TARGETS + `?month=${pl?.month}&year=${pl?.year}`
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getDailyActiveTargetsRequest');
		}
	},
	getHRTalentsWiseRecruiterDashboardRequest: async function (pl) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportsAPI.GET_HR_TALENTS_WISE_DESHBOARD + `?month=${pl?.month}&year=${pl?.year}&fromDate=${pl?.fromDate}&toDate=${pl?.toDate}&tAUserID=${pl?.tAUserID}&optiontype=${pl?.optiontype}`
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getHRTalentsWiseRecruiterDashboardRequest');
		}
	},
    getGoalsDetailsRequest: async function (pl) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_TA_TARGETS
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = pl
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getGoalsDetailsRequest');
		}
	},
    geAllTAUSERSRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.ALL_TA_USERS
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.geAllTAUSERSRequest');
		}
	},


    insertTaskCommentRequest: async function (pl) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.INSERT_TASK_COMMENT
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = pl
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.insertTaskCommentRequest');
		}
	},
    getALLCommentsRequest: async function (id) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_ALL_COMMENTS + `?taskId=${id}`
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getALLCommentsRequest');
		}
	},
    removeTasksRequest: async function (id) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.REMOVE_TASK + `?taskId=${id}`
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.removeTasksRequest');
		}
	},
    insertProfileShearedTargetRequest: async function (pl) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.INSERT_TARGET_DETAILS
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = pl
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.insertProfileShearedTargetRequest');
		}
	},
	getTAWiseHRPipelineDetailsRequest: async function (pl) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_TA_WISE_PIPELINE_DETAILS+ `?pipelineTypeID=${pl?.pipelineTypeID}&taUserID=${pl?.taUserID}&month=${pl?.month}&year=${pl?.year}`			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.insertProfileShearedTargetRequest');
		}
	},
	getTAGoalListAPI: async function () {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.MASTERS +
				UsersAPI.GET_TA_MONTHLY_GOAL +
				'?PageIndex=1&PageSize=100&SortExpression=TA&SortDirection=ASC';

			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();

			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.getTAGoalListAPI');
		}
	},
	addOrUpdateTAMonthlyGoalAPI: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			UsersAPI.ADD_UPDATE_TA_MONTHLY_GOAL+`?ID=${payload?.ID}&TA_User_ID=${payload?.TA_User_ID}&Goal=${payload?.Goal}`
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.addOrUpdateTAMonthlyGoalAPI');
		}
	},
    deleteTAGoalAPI: async function (payload) {
        let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			UsersAPI.DELETE_TA_MONTHLY_GOAL+`?ID=${payload?.ID}`			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.deleteTAGoalAPI');
		}
    },
}