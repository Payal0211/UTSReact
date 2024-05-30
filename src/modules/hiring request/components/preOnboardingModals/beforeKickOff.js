import React , { useCallback, useEffect, useState } from "react";
import {Skeleton,DatePicker,TimePicker,Checkbox} from 'antd';
import HRDetailStyle from '../../screens/hrdetail/hrdetail.module.css';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { Controller, useForm } from 'react-hook-form';
import { OnboardDAO } from 'core/onboard/onboardDAO';
import { HTTPStatusCode } from 'constants/network';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { HRDeleteType, HiringRequestHRStatus, InputType } from 'constants/application';
import dayjs from 'dayjs'

import { ReactComponent as BeforeKickOffSVG } from 'assets/svg/beforeKickOff.svg';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as ClockIconSVG } from 'assets/svg/TimeStartEnd.svg';
import moment from "moment";
// import DatePicker from "react-datepicker";

export default function BeforeKickOff({talentDeteils,HRID, setShowAMModal,EnableNextTab}) {

    const {
		watch,
		register,
		setValue,
		handleSubmit,
        resetField,
		control,
		formState: { errors },
	} = useForm({});

    const [isLoading, setIsLoading] = useState(false)
    const [talentStatus, setTalentStatus] = useState([]);
    const [isTabDisabled, setTabDisabled] = useState(false)
    const [TabData,setTabData] = useState({})
    const [controlledTimeZone, setControlledTimeZone] = useState()
    const [engagementReplacement,setEngagementReplacement] = useState({
		replacementData : false
	})
    const [addLatter,setAddLetter] = useState(false);
    const [replacementEngHr,setReplacementEngHr] = useState([])
    const loggedInUserID = JSON.parse(localStorage.getItem('userSessionInfo')).LoggedInUserTypeID
    const [controlledEngRep, setControlledEngRep] = useState()

    const getTalentStatusHandler = useCallback(async () => {
        setIsLoading(true)
        if(talentDeteils?.OnBoardId){
            const response = await OnboardDAO.getOnboardStatusRequestDAO({
			onboardID: talentDeteils?.OnBoardId,
			action: 'KickOff',
		});
        // console.log('status handler',response)
		setTalentStatus(response && response?.responseBody?.details?.Data);       
        }	
        setIsLoading(false)
	}, [talentDeteils]);

    useEffect(() => {
		getTalentStatusHandler();
	}, [getTalentStatusHandler]);

    useEffect(()=>{
        if(talentStatus?.Timezonedata?.length && TabData.kickoffTimezonePreferenceId){
            let tZ = talentStatus?.Timezonedata.filter(t => t.id === TabData.kickoffTimezonePreferenceId)[0]
            // console.log(tZ,'tz',talentStatus?.Timezonedata,TabData.kickoffTimezonePreferenceId);
            setControlledTimeZone(tZ.value)
            setValue('timeZone', tZ)
        }
    },[talentStatus,TabData,setValue,controlledTimeZone])

    const fatchOnBoardInfo = useCallback(async (ONBID) =>{
        let result = await OnboardDAO.getTalentOnBoardInfoDAO(ONBID)
            // console.log("fatchOnBoardInfo",result.responseBody.details)

            if (result?.statusCode === HTTPStatusCode.OK){
                const _checkValue = Object.keys(result.responseBody.details.replacementDetail).length === 0;
               if(result.responseBody.details.genOnBoardTalent.kickoffStatusId === 4
                ){
                    EnableNextTab(talentDeteils,HRID,'After Kick-off')
                }  
                setReplacementEngHr(result.responseBody.details.replacementEngAndHR)
                setTabDisabled(result.responseBody.details.isFourthTabReadOnly)
                setEngagementReplacement({
                    ...engagementReplacement,
                    replacementData: _checkValue === false ? true: false,
                  });
                  setValue('lwd', result.responseBody.details.replacementDetail.lastWorkingDay);
                result.responseBody.details.genOnBoardTalent.kickoffDate &&  setValue('callDate',result.responseBody.details.genOnBoardTalent.kickoffDate)

               setTabData(result.responseBody.details.genOnBoardTalent)
               const _filterData = result.responseBody.details.replacementEngAndHR?.filter((e) => e.id === result.responseBody.details.replacementDetail.newHrid || result.responseBody.details.replacementDetail.newOnBoardId);
               setControlledEngRep(_filterData[0].value)
                // setValue('time',result.responseBody.details.genOnBoardTalent.kickoffTimezonePreferenceId)
            }
           
            // result.responseBody.details && setValue('msaDate', result.responseBody.details)
            // setIsLoading(false)
    },[talentDeteils,HRID,EnableNextTab])

    useEffect(()=>{
        if(talentDeteils?.OnBoardId){
            fatchOnBoardInfo(talentDeteils?.OnBoardId)
        }
    },[fatchOnBoardInfo])

    useEffect(()=>{
    if(talentDeteils?.TalentPOCName){
     setValue('pocName',talentDeteils?.TalentPOCName)
    }
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
                kickoffStatusID: 4,
                kickoffTimezonePreferenceId: d.timeZone.id,
                kickoffDate: d.callDate,
                // "isAfterKickOff": false
            },
            afterKickOff:{},
            isReplacement: engagementReplacement?.replacementData,
            talentReplacement: {
            onboardId: talentDeteils?.OnBoardId,
            lastWorkingDay:addLatter === false ? d.lwd :"" ,
            replacementInitiatedby:loggedInUserID.toString(),
            engHRReplacement: addLatter === true || d.engagementreplacement === undefined ? "" : d.engagementreplacement.id 
            }
        };

        // console.log("ScheduleKickOff",req, d)

        let response = await OnboardDAO.onboardStatusUpdatesRequestDAO(
            req,
        );
        // console.log("ScheduleKickOff response",response)
        if (response?.statusCode === HTTPStatusCode.OK) {
        setIsLoading(false)
        EnableNextTab(talentDeteils,HRID,'After Kick-off')
        fatchOnBoardInfo(talentDeteils?.OnBoardId)
        }
         setIsLoading(false)
    },[talentDeteils, HRID,EnableNextTab])

    const onCancel =()=> {
        setShowAMModal(false)
        resetField('callDate')
        resetField('timeZone')
        resetField('pocName')
        resetField('time')
    }

    const disabledDate = (current) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);        
        return current && current < today;
      };

  return (
    <div className={HRDetailStyle.onboardingProcesswrap}>
    <div className={HRDetailStyle.onboardingProcesspart}>
        {isLoading ? <Skeleton /> :  <div className={HRDetailStyle.onboardingProcesBox}>
            <div className={HRDetailStyle.onboardingProcessLeft}>
                <div><BeforeKickOffSVG width="32" height="28" /></div>
                <h3 className={HRDetailStyle.titleLeft}>Before Kick-off</h3>
            </div>

            <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
                    <div className={HRDetailStyle.modalFormCol}>
                        <label className={HRDetailStyle.timeLabel}>Kick off call Date  <span className={HRDetailStyle.reqFieldRed}>*</span></label>
                        <div className={`${HRDetailStyle.timeSlotItem} ${errors.callDate ? HRDetailStyle.marginBottom0 : ''}`}>
                            {isTabDisabled ?
                            <Controller
                            render={({ ...props }) => (
                                <DatePicker
                                value={dayjs(watch('callDate'))}
                                selected={watch('callDate')}
                                    placeholderText={watch('callDate') ? watch('callDate') : "Select Date"}
                                    onChange={(date) => {
                                        setValue('callDate', date);
                                    }}
                                    dateFormat="yyyy/MM/dd H:mm:ss"
                                    disabled={isTabDisabled}
                                />
                            )}
                            name="callDate"
                            rules={{ required: true }}
                            control={control}
                            required
                        /> :<Controller
                                render={({ ...props }) => (
                                    <DatePicker
                                    // value={dayjs(watch('callDate'))}
                                    selected={watch('callDate')}
                                        placeholderText={watch('callDate') ? watch('callDate') : "Select Date"}
                                        onChange={(date) => {
                                            setValue('callDate', date);
                                        }}
                                        dateFormat="yyyy/MM/dd H:mm:ss"
                                        disabled={isTabDisabled}
                                    />
                                )}
                                name="callDate"
                                rules={{ required: true }}
                                control={control}
                                required
                            />
                            }
                            
                            <CalenderSVG />
                        </div>
                        {errors.callDate && (
								<div className={HRDetailStyle.error}>
									* Please select Date.
								</div>
							)}
                    </div>

                    <div className={HRDetailStyle.modalFormCol}>
                    <HRInputField
                            // disabled={jdURLLink}
                            register={register}
                            // leadingIcon={<UploadSVG />}
                            label="Talent Reporting POC"
                            name="pocName"
                            type={InputType.text}
                            // buttonLabel="Upload Document or Add Link"
                            placeholder="Enter POC name"
                            setValue={setValue}
                            // required={!jdURLLink && !getUploadFileData}
                            // onClickHandler={() => setUploadModal(true)}
                            required
                            validationSchema={{
                                required: 'please select POC name.',
                            }}
                            errors={errors}
                            disabled
                        />
                        {/* <HRSelectField
                            isControlled={true}
                            mode="id/value"
                            setValue={setValue}
                            register={register}
                            label={'Talent Reporting POC'}
                            // defaultValue={'Select Deal Source'}
                            placeholder={'Enter POC Name'}
                            name="pocName"
                            isError={errors['pocName'] && errors['pocName']}
                            required
                            errorMsg={'Please select POC name'}
                        /> */}
                    </div>

                    <div className={HRDetailStyle.modalFormCol}>
                        <HRSelectField
                            isControlled={true}
                            controlledValue={controlledTimeZone}
                     setControlledValue={setControlledTimeZone}
                            mode="id/value"
                            setValue={setValue}
                            register={register}
                            label={'Timezone'}
                            options={talentStatus?.Timezonedata}
                            defaultValue="Please Select"
                            // placeholder={'Enter POC Name'}
                            searchable={true}
                            name="timeZone"
                            isError={errors['timeZone'] && errors['timeZone']}
                            required
                            errorMsg={'Please select timezone'}
                            disabled={isTabDisabled}
                        />
                    </div>

                    <div className={HRDetailStyle.modalFormCol}>
               
                        <label className={HRDetailStyle.timeLabel}>Start & End Time 
                         {/* <span className={HRDetailStyle.reqFieldRed}>*</span> */}
                         </label>
                        <div className={`${HRDetailStyle.timeSlotItem} ${HRDetailStyle.timeSlotSvgWrap}`}>
                            <div className={HRDetailStyle.timeSlotLeftIcon}>
                                <ClockIconSVG />				
                            </div>
                            <Controller
                                render={({ ...props }) => (
                                    <TimePicker.RangePicker 
                                    disabled={isTabDisabled}
                                    use12Hours
                                    required
                                    suffixIcon={<ClockIconSVG />}
                                    onChange={time=> {
                                        let [start, end] = time
                                        // console.log(start.format('hh:mm:ss a'), end.format('hh:mm:ss a'))
                                        setValue('time',[start.format('hh:mm:ss a'),end.format('hh:mm:ss a')])
                                    }}
                                    
                                    // onSelect={time=> console.log('select',time)}
                            />
                                )}
                                name="time"
                                // rules={{ required: true }}
                                control={control}
                                // required
                            />
                            {/* <TimePicker.RangePicker 
                                    required
                                    suffixIcon={<ClockIconSVG />}
                                    onChange={time=> console.log(time)}
                                    onSelect={time=> console.log('select',time)}
                            /> */}
                            <div className={HRDetailStyle.timeSlotRightIcon}>
                                <ClockIconSVG />
                            </div>
                        </div>
                        {errors.time && (
								<div className={HRDetailStyle.error}>
									* Please select Start & End Time.
								</div>
							)}
                    </div>

                </div>
            </div>

        </div>}

        {isLoading ? <Skeleton /> :  <div className={HRDetailStyle.onboardingProcesBox}>
            <div className={HRDetailStyle.onboardingProcessLeft}>
                <div><BeforeKickOffSVG width="32" height="28" /></div>
                <h3 className={HRDetailStyle.titleLeft}>Replacement Details</h3>
            </div>

            <div className={HRDetailStyle.onboardingProcessMid}>
              <div className={`${HRDetailStyle.labelreplacement}`}>
                  <Checkbox
                          disabled={isTabDisabled}
                          name="PayPerCredit"
                          checked={engagementReplacement?.replacementData}
                          onChange={(e) => {
                          setEngagementReplacement({
                          ...engagementReplacement,
                          replacementData: e.target.checked,
                          });
                          if(e.target.checked === false){
                            setAddLetter(false)
                            setValue("lwd","");
                            setValue("engagementreplacement","")
                          }
                        }}
                      >
                      Is this engagement going under replacement?
                  </Checkbox>
              </div>
              <div className={`${HRDetailStyle.labelreplacement}`}>
                <div className={HRDetailStyle.colMd6}>
                  {engagementReplacement?.replacementData &&<div className={HRDetailStyle.timeSlotItemField}>
                    <div className={HRDetailStyle.timeLabel}>
                      Last Working Day
                    </div>
                    <div className={HRDetailStyle.timeSlotItem}>
                      <CalenderSVG />
                      <Controller
                        render={({ ...props }) => (
                          <DatePicker
                            selected={watch('lwd')}
                            onChange={(date) => {
                              setValue('lwd', date);
                            }}
                            placeholderText="Last Working Day"
                            dateFormat="dd/MM/yyyy"
                            // minDate={new Date()}
                            disabledDate={disabledDate}
                            // disabled={addLatter}
                          />
                        )}
                        name="lwd"
                        rules={{ required: true }}
                        control={control}
                      />
                    </div>
                  </div>}
                </div>
              </div>
              <div className={HRDetailStyle.labelreplacement}>
                {engagementReplacement?.replacementData && <div className={HRDetailStyle.colMd6}>
                  <HRSelectField
                    controlledValue={controlledEngRep}
                    setControlledValue={setControlledEngRep}
                    isControlled={true}
                    disabled={addLatter || isTabDisabled}
                    setValue={setValue}
                    mode={"id/value"}
                    register={register}
                    name="engagementreplacement"
                    label="Select HR ID/Eng ID created to replace this engagement"
                    defaultValue="Select HR ID/Eng ID"
                    options={replacementEngHr ? replacementEngHr.map(item=> ({id: item.stringIdValue, value:item.value})) : []}
                  />
                </div>}
              </div>
              <div className={`${HRDetailStyle.labelreplacement} ${HRDetailStyle.mb32}`}>
                {engagementReplacement?.replacementData &&<div className={HRDetailStyle.colMd12}>
                  <Checkbox
                              name="PayPerCredit"
                                checked={isTabDisabled}
                                onChange={(e) => {
                                  setAddLetter(e.target.checked);
                    }}
                            >
                  Will add this later, by doing this you understand that replacement will not be tracked correctly.
                            </Checkbox>
                </div>}
              </div>
            </div>

        </div>}
       
    </div>

    <div className={HRDetailStyle.formPanelAction}>
        <button type="submit" className={HRDetailStyle.btnPrimary} disabled={isTabDisabled? isTabDisabled:isLoading} onClick={handleSubmit(ScheduleKickOff)} >Schedule Kick-off</button>
        <button type="submit" className={HRDetailStyle.btnPrimaryOutline} onClick={()=> onCancel()} >Cancel</button>
    </div>
</div>
  )
}
