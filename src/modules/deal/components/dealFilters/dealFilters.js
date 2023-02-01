import { useState } from 'react';
import DealFiltersStyle from './dealFilterStyle.module.css';
import { ReactComponent as ArrowRightSVG } from 'assets/svg/arrowRight.svg';
import { ReactComponent as CrossSVG } from 'assets/svg/cross.svg';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { AiOutlineSearch } from 'react-icons/ai';
import { Checkbox, Tag } from 'antd';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';

const DealFilters = ({ onRemoveDealFilters, hrFilterList, filtersType }) => {
	const [toggleBack, setToggleBack] = useState(false);

	const [filterSubChild, setFilterSubChild] = useState(null);
	const toggleFilterSubChild = (item) => {
		setToggleBack(true);
		setFilterSubChild(item);
	};
	return (
		<aside className={DealFiltersStyle.aside}>
			<div className={DealFiltersStyle.asideBody}>
				<div className={toggleBack ? DealFiltersStyle.asideHead : ''}>
					{toggleBack && (
						<span
							className={DealFiltersStyle.goback}
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
							onClick={() => onRemoveDealFilters()}
						/>
					</span>
				</div>

				<div className={DealFiltersStyle.asideFilters}>
					{toggleBack ? (
						<>
							<span className={DealFiltersStyle.label}>
								{filterSubChild.name}
							</span>
							<br />
							{filterSubChild.isSearch && (
								<div className={DealFiltersStyle.searchFiltersList}>
									<AiOutlineSearch
										style={{ fontSize: '20px', fontWeight: '800' }}
									/>
									<input
										class={DealFiltersStyle.searchInput}
										type="text"
										id="search"
										placeholder={`Search ${filterSubChild?.name}`}
									/>
								</div>
							)}
							<br />
							<div className={DealFiltersStyle.filtersListType}>
								{filterSubChild.child.map((item, index) => {
									return (
										<div
											className={DealFiltersStyle.filterItem}
											key={index}>
											<Checkbox
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
								{hrFilterList.map((item, index) => {
									return (
										<Tag
											key={index}
											closable={true}
											onClose={(e) => {
												e.preventDefault();
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
							<div className={DealFiltersStyle.filtersListType}>
								{filtersType.map((item, index) => {
									return (
										<div
											key={index}
											className={DealFiltersStyle.filterItem}
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
					<div className={DealFiltersStyle.operationsFilters}>
						<button className={DealFiltersStyle.clearAll}>Clear All</button>
						<button className={DealFiltersStyle.applyFilters}>
							Apply Filters
						</button>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default DealFilters;
