
export const UserUtils = {
    userList: (listData) => {
        return listData?.responseBody?.rows.map((item) => ({
            key: item?.id,
            userName: item?.userName,
            fullName: item?.fullName,
            employeeID: item?.employeeID,
            emailID: item?.emailID,
            contactNumber: item?.contactNumber,
            userType: item?.userType,
            totalRecords: item?.totalRecords,
            createdbyDatetime: item?.createdbyDatetime,
            skypeID: item?.skypeID,
            teamManager: item?.teamManager,
            priorityCount: item?.priorityCount,
            opsManager: item?.opsManager,
            remainingPriorityCount: item?.remainingPriorityCount,
            userTypeID: item?.userTypeID,
            nbD_AM: item?.nbD_AM,
        }));
    },

};
