import { MasterDAO } from 'core/master/masterDAO';
import { errorDebug } from 'shared/utils/error_debug_utils';
import * as XLSX from 'xlsx';
export const downloadFileUtil = (response) => {
	try {
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

export const downloadToExcel = (response, name = 'DataSheet') => {
	try {
		const worksheet = XLSX.utils.json_to_sheet(response);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		//let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
		//XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
		XLSX.writeFile(workbook, name + ".xlsx");
	} catch (error) {
		errorDebug(error, '--Convert to excel---');
	}
};
export function insertUser(userID, userData, data) {
	const currentData = [...data];

	for (let i = 0; i < currentData.length; i++) {
		if (currentData?.[i]?.key === userID) {
			if (currentData[i]?.children) {
				if (currentData[i]?.children?.length === 0) {
					currentData[i].children.push(
						...transformTeamDemandHierarchy(userData),
					);
				}
			} else {
				currentData[i].children = [...transformTeamDemandHierarchy(userData)];
			}
			return;
		} else if (currentData[i].children?.length > 0) {
			insertUser(userID, userData, currentData[i]?.children);
		}
	}
	return currentData;
}

export const transformTeamDemandHierarchy = (data) => {
	const transformedDataChildren = data?.map((item) => {
		return {
			title: item?.child,
			key: item?.userID,

			...(item.childExists > 0 && {
				children: transformTeamDemandHierarchy(item?.children),
			}),
		};
	});

	return transformedDataChildren;
};

export const formatJDDumpReport = (jdDumpData) => {
	return jdDumpData?.rows.map((item, index) => ({
		key: `JD_Dump${index + 1}`,
		hrCreatedDate: item.hrCreatedDate,
		hrNumber: item.hrNumber,
		jd: item.jdLink,
		jdFile: item?.jdFileName,
		overAllPercentage: item.overAllRowWise,
		skillPercentage: item.jdSkillPercentage,
		rolesResponsibilitiesPercentage: item.jdRolesResponsibilities,
		requirementPercentage: item.jdRequirement,
		jdDumpSkill: item.jdDumpSkill,
		hrSkill: item.hrSkill,
		jdDumpRolesResponsibilities: item.jdDumpRolesResponsibilities,
		hrRolesResponsibilities: item.hrRolesResponsibilities,
		jdRequirement: item.jdDumpRequirement,
		hrRequirement: item.hrRequirement,
		overAllPer: item?.overAllPercentage,
		skillPer: item?.skillPercentage,
		roleResPer: item?.rolesResponsibilitiesPercentage,
		reqPer: item?.requirementPercentage,
	}));
};

export const jdDumpSearch = (e, apiData) => {
	let filteredData = apiData?.filter((val) => {
		return val?.hrNumber.includes(e.target.value);
		//  ||
		// val?.overAllPercentage.includes(e.target.value) ||
		// val?.skillPercentage.includes(e.target.value) ||
		// val?.rolesResponsibilitiesPercentage.includes(e.target.value) ||
		// val.requirementPercentage.includes(e.target.value)
	});

	return filteredData || [];
};
