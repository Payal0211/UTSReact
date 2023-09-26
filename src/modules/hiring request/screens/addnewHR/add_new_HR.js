import { Tabs } from 'antd';
import { useState, useEffect } from 'react';
import DebriefingHR from 'modules/hiring request/components/debriefingHR/debriefingHR';
import HRFields from 'modules/hiring request/components/hrFields/hrFields';
import AddNewHRStyle from './add_new_HR.module.css';
import EditHRFields from 'modules/hiring request/components/editHRfields/editHRFields';
import EditDebriefingHR from 'modules/hiring request/components/editDebrieingHR/editDebriefingHR';
import { useLocation } from 'react-router-dom';

const AddNewHR = () => {
	
	const [tabFieldDisabled, setTabFieldDisabled] = useState({
		addNewHiringRequest: false,
		debriefingHR: true,
	});
	const [addData,setAddData] = useState({});

	const navigateParams = useLocation();

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

	useEffect(()=>{
		if(getHRdetails?.addHiringRequest?.hrNumber){
			setEditTitle(`Edit ${getHRdetails?.addHiringRequest?.hrNumber}`)
			if(localStorage.getItem('hrID') && localStorage.getItem('fromEditDeBriefing')){
				setTitle(`Debriefing ${getHRdetails?.addHiringRequest?.hrNumber}`)
			}
			if(localStorage.getItem('hrID') && !localStorage.getItem('fromEditDeBriefing')) {			
				setTitle(`Edit ${getHRdetails?.addHiringRequest?.hrNumber}`)
			}	
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
		localStorage.getItem('hrID')
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

	return (
		<div className={AddNewHRStyle.addNewContainer}>
			<div className={AddNewHRStyle.addHRTitle}>{title}</div>
			{!localStorage.getItem('hrID') && (
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
									setJDDumpID={setJDDumpID}
									jdDumpID={jdDumpID}
									interviewDetails={interviewDetails}
									companyName={companyName}
									params={paramsURL}
									isCloned={navigateParams?.isCloned || false}
									getHRdetails={getHRdetails}
									setHRdetails={setHRdetails}
									setAddData={setAddData}
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
								/>
							),
							disabled: tabFieldDisabled.debriefingHR,
						},
					]}
				/>
			)}

			{localStorage.getItem('hrID') && (
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
