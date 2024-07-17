import { Tabs } from 'antd';

import React , {useState} from 'react'

const AllHiringRequest = React.lazy(() =>
	import('modules/hiring request/screens/allHiringRequest/all_hiring_request'),
);

function MainHRTabs() {
    const [title, setTitle] = useState('All Hiring Requests');
  return (
    <Tabs
    onChange={(e) => setTitle(e)}
    defaultActiveKey="1"
    activeKey={title}
    animated={true}
    tabBarGutter={50}
    tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
    items={[
        {
            label: 'All Hiring Requests',
            key: 'All Hiring Requests',
            children: <AllHiringRequest />
            
        },
        {
            label: 'Unassigned HRs',
            key: 'Unassigned HRs',
            children:<></>
           
        },
    ]}
/>
  )
}

export default MainHRTabs