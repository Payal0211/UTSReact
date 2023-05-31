import { Divider } from 'antd';
import FeedbackResponseModule from './feedbackResponse.module.css';
import { useCallback, useEffect, useState } from 'react';
import { InterviewDAO } from 'core/interview/interviewDAO';
import { InterviewFeedbackStatus } from 'constants/application';
const FeedbackResponse = ({ talentInfo, clientDetail }) => {
	const [feedbackDetails, setFeedbackDetails] = useState(null);
	const getClientFeedbackHandler = useCallback(async () => {
		const response = await InterviewDAO.getClientFeedbackRequestDAO({
			clientFeedbackID: talentInfo?.ClientFeedbackID,
		});
		setFeedbackDetails(response?.responseBody?.details);
	}, [talentInfo?.ClientFeedbackID]);

	useEffect(() => {
		getClientFeedbackHandler();
	}, [getClientFeedbackHandler]);

	return (
		<div
			className={
				talentInfo?.ClientFeedback === InterviewFeedbackStatus.HIRED
					? FeedbackResponseModule.feedbackHiredContainer
					: talentInfo?.ClientFeedback === InterviewFeedbackStatus.REJECTED
					? FeedbackResponseModule.feedbackRejectedontainer
					: FeedbackResponseModule.feedbackContainer
			}>
			<br />
			<div className={FeedbackResponseModule.feedbackContainerBody}>
				<div className={FeedbackResponseModule.convertModalTitle}>
					<h2>{clientDetail?.CompanyName}</h2>
					<ul>
						<li>
							<span>Client Name: {clientDetail?.ClientName}</span>
						</li>
						<li className={FeedbackResponseModule.divider}>|</li>
						<li>
							<span>HR ID:</span> {clientDetail?.HR_Number}
						</li>
						<li className={FeedbackResponseModule.divider}>|</li>
						<li>
							<span>Status:</span> {talentInfo?.ClientFeedback || 'NA'}
						</li>
					</ul>
				</div>
				<Divider />
				<div className={FeedbackResponseModule.feedbackPanel}>
					<div className={FeedbackResponseModule.feedbackPanelBody}>
						<div>
							<p>Would you like to proceed with the hiring of this talent?</p>
							<h3>{feedbackDetails?.hdnRadiovalue}</h3>
						</div>
						<br />
						<div>
							<p>
								How would you rate this talent in terms of technical skills
								required for {talentInfo?.TalentRole}?
							</p>
							<h3>{feedbackDetails?.technicalSkillRating}</h3>
						</div>
						<br />
						<div>
							<p>
								How would you rate this talent in terms of Communication skills
								required for {talentInfo?.TalentRole}?
							</p>
							<h3>{feedbackDetails?.communicationSkillRating}</h3>
						</div>
						<br />
						<div>
							<p>
								How would you rate this talent in terms of the Cognitive skills
								required for {talentInfo?.TalentRole}?
							</p>
							<h3>{feedbackDetails?.cognitiveSkillRating}</h3>
						</div>
						<br />
					</div>
					<div>
						<p>Any Feedback you want to share straight to the talent?</p>
						<h3>{feedbackDetails?.comments || 'NA'}</h3>
					</div>
					<br />
				</div>
			</div>
		</div>
	);
};

export default FeedbackResponse;
