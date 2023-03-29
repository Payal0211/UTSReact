import { Dropdown, Menu } from 'antd';
import hroperatorStyle from './hroperator.module.css';

const HROperator = ({
	onClickHandler,
	title,
	icon,
	backgroundColor,
	labelBorder,
	iconBorder,
	isDropdown,
	listItem,
	menuAction,
}) => {
	return isDropdown ? (
		<Dropdown
			className={hroperatorStyle.dropdownMenu}
			trigger={['click']}
			onOpenChange={onClickHandler}
			overlay={
				<Menu
					selectable={true}
					defaultSelectedKeys={'0'}>
					{listItem?.map((item) => (
						<Menu.Item
							key={item.label}
							onClick={menuAction}>
							{item.label}
						</Menu.Item>
					))}
				</Menu>
			}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
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
		</Dropdown>
	) : (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-end',
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
