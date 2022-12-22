import { useState, useEffect } from 'react';
import { Checkbox } from 'antd';
import { EmailRegEx, InputType } from 'constants/application';
import ClientFieldStyle from './clientField.module.css';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import UploadModal from 'shared/components/uploadModal/uploadModal';
import AddNewClient from '../addClient/addClient';
import { MasterDAO } from 'core/master/masterDAO';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { useFieldArray, useForm } from 'react-hook-form';
import AddNewPOC from '../addPOC/addPOC';
import { useMemo } from 'react';
import {
	clientFormDataFormatter,
	getFlagAndCodeOptions,
} from 'modules/client/clientUtils';
import { ClientDAO } from 'core/client/clientDAO';
import { HTTPStatusCode } from 'constants/network';

export const secondaryClient = {
	fullName: '',
	emailID: '',
	countryCode: '',
	phoneNumber: '',
	designation: '',
	linkedinProfile: '',
};
export const poc = {
	contactName: '',
};

const ClientField = ({
	setTitle,
	salesManData,
	tabFieldDisabled,
	setTabFieldDisabled,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		getValues,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			secondaryClient: [],
			pocList: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'secondaryClient',
	});

	const {
		fields: pocFields,
		append: appendPOC,
		remove: removePOC,
	} = useFieldArray({
		control,
		name: 'pocList',
	});
	const watchFields = watch([
		'primaryClientName',
		'primaryClientEmailID',
		'primaryClientPhoneNumber',
		'primaryDesignation',
		'companyName',
		'companyAddress',
		'primaryClientCountryCode',
	]);
	/* console.log(watchFields);
	console.log(getValues()); */

	const [showUploadModal, setUploadModal] = useState(false);
	const [isSameAsPrimaryPOC, setSameAsPrimaryPOC] = useState(false);
	const [GEO, setGEO] = useState([]);
	const [flagAndCode, setFlagAndCode] = useState([]);
	const RadioButton = (e) => {
		console.log('radio checked', e.target.value);
		// setValue(e.target.value);
	};

	const SameASPrimaryPOCHandler = (e) => {
		setSameAsPrimaryPOC(e.target.checked);
	};

	const selectHandleChange = (value) => {
		console.log(`selected ${value}`);
	};
	const getGEO = async () => {
		const geoLocationResponse = await MasterDAO.getGEORequestDAO();
		setGEO(geoLocationResponse && geoLocationResponse.responseBody);
	};

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
	const clientSubmitHandler = async (d) => {
		let clientFormDetails = clientFormDataFormatter(d);
		const addClientResult = await ClientDAO.createClientDAO(clientFormDetails);
		if (addClientResult.statusCode === HTTPStatusCode.OK) {
			setTitle('Add New Hiring Requests');
			setTabFieldDisabled({ ...tabFieldDisabled, addNewHiringRequest: false });
		}
	};

	useEffect(() => {
		getGEO();
		getCodeAndFlag();
	}, []);

	useEffect(() => {
		if (isSameAsPrimaryPOC) {
			setValue('legalClientFullName', watchFields[0]);
			setValue('legalClientEmailID', watchFields[1]);
			setValue('legalClientPhoneNumber', watchFields[2]);
			setValue('legalClientDesignation', watchFields[3]);
			setValue('legalCompanyFullName', watchFields[4]);
			setValue('legalCompanyAddress', watchFields[5]);
			setValue('legalClientCountryCode', watchFields[6]);
		}
		console.log(getValues('legalClientCountryCode'), '=dsad');
	}, [isSameAsPrimaryPOC, setValue, watchFields, getValues]);

	return (
		<div className={ClientFieldStyle.tabsBody}>
			<div className={ClientFieldStyle.tabsFormItem}>
				<div className={ClientFieldStyle.tabsFormItemInner}>
					<div className={ClientFieldStyle.tabsLeftPanel}>
						<h3>Company Details</h3>
						<p>Please provide the necessary details</p>
					</div>

					<div className={ClientFieldStyle.tabsRightPanel}>
						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
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

							<div className={ClientFieldStyle.colMd6}>
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

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<div className={ClientFieldStyle.formGroup}>
									<HRSelectField
										setValue={setValue}
										register={register}
										name="companyLocation"
										label="Company Location"
										defaultValue="Select location"
										options={GEO}
										required
										isError={
											errors['companyLocation'] && errors['companyLocation']
										}
										errorMsg="Please select a location."
									/>
								</div>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'Please enter the company size.',
									}}
									label="Company Size"
									name={'companySize'}
									type={InputType.NUMBER}
									placeholder="Company Size "
									required
								/>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd12}>
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

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
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

							<div className={ClientFieldStyle.colMd6}>
								<div
									className={`${ClientFieldStyle.formGroup} ${ClientFieldStyle.phoneNoGroup}`}>
									<label>
										Phone number
										{/* <span className={ClientFieldStyle.reqField}>*</span> */}
									</label>
									<div className={ClientFieldStyle.phoneNoCode}>
										<HRSelectField
											searchable={true}
											setValue={setValue}
											register={register}
											name="companyCountryCode"
											defaultValue="+91"
											options={flagAndCodeMemo}
										/>
									</div>
									<div className={ClientFieldStyle.phoneNoInput}>
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

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd12}>
								<div className={ClientFieldStyle.radioFormGroup}>
									<label>
										Does the client have experience of hiring remotely?
									</label>
									<label htmlFor="remote">
										<input
											{...register('remote')}
											type="radio"
											value={1}
											id="remote"
										/>
										yes
									</label>
									<label htmlFor="remote">
										<input
											{...register('remote')}
											type="radio"
											value={0}
											id="remote"
										/>
										no
									</label>
								</div>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd12}>
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

			<AddNewClient
				setError={setError}
				watch={watch}
				setValue={setValue}
				fields={fields}
				append={append}
				remove={remove}
				register={register}
				errors={errors}
				flagAndCodeMemo={flagAndCodeMemo}
			/>
			<div className={ClientFieldStyle.tabsFormItem}>
				<div className={ClientFieldStyle.tabsFormItemInner}>
					<div className={ClientFieldStyle.tabsLeftPanel}>
						<h3>Legal Information</h3>
						<p>
							Please provide the necessary information
							<br />
							for the signing authority
						</p>
					</div>

					<div className={ClientFieldStyle.tabsRightPanel}>
						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd12}>
								<div className={ClientFieldStyle.checkBoxGroup}>
									<Checkbox onChange={SameASPrimaryPOCHandler}>
										Same as primary client details
									</Checkbox>
								</div>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the client name.',
									}}
									label="HS Client Full Name"
									name="legalClientFullName"
									type={InputType.TEXT}
									placeholder="Enter full name"
									required
									disabled={isSameAsPrimaryPOC}
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the client email ID.',
										pattern: {
											value: EmailRegEx.email,
											message: 'please enter a valid email.',
										},
									}}
									label="HS Client Email ID"
									name={'legalClientEmailID'}
									type={InputType.EMAIL}
									placeholder="Enter Email ID"
									disabled={isSameAsPrimaryPOC}
									required
								/>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<div
									className={`${ClientFieldStyle.formGroup} ${ClientFieldStyle.phoneNoGroup}`}>
									<label>Client's Phone Number</label>
									<div className={ClientFieldStyle.phoneNoCode}>
										<HRSelectField
											searchable={true}
											setValue={setValue}
											register={register}
											name="legalClientCountryCode"
											defaultValue="+91"
											options={flagAndCodeMemo}
										/>
									</div>
									<div className={ClientFieldStyle.phoneNoInput}>
										<HRInputField
											register={register}
											name={'legalClientPhoneNumber'}
											type={InputType.NUMBER}
											placeholder="Enter Phone number"
											disabled={isSameAsPrimaryPOC}
										/>
									</div>
								</div>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									label="Designation"
									name={'legalClientDesignation'}
									type={InputType.TEXT}
									placeholder="Enter designation"
									disabled={isSameAsPrimaryPOC}
								/>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the legal company name.',
									}}
									label="Legal Company Name"
									name={'legalCompanyFullName'}
									type={InputType.TEXT}
									placeholder="Enter legal name"
									disabled={isSameAsPrimaryPOC}
									required
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the legal company address.',
									}}
									label="Legal Company Address"
									name={'legalCompanyAddress'}
									type={InputType.TEXT}
									placeholder="Enter legal address"
									disabled={isSameAsPrimaryPOC}
									required
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<AddNewPOC
				salesManData={salesManData}
				setValue={setValue}
				fields={pocFields}
				append={appendPOC}
				remove={removePOC}
				register={register}
				errors={errors}
			/>
			<div className={ClientFieldStyle.formPanelAction}>
				<button
					type="button"
					className={ClientFieldStyle.btn}>
					Save as Draft
				</button>
				<button
					type="submit"
					onClick={handleSubmit(clientSubmitHandler)}
					className={ClientFieldStyle.btnPrimary}>
					Next Page
				</button>
			</div>
		</div>
	);
};

export default ClientField;
