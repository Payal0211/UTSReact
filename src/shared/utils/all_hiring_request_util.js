import {
	hiringRequestHRStatus,
	hiringRequestPriority,
} from 'constants/application';
import { ReactComponent as NoPriorityStar } from 'assets/svg/noPriorityStar.svg';
import { ReactComponent as CurrentWeekPriorityStar } from 'assets/svg/currentWeekPriorityStar.svg';
import { ReactComponent as NextWeekPriorityStar } from 'assets/svg/nextWeekPriorityStar.svg';
import HRStatusComponent from 'modules/hiring request/components/hrStatus/hrStatusComponent';

export const All_Hiring_Request_Utils = {
	GETHRPRIORITY: function (statusCode) {
		switch (statusCode) {
			case hiringRequestPriority.NO_PRIORITY:
				return <NoPriorityStar />;
			case hiringRequestPriority.CURRENT_WEEK_PRIORITY:
				return <CurrentWeekPriorityStar />;
			case hiringRequestPriority.NEXT_WEEK_PRIORITY:
				return <NextWeekPriorityStar />;
			default:
				break;
		}
	},
	GETHRSTATUS: function (statusCode, hrStatus) {
		switch (statusCode) {
			case hiringRequestHRStatus.PROFILE_SHARED:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#e4dcf5'}
						color={'#784fcd'}
					/>
				);
			case hiringRequestHRStatus.INFO_PENDING:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#fad1d2'}
						color={'#e41a1c'}
					/>
				);
			case hiringRequestHRStatus.HR_ACCEPTED:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#e4eae3'}
						color={'#799774'}
					/>
				);
			case hiringRequestHRStatus.HR_SUBMITTED:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#f1dfd7'}
						color={'#b76038'}
					/>
				);
			case hiringRequestHRStatus.HIRED:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#cce2d5'}
						color={'#006d2c'}
					/>
				);
			case hiringRequestHRStatus.IN_PROCESS:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#ffebcc'}
						color={'#bc770e'}
					/>
				);
			default:
				break;
		}
	},
};
