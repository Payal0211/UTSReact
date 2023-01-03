import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
export const ShowTalentCost = () => {
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
				width: '90%',
				margin: 'auto',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
			}}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-start',
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
			<CloseSVG />
		</div>
	);
};
