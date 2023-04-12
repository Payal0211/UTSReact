export const engagementUtils = {
	modifyEngagementListData: (response) => {
		return response?.responseBody?.rows.map((item) => ({
			clientFeedback: item?.clientFeedback,
			lastFeedbackDate: item?.lastFeedbackDate
				? item?.lastFeedbackDate?.split(' ')[0]
				: 'NA',
			onBoardingForm: item?.onBoardingForm,
			engagementId_HRID: item?.engagementId_HRID,
			talentName: item?.talentName,
			company: item?.company,
			currentStatus: item?.currentStatus,
			clientLegal_StatusID: item?.clientLegal_StatusID,
			onboardID: item?.onBoardID,
			talentID: item?.talentID,
			contractEndDate: item?.contractEndDate,
			activeEngagement: item?.activeEngagement,
			feedbcakReceive: item?.feedbcakReceive,
			avgDP: item?.avgDP,
			avgNR: item?.avgNR,
			feedbackType: item?.feedbackType,
			hrNumber: item?.hrNumber,
			engagementID: item?.engagementId_HRID.split(' /')[0],
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
};
