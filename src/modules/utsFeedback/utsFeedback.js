import React, { useState, useRef, useCallback } from "react";
import utsFeedbackStyles from "./utsFeedback.module.css";

import DarkThumbSVG from "assets/svg/dark-thumbs.svg";
import NoPrioritySVG from "assets/svg/star-inactive.svg";
import PrioritySVG from "assets/svg/star-active.svg";
import RemoveSVG from "assets/svg/close.svg";

import { Modal, Divider, message, Skeleton } from "antd";
import { useForm } from "react-hook-form";
import { InputType } from "constants/application";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { userDAO } from "core/user/userDAO";
import { HTTPStatusCode } from "constants/network";

export default function UTSFeedback() {
  const [isHovered, setIsHovered] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const fileRef = useRef(null);
  const [getUploadFileData, setUploadFileData] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [fileError, setFileError] = useState({ isError: false, message: "" });
  const [ratingError, setRatingError] = useState({
    isError: false,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    resetField,
    formState: { errors },
  } = useForm();

  const handleHover = () => {
    setIsHovered(true);
    setTimeout(() => {
      setIsHovered(false);
    }, 5000);
  };

  const convertToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }, []);

  const handleFileUpload = async (event) => {
    setFileError({ isError: false, message: "" });
    const file = event.target.files[0];

    const fsize = file.size;
    const filesize = Math.round(fsize / 1024);

    if (file?.type.includes("video/")) {
      if (filesize > 5120) {
        setFileError({
          isError: true,
          message: "* Video Size larger then 5MB not allowed",
        });
        return;
      }
    }
    if (file?.type.includes("image/")) {
      if (filesize > 2048) {
        setFileError({
          isError: true,
          message: "* Image Size larger then 2MB not allowed",
        });
        return;
      }
    }
    const base64 = await convertToBase64(file);
    setBase64Image(base64);
    setUploadFileData(event.target.files[0].name);
  };

  const detectBrowser = (userAgent) => {
    if (userAgent.indexOf("Firefox") > -1) {
      return "Mozilla Firefox";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
      return "Opera";
    } else if (userAgent.indexOf("Chrome") > -1) {
      return "Google Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
      return "Safari";
    } else if (userAgent.indexOf("Trident") > -1) {
      return "Microsoft Internet Explorer";
    } else {
      return "Unknown";
    }
  };

  const detectBrowserVersion = (userAgent) => {
    const browserName = detectBrowser(userAgent);
    const start = userAgent.indexOf(browserName) + browserName.length + 1;
    const end = userAgent.indexOf(" ", start);
    return userAgent.substring(start, end);
  };

  const submitFeedback = async (d) => {
    setIsLoading(true);
    setRatingError({ isError: false, message: "" });
    // User/UTSFeedBack
    if (!d.rating) {
      setRatingError({ isError: true, message: "* Please select rating" });
      setIsLoading(false);
      return;
    }


    const userAgent = window.navigator.userAgent;
    const browserName = detectBrowser(userAgent);
    const browserVersion = detectBrowserVersion(userAgent);
    const platform = window.navigator.platform;

    const payload = {
      ratingStar: d.rating,
      feedback: d.message,
      Browser: `${browserName}, ${browserVersion}, ${platform} `,
      PageUrl: window.location.href,
      fileUpload: {
        base64ProfilePic: base64Image ? base64Image : "",
        extenstion: getUploadFileData ? getUploadFileData.split(".")[getUploadFileData.split(".").length - 1] : "",
      },
    };

    const result = await userDAO.submitUTSFeedbackDAO(payload);

    if (result?.statusCode === HTTPStatusCode.OK) {
      message.success(result?.responseBody.message);
      resetField("rating");
      setValue('rating', null)
      resetField("message");
      setBase64Image("");
      setUploadFileData("");
      setIsLoading(false);
      setShowFeedbackModal(false);

    }
    setIsLoading(false);
  };

  return (
    <>
      <button
        className={utsFeedbackStyles.feedbackBotton}
        onClick={() => setShowFeedbackModal(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() =>
          setTimeout(() => {
            setIsHovered(false);
          }, 5000)
        }
      >
        {" "}
        {isHovered ? (
          "UTS Feedback"
        ) : (
          <img src={DarkThumbSVG} alt="icon" width={"20px"} />
        )}{" "}
      </button>

     <Modal
        width={"700px"}
        centered
        
        footer={false}
        open={showFeedbackModal}
        //  className="cloneHRConfWrap"
        closable={false}
        // onCancel={() => setShowFeedbackModal(false)}
      >
        <div>
          <div className={utsFeedbackStyles.headerclass}>
            <h2>Submit UTS Feedback</h2>
          <img src={RemoveSVG} alt="icon" width={"25px"} onClick={()=> setShowFeedbackModal(false)} />
          </div>
          
          <Divider style={{ margin: "10px 0" }} dashed />

          {isLoading ? (
            <Skeleton />
          ) : (
            <div className={utsFeedbackStyles.row}>
              <div className={utsFeedbackStyles.colMd12}>
                <label className={utsFeedbackStyles.labelclass}>
                  Rating
                  <span className={utsFeedbackStyles.reqField}>*</span>
                </label>
                {ratingError.isError && !watch("rating") && (
                  <p className={utsFeedbackStyles.error}>
                    {ratingError.message}
                  </p>
                )}
                <div className={utsFeedbackStyles.ratingBox}>
                  <div onClick={() => setValue("rating", 1)}>
                    {watch("rating") >= 1 ? (
                      <img src={PrioritySVG} alt="icon" width={"40px"} />
                    ) : (
                      <img src={NoPrioritySVG} alt="icon" width={"40px"} />
                    )}
                  </div>

                  <div onClick={() => setValue("rating", 2)}>
                    {watch("rating") >= 2 ? (
                      <img src={PrioritySVG} alt="icon" width={"40px"} />
                    ) : (
                      <img src={NoPrioritySVG} alt="icon" width={"40px"} />
                    )}
                  </div>

                  <div onClick={() => setValue("rating", 3)}>
                    {watch("rating") >= 3 ? (
                      <img src={PrioritySVG} alt="icon" width={"40px"} />
                    ) : (
                      <img src={NoPrioritySVG} alt="icon" width={"40px"} />
                    )}
                  </div>

                  <div onClick={() => setValue("rating", 4)}>
                    {watch("rating") >= 4 ? (
                      <img src={PrioritySVG} alt="icon" width={"40px"} />
                    ) : (
                      <img src={NoPrioritySVG} alt="icon" width={"40px"} />
                    )}
                  </div>

                  <div onClick={() => setValue("rating", 5)}>
                    {watch("rating") === 5 ? (
                      <img src={PrioritySVG} alt="icon" width={"40px"} />
                    ) : (
                      <img src={NoPrioritySVG} alt="icon" width={"40px"} />
                    )}
                  </div>
                </div>
              </div>
              <div className={utsFeedbackStyles.colMd12}>
                {/* <label>
                Message
                <span className={utsFeedbackStyles.reqField}>*</span>
              </label>
              <input type="textBox" placeholder="Message" /> */}
                <HRInputField
                  register={register}
                  label="Message"
                  name="message"
                  type={InputType.TEXT}
                  required={true}
                  placeholder="Enter message"
                  isTextArea={true}
                  rows={4}
                  validationSchema={{
                    required: "please enter message.",
                  }}
                  errors={errors}
                />
              </div>

              <div className={utsFeedbackStyles.colMd12}>
                <label>Screenshot</label>
                {fileError.isError && (
                  <p className={utsFeedbackStyles.error}>{fileError.message}</p>
                )}
                <div
                  className={utsFeedbackStyles.fileSelector}                
                >
                  <p>{getUploadFileData ? getUploadFileData : "Choose File"}</p>
                  <div onClick={() => {
                    if (getUploadFileData) {
                      setBase64Image("");
                      setUploadFileData("");
                      return;
                    }
                    fileRef?.current?.click();
                  }}>{getUploadFileData ? (
                    <img src={RemoveSVG} alt="icon" width={"40px"} />
                  ) : (
                    <button>Browse</button>
                  )}</div>
                 
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  id="screenshort"
                  accept="image/png, image/jpeg,video/*"
                  onChange={(event) => {
                    handleFileUpload(event);
                  }}
                />
              </div>
            </div>
          )}

          <Divider style={{ margin: "10px 0" }} dashed />

          <div className={utsFeedbackStyles.actions}>
            <button
              className={utsFeedbackStyles.close}
              onClick={() => setShowFeedbackModal(false)}
            >
              Close
            </button>
            <button
              className={utsFeedbackStyles.submit}
              disabled={isLoading}
              onClick={handleSubmit(submitFeedback)}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>

   
    </>
  );
}
