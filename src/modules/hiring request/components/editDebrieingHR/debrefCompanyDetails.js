import { Divider } from "antd";
import React from "react";
import DebriefingHRStyle from "./debriefingHR.module.css";
import HRInputField from "../hrInputFields/hrInputFields";
import { InputType, ValidateFieldURL, validateLinkedInURL } from "constants/application";
import HRSelectField from '../hrSelectField/hrSelectField';
import TextEditor from 'shared/components/textEditor/textEditor';

export default function DebrefCompanyDetails({ register, errors, watch, getHRdetails, setValue }) {
  return (
    <>
    <Divider />
      <div className={DebriefingHRStyle.partOne}>
        <div className={DebriefingHRStyle.hrFieldLeftPane}>
          <h3>Comapny Details</h3>
        </div>
        <div className={DebriefingHRStyle.hrFieldRightPane}>
          <div className={DebriefingHRStyle.row}>
            <div className={DebriefingHRStyle.colMd6}>
              <HRInputField
                register={register}
                errors={errors}
                validationSchema={{
                  required: "please enter the company name.",
                }}
                label={"Company name"}
                name="companyName"
                type={InputType.TEXT}
                placeholder="Enter company name"
                
              />
            </div>
            <div className={DebriefingHRStyle.colMd6}>
            <HRInputField
                register={register}
                errors={errors}
                validationSchema={{
                  required: "please enter the company website.",
                }}
                label={"Industry"}
                name="industry"
                type={InputType.TEXT}
                placeholder="Enter company Industry"
                
              />
            </div>
          </div>

          <div className={DebriefingHRStyle.row}>
            <div className={DebriefingHRStyle.colMd6}>
              <HRInputField
                register={register}
                errors={errors}
                validationSchema={{
                //   required: "please enter the company website.",
                  validate: (value) =>{
                    try {
                        // new URL(value);
                        // return true;
                        if(ValidateFieldURL(value,"website")){
                          return true
                        }else{
                          return "Entered value does not match url format";
                        }
                      } catch (error) {
                        return 'Entered value does not match url format';
                      }
                }
                }}
                label={"Website"}
                name="webSite"
                type={InputType.TEXT}
                placeholder="Enter company website"
              />
            </div>
            <div className={DebriefingHRStyle.colMd6}>
              <HRInputField
                register={register}
                errors={errors}
                validationSchema={{
                //   required: "please enter the company name.",
                  validate: (value) =>{
                    try {
                        // new URL(value);
                        // return true;
                        if(ValidateFieldURL(value,"linkedin")){
                          return true
                        }else{
                          return 'Entered value does not match linkedin url format';
                        }
                      } catch (error) {
                        return 'Entered value does not match url format';
                      }
                }
                }}
                label={"Company Linkedin"}
                name="companyLinkedin"
                type={InputType.TEXT}
                placeholder="Enter company Linkedin"
              />
            </div>
          </div>
        {/* <div className={DebriefingHRStyle.row}>
            <div className={DebriefingHRStyle.colMd6}>
                        <HRInputField
                            register={register}
                            errors={errors}
                            validationSchema={{
                            required: "please enter the company size.",
                            }}
                            label={"Company Size"}
                            name="companySize"
                            type={InputType.NUMBER}
                            placeholder="Enter company size"
                            required
                        />
                </div>
            </div> */}
          

          
          <TextEditor
									isControlled={true}
									controlledValue={getHRdetails?.addHiringRequest?.aboutCompanyDesc ? getHRdetails?.addHiringRequest?.aboutCompanyDesc : getHRdetails?.companyInfo?.aboutCompanyDesc}
									label={'About Company'}
									placeholder={"Please enter details about company."}
									setValue={setValue}
									watch={watch}
									register={register}
									errors={errors}
									name="aboutCompany"
									required
								/>
            {/*<div className={DebriefingHRStyle.aboutCompanyField}> <HRInputField
              required
              isTextArea={true}
              errors={errors}
              validationSchema={{
                validate: (value) => {
                  if (!value) {
                    return "Please add something about the company";
                  }
                },
              }}
              label={"About Company"}
              register={register}
              name="aboutCompany"
              type={InputType.TEXT}
              placeholder="Please enter details about company."
            /> */}
            {/* <p>* Please do not mention company name here</p> </div>*/}
          
        </div>
      </div>
      
    </>
  );
}
