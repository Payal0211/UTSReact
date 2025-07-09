import { Modal, Skeleton, Table } from 'antd';
import { InputType } from 'constants/application';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import DemandFunnelStyle from 'modules/report/screens/demandFunnel/demandFunnel.module.css';
import { useCallback, useEffect, useState } from 'react';
import { ReportDAO } from 'core/report/reportDAO';
import { HTTPStatusCode } from 'constants/network';
import { reportConfig } from 'modules/report/report.config';
import { downloadToExcel } from 'modules/report/reportUtils';

const DemandFunnelModal = ({
	demandFunnelModal,
	setDemandFunnelModal,
	demandFunnelHRDetailsState,
	setDemandFunnelHRDetailsState,
	demandFunnelValue,
	isFocusedRole
}) => {
	const [apiData, setApiData] = useState([]);
	const [searchData, setSearchData] = useState([]);
	// const [isExport, setExport] = useState(false);
	const getDemandFunnelHRDetailsHandler = useCallback(async () => {
		const response = await ReportDAO.demandFunnelHRDetailsRequestDAO(
			{...demandFunnelHRDetailsState,funnelFilter:{...demandFunnelHRDetailsState.funnelFilter, "isHrfocused" : isFocusedRole}},
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			setApiData(response && response?.responseBody);
		} else {
			setApiData([]);
		}
	}, [demandFunnelHRDetailsState]);

	const exportHandler = useCallback(async (data) => {
		let dataToDownload = data.map((data)=>{
			let obj = {}
			reportConfig?.demandFunnelHRDetails(
				demandFunnelValue?.stage,
			).map(val => obj[`${val.title}`] = data[`${val.key}`])
		  return obj;
		})
		downloadToExcel(dataToDownload,'DemandFunnel');
		
	}, [demandFunnelValue?.stage]);

	useEffect(() => {
		getDemandFunnelHRDetailsHandler();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getDemandFunnelHRDetailsHandler]);
	return (
		<Modal
			className={DemandFunnelStyle.demandFunnelModal}
			transitionName=""
			centered
			open={demandFunnelModal}
			width="1500px"
			footer={null}
			onCancel={() => setDemandFunnelModal(false)}>
			<div>
				<div>
					<label className={DemandFunnelStyle.matchmakingLabel}>
						Demand Funnel HR Details
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
							placeholder="Search Table"
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
											.includes(e.target.value.toLowerCase()) ||
										val.hrStatus
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
								exportHandler(searchData && searchData?.length > 0
									? [...searchData]
									: [...apiData]);
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
						onClick={() => setDemandFunnelModal(false)}>
						Cancel
					</button>
				</>
				<br />
			</div>
		</Modal>
	);
};

export default DemandFunnelModal;
