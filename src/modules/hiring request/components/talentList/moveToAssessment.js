import React from "react";
import TalentListStyle from "./talentList.module.css";
import { useForm, Controller } from "react-hook-form";
import { InputType } from "constants/application";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { Skeleton } from "antd";

export default function MoveToAssessment({
  onCancel,
  hrId,
  talentInfo,
  register,
  handleSubmit,
  errors,
  resetField,
  saveRemark,
  saveRemarkLoading,
}) {
  return (
    <>
      {" "}
      <h1>Move To Assessment</h1>
      <div>
        {saveRemarkLoading ? (
          <Skeleton active />
        ) : (
          <>
            <div style={{ marginTop: "10px" }}>
              <HRInputField
                required
                isTextArea={true}
                rows={4}
                errors={errors}
                validationSchema={{
                  required: "Please enter the remark.",
                }}
                label={"Remark"}
                register={register}
                name="remark"
                type={InputType.TEXT}
                placeholder="Enter Remark"
              />
            </div>
            <div className={TalentListStyle.formPanelAction}>
              <button
                className={TalentListStyle.btnPrimary}
                onClick={handleSubmit(saveRemark)}
              >
                confirm
              </button>
              <button
                onClick={() => {
                  onCancel();
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
