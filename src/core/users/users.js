import { UserListAPIRequest } from 'apis/usersAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const UserRequestDAO = {
	getUserList: async function (data) {
		try {
			const userList = await UserListAPIRequest.userList(data);
			if (userList) {
				const statusCode = userList['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = userList.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				}
				else if (statusCode === HTTPStatusCode.NOT_FOUND) return userList;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return userList;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					UserSessionManagementController.deleteAllSession();
					return (
						<Navigate
							replace
							to={UTSRoutes.LOGINROUTE}
						/>
					);
				}
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getPaginatedHiringRequestDAO');
		}
	},
};
