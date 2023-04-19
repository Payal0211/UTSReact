export const reportConfig = {
	demandFunnelTable: (demandTable) => {
		let tableHeader = Object?.keys(demandTable?.[0] || {});
		return tableHeader?.map((item) => {
			return { title: item, dataIndex: item, key: item, align: 'left' };
		});
	},
};
