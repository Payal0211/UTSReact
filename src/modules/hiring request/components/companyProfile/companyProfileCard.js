import CompanyProfileCardStyle from './companyProfile.module.css';
import { BsThreeDots } from 'react-icons/bs';
import { AiFillLinkedin } from 'react-icons/ai';
import { Divider, Dropdown, Menu } from 'antd';

const CompanyProfileCard = ({ clientDetail, talentLength }) => {
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
									{clientDetail?.CompanyName}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.companyURL}>
								<span>Company URL:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail && clientDetail?.CompanyURL}
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
									{clientDetail && clientDetail?.POCFullName}
								</span>
								&nbsp;&nbsp;
								{/*  TODO:- 
								<AiFillLinkedin style={{ color: '#006699' }} /> */}
							</div>
							<div className={CompanyProfileCardStyle.pocEmail}>
								<span>POC Email:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail && clientDetail?.POCEmailID}
								</span>
							</div>
						</div>
						<div style={{ cursor: 'pointer' }}>
							{
								<Dropdown
									trigger={['click']}
									placement="bottom"
									menu={
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
									{clientDetail && clientDetail?.Managed}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.category}>
								<span>Uplers Category:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail && clientDetail?.Category}
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
							<div className={CompanyProfileCardStyle.TR}>
								<span>TR:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail && clientDetail?.NoOfTalents}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.TRParked}>
								<span>TR Parked:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.NoOfTalents - talentLength}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.roleName}>
								<span>Role Name:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>{clientDetail?.Role}</span>
							</div>
							<div className={CompanyProfileCardStyle.contactDuration}>
								<span>Contact Duration:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.SpecificMonth} Months
								</span>
							</div>
							<div className={CompanyProfileCardStyle.minExp}>
								<span>Minimum Exp Required:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.MinYearOfExp} Years
								</span>
							</div>
							<div className={CompanyProfileCardStyle.budget}>
								<span>Budget:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>{clientDetail?.Cost}</span>
							</div>
							<div className={CompanyProfileCardStyle.engagement}>
								<span>Engagement:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.Availability}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.geo}>
								<span>Geo:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>{clientDetail?.GEO}</span>
							</div>
							<div className={CompanyProfileCardStyle.preferredShift}>
								<span>Preferred Shift:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.TimeZone}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.preferredTime}>
								<span>Preferred Time:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.FromTimeAndToTime}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.jdLink}>
								<span>JD Link:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									<a
										href={clientDetail?.JobDetailURL}
										style={{ textDecoration: 'underline' }}
										target="_blank">
										Click Here
									</a>
								</span>
							</div>
							<div className={CompanyProfileCardStyle.TRParked}>
								<span>Behavioral Questions:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									<a
										href="#"
										style={{ textDecoration: 'underline' }}>
										Click Here
									</a>
								</span>
							</div>
							<div className={CompanyProfileCardStyle.TRParked}>
								<span>Additional Information:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									<a
										href="#"
										style={{ textDecoration: 'underline' }}>
										Click Here
									</a>
								</span>
							</div>
							<div className={CompanyProfileCardStyle.TRParked}>
								<span>Discovery Call:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									<a
										href="#"
										style={{ textDecoration: 'underline' }}>
										Click Here
									</a>
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
							<div className={CompanyProfileCardStyle.salesPerson}>
								<span>Sales Person:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.SalesPerson}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.manager}>
								<span>Manager:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.SalesManagerName}
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
