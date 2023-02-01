import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import './talentCost.css';
import { useCallback, useState, useEffect } from 'react';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';

export const ShowTalentCost = ({ talentCost, handleClose }) => {
	const [talentList, setTalentList] = useState([]);
	const getTalentCost = useCallback(async () => {
		const response = await hiringRequestDAO.getTalentCostConversionDAO(
			talentCost?.split(' ')[1],
		);
		setTalentList(response && response?.responseBody?.details);
	}, [talentCost]);

	useEffect(() => {
		getTalentCost();
	}, [getTalentCost]);
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
				{talentList?.map((item) => {
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
			<CloseSVG
				style={{ marginTop: '16px', marginRight: '16px' }}
				onClick={handleClose}
			/>
		</div>
	);
};
