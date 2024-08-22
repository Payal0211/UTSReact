import React, { useState, useEffect , useCallback} from "react";
import {  Modal, Tabs } from 'antd';
import HRDetailStyle from '../../screens/hrdetail/hrdetail.module.css';
import { ReactComponent as AssignCurrectSVG } from 'assets/svg/assignCurrentRight.svg';
import BeforePreOnboarding from "./beforePreOnboarding";
import LegalPreOnboarding from "./legalPreOnboarding";

export default function PreOnboardingTabModal({showAMModal, setShowAMModal, AMFlags,callAPI,getHrUserData}) {
    const [talentDeteils, setTalentDetais] = useState({})
    const [HRID, setHRID] = useState('')
    const [preOnboardingDetailsForAMAssignment,setPreOnboardingDetailsForAMAssignment] = useState({});
    const [legalPreOnboardingAMAssignment,setLegalPreOnboardingAMAssignment] = useState({});
    const [items, setItems] = useState([])
    const [activeKey , setActiveKey] = useState('Before Pre-Onboarding')
    const [actionType,setActionType] = useState('AMAssignment')
    const [message, setMessage] = useState({})    
    const EnableNextTab = useCallback((talentDeteil,HRID, tabLabel) =>{
        const tabList = [
            {
                label: 'Contract Details',
                key: 'Contract Details',
                children: <BeforePreOnboarding 
                preOnboardingDetailsForAMAssignment={preOnboardingDetailsForAMAssignment} 
                setPreOnboardingDetailsForAMAssignment={setPreOnboardingDetailsForAMAssignment} 
                talentDeteils={talentDeteil} HRID={HRID}  setShowAMModal={setShowAMModal} EnableNextTab={EnableNextTab} callAPI={callAPI} actionType={actionType} setMessage={setMessage} getHrUserData={getHrUserData}/>,
            },
            {
                label: 'Legal',
                key: 'Legal', 
                children: <LegalPreOnboarding  setLegalPreOnboardingAMAssignment={setLegalPreOnboardingAMAssignment}
                talentDeteils={AMFlags.talent} HRID={AMFlags.hrID}  setShowAMModal={setShowAMModal} EnableNextTab={EnableNextTab} callAPI={callAPI} actionType={AMFlags.actionType} setMessage={setMessage} getHrUserData={getHrUserData}
                />,
            },
            // {
            //     label: 'During Pre-Onboarding',
            //     key: 'During Pre-Onboarding',
            //     children: <DuringPreOnboarding  talentDeteils={talentDeteil} HRID={HRID} setShowAMModal={setShowAMModal} EnableNextTab={EnableNextTab} callAPI={callAPI} />,
            // },
            // {
            //     label: 'Complete Legal',
            //     key: 'Complete Legal',
            //     children: <CompleteLegal talentDeteils={talentDeteil} HRID={HRID} setShowAMModal={setShowAMModal} EnableNextTab={EnableNextTab}  callAPI={callAPI} />
            // },
            // {
            //     label: 'Before Kick-off',
            //     key: 'Before Kick-off',
            //     children: <BeforeKickOff talentDeteils={talentDeteil} HRID={HRID} setShowAMModal={setShowAMModal} EnableNextTab={EnableNextTab} callAPI={callAPI} />,
            // },
            // {
            //     label: 'After Kick-off',
            //     key: 'After Kick-off',
            //     children: <AfterKickOff talentDeteils={talentDeteil} HRID={HRID} setShowAMModal={setShowAMModal} EnableNextTab={EnableNextTab} callAPI={callAPI} />,
            // },
        ]

       let tabIndex = tabList.findIndex(tab => tab.label === tabLabel) 
       let ReqTabs = tabList.splice(0, tabIndex + 1)
    //    let tabWithDisabledState =  ReqTabs.map((tab, index)=>{
    //     return {...tab, disabled: index !== tabIndex}
    // })
       setItems(ReqTabs)
       setActiveKey(tabLabel)
    },[actionType,setShowAMModal,callAPI,getHrUserData])

    // create tabs based on flags
    useEffect(() =>{
        if(AMFlags?.tabLabel){

            const tabList = [
                {
                    label: 'Contract Details',
                    key: 'Contract Details',
                    children: <BeforePreOnboarding  
                    preOnboardingDetailsForAMAssignment={preOnboardingDetailsForAMAssignment} 
                    setPreOnboardingDetailsForAMAssignment={setPreOnboardingDetailsForAMAssignment}
                    talentDeteils={AMFlags.talent} HRID={AMFlags.hrID}  setShowAMModal={setShowAMModal} EnableNextTab={EnableNextTab} callAPI={callAPI} actionType={AMFlags.actionType} setMessage={setMessage} getHrUserData={getHrUserData}/>,
                },
                {
                    label: 'Legal',
                    key: 'Legal',
                    children: <LegalPreOnboarding 
                    setLegalPreOnboardingAMAssignment={setLegalPreOnboardingAMAssignment}
                    talentDeteils={AMFlags.talent} HRID={AMFlags.hrID}  setShowAMModal={setShowAMModal} EnableNextTab={EnableNextTab} callAPI={callAPI} actionType={AMFlags.actionType} setMessage={setMessage} getHrUserData={getHrUserData}/>,
                },
                // {
                //     label: 'During Pre-Onboarding',
                //     key: 'During Pre-Onboarding',
                //     children: <DuringPreOnboarding  talentDeteils={AMFlags.talent} HRID={AMFlags.hrID} setShowAMModal={setShowAMModal} EnableNextTab={EnableNextTab}  callAPI={callAPI} />,
                // },
                // {
                //     label: 'Complete Legal',
                //     key: 'Complete Legal',
                //     children: <CompleteLegal talentDeteils={AMFlags.talent} HRID={AMFlags.hrID} setShowAMModal={setShowAMModal} EnableNextTab={EnableNextTab} callAPI={callAPI} />
                // },
                // {
                //     label: 'Before Kick-off',
                //     key: 'Before Kick-off',
                //     children: <BeforeKickOff talentDeteils={AMFlags.talent} HRID={AMFlags.hrID} setShowAMModal={setShowAMModal}  EnableNextTab={EnableNextTab} callAPI={callAPI} />,
                // },
                // {
                //     label: 'After Kick-off',
                //     key: 'After Kick-off',
                //     children: <AfterKickOff talentDeteils={AMFlags.talent} HRID={AMFlags.hrID} setShowAMModal={setShowAMModal}  EnableNextTab={EnableNextTab} callAPI={callAPI} />,
                // },
            ]

           let tabIndex = tabList.findIndex(tab => tab.label === AMFlags.tabLabel) 
           let ReqTabs = tabList.splice(0, tabIndex + 1)
            // let tabWithDisabledState =  ReqTabs.map((tab, index)=>{
            //     return {...tab, disabled:index !== tabIndex}
            // })
//            console.log({tabIndex,AMFlags ,ReqTabs})
           
// console.log(AMFlags.actionType,"AMFlags.actionType")
           setItems(ReqTabs)
           setActiveKey(AMFlags?.tabLabel)
           setTalentDetais(AMFlags.talent)
           setActionType(AMFlags.actionType)
           setHRID(AMFlags.hrID)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[AMFlags])
    return (
    <Modal
    transitionName=""
    className="assignAMModal"
    centered
    open={showAMModal}
    width="1256px"
    footer={null}
    onCancel={() => {
        // setIsLoading(false);
        setShowAMModal(false);
    }}>
    <div className={HRDetailStyle.modalInnerWrapper}>
       {message?.Message && <div className={HRDetailStyle.onbordingAssignMsgMain}>
            <div className={HRDetailStyle.onbordingAssignMsg} style={{background: message?.ColorCode}}>
                <div className={HRDetailStyle.onbordingCurrentImg}>
                    <AssignCurrectSVG width="24" height="24" />
                </div>
                {message?.Message }
            </div>
        </div>}        

        <div className={HRDetailStyle.modalLabel}>{preOnboardingDetailsForAMAssignment?.pageTitle ? preOnboardingDetailsForAMAssignment?.pageTitle  : legalPreOnboardingAMAssignment?.getLegalInfo?.pageTitle}</div>
        <div className={HRDetailStyle.modalLabelMsg}>Kindly provide the required information</div>

        {/* HTML Code Starts for Modal - Before Pre-Onboarding */}
        <Tabs
            onChange={(e) => setActiveKey(e)}
            defaultActiveKey="1"
            activeKey={activeKey}
            animated={true}
            tabBarGutter={50}
            tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
            items={items}
        />
        {/* HTML Code Ends for Modal - Before Pre-Onboarding */}

        
    </div>
</Modal>
  );
}
