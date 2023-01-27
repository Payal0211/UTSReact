import { InterviewStatus } from 'constants/application';
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
			case InterviewStatus.SLOT_GIVEN:
				return (
					<HRStatusComponent
						title={interviewStatus}
						backgroundColor={'#EEFCEE'}
						color={'#287016'}
					/>
				);
			case InterviewStatus.CANCELLED:
				return (
					<HRStatusComponent
						title={interviewStatus}
						backgroundColor={'#FFEAD6'}
						color={'#991717'}
					/>
				);
			case InterviewStatus.INTERVIEW_SCHEDULED:
				return (
					<HRStatusComponent
						title={interviewStatus}
						backgroundColor={'#E5F9FF'}
						color={'#405CC0'}
					/>
				);
			case InterviewStatus.INTERVIEW_IN_PROCESS:
				return (
					<HRStatusComponent
						title={interviewStatus}
						backgroundColor={'#E5FFF3'}
						color={'#0B3A24'}
					/>
				);
			case InterviewStatus.INTERVIEW_COMPLETED:
				return (
					<HRStatusComponent
						title={interviewStatus}
						backgroundColor={'#FBFFE5'}
						color={'#2C3506'}
					/>
				);
			case InterviewStatus.FEEDBACK_SUBMITTED:
				return (
					<HRStatusComponent
						title={interviewStatus}
						backgroundColor={'#EEFCEE'}
						color={'#287016'}
					/>
				);
			case InterviewStatus.INTERVIEW_RESCHEDULES:
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
