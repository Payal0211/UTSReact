import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
			fontWeight: 500,
			color: `var(--uplers-black)`,
			// display: 'flex',
			// flexDirection: 'row',
			// alignItems: 'center',
			// justifyContent: 'center',
			// marginTop: '300px',
			// marginLeft: '850px',
		}}
		spin
	/>
);

const WithLoader = ({ showLoader, children }) => {
	return <>{showLoader ? <Spin indicator={antIcon} /> : children}</>;
};

export default WithLoader;
