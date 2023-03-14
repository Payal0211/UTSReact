import { Divider } from 'antd';
import { InputType, SubmitType, UserAccountRole } from 'constants/application';
import { useCallback, useEffect, useMemo, useState } from 'react';
import HRInputField from '../../../hiring request/components/hrInputFields/hrInputFields';
import UserFieldStyle from './userFields.module.css';

import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import UploadModal from 'shared/components/uploadModal/uploadModal';
// import { MasterDAO } from 'core/master/masterDAO';

import HRSelectField from '../../../hiring request/components/hrSelectField/hrSelectField';
import { useForm } from 'react-hook-form';
// import AddInterviewer from '../addInterviewer/addInterviewer';
import { HTTPStatusCode } from 'constants/network';
import { _isNull } from 'shared/utils/basic_utils';
import { useNavigate } from 'react-router-dom';
import { MasterDAO } from 'core/master/masterDAO';
import { getFlagAndCodeOptions } from 'modules/client/clientUtils';
import UTSRoutes from 'constants/routes';
import { userUtils } from 'modules/user/userUtils';
import { userAPI } from 'apis/userAPI';
import { userDAO } from 'core/user/userDAO';

export const secondaryInterviewer = {
	fullName: '',
	emailID: '',
	linkedin: '',
	designation: '',
};

