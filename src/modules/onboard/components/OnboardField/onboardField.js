import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputType } from 'constants/application';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { Button, Divider, Dropdown, Menu, Radio, Space } from 'antd';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as EditSVG } from 'assets/svg/edit.svg';
import { ReactComponent as TimeDropDownSVG } from 'assets/svg/timeDropdown.svg';
import { ReactComponent as ClockIconSVG } from 'assets/svg/clock-icon.svg';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { AiFillLinkedin } from 'react-icons/ai';
import { PlusOutlined } from '@ant-design/icons';
import OnboardStyleModule from './onboardField.module.css';
import { MasterDAO } from 'core/master/masterDAO';

const OnboardField = () => {
	const [value, setRadioValue] = useState(1);
	const [showTextBox, setTextBox] = useState(true);
	const [contractType, setContractType] = useState([]);
	const [talentTimeZone, setTalentTimeZone] = useState([]);
	const [netPaymentDays, setNetPaymentDays] = useState([]);
	const [addTeamMembersModal, setAddTeamMemberModal] = useState(false);
	// const [startDate, setStartDate] = useState(null);
	// const [endDate, setEndDate] = useState(null);
	const {
		watch,
		register,
		handleSubmit,
		setValue,
		getValues,
		setError,
		control,
		formState: { errors },
	} = useForm({});
	const onChange = (e) => {
		console.log('radio checked', e.target.value);
		setRadioValue(e.target.value);
		if (e.target.value === 1) {
			setTextBox(true);
		} else {
			setTextBox(false);
		}
	};
	const [name, setName] = useState('');
	const inputRef = useRef(null);
	const [items, setItems] = useState(['3 months', '6 months', '12 months']);
	const onNameChange = (event) => {
		setName(event.target.value);
	};
	const addItem = useCallback(
		(e) => {
			e.preventDefault();
			setItems([...items, name + ' months' || name]);
			setName('');
			setTimeout(() => {
				inputRef.current?.focus();
			}, 0);
		},
		[items, name],
	);

	const contractTypeHandler = useCallback(async () => {
		let response = await MasterDAO.getContractTypeRequestDAO();
		setContractType(response && response?.responseBody?.details);
	}, []);

	const talentTimeZoneHandler = useCallback(async () => {
		let response = await MasterDAO.getTalentTimeZoneRequestDAO();
		setTalentTimeZone(response && response?.responseBody?.details);
	}, []);

	const netPaymentDaysHandler = useCallback(async () => {
		let response = await MasterDAO.getNetPaymentDaysRequestDAO();
		setNetPaymentDays(response && response?.responseBody?.details);
	}, []);

	const onboardSubmitHandler = (d) => {
		console.log(d);
	};
	useEffect(() => {
		contractTypeHandler();
		talentTimeZoneHandler();
		netPaymentDaysHandler();
		return () => {
			setContractType([]);
			setTalentTimeZone([]);
			setNetPaymentDays([]);
		};
	}, [contractTypeHandler, netPaymentDaysHandler, talentTimeZoneHandler]);

	return (
		<div className={OnboardStyleModule.hrFieldContainer}>
			<form id="hrForm">
				<div className={OnboardStyleModule.partOne}>
					<div className={OnboardStyleModule.hrFieldLeftPane}>
						<h3>General Information</h3>
						<p>Please provide the necessary details</p>
						{false && (
							<div className={OnboardStyleModule.formPanelAction}>
								<button
									// style={{
									// 	cursor: type === SubmitType.SUBMIT ? 'no-drop' : 'pointer',
									// }}
									// disabled={type === SubmitType.SUBMIT}
									className={OnboardStyleModule.btnPrimary}
									// onClick={handleSubmit(hrSubmitHandler)}
								>
									Edit User
								</button>
							</div>
						)}
					</div>

					<div className={OnboardStyleModule.hrFieldRightPane}>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'Please enter client name',
									}}
									label={'Client Name'}
									name="clientName"
									type={InputType.TEXT}
									placeholder="Enter Name "
									required
								/>
							</div>
							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the client email',
									}}
									label="Client Email"
									name="clientEmail"
									type={InputType.EMAIL}
									placeholder="Enter Email"
									required
								/>
							</div>
						</div>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'Please enter company name',
									}}
									label={'Company Name'}
									name="companyName"
									type={InputType.TEXT}
									placeholder="Enter Name "
									required
								/>
							</div>
							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the talent full name',
									}}
									label="Talent Full Name"
									name="talentFullName"
									type={InputType.TEXT}
									placeholder="Enter Name"
									required
								/>
							</div>
						</div>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'Please enter engagement ID',
									}}
									label={'Engagement ID'}
									name="engagementID"
									type={InputType.TEXT}
									placeholder="Enter Engagement ID "
									required
								/>
							</div>
							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the hiring ID',
									}}
									label="Hiring ID"
									name="hiringID"
									type={InputType.TEXT}
									placeholder="Enter hiring ID"
									required
								/>
							</div>
						</div>

						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd6}>
								<div className={OnboardStyleModule.formGroup}>
									<HRSelectField
										// disabled={id !== 0 && true}
										mode="id/value"
										setValue={setValue}
										register={register}
										label={'Contract Type'}
										defaultValue={'Please select'}
										options={contractType}
										name="contractType"
										isError={errors['contractType'] && errors['contractType']}
										required
										errorMsg={'Please select contract type'}
									/>
								</div>
							</div>
							<div className={OnboardStyleModule.colMd6}>
								<div className={OnboardStyleModule.formGroup}>
									<HRSelectField
										dropdownRender={(menu) => (
											<>
												{menu}
												<Divider style={{ margin: '8px 0' }} />
												<Space style={{ padding: '0 8px 4px' }}>
													<label>Other:</label>
													<input
														type={InputType.NUMBER}
														className={OnboardStyleModule.addSalesItem}
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
						</div>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd6}>
								<div className={OnboardStyleModule.timeSlotItemField}>
									<div className={OnboardStyleModule.timeSlotLabel}>
										Contract Start Date <span>*</span>
									</div>
									<div className={OnboardStyleModule.timeSlotItem}>
										<CalenderSVG />
										<Controller
											render={({ ...props }) => (
												<DatePicker
													selected={watch('contractStartDate')}
													onChange={(date) => {
														setValue('contractStartDate', date);
													}}
													placeholderText="Contract Start Date"
												/>
											)}
											name="contractStartDate"
											rules={{ required: true }}
											control={control}
										/>
										{errors.contractStartDate && (
											<div className={OnboardStyleModule.error}>
												Please select contract start date
											</div>
										)}
									</div>
								</div>
							</div>
							<div className={OnboardStyleModule.colMd6}>
								<div className={OnboardStyleModule.timeSlotItemField}>
									<div className={OnboardStyleModule.timeSlotLabel}>
										Contract End Date <span>*</span>
									</div>
									<div className={OnboardStyleModule.timeSlotItem}>
										<CalenderSVG />
										<Controller
											render={({ ...props }) => (
												<DatePicker
													selected={watch('contractEndDate')}
													onChange={(date) => {
														setValue('contractEndDate', date);
													}}
													placeholderText="Contract End Date"
												/>
											)}
											name="contractEndDate"
											rules={{ required: true }}
											control={control}
										/>
										{errors.contractEndDate && (
											<div className={OnboardStyleModule.error}>
												Please select contract End date
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd12}>
								<div className={OnboardStyleModule.formGroup}>
									<HRSelectField
										mode="id/value"
										setValue={setValue}
										register={register}
										label={'Talent Time Zone'}
										defaultValue={'Select Time Zone'}
										options={talentTimeZone}
										name="timeZone"
										isError={errors['timeZone'] && errors['timeZone']}
										required
										errorMsg={'Please select the timezone'}
									/>
								</div>
							</div>
						</div>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd6}>
								<div className={OnboardStyleModule.timeSlotItemField}>
									<div className={OnboardStyleModule.timeSlotLabel}>
										Shift Start Time <span>*</span>
									</div>
									<div className={OnboardStyleModule.timeSlotItem}>
										<ClockIconSVG />
										<Controller
											render={({ ...props }) => (
												<DatePicker
													selected={watch('shiftStartTime')}
													onChange={(date) => {
														setValue('shiftStartTime', date);
													}}
													showTimeSelect
													showTimeSelectOnly
													timeIntervals={60}
													timeCaption="Time"
													timeFormat="h:mm a"
													dateFormat="h:mm a"
													placeholderText="Start Time"
												/>
											)}
											name="shiftStartTime"
											rules={{ required: true }}
											control={control}
										/>
										{errors.shiftStartTime && (
											<div className={OnboardStyleModule.error}>
												Please enter start time
											</div>
										)}
									</div>
								</div>
							</div>

							<div className={OnboardStyleModule.colMd6}>
								<div className={OnboardStyleModule.timeSlotItemField}>
									<div className={OnboardStyleModule.timeSlotLabel}>
										Shift End Time <span>*</span>
									</div>
									<div className={OnboardStyleModule.timeSlotItem}>
										<ClockIconSVG />
										<Controller
											render={({ ...props }) => (
												<DatePicker
													selected={watch('shiftEndTime')}
													onChange={(date) => {
														setValue('shiftEndTime', date);
													}}
													showTimeSelect
													showTimeSelectOnly
													timeIntervals={60}
													timeCaption="Time"
													timeFormat="h:mm a"
													dateFormat="h:mm a"
													placeholderText="End Time"
												/>
											)}
											name="shiftEndTime"
											rules={{ required: true }}
											control={control}
										/>
										{errors.shiftEndTime && (
											<div className={OnboardStyleModule.error}>
												Please enter end time
											</div>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd6}>
								<div className={OnboardStyleModule.timeSlotItemField}>
									<div className={OnboardStyleModule.timeSlotLabel}>
										Talent Onboarding Date <span>*</span>
									</div>
									<div className={OnboardStyleModule.timeSlotItem}>
										<CalenderSVG />
										<Controller
											render={({ ...props }) => (
												<DatePicker
													selected={watch('talentOnboardingDate')}
													onChange={(date) => {
														setValue('talentOnboardingDate', date);
													}}
													placeholderText="Talent Onboard Date"
												/>
											)}
											name="talentOnboardingDate"
											rules={{ required: true }}
											control={control}
										/>
										{errors.contractEndDate && (
											<div className={OnboardStyleModule.error}>
												Please select talent onboard date
											</div>
										)}
									</div>
								</div>
							</div>
							<div className={OnboardStyleModule.colMd6}>
								<div className={OnboardStyleModule.timeSlotItemField}>
									<div className={OnboardStyleModule.timeSlotLabel}>
										Talent Onboarding Time <span>*</span>
									</div>
									<div className={OnboardStyleModule.timeSlotItem}>
										<ClockIconSVG />
										<Controller
											render={({ ...props }) => (
												<DatePicker
													selected={watch('talentOnboardingTime')}
													onChange={(date) => {
														setValue('talentOnboardingTime', date);
													}}
													showTimeSelect
													showTimeSelectOnly
													timeIntervals={60}
													timeCaption="Time"
													timeFormat="h:mm a"
													dateFormat="h:mm a"
													placeholderText="End Time"
												/>
											)}
											name="talentOnboardingTime"
											rules={{ required: true }}
											control={control}
										/>
										{errors.talentOnboardingTime && (
											<div className={OnboardStyleModule.error}>
												Please enter talent onboarding time
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd6}>
								<div
									className={`${OnboardStyleModule.formGroup} ${OnboardStyleModule.phoneNoGroup}`}>
									<label>Bill Rate *</label>
									<div className={OnboardStyleModule.phoneNoCode}>
										<HRSelectField
											setValue={setValue}
											register={register}
											name="companyCountryCode"
											defaultValue="USD"
											options={[]}
										/>
									</div>
									<div className={OnboardStyleModule.phoneNoInput}>
										<HRInputField
											register={register}
											name={'phoneNumber'}
											type={InputType.NUMBER}
											placeholder="Enter Phone number"
										/>
									</div>
								</div>
							</div>
							<div className={OnboardStyleModule.colMd6}>
								<div className={OnboardStyleModule.timeSlotItemField}>
									<div className={OnboardStyleModule.timeSlotLabel}>
										Client’s First Billing Date <span>*</span>
									</div>
									<div className={OnboardStyleModule.timeSlotItem}>
										<CalenderSVG />
										<Controller
											render={({ ...props }) => (
												<DatePicker
													selected={watch('clientFirstBillingDate')}
													onChange={(date) => {
														setValue('clientFirstBillingDate', date);
													}}
													placeholderText="Client First Billing Date"
												/>
											)}
											name="clientFirstBillingDate"
											rules={{ required: true }}
											control={control}
										/>
										{errors.contractEndDate && (
											<div className={OnboardStyleModule.error}>
												Please enter billing date
											</div>
										)}
									</div>
								</div>
							</div>
							{/* <div className={OnboardStyleModule.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'Please enter billing date',
									}}
									label={'Client’s First Billing Date'}
									name="clientFirstBillingDate"
									type={InputType.TEXT}
									placeholder="Select Billing Date "
									required
									trailingIcon={<CalenderSVG />}
								/>
							</div> */}
						</div>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd6}>
								<div className={OnboardStyleModule.formGroup}>
									<HRSelectField
										// disabled={id !== 0 && true}
										mode="id/value"
										setValue={setValue}
										register={register}
										label={'Net Payment Days'}
										defaultValue={'Enter Number of Days'}
										options={netPaymentDays}
										name="netPaymentDays"
										isError={
											errors['netPaymentDays'] && errors['netPaymentDays']
										}
										required
										errorMsg={'Please select net payment days'}
									/>
								</div>
							</div>
							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'Please enter contact renewal %',
									}}
									label={'Contract Renewal % '}
									name="contractRenewal"
									type={InputType.NUMBER}
									placeholder="Enter % Amount  "
									required
								/>
								<p
									style={{
										color: '#7B61FF',
										fontSize: '12px',
										marginTop: '-20px',
									}}>
									This is an auto-renew contract to start with easy exit
									clauses. Increase after an year
								</p>
							</div>
						</div>
					</div>
				</div>
				<br />
				<Divider className={OnboardStyleModule.midDivider} />
				<div className={OnboardStyleModule.partOne}>
					<div className={OnboardStyleModule.hrFieldLeftPane}>
						<h3>Team Members</h3>
						<p>Please provide the necessary details</p>
						<div className={OnboardStyleModule.formPanelAction}>
							<button
								// style={{
								// 	cursor: type === SubmitType.SUBMIT ? 'no-drop' : 'pointer',
								// }}
								// disabled={type === SubmitType.SUBMIT}
								className={OnboardStyleModule.btnPrimary}
								// onClick={handleSubmit(hrSubmitHandler)}
							>
								Add More Team Member
							</button>
						</div>
					</div>
					<div className={OnboardStyleModule.hrFieldRightPane}>
						<div className={OnboardStyleModule.row}>
							{[1, 2].map((item) => {
								return (
									<div className={OnboardStyleModule.colMd6}>
										<div className={OnboardStyleModule.Card}>
											<div className={OnboardStyleModule.CardBody}>
												<div className={OnboardStyleModule.partWise}>
													<div>
														<div className={OnboardStyleModule.companyName}>
															<span
																style={{
																	color: '#7C7C7C',
																}}>
																Name:
															</span>
															&nbsp;&nbsp;
															<span
																style={{
																	fontWeight: '400',
																}}>
																Rachel Green
															</span>
														</div>
														<div className={OnboardStyleModule.companyName}>
															<span
																style={{
																	color: '#7C7C7C',
																}}>
																Designation:
															</span>
															&nbsp;&nbsp;
															<span
																style={{
																	fontWeight: '400',
																}}>
																Front End Developer
															</span>
														</div>
														<div className={OnboardStyleModule.companyName}>
															<span
																style={{
																	color: '#7C7C7C',
																}}>
																Reporting To:
															</span>
															&nbsp;&nbsp;
															<span
																style={{
																	fontWeight: '400',
																}}>
																Fredrik Champ
															</span>
														</div>
														<div className={OnboardStyleModule.companyName}>
															<span
																style={{
																	color: '#7C7C7C',
																}}>
																Linkedin:
															</span>
															&nbsp;&nbsp;
															<span
																style={{
																	fontWeight: '400',
																}}>
																Rachel Green
															</span>
															&nbsp;&nbsp;
															<a
																// href={}
																target="_blank"
																rel="noreferrer">
																<AiFillLinkedin
																	style={{
																		color: '#006699',
																		fontSize: '14px',
																	}}
																/>
															</a>
														</div>
														<div className={OnboardStyleModule.companyName}>
															<span
																style={{
																	color: '#7C7C7C',
																}}>
																Email:
															</span>
															&nbsp;&nbsp;
															<span
																style={{
																	fontWeight: '400',
																}}>
																rachelgreen455@gmail.com
															</span>
														</div>
														<div className={OnboardStyleModule.companyName}>
															<span
																style={{
																	color: '#7C7C7C',
																}}>
																Buddy:
															</span>
															&nbsp;&nbsp;
															<span
																style={{
																	fontWeight: '400',
																}}>
																Monica Geller
															</span>
														</div>
													</div>
													<div style={{ cursor: 'pointer' }}>
														<Dropdown
															trigger={['click']}
															placement="bottom"
															overlay={
																<Menu>
																	<Menu.Item
																		key={0}
																		/* onClick={() => {
																setProfileLogModal(true);
																setTalentIndex(listIndex);
															}} */
																	>
																		Edit Details
																	</Menu.Item>
																	<Divider
																		style={{
																			margin: '3px 0',
																		}}
																	/>
																	<Menu.Item key={1}>Remove Profile</Menu.Item>
																</Menu>
															}>
															<BsThreeDots
																style={{
																	fontSize: '1.5rem',
																}}
															/>
														</Dropdown>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
				<Divider className={OnboardStyleModule.midDivider} />
				<div className={OnboardStyleModule.partOne}>
					<div className={OnboardStyleModule.hrFieldLeftPane}>
						<h3>Device Policies</h3>
					</div>
					<div className={OnboardStyleModule.hrFieldRightPane}>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd12}>
								<div className={OnboardStyleModule.radioFormGroup}>
									<Radio.Group
										className={OnboardStyleModule.radioGroup}
										onChange={onChange}
										value={value}>
										<Radio value={1}>
											Does the client have experience of hiring remotely?
										</Radio>
										<Radio value={2}>
											Client to buy a device and Uplers to Facilitate.
										</Radio>
										<Radio value={3}>
											Client can use remote desktop sercurity option facilitated
											by Uplers (At additional cost of $100 per month).
										</Radio>
										<Radio value={4}>Add This Later.</Radio>
									</Radio.Group>
								</div>
								{showTextBox && (
									<HRInputField
										isTextArea={true}
										register={register}
										errors={errors}
										name="specialFeedback"
										type={InputType.TEXT}
										placeholder="Specify standard specifications, if any..."
									/>
								)}
							</div>
						</div>
					</div>
				</div>
				<Divider className={OnboardStyleModule.midDivider} />
				<div className={OnboardStyleModule.partOne}>
					<div className={OnboardStyleModule.hrFieldLeftPane}>
						<h3>Expectation from Talent</h3>
						<p>Please provide the necessary details</p>
					</div>
					<div className={OnboardStyleModule.hrFieldRightPane}>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd12}>
								<HRInputField
									isTextArea={true}
									register={register}
									errors={errors}
									label="First Week"
									name="firstWeek"
									type={InputType.TEXT}
									placeholder="Please specify the expectations"
								/>
							</div>
						</div>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd12}>
								<HRInputField
									isTextArea={true}
									register={register}
									errors={errors}
									label="First Month"
									name="firstMonth"
									type={InputType.TEXT}
									placeholder="Please specify the expectations"
								/>
							</div>
						</div>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd12}>
								<HRInputField
									isTextArea={true}
									register={register}
									errors={errors}
									label="Additional Information"
									name="additionalInformation"
									type={InputType.TEXT}
									placeholder="Please Enter"
								/>
							</div>
						</div>
					</div>
				</div>
				<Divider className={OnboardStyleModule.midDivider} />
				<div className={OnboardStyleModule.partOne}>
					<div className={OnboardStyleModule.hrFieldLeftPane}></div>
					<div className={OnboardStyleModule.hrFieldRightPane}>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									required
									errors={errors}
									validationSchema={{
										required: 'Please enter leave policies.',
									}}
									label={'Leave Polices'}
									register={register}
									name="leavePolicies"
									type={InputType.TEXT}
									placeholder="Specify standard specifications, if any..."
								/>
							</div>
							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									required
									trailingIcon={<EditSVG />}
									label="Exit Policy"
									register={register}
									validationSchema={{
										required: 'Please enter exit policies.',
									}}
									errors={errors}
									name="exitPolicies"
									type={InputType.TEXT}
									placeholder="Specify standard specifications, if any..."
								/>
							</div>
						</div>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd12}>
								<HRInputField
									trailingIcon={<EditSVG />}
									required
									label={'Feedback Process '}
									register={register}
									validationSchema={{
										required: 'Please enter feedback process.',
									}}
									errors={errors}
									name="specialFeedback"
									type={InputType.TEXT}
									placeholder="Specify standard specifications, if any..."
								/>
							</div>
						</div>
					</div>
				</div>
			</form>

			<Divider className={OnboardStyleModule.midDivider} />

			<div className={OnboardStyleModule.partOne}>
				<div className={OnboardStyleModule.hrFieldLeftPane}></div>
				<div className={OnboardStyleModule.hrFieldRightPane}>
					<div className={OnboardStyleModule.formPanelAction}>
						<button
							// style={{
							// 	cursor: id !== 0 ? 'no-drop' : 'pointer',
							// }}
							// disabled={id !== 0 && true}
							className={OnboardStyleModule.btnPrimary}
							onClick={handleSubmit(onboardSubmitHandler)}>
							Submit
						</button>

						<button
							// onClick={() => navigate(UTSRoutes.USERLISTROUTE)}
							className={OnboardStyleModule.btn}>
							Save as Draft
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OnboardField;
