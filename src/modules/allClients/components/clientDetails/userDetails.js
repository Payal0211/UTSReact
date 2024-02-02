import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import userDetails from './userDetails.module.css';
import { InputType } from 'constants/application';
import { useForm } from 'react-hook-form';
import { _isNull } from 'shared/utils/basic_utils';
import { useEffect, useState } from 'react';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';
import { allClientRequestDAO } from 'core/allClients/allClientsDAO';
import { useNavigate } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  Checkbox, Spin } from 'antd';

const UserDetails = () => {
    const navigate = useNavigate();
    const [isLoading,setIsLoading] = useState(false);
    const [IsChecked,setIsChecked] = useState({
        IsPostaJob:false,
        IsProfileView:false,
        IsHybridModel:false,
    });
    const {
        watch,
        register,
        setError,     
        formState: { errors },
      } = useForm();

    let full_name = watch('fullName');
    let company_name = watch('companyName');
    let work_email = watch('workEmail');
    let free_credits = watch('freeCredits');
    useEffect(() => {
        if(full_name){
            setError('fullName', null);
        }
    },[full_name]);
    useEffect(() => {
        if(company_name){
            setError('companyName', null);
        }
    },[company_name]);
    useEffect(() => {
        if(work_email){
            setError('workEmail', null);
        }
    },[work_email]);
    useEffect(() => {
        if(free_credits){
            setError('freeCredits', null);
        }
    },[free_credits]);


    const handleSubmit = () => {       
        let isValid = true;
        let emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if (_isNull(full_name)) {
            isValid = false;
            setError('fullName', {
                type: 'fullName',
                message: 'please enter first & last name.',
            });
        }
        if (_isNull(company_name)) {
            isValid = false;
            setError('companyName', {
                type: 'companyName',
                message: 'please enter company name.',
            });
        } 
        if (_isNull(work_email)) {
            isValid = false;
            setError('workEmail', {
                type: 'workEmail',
                message: 'please enter work email.',
            });
        }else if(!emailRegex.test(work_email)){
            isValid = false;
            setError('workEmail', {
                type: 'workEmail',
                message: 'Please enter a valid work email.',
            });
        }
        if (_isNull(free_credits)) {
            isValid = false;
            setError('freeCredits', {
                type: 'freeCredits',
                message: 'please enter free Credits.',
            });
        }else if(free_credits<1){
            isValid = false;
            setError('freeCredits', {
                type: 'freeCredits',
                message: 'please enter the value more than 0.',
            });
        }

        if(isValid){
            onSubmitData();
        }
    }

    const onSubmitData = async () => {
        setIsLoading(true);
        let payload = {
            fullName: full_name,
            workEmail: work_email,
            companyName: company_name,
            freeCredit: Number(free_credits),
            IsPostaJob: IsChecked?.IsPostaJob,
            IsProfileView: IsChecked?.IsProfileView, 
            IsHybridModel: IsChecked?.IsHybridModel
        }
        const response = await allClientRequestDAO.userDetailsDAO(payload);
          if (response.statusCode === HTTPStatusCode.OK) {           
            toast.success("Client added successfully",{
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000, 
            })
            setTimeout(() => {
                navigate(UTSRoutes.ALLCLIENTS); 
            }, 1000);
                       
          }else if(response.statusCode === HTTPStatusCode.BAD_REQUEST){
            toast.error(response.responseBody, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000, 
              });
          }
          setIsLoading(false);
    }
    return ( 
        <div>
            {isLoading ? <div className={userDetails.spin}> <Spin/> </div>: 
            <form id="userDetailsform" className={userDetails.hrFieldRightPane}>
                <ToastContainer />
                <div className={userDetails.container}>
                    <div className={userDetails.colMd6}>
                        <HRInputField                  
                        register={register}
                        errors={errors}                   
                        label="Full Name"
                        name="fullName"
                        type={InputType.TEXT}
                        placeholder="Enter first & last name"
                        required                    
                        />
                    </div>

                    <div className={userDetails.colMd6}>
                        <HRInputField                  
                        register={register}
                        errors={errors}                   
                        label="Company Name"
                        name="companyName"
                        type={InputType.TEXT}
                        placeholder="Enter company name"
                        required
                        />
                    </div>

                    <div className={userDetails.colMd6}>
                        <HRInputField                  
                        register={register}
                        errors={errors}                   
                        label="Work Email"
                        name="workEmail"
                        type={InputType.TEXT}
                        placeholder="Enter work email"
                        required
                        />
                    </div>

                    <div className={userDetails.colMd6}>
                        <HRInputField                  
                        register={register}
                        errors={errors}                   
                        label="Free Credits"
                        name="freeCredits"
                        type={InputType.NUMBER}
                        placeholder="Enter free credits"
                        required
                        validationSchema={{
                            required: "please enter free credits.",
                            min: {
                            value: 1,
                            message: `please enter the value more than 0`,
                            },
                        }}
                        />
                    </div>  
                    <div className={userDetails.checkbox}>
                        <Checkbox name='IsPostaJob' checked={IsChecked?.IsPostaJob} onChange={(e)=>setIsChecked({...IsChecked,IsPostaJob:e.target.checked})}>Credit per post a job.</Checkbox>
                        <Checkbox name="IsProfileView" checked={IsChecked?.IsProfileView} onChange={(e)=>setIsChecked({...IsChecked,IsProfileView:e.target.checked})}>Credit per profile view.</Checkbox>
                        <Checkbox name="IsHybridModel" checked={IsChecked?.IsHybridModel} onChange={(e)=>setIsChecked({...IsChecked,IsHybridModel:e.target.checked})}>Do you want to continue with Hybrid model ?</Checkbox>
                    </div>                   
                    <div>
                    <button type='button' className={userDetails.btn} onClick={handleSubmit}>SUBMIT</button>
                    </div>     
                </div>        
            </form>
            }
        </div>
    )
}

export default UserDetails;