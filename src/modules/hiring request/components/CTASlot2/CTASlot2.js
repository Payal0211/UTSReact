import { useState } from 'react';
import HROperator from '../hroperator/hroperator';
import { AiOutlineDown } from 'react-icons/ai';
import { HRCTA } from 'constants/application';

const CTASlot2 = ({ miscData, slotItem, apiData, callAPI, hrID }) => {
	const [isNotes, setIsNotes] = useState(false);

	const scrollToBottom = () => {
		window.scroll({
			top: document.body.scrollHeight,
			left: 0,
			bottom: 0,
			behavior: 'smooth',
		});
	};
	return (
		<>
			<div>
				<HROperator
					title={slotItem?.[0]?.label}
					icon={<AiOutlineDown />}
					backgroundColor={`var(--color-sunlight)`}
					iconBorder={`1px solid var(--color-sunlight)`}
					isDropdown={true}
					listItem={slotItem}
					menuAction={(menuItem) => {
						switch (menuItem.key) {
							case HRCTA.ADD_NOTES: {
								scrollToBottom();
								break;
							}
							default:
								break;
						}
					}}
				/>
			</div>
		</>
	);
};

export default CTASlot2;
