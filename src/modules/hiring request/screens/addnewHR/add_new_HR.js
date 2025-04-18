import { Tabs } from 'antd';
import { useState, useEffect } from 'react';
import DebriefingHR from 'modules/hiring request/components/debriefingHR/debriefingHR';
import HRFields from 'modules/hiring request/components/hrFields/hrFields';
import AddNewHRStyle from './add_new_HR.module.css';
import EditHRFields from 'modules/hiring request/components/editHRfields/editHRFields';
import EditDebriefingHR from 'modules/hiring request/components/editDebrieingHR/editDebriefingHR';
import { useLocation, useParams } from 'react-router-dom';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';

const AddNewHR = () => {
	
	const [tabFieldDisabled, setTabFieldDisabled] = useState({
		addNewHiringRequest: false,
		debriefingHR: true,
	});
	const [addData,setAddData] = useState({});

	const navigateParams = useLocation();
	const {hrid} = useParams()

	//for isskill change 
	const [originalDetails , setOriginalDetails ] = useState({})

	// const [fromEditDeBriefing, setFromEditDeBriefing] = useState({
	// 	addNewHiringRequest: false,
	// 	debriefingHR: true,
	// });
	const [JDParsedSkills, setJDParsedSkills] = useState({
		Skills: [],
		Responsibility: '',
		Requirements: '',
	});

	const paramsURL = window?.location?.pathname?.split('/')?.[2];
	const [enID, setEnID] = useState('');
	const [jdDumpID, setJDDumpID] = useState('');
	const [getHRdetails, setHRdetails] = useState({});
	const [getCompanyName, setCompanyName] = useState();
	const [ EditTitle, setEditTitle] = useState('Edit Hiring Requests')

	const [defaultPropertys, setDefaultPropertys] = useState(null);
	const [disabledFields, setDisabledFields] = useState(null);
	const [removeFields, setRemoveFields] = useState(null)
	const [isDirectHR, setIsDirectHR] = useState(false)
	const [isBDRMDRUser ,setIsBDRMDRUser] = useState(false)
	const [AboutCompanyDesc, setAboutCompanyDesc ] = useState(null)
	const [userCompanyTypeID, setUserCompanyTypeID] = useState(null)
	const [isHaveJD, setIsHaveJD] = useState(0);
	const[parseType,setParseType] = useState('JDFileUpload');

	useEffect(()=>{
		if(getHRdetails?.addHiringRequest?.hrNumber){
			setEditTitle(`Edit ${getHRdetails?.addHiringRequest?.hrNumber}`)
			if(hrid && localStorage.getItem('fromEditDeBriefing')){
				setTitle(`Debriefing ${getHRdetails?.addHiringRequest?.hrNumber}`)
			}
			if(hrid && !localStorage.getItem('fromEditDeBriefing')) {			
				setTitle(`Edit ${getHRdetails?.addHiringRequest?.hrNumber}`)
			}
			
			setIsDirectHR(getHRdetails?.directHiringInfo_edit?.isDirectHR)		
			setIsBDRMDRUser(getHRdetails?.directHiringInfo_edit?.isBDR_MDRUser)
			setRemoveFields(getHRdetails?.directHiringInfo_edit?.removeFields)
			setDefaultPropertys(getHRdetails?.directHiringInfo_edit?.defaultProperties)
		}   
	},[getHRdetails?.addHiringRequest?.hrNumber,getHRdetails?.addHiringRequest?.isActive,tabFieldDisabled])

	// useEffect(()=>{
	// 	if(!getHRdetails?.addHiringRequest?.isActive){
	// 		setTabFieldDisabled({ ...tabFieldDisabled, debriefingHR: true })
	// 	}else{
	// 		setTabFieldDisabled({ ...tabFieldDisabled, debriefingHR: false })
	// 	}
	// },[getHRdetails?.addHiringRequest?.isActive,tabFieldDisabled])

	const [title, setTitle] = useState(
		hrid
			? EditTitle
			: 'Add New Hiring Requests',
	);

	useEffect(() => {
		localStorage.setItem('enIDdata', enID);
	}, [enID]);

	/** This CODE I DONT HAVE IDEA WHY SUNDARAM BHAI HAS USED */
	const interviewDetails = (e) => {
		setHRdetails(e);
	};

	const companyName = (e) => {
		setCompanyName(e);
	};

	const callHRLoginInfo = async () => {
		let result  = await hiringRequestDAO.getLoginHrInfoRequestDAO()
		// console.log(result);
		if(result.statusCode === HTTPStatusCode.OK){	
			setIsDirectHR(result.responseBody.isDirectHR)		
			setRemoveFields(result.responseBody.removeFields)
			setDisabledFields(prev=>({...prev,talentRequired:result.responseBody.disabledFields}))
			setDefaultPropertys(result.responseBody.defaultProperties)
		}
	}

	useEffect(() => {
		callHRLoginInfo()
	},[])

	return (
		<div className={AddNewHRStyle.addNewContainer}>
			<div className={AddNewHRStyle.addHRTitle}>{title}</div>
			{!hrid && (
				<Tabs
					onChange={(e) => setTitle(e)}
					defaultActiveKey="1"
					activeKey={title}
					animated={true}
					tabBarGutter={50}
					tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
					items={[
						{
							label: 'Add New Hiring Requests',
							key: 'Add New Hiring Requests',
							children: (
								<HRFields
									setTitle={setTitle}
									tabFieldDisabled={tabFieldDisabled}
									setTabFieldDisabled={setTabFieldDisabled}
									setEnID={setEnID}
									setJDParsedSkills={setJDParsedSkills}
									JDParsedSkills={JDParsedSkills}
									setJDDumpID={setJDDumpID}
									jdDumpID={jdDumpID}
									interviewDetails={interviewDetails}
									companyName={companyName}
									params={paramsURL}
									isCloned={navigateParams?.isCloned || false}
									getHRdetails={getHRdetails}
									setHRdetails={setHRdetails}
									setAddData={setAddData}
									removeFields={removeFields}
									disabledFields={disabledFields}
									defaultPropertys={defaultPropertys}
									isDirectHR={isDirectHR}
									setAboutCompanyDesc={setAboutCompanyDesc}
									userCompanyTypeID={userCompanyTypeID}
									setUserCompanyTypeID={setUserCompanyTypeID}
									setDisabledFields={setDisabledFields}
									isHaveJD={isHaveJD}
									setIsHaveJD={setIsHaveJD}
									parseType={parseType}
									setParseType={setParseType}
								/>
							),
						},
						{
							label: 'Debriefing HR',
							key: 'Debriefing HR',
							children: (
								<DebriefingHR
									setTitle={setTitle}
									tabFieldDisabled={tabFieldDisabled}
									setTabFieldDisabled={setTabFieldDisabled}
									enID={enID}
									setJDParsedSkills={setJDParsedSkills}
									JDParsedSkills={JDParsedSkills}
									jdDumpID={jdDumpID}
									getHRdetails={getHRdetails}
									setHRdetails={setHRdetails}
									getCompanyName={getCompanyName}
									params={paramsURL}
									isCloned={navigateParams?.isCloned || false}
									addData={addData}
									disabledFields={disabledFields}
									AboutCompanyDesc={AboutCompanyDesc}
									isDirectHR={isDirectHR}
									userCompanyTypeID={userCompanyTypeID}
									setUserCompanyTypeID={setUserCompanyTypeID}
									isHaveJD={isHaveJD}
									setIsHaveJD={setIsHaveJD}
									parseType={parseType}
								/>
							),
							disabled: tabFieldDisabled.debriefingHR,
						},
					]}
				/>
			)}

			{hrid && (
				<Tabs
					onChange={(e) => setTitle(e)}
					defaultActiveKey="1"
					activeKey={title}
					animated={true}
					tabBarGutter={50}
					tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
					items={[
						{
							label: "Hiring Requests",
							key: EditTitle,
							children: (
								<EditHRFields
									setTitle={setTitle}
									tabFieldDisabled={tabFieldDisabled}
									setTabFieldDisabled={setTabFieldDisabled}
									setEnID={setEnID}
									setJDParsedSkills={setJDParsedSkills}
									getHRdetails={getHRdetails}
									setHRdetails={setHRdetails}
									setJDDumpID={setJDDumpID}
									jdDumpID={jdDumpID}
									removeFields={removeFields}
									disabledFields={disabledFields}
									isBDRMDRUser={isBDRMDRUser}
									isDirectHR={isDirectHR}
									setDisabledFields={setDisabledFields}
									originalDetails={originalDetails} 
									setOriginalDetails={setOriginalDetails} 
									isHaveJD={isHaveJD}
									setIsHaveJD={setIsHaveJD}
									parseType={parseType}
									setParseType={setParseType}
								/>
							),
							disabled: localStorage.getItem('fromEditDeBriefing') && true,
						},
						{
							label: 'Debriefing HR',
							key: `Debriefing ${getHRdetails?.addHiringRequest?.hrNumber}`,
							children: (
								<EditDebriefingHR
									setTitle={setTitle}
									tabFieldDisabled={tabFieldDisabled}
									setTabFieldDisabled={setTabFieldDisabled}
									enID={enID}
									setJDParsedSkills={setJDParsedSkills}
									JDParsedSkills={JDParsedSkills}
									getHRdetails={getHRdetails}
									setHRdetails={setHRdetails}
									jdDumpID={jdDumpID}
									removeFields={removeFields}
									disabledFields={disabledFields}
									isBDRMDRUser={isBDRMDRUser}
									isDirectHR={isDirectHR}originalDetails={originalDetails} 
									setOriginalDetails={setOriginalDetails} 
									isHaveJD={isHaveJD}
									setIsHaveJD={setIsHaveJD}
									parseType={parseType}
								/>
							),
							disabled: tabFieldDisabled?.debriefingHR,
						},
					]}
				/>
			)}
		</div>
	);
};

export default AddNewHR;
