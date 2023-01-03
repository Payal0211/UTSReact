import { Divider } from 'antd';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
export const ShowVersantScore = () => {
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
		<div>
			<div
				style={{
					display: 'flex',
					width: '95%',
					margin: 'auto',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
				}}>
				<div
					style={{
						display: 'flex',

						justifyContent: 'flex-start',
						alignItems: 'center',
						gap: '24px',
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
				<CloseSVG />
			</div>
			<Divider />
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
					gap: '24px',
					width: '95%',
					margin: 'auto',
				}}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-start',
						alignItems: 'center',
						padding: '16px 34px',
						border: '1px solid #CECCCC',
						borderRadius: '8px',
						fontSize: '14px',
						lineHeight: '17px',
						gap: '8px',
						color: `var(--uplers-black)`,
						fontWeight: 500,
					}}>
					<div
						style={{
							backgroundColor: `var(--color-sunlight)`,
							borderRadius: '50%',
							height: '34px',
							width: '34px',
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
								padding: '16px 34px',
								border: '1px solid #CECCCC',
								borderRadius: '8px',
								fontSize: '14px',
								lineHeight: '17px',
								gap: '8px',
								color: `var(--uplers-black)`,
								fontWeight: 500,
							}}>
							<div
								style={{
									border: `1px solid ${item?.scoreColor}`,
									borderRadius: '50%',
									height: '34px',
									width: '34px',
									display: 'flex',
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
