import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import moment from 'moment';

export const _isNull = function (value) {
	if (value === null || value === undefined || value === '') return true;
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

export const isSaturday = (date) => date.getDay() === 6;

export const isSunday = (date) => date.getDay() === 0;

export const getNthDateExcludingWeekend = (n = 0) => {
	let nthDate = new Date();

	nthDate.setDate(nthDate.getDate() + n);

	if (isSaturday(nthDate)) nthDate.setDate(nthDate.getDate() + 2);
	if (isSunday(nthDate)) nthDate.setDate(nthDate.getDate() + 1);

	return nthDate;
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
export const getInterviewSlotInfo = (interviewDate, startTime, endTime) => {
	interviewDate = getDateInUsFormat(interviewDate);
	startTime = getTimeInHHMM(new Date(startTime));
	endTime = getTimeInHHMM(new Date(endTime));
	return {
		EndTime: endTime,
		STREndTime: interviewDate + ' ' + endTime,
		STRSlotDate: interviewDate,
		STRStartTime: interviewDate + ' ' + startTime,
		SlotDate: interviewDate,
		StartTime: startTime,
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
