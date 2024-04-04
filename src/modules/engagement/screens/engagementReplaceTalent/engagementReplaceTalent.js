import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import allengagementReplceTalentStyles from '../engagementBillAndPayRate/engagementBillRate.module.css';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { Modal, Radio, Skeleton } from 'antd';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import { HTTPStatusCode } from 'constants/network';
import { Link } from 'react-router-dom';
const EngagementReplaceTalent = ({
	talentInfo,
	hrId,
	callAPI,
	closeModal,
	isEngagement,
	engagementListHandler,
}) => {
	const [getTalentReplacementData, setTalentReplacementData] = useState([]);

	/*--------- antd Radio ---------------- */

	const [getRadio, setRadio] = useState('client');
	const [isLoading, setIsLoading] = useState(false)
	const [newHRModal,setNewHrModal] = useState(false)
	const [newHRDetails , setNewHRDetails] = useState({})
	const {
		register,
		unregister,
		handleSubmit,
		setValue,
		control,
		setError,
		getValues,
		watch,
		reset,
		resetField,
		formState: { errors },
	} = useForm();

	const onSlotChange = (e) => {
		setRadio(e.target.value);
	};

	const getReplaceTalentInfoHandler = useCallback(async () => {
		const response =
			await engagementRequestDAO.replaceTalentEngagementRequestDAO(
				isEngagement
					? {
							ID: talentInfo?.onboardID,
					  }
					: {
							ID: talentInfo?.OnBoardId,
					  },
				isEngagement,
			);

		if (response?.statusCode === HTTPStatusCode.OK) {
			setTalentReplacementData(response && response?.responseBody?.details);
			setValue(
				'nbdName',
				response?.responseBody?.details?.replacementHandledName,
			);
		}
	}, [isEngagement, setValue, talentInfo?.OnBoardId, talentInfo?.onboardID]);

	useEffect(() => {
		if(watch("replaceStage")?.id === 1){
			setValue('lastWorkingDate', new Date())
		}else{
			unregister('lastWorkingDate')
		}
	},[watch("replaceStage"), setValue,unregister])

	// console.log({getTalentReplacementData,talentInfo})
	const CreateReplaceHR =async ()=>{
		// console.log('payload to create',{HrID:hrId || getTalentReplacementData?.onBoardTalents?.hiringRequestId
		// 	,OnBoardID: talentInfo?.onboardID || talentInfo?.OnBoardId})
			const response = await engagementRequestDAO.createReplaceHRRequestDAO(
				{HrID:hrId || getTalentReplacementData?.onBoardTalents?.hiringRequestId
						,OnBoardID: talentInfo?.onboardID || talentInfo?.OnBoardId}
			);

			if (response?.statusCode === HTTPStatusCode.OK) {
			// console.log(response)
			setNewHrModal(true)
			setNewHRDetails(response?.responseBody?.details)
			}
			setIsLoading(false)
	}


	const submitTalentReplacementHandler = useCallback(
		async (d) => {
			setIsLoading(true)
			let talentReplacementDetails = {
				onboardId: talentInfo?.onboardID || talentInfo?.OnBoardId,
				replacementID:
					hrId || getTalentReplacementData?.onBoardTalents?.hiringRequestId,
				talentId: talentInfo?.talentID || talentInfo?.TalentID,
				lastWorkingDay: new Date(d.lastWorkingDate).toLocaleDateString('en-US'),
				lastWorkingDateOption: d.replaceStage?.id,
				noticePeriod: 0,
				replacementStage: d.replaceStage?.value,
				reasonforReplacemenxt: d.reasonForReplacement,
				replacementInitiatedby: getRadio,
				replacementHandledByID:
					getTalentReplacementData?.replacementHandledByID,
				engagementReplacementOnBoardID: 0,
				replacementTalentId: null,
			};

			const response = await engagementRequestDAO.saveTalentReplacementDAO(
				talentReplacementDetails,
			);
			if (response?.statusCode === HTTPStatusCode.OK) {
				return CreateReplaceHR()
				// if (isEngagement === true) {
				// 	closeModal();
				// 	engagementListHandler();
				// } else {
				// 	callAPI(hrId);
				// }
				
			}
			setIsLoading(false)
		},
		[
			callAPI,
			closeModal,
			engagementListHandler,
			getRadio,
			getTalentReplacementData?.onBoardTalents?.hiringRequestId,
			getTalentReplacementData?.replacementHandledByID,
			hrId,
			isEngagement,
			talentInfo?.OnBoardId,
			talentInfo?.onboardID,
			talentInfo?.talentID,
		],
	);

	useEffect(() => {
		getReplaceTalentInfoHandler();
	}, [getReplaceTalentInfoHandler]);

	const manageNewHRClose  = () =>{
		setNewHrModal(false)
		setNewHRDetails({})
		if (isEngagement === true) {
			closeModal();
			engagementListHandler();
		} else {
			callAPI(hrId);
		}
	} 

	return (
		<div className={allengagementReplceTalentStyles.engagementModalContainer}>
			<div
				className={`${allengagementReplceTalentStyles.headingContainer} ${allengagementReplceTalentStyles.replaceTalentWrapper}`}>
				<h1>Replace Talent</h1>
				<p>
					Before proceeding, Can you help know answers on below aspects of
					replacement?
				</p>
			</div>
			<div
				className={allengagementReplceTalentStyles.firstFeebackTableContainer}>

					{isLoading ? <Skeleton /> : <>
						<div
					className={`${allengagementReplceTalentStyles.row} ${allengagementReplceTalentStyles.billRateWrapper}`}>
					<div className={allengagementReplceTalentStyles.colMd6}>
						<HRSelectField
							mode={'id/value'}
							setValue={setValue}
							register={register}
							name="replaceStage"
							label="At what stage are you requesting this replacement at?"
							defaultValue="Please Select"
							options={[
								{
									id: 1,
									value: 'Last working day is decided.',
									disabled: false,
									group: null,
									seletected: false,
								},
								{
									id: 2,
									value: 'Last working day is yet to be decided.',
									disabled: false,
									group: null,
									seletected: false,
								},
								{
									id: 3,
									value: 'Engagement did not start.',
									disabled: false,
									group: null,
									seletected: false,
								},
							]}
							required
							isError={errors['replaceStage'] && errors['replaceStage']}
							errorMsg="Please select a replcement stage."
						/>
					</div>

					<div className={allengagementReplceTalentStyles.colMd6}>
						<div className={allengagementReplceTalentStyles.timeSlotItemField}>
							{watch("replaceStage")?.id === 1 && (
<>
							<div className={allengagementReplceTalentStyles.timeLabel}>
								Please Enter Date of Last Working Day{' '}
								<span>
									<b style={{ color: 'black' }}>*</b>
								</span>
							</div>
							<div className={allengagementReplceTalentStyles.timeSlotItem}>
								<CalenderSVG />
								<Controller
									render={({ ...props }) => (
										<DatePicker
											selected={watch('lastWorkingDate')}
											onChange={(date) => {
												setValue('lastWorkingDate', date);
											}}
											placeholderText="Last working date"
											dateFormat="dd/MM/yyyy"
										/>
									)}
									name="lastWorkingDate"
									rules={{ required: true }}
									control={control}									
								/>
								{errors.lastWorkingDate && (
									<div className={allengagementReplceTalentStyles.error}>
										* Please select last working date.
									</div>
								)}
							</div>

							</>
							)}
						</div>
					</div>
				</div>
				<div
					className={`${allengagementReplceTalentStyles.row} ${allengagementReplceTalentStyles.radioWrapper}`}>
					<div
						className={`${allengagementReplceTalentStyles.radioFormGroup} ${allengagementReplceTalentStyles.requestByRadio} `}>
						<label>
							Replacement Initiated by
							<span className={allengagementReplceTalentStyles.reqField}>
								*
							</span>
						</label>
						<Radio.Group
							defaultValue={'client'}
							className={allengagementReplceTalentStyles.radioGroup}
							onChange={onSlotChange}
							value={getRadio}>
							<Radio value={'client'}>Client</Radio>
							<Radio value={'talent'}>Talent</Radio>
							<Radio value={'internal team'}>Internal Team</Radio>
						</Radio.Group>
					</div>
				</div>

				<div className={allengagementReplceTalentStyles.row}>
					<div className={allengagementReplceTalentStyles.colMd12}>
						<HRSelectField
							setValue={setValue}
							register={register}
							name="reasonForReplacement"
							label="Reason for replacement?"
							defaultValue="Please Select"
							options={[
								{
									id: 'Technical Skills of Talent',
									value: 'Technical Skills of Talent.',
									disabled: false,
									group: null,
									seletected: false,
								},
								{
									id: 'Functional Skills of Talent',
									value: 'Functional Skills of Talent.',
									disabled: false,
									group: null,
									seletected: false,
								},
								{
									id: 'Talent Resigned',
									value: 'Talent Resigned.',
									disabled: false,
									group: null,
									seletected: false,
								},
								{
									id: 'Talent Backout',
									value: 'Talent Backout.',
									disabled: false,
									group: null,
									seletected: false,
								},
								{
									id: 'Behavioral',
									value: 'Behavioral.',
									disabled: false,
									group: null,
									seletected: false,
								},
							]}
							required
							isError={
								errors['reasonForReplacement'] && errors['reasonForReplacement']
							}
							errorMsg="Please select reason for replacement."
						/>
					</div>
					{/* <div className={allengagementReplceTalentStyles.colMd6}>
						<HRSelectField
							setValue={setValue}
							register={register}
							name="replaceStage"
							label="Who will handle the Replacement?"
							defaultValue="Please Select"
							options={[]}
							isError={errors['replaceStage'] && errors['replaceStage']}
							errorMsg="Please select replacement handler."
						/>
					</div> */}
				</div>

				<div className={allengagementReplceTalentStyles.row}>
					<div className={allengagementReplceTalentStyles.colMd12}>
						<HRInputField
							disabled={true}
							errors={errors}
							validationSchema={{
								required: 'Please enter NBD name.',
							}}
							label={'Add NBD/AM Person Name'}
							register={register}
							name="nbdName"
							type={InputType.TEXT}
							placeholder="Enter Names"
						/>
					</div>
				</div>

				<div className={allengagementReplceTalentStyles.row}>
					<div className={allengagementReplceTalentStyles.colMd12}>
						<HRInputField
							errors={errors}
							validationSchema={{
								required: 'Please enter additonal notes.',
							}}
							label={'Additional Notes'}
							register={register}
							name="additionalNotes"
							type={InputType.TEXT}
							placeholder="Add Notes"
						/>
					</div>
				</div>
					</>}
			

				<div className={allengagementReplceTalentStyles.formPanelAction}>
					<button
						type="submit"
						onClick={handleSubmit(submitTalentReplacementHandler)}
						className={allengagementReplceTalentStyles.btnPrimary}
						disabled={isLoading}>
						Save
					</button>
					<button
						className={allengagementReplceTalentStyles.btn}
						onClick={closeModal}>
						Cancel
					</button>
				</div>
			</div>
			<Modal
			    open={newHRModal} 
				closable={false}
				centered
				footer={<div className={allengagementReplceTalentStyles.formPanelAction}>
				<button
					type="submit"
					onClick={() => manageNewHRClose()}
					className={allengagementReplceTalentStyles.btnPrimary}
					>
					OK
				</button>
				
			</div>}
				
				// onCancel={() => manageNewHRClose()}
					>
				<h1>New HR Created <Link to={`/allhiringrequest/${newHRDetails?.hR_Id}`} target='_blank'>{newHRDetails?.hR_Number}</Link></h1>
				
			</Modal>
		</div>
	);
};

export default EngagementReplaceTalent;
