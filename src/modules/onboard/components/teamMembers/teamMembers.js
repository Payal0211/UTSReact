import { BsThreeDots } from 'react-icons/bs';
import TeamMembersStyle from './teamMembers.module.css';
import { Divider, Dropdown, Menu } from 'antd';
import { AiFillLinkedin } from 'react-icons/ai';

const TeamMembers = ({
	onRemoveHandler,
	setAddTeamMemberModal,
	setEditMode,
	teamMembers,
	onEditHandler,
}) => {
	return (
		<div className={TeamMembersStyle.partOne}>
			<div className={TeamMembersStyle.hrFieldLeftPane}>
				<h3>Team Members</h3>
				<p>Please provide the necessary details</p>
				<div className={TeamMembersStyle.formPanelAction}>
					<button
						className={TeamMembersStyle.btnPrimary}
						onClick={() => {
							setAddTeamMemberModal(true);
							setEditMode(false);
						}}>
						Add More Team Member
					</button>
				</div>
			</div>

			<div className={TeamMembersStyle.hrFieldRightPane}>
				<div className={TeamMembersStyle.row}>
					{teamMembers.length > 0 ? (
						teamMembers.map((item, index) => {
							return (
								<div className={TeamMembersStyle.colMd6}>
									<div className={TeamMembersStyle.Card}>
										<div className={TeamMembersStyle.CardBody}>
											<div className={TeamMembersStyle.partWise}>
												<div>
													<div className={TeamMembersStyle.companyName}>
														<span
															style={{
																color: '#7C7C7C',
															}}>
															Name:
														</span>
														&nbsp;&nbsp;
														<span
															style={{
																fontWeight: '400',
															}}>
															{item?.name}
														</span>
													</div>
													<div className={TeamMembersStyle.companyName}>
														<span
															style={{
																color: '#7C7C7C',
															}}>
															Designation:
														</span>
														&nbsp;&nbsp;
														<span
															style={{
																fontWeight: '400',
															}}>
															Front End Developer
														</span>
													</div>
													<div className={TeamMembersStyle.companyName}>
														<span
															style={{
																color: '#7C7C7C',
															}}>
															Reporting To:
														</span>
														&nbsp;&nbsp;
														<span
															style={{
																fontWeight: '400',
															}}>
															{item?.reportingTo}
														</span>
													</div>
													<div className={TeamMembersStyle.companyName}>
														<span
															style={{
																color: '#7C7C7C',
															}}>
															Linkedin:
														</span>
														&nbsp;&nbsp;
														<span
															style={{
																fontWeight: '400',
															}}>
															{item?.linkedin}
														</span>
														&nbsp;&nbsp;
														<a
															// href={}
															target="_blank"
															rel="noreferrer">
															<AiFillLinkedin
																style={{
																	color: '#006699',
																	fontSize: '14px',
																}}
															/>
														</a>
													</div>
													<div className={TeamMembersStyle.companyName}>
														<span
															style={{
																color: '#7C7C7C',
															}}>
															Email:
														</span>
														&nbsp;&nbsp;
														<span
															style={{
																fontWeight: '400',
															}}>
															{item?.email}
														</span>
													</div>
													<div className={TeamMembersStyle.companyName}>
														<span
															style={{
																color: '#7C7C7C',
															}}>
															Buddy:
														</span>
														&nbsp;&nbsp;
														<span
															style={{
																fontWeight: '400',
															}}>
															{item?.buddy}
														</span>
													</div>
												</div>
												<div style={{ cursor: 'pointer' }}>
													<Dropdown
														trigger={['click']}
														placement="bottom"
														overlay={
															<Menu>
																<Menu.Item
																	key={0}
																	onClick={() => {
																		setEditMode(true);
																		onEditHandler(index);
																	}}>
																	Edit Details
																</Menu.Item>
																<Divider
																	style={{
																		margin: '3px 0',
																	}}
																/>
																<Menu.Item
																	key={1}
																	onClick={() => onRemoveHandler(index)}>
																	Remove Profile
																</Menu.Item>
															</Menu>
														}>
														<BsThreeDots
															style={{
																fontSize: '1.5rem',
															}}
														/>
													</Dropdown>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})
					) : (
						<h3>Please add Team members</h3>
					)}
				</div>
			</div>
		</div>
	);
};

export default TeamMembers;
