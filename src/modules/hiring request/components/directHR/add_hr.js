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

import { Radio } from "antd";
import TextEditor from "shared/components/textEditor/textEditor";
import HRFieldStyle from "./addHr.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { ReactComponent as UploadSVG } from "assets/svg/upload.svg";
import { ReactComponent as LinkSVG } from "assets/svg/link.svg";
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

export default function AddHR(
  {
    // setJDDumpID,
    // jdDumpID,
    // setTitle,
    // clientDetail,
    // setEnID,
    // tabFieldDisabled,
    // setTabFieldDisabled,
    // setJDParsedSkills,
    // contactID,
    // interviewDetails,
    // companyName,
    // params,
    // getHRdetails,
    // setHRdetails,
    // setAddData,
    // fromClientflow
  }
) {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const getUserResult = async () => {
      let userData = UserSessionManagementController.getUserSession();
      if (userData) setUserData(userData);
    };
    getUserResult();
  }, []);

  const [isSpecialEdit, setIsSpacialEdit] = useState(false)
  const [isHRRemote, setIsHRRemote] = useState(true);
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const [controlledCountryName, setControlledCountryName] = useState("");
  const inputRef = useRef(null);
  const [getUploadFileData, setUploadFileData] = useState("");
  // const [timeZonePref, setTimeZonePref] = useState([]);
  const [workingMode, setWorkingMode] = useState([]);
  const [skillSuggestionList, setSkillSuggestionList] = useState([]);

  const [talentRole, setTalentRole] = useState([]);
  const [country, setCountry] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [howSoon, setHowSoon] = useState([]);
  // const [region, setRegion] = useState([]); // removed
  const [isLoading, setIsLoading] = useState(false);
  const [contractDurations, setcontractDurations] = useState([]);
  const [partialEngagements, setPartialEngagements] = useState([]);
  const [name, setName] = useState("");
  const [pathName, setPathName] = useState("");
  const [showUploadModal, setUploadModal] = useState(false);
  const [isCompanyNameAvailable, setIsCompanyNameAvailable] = useState(false);
  const [controlledRequirenments, setControlledRequirements] = useState("");
  const [
    controlledRolesAndResponsibilities,
    setControlledRolesAndResponsibilities,
  ] = useState("");

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
  const [getClientEmailSuggestion, setClientEmailSuggestion] = useState([]);
  const [isNewPostalCodeModal, setNewPostalCodeModal] = useState(false);
  const [isPostalCodeNotFound, setPostalCodeNotFound] = useState(false);
  const [controlledTimeZoneValue, setControlledTimeZoneValue] =
    useState("Select time zone");
  const [controlledFromTimeValue, setControlledFromTimeValue] =
    useState("Select From Time");
  const [controlledEndTimeValue, setControlledEndTimeValue] =
    useState("Select End Time");
  const [controlledRoleValue, setControlledRoleValue] = useState("Select Role");

  const [DealHRData, setDealHRData] = useState({});
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
    formState: { errors },
  } = useForm();

  const [timeZoneList, setTimezoneList] = useState([]);

  const [controlledCurrencyValue, setControlledCurrencyValue] =
    useState("Select Currency");
  const watchChildCompany = watch("childCompany");

  const [showGPTModal, setShowGPTModal] = useState(false);
  const [gptDetails, setGPTDetails] = useState({});
  const [gptFileDetails, setGPTFileDetails] = useState({});
  const [jdDumpID, setJDDumpID] = useState(0);

  const [isJDURL, setISJDURL] = useState(false);
  const [combinedSkillsMemo, setCombinedSkillsMemo] = useState([]);
  const [controlledJDParsed, setControlledJDParsed] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [skills, setSkills] = useState([]);
  const [leadSource, setLeadSource] = useState([]);
  const [leadOwner, setLeadOwner] = useState([]);
  const [controlledDealSource, setControlledDealSource] = useState();

  const getSkills = useCallback(async () => {
    const response = await MasterDAO.getSkillsRequestDAO();
    setSkills(response && response.responseBody);
  }, []);

  const watchClientName = watch("clientName");
  const _endTime = watch("endTime");
  let filteredMemo = useMemo(() => {
    let filteredData = getClientEmailSuggestion?.filter(
      (item) => item?.value === watchClientName
    );
    return filteredData;
  }, [getClientEmailSuggestion, watchClientName]);

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

          message.success("File uploaded successfully");
        }
      }
    },
    [getValidation]
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
    [getValidation, filteredMemo]
  );

  const createListMarkup = (list) => {
    if (list?.length) {
      let listText = "<ul class='rolesText'>";

      list?.forEach((item) => {
        listText += `<li>${item}</li>`;
      });

      return listText + "</ul>";
    }
  };

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

    if(talentRole.statusCode === HTTPStatusCode.OK){
       setTalentRole(talentRole && talentRole.responseBody);
    setTalentRole((preValue) => [
      ...preValue,
      {
        id: -1,
        value: "Others",
      },
    ]);
    }
   
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

  // const getRegion = useCallback(async () => {
  //   let response = await MasterDAO.getTalentTimeZoneRequestDAO();
  //   setRegion(response && response?.responseBody);
  // }, []);
  const getDirectHR = useCallback(async () => {
    let response = await MasterDAO.getMasterDirectHRRequestDAO();
    // setTimezoneList(response && response?.responseBody);
    if (response.statusCode === HTTPStatusCode.OK) {
      let data = response.responseBody.Data;
      setIsSpacialEdit(data.AllowSpecialEdit)
      setLeadOwner(
        data.DRPLeadUsers.filter((item) => item.value !== "0").map((item) => ({
          ...item,
          text: item.value,
          value: item.text,
        }))
      );
      setLeadSource(data.LeadSource);
    }
  }, []);

  let watchLeadSource = watch("leadType");

  const getLeadOwnerBytype = async (type) => {
    let result = await MasterDAO.getLeadTypeDAO(type);
    // console.log("fatchpreOnBoardInfo", result.responseBody.details);

    if (result?.statusCode === HTTPStatusCode.OK) {
      resetField("leadOwner");
      setControlledDealSource();
      setLeadOwner(
        result.responseBody.details.Data.LeadTypeList.filter(
          (item) => item.value !== "0"
        ).map((item) => ({ ...item, text: item.value, value: item.text }))
      );
    }
  };

  useEffect(() => {
    if (watchLeadSource?.value) {
      getLeadOwnerBytype(watchLeadSource.value);
      resetField("leadOwner");
      setControlledDealSource();
    }
  }, [watchLeadSource, setValue, resetField]);

  const getTimeZoneList = useCallback(async () => {
    let response = await MasterDAO.getTimeZoneRequestDAO();
    setTimezoneList(response && response?.responseBody);
  }, [setTimezoneList]);

  const getLocation = useLocation();

  const getContentID = async (emailID) => {
    let existingClientDetails =
      await hiringRequestDAO.getClientDetailRequestDAO(emailID);

    existingClientDetails?.statusCode === HTTPStatusCode.OK &&
      setContactAndSalesID((prev) => ({
        ...prev,
        contactID: existingClientDetails?.responseBody?.contactid,
      }));
  };

  const getClientNameValue = (clientName, _) => {
    setValue("clientEmail", _.emailId);
    setValue("clientName", clientName);
    setValue("companyName", _.company);
    setValue("companyURL", _.companyURL);
    getContentID(_.emailId);
    // setError("clientEmail", {
    //   type: "validate",
    //   message: "",
    // });
    // setError("companyName", {
    //   type: "validate",
    //   message: "",
    // });
    // setError("clientName", {
    //   type: "validate",
    //   message: "",
    // });
  };

  const getClientNameSuggestionHandler = useCallback(
    async (clientEmail) => {
      let response = await MasterDAO.getEmailSuggestionDAO(clientEmail);
      if (response?.statusCode === HTTPStatusCode.OK) {
        setClientEmailSuggestion(response?.responseBody?.details);
        setClientNameMessage("");
        clearErrors("clientEmail");
      } else if (
        response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
        response?.statusCode === HTTPStatusCode.NOT_FOUND
      ) {
        setError("clientEmail", {
          type: "validate",
          message: response?.responseBody,
        });
        setClientEmailSuggestion([]);
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

  const ControlledRoleChangeHandler = (role) => {
    // set role and title if selected from Dropdown
    setControlledRoleValue(role);
    setValue("requestTitle", role);
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

  // useEffect(() => {
  //   let timer;
  //   if (!_isNull(watchClientName)) {
  //     timer = setTimeout(() => {
  //         getHRClientName(watchClientName);
  //       }, 2000);
  //   }
  //   return () => clearTimeout(timer);
  // }, [getHRClientName, watchClientName]);
  // //console.log("watchClientName",watchClientName);
  // useEffect(() => {
  //   let urlSplitter = `${getLocation.pathname.split("/")[2]}`;
  //   setPathName(urlSplitter);
  //   pathName === ClientHRURL.ADD_NEW_CLIENT &&
  //     setValue("clientName", clientDetail?.clientemail);
  //   pathName === ClientHRURL.ADD_NEW_CLIENT &&
  //     setValue("companyName", clientDetail?.companyname);
  // }, [
  //   getLocation.pathname,
  //   clientDetail?.clientemail,
  //   clientDetail?.companyname,
  //   pathName,
  //   setValue,
  // ]);
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

  // useEffect(() => {
  //   !_isNull(prefRegion) && getTimeZonePreference();
  // }, [prefRegion, getTimeZonePreference]);

  useEffect(
    () => {
      getTalentRole();
      // getSalesPerson();
      // getRegion();
      getTimeZoneList();
      getDirectHR();
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
      getSkills();
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
    if (jdURLLink) {
      unregister("jdExport");
    }
  }, [jdURLLink, unregister]);

  const onSelectSkill = (skill) => {
    // let _selected = combinedSkillsMemo.filter((val) => val?.value === skill);
    // let _controlledJDParsed = [...controlledJDParsed];
    // let _index = _controlledJDParsed.findIndex((obj) => obj.id === _selected[0].id);
    // if(_index === -1){
    // 	_controlledJDParsed.push({id: '0', value: skill});
    // }
    // // console.log({skill, combinedSkillsMemo,_selected,_index ,_controlledJDParsed,controlledJDParsed})
    // setControlledJDParsed(_controlledJDParsed);
    // setValue('skills',_controlledJDParsed)
    let _controlledJDParsed = [...controlledJDParsed];
    let _index = _controlledJDParsed.findIndex((obj) => obj.id === skill.id);
    if (_index === -1) {
      // _controlledJDParsed.push(_selected[0]);
      _controlledJDParsed.push({ id: skill.id, value: skill.value.trim() });
      setSkills((prev) => [
        ...prev,
        { id: skill.id, value: skill.value.trim() },
      ]);
    } else {
      return;
    }


    setControlledJDParsed(_controlledJDParsed);
    setValue("skills", _controlledJDParsed);
  };

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

      let skillList = d.skills.map((item) => {
        const obj = {
          skillsID: item.id,
          skillsName: item.value,
        };
        return obj;
      });

      let payload = {
        hrid: 0,
        contactID: getContactAndSaleID.contactID,
        clientEmailID: d.clientEmail,
        companyName: d.companyName,
        clientName: d.clientName.split("(")[0].trim(),
        companyURL: d.companyURL,
        yoe: d.reqExp,
        hiringRequestTitle: d.requestTitle,
        hrRoleId: d.role.id,
        jdFileName: getUploadFileData,
        jdurl: d.jdURL,
        mustHaveSkillsArray: skillList,
        mustHaveSkills: d.skills.map((skill) => skill.value).join(","),
        currency: d.currency.value,
        minimumBudget: d.minimumBudget,
        maximumBudget: d.maximumBudget,
        isRemote: isHRRemote,
        leadTypeId: d.leadType.id,
        leadType: d.leadType.value,
        leadOwnerId: d.leadOwner.id,
        noticePeriodId: d.noticePeriod.id,
        timezoneId: d.timeZone.id,
        shiftStartTime: d.fromTime.value,
        shiftEndTime: d.endTime.value,
        rolesResponsibilities: d.roleAndResponsibilities,
        requirements: d.requirements,
        aboutCompany: d.aboutCompany,
        jdDumpId: jdDumpID,
        en_Id: "",
        isSpecialEdit: isSpecialEdit,
      };

      if (watch("fromTime").value === watch("endTime").value) {
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
      } else if (type !== SubmitType.SAVE_AS_DRAFT) {
        setType(SubmitType.SUBMIT);
      }


      const addHRRequest = await hiringRequestDAO.createDirectHRDAO(payload);

      if (addHRRequest.statusCode === HTTPStatusCode.OK) {
        message.success("Direct HR Created");
        navigate("/allhiringrequest");
        // window.scrollTo(0, 0);
        // setIsSavedLoading(false);
        // setAddHRResponse(addHRRequest?.responseBody?.details);
        // if (params === "addnewhr") {
        //   interviewDetails(addHRRequest?.responseBody?.details);
        // }
        // setEnID(addHRRequest?.responseBody?.details?.en_Id);
        // if (!!addHRRequest?.responseBody?.details?.jdURL)
        //   setJDParsedSkills({
        //     Skills: [],
        //     Responsibility: "",
        //     Requirements: "",
        //   });
        // type !== SubmitType.SAVE_AS_DRAFT && setTitle("Debriefing HR");

        // type !== SubmitType.SAVE_AS_DRAFT &&
        //   setTabFieldDisabled({ ...tabFieldDisabled, debriefingHR: false });

        // if (type === SubmitType.SAVE_AS_DRAFT) {
        //   messageAPI.open({
        //     type: "success",
        //     content: "HR details has been saved to draft.",
        //   });
        //   setTimeout(() => {
        //     navigate("/allhiringrequest");
        //   }, 1000);
        // setTitle('Debriefing HR')
        // }
      }
      setIsSavedLoading(false);
    },
    [
      addHRResponse,
      isHRRemote,
      getContactAndSaleID?.contactID,
      getUploadFileData,
      isHRDirectPlacement,
      messageAPI,
      setError,
      watch,
      jdDumpID,
      isSpecialEdit
    ]
  );

  useEffect(() => {
    if (errors?.clientName?.message) {
      controllerRef.current.focus();
    }
  }, [errors?.clientName]);

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

      setShowGPTModal(false);
      setControlledRequirements(gptFileDetails.Requirements);
      setValue("requirements", gptFileDetails.Requirements);
      setControlledRolesAndResponsibilities(gptFileDetails.Responsibility);
      setValue("roleAndResponsibilities", gptFileDetails.Responsibility);
      setJDDumpID(gptFileDetails.JDDumpID);
      gptFileDetails.Skills.length > 0 &&
        setSkillSuggestionList(gptFileDetails.Skills);
      setGPTFileDetails({});
      // let _getHrValues = { ...getHRdetails };

      // _getHrValues.salesHiringRequest_Details.requirement =
      //   gptFileDetails.Requirements;
      // _getHrValues.salesHiringRequest_Details.roleAndResponsibilities =
      //   gptFileDetails.Responsibility;
      // _getHrValues.salesHiringRequest_Details.rolesResponsibilities =
      //   gptFileDetails.Responsibility;
      // _getHrValues.addHiringRequest.jdurl = "";
      // _getHrValues.addHiringRequest.jdfilename = gptFileDetails.FileName;

      // setHRdetails(_getHrValues);
    } else {
      //when URL
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
        setValue("reqExp", gptDetails?.salesHiringRequest_Details?.yearOfExp);

      // time set if available
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

      gptDetails?.salesHiringRequest_Details?.currency &&
        setControlledCurrencyValue(
          gptDetails?.salesHiringRequest_Details?.currency
        );
      gptDetails?.salesHiringRequest_Details?.currency &&
        setValue("currency", {
          id: "",
          value: gptDetails?.salesHiringRequest_Details?.currency,
        });

      if (gptDetails?.modeOfWorkingId == "1") {
        setIsHRRemote(true);
      } else {
        setIsHRRemote(false);
      }

      gptDetails?.addHiringRequest?.requestForTalent && setValue("requestTitle", gptDetails?.addHiringRequest?.requestForTalent);
      // gptDetails?.chatGptSkills && setSkillSuggestionList(gptDetails?.chatGptSkills?.split(","))
      //add skill suggestion
      gptDetails?.skillmulticheckbox.length &&
        setSkillSuggestionList(
          gptDetails?.skillmulticheckbox.map((item) => ({
            ...item,
            value: item.text,
          }))
        );

      if (gptDetails?.salesHiringRequest_Details?.rolesResponsibilities) {
        setControlledRolesAndResponsibilities(
          testJSON(
            gptDetails?.salesHiringRequest_Details?.rolesResponsibilities
          )
            ? createListMarkup(
                JSON.parse(
                  gptDetails?.salesHiringRequest_Details?.rolesResponsibilities
                )
              )
            : gptDetails?.salesHiringRequest_Details?.rolesResponsibilities
        );
        setValue(
          "roleAndResponsibilities",
          testJSON(
            gptDetails?.salesHiringRequest_Details?.rolesResponsibilities
          )
            ? createListMarkup(
                JSON.parse(
                  gptDetails?.salesHiringRequest_Details?.rolesResponsibilities
                )
              )
            : gptDetails?.salesHiringRequest_Details?.rolesResponsibilities
        );
      }
      if (gptDetails?.salesHiringRequest_Details?.requirement) {
        setControlledRequirements(
          testJSON(gptDetails?.salesHiringRequest_Details?.requirement)
            ? createListMarkup(
                JSON.parse(gptDetails?.salesHiringRequest_Details?.requirement)
              )
            : gptDetails?.salesHiringRequest_Details?.requirement
        );
        setValue(
          "requirements",
          testJSON(gptDetails?.salesHiringRequest_Details?.requirement)
            ? createListMarkup(
                JSON.parse(gptDetails?.salesHiringRequest_Details?.requirement)
              )
            : gptDetails?.salesHiringRequest_Details?.requirement
        );
      }

      if (gptDetails?.addHiringRequest?.requestForTalent) {
        const findRole = talentRole.filter(
          (item) =>
            item?.value === gptDetails?.addHiringRequest?.requestForTalent
        );
        setValue("role", findRole[0]);
        setControlledRoleValue(findRole[0]?.value);
      }

      setValue("jdExport", "");
      // setHRdetails(gptDetails);
      // setAddData(gptDetails);

      setGPTDetails({});
      setShowGPTModal(false);
    }
  };

  const onHandlJDLinkSubmit = async (value) => {
    const regex = /\(([^)]+)\)/;
    const match = watchClientName.match(regex);
    let email = "";
    if (match && match.length > 1) {
      email = match[1];
    }

    setIsLoading(true);
    setIsSavedLoading(true);

    const getResponse = async () => {
      const response = await hiringRequestDAO.extractTextUsingPythonDAO({
        clientEmail: email.trim(),
        psUrl: value,
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
      if (prev !== value && value !== "") {
        getResponse();
      } else {
        setIsLoading(false);
        setIsSavedLoading(false);
      }
      return value;
    });
  };

  const toogleJDType = () => {
    setISJDURL((prev) => {
      if (prev) {
      }
      return !prev;
    });
  };

  return (
    <div className={HRFieldStyle.addNewContainer}>
      <div className={HRFieldStyle.addHRTitle}>
        Add New Direct Hiring Request
      </div>

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
                      required: "Enter client email/name",
                    }}
                    label="Client Name/Email"
                    name="clientName"
                    type={InputType.TEXT}
                    required
                  />
                </div>
              ) : (
                <div className={HRFieldStyle.colMd12}>
                  <div className={HRFieldStyle.formGroup}>
                    <label>
                      Enter client Email/Name{" "}
                      <span className={HRFieldStyle.required}>*</span>
                    </label>
                    <Controller
                      render={({ ...props }) => (
                        <AutoComplete
                          options={getClientEmailSuggestion}
                          onSelect={(clientName, _) =>
                            getClientNameValue(clientName, _)
                          }
                          filterOption={true}
                          onSearch={(searchValue) => {
                            setClientEmailSuggestion([]);
                            getClientNameSuggestionHandler(searchValue);
                          }}
                          onChange={(clientName) =>
                            setValue("clientName", clientName)
                          }
                          placeholder={
                            watchClientName
                              ? watchClientName
                              : "Enter client Name/Email"
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
                  disabled={true}
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "please enter the company name.",
                  }}
                  label="Company Name"
                  name="companyName"
                  type={InputType.TEXT}
                  placeholder="Enter company name"
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
                    validate: (value) => {
                      try {
                        new URL(value);
                        return true;
                      } catch (error) {
                        return "Entered value does not match url format";
                      }
                    },
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
                    min: {
                      value: 0,
                      message: "please don't enter the value less than 0",
                    },
                    max: {
                      value: 60,
                      message: "please don't enter the value more than 60",
                    },
                  }}
                  label="Years of Experience"
                  name="reqExp"
                  type={InputType.NUMBER}
                  placeholder="Enter years"
                  required
                />
              </div>

              <div className={HRFieldStyle.colMd6}></div>


              <div className={HRFieldStyle.colMd6}>
                <div className={HRFieldStyle.formGroup}>
                  <HRSelectField
                    controlledValue={controlledRoleValue}
                    setControlledValue={ControlledRoleChangeHandler}
                    isControlled={true}
                    mode={"id/value"}
                    setValue={setValue}
                    register={register}
                    label={"Hiring Request Role"}
                    placeholder="Enter role"
                    options={talentRole && talentRole}
                    name="role"
                    searchable
                    required
                    isError={errors["role"] && errors["role"]}
                    errorMsg={"Please Select Role."}
                  />
                </div>
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
                  {isJDURL ? (
                    <HRInputField
                      disabled={!watch("clientEmail")}
                      register={register}
                      leadingIcon={<LinkSVG />}
                      label={`Job Description`}
                      name="jdURL"
                      type={InputType.TEXT}
                      required={isJDURL}
                      validationSchema={{
                        required: "please Enter URL.",
                      }}
                      placeholder="Past JD link"
                      trailingIcon={
                        <div className={HRFieldStyle.linksubmit}>
                          <button
                            className={HRFieldStyle.linksubmitbutton}
                            disabled={!watch("clientEmail")}
                            onClick={() => onHandlJDLinkSubmit(watch("jdURL"))}
                          >
                            Submit
                          </button>
                        </div>
                      }
                      errors={errors}
                    />
                  ) : (
                    <>
                      {!getUploadFileData ? (
                        <HRInputField
                          disabled={!watch("clientEmail")}
                          register={register}
                          leadingIcon={<UploadSVG />}
                          label={`Job Description`}
                          name="jdExport"
                          type={InputType.BUTTON}
                          buttonLabel="Upload JD file (doc, docx, pdf)"
                          // value="Upload JD File"
                          onClickHandler={() => setUploadModal(true)}
                          required={!isJDURL}
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
                                jdDumpID(0);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

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
                  {!watch("jdURL") && !getUploadFileData && (
                    <div className={HRFieldStyle.addHrProvideLink}>
                      You can also{" "}
                      <p onClick={() => toogleJDType()}>
                        {isJDURL ? "upload JD File" : "provide a link"}{" "}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className={HRFieldStyle.colMd12}>
                <div className={HRFieldStyle.skillAddCustom}>
                  <HRSelectField
                    isControlled={true}
                    controlledValue={controlledJDParsed}
                    setControlledValue={setControlledJDParsed}
                    // mode="multiple"
                    mode="tags"
                    setValue={setValue}
                    register={register}
                    label={"Top 5 must have skils"}
                    placeholder="Select skills"
                    onChange={setSelectedItems}
                    options={skills}
                    setOptions={setSkills}
                    name="skills"
                    isError={errors["skills"] && errors["skills"]}
                    required
                    errorMsg={"Please enter the skills."}
                  />
                  {/* <HRInputField
                            register={register}
                            errors={errors}
                            
                            label="Top 5 must have skils"
                            name="otherSkill"
                            type={InputType.TEXT}
                            placeholder="Type skills"
                            maxLength={50}
                            required
                        /> */}

                  <ul className={HRFieldStyle.selectFieldBox}>
                    {skillSuggestionList.map((item) => (
                      <li key={item.id} onClick={() => onSelectSkill(item)}>
                        <span>
                          {" "}
                          {item.value}
                          <img src={AddPlus} loading="lazy" alt="star" />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className={HRFieldStyle.row}>
              <div className={HRFieldStyle.colMd4}>
                <div className={HRFieldStyle.formGroup}>
                  <HRSelectField
                    controlledValue={controlledCurrencyValue}
                    setControlledValue={setControlledCurrencyValue}
                    isControlled={true}
                    mode={"id/value"}
                    setValue={setValue}
                    register={register}
                    label={"Add your estimated budget (Monthly)"}
                    defaultValue="Select Currency"
                    options={currency.map((item) => ({
                      id: item.id,
                      label: item.text,
                      value: item.value,
                    }))}
                    name="currency"
                    isError={errors["currency"] && errors["currency"]}
                    required
                    errorMsg={"Please select Currency"}
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
                    required
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
                    required
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
                  <label>
                    Is this remote opportunity{" "}
                    <span className={HRFieldStyle.reqField}>*</span>
                  </label>
                  <div className={HRFieldStyle.radioFormGroup}>
                    <Radio.Group
                      className={HRFieldStyle.radioGroup}
                      value={isHRRemote}
                    >
                      <Radio onClick={() => setIsHRRemote(true)} value={true}>
                        Yes
                      </Radio>
                      <Radio onClick={() => setIsHRRemote(false)} value={false}>
                        No
                      </Radio>
                    </Radio.Group>

                    {/* <Radio.Group className={HRFieldStyle.radioGroup}>
                                   
                                </Radio.Group> */}
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
                    defaultValue="Select Lead Type"
                    name="leadType"
                    options={leadSource}
                    required
                    isError={errors["leadType"] && errors["leadType"]}
                    errorMsg={"Please select Lead Type"}
                  />
                </div>
              </div>
              <div className={HRFieldStyle.colMd4}>
                <div className={HRFieldStyle.formGroup}>
                  <HRSelectField
                    controlledValue={controlledDealSource}
                    setControlledValue={setControlledDealSource}
                    isControlled={true}
                    setValue={setValue}
                    register={register}
                    mode={"id/value"}
                    label={"Lead Owner"}
                    defaultValue="Select Lead Owner"
                    name="leadOwner"
                    options={leadOwner}
                    required
                    isError={errors["leadOwner"] && errors["leadOwner"]}
                    errorMsg={"Please select Lead Owner"}
                  />
                </div>
              </div>
              <div className={HRFieldStyle.colMd4}>
                <div className={HRFieldStyle.formGroup}>
                  <HRSelectField
                    setValue={setValue}
                    register={register}
                    mode={"id/value"}
                    options={howSoon}
                    label={"Notice period"}
                    defaultValue="Select how soon?"
                    name="noticePeriod"
                    required
                    isError={errors["noticePeriod"] && errors["noticePeriod"]}
                    errorMsg={"Please select Notice period"}
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
                <label className={HRFieldStyle.timezoneLabel}>
                  Shift Start and End Time{" "}
                  <span className={HRFieldStyle.required}>*</span>
                </label>
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
                      errorMsg={errors["fromTime"] ? errors["fromTime"].message : "Please select from time."}
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
                  controlledValue={controlledRolesAndResponsibilities}
                  // controlledValue={JDParsedSkills?.Responsibility || ''}
                  // controlledValue={ addData?.addHiringRequest?.guid ? testJSON(addData?.salesHiringRequest_Details
                  // 	?.rolesResponsibilities)? createListMarkup(JSON.parse(addData?.salesHiringRequest_Details
                  // 	?.rolesResponsibilities)) : addData?.salesHiringRequest_Details
                  // 	?.rolesResponsibilities :
                  // 	JDParsedSkills?.Responsibility ||
                  // 	(addData?.salesHiringRequest_Details
                  // 		?.rolesResponsibilities )
                  // }
                  label={"Roles & Responsibilities"}
                  placeholder={"Enter Roles & Responsibilities"}
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
                  controlledValue={controlledRequirenments}
                  // controlledValue={ addData?.addHiringRequest?.guid ? testJSON(addData?.salesHiringRequest_Details
                  // 	?.rolesResponsibilities)? createListMarkup(JSON.parse(addData?.salesHiringRequest_Details
                  // 	?.rolesResponsibilities)) : addData?.salesHiringRequest_Details
                  // 	?.rolesResponsibilities :
                  // 	JDParsedSkills?.Responsibility ||
                  // 	(addData?.salesHiringRequest_Details
                  // 		?.rolesResponsibilities )
                  // }
                  label={"Requirements"}
                  placeholder={"Enter requirements"}
                  required
                  setValue={setValue}
                  watch={watch}
                  register={register}
                  errors={errors}
                  name="requirements"
                />
              </div>

              <div className={HRFieldStyle.colMd12}>
                <HRInputField
                  // isControlled={true}
                  isTextArea={true}
                  // controlledValue={ addData?.addHiringRequest?.guid ? testJSON(addData?.salesHiringRequest_Details
                  // 	?.rolesResponsibilities)? createListMarkup(JSON.parse(addData?.salesHiringRequest_Details
                  // 	?.rolesResponsibilities)) : addData?.salesHiringRequest_Details
                  // 	?.rolesResponsibilities :
                  // 	JDParsedSkills?.Responsibility ||
                  // 	(addData?.salesHiringRequest_Details
                  // 		?.rolesResponsibilities )
                  // }
                  type={InputType.TEXT}
                  validationSchema={{
										validate: (value) => {
											if (!value) {
												return 'Please add something about the company';
											}
											let companyName = watch('companyName')
											let index1 = value.search(
												new RegExp(companyName, 'i'),
											);
										
												if (index1 !== -1) {
													return `Please do not mention company name [${companyName}] here`;
												}
												if (!value) {
													return 'Please add something about the company';
												}
											}
										
									}}
                  label={"About Company"}
                  placeholder={"Enter about company"}
                  required
                  setValue={setValue}
                  watch={watch}
                  register={register}
                  errors={errors}
                  name="aboutCompany"
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
          {/* <button
                style={{
                cursor: type === SubmitType.SUBMIT ? "no-drop" : "pointer",
                }}
                disabled={type === SubmitType.SUBMIT}
                className={HRFieldStyle.btn}
                onClick={hrSubmitHandler}
            >
                Save as Draft
            </button> */}

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

                {gptDetails?.salesHiringRequest_Details?.requirement && (
                  <>
                    <h3 style={{ marginTop: "10px" }}>Requirements :</h3>
                    {testJSON(
                      gptDetails?.salesHiringRequest_Details?.requirement
                    ) ? (
                      <div className={HRFieldStyle.viewHrJDDetailsBox}>
                        <ul>
                          {JSON.parse(
                            gptDetails?.salesHiringRequest_Details?.requirement
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
                            gptDetails?.salesHiringRequest_Details?.requirement,
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
                        <h3 style={{ marginTop: "10px" }}>Responsibility :</h3>
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
}
