import React, { useState, useEffect } from "react";
import AddNewClientStyle from "./addclient.module.css";
import { ReactComponent as EditSVG } from "assets/svg/EditField.svg";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { InputType, EmailRegEx, ValidateFieldURL } from "constants/application";
import { useFieldArray, useForm } from "react-hook-form";
import TextEditor from "shared/components/textEditor/textEditor";
import { Checkbox, message, Select, Radio } from "antd";

function EngagementSection({
  register,
  errors,
  setValue,
  watch,
  engagementDetails,
}) {
  const [payPerError, setPayPerError] = useState(false);
  const [typeOfPricing, setTypeOfPricing] = useState(null);
  const [profileSharingOption, setProfileSharingOption] = useState(null);
  const [profileSharingOptionError, setProfileSharingOptionError] =
    useState(false);
  const [pricingTypeError, setPricingTypeError] = useState(false);

  const [checkPayPer, setCheckPayPer] = useState({
    companyTypeID: 0,
    anotherCompanyTypeID: 0,
  });
  const [IsChecked, setIsChecked] = useState({
    isPostaJob: false,
    isProfileView: false,
  });
  const [creditError, setCreditError] = useState(false);
  const [errorCurrency, seterrorCurrency] = useState(false);

  let _currency = watch("creditCurrency");

  useEffect(() => {
    engagementDetails?.companyTypeID &&
      setCheckPayPer({
        ...checkPayPer,
        companyTypeID: engagementDetails?.companyTypeID,
      });

    engagementDetails?.creditCurrency &&
      setValue("creditCurrency", engagementDetails?.creditCurrency);
    engagementDetails?.creditAmount &&
      setValue("creditAmount", engagementDetails?.creditAmount);
    engagementDetails?.jpCreditBalance &&
      setValue("freeCredit", engagementDetails?.jpCreditBalance);

    if (engagementDetails?.companyID) {
      setIsChecked({
        isPostaJob: engagementDetails?.isPostaJob,
        isProfileView: engagementDetails?.isProfileView,
      });
      if (engagementDetails?.isPostaJob) {
        engagementDetails?.jobPostCredit &&
          setValue("jobPostCredit", engagementDetails?.jobPostCredit);
      }

      if (engagementDetails?.isProfileView) {
        engagementDetails?.vettedProfileViewCredit &&
          setValue(
            "vettedProfileViewCredit",
            engagementDetails?.vettedProfileViewCredit
          );
        engagementDetails?.nonVettedProfileViewCredit &&
          setValue(
            "nonVettedProfileViewCredit",
            engagementDetails?.nonVettedProfileViewCredit
          );
      }
    }
  }, [engagementDetails]);

  return (
    <div className={AddNewClientStyle.tabsFormItem}>
      <div className={AddNewClientStyle.tabsFormItemInner}>
        <div className={AddNewClientStyle.tabsLeftPanel}>
          <h3>Engagement Details</h3>
        </div>

        <div className={AddNewClientStyle.tabsRightPanel}>
          <div className={AddNewClientStyle.row}>
            <div className={AddNewClientStyle.colMd6}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "32px",
                }}
              >
                <label style={{ marginBottom: "12px" }}>
                  Client Model
                  <span className={AddNewClientStyle.reqField}>*</span>
                </label>
                {payPerError && (
                  <p className={AddNewClientStyle.error}>
                    *Please select client model
                  </p>
                )}
                {/* {pricingTypeError && <p className={AddNewClientStyle.error}>*Please select pricing type</p>} */}
                <div className={AddNewClientStyle.payPerCheckboxWrap}>
                  <Checkbox
                    value={2}
                    onChange={(e) => {
                      setCheckPayPer({
                        ...checkPayPer,
                        companyTypeID:
                          e.target.checked === true ? e.target.value : 0,
                      });
                      setPayPerError(false);
                      setIsChecked({
                        ...IsChecked,
                        isPostaJob: false,
                        isProfileView: false,
                      });
                    }}
                    checked={checkPayPer?.companyTypeID}
                  >
                    Pay Per Credit
                  </Checkbox>
                  <Checkbox
                    value={1}
                    onChange={(e) => {
                      setCheckPayPer({
                        ...checkPayPer,
                        anotherCompanyTypeID:
                          e.target.checked === true ? e.target.value : 0,
                      });
                      setPayPerError(false);
                      setTypeOfPricing(null);
                    }}
                    checked={checkPayPer?.anotherCompanyTypeID}
                  >
                    Pay Per Hire
                  </Checkbox>
                </div>
              </div>
            </div>

            <div className={AddNewClientStyle.colMd6}>
              {!(
                checkPayPer?.anotherCompanyTypeID == 0 &&
                (checkPayPer?.companyTypeID == 0 ||
                  checkPayPer?.companyTypeID == 2)
              ) && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "32px",
                  }}
                >
                  <label style={{ marginBottom: "12px" }}>
                    Type Of Pricing
                    <span className={AddNewClientStyle.reqField}>*</span>
                  </label>
                  {pricingTypeError && (
                    <p className={AddNewClientStyle.error}>
                      *Please select pricing type
                    </p>
                  )}
                  <Radio.Group
                    disabled={
                      // userData?.LoggedInUserTypeID !== 1 ||
                      checkPayPer?.anotherCompanyTypeID == 0 &&
                      (checkPayPer?.companyTypeID == 0 ||
                        checkPayPer?.companyTypeID == 2)
                    }
                    onChange={(e) => {
                      setTypeOfPricing(e.target.value);
                      setPricingTypeError && setPricingTypeError(false);
                    }}
                    value={typeOfPricing}
                  >
                    <Radio value={1}>Transparent Pricing</Radio>
                    <Radio value={0}>Non Transparent Pricing</Radio>
                  </Radio.Group>
                </div>
              )}
            </div>
          </div>

          {checkPayPer?.companyTypeID !== 0 &&
            checkPayPer?.companyTypeID !== null && (
              <>
                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd6}>
                    <label className={AddNewClientStyle.label}>
                      Currency
                      <span className={AddNewClientStyle.reqField}>*</span>
                    </label>
                    <Select
                      onChange={(e) => {
                        setValue("creditCurrency", e);
                        seterrorCurrency(false);
                      }}
                      name="creditCurrency"
                      value={_currency}
                      placeholder={"Select currency"}
                    >
                      <Select.Option value="INR">INR</Select.Option>
                      <Select.Option value="USD">USD</Select.Option>
                    </Select>
                    {errorCurrency && (
                      <p
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                        className={AddNewClientStyle.error}
                      >
                        * Please select currency
                      </p>
                    )}
                  </div>
                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      label="Per credit amount"
                      name="creditAmount"
                      type={InputType.NUMBER}
                      placeholder="Enter per credit amount"
                      required={
                        checkPayPer?.companyTypeID !== 0 &&
                        checkPayPer?.companyTypeID !== null
                          ? true
                          : false
                      }
                      validationSchema={{
                        required:
                          checkPayPer?.companyTypeID !== 0 &&
                          checkPayPer?.companyTypeID !== null
                            ? "Please enter Per credit amount."
                            : null,
                      }}
                    />
                  </div>
                </div>

                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd6}>
                    <div className={AddNewClientStyle.FreecreditFieldWrap}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        className="yourClassName"
                        validationSchema={{
                          required:
                            checkPayPer?.companyTypeID !== 0 &&
                            checkPayPer?.companyTypeID !== null
                              ? "Please enter free credits."
                              : null,
                          min: {
                            value: 0,
                            message: `please don't enter the value less than 0`,
                          },
                          max: {
                            value: 99,
                            message: `please don't enter the value greater than 99`,
                          },
                        }}
                        onKeyDownHandler={(e) => {
                          if (
                            e.key === "-" ||
                            e.key === "+" ||
                            e.key === "E" ||
                            e.key === "e"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        // label={`Free Credits Balance Credit : ${companyDetail?.jpCreditBalance}`}
                        name={"freeCredit"}
                        label="Free Credit"
                        type={InputType.NUMBER}
                        placeholder="Enter number of free credits"
                        required={
                          checkPayPer?.companyTypeID !== 0 &&
                          checkPayPer?.companyTypeID !== null
                            ? true
                            : false
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd6}></div>
                </div>
                <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd12}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        className={AddNewClientStyle.payPerCheckboxWrap}
                        style={{ marginBottom: "16px" }}
                      >
                        <Checkbox
                          name="IsPostaJob"
                          checked={IsChecked?.isPostaJob}
                          onChange={(e) => {
                            setIsChecked({
                              ...IsChecked,
                              isPostaJob: e.target.checked,
                            });
                            setCreditError(false);
                          }}
                        >
                          Credit per post a job.
                        </Checkbox>
                        <Checkbox
                          name="IsProfileView"
                          checked={IsChecked?.isProfileView}
                          onChange={(e) => {
                            setIsChecked({
                              ...IsChecked,
                              isProfileView: e.target.checked,
                            });
                            setCreditError(false);
                            setProfileSharingOption(null);
                            setProfileSharingOptionError(false);
                          }}
                        >
                          Credit per profile view.
                        </Checkbox>
                      </div>
                      {creditError && (
                        <p className={AddNewClientStyle.error}>
                          *Please select option
                        </p>
                      )}

                      <div className={AddNewClientStyle.row}>
                        {IsChecked?.isPostaJob ? (
                          <div className={AddNewClientStyle.colMd6}>
                            <HRInputField
                              register={register}
                              errors={errors}
                              label="Credit per post a job"
                              name="jobPostCredit"
                              type={InputType.NUMBER}
                              placeholder="Enter credit per post a job"
                              required={IsChecked?.isPostaJob ? true : false}
                              validationSchema={{
                                required: IsChecked?.isPostaJob
                                  ? "Please enter credit per post a job."
                                  : null,
                              }}
                            />
                          </div>
                        ) : (
                          <div className={AddNewClientStyle.colMd4}></div>
                        )}

                        {IsChecked?.isProfileView && (
                          <>
                            <div className={AddNewClientStyle.colMd6}>
                              <HRInputField
                                register={register}
                                errors={errors}
                                label="Credit for viewing vetted profile"
                                name="vettedProfileViewCredit"
                                type={InputType.NUMBER}
                                placeholder="Enter credit cost for unlocking one vetted profile"
                                required={
                                  IsChecked?.isProfileView ? true : false
                                }
                                validationSchema={{
                                  required: IsChecked?.isProfileView
                                    ? "Please enter vetted profile credit."
                                    : null,
                                }}
                              />
                            </div>
                            <div className={AddNewClientStyle.colMd6}>
                              <HRInputField
                                register={register}
                                errors={errors}
                                label="Credit for Viewing non vetted profile"
                                name="nonVettedProfileViewCredit"
                                type={InputType.NUMBER}
                                placeholder="Enter credit cost for unlocking one non vetted profile"
                                required={
                                  IsChecked?.isProfileView ? true : false
                                }
                                validationSchema={{
                                  required: IsChecked?.isProfileView
                                    ? "Please enter non vetted profile credit."
                                    : null,
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}

export default EngagementSection;
