import { message, Divider } from 'antd';
import AddCountryStyle from './addCountry.module.css';
import { useCallback, useState } from 'react';
import SpinLoader from 'shared/components/spinLoader/spinLoader';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { InputType } from 'constants/application';
import { useForm } from 'react-hook-form';
import { MasterDAO } from 'core/master/masterDAO';
import { HTTPStatusCode } from 'constants/network';
const AddCountry = ({ onCancel, callAPI, tableFilteredState }) => {
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({});
	const [messageAPI, contextHolder] = message.useMessage();
	const addCountryHandler = useCallback(
		async (d) => {
			setIsLoading(true);
			const response = await MasterDAO.addCountryRequestDAO({
				ID: 0,
				CountryName: d?.countryName,
				CountryRegion: d?.countryRegion,
				IsActive: true,
			});
			if (response?.responseBody === HTTPStatusCode.OK) {
				setIsLoading(false);
				messageAPI.open(
					{
						type: 'success',
						content: 'Country added successfully.',
					},
					1000,
				);
				setTimeout(() => {
					callAPI(tableFilteredState);
					onCancel();
				}, 1000);
			} else {
				setIsLoading(false);
				messageAPI.open(
					{
						type: 'error',
						content: 'Something went wrong.',
					},
					1000,
				);
			}
		},
		[callAPI, messageAPI, onCancel, tableFilteredState],
	);
	return (
		<div className={AddCountryStyle.container}>
			{contextHolder}
			<div className={AddCountryStyle.modalTitle}>
				<h2>Add Country</h2>
			</div>
			<Divider style={{ borderTop: '1px solid #E8E8E8' }} />
			{isLoading ? (
				<SpinLoader />
			) : (
				<div className={AddCountryStyle.transparent}>
					<HRInputField
						required
						register={register}
						errors={errors}
						validationSchema={{
							required: 'please enter the country name.',
						}}
						label="Country Name "
						name={'countryName'}
						type={InputType.TEXT}
						placeholder="Country name"
					/>
					<HRInputField
						required
						register={register}
						errors={errors}
						validationSchema={{
							required: 'please enter the country region.',
						}}
						label="Country Region "
						name={'countryRegion'}
						type={InputType.TEXT}
						placeholder="Country Region"
					/>

					<div className={AddCountryStyle.formPanelAction}>
						<button
							onClick={handleSubmit(addCountryHandler)}
							className={AddCountryStyle.btnPrimary}>
							Add
						</button>
						<button
							onClick={onCancel}
							className={AddCountryStyle.btn}>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default AddCountry;
