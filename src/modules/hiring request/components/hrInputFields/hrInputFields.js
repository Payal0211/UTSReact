import { InputType } from 'constants/application';
import { useRef, useState, useEffect } from 'react';
import HRInputFieldStyle from './hrInputFields.module.css';

const HRInputField = ({
	label,
	type,
	name,
	maxLength,
	placeholder,
	onChangeHandler,
	value,
	errorMsg,
	leadingIcon,
	onClickHandler,
	required,
}) => {
	const inputRef = useRef();
	const [error, setError] = useState(errorMsg);

	useEffect(() => {
		setError(errorMsg);
		return () => {
			setError('');
		};
	}, [errorMsg]);

	return (
		<div className={HRInputFieldStyle.formField}>
			<label>{label}</label>
			{required && (
				<span style={{ paddingLeft: '5px' }}>
					<b>*</b>
				</span>
			)}
			<div
				className={
					error ? HRInputFieldStyle.inputBoxError : HRInputFieldStyle.inputBox
				}>
				{leadingIcon && (
					<div className={HRInputFieldStyle.leadingIcon}>{leadingIcon}</div>
				)}
				<input
					style={{
						paddingLeft: leadingIcon && '40px',
						cursor: InputType.BUTTON && 'pointer',
					}}
					ref={inputRef}
					className={HRInputFieldStyle.inputfield}
					type={type}
					name={name}
					placeholder={placeholder}
					maxLength={maxLength}
					onChange={onChangeHandler}
					value={value}
					onFocus={() => setError('')}
					onClick={InputType.BUTTON && onClickHandler}
					required={required}
				/>
			</div>
			{error && <div className={HRInputFieldStyle.error}>* {errorMsg}</div>}
		</div>
	);
};

export default HRInputField;
