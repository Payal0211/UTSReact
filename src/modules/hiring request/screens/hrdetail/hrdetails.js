import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Modal, Skeleton, Tabs } from 'antd';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import HROperator from 'modules/hiring request/components/hroperator/hroperator';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import HRDetailStyle from './hrdetail.module.css';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { ReactComponent as DeleteSVG } from 'assets/svg/delete.svg';

import UTSRoutes from 'constants/routes';
import { HTTPStatusCode } from 'constants/network';
import WithLoader from 'shared/components/loader/loader';
import { useForm } from 'react-hook-form';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import {
	HiringRequestHRStatus,
	InputType,
	UserAccountRole,
} from 'constants/application';
import { MasterDAO } from 'core/master/masterDAO';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { hrUtils } from 'modules/hiring request/hrUtils';

// import MatchmakingModal from 'modules/hiring request/components/matchmaking/matchmaking';

/** Lazy Loading the component */
const NextActionItem = React.lazy(() =>
	import('modules/hiring request/components/nextAction/nextAction.js'),
);
const CompanyProfileCard = React.lazy(() =>
	import('modules/hiring request/components/companyProfile/companyProfileCard'),
);
const TalentProfileCard = React.lazy(() =>
	import('modules/hiring request/components/talentProfile/talentProfileCard'),
);
const ActivityFeed = React.lazy(() =>
	import('modules/hiring request/components/activityFeed/activityFeed'),
);

