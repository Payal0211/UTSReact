import React, { useEffect, useState } from "react";
import updateTRStyle from "modules/hiring request/components/updateTRModal/updateTR.module.css";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { ReactComponent as MinusSVG } from "assets/svg/minus.svg";
import { ReactComponent as PlusSVG } from "assets/svg/plus.svg";
import { useForm } from "react-hook-form";
import { InputType } from "constants/application";
import { message } from "antd";
import { engagementRequestDAO } from "core/engagement/engagementDAO";
import SpinLoader from 'shared/components/spinLoader/spinLoader';
import { HttpServices } from "shared/services/http/http_service";

export default function LeaveUppdate({ talentDetails,onCancel,callListData}) {
  const [count, setCount] = useState(0);
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const increment = () => {
    if(isNaN(count)){
        let val =  0 + 1;
    setValue("paidLeaves", val);
    }else{
          let val =  +count + 1;
    setValue("paidLeaves", val);
    }
  
  };
  const decrement = () => {
    if (count > 0) {
      let val = count - 1;
      setValue("paidLeaves", val);
    }
    if (count == 0) {
      message.error(
        "Decrease TR Should be lass than Active TR and not equal to 0"
      );
      return;
    }
  };

  useEffect(()=>{
    setCount(watch('paidLeaves'))
  },[watch('paidLeaves')])

  useEffect(()=>{
    if(talentDetails?.totalLeavesGiven) {
        setValue('paidLeaves',talentDetails?.totalLeavesGiven)
    }

    if(talentDetails?.holidayLeaves){
        setValue('holidayLeaves',talentDetails?.holidayLeaves)
        if(talentDetails?.holidayLeaves > 0){
            setDisable(true)
        }
    }

  },[talentDetails])

  const handleLabel = () => {
    if(talentDetails?.totalLeavesGiven === count
    	|| count === 0 ){
    		return	''
    	}
    if(talentDetails?.totalLeavesGiven < count){
    	return 'Increase'
    }
    return "";
  };

  const onSubmit = async (d) => {
    console.log(d)

    let payload = {
        onBoardId : talentDetails?.id,
        talentID: talentDetails?.talentID,
        leavesGiven: d.paidLeaves - +talentDetails?.totalLeavesGiven,
        holidayLeaves: d.holidayLeaves === '' ? 0 : d.holidayLeaves
    }
    setIsLoading(true)
    const result = await engagementRequestDAO.updateLeaveRequestDAO(payload)
    setIsLoading(false)
    // console.log("result",result, payload)
    if(result?.statusCode === 200){
        onCancel()
        callListData()
    }
  };

  return (
    <div className={updateTRStyle.engagementModalContainer}>
      <div className={updateTRStyle.updateTRTitle}>
        <h2>Update Leave(s)</h2>

        <div style={{display:'flex',gap:'10px'}}>
<p>
          Talent :
          <span> {talentDetails?.talent}</span>
        </p>

        <p>
          Leave Balance  :
          <span> {talentDetails?.totalLeaveBalance} </span>
        </p>

        <p>
          Eng. / HR #  :
          <span> {talentDetails?.engagemenID}  </span>
        </p>
        </div>
        
      </div>

      {isLoading ? <SpinLoader /> : <div className={updateTRStyle.row}>

        
      <div className={updateTRStyle.colMd6}>
          <div className={updateTRStyle.counterFieldGroup}>
           {count > talentDetails?.totalLeavesGiven && <button className={updateTRStyle.minusButton} onClick={decrement}>
              <MinusSVG />
            </button>} 

            <HRInputField
              register={register}
              errors={errors}
              validationSchema={{
                required: "Please enter paid leaves",
                min:{
                    value:talentDetails?.totalLeavesGiven,
                    message:`Please enter value more then ${talentDetails?.totalLeavesGiven ? 1 : talentDetails?.totalLeavesGiven}`
                  }
              }}
              label={`${handleLabel()} Paid Leaves(s)`}
              name="paidLeaves"
              setValue={setValue}
            //   value={count}
            //   onChangeHandler={(e) => {
            //     setCount(parseInt(e.target.value));
            //     setDisable(false);
            //   }}
              type={InputType.NUMBER}
              placeholder="Enter Paid Leaves"
              required
              disabled={true}
            />
            <button className={updateTRStyle.plusButton} onClick={increment}>
              <PlusSVG />
            </button>
          </div>
        </div>

        <div className={updateTRStyle.colMd6}>
          <HRInputField
            register={register}
            errors={errors}
            validationSchema={{
              // required: "Please enter holiday leaves",
              min:{
                value:0,
                message:'Please enter a valid input'
              }
            }}
            label={`Holiday Leaves`}
            name="holidayLeaves"
            // setValue={setValue}
            // value={count}
            // onChangeHandler={(e) => {
            //   setCount(parseInt(e.target.value));
            //   setDisable(false);
            // }}
            type={InputType.NUMBER}
            placeholder="Enter Holiday Leaves"
            required
            disabled={disable}
          />
        </div>

      </div>}

     

      {/* <div className={updateTRStyle.row}>
       
      </div> */}

      <div className={updateTRStyle.formPanelAction}>
        <button
          onClick={() => {
            onCancel();
            // window.location.reload();
            // setCount(updateTRDetail?.ClientDetail?.ActiveTR);
            setValue("additionalComments", "");
            setValue("reasonForLoss", "");
          }}
          className={updateTRStyle.btn}
        >
          Cancel
        </button>

        
          <button
            type="submit"
            className={updateTRStyle.btnPrimary}
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </button>
       
      </div>
    </div>
  );
}
