import { useCallback, useState } from 'react';
import CloneHRStyle from './cloneHR.module.css';
import { ReactComponent as CloneHRSVG } from 'assets/svg/cloneHR.svg';
import { Modal } from 'antd';
import CloneHRModal from 'modules/hiring request/screens/allHiringRequest/cloneHRModal';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';
import { useNavigate, useParams } from 'react-router-dom';
import UTSRoutes from 'constants/routes';

const CloneHR = ({ updatedSplitter, cloneHR }) => {
	const [isCloneHR, setCloneHR] = useState(false);
	const cloneHRModalInfo = () => {
		setCloneHR(!isCloneHR);
	};

	const hrId = useParams();
	const navigate = useNavigate();
	const navigateToCloneHR = useCallback(async () => {
		const response = await hiringRequestDAO.getHRDetailsRequestDAO(hrId.hrid);
		if (response?.statusCode === HTTPStatusCode.OK) {
			localStorage.setItem('hrID', hrId.hrid);
			setCloneHR(false);
			navigate(UTSRoutes.ADDNEWHR);
		}
	}, [hrId.hrid, navigate]);

	return (
		<div
			className={
				cloneHR?.IsEnabled
					? CloneHRStyle.transparentBtnGroup
					: CloneHRStyle.disabledTransparentBtnGroup
			}
			onClick={cloneHR?.IsEnabled ? cloneHRModalInfo : null}>
			<CloneHRSVG style={{ fontSize: '16px' }} />{' '}
			<span className={CloneHRStyle.btnLabel}>Clone HR</span>
			{isCloneHR && (
				<Modal
					width={'700px'}
					centered
					footer={false}
					open={isCloneHR}
					className="cloneHRConfWrap"
					onCancel={cloneHRModalInfo}>
					<CloneHRModal
						getHRnumber={updatedSplitter}
						onCancel={cloneHRModalInfo}
						navigateToCloneHR={navigateToCloneHR}
					/>
				</Modal>
			)}
		</div>
	);
};

export default CloneHR;
