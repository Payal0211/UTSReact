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

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function FundingSection({register,errors,setValue,watch}) {
  return (
    <div className={AddNewClientStyle.tabsFormItem}>
        <div className={AddNewClientStyle.tabsFormItemInner}>
          <div className={AddNewClientStyle.tabsLeftPanel}>
            <h3>Funding Details</h3>
            <p>Please provide the necessary details</p>

            <div className={AddNewClientStyle.leftPanelAction}>
						
							<button
								type="button"
								className={AddNewClientStyle.btn}
								onClick={()=>{}}>
								Add Another Round
							</button>
					
					</div>
          </div>

          <div className={AddNewClientStyle.tabsRightPanel}>
            <div className={AddNewClientStyle.row}>
                    <div className={AddNewClientStyle.colMd12} style={{marginBottom:'15px'}}>
                        <Checkbox onClick={()=>{}}>
                                            Self-funded company without external investments.
                        </Checkbox>
                    </div>
            </div>

            <div className={AddNewClientStyle.row}>
                <div className={AddNewClientStyle.colMd6}>
                <HRInputField
                    register={register}
                    // errors={errors}
                    label="Funding Amount"
                    name="fundingAmount"
                    type={InputType.TEXT}
                    onChangeHandler={(e) => {
                    }}
                    placeholder="Ex: 500k, 900k, 1M, 2B..."
                  />
                </div>

                <div className={AddNewClientStyle.colMd6}>
                <HRInputField
                    register={register}
                    // errors={errors}
                    label="Funding Round"
                    name="fundingRound"
                    type={InputType.TEXT}
                    onChangeHandler={(e) => {
                    }}
                    placeholder="Ex: 500k, 900k, 1M, 2B..."
                  />
                </div>
            </div>

            <div className={AddNewClientStyle.row}>
                <div className={AddNewClientStyle.colMd6} >
                <HRSelectField
                  setValue={setValue}
                  mode={"id/value"}
                  register={register}
                  name="series"
                  label="Series"
                  defaultValue="Select"
                  options={['1-10 emp','11-50 emp','51-200 emp'].map(item =>({
                    id: item,
                    value: item,
                }))}
                />
                </div>

                <div className={AddNewClientStyle.colMd6}>
                <div className={AddNewClientStyle.calendarFilterSet}>
							<div className={AddNewClientStyle.label}>Month-Year</div>
							<div className={AddNewClientStyle.calendarFilter}>
								<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
								<DatePicker
									style={{ backgroundColor: 'red' }}
									onKeyDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									className={AddNewClientStyle.dateFilter}
									placeholderText="Month - Year"
									// selected={startDate}
									onChange={()=>{}}
									// startDate={startDate}
									// endDate={endDate}
									dateFormat="MM-yyyy"
									showMonthYearPicker
								/>
							</div>
						</div>
                </div>
            </div>

            <div className={AddNewClientStyle.row}>
                <div className={AddNewClientStyle.colMd12}>
                <HRSelectField
                  setValue={setValue}
                  mode={"id/value"}
                  register={register}
                  name="investors"
                  label="Investors"
                  defaultValue="Select"
                  options={['1-10 emp','11-50 emp','51-200 emp'].map(item =>({
                    id: item,
                    value: item,
                }))}
                />
                </div>

            </div>

          </div>

        </div>
        </div>
  )
}

export default FundingSection