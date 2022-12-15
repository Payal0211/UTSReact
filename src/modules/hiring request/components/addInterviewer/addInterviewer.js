import { InputType } from 'constants/application';
import { useState } from 'react';
import HRInputField from '../hrInputFields/hrInputFields';
import AddInterviewerStyle from './addInterviewer.module.css';

const AddInterviewer = () => {
	const [countInterviewer, setCountInterviewer] = useState([]);
	/**Add Secondary Items4 */
	const onAddSecondaryInterviewer = (e) => {
		e.preventDefault();
		setCountInterviewer([...countInterviewer, countInterviewer.length + 1]);
	};

	return (
		<div className={AddInterviewerStyle.addInterviewContainer}>
			<div className={AddInterviewerStyle.addInterviewLeftPane}>
				<h3>Interview Details</h3>
				<p>Please provide the necessary details</p>
				<button
					className={AddInterviewerStyle.addInterviewer}
					onClick={onAddSecondaryInterviewer}>
					Add Interviewer
				</button>
			</div>
			<div className={AddInterviewerStyle.addInterviewRightPane}>
				<div className={AddInterviewerStyle.row}>
					<div className={AddInterviewerStyle.colMd6}>
						<HRInputField
							label="Interviewer Full Name *"
							name="interviewerFullName"
							type={InputType.TEXT}
							placeholder="Enter Full Name"
						/>
					</div>

					<div className={AddInterviewerStyle.colMd6}>
						<HRInputField
							label="Interviewer Email *"
							name="interviewerEmail"
							type={InputType.EMAIL}
							placeholder="Enter email"
						/>
					</div>
				</div>
				<div className={AddInterviewerStyle.row}>
					<div className={AddInterviewerStyle.colMd6}>
						<HRInputField
							label="Interviewer Linkedin *"
							name="interviewerLinkedin"
							type={InputType.TEXT}
							placeholder="Enter Linkedin Profile"
						/>
					</div>

					<div className={AddInterviewerStyle.colMd6}>
						<HRInputField
							label="Interviewer Designation *"
							name="interviewerDesignation"
							type={InputType.TEXT}
							placeholder="Enter Designation"
						/>
					</div>
				</div>
				{countInterviewer?.map((item, index) => {
					return (
						<div
							className={AddInterviewerStyle.secondaryInterviewer}
							key={`secondary ${index}`}>
							<div className={AddInterviewerStyle.row}>
								<div className={AddInterviewerStyle.colMd6}>
									<HRInputField
										label="Interviewer Full Name *"
										name="interviewerFullName"
										type={InputType.TEXT}
										placeholder="Enter Full Name"
									/>
								</div>

								<div className={AddInterviewerStyle.colMd6}>
									<HRInputField
										label="Interviewer Email *"
										name="interviewerEmail"
										type={InputType.EMAIL}
										placeholder="Enter email"
									/>
								</div>
							</div>
							<div className={AddInterviewerStyle.row}>
								<div className={AddInterviewerStyle.colMd6}>
									<HRInputField
										label="Interviewer Linkedin *"
										name="interviewerLinkedin"
										type={InputType.TEXT}
										placeholder="Enter Linkedin Profile"
									/>
								</div>

								<div className={AddInterviewerStyle.colMd6}>
									<HRInputField
										label="Interviewer Designation *"
										name="interviewerDesignation"
										type={InputType.TEXT}
										placeholder="Enter Designation"
									/>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default AddInterviewer;
