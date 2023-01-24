import UploadModal from 'shared/components/uploadModal/uploadModal';
import CompanyDetailsStyle from './companyDetails.module.css';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { InputType } from 'constants/application';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { locationFormatter } from 'modules/client/clientUtils';
import { useCallback, useEffect, useState } from 'react';
import { MasterDAO } from 'core/master/masterDAO';
import { ClientDAO } from 'core/client/clientDAO';
import { HTTPStatusCode } from 'constants/network';
import { _isNull } from 'shared/utils/basic_utils';

const CompanyDetails = ({
	register,
	errors,
	setValue,
	watch,
	setError,
	flagAndCodeMemo,
}) => {
	const [GEO, setGEO] = useState([]);
	const [leadSource, setLeadSource] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showUploadModal, setUploadModal] = useState(false);
	const getGEO = async () => {
		const geoLocationResponse = await MasterDAO.getGEORequestDAO();
		setGEO(geoLocationResponse && geoLocationResponse.responseBody);
	};

	const getLeadSource = async () => {
		const getLeadSourceResponse = await MasterDAO.getFixedValueRequestDAO();
		setLeadSource(getLeadSourceResponse && getLeadSourceResponse.responseBody);
	};
	/** To check Duplicate email exists Start */
	//TODO:- Show loader on Duplicate email caption:- verifying email
	const watchCompanyName = watch('companyName');

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
	useEffect(() => {
		let timer;
		if (!_isNull(watchCompanyName)) {
			timer = setTimeout(() => {
				setIsLoading(true);
				getCompanyNameAlreadyExist(watchCompanyName);
			}, 2000);
		}
		return () => clearTimeout(timer);
	}, [getCompanyNameAlreadyExist, watchCompanyName]);

	/** To check Duplicate email exists End */
	useEffect(() => {
		getGEO();
		getLeadSource();
	}, []);
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
										checked="checked"
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
									setValue={setValue}
									register={register}
									name="companyLeadSource"
									label="Lead Source"
									defaultValue="Select Lead Source"
									options={leadSource}
									required
									isError={
										errors['companyLeadSource'] && errors['companyLeadSource']
									}
									errorMsg="Please select a lead source."
								/>
							</div>
						</div>
					</div>
					<div className={CompanyDetailsStyle.row}>
						<div className={CompanyDetailsStyle.colMd12}>
							<HRInputField
								register={register}
								leadingIcon={<UploadSVG />}
								label="Company Logo (JPG, PNG, SVG)"
								name="jdExport"
								type={InputType.BUTTON}
								value="Upload logo"
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
				</div>
			</div>
		</div>
	);
};

export default CompanyDetails;
