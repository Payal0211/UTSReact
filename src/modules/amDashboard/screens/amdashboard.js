import React, { useEffect, useMemo, useState } from 'react'
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
import moment from 'moment';

function AMDashboard() {
    const [ searchText , setSearchText] = useState('');
    const [title, setTitle] = useState("Active engagement");
    const [ticketTabTitle, setTicketTabTitle] = useState("Open");
    const [renewalTabTitle, setRenewalTabTitle] = useState("Active Renewal");
    const [selectedAM, setSelectedAM] = useState([])
    const [userData, setUserData] = useState({});
    const [summaryCount, setSummaryCount] = useState({});
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
                    userID: userData?.UserId,
                    EngType: title[0] 
                }
               
        } 
        let zohoPayload = {"userId":  userData?.UserId , status: ticketTabTitle[0] === 'O' ? 'A' : ticketTabTitle[0]  }
        let summaryPayload = {"userId":  userData?.UserId }
        const result = await amDashboardDAO.getDashboardDAO(payload)     
        const zohoResult = await amDashboardDAO.getZohoTicketsDAO(zohoPayload)
        const summaryResult = await amDashboardDAO.getSummaryDAO(summaryPayload)
        setLoading(false)
        // console.log('"zohoResult ', zohoResult)
        if(zohoResult?.statusCode === 200){
            setzohoTicketList(zohoResult.responseBody)
        }
        // console.log('"dd ', result)
        if(result?.statusCode === 200){
            setEngagementList(result.responseBody)
        }
        // console.log('summaryResult', summaryResult)
        if(summaryResult?.statusCode=== 200){
            setSummaryCount(summaryResult.responseBody)
        }
        }
       
    }

    const engColumnsMemo = useMemo(()=>{
        return [{
            title: 'Client Name',
            dataIndex: 'talentName',
            key: 'talentName',
            align: 'left',
            width: '100px',
        },
        {
            title: 'Renewal Date',
            dataIndex: '',
            key: '',
            align: 'left',
            width: '100px',
        },
        {
            title: 'Status',
            dataIndex: 'enggementStatus',
            key: 'enggementStatus',
            align: 'left',
            width: '100px',
        },
        {
            title: 'Engagent ID',
            dataIndex: 'engagementID',
            key: 'engagementID',
            align: 'left',
            width: '100px',
            render:(text,item)=>{
                return <Link to={`/viewOnboardDetails/${item.onBoardID}/${item.enggementStatus === "Ongoing" ? true : false }`} target='_blank'  style={{
                    color: `var(--uplers-black)`,
                    textDecoration: 'underline',
                }}>{item.engagementID}</Link>
            }
        },
        {
            title: 'HR #',
            dataIndex: 'hR_Number',
            key: 'hR_Number',
            align: 'left',
            width: '100px',
            render:(text,item)=>{
                return <Link
                to={`/allhiringrequest/${item.hrid}`}
                target='_blank'
                style={{ color: '#006699', textDecoration: 'underline' }}>
                {item.hR_Number}
            </Link>
            }
        },

    ]
    },[engagementList])

    const tableColumnsMemo=  useMemo(()=>{
        return [{
            title: 'Ticket #',
            dataIndex: 'ticketNumber',
            key: 'ticketNumber',
            align: 'left',
            width: '60px',
            render:(text,item)=>{
                return <a href={item.webUrl} target='_blank' rel="noreferrer"  style={{
                    color: `var(--uplers-black)`,
                    textDecoration: 'underline',
                }}>{text}</a>
            }
        },
        {
            title: 'Talent',
            dataIndex: 'talentName',
            key: 'talentName',
            align: 'left',
            width: '120px',
        },
        {
            title: 'Subjects',
            dataIndex: 'subject',
            key: 'subject',
            align: 'left',
            width: '120px',
        },
        // {
        //     title: 'Description',
        //     dataIndex: 'description',
        //     key: 'description',
        //     align: 'left',
        //     width: '120px',
        // },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'left',
            width: '60px',
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            align: 'left',
            width: '60px',
        },
        {
            title: 'Created Date',
            dataIndex: 'createdTime',
            key: 'createdTime',
            align: 'left',
            width: '100px',
            render:(text)=>{
                return moment(text).format('DD-MM-YYYY');
            }
        },
        {
            title: 'Last Updated Date',
            dataIndex: 'modifiedTime',
            key: 'modifiedTime',
            align: 'left',
            width: '100px',
            render:(text)=>{
                return text ? moment(text).format('DD-MM-YYYY') : '';
            }
        },
    ]
    },[zohoTicketList])

    useEffect(()=>{
        getFilters()
    },[])

    useEffect(()=>{
        getDashboardData()
    },[userData,selectedAM, title,ticketTabTitle])

    let isAdmin = userData.LoggedInUserTypeID !== ( 4 && 9) // Admin , AM, NBD

  return (
    <div className={amStyles.hiringRequestContainer}>
        <LogoLoader visible={isLoading} />

        <div className={amStyles.addnewHR} style={{ margin: '0px 0 12px 0'}}>
				<div className={amStyles.hiringRequest} >
					 Dashboard 
				</div>
				<LogoLoader visible={isLoading} />
			</div>

            {isAdmin &&    <div className={amStyles.filterContainer}>
            <div className={amStyles.filterSets} style={{justifyContent:'left'}}>
				<div className={amStyles.filterSetsInner}  style={{width:'40%'}}>
                  <Select
					id="selectedValue"
					placeholder="select AM" 
					mode="multiple"
					value={selectedAM}
					showSearch={true}
					onChange={(value, option) => {console.log({value, option}); setSelectedAM(value )}}
					options={amList}
                    optionFilterProp="label"
					getPopupContainer={(trigger) => trigger.parentElement}
				/>

               

					</div> <p className={amStyles.resetText} onClick={()=> setSelectedAM([])}>Reset Filter</p>
					{/* <div className={amStyles.filterRight}>
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
					</div> */}
				</div>
            </div>}
{console.log('summaryCount',summaryCount)}
            <div className={amStyles.filterSets}>
                        <div className={amStyles.ticketInfoDash}>
                            <h5>Active Tickets</h5>
                            <p>{summaryCount?.activeTickets ?? 0}</p>
                        </div>

                        <div className={amStyles.ticketInfoDash}>
                            <h5>Closed Tickets</h5>
                            <p>{summaryCount?.closedTickets ?? 0}</p>
                        </div>

                        <div className={amStyles.ticketInfoDash}>
                            <h5>Upcoming Renewals</h5>
                            <p>{summaryCount?.upcomingRenewals ?? 0}</p>
                        </div>

                        <div className={amStyles.ticketInfoDash}>
                            <h5>Total Clients</h5>
                            <p>{summaryCount?.totalClients ?? 0}</p>
                        </div>
            </div>

           

            <div className={amStyles.addnewHR} style={{margin:'20px 0'}}>
				<div className={amStyles.hiringRequest}  >
					Tickets
				</div>
			</div>


            <Tabs
                                    onChange={(e) => setTicketTabTitle(e)}
                                    defaultActiveKey="1"
                                    activeKey={ticketTabTitle}
                                    animated={true}
                                    tabBarGutter={50}
                                    tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
                                    items={[
                                        {
                                        label: "Open",
                                        key: "Open",
                                        children: <Table
                                        scroll={{ y: '480px'}}
                                        id="hrListingTable"
                                        columns={tableColumnsMemo}
                                        bordered={false}
                                        dataSource={zohoTicketList}
                                        pagination={false} 
                                        />,
                                        },
                                            {
                                            label: "Closed",
                                            key: "Closed",
                                            children: <Table
                                            scroll={{ y: '480px'}}
                                            id="hrListingTable"
                                            columns={tableColumnsMemo}
                                            bordered={false}
                                            dataSource={zohoTicketList}
                                            pagination={false} 
                                            />,
                                            },
                                        // {
                                        // label: "Closed engagement",
                                        // key: "Closed engagement",
                                        // children: <ActiveEngagementList />,
                                        // },
                                    ]}
                                    />


            

            <div className={amStyles.addnewHR} style={{margin:'20px 0'}}>
				<div className={amStyles.hiringRequest}  >
                    Client Renewals
				</div>
			</div>

            <div className={amStyles.clientRenewalsWarning} style={{marginBottom:'20px'}}>
                Client B's renewal is overdue!
            </div>

            <Tabs
                                    onChange={(e) => setRenewalTabTitle(e)}
                                    defaultActiveKey="1"
                                    activeKey={renewalTabTitle}
                                    animated={true}
                                    tabBarGutter={50}
                                    tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
                                    items={[
                                        {
                                        label: "Active Renewal",
                                        key: "Active Renewal",
                                        children:  <Table
                                        scroll={{ y: '480px'}}
                                        id="hrListingTable"
                                        columns={engColumnsMemo}
                                        bordered={false}
                                        dataSource={engagementList}
                                        pagination={false} 
                                        />,
                                        },
                                        {
                                            label: "Closed Renewal",
                                            key: "Closed Renewal",
                                            children:  <Table
                                            scroll={{ y: '480px'}}
                                            id="hrListingTable"
                                            columns={engColumnsMemo}
                                            bordered={false}
                                            dataSource={engagementList}
                                            pagination={false} 
                                            />,
                                            },
                                        // {
                                        // label: "Closed engagement",
                                        // key: "Closed engagement",
                                        // children: <ActiveEngagementList />,
                                        // },
                                    ]}
                                    />

           
            <div className={amStyles.addnewHR} style={{margin:'20px 0'}}>
				<div className={amStyles.hiringRequest}  >
					Engagements
				</div>
			</div>
      

            <div className={amStyles.mainContainer} style={{marginTop:'20px'}}>
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
                                        {
                                        label: "Closed engagement",
                                        key: "Closed engagement",
                                        children: <ActiveEngagementList data={engagementList} />,
                                        },
                                    ]}
                                    />


                                </div>
                                {/* <div className={amStyles.mainContainerInner}>
                                    <div className={amStyles.zohoMain}>
                                        <h4>Zoho Tickets</h4>

                                        {zohoTicketList.map(ticket=> <div>
                                            <div >
                                                <p>{ticket.subject}</p> <p>{ticket.status}</p>
                                            </div>
                                             </div>)}
                                    </div>
                                </div> */}


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