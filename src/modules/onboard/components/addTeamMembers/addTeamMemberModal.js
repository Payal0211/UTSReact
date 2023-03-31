import { Divider, Modal } from 'antd';
import AddTeamMemberStyle from './addTeamMember.module.css';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';
import { InputType } from 'constants/application';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MasterDAO } from 'core/master/masterDAO';
const AddTeamMemberModal = ({
	membersIndex,
	isFooter,
	openModal,
	cancelModal,
	modalTitle,
	teamMemberList,
	setTeamMembers,
	editMode,
}) => {
	const {
		watch,
		register,
		handleSubmit,
		setValue,
		getValues,
		setError,
		control,
		formState: { errors },
	} = useForm({});

	const [reportingTo, setReportingTo] = useState([]);
	const [buddy, setBuddy] = useState([]);
	const [controlledReportingTo, setControlledReportingTo] =
		useState('Please Select');
	const [controlledBuddy, setControlledBuddy] = useState('Please Select');
	const getReportingToHandler = useCallback(async () => {
		const response = await MasterDAO.getYesNoOptionRequestDAO();
		setReportingTo(response && response?.responseBody?.details);
	}, []);
	const getBuddyHandler = useCallback(async () => {
		const response = await MasterDAO.getBuddyRequestDAO();
		setBuddy(response && response?.responseBody?.details);
	}, []);

	const addTeamMemeberHandler = (d) => {
		const teamMembersValue = {
			name: d.teamMembersName,
			designation: d.teamMembersDesignation,
			reportingTo: d.teamMemberReportingTo?.value,
			linkedin: d.teamMembersLinkedin,
			email: d.teamMembersEmail,
			buddy: d.teamMemberBuddy?.value,
			additionalNotes: d.teamMembersAdditionalNotes,
		};
		if (editMode) {
			teamMemberList[membersIndex] = teamMembersValue;
			setTeamMembers(teamMemberList);
		} else setTeamMembers([...teamMemberList, teamMembersValue]);
		cancelModal();
	};

	useEffect(() => {
		if (editMode) {
			setValue('teamMembersName', teamMemberList?.[membersIndex]?.name);
			setValue(
				'teamMembersDesignation',
				teamMemberList?.[membersIndex]?.designation,
			);

			setControlledReportingTo(teamMemberList?.[membersIndex]?.reportingTo);
			setValue('teamMembersLinkedin', teamMemberList?.[membersIndex]?.linkedin);
			setValue('teamMembersEmail', teamMemberList?.[membersIndex]?.email);

			setControlledBuddy(teamMemberList?.[membersIndex]?.buddy);
		}
	}, [editMode, membersIndex, setValue, teamMemberList]);
	useEffect(() => {
		getReportingToHandler();
		getBuddyHandler();
		if (cancelModal) {
			return () => {
				setReportingTo([]);
				setBuddy([]);
				setValue('teamMembersName', '');
				setValue('teamMembersDesignation', '');
				setValue('teamMemberReportingTo', {});
				setControlledBuddy(null);
				setControlledReportingTo(null);
				setValue('teamMembersLinkedin', '');
				setValue('teamMembersEmail', '');
				setValue('teamMembersAdditionalNotes', '');
				setValue('teamMemberBuddy', {});
			};
		}
	}, [cancelModal, getBuddyHandler, getReportingToHandler, setValue]);

	return (
		<Modal
			width="930px"
			centered
			footer={isFooter}
			open={openModal}
			onCancel={cancelModal}>
			<h1>{modalTitle}</h1>
			<Divider style={{ borderTop: '1px solid #E8E8E8' }} />
			<form>
				<div className={AddTeamMemberStyle.m10}>
					<div className={AddTeamMemberStyle.row}>
						<div className={AddTeamMemberStyle.colMd6}>
							<HRInputField
								// value={editMode ? teamMemberList?.[membersIndex]?.name : null}
								register={register}
								errors={errors}
								validationSchema={{
									required: 'Please enter team members name',
								}}
								label={'Name'}
								name="teamMembersName"
								type={InputType.TEXT}
								placeholder="Enter Name "
								required
							/>
						</div>
						<div className={AddTeamMemberStyle.colMd6}>
							<HRInputField
								// value={
								// 	editMode ? teamMemberList?.[membersIndex]?.designation : null
								// }
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the team members designation',
								}}
								label="Designation"
								name="teamMembersDesignation"
								type={InputType.TEXT}
								placeholder="Enter Designation"
								required
							/>
						</div>
					</div>
					<div className={AddTeamMemberStyle.row}>
						<div className={AddTeamMemberStyle.colMd6}>
							<div className={AddTeamMemberStyle.formGroup}>
								<HRSelectField
									controlledValue={controlledReportingTo}
									isControlled={true}
									setControlledValue={setControlledReportingTo}
									mode={'id/value'}
									setValue={setValue}
									register={register}
									label={'Reporting To'}
									defaultValue={'Reporting To'}
									options={reportingTo}
									name="teamMemberReportingTo"
									isError={
										errors['teamMemberReportingTo'] &&
										errors['teamMemberReportingTo']
									}
									required
									errorMsg={'Please select reporting to'}
								/>
							</div>
						</div>
						<div className={AddTeamMemberStyle.colMd6}>
							<HRInputField
								// value={
								// 	editMode ? teamMemberList?.[membersIndex]?.linkedin : null
								// }
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the team members linkedin',
								}}
								label="Linkedin"
								name="teamMembersLinkedin"
								type={InputType.TEXT}
								placeholder="Enter Linkedin"
								required
							/>
						</div>
					</div>
					<div className={AddTeamMemberStyle.row}>
						<div className={AddTeamMemberStyle.colMd6}>
							<HRInputField
								// value={editMode ? teamMemberList?.[membersIndex]?.email : null}
								register={register}
								errors={errors}
								validationSchema={{
									required: 'Please enter team members email',
								}}
								label={'Email'}
								name="teamMembersEmail"
								type={InputType.EMAIL}
								placeholder="Enter Email "
								required
							/>
						</div>
						<div className={AddTeamMemberStyle.colMd6}>
							<div className={AddTeamMemberStyle.formGroup}>
								<HRSelectField
									controlledValue={controlledBuddy}
									isControlled={true}
									setControlledValue={setControlledBuddy}
									mode={'id/value'}
									setValue={setValue}
									register={register}
									label={'Buddy'}
									defaultValue={'Select Buddy'}
									options={buddy}
									name="teamMemberBuddy"
									isError={
										errors['teamMemberBuddy'] && errors['teamMemberBuddy']
									}
									required
									errorMsg={'Please select buddy'}
								/>
							</div>
						</div>
					</div>
					<div className={AddTeamMemberStyle.row}>
						<div className={AddTeamMemberStyle.colMd12}>
							<HRInputField
								register={register}
								label={'Additional Notes'}
								name="teamMembersAdditionalNotes"
								type={InputType.TEXT}
								placeholder="Enter Additional Notes "
							/>
						</div>
					</div>
					<div className={AddTeamMemberStyle.formPanelAction}>
						<button
							className={AddTeamMemberStyle.btnPrimary}
							onClick={handleSubmit(addTeamMemeberHandler)}>
							Save
						</button>

						<button
							onClick={cancelModal}
							className={AddTeamMemberStyle.btn}>
							Cancel
						</button>
					</div>
				</div>
			</form>
		</Modal>
	);
};

export default AddTeamMemberModal;
