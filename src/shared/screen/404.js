import { Result } from 'antd';

const PageNotFound = () => {
	return (
		<Result
			style={{
				height: '600px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
			status="404"
			title="404"
			subTitle="Sorry, the page you visited does not exist."
		/>
	);
};

export default PageNotFound;
