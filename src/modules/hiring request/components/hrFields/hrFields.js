import { Button, Divider, Select, Space } from 'antd';
import { FormType, InputType } from 'constants/application';
import { useEffect, useRef, useState } from 'react';
import HRInputField from '../hrInputFields/hrInputFields';
import HRFieldStyle from './hrFIelds.module.css';
import { PlusOutlined } from '@ant-design/icons';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import UploadModal from 'shared/components/uploadModal/uploadModal';
import { MasterDAO } from 'core/master/masterDAO';
import useForm from 'shared/hooks/useForm';

const HRFields = () => {
	const inputRef = useRef(null);
	const [availability, setAvailability] = useState([]);
	const [timeZonePref, setTimeZonePref] = useState([]);
	const [items, setItems] = useState(['3 months', '6 months', '9 months']);
	const [name, setName] = useState('');
	const [showUploadModal, setUploadModal] = useState(false);

	/** Starts Here */
	const hrFieldInfo = useRef({
		clientName: '',
		companyName: '',
		hrTitle: '',
	});
	const { inputChangeHandler, formValues, error, onSubmitHandler } = useForm(
		hrFieldInfo.current,
	);
	/**Ends Here */
	const selectHandleChange = (value, option) => {
		console.log(`selected ${value},${option.value}`);
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
					<div className={HRFieldStyle.colMd12}>
						<HRInputField
							onChangeHandler={inputChangeHandler}
							value={formValues['clientName']}
							label={'Client Email/Name'}
							name="clientName"
							type={InputType.TEXT}
							placeholder="Enter Client Email/Name"
							errorMsg={error['clientName']}
							required
						/>
					</div>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								onChangeHandler={inputChangeHandler}
								value={formValues['companyName']}
								errorMsg={error['companyName']}
								label="Company Name"
								name="companyName"
								type={InputType.TEXT}
								placeholder="Enter Company Name"
								required
							/>
						</div>

						<div className={HRFieldStyle.colMd6}>
							<div className={HRFieldStyle.formGroup}>
								<label>Hiring Request Role</label>
								<span style={{ paddingLeft: '5px' }}>
									<b>*</b>
								</span>
								<Select
									defaultValue="Select Role"
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
					</div>
					<div className={HRFieldStyle.colMd12}>
						<HRInputField
							onChangeHandler={inputChangeHandler}
							value={formValues['hrTitle']}
							errorMsg={error['hrTitle']}
							label={'Hiring Request Title'}
							name="hrTitle"
							type={InputType.TEXT}
							placeholder="Enter title"
							required
						/>
					</div>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								leadingIcon={<UploadSVG />}
								label="Job Description (PDF)"
								name="jdExport"
								type={InputType.BUTTON}
								value="Upload JD File"
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

						<div className={HRFieldStyle.colMd6}>
							<HRInputField
								label="Job Description URL"
								name="jdURL"
								type={InputType.TEXT}
								placeholder="Add JD link"
							/>
						</div>
					</div>

					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd4}>
							<div className={HRFieldStyle.formGroup}>
								<label>Add your estimated budget</label>
								<span style={{ paddingLeft: '5px' }}>
									<b>*</b>
								</span>
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
								name="minimumBudget"
								type={InputType.TEXT}
								placeholder="Minimum- Ex: 2300, 2000"
							/>
						</div>
						<div className={HRFieldStyle.colMd4}>
							<HRInputField
								name="maximumBudget"
								type={InputType.TEXT}
								placeholder="Maximum- Ex: 2300, 2000"
							/>
						</div>
					</div>
					<div className={HRFieldStyle.row}>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
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
							<HRInputField
								label="Company URL"
								name="companyURL"
								type={InputType.TEXT}
								placeholder="Enter profile link"
							/>
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
									// onChange={(val, a) => selectHandleChange(val, a.id)}
									options={timeZonePref}
								/>
							</div>
						</div>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
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
								label="BQ Form Link"
								name="bqFormLink"
								type={InputType.TEXT}
								placeholder="Enter the link for BQ form"
								required
							/>
						</div>
						<div className={HRFieldStyle.colMd6}>
							<HRInputField
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
					Need More Info
				</button>

				<button
					// form="hrForm"
					onClick={(e) => onSubmitHandler(e, FormType.HRFIELD)}
					// type="submit"
					className={HRFieldStyle.btnPrimary}>
					Submit
				</button>
			</div>
		</div>
	);
};

export default HRFields;
