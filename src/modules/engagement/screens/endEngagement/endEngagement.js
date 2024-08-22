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
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import UploadModal from 'shared/components/uploadModal/uploadModal';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import moment from 'moment/moment';
import { Checkbox, Skeleton } from 'antd';

const EngagementEnd = ({ engagementListHandler, talentInfo, closeModal,lostReasons }) => {
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
	const [isSubmit,setIsSubmit] = useState(false)
	const [getValidation, setValidation] = useState({
		systemFileUpload: '',
		googleDriveFileUpload: '',
		linkValidation: '',
	});
	const [base64File, setBase64File] = useState('');
	const [addLatter,setAddLetter] = useState(false)
	const [engagementReplacement,setEngagementReplacement] = useState({
		replacementData : false
	})
	const loggedInUserID = JSON.parse(localStorage.getItem('userSessionInfo')).LoggedInUserTypeID
	const watchLostReason = watch("lostReason");
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
			let convertedDate = dateString ? moment(dateString, 'DD/MM/YYYY') : ''

			if(dateString){
				const formattedDate = convertedDate?.format('YYYY-MM-DDTHH:mm:ss');
				setValue("lastWorkingDate", new Date(formattedDate));
				setValue("newContractStartDate", new Date(formattedDate));
			}
			
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
			setIsSubmit(true)
			let formattedData = {
				contractDetailID: getEndEngagementDetails?.contractDetailID,
				contractEndDate: d.lastWorkingDate ? moment(d.lastWorkingDate).format("yyyy-MM-DD") : d.lastWorkingDate,
				reason: d.endEngagementReason,
				fileName: getUploadFileData,
				LostReasonID: +d.lostReason.id,
				fileUpload: {
					base64ProfilePic: base64File,
					extenstion: getUploadFileData?.split('.')[1],
				},
				isReplacement: engagementReplacement?.replacementData,
				talentReplacement: {
				onboardId: talentInfo?.onboardID,
				lastWorkingDay: addLatter === false ? moment(d.lwd).format("yyyy-MM-DD") :"" ,
				replacementInitiatedby:loggedInUserID.toString(),
				engHRReplacement: addLatter === true || d.engagementreplacement === undefined ? "" : d.engagementreplacement.id 
				},
				dpPercentage : +d.dpPercentage,
				dpAmount : +d.dpAmount,
				newContractStartDate : d.newContractStartDate ? moment(d.newContractStartDate).format("yyyy-MM-DD") : d.newContractStartDate ,
				expectedCTC : +d.expectedCTC,
			};
			const response =
				await engagementRequestDAO.changeContractEndDateRequestDAO(
					formattedData,
				);
			if (response.statusCode === HTTPStatusCode.OK) {
				closeModal();
				engagementListHandler();
				setIsSubmit(false)
			}
			setIsSubmit(false)
		},
		[
			base64File,
			closeModal,
			engagementListHandler,
			getEndEngagementDetails?.contractDetailID,
			getUploadFileData,
			talentInfo,
			engagementReplacement?.replacementData,
			addLatter
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

	let watchExpectedCTC  = watch('expectedCTC')
    let watchDPpercentage = watch('dpPercentage')

    // watch values and change DP amount
    useEffect(() => { 
        let DPAMOUNT =  ((watchExpectedCTC *  12) * watchDPpercentage) / 100 
        setValue('dpAmount', DPAMOUNT.toFixed(2))
    },[watchExpectedCTC,watchDPpercentage, setValue])


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
					<li className={allengagementEnd.divider}>|</li>
					<li>
						<span>DP Percentage:</span>
						{getEndEngagementDetails?.dpnrPercentage}
					</li>
				</ul>
			</div>

			{isSubmit ? <Skeleton /> : <>
				<div className={allengagementEnd.row}>
				<div className={allengagementEnd.colMd6}>
					<div className={allengagementEnd.timeSlotItemField}>
						<div className={allengagementEnd.timeLabel}>
							Contract End Date
							<span>
								<b style={{ color: 'red' }}> *</b>
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
											setValue("lwd",date)
										}}
										placeholderText="Contract End Date"
										dateFormat="dd/MM/yyyy"
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
				<HRSelectField
                  setValue={setValue}
                  mode={"id/value"}
                  register={register}
                  name="lostReason"
                  label="Contract Lost Reason"
                  defaultValue="Select Reason"
                  options={lostReasons ? lostReasons.map(item=> ({id: item.value, value:item.text})) : []}
                  required
                  isError={
                    errors["lostReason"] && errors["lostReason"]
                  }
                  errorMsg="Please select contract lost reason."
                />
				</div>
				</div>

				{watchLostReason?.id === "3" && <div className={allengagementEnd.row}>
					<div className={allengagementEnd.colMd12}>
				  	 	<p>Currency<b style={{color:"red"}}> *</b> :{' '} {getEndEngagementDetails?.currency} </p>	
					</div>
				</div>}

				{watchLostReason?.id === "3" && <div className={allengagementEnd.row}>
                    <div
                        className={allengagementEnd.colMd12}>
                        <HRInputField
                            register={register}
                            errors={errors}
                            validationSchema={{
                                required: 'please enter Talent Expected CTC.',
                            }}
                            label="Talent Expected CTC Monthly"
                            name="expectedCTC"
                            type={InputType.NUMBER}
                            placeholder="Enter Amount"
                            required = {watchLostReason?.id === "3" ? true:false}
                        />
                    </div>
                </div>}

				{watchLostReason?.id === "3" && <div className={allengagementEnd.row}>
                    <div
                        className={allengagementEnd.colMd12}>
                        <HRInputField
                            register={register}
                            errors={errors}
                            validationSchema={{
                                required: 'please enter DP Percentage.',
                            }}
                            label="DP Percentage"
                            name="dpPercentage"
                            type={InputType.NUMBER}
                            placeholder="Enter Amount"
                            required = {watchLostReason?.id === "3" ? true:false}
                        />
                    </div>
                </div>}

				{watchLostReason?.id === "3" && <div className={allengagementEnd.row}>
					<div
						className={allengagementEnd.colMd12}>
						<HRInputField
							register={register}
							errors={errors}
							validationSchema={{
								required: 'Invalid DP Amount.',
								validate: (value) => {
									if (value <= 0) {
										return "Invalid DP Amount.";
									}
									},
							}}
							label="DP One time Amount"
							name="dpAmount"
							type={InputType.NUMBER}
							placeholder="Enter Amount"
							required = {watchLostReason?.id === "3" ? true:false}
							disabled={true}
						/>
					</div>
				</div>}

				{watchLostReason?.id === "3" && 
				<div className={`${allengagementEnd.row} ${allengagementEnd.mb32}`}>
					<div className={allengagementEnd.colMd6}>
					<div className={allengagementEnd.timeSlotItemField}>
						<div className={allengagementEnd.timeLabel}>
							New	Contract Start Date
							<span>
								<b style={{ color: 'red' }}> *</b>
							</span>
						</div>
						<div className={allengagementEnd.timeSlotItem}>
							<CalenderSVG />
							<Controller
								render={({ ...props }) => (
									<DatePicker
										selected={watch('newContractStartDate')}
										onChange={(date) => {
											setValue('newContractStartDate', date);
											// setValue("lwd",date)
										}}
										placeholderText="New Contract Start Date"
										dateFormat="dd/MM/yyyy"
									/>
								)}
								name="newContractStartDate"
								rules={{ required: true }}
								control={control}
							/>
							{errors.newContractStartDate && (
								<div className={allengagementEnd.error}>
									* Please select new	contract start date.
								</div>
							)}
						</div>
					</div>
				</div>
				</div>}


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
			<div className={`${allengagementEnd.row} ${allengagementEnd.mb16}`}>
				<div className={allengagementEnd.colMd12}>
					<Checkbox
							name="PayPerCredit"
							checked={engagementReplacement?.replacementData}
							onChange={(e) => {
							setEngagementReplacement({
							...engagementReplacement,
							replacementData: e.target.checked,
							});
							if(e.target.checked === false){
								setAddLetter(false)
								setValue("lwd","");
								setValue("engagementreplacement","")
							}
						}}
					>
					Is this engagement going under replacement?
					</Checkbox>
				</div>
			</div>
			<div className={`${allengagementEnd.row} ${allengagementEnd.mb16}`}>
				<div className={allengagementEnd.colMd6}>
					{engagementReplacement?.replacementData &&<div className={allengagementEnd.timeSlotItemField}>
						<div className={allengagementEnd.timeLabel}>
							Last Working Day
						</div>
						<div className={allengagementEnd.timeSlotItem}>
							<CalenderSVG />
							<Controller
								render={({ ...props }) => (
									<DatePicker
										selected={watch('lwd')}
										onChange={(date) => {
											setValue('lwd', date);
										}}
										placeholderText="Last Working Day"
										dateFormat="dd/MM/yyyy"
										minDate={new Date()}
										// disabled={addLatter}
									/>
								)}
								name="lwd"
								rules={{ required: true }}
								control={control}
							/>
						</div>
					</div>}
				</div>
			</div>
			<div className={allengagementEnd.row}>
				{engagementReplacement?.replacementData && <div className={allengagementEnd.colMd6}>
					<HRSelectField
						disabled={addLatter}
						setValue={setValue}
						mode={"id/value"}
						register={register}
						name="engagementreplacement"
						label="Select HR ID/Eng ID created to replace this engagement"
						defaultValue="Select HR ID/Eng ID"
						options={getEndEngagementDetails?.replacementEngAndHR ? getEndEngagementDetails?.replacementEngAndHR.map(item=> ({id: item.stringIdValue, value:item.value})) : []}
					/>
				</div>}
			</div>
			<div className={`${allengagementEnd.row} ${allengagementEnd.mb32}`}>
				{engagementReplacement?.replacementData &&<div className={allengagementEnd.colMd12}>
					<Checkbox
                     	name="PayPerCredit"
                      	checked={addLatter}
                      	onChange={(e) => {
                        	setAddLetter(e.target.checked);
						}}
                    >
					Will add this later, by doing this you understand that replacement will not be tracked correctly.
                    </Checkbox>
				</div>}
			</div>
			</>}
			<div className={allengagementEnd.formPanelAction}>
				<button
					type="submit"
					onClick={handleSubmit(submitEndEngagementHandler)}
					className={allengagementEnd.btnPrimary}
					disabled={isSubmit}
					>
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
