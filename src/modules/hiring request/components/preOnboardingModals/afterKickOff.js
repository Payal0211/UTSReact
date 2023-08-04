import React, {useState, useCallback, useEffect} from "react";
import { Skeleton , DatePicker } from 'antd';
import HRDetailStyle from '../../screens/hrdetail/hrdetail.module.css';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { Controller, useForm } from 'react-hook-form';
import { HRDeleteType, HiringRequestHRStatus, InputType } from 'constants/application';
import { OnboardDAO } from 'core/onboard/onboardDAO';
import { HTTPStatusCode } from 'constants/network';

import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as AfterKickOffSVG } from 'assets/svg/AfterKickOff.svg';


export default function AfterKickOff({talentDeteils,HRID, setShowAMModal,callAPI}) {
    const {
		watch,
		register,
		setValue,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({});

    const [isLoading, setIsLoading] = useState(false)
    const [isTabDisabled, setTabDisabled] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        if(talentDeteils?.TalentCurrenyCode){
            setValue('invoiceCurrency',talentDeteils?.TalentCurrenyCode)
        }
        setIsLoading(false)
    },[talentDeteils,setValue])

    const ScheduleKickOff = useCallback(async (d)=>{
        setIsLoading(true)

        let req = {
            onboardID: talentDeteils?.OnBoardId,
            talentID: talentDeteils?.TalentID,
            hiringRequestID: HRID,
            contactID: talentDeteils?.ContactId,
            action: 'KickOff',
            onboardingClient: {},
            legalTalent: {},
            legalClient: {},
            kickOff: {
                kickoffStatusID: 5,
                kickoffTimezonePreferenceId: null,
                kickoffDate: null,
                "isAfterKickOff": true
            },
            afterKickOff:{
                "zohoInvoiceNumber": d.zohoInvoiceNumber,
                "invoiceCurrency": d.invoiceCurrency,
                "invoiceAmount": d.invoiceAmount,
                "contractStartDate": d.startDate,
                "contractEndDate": d.endDate,
                "talentOnBoardDate": d.talentDate
              }
        };

        // console.log("ScheduleKickOff",req, d)
        
        let response = await OnboardDAO.onboardStatusUpdatesRequestDAO(
            req,
        );
        // console.log("After KickOff response",response)
        if (response?.statusCode === HTTPStatusCode.OK) {
        setIsLoading(false)
        callAPI(HRID)
        }
         setIsLoading(false)
    },[talentDeteils, HRID,callAPI])

  return (
    <div className={HRDetailStyle.onboardingProcesswrap}>
    <div className={HRDetailStyle.onboardingProcesspart}>
        <div className={HRDetailStyle.onboardingProcesBox}>
            <div className={HRDetailStyle.onboardingProcessLeft}>
                <div><AfterKickOffSVG width="31" height="30" /></div>
                <h3 className={HRDetailStyle.titleLeft}>After Kick-off</h3>
            </div>

            <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
                    {isLoading ? <Skeleton /> : <>
                        <div className={HRDetailStyle.modalFormCol}>
                        <HRInputField
                            register={register}
                            errors={errors}
                            validationSchema={{
                                required: 'please enter the company name.',
                            }}
                            label="Zoho Invoice Number"
                            name="zohoInvoiceNumber"
                            type={InputType.TEXT}
                            placeholder="Enter Zoho Invoice Number"
                            required
                        />
                    </div>

                    <div className={HRDetailStyle.modalFormCol}>						
                        <div className={`${HRDetailStyle.formGroup} ${HRDetailStyle.phoneNoGroup} ${errors.invoiceAmount ? HRDetailStyle.marginBottom0 : ''}`}>
                                <label className={HRDetailStyle.timeLabel}>Invoice Value  <span className={HRDetailStyle.reqFieldRed}>*</span></label>
                                <div className={HRDetailStyle.phoneNoCode}>
                                    <HRSelectField
                                        searchable={true}
                                        setValue={setValue}
                                        register={register}
                                        name="invoiceCurrency"
                                        // defaultValue="Currency"
                                        placeholder={watch('invoiceCurrency') ? watch('invoiceCurrency') : "Currency"}
                                        required
                                        disabled
                                        // options={flagAndCodeMemo}
                                    />
                                     {/* <HRInputField
                                        // required={watch('userType')?.id === UserAccountRole.SALES}
                                        register={register}
                                        name="invoiceCurrency"
                                        type={InputType.TEXT}
                                        placeholder="Enter Amount"
                                        required
                                        validationSchema={{
                                        	required: 'Please enter amount',
                                        }}
                                        disabled
                                    /> */}
                                </div>
                                <div className={HRDetailStyle.phoneNoInput}>
                                    <HRInputField
                                        // required={watch('userType')?.id === UserAccountRole.SALES}
                                        register={register}
                                        name={'invoiceAmount'}
                                        type={InputType.NUMBER}
                                        placeholder="Enter Amount"
                                        required
                                        validationSchema={{
                                        	required: 'Please enter amount',
                                        }}
                                    />
                                </div>
                        </div>
                        {errors.invoiceAmount && (
								<div className={HRDetailStyle.error}>
									* Please enter amount
								</div>
							)}
                    </div>

                    <div className={HRDetailStyle.modalFormCol}>
                        <label className={HRDetailStyle.timeLabel}>Engagement Start Date  <span className={HRDetailStyle.reqFieldRed}>*</span></label>
                        <div className={`${HRDetailStyle.timeSlotItem} ${errors.startDate ? HRDetailStyle.marginBottom0 : ''}`}>
                            <Controller
                                render={({ ...props }) => (
                                    <DatePicker
                                        // selected={watchFeedbackDate ? watchFeedbackDate : null}
                                        placeholderText="Select Date"
                                        onChange={(date) => {
                                            setValue('startDate', date);
                                        }}
                                        dateFormat="yyyy/MM/dd H:mm:ss"
                                    />
                                )}
                                name="startDate"
                                rules={{ required: true }}
                                control={control}
                                required
                            />
                            <CalenderSVG />
                        </div>
                        {errors.startDate && (
								<div className={HRDetailStyle.error}>
									* Please select Start Date.
								</div>
							)}
                    </div>

                    <div className={HRDetailStyle.modalFormCol}>
                        <label className={HRDetailStyle.timeLabel}>Engagement End Date  <span className={HRDetailStyle.reqFieldRed}>*</span></label>
                        <div className={`${HRDetailStyle.timeSlotItem} ${errors.endDate ? HRDetailStyle.marginBottom0 : ''}`}>
                            <Controller
                                render={({ ...props }) => (
                                    <DatePicker
                                        // selected={watchFeedbackDate ? watchFeedbackDate : null}
                                        placeholderText="Select Date"
                                        onChange={(date) => {
                                            setValue('endDate', date);
                                        }}
                                        dateFormat="yyyy/MM/dd H:mm:ss"
                                    />
                                )}
                                name="endDate"
                                rules={{ required: true }}
                                control={control}
                                required
                            />
                            <CalenderSVG />
                        </div>
                        {errors.endDate && (
								<div className={HRDetailStyle.error}>
									* Please select End Date.
								</div>
							)}
                    </div>

                    <div className={HRDetailStyle.modalFormCol}>
                        <label className={HRDetailStyle.timeLabel}>Talent Start Date  <span className={HRDetailStyle.reqFieldRed}>*</span></label>
                        <div className={`${HRDetailStyle.timeSlotItem} ${errors.talentDate ? HRDetailStyle.marginBottom0 : ''}`}>
                            <Controller
                                render={({ ...props }) => (
                                    <DatePicker
                                        // selected={watchFeedbackDate ? watchFeedbackDate : null}
                                        placeholderText="Select Date"
                                        onChange={(date) => {
                                            setValue('talentDate', date);
                                        }}
                                        dateFormat="yyyy/MM/dd H:mm:ss"
                                    />
                                )}
                                name="talentDate"
                                rules={{ required: true }}
                                control={control}
                                required
                            />
                            <CalenderSVG />
                        </div>
                        {errors.talentDate && (
								<div className={HRDetailStyle.error}>
									* Please select  Date.
								</div>
							)}
                    </div>
                    </>} 

                
                    
                </div>
            </div>

        </div>
    </div>

    <div className={HRDetailStyle.formPanelAction}>
        <button type="submit" className={HRDetailStyle.btnPrimary} disabled={isLoading} onClick={handleSubmit(ScheduleKickOff)}>Complete Kick-off</button>
        <button type="submit" className={HRDetailStyle.btnPrimaryOutline} onClick={()=>setShowAMModal(false)} >Cancel</button>
    </div>
</div>
  )
}
