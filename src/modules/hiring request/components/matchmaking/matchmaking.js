import { Button, Modal, Pagination, Skeleton, message } from 'antd';
import axios from 'axios';
import { InputType } from 'constants/application';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import MatchMakingStyle from './matchmaking.module.css';
import convertToDPmodule from './convertToDPmodule.css';
import { useFieldArray, useForm } from 'react-hook-form';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ShowTechScore } from '../techScore/techScore';
import { ShowTalentCost } from '../talentCost/talentCost';
import { ShowVersantScore } from '../versantScore/versantScore';
import { ShowProfileLog } from '../profileLog/profileLog';
import MatchMakingTable from './matchmakingTable';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';
import { useLocation, useNavigate } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import HRInputField from '../hrInputFields/hrInputFields';
import HRSelectField from '../hrSelectField/hrSelectField';
import UserFieldStyle from '../../../user/components/userFIelds/userFields.module.css';
import { Collapse } from 'antd';
import PlusIcon from '../../../../assets/svg/plush-icon.svg';
import MinusIcon from '../../../../assets/svg/minus-icon.svg';

const MatchmakingModal = ({
	refreshedHRDetail,
	talentLength,
	hrID,
	hrNo,
	hrStatusCode,
	hrStatus,
	hrPriority,
}) => {
	const switchLocation = useLocation();
	let urlSplitter = `${switchLocation.pathname.split('/')[2]}`;
	const updatedSplitter = 'HR' + urlSplitter?.split('HR')[1];
	const [matchmakingModal, setMatchmakingModal] = useState(false);
	const [matchmakingData, setMatchmakingData] = useState([]);
	const [filterMatchmakingData, setFilterMatchmakingData] = useState([]);
	/** State variable to keep track of all the expanded rows*/
	const [expandedRows, setExpandedRows] = useState([]);
	const [tableFunctionData, setTableFunctionData] = useState('');
	const [currentExpandedCell, setCurrentExpandedCell] = useState('');
	const [selectedRows, setSelectedRows] = useState([]);
	const [allSelected, setAllSelected] = useState(false);
	const [talentCost, setTalentCost] = useState(null);
	const [talentID, setTalentID] = useState(null);
	const [listOfTalents, setListOfTalents] = useState([]);
	const [messageAPI, contextHolder] = message.useMessage();
	const [isLoading, setIsLoading] = useState(false);

	const [convertToDp, setConvertToDp] = useState(false)

	const [convertToContracual, setConvertToContracual] = useState(false)


	const { register, errors } = useForm()
	const { Panel } = Collapse;

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
					setListOfTalents([]);
				} else {
					setAllSelected(true);
					filterMatchmakingData.length > 0
						? setSelectedRows(filterMatchmakingData?.map((a) => a.id))
						: setSelectedRows(matchmakingData.rows?.map((a) => a.id));
					filterMatchmakingData.length > 0
						? setListOfTalents(
							filterMatchmakingData?.map((a) => ({
								talentId: a.id,
								amount: parseInt(a?.talentCost.split(' ')[1]),
							})),
						)
						: setListOfTalents(
							matchmakingData?.rows?.map((a) => ({
								talentId: a.id,
								amount: parseInt(a?.talentCost.split(' ')[1]),
							})),
						);
				}
			} else {
				let tempObj = [];
				let currentSelectedRows = [...selectedRows];

				const isRowSelected = selectedRows.includes(id);

				if (isRowSelected && id !== 'selectAll') {
					currentSelectedRows = currentSelectedRows.filter(
						(item) => item !== id,
					);
				} else currentSelectedRows = currentSelectedRows.concat(id);

				for (let i = 0; i < currentSelectedRows.length; i++) {
					for (let j = 0; j < matchmakingData?.rows?.length; j++) {
						if (currentSelectedRows[i] === matchmakingData?.rows[j]?.id) {
							tempObj.push({
								talentId: currentSelectedRows[i],
								amount: parseInt(
									matchmakingData?.rows[j]?.talentCost.split(' ')[1],
								),
							});
						}
					}
				}
				setSelectedRows(currentSelectedRows);
				setListOfTalents(tempObj);
			}
		},
		[allSelected, filterMatchmakingData, matchmakingData.rows, selectedRows],
	);

	const closeExpandedCell = useCallback(() => {
		setExpandedRows([]);
		setCurrentExpandedCell('');
	}, []);

	const expandedCellUI = useMemo(() => {
		const tableFunctions = {
			talentCost: (
				<ShowTalentCost
					talentCost={talentCost}
					handleClose={closeExpandedCell}
				/>
			),
			techScore: (
				<ShowTechScore
					talentID={talentID}
					handleClose={closeExpandedCell}
				/>
			),
			versantScore: <ShowVersantScore handleClose={closeExpandedCell} />,
			profileLog: (
				<ShowProfileLog
					talentID={talentID}
					handleClose={closeExpandedCell}
				/>
			),
		};
		return tableFunctions;
	}, [closeExpandedCell, talentCost, talentID]);

	/** Fetching the Modal Table API */



	const convertToDpInfo = useCallback(async () => {
		setConvertToDp(true);
		// const response = await hiringRequestDAO.getMatchmakingDAO({
		// 	hrID: hrID,
		// 	rows: 10,
		// 	page: 1,
		// });
		// setMatchmakingData(response?.responseBody.details);
	}, [hrID]);

	const convertToContracualInfo = useCallback(async () => {
		setConvertToContracual(true);
		// const response = await hiringRequestDAO.getMatchmakingDAO({
		// 	hrID: hrID,
		// 	rows: 10,
		// 	page: 1,
		// });
		// setMatchmakingData(response?.responseBody.details);
	}, [hrID]);


	const fetchMatchmakingData = useCallback(async () => {
		setMatchmakingModal(true);
		const response = await hiringRequestDAO.getMatchmakingDAO({
			hrID: hrID,
			rows: 10,
			page: 1,
		});
		setMatchmakingData(response?.responseBody.details);
	}, [hrID]);

	const getTalentPriorities = useCallback(async () => {
		setIsLoading(true);
		const talentPrioritiesObj = {
			hrId: parseInt(hrID),
			listOfTalents: listOfTalents,
		};
		const response = await hiringRequestDAO.setTalentPrioritiesDAO(
			talentPrioritiesObj,
		);

		if (response.statusCode === HTTPStatusCode.OK) {
			messageAPI.open({
				type: 'success',
				content: response?.responseBody?.message,
			});
			setIsLoading(false);
			setMatchmakingModal(false);
			refreshedHRDetail(hrID);
		} else {
			messageAPI.open({
				type: 'error',
				content: 'Something went wrong.',
			});
			setIsLoading(false);
		}
	}, [hrID, listOfTalents, messageAPI, refreshedHRDetail]);
	/** Disposing the Modal State */
	useEffect(() => {
		return () => {
			if (!matchmakingModal) {
				setExpandedRows([]);
				setTableFunctionData('');
				setCurrentExpandedCell('');
				setSelectedRows([]);
				setAllSelected(false);
				setListOfTalents([]);
			}
		};
	}, [matchmakingModal]);

	return (
		<>
			{talentLength === 0 ? (
				<div onClick={() => fetchMatchmakingData()}>Explore Profiles</div>
			) : (
				<>
					<button
						onClick={() => fetchMatchmakingData()}
						className={MatchMakingStyle.btnPrimary}>
						Matchmaking
					</button>
					<button
						onClick={() => convertToDpInfo()}
						className={MatchMakingStyle.btnPrimary}>
						Convert To Dp
					</button>
					<button
						onClick={() => convertToContracualInfo()}
						className={MatchMakingStyle.btnPrimary}>
						Convert To Contractual
					</button>
				</>

				// <Button onClick={() => fetchMatchmakingData()}>Matchmaking </Button>
			)}
			{contextHolder}
			<Modal
				transitionName=""
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
									{matchmakingData && matchmakingData?.CompanyName}{' '}
									{matchmakingData?.CompanyName && '-'}
								</span>
								<span
									style={{
										fontSize: '16px',
										lineHeight: '19px',
										fontWeight: '500',
									}}>
									{matchmakingData?.CompanyName && hrNo}
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
								setTalentID={setTalentID}
								setTalentCost={setTalentCost}
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
							disabled={listOfTalents.length === 0}
							style={{
								cursor: listOfTalents.length === 0 ? 'no-drop' : 'pointer',
							}}
							onClick={() => {
								getTalentPriorities();

								// callAPI(hrID);
							}}
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
			{/* dp */}
			<Modal
				transitionName=""
				centered
				open={convertToDp}
				width="864px"
				footer={null}
				onCancel={() => setConvertToDp(false)}>
				<div className="convert-dp-modal">
					<label className={MatchMakingStyle.matchmakingLabel}>
						Convert to Direct Placement
					</label>
					<p className={convertToDPmodule.test}> Please add necessary details for converting this HR from Contractual to  Direct Placement</p>


					<div className={UserFieldStyle.hrFieldContainer}>
						<div className={UserFieldStyle.row}>
							<div className={UserFieldStyle.colMd12}>
								<HRInputField
									register={register}
									errors={errors}
									label="DP Percentage"
									name={'legalClientEmailID'}
									type={InputType.TEXT}
									placeholder="Enter Percentage"
									// disabled={isSameAsPrimaryPOC}
									required
								/>
							</div>
							{/* <div className={UserFieldStyle.colMd6}>
								<HRSelectField
									searchable={true}
									// setValue={setValue}
									register={register}
									// type={InputType.TEXT}
									label="Mode of Working"
									name="primaryClientCountryCode"
								// options={flagAndCodeMemo}
								/>
							</div>

							<div className={UserFieldStyle.colMd6}>
								<HRSelectField
									searchable={true}
									// setValue={setValue}
									register={register}
									// type={InputType.TEXT}
									label="Country"
									name="primaryClientCountryCode"
								// options={flagAndCodeMemo}
								/>
							</div>
							<div className={UserFieldStyle.colMd6}>
								<HRSelectField
									searchable={true}
									// setValue={setValue}
									register={register}
									// type={InputType.TEXT}
									label="State"
									name="primaryClientCountryCode"
								// options={flagAndCodeMemo}
								/>
							</div> */}

						</div>
					</div>

					<div className={MatchMakingStyle.formPanelAction}>
						<button className={MatchMakingStyle.btn} onClick={() => setConvertToDp(false)}>Cancel</button>

						<button
							disabled={listOfTalents.length === 0}
							style={{
								cursor: listOfTalents.length === 0 ? 'no-drop' : 'pointer',
							}}
							onClick={() => {
								getTalentPriorities();

								// callAPI(hrID);
							}}
							type="button"
							className={MatchMakingStyle.btnPrimary}>
							Convert to DP
						</button>

						<div
							style={{
								position: 'absolute',
								right: '0',
								marginRight: '32px',
							}}></div>
					</div>
				</div>
			</Modal>


			{/* convert to contracual */}
			<Modal
				transitionName=""
				centered
				open={convertToContracual}
				width="846px"
				footer={null}
				onCancel={() => setConvertToContracual(false)}>
				<div className="convert-contractual-modal">
					<label className={MatchMakingStyle.matchmakingLabel}>
						Convert to Contractual
					</label>
					<p className={convertToDPmodule.test}> Please add necessary details for converting this HR from Contractual to  Direct Placement</p>


					<div className={UserFieldStyle.hrFieldContainer}>
						<div className={UserFieldStyle.row}>
							<div className={UserFieldStyle.colMd12}>
								<HRInputField
									register={register}
									errors={errors}
									label="DP Percentage"
									name={'legalClientEmailID'}
									type={InputType.TEXT}
									placeholder="Enter Percentage"
									// disabled={isSameAsPrimaryPOC}
									required
								/>
								<HRInputField
									register={register}
									errors={errors}
									label="DP Percentage"
									name={'legalClientEmailID'}
									type={InputType.TEXT}
									placeholder="Enter Percentage"
									// disabled={isSameAsPrimaryPOC}
									required
								/>
								<HRInputField
									register={register}
									errors={errors}
									label="DP Percentage"
									name={'legalClientEmailID'}
									type={InputType.TEXT}
									placeholder="Enter Percentage"
									// disabled={isSameAsPrimaryPOC}
									required
								/>
							</div>
						</div>
					</div>

					<div className="talent-detail-part">
						<h4>Talent Details</h4>
						<Collapse
							accordion
						// expandIcon={({ isActive }) => isActive ? <PlusIcon /> : <MinusIcon />}
						>
							<Panel header="This is panel header 1" key="1">
								<div className={UserFieldStyle.hrFieldContainer}>
									<div className={UserFieldStyle.row}>
										<div className={UserFieldStyle.colMd6}>
											<HRInputField
												register={register}
												errors={errors}
												label="DP Percentage"
												name={'legalClientEmailID'}
												type={InputType.TEXT}
												placeholder="Enter Percentage"
												// disabled={isSameAsPrimaryPOC}
												required
											/>
										</div>
										<div className={UserFieldStyle.colMd6}>
											<HRInputField
												register={register}
												errors={errors}
												label="DP Percentage"
												name={'legalClientEmailID'}
												type={InputType.TEXT}
												placeholder="Enter Percentage"
												// disabled={isSameAsPrimaryPOC}
												required
											/>
										</div>
										<div className={UserFieldStyle.colMd6}>
											<HRInputField
												register={register}
												errors={errors}
												label="DP Percentage"
												name={'legalClientEmailID'}
												type={InputType.TEXT}
												placeholder="Enter Percentage"
												// disabled={isSameAsPrimaryPOC}
												required
											/>
										</div>
										<div className={UserFieldStyle.colMd6}>
											<HRInputField
												register={register}
												errors={errors}
												label="DP Percentage"
												name={'legalClientEmailID'}
												type={InputType.TEXT}
												placeholder="Enter Percentage"
												// disabled={isSameAsPrimaryPOC}
												required
											/>
										</div>
									</div>
								</div>
							</Panel>
							<Panel header="This is panel header 2" key="2">
								<div className={UserFieldStyle.hrFieldContainer}>
									<div className={UserFieldStyle.row}>
										<div className={UserFieldStyle.colMd6}>
											<HRInputField
												register={register}
												errors={errors}
												label="DP Percentage"
												name={'legalClientEmailID'}
												type={InputType.TEXT}
												placeholder="Enter Percentage"
												// disabled={isSameAsPrimaryPOC}
												required
											/>
										</div>
										<div className={UserFieldStyle.colMd6}>
											<HRInputField
												register={register}
												errors={errors}
												label="DP Percentage"
												name={'legalClientEmailID'}
												type={InputType.TEXT}
												placeholder="Enter Percentage"
												// disabled={isSameAsPrimaryPOC}
												required
											/>
										</div>
										<div className={UserFieldStyle.colMd6}>
											<HRInputField
												register={register}
												errors={errors}
												label="DP Percentage"
												name={'legalClientEmailID'}
												type={InputType.TEXT}
												placeholder="Enter Percentage"
												// disabled={isSameAsPrimaryPOC}
												required
											/>
										</div>
										<div className={UserFieldStyle.colMd6}>
											<HRInputField
												register={register}
												errors={errors}
												label="DP Percentage"
												name={'legalClientEmailID'}
												type={InputType.TEXT}
												placeholder="Enter Percentage"
												// disabled={isSameAsPrimaryPOC}
												required
											/>
										</div>
									</div>
								</div>
							</Panel>
							<Panel header="This is panel header 3" key="3">
								<div className={UserFieldStyle.hrFieldContainer}>
									<div className={UserFieldStyle.row}>
										<div className={UserFieldStyle.colMd6}>
											<HRInputField
												register={register}
												errors={errors}
												label="DP Percentage"
												name={'legalClientEmailID'}
												type={InputType.TEXT}
												placeholder="Enter Percentage"
												// disabled={isSameAsPrimaryPOC}
												required
											/>
										</div>
										<div className={UserFieldStyle.colMd6}>
											<HRInputField
												register={register}
												errors={errors}
												label="DP Percentage"
												name={'legalClientEmailID'}
												type={InputType.TEXT}
												placeholder="Enter Percentage"
												// disabled={isSameAsPrimaryPOC}
												required
											/>
										</div>
										<div className={UserFieldStyle.colMd6}>
											<HRInputField
												register={register}
												errors={errors}
												label="DP Percentage"
												name={'legalClientEmailID'}
												type={InputType.TEXT}
												placeholder="Enter Percentage"
												// disabled={isSameAsPrimaryPOC}
												required
											/>
										</div>
										<div className={UserFieldStyle.colMd6}>
											<HRInputField
												register={register}
												errors={errors}
												label="DP Percentage"
												name={'legalClientEmailID'}
												type={InputType.TEXT}
												placeholder="Enter Percentage"
												// disabled={isSameAsPrimaryPOC}
												required
											/>
										</div>
									</div>
								</div>
							</Panel>
						</Collapse>
					</div>

					<div className="last-field">
						<HRInputField
							register={register}
							errors={errors}
							label="DP Percentage"
							name={'legalClientEmailID'}
							type={InputType.TEXT}
							placeholder="Enter Percentage"
							// disabled={isSameAsPrimaryPOC}
							required
						/>
					</div>

					<div className={MatchMakingStyle.formPanelAction}>
						<button className={MatchMakingStyle.btn} onClick={() => setConvertToContracual(false)}>Cancel</button>

						<button
							disabled={listOfTalents.length === 0}
							style={{
								cursor: listOfTalents.length === 0 ? 'no-drop' : 'pointer',
							}}
							onClick={() => {
								getTalentPriorities();

								// callAPI(hrID);
							}}
							type="button"
							className={MatchMakingStyle.btnPrimary}>
							Convert to DP
						</button>

						<div
							style={{
								position: 'absolute',
								right: '0',
								marginRight: '32px',
							}}></div>
					</div>
				</div>
			</Modal >

		</>
	);
};


export default MatchmakingModal;
