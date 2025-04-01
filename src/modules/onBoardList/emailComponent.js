import React, { useEffect, useState, useMemo, useCallback,useRef } from "react";
import AddNewClientStyle from "../../modules/client/screens/addnewClient/add_new_client.module.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import {
  Avatar,
  Tabs,
  Table,
  Skeleton,
  Checkbox,
  message,
  Modal,
  Select,
  Tooltip,
} from "antd";
import { useForm } from "react-hook-form";
import { engagementRequestDAO } from "core/engagement/engagementDAO";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { InputType } from "constants/application";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'
import { ReactComponent as AttachmentSVG } from 'assets/svg/attachment.svg';
import { allCompanyRequestDAO } from "core/company/companyDAO";
import { sanitizeLinks } from "modules/hiring request/screens/allHiringRequest/previewHR/services/commonUsedVar";

const EmailComponent = ({onboardID,getOnboardFormDetails})=>{
    const [emailMasterValues,setEmailMasterValues] = useState({})
  const [templateData,setTemplateData]= useState({})
  const [emailContent,setEmailContent] = useState('')
    const {
      register,
      handleSubmit,
      setValue,
      control,
      setError,
      getValues,
      watch,
      reset,
      resetField,
      formState: { errors },
    } = useForm();

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

    async function onHandleBlurImage(content, field) {
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
    
         
          setValue('emailContent',updatedContent)
          
        }
      }

     const getEmailMasterValue = async (onboardID)=>{
      let result = await engagementRequestDAO.getEmailMasterDAO(onboardID)
      console.log('em val',result)
      if(result.statusCode === 200){
        setEmailMasterValues(result.responseBody)
      }
      
        }
      
        useEffect(()=>{getEmailMasterValue(onboardID)},[onboardID])

    const getEmailTemplate = async () =>{
      let pl = {
        receiver: watch('receiver'),
       templateType:watch('templateType'),
       onBoardId:onboardID,
       talentId:getOnboardFormDetails.onboardContractDetails.talentID,
       clientId: getOnboardFormDetails.onboardContractDetails.contactID
      }

      const result = await engagementRequestDAO.getEmailTemplateDAO(pl)

      console.log('res temp', result)
      if(result.statusCode === 200){
        setTemplateData(result.responseBody)

        setValue('fromName',result.responseBody.fromName)
        setValue('toEmail',result.responseBody.toEmail)
        setValue('replyTo',result.responseBody.replyTo)
        setValue('subject',result.responseBody.subject)
        setValue('emailContent',result.responseBody.emailContent)
        // setEmailContent(result.responseBody.emailContent)
        console.log(result.responseBody.emailContent)
      }


    }

    const sendEmail = async()=>{
        let payload = {
            "templateID": templateData?.id,
            "fromName": watch('fromName'),
            "toEmail": watch('toEmail'),
            "replyTo": watch('replyTo'),
            "subject": watch('subject'),
            "emailContent": watch('emailContent'),
            "attachmentName": "",
            "onBoardID": onboardID,
            "hiringRequestID": getOnboardFormDetails.onboardContractDetails.hR_ID,
            "contactID": getOnboardFormDetails.onboardContractDetails.contactID,
            "talentID": getOnboardFormDetails.onboardContractDetails.talentID,
            "receiver": watch('receiver')
          }

        const result = await engagementRequestDAO.sendEmailDAO(payload)
        console.log('send mail result',result)

        if(result.statusCode === 200){
            message.success('Email send ')
            resetField('templateType')
            resetField("receiver")
            resetField("fromName")
            resetField("toEmail")
            resetField("replyTo")
            resetField("subject")
            resetField('emailContent')
            setTemplateData({})
        }
    }

