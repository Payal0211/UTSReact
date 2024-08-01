import { Select, message } from 'antd';
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
	unregister,
	errorMsg,
	isControlled,
	disabled,
	placeholder,
	isControlledBoolean,
	isValue,
	extraAction,
	setOptions,
	onValueChange,
	isMustHaveSkillRes
}) => {
	const getChangeHandlerWithValue = (value, option) => {
		onValueChange && onValueChange(value, option)
		if (mode === 'multiple') {
			setValue(
				name,
				option.map((item) => ({
					id: item?.id || item?.text,
					value: item?.value,
				})),
			);

			isControlled && setControlledValue(option);
		} else if (mode === 'id/value') {			
			setValue(name, {
				id: option.id || option.text,
				value: option.value,
			});
			isControlled && setControlledValue(option.value);
			extraAction && extraAction()
		} else if (mode === 'value') {
			setValue(name, option.value);
			isControlled && setControlledValue(option.value);
		} else if (mode === 'id') {
			setValue(name, option.id);
			isControlled && setControlledValue(option.value);
		} else if(mode === 'tags'){	
			// to ristrict must have skill to select more then 5
			if(isMustHaveSkillRes === true){
				if(option.length > 8){
					message.error('More then 8 skills not allowed')
					return
				}
				
			}
			if(option.length){
				if(Object.keys(option[value.length-1]).length>0){
				setValue(name,option.map((item) => ({
					id: item?.id || item?.text || "0",
					value: item?.value,
				})),);	
				setOptions(options);	
				}else{
					if(value[value.length - 1]){					
						option[value.length - 1] = { ...option[value.length - 1], id: '0' };
						option[value.length - 1] = { ...option[value.length - 1], value: value[value.length - 1] };
						let _opt = [...options];
						let obj = {};
						obj.id = "0";
						obj.value = value[value.length - 1];
						_opt.push(obj);
						setOptions(_opt);
						setValue(name,option.map((item) => ({
							id: item.id,
							value: item?.value,
						})),);
					}
				}
			}else{
				setOptions(options);
				setValue(name,option);
			}				
					
			isControlled && setControlledValue(option);			
		}
		else {
			setValue(name, option.id || option?.text);
		}
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

			{isControlledBoolean ? <Select
					id="selectedValue"
					placeholder={placeholder}
					mode={mode}
					className={disabled && HRSelectFieldStyle.disabled}
					disabled={disabled}
					value={controlledValue}
					showSearch={searchable}
					onChange={(value, option) => getChangeHandlerWithValue(value, option)}
					options={options}
				/> : isControlled ? (
				<Select
					id="selectedValue"
					placeholder={placeholder}
					mode={mode}
					className={disabled && HRSelectFieldStyle.disabled}
					disabled={disabled}
					value={controlledValue || defaultValue}
					showSearch={searchable}
					dropdownRender={dropdownRender}
					onChange={(value, option) => getChangeHandlerWithValue(value, option)}
					options={options}
					getPopupContainer={(trigger) => trigger.parentElement}
				/>
			) : isValue ? 
			<Select
				getPopupContainer={(trigger) => trigger.parentElement}
				id="selectedValue"
				placeholder={placeholder}
				mode={mode}
				dropdownRender={dropdownRender}
				disabled={disabled}
				showSearch={searchable}
				defaultValue={defaultValue}
				onChange={(value, option) => getChangeHandlerWithValue(value, option)}
				options={options}
				value={defaultValue}
			/>:  (
				<Select
					getPopupContainer={(trigger) => trigger.parentElement}
					id="selectedValue"
					className={HRSelectFieldStyle.searchSelectCustom}
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
