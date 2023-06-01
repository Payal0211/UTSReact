export const MasterUtils = {
	countryListFormatter: (countryData) => {
		return countryData?.rows.map((item, index) => ({
			key: `Country${index + 1}`,
			countryName: item?.countryName,
			countryRegion: item?.countryRegion,
		}));
	},
};
