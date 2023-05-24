export const engagementUtils = {
	modifyEngagementListData: (response) => {
		return response?.responseBody?.rows.map((item) => ({
			clientFeedback: item?.clientFeedback,
			lastFeedbackDate: item?.lastFeedbackDate
				? item?.lastFeedbackDate?.split(' ')[0]
				: 'NA',
			onBoardingForm: item?.onBoardingForm,
			engagementId_HRID: item?.engagementId_HRID,
			talentName: item?.talentName,
			company: item?.company,
			currentStatus: item?.currentStatus,
			clientLegal_StatusID: item?.clientLegal_StatusID,
			onboardID: item?.onBoardID,
			talentID: item?.talentID,
			contractEndDate: item?.contractEndDate,
			activeEngagement: item?.activeEngagement,
			feedbcakReceive: item?.feedbcakReceive,
			avgDP: item?.avgDP,
			avgNR: item?.avgNR,
			feedbackType: item?.feedbackType,
			hrNumber: item?.hrNumber,
			engagementID: item?.engagementId_HRID.split(' /')[0],
			hrID: item?.hR_ID,
			s_TotalDP:item?.s_TotalDP,
			clientName:item?.clientName?item?.clientName:'NA',
			engagementCount: item?.engagementCount?item?.engagementCount:'NA',
			deployedSource:item?.deployedSource?item?.deployedSource:'NA',
			tscName: item?.tscName?item?.tscName:'NA',
			geo:item?.geo?item?.geo:'NA',
			position:item?.position?item?.position:'NA',
			isLost:item?.isLost===0?"No":"Yes",
			oldTalent:item?.oldTalent?item?.oldTalent:'NA',
			replacementEng:item?.replacementEng?item?.replacementEng:'NA',
			noticePeriod:item?.noticePeriod?item?.noticePeriod:'NA',
			kickOff:item?.kickOff?item?.kickOff:'NA',
			billRate:item?.billRate?item?.billRate:'NA',
			actualBillRate:item?.actualBillRate?item?.actualBillRate:'NA',
			payRate:item?.payRate?item?.payRate:'NA',
			actualPayRate:item?.actualPayRate?item?.actualPayRate:'NA',
			contractStartDate:item?.contractStartDate?item?.contractStartDate:'NA',
			contractEndDate:item?.contractEndDate?item?.contractEndDate:'NA',
			actualEndDate:item?.actualEndDate?item?.actualEndDate:'NA',
			nr:item?.nr?item?.nr:'NA',
			actualNR:item?.actualNR?item?.actualNR:'NA',
			dP_Percentage:item?.dP_Percentage?item?.dP_Percentage:'NA',
			renewalstartDate:item?.renewalstartDate?item?.renewalstartDate:'NA',
			renewalendDate:item?.renewalendDate?item?.renewalendDate:'NA',
			engagementTenure:item?.engagementTenure?item?.engagementTenure:'NA',
			sowSignedDate:item?.sowSignedDate?item?.sowSignedDate:'NA',
			nbdName:item?.nbdName?item?.nbdName:'NA',
			amName:item?.amName?item?.amName:'NA',
			invoiceSentDate:item?.invoiceSentDate?item?.invoiceSentDate:'NA',
			invoiceNumber:item?.invoiceNumber?item?.invoiceNumber:'NA',
			invoiceStatus:item?.invoiceStatus?item?.invoiceStatus:'NA',
			dateofPayment:item?.dateofPayment?item?.dateofPayment:'NA',
			createdByDatetime:item?.createdByDatetime?item?.createdByDatetime:'NA',
			typeOfHR:item?.typeOfHR?item?.typeOfHR:'NA',
			h_Availability:item?.h_Availability?item?.h_Availability:'NA'
		}));
	},
	getClientFeedbackColor: (color) => {
		switch (color) {
			case '0': {
				return '#006699';
				break;
			}
			case 'Green': {
				return '#006D2C';
				break;
			}
			case 'Red': {
				return '#C80000';
				break;
			}
			case 'Orange': {
				return '#FD7021';
				break;
			}
			default:
				break;
		}
	},
   modifyEngagementFeedbackData: (response) => {
        return response?.responseBody?.details?.rows.map((item) => ({
            engagemenID: item?.engagemenID,
            feedbackActionToTake: item?.feedbackActionToTake,
            feedbackComment: item?.feedbackComment,
            feedbackCreatedDateTime: item?.feedbackCreatedDateTime ? item?.feedbackCreatedDateTime?.split(' ')[0] : 'NA',
            feedbackType: item?.feedbackType,
        }));
    },

    engagementListSearch: (e, apiData) => {
        let filteredData = apiData?.filter((val) => {
            return (
                (val?.lastFeedbackDate &&
                    val?.lastFeedbackDate
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())) ||
                (val?.engagementId_HRID &&
                    val?.engagementId_HRID.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (val?.talentName &&
                    val?.talentName.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (val?.currentStatus &&
                    val?.currentStatus.toLowerCase().includes(e.target.value.toLowerCase()))

            );
        });

        return filteredData;
    },
};
