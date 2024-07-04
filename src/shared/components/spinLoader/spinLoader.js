import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			// marginLeft: '350px',
			marginLeft: 'auto',
			marginRight: 'auto',
			fontWeight: 500,
			color: `var(--uplers-black)`,
		}}
		spin
	/>
);
const SpinLoader = () => {
	return <Spin indicator={antIcon} />;
};

export default SpinLoader;
