import React from 'react'
import { Dropdown, Menu, Divider, List, Modal, message, Space } from 'antd';
import AlertIcon from 'assets/alertIcon.png'
import AddNotesStyle from './addNotes.module.css';
import { InputType } from 'constants/application';
import HRInputField from '../hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';

function EditNotes() {
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

            <div className={AddNotesStyle.editNotesItem}>
                Emily Chen is a strong candidate for the Marketing Manager role at ABC Corporation. She has a great background in digital marketing and a strong track record of driving campaign success. I'm excited to move forward with the next steps in the process. Please let me know if you have any questions or concerns.
            </div>

            <div className={AddNotesStyle.addNotesAlert}>
                <img src={AlertIcon} alt='alert-icon' />
                Please note that any notes you add here will also be accessible to the client.
            </div>

            <div className={AddNotesStyle.formPanelAction}>
                <button className={AddNotesStyle.btn} type='button'>Cancel</button>
                <button type="submit" className={AddNotesStyle.btnPrimary}>Save</button>
            </div>
        </div>
    </>
    )
}

export default EditNotes