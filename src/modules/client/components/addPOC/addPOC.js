import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React from 'react';
import { useCallback } from 'react';
import AddNewPOCStyle from './addPOC.module.css';
import poc from '../clientField/clientField';

const AddNewPOC = ({
	salesManData,
	setValue,
	fields,
	append,
	remove,
	register,
	errors,
}) => {
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
					<div className={AddNewPOCStyle.leftPanelAction}>
						<button
							onClick={onAddNewPOC}
							type="button"
							className={AddNewPOCStyle.btn}>
							Add More
						</button>
					</div>
				</div>

				<div className={AddNewPOCStyle.tabsRightPanel}>
					<div className={AddNewPOCStyle.row}>
						<div className={AddNewPOCStyle.colMd6}>
							<div className={AddNewPOCStyle.formGroup}>
								<HRSelectField
									setValue={setValue}
									register={register}
									name="primaryContactName"
									label="Primary Contact Name"
									defaultValue="Select primary POC"
									options={salesManData}
									required
									isError={
										errors['primaryContactName'] && errors['primaryContactName']
									}
									errorMsg="Please select a primary POC."
								/>
							</div>
						</div>

						<div className={AddNewPOCStyle.colMd6}>
							<div className={AddNewPOCStyle.formGroup}>
								<HRSelectField
									setValue={setValue}
									register={register}
									name="secondaryContactName"
									label="Secondary Contact Name"
									defaultValue="Select secondary POC"
									options={salesManData}
								/>
							</div>
						</div>
						{fields?.map((item, index) => {
							return (
								<div
									className={AddNewPOCStyle.colMd6}
									key={`countPOC${index}`}>
									<div className={AddNewPOCStyle.formGroup}>
										<HRSelectField
											setValue={setValue}
											register={register}
											name={`pocList.[${index}].contactName`}
											label="Secondary Contact Name"
											defaultValue="Select secondary POC"
											options={salesManData}
										/>
									</div>
									<div onClick={(e) => onRemovePOC(e, index)}>X</div>
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
