import CloneHRModalStyle from '../allHiringRequest/cloneHRModal.module.css';
import {useState} from 'react'

const CloneHRModal = ({
	cloneHRhandler,
	onCancel,
	getHRnumber,
	navigateToCloneHR,
}) => {
	const [disableOK , setDisableOK] = useState(false)

	return (
		<div className={CloneHRModalStyle.cloneHRConfContent}>
			<h2>Are you sure want to clone {getHRnumber}</h2>

			<div className={CloneHRModalStyle.formPanelAction}>
				{cloneHRhandler ? (
					<button
						disabled={disableOK}
						className={CloneHRModalStyle.btnPrimary}
						onClick={() => {cloneHRhandler();setDisableOK(true)}}>
						Ok
					</button>
				) : (
					<button
						disabled={disableOK}
						className={CloneHRModalStyle.btnPrimary}
						onClick={() => {navigateToCloneHR();setDisableOK(true)}}>
						Ok
					</button>
				)}
				<button
					className={CloneHRModalStyle.btn}
					onClick={() => onCancel()}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default CloneHRModal;
