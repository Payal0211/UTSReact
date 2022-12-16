import { useState } from 'react';
import { Checkbox, Radio, Select } from 'antd';
import { InputType } from 'constants/application';
import InputField from '../inputField/input_field';
import ClientFieldStyle from './clientField.module.css';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import UploadModal from 'shared/components/uploadModal/uploadModal';

const ClientField = () => {
	const [value, setValue] = useState(1);
	const [showUploadModal, setUploadModal] = useState(false);
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
									<label>
										Company Location{' '}
										<span className={ClientFieldStyle.reqField}>*</span>
									</label>
									<Select
										defaultValue="Select location"
										onSelect={selectHandleChange}
										options={[
											{
												value: 'Location1',
												label: 'Location 1',
											},
											{
												value: 'Location2',
												label: 'Location 2',
											},
											{
												value: 'Location3',
												label: 'Location 3',
												// disabled: true,
											},
											{
												value: 'Location4',
												label: 'Location 4',
											},
											{
												value: 'Location5',
												label: 'Location 5',
											},
										]}
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

			<div className={ClientFieldStyle.tabsFormItem}>
				<div className={ClientFieldStyle.tabsFormItemInner}>
					<div className={ClientFieldStyle.tabsLeftPanel}>
						<h3>Client Details</h3>
						<p>Please provide the necessary details</p>
						<div className={ClientFieldStyle.leftPanelAction}>
							<button
								type="button"
								className={ClientFieldStyle.btn}>
								Add Secondary Client Details
							</button>
						</div>
					</div>
					<div className={ClientFieldStyle.tabsRightPanel}>
						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									label="HS Client Full Name (Primary)"
									name={'primaryClientFullName'}
									type={InputType.TEXT}
									placeholder="Enter full name "
									required
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									label="HS Client Email ID (Primary)"
									name={'primaryClientEmailID'}
									type={InputType.EMAIL}
									placeholder="Enter Email ID "
									required
								/>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									label="Client's Phone Number (Primary)"
									name={'primaryClientPhoneNumber'}
									type={InputType.NUMBER}
									placeholder="Enter Number"
									required
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									label="Years of Experience (Primary)"
									name={'PrimaryYearsOfExperience'}
									type={InputType.NUMBER}
									placeholder="Ex: 2, 3, 5..."
									required
								/>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd12}>
								<HRInputField
									label="HS Client Linkedin Profile (Primary)"
									name={'PrimaryClientLinkedinProfile'}
									type={InputType.TEXT}
									placeholder="Add Linkedin profile link"
									required
								/>
							</div>
						</div>
					</div>
				</div>

				<div className={ClientFieldStyle.tabsFormItemInner}>
					<div className={ClientFieldStyle.tabsLeftPanel}>
						<h3>Secondary Client Details</h3>
						<p>Please provide the necessary details</p>
						<div className={ClientFieldStyle.leftPanelAction}>
							<button
								type="button"
								className={ClientFieldStyle.btnPrimary}>
								Add More
							</button>
							<button
								type="button"
								className={ClientFieldStyle.btn}>
								Remove
							</button>
						</div>
					</div>
					<div className={ClientFieldStyle.tabsRightPanel}>
						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									label="HS Client Full Name (Secondary)"
									name={'SecondaryClientFullName'}
									type={InputType.TEXT}
									placeholder="Add Linkedin profile link"
									required
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									label="HS ClientEmail ID (Secondary)"
									name={'SecondaryClientEmailID'}
									type={InputType.EMAIL}
									placeholder="Enter Email ID"
									required
								/>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									label="Client's Phone Number (Secondary)"
									name={'SecondaryClientPhoneNumber'}
									type={InputType.NUMBER}
									placeholder="Enter number"
									required
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									label="Years of Experience (Secondary)"
									name={'SecondaryYearsOfExperience'}
									type={InputType.NUMBER}
									placeholder="Ex: 2, 3, 5..."
								/>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd12}>
								<HRInputField
									label="HS Client Linkedin Profile (Secondary)"
									name={'SecondaryClientLinkedinProfile'}
									type={InputType.TEXT}
									placeholder="Add Linkedin profile link  "
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
