import inputFieldStyles from './input_field.module.css';

const InputField = ({
	label,
	type,
	name,
	maxLength,
	placeholder,
	onChangeHandler,
	value,
	errorMsg,
	trailingIcon,
	onIconToggleHandler,
	validators,
}) => {
	return (
		<div>
			<label>{label}</label>
			<div>
				<input
					type={type}
					name={name}
					placeholder={placeholder}
					maxLength={maxLength}
				/>
				{trailingIcon && (
					<div onClick={onIconToggleHandler}>{trailingIcon}</div>
				)}
			</div>
		</div>
	);
};

export default InputField;
