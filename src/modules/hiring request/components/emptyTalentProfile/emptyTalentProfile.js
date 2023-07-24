import { Modal, Skeleton, message, Collapse, Checkbox } from 'antd';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import emptyTalentProfileStyle from './emptyTalentProfile.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import HRInputField from '../hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';
import { InputType } from 'constants/application';
import HRSelectField from '../hrSelectField/hrSelectField';
import { ReactComponent as AccordionPlusSVG } from 'assets/svg/accordionPlus.svg';
import { ReactComponent as AccordionMinusSVG } from 'assets/svg/accordionMinus.svg';

const MatchmakingModal = React.lazy(() =>
	import('modules/hiring request/components/matchmaking/matchmaking'),
);
const EmptyTalentProfile = ({ talentLength }) => {
	const {
		watch,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({});
	const { Panel } = Collapse;
	const [isLoading, setLoading] = useState(false);
	const switchLocation = useLocation();
	const navigate = useNavigate();
	let urlSplitter = `${switchLocation.pathname.split('/')[2]}`;
	const updatedSplitter = 'HR' + urlSplitter?.split('HR')[1];
	const [apiData, setAPIdata] = useState([]);
	const callAPI = useCallback(
		async (hrid) => {
			setLoading(true);
			let response = await hiringRequestDAO.getViewHiringRequestDAO(hrid);

			if (response.statusCode === HTTPStatusCode.OK) {
				setAPIdata(response && response?.responseBody);
				setLoading(false);
			} else if (response.statusCode === HTTPStatusCode.NOT_FOUND) {
				navigate(UTSRoutes.PAGENOTFOUNDROUTE);
			}
		},
		[navigate],
	);
	useEffect(() => {
		setLoading(true);
		callAPI(urlSplitter?.split('HR')[0]);
	}, [urlSplitter, callAPI]);

	const [matchmakingData, setMatchmakingData] = useState(false);

	const customExpandIcon = ({ isActive }) => {
		return isActive ? (
			<AccordionMinusSVG width="16" height="14" />
		) : (
			<AccordionPlusSVG width="16" height="16" />
		);
	};

	return (
		<div className={emptyTalentProfileStyle.emptyContainer}>
			<div className={emptyTalentProfileStyle.emptyContainerBody}>
				<div className={emptyTalentProfileStyle.noProfileSelected}>
					<h3>No Profiles Selected</h3>
				</div>
				<div>
					<p>Please select a profile that best matches this hiring request</p>
				</div>
				{/* <div className={emptyTalentProfileStyle.exploreMore}>
					<Suspense>
						<MatchmakingModal
							refreshedHRDetail={callAPI}
							talentLength={talentLength}
							hrID={urlSplitter?.split('HR')[0]}
							hrNo={updatedSplitter}
							hrStatusCode={apiData?.HRStatusCode}
							hrStatus={apiData?.HRStatus}
							hrPriority={apiData?.StarMarkedStatusCode}
						/>
					</Suspense>
				</div> */}
				{/* <button onClick={() => setMatchmakingData(true)} className={emptyTalentProfileStyle.exploreMore}>Explore Profiles</button> */}
				<Modal
					transitionName=""
					className="matchMakingModal"
					centered
					open={matchmakingData}
					width="864px"
					footer={null}
					onCancel={() => {
						// setIsLoading(false);
						setMatchmakingData(false);
					}}>
					{/* HTML code for 'Convert to Direct Placement Modal' - Starts */}
					{/* <div className={emptyTalentProfileStyle.modalInnerWrapper}>
						<div className={emptyTalentProfileStyle.modalLabel}>Convert to Direct Placement</div>
						<div className={emptyTalentProfileStyle.modalLabelMsg}>Please add necessary details for converting this HR from Contractual to  Direct Placement</div>

						<div className={emptyTalentProfileStyle.modalFormWrapper}>
							<div className={emptyTalentProfileStyle.modalFormCol}>
								<HRInputField
									register={register}
									errors={errors}
									label="DP Percentage"
									name="DpPercentage"
									type={InputType.TEXT}
									placeholder="Enter Percentage"
									required
								/>
							</div>

							<div className={emptyTalentProfileStyle.modalFormCol}>
								<HRSelectField
									isControlled={true}
									mode="id/value"
									setValue={setValue}
									register={register}
									label={'Mode of Working'}
									defaultValue={'Select'}
									name="Mode of Working"
									isError={errors['departMent'] && errors['departMent']}
									required
									errorMsg={'Please select department'}
								/>
							</div>
							<div className={emptyTalentProfileStyle.modalFormCol}>
								<HRSelectField
									isControlled={true}
									mode="id/value"
									setValue={setValue}
									register={register}
									label={'Country'}
									defaultValue={'Select'}
									name="Country"
									isError={errors['departMent'] && errors['departMent']}
									required
									errorMsg={'Please select department'}
								/>
							</div>
							<div className={emptyTalentProfileStyle.modalFormCol}>
								<HRSelectField
									isControlled={true}
									mode="id/value"
									setValue={setValue}
									register={register}
									label={'State'}
									defaultValue={'Select'}
									name="State"
									isError={errors['departMent'] && errors['departMent']}
									required
									errorMsg={'Please select department'}
								/>
							</div>
						</div>

						<div className={emptyTalentProfileStyle.formPanelAction}>
							<button className={emptyTalentProfileStyle.btn}>Cancel</button>
							<button type="submit" className={emptyTalentProfileStyle.btnPrimary}>Convert to DP</button>
						</div>
					</div> */}
					{/* HTML code for 'Convert to Direct Placement Modal' - Ends */}

					{/* HTML code for 'Matchmake Talent' - Starts */}
					<div className={emptyTalentProfileStyle.modalInnerWrapper}>
						<div className={emptyTalentProfileStyle.modalLabel}>Matchmake Talent</div>
						<div className={emptyTalentProfileStyle.modalLabelMsg}>Please add necessary details of Talents to Matchmake</div>

						<Collapse accordion bordered={false} expandIconPosition="end" expandIcon={customExpandIcon}>
							<Panel
								header="Ammanaveni Raghuvanshi"
								key="0"
								extra={<Checkbox className={emptyTalentProfileStyle.talentCheckbox}></Checkbox>}>
								<div className={emptyTalentProfileStyle.modalFormWrapper}>
									<div className={emptyTalentProfileStyle.modalFormCol}>
										<HRInputField
											register={register}
											errors={errors}
											label="Talent Current CTC / Year (USD)"
											name="Talent Current CTC / Year (USD)"
											type={InputType.TEXT}
											placeholder="Ex: 6,00,000.00"
											required
										/>
									</div>

									<div className={emptyTalentProfileStyle.modalFormCol}>
										<HRInputField
											register={register}
											errors={errors}
											label="Talent Expected CTC / Year (USD)"
											name="Talent Expected CTC / Year (USD)"
											type={InputType.TEXT}
											placeholder="Ex: 6,00,000.00"
											required
										/>
									</div>

									<div className={emptyTalentProfileStyle.modalFormCol}>
										<HRInputField
											register={register}
											errors={errors}
											label="DP Percentage"
											name="DP Percentage"
											type={InputType.TEXT}
											placeholder="Ex: 10%"
											required
										/>
									</div>

									<div className={emptyTalentProfileStyle.modalFormCol}>
										<HRInputField
											register={register}
											errors={errors}
											label="DP Amount (USD)"
											name="DP Amount (USD)"
											type={InputType.TEXT}
											placeholder="Ex: 6,00,000.00"
											required
										/>
									</div>
								</div>
							</Panel>

							<Panel
								header="Meenal G Madish"
								key="1"
								extra={<Checkbox className={emptyTalentProfileStyle.talentCheckbox}></Checkbox>}>
								<div className={emptyTalentProfileStyle.modalFormWrapper}>
									<div className={emptyTalentProfileStyle.modalFormCol}>
										<HRInputField
											register={register}
											errors={errors}
											label="Talent Current CTC / Year (USD)"
											name="Talent Current CTC / Year (USD)"
											type={InputType.TEXT}
											placeholder="Ex: 6,00,000.00"
											required
										/>
									</div>

									<div className={emptyTalentProfileStyle.modalFormCol}>
										<HRInputField
											register={register}
											errors={errors}
											label="Talent Expected CTC / Year (USD)"
											name="Talent Expected CTC / Year (USD)"
											type={InputType.TEXT}
											placeholder="Ex: 6,00,000.00"
											required
										/>
									</div>

									<div className={emptyTalentProfileStyle.modalFormCol}>
										<HRInputField
											register={register}
											errors={errors}
											label="DP Percentage"
											name="DP Percentage"
											type={InputType.TEXT}
											placeholder="Ex: 10%"
											required
										/>
									</div>

									<div className={emptyTalentProfileStyle.modalFormCol}>
										<HRInputField
											register={register}
											errors={errors}
											label="DP Amount (USD)"
											name="DP Amount (USD)"
											type={InputType.TEXT}
											placeholder="Ex: 6,00,000.00"
											required
										/>
									</div>
								</div>
							</Panel>

							<Panel
								header="Hawalchi Aziz"
								key="2"
								extra={<Checkbox className={emptyTalentProfileStyle.talentCheckbox}></Checkbox>}>
								<div className={emptyTalentProfileStyle.modalFormWrapper}>
									<div className={emptyTalentProfileStyle.modalFormCol}>
										<HRInputField
											register={register}
											errors={errors}
											label="Talent Current CTC / Year (USD)"
											name="Talent Current CTC / Year (USD)"
											type={InputType.TEXT}
											placeholder="Ex: 6,00,000.00"
											required
										/>
									</div>

									<div className={emptyTalentProfileStyle.modalFormCol}>
										<HRInputField
											register={register}
											errors={errors}
											label="Talent Expected CTC / Year (USD)"
											name="Talent Expected CTC / Year (USD)"
											type={InputType.TEXT}
											placeholder="Ex: 6,00,000.00"
											required
										/>
									</div>

									<div className={emptyTalentProfileStyle.modalFormCol}>
										<HRInputField
											register={register}
											errors={errors}
											label="DP Percentage"
											name="DP Percentage"
											type={InputType.TEXT}
											placeholder="Ex: 10%"
											required
										/>
									</div>

									<div className={emptyTalentProfileStyle.modalFormCol}>
										<HRInputField
											register={register}
											errors={errors}
											label="DP Amount (USD)"
											name="DP Amount (USD)"
											type={InputType.TEXT}
											placeholder="Ex: 6,00,000.00"
											required
										/>
									</div>
								</div>
							</Panel>
						</Collapse>

						<div className={emptyTalentProfileStyle.formPanelAction}>
							<button className={emptyTalentProfileStyle.btn}>Cancel</button>
							<button type="submit" className={emptyTalentProfileStyle.btnPrimary}>Save and Proceed</button>
						</div>
					</div>
					{/* HTML code for 'Matchmake Talent' - Ends */}
				</Modal>
			</div>
		</div>
	);
};

export default EmptyTalentProfile;
