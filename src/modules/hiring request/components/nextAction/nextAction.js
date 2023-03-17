import NextActionStyle from './nextAction.module.css';
import { ReactComponent as ClockSVG } from 'assets/svg/clock.svg';

const NextAction = ({ nextAction }) => {
	console.log('---nextAction----', nextAction);
	return (
		<div className={NextActionStyle.hrNextActionForTalent}>
			<div className={NextActionStyle.nextActionList}>
				{nextAction &&
					nextAction?.map((item, index) => {
						return (
							<div
								className={NextActionStyle.actionItem}
								key={index}>
								<ClockSVG style={{ width: '20px' }} />
								<label>{item.NextActionText}</label>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default NextAction;
