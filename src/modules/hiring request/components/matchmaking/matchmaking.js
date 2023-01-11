import { Button, Modal, Pagination, Skeleton } from 'antd';
import axios from 'axios';
import { InputType } from 'constants/application';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import MatchMakingStyle from './matchmaking.module.css';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ShowTechScore } from '../techScore/techScore';
import { ShowTalentCost } from '../talentCost/talentCost';
import { ShowVersantScore } from '../versantScore/versantScore';
import { ShowProfileLog } from '../profileLog/profileLog';
import MatchMakingTable from './matchmakingTable';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';

const MatchmakingModal = ({
	hrID,
	hrNo,
	hrStatusCode,
	hrStatus,
	hrPriority,
}) => {
	const [matchmakingModal, setMatchmakingModal] = useState(false);
	const [matchmakingData, setMatchmakingData] = useState([]);
	const [filterMatchmakingData, setFilterMatchmakingData] = useState([]);
	/** State variable to keep track of all the expanded rows*/
	const [expandedRows, setExpandedRows] = useState([]);

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
	const handleExpandRow = useCallback(
		(event, userId, attributeID, key) => {
			const currentExpandedRows = expandedRows;
			const isRowExpanded = currentExpandedRows.includes(userId);

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
		},
		[currentExpandedCell, expandedRows],
	);

	/**
	 * @Function toggleRowSelection()
	 * @param {*} id
	 * @purpose This is used to select a row or select all row
	 */

	const toggleRowSelection = useCallback(
		(id) => {
			if (id === 'selectAll') {
				if (allSelected) {
					setAllSelected(false);
					setSelectedRows([]);
				} else {
					setAllSelected(true);
					setSelectedRows(matchmakingData.rows?.map((a) => a.id));
				}
			} else {
				let currentSelectedRows = [...selectedRows];
				const isRowSelected = selectedRows.includes(id);

				if (isRowSelected && id !== 'selectAll')
					currentSelectedRows = currentSelectedRows.filter(
						(item) => item !== id,
					);
				else currentSelectedRows = currentSelectedRows.concat(id);
				setSelectedRows(currentSelectedRows);
			}
		},
		[allSelected, selectedRows, matchmakingData],
	);

	const closeExpandedCell = useCallback(() => {
		setExpandedRows([]);
		setCurrentExpandedCell('');
	}, []);

	const expandedCellUI = useMemo(() => {
		const tableFunctions = {
			talentCost: <ShowTalentCost handleClose={closeExpandedCell} />,
			techScore: <ShowTechScore handleClose={closeExpandedCell} />,
			versantScore: <ShowVersantScore handleClose={closeExpandedCell} />,
			profileLog: <ShowProfileLog handleClose={closeExpandedCell} />,
		};
		return tableFunctions;
	}, [closeExpandedCell]);

	/** Fetching the Modal Table API */
	/**TODO():- Remove from here */
	const fetchMatchmakingData = useCallback(async () => {
		setMatchmakingModal(true);
		const response = await hiringRequestDAO.getMatchmakingDAO({
			hrID: hrID,
			rows: 10,
			page: 1,
		});
		setMatchmakingData(response?.responseBody.details);
	}, [hrID]);

	/** Disposing the Modal State */
	useEffect(() => {
		return () => {
			if (!matchmakingModal) {
				setExpandedRows([]);
				setTableFunctionData('');
				setCurrentExpandedCell('');
				setSelectedRows([]);
				setAllSelected(false);
			}
		};
	}, [matchmakingModal]);

	return (
		<>
			<Button onClick={() => fetchMatchmakingData()}>Matchmaking </Button>
			<Modal
				centered
				open={matchmakingModal}
				width="1256px"
				footer={null}
				onCancel={() => setMatchmakingModal(false)}>
				<div>
					<label className={MatchMakingStyle.matchmakingLabel}>
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
									{hrNo}
								</span>
							</div>
							<div
								style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
								{All_Hiring_Request_Utils.GETHRSTATUS(hrStatusCode, hrStatus)}
								<div className={MatchMakingStyle.hiringRequestPriority}>
									{All_Hiring_Request_Utils.GETHRPRIORITY(hrPriority)}
								</div>
							</div>
							<div className={MatchMakingStyle.searchFilterSet}>
								<SearchSVG style={{ width: '16px', height: '16px' }} />
								<input
									type={InputType.TEXT}
									className={MatchMakingStyle.searchInput}
									placeholder="Search Talent Details"
									onChange={(e) => {
										let filteredData = matchmakingData?.rows.filter((val) => {
											return (
												val.name
													.toLowerCase()
													.includes(e.target.value.toLowerCase()) ||
												val.talentCost
													.toLowerCase()
													.includes(e.target.value.toLowerCase()) ||
												val.talentRole
													.toLowerCase()
													.includes(e.target.value.toLowerCase()) ||
												val.emailID
													.toLowerCase()
													.includes(e.target.value.toLowerCase()) ||
												val.talentStatus
													.toLowerCase()
													.includes(e.target.value.toLowerCase())
											);
										});

										setFilterMatchmakingData(filteredData);
									}}
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
						{matchmakingData.length === 0 ? (
							<Skeleton />
						) : (
							<MatchMakingTable
								matchMakingData={
									filterMatchmakingData.length > 0
										? filterMatchmakingData
										: matchmakingData?.rows
								}
								allSelected={allSelected}
								toggleRowSelection={toggleRowSelection}
								expandedRows={expandedRows}
								handleExpandRow={handleExpandRow}
								selectedRows={selectedRows}
								currentExpandedCell={currentExpandedCell}
								componentToRender={
									expandedCellUI[tableFunctionData] &&
									expandedCellUI[tableFunctionData]
								}
							/>
						)}
					</div>

					<div className={MatchMakingStyle.formPanelAction}>
						<button
							type="button"
							className={MatchMakingStyle.btnPrimary}>
							Select Talent
						</button>

						<button className={MatchMakingStyle.btn}>Cancel</button>
						<div
							style={{
								position: 'absolute',
								right: '0',
								marginRight: '32px',
							}}></div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default MatchmakingModal;
