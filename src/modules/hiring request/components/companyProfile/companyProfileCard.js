import CompanyProfileCardStyle from './companyProfile.module.css';
import { BsThreeDots } from 'react-icons/bs';
import { AiFillLinkedin } from 'react-icons/ai';

const CompanyProfileCard = ({ clientDetail }) => {
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
									{clientDetail?.CompanyURL}
								</span>
								&nbsp;&nbsp;
								<AiFillLinkedin style={{ color: '#006699' }} />
							</div>
							<div className={CompanyProfileCardStyle.pocName}>
								<span>POC Name:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.POCFullName}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.pocEmail}>
								<span>POC Email:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.POCEmailID}
								</span>
								&nbsp;&nbsp;
								<AiFillLinkedin style={{ color: '#006699' }} />
							</div>
						</div>
						<div>
							<BsThreeDots style={{ fontSize: '1.5rem' }} />
						</div>
					</div>
					<hr style={{ border: `1px solid var(--uplers-border-color)` }} />
					<div className={CompanyProfileCardStyle.partWise}>
						<div style={{ marginBottom: '10px' }}>
							<div className={CompanyProfileCardStyle.EngagementType}>
								<span>Engagement Type:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.Managed}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.category}>
								<span>Uplers Category:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.Category}
								</span>
							</div>
						</div>
					</div>
					<hr style={{ border: `1px solid var(--uplers-border-color)` }} />
					<div className={CompanyProfileCardStyle.partWise}>
						<div style={{ marginBottom: '10px' }}>
							<div className={CompanyProfileCardStyle.TR}>
								<span>TR:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.Managed}
								</span>
							</div>
							<div className={CompanyProfileCardStyle.TRParked}>
								<span>TR Parked:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{clientDetail?.NoOfTalents}
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
									{clientDetail?.JobDetailURL}
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
						</div>
					</div>
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
