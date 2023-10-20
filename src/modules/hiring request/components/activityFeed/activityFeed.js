import { InputType } from 'constants/application';
import ActivityFeedStyle from './activityFeed.module.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { SlGraph } from 'react-icons/sl';
import React, { Fragment, useState, useMemo, Suspense } from 'react';
import { DateTimeUtils } from 'shared/utils/basic_utils';
import { Divider, TabsProps, Space, Table, Tag} from 'antd';


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


const Editor = React.lazy(() => import('../textEditor/editor'));


const Documentsdata = [
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

const Documentcolumns = [

{
	title: 'Filename',
	dataIndex: 'filename',
	key: 'filename',
	render: (_, record) => (
		
		<div className={ActivityFeedStyle.gridContentLeft}>
			<div className={ActivityFeedStyle.documentassetImg}>
				<img src={FiIconPDF} alt='img' />
			</div>
			<div className={ActivityFeedStyle.documentassetDetails}>
				<div className={ActivityFeedStyle.assetName}>Andela x Uplers</div>
				<span>1 page</span><span>PDF</span>
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
		<span className={ActivityFeedStyle.downloadLink}>Download</span>
	),
	},

];



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
}) => {
	const [search, setSearch] = useState('');

	const sanitizer = DOMPurify.sanitize;
	const searchMemo = useMemo(() => {
		if (search) return search;
		else return activityFeed;
	}, [search, activityFeed]);

	const displayNotes = (notes) => {
		const notesTemplate = new DOMParser().parseFromString(notes, 'text/html');
		return notesTemplate.body;
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
						<Tab>Activity</Tab>
						<Tab>Images</Tab>
						<Tab>Documents</Tab>
						<Tab>Videos</Tab>
						<Tab>Links</Tab>
					</TabList>

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

					<TabPanel className={ActivityFeedStyle.tabContent}>
						<div className={ActivityFeedStyle.contentGrid}>
							<ul className={ActivityFeedStyle.channelLibImagesBoxes}>
								<li className={ActivityFeedStyle.dividerText}>Today</li>
								<li>
									<span>Anjali, 12:58 PM</span>
									<div className={ActivityFeedStyle.channelLibTabImg}>
										<img src="https://i.pravatar.cc/95" width="95" height="95" />
									</div>
									<a href='#'>View in conversation</a>
								</li>
								<li>
									<span>Anjali, 12:58 PM</span>
									<div className={ActivityFeedStyle.channelLibTabImg}>
										<img src="https://i.pravatar.cc/95" width="95" height="95" />
									</div>
									<a href='#'>View in conversation</a>
								</li>
								
								<li>
									<span>Anjali, 12:58 PM</span>
									<div className={ActivityFeedStyle.channelLibTabImg}>
										<img src="https://i.pravatar.cc/95" width="95" height="95" />
									</div>
									<a href='#'>View in conversation</a>
								</li>
								
								
								<li className={ActivityFeedStyle.dividerText}>Yesterday</li>
								<li>
									<span>Anjali, 12:58 PM</span>
									<div className={ActivityFeedStyle.channelLibTabImg}>
										<img src="https://i.pravatar.cc/95" width="95" height="95" />
									</div>
									<a href='#'>View in conversation</a>
								</li>
								<li>
									<span>Anjali, 12:58 PM</span>
									<div className={ActivityFeedStyle.channelLibTabImg}>
										<img src="https://i.pravatar.cc/95" width="95" height="95" />
									</div>
									<a href='#'>View in conversation</a>
								</li>
							</ul>
						</div>
					</TabPanel>

					<TabPanel className={ActivityFeedStyle.tabContent}>
						<div className={ActivityFeedStyle.assetGrid}>
							<Table className={ActivityFeedStyle.LinkTableWrap} dataSource={Documentsdata} columns={Documentcolumns} pagination={false}  />
						</div>
					</TabPanel>

					<TabPanel className={ActivityFeedStyle.tabContent}>
						<div className={ActivityFeedStyle.contentGrid}>
							<ul className={`${ActivityFeedStyle.channelLibImagesBoxes} ${ActivityFeedStyle.channelLibVideoBoxes}`}>
								<li className={ActivityFeedStyle.dividerText}>Today</li>
								<li>
									<span>Anjali, 12:58 PM</span>
									<div className={ActivityFeedStyle.channelLibTabImg}>
										<img src="https://i.pravatar.cc/95" alt='img' />
										<span>
											<img src={FiVideoSVG} alt='video'/>
											02:21
										</span>
									</div>
									<a href='#'>View in conversation</a>
								</li>
								<li>
									<span>Anjali, 12:58 PM</span>
									<div className={ActivityFeedStyle.channelLibTabImg}>
										<img src="https://i.pravatar.cc/95" alt='img' />.
										<span>
											<img src={FiVideoSVG} alt='video'/>
											02:21
										</span>
									</div>
									<a href='#'>View in conversation</a>
								</li>
								
								<li>
									<span>Anjali, 12:58 PM</span>
									<div className={ActivityFeedStyle.channelLibTabImg}>
										<img src="https://i.pravatar.cc/95" alt='img' />
										<span>
											<img src={FiVideoSVG} alt='video'/>
											02:21
										</span>
									</div>
									<a href='#'>View in conversation</a>
								</li>
								
								
								<li className={ActivityFeedStyle.dividerText}>Yesterday</li>
								<li>
									<span>Anjali, 12:58 PM</span>
									<div className={ActivityFeedStyle.channelLibTabImg}>
										<img src="https://i.pravatar.cc/95" alt='img' />
										<span>
											<img src={FiVideoSVG} alt='video'/>
											02:21
										</span>
									</div>
									<a href='#'>View in conversation</a>
								</li>
								<li>
									<span>Anjali, 12:58 PM</span>
									<div className={ActivityFeedStyle.channelLibTabImg}>
										<img src="https://i.pravatar.cc/95" alt='img' />
										<span>
											<img src={FiVideoSVG} alt='video'/>
											02:21
										</span>
									</div>
									<a href='#'>View in conversation</a>
								</li>
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
