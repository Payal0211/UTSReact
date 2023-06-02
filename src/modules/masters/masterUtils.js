export const MasterUtils = {
	countryListFormatter: (countryData) => {
		return countryData?.rows?.map((item, index) => ({
			key: `Country${index + 1}`,
			countryName: item?.countryName,
			countryRegion: item?.countryRegion,
		}));
	},
	currencyListFormatter: (currencyData) => {
		return currencyData?.rows?.map((item, index) => ({
			key: `Currency${index + 1}`,
			id: item?.id,
			currencyCode: item?.currencyCode,
			currencySign: item?.currencySign,
			exchangeRate: item?.exchangeRate,
		}));
	},
};
