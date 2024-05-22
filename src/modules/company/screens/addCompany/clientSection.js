import React , {useState, useMemo, useEffect} from "react";
import AddNewClientStyle from "./addclient.module.css";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { InputType, EmailRegEx, ValidateFieldURL } from "constants/application";

import {
	clientFormDataFormatter,
	getFlagAndCodeOptions,
} from 'modules/client/clientUtils';
import { MasterDAO } from 'core/master/masterDAO';

function ClientSection({ register, errors, setValue, watch }) {
    const [flagAndCode, setFlagAndCode] = useState([]);

    const getCodeAndFlag = async () => {
		const getCodeAndFlagResponse = await MasterDAO.getCodeAndFlagRequestDAO();
		setFlagAndCode(
			getCodeAndFlagResponse && getCodeAndFlagResponse.responseBody,
		);
	};

	const flagAndCodeMemo = useMemo(
		() => getFlagAndCodeOptions(flagAndCode),
		[flagAndCode],
	);

    useEffect(()=> getCodeAndFlag(), [])
  return (
    <div className={AddNewClientStyle.tabsFormItem}>
      <div className={AddNewClientStyle.tabsFormItemInner}>
        <div className={AddNewClientStyle.tabsLeftPanel}>
          <h3>Client Details</h3>

          <div className={AddNewClientStyle.leftPanelAction}>
            <button
              type="button"
              className={AddNewClientStyle.btn}
              onClick={() => {}}
            >
              Add Another Client
            </button>
          </div>
        </div>

        <div className={AddNewClientStyle.tabsRightPanel}>
          <div className={AddNewClientStyle.row}>
            <div className={AddNewClientStyle.colMd6}>
              <HRInputField
                register={register}
                errors={errors}
                label="Client Full Name"
                name="clientName"
                type={InputType.TEXT}
                validationSchema={{
                  required: "Please enter the Client Name",
                }}
                onChangeHandler={(e) => {
                  // setCompanyName(e.target.value);
                  // debounceDuplicateCompanyName(e.target.value);
                }}
                placeholder="Enter Client Name"
                required
              />
            </div>

            <div className={AddNewClientStyle.colMd6}>
              <HRInputField
                //								disabled={isLoading}
                register={register}
                errors={errors}
                validationSchema={{
                  required: "please enter the primary client email ID.",
                  pattern: {
                    value: EmailRegEx.email,
                    message: "Entered value does not match email format",
                  },
                }}
                label="Work Email"
                name={"clientEmailID"}
                type={InputType.EMAIL}
                placeholder="Enter Email ID "
                onChangeHandler={(e) => {
                  // setPrimaryClientEmail(e.target.value);
                  // debounceDuplicateEmailCheckHandler(e.target.value);
                }}
                required
              />
            </div>
          </div>
          <div className={AddNewClientStyle.row}>
                <div className={AddNewClientStyle.colMd6}>
                <HRInputField
                register={register}
                // errors={errors}
                label="Designation"
                name="clientDesignation"
                type={InputType.TEXT}
                // validationSchema={{
                //   required: "Please enter the Client Designation",
                // }}
                onChangeHandler={(e) => {
                  // setCompanyName(e.target.value);
                  // debounceDuplicateCompanyName(e.target.value);
                }}
                placeholder="Enter Client Designation"
                // required
              />
                </div>

                <div className={AddNewClientStyle.colMd6}>
                <HRSelectField
              setValue={setValue}
              mode={"id/value"}
              register={register}
              name="clientAccessType"
              label="Access Type"
              defaultValue="Choose Access Type"
              options={['1-10 emp','11-50 emp','51-200 emp'].map(item =>({
                id: item,
                value: item,
            }))}
            />
                </div>
          </div>

          <div className={AddNewClientStyle.row}>
            <div className={AddNewClientStyle.colMd6}>
            <div className={AddNewClientStyle.label}>Phone number</div>
                <div style={{display:'flex'}}>
                     <div className={AddNewClientStyle.phoneNoCode}>
									<HRSelectField
										searchable={true}
										setValue={setValue}
										register={register}
										name="primaryClientCountryCode"
										defaultValue="+91"
										options={flagAndCodeMemo}
									/>
								</div>
								<div className={AddNewClientStyle.phoneNoInput}>
									<HRInputField
										register={register}
										name={'primaryClientPhoneNumber'}
										type={InputType.NUMBER}
										placeholder="Enter Phone number"
									/>
								</div>
                </div>
           
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientSection;
