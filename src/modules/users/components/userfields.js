import { Button, Checkbox, Divider, Space, message, Radio } from 'antd';
import {
	ClientHRURL,
	InputType,
	MastersKey,
	SubmitType,
	WorkingMode,
} from 'constants/application';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HRInputField from '../../hiring request/components/hrInputFields/hrInputFields';
import UserFieldStyle from './userFields.module.css';
// import UserFieldStyle from './hrFIelds.module.css';
import { PlusOutlined } from '@ant-design/icons';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import UploadModal from 'shared/components/uploadModal/uploadModal';
// import { MasterDAO } from 'core/master/masterDAO';

import HRSelectField from '../../hiring request/components/hrSelectField/hrSelectField';
import { useFieldArray, useForm } from 'react-hook-form';
// import AddInterviewer from '../addInterviewer/addInterviewer';
import { HTTPStatusCode } from 'constants/network';
import { _isNull } from 'shared/utils/basic_utils';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useLocation } from 'react-router-dom';
import { hrUtils } from 'modules/hiring request/hrUtils';
import { useMastersAPI } from 'shared/hooks/useMastersAPI';
import { MasterDAO } from 'core/master/masterDAO';
import { getFlagAndCodeOptions } from 'modules/client/clientUtils';
export const secondaryInterviewer = {
	fullName: '',
	emailID: '',
	linkedin: '',
	designation: '',
};

