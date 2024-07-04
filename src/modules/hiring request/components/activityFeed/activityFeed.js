import { InputType } from 'constants/application';
import ActivityFeedStyle from './activityFeed.module.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { SlGraph } from 'react-icons/sl';
import React, { Fragment, useState, useMemo, Suspense, useEffect } from 'react';
import { DateTimeUtils } from 'shared/utils/basic_utils';
import { Divider, TabsProps, Space, Table, Tag, Modal, Skeleton, Tooltip} from 'antd';
import ReactPlayer from 'react-player';
import infoIcon from 'assets/svg/info.svg'


import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { BsTag } from 'react-icons/bs';
import DOMPurify from 'dompurify';
import moment from 'moment';


import FiCopySVG  from '../../../../assets/svg/fiCopy.svg';
import FiVideoSVG  from '../../../../assets/svg/fiVideo.svg';
import FiIconPDF  from '../../../../assets/svg/fiIconPDF.svg';
import FiIconWord  from '../../../../assets/svg/fiIconWord.svg';
import FiDownloadSVG  from '../../../../assets/svg/fiDownload.svg';
import FiLinkSVG from '../../../../assets/svg/fiLink.svg';
import FiExternalLinkSVG from '../../../../assets/svg/fiExternalLink.svg';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';
import { render } from '@testing-library/react';


const Editor = React.lazy(() => import('../textEditor/editor'));
class ChannelType {
	static images = 1
	static videos = 2
	static documents = 3
}

const dataSource = [
	{
		key: '1',
		link: 'John Brown',
		addedby: 'You',
		dateadded: 'Today',
		tags: ['nice', 'developer'],
	  },
	  {
		key: '2',
		link: 'Jim Green',
		addedby: 'You',
		dateadded: 'Today',
		tags: ['loser'],
	  },
	  {
		key: '3',
		link: 'Joe Black',
		addedby: 'You',
		dateadded: 'Today',
		tags: ['cool', 'teacher'],
	  },
];

const closeHRcolumns = [
	{
		title: 'Job post Closed',
		dataIndex: 'addedby',
		key: 'addedby',
		render:(val,data,index)=>{
			return `${index + 1} Time`
		}
		},
		{
			title: 'Date',
			dataIndex: 'createdByDateTime',
			key: 'createdByDateTime',
		},
		{
			title: 'By whom',
			dataIndex: 'fullName',
			key: 'fullName',
		},
		{
			title: 'Role',
			dataIndex: 'userRole',
			key: 'userRole',
		},
]

const columns = [

{
	title: 'Link',
	dataIndex: 'link',
	key: 'link',
	render: (_, record) => (
		
			<div className={ActivityFeedStyle.gridContentLeft}>
				<span className={ActivityFeedStyle.iconLink}><img src={FiLinkSVG} width="13" alt='img' /></span>
				<div className={ActivityFeedStyle.assetDetails}>
					<div className={ActivityFeedStyle.assetName}>Zeux Innovation Linkedin</div>
					<span>m/spreadsheets/d/1CVpdGbkwFDNELnxBDJ9OjhSLLpx6Tco2MBR5E/edit#gid=0</span>
				</div>
			</div>
		
		),
	},
	{
	title: 'Added by',
	dataIndex: 'addedby',
	key: 'addedby',
	},
	{
	title: 'Date added',
	dataIndex: 'dateadded',
	key: 'dateadded',
	},
	{
	title: '',
	key: 'action',
	render: (_, record) => (
		<span className={ActivityFeedStyle.iconCopy}><img src={FiCopySVG} width="13" alt='img' /></span>
	),
	},

];



