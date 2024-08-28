import {
  Button,
  Checkbox,
  Divider,
  Space,
  message,
  AutoComplete,
  Modal,
  Skeleton,
  Radio,
  Tooltip,
  Select,
  Avatar,
} from "antd";
import {
  ClientHRURL,
  GoogleDriveCredentials,
  InputType,
  SubmitType,
  WorkingMode,
} from "constants/application";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HRInputField from "../hrInputFields/hrInputFields";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import HRFieldStyle from "./editHRFields.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { ReactComponent as UploadSVG } from "assets/svg/upload.svg";
import UploadModal from "shared/components/uploadModal/uploadModal";
import HRSelectField from "../hrSelectField/hrSelectField";
import { useForm, Controller } from "react-hook-form";
import { HTTPStatusCode } from "constants/network";
import { _isNull, getPayload } from "shared/utils/basic_utils";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { useLocation, useNavigate } from "react-router-dom";
import { hrUtils } from "modules/hiring request/hrUtils";
import { MasterDAO } from "core/master/masterDAO";
import useDrivePicker from "react-google-drive-picker/dist";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { UserAccountRole } from "constants/application";
import useDebounce from "shared/hooks/useDebounce";
import LogoLoader from "shared/components/loader/logoLoader";
import { NetworkInfo } from "constants/network";
import { HttpStatusCode } from "axios";
import infoIcon from "assets/svg/info.svg";
import plusSkill from "assets/svg/plusSkill.svg";
import DOMPurify from "dompurify";
import PreviewClientModal from "modules/client/components/previewClientDetails/previewClientModal";
import ReactQuill from "react-quill";
import { isEmptyOrWhitespace } from "modules/hiring request/screens/allHiringRequest/previewHR/services/commonUsedVar";
import infoSmallIcon from "assets/svg/infoSmallIcon.svg";
import MailIcon from "assets/svg/mailIcon.svg";
import PhoneIcon from "assets/svg/phoneIcon.svg";
import DeleteCircleIcon from "assets/svg/deleteCircleIcon.svg";
import EditCircleIcon from "assets/svg/editCircleIcon.svg";
import debounce from "lodash.debounce";

export const secondaryInterviewer = {
  fullName: "",
  emailID: "",
  linkedin: "",
  designation: "",
};

