export function getFlagAndCodeOptions(flagAndCode) {
	let tempArray = [];
	flagAndCode?.forEach((item) => {
		tempArray.push({
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
