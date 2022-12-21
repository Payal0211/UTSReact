import { InputType } from 'constants/application';
import HRInputFieldStyle from './hrInputFields.module.css';

const HRInputField = ({
	onClickHandler,
	leadingIcon,
	name,
	label,
	register,
	errors,
	placeholder,
	required,
	value,
	type,
	validationSchema,
}) => {
	return (
		<div className={HRInputFieldStyle.formField}>
			{label && (
				<label>
					{label}
					{required && <span className={HRInputFieldStyle.reqField}>*</span>}
				</label>
			)}

			<div className={HRInputFieldStyle.inputBox}>
				{leadingIcon && (
					<div className={HRInputFieldStyle.leadingIcon}>{leadingIcon}</div>
				)}
				<input
					style={{
						paddingLeft: leadingIcon && '40px',
						cursor: InputType.BUTTON && 'pointer',
					}}
					// value={InputType.BUTTON && value}
					className={HRInputFieldStyle.inputfield}
					type={type}
					name={name}
					placeholder={placeholder}
					onClick={InputType.BUTTON && onClickHandler}
					{...register(name, validationSchema)}
					id={name}
					required={required}
				/>
			</div>
			{required
				? errors &&
				  errors[name]?.type === 'required' && (
						<div className={HRInputFieldStyle.error}>
							* {errors[name]?.message}
						</div>
				  )
				: false}
		</div>
	);
};
export default HRInputField;
