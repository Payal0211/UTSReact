import { Tabs } from 'antd';
import { useState, useEffect } from 'react';
import DebriefingHR from 'modules/hiring request/components/debriefingHR/debriefingHR';
import HRFields from 'modules/hiring request/components/hrFields/hrFields';
import AddNewHRStyle from './add_new_HR.module.css';
import EditHRFields from 'modules/hiring request/components/editHRfields/editHRFields';
import EditDebriefingHR from 'modules/hiring request/components/editDebrieingHR/editDebriefingHR';
import { useLocation } from 'react-router-dom';

const AddNewHR = () => {
	const [title, setTitle] = useState(
		localStorage.getItem('hrID')
			? 'Edit Hiring Requests'
			: 'Add New Hiring Requests',
	);
	const [tabFieldDisabled, setTabFieldDisabled] = useState({
		addNewHiringRequest: false,
		debriefingHR: true,
	});

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
							label: 'Edit Hiring Requests',
							key: 'Edit Hiring Requests',
							children: (
								<EditHRFields
									setTitle={setTitle}
									tabFieldDisabled={tabFieldDisabled}
									setTabFieldDisabled={setTabFieldDisabled}
									setEnID={setEnID}
									setJDParsedSkills={setJDParsedSkills}
									getHRdetails={getHRdetails}
									setHRdetails={setHRdetails}
								/>
							),
							disabled: localStorage.getItem('fromEditDeBriefing') && true,
						},
						{
							label: 'Edit Debriefing HR',
							key: 'Edit Debriefing HR',
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
								/>
							),
							disabled: tabFieldDisabled.debriefingHR,
						},
					]}
				/>
			)}
		</div>
	);
};

export default AddNewHR;
