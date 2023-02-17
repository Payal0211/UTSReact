import { HiringRequestHRStatus, ProfileLog } from 'constants/application';
import { Link } from 'react-router-dom';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';

export const UserConfig = {
    tableConfig: (togglePriority) => {
        return [
            {
                title: 'Created on',
                dataIndex: 'createdbyDatetime',
                key: 'createdbyDatetime',
                align: 'left',
            },
            {
                title: 'Employee ID',
                dataIndex: 'employeeID',
                key: 'employeeID',
                align: 'left',
            },
            {
                title: 'Name',
                dataIndex: 'fullName',
                key: 'fullName',
                align: 'left',
            },
            {
                title: 'Email',
                dataIndex: 'emailID',
                key: 'emailID',
                align: 'left',
            },
            {
                title: 'Skype',
                dataIndex: 'skypeID',
                key: 'skypeID',
                align: 'left',
            },
            {
                title: 'Contact',
                dataIndex: 'contactNumber',
                key: 'contactNumber',
                align: 'left',
            },
            {
                title: 'Created on',
                dataIndex: 'createdbyDatetime',
                key: 'createdbyDatetime',
                align: 'left',
            },
        ];
    },
};
