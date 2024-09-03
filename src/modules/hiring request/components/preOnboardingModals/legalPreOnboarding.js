import React, { useEffect, useState, useCallback, useRef } from "react";
import { Skeleton, Dropdown, Menu, message, Checkbox, DatePicker } from "antd";
import HRDetailStyle from "../../screens/hrdetail/hrdetail.module.css";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { Controller, useForm } from "react-hook-form";
import {
  HRDeleteType,
  HiringRequestHRStatus,
  InputType,
} from "constants/application";
import { OnboardDAO } from "core/onboard/onboardDAO";
import { MasterDAO } from "core/master/masterDAO";
import { HTTPStatusCode } from "constants/network";
import { ReactComponent as UploadSVG } from "assets/svg/upload.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import UploadModal from "shared/components/uploadModal/uploadModal";

import { ReactComponent as GeneralInformationSVG } from "assets/svg/generalInformation.svg";
import { ReactComponent as EditFieldSVG } from "assets/svg/EditField.svg";
import { ReactComponent as AboutCompanySVG } from "assets/svg/aboutCompany.svg";
import { ReactComponent as ClientTeamMemberSVG } from "assets/svg/clientTeammember.svg";
import { ReactComponent as LinkedinClientSVG } from "assets/svg/LinkedinClient.svg";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReactComponent as TelentDetailSVG } from "assets/svg/TelentDetail.svg";
import { ReactComponent as DuringLegalSVG } from "assets/svg/duringLegal.svg";
import dayjs from "dayjs";

import { BsThreeDots } from "react-icons/bs";
import moment from "moment";

