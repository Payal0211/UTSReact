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


import CompanySection from "./companySection";
import FundingSection from "./fundingSection";
import CultureAndPerks from "./cultureAndPerks";
import ClientSection from "./clientSection";
import EngagementSection from "./engagementSection";

function AddCompany() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    unregister,
    getValues,
    resetField,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      secondaryClient: [],
      pocList: [],
    },
  });

  return (
    <div className={AddNewClientStyle.addNewContainer}>
      <div className={AddNewClientStyle.addHRTitle}>
        Add New Company/Client Details
      </div>

      <CompanySection register ={register} errors={errors} setValue={setValue} watch={watch} />

      <FundingSection register ={register} errors={errors} setValue={setValue} watch={watch} />

      <CultureAndPerks register ={register} errors={errors} setValue={setValue} watch={watch} /> 

      <ClientSection register ={register} errors={errors} setValue={setValue} watch={watch} /> 

    <EngagementSection register ={register} errors={errors} setValue={setValue} watch={watch} />

    <div className={AddNewClientStyle.tabsFormItem}>
    <div className={AddNewClientStyle.tabsFormItemInner}>
      <div className={AddNewClientStyle.tabsLeftPanel}>
        <h3>Add POCs</h3>
        <p>Please provide the necessary details.</p>
      </div>
      <div className={AddNewClientStyle.tabsRightPanel}>
        <div className={AddNewClientStyle.row}>
        <div className={AddNewClientStyle.colMd12}>
        <HRSelectField
              setValue={setValue}
              mode={"id/value"}
              register={register}
              name="uplersPOCname"
              label="Uplers's POC name"
              defaultValue="Enter POC name"
              options={['1-10 emp','11-50 emp','51-200 emp'].map(item =>({
                id: item,
                value: item,
            }))}
            required
            isError={
              errors["uplersPOCname"] && errors["uplersPOCname"]
            }
            errorMsg="Please select POC name."
            />
        </div>
        </div>
       
      </div>
      
    </div>
    </div>
    </div>
  );
}

export default AddCompany;
