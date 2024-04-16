import hrStatusStyles from './hrStatusComponent.module.css';
import { Tooltip } from 'antd'

const HRStatusComponent = ({ title, backgroundColor, color }) => {
	if(title.length >= 20){
	return	<Tooltip
		placement="top"
		title={title}>
		<div
			className={hrStatusStyles.hrStatusContainer}
			style={{
				backgroundColor: backgroundColor,
				color: color,
				textAlign: 'center',
				maxWidth: '100% ',
				display:'inline-block',
				lineHeight:'32px'
			}}>
			{title}
		</div>
		</Tooltip>
	}
	return (
		<div
			className={hrStatusStyles.hrStatusContainer}
			style={{
				backgroundColor: backgroundColor,
				color: color,
				textAlign: 'center',
			}}>
			{title}
		</div>
	);
};

export default HRStatusComponent;
