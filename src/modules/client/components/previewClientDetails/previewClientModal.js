import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import previewClientStyle from "../previewClientDetails/previewClientDetail.module.css";
import { AutoComplete } from "antd";
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

  const allInvestors = getCompanyDetails?.fundingDetails?.[0]?.allInvestors?getCompanyDetails?.fundingDetails?.[0]?.allInvestors?.split(",") : [];
  const displayedInvestors = showAllInvestors ? allInvestors : allInvestors.slice(0, 4);

  const toggleInvestors = () => {
    setShowAllInvestors((prev) => !prev);
  };
  
  const getDetails = async () => {
      const result = await allCompanyRequestDAO.getCompanyDetailDAO(getcompanyID);
    
      if (result?.statusCode === HTTPStatusCode.OK) {
        setCompanyDetails(result?.responseBody);
     }
    };

useEffect(() => {
    getDetails()
}, [getcompanyID])

console.log(getCompanyDetails,"getCompanyDetailsgetCompanyDetails");

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
                                            <h3>{getCompanyDetails?.basicDetails?.companyName} <span className={previewClientStyle.editNewIcon}> <EditNewIcon/> </span></h3>
                                            <a href="#">{getCompanyDetails?.basicDetails?.website} <span className={previewClientStyle.editNewIcon}> <EditNewIcon/> </span></a>
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
                                    <span className={previewClientStyle.addAnotherRoundbtn}>Add Another Round</span>
                                </div> 
                            
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
                                            

                            <h6> Culture <span className={previewClientStyle.editNewIcon} ><EditNewIcon/></span> </h6>

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

                            <div className={previewClientStyle.imgSection}>
                                {getCompanyDetails?.cultureDetails?.map((val)=>(
                                    <div className={previewClientStyle.imgThumb}>
                                        <img src={val?.cultureImage} alt="detailImg" />
                                        <span className={previewClientStyle.DeleteBtn}><DeleteNewIcon/> </span>
                                    </div>
                                ))}
                                {/* <div className={previewClientStyle.imgThumb}>
                                    <img src={CompanyDetailimg2} alt="detailImg" />
                                    <span className={previewClientStyle.DeleteBtn}><DeleteNewIcon/> </span>
                                </div>
                                <div className={previewClientStyle.imgThumb}>
                                    <img src={CompanyDetailimg3} alt="detailImg" />
                                    <span className={previewClientStyle.DeleteBtn}><DeleteNewIcon/> </span>
                                </div> */}
                                {getCompanyDetails?.youTubeDetails?.map((val)=>(
                                    <div className={previewClientStyle.videoWrapper}>
                                        {/* <iframe width="420" height="315"
                                            src={`https://www.youtube.com/embed/${val?.youtubeLink}`}>
                                        </iframe> */}
                                        <YouTubeVideo videoLink={val?.youtubeLink}/>
                                        <span className={previewClientStyle.DeleteBtn}><DeleteNewIcon/> </span>
                                    </div>
                                ))}
                                {/* <div className={previewClientStyle.videoWrapper}>
                                    <iframe width="420" height="315"
                                        src="https://www.youtube.com/embed/tgbNymZ7vqY">
                                    </iframe>
                                    <span className={previewClientStyle.DeleteBtn}><DeleteNewIcon/> </span>
                                </div> */}
                            </div>

                                
                            <h6>Company Benefits 
                                <span className={previewClientStyle.editNewIcon}><EditNewIcon/></span>
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
                    
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={previewClientStyle.formFields}>
                <div className={previewClientStyle.formFieldsbox}>
                    <div className={previewClientStyle.formFieldsboxinner}>
                        <div className={previewClientStyle.formFieldTitleTwo}>
                            <h2>Client Details <span className={previewClientStyle.addNewClientText}>Add New Client</span></h2>
                        </div>

                        <div className={previewClientStyle.companyDetails}>  

                            <div className={`${previewClientStyle.companyDetailTop} ${previewClientStyle.clientDetailListed}`}>
                               
                                <div className={previewClientStyle.companyNewClientbox}>  
                                    <h5 className={previewClientStyle.clientlistedTop}> <span className={previewClientStyle.clientlistedTitle}> Client 1 </span>  <span className={previewClientStyle.editNewIcon}><EditNewIcon/></span></h5>    
                                        
                                    <ul>
                                        <li>
                                            <span>Client Full Name</span>
                                            <p>Shikha Dhawan</p>
                                        </li>
                                        <li>
                                            <span>Client’s Work Email</span>
                                            <p>shikha@techinnovate.com</p>
                                        </li>
                                        <li>
                                            <span>Designation</span>
                                            <p>Marketing Director</p>
                                        </li>
                                        <li>
                                            <span>Access Type</span>
                                            <p>Admin</p>
                                        </li>
                                        <li>
                                            <span>Phone Number</span>
                                            <p>+919784635475</p>
                                        </li>
                                    </ul>
                                </div>

                                <div className={previewClientStyle.companyNewClientbox}>  
                                    <h5 className={previewClientStyle.clientlistedTop}> <span className={previewClientStyle.clientlistedTitle}> Client 2 </span>  <span className={previewClientStyle.editNewIcon}><EditNewIcon/></span></h5>    
                                    <ul>
                                        <li>
                                            <span>Client Full Name</span>
                                            <p>Shikha Dhawan</p>
                                        </li>
                                        <li>
                                            <span>Client’s Work Email</span>
                                            <p>shikha@techinnovate.com</p>
                                        </li>
                                        <li>
                                            <span>Designation</span>
                                            <p>Marketing Director</p>
                                        </li>
                                        <li>
                                            <span>Access Type</span>
                                            <p>Admin</p>
                                        </li>
                                        <li>
                                            <span>Phone Number</span>
                                            <p>+919784635475</p>
                                        </li>
                                    </ul>
                                </div>
                             
                            </div>

                           
                        </div>
                    </div>
                </div>
            </div>

            <div className={previewClientStyle.formFields}>
                <div className={previewClientStyle.formFieldsbox}>
                    <div className={previewClientStyle.formFieldsboxinner}>
                       
                        <h2>Engagement Details <span className={previewClientStyle.editNewIcon}><EditNewIcon/></span></h2>
                       

                        <div className={previewClientStyle.companyDetails}>  
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

                        <h2>Uplers’s POCs <span className={previewClientStyle.editNewIcon}><EditNewIcon/></span></h2>

                        <div className={previewClientStyle.companyDetails}>  
                                <div className={previewClientStyle.companyBenefits}>
                                    <ul className={previewClientStyle.mt0}>
                                        <li>
                                            <span>Firstname Lastname</span>
                                        </li>  
                                        <li>
                                            <span>Firstname Lastname</span>
                                        </li>  
                                        <li>
                                            <span>Firstname Lastname</span>
                                        </li>   
                                    </ul>
                                </div>
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
      >
        <label>Change Company Name</label>
        <AutoComplete />
        <button onClick={() => setIsEditCompanyName(false)}>Cancel</button>
        <button onClick={() => setIsEditCompanyName(false)}>SAVE</button>
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
      >
        <HRInputField
          //    required
          rows={4}
          errors={errors}
          label={"Company website"}
          register={register}
          name="companyWebsite"
          type={InputType.TEXT}
          placeholder="Company website"
        />
        <button onClick={() => setIsEditCompanyWebsite(false)}>Cancel</button>
        <button onClick={() => setIsEditCompanyWebsite(false)}>SAVE</button>
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
      >
        <HRInputField
          //    required
          rows={4}
          errors={errors}
          label={"Founded in"}
          register={register}
          name="foundedIn"
          type={InputType.TEXT}
          placeholder="Please enter"
        />
        <button onClick={() => setIsEditCompanyFound(false)}>Cancel</button>
        <button onClick={() => setIsEditCompanyFound(false)}>SAVE</button>
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
      >
        <HRInputField
          //    required
          rows={4}
          errors={errors}
          label={"Change team size"}
          register={register}
          name="teamSize"
          type={InputType.TEXT}
          placeholder="Please enter"
        />
        <button onClick={() => setIsEditTeamSize(false)}>Cancel</button>
        <button onClick={() => setIsEditTeamSize(false)}>SAVE</button>
      </Modal>
      {/* Company Type Modal*/}
      <Modal
        centered
        open={isEditCompanyType}
        onOk={() => setIsEditCompanyType(false)}
        onCancel={() => setIsEditCompanyType(false)}
        width={300}
        footer={false}
        maskClosable={false}
      >
        <HRInputField
          //    required
          rows={4}
          errors={errors}
          label={"Company Type"}
          register={register}
          name="companyType"
          type={InputType.TEXT}
          placeholder="Please enter"
        />
        <button onClick={() => setIsEditCompanyType(false)}>Cancel</button>
        <button onClick={() => setIsEditCompanyType(false)}>SAVE</button>
      </Modal>
      {/* Company Industry Modal*/}
      <Modal
        centered
        open={isEditCompanyIndustry}
        onOk={() => setIsEditCompanyIndustry(false)}
        onCancel={() => setIsEditCompanyIndustry(false)}
        width={300}
        footer={false}
        maskClosable={false}
      >
        <HRInputField
          //    required
          rows={4}
          errors={errors}
          label={"Company Industry"}
          register={register}
          name="companyIndustry"
          type={InputType.TEXT}
          placeholder="Please enter"
        />
        <button onClick={() => setIsEditCompanyIndustry(false)}>Cancel</button>
        <button onClick={() => setIsEditCompanyIndustry(false)}>SAVE</button>
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
      >
        <label>Headquarters</label>
        <AutoComplete />
        <button onClick={() => setIsEditHeadquarters(false)}>Cancel</button>
        <button onClick={() => setIsEditHeadquarters(false)}>SAVE</button>
      </Modal>
    </>
  );
}

export default PreviewClientModal;