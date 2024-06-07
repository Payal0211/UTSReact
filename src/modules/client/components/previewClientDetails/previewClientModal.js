import Modal from "antd/lib/modal/Modal";
import React, { useCallback, useEffect, useState } from "react";
import previewClientStyle from "../previewClientDetails/previewClientDetail.module.css";
import { AutoComplete, Checkbox, Select, message } from "antd";
import { ReactComponent as EditNewIcon } from "assets/svg/editnewIcon.svg";
import { ReactComponent as DeleteNewIcon } from "assets/svg/delete-icon.svg";

import CompanyDetailimg1 from 'assets/CompanyDetailimg1.jpg'
import CompanyDetailimg2 from 'assets/CompanyDetailimg2.jpg'
import CompanyDetailimg3 from 'assets/CompanyDetailimg3.jpg'

import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";

import { useForm } from "react-hook-form";
import { InputType } from "constants/application";
import { all } from "axios";
import ReactQuill from "react-quill";

import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import { HTTPStatusCode } from "constants/network";
import TextEditor from "shared/components/textEditor/textEditor";
import YouTubeVideo from "./youTubeVideo";
import { MasterDAO } from "core/master/masterDAO";

function PreviewClientModal({ isPreviewModal, setIsPreviewModal,setcompanyID,getcompanyID }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    resetField,
    formState: { errors },
  } = useForm();
  const [isEditCompanyName, setIsEditCompanyName] = useState(false);
  const [isEditCompanyWebsite, setIsEditCompanyWebsite] = useState(false);
  const [isEditCompanyFound, setIsEditCompanyFound] = useState(false);
  const [isEditTeamSize, setIsEditTeamSize] = useState(false);
  const [isEditCompanyType, setIsEditCompanyType] = useState(false);
  const [isEditCompanyIndustry, setIsEditCompanyIndustry] = useState(false);
  const [isEditHeadquarters, setIsEditHeadquarters] = useState(false);
  const [getCompanyDetails, setCompanyDetails] = useState({});
  const [showAllInvestors, setShowAllInvestors] = useState(false);
  const [isAnotherRound,setAnotherRound] = useState(false)
  const [isAddNewClient,setAddNewClient] = useState(false)
  const [isEditClient,setEditClient] = useState(false)
  const [isEditEngagement,setEditEngagement] = useState(false)
  const [isEditPOC,setEditPOC] = useState(false)
  const [isEditCultureSection,setEditCultureSection] = useState(false);
  const [isEditCompanyBenefits,setEditCompanyBenefits] = useState(false)
  const [getValuesForDD, setValuesForDD] = useState({});
  const [controlledPOC,setControlledPOC] = useState([]);
  const [allPocs, setAllPocs] = useState([]);

  const allInvestors = getCompanyDetails?.fundingDetails?.[0]?.allInvestors?getCompanyDetails?.fundingDetails?.[0]?.allInvestors?.split(",") : [];
  const displayedInvestors = showAllInvestors ? allInvestors : allInvestors.slice(0, 4);

  console.log(getValuesForDD,"getValuesForDDgetValuesForDDgetValuesForDD");

  const toggleInvestors = () => {
    setShowAllInvestors((prev) => !prev);
  };
  
  const getDetails = async () => {
      const result = await allCompanyRequestDAO.getCompanyDetailDAO(getcompanyID);
    
      if (result?.statusCode === HTTPStatusCode.OK) {
        const data = result?.responseBody;
        setCompanyDetails(result?.responseBody);
        setValue("foundedIn",data?.basicDetails?.foundedYear);
        setValue("companyWebsite",data?.basicDetails?.website);
        setValue("teamSize",data?.basicDetails?.teamSize);
        setValue("companyType",data?.basicDetails?.companyType);
        setValue("companyIndustry",data?.basicDetails?.companyIndustry);
        setValue("headquarters",data?.basicDetails?.headquaters)
        setValue("companyName",data?.basicDetails?.companyName)
        setValue("fullName",data?.contactDetails?.[0]?.fullName)
        setValue("emailID",data?.contactDetails?.[0]?.emailID)
        setValue("designation",data?.contactDetails?.[0]?.designation)
        setValue("accessType",data?.contactDetails?.[0]?.accessType)
        setValue("contactNo",data?.contactDetails?.[0]?.contactNo)

        console.log(data?.contactDetails,"data?.contactDetails?.fullNamedata?.contactDetails?.fullName");
     }
    };

    console.log(watch("fullName"),"fullNamefullNamefullNamefullName");

useEffect(() => {
    getDetails()
}, [getcompanyID,setValue])

const getAllValuesForDD = useCallback(async () => {
  const getDDResponse = await MasterDAO.getFixedValueRequestDAO();
  setValuesForDD(getDDResponse && getDDResponse?.responseBody);
}, []);

const getAllSalesPerson = useCallback(async () => {
  const allSalesResponse = await MasterDAO.getSalesManRequestDAO();
  setAllPocs(allSalesResponse && allSalesResponse?.responseBody?.details);
}, []);

useEffect(() => {
  getAllValuesForDD()
  getAllSalesPerson()
}, [])

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

console.log(getCompanyDetails,"getCompanyDetailsgetCompanyDetails");

