import { HiringRequestHRStatus, ProfileLog } from 'constants/application';

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

};
