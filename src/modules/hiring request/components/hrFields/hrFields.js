import {
  Button,
  Checkbox,
  Divider,
  Space,
  message,
  AutoComplete,
  Modal,
  Radio,
  Tooltip,
  Select,
  Avatar,
} from "antd";
import {
  ClientHRURL,
  EmailRegEx,
  GoogleDriveCredentials,
  InputType,
  SubmitType,
  WorkingMode,
} from "constants/application";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HRInputField from "../hrInputFields/hrInputFields";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import HRFieldStyle from "./hrFIelds.module.css";
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
import useDebounce from "shared/hooks/useDebounce";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { UserAccountRole } from "constants/application";
import LogoLoader from "shared/components/loader/logoLoader";
import { HttpStatusCode } from "axios";
import infoIcon from "assets/svg/info.svg";
import plusSkill from "assets/svg/plusSkill.svg";
import { HubSpotDAO } from "core/hubSpot/hubSpotDAO";
import DOMPurify from "dompurify";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import JobDescriptionComponent from "../jdComponent/jdComponent";
import ReactQuill from "react-quill";
import PhoneIcon from "assets/svg/phoneIcon.svg";
import DeleteCircleIcon from "assets/svg/deleteCircleIcon.svg";
import infoSmallIcon from "assets/svg/infoSmallIcon.svg";
import MailIcon from "assets/svg/mailIcon.svg";
import { isEmptyOrWhitespace } from "modules/hiring request/screens/allHiringRequest/previewHR/services/commonUsedVar";

import debounce from "lodash.debounce";

export const secondaryInterviewer = {
  interviewerId: "0",
  fullName: "",
  emailID: "",
  linkedin: "",
  designation: "",
};

