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
import moment from 'moment';

const ChangeDate = ({
	updateTR,
	setUpdateTR,
	onCancel,
	apiData,
	allApiData,
	slaReasons,
	hrSLADetails,
	updateSlaDateHandler
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

	 const [dateToChange, setDateToChange] = useState(hrSLADetails.length ?  hrSLADetails[6].slaDate : '')

	const onSubmit = async (d) => {
		setIsLoading(true);
		let payload = {
			"hrId": allApiData.HR_Id,
			"reasonId": d.Reason.id, // For other reason, pass id 4 and resaon in otherReason key
			"otherReason": d.Reason.value === 'Other' ? d.otherReason : '',
			"slaRevisedDate": moment(d.newDate).format() ,
		  }
		//   console.log("payload to send", payload)
		  updateSlaDateHandler(payload,setIsLoading)
		;
	};


	// useEffect(() => {
	// 	if(hrSLADetails[6]?.slaDate){
	// 		setValue('newDate',hrSLADetails[6]?.slaDate)
	// 	}
	// }, [hrSLADetails[6].slaDate]);

	// console.log('watch',watch('Reason'), watch('newDate'))
	return (
		<div className={changeDateStyle.engagementModalContainer}>
			<div className={changeDateStyle.updateTRTitle}>
				<h2>Edit SLA - Share Shortlisted Profiles</h2>
				<div className={changeDateStyle.secondHeadindAllignment}>
					<p>
					{ allApiData?.ClientDetail?.HR_Number} | Senior Front End Developer
				</p>
				<div className={changeDateStyle.StepscreeningBox}>Date - {hrSLADetails.length && hrSLADetails[0].slaDate}</div>
				</div>
				
			</div>

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
							{...props}
                              selected={watch("newDate")}
                              onChange={(date) => {
                                setValue("newDate", date);
								setDateToChange(date)
                              }}
							  value={dateToChange}
                              dateFormat="dd/MM/yyyy"
                              placeholderText="Select Date"
							  minDate={hrSLADetails[6].slaDate ?  new Date(hrSLADetails[6].slaDate?.split('/').reverse().join('-')) : new Date()}
							  filterDate={date => {
								// Disable weekends (Saturday and Sunday)
								return date.getDay() !== 0 && date.getDay() !== 6;
							  }}
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
                            Please Select new Date
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
                        defaultValue={"Select Reason"}
                        name="Reason"
                        options={slaReasons.length && slaReasons.map(reson => ({id:reson.value, value:reson.text }))}
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
