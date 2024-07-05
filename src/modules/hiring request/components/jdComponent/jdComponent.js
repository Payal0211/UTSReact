import { Modal, Progress, Radio, Space, Spin, Upload, message } from "antd";

import { useEffect, useState } from "react";

import Dragger from "antd/es/upload/Dragger";
import CheckRadioIcon from "assets/svg/CheckRadioIcon.svg";
import pdfsvgrepocom from "assets/svg/pdf-svgrepo-com.svg";
import docxFileImage from "assets/svg/docxFile.svg";
import { AiOutlineCheck, AiOutlineDelete } from "react-icons/ai";
import { HiringRequestsAPI , NetworkInfo, SubDomain } from "constants/network";

import './jdComp.css'
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const JobDescriptionComponent = ({error,helperProps}) => {
 const { setUploadFileData,setValidation,setShowGPTModal,setGPTFileDetails,watch
    ,isHaveJD, setIsHaveJD,textCopyPastData,setTextCopyPastData,parseType,setParseType,getTextDetils
 } = helperProps
    const [isLoading, setIsLoading] = useState(false); 
    const [uploadedFileInfo, setUploadedFileInfo] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadPrecent, setUploadPercent] = useState(0);
    const [uploadFileName, setUploadFileName] = useState("");
    const [isJDDelete, setIsJDDelete] = useState(false);


    const props = {
        name: "file",
        multiple: false,
        action:
        NetworkInfo.NETWORK + SubDomain.HIRING + HiringRequestsAPI.UPLOAD_FILE + `?clientEmail=${watch('clientemail')}` ,
        headers: {
          Authorization: JSON.parse(localStorage.getItem("userSessionInfo"))?.Token,
        },
        beforeUpload: async (file) => {
          // if(userData?.CompanyTypeId === 1){
            // await showConfirm(file);
          // }          
          const MAX_FILE_SIZE = 500 * 1024; // 500 KB in bytes
          const isFileSizeValid = file.size <= MAX_FILE_SIZE;
          if (!isFileSizeValid) {
            message?.error('Max file size 500 KB');
          }
          return isFileSizeValid ? true : Upload.LIST_IGNORE;
        },
        onChange(info) {    
          setTextCopyPastData("");          
          const { status } = info.file;
          if (status === "uploading") {
            setUploading(true);
            setUploadPercent(info.file.percent);
            setUploadFileName(info.file.name);
          }
          if (status === "done") {
            setUploading(false);
            setUploadPercent(0);
            setUploadFileName("");
            if (info.file.response.details) {                            
              message.success(`${info.file.name} file uploaded successfully.`);
              let file = info.file;
              file.name = info.file.response.details.FileName;
             
              setUploadedFileInfo(file);
              setParseType('JDFileUpload');
              setIsJDDelete(false);

              setUploadFileData(file?.name);
          
           
            // setValidation({
            //   ...getValidation,
            //   systemFileUpload: "",
            // });
            setShowGPTModal(true);
            setGPTFileDetails(
                info.file.response.details
            );
        //    console.log("new file Upload", info)
            
            } else {
              message.error(`Something went wrong`);
            }
          } else if (status === "error") {
            setUploading(false);
            setUploadPercent(0);
            setUploadFileName("");
            message.error(`${info.file.response.message}`);
          }
        },
    };
    function byteConverter(bytes, decimals, only) {
        const K_UNIT = 1024;
        const SIZES = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    
        if (bytes === 0) return "0 Byte";
        if (only === "KB")
          return (bytes / K_UNIT).toFixed(decimals) + " KB";

        if (only === "MB")
          return (bytes / (K_UNIT * K_UNIT)).toFixed(decimals) + " MB";
    
        let i = Math.floor(Math.log(bytes) / Math.log(K_UNIT));
        let resp =
          parseFloat((bytes / Math.pow(K_UNIT, i)).toFixed(decimals)) +
          " " +
          SIZES[i];
        return resp;
    }



    return(    
      <>
        <div className="formFields-box">
        {(isLoading) && <Space size="middle">
          <Spin size="large" />
        </Space>
        }
            <div className="formFields-box-inner">
                <h2>
                    Job Description<span>*</span>
                </h2>

                <div className="formFields-wrapper">
                    <div className="row jd-radio">
                    <div className="col-12">
                        <div className="form-group">
                        <Radio.Group
                            className="customradio newradiodes small"
                            name="employmentType"
                            value={isHaveJD}                               
                        >
                            <Radio.Button value={0} onClick={() => setIsHaveJD(0)}>
                            <svg
                                width="18"
                                height="17"
                                viewBox="0 0 18 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                d="M1.65306 1.26172H5.57143V9.64267H1.65306C1.47986 9.64267 1.31375 9.57475 1.19128 9.45385C1.0688 9.33294 1 9.16896 1 8.99798V1.90641C1 1.73543 1.0688 1.57145 1.19128 1.45054C1.31375 1.32964 1.47986 1.26172 1.65306 1.26172Z"
                                stroke="#676767"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                />
                                <path
                                d="M5.57129 9.44391L8.62218 15.7379C9.26949 15.7379 9.8903 15.4727 10.348 15.0005C10.8057 14.5284 11.0629 13.888 11.0629 13.2203V11.3321H15.7841C15.9572 11.3326 16.1283 11.2948 16.286 11.2214C16.4437 11.1479 16.5844 11.0405 16.6985 10.9064C16.8127 10.7723 16.8977 10.6145 16.9478 10.4436C16.998 10.2728 17.0121 10.0929 16.9892 9.91596L16.074 2.36317C16.0369 2.05997 15.8942 1.78102 15.6725 1.57835C15.4508 1.37568 15.1651 1.26314 14.8689 1.26172H5.57129"
                                stroke="#676767"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                />
                            </svg>
                            I have a JD with me
                            <img
                                className="checkIcon"
                                src={CheckRadioIcon}
                                alt="check"
                            />
                            </Radio.Button>

                            <Radio.Button value={1} onClick={() =>{ 
                              setIsHaveJD(1);
                              setParseType("Manual");
                              setTextCopyPastData('');
                              setUploadFileName("");
                              }}>
                            <svg
                                width="18"
                                height="17"
                                viewBox="0 0 18 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                d="M1.65306 1.26172H5.57143V9.64267H1.65306C1.47986 9.64267 1.31375 9.57475 1.19128 9.45385C1.0688 9.33294 1 9.16896 1 8.99798V1.90641C1 1.73543 1.0688 1.57145 1.19128 1.45054C1.31375 1.32964 1.47986 1.26172 1.65306 1.26172Z"
                                stroke="#676767"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                />
                                <path
                                d="M5.57129 9.44391L8.62218 15.7379C9.26949 15.7379 9.8903 15.4727 10.348 15.0005C10.8057 14.5284 11.0629 13.888 11.0629 13.2203V11.3321H15.7841C15.9572 11.3326 16.1283 11.2948 16.286 11.2214C16.4437 11.1479 16.5844 11.0405 16.6985 10.9064C16.8127 10.7723 16.8977 10.6145 16.9478 10.4436C16.998 10.2728 17.0121 10.0929 16.9892 9.91596L16.074 2.36317C16.0369 2.05997 15.8942 1.78102 15.6725 1.57835C15.4508 1.37568 15.1651 1.26314 14.8689 1.26172H5.57129"
                                stroke="#676767"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                />
                            </svg>
                            I don’t have a JD
                            <img
                                className="checkIcon"
                                src={CheckRadioIcon}
                                alt="check"
                            />
                            </Radio.Button>
                        </Radio.Group>
                        </div>
                    </div>
                </div>
                {isHaveJD === 0 ?  <>
                    <h3 className="formFieldsheadind3" style={{marginBottom: '-0.5rem'}}>Upload JD</h3>
                    {uploadedFileInfo === null ? (
                    <Dragger {...props} className="ImageDragdropCustom jobDesUpload">
                      {uploading ? (                            
                        <div className="uploadLoading">
                          <Space wrap className="progressUpload">
                            <Spin size="large" />
                          </Space>
                          <Progress
                            type="circle"
                            percent={uploadPrecent.toFixed(2)}
                          />
                          <h5 className="ant-upload-text">
                            Uploading - {uploadFileName}
                          </h5>
                        </div>
                      ) : (                        
                        <div className="FilesDragAndDrop__area">
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
                                <span>Click to Upload</span> or drag and drop
                            </p>
                            <span>(Supported files : .PDF, .DOC, .DOCX)</span>                            
                        </div>                                              
                      )}
                    </Dragger>
                  ) : (
                    <div className="UploadPreviewBox">
                      <div className="UploadPreviewLeft">
                        <div className="UploadPreviewImg">
                          <img src={uploadedFileInfo?.name?.split(".")[uploadedFileInfo?.name?.split(".").length - 1] === "pdf" ? pdfsvgrepocom: docxFileImage} className="docfile" />
                        </div>
                        <div className="UploadPreviewDetail">
                          <h5>{uploadedFileInfo?.name}</h5>
                          <h6>
                            {uploadedFileInfo?.size ? byteConverter(uploadedFileInfo?.size, 2, "KB") : ""}
                          </h6>
                        </div>
                      </div>
                      <div className="UploadPreviewRight">
                        <div className="uploadFaild">
                          <span
                            className="deleteBtn"
                            onClick={() => {
                              setIsJDDelete(true);
                              setUploadedFileInfo(null);
                              setUploadFileData('');
                            }}
                          >
                            <AiOutlineDelete />
                          </span>
                          <span className="checkBtn">
                            <AiOutlineCheck />
                          </span>
                        </div>                           
                      </div>
                    </div>
                  )}                     
                    <div className="jobDesOrDivider">- OR -</div>
                    <h3 className="formFieldsheadind3">Copy & Paste JD</h3>
                    <div className="Filescopypaste__area">
                      <ReactQuill
                              // bounds={'.quillJD'}
                        theme="snow"
                        className="heightSize"
                        value={textCopyPastData}                         
                        onChange={(val) => {
                        //   let sanitizedContent = sanitizeLinks(val);
                        let sanitizedContent = val;
                          setTextCopyPastData(sanitizedContent);                          
                          setUploadedFileInfo(null);
                          setUploadFileData('');
                          setParseType("Text_Parsing");
                        }}    
                        onBlur={()=>getTextDetils()}                 
                      />
                    </div>
                </> : 
                <div className="noJobDesInfo">
                    No job description? No problem! We'll help you create one. Just fill out the next form and we'll generate a custom job <br/>description based on your input.
                </div>}
                {error?.jobDescription && <span className="error">{error?.jobDescription}</span>}
                </div>
            </div>
        </div>        
      </>

    )
}

export default JobDescriptionComponent;