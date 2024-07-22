import CloneHRModalStyle from '../allHiringRequest/cloneHRModal.module.css';
import {useState} from 'react'
import { Radio,Checkbox } from 'antd';

const CloneHRModal = ({
	cloneHRhandler,
	onCancel,
	getHRnumber,
	navigateToCloneHR,
	isHRHybrid,
	companyID
}) => {
	const [disableOK , setDisableOK] = useState(false)
	const [typeOfPricing,setTypeOfPricing] = useState(null)
	const [userCompanyTypeID,setUserCompanyTypeID] = useState(1)
	const [isProfileView,setIsProfileView] = useState(false)
	const [isPostaJob,setIsPostaJob] = useState(false)
	const [isVettedProfile,setIsVettedProfile] = useState(true)

	const [isErrors,setIsErrors] = useState(false)

	const resetFields = () => {
		setTypeOfPricing(null)
		setUserCompanyTypeID(1)
		setIsVettedProfile(false)
		setIsPostaJob(false)
		setIsProfileView(false)
	}

	const handleHybridClone = () => {
		let ERROR = false
		setIsErrors(false)
		if(userCompanyTypeID === 1 ){
			if(typeOfPricing === null){ 
				ERROR = true
				setIsErrors(true)
			}
		}
		if(userCompanyTypeID === 2 ){
			if(!isProfileView && !isPostaJob){
				ERROR = true
				setIsErrors(true)
			}
		}

		if(ERROR){
			return
		}else{
			let payload = {
			// "hrid": 0,
			"companyId":companyID,
			"hybridModel": {
			  "payPerType": userCompanyTypeID,
			  "isTransparentPricing": typeOfPricing === 1 ? true : false,
			  "isPostaJob": isPostaJob,
			  "isProfileView": isProfileView,
			  "isVettedProfile": isVettedProfile
			}
		  }		
		  if(cloneHRhandler){cloneHRhandler(isHRHybrid,payload,resetFields);setDisableOK(true)}
		  else{navigateToCloneHR(isHRHybrid,payload,resetFields);setDisableOK(true)} 
		}

		
	}

	return (
		<div className={CloneHRModalStyle.cloneHRConfContent}>
			<h2>Are you sure want to clone {getHRnumber}</h2>

			{isHRHybrid && <>
				<div className={CloneHRModalStyle.colMd12}>
				<h4 style={{marginBottom:"12px"}}>
				Please select which type of Hr you want to create              
                </h4>
				</div>
						<div className={CloneHRModalStyle.colMd12}>
            <div style={{display:'flex',flexDirection:'column',marginBottom:'32px'}}> 
                  <label style={{marginBottom:"12px"}}>
                  Type Of Company
                  <span style={{color:'#E03A3A',marginLeft:'4px', fontSize:'14px',fontWeight:700}}>
                    *
                  </span>
                </label>
                {/* {pricingTypeError && <p className={HRFieldStyle.error}>*Please select pricing type</p>}
                {transactionMessage && <p className={HRFieldStyle.teansactionMessage}>{transactionMessage}</p> }  */}
                <Radio.Group
                  onChange={e=> {setUserCompanyTypeID(e.target.value)}}
                  value={userCompanyTypeID}
                  >
                  <Radio value={1}>Pay Per Hire</Radio>
                  <Radio value={2}>Pay Per Credit</Radio>
                </Radio.Group>
							</div>
            </div>

			{userCompanyTypeID === 2 && <div className={CloneHRModalStyle.colMd12} style={{marginBottom: '32px'}}>
  {/* {!clientDetails?.isHybrid && <p className={CloneHRModalStyle.teansactionMessage}>If you wish to create a pay per hire HR, edit company and make the hybrid model selection for this account.</p> } */}
  <div>
            <Checkbox checked={isPostaJob} onClick={()=> setIsPostaJob(prev=> !prev)}>
            <span style={{fontWeight:500}}>Credit per post a job</span>
						</Checkbox>	
            <Checkbox checked={isProfileView} onClick={()=> setIsProfileView(prev=> !prev)}>
            <span style={{fontWeight:500}}>Credit per profile view</span>
						</Checkbox>	
            </div>
            {isErrors&& (!isPostaJob && !isProfileView) && <p className={CloneHRModalStyle.error}>Please select Option</p>}
</div> }


{userCompanyTypeID === 2 && isProfileView && <div className={CloneHRModalStyle.colMd12} style={{marginBottom: '32px'}}>
<Radio.Group
                  onChange={e=> {setIsVettedProfile(e.target.value)}}
                  value={isVettedProfile}
                  >
                  <Radio value={false}>Fast Profile</Radio>
                  <Radio value={true}>Vetted Profile</Radio>
                </Radio.Group>
</div> }

{userCompanyTypeID === 1 && <div className={CloneHRModalStyle.colMd12}>
			<div style={{display:'flex',flexDirection:'column',marginBottom:'32px'}}> 
								<label style={{marginBottom:"12px"}}>
							Type Of pricing
							<span style={{color:'#E03A3A',marginLeft:'4px', fontSize:'14px',fontWeight:700}}>
								*
							</span>
						</label>
             {isErrors && typeOfPricing === null && <p className={CloneHRModalStyle.error}>*Please select pricing type</p>}
           {/* {transactionMessage && <p className={HRFieldStyle.teansactionMessage}>{transactionMessage}</p> }  */}
						<Radio.Group
							// defaultValue={'client'}
							// className={allengagementReplceTalentStyles.radioGroup}
							onChange={e=> {setTypeOfPricing(e.target.value)}}
							value={typeOfPricing}
							>
							<Radio value={1}>Transparent Pricing</Radio>
							<Radio value={0}>Non Transparent Pricing</Radio>
						</Radio.Group>
							</div>
			</div>}
			</>}


			

			<div className={CloneHRModalStyle.formPanelAction}>
				{cloneHRhandler ? (
					<button
						disabled={disableOK}
						className={CloneHRModalStyle.btnPrimary}
						onClick={() => {
							if(isHRHybrid){
								return handleHybridClone()
							}
							cloneHRhandler();
							setDisableOK(true)
							}}>
						Ok
					</button>
				) : (
					<button
						disabled={disableOK}
						className={CloneHRModalStyle.btnPrimary}
						onClick={() => {
							if(isHRHybrid){
								return handleHybridClone()
							}
							navigateToCloneHR();
							setDisableOK(true)
							}}>
						Ok
					</button>
				)}
				<button
					className={CloneHRModalStyle.btn}
					onClick={() => onCancel()}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default CloneHRModal;
