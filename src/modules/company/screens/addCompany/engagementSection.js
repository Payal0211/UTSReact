import React, {useState, useEffect} from "react";
import AddNewClientStyle from "./addclient.module.css";
import { ReactComponent as EditSVG } from "assets/svg/EditField.svg";
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { InputType, EmailRegEx, ValidateFieldURL } from "constants/application";
import { useFieldArray, useForm } from "react-hook-form";
import TextEditor from "shared/components/textEditor/textEditor";
import { Checkbox, message, Select } from 'antd';



function EngagementSection({ register, errors, setValue, watch }) {
	const [payPerError,setPayPerError] = useState(false);
    const [typeOfPricing,setTypeOfPricing] = useState(null)
    const [profileSharingOption,setProfileSharingOption] = useState(null)
    const [profileSharingOptionError,setProfileSharingOptionError] = useState(false);

    const [checkPayPer, setCheckPayPer] = useState({
		companyTypeID:0,
		anotherCompanyTypeID:0
	});
	const [IsChecked,setIsChecked] = useState({
        isPostaJob:false,
        isProfileView:false,
    });
    const [creditError,setCreditError] = useState(false);
    const [errorCurrency, seterrorCurrency] = useState(false);

    let _currency = watch("creditCurrency");
    


  return (
    <div className={AddNewClientStyle.tabsFormItem}>
    <div className={AddNewClientStyle.tabsFormItemInner}>
      <div className={AddNewClientStyle.tabsLeftPanel}>
        <h3>Engagement Details</h3>

      </div>

      <div className={AddNewClientStyle.tabsRightPanel}>
      <div className={AddNewClientStyle.row}>
						<div className={AddNewClientStyle.colMd12}>
							<div style={{display:'flex',flexDirection:'column',marginBottom:'32px'}}> 
								<label style={{marginBottom:"12px"}}>
							Client Model
							 <span className={AddNewClientStyle.reqField}>
								*
							</span>
						</label>
            {payPerError && <p className={AddNewClientStyle.error}>*Please select client model</p>}
							{/* {pricingTypeError && <p className={AddNewClientStyle.error}>*Please select pricing type</p>} */}
							<div className={AddNewClientStyle.payPerCheckboxWrap}>
								<Checkbox 
									value={2} 
									onChange={(e)=>{setCheckPayPer({...checkPayPer,companyTypeID:e.target.checked===true ? e.target.value:0});setPayPerError(false);
                  setIsChecked({...IsChecked,isPostaJob:false,isProfileView:false})}}
                  checked={checkPayPer?.companyTypeID}
									>Pay Per Credit</Checkbox>
								<Checkbox 
									value={1} 
									onChange={(e)=>{setCheckPayPer({...checkPayPer,anotherCompanyTypeID:e.target.checked===true ? e.target.value:0});setPayPerError(false);setTypeOfPricing(null)}}
                  checked={checkPayPer?.anotherCompanyTypeID}
									>Pay Per Hire</Checkbox>
							</div>
							</div>												
						</div>
					</div>


                    {checkPayPer?.companyTypeID !== 0  &&  checkPayPer?.companyTypeID !== null &&
					<>
          <div className={AddNewClientStyle.row}>
              <div className={AddNewClientStyle.colMd6}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Per credit amount"
                        name="creditAmount"
                        type={InputType.NUMBER}
                        placeholder="Enter per credit amount"
                        required={checkPayPer?.companyTypeID !== 0  &&  checkPayPer?.companyTypeID !== null?true:false}          
                        validationSchema={{
                          required:checkPayPer?.companyTypeID !== 0  &&  checkPayPer?.companyTypeID !== null?  "Please enter Per credit amount.": null,                          
                        }}              
                      />
              </div>               
              <div className={AddNewClientStyle.colMd6}>
                <label>
                    Currency
                      <span className={AddNewClientStyle.reqField}>*</span>
                </label>
                <Select onChange={(e) => {                  
                  setValue("creditCurrency",e);
                  seterrorCurrency(false);
                }} name="creditCurrency" value={_currency} 
                  >
                  <Select.Option value="INR">INR</Select.Option>
                  <Select.Option value="USD">USD</Select.Option>
                </Select>
                {errorCurrency &&  <p
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                        className={AddNewClientStyle.error}
                      >
                        *  Please select currency
                      </p>}
              </div>
          </div>

						<div className={AddNewClientStyle.row}>
							<div className={AddNewClientStyle.colMd6}>
              <label style={{marginBottom:"12px"}}>
							Topup Credit
              <span className={AddNewClientStyle.reqField}>
								*
							</span>
             {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Remaining Credit : <span style={{fontWeight:"bold"}}>{companyDetail?.jpCreditBalance}</span> */}
						</label>
            <div className={AddNewClientStyle.FreecreditFieldWrap}>
								<HRInputField
									register={register}
									errors={errors}
                  className="yourClassName"
									validationSchema={{
										required: checkPayPer?.companyTypeID !== 0  &&  checkPayPer?.companyTypeID !== null ?'Please enter free credits.':null,
                    min: {
                      value: 0,
                      message: `please don't enter the value less than 0`,
                    },
                    max: {
                      value: 99,
                      message: `please don't enter the value greater than 99`,
                    }
									}}
                  onKeyDownHandler={(e)=>{
                    if (e.key === '-' || e.key === '+' || e.key === 'E' ||  e.key === 'e') {
                      e.preventDefault();
                    }
                  }}
                  // label={`Free Credits Balance Credit : ${companyDetail?.jpCreditBalance}`}
									name={'jpCreditBalance'}
									type={InputType.NUMBER}
									placeholder="Free Credits"
									required={checkPayPer?.companyTypeID !== 0  &&  checkPayPer?.companyTypeID !== null?true:false}
								/>
                </div>
							</div>
            
						</div>
            <div className={AddNewClientStyle.row}>
							<div className={AddNewClientStyle.colMd6}>
                
              </div>
            </div>
						<div className={AddNewClientStyle.row}>
							<div className={AddNewClientStyle.colMd12}>
								<div style={{display:'flex',flexDirection:'column',marginBottom:'16px'}}> 
									{/* <label style={{marginBottom:"12px"}}>
								Client Modal
								<span className={AddNewClientStyle.reqField}>
									*
								</span>
							</label> */}
								{/* {pricingTypeError && <p className={AddNewClientStyle.error}>*Please select pricing type</p>} */}
								<div className={AddNewClientStyle.payPerCheckboxWrap} style={{marginBottom:"16px"}}>
									<Checkbox name='IsPostaJob' 
                    checked={IsChecked?.isPostaJob} 
                    onChange={(e)=>{
                      setIsChecked({...IsChecked,isPostaJob:e.target.checked});setCreditError(false)}}
                    >Credit per post a job.
                  </Checkbox>
									<Checkbox name="IsProfileView" 
                    checked={IsChecked?.isProfileView} 
                    onChange={(e)=>{
                      setIsChecked({...IsChecked,isProfileView:e.target.checked});setCreditError(false);setProfileSharingOption(null);setProfileSharingOptionError(false);}}>
                      Credit per profile view.
                  </Checkbox>
							  </div>
                {creditError && <p className={AddNewClientStyle.error}>*Please select option</p>}
                {/* {IsChecked?.isProfileView && 
                  <div style={{display:'flex',flexDirection:'column',marginBottom:'20px',marginLeft: '270px', marginTop:"19px"}}> 
                          <label style={{marginBottom:"12px"}}>
                        Profile Sharing Options 
                        <span className={AddNewClientStyle.reqField}>
                          *
                        </span>
                      </label>
                      <Radio.Group
                        onChange={e=> {setProfileSharingOption(e.target.value);setProfileSharingOptionError(false)}}
                        value={profileSharingOption}
                        >
                        <Radio value={true}>Vetted Profile</Radio>
                        <Radio value={false}>Fast Profile</Radio>
                      </Radio.Group>
                          {profileSharingOptionError && <p style={{display:'flex',flexDirection:'column',marginTop:"15px"}} className={AddNewClientStyle.error}>*Please select profile sharing options</p>}
                  </div>	
                } */}
                <div className={AddNewClientStyle.row}>                  
                      {IsChecked?.isPostaJob ? 
                      <div className={AddNewClientStyle.colMd4} >
                         <HRInputField
                           register={register}
                           errors={errors}
                           label="Job post credit"
                           name="jobPostCredit"
                           type={InputType.NUMBER}
                           placeholder="Enter Job post credit"
                           required={IsChecked?.isPostaJob?true:false}
                           validationSchema={{
                            required: IsChecked?.isPostaJob ?'Please enter job post credit.':null,                            
                          }}
                         />
                       </div> : <div className={AddNewClientStyle.colMd4}></div>}
                 
                      {IsChecked?.isProfileView && (
                      <>
                        <div className={AddNewClientStyle.colMd4}>
                        <HRInputField
                           register={register}
                           errors={errors}
                           label="Vetted Profile Credit"
                           name="vettedProfileViewCredit"
                           type={InputType.NUMBER}
                           placeholder="Enter Vetted Profile Credit"
                           required={IsChecked?.isProfileView ? true : false}
                           validationSchema={{
                            required: IsChecked?.isProfileView ?'Please enter vetted profile credit.':null,                          
                          }}
                         />
                         </div>
                         <div className={AddNewClientStyle.colMd4}>
                          <HRInputField
                              register={register}
                              errors={errors}
                              label="Non Vetted Profile Credit"
                              name="nonVettedProfileViewCredit"
                              type={InputType.NUMBER}
                              placeholder="Enter Non Vetted Profile Credit"
                              required={IsChecked?.isProfileView ? true : false}
                              validationSchema={{
                                required: IsChecked?.isProfileView ?'Please enter non vetted profile credit.':null,                          
                              }}
                            />
                       </div></>
                       )}
                </div>
                
								</div>												
							</div>
						</div>
					</>}
      </div>

      </div>
    </div>
  )
}

export default EngagementSection