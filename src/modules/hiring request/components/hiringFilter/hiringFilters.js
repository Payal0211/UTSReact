import { useState } from 'react';
import { Checkbox, Tag } from 'antd';
import hiringFilterStyle from './hiringFilter.module.css';
import { MdNavigateNext, MdArrowBackIosNew } from 'react-icons/md';
import { GrFormClose } from 'react-icons/gr';
import { AiOutlineSearch } from 'react-icons/ai';

const HiringFilters = ({ onRemoveHRFilters, hrFilterList, filtersType }) => {
	const [toggleBack, setToggleBack] = useState(false);

	const [filterSubChild, setFilterSubChild] = useState(null);

	const toggleFilterSubChild = (item) => {
		setToggleBack(true);
		setFilterSubChild(item);
	};

	return (
		<aside className={hiringFilterStyle.aside}>
			<div className={hiringFilterStyle.asideBody}>
				<div className={toggleBack && hiringFilterStyle.asideHead}>
					{toggleBack && (
						<span
							className={hiringFilterStyle.goback}
							onClick={() => setToggleBack(false)}>
							<MdArrowBackIosNew />
							&nbsp;&nbsp; Go back
						</span>
					)}
					<span
						style={{
							display: 'flex',
							justifyContent: 'end',
							cursor: 'pointer',
						}}>
						<GrFormClose
							style={{ fontSize: '25px', fontWeight: '800' }}
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
							{filterSubChild.isSearch && (
								<div className={hiringFilterStyle.searchFiltersList}>
									<AiOutlineSearch
										style={{ fontSize: '20px', fontWeight: '800' }}
									/>
									<input
										class={hiringFilterStyle.searchInput}
										type="text"
										id="search"
										placeholder={`Search ${filterSubChild?.name}`}
									/>
								</div>
							)}
							<div className={hiringFilterStyle.filtersListType}>
								{filterSubChild.child.map((item, index) => {
									return (
										<div className={hiringFilterStyle.filterItem}>
											<Checkbox style={{ fontSize: '1rem', fontWeight: '500' }}>
												{item}
											</Checkbox>
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
											closable={true}
											onClose={(e) => {
												e.preventDefault();
												console.log(e.target);
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
											className={hiringFilterStyle.filterItem}
											onClick={() => toggleFilterSubChild(item)}>
											<span style={{ fontSize: '1rem' }}>{item.name}</span>
											<MdNavigateNext
												style={{ fontSize: '20px', fontWeight: '800' }}
											/>
										</div>
									);
								})}
							</div>
						</>
					)}

					<hr />
					<div className={hiringFilterStyle.operationsFilters}>
						<button className={hiringFilterStyle.clearAll}>Clear All</button>
						<button className={hiringFilterStyle.applyFilters}>
							Apply Filters
						</button>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default HiringFilters;
