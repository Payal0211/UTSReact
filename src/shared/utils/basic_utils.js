import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import moment from 'moment';

export const _isNull = function (value) {
	if (value === null || value === undefined || value === '' || value === 0) return true;
	else return false;
};
export const _isNotEmpty = function (value) {
	if (typeof value == 'object') {
		if (Array.isArray(value)) {
			if (value !== null && value !== undefined && value.length > 0) {
				return true;
			} else {
				return false;
			}
		} else {
			if (value !== null && value !== undefined) {
				return true;
			} else {
				return false;
			}
		}
	} else {
		if (value !== null && value !== undefined && value !== '') {
			return true;
		} else {
			return false;
		}
	}
};

export const DateTimeUtils = {
	getDateFromString: (dateInStringFormat) => {
		let date = new Date(dateInStringFormat);
		date = date.toLocaleString('en-US');
		let splittedValue = date.split(',');
		return splittedValue[0];
	},
	getTimeFromString: (dateInStringFormat) => {
		let date = new Date(dateInStringFormat);
		date = date.toLocaleString('en-US');

		let splittedValue = date.split(',');

		return splittedValue[1];
	},
	getTodaysDay: () => {
		let date = new Date();
		return date.toLocaleString('en-us', { weekday: 'long' });
	},
};

export const isAuthCodeValid = (statusCode) =>
	statusCode === HTTPStatusCode.UNAUTHORIZED &&
	window.location.replace(UTSRoutes.LOGINROUTE);

export const makeURLParamsFromPayload = (payload) => {
	let url = '';
	Object.entries(payload).forEach(([key, value], index) => {
		if (!!value) url = url + `${key}=${value}&`;
	});

	return `?${url.slice(0, -1)}`;
};

export const lastWorkingDay = (startDate, endDate) => {
	// const formattedStartDate = new Date(startDate).toLocaleDateString('en-US');
	// const formattedEndDate = new Date(endDate).toLocaleDateString('en-US');

	const startMonth = new Date(startDate).getMonth();
	const startYear = new Date(startDate).getFullYear();

	const endMonth = new Date(endDate).getMonth();
	const endYear = new Date(endDate).getFullYear();

	let duration = 0;
	if (endYear > startYear) {
		let yearDiff = parseInt(endYear) - parseInt(startYear);
		let diff =
			parseInt(parseInt(12 * parseInt(yearDiff))) -
			parseInt(startMonth) +
			parseInt(endMonth);
		duration += diff;
	} else {
		duration = parseInt(endMonth) - parseInt(startMonth);
	}

	return duration;
};

export const disabledWeekend = (current) => {
	return moment(current).day() !== 0 && moment(current).day() !== 6;
};

export const isSaturday = (date) => date?.getDay() === 6;

export const isSunday = (date) => date?.getDay() === 0;

export const getNthDateExcludingWeekend = (n = 0) => {
	let nthDate = new Date();

	nthDate.setDate(nthDate.getDate() + n);

	if (isSaturday(nthDate)) nthDate.setDate(nthDate.getDate() + 2);
	if (isSunday(nthDate)) nthDate.setDate(nthDate.getDate() + 1);

	return nthDate;
};
export const getNextWorkingDay = (currDate) => {
	const temp = new Date(currDate);
	if (isSaturday(temp)) return temp.setDate(temp.getDate() + 2);
	return new Date(temp.setDate(temp.getDate() + 1));
};

export const isSlotOverlapping = (slot1, slot2) => {
	return (
		slot1.getDate() === slot2.getDate() &&
		slot1.getMonth() === slot2.getMonth() &&
		slot1.getFullYear() === slot2.getFullYear()
	);
};
export const getSlots = () => {
	const slot1 = getNthDateExcludingWeekend(1);
	const slot2 = isSlotOverlapping(slot1, getNthDateExcludingWeekend(2))
		? getNextWorkingDay(slot1)
		: getNthDateExcludingWeekend(2);

	const slot3 = isSlotOverlapping(
		getNthDateExcludingWeekend(2),
		getNthDateExcludingWeekend(3),
	)
		? getNextWorkingDay(slot2)
		: getNthDateExcludingWeekend(3);
	return {
		slot1,
		slot2,
		slot3,
	};
};

export const defaultStartTime = () => {
	const defaultDate = new Date();
	defaultDate.setHours(10);
	defaultDate.setMinutes(0);
	return defaultDate;
};
export const defaultEndTime = () => {
	const defaultDate = new Date();
	defaultDate.setHours(11);
	defaultDate.setMinutes(0);
	return defaultDate;
};

export const prefixZeroInTime = (hour) => (hour < 10 ? '0' + hour : hour);

export const getTimeInHHMM = (time) =>
	prefixZeroInTime(time.getHours()) + ':' + prefixZeroInTime(time.getMinutes());

export const getDateInUsFormat = (date) =>
	prefixZeroInTime(date.getMonth() + 1) +
	'/' +
	prefixZeroInTime(date.getDate()) +
	'/' +
	date.getFullYear();

export function addHours(date, hours) {
	const dateToUpdate = new Date(date);
	dateToUpdate.setTime(dateToUpdate.getTime() + hours * 60 * 60 * 1000);
	return new Date(dateToUpdate);
}
export const getInterviewSlotInfo = (
	interviewDate,
	startTime,
	endTime,
	index,
) => {
	let formattedDate = new Date(interviewDate);
	interviewDate = getDateInUsFormat(formattedDate);
	startTime = getTimeInHHMM(new Date(startTime));
	endTime = getTimeInHHMM(new Date(endTime));
	return {
		SlotID: index,
		EndTime: endTime,
		STREndTime: interviewDate + ' ' + endTime,
		STRSlotDate: interviewDate,
		STRStartTime: interviewDate + ' ' + startTime,
		SlotDate: interviewDate,
		StartTime: startTime,
		iD_As_ShortListedID: '',
	};
};

export const getPayload = (flag, data) => {
	if (flag === 'POSTAL_CODE') return { ...data, countryCode: '' };
	if (flag === 'COUNTRY_CODE')
		return {
			...data,
		};
	return {
		postalCode: '',
		countryCode: '',
	};
};


export const budgetStringToCommaSeprated =(string)=> {
	
	const containsCommas = /,/.test(string);
	if(containsCommas){
		string = string.replace(/,/g, '')
	}

	try{
		const numericString = string.match(/\d+\.\d+/)[0];

	// Convert the numeric string to a number
	const numericValue = parseFloat(numericString);

	// Convert the numeric value to a comma-separated string
	const commaSeparatedString = numericValue.toLocaleString("en-IN");

	// Concatenate the modified numeric string with the rest of the input string
	const modifiedString = string.replace(numericString, commaSeparatedString);
	return modifiedString
	}catch(err){
		return string
	}

	
}