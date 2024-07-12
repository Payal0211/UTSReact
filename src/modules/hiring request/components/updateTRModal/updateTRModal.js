import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import React, { useCallback, useEffect, useState } from 'react';
import { set, useForm } from 'react-hook-form';
import updateTRStyle from './updateTR.module.css';
import { ReactComponent as MinusSVG } from 'assets/svg/minus.svg';
import { ReactComponent as PlusSVG } from 'assets/svg/plus.svg';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useParams } from 'react-router-dom';
import { HTTPStatusCode } from 'constants/network';
import SpinLoader from 'shared/components/spinLoader/spinLoader';

const UpdateTR = ({
	updateTR,
	setUpdateTR,
	onCancel,
	updateTRDetail,
	apiData,
	loader
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

	const currentTR = watch('currentTR');

	const additionalComments = watch('additionalComments');

	const reasonForLoss = watch('reasonForLoss');

	const id = useParams();

	const [valueInfo, setValueInfo] = useState('');
	const tempData = localStorage.setItem('isSubmitted', true);
	const isGetSubmitted = localStorage.getItem('isSubmitted');
	const onSubmit = async () => {
		setIsLoading(true);
		if (updateTRDetail?.ClientDetail?.Availability === 'Part Time') {
			if (updateTRDetail?.ClientDetail?.ActiveTR * 2 <= count) {
				let data = {
					noOfTR: count,
					hiringRequestId: Number(id?.hrid),
					addtionalRemarks: additionalComments,
					reasonForLossCancelled: '',
					isFinalSubmit: true,
				};
				const response = await hiringRequestDAO.editTRDAO(data);
				if (response.responseBody.statusCode === HTTPStatusCode.OK) {
					setValueInfo(response?.responseBody?.details);
					onCancel();
					window.location.reload();
				}
			} else if (updateTRDetail?.ClientDetail?.ActiveTR * 2 > count) {
				let data = {
					noOfTR: count,
					hiringRequestId: Number(id?.hrid),
					addtionalRemarks: additionalComments,
					reasonForLossCancelled: reasonForLoss,
					isFinalSubmit: valueInfo ? Boolean(isGetSubmitted) : false,
				};
				const response = await hiringRequestDAO.editTRDAO(data);
				if (response.responseBody.statusCode === HTTPStatusCode.OK) {
					setValueInfo(response?.responseBody?.details);
					if (valueInfo && Boolean(isGetSubmitted)) {
						onCancel();
						window.location.reload();
					}
				}
			}
		} else {
			if (updateTRDetail?.ClientDetail?.ActiveTR <= count) {
				let data = {
					noOfTR: count,
					hiringRequestId: Number(id?.hrid),
					addtionalRemarks: additionalComments,
					reasonForLossCancelled: '',
					isFinalSubmit: true,
				};
				const response = await hiringRequestDAO.editTRDAO(data);

				if (response.responseBody.statusCode === HTTPStatusCode.OK) {
					setValueInfo(response?.responseBody?.details);
					onCancel();
					window.location.reload();
				}
			} else if (updateTRDetail?.ClientDetail?.ActiveTR > count) {
				let data = {
					noOfTR: count,
					hiringRequestId: Number(id?.hrid),
					addtionalRemarks: additionalComments,
					reasonForLossCancelled: reasonForLoss,
					isFinalSubmit: valueInfo ? Boolean(isGetSubmitted) : false,
				};
				const response = await hiringRequestDAO.editTRDAO(data);
				if (response.responseBody.statusCode === HTTPStatusCode.OK) {
					setValueInfo(response?.responseBody?.details);
					if (valueInfo && Boolean(isGetSubmitted)) {
						onCancel();
						window.location.reload();
					}
				}
			}
		}
		setIsLoading(false);
	};

	useEffect(() => {
		if (updateTRDetail?.ClientDetail?.ActiveTR > count || valueInfo) {
			if (updateTRDetail?.ClientDetail?.Availability === 'Part Time') {
				setValue('currentTR', updateTRDetail?.ClientDetail?.ActiveTR * 2);
				setCount(updateTRDetail?.ClientDetail?.ActiveTR * 2);
			} else {
				setValue('currentTR', updateTRDetail?.ClientDetail?.ActiveTR);
				setCount(updateTRDetail?.ClientDetail?.ActiveTR);
			}
		} else if (updateTRDetail?.ClientDetail?.ActiveTR <= count) {
			if (updateTRDetail?.ClientDetail?.Availability === 'Part Time') {
				setValue('currentTR', updateTRDetail?.ClientDetail?.ActiveTR * 2);
				setCount(updateTRDetail?.ClientDetail?.ActiveTR * 2);
			} else {
				setValue('currentTR', updateTRDetail?.ClientDetail?.ActiveTR);
				setCount(updateTRDetail?.ClientDetail?.ActiveTR);
			}
		}
	}, [updateTRDetail?.ClientDetail?.ActiveTR]);

	const increment = () => {
		setCount(count + 1);
		setDisable(false);
	};
	const decrement = () => {
		if (count > 0) {
			setCount(count - 1);
			setDisable(false);
		}
	};
	useEffect(() => {
		return () => setIsLoading(false);
	}, []);
	return (
		<div className={updateTRStyle.engagementModalContainer}>		
			<div className={updateTRStyle.updateTRTitle}>
				<h2>Update TR</h2>
				<p>
					{updateTRDetail?.ClientDetail?.HR_Number} | Current TR:{' '}
					{updateTRDetail?.ClientDetail?.Availability === 'Part Time' ? (
						<span>{updateTRDetail?.ClientDetail?.ActiveTR * 2}</span>
					) : (
						<span>{updateTRDetail?.ClientDetail?.ActiveTR}</span>
					)}
				</p>
			</div>

			<h4 className={updateTRStyle.infoMsg}>{valueInfo}</h4>

			{(isLoading || loader) ? (
				<SpinLoader />
			) : (
				<>
					{!valueInfo && (
						<div className={updateTRStyle.row}>
							<div className={updateTRStyle.colMd12}>
								<div className={updateTRStyle.counterFieldGroup}>
									<button
										className={updateTRStyle.minusButton}
										onClick={decrement}>
										<MinusSVG />
									</button>

									<HRInputField
										register={register}
										errors={errors}
										validationSchema={{
											required: 'Please enter current TR',
										}}
										label="Update Current TR"
										name="currentTR"
										setValue={setValue}
										value={count}
										onChangeHandler={(e) => {
											setCount(parseInt(e.target.value));
											setDisable(false);
										}}
										type={InputType.NUMBER}
										placeholder="Enter Current TR"
										required
									/>
									<button
										className={updateTRStyle.plusButton}
										onClick={increment}>
										<PlusSVG />
									</button>
								</div>
							</div>
						</div>
					)}
					{updateTRDetail?.ClientDetail?.Availability === 'Part Time'
						? (updateTRDetail?.ClientDetail?.ActiveTR * 2 <= count ||
								isNaN(count) ||
								valueInfo) && (
								<div className={updateTRStyle.row}>
									<div className={updateTRStyle.colMd12}>
										<HRInputField
											isTextArea={true}
											label={'Additional Comments'}
											register={register}
											errors={errors}
											name="additionalComments"
											type={InputType.TEXT}
											placeholder="Enter Additional Comments"
											validationSchema={{
												validate: (value) => {
													if (!value) {
														return 'Please enter the additional comments.';
													}
												},
											}}
											rows={'4'}
											required
											// required={
											//     updateTRDetail?.ClientDetail?.ActiveTR <= count
											//         ? true
											//         : false
											// }
											// required
										/>
									</div>
								</div>
						  )
						: (updateTRDetail?.ClientDetail?.ActiveTR <= count ||
								isNaN(count) ||
								valueInfo) && (
								<div className={updateTRStyle.row}>
									<div className={updateTRStyle.colMd12}>
										<HRInputField
											isTextArea={true}
											label={'Additional Comments'}
											register={register}
											errors={errors}
											name="additionalComments"
											type={InputType.TEXT}
											placeholder="Enter Additional Comments"
											validationSchema={{
												validate: (value) => {
													if (!value) {
														return 'Please enter the additional comments.';
													}
												},
											}}
											rows={'4'}
											required
										/>
									</div>
								</div>
						  )}
					{updateTRDetail?.ClientDetail?.Availability === 'Part Time'
						? updateTRDetail?.ClientDetail?.ActiveTR * 2 > count &&
						  !valueInfo && (
								<div className={updateTRStyle.row}>
									<div className={updateTRStyle.colMd12}>
										<HRInputField
											isTextArea={true}
											label={'Reason for Loss/Cancelled'}
											register={register}
											name="reasonForLoss"
											type={InputType.TEXT}
											placeholder="Enter Reason for Loss/Cancelled"
											errors={errors}
											validationSchema={{
												validate: (value) => {
													if (!value) {
														return 'Please enter the reason for loss.';
													}
												},
											}}
											rows={'4'}
											required
										/>
									</div>
								</div>
						  )
						: updateTRDetail?.ClientDetail?.ActiveTR > count &&
						  !valueInfo && (
								<div className={updateTRStyle.row}>
									<div className={updateTRStyle.colMd12}>
										<HRInputField
											isTextArea={true}
											label={'Reason for Loss/Cancelled'}
											register={register}
											name="reasonForLoss"
											type={InputType.TEXT}
											placeholder="Enter Reason for Loss/Cancelled"
											errors={errors}
											validationSchema={{
												validate: (value) => {
													if (!value) {
														return 'Please enter the reason for loss.';
													}
												},
											}}
											rows={'4'}
											required
										/>
									</div>
								</div>
						  )}

					<div className={updateTRStyle.formPanelAction}>
						<button
							onClick={() => {
								onCancel();
								// window.location.reload();
								setCount(updateTRDetail?.ClientDetail?.ActiveTR);
								setValue('additionalComments', '');
								setValue('reasonForLoss', '');
							}}
							className={updateTRStyle.btn}>
							Cancel
						</button>

						{updateTRDetail?.ClientDetail?.Availability === 'Part Time' ? (
							updateTRDetail?.ClientDetail?.ActiveTR * 2 === count ? (
								<button
									type="submit"
									className={updateTRStyle.btnPrimary}
									disabled={true}
									onClick={handleSubmit(onSubmit)}>
									Submit
								</button>
							) : updateTRDetail?.ClientDetail?.ActiveTR * 2 < count ? (
								<button
									type="submit"
									className={updateTRStyle.btnPrimary}
									onClick={handleSubmit(onSubmit)}
									// disabled={
									//     updateTRDetail?.ClientDetail?.ActiveTR * 2 === count
									//         ? true
									//         : false
									// }
								>
									Increase TR
								</button>
							) : (
								<button
									type="submit"
									className={updateTRStyle.btnPrimary}
									onClick={handleSubmit(onSubmit)}>
									Decrease TR
								</button>
							)
						) : updateTRDetail?.ClientDetail?.ActiveTR === count ? (
							<button
								type="submit"
								className={updateTRStyle.btnPrimary}
								disabled={true}
								onClick={handleSubmit(onSubmit)}>
								Submit
							</button>
						) : updateTRDetail?.ClientDetail?.ActiveTR < count ? (
							<button
								type="submit"
								className={updateTRStyle.btnPrimary}
								onClick={handleSubmit(onSubmit)}
								// disabled={
								//     updateTRDetail?.ClientDetail?.ActiveTR === count ? true : false
								// }
							>
								Increase TR
							</button>
						) : (
							<button
								type="submit"
								className={updateTRStyle.btnPrimary}
								onClick={handleSubmit(onSubmit)}>
								Decrease TR
							</button>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default UpdateTR;
