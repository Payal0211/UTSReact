import { useState } from 'react';
import { Checkbox, Radio, Tag } from 'antd';
import hiringFilterStyle from './hiringFilter.module.css';

import { AiOutlineSearch } from 'react-icons/ai';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { ReactComponent as ArrowRightSVG } from 'assets/svg/arrowRight.svg';
import { ReactComponent as CrossSVG } from 'assets/svg/cross.svg';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';


const HiringFilters = ({ onRemoveHRFilters, hrFilterList, filtersType }) => {
	const [toggleBack, setToggleBack] = useState(false);
	const [radioValue, setRadioValue] = useState('')

	const [filterSubChild, setFilterSubChild] = useState(null);
	const toggleFilterSubChild = (item) => {
		setToggleBack(true);
		setFilterSubChild(item);
	};

	const applyFilterClick = () => {
		console.log(radioValue);
	};
		

	const onRadioChangeHandler = (e) => {
		setRadioValue(e.target.value)
		console.log(e.target.value)
	}

	return (
		<aside className={hiringFilterStyle.aside}>
			<div className={hiringFilterStyle.asideBody}>
				<div className={toggleBack ? hiringFilterStyle.asideHead : ''}>
					{toggleBack && (
						<span
							className={hiringFilterStyle.goback}
							onClick={() => setToggleBack(false)}>
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
							onClick={() => onRemoveHRFilters()}
						/>
					</span>
				</div>

				<div className={hiringFilterStyle.asideFilters}>
					{toggleBack ? (
						<>
							<span className={hiringFilterStyle.label}>
								{filterSubChild.name}
							</span>
							<br />
							{filterSubChild.isSearch && (
								<div className={hiringFilterStyle.searchFiltersList}>
									<AiOutlineSearch
										style={{ fontSize: '20px', fontWeight: '800' }}
									/>
									<input
										className={hiringFilterStyle.searchInput}
										type="text"
										id="search"
										placeholder={`Search ${filterSubChild?.name}`}
									/>
								</div>
							)}
							<br />
							<div className={hiringFilterStyle.filtersListType}>
								{filterSubChild.child.map((item, index) => {
									// return item.label ? <h1>fdsf</h1> : <h1>Bye</h1>;
									// console.log(item)
									return (
										<div
											className={hiringFilterStyle.filterItem}
											key={index}>

											<Radio.Group onChange={onRadioChangeHandler} value={radioValue}>
												<Radio
													value={item}
													name={filterSubChild.name}
													style={{
														fontSize: `${!item.label && '1rem'}`,
														fontWeight: '500',
													}}>
													{item.label
														? All_Hiring_Request_Utils.GETHRSTATUS(
															item.statusCode,
															item.label,
														)
														: item}
												</Radio>
											</Radio.Group>

										</div>
									);
								})}
							</div>
						</>
					) : (
						<>
							<span className={hiringFilterStyle.label}>Filters</span>
							<div className={hiringFilterStyle.filtersChips}>
								{hrFilterList.map((item, index) => {
									return (
										<Tag
											key={index}
											closable={true}
											onClose={(e) => {
												e.preventDefault();
												// console.log(index);
												// handleClose(e.target.value);
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
											{item.name}&nbsp;
										</Tag>
									);
								})}
							</div>
							<div className={hiringFilterStyle.filtersListType}>
								{filtersType.map((item, index) => {
									return (
										<div
											key={index}
											className={hiringFilterStyle.filterItem}
											onClick={() => toggleFilterSubChild(item)}>
											<span style={{ fontSize: '1rem' }}>{item.name}</span>

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
					<div className={hiringFilterStyle.operationsFilters}>
						<button className={hiringFilterStyle.clearAll}>Clear All</button>
						<button onClick={applyFilterClick} className={hiringFilterStyle.applyFilters}>
							Apply Filters
						</button>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default HiringFilters;
