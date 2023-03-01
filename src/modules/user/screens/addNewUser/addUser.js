import { Tabs } from 'antd';
import { useState } from 'react';
import DebriefingHR from 'modules/hiring request/components/debriefingHR/debriefingHR';
import AddNewUserStyle from './add_new_user.module.css';
import UsersFields from 'modules/user/components/userFIelds/userfields';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { Link } from 'react-router-dom';
import UTSRoutes from 'constants/routes';

const AddNewUser = () => {
	return (
		<div className={AddNewUserStyle.addNewContainer}>
			<Link to={UTSRoutes.USERLISTROUTE}>
				<div className={AddNewUserStyle.goBack}>
					<ArrowLeftSVG style={{ width: '16px' }} />
					<span>Go Back</span>
				</div>
			</Link>
			<UsersFields />
		</div>
	);
};

export default AddNewUser;
