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
		formState: { errors },
	} = useForm({
		defaultValues: {
			secondaryInterviewer: [],
		},
	});
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'secondaryInterviewer',
	});

	console.log(getHRdetails,"getHRdetails");

	const navigate = useNavigate();
	const [controlledJDParsed, setControlledJDParsed] = useState(
		getHRdetails?.skillmulticheckbox?.map((item) => item?.text
		),
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

	const combinedSkillsMemo = useMemo(
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

	// const filteredOptions = combinedSkillsMemo.filter(
	// 	(o) => !selectedItems.includes(o),
	// );

	const isOtherSkillExistMemo = useMemo(() => {
		let response = watchSkills?.filter((item) => item?.skillsID === -1);
		return response?.length > 0;
	}, [watchSkills]);

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
			if (response?.statusCode === HTTPStatusCode?.BAD_REQUEST) {
				return setError('otherSkill', {
					type: 'otherSkill',
					message: response?.responseBody,
				});
			}
		},
		[setError],
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

	const debriefSubmitHandler = async (d) => {
		let debriefFormDetails = {
			roleAndResponsibilites: d.roleAndResponsibilities,
			requirements: d.requirements,
			en_Id: enID,
			skills: d.skills?.filter((item) => item?.skillsID !== -1),
			aboutCompanyDesc: d.aboutCompany,
			secondaryInterviewer: d.secondaryInterviewer,
			interviewerFullName: d.interviewerFullName,
			interviewerEmail: d.interviewerEmail,
			interviewerLinkedin: d.interviewerLinkedin,
			interviewerDesignation: d.interviewerDesignation,
			JDDumpID:getHRdetails?.addHiringRequest?.jddumpId,
		};

		console.log(d,"debriefFormDetails");

		const debriefResult = await hiringRequestDAO.createDebriefingDAO(
			debriefFormDetails,
		);
		if (debriefResult.statusCode === HTTPStatusCode.OK) {
			messageAPI.open({
				type: 'success',
				content: 'HR Debriefing has been created successfully..',
			});
			navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
		}
	};

	const needMoreInforSubmitHandler = async (d) => {

		let debriefFormDetails = {
			isneedmore: true,
			roleAndResponsibilites: d.roleAndResponsibilities,
			requirements: d.requirements,
			en_Id: enID,
			skills: d.skills,
			aboutCompanyDesc: d.aboutCompany,
			secondaryInterviewer: d.secondaryInterviewer,
			interviewerFullName: d.interviewerFullName,
			interviewerEmail: d.interviewerEmail,
			interviewerLinkedin: d.interviewerLinkedin,
			interviewerDesignation: d.interviewerDesignation,
			JDDumpID:getHRdetails?.addHiringRequest?.jddumpId,
		};

		const debriefResult = await hiringRequestDAO.createDebriefingDAO(
			debriefFormDetails,
		);
		if (debriefResult.statusCode === HTTPStatusCode.OK) {
			messageAPI.open({
				type: 'success',
				content: 'HR Debriefing has been created successfully..',
			});
			navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
		}
	};

	let tempArr = []
	tempArr.push(getHRdetails?.skillmulticheckbox)

	// useEffect(() => {
	// 	const skilsData = getHRdetails?.skillmulticheckbox?.filter((item)=>{
	// })
	// setValue("skills",getHRdetails?.skillmulticheckbox)
	// console.log(skilsData,"tempaaaaaarr")
	// console.log(errors["skills"]?.ref?.value.push(getHRdetails?.skillmulticheckbox),"Testtttt")
	// }, [getHRdetails])

	useEffect(() => {
		errors['skills']?.ref?.value.push(tempArr)
	}, [])



	useEffect(() => {
		setValue("aboutCompany", getHRdetails?.addHiringRequest?.aboutCompanyDesc)
		setValue("requirements", getHRdetails?.salesHiringRequest_Details?.requirement)
		setValue("roleAndResponsibilities", getHRdetails?.salesHiringRequest_Details?.rolesResponsibilities)
		// setValue("skills",getHRdetails?.skillmulticheckbox)
	}, [getHRdetails])

	return (
		<div className={DebriefingHRStyle.debriefingHRContainer}>
			{contextHolder}
			<div className={DebriefingHRStyle.partOne}>
				<div className={DebriefingHRStyle.hrFieldLeftPane}>
					<h3>Job Description</h3>
					<p>Please provide the necessary details</p>
				</div>
				<div className={DebriefingHRStyle.hrFieldRightPane}>
					<div className={DebriefingHRStyle.colMd12}>
						<TextEditor
							isControlled={true}
							controlledValue={JDParsedSkills?.Responsibility || getHRdetails?.salesHiringRequest_Details?.rolesResponsibilities}
							label={'Roles & Responsibilities'}
							placeholder={'Enter roles & responsibilities'}
							required
							setValue={setValue}
							watch={watch}
							register={register}
							errors={errors}
							name="roleAndResponsibilities"
						/>
						<HRInputField
							required
							isTextArea={true}
							errors={errors}
							validationSchema={{
								required: 'please enter the years.',
							}}
							label={'About Company'}
							register={register}
							name="aboutCompany"
							type={InputType.TEXT}
							placeholder="Please enter details about company."
						/>
						<TextEditor
							isControlled={true}
							controlledValue={JDParsedSkills?.Requirements || getHRdetails?.salesHiringRequest_Details?.requirement}
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
				fields={fields}
				getHRdetails={getHRdetails}
			/>
			<Divider />
			<div className={DebriefingHRStyle.formPanelAction}>
				<button
					type="button"
					className={DebriefingHRStyle.btn}
					onClick={handleSubmit(needMoreInforSubmitHandler)}>
					Need More Info
				</button>
				<button
					type="button"
					className={DebriefingHRStyle.btnPrimary}
					onClick={handleSubmit(debriefSubmitHandler)}>
					Create
				</button>
			</div>
		</div>
	);
};

export default EditDebriefingHR;
