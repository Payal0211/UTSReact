import { useState } from 'react';
const useIconToggle = () => {
	const [toggleIcon, setToggleIcon] = useState(true);
	const onToggleIcon = () => setToggleIcon(!toggleIcon);
	return [toggleIcon, onToggleIcon];
};
export default useIconToggle;
