
export const engagementUtils = {
    modifyEngagementListData: (response) => {
        return response?.responseBody?.rows.map((item) => ({
            clientFeedback: item?.clientFeedback,
            lastFeedbackDate: item?.lastFeedbackDate ? item?.lastFeedbackDate?.split(' ')[0] : 'NA',
            onBoardingForm: item?.onBoardingForm,
            engagementId_HRID: item?.engagementId_HRID,
            talentName: item?.talentName,
            company: item?.company,
            currentStatus: item?.currentStatus,
            clientLegal_StatusID: item?.clientLegal_StatusID,
            activeEngagement: item?.activeEngagement,
            feedbcakReceive: item?.feedbcakReceive,
            avgDP: item?.avgDP,
            avgNR: item?.avgNR
        }));
    },
};