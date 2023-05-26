import { Collapse, Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import SpinLoader from 'shared/components/spinLoader/spinLoader';
import HRInputField from '../hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';
import { InputType } from 'constants/application';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import ConvertToDPStyle from './convertToDP.module.css';
import { HTTPStatusCode } from 'constants/network';
import { useParams } from 'react-router-dom';

const ConvertToDP = ({
	isConvertToDP,
	setIsConvertToDP,
	apiData,
	callAPI,
	hrID,
}) => {
	const {
		watch,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({});
	const { Panel } = Collapse;
	const [talentDpConversion, setTalentDpConversion] = useState();
	const param = useParams();
	const [getDpConversion, setDpConversion] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const convertToDpAPIS = async () => {
		const response = await hiringRequestDAO.convertToDirectPlacementDAO(
			param.hrid,
		);
	};

	const convertToContracualAPIS = async () => {
		const response = await hiringRequestDAO.convertToContracualPlacementDAO(
			param.hrid,
		);
	};
	const [messageAPI, contextHolder] = message.useMessage();
	const convertToDpCollapseModal = async () => {
		setIsLoading(true);
		let watchData = watch('talentData');
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
			_payloadList,
		);

		if (response.statusCode === HTTPStatusCode.OK) {
			messageAPI.open({
				type: 'success',
				content: response?.responseBody?.message,
			});

			setTimeout(() => {
				setIsConvertToDP(false);
				callAPI(hrID);
			}, 1000);
			setIsLoading(false);
		} else {
			setIsLoading(false);
			messageAPI.open(
				{
					type: 'error',
					content: response?.responseBody,
				},
				1000,
			);
		}
	};

	const getHrDpConversion = async () => {
		const response = await hiringRequestDAO.getHrDpConversionDAO(param.hrid);
		setDpConversion(response.responseBody.details);
		setValue('DpPercentage', getDpConversion);
	};

	const saveDpConversion = async () => {
		setIsLoading(true);
		const response = await hiringRequestDAO.saveDpConversionDAO(
			param.hrid,
			watch('DpPercentage'),
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			messageAPI.open(
				{
					type: 'success',
					content: response?.responseBody?.message,
				},
				1000,
			);
			setValue('DpPercentage', response.responseBody.details);

			setTimeout(() => {
				setIsConvertToDP(false);
				callAPI(hrID);
			}, 1000);
			setIsLoading(false);
		} else {
			setIsLoading(false);
			messageAPI.open(
				{
					type: 'error',
					content: response?.responseBody,
				},
				1000,
			);
		}
	};

	const getTalentDPConversionAPIS = async () => {
		const response = await hiringRequestDAO.getTalentDPConversionDAO(
			param.hrid,
		);

		setTalentDpConversion(response.responseBody.details);
		setValue(`talentData`, response.responseBody.details);
	};

	useEffect(() => {
		convertToDpAPIS();
		convertToContracualAPIS();
		getTalentDPConversionAPIS();
		getHrDpConversion();
	}, []);

	return apiData?.DpFlag === true ? (
		<>
			{contextHolder}
			<Modal
				transitionName=""
				centered
				open={isConvertToDP}
				width="864px"
				footer={null}
				className="convert-dp-modal-wrap"
				onCancel={() => {
					setIsLoading(false);
					setIsConvertToDP(false);
				}}>
				<div className={ConvertToDPStyle.convertDPModal}>
					<div className={ConvertToDPStyle.convertModalTitle}>
						<h2>Convert to Direct Placement</h2>
						<p>
							Please add necessary details for converting this HR from
							Contractual to Direct Placement
						</p>
					</div>

					<div className={ConvertToDPStyle.talentDetailPart}>
						{talentDpConversion?.length === 0 ? (
							<p className="data-not-found">Talents Details Not Found</p>
						) : (
							<h4>Talents Detail</h4>
						)}

						{isLoading ? (
							<SpinLoader />
						) : (
							<>
								<div className={ConvertToDPStyle.hrFieldContainer}>
									<Collapse accordion>
										{talentDpConversion?.map((item, index) => {
											return (
												<Panel
													header={watch(`talentData[${index}].talentname`)}
													key={index}>
													<div className={ConvertToDPStyle.hrFieldContainer}>
														<div className={ConvertToDPStyle.row}>
															<div className={ConvertToDPStyle.colMd6}>
																<HRInputField
																	disabled
																	register={register}
																	errors={errors}
																	label="Talent Name"
																	name={`talentData[${index}].talentname`}
																	type={InputType.TEXT}
																/>
															</div>
															<div className={ConvertToDPStyle.colMd6}>
																<HRInputField
																	register={register}
																	errors={errors}
																	label="Talent Current CTC"
																	name={`talentData[${index}].currentCTC`}
																	type={InputType.NUMBER}
																	placeholder="Enter Percentage"
																/>
															</div>

															<div className={ConvertToDPStyle.colMd6}>
																<HRInputField
																	register={register}
																	errors={errors}
																	label="Talent Expected CTC"
																	name={`talentData[${index}].expectedCTC`}
																	type={InputType.NUMBER}
																	placeholder="Enter Percentage"
																	onChangeHandler={async (e) => {
																		let _dpValue = watch(
																			`talentData[${index}].dpPercentage`,
																		);
																		let response =
																			await hiringRequestDAO.calculateTalentDpConversion(
																				item.hrid,
																				item.contactTalentPriorityID,
																				_dpValue,
																				e.target.value,
																			);
																		setValue(
																			`talentData[${index}].dpAmount`,
																			response.responseBody.details,
																		);
																	}}
																/>
															</div>
															<div className={ConvertToDPStyle.colMd6}>
																<HRInputField
																	register={register}
																	label="DP Percentage"
																	name={`talentData[${index}].dpPercentage`}
																	type={InputType.NUMBER}
																	placeholder="Enter Percentage"
																	errors={errors}
																	onChangeHandler={async (e) => {
																		let _perValue = watch(
																			`talentData[${index}].expectedCTC`,
																		);
																		let response =
																			await hiringRequestDAO.calculateTalentDpConversion(
																				item.hrid,
																				item.contactTalentPriorityID,
																				e.target.value,
																				_perValue,
																			);
																		setValue(
																			`talentData[${index}].dpAmount`,
																			response.responseBody.details,
																		);
																	}}
																/>
															</div>

															<div className={ConvertToDPStyle.colMd6}>
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
							</>
						)}
					</div>
					<div className={ConvertToDPStyle.formPanelAction}>
						<button
							className={ConvertToDPStyle.btn}
							onClick={() => setIsConvertToDP(false)}>
							Cancel
						</button>

						<button
							onClick={() => {
								convertToDpCollapseModal();
							}}
							type="button"
							className={ConvertToDPStyle.btnPrimary}>
							Convert to DP
						</button>
					</div>
				</div>
			</Modal>
		</>
	) : (
		<>
			{contextHolder}
			<Modal
				transitionName=""
				centered
				open={isConvertToDP}
				width="600px"
				footer={null}
				className="convert-dp-modal-wrap"
				onCancel={() => setIsConvertToDP(false)}>
				<div className="convert-dp-modal">
					<label className={ConvertToDPStyle.matchmakingLabel}>
						Convert to Direct Placement
					</label>
					<p className={ConvertToDPStyle.test}>
						Please add necessary details for converting this HR from Contractual
						to Direct Placement
					</p>

					{isLoading ? (
						<div className={ConvertToDPStyle.contractualLoader}>
							<SpinLoader />
						</div>
					) : (
						<div className={ConvertToDPStyle.hrFieldContainer}>
							<div className={ConvertToDPStyle.row}>
								<div className={ConvertToDPStyle.colMd12}>
									<HRInputField
										register={register}
										errors={errors}
										label="DP Percentage"
										name="DpPercentage"
										type={InputType.TEXT}
										placeholder="Enter Percentage"
										required
										validationSchema={{
											required: 'please enter DP Percentage.',
										}}
										errorMsg="please enter DP Percentage."
									/>
								</div>
							</div>
						</div>
					)}

					<div className={ConvertToDPStyle.formPanelAction}>
						<button
							className={ConvertToDPStyle.btn}
							onClick={() => setIsConvertToDP(false)}>
							Cancel
						</button>

						<button
							onClick={handleSubmit(saveDpConversion)}
							type="button"
							className={ConvertToDPStyle.btnPrimary}>
							Convert to DP
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default ConvertToDP;