const ActivityFeed = ({
	hrID,
	activityFeed,
	tagUsers,
	callActivityFeedAPI,
	ChannelID
}) => {
	const [search, setSearch] = useState('');
	const [activityFeedList,setActivityFeedList] = useState([]);
	const [activityFeedMessage,setActivityFeedMessage] = useState();

	const [activeTabType,setActiveTabType] = useState()
	const [CloseHRdataSource,setCloseHRdataSource] = useState([])
	const [historyID,setHistoryID] = useState()
	const [detailHisoryID,setDetailHistoryID] = useState()
	const [showActivityDetails,setShowActivityDetails] = useState(false)
	const [issHistoryLoading,setIsHistoryLoading] = useState(false)
	const [historyData,sethistoryData] = useState({})

	const sanitizer = DOMPurify.sanitize;
	const searchMemo = useMemo(() => {
		if (search) return search;
		else return activityFeed;
	}, [search, activityFeed]);

	const displayNotes = (notes) => {
		const notesTemplate = new DOMParser().parseFromString(notes, 'text/html');
		return notesTemplate.body;
	};

	// const getChannelData = async (data)=>{
	// 	let result = await hiringRequestDAO.getChannelLibraryDAO(data)
	// 	// console.log('channel response', result);
	// 	setActivityFeedList(result?.responseBody?.details)
	// 	setActivityFeedMessage(result?.responseBody?.message)
	// 	if(result.statusCode === HTTPStatusCode.OK){

	// 	}
	// }

	const getActionhistory = async (data)=>{
		setIsHistoryLoading(true)
		let result = await hiringRequestDAO.getActionhistoryDAO(data)

		if(result?.statusCode === HTTPStatusCode.OK){
			let info = result.responseBody?.details[0]
			sethistoryData(info)
		}else{
			setIsHistoryLoading(false)
			sethistoryData({})
		}

		setIsHistoryLoading(false)


	}

	useEffect(()=>{
	if(historyID){
		let payload = {
			historyID,
			hrID,
			detailHisoryID
		}
		getActionhistory(payload)
	}

	},[historyID,hrID,detailHisoryID])

	const getCloseJobLogs = async (hrid)=>{
		let result = await hiringRequestDAO.getCloseJobPostsLogs(hrid)
		if(result?.statusCode === HTTPStatusCode.OK){
			setCloseHRdataSource(result.responseBody)
		}else{
			setCloseHRdataSource([])
		}
	}

	useEffect(()=>{
		getCloseJobLogs(hrID)
	},[hrID])

// 	useEffect(()=> {
// if(activeTabType){
// 	let	payload = {
// 		type: activeTabType,
// 		channelID: ChannelID
// 	}
// 	getChannelData(payload)
// }
// 	},[activeTabType,ChannelID])

	// const Documentsdata = activityFeedList?.slice()?.reverse()?.map((data)=>({
	// 			key: '1',
	// 			imageUrl : data?.fileUrl,
	// 			filename: data?.name,
	// 			dateadded: data?.createdDateTime,
	// }))

	// const DocumentcolumnsConfig = (activityFeedList)=>{
	// 	return[
	// 	{
	// 		title: 'Filename',
	// 		dataIndex: 'filename',
	// 		key: 'filename',
	// 		render: (_, record) => {
	// 			const fileType = record?.filename.split(".")[1];
	// 			return(
	// 			<div className={ActivityFeedStyle.gridContentLeft}>
	// 				<div className={ActivityFeedStyle.documentassetImg}>
	// 					{fileType === "docx" && (
	// 					<img src={FiIconWord} alt='img' />
	// 					)}
	// 					{fileType === "xls" && (
	// 					<img src={FiIconWord} alt='img' />
	// 					)}
	// 					{fileType === "xlsx" && (
	// 					<img src={FiIconWord} alt='img' />
	// 					)}
	// 					{fileType === "csv" && (
	// 					<img src={FiIconWord} alt='img' />
	// 					)}
	// 					{fileType === "doc" && (
	// 					<img src={FiIconWord} alt='img' />
	// 					)}
	// 					{fileType === "txt" && (
	// 					<img src={FiIconWord} alt='img' />
	// 					)}
	// 					{fileType === "pdf" && (
    //                         <img src={FiIconPDF} alt='img' />
    //                     )}
	// 				</div>
	// 				<div className={ActivityFeedStyle.documentassetDetails}>
	// 					<div className={ActivityFeedStyle.assetName}>{record?.filename}</div>
	// 					{/*<span>1 page</span>*/}{fileType === "docx" && (<span>DOC</span>)}
	// 					{fileType === "xls" && (<span>DOC</span>)}
	// 					{fileType === "xlsx" && (<span>DOC</span>)}
	// 					{fileType === "csv" && (<span>DOC</span>)}
	// 					{fileType === "doc" && (<span>DOC</span>)}
	// 					{fileType === "txt" && (<span>DOC</span>)}
	// 					{fileType === "pdf" && (<span>PDF</span>)}
	// 				</div>
	// 			</div>)}
	// 			},
	// 		// {
	// 		// title: 'Added by',
	// 		// dataIndex: 'addedby',
	// 		// key: 'addedby',
	// 		// },
	// 		{
	// 		title: 'Date added',
	// 		dataIndex: 'dateadded',
	// 		key: 'dateadded',
	// 		render:(_,record)=>{
	// 			const messageDate = 
	// 				record?.dateadded
	// 				? new Date(record?.dateadded)
	// 				: null;

	// 				const today = new Date();
	// 				const yesterday = new Date(today);
	// 				yesterday.setDate(today.getDate() - 1);

	// 				let dateString = "";
	// 				if (messageDate) {
	// 				if (messageDate.toDateString() === today.toDateString()) {
	// 					dateString = "Today";
	// 				} else if (
	// 					messageDate.toDateString() === yesterday.toDateString()
	// 				) {
	// 					dateString = "Yesterday";
	// 				} else {
	// 					dateString = moment(messageDate.toDateString()).format("MMM D,YYYY");
	// 				}
	// 				}

	// 				const showDateSeparator = dateString !== currentChatDate;
	// 				currentChatDate = dateString;
	// 			return <span>{dateString}</span>
	// 		}
	// 		},
	// 		{
	// 		title: '',
	// 		key: 'action',
	// 		render: (_, record) => {
	// 			return	<a href={record.imageUrl} download target="_blank">
	// 				<span className={ActivityFeedStyle.downloadLink}>Download</span>
	// 				</a>
	// 		},
	// 		},
	// 	]};

	// 		const columns = DocumentcolumnsConfig(activityFeedList);
	// 		let currentChatDate = null;
	
	// 		const formatTime = (time) => {
	// 			var dateString = time;
	// 			var date = new Date(dateString);

	// 			// Format the date as "12:58 PM"
	// 			var formattedTime = date.toLocaleTimeString('en-US', {
	// 			hour: 'numeric',
	// 			minute: '2-digit',
	// 			hour12: true
	// 			});
	// 			return formattedTime
	// 		};

	return (
		<div className={ActivityFeedStyle.activityContainer}>
			<div className={ActivityFeedStyle.activityFeedHeading}>
				<div className={ActivityFeedStyle.activityLabel}>Activity Feed</div>
				<div className={ActivityFeedStyle.searchFilterSet}>
					<AiOutlineSearch style={{ fontSize: '20px', fontWeight: '800' }} />
					<input
						onChange={(e) => {
							let activityFilter = activityFeed.filter((item) => {
								return (
									item.ActionPerformedBy.toLowerCase().includes(
										e.target.value.toLowerCase(),
									) ||
									item.Remark.toLowerCase().includes(
										e.target.value.toLowerCase(),
									) ||
									item.ActionPerformedBy.toLowerCase().includes(
										e.target.value.toLowerCase(),
									) ||
									item.ActionName.toLowerCase().includes(
										e.target.value.toLowerCase(),
									)
								);
							});

							setSearch(activityFilter);
						}}
						type={InputType.TEXT}
						className={ActivityFeedStyle.searchInput}
						placeholder="Search Activity Feed"
					/>
				</div>
			</div>

			<div className={ActivityFeedStyle.activityChannelLibrary}>

				<Tabs className={ActivityFeedStyle.channelLibTabs}>
					<TabList className={ActivityFeedStyle.channelLibTabsTitle}>
						<Tab >Activity</Tab>
						<Tab >Close HR log</Tab>
						{/* <Tab onClick={()=> setActiveTabType(ChannelType.images)}>Images</Tab>
						<Tab onClick={()=>{ setActiveTabType(ChannelType.documents)}}>Documents</Tab>
						<Tab onClick={()=>{ setActiveTabType(ChannelType.videos)}}>Videos</Tab> */}
						{/* <Tab onClick={()=>{ console.log("Links")}}>Links</Tab>  */}
					</TabList>

						{/* Activity  */}
					<TabPanel className={ActivityFeedStyle.tabContent}>
						<div className={ActivityFeedStyle.contentGrid}>
							<div className={ActivityFeedStyle.activityFeedList}>
								<div className={ActivityFeedStyle.activityFeedListBody}>
									{searchMemo?.map((item, index) => {
										return (
											<Fragment key={index}>
												<div className={ActivityFeedStyle.activityFeedListItem}>
													<div className={ActivityFeedStyle.activityFeedTimeDetails}>
														<div>
															{moment(item?.ActionDate).format('DD/MM/YYYY')}
														</div>
														<div>
															{DateTimeUtils.getTimeFromString(item?.ActionDate)}
														</div>
													</div>
													<div className={ActivityFeedStyle.activityFeedActivities}>
														{item?.IsNotes === 0 ? (
															<div className={ActivityFeedStyle.profileStatus}>
																<span>
																	{item?.DisplayName 
																		? item?.DisplayName === "TSC Auto Assignment" ? `TSC ${item?.TSCPerson} Auto Assignment`: item?.DisplayName
																		: item?.ActionName}{' '}

																	{(item?.IsDisplayUpdateHR === 1 || item?.IsDisplayUpdateHRDetail === 1) &&  <Tooltip title="View Details"><img src={infoIcon} style={{marginLeft:'5px', cursor:'pointer'}}  alt="info" onClick={()=>{setShowActivityDetails(true);setHistoryID(item?.HistoryID);setDetailHistoryID(item?.DetailHistoryID)}} /></Tooltip>}	
																</span>
																<span>{item?.TalentName && ' for '}</span>
																<span
																	style={{
																		textDecoration: 'underline',
																		fontWeight: '500',
																	}}>
																	{item?.TalentName}
																</span>
															</div>
														) : (
															<div className={ActivityFeedStyle.profileStatus}>
																<span style={{ fontWeight: '500' }}>Note from </span>
																<span
																	style={{
																		textDecoration: 'underline',
																		fontWeight: '500',
																	}}>
																	{item?.ActionPerformedBy}
																</span>
															</div>
														)}
														
														<div className={ActivityFeedStyle.activityAction} style={{display:'flex', justifyContent:'space-between', width:'100%' }}>
															<div>
																{item?.IsNotes ? <BsTag /> : <SlGraph />}
															&nbsp;&nbsp;
															<span style={{ fontWeight: '500' }}>
																{item?.IsNotes === 1
																	? item?.DisplayName === "Talent Note" ? "Talent : " :'Assigned to : '
																	: 'Action by : '}
															</span>
															<span>
																{item?.IsNotes === 1
																	? item?.AssignedUsers
																	: item?.ActionPerformedBy}
															</span>
															</div>
															
															<div>
															{item?.SLA_DueDate && <>
																<span style={{marginRight: '14px'}}></span>
															&nbsp;&nbsp;
															<span style={{ fontWeight: '500' }}>
															{'SLA Date : '}
															</span>
															<span>
																{moment(item?.SLA_DueDate).format('DD/MM/YYYY')}
															</span>
															</>
														
														}
															</div>
														</div>

														{item?.ActionName === "Interview Scheduled" && <div className={ActivityFeedStyle.activityAction}>
															<span style={{marginRight: '14px'}}></span>
															&nbsp;&nbsp;
															<span style={{ fontWeight: '500' }}>
															{'Interview Scheduled : '}
															</span>
															<span>
																{item?.InterviewDateTime?.split('-').join('/')}
															</span>
														</div>}
														

														
														{item?.Comments?<div className={ActivityFeedStyle.activityAction}>
															{item?.IsNotes ? <BsTag /> : <span style={{marginRight: '14px'}}></span>}
															&nbsp;&nbsp;
															<span style={{ fontWeight: '500' }}>
																{ item?.ActionName === "Talent Status Cancelled" ? "Cancel Reason : "  : item?.ActionName === "Talent Status On Hold" ? "Talent On Hold Reason : " :'Comments : '} 
															</span>
															&nbsp;
															<span>
															{item?.Comments}	
															</span>
														</div>:""}
														
														
														<div className={ActivityFeedStyle.activityAction}>
														{/* {item?.IsNotes === 0 && item?.ActionName === "Talent Status On Hold" && (<>
																<span style={{marginRight: '14px'}}></span>
																<span style={{ fontWeight: '500' }}>{'On Hold Remark : '}</span>
																<span >
																	{item?.Remark &&   item?.Remark }
																</span></>
															)}
															{item?.IsNotes === 0 && item?.ActionName === "Talent Status Rejected" && (<>
																<span style={{marginRight: '14px'}}></span>
																<span style={{ fontWeight: '500' }}>{'Reject Remark : '}</span>
																<span >
																	{item?.Remark &&   item?.Remark }
																</span></>
															)} */}
															{ item?.Remark && (<>
																<span style={{marginRight: '14px'}}></span>
																<span style={{ fontWeight: '500' }}>{'Remark : '}</span>
																<span >
																	{item?.Remark &&   item?.Remark }
																</span></>
															)}
															{item?.IsNotes === 1 && (
																<span
																	dangerouslySetInnerHTML={{
																		__html: sanitizer(
																			displayNotes(item?.ActionName).innerHTML,
																		),
																	}}></span>
															)}
														</div>
													</div>
												</div>
												{index < activityFeed.length - 1 && <Divider />}
											</Fragment>
										);
									})}
								</div>
							</div>	
						</div>
					</TabPanel>

					{/* close HR log */}
					<TabPanel className={ActivityFeedStyle.tabContent}>
					{CloseHRdataSource.length === 0 ? <h4>No close action performed on this job</h4> : <Table className={ActivityFeedStyle.LinkTableWrap} dataSource={CloseHRdataSource} columns={closeHRcolumns} pagination={false} />}	
					</TabPanel>

{/* Images tab */}
					{/* <TabPanel className={ActivityFeedStyle.tabContent}>
						<div className={ActivityFeedStyle.contentGrid}>
							<ul className={ActivityFeedStyle.channelLibImagesBoxes}>
								{activityFeedList && activityFeedList?.slice()?.reverse()?.map((data)=>{
									const messageDate = data?.createdDateTime
									? new Date(data?.createdDateTime )
									: null;
				  
								  const today = new Date();
								  const yesterday = new Date(today);
								  yesterday.setDate(today.getDate() - 1);
				  
								  let dateString = "";
								  if (messageDate) {
									if (messageDate.toDateString() === today.toDateString()) {
									  dateString = "Today";
									} else if (
									  messageDate.toDateString() === yesterday.toDateString()
									) {
										dateString = "Yesterday";
									} else {
									  	dateString = moment(messageDate.toDateString()).format("MMM D,YYYY");
									}
								  }
				  
								  const showDateSeparator = dateString !== currentChatDate;
								  currentChatDate = dateString; 
									return(
									<>
									 {showDateSeparator && (
											<li className={ActivityFeedStyle.dividerText}>{dateString}</li>
                    				)}
										<li>
											<span>{formatTime(data?.createdDateTime)}</span>
											<div className={ActivityFeedStyle.channelLibTabImg}>
												<img src={data?.fileUrl} width="95" height="95" onClick={() => window.open(data?.fileUrl, "_blank")}/>
											</div>
										</li>
									</>
									)
								})}	
								{activityFeedList===null && (
									<h6>{activityFeedMessage}</h6>
								)}
							</ul>		
						</div>
					</TabPanel> */}

					{/* Documents tab */}
					{/* <TabPanel className={ActivityFeedStyle.tabContent}>
						<div className={ActivityFeedStyle.assetGrid}>
							<Table className={ActivityFeedStyle.LinkTableWrap} dataSource={Documentsdata} columns={columns} pagination={false}  />
						</div>
					</TabPanel> */}

									{/* Video Tab  */}
					{/* <TabPanel className={ActivityFeedStyle.tabContent}>
						<div className={ActivityFeedStyle.contentGrid}>
							<ul className={`${ActivityFeedStyle.channelLibImagesBoxes} ${ActivityFeedStyle.channelLibVideoBoxes}`}>
							{activityFeedList && activityFeedList?.slice()?.reverse()?.map((data)=>{
								const messageDate = data?.createdDateTime
								? new Date(data?.createdDateTime )
								: null;
			  
							  const today = new Date();
							  const yesterday = new Date(today);
							  yesterday.setDate(today.getDate() - 1);
			  
							  let dateString = "";
							  if (messageDate) {
								if (messageDate.toDateString() === today.toDateString()) {
								  dateString = "Today";
								} else if (
								  messageDate.toDateString() === yesterday.toDateString()
								) {
								  dateString = "Yesterday";
								} else {
								  dateString = moment(messageDate.toDateString()).format("MMM D,YYYY");
								}
							  }
			  
							  const showDateSeparator = dateString !== currentChatDate;
							  currentChatDate = dateString; 

									return(
										<>
											{showDateSeparator && (
											<li className={ActivityFeedStyle.dividerText}>{dateString}</li>
                    				)}
											<li>
											<span>{formatTime(data?.createdDateTime)}</span>
												<div className={ActivityFeedStyle.channelLibTabImg}>
													<ReactPlayer
                                                            url={data?.fileUrl} 
                                                            width="20"
                                                            height="20"
                                                            onClick={() => window.open(data?.fileUrl)}
															controls={false}
                                                        />
												</div>
											</li>
										</>
									)
							})}	
							{activityFeedList===null && (
									<h6>{activityFeedMessage}</h6>
								)}
							</ul>
						</div>
					</TabPanel> */}

					<TabPanel className={ActivityFeedStyle.tabContent}>
						<div className={ActivityFeedStyle.assetGrid}>
							<Table className={ActivityFeedStyle.LinkTableWrap} dataSource={dataSource} columns={columns} pagination={false}  />
						</div>
					</TabPanel>

			    </Tabs>
			</div>

			{/* <div className={ActivityFeedStyle.activityFeedList}>
				<div className={ActivityFeedStyle.activityFeedListBody}>
					{searchMemo?.map((item, index) => {
						return (
							<Fragment key={index}>
								<div className={ActivityFeedStyle.activityFeedListItem}>
									<div className={ActivityFeedStyle.activityFeedTimeDetails}>
										<div>
											{moment(item?.ActionDate).format('DD/MM/YYYY')}
										</div>
										<div>
											{DateTimeUtils.getTimeFromString(item?.ActionDate)}
										</div>
									</div>
									<div className={ActivityFeedStyle.activityFeedActivities}>
										{item?.IsNotes === 0 ? (
											<div className={ActivityFeedStyle.profileStatus}>
												<span>
													{item?.DisplayName
														? item?.DisplayName
														: item?.ActionName}{' '}
												</span>
												<span>{item?.TalentName && ' for '}</span>
												<span
													style={{
														textDecoration: 'underline',
														fontWeight: '500',
													}}>
													{item?.TalentName}
												</span>
											</div>
										) : (
											<div className={ActivityFeedStyle.profileStatus}>
												<span style={{ fontWeight: '500' }}>Note from </span>
												<span
													style={{
														textDecoration: 'underline',
														fontWeight: '500',
													}}>
													{item?.ActionPerformedBy}
												</span>
											</div>
										)}
										<br />
										<div className={ActivityFeedStyle.activityAction} style={{display:'flex', justifyContent:'space-between', width:'100%' }}>
											<div>
												{item?.IsNotes ? <BsTag /> : <SlGraph />}
											&nbsp;&nbsp;
											<span style={{ fontWeight: '500' }}>
												{item?.IsNotes === 1
													? 'Assigned to : '
													: 'Action by : '}
											</span>
											<span>
												{item?.IsNotes === 1
													? item?.AssignedUsers
													: item?.ActionPerformedBy}
											</span>
											</div>
											
											<div>
											{item?.SLA_DueDate && <>
												<span style={{marginRight: '14px'}}></span>
											&nbsp;&nbsp;
											<span style={{ fontWeight: '500' }}>
											{'SLA Date : '}
											</span>
											<span>
												{moment(item?.SLA_DueDate).format('DD/MM/YYYY')}
											</span>
											</>
										
										}
											</div>
										</div>

										{item?.ActionName === "Interview Scheduled" && <div className={ActivityFeedStyle.activityAction}>
											<span style={{marginRight: '14px'}}></span>
										    &nbsp;&nbsp;
											<span style={{ fontWeight: '500' }}>
											{'Interview Scheduled : '}
											</span>
											<span>
												{item?.InterviewDateTime?.split('-').join('/')}
											</span>
										</div>}
										

										<br />
										{item?.Comments?<div className={ActivityFeedStyle.activityAction}>
											{item?.IsNotes ? <BsTag /> : <span style={{marginRight: '14px'}}></span>}
											&nbsp;&nbsp;
											<span style={{ fontWeight: '500' }}>
												{ item?.ActionName === "Talent Status Cancelled" ? "Cancel Reason : "  : item?.ActionName === "Talent Status On Hold" ? "Talent On Hold Reason : " :'Comments : '} 
											</span>
											&nbsp;
											<span>
											{item?.Comments}	
											</span>
										</div>:""}
										
										<br />
										<div className={ActivityFeedStyle.activityAction}>
										{item?.IsNotes === 0 && item?.ActionName === "Talent Status On Hold" && (<>
												<span style={{marginRight: '14px'}}></span>
												<span style={{ fontWeight: '500' }}>{'On Hold Remark : '}</span>
												<span >
													{item?.Remark &&   item?.Remark }
												</span></>
											)}
											{item?.IsNotes === 0 && item?.ActionName === "Talent Status Rejected" && (<>
												<span style={{marginRight: '14px'}}></span>
												<span style={{ fontWeight: '500' }}>{'Reject Remark : '}</span>
												<span >
													{item?.Remark &&   item?.Remark }
												</span></>
											)}
											{item?.Remark && (<>
												<span style={{marginRight: '14px'}}></span>
												<span style={{ fontWeight: '500' }}>{'Remark : '}</span>
												<span >
													{item?.Remark &&   item?.Remark }
												</span></>
											)}
											{item?.IsNotes === 1 && (
												<span
													dangerouslySetInnerHTML={{
														__html: sanitizer(
															displayNotes(item?.ActionName).innerHTML,
														),
													}}></span>
											)}
										</div>
									</div>
								</div>
								{index < activityFeed.length - 1 && <Divider />}
							</Fragment>
						);
					})}
				</div>
			</div> */}
			
			{showActivityDetails && <Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						open={showActivityDetails}
						className="engagementReplaceTalentModal"
						onCancel={() =>{
							setHistoryID()
						setShowActivityDetails(false)}
						}>

						{issHistoryLoading ? <Skeleton active /> : <>
						<h3>{historyData?.hrNumber}</h3>

						<div className={ActivityFeedStyle.historyGrid}>
							{historyData?.yearOfExp && <div className={ActivityFeedStyle.historyGridInfo}><span>Year of experience:</span> {historyData?.yearOfExp}</div>}
							{historyData?.about_Company_desc && <div className={ActivityFeedStyle.historyGridInfo}><span>About Company:</span> {historyData?.about_Company_desc}</div>}
							{historyData?.adhoc_BudgetCost && <div className={ActivityFeedStyle.historyGridInfo}><span>Adhoc Budget:</span> {historyData?.adhoc_BudgetCost}</div>}
							{historyData?.ambitionBoxRating && <div className={ActivityFeedStyle.historyGridInfo}><span>Ambition Box Rating:</span> {historyData?.ambitionBoxRating}</div>}
							{historyData?.availability && <div className={ActivityFeedStyle.historyGridInfo}><span>Availability:</span> {historyData?.availability}</div>}
							{historyData?.bqLink && <div className={ActivityFeedStyle.historyGridInfo}><span>BQ Link:</span> {historyData?.bqLink}</div>}
							{historyData?.budgetFrom && <div className={ActivityFeedStyle.historyGridInfo}><span>Budget From:</span> {historyData?.budgetFrom}</div>}
							{historyData?.budgetTo && <div className={ActivityFeedStyle.historyGridInfo}><span>Budget To:</span> {historyData?.budgetTo}</div>}
							{historyData?.calculatedUplersfees && <div className={ActivityFeedStyle.historyGridInfo}><span>Calculated Uplers fees:</span> {historyData?.calculatedUplersfees}</div>}
							{historyData?.communicationType && <div className={ActivityFeedStyle.historyGridInfo}><span>Communication Type:</span> {historyData?.communicationType}</div>}
							{historyData?.cost && <div className={ActivityFeedStyle.historyGridInfo}><span>Cost:</span> {historyData?.cost}</div>}
							{historyData?.currency && <div className={ActivityFeedStyle.historyGridInfo}><span>Currency:</span> {historyData?.currency}</div>}
							{historyData?.deleteHRReason && <div className={ActivityFeedStyle.historyGridInfo}><span>Delete HR Reason:</span> {historyData?.deleteHRReason}</div>}
							{historyData?.discovery_Call && <div className={ActivityFeedStyle.historyGridInfo}><span>Discovery Call:</span> {historyData?.discovery_Call}</div>}
							{historyData?.discription && <div className={ActivityFeedStyle.historyGridInfo}><span>Discription:</span> {historyData?.discription}</div>}
							{historyData?.dpPercentage && <div className={ActivityFeedStyle.historyGridInfo}><span>DP Percentage:</span> {historyData?.dpPercentage}</div>}
							{historyData?.duration && <div className={ActivityFeedStyle.historyGridInfo}><span>Duration:</span> {historyData?.specificMonth == "-1" ? "Indefinite" : historyData?.duration}</div>}
							{historyData?.durationType && <div className={ActivityFeedStyle.historyGridInfo}><span>DurationType:</span> {historyData?.durationType}</div>}
							{historyData?.genericInfo && <div className={ActivityFeedStyle.historyGridInfo}><span>Generic Info:</span> {historyData?.genericInfo}</div>}
							{historyData?.hR_Cost && <div className={ActivityFeedStyle.historyGridInfo}><span>HR Cost:</span> {historyData?.hR_Cost}</div>}
							{historyData?.historyDate && <div className={ActivityFeedStyle.historyGridInfo}><span>History Date:</span> {historyData?.historyDate}</div>}
							{historyData?.howSoon && <div className={ActivityFeedStyle.historyGridInfo}><span>How Soon:</span> {historyData?.howSoon}</div>}
							{historyData?.interviewLinkedin && <div className={ActivityFeedStyle.historyGridInfo}><span>Interview Linkedin:</span> {historyData?.interviewLinkedin}</div>}
							{historyData?.interviewerDesignation && <div className={ActivityFeedStyle.historyGridInfo}><span>Interviewer Designation:</span> {historyData?.interviewerDesignation}</div>}
							{historyData?.interviewerEmailID && <div className={ActivityFeedStyle.historyGridInfo}><span>Interviewer EmailID:</span> {historyData?.interviewerEmailID}</div>}
							{historyData?.interviewerName && <div className={ActivityFeedStyle.historyGridInfo}><span>Interviewer Name:</span> {historyData?.interviewerName}</div>}
							{historyData?.interviewerYearofExperience && <div className={ActivityFeedStyle.historyGridInfo}><span>Interviewer Year of Experience:</span> {historyData?.interviewerYearofExperience}</div>}
							{historyData?.jdFilename && <div className={ActivityFeedStyle.historyGridInfo}><span>JD File Name:</span> {historyData?.jdFilename}</div>}
							{historyData?.jdurl && <div className={ActivityFeedStyle.historyGridInfo}><span>JD url:</span> {historyData?.jdurl}</div>}
							{historyData?.jobExpiredORClosedDate && <div className={ActivityFeedStyle.historyGridInfo}><span>Job Expired OR Closed Date:</span> {historyData?.jobExpiredORClosedDate}</div>}
							{historyData?.jobStatus && <div className={ActivityFeedStyle.historyGridInfo}><span>Job Status:</span> {historyData?.jobStatus}</div>}
							{historyData?.lastActivityDate && <div className={ActivityFeedStyle.historyGridInfo}><span>Last Activity Date:</span> {historyData?.lastActivityDate}</div>}
							{historyData?.lastModifiedBy && <div className={ActivityFeedStyle.historyGridInfo}><span>Last Modified By:</span> {historyData?.lastModifiedBy}</div>}
							{historyData?.lastModifiedDatetime && <div className={ActivityFeedStyle.historyGridInfo}><span>Last Modified Date time:</span> {historyData?.lastModifiedDatetime}</div>}
							{historyData?.lossRemark && <div className={ActivityFeedStyle.historyGridInfo}><span>Loss Remark:</span> {historyData?.lossRemark}</div>}
							{historyData?.monthDuration && <div className={ActivityFeedStyle.historyGridInfo}><span>Month Duration:</span> {historyData?.monthDuration}</div>}
							{historyData?.noofEmployee && <div className={ActivityFeedStyle.historyGridInfo}><span>No of Employee:</span> {historyData?.noofEmployee}</div>}
							{historyData?.noofHoursworking && <div className={ActivityFeedStyle.historyGridInfo}><span>No of Hours working:</span> {historyData?.noofHoursworking}</div>}
							{historyData?.noofTalents && <div className={ActivityFeedStyle.historyGridInfo}><span>No of Talents:</span> {historyData?.noofTalents}</div>}
							{historyData?.notAcceptedHRReason && <div className={ActivityFeedStyle.historyGridInfo}><span>Not Accepted HR Reason:</span> {historyData?.notAcceptedHRReason}</div>}
							{historyData?.onHoldRemark && <div className={ActivityFeedStyle.historyGridInfo}><span>On Hold Remark:</span> {historyData?.onHoldRemark}</div>}
							{historyData?.overlapingHours && <div className={ActivityFeedStyle.historyGridInfo}><span>Overlaping Hours:</span> {historyData?.overlapingHours}</div>}
							{historyData?.pauseHRReason && <div className={ActivityFeedStyle.historyGridInfo}><span>Pause HR Reason:</span> {historyData?.pauseHRReason}</div>}
							{historyData?.pauseHRReasonOther && <div className={ActivityFeedStyle.historyGridInfo}><span>Pause HR Reason Other:</span> {historyData?.pauseHRReasonOther}</div>}
							{historyData?.payrollPartnerName && <div className={ActivityFeedStyle.historyGridInfo}><span>Payroll Partner Name:</span> {historyData?.payrollPartnerName}</div>}
							{historyData?.remark && <div className={ActivityFeedStyle.historyGridInfo}><span>Remark:</span> {historyData?.remark}</div>}
							{historyData?.requestForTalent && <div className={ActivityFeedStyle.historyGridInfo}><span>Request For Talent:</span> {historyData?.requestForTalent}</div>}
							{historyData?.requirement && <div className={ActivityFeedStyle.historyGridInfo}><span>Requirement:</span> {historyData?.requirement}</div>}
							{historyData?.roleStatus && <div className={ActivityFeedStyle.historyGridInfo}><span>Role Status:</span> {historyData?.roleStatus}</div>}
							{historyData?.roleTeamSize && <div className={ActivityFeedStyle.historyGridInfo}><span>Role Team Size:</span> {historyData?.roleTeamSize}</div>}
							{historyData?.rolesResponsibilities && <div className={ActivityFeedStyle.historyGridInfo}><span>Roles/Responsibilities:</span> {historyData?.rolesResponsibilities}</div>}
							{historyData?.salesUser && <div className={ActivityFeedStyle.historyGridInfo}><span>Sales User:</span> {historyData?.salesUser}</div>}
							{(historyData?.specificMonth && historyData?.specificMonth != "-1") && <div className={ActivityFeedStyle.historyGridInfo}><span>Specific Month:</span> {historyData?.specificMonth == "-1" ? "Indefinite" : historyData?.specificMonth}</div>}
							{historyData?.tR_Accepted && <div className={ActivityFeedStyle.historyGridInfo}><span>TR Accepted:</span> {historyData?.tR_Accepted}</div>}
							{historyData?.talentCostCalcPercentage && <div className={ActivityFeedStyle.historyGridInfo}><span>Talent Cost Percentage:</span> {historyData?.talentCostCalcPercentage}</div>}
							{historyData?.timeZone_FromTime && <div className={ActivityFeedStyle.historyGridInfo}><span>From Time:</span> {historyData?.timeZone_FromTime}</div>}
							{historyData?.timeZone_EndTime && <div className={ActivityFeedStyle.historyGridInfo}><span>End Time:</span> {historyData?.timeZone_EndTime}</div>}							
							{historyData?.timezone && <div className={ActivityFeedStyle.historyGridInfo}><span>Timezone:</span> {historyData?.timezone}</div>}
							{historyData?.timezone_Preference && <div className={ActivityFeedStyle.historyGridInfo}><span>Timezone Preference:</span> {historyData?.timezone_Preference}</div>}
							{historyData?.employmentType && <div className={ActivityFeedStyle.historyGridInfo}><span>Employment Type :</span> {historyData?.employmentType}</div>}
							{historyData?.payrollType && <div className={ActivityFeedStyle.historyGridInfo}><span>Payroll Type:</span> {historyData?.payrollType}</div>}
							{historyData?.modeOfWork && <div className={ActivityFeedStyle.historyGridInfo}><span>Mode of work:</span> {historyData?.modeOfWork}</div>}
							{historyData?.city && <div className={ActivityFeedStyle.historyGridInfo}><span>City:</span> {historyData?.city}</div>}
							{historyData?.country && <div className={ActivityFeedStyle.historyGridInfo}><span>Country:</span> {historyData?.country}</div>}
						</div>
						{historyData?.jobDescription && <div className={ActivityFeedStyle.historyGridInfo}><span>Job Description:</span> <div dangerouslySetInnerHTML={{__html:historyData?.jobDescription}} /></div>}
						{historyData?.mustHaveSkills && <div className={ActivityFeedStyle.MustHaveSkills} style={{display:'flex',marginTop:'10px'}}><span>Must Have Skills:</span> <div className={ActivityFeedStyle.skillsContainer}>{historyData?.mustHaveSkills.split(',').map(skill=> <div className={ActivityFeedStyle.skillChip}>{skill}</div>)}</div></div>}
						{historyData?.goodToHaveSkills && <div className={ActivityFeedStyle.GoodToHaveSkills} style={{display:'flex',marginTop:'10px'}}><span>Good To Have Skills:</span> <div className={ActivityFeedStyle.skillsContainer}>{historyData?.goodToHaveSkills.split(',').map(skill=> <div className={ActivityFeedStyle.skillChip}>{skill}</div>)}</div></div>}
						</>}
						</Modal>}

			<Suspense>
				<div style={{ position: 'relative' }}>
					<Editor
						tagUsers={tagUsers && tagUsers}
						hrID={hrID}
						callActivityFeedAPI={callActivityFeedAPI}
					/>
				</div>
			</Suspense>
			<br />
		</div>
	);
};

export default ActivityFeed;