const EditHRFields = ({
  setJDDumpID,
  jdDumpID,
  setTitle,
  clientDetail,
  setEnID,
  tabFieldDisabled,
  setTabFieldDisabled,
  setJDParsedSkills,
  getHRdetails,
  setHRdetails,
  setFromEditDeBriefing,
  fromEditDeBriefing,
  removeFields,
  disabledFields,
  setDisabledFields,
  isBDRMDRUser,
  isDirectHR,
  originalDetails,
  setOriginalDetails,
}) => {
  const inputRef = useRef(null);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getUserResult = async () => {
      let userData = UserSessionManagementController.getUserSession();
      if (userData) setUserData(userData);
    };
    getUserResult();
  }, []);

  const [getUploadFileData, setUploadFileData] = useState("");
  const [availability, setAvailability] = useState([]);
  const [JobTypes, setJobTypes] = useState([]);
  const [payRollTypes, setPayRollTypes] = useState([]);
  const [hrPricingTypes, setHRPricingTypes] = useState([]);
  const [timeZonePref, setTimeZonePref] = useState([]);
  const [workingMode, setWorkingMode] = useState([]);
  const [talentRole, setTalentRole] = useState([]);
  const [country, setCountry] = useState([]);
  const [salesPerson, setSalesPerson] = useState([]);
  const [howSoon, setHowSoon] = useState([]);
  // const [region, setRegion] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contractDurations, setcontractDurations] = useState([]);
  const [partialEngagements, setPartialEngagements] = useState([]);
  const [name, setName] = useState("");
  const [jdURLLink, setJDURLLink] = useState("");
  const [prevJDURLLink, setPrevJDURLLink] = useState("");
  const [pathName, setPathName] = useState("");
  const [showUploadModal, setUploadModal] = useState(false);
  const [isCompanyNameAvailable, setIsCompanyNameAvailable] = useState(false);
  const [addHRResponse, setAddHRResponse] = useState("");
  const [type, setType] = useState("");
  const [isHRDirectPlacement, setHRDirectPlacement] = useState(false);
  const [getClientNameMessage, setClientNameMessage] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [currency, setCurrency] = useState([]);
  const [isFreshersAllowed, setIsFreshersAllowed] = useState(false);
  const [isExpDisabled, setIsExpDisabled] = useState(false);
  const [isFresherDisabled, setIsFresherDisabled] = useState(false);

  const [locationList, setLocationList] = useState([]);
  const [frequencyData, setFrequencyData] = useState([]);
  const [nearByCitiesData, setNearByCitiesData] = useState([]);
  const [isRelocate, setIsRelocate] = useState(false);
  const [NearByCitesValues, setNearByCitesValues] = useState([]);
  const [controlledFrequencyValue, setControlledFrequencyValue] =
    useState("Select");

  const [getValidation, setValidation] = useState({
    systemFileUpload: "",
    googleDriveFileUpload: "",
    linkValidation: "",
  });
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const [getGoogleDriveLink, setGoogleDriveLink] = useState("");
  const [getClientNameSuggestion, setClientNameSuggestion] = useState([]);
  const [companyType, setComapnyType] = useState({});

  const [controlledRoleValue, setControlledRoleValue] = useState("Select Role");
  const [controlledBudgetValue, setControlledBudgetValue] =
    useState("Select Budget");
  const [controlledCurrencyValue, setControlledCurrencyValue] =
    useState("Select Currency");
  const [controlledSalesValue, setControlledSalesValue] = useState(
    "Select sales Person"
  );
  const [controlledAvailabilityValue, setControlledAvailabilityValue] =
    useState("Select availability");
  const [
    controlledHiringPricingTypeValue,
    setControlledHiringPricingTypeValue,
  ] = useState("Select Hiring Pricing");
  const [controlledWorkingValue, setControlledWorkingValue] = useState(
    "Select working mode"
  );
  // const [controlledRegionValue, setControlledRegionValue] =
  //   useState("Select Region");
  const [controlledTimeZoneValue, setControlledTimeZoneValue] =
    useState("Select time zone");
  const [controlledSoonValue, setControlledTimeSoonValue] =
    useState("Select how soon?");
  const [controlledCountryValue, setControlledCountryValue] =
    useState("Select country");
  const [countryListMessage, setCountryListMessage] = useState(null);
  const [contractDurationValue, setContractDuration] = useState("");

  const [controlledDurationTypeValue, setControlledDurationTypeValue] =
    useState("Select Term");
  const [controlledFromTimeValue, setControlledFromTimeValue] =
    useState("Select From Time");
  const [controlledEndTimeValue, setControlledEndTimeValue] =
    useState("Select End Time");
  const [controlledTempProjectValue, setControlledTempProjectValue] =
    useState("Please select .");
  const [controlledPayrollTypeValue, setControlledPayrollTypeValue] =
    useState("Select payroll");
  const [
    controlledPartialEngagementValue,
    setControlledPartialEngagementValue,
  ] = useState("Select Partial Engagement Type");
  const [isNewPostalCodeModal, setNewPostalCodeModal] = useState(false);
  const [isPostalCodeNotFound, setPostalCodeNotFound] = useState(false);

  const [getDurationType, setDurationType] = useState([]);
  const [getStartEndTimes, setStaryEndTimes] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const [showGPTModal, setShowGPTModal] = useState(false);
  const [gptDetails, setGPTDetails] = useState({});
  const [gptFileDetails, setGPTFileDetails] = useState({});
  const [typeOfPricing, setTypeOfPricing] = useState(null);
  const [transactionMessage, setTransactionMessage] = useState("");
  const [pricingTypeError, setPricingTypeError] = useState(false);
  const [isBudgetConfidential, setIsBudgetConfidentil] = useState(false);
  const [isVettedProfile, setIsVettedProfile] = useState(true);
  const [isProfileView, setIsProfileView] = useState(false);
  const [isPostaJob, setIsPostaJob] = useState(false);
  const [creditBaseCheckBoxError, setCreditBaseCheckBoxError] = useState(false);
  const [isPreviewModal, setIsPreviewModal] = useState(false);
  const [getcompanyID, setcompanyID] = useState("");
  const [tempProjects, setTempProject] = useState([
    {
      disabled: false,
      group: null,
      selected: false,
      text: `Temporary`,
      value: true,
    },
    {
      disabled: false,
      group: null,
      selected: false,
      text: `Permanent`,
      value: false,
    },
  ]);

  const [timeZoneList, setTimezoneList] = useState([]);
  const [clientDetails, setClientDetails] = useState({});

  // const isGUID = getHRdetails?.addHiringRequest?.guid
  const [showHRPOCDetailsToTalents, setshowHRPOCDetailsToTalents] =
    useState(null);
  const [activeUserData, setActiveUserData] = useState([]);
  const [activeUserDataList, setActiveUserDataList] = useState([]);
  const [jobPostUsersDetails, setJobPostUsersDetails] = useState([]);
  const [controlledPocValue, setControlledPocValue] = useState([]);
  const [locationSelectValidation,setLocationSelectValidation] = useState(false);

  let controllerRef = useRef(null);
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    setError,
    unregister,
    resetField,
    control,
    clearErrors,
    // defaultValue,
    formState: { errors, defaultValue },
  } = useForm({
    defaultValues: {
      secondaryInterviewer: [],
      autocompleteField: "abc",
    },
  });

  const isGUID =
    watch("hiringPricingType")?.id === 3 ||
    watch("hiringPricingType")?.id === 6 ||
    companyType.id === 2
      ? "DPHR"
      : ""; // for check if DP is selected

  const compensationOptions = [
    { value: "Performance Bonuses", label: "Performance Bonuses" },
    {
      value: "Stock Options (ESOPs/ESPPs)",
      label: "Stock Options (ESOPs/ESPPs)",
    },
    { value: "Incentives / Variable Pay", label: "Incentives / Variable Pay" },
    { value: "Profit Sharing", label: "Profit Sharing" },
    { value: "Signing Bonus", label: "Signing Bonus" },
    { value: "Retention Bonus", label: "Retention Bonus" },
    { value: "Overtime Pay", label: "Overtime Pay" },
    {
      value: "Allowances (e.g. Travel, Housing, Medical, Education, WFH)",
      label: "Allowances (e.g. Travel, Housing, Medical, Education, WFH)",
    },
    {
      value: "Restricted Stock Units (RSUs)",
      label: "Restricted Stock Units (RSUs)",
    },
  ];

  const industryOptions = [
    { value: "Service", label: "Service" },
    { value: "Product", label: "Product" },
    { value: "Manufacturing", label: "Manufacturing" },
  ];

  const [peopleManagemantexp, setHasPeopleManagementExp] = useState(null);
  const [CompensationValues, setCompensationValues] = useState([]);
  const [specificIndustry, setSpecificIndustry] = useState([]);

  //CLONE HR functionality
  const getHRdetailsHandler = async (hrId) => {
    const response = await hiringRequestDAO.getHRDetailsRequestDAO(hrId);
    if (response.statusCode === HTTPStatusCode.OK) {
      setHRdetails(response?.responseBody?.details);
      setOriginalDetails(response?.responseBody?.details);
      if (!response?.responseBody?.details?.addHiringRequest?.isActive) {
        setTabFieldDisabled({ ...tabFieldDisabled, debriefingHR: true });
      } else {
        setTabFieldDisabled({ ...tabFieldDisabled, debriefingHR: false });
      }
    }
  };

  const watchClientName = watch("clientName");

  let filteredMemo = useMemo(() => {
    let filteredData = getClientNameSuggestion?.filter(
      (item) => item?.value === watchClientName
    );
    return filteredData;
  }, [getClientNameSuggestion, watchClientName]);

  const getPOCUsers = async (companyID) => {
    let response = await MasterDAO.getEmailSuggestionDAO("", companyID);

    setActiveUserData([
      ...response?.responseBody?.details?.map((item) => ({
        value: item?.contactName,
        id: item?.contactId,
      })),
    ]);
    setActiveUserDataList(response?.responseBody?.details);
  };

  /* ------------------ Upload JD Starts Here ---------------------- */
  const [openPicker, authResponse] = useDrivePicker();
  const uploadFile = useRef(null);
  const uploadFileFromGoogleDriveValidator = useCallback(
    async (fileData) => {
      setValidation({
        ...getValidation,
        googleDriveFileUpload: "",
      });
      if (
        fileData[0]?.mimeType !== "application/vnd.google-apps.document" &&
        fileData[0]?.mimeType !== "application/pdf" &&
        fileData[0]?.mimeType !== "text/plain" &&
        fileData[0]?.mimeType !== "application/docs" &&
        fileData[0]?.mimeType !== "application/msword" &&
        fileData[0]?.mimeType !== "image/png" &&
        fileData[0]?.mimeType !== "image/jpeg" &&
        fileData[0]?.mimeType !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setValidation({
          ...getValidation,
          googleDriveFileUpload:
            "Uploaded file is not a valid, Only pdf, docs, jpg, jpeg, png, text and rtf files are allowed",
        });
      } else if (fileData[0]?.sizeBytes >= 500000) {
        setValidation({
          ...getValidation,
          googleDriveFileUpload:
            "Upload file size more than 500kb, Please Upload file upto 500kb",
        });
      } else {
        let fileType;
        let fileName;
        if (fileData[0]?.mimeType === "application/vnd.google-apps.document") {
          fileType = "docs";
          fileName = `${fileData[0]?.name}.${fileType}`;
        } else {
          fileName = `${fileData[0]?.name}`;
        }
        const formData = {
          fileID: fileData[0]?.id,
          FileName: fileName,
        };
        let uploadFileResponse =
          await hiringRequestDAO.uploadGoogleDriveFileDAO(formData);

        if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
          setUploadModal(false);
          setUploadFileData(fileName);
          setJDDumpID(uploadFileResponse?.responseBody?.details?.JDDumpID);
          message.success("File uploaded successfully");
        }
      }
    },
    [getValidation]
  );
  const uploadFileHandler = useCallback(
    async (fileData) => {
      setIsLoading(true);
      if (
        fileData?.type !== "application/pdf" &&
        fileData?.type !== "application/docs" &&
        fileData?.type !== "application/msword" &&
        fileData?.type !== "text/plain" &&
        fileData?.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        fileData?.type !== "image/png" &&
        fileData?.type !== "image/jpeg"
      ) {
        setValidation({
          ...getValidation,
          systemFileUpload:
            "Uploaded file is not a valid, Only pdf, docs, jpg, jpeg, png, text and rtf files are allowed",
        });
        setIsLoading(false);
      } else if (fileData?.size >= 500000) {
        setValidation({
          ...getValidation,
          systemFileUpload:
            "Upload file size more than 500kb, Please Upload file upto 500kb",
        });
        setIsLoading(false);
      } else {
        let formData = new FormData();
        formData.append("File", fileData);
        formData.append("clientemail", getHRdetails?.contact);
        let uploadFileResponse = await hiringRequestDAO.uploadFileDAO(formData);
        if (uploadFileResponse.statusCode === 400) {
          setValidation({
            ...getValidation,
            systemFileUpload: uploadFileResponse?.responseBody,
          });
        }
        if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
          if (
            fileData?.type === "image/png" ||
            fileData?.type === "image/jpeg"
          ) {
            setUploadFileData(fileData?.name);
            setUploadModal(false);
            setValidation({
              ...getValidation,
              systemFileUpload: "",
            });
            message.success("File uploaded successfully");
          } else if (
            fileData?.type === "application/pdf" ||
            fileData?.type === "application/docs" ||
            fileData?.type === "application/msword" ||
            fileData?.type === "text/plain" ||
            fileData?.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            setUploadFileData(fileData?.name);
            // setJDParsedSkills(
            //   uploadFileResponse && uploadFileResponse?.responseBody?.details
            // );

            // setJDDumpID(
            // 	uploadFileResponse &&
            // 		uploadFileResponse?.responseBody?.details?.JDDumpID,
            // );
            setUploadModal(false);
            setValidation({
              ...getValidation,
              systemFileUpload: "",
            });
            setShowGPTModal(true);
            setGPTFileDetails(
              uploadFileResponse && uploadFileResponse?.responseBody?.details
            );
            message.success("File uploaded successfully");
          }
        }
        setIsLoading(false);
      }
      uploadFile.current.value = "";
    },
    [getValidation, setJDDumpID, setJDParsedSkills, getHRdetails?.contact]
  );

  const googleDriveFileUploader = useCallback(() => {
    openPicker({
      clientId: GoogleDriveCredentials.clientID,
      developerKey: GoogleDriveCredentials.developerKey,
      viewId: "DOCS",
      // token: token, // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data?.action === "cancel") {
        } else {
          if (data?.docs) {
            let uploadFileResponse = uploadFileFromGoogleDriveValidator(
              data?.docs
            );
            setUploadFileData(uploadFileResponse?.responseBody?.FileName);
            setJDParsedSkills(
              uploadFileResponse && uploadFileResponse?.responseBody?.details
            );
            setUploadModal(false);
          }
        }
      },
    });
  }, [openPicker, setJDParsedSkills, uploadFileFromGoogleDriveValidator]);

  const uploadFileFromGoogleDriveLink = useCallback(async () => {
    setValidation({
      ...getValidation,
      linkValidation: "",
    });
    if (!getGoogleDriveLink) {
      setValidation({
        ...getValidation,
        linkValidation: "Please Enter Google Docs/Drive URL",
      });
    } else if (
      !/https:\/\/docs\.google\.com\/document\/d\/(.*?)\/.*?/g.test(
        getGoogleDriveLink
      ) &&
      !/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?/g.test(
        getGoogleDriveLink
      )
    ) {
      setValidation({
        ...getValidation,
        linkValidation: "Please Enter Google Docs/Drive URL",
      });
    } /* else if (
			!/https:\/\/docs\.google\.com\/document\/d\/(.*?)\/.*?/g.test(
				getGoogleDriveLink,
			)
		) {
			setValidation({
				...getValidation,
				linkValidation: 'Please Enter Google Docs/Drive URL',
			});
		}  */ else {
      let uploadFileResponse =
        await hiringRequestDAO.uploadFileFromGoogleDriveLinkDAO(
          getGoogleDriveLink
        );
      if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
        setUploadModal(false);
        setGoogleDriveLink("");
        message.success("File uploaded successfully");
      }
    }
  }, [
    getGoogleDriveLink,
    getValidation,
    setGoogleDriveLink,
    setUploadModal,
    setValidation,
  ]);

  /* ------------------ Upload JD Ends Here -------------------- */
  // let prefRegion = watch("region");
  let modeOfWork = watch("workingMode");
  let hrRole = watch("role");
  let watchOtherRole = watch("otherRole");

  const getNRMarginHandler = useCallback(async () => {
    const response = await MasterDAO.getNRMarginRequestDAO();
    if (response?.statusCode === HTTPStatusCode.OK) {
      setValue("NRMargin", response && response?.responseBody?.details?.value);
    }
  }, [setValue]);
  // const getTimeZonePreference = useCallback(async () => {
  //   const timeZone = await MasterDAO.getTimeZonePreferenceRequestDAO(
  //     prefRegion && prefRegion?.id
  //   );
  //   if (timeZone.statusCode === HTTPStatusCode.OK) {
  //     setTimeZonePref(timeZone && timeZone.responseBody);
  //   }
  // }, [prefRegion]);
  const getAvailability = useCallback(async () => {
    const availabilityResponse = await MasterDAO.getFixedValueRequestDAO();
    const JobTypesResponse = await MasterDAO.getJobTypesRequestDAO();
    setAvailability(
      availabilityResponse &&
        availabilityResponse.responseBody?.BindHiringAvailability.reverse()
    );

    setJobTypes(JobTypesResponse && JobTypesResponse?.responseBody);
  }, []);

  const getPayrollType = useCallback(async () => {
    const payRollsResponse = await MasterDAO.getPayRollTypeDAO();
    setPayRollTypes(payRollsResponse && payRollsResponse.responseBody);
  }, []);
  const getHRPricingType = useCallback(async () => {
    const HRPricingResponse = await MasterDAO.getHRPricingTypeDAO();
    setHRPricingTypes(HRPricingResponse && HRPricingResponse.responseBody);
  }, []);

  const getRequiredHRPricingType = useCallback(() => {
    let reqOpt = [];

    if (watch("availability")?.value === "Full Time") {
      if (typeOfPricing === 1) {
        let Filter = hrPricingTypes.filter(
          (item) =>
            item.engagementType === "Full Time" && item.isTransparent === true
        );
        if (Filter.length) {
          reqOpt = Filter.map((item) => ({ id: item.id, value: item.type }));
        }
      } else {
        let Filter = hrPricingTypes.filter(
          (item) =>
            item.engagementType === "Full Time" && item.isTransparent === false
        );
        if (Filter.length) {
          reqOpt = Filter.map((item) => ({ id: item.id, value: item.type }));
        }
      }
    }

    if (watch("availability")?.value === "Part Time") {
      if (typeOfPricing === 1) {
        let Filter = hrPricingTypes.filter(
          (item) =>
            item.engagementType === "Part Time" && item.isTransparent === true
        );
        if (Filter.length) {
          reqOpt = Filter.map((item) => ({ id: item.id, value: item.type }));
        }
      } else {
        let Filter = hrPricingTypes.filter(
          (item) =>
            item.engagementType === "Part Time" && item.isTransparent === false
        );
        if (Filter.length) {
          reqOpt = Filter.map((item) => ({ id: item.id, value: item.type }));
        }
      }
    }

    return reqOpt;
  }, [hrPricingTypes, watch("availability"), typeOfPricing]);

  const getHowSoon = useCallback(async () => {
    const howSoonResponse = await MasterDAO.getHowSoonRequestDAO();
    setHowSoon(howSoonResponse && howSoonResponse.responseBody);
  }, []);
  const getWorkingMode = useCallback(async () => {
    const workingModeResponse = await MasterDAO.getModeOfWorkDAO();
    setWorkingMode(
      workingModeResponse && workingModeResponse?.responseBody?.details
    );
  }, []);
  const getCountry = useCallback(async () => {
    const countryResponse = await MasterDAO.getCountryDAO();
    setCountry(countryResponse && countryResponse?.responseBody?.details);
  }, []);
  const getTalentRole = useCallback(async () => {
    const talentRole = await MasterDAO.getTalentsRoleRequestDAO();

    setTalentRole(talentRole && talentRole.responseBody);
    setTalentRole((preValue) => {
      let oldArr = [...preValue];
      return [
        ...oldArr,
        {
          id: -1,
          value: "Others",
        },
      ];
    });
  }, []);
  const getSalesPerson = useCallback(async () => {
    const salesPersonResponse = await MasterDAO.getSalesManRequestDAO();
    setSalesPerson(
      salesPersonResponse && salesPersonResponse?.responseBody?.details
    );
    if (userData.LoggedInUserTypeID === UserAccountRole.SALES) {
      const valueToSet = salesPersonResponse?.responseBody?.details.filter(
        (detail) => detail.value === userData.FullName
      )[0];
      setValue("salesPerson", valueToSet.id);
    }
  }, [userData, setValue]);

  // unregister JDExport
  useEffect(() => {
    if ((!jdURLLink && !getUploadFileData) === false) {
      unregister("jdExport");
      clearErrors("jdExport");
    }
  }, [jdURLLink, getUploadFileData]);

  // const getRegion = useCallback(async () => {
  //   let response = await MasterDAO.getTalentTimeZoneRequestDAO();
  //   setRegion(response && response?.responseBody);
  // }, []);

  const getTimeZoneList = useCallback(async () => {
    let response = await MasterDAO.getTimeZoneRequestDAO();
    setTimezoneList(response && response?.responseBody);
  }, [setTimezoneList]);

  const getDurationTypes = useCallback(async () => {
    const durationTypes = await MasterDAO.getDurationTypeDAO();
    setDurationType(
      durationTypes &&
        durationTypes?.responseBody?.details.filter(
          (item) => item?.value !== "0"
        )
    );
  }, []);

  const getStartEndTimeHandler = useCallback(async () => {
    const durationTypes = await MasterDAO.getStartEndTimeDAO();
    setStaryEndTimes(durationTypes && durationTypes?.responseBody);
  }, []);

  const getLocation = useLocation();

  const onNameChange = (event) => {
    setName(event.target.value);
    if (event.target.value) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  };
  const addItem = useCallback(
    (e) => {
      e.preventDefault();
      if (!contractDurations.includes(name + " months")) {
        let newObj = {
          disabled: false,
          group: null,
          selected: false,
          text: `${name} months`,
          value: `${name}`,
        };
        setcontractDurations([...contractDurations, newObj]);
        setName("");
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    },
    [contractDurations, name]
  );

  const toggleHRDirectPlacement = useCallback((e) => {
    // e.preventDefault();
    setHRDirectPlacement(e.target.checked);
  }, []);

  const getClientNameValue = (clientName, clientData) => {
    setValue("clientName", clientName);
    setClientDetails(clientData);

    setIsVettedProfile(clientData?.isVettedProfile);
    setIsPostaJob(clientData?.isPostaJob);
    setIsProfileView(clientData?.isProfileView);
    setIsVettedProfile(clientData?.isVettedProfile);
    document.activeElement.blur();

    setError("clientName", {
      type: "validate",
      message: "",
    });
  };
  // useEffect(() => {
  //     if(getHRdetails?.fullClientName){
  //         getListData(getHRdetails?.fullClientName);

  //     }
  // }, [getHRdetails])

  const toggleJDHandler = useCallback((e) => {
    setJDURLLink(e.target.value);
    // clearErrors();
  }, []);

  const getListData = async (clientName, shortclientName) => {
    if (shortclientName?.trim().length > 0) {
      let response = await MasterDAO.getEmailSuggestionDAO(shortclientName);
      if (response?.statusCode === HTTPStatusCode.OK) {
        setClientNameSuggestion(response?.responseBody?.details);
        setValue("clientName", clientName);
        setClientNameMessage("");
      } else if (
        response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
        response?.statusCode === HTTPStatusCode.NOT_FOUND
      ) {
        setError("clientName", {
          type: "validate",
          message: response?.responseBody,
        });
        setClientNameMessage(response?.responseBody);
      }
    }
  };
  const getClientNameSuggestionHandler = useCallback(
    async (clientName) => {
      if (clientName.length > 0) {
        let response = await MasterDAO.getEmailSuggestionDAO(clientName);
        if (response?.statusCode === HTTPStatusCode.OK) {
          setClientNameSuggestion(response?.responseBody?.details);
          setClientNameMessage("");
        } else if (
          response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
          response?.statusCode === HTTPStatusCode.NOT_FOUND
        ) {
          setError("clientName", {
            type: "validate",
            message: response?.responseBody,
          });
          // setClientNameSuggestion([]);
          setClientNameMessage(response?.responseBody);
        }
      }
    },
    [setError]
  );

  const validate = (clientName) => {
    if (!clientName) {
      return "please enter the client email/name.";
    } else if (getClientNameMessage !== "" && clientName) {
      return getClientNameMessage;
    }
    return true;
  };

  const getHRClientName = useCallback(async () => {
    let existingClientDetails =
      await hiringRequestDAO.getClientDetailRequestDAO(
        filteredMemo[0]?.emailId ?? getHRdetails?.contact
      );
    setError("clientName", {
      type: "duplicateCompanyName",
      message:
        existingClientDetails?.statusCode === HTTPStatusCode.NOT_FOUND &&
        "Client email does not exist.",
    });
    // existingClientDetails.statusCode === HTTPStatusCode.NOT_FOUND &&
    //     setValue('clientName', '');
    existingClientDetails.statusCode === HTTPStatusCode.NOT_FOUND &&
      setValue("companyName", "");
    existingClientDetails.statusCode === HTTPStatusCode.OK &&
      setValue("companyName", existingClientDetails?.responseBody?.name);
    existingClientDetails.statusCode === HTTPStatusCode.OK &&
      setIsCompanyNameAvailable(true);
    setIsLoading(false);
  }, [filteredMemo, setError, setValue]);

  const getFrequencyData = async () => {
    let response = await MasterDAO.getFrequencyDAO();
    setFrequencyData(
      response?.responseBody?.details?.map((fre) => ({
        id: fre.id,
        value: fre.frequency,
      }))
    );
  };

  const getOtherRoleHandler = useCallback(
    async (data) => {
      let response = await MasterDAO.getOtherRoleRequestDAO({
        roleName: data,
        roleID: 0,
      });
      if (response?.statusCode === HTTPStatusCode?.BAD_REQUEST) {
        return setError("otherRole", {
          type: "otherRole",
          message: response?.responseBody,
        });
      }
    },
    [setError]
  );
  useEffect(() => {
    let timer;
    if (!_isNull(watchOtherRole)) {
      timer = setTimeout(() => {
        setIsLoading(true);
        getOtherRoleHandler(watchOtherRole);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [getOtherRoleHandler, watchOtherRole]);

  useEffect(() => {
    let timer;
    if (!_isNull(watchClientName)) {
      timer =
        pathName === ClientHRURL.ADD_NEW_HR &&
        setTimeout(() => {
          setIsLoading(true);
          getHRClientName();
        }, 2000);
    }
    return () => clearTimeout(timer);
  }, [getHRClientName, watchClientName, pathName]);

  useEffect(() => {
    let urlSplitter = `${getLocation.pathname.split("/")[2]}`;
    setPathName(urlSplitter);
    // pathName === ClientHRURL.ADD_NEW_CLIENT &&
    //     setValue('clientName', clientDetail?.clientemail);
    pathName === ClientHRURL.ADD_NEW_CLIENT &&
      setValue("companyName", clientDetail?.companyname);
  }, [
    getLocation.pathname,
    clientDetail?.clientemail,
    clientDetail?.companyname,
    pathName,
    setValue,
  ]);

  const getCurrencyHandler = useCallback(async () => {
    const response = await MasterDAO.getCurrencyRequestDAO();
    setCurrency(response && response?.responseBody);
  }, []);

  const getBudgetHandler = useCallback(async () => {
    const response = await MasterDAO.getGetBudgetInformationDAO();
    setBudgets(
      response && response?.responseBody.filter((item) => item?.value !== "0")
    );
  }, []);

  const contractDurationHandler = useCallback(async () => {
    let response = await MasterDAO.getContractDurationRequestDAO();
    setcontractDurations(response && response?.responseBody);
  }, []);

  const getPartialEngHandler = useCallback(async () => {
    let response = await MasterDAO.getPartialEngagementTypeRequestDAO();
    setPartialEngagements(response && response?.responseBody);
  }, []);

  useEffect(() => {
    getCurrencyHandler();
    getAvailability();
    getPayrollType();
    getHRPricingType();
    getTalentRole();
    getSalesPerson();
    // getRegion();
    getTimeZoneList();
    getWorkingMode();
    getCountry();
    getHowSoon();
    // getNRMarginHandler();
    getDurationTypes();
    getBudgetHandler();
    contractDurationHandler();
    getStartEndTimeHandler();
    getPartialEngHandler();
    getFrequencyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   !_isNull(prefRegion) && getTimeZonePreference();
  // }, [prefRegion]);

  useEffect(() => {
    setValidation({
      systemFileUpload: "",
      googleDriveFileUpload: "",
      linkValidation: "",
    });
    setGoogleDriveLink("");
  }, [showUploadModal]);

  useEffect(() => {
    isHRDirectPlacement === false && unregister("dpPercentage");
    isHRDirectPlacement === true && unregister("tempProject");
  }, [isHRDirectPlacement, unregister]);

  useEffect(() => {
    if (modeOfWork?.value === "Remote") {
      unregister(["address", "city", "state", "country", "postalCode"]);
    }
  }, [modeOfWork, unregister]);

  useEffect(() => {
    // let precentage = hrPricingTypes.find(item=> item.id === watch('hiringPricingType')?.id)?.pricingPercent
    // setValue('NRMargin',precentage)

    if (
      watch("hiringPricingType")?.id === 1 ||
      watch("hiringPricingType")?.id === 4 ||
      watch("hiringPricingType")?.id === 7 ||
      watch("hiringPricingType")?.id === 8
    ) {
      unregister("payrollType");
    }

    if (
      watch("hiringPricingType")?.id === 3 ||
      watch("hiringPricingType")?.id === 6
    ) {
      unregister("tempProject");
      watch("payrollType")?.id !== 4 && unregister("contractDuration");
      if (watch("payrollType")?.id === 4) {
        register("contractDuration", {
          required: true,
        });
      }
    }

    if (
      watch("hiringPricingType")?.id === 2 ||
      watch("hiringPricingType")?.id === 5
    ) {
      unregister("payrollType");
      unregister("tempProject");
      watch("hiringPricingType")?.id !== 2 && unregister("contractDuration");
    }

    // re register full time
    if (
      watch("hiringPricingType")?.id === 1 ||
      watch("hiringPricingType")?.id === 2 ||
      watch("hiringPricingType")?.id === 4 ||
      watch("hiringPricingType")?.id === 5 ||
      watch("hiringPricingType")?.id === 7 ||
      watch("hiringPricingType")?.id === 8
    ) {
      register("contractDuration", {
        required: true,
      });
    }
  }, [watch("hiringPricingType"), hrPricingTypes]);

  useEffect(() => {
    if (watch("budget")?.value === "2") {
      setValue("adhocBudgetCost", "");
      unregister("adhocBudgetCost");
    }
    if (watch("budget")?.value === "1") {
      setValue("maximumBudget", "");
      setValue("minimumBudget", "");
      unregister("maximumBudget");
      unregister("minimumBudget");
    }
    if (watch("budget")?.value === "3") {
      unregister("maximumBudget");
      unregister("minimumBudget");
      unregister("adhocBudgetCost");
      setValue("maximumBudget", "");
      setValue("minimumBudget", "");
      setValue("adhocBudgetCost", "");
    }
  }, [watch("budget"), unregister]);

  // useEffect(() => {
  //   if (watch("region")?.value.includes("Overlapping")) {
  //     unregister(["fromTime", "endTime"]);
  //     setValue("fromTime", "");
  //     setValue("endTime", "");
  //     setControlledFromTimeValue("Select From Time");
  //     setControlledEndTimeValue("Select End Time");
  //   } else {
  //     unregister("overlappingHours");
  //     setValue("overlappingHours", "");
  //   }
  // }, [watch("region"), unregister]);

  useEffect(() => {
    if (watch("availability")?.value === "Full Time") {
      unregister("partialEngagement");
    }
  }, [watch("availability"), unregister]);

  useEffect(() => {
    hrRole !== "others" && unregister("otherRole");
  }, [hrRole, unregister]);
  /** To check Duplicate email exists End */

  const watchPostalCode = watch("postalCode");

  const postalCodeHandler = useCallback(
    async (flag) => {
      const countryResponse = await MasterDAO.getCountryByPostalCodeRequestDAO({
        ...getPayload(flag, {
          countryCode: watch("country")?.id || "",
          postalCode: watch("postalCode") || "",
        }),
      });
      if (countryResponse?.statusCode === HTTPStatusCode.OK) {
        const response = countryResponse?.responseBody?.details;
        setCountry(countryResponse && response.getCountry);
        if (response?.stateCityData === "postal code not find") {
          setNewPostalCodeModal(true);
          setValue("city", "");
          setValue("state", "");
          setValue("country", "");
        } else if (response.getCountry?.length === 1) {
          setControlledCountryValue(response?.getCountry[0]?.value);
          setValue("city", response?.stateCityData?.province);
          setValue("state", response?.stateCityData?.stateEn);
          setValue("country", response?.getCountry[0]);
          clearErrors("country");
        } else {
          setControlledCountryValue("");
          setValue("city", "");
          setValue("state", "");
          setValue("country", "");
        }
      } else {
        setCountry([]);
      }
    },
    [clearErrors, setValue, watch]
  );
  const watchCountry = watch("country");
  const { isReady, debouncedFunction } = useDebounce(postalCodeHandler, 2000);
  useEffect(() => {
    if (removeFields !== null && removeFields.postalCode === true) {
      return;
    } else {
      if (true) {
        return;
      }
      // if(isDirectHR === true && isBDRMDRUser === true){
      //   return
      // }
      !isPostalCodeNotFound && debouncedFunction("POSTAL_CODE");
    }
  }, [
    debouncedFunction,
    watchPostalCode,
    isPostalCodeNotFound,
    removeFields,
    isDirectHR,
  ]);

  const countryCodeChangeHandler = () => {
    if (removeFields !== null && removeFields.postalCode === true) {
      return;
    } else {
      if (country && country?.length > 1 && watch("country")) {
        if (true) {
          return;
        }
        // if(isDirectHR === true && isBDRMDRUser === true){
        //   return
        // }
        !isPostalCodeNotFound && debouncedFunction("COUNTRY_CODE");
      }
    }
  };

  // useEffect(() => {
  //   if(removeFields !== null && removeFields.postalCode === true ){
  //     return
  //   }else{
  //   if (country && country?.length > 1 && watchCountry) {
  //     if(isDirectHR === true && isBDRMDRUser === true){
  //       return
  //     }
  //     !isPostalCodeNotFound && debouncedFunction("COUNTRY_CODE");
  //   }
  // }
  // }, [country, debouncedFunction, isPostalCodeNotFound, watchCountry,removeFields,isDirectHR]);

  const [messageAPI, contextHolder] = message.useMessage();
  let watchJDUrl = watch("jdURL");
  getHRdetails?.en_Id && setEnID(getHRdetails?.en_Id && getHRdetails?.en_Id);

  const getNearByCitiesForAts = () => {
    if (watch("workingMode").id === 3) {
      return NearByCitesValues.join(",");
    } else {
      let cities = [];

      NearByCitesValues.forEach((val) => {
        let valFind = nearByCitiesData.filter((c) => c.label === val);
        if (valFind.length > 0) {
          cities.push(valFind[0]?.value);
        } else {
          cities.push(val);
        }
      });

      return cities.join(",");
    }
  };

  const hrSubmitHandler = useCallback(
    async (d, type = SubmitType.SAVE_AS_DRAFT) => {
      setIsSavedLoading(true);

      if(locationSelectValidation){
        setIsSavedLoading(false);
        return
      }

      if (typeOfPricing === null && companyType.id === 1) {
        setIsSavedLoading(false);
        setPricingTypeError(true);
        return;
      }
      let hrFormDetails = hrUtils.hrFormDataFormatter(
        d,
        type,
        watch,
        clientDetails.contactId
          ? clientDetails.contactId
          : getHRdetails?.addHiringRequest?.contactId,
        isHRDirectPlacement,
        addHRResponse,
        getUploadFileData && getUploadFileData,
        watchJDUrl ? watchJDUrl : jdDumpID,
        typeOfPricing,
        hrPricingTypes,
        companyType
      );
      hrFormDetails.isDirectHR = isDirectHR;
      hrFormDetails.IsConfidentialBudget = isBudgetConfidential;
      hrFormDetails.IsFresherAllowed = isFreshersAllowed;
      hrFormDetails.compensationOption = CompensationValues?.join("^");
      hrFormDetails.hasPeopleManagementExp =
        peopleManagemantexp !== null
          ? peopleManagemantexp === 1
            ? true
            : false
          : null;
      hrFormDetails.prerequisites = watch("parametersHighlight") ?? "";
      hrFormDetails.HRIndustryType = specificIndustry?.join("^");
      hrFormDetails.StringSeparator = "^";

      hrFormDetails.JobTypeID = watch("workingMode").id;
      hrFormDetails.JobLocation =
        watch("workingMode").id === 2 || watch("workingMode").id === 3
          ? watch("location")
          : null;
      hrFormDetails.FrequencyOfficeVisitID =
        watch("workingMode").id === 2 ? watch("officeVisits").id : null;
      hrFormDetails.IsOpenToWorkNearByCities =
        watch("workingMode").id === 2 || watch("workingMode").id === 3
          ? isRelocate
          : null;
      hrFormDetails.NearByCities = isRelocate
        ? NearByCitesValues.join(",")
        : null;
        hrFormDetails.ATS_JobLocationID =
        watch("workingMode").id === 2 || watch("workingMode").id === 3
          ? locationList.length ? locationList?.find((loc) => loc.value === watch("location"))?.id : getHRdetails?.directPlacement?.atsJobLocationId : null;
      hrFormDetails.ATS_NearByCities = isRelocate
        ? getNearByCitiesForAts()
        : null;

      if (companyType.id === 2) {
        hrFormDetails.showHRPOCDetailsToTalents = showHRPOCDetailsToTalents;
        hrFormDetails.hrpocUserID = watch("jobPostUsers")
          ? watch("jobPostUsers")?.map((item) => item.id.toString())
          : [];
        hrFormDetails.hrpocUserDetails = jobPostUsersDetails
          ? jobPostUsersDetails.map((val) => ({
              pocUserID: val.hrwiseContactId,
              contactNo: val.contactNo,
              showEmailToTalent: val.showEmailToTalent,
              showContactNumberToTalent: val.showContactNumberToTalent,
            }))
          : [];
        hrFormDetails.jobTypeId = watch("availability")?.id;
      } else {
        hrFormDetails.showHRPOCDetailsToTalents = null;
        hrFormDetails.hrpocUserID = [];
        hrFormDetails.hrpocUserDetails = [];
        hrFormDetails.jobTypeId = 0;
      }

      if (isDirectHR === true && isBDRMDRUser === true) {
        hrFormDetails.directPlacement.address = "";
        hrFormDetails.directPlacement.postalCode = "";
        hrFormDetails.directPlacement.state = "";
      }
      hrFormDetails["allowSpecialEdit"] = getHRdetails?.allowSpecialEdit;

      if (companyType.id === 2) {
        if (!isPostaJob && !isProfileView) {
          setCreditBaseCheckBoxError(true);
          setIsSavedLoading(false);
          return;
        }
        hrFormDetails.IsPostaJob = isPostaJob;
        // hrFormDetails.IsProfileView = isProfileView
        hrFormDetails.IsProfileView = false;
        hrFormDetails.IsVettedProfile = isProfileView ? isVettedProfile : null;
      }
      if (companyType.id === 1) {
        hrFormDetails.IsPostaJob = false;
        hrFormDetails.IsProfileView = false;
        hrFormDetails.IsVettedProfile = false;
      }
      if (type !== SubmitType.SAVE_AS_DRAFT) {
        if (watch("fromTime")?.value === watch("endTime")?.value) {
          setIsSavedLoading(false);
          return setError("fromTime", {
            type: "validate",
            message: "Start & End Time is same.",
          });
        }
      }

      if (type === SubmitType.SAVE_AS_DRAFT) {
        if (_isNull(watch("clientName"))) {
          setIsSavedLoading(false);
          return setError("clientName", {
            type: "emptyClientName",
            message: "Please enter the client name.",
          });
        }
        // if (_isNull(watch('role'))) {
        // 	setIsSavedLoading(false);
        // 	return setError('role', {
        // 		type: 'emptyrole',
        // 		message: 'Please enter the hiring role.',
        // 	});
        // }
        // if (_isNull(watch('hrTitle'))) {
        // 	setIsSavedLoading(false);
        // 	return setError('hrTitle', {
        // 		type: 'emptyhrTitle',
        // 		message: 'please enter the hiring request title.',
        // 	});
        // }
        if (_isNull(watch("salesPerson"))) {
          setIsSavedLoading(false);
          return setError("salesPerson", {
            type: "emptysalesPersonTitle",
            message: "Please select hiring request sales person",
          });
        }
        if (watch("talentsNumber") < 1 || watch("talentsNumber") > 99) {
          setIsSavedLoading(false);
          return setError("talentsNumber", {
            type: "emptytalentsNumber",
            message: "Please enter valid talents number",
          });
        }
      } else if (type !== SubmitType.SAVE_AS_DRAFT) {
        setType(SubmitType.SUBMIT);
      }
      setInterval(() => setIsSavedLoading(false), 58000);

      const addHRRequest = await hiringRequestDAO.createHRDAO(hrFormDetails);

      if (addHRRequest?.statusCode === HTTPStatusCode.OK) {
        setIsSavedLoading(false);
        window.scrollTo(0, 0);
        setAddHRResponse(getHRdetails?.en_Id);
        setHRdetails((prev) => ({
          ...prev,
          companyInfo: addHRRequest?.responseBody?.details?.companyInfo,
        }));
        type !== SubmitType.SAVE_AS_DRAFT &&
          setTitle(`Debriefing ${getHRdetails?.addHiringRequest?.hrNumber}`);
        // type !== SubmitType.SAVE_AS_DRAFT &&
        // 	setTabFieldDisabled({ ...tabFieldDisabled, debriefingHR: false });

        if (type === SubmitType.SAVE_AS_DRAFT) {
          messageAPI.open({
            type: "success",
            content: "HR details has been saved to draft.",
          });
          // setTitle(`Debriefing ${getHRdetails?.addHiringRequest?.hrNumber}`);
        }
      }
      setIsSavedLoading(false);
    },
    [
      watch,
      getHRdetails?.addHiringRequest?.contactId,
      clientDetails.contactId,
      getHRdetails?.en_Id,
      isHRDirectPlacement,
      addHRResponse,
      getUploadFileData,
      watchJDUrl,
      setError,
      setTitle,
      // setTabFieldDisabled,
      // tabFieldDisabled,
      typeOfPricing,
      hrPricingTypes,
      getHRdetails?.addHiringRequest?.hrNumber,
      messageAPI,
      companyType,
      isBudgetConfidential,
      isVettedProfile,
      isPostaJob,
      isProfileView,
      isFreshersAllowed,
      CompensationValues,
      peopleManagemantexp,
      specificIndustry,
      showHRPOCDetailsToTalents,
      NearByCitesValues,
      isRelocate,
      locationList,
      locationList,
      jobPostUsersDetails,
      locationSelectValidation
    ]
  );
  // useEffect(() => {
  //   setValue("hrTitle", hrRole?.value);
  // }, [hrRole?.value, setValue]);

  const getValueForMaxBudget = () => {
    if (isFreshersAllowed) {
      return +watch("minimumBudget");
    }

    if (
      watch("availability")?.value === "Full Time" ||
      watch("availability")?.value === "Contract" ||
      watch("availability")?.value === "Contract to Hire"
    ) {
      if (watch("currency")?.value === "INR") {
        if (+watch("minimumBudget") > 100000) {
          return +watch("minimumBudget");
        } else {
          return 100000;
        }
      } else {
        if (+watch("minimumBudget") > 1000) {
          return +watch("minimumBudget");
        } else {
          return 1000;
        }
      }
    } else {
      return +watch("minimumBudget");
    }
  };

  const getMessForMaxBudget = () => {
    let str = `please enter the value'`;
    if (isFreshersAllowed) {
      return str + ` more than minimum budget`;
    }

    if (
      watch("availability")?.value === "Full Time" ||
      watch("availability")?.value === "Contract" ||
      watch("availability")?.value === "Contract to Hire"
    ) {
      if (watch("currency")?.value === "INR") {
        if (+watch("minimumBudget") > 100000) {
          return str + ` more than minimum budget`;
        } else {
          return str + " atlest 6 digits";
        }
      } else {
        if (+watch("minimumBudget") > 1000) {
          return str + ` more than minimum budget`;
        } else {
          return str + " atlest 4 digits";
        }
      }
    } else {
      return str + ` more than minimum budget`;
    }
  };

  useEffect(() => {
    if (errors?.clientName?.message) {
      controllerRef.current.focus();
    }
  }, [errors?.clientName]);

  // const durationTypenfo = []

  // const durationDataMemo = useMemo(() => {
  // 	let formattedDuration = [];
  // 	getDurationType?.filter(
  // 		(item) =>
  // 			item?.value !== '0' &&
  // 			formattedDuration.push({
  // 				id: item?.value,
  // 				value: item?.text,
  // 			}),
  // 	);
  // 	return formattedDuration;
  // }, [getDurationType]);

  useEffect(() => {
    setValue("clientName", getHRdetails?.fullClientName?.trim());
    setValue("companyName", getHRdetails?.company);
    setValue("hrTitle", getHRdetails?.addHiringRequest?.requestForTalent);
    setValue("jdURL", getHRdetails?.addHiringRequest?.jdurl);
    if (getHRdetails?.addHiringRequest?.jdurl) {
      setJDURLLink(getHRdetails?.addHiringRequest?.jdurl);
    }
    setValue(
      "minimumBudget",
      getHRdetails?.salesHiringRequest_Details?.budgetFrom
    );
    setValue(
      "maximumBudget",
      getHRdetails?.salesHiringRequest_Details?.budgetTo
    );
    setValue(
      "NRMargin",
      getHRdetails?.addHiringRequest?.isHrtypeDp === true
        ? getHRdetails?.addHiringRequest?.dppercentage
        : getHRdetails?.addHiringRequest?.talentCostCalcPercentage
    );
    setValue("months", getHRdetails?.salesHiringRequest_Details?.specificMonth);
    setValue("years", getHRdetails?.salesHiringRequest_Details?.yearOfExp);
    setIsFreshersAllowed(
      getHRdetails?.salesHiringRequest_Details?.isFresherAllowed
    );
    if (getHRdetails?.salesHiringRequest_Details?.yearOfExp === 0) {
      setIsExpDisabled(true);
      setIsFresherDisabled(false);
    } else {
      setIsExpDisabled(false);
      setIsFresherDisabled(true);
    }
    setValue("talentsNumber", getHRdetails?.addHiringRequest?.noofTalents);
    setValue("dealID", getHRdetails?.addHiringRequest?.dealId);
    setValue("bqFormLink", getHRdetails?.addHiringRequest?.bqlink);
    setValue(
      "discoveryCallLink",
      getHRdetails?.addHiringRequest?.discoveryCall
    );
    setValue("dpPercentage", getHRdetails?.addHiringRequest?.dppercentage);
    if (getHRdetails?.addHiringRequest?.isHrtypeDp) {
      setHRDirectPlacement(true);
    }
    setValue("postalCode", getHRdetails?.directPlacement?.postalCode);
    setValue("city", getHRdetails?.directPlacement?.city);
    setValue("state", getHRdetails?.directPlacement?.state);
    setValue("country", getHRdetails?.directPlacement?.country);
    setValue("address", getHRdetails?.directPlacement?.address);
    setValue("location", getHRdetails?.directPlacement?.jobLocation);
    setIsRelocate(getHRdetails?.directPlacement?.isOpenToWorkNearByCities);
    setNearByCitesValues(
      getHRdetails?.directPlacement?.nearByCities?.split(",")
    );

    setValue("jdExport", getHRdetails?.addHiringRequest?.jdfilename);
    setIsBudgetConfidentil(
      getHRdetails?.salesHiringRequest_Details?.isConfidentialBudget
    );
    // setValue(
    //   "contractDuration",
    //   getHRdetails?.salesHiringRequest_Details?.durationType
    // );
    setValue("workingHours", getHRdetails?.addHiringRequest?.noofHoursworking);
    setValue(
      "overlappingHours",
      getHRdetails?.salesHiringRequest_Details?.overlapingHours
    );
    setValue("getDurationType", getHRdetails?.months);
    setValue(
      "adhocBudgetCost",
      getHRdetails?.salesHiringRequest_Details?.adhocBudgetCost
    );
    // setContractDuration(getHRdetails?.salesHiringRequest_Details?.durationType);
    if (getHRdetails?.clientName) {
      getListData(
        getHRdetails?.fullClientName?.trim(),
        getHRdetails?.clientName.substring(0, 3)
      );
    }
    setUploadFileData(getHRdetails?.addHiringRequest?.jdfilename);

    let company_Type = getHRdetails?.companyTypes?.filter(
      (item) => item.isActive === true
    );
    if (company_Type?.length > 0) {
      setComapnyType(company_Type[0]);
    }

    //Vital information
    getHRdetails?.compensationOption &&
      setCompensationValues(getHRdetails?.compensationOption?.split("^"));
    getHRdetails?.prerequisites &&
      setValue("parametersHighlight", getHRdetails?.prerequisites);
    setHasPeopleManagementExp(
      getHRdetails?.hasPeopleManagementExp === null
        ? null
        : getHRdetails?.hasPeopleManagementExp === true
        ? 1
        : 0
    );
    getHRdetails?.hrIndustryType &&
      setSpecificIndustry(getHRdetails?.hrIndustryType?.split("^"));
  }, [getHRdetails, setValue]);

  useEffect(() => {
    if (
      getHRdetails?.directPlacement?.frequencyOfficeVisitId &&
      frequencyData.length
    ) {
      let frequency = frequencyData.find(
        (val) =>
          val.id === getHRdetails?.directPlacement?.frequencyOfficeVisitId
      );
      setValue("officeVisits", frequency);
      setControlledFrequencyValue(frequency.value);
    }
  }, [getHRdetails?.directPlacement?.frequencyOfficeVisitId, frequencyData]);
  useEffect(() => {
    if (localStorage.getItem("hrID")) {
      getHRdetailsHandler(localStorage.getItem("hrID"));
    }
  }, []);

  useEffect(() => {
    if (getHRdetails?.addHiringRequest?.requestForTalent) {
      const findRole = talentRole.filter(
        (item) =>
          item?.value === getHRdetails?.addHiringRequest?.requestForTalent
      );
      setValue("role", findRole[0]);
      setControlledRoleValue(findRole[0]?.value);
    }
  }, [getHRdetails, talentRole]);

  useEffect(() => {
    if (getHRdetails?.budgetType) {
      const findCurrency = budgets.filter(
        (item) => item?.value === getHRdetails?.budgetType
      );
      setValue("budget", findCurrency[0]);
      setControlledBudgetValue(findCurrency[0]?.value);
    }
  }, [getHRdetails, budgets]);

  useEffect(() => {
    if (getHRdetails?.salesHiringRequest_Details?.currency) {
      const findCurrency = currency.filter(
        (item) =>
          item?.value === getHRdetails?.salesHiringRequest_Details?.currency
      );
      setValue("currency", findCurrency[0]);
      setControlledCurrencyValue(findCurrency[0]?.value);
    }
  }, [getHRdetails, currency]);

  useEffect(() => {
    if (getHRdetails?.addHiringRequest?.salesUserId) {
      const findSalesPerson = salesPerson.filter(
        (item) => item?.id === getHRdetails?.addHiringRequest?.salesUserId
      );
      setValue("salesPerson", findSalesPerson[0]?.id);
      setControlledSalesValue(findSalesPerson[0]?.value);
    }
  }, [getHRdetails, salesPerson]);

  useEffect(() => {
    if (
      getHRdetails?.addHiringRequest?.availability &&
      availability.length &&
      JobTypes.length
    ) {
      let findAvailability;
      if (companyType?.id === 2) {
        findAvailability = JobTypes.filter((item) => {
          return (
            item?.value.trim() ===
            getHRdetails?.addHiringRequest?.availability.trim()
          );
        });
      } else {
        findAvailability = availability.filter((item) => {
          return (
            item?.value.trim() ===
            getHRdetails?.addHiringRequest?.availability.trim()
          );
        });
      }

      setValue("availability", findAvailability[0]);
      setControlledAvailabilityValue(findAvailability[0]?.value);
    }
  }, [getHRdetails, availability]);

  useEffect(() => {
    if (watch("budget")?.value === "1") {
      if (
        watch("hiringPricingType")?.id === 3 ||
        watch("hiringPricingType")?.id === 6
      ) {
        // let dpPercentage = hrPricingTypes.find(i => i.id === watch('hiringPricingType')?.id).pricingPercent
        let dpPercentage = watch("NRMargin");

        if (isGUID) {
          // let cal = (dpPercentage * (watch('adhocBudgetCost') * 12)) / 100
          let cal = (dpPercentage * watch("adhocBudgetCost")) / 100;
          let needToPay = watch("adhocBudgetCost") - cal;
          setValue("uplersFees", cal ? cal : 0);
          setValue("needToPay", needToPay ? needToPay : 0);
        } else {
          let cal = (watch("adhocBudgetCost") * 100) / (100 + +dpPercentage);
          let upFess = (watch("adhocBudgetCost") - cal) * 12;
          setValue("needToPay", cal ? cal.toFixed(2) : 0);
          setValue("uplersFees", upFess ? upFess.toFixed(2) : 0);
        }
      } else {
        if (isGUID) {
          let cal = (watch("NRMargin") * watch("adhocBudgetCost")) / 100;
          let needToPay = +watch("adhocBudgetCost") + cal;
          setValue("uplersFees", cal ? cal : 0);
          setValue("needToPay", needToPay ? needToPay : 0);
        } else {
          let cal =
            (watch("adhocBudgetCost") * 100) / (100 + +watch("NRMargin"));
          let upFess = watch("adhocBudgetCost") - cal;
          setValue("needToPay", cal ? cal.toFixed(2) : 0);
          setValue("uplersFees", upFess ? upFess.toFixed(2) : 0);
        }
      }
    }

    if (watch("budget")?.value === "2") {
      if (
        watch("hiringPricingType")?.id === 3 ||
        watch("hiringPricingType")?.id === 6
      ) {
        // let dpPercentage = hrPricingTypes.find(i => i.id === watch('hiringPricingType')?.id).pricingPercent
        if (isGUID) {
          let dpPercentage = watch("NRMargin");
          // let calMin = (dpPercentage * (watch('minimumBudget') * 12)) / 100
          // let calMax = (dpPercentage * watch('maximumBudget') *12) /100
          let calMin = (dpPercentage * watch("minimumBudget")) / 100;
          let calMax = (dpPercentage * watch("maximumBudget")) / 100;
          let minCal = +watch("minimumBudget") - calMin;
          let maxCal = +watch("maximumBudget") - calMax;
          setValue(
            "needToPay",
            `${minCal ? minCal : 0} - ${maxCal ? maxCal : 0}`
          );
          setValue(
            "uplersFees",
            `${calMin ? calMin : 0} - ${calMax ? calMax : 0}`,
            watch("NRMargin")
          );
        } else {
          let calMin =
            (watch("minimumBudget") * 100) / (100 + +watch("NRMargin"));
          let minUpFees = (watch("minimumBudget") - calMin) * 12;
          let calMax =
            (watch("maximumBudget") * 100) / (100 + +watch("NRMargin"));
          let maxUpFees = (watch("maximumBudget") - calMax) * 12;
          setValue(
            "needToPay",
            `${calMin ? calMin.toFixed(2) : 0} - ${
              calMax ? calMax.toFixed(2) : 0
            }`
          );
          setValue(
            "uplersFees",
            `${minUpFees ? minUpFees.toFixed(2) : 0} - ${
              maxUpFees ? maxUpFees.toFixed(2) : 0
            }`
          );
        }
      } else {
        if (isGUID) {
          let calMin = (watch("NRMargin") * watch("minimumBudget")) / 100;
          let calMax = (watch("NRMargin") * watch("maximumBudget")) / 100;
          let minCal = +watch("minimumBudget") + +calMin;
          let maxCal = +watch("maximumBudget") + +calMax;
          setValue(
            "needToPay",
            `${minCal ? minCal : 0} - ${maxCal ? maxCal : 0}`
          );
          setValue(
            "uplersFees",
            `${calMin ? calMin : 0} - ${calMax ? calMax : 0}`
          );
        } else {
          let calMin =
            (watch("minimumBudget") * 100) / (100 + +watch("NRMargin"));
          let minUpFees = watch("minimumBudget") - calMin;
          let calMax =
            (watch("maximumBudget") * 100) / (100 + +watch("NRMargin"));
          let maxUpFees = watch("maximumBudget") - calMax;
          setValue(
            "needToPay",
            `${calMin ? calMin.toFixed(2) : 0} - ${
              calMax ? calMax.toFixed(2) : 0
            }`
          );
          setValue(
            "uplersFees",
            `${minUpFees ? minUpFees.toFixed(2) : 0} - ${
              maxUpFees ? maxUpFees.toFixed(2) : 0
            }`
          );
        }
      }
    }
  }, [
    watch("adhocBudgetCost"),
    watch("maximumBudget"),
    watch("minimumBudget"),
    watch("budget"),
    watch("NRMargin"),
  ]);

  const setBudgetValueOnChange = () => {
    if (watch("budget")?.value === "1") {
      if (watch("adhocBudgetCost")) {
        if (
          watch("hiringPricingType")?.id === 3 ||
          watch("hiringPricingType")?.id === 6
        ) {
          setValue("adhocBudgetCost", watch("adhocBudgetCost") * 12);
        } else {
          setValue("adhocBudgetCost", watch("adhocBudgetCost") / 12);
        }
      }
    }

    if (watch("budget")?.value === "2") {
      if (
        watch("hiringPricingType")?.id === 3 ||
        watch("hiringPricingType")?.id === 6
      ) {
        watch("maximumBudget") &&
          setValue("maximumBudget", watch("maximumBudget") * 12);
        watch("minimumBudget") &&
          setValue("minimumBudget", watch("minimumBudget") * 12);
      } else {
        watch("maximumBudget") &&
          setValue("maximumBudget", watch("maximumBudget") / 12);
        watch("minimumBudget") &&
          setValue("minimumBudget", watch("minimumBudget") / 12);
      }
    }
  };

  // set client need to pay
  // useEffect(()=>{
  //   if(watch('budget')?.value === '1'){
  //     if(typeOfPricing === 0){
  //       let cal = watch('adhocBudgetCost') - watch('uplersFees')
  //       setValue("needToPay",cal? cal : 0)
  //     }else{
  //       let cal = parseFloat(watch('adhocBudgetCost')) + parseFloat(watch('uplersFees'))
  //       setValue("needToPay",cal? cal : 0)
  //     }

  //   }
  //   if(watch('budget')?.value === '2'){
  //     if(typeOfPricing === 0){
  //       let uplersBudget = watch('uplersFees')?.split('-')
  //       let minCal = watch('minimumBudget') - uplersBudget[0]
  //       let maxCal = watch('maximumBudget') - uplersBudget[1]
  //       setValue("needToPay",`${minCal? minCal : 0} - ${maxCal? maxCal : 0}`)
  //     }else{
  //       let uplersBudget = watch('uplersFees')?.split('-')
  //       let minCal = parseFloat(watch('minimumBudget')) + parseFloat(uplersBudget[0])
  //       let maxCal = parseFloat(watch('maximumBudget')) + parseFloat(uplersBudget[1])

  //       setValue("needToPay",`${minCal? minCal : 0} - ${maxCal? maxCal : 0}`)
  //     }

  //   }
  // },[watch('uplersFees'),watch('budget'),watch('adhocBudgetCost'),watch('maximumBudget'),watch('minimumBudget')])

  // useEffect(() => {
  //   if (getHRdetails?.salesHiringRequest_Details?.timezoneId) {
  //     const findRegion = region.filter(
  //       (item) =>
  //         item?.id === getHRdetails?.salesHiringRequest_Details?.timezoneId
  //     );
  //     setValue("region", findRegion[0]);
  //     setControlledRegionValue(findRegion[0]?.value);
  //   }
  // }, [getHRdetails, region]);

  useEffect(() => {
    if (getHRdetails?.salesHiringRequest_Details?.timezoneId) {
      const findTimeZone = timeZoneList.filter(
        (item) =>
          item?.id === getHRdetails?.salesHiringRequest_Details?.timezoneId
      );
      if (findTimeZone.length) {
        setValue("timeZone", findTimeZone[0]);
        setControlledTimeZoneValue(findTimeZone[0]?.value);
      }
      //  else {
      //   setValue("timeZone", timeZonePref[0]);
      //   setControlledTimeZoneValue(timeZonePref[0]?.value);
      // }
    }
  }, [getHRdetails, timeZoneList]);

  useEffect(() => {
    if (getHRdetails?.salesHiringRequest_Details?.howSoon) {
      const findSoon = howSoon.filter(
        (item) =>
          item?.value === getHRdetails?.salesHiringRequest_Details?.howSoon
      );
      setValue("howSoon", findSoon[0]);
      setControlledTimeSoonValue(findSoon[0]?.value);
    }
  }, [getHRdetails, howSoon]);

  useEffect(() => {
    if (getHRdetails?.hdnModeOfWork) {
      const findWorkingMode = workingMode.filter(
        (item) => item?.value === getHRdetails?.hdnModeOfWork
      );
      setValue("workingMode", findWorkingMode[0]);
      setControlledWorkingValue(findWorkingMode[0]?.value);
    }
  }, [getHRdetails]);

  useEffect(() => {
    if (getHRdetails?.directPlacement?.country) {
      const findCountryMode = country.filter(
        (item) => item?.id === Number(getHRdetails?.directPlacement?.country)
      );
      setValue("country", findCountryMode[0]);
      setControlledCountryValue(findCountryMode[0]?.value);
    }
  }, [getHRdetails]);

  useEffect(() => {
    if (
      getHRdetails?.salesHiringRequest_Details?.durationType &&
      getDurationType.length > 0
    ) {
      const findDurationMode = getDurationType.filter(
        (item) =>
          item?.value === getHRdetails?.salesHiringRequest_Details?.durationType
      );
      setValue("getDurationType", findDurationMode[0]);
      setControlledDurationTypeValue(findDurationMode[0]?.value);
    }
  }, [getHRdetails, getDurationType]);

  useEffect(() => {
    if (getHRdetails?.salesHiringRequest_Details?.timeZoneFromTime) {
      const findFromTime = getStartEndTimes.filter(
        (item) =>
          item?.value ===
          getHRdetails?.salesHiringRequest_Details?.timeZoneFromTime
      );
      const findEndTime = getStartEndTimes.filter(
        (item) =>
          item?.value ===
          getHRdetails?.salesHiringRequest_Details?.timeZoneEndTime
      );
      setValue("fromTime", findFromTime[0]);
      setControlledFromTimeValue(findFromTime[0]?.value);
      setValue("endTime", findEndTime[0]);
      setControlledEndTimeValue(findEndTime[0]?.value);
      // setControlledDurationTypeValue(findDurationMode[0]?.value);
    }
  }, [getHRdetails, getStartEndTimes, setValue]);

  useEffect(() => {
    if (getHRdetails?.addHiringRequest) {
      const findtempProject = tempProjects.filter(
        (item) => item.value === getHRdetails.addHiringRequest.isHiringLimited
      );
      if (findtempProject.length > 0) {
        setValue("tempProject", findtempProject[0]);
        setControlledTempProjectValue(findtempProject[0]?.value);
      }
    }

    if (getHRdetails?.addHiringRequest?.isTransparentPricing !== null) {
      setTypeOfPricing(
        getHRdetails?.addHiringRequest?.isTransparentPricing === true ? 1 : 0
      );
      setTransactionMessage(
        "*This client has been selected in past for below pricing model. To change and update pricing model go to Company and make the changes to reflect right while submitting this HR."
      );
    } else {
      setTypeOfPricing(null);
      setTransactionMessage(
        "*You are creating this HR for the first time for this Client after roll out of Transparent Pricing, help us select if this client and HR falls under transparent or non transparent pricing."
      );
    }

    let filteredHRtype = hrPricingTypes.find(
      (item) => item.id === getHRdetails?.addHiringRequest?.hiringTypePricingId
    );

    if (filteredHRtype) {
      setValue("hiringPricingType", {
        id: filteredHRtype.id,
        value: filteredHRtype.type,
      });
      setControlledHiringPricingTypeValue(filteredHRtype.type);
    }

    let payrollTypeFilter = payRollTypes.find(
      (item) => item.id === getHRdetails?.addHiringRequest?.payrollTypeId
    );
    if (payrollTypeFilter) {
      setValue("payrollType", {
        id: payrollTypeFilter.id,
        value: payrollTypeFilter.value,
      });
      setControlledPayrollTypeValue(payrollTypeFilter.value);
      if (getHRdetails?.addHiringRequest?.payrollTypeId === 3) {
        setValue(
          "payrollPartnerName",
          getHRdetails?.addHiringRequest?.payrollPartnerName
        );
      }
    }

    setIsVettedProfile(getHRdetails?.addHiringRequest?.isVettedProfile);
    setIsPostaJob(getHRdetails?.companyInfo?.isPostaJob);
    setIsProfileView(getHRdetails?.companyInfo?.isProfileView);
    getPOCUsers(getHRdetails?.companyInfo?.companyID);
    setValue(
      "jobPostUsers",
      getHRdetails?.hrpocUserID?.map((item) => ({
        id: item.hrwiseContactId,
        value: item.fullName,
      }))
    );
    setJobPostUsersDetails(getHRdetails?.hrpocUserID);
    setControlledPocValue(
      getHRdetails?.hrpocUserID?.map((item) => ({
        id: item.hrwiseContactId,
        value: item.fullName,
      }))
    );
    setshowHRPOCDetailsToTalents(getHRdetails?.showHRPOCDetailsToTalents);
  }, [getHRdetails, tempProjects, setValue, hrPricingTypes, payRollTypes]);

  useEffect(() => {
    if (getHRdetails?.addHiringRequest?.partialEngagementTypeId) {
      const findPartialEngagement = partialEngagements.filter(
        (item) =>
          item.id === getHRdetails?.addHiringRequest?.partialEngagementTypeId
      );
      setValue("partialEngagement", findPartialEngagement[0]);
      setControlledPartialEngagementValue(findPartialEngagement[0]?.value);
    }
  }, [getHRdetails, partialEngagements]);

  useEffect(() => {
    if (getHRdetails?.contractDuration === "0") {
      setValue("contractDuration", { id: undefined, value: "0" });
      setContractDuration("0");
      return;
    }
    const contract = contractDurations.filter(
      (item) =>
        item.value ===
        (getHRdetails?.contractDuration === "-1"
          ? "Indefinite"
          : getHRdetails?.contractDuration)
    );

    if (contract.length > 0) {
      setValue("contractDuration", contract[0]);
      setContractDuration(contract[0]?.value);
    } else {
      if (
        getHRdetails?.contractDuration !== "0" ||
        getHRdetails?.contractDuration !== "-1"
      ) {
        const object = {
          disabled: false,
          group: null,
          selected: false,
          text: `${getHRdetails?.contractDuration} months`,
          value: `${getHRdetails?.contractDuration}`,
        };
        setcontractDurations((prev) => [...prev, object]);
        // this will trigger this Effect again and then go to if
      }
    }
  }, [getHRdetails, contractDurations]);

  // useEffect(() => {
  //   if (localStorage.getItem("fromEditDeBriefing")) {
  //     setTitle("Edit Debriefing HR");
  //   }
  // }, [localStorage.getItem("fromEditDeBriefing")]);

  function testJSON(text) {
    if (typeof text !== "string") {
      return false;
    }
    try {
      JSON.parse(text);
      return true;
    } catch (error) {
      return false;
    }
  }

  const continueWithGPTres = () => {
    //when file uploaded
    if (gptFileDetails?.JDDumpID) {
      setUploadFileData(gptFileDetails.FileName);
      setJDParsedSkills({
        ...gptFileDetails,
        roleName: gptFileDetails?.Title ?? "",
      });

      setJDDumpID(gptFileDetails.JDDumpID);
      setGPTFileDetails({});
      setShowGPTModal(false);

      let _getHrValues = { ...getHRdetails };
      _getHrValues.salesHiringRequest_Details.jobDescription =
        gptFileDetails.JobDescription ?? "";
      _getHrValues.salesHiringRequest_Details.requirement =
        gptFileDetails.Requirements;
      _getHrValues.salesHiringRequest_Details.roleAndResponsibilities =
        gptFileDetails.Responsibility;
      _getHrValues.salesHiringRequest_Details.rolesResponsibilities =
        gptFileDetails.Responsibility;
      _getHrValues.addHiringRequest.jdurl = "";
      _getHrValues.addHiringRequest.jdfilename = gptFileDetails.FileName;

      // set value to prevent change after JD upload
      _getHrValues.addHiringRequest.isTransparentPricing =
        typeOfPricing === 1 ? true : false;
      _getHrValues.hdnModeOfWork =
        watch("workingMode")?.value ?? getHRdetails.hdnModeOfWork;
      _getHrValues.contractDuration =
        watch("contractDuration")?.value ?? getHRdetails.contractDuration;
      _getHrValues.addHiringRequest.partialEngagementTypeId =
        watch("partialEngagement")?.id ??
        getHRdetails?.addHiringRequest?.partialEngagementTypeId;
      _getHrValues.salesHiringRequest_Details.adhocBudgetCost =
        watch("adhocBudgetCost") ??
        getHRdetails?.salesHiringRequest_Details?.adhocBudgetCost;
      _getHrValues.salesHiringRequest_Details.budgetFrom =
        watch("minimumBudget") ??
        getHRdetails?.salesHiringRequest_Details?.budgetFrom;
      _getHrValues.salesHiringRequest_Details.budgetTo =
        watch("maximumBudget") ??
        getHRdetails?.salesHiringRequest_Details?.budgetTo;
      _getHrValues.budgetType = controlledBudgetValue ?? getHRdetails?.budget;
      _getHrValues.addHiringRequest.salesUserId =
        watch("salesPerson") ?? getHRdetails?.addHiringRequest?.salesUserId;
      _getHrValues.salesHiringRequest_Details.timeZoneFromTime =
        controlledFromTimeValue ??
        getHRdetails?.salesHiringRequest_Details.timeZoneFromTime;
      _getHrValues.salesHiringRequest_Details.timeZoneEndTime =
        controlledEndTimeValue ??
        getHRdetails?.salesHiringRequest_Details.timeZoneEndTime;
      _getHrValues.salesHiringRequest_Details.timezoneId =
        controlledTimeZoneValue ??
        getHRdetails?.salesHiringRequest_Details?.timezoneId;
      _getHrValues.salesHiringRequest_Details.currency =
        controlledCurrencyValue ??
        getHRdetails?.salesHiringRequest_Details.currency;
      _getHrValues.salesHiringRequest_Details.yearOfExp = watch("years");
      _getHrValues.salesHiringRequest_Details.specificMonth = watch("months");
      _getHrValues.salesHiringRequest_Details.howSoon =
        controlledSoonValue ??
        getHRdetails?.salesHiringRequest_Details?.howSoon;
      _getHrValues.salesHiringRequest_Details.durationType =
        controlledDurationTypeValue ??
        getHRdetails?.salesHiringRequest_Details.durationType;
      _getHrValues.addHiringRequest.availability =
        controlledAvailabilityValue ??
        getHRdetails.addHiringRequest.availability;
      _getHrValues.addHiringRequest.bqlink =
        watch("bqFormLink") ?? getHRdetails?.addHiringRequest?.bqlink;
      _getHrValues.addHiringRequest.discoveryCall =
        watch("discoveryCallLink") ??
        getHRdetails?.addHiringRequest?.discoveryCall;
      _getHrValues.addHiringRequest.noofHoursworking =
        watch("workingHours") ??
        getHRdetails?.addHiringRequest?.noofHoursworking;

      if (getHRdetails?.addHiringRequest?.isHrtypeDp === true) {
        _getHrValues.addHiringRequest.dppercentage = watch("NRMargin");
      } else {
        _getHrValues.addHiringRequest.talentCostCalcPercentage =
          watch("NRMargin");
      }

      if (watch("postalCode")) {
        _getHrValues.directPlacement.postalCode = watch("postalCode");
      }
      if (watch("city")) {
        _getHrValues.directPlacement.city = watch("city");
      }
      if (watch("state")) {
        _getHrValues.directPlacement.state = watch("state");
      }
      if (watch("country")) {
        _getHrValues.directPlacement.country = controlledCountryValue;
      }
      if (watch("address")) {
        _getHrValues.directPlacement.address = watch("address");
      }
      /////////

      if (gptFileDetails.Skills.length > 0) {
        // _getHrValues.chatGptSkills = gptFileDetails.Skills.map(item=> item.value).join(',');
        _getHrValues.skillmulticheckbox = gptFileDetails.Skills?.slice(
          0,
          8
        ).map((item) => ({ ...item, text: item.value }));
        _getHrValues.allSkillmulticheckbox = [];
      }

      setHRdetails(_getHrValues);
    } else {
      //when URL

      let _getHrValues = { ...getHRdetails };
      _getHrValues.addHiringRequest.noofTalents = gptDetails?.addHiringRequest
        ?.noofTalents
        ? gptDetails?.addHiringRequest?.noofTalents
        : watch("talentsNumber");
      _getHrValues.salesHiringRequest_Details.roleId = null;
      _getHrValues.addHiringRequest.requestForTalent = gptDetails
        ?.addHiringRequest?.requestForTalent
        ? gptDetails?.addHiringRequest?.requestForTalent
        : watch("hrTitle");
      _getHrValues.addHiringRequest.availability = gptDetails?.addHiringRequest
        ?.availability
        ? gptDetails?.addHiringRequest?.availability
        : watch("availability");
      _getHrValues.addHiringRequest.isHiringLimited = gptDetails
        ?.addHiringRequest?.isHiringLimited
        ? gptDetails?.addHiringRequest?.isHiringLimited
        : getHRdetails?.addHiringRequest?.isHiringLimited;
      _getHrValues.addHiringRequest.guid = gptDetails?.addHiringRequest?.guid;
      _getHrValues.addHiringRequest.jdurl = jdURLLink;
      _getHrValues.addHiringRequest.jdfilename = "";
      if (gptDetails?.salesHiringRequest_Details?.budgetFrom > 0) {
        _getHrValues.salesHiringRequest_Details.budgetFrom =
          gptDetails?.salesHiringRequest_Details?.budgetFrom > 0
            ? gptDetails?.salesHiringRequest_Details?.budgetFrom
            : watch("minimumBudget");
      }

      _getHrValues.salesHiringRequest_Details.budgetTo =
        gptDetails?.salesHiringRequest_Details?.budgetTo > 0
          ? gptDetails?.salesHiringRequest_Details?.budgetTo
          : watch("maximumBudget");
      _getHrValues.salesHiringRequest_Details.timeZoneFromTime = gptDetails
        ?.salesHiringRequest_Details?.timeZoneFromTime
        ? gptDetails?.salesHiringRequest_Details?.timeZoneFromTime
        : controlledFromTimeValue;
      _getHrValues.salesHiringRequest_Details.timeZoneEndTime = gptDetails
        ?.salesHiringRequest_Details?.timeZoneEndTime
        ? gptDetails?.salesHiringRequest_Details?.timeZoneEndTime
        : controlledEndTimeValue;
      _getHrValues.salesHiringRequest_Details.currency = gptDetails
        ?.salesHiringRequest_Details?.currency
        ? gptDetails?.salesHiringRequest_Details?.currency
        : controlledCurrencyValue;
      _getHrValues.salesHiringRequest_Details.yearOfExp = gptDetails
        ?.salesHiringRequest_Details?.yearOfExp
        ? gptDetails?.salesHiringRequest_Details?.yearOfExp
        : watch("years");
      _getHrValues.salesHiringRequest_Details.specificMonth = gptDetails
        ?.salesHiringRequest_Details?.specificMonth
        ? gptDetails?.salesHiringRequest_Details?.specificMonth
        : watch("months");
      _getHrValues.salesHiringRequest_Details.durationType = gptDetails
        ?.salesHiringRequest_Details?.durationType
        ? gptDetails?.salesHiringRequest_Details?.durationType
        : controlledDurationTypeValue;
      _getHrValues.salesHiringRequest_Details.requirement =
        gptDetails?.salesHiringRequest_Details?.requirement;
      _getHrValues.salesHiringRequest_Details.roleAndResponsibilities =
        gptDetails?.salesHiringRequest_Details?.rolesResponsibilities;
      _getHrValues.salesHiringRequest_Details.rolesResponsibilities =
        gptDetails?.salesHiringRequest_Details?.rolesResponsibilities; // not sure with roles key name
      _getHrValues.chatGptSkills = gptDetails?.chatGptSkills;
      _getHrValues.chatGptAllSkills = gptDetails?.chatGptAllSkills;
      _getHrValues.addHiringRequest.isTransparentPricing =
        typeOfPricing === 1 ? true : false;

      const findWorkingMode = workingMode.filter(
        (item) => item?.id === parseInt(gptDetails?.modeOfWorkingId)
      );

      setValue("workingMode", findWorkingMode[0]);
      setControlledWorkingValue(findWorkingMode[0]?.value);
      setValue("jdExport", "");
      _getHrValues.hdnModeOfWork = findWorkingMode[0]?.value
        ? findWorkingMode[0]?.value
        : watch("workingMode").value;
      setHRdetails(_getHrValues);
      gptDetails?.addHiringRequest?.noofTalents &&
        setValue("talentsNumber", gptDetails?.addHiringRequest?.noofTalents);
      // gptDetails?.addHiringRequest?.availability &&
      //   setValue("availability", gptDetails?.addHiringRequest?.availability);
      if (gptDetails?.addHiringRequest?.availability) {
        let findAvailability = availability.filter(
          (item) => item.value === gptDetails?.addHiringRequest?.availability
        );
        if (findAvailability[0].value) {
          setValue("availability", findAvailability[0]);
          setControlledAvailabilityValue(findAvailability[0].value);
        }
      }
      if (gptDetails?.salesHiringRequest_Details?.budgetFrom > 0) {
        setValue(
          "minimumBudget",
          gptDetails?.salesHiringRequest_Details?.budgetFrom
        );
        resetField("adhocBudgetCost");
        setValue("budget", { id: "", value: "2" });
        setControlledBudgetValue("2");
      }

      gptDetails?.salesHiringRequest_Details?.budgetTo > 0 &&
        setValue(
          "maximumBudget",
          gptDetails?.salesHiringRequest_Details?.budgetTo
        );
      if (gptDetails?.salesHiringRequest_Details?.yearOfExp) {
        setValue("years", gptDetails?.salesHiringRequest_Details?.yearOfExp);
      }

      gptDetails?.salesHiringRequest_Details?.specificMonth &&
        setValue(
          "months",
          gptDetails?.salesHiringRequest_Details?.specificMonth
        );
      gptDetails?.salesHiringRequest_Details?.durationType &&
        setValue(
          "contractDuration",
          gptDetails?.salesHiringRequest_Details?.durationType
        );
      gptDetails?.salesHiringRequest_Details?.durationType &&
        setContractDuration(
          gptDetails?.salesHiringRequest_Details?.durationType
        );
      gptDetails?.salesHiringRequest_Details?.currency &&
        setControlledCurrencyValue(
          gptDetails?.salesHiringRequest_Details?.currency
        );
      gptDetails?.salesHiringRequest_Details?.timeZoneFromTime &&
        setControlledFromTimeValue(
          gptDetails?.salesHiringRequest_Details?.timeZoneFromTime
        );
      gptDetails?.salesHiringRequest_Details?.timeZoneEndTime &&
        setControlledEndTimeValue(
          gptDetails?.salesHiringRequest_Details?.timeZoneEndTime
        );
      gptDetails?.salesHiringRequest_Details?.timeZoneFromTime &&
        setValue("fromTime", {
          id: "",
          value: gptDetails?.salesHiringRequest_Details?.timeZoneFromTime,
        });
      gptDetails?.salesHiringRequest_Details?.timeZoneEndTime &&
        setValue("endTime", {
          id: "",
          value: gptDetails?.salesHiringRequest_Details?.timeZoneEndTime,
        });

      setGPTDetails({});
      setShowGPTModal(false);
    }
  };

  const onHandleFocusOut = async (e) => {
    const regex = /\(([^)]+)\)/;
    if (!watchClientName) {
      setError("jdURL", { message: "Please Select client Email/Name " });
      setTimeout(() => {
        clearErrors("jdURL");
        resetField("jdURL");
        setJDURLLink("");
      }, 3000);
      return;
    }
    const match = watchClientName.match(regex);
    let email = "";
    if (match && match.length > 1) {
      email = match[1];
    }
    setIsLoading(true);
    setIsSavedLoading(true);
    setValue("jdURL", e.target.value);
    setJDURLLink(e.target.value);

    const getResponse = async () => {
      const response = await hiringRequestDAO.extractTextUsingPythonDAO({
        clientEmail: email
          ? email.trim()
          : clientDetail?.clientemail
          ? clientDetail?.clientemail
          : filteredMemo[0]?.emailId
          ? filteredMemo[0]?.emailId
          : watchClientName ?? "",
        psUrl: e.target.value,
      });

      if (
        response.statusCode === HTTPStatusCode.OK &&
        response?.responseBody?.statusCode === HttpStatusCode.Ok
      ) {
        setShowGPTModal(true);
        setGPTDetails(response?.responseBody?.details);
        setIsLoading(false);
        setIsSavedLoading(false);
      }
    };
    setPrevJDURLLink((prev) => {
      if (prev !== e.target.value && e.target.value !== "") {
        getResponse();
      } else {
        setIsLoading(false);
        setIsSavedLoading(false);
      }

      return e.target.value;
    });
  };

  // Handle city change for Direct HR
  const watchCity = watch("city");
  const cityChangeHandler = async () => {
    const countryResponse = await MasterDAO.getCountryByCityRequestDAO(
      watchCity
    );

    if (countryResponse.statusCode === HttpStatusCode.Ok) {
      if (countryResponse.responseBody.message === "List of countries") {
        setCountryListMessage(null);
        let countryList = countryResponse.responseBody.details;
        setCountry(
          countryList !== null
            ? countryList.map((list) => ({ id: list.id, value: list.country }))
            : []
        );
        if (countryList.length === 1) {
          setControlledCountryValue(countryList[0]?.country);
          setValue("country", countryList[0]);
        }
        if (countryList.length > 1) {
          setControlledCountryValue("");
          resetField("country");
        }
      } else {
        let countryList = countryResponse.responseBody.details;
        setCountry(
          countryList !== null
            ? countryList.map((list) => ({ id: list.id, value: list.country }))
            : []
        );
        setControlledCountryValue("");
        resetField("country");
        setCountryListMessage(countryResponse.responseBody.message);
        setTimeout(() => {
          setCountryListMessage(null);
        }, 7000);
      }
    }
  };
  const { isReady: isCityReady, debouncedFunction: cityDeb } = useDebounce(
    cityChangeHandler,
    2000
  );

  useEffect(() => {
    if (companyType?.id === 1) {
      // resetField('talentsNumber')
      setDisabledFields((prev) => ({ ...prev, talentRequired: false }));
    }

    if (companyType?.id === 2) {
      // setValue('talentsNumber',1)
      setDisabledFields((prev) => ({ ...prev, talentRequired: true }));
    }
  }, [companyType?.id]);

  const onChangeLocation = async (val) => {
    if (typeof val === "number") return;
    fetchLocations(val);
  };

  const fetchLocations = useCallback(
    debounce(async (val) => {
      if (val.trim() === "") return; // Avoid calling the API if the input is empty
      const controller = new AbortController();
      const signal = controller.signal;
      // fetchController.current = controller;

      try {
        setIsLoading(true);
        const _res = await MasterDAO.getAutoCompleteCityStateDAO(val, {
          signal,
        });
        setIsLoading(false);
        let locations = [];
        if (_res?.statusCode === 200) {
          locations = _res?.responseBody?.details?.map((location) => ({
            id: location.row_ID,
            value: location.location,
          }));
          setLocationList(locations || []);
        } else {
          setLocationList([]);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Error fetching locations:", error);
          setLocationList([]);
        }
      }
    }, 300),
    []
  );

  const getCities = async (locationId) => {
    setIsLoading(true);
    let _res = await MasterDAO.getNearByCitiesDAO(locationId);
    setIsLoading(false);
    let citiesValues = [];
    if (_res?.statusCode === 200) {
      citiesValues = _res?.responseBody?.details?.map((city) => ({
        value: city.nearByDistrictID,
        label: city.nearByDistrictName,
      }));
      return citiesValues || [];
    } else {
      return [];
    }
  };

  const sanitizedDescription = (JobDescription) => {
    return DOMPurify.sanitize(JobDescription, {
      // ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'b', 'strong', 'i', 'em', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: {
        // '*': ['class'], // Allow class attribute for custom styling
        a: ["href", "target"], // Allow href and target for links
      },
    });
  };

  const handleCheckboxChange = (index, field, checked) => {
    setJobPostUsersDetails((prevDetails) =>
      prevDetails.map((detail, i) =>
        i === index ? { ...detail, [field]: checked } : detail
      )
    );
  };

  const handleContactNoChange = (index, newValue) => {
    const regex = /^[0-9]\d*$/;
    if (regex.test(newValue) || newValue === "") {
      if(newValue === ""){
        handleCheckboxChange(index, 'showContactNumberToTalent', false)
    }
      setJobPostUsersDetails((prevDetails) =>
        prevDetails.map((detail, i) =>
          i === index ? { ...detail, contactNo: newValue } : detail
        )
      );
    }
  };

  return (
    <>
      <div className={HRFieldStyle.hrFieldContainer}>
        {contextHolder}
        {getHRdetails?.salesHiringRequest_Details ? (
          <>
            <div className={HRFieldStyle.partOne}>
              <div className={HRFieldStyle.hrFieldLeftPane}>
                <h3>Hiring Request Details</h3>
                <p>Please provide the necessary details</p>
                <p className={HRFieldStyle.teansactionMessage}>
                  {companyType?.name && `HR is "${companyType?.name}"`}
                </p>
                <div
                  className={HRFieldStyle.formPanelAction}
                  style={{ padding: "0 0 20px", justifyContent: "flex-start" }}
                >
                  <button
                    className={HRFieldStyle.btnPrimary}
                    onClick={() => {
                      setIsPreviewModal(true);
                      setcompanyID(getHRdetails?.companyInfo?.companyID);
                    }}
                  >
                    View / Edit Company Details
                  </button>
                </div>
                <LogoLoader visible={isSavedLoading} />
              </div>

              <form id="hrForm" className={HRFieldStyle.hrFieldRightPane}>
                <div className={HRFieldStyle.row}>
                  <div className={HRFieldStyle.colMd12}>
                    <div className={HRFieldStyle.formGroup}>
                      <label>
                        Client Email/Name{" "}
                        <span className={HRFieldStyle.reqField}>*</span>
                      </label>
                      <Controller
                        render={({ ...props }) => (
                          <AutoComplete
                            options={getClientNameSuggestion}
                            onSelect={(clientName, _obj) =>
                              getClientNameValue(clientName, _obj)
                            }
                            filterOption={true}
                            onSearch={(searchValue) => {
                              // setClientNameSuggestion([]);
                              getClientNameSuggestionHandler(
                                searchValue.trim()
                              );
                            }}
                            onChange={(clientName) => {
                              setValue("clientName", clientName);
                            }}
                            placeholder="Enter Client Email/Name"
                            ref={controllerRef}
                            // name="clientName"
                            // defaultValue={clientNameValue}
                            value={watchClientName}
                            disabled={
                              getHRdetails.allowSpecialEdit ? false : true
                            }
                          />
                        )}
                        {...register("clientName", {
                          validate,
                        })}
                        name="clientName"
                        // rules={{ required: true }}
                        control={control}
                      />
                      {errors.clientName && (
                        <div className={HRFieldStyle.error}>
                          {errors.clientName?.message &&
                            `* ${errors?.clientName?.message}`}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <div className={HRFieldStyle.colMd12}>
							<HRInputField
								disabled={pathName === ClientHRURL.ADD_NEW_CLIENT || isLoading}
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
						</div> */}
                </div>
                <div className={HRFieldStyle.row}>
                  <div className={HRFieldStyle.colMd6}>
                    <HRInputField
                      // disabled={
                      //     pathName === ClientHRURL.ADD_NEW_CLIENT ||
                      //     isCompanyNameAvailable ||
                      //     isLoading
                      // }
                      disabled={isCompanyNameAvailable ? true : false}
                      register={register}
                      errors={errors}
                      validationSchema={{
                        required: "please enter the company name.",
                      }}
                      label="Company Name"
                      name="companyName"
                      type={InputType.TEXT}
                      placeholder="Enter Company Name"
                      required
                    />
                  </div>

                  <div className={HRFieldStyle.colMd6}>
                    {userData.LoggedInUserTypeID && (
                      <HRSelectField
                        controlledValue={controlledSalesValue}
                        setControlledValue={setControlledSalesValue}
                        isControlled={true}
                        setValue={setValue}
                        mode={"id"}
                        register={register}
                        label={"Sales Person"}
                        searchable={true}
                        options={salesPerson && salesPerson}
                        name="salesPerson"
                        isError={errors["salesPerson"] && errors["salesPerson"]}
                        required={
                          disabledFields !== null
                            ? !disabledFields?.salesPerson
                            : true
                        }
                        errorMsg={"Please select hiring request sales person"}
                        disabled={
                          disabledFields !== null
                            ? disabledFields?.salesPerson
                            : userData?.LoggedInUserTypeID ===
                              UserAccountRole.SALES
                        }
                      />
                    )}
                  </div>

                  {companyType?.id === 2 && (
                    <div
                      className={HRFieldStyle.colMd12}
                      style={{ marginBottom: "32px" }}
                    >
                      <div>
                        <Checkbox
                          checked={isPostaJob}
                          disabled={true}
                          onClick={() => setIsPostaJob((prev) => !prev)}
                        >
                          Credit per post a job
                        </Checkbox>
                        {/* <Checkbox checked={isProfileView} disabled={true} onClick={()=> setIsProfileView(prev=> !prev)}>
                          Credit per profile view
                          </Checkbox>	 */}
                      </div>
                      {creditBaseCheckBoxError &&
                        !isPostaJob &&
                        !isProfileView && (
                          <p className={HRFieldStyle.error}>
                            Please select Option
                          </p>
                        )}
                    </div>
                  )}

                  {/* {companyType?.id === 2 && isProfileView  && <div className={HRFieldStyle.colMd12} style={{marginBottom: '32px'}}>
<Radio.Group
                  onChange={e=> {setIsVettedProfile(e.target.value)}}
                  value={isVettedProfile}
                  >
                  <Radio value={false}>Fast Profile</Radio>
                  <Radio value={true}>Vetted Profile</Radio>
                </Radio.Group>
</div> } */}

                  {companyType?.id === 1 && (
                    <div className={HRFieldStyle.colMd12}>
                      <div className={HRFieldStyle.formGroup}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label>
                            Type Of pricing
                            {/* <span className={allengagementReplceTalentStyles.reqField}>*</span> */}
                          </label>
                          {pricingTypeError && (
                            <p className={HRFieldStyle.error}>
                              *Please select pricing type
                            </p>
                          )}
                          {transactionMessage && (
                            <p className={HRFieldStyle.teansactionMessage}>
                              {transactionMessage}
                            </p>
                          )}
                          <Radio.Group
                            disabled={true}
                            // className={allengagementReplceTalentStyles.radioGroup}
                            onChange={(e) => {
                              setTypeOfPricing(e.target.value);
                              resetField("hiringPricingType");
                              resetField("availability");
                              setControlledAvailabilityValue(
                                "Select availability"
                              );
                              resetField("payrollType");
                              setPricingTypeError(false);
                              resetField("contractDuration");
                              setContractDuration("");
                            }}
                            value={typeOfPricing}
                          >
                            <Radio value={1}>Transparent Pricing</Radio>
                            <Radio value={0}>Non Transparent Pricing</Radio>
                          </Radio.Group>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      {/* <HRSelectField
                                    mode={'id/value'}
                                    setValue={setValue}
                                    register={register}
                                    label={'Availability'}
                                    defaultValue="Select availability"
                                    options={availability}
                                    name="availability"
                                    isError={errors['availability'] && errors['availability']}
                                    required
                                    errorMsg={'Please select the availability.'}
                                /> */}

                      <HRSelectField
                        controlledValue={controlledAvailabilityValue}
                        setControlledValue={(val) => {
                          setControlledAvailabilityValue(val);
                          resetField("hiringPricingType");
                          resetField("payrollType");
                          setControlledPayrollTypeValue("Select payroll");
                          setControlledHiringPricingTypeValue(
                            "Select Hiring Pricing"
                          );
                          resetField("contractDuration");
                          setContractDuration("");
                          // if(companyType?.id === 2){
                          //   if(val === 'Part Time'){
                          //     setValue('tempProject',{id: undefined, value: true})
                          //     setControlledTempProjectValue(true)
                          //   }
                          // }
                        }}
                        isControlled={true}
                        mode={"id/value"}
                        setValue={setValue}
                        register={register}
                        label={
                          companyType?.id === 2 ? "Job Type" : "Availability"
                        }
                        defaultValue="Select availability"
                        options={
                          companyType?.id === 2 ? JobTypes : availability
                        }
                        name="availability"
                        isError={
                          errors["availability"] && errors["availability"]
                        }
                        required
                        errorMsg={`Please select the ${
                          companyType?.id === 2 ? "job type" : "availability"
                        }.`}
                      />
                    </div>
                  </div>
                  {/*  Duration in case of Pay Per Credit */}

                  {companyType?.id === 2 && (
                    <>
                      {/* <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      <HRSelectField
                        controlledValue={controlledTempProjectValue}
                        setControlledValue={setControlledTempProjectValue}
                        isControlled={true}
                        isControlledBoolean={true}
                        mode={"id/value"}
                        searchable={false}
                        setValue={setValue}
                        register={register}
                        label={"Is this Hiring need Temporary for any project?"}
                        defaultValue="Select"
                        options={tempProjects.map((item) => ({
                          id: item.id,
                          label: item.text,
                          value: item.value,
                        }))}
                        name="tempProject"
                        isError={errors["tempProject"] && errors["tempProject"]}
                        required={companyType?.id=== 2 ? true : false}
                        errorMsg={"Please select."}
                        disabled={controlledAvailabilityValue === 'Part Time' ? true : false}
                      />
                    </div>
                  </div> */}

                      {(watch("availability")?.id === 2 ||
                        watch("availability")?.id === 3 ||
                        watch("availability")?.id === 4) && (
                        <div className={HRFieldStyle.colMd6}>
                          <div className={HRFieldStyle.formGroup}>
                            <HRSelectField
                              key={"contract Duration for pay per Credit"}
                              dropdownRender={(menu) => (
                                <>
                                  {menu}
                                  <Divider style={{ margin: "8px 0" }} />
                                  <Space style={{ padding: "0 8px 4px" }}>
                                    <label>Other:</label>
                                    <input
                                      type={InputType.NUMBER}
                                      className={HRFieldStyle.addSalesItem}
                                      placeholder="Ex: 5,6,7..."
                                      ref={inputRef}
                                      value={name}
                                      onChange={onNameChange}
                                      required
                                    />
                                    <Button
                                      style={{
                                        backgroundColor: `var(--uplers-grey)`,
                                      }}
                                      shape="round"
                                      type="text"
                                      icon={<PlusOutlined />}
                                      onClick={addItem}
                                      disabled={
                                        name
                                          ? contractDurations.filter(
                                              (duration) =>
                                                duration.value == name
                                            ).length > 0
                                          : true
                                      }
                                    >
                                      Add item
                                    </Button>
                                  </Space>
                                  <br />
                                </>
                              )}
                              options={contractDurations
                                .filter((item) => {
                                  // if(watch('hiringPricingType')?.id === 1 || watch('hiringPricingType')?.id === 7)  return item?.value !== "-1" && item?.value !== "Indefinite"
                                  // return item?.value !== "-1"
                                  if (watch("availability")?.id === 4) {
                                    return item.value !== "Indefinite";
                                  }
                                  return true;
                                })
                                .map((item) => ({
                                  id: item.id,
                                  label: item.text,
                                  value: item.value,
                                }))}
                              controlledValue={contractDurationValue}
                              setControlledValue={setContractDuration}
                              isControlled={true}
                              setValue={setValue}
                              register={register}
                              label={"Contract Duration (in months)"}
                              defaultValue="Ex: 3,6,12..."
                              inputRef={inputRef}
                              addItem={addItem}
                              mode={"id/value"}
                              onNameChange={onNameChange}
                              name="contractDuration"
                              isError={
                                errors["contractDuration"] &&
                                errors["contractDuration"]
                              }
                              required={
                                companyType?.id === 2
                                  ? watch("availability")?.id !== 2 ||
                                    watch("tempProject")?.value === true
                                  : false
                              }
                              errorMsg={
                                "Please select hiring request contract duration"
                              }
                              // disabled={isHRDirectPlacement}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {companyType?.id === 1 && (
                    <>
                      {watch("availability")?.id && (
                        <div className={HRFieldStyle.colMd6}>
                          <div className={HRFieldStyle.formGroup}>
                            <HRSelectField
                              controlledValue={controlledHiringPricingTypeValue}
                              setControlledValue={(val) => {
                                setControlledHiringPricingTypeValue(val);
                                let precentage = hrPricingTypes.find(
                                  (item) =>
                                    item.id === watch("hiringPricingType")?.id
                                )?.pricingPercent;
                                resetField("contractDuration");
                                setContractDuration("");
                                resetField("payrollType");
                                setControlledPayrollTypeValue("Select payroll");
                                setValue("NRMargin", precentage);
                                setBudgetValueOnChange();
                              }}
                              isControlled={true}
                              mode={"id/value"}
                              setValue={setValue}
                              register={register}
                              // label={"Hiring Pricing Type"}
                              label={"Employment Type"}
                              defaultValue="Select Hiring Pricing"
                              options={getRequiredHRPricingType()}
                              name="hiringPricingType"
                              isError={
                                errors["hiringPricingType"] &&
                                errors["hiringPricingType"]
                              }
                              required
                              errorMsg={"Please select the Hiring Pricing."}
                            />
                          </div>
                        </div>
                      )}

                      {(watch("hiringPricingType")?.id === 1 ||
                        watch("hiringPricingType")?.id === 2 ||
                        watch("hiringPricingType")?.id === 4 ||
                        watch("hiringPricingType")?.id === 5 ||
                        watch("hiringPricingType")?.id === 7 ||
                        watch("hiringPricingType")?.id === 8) && (
                        <>
                          {/* {(watch('hiringPricingType')?.id !== 1) && 
                  <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      <HRSelectField
                        controlledValue={controlledTempProjectValue}
                        setControlledValue={setControlledTempProjectValue}
                        isControlled={true}
                        isControlledBoolean={true}
                        mode={"id/value"}
                        searchable={false}
                        setValue={setValue}
                        register={register}
                        label={"Is this Hiring need Temporary for any project?"}
                        defaultValue="Select"
                        options={tempProjects.map((item) => ({
                          id: item.id,
                          label: item.text,
                          value: item.value,
                        }))}
                        name="tempProject"
                        isError={errors["tempProject"] && errors["tempProject"]}
                        required={!isHRDirectPlacement}
                        errorMsg={"Please select."}
                      />
                    </div>
                  </div>} */}

                          <div className={HRFieldStyle.colMd6}>
                            <div className={HRFieldStyle.formGroup}>
                              <HRSelectField
                                key={"contract Duration for Hirying Prysing"}
                                dropdownRender={(menu) => (
                                  <>
                                    {menu}
                                    <Divider style={{ margin: "8px 0" }} />
                                    <Space style={{ padding: "0 8px 4px" }}>
                                      <label>Other:</label>
                                      <input
                                        type={InputType.NUMBER}
                                        className={HRFieldStyle.addSalesItem}
                                        placeholder="Ex: 5,6,7..."
                                        ref={inputRef}
                                        value={name}
                                        onChange={onNameChange}
                                        required
                                      />
                                      <Button
                                        style={{
                                          backgroundColor: `var(--uplers-grey)`,
                                        }}
                                        shape="round"
                                        type="text"
                                        icon={<PlusOutlined />}
                                        onClick={addItem}
                                        disabled={
                                          name
                                            ? contractDurations.filter(
                                                (duration) =>
                                                  duration.value == name
                                              ).length > 0
                                            : true
                                        }
                                      >
                                        Add item
                                      </Button>
                                    </Space>
                                    <br />
                                  </>
                                )}
                                options={contractDurations
                                  .filter((item) => {
                                    if (
                                      watch("hiringPricingType")?.id === 1 ||
                                      watch("hiringPricingType")?.id === 7
                                    )
                                      return (
                                        item?.value !== "-1" &&
                                        item?.value !== "Indefinite"
                                      );
                                    return item?.value !== "-1";
                                  })
                                  .map((item) => ({
                                    id: item.id,
                                    label: item.text,
                                    value: item.value,
                                  }))}
                                controlledValue={contractDurationValue}
                                setControlledValue={setContractDuration}
                                isControlled={true}
                                setValue={setValue}
                                register={register}
                                label={"Contract Duration (in months)"}
                                defaultValue="Ex: 3,6,12..."
                                inputRef={inputRef}
                                addItem={addItem}
                                mode={"id/value"}
                                onNameChange={onNameChange}
                                name="contractDuration"
                                isError={
                                  errors["contractDuration"] &&
                                  errors["contractDuration"]
                                }
                                required={
                                  watch("hiringPricingType")?.id === 1 ||
                                  watch("hiringPricingType")?.id === 2 ||
                                  watch("hiringPricingType")?.id === 4 ||
                                  watch("hiringPricingType")?.id === 5 ||
                                  watch("hiringPricingType")?.id === 7 ||
                                  watch("hiringPricingType")?.id === 8
                                    ? true
                                    : false
                                }
                                errorMsg={
                                  "Please select hiring request contract duration"
                                }
                                // disabled={isHRDirectPlacement}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {(watch("hiringPricingType")?.id === 3 ||
                        watch("hiringPricingType")?.id === 6) && (
                        <>
                          <div className={HRFieldStyle.colMd6}>
                            <div className={HRFieldStyle.formGroup}>
                              <HRSelectField
                                controlledValue={controlledPayrollTypeValue}
                                setControlledValue={(val) => {
                                  setControlledPayrollTypeValue(val);
                                  if (
                                    val ==
                                    "I will pay on contract via payment services"
                                  ) {
                                    register("contractDuration", {
                                      required: true,
                                    });
                                  }
                                }}
                                isControlled={true}
                                mode={"id/value"}
                                setValue={setValue}
                                register={register}
                                label={"Who will manage the payroll?"}
                                defaultValue="Select payroll"
                                options={payRollTypes}
                                name="payrollType"
                                isError={
                                  errors["payrollType"] && errors["payrollType"]
                                }
                                required={
                                  watch("hiringPricingType")?.id === 3 ||
                                  watch("hiringPricingType")?.id === 6
                                    ? true
                                    : false
                                }
                                errorMsg={"Please select Payroll Type."}
                              />
                            </div>
                          </div>

                          {watch("payrollType")?.id === 4 && (
                            <div className={HRFieldStyle.colMd6}>
                              <div className={HRFieldStyle.formGroup}>
                                <HRSelectField
                                  key={"contract Duration for Payroll"}
                                  dropdownRender={(menu) => (
                                    <>
                                      {menu}
                                      <Divider style={{ margin: "8px 0" }} />
                                      <Space style={{ padding: "0 8px 4px" }}>
                                        <label>Other:</label>
                                        <input
                                          type={InputType.NUMBER}
                                          className={HRFieldStyle.addSalesItem}
                                          placeholder="Ex: 5,6,7..."
                                          ref={inputRef}
                                          value={name}
                                          onChange={onNameChange}
                                          required
                                        />
                                        <Button
                                          style={{
                                            backgroundColor: `var(--uplers-grey)`,
                                          }}
                                          shape="round"
                                          type="text"
                                          icon={<PlusOutlined />}
                                          onClick={addItem}
                                          disabled={
                                            name
                                              ? contractDurations.filter(
                                                  (duration) =>
                                                    duration.value == name
                                                ).length > 0
                                              : true
                                          }
                                        >
                                          Add item
                                        </Button>
                                      </Space>
                                      <br />
                                    </>
                                  )}
                                  options={contractDurations
                                    .filter((item) => {
                                      if (
                                        watch("hiringPricingType")?.id === 1 ||
                                        watch("hiringPricingType")?.id === 7
                                      )
                                        return (
                                          item?.value !== "-1" &&
                                          item?.value !== "Indefinite"
                                        );
                                      return item?.value !== "-1";
                                    })
                                    .map((item) => ({
                                      id: item.id,
                                      label: item.text,
                                      value: item.value,
                                    }))}
                                  controlledValue={contractDurationValue}
                                  setControlledValue={setContractDuration}
                                  isControlled={true}
                                  setValue={setValue}
                                  register={register}
                                  label={"Contract Duration (in months)"}
                                  defaultValue="Ex: 3,6,12..."
                                  inputRef={inputRef}
                                  addItem={addItem}
                                  mode={"id/value"}
                                  onNameChange={onNameChange}
                                  name="contractDuration"
                                  isError={
                                    errors["contractDuration"] &&
                                    errors["contractDuration"]
                                  }
                                  required={watch("payrollType")?.id === 4}
                                  errorMsg={
                                    "Please select hiring request contract duration"
                                  }
                                  // disabled={isHRDirectPlacement}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {watch("payrollType")?.id === 3 && (
                        <div className={HRFieldStyle.colMd6}>
                          <div className={HRFieldStyle.formGroup}>
                            <HRInputField
                              register={register}
                              errors={errors}
                              validationSchema={{
                                required: "please enter payroll partner name.",
                              }}
                              label="Payroll Partner Name"
                              name="payrollPartnerName"
                              type={InputType.TEXT}
                              placeholder="Enter the Payroll partner name"
                              required={watch("payrollType")?.id === 3}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className={HRFieldStyle.row}>
                  {companyType?.id === 1 && (
                    <div className={HRFieldStyle.colMd6}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        validationSchema={{
                          required: "please enter the Uplers Fees %.",
                          min: {
                            value: 1,
                            message: "Uplers Fees % can not be 0",
                          },
                          max: {
                            value: 100,
                            message: "Uplers Fees % can not be more then 100",
                          },
                        }}
                        label="Uplers Fees %"
                        name="NRMargin"
                        type={InputType.NUMBER}
                        placeholder="Select Uplers Fees %"
                        required
                      />
                    </div>
                  )}

                  {/* {isHRDirectPlacement ? (
                  <div className={HRFieldStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      validationSchema={{
                        required: "please enter the DP Percentage.",
                      }}
                      label="DP Percentage"
                      name="dpPercentage"
                      type={InputType.NUMBER}
                      placeholder="Enter the DP Percentage"
                      required={isHRDirectPlacement}
                    />
                  </div>
                ) : (
                  <div className={HRFieldStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      validationSchema={{
                        required: "please enter the Uplers Fees %.",
                        min:{value:1,message:"Uplers Fees % can not be 0"},
                        max:{value:100,message:"Uplers Fees % can not be more then 100"}
                      }}
                      label="Uplers Fees %"
                      name="NRMargin"
                      type={InputType.NUMBER}
                      placeholder="Select Uplers Fees %"
                      required={!isHRDirectPlacement}
                    />
                  </div>
                )} */}

                  <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      <HRSelectField
                        controlledValue={controlledCurrencyValue}
                        setControlledValue={setControlledCurrencyValue}
                        isControlled={true}
                        mode={"id/value"}
                        searchable={true}
                        setValue={setValue}
                        register={register}
                        label={"Currency"}
                        defaultValue="Select Currency"
                        options={currency && currency}
                        name="currency"
                        isError={errors["currency"] && errors["currency"]}
                        required
                        errorMsg={"Please select currency"}
                      />
                    </div>
                  </div>

                  {/* {!isHRDirectPlacement ? (
                  <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      <HRSelectField
                        controlledValue={controlledTempProjectValue}
                        setControlledValue={setControlledTempProjectValue}
                        isControlled={true}
                        isControlledBoolean={true}
                        mode={"id/value"}
                        searchable={false}
                        setValue={setValue}
                        register={register}
                        label={"Is this Hiring need Temporary for any project?"}
                        defaultValue="Select"
                        options={tempProjects.map((item) => ({
                          id: item.id,
                          label: item.text,
                          value: item.value,
                        }))}
                        name="tempProject"
                        isError={errors["tempProject"] && errors["tempProject"]}
                        required={!isHRDirectPlacement}
                        errorMsg={"Please select."}
                      />
                    </div>
                  </div>
                ) : null} */}

                  {/* <div className={HRFieldStyle.colMd6}>
							<div className={HRFieldStyle.formGroup}>
								{/* <HRSelectField
                                    mode={'id/value'}
                                    searchable={false}
                                    setValue={setValue}
                                    register={register}
                                    label={'Mode of Working?'}
                                    defaultValue="Select working mode"
                                    options={workingMode && workingMode}
                                    name="workingMode"
                                    isError={errors['workingMode'] && errors['workingMode']}
                                    required
                                    errorMsg={'Please select the working mode.'}
                                /> 
								*/}
                  {/* <HRSelectField
									controlledValue={controlledWorkingValue}
									setControlledValue={setControlledWorkingValue}
									isControlled={true}
									mode={'id/value'}
									searchable={false}
									setValue={setValue}
									register={register}
									label={'Mode of Working?'}
									defaultValue="Select working mode"
									options={workingMode && workingMode}
									name="workingMode"
									isError={errors['workingMode'] && errors['workingMode']}
									required
									errorMsg={'Please select the working mode.'}
								/>
							</div>
						</div> */}
                </div>

                <div className={HRFieldStyle.row}>
                  <div className={HRFieldStyle.colMd4}>
                    <div className={HRFieldStyle.formGroup}>
                      <HRSelectField
                        controlledValue={controlledBudgetValue}
                        setControlledValue={setControlledBudgetValue}
                        isControlled={true}
                        setValue={setValue}
                        register={register}
                        label={`${
                          isGUID
                            ? "Add your talent salary budget (Annum)"
                            : "Add your client estimated budget (Monthly)"
                        } `}
                        // label={`Add your estimated ${typeOfPricing === 1 || companyType?.id=== 2 ? "salary ":''}budget (Monthly)`}
                        options={budgets.map((item) => ({
                          id: item.id,
                          label: item.text,
                          value: item.value,
                        }))}
                        name="budget"
                        isError={errors["budget"] && errors["budget"]}
                        required
                        mode={"id/value"}
                        errorMsg={"Please select hiring request budget"}
                      />
                    </div>
                  </div>
                  <div className={HRFieldStyle.colMd4}>
                    <HRInputField
                      label={`${
                        isGUID
                          ? "Talent Salary Estimated Budget (Annum)"
                          : "Client Estimated Budget (Monthly)"
                      }`}
                      register={register}
                      name="adhocBudgetCost"
                      type={InputType.NUMBER}
                      placeholder="Adhoc- Ex: 2300, 2000"
                      required={watch("budget")?.value === "1"}
                      errors={errors}
                      validationSchema={{
                        required: "please enter the Adhoc Budget.",
                        // min: {
                        //   value: 1,
                        //   message: `please don't enter the value less than 1`,
                        // },
                        min: {
                          value: isFreshersAllowed
                            ? 1
                            : watch("availability")?.value === "Full Time" ||
                              watch("availability")?.value === "Contract" ||
                              watch("availability")?.value ===
                                "Contract to Hire"
                            ? watch("currency")?.value === "INR"
                              ? 100000
                              : 1000
                            : 1,
                          message: `please enter the value ${
                            watch("availability")?.value === "Full Time" ||
                            watch("availability")?.value === "Contract" ||
                            watch("availability")?.value === "Contract to Hire"
                              ? watch("currency")?.value === "INR"
                                ? "atlest 6 digits"
                                : "atlest 4 digits"
                              : `atlest 1`
                          }`,
                        },
                      }}
                      disabled={watch("budget")?.value !== "1"}
                    />
                  </div>
                  <div className={HRFieldStyle.colMd4}>
                    <HRInputField
                      label={`${
                        isGUID
                          ? "Talent Salary Estimated Minimum Budget (Annum)"
                          : "Client Estimated Minimum Budget (Monthly)"
                      }`}
                      register={register}
                      name="minimumBudget"
                      type={InputType.NUMBER}
                      placeholder="Minimum- Ex: 2300, 2000"
                      required={watch("budget")?.value === "2"}
                      errors={errors}
                      validationSchema={{
                        required: "please enter the minimum budget.",
                        min: {
                          value: isFreshersAllowed
                            ? 1
                            : watch("availability")?.value === "Full Time" ||
                              watch("availability")?.value === "Contract" ||
                              watch("availability")?.value ===
                                "Contract to Hire"
                            ? watch("currency")?.value === "INR"
                              ? 100000
                              : 1000
                            : 1,
                          message: `please enter the value ${
                            watch("availability")?.value === "Full Time" ||
                            watch("availability")?.value === "Contract" ||
                            watch("availability")?.value === "Contract to Hire"
                              ? watch("currency")?.value === "INR"
                                ? "atlest 6 digits"
                                : "atlest 4 digits"
                              : `atlest 1`
                          }`,
                        },
                      }}
                      disabled={watch("budget")?.value !== "2"}
                    />
                  </div>

                  <div className={HRFieldStyle.colMd4}>
                    <HRInputField
                      label={`${
                        isGUID
                          ? "Talent Salary Estimated Maximum Budget (Annum)"
                          : "Client Estimated Maximum Budget (Monthly)"
                      }`}
                      register={register}
                      name="maximumBudget"
                      type={InputType.NUMBER}
                      placeholder="Maximum- Ex: 2300, 2000"
                      required={watch("budget")?.value === "2"}
                      errors={errors}
                      validationSchema={{
                        required: "please enter the maximum budget.",
                        // min: {
                        //   value: watch("minimumBudget"),
                        //   message: "Budget should be more than minimum budget.",
                        // },
                        min: {
                          value: getValueForMaxBudget(),
                          message: getMessForMaxBudget(),
                        },
                      }}
                      disabled={watch("budget")?.value !== "2"}
                    />
                  </div>

                  {companyType?.id === 1 && (
                    <>
                      {watch("budget")?.value !== "3" && (
                        <>
                          <div className={HRFieldStyle.colMd4}>
                            <HRInputField
                              label={
                                watch("budget")?.value === "2"
                                  ? `Estimated Uplers Fees ( Min - Max) ${
                                      watch("hiringPricingType")?.id === 3 ||
                                      watch("hiringPricingType")?.id === 6
                                        ? "(Annum)"
                                        : "(Monthly)"
                                    }`
                                  : `Estimated Uplers Fees ${
                                      watch("hiringPricingType")?.id === 3 ||
                                      watch("hiringPricingType")?.id === 6
                                        ? "(Annum)"
                                        : "(Monthly)"
                                    }`
                              }
                              register={register}
                              name="uplersFees"
                              type={InputType.TEXT}
                              placeholder="Maximum- Ex: 2300"
                              disabled={true}
                            />
                          </div>

                          {!(
                            watch("hiringPricingType")?.id === 3 ||
                            watch("hiringPricingType")?.id === 6
                          ) &&
                            isGUID && (
                              <div className={HRFieldStyle.colMd4}>
                                <HRInputField
                                  label={
                                    typeOfPricing === 0
                                      ? watch("budget")?.value === "2"
                                        ? "Talent Estimated Pay ( Min -Max )"
                                        : "Talent Estimated Pay"
                                      : watch("budget")?.value === "2"
                                      ? "Estimated Client needs to pay ( Min - Max )"
                                      : "Estimated Client needs to pay"
                                  }
                                  register={register}
                                  name="needToPay"
                                  type={InputType.TEXT}
                                  placeholder="Maximum- Ex: 2300"
                                  disabled={true}
                                />
                              </div>
                            )}

                          {!isGUID && (
                            <div className={HRFieldStyle.colMd4}>
                              <HRInputField
                                label={`Estimated Salary Budget(${
                                  isGUID ? "Annum" : "Monthly"
                                })`}
                                register={register}
                                name="needToPay"
                                type={InputType.TEXT}
                                placeholder="Maximum- Ex: 2300"
                                disabled={true}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className={HRFieldStyle.row}>
                  <div
                    className={HRFieldStyle.colMd6}
                    style={{ paddingBottom: "20px" }}
                  >
                    <Checkbox
                      checked={isBudgetConfidential}
                      onClick={() => setIsBudgetConfidentil((prev) => !prev)}
                    >
                      Keep my budget confidential
                    </Checkbox>

                    <Tooltip
                      overlayStyle={{ minWidth: "650px" }}
                      placement="right"
                      title={
                        "Please provide actual salary ranges for job matching purposes. This information remains confidential to the talents and helps us connect you with suitable candidates."
                      }
                    >
                      <img
                        src={infoIcon}
                        alt="info"
                        style={{ cursor: "pointer" }}
                      />
                    </Tooltip>
                  </div>
                </div>

                <div className={HRFieldStyle.row}>
                  <div className={HRFieldStyle.colMd12}>
                    <div className={HRFieldStyle.labelForSelect}>
                      Compensation options
                    </div>
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      value={CompensationValues}
                      options={compensationOptions}
                      onChange={(values, _) => setCompensationValues(values)}
                      placeholder="Select Compensation"
                      tokenSeparators={[","]}
                    />

                    <ul className={HRFieldStyle.selectFieldBox}>
                      {compensationOptions?.map(
                        (option) =>
                          !CompensationValues?.some(
                            (val) => val === option.value
                          ) && (
                            <li
                              key={option.value}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setCompensationValues([
                                  ...CompensationValues,
                                  option?.value,
                                ])
                              }
                            >
                              <span>
                                {option.label}{" "}
                                <img
                                  src={plusSkill}
                                  loading="lazy"
                                  alt="star"
                                />
                              </span>
                            </li>
                          )
                      )}
                      {/* {compensationOptions?.map((skill) => (																	
											<li key={skill.value} onClick={() => console.log(skill)}><span>{skill.value}<img src={plusSkill} loading="lazy" alt="star" /></span></li>
										))}	 */}
                    </ul>
                  </div>
                </div>

                <div className={HRFieldStyle.row}>
                  <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      {/* <HRSelectField
									controlledValue={controlledRoleValue}
									setControlledValue={setControlledRoleValue}
									isControlled={true}
									mode={'id/value'}
									searchable={true}
									setValue={setValue}
									register={register}
									label={'Hiring Request Role'}
									options={talentRole && talentRole}
									name="role"
									isError={errors['role'] && errors['role']}
									required
									errorMsg={'Please select hiring request role'}
								/> */}
                      <HRSelectField
                        controlledValue={controlledWorkingValue}
                        setControlledValue={(val) => {
                          setControlledWorkingValue(val);
                          if (val !== WorkingMode.HYBRID) {
                            unregister("officeVisits");
                          }
                          resetField("location");
                          resetField("officeVisits");
                          setControlledFrequencyValue("Select");
                          setIsRelocate(false);
                          setLocationSelectValidation(false)
                          setNearByCitesValues([]);
                          setNearByCitiesData([]);
                        }}
                        isControlled={true}
                        mode={"id/value"}
                        searchable={false}
                        setValue={setValue}
                        register={register}
                        label={"Mode of Working?"}
                        defaultValue="Select working mode"
                        options={workingMode && workingMode}
                        name="workingMode"
                        isError={errors["workingMode"] && errors["workingMode"]}
                        required
                        errorMsg={"Please select the working mode."}
                      />
                    </div>
                  </div>
                </div>
                {getWorkingModelFields()}
                {/* {watch('role')?.id === -1 && (
						<div className={HRFieldStyle.row}>
							<div className={HRFieldStyle.colMd12}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the other role.',
										pattern: {
											value: /^((?!other).)*$/,
											message: 'Please remove "other" keyword.',
										},
									}}
									label="Other Role"
									name="otherRole"
									type={InputType.TEXT}
									placeholder="Enter Other role"
									maxLength={50}
									required
								/>
							</div>
						</div>
					)} */}
                {/* <div className={HRFieldStyle.row}>
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
					</div> */}
                <div className={`${HRFieldStyle.row} ${HRFieldStyle.fieldOr}`}>
                  <div className={HRFieldStyle.colMd12}>
                    {!getUploadFileData ? (
                      <HRInputField
                        disabled={jdURLLink}
                        register={register}
                        leadingIcon={<UploadSVG />}
                        label="Job Description"
                        name="jdExport"
                        type={InputType.BUTTON}
                        buttonLabel="Upload JD File"
                        setValue={setValue}
                        required={!jdURLLink && !getUploadFileData}
                        onClickHandler={() => setUploadModal(true)}
                        validationSchema={{
                          required: "please select a file.",
                        }}
                        errors={errors}
                      />
                    ) : (
                      <div className={HRFieldStyle.uploadedJDWrap}>
                        <label>Job Description *</label>
                        <div className={HRFieldStyle.uploadedJDName}>
                          {getUploadFileData}{" "}
                          <CloseSVG
                            className={HRFieldStyle.uploadedJDClose}
                            onClick={() => {
                              // setJDParsedSkills({});
                              setUploadFileData("");
                              setValue("jdExport", "");
                            }}
                          />
                        </div>
                        {getHRdetails.addHiringRequest.jdfilename && (
                          <span style={{ fontWeight: "500" }}>
                            <a
                              rel="noreferrer"
                              href={
                                NetworkInfo.PROTOCOL +
                                NetworkInfo.DOMAIN +
                                "Media/JDParsing/JDfiles/" +
                                getHRdetails.addHiringRequest.jdfilename
                              }
                              style={{ textDecoration: "underline" }}
                              target="_blank"
                            >
                              {getHRdetails.addHiringRequest.jdfilename}
                            </a>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <UploadModal
                    isLoading={isLoading}
                    uploadFileRef={uploadFile}
                    uploadFileHandler={(e) =>
                      uploadFileHandler(e.target.files[0])
                    }
                    // googleDriveFileUploader={() => googleDriveFileUploader()}
                    // uploadFileFromGoogleDriveLink={uploadFileFromGoogleDriveLink}
                    modalTitle={"Upload JD"}
                    isFooter={false}
                    modalSubtitle={"Job Description"}
                    openModal={showUploadModal}
                    setUploadModal={setUploadModal}
                    cancelModal={() => setUploadModal(false)}
                    setValidation={setValidation}
                    getValidation={getValidation}
                    // getGoogleDriveLink={getGoogleDriveLink}
                    // setGoogleDriveLink={setGoogleDriveLink}
                    setUploadFileData={setUploadFileData}
                  />
                  {/* <div className={HRFieldStyle.orLabel}>OR</div>
                <div className={HRFieldStyle.colMd6}>
                  <HRInputField
                    onChangeHandler={(e) => toggleJDHandler(e)}
                    disabled={getUploadFileData}
                    label="Job Description URL"
                    name="jdURL"
                    type={InputType.TEXT}
                    placeholder="Add JD link"
                    register={register}
                    errors={errors}
                    required={!getUploadFileData}
                    onBlurHandler={(e) => onHandleFocusOut(e)}
                    validationSchema={
                      {
                        // pattern: {
                        //     value: URLRegEx.url,
                        //     message: 'Entered value does not match url format',
                        // },
                      }
                    }
                  />
                </div> */}
                </div>

                {/* <div className={HRFieldStyle.row}>
                <div className={HRFieldStyle.colMd12}>
                  <div className={HRFieldStyle.checkBoxGroup}>
                    <Checkbox
                      checked={isHRDirectPlacement}
                      onClick={toggleHRDirectPlacement}
                    >
                      Is this HR a Direct Placement?
                    </Checkbox>
                  </div>
                </div>
              </div>
              <br /> */}

                <div className={HRFieldStyle.row}>
                  {/* <div className={HRFieldStyle.colMd6}>
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
						</div> */}

                  <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      {/* <HRSelectField
                                    setValue={setValue}
                                    register={register}
                                    label={'Sales Person'}
                                    defaultValue="Select sales Person"
                                    options={salesPerson && salesPerson}
                                    name="salesPerson"
                                    isError={errors['salesPerson'] && errors['salesPerson']}
                                    required
                                    errorMsg={'Please select hiring request sales person'}
                                /> */}
                      {/* <HRSelectField
                                    controlledValue={controlledSalesValue}
                                    setControlledValue={setControlledSalesValue}
                                    isControlled={true}
                                    setValue={setValue}
                                    mode={'id/value'}
                                    register={register}
                                    label={'Sales Person'}
                                    options={salesPerson && salesPerson}
                                    name="salesPerson"
                                    isError={errors['salesPerson'] && errors['salesPerson']}
                                    required
                                    errorMsg={'Please select hiring request sales person'}
                                /> */}
                    </div>
                  </div>
                </div>

                <div className={HRFieldStyle.row}>
                  {companyType?.id === 1 && (
                    <div className={HRFieldStyle.colMd4}>
                      {" "}
                      <div className={HRFieldStyle.formGroup}>
                        <HRSelectField
                          controlledValue={controlledDurationTypeValue}
                          setControlledValue={setControlledDurationTypeValue}
                          setValue={setValue}
                          isControlled={true}
                          register={register}
                          label={"Long Term/Short Term"}
                          options={getDurationType.map((item) => ({
                            id: item.id,
                            label: item.text,
                            value: item.value,
                          }))}
                          name="getDurationType"
                          mode={"id/value"}
                          isError={
                            errors["getDurationType"] &&
                            errors["getDurationType"]
                          }
                          required={!isHRDirectPlacement}
                          errorMsg={"Please select duration type"}
                          disabled={isHRDirectPlacement}
                        />
                      </div>
                    </div>
                  )}

                  <div
                    className={
                      companyType?.id === 1
                        ? HRFieldStyle.colMd4
                        : HRFieldStyle.colMd6
                    }
                  >
                    <div className={HRFieldStyle.formGroup}>
                      {/* <label>
                                    Required Experience
                                    <span className={HRFieldStyle.reqField}>*</span>
                                </label> */}
                      {/* <div className={HRFieldStyle.reqExperience}> */}
                      <HRInputField
                        required
                        label="Required Experience"
                        errors={errors}
                        onChangeHandler={(value) => {
                          let val = value.target.value;
                          if (val === "") {
                            setIsExpDisabled(false);
                            setIsFresherDisabled(false);
                            return;
                          }
                          if (val === "0") {
                            setIsFreshersAllowed(true);
                            setIsExpDisabled(true);
                            setIsFresherDisabled(false);
                          } else {
                            setIsFreshersAllowed(false);
                            setIsExpDisabled(false);
                            setIsFresherDisabled(true);
                          }
                        }}
                        validationSchema={{
                          required: "please enter the years.",
                          min: {
                            value: isFreshersAllowed ? 0 : 1,
                            message: `please don't enter the value less than ${
                              isFreshersAllowed ? 0 : 1
                            }`,
                          },
                          max: {
                            value: 60,
                            message:
                              "please don't enter the value more than 60",
                          },
                        }}
                        register={register}
                        name="years"
                        type={InputType.NUMBER}
                        placeholder="Enter years"
                        disabled={isExpDisabled}
                      />
                      {/* <HRInputField
                                        register={register}
                                        required
                                        errors={errors}
                                        validationSchema={{
                                            max: {
                                                value: 12,
                                                message: `please don't enter the value more than 12`,
                                            },
                                            min: {
                                                value: 0,
                                                message: `please don't enter the value less than 0`,
                                            },
                                        }}
                                        name="months"
                                        type={InputType.NUMBER}
                                        placeholder="Enter months"
                                    /> */}
                      {/* </div> */}
                    </div>
                  </div>

                  <div
                    className={
                      companyType?.id === 1
                        ? HRFieldStyle.colMd4
                        : HRFieldStyle.colMd6
                    }
                  >
                    <HRInputField
                      register={register}
                      errors={errors}
                      validationSchema={{
                        required: "please enter the number of talents.",
                        min: {
                          value: 1,
                          message: `please enter the value more than 0`,
                        },
                        max: {
                          value: 99,
                          message: "please don't enter the value more than 99",
                        },
                      }}
                      label="How many talents are needed."
                      name="talentsNumber"
                      type={InputType.NUMBER}
                      placeholder="Please enter number of talents needed"
                      required={
                        disabledFields !== null
                          ? !disabledFields?.talentRequired
                          : true
                      }
                      disabled={
                        disabledFields !== null
                          ? disabledFields?.talentRequired
                          : false
                      }
                    />
                  </div>
                </div>

                <div className={HRFieldStyle.row}>
                  <div
                    className={HRFieldStyle.colMd6}
                    style={{ paddingBottom: "20px" }}
                  >
                    <Checkbox
                      checked={isFreshersAllowed}
                      onClick={() => {
                        setIsFreshersAllowed((prev) => {
                          if (prev === false) {
                            setValue("years", 0);
                            setIsExpDisabled(true);
                          } else {
                            setIsExpDisabled(false);
                          }
                          return !prev;
                        });
                      }}
                      disabled={isFresherDisabled}
                    >
                      Freshers allowed
                    </Checkbox>
                  </div>
                </div>

                {/* {(watch("availability")?.value === "Part Time" && companyType.id === 1) && (
                <div className={HRFieldStyle.row}>
                    <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      <HRSelectField
                        controlledValue={controlledPartialEngagementValue}
                        setControlledValue={setControlledPartialEngagementValue}
                        isControlled={true}
                        mode={"id/value"}
                        setValue={setValue}
                        register={register}
                        label={"Partial Engagement Type"}
                        defaultValue="Select Partial Engagement Type"
                        options={partialEngagements.map((item) => ({
                          id: item.id,
                          label: item.text,
                          value: item.value,
                        }))}
                        name="partialEngagement"
                        isError={
                          errors["partialEngagement"] &&
                          errors["partialEngagement"]
                        }
                        required={watch("availability")?.value === "Part Time"}
                        errorMsg={"Please select partial engagement type."}
                      />
                    </div>
                  </div>
                  
                  <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        validationSchema={{
                          required: "please enter the number of working hours.",
                          min: {
                            value: 1,
                            message: `please enter the value more than 0`,
                          },
                        }}
                        label="No Of Working Hours"
                        name="workingHours"
                        type={InputType.NUMBER}
                        placeholder="Please enter no of working hours."
                        required={watch("availability")?.value === "Part Time"}
                      />
                    </div>
                  </div>
                </div>
              )} */}

                <div className={HRFieldStyle.row}>
                  {/*  <div className={HRFieldStyle.colMd6}>
                  <div className={HRFieldStyle.formGroup}>
                    <HRSelectField
                      controlledValue={controlledRegionValue}
                      setControlledValue={setControlledRegionValue}
                      isControlled={true}
                      mode={"id/value"}
                      setValue={setValue}
                      register={register}
                      label={"Select Region"}
                      defaultValue="Select Region"
                      options={region && region}
                      name="region"
                      isError={errors["region"] && errors["region"]}
                      required
                      errorMsg={"Please select the region."}
                    />
                  </div>
                </div>*/}
                  <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      <HRSelectField
                        controlledValue={controlledTimeZoneValue}
                        setControlledValue={setControlledTimeZoneValue}
                        isControlled={true}
                        mode={"id/value"}
                        searchable={true}
                        // disabled={_isNull(prefRegion)}
                        setValue={setValue}
                        register={register}
                        label={"Select Time Zone"}
                        defaultValue="Select time zone"
                        // options={timeZonePref}
                        options={timeZoneList}
                        name="timeZone"
                        isError={errors["timeZone"] && errors["timeZone"]}
                        required
                        errorMsg={"Please select hiring request time zone."}
                      />
                    </div>
                  </div>
                </div>

                <div className={HRFieldStyle.row}>
                  {/* <div className={HRFieldStyle.colMd6}>
                  <div className={HRFieldStyle.formGroup}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      disabled={
                        watch("region")?.value.includes("Overlapping")
                          ? false
                          : true
                      }
                      validationSchema={{
                        required: "please enter the number of talents.",
                        min: {
                          value: 1,
                          message: `please enter the value more than 0`,
                        },
                      }}
                      label="Overlapping Hours."
                      name="overlappingHours"
                      type={InputType.NUMBER}
                      placeholder="Please enter Overlapping Hours."
                      required={
                        watch("region")?.value.includes("Overlapping")
                          ? true
                          : false
                      }
                    />
                  </div>
                </div> */}

                  <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      <HRSelectField
                        controlledValue={controlledFromTimeValue}
                        setControlledValue={(val) => {
                          setControlledFromTimeValue(val);
                          let index = getStartEndTimes.findIndex(
                            (item) => item.value === val
                          );
                          if (index >= getStartEndTimes.length - 18) {
                            let newInd = index - (getStartEndTimes.length - 18);
                            let endtime = getStartEndTimes[newInd];
                            setControlledEndTimeValue(endtime.value);
                            setValue("endTime", {
                              id: "",
                              value: endtime.value,
                            });
                          } else {
                            let endtime = getStartEndTimes[index + 18];
                            setControlledEndTimeValue(endtime.value);
                            setValue("endTime", {
                              id: "",
                              value: endtime.value,
                            });
                          }
                        }}
                        isControlled={true}
                        mode={"id/value"}
                        // disabled={
                        //   watch("region")?.value.includes("Overlapping")
                        //     ? true
                        //     : false
                        // }
                        setValue={setValue}
                        register={register}
                        label={"From Time"}
                        searchable={true}
                        defaultValue="Select From Time"
                        options={getStartEndTimes.map((item) => ({
                          id: item.id,
                          label: item.text,
                          value: item.value,
                        }))}
                        name="fromTime"
                        isError={errors["fromTime"] && errors["fromTime"]}
                        required={true}
                        errorMsg={
                          errors["fromTime"]
                            ? errors["fromTime"].message
                            : "Please select from time."
                        }
                      />
                    </div>
                  </div>

                  <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      <HRSelectField
                        controlledValue={controlledEndTimeValue}
                        setControlledValue={setControlledEndTimeValue}
                        isControlled={true}
                        mode={"id/value"}
                        // disabled={
                        //   watch("region")?.value.includes("Overlapping")
                        //     ? true
                        //     : false
                        // }
                        setValue={setValue}
                        register={register}
                        label={"End Time"}
                        searchable={true}
                        defaultValue="Select End Time"
                        options={getStartEndTimes.map((item) => ({
                          id: item.id,
                          label: item.text,
                          value: item.value,
                        }))}
                        name="endTime"
                        isError={errors["endTime"] && errors["endTime"]}
                        required={true}
                        errorMsg={"Please select end time."}
                      />
                    </div>
                  </div>
                </div>

                <div className={HRFieldStyle.row}>
                  <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      <HRSelectField
                        controlledValue={controlledSoonValue}
                        setControlledValue={setControlledTimeSoonValue}
                        isControlled={true}
                        mode={"id/value"}
                        setValue={setValue}
                        register={register}
                        label={"How soon can they join?"}
                        defaultValue="Select how soon?"
                        options={howSoon}
                        name="howSoon"
                        isError={errors["howSoon"] && errors["howSoon"]}
                        required
                        errorMsg={"Please select the how soon."}
                      />
                    </div>
                  </div>
                  {/* {companyType?.id=== 1 && <> 
                 {(removeFields !== null && removeFields?.dealID === true) ? null :   <div className={HRFieldStyle.colMd6}>
                  <HRInputField
                    disabled={true}
                    register={register}
                    label="Deal ID"
                    name="dealID"
                    type={InputType.NUMBER}
                    placeholder="Enter ID"
                  />
                </div>}
                </>}              */}
                </div>

                {companyType?.id === 1 && (
                  <div className={HRFieldStyle.row}>
                    {removeFields !== null &&
                    removeFields?.hrFormLink === true ? null : (
                      <div className={HRFieldStyle.colMd6}>
                        <HRInputField
                          register={register}
                          errors={errors}
                          validationSchema={{
                            required: "please enter the HR form link.",
                          }}
                          label="HR Form Link"
                          name="bqFormLink"
                          type={InputType.TEXT}
                          placeholder="Enter the link for HR form"
                          required={isGUID === null}
                        />
                      </div>
                    )}

                    {removeFields !== null &&
                    removeFields?.discoveryCallLink === true ? null : (
                      <div className={HRFieldStyle.colMd6}>
                        <HRInputField
                          register={register}
                          errors={errors}
                          validationSchema={{
                            required: "please enter the discovery call link.",
                          }}
                          label="Discovery Call Link"
                          name="discoveryCallLink"
                          type={InputType.TEXT}
                          placeholder="Enter the link for Discovery call"
                          required={isGUID === null}
                        />
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            <Divider />
            <div className={HRFieldStyle.partOne}>
              <div className={HRFieldStyle.hrFieldLeftPane}>
                <h3>Enhance Talent Matchmaking</h3>
                <p>
                  This information will not be visible to the talents or on job
                  board, but will be used by the system/internal team to find
                  more accurate match for this HR/Job.
                </p>
              </div>

              <form id="hrForm" className={HRFieldStyle.hrFieldRightPane}>
                <div className={HRFieldStyle.row}>
                  <div className={HRFieldStyle.colMd12}>
                    {/* <HRSelectField
									// isControlled={true}
									// controlledValue={controlledGoodToHave}
									// setControlledValue={setControlledGoodToHave}
									// mode="multiple"
									mode="tags"
									setValue={setValue}
									register={register}
									label={'Specify the industry from which the client needs talents'}
									placeholder="Type skills"
									// onChange={setSelectGoodToHaveItems}
									options={[]}
									// setOptions={setSkillMemo}
									name="compensationOptions"
									// isError={errors['goodToHaveSkills'] && errors['goodToHaveSkills']}
									// required
									// errorMsg={'Please select Compensation options.'}
								/> */}
                    <div className={HRFieldStyle.labelForSelect}>
                      Specify the industry from which the client needs talents
                    </div>
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      value={specificIndustry}
                      onChange={(values, _) => setSpecificIndustry(values)}
                      options={industryOptions}
                      placeholder="Select Industry"
                      tokenSeparators={[","]}
                    />
                    <ul className={HRFieldStyle.selectFieldBox}>
                      {industryOptions?.map(
                        (option) =>
                          !specificIndustry?.some(
                            (val) => val === option.value
                          ) && (
                            <li
                              key={option.value}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setSpecificIndustry([
                                  ...specificIndustry,
                                  option?.value,
                                ])
                              }
                            >
                              <span>
                                {option.label}{" "}
                                <img
                                  src={plusSkill}
                                  loading="lazy"
                                  alt="star"
                                />
                              </span>
                            </li>
                          )
                      )}
                      {/* {compensationOptions?.map((skill) => (																	
											<li key={skill.value} onClick={() => console.log(skill)}><span>{skill.value}<img src={plusSkill} loading="lazy" alt="star" /></span></li>
										))}	 */}
                    </ul>
                  </div>

                  <div className={HRFieldStyle.colMd12}>
                    <div className={HRFieldStyle.formGroup}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>
                          Does the client require a talent with people
                          management experience?
                        </label>
                        <Radio.Group
                          // defaultValue={'client'}
                          // className={allengagementReplceTalentStyles.radioGroup}
                          onChange={(e) => {
                            setHasPeopleManagementExp(e.target.value);
                          }}
                          value={peopleManagemantexp}
                        >
                          <Radio value={1}>Yes</Radio>
                          <Radio value={0}>No</Radio>
                        </Radio.Group>
                      </div>
                    </div>
                  </div>

                  <div className={HRFieldStyle.colMd12}>
                    <div
                      className={`${HRFieldStyle.formGroup} ${HRFieldStyle.customPlaceHolderHR} customPlaceHolder`}
                    >
                      <label>
                        Highlight any key parameters or things to consider for
                        finding the best match talents
                        {/* <span className={HRFieldStyle.reqField}>*</span> */}
                      </label>
                      {isEmptyOrWhitespace(
                        watch("parametersHighlight")
                          ? watch("parametersHighlight")
                          : ""
                      ) && (
                        <div className="placeHolderText">
                          <p>Ex:</p>
                          <ul>
                            <li>
                              Seeking candidates with startup experience,
                              preferably from a fast-paced and agile
                              environment.
                            </li>
                            <li>
                              Targeting candidates with a background from
                              [Specific Company Name], where they developed
                              [Desirable Skills or Experience]
                            </li>
                            <li>
                              Looking for candidates who have hands-on
                              experience working with [Specific Tech
                              Environment, e.g. cloud-native, DevOps, etc.],
                              preferably in a similar industry/sector.
                            </li>
                          </ul>
                        </div>
                      )}
                      <ReactQuill
                        register={register}
                        setValue={setValue}
                        theme="snow"
                        className="heightSize"
                        value={watch("parametersHighlight")}
                        name="parametersHighlight"
                        onChange={(val) => setValue("parametersHighlight", val)}
                      />
                      {/* <HRInputField
                      register={register}
                      errors={errors}
                      isTextArea={true}
                      rows={4}
                      label="Highlight any key parameters or things to consider for finding the best match talents"
                      name="parametersHighlight"
                      type={InputType.Text}
                      placeholder="Ex: Need male candidates only, need candidates who have worked on enterprise softwares, need candidates
who have worked in scaled start ups."
                      // required={watch("availability")?.value === "Part Time"}
                    
                    /> */}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            {/* <AddInterviewer
				errors={errors}
				append={append}
				remove={remove}
				register={register}
				fields={fields}
			/> */}

            {companyType.id === 2 && (
              <>
                <Divider />

                <div className={HRFieldStyle.partOne}>
                  <div className={HRFieldStyle.hrFieldLeftPane}>
                    <h3>Hiring Team</h3>
                  </div>

                  <form id="hrForm" className={HRFieldStyle.hrFieldRightPane}>
                    <div className={HRFieldStyle.row}>
                      <div className={HRFieldStyle.colMd12}>
                        <HRSelectField
                          isControlled={true}
                          controlledValue={controlledPocValue}
                          setControlledValue={(val) => {
                            setControlledPocValue((prev) => {
                              if(prev === undefined){
                                const iToAdd = activeUserDataList.find(
                                  (user) => user.contactId === val[0].id
                                );
                                const poctoadd = {
                                  hiringRequestId:
                                    getHRdetails?.addHiringRequest?.id,
                                  hrwiseContactId: iToAdd?.contactId,
                                  guid: "",
                                  fullName: iToAdd.contactName,
                                  emailID: iToAdd.emailId,
                                  contactNo: iToAdd.contactNumber,
                                  showEmailToTalent: false,
                                  showContactNumberToTalent: false,
                                  isDefaultUser: false,
                                  iInfoMsg: "",
                                };
                                setJobPostUsersDetails([
                                  poctoadd
                                ]);
                                return val;
                              }
                              if (prev.length > val.length) {
                                // remove item
                                const notInA2 = prev.filter(
                                  (item1) =>
                                    !val.some((item2) => item2.id === item1.id)
                                );
                                if (
                                  notInA2[0].id ===
                                  getHRdetails?.addHiringRequest?.contactId
                                ) {
                                  message.error(
                                    "Default POC can not be removed"
                                  );
                                  return prev;
                                }
                                setJobPostUsersDetails((prevItem) =>
                                  prevItem.filter(
                                    (it) => it.hrwiseContactId !== notInA2[0].id
                                  )
                                );
                              } else {
                                // added item
                                const notInA2 = val.filter(
                                  (item1) =>
                                    !prev.some((item2) => item2.id === item1.id)
                                );
                                const iToAdd = activeUserDataList.find(
                                  (user) => user.contactId === notInA2[0].id
                                );
                                const poctoadd = {
                                  hiringRequestId:
                                    getHRdetails?.addHiringRequest?.id,
                                  hrwiseContactId: iToAdd?.contactId,
                                  guid: "",
                                  fullName: iToAdd.contactName,
                                  emailID: iToAdd.emailId,
                                  contactNo: iToAdd.contactNumber,
                                  showEmailToTalent: false,
                                  showContactNumberToTalent: false,
                                  isDefaultUser: false,
                                  iInfoMsg: "",
                                };
                                setJobPostUsersDetails((prevItem) => [
                                  ...prevItem,
                                  poctoadd,
                                ]);
                              }
                              return val;
                            });
                          }}
                          mode="multiple"
                          setValue={setValue}
                          register={register}
                          label={"Assign users to this job post"}
                          placeholder="Select Users"
                          // onChange={setSelectGoodToHaveItems}
                          options={activeUserData}
                          // setOptions={setSkillMemo}
                          name="jobPostUsers"
                          // isError={errors['goodToHaveSkills'] && errors['goodToHaveSkills']}
                          // required
                          // errorMsg={'Please select Compensation options.'}
                        />
                      </div>

                      {/* <div className={HRFieldStyle.colMd12}>
                        <Checkbox
                          checked={showHRPOCDetailsToTalents}
                          onClick={(e) =>
                            setshowHRPOCDetailsToTalents(e.target.checked)
                          }
                        >
                          <span>Show user information to talent</span>{" "}
                          (Candidates will be able to view the contact
                          information (email and phone number) of the selected
                          users)
                        </Checkbox>
                      </div> */}
                    </div>

                    <div
                      className={`${HRFieldStyle.row}  preShareDetailsBox hireTeamInfo`}
                      style={{marginTop:'10px'}}
                    >
                      {jobPostUsersDetails?.map((Val, index) => {
                        return (
                          <div
                            className="preShareDetailsItem"
                            key={index}
                            style={{ display: "flex", position: "relative" }}
                          >
                            {Val?.hrwiseContactId !==
                              getHRdetails?.addHiringRequest?.contactId && (
                              <div className="preShareDetailsAction">
                                <button
                                  className="preShareDetailsBtn"
                                  title="Delete"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setControlledPocValue((prev) =>
                                      prev.filter(
                                        (it) => it.id !== Val?.hrwiseContactId
                                      )
                                    );
                                    setJobPostUsersDetails((prevItem) =>
                                      prevItem.filter(
                                        (it) =>
                                          it.hrwiseContactId !==
                                          Val?.hrwiseContactId
                                      )
                                    );
                                    setValue(
                                      "jobPostUsers",
                                      watch("jobPostUsers").filter(
                                        (it) => it.id !== Val?.hrwiseContactId
                                      )
                                    );
                                  }}
                                >
                                  <img
                                    src={DeleteCircleIcon}
                                    alt="delete-icon"
                                  />
                                </button>
                              </div>
                            )}
                            <div className="thumbImages">
                              <Avatar
                                style={{
                                  width: "75px",
                                  height: "75px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                size="large"
                              >
                                {Val?.fullName?.substring(0, 2).toUpperCase()}
                              </Avatar>
                            </div>
                            <div className="preShareDetailsInfo">
                              <h4>
                                {Val?.fullName}{" "}
                                <span className="preShareToolTip">
                                  {Val?.hrwiseContactId ===
                                    getHRdetails?.addHiringRequest
                                      ?.contactId && (
                                    <Tooltip title="You cannot delete this user because this is the default user of this job post. You can choose to show or hide the information from the candidates using the checkbox below.">
                                      <img src={infoSmallIcon} alt="info" />
                                    </Tooltip>
                                  )}
                                </span>
                              </h4>
                              <ul>
                                <li>
                                  <div className="form-group justifyCenter">
                                    <i className="fieldIcon">
                                      <img src={MailIcon} alt="email-icon" />
                                    </i>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter email address"
                                      value={Val?.emailID}
                                      disabled
                                    />
                                    <Checkbox
                                      name="userShow"
                                      checked={Val?.showEmailToTalent}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          index,
                                          "showEmailToTalent",
                                          e.target.checked
                                        )
                                      }
                                    >
                                      Show email to candidates
                                    </Checkbox>
                                  </div>
                                </li>

                                <li>
                                  <div className="form-group justifyCenter">
                                    <i className="fieldIcon">
                                      <img src={PhoneIcon} alt="phone-icon" />
                                    </i>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter mobile number"
                                      value={Val?.contactNo}
                                      maxLength={10}
                                      onChange={(e) =>
                                        handleContactNoChange(
                                          index,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <Checkbox
                                      name="userShow"
                                      checked={Val?.contactNo?Val?.showContactNumberToTalent:false}
                                      disabled={Val?.contactNo ? false : true}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          index,
                                          "showContactNumberToTalent",
                                          e.target.checked
                                        )
                                      }
                                    >
                                      Show mobile number to candidates
                                    </Checkbox>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </form>
                </div>
              </>
            )}

            <Divider />

            <div className={HRFieldStyle.formPanelAction}>
              {!getHRdetails?.addHiringRequest?.isActive && (
                <button
                  style={{
                    cursor: type === SubmitType.SUBMIT ? "no-drop" : "pointer",
                  }}
                  disabled={type === SubmitType.SUBMIT}
                  className={HRFieldStyle.btn}
                  onClick={hrSubmitHandler}
                >
                  Save as Draft
                </button>
              )}

              <button
                onClick={handleSubmit(hrSubmitHandler)}
                className={HRFieldStyle.btnPrimary}
                disabled={isSavedLoading}
              >
                Edit HR
              </button>
            </div>

            {showGPTModal && (
              <Modal
                footer={false}
                title="GPT Response"
                open={showGPTModal}
                onCancel={() => {
                  setShowGPTModal(false);
                  setGPTFileDetails({});
                  setGPTDetails({});
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    // justifyContent: "center",
                    // alignItems: "center",
                  }}
                >
                  <div>
                    {gptDetails?.addHiringRequest?.noofTalents && (
                      <p>
                        NO of talents :{" "}
                        <b>{gptDetails?.addHiringRequest?.noofTalents}</b>
                      </p>
                    )}
                    {gptDetails?.addHiringRequest?.requestForTalent && (
                      <p>
                        Title/Role :{" "}
                        <b>{gptDetails?.addHiringRequest?.requestForTalent}</b>
                      </p>
                    )}
                    {gptDetails?.addHiringRequest?.availability && (
                      <p>
                        Availability :{" "}
                        <b>{gptDetails?.addHiringRequest?.availability}</b>
                      </p>
                    )}
                    {gptDetails?.salesHiringRequest_Details?.budgetFrom > 0 && (
                      <p>
                        Budget From :{" "}
                        <b>
                          {gptDetails?.salesHiringRequest_Details?.budgetFrom}
                        </b>
                      </p>
                    )}
                    {gptDetails?.salesHiringRequest_Details?.budgetTo > 0 && (
                      <p>
                        Budget To:{" "}
                        <b>
                          {gptDetails?.salesHiringRequest_Details?.budgetTo}
                        </b>
                      </p>
                    )}
                    {gptDetails?.salesHiringRequest_Details
                      ?.timeZoneFromTime && (
                      <p>
                        From Time :{" "}
                        <b>
                          {
                            gptDetails?.salesHiringRequest_Details
                              ?.timeZoneFromTime
                          }
                        </b>
                      </p>
                    )}
                    {gptDetails?.salesHiringRequest_Details
                      ?.timeZoneEndTime && (
                      <p>
                        To Time :{" "}
                        <b>
                          {
                            gptDetails?.salesHiringRequest_Details
                              ?.timeZoneEndTime
                          }
                        </b>
                      </p>
                    )}
                    {gptDetails?.salesHiringRequest_Details?.currency && (
                      <p>
                        Currency:{" "}
                        <b>
                          {gptDetails?.salesHiringRequest_Details?.currency}
                        </b>
                      </p>
                    )}
                    {gptDetails?.salesHiringRequest_Details?.yearOfExp > 0 && (
                      <p>
                        Years of Experience :{" "}
                        <b>
                          {gptDetails?.salesHiringRequest_Details?.yearOfExp}
                        </b>
                      </p>
                    )}
                    {gptDetails?.salesHiringRequest_Details?.durationType && (
                      <p>
                        Duration Type :{" "}
                        <b>
                          {gptDetails?.salesHiringRequest_Details?.durationType}
                        </b>
                      </p>
                    )}
                    {gptDetails?.modeOfWorkingId && (
                      <p>
                        Mode of Working :{" "}
                        <b>
                          {
                            workingMode.filter(
                              (item) => item?.id == gptDetails?.modeOfWorkingId
                            )[0]?.value
                          }
                        </b>
                      </p>
                    )}

                    {gptDetails?.chatGptSkills && (
                      <>
                        <h3 style={{ marginTop: "10px" }}>
                          Must Have Skills :
                        </h3>
                        <div className={HRFieldStyle.skillsList}>
                          {gptFileDetails.Skills?.length === 0 ? (
                            <p>NA</p>
                          ) : (
                            gptDetails?.chatGptSkills
                              ?.split(",")
                              .map((item) => {
                                return <span>{item}</span>;
                              })
                          )}
                        </div>
                      </>
                    )}

                    {gptDetails?.chatGptAllSkills && (
                      <>
                        <h3 style={{ marginTop: "10px" }}>
                          Good To Have Skills :
                        </h3>
                        <div className={HRFieldStyle.skillsList}>
                          {gptDetails?.chatGptAllSkills?.length === 0 ? (
                            <p>NA</p>
                          ) : (
                            gptDetails?.chatGptAllSkills
                              ?.split(",")
                              .map((item) => {
                                return <span>{item}</span>;
                              })
                          )}
                        </div>
                      </>
                    )}

                    {gptDetails?.salesHiringRequest_Details?.jobDescription && (
                      <>
                        <h3 style={{ marginTop: "10px" }}>Job Description :</h3>
                        {testJSON(
                          gptDetails?.salesHiringRequest_Details?.jobDescription
                        ) ? (
                          <div className={HRFieldStyle.viewHrJDDetailsBox}>
                            <ul>
                              {JSON.parse(
                                gptDetails?.salesHiringRequest_Details
                                  ?.jobDescription
                              ).map((text) => (
                                <li
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizedDescription(text),
                                  }}
                                />
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div
                            className={HRFieldStyle.viewHrJDDetailsBox}
                            dangerouslySetInnerHTML={{
                              __html: sanitizedDescription(
                                gptDetails?.salesHiringRequest_Details
                                  ?.jobDescription
                              ),
                            }}
                          />
                        )}
                      </>
                    )}

                    {/* {gptDetails?.salesHiringRequest_Details?.requirement && (
                    <>
                      <h3 style={{ marginTop: "10px" }}>Requirements :</h3>
                      {testJSON(
                        gptDetails?.salesHiringRequest_Details?.requirement
                      ) ? (
                        <div className={HRFieldStyle.viewHrJDDetailsBox}>
                          <ul>
                            {JSON.parse(
                              gptDetails?.salesHiringRequest_Details
                                ?.requirement
                            ).map((text) => (
                              <li dangerouslySetInnerHTML={{ __html: text }} />
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div
                          className={HRFieldStyle.viewHrJDDetailsBox}
                          dangerouslySetInnerHTML={{
                            __html:
                              gptDetails?.salesHiringRequest_Details
                                ?.requirement,
                          }}
                        />
                      )}
                    </>
                  )} */}

                    {/* {gptDetails?.salesHiringRequest_Details
                    ?.rolesResponsibilities && (
                    <>
                      <h3 style={{ marginTop: "10px" }}>
                        Roles And Responsibilities :
                      </h3>
                      {testJSON(
                        gptDetails?.salesHiringRequest_Details
                          ?.rolesResponsibilities
                      ) ? (
                        <div className={HRFieldStyle.viewHrJDDetailsBox}>
                          <ul>
                            {JSON.parse(
                              gptDetails?.salesHiringRequest_Details
                                ?.rolesResponsibilities
                            ).map((text) => (
                              <li dangerouslySetInnerHTML={{ __html: text }} />
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div
                          className={HRFieldStyle.viewHrJDDetailsBox}
                          dangerouslySetInnerHTML={{
                            __html:
                              gptDetails?.salesHiringRequest_Details
                                ?.rolesResponsibilities,
                          }}
                        />
                      )}
                    </>
                  )} */}

                    {/*  For JD File  */}
                    {gptFileDetails.JDDumpID && (
                      <div>
                        <h3>File Name : {gptFileDetails?.FileName}</h3>
                        {gptFileDetails?.Title && (
                          <h3>Role Title : {gptFileDetails?.Title}</h3>
                        )}
                        {gptFileDetails?.Skills.length > 0 && (
                          <>
                            <h3 style={{ marginTop: "10px" }}>Skills :</h3>
                            <div className={HRFieldStyle.skillsList}>
                              {gptFileDetails.Skills?.length === 0 ? (
                                <p>NA</p>
                              ) : (
                                gptFileDetails.Skills?.map((item) => {
                                  return <span>{item?.value}</span>;
                                })
                              )}
                            </div>
                          </>
                        )}

                        {/* {gptFileDetails?.Requirements && (
                        <>
                          <h3 style={{ marginTop: "10px" }}>Requirements :</h3>
                          <div className={HRFieldStyle.viewHrJDDetailsBox}> */}
                        {/* <ul>
                    {gptFileDetails?.Requirements?.split(',')?.shift()?.map(req=>  <li>{req}</li>)}
                  </ul> */}
                        {/* {gptFileDetails?.Requirements}
                          </div>
                        </>
                      )} */}

                        {/* {gptFileDetails?.Responsibility && (
                        <>
                          <h3 style={{ marginTop: "10px" }}>
                            Responsibility :
                          </h3>
                          <div className={HRFieldStyle.viewHrJDDetailsBox}> */}
                        {/* <ul>
                    {gptFileDetails?.Responsibility?.split(',')?.shift()?.map(req=>  <li>{req}</li>)}
                  </ul> */}
                        {/* {gptFileDetails?.Responsibility}
                          </div>
                        </>
                      )} */}

                        {gptFileDetails?.JobDescription && (
                          <>
                            <h3 style={{ marginTop: "10px" }}>
                              Job Description :
                            </h3>
                            <div
                              className={`${HRFieldStyle.viewHrJDDetailsBox} jobDescritionCSS`}
                              dangerouslySetInnerHTML={{
                                __html: gptFileDetails?.JobDescription,
                              }}
                            >
                              {/* <ul>
                    {gptFileDetails?.Responsibility?.split(',')?.shift()?.map(req=>  <li>{req}</li>)}
                  </ul> */}
                              {/* {gptFileDetails?.JobDescription} */}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <h3 style={{ marginTop: "10px" }}>
                    Are you sure you want to proceed with this?
                  </h3>
                </div>
                <div className={HRFieldStyle.formPanelAction}>
                  <button
                    type="submit"
                    onClick={() => {
                      continueWithGPTres();
                    }}
                    className={HRFieldStyle.btnPrimary}
                  >
                    OK
                  </button>
                  <button
                    onClick={() => {
                      setShowGPTModal(false);
                      setGPTFileDetails({});
                      setGPTDetails({});
                    }}
                    className={HRFieldStyle.btn}
                  >
                    Cancel
                  </button>
                </div>
              </Modal>
            )}
          </>
        ) : (
          <Skeleton />
        )}
      </div>
      <PreviewClientModal
        setIsPreviewModal={setIsPreviewModal}
        isPreviewModal={isPreviewModal}
        setcompanyID={setcompanyID}
        getcompanyID={getcompanyID}
      />
    </>
  );

  function getWorkingModelFields() {
    if (
      watch("workingMode") === undefined ||
      watch("workingMode").value === undefined ||
      watch("workingMode").value === WorkingMode.REMOTE
    ) {
      return null;
    } else {
      return (
        <>
          <div className={HRFieldStyle.row}>
            <div className={HRFieldStyle.colMd6}>
              <div className={HRFieldStyle.formGroup}>
                <label>
                  Location <span className={HRFieldStyle.reqField}>*</span>
                </label>
                <Controller
                  render={({ ...props }) => (
                    <AutoComplete
                      options={locationList ?? []}
                      onSelect={async (locName, _obj) => {
                        // getClientNameValue(clientName,_obj)
                        setLocationSelectValidation(false)
                        let citiesVal = await getCities(_obj.id);
                        if (watch("workingMode").value === WorkingMode.HYBRID) {
                          let firstCity = citiesVal[0];
                          setNearByCitesValues([firstCity.label]);
                          setNearByCitiesData(citiesVal);
                        } else {
                          let firstCity = citiesVal[0];
                          setNearByCitesValues([firstCity.label]);
                          setNearByCitiesData([firstCity]);
                        }
                      }}
                      filterOption={true}
                      onSearch={(searchValue) => {
                        // setClientNameSuggestion([]);
                        onChangeLocation(searchValue);
                      }}
                      onChange={(locName) => {
                        setValue("location", locName);
                      }}
                      onBlur={e=>{
                        const isValidSelection = locationList?.some(
                          (location) => location.value === e.target.value
                      );
                      if (!isValidSelection) {    
                         setLocationSelectValidation(true)
                      }
                      }}
                      placeholder="Enter Location"
                      // ref={controllerRef}
                      // name="clientName"
                      // defaultValue={clientNameValue}
                      value={watch("location")}
                    />
                  )}
                  {...register("location", {
                    required:
                      watch("workingMode").id === 2 ||
                      watch("workingMode").id === 3
                        ? true
                        : false,
                  })}
                  name="location"
                  // rules={{ required: true }}
                  control={control}
                />
                {errors.location && (
                  <div className={HRFieldStyle.error}>
                    * Please Select Location
                  </div>
                )}
                {locationSelectValidation && (
                  <div className={HRFieldStyle.error}>
                    * Choose a valid option from the suggestions.
                  </div>
                )}
              </div>

              {/* <HRInputField
                        onChangeHandler={e=> cityDeb() }
                         register={register}
                         errors={errors}
                         validationSchema={{
                           required: "please enter the location.",
                         }}
                         label="location"
                         name="location"
                         type={InputType.TEXT}
                         placeholder="Enter the location"
                         required
                       />
                       {countryListMessage !== null && <p className={HRFieldStyle.error}>*{countryListMessage}</p>} */}
            </div>

            {watch("workingMode").value === WorkingMode.HYBRID && (
              <div className={HRFieldStyle.colMd6}>
                <div className={HRFieldStyle.formGroup}>
                  <HRSelectField
                    controlledValue={controlledFrequencyValue}
                    setControlledValue={setControlledFrequencyValue}
                    isControlled={true}
                    mode={"id/value"}
                    searchable={true}
                    setValue={setValue}
                    register={register}
                    label={"Ferquency of Office Visits"}
                    defaultValue="officeVisits"
                    options={frequencyData}
                    name="officeVisits"
                    isError={errors["officeVisits"] && errors["officeVisits"]}
                    required={
                      watch("workingMode").value === WorkingMode.HYBRID
                        ? true
                        : false
                    }
                    errorMsg={"Please select office visits"}
                  />
                </div>
              </div>
            )}

            <div className={HRFieldStyle.colMd12}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "32px",
                }}
              >
                <label style={{ marginBottom: "12px" }}>
                  Are you open to applicants willing to relocate to your
                  location?
                  <span
                    style={{
                      color: "#E03A3A",
                      marginLeft: "4px",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    *
                  </span>
                </label>
                {/* {pricingTypeError && <p className={HRFieldStyle.error}>*Please select pricing type</p>}
                {transactionMessage && <p className={HRFieldStyle.teansactionMessage}>{transactionMessage}</p> }  */}
                <Radio.Group
                  onChange={(e) => {
                    setIsRelocate(e.target.value);
                  }}
                  value={isRelocate}
                >
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </div>
            </div>

            {isRelocate && (
              <div
                className={HRFieldStyle.colMd12}
                style={{ marginBottom: "12px" }}
              >
                <div className={HRFieldStyle.labelForSelect}>
                  Do you have a preference in candidate's location?
                </div>
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  value={NearByCitesValues}
                  options={nearByCitiesData}
                  onChange={(values, _) => setNearByCitesValues(values)}
                  placeholder="Select Compensation"
                  tokenSeparators={[","]}
                />

                <ul className={HRFieldStyle.selectFieldBox}>
                  {watch("workingMode").value === WorkingMode.HYBRID &&
                    nearByCitiesData
                      ?.filter(
                        (option) => !NearByCitesValues?.includes(option.label)
                      )
                      .map((option) => (
                        <li
                          key={option.value}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setNearByCitesValues([
                              ...NearByCitesValues,
                              option?.label,
                            ])
                          }
                        >
                          <span>
                            {option.label}{" "}
                            <img src={plusSkill} loading="lazy" alt="star" />
                          </span>
                        </li>
                      ))}
                </ul>
              </div>
            )}

            {/* <div className={HRFieldStyle.colMd6}>
                       <HRInputField
                        onChangeHandler={e=> cityDeb() }
                         register={register}
                         errors={errors}
                         validationSchema={{
                           required: "please enter the city.",
                         }}
                         label="City"
                         name="city"
                         type={InputType.TEXT}
                         placeholder="Enter the City"
                         required
                       />
                       {countryListMessage !== null && <p className={HRFieldStyle.error}>*{countryListMessage}</p>}
                 </div>

                 <div className={HRFieldStyle.colMd6}>
                       <div className={HRFieldStyle.formGroup}>
                       <HRSelectField
                 controlledValue={controlledCountryValue}
                 setControlledValue={setControlledCountryValue}
                 isControlled={true}
                 mode={"id/value"}
                 searchable={false}
                 setValue={setValue}
                 register={register}
                 label={"Country"}
                 defaultValue="Select country"
                 options={country ? country : []}
                 name="country"
                 isError={errors["country"] && errors["country"]}
                 required
                 errorMsg={"Please select the country."}
               />
                       </div>
                 </div> */}
          </div>
        </>
      );
      // if((isDirectHR === true && isBDRMDRUser === true) || companyType?.id=== 2){
      //   return (<>
      //    <div className={HRFieldStyle.row}>
      //             <div className={HRFieldStyle.colMd6}>
      //                   <HRInputField
      //                    onChangeHandler={e=> cityDeb() }
      //                     register={register}
      //                     errors={errors}
      //                     validationSchema={{
      //                       required: "please enter the city.",
      //                     }}
      //                     label="City"
      //                     name="city"
      //                     type={InputType.TEXT}
      //                     placeholder="Enter the City"
      //                     required
      //                   />
      //                   {countryListMessage !== null && <p className={HRFieldStyle.error}>*{countryListMessage}</p>}
      //             </div>

      //             <div className={HRFieldStyle.colMd6}>
      //                   <div className={HRFieldStyle.formGroup}>
      //                   <HRSelectField
      //             controlledValue={controlledCountryValue}
      //             setControlledValue={setControlledCountryValue}
      //             isControlled={true}
      //             mode={"id/value"}
      //             searchable={false}
      //             setValue={setValue}
      //             register={register}
      //             label={"Country"}
      //             defaultValue="Select country"
      //             options={country ? country : []}
      //             name="country"
      //             isError={errors["country"] && errors["country"]}
      //             required
      //             errorMsg={"Please select the country."}
      //           />
      //                   </div>
      //             </div>
      //    </div>
      //   </>)
      // }
      // return (
      //   <>
      //     <div className={HRFieldStyle.row}>
      //       {(removeFields !== null && removeFields?.postalCode === true) ? null :  <div className={HRFieldStyle.colMd6}>
      //         <HRInputField
      //           register={register}
      //           errors={errors}
      //           validationSchema={{
      //             required: "please enter the postal code.",
      //           }}
      //           label="Postal Code"
      //           name="postalCode"
      //           type={InputType.TEXT}
      //           placeholder="Enter the Postal Code"
      //           required
      //         />
      //       </div>}

      //       <div className={HRFieldStyle.colMd6}>
      //         <div className={HRFieldStyle.formGroup}>
      //           <HRSelectField
      //             controlledValue={controlledCountryValue}
      //             setControlledValue={val=> {setControlledCountryValue(val);countryCodeChangeHandler()}}
      //             isControlled={true}
      //             mode={"id/value"}
      //             searchable={false}
      //             setValue={setValue}
      //             register={register}
      //             label={"Country"}
      //             defaultValue="Select country"
      //             options={country && country}
      //             name="country"
      //             isError={errors["country"] && errors["country"]}
      //             required
      //             errorMsg={"Please select the country."}
      //           />
      //         </div>
      //       </div>
      //     </div>

      //     <div className={HRFieldStyle.row}>
      //        {(removeFields !== null && removeFields?.state === true) ? null : <div className={HRFieldStyle.colMd6}>
      //         <HRInputField
      //           register={register}
      //           errors={errors}
      //           validationSchema={{
      //             required: "please enter the state.",
      //           }}
      //           label="State"
      //           name="state"
      //           type={InputType.TEXT}
      //           placeholder="Enter the State"
      //           required
      //         />
      //       </div>}

      //       <div className={HRFieldStyle.colMd6}>
      //         <HRInputField
      //           register={register}
      //           errors={errors}
      //           validationSchema={{
      //             required: "please enter the city.",
      //           }}
      //           label="City"
      //           name="city"
      //           type={InputType.TEXT}
      //           placeholder="Enter the City"
      //           required
      //         />
      //       </div>
      //     </div>
      //     <div className={HRFieldStyle.row}>
      //     {(removeFields !== null && removeFields?.address === true) ? null :
      //       <div className={HRFieldStyle.colMd12}>
      //         <HRInputField
      //           isTextArea={true}
      //           register={register}
      //           errors={errors}
      //           validationSchema={{
      //             required: "please enter the address.",
      //           }}
      //           label="Address"
      //           name="address"
      //           type={InputType.TEXT}
      //           placeholder="Enter the Address"
      //           required
      //         />
      //       </div>}

      //     </div>

      //     {isNewPostalCodeModal && (
      //       <Modal
      //         footer={false}
      //         title="Postal Code Not Found"
      //         open={isNewPostalCodeModal}
      //         onCancel={() => setNewPostalCodeModal(false)}
      //       >
      //         <div
      //           style={{
      //             display: "flex",
      //             justifyContent: "center",
      //             alignItems: "center",
      //           }}
      //         >
      //           <h3>Are you sure you want to proceed?</h3>
      //         </div>
      //         <div className={HRFieldStyle.formPanelAction}>
      //           <button
      //             type="submit"
      //             onClick={() => {
      //               setPostalCodeNotFound(true);
      //               setNewPostalCodeModal(false);
      //             }}
      //             className={HRFieldStyle.btnPrimary}
      //           >
      //             OK
      //           </button>
      //           <button
      //             onClick={() => {
      //               setValue("postalCode", "");
      //               setPostalCodeNotFound(false);
      //               setNewPostalCodeModal(false);
      //             }}
      //             className={HRFieldStyle.btn}
      //           >
      //             Cancel
      //           </button>
      //         </div>
      //       </Modal>
      //     )}
      //   </>
      // );
    }
  }
};

export default EditHRFields;
