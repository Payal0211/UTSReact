import React from 'react'
import { Dropdown, Menu, Divider, List, Modal, message, Space } from 'antd';
import AlertIcon from 'assets/alertIcon.png'
import AddNotesStyle from './addNotes.module.css';
import { InputType } from 'constants/application';
import HRInputField from '../hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';

function AddNotes() {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch,
        resetField,
        formState: { errors },
    } = useForm();
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
            />

            <div className={AddNotesStyle.formPanelAction}>
                <button className={AddNotesStyle.btn} type='button'>Cancel</button>
                <button type="submit" className={AddNotesStyle.btnPrimary}>Save</button>
            </div>
        </div>
    </>
    )
}

export default AddNotes