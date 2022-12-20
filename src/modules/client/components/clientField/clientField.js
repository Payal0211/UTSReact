import { useState, useEffect } from 'react';
import { Checkbox, Radio, Select } from 'antd';
import { InputType } from 'constants/application';
import ClientFieldStyle from './clientField.module.css';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import UploadModal from 'shared/components/uploadModal/uploadModal';
import AddNewClient from '../addClient/addClient';
import { MasterDAO } from 'core/master/masterDAO';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
const { Option } = Select;
const ClientField = () => {
	const [value, setValue] = useState(1);
	const [showUploadModal, setUploadModal] = useState(false);
	const [GEO, setGEO] = useState([]);
	const [flagAndCode, setFlagAndCode] = useState([]);
	const RadioButton = (e) => {
		console.log('radio checked', e.target.value);
		setValue(e.target.value);
	};

	const CheckboxButton = (e) => {
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
									label={'HS Company Name'}
									name="hs_company_name"
									type={InputType.TEXT}
									placeholder="Enter Name"
									required
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									label="Company URL"
									name="company_url"
									type={InputType.TEXT}
									placeholder="Enter profile link"
									required
								/>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<div className={ClientFieldStyle.formGroup}>
									<HRSelectField
										label="Company Location"
										defaultValue="Select location"
										options={GEO}
										required
										onChangeHandler={selectHandleChange}
										errorMsg="Please select a location."
									/>
								</div>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
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
									label="Company Address"
									name={'companyAddress'}
									type={InputType.TEXT}
									placeholder="Company Address "
									required
								/>
							</div>
						</div>
						<Select>
							{flagAndCode.map((item) => (
								<Option key={item?.ccode}>
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
						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									label="Linkedin Profile"
									name={'companySize'}
									type={InputType.TEXT}
									placeholder="Enter linkedin profile "
									required
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									label="Phone number"
									name={'phoneNumber'}
									type={InputType.TEXT}
									placeholder="Enter Phone number"
								/>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd12}>
								<div className={ClientFieldStyle.radioFormGroup}>
									<label>
										Does the client have experience of hiring remotely?
									</label>
									<Radio.Group
										onChange={RadioButton}
										value={value}>
										<Radio value={1}>Yes</Radio>
										<Radio value={2}>No</Radio>
									</Radio.Group>
								</div>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd12}>
								<HRInputField
									leadingIcon={<UploadSVG />}
									label="Company Logo (JPG, PNG, SVG)"
									name="jdExport"
									type={InputType.BUTTON}
									value="Upload logo"
									onClickHandler={() => setUploadModal(true)}
									required
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

			<AddNewClient />
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
										Same as primary POC
									</Checkbox>
								</div>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									label="HS Client Full Name"
									name={'legalClientFullName'}
									type={InputType.TEXT}
									placeholder="Enter full name"
									required
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
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
								<HRInputField
									label="Client's Phone Number"
									name={'legalClientPhoneNumber'}
									type={InputType.NUMBER}
									placeholder="Enter number"
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<div className={ClientFieldStyle.formGroup}>
									<label>Designation</label>
									<Select
										defaultValue="Select Designation"
										onChange={selectHandleChange}
										options={[
											{
												value: 'designation1',
												label: 'Designation 1',
											},
											{
												value: 'designation2',
												label: 'Designation 2',
											},
											{
												value: 'designation3',
												label: 'Designation 3',
											},
											{
												value: 'designation4',
												label: 'Designation 4',
											},
											{
												value: 'designation5',
												label: 'Designation 5',
											},
										]}
									/>
								</div>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									label="Legal Company Name"
									name={'legalCompanyFullName'}
									type={InputType.TEXT}
									placeholder="Enter legal name"
									required
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
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
			<div className={ClientFieldStyle.tabsFormItem}>
				<div className={ClientFieldStyle.tabsFormItemInner}>
					<div className={ClientFieldStyle.tabsLeftPanel}>
						<h3>Point of Contact</h3>
						<p>Enter the point of contact from Uplers</p>
						<div className={ClientFieldStyle.leftPanelAction}>
							<button
								type="button"
								className={ClientFieldStyle.btn}>
								Add More
							</button>
						</div>
					</div>

					<div className={ClientFieldStyle.tabsRightPanel}>
						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<div className={ClientFieldStyle.formGroup}>
									<label>
										Primary Contact Name{' '}
										<span className={ClientFieldStyle.reqField}>*</span>
									</label>
									<Select
										defaultValue="Enter Name"
										onChange={selectHandleChange}
										options={[
											{
												value: 'contactName1',
												label: 'Contact Name 1',
											},
											{
												value: 'contactName2',
												label: 'Contact Name 2',
											},
											{
												value: 'contactName3',
												label: 'Contact Name 3',
												// disabled: true,
											},
											{
												value: 'contactName4',
												label: 'Contact Name 4',
											},
											{
												value: 'contactName5',
												label: 'Contact Name 5',
											},
										]}
									/>
								</div>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<div className={ClientFieldStyle.formGroup}>
									<label>Secondary Contact Name</label>
									<Select
										defaultValue="Enter Name"
										onChange={selectHandleChange}
										options={[
											{
												value: 'secondaryContactName',
												label: 'Secondary Contact Name',
											},
											{
												value: 'secondaryContactName1',
												label: 'Secondary Contact Name 1',
											},
											{
												value: 'secondaryContactName2',
												label: 'Secondary Contact Name 2',
												// disabled: true,
											},
											{
												value: 'secondaryContactName3',
												label: 'Secondary Contact Name 3',
											},
											{
												value: 'secondaryContactName4',
												label: 'Secondary Contact Name 4',
											},
										]}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={ClientFieldStyle.formPanelAction}>
				<button
					type="button"
					className={ClientFieldStyle.btn}>
					Save as Draft
				</button>
				<button
					type="button"
					className={ClientFieldStyle.btnPrimary}>
					Next Page
				</button>
			</div>
		</div>
	);
};

export default ClientField;
