import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import ProfileStyle from './profile.module.css';
import { useCallback, useState, useEffect } from 'react';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';

export const ShowProfileLog = ({ talentID, handleClose }) => {
	const [profileLog, setProfileLog] = useState(null);

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
		},
		{
			id: 'feedback',
			score: profileLog?.feedbackCount,
			label: 'Feedback Received',
			activeColor: `var(--color-cyan)`,
		},
		{
			id: 'rejected',
			score: profileLog?.rejectedCount,
			label: 'Rejected',
			activeColor: `var(--color-danger)`,
		},
		{
			id: 'selected',
			score: profileLog?.selectedForCount,
			label: 'Selected For',
			activeColor: `var(--color-success)`,
		},
	];
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
							<span className={ProfileStyle.label}>Total Attempts:</span>
							&nbsp;&nbsp;
							<span className={ProfileStyle.value}>04</span>
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
				{profileData?.map((item) => {
					return (
						<div
							key={item.id}
							className={ProfileStyle.profileSets}>
							<span className={ProfileStyle.scoreValue}>{item?.score}</span>
							&nbsp;
							{item?.label}
						</div>
					);
				})}
			</div>
			<div className={ProfileStyle.stages}>
				Select the stages to view their HRs
			</div>
		</div>
	);
};
