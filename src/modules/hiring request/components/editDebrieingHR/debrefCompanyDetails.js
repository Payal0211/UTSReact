import { Divider } from "antd";
import React from "react";
import DebriefingHRStyle from "./debriefingHR.module.css";
import HRInputField from "../hrInputFields/hrInputFields";
import { InputType } from "constants/application";
import HRSelectField from '../hrSelectField/hrSelectField';

export default function DebrefCompanyDetails({ register, errors }) {
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
                required
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
                required
              />
            </div>
          </div>

          <div className={DebriefingHRStyle.row}>
            <div className={DebriefingHRStyle.colMd6}>
              <HRInputField
                register={register}
                errors={errors}
                validationSchema={{
                  required: "please enter the company website.",
                  validate: (value) =>{
                    try {
                        new URL(value);
                        return true;
                      } catch (error) {
                        return 'Entered value does not match url format';
                      }
                }
                }}
                label={"Website"}
                name="webSite"
                type={InputType.TEXT}
                placeholder="Enter company website"
                required
              />
            </div>
            <div className={DebriefingHRStyle.colMd6}>
              <HRInputField
                register={register}
                errors={errors}
                validationSchema={{
                  required: "please enter the company name.",
                  validate: (value) =>{
                    try {
                        new URL(value);
                        return true;
                      } catch (error) {
                        return 'Entered value does not match url format';
                      }
                }
                }}
                label={"Company Linkedin"}
                name="companyLinkedin"
                type={InputType.TEXT}
                placeholder="Enter company Linkedin"
                required
              />
            </div>
          </div>
        <div className={DebriefingHRStyle.row}>
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
            </div>
          

          <div className={DebriefingHRStyle.aboutCompanyField}>
            <HRInputField
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
            />
            {/* <p>* Please do not mention company name here</p> */}
          </div>
        </div>
      </div>
      
    </>
  );
}
