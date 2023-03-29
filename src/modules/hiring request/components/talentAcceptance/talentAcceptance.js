import { Radio } from 'antd';
import TalentAcceptanceStyle from './talentAcceptance.module.css';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { useState } from 'react';
import { ReactComponent as NextArrowSVG } from 'assets/svg/nextArrow.svg';
const TalentAcceptance = ({
	talentName,
	hiringRequestNumber,
	starMarkedStatusCode,
	HRStatusCode,
	hrStatus,
	closeModal,
}) => {
	const [value, setRadioValue] = useState(1);
	const onChange = (e) => {
		console.log('radio checked', e.target.value);
		setRadioValue(e.target.value);
	};
	return (
		<div className={TalentAcceptanceStyle.container}>
			<div className={TalentAcceptanceStyle.modalTitle}>
				<h2>Talent Acceptance</h2>
			</div>
			<div className={TalentAcceptanceStyle.panelBody}>
				<div className={TalentAcceptanceStyle.rightPane}>
					<div className={TalentAcceptanceStyle.whitep16}>
						<div className={TalentAcceptanceStyle.row}>
							<div className={TalentAcceptanceStyle.colMd5}>
								<div className={TalentAcceptanceStyle.transparentTopCard}>
									<div className={TalentAcceptanceStyle.cardLabel}>
										HR ID - {'  '}
									</div>
									<div className={TalentAcceptanceStyle.cardLabel}>
										{'  '}
										{hiringRequestNumber}
									</div>
								</div>
							</div>
							<div className={TalentAcceptanceStyle.colMd5}>
								<div className={TalentAcceptanceStyle.transparentTopCard}>
									<div className={TalentAcceptanceStyle.cardLabel}>
										Talent -{' '}
									</div>
									<div className={TalentAcceptanceStyle.cardLabel}>
										{talentName}
									</div>
								</div>
							</div>
							<div className={TalentAcceptanceStyle.colMd5}>
								<div className={TalentAcceptanceStyle.transparentTopCard}>
									<div className={TalentAcceptanceStyle.cardLabel}>
										Company -{' '}
									</div>
									<div className={TalentAcceptanceStyle.cardLabel}>
										{talentName}
									</div>
								</div>
							</div>
							<div className={TalentAcceptanceStyle.colMd5}>
								<div className={TalentAcceptanceStyle.transparentTopCard}>
									<div className={TalentAcceptanceStyle.cardLabel}>Role - </div>
									<div className={TalentAcceptanceStyle.cardLabel}>
										{talentName}
									</div>
								</div>
							</div>

							<div className={TalentAcceptanceStyle.statusPart}>
								<div className={TalentAcceptanceStyle.hiringRequestPriority}>
									{All_Hiring_Request_Utils.GETHRPRIORITY(starMarkedStatusCode)}
								</div>
								<div className={TalentAcceptanceStyle.c}>
									{All_Hiring_Request_Utils.GETHRSTATUS(HRStatusCode, hrStatus)}
								</div>
							</div>
						</div>
					</div>
					<p className={TalentAcceptanceStyle.info}>
						The following are your preferences, if you confirm them we will
						proceed with an interview.
					</p>
					<div className={TalentAcceptanceStyle.whitep16}>
						<form id="talentAcceptance">
							<div className={TalentAcceptanceStyle.row}>
								<div className={TalentAcceptanceStyle.rowBody}>
									<div className={TalentAcceptanceStyle.flex}>
										<NextArrowSVG
											height={'20px'}
											width={'20px'}
										/>
										<div className={TalentAcceptanceStyle.colMd12}>
											<div
												className={TalentAcceptanceStyle.radioFormGroup}
												style={{
													display: 'flex',
													flexDirection: 'column',
												}}>
												<label>
													You will be required to work full shifts - 9:00 AM to
													5:00 PM EST. Will you agree to this schedule?
												</label>

												<Radio.Group
													className={TalentAcceptanceStyle.radioGroup}
													onChange={onChange}
													value={value}>
													<Radio value={1}>Yes, I agree.</Radio>
												</Radio.Group>
											</div>
										</div>
									</div>
									<div className={TalentAcceptanceStyle.flex}>
										<NextArrowSVG
											height={'20px'}
											width={'20px'}
										/>
										<div className={TalentAcceptanceStyle.colMd12}>
											<div
												className={TalentAcceptanceStyle.radioFormGroup}
												style={{
													display: 'flex',
													flexDirection: 'column',
												}}>
												<label>
													Your joining date must be within 15 days to accept
													this offer. Please update or accept a join date of
													more than 60 days in order to maintain your
													preferences on the system.
												</label>

												<Radio.Group
													className={TalentAcceptanceStyle.radioGroup}
													onChange={onChange}
													value={value}>
													<Radio value={1}>
														Yes, please update it to 15 Days from existing only
														for this position.
													</Radio>
													<Radio value={2}>
														Yes, please update it to 15 Days from my current
														preference for this position and for future as well.
													</Radio>
													<Radio value={3}>
														No, I want to keep it more than 60 days
													</Radio>
												</Radio.Group>
											</div>
										</div>
									</div>
									<div className={TalentAcceptanceStyle.flex}>
										<NextArrowSVG
											height={'20px'}
											width={'20px'}
										/>
										<div className={TalentAcceptanceStyle.colMd12}>
											<div
												className={TalentAcceptanceStyle.radioFormGroup}
												style={{
													display: 'flex',
													flexDirection: 'column',
												}}>
												<label>
													Does this full-time position suit your stated
													preferences?
												</label>

												<Radio.Group
													className={TalentAcceptanceStyle.radioGroup}
													onChange={onChange}
													value={value}>
													<Radio value={1}>
														Yes, I am interested in this position and would like
														to move forward with the application.
													</Radio>
													<Radio value={2}>
														No, I am not interested in this position as it
														doesn’t match with my preferences.
													</Radio>
												</Radio.Group>
											</div>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
					<div className={TalentAcceptanceStyle.notes}>
						<ul>
							<li>
								Once you accept an offer, there are no further chances to back
								out.
							</li>
							<li>
								After accepting this job, you may not work with or approach the
								client for six months
							</li>
						</ul>
					</div>
					<div className={TalentAcceptanceStyle.formPanelAction}>
						<button
							// disabled={isLoading}
							type="submit"
							// onClick={handleSubmit(reScheduleInterviewAPIHandler)}
							className={TalentAcceptanceStyle.btnPrimary}>
							Save Preference and Apply
						</button>
						<button
							// disabled={type === SubmitType.SAVE_AS_DRAFT}
							onClick={() => {
								closeModal();
							}}
							className={TalentAcceptanceStyle.btn}>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TalentAcceptance;
