import { Button, Checkbox, Divider, Space, message, Radio } from 'antd';
import {
	ClientHRURL,
	InputType,
	MastersKey,
	SubmitType,
	UserAccountRole,
	WorkingMode,
} from 'constants/application';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HRInputField from '../../../hiring request/components/hrInputFields/hrInputFields';
import UserFieldStyle from './userFields.module.css';
// import UserFieldStyle from './hrFIelds.module.css';
import { PlusOutlined } from '@ant-design/icons';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import UploadModal from 'shared/components/uploadModal/uploadModal';
// import { MasterDAO } from 'core/master/masterDAO';

import HRSelectField from '../../../hiring request/components/hrSelectField/hrSelectField';
import { useFieldArray, useForm } from 'react-hook-form';
// import AddInterviewer from '../addInterviewer/addInterviewer';
import { HTTPStatusCode } from 'constants/network';
import { _isNull } from 'shared/utils/basic_utils';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useLocation, useNavigate } from 'react-router-dom';
import { hrUtils } from 'modules/hiring request/hrUtils';
import { useMastersAPI } from 'shared/hooks/useMastersAPI';
import { MasterDAO } from 'core/master/masterDAO';
import { getFlagAndCodeOptions } from 'modules/client/clientUtils';
import UTSRoutes from 'constants/routes';
import { userUtils } from 'modules/user/userUtils';
import { userAPI } from 'apis/userAPI';
export const secondaryInterviewer = {
	fullName: '',
	emailID: '',
	linkedin: '',
	designation: '',
};

