import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import React, { useCallback, useEffect, useState } from 'react';
import {  useForm , Controller } from 'react-hook-form';
import changeDateStyle from './changeDate.module.css';
import { ReactComponent as MinusSVG } from 'assets/svg/minus.svg';
import { ReactComponent as PlusSVG } from 'assets/svg/plus.svg';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useParams } from 'react-router-dom';
import { HTTPStatusCode } from 'constants/network';
import SpinLoader from 'shared/components/spinLoader/spinLoader';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';

const ChangeDate = ({
	updateTR,
	setUpdateTR,
	onCancel,
	apiData,
	allApiData
}) => {
	const [count, setCount] = useState(0);
	const [disable, setDisable] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		control,
		formState: { errors },
	} = useForm();


	const [valueInfo, setValueInfo] = useState('');

	const onSubmit = async () => {
		setIsLoading(true);
		
		setIsLoading(false);
	};


	useEffect(() => {
		return () => setIsLoading(false);
	}, []);

	console.log('watch',watch('Reason'))
	return (
		<div className={changeDateStyle.engagementModalContainer}>
			<div className={changeDateStyle.updateTRTitle}>
				<h2>Edit SLA - Share Shortlisted Profiles</h2>
				<p>
					{ allApiData?.ClientDetail?.HR_Number} | Senior Front End Developer
				</p>
			</div>

			<h4 className={changeDateStyle.infoMsg}>{valueInfo}</h4>
			<p>The default setting for this stage is to initiate after 5 working days from publishing the job post.</p>

			{isLoading ? (
				<SpinLoader />
			) : (
				<>
					<div className={changeDateStyle.row}>
					<div className={changeDateStyle.colMd6}>
					<label>
					Change Date *
					</label>
					<div className={changeDateStyle.calendarFilter}>
						<Controller
                          render={({ ...props }) => (
                            <DatePicker
                              selected={watch("shiftStartTime")}
                              onChange={(date) => {
                                setValue("shiftStartTime", date);
                              }}
                            //   showTimeSelect
                            //   showTimeSelectOnly
                            //   timeIntervals={60}
                            //   timeCaption="Time"
                            //   timeFormat="h:mm a"
                            //   dateFormat="h:mm a"
                              placeholderText="Start Time"
                             
                            />
                          )}
                          name="newDate"
                          rules={{ required: true }}
                          control={control}
                        />
						<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
                        
						</div>
						{errors.newDate && (
                          <div className={changeDateStyle.error}>
                            Please enter Date
                          </div>
                        )}
						</div>
						<div className={changeDateStyle.colMd6}>	
						<HRSelectField
                        // isControlled={true}
                        mode="id/value"
                        setValue={setValue}
                        register={register}
                        label={"Reason For Changing the SLA"}
                        defaultValue={"Select Net Payment Term"}
                        name="Reason"
                        options={[{id:1, value:'Niche role/position' },{id:2, value:'Budget constraint' },{id:3, value:'Need more clarity for position/role' },
						{id:4, value:'Other' }]}
                        isError={errors["Reason"] && errors["Reason"]}
                        required
                        errorMsg={"Please select Reason"}
                      />
					
						</div>

						{watch('Reason')?.value === 'Other' && <div className={changeDateStyle.colMd12}>
							<HRInputField
								isTextArea={true}
								label={'Reason Requires'}
								register={register}
								errors={errors}
								name="otherReason"
								type={InputType.TEXT}
								placeholder="In case of other reason please mention it here"
								validationSchema={{
									validate: (value) => {
										if (!value) {
											return 'Please enter reson.';
										}
									},
								}}
								rows={'4'}
								required={watch('Reason')?.value === 'Other'}
								// required={
								//      allApiData?.ClientDetail?.ActiveTR <= count
								//         ? true
								//         : false
								// }
								// required
							/>
						</div>}
						
					</div>

					<div className={changeDateStyle.formPanelAction}>
						<button
							onClick={() => {
								onCancel();

							}}
							className={changeDateStyle.btn}>
							Cancel
						</button>

						<button
									type="submit"
									className={changeDateStyle.btnPrimary}
									onClick={handleSubmit(onSubmit)}>
									Save
								</button>
					</div>
				</>
			)}
		</div>
	);
};

export default ChangeDate;
