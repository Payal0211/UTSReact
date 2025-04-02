import React from 'react'
import { ReactComponent as EditIcon } from 'assets/svg/editIcon.svg';
import { ReactComponent as DeleteIcon } from 'assets/svg/deleteIcon.svg';
import AddNotesStyle from './addNotes.module.css';
import moment from 'moment';

function ViewNotes({onClose,viewNoteData,showAll,deleteNote,onEditNote}) {
    return (<>
        <div className={AddNotesStyle.addNotesModal}>

            <div className={AddNotesStyle.addNotesList}>
                <div className={`${AddNotesStyle.addNoteItem} ${AddNotesStyle.viewNoteItem}`}>
                    <div className={AddNotesStyle.addNoteAction} style={{display:'flex',justifyContent:'space-between',width:'55px'}}>
                        <button type="button" className={AddNotesStyle.addNoteBtn} title='Edit' onClick={()=> onEditNote(viewNoteData)}><EditIcon /></button>
                        <button type="button" className={AddNotesStyle.addNoteBtn} title='Delete' onClick={()=> deleteNote(viewNoteData)}><DeleteIcon /></button>
                    </div>
                    <h4>{viewNoteData?.EmployeeName}  {moment(viewNoteData.Added_Date).format('DD MMM YYYY')}</h4>
                    <p dangerouslySetInnerHTML={{__html:viewNoteData.Notes}}></p>
                </div>
            </div>


            <div className={AddNotesStyle.formPanelAction}>
                <button type="button" onClick={showAll}>View all notes</button>
                <button type="submit" className={AddNotesStyle.btnPrimary} onClick={onClose}>Cancel</button>
            </div>
        </div>
    </>
    )
}

export default ViewNotes