export default function LegalPreOnboarding({
  talentDeteils,
  HRID,
  setShowAMModal,
  callAPI,
  getHrUserData,
  actionType,
  setLegalPreOnboardingAMAssignment,
}) {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    clearErrors,
    control,
    formState: { errors },
  } = useForm({});
  const [isLoading, setIsLoading] = useState(false);
  const [getData, setData] = useState();
  const [engagementReplacement, setEngagementReplacement] = useState({
    replacementData: false,
  });
  const [addLatter, setAddLetter] = useState(false);
  const [controlledEngRep, setControlledEngRep] = useState();
  const [replacementEngHr, setReplacementEngHr] = useState([]);
  const loggedInUserID = JSON.parse(
    localStorage.getItem("userSessionInfo")
  ).LoggedInUserTypeID;
  const [isIndefiniteMonth,setIsIndefiniteMonth] = useState(false);

  const fatchduringOnBoardInfo = useCallback(
    async (req) => {
      setIsLoading(true);
      let result = await OnboardDAO.getDuringOnBoardInfoDAO(req);
      if (result?.statusCode === HTTPStatusCode.OK) {
        let data = result.responseBody.details;
        setData(data);
        setValue("invoiceRaisinfTo", data?.getLegalInfo?.invoiceRaiseTo);
        setValue(
          "invoiceRaiseToEmail",
          data?.getLegalInfo?.invoiceRaiseToEmail
        );
        setValue(
          "contractStartDate",
          dayjs(data?.getLegalInfo?.contractStartDate).toDate()
        );
        setValue(
          "contractEndDate",
          dayjs(data?.getLegalInfo?.contractEndDate).toDate()
        );
        setValue(
          "lwd",
          dayjs(data?.ReplacementDetail?.lastWorkingDay).toDate()
        );
        setReplacementEngHr(data?.replacementEngHRs);
        setLegalPreOnboardingAMAssignment(data);
        const _filterData = data?.replacementEngHRs?.filter(
          (e) =>
            e.id === data?.replacementEngHRs?.newHrid ||
            data?.replacementEngHRs?.newOnBoardId
        );
        setControlledEngRep(_filterData[0]?.value);
        setValue("engagementreplacement", _filterData[0]);
      }
      setIsLoading(false);
    },
    [setValue]
  );

  useEffect(()=> {
    setIsIndefiniteMonth(getData?.getLegalInfo?.isIndefiniteMonth)
  },[getData?.getLegalInfo?.isIndefiniteMonth])

  useEffect(() => {
    if (talentDeteils?.OnBoardId) {
      let req = {
        OnboardID: talentDeteils?.OnBoardId,
        HRID: HRID,
      };
      fatchduringOnBoardInfo(req);
    }
  }, [talentDeteils, HRID, actionType, fatchduringOnBoardInfo]);

  const handleOnboarding = useCallback(
    async (d) => {
      let isValid = true;
      setShowAMModal(true);
      setIsLoading(true);
      if (engagementReplacement?.replacementData == true) {
      }
      let payload = {
        onBoardID: getData?.getLegalInfo?.onBoardID,
        talentID: getData?.getLegalInfo?.talentID,
        hiringRequestID: getData?.getLegalInfo?.hR_ID,
        contactID: getData?.getLegalInfo?.contactID,
        companyID: getData?.getLegalInfo?.companyID,
        invoiceRaiseTo: d.invoiceRaisinfTo,
        invoiceRaiseToEmail: d.invoiceRaisingToEmail,
        contractStartDate: getData?.getLegalInfo?.isHRTypeDP === true ? moment(d.engagementStartDate).format("yyyy-MM-DD") : moment(d.contractStartDate).format("yyyy-MM-DD"),
        joiningDate: moment(d.joiningDate).format('yyyy-MM-DD'),
        contractEndDate: getData?.getLegalInfo?.isHRTypeDP
          ? null
          : isIndefiniteMonth ? null : moment(d.contractEndDate).format("yyyy-MM-DD"),
        clientSOWSignDate: moment(d.clientSOWSignDate).format("yyyy-MM-DD"),
        talentSOWSignDate: moment(d.talentSOWSignDate).format("yyyy-MM-DD"),
        clientMSASignDate: moment(d.msaDate).format("yyyy-MM-DD"),
        talentMSASignDate: null,
        talentReplacement: {
          onboardId: getData?.getLegalInfo?.onBoardID,
          replacementID: getData?.ReplacementDetail?.replaceTalentId,
          hiringRequestID: getData?.getLegalInfo?.hR_ID,
          talentId: getData?.getLegalInfo?.talentID,
          lastWorkingDay:
            engagementReplacement?.replacementData === true
              ? moment(d.lwd).format("yyyy-MM-DD")
              : null,
          lastWorkingDateOption: 0,
          noticeperiod: 0,
          replacementInitiatedby: loggedInUserID.toString(),
          replacementHandledByID: null,
          engagementReplacementOnBoardID: 0,
          replacementTalentId: null,
          engHRReplacement:
            engagementReplacement?.replacementData === true ||
            d.engagementreplacement === undefined
              ? ""
              : d.engagementreplacement.id,
        },
      };
      if(new Date(d.contractStartDate) >= new Date(d.joiningDate)){
        isValid = false;
        setIsLoading(false);
        message.error("The joining date must be greater than contract start date.")
        return
      }      
      if(isValid){
        let result = await OnboardDAO.updatePreOnBoardInfoDAO(payload);
        if (result?.statusCode === HTTPStatusCode.OK) {
          setIsLoading(false);
          setShowAMModal(false);
          callAPI(HRID);
          getHrUserData(HRID)
          setIsLoading(false);
        }
      }
    },
    [getData, engagementReplacement]
  );

  const disabledDate = (current) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current && current < today;
  };

  const date1 = new Date(watch("contractStartDate"));
  const date2 = new Date(watch("contractEndDate"));

  const diffInMilliseconds = date2 - date1;

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const diffInDays = diffInMilliseconds / millisecondsPerDay;

  return (
    <div className={HRDetailStyle.onboardingProcesswrap}>
      <div className={HRDetailStyle.onboardingProcesspart}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <GeneralInformationSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>
                  Invoicing and Contract
                </h3>
              </div>

              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.onboardingFormAlign}>
                  <div className={HRDetailStyle.modalFormWrapper}>
                    <div className={HRDetailStyle.modalFormCol}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        validationSchema={{
                          required: "please enter the Invoice Raising to.",
                        }}
                        label="Invoice Raising to"
                        name="invoiceRaisinfTo"
                        type={InputType.TEXT}
                        placeholder="Enter Name"
                        required
                      />
                    </div>

                    <div className={HRDetailStyle.modalFormCol}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        validationSchema={{
                          required:
                            "please enter the Invoice Raising to Email.",
                        }}
                        label="Invoice Raising to Email"
                        name="invoiceRaisingToEmail"
                        type={InputType.TEXT}
                        placeholder="Enter Email"
                        required
                      />
                    </div>

                    { getData?.getLegalInfo?.isIndefiniteMonth === true &&  <div className={HRDetailStyle.modalFormCol}><Checkbox 
                               checked={isIndefiniteMonth}
                               onChange={(e) =>{
                                 setIsIndefiniteMonth(prev=> !prev)
                               }}
                              //  id={item?.value + `/${index + 1}`}
                               style={{
                                //  fontSize: `${!item.label && '1rem'}`,
                                marginBottom:'10px',
                                 fontWeight: '500',
                               }}>														
                              Indefinite contract
                             </Checkbox></div>}   
               
                    <div className={HRDetailStyle.modalFormCol}>
                      {getData?.getLegalInfo?.isHRTypeDP === true ? (
                        <>
                          <div className={HRDetailStyle.timeLabel}>
                            Engagement Start Date
                            <span className={HRDetailStyle.reqFieldRed}>*</span>
                          </div>
                          <div className={HRDetailStyle.timeSlotItem}>
                            <CalenderSVG />

                            <Controller
                              render={({ ...props }) => (
                                <DatePicker
                                  {...props}
                                  selected={watch("engagementStartDate")}
                                  onChange={(date) => {
                                    setValue("engagementStartDate", date);
                                    clearErrors(`engagementStartDate`);
                                  }}
                                  placeholderText="Engagement Start Date"
                                  dateFormat="dd/MM/yyyy"
                                  disabledDate={disabledDate}
                                  control={control}
                                  // value={watch('contractStartDate')}
                                />
                              )}
                              name="engagementStartDate"
                              rules={{ required: true }}
                              control={control}
                            />
                            {errors.engagementStartDate && (
                              <div className={HRDetailStyle.error}>
                                * Please select Date.
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                       
                          <div className={HRDetailStyle.timeLabel}>
                            Contract Start Date
                            <span className={HRDetailStyle.reqFieldRed}>*</span>
                          </div>
                          <div className={HRDetailStyle.timeSlotItem}>
                            <CalenderSVG />
                            <Controller
                              render={({ ...props }) => (
                                <DatePicker
                                  {...props}
                                  selected={watch("contractStartDate")}
                                  onChange={(date) => {
                                    setValue("contractStartDate", date);
                                    clearErrors(`contractStartDate`);
                                  }}
                                  placeholderText="Contract Start Date"
                                  dateFormat="dd/MM/yyyy"
                                  disabledDate={disabledDate}
                                  control={control}
                                  // value={watch('contractStartDate')}
                                />
                              )}
                              name="contractStartDate"
                              rules={{ required: true }}
                              control={control}
                            />
                            {errors.contractStartDate && (
                              <div className={HRDetailStyle.error}>
                                * Please select Date.
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    
                   {!getData?.getLegalInfo?.isHRTypeDP && <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.timeLabel}>
                          Joining Date
                          <span className={HRDetailStyle.reqFieldRed}>*</span>
                        </div>
                        <div className={HRDetailStyle.timeSlotItem}>
                          <CalenderSVG />

                          <Controller
                            render={({ ...props }) => (
                              <DatePicker
                                {...props}
                                selected={watch("joiningDate")}
                                onChange={(date) => {
                                    setValue("joiningDate", date);
                                    clearErrors(`joiningDate`);
                                }}
                                placeholderText="Joining Date"
                                dateFormat="dd/MM/yyyy"
                                disabledDate={disabledDate}
                                control={control}
                                // value={dayjs(watch('contractEndDate'))}
                              />
                            )}
                            name="joiningDate"
                            rules={{ required: true }}
                            control={control}
                          />
                          {errors.joiningDate && (
                            <div className={HRDetailStyle.error}>
                              * Please select Date.
                            </div>
                          )}
                        </div>
                      </div>}


                  {   
                         <>
                         {(!getData?.getLegalInfo?.isHRTypeDP && !isIndefiniteMonth) && (
                          <>
                      <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.timeLabel}>
                          Contract End Date
                          <span className={HRDetailStyle.reqFieldRed}>*</span>
                        </div>
                        <div className={HRDetailStyle.timeSlotItem}>
                          <CalenderSVG />

                          <Controller
                            render={({ ...props }) => (
                              <DatePicker
                                {...props}
                                selected={watch("contractEndDate")}
                                onChange={(date) => {
                                  setValue("contractEndDate", date);
                                  clearErrors(`contractEndDate`);
                                }}
                                placeholderText="Contract End Date"
                                dateFormat="dd/MM/yyyy"
                                disabledDate={disabledDate}
                                control={control}
                                // value={dayjs(watch('contractEndDate'))}
                              />
                            )}
                            name="contractEndDate"
                            rules={{ required:  !isIndefiniteMonth }}
                            control={control}
                          />
                          {errors.contractEndDate && (
                            <div className={HRDetailStyle.error}>
                              * Please select Date.
                            </div>
                          )}
                        </div>
                      </div>
 {getData?.getLegalInfo?.isHRTypeDP === false && <div className={HRDetailStyle.modalFormCol}>
                      <div className={HRDetailStyle.onboardingDetailText}>
                        <span>Contract Duration</span>
                        <span className={HRDetailStyle.onboardingTextBold}>
                          {`${Math.round(diffInDays)} Days`}
                          {/* {getData?.getLegalInfo?.contractDuration ? getData?.getLegalInfo?.contractDuration + "Months" :  "-"} */}
                        </span>
                      </div>
                    </div>}  
                      </>
                    )}                          
                         </>

                    }

                  </div>
                </div>
              </div>
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <DuringLegalSVG width="32" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>Legal Info (Client)</h3>
              </div>

              <div className={HRDetailStyle.onboardingProcessMid}>
                <div
                  className={HRDetailStyle.onboardingFormAlign}
                  style={{ width: "100%" }}
                >
                  <div className={HRDetailStyle.modalFormWrapper}>
                    <div className={HRDetailStyle.modalFormCol}>
                      <div className={HRDetailStyle.timeLabel}>
                        SOW Sign Date{" "}
                        <span className={HRDetailStyle.reqFieldRed}>*</span>
                      </div>
                      <div
                        className={`${HRDetailStyle.timeSlotItem} ${
                          errors.sowDate && HRDetailStyle.marginBottom0
                        }`}
                      >
                        <CalenderSVG />
                        <Controller
                          render={({ ...props }) => (
                            <DatePicker
                              selected={watch("clientSOWSignDate")}
                              placeholderText="Select Date"
                              // defaultValue={dayjs(watch('sowDate'), 'YYYY-MM-DD')}
                              onChange={(date) => {
                                setValue("clientSOWSignDate", date);
                                clearErrors(`clientSOWSignDate`);
                              }}
                              // value={dayjs(watch('clientSOWSignDate'))}
                              // dateFormat="yyyy/MM/dd"
                            />
                          )}
                          name="clientSOWSignDate"
                          rules={{ required: true }}
                          control={control}
                        />
                        {errors.clientSOWSignDate && (
                          <div className={HRDetailStyle.error}>
                            * Please select Date.
                          </div>
                        )}
                      </div>
                    </div>
                    {/* </div> */}
                    {getData?.getLegalInfo?.isHRTypeDP && (
                      <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.timeLabel}>
                          MSA Sign Date{" "}
                          <span className={HRDetailStyle.reqFieldRed}>*</span>
                        </div>
                        <div
                          className={`${HRDetailStyle.timeSlotItem} ${
                            errors.sowDate && HRDetailStyle.marginBottom
                          }`}
                        >
                          <CalenderSVG />
                          <Controller
                            render={({ ...props }) => (
                              <DatePicker
                                selected={watch("msaDate")}
                                placeholderText="Select Date"
                                // defaultValue={dayjs(watch('sowDate'), 'YYYY-MM-DD')}
                                onChange={(date) => {
                                  setValue("msaDate", date);
                                  clearErrors(`msaDate`);
                                }}
                                // value={dayjs(watch('msaDate'))}
                                // dateFormat="yyyy/MM/dd"
                              />
                            )}
                            name="msaDate"
                            rules={{ required: true }}
                            control={control}
                          />
                          {errors.msaDate && (
                            <div className={HRDetailStyle.error}>
                              * Please select Date.
                            </div>
                          )}
                        </div>
                      </div>
                    )} 
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <DuringLegalSVG width="32" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>Legal Info (Talent)</h3>
              </div>

              <div className={HRDetailStyle.onboardingProcessMid}>
                <div
                  className={HRDetailStyle.onboardingFormAlign}
                  style={{ width: "100%" }}
                >
                  <div className={HRDetailStyle.modalFormWrapper}>
                    <div className={HRDetailStyle.modalFormCol}>
                      <label className={HRDetailStyle.timeLabel}>
                        SOW Sign Date{" "}
                        <span className={HRDetailStyle.reqFieldRed}>*</span>
                      </label>
                      <div
                        className={`${HRDetailStyle.timeSlotItem} ${
                          errors.sowDate && HRDetailStyle.marginBottom0
                        }`}
                      >
                        <CalenderSVG />
                        <Controller
                          render={({ ...props }) => (
                            <DatePicker
                              selected={watch("talentSOWSignDate")}
                              placeholderText="Select Date"
                              // defaultValue={dayjs(watch('sowDate'), 'YYYY-MM-DD')}
                              onChange={(date) => {
                                setValue("talentSOWSignDate", date);
                                clearErrors(`talentSOWSignDate`);
                              }}
                              // dateFormat="yyyy/MM/dd"
                              // value={dayjs(watch('talentSOWSignDate'))}
                            />
                          )}
                          name="talentSOWSignDate"
                          rules={{ required: true }}
                          control={control}
                        />
                        {errors.talentSOWSignDate && (
                          <div className={HRDetailStyle.error}>
                            * Please select Date.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <TelentDetailSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>Replacement Details</h3>
              </div>

              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
                  <div
                    className={`${HRDetailStyle.colMd12} ${HRDetailStyle.colmb32}`}
                  >
                    <Checkbox
                      name="PayPerCredit"
                      checked={engagementReplacement?.replacementData}
                      onChange={(e) => {
                        setEngagementReplacement({
                          ...engagementReplacement,
                          replacementData: e.target.checked,
                        });
                        if (e.target.checked === false) {
                          setAddLetter(false);
                          setValue("lwd", "");
                          setValue("engagementreplacement", "");
                        }
                      }}
                    >
                      Is this engagement going under replacement?
                    </Checkbox>
                  </div>

                  {engagementReplacement?.replacementData && (
                    <div className={HRDetailStyle.modalFormCol}>
                      <div className={HRDetailStyle.timeSlotItemField}>
                        <div className={HRDetailStyle.timeLabel}>
                          Last Working Day
                        </div>
                        <div className={HRDetailStyle.timeSlotItem}>
                          <CalenderSVG />

                          <Controller
                            render={({ ...props }) => (
                              <DatePicker
                                {...props}
                                selected={dayjs(watch("lwd"))}
                                onChange={(date) => {
                                  setValue("lwd", date);
                                }}
                                placeholderText="Last Working Day"
                                dateFormat="dd/MM/yyyy"
                                disabledDate={disabledDate}
                                // value={dayjs(watch('lwd'))}
                                control={control}
                              />
                            )}
                            name="lwd"
                            rules={{ required: true }}
                            control={control}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {engagementReplacement?.replacementData && (
                    <div className={HRDetailStyle.modalFormCol}>
                      <HRSelectField
                        controlledValue={controlledEngRep}
                        setControlledValue={setControlledEngRep}
                        isControlled={true}
                        disabled={addLatter}
                        setValue={setValue}
                        mode={"id/value"}
                        register={register}
                        name="engagementreplacement"
                        label="Select HR ID/Eng ID created to replace this engagement"
                        defaultValue="Select HR ID/Eng ID"
                        options={
                          replacementEngHr
                            ? replacementEngHr.map((item) => ({
                                id: item.stringIdValue,
                                value: item.value,
                              }))
                            : []
                        }
                      />
                    </div>
                  )}

                  {engagementReplacement?.replacementData && (
                    <div
                      className={`${HRDetailStyle.colMd12} ${HRDetailStyle.colmb32}`}
                    >
                      <Checkbox
                        name="PayPerCredit"
                        checked={addLatter}
                        onChange={(e) => {
                          setAddLetter(e.target.checked);
                        }}
                      >
                        Will add this later, by doing this you understand that
                        replacement will not be tracked correctly.
                      </Checkbox>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={HRDetailStyle.formPanelAction}>
        <button
          type="submit"
          className={HRDetailStyle.btnPrimaryOutline}
          //   onClick={() => setShowAMModal(false)}
          onClick={() => {callAPI(HRID); getHrUserData(HRID)}}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={HRDetailStyle.btnPrimary}
          onClick={handleSubmit(handleOnboarding)}
        >
          Save Details
        </button>
      </div>
    </div>
  );
}
