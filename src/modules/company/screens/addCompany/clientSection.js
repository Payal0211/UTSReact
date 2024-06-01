import React, { useState, useMemo, useEffect, useCallback } from "react";
import AddNewClientStyle from "./addclient.module.css";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { InputType, EmailRegEx, ValidateFieldURL } from "constants/application";

import {
  clientFormDataFormatter,
  getFlagAndCodeOptions,
} from "modules/client/clientUtils";
import { MasterDAO } from "core/master/masterDAO";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import { HTTPStatusCode } from "constants/network";
import { Skeleton } from "antd";
import ConfirmationModal from "modules/client/components/addClient/confirmationResendEmailModal";

export const secondaryClient = {
  clientProfilePic: "",
  companyID: 0,
  contactNo: "",
  designation: "",
  emailID: "",
  firstName: "",
  fullName: "",
  id: 0,
  isPrimary: false,
  lastName: "",
  linkedIn: "",
  resendInviteEmail: false,
  roleID: 3,
  countryCode: "",
  isNewClient:true
};

function ClientSection({
  register,
  errors,
  setValue,
  watch,
  fields,
  append,
  remove,
  contactDetails,
  accessTypes,
  companyID,
  clearErrors,
  setError,
  loadingDetails,
  setDisableSubmit,
}) {
  const [flagAndCode, setFlagAndCode] = useState([]);
  const [controlledRoleId, setControlledRoleId] = useState([]);
  const [showConfirmationModal, setConfirmationModal] = useState(false);
  const [clientID, setClientID] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const getCodeAndFlag = async () => {
    const getCodeAndFlagResponse = await MasterDAO.getCodeAndFlagRequestDAO();
    setFlagAndCode(
      getCodeAndFlagResponse && getCodeAndFlagResponse.responseBody
    );
  };

  useEffect(() => {
    remove();
    if (contactDetails?.length > 0) {
      contactDetails?.forEach((contact) => {
        let phoneDetails = {
          contactNo: "",
          countryCode: "",
        };

        if (contact?.contactNo) {
          if (contact?.contactNo?.includes("+91")) {
            phoneDetails.contactNo = contact?.contactNo?.slice(3);
            phoneDetails.countryCode = contact?.contactNo?.slice(0, 3);
          } else {
            phoneDetails.contactNo = contact?.contactNo;
          }
        }
        append({
          ...secondaryClient,
          ...contact,
          _id: contact.id,
          isNewClient:false,
          ...phoneDetails,
        });
      });
    } else {
      append({ ...secondaryClient, roleID: 1, isPrimary: true });
    }
  }, [contactDetails]);

  const onAddNewClient = useCallback(
    (e) => {
      e.preventDefault();
      append({ ...secondaryClient });
    },
    [append]
  );
  const onRemoveAddedClient = useCallback(
    (e, index) => {
      e.preventDefault();
      remove(index);
    },
    [remove]
  );

  useEffect(() => {
    if (accessTypes?.length > 0 && fields?.length > 0) {
      setControlledRoleId([]);
      fields?.forEach((field) => {
        setControlledRoleId((prev) => [
          ...prev,
          accessTypes?.find((val) => val.id === field.roleID)?.value,
        ]);
      });
    }
  }, [accessTypes, fields]);

  const flagAndCodeMemo = useMemo(
    () => getFlagAndCodeOptions(flagAndCode),
    [flagAndCode]
  );

  useEffect(() => {
    getCodeAndFlag();
  }, []);

  const validateCompanyName = async (index) => {
    let payload = {
      workEmail: watch(`clientDetails.[${index}].emailID`),
      companyName: watch("companyName"),
      currentCompanyID: +companyID,
    };

    const result = await allCompanyRequestDAO.validateClientCompanyDAO(payload);

    if (result.statusCode === HTTPStatusCode.OK) {
      clearErrors(`clientDetails.[${index}].emailID`);
      setDisableSubmit(false);
    }
    if (result.statusCode === HTTPStatusCode.BAD_REQUEST) {
      setDisableSubmit(true);
      setError(`clientDetails.[${index}].emailID`, {
        type: "manual",
        message: result?.responseBody,
      });
    }
  };

  return (
    <div className={AddNewClientStyle.tabsFormItem}>
      {loadingDetails ? (
        <Skeleton active />
      ) : (
        fields?.map((item, index) => {
          return (
            <div className={AddNewClientStyle.tabsFormItemInner}>
              <div className={AddNewClientStyle.tabsLeftPanel}>
                <h3>Client Details {index > 0 && `- ${index}`}</h3>

                <div className={AddNewClientStyle.leftPanelAction}>
                  {index === 0 && fields?.length === 1 && (
                    <button
                      type="button"
                      className={AddNewClientStyle.btn}
                      onClick={(e) => onAddNewClient(e)}
                    >
                      Add Another Client
                    </button>
                  )}

                  {index > 0 && index + 1 === fields?.length && (
                    <>
                      <button
                        type="button"
                        className={AddNewClientStyle.btn}
                        onClick={(e) => onAddNewClient(e)}
                      >
                        Add Another Client
                      </button>


                      {item?.isNewClient && <button
                        type="button"
                        className={AddNewClientStyle.btn}
                        onClick={(e) => onRemoveAddedClient(e, index)}
                      >
                        Remove
                      </button>}
                      
                    </>
                  )}
                </div>
              </div>

              <div className={AddNewClientStyle.tabsRightPanel}>
                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      // isError={!!errors?.clientDetails?.[index]?.fullName}
                      errors={errors?.clientDetails?.[index]?.fullName}
                      label="Client Full Name"
                      name={`clientDetails.[${index}].fullName`}
                      type={InputType.TEXT}
                      validationSchema={{
                        required: "Please enter the Client Name",
                      }}
                      // errorMsg="Please enter the Client Name."
                      placeholder="Enter Client Name"
                      required={true}
                      disabled={false}
                      forArrayFields={true}
                    />
                  </div>

                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      //								disabled={isLoading}
                      register={register}
                      errors={errors?.clientDetails?.[index]?.emailID}
                      validationSchema={{
                        required: `Please enter the client email ID.`,
                        pattern: {
                          value: EmailRegEx.email,
                          message: "Entered value does not match email format",
                        },
                      }}
                      label="Work Email"
                      name={`clientDetails.[${index}].emailID`}
                      onBlurHandler={() => {
                        if (
                          errors?.clientDetails?.[index]?.emailID &&
                          !errors?.clientDetails?.[index]?.emailID?.message.includes('This work email :') 
                           
                        ) {
                          return;
                        }

                        let eReg = new RegExp(EmailRegEx.email);

                        if (
                          item?.emailID !==
                            watch(`clientDetails.[${index}].emailID`) &&
                          eReg.test(watch(`clientDetails.[${index}].emailID`))
                        ) {
                          validateCompanyName(index);
                        } else {
                          clearErrors(`clientDetails.[${index}].emailID`);
                          setDisableSubmit(false);
                        }
                      }}
                      type={InputType.EMAIL}
                      placeholder="Enter Email ID "
                      required
                      forArrayFields={true}
                    />
                  </div>
                </div>

                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      // errors={errors}
                      label="Designation"
                      name={`clientDetails.[${index}].designation`}
                      type={InputType.TEXT}
                      placeholder="Enter Client Designation"
                    />
                  </div>

                  <div className={AddNewClientStyle.colMd6}>
                    <HRSelectField
                      isControlled={true}
                      controlledValue={controlledRoleId[index]}
                      setControlledValue={(val) =>
                        setControlledRoleId((prev) => {
                          let newControlled = [...prev];
                          newControlled[index] = val;
                          return newControlled;
                        })
                      }
                      setValue={setValue}
                      mode={"id"}
                      register={register}
                      name={`clientDetails.[${index}].roleID`}
                      label="Access Type"
                      defaultValue="Choose Access Type"
                      options={accessTypes?.map((item) => ({
                        id: item.id,
                        value: item.value,
                      }))}
                    />
                  </div>
                </div>

                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd6}>
                    <div className={AddNewClientStyle.label}>Phone number</div>
                    <div style={{ display: "flex" }}>
                      <div className={AddNewClientStyle.phoneNoCode}>
                        <HRSelectField
                          searchable={true}
                          setValue={setValue}
                          register={register}
                          name={`clientDetails.[${index}].countryCode`}
                          defaultValue="+91"
                          options={flagAndCodeMemo}
                        />
                      </div>
                      <div className={AddNewClientStyle.phoneNoInput}>
                        <HRInputField
                          register={register}
                          name={`clientDetails.[${index}].contactNo`}
                          type={InputType.NUMBER}
                          placeholder="Enter Phone number"
                        />
                      </div>
                    </div>
                  </div>

                  {companyID !== "0" && (
                    <div className={AddNewClientStyle.colMd6}>
                      {item?.resendInviteEmail === true && (
                        <button
                          type="submit"
                          onClick={() => {
                            // resendInviteEmailAPI(item?.ID);
                            setClientID(item?._id);
                            setConfirmationModal(true);
                          }}
                          className={AddNewClientStyle.btnPrimaryResendBtn}
                        >
                          Send / Resend Invite Email
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
      <ConfirmationModal
        setConfirmationModal={setConfirmationModal}
        showConfirmationModal={showConfirmationModal}
        clientID={clientID}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />
    </div>
  );
}

export default ClientSection;
