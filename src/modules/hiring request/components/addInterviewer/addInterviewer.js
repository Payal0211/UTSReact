import { EmailRegEx, InputType, URLRegEx } from 'constants/application';
import { useCallback, useEffect } from 'react';
import HRInputField from '../hrInputFields/hrInputFields';
import AddInterviewerStyle from './addInterviewer.module.css';
import { secondaryInterviewer } from '../hrFields/hrFields';
import { _isNull } from 'shared/utils/basic_utils';

const AddInterviewer = ({
	interviewDetails,
	register,
	fields,
	remove,
	append,
	setValue,
	errors,
}) => {
	/**Add Secondary Items*/
	const onAddSecondaryInterviewer = useCallback(
		(e) => {
			e.preventDefault();
			append({ ...secondaryInterviewer });
		},
		[append],
	);
	const onRemoveSecondaryInterviewer = useCallback(
		(e, index) => {
			e.preventDefault();
			remove(index);
		},
		[remove],
	);

	const autoFillInterviewDetailsHandler = useCallback(() => {
		if (interviewDetails) {
			setValue('interviewerFullName', interviewDetails?.fullName);
			setValue('interviewerEmail', interviewDetails?.emailId);
			setValue('interviewerLinkedin', interviewDetails?.linkedin);
			setValue('interviewerDesignation', interviewDetails?.designation);
		}
	}, [interviewDetails, setValue]);

	useEffect(() => {
		if (interviewDetails) autoFillInterviewDetailsHandler();
	}, [autoFillInterviewDetailsHandler, interviewDetails]);
	return (
		<div>
			<div className={AddInterviewerStyle.addInterviewContainer}>
				<div className={AddInterviewerStyle.addInterviewLeftPane}>
					<h3>Interview Details</h3>
					<p>Please provide the necessary details</p>
					{fields.length === 0 && (
						<button
							className={AddInterviewerStyle.addInterviewer}
							onClick={onAddSecondaryInterviewer}>
							Add Interviewer
						</button>
					)}
				</div>
				<div className={AddInterviewerStyle.addInterviewRightPane}>
					<div className={AddInterviewerStyle.row}>
						<div className={AddInterviewerStyle.colMd6}>
							<HRInputField
								disabled={!_isNull(interviewDetails)}
								register={register}
								label="Interviewer Full Name"
								name="interviewerFullName"
								type={InputType.TEXT}
								placeholder="Enter Full Name"
								errors={errors}
								validationSchema={{
									required: 'please enter the primary interviewer full name.',
								}}
								required
							/>
						</div>

						<div className={AddInterviewerStyle.colMd6}>
							<HRInputField
								disabled={!_isNull(interviewDetails)}
								register={register}
								label="Interviewer Email"
								name="interviewerEmail"
								type={InputType.EMAIL}
								placeholder="Enter email"
								errors={errors}
								validationSchema={{
									required: 'please enter the primary interviewer email ID.',
									pattern: {
										value: EmailRegEx.email,
										message: 'Entered value does not match email format',
									},
								}}
								required
							/>
						</div>
					</div>
					<div className={AddInterviewerStyle.row}>
						<div className={AddInterviewerStyle.colMd6}>
							<HRInputField
								disabled={!_isNull(interviewDetails)}
								register={register}
								label="Interviewer Linkedin"
								name="interviewerLinkedin"
								type={InputType.TEXT}
								placeholder="Enter Linkedin Profile"
								errors={errors}
								validationSchema={{
									required: 'please enter the primary interviewer linkedin.',
									pattern: {
										value: URLRegEx.url,
										message: 'Entered value does not match url format',
									},
								}}
								required
							/>
						</div>

						<div className={AddInterviewerStyle.colMd6}>
							<HRInputField
								disabled={!_isNull(interviewDetails)}
								required
								errors={errors}
								validationSchema={{
									required: 'please enter the primary interviewer designation.',
								}}
								register={register}
								label="Interviewer Designation "
								name="interviewerDesignation"
								type={InputType.TEXT}
								placeholder="Enter Designation"
							/>
						</div>
					</div>
				</div>
			</div>
			{fields?.map((_, index) => {
				return (
					<div
						className={AddInterviewerStyle.addInterviewContainer}
						key={`addInterviewer_${index}`}>
						<div className={AddInterviewerStyle.addInterviewLeftPane}>
							<h3>Secondary Interview Details - {index + 1}</h3>
							<p>Please provide the necessary details</p>
							{fields.length - 1 === index && (
								<div className={AddInterviewerStyle.leftPanelAction}>
									{fields.length < 3 && (
										<button
											type="button"
											className={AddInterviewerStyle.btnPrimary}
											onClick={onAddSecondaryInterviewer}>
											Add More
										</button>
									)}
									<button
										type="button"
										className={AddInterviewerStyle.btn}
										onClick={(e) => onRemoveSecondaryInterviewer(e, index)}>
										Remove
									</button>
								</div>
							)}
						</div>
						<div className={AddInterviewerStyle.addInterviewRightPane}>
							<div className={AddInterviewerStyle.row}>
								<div className={AddInterviewerStyle.colMd6}>
									<HRInputField
										register={register}
										label="Interviewer Full Name"
										validationSchema={{
											required:
												'please enter the secondary interviewer full name.',
										}}
										name={`secondaryInterviewer.[${index}].fullName`}
										type={InputType.TEXT}
										placeholder="Enter Full Name"
										required
										isError={!!errors?.secondaryInterviewer?.[index]?.fullName}
										errorMsg="please enter the secondary interviewer full name."
									/>
								</div>

								<div className={AddInterviewerStyle.colMd6}>
									<HRInputField
										isError={!!errors?.secondaryInterviewer?.[index]?.emailID}
										errorMsg="please enter the secondary interviewer email ID."
										register={register}
										label="Interviewer Email"
										validationSchema={{
											required:
												'please enter the secondary interviewer email ID.',
											pattern: {
												value: EmailRegEx.email,
												message: 'Entered value does not match email format',
											},
										}}
										name={`secondaryInterviewer.[${index}].emailID`}
										type={InputType.EMAIL}
										placeholder="Enter email"
										required
									/>
								</div>
							</div>
							<div className={AddInterviewerStyle.row}>
								<div className={AddInterviewerStyle.colMd6}>
									<HRInputField
										register={register}
										label="Interviewer Linkedin"
										name={`secondaryInterviewer.[${index}].linkedin`}
										validationSchema={{
											required:
												'please enter secondary interviewer linkedin url.',
										}}
										type={InputType.TEXT}
										placeholder="Enter Linkedin Profile"
										required
										isError={!!errors?.secondaryInterviewer?.[index]?.linkedin}
										errorMsg="please enter the secondary interviewer linkedin url."
									/>
								</div>

								<div className={AddInterviewerStyle.colMd6}>
									<HRInputField
										register={register}
										label="Interviewer Designation"
										name={`secondaryInterviewer.[${index}].designation`}
										validationSchema={{
											required:
												'please enter secondary interviewer designation.',
										}}
										type={InputType.TEXT}
										placeholder="Enter Designation"
										required
										isError={
											!!errors?.secondaryInterviewer?.[index]?.designation
										}
										errorMsg="please enter the secondary interviewer designation."
									/>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default AddInterviewer;
