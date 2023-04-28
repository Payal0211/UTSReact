import { HiringRequestHRStatus, ProfileLog } from 'constants/application';
import HROperator from 'modules/hiring request/components/hroperator/hroperator';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { Link } from 'react-router-dom';
import { engagementUtils } from './engagementUtils';
import allengagementStyles from '../engagementFeedback/engagementFeedback.module.css';
export const allEngagementConfig = {
	engagementFilterTypeConfig: (filterList) => {
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
	tableConfig: (
		getEngagementModal,
		setEngagementModal,
		setFilteredData,
		setEngagementBillAndPayRateTab,
		setOnbaordId,
		setFeedBackData,
		setHRAndEngagementId,
	) => {
		return [
			{
				title: '    ',
				dataIndex: 'action',
				key: 'action',
				align: 'left',
				render: (_, param, index) => {
					return (
						<HROperator
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
									case 'Replace Engagement': {
										setEngagementModal({
											...getEngagementModal,
											engagementReplaceTalent: true,
										});
										setFilteredData(param);
										break;
									}
									case 'Renew Engagement': {
										setEngagementModal({
											...getEngagementModal,
											engagementRenew: true,
										});
										setFilteredData(param);
										break;
									}
									case 'End Engagement': {
										setEngagementModal({
											...getEngagementModal,
											engagementEnd: true,
										});
										setFilteredData(param);
										break;
									}
									case 'Edit Bill Rate': {
										setEngagementModal({
											...getEngagementModal,
											engagementBillRateAndPayRate: true,
										});
										setEngagementBillAndPayRateTab('1');
										setFilteredData(param);
										break;
									}
									case 'Edit Pay Rate': {
										setEngagementModal({
											...getEngagementModal,
											engagementBillRateAndPayRate: true,
										});
										setEngagementBillAndPayRateTab('2');
										setFilteredData(param);
										break;
									}
									case 'Add Invoice Details': {
										setEngagementModal({
											...getEngagementModal,
											engagementInvoice: true,
										});
										setFilteredData(param);
										break;
									}
									default:
										break;
								}
							}}
						/>
					);
				},
			},
			{
				title: 'Client Feedback',
				dataIndex: 'clientFeedback',
				key: 'clientFeedback',
				align: 'left',
				render: (text, result) =>
					result?.clientFeedback === 0 && result?.onboardID && result?.hrID ? (
						<span
							style={{
								color: engagementUtils.getClientFeedbackColor(
									result?.feedbackType,
								),
								textDecoration: 'underline',
							}}
							onClick={() => {
								setHRAndEngagementId({
									talentName: result?.talentName,
									engagementID: result?.engagementId_HRID.slice(
										0,
										result?.engagementId_HRID?.indexOf('/'),
									),
									hrNumber: result?.engagementId_HRID.slice(
										result?.engagementId_HRID?.indexOf('/') + 1,
									),
									onBoardId: result?.onboardID,
									hrId: result?.hrID,
								});
								setEngagementModal({
									engagementFeedback: false,
									engagementBillRate: false,
									engagementPayRate: false,
									engagementOnboard: false,
									engagementAddFeedback: true,
									engagementBillRateAndPayRate: false,
									engagementEnd: false,
									engagementInvoice: false,
									engagementReplaceTalent: false,
								});
							}}>
							{'Add'}
						</span>
					) : (
						<span
							style={{
								color: engagementUtils.getClientFeedbackColor(
									result?.feedbackType,
								),
								textDecoration: 'underline',
							}}
							onClick={() => {
								setFeedBackData((prev) => ({
									...prev,
									onBoardId: result?.onboardID,
								}));
								setHRAndEngagementId({
									talentName: result?.talentName,
									engagementID: result?.engagementId_HRID.slice(
										0,
										result?.engagementId_HRID?.indexOf('/'),
									),
									hrNumber: result?.engagementId_HRID.slice(
										result?.engagementId_HRID?.indexOf('/') + 1,
									),
									onBoardId: result?.onboardID,
									hrId: result?.hrID,
								});
								setEngagementModal({
									engagementFeedback: true,
									engagementBillRate: false,
									engagementPayRate: false,
									engagementOnboard: false,
									engagementAddFeedback: false,
									engagementBillRateAndPayRate: false,
									engagementEnd: false,
									engagementInvoice: false,
									engagementReplaceTalent: false,
								});
							}}>
							{'View'}
						</span>
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
				render: (text, result) =>
					result?.clientLegal_StatusID === 2 && (
						<span
							style={{ color: '#006699', textDecoration: 'underline' }}
							onClick={() => {
								setHRAndEngagementId({
									talentName: result?.talentName,
									engagementID: result?.engagementId_HRID.slice(
										0,
										result?.engagementId_HRID?.indexOf('/'),
									),
									hrNumber: result?.engagementId_HRID.slice(
										result?.engagementId_HRID?.indexOf('/'),
									),
									onBoardId: result?.onboardID,
									hrId: result?.hrID,
								});
								setEngagementModal({
									engagementFeedback: false,
									engagementBillRate: false,
									engagementPayRate: false,
									engagementOnboard: true,
									engagementAddFeedback: false,
									engagementBillRateAndPayRate: false,
									engagementEnd: false,
									engagementInvoice: false,
									engagementReplaceTalent: false,
								});
							}}>
							{'View'}
						</span>
					),
			},
			{
				title: 'Engagement ID/HR ID',
				dataIndex: 'engagementId_HRID',
				key: 'engagementId_HRID',
				align: 'left',
				render: (text, result) => (
					<p>
						{result?.engagementId_HRID.slice(
							0,
							result?.engagementId_HRID?.indexOf('/'),
						)}
						<Link
							to={`/allhiringrequest/${result?.hrID}`}
							style={{ color: '#006699', textDecoration: 'underline' }}>
							{result?.engagementId_HRID.slice(
								result?.engagementId_HRID?.indexOf('/'),
							)}
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
						style={{
							background: engagementUtils.getClientFeedbackColor(
								result?.feedbackType,
							),
						}}
						className={allengagementStyles.feedbackLabel}>
						{' '}
						{result?.feedbackType}
					</span>
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
			},
		];
	},
};
