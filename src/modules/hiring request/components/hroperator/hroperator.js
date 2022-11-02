import { Fragment, useState } from 'react';
import hroperatorStyle from './hroperator.module.css';

const HROperator = ({
	title,
	icon,
	backgroundColor,
	labelBorder,
	iconBorder,
	isDropdown,
	dropdownClick,
	dropdownList,
}) => {
	return (
		<div
			style={{
				/* border: '1px solid red',
				marginTop: '100px', */
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flexend',
				alignItems: 'center',
			}}>
			<div
				className={hroperatorStyle.newHR}
				style={{ backgroundColor: backgroundColor, border: labelBorder }}>
				<label>{title}</label>
				<div
					className={hroperatorStyle.iconDown}
					style={{ borderLeft: iconBorder }}>
					{icon}
				</div>
			</div>
		</div>
	);
};

export default HROperator;
