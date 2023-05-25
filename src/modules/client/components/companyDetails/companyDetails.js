import UploadModal from 'shared/components/uploadModal/uploadModal';
import CompanyDetailsStyle from './companyDetails.module.css';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { InputType ,URLRegEx} from 'constants/application';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { locationFormatter } from 'modules/client/clientUtils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MasterDAO } from 'core/master/masterDAO';
import { ClientDAO } from 'core/client/clientDAO';
import { HTTPStatusCode } from 'constants/network';
import { _isNull } from 'shared/utils/basic_utils';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import { MdOutlinePreview } from 'react-icons/md';
import { Modal, Tooltip } from 'antd';

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
}) => {
	const [GEO, setGEO] = useState([]);
	const [leadSource, setLeadSource] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showUploadModal, setUploadModal] = useState(false);
	const getGEO = async () => {
		const geoLocationResponse = await MasterDAO.getGEORequestDAO();
		setGEO(geoLocationResponse && geoLocationResponse.responseBody);
	};

	const [toggleImagePreview, setToggleImagePreview] = useState(false);
	const [getValidation, setValidation] = useState({
		systemFileUpload: '',
		googleDriveFileUpload: '',
		linkValidation: '',
	});
	const watchCompanyLeadSource = watch('companyLeadSource');

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
				setValue('companyName', '');
			setIsLoading(false);
		},
		[setError, setValue],
	);

	const debounceDuplicateCompanyName = useCallback(
		(data) => {
			let timer;
			if (!_isNull(data)) {
				timer = setTimeout(() => {
					setIsLoading(true);
					getCompanyNameAlreadyExist(data);
				}, 2000);
			}
			return () => clearTimeout(timer);
		},
		[getCompanyNameAlreadyExist],
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
	return (
		<div className={CompanyDetailsStyle.tabsFormItem}>
			<div className={CompanyDetailsStyle.tabsFormItemInner}>
				<div className={CompanyDetailsStyle.tabsLeftPanel}>
					<h3>Company Details</h3>
					<p>Please provide the necessary details</p>
				</div>

				<div className={CompanyDetailsStyle.tabsRightPanel}>
					<div className={CompanyDetailsStyle.row}>
						<div className={CompanyDetailsStyle.colMd6}>
							<HRInputField
								disabled={isLoading}
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
					</div>

					<div className={CompanyDetailsStyle.row}>
						<div className={CompanyDetailsStyle.colMd6}>
							<div className={CompanyDetailsStyle.formGroup}>
								<HRSelectField
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
									Does the client have experience of hiring remotely?
									<span className={CompanyDetailsStyle.reqField}>*</span>
								</label>
								<label className={CompanyDetailsStyle.container}>
									<p>Yes</p>
									<input
										{...register('remote')}
										value={1}
										type="radio"
										checked
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
									mode={'id/value'}
									setValue={setValue}
									register={register}
									name="companyLeadSource"
									label="Lead Source"
									defaultValue="Select Lead Source"
									options={leadSource?.BindLeadType}
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
