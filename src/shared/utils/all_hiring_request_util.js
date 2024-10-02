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
	GETHRPRIORITY: function (statusCode, person, hrID, togglePriority,disabled) {
		switch (statusCode) {
			case hiringRequestPriority.NO_PRIORITY:
				return (
					// <Tooltip
					// 	placement="bottom"
					// 	title="No Priority"
					// 	color={`var(--uplers-black)`}>
						<a href="javascript:void(0);" style={{display: 'inline-flex'}} onClick={
							disabled === 'disabled'? null :	DateTimeUtils.getTodaysDay() === DayName.FRIDAY
									? null
									: () => {
											let priorityObject = {
												isNextWeekStarMarked: '1',
												hRID: hrID,
												person: person,
											};
											togglePriority(priorityObject);
									  }
							}><NoPriorityStar />
						</a>
					//  </Tooltip> 
				);
			case hiringRequestPriority.CURRENT_WEEK_PRIORITY:
				return (
					// <Tooltip
					// 	placement="bottom"
					// 	title="Current Week Priority"
					// 	color={`var(--success-color)`}>
						// <CurrentWeekPriorityStar />
						<NextWeekPriorityStar />
					// </Tooltip>
				);
			case hiringRequestPriority.NEXT_WEEK_PRIORITY:
				return (
					// <Tooltip
					// 	placement="bottom"
					// 	title="Next Week Priority"
					// 	color={`var(--color-sunlight)`}>
						<a href="javascript:void(0);" style={{display: 'inline-flex'}} onClick={
							disabled === 'disabled'? null :	DateTimeUtils.getTodaysDay() === DayName.FRIDAY
									? null
									: () => {
											let priorityObject = {
												isNextWeekStarMarked: '0',
												hRID: hrID,
												person: person,
											};
											togglePriority(priorityObject);
									  }
							}><NextWeekPriorityStar />
						</a>
					// </Tooltip>
				);
			default:
				break;
		}
	},
	GETHRSTATUS: function (statusCode, hrStatus) {
// 		ID    Title    StatusCode    BackGroundColor    TextColor    IsActive
// 1    Draft    101    #F0F0F0    #303030    1
// 2    Open    102    #E6F7DB    #17620A    1
// 3    Active    106    #E8F2FD    #0070E0    1
// 4    Closed - Won    105    #477A58    #D5F9E8    1
// 5    Closed - Cancelled    108    #984D42    #FAF1F1    1
// 6    Closed - Lost    109    #AC8C1B    #FAF8F1    1
// 7    Closed - Expired    103    #706F68    #F2F2F2    1
// 8    Active - but no longer accepting applicaitons    107    #F9E7DA    #B34C01    1
// 9    Active - Reposted    104    #E9F9F9    #044D49    1
// 10    Re-Open    110    #F8F2F7    #9B078D    1

switch (statusCode) {
	case HiringRequestHRStatus.DRAFT:
		return (
			<HRStatusComponent
				title={hrStatus}
				backgroundColor={'#F0F0F0 '}
				color={'#303030'}
			/>
		);
		case HiringRequestHRStatus.HR_ACCEPTED:
				return (
					<HRStatusComponent
						title={hrStatus}
						backgroundColor={'#E6F7DB'}
						color={'#17620A'}
					/>
				);
		case HiringRequestHRStatus.ACCEPTANCE_PENDING:
		return (
			<HRStatusComponent
				title={hrStatus}
				backgroundColor={'#706F68'}
				color={'#F2F2F2'}
			/>
		);
		case HiringRequestHRStatus.INFO_PENDING:
		return (
			<HRStatusComponent
				title={hrStatus}
				backgroundColor={'#E9F9F9'}
				color={'#044D49'}
			/>
		);
		case HiringRequestHRStatus.ON_HOLD:
			return (
				<HRStatusComponent
					title={hrStatus}
					backgroundColor={'#984D42'}
					color={'#FAF1F1'}
				/>
			);
		case HiringRequestHRStatus.COMPLETED:
		return (
			<HRStatusComponent
				title={hrStatus}
				backgroundColor={'#477A58'}
				color={'#D5F9E8'}
			/>
		);
		case HiringRequestHRStatus.IN_PROCESS:
		return (
			<HRStatusComponent
				title={hrStatus}
				backgroundColor={'#E8F2FD'}
				color={'#0070E0'}
			/>
		);
		case HiringRequestHRStatus.CANCELLED:
			return (
				<HRStatusComponent
					title={hrStatus}
					backgroundColor={'#F9E7DA'}
					color={'#B34C01'}
				/>
			);
		case HiringRequestHRStatus.LOST:
			return (
				<HRStatusComponent
					title={hrStatus}
					backgroundColor={'#AC8C1B'}
					color={'#FAF8F1'}
				/>
			);
		case HiringRequestHRStatus.REOPEN:
			return (
				<HRStatusComponent
					title={hrStatus}
					backgroundColor={'#F8F2F7'}
					color={'#9B078D'}
				/>
			);
	default:
		break;
}

		// switch (statusCode) {
		// 	case HiringRequestHRStatus.DRAFT:
		// 		return (
		// 			<HRStatusComponent
		// 				title={hrStatus}
		// 				backgroundColor={'#EEEEEE'}
		// 				color={'#4E5063'}
		// 			/>
		// 		);
		// 	case HiringRequestHRStatus.HR_ACCEPTED:
		// 		return (
		// 			<HRStatusComponent
		// 				title={hrStatus}
		// 				backgroundColor={'#e4eae3'}
		// 				color={'#799774'}
		// 			/>
		// 		);
		// 	case HiringRequestHRStatus.ACCEPTANCE_PENDING:
		// 		return (
		// 			<HRStatusComponent
		// 				title={hrStatus}
		// 				backgroundColor={'#F2F4E6'}
		// 				color={'#1E210D'}
		// 			/>
		// 		);
		// 	case HiringRequestHRStatus.INFO_PENDING:
		// 		return (
		// 			<HRStatusComponent
		// 				title={hrStatus}
		// 				backgroundColor={'#fad1d2'}
		// 				color={'#e41a1c'}
		// 			/>
		// 		);
		// 	case HiringRequestHRStatus.ON_HOLD:
		// 		return (
		// 			<HRStatusComponent
		// 				title={hrStatus}
		// 				backgroundColor={'#EAD9C8'}
		// 				color={'#CD7F32'}
		// 			/>
		// 		);
		// 	case HiringRequestHRStatus.COMPLETED:
		// 		return (
		// 			<HRStatusComponent
		// 				title={hrStatus}
		// 				backgroundColor={'#B0D2AA'}
		// 				color={'#006D2C'}
		// 			/>
		// 		);
		// 	case HiringRequestHRStatus.IN_PROCESS:
		// 		return (
		// 			<HRStatusComponent
		// 				title={hrStatus}
		// 				backgroundColor={'#F7E3C4'}
		// 				color={'#BC770E'}
		// 			/>
		// 		);
		// 	case HiringRequestHRStatus.CANCELLED:
		// 		return (
		// 			<HRStatusComponent
		// 				title={hrStatus}
		// 				backgroundColor={'#F0E2E2'}
		// 				color={'#810000'}
		// 			/>
		// 		);
		// 	case HiringRequestHRStatus.LOST:
		// 		return (
		// 			<HRStatusComponent
		// 				title={hrStatus}
		// 				backgroundColor={'#F0E2E2'}
		// 				color={'#810000'}
		// 			/>
		// 		);
		// 	default:
		// 		break;
		// }
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
