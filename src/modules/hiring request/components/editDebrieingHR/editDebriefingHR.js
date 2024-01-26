import { Divider, message,Checkbox } from 'antd';
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
import LogoLoader from 'shared/components/loader/logoLoader';
import { ReactComponent as FocusRole } from 'assets/svg/FocusRole.svg';
import plusSkill from '../../../../assets/svg/plusSkill.svg';
import PublishHRPopup from '../publishHRPopup/publishHRPopup';
import DebrefCompanyDetails from './debrefCompanyDetails';

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
	jdDumpID,
	getHRdetails,
	isDirectHR,
	disabledFields
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
			secondaryInterviewer: getHRdetails?.interviewerDetails?.secondaryinterviewerList
				? getHRdetails?.interviewerDetails?.secondaryinterviewerList
				: [],
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
	const[allSuggestedSkills,setAllSuggestedSkills] = useState([]);
	const [messageAPI, contextHolder] = message.useMessage();
	const getSkills = useCallback(async (ID) => {
		const response = await MasterDAO.getHRSkillsRequestDAO(ID);
		setSkills(response && response.responseBody);
	}, []);
	const [isFocusedRole, setIsFocusedRole] = useState(false)
	let watchOtherSkills = watch('otherSkill');
	let watchSkills = watch('skills');
	const [talentRole, setTalentRole] = useState([]);
	const [controlledRoleValue, setControlledRoleValue] = useState('Select Role');
	const [companyType , setComapnyType] = useState({})

	//to set skills and control
	useEffect(()=>{
		setControlledJDParsed(getHRdetails?.skillmulticheckbox?.map((item) => ({id:item?.id, value:item?.text})))
		setValue('skills',getHRdetails?.skillmulticheckbox?.map((item) => ({id:item?.id, value:item?.text})))
		setControlledGoodToHave(getHRdetails?.allSkillmulticheckbox?.map((item) => ({id:item?.id, value:item?.text})))
		setValue('goodToHaveSkills',getHRdetails?.allSkillmulticheckbox?.map((item) => ({id:item?.id, value:item?.text})))
	},[getHRdetails?.allSkillmulticheckbox,getHRdetails?.skillmulticheckbox,setValue])

	useEffect(() => {
		if(getHRdetails){
			setGoodSuggestedSkills(getHRdetails?.chatGptSkills?.split(","));
			setAllSuggestedSkills(getHRdetails?.chatGptAllSkills?.split(","));
		}
		let company_Type = getHRdetails?.companyTypes?.filter(item => item.isActive === true);
		if(company_Type?.length > 0){
			setComapnyType(company_Type[0])
		 }
	},[getHRdetails]);
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
	const [SkillMemo, setSkillMemo] = useState([])
	const [sameSkillErrors, setSameSkillError] = useState(false)
	const [showPublishModal, setShowPublishModal] = useState(false)
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
		setSkillMemo(combinewithoutOther.filter((o) => !controlledJDParsed.map(s=> s?.value).includes(o?.value)))
		setCombinedSkillsMemo(combinedData.filter((o) => !controlledGoodToHave.map(s=> s?.value).includes(o?.value)))
	},[JDParsedSkills, controlledJDParsed, skills,controlledGoodToHave])
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

	const onSelectSkill = (skill) => {		
		// let _selected = combinedSkillsMemo.filter((val) => val?.value === skill);
		// // if(!_selected) return
		// let _controlledJDParsed = [...controlledJDParsed];	
		// if(selectedGoodToHaveItems.length > 0){
		// 	console.log("selected",skill, _selected,_controlledJDParsed);
		// let _index = _controlledJDParsed.findIndex((obj) => obj.value === _selected[0]?.value);
		// console.log("index", _index)
		// if(_index === -1){
		// 	// _controlledJDParsed.push(_selected[0]);
		// 	_controlledJDParsed.push({id: '0', value: skill});
		// }else{
		// 	return
		// }
		// setControlledJDParsed(_controlledJDParsed);
		// setValue('skills',_controlledJDParsed);		
		// }else{
		// 	return
		// }

		let _controlledJDParsed = [...controlledJDParsed];	
		let _index = _controlledJDParsed.findIndex((obj) => obj.value === skill.trim());
		if(_index === -1){
				// _controlledJDParsed.push(_selected[0]);
				_controlledJDParsed.push({id: '0', value: skill.trim()});
				setCombinedSkillsMemo(prev=> [...prev,{id: '0', value: skill.trim()}])
			}else{
				return
			}

		setControlledJDParsed(_controlledJDParsed);
		setValue('skills',_controlledJDParsed);
	}
	
	const onSelectGoodSkill = (skill) => {
		// let _selected = SkillMemo.filter((val) => val?.value === skill?.trim());
		// let _controlledGoodToHave = [...controlledGoodToHave];
		// let _index = _controlledGoodToHave.findIndex((obj) => obj.id === _selected[0].id);
		// if(_index === -1){
		// 	// _controlledGoodToHave.push(_selected[0]);
		// 	_controlledGoodToHave.push({id: '0', value: skill});
		// }
		// setControlledGoodToHave(_controlledGoodToHave);
		// setValue('goodToHaveSkills',_controlledGoodToHave)

		let _controlledGoodToHave = [...controlledGoodToHave];
		let _index = _controlledGoodToHave.findIndex((obj) => obj.value === skill.trim());

		if(_index === -1){
			// _controlledGoodToHave.push(_selected[0]);
			_controlledGoodToHave.push({id: '0', value: skill.trim()});
			setSkillMemo(prev=> [...prev, {id: '0', value: skill.trim()}])
		}else{
			return
		}
		setControlledGoodToHave(_controlledGoodToHave);
		setValue('goodToHaveSkills',_controlledGoodToHave)
	}


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
				getOtherSkillsRequest(watchOtherSkills);
			}, 2000);
		}
		return () => clearTimeout(timer);
	}, [getOtherSkillsRequest, watchOtherSkills]);

	useEffect(() => {
		if(getHRdetails?.addHiringRequest.id){
			getSkills(getHRdetails?.addHiringRequest.id);
		}
		
	}, [getSkills,getHRdetails?.addHiringRequest.id]);


	const getTalentRole = useCallback(async () => {
		const talentRole = await MasterDAO.getTalentsRoleRequestDAO();
		setTalentRole(talentRole && talentRole.responseBody);
	}, []);

	useEffect(() => {
		getTalentRole()
	},[getTalentRole])

	useEffect(() => {		
		setValue('hrTitle', getHRdetails?.addHiringRequest?.requestForTalent);
		// setValue('role',getHRdetails?.addHiringRequest?.requestForTalent);	
	},[
		getHRdetails?.addHiringRequest?.requestForTalent,setValue
	])
	// let hrRole = watch('role');
	// useEffect(() => {
	// 	setValue('hrTitle', hrRole?.value);
	// }, [hrRole?.value, setValue]);  

	const ControlledRoleChangeHandler = (role)=>{
		// set role and title if selected from Dropdown
		setControlledRoleValue(role)
		setValue('hrTitle', role);
	}

	useEffect(() => {
		if (getHRdetails?.salesHiringRequest_Details?.roleId !== null) {
			const findRole = talentRole.filter(
				(item) =>
					item?.id === getHRdetails?.salesHiringRequest_Details?.roleId,
			);
			setValue('role', findRole[0]);
			setControlledRoleValue(findRole[0]?.value);
		}else{
			if(getHRdetails?.addHiringRequest?.requestForTalent){
				const findRole = talentRole.filter(
					(item) =>
						item?.value === getHRdetails?.addHiringRequest?.requestForTalent,
				);
				setValue('role', findRole[0]);
				setControlledRoleValue(findRole[0]?.value);
			}
		}
	}, [getHRdetails?.salesHiringRequest_Details?.roleId,getHRdetails?.addHiringRequest?.requestForTalent, talentRole,setValue]);

	useEffect(() => {
		// JDParsedSkills &&
		// 	setValue('roleAndResponsibilities', JDParsedSkills?.Responsibility, {
		// 		shouldDirty: true,
		// 	});
		JDParsedSkills &&
		setValue('roleAndResponsibilities', getHRdetails?.addHiringRequest?.guid ? testJSON(getHRdetails?.salesHiringRequest_Details
			?.rolesResponsibilities)? createListMarkup(JSON.parse(getHRdetails?.salesHiringRequest_Details
			?.rolesResponsibilities)) : getHRdetails?.salesHiringRequest_Details
			?.rolesResponsibilities :
			JDParsedSkills?.Responsibility ||
			(getHRdetails?.salesHiringRequest_Details
				?.rolesResponsibilities ), {
			shouldDirty: true,
		});

		// JDParsedSkills &&
		// 	setValue('requirements', JDParsedSkills?.Requirements, {
		// 		shouldDirty: true,
		// 	});
		JDParsedSkills &&
			setValue('requirements', getHRdetails?.addHiringRequest?.guid ? testJSON(getHRdetails?.salesHiringRequest_Details?.requirement) ? createListMarkup(JSON.parse(getHRdetails?.salesHiringRequest_Details?.requirement)) :getHRdetails?.salesHiringRequest_Details?.requirement :
			JDParsedSkills?.Requirements ||
			(getHRdetails?.salesHiringRequest_Details?.requirement), {
				shouldDirty: true,
			});
		
	}, [JDParsedSkills, setValue]);

	const openPublishModal = ()=>{
		setShowPublishModal(true)
	}

	const debriefSubmitHandler = useCallback(
		async (d) => {
			setIsLoading(true);
			setSameSkillError(false)
			let sameSkillIssue = false
			let skillList = d.skills.map((item) => {
				const obj = {
					skillsID: item.id || item?.skillsID,
					skillsName: item.value || item?.skillsName,
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

			let goodtoonlySkillsList = goodToSkillList.map((item) => item.skillsName.toLowerCase())
			let skillonlyList = skillList.map((item) => item.skillsName.toLowerCase() )

			goodtoonlySkillsList.forEach(item => {
				if(skillonlyList.includes(item)){
					setError('goodToHaveSkills', {
						type: 'otherSkill',
						message: 'Same skills are not allowed',
					});
					setSameSkillError(true)
					sameSkillIssue = true
				}
			})

			let debriefFormDetails = {
				roleAndResponsibilites:  d.roleAndResponsibilities,
				requirements:  d.requirements,
				en_Id: enID,
				skills: skillList?.filter((item) => item?.skillsID !== -1),
				aboutCompanyDesc: d.aboutCompany,
				// secondaryInterviewer: d.secondaryInterviewer,
				interviewerFullName: d.interviewerFullName,
				interviewerEmail: d.interviewerEmail,
				interviewerLinkedin: d.interviewerLinkedin,
				interviewerDesignation: d.interviewerDesignation,
				JDDumpID: jdDumpID? jdDumpID : getHRdetails?.addHiringRequest?.jddumpId  ,
				ActionType: getHRdetails?.addHiringRequest?.isActive ? "Edit" : "Save",
				IsHrfocused: isFocusedRole,
				allowSpecialEdit: getHRdetails?.allowSpecialEdit,
				role: d.role.id,
				hrTitle: d.hrTitle,
				allSkills:goodToSkillList,
				"interviewerDetails":{
					"primaryInterviewer": {
						"interviewerId": d.interviewerId,
						"fullName": d.interviewerFullName,
						"emailID": d.interviewerEmail,
						"linkedin": d.interviewerLinkedin,
						"designation": d.interviewerDesignation,
						"isUserAddMore": false
					},
					"secondaryinterviewerList": d.secondaryInterviewer
				},
				isDirectHR:isDirectHR,
				companyInfo: {
					"companyID": getHRdetails?.companyInfo?.companyID,
					"companyName": d.companyName,
					"website": d.webSite,
					"linkedInURL": d.companyLinkedin,
					"industry": d.industry,
					"companySize": getHRdetails?.companyInfo?.companySize,
					"aboutCompanyDesc": d.aboutCompany
				},
				companyType: companyType?.name,
				PayPerType:  companyType?.id 
			};

			if(companyType?.id === 2){
				debriefFormDetails['companyInfo'] = {
					"companyID": getHRdetails?.companyInfo?.companyID,
					"companyName": d.companyName,
					"website": d.webSite,
					"linkedInURL": d.companyLinkedin,
					"industry": d.industry,
					"companySize": d.companySize,
					"aboutCompanyDesc": d.aboutCompany
				}

				debriefFormDetails['interviewerDetails'] = getHRdetails?.interviewerDetails
			}

			
			if(!sameSkillIssue){
				const debriefResult = await hiringRequestDAO.createDebriefingDAO(
				debriefFormDetails,
			);
			if (debriefResult.statusCode === HTTPStatusCode.OK) {
				// window.location.replace(UTSRoutes.ALLHIRINGREQUESTROUTE);
				setIsLoading(false);
				messageAPI.open({
					type: 'success',
					content: 'HR Debriefing has been updated successfully..',
				});

				navigate(`/allhiringrequest/${getHRdetails?.addHiringRequest?.id}`)
			}
			}else{
				setIsLoading(false);
			}
			
		},
		[enID, getHRdetails?.addHiringRequest?.jddumpId, messageAPI,isFocusedRole,companyType],
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
		// setValue(
		// 	'requirements',
		// 	getHRdetails?.salesHiringRequest_Details?.requirement,
		// );
		setValue(
				'requirements',
				getHRdetails?.addHiringRequest?.guid ? testJSON(getHRdetails?.salesHiringRequest_Details?.requirement) ? createListMarkup(JSON.parse(getHRdetails?.salesHiringRequest_Details?.requirement)) :getHRdetails?.salesHiringRequest_Details?.requirement :
										JDParsedSkills?.Requirements ||
										(getHRdetails?.salesHiringRequest_Details?.requirement),
			);
		// setValue(
		// 	'roleAndResponsibilities',
		// 	getHRdetails?.salesHiringRequest_Details?.rolesResponsibilities,
		// );
		setValue(
				'roleAndResponsibilities',
				getHRdetails?.addHiringRequest?.guid ? testJSON(getHRdetails?.salesHiringRequest_Details
					?.rolesResponsibilities)? createListMarkup(JSON.parse(getHRdetails?.salesHiringRequest_Details
					?.rolesResponsibilities)) : getHRdetails?.salesHiringRequest_Details
					?.rolesResponsibilities :
					JDParsedSkills?.Responsibility ||
					(getHRdetails?.salesHiringRequest_Details
						?.rolesResponsibilities ),
			);
		setIsFocusedRole(getHRdetails?.salesHiringRequest_Details?.isHrfocused)
		// setValue("skills",getHRdetails?.skillmulticheckbox)

		//set Company Details 
		let companyInfo = getHRdetails?.companyInfo

		if(companyInfo?.companyID){
			companyInfo?.companyName && setValue('companyName',companyInfo?.companyName)
			companyInfo?.website && setValue('webSite',companyInfo?.website)
			companyInfo?.industry && setValue('industry',companyInfo?.industry)
			companyInfo?.linkedInURL && setValue('companyLinkedin',companyInfo?.linkedInURL)
			companyInfo?.companySize && setValue('companySize',companyInfo?.companySize)
		}
	}, [getHRdetails, setValue]);

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
									controlledValue={ getHRdetails?.addHiringRequest?.guid ? testJSON(getHRdetails?.salesHiringRequest_Details
										?.rolesResponsibilities)? createListMarkup(JSON.parse(getHRdetails?.salesHiringRequest_Details
										?.rolesResponsibilities)) : getHRdetails?.salesHiringRequest_Details
										?.rolesResponsibilities :
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
							
								
								<TextEditor
									isControlled={true}
									controlledValue={getHRdetails?.addHiringRequest?.guid ? testJSON(getHRdetails?.salesHiringRequest_Details?.requirement) ? createListMarkup(JSON.parse(getHRdetails?.salesHiringRequest_Details?.requirement)) :getHRdetails?.salesHiringRequest_Details?.requirement :
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

{companyType?.id === 1 && <div className={DebriefingHRStyle.aboutCompanyField}>
									<HRInputField
										required
										isTextArea={true}
										errors={errors}
										validationSchema={{
											validate: (value) => {
												let index = value?.search(
													new RegExp(getHRdetails?.company, 'i'),
												);
												// if (index !== -1) {
												// 	return `Please do not mention company name [${getHRdetails?.company}] here`;
												// }
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
									{/* <p>* Please do not mention company name here</p> */}
								</div>}

								{companyType?.id === 1 && <>
								<div className={DebriefingHRStyle.mb50}>
									<HRSelectField
										controlledValue={controlledRoleValue}
										setControlledValue={ControlledRoleChangeHandler}
										isControlled={true}
										mode={'id/value'}
										searchable={true}
										setValue={setValue}
										register={register}
										label={'Hiring Request Role'}
										options={talentRole && talentRole}
										name="role"
										isError={errors['role'] && errors['role']}
										required={disabledFields !== null ? !disabledFields?.role : true}
										disabled={ disabledFields !== null ? disabledFields?.role : false}
										errorMsg={'Please select hiring request role'}
									/>
								</div>
								
								</>}
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
										// mode="multiple"
										mode="tags"
										setValue={setValue}
										register={register}
										label={'Must have Skills'}
										placeholder="Type skills" 
										onChange={setSelectedItems}
										options={combinedSkillsMemo}
										setOptions = {setCombinedSkillsMemo}
										name="skills"
										isError={errors['skills'] && errors['skills']}
										required
										errorMsg={'Please enter the skills.'}
									/>

									<ul className={DebriefingHRStyle.selectFieldBox}>
										{goodSuggestedSkills?.map((skill) => (																	
											<li key={skill} onClick={() => onSelectSkill(skill)}><span>{skill}<img src={plusSkill} loading="lazy" alt="star" /></span></li>
										))}	
									</ul>
								</div>
								{/* <ul className={DebriefingHRStyle.selectFieldBox}>
									{goodSuggestedSkills?.map((skill) => (
										  onClick={() =>
										 addtopSkillFromSuggestion(skill, top5Skills)
										 }									
										<li key={skill} className={DebriefingHRStyle.mb50} onClick={() => onSelectSkill(skill)}>                      
											{skill}test
											 <img
											// src={plusImage}                          
											loading="lazy"
											alt="star"
											/> 
										</li>									
									))}
								</ul> */}						

								{isOtherSkillExistMemo && (
									<>
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
							</>
														
						)}

						<div className={DebriefingHRStyle.mb50}>
									<HRSelectField
										isControlled={true}
										controlledValue={controlledGoodToHave}
										setControlledValue={setControlledGoodToHave}
										// mode="multiple"
										mode="tags"
										setValue={setValue}
										register={register}
										label={'Good to have Skills'}
										placeholder="Type skills"
										onChange={setSelectGoodToHaveItems}
										options={SkillMemo}
										setOptions = {setSkillMemo}
										name="goodToHaveSkills"
										isError={errors['goodToHaveSkills'] && errors['goodToHaveSkills']}
										required
										errorMsg={sameSkillErrors ? 'Same Skills are not allowed!' : 'Please enter the skills.'}
									/>
								</div>
								{/* <div className="selectFieldBox">
								{allSuggestedSkills?.map((skill) => (																		
									<button key={skill} onClick={() => onSelectGoodSkill(skill)}>                      
										{skill}										
									</button>									
								))}
								</div> */}

								<ul className={DebriefingHRStyle.selectFieldBox}>
										{allSuggestedSkills?.map((skill) => (																	
											<li key={skill} onClick={() => onSelectGoodSkill(skill)}><span>{skill}<img src={plusSkill} loading="lazy" alt="star" /></span></li>
										))}	
								</ul>
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

					{companyType?.id === 2 &&  <DebrefCompanyDetails register={register}  errors={errors} watch={watch} />}

					
					{companyType?.id === 1 && <>
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
						disabledFields={disabledFields}
					/></>}

					
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
							onClick={handleSubmit(openPublishModal)}
							disable={isLoading}
							>
							Edit Debriefing
						</button>
					</div>
					<PublishHRPopup handleOK={handleSubmit(debriefSubmitHandler)} showModal={showPublishModal} setShowModal={setShowPublishModal} />
				</div>
			</WithLoader>
			{/* <LogoLoader visible={isLoading} /> */}
		</>
	);
};

export default EditDebriefingHR;
