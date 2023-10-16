import React, {useState} from 'react'
import changePasswordStyle from './changePassword.module.css'

export default function ChangePassword() {
    const [isValid, setIsValid] = useState({
        min8Char: "",
        oneLoweCase: "",
        oneSpeChar: "",
        oneUpperCase: "",
        oneNumber: ""
    })
  return (
    <div className={changePasswordStyle.mainContainer}>
        <div className={changePasswordStyle.mainInnerContainer}>
  <h3>Change Password</h3>


        <div className="col-12">
                                        <div className="checkboxMain">
                                            <label className={"checkboxWrap " + (isValid.min8Char === "true" ? "valid" : isValid.min8Char === "false" ? "notvalid" : "disabled")} >8 characters minimum
                                                <input type="checkbox" checked="checked" />
                                                <span className="checkmark"></span>
                                            </label>
                                            <label className={"checkboxWrap " + (isValid.oneLoweCase === "true" ? "valid" : isValid.oneLoweCase === "false" ? "notvalid" : "disabled")}>One lower case character
                                                <input type="checkbox" checked="checked" />
                                                <span className="checkmark"></span>
                                            </label>
                                            <label className={"checkboxWrap " + (isValid.oneSpeChar === "true" ? "valid" : isValid.oneSpeChar === "false" ? "notvalid" : "disabled")}>One special character
                                                <input type="checkbox" checked="checked" />
                                                <span className="checkmark"></span>
                                            </label>
                                            <label className={"checkboxWrap " + (isValid.oneUpperCase === "true" ? "valid" : isValid.oneUpperCase === "false" ? "notvalid" : "disabled")}>One upper case character
                                                <input type="checkbox" checked="checked" />
                                                <span className="checkmark"></span>
                                            </label>
                                            <label className={"checkboxWrap " + (isValid.oneNumber === "true" ? "valid" : isValid.oneNumber === "false" ? "notvalid" : "disabled")}>One number
                                                <input type="checkbox" checked="checked" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
        </div>
      
    </div>
  )
}
