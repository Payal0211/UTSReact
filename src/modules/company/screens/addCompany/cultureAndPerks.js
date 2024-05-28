import React, { useEffect, useState, useRef } from "react";
import AddNewClientStyle from "./addclient.module.css";
import { ReactComponent as EditSVG } from "assets/svg/EditField.svg";
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as DeleteIcon} from 'assets/svg/delete-yellow.svg'
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { InputType, EmailRegEx, ValidateFieldURL } from "constants/application";
import { useFieldArray, useForm } from "react-hook-form";
import TextEditor from "shared/components/textEditor/textEditor";
import { Checkbox, message } from 'antd';
import { allCompanyRequestDAO } from "core/company/companyDAO";
import { HTTPStatusCode } from "constants/network";
import { HttpStatusCode } from "axios";

function CultureAndPerks({register,errors,setValue,watch,perkDetails,youTubeDetails,cultureDetails,companyDetails,setCompanyDetails,companyID}) {
    const [controlledperk, setControlledperk] = useState([]);
    const [combinedPerkMemo, setCombinedPerkMemo] = useState([])
    const pictureRef = useRef()
   useEffect(()=>{
    if(perkDetails?.length > 0){
      setValue('perksAndAdvantages',perkDetails?.map(item=> ({
          id: item,
          value: item,
      })))
      setCombinedPerkMemo(perkDetails?.map(item=> ({
          id: item,
          value: item,
      })))
      setControlledperk(perkDetails?.map(item=> ({
          id: item,
          value: item,
      })))
          }

    if(companyDetails?.companyName){
        companyDetails?.culture && setValue('culture',companyDetails?.culture)
    }
   },[perkDetails,companyDetails]) 

   const uploadCultureImages = async (Files) => {
     
    let filesToUpload = new FormData()



      for (let i = 0; i < Files.length; i++) {
       
       filesToUpload.append("Files",Files[i])
      }
      // filesToUpload.append("Files",Files)
     filesToUpload.append('IsCompanyLogo',false)
     filesToUpload.append('IsCultureImage',true)

    //  let payload = {
    //   Files:Files,
    //   IsCompanyLogo:false,
    //   IsCultureImage:true
    //  }

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

  return (
    <div className={AddNewClientStyle.tabsFormItem}>
    <div className={AddNewClientStyle.tabsFormItemInner}>
            <div className={AddNewClientStyle.tabsLeftPanel}>
                <h3>Culture & Perks</h3>
                <p>Please provide the necessary details</p>
            </div>
            
              <div className={AddNewClientStyle.tabsRightPanel}>
            <div className={AddNewClientStyle.row}>
        <div className={AddNewClientStyle.colMd12}>
        <TextEditor
            register={register}
            setValue={setValue}
            // errors={errors}
            controlledValue={companyDetails?.culture ? companyDetails.culture : ''}
            isControlled={true}
            isTextArea={true}
            label="Culture"
            name="culture"
            type={InputType.TEXT}
            placeholder="Enter about company culture"
            required={false}
            watch={watch}
          />
          </div>
        </div>

        <div className={AddNewClientStyle.row}>
        <div className={AddNewClientStyle.colMd12}>
        <div className={AddNewClientStyle.label}>Picture</div>
        <div
              className={AddNewClientStyle.FilesDragAndDrop__area}
              style={{ width: "100%", cursor: "pointer" }}
              onClick={()=> pictureRef && pictureRef.current.click()}
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
                <span>Click to Upload</span> 
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
                    
                    uploadCultureImages(e.target.files)
                    // setIsLoading(true);
                    // const result = await loadEndPromise;
                    // setIsLoading(false);
                    // let _culVal = [...cultureDetails];
                    // _culVal.push({
                    //   cultureImage: result,
                    //   internalId: Math.random(),
                    //   cultureID: null,
                    //   internalName: file.name,
                    //   fileUpload: {
                    //     base64ProfilePic: result,
                    //     extenstion: file.name.split(".").pop(),
                    //   },
                    // });
                    // setCultureDetails(_culVal);
                  } catch (error) {
                    console.error("Error reading the file:", error);
                  }
                }}
              />
            </div>
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
										value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?(\S+)$/,
										message: 'Youtube link is not valid',
									},
                }}
                onKeyDownHandler={e=>{
                  if(e.keyCode === 13){
                    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?(\S+)$/;
                      if(!regex.test(e.target.value)){
                        return message.error('Youtube link is not valid')
                      }

                    let youtubeDetail = {youtubeLink: watch('youtubeLink'), 
                      youtubeID: 0
                      }

                      let nweyouTubeDetails = [...youTubeDetails]
                      setCompanyDetails(prev => ({...prev,youTubeDetails:[ youtubeDetail,...nweyouTubeDetails]}))
                      setValue('youtubeLink','')
                  }
                }}
                type={InputType.TEXT}
                onChangeHandler={(e) => {
                }}
                placeholder="Add Links separated by commas"
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
<div className={AddNewClientStyle.youTubeDetails}>
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
              label="Company perks & advantages"
              defaultValue="Mention perks & advantages"
              options={combinedPerkMemo}
              setOptions={setCombinedPerkMemo}
            />
        </div>
        </div>
            </div>
            </div>

          

    </div>
  )
}

export default CultureAndPerks