import { Select } from 'antd';
import HRSelectFieldStyle from './hrSelectField.module.css';
import { useEffect, useMemo } from 'react';
const { Option } = Select;
const HRSelectField = ({
	register,
	setValue,
	label,
	name,
	defaultValue,
	options,
	onChangeHandler,
	required,
	isError,
	errorMsg,
}) => {
	const getChangeHandlerWithValue = (value) => {
		setValue(name, value);
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
			<label>
				{label}
				{required && <span className={HRSelectFieldStyle.reqField}>*</span>}
			</label>

			<Select
				defaultValue={defaultValue}
				onChange={(value) => getChangeHandlerWithValue(value)}
				options={options}
			/>
			{/* {options.map((item, index) => (
					<Option key={index}>{item?.mapKey}</Option>
				))}
			</Select> */}
			{errorDetail}
		</div>
	);
};

export default HRSelectField;
