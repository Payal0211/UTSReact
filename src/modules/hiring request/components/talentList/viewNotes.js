import React from 'react'
import { Dropdown, Menu, Divider, List, Modal, message, Space } from 'antd';
import { ReactComponent as NotesIcon } from 'assets/svg/notesIcon.svg';
import { ReactComponent as EditIcon } from 'assets/svg/editIcon.svg';
import { ReactComponent as DeleteIcon } from 'assets/svg/deleteIcon.svg';
import { ReactComponent as InfoCircleIcon } from 'assets/svg/infoCircleIcon.svg';
import AddNotesStyle from './addNotes.module.css';
import { InputType } from 'constants/application';
import HRInputField from '../hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';

function ViewNotes() {
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

            <div className={AddNotesStyle.addNotesList}>
                <div className={`${AddNotesStyle.addNoteItem} ${AddNotesStyle.viewNoteItem}`}>
                    <div className={AddNotesStyle.addNoteAction}>
                        <button type="button" className={AddNotesStyle.addNoteBtn} title='Edit'><EditIcon /></button>
                        <button type="button" className={AddNotesStyle.addNoteBtn} title='Delete'><DeleteIcon /></button>
                    </div>
                    <h4>Stefan Mac    9 April 2024    11:12 AM</h4>
                    <p>Emily Chen is a strong candidate for the Marketing Manager role at ABC Corporation. She has a great background in digital marketing and a strong track record of driving campaign success. I'm excited to move forward with the next steps in the process. Please let me know if you have any questions or concerns.</p>
                </div>
            </div>


            <div className={AddNotesStyle.formPanelAction}>
                <button type="button">View all notes</button>
                <button type="submit" className={AddNotesStyle.btnPrimary}>Cancel</button>
            </div>
        </div>
    </>
    )
}

export default ViewNotes