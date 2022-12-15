import { useRef, useState, useEffect } from 'react';

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
		<div className={inputFieldStyles.formField}>
			<label className={inputFieldStyles.inputLabel}>{label}</label>
			<div
				className={
					error ? inputFieldStyles.inputBoxError : inputFieldStyles.inputBox
				}>
				<input
					ref={inputRef}
					className={inputFieldStyles.inputfield}
					type={type}
					name={name}
					placeholder={placeholder}
					maxLength={maxLength}
					onChange={onChangeHandler}
					value={value}
				/>
				{trailingIcon && (
					<div
						onClick={onIconToggleHandler}
						className={inputFieldStyles.trailingIcon}>
						{trailingIcon}
					</div>
				)}
			</div>
			{error && <div className={inputFieldStyles.error}>* {errorMsg}</div>}
		</div>
	);
};

export default InputField;
