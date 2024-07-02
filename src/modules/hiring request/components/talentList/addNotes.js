import React from 'react'
import { Dropdown, Menu, Divider, List, Modal, message, Space } from 'antd';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import AlertIcon from 'assets/alertIcon.png'
import AddNotesStyle from './addNotes.module.css';
import { InputType } from 'constants/application';
import HRInputField from '../hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';

function AddNotes({onCancel , item, apiData,setAllNotes}) {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch,
        resetField,
        formState: { errors },
    } = useForm();

    const saveNoteDetails = async (d) => {
        let payload = {
            "CompanyId":apiData?.ClientDetail?.CompanyId,
            "ContactId":apiData?.ClientDetail?.ContactId,
            "ContactName" : apiData?.ClientDetail?.ClientName,
            "ContactEmail" : apiData?.ClientDetail?.ClientEmail,
            "HiringRequest_ID": apiData?.HR_Id,
            "ATS_TalentID": item?.ATSTalentID,
            "Notes": d.addNoteForTalent,
            //"Note_Id":"VDM2cmhZdFA4ZlA3S2kxRWZCZTRodz09",
            // "IsDeleted":true,
            "EmployeeID": localStorage.getItem('EmployeeID'),
            "EmployeeName": localStorage.getItem('FullName')
    }
    
    let result = await hiringRequestDAO.saveTalentNotesDAO(payload)
    
    // console.log(payload, result)
    if(result.statusCode === 200) {
        setAllNotes(prev => ([{"Note_Id":result.responseBody.Note_Id, ...payload
            }, ...prev]))
            onCancel()
            resetField('addNoteForTalent')
    }else{
         message.error('Not able to add Note Something went Wrong. Please try again')
    }
        }
    return (<>
        <div className={AddNotesStyle.addNotesModal}>
            <div className={AddNotesStyle.addNotesTitle}>
                <h2>Add a note for talent</h2>
            </div>

            <div className={AddNotesStyle.addNotesAlert}>
                <img src={AlertIcon} alt='alert-icon' />
                Please note that any notes you add here will also be accessible to the client.
            </div>

            <HRInputField
                isTextArea={true}
                rows={4}
                // errors={errors}
                label={'Add note for talent'}
                register={register}
                name="addNoteForTalent"
                type={InputType.TEXT}
                placeholder="Type here..."
                required={true}
                errors={errors}
                validationSchema={{
                    required: "please enter a note for talent.",
                }}
            />

            <div className={AddNotesStyle.formPanelAction}>
                <button className={AddNotesStyle.btn} type='button' onClick={()=>{onCancel(); resetField('addNoteForTalent')}}>Cancel</button>
                <button type="submit" className={AddNotesStyle.btnPrimary} onClick={handleSubmit(saveNoteDetails)}>Save</button>
            </div>
        </div>
    </>
    )
}

export default AddNotes