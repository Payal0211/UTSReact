import React, { useRef } from 'react';
import { Divider, Modal, Tooltip } from 'antd';
import { InputType, SubmitType, UserAccountRole } from 'constants/application';
import { useCallback, useEffect, useMemo, useState } from 'react';
import HRInputField from '../../../hiring request/components/hrInputFields/hrInputFields';
import UserFieldStyle from './userFields.module.css';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import UploadModal from 'shared/components/uploadModal/uploadModal';
// import { MasterDAO } from 'core/master/masterDAO';
import { MdOutlinePreview } from 'react-icons/md';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
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
import { HttpServices } from 'shared/services/http/http_service';

export const secondaryInterviewer = {
	fullName: '',
	emailID: '',
	linkedin: '',
	designation: '',
};

const UsersFields = ({ id, setLoading, loading }) => {
	const [enableAllFields, setEnableAllFields] = useState(false);
	const [userDetails, setUserDetails] = useState(null);
	const [toggleImagePreview, setToggleImagePreview] = useState(false);
	const [base64Image, setBase64Image] = useState('');
	const [getValidation, setValidation] = useState({
		systemFileUpload: '',
		googleDriveFileUpload: '',
		linkValidation: '',
	});
	const [getUploadFileData, setUploadFileData] = useState({});
	const [userTypeEdit, setUserTypeEdit] = useState('Select');
	const [controlledUserRole, setControlledUserRole] = useState('Select');
	const [departMentTypeEdit, setDepartMentEdit] = useState('Select');
	const [levelTypeEdit, setLevelEdit] = useState('Select');
	const [teamTypeEdit, setTeamTypeEdit] = useState('Select');
	const [reportTypeEdit, setReportTypeEdit] = useState('Select');
	const [getGEOType, setGEOType] = useState('');
	const [specificGeo, setSpecificGEO] = useState('Select');

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
	const [modifiedGEO, setModifiedGEO] = useState([]);
	const [talentRole, setTalentRole] = useState([]);
	const [showUploadModal, setUploadModal] = useState(false);
	const [type, setType] = useState('');
	const [flagAndCode, setFlagAndCode] = useState([]);
	const [getDepartment, setDepartment] = useState([{ id: 0, value: 'Select' }]);
	const [getTeamList, setTeamList] = useState([]);
	const [getTeamListEdit, setTeamListEdit] = useState([
		{ id: 0, value: 'Select' },
	]);
	const [getLevelList, seLevelList] = useState([{ id: 0, value: 'Select' }]);
	const [getReportingList, setReportingList] = useState([
		{ id: 0, value: 'Select' },
	]);
	const [getGeoSpecificList, setGeoSpecificList] = useState([
		{ id: 0, value: 'Select' },
		{ id: 1, value: 'Yes' },
		{ id: 2, value: 'No' },
	]);
	const [getEmployementMessage, setEmploymentMessage] = useState('');

	const convertToBase64 = useCallback((file) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = () => {
				resolve(fileReader.result);
			};
			fileReader.onerror = (error) => {
				reject(error);
			};
		});
	}, []);

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
	let watchUserType = watch('userType');
	let watchReporteeManager = watch('salesManager');
	let watchUserRole = watch('userRole');
	const watchEmployeeID = watch('employeeId');
	const watchEmployeeFirstName = watch('employeeFirstName');
	const watchEmployeeLastName = watch('employeeLastName');
	const watchDepartMentName = watch('departMent');
	const watchTeamName = watch('team');
	const watchLevelName = watch('level');
	const watchReportingUser = watch('reportingUser');
	const watchGEO = watch('geo');
	const watchGEOSpecific = watch('geoSpecific');
	const uploadFile = useRef(null);

	console.log(watch(), "setValue");

	const getEmployeeIDAlreadyExist = useCallback(
		async (data) => {
			let companyNameDuplicate = await userDAO.getIsEmployeeIDExistRequestDAO({
				userID: id !== 0 ? id : 0,
				employeeID: data,
			});
			if (companyNameDuplicate?.statusCode === HTTPStatusCode.BAD_REQUEST) {
				setError('employeeId', {
					type: 'duplicateEmployeeID',
					message:
						companyNameDuplicate?.statusCode === HTTPStatusCode.BAD_REQUEST &&
						'This employee ID already exists. Please enter another one.',
				});
			}
			if (companyNameDuplicate?.statusCode === HTTPStatusCode.OK) {
				clearErrors('employeeId');
			}
			if (companyNameDuplicate?.statusCode === HTTPStatusCode.BAD_REQUEST) {
				setEmploymentMessage(
					'This employee ID already exists.Please enter another one.',
				);
			}
			companyNameDuplicate.statusCode === HTTPStatusCode.DUPLICATE_RECORD &&
				setValue('employeeId', '');

			if (companyNameDuplicate?.statusCode === HTTPStatusCode.OK) {
				setEmploymentMessage('');
			}
			setIsLoading(false);
		},
		[id, setError, setValue],
	);
	const getEmployeeFullNameAlreadyExist = useCallback(
		async (firstName, lastName) => {
			let companyNameDuplicate = await userDAO.getIsEmployeeNameExistRequestDAO(
				{
					userID: id !== 0 ? id : 0,
					employeeName: `${firstName} ${lastName}`,
				},
			);
			if (companyNameDuplicate?.statusCode === HTTPStatusCode.OK) {
				clearErrors('employeeFirstName');
			}

			if (companyNameDuplicate?.statusCode === HTTPStatusCode.BAD_REQUEST) {
				setError('employeeFirstName', {
					type: 'duplicateEmployeeFullName',
					message:
						companyNameDuplicate?.statusCode === HTTPStatusCode.BAD_REQUEST &&
						'This employee name already exists. Please enter another one.',
				});
			}
			companyNameDuplicate.statusCode === HTTPStatusCode.DUPLICATE_RECORD &&
				setValue('employeeFirstName', '');
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
		if (!_isNull(watchEmployeeFirstName)) {
			timer = setTimeout(() => {
				setIsLoading(true);
				getEmployeeFullNameAlreadyExist(
					watchEmployeeFirstName,
					watchEmployeeLastName,
				);
			}, 2000);
		}
		return () => clearTimeout(timer);
	}, [
		getEmployeeFullNameAlreadyExist,
		watchEmployeeFirstName,
		watchEmployeeLastName,
	]);
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
	}, []);

	const getBDRMarketingOnUserType = useCallback(async () => {
		let response = await MasterDAO.getBDRMarketingBasedOnUserTypeRequestDAO({
			roleID: watchUserRole,
		});
		setBDRManager(response && response?.responseBody?.details);
	}, [watchUserRole]);

	const getUserType = useCallback(async () => {
		let response = await MasterDAO.getUserTypeRequestDAO();
		setUserType(response && response?.responseBody?.details);
	}, []);

	const getGEO = useCallback(async () => {
		let response = await MasterDAO.getGEORequestDAO();
		setGEO(response && response?.responseBody);
	}, []);

	const getDepartMentType = useCallback(async () => {
		setDepartment([{ id: 0, value: 'Select' }]);
		let response = await MasterDAO.getDepartmentRequestDAO();
		setDepartment((prev) => [...prev, ...response?.responseBody?.details]);
	}, []);

	const getTeamType = useCallback(async () => {
		let response = await MasterDAO.getTeamListRequestDAO();
		setTeamList(response && response?.responseBody?.details);
	}, []);

	const getLevelType = useCallback(async () => {
		seLevelList([{ id: 0, value: 'Select' }]);
		let response = await MasterDAO.getLevelListRequestDAO();
		seLevelList((prev) => [...prev, ...response?.responseBody?.details]);
	}, []);

	const getReportingType = useCallback(
		async (departId, levelId) => {
			setReportTypeEdit('Select');
			resetField('reportingUser');
			setReportingList([{ id: 0, value: 'Select' }]);
			let response = await MasterDAO.getReportingListRequestDAO(
				departId,
				levelId,
			);
			if (response?.responseBody?.details?.length > 0) {
				setReportingList((prev) => [
					...prev,
					...response?.responseBody?.details.map(({ id, fullName }) => ({
						id: id,
						value: fullName,
					})),
				]);
			} else if (response?.responseBody?.details === null) {
				setReportingList([{ id: 0, value: 'Select' }]);
			}
		},
		[watchDepartMentName, watchLevelName],
	);

	useEffect(() => {
		if (
			watchDepartMentName?.value === 'Select' ||
			watchDepartMentName?.value === 'Administration'
		) {
			resetField('level', { keepError: false });
			resetField('reportingUser', { keepError: false });
			resetField('geoSpecific', { keepError: false });
			resetField('geo', { keepError: false });
			resetField('team', { keepError: false });
			setLevelEdit('Select');
			setGEOType('');
			setSpecificGEO('Select');
			setReportTypeEdit('Select');
			setTeamTypeEdit('Select');
			resetField('departMent');
		}
		if (
			!enableALlFieldsMemo &&
			watchDepartMentName?.value !== 'Select' &&
			watchDepartMentName?.value !== 'Administration'
		) {
			setTeamTypeEdit('Select');
			setReportTypeEdit('Select');
			setLevelEdit('Select');
			setGEOType('');
			setSpecificGEO('Select');
			resetField('team');
			resetField('level');
			resetField('reportingUser');
			resetField('geoSpecific');
			resetField('geo');
		}
	}, [watchDepartMentName]);

	useEffect(() => {
		if (watchLevelName?.value === 'Select') {
			resetField('reportingUser', { keepError: false });
			resetField('geoSpecific', { keepError: false });
			resetField('geo', { keepError: false });
			setGEOType('');
			setSpecificGEO('Select');
			setReportTypeEdit('Select');
			resetField('level');
		}
		if (!enableALlFieldsMemo && watchLevelName?.value !== 'Select') {
			resetField('reportingUser');
			setReportTypeEdit('Select');
		}
	}, [watchLevelName]);

	useEffect(() => {
		if (watchTeamName?.value === 'Select') {
			resetField('level', { keepError: false });
			resetField('reportingUser', { keepError: false });
			resetField('geoSpecific', { keepError: false });
			resetField('geo', { keepError: false });
			setReportTypeEdit('Select');
			setLevelEdit('Select');
			setGEOType('');
			setSpecificGEO('Select');
			resetField('team');
		}
		if (!enableALlFieldsMemo && watchTeamName?.value !== 'Select') {
			resetField('level');
			resetField('reportingUser');
			resetField('geoSpecific');
			resetField('geo');
			setReportTypeEdit('Select');
			setLevelEdit('Select');
			setGEOType('');
			setSpecificGEO('Select');
		}
	}, [watchTeamName]);

	useEffect(() => {
		if (watchGEOSpecific?.value === 'Select') {
			resetField('geo');
			setGEOType('');
		} else if (watchGEOSpecific?.value === 'No') {
			setGEOType('');
			resetField('geo');
		}
	}, [watchGEOSpecific]);

	// useEffect(() => {
	// 	setTeamListEdit((prev) => [...prev, ...(getTeamList?.filter((ele) => parseInt(ele?.text) === watchDepartMentName?.id))]);
	// }, [watchDepartMentName, userDetails?.teamID])

	useEffect(() => {
		if (
			watchDepartMentName?.id &&
			watchLevelName?.id &&
			watchDepartMentName?.value !== 'Select' &&
			watchLevelName.value !== 'Select'
		) {
			getReportingType(watchDepartMentName?.id, watchLevelName?.id);
		}
	}, [watchDepartMentName, watchLevelName]);

	useEffect(() => {
		if (watchDepartMentName?.value !== 'Select' && watchDepartMentName?.id) {
			setTeamListEdit([{ id: 0, value: 'Select' }]);
			setTeamListEdit((prev) => [
				...prev,
				...getTeamList?.filter(
					(ele) => parseInt(ele?.text) === watchDepartMentName?.id,
				),
			]);
		}
	}, [watchDepartMentName]);

	useEffect(() => {
		setModifiedGEO([]);
		watchGEO?.map(({ id }) => setModifiedGEO((prev) => [...prev, id]));
	}, [watchGEO]);

	useEffect(() => {
		(!_isNull(watchUserType) || id !== 0) && getUserRoles();
		!_isNull(watchUserType) && getGEO();
		!_isNull(watchReporteeManager) && getReporteeManager();
		!_isNull(watchUserRole) && getBDRMarketingOnUserType();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		id !== 0 && getUserDetails();
		getCodeAndFlag();
		getOPSTeamManager();
		getUserType();
		getTeamManager();
		getSalesMan();
		getTalentRole();
	}, [id]);

	useEffect(() => {
		setDepartment([{ id: 0, value: 'Select' }]);
		seLevelList([{ id: 0, value: 'Select' }]);
		setReportingList([{ id: 0, value: 'Select' }]);
		setTeamListEdit([{ id: 0, value: 'Select' }]);
		setGEO([]);
		setTeamList([]);
		getDepartMentType();
		getTeamType();
		getLevelType();
		getGEO();
	}, []);

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

	const enableALlFieldsMemo = useMemo(
		() => id !== 0 && !enableAllFields,
		[enableAllFields, id],
	);
	const editButtonHandler = useCallback(() => {
		setEnableAllFields(true);
	}, []);

	const userSubmitHandler = useCallback(
		async (d, type = SubmitType.SAVE_AS_DRAFT) => {
			let userFormDetails = userUtils.userDataFormatter(
				d,
				id,
				base64Image,
				getUploadFileData,
				modifiedGEO,
			);
			let userResponse = await userAPI.createUserRequest(userFormDetails);

			if (userResponse.statusCode === HTTPStatusCode.OK) {
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
		[id, navigate, base64Image, getUploadFileData, modifiedGEO],
	);

	const uploadFileHandler = useCallback(
		async (fileData) => {
			setIsLoading(true);
			if (fileData?.type !== 'image/png' && fileData?.type !== 'image/jpeg') {
				setValidation({
					...getValidation,
					systemFileUpload:
						'Uploaded file is not a valid, Only jpg, jpeg, png files are allowed',
				});
				setIsLoading(false);
			} else if (fileData?.size > 2000000) {
				setValidation({
					...getValidation,
					systemFileUpload:
						'Upload file size more than 2MB, Please Upload file upto 2MB',
				});
				setIsLoading(false);
			} else {
				const base64 = await convertToBase64(fileData);
				setValidation({
					...getValidation,
					systemFileUpload: '',
				});
				setBase64Image(base64);
				setUploadFileData({ name: fileData?.name, type: fileData?.type });
				setUploadModal(false);
				setIsLoading(false);
			}
		},
		[convertToBase64, getValidation],
	);

	useEffect(() => {
		if (getDepartment.length > 1) {
			getDepartment?.map((item) => {
				if (item?.id === userDetails?.deptID) {
					setDepartMentEdit(item?.value);
					setValue('departMent', item);
				}
			});
		}
	}, [userDetails, getDepartment]);

	useEffect(() => {
		if (getTeamListEdit.length > 1) {
			getTeamListEdit?.map((item) => {
				if (item?.id === userDetails?.teamID) {
					setTeamTypeEdit(item?.value);
					setValue('team', item);
				}
			});
		}
	}, [userDetails, getTeamListEdit]);

	useEffect(() => {
		if (getLevelList.length > 1) {
			getLevelList?.map((item) => {
				if (item?.id === userDetails?.levelID) {
					setLevelEdit(item?.value);
					setValue('level', item);
				}
			});
		}
	}, [userDetails, getLevelList]);

	useEffect(() => {
		if (getReportingList.length > 1) {
			getReportingList?.map((item) => {
				if (item?.id === userDetails?.userHierarchyParentID) {
					setReportTypeEdit(item?.value);
					setValue('reportingUser', item);
				}
			});
		}
	}, [userDetails, getReportingList]);

	useEffect(() => {
		const modifiedGeo = GEO?.filter((item) => {
			if (userDetails?.detail?.geoIDs.includes(item?.id)) {
				return item;
			}
		});
		setGEOType(modifiedGeo);
		setValue('geo', modifiedGeo);
	}, [userDetails, GEO]);

	useEffect(() => {
		if (enableALlFieldsMemo) {
			setValue('employeeLastName', userDetails?.fullName?.split(' ')[1]);
			setValue('employeeFirstName', userDetails?.fullName?.split(' ')[0]);
			setValue('employeeId', userDetails?.employeeId);
			setValue('skypeID', userDetails?.skypeId);
			setValue('emailID', userDetails?.emailId);
			setValue('primaryClientPhoneNumber', userDetails?.contactNumber);
			setValue('employeeDesignation', userDetails?.designation);
			setValue('description', userDetails?.description);
			setUploadFileData({
				name: userDetails?.profilePic,
				type: userDetails?.fileUpload?.extenstion,
			});
			setBase64Image(userDetails?.fileUpload?.base64ProfilePic);

			if (userDetails?.detail?.geoIDs?.length > 0) {
				setSpecificGEO('Yes');
				setValue('geoSpecific', { id: 1, value: 'Yes' });
			} else {
				setSpecificGEO('No');
				setValue('geoSpecific', { id: 2, value: 'No' });
			}
		}
	}, [userDetails]);

	return (
		<div className={UserFieldStyle.hrFieldContainer}>
			<form id="hrForm">
				<div className={UserFieldStyle.partOne}>
					<div className={UserFieldStyle.hrFieldLeftPane}>
						<h3>{id === 0 ? 'Add New User' : 'Edit User'}</h3>
						<p>Please provide the necessary details</p>
						{enableALlFieldsMemo && (
							<div className={UserFieldStyle.formPanelAction}>
								<button
									style={{
										cursor: type === SubmitType.SUBMIT ? 'no-drop' : 'pointer',
									}}
									disabled={type === SubmitType.SUBMIT}
									className={UserFieldStyle.btnPrimary}
									onClick={editButtonHandler}>
									Edit User
								</button>
							</div>
						)}
					</div>

					<div className={UserFieldStyle.hrFieldRightPane}>
						<div className={UserFieldStyle.row}>
							<div className={UserFieldStyle.colMd6}>
								<HRInputField
									disabled={enableALlFieldsMemo || isLoading}
									register={register}
									errors={errors}
									validationSchema={{
										validate: (value) => {
											if (getEmployementMessage) {
												return getEmployementMessage;
											} else if (!value) {
												return 'Please enter employee ID';
											}
										},
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
									// defaultValue={enableALlFieldsMemo ? userDetails?.fullName?.split(" ")[0] : null}
									disabled={enableALlFieldsMemo || isLoading}
									register={register}
									errors={errors}
									validationSchema={{
										validate: (value) => {
											if (!value.trim()) {
												return 'Please enter first name';
											} else if (!/^[a-zA-Z ]*$/.test(value.trim())) {
												return 'Please enter only alphabets';
											}
										},
									}}
									label="First Name"
									name="employeeFirstName"
									type={InputType.TEXT}
									placeholder="Enter First Name"
									required
								/>
							</div>
							<div className={UserFieldStyle.colMd6}>
								<HRInputField
									disabled={enableALlFieldsMemo || isLoading}
									register={register}
									errors={errors}
									validationSchema={{
										validate: (value) => {
											if (!value.trim()) {
												return 'Please enter last name';
											} else if (!/^[a-zA-Z ]*$/.test(value.trim())) {
												return 'Please enter only alphabets';
											}
										},
									}}
									label="Last Name"
									name="employeeLastName"
									type={InputType.TEXT}
									placeholder="Enter Last Name"
									required
								/>
							</div>
							{/* {(watch('userType')?.id === UserAccountRole.SALES ||
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
								)} */}
							{/* <div className={UserFieldStyle.colMd6}>
								<div className={UserFieldStyle.formGroup}>
									<HRSelectField
										controlledValue={userTypeEdit}
										setControlledValue={setUserTypeEdit}
										isControlled={true}
										disabled={enableALlFieldsMemo}
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
							</div> */}

							<div className={UserFieldStyle.colMd6}>
								<div className={UserFieldStyle.formGroup}>
									<HRSelectField
										controlledValue={departMentTypeEdit}
										setControlledValue={setDepartMentEdit}
										isControlled={true}
										mode="id/value"
										setValue={setValue}
										register={register}
										label={'Department'}
										defaultValue={'Select'}
										options={getDepartment && getDepartment}
										name="departMent"
									// isError={errors['departMent'] && errors['departMent']}
									// required
									// errorMsg={'Please select department'}
									/>
								</div>
							</div>

							{watchDepartMentName &&
								watchDepartMentName?.value !== 'Administration' &&
								watchDepartMentName?.value !== 'Select' && (
									<div className={UserFieldStyle.colMd6}>
										<div className={UserFieldStyle.formGroup}>
											<HRSelectField
												controlledValue={teamTypeEdit}
												setControlledValue={setTeamTypeEdit}
												isControlled={true}
												mode="id/value"
												setValue={setValue}
												register={register}
												label={'Team'}
												defaultValue={'Select'}
												options={getTeamListEdit && getTeamListEdit}
												name="team"
												isError={errors['team'] && errors['team']}
												required
												errorMsg={'Please select team'}
											/>
										</div>
									</div>
								)}

							{watchTeamName &&
								watchDepartMentName &&
								watchDepartMentName?.value !== 'Administration' &&
								watchTeamName?.value !== 'Select' &&
								watchDepartMentName?.value !== 'Select' && (
									<div className={UserFieldStyle.colMd6}>
										<div className={UserFieldStyle.formGroup}>
											<HRSelectField
												controlledValue={levelTypeEdit}
												setControlledValue={setLevelEdit}
												isControlled={true}
												mode="id/value"
												setValue={setValue}
												register={register}
												label={'Level'}
												defaultValue={'Select'}
												options={getLevelList && getLevelList}
												name="level"
												isError={errors['level'] && errors['level']}
												required
												errorMsg={'Please select level'}
											/>
										</div>
									</div>
								)}

							{watchLevelName &&
								watchLevelName?.value !== 'Select' &&
								watchDepartMentName?.value !== 'Administration' &&
								watchDepartMentName?.value !== 'Select' && (
									<div className={UserFieldStyle.colMd6}>
										<div className={UserFieldStyle.formGroup}>
											<HRSelectField
												controlledValue={specificGeo}
												setControlledValue={setSpecificGEO}
												isControlled={true}
												mode="id/value"
												setValue={setValue}
												register={register}
												label={'Is this Geo Specific?'}
												defaultValue={
													'Select                                                               '
												}
												options={getGeoSpecificList && getGeoSpecificList}
												name="geoSpecific"
												isError={errors['geoSpecific'] && errors['geoSpecific']}
												required
												errorMsg={'Please select geo specific'}
											/>
										</div>
									</div>
								)}

							{watchGEOSpecific?.value === 'Yes' &&
								watchDepartMentName?.value !== 'Select' &&
								watchDepartMentName?.value !== 'Administration' && (
									<div className={UserFieldStyle.colMd6}>
										{/* <div className={UserFieldStyle.formGroup}>
									<HRSelectField
										isControlled={true}
										mode="multiple"
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
									/> */}
										<div className={UserFieldStyle.mb50}>
											<HRSelectField
												isControlled={true}
												controlledValue={getGEOType}
												setControlledValue={setGEOType}
												mode="multiple"
												setValue={setValue}
												register={register}
												label={'Geo'}
												placeholder="Please Select"
												options={GEO && GEO}
												name="geo"
											/>
										</div>
									</div>
								)}

							{getReportingList?.length > 1 &&
								watchLevelName &&
								watchDepartMentName &&
								watchDepartMentName?.value !== 'Administration' &&
								watchLevelName?.value !== 'Select' &&
								watchDepartMentName?.value !== 'Select' && (
									<div className={UserFieldStyle.colMd6}>
										<div className={UserFieldStyle.formGroup}>
											<HRSelectField
												controlledValue={reportTypeEdit}
												setControlledValue={setReportTypeEdit}
												isControlled={true}
												mode="id/value"
												setValue={setValue}
												register={register}
												label={'Reporting User'}
												defaultValue={'Select'}
												options={getReportingList && getReportingList}
												name="reportingUser"
											/>
										</div>
									</div>
								)}

							{/* {(watch('userType')?.id === UserAccountRole.SALES ||
								watch('userType')?.id === UserAccountRole.SALES_MANAGER ||
								watch('userType')?.id === UserAccountRole.BDR ||
								watch('userType')?.id === UserAccountRole.MARKETING) && (
									<div className={UserFieldStyle.colMd6}>
										<div className={UserFieldStyle.formGroup}>
											<HRSelectField
												controlledValue={controlledUserRole}
												setControlledValue={setControlledUserRole}
												isControlled={true}
												disabled={enableALlFieldsMemo}
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
								)} */}
							{/* {(watch('userType')?.id === UserAccountRole.TALENTOPS ||
								watch('userType')?.id === UserAccountRole.OPS_TEAM_MANAGER) && (
									<div className={UserFieldStyle.colMd6}>
										<div className={UserFieldStyle.formGroup}>
											<HRSelectField
												disabled={enableALlFieldsMemo}
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
								)} */}

							{/* {watch('userType')?.id === UserAccountRole.BDR &&
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
							) : null} */}
							{/* {watch('userType')?.id === UserAccountRole.BDR &&
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
							) : null} */}
							{/* {watch('userType')?.id === UserAccountRole.MARKETING &&
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
							) : null} */}
							{/* {watch('userType')?.id === UserAccountRole.MARKETING &&
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
							) : null} */}
							{/* {(watch('userType')?.id === UserAccountRole.SALES ||
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
									</div>)} */}

							{/*

							{watch('userType')?.id === UserAccountRole.SALES_MANAGER && (
								<div className={UserFieldStyle.colMd6}>
									<HRInputField
										value={enableALlFieldsMemo ? userDetails?.fullName : null}
										disabled={enableALlFieldsMemo && true}
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
							)} */}
							{/* {watch('userType')?.id === UserAccountRole.SALES && (
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
							)} */}
							{/* {watch('userType')?.id === UserAccountRole.TALENTOPS && (
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
							)} */}
							{/* {!_isNull(watch('salesManager')?.id) &&
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
							) : null} */}
							{/* {!_isNull(watch('opsTeamManager')?.id) &&
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
							) : null} */}
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
									defaultValue={
										enableALlFieldsMemo ? userDetails?.skypeId : null
									}
									value={watch('skypeID')}
									// errors={errors}
									// validationSchema={{
									// 	required: 'Please enter skype ID',
									// }}
									label={'Skype'}
									name="skypeID"
									type={InputType.TEXT}
									placeholder="Enter Link"
								// required={
								// 	watch('userType')?.id === UserAccountRole.SALES ||
								// 	watch('userType')?.id === UserAccountRole.TALENTOPS ||
								// 	watch('userType')?.id === UserAccountRole.PRACTIVE_HEAD ||
								// 	watch('userType')?.id === UserAccountRole.FINANCE_EXECUTIVE
								// }
								/>
							</div>
							<div className={UserFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										validate: (value) => {
											if (!value.trim()) {
												return 'Please enter email address';
											} else if (
												!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value.trim())
											) {
												return 'Please enter valid email';
											}
										},
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
										{/* {watch('userType')?.id === UserAccountRole.SALES ||
											watch('userType')?.id === UserAccountRole.TALENTOPS ||
											watch('userType')?.id === UserAccountRole.PRACTIVE_HEAD ||
											watch('userType')?.id === UserAccountRole.FINANCE_EXECUTIVE
											? '*'
											: null} */}
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
											// required={watch('userType')?.id === UserAccountRole.SALES}
											register={register}
											name={'primaryClientPhoneNumber'}
											type={InputType.NUMBER}
											placeholder="Enter number"
										// validationSchema={{
										// 	required: 'Please enter contact number',
										// }}
										/>
									</div>
								</div>
							</div>

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
							<div className={UserFieldStyle.colMd12}>
								{Object.keys(getUploadFileData).length === 0 ? (
									<HRInputField
										// value={userDetails?.profilePic ? userDetails?.profilePic : 'Upload Profile Picture'}
										buttonLabel="Upload Profile Picture"
										register={register}
										leadingIcon={<UploadSVG />}
										label="Profile Picture"
										name="profilePic"
										type={InputType.BUTTON}
										onClickHandler={() => setUploadModal(true)}
									/>
								) : (
									<div className={UserFieldStyle.uploadedJDWrap}>
										<label>Company Logo (JPG, PNG, SVG)</label>
										<div className={UserFieldStyle.uploadedJDName}>
											{getUploadFileData?.name}
											<div
												className={UserFieldStyle.uploadedImgPreview}
												onClick={() => setToggleImagePreview(true)}>
												<Tooltip
													placement="top"
													title={'Image Preview'}>
													<MdOutlinePreview />
												</Tooltip>
											</div>
											<CloseSVG
												className={UserFieldStyle.uploadedJDClose}
												onClick={() => {
													setUploadFileData({});
												}}
											/>
										</div>
									</div>
								)}

								{/* {!getUploadFileData ? (
									<HRInputField
										disabled={!_isNull(watch('jdURL'))}
										register={register}
										leadingIcon={<UploadSVG />}
										label="Job Description (PDF)"
										name="jdExport"
										type={InputType.BUTTON}
										buttonLabel="Upload JD File"
										// value="Upload JD File"
										onClickHandler={() => setUploadModal(true)}
										required
										validationSchema={{
											required: 'please select a file.',
										}}
										errors={errors}
									/>
								) : (
									<div className={HRFieldStyle.uploadedJDWrap}>
										<label>Job Description (PDF)</label>
										<div className={HRFieldStyle.uploadedJDName}>
											{getUploadFileData}{' '}
											<CloseSVG
												className={HRFieldStyle.uploadedJDClose}
												onClick={() => {
													// setJDParsedSkills({});
													setUploadFileData('');
												}}
											/>
										</div>
									</div>
								)} */}
							</div>
							{/* {watch('userType')?.id === UserAccountRole.PRACTIVE_HEAD && (
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
							)} */}

							<Modal
								className={UserFieldStyle.imagePreviewModal}
								width={'500px'}
								centered
								footer={false}
								open={toggleImagePreview}
								onCancel={() => setToggleImagePreview(false)}>
								<img
									src={base64Image}
									alt="preview"
								/>
							</Modal>
							<UploadModal
								isFooter={false}
								uploadFileRef={uploadFile}
								uploadFileHandler={(e) => uploadFileHandler(e.target.files[0])}
								modalTitle={'Add Profile Pic.'}
								openModal={showUploadModal}
								cancelModal={() => setUploadModal(false)}
								setValidation={setValidation}
								getValidation={getValidation}
								isLoading={isLoading}
								isGoogleDriveUpload={false}
								imageSize={2}
							/>
							<div className={UserFieldStyle.colMd12}>
								<HRInputField
									// required={
									// 	watch('userType')?.id === UserAccountRole.SALES ||
									// 	watch('userType')?.id === UserAccountRole.TALENTOPS ||
									// 	watch('userType')?.id === UserAccountRole.PRACTIVE_HEAD ||
									// 	watch('userType')?.id === UserAccountRole.FINANCE_EXECUTIVE
									// }
									isTextArea={true}
									// errors={
									// 	(watch('userType')?.id === UserAccountRole.SALES ||
									// 		watch('userType')?.id === UserAccountRole.TALENTOPS ||
									// 		watch('userType')?.id === UserAccountRole.PRACTIVE_HEAD ||
									// 		watch('userType')?.id ===
									// 		UserAccountRole.FINANCE_EXECUTIVE) &&
									// 	errors
									// }
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
							// 	cursor: enableALlFieldsMemo? 'no-drop' : 'pointer',
							// }}
							// disabled={enableALlFieldsMemo && true}
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