console.log('emailContent',emailContent,templateData,getOnboardFormDetails.onboardContractDetails)
    return <div className={AddNewClientStyle.onboardDetailsContainer}>
      <div className={AddNewClientStyle.emailHeaderComp}>

      <HRSelectField
      compStyles={{marginBottom:'0'}}
                      key={"tamplateType"}
                      setValue={setValue}
                      // searchable={true}
                      mode="value"
                      register={register}
                      label={"Template Type"}
                      defaultValue={watch('templateType') ?? 'please select'}
                      options={emailMasterValues?.TemplateTypes?.map(i=> ({id:i.id, value: i.dropdownValue})) }
                      name="templateType"
                      isError={errors["templateType"] && errors["templateType"]}
                      // required
                      errorMsg={
                        errors?.salesPerson?.message ||
                        "Please select hiring request sales person"
                      }
                    />

                    <HRSelectField
                     compStyles={{marginBottom:'0'}}
                      key={"receiver"}
                      mode="value"
                      setValue={setValue}
                      // searchable={true}
                      register={register}
                      label={"Receiver"}
                      defaultValue={watch('receiver') ?? 'please select'}
                      options={emailMasterValues?.Receivers?.map(i=> ({id:i.id, value: i.dropdownValue}))}
                      name="receiver"
                      isError={errors["receiver"] && errors["receiver"]}
                      // required
                      errorMsg={
                        errors?.salesPerson?.message ||
                        "Please select hiring request sales person"
                      }
                    />
                    {console.log(watch('templateType') , watch('receiver'))}
{(watch('templateType') && watch('receiver')) &&   <button className={AddNewClientStyle.engagementModalHeaderAddBtn} style={{marginTop:'20px'}}
            onClick={()=> {
              getEmailTemplate()
            }}
            >Get Template</button>}
        
      </div>

      <div className={AddNewClientStyle.emailMainComp}>
      <HRInputField
                      register={register}
                      errors={errors}
                      label={"From Name"}
                      name="fromName"
                      type={InputType.TEXT}
                      placeholder="From name"
                      disabled={!templateData?.id}
                    //   validationSchema={{
                    //     required: "Please enter the Client Name",
                    //     validate:(value)=>{
                    //       const regex = /^[a-zA-Z ]*$/
                    //       if(!regex.test(value)){
                    //         return 'Invalid input. Special characters and numbers are not allowed.'
                    //       }
                    //     }
                    //   }}
                    />

      <HRInputField
       register={register}
       errors={errors}
       label={"To Email"}
       name="toEmail"
       type={InputType.TEXT}
       placeholder="To email"
       disabled={!templateData?.id}
      />

<HRInputField
       register={register}
       errors={errors}
       label={"Reply To"}
       name="replyTo"
       type={InputType.TEXT}
       placeholder="Reply to"
       disabled={!templateData?.id}
      />

<HRInputField
       register={register}
       errors={errors}
       label={"Subject"}
       name="subject"
       type={InputType.TEXT}
       placeholder="subject"
       disabled={!templateData?.id}
      />

<ReactQuill

                            theme="snow"
                            className="heightSize"
                            value={watch('emailContent')}
                            onChange={(val) => {
                              let sanitizedContent = sanitizeLinks(val);
                              // let _updatedVal = sanitizedContent?.replace(/<img\b[^>]*>/gi, '');
                              setValue('emailContent',sanitizedContent)}}
                            // className={previewClientStyle.reactQuillEdit}
                            // required
                            onBlur={()=>onHandleBlurImage(emailContent,'About company')}
                          />
      <button className={AddNewClientStyle.engagementModalAttachmentBtn}
      disabled={!templateData?.id}
      >
      <AttachmentSVG style={{width:'24px', height:'24px'}} />  add attachment
      </button>

      </div>

      <div style={{display:'flex',justifyContent:'flex-end', gap:'10px'}}> 
      <button className={AddNewClientStyle.engagementModalHeaderAddBtn} disabled={!templateData?.id}  style={{background:'var(--color-sunlight)',color:'#000'}} onClick={()=>{

          }}>Preview and Send Email</button>
         <button className={AddNewClientStyle.engagementModalHeaderAddBtn} 
         disabled={!templateData?.id}
            onClick={()=> {
                sendEmail()
            }}
            >Send Email</button></div>
    </div>
  }


export default EmailComponent
