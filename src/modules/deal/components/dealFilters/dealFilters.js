import { useCallback, useEffect, useMemo, useState } from 'react';
import DealFiltersStyle from './dealFilterStyle.module.css';
import { ReactComponent as ArrowRightSVG } from 'assets/svg/arrowRight.svg';
import { ReactComponent as CrossSVG } from 'assets/svg/cross.svg';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { AiOutlineSearch } from 'react-icons/ai';
import { Checkbox, Tag } from 'antd';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { dealUtils } from 'modules/deal/dealUtils';

const DealFilters = ({
	onRemoveDealFilters,
	hrFilterList,
	filtersType,
	setAppliedFilters,
	appliedFilter,
	setCheckedState,
	checkedState,
	handleDealRequest,
	setTableFilteredState,
	tableFilteredState,
	setFilteredTagLength,
	getHTMLFilter,
}) => {
	const [toggleBack, setToggleBack] = useState(false);
	const [searchData, setSearchData] = useState([]);
	const [filterSubChild, setFilterSubChild] = useState(null);
	const toggleFilterSubChild = (item) => {
		setToggleBack(true);
		setFilterSubChild(item);
	};
	// useEffect(() => {
	// 	getHTMLFilter
	// 		? setTimeout(() => {
	// 				document
	// 					.querySelector(`.${DealFiltersStyle.aside}`)
	// 					.classList.add(`${DealFiltersStyle.closeFilter}`);
	// 		  }, 300)
	// 		: document
	// 				.querySelector(`.${DealFiltersStyle.aside}`)
	// 				.classList.remove(`${DealFiltersStyle.closeFilter}`);
	// }, [getHTMLFilter]);

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
									margin: '10px 10px 10px 0',
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
							margin: '10px 10px 10px 0',
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
			...tableFilteredState,
			filterFields_DealList: {},
		});
		const reqFilter = {
			...tableFilteredState,
			filterFields_DealList: {},
		};
		 handleDealRequest(reqFilter);
		 onRemoveDealFilters()
	}, [
		handleDealRequest,
		setAppliedFilters,
		setCheckedState,
		setFilteredTagLength,
		setTableFilteredState,
		tableFilteredState,
	]);
	const handleFilters = useCallback(() => {
		let filters = {};
		appliedFilter.forEach((item) => {
			filters = { ...filters, [item.filterType]: item.id };
		});
		setTableFilteredState({
			...tableFilteredState,
			filterFields_DealList: { ...filters },
		});
		const reqFilter = {
			...tableFilteredState,
			filterFields_DealList: { ...filters },
		};
		// handleDealRequest(reqFilter);
		onRemoveDealFilters()
	}, [
		appliedFilter,
		handleDealRequest,
		setTableFilteredState,
		tableFilteredState,
	]);
	return (
		<aside className={`${DealFiltersStyle.aside} ${getHTMLFilter && DealFiltersStyle.closeFilter }`}>
			<div className={DealFiltersStyle.asideBody}>
				<div className={toggleBack ? DealFiltersStyle.asideHead : ''}>
					{toggleBack && (
						<span
							className={DealFiltersStyle.goback}
							onClick={() => {
								setToggleBack(false);
								// setSearchData(hrUtils.searchFiltersList);
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
							onClick={() => onRemoveDealFilters()}
						/>
					</span>
				</div>

				<div className={DealFiltersStyle.asideFilters}>
					{toggleBack ? (
						<>
							<span className={DealFiltersStyle.label}>
								{filterSubChild.label}
							</span>
							<br />
							{filterSubChild.isSearch && (
								<div className={DealFiltersStyle.searchFiltersList}>
									<AiOutlineSearch
										style={{ fontSize: '20px', fontWeight: '800' }}
									/>
									<input
										onChange={(e) => {
											return setSearchData(
												dealUtils.dealFilterSearch(e, filterSubChild.child),
											);
										}}
										class={DealFiltersStyle.searchInput}
										type="text"
										id="search"
										placeholder={`Search ${filterSubChild?.name}`}
									/>
								</div>
							)}
							<br />
							<div className={DealFiltersStyle.filtersListType}>
								{searchData && searchData.length > 0
									? searchData.map((item, index) => {
											return (
												<div
													className={DealFiltersStyle.filterItem}
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
													className={DealFiltersStyle.filterItem}
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
									  })}
							</div>
						</>
					) : (
						<>
							<span className={DealFiltersStyle.label}>Filters</span>
							<div className={DealFiltersStyle.filtersChips}>
								{filteredTags}
							</div>
							<div className={DealFiltersStyle.filtersListType}>
								{filtersType.map((item, index) => {
									return (
										<div
											key={index}
											className={DealFiltersStyle.filterItem}
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
					<br />
					<hr />
					<div className={DealFiltersStyle.operationsFilters}>
						<button
							className={DealFiltersStyle.clearAll}
							onClick={clearFilters}>
							Clear All
						</button>
						<button
							className={DealFiltersStyle.applyFilters}
							onClick={handleFilters}>
							Apply Filters
						</button>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default DealFilters;
