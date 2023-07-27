import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputType, SubmitType } from "constants/application";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { Button, Divider, Dropdown, Menu, Radio, Space } from "antd";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReactComponent as EditSVG } from "assets/svg/edit.svg";
import { ReactComponent as TimeDropDownSVG } from "assets/svg/timeDropdown.svg";
import { ReactComponent as ClockIconSVG } from "assets/svg/clock-icon.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { AiFillLinkedin } from "react-icons/ai";
import { PlusOutlined } from "@ant-design/icons";
import OnboardStyleModule from "./onboardField.module.css";
import AddNewOnboardStyle from "../../screens/addNewOnboard/addNewOnboard.module.css";
import { MasterDAO } from "core/master/masterDAO";
import AddTeamMemberModal from "../addTeamMembers/addTeamMemberModal";
import TeamMembers from "../teamMembers/teamMembers";
import { onboardUtils } from "modules/onboard/onboardUtils";
import { engagementRequestDAO } from "core/engagement/engagementDAO";
import { OnboardDAO } from "core/onboard/onboardDAO";
import { HTTPStatusCode } from "constants/network";
import { useNavigate, useParams } from "react-router-dom";
import UTSRoutes from "constants/routes";
import moment from "moment";
import LogoLoader from 'shared/components/loader/logoLoader';

