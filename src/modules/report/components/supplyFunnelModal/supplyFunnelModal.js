import { Modal, Skeleton, Table } from 'antd';
import { InputType } from 'constants/application';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import DemandFunnelStyle from 'modules/report/screens/demandFunnel/demandFunnel.module.css';
import { useCallback, useEffect, useState } from 'react';
import { ReportDAO } from 'core/report/reportDAO';
import { HTTPStatusCode } from 'constants/network';
import { reportConfig } from 'modules/report/report.config';
import { downloadToExcel } from 'modules/report/reportUtils';

const SupplyFunnelModal = ({
	supplyFunnelModal,
	setSupplyFunnelModal,
	demandFunnelHRDetailsState,
	setDemandFunnelHRDetailsState,
	demandFunnelValue,
}) => {
	const [apiData, setApiData] = useState([]);
	const [searchData, setSearchData] = useState([]);
	// const [isExport, setExport] = useState(false);
	const getSupplyFunnelHRDetailHandler = useCallback(async () => {
		const response = await ReportDAO.supplyFunnelHRDetailsRequestDAO(
			demandFunnelHRDetailsState,
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			setApiData(response && response?.responseBody);
		} else {
			setApiData([]);
		}
	}, [demandFunnelHRDetailsState]);

	const exportHandler = useCallback(async () => {
		const response = await ReportDAO.supplyFunnelHRDetailsRequestDAO({
			...demandFunnelHRDetailsState,
			isExport: false,
		});
		if (response?.statusCode === HTTPStatusCode.OK) {

			let DataToExport =  response?.responseBody.map(data => {
				let obj = {}
				reportConfig?.demandFunnelHRDetails(
					demandFunnelValue?.stage,
				).map(val => obj[`${val.title}`] = data[`${val.key}`])
			return obj;
		}
			 )
			downloadToExcel(DataToExport);
			// setDemandFunnelModal(false);`
		}
	}, [demandFunnelHRDetailsState]);

	useEffect(() => {
		getSupplyFunnelHRDetailHandler();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getSupplyFunnelHRDetailHandler]);
	return (
		<Modal
			className={DemandFunnelStyle.demandFunnelModal}
			transitionName=""
			centered
			open={supplyFunnelModal}
			width="1500px"
			footer={null}
			onCancel={() => setSupplyFunnelModal(false)}>
			<div>
				<div>
					<label className={DemandFunnelStyle.matchmakingLabel}>
						Supply Funnel HR Details
					</label>
					<p className={DemandFunnelStyle.trReq}>
						{demandFunnelValue?.stage} ( Count: {demandFunnelValue?.count})
					</p>
				</div>
				<div
					style={{
						padding: '10px 0',
						margin: '10px 0',
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
					}}>
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
											.includes(e.target.value.toLowerCase()) ||
										val.talentName
											.toLowerCase()
											.includes(e.target.value.toLowerCase())
									);
								});

								setSearchData(filteredData);
							}}
						/>
					</div>
					<div className={DemandFunnelStyle.modalPanelAction}>
						<button
							className={DemandFunnelStyle.btnPrimary}
							onClick={() => {
								exportHandler();
							}}>
							Export
						</button>
					</div>
				</div>
				<div
					style={{
						maxHeight: '520px',
						overflowY: 'auto',
						marginLeft: 'auto',
						marginRight: 'auto',
					}}>
					{apiData.length === 0 ? (
						<Skeleton />
					) : (
						<Table
							id="hrListingTable"
							columns={reportConfig?.demandFunnelHRDetails(
								demandFunnelValue?.stage,
							)}
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
				<br />
				<>
					<button
						className={DemandFunnelStyle.btnPrimary}
						onClick={() => setSupplyFunnelModal(false)}>
						Cancel
					</button>
				</>
				<br />
			</div>
		</Modal>
	);
};

export default SupplyFunnelModal;
