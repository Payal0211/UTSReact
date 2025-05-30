import { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, Tag } from 'antd';
import engagementFilterStyle from '../engagement/screens/engagementList/engagementFilter.module.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { ReactComponent as ArrowRightSVG } from 'assets/svg/arrowRight.svg';
import { ReactComponent as CrossSVG } from 'assets/svg/cross.svg';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { InputType } from 'constants/application';

const OnboardFilerList = ({
	setAppliedFilters,
	appliedFilter,
	setCheckedState,
	setFilteredTagLength,
	onRemoveHRFilters,
	checkedState,
	filtersType,
	getHTMLFilter,
	handleHRRequest,
	setTableFilteredState,
	tableFilteredState,
	clearFilters
}) => {
	const [toggleBack, setToggleBack] = useState(false);
	const [searchData, setSearchData] = useState([]);
	const [filterSubChild, setFilterSubChild] = useState(null);

	// useEffect(() => {
	// 	getHTMLFilter
	// 		? setTimeout(() => {
	// 				document.querySelector(`.${engagementFilterStyle.aside}`)
	// 					.classList.add(`${engagementFilterStyle.closeFilter}`);
	// 		  }, 300)
	// 		: document.querySelector(`.${engagementFilterStyle.aside}`)
	// 				.classList.remove(`${engagementFilterStyle.closeFilter}`);
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
					if (filterSubChild?.label === 'Engagement Tenure') {
						filterAddress.value = filterAddress?.value;
						filterAddress.id = filterAddress.id;
						tempAppliedFilters.set(filterObj.filterType, filterAddress);
					} else {
						filterAddress.value = filterAddress?.value + ',' + filterObj.value;
						filterAddress.id = filterAddress.id + ',' + filterObj.id;
						tempAppliedFilters.set(filterObj.filterType, filterAddress);
					}
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
		[appliedFilter, checkedState, setFilteredTagLength],
	);

	

	const handleFilters = useCallback(() => {
		let filters = {};
		appliedFilter.forEach((item) => {
			filters = { ...filters, [item.filterType]: item?.value };
		});

		let filterList = {}

		filtersType.forEach(filter=>{
			filterList[filter.name] = filters[filter.name] ?? ""
		})

		setTableFilteredState({
			...tableFilteredState,
			filterFields_OnBoard: {...tableFilteredState.filterFields_OnBoard, ...filterList} ,
		});		
		onRemoveHRFilters()
	}, [
		appliedFilter,
		setTableFilteredState,
		tableFilteredState,
	]);

	const engagementFilterSearch = (e, data) => {
		let filteredData = data.filter((val) => {
			return val?.text?.toLowerCase().includes(e.target.value.toLowerCase());
		});
		return filteredData;
	};

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
									margin: '0',
									fontWeight: '600',
									padding: '10px 20px',
								}}>
								{splittedIDs[index]}&nbsp;
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
							margin: '0',
							fontWeight: '600',
							padding: '10px 20px',
						}}>
						{item?.value}&nbsp;
					</Tag>
				);
			});
		}
	}, [appliedFilter, handleAppliedFilters]);

	const ClientFeedbackmanager = ()=>{
		const noFeedbackselected = checkedState.get(
			`clientFeedbackNo Feedback`,
		)
		
		const forcheckedStateName = filterSubChild?.child?.filter(item=> item.text !== 'No Feedback').map(child=> `${filterSubChild.name}${child.text}`) 

		const ifOtherCheckSelectedThenNOFeedback = (checkedState)=>{
			let selected = false		
			for(let i= 0;i<forcheckedStateName.length;i++){
				if(checkedState.get(forcheckedStateName[i]) === true){
							selected = true
						}
			}
			return selected
		}

		return (
			searchData && searchData.length > 0 ? (
				searchData.map((item, index) => {
					if(item.text === 'No Feedback'){
						return <div
						className={engagementFilterStyle.filterItem}
						key={index}>
						<Checkbox
							checked={checkedState.get(
								`${filterSubChild?.name}${item.text}`,
							)}
							onChange={(e) => {
								handleAppliedFilters(e.target.checked, {
									filterType: filterSubChild?.name,
									value: item?.value,
									id: item?.text,
								});
							}}
							id={item?.value + `/${index + 1}`}
							style={{
								fontSize: `${!item.label && '1rem'}`,
								fontWeight: '500',
							}}
							disabled={ifOtherCheckSelectedThenNOFeedback(checkedState)}
							>
							{item.text}
						</Checkbox>
					</div>
					}
					return (
						<div
							className={engagementFilterStyle.filterItem}
							key={index}>
							<Checkbox
								checked={checkedState.get(
									`${filterSubChild?.name}${item.text}`,
								)}
								onChange={(e) => {
									handleAppliedFilters(e.target.checked, {
										filterType: filterSubChild?.name,
										value: item?.value,
										id: item?.text,
									});
								}}
								id={item?.value + `/${index + 1}`}
								style={{
									fontSize: `${!item.label && '1rem'}`,
									fontWeight: '500',
								}}
								disabled={noFeedbackselected}
								>
								{item.text}
							</Checkbox>
						</div>
					);
				})
			) : (
				<>
					{filterSubChild?.child?.map((item, index) => {
						if(item.text === 'No Feedback'){
							return <div
							className={engagementFilterStyle.filterItem}
							key={index}>
							<Checkbox
								checked={checkedState.get(
									`${filterSubChild?.name}${item.text}`,
								)}
								onChange={(e) => {
									handleAppliedFilters(e.target.checked, {
										filterType: filterSubChild?.name,
										value: item?.value,
										id: item?.text,
									});
								}}
								id={item?.value + `/${index + 1}`}
								style={{
									fontSize: `${!item.label && '1rem'}`,
									fontWeight: '500',
								}}
								disabled={ifOtherCheckSelectedThenNOFeedback(checkedState)}
								>
								{item.text}
							</Checkbox>
						</div>
						}
						return (
							<div
								className={engagementFilterStyle.filterItem}
								key={index}>
								<Checkbox
									checked={checkedState.get(
										`${filterSubChild?.name}${item.text}`,
									)}
									onChange={(e) => {
										handleAppliedFilters(e.target.checked, {
											filterType: filterSubChild?.name,
											value: item?.value,
											id: item?.text,
										});
									}}
									id={item?.value + `/${index + 1}`}
									style={{
										fontSize: `${!item.label && '1rem'}`,
										fontWeight: '500',
									}}
									disabled={noFeedbackselected}
									>
									{item.text}
								</Checkbox>
							</div>
						);
					})}
				</>
			)
		)
	}

	return (
		<aside className={`${engagementFilterStyle.aside} ${getHTMLFilter && engagementFilterStyle.closeFilter}`}>
			<div className={engagementFilterStyle.asideBody}>
				<div className={toggleBack ? engagementFilterStyle.asideHead : ''}>
					{toggleBack && (
						<span
							className={engagementFilterStyle.goback}
							onClick={() => {
								setToggleBack(false);
								setSearchData([]);
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

				<div className={engagementFilterStyle.asideFilters}>
					{toggleBack ? (
						<>
							<span className={engagementFilterStyle.label}>
								{filterSubChild?.label}
							</span>
							<br />
							{filterSubChild?.isSearch && (
								<div className={engagementFilterStyle.searchFiltersList}>
									<AiOutlineSearch
										style={{ fontSize: '20px', fontWeight: '800' }}
									/>
									<input
										className={engagementFilterStyle.searchInput}
										type={
											filterSubChild?.label === 'Engagement Tenure'
												? InputType.NUMBER
												: InputType.TEXT
										}
										id="search"
										placeholder={`Search ${filterSubChild?.label}`}
										onChange={(e) => {
											return setSearchData(
												engagementFilterSearch(e, filterSubChild?.child),
											);
										}}
									/>
								</div>
							)}
							<br />

							<div className={engagementFilterStyle.filtersListType}>
								{filterSubChild?.label === 'Engagement Tenure' ? (
									searchData && searchData.length > 0 ? (
										searchData.map((item, index) => {
											return (
												<div
													className={engagementFilterStyle.filterItem}
													key={index}>
													<Checkbox
														disabled={
															appliedFilter?.get(`${filterSubChild.name}`) &&
															!checkedState.get(
																`${filterSubChild.name}${item.text}`,
															)
														}
														checked={checkedState.get(
															`${filterSubChild?.name}${item.text}`,
														)}
														onChange={(e) => {
															handleAppliedFilters(e.target.checked, {
																filterType: filterSubChild?.name,
																value: item?.value,
																id: item?.text,
															});
														}}
														id={item?.value + `/${index + 1}`}
														style={{
															fontSize: `${!item.label && '1rem'}`,
															fontWeight: '500',
														}}>
														{item.text}
													</Checkbox>
												</div>
											);
										})
									) : (
										<>
											{filterSubChild?.child?.map((item, index) => {
												return (
													<div
														className={engagementFilterStyle.filterItem}
														key={index}>
														<Checkbox
															disabled={
																appliedFilter?.get(`${filterSubChild.name}`) &&
																!checkedState.get(
																	`${filterSubChild.name}${item.text}`,
																)
															}
															checked={checkedState.get(
																`${filterSubChild?.name}${item.text}`,
															)}
															onChange={(e) => {
																handleAppliedFilters(e.target.checked, {
																	filterType: filterSubChild?.name,
																	value: item?.value,
																	id: item?.text,
																});
															}}
															id={item?.value + `/${index + 1}`}
															style={{
																fontSize: `${!item.label && '1rem'}`,
																fontWeight: '500',
															}}>
															{item.text}
														</Checkbox>
													</div>
												);
											})}

											{/* {filterSubChild?.child?.filteritem?.filterType === "engagementTenure" &&
                                            <div
                                                className={engagementFilterStyle.filterItem}
                                                key={index}>
                                                <Radio.Group onChange={(e) =>
                                                    handleAppliedFilters(e.target.checked, {
                                                        filterType: filterSubChild?.name,
                                                        value: item?.value,
                                                        id: item?.text,
                                                    })
                                                } value={value} id={item?.value + `/${index + 1}`}>
                                                    {filterSubChild?.child.map((item, index) => {
                                                        <Radio value={item?.text}>{item?.text}</Radio>
                                                    }
                                                    )}
                                                </Radio.Group>
                                            </div>
                                        } */}
										</>
									)
								): filterSubChild?.label === 'Client Feedback'  ? <ClientFeedbackmanager /> : searchData && searchData.length > 0 ? (
									searchData.map((item, index) => {
										return (
											<div
												className={engagementFilterStyle.filterItem}
												key={index}>
												<Checkbox
													checked={checkedState.get(
														`${filterSubChild?.name}${item.text}`,
													)}
													onChange={(e) => {
														handleAppliedFilters(e.target.checked, {
															filterType: filterSubChild?.name,
															value: item?.value,
															id: item?.text,
														});
													}}
													id={item?.value + `/${index + 1}`}
													style={{
														fontSize: `${!item.label && '1rem'}`,
														fontWeight: '500',
													}}>
													{item.text}
												</Checkbox>
											</div>
										);
									})
								) : (
									<>
										{filterSubChild?.child?.map((item, index) => {
											return (
												<div
													className={engagementFilterStyle.filterItem}
													key={index}>
													<Checkbox
														checked={checkedState.get(
															`${filterSubChild?.name}${item.text}`,
														)}
														onChange={(e) => {
															handleAppliedFilters(e.target.checked, {
																filterType: filterSubChild?.name,
																value: item?.value,
																id: item?.text,
															});
														}}
														id={item?.value + `/${index + 1}`}
														style={{
															fontSize: `${!item.label && '1rem'}`,
															fontWeight: '500',
														}}>
														{item.text}
													</Checkbox>
												</div>
											);
										})}

										{/* {filterSubChild?.child?.filteritem?.filterType === "engagementTenure" &&
                                          <div
                                              className={engagementFilterStyle.filterItem}
                                              key={index}>
                                              <Radio.Group onChange={(e) =>
                                                  handleAppliedFilters(e.target.checked, {
                                                      filterType: filterSubChild?.name,
                                                      value: item?.value,
                                                      id: item?.text,
                                                  })
                                              } value={value} id={item?.value + `/${index + 1}`}>
                                                  {filterSubChild?.child.map((item, index) => {
                                                      <Radio value={item?.text}>{item?.text}</Radio>
                                                  }
                                                  )}
                                              </Radio.Group>
                                          </div>
                                      } */}
									</>
								)}
							</div>
						</>
					) : (
						<>
							<span className={engagementFilterStyle.label}>Filters</span>
							<div className={engagementFilterStyle.filtersChips}>
								{filteredTags}
							</div>
							<div className={engagementFilterStyle.filtersListType}>
								{filtersType.map((item, index) => {
									return (
										<div
											key={index}
											className={engagementFilterStyle.filterItem}
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
					<div className={engagementFilterStyle.operationsFilters}>
						<button
							className={engagementFilterStyle.clearAll}
							onClick={clearFilters}>
							Clear All
						</button>
						<button
							className={engagementFilterStyle.applyFilters}
							onClick={handleFilters}>
							Apply Filters
						</button>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default OnboardFilerList;
