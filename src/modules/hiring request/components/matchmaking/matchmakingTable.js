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
						key={user.key}
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

		if (expandedRows.includes(user.key)) {
			iconObj[columnValue] = <ArrowDownSVG style={{ marginLeft: '8px' }} />;
			iconObj['showAll'] = <ArrowDownSVG style={{ marginLeft: '8px' }} />;
			obj[columnValue] = true;
		}
		return [obj, iconObj];
	}, [user.key, currentExpandedCell, expandedRows]);

	return (
		<>
			<tr
				key={user.key}
				className={
					expandedRows.includes(user.key) &&
					MatchMakingStyle.isSelectedBackground
				}>
				<td
					className={MatchMakingStyle.td}
					onClick={(e) => {
						return handleExpandRow(
							e,
							user.key,
							`talentCost_${user.key}`,
							'talentCost',
							user.talentCost,
						);
					}}>
					{expandedIconMemo.showAll}
				</td>
				<td className={MatchMakingStyle.td}>
					<Checkbox
						id={user.key}
						checked={selectedRows.includes(user.key)}
						onClick={() => toggleRowSelection(user.key)}
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
					className={MatchMakingStyle.td}
					id={`talentCost_${user.key}`}
					onClick={(e) => {
						handleExpandRow(
							e,
							user.key,
							`talentCost_${user.key}`,
							'talentCost',
							user.talentCost,
						);
					}}>
					{user.talentCost}
					{expandedIconMemo.talentCost}
				</td>
				<td
					className={`${MatchMakingStyle.td} ${MatchMakingStyle.ellipsis} ${MatchMakingStyle.maxWidth134}`}>
					<Tooltip
						placement="bottom"
						title={user.role}>
						{user.role}
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
					{All_Hiring_Request_Utils.GETHRSTATUS(105, 'Completed')}
				</td>
				<td
					className={MatchMakingStyle.td}
					id={`techScore_${user.key}`}
					onClick={(e) => {
						return handleExpandRow(
							e,
							user.key,
							`techScore_${user.key}`,
							'techScore',
							user.techScore,
						);
					}}>
					{user.techScore}
					{expandedIconMemo.techScore}
				</td>
				<td
					className={MatchMakingStyle.td}
					id={`versantScore_${user.key}`}
					onClick={(e) => {
						return handleExpandRow(
							e,
							user.key,
							`versantScore_${user.key}`,
							'versantScore',
							user.versantScore,
						);
					}}>
					{user.versantScore}
					{expandedIconMemo.versantScore}
				</td>
				<td
					className={`${MatchMakingStyle.td}`}
					id={`profileLog_${user.key}`}
					onClick={(e) => {
						return handleExpandRow(
							e,
							user.key,
							`profileLog_${user.key}`,
							'profileLog',
							user.profileLog,
						);
					}}>
					View
					{expandedIconMemo.profileLog}
				</td>
			</tr>
			<>
				{expandedRows.includes(user.key) ? (
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
