import { Divider, message, Checkbox } from 'antd';
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
import WithLoader from 'shared/components/loader/loader';
import SpinLoader from 'shared/components/spinLoader/spinLoader';
import { _isNull } from 'shared/utils/basic_utils';
import LogoLoader from 'shared/components/loader/logoLoader';
import { ReactComponent as FocusRole } from 'assets/svg/FocusRole.svg';

export const secondaryInterviewer = {
	fullName: '',
	emailID: '',
	linkedin: '',
	designation: '',
};

const DebriefingHR = ({
	setTitle,
	jdDumpID,
	tabFieldDisabled,
	setTabFieldDisabled,
	enID,
	JDParsedSkills,
	interviewDetails,
	setJDParsedSkills,
	getHRdetails,
	getCompanyName,
	clientDetail,
	params,
	isCloned,
	addData
}) => {
	const {
		watch,
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		clearErrors,
		unregister,
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
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const [controlledJDParsed, setControlledJDParsed] = useState([]);
	const [controlledGoodToHave, setControlledGoodToHave] = useState([])
	const [selectedItems, setSelectedItems] = useState([]);
	const [selectedGoodToHaveItems, setSelectGoodToHaveItems] = useState([]);
	const [skills, setSkills] = useState([]);
	const [goodSuggestedSkills, setGoodSuggestedSkills] = useState([]);
	const [allSuggestedSkills,setAllSuggestedSkills] = useState([]);
	const [messageAPI, contextHolder] = message.useMessage();
	const getSkills = useCallback(async () => {
		const response = await MasterDAO.getSkillsRequestDAO();
		setSkills(response && response.responseBody);
	}, []);
	const [isFocusedRole, setIsFocusedRole] = useState(false)
	const [talentRole, setTalentRole] = useState([]);
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

	const watchSkills = watch("skills")
	const watchOtherSkills = watch("otherSkill")
	
	
	const [combinedSkillsMemo, setCombinedSkillsMemo] = useState([])
	const [SkillMemo, setSkillMemo] = useState([])

	useEffect(() => {
		setValue('aboutCompany', addData?.addHiringRequest?.aboutCompanyDesc);
		setValue(
			'requirements',
			addData?.salesHiringRequest_Details?.requirement,
		);
		setValue(
			'roleAndResponsibilities',
			addData?.salesHiringRequest_Details?.rolesResponsibilities,
		);
		setIsFocusedRole(addData?.salesHiringRequest_Details?.isHrfocused);
		setGoodSuggestedSkills(addData?.chatGptSkills?.split(","));
		setAllSuggestedSkills(addData?.chatGptAllSkills?.split(","));
	}, [addData]);

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
		const combinewithoutOther = [
			JDParsedSkills ? [...JDParsedSkills?.Skills] : [],
			...skills,
		];
		// remove selected skill for other skill list 
		setSkillMemo(combinewithoutOther.filter((o) => !controlledJDParsed.map(s=> s.value).includes(o.value)))
		setCombinedSkillsMemo(combinedData.filter((o) => !controlledGoodToHave.map(s=> s.value).includes(o.value)))
	},[JDParsedSkills, controlledJDParsed, skills,controlledGoodToHave])

	const isOtherSkillExistMemo = useMemo(() => {
		let response = watchSkills?.filter((item) => item?.id === '-1');

		return response?.length > 0;
	}, [watchSkills]);

	useEffect(()=>{ if(isOtherSkillExistMemo === false){
		unregister('otherSkill')
		clearErrors('otherSkill')
	}  }
	, [isOtherSkillExistMemo, unregister,watchSkills,clearErrors])

	let hrRole = watch('role');
	useEffect(() => {
		setValue('hrTitle', hrRole?.value);
	}, [hrRole?.value, setValue]);

	const getTalentRole = useCallback(async () => {
		const talentRole = await MasterDAO.getTalentsRoleRequestDAO();

		setTalentRole(talentRole && talentRole.responseBody);
		// setTalentRole((preValue) => [
		// 	...preValue,
		// 	{
		// 		id: -1,
		// 		value: 'Others',
		// 	},
		// ]);
	}, []);

	useEffect(()=> {
		getTalentRole()
	},[getTalentRole])

	useEffect(() => {
		setValue(
			'skills',
			JDParsedSkills?.Skills?.map((item) => ({
				skillsID: item?.id.toString(),
				skillsName: item?.value,
			})),
		);
		setControlledJDParsed(JDParsedSkills?.Skills?.map((item) => item?.value));
	}, [JDParsedSkills, setValue]);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');

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
				if(response?.responseBody.message === "Temp Skill Exists"){
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
				return setError('otherSkill', {
					type: 'otherSkill',
					message: response?.responseBody.message,
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
				watchOtherSkills !== undefined && getOtherSkillsRequest(watchOtherSkills);
			}, 2000);
		}
		return () => clearTimeout(timer);
	}, [getOtherSkillsRequest, watchOtherSkills]);

	useEffect(() => {
		getSkills();
	}, [getSkills]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearch(debouncedSearch);
		}, 1000);
		return () => clearTimeout(timer);
	}, [debouncedSearch]);
	// useEffect(() => {
	// 	getOtherSkillsRequest(search);
	// }, [getOtherSkillsRequest, search]);
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
    
	// console.log("errors", errors,isOtherSkillExistMemo);
	
	const debriefSubmitHandler = async (d) => {
		setIsLoading(true);
		let skillList = d.skills.map((item) => {
			const obj = {
				skillsID: item.id || item?.skillsID,
				skillsName: item.value || item?.skillName,
			};
			return obj;
		});
		let goodToSkillList =  d.goodToHaveSkills.map((item) => {
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
			JDDumpID: jdDumpID || 0,
			ActionType: "Save",
			IsHrfocused: isFocusedRole,
			role: d.role.id,
			hrTitle: d.hrTitle,
			allSkills:goodToSkillList
		};

		const debriefResult = await hiringRequestDAO.createDebriefingDAO(
			debriefFormDetails,
		);
		if (debriefResult.statusCode === HTTPStatusCode.OK) {
			setIsLoading(false);
			messageAPI.open({
				type: 'success',
				content: 'HR Debriefing has been created successfully..',
			});
			navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
		}
	};

	const needMoreInforSubmitHandler = async (d) => {
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
			JDDumpID: jdDumpID || 0,
		};

		const debriefResult = await hiringRequestDAO.createDebriefingDAO(
			debriefFormDetails,
		);

		if (debriefResult.statusCode === HTTPStatusCode.OK) {
			setIsLoading(false);
			messageAPI.open({
				type: 'success',
				content: 'HR Debriefing has been created successfully..',
			});
			navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
		}
	};

	const onSelectSkill = (skill) => {
		let _selected = combinedSkillsMemo.filter((val) => val.value === skill);
		let _controlledJDParsed = [...controlledJDParsed];		
		let _index = _controlledJDParsed.findIndex((obj) => obj.id === _selected[0].id);
		if(_index === -1){
			_controlledJDParsed.push(_selected[0]);
		}
		setControlledJDParsed(_controlledJDParsed);
		setValue('skills',_controlledJDParsed)		
	}
	const onSelectGoodSkill = (skill) => {
		let _selected = SkillMemo.filter((val) => val.value === skill?.trim());
		let _controlledGoodToHave = [...controlledGoodToHave];
		let _index = _controlledGoodToHave.findIndex((obj) => obj.id === _selected[0].id);
		if(_index === -1){
			_controlledGoodToHave.push(_selected[0]);
		}
		setControlledGoodToHave(_controlledGoodToHave);
		setValue('goodToHaveSkills',_controlledGoodToHave)
	}	
	function testJSON(text) {
		if (typeof text !== "string") {
			return false;
		}
		try {
			JSON.parse(text);
			return true;
		} catch (error) {
			return false;
		}
	}

	const createListMarkup = (list) => {
		if(list?.length){
			  let listText = "<ul class='rolesText'>"
	
		list?.forEach((item) => {
		  listText += `<li>${item}</li>`
		})
	
		return listText + "</ul>";
		}
	
	}

	return (
		<div className={DebriefingHRStyle.debriefingHRContainer}>
			{contextHolder}
			<WithLoader
				showLoader={isLoading}
				className="mainLoader">
				<div className={DebriefingHRStyle.partOne}>
					<div className={DebriefingHRStyle.hrFieldLeftPane}>
						<h3>Job Description</h3>
						<p>Please provide the necessary details</p>
						<div className={DebriefingHRStyle.focusRole} >
						<Checkbox checked={isFocusedRole} onClick={()=> setIsFocusedRole(prev=> !prev)}>
						  Make this a Focused Role
						</Checkbox>	
						  <FocusRole
                      		style={{ width: "24px" }}                     
                   		 />
						</div>
						
					</div>
					<div className={DebriefingHRStyle.hrFieldRightPane}>
						<div className={DebriefingHRStyle.colMd12}>
							<TextEditor
								isControlled={true}
								// controlledValue={JDParsedSkills?.Responsibility || ''}
								controlledValue={ addData?.addHiringRequest?.guid ? testJSON(addData?.salesHiringRequest_Details
									?.rolesResponsibilities)? createListMarkup(JSON.parse(addData?.salesHiringRequest_Details
									?.rolesResponsibilities)) : addData?.salesHiringRequest_Details
									?.rolesResponsibilities :
									JDParsedSkills?.Responsibility ||
									(addData?.salesHiringRequest_Details
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
											let index = value.search(new RegExp(getCompanyName, 'i'));
											let index1 = value.search(
												new RegExp(clientDetail?.companyname, 'i'),
											);
											if (params === 'addnewhr') {
												if (index !== -1) {
													return `Please do not mention company name [${getCompanyName}] here`;
												}
												if (!value) {
													return 'Please add something about the company';
												}
											} else {
												if (index1 !== -1) {
													return `Please do not mention company name [${clientDetail?.companyname}] here`;
												}
												if (!value) {
													return 'Please add something about the company';
												}
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
								// controlledValue={JDParsedSkills?.Requirements || ''}
								controlledValue={addData?.addHiringRequest?.guid ? testJSON(addData?.salesHiringRequest_Details?.requirement) ? createListMarkup(JSON.parse(addData?.salesHiringRequest_Details?.requirement)) :addData?.salesHiringRequest_Details?.requirement :
									JDParsedSkills?.Requirements ||
									(addData?.salesHiringRequest_Details?.requirement)
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
										mode={'id/value'}
										searchable={true}
										setValue={setValue}
										register={register}
										label={'Hiring Request Role'}
										defaultValue="Select Role"
										options={talentRole && talentRole}
										name="role"
										isError={errors['role'] && errors['role']}
										required
										errorMsg={'Please select hiring request role'}
									/>
								</div>
								<div className={DebriefingHRStyle.mb50}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the hiring request title.',
									}}
									label={'Hiring Request Title'}
									name="hrTitle"
									type={InputType.TEXT}
									placeholder="Enter title"
									required
								/>
							</div>
							<div className={DebriefingHRStyle.mb50}>
								<HRSelectField
									isControlled={true}
									controlledValue={controlledJDParsed}
									setControlledValue={setControlledJDParsed}
									mode="multiple"
									setValue={setValue}
									register={register}
									label={'Must have Skills'}
									placeholder="Type skills"
									onChange={setSelectedItems}
									options={combinedSkillsMemo}
									name="skills"
									isError={errors['skills'] && errors['skills']}
									required
									errorMsg={'Please enter the skills.'}
								/>
							</div>

							<div className="selectFieldBox">
							{goodSuggestedSkills?.map((skill) => (
								    //  onClick={() =>
									// addtopSkillFromSuggestion(skill, top5Skills)
									// }									
									<button key={skill} onClick={() => onSelectSkill(skill)}>                      
										{skill}
										{/* <img
										// src={plusImage}                          
										loading="lazy"
										alt="star"
										/> */}
									</button>									
								))}
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
									onChangeHandler={(e) => {
										// console.log(e.target.value);
										setDebouncedSearch(e.target.value);
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

						<div className={DebriefingHRStyle.mb50}>
								<HRSelectField
									isControlled={true}
									controlledValue={controlledGoodToHave}
									setControlledValue={setControlledGoodToHave}
									mode="multiple"
									setValue={setValue}
									register={register}
									label={'Good to have Skills'}
									placeholder="Type skills"
									onChange={setSelectGoodToHaveItems}
									options={SkillMemo}
									name="goodToHaveSkills"
									isError={errors['goodToHaveSkills'] && errors['goodToHaveSkills']}
									required
									errorMsg={'Please enter the skills.'}
								/>
						</div>
						<div className="selectFieldBox">
						{allSuggestedSkills?.map((skill) => (
									//  onClick={() =>
									// addtopSkillFromSuggestion(skill, top5Skills)
									// }									
									<button key={skill} onClick={() => onSelectGoodSkill(skill)}>                      
										{skill}
										{/* <img
										// src={plusImage}                          
										loading="lazy"
										alt="star"
										/> */}
									</button>									
								))}
							</div>
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
					setValue={setValue}
					register={register}
					watch={watch}
					interviewDetails={{fullName:getHRdetails.interviewerFullName
						,emailId:getHRdetails.interviewerEmail
						,linkedin:getHRdetails.interviewerLinkedin,designation:getHRdetails.interviewerDesignation
					}}
					fields={fields}
					getHRdetails={getHRdetails}
				/>
				<Divider />
				{isLoading ? (
					<SpinLoader />
				) : (
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
							onClick={handleSubmit(debriefSubmitHandler)}
							disable={isLoading}	
							>
							
							Create
						</button>
					</div>
				)}
			</WithLoader>
			{/* <LogoLoader visible={isLoading} /> */}
		</div>
	);
};

export default DebriefingHR;
