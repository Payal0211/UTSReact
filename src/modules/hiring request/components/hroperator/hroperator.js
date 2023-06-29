import { Dropdown, Menu, Tooltip } from 'antd';
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

	const controlledLabelMenuAction = (val) =>{
		let clicked = listItem.filter(item => item.label === val)[0]
		clicked.IsEnabled && menuAction({key: val})
	}

	return isDropdown ? (
		<Dropdown
			className={hroperatorStyle.dropdownMenu}
			trigger={['click']}
			onOpenChange={onClickHandler}
			overlay={
				<Menu
					selectable={true}
					defaultSelectedKeys={'0'}>
					{listItem?.map((item) =>
						item?.IsEnabled ? (
							<Menu.Item
								style={{ cursor: item?.IsEnabled ? 'pointer' : 'no-drop' }}
								disabled={!item?.IsEnabled}
								key={item.label}
								onClick={menuAction}>
								{item.label}
							</Menu.Item>
						) : (
							<Tooltip
								placement="bottom"
								title="Unauthorized">
								<Menu.Item
									style={{ cursor: item?.IsEnabled ? 'pointer' : 'no-drop' }}
									disabled={!item?.IsEnabled}
									key={item.label}
									onClick={menuAction}>
									{item.label}
								</Menu.Item>
							</Tooltip>
						),
					)}
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
					<label onClick={()=> controlledLabelMenuAction(title)}>{title}</label>
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
			onClick={onClickHandler}
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
