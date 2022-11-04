import Routes from 'constants/routes';
import { Link } from 'react-router-dom';
const Test = () => {
	//Redirect to ViewAllHiringRequest
	return (
		<div>
			<Link to={Routes.ALLHIRINGREQUESTROUTE}>Go back</Link>
		</div>
	);
};

export default Test;
