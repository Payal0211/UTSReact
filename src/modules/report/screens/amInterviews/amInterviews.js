import { Dropdown, Menu, Table, Modal } from "antd";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import taStyles from "./amInterviews.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { downloadToExcel } from "modules/report/reportUtils";
import { ReportDAO } from "core/report/reportDAO";
import moment from "moment";

const AmInterviews = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(100);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [modalTitle, setModalTitle] = useState("");

    const columns = [
        {
            title: "AM",
            dataIndex: "am",
            key: "am",
            align: "left"
        },
        {
            title: "All Round",
            dataIndex: "allRound",
            key: "allRound",
            align: "center",
            render: (value,record) => {
                const isClickable = record?.am !== 'TOTAL' && value;
                return <span
                style={{
                color: isClickable ? '#1890ff' : 'inherit',
                cursor: isClickable ? 'pointer' : 'default',
                }}
                onClick={() => {
                if (isClickable) {
                    getAMWiseTalentInterviewDetails(0, record);
                }
                }}
            >
                {value ? value : '-'}
            </span>
            }
        },
       ...[1, 2, 3, 4, 5, 6].map((round) => ({
        title: `L${round} Round`,
        dataIndex: `round${round}`,
        key: `round${round}`,
        align: "center",
        render: (value, record) => {
            const isClickable = record?.am !== 'TOTAL' && value;

            return (
            <span
                style={{
                color: isClickable ? '#1890ff' : 'inherit',
                cursor: isClickable ? 'pointer' : 'default',
                }}
                onClick={() => {
                if (isClickable) {
                    getAMWiseTalentInterviewDetails(round, record);
                }
                }}
            >
                {value ? value : '-'}
            </span>
            );
        },
        }))
    ];

    const modalColumns = [
        { title: "Company", dataIndex: "company", key: "company" },
        { title: "HR Number", dataIndex: "hR_Number", key: "hR_Number" },
        { title: "Position", dataIndex: "position", key: "position" },
        { title: "Talent", dataIndex: "talent", key: "talent" },
        { title: "Slot Detail", dataIndex: "slotDetail", key: "slotDetail" },
    ];

    useEffect(() => {
        fetchInterviews();
    }, [startDate]);

    const fetchInterviews = async () => {
        let payload = {
            targetDate: moment(startDate).format('YYYY-MM-DD')
        };
        setIsLoading(true);
        const apiResult = await ReportDAO.AMWiseInterviewCountsDAO(payload);
        setIsLoading(false);
        if (apiResult?.statusCode === 200) {
            setData(apiResult.responseBody);
        } else {
            setData([]);
        }
    };

    const getAMWiseTalentInterviewDetails = async (round, record) => {
        const payload = {
            targetDate: moment(startDate).format('YYYY-MM-DD'),
            amId: record?.amid || '',
            Round: round
        };
        setModalVisible(true);
        setIsModalLoading(true);
        const apiResult = await ReportDAO.AMWiseTalentInterviewDetailsDAO(payload);
        setIsModalLoading(false);

        if (apiResult?.statusCode === 200) {
            setModalData(apiResult.responseBody);
            setModalTitle(`${round === 0 ? 'All Rounds' : `L${round} Round`}  - ${record?.am || ''}`);
            // setModalVisible(true);
        } else {
            setModalData([]);
            setModalVisible(false);
        }
    };

    const handleExport = (apiData) => {
        const DataToExport = apiData.map((data) => {
            let obj = {};
            columns.forEach((val) => {
                obj[`${val.title}`] = data[`${val.key}`];
            });
            return obj;
        });
        downloadToExcel(DataToExport, 'AM_Interviews.xlsx');
    };

    return (
        <div className={taStyles.snapshotContainer}>
            <div className={taStyles.addnewHR} style={{ margin: "0" }}>
                <div className={taStyles.hiringRequest}>AM Wise Interview Count</div>
            </div>

            <div className={taStyles.filterContainer}>
                <div className={taStyles.filterRow}>
                    <div className={taStyles.filterRightRow}>
                        <div className={taStyles.filterItem}>
                            <span className={taStyles.label}>Date</span>
                            <div className={taStyles.calendarFilter}>
                                <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                                <DatePicker
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className={taStyles.dateFilter}
                                    placeholderText="Start date"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="dd-MM-yyyy"
                                />
                            </div>
                        </div>
                        <button className={taStyles.btnPrimary} onClick={() => handleExport(data)}>
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <TableSkeleton />
            ) : (
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                    rowClassName={(record) => (record?.am === 'TOTAL' ? taStyles.totalrow : '')}
                />
            )}

            <Modal
                open={modalVisible}
                title={modalTitle}
                footer={null}
                width={1000}
                centered
                onCancel={() => setModalVisible(false)}
            >

                {isModalLoading ? <TableSkeleton /> :  <Table
                    dataSource={modalData}
                    columns={modalColumns}
                    pagination={false}
                    rowKey={(record, idx) => idx}
                    size="middle"
                />}
               
            </Modal>
        </div>
    );
};

export default AmInterviews;
