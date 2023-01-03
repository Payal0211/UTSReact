import { Divider } from 'antd';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';

export const ShowProfileLog = () => {
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
		</div>
	);
};
