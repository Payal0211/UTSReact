import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import ProfileStyle from './profile.module.css';
import { useCallback, useState, useEffect } from 'react';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { ProfileLog } from 'constants/application';
import { Skeleton } from 'antd';
import { _isNull } from 'shared/utils/basic_utils';

export const ShowProfileLog = ({ talentID, handleClose }) => {
	const [profileLog, setProfileLog] = useState(null);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [logExpanded, setLogExpanded] = useState(null);
	const getTechScore = useCallback(async () => {
		const response = await hiringRequestDAO.getTalentProfileLogDAO(talentID);
		setProfileLog(response && response?.responseBody?.details);
	}, [talentID]);

	useEffect(() => {
		getTechScore();
	}, [getTechScore]);

	const profileData = [
		{
			id: 'profileShared',
			score: profileLog?.profileSharedCount,
			label: 'Profile Shared',
			activeColor: `var(--color-purple)`,
			typeID: ProfileLog.PROFILE_SHARED,
		},
		{
			id: 'feedback',
			score: profileLog?.feedbackCount,
			label: 'Feedback Received',
			activeColor: `var(--color-cyan)`,
			typeID: ProfileLog.FEEDBACK,
		},
		{
			id: 'rejected',
			score: profileLog?.rejectedCount,
			label: 'Rejected',
			activeColor: `var(--color-danger)`,
			typeID: ProfileLog.REJECTED,
		},
		{
			id: 'selected',
			score: profileLog?.selectedForCount,
			label: 'Selected For',
			activeColor: `var(--color-success)`,
			typeID: ProfileLog.SELECTED,
		},
	];

	const onProfileLogClickHandler = async (typeID, index) => {
		setLogExpanded([]);
		setActiveIndex(index);
		const profileObj = {
			talentID: talentID,
			typeID: typeID,
		};
		const response = await hiringRequestDAO.getTalentProfileSharedDetailDAO(
			profileObj,
		);
		setLogExpanded(response && response?.responseBody?.details);
	};
	/*--------- React DatePicker ---------------- */
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const onChange = (dates) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
	};
	return (
		<div className={ProfileStyle.profileContainer}>
			<div className={ProfileStyle.flexStart}>
				<div className={ProfileStyle.profileBody}>
					<>
						<div className={ProfileStyle.profileNameContainer}>
							<span className={ProfileStyle.label}>Name:</span>
							&nbsp;&nbsp;
							<span className={ProfileStyle.value}>
								{profileLog?.talentName}
							</span>
						</div>
						<div className={ProfileStyle.attemptsContainer}>
							<span className={ProfileStyle.label}>Role:</span>
							&nbsp;&nbsp;
							<span className={ProfileStyle.value}>
								{profileLog?.talentRole}
							</span>
						</div>
					</>
					<div className={ProfileStyle.calendarFilterSet}>
						<div className={ProfileStyle.label}>Date</div>
						<div className={ProfileStyle.calendarFilter}>
							<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
							<DatePicker
								style={{ backgroundColor: 'red' }}
								onKeyDown={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
								className={ProfileStyle.dateFilter}
								placeholderText="Start date - End date"
								selected={startDate}
								onChange={onChange}
								startDate={startDate}
								endDate={endDate}
								selectsRange
							/>
						</div>
					</div>
				</div>

				<CloseSVG
					onClick={handleClose}
					style={{ marginTop: '16px', marginRight: '16px' }}
				/>
			</div>
			<hr style={{ border: `1px solid var(--uplers-grey)`, margin: 0 }} />
			<div className={ProfileStyle.profileDataContainer}>
				{profileData?.map((item, index) => {
					return (
						<div
							style={{
								backgroundColor: index === activeIndex && '#F5F5F5',
								border:
									index === activeIndex &&
									`1px solid ${profileData[activeIndex]?.activeColor}`,
							}}
							onClick={() => onProfileLogClickHandler(item?.typeID, index)}
							key={item.id}
							className={ProfileStyle.profileSets}>
							<span className={ProfileStyle.scoreValue}>{item?.score}</span>
							&nbsp;
							{item?.label}
						</div>
					);
				})}
			</div>
			{activeIndex < 0 ? (
				<div className={ProfileStyle.stages}>
					Select the stages to view their HRs
				</div>
			) : (
				<>
					<ProfileLogTable
						logExpanded={logExpanded}
						borderColor={profileData[activeIndex]?.activeColor}
					/>
					<br />
				</>
			)}
		</div>
	);
};

const ProfileLogTable = ({ borderColor, logExpanded }) => {
	return (
		<div
			className={ProfileStyle.matchmakingTable}
			style={{ border: `1px solid ${borderColor}`, borderRadius: '8px' }}>
			<table className={ProfileStyle.table}>
				<thead>
					<tr>
						<th className={ProfileStyle.th}>No.</th>
						<th className={ProfileStyle.th}>HR ID</th>
						<th className={ProfileStyle.th}>Position</th>
						<th className={ProfileStyle.th}>Company</th>
						<th className={ProfileStyle.th}>Date</th>
					</tr>
				</thead>
				<tbody>
					{logExpanded === null ? (
						<Skeleton style={{ width: '100%' }} />
					) : _isNull(logExpanded) ? (
						<tr>
							<td colSpan={5}>No data found.</td>
						</tr>
					) : (
						logExpanded?.map((item, index) => {
							return (
								<tr>
									<td className={ProfileStyle.td}>HR {index + 1}</td>
									<td className={ProfileStyle.td}>{item?.hrid}</td>
									<td className={ProfileStyle.td}>{item?.position}</td>
									<td className={ProfileStyle.td}>{item?.company}</td>
									<td className={ProfileStyle.td}>{item?.sDate}</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
};
