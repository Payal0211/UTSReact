import AddNewUserStyle from './add_new_user.module.css';
import UsersFields from 'modules/user/components/userFIelds/userfields';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { Link, useLocation } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import WithLoader from 'shared/components/loader/loader';
import { useState } from 'react';

const AddNewUser = () => {
	const switchLocation = useLocation();
	let urlSplitter = switchLocation.pathname.split('/')[2];
	const [loading, setLoading] = useState(false)

	return (
		<WithLoader showLoader={loading}>
			<div className={AddNewUserStyle.addNewContainer}>
				<Link to={UTSRoutes.USERLISTROUTE}>
					<div className={AddNewUserStyle.goBack}>
						<ArrowLeftSVG style={{ width: '16px' }} />
						<span>Go Back</span>
					</div>
				</Link>
				<UsersFields setLoading={setLoading} loading={loading} id={urlSplitter === 'addnewuser' ? 0 : urlSplitter} />
			</div>
		</WithLoader>
	);
};

export default AddNewUser;
