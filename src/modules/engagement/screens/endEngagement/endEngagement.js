import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import allengagementEnd from '../engagementBillAndPayRate/engagementBillRate.module.css';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import 'react-datepicker/dist/react-datepicker.css';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import { HTTPStatusCode } from 'constants/network';
import UploadModal from 'shared/components/uploadModal/uploadModal';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import moment from 'moment/moment';

const EngagementEnd = ({ engagementListHandler, talentInfo, closeModal }) => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		watch,
		resetField,
		formState: { errors },
	} = useForm();
	const [getEndEngagementDetails, setEndEngagementDetails] = useState(null);
	const [getUploadFileData, setUploadFileData] = useState('');
	const [showUploadModal, setUploadModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [getValidation, setValidation] = useState({
		systemFileUpload: '',
		googleDriveFileUpload: '',
		linkValidation: '',
	});
	const [base64File, setBase64File] = useState('');

	const convertToBase64 = useCallback((file) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = () => {
				resolve(fileReader.result);
			};
			fileReader.onerror = (error) => {
				reject(error);
			};
		});
	}, []);
	const uploadFileHandler = useCallback(
		async (fileData) => {
			setIsLoading(true);
			if (
				fileData?.type !== 'application/pdf' &&
				fileData?.type !== 'application/docs' &&
				fileData?.type !== 'application/msword' &&
				fileData?.type !== 'text/plain' &&
				fileData?.type !==
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
				fileData?.type !== 'image/png' &&
				fileData?.type !== 'image/jpeg'
			) {
				setValidation({
					...getValidation,
					systemFileUpload:
						'Uploaded file is not a valid, Only pdf, docs, jpg, jpeg, png, text and rtf files are allowed',
				});
				setIsLoading(false);
			} else if (fileData?.size >= 500000) {
				setValidation({
					...getValidation,
					systemFileUpload:
						'Upload file size more than 500kb, Please Upload file upto 500kb',
				});
				setIsLoading(false);
			} else {
				const base64 = await convertToBase64(fileData);

				setValidation({
					...getValidation,
					systemFileUpload: '',
				});
				setIsLoading(false);
				setBase64File(base64);
				setUploadFileData(fileData.name);
				setUploadModal(false);
			}
		},
		[convertToBase64, getValidation],
	);

	const getEndEngagementHandler = useCallback(async () => {
		const response =
			await engagementRequestDAO.getContentEndEngagementRequestDAO({
				onboardID: talentInfo?.onboardID,
			});
		if (response?.statusCode === HTTPStatusCode.OK) {
			setEndEngagementDetails(response?.responseBody?.details)
			let dateString = response?.responseBody?.details?.contractEndDate
			let convertedDate = moment(dateString, 'DD/MM/YYYY')

			const formattedDate = convertedDate?.format('YYYY-MM-DDTHH:mm:ss');
			setValue("lastWorkingDate", new Date(formattedDate));
			/* let updatedDate = new Date(
				new Date(
					response?.responseBody?.details?.contractEndDate,
				).toLocaleDateString('en-US'),
			);

			console.log(updatedDate, '-updatedDate');
			setValue('lastWorkingDate', updatedDate); */
		}
	}, [talentInfo?.onboardID]);

	const submitEndEngagementHandler = useCallback(
		async (d) => {
			let formattedData = {
				contractDetailID: getEndEngagementDetails?.contractDetailID,
				contractEndDate: d.lastWorkingDate,
				reason: d.endEngagementReason,
				fileName: getUploadFileData,
				fileUpload: {
					base64ProfilePic: base64File,
					extenstion: getUploadFileData?.split('.')[1],
				},
			};

			const response =
				await engagementRequestDAO.changeContractEndDateRequestDAO(
					formattedData,
				);
			if (response.statusCode === HTTPStatusCode.OK) {
				closeModal();
				engagementListHandler();
			}
		},
		[
			base64File,
			closeModal,
			engagementListHandler,
			getEndEngagementDetails?.contractDetailID,
			getUploadFileData,
		],
	);

	useEffect(() => {
		getEndEngagementHandler();
	}, [getEndEngagementHandler]);

	useEffect(() => {
		if (closeModal) {
			resetField('lastWorkingDate');
			resetField('jdExport');
			setUploadFileData(null);
			resetField('endEngagementReason');
		}
	}, [closeModal, resetField]);

	return (
		<div className={allengagementEnd.engagementModalWrap}>
			<div
				className={`${allengagementEnd.headingContainer} ${allengagementEnd.addFeebackContainer}`}>
				<h1>End Engagement</h1>
				<ul className={allengagementEnd.engModalHeadList}>
					<li>
						<span>HR ID:</span>
						{talentInfo?.hrNumber}
					</li>
					<li className={allengagementEnd.divider}>|</li>
					<li>
						<span>Engagement ID:</span>
						{talentInfo?.engagementID}
					</li>
					<li className={allengagementEnd.divider}>|</li>
					<li>
						<span>Talent Name:</span>
						{talentInfo?.talentName}
					</li>
				</ul>
			</div>

			<div className={allengagementEnd.row}>
				<div className={allengagementEnd.colMd6}>
					<div className={allengagementEnd.timeSlotItemField}>
						<div className={allengagementEnd.timeLabel}>
							Contract End Date
							<span>
								<b style={{ color: 'black' }}>*</b>
							</span>
						</div>
						<div className={allengagementEnd.timeSlotItem}>
							<CalenderSVG />
							<Controller
								render={({ ...props }) => (
									<DatePicker
										selected={watch('lastWorkingDate')}
										onChange={(date) => {
											setValue('lastWorkingDate', date);
										}}
										placeholderText="Contract End Date"
									/>
								)}
								name="lastWorkingDate"
								rules={{ required: true }}
								control={control}
							/>
							{errors.lastWorkingDate && (
								<div className={allengagementEnd.error}>
									* Please select last working date.
								</div>
							)}
						</div>
					</div>
				</div>

				<div className={allengagementEnd.colMd6}>
					{!getUploadFileData ? (
						<HRInputField
							register={register}
							leadingIcon={<UploadSVG />}
							label="Contract Supporting Documents (PDF)"
							name="jdExport"
							type={InputType.BUTTON}
							buttonLabel="Upload Communication Records"
							onClickHandler={() => setUploadModal(true)}
							required
							validationSchema={{
								required: 'please select a file.',
							}}
							errors={errors}
						/>
					) : (
						<div className={allengagementEnd.uploadedJDWrap}>
							<label>
								Contract Supporting Documents (PDF){' '}
								<b style={{ color: 'black' }}>*</b>
							</label>
							<div className={allengagementEnd.uploadedJDName}>
								{getUploadFileData}{' '}
								<CloseSVG
									className={allengagementEnd.uploadedJDClose}
									onClick={() => {
										// setJDParsedSkills({});
										setUploadFileData('');
									}}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
			<UploadModal
				isLoading={isLoading}
				uploadFileHandler={(e) => uploadFileHandler(e.target.files[0])}
				modalTitle={'Contract Supporting Documents'}
				modalSubtitle={'Contract Supporting Documents (PDF)'}
				isFooter={false}
				openModal={showUploadModal}
				cancelModal={() => setUploadModal(false)}
				setValidation={setValidation}
				getValidation={getValidation}
			/>
			<div className={allengagementEnd.row}>
				<div className={allengagementEnd.colMd12}>
					<HRInputField
						required
						isTextArea={true}
						rows={4}
						errors={errors}
						validationSchema={{
							required: 'Please enter the reason for Ending Engagement.',
						}}
						label={'Reason for Ending Engagement'}
						register={register}
						name="endEngagementReason"
						type={InputType.TEXT}
						placeholder="Enter Reason"
					/>
				</div>
			</div>

			<div className={allengagementEnd.formPanelAction}>
				<button
					type="submit"
					onClick={handleSubmit(submitEndEngagementHandler)}
					className={allengagementEnd.btnPrimary}>
					Save
				</button>
				<button
					className={allengagementEnd.btn}
					onClick={closeModal}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default EngagementEnd;
