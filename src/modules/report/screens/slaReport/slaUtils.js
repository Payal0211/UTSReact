export const slaUtils = {
	slaListData: (response) => {
		// return response?.responseBody?.rows?.map((item) => ({
		// 	hR_NUmber: item?.hR_NUmber ?? "NA",
		// 	role: item?.role ?? "NA",
		// 	company: item?.company ?? "NA",
		// 	client: item?.client ?? "NA",
		// 	talentName: item?.talentName ?? "NA",
		// 	isAdHocHR: item?.isAdHocHR ?? "NA",
		// 	currentStage: item?.currentStage ?? "NA",
		// 	current_Action_date: item?.current_Action_date ?? "NA",
		// 	expected_Next_action_date: item?.expected_Next_action_date ?? "NA",
		// 	actual_Next_Action_date: item?.actual_Next_Action_date ?? "NA",
		// 	expected_SLA_day: item?.expected_SLA_day ?? "NA",
		// 	actual_SLA_day: item?.actual_SLA_day ?? "NA",
		// 	slA_diff: item?.slA_diff ?? "NA",
		// 	actionFilter: item?.actionFilter ?? "NA",
		// 	sales_Person: item?.sales_Person ?? "NA",
		// 	sales_Manager: item?.sales_Manager ?? "NA",
		// 	ops_Lead: item?.ops_Lead ?? "NA",
		// 	isWeekEndSkip: item?.isWeekEndSkip
		// }))
		return response?.responseBody?.rows?.map((item) => ({
			hR_NUmber: item?.hR_NUmber ,
			role: item?.role ,
			company: item?.company ,
			client: item?.client ,
			talentName: item?.talentName ,
			isAdHocHR: item?.isAdHocHR ,
			currentStage: item?.currentStage ,
			current_Action_date: item?.current_Action_date ,
			expected_Next_action_date: item?.expected_Next_action_date ,
			actual_Next_Action_date: item?.actual_Next_Action_date ,
			expected_SLA_day: item?.expected_SLA_day ,
			actual_SLA_day: item?.actual_SLA_day ,
			slA_diff: item?.slA_diff ,
			actionFilter: item?.actionFilter ,
			sales_Person: item?.sales_Person ,
			sales_Manager: item?.sales_Manager ,
			ops_Lead: item?.ops_Lead ,
			isWeekEndSkip: item?.isWeekEndSkip
		}))
	},

};
