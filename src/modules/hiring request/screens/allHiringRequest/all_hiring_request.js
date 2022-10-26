import allHRStyles from './all_hiring_request.module.css';
import { AiOutlineDown } from 'react-icons/ai';
import { Space, Table, Tag } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoFunnelOutline } from 'react-icons/io5';

const AllHiringRequestScreen = () => {
	const [apiData, setAPIdata] = useState([]);
	const [search, setSearch] = useState('');

	useEffect(() => {
		async function callAPI() {
			let response = await axios.get(
				'https://jsonplaceholder.typicode.com/posts',
			);
			response = response.data;
			setAPIdata(response);
		}
		callAPI();
	}, []);

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
						<div className={allHRStyles.filterCount}>6</div>
					</div>
					<div className={allHRStyles.addFilter}>
						<IoFunnelOutline style={{ fontSize: '20px', fontWeight: '800' }} />
						<div className={allHRStyles.filterLabel}>Add Filters</div>
						<div className={allHRStyles.filterCount}>6</div>
					</div>
				</div>
			</div>
			{/* <div style={{ marginTop: '10%' }}>
				<input
					type="search"
					placeholder="search"
					onChange={(e) => {
						let filteredData = apiData.filter((val) => {
							return (
								val.body.toLowerCase().includes(e.target.value.toLowerCase()) ||
								val.title
									.toLowerCase()
									.includes(e.target.value.toLowerCase()) ||
								val.id == e.target.value ||
								val.userId == e.target.value
							);
						});
						setSearch(filteredData);
						console.log(search);
					}}
				/>
				<Table
					columns={[
						{
							title: 'userId',
							dataIndex: 'userId',
						},
						{
							title: 'id',
							dataIndex: 'id',
						},
						{
							title: 'title',
							dataIndex: 'title',
						},
						{
							title: 'body',
							dataIndex: 'body',
						},
					]}
					bordered={true}
					dataSource={search && search.length > 0 ? search : apiData}></Table>
			</div> */}
		</div>
	);
};

export default AllHiringRequestScreen;
