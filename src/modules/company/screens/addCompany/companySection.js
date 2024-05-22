import React from "react";
import AddNewClientStyle from "./addclient.module.css";
import { ReactComponent as EditSVG } from "assets/svg/EditField.svg";
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { InputType, EmailRegEx, ValidateFieldURL } from "constants/application";
import { useFieldArray, useForm } from "react-hook-form";
import TextEditor from "shared/components/textEditor/textEditor";
import { Checkbox, message } from 'antd';

function CompanySection({register,errors,setValue,watch}) {
  return (
    <div className={AddNewClientStyle.tabsFormItem}>
        <div className={AddNewClientStyle.tabsFormItemInner}>
          <div className={AddNewClientStyle.tabsLeftPanel}>
            <h3>Basic Company Details</h3>
            {/* <p>Please provide the necessary details</p> */}
            <p>
              The Talents would be able to see <br /> fields highlighted in
              blue.
            </p>
          </div>

          <div className={AddNewClientStyle.tabsRightPanel}>
            <div className={AddNewClientStyle.row}>
              <div className={AddNewClientStyle.colMd12}>
                <div
                  style={{
                    width: "145px",
                    height: "145px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "145px",
                      height: "145px",
                      backgroundColor: "#EBEBEB",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    <p>Upload Company Logo</p>
                    {/* {!getUploadFileData ? (
                    // <p>Upload Company Logo</p>
                    <Avatar 
                    style={{ width: "100%",
                    height: "100%", display: "flex",alignItems: "center"}} 
                    size="large">
                      {companyDetail?.companyName?.substring(0, 2).toUpperCase()}
                      </Avatar>
                  ) : (
                    <img
                      style={{
                        width: "145px",
                        height: "145px",
                        borderRadius: "50%",
                      }}
                      src={
                        base64Image
                          ? base64Image
                          : NetworkInfo.PROTOCOL +
                            NetworkInfo.DOMAIN +
                            "Media/CompanyLogo/" +
                            getUploadFileData
                      }
                      alt="preview"
                    />
                  )} */}
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div
                      style={{
                        background: "var(--color-sunlight)",
                        marginTop: "-25px",
                        marginRight: "11px",
                        display: "flex",
                        padding: "2px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        zIndex: 50,
                      }}
                    >
                      <EditSVG width={24} height={24} onClick={() => {}} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                      // pattern: {
                      // 	value: URLRegEx.url,
                      // 	message: 'Entered value does not match url format',
                      // },
                    }}
                    onChangeHandler={(e) => {
                      // setCompanyName(e.target.value);
                      // debounceDuplicateCompanyName(e.target.value);
                    }}
                    placeholder="Enter Name"
                    required
                  />
               
              </div>

              <div className={AddNewClientStyle.colMd6}>
                <HRInputField
                  register={register}
                  errors={errors}
                  label="Website URL"
                  name="companyURL"
                  type={InputType.TEXT}
                  validationSchema={{
                    required: "Please enter the Company Website link.",
                    // pattern: {
                    // 	value: URLRegEx.url,
                    // 	message: 'Entered value does not match url format',
                    // },
                    validate: (value) => {
                      if (ValidateFieldURL(value, "website")) {
                        return true;
                      } else {
                        return "Entered value does not match url format";
                      }
                    },
                  }}
                  placeholder="Enter website url"
                  required
                />
              </div>
            </div>

            <div className={AddNewClientStyle.row}>
            <div className={AddNewClientStyle.colMd6}>
                
                  <HRInputField
                    register={register}
                    errors={errors}
                    label="Founded in"
                    name="foundedIn"
                    type={InputType.TEXT}
                    validationSchema={{
                      required: "Please enter the Founded in",
                      // pattern: {
                      // 	value: URLRegEx.url,
                      // 	message: 'Entered value does not match url format',
                      // },
                    }}
                    onChangeHandler={(e) => {
                      // setCompanyName(e.target.value);
                      // debounceDuplicateCompanyName(e.target.value);
                    }}
                    placeholder="Enter year"
                    required
                  />
                
              </div>

              <div className={AddNewClientStyle.colMd6}>
              <HRSelectField
                //   isControlled={true}
                //   controlledValue={controlledCompanyLoacation}
                //   setControlledValue={setControlledCompanyLoacation}
                  setValue={setValue}
                  mode={"id/value"}
                  register={register}
                  name="teamSize"
                  label="Team Size"
                  defaultValue="Select team size"
                  options={['1-10 emp','11-50 emp','51-200 emp'].map(item =>({
                    id: item,
                    value: item,
                }))}
                  required
                  isError={
                    errors["teamSize"] && errors["teamSize"]
                  }
                  errorMsg="Please select a team size."
                />
              </div>
            </div>

            <div className={AddNewClientStyle.row}>
            <div className={AddNewClientStyle.colMd6}>
              <HRSelectField
                //   isControlled={true}
                //   controlledValue={controlledCompanyLoacation}
                //   setControlledValue={setControlledCompanyLoacation}
                  setValue={setValue}
                  mode={"id/value"}
                  register={register}
                  name="companyType"
                  label="Company Type"
                  defaultValue="Select "
                  options={['1-10 emp','11-50 emp','51-200 emp'].map(item =>({
                    id: item,
                    value: item,
                }))}
                  required
                  isError={
                    errors["companyType"] && errors["companyType"]
                  }
                  errorMsg="Please select a Company Type."
                />
              </div>

              <div className={AddNewClientStyle.colMd6}>
              <HRSelectField
                //   isControlled={true}
                //   controlledValue={controlledCompanyLoacation}
                //   setControlledValue={setControlledCompanyLoacation}
                  setValue={setValue}
                  mode={"id/value"}
                  register={register}
                  name="industry"
                  label="Industry"
                  defaultValue="Select"
                  options={['1-10 emp','11-50 emp','51-200 emp'].map(item =>({
                    id: item,
                    value: item,
                }))}
                  required
                  isError={
                    errors["industry"] && errors["industry"]
                  }
                  errorMsg="Please select a industry."
                />
              </div>

              <div className={AddNewClientStyle.colMd6}>
              <HRInputField
                    register={register}
                    // errors={errors}
                    label="Headquaters"
                    name="headquaters"
                    type={InputType.TEXT}
                    // validationSchema={{
                    //   required: "Please enter the Founded in",
                    //   // pattern: {
                    //   // 	value: URLRegEx.url,
                    //   // 	message: 'Entered value does not match url format',
                    //   // },
                    // }}
                    onChangeHandler={(e) => {
                      // setCompanyName(e.target.value);
                      // debounceDuplicateCompanyName(e.target.value);
                    }}
                    placeholder="Search location"
                    // required
                  />
              </div>
            </div>

            <div className={AddNewClientStyle.row}>
            <div className={AddNewClientStyle.colMd12}>
            <TextEditor
                register={register}
                setValue={setValue}
                // errors={errors}
                // controlledValue={companyDetail?.aboutCompanyDesc}
                // isControlled={true}
                isTextArea={true}
                label="About Company"
                name="aboutCompany"
                type={InputType.TEXT}
                placeholder="About Company"
                // required
                watch={watch}
              />
              </div>
            </div>

          </div>
        </div>
      </div>
  )
}

export default CompanySection