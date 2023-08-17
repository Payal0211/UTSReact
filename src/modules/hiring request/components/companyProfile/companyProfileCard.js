import CompanyProfileCardStyle from './companyProfile.module.css';
import React, { useState, useEffect, useMemo } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { AiFillLinkedin } from 'react-icons/ai';
import { Divider, Dropdown, Menu, Modal } from 'antd';
import { Link, useParams } from 'react-router-dom';
import UpdateTRModal from '../../components/updateTRModal/updateTRModal';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { UserAccountRole } from 'constants/application';
import { NetworkInfo } from 'constants/network';

const CompanyProfileCard = ({
	clientDetail,
	talentLength,
	apiData,
	allApiData,
}) => {
	const [updateTR, setUpdateTR] = useState(false);
	const [updateTRDetail, setUpdateTRDetails] = useState([]);
	const id = useParams();
	const getHRDetails = async () => {
		let response = await hiringRequestDAO.getViewHiringRequestDAO(id?.hrid);
		setUpdateTRDetails(response?.responseBody);
	};
	const userSessionMemo = useMemo(
		() => UserSessionManagementController.getUserMiscellaneousData(),
		[],
	);
	return (
		<div className={CompanyProfileCardStyle.companyProfileContainer}>
			<label>
				<h1>Company Details</h1>
			</label>
			<div className={CompanyProfileCardStyle.companyCard}>
				<div className={CompanyProfileCardStyle.companyCardBody}>
					<div className={CompanyProfileCardStyle.partWise}>
						<div style={{ marginBottom: '10px' }}>
							<div className={CompanyProfileCardStyle.clientName}>
								<span>Client Name:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.ClientName ? clientDetail?.ClientName : 'NA'}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.clientEmail}>
								<span>Client Email:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.ClientEmail ? clientDetail?.ClientEmail : 'NA'}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.companyName}>
								<span>Company Name:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.CompanyName ? clientDetail?.CompanyName : 'NA'}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.companyURL}>
								<span>Company URL:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.CompanyURL ? (
										<a
											target="_blank"
											href={clientDetail?.CompanyURL}
											style={{ textDecoration: 'underline' }}
											rel="noreferrer">
											Click Here
										</a>
									) : (
										'NA'
									)}
								</span>
								&nbsp;&nbsp;
								{clientDetail?.LinkedInProfile && (<a
									href={clientDetail?.LinkedInProfile}
									target="_blank"
									rel="noreferrer">
									<AiFillLinkedin style={{ color: '#006699' }} />
								</a>)}
								
							</div>							
						</div>
						<div style={{ cursor: 'pointer' }}>
							{
								<Dropdown
									trigger={['click']}
									placement="bottom"
									overlay={
										<Menu>
											<Menu.Item key={0}>View Company </Menu.Item>
										</Menu>
									}>
									<BsThreeDots style={{ fontSize: '1.5rem' }} />
								</Dropdown>
							}
						</div>
					</div>
					<Divider
						style={{
							margin: '10px 0',
						}}
					/>
					<div className={CompanyProfileCardStyle.partWise}>
						<div style={{ marginBottom: '10px' }}>
							{/* <div className={CompanyProfileCardStyle.EngagementType}>
								<span>Engagement Type:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.Managed ? clientDetail?.Managed : 'NA'}
								</span>
							</div> */}
							<div className={CompanyProfileCardStyle.EngagementType}>
								<span>Lead Type:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{allApiData?.ClientDetail?.LeadType ? allApiData?.ClientDetail?.LeadType : 'NA' }
								</span>
							</div>
							<div className={CompanyProfileCardStyle.category}>
								<span>Lead User:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
								{allApiData?.ClientDetail?.LeadUser ? allApiData?.ClientDetail?.LeadUser : 'NA' }
								</span>
							</div>
						</div>
					</div>	

					<Divider
						style={{
							margin: '10px 0',
						}}
					/>
					<div className={CompanyProfileCardStyle.partWise}>
						<div style={{ marginBottom: '10px' }}>
							{/* <div className={CompanyProfileCardStyle.EngagementType}>
								<span>Engagement Type:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.Managed ? clientDetail?.Managed : 'NA'}
								</span>
							</div> */}
							<div className={CompanyProfileCardStyle.EngagementType}>
								<span>Engagement Type:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{!allApiData?.Is_HRTypeDP ? `Contract - ${clientDetail?.SpecificMonth
										? clientDetail?.SpecificMonth
										: 0}
									Months` : 'Direct Placement' }
								</span>
							</div>
							<div className={CompanyProfileCardStyle.category}>
								<span>Uplers Category:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{allApiData?.companyCategory
										? allApiData?.companyCategory
										: 'NA'}
								</span>
							</div>
						</div>
					</div>	
					<Divider
						style={{
							margin: '10px 0',
						}}
					/>

					<div
						className={`${CompanyProfileCardStyle.partWise} ${CompanyProfileCardStyle.partWiseList}`}>
						<div style={{ marginBottom: '10px' }}>
							<div className={CompanyProfileCardStyle.TR}>
								<span>Total TR:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.NoOfTalents ? clientDetail?.NoOfTalents : 'NA'}
								</span>
							</div>

							<div className={CompanyProfileCardStyle.TR}>
								<span>Active TR:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.ActiveTR ? clientDetail?.ActiveTR: 'NA'}
								</span>
								{apiData !== 'Cancelled' && apiData !== 'Completed' && apiData !== "Lost" &&
									(userSessionMemo?.loggedInUserTypeID ===
										UserAccountRole.DEVELOPER || 
										userSessionMemo?.loggedInUserTypeID === UserAccountRole.ADMINISTRATOR ||
										userSessionMemo?.loggedInUserTypeID === UserAccountRole.SALES || 
										userSessionMemo?.loggedInUserTypeID === UserAccountRole.SALES_MANAGER ) && (
										<button
											onClick={() => {
												setUpdateTR(true);
												getHRDetails();
											}}>
											Update TR
										</button>
									)}
							</div>							
							{/* <div className={CompanyProfileCardStyle.TRParked}>
								<span>TR Parked:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.TR_Accepted ? clientDetail?.TR_Accepted : 'NA'}
								</span>
							</div> */}
							<div className={CompanyProfileCardStyle.roleName}>
								<span>Role Name:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.Role ? clientDetail?.Role : 'NA'}
								</span>
							</div>
							{/* {!allApiData?.Is_HRTypeDP ? <div className={CompanyProfileCardStyle.contactDuration}>
								<span>Contact Duration:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.SpecificMonth
										? clientDetail?.SpecificMonth
										: 0}{' '}
									Months
								</span>
							</div> : <div className={CompanyProfileCardStyle.contactDuration}>
								<span>Contract Type:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
								Direct Placement
								</span>
							</div> } */}
							
							<div className={CompanyProfileCardStyle.minExp}>
								<span>Minimum Exp Required:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.MinYearOfExp ? clientDetail?.MinYearOfExp : 0}{' '}
									Years
								</span>
							</div>
							<div className={CompanyProfileCardStyle.budget}>
								<span>Budget:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.Cost ? clientDetail?.Cost : 'NA'}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.engagement}>
								<span>Engagement:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.Availability
										? clientDetail?.Availability
										: 'NA'}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.geo}>
								<span>Geo:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.GEO ? clientDetail?.GEO : 'NA'}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.preferredShift}>
								<span>Preferred Shift:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.TimeZone ? clientDetail?.TimeZone : 'NA'}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.preferredTime}>
								<span>Preferred Time:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.FromTimeAndToTime
										? clientDetail?.FromTimeAndToTime
										: 'NA'}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.preferredTime}>
								<span>Mode of Work:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.ModeOfWork || 'NA'}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.jdLink}>
								<span>JD Link:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.JDFileOrURL === 'JDFILE' ? (
										clientDetail?.JobDetail?.split(':')[0] === 'http' ||
										clientDetail?.JobDetail?.split(':')[0] === 'https' ? (
											<a
												rel="noreferrer"
												href={clientDetail?.JobDetail}
												style={{ textDecoration: 'underline' }}
												target="_blank">
												Click Here
											</a>
										) : (
											<a
												rel="noreferrer"
												href={
													NetworkInfo.PROTOCOL + NetworkInfo.DOMAIN + 
													'Media/JDParsing/JDfiles/' +
													clientDetail?.JobDetail
												}
												style={{ textDecoration: 'underline' }}
												target="_blank">
												Click Here
											</a>
										)
									) : (
										'NA'
									)}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.TRParked}>
								<span>Behavioral Questions:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.BQLink ? (
										<a
											target="_blank"
											href={clientDetail?.BQLink}
											style={{ textDecoration: 'underline' }}
											rel="noreferrer">
											Click Here
										</a>
									) : (
										'NA'
									)}
								</span>
							</div>						
							<div className={CompanyProfileCardStyle.TRParked}>
								<span>Discovery Call:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.Discovery_Call ? (
										<a
											target="_blank"
											href={clientDetail?.Discovery_Call}
											style={{ textDecoration: 'underline' }}
											rel="noreferrer">
											Click Here
										</a>
									) : (
										'NA'
									)}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.TRParked}>
								<span>Additional Information:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									<Link
										to={`/viewHrDetails/${id?.hrid}`}
										// to={"/viewHrDetails"}
										// rel="noreferrer"
										// target="_blank"
										// href="#"
										style={{ textDecoration: 'underline' }}>
										View Complete HR
									</Link>
								</span>
							</div>
						</div>
					</div>
					<Divider
						style={{
							margin: '10px 0',
						}}
					/>
					<div className={CompanyProfileCardStyle.partWise}>
						<div>
						<div className={CompanyProfileCardStyle.pocName}>
								<span>POC Name:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.POCFullName ? clientDetail?.POCFullName : 'NA'}
								</span>
								&nbsp;&nbsp;
								{/*  TODO:- 
								<AiFillLinkedin style={{ color: '#006699' }} /> */}
							</div>
							<div className={CompanyProfileCardStyle.pocEmail}>
								<span>POC Email:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.POCEmailID ? clientDetail?.POCEmailID : 'NA'}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.salesPerson}>
								<span>Sales Person:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.SalesPerson ? clientDetail?.SalesPerson : 'NA'}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.manager}>
								<span>Manager:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.SalesManagerName
										? clientDetail?.SalesManagerName
										: 'NA'}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			{updateTR && (
				<Modal
					width={'864px'}
					centered
					footer={false}
					open={updateTR}
					className="updateTRModal"
					onCancel={() => setUpdateTR(false)}>
					<UpdateTRModal
						updateTR={updateTR}
						setUpdateTR={() => setUpdateTR(true)}
						onCancel={() => setUpdateTR(false)}
						updateTRDetail={updateTRDetail}
					/>
				</Modal>
			)}
		</div>
	);
};

export default CompanyProfileCard;
