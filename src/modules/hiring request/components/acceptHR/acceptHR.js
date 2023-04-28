import { Divider } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import AcceptHRStyle from './acceptHR.module.css';
import { useCallback, useState } from 'react';
import HRInputField from '../hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';
import { InputType } from 'constants/application';
const AcceptHR = ({ hrID, openModal, cancelModal }) => {
	const [showMoreInfo, setMoreInfo] = useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		getValues,
		watch,
		formState: { errors },
	} = useForm({});
	const toggleHandler = useCallback(() => {
		setMoreInfo(true);
	}, []);

	return (
		<Modal
			width="864px"
			centered
			footer={false}
			open={openModal}
			onCancel={cancelModal}>
			<div className={AcceptHRStyle.container}>
				<div className={AcceptHRStyle.modalTitle}>
					<h2>Accept HR</h2>
					<span className={AcceptHRStyle.paragraph}>{hrID}</span>
				</div>
				<Divider style={{ borderTop: '1px solid #E8E8E8' }} />
				<div className={AcceptHRStyle.transparent}>
					<p className={AcceptHRStyle.paragraph}>
						If you have complete clarity for this HR, then kindly accept the HR.
						If you need more clarity on this HR, then change the Status to
						“Waiting for more information”.
					</p>
					{showMoreInfo && (
						<div className={AcceptHRStyle.colMd12}>
							<HRInputField
								required
								isTextArea={true}
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the details.',
								}}
								label="Add Details which are missing to have more clarity "
								name={'acceptHRDetails'}
								type={InputType.TEXT}
								placeholder="Add Details which are missing or needs more clarity"
							/>
						</div>
					)}

					<div className={AcceptHRStyle.formPanelAction}>
						<button
							// disabled={type === SubmitType.SAVE_AS_DRAFT}
							// onClick={cancelModal}
							className={AcceptHRStyle.btn}>
							Accept HR
						</button>
						{
							<button
								// disabled={isLoading}
								type="submit"
								onClick={toggleHandler}
								className={AcceptHRStyle.btnPrimary}>
								Wait for more Information
							</button>
						}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default AcceptHR;
