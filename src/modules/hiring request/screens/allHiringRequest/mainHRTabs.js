import { Tabs } from 'antd';

import React, { useState } from 'react'

import allHRStyles from "./all_hiring_request.module.css";

const AllHiringRequest = React.lazy(() =>
  import('modules/hiring request/screens/allHiringRequest/all_hiring_request'),
);

const UnassignedHRs = React.lazy(() =>
  import('modules/hiring request/screens/allHiringRequest/unassigned_hr'),
);

function MainHRTabs() {
  const [title, setTitle] = useState('All Hiring Requests');
  return (
    <>

      <div className={allHRStyles.hiringRequestWrap}>
        <Tabs
          onChange={(e) => setTitle(e)}
          defaultActiveKey="1"
          activeKey={title}
          animated={true}
          tabBarGutter={50}
          tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
          className='hiringRequestTab'
          items={[
            {
              label: 'All Hiring Requests',
              key: 'All Hiring Requests',
              children: title === "All Hiring Requests" && <AllHiringRequest />
            },
            {
              label: 'Unassigned HRs',
              key: 'Unassigned HRs',
              children: title === "Unassigned HRs" && <UnassignedHRs />
            },
          ]}
        />
      </div>
    </>
  )
}

export default MainHRTabs