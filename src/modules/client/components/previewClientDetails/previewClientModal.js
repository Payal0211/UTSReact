import Modal from "antd/lib/modal/Modal";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import previewClientStyle from "../previewClientDetails/previewClientDetail.module.css";
import {
  AutoComplete,
  Avatar,
  Checkbox,
  Radio,
  Select,
  Skeleton,
  Tooltip,
  Upload,
  message,
} from "antd";
import { ReactComponent as EditNewIcon } from "assets/svg/editnewIcon.svg";
import { ReactComponent as DeleteNewIcon } from "assets/svg/delete-icon.svg";

import CompanyDetailimg1 from "assets/CompanyDetailimg1.jpg";
import CompanyDetailimg2 from "assets/CompanyDetailimg2.jpg";
import CompanyDetailimg3 from "assets/CompanyDetailimg3.jpg";

import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";

import { useFieldArray, useForm } from "react-hook-form";
import { InputType } from "constants/application";
import { HttpStatusCode, all } from "axios";
import ReactQuill from "react-quill";

import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import TextEditor from "shared/components/textEditor/textEditor";
import YouTubeVideo from "./youTubeVideo";
import { MasterDAO } from "core/master/masterDAO";
import UploadModal from "shared/components/uploadModal/uploadModal";
import "react-quill/dist/quill.snow.css";
import LogoLoader from "shared/components/loader/logoLoader";
import { getFlagAndCodeOptions } from "modules/client/clientUtils";
import { ReactComponent as RefreshSyncSVG } from 'assets/svg/refresh-sync.svg'

