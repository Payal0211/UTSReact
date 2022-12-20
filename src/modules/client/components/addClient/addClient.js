import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useRef, useState } from 'react';
import useForm from 'shared/hooks/useForm';
import AddClientStyle from './addClient.module.css';
const AddNewClient = () => {
	const clientFieldInfo = useRef({});
	const { inputChangeHandler, formValues, error, onSubmitHandler } = useForm(
		clientFieldInfo.current,
	);
	const [countClient, setCountClient] = useState([]);
	const onAddNewClient = (e) => {
		e.preventDefault();
		setCountClient([...countClient, countClient.length + 1]);
	};
	const onRemoveAddedClient = (e, index) => {
		e.preventDefault();
		let newFormValues = [...countClient];
		newFormValues.splice(index, 1);
		setCountClient(newFormValues);
	};

	return (
		<div className={AddClientStyle.tabsFormItem}>
			<div className={AddClientStyle.tabsFormItemInner}>
				<div className={AddClientStyle.tabsLeftPanel}>
					<h3>Client Details</h3>
					<p>Please provide the necessary details</p>
					<div className={AddClientStyle.leftPanelAction}>
						{countClient.length === 0 && (
							<button
								type="button"
								className={AddClientStyle.btn}
								onClick={onAddNewClient}>
								Add Secondary Client Details
							</button>
						)}
					</div>
				</div>
				<div className={AddClientStyle.tabsRightPanel}>
					<div className={AddClientStyle.row}>
						<div className={AddClientStyle.colMd6}>
							<HRInputField
								label="HS Client Full Name (Primary)"
								name={'primaryClientFullName'}
								type={InputType.TEXT}
								placeholder="Enter full name "
								required
							/>
						</div>

						<div className={AddClientStyle.colMd6}>
							<HRInputField
								label="HS Client Email ID (Primary)"
								name={'primaryClientEmailID'}
								type={InputType.EMAIL}
								placeholder="Enter Email ID "
								required
							/>
						</div>
					</div>

					<div className={AddClientStyle.row}>
						<div className={AddClientStyle.colMd6}>
							<HRInputField
								label="Client's Phone Number (Primary)"
								name={'primaryClientPhoneNumber'}
								type={InputType.NUMBER}
								placeholder="Enter Number"
								required
							/>
						</div>

						<div className={AddClientStyle.colMd6}>
							<HRInputField
								label="Years of Experience (Primary)"
								name={'PrimaryYearsOfExperience'}
								type={InputType.NUMBER}
								placeholder="Ex: 2, 3, 5..."
								required
							/>
						</div>
					</div>

					<div className={AddClientStyle.row}>
						<div className={AddClientStyle.colMd12}>
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
			{countClient?.map((item, index) => {
				return (
					<div
						className={AddClientStyle.tabsFormItemInner}
						key={`countClient_${index}`}>
						<div className={AddClientStyle.tabsLeftPanel}>
							<h3>Secondary Client Details - {index + 1}</h3>
							<p>Please provide the necessary details</p>
							{countClient.length - 1 === index && (
								<div className={AddClientStyle.leftPanelAction}>
									<button
										type="button"
										className={AddClientStyle.btnPrimary}
										onClick={onAddNewClient}>
										Add More
									</button>
									<button
										type="button"
										className={AddClientStyle.btn}
										onClick={(e) => onRemoveAddedClient(e, index)}>
										Remove
									</button>
								</div>
							)}
						</div>
						<div className={AddClientStyle.tabsRightPanel}>
							<div className={AddClientStyle.row}>
								<div className={AddClientStyle.colMd6}>
									<HRInputField
										label="HS Client Full Name (Secondary)"
										name={`SecondaryClientFullName_${index}`}
										type={InputType.TEXT}
										placeholder="Add Linkedin profile link"
										required
									/>
								</div>

								<div className={AddClientStyle.colMd6}>
									<HRInputField
										label="HS ClientEmail ID (Secondary)"
										name={`SecondaryClientEmailID_${index}`}
										type={InputType.EMAIL}
										placeholder="Enter Email ID"
										required
									/>
								</div>
							</div>

							<div className={AddClientStyle.row}>
								<div className={AddClientStyle.colMd6}>
									<HRInputField
										label="Client's Phone Number (Secondary)"
										name={`SecondaryClientPhoneNumber_${index}`}
										type={InputType.NUMBER}
										placeholder="Enter number"
										required
									/>
								</div>

								<div className={AddClientStyle.colMd6}>
									<HRInputField
										label="Years of Experience (Secondary)"
										name={`SecondaryYearsOfExperience_${index}`}
										type={InputType.NUMBER}
										placeholder="Ex: 2, 3, 5..."
									/>
								</div>
							</div>

							<div className={AddClientStyle.row}>
								<div className={AddClientStyle.colMd12}>
									<HRInputField
										label="HS Client Linkedin Profile (Secondary)"
										name={`SecondaryClientLinkedinProfile_${index}`}
										type={InputType.TEXT}
										placeholder="Add Linkedin profile link  "
										required
									/>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default AddNewClient;
