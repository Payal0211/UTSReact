import { Select } from 'antd';
import HRSelectFieldStyle from './hrSelectField.module.css';
import { useState, useCallback, useMemo, useRef } from 'react';
const HRSelectField = ({
	label,
	defaultValue,
	options,
	onChangeHandler,
	required,
	errorMsg,
}) => {
	const [selectedValue, setSelectedValue] = useState(defaultValue);
	const firstMount = useRef(true);
	const onSelectCallback = useCallback(
		(value, option) => {
			firstMount.current = false;
			setSelectedValue(value);
			onChangeHandler(value, option);
		},
		[onChangeHandler],
	);
	const errorMemo = useMemo(() => {
		if (firstMount.current && required && selectedValue === defaultValue)
			return true;
		return false;
	}, [defaultValue, required, selectedValue]);

	return (
		<div className={HRSelectFieldStyle.formField}>
			<label>{label}</label>
			{required && (
				<span style={{ paddingLeft: '5px' }}>
					<b>*</b>
				</span>
			)}
			<Select
				defaultValue={defaultValue}
				onChange={onSelectCallback}
				options={options}
			/>
			{required
				? errorMemo && (
						<div className={HRSelectFieldStyle.error}>* {errorMsg}</div>
				  )
				: false}
		</div>
	);
};

export default HRSelectField;
