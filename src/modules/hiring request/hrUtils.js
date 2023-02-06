import {
	HiringRequestHRStatus,
	SubmitType,
	UserAccountRole,
	hiringRequestPriority,
} from 'constants/application';
import { _isNull } from 'shared/utils/basic_utils';
import HROperator from './components/hroperator/hroperator';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import MatchmakingModal from './components/matchmaking/matchmaking';
export const hrUtils = {
	modifyHRRequestData: (hrData) => {
		return hrData.responseBody.Data.map((item) => ({
			key: item.hrid,
			starStatus: item.starMarkedStatusCode,
			adHocHR: item.adHocHR,
			Date: item.createdDateTime.split(' ')[0],
			HR_ID: item.hr,
			TR: item.tr,
			Position: item.position,
			Company: item.company,
			Time: item.timeZone.split(' ')[0],
			typeOfEmployee: item.typeOfEmployee,
			salesRep: item.salesRep,
			hrStatus: item.hrStatus,
			hrStatusCode: item.hrStatusCode,
		}));
	},
	allHiringRequestSearch: (e, apiData) => {
		let filteredData = apiData.filter((val) => {
			return (
				val.adHocHR.toLowerCase().includes(e.target.value.toLowerCase()) ||
				val.HR_ID.toLowerCase().includes(e.target.value.toLowerCase()) ||
				val.Position.toLowerCase().includes(e.target.value.toLowerCase()) ||
				val.Company.toLowerCase().includes(e.target.value.toLowerCase()) ||
				val.Time.toLowerCase().includes(e.target.value.toLowerCase()) ||
				val.typeOfEmployee
					.toLowerCase()
					.includes(e.target.value.toLowerCase()) ||
				val.salesRep.toLowerCase().includes(e.target.value.toLowerCase()) ||
				val.hrStatus.toLowerCase().includes(e.target.value.toLowerCase())
			);
		});

		return filteredData;
	},
	hrTogglePriority: (response, apiData) => {
		if (response.responseBody) {
			let index = apiData.findIndex(
				(item) => item.key === response.responseBody,
			);
			let tempdata = apiData[index];
			if (tempdata.starStatus === hiringRequestPriority.NO_PRIORITY) {
				tempdata.starStatus = hiringRequestPriority.NEXT_WEEK_PRIORITY;
			} else if (
				tempdata.starStatus === hiringRequestPriority.NEXT_WEEK_PRIORITY
			) {
				tempdata.starStatus = hiringRequestPriority.NO_PRIORITY;
			}
			return { tempdata, index };
		}
	},
	hrFormDataFormatter(d, draft, watch, contactID, addHrResponse) {
		const hrFormDetails = {
			en_Id: _isNull(addHrResponse) ? '' : addHrResponse.en_Id,
			contactId: _isNull(contactID) ? 0 : contactID,
			isSaveasDraft: draft === SubmitType.SAVE_AS_DRAFT && true,
			clientName:
				draft === SubmitType.SAVE_AS_DRAFT ? watch('clientName') : d.clientName,

			companyName:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('companyName')
					: d.companyName,
			role:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('role'))
						? 0
						: watch('role')
					: _isNull(d.role)
					? 0
					: d.role,
			otherRole:
				watch('role') === 'others'
					? draft === SubmitType.SAVE_AS_DRAFT
						? _isNull(watch('otherRole'))
							? null
							: watch('otherRole').trim()
						: _isNull(d.otherRole)
						? null
						: d.otherRole.trim()
					: null,
			hrTitle:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('hrTitle'))
						? null
						: watch('hrTitle')
					: _isNull(d.hrTitle)
					? null
					: d.hrTitle,
			jdURL:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('jdURL'))
						? null
						: watch('jdURL')
					: _isNull(d.jdURL)
					? null
					: d.jdURL,
			budget:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('budget'))
						? null
						: watch('budget')
					: _isNull(d.budget)
					? null
					: d.budget,
			minimumBudget:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('minimumBudget'))
						? 0
						: parseFloat(watch('minimumBudget'))
					: _isNull(d.minimumBudget)
					? 0
					: parseFloat(d.minimumBudget),
			maximumBudget:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('maximumBudget'))
						? 0
						: parseFloat(watch('maximumBudget'))
					: _isNull(d.maximumBudget)
					? 0
					: parseFloat(d.maximumBudget),
			NRMargin:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('NRMargin'))
						? 0
						: parseInt(watch('NRMargin'))
					: _isNull(d.NRMargin)
					? 0
					: parseInt(d.NRMargin),
			salesPerson:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('salesPerson'))
						? 0
						: watch('salesPerson')
					: _isNull(d.salesPerson)
					? 0
					: d.salesPerson,
			contractDuration:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('contractDuration'))
						? null
						: watch('contractDuration')
					: _isNull(d.contractDuration)
					? null
					: d.contractDuration,
			howSoon:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('howSoon'))
						? null
						: watch('howSoon').toString()
					: _isNull(d.howSoon)
					? null
					: d.howSoon.toString(),
			years:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('years'))
						? 0
						: parseInt(watch('years'))
					: _isNull(d.years)
					? 0
					: parseInt(d.years),
			months:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('months'))
						? 0
						: parseInt(watch('months'))
					: _isNull(d.months)
					? 0
					: parseInt(d.months),
			timeZone:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('timeZone'))
						? 0
						: watch('timeZone')
					: _isNull(d.timeZone)
					? 0
					: d.timeZone,
			talentsNumber:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('talentsNumber'))
						? 0
						: parseInt(watch('talentsNumber'))
					: _isNull(d.talentsNumber)
					? 0
					: parseInt(d.talentsNumber),
			dealID:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('dealID'))
						? null
						: watch('dealID')
					: _isNull(d.dealID)
					? null
					: d.dealID,
			bqFormLink:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('bqFormLink'))
						? null
						: watch('bqFormLink')
					: _isNull(d.bqFormLink)
					? null
					: d.bqFormLink,
			discoveryCallLink:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('discoveryCallLink'))
						? null
						: watch('discoveryCallLink')
					: _isNull(d.discoveryCallLink)
					? null
					: d.discoveryCallLink,
			/* interviewerFullName:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('interviewerFullName'))
						? null
						: watch('interviewerFullName')
					: _isNull(d.interviewerFullName)
					? null
					: d.interviewerFullName,
			interviewerEmail:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('interviewerEmail'))
						? null
						: watch('interviewerEmail')
					: _isNull(d.interviewerEmail)
					? null
					: d.interviewerEmail,
			interviewerLinkedin:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('interviewerLinkedin'))
						? null
						: watch('interviewerLinkedin')
					: _isNull(d.interviewerLinkedin)
					? null
					: d.interviewerLinkedin,
			interviewerDesignation:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('interviewerDesignation'))
						? null
						: watch('interviewerDesignation')
					: _isNull(d.interviewerDesignation)
					? null
					: d.interviewerDesignation,
			secondaryInterviewer:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('secondaryInterviewer')
					: d.secondaryInterviewer, */
		};
		return hrFormDetails;
	},

	getAcceptTR(IsAccepted, loggedInUserTypeID) {
		if (
			loggedInUserTypeID === UserAccountRole.TALENTOPS ||
			loggedInUserTypeID === UserAccountRole.OPS_TEAM_MANAGER ||
			loggedInUserTypeID === UserAccountRole.ADMINISTRATOR ||
			loggedInUserTypeID === UserAccountRole.DEVELOPER
		) {
			if (
				HiringRequestHRStatus.DRAFT ||
				HiringRequestHRStatus.HR_ACCEPTED ||
				HiringRequestHRStatus.ACCEPTANCE_PENDING ||
				HiringRequestHRStatus.INFO_PENDING ||
				HiringRequestHRStatus.IN_PROCESS ||
				HiringRequestHRStatus.OTHER
			) {
				if (IsAccepted === 0) {
					return (
						<HROperator
							title="Accept HR"
							icon={<ArrowDownSVG style={{ width: '16px' }} />}
							backgroundColor={`var(--color-sunlight)`}
							iconBorder={`1px solid var(--color-sunlight)`}
						/>
					);
				}
			}
		}
	},
	getAccpetMoreTR(IsAccepted, loggedInUserTypeID, TRAcceptedValue) {
		if (
			loggedInUserTypeID === UserAccountRole.TALENTOPS ||
			loggedInUserTypeID === UserAccountRole.OPS_TEAM_MANAGER ||
			loggedInUserTypeID === UserAccountRole.ADMINISTRATOR ||
			loggedInUserTypeID === UserAccountRole.DEVELOPER
		) {
			if (
				HiringRequestHRStatus.DRAFT ||
				HiringRequestHRStatus.HR_ACCEPTED ||
				HiringRequestHRStatus.ACCEPTANCE_PENDING ||
				HiringRequestHRStatus.INFO_PENDING ||
				HiringRequestHRStatus.IN_PROCESS ||
				HiringRequestHRStatus.OTHER
			) {
				if (IsAccepted === 1 && TRAcceptedValue >= 1) {
					return (
						<HROperator
							title="Accept More TRs"
							icon={<ArrowDownSVG style={{ width: '16px' }} />}
							backgroundColor={`var(--color-sunlight)`}
							iconBorder={`1px solid var(--color-sunlight)`}
						/>
					);
				}
			}
		}
	},
	showMatchmaking(
		apiData,
		loggedInUserTypeID,
		callAPI,
		urlSplitter,
		updatedSplitter,
	) {
		if (apiData?.IsAccepted === 1 && apiData?.TR_Accepted >= 1) {
			if (
				loggedInUserTypeID === UserAccountRole.TALENTOPS ||
				loggedInUserTypeID === UserAccountRole.OPS_TEAM_MANAGER
			) {
				return (
					apiData?.HRTalentDetails?.length > 0 && (
						<MatchmakingModal
							refreshedHRDetail={callAPI}
							hrID={urlSplitter?.split('HR')[0]}
							hrNo={updatedSplitter}
							hrStatusCode={apiData?.HRStatusCode}
							hrStatus={apiData?.HRStatus}
							hrPriority={apiData?.StarMarkedStatusCode}
						/>
					)
				);
			}
		} else {
			return null;
		}
	},
};
