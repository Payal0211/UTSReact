import { hiringRequestPriority } from 'constants/application';

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
};
