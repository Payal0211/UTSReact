import { MasterAPI } from 'apis/masterAPI';
import { HubSpotAPI } from 'apis/hubspotAPI';
import { userAPI } from 'apis/userAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { errorDebug } from 'shared/utils/error_debug_utils';


export const HubSpotDAO = {
    getAutoCompleteCompanyDAO: async (company)=>{
        try {
            const autocompleteResult = await HubSpotAPI.getAutocompleteCompany(company)
			if (autocompleteResult) {
				const statusCode = autocompleteResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = autocompleteResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return autocompleteResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return autocompleteResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'HubSpotDAO.getAutoCompleteCompanyDAO');
		}
    },
    getCompanyDetailsDAO :async (companyId)=>{
        try {
            const autocompleteResult = await HubSpotAPI.getCompanyDetails(companyId)
			if (autocompleteResult) {
				const statusCode = autocompleteResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = autocompleteResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return autocompleteResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return autocompleteResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'HubSpotDAO.getCompanyDetailsDAO');
		}
    },
    getContactsByEmailDAO :async (Email)=>{
        try {
            const contactsResult = await HubSpotAPI.getContactsByEmail(Email)
			if (contactsResult) {
				const statusCode = contactsResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = contactsResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return contactsResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return contactsResult;
                else if (statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR){
                    return contactsResult;
                }
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'HubSpotDAO.getContactsByEmailDAO');
		}
    },
}