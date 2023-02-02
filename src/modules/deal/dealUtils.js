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
};
