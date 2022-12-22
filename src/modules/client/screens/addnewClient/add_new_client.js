import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import DebriefingHR from 'modules/hiring request/components/debriefingHR/debriefingHR';
import HRFields from 'modules/hiring request/components/hrFields/hrFields';
import AddNewClientStyle from './add_new_client.module.css';
import ClientField from 'modules/client/components/clientField/clientField';
import { MasterDAO } from 'core/master/masterDAO';

const AddNewClientScreen = () => {
	const [salesMan, setSalesMan] = useState([]);
	const [title, setTitle] = useState('Add New Client');
	const [tabFieldDisabled, setTabFieldDisabled] = useState({
		addNewClient: false,
		addNewHiringRequest: true,
		debriefingHR: true,
	});

	const getSalesMan = async () => {
		let response = await MasterDAO.getSalesManRequestDAO();
		// console.log(response.responseBody.details);
		setSalesMan(response?.responseBody?.details);
	};
	useEffect(() => {
		getSalesMan();
	}, []);

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
									salesManData={salesMan && salesMan}
								/>
							),
						},
						{
							label: 'Add New Hiring Requests',
							key: 'Add New Hiring Requests',
							children: (
								<HRFields
									tabFieldDisabled={tabFieldDisabled}
									setTabFieldDisabled={setTabFieldDisabled}
								/>
							),
							disabled: tabFieldDisabled.addNewHiringRequest,
						},
						{
							label: 'Debriefing HR',
							key: 'Debriefing HR',
							children: (
								<DebriefingHR
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
