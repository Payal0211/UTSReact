import WithLoader from "shared/components/loader/loader";
import { Button, Table, Tag, message, Modal } from 'antd';
// import dealDetailsStyles from './dealDetailsStyle.module.css';

import dealDetailsStyles from './viewClientDetails.module.css';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DealDAO } from 'core/deal/dealDAO';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { ReactComponent as DeleteLightSVG } from 'assets/svg/deleteLight.svg';
import viewClient from 'assets/viewClient.png'

import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";

import { HTTPStatusCode } from 'constants/network';
import moment from 'moment';
import {NetworkInfo} from 'constants/network'
import HROperator from "modules/hiring request/components/hroperator/hroperator";
import { allClientRequestDAO } from "core/allClients/allClientsDAO";
import { allClientsConfig } from "modules/hiring request/screens/allClients/allClients.config";

import ArrowClose from 'assets/svg/close.svg';
import Star from 'assets/svg/selectStarFill.svg';

import { AiOutlineClose } from 'react-icons/ai';

function ViewClientDetails() {
	const [isLoading, setLoading] = useState(false);
	const [messageAPI, contextHolder] = message.useMessage();
	const [viewDetails,setViewDetails] = useState({});
	const {companyID,clientID} = useParams();
	const [isExpanded, setIsExpanded] = useState(false);
	const navigate = useNavigate();

	const [jobpostDraft, setModaljobpostDraft] = useState(false);


   const togglePriority = useCallback(
		async (payload) => {
			setLoading(true);

			let response = await hiringRequestDAO.setHrPriorityDAO(
				payload.isNextWeekStarMarked,
				payload.hRID,
				payload.person,
			);
			if (response.statusCode === HTTPStatusCode.OK) {
				// const { tempdata, index } = hrUtils.hrTogglePriority(response, viewDetails?.hrList);
				// setAPIdata([
				// 	...viewDetails?.hrList.slice(0, index),
				// 	tempdata,
				// 	...viewDetails?.hrList.slice(index + 1),
				// ]);
				getDataForViewClient();
				message.success(`priority has been changed.`)
				setLoading(false);
			} else if (response.statusCode === HTTPStatusCode.NOT_FOUND) {
				message.error(response.responseBody)
				setLoading(false);
			} else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
				setLoading(false);
				return navigate(UTSRoutes.LOGINROUTE);
			} else if (
				response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
			) {
				setLoading(false);
				return navigate(UTSRoutes.SOMETHINGWENTWRONG);
			} else {
				setLoading(false);
				return 'NO DATA FOUND';
			}
		},
		[ messageAPI, navigate],
	);


	const columns = useMemo(
		() => allClientsConfig.ViewClienttableConfig(togglePriority),
		[]); 

	useEffect(() => {
		getDataForViewClient();
	},[]);

	const getDataForViewClient = async () => {
		setLoading(true)
		let response = await allClientRequestDAO.getClientDetailsForViewDAO(companyID,clientID);	
		setLoading(false);
		setViewDetails(response?.responseBody);	
	}

	
 

    return(
        <WithLoader
			showLoader={isLoading}
			className="mainLoader">
			<div className={dealDetailsStyles.dealDetailsWrap}>
				<div className={dealDetailsStyles.dealDetailsBack}>
					<Link to={UTSRoutes.ALLCLIENTS}>
						<div className={dealDetailsStyles.goback}>
							<ArrowLeftSVG style={{ width: '16px' }} />
							<span>Go Back</span>
						</div>
					</Link>
				</div>

				<div className={dealDetailsStyles.dealDetailsTitle}>
				{contextHolder}
					<h1>
						{/* <img
							src={viewClient}
							alt={viewDetails?.clientDetails?.companyInitial}
						/> */}
						<span className={dealDetailsStyles.viewClientUser} style={{backgroundImage: viewClient}}>
							{viewDetails?.clientDetails?.companyInitial}							
						</span>
						&nbsp;{viewDetails?.clientDetails?.companyName}						
					</h1>
					<div className={dealDetailsStyles.dealDetailsRight}>
						{/* <button  className={dealDetailsStyles.yellowOutlinedButton} type="button">View BQ Form</button>  */}

                        {/* <HROperator
                            title="Edit Company"
                            icon={<ArrowDownSVG style={{ width: '16px' }} />}
                            backgroundColor={`#fff`}
                            iconBorder={`1px solid var(--color-sunlight)`}
                            isDropdown={true}
                            overlayClassName={dealDetailsStyles.viewClientdrop}
                            className={dealDetailsStyles.viewClientdrop}
                        /> */}						
						<button type="button" onClick={() => navigate(`/editclient/${companyID}`)}>Edit Company</button>
						<button type="button" onClick={() => navigate('/allhiringrequest/addnewhr')} >Create HR</button>
					
						{/* <div className={dealDetailsStyles.deleteButton}>
							<DeleteLightSVG width="24" />
						</div> */}
					</div>
				</div>

				<div className={dealDetailsStyles.dealDetailsTopCard}>
					<ul>
						<li>
							<div className={dealDetailsStyles.topCardItem}>
								<span>Client Name</span>
								{viewDetails?.clientDetails?.clientName ? viewDetails?.clientDetails?.clientName : "NA"}
							</div>
						</li>
						<li>
							<div className={dealDetailsStyles.topCardItem}>
								<span>Client Source</span>
								{viewDetails?.clientDetails?.clientSource ? viewDetails?.clientDetails?.clientSource : "NA"}
							</div>
						</li>
						<li>
							<div className={dealDetailsStyles.topCardItem}>
								<span>Status</span>
								{viewDetails?.clientDetails?.clientStatus ? viewDetails?.clientDetails?.clientStatus : "NA"}
							</div>
						</li>
						<li>
							<div className={dealDetailsStyles.topCardItem}>
								<span>Uplers POC</span>
								{viewDetails?.clientDetails?.uplersPOC ? viewDetails?.clientDetails?.uplersPOC : "NA"}
							</div>
						</li>
						<li>
							<div className={dealDetailsStyles.topCardItem}>
								<span>AM Name</span>
								{viewDetails?.clientDetails?.aM_UserName ? viewDetails?.clientDetails?.aM_UserName : "NA"}
							</div>
						</li>
					</ul>
				</div>

				<div className={dealDetailsStyles.dealDetailsCard}>
					<div className={dealDetailsStyles.dealLeftCard}>
						<div className={dealDetailsStyles.dealLeftItem}>
							<h2>Client/Company Details</h2>
							<ul>
								<li>
									<span>Client Email:</span>
									{viewDetails?.clientDetails?.clientEmail ? viewDetails?.clientDetails?.clientEmail : "NA"}
								</li>
                                <li>
									<span>Lead Source : </span>
									{viewDetails?.clientDetails?.leadSource ? viewDetails?.clientDetails?.leadSource : "NA"}
								</li>
								<li>
									<span>Client Linkedin : -</span>
                                    {viewDetails?.clientDetails?.clientLinkedIn ? <a
										href={viewDetails?.clientDetails?.clientLinkedIn}
										target="_blank"
										className={dealDetailsStyles.dealItemLink}>{viewDetails?.clientDetails?.clientLinkedIn}
                                        <svg
											width="30"
											height="16"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M14.8165 0H1.18016C0.529039 0 0 0.516431 0 1.15372V14.8455C0 15.4826 0.529039 16 1.18016 16H14.8165C15.4688 16 16 15.4826 16 14.8455V1.15372C16 0.516431 15.4688 0 14.8165 0Z"
												fill="#007BB6"></path>
											<path
												d="M3.55837 2.20312C4.31761 2.20312 4.93387 2.81968 4.93387 3.5792C4.93387 4.33903 4.31761 4.95558 3.55837 4.95558C2.79622 4.95558 2.18164 4.33903 2.18164 3.5792C2.18164 2.81968 2.79622 2.20312 3.55837 2.20312ZM2.37007 5.99873H4.7456V13.6342H2.37007V5.99873Z"
												fill="white"></path>
											<path
												d="M6.23438 5.99809H8.50916V7.04186H8.54172C8.85822 6.44158 9.63251 5.80859 10.787 5.80859C13.1899 5.80859 13.6339 7.38952 13.6339 9.44588V13.6335H11.2611V9.92039C11.2611 9.03495 11.2457 7.89582 10.0279 7.89582C8.79311 7.89582 8.60468 8.86096 8.60468 9.85697V13.6335H6.23438V5.99809Z"
												fill="white"></path>
										</svg>
                                        </a> : "NA"}
								</li>
                                <li>
									<span>Lead User: </span>
									{viewDetails?.clientDetails?.leadUser ? viewDetails?.clientDetails?.leadUser : "NA"}
								</li>
								<li>
									<span>Company URL : </span>
                                    {viewDetails?.clientDetails?.companyURL ? <a
										href={viewDetails?.clientDetails?.companyURL}
										target="_blank"
										className={dealDetailsStyles.dealItemLink}>{viewDetails?.clientDetails?.companyURL}</a> : "NA"}
								</li>
                                <li>
									<span>GEO: </span>
									{viewDetails?.clientDetails?.geo ? viewDetails?.clientDetails?.geo : "NA"}
								</li>
								<li>
									<span>Company Linkedin : </span>
                                    {viewDetails?.clientDetails?.companyLinkedIn ? <a
										href={viewDetails?.clientDetails?.companyLinkedIn}
										target="_blank"
										className={dealDetailsStyles.dealItemLink}>
                                        {viewDetails?.clientDetails?.companyLinkedIn}
										<svg
											width="30"
											height="16"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M14.8165 0H1.18016C0.529039 0 0 0.516431 0 1.15372V14.8455C0 15.4826 0.529039 16 1.18016 16H14.8165C15.4688 16 16 15.4826 16 14.8455V1.15372C16 0.516431 15.4688 0 14.8165 0Z"
												fill="#007BB6"></path>
											<path
												d="M3.55837 2.20312C4.31761 2.20312 4.93387 2.81968 4.93387 3.5792C4.93387 4.33903 4.31761 4.95558 3.55837 4.95558C2.79622 4.95558 2.18164 4.33903 2.18164 3.5792C2.18164 2.81968 2.79622 2.20312 3.55837 2.20312ZM2.37007 5.99873H4.7456V13.6342H2.37007V5.99873Z"
												fill="white"></path>
											<path
												d="M6.23438 5.99809H8.50916V7.04186H8.54172C8.85822 6.44158 9.63251 5.80859 10.787 5.80859C13.1899 5.80859 13.6339 7.38952 13.6339 9.44588V13.6335H11.2611V9.92039C11.2611 9.03495 11.2457 7.89582 10.0279 7.89582C8.79311 7.89582 8.60468 8.86096 8.60468 9.85697V13.6335H6.23438V5.99809Z"
												fill="white"></path>
										</svg>
									</a> : "NA"}
								</li>
                                <li>
									<span>Total TR:</span>
                                    {viewDetails?.clientDetails?.tr ? viewDetails?.clientDetails?.tr : "NA"}
								</li>
							</ul>
						</div>					
					</div>
					<div className={dealDetailsStyles.dealRightCard}>
						<div className={dealDetailsStyles.dealLeftItem}>
							<h2>Additional Company Information</h2>
							<ul>
								<li>
									<span>Industry : </span>
									{viewDetails?.clientDetails?.industry ? viewDetails?.clientDetails?.industry : "NA"}
								</li>
								<li>
									<span>Company Size : </span>
									{viewDetails?.clientDetails?.companySize ? viewDetails?.clientDetails?.companySize :"NA"}
								</li>
                                <li>
									<span>Do the client have experience hiring talent outside of home country, especially from offshore locations like India?:</span>
                                    {viewDetails?.clientDetails?.allowOffshore ? 'Yes' : 'No'} 
								</li>
								<li>
									<span>About Company: </span>							
									{!isExpanded ?  (viewDetails?.clientDetails?.aboutCompany.length  > 150 ?
									<><span>{viewDetails?.clientDetails?.aboutCompany.slice(0, 150)}...</span>
									<a onClick={() => setIsExpanded(true)} className={dealDetailsStyles.viewClientReadMore}>read more</a></>
									 : viewDetails?.clientDetails?.aboutCompany.length === 0 ? "NA" : viewDetails?.clientDetails?.aboutCompany) : 

									 viewDetails?.clientDetails?.aboutCompany  ? viewDetails?.clientDetails?.aboutCompany : "NA"}
									{/* {(isExpanded) ? viewDetails?.clientDetails?.aboutCompany : <>{viewDetails?.clientDetails?.aboutCompany.slice(0, 150)}...<a onClick={() => setIsExpanded(true)} className={dealDetailsStyles.viewClientReadMore}>read more</a></>} */}
								</li>
							</ul>
						</div>
					</div>
				</div>
                <Table 
				scroll={{  y: '100vh' }}
				dataSource={viewDetails.hrList ? viewDetails?.hrList : []} 
				columns={columns} 
				pagination={false}
				/>
			</div>

			<Button type="primary" className={dealDetailsStyles.viewJobBtn} onClick={() => setModaljobpostDraft(true)}>
				View Job Post in Draft
			</Button>

			<Modal
				width={'864px'}
				centered
				footer={false}
				open={jobpostDraft}
				className="jobpostDraftModal"
				onOk={() => setModaljobpostDraft(false)}
				onCancel={() => setModaljobpostDraft(false)}
			>

				<h2>Job Post in Draft</h2>

				 <div className={dealDetailsStyles.jobPostDraftContent}>
					<div className={dealDetailsStyles.jobPostDraftBox}>
						<div className={dealDetailsStyles.jobPostTopHeading}>
							<h4>Role and type of hiring</h4>
							<span>Last Edited on: 2-10-2023</span>
						</div>
						<div className={dealDetailsStyles.draftInnerContent}>
							<div className={dealDetailsStyles.jobRoleTypeBox}>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Please enter title for this position</p>
									<h5>Frontend Develper</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Number of Talents Required</p>
									<h5>5</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Enter contract duration (In Months)</p>
									<h5>12 Months</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Years of Experience needed</p>
									<h5>5</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Is this a temporary or permenant hiring?</p>
									<h5>Permanent</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Is this is a remote opportunity</p>
									<h5>Yes</h5>
								</div>
							</div>
						</div>
					</div>

					<div className={dealDetailsStyles.jobPostDraftBox}>
						<div className={dealDetailsStyles.jobPostTopHeading}>
							<h4>Skills and Budget</h4>
							<span>Last Edited on: 2-10-2023</span>
						</div>
						<div className={dealDetailsStyles.draftInnerContent}>
							<div className={`${dealDetailsStyles.jobRoleTypeBox} ${dealDetailsStyles.SkillBudget}`}>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Please add top 5 must have skills</p>
									<ul className={dealDetailsStyles.SkillWrapBox}>
										<li><img className={dealDetailsStyles.starIcon} src={Star} alt="star"/> Angular <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li><img className={dealDetailsStyles.starIcon} src={Star} alt="star"/> HTML <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li><img className={dealDetailsStyles.starIcon} src={Star} alt="star"/> Python <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li><img className={dealDetailsStyles.starIcon} src={Star} alt="star"/> CSS <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
									</ul>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Please add the good to have skills</p>
									<ul className={dealDetailsStyles.SkillWrapBox}>
										<li>TypeScript <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li>NgRx <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li>Akita <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li>RxJS <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li>PrimeNG <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li>Karma <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li>Protractor <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li>Akita <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li>ESLint <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li>Cypress <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li>Prettier <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li>Husky <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li>SVN <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
										<li>RxJS <span className={dealDetailsStyles.close}><AiOutlineClose /></span></li>
									</ul>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Do you have a budget in mind (Monthly)</p>
									<h5>USD 1950 - 2500/month</h5>
								</div>
							</div>
						</div>
					</div>

					<div className={dealDetailsStyles.jobPostDraftBox}>
						<div className={dealDetailsStyles.jobPostTopHeading}>
							<h4>Employment details</h4>
							<span>Last Edited on: 2-10-2023</span>
						</div>
						<div className={dealDetailsStyles.draftInnerContent}>
							<div className={`${dealDetailsStyles.jobRoleTypeBox} ${dealDetailsStyles.employDetailWrap}`}>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Please select employment type </p>
									<h5>Full-time</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Select Timezone - Shift Time</p>
									<h5>Select Timezone - Shift Time</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>When do you want the talent to start? </p>
									<h5>15 Days</h5>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>What are you trying to achieve with Uplers?</p>
									<h5>I want to hire a vetted contractor from India</h5>
								</div>
							</div>
						</div>
					</div>

					<div className={dealDetailsStyles.jobPostDraftBox}>
						<div className={dealDetailsStyles.jobPostTopHeading}>
							<h4>JD/Responsibilities & requirements</h4>
							<span>Last Edited on: 2-10-2023</span>
						</div>
						<div className={dealDetailsStyles.draftInnerContent}>
							<div className={`${dealDetailsStyles.jobRoleTypeBox} ${dealDetailsStyles.SkillBudget}`}>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>JD Link</p>
									<a href="#">docs.google.com/spreadsheets/d/1CVpdGbkwFDNELnxBDJ9Oj9pBYiGhSLLpx6Tco2MBR5E/edit#</a>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Roles & Responsibilities </p>
									<ul className={dealDetailsStyles.jdRequrementText}>
										<li>Design and implement scalable and maintainable frontend solutions that meet business requirements.</li>
										<li>Develop, test, and deploy high-quality code and libraries for future use for data-heavy applications.</li>
										<li>Collaborate with cross-functional teams including UI/UX designers, backend developers, and product managers to deliver effective solutions.</li>
										<li>Lead the development of technical specifications and documentation.</li>
										<li>Analyze and troubleshoot complex frontend issues to identify root causes and develop solutions.</li>
										<li>ptimize application for maximum speed and scalability</li>
										<li>Continuously improve the quality of the front-end codebase through code reviews, automated testing, and other best practices.</li>
										<li>Stay up-to-date with emerging trends and technologies in front-end development.</li>
										<li>Mentor and coach junior developers</li>
									</ul>
								</div>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Requirements</p>
									<ul className={dealDetailsStyles.jdRequrementText}>
										<li>At least 5 years of professional experience as a front-end developer, working with Angular and other web technologies.</li>
										<li>Strong knowledge of HTML, CSS, JavaScript and TypeScript, as well as Angular concepts and features such as components, directives, services, pipes, modules, routing, etc.</li>
										<li>Experience with state management libraries such as NgRx or Akita and reactive programming using RxJS.</li>
										<li>Experience with UI frameworks such as Bootstrap or Material Design, as well as UI components libraries such as Angular Material or PrimeNG.</li>
										<li> Experience with testing tools and frameworks such as Jasmine, Karma, Protractor or Cypress.</li>
										<li>Experience with code quality tools and practices such as ESLint, Prettier, Husky or SonarQube.</li>
										<li>Experience with version control systems such as Git or SVN, as well as CI/CD tools and platforms such as Jenkins, GitHub Actions or Azure DevOps.</li>
										<li>Experience with agile methodologies such as Scrum or Kanban, as well as tools such as Jira or Trello.</li>
										<li>Excellent communication and collaboration skills, as well as a positive attitude and a growth mindset.</li>
										<li>A portfolio or a GitHub profile that showcases your previous work and projects. If you're passionate about developing user-friendly and visually appealing web applications and have a strong background in enterprise-style applications and data-heavy applications, we encourage you to apply.</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					<div className={dealDetailsStyles.jobPostDraftBox}>
						<div className={dealDetailsStyles.jobPostTopHeading}>
							<h4>Job Description</h4>
							<span>Last Edited on: 2-10-2023</span>
						</div>
						<div className={dealDetailsStyles.draftInnerContent}>
							<div className={`${dealDetailsStyles.jobRoleTypeBox} ${dealDetailsStyles.SkillBudget}`}>
								<div className={dealDetailsStyles.jobRoleTypePart}>
									<p>Upload your JD</p>
									<a href="#">Download JD</a>
								</div>
							</div>
						</div>
					</div>

				</div>

			</Modal>
		</WithLoader>

		
		
    )
}

export default ViewClientDetails;