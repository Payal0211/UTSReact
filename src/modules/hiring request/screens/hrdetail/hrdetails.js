import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Skeleton, Tooltip, Modal, DatePicker,TimePicker, Tabs, Dropdown, Menu } from 'antd';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import HRDetailStyle from './hrdetail.module.css';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { ReactComponent as PowerSVG } from 'assets/svg/power.svg';
import UTSRoutes from 'constants/routes';
import { HTTPStatusCode } from 'constants/network';
import WithLoader from 'shared/components/loader/loader';
// import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';


// import { useForm } from 'react-hook-form';

// import HRInputField from '../hrInputFields/hrInputFields';

// import { InputType } from 'constants/application';

import { ReactComponent as GeneralInformationSVG } from 'assets/svg/generalInformation.svg';
import { ReactComponent as DownloadJDSVG } from 'assets/svg/downloadJD.svg';
import { ReactComponent as HireingRequestDetailSVG } from 'assets/svg/HireingRequestDetail.svg';
import { ReactComponent as CurrentHrsSVG } from 'assets/svg/CurrentHrs.svg';
import { ReactComponent as TelentDetailSVG } from 'assets/svg/TelentDetail.svg';
import { ReactComponent as AssignCurrectSVG } from 'assets/svg/assignCurrentRight.svg';
import { ReactComponent as EditFieldSVG } from 'assets/svg/EditField.svg';
import { ReactComponent as AboutCompanySVG } from 'assets/svg/aboutCompany.svg';
import { ReactComponent as ClientTeamMemberSVG } from 'assets/svg/clientTeammember.svg';
import { ReactComponent as LinkedinClientSVG } from 'assets/svg/LinkedinClient.svg';
import { ReactComponent as DuringLegalSVG } from 'assets/svg/duringLegal.svg';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import { ReactComponent as BeforeKickOffSVG } from 'assets/svg/beforeKickOff.svg';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as AfterKickOffSVG } from 'assets/svg/AfterKickOff.svg';
import { ReactComponent as ClockIconSVG } from 'assets/svg/TimeStartEnd.svg';


import { HRDeleteType, HiringRequestHRStatus, InputType } from 'constants/application';

import { UserSessionManagementController } from 'modules/user/services/user_session_services';

import CloseHRModal from '../../components/closeHRModal/closeHRModal';
import CloneHR from 'modules/hiring request/components/cloneHR/cloneHR';
import CTASlot1 from 'modules/hiring request/components/CTASlot1/CTASlot1';
import CTASlot2 from 'modules/hiring request/components/CTASlot2/CTASlot2';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { Controller, useForm } from 'react-hook-form';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import TextEditor from 'shared/components/textEditor/textEditor';
import { BsThreeDots } from 'react-icons/bs';

/** Lazy Loading the component */

const NextActionItem = React.lazy(() =>
	import('modules/hiring request/components/nextAction/nextAction.js'),
);
const CompanyProfileCard = React.lazy(() =>
	import('modules/hiring request/components/companyProfile/companyProfileCard'),
);
const TalentProfileCard = React.lazy(() =>
	import('modules/hiring request/components/talentProfile/talentProfileCard'),
);
const ActivityFeed = React.lazy(() =>
	import('modules/hiring request/components/activityFeed/activityFeed'),
);

