import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';
import AddNewPOCStyle from './addPOC.module.css';
import poc from '../clientField/clientField';
import { MasterDAO } from 'core/master/masterDAO';
import { ReactComponent as CircleDeleteSVG } from 'assets/svg/circleDelete.svg';
const AddNewPOC = ({ setValue, fields, append, remove, register, errors ,clientPOCs,controlledFieldsProp}) => {
	let {controlledprimaryContactName, setControlledprimaryContactName,controlledsecondaryContactName, setControlledsecondaryContactName,
		controlledsecondaryONEContactName, setControlledsecondaryONEContactName,controlledsecondaryTWOContactName, setControlledsecondaryTWOContactName } = controlledFieldsProp
	const [salesMan, setSalesMan] = useState([]);
	const getSalesMan = async () => {
		let response = await MasterDAO.getSalesManRequestDAO();
		setSalesMan(response?.responseBody?.details);
	};


	useEffect(() => {
		getSalesMan();
	}, []);

	useEffect(() => {
		if(clientPOCs.length>0 && salesMan.length > 0){
			for(let i = 0; i< clientPOCs.length; i++){
				if(i === 0){
					let filteredClient = salesMan.filter(client => client.id === clientPOCs[i].userId)
					setControlledprimaryContactName(filteredClient[0]?.value)
					setValue('primaryContactName',filteredClient[0])
				}
				if(i === 1){
					let filteredClient = salesMan.filter(client => client.id === clientPOCs[i].userId)
					setValue('secondaryContactName',filteredClient[0])
					setControlledsecondaryContactName(filteredClient[0]?.value)
				}
				if(i === 2){
					let filteredClient = salesMan.filter(client => client.id === clientPOCs[i].userId)
					append({
						contactName: filteredClient[0],
					})
					setValue(`pocList.[${0}].contactName`,filteredClient[0])
					setControlledsecondaryONEContactName(filteredClient[0]?.value)
				}
				if(i === 3){
					let filteredClient = salesMan.filter(client => client.id === clientPOCs[i].userId)
					append({
						contactName: filteredClient[0],
					})
					setValue(`pocList.[${1}].contactName`,filteredClient[0])
					setControlledsecondaryTWOContactName(filteredClient[0]?.value)
				}
			}
		}
	},[clientPOCs,salesMan])

	const onAddNewPOC = useCallback(
		(e) => {
			e.preventDefault();
			append({ ...poc });
		},
		[append],
	);

	const onRemovePOC = useCallback(
		(e, index) => {
			e.preventDefault();
			remove(index);
		},
		[remove],
	);

	return (
		<div className={AddNewPOCStyle.tabsFormItem}>
			<div className={AddNewPOCStyle.tabsFormItemInner}>
				<div className={AddNewPOCStyle.tabsLeftPanel}>
					<h3>Point of Contact</h3>
					<p>Enter the point of contact from Uplers</p>
					{fields.length < 2 && (
						<div className={AddNewPOCStyle.leftPanelAction}>
							<button
								onClick={onAddNewPOC}
								type="button"
								className={AddNewPOCStyle.btn}>
								Add More
							</button>
						</div>
					)}
				</div>

				<div className={AddNewPOCStyle.tabsRightPanel}>
					<div className={AddNewPOCStyle.row}>
						<div className={AddNewPOCStyle.colMd6}>
							<div className={AddNewPOCStyle.formGroup}>
								<HRSelectField
									isControlled={true}
									controlledValue={controlledprimaryContactName}
									setControlledValue={setControlledprimaryContactName} 
									mode={'id/value'}
									setValue={setValue}
									register={register}
									name="primaryContactName"
									label="Primary Contact Name"
									defaultValue="Select primary POC"
									options={salesMan && salesMan}
									required
									isError={
										errors['primaryContactName'] && errors['primaryContactName']
									}
									errorMsg="Please select a primary POC."
									searchable={true}
								/>
							</div>
						</div>

						<div className={AddNewPOCStyle.colMd6}>
							<div className={AddNewPOCStyle.formGroup}>
								<HRSelectField
									isControlled={true}
									controlledValue={controlledsecondaryContactName}
									setControlledValue={setControlledsecondaryContactName} 
									mode={'id/value'}
									setValue={setValue}
									register={register}
									name="secondaryContactName"
									label="Secondary Contact Name"
									defaultValue="Select secondary POC"
									options={salesMan && salesMan}
									searchable={true}
								/>
							</div>
						</div>
						{fields?.map((item, index) => {
							return (
								<div
									className={AddNewPOCStyle.colMd6}
									key={`countPOC${index}`}>
									<div
										className={`${AddNewPOCStyle.formGroup} ${AddNewPOCStyle.formClosed}`}>
										<HRSelectField
											isControlled={true}
											controlledValue={index === 0 ? controlledsecondaryONEContactName : controlledsecondaryTWOContactName}
											setControlledValue={index === 0 ? setControlledsecondaryONEContactName : setControlledsecondaryTWOContactName}  
											mode={'id/value'}
											setValue={setValue}
											register={register}
											name={`pocList.[${index}].contactName`}
											label="Secondary Contact Name"
											defaultValue="Select secondary POC"
											options={salesMan && salesMan}
											searchable={true}
										/>
										<div
											className={AddNewPOCStyle.formClosedICon}
											onClick={(e) => onRemovePOC(e, index)}>
											<CircleDeleteSVG />
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddNewPOC;
