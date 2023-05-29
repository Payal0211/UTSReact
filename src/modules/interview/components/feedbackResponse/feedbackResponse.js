import { Divider } from 'antd';
import FeedbackResponseModule from './feedbackResponse.module.css';
const FeedbackResponse = () => {
	return (
		<div className={FeedbackResponseModule.feedbackContainer}>
			<br />
			<div className={FeedbackResponseModule.feedbackContainerBody}>
				<div className={FeedbackResponseModule.convertModalTitle}>
					<h2>Suninda Solutions Pvt. Ltd.</h2>
					<ul>
						<li>
							<span>CLient Name: XYZ</span>
						</li>
						<li className={FeedbackResponseModule.divider}>|</li>
						<li>
							<span>HR ID:</span>
							{/* {getFeedbackFormContent?.engagemenID} */}
						</li>
						<li className={FeedbackResponseModule.divider}>|</li>
						<li>
							<span>Status:</span> Rejected
							{/* {getFeedbackFormContent?.talentName} */}
						</li>
					</ul>
				</div>
				<Divider />
				<div className={FeedbackResponseModule.feedbackPanel}>
					<div className={FeedbackResponseModule.feedbackPanelBody}>
						<p>Would you like to proceed with the hiring of this talent?</p>
						<h3>The candidate is a good fit for the job position.</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FeedbackResponse;
