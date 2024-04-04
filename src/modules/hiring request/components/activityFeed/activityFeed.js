import { InputType } from 'constants/application';
import ActivityFeedStyle from './activityFeed.module.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { SlGraph } from 'react-icons/sl';
import React, { Fragment, useState, useMemo, Suspense, useEffect } from 'react';
import { DateTimeUtils } from 'shared/utils/basic_utils';
import { Divider, TabsProps, Space, Table, Tag} from 'antd';
import ReactPlayer from 'react-player';


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

	const sanitizer = DOMPurify.sanitize;
	const searchMemo = useMemo(() => {
		if (search) return search;
		else return activityFeed;
	}, [search, activityFeed]);

	const displayNotes = (notes) => {
		const notesTemplate = new DOMParser().parseFromString(notes, 'text/html');
		return notesTemplate.body;
	};

	const getChannelData = async (data)=>{
		let result = await hiringRequestDAO.getChannelLibraryDAO(data)
		// console.log('channel response', result);
		setActivityFeedList(result?.responseBody?.details)
		setActivityFeedMessage(result?.responseBody?.message)
		if(result.statusCode === HTTPStatusCode.OK){

		}
	}

	useEffect(()=> {
if(activeTabType){
	let	payload = {
		type: activeTabType,
		channelID: ChannelID
	}
	// console.log('channel payload', payload,ChannelID);
	getChannelData(payload)
}
	},[activeTabType,ChannelID])

	const Documentsdata = activityFeedList?.slice()?.reverse()?.map((data)=>({
				key: '1',
				imageUrl : data?.fileUrl,
				filename: data?.name,
				dateadded: data?.createdDateTime,
	}))

	const DocumentcolumnsConfig = (activityFeedList)=>{
		return[
		{
			title: 'Filename',
			dataIndex: 'filename',
			key: 'filename',
			render: (_, record) => {
				const fileType = record?.filename.split(".")[1];
				return(
				<div className={ActivityFeedStyle.gridContentLeft}>
					<div className={ActivityFeedStyle.documentassetImg}>
						{fileType === "docx" && (
						<img src={FiIconWord} alt='img' />
						)}
						{fileType === "xls" && (
						<img src={FiIconWord} alt='img' />
						)}
						{fileType === "xlsx" && (
						<img src={FiIconWord} alt='img' />
						)}
						{fileType === "csv" && (
						<img src={FiIconWord} alt='img' />
						)}
						{fileType === "doc" && (
						<img src={FiIconWord} alt='img' />
						)}
						{fileType === "txt" && (
						<img src={FiIconWord} alt='img' />
						)}
						{fileType === "pdf" && (
                            <img src={FiIconPDF} alt='img' />
                        )}
					</div>
					<div className={ActivityFeedStyle.documentassetDetails}>
						<div className={ActivityFeedStyle.assetName}>{record?.filename}</div>
						{/*<span>1 page</span>*/}{fileType === "docx" && (<span>DOC</span>)}
						{fileType === "xls" && (<span>DOC</span>)}
						{fileType === "xlsx" && (<span>DOC</span>)}
						{fileType === "csv" && (<span>DOC</span>)}
						{fileType === "doc" && (<span>DOC</span>)}
						{fileType === "txt" && (<span>DOC</span>)}
						{fileType === "pdf" && (<span>PDF</span>)}
					</div>
				</div>)}
				},
			// {
			// title: 'Added by',
			// dataIndex: 'addedby',
			// key: 'addedby',
			// },
			{
			title: 'Date added',
			dataIndex: 'dateadded',
			key: 'dateadded',
			render:(_,record)=>{
				const messageDate = 
					record?.dateadded
					? new Date(record?.dateadded)
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
				return <span>{dateString}</span>
			}
			},
			{
			title: '',
			key: 'action',
			render: (_, record) => {
				return	<a href={record.imageUrl} download target="_blank">
					<span className={ActivityFeedStyle.downloadLink}>Download</span>
					</a>
			},
			},
		]};

			const columns = DocumentcolumnsConfig(activityFeedList);
			let currentChatDate = null;
	
			const formatTime = (time) => {
				var dateString = time;
				var date = new Date(dateString);

				// Format the date as "12:58 PM"
				var formattedTime = date.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
				});
				return formattedTime
			};

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
						<Tab onClick={()=> setActiveTabType(ChannelType.images)}>Images</Tab>
						<Tab onClick={()=>{ setActiveTabType(ChannelType.documents)}}>Documents</Tab>
						<Tab onClick={()=>{ setActiveTabType(ChannelType.videos)}}>Videos</Tab>
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
							</div>	
						</div>
					</TabPanel>

{/* Images tab */}
					<TabPanel className={ActivityFeedStyle.tabContent}>
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
								  currentChatDate = dateString; // Update currentDate
									return(
									<>
									 {showDateSeparator && (
											<li className={ActivityFeedStyle.dividerText}>{dateString}</li>
                    				)}
										<li>
											{/* <span>Anjali,Image 12:58 PM</span> */}
											<span>{formatTime(data?.createdDateTime)}</span>
											<div className={ActivityFeedStyle.channelLibTabImg}>
												<img src={data?.fileUrl} width="95" height="95" onClick={() => window.open(data?.fileUrl, "_blank")}/>
											</div>
											{/* <a href='#'>View in conversation</a> */}
										</li>
									</>
									)
								})}	
								{activityFeedList===null && (
									<h6>{activityFeedMessage}</h6>
								)}
							</ul>		
						</div>
					</TabPanel>

					{/* Documents tab */}
					<TabPanel className={ActivityFeedStyle.tabContent}>
						<div className={ActivityFeedStyle.assetGrid}>
							<Table className={ActivityFeedStyle.LinkTableWrap} dataSource={Documentsdata} columns={columns} pagination={false}  />
						</div>
					</TabPanel>

									{/* Video Tab  */}
					<TabPanel className={ActivityFeedStyle.tabContent}>
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
							  currentChatDate = dateString; // Update currentDate

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
												{/* <a href='#'>View in conversation</a> */}
											</li>
										</>
									)
							})}	
							{activityFeedList===null && (
									<h6>{activityFeedMessage}</h6>
								)}
							</ul>
						</div>
					</TabPanel>

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
