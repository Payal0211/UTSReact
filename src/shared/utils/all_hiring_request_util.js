import {
	DayName,
	HiringRequestHRStatus,
	hiringRequestPriority,
	TalentRequestStatus,
} from 'constants/application';
import { ReactComponent as NoPriorityStar } from 'assets/svg/noPriorityStar.svg';
import { ReactComponent as CurrentWeekPriorityStar } from 'assets/svg/currentWeekPriorityStar.svg';
import { ReactComponent as NextWeekPriorityStar } from 'assets/svg/nextWeekPriorityStar.svg';
import HRStatusComponent from 'modules/hiring request/components/hrStatus/hrStatusComponent';
import { Tooltip } from 'antd';
import { DateTimeUtils } from './basic_utils';

export const All_Hiring_Request_Utils = {
	GETHRPRIORITY: function (statusCode, person, hrID, togglePriority) {
		switch (statusCode) {
			case hiringRequestPriority.NO_PRIORITY:
				return (
					<Tooltip
						placement="bottom"
						title="No Priority"
						color={`var(--uplers-black)`}>
						<NoPriorityStar
							onClick={
								DateTimeUtils.getTodaysDay() === DayName.FRIDAY
									? null
									: () => {
											let priorityObject = {
												isNextWeekStarMarked: '1',
												hRID: hrID,
												person: person,
											};
											togglePriority(priorityObject);
									  }
							}
						/>
					</Tooltip>
				);
			case hiringRequestPriority.CURRENT_WEEK_PRIORITY:
				return (
					<Tooltip
						placement="bottom"
						title="Current Week Priority"
						color={`var(--success-color)`}>
						<CurrentWeekPriorityStar />
					</Tooltip>
				);
			case hiringRequestPriority.NEXT_WEEK_PRIORITY:
				return (
					<Tooltip
						placement="bottom"
						title="Next Week Priority"
						color={`var(--color-sunlight)`}>
						<NextWeekPriorityStar
							onClick={
								DateTimeUtils.getTodaysDay() === DayName.FRIDAY
									? null
									: () => {
											let priorityObject = {
												isNextWeekStarMarked: '0',
												hRID: hrID,
												person: person,
											};
											togglePriority(priorityObject);
									  }
							}
						/>
					</Tooltip>
				);
			default:
				break;
		}
	},
	GETHRSTATUS: function (statusCode, hrStatus) {
		switch (statusCode) {
			case HiringRequestHRStatus.DRAFT:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#EEEEEE'}
						color={'#4E5063'}
					/>
				);
			case HiringRequestHRStatus.HR_ACCEPTED:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#e4eae3'}
						color={'#799774'}
					/>
				);
			case HiringRequestHRStatus.ACCEPTANCE_PENDING:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#F2F4E6'}
						color={'#1E210D'}
					/>
				);
			case HiringRequestHRStatus.INFO_PENDING:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#fad1d2'}
						color={'#e41a1c'}
					/>
				);
			case HiringRequestHRStatus.ON_HOLD:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#EAD9C8'}
						color={'#CD7F32'}
					/>
				);
			case HiringRequestHRStatus.COMPLETED:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#B0D2AA'}
						color={'#006D2C'}
					/>
				);
			case HiringRequestHRStatus.IN_PROCESS:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#F7E3C4'}
						color={'#BC770E'}
					/>
				);
			case HiringRequestHRStatus.CANCELLED:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#F0E2E2'}
						color={'#810000'}
					/>
				);
			case HiringRequestHRStatus.LOST:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#F0E2E2'}
						color={'#810000'}
					/>
				);
			default:
				break;
		}
	},
	GETTALENTSTATUS: function (statusCode, talentStatus) {
		switch (statusCode) {
			case TalentRequestStatus.SELECTED:
				return (
					<HRStatusComponent
						title={talentStatus}
						backgroundColor={'#D4DBEC'}
						color={'#15317E'}
					/>
				);
			case TalentRequestStatus.SHORTLISTED:
				return (
					<HRStatusComponent
						title={talentStatus}
						backgroundColor={'#DFEBEB'}
						color={'#033E3E'}
					/>
				);
			case TalentRequestStatus.IN_INTERVIEW:
				return (
					<HRStatusComponent
						title={talentStatus}
						backgroundColor={'#E4D8EE'}
						color={'#6F2DA8'}
					/>
				);
			case TalentRequestStatus.HIRED:
				return (
					<HRStatusComponent
						title={talentStatus}
						backgroundColor={'#C4DACD'}
						color={'#006D2C'}
					/>
				);
			case TalentRequestStatus.CANCELLED:
				return (
					<HRStatusComponent
						title={talentStatus}
						backgroundColor={'#F0E2E2'}
						color={'#810000'}
					/>
				);
			case TalentRequestStatus.ON_HOLD:
				return (
					<HRStatusComponent
						title={talentStatus}
						backgroundColor={'#EAD9C8'}
						color={'#CD7F32'}
					/>
				);
			case TalentRequestStatus.REJECTED:
				return (
					<HRStatusComponent
						title={talentStatus}
						backgroundColor={'#FEDADA'}
						color={'#C80000'}
					/>
				);
			case TalentRequestStatus.REPLACEMENT:
				return (
					<HRStatusComponent
						title={talentStatus}
						backgroundColor={'#E6EDF4'}
						color={'#001C38'}
					/>
				);
			default:
				break;
		}
	},
};
