import { Radio, Spin } from 'antd';
import TalentAcceptanceStyle from './talentAcceptance.module.css';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { useCallback, useEffect, useState } from 'react';
import { ReactComponent as NextArrowSVG } from 'assets/svg/nextArrow.svg';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { LoadingOutlined } from '@ant-design/icons';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HTTPStatusCode } from 'constants/network';
import { useLocation } from 'react-router-dom';
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			marginLeft: '350px',
			fontWeight: 500,
			color: `var(--uplers-black)`,
		}}
		spin
	/>
);

const TalentAcceptance = ({
	talentName,
	hiringRequestNumber,
	starMarkedStatusCode,
	HRStatusCode,
	hrStatus,
	callAPI,
	talentInfo,
	closeModal,
}) => {
	const switchLocation = useLocation();
	let urlSplitter = switchLocation.pathname.split('/')[2];
	const [postAcceptanceValue, setPostAcceptanceValue] = useState(null);
	const [postAcceptanceAvailability, setPostAcceptanceAvailability] =
		useState(null);
	const [postAcceptanceHowSoon, setPostAcceptanceHowSoon] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const onChangePostAcceptanceDetails = (e) => {
		setPostAcceptanceValue(e.target.value);
	};
	const onChangePostAcceptanceDetailAvailability = (e) => {
		setPostAcceptanceAvailability(e.target.value);
	};
	const onChangePostAcceptanceDetailHowSoon = (e) => {
		setPostAcceptanceHowSoon(e.target.value);
	};

	const [talentAcceptanceResult, setTalentAcceptanceResult] = useState();
	const getHRAcceptanceHandler = useCallback(async (data) => {
		const response = await hiringRequestDAO.getHRAcceptanceRequestDAO({
			postID: data?.postId,
			talentID: data?.talentId,
		});
		setTalentAcceptanceResult(response && response?.responseBody?.details);
		setIsLoading(false);
	}, []);
	const openPostAcceptanceHandler = useCallback(async () => {
		setIsLoading(true);
		let response = await hiringRequestDAO.openPostAcceptanceRequestDAO({
			hrDetailID: talentInfo?.HiringDetailID,
			talentID: talentInfo?.TalentID,
		});
		response = response?.responseBody?.details;
		getHRAcceptanceHandler(response && response);
	}, [
		getHRAcceptanceHandler,
		talentInfo?.HiringDetailID,
		talentInfo?.TalentID,
	]);

	const saveTalentAcceptanceHandler = useCallback(async () => {
		setIsLoading(true);
		let formattedResponse = {
			talentId: talentInfo?.TalentID,
			loggedInUserId:
				UserSessionManagementController.getUserMiscellaneousData()
					.loggedInUserTypeID,
			totalCount: talentAcceptanceResult?.postAcceptanceDetail?.length,
			totalCountAvailability:
				talentAcceptanceResult?.postAcceptanceDetailAvailability?.length,
			totalCountHowSoon:
				talentAcceptanceResult?.postAcceptanceDetailHowSoon?.length,
			hrAcceptanceDetailHowSoon: postAcceptanceHowSoon,
			hrAcceptanceDetailAvailability: postAcceptanceAvailability,
			hrAcceptanceDetail: postAcceptanceValue,
			hrAcceptanceDetailList: talentAcceptanceResult?.postAcceptanceDetail,
			hrAcceptanceDetailAvailabilityList:
				talentAcceptanceResult?.postAcceptanceDetailAvailability,
			hrAcceptanceDetailHowSoonList:
				talentAcceptanceResult?.postAcceptanceDetailHowSoon,
		};

		let response = await hiringRequestDAO.addHRAcceptanceRequestDAO(
			formattedResponse,
		);

		if (response?.statusCode === HTTPStatusCode.OK) {
			setIsLoading(false);
			callAPI(urlSplitter);
		}
		setIsLoading(false);
	}, [
		callAPI,
		postAcceptanceAvailability,
		postAcceptanceHowSoon,
		postAcceptanceValue,
		talentAcceptanceResult?.postAcceptanceDetail,
		talentAcceptanceResult?.postAcceptanceDetailAvailability,
		talentAcceptanceResult?.postAcceptanceDetailHowSoon,
		talentInfo?.TalentID,
		urlSplitter,
	]);
	useEffect(() => {
		openPostAcceptanceHandler();
	}, [openPostAcceptanceHandler]);
	return (
		<div className={TalentAcceptanceStyle.container}>
			<div className={TalentAcceptanceStyle.modalTitle}>
				<h2>Talent Acceptance</h2>
			</div>
			<div className={TalentAcceptanceStyle.panelBody}>
				{isLoading ? (
					<Spin indicator={antIcon} />
				) : (
					<div className={TalentAcceptanceStyle.rightPane}>
						<div className={TalentAcceptanceStyle.whitep16}>
							<div className={TalentAcceptanceStyle.row}>
								<div className={TalentAcceptanceStyle.colMd5}>
									<div className={TalentAcceptanceStyle.transparentTopCard}>
										<div className={TalentAcceptanceStyle.cardLabel}>
											HR ID - {'  '}
										</div>
										<div className={TalentAcceptanceStyle.cardLabel}>
											{'  '}
											{hiringRequestNumber}
										</div>
									</div>
								</div>
								<div className={TalentAcceptanceStyle.colMd5}>
									<div className={TalentAcceptanceStyle.transparentTopCard}>
										<div className={TalentAcceptanceStyle.cardLabel}>
											Talent -{' '}
										</div>
										<div className={TalentAcceptanceStyle.cardLabel}>
											{talentName}
										</div>
									</div>
								</div>
								<div className={TalentAcceptanceStyle.colMd5}>
									<div className={TalentAcceptanceStyle.transparentTopCard}>
										<div className={TalentAcceptanceStyle.cardLabel}>
											Company -{' '}
										</div>
										<div className={TalentAcceptanceStyle.cardLabel}>
											{talentName}
										</div>
									</div>
								</div>
								<div className={TalentAcceptanceStyle.colMd5}>
									<div className={TalentAcceptanceStyle.transparentTopCard}>
										<div className={TalentAcceptanceStyle.cardLabel}>
											Role -{' '}
										</div>
										<div className={TalentAcceptanceStyle.cardLabel}>
											{talentName}
										</div>
									</div>
								</div>

								<div className={TalentAcceptanceStyle.statusPart}>
									<div className={TalentAcceptanceStyle.hiringRequestPriority}>
										{All_Hiring_Request_Utils.GETHRPRIORITY(
											starMarkedStatusCode,
										)}
									</div>
									<div className={TalentAcceptanceStyle.c}>
										{All_Hiring_Request_Utils.GETHRSTATUS(
											HRStatusCode,
											hrStatus,
										)}
									</div>
								</div>
							</div>
						</div>
						<p className={TalentAcceptanceStyle.info}>
							The following are your preferences, if you confirm them we will
							proceed with an interview.
						</p>
						<div className={TalentAcceptanceStyle.whitep16}>
							<form id="talentAcceptance">
								<div className={TalentAcceptanceStyle.row}>
									<div className={TalentAcceptanceStyle.rowBody}>
										<div className={TalentAcceptanceStyle.flex}>
											<NextArrowSVG
												height={'20px'}
												width={'20px'}
											/>
											<div className={TalentAcceptanceStyle.colMd12}>
												<div
													className={TalentAcceptanceStyle.radioFormGroup}
													style={{
														display: 'flex',
														flexDirection: 'column',
													}}>
													<label>
														{
															talentAcceptanceResult?.postAcceptanceDetail[0]
																?.client_ReadytoworkShift
														}
													</label>
													<Radio.Group
														className={TalentAcceptanceStyle.radioGroup}
														onChange={onChangePostAcceptanceDetails}
														value={postAcceptanceValue}>
														{talentAcceptanceResult?.postAcceptanceDetail?.map(
															(item) => {
																return (
																	<Radio value={item?.primaryKey}>
																		{item?.talent_ReadytoworkShift}
																	</Radio>
																);
															},
														)}
													</Radio.Group>
												</div>
											</div>
										</div>
										<div className={TalentAcceptanceStyle.flex}>
											<NextArrowSVG
												height={'20px'}
												width={'20px'}
											/>
											<div className={TalentAcceptanceStyle.colMd12}>
												<div
													className={TalentAcceptanceStyle.radioFormGroup}
													style={{
														display: 'flex',
														flexDirection: 'column',
													}}>
													<label>
														{
															talentAcceptanceResult
																?.postAcceptanceDetailAvailability[0]
																?.client_Readytoworkhrs
														}
													</label>

													<Radio.Group
														className={TalentAcceptanceStyle.radioGroup}
														onChange={onChangePostAcceptanceDetailAvailability}
														value={postAcceptanceAvailability}>
														{talentAcceptanceResult?.postAcceptanceDetailAvailability?.map(
															(item) => {
																return (
																	<Radio value={item?.primaryKey}>
																		{item?.talent_Readytoworkhrs}
																	</Radio>
																);
															},
														)}
													</Radio.Group>
												</div>
											</div>
										</div>
										<div className={TalentAcceptanceStyle.flex}>
											<NextArrowSVG
												height={'20px'}
												width={'20px'}
											/>
											<div className={TalentAcceptanceStyle.colMd12}>
												<div
													className={TalentAcceptanceStyle.radioFormGroup}
													style={{
														display: 'flex',
														flexDirection: 'column',
													}}>
													<label>
														{
															talentAcceptanceResult
																?.postAcceptanceDetailHowSoon[0]
																?.client_JoinWithin
														}
													</label>

													<Radio.Group
														className={TalentAcceptanceStyle.radioGroup}
														onChange={onChangePostAcceptanceDetailHowSoon}
														value={postAcceptanceHowSoon}>
														{talentAcceptanceResult?.postAcceptanceDetailHowSoon?.map(
															(item) => {
																return (
																	<Radio value={item?.primaryKey}>
																		{item?.talent_JoinWithin}
																	</Radio>
																);
															},
														)}
													</Radio.Group>
												</div>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>
						<div className={TalentAcceptanceStyle.notes}>
							<ul>
								<li>
									Once you accept an offer, there are no further chances to back
									out.
								</li>
								<li>
									After accepting this job, you may not work with or approach
									the client for six months
								</li>
							</ul>
						</div>
						<div className={TalentAcceptanceStyle.formPanelAction}>
							<button
								// disabled={isLoading}
								type="submit"
								onClick={saveTalentAcceptanceHandler}
								className={TalentAcceptanceStyle.btnPrimary}>
								Save Preference and Apply
							</button>
							<button
								// disabled={type === SubmitType.SAVE_AS_DRAFT}
								onClick={() => {
									closeModal();
								}}
								className={TalentAcceptanceStyle.btn}>
								Cancel
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TalentAcceptance;
