import { SubmitType, hiringRequestPriority } from 'constants/application';
import { _isNull } from 'shared/utils/basic_utils';

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
	hrFormDataFormatter(d, draft, watch) {
		const hrFormDetails = {
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
						? null
						: watch('NRMargin')
					: _isNull(d.NRMargin)
					? null
					: d.NRMargin,
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
			availability:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('availability'))
						? null
						: watch('availability')
					: _isNull(d.availability)
					? null
					: d.availability,
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
						: watch('talentsNumber')
					: _isNull(d.talentsNumber)
					? 0
					: d.talentsNumber,
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
};
