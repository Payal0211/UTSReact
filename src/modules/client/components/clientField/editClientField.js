import { useState, useEffect, useCallback } from 'react';
import { Checkbox, message } from 'antd';
import { EmailRegEx, InputType, SubmitType } from 'constants/application';
import ClientFieldStyle from './clientField.module.css';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import EditClient from '../addClient/editClient';
import { MasterDAO } from 'core/master/masterDAO';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { useFieldArray, useForm } from 'react-hook-form';
import AddNewPOC from '../addPOC/addPOC';
import { useMemo } from 'react';
import {
	clientFormDataFormatter,
	getFlagAndCodeOptions,
} from 'modules/client/clientUtils';
import { HubSpotDAO } from 'core/hubSpot/hubSpotDAO';
import { ClientDAO } from 'core/client/clientDAO';
import { HTTPStatusCode } from 'constants/network';
import EditCompanyDetails from '../companyDetails/editCompanyDetails';
import { _isNull } from 'shared/utils/basic_utils';
import LogoLoader from 'shared/components/loader/logoLoader';
import { useNavigate } from 'react-router-dom'

export const secondaryClient = {
	en_Id: '',
	fullName: '',
	emailID: '',
	countryCode: '',
	phoneNumber: '',
	designation: '',
	linkedinProfile: '',
};
export const poc = {
	contactName: '',
};

