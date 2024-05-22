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
       
    </div>
  );
}

export default AddCompany;
