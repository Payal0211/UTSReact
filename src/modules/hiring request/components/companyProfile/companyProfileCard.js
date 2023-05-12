import CompanyProfileCardStyle from './companyProfile.module.css';
import { BsThreeDots } from 'react-icons/bs';
import { AiFillLinkedin } from 'react-icons/ai';
import { Divider, Dropdown, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const CompanyProfileCard = ({ clientDetail, talentLength }) => {
	const id = useParams()
	return (
		<div className={CompanyProfileCardStyle.companyProfileContainer}>
			<label>
				<h1>Company Details</h1>
			</label>
			<div className={CompanyProfileCardStyle.companyCard}>
				<div className={CompanyProfileCardStyle.companyCardBody}>
					<div className={CompanyProfileCardStyle.partWise}>
						<div style={{ marginBottom: '10px' }}>
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
								<a
									href={clientDetail?.LinkedInProfile}
									target="_blank"
									rel="noreferrer">
									<AiFillLinkedin style={{ color: '#006699' }} />
								</a>
							</div>
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
							<div className={CompanyProfileCardStyle.EngagementType}>
								<span>Engagement Type:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.Managed ? clientDetail?.Managed : 'NA'}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.category}>
								<span>Uplers Category:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.Category ? clientDetail?.Category : 'NA'}
								</span>
							</div>
						</div>
					</div>
					<Divider
						style={{
							margin: '10px 0',
						}}
					/>

					<div className={`${CompanyProfileCardStyle.partWise} ${CompanyProfileCardStyle.partWiseList}`}>
						<div style={{ marginBottom: '10px' }}>
							<div className={CompanyProfileCardStyle.TR}>
								<span>Active TR:</span>&nbsp;&nbsp;

								<span style={{ fontWeight: '500' }}>
									{clientDetail?.NoOfTalents ? clientDetail?.NoOfTalents : 'NA'}
								</span>
								<button>Update TR</button>
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
							<div className={CompanyProfileCardStyle.contactDuration}>
								<span>Contact Duration:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.SpecificMonth
										? clientDetail?.SpecificMonth
										: 0}{' '}
									Months
								</span>
							</div>
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
									{clientDetail?.JobDetailURL ? (
										<a
											rel="noreferrer"
											href={clientDetail?.JobDetailURL}
											style={{ textDecoration: 'underline' }}
											target="_blank">
											Click Here
										</a>
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
						</div>
					</div>
					<Divider
						style={{
							margin: '10px 0',
						}}
					/>
					<div className={CompanyProfileCardStyle.partWise}>
						<div>
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
		</div>
	);
};

export default CompanyProfileCard;
