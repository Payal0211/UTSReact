import { SubmitType, hiringRequestPriority } from 'constants/application';

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
		console.log('--here--');
		const hrFormDetails = {
			isSaveasDraft: draft === SubmitType.SAVE_AS_DRAFT && true,
			clientName:
				draft === SubmitType.SAVE_AS_DRAFT ? watch('clientName') : d.clientName,
			companyName:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('companyName')
					: d.companyName,
			role: draft === SubmitType.SAVE_AS_DRAFT ? watch('role') : d.role,
			hrTitle:
				draft === SubmitType.SAVE_AS_DRAFT ? watch('hrTitle') : d.hrTitle,
			jdURL: draft === SubmitType.SAVE_AS_DRAFT ? watch('jdURL') : d.jdURL,
			budget: draft === SubmitType.SAVE_AS_DRAFT ? watch('budget') : d.budget,
			minimumBudget:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('minimumBudget')
					: d.minimumBudget,
			maximumBudget:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('maximumBudget')
					: d.maximumBudget,
			NRMargin:
				draft === SubmitType.SAVE_AS_DRAFT ? watch('NRMargin') : d.NRMargin,
			salesPerson:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('salesPerson')
					: d.salesPerson,
			contactDuration:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('contactDuration')
					: d.contactDuration,
			availability:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('availability')
					: d.availability,
			years: draft === SubmitType.SAVE_AS_DRAFT ? watch('years') : d.years,
			months: draft === SubmitType.SAVE_AS_DRAFT ? watch('months') : d.months,
			timeZone:
				draft === SubmitType.SAVE_AS_DRAFT ? watch('timeZone') : d.timeZone,
			talentsNumber:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('talentsNumber')
					: d.talentsNumber,
			dealID: draft === SubmitType.SAVE_AS_DRAFT ? watch('dealID') : d.dealID,
			bqFormLink:
				draft === SubmitType.SAVE_AS_DRAFT ? watch('bqFormLink') : d.bqFormLink,
			discoveryCallLink:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('discoveryCallLink')
					: d.discoveryCallLink,
			interviewerFullName:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('interviewerFullName')
					: d.interviewerFullName,
			interviewerEmail:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('interviewerEmail')
					: d.interviewerEmail,
			interviewerLinkedin:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('interviewerLinkedin')
					: d.interviewerLinkedin,
			interviewerDesignation:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('interviewerDesignation')
					: d.interviewerDesignation,
			secondaryInterviewer:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('secondaryInterviewer')
					: d.secondaryInterviewer,
		};
		return hrFormDetails;
	},
};
