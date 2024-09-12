import { useCallback, useState } from 'react';
import CloneHRStyle from './cloneHR.module.css';
import { ReactComponent as CloneHRSVG } from 'assets/svg/cloneHR.svg';
import { Modal } from 'antd';
import CloneHRModal from 'modules/hiring request/screens/allHiringRequest/cloneHRModal';
import { HTTPStatusCode } from 'constants/network';
import { useNavigate, useParams } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { MasterDAO } from 'core/master/masterDAO';

const CloneHR = ({ updatedSplitter, cloneHR ,hybridInfo}) => {
	const [isCloneHR, setCloneHR] = useState(false);
	const cloneHRModalInfo = () => {
		setCloneHR(!isCloneHR);
	};

	const hrId = useParams();
	const navigate = useNavigate();
	const navigateToCloneHR = useCallback(async (isHybrid, payload,resetFields) => {
		let data = {
			hrid: hrId?.hrid,
		};
		if(isHybrid){
			data = {...data,...payload}	  
		  }

		const response = await MasterDAO.getCloneHRDAO(data);
		if (response?.statusCode === HTTPStatusCode.OK) {
			localStorage.setItem('hrID', response?.responseBody?.details);
			localStorage.removeItem('dealID')
			setCloneHR(false);
			resetFields && resetFields()
			navigate(UTSRoutes.ADDNEWHR, { state: { isCloned: true } });
		}
	}, [hrId.hrid, navigate]);

	return (<>
	<div
			className={
				cloneHR?.IsEnabled
					? CloneHRStyle.transparentBtnGroup
					: CloneHRStyle.disabledTransparentBtnGroup
			}
			onClick={cloneHR?.IsEnabled ? cloneHRModalInfo : null}>
			<CloneHRSVG style={{ fontSize: '16px' }} />{' '}
			<span className={CloneHRStyle.btnLabel}>Clone HR</span>
			
		</div>
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
						isHRHybrid={hybridInfo?.isHybrid}
						companyID={hybridInfo?.companyID}
					/>
				</Modal>
			)}
	</>
		
	);
};

export default CloneHR;