const HRDetailScreen = () => {
	// const [deleteModal, setDeleteModal] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [apiData, setAPIdata] = useState([]);
	const navigate = useNavigate();
	const switchLocation = useLocation();
	// const [deleteReason, setDeleteReason] = useState([]);
	const [callHRapi, setHRapiCall] = useState(false);

	const [editDebrifing, setEditDebring] = useState([]);

	const [closeHrModal, setCloseHrModal] = useState(false);

	const {
		watch,
		register,
		setValue,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({});

	let urlSplitter = `${switchLocation.pathname.split('/')[2]}`;
	const updatedSplitter = 'HR' + apiData && apiData?.ClientDetail?.HR_Number;
	const miscData = UserSessionManagementController.getUserSession();

	const callAPI = useCallback(
		async (hrid) => {
			setLoading(true);
			let response = await hiringRequestDAO.getViewHiringRequestDAO(hrid);
			if (response.statusCode === HTTPStatusCode.OK) {
				setAPIdata(response && response?.responseBody);
				setLoading(false);
			} else if (response.statusCode === HTTPStatusCode.NOT_FOUND) {
				navigate(UTSRoutes.PAGENOTFOUNDROUTE);
			}
		},
		[navigate],
	);

	// console.log(apiData, '--apiData-');
	// const clientOnLossSubmitHandler = useCallback(
	// 	async (d) => {
	// 		_isNull(watch('hrDeleteLossReason')) &&
	// 			setError('hrDeleteLossReason', 'Please select loss reason.');

	// 		_isNull(watch('hrDeleteLossRemark')) &&
	// 			setError('hrDeleteLossRemark', 'Please enter loss remark');

	// 		let deleteObj = {
	// 			id: urlSplitter?.split('HR')[0],
	// 			deleteType: HRDeleteType.LOSS,
	// 			reasonId: watch('hrDeleteLossReason').id,
	// 			otherReason: _isNull(watch('hrLossDeleteOtherReason'))
	// 				? ''
	// 				: watch('hrLossDeleteOtherReason'),
	// 			reason: watch('hrDeleteLossReason').value,
	// 			remark: watch('hrDeleteLossRemark'),
	// 			onBoardId: 0,
	// 		};

	// 		let deletedResponse = await hiringRequestDAO.deleteHRDAO(deleteObj);
	// 		if (deletedResponse && deletedResponse.statusCode === HTTPStatusCode.OK) {
	// 			navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
	// 		}
	// 	},
	// 	[navigate, setError, urlSplitter, watch],
	// );

	const AMAssignmentHandler = useCallback(() => {});

	// const clientOnHoldSubmitHandler = useCallback(
	// 	async (d) => {
	// 		let deleteObj = {
	// 			id: urlSplitter?.split('HR')[0],
	// 			deleteType: HRDeleteType.ON_HOLD,
	// 			reasonId: d.hrDeleteReason.id,
	// 			otherReason: d.hrDeleteOtherReason,
	// 			reason: d.hrDeleteReason.value,
	// 			remark: d.hrDeleteRemark,
	// 			onBoardId: 0,
	// 		};

	// 		let deletedResponse = await hiringRequestDAO.deleteHRDAO(deleteObj);
	// 		if (deletedResponse && deletedResponse.statusCode === HTTPStatusCode.OK) {
	// 			navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
	// 		}
	// 	},
	// 	[navigate, urlSplitter],
	// );

	// const getHRDeleteReason = useCallback(async () => {
	// 	let response = await MasterDAO.getHRDeletReasonRequestDAO();
	// 	setDeleteReason(response && response?.responseBody?.details);
	// }, []);

	// console.log(apiData, '-apiData');

	/**  Put ON HOLD * */

	// const updateODRPoolStatusHandler = useCallback(
	// 	async (data) => {
	// 		await hiringRequestDAO.updateODRPOOLStatusRequestDAO(data);

	// 		callAPI(urlSplitter?.split('HR')[0]);
	// 	},
	// 	[callAPI, urlSplitter],
	// );

	useEffect(() => {
		setLoading(true);
		callAPI(urlSplitter?.split('HR')[0]);
	}, [urlSplitter, callAPI, callHRapi]);

	useEffect(() => {
		const data = apiData?.hr_CTA?.filter((item) => item.key === 'DebriefingHR');
		setEditDebring(data);
	}, [apiData]);
console.log('apiData', apiData)

	const [assignAMData, setAssignAMData] = useState(false);

	return (
		<WithLoader
			showLoader={isLoading}
			className="mainLoader">
			<div className={HRDetailStyle.hiringRequestContainer}>
				<Link
					className={HRDetailStyle.hrback}
					to={UTSRoutes.ALLHIRINGREQUESTROUTE}>
					<div className={HRDetailStyle.goback}>
						<ArrowLeftSVG style={{ width: '16px' }} />
						<span>Go Back</span>
					</div>
				</Link>
				<div className={HRDetailStyle.hrDetails}>
					<div className={HRDetailStyle.hrDetailsLeftPart}>
						<div className={HRDetailStyle.hiringRequestIdSets}>
							{updatedSplitter}
						</div>
						{All_Hiring_Request_Utils.GETHRSTATUS(
							apiData?.HRStatusCode,
							apiData?.HRStatus,
						)}
						{apiData && (
							<div className={HRDetailStyle.hiringRequestPriority}>
								{All_Hiring_Request_Utils.GETHRPRIORITY(
									apiData?.StarMarkedStatusCode,
								)}
							</div>
						)}
						{/** ----Clone HR */}
						{apiData?.dynamicCTA?.CloneHR && (
							<CloneHR
								updatedSplitter={updatedSplitter}
								cloneHR={apiData?.dynamicCTA?.CloneHR}
							/>
						)}
					</div>

					{apiData?.HRStatusCode === HiringRequestHRStatus.CANCELLED ? null : (
						<div className={HRDetailStyle.hrDetailsRightPart}>
							<button onClick={() => setAssignAMData(true)} className={HRDetailStyle.primaryButton}>Assign AM</button>

							<Modal
								transitionName=""
								className="assignAMModal"
								centered
								open={assignAMData}
								width="1256px"
								footer={null}
								onCancel={() => {
									// setIsLoading(false);
									setAssignAMData(false);
								}}>
								<div className={HRDetailStyle.modalInnerWrapper}>
									<div className={HRDetailStyle.onbordingAssignMsgMain}>
										<div className={HRDetailStyle.onbordingAssignMsg}>
											<div className={HRDetailStyle.onbordingCurrentImg}>
												<AssignCurrectSVG width="24" height="24" />
											</div>
											Mukul Gupta assigned as an AM for HR587346725623
										</div>
									</div>
									

									<div className={HRDetailStyle.modalLabel}>Onboarding Process</div>
									<div className={HRDetailStyle.modalLabelMsg}>Kindly provide the required information for pre-onboarding in the AM handover process.</div>

									{/* HTML Code Starts for Modal - Before Pre-Onboarding */}
									<Tabs
										// onChange={(e) => setTitle(e)}
										defaultActiveKey="1"
										// activeKey={title}
										animated={true}
										tabBarGutter={50}
										tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
										items={[
											{
												label: 'Before Pre-Onboarding',
												key: 'Before Pre-Onboarding',
												children: (
													<div className={HRDetailStyle.onboardingProcesswrap}>
														<div className={HRDetailStyle.onboardingProcesspart}>
															<div className={HRDetailStyle.onboardingProcesBox}>
																<div className={HRDetailStyle.onboardingProcessLeft}>
																	<div><GeneralInformationSVG width="27" height="32" /></div>
																	<h3 className={HRDetailStyle.titleLeft}>General Information</h3>
																</div>

																<div className={HRDetailStyle.onboardingProcessMid}>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Company Name</span>
																		<span className={HRDetailStyle.onboardingTextBold}>Sun Pharma</span>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Client Email/Name</span>
																		<span className={HRDetailStyle.onboardingTextBold}>Sun Pharma</span>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>HR ID</span>
																		<a target="_blank" href="#" rel="noreferrer" className={HRDetailStyle.onboardingTextUnderline}>HR2894387538734</a>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Country</span>
																		<span className={HRDetailStyle.onboardingTextBold}>Australia</span>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>No. of Employees</span>
																		<span className={HRDetailStyle.onboardingTextBold}>500</span>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Client POC Name</span>
																		<span className={HRDetailStyle.onboardingTextBold}>Darshana Sangha</span>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Client POC Email</span>
																		<span className={HRDetailStyle.onboardingTextBold}>mohitshukla@gmail.com</span>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Industry</span>
																		<span className={HRDetailStyle.onboardingTextBold}>Pharmaceutical </span>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Discovery Call Link</span>
																		<a target="_blank" href="#" rel="noreferrer" className={HRDetailStyle.onboardingTextUnderline}>//https/zoom.us/kjrngwbrnviwbviru</a>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Interview Link</span>
																		<a target="_blank" href="#" rel="noreferrer" className={HRDetailStyle.onboardingTextUnderline}>//https/zoom.us/kjrngwbrnviwbviru </a>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Job Description</span>
																		<button className={HRDetailStyle.onboardingDownload}><DownloadJDSVG/>Download JD</button>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>AM Name</span>
																		<span className={HRDetailStyle.onboardingTextBold}>Swarna Sathe </span>
																	</div>

																	<div className={HRDetailStyle.modalFormWrapper}>
																		<div className={HRDetailStyle.modalFormCol}>
																				<HRSelectField
																					isControlled={true}
																					mode="id/value"
																					setValue={setValue}
																					register={register}
																					label={'Deal Owner'}
																					defaultValue={'Select Deal Source'}
																					name="Mode of Working"
																					isError={errors['departMent'] && errors['departMent']}
																					required
																					errorMsg={'Please select department'}
																				/>
																		</div>

																		<div className={HRDetailStyle.modalFormCol}>
																				<HRSelectField
																					isControlled={true}
																					mode="id/value"
																					setValue={setValue}
																					register={register}
																					label={'Deal Source'}
																					defaultValue={'Select Deal Source'}
																					name="Mode of Working"
																					isError={errors['departMent'] && errors['departMent']}
																					required
																					errorMsg={'Please select department'}
																				/>
																		</div>

																	</div>

																	<div className={HRDetailStyle.onboardingCondition}>
																		<h5>Is this an Existing Client?</h5>

																		<label className={HRDetailStyle.radioCheck_Mark}>
																			<p>Yes</p>
																			<input
																				// {...register('remote')}
																				value={0}
																				type="radio"
																				// checked={checkednoValue}
																				// onChange={(e) => {
																				// 	checkedNo(e);
																				// }}
																				id="remote"
																				name="remote"
																			/>
																			<span className={HRDetailStyle.customCheck_Mark}></span>
																		</label>
																		<label className={HRDetailStyle.radioCheck_Mark}>
																			<p>No</p>
																			<input
																				// {...register('remote')}
																				value={0}
																				type="radio"
																				// checked={checkednoValue}
																				// onChange={(e) => {
																				// 	checkedNo(e);
																				// }}
																				id="remote"
																				name="remote"
																			/>
																			<span className={HRDetailStyle.customCheck_Mark}></span>
																		</label>

																	</div>

																</div>
															</div>

															<div className={HRDetailStyle.onboardingProcesBox}>
																<div className={HRDetailStyle.onboardingProcessLeft}>
																	<div><HireingRequestDetailSVG width="27" height="32" /></div>
																	<h3 className={HRDetailStyle.titleLeft}>Hiring Request Details</h3>
																</div>
																<div className={HRDetailStyle.onboardingProcessMid}>
																	<div className={HRDetailStyle.modalFormWrapper}>
																		<div className={HRDetailStyle.modalFormCol}>
																			<HRInputField
																				register={register}
																				// errors={errors}
																				label="Payment Net Term"
																				name="90 Days"
																				type={InputType.TEXT}
																				placeholder="90 Days"
																				value="90 Days"
																				required
																				disabled
																				trailingIcon= {<EditFieldSVG width="16" height="16" />}
																			/>
																		</div>
																		<div className={HRDetailStyle.modalFormCol}>
																			<HRInputField
																				register={register}
																				// errors={errors}
																				label="Pay Rate"
																				name="Pay"
																				type={InputType.TEXT}
																				placeholder="USD 4000/Month"
																				value="USD 4000/Month"
																				disabled
																				trailingIcon= {<EditFieldSVG width="16" height="16" />}
																			/>
																		</div>
																		<div className={HRDetailStyle.modalFormCol}>
																			<HRInputField
																				register={register}
																				// errors={errors}
																				label="Bill Rate"
																				name="Pay"
																				type={InputType.TEXT}
																				placeholder="USD 4000/Month"
																				value="USD 4000/Month"
																				disabled
																				trailingIcon= {<EditFieldSVG width="16" height="16" />}
																			/>
																		</div>
																		<div className={HRDetailStyle.modalFormCol}>
																			<HRInputField
																				register={register}
																				// errors={errors}
																				label="UTS HR Accepted by"
																				name="Pay"
																				type={InputType.TEXT}
																				placeholder="Sakshi Shukla"
																				value="Sakshi Shukla"
																				disabled
																				trailingIcon= {<EditFieldSVG width="16" height="16" />}
																			/>
																		</div>
																	</div>

																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>NR Percentage</span>
																		<span className={HRDetailStyle.onboardingTextBold}>15%</span>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Role Title</span>
																		<span className={HRDetailStyle.onboardingTextBold}>Website Developer</span>
																	</div>


																	<div className={HRDetailStyle.onboardingCondition}>
																		<h5>Workforce Management:</h5>

																		<label className={HRDetailStyle.radioCheck_Mark}>
																			<p>Remote</p>
																			<input
																				// {...register('remote')}
																				value={0}
																				type="radio"
																				// checked={checkednoValue}
																				// onChange={(e) => {
																				// 	checkedNo(e);
																				// }}
																				id="remote"
																				name="remote"
																			/>
																			<span className={HRDetailStyle.customCheck_Mark}></span>
																		</label>
																		<label className={HRDetailStyle.radioCheck_Mark}>
																			<p>On-Site</p>
																			<input
																				// {...register('remote')}
																				value={0}
																				type="radio"
																				// checked={checkednoValue}
																				// onChange={(e) => {
																				// 	checkedNo(e);
																				// }}
																				id="remote"
																				name="remote"
																			/>
																			<span className={HRDetailStyle.customCheck_Mark}></span>
																		</label>

																	</div>
																</div>
															</div>

															<div className={HRDetailStyle.onboardingProcesBox}>
																<div className={HRDetailStyle.onboardingProcessLeft}>
																	<div><CurrentHrsSVG width="27" height="32" /></div>
																	<h3 className={HRDetailStyle.titleLeft}>Current HRs</h3>
																</div>
																<div className={HRDetailStyle.onboardingProcessMid}>
																	<div className={HRDetailStyle.modalFormWrapper}>
																		<div className={HRDetailStyle.modalFormCol}>
																			<div className={HRDetailStyle.onboardingCurrentTextWrap}>
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Open HR ID :</span>
																					<a target="_blank" href="#" rel="noreferrer" className={HRDetailStyle.onboardingTextUnderline}>HR90698453085</a>
																				</div>
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Open HR Status :</span>
																					<span className={HRDetailStyle.onboardingTextBold}>In Process</span>
																				</div>
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Open TR of HR :</span>
																					<span className={HRDetailStyle.onboardingTextBold}>2</span>
																				</div>
																			</div>
																		</div>
																		<div className={HRDetailStyle.modalFormCol}>
																			<div className={HRDetailStyle.onboardingCurrentTextWrap}>
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Open HR ID :</span>
																					<a target="_blank" href="#" rel="noreferrer" className={HRDetailStyle.onboardingTextUnderline}>HR90698453085</a>
																				</div>
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Open HR Status :</span>
																					<span className={HRDetailStyle.onboardingTextBold}>In Interview</span>
																				</div>
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Open TR of HR :</span>
																					<span className={HRDetailStyle.onboardingTextBold}>4</span>
																				</div>
																			</div>
																		</div>
																	</div>

																</div>
															</div>

															<div className={HRDetailStyle.onboardingProcesBox}>
																<div className={HRDetailStyle.onboardingProcessLeft}>
																	<div><TelentDetailSVG width="27" height="32" /></div>
																	<h3 className={HRDetailStyle.titleLeft}>Talent Details</h3>
																</div>
																<div className={HRDetailStyle.onboardingProcessMid}>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Talent Name</span>
																		<span className={HRDetailStyle.onboardingTextBold}>Aravind Rai</span>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Talent Designation</span>
																		<span className={HRDetailStyle.onboardingTextBold}>Web Developer</span>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Talent Shift Start/End Time</span>
																		<span className={HRDetailStyle.onboardingTextBold}>9:00 AM IST - 5:00 PM IST</span>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>SC Name</span>
																		<span className={HRDetailStyle.onboardingTextBold}>Aaloak Mangat</span>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>POD Manager Name</span>
																		<span className={HRDetailStyle.onboardingTextBold}>Aruna Bera</span>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Talent Profile Link</span>
																		<a target="_blank" href="#" rel="noreferrer" className={HRDetailStyle.onboardingTextUnderline}>//https/zoom.us/kjrngwbrnviwbviru</a>
																	</div>
																	<div className={HRDetailStyle.onboardingDetailText}>
																		<span>Availability</span>
																		<span className={HRDetailStyle.onboardingTextBold}>Part-Time</span>
																	</div>
																</div>
															</div>
														</div>

														<div className={HRDetailStyle.formPanelAction}>
															<button type="submit" className={HRDetailStyle.btnPrimary}>Complete AM Assignment</button>
														</div>
													</div>
												),
											},
											{
												label: 'During Pre-Onboarding',
												key: 'During Pre-Onboarding',
												children: (
													<div className={HRDetailStyle.onboardingProcesswrap}>
														<div className={HRDetailStyle.onboardingProcesspart}>
															<div className={HRDetailStyle.onboardingProcesBox}>
																<div className={HRDetailStyle.onboardingProcessLeft}>
																	<div><GeneralInformationSVG width="27" height="32" /></div>
																	<h3 className={HRDetailStyle.titleLeft}>Invoicing and Contract</h3>
																</div>

																<div className={HRDetailStyle.onboardingProcessMid}>
																	<div className={HRDetailStyle.onboardingFormAlign}>
																		<div className={HRDetailStyle.modalFormWrapper}>
																			<div className={HRDetailStyle.modalFormCol}>
																				<HRInputField
																					register={register}
																					errors={errors}
																					validationSchema={{
																						required: 'please enter the company name.',
																					}}
																					label="Invoice Raising to"
																					name="EnterName"
																					type={InputType.TEXT}
																					placeholder="Enter Name"
																					required
																				/>
																			</div>

																			<div className={HRDetailStyle.modalFormCol}>
																				<HRInputField
																					register={register}
																					errors={errors}
																					validationSchema={{
																						required: 'please enter the company name.',
																					}}
																					label="Invoice Raising to Email"
																					name="EnterEmail"
																					type={InputType.TEXT}
																					placeholder="Enter Email"
																					required
																				/>
																			</div>

																			<div className={HRDetailStyle.modalFormCol}>
																				<HRInputField
																						register={register}
																						// errors={errors}
																						label="UTS Contract Duration (In Months)"
																						name="Months"
																						type={InputType.TEXT}
																						placeholder="6 Months"
																						value="6 Months"
																						disabled
																						trailingIcon= {<EditFieldSVG width="16" height="16" />}
																				/>
																			</div>

																			<div className={HRDetailStyle.modalFormCol}>
																				<div className={HRDetailStyle.onboardingDetailText}>
																					<span>BDR/MDR Name</span>
																					<span className={HRDetailStyle.onboardingTextBold}>Rahul Dhaliwal</span>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</div>

															<div className={HRDetailStyle.onboardingProcesBox}>
																<div className={HRDetailStyle.onboardingProcessLeft}>
																	<div><AboutCompanySVG width="30" height="32" /></div>
																	<h3 className={HRDetailStyle.titleLeft}>About Company</h3>
																</div>
																<div className={HRDetailStyle.onboardingProcessMid}>
																	<div className={HRDetailStyle.modalFormWrapper}>
																		<div className={HRDetailStyle.colMd12}>
																			<HRInputField
																				required
																				isTextArea={true}
																				// errors={errors}
																				className="TextAreaCustom"
																				label={'A Bit about company culture '}
																				register={register}
																				name="aboutCompany"
																				type={InputType.TEXT}
																				placeholder="Enter here"
																			/>
																		</div>

																		<div className={HRDetailStyle.colMd12}>
																			<HRInputField
																				required
																				isTextArea={true}
																				// errors={errors}
																				label={'How does the first week look like'}
																				register={register}
																				name="aboutCompany"
																				type={InputType.TEXT}
																				placeholder="Enter here"
																			/>
																		</div>

																		<div className={HRDetailStyle.colMd12}>
																			<HRInputField
																				required
																				isTextArea={true}
																				// errors={errors}
																				label={'How does the first month look like'}
																				register={register}
																				name="aboutCompany"
																				type={InputType.TEXT}
																				placeholder="Enter here"
																			/>
																		</div>

																		<div className={HRDetailStyle.colMd12}>
																			<HRSelectField
																				isControlled={true}
																				mode="id/value"
																				setValue={setValue}
																				register={register}
																				label={'Softwares & Tools Required'}
																				// defaultValue={'Enter Softwares and Tools which will be required'}
																				placeholder={'Enter Softwares and Tools which will be required'}
																				name="Mode of Working"
																				isError={errors['departMent'] && errors['departMent']}
																				required
																				errorMsg={'Please select department'}
																			/>
																		</div>

																		<div className={HRDetailStyle.colMd12}>
																			<HRSelectField
																				isControlled={true}
																				mode="id/value"
																				setValue={setValue}
																				register={register}
																				label={'Device Policy'}
																				// defaultValue={'Enter Device Policy'}
																				placeholder={'Enter Device Policy'}
																				name="Mode of Working"
																				isError={errors['departMent'] && errors['departMent']}
																				required
																				errorMsg={'Please select department'}
																			/>
																		</div>

																		<div className={HRDetailStyle.modalFormCol}>
																			<div className={HRDetailStyle.modalFormLeaveUnderLine}>
																				<HRSelectField
																					isControlled={true}
																					mode="id/value"
																					setValue={setValue}
																					register={register}
																					className="leavePolicylabel"
																					label={'Leave Polices'}
																					defaultValue={'Proceed with Uplers Policies'}
																					name="Mode of Working"
																					isError={errors['departMent'] && errors['departMent']}
																					required
																					errorMsg={'Please select department'}
																				/>
																			</div>
																		</div>
																		
																		<div className={HRDetailStyle.modalFormCol}>
																			<div className={HRDetailStyle.modalFormEdited}>
																				<HRInputField
																					register={register}
																					// errors={errors}
																					label="Exit Policy"
																					name="Pay"
																					type={InputType.TEXT}
																					placeholder="First Month"
																					value="First Month - 7 Days Second Month Onwards - 30 Days"
																					disabled
																					required
																					trailingIcon= {<EditFieldSVG width="16" height="16" />}
																				/>
																			</div>
																		</div>
																		<div className={HRDetailStyle.colMd12}>
																			<div className={HRDetailStyle.modalFormEdited}>
																				<HRInputField
																					register={register}
																					// errors={errors}
																					label="Feedback Process"
																					name="Pay"
																					type={InputType.TEXT}
																					placeholder="Weekly"
																					value="Weekly during the first 2 weeks | Fortnightly for the next 2 months | Monthly / Quarterly feedback thereafter"
																					disabled
																					required
																					trailingIcon= {<EditFieldSVG width="16" height="16" />}
																				/>
																			</div>
																		</div>
																	</div>

																</div>
															</div>
			
															<div className={HRDetailStyle.onboardingProcesBox}>
																<div className={HRDetailStyle.onboardingProcessLeft}>
																	<div><ClientTeamMemberSVG width="51" height="26" /></div>
																	<h3 className={HRDetailStyle.titleLeft}>Client’s Team Members</h3>
																	<div className={HRDetailStyle.modalBtnWrap}>
																		<button type="btn" className={HRDetailStyle.btnPrimary}>Add More</button>
																	</div>
																</div>

																<div className={HRDetailStyle.onboardingProcessMid}>
																	<div className={HRDetailStyle.modalFormWrapper}>
																		<div className={HRDetailStyle.modalFormCol}>
																			<div className={HRDetailStyle.onboardingCurrentTextWrap}>
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Name: </span>
																					<span className={HRDetailStyle.onboardingTextBold}>Rachel Green</span>
																				</div>
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Designation: </span>
																					<span className={HRDetailStyle.onboardingTextBold}>Front End Developer</span>
																				</div>
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Reporting To:</span>
																					<span className={HRDetailStyle.onboardingTextBold}>Fredrik Champ</span>
																				</div>
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>LinkedIn :</span>
																					<span className={HRDetailStyle.onboardingTextBold}> Rachel Green <LinkedinClientSVG width="16" height="16"/></span>
																				</div> 
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Email:</span>
																					<span className={HRDetailStyle.onboardingTextBold}> rachelgreen455@gmail.com</span>
																				</div> 
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Buddy:</span>
																					<span className={HRDetailStyle.onboardingTextBold}>Monica Geller</span>
																				</div>

																				<div className={HRDetailStyle.onboardingDotsDrop}>
																					{
																						<Dropdown
																							trigger={['click']}
																							placement="bottom"
																							getPopupContainer={trigger => trigger.parentElement}
																							overlay={
																								<Menu>
																									<Menu.Item key={0}>Edit Detail</Menu.Item>
																								</Menu>
																							}>
																							<BsThreeDots style={{ fontSize: '1.5rem' }} />
																						</Dropdown>
																					}
																				</div>
																			</div>
																		</div>
																		<div className={HRDetailStyle.modalFormCol}>
																			<div className={HRDetailStyle.onboardingCurrentTextWrap}>
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Name: </span>
																					<span className={HRDetailStyle.onboardingTextBold}>Rachel Green</span>
																				</div>
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Designation: </span>
																					<span className={HRDetailStyle.onboardingTextBold}>Front End Developer</span>
																				</div>
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Reporting To:</span>
																					<span className={HRDetailStyle.onboardingTextBold}>Fredrik Champ</span>
																				</div>
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>LinkedIn :</span>
																					<span className={HRDetailStyle.onboardingTextBold}> Rachel Green <LinkedinClientSVG width="16" height="16"/></span>
																				</div> 
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Email:</span>
																					<span className={HRDetailStyle.onboardingTextBold}> rachelgreen455@gmail.com</span>
																				</div> 
																				<div className={HRDetailStyle.onboardingCurrentText}>
																					<span>Buddy:</span>
																					<span className={HRDetailStyle.onboardingTextBold}>Monica Geller</span>
																				</div>

																				<div className={HRDetailStyle.onboardingDotsDrop}>
																					{
																						<Dropdown
																							trigger={['click']}
																							placement="bottom"
																							getPopupContainer={trigger => trigger.parentElement}
																							overlay={
																								<Menu>
																									<Menu.Item key={0}>Edit Detail</Menu.Item>
																								</Menu>
																							}>
																							<BsThreeDots style={{ fontSize: '1.5rem' }} />
																						</Dropdown>
																					}
																				</div>
																			</div>
																		</div>
																	</div>

																	<div className={HRDetailStyle.modalFormHide}>
																		<div className={HRDetailStyle.modalFormWrapper}>
																			<div className={HRDetailStyle.modalFormCol}>
																				<HRInputField
																					register={register}
																					errors={errors}
																					validationSchema={{
																						required: 'please enter the name.',
																					}}
																					label="Name"
																					name="EnterName"
																					type={InputType.TEXT}
																					placeholder="Enter Name"
																				/>
																			</div>
																			<div className={HRDetailStyle.modalFormCol}>
																				<HRInputField
																					register={register}
																					errors={errors}
																					validationSchema={{
																						required: 'please enter the Designation name.',
																					}}
																					label="Designation"
																					name="EnterDesignation"
																					type={InputType.TEXT}
																					placeholder="Enter Designation"
																				/>
																			</div>
																			<div className={HRDetailStyle.modalFormCol}>
																				<HRInputField
																					register={register}
																					errors={errors}
																					validationSchema={{
																						required: 'please enter the Reporting name.',
																					}}
																					label="Reporting to"
																					name="EnterName"
																					type={InputType.TEXT}
																					placeholder="Enter Name"
																				/>
																			</div>
																			<div className={HRDetailStyle.modalFormCol}>
																				<HRInputField
																					register={register}
																					errors={errors}
																					validationSchema={{
																						required: 'please enter the Link.',
																					}}
																					label="Linkedin"
																					name="Link"
																					type={InputType.TEXT}
																					placeholder="Enter Link"
																				/>
																			</div>
																			<div className={HRDetailStyle.modalFormCol}>
																				<HRInputField
																					register={register}
																					errors={errors}
																					validationSchema={{
																						required: 'please enter the Email.',
																					}}
																					label="Email"
																					name="Email"
																					type={InputType.TEXT}
																					placeholder="Enter Email"
																				/>
																			</div>
																			<div className={HRDetailStyle.modalFormCol}>
																				<HRInputField
																					register={register}
																					errors={errors}
																					validationSchema={{
																						required: 'please enter the Enter name.',
																					}}
																					label="Buddy"
																					name="EnterName"
																					type={InputType.TEXT}
																					placeholder="Enter Name"
																				/>
																			</div>

																			<div className={HRDetailStyle.modalFormCol}>
																				<div className={HRDetailStyle.modalBtnWrap}>
																					<button type="submit" className={HRDetailStyle.btnPrimary}>Save</button>
																					<button className={HRDetailStyle.btnPrimaryOutline}>Cancel</button>
																				</div>
																			</div>
																		</div>		
																	</div>		

																</div>
															</div>
														</div>

														<div className={HRDetailStyle.formPanelAction}>
															<button type="submit" className={HRDetailStyle.btnPrimary}>Complete Client Pre-Onboarding</button>
														</div>
													</div>
												),
											},

											{
												label: 'Complete Legal',
												key: 'Complete Legal',
												children: (
													<div className={HRDetailStyle.onboardingProcesswrap}>
														<div className={HRDetailStyle.onboardingProcesspart}>
															<div className={HRDetailStyle.onboardingProcesBox}>
																<div className={HRDetailStyle.onboardingProcessLeft}>
																	<div><DuringLegalSVG width="32" height="32" /></div>
																	<h3 className={HRDetailStyle.titleLeft}>During Legal</h3>
																</div>

																<div className={HRDetailStyle.onboardingProcessMid}>
																	<div className={HRDetailStyle.modalFormWrapper}>
																		<div className={HRDetailStyle.modalFormCol}>
																			<label className={HRDetailStyle.timeLabel}>MSA Sign Date <span className={HRDetailStyle.reqFieldRed}>*</span></label>
																			<div className={HRDetailStyle.timeSlotItem}>
																				<Controller
																					render={({ ...props }) => (
																						<DatePicker
																							// selected={watchFeedbackDate ? watchFeedbackDate : null}
																							placeholderText="Select Date"
																							onChange={(date) => {
																								setValue('feedBackDate', date);
																							}}
																							dateFormat="yyyy/MM/dd H:mm:ss"
																						/>
																					)}
																					name="Select Date"
																					rules={{ required: true }}
																					control={control}
																				/>
																				<CalenderSVG />
																			</div>
																		</div>

																		<div className={HRDetailStyle.modalFormCol}>
																			<label className={HRDetailStyle.timeLabel}>SOW Sign Date <span className={HRDetailStyle.reqFieldRed}>*</span></label>
																			<div className={HRDetailStyle.timeSlotItem}>
																				<Controller
																					render={({ ...props }) => (
																						<DatePicker
																							// selected={watchFeedbackDate ? watchFeedbackDate : null}
																							placeholderText="Select Date"
																							onChange={(date) => {
																								setValue('feedBackDate', date);
																							}}
																							dateFormat="yyyy/MM/dd H:mm:ss"
																						/>
																					)}
																					name="Select Date"
																					rules={{ required: true }}
																					control={control}
																				/>
																				<CalenderSVG />
																			</div>
																		</div>

																		<div className={HRDetailStyle.modalFormCol}>
																			<HRInputField
																				// disabled={jdURLLink}
																				register={register}
																				leadingIcon={<UploadSVG />}
																				label="SOW Document/Link"
																				name="Upload"
																				type={InputType.BUTTON}
																				buttonLabel="Upload Document or Add Link"
																				// placeholder="Upload Document or Add Link"
																				setValue={setValue}
																				// required={!jdURLLink && !getUploadFileData}
																				// onClickHandler={() => setUploadModal(true)}
																				validationSchema={{
																					required: 'please select a file.',
																				}}
																				errors={errors}
																			/>
																		</div>
																	</div>
																</div>

															</div>
														</div>

														<div className={HRDetailStyle.formPanelAction}>
															<button type="submit" className={HRDetailStyle.btnPrimary}>Complete Client Legal</button>
														</div>
													</div>
												),
											},

											{
												label: 'Before Kick-off',
												key: 'Before Kick-off',
												children: (
													<div className={HRDetailStyle.onboardingProcesswrap}>
														<div className={HRDetailStyle.onboardingProcesspart}>
															<div className={HRDetailStyle.onboardingProcesBox}>
																<div className={HRDetailStyle.onboardingProcessLeft}>
																	<div><BeforeKickOffSVG width="32" height="28" /></div>
																	<h3 className={HRDetailStyle.titleLeft}>Before Kick-off</h3>
																</div>

																<div className={HRDetailStyle.onboardingProcessMid}>
																	<div className={HRDetailStyle.modalFormWrapper}>
																		<div className={HRDetailStyle.modalFormCol}>
																			<label className={HRDetailStyle.timeLabel}>Kick off call Date  <span className={HRDetailStyle.reqFieldRed}>*</span></label>
																			<div className={HRDetailStyle.timeSlotItem}>
																				<Controller
																					render={({ ...props }) => (
																						<DatePicker
																							// selected={watchFeedbackDate ? watchFeedbackDate : null}
																							placeholderText="Select Date"
																							onChange={(date) => {
																								setValue('feedBackDate', date);
																							}}
																							dateFormat="yyyy/MM/dd H:mm:ss"
																						/>
																					)}
																					name="Select Date"
																					rules={{ required: true }}
																					control={control}
																					required
																				/>
																				<CalenderSVG />
																			</div>
																		</div>

																		<div className={HRDetailStyle.modalFormCol}>
																			<HRSelectField
																				isControlled={true}
																				mode="id/value"
																				setValue={setValue}
																				register={register}
																				label={'Talent Reporting POC'}
																				// defaultValue={'Select Deal Source'}
																				placeholder={'Enter POC Name'}
																				name="Enter POC Name"
																				isError={errors['departMent'] && errors['departMent']}
																				required
																				errorMsg={'Please select department'}
																			/>
																		</div>

																		<div className={HRDetailStyle.modalFormCol}>
																			<HRSelectField
																				isControlled={true}
																				mode="id/value"
																				setValue={setValue}
																				register={register}
																				label={'Timezone'}
																				defaultValue={'(GMT - 6) Central Standard Time'}
																				// placeholder={'Enter POC Name'}
																				name="Enter POC Name"
																				isError={errors['departMent'] && errors['departMent']}
																				required
																				errorMsg={'Please select department'}
																			/>
																		</div>

																		<div className={HRDetailStyle.modalFormCol}>
																			<label className={HRDetailStyle.timeLabel}>Start & End Time  <span className={HRDetailStyle.reqFieldRed}>*</span></label>
																			<div className={`${HRDetailStyle.timeSlotItem} ${HRDetailStyle.timeSlotSvgWrap}`}>
																				<div className={HRDetailStyle.timeSlotLeftIcon}>
																					<ClockIconSVG />				
																				</div>
																				<TimePicker.RangePicker 
																						required
																						suffixIcon={<ClockIconSVG />}
																				/>
																				<div className={HRDetailStyle.timeSlotRightIcon}>
																					<ClockIconSVG />
																				</div>
																			</div>
																		</div>

																	</div>
																</div>

															</div>
														</div>

														<div className={HRDetailStyle.formPanelAction}>
															<button type="submit" className={HRDetailStyle.btnPrimary}>Schedule Kick-off</button>
														</div>
													</div>
												),
											},

											{
												label: 'After Kick-off',
												key: 'After Kick-off',
												children: (
													<div className={HRDetailStyle.onboardingProcesswrap}>
														<div className={HRDetailStyle.onboardingProcesspart}>
															<div className={HRDetailStyle.onboardingProcesBox}>
																<div className={HRDetailStyle.onboardingProcessLeft}>
																	<div><AfterKickOffSVG width="31" height="30" /></div>
																	<h3 className={HRDetailStyle.titleLeft}>After Kick-off</h3>
																</div>

																<div className={HRDetailStyle.onboardingProcessMid}>
																	<div className={HRDetailStyle.modalFormWrapper}>

																		<div className={HRDetailStyle.modalFormCol}>
																			<HRInputField
																				register={register}
																				errors={errors}
																				validationSchema={{
																					required: 'please enter the company name.',
																				}}
																				label="Zoho Invoice Number"
																				name="EnterName"
																				type={InputType.TEXT}
																				placeholder="Enter Zoho Invoice Number"
																				required
																			/>
																		</div>

																		<div className={HRDetailStyle.modalFormCol}>						
																			<div className={`${HRDetailStyle.formGroup} ${HRDetailStyle.phoneNoGroup}`}>
																					<label className={HRDetailStyle.timeLabel}>Invoice Value  <span className={HRDetailStyle.reqFieldRed}>*</span></label>
																					<div className={HRDetailStyle.phoneNoCode}>
																						<HRSelectField
																							searchable={true}
																							setValue={setValue}
																							register={register}
																							name="primaryClientCountryCode"
																							// defaultValue="Currency"
																							placeholder={"Currency"}
																							required
																							// options={flagAndCodeMemo}
																						/>
																					</div>
																					<div className={HRDetailStyle.phoneNoInput}>
																						<HRInputField
																							// required={watch('userType')?.id === UserAccountRole.SALES}
																							register={register}
																							name={'primaryClientPhoneNumber'}
																							type={InputType.NUMBER}
																							placeholder="Enter Amount"
																							required
																							// validationSchema={{
																							// 	required: 'Please enter contact number',
																							// }}
																						/>
																					</div>
																			</div>
																		</div>

																		<div className={HRDetailStyle.modalFormCol}>
																			<label className={HRDetailStyle.timeLabel}>Engagement Start Date  <span className={HRDetailStyle.reqFieldRed}>*</span></label>
																			<div className={HRDetailStyle.timeSlotItem}>
																				<Controller
																					render={({ ...props }) => (
																						<DatePicker
																							// selected={watchFeedbackDate ? watchFeedbackDate : null}
																							placeholderText="Select Date"
																							onChange={(date) => {
																								setValue('feedBackDate', date);
																							}}
																							dateFormat="yyyy/MM/dd H:mm:ss"
																						/>
																					)}
																					name="Select Date"
																					rules={{ required: true }}
																					control={control}
																					required
																				/>
																				<CalenderSVG />
																			</div>
																		</div>

																		<div className={HRDetailStyle.modalFormCol}>
																			<label className={HRDetailStyle.timeLabel}>Engagement End Date  <span className={HRDetailStyle.reqFieldRed}>*</span></label>
																			<div className={HRDetailStyle.timeSlotItem}>
																				<Controller
																					render={({ ...props }) => (
																						<DatePicker
																							// selected={watchFeedbackDate ? watchFeedbackDate : null}
																							placeholderText="Select Date"
																							onChange={(date) => {
																								setValue('feedBackDate', date);
																							}}
																							dateFormat="yyyy/MM/dd H:mm:ss"
																						/>
																					)}
																					name="Select Date"
																					rules={{ required: true }}
																					control={control}
																					required
																				/>
																				<CalenderSVG />
																			</div>
																		</div>

																		<div className={HRDetailStyle.modalFormCol}>
																			<label className={HRDetailStyle.timeLabel}>Talent Start Date  <span className={HRDetailStyle.reqFieldRed}>*</span></label>
																			<div className={HRDetailStyle.timeSlotItem}>
																				<Controller
																					render={({ ...props }) => (
																						<DatePicker
																							// selected={watchFeedbackDate ? watchFeedbackDate : null}
																							placeholderText="Select Date"
																							onChange={(date) => {
																								setValue('feedBackDate', date);
																							}}
																							dateFormat="yyyy/MM/dd H:mm:ss"
																						/>
																					)}
																					name="Select Date"
																					rules={{ required: true }}
																					control={control}
																					required
																				/>
																				<CalenderSVG />
																			</div>
																		</div>
																		
																	</div>
																</div>

															</div>
														</div>

														<div className={HRDetailStyle.formPanelAction}>
															<button type="submit" className={HRDetailStyle.btnPrimary}>Complete Kick-off</button>
														</div>
													</div>
												),
											},
	

										]}
									/>
									{/* HTML Code Ends for Modal - Before Pre-Onboarding */}

									
								</div>
							</Modal>

							{apiData?.dynamicCTA?.CTA_Set1 &&
								apiData?.dynamicCTA?.CTA_Set1?.length > 0 && (
									<CTASlot1
										callAPI={callAPI}
										hrID={urlSplitter?.split('HR')[0]}
										slotItem={apiData?.dynamicCTA?.CTA_Set1}
										apiData={apiData}
										miscData={miscData}
									/>
								)}
							{apiData?.dynamicCTA?.CTA_Set2 &&
								apiData?.dynamicCTA?.CTA_Set2?.length > 0 && (
									<CTASlot2
										callAPI={callAPI}
										hrID={urlSplitter?.split('HR')[0]}
										slotItem={apiData?.dynamicCTA?.CTA_Set2}
										apiData={apiData}
										miscData={miscData}
									/>
								)}

							{/* {apiData?.activity_MissingAction_CTA?.length > 0 && (
								<span>
									<h4>
										{getNextActionMissingActionMemo?.key !== 'ShareAProfile' &&
											'Next Action'}{' '}
										{nextMissingActionHandler()}{' '}
									</h4>
								</span>
							)} */}
							{/**  As of No Put on HOLD */}
							{/* <HROperator
								title={
									hrUtils.handleAdHOC(apiData && apiData?.AdhocPoolValue)[0]
										?.label
								}
								icon={<ArrowDownSVG style={{ width: '16px' }} />}
								backgroundColor={`var(--background-color-light)`}
								labelBorder={`1px solid var(--color-sunlight)`}
								iconBorder={`1px solid var(--color-sunlight)`}
								isDropdown={true}
								listItem={hrUtils.handleAdHOC(apiData?.AdhocPoolValue)}
								menuAction={(menuItem) => {
									switch (menuItem.key) {
										case 'Pass to ODR': {
											updateODRPoolStatusHandler({
												hrID: urlSplitter?.split('HR')[0],
												isPool: false,
												isODR: true,
											});
											break;
										}
										case 'Pass to Pool': {
											updateODRPoolStatusHandler({
												hrID: urlSplitter?.split('HR')[0],
												isPool: true,
												isODR: false,
											});
											break;
										}
										case 'Keep it with me as well': {
											updateODRPoolStatusHandler({
												hrID: urlSplitter?.split('HR')[0],
												isPool: true,
												isODR: true,
											});
											break;
										}
										default:
											break;
									}
								}}
							/> */}

							{apiData?.dynamicCTA?.CloseHr && (
								<div
									className={HRDetailStyle.hiringRequestPriority}
									onClick={() => {
										setCloseHrModal(true);
									}}>
									<Tooltip
										placement="bottom"
										title="Close HR">
										<PowerSVG
											style={{ width: '24px' }}
											className={HRDetailStyle.deleteSVG}
										/>
									</Tooltip>
								</div>
							)}

							{closeHrModal && (
								<Modal
									width={'864px'}
									centered
									footer={false}
									open={closeHrModal}
									className="updateTRModal"
									onCancel={() => setCloseHrModal(false)}>
									<CloseHRModal
										closeHR={() => {}}
										setUpdateTR={() => setCloseHrModal(true)}
										onCancel={() => setCloseHrModal(false)}
										closeHRDetail={apiData}
									/>
								</Modal>
							)}
						</div>
					)}
				</div>
				{isLoading ? (
					<>
						<br />
						<Skeleton active />
						<br />
					</>
				) : (
					apiData?.NextActionsForTalent?.length > 0 && (
						<Suspense>
							<NextActionItem nextAction={apiData?.NextActionsForTalent} />
						</Suspense>
					)
				)}

				<div className={HRDetailStyle.portal}>
					<div className={HRDetailStyle.clientPortal}>
						{isLoading ? (
							<Skeleton active />
						) : (
							<Suspense>
								<CompanyProfileCard
									clientDetail={apiData?.ClientDetail}
									talentLength={apiData?.HRTalentDetails?.length}
									apiData={apiData?.HRStatus}
									allApiData={apiData}
								/>
							</Suspense>
						)}
					</div>
					<div className={HRDetailStyle.talentPortal}>
						{isLoading ? (
							<Skeleton active />
						) : (
							<Suspense>
								<TalentProfileCard
									urlSplitter={urlSplitter}
									updatedSplitter={updatedSplitter}
									apiData={apiData}
									clientDetail={apiData?.ClientDetail}
									callAPI={callAPI}
									talentCTA={apiData?.dynamicCTA?.talent_CTAs || []}
									HRStatusCode={apiData?.HRStatusCode}
									talentDetail={apiData?.HRTalentDetails}
									hrId={apiData.HR_Id}
									miscData={miscData}
									hiringRequestNumber={updatedSplitter}
									hrType={apiData.Is_HRTypeDP}
									starMarkedStatusCode={apiData?.StarMarkedStatusCode}
									hrStatus={apiData?.HRStatus}
									callHRapi={callHRapi}
									setHRapiCall={setHRapiCall}
									inteviewSlotDetails={apiData?.InterviewSlotDetails}
								/>
							</Suspense>
						)}
					</div>
				</div>
				<div className={HRDetailStyle.activityFeed}>
					{isLoading ? (
						<Skeleton active />
					) : (
						<Suspense>
							<ActivityFeed
								hrID={urlSplitter?.split('HR')[0]}
								activityFeed={apiData?.HRHistory}
								tagUsers={apiData?.UsersToTag}
								callActivityFeedAPI={callAPI}
							/>
						</Suspense>
					)}
				</div>
			</div>

			{/* ------------------ HR Delete Modal ---------------------- */}
			{/* <Modal
				transitionName=""
				centered
				open={deleteModal}
				width={'864px'}
				footer={null}
				onCancel={() => setDeleteModal(false)}>
				<div className={HRDetailStyle.modalBody}>
					<div>
						<h1>Delete Type</h1>
						<p>{updatedSplitter}</p>
					</div>

					<div className={HRDetailStyle.tabContainer}>
						<Tabs
							defaultActiveKey="1"
							animated={true}
							centered
							tabBarStyle={{
								borderBottom: `1px solid var(--uplers-border-color)`,
							}}
							items={[
								{
									label: 'On Hold',
									key: 'On Hold',
									children: (
										<div style={{ marginTop: '35px' }}>
											<div className={HRDetailStyle.row}>
												<div className={HRDetailStyle.colMd12}>
													<HRSelectField
														mode={'id/value'}
														searchable={false}
														setValue={setValue}
														register={register}
														name="hrDeleteReason"
														label="Delete Reason"
														defaultValue="Please select reason"
														options={deleteReason && deleteReason}
														required
														isError={
															errors['hrDeleteReason'] &&
															errors['hrDeleteReason']
														}
														errorMsg="Please select a delete reason."
													/>
												</div>
											</div>
											{watch('hrDeleteReason')?.value === 'Other' && (
												<div className={HRDetailStyle.row}>
													<div className={HRDetailStyle.colMd12}>
														<HRInputField
															register={register}
															errors={errors}
															validationSchema={{
																required: 'Please enter the other reason.',
															}}
															label="On Hold Other Reason"
															name="hrDeleteOtherReason"
															type={InputType.TEXT}
															placeholder="Enter Other Reason"
															required
														/>
													</div>
												</div>
											)}
											<div className={HRDetailStyle.row}>
												<div className={HRDetailStyle.colMd12}>
													<HRInputField
														isTextArea={true}
														register={register}
														errors={errors}
														validationSchema={{
															required: 'Please enter the HR Remark.',
														}}
														label="On Hold Remark"
														name="hrDeleteRemark"
														type={InputType.TEXT}
														placeholder="Enter Remark"
														required
													/>
												</div>
											</div>
											<div className={HRDetailStyle.formPanelAction}>
												<button
													onClick={() => setDeleteModal(false)}
													className={HRDetailStyle.btn}>
													Cancel
												</button>
												<button
													id={HRDeleteType.ON_HOLD}
													type="submit"
													onClick={handleSubmit(clientOnHoldSubmitHandler)}
													className={HRDetailStyle.btnPrimary}>
													Delete
												</button>
											</div>
										</div>
									),
								},
								{
									label: 'Loss',
									key: 'Loss',
									children: (
										<div style={{ marginTop: '35px' }}>
											<div className={HRDetailStyle.row}>
												<div className={HRDetailStyle.colMd12}>
													<HRSelectField
														mode={'id/value'}
														searchable={false}
														setValue={setValue}
														register={register}
														name="hrDeleteLossReason"
														label="Delete Reason"
														defaultValue="Please select reason"
														options={deleteReason && deleteReason}
														required
														isError={
															errors['hrDeleteLossReason'] &&
															errors['hrDeleteLossReason']
														}
														errorMsg="Please select a delete reason."
													/>
												</div>
											</div>
											{watch('hrDeleteLossReason')?.value === 'Other' && (
												<div className={HRDetailStyle.row}>
													<div className={HRDetailStyle.colMd12}>
														<HRInputField
															register={register}
															errors={errors}
															validationSchema={{
																required: 'Please enter the other reason.',
															}}
															label="On Loss Other Reason"
															name="hrLossDeleteOtherReason"
															type={InputType.TEXT}
															placeholder="Enter Other Reason"
															required
														/>
													</div>
												</div>
											)}
											<div className={HRDetailStyle.row}>
												<div className={HRDetailStyle.colMd12}>
													<HRInputField
														isTextArea={true}
														register={register}
														errors={errors}
														isError={
															errors['hrDeleteLossRemark'] &&
															errors['hrDeleteLossRemark']
														}
														errorMsg="please enter the Loss Remark."
														label="Loss Remark"
														name="hrDeleteLossRemark"
														type={InputType.TEXT}
														placeholder="Enter Remark"
														required
													/>
												</div>
											</div>
											<div className={HRDetailStyle.formPanelAction}>
												<button
													onClick={() => setDeleteModal(false)}
													className={HRDetailStyle.btn}>
													Cancel
												</button>
												<button
													onClick={clientOnLossSubmitHandler}
													className={HRDetailStyle.btnPrimary}>
													Delete
												</button>
											</div>
										</div>
									),
								},
							]}
						/>
					</div>
				</div>
			</Modal> */}
		</WithLoader>
	);
};

export default HRDetailScreen;
