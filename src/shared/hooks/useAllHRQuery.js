import { useQuery } from '@tanstack/react-query';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';

export const useAllHRQuery = () => {
	return useQuery(
		['allHRList'],
		async () =>
			await hiringRequestDAO.getPaginatedHiringRequestDAO({
				pageSize: 100,
				pageNum: 1,
			}),
		{
			staleTime: 50000000,
		},
	);
};

export const useMatchmakingQuery = () => {
	return useQuery(
		['matchmakingList'],
		async () => await hiringRequestDAO.getMatchmakingDAO({}),
		{ enabled: false, staleTime: 50000000 },
	);
};
