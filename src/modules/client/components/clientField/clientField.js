import { useState, useEffect } from 'react';
import { Checkbox, Select } from 'antd';
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
const { Option } = Select;

export const secondaryClient = {
	fullName: '',
	emailID: '',
	phoneNumber: '',
	designation: '',
	linkedinProfile: '',
};
export const poc = {
	contactName: '',
};

const ClientField = () => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			secondaryClient: [],
			poc: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'secondaryClient',
		// name: 'poc',
	});
	/* const { fields, append1, remove1 } = useFieldArray({
		control,
		name: 'poc',
	}); */

	// const [value, setValue] = useState(1);
	const [showUploadModal, setUploadModal] = useState(false);
	const [isPrimaryPOC, setPrimaryPOC] = useState(false);
	const [GEO, setGEO] = useState([]);
	const [flagAndCode, setFlagAndCode] = useState([]);
	const RadioButton = (e) => {
		console.log('radio checked', e.target.value);
		// setValue(e.target.value);
	};

	const CheckboxButton = (e) => {
		setPrimaryPOC(e.target.checked);
		console.log(`checked = ${e.target.checked}`);
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

	useEffect(() => {
		getGEO();
		getCodeAndFlag();
	}, []);

	// console.log(errors);
	return (
		<div className={ClientFieldStyle.tabsBody}>
			<div className={ClientFieldStyle.tabsFormItem}>
				<div className={ClientFieldStyle.tabsFormItemInner}>
					<div className={ClientFieldStyle.tabsLeftPanel}>
						<h3>Company Details</h3>
						<p>Please provide the necessary details</p>
					</div>
					{/* <Select
						onChange={getChangeHandlerWithValue('select')}
						defaultValue={''}>
						<Option value="value1">Value1</Option>
						<Option value="value2">Value2</Option>
					</Select> */}
					{/* {errorDetail('select', 'Please input your nickname!')} */}
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
									type={InputType.TEXT}
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
									name={'linkedinProfile'}
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
										<span className={ClientFieldStyle.reqField}>*</span>
									</label>
									<div className={ClientFieldStyle.phoneNoCode}>
										<Select showSearch>
											{flagAndCode.map((item, index) => (
												<Option key={index}>
													<img
														src={item?.flag}
														width="20"
														height="20"
														alt={''}
													/>
													{item?.ccode}
												</Option>
											))}
										</Select>
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
											value="yes"
											id="remote"
										/>
										yes
									</label>
									<label htmlFor="remote">
										<input
											{...register('remote')}
											type="radio"
											value="no"
											id="remote"
										/>
										no
									</label>
								</div>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd12}>
								{/* <HRInputField
									errors={errors}
									register={register}
									leadingIcon={<UploadSVG />}
									label="Company Logo (JPG, PNG, SVG)"
									name="jdExport"
									validationSchema={{
										required: 'please enter the linkedin profile.',
									}}
									type={InputType.BUTTON}
									// value="Upload logo"
									onClickHandler={() => setUploadModal(true)}
									required
								/> */}
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
				flagAndCode={flagAndCode}
				fields={fields}
				append={append}
				remove={remove}
				register={register}
				errors={errors}
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
									<Checkbox onChange={CheckboxButton}>
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
									name={
										!isPrimaryPOC ? 'legalClientFullName' : 'primaryClientName'
									}
									type={InputType.TEXT}
									placeholder="Enter full name"
									required
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
									required
								/>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<div
									className={`${ClientFieldStyle.formGroup} ${ClientFieldStyle.phoneNoGroup}`}>
									<label>
										Client's Phone Number
										<span className={ClientFieldStyle.reqField}>*</span>
									</label>
									<div className={ClientFieldStyle.phoneNoCode}>
										<Select showSearch>
											{flagAndCode.map((item, index) => (
												<Option key={index}>
													<img
														src={item?.flag}
														width="20"
														height="20"
														alt={''}
													/>
													{item?.ccode}
												</Option>
											))}
										</Select>
									</div>
									<div className={ClientFieldStyle.phoneNoInput}>
										<HRInputField
											register={register}
											name={'legalClientPhoneNumber'}
											type={InputType.NUMBER}
											placeholder="Enter Phone number"
										/>
									</div>
								</div>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									label="Designation"
									name={'legalClientPhoneNumber'}
									type={InputType.NUMBER}
									placeholder="Enter designation"
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
									required
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* <AddNewPOC
				fields={fields}
				append={append}
				remove={remove}
				register={register}
				errors={errors}
			/> */}
			<div className={ClientFieldStyle.formPanelAction}>
				<button
					type="button"
					className={ClientFieldStyle.btn}>
					Save as Draft
				</button>
				<button
					type="button"
					onClick={handleSubmit((d) => console.log(d))}
					className={ClientFieldStyle.btnPrimary}>
					Next Page
				</button>
			</div>
		</div>
	);
};

export default ClientField;
