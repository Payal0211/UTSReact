
export const clientHappinessSurveyConfig = {
	clientSurveyFilterTypeConfig: (filterList) => {
		return [
			{
				label: 'Feedback Status',
				name: 'feedbackStatus',
				child: [
					{
						disabled: false,
						group: null,
						selected: false,
						text: 'Feedback Pending',
						value: 'Feedback Pending',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: 'Completed',
						value: 'Completed',
					},
				],
				isSearch: false,
			},
            // {
			// 	label: 'Company',
			// 	name: 'company',
			// 	child: filterList?.Company,
			// 	isSearch: true,
			// },
            // {
			// 	label: 'Client',
			// 	name: 'client',
			// 	child: filterList?.Client,
			// 	isSearch: true,
			// },
            // {
			// 	label: 'Email',
			// 	name: 'email',
			// 	child: filterList?.email,
			// 	isSearch: true,
			// },
            // {
			// 	label: 'Rating',
			// 	name: 'rating',
			// 	child: [],
			// 	isSearch: false,
			// 	isNumber: true
			// },
            {
				label: 'Question',
				name: 'question',
				child: filterList?.question,
				isSearch: true,
			},
			
		];
	},
	
};
