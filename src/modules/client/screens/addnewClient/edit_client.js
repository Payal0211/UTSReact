import { useState } from 'react';
import AddNewClientStyle from './add_new_client.module.css';
import EditClientField from 'modules/client/components/clientField/editClientField';
import { useParams } from 'react-router-dom'

const AddNewClientScreen = () => {
    const { CompanyID} = useParams()

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
			<div className={AddNewClientStyle.addHRTitle}>Edit Client</div>

			<div className={AddNewClientStyle.addNewTabsWrap}>
            <EditClientField
									tabFieldDisabled={tabFieldDisabled}
									setTabFieldDisabled={setTabFieldDisabled}
									setClientDetails={setClientDetails}
									setInterviewDetails={setInterviewDetails}
									interviewDetails={interviewDetails}
									setContactID={setContactID}
                                    CompanyID={CompanyID}
								/>
			</div>
		</div>
	);
};

export default AddNewClientScreen;
