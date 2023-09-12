export const engagementUtils = {
	modifyEngagementListData: (response) => {
		return response?.responseBody?.rows.map((item) => ({
			clientFeedback: item?.clientFeedback,
			lastFeedbackDate: item?.lastFeedbackDate
				? item?.lastFeedbackDate?.split(' ')[0]
				: '',
			onBoardingForm: item?.onBoardingForm,
			engagementId_HRID: item?.engagementId_HRID,
			talentName: item?.talentName,
			company: item?.company,
			// tscName:item?.tscName,
			// deployedSource:item?.deployedSource,
			// currentStatus: item?.currentStatus,
			// clientLegal_StatusID: item?.clientLegal_StatusID,
			onboardID: item?.onBoardID,
			talentID: item?.talentID,
			// contractEndDate: item?.contractEndDate,
			activeEngagement: item?.activeEngagement,
			feedbcakReceive: item?.feedbcakReceive,
			avgDP: item?.avgDP,
			avgNR: item?.avgNR,
			feedbackType: item?.feedbackType,
			hrNumber: item?.hrNumber,
			engagementID: item?.engagementId_HRID.split(' /')[0],
			hrID: item?.hR_ID,
			s_TotalDP: item?.s_TotalDP,
			clientName: item?.clientName ? item?.clientName : '',
			engagementCount: item?.engagementCount ,
			deployedSource: item?.deployedSource ? item?.deployedSource : '',
			tscName: item?.tscName ? item?.tscName : '',
			geo: item?.geo ? item?.geo : '',
			position: item?.position ? item?.position : '',
			isLost: item?.isLost === 0 ? 'No' : 'Yes',
			oldTalent: item?.oldTalent ? item?.oldTalent : '',
			replacementEng: item?.replacementEng ? item?.replacementEng : '',
			noticePeriod: item?.noticePeriod ? item?.noticePeriod + ' Months' : '',
			kickOff: item?.kickOff
				? item?.kickOffStatus + ' - ' + item?.kickOff
				: '',
			billRate: item?.billRate ? item?.billRate : '',
			actualBillRate: item?.actualBillRate
				? item?.actualBillRate + ' ' + item?.billRateCurrency
				: '',
			payRate: item?.payRate ? item?.payRate : '',
			actualPayRate: item?.actualPayRate
				? item?.actualPayRate + ' ' + item?.payRateCurrency
				: '',
			contractStartDate: item?.contractStartDate
				? item?.contractStartDate
				: '',
			contractEndDate: item?.contractEndDate ? item?.contractEndDate : '',
			dpAmount: item?.dpAmount
				? item?.dpAmount + ' ' + item?.payRateCurrency
				: '',
			actualEndDate: item?.actualEndDate ? item?.actualEndDate : '',
			nr: item?.nr ? item?.nr : '',
			actualNR: item?.actualNR ? item?.actualNR + ' ' + item?.payRateCurrency  : '',
			dP_Percentage: item?.dP_Percentage ? item?.dP_Percentage : '',
			renewalstartDate: item?.renewalstartDate ? item?.renewalstartDate : '',
			renewalendDate: item?.renewalendDate ? item?.renewalendDate : '',
			engagementTenure: item?.engagementTenure ? item?.engagementTenure : '',
			sowSignedDate: item?.sowSignedDate ? item?.sowSignedDate : '',
			nbdName: item?.nbdName ? item?.nbdName : '',
			amName: item?.amName ? item?.amName : '',
			invoiceSentDate: item?.invoiceSentDate ? item?.invoiceSentDate : '',
			invoiceNumber: item?.invoiceNumber ? item?.invoiceNumber : '',
			invoiceStatus: item?.invoiceStatus ? item?.invoiceStatus : '',
			dateofPayment: item?.dateofPayment ? item?.dateofPayment : '',
			createdByDatetime: item?.createdByDatetime
				? item?.createdByDatetime
				: '',
			typeOfHR: item?.typeOfHR ? item?.typeOfHR : '',
			h_Availability: item?.h_Availability ? item?.h_Availability : '',
			talentLegal_StatusID: item?.talentLegal_StatusID,
			clientLegal_StatusID: item?.clientLegal_StatusID,
			isContractCompleted: item?.isContractCompleted,
			isHRManaged: item?.isHRManaged,
			currentStatus: item?.currentStatus,
			// isContractCompleted: item?.isContractCompleted,
			isRenewalAvailable: item?.isRenewalAvailable,
		}));
	},
	getClientFeedbackColor: (color) => {
		switch (color) {
			case '0': {
				return '#006699';
				break;
			}
			case 'Green': {
				return '#006D2C';
				break;
			}
			case 'Red': {
				return '#C80000';
				break;
			}
			case 'Orange': {
				return '#FD7021';
				break;
			}
			default:
				break;
		}
	},
	modifyEngagementFeedbackData: (response) => {
		return response?.responseBody?.details?.rows.map((item) => ({
			engagemenID: item?.engagemenID,
			feedbackActionToTake: item?.feedbackActionToTake,
			feedbackComment: item?.feedbackComment,
			feedbackCreatedDateTime: item?.feedbackCreatedDateTime
				? item?.feedbackCreatedDateTime?.split(' ')[0]
				: '',
			feedbackType: item?.feedbackType,
		}));
	},

	engagementListSearch: (e, apiData) => {
		let filteredData = apiData?.filter((val) => {
			return (
				(val?.lastFeedbackDate &&
					val?.lastFeedbackDate
						.toLowerCase()
						.includes(e.target.value.toLowerCase())) ||
				(val?.engagementId_HRID &&
					val?.engagementId_HRID
						.toLowerCase()
						.includes(e.target.value.toLowerCase())) ||
				(val?.talentName &&
					val?.talentName
						.toLowerCase()
						.includes(e.target.value.toLowerCase())) ||
				(val?.currentStatus &&
					val?.currentStatus
						.toLowerCase()
						.includes(e.target.value.toLowerCase())) ||
				(val?.clientName &&
					val?.clientName
						.toLowerCase()
						.includes(e.target.value.toLowerCase())) ||
				(val?.company &&
					val?.company.toLowerCase().includes(e.target.value.toLowerCase()))
			);
		});

		return filteredData;
	},
};
