import { HiringRequestHRStatus, ProfileLog } from 'constants/application';
import HROperator from 'modules/hiring request/components/hroperator/hroperator';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { Link } from 'react-router-dom';


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
                child: filterList.currentStatus,
                isSearch: false,
            },
            {
                label: 'Tsc',
                name: 'tscName',
                child: filterList?.tscName,
                isSearch: true,
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
                label: 'Pending',
                name: 'pending',
                child: filterList?.pending,
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
    tableConfig: (getEngagementModal, setEngagementModal) => {
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
                            console.log(item, "item")
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
                                    // setEngagementModal({ ...getEngagementModal, engagementReplaceTalent: true })
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
                        style={{ color: 'black', textDecoration: 'underline' }}
                        onClick={() => setEngagementModal({ ...getEngagementModal, engagementOnboard: true })}
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
                            style={{ color: 'black', textDecoration: 'underline' }}>
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
};