const UsersFields = ({
	setTitle,
	clientDetail,
	setEnID,
	tabFieldDisabled,
	setTabFieldDisabled,
}) => {
	const inputRef = useRef(null);
	/* const mastersKey = useMemo(() => {
        return {
            availability: MastersKey.AVAILABILITY,
            timeZonePref: MastersKey.TIMEZONE,
            talentRole: MastersKey.TALENTROLE,
            salesPerson: MastersKey.SALESPERSON,
        };
    }, []); */
	// const { returnState } = useMastersAPI(mastersKey);
	// const { availability, timeZonePref, talentRole, salesPerson } = returnState;
	const [availability, setAvailability] = useState([]);
	const [timeZonePref, setTimeZonePref] = useState([]);
	const [workingMode, setWorkingMode] = useState([]);
	const [talentRole, setTalentRole] = useState([]);
	const [country, setCountry] = useState([]);
	const [salesPerson, setSalesPerson] = useState([]);
	const [howSoon, setHowSoon] = useState([]);
	const [region, setRegion] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [items, setItems] = useState(['3 months', '6 months', '12 months']);
	const [name, setName] = useState('');
	const [pathName, setPathName] = useState('');
	const [showUploadModal, setUploadModal] = useState(false);
	const [isCompanyNameAvailable, setIsCompanyNameAvailable] = useState(false);
	const [addHRResponse, setAddHRResponse] = useState(null);
	const [type, setType] = useState('');
	const [isHRDirectPlacement, setHRDirectPlacement] = useState(false);
	const [flagAndCode, setFlagAndCode] = useState([]);

	const {
		watch,
		register,
		handleSubmit,
		setValue,
		setError,
		// control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			secondaryInterviewer: [],
		},
	});

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

	useEffect(() => {
		getCodeAndFlag();
	}, []);

	/* const { fields, append, remove } = useFieldArray({
        control,
        name: 'secondaryInterviewer',
    }); */
	let prefRegion = watch('region');
	const getTimeZonePreference = useCallback(async () => {
		const timeZone = await MasterDAO.getTimeZonePreferenceRequestDAO(
			prefRegion && prefRegion,
		);
		setTimeZonePref(timeZone && timeZone.responseBody);
	}, [prefRegion]);
	const getAvailability = useCallback(async () => {
		const availabilityResponse = await MasterDAO.getFixedValueRequestDAO();
		setAvailability(
			availabilityResponse &&
				availabilityResponse.responseBody?.BindHiringAvailability,
		);
	}, []);
	const getHowSoon = useCallback(async () => {
		const howSoonResponse = await MasterDAO.getHowSoonRequestDAO();
		setHowSoon(howSoonResponse && howSoonResponse.responseBody);
	}, []);

	const getWorkingMode = useCallback(async () => {
		const workingModeResponse = await MasterDAO.getModeOfWorkDAO();
		setWorkingMode(
			workingModeResponse && workingModeResponse?.responseBody?.details,
		);
	}, []);
	const getCountry = useCallback(async () => {
		const countryResponse = await MasterDAO.getCountryDAO();
		setCountry(countryResponse && countryResponse?.responseBody?.details);
	}, []);
	const getTalentRole = useCallback(async () => {
		const talentRole = await MasterDAO.getTalentsRoleRequestDAO();

		setTalentRole(talentRole && talentRole.responseBody);
		setTalentRole((preValue) => [
			...preValue,
			{
				id: 'others',
				value: 'Others',
			},
		]);
	}, []);

	const getSalesPerson = useCallback(async () => {
		const salesPersonResponse = await MasterDAO.getSalesManRequestDAO();
		setSalesPerson(
			salesPersonResponse && salesPersonResponse?.responseBody?.details,
		);
	}, []);

	const getRegion = useCallback(async () => {
		let response = await MasterDAO.getTalentTimeZoneRequestDAO();
		setRegion(response && response?.responseBody);
	}, []);

	const getLocation = useLocation();

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

	const watchClientName = watch('clientName');
	const toggleHRDirectPlacement = useCallback((e) => {
		// e.preventDefault();
		setHRDirectPlacement(e.target.checked);
	}, []);
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
			setValue('clientName', clientDetail?.clientemail);
		pathName === ClientHRURL.ADD_NEW_CLIENT &&
			setValue('companyName', clientDetail?.companyname);
	}, [
		getLocation.pathname,
		clientDetail?.clientemail,
		clientDetail?.companyname,
		pathName,
		setValue,
	]);

	useEffect(() => {
		!_isNull(prefRegion) && getTimeZonePreference();
		getAvailability();
		getTalentRole();
		getSalesPerson();
		getRegion();
		getWorkingMode();
		getCountry();
		getHowSoon();
	}, [
		getAvailability,
		getSalesPerson,
		getTalentRole,
		getTimeZonePreference,
		getRegion,
		prefRegion,
		getHowSoon,
		getWorkingMode,
		getCountry,
	]);
	/** To check Duplicate email exists End */

	const [messageAPI, contextHolder] = message.useMessage();

	const hrSubmitHandler = async (d, type = SubmitType.SAVE_AS_DRAFT) => {
		let hrFormDetails = hrUtils.hrFormDataFormatter(
			d,
			type,
			watch,
			clientDetail?.contactId,
			isHRDirectPlacement,
			addHRResponse,
		);

		if (type === SubmitType.SAVE_AS_DRAFT) {
			if (_isNull(watch('clientName'))) {
				return setError('clientName', {
					type: 'emptyClientName',
					message: 'Please enter the client name.',
				});
			}
		} else if (type !== SubmitType.SAVE_AS_DRAFT) {
			setType(SubmitType.SUBMIT);
		}
		const addHRRequest = await hiringRequestDAO.createHRDAO(hrFormDetails);

		if (addHRRequest.statusCode === HTTPStatusCode.OK) {
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
		}
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

						<div className={UserFieldStyle.row}>
							<div className={UserFieldStyle.colMd12}>
								<div
									className={`${UserFieldStyle.radioFormGroup} ${UserFieldStyle.newUserRadioGroup}`}>
									<label>
										Is the User New?
										<span className={UserFieldStyle.reqField}>*</span>
									</label>
									<Radio.Group
										defaultValue={1}
										className={UserFieldStyle.radioGroup}>
										<Radio value={1}>Yes</Radio>
										<Radio value={2}>No</Radio>
									</Radio.Group>
								</div>
							</div>
						</div>

						<div className={UserFieldStyle.row}>
							<div className={UserFieldStyle.colMd6}>
								<div className={UserFieldStyle.formGroup}>
									<HRSelectField
										setValue={setValue}
										register={register}
										label={'User Team'}
										defaultValue="Select sales Person"
										options={salesPerson && salesPerson}
										placeholderText="Please Select"
										name="userTeam"
										isError={errors['salesPerson'] && errors['salesPerson']}
										required
										errorMsg={'Please select user team'}
									/>
								</div>
							</div>
							<div className={UserFieldStyle.colMd6}>
								<div className={UserFieldStyle.formGroup}>
									<HRSelectField
										setValue={setValue}
										register={register}
										label={'User Type'}
										defaultValue="Select sales Person"
										options={salesPerson && salesPerson}
										name="userType"
										isError={errors['salesPerson'] && errors['salesPerson']}
										required
										errorMsg={'Please select user type'}
									/>
								</div>
							</div>
						</div>

						<div className={UserFieldStyle.row}>
							<div className={UserFieldStyle.colMd6}>
								<div className={UserFieldStyle.formGroup}>
									<HRSelectField
										setValue={setValue}
										register={register}
										label={'Manager'}
										defaultValue="Select sales Person"
										options={salesPerson && salesPerson}
										placeholderText="Please Select"
										name="manager"
										isError={errors['salesPerson'] && errors['salesPerson']}
										required
										errorMsg={'Please select manager'}
									/>
								</div>
							</div>
							<div className={UserFieldStyle.colMd6}>
								<div className={UserFieldStyle.formGroup}>
									<HRInputField
										register={register}
										errors={errors}
										validationSchema={{
											required: 'please enter priority count',
										}}
										label="Priority Count"
										name="prioritycount"
										type={InputType.TEXT}
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
							<div className={UserFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'Please enter skype ID',
									}}
									label={'Skype'}
									name="skypeId"
									type={InputType.TEXT}
									placeholder="Enter Link"
									required
								/>
							</div>
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
											placeholder="Enternumber"
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
						</div>

						<div className={UserFieldStyle.row}>
							<div className={UserFieldStyle.colMd12}>
								<HRInputField
									register={register}
									leadingIcon={<UploadSVG />}
									label="Profile Picture"
									name="jdExport"
									type={InputType.BUTTON}
									value="Upload Profile Picture"
									onClickHandler={() => setUploadModal(true)}
								/>
							</div>
							<UploadModal
								modalTitle={'Upload Logo'}
								isFooter={false}
								openModal={showUploadModal}
								cancelModal={() => setUploadModal(false)}
							/>
						</div>

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
							onClick={hrSubmitHandler}>
							Submit
						</button>

						<button
							onClick={handleSubmit(hrSubmitHandler)}
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
