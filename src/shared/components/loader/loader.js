import { Spin } from 'antd';

const WithLoader = ({ showLoader, children }) => {
	return (
		<div>
			{showLoader ? (
				<Spin
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100vh',
						fontWeight: 500,
						fontSize: '1rem',
						color: `var(--uplers-black)`,
					}}
					size="large"
					tip="Loading..."
				/>
			) : (
				children
			)}
		</div>
	);
};

export default WithLoader;
