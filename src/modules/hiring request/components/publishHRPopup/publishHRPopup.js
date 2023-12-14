import React, {useState} from 'react'
import { Modal } from "antd";
import PublishStyles from './publishHR.module.css'
import maskPNG from 'assets/mask.png'

export default function PublishHRPopup({handleOK,showModal, setShowModal}) {
 
  return (
    <Modal
    footer={false}
    width={'860px'}
    // title="GPT Response"
    open={showModal}
    onCancel={() => {
      setShowModal(false);
    }}
  >
<div className={PublishStyles.container}>
    <div>
        <div className={PublishStyles.maskbg}>
            <img src={maskPNG}  alt='mask'/>
        </div>
    </div>
    <div className={PublishStyles.infoContainer}>
           <h2 className={PublishStyles.heading}>Publish HR</h2>
    <p className={PublishStyles.para}>Our talent profiles will only be as good as the information provided you in this HR.<br/> Please ensure the accuracy and completeness of all information. </p>
    <ul>
        <li>This HR submission will be published on the Talent’s platform directly.</li>
        <li>
This information will be visible to talents, and they will start applying based on this information..
            </li>
<li>
Gen-AI screening will be generated based on the information provided in this form</li>
    </ul>
    <div>
        <button className={PublishStyles.edit} onClick={() => {
      setShowModal(false);
    }}>Edit</button>
        <button className={PublishStyles.create} onClick={() => {
      handleOK()
    }}>Publish HR</button>
    </div>
    {/* <div className={PublishStyles.bottomtext}>
         <p className={PublishStyles.bottomtext}>P.S. This mask is just to grab your attention on the severity of this action!!! </p>
    </div> */}
   
    </div>
 
    </div>
</Modal>
  )
}