const UsersFields = ({ id }) => {
	const [userDetails, setUserDetails] = useState(null);
	const [userTypeEdit, setUserTypeEdit] = useState('Please select');
	const [controlledUserRole, setControlledUserRole] = useState('Please select');
	const [isLoading, setIsLoading] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const [userType, setUserType] = useState([]);
	const [teamManager, setTeamManager] = useState([]);
	const [opsTeamManager, setOpsTeamManager] = useState([]);
	const [reporteeManager, setReporteeManager] = useState([]);

	const [salesMan, setSalesMan] = useState([]);
	const [userRole, setUserRole] = useState([]);
	const [BDRManager, setBDRManager] = useState([]);
	const [GEO, setGEO] = useState([]);
	const [talentRole, setTalentRole] = useState([]);
	const [showUploadModal, setUploadModal] = useState(false);

	const [type, setType] = useState('');

	const [flagAndCode, setFlagAndCode] = useState([]);

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
	let watchUserType = watch('userType');
	let watchReporteeManager = watch('salesManager');
	let watchUserRole = watch('userRole');
	const watchEmployeeID = watch('employeeId');
	const watchEmployeeName = watch('employeeFullName');
	const getEmployeeIDAlreadyExist = useCallback(
		async (data) => {
			console.log('--getEmployeeIDAlreadyExist daya---', data);
			let companyNameDuplicate = await userDAO.getIsEmployeeIDExistRequestDAO({
				userID: id !== 0 ? id : 0,
				employeeID: data,
			});
			console.log(companyNameDuplicate, '---companyNameDuplicate');
			setError('employeeId', {
				type: 'duplicateEmployeeID',
				message:
					companyNameDuplicate?.statusCode === HTTPStatusCode.BAD_REQUEST &&
					'This employee ID already exists. Please enter another one.',
			});
			companyNameDuplicate.statusCode === HTTPStatusCode.DUPLICATE_RECORD &&
				setValue('employeeId', '');
			setIsLoading(false);
		},
		[id, setError, setValue],
	);
	const getEmployeeFullNameAlreadyExist = useCallback(
		async (data) => {
			console.log('-- getEmployeeFullNameAlreadyExistdaya---', data);
			let companyNameDuplicate = await userDAO.getIsEmployeeNameExistRequestDAO(
				{
					userID: id !== 0 ? id : 0,
					employeeName: data,
				},
			);
			console.log(companyNameDuplicate, '---companyNameDuplicate');
			setError('employeeFullName', {
				type: 'duplicateEmployeeFullName',
				message:
					companyNameDuplicate?.statusCode === HTTPStatusCode.BAD_REQUEST &&
					'This employee name already exists. Please enter another one.',
			});
			companyNameDuplicate.statusCode === HTTPStatusCode.DUPLICATE_RECORD &&
				setValue('employeeFullName', '');
			setIsLoading(false);
		},
		[id, setError, setValue],
	);
	useEffect(() => {
		let timer;
		if (!_isNull(watchEmployeeID)) {
			timer = setTimeout(() => {
				setIsLoading(true);
				getEmployeeIDAlreadyExist(watchEmployeeID);
			}, 2000);
		}
		return () => clearTimeout(timer);
	}, [getEmployeeIDAlreadyExist, watchEmployeeID]);
	useEffect(() => {
		let timer;
		if (!_isNull(watchEmployeeName)) {
			timer = setTimeout(() => {
				setIsLoading(true);
				getEmployeeFullNameAlreadyExist(watchEmployeeName);
			}, 2000);
		}
		return () => clearTimeout(timer);
	}, [getEmployeeFullNameAlreadyExist, watchEmployeeName]);
	const navigate = useNavigate();
	const getCodeAndFlag = async () => {
		const getCodeAndFlagResponse = await MasterDAO.getCodeAndFlagRequestDAO();
		setFlagAndCode(
			getCodeAndFlagResponse && getCodeAndFlagResponse.responseBody,
		);
	};
	const flagAndCodeMemo = useMemo(
		() => getFlagAndCodeOptions(flagAndCode),
		[flagAndCode],
	);
	const getGEO = useCallback(async () => {
		let response = await MasterDAO.getGEORequestDAO();
		setGEO(response && response?.responseBody);
	}, []);

	const getUserType = useCallback(async () => {
		let response = await MasterDAO.getUserTypeRequestDAO();
		setUserType(response && response?.responseBody?.details);
	}, []);

	const getTeamManager = useCallback(async () => {
		let response = await MasterDAO.getTeamManagerRequestDAO();
		setTeamManager(response && response?.responseBody?.details);
	}, []);
	const getOPSTeamManager = useCallback(async () => {
		let response = await MasterDAO.getTeamManagerBasedOnUserTypeRequestDAO({
			userTypeID: 10,
		});
		setOpsTeamManager(response && response?.responseBody?.details);
	}, []);

	const getSalesMan = useCallback(async () => {
		let response = await MasterDAO.getSalesManRequestDAO();
		setSalesMan(response && response?.responseBody?.details);
	}, []);

	const getUserRoles = useCallback(async () => {
		let response = await MasterDAO.getUserByTypeRequestDAO({
			typeID: id !== 0 ? watch('userType')?.id : watchUserType?.id,
		});
		setUserRole(response && response?.responseBody?.details);
	}, [id, watch, watchUserType?.id]);

	const getReporteeManager = useCallback(async () => {
		let response = await MasterDAO.getReporteeTeamManagerRequestDAO({
			typeID: watchReporteeManager?.id,
		});
		setReporteeManager(response && response?.responseBody?.details);
	}, [watchReporteeManager]);

	const getTalentRole = useCallback(async () => {
		let response = await MasterDAO.getTalentsRoleRequestDAO();
		setTalentRole(response && response?.responseBody);
	}, []);

	const getUserDetails = useCallback(async () => {
		const response = await userDAO.getUserDetailsRequestDAO({ userID: id });
		setUserDetails(response && response?.responseBody?.details);
	}, [id]);

	const getBDRMarketingOnUserType = useCallback(async () => {
		let response = await MasterDAO.getBDRMarketingBasedOnUserTypeRequestDAO({
			roleID: watchUserRole,
		});
		setBDRManager(response && response?.responseBody?.details);
	}, [watchUserRole]);

	useEffect(() => {
		(!_isNull(watchUserType) || id !== 0) && getUserRoles();
		!_isNull(watchUserType) && getGEO();
		!_isNull(watchReporteeManager) && getReporteeManager();
		!_isNull(watchUserRole) && getBDRMarketingOnUserType();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, watchReporteeManager, watchUserType, watchUserRole]);

	useEffect(() => {
		id !== 0 && getUserDetails();
		getCodeAndFlag();
		getOPSTeamManager();
		getUserType();
		getTeamManager();
		getSalesMan();
		getTalentRole();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	useEffect(() => {
		if (watch('userType')?.id === UserAccountRole.LEGAL) {
			console.log('hereh--');
		}
	}, [watch]);
	useEffect(() => {
		if (id !== 0) {
			let result = userType?.filter(
				(item) => item?.id === userDetails?.userTypeId,
			);

			setValue('userType', {
				id: result?.[0]?.id,
				value: result?.[0]?.value,
			});

			setUserTypeEdit(result?.[0]?.value);
		}
	}, [id, setValue, userDetails?.userTypeId, userType]);

	useEffect(() => {
		if (id !== 0) {
			let userRoleResult = userRole?.filter(
				(item) => item?.id === userDetails?.roleId,
			);

			setValue('userRole', {
				id: userRoleResult?.[0]?.id,
				value: userRoleResult?.[0]?.value,
			});
			setControlledUserRole(userRoleResult?.[0]?.value);
		}
	}, [id, setValue, userDetails?.roleId, userRole]);

	const userSubmitHandler = useCallback(
		async (d, type = SubmitType.SAVE_AS_DRAFT) => {
			setFormLoading(true);
			let userFormDetails = userUtils.userDataFormatter(d, id);

			let userResponse = await userAPI.createUserRequest(userFormDetails);

			if (userResponse.statusCode === HTTPStatusCode.OK) {
				setFormLoading(false);
				navigate(UTSRoutes.USERLISTROUTE);
			}
			/* let hrFormDetails = hrUtils.hrFormDataFormatter(
			d,
			type,
			watch,
			clientDetail?.contactId,
			isHRDirectPlacement,
			addHRResponse,
		);
 */
			/* if (type === SubmitType.SAVE_AS_DRAFT) {
			if (_isNull(watch('clientName'))) {
				return setError('clientName', {
					type: 'emptyClientName',
					message: 'Please enter the client name.',
				});
			}
		} else if (type !== SubmitType.SAVE_AS_DRAFT) {
			setType(SubmitType.SUBMIT);
		}
		const addHRRequest = await hiringRequestDAO.createHRDAO(hrFormDetails); */

			/* if (addHRRequest.statusCode === HTTPStatusCode.OK) {
			setAddHRResponse(addHRRequest?.responseBody?.details);
			console.log(addHRRequest?.responseBody?.details?.en_Id, '---eniD');
			setEnID(addHRRequest?.responseBody?.details?.en_Id);
			type !== SubmitType.SAVE_AS_DRAFT && setTitle('Debriefing HR');
			type !== SubmitType.SAVE_AS_DRAFT &&
				setTabFieldDisabled({ ...tabFieldDisabled, debriefingHR: false });

			type === SubmitType.SAVE_AS_DRAFT &&
				messageAPI.open({
					type: 'success',
					content: 'HR details has been saved to draft.',
				});
		} */
		},
		[id, navigate],
	);

	return (
		<div className={UserFieldStyle.hrFieldContainer}>
			<form id="hrForm">
				<div className={UserFieldStyle.partOne}>
					<div className={UserFieldStyle.hrFieldLeftPane}>
						<h3>{id === 0 ? 'Add New User' : 'Edit User'}</h3>
						<p>Please provide the necessary details</p>
						{id !== 0 && (
							<div className={UserFieldStyle.formPanelAction}>
								<button
									style={{
										cursor: type === SubmitType.SUBMIT ? 'no-drop' : 'pointer',
									}}
									disabled={type === SubmitType.SUBMIT}
									className={UserFieldStyle.btnPrimary}
									onClick={handleSubmit(userSubmitHandler)}>
									Edit User
								</button>
							</div>
						)}
					</div>

					<div className={UserFieldStyle.hrFieldRightPane}>
						<div className={UserFieldStyle.row}>
							<div className={UserFieldStyle.colMd6}>
								<HRInputField
									value={id !== 0 ? userDetails?.employeeId : null}
									disabled={id !== 0 || isLoading}
									register={register}
									errors={errors}
									validationSchema={{
										required: 'Please enter employee ID',
									}}
									label={'Employee ID'}
									name="employeeId"
									type={InputType.TEXT}
									placeholder="Enter Employee ID"
									required
								/>
							</div>
							<div className={UserFieldStyle.colMd6}>
								<HRInputField
									value={id !== 0 ? userDetails?.fullName : null}
									disabled={id !== 0 || isLoading}
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the employee name',
									}}
									label="Employee Full Name"
									name="employeeFullName"
									type={InputType.TEXT}
									placeholder="Enter Name"
									required
								/>
							</div>
							{(watch('userType')?.id === UserAccountRole.SALES ||
								watch('userType')?.id === UserAccountRole.SALES_MANAGER) && (
								<div className={UserFieldStyle.colMd12}>
									<div className={UserFieldStyle.radioFormGroup}>
										<label>
											Is the User New?
											<span className={UserFieldStyle.reqField}>*</span>
										</label>
										<label className={UserFieldStyle.container}>
											<p>Yes</p>
											<input
												{...register('isNewUser')}
												value={true}
												type="radio"
												checked
												id="isNewUser"
												name="isNewUser"
											/>
											<span className={UserFieldStyle.checkmark}></span>
										</label>
										<label className={UserFieldStyle.container}>
											<p>No</p>
											<input
												{...register('isNewUser')}
												value={false}
												type="radio"
												id="isNewUser"
												name="isNewUser"
											/>
											<span className={UserFieldStyle.checkmark}></span>
										</label>
									</div>
								</div>
							)}
							<div className={UserFieldStyle.colMd6}>
								<div className={UserFieldStyle.formGroup}>
									<HRSelectField
										controlledValue={userTypeEdit}
										setControlledValue={setUserTypeEdit}
										isControlled={true}
										disabled={id !== 0}
										mode="id/value"
										setValue={setValue}
										register={register}
										label={'User Type'}
										defaultValue={'Please select'}
										options={userType && userType}
										name="userType"
										isError={errors['userType'] && errors['userType']}
										required
										errorMsg={'Please select user type'}
									/>
								</div>
							</div>
							{(watch('userType')?.id === UserAccountRole.SALES ||
								watch('userType')?.id === UserAccountRole.SALES_MANAGER ||
								watch('userType')?.id === UserAccountRole.BDR ||
								watch('userType')?.id === UserAccountRole.MARKETING) && (
								<div className={UserFieldStyle.colMd6}>
									<div className={UserFieldStyle.formGroup}>
										<HRSelectField
											controlledValue={controlledUserRole}
											setControlledValue={setControlledUserRole}
											isControlled={true}
											disabled={id !== 0}
											setValue={setValue}
											register={register}
											label={'User Role'}
											defaultValue="Please Select"
											options={userRole && userRole}
											placeholderText="Please Select"
											name="userRole"
											isError={errors['userRole'] && errors['userRole']}
											required
											errorMsg={'Please select user role'}
										/>
									</div>
								</div>
							)}
							{(watch('userType')?.id === UserAccountRole.TALENTOPS ||
								watch('userType')?.id === UserAccountRole.OPS_TEAM_MANAGER) && (
								<div className={UserFieldStyle.colMd6}>
									<div className={UserFieldStyle.formGroup}>
										<HRSelectField
											setValue={setValue}
											register={register}
											label={'Is ODR/Pool?'}
											defaultValue="Please Select"
											options={[
												{
													id: 0,
													value: 'Yes',
													text: null,
													disabled: false,
													group: null,
													seletected: false,
												},
												{
													id: 1,
													value: 'No',
													text: null,
													disabled: false,
													group: null,
													seletected: false,
												},
											]}
											placeholderText="Is ODR/Pool?"
											name="odrPool"
											isError={errors['odrPool'] && errors['odrPool']}
											required
											errorMsg={'Please select'}
										/>
									</div>
								</div>
							)}

							{watch('userType')?.id === UserAccountRole.BDR &&
							watch('userRole') === 4 ? (
								<div className={UserFieldStyle.colMd6}>
									<div className={UserFieldStyle.formGroup}>
										<HRSelectField
											setValue={setValue}
											register={register}
											label={'BDR Management'}
											defaultValue="Please Select"
											options={BDRManager && BDRManager}
											placeholderText="Please Select"
											name="bdrManagement"
										/>
									</div>
								</div>
							) : null}
							{watch('userType')?.id === UserAccountRole.BDR &&
							watch('userRole') === 3 ? (
								<div className={UserFieldStyle.colMd6}>
									<div className={UserFieldStyle.formGroup}>
										<HRSelectField
											setValue={setValue}
											register={register}
											label={'BDR Lead'}
											defaultValue="Please Select"
											options={BDRManager && BDRManager}
											placeholderText="Please Select"
											name="bdrLead"
										/>
									</div>
								</div>
							) : null}
							{watch('userType')?.id === UserAccountRole.MARKETING &&
							watch('userRole') === 6 ? (
								<div className={UserFieldStyle.colMd6}>
									<div className={UserFieldStyle.formGroup}>
										<HRSelectField
											setValue={setValue}
											register={register}
											label={'Marketing Lead'}
											defaultValue="Please Select"
											options={BDRManager && BDRManager}
											placeholderText="Please Select"
											name="marketingLead"
										/>
									</div>
								</div>
							) : null}
							{watch('userType')?.id === UserAccountRole.MARKETING &&
							watch('userRole') === 7 ? (
								<div className={UserFieldStyle.colMd6}>
									<div className={UserFieldStyle.formGroup}>
										<HRSelectField
											setValue={setValue}
											register={register}
											label={'Marketing Manager'}
											defaultValue="Please Select"
											options={BDRManager && BDRManager}
											placeholderText="Please Select"
											name="marketingManager"
										/>
									</div>
								</div>
							) : null}
							{(watch('userType')?.id === UserAccountRole.SALES ||
								watch('userType')?.id === UserAccountRole.SALES_MANAGER) && (
								<div className={UserFieldStyle.colMd6}>
									<div className={UserFieldStyle.formGroup}>
										<HRSelectField
											setValue={setValue}
											register={register}
											label={'Geo'}
											defaultValue="Please Select"
											options={GEO && GEO}
											placeholderText="Please Select"
											name="geo"
											isError={errors['geo'] && errors['geo']}
											required
											errorMsg={'Please select GEO'}
										/>
									</div>
								</div>
							)}
							{watch('userType')?.id === UserAccountRole.SALES_MANAGER && (
								<div className={UserFieldStyle.colMd6}>
									<HRInputField
										value={id !== 0 ? userDetails?.fullName : null}
										disabled={id !== 0 && true}
										register={register}
										errors={errors}
										validationSchema={{
											required: 'please enter the priority count',
										}}
										label="Priority Count"
										name="priorityCount"
										type={InputType.Number}
										placeholder="Enter Priority Count "
										required
									/>
								</div>
							)}
							{watch('userType')?.id === UserAccountRole.SALES && (
								<div className={UserFieldStyle.colMd6}>
									<div className={UserFieldStyle.formGroup}>
										<HRSelectField
											mode="id/value"
											setValue={setValue}
											register={register}
											label={'Sales Manager'}
											defaultValue="Please Select"
											options={teamManager && teamManager}
											placeholderText="Please Select"
											name="salesManager"
											// isError={errors['salesManager'] && errors['salesManager']}
											// required
											// errorMsg={'Please select manager'}
										/>
									</div>
								</div>
							)}
							{watch('userType')?.id === UserAccountRole.TALENTOPS && (
								<div className={UserFieldStyle.colMd6}>
									<div className={UserFieldStyle.formGroup}>
										<HRSelectField
											mode="id/value"
											setValue={setValue}
											register={register}
											label={'Ops Team Manager'}
											defaultValue="Please Select"
											options={opsTeamManager && opsTeamManager}
											placeholderText="Please Select"
											name="opsTeamManager"
										/>
									</div>
								</div>
							)}
							{!_isNull(watch('salesManager')?.id) &&
							watch('userType')?.id === UserAccountRole.SALES ? (
								<div className={UserFieldStyle.colMd6}>
									<div className={UserFieldStyle.formGroup}>
										<HRSelectField
											setValue={setValue}
											register={register}
											label={'Reportee User'}
											defaultValue="Please Select"
											options={reporteeManager && reporteeManager}
											placeholderText="Please Select"
											name="reporteeUser"
										/>
									</div>
								</div>
							) : null}
							{!_isNull(watch('opsTeamManager')?.id) &&
							watch('userType')?.id === UserAccountRole.TALENTOPS ? (
								<div className={UserFieldStyle.colMd6}>
									<div className={UserFieldStyle.formGroup}>
										<HRSelectField
											setValue={setValue}
											register={register}
											label={'Reportee User'}
											defaultValue="Please Select"
											options={reporteeManager && reporteeManager}
											placeholderText="Please Select"
											name="reporteeUser"
										/>
									</div>
								</div>
							) : null}
						</div>
					</div>
				</div>

				<Divider className={UserFieldStyle.midDivider} />
				<div className={UserFieldStyle.partOne}>
					<div className={UserFieldStyle.hrFieldLeftPane}></div>
					<div className={UserFieldStyle.hrFieldRightPane}>
						<div className={UserFieldStyle.row}>
							<div className={UserFieldStyle.colMd12}>
								<div className={UserFieldStyle.infoNotes}>
									Note: The Below Information would be available to view for you
									Talent/Client
								</div>
							</div>
						</div>

						<div className={UserFieldStyle.row}>
							<div className={UserFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'Please enter skype ID',
									}}
									label={'Skype'}
									name="skypeID"
									type={InputType.TEXT}
									placeholder="Enter Link"
									required={
										watch('userType')?.id === UserAccountRole.SALES ||
										watch('userType')?.id === UserAccountRole.TALENTOPS ||
										watch('userType')?.id === UserAccountRole.PRACTIVE_HEAD ||
										watch('userType')?.id === UserAccountRole.FINANCE_EXECUTIVE
									}
								/>
							</div>
							<div className={UserFieldStyle.colMd6}>
								<HRInputField
									value={id !== 0 ? userDetails?.emailId : null}
									disabled={id !== 0 && true}
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter email',
									}}
									label="Email"
									name="emailID"
									type={InputType.TEXT}
									placeholder="Enter Link"
									required
								/>
							</div>
							<div className={UserFieldStyle.colMd6}>
								<div
									className={`${UserFieldStyle.formGroup} ${UserFieldStyle.phoneNoGroup}`}>
									<label>
										Contact
										{watch('userType')?.id === UserAccountRole.SALES ||
										watch('userType')?.id === UserAccountRole.TALENTOPS ||
										watch('userType')?.id === UserAccountRole.PRACTIVE_HEAD ||
										watch('userType')?.id === UserAccountRole.FINANCE_EXECUTIVE
											? '*'
											: null}
									</label>
									<div className={UserFieldStyle.phoneNoCode}>
										<HRSelectField
											searchable={true}
											setValue={setValue}
											register={register}
											name="primaryClientCountryCode"
											defaultValue="+91"
											options={flagAndCodeMemo}
										/>
									</div>
									<div className={UserFieldStyle.phoneNoInput}>
										<HRInputField
											required={watch('userType')?.id === UserAccountRole.SALES}
											register={register}
											name={'primaryClientPhoneNumber'}
											type={InputType.NUMBER}
											placeholder="Enter number"
											validationSchema={{
												required: 'Please enter contact number',
											}}
										/>
									</div>
								</div>
							</div>

							<div className={UserFieldStyle.colMd6}>
								<HRInputField
									value={id !== 0 ? userDetails?.designation : null}
									disabled={id !== 0 && true}
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter designation',
									}}
									label="Designation"
									name="employeeDesignation"
									type={InputType.TEXT}
									placeholder="Enter Designation"
									required
								/>
							</div>

							<div className={UserFieldStyle.colMd12}>
								<HRInputField
									value={
										userDetails?.profilePic
											? userDetails?.profilePic
											: 'Upload Profile Picture'
									}
									disabled={id !== 0 && true}
									register={register}
									leadingIcon={<UploadSVG />}
									label="Profile Picture"
									name="profilePic"
									type={InputType.BUTTON}
									onClickHandler={() => setUploadModal(true)}
								/>
							</div>
							{watch('userType')?.id === UserAccountRole.PRACTIVE_HEAD && (
								<div className={UserFieldStyle.colMd6}>
									<div className={UserFieldStyle.formGroup}>
										<HRSelectField
											setValue={setValue}
											register={register}
											label={'Talent Role'}
											defaultValue="Please Select"
											options={talentRole && talentRole}
											placeholderText="Please Select"
											name="talentRole"
											isError={errors['talentRole'] && errors['talentRole']}
											required
											errorMsg={'Please select Talent Role'}
										/>
									</div>
								</div>
							)}
							<UploadModal
								modalTitle={'Upload Logo'}
								isFooter={false}
								openModal={showUploadModal}
								footer={false}
								cancelModal={() => setUploadModal(false)}
							/>

							<div className={UserFieldStyle.colMd12}>
								<HRInputField
									required={
										watch('userType')?.id === UserAccountRole.SALES ||
										watch('userType')?.id === UserAccountRole.TALENTOPS ||
										watch('userType')?.id === UserAccountRole.PRACTIVE_HEAD ||
										watch('userType')?.id === UserAccountRole.FINANCE_EXECUTIVE
									}
									isTextArea={true}
									errors={
										(watch('userType')?.id === UserAccountRole.SALES ||
											watch('userType')?.id === UserAccountRole.TALENTOPS ||
											watch('userType')?.id === UserAccountRole.PRACTIVE_HEAD ||
											watch('userType')?.id ===
												UserAccountRole.FINANCE_EXECUTIVE) &&
										errors
									}
									label={'Description'}
									register={register}
									name="description"
									validationSchema={{
										required: 'please enter description',
									}}
									type={InputType.TEXT}
									placeholder="Enter Description"
									rows={'4'}
								/>
							</div>
						</div>
					</div>
				</div>
			</form>

			<Divider className={UserFieldStyle.midDivider} />

			<div className={UserFieldStyle.partOne}>
				<div className={UserFieldStyle.hrFieldLeftPane}></div>
				<div className={UserFieldStyle.hrFieldRightPane}>
					<div className={UserFieldStyle.formPanelAction}>
						<button
							// style={{
							// 	cursor: id !== 0 ? 'no-drop' : 'pointer',
							// }}
							// disabled={id !== 0 && true}
							className={UserFieldStyle.btnPrimary}
							onClick={handleSubmit(userSubmitHandler)}>
							Submit
						</button>

						<button
							onClick={() => navigate(UTSRoutes.USERLISTROUTE)}
							className={UserFieldStyle.btn}>
							Back to Users
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UsersFields;
