import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
			// display: 'flex',
			// flexDirection: 'row',
			// alignItems: 'center',
			// justifyContent: 'center',
			// marginTop: '300px',
			// marginLeft: '850px',
			fontWeight: 500,
			color: `var(--uplers-black)`,
		}}
		spin
	/>
);

const WithLoader = ({ showLoader, children, className }) => {
	return (
		<>
			{showLoader ? (
				<Spin
					indicator={antIcon}
					className={className}
				/>
			) : (
				children
			)}
		</>
	);
};

export default WithLoader;
