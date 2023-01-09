const {
	UserSessionManagementController,
} = require('modules/user/services/user_session_services');
const { useEffect } = require('react');

export const useSessionTimeout = () => {
	useEffect(() => {
		const date = new Date();
		if (date.getHours() >= 23) {
			UserSessionManagementController.deleteAllSession();
		}
	}, []);
};
