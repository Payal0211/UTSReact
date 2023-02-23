import { _isNull } from 'shared/utils/basic_utils';

export const userUtils = {
	dateFormatter: (date) => {
		if (_isNull(date)) {
			return 'NA';
		} else {
			return date.split(' ')[0];
		}
	},
	userListSearch: (e, apiData) => {
		let filteredData = apiData?.filter((val) => {
			return (
				(val?.employeeID &&
					val?.employeeID
						.toLowerCase()
						.includes(e.target.value.toLowerCase())) ||
				(val?.fullName &&
					val?.fullName.toLowerCase().includes(e.target.value.toLowerCase())) ||
				(val?.userType &&
					val?.userType.toLowerCase().includes(e.target.value.toLowerCase())) ||
				(val?.nbD_AM &&
					val?.nbD_AM.toLowerCase().includes(e.target.value.toLowerCase())) ||
				(val?.teamManager &&
					val?.teamManager
						.toLowerCase()
						.includes(e.target.value.toLowerCase())) ||
				(val?.emailID &&
					val?.emailID.toLowerCase().includes(e.target.value.toLowerCase())) ||
				(val?.skypeID &&
					val?.skypeID.toLowerCase().includes(e.target.value.toLowerCase())) ||
				(val?.contactNumber &&
					val?.contactNumber
						.toLowerCase()
						.includes(e.target.value.toLowerCase()))
			);
		});

		return filteredData;
	},
};