const OnboardField = () => {
  const { onboardID } = useParams();
  const [value, setRadioValue] = useState(1);
  const [showTextBox, setTextBox] = useState(true);
  const [contractType, setContractType] = useState([]);
  const [talentTimeZone, setTalentTimeZone] = useState([]);
  const [netPaymentDays, setNetPaymentDays] = useState([]);
  const [addTeamMembersModal, setAddTeamMemberModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isEditMode, setEditMode] = useState(false);
  const [indexOfMember, setIndexOfMember] = useState(null);
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);

  const [getOnboardFormDetails, setOnboardFormDetails] = useState({});

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    control,
    formState: { errors },
  } = useForm({});
  const onChange = (e) => {
    setRadioValue(e.target.value);
    if (e.target.value === 1) {
      setTextBox(true);
    } else {
      setTextBox(false);
    }
  };
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const [getFieldsDisabled, setFieldsDisable] = useState(false);
  const [controlledContractTypeValue, setControlledContractTypeValue] =
    useState("");
  const [controlledTimeZoneValue, setControlledTimeZoneValue] = useState("");
  const [controlledContractDurationValue, setControlledContractDurationValue] =
    useState("");

  const navigate = useNavigate();
  const [name, setName] = useState({});
  const inputRef = useRef(null);
  const [contractDurations, setcontractDurations] = useState([]);
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const addItem = useCallback(
    (e) => {
      e.preventDefault();
      setcontractDurations([...contractDurations, name + " months" || name]);
      setName("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    },
    [contractDurations, name]
  );

  const contractTypeHandler = useCallback(async () => {
    let response = await MasterDAO.getContractTypeRequestDAO();
    setContractType(response && response?.responseBody?.details);
  }, []);

  const talentTimeZoneHandler = useCallback(async () => {
    let response = await MasterDAO.getTalentTimeZoneRequestDAO();
    setTalentTimeZone(response && response?.responseBody);
  }, []);

  const contractDurationHandler = useCallback(async () => {
    let response = await MasterDAO.getContractDurationRequestDAO();
    console.log("Duration", response);
    setcontractDurations(response && response?.responseBody);
  }, []);

  const netPaymentDaysHandler = useCallback(async () => {
    let response = await MasterDAO.getNetPaymentDaysRequestDAO();
    console.log("netpaymentDyas", netPaymentDays);
    setNetPaymentDays(response && response?.responseBody?.details);
  }, []);

  const onEditHandler = useCallback((index) => {
    setIndexOfMember(index);
    setAddTeamMemberModal(true);
  }, []);

  const onRemoveHandler = useCallback(
    (pos) => {
      const itemRemoved = teamMembers.filter((item, index) => pos !== index);

      setTeamMembers(itemRemoved);
    },
    [teamMembers]
  );

  console.log({ errors });
  const onboardSubmitHandler = useCallback(
    async (d, type = SubmitType.SAVE_AS_DRAFT) => {
      setIsSavedLoading(true)
      let onboardDataFormatter = onboardUtils.onboardDataFormatter(
        d,
        type,
        watch,
        onboardID,
        teamMembers
      );

      const onBoardBody = {
        onboardID: parseInt(onboardDataFormatter.onboardID),
        contractType: onboardDataFormatter.contractType,
        contractStartDate: onboardDataFormatter.contractStartDate,
        contractEndDate: onboardDataFormatter.contractEndDate,
        contractDuration: parseInt(onboardDataFormatter.contractDuration),
        talentOnBoardDate: onboardDataFormatter.talentOnBoardDate,
        talentOnBoardTime: onboardDataFormatter.talentOnBoardTime,
        punchStartTime: onboardDataFormatter.punchStartTime,
        punchEndTime: onboardDataFormatter.punchEndTime,
        timezone_Preference_ID: onboardDataFormatter.timezone_Preference_ID,
        firstClientBillingDate: onboardDataFormatter.firstClientBillingDate,
        netPaymentDays: onboardDataFormatter.netPaymentDays,
        contractRenewalSlot: onboardDataFormatter.contractRenewalSlot
          ? onboardDataFormatter.contractRenewalSlot
          : 0,
        client_Remark: onboardDataFormatter.client_Remark,
        clientName: onboardDataFormatter.clientName,
        clientemail: onboardDataFormatter.clientemail,
        engagemenID: onboardDataFormatter.engagemenID,
        hiringRequestNumber: onboardDataFormatter.hiringRequestNumber,
        talentName: getOnboardFormDetails.onboardDetails.talentName,
        talentEmailId: getOnboardFormDetails.onboardDetails.talentEmailId,
        startDay: onboardDataFormatter.contractStartDate,
        endDay: onboardDataFormatter.contractEndDate,
        teamMemebers: onboardDataFormatter.teamMemebers,
        wokringDays: " 0 to 0",
        talentWorkingTimeZone: `${onboardDataFormatter.timezone_Preference_ID}`,
        devicesPoliciesOption: "",
        talentDeviceDetails: "",
        totalDurationInMonths: parseInt(onboardDataFormatter.contractDuration),
        expectationFromTalent_FirstWeek: "",
        expectationFromTalent_FirstMonth: "",
        proceedWithUplers_LeavePolicyOption: "",
        proceedWithClient_LeavePolicyFileUpload: "",
        proceedWithClient_LeavePolicyLink: "",
        proceedWithClient_LeavePolicyOption: "",
        proceedWithUplers_ExitPolicyOption:
          onboardDataFormatter.proceedWithUplers_ExitPolicyOption,
      };
      console.log("onboard data formatter", onboardDataFormatter, onBoardBody);
      const addOnboardResponse = await OnboardDAO.onboardTalentRequestDAO(
        onBoardBody
      );
      console.log("onboard data formatter response", addOnboardResponse);
      if (addOnboardResponse.statusCode === HTTPStatusCode.OK) {
        navigate(-1);
        setIsSavedLoading(false)
      }
      setIsSavedLoading(false)
    },
    [navigate, teamMembers, watch,getOnboardFormDetails,onboardID]
  );

  useEffect(() => {
    contractTypeHandler();
    talentTimeZoneHandler();
    netPaymentDaysHandler();
    contractDurationHandler();
    return () => {
      setContractType([]);
      setTalentTimeZone([]);
      setNetPaymentDays([]);
      setcontractDurations([]);
    };
  }, [
    contractTypeHandler,
    netPaymentDaysHandler,
    talentTimeZoneHandler,
    contractDurationHandler,
  ]);

  const SETonboardingFormValue = (value) => {
    setValue("companyName", value.compnayName);
    setValue("clientName", value.onboardDetails.clientName);
    setValue("clientEmail", value.onboardDetails.clientemail);
    setValue("talentEmail", value.onboardDetails.talentEmailId);
    setValue("engagementID", value.onboardDetails.engagemenID);
    setValue("hiringID", value.hrid);
    // const contract = contractType.filter(item=> item.value ===value.contractType)[0]

    // setValue('contractType', contract)
    // setControlledContractTypeValue(contract.value)
    if (value.contractStartDate === "") {
      var firstDay = new Date();
      var lastDay = new Date(
        firstDay.getFullYear(),
        firstDay.getMonth() +
          (getOnboardFormDetails?.onboardDetails?.totalDuration
            ? 1 * getOnboardFormDetails?.onboardDetails?.totalDuration
            : 1),
        firstDay.getDate()
      );
      console.log({ firstDay: firstDay, lastDay: lastDay });
      setValue("contractStartDate", firstDay);
      setValue("contractEndDate", lastDay);
    } else {
      value?.contractStartDate &&  setValue("contractStartDate", new Date(value?.contractStartDate));
      value?.contractEndDate && setValue("contractEndDate", new Date(value?.contractEndDate));
    }

    value?.onboardDetails?.talentOnBoardDate && setValue("talentOnboardingDate", new Date(value?.onboardDetails?.talentOnBoardDate));
    //  setValue("talentOnboardingTime", value?.onboardDetails?.talentOnBoardTime);
    // setValue('netPaymentDays', value.netPaymentDays)
   setValue("contractRenewal", value?.autoRenewContract);
   value?.onboardDetails.clientFirstDate && setValue("clientFirstBillingDate", new Date(value?.onboardDetails.clientFirstDate));

    // for bill rate
    setValue("phoneNumber", value.billRate);

  };

  // for ContractType
  useEffect(() => {
    if (getOnboardFormDetails.contractType && contractType.length > 0) {
      const contract = contractType.filter(
        (item) => item.value === getOnboardFormDetails.contractType
      )[0];
      setValue("contractType", contract);
      setControlledContractTypeValue(contract.value);
    }
  }, [getOnboardFormDetails, contractType]);

  // for netPayment
  useEffect(() => {
    if (
      getOnboardFormDetails?.onboardDetails?.netPaymentDays &&
      netPaymentDays.length > 0
    ) {
      const netPaymentDay = netPaymentDays.filter(
        (item) =>
          item.value === getOnboardFormDetails?.onboardDetails?.netPaymentDays
      );
      console.log(
        "netPaymentDays",
        getOnboardFormDetails?.onboardDetails?.netPaymentDays,
        netPaymentDays
      );
      setValue("netPaymentDays", netPaymentDay[0]);
    }
  }, [getOnboardFormDetails, netPaymentDays]);

  // contract duration
  useEffect(() => {
    console.log(
      " tiem",
      getOnboardFormDetails?.onboardDetails?.totalDuration,
      contractDurations
    );
    if (
      getOnboardFormDetails?.onboardDetails?.totalDuration &&
      contractDurations.length > 0
    ) {
      let contract = contractDurations.filter(
        (item) =>
          parseInt(item.value) ===
          parseInt(getOnboardFormDetails?.onboardDetails?.totalDuration)
      );
      if (contract.length > 0) {
        setValue("contractDuration", contract[0]);
        setControlledContractDurationValue(contract[0].value);
      } else {
        if (getOnboardFormDetails?.onboardDetails?.totalDuration !== 0) {
          const object = {
            disabled: false,
            group: null,
            selected: false,
            text: `${getOnboardFormDetails?.onboardDetails?.totalDuration} months`,
            value: `${getOnboardFormDetails?.onboardDetails?.totalDuration}`,
          };

          setcontractDurations((prev) => [...prev, object]);
          // this will trigger this Effect again and then go to if
        }
      }
    }
  }, [getOnboardFormDetails, contractDurations]);

  // for timezone
  useEffect(() => {
    if (
      getOnboardFormDetails.talentWorkingTimeZone &&
      talentTimeZone.length > 0
    ) {
      const time = talentTimeZone.filter(
        (item) => item.id === getOnboardFormDetails.talentWorkingTimeZone
      )[0];
      console.log(getOnboardFormDetails.talentWorkingTimeZone, time);
      setControlledTimeZoneValue(time.value);
      setValue("timeZone", time);
    }
  }, [getOnboardFormDetails, talentTimeZone]);

  const getOnboardingForm = async (getOnboardID) => {
    setOnboardFormDetails({});
    // setLoading(true);
    const response = await engagementRequestDAO.viewOnboardDetailsDAO(
      getOnboardID
    );
    if (response?.statusCode === HTTPStatusCode.OK) {
      setOnboardFormDetails(response?.responseBody?.details);
      setFieldsDisable(true);
      SETonboardingFormValue(response?.responseBody?.details);

      // setLoading(false);
    } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      // setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      return "NO DATA FOUND";
    }
  };

  useEffect(() => {
    if (onboardID) {
      getOnboardingForm(onboardID);
    }
  }, [onboardID]);

  const [endDateError, setEndDateError] = useState(false);

  useEffect(() => {
    let startDay = watch("contractStartDate");
    let endDay = watch("contractEndDate");
    setEndDateError(false);
    if (startDay && endDay) {
      var dateOne = new Date(
        startDay.getFullYear(),
        startDay.getMonth(),
        startDay.getDay()
      ); //Year, Month, Date
      var dateTwo = new Date(
        endDay.getFullYear(),
        endDay.getMonth(),
        endDay.getDay()
      ); //Year, Month, Date
      if (dateOne > dateTwo) {
        setEndDateError(true);
        setTimeout(() => setValue("contractEndDate", ""), 2000);
        return;
      }

      var months;
      months = (endDay.getFullYear() - startDay.getFullYear()) * 12;
      months -= startDay.getMonth();
      months += endDay.getMonth();
      console.log("month gap", months <= 0 ? 0 : months, startDay, endDay);
      if (months >= 0) {
        const object = {
          disabled: false,
          group: null,
          selected: false,
          text: `${months} months`,
          value: `${months}`,
        };
        //    if(contractDurations.filter(duration=> duration.value === `${months}` ).length === 0){
        //   setcontractDurations((prev) => [...prev, object]);
        //   return
        // }
        // setcontractDurations((prev) => [...prev, object]);
        setValue("contractDuration", object);
        setControlledContractDurationValue(object.value);
      }
    }
  }, [watch("contractStartDate"), watch("contractEndDate"), setValue]);

  console.log(onboardID, getOnboardFormDetails);
  return (
    <div className={OnboardStyleModule.hrFieldContainer}>
      <div className={AddNewOnboardStyle.onboardLabel}>
        Pre - Onboarding For {getOnboardFormDetails?.onboardDetails?.talentName}
      </div>
      <div id="hrForm">
        <div className={OnboardStyleModule.partOne}>
          <div className={OnboardStyleModule.hrFieldLeftPane}>
            <h3>General Information</h3>
            <p>Please provide the necessary details</p>
            {onboardID && (
              <div className={OnboardStyleModule.formPanelAction}>
                <button
                  className={OnboardStyleModule.btnPrimary}
                  // onClick={}
                >
                  Edit User
                </button>
              </div>
            )}
          </div>

          <div className={OnboardStyleModule.hrFieldRightPane}>
            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd6}>
                <HRInputField
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Please enter client name",
                  }}
                  label={"Client Name"}
                  name="clientName"
                  type={InputType.TEXT}
                  placeholder="Enter Name "
                  required
                  disabled={getFieldsDisabled}
                />
              </div>
              <div className={OnboardStyleModule.colMd6}>
                <HRInputField
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "please enter the client email",
                  }}
                  label="Client Email"
                  name="clientEmail"
                  type={InputType.EMAIL}
                  placeholder="Enter Email"
                  required
                  disabled={getFieldsDisabled}
                />
              </div>
            </div>
            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd6}>
                <HRInputField
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Please enter company name",
                  }}
                  label={"Company Name"}
                  name="companyName"
                  type={InputType.TEXT}
                  placeholder="Enter Name "
                  required
                  disabled={getFieldsDisabled}
                />
              </div>
              <div className={OnboardStyleModule.colMd6}>
                <HRInputField
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "please enter the talent email",
                  }}
                  label="Talent Email"
                  name="talentEmail"
                  type={InputType.TEXT}
                  placeholder="Enter Email"
                  required
                  disabled={getFieldsDisabled}
                />
              </div>
            </div>
            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd6}>
                <HRInputField
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Please enter engagement ID",
                  }}
                  label={"Engagement ID"}
                  name="engagementID"
                  type={InputType.TEXT}
                  placeholder="Enter Engagement ID "
                  required
                  disabled={getFieldsDisabled}
                />
              </div>
              <div className={OnboardStyleModule.colMd6}>
                <HRInputField
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "please enter the hiring ID",
                  }}
                  label="Hiring ID"
                  name="hiringID"
                  type={InputType.TEXT}
                  placeholder="Enter hiring ID"
                  required
                  disabled={getFieldsDisabled}
                />
              </div>
            </div>

            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd6}>
                <div className={OnboardStyleModule.formGroup}>
                  <HRSelectField
                    // disabled={id !== 0 && true}
                    controlledValue={controlledContractTypeValue}
                    setControlledValue={setControlledContractTypeValue}
                    isControlled={true}
                    mode="id/value"
                    setValue={setValue}
                    register={register}
                    label={"Contract Type"}
                    defaultValue={"Please select"}
                    options={contractType}
                    name="contractType"
                    isError={errors["contractType"] && errors["contractType"]}
                    required
                    errorMsg={"Please select contract type"}
                    disabled={getFieldsDisabled}
                  />
                </div>
              </div>
              <div className={OnboardStyleModule.colMd6}>
                <div className={OnboardStyleModule.formGroup}>
                  <HRSelectField
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider style={{ margin: "8px 0" }} />
                        <Space style={{ padding: "0 8px 4px" }}>
                          <label>Other:</label>
                          <input
                            type={InputType.NUMBER}
                            className={OnboardStyleModule.addSalesItem}
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
                            onClick={addItem}
                          >
                            Add item
                          </Button>
                        </Space>
                        <br />
                      </>
                    )}
                    options={contractDurations.map((item) => ({
                      id: item.id,
                      label: item.text,
                      value: item.value,
                    }))}
                    controlledValue={controlledContractDurationValue}
                    setControlledValue={setControlledContractDurationValue}
                    isControlled={true}
                    mode={"id/value"}
                    setValue={setValue}
                    register={register}
                    label={"Contract Duration (in months)"}
                    defaultValue="Ex: 3,6,12..."
                    inputRef={inputRef}
                    addItem={addItem}
                    onNameChange={onNameChange}
                    name="contractDuration"
                    isError={
                      errors["contractDuration"] && errors["contractDuration"]
                    }
                    required
                    errorMsg={"Please select hiring request conrtact duration"}
                    disabled={getFieldsDisabled}
                  />
                </div>
              </div>
            </div>
            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd6}>
                <div className={OnboardStyleModule.timeSlotItemField}>
                  <div className={OnboardStyleModule.timeSlotLabel}>
                    Contract Start Date <span>*</span>
                  </div>
                  <div className={OnboardStyleModule.timeSlotItem}>
                    <CalenderSVG />
                    <Controller
                      render={({ ...props }) => (
                        <DatePicker
                          selected={watch("contractStartDate")}
                          onChange={(date) => {
                            setValue("contractStartDate", date);
                          }}
                          placeholderText="Contract Start Date"
                        />
                      )}
                      name="contractStartDate"
                      rules={{ required: true }}
                      control={control}
                    />
                    {errors.contractStartDate && (
                      <div className={OnboardStyleModule.error}>
                        Please select contract start date
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={OnboardStyleModule.colMd6}>
                <div className={OnboardStyleModule.timeSlotItemField}>
                  <div className={OnboardStyleModule.timeSlotLabel}>
                    Contract End Date <span>*</span>
                  </div>
                  <div className={OnboardStyleModule.timeSlotItem}>
                    <CalenderSVG />
                    <Controller
                      render={({ ...props }) => (
                        <DatePicker
                          selected={watch("contractEndDate")}
                          onChange={(date) => {
                            setValue("contractEndDate", date);
                          }}
                          placeholderText="Contract End Date"
                        />
                      )}
                      name="contractEndDate"
                      rules={{ required: true }}
                      control={control}
                    />
                    {errors.contractEndDate && (
                      <div className={OnboardStyleModule.error}>
                        Please select contract End date
                      </div>
                    )}
                    {endDateError && (
                      <div className={OnboardStyleModule.error}>
                        End date must be greater than start date
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd12}>
                <div className={OnboardStyleModule.formGroup}>
                  <HRSelectField
                    controlledValue={controlledTimeZoneValue}
                    setControlledValue={setControlledTimeZoneValue}
                    isControlled={true}
                    mode="id/value"
                    setValue={setValue}
                    register={register}
                    label={"Talent Time Zone"}
                    defaultValue={"Select Time Zone"}
                    options={talentTimeZone}
                    name="timeZone"
                    isError={errors["timeZone"] && errors["timeZone"]}
                    required
                    errorMsg={"Please select the timezone"}
                    disabled={getFieldsDisabled}
                  />
                </div>
              </div>
            </div>
            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd6}>
                <div className={OnboardStyleModule.timeSlotItemField}>
                  <div className={OnboardStyleModule.timeSlotLabel}>
                    Shift Start Time <span>*</span>
                  </div>
                  <div className={OnboardStyleModule.timeSlotItem}>
                    <ClockIconSVG />
                    <Controller
                      render={({ ...props }) => (
                        <DatePicker
                          selected={watch("shiftStartTime")}
                          onChange={(date) => {
                            setValue("shiftStartTime", date);
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={60}
                          timeCaption="Time"
                          timeFormat="h:mm a"
                          dateFormat="h:mm a"
                          placeholderText="Start Time"
                        />
                      )}
                      name="shiftStartTime"
                      rules={{ required: true }}
                      control={control}
                    />
                    {errors.shiftStartTime && (
                      <div className={OnboardStyleModule.error}>
                        Please enter start time
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={OnboardStyleModule.colMd6}>
                <div className={OnboardStyleModule.timeSlotItemField}>
                  <div className={OnboardStyleModule.timeSlotLabel}>
                    Shift End Time <span>*</span>
                  </div>
                  <div className={OnboardStyleModule.timeSlotItem}>
                    <ClockIconSVG />
                    <Controller
                      render={({ ...props }) => (
                        <DatePicker
                          selected={watch("shiftEndTime")}
                          onChange={(date) => {
                            setValue("shiftEndTime", date);
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={60}
                          timeCaption="Time"
                          timeFormat="h:mm a"
                          dateFormat="h:mm a"
                          placeholderText="End Time"
                        />
                      )}
                      name="shiftEndTime"
                      rules={{ required: true }}
                      control={control}
                    />
                    {errors.shiftEndTime && (
                      <div className={OnboardStyleModule.error}>
                        Please enter end time
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd6}>
                <div className={OnboardStyleModule.timeSlotItemField}>
                  <div className={OnboardStyleModule.timeSlotLabel}>
                    Talent Onboarding Date <span>*</span>
                  </div>
                  <div className={OnboardStyleModule.timeSlotItem}>
                    <CalenderSVG />
                    <Controller
                      render={({ ...props }) => (
                        <DatePicker
                          selected={watch("talentOnboardingDate")}
                          onChange={(date) => {
                            setValue("talentOnboardingDate", date);
                          }}
                          placeholderText="Talent Onboard Date"
                        />
                      )}
                      name="talentOnboardingDate"
                      rules={{ required: true }}
                      control={control}
                    />
                    {errors.contractEndDate && (
                      <div className={OnboardStyleModule.error}>
                        Please select talent onboard date
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={OnboardStyleModule.colMd6}>
                <div className={OnboardStyleModule.timeSlotItemField}>
                  <div className={OnboardStyleModule.timeSlotLabel}>
                    Talent Onboarding Time <span>*</span>
                  </div>
                  <div className={OnboardStyleModule.timeSlotItem}>
                    <ClockIconSVG />
                    <Controller
                      render={({ ...props }) => (
                        <DatePicker
                          selected={watch("talentOnboardingTime")}
                          onChange={(date) => {
                            setValue("talentOnboardingTime", date);
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={60}
                          timeCaption="Time"
                          timeFormat="h:mm a"
                          dateFormat="h:mm a"
                          placeholderText="Talent Onboarding Time"
                        />
                      )}
                      name="talentOnboardingTime"
                      rules={{ required: true }}
                      control={control}
                    />
                    {errors.talentOnboardingTime && (
                      <div className={OnboardStyleModule.error}>
                        Please enter talent onboarding time
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd6}>
                <div
                  className={`${OnboardStyleModule.formGroup} ${OnboardStyleModule.phoneNoGroup}`}
                >
                  <label>Bill Rate *</label>
                  <div className={OnboardStyleModule.phoneNoCode}>
                    <HRSelectField
                      setValue={setValue}
                      register={register}
                      name="companyCountryCode"
                      defaultValue="USD"
                      options={[]}
                      disabled={getFieldsDisabled}
                    />
                  </div>
                  <div className={OnboardStyleModule.phoneNoInput}>
                    <HRInputField
                      register={register}
                      name={"phoneNumber"}
                      type={InputType.NUMBER}
                      placeholder="Enter Bill Rate"
                      disabled={getFieldsDisabled}
                    />
                  </div>
                </div>
              </div>
              <div className={OnboardStyleModule.colMd6}>
                <div className={OnboardStyleModule.timeSlotItemField}>
                  <div className={OnboardStyleModule.timeSlotLabel}>
                    Client’s First Billing Date <span>*</span>
                  </div>
                  <div className={OnboardStyleModule.timeSlotItem}>
                    <CalenderSVG />
                    <Controller
                      render={({ ...props }) => (
                        <DatePicker
                          selected={watch("clientFirstBillingDate")}
                          onChange={(date) => {
                            setValue("clientFirstBillingDate", date);
                          }}
                          placeholderText="Client First Billing Date"
                        />
                      )}
                      name="clientFirstBillingDate"
                      rules={{ required: true }}
                      control={control}
                    />
                    {errors.contractEndDate && (
                      <div className={OnboardStyleModule.error}>
                        Please enter billing date
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd6}>
                <div className={OnboardStyleModule.formGroup}>
                  <HRSelectField
                    // disabled={id !== 0 && true}
                    mode="id/value"
                    setValue={setValue}
                    register={register}
                    label={"Net Payment Days"}
                    defaultValue={"Enter Number of Days"}
                    options={netPaymentDays}
                    name="netPaymentDays"
                    isError={
                      errors["netPaymentDays"] && errors["netPaymentDays"]
                    }
                    required
                    errorMsg={"Please select net payment days"}
                  />
                </div>
              </div>
              <div className={OnboardStyleModule.colMd6}>
                <HRInputField
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Please enter contact renewal %",
                  }}
                  label={"Contract Renewal % "}
                  name="contractRenewal"
                  type={InputType.NUMBER}
                  placeholder="Enter % Amount  "
                  required
                />
                <p
                  style={{
                    color: "#7B61FF",
                    fontSize: "12px",
                    marginTop: "-20px",
                  }}
                >
                  This is an auto-renew contract to start with easy exit
                  clauses. Increase after an year
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
        <Divider className={OnboardStyleModule.midDivider} />

        <TeamMembers
          setAddTeamMemberModal={setAddTeamMemberModal}
          setEditMode={setEditMode}
          teamMembers={teamMembers}
          onEditHandler={onEditHandler}
          onRemoveHandler={onRemoveHandler}
        />

        <Divider className={OnboardStyleModule.midDivider} />
        <div className={OnboardStyleModule.partOne}>
          <div className={OnboardStyleModule.hrFieldLeftPane}>
            <h3>Device Policies</h3>
          </div>
          <div className={OnboardStyleModule.hrFieldRightPane}>
            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd12}>
                <div className={OnboardStyleModule.radioFormGroup}>
                  <Radio.Group
                    className={OnboardStyleModule.radioGroup}
                    onChange={onChange}
                    value={value}
                  >
                    <Radio value={1}>
                      Does the client have experience hiring remotely?
                    </Radio>
                    <Radio value={2}>
                      Client to buy a device and Uplers to Facilitate.
                    </Radio>
                    <Radio value={3}>
                      Client can use remote desktop sercurity option facilitated
                      by Uplers (At additional cost of $100 per month).
                    </Radio>
                    <Radio value={4}>Add This Later.</Radio>
                  </Radio.Group>
                </div>
                {showTextBox && (
                  <HRInputField
                    isTextArea={true}
                    register={register}
                    errors={errors}
                    name="specialFeedback"
                    type={InputType.TEXT}
                    placeholder="Specify standard specifications, if any..."
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <Divider className={OnboardStyleModule.midDivider} />
        <div className={OnboardStyleModule.partOne}>
          <div className={OnboardStyleModule.hrFieldLeftPane}>
            <h3>Expectation from Talent</h3>
            <p>Please provide the necessary details</p>
          </div>
          <div className={OnboardStyleModule.hrFieldRightPane}>
            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd12}>
                <HRInputField
                  isTextArea={true}
                  register={register}
                  errors={errors}
                  label="First Week"
                  name="firstWeek"
                  type={InputType.TEXT}
                  placeholder="Please specify the expectations"
                />
              </div>
            </div>
            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd12}>
                <HRInputField
                  isTextArea={true}
                  register={register}
                  errors={errors}
                  label="First Month"
                  name="firstMonth"
                  type={InputType.TEXT}
                  placeholder="Please specify the expectations"
                />
              </div>
            </div>
            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd12}>
                <HRInputField
                  isTextArea={true}
                  register={register}
                  errors={errors}
                  label="Additional Information"
                  name="additionalInformation"
                  type={InputType.TEXT}
                  placeholder="Please Enter"
                />
              </div>
            </div>
          </div>
        </div>
        <Divider className={OnboardStyleModule.midDivider} />
        <div className={OnboardStyleModule.partOne}>
          <div className={OnboardStyleModule.hrFieldLeftPane}></div>
          <div className={OnboardStyleModule.hrFieldRightPane}>
            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd6}>
                <HRInputField
                  required
                  errors={errors}
                  validationSchema={{
                    required: "Please enter leave policies.",
                  }}
                  label={"Leave Policies"}
                  register={register}
                  name="leavePolicies"
                  type={InputType.TEXT}
                  placeholder="Specify standard specifications, if any..."
                />
              </div>
              <div className={OnboardStyleModule.colMd6}>
                <HRInputField
                  required
                  trailingIcon={<EditSVG />}
                  label="Exit Policy"
                  register={register}
                  validationSchema={{
                    required: "Please enter exit policies.",
                  }}
                  errors={errors}
                  name="exitPolicies"
                  type={InputType.TEXT}
                  placeholder="Specify standard specifications, if any..."
                />
              </div>
            </div>
            <div className={OnboardStyleModule.row}>
              <div className={OnboardStyleModule.colMd12}>
                <HRInputField
                  trailingIcon={<EditSVG />}
                  required
                  label={"Feedback Process "}
                  register={register}
                  validationSchema={{
                    required: "Please enter feedback process.",
                  }}
                  errors={errors}
                  name="specialFeedback"
                  type={InputType.TEXT}
                  placeholder="Specify standard specifications, if any..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider className={OnboardStyleModule.midDivider} />

      <div className={OnboardStyleModule.partOne}>
        <div className={OnboardStyleModule.hrFieldLeftPane}></div>
        <div className={OnboardStyleModule.hrFieldRightPane}>
          <div className={OnboardStyleModule.formPanelAction}>
            <button
              className={OnboardStyleModule.btnPrimary}
              onClick={handleSubmit(onboardSubmitHandler)}
            >
              Submit
            </button>

            {/* <button
              onClick={onboardSubmitHandler}
              className={OnboardStyleModule.btn}
            >
              Save as Draft
            </button> */}
          </div>
        </div>
      </div>
      <AddTeamMemberModal
        membersIndex={indexOfMember}
        editMode={isEditMode}
        teamMemberList={teamMembers}
        setTeamMembers={setTeamMembers}
        isFooter={false}
        openModal={addTeamMembersModal}
        cancelModal={() => setAddTeamMemberModal(false)}
        modalTitle={"Add Team Members"}
      />
      <LogoLoader visible={isSavedLoading} />
    </div>
  );
};

export default OnboardField;
