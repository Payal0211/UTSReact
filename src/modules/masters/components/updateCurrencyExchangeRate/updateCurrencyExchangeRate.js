import { message, Divider } from 'antd';
import UpdateExchangeRateStyle from './updateCurrencyExchange.module.css';
import { useCallback, useEffect, useState } from 'react';
import SpinLoader from 'shared/components/spinLoader/spinLoader';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { InputType } from 'constants/application';
import { useForm } from 'react-hook-form';
import { MasterDAO } from 'core/master/masterDAO';
import { HTTPStatusCode } from 'constants/network';
const UpdateExchangeRate = ({
	onCancel,
	callAPI,
	tableFilteredState,
	exchangeRateToEdit,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const {
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({});
	const [messageAPI, contextHolder] = message.useMessage();
	const updateExchangeRateHandler = useCallback(
		async (d) => {
			setIsLoading(true);
			const response = await MasterDAO.updateCurrencyExchangeRateListRequestDAO(
				{
					ID: exchangeRateToEdit?.id,
					ExchangeRate: d?.exchangeRate,
				},
			);
			if (response?.statusCode === HTTPStatusCode.OK) {
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
						content: response?.responseBody || 'Something went wrong.',
					},
					1000,
				);
			}
		},
		[callAPI, exchangeRateToEdit?.id, messageAPI, onCancel, tableFilteredState],
	);
	useEffect(() => {
		setValue('currencyCode', exchangeRateToEdit?.currencyCode);
		setValue('exchangeRate', exchangeRateToEdit?.exchangeRate);
	}, [
		exchangeRateToEdit?.currencyCode,
		exchangeRateToEdit?.exchangeRate,
		setValue,
	]);
	return (
		<div className={UpdateExchangeRateStyle.container}>
			{contextHolder}
			<div className={UpdateExchangeRateStyle.modalTitle}>
				<h2>Update Exchange Rate</h2>
			</div>
			<Divider style={{ borderTop: '1px solid #E8E8E8' }} />
			{isLoading ? (
				<SpinLoader />
			) : (
				<div className={UpdateExchangeRateStyle.transparent}>
					<HRInputField
						required
						register={register}
						label="Currency Code "
						name={'currencyCode'}
						type={InputType.TEXT}
						disabled={true}
						placeholder="Currency Code"
					/>
					<HRInputField
						required
						register={register}
						errors={errors}
						validationSchema={{
							required: 'please enter the exchange rate.',
						}}
						label="Exchange Rate "
						name={'exchangeRate'}
						type={InputType.TEXT}
						placeholder="Exchange Rate"
					/>

					<div className={UpdateExchangeRateStyle.formPanelAction}>
						<button
							onClick={handleSubmit(updateExchangeRateHandler)}
							className={UpdateExchangeRateStyle.btnPrimary}>
							Update Rate
						</button>
						<button
							onClick={onCancel}
							className={UpdateExchangeRateStyle.btn}>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default UpdateExchangeRate;
