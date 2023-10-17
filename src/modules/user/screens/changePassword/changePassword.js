import React, { useEffect, useState } from "react";
import changePasswordStyle from "./changePassword.module.css";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { InputType } from "constants/application";
import { useForm } from "react-hook-form";
import {
  PasswordIconAiFillEye,
  PasswordIconAiFillEyeInvisible,
} from "shared/utils/password_icon_utils";
import { userDAO } from "core/user/userDAO";
import { HttpServices } from "shared/services/http/http_service";
import { HttpStatusCode } from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState({
    min8Char: "",
    oneLoweCase: "",
    oneSpeChar: "",
    oneUpperCase: "",
    oneNumber: "",
  });
  const [toggleOldPasswordVisibility, setToggleOldPasswordVisibility] =
    useState(true);
  const [toggleNewPasswordVisibility, setToggleNewPasswordVisibility] =
    useState(true);
  const [toggleConfirmPasswordVisibility, setToggleConfirmPasswordVisibility] =
    useState(true);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({});

    let _oldPassword = watch('oldPassword');
    let _newPassword = watch('newPassword');
    let _confirmPassword = watch('confirmPassword');

    useEffect(() => {
    if(_oldPassword){
      passwordValidationChecker(_oldPassword);
      setError("oldPassword", {
        type: "validate",
        message: "",
      });
    }   
    },[_oldPassword]);

    useEffect(() => {     
      if(_newPassword){
        passwordValidationChecker(_newPassword)
        setError("newPassword", {
          type: "validate",
          message: "",
        });
      }    
      },[_newPassword]);

      useEffect(() => {       
        if(_confirmPassword){
          passwordValidationChecker(_confirmPassword)
          setError("confirmPassword", {
            type: "validate",
            message: "",
          });
        }
        },[_confirmPassword]);

    const passwordValidationChecker = (passValue, name) => {
      let _passValue = passValue.trim();
      let _isValid = { ...isValid };
        let min8CharRegex = /.{8,}/;
        let oneLoweCaseRegex = /(?=.*?[a-z])/;
        let oneSpeCharRegex = /(?=.*?[#?!@$%^&*-])/;
        let oneUpperCaseRegex = /(?=.*?[A-Z])/;
        let oneNumberRegex = /(?=.*?[0-9])/;

        if (min8CharRegex.test(_passValue)) _isValid.min8Char = "true"
        else _isValid.min8Char = "false"

        if (oneLoweCaseRegex.test(_passValue)) _isValid.oneLoweCase = "true"
        else _isValid.oneLoweCase = "false"

        if (oneSpeCharRegex.test(_passValue)) _isValid.oneSpeChar = "true"
        else _isValid.oneSpeChar = "false"

        if (oneUpperCaseRegex.test(_passValue)) _isValid.oneUpperCase = "true"
        else _isValid.oneUpperCase = "false"

        if (oneNumberRegex.test(_passValue)) _isValid.oneNumber = "true"
        else _isValid.oneNumber = "false"
        setIsValid(_isValid);
    }

    const onResetPassword = async () => {
      let _valid = true
      if(!_oldPassword){
        setError("oldPassword", {
          type: "validate",
          message: "please enter the old password.",
        });
        _valid= false
      }
      if(!_newPassword){
        setError("newPassword", {
          type: "validate",
          message: "please enter the new password.",
        });
        _valid= false
      }
      if(!_confirmPassword){
        setError("confirmPassword", {
          type: "validate",
          message: "please enter the confirm password.",
        });
        _valid= false
      }
      if(isValid.min8Char !== "true" || isValid.oneLoweCase !== "true" || isValid.oneNumber !== "true" || isValid.oneSpeChar !== "true" || isValid.oneUpperCase !== 'true'){
        message.error("Please add valid password");
        _valid= false
      }
      if (_valid) {      
      let _token = localStorage.getItem('apiKey');
      const result = await userDAO.changePasswordDAO({        
        currentPassword: _oldPassword,
        newPassword: _newPassword,
        confirmPassword: _confirmPassword,
        token: _token
      });
      
      if (result.statusCode === HttpStatusCode.Ok) {
        message.success(result.responseBody.message);
        navigate('allhiringrequest');
      }else if(result.statusCode === HttpStatusCode.BadRequest){
        message.error(result.responseBody)
      }
    }
    }
  return (
    <div className={changePasswordStyle.mainContainer}>
      <div className={changePasswordStyle.mainInnerContainer}>
        <h3>Change Password</h3>

        <div>
          <div className={changePasswordStyle.loginPasswordField}>
            <HRInputField
              // onKeyDownHandler={(e) => handleKeyDown(e)}
              label="Old Password"
              name="oldPassword"
              type={
                toggleOldPasswordVisibility
                  ? InputType.PASSWORD
                  : InputType.TEXT
              }
              register={register}
              placeholder="Enter old password"
              errors={errors}
              validationSchema={{
                required: "please enter the old password.",
              }}
              onIconHandler={() =>
                setToggleOldPasswordVisibility((prev) => !prev)
              }
              trailingIcon={
                toggleOldPasswordVisibility ? (
                  <PasswordIconAiFillEyeInvisible />
                ) : (
                  <PasswordIconAiFillEye />
                )
              }            
              required  
            />
          </div>

          <div className={changePasswordStyle.loginPasswordField}>
            <HRInputField
              // onKeyDownHandler={(e) => handleKeyDown(e)}
              label="New Password"
              name="newPassword"
              type={
                toggleNewPasswordVisibility
                  ? InputType.PASSWORD
                  : InputType.TEXT
              }
              register={register}
              placeholder="Enter new password"
              errors={errors}
              validationSchema={{
                required: "please enter the new password.",
              }}
              onIconHandler={() =>
                setToggleNewPasswordVisibility((prev) => !prev)
              }
              trailingIcon={
                toggleNewPasswordVisibility ? (
                  <PasswordIconAiFillEyeInvisible />
                ) : (
                  <PasswordIconAiFillEye />
                )
              }              
              required
            />
          </div>

          <div className={changePasswordStyle.loginPasswordField}>
            <HRInputField
              // onKeyDownHandler={(e) => handleKeyDown(e)}
              label="Confirm New Password"
              name="confirmPassword"
              type={
                toggleConfirmPasswordVisibility
                  ? InputType.PASSWORD
                  : InputType.TEXT
              }
              register={register}
              placeholder="Re-enter your password"
              errors={errors}
              validationSchema={{
                required: "please enter the confirm password.",
              }}
              onIconHandler={() =>
                setToggleConfirmPasswordVisibility((prev) => !prev)
              }
              trailingIcon={
                toggleConfirmPasswordVisibility ? (
                  <PasswordIconAiFillEyeInvisible />
                ) : (
                  <PasswordIconAiFillEye />
                )
              }           
              required   
            />
          </div>
        </div>

        <div className="col-12">
          <div className={changePasswordStyle.checkboxMain}>
            <label className={changePasswordStyle.checkboxWrap}>
              8 characters minimum
              <span className={isValid.min8Char === "true" ? changePasswordStyle.validCheck : isValid.min8Char === "false" ? changePasswordStyle.notValidCheck : changePasswordStyle.disabledCheck}></span>
            </label>
            <label className={changePasswordStyle.checkboxWrap}>
              One lower case character
              <span className={isValid.oneLoweCase === "true" ? changePasswordStyle.validCheck : isValid.oneLoweCase === "false" ? changePasswordStyle.notValidCheck : changePasswordStyle.disabledCheck}></span>
            </label>
            <label className={changePasswordStyle.checkboxWrap}>
              One special character
              <span className={isValid.oneSpeChar === "true" ? changePasswordStyle.validCheck : isValid.oneSpeChar === "false" ? changePasswordStyle.notValidCheck : changePasswordStyle.disabledCheck}></span>
            </label>
            <label className={changePasswordStyle.checkboxWrap}>
              One upper case character
              <span className={isValid.oneUpperCase === "true" ? changePasswordStyle.validCheck : isValid.oneUpperCase === "false" ? changePasswordStyle.notValidCheck : changePasswordStyle.disabledCheck}></span>
            </label>
            <label className={changePasswordStyle.checkboxWrap}>
              One number
              <span className={isValid.oneNumber === "true" ? changePasswordStyle.validCheck : isValid.oneNumber === "false" ? changePasswordStyle.notValidCheck : changePasswordStyle.disabledCheck}></span>
            </label>
          </div>
        </div>

        <button className={changePasswordStyle.resetButton}        
        onClick={onResetPassword}>Reset Password</button>
      </div>
    </div>
  );
}
