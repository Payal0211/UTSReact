import { Collapse, Modal, message } from 'antd';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import HRInputField from '../hrInputFields/hrInputFields';
import { InputType } from 'constants/application';
import { useState } from 'react';
import ConvertToContractualStyle from './convertToContractual.module.css';
import HRSelectField from '../hrSelectField/hrSelectField';
import { HTTPStatusCode } from 'constants/network';
import SpinLoader from 'shared/components/spinLoader/spinLoader';
const ConvertToContractual = ({
	isConvertToContractual,
	setIsConvertToContractual,
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
	const param = useParams();

	const [saveContractualInfo, setContractualInfo] = useState('');
	const [getTelantCC, setTalentCC] = useState([]);
	// const [convertToContracual, setIsConvertToContractual] = useState(false);
	const [hiringRequest, setHiringRequest] = useState([
		{ id: 0, value: 'Select' },
		{ id: 1, value: "Yes, it's for a limited Project" },
		{ id: 2, value: 'No, they want to hire for long term' },
	]);
	const [gethringRequest, sethringRequest] = useState('Select');
	const [longTerm, setLongTerm] = useState([
		{ id: 0, value: 'Select' },
		{ id: 1, value: 'Long Term' },
		{ id: 2, value: 'Sort Term' },
	]);
	const [isLoading, setIsLoading] = useState(false);
	const { Panel } = Collapse;
	const [getlongTermdata, setlongTermdata] = useState('Select');
	const [messageAPI, contextHolder] = message.useMessage();
	const convertToContracualAPIS = async () => {
		const response = await hiringRequestDAO.convertToContracualPlacementDAO(
			param.hrid,
		);
	};

	const saveConvertToContractual = async () => {
		setIsLoading(true);
		const response = await hiringRequestDAO.saveConvertToContractualDAO(
			param.hrid,
			watch('ContractualPercentage'),
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			messageAPI.open(
				{
					type: 'success',
					content: response?.responseBody?.message,
				},
				1000,
			);
			setValue('ContractualPercentage', response.responseBody.details);

			setTimeout(() => {
				setIsConvertToContractual(false);
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
		// set[ContractualInfo(response.responseBody.details);
	};

	const getTalentCC = async () => {
		const response = await hiringRequestDAO.getTelantContracualConversionDAO(
			param.hrid,
		);
		setTalentCC(response.responseBody.details);

		setValue('Contracual', response.responseBody.details);
	};

	const saveTalentContractual = async () => {
		setIsLoading(true);
		const data = watch('Contracual');
		const _hiringrequest = watch('hiringrequest');
		const _longterm = watch('longterm');
		const _contactDuration = watch('contactDuration');

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
		if (response.statusCode === HTTPStatusCode.OK) {
			messageAPI.open(
				{
					type: 'success',
					content: response?.responseBody?.message,
				},
				1000,
			);

			setTimeout(() => {
				setIsConvertToContractual(false);
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
	useEffect(() => {
		getTalentCC();
	}, []);

	useEffect(() => {
		convertToContracualAPIS();
	}, []);

	return apiData?.DpFlag === true ? (
		<>
			{contextHolder}
			<Modal
				transitionName=""
				centered
				open={isConvertToContractual}
				width="846px"
				footer={null}
				className="convert-contractual-modal-wrap"
				onCancel={() => setIsConvertToContractual(false)}>
				<div className={ConvertToContractualStyle.convertContractualModal}>
					<div className={ConvertToContractualStyle.convertModalTitle}>
						<h2>Convert to Contractual</h2>
						<p>
							Please add necessary details for converting this HR from
							Contractual to Direct Placement
						</p>
					</div>

					<div className={ConvertToContractualStyle.hrFieldContainer}>
						<div className={ConvertToContractualStyle.row}>
							<div className={ConvertToContractualStyle.colMd12}>
								<HRSelectField
									controlledValue={gethringRequest}
									setControlledValue={sethringRequest}
									isControlled={true}
									setValue={setValue}
									register={register}
									name="hiringrequest"
									label="Is this Hiring need Temporary for any project?"
									mode={'id/value'}
									options={hiringRequest}
									required
									isError={errors['hiringrequest'] && errors['hiringrequest']}
									errorMsg="Please select a hiringrequest."
								/>
								<HRSelectField
									controlledValue={getlongTermdata}
									setControlledValue={setlongTermdata}
									isControlled={true}
									setValue={setValue}
									register={register}
									name="longterm"
									label="Long Term/Short Term?"
									mode={'id/value'}
									options={longTerm}
									required
									isError={errors['longterm'] && errors['longterm']}
									errorMsg="Please select a term."
								/>
								<HRInputField
									register={register}
									errors={errors}
									label="Contact Duration (In Months)"
									name="contactDuration"
									type={InputType.TEXT}
									placeholder="Enter Months"
									validationSchema={{
										required: 'Please enter Contact Duration',
									}}
									errorMsg="Please enter Contact Duration."
									required
								/>
							</div>
						</div>
					</div>

					<div className={ConvertToContractualStyle.talentDetailPart}>
						{getTelantCC?.length === 0 ? (
							<p className="data-not-found">Talents Details Not Found</p>
						) : (
							<h4>Talents Detail</h4>
						)}
						{isLoading ? (
							<SpinLoader />
						) : (
							<Collapse accordion>
								{getTelantCC?.map((data, index) => {
									return (
										<Panel
											header={`Talent ${data.talentname}`}
											key={index}>
											<div
												className={ConvertToContractualStyle.hrFieldContainer}>
												<div className={ConvertToContractualStyle.row}>
													<div className={ConvertToContractualStyle.colMd6}>
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
													<div className={ConvertToContractualStyle.colMd6}>
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
													<div className={ConvertToContractualStyle.colMd6}>
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
																		e.target.value,
																	);
																setValue(
																	`Contracual[${index}].brAmount`,
																	response.responseBody.details,
																);
															}}
															// validationSchema={{
															// 	required: 'Please enter NR Margin Percentage',
															// }}
															// disabled={isSameAsPrimaryPOC}
															required
														/>
													</div>
													<div className={ConvertToContractualStyle.colMd6}>
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
						)}
					</div>
					<div className={ConvertToContractualStyle.formPanelAction}>
						<button
							className={ConvertToContractualStyle.btn}
							onClick={() => setIsConvertToContractual(false)}>
							Cancel
						</button>

						<button
							onClick={handleSubmit(saveTalentContractual)}
							type="button"
							className={ConvertToContractualStyle.btnPrimary}>
							Convert to Contractual
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
				open={isConvertToContractual}
				width="600px"
				footer={null}
				className="convert-contractual-modal-wrap"
				onCancel={() => setIsConvertToContractual(false)}>
				<div className={ConvertToContractualStyle.convertContractualModal}>
					<div className={ConvertToContractualStyle.convertModalTitle}>
						<h2>Convert to Contractual</h2>
						<p>
							Please add necessary details for converting this HR from
							Contractual to Direct Placement
						</p>
					</div>

					{isLoading ? (
						<div className={ConvertToContractualStyle.contractualLoader}>
							<SpinLoader />
						</div>
					) : (
						<div className={ConvertToContractualStyle.hrFieldContainer}>
							<div className={ConvertToContractualStyle.row}>
								<div className={ConvertToContractualStyle.colMd12}>
									<HRInputField
										register={register}
										errors={errors}
										label="Contractual Percentage"
										name="ContractualPercentage"
										type={InputType.TEXT}
										placeholder="Enter Percentage"
										required
										validationSchema={{
											required: 'please enter Contractual Percentage.',
										}}
										errorMsg="please enter Contractual Percentage."
									/>
								</div>
							</div>
						</div>
					)}

					<div className={ConvertToContractualStyle.formPanelAction}>
						<button
							className={ConvertToContractualStyle.btn}
							onClick={() => setIsConvertToContractual(false)}>
							Cancel
						</button>

						<button
							onClick={handleSubmit(saveConvertToContractual)}
							type="button"
							className={ConvertToContractualStyle.btnPrimary}>
							Convert to Contractual
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default ConvertToContractual;
