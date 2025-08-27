import React, { useState, useCallback, useEffect } from "react";
import AddNewClientStyle from "./addclient.module.css";
import { ReactComponent as EditSVG } from "assets/svg/EditField.svg";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { InputType, EmailRegEx, ValidateFieldURL } from "constants/application";
import UploadModal from "shared/components/uploadModal/uploadModal";
import { Avatar, Skeleton } from "antd";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import PreviewClientModal from "modules/client/components/previewClientDetails/previewClientModal";
import spinGif from "assets/gif/RefreshLoader.gif";
import ReactQuill from "react-quill";
import { sanitizeLinks } from "modules/hiring request/screens/allHiringRequest/previewHR/services/commonUsedVar";
import EngagementSection from "./engagementSection";

function CompanySection({
  companyID,
  register,
  errors,
  setValue,
  watch,
  companyDetails,
  setCompanyDetails,
  loadingDetails,
  clearErrors,
  setError,
  setDisableSubmit,
  aboutCompanyError,
  getDetailsForAutoFetchAI,
  loadingCompanyDetails,
  showFetchATButton,
  setShowFetchAIButton,
  filtersList,
  resetField,unregister,fields,hooksProps,engagementDetails,hiringDetailsFromGetDetails
}) {
  const [getUploadFileData, setUploadFileData] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [showUploadModal, setUploadModal] = useState(false);
  const [controlledFoundedInValue, setControlledFoundedInValue] = useState("");
  const [isViewCompany, setIsViewCompany] = useState(false);
  const [isViewCompanyurl, setIsViewCompanyurl] = useState(false);
  const [isPreviewModal, setIsPreviewModal] = useState(false);
  const [getcompanyID, setcompanyID] = useState("");
  const [disableCompanyURL, setDisableCompanyURL] = useState(
    companyID === "0" ? true : false
  );
  const [getValidation, setValidation] = useState({
    systemFileUpload: "",
    googleDriveFileUpload: "",
    linkValidation: "",
  });

    const [controlledLeadTypeValue, setControlledLeadTypeValue] = useState("");
    const [controlledLeadUserValue, setControlledLeadUserValue] = useState("");
    const [controlledCategoryValue, setControlledCategoryValue] = useState("None");

  const leadTypeOptions = [{
    id: 12,
    value: 'InBound',
  },
  {
    id: 11,
    value: 'OutBound',
  },
  {
    id: 4,
    value: 'Referral',
  },
  {
    id: 176,
    value: 'Partnership',
  }
];

  useEffect(() => {
    companyDetails?.companyLogo && setUploadFileData(companyDetails?.companyLogo)
    // companyDetails?.companyLogo.includes(NetworkInfo.PROTOCOL +
    //   NetworkInfo.DOMAIN) ? setUploadFileData(companyDetails?.companyLogo) :  setUploadFileData(  NetworkInfo.PROTOCOL +
    //     NetworkInfo.DOMAIN +
    //     "Media/CompanyLogo/" + companyDetails?.companyLogo);
    companyDetails?.companyName &&
      setValue("companyName", companyDetails?.companyName);
    companyDetails?.website && setValue("companyURL", companyDetails?.website);
    if (companyDetails?.foundedYear) {
      setValue("foundedIn", companyDetails?.foundedYear);
      setControlledFoundedInValue(companyDetails?.foundedYear);
    }
    companyDetails?.teamSize > 0 &&
      setValue("teamSize", companyDetails?.teamSize);
    companyDetails?.companyType &&
      setValue("companyType", companyDetails?.companyType);
    companyDetails?.headquaters &&
      setValue("headquaters", companyDetails?.headquaters);
    companyDetails?.aboutCompany &&
      setValue("aboutCompany", companyDetails?.aboutCompany);
    companyDetails?.companyIndustry &&
      setValue("industry", companyDetails?.companyIndustry);
    companyDetails?.linkedInProfile &&
      setValue("companyLinkedinURL", companyDetails?.linkedInProfile);

    setValue("LeadType", companyDetails?.leadUserType);
    setControlledLeadTypeValue(companyDetails?.leadUserType)
    setValue("LeadUser", companyDetails?.leadUserID);
    setControlledLeadUserValue(companyDetails?.leadUserName)
    setControlledCategoryValue(companyDetails?.company_Category ? companyDetails?.company_Category :  'None')
    setValue('Category',companyDetails?.company_Category ? companyDetails?.company_Category : 'None')
  }, [companyDetails]);

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
        filesToUpload.append("type","company_logo")

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
              // companyLogoAWS: imgUrls[0],
              ...prev.basicDetails?.companyLogo,
            },
          }));
        }

        setUploadModal(false);
      }
    },
    [getValidation, setBase64Image, setUploadFileData]
  );

  const validateCompanyName = async () => {
    if (companyID === "0") {
      setDisableCompanyURL(true);
      clearErrors("companyURL");
      setValue("companyURL", "");
    }
    if (watch("companyName")) {
      if (companyDetails?.companyName === watch("companyName")) {
        clearErrors("companyName");
        setDisableSubmit(false);
        setIsViewCompany(false);
        return;
      }

      let payload = {
        workEmail: "",
        companyName: watch("companyName"),
        currentCompanyID: +companyID,
      };

      const result = await allCompanyRequestDAO.validateClientCompanyDAO(
        payload
      );

      if (result.statusCode === HTTPStatusCode.OK) {
        clearErrors("companyName");
        setDisableSubmit(false);
        setIsViewCompany(false);
        setDisableCompanyURL(false);
      }
      if (result.statusCode === HTTPStatusCode.BAD_REQUEST) {
        setDisableSubmit(true);
        setIsViewCompany(true);
        if (companyID === "0") {
          setDisableCompanyURL(true);
        }
        setcompanyID(result?.details?.companyID);
        setError("companyName", {
          type: "manual",
          message: result?.responseBody,
        });
      }
    }
  };

  const validateCompanyURL = async () => {
    setShowFetchAIButton(false);
    // clearErrors("companyURL");
    setIsViewCompanyurl(false);
    
    if(!watch("companyName")){
      setError("companyURL", {
        type: "manual",
        message: 'Company Name / Website URL can not be blank to fetch the company logo',
      });
    }
    if (watch("companyURL")) {
      let linkedInPattern = /linkedin\.com/i;
      if(linkedInPattern.test(watch("companyURL"))){
        setError("companyURL", {
          type: "manual",
          message: 'Entered value does not match url format',
        });
        return 
      }

      if (ValidateFieldURL(watch("companyURL"), "website")) {
        if (companyDetails?.website === watch("companyURL")) {
          clearErrors("companyURL");
          setDisableSubmit(false);
          setIsViewCompanyurl(false);
          return;
        }
        let payload = {
          workEmail: "",
          companyName: watch("companyName"),
          currentCompanyID: +companyID,
          websiteURL: watch("companyURL"),
        };

        const result = await allCompanyRequestDAO.validateClientCompanyDAO(
          payload
        );

        if (result.statusCode === HTTPStatusCode.OK) {
          clearErrors("companyURL");
          setDisableSubmit(false);
          setIsViewCompanyurl(false);
          if (companyID === "0") {
            // setShowFetchAIButton(true);
            getDetailsForAutoFetchAI(watch("companyURL"))
          }
        }
        if (result.statusCode === HTTPStatusCode.BAD_REQUEST) {
          setDisableSubmit(true);
          setIsViewCompanyurl(true);
          setcompanyID(result?.details?.companyID);
          setError("companyURL", {
            type: "manual",
            message: result?.responseBody,
          });
        }
      } else {
        setError("companyURL", {
          type: "manual",
          message: "Entered value does not match url format",
        });
      }
    }
  };

  const base64ToBlob = (base64Data, contentType = '') => {
    const byteString = atob(base64Data.split(',')[1]);
    const byteArrays = [];
  
    for (let i = 0; i < byteString.length; i++) {
      byteArrays.push(byteString.charCodeAt(i));
    }
  
    return new Blob([new Uint8Array(byteArrays)], { type: contentType });
  };

  const base64ToFile = async (base64, filename) => {
    const mimeType = base64.match(/data:(.*?);base64/)[1]; // Extract MIME type
    const blob = base64ToBlob(base64, mimeType);
    const file = new File([blob], filename, { type: mimeType });  
    return file;
  };

  async function onHandleBlurImage() {
    let content = watch("aboutCompany")
    const imgTags = content?.match(/<img[^>]*>/g) || [];
    const list = [];
    const base64Srcs = []; 
    
    for (const imgTag of imgTags) {
      if (!imgTag) continue;
  
      const srcMatch = imgTag.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        const src = srcMatch[1];
        const filename = src.split('/').pop();
        const timestamp = new Date().getTime();
        const name = filename.split(/\.(?=[^\.]+$)/);
        const uniqueFilename = `${name}_${timestamp}`;
        if (src.startsWith('data:image/')) {
          base64Srcs.push(src)
          const file = await base64ToFile(src, uniqueFilename);
          list.push(file);
        }
      }
    }
  
    if(list.length>0){
      const formData = new FormData();
      list.forEach(file => formData.append("Files", file));
      formData.append('IsCompanyLogo', false);
      formData.append('IsCultureImage', true);
      formData.append("Type", "culture_images");
    
      let Result = await allCompanyRequestDAO.uploadImageDAO(formData);
      const uploadedUrls = Result?.responseBody || [];
    
      let updatedContent = content;
      base64Srcs.forEach((src, index) => {
        if (uploadedUrls[index]) {
          const escapedSrc = src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
          const regex = new RegExp(`src="${escapedSrc}"`, 'g');
          updatedContent = updatedContent.replace(regex, `src="${uploadedUrls[index]}"`);
        }
      });
      setValue("aboutCompany", updatedContent)
    }
  }

  return (
    <>
      <div className={AddNewClientStyle.tabsFormItem}>
        {loadingDetails ? (
          <Skeleton active />
        ) : (
          <>
            <div className={AddNewClientStyle.tabsFormItemInner}>
              <div className={AddNewClientStyle.tabsLeftPanel}>
                <h3>Basic Company Details</h3>
                <p>
                  The Talents would be able to see <br /> fields highlighted in
                  blue.
                </p>
              </div>

              <div className={AddNewClientStyle.tabsRightPanel}>
                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd12}>
                    <div
                      style={{
                        width: "145px",
                        height: "145px",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          width: "145px",
                          height: "145px",
                          backgroundColor: "#EBEBEB",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        {" "}
                        {!getUploadFileData ? (
                          <Avatar
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                            }}
                            size="large"
                          >
                            {companyDetails?.companyName
                              ?.substring(0, 2)
                              .toUpperCase()}
                          </Avatar>
                        ) : (
                          <img
                            style={{
                              width: "145px",
                              height: "145px",
                              borderRadius: "50%",
                            }}
                            src={base64Image ? base64Image : getUploadFileData}
                            alt="preview"
                          />
                        )}
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <div
                          style={{
                            background: "var(--color-sunlight)",
                            marginTop: "-25px",
                            marginRight: "11px",
                            display: "flex",
                            padding: "2px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            zIndex: 50,
                          }}
                        >
                          <EditSVG
                            width={24}
                            height={24}
                            onClick={() => setUploadModal(true)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                 {loadingCompanyDetails && <div className={AddNewClientStyle.colMd12}>
                     <p style={{ fontWeight: "bold", color: "green" }}>
                        Fetching  Company Logo From AI ... <img src={spinGif} alt="loadgif"  width={16} />
                     </p>
                  </div>} 
                </div>

                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      label="Company Name"
                      name="companyName"
                      type={InputType.TEXT}
                      validationSchema={{
                        required: "Please enter the Company Name",
                      }}
                      onBlurHandler={() => validateCompanyName()}
                      onChangeHandler={(e) => {
                        if (companyID === "0") {
                          setShowFetchAIButton(false);
                          clearErrors("companyURL");
                          setIsViewCompanyurl(false);
                        }
                      }}
                      placeholder="Enter Name"
                      required
                    />
                    <div
                      className={AddNewClientStyle.formPanelAction}
                      style={{
                        padding: "0 0 20px",
                        justifyContent: "flex-start",
                      }}
                    >
                      {isViewCompany && (
                        <button
                          className={AddNewClientStyle.btnPrimary}
                          onClick={() => setIsPreviewModal(true)}
                        >
                          View Company
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={AddNewClientStyle.colMd6}>
                    {/* {loadingCompanyDetails ? (
                      <>
                        <Skeleton active />

                        <p style={{ fontWeight: "bold", color: "green" }}>
                          Fetching Company Details From AI ...
                        </p>
                      </>
                    ) : ( */}
                      <>
                        <HRInputField
                          register={register}
                          errors={errors}
                          label="Company Website URL"
                          name="companyURL"
                          type={InputType.TEXT}
                          validationSchema={{
                            required: "Please enter the Company Website link.",
                            validate: (value) => {
                             
                              if (ValidateFieldURL(value, "website")) {
                                return true;
                              }else {
                                return "Entered value does not match url format";
                              }
                            },
                          }}
                          placeholder="Enter website url"
                          required
                          onBlurHandler={() => validateCompanyURL()}
                          // disabled={disableCompanyURL}
                        />
                        <div
                          className={AddNewClientStyle.formPanelAction}
                          style={{
                            padding: "0 0 20px",
                            justifyContent: "flex-start",
                          }}
                        >
                          {/* {showFetchATButton && (
                            <div>
                              <button
                                className={AddNewClientStyle.btnPrimary}
                                onClick={() =>
                                  getDetailsForAutoFetchAI(watch("companyURL"))
                                }
                              >
                                Fetch detail From AI
                              </button>
                              <p style={{ color: "orange", margin: "5px 0" }}>
                                Fetch Company details from parsing tools like
                                X-Ray Search.
                              </p>
                            </div>
                          )} */}
                          {isViewCompanyurl && watch("companyName") && (
                            <button
                              className={AddNewClientStyle.btnPrimary}
                              onClick={() => setIsPreviewModal(true)}
                            >
                              View Company
                            </button>
                          )}
                        </div>
                      </>
                    {/* )} */}
                  </div>

                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      validationSchema={{
                        // required: "please enter the company linkedin URL.",
                         required: false,
                        validate: (value) => {
                          try {
                            if (ValidateFieldURL(value, "linkedin")) {
                              return true;
                            } else {
                              return "Entered value does not match linkedin url format";
                            }
                          } catch (error) {
                            return "Entered value does not match url format";
                          }
                        },
                      }}
                      label="Company Linkedin URL"
                      name={"companyLinkedinURL"}
                      type={InputType.TEXT}
                      placeholder="https://www.linkedin.com/company/companyname"
                      required={false}
                    />
                  </div>

                  <div className={AddNewClientStyle.colMd6}>
                    <div className={AddNewClientStyle.formGroup}>
                      <HRSelectField
                        controlledValue={controlledFoundedInValue}
                        setControlledValue={setControlledFoundedInValue}
                        isControlled={true}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        searchable={true}
                        label="Founded in"
                        name="foundedIn"
                        mode={"value"}
                        defaultValue="Select Year"
                        isError={errors["foundedIn"] && errors["foundedIn"]}
                        required
                        errorMsg={"Please select Founded in"}
                        options={yearOptions}
                      />
                    </div>
                  </div>
                </div>

                <EngagementSection
                  companyID={companyID}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                  resetField={resetField}
                  unregister={unregister}
                  hiringDetailsFromGetDetails={hiringDetailsFromGetDetails}
                  engagementDetails={engagementDetails}
                  hooksProps={hooksProps}
                  loadingDetails={loadingDetails}
                  fields={fields}
                />

                <div className={AddNewClientStyle.row}>
                 <div className={AddNewClientStyle.colMd6}>
                      <HRSelectField
                                    controlledValue={controlledLeadTypeValue}
                                    setControlledValue={val=>{
                                      setControlledLeadTypeValue(val)
                                      setControlledLeadUserValue('')
                                      resetField("LeadUser")
                                    }}
                                    isControlled={true}
                                    register={register}
                                     errors={errors}
                                     isError={
                                      errors['LeadType'] && errors['LeadType']
                                    }
                                    errorMsg="Please select lead type."
                                    setValue={setValue}
                                    label="Lead Type"
                                    name="LeadType"
                                    mode={"value"}
                                    defaultValue="Select"
                                    // searchable={true}
                                    //  isError={errors["foundedIn"] && errors["foundedIn"]}
                                    required
                                    //  errorMsg={"Please select Founded in"}
                                    options={leadTypeOptions}
                                  />
                  </div>

                  <div className={AddNewClientStyle.colMd6}>
                       <HRSelectField
                                    controlledValue={controlledLeadUserValue}
                                    setControlledValue={setControlledLeadUserValue}
                                    isControlled={true}
                                    register={register}
                                     errors={errors}
                                     isError={
                                      errors['LeadUser'] && errors['LeadUser']
                                    }
                                    errorMsg="Please select a user."
                                    setValue={setValue}
                                    label="Lead User"
                                    name="LeadUser"
                                    mode={"id"}
                                    defaultValue="Select"
                                    searchable={true}
                                    //  isError={errors["foundedIn"] && errors["foundedIn"]}
                                    required
                                    //  errorMsg={"Please select Founded in"}
                                    options={filtersList?.LeadUsers?.filter(val => {
                                      if(watch('LeadType') === 'InBound'){
                                        return val.userTypeId === 12
                                      }
                                      else if(watch('LeadType') === 'Referral'){
                                        return val.userTypeId === 4
                                      }
                                      else if(watch('LeadType') === 'Partnership'){
                                        return val.employeeId === "UP1831"
                                      }else{
                                        return val.userTypeId === 11
                                      }
                                    }).map(item=> ({
                                      id: item.id,
                                      value: item.fullName,
                                    }))}
                                  />
                  </div>
                  </div>

                <div className={AddNewClientStyle.row}>
                 

                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      name="teamSize"
                      label="Team Size"
                      type={InputType.NUMBER}
                      validationSchema={{
                        required: "Please enter the team size.",
                        min: {
                          value: 1,
                          message: `please don't enter the value less than 1`,
                        },
                      }}
                      onChangeHandler={(e) => {
                        // setCompanyName(e.target.value);
                        // debounceDuplicateCompanyName(e.target.value);
                      }}
                      placeholder="Enter team size"
                      required
                    />
                  </div>

                  {/* <div className={AddNewClientStyle.colMd6}>
            <HRInputField
                    register={register}
                    errors={errors}
                    name="companyType"
                    label="Company Type"
                    type={InputType.TEXT}
                    validationSchema={{
                      required: "Please enter the Company Type",
                      // pattern: {
                      // 	value: URLRegEx.url,
                      // 	message: 'Entered value does not match url format',
                      // },
                    }}
                    onChangeHandler={(e) => {
                      // setCompanyName(e.target.value);
                      // debounceDuplicateCompanyName(e.target.value);
                    }}
                    placeholder="Enter company type"
                    required
                  />
              </div> */}
                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      name="industry"
                      label="Industry"
                      type={InputType.TEXT}
                      validationSchema={{
                        required: "Please enter the industry",
                      }}
                      onChangeHandler={(e) => {
                        // setCompanyName(e.target.value);
                        // debounceDuplicateCompanyName(e.target.value);
                      }}
                      placeholder="Enter Industry"
                      required
                    />
                  </div>
                </div>

                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      // errors={errors}
                      label="Headquarters"
                      name="headquaters"
                      type={InputType.TEXT}
                      // validationSchema={{
                      //   required: "Please enter the Founded in",
                      //   // pattern: {
                      //   // 	value: URLRegEx.url,
                      //   // 	message: 'Entered value does not match url format',
                      //   // },
                      // }}
                      onChangeHandler={(e) => {
                        // setCompanyName(e.target.value);
                        // debounceDuplicateCompanyName(e.target.value);
                      }}
                      placeholder="Search location"
                      // required
                    />
                  </div>


{console.log('Category',watch('Category'))}

                  <div className={AddNewClientStyle.colMd6}>
                           <HRSelectField
                              controlledValue={controlledCategoryValue}
                              setControlledValue={setControlledCategoryValue}
                              isControlled={true}
                              register={register}
                              errors={errors}
                              isError={
                                errors['Category'] && errors['Category']
                              }
                              errorMsg="Please select category."
                              setValue={setValue}
                              label="Category"
                              name="Category"
                              mode={"value"}
                              defaultValue="Select"              
                              required              
                              options={[{
                                id: 'Diamond',
                                value: 'Diamond',
                              },
                              {
                                id: 'None',
                                value: 'None',
                              },
                             ]}
                          />  
                  </div>
                </div>

                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd12}>
                    <div className={AddNewClientStyle.label}>
                      About Company{" "}
                      <span className={AddNewClientStyle.reqField}>*</span>
                    </div>
                    <ReactQuill
                      register={register}
                      setValue={setValue}
                      theme="snow"
                      className="heightSize"
                      value={
                        !watch("aboutCompany")
                          ? companyDetails?.aboutCompany ?? ""
                          : watch("aboutCompany")
                      }
                      name="aboutCompany"
                      onChange={(val) => {
                        let sanitizedContent = sanitizeLinks(val);
                        // let _updatedVal = sanitizedContent?.replace(/<img\b[^>]*>/gi, '');
                        setValue("aboutCompany", sanitizedContent)}}
                      onBlur={()=>{onHandleBlurImage()}}
                    />
                    {aboutCompanyError && (
                      <p className={AddNewClientStyle.error}>
                        *Please enter About company
                      </p>
                    )}
                  </div>
                </div>

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
              </div>
            </div>
          </>
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
}

export default CompanySection;
