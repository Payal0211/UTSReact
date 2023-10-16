import { Tabs } from 'antd';
import { useState } from 'react';
import DebriefingHR from 'modules/hiring request/components/debriefingHR/debriefingHR';
import HRFields from 'modules/hiring request/components/hrFields/hrFields';
import AddNewClientStyle from './add_new_client.module.css';
import ClientField from 'modules/client/components/clientField/clientField';

const AddNewClientScreen = () => {
	const [title, setTitle] = useState('Add New Client');

	const params = window?.location?.pathname?.split('/')?.[2];

	const [clientDetail, setClientDetails] = useState({});
	const [interviewDetails, setInterviewDetails] = useState(null);
	const [tabFieldDisabled, setTabFieldDisabled] = useState({
		addNewClient: false,
		addNewHiringRequest: true,
		debriefingHR: true,
	});
	const [enID, setEnID] = useState({});
	const [contactID, setContactID] = useState(0);
	const [JDParsedSkills, setJDParsedSkills] = useState({
		Skills: [],
		Responsibility: '',
		Requirements: '',
	});
	const [jdDumpID, setJDDumpID] = useState('');
	return (
		<div className={AddNewClientStyle.addNewContainer}>
			<div className={AddNewClientStyle.addHRTitle}>{title}</div>

			<div className={AddNewClientStyle.addNewTabsWrap}>
				<Tabs
					onChange={(e) => setTitle(e)}
					defaultActiveKey="1"
					activeKey={title}
					animated={true}
					tabBarGutter={50}
					tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
					items={[
						{
							label: 'Add New Client',
							key: 'Add New Client',
							children: (
								<ClientField
									setTitle={setTitle}
									tabFieldDisabled={tabFieldDisabled}
									setTabFieldDisabled={setTabFieldDisabled}
									setClientDetails={setClientDetails}
									setInterviewDetails={setInterviewDetails}
									interviewDetails={interviewDetails}
									setContactID={setContactID}
								/>
							),
						},
						{
							label: 'Add New Hiring Requests',
							key: 'Add New Hiring Requests',
							children: (
								<HRFields
									setEnID={setEnID}
									setTitle={setTitle}
									tabFieldDisabled={tabFieldDisabled}
									setTabFieldDisabled={setTabFieldDisabled}
									clientDetail={clientDetail}
									setJDParsedSkills={setJDParsedSkills}
									contactID={contactID}
									setJDDumpID={setJDDumpID}
									jdDumpID={jdDumpID}
									params={params}
									fromClientflow={true}
								/>
							),
							disabled: tabFieldDisabled.addNewHiringRequest,
						},
						{
							label: 'Debriefing HR',
							key: 'Debriefing HR',
							children: (
								<DebriefingHR
									interviewDetails={interviewDetails}
									enID={enID}
									setTitle={setTitle}
									tabFieldDisabled={tabFieldDisabled}
									setTabFieldDisabled={setTabFieldDisabled}
									setJDParsedSkills={setJDParsedSkills}
									JDParsedSkills={JDParsedSkills}
									jdDumpID={jdDumpID}
									clientDetail={clientDetail}
									params={params}
								/>
							),
							disabled: tabFieldDisabled.debriefingHR,
						},
					]}
				/>
			</div>
		</div>
	);
};

export default AddNewClientScreen;
