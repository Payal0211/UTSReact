import React, { useEffect, useState } from 'react'
import amStyles from './amdashboard.module.css'
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { InputType } from 'constants/application';
import { Tabs, Select, Table, Modal } from 'antd';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { amDashboardDAO } from 'core/amdashboard/amDashboardDAO';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Link } from 'react-router-dom';
import LogoLoader from 'shared/components/loader/logoLoader';
import TicketModal from '../ticketModal/ticketModal';

function AMDashboard() {
    const [ searchText , setSearchText] = useState('');
    const [title, setTitle] = useState("Active engagement");
    const [selectedAM, setSelectedAM] = useState([])
    const [userData, setUserData] = useState({});
    const [amList,setAMList] = useState([])
    const [isLoading, setLoading] = useState(false);
    const [engagementList, setEngagementList] = useState([])
    const [zohoTicketList, setzohoTicketList] = useState([])
    const [showTimeline,setShowTimeLine] = useState(false)

	useEffect(() => {
		const getUserResult = async () => {
			let userData = UserSessionManagementController.getUserSession();
			if (userData) setUserData(userData);
		};
		getUserResult();
	}, []);

    const ActiveEngagementList = ({data}) =>{
        return <div className={amStyles.engagementListContainer}>
        {data.map(item=>{
            return <div className={amStyles.engagementList}>
                <span className={amStyles.amName}>{item.talentName}</span>
                <ul>
                    <li>Email ID: <span>{item.emailID}</span></li>
                    <li>Engagement ID: <span> <Link to={`/viewOnboardDetails/${item.onBoardID}/${item.enggementStatus === "Ongoing" ? true : false }`} target='_blank'  style={{
            color: `var(--uplers-black)`,
            textDecoration: 'underline',
        }}>{item.engagementID}</Link> </span></li>
                    <li>HR Number: <span><Link
							to={`/allhiringrequest/${item.hrid}`}
							target='_blank'
							style={{ color: '#006699', textDecoration: 'underline' }}>
							{item.hR_Number}
						</Link></span></li>
                </ul>
            </div>
        })}
        </div>
    }
    const getFilters = async ()=>{
        const result = await amDashboardDAO.getFiltersDAO()
        if(result.statusCode === 200){
            setAMList(result.responseBody.amName.map(val=> ({ value: val.value, label: val.text })))
        }
        console.log('filter', result)
    }

    const getDashboardData = async ()=>{
        if(userData?.UserId){
            setLoading(true)
             let payload = {
                "FilterFields_AMDashboard": {
                    amName:selectedAM.join(","),
                    userID: userData?.UserId
                }
               
        } 
        let zohoPayload = {"userId":  userData?.UserId  }
        const result = await amDashboardDAO.getDashboardDAO(payload)     
        const zohoResult = await amDashboardDAO.getZohoTicketsDAO(zohoPayload)
        setLoading(false)
        console.log('"zohoResult ', zohoResult)
        // if(zohoResult?.statusCode === 200){
        //     setzohoTicketList(zohoResult.responseBody)
        // }
        console.log('"dd ', result)
        if(result?.statusCode === 200){
            setEngagementList(result.responseBody)
            setzohoTicketList([
                {
                  "ticketId": 1,
                  "ticketNumber": "TCKT1001",
                  "subject": "Unable to login",
                  "description": "User reports being unable to log in to the portal",
                  "status": "Open",
                  "priority": "High",
                  "createdTime": "2024-12-11T14:30:00",
                  "modifiedTime": "2024-12-11T17:30:00",
                  "email": "johndoe@example.com",
                  "phone": "123-456-7890",
                  "channel": "Email"
                },
                {
                  "ticketId": 2,
                  "ticketNumber": "TCKT1002",
                  "subject": "Billing discrepancy",
                  "description": "Customer reports incorrect charges on their account.",
                  "status": "In Progress",
                  "priority": "Medium",
                  "createdTime": "2024-12-10T20:00:00",
                  "modifiedTime": "2024-12-11T15:30:00",
                  "email": "janesmith@example.com",
                  "phone": "987-654-3210",
                  "channel": "Phone"
                },
                {
                  "ticketId": 3,
                  "ticketNumber": "TCKT1003",
                  "subject": "Feature request: Dark Mode",
                  "description": "User requested a dark mode option in the application",
                  "status": "Closed",
                  "priority": "Low",
                  "createdTime": "2024-12-09T14:15:00",
                  "modifiedTime": "2024-12-10T20:30:00",
                  "email": "alicejohnson@example.com",
                  "phone": "456-789-1230",
                  "channel": "Phone"
                }
              ])
        }
        }
       
    }

    const getZohoTicket = async ()=>{
        if(userData?.UserId){
            
        }
       
    }

    useEffect(()=>{
        getFilters()
    },[])

    useEffect(()=>{
        getDashboardData()
    },[userData,selectedAM])

    let isAdmin = userData.LoggedInUserTypeID !== ( 4 || 9) // Admin , AM, NBD

  return (
    <div className={amStyles.hiringRequestContainer}>
        <LogoLoader visible={isLoading} />

        <div className={amStyles.addnewHR} style={{justifyContent:'center'}}>
				<div className={amStyles.hiringRequest} >
					 Dashboard 
				</div>
				<LogoLoader visible={isLoading} />
			</div>

            <div className={amStyles.filterSets}>
                        <div className={amStyles.ticketInfo}>
                            <h5>Active Tickets</h5>
                            <p>25</p>
                        </div>

                        <div className={amStyles.ticketInfo}>
                            <h5>Resolved Tickets</h5>
                            <p>25</p>
                        </div>

                        <div className={amStyles.ticketInfo}>
                            <h5>Pending Renewals</h5>
                            <p>25</p>
                        </div>

                        <div className={amStyles.ticketInfo}>
                            <h5>Total Clients</h5>
                            <p>50</p>
                        </div>
            </div>

            <div className={amStyles.addnewHR}>
				<div className={amStyles.hiringRequest}  onClick={()=>setShowTimeLine(true)}>
					Tickets
				</div>
			</div>

            <Table
            
            />

            {/* <div className={amStyles.filterContainer}>
            <div className={amStyles.filterSets}>
				<div className={amStyles.filterSetsInner}  style={{width:'30%'}}>
                {isAdmin &&  <Select
					id="selectedValue"
					placeholder="select AM" 
					mode="multiple"
					value={selectedAM}
					showSearch={true}
					onChange={(value, option) => {console.log({value, option}); setSelectedAM(value )}}
					options={amList}
                    optionFilterProp="label"
					getPopupContainer={(trigger) => trigger.parentElement}
				/>}

					</div>
					<div className={amStyles.filterRight}>
						<div className={amStyles.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={amStyles.searchInput}
								placeholder="Search Table"
								value={searchText}
								onChange={(e) => {
									 setSearchText(e.target.value)
									// return setDebouncedSearch(
									// 	engagementUtils.engagementListSearch(e, apiData),
									// );
								}}
							/>
						</div>
					</div>
				</div>
            </div> */}

            <div className={amStyles.mainContainer}>
                                <div className={amStyles.mainContainerInner}>
                                <Tabs
                                    onChange={(e) => setTitle(e)}
                                    defaultActiveKey="1"
                                    activeKey={title}
                                    animated={true}
                                    tabBarGutter={50}
                                    tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
                                    items={[
                                        {
                                        label: "Active engagement",
                                        key: "Active engagement",
                                        children: <ActiveEngagementList data={engagementList} />,
                                        },
                                        // {
                                        // label: "Closed engagement",
                                        // key: "Closed engagement",
                                        // children: <ActiveEngagementList />,
                                        // },
                                    ]}
                                    />


                                </div>
                                <div className={amStyles.mainContainerInner}>
                                    <div className={amStyles.zohoMain}>
                                        <h4>Zoho Tickets</h4>

                                        {zohoTicketList.map(ticket=> <div>
                                            <div >
                                                <p>{ticket.subject}</p> <p>{ticket.status}</p>
                                            </div>
                                             </div>)}
                                    </div>
                                </div>


            </div>


                <Modal
                width="930px"
						centered
						footer={null}
						className="engagementAddFeedbackModal"
						open={showTimeline}
						onCancel={() =>
							setShowTimeLine(false)
						}>
                <TicketModal />
                </Modal>

    </div>
  )
}

export default AMDashboard