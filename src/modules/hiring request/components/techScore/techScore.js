import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import TechScoreStyle from './techScoreStyle.module.css';
export const ShowTechScore = ({ handleClose }) => {
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
						width: '90%',
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
			<hr style={{ border: `1px solid var(--uplers-grey)` }} />

			<div>
				<table className={TechScoreStyle.expandedTable}>
					<thead>
						<tr>
							<th className={TechScoreStyle.th}>Skill Test</th>
							<th className={TechScoreStyle.th}></th>
							<th className={TechScoreStyle.th}>Score</th>
							<th className={TechScoreStyle.th}>Attempts</th>
							<th className={TechScoreStyle.th}>Report</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className={TechScoreStyle.td}>CS Codility</td>
							<td className={TechScoreStyle.td}>Pass</td>
							<td className={TechScoreStyle.td}>60/100</td>
							<td className={TechScoreStyle.td}>2</td>
							<td className={TechScoreStyle.td}>Download</td>
						</tr>
						<tr>
							<td className={TechScoreStyle.td}>Front End Developer</td>
							<td className={TechScoreStyle.td}>Pass</td>
							<td className={TechScoreStyle.td}>60/100</td>
							<td className={TechScoreStyle.td}>2</td>
							<td className={TechScoreStyle.td}>Download</td>
						</tr>
						<tr>
							<td className={TechScoreStyle.td}>Javascript Codility</td>
							<td className={TechScoreStyle.td}>Pass</td>
							<td className={TechScoreStyle.td}>60/100</td>
							<td className={TechScoreStyle.td}>2</td>
							<td className={TechScoreStyle.td}>Download</td>
						</tr>
						<tr>
							<td className={TechScoreStyle.td}>Search Engine Optimization</td>
							<td className={TechScoreStyle.td}>Pass</td>
							<td className={TechScoreStyle.td}>60/100</td>
							<td className={TechScoreStyle.td}>2</td>
							<td className={TechScoreStyle.td}>Download</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td
								className={`${TechScoreStyle.td} ${TechScoreStyle.tfooterTD}`}>
								Total Score
							</td>
							<td
								className={`${TechScoreStyle.td} ${TechScoreStyle.tfooterTD}`}>
								63.5%
							</td>
							<td
								className={`${TechScoreStyle.td} ${TechScoreStyle.tfooterTD}`}>
								254/400
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	);
};
