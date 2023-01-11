import { Checkbox, Tooltip } from 'antd';
import MatchMakingStyle from './matchmaking.module.css';
import { useMemo } from 'react';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { ReactComponent as ArrowRightSVG } from 'assets/svg/arrowRightLight.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDownLight.svg';

const MatchMakingTable = ({
	matchMakingData,
	allSelected,
	toggleRowSelection,
	expandedRows,
	handleExpandRow,
	selectedRows,
	currentExpandedCell,
	componentToRender,
}) => {
	return (
		<table className={MatchMakingStyle.matchmakingTable}>
			<Thead
				allSelected={allSelected}
				toggleRowSelection={toggleRowSelection}
			/>
			<tbody>
				{matchMakingData.map((user) => (
					<TrAPIData
						key={user.id}
						user={user}
						expandedRows={expandedRows}
						toggleRowSelection={toggleRowSelection}
						handleExpandRow={handleExpandRow}
						selectedRows={selectedRows}
						currentExpandedCell={currentExpandedCell}
						componentToRender={componentToRender}
					/>
				))}
			</tbody>
		</table>
	);
};

export default MatchMakingTable;

const Thead = ({ allSelected, toggleRowSelection }) => {
	return (
		<thead className={MatchMakingStyle.thead}>
			<tr>
				<th className={MatchMakingStyle.th}></th>
				<th className={MatchMakingStyle.th}>
					<Checkbox
						id="selectAll"
						checked={allSelected}
						onClick={() => toggleRowSelection('selectAll')}
					/>
				</th>
				<th className={MatchMakingStyle.th}>Name</th>
				<th className={MatchMakingStyle.th}>Talent Cost</th>
				<th className={MatchMakingStyle.th}>Role</th>
				<th className={MatchMakingStyle.th}>Email ID</th>
				<th className={MatchMakingStyle.th}>Status</th>
				<th className={MatchMakingStyle.th}>Tech Score</th>
				<th className={MatchMakingStyle.th}>Versant Score</th>
				<th className={MatchMakingStyle.th}>Profile Log</th>
			</tr>
		</thead>
	);
};

const TrAPIData = ({
	key,
	user,
	expandedRows,
	toggleRowSelection,
	handleExpandRow,
	selectedRows,
	currentExpandedCell,
	componentToRender,
}) => {
	const [activeCellMemo, expandedIconMemo] = useMemo(() => {
		let iconObj = {
			talentCost: <ArrowRightSVG style={{ marginLeft: '8px' }} />,
			techScore: <ArrowRightSVG style={{ marginLeft: '8px' }} />,
			versantScore: <ArrowRightSVG style={{ marginLeft: '8px' }} />,
			profileLog: <ArrowRightSVG style={{ marginLeft: '8px' }} />,
			showAll: <ArrowRightSVG style={{ marginLeft: '8px' }} />,
		};
		let obj = {
			talentCost: false,
			techScore: false,
			versantScore: false,
			profileLog: false,
		};
		const columnValue = currentExpandedCell.split('_')[0];

		if (expandedRows.includes(user.id)) {
			iconObj[columnValue] = <ArrowDownSVG style={{ marginLeft: '8px' }} />;
			iconObj['showAll'] = <ArrowDownSVG style={{ marginLeft: '8px' }} />;
			obj[columnValue] = true;
		}
		return [obj, iconObj];
	}, [user.id, currentExpandedCell, expandedRows]);

	return (
		<>
			<tr
				key={key}
				className={
					expandedRows.includes(user.id) &&
					MatchMakingStyle.isSelectedBackground
				}>
				<td
					className={MatchMakingStyle.td}
					onClick={(e) => {
						return handleExpandRow(
							e,
							user.id,
							`talentCost_${user.id}`,
							'talentCost',
							user.talentCost,
						);
					}}>
					{expandedIconMemo.showAll}
				</td>
				<td className={MatchMakingStyle.td}>
					<Checkbox
						id={user.id}
						checked={selectedRows.includes(user.id)}
						onClick={() => toggleRowSelection(user.id)}
					/>
				</td>
				<td
					className={`${MatchMakingStyle.td} ${MatchMakingStyle.ellipsis}  ${MatchMakingStyle.maxWidth164}`}>
					<Tooltip
						placement="bottom"
						title={user.name}>
						{user.name}
					</Tooltip>
				</td>
				<td
					className={
						activeCellMemo.talentCost
							? `${MatchMakingStyle.selectedCell}`
							: `${MatchMakingStyle.td}`
					}
					id={`talentCost_${user.id}`}
					onClick={(e) => {
						handleExpandRow(
							e,
							user.id,
							`talentCost_${user.id}`,
							'talentCost',
							user.talentCost,
						);
					}}>
					<span style={{ fontWeight: 600 }}>
						{user.talentCost.split('.')[0]}
					</span>{' '}
					/ Month
					{expandedIconMemo.talentCost}
				</td>
				<td
					className={`${MatchMakingStyle.td} ${MatchMakingStyle.ellipsis} ${MatchMakingStyle.maxWidth134}`}>
					<Tooltip
						placement="bottom"
						title={user.talentRole}>
						{user.talentRole}
					</Tooltip>
				</td>
				<td
					className={`${MatchMakingStyle.td} ${MatchMakingStyle.ellipsis} ${MatchMakingStyle.maxWidth170}`}>
					<Tooltip
						placement="bottom"
						title={user.emailID}>
						{user.emailID}
					</Tooltip>
				</td>
				<td className={MatchMakingStyle.td}>
					{All_Hiring_Request_Utils.GETTALENTSTATUS(
						user.frontStatusID,
						user.talentStatus,
					)}
				</td>
				<td
					className={
						activeCellMemo.techScore
							? `${MatchMakingStyle.selectedCell}`
							: `${MatchMakingStyle.td}`
					}
					id={`techScore_${user.id}`}
					onClick={(e) => {
						return handleExpandRow(
							e,
							user.id,
							`techScore_${user.id}`,
							'techScore',
							user.techScore,
						);
					}}>
					{user.techScore}
					{expandedIconMemo.techScore}
				</td>
				<td
					className={
						activeCellMemo.versantScore
							? `${MatchMakingStyle.selectedCell}`
							: `${MatchMakingStyle.td}`
					}
					id={`versantScore_${user.id}`}
					onClick={(e) => {
						return handleExpandRow(
							e,
							user.id,
							`versantScore_${user.id}`,
							'versantScore',
							user.versantScore,
						);
					}}>
					{user.versantScore}
					{expandedIconMemo.versantScore}
				</td>
				<td
					className={
						activeCellMemo.profileLog
							? `${MatchMakingStyle.selectedCell}`
							: `${MatchMakingStyle.td}`
					}
					id={`profileLog_${user.id}`}
					onClick={(e) => {
						return handleExpandRow(
							e,
							user.id,
							`profileLog_${user.id}`,
							'profileLog',
							user.profileLog,
						);
					}}>
					View
					{expandedIconMemo.profileLog}
				</td>
			</tr>
			<>
				{expandedRows.includes(user.id) ? (
					<tr className={MatchMakingStyle.isSelectedBackground}>
						<td
							colSpan="12"
							className={MatchMakingStyle.td}>
							<div>{componentToRender}</div>
						</td>
					</tr>
				) : null}
			</>
		</>
	);
};
