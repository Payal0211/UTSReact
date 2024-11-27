import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Skeleton, Tooltip, Modal, DatePicker,TimePicker, Tabs, Dropdown, Menu , message} from 'antd';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import HRDetailStyle from './hrdetail.module.css';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { ReactComponent as PowerSVG } from 'assets/svg/power.svg';
import { ReactComponent as Trash } from 'assets/svg/trash.svg';
import UTSRoutes from 'constants/routes';
import { HTTPStatusCode } from 'constants/network';
import WithLoader from 'shared/components/loader/loader';
// import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';


// import { useForm } from 'react-hook-form';

// import HRInputField from '../hrInputFields/hrInputFields';

// import { InputType } from 'constants/application';

import { ReactComponent as GeneralInformationSVG } from 'assets/svg/generalInformation.svg';
import { ReactComponent as DownloadJDSVG } from 'assets/svg/downloadJD.svg';
import { ReactComponent as HireingRequestDetailSVG } from 'assets/svg/HireingRequestDetail.svg';
import { ReactComponent as CurrentHrsSVG } from 'assets/svg/CurrentHrs.svg';
import { ReactComponent as TelentDetailSVG } from 'assets/svg/TelentDetail.svg';
import { ReactComponent as AssignCurrectSVG } from 'assets/svg/assignCurrentRight.svg';
import { ReactComponent as EditFieldSVG } from 'assets/svg/EditField.svg';
import { ReactComponent as AboutCompanySVG } from 'assets/svg/aboutCompany.svg';
import { ReactComponent as ClientTeamMemberSVG } from 'assets/svg/clientTeammember.svg';
import { ReactComponent as LinkedinClientSVG } from 'assets/svg/LinkedinClient.svg';
import { ReactComponent as DuringLegalSVG } from 'assets/svg/duringLegal.svg';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import { ReactComponent as BeforeKickOffSVG } from 'assets/svg/beforeKickOff.svg';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as AfterKickOffSVG } from 'assets/svg/AfterKickOff.svg';
import { ReactComponent as ClockIconSVG } from 'assets/svg/TimeStartEnd.svg';
import { ReactComponent as ReopenHR } from "assets/svg/reopen.svg";
import { ReactComponent as EditSVG } from 'assets/svg/pencil.svg';
import { ReactComponent as RefreshSyncSVG } from 'assets/svg/refresh-sync.svg'

import { HRDeleteType, HiringRequestHRStatus, InputType } from 'constants/application';

import { UserSessionManagementController } from 'modules/user/services/user_session_services';

import CloseHRModal from '../../components/closeHRModal/closeHRModal';
import ReopenHRModal from "../../components/reopenHRModal/reopenHrModal";
import CloneHR from 'modules/hiring request/components/cloneHR/cloneHR';
import CTASlot1 from 'modules/hiring request/components/CTASlot1/CTASlot1';
import CTASlot2 from 'modules/hiring request/components/CTASlot2/CTASlot2';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { Controller, useForm } from 'react-hook-form';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import TextEditor from 'shared/components/textEditor/textEditor';
import { BsThreeDots } from 'react-icons/bs';
import PreOnboardingTabModal from 'modules/hiring request/components/preOnboardingModals/preOnboardingTabModal';
import DeleteHRModal from 'modules/hiring request/components/deleteHR/deleteHRModal';
import RePostHRModal from 'modules/hiring request/components/repostHRModal/repostHRModal';

/** Lazy Loading the component */

const NextActionItem = React.lazy(() =>
  import("modules/hiring request/components/nextAction/nextAction.js")
);
const CompanyProfileCard = React.lazy(() =>
  import("modules/hiring request/components/companyProfile/companyProfileCard")
);
const TalentProfileCard = React.lazy(() =>
  import("modules/hiring request/components/talentProfile/talentProfileCard")
);
const ActivityFeed = React.lazy(() =>
  import("modules/hiring request/components/activityFeed/activityFeed")
);

