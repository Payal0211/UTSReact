import { useState, useEffect, useRef } from 'react';

export default function useDebounce(asyncFn, delay) {
	const [isReady, setIsReady] = useState(true);
	const functionRef = useRef();

	useEffect(() => {
		functionRef.current = asyncFn;
	}, [asyncFn]);

	const debouncedFunction = useRef(
		debounce(async (...args) => {
			setIsReady(false);
			await functionRef.current(...args);
			setIsReady(true);
		}, delay),
	).current;

	return {
		isReady,
		debouncedFunction,
	};
}

function debounce(fn, delay) {
	let timeoutId;
	return function (...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	};
}
