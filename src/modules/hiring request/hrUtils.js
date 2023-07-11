import {
	AdHOCHR,
	HiringRequestHRStatus,
	SubmitType,
	TalentOnboardStatus,
	UserAccountRole,
	hiringRequestPriority,
} from 'constants/application';
import { _isNull } from 'shared/utils/basic_utils';
import HROperator from './components/hroperator/hroperator';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import MatchmakingModal from './components/matchmaking/matchmaking';
import AcceptHR from './components/acceptHR/acceptHR';
export const hrUtils = {
	modifyHRRequestData: (hrData) => {
		return hrData?.responseBody?.rows.map((item) => ({
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
			userId: item?.userId,
			reopenHR:item?.reopenHR,
			companyCategory: item?.companyCategory,
			HRID: item?.hrid
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
	hrFilterSearch: (e, data) => {
		let filteredData = data.filter((val) => {
			return val.value.toLowerCase().includes(e.target.value.toLowerCase());
		});
		return filteredData;
	},
	hrTogglePriority: (response, apiData) => {
		if (response.responseBody) {
			let index = apiData.findIndex(
				(item) => item.key === JSON.parse(localStorage.getItem('hrid')),
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
	hrFormDataFormatter(
		d,
		draft,
		watch,
		contactID,
		isHRDirectPlacement,
		addHrResponse,
		fileName,
		jdDumpID,
	) {
		let enIDdata = localStorage.getItem('enIDdata');
		const hrFormDetails = {
			en_Id: _isNull(enIDdata) ? '' : enIDdata,
			contactId: contactID || 0,
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
						: watch('role')?.id
					: _isNull(d.role)
					? 0
					: d.role?.id,
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
			jDFilename: fileName,
			jDDescription: null,
			jDDump_ID: jdDumpID,
			hdnSkills: null,
			budgetType:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('budget'))
						? null
						: watch('budget')?.value
					: _isNull(d.budget.value)
					? null
					: d.budget.value,
			currency: draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('currency'))
					? null
					: watch('currency')?.value
					: _isNull(d.currency.value)
					? null
					: d.currency.value,	
			adhocBudgetCost: SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('adhocBudgetCost'))
					? null
					: watch('adhocBudgetCost')
					: _isNull(d.adhocBudgetCost)
					? null
					: d.adhocBudgetCost,
			IsHiringLimited: isHRDirectPlacement? null : SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('tempProject')?.value)
					? null
					: watch('tempProject')?.value
					: _isNull(d.tempProject?.value)
					? null
					: d.tempProject?.value,					
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

			availability:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('availability'))
						? null
						: watch('availability')?.value
					: _isNull(d.availability)
					? null
					: d.availability?.value,
			NRMargin: 
				draft === SubmitType.SAVE_AS_DRAFT
					? isHRDirectPlacement ? 0 :_isNull(watch('NRMargin'))
						? 0
						: parseInt(watch('NRMargin'))
					: isHRDirectPlacement ? 0 : _isNull(d.NRMargin)
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
			ChildCompanyName: watch('otherChildCompanyName')
				? watch('otherChildCompanyName')
				: watch('childCompany')?.value,
			contractDuration: 
				draft === SubmitType.SAVE_AS_DRAFT
					? isHRDirectPlacement ? null : _isNull(watch('contractDuration'))
						? null
						: watch('contractDuration').value
					:isHRDirectPlacement ? null : _isNull(d.contractDuration.value)
					? null
					: d.contractDuration.value,
			TimeZoneFromTime:  
					draft === SubmitType.SAVE_AS_DRAFT
						? _isNull(watch('region')) ? null : watch('region')?.value?.includes('Overlapping') ? null : _isNull(watch('fromTime').value)
						? null
						: watch('fromTime').value
						: watch('region')&& watch('region')?.value?.includes('Overlapping') ? null : _isNull(d.fromTime?.value)
						? null
						: d.fromTime?.value,		
			TimeZoneEndTime:  
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('region')) ? null : watch('region')?.value.includes('Overlapping') ? null : _isNull(watch('endTime').value)
					? null
					: watch('endTime').value
					: watch('region')?.value.includes('Overlapping') ? null : _isNull(d.endTime.value)
					? null
					: d.endTime.value,
			OverlapingHours:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('region')) ? null : watch('region')?.value.includes('Overlapping') ?  _isNull(watch('overlappingHours'))
					? null
					: watch('overlappingHours') : null
					: watch('region')?.value.includes('Overlapping') ?  _isNull(d.overlappingHours)
					? null
					: d.overlappingHours : null,
			howSoon:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('howSoon'))
						? null
						: watch('howSoon')?.value.toString()
					: _isNull(d.howSoon)
					? null
					: d.howSoon?.value.toString(),
			years:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('years'))
						? 0
						: parseInt(watch('years'))
					: _isNull(d.years)
					? 0
					: parseInt(d.years),
			durationType: 
				draft === SubmitType.SAVE_AS_DRAFT
					?isHRDirectPlacement ? null : _isNull(watch('getDurationType')?.value)
						? 0
						: watch('getDurationType')?.value
					:isHRDirectPlacement ? null :  _isNull(d.getDurationType?.value)
					? 0
					: d.getDurationType?.value,
			partialEngagementTypeId	: 
				draft === SubmitType.SAVE_AS_DRAFT
					? watch("availability")?.value === 'Part Time' ? _isNull(watch('partialEngagement')?.id)
						? 0
						: watch('partialEngagement')?.id : null
					: watch("availability")?.value === 'Part Time' ? _isNull(d.partialEngagement?.id)
					? 0
					: d.partialEngagement?.id  
					: null,
			NoofHoursworking: 
				draft === SubmitType.SAVE_AS_DRAFT
					? watch("availability")?.value === 'Part Time' ? _isNull(watch('workingHours'))
						? 0
						: parseInt(watch('workingHours')) : null
					: watch("availability")?.value === 'Part Time' ? _isNull(d.workingHours)
					? 0
					: parseInt(d.workingHours)
					: null,
			timeZone:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('region'))
						? 0
						: watch('region')?.id
					: _isNull(d.region)
					? 0
					: d.region?.id,
			timeZonePreferenceId:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('timeZone'))
						? 0
						: watch('timeZone')?.id
					: _isNull(d.timeZone)
					? 0
					: d.timeZone?.id,
			timezone_Preference:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('timeZone'))
						? ' '
						: watch('region')?.value + watch('timeZone')?.value
					: _isNull(d.timeZone)
					? ' '
					: d.region?.value + d.timeZone?.value,

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
						? '0'
						: watch('dealID').toString()
					: _isNull(d.dealID)
					? '0'
					: d.dealID.toString(),
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
			isHRTypeDP: isHRDirectPlacement,
			directPlacement: {
				hiringRequestId: 0,
				modeOfWork:
					draft === SubmitType.SAVE_AS_DRAFT
						? _isNull(watch('workingMode'))
							? null
							: watch('workingMode')?.value
						: _isNull(d.workingMode)
						? null
						: d.workingMode?.value,
				dpPercentage: isHRDirectPlacement
					? draft === SubmitType.SAVE_AS_DRAFT
						? _isNull(watch('dpPercentage'))
							? 0
							: parseFloat(watch('dpPercentage'))
						: _isNull(d.dpPercentage)
						? 0
						: parseFloat(d.dpPercentage)
					: 0,
				address:
					draft === SubmitType.SAVE_AS_DRAFT
						? _isNull(watch('address'))
							? null
							: watch('address')
						: _isNull(d.address)
						? null
						: d.address,
				city:
					draft === SubmitType.SAVE_AS_DRAFT
						? _isNull(watch('city'))
							? null
							: watch('city')
						: _isNull(d.city)
						? null
						: d.city,
				state:
					draft === SubmitType.SAVE_AS_DRAFT
						? _isNull(watch('state'))
							? null
							: watch('state')
						: _isNull(d.state)
						? null
						: d.state,
				country:
					draft === SubmitType.SAVE_AS_DRAFT
						? _isNull(watch('country'))
							? '0'
							: watch('country')?.id?.toString()
						: _isNull(d.country)
						? '0'
						: d?.country?.id?.toString(),
				postalCode:
					draft === SubmitType.SAVE_AS_DRAFT
						? _isNull(watch('postalCode'))
							? null
							: watch('postalCode')
						: _isNull(d.postalCode)
						? null
						: d.postalCode,
			},
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

	getAcceptTR(IsAccepted, loggedInUserTypeID, setAcceptHRModal, acceptHRModal) {
		if (
			loggedInUserTypeID === UserAccountRole.TALENTOPS ||
			loggedInUserTypeID === UserAccountRole.OPS_TEAM_MANAGER ||
			loggedInUserTypeID === UserAccountRole.ADMINISTRATOR ||
			loggedInUserTypeID === UserAccountRole.DEVELOPER
		) {
			if (
				// HiringRequestHRStatus.DRAFT ||
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
							onClickHandler={() => setAcceptHRModal(true)}
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
				// HiringRequestHRStatus.DRAFT ||
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

	handleScheduleInterview(item, miscData, HRStatusCode) {
		if (
			HRStatusCode !== HiringRequestHRStatus.ON_HOLD &&
			item?.TalentStatusID_BasedOnHR === 2 &&
			item?.InterViewStatusId === 0 &&
			(item?.Status !== 'Cancelled' || item?.Status !== 'Rejected')
		) {
			return true;
		}
		return false;
	},
	handleRescheduleInterview(item, HRStatusCode) {
		if (
			HRStatusCode !== HiringRequestHRStatus.ON_HOLD &&
			(item?.Status !== 'Cancelled' || item?.Status !== 'Rejected') &&
			(item?.InterviewStatus !== '' ||
				item?.InterviewStatus !== 'Interview in Process' ||
				item?.InterviewStatus !== 'Interview Completed' ||
				item?.InterviewStatus !== 'Feedback Submitted' ||
				item?.InterviewStatus !== 'Cancelled')
		) {
			return true;
		}
		return false;
	},
	showOnboardStatus(item, miscData, HRStatusCode) {
		if (
			HRStatusCode !== HiringRequestHRStatus.ON_HOLD &&
			item?.TalentStatusID_BasedOnHR === 2 &&
			item?.InterViewStatusId === 0 &&
			(item?.Status !== 'Cancelled' || item?.Status !== 'Rejected')
		) {
			if (
				miscData?.LoggedInUserTypeID !== UserAccountRole.TALENTOPS ||
				miscData?.loggedInUserTypeID !== UserAccountRole.OPS_TEAM_MANAGER
			) {
				return [
					{
						label: 'Schedule Interview',
						key: TalentOnboardStatus.SCHEDULE_INTERVIEW,
					},

					{
						label: 'Talent Status',
						key: TalentOnboardStatus.TALENT_STATUS,
					},
					{
						label: 'Update kickoff & Onboard Status',
						key: TalentOnboardStatus.UPDATE_KICKOFF,
					},
				];
			} else return [];
		} else if (
			HRStatusCode !== HiringRequestHRStatus.ON_HOLD &&
			(item?.Status !== 'Cancelled' || item?.Status !== 'Rejected') &&
			(item?.InterviewStatus !== '' ||
				item?.InterviewStatus !== 'Interview in Process' ||
				item?.InterviewStatus !== 'Interview Completed' ||
				item?.InterviewStatus !== 'Feedback Submitted' ||
				item?.InterviewStatus !== 'Cancelled')
		) {
			return [
				{
					label: 'Reschedule Interview',
					key: TalentOnboardStatus.RESCHEDULE_INTERVIEW,
				},
				{
					label: 'Talent Status',
					key: TalentOnboardStatus.TALENT_STATUS,
				},
				{
					label: 'Update kickoff & Onboard Status',
					key: TalentOnboardStatus.UPDATE_KICKOFF,
				},
			];
		} else {
			return [
				{
					label: 'Schedule Interview',
					key: TalentOnboardStatus.SCHEDULE_INTERVIEW,
				},
				{
					label: 'Reschedule Interview',
					key: TalentOnboardStatus.RESCHEDULE_INTERVIEW,
				},
				{
					label: 'Talent Status',
					key: TalentOnboardStatus.TALENT_STATUS,
				},
				{
					label: 'Update kickoff & Onboard Status',
					key: TalentOnboardStatus.UPDATE_KICKOFF,
				},
			];
		}
	},
	showTalentCTA(item) {
		let tempArray = [];
		item?.cTAInfoList?.map((item) =>
			tempArray.push({
				key: item?.label,
				label: item?.label,
				IsEnabled: item?.IsEnabled,
			}),
		);

		return tempArray;
	},
	handleTalentStatus(item, HRStatusCode) {
		if (
			HRStatusCode !== HiringRequestHRStatus.ON_HOLD &&
			(item?.InterviewStatus !== 'Rejected' ||
				item?.InterviewStatus !== 'Replacement' ||
				item?.InterviewStatus !== 'Hired' ||
				item?.InterviewStatus !== 'Cancelled')
		) {
			return true;
		}
		return false;
	},
	handleTalentAcceptance() {},
	handlerUpdateKickOff(item, miscData, HRStatusCode) {
		if (
			miscData?.LoggedInUserTypeID === UserAccountRole.TALENTOPS ||
			miscData?.loggedInUserTypeID === UserAccountRole.OPS_TEAM_MANAGER ||
			miscData?.LoggedInUserTypeID === UserAccountRole.DEVELOPER ||
			miscData?.loggedInUserTypeID === UserAccountRole.ADMINISTRATOR
		)
			return false;
		else {
			if (
				HRStatusCode !== HiringRequestHRStatus.ON_HOLD &&
				item?.TalentStatusID_BasedOnHR === 2 &&
				item?.InterViewStatusId === 0
			) {
				return true;
			}
		}
	},
	handleAdHOC(adHOCValue) {
		if (_isNull(adHOCValue) || adHOCValue === AdHOCHR.POOL) {
			return [
				{
					label: 'Pass to ODR',
					key: 'Pass to ODR',
					IsEnabled: true,
				},
				{
					label: 'Keep it with me as well',
					key: 'Keep it with me as well',
					IsEnabled: true,
				},
			];
		} else if (adHOCValue === AdHOCHR.ODR) {
			return [
				{
					label: 'Pass to Pool',
					key: 'Pass to Pool',
				},
				{
					label: 'Keep it with me as well',
					key: 'Keep it with me as well',
				},
			];
		} else if (adHOCValue === AdHOCHR.BOTH) {
			return [
				{
					label: 'Pass to Pool',
					key: 'Pass to Pool',
				},
				{
					label: 'Pass to ODR',
					key: 'Pass to ODR',
				},
			];
		}
	},
	showNextAction(apiData, acceptHRModal, setAcceptHRModal) {
		if (apiData?.FetchMissingAction?.NextActionID) {
			return (
				<HROperator
					title="Accept HR"
					icon={<ArrowDownSVG style={{ width: '16px' }} />}
					backgroundColor={`var(--color-sunlight)`}
					iconBorder={`1px solid var(--color-sunlight)`}
					onClickHandler={() => setAcceptHRModal(true)}
				/>
			);
		}
	},
	formatInterviewSlots: (data) => {
		return data?.map((item) => ({
			label: item?.StrDateTime,
			key: item?.StrDateTime,
		}));
	},
	formatInteviewTime: (data) => {
		return data?.map((item, index) => ({
			label: item?.StartTime + ' - ' + item?.EndTime,
			key: item?.StrDateTime + index,
		}));
	},

	dynamicCTAsSlot1: (item) => {},
	dynamicCTAsSlot2: (item) => {},
};
