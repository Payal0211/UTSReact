import buttonStyles from './button_field.module.css';
const ButtonField = ({
	isDisabled,
	label,
	onClickHandler,
	backgroundColor,
	textColor,
}) => {
	return (
		<button
			disabled={isDisabled}
			onClick={onClickHandler}
			className={
				isDisabled
					? `${buttonStyles.buttonField}`
					: `${buttonStyles.ripple} ${buttonStyles.buttonField}`
			}
			style={{ backgroundColor: backgroundColor, color: textColor }}>
			{label}
		</button>
	);
};

export default ButtonField;
