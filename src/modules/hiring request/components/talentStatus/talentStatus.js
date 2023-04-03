import TalentStatusStyle from './talentStatus.module.css';
import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';

import HRSelectField from '../hrSelectField/hrSelectField';

const TalentStatus = ({ callAPI, closeModal }) => {
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
	const [talentStatus, setTalentStatus] = useState([]);
	const getTalentStatusHandler = useCallback(async () => {
		setTalentStatus([]);
	}, []);

	useEffect(() => {
		getTalentStatusHandler();
	}, [getTalentStatusHandler]);

	return (
		<div className={TalentStatusStyle.container}>
			<div className={TalentStatusStyle.modalTitle}>
				<h2>Change Talent Status</h2>
			</div>

			<div className={TalentStatusStyle.transparent}>
				<div className={TalentStatusStyle.colMd12}>
					<HRSelectField
						setValue={setValue}
						register={register}
						name="talentStatus"
						label="Select Talent Status"
						defaultValue="Please Select"
						options={talentStatus}
						required
						isError={errors['talentStatus'] && errors['talentStatus']}
						errorMsg="Please select talent Status."
					/>
				</div>
				<div className={TalentStatusStyle.formPanelAction}>
					<button
						type="submit"
						// onClick={cancelModal}

						className={TalentStatusStyle.btnPrimary}>
						Save
					</button>
					<button
						onClick={closeModal}
						className={TalentStatusStyle.btn}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default TalentStatus;
