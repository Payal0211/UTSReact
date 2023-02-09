import { Divider, Select, message } from 'antd';
import TextEditor from 'shared/components/textEditor/textEditor';
import { useCallback, useEffect, useState } from 'react';
import DebriefingHRStyle from './debriefingHR.module.css';
import AddInterviewer from '../addInterviewer/addInterviewer';
import { useFieldArray, useForm } from 'react-hook-form';
import HRSelectField from '../hrSelectField/hrSelectField';
import { MasterDAO } from 'core/master/masterDAO';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';
import HRInputField from '../hrInputFields/hrInputFields';
import { InputType } from 'constants/application';

export const secondaryInterviewer = {
	fullName: '',
	emailID: '',
	linkedin: '',
	designation: '',
};

const DebriefingHR = ({
	setTitle,
	tabFieldDisabled,
	setTabFieldDisabled,
	enID,
}) => {
	const {
		watch,
		register,
		handleSubmit,
		setValue,
		setError,
		control,
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
	const [selectedItems, setSelectedItems] = useState([]);
	const [skills, setSkills] = useState([]);
	const [messageAPI, contextHolder] = message.useMessage();
	const getSkills = useCallback(async () => {
		const response = await MasterDAO.getSkillsRequestDAO();
		setSkills(response && response.responseBody);
	}, []);

	const filteredOptions = skills.filter((o) => !selectedItems.includes(o));

	const debriefSubmitHandler = async (d) => {
		let debriefFormDetails = {
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
		};

		const debriefResult = await hiringRequestDAO.createDebriefingDAO(
			debriefFormDetails,
		);
		if (debriefResult.statusCode === HTTPStatusCode.OK) {
			messageAPI.open({
				type: 'success',
				content: 'HR Debriefing has been created successfully..',
			});
		}
	};

	useEffect(() => {
		getSkills();
	}, [getSkills]);
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
								mode="multiple"
								setValue={setValue}
								register={register}
								label={'Required Skills'}
								placeholder="Type skills"
								onChange={setSelectedItems}
								options={filteredOptions}
								name="skills"
								isError={errors['skills'] && errors['skills']}
								required
								errorMsg={'Please enter the skills.'}
							/>
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
				register={register}
				fields={fields}
			/>
			<Divider />
			<div className={DebriefingHRStyle.formPanelAction}>
				<button
					type="button"
					className={DebriefingHRStyle.btn}>
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

export default DebriefingHR;
