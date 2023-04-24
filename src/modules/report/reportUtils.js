import { errorDebug } from 'shared/utils/error_debug_utils';

export const downloadFileUtil = (response) => {
	try {
		console.log(response, '--response--');
		const fileName = 'my-file';
		const json = JSON.stringify(response, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const href = URL.createObjectURL(blob);

		// create "a" HTLM element with href to file
		const link = document.createElement('a');
		link.href = href;
		link.download = fileName + '.xlsx';
		document.body.appendChild(link);
		link.click();

		// clean up "a" element & remove ObjectURL
		document.body.removeChild(link);
		URL.revokeObjectURL(href);
	} catch (error) {
		errorDebug(error, '-DOWNLOAD FILE UTILS--');
	}
};