const UsersFields = ({ id }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [userType, setUserType] = useState([]);
	const [teamManager, setTeamManager] = useState([]);
	const [reporteeManager, setReporteeManager] = useState([]);
	const [salesMan, setSalesMan] = useState([]);
	const [userRole, setUserRole] = useState([]);
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
		setError,
		// control,
		formState: { errors },
	} = useForm({});
	let watchUserType = watch('userType');
	let watchReporteeManager = watch('salesManager');

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
	const getSalesMan = useCallback(async () => {
		let response = await MasterDAO.getSalesManRequestDAO();
		setSalesMan(response && response?.responseBody?.details);
	}, []);
	const getUserRoles = useCallback(async () => {
		let response = await MasterDAO.getUserByTypeRequestDAO({
			typeID: watchUserType?.id,
		});
		setUserRole(response && response?.responseBody?.details);
	}, [watchUserType]);
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

	useEffect(() => {
		!_isNull(watchUserType) && getUserRoles();
		!_isNull(watchUserType) && getGEO();
		!_isNull(watchReporteeManager) && getReporteeManager();
	}, [
		getGEO,
		getReporteeManager,
		getUserRoles,
		watchReporteeManager,
		watchUserType,
	]);

	useEffect(() => {
		// !_isNull(watchUserType) && getUserRoles();
		getCodeAndFlag();
		getUserType();
		getTeamManager();

		getSalesMan();
		getTalentRole();
	}, [getSalesMan, getTeamManager, getUserType, getTalentRole]);

	/* const { fields, append, remove } = useFieldArray({
        control,
        name: 'secondaryInterviewer',
    }); */

	const [messageAPI, contextHolder] = message.useMessage();

	const hrSubmitHandler = async (d, type = SubmitType.SAVE_AS_DRAFT) => {
		let userFormDetails = userUtils.userDataFormatter(d, id);
		console.log(userFormDetails);
		let userResponse = await userAPI.createUserRequest(userFormDetails);
		console.log(userResponse);
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
	};
	return (
		<div className={UserFieldStyle.hrFieldContainer}>
			{contextHolder}
			<form id="hrForm">
				<div className={UserFieldStyle.partOne}>
					<div className={UserFieldStyle.hrFieldLeftPane}>
						<h3>Add New User</h3>
						<p>Please provide the necessary details</p>
					</div>

					<div className={UserFieldStyle.hrFieldRightPane}>
						<div className={UserFieldStyle.row}>
							<div className={UserFieldStyle.colMd6}>
								<HRInputField
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
						</div>

						{(watch('userType')?.id === UserAccountRole.SALES ||
							watch('userType')?.id === UserAccountRole.SALES_MANAGER) && (
							<div className={UserFieldStyle.row}>
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
							</div>
						)}

						<div className={UserFieldStyle.row}>
							<div className={UserFieldStyle.colMd6}>
								<div className={UserFieldStyle.formGroup}>
									<HRSelectField
										mode="id/value"
										setValue={setValue}
										register={register}
										label={'User Type'}
										defaultValue="Please Select"
										options={userType && userType}
										name="userType"
										isError={errors['userType'] && errors['userType']}
										required
										errorMsg={'Please select user type'}
									/>
								</div>
							</div>
						</div>
						<div className={UserFieldStyle.row}>
							{(watch('userType')?.id === UserAccountRole.SALES ||
								watch('userType')?.id === UserAccountRole.SALES_MANAGER ||
								watch('userType')?.id === UserAccountRole.BDR ||
								watch('userType')?.id === UserAccountRole.MARKETING) && (
								<div className={UserFieldStyle.colMd6}>
									<div className={UserFieldStyle.formGroup}>
										<HRSelectField
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
						</div>

						{(watch('userType')?.id === UserAccountRole.SALES ||
							watch('userType')?.id === UserAccountRole.SALES_MANAGER) && (
							<div className={UserFieldStyle.row}>
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
							</div>
						)}

						<div className={UserFieldStyle.row}>
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
											isError={errors['salesManager'] && errors['salesManager']}
											required
											errorMsg={'Please select manager'}
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
											options={teamManager && teamManager}
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
							{!_isNull(watch('salesManager')?.id) &&
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
							<div className={UserFieldStyle.colMd6}>
								<div className={UserFieldStyle.formGroup}>
									<HRInputField
										register={register}
										errors={errors}
										validationSchema={{
											required: 'please enter priority count',
										}}
										label="Priority Count"
										name="priorityCount"
										type={InputType.NUMBER}
										placeholder="Enter Priority Count"
										required
									/>
								</div>
							</div>
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
							{(watch('userType')?.id === UserAccountRole.RESUME_WRITER ||
								watch('userType')?.id === UserAccountRole.PRACTIVE_HEAD) && (
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
										required
									/>
								</div>
							)}
							<div className={UserFieldStyle.colMd6}>
								<HRInputField
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
						</div>

						<div className={UserFieldStyle.row}>
							{(watch('userType')?.id === UserAccountRole.RESUME_WRITER ||
								watch('userType')?.id === UserAccountRole.PRACTIVE_HEAD ||
								watch('userType')?.id ===
									UserAccountRole.FINANCE_EXECUTIVE) && (
								<div className={UserFieldStyle.colMd6}>
									<div
										className={`${UserFieldStyle.formGroup} ${UserFieldStyle.phoneNoGroup}`}>
										<label>Contact</label>
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
												register={register}
												name={'primaryClientPhoneNumber'}
												type={InputType.NUMBER}
												placeholder="Enter number"
											/>
										</div>
									</div>
								</div>
							)}
							{(watch('userType')?.id === UserAccountRole.RESUME_WRITER ||
								watch('userType')?.id === UserAccountRole.PRACTIVE_HEAD ||
								watch('userType')?.id === UserAccountRole.FINANCE_EXECUTIVE ||
								watch('userType')?.id === UserAccountRole.BDR ||
								watch('userType')?.id === UserAccountRole.MARKETING) && (
								<div className={UserFieldStyle.colMd6}>
									<HRInputField
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
							)}
						</div>

						<div className={UserFieldStyle.row}>
							<div className={UserFieldStyle.colMd6}>
								<HRInputField
									register={register}
									leadingIcon={<UploadSVG />}
									label="Profile Picture"
									name="profilePic"
									type={InputType.BUTTON}
									value="Upload Profile Picture"
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
						</div>

						{watch('userType')?.id === UserAccountRole.FINANCE_EXECUTIVE && (
							<div className={UserFieldStyle.row}>
								<div className={UserFieldStyle.colMd12}>
									<HRInputField
										isTextArea={true}
										errors={errors}
										label={'Description'}
										register={register}
										name="description"
										type={InputType.TEXT}
										placeholder="Enter Description"
										rows={'4'}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</form>

			<Divider className={UserFieldStyle.midDivider} />

			<div className={UserFieldStyle.partOne}>
				<div className={UserFieldStyle.hrFieldLeftPane}></div>
				<div className={UserFieldStyle.hrFieldRightPane}>
					<div className={UserFieldStyle.formPanelAction}>
						<button
							style={{
								cursor: type === SubmitType.SUBMIT ? 'no-drop' : 'pointer',
							}}
							disabled={type === SubmitType.SUBMIT}
							className={UserFieldStyle.btnPrimary}
							onClick={handleSubmit(hrSubmitHandler)}>
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
