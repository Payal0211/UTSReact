import { Select } from 'antd';
import HRSelectFieldStyle from './hrSelectField.module.css';
import { useEffect, useMemo } from 'react';

const HRSelectField = ({
	value,
	register,
	setValue,
	label,
	name,
	defaultValue,
	searchable,
	options,
	onChangeHandler,
	required,
	isError,
	errorMsg,
}) => {
	const getChangeHandlerWithValue = (value, option) => {
		setValue(name, option.id);
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

			<Select
				value={value}
				showSearch={searchable}
				defaultValue={defaultValue}
				onChange={(value, option) => getChangeHandlerWithValue(value, option)}
				options={options}
			/>

			{errorDetail}
		</div>
	);
};

export default HRSelectField;
