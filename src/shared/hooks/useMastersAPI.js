import { MastersKey } from 'constants/application';
import { MasterDAO } from 'core/master/masterDAO';
import { useCallback, useEffect, useState } from 'react';

export const useMastersAPI = (mastersKey) => {
	const [returnState, setReturnState] = useState({});

	const getTimeZonePreference = useCallback(async () => {
		const timeZone = await MasterDAO.getTalentTimeZoneRequestDAO();
		setReturnState({
			...returnState,
			[MastersKey.TIMEZONE]: timeZone && timeZone.responseBody,
		});
		// console.log(mastersKey);
	}, [returnState]);
	const getAvailability = useCallback(async () => {
		const availabilityResponse = await MasterDAO.getHowSoonRequestDAO();
		// console.log('--availabilityResponse--', availabilityResponse);
		setReturnState({
			...returnState,
			[MastersKey.AVAILABILITY]:
				availabilityResponse && availabilityResponse.responseBody,
		});
	}, [returnState]);
	const getTalentRole = useCallback(async () => {
		const talentRole = await MasterDAO.getTalentsRoleRequestDAO();
		// console.log('--talentRole--', talentRole);
		setReturnState({
			...returnState,
			[MastersKey.TALENTROLE]: talentRole && talentRole.responseBody,
		});
	}, [returnState]);
	const getSalesPerson = useCallback(async () => {
		const salesPersonResponse = await MasterDAO.getSalesManRequestDAO();
		// console.log('--salesPersonResponse--', salesPersonResponse);
		setReturnState({
			...returnState,
			[MastersKey.TALENTROLE]:
				salesPersonResponse && salesPersonResponse.responseBody.details,
		});
	}, [returnState]);

	useEffect(() => {
		Object.keys(mastersKey).forEach((value) => {
			switch (value) {
				case MastersKey.AVAILABILITY:
					getAvailability();
					break;
				case MastersKey.TIMEZONE:
					getTimeZonePreference();
					break;
				case MastersKey.TALENTROLE:
					getTalentRole();
					break;
				case MastersKey.SALESPERSON:
					getSalesPerson();
					break;
				default:
					break;
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mastersKey]);

	// console.log(returnState, '--hooks');
	return { returnState };
};
