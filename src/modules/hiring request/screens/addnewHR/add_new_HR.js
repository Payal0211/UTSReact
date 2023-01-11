import { Tabs } from 'antd';
import { useState } from 'react';
import DebriefingHR from 'modules/hiring request/components/debriefingHR/debriefingHR';
import HRFields from 'modules/hiring request/components/hrFields/hrFields';
import AddNewHRStyle from './add_new_HR.module.css';

const AddNewHR = () => {
	const [title, setTitle] = useState('Add New Hiring Requests');
	const [tabFieldDisabled, setTabFieldDisabled] = useState({
		addNewHiringRequest: false,
		debriefingHR: false,
	});

	return (
		<div className={AddNewHRStyle.addNewContainer}>
			<div className={AddNewHRStyle.addHRTitle}>{title}</div>
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
							/>
						),
						disabled: tabFieldDisabled.debriefingHR,
					},
				]}
			/>
		</div>
	);
};

export default AddNewHR;
