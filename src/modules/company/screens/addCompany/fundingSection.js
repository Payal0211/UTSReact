import React, { useEffect, useState , useCallback } from "react";
import AddNewClientStyle from "./addclient.module.css";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { InputType  } from "constants/application";
import { Checkbox, message, Select, Skeleton } from 'antd';
import { allCompanyRequestDAO } from "core/company/companyDAO";
import { HttpStatusCode } from "axios";
import TextEditor from "shared/components/textEditor/textEditor";
import ReactQuill from "react-quill";
import { sanitizeLinks } from "modules/hiring request/screens/allHiringRequest/previewHR/services/commonUsedVar";


const defaultFunding = {
  "fundingID": 0,
  "fundingAmount": "",
  "fundingRound": "",
  "series": "",
  "month": "",
  "year": "",
  "investors": "",
  "additionalInformation":''
}

const seriesOptions = [
  { value: "Seed Round", id: "Seed Round" },
  { value: "Series A Round", id: "Series A Round" },
  { value: "Series B Round", id: "Series B Round" },
  { value: "Series C Round", id: "Series C Round" },
  { value: "Series D Round", id: "Series D Round" },
  { value: "Series E Round", id: "Series E Round" },
  { value: "Series F Round", id: "Series F Round" },
  { value: "Series G Round", id: "Series G Round" },
  { value: "Series H Round", id: "Series H Round" },
  { value: "Series I Round", id: "Series I Round" },
  { value: "IPO", id: "IPO" },
  { value: "Private Equity", id: "Private Equity" },
];

