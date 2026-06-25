import React, {useState} from 'react'
import stylesOBj from './scrumStructure.module.css'
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'
import {
    Select, InputNumber,
    Tooltip, Table, Checkbox, message, Skeleton, Modal
} from "antd";
const { Option } = Select;
function ScrumStructure() {

    const [filtersList, setFiltersList] = useState({});

    const dummyData = [
        {
            companyName: 'Tech Solutions Inc',
            hrid: 'HR001',
            hrTitle: 'Senior Software Engineer',
            hiringManagerPOC: 'Yes',
            category: 'IT',
            interviewRounds: 3,
            inboundOutbound: 'Inbound',
            status: 'Open',
            activeTRs: 5,
            taUser: 'John Doe',
            talentAnnualCTCBudget: 1500000,
            revenueOpportunity: '15%',
            totalRevenueOpportunity: 225000,
            hrStatus: 'Active',
            hrCreatedDate: '2024-01-15',
            noDaysHROpen: 45,
            noActiveSubmittedProfiles: 12,
            latestCommunicationUpdates: 'Waiting for client feedback',
            noCallsGivenDay: 3,
            noNotes: 5,
            submissionTargetGivenDate: 8,
            submissionTargetAchieved: 'Yes',
            totalNoSubmissions: 8,
            screenReject: 2,
            r1: 1,
            r2: 0,
            r3: 0,
            totalNoInterviewRejects: 1,
            weeklySelectionPlanned: 2,
            joiningDate: '2024-03-01',
            touchBaseNotes: 'Strong candidate pool available'
        },
        {
            companyName: 'Digital Ventures Ltd',
            hrid: 'HR002',
            hrTitle: 'Product Manager',
            hiringManagerPOC: 'No',
            category: 'Product',
            interviewRounds: 2,
            inboundOutbound: 'Outbound',
            status: 'In Progress',
            activeTRs: 3,
            taUser: 'Jane Smith',
            talentAnnualCTCBudget: 1200000,
            revenueOpportunity: '12%',
            totalRevenueOpportunity: 144000,
            hrStatus: 'Active',
            hrCreatedDate: '2024-02-01',
            noDaysHROpen: 30,
            noActiveSubmittedProfiles: 8,
            latestCommunicationUpdates: 'Interviews scheduled',
            noCallsGivenDay: 2,
            noNotes: 3,
            submissionTargetGivenDate: 6,
            submissionTargetAchieved: 'Partial',
            totalNoSubmissions: 5,
            screenReject: 1,
            r1: 2,
            r2: 1,
            r3: 0,
            totalNoInterviewRejects: 1,
            weeklySelectionPlanned: 1,
            joiningDate: '2024-03-15',
            touchBaseNotes: 'Need more qualified candidates'
        },
        {
            companyName: 'Cloud Systems Corp',
            hrid: 'HR003',
            hrTitle: 'Data Scientist',
            hiringManagerPOC: 'Yes',
            category: 'Data',
            interviewRounds: 4,
            inboundOutbound: 'Inbound',
            status: 'Closed',
            activeTRs: 0,
            taUser: 'Mike Johnson',
            talentAnnualCTCBudget: 1800000,
            revenueOpportunity: '18%',
            totalRevenueOpportunity: 324000,
            hrStatus: 'Inactive',
            hrCreatedDate: '2023-12-10',
            noDaysHROpen: 90,
            noActiveSubmittedProfiles: 15,
            latestCommunicationUpdates: 'Position filled',
            noCallsGivenDay: 0,
            noNotes: 8,
            submissionTargetGivenDate: 10,
            submissionTargetAchieved: 'Yes',
            totalNoSubmissions: 10,
            screenReject: 3,
            r1: 4,
            r2: 2,
            r3: 1,
            totalNoInterviewRejects: 6,
            weeklySelectionPlanned: 0,
            joiningDate: '2024-02-20',
            touchBaseNotes: 'Successfully filled position'
        }
    ];

    const [isLoading, setIsLoading] = React.useState(false);
    const [reportData, setReportData] = React.useState(dummyData);
    const [draggedRow, setDraggedRow] = React.useState(null);

    const handleDragStart = (e, index) => {
        setDraggedRow(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedRow === null || draggedRow === dropIndex) return;

        const newData = [...reportData];
        const draggedItem = newData[draggedRow];
        newData.splice(draggedRow, 1);
        newData.splice(dropIndex, 0, draggedItem);
        setReportData(newData);
        setDraggedRow(null);
    };

    const handleDragEnd = () => {
        setDraggedRow(null);
    };

    const moveRowUp = (index) => {
        if (index === 0) return;
        const newData = [...reportData];
        [newData[index - 1], newData[index]] = [newData[index], newData[index - 1]];
        setReportData(newData);
    };

    const moveRowDown = (index) => {
        if (index === reportData.length - 1) return;
        const newData = [...reportData];
        [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
        setReportData(newData);
    };

 const TaskStatusComp = ({ text, result, index }) => {
        const [value, setValue] = useState(text ?? "");
        const colorCode =
            filtersList?.TaskStatus?.find((v) => v.data === value)?.colorCode ?? "";
        return (
            <div className={stylesOBj.tableSelectField}>
                <Select
                    defaultValue={value}
                    style={{ color: colorCode }}
                    onChange={async (val) => {
                        // if (value === "Fasttrack" && val !== "Fasttrack") {
                        //     let pl = {
                        //         task_ID: result?.id,
                        //         tA_Head_UserID: selectedHead,
                        //         tA_UserID: result?.tA_UserID,
                        //         target_StageID: 1,
                        //         target_Number: targetValue,
                        //         target_Date: moment(startTargetDate).format("YYYY-MM-DD"),
                        //         IsStatusChangedToSlow: true,
                        //     };
                        //     setLoadingTalentProfile(true);
                        //     let response = await TaDashboardDAO.insertProfileShearedTargetDAO(
                        //         pl
                        //     );
                        //     setLoadingTalentProfile(false);
                        //     if (response.statusCode === HTTPStatusCode.OK) {
                        //         setGoalList(response.responseBody);
                        //         setTargetValue(5);
                        //         setStartTargetDate(new Date());
                        //     }
                        // }
                        // setValue(val);
                        // let valobj = filtersList?.TaskStatus?.find((i) => i.data === val);
                        // if (val === "Fasttrack") {
                        //     setShowProfileTarget(true);
                        //     setStartTargetDate(startDate);
                        //     setProfileTargetDetails({ ...result, index: index });
                        //     return;
                        // }

                        // updateTARowValue(valobj, "task_StatusID", result, index);
                    }}
                >
                    {filtersList?.TaskStatus?.map((v) => (
                        <Option style={{ color: v.colorCode }} value={v.data}>
                            {v.data}
                        </Option>
                    ))}
                </Select>
            </div>
        );
    };

  return (
      <div className={`${stylesOBj["dashboard-container"]}`}>
         <main className={`${stylesOBj["main-content"]}`}>
             <h1 style={{ marginBottom: '16px',marginLeft: '16px', paddingLeft: '8px', fontSize: '24px' }}>TA Scrum Structure</h1>
             <div className={`${stylesOBj["table-container"]}`} style={{ margin: '16px' }}>

                        {isLoading ? <TableSkeleton /> :
                            <table className={`${stylesOBj["data-table"]}`} cellPadding={8}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '80px', textAlign: 'center' }}>ACTIONS</th>
                                        <th>COMPANY NAME</th>
                                        <th>HR ID</th>
                                        <th>HR TITLE</th>
                                        <th>HIRING MANAGER AS POC (Y/N)</th>
                                        <th>CATEGORY</th>
                                        <th>#INTERVIEW ROUNDS</th>
                                        <th>INBOUND / OUTBOUND</th>
                                        <th>STATUS</th>
                                        <th>ACTIVE TRs</th>
                                        <th>TA</th>
                                        <th>TALENT ANNUAL CTC BUDGET (INR)</th>
                                        <th>REVENUE OPPORTUNITY (FEES % ON ANNUAL CTC)</th>
                                        <th>TOTAL REVENUE OPPORTUNITY</th>
                                        <th>HR STATUS</th>
                                        <th>HR CREATED DATE</th>
                                        <th>NO OF DAYS HR IS OPEN</th>
                                        <th>NO OF ACTIVE / SUBMITTED PROFILES TILL DATE</th>
                                        <th>LATEST COMMUNICATION & UPDATES</th>
                                        <th>NO OF CALLS ON GIVEN DAY</th>
                                        <th>NO OF NOTES</th>
                                        <th>SUBMISSION TARGET ON GIVEN DATE</th>
                                        <th>SUBMISSION TARGET ACHIEVED</th>
                                        <th>TOTAL NO OF SUBMISSIONS</th>
                                        <th>SCREEN REJECT</th>
                                        <th>R1</th>
                                        <th>R2</th>
                                        <th>R3</th>
                                        <th>TOTAL NO OF INTERVIEW REJECTS</th>
                                        <th>WEEKLY SELECTION PLANNED</th>
                                        <th>JOINING DATE</th>
                                        <th>TOUCH BASE NOTES</th>
                                    </tr>
                                </thead>
                                {/* <TABLEBODYComponent apiData={apiData} /> */}

                                <tbody>
                                    {reportData.length === 0 ? <tr>
                                        <td colSpan={32} style={{ textAlign: "center", padding: "20px" }}>
                                            No data available
                                        </td>
                                    </tr> : reportData.map((data, index)=>{
                                        return <tr 
                                            key={index}
                                            style={{
                                                opacity: draggedRow === index ? 0.5 : 1,
                                                backgroundColor: draggedRow === index ? '#f0f0f0' : 'transparent'
                                            }}
                                        >
                                            {/* ACTION COLUMN */}
                                            <td style={{ 
                                                width: '80px',
                                                textAlign: 'center',
                                                display: 'flex',
                                                gap: '8px',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '50px'
                                            }}>
                                                {/* 6 DOTS DRAG HANDLE */}
                                                <div
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, index)}
                                                    onDragOver={(e) => handleDragOver(e, index)}
                                                    onDrop={(e) => handleDrop(e, index)}
                                                    onDragEnd={handleDragEnd}
                                                    style={{
                                                        cursor: 'grab',
                                                        fontSize: '18px',
                                                        color: '#999',
                                                        userSelect: 'none',
                                                        padding: '4px 8px'
                                                    }}
                                                    title="Drag to move"
                                                >
                                                    ⋮⋮
                                                </div>
                                                
                                                {/* UP ARROW */}
                                                <button
                                                    onClick={() => moveRowUp(index)}
                                                    disabled={index === 0}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                                                        fontSize: '16px',
                                                        color: index === 0 ? '#ccc' : '#666',
                                                        padding: '4px 4px',
                                                        opacity: index === 0 ? 0.5 : 1
                                                    }}
                                                    title="Move up"
                                                >
                                                    ▲
                                                </button>
                                                
                                                {/* DOWN ARROW */}
                                                <button
                                                    onClick={() => moveRowDown(index)}
                                                    disabled={index === reportData.length - 1}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: index === reportData.length - 1 ? 'not-allowed' : 'pointer',
                                                        fontSize: '16px',
                                                        color: index === reportData.length - 1 ? '#ccc' : '#666',
                                                        padding: '4px 4px',
                                                        opacity: index === reportData.length - 1 ? 0.5 : 1
                                                    }}
                                                    title="Move down"
                                                >
                                                    ▼
                                                </button>
                                            </td>
                                            {/* COMPANY NAME */}
                                            <td>{data.companyName}</td>
                                            {/* HR ID */}
                                            <td>{data.hrid}</td>
                                            {/* HR TITLE */}
                                            <td>{data.hrTitle}</td>
                                            {/* HIRING MANAGER AS POC */}
                                            <td>{data.hiringManagerPOC}</td>
                                            {/* CATEGORY */}
                                            <td>{data.category}</td>
                                            {/* #INTERVIEW ROUNDS */}
                                            <td>{data.interviewRounds}</td>
                                            {/* INBOUND / OUTBOUND */}
                                            <td>{data.inboundOutbound}</td>
                                            {/* STATUS */}
                                            <td><TaskStatusComp text={data.status} result={data} index={index} /> {}</td>
                                            {/* ACTIVE TRs */}
                                            <td>{data.activeTRs}</td>
                                            {/* TA */}
                                            <td>{data.taUser}</td>
                                            {/* TALENT ANNUAL CTC BUDGET */}
                                            <td>{data.talentAnnualCTCBudget}</td>
                                            {/* REVENUE OPPORTUNITY */}
                                            <td>{data.revenueOpportunity}</td>
                                            {/* TOTAL REVENUE OPPORTUNITY */}
                                            <td>{data.totalRevenueOpportunity}</td>
                                            {/* HR STATUS */}
                                            <td>{data.hrStatus}</td>
                                            {/* HR CREATED DATE */}
                                            <td>{data.hrCreatedDate}</td>
                                            {/* NO OF DAYS HR IS OPEN */}
                                            <td>{data.noDaysHROpen}</td>
                                            {/* NO OF ACTIVE / SUBMITTED PROFILES */}
                                            <td>{data.noActiveSubmittedProfiles}</td>
                                            {/* LATEST COMMUNICATION & UPDATES */}
                                            <td>{data.latestCommunicationUpdates}</td>
                                            {/* NO OF CALLS ON GIVEN DAY */}
                                            <td>{data.noCallsGivenDay}</td>
                                            {/* NO OF NOTES */}
                                            <td>{data.noNotes}</td>
                                            {/* SUBMISSION TARGET ON GIVEN DATE */}
                                            <td>{data.submissionTargetGivenDate}</td>
                                            {/* SUBMISSION TARGET ACHIEVED */}
                                            <td>{data.submissionTargetAchieved}</td>
                                            {/* TOTAL NO OF SUBMISSIONS */}
                                            <td>{data.totalNoSubmissions}</td>
                                            {/* SCREEN REJECT */}
                                            <td>{data.screenReject}</td>
                                            {/* R1 */}
                                            <td>{data.r1}</td>
                                            {/* R2 */}
                                            <td>{data.r2}</td>
                                            {/* R3 */}
                                            <td>{data.r3}</td>
                                            {/* TOTAL NO OF INTERVIEW REJECTS */}
                                            <td>{data.totalNoInterviewRejects}</td>
                                            {/* WEEKLY SELECTION PLANNED */}
                                            <td>{data.weeklySelectionPlanned}</td>
                                            {/* JOINING DATE */}
                                            <td>{data.joiningDate}</td>
                                            {/* TOUCH BASE NOTES */}
                                            <td>{data.touchBaseNotes}</td>
                                        </tr>
                                    })}
                                     </tbody> </table>}
                    </div>
         </main>
        </div>
  )
}

export default ScrumStructure