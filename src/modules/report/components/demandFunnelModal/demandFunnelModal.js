import { Dropdown, Menu, message, Modal, Skeleton, Table, Tooltip } from 'antd';
import { InputType } from 'constants/application';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import DemandFunnelStyle from 'modules/report/screens/demandFunnel/demandFunnel.module.css';
import { useCallback, useEffect, useState } from 'react';
import { ReportDAO } from 'core/report/reportDAO';
import { HTTPStatusCode } from 'constants/network';
import { reportConfig } from 'modules/report/report.config';

const DemandFunnelModal = ({
	demandFunnelModal,
	setDemandFunnelModal,
	demandFunnelHRDetailsState,
	setDemandFunnelHRDetailsState,
}) => {
	const [apiData, setApiData] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const getDemandFunnelHRDetailsHandler = useCallback(async () => {
		const response = await ReportDAO.demandFunnelHRDetailsRequestDAO(
			demandFunnelHRDetailsState,
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			setApiData(response && response?.responseBody);
		} else {
			setApiData([]);
		}
	}, [demandFunnelHRDetailsState]);

	useEffect(() => {
		getDemandFunnelHRDetailsHandler();
	}, [getDemandFunnelHRDetailsHandler]);
	return (
		<Modal
			transitionName=""
			centered
			open={demandFunnelModal}
			width="1256px"
			footer={null}
			onCancel={() => setDemandFunnelModal(false)}>
			<div>
				<div>
					<label className={DemandFunnelStyle.matchmakingLabel}>
						Demand Funnel HR Details
					</label>
					<p className={DemandFunnelStyle.trReq}>TR Required ( Count: 12)</p>
				</div>
				<div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
							alignItems: 'center',
						}}>
						<div className={DemandFunnelStyle.formPanelAction}>
							<button
								className={DemandFunnelStyle.btnPrimary}
								onClick={() => {
									setDemandFunnelHRDetailsState({
										...demandFunnelHRDetailsState,
										IsExport: true,
									});
									getDemandFunnelHRDetailsHandler();
								}}>
								Export
							</button>
						</div>
						<div className={DemandFunnelStyle.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={DemandFunnelStyle.searchInput}
								placeholder="Search Talent Details"
								onChange={(e) => {
									let filteredData = apiData?.filter((val) => {
										return (
											val.hR_No
												.toLowerCase()
												.includes(e.target.value.toLowerCase()) ||
											val.salesPerson
												.toLowerCase()
												.includes(e.target.value.toLowerCase()) ||
											val.compnayName
												.toLowerCase()
												.includes(e.target.value.toLowerCase()) ||
											val.role
												.toLowerCase()
												.includes(e.target.value.toLowerCase()) ||
											val.managed_Self
												.toLowerCase()
												.includes(e.target.value.toLowerCase()) ||
											val.availability
												.toLowerCase()
												.includes(e.target.value.toLowerCase())
										);
									});

									setSearchData(filteredData);
								}}
							/>
						</div>
					</div>
				</div>
				<div
					style={{
						maxHeight: '581px',
						overflowY: 'auto',
						marginLeft: 'auto',
						marginRight: 'auto',
					}}>
					{apiData.length === 0 ? (
						<Skeleton />
					) : (
						<Table
							id="hrListingTable"
							columns={reportConfig?.demandFunnelHRDetails}
							bordered={false}
							dataSource={
								searchData && searchData?.length > 0
									? [...searchData]
									: [...apiData]
							}
							pagination={{
								size: 'small',
								pageSize: apiData?.length,
							}}
						/>
					)}
				</div>

				<div className={DemandFunnelStyle.formPanelAction}>
					<button
						className={DemandFunnelStyle.btnPrimary}
						onClick={() => setDemandFunnelModal(false)}>
						Cancel
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DemandFunnelModal;
