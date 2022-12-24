import { SubmitType } from 'constants/application';
import { _isNull } from 'shared/utils/basic_utils';

export function getFlagAndCodeOptions(flagAndCode) {
	let tempArray = [];
	flagAndCode?.forEach((item) => {
		tempArray.push({
			id: item.ccode,
			value: item.ccode,
			label: getFlagLabel(item),
		});
	});
	return tempArray;
}

function getFlagLabel(item) {
	return (
		<>
			<img
				src={item?.flag}
				width="20"
				height="20"
				alt={''}
			/>
			{item?.ccode}
		</>
	);
}
export function locationFormatter(location) {
	let tempArray = [];
	location?.forEach((item) => {
		tempArray.push({
			id: item.value,
			value: item.value,
		});
	});
	return tempArray;
}
export function clientFormDataFormatter(d, draft, contactID, watch) {
	const clientFormDetails = {
		isSaveasDraft: draft === SubmitType.SAVE_AS_DRAFT && true,
		company: {
			company:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('companyName')
					: d.companyName,
			website:
				draft === SubmitType.SAVE_AS_DRAFT ? watch('companyURL') : d.companyURL,
			location:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('companyLocation'))
						? ''
						: watch('companyLocation')
					: d.companyLocation,
			companySize:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('companySize')
					: d.companySize,
			address:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('companyAddress')
					: d.companyAddress,
			linkedinProfile:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('companyLinkedinProfile')
					: d.companyLinkedinProfile,
			phone: _isNull(d.companyCountryCode)
				? ''
				: draft === SubmitType.SAVE_AS_DRAFT
				? watch('companyCountryCode') + watch('phoneNumber')
				: d.companyCountryCode + d.phoneNumber,

			teamManagement:
				draft === SubmitType.SAVE_AS_DRAFT ? watch('companyName') : d.remote,
		},
		primaryClient: {
			id: !_isNull(contactID) ? contactID : 0,
			fullName:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('primaryClientName')
					: d.primaryClientName,
			emailId:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('primaryClientEmailID')
					: d.primaryClientEmailID,
			contactNo: _isNull(d.primaryClientCountryCode)
				? ''
				: draft === SubmitType.SAVE_AS_DRAFT
				? watch('primaryClientCountryCode') + watch('primaryClientPhoneNumber')
				: d.primaryClientCountryCode + d.primaryClientPhoneNumber,
			designation:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('primaryDesignation')
					: d.primaryDesignation,
			linkedin:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('PrimaryClientLinkedinProfile')
					: d.PrimaryClientLinkedinProfile,
		},
		secondaryClients:
			draft === SubmitType.SAVE_AS_DRAFT
				? watch('secondaryClient')
				: d.secondaryClient,
		legalInfo: {
			name:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('legalClientFullName')
					: d.legalClientFullName,
			email:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('legalClientEmailID')
					: d.legalClientEmailID,
			designation:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('legalClientDesignation')
					: d.legalClientDesignation,
			legalCompanyName:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('legalCompanyFullName')
					: d.legalCompanyFullName,
			phoneNumber: _isNull(d.legalClientCountryCode)
				? ''
				: draft === SubmitType.SAVE_AS_DRAFT
				? watch('legalClientCountryCode') + watch('legalClientPhoneNumber')
				: d.legalClientCountryCode + d.legalClientPhoneNumber,
			legalCompanyAddress:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('legalCompanyAddress')
					: d.legalCompanyAddress,
			isAcceptPolicy: true,
		},
		pocList: draft === SubmitType.SAVE_AS_DRAFT ? watch('pocList') : d.pocList,
		primaryContactName: _isNull(d.primaryContactName)
			? ''
			: draft === SubmitType.SAVE_AS_DRAFT
			? watch('primaryContactName').toString()
			: d.primaryContactName.toString(),
		secondaryContactName: _isNull(d.secondaryContactName)
			? ''
			: draft === SubmitType.SAVE_AS_DRAFT
			? watch('secondaryContactName').toString()
			: d.secondaryContactName.toString(),
	};
	return clientFormDetails;
}
