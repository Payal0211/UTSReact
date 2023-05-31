import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import InterviewStatusStyle from './interviewStatus.module.css';
import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import { InterviewDAO } from 'core/interview/interviewDAO';
import { HTTPStatusCode } from 'constants/network';
import SpinLoader from 'shared/components/spinLoader/spinLoader';

const InterviewStatus = ({ hrId, talentInfo, callAPI, closeModal }) => {
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
	const [interviewStatus, setInterviewStatus] = useState([]);
	const [messageAPI, contextHolder] = message.useMessage();
	const [isLoading, setIsLoading] = useState(false);
	const getInterviewStatusHandler = useCallback(async () => {
		const response = await InterviewDAO.getInterviewStatusRequestDAO({
			interviewStatusID: talentInfo?.SelectedInterviewId,
		});
		setInterviewStatus(
			response && response?.responseBody?.details?.Data?.HiringStatus,
		);
	}, [talentInfo?.SelectedInterviewId]);

	const updateInterviewStatusHandler = useCallback(
		async (d) => {
			setIsLoading(true);
			const response = await InterviewDAO.updateInterviewStatusDAO({
				hrID: hrId,
				interviewStatusID: d.interviewStatus,
				interviewMasterID: talentInfo?.MasterId,
				talentSelectedInterviewDetailsID: talentInfo?.SelectedInterviewId,
			});
			if (response.statusCode === HTTPStatusCode.OK) {
				setIsLoading(false);
				messageAPI.open(
					{
						type: 'success',
						content: 'Slot has been confirmed.',
					},
					1000,
				);
				setTimeout(() => {
					callAPI(hrId);
					closeModal();
				}, 1000);
			} else {
				setIsLoading(false);
				messageAPI.open(
					{
						type: 'ierror',
						content: 'Something Went Wrong',
					},
					1000,
				);
			}
		},
		[
			callAPI,
			closeModal,
			hrId,
			messageAPI,
			talentInfo?.MasterId,
			talentInfo?.SelectedInterviewId,
		],
	);
	useEffect(() => {
		getInterviewStatusHandler();
	}, [getInterviewStatusHandler]);

	return (
		<div className={InterviewStatusStyle.container}>
			{contextHolder}
			<div className={InterviewStatusStyle.modalTitle}>
				<h2>Change Interview Status</h2>
			</div>

			{isLoading ? (
				<SpinLoader />
			) : (
				<div className={InterviewStatusStyle.transparent}>
					<div className={InterviewStatusStyle.colMd12}>
						<HRSelectField
							setValue={setValue}
							register={register}
							name="interviewStatus"
							label="Select Interview Status"
							defaultValue="Please Select"
							options={interviewStatus}
							required
							isError={errors['interviewStatus'] && errors['interviewStatus']}
							errorMsg="Please select interview Status."
						/>
					</div>
					<div className={InterviewStatusStyle.formPanelAction}>
						<button
							type="submit"
							onClick={handleSubmit(updateInterviewStatusHandler)}
							className={InterviewStatusStyle.btnPrimary}>
							Save
						</button>
						<button
							onClick={closeModal}
							className={InterviewStatusStyle.btn}>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default InterviewStatus;
