import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import DebriefingHR from 'modules/hiring request/components/debriefingHR/debriefingHR';
import HRFields from 'modules/hiring request/components/hrFields/hrFields';
import AddNewClientStyle from './add_new_client.module.css';
import ClientField from 'modules/client/components/clientField/clientField';
import { useLocation } from 'react-router-dom';

const AddNewClientScreen = () => {
	const [title, setTitle] = useState('Add New Client');

	const [clientDetail, setClientDetails] = useState({});
	const [tabFieldDisabled, setTabFieldDisabled] = useState({
		addNewClient: false,
		addNewHiringRequest: true,
		debriefingHR: true,
	});

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
								/>
							),
						},
						{
							label: 'Add New Hiring Requests',
							key: 'Add New Hiring Requests',
							children: (
								<HRFields
									setTitle={setTitle}
									tabFieldDisabled={tabFieldDisabled}
									setTabFieldDisabled={setTabFieldDisabled}
									clientDetail={clientDetail}
								/>
							),
							disabled: tabFieldDisabled.addNewHiringRequest,
						},
						{
							label: 'Debriefing HR',
							key: 'Debriefing HR',
							children: (
								<DebriefingHR
									setTitle={setTitle}
									tabFieldDisabled={tabFieldDisabled}
									setTabFieldDisabled={setTabFieldDisabled}
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
