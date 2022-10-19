import buttonStyles from './button_field.module.css';
const ButtonField = ({ label, onClickHandler, backgroundColor, textColor }) => {
	return (
		<button
			className={`${buttonStyles.buttonField} ${buttonStyles.ripple}`}
			style={{ backgroundColor: backgroundColor, color: textColor }}>
			{label}
		</button>
	);
};

export default ButtonField;
