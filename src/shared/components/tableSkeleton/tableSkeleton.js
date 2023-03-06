import { Skeleton } from 'antd';
import TableSkeletonStyle from './tableSkeleton.module.css';

const TableSkeleton = () => {
	return (
		<div className={TableSkeletonStyle.tableDetails}>
			<table>
				<thead className={TableSkeletonStyle.theadLoading}>
					<tr>
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
							return (
								<th
									className={TableSkeletonStyle.th}
									key={`th${index}`}>
									<Skeleton active />
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{[1, 2].map((item, index) => {
						return (
							<tr key={`loadedItem ${index}`}>
								<td className={TableSkeletonStyle.td}>
									<Skeleton active />
								</td>
								<td className={`${TableSkeletonStyle.td}`}>
									<Skeleton active />
								</td>
								<td className={`${TableSkeletonStyle.td}`}>
									<Skeleton active />
								</td>
								<td className={`${TableSkeletonStyle.td}`}>
									<Skeleton active />
								</td>
								<td className={TableSkeletonStyle.td}>
									<Skeleton active />
								</td>
								<td className={`${TableSkeletonStyle.td}`}>
									<Skeleton active />
								</td>
								<td className={TableSkeletonStyle.td}>
									<Skeleton active />
								</td>
								<td className={TableSkeletonStyle.td}>
									<Skeleton active />
								</td>
								<td className={TableSkeletonStyle.td}>
									<Skeleton active />
								</td>
								<td className={TableSkeletonStyle.td}>
									<Skeleton active />
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default TableSkeleton;
