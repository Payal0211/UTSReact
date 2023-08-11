import UploadModal from 'shared/components/uploadModal/uploadModal';
import CompanyDetailsStyle from './companyDetails.module.css';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { InputType ,URLRegEx,EmailRegEx} from 'constants/application';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { locationFormatter } from 'modules/client/clientUtils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MasterDAO } from 'core/master/masterDAO';
import { HubSpotDAO } from 'core/hubSpot/hubSpotDAO';
import { ClientDAO } from 'core/client/clientDAO';
import { HTTPStatusCode } from 'constants/network';
import { _isNull } from 'shared/utils/basic_utils';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import { MdOutlinePreview } from 'react-icons/md';
import { Modal, Tooltip, AutoComplete, } from 'antd';
import { Controller } from 'react-hook-form';

const CompanyDetails = ({
	register,
	errors,
	setValue,
	watch,
	setError,
	flagAndCodeMemo,
	base64Image,
	unregister,
	setBase64Image,
	getUploadFileData,
	setUploadFileData,
	setCompanyName,
	companyName,
	control
}) => {
	const [GEO, setGEO] = useState([]);
	const [leadSource, setLeadSource] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showUploadModal, setUploadModal] = useState(false);
	const getGEO = async () => {
		const geoLocationResponse = await MasterDAO.getGEORequestDAO();
		setGEO(geoLocationResponse && geoLocationResponse.responseBody);
	};
	const[checkedValue,setCheckedValue] = useState(true);
	const[checkednoValue,setCheckednoValue] = useState(false);
	const checkedYes = (e) =>{
		setCheckedValue(e.target.checked);
		setCheckednoValue(false);
	}
	const checkedNo = (e) =>{
		setCheckednoValue(e.target.checked);
		setCheckedValue(false);
	}

	const [toggleImagePreview, setToggleImagePreview] = useState(false);
	const [getValidation, setValidation] = useState({
		systemFileUpload: '',
		googleDriveFileUpload: '',
		linkValidation: '',
	});

	const [getCompanyNameSuggestion, setCompanyNameSuggestion] = useState([]);
	const [getCompanyNameMessage, setCompanyNameMessage] = useState('');
	const [companyDetail, setCompanyDetail] = useState({})
	const [showCompanyEmail, setShowCompanyEmail] = useState(false)

	const [controlledCompanyLoacation, setControlledCompanyLoacation] = useState('Please Select')
	const [controlledLeadSource, setControlledLeadSource] = useState('Please Select')

	let controllerRef = useRef(null);

	useEffect(() => {
		if (errors?.companyName?.message) {
			controllerRef.current.focus();
		}
	}, [errors?.companyName]);

	const watchCompanyLeadSource = watch('companyLeadSource');

	const watchCompanyEmail = watch('companyEmail');

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

	const uploadFileHandler = useCallback(
		async (e) => {
			setIsLoading(true);
			let fileData = e.target.files[0];
			if (fileData?.type !== 'image/png' && fileData?.type !== 'image/jpeg' && fileData?.type !== "image/svg+xml") {
				setValidation({
					...getValidation,
					systemFileUpload:
						'Uploaded file is not a valid, Only jpg, jpeg, png, svg files are allowed',
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
				const base64 = await convertToBase64(fileData);

				setValidation({
					...getValidation,
					systemFileUpload: '',
				});
				setIsLoading(false);
				setBase64Image(base64);
				setUploadFileData(fileData.name);
				setUploadModal(false);
			}
		},
		[convertToBase64, getValidation, setBase64Image, setUploadFileData],
	);

	const getLeadSource = useCallback(async () => {
		const getLeadSourceResponse = await MasterDAO.getFixedValueRequestDAO();
		setLeadSource(getLeadSourceResponse && getLeadSourceResponse?.responseBody);
	}, []);

	/** To check Duplicate email exists Start */
	//TODO:- Show loader on Duplicate email caption:- verifying email
	// const watchCompanyName = watch('companyName');

	const getCompanyNameAlreadyExist = useCallback(
		async (data) => {
			let companyNameDuplicate =
				await ClientDAO.getDuplicateCompanyNameRequestDAO(data);
			setError('companyName', {
				type: 'duplicateCompanyName',
				message:
					companyNameDuplicate?.statusCode ===
						HTTPStatusCode.DUPLICATE_RECORD &&
					'This company name already exists. Please enter another company name.',
			});
			companyNameDuplicate.statusCode === HTTPStatusCode.DUPLICATE_RECORD &&
				// setValue('companyName', '');
			setIsLoading(false);
		},
		[setError, setValue],
	);

	const getAutocompleteCompanyName = useCallback(
		async (data) => {
			let companyAutofillData =
				await HubSpotDAO.getAutoCompleteCompanyDAO(data);

				console.log({data, companyAutofillData})

				if(companyAutofillData.statusCode === HTTPStatusCode.OK){
					setShowCompanyEmail(false)
					setCompanyNameSuggestion(companyAutofillData.responseBody.map(item => ({...item, value: item.company})))
				}
				if(companyAutofillData.statusCode === HTTPStatusCode.NOT_FOUND){
					setShowCompanyEmail(true)
				}
			setIsLoading(false);
		},
		[setError, setValue],
	);

	const getCompanyDetails = async (ID) => {
		let companyDetailsData = await HubSpotDAO.getCompanyDetailsDAO(ID)
		console.log({companyDetailsData})

		if(companyDetailsData.statusCode === HTTPStatusCode.OK){
			const {companyDetails} = companyDetailsData.responseBody
			companyDetail && setCompanyDetail(companyDetails)
			companyDetails?.website && setValue('companyURL',companyDetails?.website)
			companyDetails?.linkedInProfile	&& setValue('companyLinkedinProfile',companyDetails?.linkedInProfile)
			companyDetails?.address	&& setValue('companyAddress',companyDetails?.address)
			companyDetails?.companySize && setValue('companySize',companyDetails?.companySize)
		}
	}

	useEffect(()=>{
		if(companyDetail.geO_ID){
			let location = locationFormatter(GEO.filter(loc=> loc.id === companyDetail.geO_ID))
			setValue('companyLocation', location[0].value)
			setControlledCompanyLoacation(location[0].value)
		}
	},[GEO , companyDetail,setValue])


	useEffect(()=>{
		if(companyDetail.leadType){
			let lead = leadSource?.BindLeadType?.filter(loc=> loc.value === companyDetail.leadType)
			setValue('companyLeadSource', lead[0])
			setControlledLeadSource(lead[0].value)
		}
	},[leadSource?.BindLeadType , companyDetail,setValue])

	const getCompanyDetailsByEmail = async (email)=> {

		let response = await HubSpotDAO.getContactsByEmailDAO(email)

		console.log("company email response", response)

		if(response.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR){
			setError('companyEmail',{
				type: 'validate',
				message: 'This email id not exist in Hubspot. Please create Client email id with Company',
			})
		}

	}

	//when company Email changed 
	// useEffect(()=>{
	// 	if(watchCompanyEmail){
	// 		if(watchCompanyEmail.match(EmailRegEx.email)){
	// 			// get company details by email
	// 			console.log('watch Email', watchCompanyEmail)
	// 			getCompanyDetailsByEmail(watchCompanyEmail)
	// 		}
	// 	}
	// },[watchCompanyEmail])

	const handlefetchWithEmail =() => {
		if(watchCompanyEmail){
			if(watchCompanyEmail.match(EmailRegEx.email)){
				// get company details by email
				console.log('watch Email', watchCompanyEmail)
				getCompanyDetailsByEmail(watchCompanyEmail)
			}else{
				setError('companyEmail',{
					type: 'validate',
					message: 'Entered value does not match email format',
				})
			}
		}else{
			setError('companyEmail',{
				type: 'validate',
				message: 'Please enter the Company Email.',
			})
		}
	}

	const debounceDuplicateCompanyName = useCallback(
		(data) => {
			let timer;
			if (!_isNull(data)) {
				timer = setTimeout(() => {
					setIsLoading(true);
					// getCompanyNameAlreadyExist(data);
					getAutocompleteCompanyName(data)
				}, 2000);
			}
			return () => clearTimeout(timer);
		},
		[getAutocompleteCompanyName],
	);

	const watchcompanyName = watch('companyName')

	const getCompanyValue = (clientName, data) => {
		console.log({clientName, data})
		setValue('companyName', clientName);
		setError('companyName', {
			type: 'validate',
			message: '',
		});

		// get company name
		getCompanyDetails(data.companyID)

	};

	const validate = (clientName) => {
		if (!clientName) {
			return 'please enter the company name.';
		} else if (getCompanyNameMessage !== '' && clientName) {
			return getCompanyNameMessage;
		}
		return true;
	};

	const getClientNameSuggestionHandler = useCallback(
		async (clientName) => {
			console.log("companyDetails", clientName)
			setCompanyName(clientName);
			debounceDuplicateCompanyName(clientName);
		// 	let response = await MasterDAO.getEmailSuggestionDAO(clientName);

		// 	if (response?.statusCode === HTTPStatusCode.OK) {
		// 		setCompanyNameSuggestion(response?.responseBody?.details);
		// 		setCompanyNameMessage('');
		// 	} else if (
		// 		response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
		// 		response?.statusCode === HTTPStatusCode.NOT_FOUND
		// 	) {
		// 		setError('clientName', {
		// 			type: 'validate',
		// 			message: response?.responseBody,
		// 		});
		// 		setCompanyNameSuggestion([]);
		// 		setCompanyNameMessage(response?.responseBody);
		// 		//TODO:- JD Dump ID
		// 	}
		},
		[setError],
	);


	/** based on  watchCompanyName-- */
	// useEffect(() => {
	// 	let timer;
	// 	if (!_isNull(watchCompanyName)) {
	// 		timer = setTimeout(() => {
	// 			setIsLoading(true);
	// 			getCompanyNameAlreadyExist(watchCompanyName);
	// 		}, 2000);
	// 	}
	// 	return () => clearTimeout(timer);
	// }, [getCompanyNameAlreadyExist, watchCompanyName]);

	/** To check Duplicate email exists End */
	useEffect(() => {
		getGEO();
		getLeadSource();
	}, [getLeadSource]);

	useEffect(() => {
		if (watchCompanyLeadSource?.id !== 1) unregister('companyLeadSource');
	}, [unregister, watchCompanyLeadSource?.id]);

	// console.log('leadSource',leadSource)
	return (
		<div className={CompanyDetailsStyle.tabsFormItem}>
			<div className={CompanyDetailsStyle.tabsFormItemInner}>
				<div className={CompanyDetailsStyle.tabsLeftPanel}>
					<h3>Company Details</h3>
					<p>Please provide the necessary details</p>
				</div>

				<div className={CompanyDetailsStyle.tabsRightPanel}>
					<div className={CompanyDetailsStyle.row}>
						{/* <div className={CompanyDetailsStyle.colMd6}>
							<HRInputField
								// disabled={isLoading}
								type={InputType.TEXT}
								name="companyName"
								label="HS Company Name"
								errors={errors}
								register={register}
								placeholder="Enter name"
								validationSchema={{
									required: 'Please enter the company name.',
								}}
								onChangeHandler={(e) => {
									setCompanyName(e.target.value);
									debounceDuplicateCompanyName(e.target.value);
								}}
								required
							/>
						</div> */}

						<div className={CompanyDetailsStyle.colMd6}>
							<div className={CompanyDetailsStyle.formGroup}>
											<label>
												Company Name <b style={{ color: 'red' }}>*</b>
											</label>
											<Controller
												render={({ ...props }) => (
													<AutoComplete
														options={getCompanyNameSuggestion}
														onSelect={(clientName, data) =>
															getCompanyValue(clientName,data)
														}
														filterOption={true}
														onSearch={(searchValue) => {
															setCompanyNameSuggestion([]);
															getClientNameSuggestionHandler(searchValue);
														}}
														onChange={(clientName) =>
															setValue('companyName', clientName)
														}
														placeholder={watchcompanyName ? watchcompanyName :"Enter Company Name"}
														ref={controllerRef}
													/>
												)}
												{...register('companyName', {
													validate,
												})}
												name="companyName"
												// rules={{ required: true }}
												control={control}
											/>
											{errors.clientName && (
												<div className={CompanyDetailsStyle.error}>
													{errors.clientName?.message &&
														`* ${errors?.clientName?.message}`}
												</div>
											)}
							</div>
						</div>

						<div className={CompanyDetailsStyle.colMd6}>
							<HRInputField
								register={register}
								errors={errors}
								label="Company URL"
								name="companyURL"
								type={InputType.TEXT}
								validationSchema={{
									required: 'Please enter the profile link.',
									// pattern: {
									// 	value: URLRegEx.url,
									// 	message: 'Entered value does not match url format',
									// },
								}}
								placeholder="Enter profile link"
								required
							/>
						</div>
						
						{showCompanyEmail && <><div className={CompanyDetailsStyle.colMd6}>
							<HRInputField
								register={register}
								errors={errors}
								label="Company Email"
								name="companyEmail"
								type={InputType.TEXT}
								validationSchema={{
									required: 'Please enter the Company Email.',
									pattern: {
										value: EmailRegEx.email,
										message: 'Entered value does not match email format',
									},
								}}
								placeholder="Enter Company Email"
								required
							/>
						</div>
						
						<div className={CompanyDetailsStyle.colMd6} style={{display:'flex', alignItems:'flex-start',paddingTop:'25px'}}>
						
							<button
								// disabled={isLoading}
								type="submit"
								onClick={()=>handlefetchWithEmail()}
								className={CompanyDetailsStyle.btnHubSpot}>
								Fetch Details from HubSpot
							</button>
						</div>
						</> }
					</div>

					<div className={CompanyDetailsStyle.row}>
						<div className={CompanyDetailsStyle.colMd6}>
							<div className={CompanyDetailsStyle.formGroup}>
								<HRSelectField
									isControlled={true}
									controlledValue={controlledCompanyLoacation}
									setControlledValue={setControlledCompanyLoacation}
									setValue={setValue}
									register={register}
									name="companyLocation"
									label="Company Location"
									defaultValue="Select location"
									options={locationFormatter(GEO)}
									required
									isError={
										errors['companyLocation'] && errors['companyLocation']
									}
									errorMsg="Please select a location."
								/>
							</div>
						</div>

						<div className={CompanyDetailsStyle.colMd6}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'Please enter the company size.',
									min: {
										value: 1,
										message: `please don't enter the value less than 1`,
									},
								}}
								label="Company Size"
								name={'companySize'}
								type={InputType.NUMBER}
								placeholder="Company Size "
								required
							/>
						</div>
					</div>

					<div className={CompanyDetailsStyle.row}>
						<div className={CompanyDetailsStyle.colMd12}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'Please enter the company address.',
								}}
								label="Company Address"
								name={'companyAddress'}
								type={InputType.TEXT}
								placeholder="Company Address "
								required
							/>
						</div>
					</div>

					<div className={CompanyDetailsStyle.row}>
						<div className={CompanyDetailsStyle.colMd6}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the linkedin profile.',
									// pattern: {
									// 	value: URLRegEx.url,
									// 	message: 'Entered value does not match url format',
									// },
								}}
								label="Linkedin Profile"
								name={'companyLinkedinProfile'}
								type={InputType.TEXT}
								placeholder="Enter linkedin profile "
								required
							/>
						</div>

						<div className={CompanyDetailsStyle.colMd6}>
							<div
								className={`${CompanyDetailsStyle.formGroup} ${CompanyDetailsStyle.phoneNoGroup}`}>
								<label>
									Phone number
									{/* <span className={CompanyDetailsStyle.reqField}>*</span> */}
								</label>
								<div className={CompanyDetailsStyle.phoneNoCode}>
									<HRSelectField
										searchable={true}
										setValue={setValue}
										register={register}
										name="companyCountryCode"
										defaultValue="+91"
										options={flagAndCodeMemo}
									/>
								</div>
								<div className={CompanyDetailsStyle.phoneNoInput}>
									<HRInputField
										register={register}
										name={'phoneNumber'}
										type={InputType.NUMBER}
										placeholder="Enter Phone number"
									/>
								</div>
							</div>
						</div>
					</div>

					<div className={CompanyDetailsStyle.row}>
						<div className={CompanyDetailsStyle.colMd12}>
							<div className={CompanyDetailsStyle.radioFormGroup}>
								<label>
									Does the client have experience hiring remotely?
									<span className={CompanyDetailsStyle.reqField}>*</span>
								</label>
								<label className={CompanyDetailsStyle.container}>
									<p>Yes</p>
									<input
										{...register('remote')}
										value={1}
										type="radio"
										checked={checkedValue}
										onChange={(e)=>{
											checkedYes(e)
										}}
										id="remote"
										name="remote"
									/>
									<span className={CompanyDetailsStyle.checkmark}></span>
								</label>
								<label className={CompanyDetailsStyle.container}>
									<p>No</p>
									<input
										{...register('remote')}
										value={0}
										type="radio"
										checked={checkednoValue}
										onChange={(e)=>{
											checkedNo(e)
										}}
										id="remote"
										name="remote"
									/>
									<span className={CompanyDetailsStyle.checkmark}></span>
								</label>
							</div>
						</div>
					</div>
					<div className={CompanyDetailsStyle.row}>
						<div className={CompanyDetailsStyle.colMd6}>
							<div className={CompanyDetailsStyle.formGroup}>
								<HRSelectField
									isControlled={true}
									controlledValue={controlledLeadSource}
									setControlledValue={setControlledLeadSource}
									mode={'id/value'}
									setValue={setValue}
									register={register}
									name="companyLeadSource"
									label="Lead Source"
									defaultValue="Select Lead Source"
									options={leadSource?.BindLeadType}
									required
									isError={errors['companyLeadSource'] && errors['companyLeadSource']}
									errorMsg={'Please select lead source'}
								/>
							</div>
						</div>

						{watch('companyLeadSource')?.id === 1 && (
							<div className={CompanyDetailsStyle.colMd6}>
								<div className={CompanyDetailsStyle.formGroup}>
									<HRSelectField
										mode={'id/value'}
										setValue={setValue}
										register={register}
										name="companyInboundType"
										label="Inbound Type"
										defaultValue="Please Select"
										options={leadSource?.BindInBoundDrp}
									/>
								</div>
							</div>
						)}
					</div>
					<div className={CompanyDetailsStyle.row}>
						<div className={CompanyDetailsStyle.colMd12}>
							{!getUploadFileData ? (
								<HRInputField
									register={register}
									leadingIcon={<UploadSVG />}
									label="Company Logo (JPG, PNG, SVG)"
									name="companyLogo"
									type={InputType.BUTTON}
									value="Upload logo"
									onClickHandler={() => setUploadModal(true)}
								/>
							) : (
								<div className={CompanyDetailsStyle.uploadedJDWrap}>
									<label>Company Logo (JPG, PNG, SVG)</label>
									<div className={CompanyDetailsStyle.uploadedJDName}>
										{getUploadFileData}
										<div
											className={CompanyDetailsStyle.uploadedImgPreview}
											onClick={() => setToggleImagePreview(true)}>
											<Tooltip
												placement="top"
												title={'Image Preview'}>
												<MdOutlinePreview />
											</Tooltip>
										</div>
										<CloseSVG
											className={CompanyDetailsStyle.uploadedJDClose}
											onClick={() => {
												// setJDParsedSkills({});
												setUploadFileData('');
											}}
										/>
									</div>
								</div>
							)}
						</div>
						<Modal
							className={CompanyDetailsStyle.imagePreviewModal}
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
						{showUploadModal && (
							<UploadModal
								isFooter={false}
								uploadFileHandler={uploadFileHandler}
								modalTitle={'Upload Logo'}
								openModal={showUploadModal}
								cancelModal={() => setUploadModal(false)}
								setValidation={setValidation}
								getValidation={getValidation}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CompanyDetails;
