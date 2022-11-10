import { hiringRequestAPI } from 'apis/hiringRequestAPI';
import { HTTPStatusCode } from 'constants/network';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const hiringRequestDAO = {
	getPaginatedHiringRequestDAO: async function (hrData) {
		try {
			const hrResult = await hiringRequestAPI.getPaginatedHiringRequest(hrData);
			if (hrResult) {
				const statusCode = hrResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return hrResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return hrResult;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getPaginatedHiringRequestDAO');
		}
	},
};
