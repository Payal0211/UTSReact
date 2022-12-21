import { Select } from 'antd';
import { EmailRegEx, InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback } from 'react';

import { secondaryClient } from '../clientField/clientField';
import AddClientStyle from './addClient.module.css';
const { Option } = Select;
const AddNewClient = ({
	fields,
	append,
	remove,
	register,
	setValue,
	errors,
	flagAndCodeMemo,
}) => {
	const onAddNewClient = useCallback(
		(e) => {
			e.preventDefault();
			append({ ...secondaryClient });
		},
		[append],
	);
	const onRemoveAddedClient = useCallback(
		(e, index) => {
			e.preventDefault();
			remove(index);
		},
		[remove],
	);

	return (
		<div className={AddClientStyle.tabsFormItem}>
			<div className={AddClientStyle.tabsFormItemInner}>
				<div className={AddClientStyle.tabsLeftPanel}>
					<h3>Client Details</h3>
					<p>Please provide the necessary details</p>

					<div className={AddClientStyle.leftPanelAction}>
						{fields.length === 0 && (
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
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the primary client name',
								}}
								label="HS Client Full Name (Primary)"
								name={'primaryClientName'}
								type={InputType.TEXT}
								placeholder="Enter full name "
								required
							/>
						</div>

						<div className={AddClientStyle.colMd6}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the primary client email ID.',
									pattern: {
										value: EmailRegEx.email,
										message: 'please enter a valid email.',
									},
								}}
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
							<div
								className={`${AddClientStyle.formGroup} ${AddClientStyle.phoneNoGroup}`}>
								<label>
									Client's Phone Number (Primary)
									{/* <span className={AddClientStyle.reqField}>*</span> */}
								</label>
								<div className={AddClientStyle.phoneNoCode}>
									<HRSelectField
										searchable={true}
										setValue={setValue}
										register={register}
										name="primaryClientCountryCode"
										defaultValue="+91"
										options={flagAndCodeMemo}
									/>
								</div>
								<div className={AddClientStyle.phoneNoInput}>
									<HRInputField
										register={register}
										name={'primaryClientPhoneNumber'}
										type={InputType.NUMBER}
										placeholder="Enter Phone number"
									/>
								</div>
							</div>
						</div>

						<div className={AddClientStyle.colMd6}>
							<HRInputField
								register={register}
								label="Designation (Primary)"
								name={'primaryDesignation'}
								type={InputType.TEXT}
								placeholder="Enter client designation"
							/>
						</div>
					</div>

					<div className={AddClientStyle.row}>
						<div className={AddClientStyle.colMd12}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required:
										'please enter the primary client linkedin profile URL.',
								}}
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
			{fields?.map((item, index) => {
				return (
					<div
						className={AddClientStyle.tabsFormItemInner}
						key={`countClient_${index}`}>
						<div className={AddClientStyle.tabsLeftPanel}>
							<h3>Secondary Client Details - {index + 1}</h3>
							<p>Please provide the necessary details</p>
							{fields.length - 1 === index && (
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
										register={register}
										validationSchema={{
											required: true,
										}}
										label="HS Client Full Name (Secondary)"
										name={`secondaryClient.[${index}].fullName`}
										type={InputType.TEXT}
										placeholder="Enter full name"
										isError={!!errors?.secondaryClient?.[index]?.fullName}
										errorMsg="please enter the secondary client name."
										required
									/>
								</div>

								<div className={AddClientStyle.colMd6}>
									<HRInputField
										register={register}
										// errors={errors}
										validationSchema={{
											required: 'please enter the secondary client email ID.',
											pattern: {
												value: EmailRegEx.email,
												message: 'please enter a valid email.',
											},
										}}
										label="HS ClientEmail ID (Secondary)"
										name={`secondaryClient.[${index}].emailID`}
										type={InputType.EMAIL}
										isError={!!errors?.secondaryClient?.[index]?.emailID}
										errorMsg="please enter the secondary client email."
										placeholder="Enter Email ID"
										required
									/>
								</div>
							</div>

							<div className={AddClientStyle.row}>
								<div className={AddClientStyle.colMd6}>
									<div
										className={`${AddClientStyle.formGroup} ${AddClientStyle.phoneNoGroup}`}>
										<label>
											Client's Phone Number (Secondary)
											{/* <span className={AddClientStyle.reqField}>*</span> */}
										</label>
										<div className={AddClientStyle.phoneNoCode}>
											<HRSelectField
												searchable={true}
												setValue={setValue}
												register={register}
												name={`secondaryClient.[${index}].countryCode`}
												defaultValue="+91"
												options={flagAndCodeMemo}
											/>
										</div>
										<div className={AddClientStyle.phoneNoInput}>
											<HRInputField
												register={register}
												name={`secondaryClient.[${index}].phoneNumber`}
												type={InputType.NUMBER}
												placeholder="Enter Phone number"
											/>
										</div>
									</div>
								</div>

								<div className={AddClientStyle.colMd6}>
									<HRInputField
										register={register}
										label="Designation (Secondary)"
										name={`secondaryClient[${index}].designation`}
										type={InputType.TEXT}
										placeholder="Enter client designation"
									/>
								</div>
							</div>

							<div className={AddClientStyle.row}>
								<div className={AddClientStyle.colMd12}>
									<HRInputField
										register={register}
										validationSchema={{
											required: true,
										}}
										label="HS Client Linkedin Profile (Secondary)"
										name={`secondaryClient.[${index}].linkedinProfile`}
										type={InputType.TEXT}
										isError={!!errors?.secondaryClient?.[index]?.emailID}
										errorMsg="please enter the secondary client linkedin profile URL."
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
