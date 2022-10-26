import allHRStyles from './all_hiring_request.module.css';
import { AiOutlineDown } from 'react-icons/ai';
import { Space, Table, Tag } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoFunnelOutline } from 'react-icons/io5';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsCalendar4 } from 'react-icons/bs';
import { BiLockAlt } from 'react-icons/bi';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';

const AllHiringRequestScreen = () => {
	const [apiData, setAPIdata] = useState([]);
	const [search, setSearch] = useState('');
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		async function callAPI() {
			let response = await axios.get(
				'https://api.npoint.io/abbeed53bf8b4b354bb0',
			);
			response = response.data;

			setAPIdata(
				response.details.Data.map((item) => ({
					starStatus: All_Hiring_Request_Utils.GETHRPRIORITY(
						item.starMarkedStatusCode,
					),
					adHocHR: item.adHocHR,
					Date: item.createdDateTime,
					HR_ID: item.hr,
					TR: item.tr,
					Position: item.position,
					Company: item.company,
					Time: item.timeZone,
					typeOfEmployee: item.typeOfEmployee,
					salesRep: item.salesRep,
					hrStatus: item.hrStatus,
				})),
			);
			setLoading(false);
		}
		callAPI();
	}, []);

	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const onChange = (dates) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
	};

	return (
		<div className={allHRStyles.hiringRequestContainer}>
			<div className={allHRStyles.addnewHR}>
				<div className={allHRStyles.hiringRequest}>All Hiring Requests</div>
				<div className={allHRStyles.newHR}>
					<label>Add new HR</label>
					<div className={allHRStyles.iconDown}>
						<AiOutlineDown />
					</div>
				</div>
			</div>
			<div className={allHRStyles.filterContainer}>
				<div className={allHRStyles.filterSets}>
					<div className={allHRStyles.addFilter}>
						<IoFunnelOutline style={{ fontSize: '20px', fontWeight: '800' }} />
						<div className={allHRStyles.filterLabel}>Add Filters</div>
						<div className={allHRStyles.filterCount}>7</div>
					</div>
					<div className={allHRStyles.filterRight}>
						<div className={allHRStyles.searchFilterSet}>
							<AiOutlineSearch
								style={{ fontSize: '20px', fontWeight: '800' }}
							/>
							<input
								type="text"
								className={allHRStyles.searchInput}
								placeholder="Search Table"
								onChange={(e) => {
									let filteredData = apiData.filter((val) => {
										return (
											val.adHocHR
												.toLowerCase()
												.includes(e.target.value.toLowerCase()) ||
											val.HR_ID.toLowerCase().includes(
												e.target.value.toLowerCase(),
											) ||
											val.Position.toLowerCase().includes(
												e.target.value.toLowerCase(),
											) ||
											val.Company.toLowerCase().includes(
												e.target.value.toLowerCase(),
											) ||
											val.Time.toLowerCase().includes(
												e.target.value.toLowerCase(),
											) ||
											val.typeOfEmployee
												.toLowerCase()
												.includes(e.target.value.toLowerCase()) ||
											val.salesRep
												.toLowerCase()
												.includes(e.target.value.toLowerCase()) ||
											val.hrStatus
												.toLowerCase()
												.includes(e.target.value.toLowerCase()) ||
											val.TR == e.target.value
										);
									});
									setSearch(filteredData);
								}}
							/>
						</div>
						<div className={allHRStyles.calendarFilterSet}>
							<div className={allHRStyles.label}>Date</div>
							<div className={allHRStyles.calendarFilter}>
								<BsCalendar4 />
								<DatePicker
									onKeyDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									className={allHRStyles.dateFilter}
									placeholderText="Select Date"
									selected={startDate}
									onChange={onChange}
									startDate={startDate}
									endDate={endDate}
									selectsRange
								/>
							</div>
						</div>

						<div className={allHRStyles.priorityFilterSet}>
							<div className={allHRStyles.label}>Set Priority</div>
							<div className={allHRStyles.priorityFilter}>
								<BiLockAlt style={{ fontSize: '20px', fontWeight: '800' }} />
							</div>
						</div>
						<div className={allHRStyles.priorityFilterSet}>
							<div className={allHRStyles.label}>Showing</div>
							<div className={allHRStyles.priorityFilter}>
								<BiLockAlt style={{ fontSize: '20px', fontWeight: '800' }} />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div style={{ marginTop: '5%' }}>
				<Table
					id="1"
					size="middle"
					sticky={true}
					columns={[
						{
							title: '',
							dataIndex: 'starStatus',
							key: '0',
							align: 'center',
						},
						{
							title: 'O/P',
							dataIndex: 'adHocHR',
							key: '1',
							align: 'center',
						},
						{
							title: 'Date',
							dataIndex: 'Date',
							key: '2',
							align: 'center',
						},
						{
							title: 'HR ID',
							dataIndex: 'HR_ID',
							key: '3',
							align: 'center',
						},
						{
							title: 'TR',
							dataIndex: 'TR',
							key: '4',
							align: 'center',
						},
						{
							title: 'Position',
							dataIndex: 'Position',
							key: '5',
							align: 'center',
						},

						{
							title: 'Company',
							dataIndex: 'Company',
							key: '6',
							align: 'center',
						},
						{
							title: 'Time',
							dataIndex: 'Time',
							key: '7',
							align: 'center',
						},
						{
							title: 'FTE/PTE',
							dataIndex: 'typeOfEmployee',
							key: '8',
							align: 'center',
						},
						{
							title: 'Sales Rep',
							dataIndex: 'salesRep',
							key: '9',
							align: 'center',
						},
						{
							title: 'HR Status',
							dataIndex: 'hrStatus',
							key: '10',
							align: 'center',
						},
					]}
					bordered={false}
					dataSource={search && search.length > 0 ? search : apiData}
					pagination={{
						pageSize: 8,
					}}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};

export default AllHiringRequestScreen;
