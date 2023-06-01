import { useState } from 'react';
import HROperator from '../hroperator/hroperator';
import { AiOutlineDown } from 'react-icons/ai';
import { HRCTA } from 'constants/application';
import { useNavigate, useParams } from 'react-router-dom';

const CTASlot2 = ({ miscData, slotItem, apiData, callAPI, hrID }) => {
const params = useParams()

const navigate = useNavigate()
	const scrollToBottom = () => {
		window.scroll({
			top: document.body.scrollHeight,
			left: 0,
			bottom: 0,
			behavior: 'smooth',
		});
	};
const editHR = () =>{
	navigate("/allhiringrequest/addnewhr")
	localStorage.setItem("hrID",params?.hrid)
}
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
							case HRCTA.EDIT_HR: {
								editHR();
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
