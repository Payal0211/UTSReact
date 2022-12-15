import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { useQueryClient } from '@tanstack/react-query';

export const ProtectedRoutes = ({ Component }) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	useEffect(() => {
		const checkStatus = async () => {
			let login = UserSessionManagementController.getAPIKey();
			if (!login) {
				let deletedResponse =
					UserSessionManagementController.deleteAllSession();
				if (deletedResponse) {
					queryClient.removeQueries();
					navigate(UTSRoutes.LOGINROUTE);
				}
			}
		};
		checkStatus();
	}, [navigate, queryClient]);
	return <Component />;
};
