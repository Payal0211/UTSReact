import React, { useEffect, useState, useRef } from "react";
import AddNewClientStyle from "./addclient.module.css";
import { ReactComponent as DeleteIcon} from 'assets/svg/delete-yellow.svg'
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { InputType } from "constants/application";
import TextEditor from "shared/components/textEditor/textEditor";
import { Checkbox, Skeleton, Upload, message } from 'antd';
import { allCompanyRequestDAO } from "core/company/companyDAO";
import { HTTPStatusCode } from "constants/network";
import { HttpStatusCode } from "axios";
import ReactQuill from "react-quill";
import { sanitizeLinks } from "modules/hiring request/screens/allHiringRequest/previewHR/services/commonUsedVar";

function CultureAndPerks({register,errors,setValue,watch,perkDetails,youTubeDetails,cultureDetails,companyDetails,setCompanyDetails,companyID,loadingDetails,cultureAndParksValue}) {
    const [controlledperk, setControlledperk] = useState([]);
    const [combinedPerkMemo, setCombinedPerkMemo] = useState([])
    const [uploading,setUploading] = useState(false)
    const pictureRef = useRef()
    const { Dragger } = Upload;
   useEffect(()=>{
    if(perkDetails?.length > 0){
      setValue('perksAndAdvantages',perkDetails?.map(item=> ({
          id: item,
          value: item,
      })))
      if(cultureAndParksValue?.length > 0){
         setCombinedPerkMemo([...perkDetails?.map(item=> ({
          id: item,
          value: item,
      })),...cultureAndParksValue?.filter(item=> !perkDetails?.includes(item.value)).map(item=> ({
        id: item.value,
        value: item.value,
    }))] )
      }
     
      setControlledperk(perkDetails?.map(item=> ({
          id: item,
          value: item,
      })))
          }else{
            setCombinedPerkMemo(cultureAndParksValue?.map(item=> ({
                    id: item.value,
                    value: item.value,
                })))
          }

    // if(companyDetails?.companyName){
    //     companyDetails?.culture && setValue('culture',companyDetails?.culture)
    // }
   },[perkDetails,companyDetails,cultureAndParksValue,setValue]) 

   useEffect(() => {
    companyDetails?.culture &&
    setValue("culture", companyDetails?.culture);
   }, [setValue,companyDetails])
   

  //  useEffect(()=>{
  //   if(cultureAndParksValue?.length > 0){
  //     setCombinedPerkMemo(cultureAndParksValue?.map(item=> ({
  //       id: item.value,
  //       value: item.value,
  //   })))
  //   }
  //  },[cultureAndParksValue])

   const uploadCultureImages = async (Files) => {
    setUploading(true)
    let filesToUpload = new FormData()

      for (let i = 0; i < Files.length; i++) {   
       filesToUpload.append("Files",Files[i])
      }
     filesToUpload.append('IsCompanyLogo',false)
     filesToUpload.append('IsCultureImage',true)

     let Result = await allCompanyRequestDAO.uploadImageDAO(filesToUpload)
   
     if(Result?.statusCode === HTTPStatusCode.OK){
        let imgUrls = Result?.responseBody

        let imgObj = imgUrls.map(url=> (
          {
            "cultureID": 0,
            "cultureImage": url
          }
        ))
        let newCultureObj = [...cultureDetails]
        setCompanyDetails(prev=> ({...prev,
          cultureDetails:[...imgObj,...newCultureObj]
          }))
     }
     setUploading(false)
   }


   const removeYoutubeDetailsFromBE = async (toDelete) => {
    let payload = {
        "youtubeID": toDelete.youtubeID,
        "companyID": companyID
    }
    const result = await allCompanyRequestDAO.deleteYoutubeDetailsDAO(payload)
    if(result.statusCode === HttpStatusCode.Ok){
      let filteredValue =  youTubeDetails.filter(d=> !(d.youtubeID === toDelete.youtubeID && d.youtubeLink === toDelete.youtubeLink))
      setCompanyDetails(prev => ({...prev,youTubeDetails:filteredValue}))
    }
    }

   const removeYoutubelink = (toDelete) => {
    if(toDelete.youtubeID === 0){
      let filteredValue =  youTubeDetails.filter(d=> !(d.youtubeID === toDelete.youtubeID && d.youtubeLink === toDelete.youtubeLink))
      setCompanyDetails(prev => ({...prev,youTubeDetails:filteredValue}))
    }else {
      removeYoutubeDetailsFromBE(toDelete)
    }
      
   }

   const removeIMGFromBE= async (toDelete) =>{
    let payload = {
      "cultureID": toDelete.cultureID,
      "culture_Image": toDelete.cultureImage,
      "companyID": companyID
    }

    const result = await allCompanyRequestDAO.deleteImageDAO(payload)

    if(result.statusCode === HttpStatusCode.Ok){
      let filteredValue =  cultureDetails.filter(d=> !(d.cultureID=== toDelete.cultureID && d.cultureImage=== toDelete.cultureImage))
      setCompanyDetails(prev => ({...prev,cultureDetails:filteredValue}))
    }
   }

   const deleteCulturImage = (toDelete) => {
    if(toDelete.cultureID === 0){
      let filteredValue =  cultureDetails.filter(d=> !(d.cultureID=== toDelete.cultureID && d.cultureImage=== toDelete.cultureImage))
      setCompanyDetails(prev => ({...prev,cultureDetails:filteredValue}))
    }else {
      removeIMGFromBE(toDelete)
    }
   }

const addnewYoutubeLink = (e) =>{
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&=%\?]{11})$/;
                      if(!regex.test(e.target.value)){
                        return message.error('Please provide proper youtube video link, channel/page link not allowed.')
                      }

                    let youtubeDetail = {youtubeLink: watch('youtubeLink'), 
                      youtubeID: 0
                      }

                      let oldLinks = youTubeDetails.map(item=> item.youtubeLink)
                      if(oldLinks.includes(watch('youtubeLink'))){
                        setValue('youtubeLink','')
                        return message.error('Youtube link Already exists')
                      }

                      let nweyouTubeDetails = [...youTubeDetails]
                      setCompanyDetails(prev => ({...prev,youTubeDetails:[ youtubeDetail,...nweyouTubeDetails]}))
                      setValue('youtubeLink','')
}

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
//  console.log("culture",companyDetails)
  return (
    <div className={AddNewClientStyle.tabsFormItem}>
      {loadingDetails ? <Skeleton active /> : <div className={AddNewClientStyle.tabsFormItemInner}>
            <div className={AddNewClientStyle.tabsLeftPanel}>
                <h3>Culture & Perks</h3>
                <p>Please provide the necessary details</p>
            </div>
            
              <div className={AddNewClientStyle.tabsRightPanel}>
            <div className={AddNewClientStyle.row}>
        <div className={AddNewClientStyle.colMd12} style={{marginBottom: '25px'}}>
            <div className={AddNewClientStyle.label}>Culture</div>
            <ReactQuill
              register={register}
              setValue={setValue}
              theme="snow"
              className="heightSize"
              // value={companyDetails?.culture ? companyDetails.culture : ''} 
              value={
                !watch("culture")
                  ? companyDetails?.culture ?? ""
                  : watch("culture")
              }
              name="culture"
              onChange={(val) => {
                let sanitizedContent = sanitizeLinks(val);
                // let _updatedVal = sanitizedContent?.replace(/<img\b[^>]*>/gi, '');
                setValue("culture", sanitizedContent)}
              }
              // onChange={(val) => {
              //   // console.log(val,"dfsdfsdfsdfsdfsdfsdfdsf");
              //   // setValue("culture",val)
              //   // setCompanyDetails(prev=> ({...prev, basicDetails:{ ...prev.basicDetails,culture : val}}))
              // }}
            />
          </div>
        </div>

        <div className={AddNewClientStyle.row}>
        <div className={AddNewClientStyle.colMd12}>
        <div className={AddNewClientStyle.label}>Picture</div>
        {uploading? <Skeleton active /> : <div
              className={AddNewClientStyle.FilesDragAndDrop__area}
              style={{ width: "100%", cursor: "pointer" }}
              onClick={()=> pictureRef && pictureRef.current.click()}
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
                <span>Click to Upload</span> <span style={{color:"gray"}}>or drag and drop</span>
              </p>
              {/* <span> (Max. File size: 25 MB)</span> */}
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

                  const acceptedTypes = ["image/jpeg", "image/png"];
                  if (!acceptedTypes.includes(file.type)) {
                    message.info(
                      "Please select a valid image file (JPEG or PNG)."
                    );
                    return;
                  }

                  // const maxSize = 25 * 1024 * 1024;
                  // if (file.size > maxSize) {
                  //   message.error("Maximum image size are 25 MB.");
                  //   return;
                  // }


                  try {                 
                    uploadCultureImages(e.target.files)
                  } catch (error) {
                    console.error("Error reading the file:", error);
                  }
                }}
              />
            </div>}
        
        </div>
        </div>

        {cultureDetails?.length > 0 && <div className={AddNewClientStyle.row}>
            {cultureDetails?.map(culture=> <div className={AddNewClientStyle.colMd4} key={`${culture.cultureID} ${culture.cultureImage}`}>
                <div className={AddNewClientStyle.cultureImageContainer}>
                    <img src={culture.cultureImage} alt='culture' className={AddNewClientStyle.cultureImage} />
                    <DeleteIcon  className={AddNewClientStyle.cultureDelete} onClick={()=> deleteCulturImage(culture)}/>
                </div>
            </div>)}
            </div>}

        <div className={AddNewClientStyle.row}>
        <div className={AddNewClientStyle.colMd12}>
        <HRInputField
                register={register}
                // errors={errors}
                label="Add YouTube links"
                name="youtubeLink"
                validationSchema={{
                  pattern: {
										value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&=%\?]{11})$/,
										message: 'Youtube link is not valid',
									},
                }}
                onKeyDownHandler={e=>{
                  if(e.keyCode === 13){
                    addnewYoutubeLink(e)
                  }
                }}
                onBlurHandler={e=>{
                  if(e.target.value){
                    addnewYoutubeLink(e)
                  }
                  
                }}
                type={InputType.TEXT}
                onChangeHandler={(e) => {
                }}
                placeholder="Ex: https://www.youtube.com/watch?v=Bzf-ngn_JAw"
              />
        </div>
        </div>

        {youTubeDetails?.length > 0 &&  <div className={AddNewClientStyle.row} >
          {youTubeDetails.map(youtube=> <div className={AddNewClientStyle.colMd12} key={`${youtube.youtubeID} ${youtube.youtubeLink}}`  }>
                {/* <iframe
  src={youtube.youtubeLink}
  frameborder='0'
  allow='autoplay; encrypted-media'
  allowfullscreen
  title='video'
/> */}
<div className={AddNewClientStyle.youTubeDetails} onClick={()=>{}}>
  {youtube.youtubeLink}  <DeleteIcon style={{marginLeft:'10px',cursor:'pointer'}} onClick={()=>{ removeYoutubelink(youtube)}} />
</div>
                </div>)}
                
        </div>}

        <div className={AddNewClientStyle.row}>
        <div className={AddNewClientStyle.colMd12}>
        <HRSelectField
        isControlled={true}
        controlledValue={controlledperk}
        setControlledValue={setControlledperk}
              setValue={setValue}
              mode={'tags'}
              register={register}
              name="perksAndAdvantages"
              label="Company perks & benefits"
              defaultValue="Mention perks & benefits"
              placeholder="Mention perks & benefits"
              options={combinedPerkMemo}
              setOptions={setCombinedPerkMemo}
            />
        </div>
        </div>
            </div>
            </div>}
    

          

    </div>
  )
}

export default CultureAndPerks