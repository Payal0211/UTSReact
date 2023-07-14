import { Divider, Select, message } from 'antd';
import TextEditor from 'shared/components/textEditor/textEditor';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DebriefingHRStyle from './debriefingHR.module.css';
import AddInterviewer from '../addInterviewer/addInterviewer';
import { useFieldArray, useForm } from 'react-hook-form';
import HRSelectField from '../hrSelectField/hrSelectField';
import { MasterDAO } from 'core/master/masterDAO';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';
import HRInputField from '../hrInputFields/hrInputFields';
import { InputType } from 'constants/application';
import { useNavigate } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { _isNull } from 'shared/utils/basic_utils';
import WithLoader from 'shared/components/loader/loader';

export const secondaryInterviewer = {
	fullName: '',
	emailID: '',
	linkedin: '',
	designation: '',
};

const EditDebriefingHR = ({
	setTitle,
	tabFieldDisabled,
	setTabFieldDisabled,
	enID,
	JDParsedSkills,
	setJDParsedSkills,
	setHRdetails,
	getHRdetails,
}) => {
	const {
		watch,
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		unregister,
		formState: { errors },
	} = useForm({
		defaultValues: {
			secondaryInterviewer: getHRdetails?.secondaryInterviewerlist
				? getHRdetails?.secondaryInterviewerlist
				: [],
		},
	});
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'secondaryInterviewer',
	});
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const [controlledJDParsed, setControlledJDParsed] = useState(
		getHRdetails?.skillmulticheckbox?.map((item) => item?.text),
	);
	const [selectedItems, setSelectedItems] = useState([]);
	const [skills, setSkills] = useState([]);

	const [messageAPI, contextHolder] = message.useMessage();
	const getSkills = useCallback(async () => {
		const response = await MasterDAO.getSkillsRequestDAO();
		setSkills(response && response.responseBody);
	}, []);
	let watchOtherSkills = watch('otherSkill');
	let watchSkills = watch('skills');

	/* const combinedSkillsMemo = useMemo(
		() => [
			...skills,
			...[
				{
					id: -1,
					value: 'Others',
				},
			],
		],
		[skills],
	);
 */

	const [combinedSkillsMemo, setCombinedSkillsMemo] = useState([])
	useEffect(()=>{
		const combinedData = [
			JDParsedSkills ? [...JDParsedSkills?.Skills] : [],
			...skills,
			...[
				{
					id: '-1',
					value: 'Others',
				},
			],
		];
		setCombinedSkillsMemo(combinedData.filter((o) => !selectedItems.includes(o)))
	},[JDParsedSkills, selectedItems, skills])

	// const combinedSkillsMemo = useMemo(() => {
	// 	const combinedData = [
	// 		JDParsedSkills ? [...JDParsedSkills?.Skills] : [],
	// 		...skills,
	// 		...[
	// 			{
	// 				id: '-1',
	// 				value: 'Others',
	// 			},
	// 		],
	// 	];
	// 	return combinedData.filter((o) => !selectedItems.includes(o));
	// }, [JDParsedSkills, selectedItems, skills]);
	// const filteredOptions = combinedSkillsMemo.filter(
	// 	(o) => !selectedItems.includes(o),
	// );

	const isOtherSkillExistMemo = useMemo(() => {
		let response = watchSkills?.filter((item) => item?.id === '-1');
		return response?.length > 0;
	}, [watchSkills]);

	useEffect(()=>{ isOtherSkillExistMemo === false && unregister('otherSkill') }, [isOtherSkillExistMemo, unregister])

	useEffect(() => {
		setValue(
			'skills',
			getHRdetails?.skillmulticheckbox?.map((item) => ({
				skillsID: item?.id.toString(),
				skillsName: item?.text,
			})),
		);
	}, [getHRdetails?.skillmulticheckbox, setValue]);

	const getOtherSkillsRequest = useCallback(
		async (data) => {
			let response = await MasterDAO.getOtherSkillsRequestDAO({
				skillName: data,
			});
			if(response.statusCode === HTTPStatusCode.OK){
				let newSKill = {
					id: response.responseBody.details.tempSkill_ID,
					value: data,
				}

				let newSkillSet = watchSkills?.map((skill) => {
					if(skill.id === '-1'){
						return newSKill
					}
					return skill
				})
				setSkills(prevSkills => [...prevSkills, newSKill])
				setValue('skills', newSkillSet)
				setControlledJDParsed(newSkillSet)
				setValue('otherSkills', '')
				return setError('otherSkill',null)
			}
			if (response?.statusCode === HTTPStatusCode?.BAD_REQUEST) {
				return setError('otherSkill', {
					type: 'otherSkill',
					message: response?.responseBody,
				});
			}
		},
		[setError,watchSkills, setValue],
	);

	useEffect(() => {
		let timer;
		if (!_isNull(watchOtherSkills)) {
			timer = setTimeout(() => {
				// setIsLoading(true);
				getOtherSkillsRequest(watchOtherSkills);
			}, 2000);
		}
		return () => clearTimeout(timer);
	}, [getOtherSkillsRequest, watchOtherSkills]);

	useEffect(() => {
		getSkills();
	}, [getSkills]);

	useEffect(() => {
		JDParsedSkills &&
			setValue('roleAndResponsibilities', JDParsedSkills?.Responsibility, {
				shouldDirty: true,
			});

		JDParsedSkills &&
			setValue('requirements', JDParsedSkills?.Requirements, {
				shouldDirty: true,
			});
	}, [JDParsedSkills, setValue]);

	const debriefSubmitHandler = useCallback(
		async (d) => {
			setIsLoading(true);
			let skillList = d.skills.map((item) => {
				const obj = {
					skillsID: item.id || item?.skillsID,
					skillsName: item.value || item?.skillName,
				};
				return obj;
			});
			let debriefFormDetails = {
				roleAndResponsibilites: d.roleAndResponsibilities,
				requirements: d.requirements,
				en_Id: enID,
				skills: skillList?.filter((item) => item?.skillsID !== -1),
				aboutCompanyDesc: d.aboutCompany,
				secondaryInterviewer: d.secondaryInterviewer,
				interviewerFullName: d.interviewerFullName,
				interviewerEmail: d.interviewerEmail,
				interviewerLinkedin: d.interviewerLinkedin,
				interviewerDesignation: d.interviewerDesignation,
				JDDumpID: getHRdetails?.addHiringRequest?.jddumpId,
				ActionType: "Edit"
			};

			const debriefResult = await hiringRequestDAO.createDebriefingDAO(
				debriefFormDetails,
			);
			if (debriefResult.statusCode === HTTPStatusCode.OK) {
				window.location.replace(UTSRoutes.ALLHIRINGREQUESTROUTE);
				setIsLoading(false);
				messageAPI.open({
					type: 'success',
					content: 'HR Debriefing has been updated successfully..',
				});
			}
		},
		[enID, getHRdetails?.addHiringRequest?.jddumpId, messageAPI],
	);

	const needMoreInforSubmitHandler = useCallback(
		async (d) => {
			setIsLoading(true);
			let skillList = d.skills.map((item) => {
				const obj = {
					skillsID: item.id || item?.skillsID,
					skillsName: item.value || item?.skillName,
				};
				return obj;
			});
			let debriefFormDetails = {
				isneedmore: true,
				roleAndResponsibilites: d.roleAndResponsibilities,
				requirements: d.requirements,
				en_Id: enID,
				skills: skillList?.filter((item) => item?.skillsID !== -1),
				aboutCompanyDesc: d.aboutCompany,
				secondaryInterviewer: d.secondaryInterviewer,
				interviewerFullName: d.interviewerFullName,
				interviewerEmail: d.interviewerEmail,
				interviewerLinkedin: d.interviewerLinkedin,
				interviewerDesignation: d.interviewerDesignation,
				JDDumpID: getHRdetails?.addHiringRequest?.jddumpId,
			};

			const debriefResult = await hiringRequestDAO.createDebriefingDAO(
				debriefFormDetails,
			);

			if (debriefResult.statusCode === HTTPStatusCode.OK) {
				setIsLoading(false);
				messageAPI.open({
					type: 'success',
					content: 'HR Debriefing has been updated successfully..',
				});
				// window.location.replace(UTSRoutes.ALLHIRINGREQUESTROUTE);
				navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
			}
		},
		[enID, getHRdetails?.addHiringRequest?.jddumpId, messageAPI, navigate],
	);

	let tempArr = [];
	tempArr.push(getHRdetails?.skillmulticheckbox);

	// useEffect(() => {
	// 	const skilsData = getHRdetails?.skillmulticheckbox?.filter((item)=>{
	// })
	// setValue("skills",getHRdetails?.skillmulticheckbox)

	// }, [getHRdetails])

	useEffect(() => {
		errors['skills']?.ref?.value.push(tempArr);
	}, []);

	useEffect(() => {
		setValue('aboutCompany', getHRdetails?.addHiringRequest?.aboutCompanyDesc);
		setValue(
			'requirements',
			getHRdetails?.salesHiringRequest_Details?.requirement,
		);
		setValue(
			'roleAndResponsibilities',
			getHRdetails?.salesHiringRequest_Details?.rolesResponsibilities,
		);
		// setValue("skills",getHRdetails?.skillmulticheckbox)
	}, [getHRdetails, setValue]);

	return (
		<>
			{contextHolder}
			<WithLoader
				showLoader={isLoading}
				className="mainLoader">
				<div className={DebriefingHRStyle.debriefingHRContainer}>
					<div className={DebriefingHRStyle.partOne}>
						<div className={DebriefingHRStyle.hrFieldLeftPane}>
							<h3>Job Description</h3>
							<p>Please provide the necessary details</p>
						</div>
						<div className={DebriefingHRStyle.hrFieldRightPane}>
							<div className={DebriefingHRStyle.colMd12}>
								<TextEditor
									isControlled={true}
									controlledValue={
										JDParsedSkills?.Responsibility ||
										(getHRdetails?.salesHiringRequest_Details
											?.rolesResponsibilities )
									}
									label={'Roles & Responsibilities'}
									placeholder={'Enter roles & responsibilities'}
									required
									setValue={setValue}
									watch={watch}
									register={register}
									errors={errors}
									name="roleAndResponsibilities"
								/>
								<div className={DebriefingHRStyle.aboutCompanyField}>
									<HRInputField
										required
										isTextArea={true}
										errors={errors}
										validationSchema={{
											validate: (value) => {
												let index = value?.search(
													new RegExp(getHRdetails?.company, 'i'),
												);
												if (index !== -1) {
													return `Please do not mention company name [${getHRdetails?.company}] here`;
												}
												// 	if (
												// 		value.toLowerCase() ===
												// 		getHRdetails?.company.toLowerCase() &&
												// 	value.toUpperCase() ===
												// 		getHRdetails?.company.toUpperCase()
												// )
												// {

												// 	return 'Please do not mention company name here';
												// }
												if (!value) {
													return 'Please add something about the company';
												}
											},
										}}
										label={'About Company'}
										register={register}
										name="aboutCompany"
										type={InputType.TEXT}
										placeholder="Please enter details about company."
									/>
									<p>* Please do not mention company name here</p>
								</div>
								<TextEditor
									isControlled={true}
									controlledValue={
										JDParsedSkills?.Requirements ||
										(getHRdetails?.salesHiringRequest_Details?.requirement)
									}
									label={'Requirements'}
									placeholder={'Enter Requirements'}
									setValue={setValue}
									watch={watch}
									register={register}
									errors={errors}
									name="requirements"
									required
								/>
								<div className={DebriefingHRStyle.mb50}>
									<HRSelectField
										isControlled={true}
										controlledValue={controlledJDParsed}
										setControlledValue={setControlledJDParsed}
										mode="multiple"
										setValue={setValue}
										register={register}
										label={'Required Skills'}
										placeholder="Type skills"
										onChange={setSelectedItems}
										options={combinedSkillsMemo}
										name="skills"
										isError={errors['skills'] && errors['skills']}
										required
										errorMsg={'Please enter the skills.'}
									/>
								</div>
								{isOtherSkillExistMemo && (
							<div className={DebriefingHRStyle.colMd12}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the other skills.',
										pattern: {
											value: /^((?!other).)*$/,
											message: 'Please remove "other" keyword.',
										},
									}}
									label="Other Skills"
									name="otherSkill"
									type={InputType.TEXT}
									placeholder="Enter other skill"
									maxLength={50}
									required
								/>
							</div>
						)}
								{/* <div className={DebriefingHRStyle.mb50}>
							<label
								style={{
									fontSize: '12px',
									marginBottom: '8px',
									display: 'inline-block',
								}}>
								Required assessments for the talent skills
							</label>
							<span style={{ paddingLeft: '5px' }}>
								<b>*</b>
							</span>
							<Select
								mode="multiple"
								placeholder="Type skills for assessments"
								value={selectedItems}
								onChange={setSelectedItems}
								style={{ width: '100%' }}
								options={filteredOptions.map((item) => ({
									value: item,
									label: item,
								}))}
							/>
						</div> */}
							</div>
						</div>
					</div>

					<Divider />
					<AddInterviewer
						errors={errors}
						append={append}
						remove={remove}
						register={register}
						setValue={setValue}
						watch={watch}
						fields={fields}
						getHRdetails={getHRdetails}
					/>
					<Divider />
					<div className={DebriefingHRStyle.formPanelAction}>
						{/* <button
							type="button"
							className={DebriefingHRStyle.btn}
							onClick={handleSubmit(needMoreInforSubmitHandler)}>
							Need More Info
						</button> */}
						<button
							type="button"
							className={DebriefingHRStyle.btnPrimary}
							onClick={handleSubmit(debriefSubmitHandler)}>
							Edit Debriefing
						</button>
					</div>
				</div>
			</WithLoader>
		</>
	);
};

export default EditDebriefingHR;
