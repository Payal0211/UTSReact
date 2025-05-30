import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
import spinGif from "assets/gif/RefreshLoader.gif";
import { useForm } from "react-hook-form";
import { engagementRequestDAO } from "core/engagement/engagementDAO";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { EmailRegEx, InputType } from "constants/application";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ReactComponent as AttachmentSVG } from "assets/svg/attachment.svg";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import { sanitizeLinks } from "modules/hiring request/screens/allHiringRequest/previewHR/services/commonUsedVar";

const EmailComponent = ({ onboardID, getOnboardFormDetails }) => {
  const fileRef = useRef();
  const [emailMasterValues, setEmailMasterValues] = useState({});
  const [templateData, setTemplateData] = useState({});
  const [docUploading, setDocUploading] = useState(false);
  const [fetchingTemplate, setFetchingTemplate] = useState(false);
  const [isPreview, setISPreview] = useState(false);
  const [attaachments,setAttachments] = useState([])
  const [sendingMail, setSendEmail] = useState(false)
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

  const base64ToBlob = (base64Data, contentType = "") => {
    const byteString = atob(base64Data.split(",")[1]);
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


  const getEmailMasterValue = async (onboardID) => {
    let result = await engagementRequestDAO.getEmailMasterDAO(onboardID);
    if (result.statusCode === 200) {
      setEmailMasterValues(result.responseBody);
    }
  };

  useEffect(() => {
    getEmailMasterValue(onboardID);
  }, [onboardID]);

  const getEmailTemplate = async () => {
    setFetchingTemplate(true);
    let pl = {
      receiver: watch("receiver"),
      templateType: watch("templateType"),
      onBoardId: onboardID,
      talentId: getOnboardFormDetails.onboardContractDetails.talentID,
      clientId: getOnboardFormDetails.onboardContractDetails.contactID,
    };

    const result = await engagementRequestDAO.getEmailTemplateDAO(pl);
    setFetchingTemplate(false);
 
    if (result.statusCode === 200) {
      setTemplateData(result.responseBody);

      setValue("fromName", result.responseBody.fromName);
      setValue("toEmail", result.responseBody.toEmail);
      setValue("replyTo", result.responseBody.replyTo);
      setValue("subject", result.responseBody.subject);
      setValue("emailContent", result.responseBody.emailContent);
      // setEmailContent(result.responseBody.emailContent)
    }
  };

  const sendEmail = async () => {
    if (
      watch("emailContent") === "" ||
      watch("emailContent") === "<p><br></p>"
    ) {
      message.error("Please Fill Email content");
      return;
    }

    setSendEmail(true)
    let emailContent = watch("emailContent")

    const imgTags = emailContent?.match(/<img[^>]*>/g) || [];
    const list = [];
    const base64Srcs = [];

    for (const imgTag of imgTags) {
      if (!imgTag) continue;

      const srcMatch = imgTag.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        const src = srcMatch[1];
        const filename = src.split("/").pop();
        const timestamp = new Date().getTime();
        const name = filename.split(/\.(?=[^\.]+$)/);
        const uniqueFilename = `${name}_${timestamp}`;
        if (src.startsWith("data:image/")) {
          base64Srcs.push(src);
          const file = await base64ToFile(src, uniqueFilename);
          list.push(file);
        }
      }
    }

    if (list.length > 0) {
      const formData = new FormData();
      list.forEach((file) => formData.append("Files", file));
      formData.append("IsCompanyLogo", false);
      formData.append("IsCultureImage", false);
      formData.append("Type", "custom_email_attachment");

      let Result = await allCompanyRequestDAO.uploadImageDAO(formData);
      const uploadedUrls = Result?.responseBody || [];
      let updatedContent = emailContent;
      base64Srcs.forEach((src, index) => {
        if (uploadedUrls[index]) {
          const escapedSrc = src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const regex = new RegExp(`src="${escapedSrc}"`, "g");
          updatedContent = updatedContent.replace(
            regex,
            `src="${uploadedUrls[index]}"`
          );
        }
      });
      emailContent = updatedContent
    //   setValue("emailContent", updatedContent);
    }
    

    let payload = {
      templateID: templateData?.id,
      fromName: watch("fromName"),
      toEmail: watch("toEmail"),
      replyTo: watch("replyTo"),
      subject: watch("subject"),
      emailContent: emailContent,
      attachmentName: attaachments.join(),
      onBoardID: onboardID,
      hiringRequestID: getOnboardFormDetails.onboardContractDetails.hR_ID,
      contactID: getOnboardFormDetails.onboardContractDetails.contactID,
      talentID: getOnboardFormDetails.onboardContractDetails.talentID,
      receiver: watch("receiver"),
    };

    const result = await engagementRequestDAO.sendEmailDAO(payload);
    setSendEmail(false)
    console.log("send mail result", result);

    if (result.statusCode === 200) {
      message.success("Email send ");
      resetField("templateType");
      resetField("receiver");
      resetField("fromName");
      resetField("toEmail");
      resetField("replyTo");
      resetField("subject");
      resetField("emailContent");
      setValue("emailContent", "");
      setValue("templateType", "");
      setValue("receiver", "");
      setTemplateData({});
      setISPreview(false)
      setAttachments([])
    }else{
        message.error('Something went wrong!')
    }
  };

  const showPreview = () => {
    setISPreview(true);
  };

  const onFileChangeCapture = async (e) => {
    /*Selected files data can be collected here.*/
    let file = e.target.files[0];
    const formData = new FormData();

    formData.append("Files", file);
    formData.append("IsCompanyLogo", false);
    formData.append("IsCultureImage", false);
    formData.append("Type", "custom_email_attachment");
    setDocUploading(true);
    let Result = await allCompanyRequestDAO.uploadImageDAO(formData);
    setDocUploading(false);
    if (Result.statusCode === HTTPStatusCode.OK) {
      const uploadedUrl = Result?.responseBody[0];
      let updatedContent = watch("emailContent");

      let fileLink = ` <a href="${uploadedUrl}" target="_blank">${file.name}</a>`;
      let contentWithLink = updatedContent + " " + fileLink + " ";
      setAttachments(prev=> [...prev,file.name])
      setValue("emailContent", contentWithLink);
    } else {
      message.error("something went wrong");
    }
  };

  return (
    <div
      className={AddNewClientStyle.onboardDetailsContainer}
      style={{ marginTop: "15px", padding: "15px 25px" }}
    >
      <div
        className={AddNewClientStyle.emailHeaderComp}
        style={{ width: "60%" }}
      >
        <div style={{ width: "30%" }}>
          <HRSelectField
            compStyles={{ marginBottom: "0" }}
            key={"tamplateType"}
            setValue={setValue}
            // searchable={true}
            mode="value"
            isValue={true}
            register={register}
            label={"Template Type"}
            defaultValue={
              watch("templateType") ? watch("templateType") : "please select"
            }
            options={emailMasterValues?.TemplateTypes?.map((i) => ({
              id: i.id,
              value: i.dropdownValue,
            }))}
            name="templateType"
            isError={errors["templateType"] && errors["templateType"]}
            // required
            errorMsg={
              errors?.salesPerson?.message ||
              "Please select hiring request sales person"
            }
          />
        </div>
        <div style={{ width: "30%" }}>
          <HRSelectField
            compStyles={{ marginBottom: "0" }}
            key={"receiver"}
            mode="value"
            setValue={setValue}
            isValue={true}
            // searchable={true}
            register={register}
            label={"Receiver"}
            defaultValue={
              watch("receiver") ? watch("receiver") : "please select"
            }
            options={emailMasterValues?.Receivers?.map((i) => ({
              id: i.id,
              value: i.dropdownValue,
            }))}
            name="receiver"
            isError={errors["receiver"] && errors["receiver"]}
            // required
            errorMsg={
              errors?.salesPerson?.message ||
              "Please select hiring request sales person"
            }
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {watch("templateType") && watch("receiver") && (
            <button
              className={AddNewClientStyle.engagementModalHeaderAddBtn}
              style={{ marginTop: "20px" }}
              onClick={() => {
                getEmailTemplate();
              }}
            >
              Get Template
            </button>
          )}
        </div>
      </div>

      {fetchingTemplate && (
        <div>
          Fetching Template ... <img src={spinGif} alt="loadgif" width={16} />{" "}
        </div>
      )}

      {templateData?.id && (
        <>
          <div className={AddNewClientStyle.emailMainComp}>
            <HRInputField
              register={register}
              errors={errors}
              label={"From Name"}
              name="fromName"
              type={InputType.TEXT}
              placeholder="From name"
              disabled={!templateData?.id}
              required
              validationSchema={{
                required: "Please enter the From Name",
              }}
            />

            <HRInputField
              register={register}
              errors={errors}
              label={"To Email"}
              name="toEmail"
              type={InputType.TEXT}
              placeholder="To email"
              required
              validationSchema={{
                required: "Please enter the to email",
                pattern: {
                  value: EmailRegEx.email,
                  message: "Entered value does not match email format",
                },
              }}
              disabled={!templateData?.id}
            />

            <HRInputField
              register={register}
              errors={errors}
              label={"Reply To"}
              name="replyTo"
              type={InputType.TEXT}
              placeholder="Reply to"
              required
              validationSchema={{
                required: "Please enter the reply to email",
                pattern: {
                  value: EmailRegEx.email,
                  message: "Entered value does not match email format",
                },
              }}
              disabled={!templateData?.id}
            />

            <HRInputField
              register={register}
              errors={errors}
              label={"Subject"}
              name="subject"
              type={InputType.TEXT}
              placeholder="subject"
              required
              validationSchema={{
                required: "Please enter the subject",
              }}
              disabled={!templateData?.id}
            />

            <ReactQuill
              readOnly={!templateData?.id}
              theme="snow"
              className="heightSize"
              value={watch("emailContent")}
              onChange={(val) => {
                let sanitizedContent = sanitizeLinks(val);
                // let _updatedVal = sanitizedContent?.replace(/<img\b[^>]*>/gi, '');
                setValue("emailContent", sanitizedContent);
              }}
              // className={previewClientStyle.reactQuillEdit}
              // required
            />

            {docUploading ? (
              <div>
                Please wait while attachment uploading ...{" "}
                <img src={spinGif} alt="loadgif" width={16} />{" "}
              </div>
            ) : (
              <button
                className={AddNewClientStyle.engagementModalAttachmentBtn}
                onClick={() => {
                  fileRef?.current?.click();
                }}
                disabled={!templateData?.id}
              >
                <AttachmentSVG style={{ width: "24px", height: "24px" }} /> Add
                Attachment
              </button>
            )}

            <input
              type="file"
              ref={fileRef}
              onChangeCapture={onFileChangeCapture}
              style={{ display: "none" }}
            />
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <button
              className={AddNewClientStyle.engagementModalHeaderAddBtn}
              disabled={sendingMail ? sendingMail : !templateData?.id}
              style={{ background: "var(--color-sunlight)", color: "#000" }}
              onClick={handleSubmit(showPreview)}
            >
                {sendingMail ? <> Please wait...{" "}
                <img src={spinGif} alt="loadgif" width={16} /></>: "Preview and Send Email" }
              
            </button>
            <button
              className={AddNewClientStyle.engagementModalHeaderAddBtn}
              disabled={sendingMail ? sendingMail : !templateData?.id}
              onClick={handleSubmit(sendEmail)}
            >
                {sendingMail ? <> Please wait...{" "}
                <img src={spinGif} alt="loadgif" width={16} /></> : "Send Email"}
              
            </button>
          </div>
        </>
      )}

      <Modal
        width="600px"
        centered
        footer={null}
        className="engagementAddFeedbackModal"
        open={isPreview}
        onCancel={() => {
          setISPreview(false);
        }}
      >
        <div>
          <div>
            <p>
              <span style={{ fontWeight: "600" }}>From Name : </span>{" "}
              {watch("fromName")}{" "}
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>To Email : </span>
              {watch("toEmail")}{" "}
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>Reply To : </span>{" "}
              {watch("replyTo")}{" "}
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>Subject : </span>{" "}
              {watch("subject")}{" "}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: watch("emailContent") }}
            ></div>
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <button
              className={AddNewClientStyle.engagementModalHeaderAddBtn}
              disabled={sendingMail ? sendingMail : !templateData?.id}
              style={{ background: "var(--color-sunlight)", color: "#000" }}
              onClick={() => {
                setISPreview(false);
              }}
            >
                 {sendingMail ? <> Please wait...{" "}
                 <img src={spinGif} alt="loadgif" width={16} /></> : "Cancel Preview and Edit"}
              
            </button>
            <button
              className={AddNewClientStyle.engagementModalHeaderAddBtn}
              disabled={sendingMail ? sendingMail : !templateData?.id}
              onClick={handleSubmit(sendEmail)}
            >
               {sendingMail ? <> Please wait...{" "}
               <img src={spinGif} alt="loadgif" width={16} /></> : "Send Email"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmailComponent;
