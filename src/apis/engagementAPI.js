import {
    EngagementAPI,
    NetworkInfo,
    OnboardAPI,
    SubDomain,
} from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const EngagementRequestAPI = {
    getEngagementList: async function (data) {
        let httpService = new HttpServices();
        httpService.URL =
            NetworkInfo.NETWORK +
            SubDomain.ENGAGEMENT +
            EngagementAPI.LIST + `?loggedinuserid=${JSON.parse(localStorage.getItem("userSessionInfo")).LoggedInUserTypeID}`;
        httpService.dataToSend = data;
        httpService.setAuthRequired = true;
        httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        try {
            let response = await httpService.sendPostRequest(data);
            return response;
        } catch (error) {
            return errorDebug(error, 'EngagementRequestAPI.getEngagementList');
        }
    },
    getEngagementFilterList: async function () {
        let httpService = new HttpServices();
        httpService.URL =
            NetworkInfo.NETWORK +
            SubDomain.ENGAGEMENT +
            EngagementAPI.FILTER;
        httpService.setAuthRequired = true;
        httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        try {
            let response = await httpService.sendGetRequest();
            return response;
        } catch (error) {
            return errorDebug(error, 'EngagementRequestAPI.getEngagementFilterList');
        }
    },
    viewOnboardFeedback: async function (onBoardID) {
        let httpService = new HttpServices();
        httpService.URL =
            NetworkInfo.NETWORK +
            SubDomain.ENGAGEMENT +
            EngagementAPI.VIEW_ONBOARD_FEEDBACK + `?OnBoardID=${onBoardID}`;
        httpService.setAuthRequired = true;
        httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        try {
            let response = await httpService.sendGetRequest();
            return response;
        } catch (error) {
            return errorDebug(error, 'EngagementRequestAPI.viewOnboardFeedback');
        }
    },
    getFeedback: async function (feedback) {
        let httpService = new HttpServices();
        httpService.URL =
            NetworkInfo.NETWORK +
            SubDomain.ENGAGEMENT +
            EngagementAPI.GET_ONBOARD_FEEDBACK + `?totalrecord=${feedback?.totalRecords}&pagenumber=${feedback?.pagenumber}&onBoardId=${feedback?.onBoardId}`;
        httpService.setAuthRequired = true;
        httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        try {
            let response = await httpService.sendGetRequest();
            return response;
        } catch (error) {
            return errorDebug(error, 'EngagementRequestAPI.getFeedback');
        }
    },
    onBoardDetails: async function (onBoardID) {
        let httpService = new HttpServices();
        httpService.URL =
            NetworkInfo.NETWORK +
            SubDomain.ONBOARD +
            OnboardAPI.VIEW_IN_DETAIL + `?onBoardId=${onBoardID}`
        httpService.setAuthRequired = true;
        httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        try {
            let response = await httpService.sendGetRequest();
            return response;
        } catch (error) {
            return errorDebug(error, 'EngagementRequestAPI.onBoardDetails');
        }
    },

    feedbackFormContent: async function (onBoardID) {
        let httpService = new HttpServices();
        httpService.URL =
            NetworkInfo.NETWORK +
            SubDomain.ENGAGEMENT +
            EngagementAPI.GET_FEEDBACK_CONTENT + `?HR_ID=${12465}&OnBoardID=${10649}`
        httpService.setAuthRequired = true;
        httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        try {
            let response = await httpService.sendGetRequest();
            return response;
        } catch (error) {
            return errorDebug(error, 'EngagementRequestAPI.feedbackFormContent');
        }
    },
    submitFeedBackForm: async function (data) {
        let httpService = new HttpServices();
        httpService.URL =
            NetworkInfo.NETWORK +
            SubDomain.ENGAGEMENT +
            EngagementAPI.SAVE_FEEDBACK_CLIENT_ONBOARD
        httpService.dataToSend = data;
        httpService.setAuthRequired = true;
        httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        try {
            let response = await httpService.sendPostRequest(data);
            return response;
        } catch (error) {
            return errorDebug(error, 'EngagementRequestAPI.submitFeedBackForm');
        }
    },
}