const HRFields = ({
  setJDDumpID,
  jdDumpID,
  setTitle,
  clientDetail,
  setEnID,
  tabFieldDisabled,
  setTabFieldDisabled,
  setJDParsedSkills,
  contactID,
  interviewDetails,
  companyName,
  params,
  getHRdetails,
  setHRdetails,
  setAddData,
  fromClientflow,
  removeFields,
  disabledFields,
  setDisabledFields,
  defaultPropertys,
  isDirectHR,
  setAboutCompanyDesc,
  userCompanyTypeID,
  setUserCompanyTypeID,
  isHaveJD,
  setIsHaveJD,
  parseType,
  setParseType,
}) => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const getUserResult = async () => {
      let userData = UserSessionManagementController.getUserSession();
      if (userData) setUserData(userData);
    };
    getUserResult();
  }, []);

  const [creditBaseCheckBoxError, setCreditBaseCheckBoxError] = useState(false);
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const [controlledCountryName, setControlledCountryName] = useState("");
  const [countryListMessage, setCountryListMessage] = useState(null);
  const inputRef = useRef(null);
  const [getUploadFileData, setUploadFileData] = useState("");
  const [availability, setAvailability] = useState([]);
  const [JobTypes, setJobTypes] = useState([]);
  const [payRollTypes, setPayRollTypes] = useState([]);
  const [hrPricingTypes, setHRPricingTypes] = useState([]);
  // const [timeZonePref, setTimeZonePref] = useState([]);
  const [workingMode, setWorkingMode] = useState([]);
  const [controlledWorkingValue, setControlledWorkingValue] = useState(
    "Select working mode"
  );
  const [locationSelectValidation,setLocationSelectValidation] = useState(false);

  const [controlledTempProjectValue, setControlledTempProjectValue] =
    useState("Please select .");
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
  const [autoCompleteValue, setAutoCompleteValue] = useState("");
  const [companyautoCompleteValue, setCompanyAutoCompleteValue] = useState("");
  const [talentRole, setTalentRole] = useState([]);
  const [country, setCountry] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [salesPerson, setSalesPerson] = useState([]);
  const [isSalesPersionDisable, setIsSalesPersionDisable] = useState(false);
  const [salesPersionNameFromEmail, setSalesPersionNameFromEmail] =
    useState("");
  const [howSoon, setHowSoon] = useState([]);
  // const [region, setRegion] = useState([]); // removed
  const [isLoading, setIsLoading] = useState(false);
  const [contractDurations, setcontractDurations] = useState([]);
  const [partialEngagements, setPartialEngagements] = useState([]);
  const [name, setName] = useState("");
  const [pathName, setPathName] = useState("");
  const [showUploadModal, setUploadModal] = useState(false);
  const [isCompanyNameAvailable, setIsCompanyNameAvailable] = useState(false);
  const [controlledBudgetValue, setControlledBudgetValue] =
    useState("Select Budget");
  // from add client flow to enadle JD fields
  // useEffect(()=>{
  //   if(fromClientflow === true){
  //     setIsCompanyNameAvailable(true)
  //   }
  // },[fromClientflow])

  const [addHRResponse, setAddHRResponse] = useState(null);
  const [type, setType] = useState("");
  const [isHRDirectPlacement, setHRDirectPlacement] = useState(false);
  const [getClientNameMessage, setClientNameMessage] = useState("");
  const [getCompanyNameMessage, setCompanyNameMessage] = useState("");
  const [getContactAndSaleID, setContactAndSalesID] = useState({
    contactID: "",
    salesID: "",
  });
  const [childCompany, setChildCompany] = useState([]);
  const [isSalesUserPartner, setIsSalesUserPartner] = useState(false);
  const [getDurationType, setDurationType] = useState([]);
  const [getStartEndTimes, setStaryEndTimes] = useState([]);
  const [getValidation, setValidation] = useState({
    systemFileUpload: "",
    googleDriveFileUpload: "",
    linkValidation: "",
  });
  const [jdURLLink, setJDURLLink] = useState("");
  const [prevJDURLLink, setPrevJDURLLink] = useState("");
  const [getGoogleDriveLink, setGoogleDriveLink] = useState("");
  const [getClientNameSuggestion, setClientNameSuggestion] = useState([]);
  const [getCompanyNameSuggestion, setCompanyNameSuggestion] = useState([]);
  const [isNewPostalCodeModal, setNewPostalCodeModal] = useState(false);
  const [isPostalCodeNotFound, setPostalCodeNotFound] = useState(false);
  const [controlledTimeZoneValue, setControlledTimeZoneValue] =
    useState("Select time zone");
  const [controlledFromTimeValue, setControlledFromTimeValue] =
    useState("Select From Time");
  const [controlledEndTimeValue, setControlledEndTimeValue] =
    useState("Select End Time");
  const [controlledCurrencyValue, setControlledCurrencyValue] =
    useState("Select Currency");
  const [controlledAvailabilityValue, setControlledAvailabilityValue] =
    useState("Select availability");
  const [
    controlledHiringPricingTypeValue,
    setControlledHiringPricingTypeValue,
  ] = useState("Select Hiring Pricing");
  const [DealHRData, setDealHRData] = useState({});

  const [showHRPOCDetailsToTalents, setshowHRPOCDetailsToTalents] =
    useState(null);
  const [activeUserData, setActiveUserData] = useState([]);
  const [activeUserDataList, setActiveUserDataList] = useState([]);
  const [jobPostUsersDetails, setJobPostUsersDetails] = useState([]);
  const [controlledPocValue, setControlledPocValue] = useState([]);

  const [locationList, setLocationList] = useState([]);
  const [frequencyData, setFrequencyData] = useState([]);
  const [nearByCitiesData, setNearByCitiesData] = useState([]);
  const [isRelocate, setIsRelocate] = useState(false);
  const [NearByCitesValues, setNearByCitesValues] = useState([]);
  const [controlledFrequencyValue, setControlledFrequencyValue] =
    useState("Select");
  const[allCities,setAllCities] = useState([]);  

  let controllerRef = useRef(null);
  let controllerCompanyRef = useRef(null);
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    setError,
    unregister,
    control,
    resetField,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      secondaryInterviewer: [],
    },
  });
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
    // { value: "Manufacturing", label: "Manufacturing" },
  ];

  const [timeZoneList, setTimezoneList] = useState([]);

  const watchSalesPerson = watch("salesPerson");
  const watchChildCompany = watch("childCompany");

  const [showGPTModal, setShowGPTModal] = useState(false);
  const [gptDetails, setGPTDetails] = useState({});
  const [gptFileDetails, setGPTFileDetails] = useState({});
  const [typeOfPricing, setTypeOfPricing] = useState(null);
  const [pricingTypeError, setPricingTypeError] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState("");
  const [disableYypeOfPricing, setDisableTypeOfPricing] = useState(false);
  const [isBudgetConfidential, setIsBudgetConfidentil] = useState(false);
  const [isFreshersAllowed, setIsFreshersAllowed] = useState(false);
  const [isExpDisabled, setIsExpDisabled] = useState(false);
  const [isFresherDisabled, setIsFresherDisabled] = useState(false);
  const [isProfileView, setIsProfileView] = useState(false);
  const [isPostaJob, setIsPostaJob] = useState(false);
  const [isVettedProfile, setIsVettedProfile] = useState(true);
  const [peopleManagemantexp, setHasPeopleManagementExp] = useState(null);
  const [CompensationValues, setCompensationValues] = useState([]);
  const [specificIndustry, setSpecificIndustry] = useState([]);
  /* const { fields, append, remove } = useFieldArray({
		control,
		name: 'secondaryInterviewer',
	}); */

  const [clientDetails, setClientDetails] = useState({});

  const [countryBasedOnIP, setCountryBasedOnIP] = useState("");
  const [checkCreditAvailability, setCheckCreditAvailability] = useState({});
  const [isCreateHRDisable, setIsCreateHRDisable] = useState(false);
  const [hideProfileView, setHideProfileView] = useState(false);
  const [hidePostJob, setHidePostJob] = useState(false);
  const [disableProfileView, setDisableProfileView] = useState(false);
  const [disablePostJob, setDisablePostJob] = useState(false);

  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddClient, setAddClient] = useState(false);
  const [textCopyPastData, setTextCopyPastData] = useState("");

  const isGUID =
    watch("hiringPricingType")?.id === 3 ||
    watch("hiringPricingType")?.id === 6 ||
    userCompanyTypeID === 2
      ? "DPHR"
      : "";

  const watchClientName = watch("clientName");
  const _endTime = watch("endTime");
  let filteredMemo = useMemo(() => {
    let filteredData = getClientNameSuggestion?.filter(
      (item) => item?.value === watchClientName
    );
    return filteredData;
  }, [getClientNameSuggestion, watchClientName]);

  /* ------------------ Upload JD Starts Here ---------------------- */
  const [openPicker, authResponse] = useDrivePicker();

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
    [getValidation, setJDDumpID]
  );

  const uploadFileHandler = useCallback(
    async (e) => {
      setIsLoading(true);
      let fileData = e.target.files[0];

      if (
        fileData?.type !== "application/pdf" &&
        fileData?.type !== "application/docs" &&
        fileData?.type !== "application/msword" &&
        fileData?.type !== "text/plain" &&
        fileData?.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        //   &&
        // fileData?.type !== "image/png" &&
        // fileData?.type !== "image/jpeg"
      ) {
        setValidation({
          ...getValidation,
          systemFileUpload:
            "Uploaded file is not a valid, Only pdf, docs, text and rtf files are allowed",
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
        formData.append(
          "clientemail",
          clientDetail?.clientemail
            ? clientDetail?.clientemail
            : filteredMemo[0]?.emailId
            ? filteredMemo[0]?.emailId
            : watchClientName ?? ""
        );
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
            // setJDParsedSkills(
            // 	uploadFileResponse && uploadFileResponse?.responseBody?.details,
            // );
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
            // 	uploadFileResponse && uploadFileResponse?.responseBody?.details,
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
      setIsLoading(false);
    },
    [getValidation, setJDDumpID, setJDParsedSkills, filteredMemo, clientDetail]
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

  const getPOCUsers = async (companyID) => {
    let response = await MasterDAO.getEmailSuggestionDAO("", companyID);
    // console.log("poc users",response)
    setActiveUserData([
      ...response?.responseBody?.details?.map((item) => ({
        value: item?.contactId,
        label: item?.contactName,
      })),
    ]);
    setActiveUserDataList(response?.responseBody?.details);
  };

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
  // let hrRole = watch('role');
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
        setCountry(countryResponse && response);
        if (response?.stateCityData === "postal code not find") {
          setNewPostalCodeModal(true);
          setValue("city", "");
          setValue("state", "");
        } else if (response.getCountry?.length === 1) {
          setControlledCountryName(response?.getCountry?.[0]?.value);
          setValue("country", {
            id: response?.getCountry?.[0]?.id,
            value: response?.getCountry?.[0]?.value,
          });
          setValue("city", response?.stateCityData?.province);
          setValue("state", response?.stateCityData?.stateEn);
          clearErrors("country");
        } else {
          setControlledCountryName("");
          setValue("city", "");
          setValue("state", "");
        }
      } else {
        setCountry([]);
      }
    },
    [clearErrors, setValue, watch]
  );

  const CheckSalesUserIsPartner = useCallback(
    async (getContactAndSaleID) => {
      const response = await MasterDAO.checkIsSalesPersonDAO(
        getContactAndSaleID
      );
      if (response?.statusCode === HTTPStatusCode.OK) {
        if (response?.responseBody?.details?.SaleUserIsPartner) {
          setIsSalesUserPartner(
            response?.responseBody?.details?.SaleUserIsPartner
          );
          const newChildCompanyList =
            response?.responseBody?.details?.ChildCompanyList.filter(
              (ele, index) => index !== 0
            );
          setChildCompany([]);
          setChildCompany((prev) =>
            newChildCompanyList.map(
              ({ childCompanyID, childCompanyName }) =>
                childCompanyID !== -1 && {
                  id: childCompanyID,
                  value: childCompanyName,
                }
            )
          );
          setChildCompany((prev) => [
            ...prev,
            { id: 0, value: "Add Other Company" },
          ]);
        }
      } else {
        setError("salesPerson", {
          type: "validate",
          message: "Sales Person is not partner",
        });
      }
    },
    [setError]
  );
  const toggleJDHandler = useCallback((e) => {
    setJDURLLink(e.target.value);
    // clearErrors();
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

  const getTalentRole = useCallback(async () => {
    const talentRole = await MasterDAO.getTalentsRoleRequestDAO();

    setTalentRole(talentRole && talentRole.responseBody);
    setTalentRole((preValue) => {
      let oldArray = new Array(preValue);
      return [
        ...oldArray,
        {
          id: -1,
          value: "Others",
        },
      ];
    });
  }, []);

  const getDurationTypes = useCallback(async () => {
    const durationTypes = await MasterDAO.getDurationTypeDAO();
    setDurationType(
      durationTypes &&
        durationTypes?.responseBody?.details.filter(
          (item) => item?.value !== "0"
        )
    );
  }, []);

  const getFrequencyData = async () => {
    let response = await MasterDAO.getFrequencyDAO();
    setFrequencyData(
      response?.responseBody?.details?.map((fre) => ({
        id: fre.id,
        value: fre.frequency,
      }))
    );
  };

  const getStartEndTimeHandler = useCallback(async () => {
    const durationTypes = await MasterDAO.getStartEndTimeDAO();
    setStaryEndTimes(durationTypes && durationTypes?.responseBody);
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
  }, [setValue, userData.LoggedInUserTypeID, userData.FullName]);

  // const getRegion = useCallback(async () => {
  //   let response = await MasterDAO.getTalentTimeZoneRequestDAO();
  //   setRegion(response && response?.responseBody);
  // }, []);

  const getTimeZoneList = useCallback(async () => {
    let response = await MasterDAO.getTimeZoneRequestDAO();
    setTimezoneList(response && response?.responseBody);
  }, [setTimezoneList]);

  const getLocation = useLocation();
  const { state } = useLocation();
  const [companyID, setCompanyID] = useState(null);

  useEffect(() => {
    if (state?.companyName) {
      setCompanyID(state.companyID);
      setValue("companyName", state?.companyName);
      getClientNameSuggestionHandler("", state.companyID);
      // getClientNameSuggestionHandler("")
    }
  }, [state]);

  const onNameChange = (event) => {
    setName(event.target.value);
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
      // name && setcontractDurations([...contractDurations, name + ' months' || name]);
      // setName('');
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

    // setDefault POC
    setControlledPocValue([
      { value: clientData.contactId, label: clientData.contactName },
    ]);
    setValue("jobPostUsers", [
      { value: clientData.contactId, label: clientData.contactName },
    ]);
    const poctoadd = {
      hiringRequestId: 0,
      hrwiseContactId: clientData?.contactId,
      guid: "",
      fullName: clientData.contactName,
      emailID: clientData.emailId,
      contactNo: clientData.contactNumber,
      showEmailToTalent: false,
      showContactNumberToTalent: false,
      isDefaultUser: false,
      iInfoMsg: "",
    };
    setJobPostUsersDetails([poctoadd]);
    // to unfocus or blur client name field
    document.activeElement.blur();
    setError("clientName", {
      type: "validate",
      message: "",
    });
  };

  const getClientNameSuggestionHandler = useCallback(
    async (clientName, cid) => {
      let response = await MasterDAO.getEmailSuggestionDAO(
        clientName,
        cid ? cid : companyID
      );

      if (response?.statusCode === HTTPStatusCode.OK) {
        setClientNameSuggestion(response?.responseBody?.details);
        setClientNameMessage("");
        setAddClient(false);
      } else if (
        response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
        response?.statusCode === HTTPStatusCode.NOT_FOUND
      ) {
        setError("clientName", {
          type: "validate",
          // message: response?.responseBody,
          message: "We couldn't find the client. Add Client to this Company",
        });
        setAddClient(true);
        setClientNameSuggestion([]);
        setClientNameMessage(response?.responseBody);
        //TODO:- JD Dump ID
      }
    },
    [setError, companyID]
  );

  const getCompanyNameSuggestionHandler = useCallback(
    async (companyName, cid) => {
      setClientNameMessage("");
      clearErrors("clientName");
      setValue("clientName", "");
      setAutoCompleteValue("");
      setAddClient(false);
      setCompanyID(null);
      let response = await MasterDAO.getCompanySuggestionDAO(companyName);

      if (response?.statusCode === HTTPStatusCode.OK) {
        clearErrors("companyName");
        setShowAddCompany(false);
        setCompanyNameSuggestion(
          response?.responseBody?.details.map((item) => ({
            ...item,
            value: item.companyName,
          }))
        );
        // setCompanyID(result.details.companyID)
        // getClientNameSuggestionHandler('',result.details.companyID)
        // getPOCUsers(result.details.companyID)
      } else if (
        response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
        response?.statusCode === HTTPStatusCode.NOT_FOUND
      ) {
        setCompanyNameSuggestion([]);
        setCompanyNameMessage(response?.responseBody);
        setError("companyName", {
          type: "manual",
          message: "We couldn't find the company. Create company",
        });
        setShowAddCompany(true);
        //TODO:- JD Dump ID
      }
    },
    [setError, companyID]
  );

  const companyvalidate = (companyName) => {
    if (!companyName) {
      return "please enter the company name.";
    } else if (getCompanyNameMessage !== "" && companyName) {
      return getCompanyNameMessage;
    }
    return true;
  };

  const validate = (clientName) => {
    if (!clientName) {
      return "please enter the client email/name.";
    } else if (getClientNameMessage !== "" && clientName) {
      return getClientNameMessage;
    }
    return true;
  };

  const getHRClientName = useCallback(
    async (watchClientName) => {
      setIsSavedLoading(true);
      if (watchClientName || filteredMemo) {
        let existingClientDetails =
          await hiringRequestDAO.getClientDetailRequestDAO(
            filteredMemo[0]?.emailId
              ? filteredMemo[0]?.emailId
              : watchClientName
          );

        // existingClientDetails?.statusCode === HTTPStatusCode.OK &&
        //   setContactAndSalesID((prev) => ({
        //     ...prev,
        //     contactID: existingClientDetails?.responseBody?.contactid,
        //   }));

        if (existingClientDetails?.statusCode === HTTPStatusCode.OK) {
          setIsSavedLoading(false);
          setContactAndSalesID((prev) => ({
            ...prev,
            contactID: existingClientDetails?.responseBody?.contactid,
          }));
          // setIsCompanyNameAvailable(true);
          setValue("companyName", existingClientDetails?.responseBody?.name);
          setValue("clientName", existingClientDetails?.responseBody?.email);
          clearErrors(["clientName"]);

          companyName(existingClientDetails?.responseBody?.name);

          setCheckCreditAvailability(
            existingClientDetails?.responseBody?.CheckCreditAvailablilty
          );

          setAboutCompanyDesc(
            existingClientDetails?.responseBody?.AboutCompanyDesc ?? null
          );
          if (clientDetails?.isHybrid === false) {
            let companyType =
              existingClientDetails?.responseBody.CompanyTypes?.find(
                (item) => item.isActive
              );
            setUserCompanyTypeID(companyType.id);
          } else {
            setUserCompanyTypeID(1);
          }

          if (
            existingClientDetails?.responseBody?.isTransparentPricing !== null
          ) {
            setTypeOfPricing(
              existingClientDetails?.responseBody?.isTransparentPricing === true
                ? 1
                : 0
            );
            setDisableTypeOfPricing(true);
            setTransactionMessage(
              "*This client has been selected in past for below pricing model. To change and update pricing model go to Company and make the changes to reflect right while submitting this HR."
            );
          } else {
            setTypeOfPricing(null);
            setDisableTypeOfPricing(false);
            setTransactionMessage(
              "*You are creating this HR for the first time for this Client after roll out of Transparent Pricing, help us select if this client and HR falls under transparent or non transparent pricing."
            );
          }

          if (existingClientDetails?.responseBody?.salesuserid > 0) {
            // setIsSalesPersionDisable(true)
            let salesUserObj = salesPerson.filter(
              (p) =>
                p.id ===
                parseInt(existingClientDetails?.responseBody?.salesuserid)
            );
            setValue("salesPerson", salesUserObj[0]?.id);
            setSalesPersionNameFromEmail(salesUserObj[0]?.value);
          } else {
            if (userData?.LoggedInUserTypeID !== UserAccountRole.SALES) {
              if (
                defaultPropertys !== null &&
                defaultPropertys?.salesPerson > 0
              ) {
                return;
              }
              setIsSalesPersionDisable(false);
              resetField("salesPerson");
              setSalesPersionNameFromEmail("");
            }
          }
        }

        /* setError('clientName', {
			type: 'duplicateCompanyName',
			message:
				existingClientDetails?.statusCode === HTTPStatusCode.NOT_FOUND &&
				'Client email does not exist.',
		}); */

        // for manage and fetch from HubSpot
        if (existingClientDetails.statusCode === HTTPStatusCode.NOT_FOUND) {
          let email = filteredMemo[0]?.emailId
            ? filteredMemo[0]?.emailId
            : watchClientName;
          if (EmailRegEx.email.test(email)) {
            let response = await HubSpotDAO.getContactsByEmailDAO(email);
            if (response.statusCode === HTTPStatusCode.OK) {
              getHRClientName(watchClientName);
            } else {
              message.error(response?.responseBody);
              setValue("clientName", "");
            }
            setIsSavedLoading(false);
            setIsLoading(false);
          } else {
            setValue("clientName", "");
            setIsSavedLoading(false);
            setIsLoading(false);
          }
        }
        // existingClientDetails.statusCode === HTTPStatusCode.NOT_FOUND &&
        //   setValue("clientName", "");
        // existingClientDetails.statusCode === HTTPStatusCode.NOT_FOUND &&
        //   setValue("companyName", "");
        // existingClientDetails?.statusCode === HTTPStatusCode.OK &&
        //   setValue("companyName", existingClientDetails?.responseBody?.name);
        // companyName(existingClientDetails?.responseBody?.name);
        // existingClientDetails?.statusCode === HTTPStatusCode.OK &&
        //   setIsCompanyNameAvailable(true);
        setIsSavedLoading(false);
        setIsLoading(false);
      }
      setIsSavedLoading(false);
    },
    [
      filteredMemo,
      setValue,
      watchClientName,
      defaultPropertys,
      clientDetails?.isHybrid,
    ]
  );

  useEffect(() => {
    // for Disable Enable Create HR based on credit
    if (userCompanyTypeID === 2) {
      if (
        checkCreditAvailability?.isCreditAvailable === false &&
        isPostaJob === true
      ) {
        setIsCreateHRDisable(true);
      } else {
        setIsCreateHRDisable(false);
      }
    } else {
      setIsCreateHRDisable(false);
    }

    if (
      clientDetails?.isHybrid === false &&
      clientDetails?.companyTypeID === 2
    ) {
      if (clientDetails?.isPostaJob && clientDetails?.isProfileView === false) {
        setHideProfileView(true);
        setDisablePostJob(true);
        return;
      }
      if (clientDetails?.isProfileView && clientDetails?.isPostaJob === false) {
        setHidePostJob(true);
        setDisableProfileView(true);
        return;
      }
      if (clientDetails?.isProfileView && clientDetails?.isPostaJob) {
        setDisableProfileView(true);
        setDisablePostJob(true);
        return;
      }
      setHidePostJob(false);
      setHideProfileView(false);
      setDisablePostJob(false);
      setDisableProfileView(false);
    } else {
      setHidePostJob(false);
      setHideProfileView(false);
      setDisablePostJob(false);
      setDisableProfileView(false);
    }
  }, [checkCreditAvailability, userCompanyTypeID, isPostaJob]);

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
  const watchCountry = watch("country");
  const { isReady, debouncedFunction } = useDebounce(postalCodeHandler, 2000);
  // useEffect(() => {
  //   if(removeFields !== null && removeFields?.postalCode === true){
  //     return
  //   }else{
  //     !isPostalCodeNotFound && debouncedFunction("POSTAL_CODE");
  //   }

  // }, [debouncedFunction, watchPostalCode, isPostalCodeNotFound,removeFields]);
  // useEffect(() => {
  //   if(removeFields !== null && removeFields?.postalCode === true){
  //     return
  //   }else{
  //   if (country && country?.getCountry?.length > 1 && watchCountry) {
  //     !isPostalCodeNotFound && debouncedFunction("COUNTRY_CODE");
  //   }
  // }
  // }, [country, debouncedFunction, isPostalCodeNotFound, watchCountry,removeFields]);

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
            ? {
                getCountry: countryList.map((list) => ({
                  id: list.id,
                  value: list.country,
                })),
              }
            : []
        );
        if (countryList.length === 1) {
          setControlledCountryName(countryList[0]?.country);
          setValue("country", countryList[0]);
        }
        if (countryList.length > 1) {
          setControlledCountryName("");
          resetField("country");
        }
      } else {
        let countryList = countryResponse.responseBody.details;
        setCountry(
          countryList !== null
            ? {
                getCountry: countryList.map((list) => ({
                  id: list.id,
                  value: list.country,
                })),
              }
            : []
        );
        setControlledCountryName("");
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
    let timer;
    if (!_isNull(watchClientName)) {
      timer =
        pathName === ClientHRURL.ADD_NEW_HR &&
        setTimeout(() => {
          setIsLoading(true);
          getHRClientName(watchClientName);
        }, 500);
    }
    return () => clearTimeout(timer);
  }, [getHRClientName, watchClientName, pathName]);
  //console.log("watchClientName",watchClientName);
  useEffect(() => {
    let urlSplitter = `${getLocation.pathname.split("/")[2]}`;
    setPathName(urlSplitter);
    pathName === ClientHRURL.ADD_NEW_CLIENT &&
      setValue("clientName", clientDetail?.clientemail);
    pathName === ClientHRURL.ADD_NEW_CLIENT &&
      setValue("companyName", clientDetail?.companyname);

    if (clientDetail?.typeOfPricing !== undefined) {
      if (clientDetail?.typeOfPricing !== null) {
        setTypeOfPricing(clientDetail?.typeOfPricing);
        setDisableTypeOfPricing(true);
        setTransactionMessage(
          "*This client has been selected in past for below pricing model. To change and update pricing model go to Company and make the changes to reflect right while submitting this HR."
        );
      } else {
        setTypeOfPricing(null);
        setDisableTypeOfPricing(false);
        setTransactionMessage(
          "*You are creating this HR for the first time for this Client after roll out of Transparent Pricing, help us select if this client and HR falls under transparent or non transparent pricing."
        );
      }
    }
  }, [
    getLocation.pathname,
    clientDetail?.clientemail,
    clientDetail?.companyname,
    clientDetail?.typeOfPricing,
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
    if (getContactAndSaleID?.contactID && getContactAndSaleID?.salesID)
      CheckSalesUserIsPartner(getContactAndSaleID);
  }, [CheckSalesUserIsPartner, getContactAndSaleID]);

  // useEffect(() => {
  //   !_isNull(prefRegion) && getTimeZonePreference();
  // }, [prefRegion, getTimeZonePreference]);

  useEffect(() => {
    getSalesPerson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const fetchCities = useCallback(async () => {     
    setIsLoading(true);
    const _res = await MasterDAO.getAutoCompleteCity("");
    setIsLoading(false);    
    let citiesValues = [];
    if (_res?.statusCode === 200) {        
    citiesValues = _res?.responseBody?.details?.map((city) => ({
        value: city.row_ID,
        label: city.location,
    }));
    setAllCities(citiesValues || []);
    } else {
        setAllCities([]);
    }            
});

  useEffect(
    () => {
      getAvailability();
      getPayrollType();
      getHRPricingType();
      getTalentRole();
      // getSalesPerson();
      // getRegion();
      getTimeZoneList();
      getWorkingMode();
      // postalCodeHandler();
      getCurrencyHandler();
      getBudgetHandler();
      contractDurationHandler();
      getPartialEngHandler();
      getHowSoon();
      getNRMarginHandler();
      getDurationTypes();
      getStartEndTimeHandler();
      getFrequencyData();
      fetchCities()
      // get country name based on IP
      fetch("https://ipapi.co/json")
        .then((response) => response.json())
        .then((data) => {
          setCountryBasedOnIP(data.country_name);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      // getCurrencyHandler,
      // getAvailability,
      // getSalesPerson,
      // getTalentRole,
      // getTimeZonePreference,
      // getRegion,
      // getHowSoon,
      // getWorkingMode,
      // contractDurationHandler,
      // getPartialEngHandler,
      // getBudgetHandler,
      // // postalCodeHandler,
      // getNRMarginHandler,
      // getDurationTypes,
      // getStartEndTimeHandler
    ]
  );
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
    let precentage = hrPricingTypes.find(
      (item) => item.id === watch("hiringPricingType")?.id
    )?.pricingPercent;

    setValue("NRMargin", precentage);

    if (
      watch("hiringPricingType")?.id === 1 ||
      watch("hiringPricingType")?.id === 4 ||
      watch("hiringPricingType")?.id === 7 ||
      watch("hiringPricingType")?.id === 8
    ) {
      unregister("payrollType");
      watch("hiringPricingType")?.id === 1 && unregister("tempProject");
    }

    if (
      watch("hiringPricingType")?.id === 3 ||
      watch("hiringPricingType")?.id === 6
    ) {
      if (countryBasedOnIP === "India") {
        setValue("NRMargin", 7.5);
      }
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
  }, [watch("hiringPricingType"), hrPricingTypes, countryBasedOnIP]);

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
    if (jdURLLink) {
      unregister("jdExport");
    }
  }, [jdURLLink, unregister]);

  useEffect(() => {
    if (modeOfWork?.value === "Remote") {
      unregister(["address", "city", "state", "country", "postalCode"]);
    }
  }, [modeOfWork, unregister]);

  // useEffect(() => {
  // 	hrRole !== 'others' && unregister('otherRole');
  // }, [hrRole, unregister]);
  /** To check Duplicate email exists End */

  const [messageAPI, contextHolder] = message.useMessage();

  const getTextDetils = async () => {
    if (textCopyPastData) {
      let payload = { pdfText: textCopyPastData };

      const result = await hiringRequestDAO.getDetailsFromTextDAO(
        payload,
        clientDetail?.clientemail
          ? clientDetail?.clientemail
          : filteredMemo[0]?.emailId
          ? filteredMemo[0]?.emailId
          : watchClientName ?? ""
      );

      if (result.statusCode === 200) {
        let JDDATA = result?.responseBody?.details;
        let _getHrValues = { ...getHRdetails };
        if (!_getHrValues.salesHiringRequest_Details) {
          _getHrValues["salesHiringRequest_Details"] = {
            JobDescription: JDDATA?.jobDescription ?? "",
          };
        } else {
          _getHrValues.salesHiringRequest_Details.JobDescription =
            JDDATA?.jobDescription ?? "";
        }

        let newObj = {
          Skills: JDDATA?.skills
            ? JDDATA?.skills
                .split(",")
                .slice(0, 5)
                .map((item) => ({
                  id: "0",
                  value: item,
                }))
            : [],
          AllSkills: JDDATA?.allSkills
            ? JDDATA?.allSkills.split(",").map((item) => ({
                id: "0",
                value: item,
              }))
            : [],
          Responsibility: "",
          Requirements: "",
          JobDescription: JDDATA.jobDescription ?? "",
          roleName: JDDATA?.roleName ?? "",
        };
        // console.log(newObj)
        setJDParsedSkills(newObj);
        setHRdetails(_getHrValues);
      } else {
        message.error("Something went wrong!");
      }
    }
  };

  const getParsingType = (isHaveJD, parseType) => {
    if (isHaveJD === 1) {
      return "DonotHaveJD";
    }
    if (isHaveJD === 0) {
      if (parseType === "JDFileUpload") {
        return "FileUpload";
      }
      if (parseType === "Text_Parsing") {
        return "CopyPaste";
      }
    }
  };

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

      setCreditBaseCheckBoxError(false);
      if (userCompanyTypeID === 1) {
        if (typeOfPricing === null) {
          setIsSavedLoading(false);
          setPricingTypeError(true);
          return;
        }
      }

      let hrFormDetails = hrUtils.hrFormDataFormatter(
        d,
        type,
        watch,
        contactID || getContactAndSaleID?.contactID,
        isHRDirectPlacement,
        addHRResponse,
        getUploadFileData && getUploadFileData,
        jdDumpID,
        typeOfPricing,
        hrPricingTypes,
        { id: userCompanyTypeID }
      );
      hrFormDetails.isDirectHR = isDirectHR;
      hrFormDetails.PayPerType = userCompanyTypeID;
      hrFormDetails.IsConfidentialBudget = isBudgetConfidential;
      hrFormDetails.IsFresherAllowed = isFreshersAllowed;
      hrFormDetails.industryType = specificIndustry?.join("^");
      hrFormDetails.compensationOption = CompensationValues?.join("^");
      hrFormDetails.hasPeopleManagementExp =
        peopleManagemantexp !== null
          ? peopleManagemantexp === 1
            ? true
            : false
          : null;
      hrFormDetails.prerequisites = watch("parametersHighlight") ?? null;
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
      const selectedLabels = allCities?.filter(item => NearByCitesValues?.includes(item.value))?.map(item => item.label);
      const nonNumericValues = NearByCitesValues?.filter(value => typeof value === 'string' && !selectedLabels.includes(value)); 
      hrFormDetails.NearByCities = isRelocate
        ?  selectedLabels?.concat(nonNumericValues)?.join(',')
        : null;
      hrFormDetails.ATS_JobLocationID =
        watch("workingMode").id === 2 || watch("workingMode").id === 3
          ? locationList?.find((loc) => loc.value === watch("location"))?.id
          : null;
      hrFormDetails.ATS_NearByCities = isRelocate
        ? getNearByCitiesForAts()
        : null;

      if (userCompanyTypeID === 2) {

        if (jobPostUsersDetails.length){
          let allValid = true
          jobPostUsersDetails.forEach((user) =>{
            if(user.contactNo){
              const regex = /^[6-9]\d{9}$/;
              console.log('validate Contact no.',!regex.test(user.contactNo))
              if (!regex.test(user.contactNo)) {  
                message.error('Invalid phone number. Must be 10 digits and start with 6-9.');  
                setIsSavedLoading(false);  
                 console.log('validate Contact no.',!regex.test(user.contactNo))
                 allValid = false
              }
            
            }
          })

          if(allValid === false){
            return
          }
        }
        
        hrFormDetails.showHRPOCDetailsToTalents = showHRPOCDetailsToTalents;
        hrFormDetails.hrpocUserID = watch("jobPostUsers")
          ? watch("jobPostUsers")?.map((item) => item.value.toString())
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

      if (userCompanyTypeID === 2) {
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
      if (userCompanyTypeID === 1) {
        hrFormDetails.IsPostaJob = false;
        hrFormDetails.IsProfileView = false;
        hrFormDetails.IsVettedProfile = false;
      }

      // For JD error Handling

      if (isHaveJD === 0) {
        if (parseType === "Manual") {
          message.error("Please select a file to upload");
          setIsSavedLoading(false);
          return;
        }
        if (parseType === "JDFileUpload") {
          if (getUploadFileData === "") {
            message.error("Please select a file to upload");
            setIsSavedLoading(false);
            return;
          }
        }
        if (parseType === "Text_Parsing") {
          if (textCopyPastData === "" || textCopyPastData === "<p><br></p>") {
            message.error("Please Copy & Paste JD");
            setIsSavedLoading(false);
            return;
          }
        }
      }
      hrFormDetails.ParsingType = getParsingType(isHaveJD, parseType);
      hrFormDetails.JDDescription =
        getParsingType(isHaveJD, parseType) === "CopyPaste"
          ? getHRdetails?.salesHiringRequest_Details?.JobDescription
          : null;

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

      const addHRRequest = await hiringRequestDAO.createHRDAO(hrFormDetails);

      if (addHRRequest.statusCode === HTTPStatusCode.OK) {
        window.scrollTo(0, 0);
        setIsSavedLoading(false);
        setAddHRResponse(addHRRequest?.responseBody?.details);
        if (params === "addnewhr") {
          interviewDetails(addHRRequest?.responseBody?.details);
        }
        setEnID(addHRRequest?.responseBody?.details?.en_Id);
        if (!!addHRRequest?.responseBody?.details?.jdURL)
          setJDParsedSkills({
            Skills: [],
            Responsibility: "",
            Requirements: "",
          });
        type !== SubmitType.SAVE_AS_DRAFT && setTitle("Debriefing HR");

        type !== SubmitType.SAVE_AS_DRAFT &&
          setTabFieldDisabled({ ...tabFieldDisabled, debriefingHR: false });

        if (type === SubmitType.SAVE_AS_DRAFT) {
          messageAPI.open({
            type: "success",
            content: "HR details has been saved to draft.",
          });
          setTimeout(() => {
            navigate("/allhiringrequest");
          }, 1000);
          // setTitle('Debriefing HR')
        }
      }
      setIsSavedLoading(false);
    },
    [
      getHRdetails,
      addHRResponse,
      contactID,
      getContactAndSaleID?.contactID,
      getUploadFileData,
      isHRDirectPlacement,
      jdDumpID,
      messageAPI,
      params,
      setEnID,
      setError,
      setJDParsedSkills,
      setTabFieldDisabled,
      setTitle,
      tabFieldDisabled,
      watch,
      typeOfPricing,
      hrPricingTypes,
      isDirectHR,
      userCompanyTypeID,
      isBudgetConfidential,
      isPostaJob,
      isProfileView,
      isVettedProfile,
      isFreshersAllowed,
      isHaveJD,
      parseType,
      getUploadFileData,
      textCopyPastData,
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
  // 	setValue('hrTitle', hrRole?.value);
  // }, [hrRole?.value, setValue]);

  useEffect(() => {
    if (errors?.clientName?.message) {
      controllerRef.current.focus();
    }
  }, [errors?.clientName]);

  useEffect(() => {
    setContactAndSalesID((prev) => ({ ...prev, salesID: watchSalesPerson }));
  }, [watchSalesPerson]);

  // set uplers fees
  useEffect(() => {
    if (watch("budget")?.value === "1") {
      if (
        watch("hiringPricingType")?.id === 3 ||
        watch("hiringPricingType")?.id === 6
      ) {
        // let dpPercentage = hrPricingTypes.find(i => i.id === watch('hiringPricingType')?.id).pricingPercent
        let dpPercentage = watch("NRMargin");
        // let cal = (dpPercentage * (watch('adhocBudgetCost') * 12)) / 100
        // // let cal = ((watch('adhocBudgetCost') * 100)/ (100 + +dpPercentage))
        // let needtopay = watch('adhocBudgetCost') - cal
        // setValue("needToPay",needtopay ? needtopay.toFixed(2) : 0)
        // setValue('uplersFees',cal? cal.toFixed(2) : 0)
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
        //  let cal = (watch('NRMargin') * watch('adhocBudgetCost'))/ 100
        // let cal =  (watch('adhocBudgetCost') * 100)/ (100 + +watch('NRMargin'))
        // let upFess = watch('adhocBudgetCost') - cal
        // setValue("needToPay",cal? cal.toFixed(2) : 0)
        // setValue('uplersFees',upFess ? upFess.toFixed(2) : 0)

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
    // if(watch('budget')?.value === '2'){
    //   if(watch('hiringPricingType')?.id === 3 || watch('hiringPricingType')?.id === 6 ){
    //     // let dpPercentage = hrPricingTypes.find(i => i.id === watch('hiringPricingType')?.id).pricingPercent
    //     let dpPercentage = watch('NRMargin')
    //     let calMin = (dpPercentage * (watch('minimumBudget') * 12)) / 100
    //     let calMax = (dpPercentage * watch('maximumBudget') *12) /100
    //     // let calMin = ((watch('minimumBudget') * 100)/(100 + +watch('NRMargin')))
    //     let minUpFees = (watch('minimumBudget') - calMin)* 12
    //     // let calMax = ((watch('maximumBudget') * 100)/(100 + +watch('NRMargin')))
    //     let maxUpFees = (watch('maximumBudget') - calMax)* 12
    //     setValue("needToPay",`${calMin? calMin.toFixed(2) : 0} - ${calMax? calMax.toFixed(2) : 0}`)
    //     setValue('uplersFees',`${minUpFees? minUpFees.toFixed(2) : 0} - ${maxUpFees? maxUpFees.toFixed(2) : 0}`)
    //   }else{
    //     // let calMin = (watch('NRMargin') * watch('minimumBudget'))/ 100
    //     // let calMax = (watch('NRMargin') * watch('maximumBudget'))/ 100
    //     let calMin =  (watch('minimumBudget') * 100)/(100 + +watch('NRMargin'))
    //     let minUpFees = watch('minimumBudget') - calMin
    //     let calMax =  (watch('maximumBudget') * 100)/(100 + +watch('NRMargin'))
    //     let maxUpFees = watch('maximumBudget') - calMax
    //     setValue("needToPay",`${calMin? calMin.toFixed(2) : 0} - ${calMax? calMax.toFixed(2) : 0}`)
    //     setValue('uplersFees',`${minUpFees? minUpFees.toFixed(2) : 0} - ${maxUpFees? maxUpFees.toFixed(2) : 0}`)
    //    }
    // }
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
  //       setValue("needToPay",cal? cal.toFixed(2) : 0)
  //     }else{
  //       let cal = parseFloat(watch('adhocBudgetCost')) + parseFloat(watch('uplersFees'))
  //       setValue("needToPay",cal? cal.toFixed(2) : 0)
  //     }

  //   }
  //   if(watch('budget')?.value === '2'){
  //     if(typeOfPricing === 0){
  //       let uplersBudget = watch('uplersFees')?.split('-')
  //       let minCal = watch('minimumBudget') - uplersBudget[0]
  //       let maxCal = watch('maximumBudget') - uplersBudget[1]
  //       setValue("needToPay",`${minCal? minCal.toFixed(2) : 0} - ${maxCal? maxCal.toFixed(2) : 0}`)
  //     }else{
  //       let uplersBudget = watch('uplersFees')?.split('-')
  //       let minCal = parseFloat(watch('minimumBudget')) + parseFloat(uplersBudget[0])
  //       let maxCal = parseFloat(watch('maximumBudget')) + parseFloat(uplersBudget[1])

  //       setValue("needToPay",`${minCal? minCal.toFixed(2) : 0} - ${maxCal? maxCal.toFixed(2) : 0}`)
  //     }

  //   }
  // },[watch('uplersFees'),watch('budget'),watch('adhocBudgetCost'),watch('maximumBudget'),watch('minimumBudget')])

  // useEffect(() => {
  //   if (timeZonePref.length > 0) {
  //     setValue("timeZone", timeZonePref[0]);
  //     setControlledTimeZoneValue(timeZonePref[0].value);
  //   }
  // }, [timeZonePref, setValue]);

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

  const getdealHRdetailsHandler = async (DID) => {
    const response = await hiringRequestDAO.getDealHRDetailsRequestDAO(DID);
    if (response.statusCode === HTTPStatusCode.OK) {
      let data = response.responseBody.details;

      //console.log(data)
      let DataToPopulate = {
        company: data?.company,
        contact: data?.contact,
        currency: data?.salesHiringRequest_Details?.currency,
        discoveryCall: data?.addHiringRequest?.discoveryCall,
        dealID: DID,
      };
      //console.log(DataToPopulate)
      setDealHRData(DataToPopulate);
      // DataToPopulate.company && setValue('companyName',DataToPopulate.company )
      // DataToPopulate.contact && setValue('clientName', DataToPopulate.contact)
      // DataToPopulate.discoveryCall && setValue('discoveryCallLink',DataToPopulate.discoveryCall)
      // DataToPopulate.dealID && setValue('dealID',DataToPopulate.dealID)
      // if (DataToPopulate?.currency) {
      // 	const findCurrency = currency.filter(
      // 		(item) =>
      // 			item?.value === DataToPopulate?.currency,
      // 	);
      // 	console.log('findCurrency',{currency, findCurrency})
      // 	setValue('currency', findCurrency[0]);
      // 	setControlledCurrencyValue(findCurrency[0]?.value);
      // }
      // setHRdetails(response?.responseBody?.details);
    }
  };

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
    DealHRData.contact && setValue("clientName", DealHRData.contact);
    DealHRData.discoveryCall &&
      setValue("discoveryCallLink", DealHRData.discoveryCall);
    DealHRData.dealID && setValue("dealID", DealHRData.dealID);
    if (DealHRData?.currency) {
      const findCurrency = currency.filter(
        (item) => item?.value === DealHRData?.currency
      );

      setValue("currency", findCurrency[0]);
      setControlledCurrencyValue(findCurrency[0]?.value);
    }
  }, [DealHRData, currency, setValue]);

  useEffect(() => {
    const DID = localStorage.getItem("dealID");
    if (DID) {
      getdealHRdetailsHandler(DID);
    }
  }, [localStorage.getItem("dealID")]);

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
        ...{
          Skills: gptFileDetails?.Skills
            ? gptFileDetails?.Skills.slice(0, 8).map((item) => ({
                id: "0",
                value: item.value,
              }))
            : [],
          AllSkills: [],
          // JobDescription:JDDATA.jobDescription ?? '',
          roleName: gptFileDetails?.Title ?? "",
        },
      });

      setJDDumpID(gptFileDetails.JDDumpID);
      setGPTFileDetails({});
      setShowGPTModal(false);

      let _getHrValues = { ...getHRdetails };

      if (!_getHrValues.salesHiringRequest_Details) {
        _getHrValues["salesHiringRequest_Details"] = {
          JobDescription: gptFileDetails.JobDescription ?? "",
          requirement: gptFileDetails.Requirements ?? "",
          roleAndResponsibilities: gptFileDetails.Responsibility ?? "",
          rolesResponsibilities: gptFileDetails.Responsibility,
          jdurl: "",
          jdfilename: gptFileDetails.FileName,
        };
      } else {
        _getHrValues.salesHiringRequest_Details.JobDescription =
          gptFileDetails.JobDescription ?? "";
        _getHrValues.salesHiringRequest_Details.requirement =
          gptFileDetails.Requirements ?? "";
        _getHrValues.salesHiringRequest_Details.roleAndResponsibilities =
          gptFileDetails.Responsibility ?? "";
        _getHrValues.salesHiringRequest_Details.rolesResponsibilities =
          gptFileDetails.Responsibility;
        _getHrValues.addHiringRequest.jdurl = "";
        _getHrValues.addHiringRequest.jdfilename = gptFileDetails.FileName;
      }

      setHRdetails(_getHrValues);
    } else {
      //when URL

      const findWorkingMode = workingMode.filter(
        (item) => item?.id == gptDetails?.modeOfWorkingId
      );

      if (findWorkingMode[0]?.value) {
        setValue("workingMode", findWorkingMode[0]);
        setControlledWorkingValue(findWorkingMode[0]?.value);
      }

      setValue("jdExport", "");
      gptDetails?.addHiringRequest?.noofTalents &&
        setValue("talentsNumber", gptDetails?.addHiringRequest?.noofTalents);
      // gptDetails?.addHiringRequest?.availability &&
      //   setValue("availability", gptDetails?.addHiringRequest?.availability);
      if (gptDetails?.addHiringRequest?.availability) {
        let findAvailability = availability.filter(
          (item) => item.value === gptDetails?.addHiringRequest?.availability
        );
        setValue("availability", findAvailability[0]);
        setControlledAvailabilityValue(findAvailability[0].value);
      }

      if (gptDetails?.salesHiringRequest_Details?.budgetFrom > 0) {
        resetField("adhocBudgetCost");
        setValue("budget", { id: "", value: "2" });
        setControlledBudgetValue("2");
        setValue(
          "minimumBudget",
          gptDetails?.salesHiringRequest_Details?.budgetFrom
        );
      }

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

      gptDetails?.salesHiringRequest_Details?.currency &&
        setControlledCurrencyValue(
          gptDetails?.salesHiringRequest_Details?.currency
        );
      gptDetails?.salesHiringRequest_Details?.currency &&
        setValue("currency", {
          id: "",
          value: gptDetails?.salesHiringRequest_Details?.currency,
        });
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

      setHRdetails(gptDetails);
      setAddData(gptDetails);
      //   setValue("jdExport", "");
      //   setValue('talentsNumber',response?.responseBody?.details?.addHiringRequest?.noofTalents);
      //   setValue('availability',response?.responseBody?.details?.addHiringRequest?.availability);
      //   setValue(
      // 	"minimumBudget",
      // 	response?.responseBody?.details?.salesHiringRequest_Details?.budgetFrom
      //   );
      //   setValue(
      // 	"maximumBudget",
      // 	response?.responseBody?.details?.salesHiringRequest_Details?.budgetTo
      //   );
      //   setValue("years", response?.responseBody?.details?.salesHiringRequest_Details?.yearOfExp);
      //   setValue("months", response?.responseBody?.details?.salesHiringRequest_Details?.specificMonth);
      //   setValue(
      // 	"contractDuration",
      // 	response?.responseBody?.details?.salesHiringRequest_Details?.durationType
      //   );
      //   setValue('currency', response?.responseBody?.details?.salesHiringRequest_Details?.currency);
      //   const findWorkingMode = workingMode.filter(
      // 	  (item) => item?.value === response?.responseBody?.details?.modeOfWorkingId
      //   );
      //   setValue("workingMode", findWorkingMode[0]);
      //   // setControlledWorkingValue(findWorkingMode[0]?.value);
      //   setControlledCurrencyValue(response?.responseBody?.details?.salesHiringRequest_Details?.currency);
      //   setControlledFromTimeValue(response?.responseBody?.details?.salesHiringRequest_Details?.timeZoneFromTime);
      //   setControlledEndTimeValue(response?.responseBody?.details?.salesHiringRequest_Details?.timeZoneEndTime);
      //   setValue("fromTime",response?.responseBody?.details?.salesHiringRequest_Details?.timeZoneFromTime);
      //   setValue("endTime",response?.responseBody?.details?.salesHiringRequest_Details?.timeZoneEndTime);
      //   setValue('budget',"2");

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

    //set email when page open from client flow
    if (fromClientflow === true) {
      email = watchClientName;
    }

    setIsLoading(true);
    setIsSavedLoading(true);

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
      if (response.statusCode === HTTPStatusCode.OK) {
        setShowGPTModal(true);
        setGPTDetails(response?.responseBody?.details);
        setIsLoading(false);
        setIsSavedLoading(false);
      } else {
        setIsSavedLoading(false);
        setIsLoading(false);
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

  useEffect(() => {
    //setDefault values
    if (defaultPropertys !== null && defaultPropertys !== undefined) {
      let { talentsNumber, isTransparentPricing, currency } = defaultPropertys;

      if (talentsNumber > 0) {
        setValue("talentsNumber", talentsNumber);
      }

      setControlledCurrencyValue(currency);
      setValue("currency", { id: "", value: currency });

      setTypeOfPricing(isTransparentPricing === true ? 1 : 0);
      setDisableTypeOfPricing(true);
    }
  }, [removeFields, disabledFields, defaultPropertys, setValue]);

  useEffect(() => {
    if (defaultPropertys !== null && defaultPropertys !== undefined) {
      let { salesPerson: salesPersonID } = defaultPropertys;

      if (salesPersonID && salesPerson?.length > 0) {
        setIsSalesPersionDisable(disabledFields?.salesPerson);
        let salesUserObj = salesPerson.filter((p) => p.id === salesPersonID);
        setValue("salesPerson", salesUserObj[0]?.id);
        setSalesPersionNameFromEmail(salesUserObj[0]?.value);
      }
    }
  }, [defaultPropertys, salesPerson, disabledFields]);

  useEffect(() => {
    if (userCompanyTypeID === 1) {
      resetField("talentsNumber");
      setDisabledFields((prev) => ({ ...prev, talentRequired: false }));
      unregister("tempProject");
      setControlledTempProjectValue("Please select .");
      unregister("contractDuration");
      setIsProfileView(false);
      setIsVettedProfile(false);
      setIsPostaJob(false);
    }

    if (userCompanyTypeID === 2) {
      setValue("talentsNumber", 1);
      setDisabledFields((prev) => ({ ...prev, talentRequired: true }));
      if (watch("tempProject")?.value === false) {
        unregister("contractDuration");
        unregister("hiringPricingType");
      }
      if (watch("tempProject")?.value === true) {
        unregister("hiringPricingType");
        register("contractDuration");
      }
    }
  }, [userCompanyTypeID, watch("tempProject")]);
  const sanitizedDescription = (JobDescription) => {
    return DOMPurify.sanitize(JobDescription, {
      // ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'b', 'strong', 'i', 'em', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: {
        // '*': ['class'], // Allow class attribute for custom styling
        a: ["href", "target"], // Allow href and target for links
      },
    });
  };

  const validateCompanyName = async () => {
    setClientNameMessage("");
    clearErrors("clientName");
    setValue("clientName", "");
    setAutoCompleteValue("");
    setAddClient(false);
    setCompanyID(null);
    let payload = {
      workEmail: "",
      companyName: watch("companyName").trim(),
      currentCompanyID: 0,
    };

    const result = await allCompanyRequestDAO.validateClientCompanyDAO(payload);
    if (result.statusCode === HTTPStatusCode.OK) {
      setError("companyName", {
        type: "manual",
        message: "We couldn't find the company. Create company",
      });
      setShowAddCompany(true);
      //  setDisableSubmit(true)
    }
    if (result.statusCode === HTTPStatusCode.BAD_REQUEST) {
      clearErrors("companyName");
      setShowAddCompany(false);
      setCompanyID(result.details.companyID);
      getClientNameSuggestionHandler("", result.details.companyID);
      getPOCUsers(result.details.companyID);
      //  setDisableSubmit(false)
    }
  };

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
      setJobPostUsersDetails((prevDetails) =>
        prevDetails.map((detail, i) =>
          i === index ? { ...detail, contactNo: newValue } : detail
        )
      );
    }
  };

  return (
    <>
      {contextHolder}
      <div className={HRFieldStyle.hrFieldContainer}>
        <div className={HRFieldStyle.partOne}>
          <div className={HRFieldStyle.hrFieldLeftPane}>
            <h3>Hiring Request Details</h3>
            <p>Please provide the necessary details</p>
            {/* <p className={HRFieldStyle.teansactionMessage}>{companyType?.name &&`HR is "${companyType?.name}"`}</p> */}
            <LogoLoader visible={isSavedLoading} />
          </div>

          <form id="hrForm" className={HRFieldStyle.hrFieldRightPane}>
            <div className={HRFieldStyle.row}>
              <div className={HRFieldStyle.colMd6}>
                {/* <HRInputField
                  //	disabled={
                  //	pathName === ClientHRURL.ADD_NEW_CLIENT ||
                  //isCompanyNameAvailable ||
                  //isLoading
                  //}
                  // disabled={isCompanyNameAvailable ? true : false}
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "please enter the company name.",
                  }}
                  label="Company Name"
                  name="companyName"
                  onBlurHandler={()=>validateCompanyName()}
                  type={InputType.TEXT}
                  placeholder="Enter Company Name"
                  required
                /> */}

                <div className={HRFieldStyle.formGroup}>
                  <label>
                    Company Name <b style={{ color: "#E03A3A" }}>*</b>
                  </label>
                  <Controller
                    render={({ ...props }) => (
                      <AutoComplete
                        options={getCompanyNameSuggestion}
                        onSelect={(companyName, _obj) => {
                          setValue("companyName", companyName);
                          setCompanyAutoCompleteValue(companyName);
                          setCompanyID(_obj.companyID);
                          getClientNameSuggestionHandler("", _obj.companyID);
                          getPOCUsers(_obj.companyID);
                        }}
                        filterOption={true}
                        onSearch={(searchValue) => {
                          setCompanyAutoCompleteValue(searchValue);
                          if (searchValue) {
                            setCompanyNameSuggestion([]);
                            getCompanyNameSuggestionHandler(searchValue);
                          } else {
                            setClientNameMessage("");
                            clearErrors("clientName");
                            setValue("clientName", "");
                            setAutoCompleteValue("");
                            setAddClient(false);
                            setCompanyID(null);
                            clearErrors("companyName");
                            setShowAddCompany(false);
                          }
                        }}
                        value={companyautoCompleteValue}
                        onChange={(clientName) =>
                          setValue("companyName", clientName)
                        }
                        placeholder="Enter Company Name"
                        ref={controllerCompanyRef}
                      />
                    )}
                    {...register("companyName", {
                      companyvalidate,
                    })}
                    name="companyName"
                    // rules={{ required: true }}
                    control={control}
                  />
                  {errors.companyName && (
                    <div className={HRFieldStyle.error}>
                      {errors.companyName?.message &&
                        `* ${errors?.companyName?.message}`}
                    </div>
                  )}
                </div>
              </div>
              <div className={HRFieldStyle.colMd6}>
                {pathName === ClientHRURL.ADD_NEW_CLIENT ? (
                  <div className={HRFieldStyle.colMd12}>
                    <HRInputField
                      disabled={
                        pathName === ClientHRURL.ADD_NEW_CLIENT ||
                        isCompanyNameAvailable ||
                        isLoading
                      }
                      register={register}
                      errors={errors}
                      validationSchema={{
                        required: "please enter the client name.",
                      }}
                      label="Client Email/Name"
                      name="clientName"
                      type={InputType.TEXT}
                      placeholder={
                        watchClientName
                          ? watchClientName
                          : "Enter Client Email/Name"
                      }
                      required
                    />
                  </div>
                ) : (
                  <div className={HRFieldStyle.colMd12}>
                    <div className={HRFieldStyle.formGroup}>
                      <label>
                        Client Email/Name{" "}
                        <span className={HRFieldStyle.reqField}>*</span>
                      </label>
                      <Controller
                        render={({ ...props }) => (
                          <AutoComplete
                            disabled={
                              companyID === undefined || companyID === null
                                ? true
                                : false
                            }
                            options={getClientNameSuggestion}
                            onSelect={(clientName, _obj) => {
                              getClientNameValue(clientName, _obj);
                              setAutoCompleteValue(clientName);
                            }}
                            filterOption={true}
                            onSearch={(searchValue) => {
                              setClientNameSuggestion([]);
                              getClientNameSuggestionHandler(searchValue);
                              setAutoCompleteValue(searchValue);
                            }}
                            value={autoCompleteValue}
                            onChange={(clientName) =>
                              setValue("clientName", clientName)
                            }
                            placeholder={
                              watchClientName
                                ? watchClientName
                                : "Enter Client Email/Name"
                            }
                            ref={controllerRef}
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
                )}
              </div>
              <div className={HRFieldStyle.colMd6}>
                {showAddCompany && (
                  <div
                    className={HRFieldStyle.formPanelAction}
                    style={{
                      padding: "0 0 32px 0 ",
                      justifyContent: "flex-start",
                    }}
                  >
                    <button
                      onClick={() =>
                        navigate("/addNewCompany/0", {
                          state: {
                            createHR: true,
                            companyName: watch("companyName"),
                          },
                        })
                      }
                      className={HRFieldStyle.btnPrimary}
                    >
                      Add Company / Client
                    </button>
                  </div>
                )}
              </div>

              <div className={HRFieldStyle.colMd6}>
                {showAddClient && (
                  <div
                    className={HRFieldStyle.formPanelAction}
                    style={{
                      padding: "0 0 32px 0 ",
                      justifyContent: "flex-start",
                    }}
                  >
                    <button
                      onClick={() =>
                        navigate(`/addNewCompany/${companyID}`, {
                          state: { createHR: true },
                        })
                      }
                      className={HRFieldStyle.btnPrimary}
                    >
                      Add Client
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className={HRFieldStyle.row}>
              <div className={HRFieldStyle.colMd6}>
                <div className={HRFieldStyle.formGroup}>
                  {userData.LoggedInUserTypeID && isSalesPersionDisable ? (
                    <HRSelectField
                      key={"salesPersionDefaultDisabled"}
                      setValue={setValue}
                      searchable={true}
                      register={register}
                      label={"Sales Person"}
                      defaultValue={salesPersionNameFromEmail}
                      options={salesPerson && salesPerson}
                      name="salesPerson"
                      isError={errors["salesPerson"] && errors["salesPerson"]}
                      required
                      errorMsg={
                        errors?.salesPerson?.message ||
                        "Please select hiring request sales person"
                      }
                      disabled
                    />
                  ) : userData?.LoggedInUserTypeID === UserAccountRole.SALES ? (
                    <HRSelectField
                      key={"salesPersionEnabledSales"}
                      setValue={setValue}
                      searchable={true}
                      register={register}
                      label={"Sales Person"}
                      defaultValue={userData?.FullName}
                      options={salesPerson && salesPerson}
                      name="salesPerson"
                      isError={errors["salesPerson"] && errors["salesPerson"]}
                      required
                      errorMsg={
                        errors?.salesPerson?.message ||
                        "Please select hiring request sales person"
                      }
                      disabled={true}
                    />
                  ) : (
                    <HRSelectField
                      controlledValue={salesPersionNameFromEmail}
                      setControlledValue={setSalesPersionNameFromEmail}
                      mode={"id"}
                      isControlled={true}
                      key={"salesPersionEnabled"}
                      setValue={setValue}
                      searchable={true}
                      register={register}
                      label={"Sales Person"}
                      defaultValue={
                        salesPersionNameFromEmail?.length > 0
                          ? salesPersionNameFromEmail
                          : "Select Sales Persons"
                      }
                      options={salesPerson && salesPerson}
                      name="salesPerson"
                      isError={errors["salesPerson"] && errors["salesPerson"]}
                      required
                      errorMsg={
                        errors?.salesPerson?.message ||
                        "Please select hiring request sales person"
                      }
                      disabled={
                        userData?.LoggedInUserTypeID === UserAccountRole.SALES
                      }
                    />
                  )}
                </div>
              </div>

              {isSalesUserPartner && (
                <div className={HRFieldStyle.colMd6}>
                  <div className={HRFieldStyle.formGroup}>
                    <HRSelectField
                      setValue={setValue}
                      mode="id/value"
                      register={register}
                      label={"Child Companies"}
                      defaultValue="Select Company"
                      options={childCompany && childCompany}
                      name="childCompany"
                      isError={errors["childCompany"] && errors["childCompany"]}
                    />
                  </div>
                </div>
              )}

              {watchChildCompany?.id === 0 && (
                <div className={HRFieldStyle.colMd6}>
                  <div className={HRFieldStyle.formGroup}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      label={"Other Child Company Name"}
                      name="otherChildCompanyName"
                      type={InputType.TEXT}
                      placeholder="Child Company"
                    />
                  </div>
                </div>
              )}

              {/* <div className={HRFieldStyle.colMd6}>
								<div className={HRFieldStyle.formGroup}>
									<HRSelectField
										mode={'id/value'}
										searchable={true}
										setValue={setValue}
										register={register}
										label={'Hiring Request Role'}
										defaultValue="Select Role"
										options={talentRole && talentRole}
										name="role"
										isError={errors['role'] && errors['role']}
										required
										errorMsg={'Please select hiring request role'}
									/>
								</div>
							</div> */}

              {clientDetails?.isHybrid && (
                <div className={HRFieldStyle.colMd12}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: "32px",
                    }}
                  >
                    <label style={{ marginBottom: "12px" }}>
                      Type Of Company
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
                        setUserCompanyTypeID(e.target.value);
                        clearErrors();
                        resetField("tempProject");
                      }}
                      value={userCompanyTypeID}
                    >
                      <Radio value={1}>Pay Per Hire</Radio>
                      <Radio value={2}>Pay Per Credit</Radio>
                    </Radio.Group>
                  </div>
                </div>
              )}

              {/* Pay per Credit */}
              {userCompanyTypeID === 2 && (
                <div
                  className={HRFieldStyle.colMd12}
                  style={{ marginBottom: "32px" }}
                >
                  {!clientDetails?.isHybrid && (
                    <p className={HRFieldStyle.teansactionMessage}>
                      If you wish to create a pay per hire HR, edit company and
                      make the hybrid model selection for this account.
                    </p>
                  )}
                  <div>
                    {!hidePostJob && (
                      <Checkbox
                        checked={isPostaJob}
                        onClick={() => setIsPostaJob((prev) => !prev)}
                        disabled={disablePostJob}
                      >
                        Credit per post a job
                      </Checkbox>
                    )}
                    {/* {!hideProfileView && <Checkbox checked={isProfileView} onClick={()=> setIsProfileView(prev=> !prev)} disabled={disableProfileView}>
            Credit per profile view
						</Checkbox>	}   */}
                  </div>
                  {creditBaseCheckBoxError && !isPostaJob && !isProfileView && (
                    <p className={HRFieldStyle.error}>Please select Option</p>
                  )}
                  {isCreateHRDisable && (
                    <p
                      className={HRFieldStyle.error}
                      style={{ marginTop: "5px" }}
                    >
                      * Please purchase the subcription package, you do not have
                      enough credit balance
                    </p>
                  )}
                </div>
              )}

              {/* {userCompanyTypeID === 2 && isProfileView && <div className={HRFieldStyle.colMd12} style={{marginBottom: '32px'}}>
<Radio.Group
                  onChange={e=> {setIsVettedProfile(e.target.value)}}
                  value={isVettedProfile}
                  >
                  <Radio value={false}>Fast Profile</Radio>
                  <Radio value={true}>Vetted Profile</Radio>
                </Radio.Group>
</div> } */}

              {/* Pay per Hire  */}
              {userCompanyTypeID === 1 && (
                <div className={HRFieldStyle.colMd12}>
                  <div className={HRFieldStyle.formGroup}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label>
                        Type Of pricing{" "}
                        <span className={HRFieldStyle.reqField}>*</span>
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
                        disabled={disableYypeOfPricing}
                        // defaultValue={'client'}
                        // className={allengagementReplceTalentStyles.radioGroup}
                        onChange={(e) => {
                          setTypeOfPricing(e.target.value);
                          resetField("hiringPricingType");
                          resetField("availability");
                          setControlledAvailabilityValue("Select availability");
                          setPricingTypeError(false);
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
                  <HRSelectField
                    controlledValue={controlledAvailabilityValue}
                    setControlledValue={(val) => {
                      setControlledAvailabilityValue(val);
                      resetField("hiringPricingType");
                      resetField("payrollType");
                      setControlledHiringPricingTypeValue(
                        "Select Hiring Pricing"
                      );
                      if (userCompanyTypeID === 2) {
                        if (val === "Part Time") {
                          setValue("tempProject", {
                            id: undefined,
                            value: true,
                          });
                          setControlledTempProjectValue(true);
                        }
                      }
                    }}
                    isControlled={true}
                    mode={"id/value"}
                    setValue={setValue}
                    register={register}
                    label={
                      userCompanyTypeID === 2 ? "Job Type" : "Availability"
                    }
                    defaultValue="Select availability"
                    options={userCompanyTypeID === 2 ? JobTypes : availability}
                    name="availability"
                    isError={errors["availability"] && errors["availability"]}
                    required
                    errorMsg={`Please select the ${
                      userCompanyTypeID === 2 ? "job type" : "availability"
                    }.`}
                  />
                </div>
              </div>

              {/*  Duration in case of Pay Per Credit */}
              {userCompanyTypeID === 2 && (
                <>
                  {/* <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      <HRSelectField
                        controlledValue={controlledTempProjectValue}
                        setControlledValue={val=> {setControlledTempProjectValue(val); clearErrors('contractDuration')}}
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
                        required={userCompanyTypeID === 2 ? true : false}
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
                          options={contractDurations
                            .filter((item) => {
                              // if(watch('hiringPricingType')?.id === 1 || watch('hiringPricingType')?.id === 7)  return item?.value !== "-1" || item?.value !== "Indefinite"
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
                          // controlledValue={contractDurationValue}
                          // setControlledValue={setContractDuration}
                          // isControlled={true}
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
                            userCompanyTypeID === 2
                              ? watch("availability")?.id !== 2 ||
                                watch("tempProject")?.value === true
                                ? true
                                : false
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

              {userCompanyTypeID === 1 && (
                <>
                  {watch("availability")?.id && (
                    <div className={HRFieldStyle.colMd6}>
                      <div className={HRFieldStyle.formGroup}>
                        <HRSelectField
                          controlledValue={controlledHiringPricingTypeValue}
                          setControlledValue={(val) => {
                            setControlledHiringPricingTypeValue(val);
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
                          required={userCompanyTypeID === 1 ? true : false}
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
                      {/* {(watch('hiringPricingType')?.id !== 1) && <div className={HRFieldStyle.colMd6}>
                  <div className={HRFieldStyle.formGroup}>
                    <HRSelectField
                      mode={"id/value"}
                      searchable={false}
                      setValue={setValue}
                      register={register}
                      label={"Is this Hiring need Temporary for any project?"}
                      defaultValue={"Please Select"}
                      options={tempProjects.map((item) => ({
                        id: item.id,
                        label: item.text,
                        value: item.value,
                      }))}
                      name="tempProject"
                      isError={errors["tempProject"] && errors["tempProject"]}
                      // required={!isHRDirectPlacement}
                      required={(watch('hiringPricingType')?.id === 1 || watch('hiringPricingType')?.id === 4 || watch('hiringPricingType')?.id === 7 || watch('hiringPricingType')?.id === 8)? true : false}
                      errorMsg={"Please select."}
                    />
                  </div>
                </div>}
               */}
                      <div className={HRFieldStyle.colMd6}>
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
                            options={contractDurations
                              .filter((item) => {
                                if (
                                  watch("hiringPricingType")?.id === 1 ||
                                  watch("hiringPricingType")?.id === 7
                                )
                                  return item?.value !== "Indefinite";
                                return true;
                              })
                              .map((item) => ({
                                id: item.id,
                                label: item.text,
                                value: item.value,
                              }))}
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
                              errors["contractDuration"] &&
                              errors["contractDuration"]
                            }
                            // required={!isHRDirectPlacement}
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
                          {/* {console.log("req in month",(watch('hiringPricingType')?.id === 1 || watch('hiringPricingType')?.id === 2 || watch('hiringPricingType')?.id === 4 || watch('hiringPricingType')?.id === 5 || watch('hiringPricingType')?.id === 7 || watch('hiringPricingType')?.id === 8),watch('hiringPricingType'),
                  errors)} */}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {(watch("hiringPricingType")?.id === 3 ||
                watch("hiringPricingType")?.id === 6) && (
                <>
                  <div className={HRFieldStyle.colMd6}>
                    <div className={HRFieldStyle.formGroup}>
                      <HRSelectField
                        //  controlledValue={controlledAvailabilityValue}
                        //  setControlledValue={setControlledAvailabilityValue}
                        //  isControlled={true}
                        mode={"id/value"}
                        setValue={setValue}
                        register={register}
                        label={"Who will manage the payroll?"}
                        defaultValue="Select payroll"
                        options={payRollTypes}
                        name="payrollType"
                        isError={errors["payrollType"] && errors["payrollType"]}
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
                            errors["contractDuration"] &&
                            errors["contractDuration"]
                          }
                          // required={!isHRDirectPlacement}
                          required={
                            userCompanyTypeID === 1 &&
                            watch("payrollType")?.id === 4
                          }
                          errorMsg={
                            "Please select hiring request contract duration"
                          }
                          // disabled={isHRDirectPlacement}
                        />
                      </div>
                    </div>
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
            </div>

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
                <>
                  {userCompanyTypeID === 1 && (
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
                        required={!isHRDirectPlacement}
                      />
                    </div>
                  )}

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
                </>
              )}

              {/* {!isHRDirectPlacement && (
                <div className={HRFieldStyle.colMd6}>
                  <div className={HRFieldStyle.formGroup}>
                    <HRSelectField
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
              )} */}
            </div>

            <div className={HRFieldStyle.row}>
              <div className={HRFieldStyle.colMd4}>
                <div className={HRFieldStyle.formGroup}>
                  <HRSelectField
                    controlledValue={controlledBudgetValue}
                    setControlledValue={setControlledBudgetValue}
                    isControlled={true}
                    mode={"id/value"}
                    setValue={setValue}
                    register={register}
                    label={`${
                      isGUID
                        ? "Add your talent salary budget (Annum)"
                        : "Add your client estimated budget (Monthly)"
                    } `}
                    // label={`Add your ${isGUID ? 'talent salary' :'client estimated '  }  budget (${isGUID ? "Annum" : "Monthly"})`}
                    defaultValue="Select Budget"
                    options={budgets.map((item) => ({
                      id: item.id,
                      label: item.text,
                      value: item.value,
                    }))}
                    name="budget"
                    isError={errors["budget"] && errors["budget"]}
                    required
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
                          watch("availability")?.value === "Contract to Hire"
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
                  // label={`Estimated Minimum ${typeOfPricing === 1 || userCompanyTypeID === 2 ? "salary ":''}Budget (Monthly)`}
                  // label={isGUID ?  `${typeOfPricing === 1 || userCompanyTypeID === 2 ? "Talent Salary ":''}Estimated Minimum Budget (${isGUID ? "Annum" : "Monthly"})`: `Client Estimated Minimum Budget (${isGUID ? "Annum" : "Monthly"})`}
                  register={register}
                  name="minimumBudget"
                  type={InputType.NUMBER}
                  placeholder="Minimum- Ex: 2300, 2000"
                  required={watch("budget")?.value === "2"}
                  errors={errors}
                  validationSchema={{
                    required: "please enter the minimum budget.",
                    // min: {
                    //   value: 1,
                    //   message: `please don't enter the value less than 1`,
                    // },
                    min: {
                      value: isFreshersAllowed
                        ? 1
                        : watch("availability")?.value === "Full Time" ||
                          watch("availability")?.value === "Contract" ||
                          watch("availability")?.value === "Contract to Hire"
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
                  // label={isGUID ?   `${typeOfPricing === 1 || userCompanyTypeID === 2 ? "Talent Salary ":''}Estimated Maximum Budget (${isGUID ? "Annum" : "Monthly"})` : `Client Estimated Maximum Budget (${isGUID ? "Annum" : "Monthly"})`}
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

              {userCompanyTypeID === 1 && (
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

                      {!isGUID && (
                        <div className={HRFieldStyle.colMd4}>
                          <HRInputField
                            // label={(typeOfPricing === 0) ? watch('budget')?.value === "2" ? "Talent Estimated Pay ( Min -Max )" :  "Talent Estimated Pay" : watch('budget')?.value === "2" ?"Estimated Client needs to pay ( Min - Max )" : "Estimated Client needs to pay"}
                            register={register}
                            label={`Estimated Salary Budget(${
                              isGUID ? "Annum" : "Monthly"
                            })`}
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

              {/* {(watch('hiringPricingType')?.id === 3 || watch('hiringPricingType')?.id === 6 ) ? } */}
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
                {/* <HRSelectField
									// isControlled={true}
									// controlledValue={controlledGoodToHave}
									// setControlledValue={setControlledGoodToHave}
									// mode="multiple"
									mode="tags"
									setValue={setValue}
									register={register}
									label={'Compensation options'}
									placeholder="Type skills"
									// onChange={setSelectGoodToHaveItems}
									options={compensationOptions}
									// setOptions={setSkillMemo}
									name="compensationOptions"
									// isError={errors['goodToHaveSkills'] && errors['goodToHaveSkills']}
									// required
									// errorMsg={'Please select Compensation options.'}
								/> */}
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
                            <img src={plusSkill} loading="lazy" alt="star" />
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
            {/* <div className={`${HRFieldStyle.row} ${HRFieldStyle.fieldOr}`}>
              <div className={HRFieldStyle.colMd6}>
                {!getUploadFileData ? (
                  <HRInputField
                    disabled={jdURLLink}
                    register={register}
                    leadingIcon={<UploadSVG />}
                    label={`Job Description`}
                    name="jdExport"
                    type={InputType.BUTTON}
                    buttonLabel="Upload JD File"
                    // value="Upload JD File"
                    onClickHandler={() => {setUploadModal(true);setIsLoading(false);}}
                    required={!jdURLLink && !getUploadFileData}
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
                          setUploadFileData("");
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              {showUploadModal && (
                <UploadModal
                //   isGoogleDriveUpload={true}
                  isLoading={isLoading}
                  uploadFileHandler={uploadFileHandler}
                //   googleDriveFileUploader={() => googleDriveFileUploader()}
                //   uploadFileFromGoogleDriveLink={uploadFileFromGoogleDriveLink}
                  modalTitle={"Upload JD"}
                  modalSubtitle={"Job Description"}
                  isFooter={false}
                  openModal={showUploadModal}
                  setUploadModal={setUploadModal}
                  cancelModal={() => setUploadModal(false)}
                  setValidation={setValidation}
                  getValidation={getValidation}
                //   getGoogleDriveLink={getGoogleDriveLink}
                //   setGoogleDriveLink={setGoogleDriveLink}
                />
              )}
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
                  required={!getUploadFileData}
                  errors={errors}
                  onBlurHandler={(e) => onHandleFocusOut(e)}
                  validationSchema={
                    {
                      // pattern: {
                      // 	value: URLRegEx.url,
                      // 	message: 'Entered value does not match url format',
                      // },
                    }
                  }
                />
              </div>
            </div> */}
            <JobDescriptionComponent
              helperProps={{
                setUploadFileData,
                setValidation,
                setShowGPTModal,
                setGPTFileDetails,
                watch,
                isHaveJD,
                setIsHaveJD,
                textCopyPastData,
                setTextCopyPastData,
                parseType,
                setParseType,
                getTextDetils,
                watchClientName,
                filteredMemo,
                clientDetail,
              }}
            />

            {/* <div className={HRFieldStyle.row}>
              <div className={HRFieldStyle.colMd12}>
                <div className={HRFieldStyle.checkBoxGroup}>
                  <Checkbox onClick={toggleHRDirectPlacement}>
                    Is this HR a Direct Placement?
                  </Checkbox>
                </div>
              </div>
            </div> */}
            <br />

            {/* <div className={HRFieldStyle.row}>
							<div className={HRFieldStyle.colMd6}>
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
							</div>
						</div> */}

            <div className={HRFieldStyle.row}>
              {/* <div className={HRFieldStyle.colMd4}>
                <div className={HRFieldStyle.formGroup}>
                  <HRSelectField
                    setValue={setValue}
                    register={register}
                    mode={"id/value"}
                    label={"Long Term/Short Term"}
                    defaultValue="Select Term"
                    options={getDurationType.map((item) => ({
                      id: item.id,
                      label: item.text,
                      value: item.value,
                    }))}
                    name="getDurationType"
                    isError={
                      errors["getDurationType"] && errors["getDurationType"]
                    }
                    required={!isHRDirectPlacement}
                    errorMsg={"Please select duration type"}
                    disabled={isHRDirectPlacement}
                  />
                </div>
              </div> */}

              <div className={HRFieldStyle.colMd6}>
                <div className={HRFieldStyle.formGroup}>
                  <HRInputField
                    required
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
                    label="Required Experience"
                    errors={errors}
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
                        message: "please don't enter the value more than 60",
                      },
                    }}
                    register={register}
                    name="years"
                    type={InputType.NUMBER}
                    placeholder="Enter years"
                    disabled={isExpDisabled}
                  />
                </div>
              </div>

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
                {/* <Tooltip
              overlayStyle={{minWidth: '650px'}}
							placement="right"
							title={"Please provide actual salary ranges for job matching purposes. This information remains confidential to the talents and helps us connect you with suitable candidates."}>
								<img src={infoIcon} alt='info' />							
						</Tooltip> */}
              </div>
            </div>

            {/* {watch("availability")?.value === "Part Time" && (
              <div className={HRFieldStyle.row}>
                <div className={HRFieldStyle.colMd6}>
                  <div className={HRFieldStyle.formGroup}>
                    <HRSelectField
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
              {/* <div className={HRFieldStyle.colMd6}>
                <div className={HRFieldStyle.formGroup}>
                  <HRSelectField
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
              </div> */}
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
                        setValue("endTime", { id: "", value: endtime.value });
                      } else {
                        let endtime = getStartEndTimes[index + 18];
                        setControlledEndTimeValue(endtime.value);
                        setValue("endTime", { id: "", value: endtime.value });
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
                    // errorMsg={"Please select from time."}
                    // errorMsg={errors["fromTime"]?.message ?  errors["fromTime"].message : "Please select from time."}
                    errorMsg={
                      errors["fromTime"]
                        ? errors["fromTime"].message.length > 0
                          ? errors["fromTime"].message
                          : "Please select from time."
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
              {/* {userCompanyTypeID === 1 && <>
              {(removeFields !== null && removeFields?.dealID === true) ? null : <div className={HRFieldStyle.colMd6}>
                <HRInputField
                  register={register}
                  disabled={true}
                  label="Deal ID"
                  name="dealID"
                  type={InputType.NUMBER}
                  placeholder="Enter ID"
                />
              </div>}
              </>} */}
            </div>

            {userCompanyTypeID === 1 && (
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
                      required
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
                      required
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
              board, but will be used by the system/internal team to find more
              accurate match for this HR/Job.
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
                            <img src={plusSkill} loading="lazy" alt="star" />
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
                      Does the client require a talent with people management
                      experience?
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
                          Seeking candidates with startup experience, preferably
                          from a fast-paced and agile environment.
                        </li>
                        <li>
                          Targeting candidates with a background from [Specific
                          Company Name], where they developed [Desirable Skills
                          or Experience]
                        </li>
                        <li>
                          Looking for candidates who have hands-on experience
                          working with [Specific Tech Environment, e.g.
                          cloud-native, DevOps, etc.], preferably in a similar
                          industry/sector.
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
        {userCompanyTypeID === 2 && (
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
                              (user) => user.contactId === val[0].value
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
                                !val.some(
                                  (item2) => item2.value === item1.value
                                )
                            );

                            if (
                              notInA2[0].value ===
                              getContactAndSaleID?.contactID
                            ) {
                              message.error("Default POC can not be removed");
                              return prev;
                            }
                            setJobPostUsersDetails((prevItem) =>
                              prevItem.filter(
                                (it) => it.hrwiseContactId !== notInA2[0].value
                              )
                            );
                          } else {
                            // added item
                            const notInA2 = val.filter(
                              (item1) =>
                                !prev.some(
                                  (item2) => item2.value === item1.value
                                )
                            );
                            const iToAdd = activeUserDataList.find(
                              (user) => user.contactId === notInA2[0]?.value
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
                      <span>Show user information to talent</span> (Candidates
                      will be able to view the contact information (email and
                      phone number) of the selected users)
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
                          getContactAndSaleID?.contactID && (
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
                              <img src={DeleteCircleIcon} alt="delete-icon" />
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
                                getContactAndSaleID?.contactID && (
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
                                    handleContactNoChange(index, e.target.value)
                                  }
                                  onBlur={(e) => {
                                    const regex = /^[6-9]\d{9}$/;                                                                    
                                      if (e.target.value && !regex.test(e.target.value)) {      
                                        setJobPostUsersDetails(prevDetails =>
                                          prevDetails.map((detail, i) =>
                                            i === index ? { ...detail, contactNo: '' } : detail
                                          )
                                        );
                                        return message.error('Invalid phone number. Must be 10 digits and start with 6-9.');
                                      }
                                  }}
                                />
                                <Checkbox
                                  name="userShow"
                                  checked={Val?.contactNo?Val?.showContactNumberToTalent:false}
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
          <button
            style={{
              cursor: isCreateHRDisable
                ? "not-allowed"
                : type === SubmitType.SUBMIT
                ? "no-drop"
                : "pointer",
            }}
            disabled={isCreateHRDisable ? true : type === SubmitType.SUBMIT}
            className={HRFieldStyle.btn}
            onClick={hrSubmitHandler}
          >
            Save as Draft
          </button>

          <button
            onClick={handleSubmit(hrSubmitHandler)}
            className={HRFieldStyle.btnPrimary}
            disabled={isCreateHRDisable ? true : isSavedLoading}
          >
            Create HR
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
                    <b>{gptDetails?.salesHiringRequest_Details?.budgetFrom}</b>
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
                      {gptDetails?.salesHiringRequest_Details?.timeZoneFromTime}
                    </b>
                  </p>
                )}
                {gptDetails?.salesHiringRequest_Details?.timeZoneEndTime && (
                  <p>
                    To Time :{" "}
                    <b>
                      {gptDetails?.salesHiringRequest_Details?.timeZoneEndTime}
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
                    <h3 style={{ marginTop: "10px" }}>Good To Have Skills :</h3>
                    <div className={HRFieldStyle.skillsList}>
                      {gptDetails?.chatGptAllSkills?.length === 0 ? (
                        <p>NA</p>
                      ) : (
                        gptDetails?.chatGptAllSkills?.split(",").map((item) => {
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
                        <h3 style={{ marginTop: "10px" }}>Job Description :</h3>
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
      </div>
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
                          // setNearByCitiesData([firstCity]);
                          setNearByCitiesData(citiesVal);
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
                  showSearch={true}
                  filterOption={(input, option) => 
                    option.label.toLowerCase().includes(input.toLowerCase())
                  } 
                  options={allCities}
                  // options={nearByCitiesData}
                  onChange={(values, _) => setNearByCitesValues(values)}
                  placeholder="Select Compensation"
                  tokenSeparators={[","]}
                />

                <ul className={HRFieldStyle.selectFieldBox}>
                  {
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
                           setControlledValue={setControlledCountryName}
                           controlledValue={controlledCountryName}
                           isControlled={true}
                           mode={"id/value"}
                           searchable={false}
                           setValue={setValue}
                           register={register}
                           label={"Country"}
                           defaultValue="Select country"
                           options={country?.getCountry || []}
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
      // if(isDirectHR){
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
      //                     <HRSelectField
      //                       setControlledValue={setControlledCountryName}
      //                       controlledValue={controlledCountryName}
      //                       isControlled={true}
      //                       mode={"id/value"}
      //                       searchable={false}
      //                       setValue={setValue}
      //                       register={register}
      //                       label={"Country"}
      //                       defaultValue="Select country"
      //                       options={country?.getCountry || []}
      //                       name="country"
      //                       isError={errors["country"] && errors["country"]}
      //                       required
      //                       errorMsg={"Please select the country."}
      //                     />
      //                   </div>
      //             </div>
      //    </div>
      //   </>)
      // }
      // return (
      //   <>
      //     <div className={HRFieldStyle.row}>
      //     {(removeFields !== null && removeFields?.postalCode === true) ? null :    <div className={HRFieldStyle.colMd6}>
      //         <HRInputField
      //           register={register}
      //           errors={errors}
      //           validationSchema={{
      //             required: "please enter the postal code.",
      //             min: {
      //               value: 0,
      //               message: `please don't enter the value less than 0`,
      //             },
      //           }}
      //           label="Postal Code"
      //           name="postalCode"
      //           type={InputType.NUMBER}
      //           placeholder="Enter the Postal Code"
      //           // onChangeHandler={postalCodeHandler}
      //           required
      //         />
      //       </div>}

      //       <div className={HRFieldStyle.colMd6}>
      //         <div className={HRFieldStyle.formGroup}>
      //           <HRSelectField
      //             setControlledValue={setControlledCountryName}
      //             controlledValue={controlledCountryName}
      //             isControlled={true}
      //             mode={"id/value"}
      //             searchable={false}
      //             setValue={setValue}
      //             register={register}
      //             label={"Country"}
      //             defaultValue="Select country"
      //             options={country?.getCountry || []}
      //             name="country"
      //             isError={errors["country"] && errors["country"]}
      //             required={!controlledCountryName}
      //             errorMsg={"Please select the country."}
      //           />
      //         </div>
      //       </div>

      //       {(removeFields !== null && removeFields?.state === true) ? null : <div className={HRFieldStyle.colMd6}>
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

      //     {(removeFields !== null && removeFields?.address === true) ? null : <div className={HRFieldStyle.row}>
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
      //       </div>
      //     </div>}

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

export default HRFields;
