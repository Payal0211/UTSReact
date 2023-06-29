import { _isNull } from 'shared/utils/basic_utils';

export const dealUtils = {
	dateFormatter: (date) => {
		if (_isNull(date)) {
			return 'NA';
		} else {
			const spaceFirstIndex = date.split(' ');
			return spaceFirstIndex[0];
		}
	},
	modifyDealRequestData: (dealData) => {
		return dealData?.rows.map((item) => ({
			key: item.hR_ID,
			deal_Id: item.deal_Id,
			dealID:item.dealID,
			lead_Type: item.lead_Type,
			dealDate: item.dealDate?.split(' ')[0],
			hR_ID: item.hR_ID,
			pipeline: item.pipeline,
			company: item.company,
			geo: item.geo,
			bdr: item.bdr,
			sales_Consultant: item.sales_Consultant,
			dealStage: item.dealStage,
			dealStageColorCode: item.dealStageColorCode,
		}));
	},
	dealFilterSearch: (e, data) => {
		let filteredData = data.filter((val) => {
			return val.value.toLowerCase().includes(e.target.value.toLowerCase());
		});
		return filteredData;
	},
	dealListSearch: (e, apiData) => {
		let filteredData = apiData?.filter((val) => {
			return (
				(val?.deal_Id &&
					val?.deal_Id.toLowerCase().includes(e.target.value.toLowerCase())) ||
				val?.lead_Type.toLowerCase().includes(e.target.value.toLowerCase()) ||
				val?.bdr.toLowerCase().includes(e.target.value.toLowerCase()) ||
				val?.pipeline.toLowerCase().includes(e.target.value.toLowerCase()) ||
				val.company.toLowerCase().includes(e.target.value.toLowerCase()) ||
				val.geo.toLowerCase().includes(e.target.value.toLowerCase()) ||
				val.sales_Consultant
					.toLowerCase()
					.includes(e.target.value.toLowerCase()) ||
				val.dealStage.toLowerCase().includes(e.target.value.toLowerCase())
			);
		});

		return filteredData;
	},
};
