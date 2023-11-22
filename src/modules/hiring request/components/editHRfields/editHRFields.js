import {
  Button,
  Checkbox,
  Divider,
  Space,
  message,
  AutoComplete,
  Modal,
  Skeleton,
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
import { useLocation } from "react-router-dom";
import { hrUtils } from "modules/hiring request/hrUtils";
import { MasterDAO } from "core/master/masterDAO";
import useDrivePicker from "react-google-drive-picker/dist";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { UserAccountRole } from "constants/application";
import useDebounce from "shared/hooks/useDebounce";
import LogoLoader from "shared/components/loader/logoLoader";
import { NetworkInfo } from "constants/network";
import { HttpStatusCode } from "axios";

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
}) => {
  const inputRef = useRef(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getUserResult = async () => {
      let userData = UserSessionManagementController.getUserSession();
      if (userData) setUserData(userData);
    };
    getUserResult();
  }, []);

  const [getUploadFileData, setUploadFileData] = useState("");
  const [availability, setAvailability] = useState([]);
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

  const [getValidation, setValidation] = useState({
    systemFileUpload: "",
    googleDriveFileUpload: "",
    linkValidation: "",
  });
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const [getGoogleDriveLink, setGoogleDriveLink] = useState("");
  const [getClientNameSuggestion, setClientNameSuggestion] = useState([]);

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
  const [contractDurationValue, setContractDuration] = useState("");

  const [controlledDurationTypeValue, setControlledDurationTypeValue] =
    useState("Select Term");
  const [controlledFromTimeValue, setControlledFromTimeValue] =
    useState("Select From Time");
  const [controlledEndTimeValue, setControlledEndTimeValue] =
    useState("Select End Time");
  const [controlledTempProjectValue, setControlledTempProjectValue] =
    useState("Please select .");
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

  const [tempProjects, setTempProject] = useState([
    {
      disabled: false,
      group: null,
      selected: false,
      text: `Yes, it's for a limited Project`,
      value: true,
    },
    {
      disabled: false,
      group: null,
      selected: false,
      text: `No, They want to hire for long term`,
      value: false,
    },
  ]);

  const [timeZoneList,setTimezoneList] = useState([]);

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

  //CLONE HR functionality
  const getHRdetailsHandler = async (hrId) => {
    const response = await hiringRequestDAO.getHRDetailsRequestDAO(hrId);
    if (response.statusCode === HTTPStatusCode.OK) {
      setHRdetails(response?.responseBody?.details);
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
    setAvailability(
      availabilityResponse &&
        availabilityResponse.responseBody?.BindHiringAvailability
    );
  }, []);
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
    setTalentRole((preValue) => [
      ...preValue,
      {
        id: -1,
        value: "Others",
      },
    ]);
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

  const getClientNameValue = (clientName) => {
    setValue("clientName", clientName);
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
    getTalentRole();
    getSalesPerson();
    // getRegion();
    getTimeZoneList()
    getWorkingMode();
    getCountry();
    getHowSoon();
    getNRMarginHandler();
    getDurationTypes();
    getBudgetHandler();
    contractDurationHandler();
    getStartEndTimeHandler();
    getPartialEngHandler();
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
    !isPostalCodeNotFound && debouncedFunction("POSTAL_CODE");
  }, [debouncedFunction, watchPostalCode, isPostalCodeNotFound]);

  useEffect(() => {
    if (country && country?.length > 1 && watchCountry) {
      !isPostalCodeNotFound && debouncedFunction("COUNTRY_CODE");
    }
  }, [country, debouncedFunction, isPostalCodeNotFound, watchCountry]);

  const [messageAPI, contextHolder] = message.useMessage();
  let watchJDUrl = watch("jdURL");
  setEnID(getHRdetails?.en_Id && getHRdetails?.en_Id);
  const hrSubmitHandler = useCallback(
    async (d, type = SubmitType.SAVE_AS_DRAFT) => {
      setIsSavedLoading(true);
      let hrFormDetails = hrUtils.hrFormDataFormatter(
        d,
        type,
        watch,
        getHRdetails?.addHiringRequest?.contactId,
        isHRDirectPlacement,
        addHRResponse,
        getUploadFileData && getUploadFileData,
        watchJDUrl ? watchJDUrl : jdDumpID
      );

      hrFormDetails["allowSpecialEdit"] = getHRdetails?.allowSpecialEdit;

      if(watch('fromTime').value === watch('endTime').value){
        setIsSavedLoading(false);
        return setError("fromTime", {
          type: "validate",
          message: "Start & End Time is same.",
        });
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
      const addHRRequest = await hiringRequestDAO.createHRDAO(hrFormDetails);

      if (addHRRequest.statusCode === HTTPStatusCode.OK) {
        setIsSavedLoading(false);
        window.scrollTo(0, 0);
        setAddHRResponse(getHRdetails?.en_Id);
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
      getHRdetails?.en_Id,
      isHRDirectPlacement,
      addHRResponse,
      getUploadFileData,
      watchJDUrl,
      setError,
      setTitle,
      // setTabFieldDisabled,
      // tabFieldDisabled,
      getHRdetails?.addHiringRequest?.hrNumber,
      messageAPI,
    ]
  );
  useEffect(() => {
    setValue("hrTitle", hrRole?.value);
  }, [hrRole?.value, setValue]);

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
      getHRdetails?.addHiringRequest?.talentCostCalcPercentage
    );
    setValue("months", getHRdetails?.salesHiringRequest_Details?.specificMonth);
    setValue("years", getHRdetails?.salesHiringRequest_Details?.yearOfExp);
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
    setValue("jdExport", getHRdetails?.addHiringRequest?.jdfilename);
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
  }, [getHRdetails, setValue]);
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
    if (getHRdetails?.addHiringRequest?.availability) {
      const findAvailability = availability.filter(
        (item) => item?.value === getHRdetails?.addHiringRequest?.availability
      );
      setValue("availability", findAvailability[0]);
      setControlledAvailabilityValue(findAvailability[0]?.value);
    }
  }, [getHRdetails, availability]);

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
          item?.id ===
          getHRdetails?.salesHiringRequest_Details?.timezoneId
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
  }, [getHRdetails, tempProjects, setValue]);

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
    if (getHRdetails?.contractDuration) {
      const contract = contractDurations.filter(
        (item) => item.value === getHRdetails?.contractDuration
      );

      if (contract.length > 0) {
        setValue("contractDuration", contract[0]);
        setContractDuration(contract[0]?.value);
      } else {
        if (getHRdetails?.contractDuration !== "0") {
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
      setJDParsedSkills(gptFileDetails);

      setJDDumpID(gptFileDetails.JDDumpID);
      setGPTFileDetails({});
      setShowGPTModal(false);

      let _getHrValues = { ...getHRdetails };

      _getHrValues.salesHiringRequest_Details.requirement =
        gptFileDetails.Requirements;
      _getHrValues.salesHiringRequest_Details.roleAndResponsibilities =
        gptFileDetails.Responsibility;
      _getHrValues.salesHiringRequest_Details.rolesResponsibilities =
        gptFileDetails.Responsibility;
      _getHrValues.addHiringRequest.jdurl = "";
      _getHrValues.addHiringRequest.jdfilename = gptFileDetails.FileName;
      if(gptFileDetails.Skills.length > 0){_getHrValues.chatGptSkills = gptFileDetails.Skills.map(item=> item.value).join(',');}  

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
      _getHrValues.salesHiringRequest_Details.budgetFrom =
        gptDetails?.salesHiringRequest_Details?.budgetFrom > 0
          ? gptDetails?.salesHiringRequest_Details?.budgetFrom
          : watch("minimumBudget");
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
     
      const findWorkingMode = workingMode.filter(
        (item) => item?.id === parseInt(gptDetails?.modeOfWorkingId)
      );

      setValue("workingMode", findWorkingMode[0]);
      setControlledWorkingValue(findWorkingMode[0]?.value);
      setValue("jdExport", "");
       _getHrValues.hdnModeOfWork = findWorkingMode[0]?.value ? findWorkingMode[0]?.value : watch('workingMode').value
      setHRdetails(_getHrValues);
      gptDetails?.addHiringRequest?.noofTalents &&
        setValue("talentsNumber", gptDetails?.addHiringRequest?.noofTalents);
      // gptDetails?.addHiringRequest?.availability &&
      //   setValue("availability", gptDetails?.addHiringRequest?.availability);
        if(gptDetails?.addHiringRequest?.availability){
          let findAvailability = availability.filter(item=> item.value === gptDetails?.addHiringRequest?.availability)
          setValue("availability", findAvailability[0]);
          setControlledAvailabilityValue(findAvailability[0].value)
        }
      gptDetails?.salesHiringRequest_Details?.budgetFrom > 0 &&
        setValue(
          "minimumBudget",
          gptDetails?.salesHiringRequest_Details?.budgetFrom
        );
      gptDetails?.salesHiringRequest_Details?.budgetTo > 0 &&
        setValue(
          "maximumBudget",
          gptDetails?.salesHiringRequest_Details?.budgetTo
        );
      gptDetails?.salesHiringRequest_Details?.yearOfExp &&
        setValue("years", gptDetails?.salesHiringRequest_Details?.yearOfExp);
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
        setValue(
          "fromTime",
          gptDetails?.salesHiringRequest_Details?.timeZoneFromTime
        );
      gptDetails?.salesHiringRequest_Details?.timeZoneEndTime &&
        setValue(
          "endTime",
          gptDetails?.salesHiringRequest_Details?.timeZoneEndTime
        );
      setValue("budget", "2");

      setGPTDetails({});
      setShowGPTModal(false);
    }
  };

  const onHandleFocusOut = async (e) => {
    const regex = /\(([^)]+)\)/;
    if(!watchClientName){   
      setError('jdURL',{message:'Please Select client Email/Name '})
    setTimeout(()=> { clearErrors('jdURL');
      resetField('jdURL')
      setJDURLLink('')
      },3000)
      return
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
        clientEmail: email.trim(),
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


  return (
    <div className={HRFieldStyle.hrFieldContainer}>
      {contextHolder}
      {getHRdetails?.salesHiringRequest_Details ? (
        <>
          <div className={HRFieldStyle.partOne}>
            <div className={HRFieldStyle.hrFieldLeftPane}>
              <h3>Hiring Request Details</h3>
              <p>Please provide the necessary details</p>
              <LogoLoader visible={isSavedLoading} />
            </div>

            <form id="hrForm" className={HRFieldStyle.hrFieldRightPane}>
              <div className={HRFieldStyle.row}>
                <div className={HRFieldStyle.colMd12}>
                  <div className={HRFieldStyle.formGroup}>
                    <label>
                      Client Email/Name <b style={{ color: "black" }}>*</b>
                    </label>
                    <Controller
                      render={({ ...props }) => (
                        <AutoComplete
                          options={getClientNameSuggestion}
                          onSelect={(clientName) =>
                            getClientNameValue(clientName)
                          }
                          filterOption={true}
                          onSearch={(searchValue) => {
                            // setClientNameSuggestion([]);
                            getClientNameSuggestionHandler(searchValue.trim());
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
                      required
                      errorMsg={"Please select hiring request sales person"}
                      disabled={
                        userData?.LoggedInUserTypeID === UserAccountRole.SALES
                      }
                    />
                  )}
                </div>

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
                      setControlledValue={setControlledWorkingValue}
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
                <div className={HRFieldStyle.colMd6}>
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
                <div className={HRFieldStyle.orLabel}>OR</div>
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
                </div>
              </div>

              <div className={HRFieldStyle.row}>
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
              <br />
              <div className={HRFieldStyle.row}>
                {isHRDirectPlacement ? (
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
                        required: "please enter the nr margin percentage.",
                      }}
                      label="NR Margin Percentage"
                      name="NRMargin"
                      type={InputType.TEXT}
                      placeholder="Select NR margin percentage"
                      required={!isHRDirectPlacement}
                    />
                  </div>
                )}

                {!isHRDirectPlacement ? (
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
                ) : null}

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
                      label={"Add your estimated budget (Monthly)"}
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
                    label={"Adhoc Budget"}
                    register={register}
                    name="adhocBudgetCost"
                    type={InputType.NUMBER}
                    placeholder="Adhoc- Ex: 2300, 2000"
                    required={watch("budget")?.value === "1"}
                    errors={errors}
                    validationSchema={{
                      required: "please enter the Adhoc Budget.",
                      min: {
                        value: 1,
                        message: `please don't enter the value less than 1`,
                      },
                    }}
                    disabled={watch("budget")?.value !== "1"}
                  />
                </div>
                <div className={HRFieldStyle.colMd4}>
                  <HRInputField
                    label={"Minimum Budget (Monthly)"}
                    register={register}
                    name="minimumBudget"
                    type={InputType.NUMBER}
                    placeholder="Minimum- Ex: 2300, 2000"
                    required={watch("budget")?.value === "2"}
                    errors={errors}
                    validationSchema={{
                      required: "please enter the minimum budget.",
                      min: {
                        value: 1,
                        message: `please don't enter the value less than 1`,
                      },
                    }}
                    disabled={watch("budget")?.value !== "2"}
                  />
                </div>

                <div className={HRFieldStyle.colMd4}>
                  <HRInputField
                    label={"Maximum Budget (Monthly)"}
                    register={register}
                    name="maximumBudget"
                    type={InputType.NUMBER}
                    placeholder="Maximum- Ex: 2300, 2000"
                    required={watch("budget")?.value === "2"}
                    errors={errors}
                    validationSchema={{
                      required: "please enter the maximum budget.",
                      min: {
                        value: watch("minimumBudget"),
                        message: "Budget should be more than minimum budget.",
                      },
                    }}
                    disabled={watch("budget")?.value !== "2"}
                  />
                </div>
              </div>

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
                <div className={HRFieldStyle.colMd4}>
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
                        errors["getDurationType"] && errors["getDurationType"]
                      }
                      required={!isHRDirectPlacement}
                      errorMsg={"Please select duration type"}
                      disabled={isHRDirectPlacement}
                    />
                  </div>
                </div>
                <div className={HRFieldStyle.colMd4}>
                  <div className={HRFieldStyle.formGroup}>
                    <HRSelectField
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
                                      (duration) => duration.value == name
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
                      options={contractDurations.map((item) => ({
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
                        errors["contractDuration"] && errors["contractDuration"]
                      }
                      required={!isHRDirectPlacement}
                      errorMsg={
                        "Please select hiring request contract duration"
                      }
                      disabled={isHRDirectPlacement}
                    />
                  </div>
                </div>
                <div className={HRFieldStyle.colMd4}>
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
                      validationSchema={{
                        required: "please enter the years.",
                        min: {
                          value: 1,
                          message: `please don't enter the value less than 1`,
                        },
                        max: {
                          value: 60,
                          message: "please don't enter the value more than 60",
                        },
                      }}
                      register={register}
                      name="years"
                      type={InputType.NUMBER}
                      placeholder="Enter years"
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
              </div>
              <div className={HRFieldStyle.row}>
                <div className={HRFieldStyle.colMd6}>
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
                    required
                    disabled={true}
                  />
                </div>
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
                      setControlledValue={setControlledAvailabilityValue}
                      isControlled={true}
                      mode={"id/value"}
                      setValue={setValue}
                      register={register}
                      label={"Availability"}
                      defaultValue="Select availability"
                      options={availability}
                      name="availability"
                      isError={errors["availability"] && errors["availability"]}
                      required
                      errorMsg={"Please select the availability."}
                    />
                  </div>
                </div>
              </div>

              {watch("availability")?.value === "Part Time" && (
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
              )}

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
                      setControlledValue={setControlledFromTimeValue}
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
                      errorMsg={errors["fromTime"] ?  errors["fromTime"].message : "Please select from time."}
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
                <div className={HRFieldStyle.colMd6}>
                  <HRInputField
                    disabled={true}
                    register={register}
                    label="Deal ID"
                    name="dealID"
                    type={InputType.NUMBER}
                    placeholder="Enter ID"
                  />
                </div>
              </div>

              <div className={HRFieldStyle.row}>
                <div className={HRFieldStyle.colMd6}>
                  <HRInputField
                    register={register}
                    errors={errors}
                    validationSchema={{
                      required: "please enter the BQ form link.",
                    }}
                    label="BQ Form Link"
                    name="bqFormLink"
                    type={InputType.TEXT}
                    placeholder="Enter the link for BQ form"
                    required={getHRdetails?.addHiringRequest?.guid === null}
                  />
                </div>
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
                    required={getHRdetails?.addHiringRequest?.guid === null}
                  />
                </div>
              </div>
            </form>
          </div>

          <Divider />
          {/* <AddInterviewer
				errors={errors}
				append={append}
				remove={remove}
				register={register}
				fields={fields}
			/> */}

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
                      Budget From  :{" "}
                      <b>
                        {gptDetails?.salesHiringRequest_Details?.budgetFrom}
                      </b>
                    </p>
                  )}
                  {gptDetails?.salesHiringRequest_Details?.budgetTo > 0 && (
                    <p>
                      Budget To:{" "}
                      <b>{gptDetails?.salesHiringRequest_Details?.budgetTo}</b>
                    </p>
                  )}
                  {gptDetails?.salesHiringRequest_Details?.timeZoneFromTime && (
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
                  {gptDetails?.salesHiringRequest_Details?.timeZoneEndTime && (
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
                      <b>{gptDetails?.salesHiringRequest_Details?.currency}</b>
                    </p>
                  )}
                  {gptDetails?.salesHiringRequest_Details?.yearOfExp > 0 && (
                    <p>
                      Years of Experience :{" "}
                      <b>{gptDetails?.salesHiringRequest_Details?.yearOfExp}</b>
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
                      <h3 style={{ marginTop: "10px" }}>Must Have Skills :</h3>
                      <div className={HRFieldStyle.skillsList}>
                        {gptFileDetails.Skills?.length === 0 ? (
                          <p>NA</p>
                        ) : (
                          gptDetails?.chatGptSkills?.split(",").map((item) => {
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

                  {gptDetails?.salesHiringRequest_Details?.requirement && (
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
                  )}

                  {gptDetails?.salesHiringRequest_Details
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
                  )}

                  {/*  For JD File  */}
                  {gptFileDetails.JDDumpID && (
                    <div>
                      <h3>File Name : {gptFileDetails?.FileName}</h3>

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

                      {gptFileDetails?.Requirements && (
                        <>
                          <h3 style={{ marginTop: "10px" }}>Requirements :</h3>
                          <div className={HRFieldStyle.viewHrJDDetailsBox}>
                            {/* <ul>
                    {gptFileDetails?.Requirements?.split(',')?.shift()?.map(req=>  <li>{req}</li>)}
                  </ul> */}
                            {gptFileDetails?.Requirements}
                          </div>
                        </>
                      )}

                      {gptFileDetails?.Responsibility && (
                        <>
                          <h3 style={{ marginTop: "10px" }}>
                            Responsibility :
                          </h3>
                          <div className={HRFieldStyle.viewHrJDDetailsBox}>
                            {/* <ul>
                    {gptFileDetails?.Responsibility?.split(',')?.shift()?.map(req=>  <li>{req}</li>)}
                  </ul> */}
                            {gptFileDetails?.Responsibility}
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
              <HRInputField
                register={register}
                errors={errors}
                validationSchema={{
                  required: "please enter the postal code.",
                }}
                label="Postal Code"
                name="postalCode"
                type={InputType.TEXT}
                placeholder="Enter the Postal Code"
                required
              />
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
                  options={country && country}
                  name="country"
                  isError={errors["country"] && errors["country"]}
                  required
                  errorMsg={"Please select the country."}
                />
              </div>
            </div>
          </div>
          <div className={HRFieldStyle.row}>
            <div className={HRFieldStyle.colMd6}>
              <HRInputField
                register={register}
                errors={errors}
                validationSchema={{
                  required: "please enter the state.",
                }}
                label="State"
                name="state"
                type={InputType.TEXT}
                placeholder="Enter the State"
                required
              />
            </div>
            <div className={HRFieldStyle.colMd6}>
              <HRInputField
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
            </div>
          </div>
          <div className={HRFieldStyle.row}>
            <div className={HRFieldStyle.colMd12}>
              <HRInputField
                isTextArea={true}
                register={register}
                errors={errors}
                validationSchema={{
                  required: "please enter the address.",
                }}
                label="Address"
                name="address"
                type={InputType.TEXT}
                placeholder="Enter the Address"
                required
              />
            </div>
          </div>

          {isNewPostalCodeModal && (
            <Modal
              footer={false}
              title="Postal Code Not Found"
              open={isNewPostalCodeModal}
              onCancel={() => setNewPostalCodeModal(false)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h3>Are you sure you want to proceed?</h3>
              </div>
              <div className={HRFieldStyle.formPanelAction}>
                <button
                  type="submit"
                  onClick={() => {
                    setPostalCodeNotFound(true);
                    setNewPostalCodeModal(false);
                  }}
                  className={HRFieldStyle.btnPrimary}
                >
                  OK
                </button>
                <button
                  onClick={() => {
                    setValue("postalCode", "");
                    setPostalCodeNotFound(false);
                    setNewPostalCodeModal(false);
                  }}
                  className={HRFieldStyle.btn}
                >
                  Cancel
                </button>
              </div>
            </Modal>
          )}
        </>
      );
    }
  }
};

export default EditHRFields;
