import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import React, { useCallback, useEffect, useState } from 'react';
import { set, useForm } from 'react-hook-form';
import changeDateStyle from './changeDate.module.css';
import { ReactComponent as MinusSVG } from 'assets/svg/minus.svg';
import { ReactComponent as PlusSVG } from 'assets/svg/plus.svg';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useParams } from 'react-router-dom';
import { HTTPStatusCode } from 'constants/network';
import SpinLoader from 'shared/components/spinLoader/spinLoader';

const ChangeDate = ({
	updateTR,
	setUpdateTR,
	onCancel,
	apiData,
	allApiData
}) => {
	const [count, setCount] = useState(0);
	const [disable, setDisable] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm();


	const [valueInfo, setValueInfo] = useState('');

	const onSubmit = async () => {
		setIsLoading(true);
		
		setIsLoading(false);
	};


	useEffect(() => {
		return () => setIsLoading(false);
	}, []);
	return (
		<div className={changeDateStyle.engagementModalContainer}>
			<div className={changeDateStyle.updateTRTitle}>
				<h2>Edit SLA - Share Shortlisted Profiles</h2>
				<p>
					{ allApiData?.ClientDetail?.HR_Number} | Senior Front End Developer
				</p>
			</div>

			<h4 className={changeDateStyle.infoMsg}>{valueInfo}</h4>
			<p>The default setting for this stage is to initiate after 5 working days from publishing the job post.</p>

			{isLoading ? (
				<SpinLoader />
			) : (
				<>
					<div className={changeDateStyle.row}>
									<div className={changeDateStyle.colMd12}>
										<HRInputField
											isTextArea={true}
											label={'Reason Requires'}
											register={register}
											errors={errors}
											name="otherReason"
											type={InputType.TEXT}
											placeholder="In case of other reason please mention it here"
											validationSchema={{
												validate: (value) => {
													if (!value) {
														return 'Please enter reson.';
													}
												},
											}}
											rows={'4'}
											required
											// required={
											//      allApiData?.ClientDetail?.ActiveTR <= count
											//         ? true
											//         : false
											// }
											// required
										/>
									</div>
								</div>

					<div className={changeDateStyle.formPanelAction}>
						<button
							onClick={() => {
								onCancel();

							}}
							className={changeDateStyle.btn}>
							Cancel
						</button>

						<button
									type="submit"
									className={changeDateStyle.btnPrimary}
									onClick={handleSubmit(onSubmit)}>
									Save
								</button>
					</div>
				</>
			)}
		</div>
	);
};

export default ChangeDate;