const EditClientField = ({
	setTitle,
	tabFieldDisabled,
	setTabFieldDisabled,
	setInterviewDetails,
	interviewDetails,
	setClientDetails,
	setContactID,
    CompanyID
}) => {
    const navigate = useNavigate()
	const [messageAPI, contextHolder] = message.useMessage();
	const [companyName, setCompanyName] = useState('');
	const [primaryClientFullName, setPrimaryClientFullName] = useState('');
	const [primaryClientEN_ID, setPrimaryClientEN_ID] = useState('');
	const [primaryClientEmail, setPrimaryClientEmail] = useState('');
	const [legelInfoEN_ID, setLegelInfoEN_ID] = useState('')
	const [isSavedLoading, setIsSavedLoading] = useState(false);
	const [typeOfPricing,setTypeOfPricing] = useState(null)
	const [pricingTypeError,setPricingTypeError] = useState(false);
	const [profileSharingOption,setProfileSharingOption] = useState(null)
	const [profileSharingOptionError,setProfileSharingOptionError] = useState(false);
	const [payPerError,setPayPerError] = useState(false);
	const [creditError,setCreditError] = useState(false);
	const clientID = localStorage.getItem("clientID")
	const [checkPayPer, setCheckPayPer] = useState({
		companyTypeID:0,
		anotherCompanyTypeID:0
	});
	const [IsChecked,setIsChecked] = useState({
        isPostaJob:false,
        isProfileView:false,
    });
	const [payPerCondition,setPayPerCondition] = useState({
		companyTypeID:0,
		anotherCompanyTypeID:0
	})

	const [clientPOCs, setClientPOCs]  = useState([])
	/** ---- Useform()  Starts here --------- */
	const {
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		unregister,
		getValues,
		resetField,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			secondaryClient: [],
			pocList: [],
		},
	});
	// const [isLoading, setIsLoading] = useState(false);
	const [type, setType] = useState('');
	const [addClientResponse, setAddClientResponse] = useState(null);
	const [addClientResponseID, setAddClientResponseID] = useState(0);
	const [controlledLegalCountryCode, setControlledLegalCountryCode] =
		useState('+91');
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'secondaryClient',
	});
	const [base64Image, setBase64Image] = useState('');
	const [getUploadFileData, setUploadFileData] = useState('');
    const [base64ClientImage, setBase64ClientImage] = useState('');
	const [getUploadClientFileData, setUploadClientFileData] = useState('');
	const {
		fields: pocFields,
		append: appendPOC,
		remove: removePOC,
	} = useFieldArray({
		control,
		name: 'pocList',
	});
	const watchFields = watch([
		'primaryClientName',
		'primaryClientEmailID',
		'primaryClientPhoneNumber',
		'primaryDesignation',
		'companyName',
		'companyAddress',
		'primaryClientCountryCode',
	]);
	/** -------- UseForm Ends here --------------- */

	//** controlled fields */

	const [controlledCompanyLoacation, setControlledCompanyLoacation] = useState('Please Select')
	const [controlledLeadSource, setControlledLeadSource] = useState('Please Select')
	const [controlledLeadOwner, setControlledLeadOwner] = useState('Please Select')
	const [controlledLeadType, setControlledLeadType] = useState('Please Select')

	const [controlledprimaryContactName, setControlledprimaryContactName] = useState('Please Select')
	const [controlledsecondaryContactName, setControlledsecondaryContactName] = useState('Please Select')
	const [controlledsecondaryONEContactName, setControlledsecondaryONEContactName] = useState('Please Select')
	const [controlledsecondaryTWOContactName, setControlledsecondaryTWOContactName] = useState('Please Select')

	const [companyDetail, setCompanyDetail] = useState({})
	const [clientDetailCheckList,setClientDetailCheckList] = useState([])

	const [isSameAsPrimaryPOC, setSameAsPrimaryPOC] = useState(false);

	const [flagAndCode, setFlagAndCode] = useState([]);

	const SameASPrimaryPOCHandler = useCallback((e) => {
		// e.preventDefault();
		setSameAsPrimaryPOC(e.target.checked);
	}, []);

	/** -------- Masters API Starts here-------------- */

	const getCodeAndFlag = async () => {
		const getCodeAndFlagResponse = await MasterDAO.getCodeAndFlagRequestDAO();
		setFlagAndCode(
			getCodeAndFlagResponse && getCodeAndFlagResponse.responseBody,
		);
	};
	const flagAndCodeMemo = useMemo(
		() => getFlagAndCodeOptions(flagAndCode),
		[flagAndCode],
	);

	console.log(profileSharingOption,"profileSharingOptionprofileSharingOption");

	/** -------- Masters API Ends here-------------- */
	/** Submit the client form Starts */
	const clientSubmitHandler = async (d, type = SubmitType.SAVE_AS_DRAFT) => {
		// setIsLoading(true);
		setIsSavedLoading(true)
		if(typeOfPricing === null && !checkPayPer?.anotherCompanyTypeID==0 && (!checkPayPer?.companyTypeID==0 || !checkPayPer?.companyTypeID==2)){
			setIsSavedLoading(false)
			setPricingTypeError(true)
			return
		}
		if(profileSharingOption === null && IsChecked?.isProfileView){
			setIsSavedLoading(false)
			setProfileSharingOptionError(true)
			return
		}
		if(checkPayPer?.anotherCompanyTypeID==0 && checkPayPer?.companyTypeID==0){
			setIsSavedLoading(false)
			setPayPerError(true)
			return
		}
		if(checkPayPer?.companyTypeID===2 && IsChecked?.isPostaJob===false && IsChecked?.isProfileView===false){
			setIsSavedLoading(false)
			setCreditError(true)
			return
		}
		let clientFormDetails = clientFormDataFormatter({
			d,
			type,
			addClientResponseID,
			watch,
			addClientResponse,
			base64Image,
			getUploadFileData,
			companyName,
			primaryClientFullName,
			primaryClientEmail,
			primaryClientEN_ID,
			legelInfoEN_ID,
			companyDetail,
            base64ClientImage,
			checkPayPer,
			IsChecked,
			payPerCondition,
            getUploadClientFileData,typeOfPricing,clientPOCs,profileSharingOption}
		);

		let newPOClist = d.pocList.map(contact => {
			return {contactName: contact.contactName.id}
		})
		
		if(d.secondaryContactName?.id){
			newPOClist.unshift({contactName: d.secondaryContactName.id}) 
		}
		if(d.primaryContactName?.id){
			newPOClist.unshift({contactName: d.primaryContactName.id}) 
		}

		clientFormDetails['pocList'] = newPOClist		

		if (type === SubmitType.SAVE_AS_DRAFT) {
			if (_isNull(companyName)) {
				return setError('companyName', {
					type: 'emptyCompanyName',
					message: 'please enter the company name.',
				});
			} else if (_isNull(primaryClientFullName)) {
				return setError('primaryClientName', {
					type: 'emptyprimaryClientName',
					message: 'please enter the client name.',
				});
			} else {
				setError('primaryClientName', {
					type: 'emptyprimaryClientName',
					message: '',
				});
			}
		} else if (type !== SubmitType.SAVE_AS_DRAFT) {
			setType(SubmitType.SAVE_AS_DRAFT);
		}
		if(companyDetail.en_Id){
        	const addClientResult = await ClientDAO.createClientDAO(clientFormDetails);

		if (addClientResult.statusCode === HTTPStatusCode.OK) {
			setIsSavedLoading(false)
			setAddClientResponse(addClientResult?.responseBody?.details);
			type !== SubmitType.SAVE_AS_DRAFT && navigate('/allClients');
			type !== SubmitType.SAVE_AS_DRAFT &&
				setAddClientResponseID(
					addClientResult?.responseBody?.details?.contactId,
				);
			type !== SubmitType.SAVE_AS_DRAFT &&
				setContactID(addClientResult?.responseBody?.details?.contactId);

			type !== SubmitType.SAVE_AS_DRAFT &&
				setTabFieldDisabled({
					...tabFieldDisabled,
					addNewHiringRequest: false,
				});
			type !== SubmitType.SAVE_AS_DRAFT &&
				setClientDetails(addClientResult?.responseBody?.details);

			type !== SubmitType.SAVE_AS_DRAFT &&
				setInterviewDetails(
					addClientResult?.responseBody?.details?.primaryClient,
				);

			type === SubmitType.SAVE_AS_DRAFT &&
				messageAPI.open({
					type: 'success',
					content: 'Client details has been saved to draft.',
				});
		}
		}else{
			setIsSavedLoading(false)
			return setError('companyName', {
				type: 'emptyCompanyName',
				message: 'please select a company.',
			})
		}
		
			setIsSavedLoading(false)
	};
	/** Submit the client form Ends */
	// console.log(addClientResponse, '--addClientResponse');
	useEffect(() => {
		getCodeAndFlag();
	}, []);

	useEffect(() => {
		if (isSameAsPrimaryPOC) {
			setValue('legalClientFullName', watchFields[0]);
			setValue('legalClientEmailID', watchFields[1]);
			setValue('legalClientPhoneNumber', watchFields[2]);
			setValue('legalClientDesignation', watchFields[3]);
			setValue('legalCompanyFullName', watchFields[4]);
			setValue('legalCompanyAddress', watchFields[5]);
			//setValue('legalCompanyAddress', watchFields[6]);
			setControlledLegalCountryCode(watchFields[6]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSameAsPrimaryPOC]);

	const resetAllFields = () => {

		setCompanyDetail({})  
		resetField('companyName')
		resetField('companyURL')
		resetField('companyLinkedinProfile')
		resetField('companyAddress')
		resetField('companySize')
		resetField('phoneNumber')
		setUploadFileData('')
		setControlledCompanyLoacation('Please Select')
		resetField('companyLocation')
		setControlledLeadSource('Please Select')
		resetField('companyLeadSource')
		setControlledLeadType('Please Select')
		resetField('companyInboundType')
		setControlledLeadOwner('Please Select')
		resetField('companyLeadOwner')
		resetField('jpCreditBalance')

		setPrimaryClientEN_ID('')
		resetField('primaryClientName')
		resetField('primaryClientEmailID')
		resetField('primaryDesignation')
		resetField('PrimaryClientLinkedinProfile')	
		resetField('primaryClientPhoneNumber')
		setClientDetailCheckList([])
		fields.forEach((_, ind)=> remove(ind))

   		setLegelInfoEN_ID('')
		resetField('legalClientFullName')
		resetField('legalClientEmailID')
		resetField('legalClientDesignation')
		resetField('legalCompanyFullName')
		resetField('legalCompanyAddress')


		setClientPOCs([])
		pocFields.forEach((_,ind)=> removePOC(ind))
		setControlledprimaryContactName('Please Select')
		resetField('primaryContactName')
		setControlledsecondaryContactName('Please Select')
		resetField('secondaryContactName')
		setControlledsecondaryONEContactName('Please Select')
		setControlledsecondaryTWOContactName('Please Select')		
			
    }

	useEffect(() => {
		companyDetail && setCheckPayPer({...checkPayPer,...{companyTypeID:companyDetail?.companyTypeID,anotherCompanyTypeID:companyDetail?.anotherCompanyTypeID}});
		companyDetail && setIsChecked({...IsChecked,...{isPostaJob:companyDetail?.isPostaJob,isProfileView:companyDetail?.isProfileView}});
	}, [companyDetail])

	
	useEffect(() => {
		if(checkPayPer?.anotherCompanyTypeID==1 && checkPayPer?.companyTypeID==0){
			setPayPerCondition({...payPerCondition,companyTypeID:1,anotherCompanyTypeID:0});
		}else
		if(checkPayPer?.anotherCompanyTypeID==1 && checkPayPer?.companyTypeID==2){
			setPayPerCondition({...payPerCondition,anotherCompanyTypeID:1,companyTypeID:2});
		}else
		if(checkPayPer?.companyTypeID==2  && checkPayPer?.anotherCompanyTypeID==0){
			setPayPerCondition({...payPerCondition,companyTypeID:2,anotherCompanyTypeID:0});
		}
		// else if(checkPayPer?.companyTypeID==1  && checkPayPer?.anotherCompanyTypeID==0){
			// 	setPayPerCondition({...payPerCondition,anotherCompanyTypeID:1});
			// }
		}, [checkPayPer])
		
	
	const getCompanyDetails = async (ID) => {
		resetAllFields()
		setIsSavedLoading(true)
		let companyDetailsData = await HubSpotDAO.getCompanyForEditDetailsDAO(ID)
	
		if(companyDetailsData?.statusCode === HTTPStatusCode.OK){
			setIsSavedLoading(false)
			const {companyDetails,contactDetails, companyContract ,contactPoc} = companyDetailsData.responseBody
			companyDetails && setCompanyDetail(companyDetails)  
			companyDetails?.companyName && setValue('companyName',companyDetails?.companyName)
			companyDetails?.website && setValue('companyURL',companyDetails?.website)
			companyDetails?.linkedInProfile	&& setValue('companyLinkedinProfile',companyDetails?.linkedInProfile)
			companyDetails?.address	&& setValue('companyAddress',companyDetails?.address)
			companyDetails?.companySize && setValue('companySize',companyDetails?.companySize)
			companyDetails?.aboutCompanyDesc && setValue('aboutCompany',companyDetails?.aboutCompanyDesc)
			// companyDetails?.jpCreditBalance && setValue("jpCreditBalance",companyDetails?.jpCreditBalance);
			setValue("jpCreditBalance",0);
			// companyDetails?.phone && setValue('phoneNumber',companyDetails?.phone)
			if(companyDetails?.phone){
				setValue('phoneNumber',companyDetails?.phone?.slice(3))
			}

			if(companyDetails?.companyLogo){
				setUploadFileData(companyDetails?.companyLogo)
			} 
			
			const matchId = Number(clientID); 
			const matchedObject = contactDetails.find(obj => obj.id === matchId);
			if (matchedObject) {
			const filteredData = contactDetails.filter(obj => obj.id !== matchId);
			const newData = [matchedObject, ...filteredData];
			setClientDetailCheckList(newData)
			if(newData){
				if(newData?.length === 1){
					let contactDetailobj = newData[0]
					contactDetailobj?.en_Id && setPrimaryClientEN_ID(contactDetailobj?.en_Id)
					contactDetailobj?.fullName && setValue('primaryClientName',contactDetailobj?.fullName)
					contactDetailobj?.emailID && setValue('primaryClientEmailID',contactDetailobj?.emailID)
					contactDetailobj?.designation && setValue('primaryDesignation',contactDetailobj?.designation)
					contactDetailobj?.linkedIn && setValue('PrimaryClientLinkedinProfile',contactDetailobj?.linkedIn)	
					contactDetailobj?.clientProfilePic && setUploadClientFileData(contactDetailobj?.clientProfilePic)
					if(contactDetailobj?.contactNo){
						if(contactDetailobj?.contactNo.includes('+91')){
							setValue('primaryClientPhoneNumber',contactDetailobj?.contactNo.slice(3))
						}else{
							setValue('primaryClientPhoneNumber',contactDetailobj?.contactNo)
						}								
					}						
				}

				if(newData?.length > 0 ){
					let contactDetailobj = newData[0]
					contactDetailobj?.en_Id && setPrimaryClientEN_ID(contactDetailobj?.en_Id)
					contactDetailobj?.fullName && setValue('primaryClientName',contactDetailobj?.fullName)
					contactDetailobj?.emailID && setValue('primaryClientEmailID',contactDetailobj?.emailID)
					contactDetailobj?.designation && setValue('primaryDesignation',contactDetailobj?.designation)
					contactDetailobj?.linkedIn && setValue('PrimaryClientLinkedinProfile',contactDetailobj?.linkedIn)
					contactDetailobj?.clientProfilePic && setUploadClientFileData(contactDetailobj?.clientProfilePic)
					if(contactDetailobj?.contactNo){
						if(contactDetailobj?.contactNo.includes('+91')){
							setValue('primaryClientPhoneNumber',contactDetailobj?.contactNo.slice(3))
						}else{
							setValue('primaryClientPhoneNumber',contactDetailobj?.contactNo)
						}								
					}
				}
			}

			if(companyContract?.id){
				companyContract?.en_Id && setLegelInfoEN_ID(companyContract?.en_Id)
				companyContract?.signingAuthorityName && setValue('legalClientFullName',companyContract?.signingAuthorityName)
				companyContract?.signingAuthorityEmail && setValue('legalClientEmailID',companyContract?.signingAuthorityEmail)
				companyContract?.signingAuthorityDesignation && setValue('legalClientDesignation',companyContract?.signingAuthorityDesignation)
				companyContract?.legalCompanyName && setValue('legalCompanyFullName',companyContract?.legalCompanyName)
				companyContract?.legalCompanyAddress && setValue('legalCompanyAddress',companyContract?.legalCompanyAddress)
			}

			if(contactPoc){
				setClientPOCs(contactPoc)
			}
			} else {
			console.log("No matching object found");
			}
			// setClientDetailCheckList(contactDetails)
		}
		setIsSavedLoading(false)
	}

    useEffect(()=>{
        getCompanyDetails(CompanyID)
    },[CompanyID])

	return (
		<div className={ClientFieldStyle.tabsBody}>
			{contextHolder}
			<EditCompanyDetails
				flagAndCodeMemo={flagAndCodeMemo}
				setError={setError}
				setValue={setValue}
				register={register}
				errors={errors}
				unregister={unregister}
				watch={watch}
				base64Image={base64Image}
				setBase64Image={setBase64Image}
				getUploadFileData={getUploadFileData}
				setUploadFileData={setUploadFileData}
				setCompanyName={setCompanyName}
				companyName={companyName}
				control={control}
				companyDetail={companyDetail}
				setCompanyDetail={setCompanyDetail}
				getCompanyDetails={getCompanyDetails}
				typeOfPricing={typeOfPricing}
				setTypeOfPricing={setTypeOfPricing}
				setPricingTypeError={setPricingTypeError}
				pricingTypeError={pricingTypeError}
				checkPayPer={checkPayPer}
				setCheckPayPer={setCheckPayPer}
				setIsChecked={setIsChecked}
				IsChecked={IsChecked}
				payPerError={payPerError}
				setPayPerError={setPayPerError}
				payPerCondition={payPerCondition}
				setCreditError={setCreditError}
				creditError={creditError}
				clientPOCs={clientPOCs}
				controlledFieldsProp={{controlledCompanyLoacation, setControlledCompanyLoacation,controlledLeadSource, setControlledLeadSource,controlledLeadOwner, setControlledLeadOwner,controlledLeadType, setControlledLeadType}}  
				setProfileSharingOption={setProfileSharingOption}
				setProfileSharingOptionError={setProfileSharingOptionError}
				profileSharingOption={profileSharingOption}
				profileSharingOptionError={profileSharingOptionError}
			/>
			<EditClient
				setError={setError}
				watch={watch}
				setValue={setValue}
				fields={fields}
				append={append}
				remove={remove}
				register={register}
				errors={errors}
				flagAndCodeMemo={flagAndCodeMemo}
				setPrimaryClientFullName={setPrimaryClientFullName}
				setPrimaryClientEmail={setPrimaryClientEmail}
				primaryClientEmail={primaryClientEmail}
				clientDetailCheckList={clientDetailCheckList}
                base64Image={base64ClientImage}
				setBase64Image={setBase64ClientImage}
				getUploadFileData={getUploadClientFileData}
				setUploadFileData={setUploadClientFileData}
			/>
			<div className={ClientFieldStyle.tabsFormItem}>
				<div className={ClientFieldStyle.tabsFormItemInner}>
					<div className={ClientFieldStyle.tabsLeftPanel}>
						<h3>Legal Information</h3>
						<p>
							Please provide the necessary information
							<br />
							for the signing authority
						</p>
					</div>

					<div className={ClientFieldStyle.tabsRightPanel}>
						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd12}>
								<div className={ClientFieldStyle.checkBoxGroup}>
									<Checkbox onClick={SameASPrimaryPOCHandler}>
										Same as primary client details
									</Checkbox>
								</div>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the legal client name.',
									}}
									label="HS Client Full Name"
									name="legalClientFullName"
									type={InputType.TEXT}
									placeholder="Enter full name"
									required
									disabled={isSameAsPrimaryPOC}
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the legal client email ID.',
										pattern: {
											value: EmailRegEx.email,
											message: 'please enter a valid email.',
										},
									}}
									label="HS Client Email ID"
									name={'legalClientEmailID'}
									type={InputType.EMAIL}
									placeholder="Enter Email ID"
									disabled={isSameAsPrimaryPOC}
									required
								/>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<div
									className={`${ClientFieldStyle.formGroup} ${ClientFieldStyle.phoneNoGroup}`}>
									<label>Client's Phone Number</label>
									<div className={ClientFieldStyle.phoneNoCode}>
										<HRSelectField
											setControlledValue={setControlledLegalCountryCode}
											controlledValue={controlledLegalCountryCode}
											isControlled={true}
											searchable={true}
											setValue={setValue}
											register={register}
											name="legalClientCountryCode"
											defaultValue="+91"
											options={flagAndCodeMemo}
											disabled={isSameAsPrimaryPOC}
										/>
									</div>
									<div className={ClientFieldStyle.phoneNoInput}>
										<HRInputField
											register={register}
											name={'legalClientPhoneNumber'}
											type={InputType.NUMBER}
											placeholder="Enter Phone number"
											disabled={isSameAsPrimaryPOC}
										/>
									</div>
								</div>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									label="Designation"
									name={'legalClientDesignation'}
									type={InputType.TEXT}
									placeholder="Enter designation"
									disabled={isSameAsPrimaryPOC}
								/>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the legal company name.',
									}}
									label="Legal Company Name"
									name={'legalCompanyFullName'}
									type={InputType.TEXT}
									placeholder="Enter legal name"
									disabled={isSameAsPrimaryPOC}
									required
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the legal company address.',
									}}
									label="Legal Company Address"
									name={'legalCompanyAddress'}
									type={InputType.TEXT}
									placeholder="Enter legal address"
									disabled={isSameAsPrimaryPOC}
									required
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<AddNewPOC
				setValue={setValue}
				fields={pocFields}
				append={appendPOC}
				remove={removePOC}
				register={register}
				errors={errors}
				watch={watch}
				clientPOCs={clientPOCs}
				controlledFieldsProp={{controlledprimaryContactName, setControlledprimaryContactName,controlledsecondaryContactName, setControlledsecondaryContactName,
					controlledsecondaryONEContactName, setControlledsecondaryONEContactName,controlledsecondaryTWOContactName, setControlledsecondaryTWOContactName }}
			/>
			<div className={ClientFieldStyle.formPanelAction}>
				<button
					style={{
						cursor: type === SubmitType.SAVE_AS_DRAFT ? 'no-drop' : 'pointer',
					}}
					onClick={()=> navigate(-1)}
					className={ClientFieldStyle.btn}>
					Cancel
				</button>
				<button
					// disabled={isLoading}
					type="submit"
					onClick={handleSubmit(clientSubmitHandler)}
					className={ClientFieldStyle.btnPrimary}>
					Save Changes
				</button>
			</div>
			<LogoLoader visible={isSavedLoading} />
		</div>
	);
};

export default EditClientField;
