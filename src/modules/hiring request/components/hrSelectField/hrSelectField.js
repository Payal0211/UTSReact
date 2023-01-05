import { Select } from 'antd';
import HRSelectFieldStyle from './hrSelectField.module.css';
import { useEffect, useMemo } from 'react';

const HRSelectField = ({
	mode,
	dropdownRender,
	controlledValue,
	setControlledValue,
	register,
	setValue,
	label,
	name,
	defaultValue,
	searchable,
	options,
	required,
	isError,
	errorMsg,
	isControlled,
	disabled,
	placeholder,
}) => {
	const getChangeHandlerWithValue = (value, option) => {
		setValue(name, option.id);
		isControlled && setControlledValue(option.id);
	};
	useEffect(() => {
		register(name, { required: required });
	}, [register, required, name]);

	const errorDetail = useMemo(
		() =>
			isError && <div className={HRSelectFieldStyle.error}>* {errorMsg}</div>,
		[errorMsg, isError],
	);

	return (
		<div className={HRSelectFieldStyle.formField}>
			{label && (
				<label>
					{label}
					{required && <span className={HRSelectFieldStyle.reqField}>*</span>}
				</label>
			)}

			{isControlled ? (
				<Select
					placeholder={placeholder}
					mode={mode}
					className={disabled && HRSelectFieldStyle.disabled}
					disabled={disabled}
					value={controlledValue || defaultValue}
					showSearch={searchable}
					onChange={(value, option) => getChangeHandlerWithValue(value, option)}
					options={options}
				/>
			) : (
				<Select
					placeholder={placeholder}
					mode={mode}
					dropdownRender={dropdownRender}
					disabled={disabled}
					showSearch={searchable}
					defaultValue={defaultValue}
					onChange={(value, option) => getChangeHandlerWithValue(value, option)}
					options={options}
				/>
			)}
			{errorDetail}
		</div>
	);
};

export default HRSelectField;
