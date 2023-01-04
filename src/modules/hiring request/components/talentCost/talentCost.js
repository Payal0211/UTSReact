import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import './talentCost.css';

export const ShowTalentCost = ({
	isTalentCostActive,
	setIsTalentCostActive,
}) => {
	const talentCost = [
		{
			id: 'talentCost1',
			cost: '2,48,450',
			currency: 'INR',
			currencyIcon: '(₹)',
		},
		{
			id: 'talentCost2',
			cost: '2,48,450',
			currency: 'AUD',
			currencyIcon: '($)',
		},
		{
			id: 'talentCost3',
			cost: '2,48,450',
			currency: 'EUR',
			currencyIcon: '(€)',
		},
		{
			id: 'talentCost4',
			cost: '2,48,450',
			currency: 'GBP',
			currencyIcon: '(£)',
		},
	];
	return (
		<div
			style={{
				display: 'flex',
				width: '1100px',
				margin: 'auto',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
				background: 'white',
				borderRadius: '8px',
			}}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-start',
					padding: '24px',
					gap: '24px',
					alignItems: 'center',
				}}>
				{talentCost?.map((item) => {
					return (
						<div
							key={item.id}
							style={{
								border: '1px solid #CECCCC',
								padding: '16px 24px',
								borderRadius: '8px',
								lineHeight: '17px',
								color: `var(--uplers-black)`,
								fontSize: '14px',
							}}>
							{item?.currencyIcon} <b>{item?.cost}</b> {item?.currency}/Month
						</div>
					);
				})}
			</div>
			<CloseSVG style={{ marginTop: '16px', marginRight: '16px' }} />
		</div>
	);
};
