import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { InputType} from 'constants/application';
import editAMStatusStyle from './editAMModal.module.css';
import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';
import SpinLoader from 'shared/components/spinLoader/spinLoader';
import { HttpStatusCode } from 'axios';

const EditAMModal = ({ amToFetch ,closeModal,reloadClientList}) => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		getValues,
		watch,
		formState: { errors },
	} = useForm({});
	const [AMList, setAMList] = useState([]);
	const [messageAPI, contextHolder] = message.useMessage();
	const [isLoading, setIsLoading] = useState(false);
	const [AMDetails, setAMDetails] = useState({});

	

	const updateInterviewStatusHandler = useCallback(
		async (d) => {
			setIsLoading(true);
			let payload = {
				"companyID": AMDetails.companyID,
				"oldAM_SalesPersonID": AMDetails.oldAM_SalesPersonID,
				"newAM_SalesPersonID": d.newAMName,
				"comment": d.note
			}
			const response = await hiringRequestDAO.updateAMNameeDAO(payload)
			if (response.statusCode === HTTPStatusCode.OK) {
				setIsLoading(false);
				messageAPI.open(
					{
						type: 'success',
						content: 'AM Name Updated.',
					},
					1000,
				);
				setTimeout(() => {
					reloadClientList();
					closeModal();
				}, 1000);
			} else {
				setIsLoading(false);
				messageAPI.open(
					{
						type: 'ierror',
						content: 'Something Went Wrong',
					},
					1000,
				);
			}
		},
		[
			AMDetails,closeModal, messageAPI, reloadClientList,
		]
	);

	const getAMDetails = async (data) =>{
		setIsLoading(true)
		let result = await hiringRequestDAO.getAMDetailsDAO(data)

		if(result.statusCode === HttpStatusCode.Ok){
			let details = result.responseBody.details
             setAMList(details.amList.map(val => ({id:val.text, value: val.value})))
			 setValue('amName', details.oldAM_UserName) 
			 setAMDetails(details)
		}
		setIsLoading(false)
	}

	useEffect(() => {
		if(amToFetch.companyID){
			getAMDetails(amToFetch)
		}
		
	}, [amToFetch]);

	return (
		<div className={editAMStatusStyle.container}>
			{contextHolder}
			<div >
				<h2 className={editAMStatusStyle.modalTitle}>Edit AM/NBD Name</h2>
				<p>Company Name: <b>{AMDetails?.companyName?? 'NA'}</b> | Client Name: <b>{AMDetails?.clientName?? 'NA'}</b> | GEO Allocation: <b>{AMDetails?.geo ?? 'NA'}</b></p>
			</div>

			{isLoading ? (
				<SpinLoader />
			) : (
				<div className={editAMStatusStyle.transparent}>
					<div className={editAMStatusStyle.row}>					
					<div className={editAMStatusStyle.colMd6}>
					<HRInputField
												register={register}
												label={'Current AM/NBD Name'}
												name={'amName'}
												type={InputType.TEXT}
												placeholder="Enter AM Name"
												disabled
											/>
					</div>
				<div className={`${editAMStatusStyle.colMd6}  ${editAMStatusStyle.customSelectAMName}`}>
						<HRSelectField
							setValue={setValue}
							register={register}
							searchable={true}
							name="newAMName"
							label="Select New AM/NBD Name"
							defaultValue="Please Select"
							options={AMList?.sort((a, b) => a.value.localeCompare(b.value))}
							required
							isError={errors['newAMName'] && errors['newAMName']}
							errorMsg="Please select AM Name."
							className="custom-select-class"
						/>
					</div>
					</div>

					<div className={editAMStatusStyle.row}>					
					<div className={editAMStatusStyle.colMd12}>
					<HRInputField

						label={'Note/Comments'}
						register={register}
						name={'note'}
						type={InputType.TEXT}
						placeholder="Enter Note/Comment"
						isTextArea
						rows={5}
						required
						validationSchema={{
							required: 'please enter Note/Comments.',
						}}
						isError={errors['note'] && errors['note']}
						errorMsg="Please Enter note / comments."
					/>
					</div>

					</div>
					
					<div className={editAMStatusStyle.formPanelAction}>
						<button
							type="submit"
							onClick={handleSubmit(updateInterviewStatusHandler)}
							className={editAMStatusStyle.btnPrimary}
							disabled={isLoading}
							>
							Save
						</button>
						<button
							onClick={closeModal}
							className={editAMStatusStyle.btn}>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default EditAMModal;
