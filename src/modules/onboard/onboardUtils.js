import { SubmitType } from 'constants/application';
import { _isNull } from 'shared/utils/basic_utils';

export const onboardUtils = {
	onboardDataFormatter: (d, draft, watch, onboardID, teamMembers) => {
		const onboardFormDetails = {
			onboardID: _isNull(onboardID) ? 0 : onboardID,

			clientName:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('clientName'))
						? null
						: watch('clientName')
					: _isNull(d.clientName)
					? null
					: d.clientName,
			clientemail:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('clientEmail'))
						? null
						: watch('clientEmail')
					: _isNull(d.clientEmail)
					? null
					: d.clientEmail,
			companyName:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('companyName'))
						? null
						: watch('companyName')
					: _isNull(d.companyName)
					? null
					: d.companyName,
			talentName:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('talentFullName'))
						? null
						: watch('talentFullName')
					: _isNull(d.talentFullName)
					? null
					: d.talentFullName,
			engagemenID:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('engagementID'))
						? null
						: watch('engagementID')
					: _isNull(d.engagementID)
					? null
					: d.engagementID,
			hiringRequestNumber:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('hiringID'))
						? null
						: watch('hiringID')
					: _isNull(d.hiringID)
					? null
					: d.hiringID,
			contractType:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('contractType'))
						? null
						: watch('contractType')?.value
					: _isNull(d.contractType)
					? null
					: d.contractType?.value,
			contractDuration:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('contractDuration'))
						? 0
						: watch('contractDuration')
					: _isNull(d.contractDuration.value)
					? 0
					: d.contractDuration.value,

			contractStartDate:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('contractStartDate'))
						? null
						: new Date(watch('contractStartDate'))
								.toLocaleDateString('en-US')
								.toString()
					: _isNull(d.contractStartDate)
					? null
					: new Date(d.contractStartDate)
							.toLocaleDateString('en-US')
							.toString(),
			contractEndDate:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('contractEndDate'))
						? null
						: new Date(watch('contractEndDate'))
								.toLocaleDateString('en-US')
								.toString()
					: _isNull(d.contractEndDate)
					? null
					: new Date(d.contractEndDate).toLocaleDateString('en-US').toString(),
			timezone_Preference_ID:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('timeZone'))
						? 0
						: watch('timeZone')?.id
					: _isNull(d.timeZone)
					? 0
					: d.timeZone?.id,
			punchStartTime:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('shiftStartTime'))
						? null
						: watch('shiftStartTime')
					: _isNull(d.shiftStartTime)
					? null
					: d.shiftStartTime,
			punchEndTime:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('shiftEndTime'))
						? null
						: watch('shiftEndTime')
					: _isNull(d.shiftEndTime)
					? null
					: d.shiftEndTime,
			talentOnBoardDate:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('talentOnboardingDate'))
						? null
						: new Date(watch('talentOnboardingDate'))
								.toLocaleDateString('en-US')
								.toString()
					: _isNull(d.talentOnboardingDate)
					? null
					: new Date(d.talentOnboardingDate)
							.toLocaleDateString('en-US')
							.toString(),
			talentOnBoardTime:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('talentOnboardingTime'))
						? null
						: watch('talentOnboardingTime')
					: _isNull(d.talentOnboardingTime)
					? null
					: d.talentOnboardingTime,
			phoneNumber:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('phoneNumber'))
						? null
						: watch('phoneNumber')
					: _isNull(d.phoneNumber)
					? null
					: d.phoneNumber,
			firstClientBillingDate:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('clientFirstBillingDate'))
						? null
						: new Date(watch('clientFirstBillingDate'))
								.toLocaleDateString('en-US')
								.toString()
					: _isNull(d.clientFirstBillingDate)
					? null
					: new Date(d.clientFirstBillingDate)
							.toLocaleDateString('en-US')
							.toString(),
			netPaymentDays:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('netPaymentDays'))
						? null
						: watch('netPaymentDays')?.id
					: _isNull(d.netPaymentDays)
					? null
					: d.netPaymentDays?.id,
			contractRenewalSlot:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('contractRenewal'))
						? null
						: parseInt(watch('contractRenewal'))
					: _isNull(d.contractRenewal)
					? null
					: parseInt(d.contractRenewal),
			expectationFromTalent_FirstWeek:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('firstWeek'))
						? null
						: watch('firstWeek')
					: _isNull(d.firstWeek)
					? null
					: d.firstWeek,
			expectationFromTalent_FirstMonth:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('firstMonth'))
						? null
						: watch('firstMonth')
					: _isNull(d.firstMonth)
					? null
					: d.firstMonth,
			additionalInformation:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('additionalInformation'))
						? null
						: watch('additionalInformation')
					: _isNull(d.additionalInformation)
					? null
					: d.additionalInformation,
			proceedWithClient_LeavePolicyOption:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('leavePolicies'))
						? null
						: watch('leavePolicies')
					: _isNull(d.leavePolicies)
					? null
					: d.leavePolicies,
			proceedWithUplers_ExitPolicyOption:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('exitPolicies'))
						? null
						: watch('exitPolicies')
					: _isNull(d.exitPolicies)
					? null
					: d.exitPolicies,
			client_Remark:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('specialFeedback'))
						? null
						: watch('specialFeedback')
					: _isNull(d.specialFeedback)
					? null
					: d.specialFeedback,
			teamMemebers: teamMembers,
		};
		return onboardFormDetails;
	},
};
