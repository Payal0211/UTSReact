import { EmailRegEx, InputType, URLRegEx } from 'constants/application';
import { useCallback, useEffect } from 'react';
import HRInputField from '../hrInputFields/hrInputFields';
import AddInterviewerStyle from './addInterviewer.module.css';
import { secondaryInterviewer } from '../hrFields/hrFields';
import { _isNull } from 'shared/utils/basic_utils';
import { useLocation } from 'react-router-dom';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';

const AddInterviewer = ({
	interviewDetails,
	register,
	fields,
	remove,
	append,
	setValue,
	watch,
	errors,
	getHRdetails,
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
	const clonedParams = useLocation();

	/** TODO:-  */
	const reomveSecondaryInterviewAPIHandler = useCallback(
		async (e, index, interviewID, interviewerName) => {
			const response = await hiringRequestDAO.deleteInterviewRequestDAO({
				interviewID: interviewID,
				hrID: parseInt(localStorage.getItem('hrID')),
				name: interviewerName,
			});
			if (response?.statusCode === HTTPStatusCode.OK) {
				onRemoveSecondaryInterviewer(e, index);
			}
		},
		[onRemoveSecondaryInterviewer],
	);

	/*const autoFillInterviewDetailsHandler = useCallback(() => {
		if (interviewDetails) {
			setValue('interviewerFullName', interviewDetails?.fullName);
			setValue('interviewerEmail', interviewDetails?.emailId);
			setValue('interviewerLinkedin', interviewDetails?.linkedin);
			setValue('interviewerDesignation', interviewDetails?.designation);
		}
	}, [interviewDetails, setValue]);*/

	useEffect(() => {
		if (localStorage.getItem('hrID')) {
			// setValue(
			// 	'interviewerFullName',
			// 	getHRdetails?.secondaryInterviewerlist?.[0]?.fullName,
			// );
			// setValue(
			// 	'interviewerEmail',
			// 	getHRdetails?.secondaryInterviewerlist?.[0]?.emailID,
			// );
			// setValue(
			// 	'interviewerLinkedin',
			// 	getHRdetails?.secondaryInterviewerlist?.[0]?.linkedin,
			// );
			// setValue(
			// 	'interviewerDesignation',
			// 	getHRdetails?.secondaryInterviewerlist?.[0]?.designation,
			// );

			let primaryInterviewerDetails = getHRdetails?.interviewerDetails?.primaryInterviewer

			setValue('interviewerFullName', primaryInterviewerDetails?.fullName);
			setValue('interviewerEmail', primaryInterviewerDetails?.emailID);
			setValue('interviewerLinkedin', primaryInterviewerDetails?.linkedin);
			setValue('interviewerDesignation', primaryInterviewerDetails?.designation);
			setValue('interviewerId', primaryInterviewerDetails?.interviewerId);
			
			// setValue('interviewerFullName', getHRdetails?.salesHiringRequest_Details?.interviewerName);
			// setValue('interviewerEmail', getHRdetails?.salesHiringRequest_Details?.interviewerEmailId);
			// setValue('interviewerLinkedin', getHRdetails?.salesHiringRequest_Details?.interviewLinkedin);
			// setValue('interviewerDesignation', getHRdetails?.salesHiringRequest_Details?.interviewerDesignation);


		} else if (interviewDetails) {
			interviewDetails?.fullName && setValue('interviewerFullName', interviewDetails?.fullName);
			interviewDetails?.emailId && setValue('interviewerEmail', interviewDetails?.emailId);
			interviewDetails?.linkedin && setValue('interviewerLinkedin', interviewDetails?.linkedin);
			interviewDetails?.designation && setValue('interviewerDesignation', interviewDetails?.designation);
		} else {
			// setValue('interviewerFullName', getHRdetails?.salesHiringRequest_Details?.interviewerFullName);
			// setValue('interviewerEmail', getHRdetails?.salesHiringRequest_Details?.interviewerEmail);
			// setValue('interviewerLinkedin', getHRdetails?.salesHiringRequest_Details?.interviewLinkedin);
			// setValue('interviewerDesignation', getHRdetails?.salesHiringRequest_Details?.interviewerDesignation);
		}
	}, [getHRdetails, interviewDetails, setValue]);

	const addInterviewerBasedOnIsCloned = () => {
	
			 		return (
				fields?.length === 0 && (
					<button
						className={AddInterviewerStyle.addInterviewer}
						onClick={onAddSecondaryInterviewer}>
						Add Interviewer
					</button>
				)
					)
		// if (clonedParams?.state?.isCloned) {
		// 	return (
		// 		fields?.length === 1 && (
		// 			<button
		// 				className={AddInterviewerStyle.addInterviewer}
		// 				onClick={onAddSecondaryInterviewer}>
		// 				Add Interviewer
		// 			</button>
		// 		)
		// 	);
		// } else
		// 	return (
		// 		fields.length === 0 && (
		// 			<button
		// 				className={AddInterviewerStyle.addInterviewer}
		// 				onClick={onAddSecondaryInterviewer}>
		// 				Add Interviewer
		// 			</button>
		// 		)
		// 	);
	};

	const getSecondaryInterviewFieldsBasedOnIsCloned = () => {
		if(fields.length > 0){
			return fields?.map((_, index) => {
			let allEmails = [watch('interviewerEmail')]
			let allLinkedinIDs = [watch('interviewerLinkedin')]
			fields.forEach((_, emailindex) => {
			 if(emailindex !== index) {
				allEmails.push(watch(`secondaryInterviewer.[${emailindex}].emailID`)) 
				allLinkedinIDs.push(watch(`secondaryInterviewer.[${emailindex}].linkedin`))
			} 
			})

			let emailInclude = allEmails.includes( watch(`secondaryInterviewer.[${index}].emailID`))
			let linkedinInclide = allLinkedinIDs.includes(watch(`secondaryInterviewer.[${index}].linkedin`))
	
			return (
				<div
					className={AddInterviewerStyle.addInterviewContainer}
					key={`addInterviewer_${index}`}>
					<div className={AddInterviewerStyle.addInterviewLeftPane}>
						<h3>Secondary Interviewer Details - {index + 1}</h3>
						<p>Please provide the necessary details</p>
						{fields.length - 1 === index && (
							<div className={AddInterviewerStyle.leftPanelAction}>
								{fields.length < 4 && (
									<button
										type="button"
										className={AddInterviewerStyle.btnPrimary}
										onClick={onAddSecondaryInterviewer}>
										Add More
									</button>
								)}
								
							</div>
						)}
						<div className={AddInterviewerStyle.leftPanelAction}><button
									type="button"
									className={AddInterviewerStyle.btn}
									onClick={(e) => _.interviewerId > 0 ?
										reomveSecondaryInterviewAPIHandler(
										e,
										index,
										_.interviewerId,
										_.fullName,
									) :
									onRemoveSecondaryInterviewer(e, index)}
									>
									Remove
								</button></div>
						
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
									errorMsg={!!errors?.secondaryInterviewer?.[index]?.emailID && errors?.secondaryInterviewer?.[index]?.emailID.message}
									register={register}
									label="Interviewer Email"
									validationSchema={{
										required:
											'please enter the secondary interviewer email ID.',
										pattern: {
											value: EmailRegEx.email,
											message: 'Entered value does not match email format',
										},
										validate: value => {
											if(emailInclude){
												return "Interviewer email id is already in use"
											}
										}
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
										validate: value => {
												if(linkedinInclide){
													return "Interviewer linkedin is already in use"
												}
											}
									}}
									type={InputType.TEXT}
									placeholder="Enter Linkedin Profile"
									required
									isError={!!errors?.secondaryInterviewer?.[index]?.linkedin}
									errorMsg={!!errors?.secondaryInterviewer?.[index]?.linkedin && errors?.secondaryInterviewer?.[index]?.linkedin.message}
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
		});
		}
		
		// **************************** CODE FROM OLD FLOW ******************************
		// if (clonedParams?.state?.isCloned) {
		// 	return (
		// 		fields?.length >= 1 &&
		// 		fields?.map((_, index) => {
		// 			let allEmails = [watch('interviewerEmail')]
		// 		let allLinkedinIDs = [watch('interviewerLinkedin')]
		// 		fields.forEach((_, emailindex) => {
		// 		 if(emailindex !== index) {
		// 			allEmails.push(watch(`secondaryInterviewer.[${emailindex}].emailID`)) 
		// 			allLinkedinIDs.push(watch(`secondaryInterviewer.[${emailindex}].linkedin`))
		// 		} 
		// 		})

		// 		let emailInclude = allEmails.includes( watch(`secondaryInterviewer.[${index}].emailID`))
		// 		let linkedinInclide = allLinkedinIDs.includes(watch(`secondaryInterviewer.[${index}].linkedin`))

		// 		return (
		// 				<div
		// 					className={AddInterviewerStyle.addInterviewContainer}
		// 					key={`addInterviewer_${index}`}>
		// 					<div className={AddInterviewerStyle.addInterviewLeftPane}>
		// 						<h3>Secondary Interviewer Details - {index + 1}</h3>
		// 						<p>Please provide the necessary details</p>
		// 						{fields.length - 1 === index && (
		// 							<div className={AddInterviewerStyle.leftPanelAction}>
		// 								{fields.length < 3 && (
		// 									<button
		// 										type="button"
		// 										className={AddInterviewerStyle.btnPrimary}
		// 										onClick={onAddSecondaryInterviewer}>
		// 										Add More
		// 									</button>
		// 								)}
		// 								<button
		// 									type="button"
		// 									className={AddInterviewerStyle.btn}
		// 									// onClick={(e) => onRemoveSecondaryInterviewer(e, index)}
		// 									onClick={(e) => {
		// 										return getHRdetails?.secondaryInterviewerlist?.[index]
		// 											?.interviewId
		// 											? reomveSecondaryInterviewAPIHandler(
		// 													e,
		// 													index,
		// 													getHRdetails?.secondaryInterviewerlist?.[index]
		// 														?.interviewId,
		// 													getHRdetails?.secondaryInterviewerlist?.[index]
		// 														?.fullName,
		// 											  )
		// 											: onRemoveSecondaryInterviewer(e, index);
		// 									}}>
		// 									Remove
		// 								</button>
		// 							</div>
		// 						)}
		// 					</div>
		// 					<div className={AddInterviewerStyle.addInterviewRightPane}>
		// 						<div className={AddInterviewerStyle.row}>
		// 							<div className={AddInterviewerStyle.colMd6}>
		// 								<HRInputField
		// 									register={register}
		// 									label="Interviewer Full Name"
		// 									validationSchema={{
		// 										required:
		// 											'please enter the secondary interviewer full name.',
		// 									}}
		// 									name={`secondaryInterviewer.[${index}].fullName`}
		// 									type={InputType.TEXT}
		// 									placeholder="Enter Full Name"
		// 									required
		// 									isError={
		// 										!!errors?.secondaryInterviewer?.[index]?.fullName
		// 									}
		// 									errorMsg="please enter the secondary interviewer full name."
		// 								/>
		// 							</div>

		// 							<div className={AddInterviewerStyle.colMd6}>
		// 								<HRInputField
		// 									errorMsg={!!errors?.secondaryInterviewer?.[index]?.emailID && errors?.secondaryInterviewer?.[index]?.emailID.message}											
		// 									register={register}
		// 									label="Interviewer Email"
		// 									validationSchema={{
		// 										required:
		// 											'please enter the secondary interviewer email ID.',
		// 										pattern: {
		// 											value: EmailRegEx.email,
		// 											message:
		// 												'Entered value does not match email format',
		// 										},
		// 										validate: value => {
		// 											if(emailInclude){
		// 												return "Interviewer email id is already in use"
		// 											}
		// 										}
		// 									}}
		// 									name={`secondaryInterviewer.[${index}].emailID`}
		// 									type={InputType.EMAIL}
		// 									placeholder="Enter email"
		// 									required
		// 								/>
		// 							</div>
		// 						</div>
		// 						<div className={AddInterviewerStyle.row}>
		// 							<div className={AddInterviewerStyle.colMd6}>
		// 								<HRInputField
		// 									register={register}
		// 									label="Interviewer Linkedin"
		// 									name={`secondaryInterviewer.[${index}].linkedin`}
		// 									validationSchema={{
		// 										required:
		// 											'please enter secondary interviewer linkedin url.',
		// 											validate: value => {
		// 												if(linkedinInclide){
		// 													return "Interviewer linkedin is already in use"
		// 												}
		// 											}
		// 									}}
		// 									type={InputType.TEXT}
		// 									placeholder="Enter Linkedin Profile"
		// 									required
		// 									isError={
		// 										!!errors?.secondaryInterviewer?.[index]?.linkedin
		// 									}
		// 									errorMsg={!!errors?.secondaryInterviewer?.[index]?.linkedin && errors?.secondaryInterviewer?.[index]?.linkedin.message}
		// 								/>
		// 							</div>

		// 							<div className={AddInterviewerStyle.colMd6}>
		// 								<HRInputField
		// 									register={register}
		// 									label="Interviewer Designation"
		// 									name={`secondaryInterviewer.[${index}].designation`}
		// 									validationSchema={{
		// 										required:
		// 											'please enter secondary interviewer designation.',
		// 									}}
		// 									type={InputType.TEXT}
		// 									placeholder="Enter Designation"
		// 									required
		// 									isError={
		// 										!!errors?.secondaryInterviewer?.[index]?.designation
		// 									}
		// 									errorMsg="please enter the secondary interviewer designation."
		// 								/>
		// 							</div>
		// 						</div>
		// 					</div>
		// 				</div>
					
		// 		);
		// 			// return (
		// 			// 	index !== 0 && (
		// 			// 		<div
		// 			// 			className={AddInterviewerStyle.addInterviewContainer}
		// 			// 			key={`addInterviewer_${index}`}>
		// 			// 			<div className={AddInterviewerStyle.addInterviewLeftPane}>
		// 			// 				<h3>Secondary Interviewer Details - {index}</h3>
		// 			// 				<p>Please provide the necessary details</p>
		// 			// 				{fields.length - 1 === index && (
		// 			// 					<div className={AddInterviewerStyle.leftPanelAction}>
		// 			// 						{fields.length < 3 && (
		// 			// 							<button
		// 			// 								type="button"
		// 			// 								className={AddInterviewerStyle.btnPrimary}
		// 			// 								onClick={onAddSecondaryInterviewer}>
		// 			// 								Add More
		// 			// 							</button>
		// 			// 						)}
		// 			// 						<button
		// 			// 							type="button"
		// 			// 							className={AddInterviewerStyle.btn}
		// 			// 							// onClick={(e) => onRemoveSecondaryInterviewer(e, index)}
		// 			// 							onClick={(e) => {
		// 			// 								return getHRdetails?.secondaryInterviewerlist?.[index]
		// 			// 									?.interviewId
		// 			// 									? reomveSecondaryInterviewAPIHandler(
		// 			// 											e,
		// 			// 											index,
		// 			// 											getHRdetails?.secondaryInterviewerlist?.[index]
		// 			// 												?.interviewId,
		// 			// 											getHRdetails?.secondaryInterviewerlist?.[index]
		// 			// 												?.fullName,
		// 			// 									  )
		// 			// 									: onRemoveSecondaryInterviewer(e, index);
		// 			// 							}}>
		// 			// 							Remove
		// 			// 						</button>
		// 			// 					</div>
		// 			// 				)}
		// 			// 			</div>
		// 			// 			<div className={AddInterviewerStyle.addInterviewRightPane}>
		// 			// 				<div className={AddInterviewerStyle.row}>
		// 			// 					<div className={AddInterviewerStyle.colMd6}>
		// 			// 						<HRInputField
		// 			// 							register={register}
		// 			// 							label="Interviewer Full Name"
		// 			// 							validationSchema={{
		// 			// 								required:
		// 			// 									'please enter the secondary interviewer full name.',
		// 			// 							}}
		// 			// 							name={`secondaryInterviewer.[${index}].fullName`}
		// 			// 							type={InputType.TEXT}
		// 			// 							placeholder="Enter Full Name"
		// 			// 							required
		// 			// 							isError={
		// 			// 								!!errors?.secondaryInterviewer?.[index]?.fullName
		// 			// 							}
		// 			// 							errorMsg="please enter the secondary interviewer full name."
		// 			// 						/>
		// 			// 					</div>

		// 			// 					<div className={AddInterviewerStyle.colMd6}>
		// 			// 						<HRInputField
		// 			// 							errorMsg={!!errors?.secondaryInterviewer?.[index]?.emailID && errors?.secondaryInterviewer?.[index]?.emailID.message}											
		// 			// 							register={register}
		// 			// 							label="Interviewer Email"
		// 			// 							validationSchema={{
		// 			// 								required:
		// 			// 									'please enter the secondary interviewer email ID.',
		// 			// 								pattern: {
		// 			// 									value: EmailRegEx.email,
		// 			// 									message:
		// 			// 										'Entered value does not match email format',
		// 			// 								},
		// 			// 								validate: value => {
		// 			// 									if(emailInclude){
		// 			// 										return "Interviewer email id is already in use"
		// 			// 									}
		// 			// 								}
		// 			// 							}}
		// 			// 							name={`secondaryInterviewer.[${index}].emailID`}
		// 			// 							type={InputType.EMAIL}
		// 			// 							placeholder="Enter email"
		// 			// 							required
		// 			// 						/>
		// 			// 					</div>
		// 			// 				</div>
		// 			// 				<div className={AddInterviewerStyle.row}>
		// 			// 					<div className={AddInterviewerStyle.colMd6}>
		// 			// 						<HRInputField
		// 			// 							register={register}
		// 			// 							label="Interviewer Linkedin"
		// 			// 							name={`secondaryInterviewer.[${index}].linkedin`}
		// 			// 							validationSchema={{
		// 			// 								required:
		// 			// 									'please enter secondary interviewer linkedin url.',
		// 			// 									validate: value => {
		// 			// 										if(linkedinInclide){
		// 			// 											return "Interviewer linkedin is already in use"
		// 			// 										}
		// 			// 									}
		// 			// 							}}
		// 			// 							type={InputType.TEXT}
		// 			// 							placeholder="Enter Linkedin Profile"
		// 			// 							required
		// 			// 							isError={
		// 			// 								!!errors?.secondaryInterviewer?.[index]?.linkedin
		// 			// 							}
		// 			// 							errorMsg={!!errors?.secondaryInterviewer?.[index]?.linkedin && errors?.secondaryInterviewer?.[index]?.linkedin.message}
		// 			// 						/>
		// 			// 					</div>

		// 			// 					<div className={AddInterviewerStyle.colMd6}>
		// 			// 						<HRInputField
		// 			// 							register={register}
		// 			// 							label="Interviewer Designation"
		// 			// 							name={`secondaryInterviewer.[${index}].designation`}
		// 			// 							validationSchema={{
		// 			// 								required:
		// 			// 									'please enter secondary interviewer designation.',
		// 			// 							}}
		// 			// 							type={InputType.TEXT}
		// 			// 							placeholder="Enter Designation"
		// 			// 							required
		// 			// 							isError={
		// 			// 								!!errors?.secondaryInterviewer?.[index]?.designation
		// 			// 							}
		// 			// 							errorMsg="please enter the secondary interviewer designation."
		// 			// 						/>
		// 			// 					</div>
		// 			// 				</div>
		// 			// 			</div>
		// 			// 		</div>
		// 			// 	)
		// 			// );
		// 		})
		// 	);
		// } else
		// 	return fields?.map((_, index) => {
		// 		let allEmails = [watch('interviewerEmail')]
		// 		let allLinkedinIDs = [watch('interviewerLinkedin')]
		// 		fields.forEach((_, emailindex) => {
		// 		 if(emailindex !== index) {
		// 			allEmails.push(watch(`secondaryInterviewer.[${emailindex}].emailID`)) 
		// 			allLinkedinIDs.push(watch(`secondaryInterviewer.[${emailindex}].linkedin`))
		// 		} 
		// 		})

		// 		let emailInclude = allEmails.includes( watch(`secondaryInterviewer.[${index}].emailID`))
		// 		let linkedinInclide = allLinkedinIDs.includes(watch(`secondaryInterviewer.[${index}].linkedin`))
		// 		return (
		// 			<div
		// 				className={AddInterviewerStyle.addInterviewContainer}
		// 				key={`addInterviewer_${index}`}>
		// 				<div className={AddInterviewerStyle.addInterviewLeftPane}>
		// 					<h3>Secondary Interviewer Details - {index + 1}</h3>
		// 					<p>Please provide the necessary details</p>
		// 					{fields.length - 1 === index && (
		// 						<div className={AddInterviewerStyle.leftPanelAction}>
		// 							{fields.length < 3 && (
		// 								<button
		// 									type="button"
		// 									className={AddInterviewerStyle.btnPrimary}
		// 									onClick={onAddSecondaryInterviewer}>
		// 									Add More
		// 								</button>
		// 							)}
		// 							<button
		// 								type="button"
		// 								className={AddInterviewerStyle.btn}
		// 								onClick={(e) => onRemoveSecondaryInterviewer(e, index)}>
		// 								Remove
		// 							</button>
		// 						</div>
		// 					)}
		// 				</div>
		// 				<div className={AddInterviewerStyle.addInterviewRightPane}>
		// 					<div className={AddInterviewerStyle.row}>
		// 						<div className={AddInterviewerStyle.colMd6}>
		// 							<HRInputField
		// 								register={register}
		// 								label="Interviewer Full Name"
		// 								validationSchema={{
		// 									required:
		// 										'please enter the secondary interviewer full name.',
		// 								}}
		// 								name={`secondaryInterviewer.[${index}].fullName`}
		// 								type={InputType.TEXT}
		// 								placeholder="Enter Full Name"
		// 								required
		// 								isError={!!errors?.secondaryInterviewer?.[index]?.fullName}
		// 								errorMsg="please enter the secondary interviewer full name."
		// 							/>
		// 						</div>

		// 						<div className={AddInterviewerStyle.colMd6}>
		// 							<HRInputField
		// 								isError={!!errors?.secondaryInterviewer?.[index]?.emailID}
		// 								errorMsg={!!errors?.secondaryInterviewer?.[index]?.emailID && errors?.secondaryInterviewer?.[index]?.emailID.message}
		// 								register={register}
		// 								label="Interviewer Email"
		// 								validationSchema={{
		// 									required:
		// 										'please enter the secondary interviewer email ID.',
		// 									pattern: {
		// 										value: EmailRegEx.email,
		// 										message: 'Entered value does not match email format',
		// 									},
		// 									validate: value => {
		// 										if(emailInclude){
		// 											return "Interviewer email id is already in use"
		// 										}
		// 									}
		// 								}}
		// 								name={`secondaryInterviewer.[${index}].emailID`}
		// 								type={InputType.EMAIL}
		// 								placeholder="Enter email"
		// 								required
		// 							/>
		// 						</div>
		// 					</div>
		// 					<div className={AddInterviewerStyle.row}>
		// 						<div className={AddInterviewerStyle.colMd6}>
		// 							<HRInputField
		// 								register={register}
		// 								label="Interviewer Linkedin"
		// 								name={`secondaryInterviewer.[${index}].linkedin`}
		// 								validationSchema={{
		// 									required:
		// 										'please enter secondary interviewer linkedin url.',
		// 									validate: value => {
		// 											if(linkedinInclide){
		// 												return "Interviewer linkedin is already in use"
		// 											}
		// 										}
		// 								}}
		// 								type={InputType.TEXT}
		// 								placeholder="Enter Linkedin Profile"
		// 								required
		// 								isError={!!errors?.secondaryInterviewer?.[index]?.linkedin}
		// 								errorMsg={!!errors?.secondaryInterviewer?.[index]?.linkedin && errors?.secondaryInterviewer?.[index]?.linkedin.message}
		// 							/>
		// 						</div>

		// 						<div className={AddInterviewerStyle.colMd6}>
		// 							<HRInputField
		// 								register={register}
		// 								label="Interviewer Designation"
		// 								name={`secondaryInterviewer.[${index}].designation`}
		// 								validationSchema={{
		// 									required:
		// 										'please enter secondary interviewer designation.',
		// 								}}
		// 								type={InputType.TEXT}
		// 								placeholder="Enter Designation"
		// 								required
		// 								isError={
		// 									!!errors?.secondaryInterviewer?.[index]?.designation
		// 								}
		// 								errorMsg="please enter the secondary interviewer designation."
		// 							/>
		// 						</div>
		// 					</div>
		// 				</div>
		// 			</div>
		// 		);
		// 	});
	};
	return (
		<div>
			<div className={AddInterviewerStyle.addInterviewContainer}>
				<div className={AddInterviewerStyle.addInterviewLeftPane}>
					<h3>Interviewer Details</h3>
					<p>Please provide the necessary details</p>
					{addInterviewerBasedOnIsCloned()}
				</div>
				<div className={AddInterviewerStyle.addInterviewRightPane}>
					<div className={AddInterviewerStyle.row}>
						<div className={AddInterviewerStyle.colMd6}>
							<HRInputField
								// disabled={!_isNull(interviewDetails.fullName)}
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
								// disabled={!_isNull(interviewDetails.emailId)}
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
								// disabled={!_isNull(interviewDetails.linkedin)}
								register={register}
								label="Interviewer Linkedin"
								name="interviewerLinkedin"
								type={InputType.TEXT}
								placeholder="Enter Linkedin Profile"
								errors={errors}
								validationSchema={{
									required: 'please enter the primary interviewer linkedin.',
									// pattern: {
									// 	value: URLRegEx.url,
									// 	message: 'Entered value does not match url format',
									// },
								}}
								required
							/>
						</div>

						<div className={AddInterviewerStyle.colMd6}>
							<HRInputField
								// disabled={!_isNull(interviewDetails.designation)}
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
			{getSecondaryInterviewFieldsBasedOnIsCloned()}
		</div>
	);
};

export default AddInterviewer;