function FundingSection({register,errors,setValue,watch,companyDetails,fundingDetails,isSelfFunded,setIsSelfFunded,fields, append, remove,loadingDetails,companyID}) {
  const [controlledSeries,setControlledSeries] = useState([]);
    useEffect(() => {   
      remove()
        if(fundingDetails?.length > 0){
          setControlledSeries([])
            fundingDetails?.forEach(funding => {
              let fundingobj = {
                "fundingID": funding.fundingId,
                "fundingAmount": funding.fundingAmount,
                "fundingRound": funding.fundingRound,
                "series": funding.series,
                "month": funding.fundingMonth,
                "year": funding.fundingYear,
                "investors": funding.investors,
                'additionalInformation':funding.additionalInformation
              }
              append(fundingobj)
              setControlledSeries(prev=> [...prev,funding.series])
            });        
        }else{
          append(defaultFunding)
        } 
    },[fundingDetails])

    useEffect(()=>{
      if(companyDetails?.companyName){
        setIsSelfFunded(companyDetails?.isSelfFunded)
    }
    },[companyDetails])

    const onAddNewRound = useCallback(
      (e) => {
        e.preventDefault();
        append({ ...defaultFunding });
      },
      [append],
    );

    const removeFundingfromBE = async (toDelete,index)=>{
      let payload = {
        "fundingID": toDelete.fundingID,
        "companyID": companyID
      }
// console.log(toDelete, companyID)
      const result = await allCompanyRequestDAO.deleteFundingDAO(payload)
 
      if(result.statusCode === HttpStatusCode.Ok){
        remove(index);
      }
    }
  

    const onRemoveAddedRound = useCallback(
      (e, index,item) => {
        if(item?.fundingID === 0){
          e.preventDefault();
          remove(index);
        }else{
          e.preventDefault();
          removeFundingfromBE(item,index)
        }
        
      },
      [remove],
    );


    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthOptions = monthNames.map((month, index) => ({
      label: month,
      value: month,
    }));
    const generateYears = (startYear, endYear) => {
      const years = [];
      for (let year = startYear; year <= endYear; year++) {
        years.push(year);
      }
      return years;
    };
  
    const startYear = 1900;
    const endYear = new Date().getFullYear();
  
    const yearOptions = generateYears(startYear, endYear).map((year) => ({
      label: year.toString(),
      value: year.toString(),
    }));


  return (
    <div className={AddNewClientStyle.tabsFormItem}>
       
         {loadingDetails ? <Skeleton active /> :  fields?.map((item,index)=>{
            return  <div className={AddNewClientStyle.tabsFormItemInner}>
            <div className={AddNewClientStyle.tabsLeftPanel}>
              <h3>Funding Details {(index > 0) && `- ${index}`}</h3>
              <p>Please provide the necessary details</p>
  
              <div className={AddNewClientStyle.leftPanelAction}>    
              {/* {(index === 0 && fields?.length === 1)  &&  <button
              type="button"
              className={AddNewClientStyle.btn}
              onClick={(e) => onAddNewRound(e)}
            >
              Add Another Round
            </button>} */}


           {index > 0 && index + 1 === fields?.length && <>
           {/* <button
              type="button"
              className={AddNewClientStyle.btn}
              onClick={(e) => onAddNewRound(e)}
            >
              Add Another Round
            </button> */}

            {/* <button
										type="button"
										className={AddNewClientStyle.btn}
										onClick={(e) => onRemoveAddedRound(e, index,item)}>
										Remove
						</button> */}
           </>} 
            
            </div>
            </div>
             <div className={AddNewClientStyle.tabsRightPanel}>
           {index === 0 && <div className={AddNewClientStyle.row}>
                    <div className={AddNewClientStyle.colMd12} style={{marginBottom:'15px'}}>
                        <Checkbox checked={isSelfFunded} onClick={()=>setIsSelfFunded(prev=> !prev)}>
                        Self-funded (bootstrapped) company without external investments.
                        </Checkbox>
                    </div>
            </div>} 

            <div className={AddNewClientStyle.row}>
                <div className={AddNewClientStyle.colMd6}>
                <HRInputField
                    register={register}
                    // errors={errors}
                    label="Funding Amount"
                    name={`fundingDetails.[${index}].fundingAmount`}
                    type={InputType.TEXT}
                    onChangeHandler={(e) => {
                    }}
                    placeholder="Ex: 500k, 900k, 1M, 2B..."
                    disabled={isSelfFunded}
                  />
                </div>
{/* 
                <div className={AddNewClientStyle.colMd6}>
                <HRInputField
                    register={register}
                    // errors={errors}
                    label="Funding Round"
                    name={`fundingDetails.[${index}].fundingRound`}
                    type={InputType.NUMBER}
                    onChangeHandler={(e) => {
                    }}
                    placeholder="Enter round number"
                    disabled={isSelfFunded}
                  />
                </div> */}
            </div>

           
            <div className={AddNewClientStyle.row}>
                <div className={AddNewClientStyle.colMd6}>
                <HRSelectField
                 isControlled={true}
                 controlledValue={controlledSeries[index]}
                 setControlledValue={val=>setControlledSeries(prev=> {
                  let newControlled = [...prev]
                  newControlled[index] = val
                  return newControlled
                })}
                  setValue={setValue}
                  mode={"id"}
                  register={register}
                  name={`fundingDetails.[${index}].series`}
                  label="Funding Round/Series"
                  defaultValue="Select"
                  options={seriesOptions}
                disabled={isSelfFunded}
                />
                </div>

          
              <div className={AddNewClientStyle.colMd6}> 
              <div className={AddNewClientStyle.label}>Last Funding Date</div>
              <div className={AddNewClientStyle.dateSelect}>
              <div className={AddNewClientStyle.formGroup} style={{width:'50%'}}>
              <Select
                          options={monthOptions}
                          placeholder="Select month"
                          value={watch(`fundingDetails.[${index}].month`) ? watch(`fundingDetails.[${index}].month`) : undefined}
                          onSelect={(e) => {                     
                           setValue(`fundingDetails.[${index}].month`,e)
                          }}
                          disabled={isSelfFunded}
                        />
                        </div>
                        <div className={AddNewClientStyle.formGroup} style={{width:'50%'}}>
                        <Select
                          options={yearOptions}
                          placeholder="Select year"
                          showSearch={true}
                          value={watch(`fundingDetails.[${index}].year`) ? watch(`fundingDetails.[${index}].year`) : undefined}
                          onSelect={(e) => {
                            setValue(`fundingDetails.[${index}].year`,e)
                          }}
                          disabled={isSelfFunded}
                        />
                        </div>
                        </div>
                        </div>

            </div>

            <div className={AddNewClientStyle.row}>
                <div className={AddNewClientStyle.colMd12}>
                <HRInputField
                    register={register}
                    // errors={errors}
                    name={`fundingDetails.[${index}].investors`}
                    label="Investors"
                    type={InputType.TEXT}
                    onChangeHandler={(e) => {
                    }}
                    placeholder="Add investors seprated by comma (,)"
                    disabled={isSelfFunded}
                  />
                </div>

            </div>

            <div className={AddNewClientStyle.row}>
              <div className={AddNewClientStyle.colMd12}>
                {isSelfFunded ?<><div className={AddNewClientStyle.label}>Additional Information</div>
                <div className={AddNewClientStyle.disabledTextArea} >
                    <p>Additional Information</p>
                </div>
                </>  :  <>
                <div className={AddNewClientStyle.label}>Additional Information</div>
                <ReactQuill
              register={register}
              setValue={setValue}
              theme="snow"
              className="heightSize"
              // value={companyDetails?.culture ? companyDetails.culture : ''} 
              value={watch(`fundingDetails.[${index}].additionalInformation`)}
              name={`fundingDetails.[${index}].additionalInformation`}
              onChange={(val) => {
                let sanitizedContent = sanitizeLinks(val);
                // let _updatedVal = sanitizedContent?.replace(/<img\b[^>]*>/gi, '');
                setValue(`fundingDetails.[${index}].additionalInformation`,sanitizedContent)
                // setCompanyDetails(prev=> ({...prev, basicDetails:{ ...prev.basicDetails,culture : val}}))
              }}
            />
            
            {/* <TextEditor
                register={register}
                setValue={setValue}
                // errors={errors}
                controlledValue={item?.additionalInformation}
                isControlled={true}
                isTextArea={true}
                label="Additional Information"
                name={`fundingDetails.[${index}].additionalInformation`}
                type={InputType.TEXT}
                placeholder="Enter Additional Information"
                // required
                watch={watch}
                disabled={isSelfFunded}
              /> */}
                </>}
             
              </div>

            </div>
          </div>
          </div>
          })}
      
        </div>
  )
}

export default FundingSection