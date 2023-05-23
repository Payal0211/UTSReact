import {
	Button,
	Checkbox,
	Divider,
	Space,
	message,
	AutoComplete,
	Modal,
} from 'antd';
import {
	ClientHRURL,
	GoogleDriveCredentials,
	InputType,
	SubmitType,
	WorkingMode,
} from 'constants/application';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HRInputField from '../hrInputFields/hrInputFields';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import HRFieldStyle from './hrFIelds.module.css';
import { PlusOutlined } from '@ant-design/icons';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import UploadModal from 'shared/components/uploadModal/uploadModal';
import HRSelectField from '../hrSelectField/hrSelectField';
import { useForm, Controller } from 'react-hook-form';
import { HTTPStatusCode } from 'constants/network';
import { _isNull, debounceUtils, getPayload } from 'shared/utils/basic_utils';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useLocation } from 'react-router-dom';
import { hrUtils } from 'modules/hiring request/hrUtils';
import { MasterDAO } from 'core/master/masterDAO';
import useDrivePicker from 'react-google-drive-picker/dist';
import useDebounce from 'shared/hooks/useDebounce';
import SpinLoader from 'shared/components/spinLoader/spinLoader';
import WithLoader from 'shared/components/loader/loader';
export const secondaryInterviewer = {
	fullName: '',
	emailID: '',
	linkedin: '',
	designation: '',
};

