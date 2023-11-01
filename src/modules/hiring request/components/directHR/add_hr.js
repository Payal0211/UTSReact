import {
    Button,
    Checkbox,
    Divider,
    Space,
    message,
    AutoComplete,
    Modal,
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
//   import HRFieldStyle from "./add_hr_module.css";

import { Radio} from 'antd';
  import TextEditor from 'shared/components/textEditor/textEditor';
  import HRFieldStyle from "./addHr.module.css";
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

  import AddPlus from "assets/svg/AddPlus.svg";
  
  export const secondaryInterviewer = {
    interviewerId:"0",
    fullName: "",
    emailID: "",
    linkedin: "",
    designation: "",
  };


export default function AddHR({
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
    fromClientflow
  })  {

    const [userData, setUserData] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
      const getUserResult = async () => {
        let userData = UserSessionManagementController.getUserSession();
        if (userData) setUserData(userData);
      };
      getUserResult();
    }, []);

   
  
    const [isSavedLoading, setIsSavedLoading] = useState(false);
    const [controlledCountryName, setControlledCountryName] = useState("");
    const inputRef = useRef(null);
    const [getUploadFileData, setUploadFileData] = useState("");
    const [availability, setAvailability] = useState([]);
    // const [timeZonePref, setTimeZonePref] = useState([]);
    const [workingMode, setWorkingMode] = useState([]);
    const [controlledWorkingValue, setControlledWorkingValue] = useState(
      "Select working mode"
    );
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
    const [talentRole, setTalentRole] = useState([]);
    const [country, setCountry] = useState([]);
    const [currency, setCurrency] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [salesPerson, setSalesPerson] = useState([]);
    const [howSoon, setHowSoon] = useState([]);
    // const [region, setRegion] = useState([]); // removed 
    const [isLoading, setIsLoading] = useState(false);
    const [contractDurations, setcontractDurations] = useState([]);
    const [partialEngagements, setPartialEngagements] = useState([]);
    const [name, setName] = useState("");
    const [pathName, setPathName] = useState("");
    const [showUploadModal, setUploadModal] = useState(false);
    const [isCompanyNameAvailable, setIsCompanyNameAvailable] = useState(false);
  // from add client flow to enadle JD fields 
    useEffect(()=>{
      if(fromClientflow === true){
        setIsCompanyNameAvailable(true)
      }
    },[fromClientflow])
  
    const [addHRResponse, setAddHRResponse] = useState(null);
    const [type, setType] = useState("");
    const [isHRDirectPlacement, setHRDirectPlacement] = useState(false);
    const [getClientNameMessage, setClientNameMessage] = useState("");
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
    const [DealHRData, setDealHRData] = useState({});
    let controllerRef = useRef(null);
    const {
      watch,
      register,
      handleSubmit,
      setValue,
      setError,
      unregister,
      control,
      clearErrors,
      formState: { errors },
    } = useForm({
      defaultValues: {
        secondaryInterviewer: [],
      },
    });
  
    const [timeZoneList,setTimezoneList] = useState([]);
  
    const watchSalesPerson = watch("salesPerson");
    const watchChildCompany = watch("childCompany");
  
    const [showGPTModal, setShowGPTModal] = useState(false);
    const [gptDetails, setGPTDetails] = useState({});
    const [gptFileDetails, setGPTFileDetails] = useState({});
  
    /* const { fields, append, remove } = useFieldArray({
          control,
          name: 'secondaryInterviewer',
      }); */
  
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
          formData.append("clientemail", filteredMemo[0]?.emailId);
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
      },
      [getValidation, setJDDumpID, setJDParsedSkills, filteredMemo]
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
      setAvailability(
        availabilityResponse &&
          availabilityResponse.responseBody?.BindHiringAvailability
      );
    }, []);
  
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
      setTalentRole((preValue) => [
        ...preValue,
        {
          id: -1,
          value: "Others",
        },
      ]);
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
  
   
  
    const getClientNameValue = (clientName) => {
      setValue("clientName", clientName);
      setError("clientName", {
        type: "validate",
        message: "",
      });
    };
  
    const getClientNameSuggestionHandler = useCallback(
      async (clientName) => {
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
          setClientNameSuggestion([]);
          setClientNameMessage(response?.responseBody);
          //TODO:- JD Dump ID
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
  
    const getHRClientName = useCallback(
      async (watchClientName) => {
        if (watchClientName || filteredMemo) {
          let existingClientDetails =
            await hiringRequestDAO.getClientDetailRequestDAO(
              filteredMemo[0]?.emailId
                ? filteredMemo[0]?.emailId
                : watchClientName
            );
  
          existingClientDetails?.statusCode === HTTPStatusCode.OK &&
            setContactAndSalesID((prev) => ({
              ...prev,
              contactID: existingClientDetails?.responseBody?.contactid,
            }));
  
          /* setError('clientName', {
              type: 'duplicateCompanyName',
              message:
                  existingClientDetails?.statusCode === HTTPStatusCode.NOT_FOUND &&
                  'Client email does not exist.',
          }); */
          existingClientDetails.statusCode === HTTPStatusCode.NOT_FOUND &&
            setValue("clientName", "");
          existingClientDetails.statusCode === HTTPStatusCode.NOT_FOUND &&
            setValue("companyName", "");
          existingClientDetails.statusCode === HTTPStatusCode.OK &&
            setValue("companyName", existingClientDetails?.responseBody?.name);
          companyName(existingClientDetails?.responseBody?.name);
          existingClientDetails.statusCode === HTTPStatusCode.OK &&
            setIsCompanyNameAvailable(true);
          setIsLoading(false);
        }
      },
      [filteredMemo, setValue, watchClientName]
    );
  
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
    useEffect(() => {
      !isPostalCodeNotFound && debouncedFunction("POSTAL_CODE");
    }, [debouncedFunction, watchPostalCode, isPostalCodeNotFound]);
    useEffect(() => {
      if (country && country?.getCountry?.length > 1 && watchCountry) {
        !isPostalCodeNotFound && debouncedFunction("COUNTRY_CODE");
      }
    }, [country, debouncedFunction, isPostalCodeNotFound, watchCountry]);
  
    useEffect(() => {
      let timer;
      if (!_isNull(watchClientName)) {
        timer =
          pathName === ClientHRURL.ADD_NEW_HR &&
          setTimeout(() => {
            setIsLoading(true);
            getHRClientName(watchClientName);
          }, 2000);
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
  
    useEffect(
      () => {
        getAvailability();
        getTalentRole();
        // getSalesPerson();
        // getRegion();
        getTimeZoneList()
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
  
    const hrSubmitHandler = useCallback(
      async (d, type = SubmitType.SAVE_AS_DRAFT) => {
        setIsSavedLoading(true);
        // let hrFormDetails = hrUtils.hrFormDataFormatter(
        //   d,
        //   type,
        //   watch,
        //   contactID || getContactAndSaleID?.contactID,
        //   isHRDirectPlacement,
        //   addHRResponse,
        //   getUploadFileData && getUploadFileData,
        //   jdDumpID
        // );
  
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
  
  console.log("payload",d)
        // const addHRRequest = await hiringRequestDAO.createHRDAO(hrFormDetails);
  
        // if (addHRRequest.statusCode === HTTPStatusCode.OK) {
        //   window.scrollTo(0, 0);
        //   setIsSavedLoading(false);
        //   setAddHRResponse(addHRRequest?.responseBody?.details);
        //   if (params === "addnewhr") {
        //     interviewDetails(addHRRequest?.responseBody?.details);
        //   }
        //   setEnID(addHRRequest?.responseBody?.details?.en_Id);
        //   if (!!addHRRequest?.responseBody?.details?.jdURL)
        //     setJDParsedSkills({
        //       Skills: [],
        //       Responsibility: "",
        //       Requirements: "",
        //     });
        //   type !== SubmitType.SAVE_AS_DRAFT && setTitle("Debriefing HR");
  
        //   type !== SubmitType.SAVE_AS_DRAFT &&
        //     setTabFieldDisabled({ ...tabFieldDisabled, debriefingHR: false });
  
        //   if (type === SubmitType.SAVE_AS_DRAFT) {
        //     messageAPI.open({
        //       type: "success",
        //       content: "HR details has been saved to draft.",
        //     });
        //     setTimeout(() => {
        //       navigate("/allhiringrequest");
        //     }, 1000);
        //     // setTitle('Debriefing HR')
        //   }
        // }
        setIsSavedLoading(false);
      },
      [
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
      ]
    );
  

  
    useEffect(() => {
      if (errors?.clientName?.message) {
        controllerRef.current.focus();
      }
    }, [errors?.clientName]);
  
    useEffect(() => {
      setContactAndSalesID((prev) => ({ ...prev, salesID: watchSalesPerson }));
    }, [watchSalesPerson]);
  

  
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
  
        setHRdetails(_getHrValues);
      } else {
        //when URL
  
        const findWorkingMode = workingMode.filter(
          (item) => item?.id == gptDetails?.modeOfWorkingId
        );
  
        setValue("workingMode", findWorkingMode[0]);
        setControlledWorkingValue(findWorkingMode[0]?.value);
        setValue("jdExport", "");
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
  
        gptDetails?.salesHiringRequest_Details?.currency &&
          setControlledCurrencyValue(
            gptDetails?.salesHiringRequest_Details?.currency
          );
          gptDetails?.salesHiringRequest_Details?.currency && setValue('currency',{id:"",value:gptDetails?.salesHiringRequest_Details?.currency})
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
            "fromTime",{id: "", value: gptDetails?.salesHiringRequest_Details?.timeZoneFromTime}
            
          );
        gptDetails?.salesHiringRequest_Details?.timeZoneEndTime &&
          setValue(
            "endTime",{id: "", value: gptDetails?.salesHiringRequest_Details?.timeZoneEndTime}
            
          );
           setValue("budget", "2");
  
          setHRdetails(gptDetails);
          setAddData(gptDetails);
  
        setGPTDetails({});
        setShowGPTModal(false);
      }
    };
  
    const onHandleFocusOut = async (e) => {
      const regex = /\(([^)]+)\)/;
      const match = watchClientName.match(regex);
      let email = "";
      if (match && match.length > 1) {
        email = match[1];
      }
  
      //set email when page open from client flow
      if(fromClientflow === true){
        email = watchClientName
      }
    
      setIsLoading(true);
      setIsSavedLoading(true);
  
      const getResponse = async () => {
        const response = await hiringRequestDAO.extractTextUsingPythonDAO({
          clientEmail: email.trim(),
          psUrl: e.target.value,
        });
        if (response.statusCode === HTTPStatusCode.OK) {
          setShowGPTModal(true);
          setGPTDetails(response?.responseBody?.details);
          setIsLoading(false);
          setIsSavedLoading(false);
        }else{
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


    

  return (
    <div className={HRFieldStyle.addNewContainer}>
			<div className={HRFieldStyle.addHRTitle}>Add New Direct Hiring Request</div>

            <div className={HRFieldStyle.hrFieldContainer}>
            <div className={HRFieldStyle.partOne}>
            <div className={HRFieldStyle.hrFieldLeftPane}>
                <h3>Hiring Request Details</h3>
                <p>Please provide the necessary details</p>
                <LogoLoader visible={isSavedLoading} />
            </div>

            <form id="hrForm" className={HRFieldStyle.hrFieldRightPane}>
                <div className={HRFieldStyle.row}>
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
                        required: "Enter client email",
                        }}
                        label="Client Email"
                        name="clientName"
                        type={InputType.TEXT}
                       
                        required
                    />
                    </div>
                ) : (
                    <div className={HRFieldStyle.colMd12}>
                    <div className={HRFieldStyle.formGroup}>
                        <label>
                            Enter client email <span className={HRFieldStyle.required}>*</span>
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
                                setClientNameSuggestion([]);
                                getClientNameSuggestionHandler(searchValue);
                            }}
                            onChange={(clientName) =>
                                setValue("clientName", clientName)
                            }
                            placeholder={
                                watchClientName
                                ? watchClientName
                                : "Enter client email"
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
                <div className={HRFieldStyle.row}>
                <div className={HRFieldStyle.colMd6}>
                    <HRInputField
                    //	disabled={
                    //	pathName === ClientHRURL.ADD_NEW_CLIENT ||
                    //isCompanyNameAvailable ||
                    //isLoading
                    //}
                    disabled={isCompanyNameAvailable ? true : false}
                    register={register}
                    errors={errors}
                    validationSchema={{
                        required: "please enter the company name.",
                    }}
                    label="Client Name"
                    name="companyName"
                    type={InputType.TEXT}
                    placeholder="Enter client name"
                    required
                    />
                </div>

                <div className={HRFieldStyle.colMd6}>
                    <HRInputField
                    //	disabled={
                    //	pathName === ClientHRURL.ADD_NEW_CLIENT ||
                    //isCompanyNameAvailable ||
                    //isLoading
                    //}
                    disabled={isCompanyNameAvailable ? true : false}
                    register={register}
                    errors={errors}
                    validationSchema={{
                        required: "please enter the company URL.",
                    }}
                    label="Company URL"
                    name="companyURL"
                    type={InputType.TEXT}
                    placeholder="Enter company url"
                    required
                    />
                </div>

                <div className={HRFieldStyle.colMd6}>
                    <HRInputField
                    //	disabled={
                    //	pathName === ClientHRURL.ADD_NEW_CLIENT ||
                    //isCompanyNameAvailable ||
                    //isLoading
                    //}
                    disabled={isCompanyNameAvailable ? true : false}
                    register={register}
                    errors={errors}
                    validationSchema={{
                        required: "Years of Experience",
                    }}
                    label="Years of Experience"
                    name="reqExp"
                    type={InputType.TEXT}
                    placeholder="6"
                    required
                    />
                </div>

                <div className={HRFieldStyle.colMd6}>
                    <HRInputField
                    //	disabled={
                    //	pathName === ClientHRURL.ADD_NEW_CLIENT ||
                    //isCompanyNameAvailable ||
                    //isLoading
                    //}
                    disabled={isCompanyNameAvailable ? true : false}
                    register={register}
                    errors={errors}
                    validationSchema={{
                        required: "Hiring Request Title",
                    }}
                    label="Hiring Request Title"
                    name="requestTitle"
                    type={InputType.TEXT}
                    placeholder="Enter title"
                    required
                    />
                </div>

                <div className={HRFieldStyle.colMd12}>
                    <div className={HRFieldStyle.addHrProvideLinkWrap}>
                        {/* <HRInputField
                            // disabled={!isCompanyNameAvailable ? true : jdURLLink}
                            register={register}
                            leadingIcon={<UploadSVG />}
                            label={`Job Description`}
                            name="jdExport"
                            type={InputType.BUTTON}
                            buttonLabel="Upload JD file (doc, docx, pdf)"
                            // value="Upload JD File"
                            onClickHandler={() => setUploadModal(true)}
                            required={!jdURLLink && !getUploadFileData}
                            validationSchema={{
                            required: "please select a file.",
                            }}
                            errors={errors}
                        /> */}

                        <div className={HRFieldStyle.addHrProvideLink}>
                            You can also <p > provide a link</p>
                        </div>
                    </div>
                </div>

                <div className={HRFieldStyle.colMd12}>
                    <div className={HRFieldStyle.skillAddCustom}>
                        <HRInputField
                            register={register}
                            errors={errors}
                            
                            label="Top 5 must have skils"
                            name="otherSkill"
                            type={InputType.TEXT}
                            placeholder="Type skills"
                            maxLength={50}
                            required
                        />

                        <ul className={HRFieldStyle.selectFieldBox}>
                            <li>
                                <span> SQL
                                    <img src={AddPlus} loading="lazy" alt="star" /> 
                                </span>
                            </li>
                            <li>
                                <span> HTML
                                    <img src={AddPlus} loading="lazy" alt="star" /> 
                                </span>
                            </li>
                            <li>
                                <span> Python
                                    <img src={AddPlus} loading="lazy" alt="star" /> 
                                </span>
                            </li>
                            <li>
                                <span> CSS
                                    <img src={AddPlus} loading="lazy" alt="star" /> 
                                </span>
                            </li>
                            <li>
                                <span> MongoDB
                                    <img src={AddPlus} loading="lazy" alt="star" /> 
                                </span>
                            </li>
                            <li>
                                <span> React.js
                                    <img src={AddPlus} loading="lazy" alt="star" /> 
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                </div>
            
                <div className={HRFieldStyle.row}>
                    <div className={HRFieldStyle.colMd4}>
                        <div className={HRFieldStyle.formGroup}>
                        <HRSelectField
                            mode={"id/value"}
                            setValue={setValue}
                            register={register}
                            label={"Add your estimated budget (Monthly)"}
                            defaultValue="Select Currency"
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
                    
                    <div className={HRFieldStyle.colMd8}>
                        <div className={HRFieldStyle.minimumValueWrap}>
                            <HRInputField
                            // label={"Minimum Budget (Monthly)"}
                            register={register}
                            name="minimumBudget"
                            type={InputType.NUMBER}
                            placeholder="Minimum- Ex: 2300, 2000"
                            required={watch("budget")?.value === "2"}
                            labelClassName="minimumCustom"
                            errors={errors}
                            validationSchema={{
                                required: "please enter the minimum budget.",
                                min: {
                                value: 1,
                                message: `please don't enter the value less than 1`,
                                },
                            }}
                            
                            />

                            <HRInputField
                            // label={"Maximum Budget (Monthly)"}
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
                            
                            />
                        </div>
                    </div>

                    <div className={HRFieldStyle.colMd12}>
                        <div className={HRFieldStyle.radioFormGroupWrap}>
                            <label>Is this remote opportunity <span className={HRFieldStyle.reqField}>*</span></label>
                            <div className={HRFieldStyle.radioFormGroup}>
                                <Radio.Group className={HRFieldStyle.radioGroup}>
                                    <Radio>
                                    Yes
                                    </Radio>
                                </Radio.Group>

                                <Radio.Group className={HRFieldStyle.radioGroup}>
                                    <Radio>
                                        No
                                    </Radio>
                                </Radio.Group>
                            </div>
                        </div>
                    </div>
                    
                </div>

               

                <div className={HRFieldStyle.row}>
                <div className={HRFieldStyle.colMd4}>
                    <div className={HRFieldStyle.formGroup}>
                        <HRSelectField
                            setValue={setValue}
                            register={register}
                            mode={"id/value"}
                            label={"Lead Type"}
                            defaultValue="Inbound"
                            name="getDurationType"
                        />
                    </div>
                </div>
                <div className={HRFieldStyle.colMd4}>
                    <div className={HRFieldStyle.formGroup}>
                            <HRSelectField
                            setValue={setValue}
                            register={register}
                            mode={"id/value"}
                            label={"Lead Owner"}
                            defaultValue="Anjali Baliyan"
                            name="getDurationType"
                        />
                    </div>
                </div>
                <div className={HRFieldStyle.colMd4}>
                    <div className={HRFieldStyle.formGroup}>
                            <HRSelectField
                            setValue={setValue}
                            register={register}
                            mode={"id/value"}
                            label={"Notice period"}
                            defaultValue="30 Days"
                            name="getDurationType"
                        />
                    </div>
                </div>
                </div>

                <div className={HRFieldStyle.row}>
                        
                    <div className={HRFieldStyle.colMd4}>
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
                                options={timeZoneList}
                                name="timeZone"
                                isError={errors["timeZone"] && errors["timeZone"]}
                                required
                                errorMsg={"Please select hiring request time zone."}
                            />
                        </div>
                    </div>

                    <div className={HRFieldStyle.colMd8}>
                        <label className={HRFieldStyle.timezoneLabel}>Shift Start and End Time <span className={HRFieldStyle.required}>*</span></label>
                        <div className={HRFieldStyle.timezoneWrap}>
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
                                    // label={"From Time"}
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
                                    errorMsg={"Please select from time."}
                                />
                            </div>
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
                                // label={"End Time"}
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

                </div>

                <div className={HRFieldStyle.row}>
                    <div className={HRFieldStyle.colMd12}>
                            <TextEditor
								isControlled={true}
								// controlledValue={JDParsedSkills?.Responsibility || ''}
								// controlledValue={ addData?.addHiringRequest?.guid ? testJSON(addData?.salesHiringRequest_Details
								// 	?.rolesResponsibilities)? createListMarkup(JSON.parse(addData?.salesHiringRequest_Details
								// 	?.rolesResponsibilities)) : addData?.salesHiringRequest_Details
								// 	?.rolesResponsibilities :
								// 	JDParsedSkills?.Responsibility ||
								// 	(addData?.salesHiringRequest_Details
								// 		?.rolesResponsibilities )
								// }
								label={'Roles & Responsibilities'}
								placeholder={'Enter requirements'}
								required
								setValue={setValue}
								watch={watch}
								register={register}
								errors={errors}
								name="roleAndResponsibilities"
							/>
                    </div>

                    <div className={HRFieldStyle.colMd12}>
                            <TextEditor
								isControlled={true}
								// controlledValue={JDParsedSkills?.Responsibility || ''}
								// controlledValue={ addData?.addHiringRequest?.guid ? testJSON(addData?.salesHiringRequest_Details
								// 	?.rolesResponsibilities)? createListMarkup(JSON.parse(addData?.salesHiringRequest_Details
								// 	?.rolesResponsibilities)) : addData?.salesHiringRequest_Details
								// 	?.rolesResponsibilities :
								// 	JDParsedSkills?.Responsibility ||
								// 	(addData?.salesHiringRequest_Details
								// 		?.rolesResponsibilities )
								// }
								label={'Requirements'}
								placeholder={'Enter requirements'}
								required
								setValue={setValue}
								watch={watch}
								register={register}
								errors={errors}
								name="roleAndResponsibilities"
							/>
                    </div>

                    <div className={HRFieldStyle.colMd12}>
                            <TextEditor
								isControlled={true}
								// controlledValue={JDParsedSkills?.Responsibility || ''}
								// controlledValue={ addData?.addHiringRequest?.guid ? testJSON(addData?.salesHiringRequest_Details
								// 	?.rolesResponsibilities)? createListMarkup(JSON.parse(addData?.salesHiringRequest_Details
								// 	?.rolesResponsibilities)) : addData?.salesHiringRequest_Details
								// 	?.rolesResponsibilities :
								// 	JDParsedSkills?.Responsibility ||
								// 	(addData?.salesHiringRequest_Details
								// 		?.rolesResponsibilities )
								// }
								label={'About Company'}
								placeholder={'Enter about company'}
								required
								setValue={setValue}
								watch={watch}
								register={register}
								errors={errors}
								name="roleAndResponsibilities"
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

            <button
                onClick={handleSubmit(hrSubmitHandler)}
                className={HRFieldStyle.btnPrimary}
                disabled={isSavedLoading}
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
                    {gptDetails?.salesHiringRequest_Details?.yearOfExp && (
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
            </div>
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
                  min: {
                    value: 0,
                    message: `please don't enter the value less than 0`,
                  },
                }}
                label="Postal Code"
                name="postalCode"
                type={InputType.NUMBER}
                placeholder="Enter the Postal Code"
                // onChangeHandler={postalCodeHandler}
                required
              />
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
                  required={!controlledCountryName}
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
}
