import { HiringRequestHRStatus, ProfileLog } from 'constants/application';
import HROperator from 'modules/hiring request/components/hroperator/hroperator';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { Link } from 'react-router-dom';
import { engagementUtils } from './engagementUtils';
import allengagementStyles from '../engagementFeedback/engagementFeedback.module.css';


export const allEngagementConfig = {
    engagementFilterTypeConfig: (filterList) => {
        console.log(filterList, "filterList")
        return [
            {
                label: 'Client Feedback',
                name: 'clientFeedback',
                child: filterList?.clientFeedback,
                isSearch: true,
            },
            {
                label: 'Hiring',
                name: 'typeOfHiring',
                child: filterList?.typeOfHiring,
                isSearch: true,
            },
            {
                label: 'Current Status',
                name: 'currentStatus',
                child: filterList?.currentStatus,
                isSearch: false,
            },
            {
                label: 'Company',
                name: 'company',
                child: filterList?.company,
                isSearch: true,
            },
            {
                label: 'Geo',
                name: 'geo',
                child: filterList?.geo,
                isSearch: true,
            },
            {
                label: 'Position',
                name: 'postion',
                child: filterList?.postion,
                isSearch: true,
            },
            {
                label: 'Engagement Tenure',
                name: 'engagementTenure',
                child: filterList?.engagementTenure,
                isSearch: true,
            },
            {
                label: 'NBD',
                name: 'nbdName',
                child: filterList?.nbdName,
                isSearch: true,
            },
            {
                label: 'AM',
                name: 'amName',
                child: filterList?.amName,
                isSearch: true,
            },
            {
                label: 'Lost',
                name: 'lost',
                child: filterList?.lost,
                isSearch: true,
            },
            {
                label: 'Months',
                name: 'months',
                child: filterList?.months,
                isSearch: true,
            },
            {
                label: 'Search',
                name: 'searchType',
                child: filterList?.searchType,
                isSearch: true,
            },
            {
                label: 'Years',
                name: 'years',
                child: filterList?.years,
                isSearch: true,
            },
        ];
    },
    tableConfig: (getEngagementModal, setEngagementModal, setOnbaordId, setFeedBackData) => {
        return [
            {
                title: '    ',
                dataIndex: 'action',
                key: 'action',
                align: 'left',
                render: (_, param) => {
                    return <HROperator
                        title="Action"
                        icon={<ArrowDownSVG style={{ width: '16px' }} />}
                        backgroundColor={`var(--color-sunlight)`}
                        iconBorder={`1px solid var(--color-sunlight)`}
                        isDropdown={true}
                        listItem={[
                            {
                                label: 'Replace Engagement',
                                key: 'replaceEngagement',
                            },
                            {
                                label: 'Renew Engagement',
                                key: 'reNewEngagement',
                            },
                            {
                                label: 'End Engagement',
                                key: 'endEngagement',
                            },
                            {
                                label: 'Edit Bill Rate',
                                key: 'editRateBillRate',
                            },
                            {
                                label: 'Edit Pay Rate',
                                key: 'editPayRate',
                            },
                            {
                                label: 'Add Invoice Details',
                                key: 'addInvoiceDetails',
                            },
                        ]}
                        menuAction={(item) => {
                            switch (item.key) {
                                case "Replace Engagement": {
                                    setEngagementModal({ ...getEngagementModal, engagementReplaceTalent: true })
                                    break;
                                }
                                case "Renew Engagement": {
                                    // setEngagementModal({ ...getEngagementModal, engagementReplaceTalent: true })
                                    break;
                                }
                                case "End Engagement": {
                                    setEngagementModal({ ...getEngagementModal, engagementEnd: true })
                                    break;
                                }
                                case "Edit Bill Rate": {
                                    setEngagementModal({ ...getEngagementModal, engagementBillRateAndPayRate: true })
                                    break;
                                }
                                case "Edit Pay Rate": {
                                    setEngagementModal({ ...getEngagementModal, engagementBillRateAndPayRate: true })
                                    break;
                                }
                                case "Add Invoice Details": {
                                    setEngagementModal({ ...getEngagementModal, engagementInvoice: true })
                                    break;
                                }
                                default:
                                    break;
                            }
                        }}


                    />
                },
            },
            {
                title: 'Client Feedback',
                dataIndex: 'clientFeedback',
                key: 'clientFeedback',
                align: 'left',
                render: (text, result) => (
                    result?.clientFeedback === 0 && result?.onBoardID && result?.hR_ID ?
                        <Link
                            to=""
                            style={{ color: engagementUtils.getClientFeedbackColor(result?.feedbackType), textDecoration: 'underline' }
                            }
                            onClick={() => setEngagementModal({ ...getEngagementModal, engagementAddFeedback: true })}
                        >
                            {'Add'}
                        </Link>
                        :
                        <Link
                            to=""
                            style={{ color: engagementUtils.getClientFeedbackColor(result?.feedbackType), textDecoration: 'underline' }}
                            onClick={() => {
                                setOnbaordId(result?.onBoardID)
                                setFeedBackData((prev) => ({ ...prev, onBoardId: result?.onBoardID }))
                                setHRAndEngagementId((prev) => ({ ...prev, talentName: result?.talentName }))
                                setEngagementModal({ ...getEngagementModal, engagementFeedback: true })
                            }}
                        >
                            {'View'}
                        </Link >
                ),

            },
            {
                title: 'Last Feedback Date',
                dataIndex: 'lastFeedbackDate',
                key: 'lastFeedbackDate',
                align: 'left',
            },
            {
                title: 'Onboarding Form',
                dataIndex: 'ClientLegal_StatusID',
                key: 'ClientLegal_StatusID',
                align: 'left',
                render: (text, result) => (
                    result?.clientLegal_StatusID === 2 &&
                    <Link
                        to=""
                        style={{ color: '#006699', textDecoration: 'underline' }}
                        onClick={() => {
                            setOnbaordId(result?.onBoardID)
                            setEngagementModal({ ...getEngagementModal, engagementOnboard: true })
                        }}
                    >
                        {'View'}
                    </Link >
                ),
            },
            {
                title: 'Engagement ID/HR ID',
                dataIndex: 'engagementId_HRID',
                key: 'engagementId_HRID',
                align: 'left',
                render: (text, result) => (
                    <p>
                        {result?.engagementId_HRID.slice(0, result?.engagementId_HRID?.indexOf('/'))}
                        <Link
                            to=""
                            style={{ color: '#006699', textDecoration: 'underline' }}>
                            {result?.engagementId_HRID.slice(result?.engagementId_HRID?.indexOf('/'))}
                        </Link>
                    </p>
                ),
            },
            {
                title: 'Talent Name',
                dataIndex: 'talentName',
                key: 'talentName',
                align: 'left',
            },
            {
                title: 'Company',
                dataIndex: 'company',
                key: 'company',
                align: 'left',
            },
            {
                title: 'Current Status',
                dataIndex: 'currentStatus',
                key: 'currentStatus',
                align: 'left',
            },

        ];
    },
    clientFeedbackTypeConfig: (filterList) => {
        console.log(filterList, "filterList")
        return [
            {
                title: 'Last Feedback Date',
                dataIndex: 'feedbackCreatedDateTime',
                key: 'feedbackCreatedDateTime',
                align: 'left',
            },
            {
                title: 'Feedback Type',
                dataIndex: 'feedbackType',
                key: 'feedbackType',
                align: 'left',
                render: (text, result) => (
                    <span
                        style={{ background: engagementUtils.getClientFeedbackColor(result?.feedbackType) }}
                        className={allengagementStyles.feedbackLabel}
                    > {result?.feedbackType}
                    </span >
                ),
            },
            {
                title: 'Feedback Comments',
                dataIndex: 'feedbackComment',
                key: 'feedbackComment',
                align: 'left',
            },
            {
                title: 'Action To Take',
                dataIndex: 'feedbackActionToTake',
                key: 'feedbackActionToTake',
                align: 'left',
            }
        ];
    },
};
