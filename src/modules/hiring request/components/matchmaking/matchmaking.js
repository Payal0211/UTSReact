import { Button, Checkbox, Divider, Modal, Skeleton, Tooltip } from 'antd';
import axios from 'axios';
import { HiringRequestHRStatus, InputType } from 'constants/application';
import { useEffect, useState } from 'react';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import MatchMakingStyle from './matchmaking.module.css';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReactComponent as ArrowRightSVG } from 'assets/svg/arrowRightLight.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDownLight.svg';
import { ShowTechScore } from '../techScore/techScore';
import { ShowTalentCost } from '../talentCost/talentCost';
import { ShowVersantScore } from '../versantScore/versantScore';
import { ShowProfileLog } from '../profileLog/profileLog';

const MatchmakingModal = () => {
	const [isTechScoreActive, setIsTechScoreActive] = useState(false);
	const [isTalentCostActive, setIsTalentCostActive] = useState(false);
	const [isVersantScoreActive, setIsVersantScoreActive] = useState(false);
	const [isProfileLogActive, setIsProfileLogActive] = useState(false);
	const [matchmakingModal, setMatchmakingModal] = useState(false);
	const [matchmakingData, setMatchmakingData] = useState([]);
	/** State variable to keep track of all the expanded rows*/
	const [expandedRows, setExpandedRows] = useState(
		[],
	); /** By default Empty Array */
	/**  State variable to keep track which row is currently expanded. */
	const [expandState, setExpandState] = useState({});
	const [tableFunctionData, setTableFunctionData] = useState('');
	const [currentExpandedCell, setCurrentExpandedCell] = useState('');
	const [selectedRows, setSelectedRows] = useState([]);
	const [allSelected, setAllSelected] = useState(false);

	/**
	 * @Function handleExpandRow
	 * @param {*} event
	 * @param {*} userId
	 * @param {*} attributeID
	 * @param {*} key
	 * @purpose This function gets called when show/hide link is clicked.
	 */
	const handleEpandRow = (event, userId, attributeID, key) => {
		const currentExpandedRows = expandedRows;

		const isRowExpanded = currentExpandedRows.includes(userId);

		let obj = {};
		isRowExpanded ? (obj[userId] = false) : (obj[userId] = true);
		setExpandState(obj);

		// If the row is expanded, we are here to hide it. Hence remove
		// it from the state variable. Otherwise add to it.
		const splittedAttribute = attributeID.split('_')[0];
		const currentExpandedCellAttribute = currentExpandedCell.split('_')[0];

		let newExpandedRows;
		if (isRowExpanded && splittedAttribute === currentExpandedCellAttribute)
			newExpandedRows = [];
		else if (
			isRowExpanded &&
			splittedAttribute !== currentExpandedCellAttribute
		)
			newExpandedRows = [userId];
		else newExpandedRows = [userId];

		setExpandedRows(newExpandedRows);
		setTableFunctionData(key);
		setCurrentExpandedCell(attributeID);
	};

	/**
	 * @Function toggleRowSelection()
	 * @param {*} id
	 * @Purpose This is used to select a row or select all row
	 */
	const toggleRowSelection = (id) => {
		if (id === 'selectAll') {
			if (allSelected) {
				setAllSelected(false);
				setSelectedRows([]);
			} else {
				setAllSelected(true);
				setSelectedRows(matchmakingData?.map((a) => a.key));
			}
		} else {
			let currentSelectedRows = [...selectedRows];
			const isRowSelected = selectedRows.includes(id);

			if (isRowSelected && id !== 'selectAll')
				currentSelectedRows = currentSelectedRows.filter((item) => item !== id);
			else currentSelectedRows = currentSelectedRows.concat(id);

			setSelectedRows(currentSelectedRows);
		}
	};

	const tableFunctions = {
		talentCost: (
			<ShowTalentCost
				isTalentCostActive={isTalentCostActive}
				setIsTalentCostActive={setIsTalentCostActive}
			/>
		),
		techScore: <ShowTechScore />,
		versantScore: <ShowVersantScore />,
		profileLog: <ShowProfileLog />,
	};

	const fetchMatchmakingData = async () => {
		const response = await axios.get(
			'https://api.npoint.io/abbeed53bf8b4b354bb0',
		);
		setMatchmakingData(response?.data);
	};

	useEffect(() => {
		fetchMatchmakingData();
	}, []);

	return (
		<div className="profileLogModal">
			<Button onClick={() => setMatchmakingModal(true)}>Matchmaking </Button>
			<Modal
				centered
				open={matchmakingModal}
				width="1256px"
				footer={null}
				onCancel={() => setMatchmakingModal(false)}>
				<div>
					<label
						style={{
							marginTop: '40px',
							marginLeft: '20px',
							lineHeight: '39px',
							fontWeight: '500',
							fontSize: '32px',
						}}>
						Search Talent
					</label>
					<div
						style={{
							backgroundColor: 'white',
							marginTop: '30px',
							marginLeft: 'auto',
							marginRight: 'auto',

							borderRadius: '8px',
							marginBottom: '30px',
						}}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'flex-start',
									// gap: '16px',
								}}>
								<span
									style={{
										paddingLeft: '25px',
										padding: '28px 20px',
										fontSize: '16px',
										lineHeight: '19px',
										fontWeight: '500',
									}}>
									Save Eat Foods Pvt Ltd -
								</span>
								<span
									style={{
										fontSize: '16px',
										lineHeight: '19px',
										fontWeight: '500',
									}}>
									HR081222024440
								</span>
							</div>
							<div
								style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
								{All_Hiring_Request_Utils.GETHRSTATUS(105, 'Completed')}
								<div className={MatchMakingStyle.hiringRequestPriority}>
									{All_Hiring_Request_Utils.GETHRPRIORITY(101)}
								</div>
							</div>
							<div className={MatchMakingStyle.searchFilterSet}>
								<SearchSVG style={{ width: '16px', height: '16px' }} />
								<input
									type={InputType.TEXT}
									className={MatchMakingStyle.searchInput}
									placeholder="Search Talent Details"
									/* onChange={(e) => {
										return setDebouncedSearch(
											hrUtils.allHiringRequestSearch(e, apiData),
										);
									}} */
								/>
							</div>
						</div>
					</div>
					<div
						style={{
							maxHeight: '581px',
							overflowY: 'auto',
							marginLeft: 'auto',
							marginRight: 'auto',
						}}>
						<table className={MatchMakingStyle.matchmakingTable}>
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
							<tbody>
								{matchmakingData?.map((user, index) => (
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
													setIsTalentCostActive(!isTalentCostActive);
													return handleEpandRow(
														e,
														user.key,
														`talentCost_${user.key}`,
														'talentCost',
														user.talentCost,
													);
												}}>
												{expandState[user.key] ? (
													<ArrowDownSVG />
												) : (
													<ArrowRightSVG />
												)}
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
												id={`talentCost${index}`}
												onClick={(e) => {
													setIsTalentCostActive(!isTalentCostActive);
													handleEpandRow(
														e,
														user.key,
														`talentCost_${user.key}`,
														'talentCost',
														user.talentCost,
													);
												}}>
												{user.talentCost}
												{isTalentCostActive ? (
													<ArrowDownSVG style={{ marginLeft: '8px' }} />
												) : (
													<ArrowRightSVG style={{ marginLeft: '8px' }} />
												)}
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
												id={`techScore${index}`}
												onClick={(e) => {
													setIsTechScoreActive(!isTechScoreActive);
													return handleEpandRow(
														e,
														user.key,
														`techScore_${user.key}`,
														'techScore',
														user.techScore,
													);
												}}>
												{user.techScore}
												{isTechScoreActive ? (
													<ArrowDownSVG style={{ marginLeft: '8px' }} />
												) : (
													<ArrowRightSVG style={{ marginLeft: '8px' }} />
												)}
											</td>
											<td
												className={MatchMakingStyle.td}
												id={`versantScore${index}`}
												onClick={(e) => {
													setIsVersantScoreActive(!isVersantScoreActive);
													return handleEpandRow(
														e,
														user.key,
														`versantScore_${user.key}`,
														'versantScore',
														user.versantScore,
													);
												}}>
												{user.versantScore}
												{isVersantScoreActive ? (
													<ArrowDownSVG style={{ marginLeft: '8px' }} />
												) : (
													<ArrowRightSVG style={{ marginLeft: '8px' }} />
												)}
											</td>
											<td
												className={`${MatchMakingStyle.td}`}
												id={`profileLog${index}`}
												onClick={(e) => {
													setIsProfileLogActive(!isProfileLogActive);
													return handleEpandRow(
														e,
														user.key,
														`profileLog_${user.key}`,
														'profileLog',
														user.profileLog,
													);
												}}>
												View
												{isProfileLogActive ? (
													<ArrowDownSVG style={{ marginLeft: '8px' }} />
												) : (
													<ArrowRightSVG style={{ marginLeft: '8px' }} />
												)}
											</td>
										</tr>
										<>
											{expandedRows.includes(user.key) ? (
												<tr className={MatchMakingStyle.isSelectedBackground}>
													<td
														colSpan="12"
														className={MatchMakingStyle.td}>
														<div>
															{tableFunctions[tableFunctionData] &&
																tableFunctions[tableFunctionData]}
														</div>
													</td>
												</tr>
											) : null}
										</>
									</>
								))}
							</tbody>
						</table>
					</div>
					<div className={MatchMakingStyle.formPanelAction}>
						<button
							type="button"
							className={MatchMakingStyle.btnPrimary}>
							Select Talent
						</button>

						<button
							// onClick={handleSubmit((d) => console.log(d))}
							className={MatchMakingStyle.btn}>
							Cancel
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default MatchmakingModal;
