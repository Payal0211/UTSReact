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
			{cloneHRhandler ? (
				<button onClick={() => cloneHRhandler()}>Ok</button>
			) : (
				<button onClick={() => navigateToCloneHR()}>Ok</button>
			)}
			<button
				onClick={() => onCancel()}
				className={CloneHRModalStyle.btnPrimary}>
				Cancel
			</button>
		</div>
	);
};

export default CloneHRModal;
