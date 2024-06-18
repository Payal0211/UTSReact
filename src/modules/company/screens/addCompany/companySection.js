import React,{useState, useCallback, useEffect} from "react";
import AddNewClientStyle from "./addclient.module.css";
import { ReactComponent as EditSVG } from "assets/svg/EditField.svg";

import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { InputType, EmailRegEx, ValidateFieldURL } from "constants/application";

import TextEditor from "shared/components/textEditor/textEditor";
import UploadModal from "shared/components/uploadModal/uploadModal";
import { Avatar, Skeleton } from 'antd';
import { HTTPStatusCode } from "constants/network";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import { useNavigate } from "react-router-dom";
import PreviewClientModal from "modules/client/components/previewClientDetails/previewClientModal";
import ReactQuill from "react-quill";


function CompanySection({companyID,register,errors,setValue,watch,companyDetails,setCompanyDetails,loadingDetails,clearErrors,setError,
  setDisableSubmit,aboutCompanyError,getDetailsForAutoFetchAI,loadingCompanyDetails,showFetchATButton,setShowFetchAIButton}) {

  const [getUploadFileData, setUploadFileData] = useState('');
  const [base64Image, setBase64Image] = useState('');
  const [showUploadModal, setUploadModal] = useState(false);
  const [controlledFoundedInValue, setControlledFoundedInValue] = useState('')
  const [isViewCompany, setIsViewCompany] = useState(false)
  const [isViewCompanyurl, setIsViewCompanyurl] = useState(false)
  const [currentCompanyId, setCurrentCompanyId] = useState()
  const [isPreviewModal,setIsPreviewModal] = useState(false);
  const [getcompanyID,setcompanyID] = useState("");

  const navigate = useNavigate();

  const [getValidation, setValidation] = useState({
    systemFileUpload: "",
    googleDriveFileUpload: "",
    linkValidation: "",
  });

  useEffect(() => {
    companyDetails?.companyLogo && setUploadFileData(companyDetails?.companyLogo)
    companyDetails?.companyName && setValue('companyName', companyDetails?.companyName)
    companyDetails?.website && setValue('companyURL',companyDetails?.website)
    if(companyDetails?.foundedYear){
      setValue('foundedIn', companyDetails?.foundedYear)
      setControlledFoundedInValue(companyDetails?.foundedYear)
    }  
    companyDetails?.teamSize > 0 && setValue('teamSize', companyDetails?.teamSize)
    companyDetails?.companyType && setValue('companyType', companyDetails?.companyType)
    companyDetails?.headquaters && setValue('headquaters', companyDetails?.headquaters)
    companyDetails?.aboutCompany && setValue('aboutCompany', companyDetails?.aboutCompany)
    companyDetails?.companyIndustry && setValue('industry', companyDetails?.companyIndustry)
    companyDetails?.linkedInProfile && setValue('companyLinkedinURL', companyDetails?.linkedInProfile)
    
  },[companyDetails])


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

        let filesToUpload = new FormData()
         filesToUpload.append("Files",fileData)
       filesToUpload.append('IsCompanyLogo',true)
       filesToUpload.append('IsCultureImage',false)

       let Result = await allCompanyRequestDAO.uploadImageDAO(filesToUpload)

        setValidation({
          ...getValidation,
          systemFileUpload: "",
        });

        if(Result?.statusCode === HTTPStatusCode.OK){
          let imgUrls = Result?.responseBody
           setUploadFileData(imgUrls[0]);
           setCompanyDetails(prev=>({...prev,basicDetails: {companyLogo: imgUrls[0],...prev.basicDetails?.companyLogo}}))
        }
       
        setUploadModal(false);
      }
    },
    [getValidation, setBase64Image, setUploadFileData]
  );

  const validateCompanyName = async () => {
    if(watch('companyName')){
      if(companyDetails?.companyName === watch('companyName')){
        clearErrors('companyName')
        setDisableSubmit(false)
        setIsViewCompany(false);
        return
      }

      let payload = {
      "workEmail": "",
      "companyName": watch('companyName'),
      "currentCompanyID": +companyID,
      // "websiteURL": watch("companyURL")
    }

    const result = await allCompanyRequestDAO.validateClientCompanyDAO(payload)

    if(result.statusCode === HTTPStatusCode.OK){
      clearErrors('companyName')
      setDisableSubmit(false)
      setIsViewCompany(false);
    }
    if(result.statusCode === HTTPStatusCode.BAD_REQUEST){
      setDisableSubmit(true)
      setIsViewCompany(true);
      setcompanyID(result?.details?.companyID);
      setError('companyName',{
        type: "manual",
        message: result?.responseBody,
      })
    }
    }
   
  }

  const validateCompanyURL = async () => {
    setShowFetchAIButton(false)
    clearErrors('companyURL')
    setIsViewCompanyurl(false);
    if(watch("companyURL")){

      if(companyDetails?.website === watch("companyURL")){
        clearErrors('companyURL')
        setDisableSubmit(false)
        setIsViewCompanyurl(false);
        return
      }
      let payload = {
        "workEmail": "",
        "companyName": watch('companyName'),
        "currentCompanyID": +companyID,
        "websiteURL": watch("companyURL")
      }
  
      const result = await allCompanyRequestDAO.validateClientCompanyDAO(payload)
      
      if(result.statusCode === HTTPStatusCode.OK){
        clearErrors('companyURL')
        setDisableSubmit(false)
        setIsViewCompanyurl(false);
        if(companyID === '0'){
            // getDetailsForAutoFetchAI(watch("companyURL"))

            setShowFetchAIButton(true)
        }     
       }
       if(result.statusCode === HTTPStatusCode.BAD_REQUEST){
         setDisableSubmit(true)
         setIsViewCompanyurl(true);
         setcompanyID(result?.details?.companyID);
        setError('companyURL',{
          type: "manual",
          message: result?.responseBody,
        })
      }
    }
   
   }

  return (
    <>
    <div className={AddNewClientStyle.tabsFormItem}>
      {loadingDetails ? <Skeleton active /> : <>
        <div className={AddNewClientStyle.tabsFormItemInner}>
          <div className={AddNewClientStyle.tabsLeftPanel}>
            <h3>Basic Company Details</h3>
            {/* <p>Please provide the necessary details</p> */}
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
                    {!getUploadFileData  ? (
                    // <p>Upload Company Logo</p>
                    <Avatar 
                    style={{ width: "100%",
                    height: "100%", display: "flex",alignItems: "center"}} 
                    size="large">
                      {companyDetails?.companyName?.substring(0, 2).toUpperCase()}
                      </Avatar>
                  ) : (
                    <img
                      style={{
                        width: "145px",
                        height: "145px",
                        borderRadius: "50%",
                      }}
                      // src={
                      //   base64Image
                      //     ? base64Image
                      //     : NetworkInfo.PROTOCOL +
                      //       NetworkInfo.DOMAIN +
                      //       "Media/CompanyLogo/" +
                      //       getUploadFileData
                      // }
                      src={
                        base64Image
                          ? base64Image
                          : getUploadFileData
                      }
                      alt="preview"
                    />
                  )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
                      <EditSVG width={24} height={24} onClick={() => setUploadModal(true)} />
                    </div>
                  </div>
                </div>
              </div>
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
                      // pattern: {
                      // 	value: URLRegEx.url,
                      // 	message: 'Entered value does not match url format',
                      // },
                    }}
                    onBlurHandler={()=> validateCompanyName()}
                    onChangeHandler={(e) => {
                      // setCompanyName(e.target.value);
                      // debounceDuplicateCompanyName(e.target.value);
                      setShowFetchAIButton(false)
                      clearErrors('companyURL')
                      setIsViewCompanyurl(false);
                    }}
                    placeholder="Enter Name"
                    required
                  />
                    <div className={AddNewClientStyle.formPanelAction} style={{padding:"0 0 20px",justifyContent:"flex-start"}}>
                        {isViewCompany && 
                        <button className={AddNewClientStyle.btnPrimary} onClick={()=>setIsPreviewModal(true)}>View Company</button>}
                    </div>
                  </div>

              <div className={AddNewClientStyle.colMd6}>

                {loadingCompanyDetails ? <>
                  <Skeleton active />

                  <p style={{fontWeight:'bold',color:'green'}}>Fetching Company Details From AI ...</p>
                </> : <>
                   <HRInputField
                  register={register}
                  errors={errors}
                  label="Company Website URL"
                  name="companyURL"
                  type={InputType.TEXT}
                  validationSchema={{
                    required: "Please enter the Company Website link.",
                    // pattern: {
                    // 	value: URLRegEx.url,
                    // 	message: 'Entered value does not match url format',
                    // },
                    validate: (value) => {
                      if (ValidateFieldURL(value, "website")) {
                        return true;
                      } else {
                        return "Entered value does not match url format";
                      }
                    },
                  }}
                  placeholder="Enter website url"
                  required
                  onBlurHandler={()=> validateCompanyURL()}
                />
                 <div className={AddNewClientStyle.formPanelAction} style={{padding:"0 0 20px",justifyContent:"flex-start"}}>
                  {showFetchATButton && <div><button className={AddNewClientStyle.btnPrimary} onClick={()=>getDetailsForAutoFetchAI(watch("companyURL"))}>Fetch detail From AI</button>
                  <p style={{color:'orange', margin:'5px 0'}}>Fetch Company details from parsing tools like X-Ray Search.</p></div>}
                  {(isViewCompanyurl &&  watch('companyName')) &&
                  <button className={AddNewClientStyle.btnPrimary} onClick={()=>setIsPreviewModal(true)}>View Company</button>}
                </div>
                </>}
             
              </div>
            </div>

            <div className={AddNewClientStyle.row}>
            <div className={AddNewClientStyle.colMd6} >
              <HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required:
										'please enter the company linkedin URL.',
									// pattern: {
									// 		value: URLRegEx.url,
									// 		message: 'Entered value does not match url format',
									// 	},
									validate: value => {
										try {
											if(ValidateFieldURL(value,"linkedin")){
												return true
											}else{
												return 'Entered value does not match linkedin url format';
											}
											} catch (error) {
											return 'Entered value does not match url format';
											}											
									}
								}}
								label="Company Linkedin URL"
								name={'companyLinkedinURL'}
								type={InputType.TEXT}
								placeholder="Add Company Linkedin URL"
								required
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
                      // pattern: {
                      // 	value: URLRegEx.url,
                      // 	message: 'Entered value does not match url format',
                      // },
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
                    label="Headquaters"
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
            </div>

            <div className={AddNewClientStyle.row}>
            <div className={AddNewClientStyle.colMd12}>
            {/* <TextEditor
                register={register}
                setValue={setValue}
                // errors={errors}
                controlledValue={companyDetails?.aboutCompany ?? ''}
                isControlled={true}
                isTextArea={true}
                label="About Company"
                name="aboutCompany"
                type={InputType.TEXT}
                placeholder="Enter about company"
                // required
                watch={watch}
                /> */}
               
              <label style={{ marginBottom: "12px" }}>
                About Company
                <span className={AddNewClientStyle.reqField}>*</span>
              </label>
             <ReactQuill
                register={register}
                setValue={setValue}
                theme="snow"
                className="heightSize"
                value={!watch("aboutCompany") ? companyDetails?.aboutCompany ?? '' : watch("aboutCompany")} 
                name="aboutCompany"
                onChange={(val) => setValue("aboutCompany",val)}
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
        </>}
      </div>
        <PreviewClientModal setIsPreviewModal={setIsPreviewModal} isPreviewModal={isPreviewModal} setcompanyID={setcompanyID} getcompanyID={getcompanyID} />
        </>
  )
}

export default CompanySection