import { HRInterviewStatus } from 'constants/application';
import HRStatusComponent from 'modules/hiring request/components/hrStatus/hrStatusComponent';
import { _isNull } from 'shared/utils/basic_utils';

export const interviewUtils = {
	dateFormatter: (date) => {
		if (_isNull(date)) {
			return 'NA';
		} else {
			const spaceFirstIndex = date.indexOf(' ');
			const datePart = date.substring(0, spaceFirstIndex);
			let timePart = date.substring(spaceFirstIndex, date.length);
			timePart = timePart.split('To');
			return datePart + ' | ' + timePart[0] + ' - ' + timePart[1];
		}
	},
	GETINTERVIEWSTATUS: function (interviewStatus, interviewStatusCode) {
		switch (interviewStatusCode) {
			case HRInterviewStatus.SLOT_GIVEN:
				return (
					<HRStatusComponent
						title={interviewStatus}
						backgroundColor={'#EEFCEE'}
						color={'#287016'}
					/>
				);
			case HRInterviewStatus.CANCELLED:
				return (
					<HRStatusComponent
						title={interviewStatus}
						backgroundColor={'#FFEAD6'}
						color={'#991717'}
					/>
				);
			case HRInterviewStatus.INTERVIEW_SCHEDULED:
				return (
					<HRStatusComponent
						title={interviewStatus}
						backgroundColor={'#E5F9FF'}
						color={'#405CC0'}
					/>
				);
			case HRInterviewStatus.INTERVIEW_IN_PROCESS:
				return (
					<HRStatusComponent
						title={interviewStatus}
						backgroundColor={'#E5FFF3'}
						color={'#0B3A24'}
					/>
				);
			case HRInterviewStatus.INTERVIEW_COMPLETED:
				return (
					<HRStatusComponent
						title={interviewStatus}
						backgroundColor={'#FBFFE5'}
						color={'#2C3506'}
					/>
				);
			case HRInterviewStatus.FEEDBACK_SUBMITTED:
				return (
					<HRStatusComponent
						title={interviewStatus}
						backgroundColor={'#EEFCEE'}
						color={'#287016'}
					/>
				);
			case HRInterviewStatus.INTERVIEW_RESCHEDULES:
				return (
					<HRStatusComponent
						title={interviewStatus}
						backgroundColor={'#EEFCEE'}
						color={'#287016'}
					/>
				);
			default:
				break;
		}
	},
	CLIENTSTATUS: function () {},
	interviewListSearch: function (e, apiData) {
		let filteredData = apiData?.filter((val) => {
			return val.hrid.toLowerCase().includes(e.target.value.toLowerCase());
		});

		return filteredData;
	},
};
