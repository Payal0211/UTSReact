import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Modal, Skeleton, Tabs } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import HROperator from "modules/hiring request/components/hroperator/hroperator";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import HRDetailStyle from "./hrdetail.module.css";
import { ReactComponent as ArrowLeftSVG } from "assets/svg/arrowLeft.svg";
import { ReactComponent as ArrowDownSVG } from "assets/svg/arrowDown.svg";
import { ReactComponent as DeleteSVG } from "assets/svg/delete.svg";
import UTSRoutes from "constants/routes";
import { HTTPStatusCode } from "constants/network";
import WithLoader from "shared/components/loader/loader";
import { useForm } from "react-hook-form";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import {
  HRDeleteType,
  HiringRequestHRStatus,
  InputType,
} from "constants/application";
import { MasterDAO } from "core/master/masterDAO";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { hrUtils } from "modules/hiring request/hrUtils";
import { _isNull } from "shared/utils/basic_utils";
import { toast } from "react-toastify";
import AcceptHR from "modules/hiring request/components/acceptHR/acceptHR";

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
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [apiData, setAPIdata] = useState([]);
  const navigate = useNavigate();
  const switchLocation = useLocation();
  const [deleteReason, setDeleteReason] = useState([]);
  const [callHRapi, setHRapiCall] = useState(false);
  const [acceptHRModal, setAcceptHRModal] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  let urlSplitter = `${switchLocation.pathname.split("/")[2]}`;
  const updatedSplitter = "HR" + apiData && apiData?.ClientDetail?.HR_Number;
  const miscData = UserSessionManagementController.getUserSession();

  console.log("apiData--", apiData);
  const callAPI = useCallback(
    async (hrid) => {
      setLoading(true);
      let response = await hiringRequestDAO.getViewHiringRequestDAO(hrid);
      if (response?.statusCode === HTTPStatusCode.OK) {
        setAPIdata(response && response?.responseBody);
        setLoading(false);
      } else if (response.statusCode === HTTPStatusCode.NOT_FOUND) {
        navigate(UTSRoutes.PAGENOTFOUNDROUTE);
      }
    },
    [navigate]
  );

  const clientOnLossSubmitHandler = useCallback(
    async (d) => {
      _isNull(watch("hrDeleteLossReason")) &&
        setError("hrDeleteLossReason", "Please select loss reason.");

      _isNull(watch("hrDeleteLossRemark")) &&
        setError("hrDeleteLossRemark", "Please enter loss remark");

      let deleteObj = {
        id: urlSplitter?.split("HR")[0],
        deleteType: HRDeleteType.LOSS,
        reasonId: watch("hrDeleteLossReason").id,
        otherReason: _isNull(watch("hrLossDeleteOtherReason"))
          ? ""
          : watch("hrLossDeleteOtherReason"),
        reason: watch("hrDeleteLossReason").value,
        remark: watch("hrDeleteLossRemark"),
        onBoardId: 0,
      };

      let deletedResponse = await hiringRequestDAO.deleteHRDAO(deleteObj);
      if (deletedResponse && deletedResponse.statusCode === HTTPStatusCode.OK) {
        navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
      }
    },
    [navigate, setError, urlSplitter, watch]
  );
  const clientOnHoldSubmitHandler = useCallback(
    async (d) => {
      let deleteObj = {
        id: urlSplitter?.split("HR")[0],
        deleteType: HRDeleteType.ON_HOLD,
        reasonId: d.hrDeleteReason.id,
        otherReason: d.hrDeleteOtherReason,
        reason: d.hrDeleteReason.value,
        remark: d.hrDeleteRemark,
        onBoardId: 0,
      };

      let deletedResponse = await hiringRequestDAO.deleteHRDAO(deleteObj);
      if (deletedResponse && deletedResponse.statusCode === HTTPStatusCode.OK) {
        navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
      }
    },
    [navigate, urlSplitter]
  );

  const getHRDeleteReason = useCallback(async () => {
    let response = await MasterDAO.getHRDeletReasonRequestDAO();
    setDeleteReason(response && response?.responseBody?.details);
  }, []);

  const updateODRPoolStatusHandler = useCallback(
    async (data) => {
      await hiringRequestDAO.updateODRPOOLStatusRequestDAO(data);

      callAPI(urlSplitter?.split("HR")[0]);
    },
    [callAPI, urlSplitter]
  );

  useEffect(() => {
    setLoading(true);
    callAPI(urlSplitter?.split("HR")[0]);
  }, [urlSplitter, callAPI, callHRapi]);

  return (
    <WithLoader showLoader={isLoading}>
      <div className={HRDetailStyle.hiringRequestContainer}>
        <Link to={UTSRoutes.ALLHIRINGREQUESTROUTE}>
          <div className={HRDetailStyle.goback}>
            <ArrowLeftSVG style={{ width: "16px" }} />
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
              apiData?.HRStatus
            )}
            {apiData && (
              <div className={HRDetailStyle.hiringRequestPriority}>
                {All_Hiring_Request_Utils.GETHRPRIORITY(
                  apiData?.StarMarkedStatusCode
                )}
              </div>
            )}
          </div>
          {apiData?.HRStatusCode === HiringRequestHRStatus.CANCELLED
            ? null
            : hrUtils.showMatchmaking(
                apiData,
                miscData?.LoggedInUserTypeID,
                callAPI,
                urlSplitter,
                updatedSplitter
              )}

          {apiData?.HRStatusCode === HiringRequestHRStatus.CANCELLED ? null : (
            <div className={HRDetailStyle.hrDetailsRightPart}>
              {/* {hrUtils.getAcceptTR(
								apiData?.IsAccepted,
								miscData?.LoggedInUserTypeID,
								setAcceptHRModal,
								acceptHRModal,
							)}

							<AcceptHR
								hrID={apiData?.ClientDetail?.HR_Number}
								openModal={acceptHRModal}
								cancelModal={() => setAcceptHRModal(false)}
							/> */}
              {/* {hrUtils.getAccpetMoreTR(
								apiData?.IsAccepted,
								miscData?.LoggedInUserTypeID,
								apiData?.TR_Accepted,
							)} */}
              <AcceptHR
                hrID={apiData?.ClientDetail?.HR_Number}
                openModal={acceptHRModal}
                cancelModal={() => setAcceptHRModal(false)}
              />
              {apiData?.FetchMissingAction !== null ? (
                <>
                  <span>
                    <h4>Next Action is </h4>
                  </span>
                  <>
                    {hrUtils.showNextAction(
                      apiData,
                      acceptHRModal,
                      setAcceptHRModal
                    )}
                  </>
                </>
              ) : null}
              <HROperator
                title={
                  hrUtils.handleAdHOC(apiData && apiData?.AdhocPoolValue)[0]
                    ?.label
                }
                icon={<ArrowDownSVG style={{ width: "16px" }} />}
                backgroundColor={`var(--background-color-light)`}
                labelBorder={`1px solid var(--color-sunlight)`}
                iconBorder={`1px solid var(--color-sunlight)`}
                isDropdown={true}
                listItem={hrUtils.handleAdHOC(apiData?.AdhocPoolValue)}
                menuAction={(menuItem) => {
                  switch (menuItem.key) {
                    case "Pass to ODR": {
                      updateODRPoolStatusHandler({
                        hrID: urlSplitter?.split("HR")[0],
                        isPool: false,
                        isODR: true,
                      });
                      break;
                    }
                    case "Pass to Pool": {
                      updateODRPoolStatusHandler({
                        hrID: urlSplitter?.split("HR")[0],
                        isPool: true,
                        isODR: false,
                      });
                      break;
                    }
                    case "Keep it with me as well": {
                      updateODRPoolStatusHandler({
                        hrID: urlSplitter?.split("HR")[0],
                        isPool: true,
                        isODR: true,
                      });
                      break;
                    }
                    default:
                      break;
                  }
                }}
              />
              <div
                className={HRDetailStyle.hiringRequestPriority}
                onClick={() => {
                  setDeleteModal(true);
                  getHRDeleteReason();
                }}
              >
                <DeleteSVG
                  style={{ width: "24px" }}
                  className={HRDetailStyle.deleteSVG}
                />
              </div>
            </div>
          )}
        </div>
        {isLoading ? (
          <>
            <br />
            <Skeleton active />
            <br />
          </>
        ) : (
          apiData?.NextActionsForTalent?.length > 0 && (
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
                />
              </Suspense>
            )}
          </div>
          <div className={HRDetailStyle.talentPortal}>
            {isLoading ? (
              <Skeleton active />
            ) : (
              <Suspense>
                <TalentProfileCard
                  clientDetail={apiData?.ClientDetail}
                  callAPI={callAPI}
                  talentCTA={apiData?.talent_CTAs}
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
              />
            </Suspense>
          )}
        </div>
      </div>

      {/* ------------------ HR Delete Modal ---------------------- */}
      <Modal
        transitionName=""
        centered
        open={deleteModal}
        width={"864px"}
        footer={null}
        onCancel={() => setDeleteModal(false)}
      >
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
                  label: "On Hold",
                  key: "On Hold",
                  children: (
                    <div style={{ marginTop: "35px" }}>
                      <div className={HRDetailStyle.row}>
                        <div className={HRDetailStyle.colMd12}>
                          <HRSelectField
                            mode={"id/value"}
                            searchable={false}
                            setValue={setValue}
                            register={register}
                            name="hrDeleteReason"
                            label="Delete Reason"
                            defaultValue="Please select reason"
                            options={deleteReason && deleteReason}
                            required
                            isError={
                              errors["hrDeleteReason"] &&
                              errors["hrDeleteReason"]
                            }
                            errorMsg="Please select a delete reason."
                          />
                        </div>
                      </div>
                      {watch("hrDeleteReason")?.value === "Other" && (
                        <div className={HRDetailStyle.row}>
                          <div className={HRDetailStyle.colMd12}>
                            <HRInputField
                              register={register}
                              errors={errors}
                              validationSchema={{
                                required: "Please enter the other reason.",
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
                              required: "Please enter the HR Remark.",
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
                          className={HRDetailStyle.btn}
                        >
                          Cancel
                        </button>
                        <button
                          id={HRDeleteType.ON_HOLD}
                          type="submit"
                          onClick={handleSubmit(clientOnHoldSubmitHandler)}
                          className={HRDetailStyle.btnPrimary}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ),
                },
                {
                  label: "Loss",
                  key: "Loss",
                  children: (
                    <div style={{ marginTop: "35px" }}>
                      <div className={HRDetailStyle.row}>
                        <div className={HRDetailStyle.colMd12}>
                          <HRSelectField
                            mode={"id/value"}
                            searchable={false}
                            setValue={setValue}
                            register={register}
                            name="hrDeleteLossReason"
                            label="Delete Reason"
                            defaultValue="Please select reason"
                            options={deleteReason && deleteReason}
                            required
                            isError={
                              errors["hrDeleteLossReason"] &&
                              errors["hrDeleteLossReason"]
                            }
                            errorMsg="Please select a delete reason."
                          />
                        </div>
                      </div>
                      {watch("hrDeleteLossReason")?.value === "Other" && (
                        <div className={HRDetailStyle.row}>
                          <div className={HRDetailStyle.colMd12}>
                            <HRInputField
                              register={register}
                              errors={errors}
                              validationSchema={{
                                required: "Please enter the other reason.",
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
                            validationSchema={{
                              required: "please enter the HR Remark.",
                            }}
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
                          className={HRDetailStyle.btn}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={clientOnLossSubmitHandler}
                          className={HRDetailStyle.btnPrimary}
                        >
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
    </WithLoader>
  );
};

export default HRDetailScreen;
