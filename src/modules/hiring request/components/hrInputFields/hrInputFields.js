import { InputType } from 'constants/application';
import HRInputFieldStyle from './hrInputFields.module.css';
import classNames from 'classnames';

const HRInputField = ({
	isTextArea,
	onClickHandler,
	leadingIcon,
	name,
	height,
	label,
	register,
	isError,
	errorMsg,
	errors,
	placeholder,
	required,
	value,
	disabled,
	type,
	validationSchema,
}) => {
	const formFieldClasses = classNames({
		[HRInputFieldStyle.inputfield]: true,
		[HRInputFieldStyle.disabled]: disabled,
	});

	return (
		<div className={HRInputFieldStyle.formField}>
			{label && (
				<label>
					{label}
					{required && <span className={HRInputFieldStyle.reqField}>*</span>}
				</label>
			)}

			{isTextArea ? (
				<div className={HRInputFieldStyle.inputBox}>
					{leadingIcon && (
						<div className={HRInputFieldStyle.leadingIcon}>{leadingIcon}</div>
					)}
					<textarea
						style={{
							paddingLeft: leadingIcon && '40px',
							cursor: InputType.BUTTON && 'pointer',
						}}
						value={InputType.BUTTON && value}
						className={formFieldClasses}
						type={type}
						name={name}
						placeholder={placeholder}
						onClick={InputType.BUTTON && onClickHandler}
						{...register(name, validationSchema)}
						id={name}
						disabled={disabled}
						required={required}
						height={height && height}
					/>
				</div>
			) : (
				<div className={HRInputFieldStyle.inputBox}>
					{leadingIcon && (
						<div className={HRInputFieldStyle.leadingIcon}>{leadingIcon}</div>
					)}
					<input
						style={{
							paddingLeft: leadingIcon && '40px',
							cursor: InputType.BUTTON && 'pointer',
						}}
						value={InputType.BUTTON && value}
						className={formFieldClasses}
						type={type}
						name={name}
						placeholder={placeholder}
						onClick={InputType.BUTTON && onClickHandler}
						{...register(name, validationSchema)}
						id={name}
						disabled={disabled}
						required={required}
						height={height && height}
					/>
				</div>
			)}
			{required && !disabled
				? errors &&
				  errors[name] && (
						<div className={HRInputFieldStyle.error}>
							{errors[name]?.message && `* ${errors[name]?.message}`}
						</div>
				  )
				: false}
			{isError && <div className={HRInputFieldStyle.error}>* {errorMsg}</div>}
		</div>
	);
};
export default HRInputField;