console.log(allPocs,"allPocsallPocsallPocsallPocs");

  return (
    <>
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
        <div className={previewClientStyle.PreviewpageMainWrap}>
          <div className={previewClientStyle.PostHeader}>
            <h4>Company / Client Details</h4>
          </div>

          
          <div className={previewClientStyle.PostJobStepSecondWrap}>

            <div className={previewClientStyle.formFields}>
                <div className={previewClientStyle.formFieldsbox}>
                    <div className={previewClientStyle.formFieldsboxinner}>
                        <h2>Basic Company Details</h2>
                        <div className={previewClientStyle.companyDetails}>
                            <div className= {`${previewClientStyle.companyDetailsInner} ${previewClientStyle.dtlQuillEdit}`}>

                                <div className={previewClientStyle.companyProfileBox}>
                                    <div className={previewClientStyle.companyProfileImg}>
                                        <img src={getCompanyDetails?.basicDetails?.companyLogo} alt="detailImg" />  
                                        <span className={previewClientStyle.editNewIcon}> <EditNewIcon/> </span>
                                    </div>  
                                    <div className={previewClientStyle.companyProfRightDetail}>
                                            <h3>{getCompanyDetails?.basicDetails?.companyName} <span className={previewClientStyle.editNewIcon} onClick={()=>setIsEditCompanyName(true)}> <EditNewIcon/> </span></h3>
                                           <a > {getCompanyDetails?.basicDetails?.website} <span className={previewClientStyle.editNewIcon} onClick={()=>setIsEditCompanyWebsite(true)}> <EditNewIcon/> </span></a>
                                    </div>      
                                </div>        

                                <div className={previewClientStyle.companyDetailTop}>
                                    <ul>
                                        <li>
                                            <span onClick={()=>setIsEditCompanyFound(true)}>  Founded in <EditNewIcon/> </span>
                                            <p>{getCompanyDetails?.basicDetails?.foundedYear ?getCompanyDetails?.basicDetails?.foundedYear : "NA"}</p>
                                        </li>
                                        <li>
                                            <span onClick={()=>setIsEditTeamSize(true)}> Team Size <EditNewIcon/> </span>
                                            <p> {getCompanyDetails?.basicDetails?.teamSize  ? getCompanyDetails?.basicDetails?.teamSize: "NA"} </p>
                                        </li>
                                        <li>
                                            <span onClick={()=>setIsEditCompanyType(true)}> Company Type <EditNewIcon/> </span>
                                            <p> {getCompanyDetails?.basicDetails?.companyType  ? getCompanyDetails?.basicDetails?.companyType: "NA"} </p>
                                        </li>
                                        <li>
                                            <span onClick={()=>setIsEditCompanyIndustry(true)}>Company Industry <EditNewIcon/> </span>
                                            <p> {getCompanyDetails?.basicDetails?.companyIndustry  ? getCompanyDetails?.basicDetails?.companyIndustry: "NA"} </p>
                                        </li>
                                        <li>
                                            <span onClick={()=>setIsEditHeadquarters(true)}> Headquarters <EditNewIcon/> </span>
                                            <p> {getCompanyDetails?.basicDetails?.headquaters  ?getCompanyDetails?.basicDetails?.headquaters : "NA"} </p>
                                        </li>
                                    </ul>
                                </div>

                                <h6> About us <span className={previewClientStyle.editNewIcon}> </span> </h6>

                                {/* <p> 
                                    At Tech Innovate Solutions Inc., our company culture is characterized by innovation, collaboration, and a relentless pursuit of excellence. We foster an environment where creativity flourishes, and employees are empowered to think outside the box and push the boundaries of what's possible.
                                    Collaboration is at the heart of our culture. We believe that the best ideas emerge from diverse perspectives and collective efforts. Our teams work closely together, sharing knowledge, expertise, and ideas to tackle complex challenges and drive innovation.
                                    Transparency and open communication are key pillars of our culture. We encourage an environment where everyone feels heard and valued, and where feedback is welcomed and acted upon constructively.
                                </p> */}
                                <TextEditor
                                    register={register}
                                    setValue={setValue}
                                    // errors={errors}
                                    controlledValue={getCompanyDetails?.basicDetails?.aboutCompany}
                                    isControlled={true}
                                    isTextArea={true}
                                    name="aboutCompany"
                                    type={InputType.TEXT}
                                    placeholder="Enter about company"
                                    // required
                                    watch={watch}
                                />

                                <div className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.BtnRight}`}>
                                    <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`}> Cancel </button>
                                    <button type="button" className={previewClientStyle.btnPrimary}> SAVE </button>
                                </div>
                                
                                <hr />

                                <h6>Summary of Funding Rounds</h6>

                                <div className={previewClientStyle.fundingrounds}>
                                    <ul>
                                        <li>
                                            <span>Total Funding</span>
                                            <h3>{getCompanyDetails?.fundingDetails?.[0]?.fundingAmount ?getCompanyDetails?.fundingDetails?.[0]?.fundingAmount : "NA"}</h3>
                                        </li>

                                        <li>
                                            <span>Funding Rounds</span>
                                            <p>{getCompanyDetails?.fundingDetails?.[0]?.fundingRound?getCompanyDetails?.fundingDetails?.[0]?.fundingRound:"NA"}</p>
                                        </li>

                                        <li>
                                            <span>Latest Funding Round</span>
                                            <p>{getCompanyDetails?.fundingDetails?.[0]?.lastFundingRound?getCompanyDetails?.fundingDetails?.[0]?.lastFundingRound:"NA"}</p>
                                        </li>

                                        <li>
                                            <span>Investors</span>
                                            <p>
                                                {displayedInvestors.length > 0 ? displayedInvestors.join(', ') : "NA"}
                                                {allInvestors.length > 4 && (
                                                <span>
                                                ... <a href="#" onClick={(e) => { e.preventDefault(); toggleInvestors(); }} title="view all">
                                                    {showAllInvestors ? 'Show Less' : 'View All'}
                                                    </a>
                                                </span>
                                                )}
                                            </p>
                                        </li>
                                    </ul>
                                </div>

                                <div className={previewClientStyle.RoundBtnWrap}>
                                    <h6>Rounds</h6>
                                    <span className={previewClientStyle.addAnotherRoundbtn} onClick={()=>setAnotherRound(true)}>Add Another Round</span>
                                </div> 
                                {isAnotherRound && <><div className={previewClientStyle.row}>
                                    <div className={previewClientStyle.colMd6}>
                                        <HRInputField
                                            register={register}
                                            // errors={errors}
                                            label="Funding Amount"
                                            // name={`fundingDetails.[${index}].fundingAmount`}
                                            name={"fundingAmount"}
                                            type={InputType.TEXT}
                                            // onChangeHandler={(e) => {
                                            // }}
                                            placeholder="Ex: 500k, 900k, 1M, 2B..."
                                            // disabled={isSelfFunded}
                                        />
                                    </div>
                                    <div className={previewClientStyle.colMd6}>
                                        <HRInputField
                                            register={register}
                                            // errors={errors}
                                            label="Funding Round"
                                            // name={`fundingDetails.[${index}].fundingRound`}
                                            name={"fundingRound"}
                                            type={InputType.NUMBER}
                                            onChangeHandler={(e) => {
                                            }}
                                            placeholder="Enter round number"
                                            // disabled={isSelfFunded}
                                        />
                                    </div>
                                </div>

                                <div className={previewClientStyle.row}>
                                <div className={previewClientStyle.colMd6} >
                                    <HRSelectField
                                    isControlled={true}
                                    //  controlledValue={controlledSeries[index]}
                                    //  setControlledValue={val=>setControlledSeries(prev=> {
                                    //   let newControlled = [...prev]
                                    //   newControlled[index] = val
                                    //   return newControlled
                                    // })}
                                    setValue={setValue}
                                    mode={"id"}
                                    register={register}
                                    //   name={`fundingDetails.[${index}].series`}
                                    name="series"
                                    label="Series"
                                    defaultValue="Select"
                                    //   options={seriesOptions}
                                    // disabled={isSelfFunded}
                                    />
                                </div>

          
                                <div className={previewClientStyle.colMd6}> 
                                    <div className={previewClientStyle.phoneLabel}>Month-Year</div>
                                    <div className={previewClientStyle.dateSelect}>
                        
                                         <Select
                                            //   options={monthOptions}
                                            placeholder="Select month"
                                            //   value={watch(`fundingDetails.[${index}].month`) ? watch(`fundingDetails.[${index}].month`) : undefined}
                                            //   onSelect={(e) => {                     
                                            //    setValue(`fundingDetails.[${index}].month`,e)
                                            //   }}
                                            //   disabled={isSelfFunded}
                                            />
                                            <Select
                                            //   options={yearOptions}
                                            placeholder="Select year"
                                            //   value={watch(`fundingDetails.[${index}].year`) ? watch(`fundingDetails.[${index}].year`) : undefined}
                                            //   onSelect={(e) => {
                                            //     setValue(`fundingDetails.[${index}].year`,e)
                                            //   }}
                                            //   disabled={isSelfFunded}
                                            />
                                    </div>
                                </div>

                                  
                                <div className={previewClientStyle.colMd6}>
                                    <HRInputField
                                        register={register}
                                        // errors={errors}
                                        // name={`fundingDetails.[${index}].investors`}
                                        name={"investors"}
                                        label="Investors"
                                        type={InputType.TEXT}
                                        // onChangeHandler={(e) => {
                                        // }}
                                        placeholder="Add investors seprated by comma (,)"
                                        // disabled={isSelfFunded}
                                    />
                                </div>

                                <div className={previewClientStyle.colMd6}>
                                    <button type="button" className={`${previewClientStyle.addanotherBtn} ${previewClientStyle.disabledInput}`}>
                                        <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                            <path d="M9 0C4.03733 0 0 3.81304 0 8.5C0 13.187 4.03733 17 9 17C13.9627 17 18 13.187 18 8.5C18 3.81304 13.9627 0 9 0ZM13.5044 9.12963H9.66667V12.7542C9.66667 13.1013 9.36756 13.3838 9 13.3838C8.63244 13.3838 8.33333 13.1013 8.33333 12.7542V9.12963H4.49556C4.128 9.12963 3.82889 8.84714 3.82889 8.5C3.82889 8.15286 4.128 7.87037 4.49556 7.87037H8.33333V4.2458C8.33333 3.89867 8.63244 3.61617 9 3.61617C9.36756 3.61617 9.66667 3.89867 9.66667 4.2458V7.87037H13.5044C13.872 7.87037 14.1711 8.15286 14.1711 8.5C14.1711 8.84714 13.872 9.12963 13.5044 9.12963Z"
                                                fill="#232323"
                                                fill-opacity="0.2"
                                            />
                                        </svg>
                                        Add another round
                                    </button>
                                </div>
                               

                                </div>

                                <div className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.mb24}`}>
                                    <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`} onClick={()=>setAnotherRound(false)}> Cancel </button>
                                    <button type="button" className={previewClientStyle.btnPrimary} onClick={()=>setAnotherRound(false)}>  SAVE </button>
                                </div>

                                </>}

                            
                                <div className={previewClientStyle.roundsListed}>  
                                {getCompanyDetails?.fundingDetails?.map((val) =>(
                                    <div className={`${previewClientStyle.roundsListContent} ${previewClientStyle.active}`}>
                                            <span> {val?.fundingRound ? val?.fundingRound + " | " : ""} {val?.series?.trim() ?  val?.series : ""}  {val?.fundingMonth ? " | " + val?.fundingMonth: ""},{val?.fundingYear}
                                                <div className={previewClientStyle.roundHoverAction}>
                                                    <span><AiOutlineEdit /></span>
                                                    <span><RiDeleteBinLine /></span>
                                                </div>
                                            </span>
                                            {val?.fundingAmount && <h4>{val?.fundingAmount}</h4>}
                                            {val?.investors && <p>Investors: {val?.investors}</p>}
                                    </div>    
                                ))} 
                                        {/* <div className={`${previewClientStyle.roundsListContent} ${previewClientStyle.Selected}`}>
                                            <span>
                                                Series B  |  Nov, 2021
                                                <div className={previewClientStyle.roundHoverAction}>
                                                    <span><AiOutlineEdit /></span>
                                                    <span><RiDeleteBinLine /></span>
                                                </div>
                                            </span>
                                            <h4>$1.5M</h4>
                                            <p>Investors: Silverneedle Ventures, JSW Ventures</p>
                                        </div>    
                                        <div className={previewClientStyle.roundsListContent}>
                                            <span>
                                                Round 2  |  Oct, 2018
                                                <div className={previewClientStyle.roundHoverAction}>
                                                    <span><AiOutlineEdit /></span>
                                                    <span><RiDeleteBinLine /></span>
                                                </div>
                                            </span>
                                            <h4>$487K</h4>
                                            <p>Investors: Silverneedle Ventures, JSW Ventures</p>
                                        </div>    
                                        <div className={previewClientStyle.roundsListContent}>
                                            <span>
                                                Round 1  |  Series A  |  Aug, 2016
                                                <div className={previewClientStyle.roundHoverAction}>
                                                    <span><AiOutlineEdit /></span>
                                                    <span><RiDeleteBinLine /></span>
                                                </div>
                                            </span>
                                            <h4>$140K</h4>
                                            <p>Investors: Silverneedle Ventures, JSW Ventures</p>
                                        </div>                                      */}
                                </div>

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
                                            

                            <h6> Culture <span className={previewClientStyle.editNewIcon} onClick={()=>setEditCultureSection(true)}><EditNewIcon/></span> </h6>

                             <TextEditor
                                    register={register}
                                    setValue={setValue}
                                    // errors={errors}
                                    controlledValue={getCompanyDetails?.basicDetails?.culture}
                                    isControlled={true}
                                    isTextArea={true}
                                    name="culture"
                                    type={InputType.TEXT}
                                    placeholder="Enter about Culture"
                                    // required
                                    watch={watch}
                                />

                                {/*------ EditCaltureSection  Start ------- */}

                               {isEditCultureSection &&  <div className={previewClientStyle.EditCalturebox}>
                                            
                                    {isEditCultureSection &&  <div className={previewClientStyle.row}>
                                        <div className={previewClientStyle.colMd12}>
                                            <div className={previewClientStyle.label}>Picture</div>
                                            {/* {uploading? <Skeleton active /> :  */}
                                            <div className={previewClientStyle.FilesDragAndDropArea}
                                                style={{ width: "100%", cursor: "pointer" }}
                                                // onClick={()=> pictureRef && pictureRef.current.click()}
                                                // onDragOver={(e) => e.preventDefault()}
                                                // onDrop={handleDrop}
                                                // onDragLeave={(e) => e.preventDefault()}
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
                                                <span>Click to Upload</span> <span style={{color:"gray"}}>or drag and drop</span>
                                            </p>
                                            <span> (Max. File size: 25 MB)</span>
                                            <input
                                            // ref={pictureRef}
                                                type="file"
                                                accept="image/png,image/jpeg"
                                                multiple="multiple"
                                                style={{ display: "none" }}
                                                name="cultureImage"
                                                onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;

                                                const acceptedTypes = ["image/jpeg", "image/png"];
                                                if (!acceptedTypes.includes(file.type)) {
                                                    message.info(
                                                    "Please select a valid image file (JPEG or PNG)."
                                                    );
                                                    return;
                                                }

                                                const maxSize = 25 * 1024 * 1024;
                                                if (file.size > maxSize) {
                                                    message.error("Maximum image size are 25 MB.");
                                                    return;
                                                }


                                                try {                 
                                                    // uploadCultureImages(e.target.files)
                                                } catch (error) {
                                                    console.error("Error reading the file:", error);
                                                }
                                                }}
                                            />
                                            </div>
                                            {/* } */}
                                        
                                        </div>
                                    </div>}

                                    <div className={previewClientStyle.imgSection}>
                                        {getCompanyDetails?.cultureDetails?.map((val)=>(
                                            <div className={previewClientStyle.imgThumb}>
                                                <img src={val?.cultureImage} alt="detailImg" />
                                                <span className={previewClientStyle.DeleteBtn}><DeleteNewIcon/> </span>
                                            </div>
                                        ))}
                                    </div>


                                    {isEditCultureSection && <div className={previewClientStyle.row}>
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
                                    }

                                    <div className={previewClientStyle.row}>
                                        <div className={previewClientStyle.youTubeDetails}>
                                            https://www.youtube.com/channel/UCNEjnooRRpudDeiHKKqWVNA   
                                            <DeleteNewIcon alt="detailImg" style={{marginLeft:'10px',cursor:'pointer'}} />
                                        </div>
                                    </div>
                                    

                                    {isEditCultureSection &&<>
                                    <div className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.mb24}`}>
                                            <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`} onClick={()=>setEditCultureSection(false)}> Cancel </button>
                                            <button type="button" className={previewClientStyle.btnPrimary} onClick={()=>setEditCultureSection(false)}>  SAVE </button>
                                        </div>
                                    </>}

                                </div> }  

                                {/*------ EditCaltureSection  End ------- */}  


                            
                                {!isEditCultureSection &&<div className={previewClientStyle.imgSection}>
                                    {getCompanyDetails?.cultureDetails?.map((val)=>(
                                        <div className={previewClientStyle.imgThumb}>
                                            <img src={val?.cultureImage} alt="detailImg" />
                                            <span className={previewClientStyle.DeleteBtn}><DeleteNewIcon/> </span>
                                        </div>
                                    ))}
                                </div>}

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

                                {!isEditCultureSection &&<div className={previewClientStyle.imgSection}>
                                    {getCompanyDetails?.youTubeDetails?.map((val)=>(
                                        <div className={previewClientStyle.videoWrapper}>
                                            {/* <iframe width="420" height="315"
                                                src={`https://www.youtube.com/embed/${val?.youtubeLink}`}>
                                            </iframe> */}
                                            <YouTubeVideo videoLink={val?.youtubeLink}/>
                                            <span className={previewClientStyle.DeleteBtn}><DeleteNewIcon/> </span>
                                        </div>
                                    ))}
                                </div>}

                                
                            <h6>Company Benefits 
                                <span className={previewClientStyle.editNewIcon} onClick={()=>setEditCompanyBenefits(true)}><EditNewIcon/></span>
                            </h6>

                            <div className={previewClientStyle.companyBenefits}>
                                <ul>
                                   {getCompanyDetails?.perkDetails?.map((val)=>(
                                    <li>
                                        <span>{val}</span>
                                    </li>
                                   ))}  
                                </ul>
                            </div>

                            {isEditCompanyBenefits && <div className={`${previewClientStyle.row} ${previewClientStyle.mt24}`}>
                                <div className={previewClientStyle.colMd12}>
                                    <AutoComplete />
                                    <div className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.mt24}`}>
                                        <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`} onClick={()=>setEditCompanyBenefits(false)}> Cancel </button>
                                        <button type="button" className={previewClientStyle.btnPrimary} onClick={()=>setEditCompanyBenefits(false)}>  SAVE </button>
                                    </div>
                                </div>
                                 
                                </div>}
                    
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={previewClientStyle.formFields}>
                <div className={previewClientStyle.formFieldsbox}>
                    <div className={previewClientStyle.formFieldsboxinner}>
                        <div className={previewClientStyle.formFieldTitleTwo}>
                            <h2>Client Details <span className={previewClientStyle.addNewClientText} onClick={()=>setAddNewClient(true)}>Add New Client</span></h2>
                        </div>


                        <div className={previewClientStyle.companyDetails}>  

                        {isAddNewClient && <>
                            <div className={previewClientStyle.row}>
                                <div className={previewClientStyle.colMd6}>
                                    <HRInputField
                                    register={register}
                                    // isError={!!errors?.clientDetails?.[index]?.fullName}
                                    //   errors={errors?.clientDetails?.[index]?.fullName}
                                    label="Client Full Name"
                                    //   name={`clientDetails.[${index}].fullName`}
                                    name="fullName"
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
                                    name={"emailID"}
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
                                </div>
                            </div>

                            <div className={previewClientStyle.row}>
                                <div className={previewClientStyle.colMd6}>
                                    <HRInputField
                                    register={register}
                                    // errors={errors}
                                    label="Designation"
                                    //   name={`clientDetails.[${index}].designation`}
                                    name="designation"
                                    type={InputType.TEXT}
                                    placeholder="Enter Client Designation"
                                    />
                                </div>

                                <div className={previewClientStyle.colMd6}>
                                    <HRSelectField
                                    isControlled={true}
                                    //   controlledValue={controlledRoleId[index]}
                                    //   setControlledValue={(val) =>
                                    //     setControlledRoleId((prev) => {
                                    //       let newControlled = [...prev];
                                    //       newControlled[index] = val;
                                    //       return newControlled;
                                    //     })
                                    //   }
                                    setValue={setValue}
                                    mode={"id"}
                                    register={register}
                                    //   name={`clientDetails.[${index}].roleID`}
                                    name="roleID"
                                    label="Access Type"
                                    defaultValue="Choose Access Type"
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
                                    <div className={previewClientStyle.phoneLabel}>Phone number</div>
                                    <div style={{ display: "flex" }}>
                                        <div className={previewClientStyle.phoneNoCode}>
                                            <HRSelectField
                                            searchable={true}
                                            setValue={setValue}
                                            register={register}
                                            //   name={`clientDetails.[${index}].countryCode`}
                                            name="countryCode"
                                            defaultValue="+91"
                                            //   options={flagAndCodeMemo}
                                            />
                                        </div>
                                        <div className={previewClientStyle.phoneNoInput}>
                                            <HRInputField
                                            register={register}
                                            //   name={`clientDetails.[${index}].contactNo`}
                                            name="contactNo"
                                            type={InputType.NUMBER}
                                            placeholder="Enter Phone number"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.mb24}`}>
                                    <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`} onClick={()=>setAddNewClient(false)}> Cancel </button>
                                    <button type="button" className={previewClientStyle.btnPrimary} onClick={()=>setAddNewClient(false)}>  SAVE </button>
                            </div>

                        </>}

                            <div className={`${previewClientStyle.companyDetailTop} ${previewClientStyle.clientDetailListed}`}>

                                {getCompanyDetails?.contactDetails?.map((val)=>(
                                    <div className={previewClientStyle.companyNewClientbox}>  
                                    <h5 className={previewClientStyle.clientlistedTop}> <span className={previewClientStyle.clientlistedTitle}> Client 1 </span>  <span className={previewClientStyle.editNewIcon} onClick={()=>setEditClient(true)}><EditNewIcon/></span></h5>    
                                    {isEditClient && <>
                                <div className={previewClientStyle.row}>
                                    <div className={previewClientStyle.colMd6}>
                                        <HRInputField
                                        register={register}
                                        // isError={!!errors?.clientDetails?.[index]?.fullName}
                                        //   errors={errors?.clientDetails?.[index]?.fullName}
                                        label="Client Full Name"
                                        //   name={`clientDetails.[${index}].fullName`}
                                        name="fullName"
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
                                        name={"emailID"}
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
                                    </div>
                                </div>

                                <div className={previewClientStyle.row}>
                                    <div className={previewClientStyle.colMd6}>
                                        <HRInputField
                                        register={register}
                                        // errors={errors}
                                        label="Designation"
                                        //   name={`clientDetails.[${index}].designation`}
                                        name="designation"
                                        type={InputType.TEXT}
                                        placeholder="Enter Client Designation"
                                        />
                                    </div>

                                    <div className={previewClientStyle.colMd6}>
                                        <HRSelectField
                                        isControlled={true}
                                        //   controlledValue={controlledRoleId[index]}
                                        //   setControlledValue={(val) =>
                                        //     setControlledRoleId((prev) => {
                                        //       let newControlled = [...prev];
                                        //       newControlled[index] = val;
                                        //       return newControlled;
                                        //     })
                                        //   }
                                        setValue={setValue}
                                        mode={"id"}
                                        register={register}
                                        //   name={`clientDetails.[${index}].roleID`}
                                        name="roleID"
                                        label="Access Type"
                                        defaultValue="Choose Access Type"
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
                                        <div className={previewClientStyle.phoneLabel}>Phone number</div>
                                            <div style={{ display: "flex" }}>
                                            <div className={previewClientStyle.phoneNoCode}>
                                                <HRSelectField
                                                searchable={true}
                                                setValue={setValue}
                                                register={register}
                                                //   name={`clientDetails.[${index}].countryCode`}
                                                name="countryCode"
                                                defaultValue="+91"
                                                //   options={flagAndCodeMemo}
                                                />
                                            </div>
                                            <div className={previewClientStyle.phoneNoInput}>
                                                <HRInputField
                                                register={register}
                                                //   name={`clientDetails.[${index}].contactNo`}
                                                name="contactNo"
                                                type={InputType.NUMBER}
                                                placeholder="Enter Phone number"
                                                />
                                            </div>
                                            </div>
                                    </div>
                                </div>
                                <div className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.mb24}`}>
                                    <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`} onClick={()=>setEditClient(false)}> Cancel </button>
                                    <button type="button" className={previewClientStyle.btnPrimary} onClick={()=>setEditClient(false)}>  SAVE </button>
                                </div>

                                </>}

                                    <ul>
                                        <li>
                                            <span>Client Full Name</span>
                                            <p>{val?.fullName}</p>
                                        </li>
                                        <li>
                                            <span>Client’s Work Email</span>
                                            <p>{val?.emailID}</p>
                                        </li>
                                        <li>
                                            <span>Designation</span>
                                            <p>{val?.designation}</p>
                                        </li>
                                        <li>
                                            <span>Access Type</span>
                                            <p>{val?.roleID == 1 && "Admin" || val?.roleID == 2 && "All Jobs" || val?.roleID == 3 && "My Jobs"}</p>
                                        </li>
                                        <li>
                                            <span>Phone Number</span>
                                            <p>{val?.contactNo}</p>
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
                       
                        <h2>Engagement Details <span className={previewClientStyle.editNewIcon} onClick={()=>setEditEngagement(true)}><EditNewIcon/></span></h2>
                        
                        <div className={previewClientStyle.companyDetails}>  

                        {isEditEngagement &&<>
                            <label style={{ marginBottom: "8px",display: "inline-block"}}>
                                Model  <span className={previewClientStyle.reqField}>*</span>
                            </label>
                            <div className={`${previewClientStyle.row} ${previewClientStyle.mb24}`}>
                                <div className={previewClientStyle.colMd12}>
                                    <Checkbox>Pay per Credit</Checkbox>
                                    <Checkbox>Pay per Hire</Checkbox>
                                </div>
                            </div>
                            <div className={previewClientStyle.row}>
                                        <div className={previewClientStyle.colMd6}>
                                            <label className={previewClientStyle.phoneLabel}>
                                            Currency
                                            <span className={previewClientStyle.reqField}>*</span>
                                            </label>
                                            <Select
                                                //   onChange={(e) => {
                                                //     setValue("creditCurrency", e);
                                                //     seterrorCurrency(false);
                                                //   }}
                                                name="creditCurrency"
                                                //   value={_currency}
                                                placeholder={"Select currency"}
                                                >
                                                <Select.Option value="INR">INR</Select.Option>
                                                <Select.Option value="USD">USD</Select.Option>
                                            </Select>
                                            {/* {errorCurrency && (
                                            <p
                                                style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                }}
                                                className={previewClientStyle.error}
                                            >
                                                * Please select currency
                                            </p>
                                            )} */}
                                        </div>
                                        {/* {_currency === "INR" ? null :  */}
                                        <div className={previewClientStyle.colMd6}>
                                            <HRInputField
                                            register={register}
                                            errors={errors}
                                            label="Per credit amount"
                                            name="creditAmount"
                                            type={InputType.NUMBER}
                                            placeholder="Enter the rate per credit"
                                            //   required={
                                            //     checkPayPer?.companyTypeID !== 0 &&
                                            //     checkPayPer?.companyTypeID !== null
                                            //       ? _currency === "INR" ? false : true
                                            //       : false
                                            //   }
                                            //   validationSchema={{
                                            //     required:
                                            //       checkPayPer?.companyTypeID !== 0 &&
                                            //       checkPayPer?.companyTypeID !== null
                                            //         ? _currency === "INR"  ? null : "Please enter Per credit amount."
                                            //         : null,
                                            //   }}
                                            />
                                        </div>
                                        {/* }  */}

                                    <div className={previewClientStyle.colMd6}>
                                        <div className={previewClientStyle.FreecreditFieldWrap}>
                                        <HRInputField
                                            register={register}
                                            errors={errors}
                                            className="yourClassName"
                                            // validationSchema={{
                                            //   required:
                                            //     checkPayPer?.companyTypeID !== 0 &&
                                            //     checkPayPer?.companyTypeID !== null
                                            //       ? "Please enter free credits."
                                            //       : null,
                                            //   min: {
                                            //     value: 0,
                                            //     message: `please don't enter the value less than 0`,
                                            //   },
                                            // }}
                                            // onKeyDownHandler={(e) => {
                                            //   if (
                                            //     e.key === "-" ||
                                            //     e.key === "+" ||
                                            //     e.key === "E" ||
                                            //     e.key === "e"
                                            //   ) {
                                            //     e.preventDefault();
                                            //   }
                                            // }}
                                            // label={`Free Credits Balance C redit : ${companyDetail?.jpCreditBalance}`}
                                            name={"freeCredit"}
                                            label="Free Credit"
                                            type={InputType.NUMBER}
                                            placeholder="Enter number of free credits"
                                            // required={
                                            //   checkPayPer?.companyTypeID !== 0 &&
                                            //   checkPayPer?.companyTypeID !== null
                                            //     ? true
                                            //     : false
                                            // }
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
                                    className={previewClientStyle.payPerCheckboxWrap}
                                    style={{ marginBottom: "16px" }}
                                >
                                    <Checkbox
                                    name="IsPostaJob"
                                    //   checked={IsChecked?.isPostaJob}
                                    //   onChange={(e) => {
                                    //     setIsChecked({
                                    //       ...IsChecked,
                                    //       isPostaJob: e.target.checked,
                                    //     });
                                    //     setCreditError(false);
                                    //   }}
                                    >
                                    Credit per post a job.
                                    </Checkbox>
                                    <Checkbox
                                    name="IsProfileView"
                                    //   checked={IsChecked?.isProfileView}
                                    //   onChange={(e) => {
                                    //     setIsChecked({
                                    //       ...IsChecked,
                                    //       isProfileView: e.target.checked,
                                    //     });
                                    //     setCreditError(false);
                                    
                                    //   }}
                                    >
                                    Credit per profile view.
                                    </Checkbox>
                                </div>
                                {/* {creditError && (
                                    <p className={previewClientStyle.error}>
                                    *Please select option
                                    </p>
                                )} */}

                                <div className={previewClientStyle.row}>
                                    {/* {IsChecked?.isPostaJob && ( */}
                                    <div className={previewClientStyle.colMd6}>
                                        <HRInputField
                                        register={register}
                                        errors={errors}
                                        label="Credit per post a job"
                                        name="jobPostCredit"
                                        type={InputType.NUMBER}
                                        placeholder="Enter credit cost for posting a job"
                                        //   required={IsChecked?.isPostaJob ? true : false}
                                        //   validationSchema={{
                                        //     required: IsChecked?.isPostaJob
                                        //       ? "Please enter credit per post a job."
                                        //       : null,
                                        //   }}
                                        />
                                    </div>
                                    {/* ) } */}

                                    {/* {IsChecked?.isProfileView && ( */}
                                    <>
                                        <div className={previewClientStyle.colMd6}>
                                        <HRInputField
                                            register={register}
                                            errors={errors}
                                            label="Credit for viewing vetted profile"
                                            name="vettedProfileViewCredit"
                                            type={InputType.NUMBER}
                                            placeholder="Enter credit cost for unlocking one vetted profile"
                                            // required={
                                            //   IsChecked?.isProfileView ? true : false
                                            // }
                                            // validationSchema={{
                                            //   required: IsChecked?.isProfileView
                                            //     ? "Please enter vetted profile credit."
                                            //     : null,
                                            // }}
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
                                            // required={
                                            //   IsChecked?.isProfileView ? true : false
                                            // }
                                            // validationSchema={{
                                            //   required: IsChecked?.isProfileView
                                            //     ? "Please enter non vetted profile credit."
                                            //     : null,
                                            // }}
                                        />
                                        </div>
                                    </>
                                    {/* )} */}
                                </div>
                                </div>
                            </div>
                            </div>

                            <div className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.mb24}`}>
                                <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`} onClick={()=>setEditEngagement(false)}> Cancel </button>
                                <button type="button" className={previewClientStyle.btnPrimary} onClick={()=>setEditEngagement(false)}>  SAVE </button>
                            </div>
                         </>}



                            <div className={`${previewClientStyle.companyDetailTop} ${previewClientStyle.engagementDetailListed}`}>
                                <ul>
                                    <li>
                                        <span>Model</span>
                                        <p>Pay Per Credit,Pay Per Hire</p>
                                    </li>
                                    <li>
                                        <span>Per Credit Amount</span>
                                        <p>100 INR</p>
                                    </li>
                                    <li>
                                        <span>Credit for viewing vetted profile</span>
                                        <p>05</p>
                                    </li>
                                    <li>
                                        <span>Credit per post a job</span>
                                        <p>05</p>
                                    </li>
                                    <li>
                                        <span>Currency (Credit)</span>
                                        <p>INR</p>
                                    </li>
                                    <li>
                                        <span>Free Credits</span>
                                        <p>30</p>
                                    </li>
                                    <li>
                                        <span>Credit for viewing non vetted profile</span>
                                        <p>INR</p>
                                    </li>
                                   
                                    <li>
                                        <span>Type of Pricing (Pay per hire)</span>
                                        <p>Transparent</p>
                                    </li>
                                    <li>
                                        <span>Model (Pay per hire)</span>
                                        <p>Hire a Contractor</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={previewClientStyle.formFields}>
                <div className={previewClientStyle.formFieldsbox}>
                    <div className={previewClientStyle.formFieldsboxinner}>

                        <h2>Uplers’s POCs <span className={previewClientStyle.editNewIcon} onClick={()=>setEditPOC(true)}><EditNewIcon/></span></h2>

                        <div className={previewClientStyle.companyDetails}>  
                                <div className={previewClientStyle.companyBenefits}>
                                    <ul className={previewClientStyle.mt0}>
                                        <li>
                                            <span>Firstname Lastname</span>
                                        </li>  
                                        {/* <li>
                                            <span>Firstname Lastname</span>
                                        </li>  
                                        <li>
                                            <span>Firstname Lastname</span>
                                        </li>    */}
                                    </ul>
                                </div>
                                {isEditPOC && <div className={previewClientStyle.row}>
                                    <div className={`${previewClientStyle.colMd12} ${previewClientStyle.mt24}`}>

                                      <div className={previewClientStyle.MultiselectCustom}>
                                          <HRSelectField
                                            isControlled={true}
                                            controlledValue={controlledPOC}
                                            setControlledValue={setControlledPOC}
                                            setValue={setValue}
                                            mode={"multiple"}
                                            register={register}
                                            name="uplersPOCname"
                                            // label="Uplers's POC name"
                                            defaultValue="Enter POC name"
                                            options={allPocs}
                                            // required
                                            // isError={errors["uplersPOCname"] && errors["uplersPOCname"]}
                                            // errorMsg="Please select POC name."
                                          />
                                      </div>

                                        <div className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.mt24}`}>
                                            <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`} onClick={()=>setEditPOC(false)}> Cancel </button>
                                            <button type="button" className={previewClientStyle.btnPrimary} onClick={()=>setEditPOC(false)}>  SAVE </button>
                                        </div>
                                    </div>
                                 
                                    
                                </div>}
                        </div>
                    </div>
                </div>
            </div>

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
         <div className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.BtnRight}`}>
                        <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`} onClick={() => setIsEditCompanyName(false)}> Cancel </button>
                        <button type="button" className={previewClientStyle.btnPrimary} onClick={() => setIsEditCompanyName(false)}> SAVE </button>
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
        <div className={`${previewClientStyle.buttonEditGroup} ${previewClientStyle.BtnRight}`}>
                        <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`} onClick={() => setIsEditCompanyWebsite(false)}> Cancel </button>
                        <button type="button" className={previewClientStyle.btnPrimary} onClick={() => setIsEditCompanyWebsite(false)}> SAVE </button>
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
                    <HRInputField
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
                    />  

                     <div className={`${previewClientStyle.buttonEditGroup}`}>
                        <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`} onClick={() => setIsEditCompanyFound(false)}> Cancel </button>
                        <button type="button" className={previewClientStyle.btnPrimary} onClick={() => setIsEditCompanyFound(false)}> SAVE </button>
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
            <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`} onClick={() => setIsEditTeamSize(false)}> Cancel </button>
            <button type="button" className={previewClientStyle.btnPrimary} onClick={() => setIsEditTeamSize(false)}> SAVE </button>
        </div>    
      </Modal>
      {/* Company Type Modal*/}
      <Modal
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
            <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`} onClick={() => setIsEditCompanyType(false)}> Cancel </button>
            <button type="button" className={previewClientStyle.btnPrimary} onClick={() => setIsEditCompanyType(false)}> SAVE </button>
        </div>   
      </Modal>
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
            <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`} onClick={() => setIsEditCompanyIndustry(false)}> Cancel </button>
            <button type="button" className={previewClientStyle.btnPrimary} onClick={() => setIsEditCompanyIndustry(false)}> SAVE </button>
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
            <button type="button" className={`${previewClientStyle.btnPrimary} ${previewClientStyle.blank}`} onClick={() => setIsEditHeadquarters(false)}> Cancel </button>
            <button type="button" className={previewClientStyle.btnPrimary} onClick={() => setIsEditHeadquarters(false)}> SAVE </button>
        </div>
      </Modal>
    </>
  );
}

export default PreviewClientModal;