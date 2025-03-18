import NextActionStyle from './nextAction.module.css';
import { useState } from 'react'
import { ReactComponent as ClockSVG } from 'assets/svg/clock.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDownLight.svg';

const NextAction = ({ nextAction }) => {
	const [show,setShow] = useState(false)
	return (
		<div className={NextActionStyle.hrNextActionForTalent}>
			<div onClick={()=>setShow(prev=>!prev)} className={NextActionStyle.header}>Next Actions   <ArrowDownSVG style={{ rotate: show ? '180deg' : '' }}  /></div>
			{show && <div className={NextActionStyle.nextActionList}>
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
			</div>}
		</div>
	);
};

export default NextAction;