const HRFields = ({
	setJDDumpID,
	jdDumpID,
	setTitle,
	clientDetail,
	setEnID,
	tabFieldDisabled,
	setTabFieldDisabled,
	setJDParsedSkills,
	contactID,
}) => {
	const [isSavedLoading, setIsSavedLoading] = useState(false);
	const [controlledCountryName, setControlledCountryName] = useState('');
	const inputRef = useRef(null);
	const [getUploadFileData, setUploadFileData] = useState('');
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
	const [getClientNameMessage, setClientNameMessage] = useState('');
	const [getContactAndSaleID, setContactAndSalesID] = useState({
		contactID: '',
		salesID: '',
	});
	const [childCompany, setChildCompany] = useState([]);
	const [isSalesUserPartner, setIsSalesUserPartner] = useState(false);
	const [getDurationType, setDurationType] = useState([]);
	const [getValidation, setValidation] = useState({
		systemFileUpload: '',
		googleDriveFileUpload: '',
		linkValidation: '',
	});
	const [jdURLLink, setJDURLLink] = useState('');
	const [getGoogleDriveLink, setGoogleDriveLink] = useState('');
	const [getClientNameSuggestion, setClientNameSuggestion] = useState([]);
	const [isNewPostalCodeModal, setNewPostalCodeModal] = useState(false);
	const [isPostalCodeNotFound, setPostalCodeNotFound] = useState(false);
	let controllerRef = useRef(null);
	const {
		watch,
		register,
		handleSubmit,
		setValue,
		setError,
		unregister,
		control,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: {
			secondaryInterviewer: [],
		},
	});

	const watchSalesPerson = watch('salesPerson');
	const watchChildCompany = watch('childCompany');

	/* const { fields, append, remove } = useFieldArray({
		control,
		name: 'secondaryInterviewer',
	}); */

	/* ------------------ Upload JD Starts Here ---------------------- */
	const [openPicker, authResponse] = useDrivePicker();

	const uploadFileFromGoogleDriveValidator = useCallback(
		async (fileData) => {
			setValidation({
				...getValidation,
				googleDriveFileUpload: '',
			});
			if (
				fileData[0]?.mimeType !== 'application/vnd.google-apps.document' &&
				fileData[0]?.mimeType !== 'application/pdf' &&
				fileData[0]?.mimeType !== 'text/plain' &&
				fileData[0]?.mimeType !== 'application/docs' &&
				fileData[0]?.mimeType !== 'application/msword' &&
				fileData[0]?.mimeType !== 'image/png' &&
				fileData[0]?.mimeType !== 'image/jpeg' &&
				fileData[0]?.mimeType !==
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			) {
				setValidation({
					...getValidation,
					googleDriveFileUpload:
						'Uploaded file is not a valid, Only pdf, docs, jpg, jpeg, png, text and rtf files are allowed',
				});
			} else if (fileData[0]?.sizeBytes >= 500000) {
				setValidation({
					...getValidation,
					googleDriveFileUpload:
						'Upload file size more than 500kb, Please Upload file upto 500kb',
				});
			} else {
				let fileType;
				let fileName;
				if (fileData[0]?.mimeType === 'application/vnd.google-apps.document') {
					fileType = 'docs';
					fileName = `${fileData[0]?.name}.${fileType}`;
				} else {
					fileName = `${fileData[0]?.name}`;
				}
				const formData = {
					fileID: fileData[0]?.id,
					FileName: fileName,
				};
				let uploadFileResponse =
					await hiringRequestDAO.uploadGoogleDriveFileDAO(formData);

				if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
					setUploadModal(false);
					setUploadFileData(fileName);
					setJDDumpID(uploadFileResponse?.responseBody?.details?.JDDumpID);
					message.success('File uploaded successfully');
				}
			}
		},
		[getValidation, setJDDumpID],
	);

	const uploadFileHandler = useCallback(
		async (e) => {
			setIsLoading(true);
			let fileData = e.target.files[0];

			if (
				fileData?.type !== 'application/pdf' &&
				fileData?.type !== 'application/docs' &&
				fileData?.type !== 'application/msword' &&
				fileData?.type !== 'text/plain' &&
				fileData?.type !==
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
				fileData?.type !== 'image/png' &&
				fileData?.type !== 'image/jpeg'
			) {
				setValidation({
					...getValidation,
					systemFileUpload:
						'Uploaded file is not a valid, Only pdf, docs, jpg, jpeg, png, text and rtf files are allowed',
				});
				setIsLoading(false);
			} else if (fileData?.size >= 500000) {
				setValidation({
					...getValidation,
					systemFileUpload:
						'Upload file size more than 500kb, Please Upload file upto 500kb',
				});
				setIsLoading(false);
			} else {
				let formData = new FormData();
				formData.append('File', fileData);
				let uploadFileResponse = await hiringRequestDAO.uploadFileDAO(formData);
				if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
					if (
						fileData?.type === 'image/png' ||
						fileData?.type === 'image/jpeg'
					) {
						setUploadFileData(fileData?.name);
						setUploadModal(false);
						setValidation({
							...getValidation,
							systemFileUpload: '',
						});
						setJDParsedSkills(
							uploadFileResponse && uploadFileResponse?.responseBody?.details,
						);
						message.success('File uploaded successfully');
					} else if (
						fileData?.type === 'application/pdf' ||
						fileData?.type === 'application/docs' ||
						fileData?.type === 'application/msword' ||
						fileData?.type === 'text/plain' ||
						fileData?.type ===
							'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
					) {
						setUploadFileData(fileData?.name);
						setJDParsedSkills(
							uploadFileResponse && uploadFileResponse?.responseBody?.details,
						);
						setJDDumpID(
							uploadFileResponse &&
								uploadFileResponse?.responseBody?.details?.JDDumpID,
						);
						setUploadModal(false);
						setValidation({
							...getValidation,
							systemFileUpload: '',
						});
						message.success('File uploaded successfully');
					}
				}
				setIsLoading(false);
			}
		},
		[getValidation, setJDDumpID, setJDParsedSkills],
	);

	const googleDriveFileUploader = useCallback(() => {
		openPicker({
			clientId: GoogleDriveCredentials.clientID,
			developerKey: GoogleDriveCredentials.developerKey,
			viewId: 'DOCS',
			// token: token, // pass oauth token in case you already have one
			showUploadView: true,
			showUploadFolders: true,
			supportDrives: true,
			multiselect: true,
			// customViews: customViewsArray, // custom view
			callbackFunction: (data) => {
				if (data?.action === 'cancel') {
				} else {
					if (data?.docs) {
						let uploadFileResponse = uploadFileFromGoogleDriveValidator(
							data?.docs,
						);
						setUploadFileData(uploadFileResponse?.responseBody?.FileName);
						setJDParsedSkills(
							uploadFileResponse && uploadFileResponse?.responseBody?.details,
						);
						setUploadModal(false);
					}
				}
			},
		});
	}, [openPicker, setJDParsedSkills, uploadFileFromGoogleDriveValidator]);

	const uploadFileFromGoogleDriveLink = useCallback(async () => {
		console.log('uploadFileHandler');
		setValidation({
			...getValidation,
			linkValidation: '',
		});
		if (!getGoogleDriveLink) {
			setValidation({
				...getValidation,
				linkValidation: 'Please Enter Google Docs/Drive URL',
			});
		} else if (
			!/https:\/\/docs\.google\.com\/document\/d\/(.*?)\/.*?/g.test(
				getGoogleDriveLink,
			) &&
			!/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?/g.test(
				getGoogleDriveLink,
			)
		) {
			setValidation({
				...getValidation,
				linkValidation: 'Please Enter Google Docs/Drive URL',
			});
		} /* else if (
			!/https:\/\/docs\.google\.com\/document\/d\/(.*?)\/.*?/g.test(
				getGoogleDriveLink,
			)
		) {
			setValidation({
				...getValidation,
				linkValidation: 'Please Enter Google Docs/Drive URL',
			});
		}  */ else {
			let uploadFileResponse =
				await hiringRequestDAO.uploadFileFromGoogleDriveLinkDAO(
					getGoogleDriveLink,
				);
			if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
				setUploadModal(false);
				setGoogleDriveLink('');
				message.success('File uploaded successfully');
			}
		}
	}, [
		getGoogleDriveLink,
		getValidation,
		setGoogleDriveLink,
		setUploadModal,
		setValidation,
	]);

	/* ------------------ Upload JD Ends Here -------------------- */
	let prefRegion = watch('region');
	let modeOfWork = watch('workingMode');
	let hrRole = watch('role');
	let watchOtherRole = watch('otherRole');

	const getNRMarginHandler = useCallback(async () => {
		const response = await MasterDAO.getNRMarginRequestDAO();
		if (response?.statusCode === HTTPStatusCode.OK) {
			setValue('NRMargin', response && response?.responseBody?.details?.value);
		}
	}, [setValue]);

	const getTimeZonePreference = useCallback(async () => {
		const timeZone = await MasterDAO.getTimeZonePreferenceRequestDAO(
			prefRegion && prefRegion?.id,
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

	const watchPostalCode = watch('postalCode');
	console.log(errors, '-errors');
	const postalCodeHandler = useCallback(
		async (flag) => {
			const countryResponse = await MasterDAO.getCountryByPostalCodeRequestDAO({
				...getPayload(flag, {
					countryCode: watch('country')?.id || '',
					postalCode: watch('postalCode') || '',
				}),
			});
			if (countryResponse?.statusCode === HTTPStatusCode.OK) {
				const response = countryResponse?.responseBody?.details;
				setCountry(countryResponse && response);
				if (response?.stateCityData === 'postal code not find') {
					setNewPostalCodeModal(true);
					setValue('city', '');
					setValue('state', '');
				} else if (response.getCountry?.length === 1) {
					setControlledCountryName(response?.getCountry?.[0]?.value);
					setValue('city', response?.stateCityData?.province);
					setValue('state', response?.stateCityData?.stateEn);
					clearErrors('country');
				} else {
					setControlledCountryName('');
					setValue('city', '');
					setValue('state', '');
				}
			} else {
				setCountry([]);
			}
		},
		[clearErrors, setValue, watch],
	);

	const CheckSalesUserIsPartner = useCallback(
		async (getContactAndSaleID) => {
			const response = await MasterDAO.checkIsSalesPersonDAO(
				getContactAndSaleID,
			);
			if (response?.statusCode === HTTPStatusCode.OK) {
				if (response?.responseBody?.details?.SaleUserIsPartner) {
					setIsSalesUserPartner(
						response?.responseBody?.details?.SaleUserIsPartner,
					);
					const newChildCompanyList =
						response?.responseBody?.details?.ChildCompanyList.filter(
							(ele, index) => index !== 0,
						);
					setChildCompany([]);
					setChildCompany((prev) =>
						newChildCompanyList.map(
							({ childCompanyID, childCompanyName }) =>
								childCompanyID !== -1 && {
									id: childCompanyID,
									value: childCompanyName,
								},
						),
					);
					setChildCompany((prev) => [
						...prev,
						{ id: 0, value: 'Add Other Company' },
					]);
				}
			} else {
				setError('salesPerson', {
					type: 'validate',
					message: 'Sales Person is not partner',
				});
			}
		},
		[setError],
	);
	const toggleJDHandler = useCallback((e) => {
		setJDURLLink(e.target.value);
		// clearErrors();
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

	const getTalentRole = useCallback(async () => {
		const talentRole = await MasterDAO.getTalentsRoleRequestDAO();

		setTalentRole(talentRole && talentRole.responseBody);
		setTalentRole((preValue) => [
			...preValue,
			{
				id: -1,
				value: 'Others',
			},
		]);
	}, []);

	const getDurationTypes = useCallback(async () => {
		const durationTypes = await MasterDAO.getDurationTypeDAO();
		setDurationType(durationTypes && durationTypes?.responseBody?.details);
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
			name && setItems([...items, name + ' months' || name]);
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

	const getClientNameValue = (clientName) => {
		setValue('clientName', clientName);
		setError('clientName', {
			type: 'validate',
			message: '',
		});
	};

	const getClientNameSuggestionHandler = useCallback(
		async (clientName) => {
			let response = await MasterDAO.getEmailSuggestionDAO(clientName);

			if (response?.statusCode === HTTPStatusCode.OK) {
				setClientNameSuggestion(response?.responseBody?.details);
				setClientNameMessage('');
			} else if (
				response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
				response?.statusCode === HTTPStatusCode.NOT_FOUND
			) {
				setError('clientName', {
					type: 'validate',
					message: response?.responseBody,
				});
				setClientNameSuggestion([]);
				setClientNameMessage(response?.responseBody);
				//TODO:- JD Dump ID
			}
		},
		[setError],
	);

	const validate = (clientName) => {
		if (!clientName) {
			return 'please enter the client email/name.';
		} else if (getClientNameMessage !== '' && clientName) {
			return getClientNameMessage;
		}
		return true;
	};
	let filteredMemo = useMemo(() => {
		let filteredData = getClientNameSuggestion?.filter(
			(item) => item?.value === watchClientName,
		);
		return filteredData;
	}, [getClientNameSuggestion, watchClientName]);
	const getHRClientName = useCallback(async () => {
		let existingClientDetails =
			await hiringRequestDAO.getClientDetailRequestDAO(
				filteredMemo[0]?.emailId,
			);

		existingClientDetails?.statusCode === HTTPStatusCode.OK &&
			setContactAndSalesID((prev) => ({
				...prev,
				contactID: existingClientDetails?.responseBody?.contactid,
			}));

		/* setError('clientName', {
			type: 'duplicateCompanyName',
			message:
				existingClientDetails?.statusCode === HTTPStatusCode.NOT_FOUND &&
				'Client email does not exist.',
		}); */
		existingClientDetails.statusCode === HTTPStatusCode.NOT_FOUND &&
			setValue('clientName', '');
		existingClientDetails.statusCode === HTTPStatusCode.NOT_FOUND &&
			setValue('companyName', '');
		existingClientDetails.statusCode === HTTPStatusCode.OK &&
			setValue('companyName', existingClientDetails?.responseBody?.name);
		existingClientDetails.statusCode === HTTPStatusCode.OK &&
			setIsCompanyNameAvailable(true);
		setIsLoading(false);
	}, [filteredMemo, setValue]);

	const getOtherRoleHandler = useCallback(
		async (data) => {
			let response = await MasterDAO.getOtherRoleRequestDAO({
				roleName: data,
				roleID: 0,
			});
			if (response?.statusCode === HTTPStatusCode?.BAD_REQUEST) {
				return setError('otherRole', {
					type: 'otherRole',
					message: response?.responseBody,
				});
			}
		},
		[setError],
	);
	useEffect(() => {
		let timer;
		if (!_isNull(watchOtherRole)) {
			timer = setTimeout(() => {
				setIsLoading(true);
				getOtherRoleHandler(watchOtherRole);
			}, 2000);
		}
		return () => clearTimeout(timer);
	}, [getOtherRoleHandler, watchOtherRole]);
	const watchCountry = watch('country');
	const { isReady, debouncedFunction } = useDebounce(postalCodeHandler, 2000);
	useEffect(() => {
		// if (watchPostalCode < 0 || _isNull(watchPostalCode)) {
		// 	setError('postalCode', {
		// 		type: 'postalCode',
		// 		message: 'Please enter valid postal code',
		// 	});
		// } else {
		// 	clearErrors('postalCode');
		// 	!isPostalCodeNotFound && debouncedFunction('POSTAL_CODE');
		// }
		!isPostalCodeNotFound && debouncedFunction('POSTAL_CODE');
	}, [debouncedFunction, watchPostalCode, isPostalCodeNotFound]);
	useEffect(() => {
		if (country && country?.getCountry?.length > 1 && watchCountry) {
			!isPostalCodeNotFound && debouncedFunction('COUNTRY_CODE');
		}
	}, [country, debouncedFunction, isPostalCodeNotFound, watchCountry]);

	useEffect(() => {
		let timer;
		if (!_isNull(watchClientName)) {
			timer =
				pathName === ClientHRURL.ADD_NEW_HR &&
				setTimeout(() => {
					setIsLoading(true);
					getHRClientName();
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
		if (getContactAndSaleID?.contactID && getContactAndSaleID?.salesID)
			CheckSalesUserIsPartner(getContactAndSaleID);
	}, [CheckSalesUserIsPartner, getContactAndSaleID]);

	useEffect(() => {
		!_isNull(prefRegion) && getTimeZonePreference();
		getAvailability();
		getTalentRole();
		getSalesPerson();
		getRegion();
		getWorkingMode();
		// postalCodeHandler();
		getHowSoon();
		getNRMarginHandler();
		getDurationTypes();
	}, [
		getAvailability,
		getSalesPerson,
		getTalentRole,
		getTimeZonePreference,
		getRegion,
		prefRegion,
		getHowSoon,
		getWorkingMode,
		// postalCodeHandler,
		getNRMarginHandler,
		getDurationTypes,
	]);
	useEffect(() => {
		setValidation({
			systemFileUpload: '',
			googleDriveFileUpload: '',
			linkValidation: '',
		});
		setGoogleDriveLink('');
	}, [showUploadModal]);

	useEffect(() => {
		isHRDirectPlacement === false && unregister('dpPercentage');
	}, [isHRDirectPlacement, unregister]);

	useEffect(() => {
		if (modeOfWork?.value === 'Remote') {
			unregister(['address', 'city', 'state', 'country', 'postalCode']);
		}
	}, [modeOfWork, unregister]);

	useEffect(() => {
		hrRole !== 'others' && unregister('otherRole');
	}, [hrRole, unregister]);
	/** To check Duplicate email exists End */

	const [messageAPI, contextHolder] = message.useMessage();

	const hrSubmitHandler = useCallback(
		async (d, type = SubmitType.SAVE_AS_DRAFT) => {
			setIsSavedLoading(true);
			let hrFormDetails = hrUtils.hrFormDataFormatter(
				d,
				type,
				watch,
				contactID || getContactAndSaleID?.contactID,
				isHRDirectPlacement,
				addHRResponse,
				getUploadFileData && getUploadFileData,
				jdDumpID,
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
				setIsSavedLoading(false);
				setAddHRResponse(addHRRequest?.responseBody?.details);
				setEnID(addHRRequest?.responseBody?.details?.en_Id);
				if (!!addHRRequest?.responseBody?.details?.jdURL)
					setJDParsedSkills({
						Skills: [],
						Responsibility: '',
						Requirements: '',
					});
				type !== SubmitType.SAVE_AS_DRAFT && setTitle('Debriefing HR');

				type !== SubmitType.SAVE_AS_DRAFT &&
					setTabFieldDisabled({ ...tabFieldDisabled, debriefingHR: false });

				type === SubmitType.SAVE_AS_DRAFT &&
					messageAPI.open({
						type: 'success',
						content: 'HR details has been saved to draft.',
					});
			}
		},
		[
			addHRResponse,
			contactID,
			getContactAndSaleID?.contactID,
			getUploadFileData,
			isHRDirectPlacement,
			jdDumpID,
			messageAPI,
			setEnID,
			setError,
			setJDParsedSkills,
			setTabFieldDisabled,
			setTitle,
			tabFieldDisabled,
			watch,
		],
	);

	useEffect(() => {
		setValue('hrTitle', hrRole?.value);
	}, [hrRole?.value, setValue]);

	useEffect(() => {
		if (errors?.clientName?.message) {
			controllerRef.current.focus();
		}
	}, [errors?.clientName]);

	useEffect(() => {
		setContactAndSalesID((prev) => ({ ...prev, salesID: watchSalesPerson }));
	}, [watchSalesPerson]);

	const durationDataMemo = useMemo(() => {
		let formattedDuration = [];
		getDurationType?.filter(
			(item) =>
				item?.value !== '0' &&
				formattedDuration.push({
					id: item?.value,
					value: item?.text,
				}),
		);
		return formattedDuration;
	}, [getDurationType]);

	return (
		<WithLoader
			showLoader={isSavedLoading}
			className="mainLoader">
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
							{pathName === ClientHRURL.ADD_NEW_CLIENT ? (
								<div className={HRFieldStyle.colMd12}>
									<HRInputField
										disabled={
											pathName === ClientHRURL.ADD_NEW_CLIENT ||
											isCompanyNameAvailable ||
											isLoading
										}
										register={register}
										errors={errors}
										validationSchema={{
											required: 'please enter the client name.',
										}}
										label="Client Email/Name"
										name="clientName"
										type={InputType.TEXT}
										placeholder="Enter Client Email/Name"
										required
									/>
								</div>
							) : (
								<div className={HRFieldStyle.colMd12}>
									<div className={HRFieldStyle.formGroup}>
										<label>
											Client Email/Name <b style={{ color: 'black' }}>*</b>
										</label>
										<Controller
											render={({ ...props }) => (
												<AutoComplete
													options={getClientNameSuggestion}
													onSelect={(clientName) =>
														getClientNameValue(clientName)
													}
													filterOption={true}
													onSearch={(searchValue) => {
														setClientNameSuggestion([]);
														getClientNameSuggestionHandler(searchValue);
													}}
													onChange={(clientName) =>
														setValue('clientName', clientName)
													}
													placeholder="Enter Client Email/Name"
													ref={controllerRef}
												/>
											)}
											{...register('clientName', {
												validate,
											})}
											name="clientName"
											// rules={{ required: true }}
											control={control}
										/>
										{errors.clientName && (
											<div className={HRFieldStyle.error}>
												{errors.clientName?.message &&
													`* ${errors?.clientName?.message}`}
											</div>
										)}
									</div>
								</div>
							)}
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
										label={'Sales Person'}
										defaultValue="Select sales Person"
										options={salesPerson && salesPerson}
										name="salesPerson"
										isError={errors['salesPerson'] && errors['salesPerson']}
										required
										errorMsg={
											errors?.salesPerson?.message ||
											'Please select hiring request sales person'
										}
									/>
								</div>
							</div>

							{isSalesUserPartner && (
								<div className={HRFieldStyle.colMd6}>
									<div className={HRFieldStyle.formGroup}>
										<HRSelectField
											setValue={setValue}
											mode="id/value"
											register={register}
											label={'Child Companies'}
											defaultValue="Select Company"
											options={childCompany && childCompany}
											name="childCompany"
											isError={errors['childCompany'] && errors['childCompany']}
										/>
									</div>
								</div>
							)}

							{watchChildCompany?.id === 0 && (
								<div className={HRFieldStyle.colMd6}>
									<div className={HRFieldStyle.formGroup}>
										<HRInputField
											register={register}
											errors={errors}
											label={'Other Child Company Name'}
											name="otherChildCompanyName"
											type={InputType.TEXT}
											placeholder="Child Company"
										/>
									</div>
								</div>
							)}

							<div className={HRFieldStyle.colMd6}>
								<div className={HRFieldStyle.formGroup}>
									<HRSelectField
										mode={'id/value'}
										searchable={true}
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
						{watch('role')?.id === -1 && (
							<div className={HRFieldStyle.row}>
								<div className={HRFieldStyle.colMd12}>
									<HRInputField
										register={register}
										errors={errors}
										validationSchema={{
											required: 'please enter the other role.',
											pattern: {
												value: /^((?!other).)*$/,
												message: 'Please remove "other" keyword.',
											},
										}}
										label="Other Role"
										name="otherRole"
										type={InputType.TEXT}
										placeholder="Enter Other role"
										maxLength={50}
										required
									/>
								</div>
							</div>
						)}
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
						<div className={`${HRFieldStyle.row} ${HRFieldStyle.fieldOr}`}>
							<div className={HRFieldStyle.colMd6}>
								{!getUploadFileData ? (
									<HRInputField
										disabled={jdURLLink}
										register={register}
										leadingIcon={<UploadSVG />}
										label={`Job Description *`}
										name="jdExport"
										type={InputType.BUTTON}
										buttonLabel="Upload JD File"
										// value="Upload JD File"
										onClickHandler={() => setUploadModal(true)}
										required={!jdURLLink && getUploadFileData}
										validationSchema={{
											required: 'please select a file.',
										}}
										errors={errors}
									/>
								) : (
									<div className={HRFieldStyle.uploadedJDWrap}>
										<label>Job Description (PDF) *</label>
										<div className={HRFieldStyle.uploadedJDName}>
											{getUploadFileData}{' '}
											<CloseSVG
												className={HRFieldStyle.uploadedJDClose}
												onClick={() => {
													setUploadFileData('');
												}}
											/>
										</div>
									</div>
								)}
							</div>
							{showUploadModal && (
								<UploadModal
									isGoogleDriveUpload={true}
									isLoading={isLoading}
									uploadFileHandler={uploadFileHandler}
									googleDriveFileUploader={() => googleDriveFileUploader()}
									uploadFileFromGoogleDriveLink={uploadFileFromGoogleDriveLink}
									modalTitle={'Upload JD'}
									modalSubtitle={'Job Description'}
									isFooter={true}
									openModal={showUploadModal}
									setUploadModal={setUploadModal}
									cancelModal={() => setUploadModal(false)}
									setValidation={setValidation}
									getValidation={getValidation}
									getGoogleDriveLink={getGoogleDriveLink}
									setGoogleDriveLink={setGoogleDriveLink}
								/>
							)}
							<div className={HRFieldStyle.orLabel}>OR</div>
							<div className={HRFieldStyle.colMd6}>
								<HRInputField
									onChangeHandler={(e) => toggleJDHandler(e)}
									disabled={getUploadFileData}
									label="Job Description URL"
									name="jdURL"
									type={InputType.TEXT}
									placeholder="Add JD link"
									register={register}
									required={!getUploadFileData}
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
									type={InputType.TEXT}
									placeholder="Select NR margin percentage"
									required
								/>
							</div>
						</div>

						<div className={HRFieldStyle.row}>
							<div className={HRFieldStyle.colMd4}>
								<div className={HRFieldStyle.formGroup}>
									<HRSelectField
										setValue={setValue}
										register={register}
										label={'Long Term/Short Term'}
										defaultValue="Select Term"
										options={durationDataMemo}
										name="getDurationType"
										isError={
											errors['getDurationType'] && errors['getDurationType']
										}
										required
										errorMsg={'Please select duration type'}
									/>
								</div>
							</div>
							<div className={HRFieldStyle.colMd4}>
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
														required
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
							<div className={HRFieldStyle.colMd4}>
								<div className={HRFieldStyle.formGroup}>
									<HRInputField
										required
										label="Required Experience"
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
								</div>
							</div>
						</div>
						<div className={HRFieldStyle.row}>
							<div className={HRFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the number of talents.',
										min: {
											value: 1,
											message: `please enter the value more than 0`,
										},
									}}
									label="How many talents are needed."
									name="talentsNumber"
									type={InputType.NUMBER}
									placeholder="Please enter number of talents needed"
									required
								/>
							</div>
							<div className={HRFieldStyle.colMd6}>
								<div className={HRFieldStyle.formGroup}>
									<HRSelectField
										mode={'id/value'}
										setValue={setValue}
										register={register}
										label={'Availability'}
										defaultValue="Select availability"
										options={availability}
										name="availability"
										isError={errors['availability'] && errors['availability']}
										required
										errorMsg={'Please select the availability.'}
									/>
								</div>
							</div>
						</div>
						<div className={HRFieldStyle.row}>
							<div className={HRFieldStyle.colMd6}>
								<div className={HRFieldStyle.formGroup}>
									<HRSelectField
										mode={'id/value'}
										setValue={setValue}
										register={register}
										label={'Select Region'}
										defaultValue="Select Region"
										options={region && region}
										name="region"
										isError={errors['region'] && errors['region']}
										required
										errorMsg={'Please select the region.'}
									/>
								</div>
							</div>
							<div className={HRFieldStyle.colMd6}>
								<div className={HRFieldStyle.formGroup}>
									<HRSelectField
										mode={'id/value'}
										disabled={_isNull(prefRegion)}
										setValue={setValue}
										register={register}
										label={'Select Time Zone'}
										defaultValue="Select time zone"
										options={timeZonePref}
										name="timeZone"
										isError={errors['timeZone'] && errors['timeZone']}
										required
										errorMsg={'Please select hiring request time zone.'}
									/>
								</div>
							</div>
						</div>
						<div className={HRFieldStyle.row}>
							<div className={HRFieldStyle.colMd6}>
								<div className={HRFieldStyle.formGroup}>
									<HRSelectField
										mode={'id/value'}
										setValue={setValue}
										register={register}
										label={'How soon can they join?'}
										defaultValue="Select how soon?"
										options={howSoon}
										name="howSoon"
										isError={errors['howSoon'] && errors['howSoon']}
										required
										errorMsg={'Please select the how soon.'}
									/>
								</div>
							</div>
							<div className={HRFieldStyle.colMd6}>
								<HRInputField
									register={register}
									label="Deal ID"
									name="dealID"
									type={InputType.NUMBER}
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

						<div className={HRFieldStyle.row}>
							<div className={HRFieldStyle.colMd12}>
								<div className={HRFieldStyle.checkBoxGroup}>
									<Checkbox onClick={toggleHRDirectPlacement}>
										Is this HR a Direct Placement?
									</Checkbox>
								</div>
							</div>
						</div>
						<br />
						<div className={HRFieldStyle.row}>
							<div className={HRFieldStyle.colMd6}>
								<div className={HRFieldStyle.formGroup}>
									<HRSelectField
										mode={'id/value'}
										searchable={false}
										setValue={setValue}
										register={register}
										label={'Mode of Working?'}
										defaultValue="Select working mode"
										options={workingMode && workingMode}
										name="workingMode"
										isError={errors['workingMode'] && errors['workingMode']}
										required
										errorMsg={'Please select the working mode.'}
									/>
								</div>
							</div>
							{isHRDirectPlacement && (
								<div className={HRFieldStyle.colMd6}>
									<HRInputField
										register={register}
										errors={errors}
										validationSchema={{
											required: 'please enter the DP Percentage.',
										}}
										label="DP Percentage"
										name="dpPercentage"
										type={InputType.NUMBER}
										placeholder="Enter the DP Percentage"
										required
									/>
								</div>
							)}
						</div>

						{getWorkingModelFields()}
					</form>
				</div>
				<Divider />
				{/* <AddInterviewer
				errors={errors}
				append={append}
				remove={remove}
				register={register}
				fields={fields}
			/> */}

				<div className={HRFieldStyle.formPanelAction}>
					<button
						style={{
							cursor: type === SubmitType.SUBMIT ? 'no-drop' : 'pointer',
						}}
						disabled={type === SubmitType.SUBMIT}
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
		</WithLoader>
	);

	function getWorkingModelFields() {
		if (
			watch('workingMode') === undefined ||
			watch('workingMode').value === undefined ||
			watch('workingMode').value === WorkingMode.REMOTE
		) {
			return null;
		} else {
			return (
				<>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the postal code.',
									min: {
										value: 0,
										message: `please don't enter the value less than 0`,
									},
								}}
								label="Postal Code"
								name="postalCode"
								type={InputType.NUMBER}
								placeholder="Enter the Postal Code"
								// onChangeHandler={postalCodeHandler}
								required
							/>
						</div>
						<div className={HRFieldStyle.colMd6}>
							<div className={HRFieldStyle.formGroup}>
								<HRSelectField
									setControlledValue={setControlledCountryName}
									controlledValue={controlledCountryName}
									isControlled={true}
									mode={'id/value'}
									searchable={false}
									setValue={setValue}
									register={register}
									label={'Country'}
									defaultValue="Select country"
									options={country?.getCountry || []}
									name="country"
									isError={errors['country'] && errors['country']}
									required={!controlledCountryName}
									errorMsg={'Please select the country.'}
								/>
							</div>
						</div>
					</div>

					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the state.',
								}}
								label="State"
								name="state"
								type={InputType.TEXT}
								placeholder="Enter the State"
								required
							/>
						</div>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the city.',
								}}
								label="City"
								name="city"
								type={InputType.TEXT}
								placeholder="Enter the City"
								required
							/>
						</div>
					</div>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd12}>
							<HRInputField
								isTextArea={true}
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the address.',
								}}
								label="Address"
								name="address"
								type={InputType.TEXT}
								placeholder="Enter the Address"
								required
							/>
						</div>
					</div>
					{isNewPostalCodeModal && (
						<Modal
							footer={false}
							title="Postal Code Not Found"
							open={isNewPostalCodeModal}
							onCancel={() => setNewPostalCodeModal(false)}>
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								<h3>Are you sure you want to proceed?</h3>
							</div>
							<div className={HRFieldStyle.formPanelAction}>
								<button
									type="submit"
									onClick={() => {
										setPostalCodeNotFound(true);
										setNewPostalCodeModal(false);
									}}
									className={HRFieldStyle.btnPrimary}>
									OK
								</button>
								<button
									onClick={() => {
										setValue('postalCode', '');
										setPostalCodeNotFound(false);
										setNewPostalCodeModal(false);
									}}
									className={HRFieldStyle.btn}>
									Cancel
								</button>
							</div>
						</Modal>
					)}
				</>
			);
		}
	}
};

export default HRFields;
