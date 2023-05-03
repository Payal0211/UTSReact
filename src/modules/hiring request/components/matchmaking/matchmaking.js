import { Button, Modal, Pagination, Skeleton, message } from "antd";
import axios from "axios";
import { InputType, SubmitType } from "constants/application";
import {
	Fragment,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import MatchMakingStyle from "./matchmaking.module.css";
import convertToDPmodule from "./convertToDPmodule.css";
import { useFieldArray, useForm } from "react-hook-form";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ShowTechScore } from "../techScore/techScore";
import { ShowTalentCost } from "../talentCost/talentCost";
import { ShowVersantScore } from "../versantScore/versantScore";
import { ShowProfileLog } from "../profileLog/profileLog";
import MatchMakingTable from "./matchmakingTable";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { HTTPStatusCode } from "constants/network";
import { useLocation, useNavigate } from "react-router-dom";
import UTSRoutes from "constants/routes";
import HRInputField from "../hrInputFields/hrInputFields";
import HRSelectField from "../hrSelectField/hrSelectField";
import UserFieldStyle from "../../../user/components/userFIelds/userFields.module.css";
import { Collapse } from "antd";
import PlusIcon from "../../../../assets/svg/plush-icon.svg";
import MinusIcon from "../../../../assets/svg/minus-icon.svg";
import { useParams } from "react-router-dom";
import { _isNull } from "shared/utils/basic_utils";
// import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO"

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
	let urlSplitter = `${switchLocation.pathname.split("/")[2]}`;
	const updatedSplitter = "HR" + urlSplitter?.split("HR")[1];
	const [matchmakingModal, setMatchmakingModal] = useState(false);
	const [matchmakingData, setMatchmakingData] = useState([]);
	const [filterMatchmakingData, setFilterMatchmakingData] = useState([]);
	/** State variable to keep track of all the expanded rows*/
	const [expandedRows, setExpandedRows] = useState([]);
	const [tableFunctionData, setTableFunctionData] = useState("");
	const [currentExpandedCell, setCurrentExpandedCell] = useState("");
	const [selectedRows, setSelectedRows] = useState([]);
	const [allSelected, setAllSelected] = useState(false);
	const [talentCost, setTalentCost] = useState(null);
	const [talentID, setTalentID] = useState(null);
	const [listOfTalents, setListOfTalents] = useState([]);
	const [messageAPI, contextHolder] = message.useMessage();
	const [isLoading, setIsLoading] = useState(false);
	const [modalFlag, setModalFlag] = useState(false);
	const [talentDpConversion, setTalentDpConversion] = useState();
	const [convertToDp, setConvertToDp] = useState(false);
	const [convertToContracual, setConvertToContracual] = useState(false);
	const [getDpConversion, setDpConversion] = useState("");
	const [saveContractualInfo, setContractualInfo] = useState("");
	const [hiringRequest, setHiringRequest] = useState([
		{ id: 0, value: "Select" },
		{ id: 1, value: "Yes, it's for a limited Project" },
		{ id: 2, value: "No, they want to hire for long term" },
	]);
	const [gethringRequest, sethringRequest] = useState("Select");
	const [longTerm, setLongTerm] = useState([
		{ id: 0, value: "Select" },
		{ id: 1, value: "Long Term" },
		{ id: 2, value: "Sort Term" },
	]);
	const [getlongTermdata, setlongTermdata] = useState("Select");
	const [getTelantCC, setTalentCC] = useState([]);

	const param = useParams();
	const {
		watch,
		register,
		handleSubmit,
		setValue,
		getValues,
		setError,
		resetField,
		clearErrors,
		reset,
		// control,
		formState: { errors },
	} = useForm({});
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
			const splittedAttribute = attributeID.split("_")[0];
			const currentExpandedCellAttribute = currentExpandedCell.split("_")[0];

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
		[currentExpandedCell, expandedRows]
	);

	/**
	 * @Function toggleRowSelection()
	 * @param {*} id
	 * @purpose This is used to select a row or select all row
	 */

	const toggleRowSelection = useCallback(
		(id) => {
			if (id === "selectAll") {
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
								amount: parseInt(a?.talentCost.split(" ")[1]),
							}))
						)
						: setListOfTalents(
							matchmakingData?.rows?.map((a) => ({
								talentId: a.id,
								amount: parseInt(a?.talentCost.split(" ")[1]),
							}))
						);
				}
			} else {
				let tempObj = [];
				let currentSelectedRows = [...selectedRows];

				const isRowSelected = selectedRows.includes(id);

				if (isRowSelected && id !== "selectAll") {
					currentSelectedRows = currentSelectedRows.filter(
						(item) => item !== id
					);
				} else currentSelectedRows = currentSelectedRows.concat(id);

				for (let i = 0; i < currentSelectedRows.length; i++) {
					for (let j = 0; j < matchmakingData?.rows?.length; j++) {
						if (currentSelectedRows[i] === matchmakingData?.rows[j]?.id) {
							tempObj.push({
								talentId: currentSelectedRows[i],
								amount: parseInt(
									matchmakingData?.rows[j]?.talentCost.split(" ")[1]
								),
							});
						}
					}
				}
				setSelectedRows(currentSelectedRows);
				setListOfTalents(tempObj);
			}
		},
		[allSelected, filterMatchmakingData, matchmakingData.rows, selectedRows]
	);

	const closeExpandedCell = useCallback(() => {
		setExpandedRows([]);
		setCurrentExpandedCell("");
	}, []);

	const convertToDpAPIS = async () => {
		const response = await hiringRequestDAO.convertToDirectPlacementDAO(
			param.hrid
		);
	};

	const convertToContracualAPIS = async () => {
		const response = await hiringRequestDAO.convertToContracualPlacementDAO(
			param.hrid
		);
	};

	const getHrDetailsAPIS = async () => {
		const response = await hiringRequestDAO.getHrDetailsDAO(param.hrid);
		setModalFlag(JSON.parse(response.responseBody.details).DpFlag);
	};

	const getHrDpConversion = async () => {
		const response = await hiringRequestDAO.getHrDpConversionDAO(param.hrid);
		setDpConversion(response.responseBody.details);
		setValue("DpPercentage", getDpConversion);
	};

	const saveConvertToContractual = async () => {
		if (_isNull(watch("ContractualPercentage"))) {
			return setError("ContractualPercentage", {
				type: "emptyContractualPercentage",
				message: "Please enter Contractual Percentage",
			});
		} else if (
			!/[^.?!-/*-+]/.test(watch("ContractualPercentage")) ||
			watch("ContractualPercentage") > 100
		) {
			return setError("ContractualPercentage", {
				type: "emptyDpPercentage",
				message: "Please enter valid Percentage.",
			});
		}
		const response = await hiringRequestDAO.saveConvertToContractualDAO(
			param.hrid,
			watch("ContractualPercentage")
		);
		setConvertToContracual(false);
		setContractualInfo(response.responseBody.details);
		setValue("ContractualPercentage", saveContractualInfo);
		setError("ContractualPercentage", {
			type: "",
			message: "",
		});
	};
	console.log(watch(`talentData[${3}].dpPercentage`), "watchdppercentage");
	const saveDpConversion = async () => {
		if (_isNull(watch("DpPercentage"))) {
			return setError("DpPercentage", {
				type: "emptyDpPercentage",
				message: "Please enter DP Percentage.",
			});
		} else if (
			!/[^.?!-/*-+]/.test(watch("DpPercentage")) ||
			watch("DpPercentage") > 100
		) {
			return setError("DpPercentage", {
				type: "emptyDpPercentage",
				message: "Please enter valid Percentage.",
			});
		}
		const response = await hiringRequestDAO.saveDpConversionDAO(
			param.hrid,
			watch("DpPercentage")
		);
		setConvertToDp(false);
		setValue("DpPercentage", response.responseBody.details);
		setError("DpPercentage", {
			type: "",
			message: "",
		});
	};

	const getTalentDPConversionAPIS = async () => {
		setConvertToDp(true);
		const response = await hiringRequestDAO.getTalentDPConversionDAO(
			param.hrid
		);
		setTalentDpConversion(response.responseBody.details);
		setValue(`talentData`, talentDpConversion);
	};
	useEffect(() => {
		convertToDpAPIS();
		getHrDetailsAPIS();
		convertToContracualAPIS();
		getTalentDPConversionAPIS();
		getHrDpConversion();
		// getConvertToContractual()
		setConvertToContracual(false);
		setConvertToDp(false);
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
				<ShowTechScore talentID={talentID} handleClose={closeExpandedCell} />
			),
			versantScore: <ShowVersantScore handleClose={closeExpandedCell} />,
			profileLog: (
				<ShowProfileLog talentID={talentID} handleClose={closeExpandedCell} />
			),
		};
		return tableFunctions;
	}, [closeExpandedCell, talentCost, talentID]);

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
			talentPrioritiesObj
		);

		if (response.statusCode === HTTPStatusCode.OK) {
			messageAPI.open({
				type: "success",
				content: response?.responseBody?.message,
			});
			setIsLoading(false);
			setMatchmakingModal(false);
			refreshedHRDetail(hrID);
		} else {
			messageAPI.open({
				type: "error",
				content: "Something went wrong.",
			});
			setIsLoading(false);
		}
	}, [hrID, listOfTalents, messageAPI, refreshedHRDetail]);

	/** Disposing the Modal State */
	useEffect(() => {
		return () => {
			if (!matchmakingModal) {
				setExpandedRows([]);
				setTableFunctionData("");
				setCurrentExpandedCell("");
				setSelectedRows([]);
				setAllSelected(false);
				setListOfTalents([]);
			}
		};
	}, [matchmakingModal]);

	const convertToDpCollapseModal = async () => {
		let watchData = watch("talentData");
		let _payloadList = [];
		for (let singleData of watchData) {
			let _payloadObj = {};
			_payloadObj.hrid = singleData.hrid;
			_payloadObj.contactTalentID = singleData.contactTalentPriorityID;
			_payloadObj.talentID = singleData.talentID;
			_payloadObj.dpAmount = singleData.dpAmount;
			_payloadObj.dpPercentage = Number(singleData.dpPercentage);
			_payloadObj.currentCTC = Number(singleData.currentCTC);
			_payloadObj.expectedCTC = Number(singleData.expectedCTC);
			_payloadList.push(_payloadObj);
		}
		const response = await hiringRequestDAO.saveTalentDpConversionDAO(
			_payloadList
		);
		message.error(response?.responseBody);
		if (response.statusCode === HTTPStatusCode.OK) {
			setConvertToDp(false);
		}
	};

	const convertToContracualInfo = useCallback(async () => {
		setConvertToContracual(true);
		getTalentCC();
	}, [hrID]);

	const saveTalentContracual = async () => {
		const data = watch("Contracual");
		const _hiringrequest = watch("hiringrequest");
		const _longterm = watch("longterm");
		const _contactDuration = watch("contactDuration");

		let _list = [];
		for (let sd of data) {
			let obj = {};
			obj.hrid = sd.hrid;
			obj.talentID = sd.talentID;
			obj.contactTalentID = sd.contactTalentPriorityID;
			obj.nrPercentage = Number(sd.nrPercentage);
			obj.hR_Cost = sd.brAmount;
			obj.isHiringLimited =
				_hiringrequest.id === 1 ? true : _hiringrequest.id === 2 ? false : null;
			obj.durationType = _longterm.value;
			obj.specificMonth = Number(_contactDuration);
			_list.push(obj);
		}

		const response = await hiringRequestDAO.saveTalentsContracualDAO(_list);
		setConvertToContracual(false);
	};

	const getTalentCC = async () => {
		const response = await hiringRequestDAO.getTelantContracualConversionDAO(
			param.hrid
		);
		setTalentCC(response.responseBody.details);
		setValue("Contracual", response.responseBody.details);
	};

	useEffect(() => {
		getTalentCC();
	}, []);

	return (
		<>
			{talentLength === 0 ? (
				<div onClick={() => fetchMatchmakingData()}>Explore Profiles</div>
			) : (
				<>
					<button
						onClick={() => fetchMatchmakingData()}
						className={MatchMakingStyle.btnPrimary}
					>
						Matchmaking
					</button>
					<button
						onClick={() => getTalentDPConversionAPIS()}
						className={MatchMakingStyle.btnPrimary}
					>
						Convert To Dp
					</button>
					<button
						onClick={() => convertToContracualInfo()}
						className={MatchMakingStyle.btnPrimary}
					>
						Convert To Contractual
					</button>
				</>
			)}
			{contextHolder}
			<Modal
				transitionName=""
				centered
				open={matchmakingModal}
				width="1256px"
				footer={null}
				onCancel={() => setMatchmakingModal(false)}
			>
				<div>
					<label className={MatchMakingStyle.matchmakingLabel}>
						Search Talent
					</label>
					<div
						style={{
							backgroundColor: "white",
							marginTop: "30px",
							marginLeft: "auto",
							marginRight: "auto",
							borderRadius: "8px",
							marginBottom: "30px",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "flex-start",
									// gap: '16px',
								}}
							>
								<span
									style={{
										paddingLeft: "25px",
										padding: "28px 20px",
										fontSize: "16px",
										lineHeight: "19px",
										fontWeight: "500",
									}}
								>
									{matchmakingData && matchmakingData?.CompanyName}{" "}
									{matchmakingData?.CompanyName && "-"}
								</span>
								<span
									style={{
										fontSize: "16px",
										lineHeight: "19px",
										fontWeight: "500",
									}}
								>
									{matchmakingData?.CompanyName && hrNo}
								</span>
							</div>
							<div
								style={{ display: "flex", alignItems: "center", gap: "20px" }}
							>
								{All_Hiring_Request_Utils.GETHRSTATUS(hrStatusCode, hrStatus)}
								<div className={MatchMakingStyle.hiringRequestPriority}>
									{All_Hiring_Request_Utils.GETHRPRIORITY(hrPriority)}
								</div>
							</div>
							<div className={MatchMakingStyle.searchFilterSet}>
								<SearchSVG style={{ width: "16px", height: "16px" }} />
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
							maxHeight: "581px",
							overflowY: "auto",
							marginLeft: "auto",
							marginRight: "auto",
						}}
					>
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
								cursor: listOfTalents.length === 0 ? "no-drop" : "pointer",
							}}
							onClick={() => {
								getTalentPriorities();

								// callAPI(hrID);
							}}
							type="button"
							className={MatchMakingStyle.btnPrimary}
						>
							Select Talent
						</button>

						<button className={MatchMakingStyle.btn}>Cancel</button>
						<div
							style={{
								position: "absolute",
								right: "0",
								marginRight: "32px",
							}}
						></div>
					</div>
				</div>
			</Modal>
			{/* dp */}
			{modalFlag === false ? (
				<>
					<Modal
						transitionName=""
						centered
						open={convertToDp}
						width="864px"
						footer={null}
						className="convert-dp-modal-wrap"
						onCancel={() => setConvertToDp(false)}
					>
						<div className="convert-dp-modal">
							<label className={MatchMakingStyle.matchmakingLabel}>
								Convert to Direct Placement
							</label>
							<p className={convertToDPmodule.test}>
								Please add necessary details for converting this HR from
								Contractual to Direct Placement
							</p>

							<div className="talent-detail-part">
								<h4>
									{talentDpConversion?.length === 0 || !talentDpConversion
										? "Talent Details Not Found"
										: "Talent Details"}
								</h4>
								<div className={UserFieldStyle.hrFieldContainer}>
									<Collapse accordion>
										{talentDpConversion?.map((item, index) => {
											return (
												<Panel
													header={watch(`talentData[${index}].talentname`)}
													key={index}
												>
													<div className={UserFieldStyle.hrFieldContainer}>
														<div className={UserFieldStyle.row}>
															<div className={UserFieldStyle.colMd6}>
																<HRInputField
																	disabled
																	register={register}
																	errors={errors}
																	label="Talent Name"
																	name={`talentData[${index}].talentname`}
																	validationSchema={{
																		required: "Please enter Talent Name",
																	}}
																	required
																	type={InputType.TEXT}
																/>
															</div>
															<div className={UserFieldStyle.colMd6}>
																<HRInputField
																	register={register}
																	errors={errors}
																	validationSchema={{
																		required: "Please enter Talent CTC",
																	}}
																	required
																	label="Talent Current CTC"
																	name={`talentData[${index}].currentCTC`}
																	type={InputType.NUMBER}
																	placeholder="Enter Percentage"
																/>
															</div>

															<div className={UserFieldStyle.colMd6}>
																<HRInputField
																	register={register}
																	errors={errors}
																	label="Talent Expected CTC"
																	name={`talentData[${index}].expectedCTC`}
																	type={InputType.NUMBER}
																	placeholder="Enter Percentage"
																	onChangeHandler={async (e) => {
																		let _dpValue = watch(
																			`talentData[${index}].dpPercentage`
																		);
																		let response =
																			await hiringRequestDAO.calculateTalentDpConversion(
																				item.hrid,
																				item.contactTalentPriorityID,
																				_dpValue,
																				e.target.value
																			);
																		setValue(
																			`talentData[${index}].dpAmount`,
																			response.responseBody.details
																		);
																	}}
																/>
															</div>
															<div className={UserFieldStyle.colMd6}>
																<HRInputField
																	register={register}
																	label="DP Percentage"
																	name={`talentData[${index}].dpPercentage`}
																	type={InputType.NUMBER}
																	placeholder="Enter Percentage"
																	errors={errors}
																	onChangeHandler={async (e) => {
																		let _perValue = watch(
																			`talentData[${index}].expectedCTC`
																		);
																		let response =
																			await hiringRequestDAO.calculateTalentDpConversion(
																				item.hrid,
																				item.contactTalentPriorityID,
																				e.target.value,
																				_perValue
																			);
																		setValue(
																			`talentData[${index}].dpAmount`,
																			response.responseBody.details
																		);
																	}}
																/>
															</div>

															<div className={UserFieldStyle.colMd6}>
																<HRInputField
																	register={register}
																	errors={errors}
																	label="DP Amount"
																	name={`talentData[${index}].dpAmount`}
																	type={InputType.TEXT}
																	placeholder="Enter Percentage"
																	disabled={true}
																/>
															</div>
														</div>
													</div>
												</Panel>
											);
										})}
									</Collapse>
								</div>
							</div>

							<div className={MatchMakingStyle.formPanelAction}>
								<button
									className={MatchMakingStyle.btn}
									onClick={() => {
										setConvertToDp(false);
									}}
								>
									Cancel
								</button>
								{talentDpConversion?.length !== 0 && (
									<button
										onClick={() => {
											convertToDpCollapseModal();
										}}
										type="button"
										className={MatchMakingStyle.btnPrimary}
									>
										Convert to DP
									</button>
								)}

								<div
									style={{
										position: "absolute",
										right: "0",
										marginRight: "32px",
									}}
								></div>
							</div>
						</div>
					</Modal>
				</>
			) : (
				<>
					<Modal
						transitionName=""
						centered
						open={convertToDp}
						width="600px"
						footer={null}
						className="convert-dp-modal-wrap"
						onCancel={() => setConvertToDp(false)}
					>
						<div className="convert-dp-modal">
							<label className={MatchMakingStyle.matchmakingLabel}>
								Convert to Direct Placement
							</label>
							<p className={convertToDPmodule.test}>
								Please add necessary details for converting this HR from
								Contractual to Direct Placement
							</p>

							<div className={UserFieldStyle.hrFieldContainer}>
								<div className={UserFieldStyle.row}>
									<div className={UserFieldStyle.colMd12}>
										<HRInputField
											register={register}
											errors={errors}
											label="DP Percentage"
											name="DpPercentage"
											type={InputType.TEXT}
											placeholder="Enter Percentage"
											required
										/>
									</div>
								</div>
							</div>

							<div className={MatchMakingStyle.formPanelAction}>
								<button
									className={MatchMakingStyle.btn}
									onClick={() => {
										setConvertToDp(false);
										setError("DpPercentage", {
											type: "",
											message: "",
										});
										setValue("DpPercentage", "");
									}}
								>
									Cancel
								</button>

								<button
									onClick={() => {
										saveDpConversion();
									}}
									type="button"
									className={MatchMakingStyle.btnPrimary}
								>
									Convert to DP
								</button>
								<div
									style={{
										position: "absolute",
										right: "0",
										marginRight: "32px",
									}}
								></div>
							</div>
						</div>
					</Modal>
				</>
			)}

			{/* convert to contracual */}
			{modalFlag === false ? (
				<>
					<Modal
						transitionName=""
						centered
						open={convertToContracual}
						width="846px"
						footer={null}
						onCancel={() => setConvertToContracual(false)}
					>
						<div className="convert-contractual-modal">
							<label className={MatchMakingStyle.matchmakingLabel}>
								Convert to Contractual
							</label>
							<p className={convertToDPmodule.test}>
								Please add necessary details for converting this HR from
								Contractual to Direct Placement
							</p>
							{getTelantCC?.length !== 0 && (
								<>
									<div className={UserFieldStyle.hrFieldContainer}>
										<div className={UserFieldStyle.row}>
											<div className={UserFieldStyle.colMd12}>
												<HRSelectField
													controlledValue={gethringRequest}
													setControlledValue={sethringRequest}
													isControlled={true}
													setValue={setValue}
													register={register}
													name="hiringrequest"
													label="Is this Hiring need Temporary for any project?"
													mode={"id/value"}
													options={hiringRequest}
													required
													// isError={
													//   errors["hiringrequest"] && errors["hiringrequest"]
													// }
													// errorMsg="Please select a hiringrequest."
													validationSchema={{
														validate: (value) => {
															if (!value) {
																return "Please enter employee ID";
															}
														},
													}}
												/>
												<HRSelectField
													controlledValue={getlongTermdata}
													setControlledValue={setlongTermdata}
													isControlled={true}
													setValue={setValue}
													register={register}
													name="longterm"
													label="Long Term/Short Term?"
													mode={"id/value"}
													options={longTerm}
													required
													isError={errors["longterm"] && errors["longterm"]}
													errorMsg="Please select a longterm."
												/>
												<HRInputField
													register={register}
													errors={errors}
													label="Contact Duration (In Months)"
													name="contactDuration"
													type={InputType.TEXT}
													placeholder="Enter Months"
													isError={
														errors["contactDuration"] &&
														errors["contactDuration"]
													}
													errorMsg="Please enter Contact Duration."
													required
												/>
											</div>
										</div>
									</div>
								</>
							)}

							<div className="talent-detail-part">
								<h4>
									{getTelantCC?.length === 0 || !talentDpConversion
										? "Talent Details Not Found"
										: "Talent Details"}
								</h4>
								<Collapse accordion>
									{getTelantCC?.map((data, index) => {
										return (
											<Panel header={`Talent ${index}`} key={index}>
												<div className={UserFieldStyle.hrFieldContainer}>
													<div className={UserFieldStyle.row}>
														<div className={UserFieldStyle.colMd6}>
															<HRInputField
																register={register}
																errors={errors}
																label="Talent Name"
																name={`Contracual[${index}].talentname`}
																type={InputType.TEXT}
																placeholder="Enter Percentage"
																disabled={true}
																required
															/>
														</div>
														<div className={UserFieldStyle.colMd6}>
															<HRInputField
																register={register}
																errors={errors}
																label="Talent Fees"
																name={`Contracual[${index}].expectedCTC`}
																type={InputType.TEXT}
																placeholder="Enter Percentage"
																disabled={true}
																required
															/>
														</div>
														<div className={UserFieldStyle.colMd6}>
															<HRInputField
																register={register}
																errors={errors}
																label="NR Margin Percentage"
																name={`Contracual[${index}].nrPercentage`}
																type={InputType.TEXT}
																placeholder="Enter Percentage"
																onChangeHandler={async (e) => {
																	const response =
																		await hiringRequestDAO.calculateHRCostDAO(
																			data.hrid,
																			data.contactTalentPriorityID,
																			data.brAmount,
																			e.target.value
																		);
																	setValue(
																		`Contracual[${index}].brAmount`,
																		response.responseBody.details
																	);
																}}
																// disabled={isSameAsPrimaryPOC}
																required
															/>
														</div>
														<div className={UserFieldStyle.colMd6}>
															<HRInputField
																register={register}
																errors={errors}
																label="HR Cost"
																name={`Contracual[${index}].brAmount`}
																type={InputType.TEXT}
																placeholder="Enter Percentage"
																disabled={true}
																required
															/>
														</div>
													</div>
												</div>
											</Panel>
										);
									})}
								</Collapse>
							</div>
							<div className={MatchMakingStyle.formPanelAction}>
								<button
									className={MatchMakingStyle.btn}
									onClick={() => {
										setConvertToContracual(false);
									}}
								>
									Cancel
								</button>

								{getTelantCC?.length !== 0 && (
									<button
										onClick={() => {
											saveTalentContracual();
										}}
										type="button"
										className={MatchMakingStyle.btnPrimary}
									>
										Convert to DP
									</button>
								)}

								<div
									style={{
										position: "absolute",
										right: "0",
										marginRight: "32px",
									}}
								></div>
							</div>
						</div>
					</Modal>
				</>
			) : (
				<>
					<Modal
						transitionName=""
						centered
						open={convertToContracual}
						width="600px"
						footer={null}
						className="convert-dp-modal-wrap"
						onCancel={() => setConvertToContracual(false)}
					>
						<div className="convert-dp-modal">
							<label className={MatchMakingStyle.matchmakingLabel}>
								Convert to Contractual
							</label>
							<p className={convertToDPmodule.test}>
								{" "}
								Please add necessary details for converting this HR from
								Contractual to Direct Placement
							</p>

							<div className={UserFieldStyle.hrFieldContainer}>
								<div className={UserFieldStyle.row}>
									<div className={UserFieldStyle.colMd12}>
										<HRInputField
											register={register}
											errors={errors}
											label="Contractual Percentage"
											name="ContractualPercentage"
											type={InputType.TEXT}
											placeholder="Enter Percentage"
											required
										/>
									</div>
								</div>
							</div>

							<div className={MatchMakingStyle.formPanelAction}>
								<button
									className={MatchMakingStyle.btn}
									onClick={() => {
										setConvertToContracual(false);
										setError("ContractualPercentage", {
											type: "",
											message: "",
										});
										setValue("ContractualPercentage", "");
									}}
								>
									Cancel
								</button>

								<button
									onClick={() => {
										saveConvertToContractual();
										// setConvertToContracual(false);
									}}
									type="button"
									className={MatchMakingStyle.btnPrimary}
								>
									Convert to contractual
								</button>
								<div
									style={{
										position: "absolute",
										right: "0",
										marginRight: "32px",
									}}
								></div>
							</div>
						</div>
					</Modal>
				</>
			)}
		</>
	);
};

export default MatchmakingModal;