const HRDetailScreen = () => {
	// const [deleteModal, setDeleteModal] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [isCardLoading, setCardLoading] = useState(false);
	const [apiData, setAPIdata] = useState([]);
	const[hrData,setHrData] = useState([]);
	const navigate = useNavigate();
	const switchLocation = useLocation();
	// const [deleteReason, setDeleteReason] = useState([]);
	const [callHRapi, setHRapiCall] = useState(false);

	const [editDebrifing, setEditDebring] = useState([]);
	const[page,setPage] = useState(1);
	const [closeHrModal, setCloseHrModal] = useState(false);
	const [deleteHRModal,setDeleteHrModal] = useState(false);
	const [userData, setUserData] = useState({});
	useEffect(() => {
		const getUserResult = async () => {
			let userData = UserSessionManagementController.getUserSession();
			if (userData) setUserData(userData);
		};
		getUserResult();
		
	}, []);

	useEffect(() => {
		getHrUserData(Number(urlSplitter?.split('HR')[0]));
	}, [page])
	

	const {
		watch,
		register,
		setValue,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({});

	let urlSplitter = `${switchLocation.pathname.split('/')[2]}`;
	const updatedSplitter = 'HR' + apiData && apiData?.ClientDetail?.HR_Number;
	const hybridInfo = apiData && {isHybrid: apiData?.ClientDetail?.IsHybrid,companyID: apiData?.ClientDetail?.CompanyId}
	const miscData = UserSessionManagementController.getUserSession();

	const callAPI = useCallback(
		async (hrid) => {
			setLoading(true);			
			let response = await hiringRequestDAO.getViewHiringRequestDAO(hrid);
			setLoading(false);
			// setAPIdata(response?.responseBody?.details?.rows)
			if (response?.statusCode === HTTPStatusCode.OK) {
				setAPIdata(response && response?.responseBody);
				setLoading(false);
			} else if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
				navigate(UTSRoutes.PAGENOTFOUNDROUTE);
			}
		},
		[navigate],
	);

	const getHrUserData = async (hrid) => {
		setCardLoading(true);
		const payload = {
			"totalrecord":2,
			"pagenumber":page,
			"filterFields":
			{
				"HRID":hrid
			}
		}
		const _response = await hiringRequestDAO.getHRTalentUsingPaginationDAO(payload);
		const data = JSON.parse(_response?.responseBody?.details);
		setHrData(data);
		setCardLoading(false);
	}

	// console.log(apiData, '--apiData-');
	// const clientOnLossSubmitHandler = useCallback(
	// 	async (d) => {
	// 		_isNull(watch('hrDeleteLossReason')) &&
	// 			setError('hrDeleteLossReason', 'Please select loss reason.');

	// 		_isNull(watch('hrDeleteLossRemark')) &&
	// 			setError('hrDeleteLossRemark', 'Please enter loss remark');

	// 		let deleteObj = {
	// 			id: urlSplitter?.split('HR')[0],
	// 			deleteType: HRDeleteType.LOSS,
	// 			reasonId: watch('hrDeleteLossReason').id,
	// 			otherReason: _isNull(watch('hrLossDeleteOtherReason'))
	// 				? ''
	// 				: watch('hrLossDeleteOtherReason'),
	// 			reason: watch('hrDeleteLossReason').value,
	// 			remark: watch('hrDeleteLossRemark'),
	// 			onBoardId: 0,
	// 		};

	// 		let deletedResponse = await hiringRequestDAO.deleteHRDAO(deleteObj);
	// 		if (deletedResponse && deletedResponse.statusCode === HTTPStatusCode.OK) {
	// 			navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
	// 		}
	// 	},
	// 	[navigate, setError, urlSplitter, watch],
	// );

	const AMAssignmentHandler = useCallback(() => {});

	// const clientOnHoldSubmitHandler = useCallback(
	// 	async (d) => {
	// 		let deleteObj = {
	// 			id: urlSplitter?.split('HR')[0],
	// 			deleteType: HRDeleteType.ON_HOLD,
	// 			reasonId: d.hrDeleteReason.id,
	// 			otherReason: d.hrDeleteOtherReason,
	// 			reason: d.hrDeleteReason.value,
	// 			remark: d.hrDeleteRemark,
	// 			onBoardId: 0,
	// 		};

	// 		let deletedResponse = await hiringRequestDAO.deleteHRDAO(deleteObj);
	// 		if (deletedResponse && deletedResponse.statusCode === HTTPStatusCode.OK) {
	// 			navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
	// 		}
	// 	},
	// 	[navigate, urlSplitter],
	// );

	// const getHRDeleteReason = useCallback(async () => {
	// 	let response = await MasterDAO.getHRDeletReasonRequestDAO();
	// 	setDeleteReason(response && response?.responseBody?.details);
	// }, []);

	// console.log(apiData, '-apiData');

	/**  Put ON HOLD * */

	// const updateODRPoolStatusHandler = useCallback(
	// 	async (data) => {
	// 		await hiringRequestDAO.updateODRPOOLStatusRequestDAO(data);

	// 		callAPI(urlSplitter?.split('HR')[0]);
	// 	},
	// 	[callAPI, urlSplitter],
	// );

	useEffect(() => {
		setLoading(true);
		callAPI(urlSplitter?.split('HR')[0]);
	}, [urlSplitter, callAPI, callHRapi]);

	useEffect(() => {
		const data = apiData?.hr_CTA?.filter((item) => item.key === 'DebriefingHR');
		setEditDebring(data);
	}, [apiData]);
// console.log('apiData', apiData)

const handleReopen = async (d) => {
	setLoading(true)
	let data = { hrID: apiData.HR_Id, updatedTR: apiData.ClientDetail.NoOfTalents };
	const response = await hiringRequestDAO.ReopenHRDAO(data);
	if (response?.statusCode === HTTPStatusCode.OK) {                            
	  setLoading(false)
	  setLoading && setLoading(false)
	  if(response?.responseBody?.details?.isReopen){
		 window.location.reload();
	  }else{
		message.error(response?.responseBody?.details?.message,10)
	  }
	}
	if(response?.statusCode === HTTPStatusCode.BAD_REQUEST){
	  message.error(response?.responseBody,10)
	  setLoading(false)
	}
	setLoading(false)
  };

const togglePriority = useCallback(
	async (payload) => {
		setLoading(true);
		localStorage.setItem('hrid', payload.hRID);
		let response = await hiringRequestDAO.setHrPriorityDAO(
			payload.isNextWeekStarMarked,
			payload.hRID,
			payload.person,
		);
	
		if (response?.statusCode === HTTPStatusCode.OK) {
			setLoading(false);
			message.success('priority has been changed.')
			callAPI(payload.hRID);
		} else if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
			setLoading(false);
			message.error(response.responseBody)
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
	[apiData, navigate],
);

	const shyncDataUTStoATS = async () => {
		setLoading(true)
		const result = await hiringRequestDAO.syncUTSTOATSRequestDAO(apiData?.HR_Id)

		if(result?.statusCode === HTTPStatusCode.OK){
			setLoading(false);
		}
		setLoading(false);
	}

	const deleteHR = async ()=>{
		setLoading(true)
		const result = await hiringRequestDAO.deleteHRRequestDAO(apiData?.HR_Id)

		if(result?.statusCode === HTTPStatusCode.OK){
			navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
			setLoading(false);
		}
		setLoading(false);
	}

	const editHR = () => {
		navigate(UTSRoutes.ADDNEWHR, { state: { isCloned: true } });
		localStorage.setItem('hrID', apiData?.HR_Id);
		localStorage.removeItem('dealID')
	};

	const [showAMModal, setShowAMModal] = useState(false);
	const [reopenHrModal, setReopenHrModal] = useState(false);
	const [repostHrModal,setRepostHrModal] = useState(false)
		
	return (
		<WithLoader
			showLoader={isLoading}
			className="mainLoader">
			<div className={HRDetailStyle.hiringRequestContainer}>
				<Link
					className={HRDetailStyle.hrback}
					to={UTSRoutes.ALLHIRINGREQUESTROUTE}>
					<div className={HRDetailStyle.goback}>
						<ArrowLeftSVG style={{ width: '16px' }} />
						<span>Go Back</span>
					</div>
				</Link>
				<div className={HRDetailStyle.hrDetails}>
					<div className={HRDetailStyle.hrDetailsLeftPart}>
						{/* Delete HR CTA */}
						<>{apiData?.AllowHRDelete && 
						<Tooltip title={'Delete HR'} placement="bottom" ><div className={HRDetailStyle.hiringRequestPriority} onClick={()=>setDeleteHrModal(true)}><Trash width="17" height="16" style={{ fontSize: '16px' }} /></div></Tooltip> }
						{deleteHRModal && (
                <Modal
                  width={"864px"}
                  centered
                  footer={false}
                  open={deleteHRModal}
                  className="updateTRModal"
                  onCancel={() => setDeleteHrModal(false)}
                >
					<DeleteHRModal
						closeHR={() => {}}
						deleteHRDetail={() => deleteHR()}
						onCancel={() => setDeleteHrModal(false)}
					/>
                </Modal>
              )}
						</>
						
						<div className={HRDetailStyle.hiringRequestIdSets}>
							{updatedSplitter}
						</div>
						{All_Hiring_Request_Utils.GETHRSTATUS(
							apiData?.HRStatusCode,
							apiData?.HRStatus,
						)}
						{apiData && (
							<div className={HRDetailStyle.hiringRequestPriority}>
								{All_Hiring_Request_Utils.GETHRPRIORITY(
									apiData?.StarMarkedStatusCode,apiData?.ClientDetail?.SalesPerson,apiData?.HRDetails?.HiringRequestId,togglePriority,"disabled"
								)}
							</div>
						)}
						{/** ----Clone HR */}
						{
						// userData?.LoggedInUserTypeID === 5 || userData?.LoggedInUserTypeID === 10 ? null : 
						apiData?.dynamicCTA?.CloneHR &&  (
							<CloneHR
								updatedSplitter={updatedSplitter}
								cloneHR={apiData?.dynamicCTA?.CloneHR}
								hybridInfo={hybridInfo}
							/>
						)}

						{/* Sync HR UTS to ATS */}
						{userData?.LoggedInUserTypeID === 1 &&  <Tooltip title={'Sync HR data UTS-ATS'} placement="bottom" ><div className={HRDetailStyle.hiringRequestPriority} onClick={()=> shyncDataUTStoATS()}><RefreshSyncSVG width="17" height="16" style={{ fontSize: '16px' }} /></div></Tooltip> }
						{/* {apiData?.AllowSpecialEdit && (apiData?.IsDirectHR ? <div onClick={()=> navigate(`/EditNewHR/${apiData?.HR_Id}`)}>
							<EditSVG style={{ fontSize: '16px' }} />{' '}
							<span className={HRDetailStyle.btnLabel}>Edit Direct HR</span></div> : <div onClick={()=> editHR()}>
							<EditSVG style={{ fontSize: '16px' }} />{' '}
							<span className={HRDetailStyle.btnLabel}>Edit HR</span></div>)} */}
							{apiData?.AllowSpecialEdit && (<div onClick={()=> editHR()}>
							<EditSVG style={{ fontSize: '16px' }} />{' '}
							<span className={HRDetailStyle.btnLabel}>Edit HR</span></div>)}

						
					</div>
				
					<div className={HRDetailStyle.hrDetailsRightPart}>
							{/* <button onClick={() => setShowAMModal(true)} className={HRDetailStyle.primaryButton}>Assign AM</button> */}

							{/* <PreOnboardingTabModal showAMModal={showAMModal} setShowAMModal={setShowAMModal} /> */}

							{apiData?.dynamicCTA?.CTA_Set1 &&
								apiData?.dynamicCTA?.CTA_Set1?.length > 0 && (
									<CTASlot1
										callAPI={callAPI}
										hrID={urlSplitter?.split('HR')[0]}
										slotItem={apiData?.dynamicCTA?.CTA_Set1}
										apiData={apiData}
										miscData={miscData}
									/>
								)}
							{apiData?.dynamicCTA?.CTA_Set2 &&
								apiData?.dynamicCTA?.CTA_Set2?.length > 0 && (
									<CTASlot2
										callAPI={callAPI}
										hrID={urlSplitter?.split('HR')[0]}
										slotItem={apiData?.dynamicCTA?.CTA_Set2}
										apiData={apiData}
										miscData={miscData}
									/>
								)}

{apiData?.dynamicCTA?.CloseHr?.IsEnabled && (
                <div
                  className={HRDetailStyle.hiringRequestPriority}
                  onClick={() => {
                    setCloseHrModal(true);
                  }}
                >
                  <Tooltip placement="bottom" title="Close HR">
                    <PowerSVG
                      style={{ width: "24px" }}
                      className={HRDetailStyle.deleteSVG}
                    />
                  </Tooltip>
                </div>
              )}

              {closeHrModal && (
                <Modal
                  width={"864px"}
                  centered
                  footer={false}
                  open={closeHrModal}
                  className="updateTRModal"
                  onCancel={() => setCloseHrModal(false)}
                >
                  <CloseHRModal
                    closeHR={() => {}}
                    setUpdateTR={() => setCloseHrModal(true)}
                    onCancel={() => setCloseHrModal(false)}
                    closeHRDetail={apiData}
                  />
                </Modal>
              )}

              {apiData?.dynamicCTA?.ReopenHR?.IsEnabled && (
                <div
                  className={HRDetailStyle.hiringRequestPriority}
                  onClick={() => {
					if(apiData?.IsPayPerCredit){
						// return handleReopen()
						setRepostHrModal(true)
					}else{
						setReopenHrModal(true);
					}                  
                  }}
                >
                  <Tooltip placement="bottom" title={apiData?.IsPayPerCredit ? "Re-post HR" : "Reopen HR"}>
                    <ReopenHR
                      style={{ width: "24px" }}
                      className={HRDetailStyle.deleteSVG}
                    />
                  </Tooltip>
                </div>
              )}

              {reopenHrModal && (
                <Modal
                  width={"864px"}
                  centered
                  footer={false}
                  open={reopenHrModal}
                  className="updateTRModal"
                  onCancel={() => setReopenHrModal(false)}
                >
                  <ReopenHRModal
                    onCancel={() => setReopenHrModal(false)}
                    apiData={apiData}

                  />
                </Modal>
              )}

			{repostHrModal && (
                <Modal
                  width={"950px"}
                  centered
                  footer={false}
                  open={repostHrModal}
                  className="updateTRModal"
                  onCancel={() => setRepostHrModal(false)}
                >
                  <RePostHRModal
                    onCancel={() => setRepostHrModal(false)}
                    apiData={apiData}
					handleReopen={()=>handleReopen()}
                  />
                </Modal>
              )}

							{/* {apiData?.activity_MissingAction_CTA?.length > 0 && (
								<span>
									<h4>
										{getNextActionMissingActionMemo?.key !== 'ShareAProfile' &&
											'Next Action'}{' '}
										{nextMissingActionHandler()}{' '}
									</h4>
								</span>
							)} */}
              {/**  As of No Put on HOLD */}
              {/* <HROperator
								title={
									hrUtils.handleAdHOC(apiData && apiData?.AdhocPoolValue)[0]
										?.label
								}
								icon={<ArrowDownSVG style={{ width: '16px' }} />}
								backgroundColor={`var(--background-color-light)`}
								labelBorder={`1px solid var(--color-sunlight)`}
								iconBorder={`1px solid var(--color-sunlight)`}
								isDropdown={true}
								listItem={hrUtils.handleAdHOC(apiData?.AdhocPoolValue)}
								menuAction={(menuItem) => {
									switch (menuItem.key) {
										case 'Pass to ODR': {
											updateODRPoolStatusHandler({
												hrID: urlSplitter?.split('HR')[0],
												isPool: false,
												isODR: true,
											});
											break;
										}
										case 'Pass to Pool': {
											updateODRPoolStatusHandler({
												hrID: urlSplitter?.split('HR')[0],
												isPool: true,
												isODR: false,
											});
											break;
										}
										case 'Keep it with me as well': {
											updateODRPoolStatusHandler({
												hrID: urlSplitter?.split('HR')[0],
												isPool: true,
												isODR: true,
											});
											break;
										}
										default:
											break;
									}
								}}
							/> */}


            </div>
		
        </div>
        {isLoading ? (
          <>
            <br />
            <Skeleton active />
            <br />
          </>
        ) : (
          (apiData?.NextActionsForTalent?.length > 0 && apiData?.ClientDetail?.CompanyTypeID === 1 ) && (
            <Suspense>
              <NextActionItem nextAction={apiData?.NextActionsForTalent} />
            </Suspense>
          )
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
                  apiData={apiData?.HRStatus}
                  allApiData={apiData}
                />
              </Suspense>
            )}
          </div>
          <div className={HRDetailStyle.talentPortal}>
            {isCardLoading ? (
              <Skeleton active/>
            ) : (
              <Suspense>
                <TalentProfileCard
                  urlSplitter={urlSplitter}
                  updatedSplitter={updatedSplitter}
                  apiData={apiData}
                  clientDetail={apiData?.ClientDetail}
                  callAPI={callAPI}
				  getHrUserData={getHrUserData}
				  setLoading={setLoading}
                  talentCTA={apiData?.dynamicCTA?.talent_CTAs || []}
                  HRStatusCode={apiData?.HRStatusCode}
                  talentDetail={apiData?.HRTalentDetails}
                  hrId={apiData.HR_Id}
                  miscData={miscData}
                  hiringRequestNumber={updatedSplitter}
                  hrType={apiData.Is_HRTypeDP}
                  starMarkedStatusCode={apiData?.StarMarkedStatusCode}
                  hrStatus={apiData?.HRStatus}
                  callHRapi={callHRapi}
                  setHRapiCall={setHRapiCall}
                  inteviewSlotDetails={apiData?.InterviewSlotDetails}
				  hrData={hrData}
				  setPage={setPage}
				  page={page}
                />
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
                hrID={urlSplitter?.split("HR")[0]}
                activityFeed={apiData?.HRHistory}
                tagUsers={apiData?.UsersToTag}
                callActivityFeedAPI={callAPI}
				ChannelID={apiData?.ChannelID}
              />
            </Suspense>
          )}
        </div>
      </div>

      {/* ------------------ HR Delete Modal ---------------------- */}
      {/* <Modal
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
							animated={true}
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
														mode={'id/value'}
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
											{watch('hrDeleteReason')?.value === 'Other' && (
												<div className={HRDetailStyle.row}>
													<div className={HRDetailStyle.colMd12}>
														<HRInputField
															register={register}
															errors={errors}
															validationSchema={{
																required: 'Please enter the other reason.',
															}}
															label="On Hold Other Reason"
															name="hrDeleteOtherReason"
															type={InputType.TEXT}
															placeholder="Enter Other Reason"
															required
														/>
													</div>
												</div>
											)}
											<div className={HRDetailStyle.row}>
												<div className={HRDetailStyle.colMd12}>
													<HRInputField
														isTextArea={true}
														register={register}
														errors={errors}
														validationSchema={{
															required: 'Please enter the HR Remark.',
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
													onClick={() => setDeleteModal(false)}
													className={HRDetailStyle.btn}>
													Cancel
												</button>
												<button
													id={HRDeleteType.ON_HOLD}
													type="submit"
													onClick={handleSubmit(clientOnHoldSubmitHandler)}
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
														mode={'id/value'}
														searchable={false}
														setValue={setValue}
														register={register}
														name="hrDeleteLossReason"
														label="Delete Reason"
														defaultValue="Please select reason"
														options={deleteReason && deleteReason}
														required
														isError={
															errors['hrDeleteLossReason'] &&
															errors['hrDeleteLossReason']
														}
														errorMsg="Please select a delete reason."
													/>
												</div>
											</div>
											{watch('hrDeleteLossReason')?.value === 'Other' && (
												<div className={HRDetailStyle.row}>
													<div className={HRDetailStyle.colMd12}>
														<HRInputField
															register={register}
															errors={errors}
															validationSchema={{
																required: 'Please enter the other reason.',
															}}
															label="On Loss Other Reason"
															name="hrLossDeleteOtherReason"
															type={InputType.TEXT}
															placeholder="Enter Other Reason"
															required
														/>
													</div>
												</div>
											)}
											<div className={HRDetailStyle.row}>
												<div className={HRDetailStyle.colMd12}>
													<HRInputField
														isTextArea={true}
														register={register}
														errors={errors}
														isError={
															errors['hrDeleteLossRemark'] &&
															errors['hrDeleteLossRemark']
														}
														errorMsg="please enter the Loss Remark."
														label="Loss Remark"
														name="hrDeleteLossRemark"
														type={InputType.TEXT}
														placeholder="Enter Remark"
														required
													/>
												</div>
											</div>
											<div className={HRDetailStyle.formPanelAction}>
												<button
													onClick={() => setDeleteModal(false)}
													className={HRDetailStyle.btn}>
													Cancel
												</button>
												<button
													onClick={clientOnLossSubmitHandler}
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
			</Modal> */}
    </WithLoader>
  );
};

export default HRDetailScreen;
