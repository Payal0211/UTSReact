export const slaUtils = {
	slaListData: (response) => {
		return response?.responseBody?.rows?.map((item) => ({
			hR_NUmber: item?.hR_NUmber ?? "NA",
			role: item?.role ?? "NA",
			company: item?.company ?? "NA",
			talentName: item?.talentName ?? "NA",
			isAdHocHR: item?.isAdHocHR ?? "NA",
			currentStage: item?.currentStage ?? "NA",
			current_Action_date: item?.current_Action_date ?? "NA",
			expected_Next_action_date: item?.expected_Next_action_date ?? "NA",
			actual_Next_Action_date: item?.actual_Next_Action_date ?? "NA",
			expected_SLA_day: item?.expected_SLA_day ?? "NA",
			actual_SLA_day: item?.actual_SLA_day ?? "NA",
			slA_diff: item?.slA_diff ?? "NA",
			actionFilter: item?.actionFilter ?? "NA",
			sales_Person: item?.sales_Person ?? "NA",
			sales_Manager: item?.sales_Manager ?? "NA",
			ops_Lead: item?.ops_Lead ?? "NA"
		}))
	},
	// getClientFeedbackColor: (color) => {
	// 	switch (color) {
	// 		case '0': {
	// 			return '#006699';
	// 			break;
	// 		}
	// 		case 'Green': {
	// 			return '#006D2C';
	// 			break;
	// 		}
	// 		case 'Red': {
	// 			return '#C80000';
	// 			break;
	// 		}
	// 		case 'Orange': {
	// 			return '#FD7021';
	// 			break;
	// 		}
	// 		default:
	// 			break;
	// 	}
	// },
	// modifyEngagementFeedbackData: (response) => {
	// 	return response?.responseBody?.details?.rows.map((item) => ({
	// 		engagemenID: item?.engagemenID,
	// 		feedbackActionToTake: item?.feedbackActionToTake,
	// 		feedbackComment: item?.feedbackComment,
	// 		feedbackCreatedDateTime: item?.feedbackCreatedDateTime ? item?.feedbackCreatedDateTime?.split(' ')[0] : 'NA',
	// 		feedbackType: item?.feedbackType,
	// 	}));
	// },

	// engagementListSearch: (e, apiData) => {
	// 	let filteredData = apiData?.filter((val) => {
	// 		return (
	// 			(val?.lastFeedbackDate &&
	// 				val?.lastFeedbackDate
	// 					.toLowerCase()
	// 					.includes(e.target.value.toLowerCase())) ||
	// 			(val?.engagementId_HRID &&
	// 				val?.engagementId_HRID.toLowerCase().includes(e.target.value.toLowerCase())) ||
	// 			(val?.talentName &&
	// 				val?.talentName.toLowerCase().includes(e.target.value.toLowerCase())) ||
	// 			(val?.currentStatus &&
	// 				val?.currentStatus.toLowerCase().includes(e.target.value.toLowerCase())) ||
	// 			(val?.clientName &&
	// 				val?.clientName.toLowerCase().includes(e.target.value.toLowerCase())) ||
	// 			(val?.company &&
	// 				val?.company.toLowerCase().includes(e.target.value.toLowerCase()))
	// 		);
	// 	});

	// 	return filteredData;
	// },
};
