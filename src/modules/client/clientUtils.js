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
export function clientFormDataFormatter(d) {
	const clientFormDetails = {
		company: {
			company: d.companyName,
			website: d.companyURL,
			location: d.companyLocation,
			companySize: d.companySize,
			address: d.companyAddress,
			linkedinProfile: d.companyLinkedinProfile,
			phone: _isNull(d.companyCountryCode)
				? ''
				: d.companyCountryCode + d.phoneNumber,

			teamManagement: d.remote,
		},
		primaryClient: {
			fullName: d.primaryClientName,
			emailId: d.primaryClientEmailID,
			contactNo: _isNull(d.primaryClientCountryCode)
				? ''
				: d.primaryClientCountryCode + d.primaryClientPhoneNumber,
			designation: d.primaryDesignation,
			linkedin: d.PrimaryClientLinkedinProfile,
		},
		secondaryClients: d.secondaryClient,
		legalInfo: {
			name: d.legalClientFullName,
			email: d.legalClientEmailID,
			designation: d.legalClientDesignation,
			legalCompanyName: d.legalCompanyFullName,
			phoneNumber: _isNull(d.legalClientCountryCode)
				? ''
				: d.legalClientCountryCode + d.legalClientPhoneNumber,
			legalCompanyAddress: d.legalCompanyAddress,
			isAcceptPolicy: true,
		},
		pocList: d.pocList,
		primaryContactName: _isNull(d.primaryContactName)
			? ''
			: d.primaryContactName,
		secondaryContactName: _isNull(d.secondaryContactName)
			? ''
			: d.secondaryContactName,
	};
	return clientFormDetails;
}
