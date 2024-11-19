import React, { useState, useEffect, useCallback } from "react";
import AddNewClientStyle from "./addclient.module.css";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { InputType,EmailRegEx } from "constants/application";
import { Checkbox, Select, Radio, Skeleton } from "antd";

export default function CompanyConfirmationFields({setConfidentialInfo,confidentialInfo,errors,register,watch,fields}) {
  return (
    <>
              
              <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "32px",
                  }}
                >
                  <label className={AddNewClientStyle.label} style={{ marginBottom: "8px" }}>
                  Do you wish to keep client information confidential to candidate ?
                  {/* <span className={AddNewClientStyle.reqField}>*</span> */}
                  </label>
                  {/* {pricingTypeError && (
                    <p className={AddNewClientStyle.error}>
                      *Please select pricing type
                    </p>
                  )} */}
                  <Radio.Group
                   
                    onChange={(e) => {
                      setConfidentialInfo(e.target.value);
                     
                    }}
                    value={confidentialInfo}
                  >
                    <Radio value={1}>Yes</Radio>
                    <Radio value={0}>No</Radio>
                  </Radio.Group>
                </div>

                { confidentialInfo === 1 && <>
                  <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      label="Company Name"
                      name="companyName"
                      type={InputType.TEXT}
                      validationSchema={{
                        required: "Please enter the Company Name",
                      }}
                      placeholder="Enter Name"
                      required
                    />
                  </div>

                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      label="Company Name Alias"
                      name="companyNameAlias"
                      type={InputType.TEXT}
                      validationSchema={{
                        required: "Please enter the Company Name Alias",
                      }}
                      placeholder="Enter Alias"
                      required
                    />
                  </div>
                  </div>

                  <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      label="Company Logo"
                      name="companyLogo"
                      type={InputType.TEXT}
                      // validationSchema={{
                      //   required: "Please enter the Company Name",
                      // }}
                      disabled={true}
                      placeholder="Company Logo"
                      // required
                    />
                  </div>

                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      label="Company Logo Alias"
                      name="companyLogoAlias"
                      type={InputType.TEXT}
                      validationSchema={{
                        required: "Please enter the Company Logo Alias",
                        validate:(value)=>{
                            const regex = /^[A-Z]{2}$/
                            if(!regex.test(value)){
                              return 'Invalid input. only 2 uppercase character allowed.'
                            }
                          }
                      }}
                      placeholder="Enter Alias"
                      required
                    />
                  </div>
                  </div>

                  <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      label="Company URL"
                      name="companyURL"
                      type={InputType.TEXT}
                      // validationSchema={{
                      //   required: "Please enter the Company Name",
                      // }}
                      disabled={true}
                      placeholder="Company URL"
                      // required
                    />
                  </div>


                  </div>

                  <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      label="Company Linkedin"
                      name="companyLinkedinURL"
                      type={InputType.TEXT}
                      // validationSchema={{
                      //   required: "Please enter the Company Name",
                      // }}
                      disabled={true}
                      placeholder="Company Linkedin"
                      // required
                    />
                  </div>
                  </div>

                  {fields.map((item, index)=>{
                        let allEmails = []
                    fields.forEach((_, emailindex) => {
                      if(emailindex !== index) {
                      allEmails.push(watch(`clientDetails.[${emailindex}].emailID`)) 
                    } 
                    })

           let emailInclude = allEmails.includes( watch(`clientDetails.[${index}].emailID`))                                                              
                 return <>
                  <div className={AddNewClientStyle.row}>
                      <div className={AddNewClientStyle.colMd6}>
                        <HRInputField
                          register={register}
                          // isError={!!errors?.clientDetails?.[index]?.fullName}
                          errors={errors?.clientDetails?.[index]?.fullName}
                          label="Client POC Full Name"
                          name={`clientDetails.[${index}].fullName`}
                          type={InputType.TEXT}
                          validationSchema={{
                            required: "Please enter the client name",
                            validate:(value)=>{
                              const regex = /^[a-zA-Z ]*$/
                              if(!regex.test(value)){
                                return 'Invalid input. Special characters and numbers are not allowed.'
                              }
                            }
                          }}
                          // errorMsg="Please enter the Client Name."
                          placeholder="Enter Client Name"
                          required={true}
                          disabled={true}
                          forArrayFields={true}
                        />                   
                      </div>

                      <div className={AddNewClientStyle.colMd6}>
                        <HRInputField
                          register={register}
                          errors={errors?.clientDetails?.[index]?.fullNameAlias}
                           label="Client POC Full Name Alies"
                          name={`clientDetails.[${index}].fullNameAlias`}
                          type={InputType.TEXT}
                          validationSchema={{
                            required: "Please enter the client name alias",
                          }}
                          placeholder="Enter Alias"
                          required
                          forArrayFields={true}
                        />
                      </div>

                  </div>

                   <div className={AddNewClientStyle.row}>
                       <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      //								disabled={isLoading}
                      register={register}
                      errors={errors?.clientDetails?.[index]?.emailID}
                      validationSchema={{
                        required: `Please enter the client email ID.`,
                      }}
                      label="Client POC Email"
                      name={`clientDetails.[${index}].emailID`}
                    //   onBlurHandler={() => {
                    //     if (
                    //       errors?.clientDetails?.[index]?.emailID &&
                    //       !errors?.clientDetails?.[index]?.emailID?.message.includes('Contact already exists in same Company') 
                           
                    //     ) {
                    //       return;
                    //     }

                    //     let eReg = new RegExp(EmailRegEx.email);

                    //     if (
                    //       item?.emailID !==
                    //         watch(`clientDetails.[${index}].emailID`) &&
                    //       eReg.test(watch(`clientDetails.[${index}].emailID`))
                    //     ) {
                    //       // validateCompanyName(index);
                    //     } else {
                    //       // clearErrors(`clientDetails.[${index}].emailID`);
                    //       // setDisableSubmit(false);
                    //     }
                    //   }}
                      type={InputType.EMAIL}
                      placeholder="Enter Email ID "
                      required
                      disabled={true}
                      forArrayFields={true}
                    />
                  </div>

                  <div className={AddNewClientStyle.colMd6}>
                        <HRInputField
                          register={register}
                          errors={errors?.clientDetails?.[index]?.emailIDAlias}
                          validationSchema={{
                            required: `Please enter the client email alias.`,
                            // pattern: {
                            //   value: EmailRegEx.email,
                            //   message: "Entered value does not match email format",
                            // },
                            validate: value => {
                              if(emailInclude){
                                return "Client email id is already in use"
                              }
                            }
                          }}
                          label="Client POC Email Alias"
                          name={`clientDetails.[${index}].emailIDAlias`}
                          type={InputType.TEXT}
                          placeholder="Enter Alias"
                          required
                          forArrayFields={true}
                        />
                      </div>
                  </div>
                  </>
                  })}

                  <div className={AddNewClientStyle.row}>
                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      label="Company Headquarters"
                      name="headquaters"
                      type={InputType.TEXT}
                      // validationSchema={{
                      //   required: "Please enter the Company Name",
                      // }}
                      placeholder="Company Headquarters"
                      // required
                    />
                  </div>

                  <div className={AddNewClientStyle.colMd6}>
                    <HRInputField
                      register={register}
                      errors={errors}
                      label="Company Headquarters Alias"
                      name="headquatersAlias"
                      type={InputType.TEXT}
                      validationSchema={{
                        required: "Please enter the Company Headquarters Alias",
                      }}
                      placeholder="Enter Alias"
                      required
                    />
                  </div>
                  </div>
                </>}
              </>
  )
}
