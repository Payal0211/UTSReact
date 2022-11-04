import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SecuredStorageService } from 'shared/services/secure_storage/secure_storage_service';
import UTSRoutes from 'constants/routes';

export const ProtectedUtils = (props) => {
	const { Component } = props;
	const navigate = useNavigate();
	useEffect(() => {
		let login = SecuredStorageService.readSecuredData('userSessionInfo');
		if (!login) navigate(UTSRoutes.LOGINROUTE);
	});
	return <Component />;
};
