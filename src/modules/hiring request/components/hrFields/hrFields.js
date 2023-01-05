import { Button, Divider, Space, message } from 'antd';
import { ClientHRURL, InputType, SubmitType } from 'constants/application';
import { useCallback, useEffect, useRef, useState } from 'react';
import HRInputField from '../hrInputFields/hrInputFields';
import HRFieldStyle from './hrFIelds.module.css';
import { PlusOutlined } from '@ant-design/icons';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import UploadModal from 'shared/components/uploadModal/uploadModal';
import { MasterDAO } from 'core/master/masterDAO';

import HRSelectField from '../hrSelectField/hrSelectField';
import { useFieldArray, useForm } from 'react-hook-form';
import AddInterviewer from '../addInterviewer/addInterviewer';
import { HTTPStatusCode } from 'constants/network';
import { _isNull } from 'shared/utils/basic_utils';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useLocation } from 'react-router-dom';
import { hrUtils } from 'modules/hiring request/hrUtils';
export const secondaryInterviewer = {
	fullName: '',
	emailID: '',
	linkedin: '',
	designation: '',
};

const HRFields = ({
	setTitle,
	clientDetail,
	tabFieldDisabled,
	setTabFieldDisabled,
}) => {
	const inputRef = useRef(null);
	const [availability, setAvailability] = useState([]);
	const [timeZonePref, setTimeZonePref] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [items, setItems] = useState(['3 months', '6 months', '9 months']);
	const [talentRole, setTalentRole] = useState([]);
	const [salesPerson, setSalesPerson] = useState([]);
	const [name, setName] = useState('');
	const [pathName, setPathName] = useState('');
	const [showUploadModal, setUploadModal] = useState(false);
	const [isCompanyNameAvailable, setIsCompanyNameAvailable] = useState(false);
	const {
		watch,
		register,
		handleSubmit,
		setValue,
		setError,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			secondaryInterviewer: [],
		},
	});
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'secondaryInterviewer',
	});

	const getLocation = useLocation();

	const onNameChange = (event) => {
		setName(event.target.value);
	};
	const addItem = (e) => {
		e.preventDefault();
		setItems([...items, name + ' months' || name]);
		setName('');
		setTimeout(() => {
			inputRef.current?.focus();
		}, 0);
	};
	const getTimeZonePreference = async () => {
		const timeZone = await MasterDAO.getTalentTimeZoneRequestDAO();
		setTimeZonePref(timeZone && timeZone.responseBody);
	};
	const getAvailability = async () => {
		const availabilityResponse = await MasterDAO.getHowSoonRequestDAO();
		setAvailability(availabilityResponse && availabilityResponse.responseBody);
	};
	const getTalentRole = async () => {
		const talentRole = await MasterDAO.getTalentsRoleRequestDAO();
		setTalentRole(talentRole && talentRole.responseBody);
	};
	const getSalesPerson = async () => {
		const salesPersonResponse = await MasterDAO.getSalesManRequestDAO();
		setSalesPerson(
			salesPersonResponse && salesPersonResponse.responseBody.details,
		);
	};

	/** To check Duplicate email exists Start */

	const watchClientName = watch('clientName');

	const getHRClientName = useCallback(
		async (data) => {
			let existingClientDetails =
				await hiringRequestDAO.getClientDetailRequestDAO(data);
			setError('clientName', {
				type: 'duplicateCompanyName',
				message:
					existingClientDetails?.statusCode === HTTPStatusCode.NOT_FOUND &&
					'Client email does not exist.',
			});
			existingClientDetails.statusCode === HTTPStatusCode.NOT_FOUND &&
				setValue('clientName', '');
			existingClientDetails.statusCode === HTTPStatusCode.NOT_FOUND &&
				setValue('companyName', '');
			existingClientDetails.statusCode === HTTPStatusCode.OK &&
				setValue('companyName', existingClientDetails?.responseBody?.name);
			existingClientDetails.statusCode === HTTPStatusCode.OK &&
				setIsCompanyNameAvailable(true);
			setIsLoading(false);
		},
		[setError, setValue],
	);

	useEffect(() => {
		let timer;
		if (!_isNull(watchClientName)) {
			timer =
				pathName === ClientHRURL.ADD_NEW_HR &&
				setTimeout(() => {
					setIsLoading(true);
					getHRClientName(watchClientName);
				}, 2000);
		}
		return () => clearTimeout(timer);
	}, [getHRClientName, watchClientName, pathName]);

	useEffect(() => {
		let urlSplitter = `${getLocation.pathname.split('/')[2]}`;
		setPathName(urlSplitter);
		pathName === ClientHRURL.ADD_NEW_CLIENT &&
			setValue('clientName', clientDetail?.Email);

		pathName === ClientHRURL.ADD_NEW_CLIENT &&
			setValue('companyName', clientDetail?.Name);
	}, [
		getLocation.pathname,
		clientDetail?.Email,
		clientDetail?.Name,
		pathName,
		setValue,
	]);
	/** To check Duplicate email exists End */
	useEffect(() => {
		getAvailability();
		getTimeZonePreference();
		getTalentRole();
		getSalesPerson();
	}, []);
	const [messageAPI, contextHolder] = message.useMessage();

	const hrSubmitHandler = async (d, type = SubmitType.SAVE_AS_DRAFT) => {
		let hrFormDetails = hrUtils.hrFormDataFormatter(d, type, watch);

		if (type === SubmitType.SAVE_AS_DRAFT) {
			if (_isNull(watch('clientName'))) {
				return setError('clientName', {
					type: 'emptyClientName',
					message: 'Please enter the client name.',
				});
			}
		}
		const addHRRequest = await hiringRequestDAO.createHRDAO(hrFormDetails);
		if (addHRRequest.statusCode === HTTPStatusCode.OK) {
			type !== SubmitType.SAVE_AS_DRAFT && setTitle('Debriefing HR');
			type !== SubmitType.SAVE_AS_DRAFT &&
				setTabFieldDisabled({ ...tabFieldDisabled, debriefingHR: false });

			type === SubmitType.SAVE_AS_DRAFT &&
				messageAPI.open({
					type: 'success',
					content: 'HR details has been saved to draft.',
				});
		}
	};

	return (
		<div className={HRFieldStyle.hrFieldContainer}>
			{contextHolder}
			<div className={HRFieldStyle.partOne}>
				<div className={HRFieldStyle.hrFieldLeftPane}>
					<h3>Hiring Request Details</h3>
					<p>Please provide the necessary details</p>
				</div>
				<form
					id="hrForm"
					className={HRFieldStyle.hrFieldRightPane}>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd12}>
							<HRInputField
								disabled={pathName === ClientHRURL.ADD_NEW_CLIENT || isLoading}
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the client email/name.',
								}}
								label={'Client Email/Name'}
								name="clientName"
								type={InputType.TEXT}
								placeholder="Enter Client Email/Name"
								required
							/>
						</div>
					</div>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								disabled={
									pathName === ClientHRURL.ADD_NEW_CLIENT ||
									isCompanyNameAvailable ||
									isLoading
								}
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the company name.',
								}}
								label="Company Name"
								name="companyName"
								type={InputType.TEXT}
								placeholder="Enter Company Name"
								required
							/>
						</div>

						<div className={HRFieldStyle.colMd6}>
							<div className={HRFieldStyle.formGroup}>
								<HRSelectField
									setValue={setValue}
									register={register}
									label={'Hiring Request Role'}
									defaultValue="Select Role"
									options={talentRole && talentRole}
									name="role"
									isError={errors['role'] && errors['role']}
									required
									errorMsg={'Please select hiring request role'}
								/>
							</div>
						</div>
					</div>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd12}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the hiring request title.',
								}}
								label={'Hiring Request Title'}
								name="hrTitle"
								type={InputType.TEXT}
								placeholder="Enter title"
								required
							/>
						</div>
					</div>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								register={register}
								leadingIcon={<UploadSVG />}
								label="Job Description (PDF)"
								name="jdExport"
								type={InputType.BUTTON}
								value="Upload JD File"
								onClickHandler={() => setUploadModal(true)}
							/>
						</div>
						<UploadModal
							modalTitle={'Upload Logo'}
							isFooter={false}
							openModal={showUploadModal}
							cancelModal={() => setUploadModal(false)}
						/>

						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								label="Job Description URL"
								name="jdURL"
								type={InputType.TEXT}
								placeholder="Add JD link"
								register={register}
							/>
						</div>
					</div>

					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd4}>
							<div className={HRFieldStyle.formGroup}>
								<HRSelectField
									setValue={setValue}
									register={register}
									label={'Add your estimated budget'}
									defaultValue="Select Budget"
									options={[
										{
											value: 'USD',
											id: 'USD',
										},
										{
											value: 'INR',
											id: 'INR',
										},
									]}
									name="budget"
									isError={errors['budget'] && errors['budget']}
									required
									errorMsg={'Please select hiring request budget'}
								/>
							</div>
						</div>
						<div className={HRFieldStyle.colMd4}>
							<HRInputField
								label={'Minimum Budget'}
								register={register}
								name="minimumBudget"
								type={InputType.NUMBER}
								placeholder="Minimum- Ex: 2300, 2000"
								required
								errors={errors}
								validationSchema={{
									required: 'please enter the minimum budget.',
									min: {
										value: 0,
										message: `please don't enter the value less than 0`,
									},
								}}
							/>
						</div>

						<div className={HRFieldStyle.colMd4}>
							<HRInputField
								label={'Maximum Budget'}
								register={register}
								name="maximumBudget"
								type={InputType.NUMBER}
								placeholder="Maximum- Ex: 2300, 2000"
								required
								errors={errors}
								validationSchema={{
									required: 'please enter the maximum budget.',
									min: {
										value: watch('minimumBudget'),
										message: 'Budget should me more than minimum budget.',
									},
								}}
							/>
						</div>
					</div>

					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the nr margin percentage.',
								}}
								label="NR Margin Percentage"
								name="NRMargin"
								type={InputType.NUMBER}
								placeholder="Select NR margin percentage"
								required
							/>
						</div>

						<div className={HRFieldStyle.colMd6}>
							<div className={HRFieldStyle.formGroup}>
								<HRSelectField
									setValue={setValue}
									register={register}
									label={'Sales Person'}
									defaultValue="Select sales Person"
									options={salesPerson && salesPerson}
									name="salesPerson"
									isError={errors['salesPerson'] && errors['salesPerson']}
									required
									errorMsg={'Please select hiring request sales person'}
								/>
							</div>
						</div>
					</div>

					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<div className={HRFieldStyle.formGroup}>
								<HRSelectField
									dropdownRender={(menu) => (
										<>
											{menu}
											<Divider style={{ margin: '8px 0' }} />
											<Space style={{ padding: '0 8px 4px' }}>
												<label>Other:</label>
												<input
													type={InputType.NUMBER}
													className={HRFieldStyle.addSalesItem}
													placeholder="Ex: 5,6,7..."
													ref={inputRef}
													value={name}
													onChange={onNameChange}
												/>
												<Button
													style={{
														backgroundColor: `var(--uplers-grey)`,
													}}
													shape="round"
													type="text"
													icon={<PlusOutlined />}
													onClick={addItem}>
													Add item
												</Button>
											</Space>
											<br />
										</>
									)}
									options={items.map((item) => ({
										id: item,
										label: item,
										value: item,
									}))}
									setValue={setValue}
									register={register}
									label={'Contract Duration (in months)'}
									defaultValue="Ex: 3,6,12..."
									inputRef={inputRef}
									addItem={addItem}
									onNameChange={onNameChange}
									name="contractDuration"
									isError={
										errors['contractDuration'] && errors['contractDuration']
									}
									required
									errorMsg={'Please select hiring request conrtact duration'}
								/>
							</div>
						</div>
						<div className={HRFieldStyle.colMd6}>
							<div className={HRFieldStyle.formGroup}>
								<label>
									Required Experience
									<span className={HRFieldStyle.reqField}>*</span>
								</label>
								<div className={HRFieldStyle.reqExperience}>
									<HRInputField
										required
										errors={errors}
										validationSchema={{
											required: 'please enter the years.',
											min: {
												value: 0,
												message: `please don't enter the value less than 0`,
											},
										}}
										register={register}
										name="years"
										type={InputType.NUMBER}
										placeholder="Enter years"
									/>
									<HRInputField
										register={register}
										required
										errors={errors}
										validationSchema={{
											required: 'please enter the months.',
											max: {
												value: 12,
												message: `please don't enter the value more than 12`,
											},
											min: {
												value: 0,
												message: `please don't enter the value less than 0`,
											},
										}}
										name="months"
										type={InputType.NUMBER}
										placeholder="Enter months"
									/>
								</div>
							</div>
						</div>
					</div>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<div className={HRFieldStyle.formGroup}>
								<HRSelectField
									setValue={setValue}
									register={register}
									label={'Working Time Zone'}
									defaultValue="Select time zone"
									options={timeZonePref}
									name="timeZone"
									isError={errors['timeZone'] && errors['timeZone']}
									required
									errorMsg={'Please select hiring request time zone.'}
								/>
							</div>
						</div>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the number of talents.',
								}}
								label="How many talents are needed."
								name="talentsNumber"
								type={InputType.NUMBER}
								placeholder="Please enter number of talents needed"
								required
							/>
						</div>
					</div>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<div className={HRFieldStyle.formGroup}>
								<HRSelectField
									setValue={setValue}
									register={register}
									label={'How soon can they join?'}
									defaultValue="Select availability"
									options={availability}
									name="availability"
									// isError={errors['availability'] && errors['availability']}
									// required
									// errorMsg={'Please select the availability.'}
								/>
							</div>
						</div>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								register={register}
								label="Deal ID"
								name="dealID"
								type={InputType.TEXT}
								placeholder="Enter ID"
							/>
						</div>
					</div>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the BQ form link.',
								}}
								label="BQ Form Link"
								name="bqFormLink"
								type={InputType.TEXT}
								placeholder="Enter the link for BQ form"
								required
							/>
						</div>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the discovery call link.',
								}}
								label="Discovery Call Link"
								name="discoveryCallLink"
								type={InputType.TEXT}
								placeholder="Enter the link for Discovery call"
								required
							/>
						</div>
					</div>
				</form>
			</div>
			<Divider />
			<AddInterviewer
				errors={errors}
				append={append}
				remove={remove}
				register={register}
				fields={fields}
			/>

			<div className={HRFieldStyle.formPanelAction}>
				<button
					className={HRFieldStyle.btn}
					onClick={hrSubmitHandler}>
					Save as Draft
				</button>

				<button
					onClick={handleSubmit(hrSubmitHandler)}
					className={HRFieldStyle.btnPrimary}>
					Create HR
				</button>
			</div>
		</div>
	);
};

export default HRFields;
