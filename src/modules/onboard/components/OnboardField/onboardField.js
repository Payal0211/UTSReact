import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import OnboardStyleModule from './onboardField.module.css';
import { useForm } from 'react-hook-form';
import { InputType } from 'constants/application';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { Divider, Dropdown, Menu, Radio } from 'antd';
import UploadModal from 'shared/components/uploadModal/uploadModal';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as EditSVG } from 'assets/svg/edit.svg';
import { ReactComponent as TimeDropDownSVG } from 'assets/svg/timeDropdown.svg';
import { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { AiFillLinkedin } from 'react-icons/ai';
const OnboardField = () => {
	const [value, setRadioValue] = useState(1);
	const [showTextBox, setTextBox] = useState(true);

	const {
		watch,
		register,
		handleSubmit,
		setValue,
		getValues,
		setError,
		// control,
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
									// value={id !== 0 ? userDetails?.employeeId : null}
									// disabled={id !== 0 && true}
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
										options={[]}
										name="contractType"
										isError={errors['contractType'] && errors['contractType']}
										required
										errorMsg={'Please select contract type'}
									/>
								</div>
							</div>
							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the contract duration',
									}}
									label="Contract Duration (Months)"
									name="contractDuration"
									type={InputType.TEXT}
									placeholder="Enter contract duration"
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
										required: 'Please enter start date',
									}}
									label={'Contract Start & End Date'}
									name="startDate"
									type={InputType.TEXT}
									placeholder="Start Date"
									required
									trailingIcon={<CalenderSVG />}
								/>
							</div>

							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the end date',
									}}
									label=" "
									name="endDate"
									type={InputType.TEXT}
									placeholder="End Date"
									trailingIcon={<CalenderSVG />}
									// required
								/>
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
										options={[]}
										name="timeZone"
										isError={errors['timeZone'] && errors['timeZone']}
										required
										errorMsg={'Please select timezone'}
									/>
								</div>
							</div>
						</div>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'Please enter start time',
									}}
									label={'Talent Shift Start & End Time'}
									name="shiftStartTime"
									type={InputType.TEXT}
									placeholder="Start Time"
									required
									trailingIcon={<TimeDropDownSVG />}
								/>
							</div>

							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the end time',
									}}
									label=" "
									name="shiftEndTime"
									type={InputType.TEXT}
									placeholder="End Time"
									trailingIcon={<TimeDropDownSVG />}
									// required
								/>
							</div>
						</div>
						<div className={OnboardStyleModule.row}>
							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'Please enter onboarding date',
									}}
									label={'Talent Onboarding Date'}
									name="talentOnboardingDate"
									type={InputType.TEXT}
									placeholder="Select Onboarding Date "
									required
									trailingIcon={<CalenderSVG />}
								/>
							</div>
							<div className={OnboardStyleModule.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the talent full name',
									}}
									label="Talent Onboarding Time"
									name="talentOnboardingTime"
									type={InputType.TEXT}
									placeholder="Select Onboarding Time"
									required
									trailingIcon={<CalenderSVG />}
								/>
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
										label={'Net Payment Days'}
										defaultValue={'Enter Number of Days'}
										options={[]}
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
									label={'Leave Polices'}
									register={register}
									errors={errors}
									name="specialFeedback"
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
									errors={errors}
									name="specialFeedback"
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
							// onClick={handleSubmit(hrSubmitHandler)}
						>
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
