import CloneHRModalStyle from '../allHiringRequest/cloneHRModal.module.css';

const CloneHRModal = ({
	cloneHRhandler,
	onCancel,
	getHRnumber,
	navigateToCloneHR,
}) => {
	return (
		<div className={CloneHRModalStyle.cloneHRConfContent}>
			<h2>Are you sure want to clone HR {getHRnumber}</h2>

			<div className={CloneHRModalStyle.formPanelAction}>
				{cloneHRhandler ? (
					<button
						className={CloneHRModalStyle.btnPrimary}
						onClick={() => cloneHRhandler()}>
						Ok
					</button>
				) : (
					<button
						className={CloneHRModalStyle.btnPrimary}
						onClick={() => navigateToCloneHR()}>
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
