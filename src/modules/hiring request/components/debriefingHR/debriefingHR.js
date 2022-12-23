import { Divider, Select } from 'antd';
import TextEditor from 'shared/components/textEditor/textEditor';
import { useState } from 'react';
import DebriefingHRStyle from './debriefingHR.module.css';
import AddInterviewer from '../addInterviewer/addInterviewer';

const DebriefingHR = () => {
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
						/>
						<TextEditor
							label={'Requirements'}
							placeholder={'Enter Requirementss'}
							required
						/>
						<div className={DebriefingHRStyle.mb50}>
							<label
								style={{
									fontSize: '12px',
									marginBottom: '8px',
									display: 'inline-block',
								}}>
								Required Skills
							</label>
							<span style={{ paddingLeft: '5px' }}>
								<b>*</b>
							</span>
							<Select
								mode="multiple"
								placeholder="Type skills"
								value={selectedItems}
								onChange={setSelectedItems}
								style={{ width: '100%' }}
								options={filteredOptions.map((item) => ({
									value: item,
									label: item,
								}))}
							/>
						</div>
						<div className={DebriefingHRStyle.mb50}>
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
						</div>
					</div>
				</div>
			</div>
			<Divider />
			{/* <AddInterviewer /> */}
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
					className={DebriefingHRStyle.btnPrimary}>
					Next Page
				</button>
			</div>
		</div>
	);
};

export default DebriefingHR;
