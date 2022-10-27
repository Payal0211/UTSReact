import hrStatusStyles from './hrStatusComponent.module.css';

const HRStatusComponent = ({ title, backgroundColor, color }) => {
	return (
		<div
			className={hrStatusStyles.hrStatusContainer}
			style={{
				backgroundColor: backgroundColor,
				color: color,
			}}>
			{title}
		</div>
	);
};

export default HRStatusComponent;
