import { hiringRequestPriority } from 'constants/application';
import { ReactComponent as NoPriorityStar } from 'assets/svg/noPriorityStar.svg';
import { ReactComponent as CurrentWeekPriorityStar } from 'assets/svg/currentWeekPriorityStar.svg';
import { ReactComponent as NextWeekPriorityStar } from 'assets/svg/nextWeekPriorityStar.svg';
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
};
