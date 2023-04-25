import { errorDebug } from 'shared/utils/error_debug_utils';
import * as XLSX from 'xlsx';
export const downloadFileUtil = (response) => {
	try {
		console.log(response, '--response--');
		const fileName = 'my-file';
		const json = JSON.stringify(response, null, 2);
		const blob = new Blob([json], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,',
		});
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

export const downloadToExcel = (response) => {
	try {
		const worksheet = XLSX.utils.json_to_sheet(response);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		//let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
		//XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
		XLSX.writeFile(workbook, 'DataSheet.xlsx');
	} catch (error) {
		errorDebug(error, '--Convert to excel---');
	}
};