function PreviewClientModal({
  isPreviewModal,
  setIsPreviewModal,
  setcompanyID,
  getcompanyID,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    clearErrors,
    unregister,
    getValues,
    resetField,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clientDetails: [],
      fundingList: [],
    },
  });

  const [isEditCompanyName, setIsEditCompanyName] = useState(false);
  const [isEditCompanyWebsite, setIsEditCompanyWebsite] = useState(false);
  const [isEditCompanyFound, setIsEditCompanyFound] = useState(false);
  const [isEditTeamSize, setIsEditTeamSize] = useState(false);
  const [isEditCompanyType, setIsEditCompanyType] = useState(false);
  const [isEditCompanyIndustry, setIsEditCompanyIndustry] = useState(false);
  const [isEditHeadquarters, setIsEditHeadquarters] = useState(false);
  const [isEditLinkedInURL, setIsEditLinkedInURL] = useState(false);
  const [getCompanyDetails, setCompanyDetails] = useState({});
  const [showAllInvestors, setShowAllInvestors] = useState(false);
  const [isAnotherRound, setAnotherRound] = useState(false);
  const [isAddNewClient, setAddNewClient] = useState(false);
  const [isEditClient, setEditClient] = useState(false);
  const [isEditEngagement, setEditEngagement] = useState(false);
  const [isEditPOC, setEditPOC] = useState(false);
  const [isEditCultureSection, setEditCultureSection] = useState(false);
  const [isEditCompanyBenefits, setEditCompanyBenefits] = useState(false);
  const [getValuesForDD, setValuesForDD] = useState({});
  const [controlledPOC, setControlledPOC] = useState([]);
  const [allPocs, setAllPocs] = useState([]);
  const [controlledperk, setControlledperk] = useState([]);
  const [combinedPerkMemo, setCombinedPerkMemo] = useState([]);
  const [controlledFoundedInValue, setControlledFoundedInValue] = useState("");
  const [getValidation, setValidation] = useState({
    systemFileUpload: "",
    googleDriveFileUpload: "",
    linkValidation: "",
  });
  const [getUploadFileData, setUploadFileData] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [showUploadModal, setUploadModal] = useState(false);
  const [isEditAboutUs, setIsEditAboutUs] = useState(false);
  const [isAboutUs, setIsAboutUs] = useState("");
  const [isSelfFunded, setIsSelfFunded] = useState(false);
  const [isCulture, setIsCulture] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorClient, setErrorClient] = useState({});
  const [checkPayPer, setCheckPayPer] = useState({
    companyTypeID: 0,
    anotherCompanyTypeID: 0,
  });
  const [IsChecked, setIsChecked] = useState({
    isPostaJob: false,
    isProfileView: false,
  });
  const [payPerError, setPayPerError] = useState(false);
  const [creditError, setCreditError] = useState(false);
  const [typeOfPricing, setTypeOfPricing] = useState(null);
  const [hrPricingTypes, setHRPricingTypes] = useState([]);
  const [errorCurrency, seterrorCurrency] = useState(false);
  const [
    controlledHiringPricingTypeValue,
    setControlledHiringPricingTypeValue,
  ] = useState("Select Hiring Pricing");
  const [flagAndCode, setFlagAndCode] = useState([]);
  const [clientValueDetails, setClientValueDetails] = useState({});
  const [clickIndex, setClickIndex] = useState();
  const [controlledSeries, setControlledSeries] = useState([]);
  const [messageAPI, contextHolder] = message.useMessage();
  const [clientDetailsData, setClientDetailsData] = useState({
    clientID: "",
    en_Id: "",
    isPrimary: "",
    fullName: "",
    emailId: "",
    designation: "",
    phoneNumber: "",
    accessRoleId: "",
  });
  const [otherClientDetailsData, setOtherClientDetailsData] = useState({
    clientID: 0,
    // "en_Id": "",
    isPrimary: false,
    fullName: "",
    emailId: "",
    designation: "",
    phoneNumber: "",
    accessRoleId: "",
  });
  const [errorsData, setErrorsData] = useState({});
  const [pricingTypeError, setPricingTypeError] = useState(false);
  const pictureRef = useRef();
  const { Dragger } = Upload;
  const cultureDetails = [];
  const youTubeDetails = getCompanyDetails?.youTubeDetails ?? [];
  let _currency = watch("creditCurrency");

  const getCodeAndFlag = async () => {
    const getCodeAndFlagResponse = await MasterDAO.getCodeAndFlagRequestDAO();
    setFlagAndCode(
      getCodeAndFlagResponse && getCodeAndFlagResponse.responseBody
    );
  };

  useEffect(() => {
    getCodeAndFlag();
  }, []);

  const allInvestors = getCompanyDetails?.fundingDetails?.[0]?.allInvestors
    ? getCompanyDetails?.fundingDetails?.[0]?.allInvestors?.split(",")
    : [];
  const displayedInvestors = showAllInvestors
    ? allInvestors
    : allInvestors.slice(0, 4);

  const toggleInvestors = () => {
    setShowAllInvestors((prev) => !prev);
  };

  const getDetails = async () => {
    setIsLoading(true);
    const result = await allCompanyRequestDAO.getCompanyDetailDAO(getcompanyID);

    if (result?.statusCode === HTTPStatusCode.OK) {
      const data = result?.responseBody;
      setCompanyDetails(result?.responseBody);
      setValue("foundedIn", data?.basicDetails?.foundedYear);
      setValue("linkedinURL", data?.basicDetails?.linkedInProfile);
      setControlledFoundedInValue(data?.basicDetails?.foundedYear);
      setValue("companyWebsite", data?.basicDetails?.website);
      setValue("teamSize", data?.basicDetails?.teamSize);
      setValue("companyType", data?.basicDetails?.companyType);
      setValue("companyIndustry", data?.basicDetails?.companyIndustry);
      setValue("headquarters", data?.basicDetails?.headquaters);
      setValue("companyName", data?.basicDetails?.companyName);
      setValue("fullName", data?.contactDetails?.[1]?.firstName);
      setValue("emailID", data?.contactDetails?.[1]?.emailID);
      setValue("designation", data?.contactDetails?.[1]?.designation);
      setValue("accessType", data?.contactDetails?.[1]?.accessType);
      setValue("contactNo", data?.contactDetails?.[1]?.contactNo);
      setValue("fundingAmount", data?.fundingDetails?.[0]?.fundingAmount);
      setValue("fundingRound", data?.fundingDetails?.[0]?.fundingRound);
      setValue("investors", data?.fundingDetails?.[0]?.investors);
      setIsAboutUs(data?.basicDetails?.aboutCompany);
      setIsCulture(data?.basicDetails?.culture);
      setIsSelfFunded(data?.basicDetails?.isSelfFunded);
      setBase64Image(data?.basicDetails?.companyLogo)
    }
    setIsLoading(false);
  };

  const handleSubmitcompanyName = async () => {
    setIsLoading(true);
    let payload = {
      basicDetails: {
        companyID: getcompanyID,
        companyName: watch("companyName"),
      },
      IsUpdateFromPreviewPage: true,
    };
    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    if (res?.statusCode === HTTPStatusCode.OK) {
      getDetails();
      setIsEditCompanyName(false);
    }
    setIsLoading(false);
  };

  const handleSubmitcompanyWebsite = async () => {
    setIsLoading(true);
    let payload = {
      basicDetails: {
        companyID: getcompanyID,
        websiteUrl: watch("companyWebsite"),
      },
      IsUpdateFromPreviewPage: true,
    };
    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    if (res?.statusCode === HTTPStatusCode.OK) {
      getDetails();
      setIsEditCompanyWebsite(false);
    }
    setIsLoading(false);
  };

  const handleSubmitcompanyFound = async () => {
    setIsLoading(true);
    let payload = {
      basicDetails: {
        companyID: getcompanyID,
        foundedYear: watch("foundedIn"),
      },
      IsUpdateFromPreviewPage: true,
    };
    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    if (res?.statusCode === HTTPStatusCode.OK) {
      getDetails();
      setIsEditCompanyFound(false);
    }
    setIsLoading(false);
  };

  const handleSubmitTeamSize = async () => {
    setIsLoading(true);
    let payload = {
      basicDetails: {
        companyID: getcompanyID,
        companySize: watch("teamSize"),
      },
      IsUpdateFromPreviewPage: true,
    };
    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    if (res?.statusCode === HTTPStatusCode.OK) {
      getDetails();
      setIsEditTeamSize(false);
    }
    setIsLoading(false);
  };

  const handleSubmitCompanyType = async () => {
    setIsLoading(true);
    let payload = {
      basicDetails: {
        companyID: getcompanyID,
        companyType: watch("companyType"),
      },
      IsUpdateFromPreviewPage: true,
    };
    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    if (res?.statusCode === HTTPStatusCode.OK) {
      getDetails();
      setIsEditCompanyType(false);
    }
    setIsLoading(false);
  };

  const handleSubmitCompanyIndustry = async () => {
    setIsLoading(true);
    let payload = {
      basicDetails: {
        companyID: getcompanyID,
        industry: watch("companyIndustry"),
      },
      IsUpdateFromPreviewPage: true,
    };
    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    if (res?.statusCode === HTTPStatusCode.OK) {
      getDetails();
      setIsEditCompanyIndustry(false);
    }
    setIsLoading(false);
  };

  const handleSubmitCompanyHeadquarters = async () => {
    setIsLoading(true);
    let payload = {
      basicDetails: {
        companyID: getcompanyID,
        headquaters: watch("headquarters"),
      },
      IsUpdateFromPreviewPage: true,
    };
    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    if (res?.statusCode === HTTPStatusCode.OK) {
      getDetails();
      setIsEditHeadquarters(false);
    }
    setIsLoading(false);
  };

  const handleSubmitCompanyLinkedIn = async () => {
    setIsLoading(true);
    let payload = {
      basicDetails: {
        companyID: getcompanyID,
        linkedInProfile: watch("linkedinURL"),
      },
      IsUpdateFromPreviewPage: true,
    };
    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    if (res?.statusCode === HTTPStatusCode.OK) {
      getDetails();
      setIsEditLinkedInURL(false);
    }
    setIsLoading(false);
  };

  const handleSubmitAboutUs = async () => {
    setIsLoading(true);
    let payload = {
      basicDetails: {
        companyID: getcompanyID,
        aboutCompanyDesc: isAboutUs,
      },
      IsUpdateFromPreviewPage: true,
    };
    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    if (res?.statusCode === HTTPStatusCode.OK) {
      getDetails();
      setIsEditAboutUs(false);
    }
    setIsLoading(false);
  };

  // let payload = {
  //   "basicDetails": {
  //     "companyID": companyID,
  //     "companyName": d.companyName,
  //     "companyLogo": getCompanyDetails?.basicDetails?.companyLogo,
  //     "websiteUrl": d.companyURL,
  //     "foundedYear": d.foundedIn,
  //     "companySize": +d.teamSize,
  //     "companyType": d.companyType,
  //     "industry": d.industry,
  //     "headquaters": d.headquaters,
  //     "aboutCompanyDesc": d.aboutCompany,
  //     "culture": d.culture,
  //     "isSelfFunded": isSelfFunded
  //   },
  //   "fundingDetails": d.fundingDetails,
  //   "cultureDetails": modCultureDetails,
  //   "perkDetails": d.perksAndAdvantages?.map(it=> it.value),
  //   "youTubeDetails": getCompanyDetails?.youTubeDetails,
  //   "clientDetails": modClientDetails,
  //   "engagementDetails": {
  //     "companyTypeID": checkPayPer?.companyTypeID,
  //     "anotherCompanyTypeID": checkPayPer?.anotherCompanyTypeID,
  //     "isPostaJob": IsChecked.isPostaJob,
  //     "isProfileView": IsChecked.isProfileView,
  //     "jpCreditBalance": d.freeCredit,
  //     "isTransparentPricing": typeOfPricing === 1 ? true :  typeOfPricing === 0 ?  false : null,
  //     "isVettedProfile": true,
  //     "creditAmount": d.creditCurrency === "INR" ? null :  d.creditAmount,
  //     "creditCurrency": d.creditCurrency,
  //     "jobPostCredit": d.jobPostCredit,
  //     "vettedProfileViewCredit": d.vettedProfileViewCredit,
  //     "nonVettedProfileViewCredit": d.nonVettedProfileViewCredit,
  //     "hiringTypePricingId": d.hiringPricingType?.id
  //   },
  //   "pocIds": d.uplersPOCname?.map(poc=> poc.id),
  //   "IsRedirectFromHRPage" : state?.createHR ? true : false
  // }

  // let submitresult = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload)

  useEffect(() => {
    getDetails();
  }, [getcompanyID, setValue]);

  const getAllValuesForDD = useCallback(async () => {
    const getDDResponse = await MasterDAO.getFixedValueRequestDAO();
    setValuesForDD(getDDResponse && getDDResponse?.responseBody);
  }, []);

  const getAllSalesPerson = useCallback(async () => {
    const allSalesResponse = await MasterDAO.getSalesManRequestDAO();
    setAllPocs(allSalesResponse && allSalesResponse?.responseBody?.details);
  }, []);

  useEffect(() => {
    getAllValuesForDD();
    getAllSalesPerson();
  }, []);

  useEffect(() => {
    if (getCompanyDetails?.pocUserIds?.length && allPocs?.length) {
      let SelectedPocs = getCompanyDetails?.pocUserIds.map((pocId) => {
        let data = allPocs.find((item) => item.id === pocId);
        return {
          id: data.id,
          value: data.value,
        };
      });
      setValue("uplersPOCname", SelectedPocs);
      setControlledPOC(SelectedPocs);
    }
  }, [getCompanyDetails?.pocUserIds, allPocs]);

  useEffect(() => {
    if (getCompanyDetails?.perkDetails?.length > 0) {
      setValue(
        "perksAndAdvantages",
        getCompanyDetails?.perkDetails?.map((item) => ({
          id: item,
          value: item,
        }))
      );
      if (getValuesForDD?.CompanyPerks?.length > 0) {
        setCombinedPerkMemo([
          ...getCompanyDetails?.perkDetails?.map((item) => ({
            id: item,
            value: item,
          })),
          ...getValuesForDD?.CompanyPerks?.filter(
            (item) => !getCompanyDetails?.perkDetails?.includes(item.value)
          ).map((item) => ({
            id: item.value,
            value: item.value,
          })),
        ]);
      }

      setControlledperk(
        getCompanyDetails?.perkDetails?.map((item) => ({
          id: item,
          value: item,
        }))
      );
    } else {
      setCombinedPerkMemo(
        getValuesForDD?.CompanyPerks?.map((item) => ({
          id: item.value,
          value: item.value,
        }))
      );
    }

    if (getCompanyDetails?.basicDetails?.companyName) {
      getCompanyDetails?.basicDetails?.culture &&
        setValue("culture", getCompanyDetails?.basicDetails?.culture);
    }
  }, [
    getCompanyDetails?.perkDetails,
    getCompanyDetails?.basicDetails,
    getValuesForDD?.CompanyPerks,
  ]);

  const generateYears = (startYear, endYear) => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  const startYear = 1900;
  const endYear = new Date().getFullYear();

  const yearOptions = generateYears(startYear, endYear).map((year) => ({
    id: year.toString(),
    value: year.toString(),
  }));

  const uploadFileHandler = useCallback(
    async (e) => {
      // setIsLoading(true);
      let fileData = e.target.files[0];
      if (
        fileData?.type !== "image/png" &&
        fileData?.type !== "image/jpeg" &&
        fileData?.type !== "image/svg+xml"
      ) {
        setValidation({
          ...getValidation,
          systemFileUpload:
            "Uploaded file is not a valid, Only jpg, jpeg, png, svg files are allowed",
        });
        // setIsLoading(false);
      } else if (fileData?.size >= 500000) {
        setValidation({
          ...getValidation,
          systemFileUpload:
            "Upload file size more than 500kb, Please Upload file upto 500kb",
        });
        // setIsLoading(false);
      } else {
        let filesToUpload = new FormData();
        filesToUpload.append("Files", fileData);
        filesToUpload.append("IsCompanyLogo", true);
        filesToUpload.append("IsCultureImage", false);

        let Result = await allCompanyRequestDAO.uploadImageDAO(filesToUpload);
        setValidation({
          ...getValidation,
          systemFileUpload: "",
        });

        if (Result?.statusCode === HTTPStatusCode.OK) {
          let imgUrls = Result?.responseBody;
          setUploadFileData(imgUrls[0]);
          setCompanyDetails((prev) => ({
            ...prev,
            basicDetails: {
              companyLogo: imgUrls[0],
              ...prev.basicDetails?.companyLogo,
            },
          }));
          let payload = {
            basicDetails: {
              companyID: getcompanyID,
              companyLogo:imgUrls[0],
            },
            IsUpdateFromPreviewPage: true,
          }
          setUploadModal(false);
          let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
          getDetails();
        }

      }
    },
    [getValidation, setBase64Image, setUploadFileData, getcompanyID, setValue]
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "clientDetails",
  });

  const {
    fields: fundingFields,
    append: appendFunding,
    remove: removeFunding,
  } = useFieldArray({
    control,
    name: "fundingDetails",
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthOptions = monthNames.map((month, index) => ({
    label: month,
    value: month,
  }));

  const defaultFunding = {
    fundingID: 0,
    fundingAmount: "",
    fundingRound: "",
    series: "",
    month: "",
    year: "",
    investors: "",
  };

  const seriesOptions = [
    { value: "Seed Round", id: "Seed Round" },
    { value: "Series A Round", id: "Series A Round" },
    { value: "Series B Round", id: "Series B Round" },
    { value: "Series C Round", id: "Series C Round" },
    { value: "Series D Round", id: "Series D Round" },
    { value: "Series E Round", id: "Series E Round" },
    { value: "Series F Round", id: "Series F Round" },
    { value: "Series G Round", id: "Series G Round" },
    { value: "Series H Round", id: "Series H Round" },
    { value: "Series I Round", id: "Series I Round" },
  ];

  const uploadCultureImages = async (Files) => {
    setUploading(true);
    let filesToUpload = new FormData();

    for (let i = 0; i < Files.length; i++) {
      filesToUpload.append("Files", Files[i]);
    }
    filesToUpload.append("IsCompanyLogo", false);
    filesToUpload.append("IsCultureImage", true);

    let Result = await allCompanyRequestDAO.uploadImageDAO(filesToUpload);

    if (Result?.statusCode === HTTPStatusCode.OK) {
      let imgUrls = Result?.responseBody;

      let imgObj = imgUrls.map((url) => ({
        cultureID: 0,
        cultureImage: url,
      }));
      let newCultureObj = [...getCompanyDetails?.cultureDetails];
      setCompanyDetails((prev) => ({
        ...prev,
        cultureDetails: [...imgObj, ...newCultureObj],
      }));
    }
    setUploading(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files.length) return;

    const acceptedTypes = ["image/jpeg", "image/png"];
    const maxSize = 25 * 1024 * 1024;

    for (const file of files) {
      if (!acceptedTypes.includes(file.type)) {
        message.info("Please select a valid image file (JPEG or PNG).");
        return;
      }

      if (file.size > maxSize) {
        message.error("Maximum image size are 25 MB.");
        return;
      }
    }

    try {
      uploadCultureImages(files);
    } catch (error) {
      console.error("Error reading the file:", error);
    }
  };

  const removeIMGFromBE = async (toDelete) => {
    let payload = {
      cultureID: toDelete.cultureID,
      culture_Image: toDelete.cultureImage,
      companyID: getcompanyID,
    };
    const result = await allCompanyRequestDAO.deleteImageDAO(payload);

    if (result.statusCode === HttpStatusCode.Ok) {
      let filteredValue = getCompanyDetails?.cultureDetails.filter(
        (d) =>
          !(
            d.cultureID === toDelete.cultureID &&
            d.cultureImage === toDelete.cultureImage
          )
      );
      setCompanyDetails((prev) => ({ ...prev, cultureDetails: filteredValue }));
    }
  };

  const deleteCulturImage = (toDelete) => {
    if (toDelete.cultureID === 0) {
      let filteredValue = getCompanyDetails?.cultureDetails.filter(
        (d) =>
          !(
            d.cultureID === toDelete.cultureID &&
            d.cultureImage === toDelete.cultureImage
          )
      );
      setCompanyDetails((prev) => ({ ...prev, cultureDetails: filteredValue }));
    } else {
      removeIMGFromBE(toDelete);
    }
  };

  const removeYoutubeDetailsFromBE = async (toDelete) => {
    let payload = {
      youtubeID: toDelete.youtubeID,
      companyID: getcompanyID,
    };
    const result = await allCompanyRequestDAO.deleteYoutubeDetailsDAO(payload);
    if (result.statusCode === HttpStatusCode.Ok) {
      let filteredValue = youTubeDetails.filter(
        (d) =>
          !(
            d.youtubeID === toDelete.youtubeID &&
            d.youtubeLink === toDelete.youtubeLink
          )
      );
      setCompanyDetails((prev) => ({ ...prev, youTubeDetails: filteredValue }));
    }
  };

  const removeYoutubelink = (toDelete) => {
    if (toDelete.youtubeID === 0) {
      let filteredValue = youTubeDetails.filter(
        (d) =>
          !(
            d.youtubeID === toDelete.youtubeID &&
            d.youtubeLink === toDelete.youtubeLink
          )
      );
      setCompanyDetails((prev) => ({ ...prev, youTubeDetails: filteredValue }));
    } else {
      removeYoutubeDetailsFromBE(toDelete);
    }
  };

  let modCultureDetails = getCompanyDetails?.cultureDetails?.map((culture) => ({
    cultureID: culture.cultureID,
    culture_Image: culture.cultureImage,
  }));

  const addCultureDetails = async () => {
    setIsLoading(true);
    let payload = {
      basicDetails: {
        companyID: getcompanyID,
      },
      youTubeDetails: youTubeDetails,
      cultureDetails: modCultureDetails,
      IsUpdateFromPreviewPage: true,
    };
    const res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    setEditCultureSection(false);
    getDetails();
  };

  useEffect(() => {
    if (!_currency) {
      seterrorCurrency(true);
    } else {
      seterrorCurrency(false);
    }
  }, [_currency]);

  const getHRPricingType = useCallback(async () => {
    const HRPricingResponse = await MasterDAO.getHRPricingTypeDAO();
    setHRPricingTypes(HRPricingResponse && HRPricingResponse.responseBody);
  }, []);
  useEffect(() => {
    getHRPricingType();
  }, []);

  const getRequiredHRPricingType = useCallback(() => {
    let reqOpt = [];

    if (typeOfPricing === 1) {
      let Filter = hrPricingTypes.filter(
        (item) => item.isActive === true && item.isTransparent === true
      );
      if (Filter.length) {
        reqOpt = Filter.map((item) => ({ id: item.id, value: item.type }));
      }
    } else {
      let Filter = hrPricingTypes.filter(
        (item) => item.isActive === true && item.isTransparent === false
      );
      if (Filter.length) {
        reqOpt = Filter.map((item) => ({ id: item.id, value: item.type }));
      }
    }

    return reqOpt;
  }, [hrPricingTypes, typeOfPricing]);

  useEffect(() => {
    // engagementDetails?.companyTypeID &&
    setCheckPayPer({
      ...checkPayPer,
      companyTypeID: getCompanyDetails?.engagementDetails?.companyTypeID ?? 0,
      anotherCompanyTypeID:
        getCompanyDetails?.engagementDetails?.anotherCompanyTypeID ?? 0,
    });

    getCompanyDetails?.engagementDetails?.isTransparentPricing != null &&
      setTypeOfPricing(
        getCompanyDetails?.engagementDetails?.isTransparentPricing === true
          ? 1
          : 0
      );

    getCompanyDetails?.engagementDetails?.creditCurrency &&
      setValue(
        "creditCurrency",
        getCompanyDetails?.engagementDetails?.creditCurrency
      );
    getCompanyDetails?.engagementDetails?.creditAmount &&
      setValue(
        "creditAmount",
        getCompanyDetails?.engagementDetails?.creditAmount
      );
    getCompanyDetails?.engagementDetails?.jpCreditBalance &&
      setValue(
        "freeCredit",
        getCompanyDetails?.engagementDetails?.jpCreditBalance
      );

    if (getCompanyDetails?.engagementDetails?.companyID) {
      setIsChecked({
        isPostaJob: getCompanyDetails?.engagementDetails?.isPostaJob,
        isProfileView: getCompanyDetails?.engagementDetails?.isProfileView,
      });
      if (getCompanyDetails?.engagementDetails?.isPostaJob) {
        getCompanyDetails?.engagementDetails?.jobPostCredit &&
          setValue(
            "jobPostCredit",
            getCompanyDetails?.engagementDetails?.jobPostCredit
          );
      }

      if (getCompanyDetails?.engagementDetails?.isProfileView) {
        getCompanyDetails?.engagementDetails?.vettedProfileViewCredit &&
          setValue(
            "vettedProfileViewCredit",
            getCompanyDetails?.engagementDetails?.vettedProfileViewCredit
          );
        getCompanyDetails?.engagementDetails?.nonVettedProfileViewCredit &&
          setValue(
            "nonVettedProfileViewCredit",
            getCompanyDetails?.engagementDetails?.nonVettedProfileViewCredit
          );
      }
    }
  }, [getCompanyDetails?.engagementDetails]);

  useEffect(() => {
    if (
      getCompanyDetails?.engagementDetails?.hiringTypePricingId &&
      hrPricingTypes.length > 0
    ) {
      let filteredHRtype = hrPricingTypes.find(
        (item) =>
          item.id === getCompanyDetails?.engagementDetails?.hiringTypePricingId
      );

      if (filteredHRtype) {
        setValue("hiringPricingType", {
          id: filteredHRtype.id,
          value: filteredHRtype.type,
        });
        setControlledHiringPricingTypeValue(filteredHRtype.type);
      }
    }
  }, [
    getCompanyDetails?.engagementDetails?.hiringTypePricingId,
    hrPricingTypes,
  ]);

  const flagAndCodeMemo = useMemo(
    () => getFlagAndCodeOptions(flagAndCode),
    [flagAndCode]
  );


  const addEngagementDetails = async () => {
    // if(typeOfPricing === null && checkPayPer?.anotherCompanyTypeID==1 && (checkPayPer?.companyTypeID==0 || checkPayPer?.companyTypeID==2)){
		// 	setPricingTypeError(true)
    //   // setLoadingDetails(false)
    //   // setDisableSubmit(false)
		// 	return
		// }
    // if(checkPayPer?.anotherCompanyTypeID==0 && checkPayPer?.companyTypeID==0){
    //   // setLoadingDetails(false)
    //   // setDisableSubmit(false)
		// 	setPayPerError(true)
		// 	return
		// }

    // if(checkPayPer?.companyTypeID===2 && IsChecked?.isPostaJob===false && IsChecked?.isProfileView===false){
		// 	// setLoadingDetails(false)
    //   // setDisableSubmit(false)
		// 	setCreditError(true)
		// 	return
		// }
    setIsLoading(true);
    let payload = {
      basicDetails: {
        companyID: getcompanyID,
      },
      engagementDetails: {
        companyTypeID: checkPayPer?.companyTypeID,
        anotherCompanyTypeID: checkPayPer?.anotherCompanyTypeID,
        isPostaJob: IsChecked.isPostaJob,
        isProfileView: IsChecked.isProfileView,
        jpCreditBalance:checkPayPer?.companyTypeID===2? watch("freeCredit")??null:null,
        isTransparentPricing:
          typeOfPricing === 1 ? true : typeOfPricing === 0 ? false : null,
        isVettedProfile: true,
        creditAmount:(checkPayPer?.companyTypeID===2) ?  watch("creditCurrency"):null,
        creditCurrency:checkPayPer?.companyTypeID===2? watch("creditCurrency"):null,
        jobPostCredit: (checkPayPer?.companyTypeID===2 && IsChecked?.isPostaJob=== true) ? watch("jobPostCredit") ?? null : null,
        vettedProfileViewCredit: (checkPayPer?.companyTypeID===2 && IsChecked?.isProfileView===true) ? watch("vettedProfileViewCredit") ?? null : null,
        nonVettedProfileViewCredit:(checkPayPer?.companyTypeID===2 && IsChecked?.isProfileView===true) ? watch("nonVettedProfileViewCredit") ?? null : null,
        hiringTypePricingId:checkPayPer?.anotherCompanyTypeID === 1 ? watch("hiringPricingType")?.id : null,
      },

      IsUpdateFromPreviewPage: true,
    };
    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    // if(res.statusCode.HTTPStatusCode.OK){
    getDetails();
    setEditEngagement(false);
    setIsLoading(false);
    // }
  };

  const addClientDetailsDetails = async () => {
    let valid = true;
    let _errors = { ...errorsData };
    if (!clientDetailsData?.fullName) {
      _errors.fullNameData = "Please enter full name";
      valid = false;
    }
    if (!clientDetailsData?.emailId) {
      _errors.emailIdData = "Please enter email address";
      valid = false;
    }
    setErrorsData(_errors);
    if (valid) {
      let payload = {
        basicDetails: {
          companyID: getcompanyID,
        },
        clientDetails: [clientDetailsData],
        IsUpdateFromPreviewPage: true,
      };
      setIsLoading(true);
      let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
      if (res.statusCode.HTTPStatusCode.OK) {
        // if(res.statusCode.HTTPStatusCode.OK){
        setIsLoading(false);
        getDetails();
        setEditClient(false);
        setError({});
        // }
      } else {
        _errors.emailIdData = res?.responseBody?.message;
        valid = false;
        setErrorsData(_errors);
        setIsLoading(false);
      }
    }
    setError({});
    setIsLoading(false);
  };

  const addOtherClientDetailsDetails = async () => {
    let valid = true;
    let _errors = { ...errorsData };
    if (!otherClientDetailsData?.fullName) {
      _errors.fullName = "Please enter full name";
      valid = false;
    }
    if (!otherClientDetailsData?.emailId) {
      _errors.emailId = "Please enter email address";
      valid = false;
    }
    setErrorsData(_errors);
    if (valid) {
      setIsLoading(true);
      let payload = {
        basicDetails: {
          companyID: getcompanyID,
        },
        clientDetails: [otherClientDetailsData],
        IsUpdateFromPreviewPage: true,
      };
      let response = await allCompanyRequestDAO.updateCompanyDetailsDAO(
        payload
      );
      if (response.statusCode.HTTPStatusCode.OK) {
        getDetails();
        setAddNewClient(false);
        setError({});
        setOtherClientDetailsData({});
        setIsLoading(false);
      } else {
        _errors.emailId = response?.responseBody?.message;
        valid = false;
        setErrorsData(_errors);
        setIsLoading(false);
      }
      setError({});
      setIsLoading(false);
    }
  };

  const companyTypeMessages = [
    getCompanyDetails?.engagementDetails?.anotherCompanyTypeID === 1 &&
      "Pay per Hire",
    getCompanyDetails?.engagementDetails?.companyTypeID === 2 &&
      "Pay per Credit",
  ]
    .filter(Boolean)
    .join(", ");

  const handleSubmitCompanyPerks = async () => {
    setIsLoading(true);
    let payload = {
      basicDetails: {
        companyID: getcompanyID,
      },
      perkDetails: watch("perksAndAdvantages")?.map((item) => item?.value),
      IsUpdateFromPreviewPage: true,
    };
    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    getDetails();
    setEditCompanyBenefits(false);
    setIsLoading(false);
  };

  const handleSubmitUplersPOC = async () => {
    setIsLoading(true);
    let payload = {
      basicDetails: {
        companyID: getcompanyID,
      },
      pocIds: [watch("uplersPOCname")?.id],
      IsUpdateFromPreviewPage: true,
    };
    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    getDetails();
    setEditPOC(false);
    setIsLoading(false);
  };

  const handleSelftFunding = async () => {
    setIsLoading(true);
    let payload = {
      basicDetails: {
        companyID: getcompanyID,
        isSelfFunded: false,
      },
      fundingDetails: [
        {
          fundingID: 0,
          fundingAmount: watch("fundingAmount"),
          fundingRound: watch("fundingRound"),
          series: watch("series"),
          month: watch("month"),
          year: watch("year"),
          investors: watch("investors"),
          additionalInformation: watch("additionalInformation"),
        },
      ],
      IsUpdateFromPreviewPage: true,
    };
    let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
    getDetails();
    setIsLoading(false);
  };

  const syncCompany = async() =>{
    setIsLoading(true)
    let res = await allCompanyRequestDAO.getSyncCompanyProfileDAO(getcompanyID);
    if(res?.statusCode === 200){
      messageAPI.open({
        type: "success",
        content: "Sync successfully",
        className: 'synMsgToastr',
        duration: 2,
      });
    }
    setIsLoading(false)
  }

  return (
    <>
    
      <LogoLoader visible={isLoading} />
      <Modal
        centered
        open={isPreviewModal}
        onOk={() => setIsPreviewModal(false)}
        onCancel={() => setIsPreviewModal(false)}
        width={1080}
        footer={false}
        maskClosable={false}
        className={previewClientStyle.clientDetailModal}
        wrapClassName="clientDetailModalWrapper"
      >
        {contextHolder}
        <div className={previewClientStyle.PreviewpageMainWrap}>
          <div className={`${previewClientStyle.PostHeader} ${previewClientStyle.refreshBtnWrap}`}>
            <h4>Company / Client Details</h4>
            <div className={previewClientStyle.hiringRequestPriority} onClick={()=>syncCompany()}>
              <Tooltip title={'Sync company data to ATS'} placement="bottom"
              style={{"zIndex":"9999"}}
            
              overlayClassName="custom-syntooltip">
                <RefreshSyncSVG width="17" height="16" style={{ fontSize: '16px' }} />
            </Tooltip>
            </div>
          </div>
         

          <div className={previewClientStyle.PostJobStepSecondWrap}>
            <div className={previewClientStyle.formFields}>
              <div className={previewClientStyle.formFieldsbox}>
                <div className={previewClientStyle.formFieldsboxinner}>
                  <h2>Basic Company Details</h2>
                  <div className={previewClientStyle.companyDetails}>
                    <div
                      className={`${previewClientStyle.companyDetailsInner} ${previewClientStyle.dtlQuillEdit}`}
                    >
                      <div className={previewClientStyle.companyProfileBox}>
                        <div className={previewClientStyle.companyProfileImg}>
                          {/* {!getUploadFileData ?(<p>Upload Company Logo</p>) :(  */}
                          {getCompanyDetails?.basicDetails?.companyLogo ? (
                            <img
                              src={
                                base64Image ? base64Image : getUploadFileData
                              }
                              // src={getCompanyDetails?.basicDetails?.companyLogo}
                              alt="detailImg"
                            />
                          ) : (
                            <Avatar
                              style={{
                                width: "56px",
                                height: "56px",
                                display: "flex",
                                alignItems: "center",
                              }}
                              size="large"
                            >
                              {getCompanyDetails?.basicDetails?.companyName
                                ?.substring(0, 2)
                                .toUpperCase()}
                            </Avatar>
                          )}
                          {/* )} */}
                          {NetworkInfo.ENV !== "QA" &&
                            NetworkInfo.ENV !== "Live" && (
                              <span className={previewClientStyle.editNewIcon}>
                                {" "}
                                <EditNewIcon
                                  onClick={() => setUploadModal(true)}
                                />{" "}
                              </span>
                            )}
                        </div>
                        <div
                          className={previewClientStyle.companyProfRightDetail}
                        >
                          <h3>
                            {getCompanyDetails?.basicDetails?.companyName}{" "}
                            {NetworkInfo.ENV !== "QA" &&
                              NetworkInfo.ENV !== "Live" && (
                                <span
                                  className={previewClientStyle.editNewIcon}
                                  onClick={() => setIsEditCompanyName(true)}
                                >
                                  {" "}
                                  <EditNewIcon />{" "}
                                </span>
                              )}
                          </h3>
                          <a href={getCompanyDetails?.basicDetails?.website} alt='companysite' target="_blank" rel="noreferrer">
                            {" "}
                            {getCompanyDetails?.basicDetails?.website}{" "}
                            {NetworkInfo.ENV !== "QA" &&
                              NetworkInfo.ENV !== "Live" && (
                                <span
                                  className={previewClientStyle.editNewIcon}
                                  onClick={() => setIsEditCompanyWebsite(true)}
                                >
                                  {" "}
                                  <EditNewIcon />{" "}
                                </span>
                              )}
                          </a>
                        </div>
                      </div>

                      <div className={previewClientStyle.companyDetailTop}>
                        <ul>
                          <li>
                            {NetworkInfo.ENV !== "QA" &&
                            NetworkInfo.ENV !== "Live" ? (
                              <span onClick={() => setIsEditCompanyFound(true)}>
                                {" "}
                                Founded in <EditNewIcon />{" "}
                              </span>
                            ) : (
                              <span>Founded in</span>
                            )}
                            <p>
                              {getCompanyDetails?.basicDetails?.foundedYear
                                ? getCompanyDetails?.basicDetails?.foundedYear
                                : "NA"}
                            </p>
                          </li>
                          <li>
                            {NetworkInfo.ENV !== "QA" &&
                            NetworkInfo.ENV !== "Live" ? (
                              <span onClick={() => setIsEditTeamSize(true)}>
                                {" "}
                                Team Size <EditNewIcon />{" "}
                              </span>
                            ) : (
                              <span>Team Size</span>
                            )}
                            <p>
                              {" "}
                              {getCompanyDetails?.basicDetails?.teamSize
                                ? getCompanyDetails?.basicDetails?.teamSize
                                : "NA"}{" "}
                            </p>
                          </li>
                          {/* <li>
                            {NetworkInfo.ENV !== "QA" &&
                            NetworkInfo.ENV !== "Live" ? (
                              <span onClick={() => setIsEditCompanyType(true)}>
                                {" "}
                                Company Type <EditNewIcon />{" "}
                              </span>
                            ) : (
                              <span>Company Type</span>
                            )}
                            <p>
                              {" "}
                              {getCompanyDetails?.basicDetails?.companyType
                                ? getCompanyDetails?.basicDetails?.companyType
                                : "NA"}{" "}
                            </p>
                          </li> */}
                          <li>
                            {NetworkInfo.ENV !== "QA" &&
                            NetworkInfo.ENV !== "Live" ? (
                              <span
                                onClick={() => setIsEditCompanyIndustry(true)}
                              >
                                Company Industry <EditNewIcon />{" "}
                              </span>
                            ) : (
                              <span> Company Industry</span>
                            )}
                            <p>
                              {" "}
                              {getCompanyDetails?.basicDetails?.companyIndustry
                                ? getCompanyDetails?.basicDetails
                                    ?.companyIndustry
                                : "NA"}{" "}
                            </p>
                          </li>
                          <li>
                            {NetworkInfo.ENV !== "QA" &&
                            NetworkInfo.ENV !== "Live" ? (
                              <span onClick={() => setIsEditHeadquarters(true)}>
                                {" "}
                                Headquarters <EditNewIcon />{" "}
                              </span>
                            ) : (
                              <span>Headquarters</span>
                            )}
                            <p>
                              {" "}
                              {getCompanyDetails?.basicDetails?.headquaters
                                ? getCompanyDetails?.basicDetails?.headquaters
                                : "NA"}{" "}
                            </p>
                          </li>
                          <li>
                            {NetworkInfo.ENV !== "QA" &&
                            NetworkInfo.ENV !== "Live" ? (
                              <span onClick={() => setIsEditLinkedInURL(true)}>
                                {" "}
                                Linkedin URL <EditNewIcon />{" "}
                              </span>
                            ) : (
                              <span>Linkedin URL</span>
                            )}
                            <p>
                              {" "}
                              {getCompanyDetails?.basicDetails?.linkedInProfile
                                ? getCompanyDetails?.basicDetails
                                    ?.linkedInProfile
                                : "NA"}{" "}
                            </p>
                          </li>
                        </ul>
                      </div>

                      <h6>
                        {" "}
                        About us{" "}
                        {NetworkInfo.ENV !== "QA" &&
                          NetworkInfo.ENV !== "Live" && (
                            <span
                              className={previewClientStyle.editNewIcon}
                              onClick={() => setIsEditAboutUs(true)}
                            >
                              <EditNewIcon />
                            </span>
                          )}
                      </h6>
                      {isEditAboutUs == false ? (
                        <ReactQuill
                          theme="snow"
                          value={isAboutUs}
                          readOnly
                          modules={{ toolbar: false }}
                          className={previewClientStyle.reactQuillReadonly}
                          style={{
                            border: "none !important",
                          }}
                        />
                      ) : (
                        <>
                          <ReactQuill
                            theme="snow"
                            value={isAboutUs}
                            onChange={(val) => setIsAboutUs(val)}
                            className={previewClientStyle.reactQuillEdit}
                          />
                          <div
                            className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.BtnRight}`}
                          >
                            <button
                              type="button"
                              className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
                              onClick={() => setIsEditAboutUs(false)}
                            >
                              {" "}
                              Cancel{" "}
                            </button>
                            <button
                              type="button"
                              className={previewClientStyle.btnPrimary}
                              onClick={() => handleSubmitAboutUs()}
                            >
                              {" "}
                              SAVE{" "}
                            </button>
                          </div>
                        </>
                      )}

                      <hr />

                      <h6>Funding</h6>

                      {getCompanyDetails?.basicDetails?.isSelfFunded ===
                      false ? (
                        <div className={previewClientStyle.fundingrounds}>
                          <ul>
                            <li>
                              <span>Funding Round Series</span>
                              <p>
                                {getCompanyDetails?.fundingDetails?.[0]?.series
                                  ? getCompanyDetails?.fundingDetails?.[0]
                                      ?.series
                                  : "NA"}
                              </p>
                            </li>

                            <li>
                              <span>Funding Amount</span>
                              <p>
                                {getCompanyDetails?.fundingDetails?.[0]
                                  ?.fundingAmount
                                  ? getCompanyDetails?.fundingDetails?.[0]
                                      ?.fundingAmount
                                  : "NA"}
                              </p>
                            </li>

                            <li>
                              <span>Latest Funding Round</span>
                              <p>
                                {getCompanyDetails?.fundingDetails?.[0]
                                  ?.lastFundingRound
                                  ? getCompanyDetails?.fundingDetails?.[0]
                                      ?.lastFundingRound
                                  : "NA"}
                              </p>
                            </li>

                            <li>
                              <span>Investors</span>
                              <p>
                                {displayedInvestors.length > 0
                                  ? displayedInvestors.join(", ")
                                  : "NA"}
                                {allInvestors.length > 4 && (
                                  <span>
                                    ...{" "}
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        toggleInvestors();
                                      }}
                                      title="view all"
                                    >
                                      {showAllInvestors
                                        ? "Show Less"
                                        : "View All"}
                                    </a>
                                  </span>
                                )}
                              </p>
                            </li>
                            <li>
                              <span>Additional Information</span>
                              {/* <p>{getCompanyDetails?.fundingDetails?.[0]?.additionalInformation?getCompanyDetails?.fundingDetails?.[0]?.additionalInformation:"NA"}</p> */}
                              <ReactQuill
                                theme="snow"
                                value={
                                  getCompanyDetails?.fundingDetails?.[0]
                                    ?.additionalInformation
                                    ? getCompanyDetails?.fundingDetails?.[0]
                                        ?.additionalInformation
                                    : "NA"
                                }
                                readOnly
                                modules={{ toolbar: false }}
                                className={
                                  previewClientStyle.reactQuillReadonly
                                }
                                style={{
                                  border: "none !important",
                                }}
                              />
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <div className={previewClientStyle.fundingrounds}>
                          <ul>
                            <li>
                              <span>Self-funded (bootstrapped)</span>
                            </li>
                          </ul>
                        </div>
                      )}

                      {/* {getCompanyDetails?.basicDetails?.isSelfFunded ===
                        true && (
                        <>
                          <div className={previewClientStyle.row}>
                            <div className={previewClientStyle.colMd12}>
                              <Checkbox
                                checked={isSelfFunded}
                                onClick={() => setIsSelfFunded((prev) => !prev)}
                              >
                                Self-funded (bootstrapped) company without external
                                investments.
                              </Checkbox>
                            </div>
                          </div>

                          <div className={previewClientStyle.row}>
                            <div className={previewClientStyle.colMd6}>
                              <HRInputField
                                register={register}
                                label="Funding Amount"
                                name={"fundingAmount"}
                                setValue={setValue}
                                type={InputType.TEXT}
                                onChangeHandler={(e) => {}}
                                placeholder="Ex: 500k, 900k, 1M, 2B..."
                                disabled={isSelfFunded}
                              />
                            </div>
                            <div className={previewClientStyle.colMd6}>
                              <HRInputField
                                register={register}
                                label="Funding Round"
                                name={"fundingRound"}
                                type={InputType.NUMBER}
                                onChangeHandler={(e) => {}}
                                placeholder="Enter round number"
                                disabled={isSelfFunded}
                                setValue={setValue}
                              />
                            </div>
                          </div>

                          <div className={previewClientStyle.row}>
                            <div className={previewClientStyle.colMd6}>
                              <HRSelectField
                                controlledValue={controlledSeries}
                                setControlledValue={setControlledSeries}
                                isControlled={true}
                                setValue={setValue}
                                mode={"id"}
                                register={register}
                                name={"series"}
                                label="Series"
                                defaultValue="Select"
                                options={seriesOptions}
                                disabled={isSelfFunded}
                              />
                            </div>

                            <div className={previewClientStyle.colMd6}>
                              <div className={previewClientStyle.phoneLabel}>
                                Month-Year
                              </div>
                              <div className={previewClientStyle.dateSelect}>
                                <Select
                                  options={monthOptions}
                                  placeholder="Select month"
                                  getPopupContainer={(trigger) =>
                                    trigger.parentElement
                                  }
                                  value={
                                    watch(`fundingDetails.month`)
                                      ? watch(`fundingDetails.month`)
                                      : undefined
                                  }
                                  onSelect={(e) => {
                                    setValue(`month`, e);
                                  }}
                                  disabled={isSelfFunded}
                                />
                                <Select
                                  options={yearOptions}
                                  placeholder="Select year"
                                  getPopupContainer={(trigger) =>
                                    trigger.parentElement
                                  }
                                  value={
                                    watch(`fundingDetails.year`)
                                      ? watch(`fundingDetails.year`)
                                      : undefined
                                  }
                                  onSelect={(e) => {
                                    setValue(`year`, e);
                                  }}
                                  disabled={isSelfFunded}
                                />
                              </div>
                            </div>

                            <div className={previewClientStyle.colMd6}>
                              <HRInputField
                                register={register}
                                label="Investors"
                                name={"investors"}
                                type={InputType.TEXT}
                                setValue={setValue}
                                onChangeHandler={(e) => {}}
                                placeholder="Add investors seprated by comma (,)"
                                disabled={isSelfFunded}
                              />
                            </div>
                          </div>

                          <div className={previewClientStyle.row}>
                            <div className={previewClientStyle.colMd12}>
                              <TextEditor
                                register={register}
                                setValue={setValue}
                                // errors={errors}
                                // controlledValue=}
                                isControlled={true}
                                isTextArea={true}
                                label="Additional Information"
                                name={`additionalInformation`}
                                type={InputType.TEXT}
                                placeholder="Enter Additional Information"
                                // required
                                watch={watch}
                                disabled={isSelfFunded}
                              />
                            </div>
                          </div>

                          <div
                            className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.mb24}`}
                          >
                            <button
                              type="button"
                              className={previewClientStyle.btnPrimary}
                              onClick={() => handleSelftFunding()}
                            >
                              {" "}
                              SAVE{" "}
                            </button>
                          </div>
                        </>
                      )} */}

                      {/* <div className={previewClientStyle.roundsListed}>
                        {getCompanyDetails?.fundingDetails?.map((val) => (
                          <div
                            className={`${previewClientStyle.roundsListContent} ${previewClientStyle.active}`}
                          >
                            <span>
                              {" "}
                              {val?.fundingRound
                                ? val?.fundingRound + " | "
                                : ""}{" "}
                              {val?.series?.trim() ? val?.series : ""}{" "}
                              {val?.fundingMonth
                                ? " | " + val?.fundingMonth
                                : ""}
                              ,{val?.fundingYear}
                              <div
                                className={previewClientStyle.roundHoverAction}
                              >
                                <span>
                                  <AiOutlineEdit />
                                </span>
                                <span>
                                  <RiDeleteBinLine />
                                </span>
                              </div>
                            </span>
                            {val?.fundingAmount && (
                              <h4>{val?.fundingAmount}</h4>
                            )}
                            {val?.investors && (
                              <p>Investors: {val?.investors}</p>
                            )}
                          </div>
                        ))}
                                                           
                      </div> */}

                      <div className={previewClientStyle.row}>
                        <div className={previewClientStyle.colMd6}>
                          {/* <HRInputField
                                            label="Company Name"
                                            name="companyName"
                                            type={InputType.TEXT}
                                            placeholder="Enter Name"
                                            required
                                        /> */}
                        </div>
                      </div>

                      <hr />

                      <h6>
                        {" "}
                        Culture{" "}
                        {NetworkInfo.ENV !== "QA" &&
                          NetworkInfo.ENV !== "Live" && (
                            <span
                              className={previewClientStyle.editNewIcon}
                              onClick={() => setEditCultureSection(true)}
                            >
                              <EditNewIcon />
                            </span>
                          )}
                      </h6>

                      {/* <TextEditor
                        register={register}
                        setValue={setValue}
                        // errors={errors}
                        controlledValue={
                          getCompanyDetails?.basicDetails?.culture
                        }
                        isControlled={true}
                        isTextArea={true}
                        name="culture"
                        type={InputType.TEXT}
                        placeholder="Enter about Culture"
                        // required
                        watch={watch}
                      /> */}

                      {isEditCultureSection === false && (
                        <ReactQuill
                          theme="snow"
                          value={isCulture}
                          readOnly
                          modules={{ toolbar: false }}
                          className={previewClientStyle.reactQuillReadonly}
                          style={{
                            border: "none !important",
                          }}
                        />
                      )}

                      {/*------ EditCaltureSection  Start ------- */}

                      {isEditCultureSection && (
                        <div className={previewClientStyle.EditCalturebox}>
                          {isEditCultureSection && (
                            <>
                              <div className={previewClientStyle.row}>
                                <div className={previewClientStyle.colMd12}>
                                  <ReactQuill
                                    theme="snow"
                                    value={isCulture}
                                    onChange={(val) => setIsCulture(val)}
                                    className={
                                      previewClientStyle.reactQuillEdit
                                    }
                                  />
                                </div>
                              </div>
                              <div className={previewClientStyle.row}>
                                <div className={previewClientStyle.colMd12}>
                                  <div className={previewClientStyle.label}>
                                    Picture
                                  </div>
                                  {uploading ? (
                                    <Skeleton active />
                                  ) : (
                                    <div
                                      className={
                                        previewClientStyle.FilesDragAndDropArea
                                      }
                                      style={{
                                        width: "100%",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        pictureRef && pictureRef.current.click()
                                      }
                                      onDragOver={(e) => e.preventDefault()}
                                      onDrop={handleDrop}
                                      onDragLeave={(e) => e.preventDefault()}
                                    >
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M8.99994 17.7505C8.58994 17.7505 8.24994 17.4105 8.24994 17.0005V12.8105L7.52994 13.5305C7.23994 13.8205 6.75994 13.8205 6.46994 13.5305C6.17994 13.2405 6.17994 12.7605 6.46994 12.4705L8.46994 10.4705C8.67994 10.2605 9.00994 10.1905 9.28994 10.3105C9.56994 10.4205 9.74994 10.7005 9.74994 11.0005V17.0005C9.74994 17.4105 9.40994 17.7505 8.99994 17.7505Z"
                                          fill="#F52887"
                                        />
                                        <path
                                          d="M10.9999 13.7495C10.8099 13.7495 10.6199 13.6795 10.4699 13.5295L8.46994 11.5295C8.17994 11.2395 8.17994 10.7595 8.46994 10.4695C8.75994 10.1795 9.23994 10.1795 9.52994 10.4695L11.5299 12.4695C11.8199 12.7595 11.8199 13.2395 11.5299 13.5295C11.3799 13.6795 11.1899 13.7495 10.9999 13.7495Z"
                                          fill="#F52887"
                                        />
                                        <path
                                          d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H14C14.41 1.25 14.75 1.59 14.75 2C14.75 2.41 14.41 2.75 14 2.75H9C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V10C21.25 9.59 21.59 9.25 22 9.25C22.41 9.25 22.75 9.59 22.75 10V15C22.75 20.43 20.43 22.75 15 22.75Z"
                                          fill="#F52887"
                                        />
                                        <path
                                          d="M22 10.7505H18C14.58 10.7505 13.25 9.42048 13.25 6.00048V2.00048C13.25 1.70048 13.43 1.42048 13.71 1.31048C13.99 1.19048 14.31 1.26048 14.53 1.47048L22.53 9.47048C22.74 9.68048 22.81 10.0105 22.69 10.2905C22.57 10.5705 22.3 10.7505 22 10.7505ZM14.75 3.81048V6.00048C14.75 8.58048 15.42 9.25048 18 9.25048H20.19L14.75 3.81048Z"
                                          fill="#F52887"
                                        />
                                      </svg>
                                      <p>
                                        <span>Click to Upload</span>{" "}
                                        <span style={{ color: "gray" }}>
                                          or drag and drop
                                        </span>
                                      </p>
                                      <span> (Max. File size: 25 MB)</span>
                                      <input
                                        ref={pictureRef}
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        multiple="multiple"
                                        style={{ display: "none" }}
                                        name="cultureImage"
                                        onChange={async (e) => {
                                          const file = e.target.files[0];
                                          if (!file) return;

                                          const acceptedTypes = [
                                            "image/jpeg",
                                            "image/png",
                                          ];
                                          if (
                                            !acceptedTypes.includes(file.type)
                                          ) {
                                            message.info(
                                              "Please select a valid image file (JPEG or PNG)."
                                            );
                                            return;
                                          }

                                          const maxSize = 25 * 1024 * 1024;
                                          if (file.size > maxSize) {
                                            message.error(
                                              "Maximum image size are 25 MB."
                                            );
                                            return;
                                          }

                                          try {
                                            uploadCultureImages(e.target.files);
                                          } catch (error) {
                                            console.error(
                                              "Error reading the file:",
                                              error
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )}

                          <div className={previewClientStyle.imgSection}>
                            {getCompanyDetails?.cultureDetails?.map((val) => (
                              <div className={previewClientStyle.imgThumb}>
                                <img src={val?.cultureImage} alt="detailImg" />
                                <span
                                  className={previewClientStyle.DeleteBtn}
                                  onClick={() => deleteCulturImage(val)}
                                >
                                  <DeleteNewIcon />{" "}
                                </span>
                              </div>
                            ))}
                          </div>

                          {isEditCultureSection && (
                            <div className={previewClientStyle.row}>
                              <div className={previewClientStyle.colMd12}>
                                <HRInputField
                                  register={register}
                                  // errors={errors}
                                  label="Add YouTube links"
                                  name="youtubeLink"
                                  validationSchema={{
                                    pattern: {
                                      value:
                                        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?(\S+)$/,
                                      message: "Youtube link is not valid",
                                    },
                                  }}
                                  onKeyDownHandler={(e) => {
                                    if (e.keyCode === 13) {
                                      const regex =
                                        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?(\S+)$/;
                                      if (!regex.test(e.target.value)) {
                                        return message.error(
                                          "Youtube link is not valid"
                                        );
                                      }

                                      let youtubeDetail = {
                                        youtubeLink: watch("youtubeLink"),
                                        youtubeID: 0,
                                      };

                                      let nweyouTubeDetails = [
                                        ...getCompanyDetails?.youTubeDetails,
                                      ];
                                      setCompanyDetails((prev) => ({
                                        ...prev,
                                        youTubeDetails: [
                                          youtubeDetail,
                                          ...nweyouTubeDetails,
                                        ],
                                      }));
                                      setValue("youtubeLink", "");
                                    }
                                  }}
                                  type={InputType.TEXT}
                                  onChangeHandler={(e) => {}}
                                  placeholder="Add Links and press Enter"
                                />
                              </div>
                            </div>
                          )}

                          <div className={previewClientStyle.row}>
                            {youTubeDetails?.map((youtube) => (
                              <div
                                className={previewClientStyle.youTubeDetails}
                              >
                                {youtube?.youtubeLink}
                                <DeleteNewIcon
                                  alt="detailImg"
                                  style={{
                                    marginLeft: "10px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    removeYoutubelink(youtube);
                                  }}
                                />
                              </div>
                            ))}
                          </div>

                          {isEditCultureSection && (
                            <>
                              <div
                                className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.mb24}`}
                              >
                                <button
                                  type="button"
                                  className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
                                  onClick={() => setEditCultureSection(false)}
                                >
                                  {" "}
                                  Cancel{" "}
                                </button>
                                <button
                                  type="button"
                                  className={previewClientStyle.btnPrimary}
                                  onClick={() => {
                                    addCultureDetails();
                                  }}
                                >
                                  {" "}
                                  SAVE{" "}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/*------ EditCaltureSection  End ------- */}

                      {!isEditCultureSection && (
                        <div className={previewClientStyle.imgSection}>
                          {getCompanyDetails?.cultureDetails?.map((val) => (
                            <div className={previewClientStyle.imgThumb}>
                              <img src={val?.cultureImage} alt="detailImg" />
                              {NetworkInfo.ENV !== "QA" &&
                                NetworkInfo.ENV !== "Live" && (
                                  <span
                                    className={previewClientStyle.DeleteBtn}
                                    onClick={() => deleteCulturImage(val)}
                                  >
                                    <DeleteNewIcon />{" "}
                                  </span>
                                )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* {isEditCultureSection && <div className={previewClientStyle.row}>
                                        <div className={previewClientStyle.colMd12}>
                                                <HRInputField
                                                register={register}
                                                // errors={errors}
                                                label="Add YouTube links"
                                                name="youtubeLink"
                                                // validationSchema={{
                                                //   pattern: {
                                                //     value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?(\S+)$/,
                                                //     message: 'Youtube link is not valid',
                                                //   },
                                                // }}
                                                // onKeyDownHandler={e=>{
                                                //   if(e.keyCode === 13){
                                                //     const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?(\S+)$/;
                                                //       if(!regex.test(e.target.value)){
                                                //         return message.error('Youtube link is not valid')
                                                //       }

                                                //     let youtubeDetail = {youtubeLink: watch('youtubeLink'), 
                                                //       youtubeID: 0
                                                //       }

                                                //       let nweyouTubeDetails = [...youTubeDetails]
                                                //       setCompanyDetails(prev => ({...prev,youTubeDetails:[ youtubeDetail,...nweyouTubeDetails]}))
                                                //       setValue('youtubeLink','')
                                                //   }
                                                // }}
                                                type={InputType.TEXT}
                                                // onChangeHandler={(e) => {
                                                // }}
                                                placeholder="Add Links and press Enter"
                                                />
                                        </div>
                                </div>
                                } */}

                      {!isEditCultureSection && (
                        <div className={previewClientStyle.imgSection}>
                          {getCompanyDetails?.youTubeDetails?.map((val) => (
                            <div className={previewClientStyle.videoWrapper}>
                              {/* <iframe width="420" height="315"
                                                src={`https://www.youtube.com/embed/${val?.youtubeLink}`}>
                                            </iframe> */}
                              <YouTubeVideo videoLink={val?.youtubeLink} />
                              {NetworkInfo.ENV !== "QA" &&
                                NetworkInfo.ENV !== "Live" && (
                                  <span
                                    className={previewClientStyle.DeleteBtn}
                                  >
                                    <DeleteNewIcon
                                      onClick={() => {
                                        removeYoutubelink(val);
                                      }}
                                    />{" "}
                                  </span>
                                )}
                            </div>
                          ))}
                        </div>
                      )}

                      <h6>
                        Company Benefits
                        {NetworkInfo.ENV !== "QA" &&
                          NetworkInfo.ENV !== "Live" && (
                            <span
                              className={previewClientStyle.editNewIcon}
                              onClick={() => setEditCompanyBenefits(true)}
                            >
                              <EditNewIcon />
                            </span>
                          )}
                      </h6>

                      <div className={previewClientStyle.companyBenefits}>
                        <ul>
                          {getCompanyDetails?.perkDetails?.map((val) => (
                            <li>
                              <span>{val}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {isEditCompanyBenefits && (
                        <div
                          className={`${previewClientStyle.row} ${previewClientStyle.mt24}`}
                        >
                          <div className={previewClientStyle.colMd12}>
                            <HRSelectField
                              isControlled={true}
                              controlledValue={controlledperk}
                              setControlledValue={setControlledperk}
                              setValue={setValue}
                              mode={"tags"}
                              register={register}
                              name="perksAndAdvantages"
                              label="Company perks & advantages"
                              defaultValue="Mention perks & advantages"
                              placeholder="Mention perks & advantages"
                              options={combinedPerkMemo}
                              setOptions={setCombinedPerkMemo}
                            />
                            <div
                              className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.mt24}`}
                            >
                              <button
                                type="button"
                                className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
                                onClick={() => setEditCompanyBenefits(false)}
                              >
                                {" "}
                                Cancel{" "}
                              </button>
                              <button
                                type="button"
                                className={previewClientStyle.btnPrimary}
                                onClick={() => handleSubmitCompanyPerks()}
                              >
                                {" "}
                                SAVE{" "}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={previewClientStyle.formFields}>
              <div className={previewClientStyle.formFieldsbox}>
                <div className={previewClientStyle.formFieldsboxinner}>
                  <div className={previewClientStyle.formFieldTitleTwo}>
                    <h2>
                      Client Details{" "}
                      {NetworkInfo.ENV !== "QA" &&
                        NetworkInfo.ENV !== "Live" && (
                          <span
                            className={previewClientStyle.addNewClientText}
                            onClick={() => setAddNewClient(true)}
                          >
                            Add New Client
                          </span>
                        )}
                    </h2>
                  </div>

                  <div className={previewClientStyle.companyDetails}>
                    {isAddNewClient && (
                      <>
                        <div className={previewClientStyle.row}>
                          <div className={previewClientStyle.colMd6}>
                            <HRInputField
                              register={register}
                              setValue={setValue}
                              // isError={!!errors?.clientDetails?.[index]?.fullName}
                              //   errors={errors?.clientDetails?.[index]?.fullName}
                              label="Client Full Name"
                              onChangeHandler={(e) => {
                                setOtherClientDetailsData({
                                  ...otherClientDetailsData,
                                  fullName: e?.target?.value,
                                });
                              }}
                              //   name={`clientDetails.[${index}].fullName`}
                              name="fullNameOther"
                              type={InputType.TEXT}
                              //   validationSchema={{
                              //     required: "Please enter the Client Name",
                              //   }}
                              // errorMsg="Please enter the Client Name."
                              placeholder="Enter Client Name"
                              required={true}
                              disabled={false}
                              forArrayFields={true}
                            />
                            {errorsData.fullName && (
                              <span style={{ color: "red" }}>
                                {errorsData.fullName}
                              </span>
                            )}
                          </div>

                          <div className={previewClientStyle.colMd6}>
                            <HRInputField
                              //								disabled={isLoading}
                              register={register}
                              //   errors={errors?.clientDetails?.[index]?.emailID}
                              //   validationSchema={{
                              //     required: `Please enter the client email ID.`,
                              //     pattern: {
                              //       value: EmailRegEx.email,
                              //       message: "Entered value does not match email format",
                              //     },
                              //   }}
                              label="Work Email"
                              //   name={`clientDetails.[${index}].emailID`}
                              name={"emailIDOther"}
                              onChangeHandler={(e) => {
                                setOtherClientDetailsData({
                                  ...otherClientDetailsData,
                                  emailId: e?.target?.value,
                                });
                              }}
                              //   onBlurHandler={() => {
                              //     if (
                              //       errors?.clientDetails?.[index]?.emailID &&
                              //       !errors?.clientDetails?.[index]?.emailID?.message.includes('This work email :')

                              //     ) {
                              //       return;
                              //     }

                              //     let eReg = new RegExp(EmailRegEx.email);

                              //     if (
                              //       item?.emailID !==
                              //         watch(`clientDetails.[${index}].emailID`) &&
                              //       eReg.test(watch(`clientDetails.[${index}].emailID`))
                              //     ) {
                              //       validateCompanyName(index);
                              //     } else {
                              //       clearErrors(`clientDetails.[${index}].emailID`);
                              //       setDisableSubmit(false);
                              //     }
                              //   }}
                              type={InputType.EMAIL}
                              placeholder="Enter Email ID "
                              required
                              forArrayFields={true}
                            />
                            {errorsData.emailId && (
                              <span style={{ color: "red" }}>
                                {errorsData.emailId}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={previewClientStyle.row}>
                          <div className={previewClientStyle.colMd6}>
                            <HRInputField
                              register={register}
                              // errors={errors}
                              label="Designation"
                              //   name={`clientDetails.[${index}].designation`}
                              name="designationOther"
                              onChangeHandler={(e) => {
                                setOtherClientDetailsData({
                                  ...otherClientDetailsData,
                                  designation: e?.target?.value,
                                });
                              }}
                              type={InputType.TEXT}
                              placeholder="Enter Client Designation"
                            />
                          </div>

                          <div className={previewClientStyle.colMd6}>
                            <label className={previewClientStyle.phoneLabel}>
                              Access Type
                            </label>
                            <Select
                              // isControlled={true}
                              //   controlledValue={controlledRoleId[index]}
                              //   setControlledValue={(val) =>
                              //     setControlledRoleId((prev) => {
                              //       let newControlled = [...prev];
                              //       newControlled[index] = val;
                              //       return newControlled;
                              //     })
                              //   }
                              // setValue={setValue}
                              // mode={"id"}
                              // register={register}
                              //   name={`clientDetails.[${index}].roleID`}
                              getPopupContainer={(trigger) =>
                                trigger.parentElement
                              }
                              name="roleIDOther"
                              label="Access Type"
                              defaultValue="Choose Access Type"
                              value={getValuesForDD?.BindAccessRoleType?.find(
                                (option) =>
                                  option?.id ===
                                  otherClientDetailsData?.accessRoleId
                              )}
                              onChange={(selectedValue, val) => {
                                setOtherClientDetailsData({
                                  ...otherClientDetailsData,
                                  accessRoleId: val?.id,
                                });
                              }}
                              options={getValuesForDD?.BindAccessRoleType?.map(
                                (item) => ({
                                  id: item.id,
                                  value: item.value,
                                })
                              )}
                              //   options={accessTypes?.map((item) => ({
                              //     id: item.id,
                              //     value: item.value,
                              //   }
                              // ))
                              // }
                            />
                          </div>
                        </div>

                        <div className={previewClientStyle.row}>
                          <div className={previewClientStyle.colMd6}>
                            <div className={previewClientStyle.phoneLabel}>
                              Phone number
                            </div>
                            <div style={{ display: "flex" }}>
                              <div className={previewClientStyle.phoneNoCode}>
                                <HRSelectField
                                  searchable={true}
                                  setValue={setValue}
                                  register={register}
                                  //   name={`clientDetails.[${index}].countryCode`}
                                  name="countryCodeOther"
                                  value={otherClientDetailsData?.countryCode}
                                  defaultValue="+91"
                                  options={flagAndCodeMemo}
                                />
                              </div>
                              <div className={previewClientStyle.phoneNoInput}>
                                <HRInputField
                                  register={register}
                                  //   name={`clientDetails.[${index}].contactNo`}
                                  name="contactNoOther"
                                  onChangeHandler={(e) => {
                                    setOtherClientDetailsData({
                                      ...otherClientDetailsData,
                                      phoneNumber: e?.target?.value,
                                    });
                                  }}
                                  type={InputType.NUMBER}
                                  placeholder="Enter Phone number"
                                  value={otherClientDetailsData?.phoneNumber}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.mb24}`}
                        >
                          <button
                            type="button"
                            className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
                            onClick={() => setAddNewClient(false)}
                          >
                            {" "}
                            Cancel{" "}
                          </button>
                          <button
                            type="button"
                            className={previewClientStyle.btnPrimary}
                            onClick={() => addOtherClientDetailsDetails()}
                          >
                            {" "}
                            SAVE{" "}
                          </button>
                        </div>
                      </>
                    )}

                    <div
                      className={`${previewClientStyle.companyDetailTop} ${previewClientStyle.clientDetailListed}`}
                    >
                      {getCompanyDetails?.contactDetails?.map((val, index) => (
                        <div className={previewClientStyle.companyNewClientbox}>
                          <h5 className={previewClientStyle.clientlistedTop}>
                            {" "}
                            <span
                              className={previewClientStyle.clientlistedTitle}
                            >
                              {" "}
                              {`Client ${index + 1}`}{" "}
                            </span>{" "}
                            {NetworkInfo.ENV !== "QA" &&
                              NetworkInfo.ENV !== "Live" && (
                                <span
                                  className={previewClientStyle.editNewIcon}
                                  onClick={() => {
                                    setEditClient(true);
                                    setClickIndex(index);
                                    setClientDetailsData({
                                      ...clientDetailsData,
                                      clientID: val?.id,
                                      en_Id: val?.en_Id,
                                      isPrimary: val?.isPrimary,
                                      fullName: val?.fullName,
                                      emailId: val?.emailID,
                                      designation: val?.designation,
                                      phoneNumber: val?.contactNo,
                                      accessRoleId: val?.roleID,
                                    });
                                  }}
                                >
                                  <EditNewIcon />
                                </span>
                              )}
                          </h5>
                          {clickIndex === index && isEditClient && (
                            <>
                              <div
                                className={previewClientStyle.row}
                                key={index}
                              >
                                <div className={previewClientStyle.colMd6}>
                                  <HRInputField
                                    register={register}
                                    value={
                                      clientDetailsData?.fullName
                                        ? clientDetailsData?.fullName
                                        : ""
                                    }
                                    // isError={!!errors?.clientDetails?.[index]?.fullName}
                                    //   errors={errors?.clientDetails?.[index]?.fullName}
                                    label="Client Full Name"
                                    setValue={setValue}
                                    onChangeHandler={(e) => {
                                      setClientDetailsData({
                                        ...clientDetailsData,
                                        fullName: e?.target?.value,
                                      });
                                    }}
                                    name={"fullName"}
                                    // name="fullName"
                                    type={InputType.TEXT}
                                    // validationSchema={{
                                    //   required: "Please enter the Client Name",
                                    // }}
                                    // errorMsg="Please enter the Client Name."
                                    placeholder="Enter Client Name"
                                    required={true}
                                    disabled={false}
                                    forArrayFields={true}
                                  />
                                  {errorsData.fullNameData && (
                                    <span style={{ color: "red" }}>
                                      {errorsData.fullNameData}
                                    </span>
                                  )}
                                </div>

                                <div className={previewClientStyle.colMd6}>
                                  <HRInputField
                                    //								disabled={isLoading}
                                    register={register}
                                    //   errors={errors?.clientDetails?.[index]?.emailID}
                                    //   validationSchema={{
                                    //     required: `Please enter the client email ID.`,
                                    //     pattern: {
                                    //       value: EmailRegEx.email,
                                    //       message: "Entered value does not match email format",
                                    //     },
                                    //   }}
                                    value={clientDetailsData?.emailId}
                                    label="Work Email"
                                    //   name={`clientDetails.[${index}].emailID`}
                                    name={"emailID"}
                                    onChangeHandler={(e) => {
                                      setClientDetailsData({
                                        ...clientDetailsData,
                                        emailId: e?.target?.value,
                                      });
                                    }}
                                    // onBlurHandler={() => {
                                    //   if (
                                    //     errors?.clientDetails?.[index]?.emailID &&
                                    //     !errors?.clientDetails?.[index]?.emailID?.message.includes('This work email :')

                                    //   ) {
                                    //     return;
                                    //   }

                                    //   let eReg = new RegExp(EmailRegEx.email);

                                    //   if (
                                    //     item?.emailID !==
                                    //       watch(`clientDetails.[${index}].emailID`) &&
                                    //     eReg.test(watch(`clientDetails.[${index}].emailID`))
                                    //   ) {
                                    //     validateCompanyName(index);
                                    //   } else {
                                    //     clearErrors(`clientDetails.[${index}].emailID`);
                                    //     setDisableSubmit(false);
                                    //   }
                                    // }}
                                    type={InputType.EMAIL}
                                    placeholder="Enter Email ID "
                                    required
                                    forArrayFields={true}
                                  />
                                  {errorsData.emailIdData && (
                                    <span style={{ color: "red" }}>
                                      {errorsData.emailIdData}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className={previewClientStyle.row}>
                                <div className={previewClientStyle.colMd6}>
                                  <HRInputField
                                    register={register}
                                    // errors={errors}
                                    value={clientDetailsData?.designation}
                                    label="Designation"
                                    //name={`clientDetails.[${index}].designation`}
                                    name="designation"
                                    onChangeHandler={(e) => {
                                      setClientDetailsData({
                                        ...clientDetailsData,
                                        designation: e?.target?.value,
                                      });
                                    }}
                                    type={InputType.TEXT}
                                    placeholder="Enter Client Designation"
                                  />
                                </div>

                                <div className={previewClientStyle.colMd6}>
                                  <label
                                    className={previewClientStyle.phoneLabel}
                                  >
                                    Access Type
                                  </label>
                                  <Select
                                    // isControlled={true}
                                    // setValue={setValue}
                                    // mode={"id"}
                                    // register={register}
                                    name="roleID"
                                    getPopupContainer={(trigger) =>
                                      trigger.parentElement
                                    }
                                    label="Access Type"
                                    defaultValue="Choose Access Type"
                                    value={getValuesForDD?.BindAccessRoleType?.find(
                                      (option) =>
                                        option?.id ===
                                        clientDetailsData?.accessRoleId
                                    )}
                                    onChange={(selectedValue, val) => {
                                      setClientDetailsData({
                                        ...clientDetailsData,
                                        accessRoleId: val?.id,
                                      });
                                    }}
                                    options={getValuesForDD?.BindAccessRoleType?.map(
                                      (item) => ({
                                        id: item.id,
                                        value: item.value,
                                      })
                                    )}
                                  />
                                </div>
                              </div>

                              <div className={previewClientStyle.row}>
                                <div className={previewClientStyle.colMd6}>
                                  <div
                                    className={previewClientStyle.phoneLabel}
                                  >
                                    Phone number
                                  </div>
                                  <div style={{ display: "flex" }}>
                                    <div
                                      className={previewClientStyle.phoneNoCode}
                                    >
                                      <HRSelectField
                                        searchable={true}
                                        setValue={setValue}
                                        register={register}
                                        //   name={`clientDetails.[${index}].countryCode`}
                                        value={clientDetailsData?.countryCode}
                                        name="countryCode"
                                        defaultValue="+91"
                                        options={flagAndCodeMemo}
                                      />
                                    </div>
                                    <div
                                      className={
                                        previewClientStyle.phoneNoInput
                                      }
                                    >
                                      <HRInputField
                                        register={register}
                                        // name={`clientDetails.[${index}].contactNo`}
                                        name="contactNo"
                                        onChangeHandler={(e) => {
                                          setClientDetailsData({
                                            ...clientDetailsData,
                                            phoneNumber: e?.target?.value,
                                          });
                                        }}
                                        type={InputType.NUMBER}
                                        placeholder="Enter Phone number"
                                        value={clientDetailsData?.phoneNumber}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.mb24}`}
                              >
                                <button
                                  type="button"
                                  className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
                                  onClick={() => setEditClient(false)}
                                >
                                  {" "}
                                  Cancel{" "}
                                </button>
                                <button
                                  type="button"
                                  className={previewClientStyle.btnPrimary}
                                  onClick={() => addClientDetailsDetails()}
                                >
                                  {" "}
                                  SAVE{" "}
                                </button>
                              </div>
                            </>
                          )}

                          <ul>
                            <li>
                              <span>Client Full Name</span>
                              <p>{val?.fullName ? val?.fullName : "NA"}</p>
                            </li>
                            <li>
                              <span>Client’s Work Email</span>
                              <p>{val?.emailID ? val?.emailID : "NA"}</p>
                            </li>
                            <li>
                              <span>Designation</span>
                              <p>
                                {val?.designation ? val?.designation : "NA"}
                              </p>
                            </li>
                            <li>
                              <span>Access Type</span>
                              <p>
                                {(val?.roleID == 1 && "Admin") ||
                                  (val?.roleID == 2 && "All Jobs") ||
                                  (val?.roleID == 3 && "My Jobs")}
                              </p>
                            </li>
                            <li>
                              <span>Phone Number</span>
                              <p>{val?.contactNo ? val?.contactNo : "NA"}</p>
                            </li>
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={previewClientStyle.formFields}>
              <div className={previewClientStyle.formFieldsbox}>
                <div className={previewClientStyle.formFieldsboxinner}>
                  <h2>
                    Engagement Details{" "}
                    {NetworkInfo.ENV !== "QA" && NetworkInfo.ENV !== "Live" && (
                      <span
                        className={previewClientStyle.editNewIcon}
                        onClick={() => setEditEngagement(true)}
                      >
                        <EditNewIcon />
                      </span>
                    )}
                  </h2>

                  <div className={previewClientStyle.companyDetails}>
                    {isEditEngagement && (
                      <>
                        <label
                          style={{
                            marginBottom: "8px",
                            display: "inline-block",
                          }}
                        >
                          Model{" "}
                          <span className={previewClientStyle.reqField}>*</span>
                        </label>
                        <div
                          className={`${previewClientStyle.row} ${previewClientStyle.mb24}`}
                        >
                          <div className={previewClientStyle.colMd6}>
                            <Checkbox
                              value={2}
                              onChange={(e) => {
                                setCheckPayPer({
                                  ...checkPayPer,
                                  companyTypeID:
                                    e.target.checked === true
                                      ? e.target.value
                                      : 0,
                                });
                                setPayPerError(false);
                                setIsChecked({
                                  ...IsChecked,
                                  isPostaJob: false,
                                  isProfileView: false,
                                });
                              }}
                              checked={checkPayPer?.companyTypeID}
                            >
                              Pay per Credit
                            </Checkbox>
                            <Checkbox
                              value={1}
                              onChange={(e) => {
                                // resetField('hiringPricingType')
                                unregister("hiringPricingType");
                                setCheckPayPer({
                                  ...checkPayPer,
                                  anotherCompanyTypeID:
                                    e.target.checked === true
                                      ? e.target.value
                                      : 0,
                                });
                                if (e.target.checked === true) {
                                  register("hiringPricingType", {
                                    require: true,
                                  });
                                }
                                setPayPerError(false);
                                setTypeOfPricing(null);
                              }}
                              checked={checkPayPer?.anotherCompanyTypeID}
                            >
                              Pay per Hire
                            </Checkbox>
                          </div>
                          <div className={previewClientStyle.colMd6}>
                            {!(
                              checkPayPer?.anotherCompanyTypeID == 0 &&
                              (checkPayPer?.companyTypeID == 0 ||
                                checkPayPer?.companyTypeID == 2)
                            ) && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  marginBottom: "32px",
                                }}
                              >
                                <label style={{ marginBottom: "12px" }}>
                                  Type Of Pricing
                                  <span className={previewClientStyle.reqField}>
                                    *
                                  </span>
                                </label>
                                {pricingTypeError && (
                                  <p className={previewClientStyle.error}>
                                    *Please select pricing type
                                  </p>
                                )}
                                <Radio.Group
                                  disabled={
                                    // userData?.LoggedInUserTypeID !== 1 ||
                                    checkPayPer?.anotherCompanyTypeID == 0 &&
                                    (checkPayPer?.companyTypeID == 0 ||
                                      checkPayPer?.companyTypeID == 2)
                                  }
                                  onChange={(e) => {
                                    setTypeOfPricing(e.target.value);
                                    setPricingTypeError &&
                                      setPricingTypeError(false);
                                  }}
                                  value={typeOfPricing}
                                >
                                  <Radio value={1}>Transparent Pricing</Radio>
                                  <Radio value={0}>
                                    Non Transparent Pricing
                                  </Radio>
                                </Radio.Group>
                              </div>
                            )}
                          </div>
                        </div>
                        { checkPayPer?.anotherCompanyTypeID === 1 && typeOfPricing !== null && <div className={previewClientStyle.row} >
                          <div className={previewClientStyle.colMd12}>
                              <HRSelectField 
                              controlledValue={controlledHiringPricingTypeValue}
                              setControlledValue={setControlledHiringPricingTypeValue}
                              isControlled={true}
                                mode={"id/value"}
                                setValue={setValue}
                                register={register}
                                // label={"Hiring Pricing Type"}
                                label={"Choose Engagement Mode"}
                                defaultValue="Select Engagement Mode"
                                options={getRequiredHRPricingType()}
                                name="hiringPricingType"
                                isError={errors["hiringPricingType"] && errors["hiringPricingType"]}
                                required={(checkPayPer?.anotherCompanyTypeID === 1 && typeOfPricing !== null) ? true : null}
                                errorMsg={"Please select the Engagement Mode."}
                              />
                          </div>
                          </div>}
                        <div className={previewClientStyle.row}>
                          <div className={previewClientStyle.colMd6}>
                            <label className={previewClientStyle.phoneLabel}>
                              Currency
                              <span className={previewClientStyle.reqField}>
                                *
                              </span>
                            </label>
                            <Select
                              onChange={(e) => {
                                setValue("creditCurrency", e);
                                seterrorCurrency(false);
                              }}
                              getPopupContainer={(trigger) =>
                                trigger.parentElement
                              }
                              name="creditCurrency"
                              value={_currency}
                              placeholder={"Select currency"}
                            >
                              <Select.Option value="INR">INR</Select.Option>
                              <Select.Option value="USD">USD</Select.Option>
                            </Select>
                            {errorCurrency && (
                              <p
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                                className={previewClientStyle.error}
                              >
                                * Please select currency
                              </p>
                            )}
                          </div>
                          {_currency === "INR" ? null : (
                            <div className={previewClientStyle.colMd6}>
                              <HRInputField
                                register={register}
                                errors={errors}
                                label="Per credit amount"
                                name="creditAmount"
                                type={InputType.NUMBER}
                                placeholder="Enter the rate per credit"
                                required={
                                  checkPayPer?.companyTypeID !== 0 &&
                                  checkPayPer?.companyTypeID !== null
                                    ? _currency === "INR"
                                      ? false
                                      : true
                                    : false
                                }
                                validationSchema={{
                                  required:
                                    checkPayPer?.companyTypeID !== 0 &&
                                    checkPayPer?.companyTypeID !== null
                                      ? _currency === "INR"
                                        ? null
                                        : "Please enter Per credit amount."
                                      : null,
                                }}
                              />
                            </div>
                          )}

                          <div className={previewClientStyle.colMd6}>
                          Remaining Credit : <span style={{fontWeight:"bold",marginBottom:"80px",marginTop:"20px"}}>{getCompanyDetails?.engagementDetails?.totalCreditBalance}</span>
                            <div
                              className={previewClientStyle.FreecreditFieldWrap}
                            >
                              <HRInputField
                                register={register}
                                errors={errors}
                                className="yourClassName"
                                validationSchema={{
                                  required:
                                    checkPayPer?.companyTypeID !== 0 &&
                                    checkPayPer?.companyTypeID !== null
                                      ? "Please enter free credits."
                                      : null,
                                  min: {
                                    value: 0,
                                    message: `please don't enter the value less than 0`,
                                  },
                                }}
                                onKeyDownHandler={(e) => {
                                  if (
                                    e.key === "-" ||
                                    e.key === "+" ||
                                    e.key === "E" ||
                                    e.key === "e"
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                                // label={`Free Credits Balance C redit : ${companyDetail?.jpCreditBalance}`}
                                name={"freeCredit"}
                                label="Free Credit"
                                type={InputType.NUMBER}
                                placeholder="Enter number of free credits"
                                required={
                                  checkPayPer?.companyTypeID !== 0 &&
                                  checkPayPer?.companyTypeID !== null
                                    ? true
                                    : false
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className={previewClientStyle.row}>
                          <div className={previewClientStyle.colMd6}></div>
                        </div>
                        <div className={previewClientStyle.row}>
                          <div className={previewClientStyle.colMd12}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                marginBottom: "16px",
                              }}
                            >
                              <div
                                className={
                                  previewClientStyle.payPerCheckboxWrap
                                }
                                style={{ marginBottom: "16px" }}
                              >
                                <Checkbox
                                  name="IsPostaJob"
                                  checked={IsChecked?.isPostaJob}
                                  onChange={(e) => {
                                    setIsChecked({
                                      ...IsChecked,
                                      isPostaJob: e.target.checked,
                                    });
                                    setCreditError(false);
                                  }}
                                >
                                  Credit per post a job.
                                </Checkbox>
                                <Checkbox
                                  name="IsProfileView"
                                  checked={IsChecked?.isProfileView}
                                  onChange={(e) => {
                                    setIsChecked({
                                      ...IsChecked,
                                      isProfileView: e.target.checked,
                                    });
                                    setCreditError(false);
                                  }}
                                >
                                  Credit per profile view.
                                </Checkbox>
                              </div>
                              {creditError && (
                                <p className={previewClientStyle.error}>
                                  *Please select option
                                </p>
                              )}

                              <div className={previewClientStyle.row}>
                                {IsChecked?.isPostaJob && (
                                  <div className={previewClientStyle.colMd6}>
                                    <HRInputField
                                      register={register}
                                      errors={errors}
                                      label="Credit per post a job"
                                      name="jobPostCredit"
                                      type={InputType.NUMBER}
                                      placeholder="Enter credit cost for posting a job"
                                      required={
                                        IsChecked?.isPostaJob ? true : false
                                      }
                                      validationSchema={{
                                        required: IsChecked?.isPostaJob
                                          ? "Please enter credit per post a job."
                                          : null,
                                      }}
                                    />
                                  </div>
                                )}

                                {IsChecked?.isProfileView && (
                                  <>
                                    <div className={previewClientStyle.colMd6}>
                                      <HRInputField
                                        register={register}
                                        errors={errors}
                                        label="Credit for viewing vetted profile"
                                        name="vettedProfileViewCredit"
                                        type={InputType.NUMBER}
                                        placeholder="Enter credit cost for unlocking one vetted profile"
                                        required={
                                          IsChecked?.isProfileView
                                            ? true
                                            : false
                                        }
                                        validationSchema={{
                                          required: IsChecked?.isProfileView
                                            ? "Please enter vetted profile credit."
                                            : null,
                                        }}
                                      />
                                    </div>
                                    <div className={previewClientStyle.colMd6}>
                                      <HRInputField
                                        register={register}
                                        errors={errors}
                                        label="Credit for Viewing non vetted profile"
                                        name="nonVettedProfileViewCredit"
                                        type={InputType.NUMBER}
                                        placeholder="Enter credit cost for unlocking one non vetted profile"
                                        required={
                                          IsChecked?.isProfileView
                                            ? true
                                            : false
                                        }
                                        validationSchema={{
                                          required: IsChecked?.isProfileView
                                            ? "Please enter non vetted profile credit."
                                            : null,
                                        }}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.mb24}`}
                        >
                          <button
                            type="button"
                            className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
                            onClick={() => setEditEngagement(false)}
                          >
                            {" "}
                            Cancel{" "}
                          </button>
                          <button
                            type="button"
                            className={previewClientStyle.btnPrimary}
                            onClick={() => addEngagementDetails()}
                          >
                            {" "}
                            SAVE{" "}
                          </button>
                        </div>
                      </>
                    )}

                    <div
                      className={`${previewClientStyle.companyDetailTop} ${previewClientStyle.engagementDetailListed}`}
                    >
                      <ul>
                        <li>
                          <span>Model</span>
                          {/* <p>{getCompanyDetails?.engagementDetails?.anotherCompanyTypeID === 1 && "Pay per Hire"}, 
                          {getCompanyDetails?.engagementDetails?.companyTypeID === 2 && "Pay per Credit"}</p> */}
                          <p>
                            {companyTypeMessages ? companyTypeMessages : "NA"}
                          </p>
                        </li>
                        <li>
                          <span>Per Credit Amount</span>
                          <p>
                            {getCompanyDetails?.engagementDetails?.creditAmount
                              ? getCompanyDetails?.engagementDetails
                                  ?.creditAmount
                              : "NA"}
                          </p>
                        </li>
                        <li>
                          <span>Credit for viewing vetted profile</span>
                          <p>
                            {getCompanyDetails?.engagementDetails
                              ?.vettedProfileViewCredit
                              ? getCompanyDetails?.engagementDetails
                                  ?.vettedProfileViewCredit
                              : "NA"}
                          </p>
                        </li>
                        <li>
                          <span>Credit per post a job</span>
                          <p>
                            {getCompanyDetails?.engagementDetails?.jobPostCredit
                              ? getCompanyDetails?.engagementDetails
                                  ?.jobPostCredit
                              : "NA"}
                          </p>
                        </li>
                        <li>
                          <span>Currency (Credit)</span>
                          <p>
                            {getCompanyDetails?.engagementDetails
                              ?.creditCurrency
                              ? getCompanyDetails?.engagementDetails
                                  ?.creditCurrency
                              : "NA"}
                          </p>
                        </li>
                        <li>
                          <span>Total Credit Balance</span>
                          <p>
                            {getCompanyDetails?.engagementDetails
                              ?.totalCreditBalance
                              ? getCompanyDetails?.engagementDetails
                                  ?.totalCreditBalance
                              : "NA"}
                          </p>
                        </li>
                        <li>
                          <span>Credit for viewing non vetted profile</span>
                          <p>
                            {getCompanyDetails?.engagementDetails
                              ?.nonVettedProfileViewCredit
                              ? getCompanyDetails?.engagementDetails
                                  ?.nonVettedProfileViewCredit
                              : "NA"}
                          </p>
                        </li>

                        <li>
                          <span>Type of Pricing (Pay per hire)</span>
                          <p>
                            {getCompanyDetails?.engagementDetails
                              ?.isTransparentPricing == true
                              ? "Transparent"
                              : "Non Transparent"}
                          </p>
                        </li>
                        <li>
                          <span>Model (Pay per hire)</span>
                          <p>
                            {getCompanyDetails?.engagementDetails
                              ?.hiringTypePricingId === 1
                              ? "Hire a Contractor"
                              : getCompanyDetails?.engagementDetails
                                  ?.hiringTypePricingId === 2
                              ? "Hire an employee on Uplers Payroll"
                              : getCompanyDetails?.engagementDetails
                                  ?.hiringTypePricingId === 3
                              ? "Direct-hire on your payroll"
                              : getCompanyDetails?.engagementDetails
                                  ?.hiringTypePricingId === 4
                              ? "Hire part time Contractors"
                              : "NA"}
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className={previewClientStyle.formFields}>
              <div className={previewClientStyle.formFieldsbox}>
                <div className={previewClientStyle.formFieldsboxinner}>
                  <h2>
                    Uplers’s POC{" "}
                    {NetworkInfo.ENV !== "QA" && NetworkInfo.ENV !== "Live" && (
                      <span
                        className={previewClientStyle.editNewIcon}
                        onClick={() => setEditPOC(true)}
                      >
                        <EditNewIcon />
                      </span>
                    )}
                  </h2>

                  <div className={previewClientStyle.companyDetails}>
                    <div className={previewClientStyle.companyBenefits}>
                      <ul className={previewClientStyle.mt0}>
                        {getCompanyDetails?.pocUserDetails?.map((item) => (
                          <li>
                            <span>{item?.pocName}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {isEditPOC && (
                      <div className={previewClientStyle.row}>
                        <div
                          className={`${previewClientStyle.colMd12} ${previewClientStyle.mt24}`}
                        >
                          <div className={previewClientStyle.MultiselectCustom}>
                            <HRSelectField
                              isControlled={true}
                              controlledValue={controlledPOC}
                              setControlledValue={setControlledPOC}
                              setValue={setValue}
                              // mode={"multiple"}
                              mode={"id/value"}
                              register={register}
                              name="uplersPOCname"
                              label="Uplers's POC name"
                              defaultValue="Enter POC name"
                              options={allPocs}
                              // required
                              // isError={errors["uplersPOCname"] && errors["uplersPOCname"]}
                              // errorMsg="Please select POC name."
                            />
                          </div>

                          <div
                            className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.mt24}`}
                          >
                            <button
                              type="button"
                              className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
                              onClick={() => setEditPOC(false)}
                            >
                              {" "}
                              Cancel{" "}
                            </button>
                            <button
                              type="button"
                              className={previewClientStyle.btnPrimary}
                              onClick={() => handleSubmitUplersPOC()}
                            >
                              {" "}
                              SAVE{" "}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </Modal>

      {/* Company name Modal*/}
      <Modal
        centered
        open={isEditCompanyName}
        onOk={() => setIsEditCompanyName(false)}
        onCancel={() => setIsEditCompanyName(false)}
        width={500}
        footer={false}
        maskClosable={false}
        className="prevClientModal"
        wrapClassName={previewClientStyle.prevClientModalWrapper}
      >
        <HRInputField
          //    required
          rows={4}
          errors={errors}
          label={"Company Name"}
          register={register}
          setValue={setValue}
          name="companyName"
          type={InputType.TEXT}
          placeholder="Company website"
        />
        <div
          className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.BtnRight}`}
        >
          <button
            type="button"
            className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
            onClick={() => setIsEditCompanyName(false)}
          >
            {" "}
            Cancel{" "}
          </button>
          <button
            type="button"
            className={previewClientStyle.btnPrimary}
            onClick={() => {
              handleSubmitcompanyName();
            }}
          >
            {" "}
            SAVE{" "}
          </button>
        </div>
      </Modal>
      {/* Company website Modal*/}
      <Modal
        centered
        open={isEditCompanyWebsite}
        onOk={() => setIsEditCompanyWebsite(false)}
        onCancel={() => setIsEditCompanyWebsite(false)}
        width={500}
        footer={false}
        maskClosable={false}
        className="prevClientModal"
        wrapClassName={previewClientStyle.prevClientModalWrapper}
      >
        <HRInputField
          //    required
          rows={4}
          errors={errors}
          label={"Company website"}
          register={register}
          setValue={setValue}
          name="companyWebsite"
          type={InputType.TEXT}
          placeholder="Company website"
        />
        <div
          className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.BtnRight}`}
        >
          <button
            type="button"
            className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
            onClick={() => setIsEditCompanyWebsite(false)}
          >
            {" "}
            Cancel{" "}
          </button>
          <button
            type="button"
            className={previewClientStyle.btnPrimary}
            onClick={() => handleSubmitcompanyWebsite()}
          >
            {" "}
            SAVE{" "}
          </button>
        </div>
      </Modal>
      {/* Company Found Modal*/}
      <Modal
        centered
        open={isEditCompanyFound}
        onOk={() => setIsEditCompanyFound(false)}
        onCancel={() => setIsEditCompanyFound(false)}
        width={300}
        footer={false}
        maskClosable={false}
        className="prevClientModal"
        wrapClassName={previewClientStyle.prevClientModalWrapper}
      >
        <div className={previewClientStyle.row}>
          <div className={previewClientStyle.colMd12}>
            {/* <HRInputField
              //    required
              rows={4}
              errors={errors}
              label={"Founded in"}
              register={register}
              name="foundedIn"
              setValue={setValue}
              type={InputType.TEXT}
              placeholder="Please enter"
              className={previewClientStyle.inputcustom}
              inputClassName={previewClientStyle.inputcustom}
            /> */}

            <HRSelectField
              controlledValue={controlledFoundedInValue}
              setControlledValue={setControlledFoundedInValue}
              isControlled={true}
              register={register}
              //  errors={errors}
              setValue={setValue}
              label="Founded in"
              name="foundedIn"
              mode={"value"}
              defaultValue="Select Year"
              //  isError={errors["foundedIn"] && errors["foundedIn"]}
              //  required
              //  errorMsg={"Please select Founded in"}
              options={yearOptions}
            />
            <div className={`${previewClientStyle.buttonEditGroup}`}>
              <button
                type="button"
                className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
                onClick={() => setIsEditCompanyFound(false)}
              >
                {" "}
                Cancel{" "}
              </button>
              <button
                type="button"
                className={previewClientStyle.btnPrimary}
                onClick={() => handleSubmitcompanyFound()}
              >
                {" "}
                SAVE{" "}
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {/* Team Size Modal*/}
      <Modal
        centered
        open={isEditTeamSize}
        onOk={() => setIsEditTeamSize(false)}
        onCancel={() => setIsEditTeamSize(false)}
        width={300}
        footer={false}
        maskClosable={false}
        className="prevClientModal"
        wrapClassName={previewClientStyle.prevClientModalWrapper}
      >
        <HRInputField
          // mode='id/value'
          // controlledValue={feedBackTypeEdit}
          // setControlledValue={setFeedbackTypeEdit}
          // isControlled={true}
          setValue={setValue}
          register={register}
          name="teamSize"
          label="Team Size"
          defaultValue="Please Select"
        />

        <div className={`${previewClientStyle.buttonEditGroup}`}>
          <button
            type="button"
            className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
            onClick={() => setIsEditTeamSize(false)}
          >
            {" "}
            Cancel{" "}
          </button>
          <button
            type="button"
            className={previewClientStyle.btnPrimary}
            onClick={() => handleSubmitTeamSize()}
          >
            {" "}
            SAVE{" "}
          </button>
        </div>
      </Modal>
      {/* Company Type Modal*/}
      {/* <Modal
        centered
        open={isEditCompanyType}
        onOk={() => setIsEditCompanyType(false)}
        onCancel={() => setIsEditCompanyType(false)}
        width={400}
        footer={false}
        maskClosable={false}
        className="prevClientModal"
        wrapClassName={previewClientStyle.prevClientModalWrapper}
      >
        <HRInputField
          //    required
          rows={4}
          setValue={setValue}
          errors={errors}
          label={"Company Type"}
          register={register}
          name="companyType"
          type={InputType.TEXT}
          placeholder="Please enter"
        />
        <div className={`${previewClientStyle.buttonEditGroup} `}>
          <button
            type="button"
            className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
            onClick={() => setIsEditCompanyType(false)}
          >
            {" "}
            Cancel{" "}
          </button>
          <button
            type="button"
            className={previewClientStyle.btnPrimary}
            onClick={() => handleSubmitCompanyType()}
          >
            {" "}
            SAVE{" "}
          </button>
        </div>
      </Modal> */}
      {/* Company Industry Modal*/}
      <Modal
        centered
        open={isEditCompanyIndustry}
        onOk={() => setIsEditCompanyIndustry(false)}
        onCancel={() => setIsEditCompanyIndustry(false)}
        width={400}
        footer={false}
        maskClosable={false}
        className="prevClientModal"
        wrapClassName={previewClientStyle.prevClientModalWrapper}
      >
        <HRInputField
          //    required
          rows={4}
          errors={errors}
          label={"Company Industry"}
          register={register}
          name="companyIndustry"
          setValue={setValue}
          type={InputType.TEXT}
          placeholder="Please enter Industry"
        />
        <div className={`${previewClientStyle.buttonEditGroup}`}>
          <button
            type="button"
            className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
            onClick={() => setIsEditCompanyIndustry(false)}
          >
            {" "}
            Cancel{" "}
          </button>
          <button
            type="button"
            className={previewClientStyle.btnPrimary}
            onClick={() => handleSubmitCompanyIndustry()}
          >
            {" "}
            SAVE{" "}
          </button>
        </div>
      </Modal>
      {/* Headquarters Modal*/}
      <Modal
        centered
        open={isEditHeadquarters}
        onOk={() => setIsEditHeadquarters(false)}
        onCancel={() => setIsEditHeadquarters(false)}
        width={300}
        footer={false}
        maskClosable={false}
        className="prevClientModal"
        wrapClassName={previewClientStyle.prevClientModalWrapper}
      >
        <label>Headquarters</label>
        <HRInputField
          //    required
          rows={4}
          errors={errors}
          register={register}
          name="headquarters"
          setValue={setValue}
          type={InputType.TEXT}
          placeholder="Please enter"
        />
        <div className={`${previewClientStyle.buttonEditGroup}`}>
          <button
            type="button"
            className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
            onClick={() => setIsEditHeadquarters(false)}
          >
            {" "}
            Cancel{" "}
          </button>
          <button
            type="button"
            className={previewClientStyle.btnPrimary}
            onClick={() => handleSubmitCompanyHeadquarters()}
          >
            {" "}
            SAVE{" "}
          </button>
        </div>
      </Modal>
      {/* Linkedin URL Modal*/}
      <Modal
        centered
        open={isEditLinkedInURL}
        onOk={() => setIsEditLinkedInURL(false)}
        onCancel={() => setIsEditLinkedInURL(false)}
        width={300}
        footer={false}
        maskClosable={false}
        className="prevClientModal"
        wrapClassName={previewClientStyle.prevClientModalWrapper}
      >
        <label>Linkedin URL</label>
        <HRInputField
          //    required
          rows={4}
          errors={errors}
          register={register}
          name="linkedinURL"
          setValue={setValue}
          type={InputType.TEXT}
          placeholder="Please enter"
        />
        <div className={`${previewClientStyle.buttonEditGroup}`}>
          <button
            type="button"
            className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}
            onClick={() => isEditLinkedInURL(false)}
          >
            {" "}
            Cancel{" "}
          </button>
          <button
            type="button"
            className={previewClientStyle.btnPrimary}
            onClick={() => handleSubmitCompanyLinkedIn()}
          >
            {" "}
            SAVE{" "}
          </button>
        </div>
      </Modal>
      {showUploadModal && (
        <UploadModal
          isFooter={false}
          uploadFileHandler={uploadFileHandler}
          modalTitle={"Upload Logo"}
          openModal={showUploadModal}
          cancelModal={() => setUploadModal(false)}
          setValidation={setValidation}
          getValidation={getValidation}
        />
      )}
    </>
  );
}

export default PreviewClientModal;
