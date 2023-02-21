import { Tabs } from 'antd';
import { useState } from 'react';
import DebriefingHR from 'modules/hiring request/components/debriefingHR/debriefingHR';
import AddNewUserStyle from './add_new_user.module.css';
import UsersFields from 'modules/users/components/userfields';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { Link } from 'react-router-dom';
import UTSRoutes from 'constants/routes';

const AddNewUser = () => {
    const [title, setTitle] = useState('Add New Users');
    const [tabFieldDisabled, setTabFieldDisabled] = useState({
        addNewHiringRequest: false,
        debriefingHR: true,
    });

    const [enID, setEnID] = useState('');

    return (
        <div className={AddNewUserStyle.addNewContainer}>
            <Link to={UTSRoutes.USERLIST}>
                <div className={AddNewUserStyle.goBack}>
                    <ArrowLeftSVG style={{ width: '16px' }} />
                    <span>Go Back</span>
                </div>
            </Link>
            <UsersFields
                setTitle={setTitle}
                tabFieldDisabled={tabFieldDisabled}
                setTabFieldDisabled={setTabFieldDisabled}
                setEnID={setEnID}
            />
        </div>
    );
};

export default AddNewUser;