const MatchmakingModal = React.lazy(() =>
	import('modules/hiring request/components/matchmaking/matchmaking'),
);
const HRDetailScreen = () => {
	const [deleteModal, setDeleteModal] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [apiData, setAPIdata] = useState([]);
	const navigate = useNavigate();
	const switchLocation = useLocation();
	const [deleteReason, setDeleteReason] = useState([]);
	const [adHOC, setAdHOC] = useState([
		{
			label: 'Pass to Pool',
			// key: AddNewType.HR,
		},
		{
			label: 'Pass to ODR',
			// key: AddNewType.HR,
		},
		{
			label: 'Keep it with me as well',
			// key: AddNewType.CLIENT,
		},
	]);
	const {
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		getValues,
		watch,
		formState: { errors },
	} = useForm();
	let urlSplitter = `${switchLocation.pathname.split('/')[2]}`;
	const updatedSplitter = 'HR' + urlSplitter?.split('HR')[1];
	const miscData = UserSessionManagementController.getUserSession();

	const callAPI = useCallback(
		async (hrid) => {
			setLoading(true);
			let response = await hiringRequestDAO.getViewHiringRequestDAO(hrid);
			if (response.statusCode === HTTPStatusCode.OK) {
				setAPIdata(response && response?.responseBody);
				setLoading(false);
			} else if (response.statusCode === HTTPStatusCode.NOT_FOUND) {
				navigate(UTSRoutes.PAGENOTFOUNDROUTE);
			}
		},
		[navigate],
	);
	const clientSubmitHandler = useCallback(async (d) => {
		console.log(d, 'd---');
	}, []);
	// console.log('apoiData', apiData);
	const getHRDeleteReason = useCallback(async () => {
		let response = await MasterDAO.getHRDeletReasonRequestDAO();
		setDeleteReason(response && response?.responseBody?.details);
	}, []);
	console.log(deleteReason, '-deleteReason');
	useEffect(() => {
		setLoading(true);
		callAPI(urlSplitter?.split('HR')[0]);
	}, [urlSplitter, callAPI]);

	return (
		<WithLoader showLoader={isLoading}>
			<div className={HRDetailStyle.hiringRequestContainer}>
				<Link to={UTSRoutes.ALLHIRINGREQUESTROUTE}>
					<div className={HRDetailStyle.goback}>
						<ArrowLeftSVG style={{ width: '16px' }} />
						<span>Go Back</span>
					</div>
				</Link>
				<div className={HRDetailStyle.hrDetails}>
					<div className={HRDetailStyle.hrDetailsLeftPart}>
						<div className={HRDetailStyle.hiringRequestIdSets}>
							HR ID - {updatedSplitter}
						</div>
						{All_Hiring_Request_Utils.GETHRSTATUS(
							apiData?.HRStatusCode,
							apiData?.HRStatus,
						)}
						{apiData && (
							<div className={HRDetailStyle.hiringRequestPriority}>
								{All_Hiring_Request_Utils.GETHRPRIORITY(
									apiData?.StarMarkedStatusCode,
								)}
							</div>
						)}
					</div>
					{apiData?.HRTalentDetails?.length > 0 && (
						<Suspense>
							<MatchmakingModal
								refreshedHRDetail={callAPI}
								hrID={urlSplitter?.split('HR')[0]}
								hrNo={updatedSplitter}
								hrStatusCode={apiData?.HRStatusCode}
								hrStatus={apiData?.HRStatus}
								hrPriority={apiData?.StarMarkedStatusCode}
							/>
						</Suspense>
					)}

					<div className={HRDetailStyle.hrDetailsRightPart}>
						{hrUtils.getAcceptTR(
							apiData?.IsAccepted,
							miscData?.LoggedInUserTypeID,
						)}
						{hrUtils.getAccpetMoreTR(
							apiData?.IsAccepted,
							miscData?.LoggedInUserTypeID,
							apiData?.TR_Accepted,
						)}

						<HROperator
							title="Pass to Pool"
							icon={<ArrowDownSVG style={{ width: '16px' }} />}
							backgroundColor={`var(--background-color-light)`}
							labelBorder={`1px solid var(--color-sunlight)`}
							iconBorder={`1px solid var(--color-sunlight)`}
							isDropdown={true}
							listItem={adHOC}
						/>
						<div
							className={HRDetailStyle.hiringRequestPriority}
							onClick={() => {
								setDeleteModal(true);
								getHRDeleteReason();
							}}>
							<DeleteSVG style={{ width: '24px' }} />
						</div>

						<Modal
							transitionName=""
							centered
							open={deleteModal}
							width={'864px'}
							footer={null}
							onCancel={() => setDeleteModal(false)}>
							<div className={HRDetailStyle.modalBody}>
								<div>
									<h1>Delete Type</h1>
									<p>{updatedSplitter}</p>
								</div>

								<div className={HRDetailStyle.tabContainer}>
									<Tabs
										defaultActiveKey="1"
										// activeKey={title}
										animated={true}
										// tabBarGutter={200}

										centered
										tabBarStyle={{
											borderBottom: `1px solid var(--uplers-border-color)`,
										}}
										items={[
											{
												label: 'On Hold',
												key: 'On Hold',
												children: (
													<div style={{ marginTop: '35px' }}>
														<div className={HRDetailStyle.row}>
															<div className={HRDetailStyle.colMd12}>
																<HRSelectField
																	searchable={false}
																	setValue={setValue}
																	register={register}
																	name="hrDeleteReason"
																	label="Delete Reason"
																	defaultValue="Please select reason"
																	options={deleteReason && deleteReason}
																	required
																	isError={
																		errors['hrDeleteReason'] &&
																		errors['hrDeleteReason']
																	}
																	errorMsg="Please select a delete reason."
																/>
															</div>
														</div>
														<div className={HRDetailStyle.row}>
															<div className={HRDetailStyle.colMd12}>
																<HRInputField
																	isTextArea={true}
																	register={register}
																	errors={errors}
																	validationSchema={{
																		required: 'please enter the HR Remark.',
																	}}
																	label="On Hold Remark"
																	name="hrDeleteRemark"
																	type={InputType.TEXT}
																	placeholder="Enter Remark"
																	required
																/>
															</div>
														</div>
														<div className={HRDetailStyle.formPanelAction}>
															<button
																/* style={{
																					cursor:
																						type === SubmitType.SAVE_AS_DRAFT ? 'no-drop' : 'pointer',
																				}} */
																// disabled={type === SubmitType.SAVE_AS_DRAFT}
																// onClick={clientSubmitHandler}
																className={HRDetailStyle.btn}>
																Cancel
															</button>
															<button
																// disabled={isLoading}
																type="submit"
																onClick={handleSubmit(clientSubmitHandler)}
																className={HRDetailStyle.btnPrimary}>
																Delete
															</button>
														</div>
													</div>
												),
											},
											{
												label: 'Loss',
												key: 'Loss',
												children: (
													<div style={{ marginTop: '35px' }}>
														<div className={HRDetailStyle.row}>
															<div className={HRDetailStyle.colMd12}>
																<HRSelectField
																	searchable={false}
																	setValue={setValue}
																	register={register}
																	name="hrDeleteReason"
																	label="Delete Reason"
																	defaultValue="Please select reason"
																	options={deleteReason && deleteReason}
																	required
																	isError={
																		errors['hrDeleteReason'] &&
																		errors['hrDeleteReason']
																	}
																	errorMsg="Please select a delete reason."
																/>
															</div>
														</div>
														<div className={HRDetailStyle.row}>
															<div className={HRDetailStyle.colMd12}>
																<HRInputField
																	isTextArea={true}
																	register={register}
																	errors={errors}
																	validationSchema={{
																		required: 'please enter the HR Remark.',
																	}}
																	label="Loss Remark"
																	name="hrDeleteRemark"
																	type={InputType.TEXT}
																	placeholder="Enter Remark"
																	required
																/>
															</div>
														</div>
														<div className={HRDetailStyle.formPanelAction}>
															<button
																/* style={{
																					cursor:
																						type === SubmitType.SAVE_AS_DRAFT ? 'no-drop' : 'pointer',
																				}} */
																// disabled={type === SubmitType.SAVE_AS_DRAFT}
																// onClick={clientSubmitHandler}
																className={HRDetailStyle.btn}>
																Cancel
															</button>
															<button
																// disabled={isLoading}
																type="submit"
																// onClick={handleSubmit(clientSubmitHandler)}
																className={HRDetailStyle.btnPrimary}>
																Delete
															</button>
														</div>
													</div>
												),
											},
										]}
									/>
								</div>
							</div>
						</Modal>
					</div>
				</div>
				{isLoading ? (
					<>
						<br />
						<Skeleton active />
						<br />
					</>
				) : (
					<Suspense>
						<NextActionItem nextAction={apiData?.NextActionsForTalent} />
					</Suspense>
				)}

				<div className={HRDetailStyle.portal}>
					<div className={HRDetailStyle.clientPortal}>
						{isLoading ? (
							<Skeleton active />
						) : (
							<Suspense>
								<CompanyProfileCard
									clientDetail={apiData?.ClientDetail}
									talentLength={apiData?.HRTalentDetails?.length}
								/>
							</Suspense>
						)}
					</div>
					<div className={HRDetailStyle.talentPortal}>
						{isLoading ? (
							<Skeleton active />
						) : (
							<Suspense>
								<TalentProfileCard talentDetail={apiData?.HRTalentDetails} />
							</Suspense>
						)}
					</div>
				</div>
				<div className={HRDetailStyle.activityFeed}>
					{isLoading ? (
						<Skeleton active />
					) : (
						<Suspense>
							<ActivityFeed
								hrID={urlSplitter?.split('HR')[0]}
								activityFeed={apiData?.HRHistory}
								tagUsers={apiData?.UsersToTag}
								callActivityFeedAPI={callAPI}
							/>
						</Suspense>
					)}
				</div>
			</div>
		</WithLoader>
	);
};

export default HRDetailScreen;
