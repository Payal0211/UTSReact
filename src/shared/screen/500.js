import { Result } from 'antd';

const SomethingWentWrong = () => {
	return (
		<Result
			style={{
				height: '600px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
			status="500"
			title="500"
			subTitle="Sorry, something went wrong."
		/>
	);
};

export default SomethingWentWrong;
