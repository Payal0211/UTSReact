import { useCallback, useState } from 'react';
import HROperator from '../hroperator/hroperator';
import { AiOutlineDown } from 'react-icons/ai';
import { HRCTA } from 'constants/application';
import ConvertToDP from '../convertToDP/convertToDP';
import ConvertToContractual from '../convertToContractual/convertToContractual';
import AcceptHR from '../acceptHR/acceptHR';
import { useLocation, useNavigate } from 'react-router-dom';
import MatchmakingModal from '../matchmaking/matchmaking';
import UTSRoutes from 'constants/routes';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';

const CTASlot1 = ({ miscData, slotItem, apiData, callAPI, hrID }) => {
	const navigate = useNavigate();
	const [isConvertToContractual, setIsConvertToContractual] = useState(false);
	const [isConvertToDP, setIsConvertToDP] = useState(false);
	const [isAcceptHR, setIsAcceptHR] = useState(false);
	const [isShareProfile, setIsShareProfile] = useState(false);

	const [isAMAssignment, setIsAMAssignment] = useState(false);
	const switchLocation = useLocation();
	let urlSplitter = `${switchLocation.pathname.split('/')[2]}`;
	const updatedSplitter = 'HR' + apiData && apiData?.ClientDetail?.HR_Number;
	const navigateToEditDebriefing = useCallback(async () => {
		const response = await hiringRequestDAO.getHRDetailsRequestDAO(hrID);

		if (response?.statusCode === HTTPStatusCode.OK) {
			localStorage.setItem('hrID', hrID);
			localStorage.setItem('fromEditDeBriefing', true);
			navigate(UTSRoutes.ADDNEWHR);
		}
	}, [hrID, navigate]);

	return (
		<>
			<div>
				<HROperator
					title={slotItem?.[0]?.label}
					icon={<AiOutlineDown />}
					backgroundColor={`var(--color-sunlight)`}
					iconBorder={`1px solid var(--color-sunlight)`}
					isDropdown={true}
					listItem={slotItem}
					menuAction={(menuItem) => {
						switch (menuItem.key) {
							case HRCTA.CONVERT_TO_CONTRACTUAL: {
								setIsConvertToContractual(true);
								break;
							}
							case HRCTA.CONVERT_TO_DP: {
								setIsConvertToDP(true);
								break;
							}
							case HRCTA.ACCEPT_HR: {
								setIsAcceptHR(true);
								break;
							}
							case HRCTA.SHARE_PROFILE: {
								setIsShareProfile(true);
								break;
							}
							case HRCTA.AM_ASSIGNMENT: {
								setIsAMAssignment(true);
								break;
							}
							case HRCTA.EDIT_DEBRIEFING_HR: {
								navigateToEditDebriefing();
								break;
							}
							default:
								break;
						}
					}}
				/>
			</div>
			{isConvertToDP && (
				<ConvertToDP
					callAPI={callAPI}
					hrID={hrID}
					apiData={apiData}
					isConvertToDP={isConvertToDP}
					setIsConvertToDP={setIsConvertToDP}
				/>
			)}
			{isConvertToContractual && (
				<ConvertToContractual
					callAPI={callAPI}
					hrID={hrID}
					apiData={apiData}
					isConvertToContractual={isConvertToContractual}
					setIsConvertToContractual={setIsConvertToContractual}
				/>
			)}
			{isAcceptHR && (
				<AcceptHR
					hrID={apiData?.ClientDetail?.HR_Number}
					openModal={isAcceptHR}
					cancelModal={() => setIsAcceptHR(false)}
				/>
			)}
			{isShareProfile && (
				<MatchmakingModal
					isMatchmaking={isShareProfile}
					setMatchmakingModal={setIsShareProfile}
					onCancel={() => setIsShareProfile(false)}
					apiData={apiData}
					refreshedHRDetail={callAPI}
					hrID={urlSplitter?.split('HR')[0]}
					hrNo={updatedSplitter}
					hrStatusCode={apiData?.HRStatusCode}
					hrStatus={apiData?.HRStatus}
					hrPriority={apiData?.StarMarkedStatusCode}
				/>
			)}
		</>
	);
};

export default CTASlot1;
