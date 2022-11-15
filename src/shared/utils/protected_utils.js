import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';

export const ProtectedRoutes = ({ Component }) => {
	const navigate = useNavigate();
	useEffect(() => {
		const checkStatus = async () => {
			let login = UserSessionManagementController.getAPIKey();
			if (!login) {
				let deletedResponse =
					UserSessionManagementController.deleteAllSession();
				if (deletedResponse) navigate(UTSRoutes.LOGINROUTE);
			}
		};
		checkStatus();
	}, [navigate]);
	return <Component />;
};
