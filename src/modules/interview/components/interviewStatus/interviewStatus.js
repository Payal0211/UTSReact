import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import InterviewStatusStyle from './interviewStatus.module.css';
import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';

const InterviewStatus = ({ callAPI, closeModal }) => {
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
	const getInterviewStatusHandler = useCallback(async () => {
		setInterviewStatus([]);
	}, []);

	useEffect(() => {
		getInterviewStatusHandler();
	}, [getInterviewStatusHandler]);

	return (
		<div className={InterviewStatusStyle.container}>
			<div className={InterviewStatusStyle.modalTitle}>
				<h2>Change Interview Status</h2>
			</div>

			<div className={InterviewStatusStyle.transparent}>
				<div className={InterviewStatusStyle.colMd12}>
					<HRSelectField
						setValue={setValue}
						register={register}
						name="InterviewStatus"
						label="Select Interview Status"
						defaultValue="Please Select"
						options={interviewStatus}
						required
						isError={errors['InterviewStatus'] && errors['InterviewStatus']}
						errorMsg="Please select interview Status."
					/>
				</div>
				<div className={InterviewStatusStyle.formPanelAction}>
					<button
						type="submit"
						// onClick={cancelModal}

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
		</div>
	);
};

export default InterviewStatus;
