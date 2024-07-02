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
import moment from 'moment';


function AllNotes({onClose, allNotes,onEditNote,deleteNote}) {
    const EmpID = localStorage.getItem('EmployeeID')
    return (<>
        <div className={AddNotesStyle.addNotesModal}>
            <div className={AddNotesStyle.addNotesTitle}>
                <h2>All Notes</h2>
            </div>

            <div className={AddNotesStyle.addNotesList}>
                {allNotes?.map(note => {
                    return  <div className={AddNotesStyle.addNoteItem}>
                        {note.EmployeeID === EmpID &&  <div className={AddNotesStyle.addNoteAction}>
                        <button type="button" className={AddNotesStyle.addNoteBtn} title='Edit' onClick={()=> onEditNote(note)}><EditIcon /></button>
                        <button type="button" className={AddNotesStyle.addNoteBtn} title='Delete' onClick={()=>deleteNote(note)}><DeleteIcon /></button>
                    </div>}
                   
                    <h4>{note?.EmployeeName}  {moment(note.Added_Date).format('DD MMM YYYY')}   {/* 11:12 AM*/}</h4>
                    <p>{note.Notes}</p>
                </div>
                
                })}
            </div>


            <div className={AddNotesStyle.formPanelAction}>
                <button type="submit" className={AddNotesStyle.btnPrimary} onClick={onClose}>Cancel</button>
            </div>
        </div>
    </>
    )
}

export default AllNotes