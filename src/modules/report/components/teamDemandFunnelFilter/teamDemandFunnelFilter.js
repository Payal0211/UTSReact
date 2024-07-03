import { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, Tag } from 'antd';
import SupplyFunnelFilterStyle from './teamDemandFunnelFIlter.module.css';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { ReactComponent as ArrowRightSVG } from 'assets/svg/arrowRight.svg';
import { ReactComponent as CrossSVG } from 'assets/svg/cross.svg';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { hrUtils } from 'modules/hiring request/hrUtils';

const TeamDemandFunnelFilter = ({
	setAppliedFilters,
	appliedFilter,
	setCheckedState,
	handleHRRequest,
	setFilteredTagLength,
	onRemoveHRFilters,
	checkedState,
	hrFilterList,
	tableFilteredState,
	setTableFilteredState,
	filtersType,
	getHTMLFilter,
	selectedHierarchy,
	setTeamDemandFunnelHRDetailsState,
	teamDemandFunnelHRDetailsState,
	isActionWise,
}) => {
	const [toggleBack, setToggleBack] = useState(false);
	const [searchData, setSearchData] = useState([]);
	const [filterSubChild, setFilterSubChild] = useState(null);

	// useEffect(() => {
	// 	getHTMLFilter
	// 		? setTimeout(() => {
	// 				document
	// 					.querySelector(`.${SupplyFunnelFilterStyle.aside}`)
	// 					.classList.add(`${SupplyFunnelFilterStyle.closeFilter}`);
	// 		  }, 300)
	// 		: document
	// 				.querySelector(`.${SupplyFunnelFilterStyle.aside}`)
	// 				.classList.remove(`${SupplyFunnelFilterStyle.closeFilter}`);
	// }, [getHTMLFilter]);

	const toggleFilterSubChild = (item) => {
		setToggleBack(true);
		setFilterSubChild(item);
	};
	const handleAppliedFilters = useCallback(
		(isChecked, filterObj) => {
			let tempAppliedFilters = new Map(appliedFilter);
			let tempCheckedState = new Map(checkedState);
			if (isChecked) {
				tempCheckedState.set(`${filterObj.filterType}${filterObj.id}`, true);
				setFilteredTagLength((prev) => prev + 1);
			} else {
				tempCheckedState.set(`${filterObj.filterType}${filterObj.id}`, false);
				setFilteredTagLength((prev) => prev - 1);
			}
			if (tempAppliedFilters.has(filterObj.filterType)) {
				let filterAddress = tempAppliedFilters.get(filterObj.filterType);
				if (isChecked) {
					filterAddress.value = filterAddress?.value + ',' + filterObj.value;
					filterAddress.id = filterAddress.id + ',' + filterObj.id;
					tempAppliedFilters.set(filterObj.filterType, filterAddress);
				} else {
					let splittedID = filterAddress.id.split(',');
					let splittedIDIndex = splittedID.indexOf(filterObj.id);
					splittedID = [
						...splittedID.slice(0, splittedIDIndex),
						...splittedID.slice(splittedIDIndex + 1),
					];

					let splittedValue = filterAddress.value.split(',');
					let splittedValueIndex = splittedValue.indexOf(filterObj.value);
					splittedValue = [
						...splittedValue.slice(0, splittedValueIndex),
						...splittedValue.slice(splittedValueIndex + 1),
					];
					filterAddress.value = splittedValue.toString();
					filterAddress.id = splittedID.toString();
					splittedID.length === 0
						? tempAppliedFilters.delete(filterObj.filterType)
						: tempAppliedFilters.set(filterObj.filterType, filterAddress);
				}
			} else {
				tempAppliedFilters.set(filterObj.filterType, filterObj);
			}
			setAppliedFilters(tempAppliedFilters);
			setCheckedState(tempCheckedState);
		},
		[
			appliedFilter,
			checkedState,
			setAppliedFilters,
			setCheckedState,
			setFilteredTagLength,
		],
	);

	const filteredTags = useMemo(() => {
		if (appliedFilter.size > 0) {
			return Array.from(appliedFilter?.values()).map((item) => {
				const splittedTags = item?.value.split(',');
				const splittedIDs = item?.id.split(',');
				if (splittedTags.length > 0) {
					return splittedTags?.map((splittedItem, index) => {
						return (
							<Tag
								key={`${item.filterType}_${splittedIDs[index]}`}
								closable={true}
								onClose={(e) => {
									e.preventDefault();
									handleAppliedFilters(false, {
										filterType: item?.filterType,
										value: splittedItem,
										id: splittedIDs[index],
									});
								}}
								style={{
									display: 'flex',
									justifyContent: 'space-around',
									alignItems: 'center',
									backgroundColor: `var(--color-sunlight)`,
									border: 'none',
									borderRadius: '10px',
									fontSize: '.8rem',
									margin: '4px 4px 4px 0',
									fontWeight: '600',
									padding: '10px 20px',
								}}>
								{splittedItem}&nbsp;
							</Tag>
						);
					});
				}
				return (
					<Tag
						key={`${item.filterType}_${item?.id}`}
						closable={true}
						onClose={(e) => {
							e.preventDefault();
							handleAppliedFilters(false, {
								filterType: item?.filterType,
								value: item.value,
								id: item.id,
							});
						}}
						style={{
							display: 'flex',
							justifyContent: 'space-around',
							alignItems: 'center',
							backgroundColor: `var(--color-sunlight)`,
							border: 'none',
							borderRadius: '10px',
							fontSize: '.8rem',
							margin: '4px 4px 4px 0',
							fontWeight: '600',
							padding: '10px 20px',
						}}>
						{item?.value}&nbsp;
					</Tag>
				);
			});
		}
	}, [appliedFilter, handleAppliedFilters]);

	const clearFilters = useCallback(() => {
		setAppliedFilters(new Map());
		setCheckedState(new Map());
		setFilteredTagLength(0);
		setTableFilteredState({
			startDate: '',
			endDate: '',
			salesManagerID: selectedHierarchy?.id,
			isHiringNeedTemp: '',
			modeOfWork: '',
			typeOfHR: '-1',
			companyCategory: '',
			isActionWise: isActionWise,
		});
		const reqFilter = {
			startDate: '',
			endDate: '',
			salesManagerID: selectedHierarchy?.id,
			isHiringNeedTemp: '',
			modeOfWork: '',
			typeOfHR: '-1',
			companyCategory: '',
			isActionWise: isActionWise,
		};

		handleHRRequest(reqFilter);
		onRemoveHRFilters();
	}, [
		handleHRRequest,
		isActionWise,
		selectedHierarchy?.id,
		setAppliedFilters,
		setCheckedState,
		setFilteredTagLength,
		setTableFilteredState,
	]);
	const handleFilters = useCallback(() => {
		let filters = {};
		appliedFilter.forEach((item) => {
			filters = {
				...filters,
				[item.filterType]:
					item?.filterType === 'companyCategory' ? item?.value : item.id,
			};
		});
		setTableFilteredState({
			...tableFilteredState,
			...filters,
		});
		const reqFilter = {
			...tableFilteredState,
			...filters,
			// filterFields_ViewAllHRs: { ...filters },
		};

		if (reqFilter?.isActionWise === '1') reqFilter.isActionWise = true;
		else reqFilter.isActionWise = false;
		setTableFilteredState(reqFilter);
		handleHRRequest(reqFilter);
		onRemoveHRFilters();
	}, [
		appliedFilter,
		handleHRRequest,
		setTableFilteredState,
		tableFilteredState,
	]);

	return (
		<aside className={`${SupplyFunnelFilterStyle.aside} ${getHTMLFilter && SupplyFunnelFilterStyle.closeFilter}`}>
			<div className={SupplyFunnelFilterStyle.asideBody}>
				<div className={toggleBack ? SupplyFunnelFilterStyle.asideHead : ''}>
					{toggleBack && (
						<span
							className={SupplyFunnelFilterStyle.goback}
							onClick={() => {
								setToggleBack(false);
								setSearchData(hrUtils.searchFiltersList);
							}}>
							<ArrowLeftSVG />
							&nbsp;&nbsp; Go back
						</span>
					)}
					<span
						style={{
							display: 'flex',
							justifyContent: 'end',
							cursor: 'pointer',
						}}>
						<CrossSVG
							style={{ width: '26px' }}
							onClick={() => {
								onRemoveHRFilters();
							}}
						/>
					</span>
				</div>

				<div className={SupplyFunnelFilterStyle.asideFilters}>
					{toggleBack ? (
						<>
							<span className={SupplyFunnelFilterStyle.label}>
								{filterSubChild.label}
							</span>
							<br />
							<div className={SupplyFunnelFilterStyle.filtersListType}>
								{searchData && searchData.length > 0
									? searchData.map((item, index) => {
											return (
												<div
													className={SupplyFunnelFilterStyle.filterItem}
													key={index}>
													<Checkbox
														checked={checkedState.get(
															`${filterSubChild.name}${item.text}`,
														)}
														onChange={(e) =>
															handleAppliedFilters(e.target.checked, {
																filterType: filterSubChild.name,
																value: item?.value,
																id: item?.text,
															})
														}
														id={item?.value + `/${index + 1}`}
														style={{
															fontSize: `${!item.label && '1rem'}`,
															fontWeight: '500',
														}}>
														{item.label
															? All_Hiring_Request_Utils.GETHRSTATUS(
																	item.statusCode,
																	item.label,
															  )
															: item?.value}
													</Checkbox>
												</div>
											);
									  })
									: filterSubChild.child.map((item, index) => {
											return (
												<div
													className={SupplyFunnelFilterStyle.filterItem}
													key={index}>
													<Checkbox
														disabled={
															appliedFilter?.get(`${filterSubChild.name}`) &&
															!checkedState.get(
																`${filterSubChild.name}${item.text}`,
															)
														}
														checked={checkedState.get(
															`${filterSubChild.name}${item.text}`,
														)}
														onChange={(e) =>
															handleAppliedFilters(e.target.checked, {
																filterType: filterSubChild.name,
																value: item?.value,
																id: item?.text,
															})
														}
														id={item?.value + `/${index + 1}`}
														style={{
															fontSize: `${!item.label && '1rem'}`,
															fontWeight: '500',
														}}>
														{item.label
															? All_Hiring_Request_Utils.GETHRSTATUS(
																	item.statusCode,
																	item.label,
															  )
															: item?.value}
													</Checkbox>
												</div>
											);
									  })}
							</div>
						</>
					) : (
						<>
							<span className={SupplyFunnelFilterStyle.label}>Filters</span>
							<div className={SupplyFunnelFilterStyle.filtersChips}>
								{filteredTags}
							</div>
							<div className={SupplyFunnelFilterStyle.filtersListType}>
								{filtersType.map((item, index) => {
									return (
										<div
											key={index}
											className={SupplyFunnelFilterStyle.filterItem}
											onClick={() => toggleFilterSubChild(item)}>
											<span style={{ fontSize: '1rem' }}>{item.label}</span>
											<ArrowRightSVG style={{ width: '26px' }} />
										</div>
									);
								})}
							</div>
						</>
					)}
					<br />
					<hr />
					<div className={SupplyFunnelFilterStyle.operationsFilters}>
						<button
							className={SupplyFunnelFilterStyle.clearAll}
							onClick={clearFilters}>
							Clear All
						</button>
						<button
							className={SupplyFunnelFilterStyle.applyFilters}
							onClick={handleFilters}>
							Apply Filters
						</button>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default TeamDemandFunnelFilter;
