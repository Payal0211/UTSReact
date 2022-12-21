import { Button, Divider, Select, Space } from 'antd';
import { InputType } from 'constants/application';
import { useEffect, useRef, useState } from 'react';
import HRInputField from '../hrInputFields/hrInputFields';
import HRFieldStyle from './hrFIelds.module.css';
import { PlusOutlined } from '@ant-design/icons';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import UploadModal from 'shared/components/uploadModal/uploadModal';
import { MasterDAO } from 'core/master/masterDAO';

import HRSelectField from '../hrSelectField/hrSelectField';
import { useForm } from 'react-hook-form';
const HRFields = () => {
	const inputRef = useRef(null);
	const [availability, setAvailability] = useState([]);
	const [timeZonePref, setTimeZonePref] = useState([]);
	const [items, setItems] = useState(['3 months', '6 months', '9 months']);
	const [name, setName] = useState('');
	const [showUploadModal, setUploadModal] = useState(false);
	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm();

	const selectHandleChange = (value) => {
		console.log(`selected ${value}`);
	};
	const onNameChange = (event) => {
		setName(event.target.value);
	};
	const addItem = (e) => {
		e.preventDefault();
		setItems([...items, name + ' months' || name]);
		setName('');
		setTimeout(() => {
			inputRef.current?.focus();
		}, 0);
	};
	const getTimeZonePreference = async () => {
		const timeZone = await MasterDAO.getTalentTimeZoneRequestDAO();
		setTimeZonePref(timeZone && timeZone.responseBody);
	};
	const getAvailability = async () => {
		const availabilityResponse = await MasterDAO.getHowSoonRequestDAO();
		setAvailability(availabilityResponse && availabilityResponse.responseBody);
	};

	useEffect(() => {
		getAvailability();
		getTimeZonePreference();
	}, []);
	return (
		<div className={HRFieldStyle.hrFieldContainer}>
			<div className={HRFieldStyle.partOne}>
				<div className={HRFieldStyle.hrFieldLeftPane}>
					<h3>Hiring Request Details</h3>
					<p>Please provide the necessary details</p>
				</div>
				<form
					id="hrForm"
					className={HRFieldStyle.hrFieldRightPane}>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd12}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the client email/name.',
								}}
								label={'Client Email/Name'}
								name="clientName"
								type={InputType.TEXT}
								placeholder="Enter Client Email/Name"
								required
							/>
						</div>
					</div>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
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
									register={register}
									label={'Hiring Request Role'}
									defaultValue="Select Role"
									options={[
										{
											value: 'USD',
											label: 'USD',
										},
										{
											value: 'INR',
											label: 'INR',
										},
									]}
									onChangeHandler={selectHandleChange}
									required
									errorMsg={'Please select hiring request role'}
								/>
							</div>
						</div>
					</div>
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
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								register={register}
								leadingIcon={<UploadSVG />}
								label="Job Description (PDF)"
								name="jdExport"
								type={InputType.BUTTON}
								value="Upload JD File"
								onClickHandler={() => setUploadModal(true)}
							/>
						</div>
						<UploadModal
							modalTitle={'Upload Logo'}
							isFooter={false}
							openModal={showUploadModal}
							cancelModal={() => setUploadModal(false)}
						/>

						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								label="Job Description URL"
								name="jdURL"
								type={InputType.TEXT}
								placeholder="Add JD link"
								register={register}
							/>
						</div>
					</div>

					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd12}>
							<div className={`${HRFieldStyle.formGroup} ${HRFieldStyle.mb0}`}>
								<label>
									Add your estimated budget
									<span className={HRFieldStyle.reqField}>*</span>
								</label>
							</div>
						</div>

						<div className={HRFieldStyle.colMd4}>
							<div className={HRFieldStyle.formGroup}>
								<Select
									defaultValue="Select Budget"
									onChange={selectHandleChange}
									options={[
										{
											value: 'USD',
											label: 'USD',
										},
										{
											value: 'INR',
											label: 'INR',
										},
									]}
								/>
							</div>
						</div>

						<div className={HRFieldStyle.colMd4}>
							<HRInputField
								register={register}
								name="minimumBudget"
								type={InputType.TEXT}
								placeholder="Minimum- Ex: 2300, 2000"
							/>
						</div>

						<div className={HRFieldStyle.colMd4}>
							<HRInputField
								register={register}
								name="maximumBudget"
								type={InputType.TEXT}
								placeholder="Maximum- Ex: 2300, 2000"
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

						<div className={HRFieldStyle.colMd6}>
							<div className={HRFieldStyle.formGroup}>
								<label>Sales Person</label>
								<span style={{ paddingLeft: '5px' }}>
									<b>*</b>
								</span>
								<Select
									defaultValue="Select sales person"
									onChange={selectHandleChange}
									options={[
										{
											value: 'P1',
											label: 'P1',
										},
										{
											value: 'P2',
											label: 'P2',
										},
									]}
								/>
							</div>
						</div>
					</div>

					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<div className={HRFieldStyle.formGroup}>
								<label>Contract Duration (in months) </label>
								<span style={{ paddingLeft: '5px' }}>
									<b>*</b>
								</span>
								<Select
									defaultValue="Ex: 3,6,12..."
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
										label: item,
										value: item,
									}))}
								/>
							</div>
						</div>
						<div className={HRFieldStyle.colMd6}>
							<div className={HRFieldStyle.formGroup}>
								<label>
									Required Experience
									<span className={HRFieldStyle.reqField}>*</span>
								</label>
								<div className={HRFieldStyle.reqExperience}>
									<HRInputField
										required
										register={register}
										name="years"
										type={InputType.NUMBER}
										placeholder="Enter years"
									/>
									<HRInputField
										register={register}
										required
										name="months"
										type={InputType.NUMBER}
										placeholder="Enter months"
									/>
								</div>
							</div>
						</div>
					</div>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<div className={HRFieldStyle.formGroup}>
								<label>Working Time Zone</label>
								<span style={{ paddingLeft: '5px' }}>
									<b>*</b>
								</span>
								<Select
									defaultValue="Select time zone"
									onChange={selectHandleChange}
									// onChange={(val, a) => selectHandleChange(val, a)}
									options={timeZonePref}
								/>
							</div>
						</div>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the number of talents.',
								}}
								label="How many talents are needed."
								name="talentsNumber"
								type={InputType.NUMBER}
								placeholder="Please enter number of talents needed"
								required
							/>
						</div>
					</div>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<div className={HRFieldStyle.formGroup}>
								<label>How soon can they join? </label>
								<span style={{ paddingLeft: '5px' }}>
									<b>*</b>
								</span>
								<Select
									defaultValue="Select availability   "
									onChange={selectHandleChange}
									options={availability}
								/>
							</div>
						</div>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								register={register}
								/* errors={errors}
								validationSchema={{
									required: 'please enter the company name.',
								}} */
								label="Deal ID"
								name="dealID"
								type={InputType.TEXT}
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
				</form>
			</div>
			<Divider />

			<div className={HRFieldStyle.formPanelAction}>
				<button
					type="button"
					className={HRFieldStyle.btn}>
					Save as Draft
				</button>

				<button
					// form="hrForm"
					onClick={handleSubmit((d) => console.log(d))}
					// type="submit"
					className={HRFieldStyle.btnPrimary}>
					Create HR
				</button>
			</div>
		</div>
	);
};

export default HRFields;
