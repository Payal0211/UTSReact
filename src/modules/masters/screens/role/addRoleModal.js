import { InputType } from "constants/application";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import addRoleStyle from "./addrole.module.css";
import { ReactComponent as MinusSVG } from "assets/svg/minus.svg";
import { ReactComponent as PlusSVG } from "assets/svg/plus.svg";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { useParams } from "react-router-dom";
import { HTTPStatusCode } from "constants/network";
import SpinLoader from "shared/components/spinLoader/spinLoader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MasterDAO } from "core/master/masterDAO";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import UploadModal from "shared/components/uploadModal/uploadModal";
import { ReactComponent as UploadSVG } from "assets/svg/upload.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { message } from "antd";

const AddNewRole = ({
  updateTR,
  setUpdateTR,
  onCancel,
  apiData,
  allApiData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const [showUploadModal, setUploadModal] = useState(false);
  const [getUploadFileData, setUploadFileData] = useState("");
  const [getValidation, setValidation] = useState({
    systemFileUpload: "",
    googleDriveFileUpload: "",
    linkValidation: "",
  });

  const onSubmit = async (d) => {
    setIsLoading(true);
    let payload = { roleName: d.roleName, fileName: getUploadFileData };
    let result = await MasterDAO.addRoleDAO(payload);
    console.log("add res", result);
    if (result.statusCode === HTTPStatusCode.ok) {
      window.location.reload();
    }

    if (result.statusCode === HTTPStatusCode.BAD_REQUEST) {
      message.error(result.responseBody);
    }
    setIsLoading(false);
  };

  const uploadFileHandler = useCallback(
    async (e) => {
      setIsLoading(true);
      let fileData = e.target.files[0];

      if (
        fileData?.type !== "image/png" &&
        fileData?.type !== "image/jpeg" &&
        fileData?.type !== "image/jpg"
      ) {
        setValidation({
          ...getValidation,
          systemFileUpload:
            "Uploaded file is not a valid, Only  jpg, jpeg, png files are allowed",
        });
        setIsLoading(false);
      } else if (fileData?.size >= 500000) {
        setValidation({
          ...getValidation,
          systemFileUpload:
            "Upload file size more than 500kb, Please Upload file upto 500kb",
        });
        setIsLoading(false);
      } else {
        console.log("file", e.target.files[0]);
        let formData = new FormData();
        formData.append("file", e.target.files[0]);

        let uploadFileResponse = await MasterDAO.uploadRoalIconDAO(formData);
        if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
          if (
            fileData?.type === "image/png" ||
            fileData?.type === "image/jpeg"
          ) {
            setUploadFileData(fileData?.name);
            setUploadModal(false);
            setValidation({
              ...getValidation,
              systemFileUpload: "",
            });
            // setJDParsedSkills(
            // 	uploadFileResponse && uploadFileResponse?.responseBody?.details,
            // );
            message.success("File uploaded successfully");
          } else if (
            fileData?.type === "application/pdf" ||
            fileData?.type === "application/docs" ||
            fileData?.type === "application/msword" ||
            fileData?.type === "text/plain" ||
            fileData?.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            setUploadFileData(fileData?.name);
            setValue("sowDocumentLink", fileData?.name);
            setUploadModal(false);
            setValidation({
              ...getValidation,
              systemFileUpload: "",
            });
            message.success("File uploaded successfully");
          }
        }
        setIsLoading(false);
      }
    },
    [getValidation]
  );

  useEffect(() => {
    return () => setIsLoading(false);
  }, []);

  return (
    <div className={addRoleStyle.engagementModalContainer}>
      <div className={addRoleStyle.updateTRTitle}>
        <h2>Add New Role</h2>
      </div>

      {isLoading ? (
        <SpinLoader />
      ) : (
        <>
          <div className={addRoleStyle.row}>
            <div className={addRoleStyle.colMd12}>
              <HRInputField
                register={register}
                errors={errors}
                label="Role"
                name="roleName"
                type={InputType.TEXT}
                placeholder="Role name"
                validationSchema={{
                  required: "please enter role name.",
                  //   min: 1
                }}
                // isError={errors["roleName"] && errors["roleName"]}
                // errorMsg={"Please enter role name."}
                required
              />
            </div>
            <div className={addRoleStyle.colMd12}>
              {!getUploadFileData ? (
                <HRInputField
                  // disabled={jdURLLink}
                  register={register}
                  leadingIcon={
                    <UploadSVG onClick={() => setUploadModal(true)} />
                  }
                  label="Front Icon Image"
                  name="roalIcon"
                  type={InputType.TEXT}
                  // buttonLabel="Upload Document or Add Link"
                  placeholder="Upload Icon"
                  setValue={setValue}
                  // required={!jdURLLink && !getUploadFileData}
                  // onClickHandler={() => setUploadModal(true)}
                  // validationSchema={{
                  //     required: 'please select a file.',
                  // }}
                  errors={errors}
                />
              ) : (
                <div className={addRoleStyle.uploadedJDWrap}>
                  <label>Front Icon Image</label>
                  <div className={addRoleStyle.uploadedJDName}>
                    {getUploadFileData}{" "}
                    <CloseSVG
                      className={addRoleStyle.uploadedJDClose}
                      onClick={() => {
                        setUploadFileData("");
                      }}
                    />
                  </div>
                </div>
              )}

              {showUploadModal && (
                <UploadModal
                  isGoogleDriveUpload={false}
                  isLoading={isLoading}
                  uploadFileHandler={uploadFileHandler}
                  // googleDriveFileUploader={() => googleDriveFileUploader()}
                  // uploadFileFromGoogleDriveLink={uploadFileFromGoogleDriveLink}
                  modalTitle={"UPLOAD ICON"}
                  modalSubtitle={" "}
                  isFooter={false}
                  openModal={showUploadModal}
                  setUploadModal={setUploadModal}
                  cancelModal={() => setUploadModal(false)}
                  setValidation={setValidation}
                  getValidation={getValidation}
                  // getGoogleDriveLink={getGoogleDriveLink}
                  // setGoogleDriveLink={setGoogleDriveLink}
                />
              )}
            </div>
          </div>

          <div className={addRoleStyle.formPanelAction}>
            <button
              onClick={() => {
                onCancel();
              }}
              className={addRoleStyle.btn}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={addRoleStyle.btnPrimary}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddNewRole;
