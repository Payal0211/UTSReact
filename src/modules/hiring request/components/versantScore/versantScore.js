import { Divider } from 'antd';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import VersantScoreStyle from './versantScoreStyle.module.css';

export const ShowVersantScore = ({ handleClose }) => {
	const versantScore = [
		{
			id: 'versantScore1',
			versantType: 'Speaking',
			score: '50',
			scoreColor: '#0278E4',
		},
		{
			id: 'versantScore2',
			versantType: 'Listening',
			score: '68',
			scoreColor: '#006D2C',
		},
		{
			id: 'versantScore3',
			versantType: 'Reading',
			score: '59',
			scoreColor: '#00DFDF',
		},
		{
			id: 'versantScore4',
			versantType: 'Writing',
			score: '64',
			scoreColor: '#3ED079',
		},
	];
	return (
		<div
			style={{
				width: '1100px',
				margin: 'auto',
				background: 'white',
				borderRadius: '8px',
			}}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
				}}>
				<div
					style={{
						width: '93%',
						margin: 'auto',
						display: 'flex',
						justifyContent: 'flex-start',
						alignItems: 'center',
						gap: '24px',
						padding: '24px',
					}}>
					<div
						style={{
							border: '1px solid #CECCCC',
							borderRadius: '8px',
							padding: '12px 24px',
						}}>
						<span
							style={{
								color: '#676767',
								fontSize: '16px',
								lineHeight: '20px',
							}}>
							Name:
						</span>
						&nbsp;&nbsp;
						<span
							style={{
								color: `var(--uplers-black)`,
								fontSize: '16px',
								lineHeight: '20px',
								textDecoration: 'underline',
							}}>
							Velma Balaji Reddy
						</span>
					</div>
					<div
						style={{
							border: '1px solid #CECCCC',
							borderRadius: '8px',
							padding: '12px 24px',
						}}>
						<span
							style={{
								color: '#676767',
								fontSize: '16px',
								lineHeight: '20px',
							}}>
							Total Attempts:
						</span>
						&nbsp;&nbsp;
						<span
							style={{
								color: `var(--uplers-black)`,
								fontSize: '16px',
								lineHeight: '20px',
							}}>
							04
						</span>
					</div>
				</div>
				<CloseSVG
					onClick={handleClose}
					style={{ marginTop: '16px', marginRight: '16px' }}
				/>
			</div>
			<hr style={{ border: `1px solid var(--uplers-grey)`, margin: 0 }} />
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
					gap: '18px',
					width: '93%',
					margin: 'auto',
					padding: '16px 0 24px',
				}}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-start',
						alignItems: 'center',
						padding: '7px 24px',
						border: '1px solid #CECCCC',
						borderRadius: '8px',
						fontSize: '14px',
						lineHeight: '18px',
						// gap: '8px',
						color: `var(--uplers-black)`,
						fontWeight: 500,
					}}>
					<div
						style={{
							backgroundColor: `var(--color-sunlight)`,
							borderRadius: '50%',
							height: '34px',
							width: '34px',
							fontSize: '14px',
							lineHeight: '18px',
							marginRight: '8px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						{68}
					</div>
					Overall GSE Score | CEFR: B2
				</div>
				{versantScore?.map((item) => {
					return (
						<div
							key={item.id}
							style={{
								display: 'flex',
								justifyContent: 'flex-start',
								alignItems: 'center',
								padding: '7px 24px',
								border: '1px solid #CECCCC',
								borderRadius: '8px',
								fontSize: '14px',
								lineHeight: '18px',
								// gap: '18px',
								color: `var(--uplers-black)`,
								fontWeight: 500,
							}}>
							<div
								style={{
									border: `1px solid ${item?.scoreColor}`,
									borderRadius: '50%',
									height: '34px',
									lineHeight: '18px',
									marginRight: '8px',
									width: '34px',
									display: 'flex',
									fontSize: '14px',
									alignItems: 'center',
									justifyContent: 'center',
								}}>
								{item?.score}
							</div>
							{item?.versantType}
						</div>
					);
				})}
			</div>
		</div>
	);
};
