export const DealConfig = {
	dealFiltersListConfig: () => {
		return [
			{ name: 'Inbound' },
			{ name: 'Outbound' },
			{ name: 'USA' },
			{ name: 'Kirti Sharma' },
			{ name: 'No Show' },
		];
	},
	dealFilterTypeConfig: () => {
		return [
			{ name: 'Deal ID', child: ['ODR', 'Pool'], isSearch: false },
			{
				name: 'Lead Source',
				child: [
					'Outbound',
					'Inbound SEO',
					'Inbound DL',
					'Inbound CMS',
					'Inbound LI',
					'Inbound Direct',
					'Inbound ABM',
				],
				isSearch: false,
			},
			{
				name: 'Pipeline',
				child: ['3', '4', '7', '9', '10'],
				isSearch: false,
			},
			{ name: 'Company', child: [], isSearch: true },
			{ name: 'Geo', child: ['UK', 'USA', 'AU'], isSearch: true },
			{ name: 'BDR', child: ['FTE', 'PTE'], isSearch: false },
			{ name: 'Sales Consultant', child: [], isSearch: true },
			{ name: 'Deal Stage', child: [], isSearch: true },
			{
				name: 'HR Status',
				child: [
					/* {
						statusCode: HiringRequestHRStatus.DRAFT,
						label: 'Draft',
					}, */
				],
				isSearch: false,
			},
		];
	},
};
