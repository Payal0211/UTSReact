import { Divider, Select } from 'antd';
import TextEditor from 'shared/components/textEditor/textEditor';
import { useState } from 'react';
import DebriefingHRStyle from './debriefingHR.module.css';
import AddInterviewer from '../addInterviewer/addInterviewer';
import { useFieldArray, useForm } from 'react-hook-form';
import HRSelectField from '../hrSelectField/hrSelectField';

export const secondaryInterviewer = {
	fullName: '',
	emailID: '',
	linkedin: '',
	designation: '',
};
const DebriefingHR = ({ setTitle, tabFieldDisabled, setTabFieldDisabled }) => {
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
	const OPTIONS = [
		'Full Stack Developer',
		'FrontEnd Developer',
		'Backend Developer',
		'Wordpress Developer',
		'Data Scientist',
	];
	const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

	return (
		<div className={DebriefingHRStyle.debriefingHRContainer}>
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
								options={filteredOptions.map((item) => ({
									value: item,
									id: item,
								}))}
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
					Save as Draft
				</button>
				<button
					type="button"
					className={DebriefingHRStyle.btn}>
					Preview HR
				</button>
				<button
					type="button"
					className={DebriefingHRStyle.btnPrimary}
					onClick={handleSubmit((d) => console.log(d))}>
					Next Page
				</button>
			</div>
		</div>
	);
};

export default DebriefingHR;
