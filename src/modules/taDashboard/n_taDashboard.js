import React, { useState, useEffect } from "react";
import taStyles from "./n_tadashboard.module.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// ===== Dummy data =====
const fullTimeData = [
    { recruiter: 'Parul Jaiswal', tl: 'Smriti', talent: 'Santhisri', company: 'Remofirst', hrId: 'HR081225133754', position: 'Frontend developer', nbd: 'Existing', sowDate: '1-Sept-2025', joiningDate: '1-Sept-2025', status: 'Joined', dpContract: 'DP', payRate: '3143520', nrDp: '10%', dpInr: '264804.9', nrUsd: '', billRate: '1000', dpMonthUsd: '1000', totalAchievement: '', monthWise: '1st - Sept', backout: '', closureMonth: 'Sept' },
    { recruiter: 'Kritika Khanna', tl: 'Shelly', talent: 'Saikrishna Kotagiri', company: 'Delightree', hrId: 'HR081225133754', position: 'Sr React Native Developer\nSaaS Platform', nbd: 'Existing', sowDate: '3-Sept-2025', joiningDate: '3-Sept-2025', status: 'Joined', dpContract: 'DP', payRate: '2800000', nrDp: '10%', dpInr: '280000', nrUsd: '', billRate: '1057', dpMonthUsd: '1057', totalAchievement: '', monthWise: '1st - Sept', backout: '', closureMonth: 'Sept' },
    { recruiter: 'Kritika Kahana', tl: 'Shelly', talent: 'Rishabh Raizada', company: 'Finrep AI', hrId: 'HR081225133754', position: 'Founding\nBackend Engineer', nbd: 'NBD', sowDate: '25-Sept-2025', joiningDate: '25-Sept-2025', status: 'Joined', dpContract: 'DP', payRate: '500000', nrDp: '12.50%', dpInr: '625000', nrUsd: '', billRate: '2360', dpMonthUsd: '2360', totalAchievement: '', monthWise: '1st - Sept', backout: '', closureMonth: 'Sept' },
    { recruiter: 'Reshmi', tl: 'Shelly', talent: 'Ranjan Yadav', company: 'Spectrocloud', hrId: 'HR081225133754', position: 'Security Engineer', nbd: 'Existing', sowDate: '22-Sept-2025', joiningDate: '22-Sept-2025', status: 'Backout', dpContract: 'Contract', payRate: '1607', nrDp: '35%', dpInr: '', nrUsd: '', billRate: '2170', dpMonthUsd: '', totalAchievement: '0', monthWise: '', backout: '563', closureMonth: '' },
    { recruiter: 'Hudda', tl: 'Smriti', talent: 'Aarav Mehta', company: 'Remofirst', hrId: 'HR081225133754', position: 'Data Engineer', nbd: 'Existing', sowDate: '12-Sept-2025', joiningDate: '12-Sept-2025', status: 'Joined', dpContract: 'DP', payRate: '2100000', nrDp: '11%', dpInr: '210000', nrUsd: '', billRate: '1200', dpMonthUsd: '1200', totalAchievement: '', monthWise: '1st - Sept', backout: '', closureMonth: 'Sept' },
];

const contractData = fullTimeData;

const achievementNumbersData = [
    { recruiter: 'Hudda',          dec: '4832', nov: '3601', oct: '1866', total: '10298' },
    { recruiter: 'Kritika Khanna', dec: '3549', nov: '8219', oct: '4516', total: '16287' },
    { recruiter: 'Parul Jaiswal',  dec: '2780', nov: '3998', oct: '7143', total: '13921' },
    { recruiter: 'Reshmi',         dec: '',     nov: '1514', oct: '2476', total: '3990'  },
    { recruiter: 'Grand Total',    dec: '11160',nov: '17331',oct: '16004',total: '44496', isTotal: true },
];

const achievementPercentData = [
    { recruiter: 'Hudda',          dec: '161.05%', nov: '120.02%', oct: '62.19%',  total: '114.42%' },
    { recruiter: 'Kritika Khanna', dec: '118.31%', nov: '273.97%', oct: '150.64%', total: '180.97%' },
    { recruiter: 'Parul Jaiswal',  dec: '92.66%',  nov: '133.26%', oct: '238.12%', total: '154.68%' },
    { recruiter: 'Reshmi',         dec: '',        nov: '50.46%',  oct: '82.54%',  total: '44.33%'  },
    { recruiter: 'Grand Total',    dec: '93.00%',  nov: '144.43%', oct: '133.37%', total: '123.60%', isTotal: true },
];

// HR status colors (images 7 & 8)
const HR_STATUS = {
    'info-pending':   { color: '#F5C842', label: 'Info pending' },
    'in-process':     { color: '#1E6FBA', label: 'In process' },
    'completed':      { color: '#1E7E5A', label: 'Completed' },
    'lost':           { color: '#C7362A', label: 'Lost' },
    'cancelled':      { color: '#D94141', label: 'Cancelled' },
    'covered':        { color: '#D9B8E0', label: 'Covered' },
    'hr-accepted':    { color: '#A8D5A8', label: 'HR accepted' },
    'replacement':    { color: '#F2C1A1', label: 'Replacement' },
    'non-responsive': { color: '#3A3A3A', label: 'Non-responsive' },
    'hold':           { color: '#D94141', label: 'Hold' },
    'pass-to-am':     { color: '#B8E0B8', label: 'Pass to AM team' },
    'hr-not-raised':  { color: '#DCDCDC', label: 'HR yet to be raised' },
};

const dashboardTasksData = [
    { ta: 'Ravi Kumar',    company: 'Delightree',              hrTitle: 'Database Administrator',  hrId: 'HR081225133754', status: 'info-pending', priority: 'Fasttrack', rounds: '2', am: 'Saptarshi Banerjee', nbd: 'Existing', pricing: 'Non-transparent', payRate: '$2378', nrPct: '35%', nrUsd: '$589', billRate: '$3470', activeTrs: '2', contractEor: 'Contract', taskAm: 'Interview feedback pending', taskTa: 'Interview feedback pending', activeProfiles: '2', updates: '- Sankeerthi Venkatesh - L1 on 10th March at 10:30 pm\n- Kalaivani - L1 on 3rd March at 11:30 pm\n- Sagar - L1 on 17th Mar at 9:30 pm', showAdd: false },
    { ta: 'Priya Singh',   company: 'Riskspan',                hrTitle: 'UI/UX Designer',          hrId: 'HR081225133754', status: 'in-process',    priority: 'Slow',      rounds: '2', am: 'Sushmita Gurjar',    nbd: 'Existing', pricing: 'Non-transparent', payRate: '$3124', nrPct: '35%', nrUsd: '$316', billRate: '$2980', activeTrs: '2', contractEor: 'Contract', taskAm: 'Client follow up',         taskTa: 'Client follow up',         activeProfiles: '2', updates: '- Krupali Patel - L1 on\n- Haritha Kotte [9th Mar sub]\n- Murlitharan - L1 on 11th Mar at 2 pm', showAdd: false },
    { ta: 'Anjali Mehta',  company: 'RemoFirst',               hrTitle: 'Systems Architect',       hrId: 'HR081225133754', status: 'completed',     priority: 'Pause',     rounds: '3', am: 'Sushmita Gurjar',    nbd: 'NBD',      pricing: 'Non-transparent', payRate: '$1856', nrPct: '',    nrUsd: '$647', billRate: '$3910', activeTrs: '1', contractEor: 'EOR',      taskAm: 'Client follow up',         taskTa: 'Client follow up',         activeProfiles: '1', updates: '- Sankeerthi Venkatesh - L1 on 10th March at 10:30 pm\n- Kalaivani - L1 on 3rd March at 11:30 pm\n- Sagar - L1 on 17th Mar at 9:30 pm', showAdd: false },
    { ta: 'Suresh Reddy',  company: 'Calyx Global',            hrTitle: 'Network Administrator',   hrId: 'HR081225133754', status: 'lost',          priority: 'Medium',    rounds: '3', am: 'Nikita Sharma',      nbd: 'Existing', pricing: 'Transparent',     payRate: '$3679', nrPct: '35%', nrUsd: '$457', billRate: '$2650', activeTrs: '1', contractEor: 'Contract', taskAm: 'Client follow up',         taskTa: 'Client follow up',         activeProfiles: '1', updates: '', showAdd: true },
    { ta: 'Neha Joshi',    company: 'DeepMatrix',              hrTitle: 'DevOps Engineer',         hrId: 'HR081225133754', status: 'cancelled',     priority: 'Covered',   rounds: '2', am: 'Nikita Sharma',      nbd: 'NBD',      pricing: 'Non-transparent', payRate: '$2901', nrPct: '',    nrUsd: '$786', billRate: '$3340', activeTrs: '3', contractEor: 'EOR',      taskAm: 'Interview feedback pending', taskTa: 'Interview feedback pending', activeProfiles: '3', updates: '- Sankeerthi Venkatesh - L1 on 10th March at 10:30 pm\n- Kalaivani - L1 on 3rd March at 11:30 pm\n- Sagar - L1 on 17th Mar at 9:30 pm', showAdd: false },
    { ta: 'Vikram Sharma', company: 'Delightree',              hrTitle: 'Data Analyst',            hrId: 'HR081225133754', status: 'covered',       priority: 'Slow',      rounds: '3', am: 'Nikita Sharma',      nbd: 'Existing', pricing: 'Transparent',     payRate: '$1543', nrPct: '35%', nrUsd: '$876', billRate: '$2780', activeTrs: '2', contractEor: 'Contract', taskAm: 'Client follow up',         taskTa: 'Client follow up',         activeProfiles: '2', updates: '- Krupali Patel - L1 on\n- Haritha Kotte [9th Mar sub]\n- Murlitharan - L1 on 11th Mar at 2 pm', showAdd: false },
    { ta: 'Sneha Gupta',   company: 'Threat Modeler Software Inc', hrTitle: 'Software Engineer',   hrId: 'HR081225133754', status: 'hr-accepted',   priority: 'Pause',     rounds: '2', am: 'Sushmita Gurjar',    nbd: 'Existing', pricing: 'Non-transparent', payRate: '$3987', nrPct: '35%', nrUsd: '$456', billRate: '$3120', activeTrs: '1', contractEor: 'Contract', taskAm: 'Client follow up',         taskTa: 'Client follow up',         activeProfiles: '1', updates: '- Sankeerthi Venkatesh - L1 on 10th March at 10:30 pm\n- Kalaivani - L1 on 3rd March at 11:30 pm\n- Sagar - L1 on 17th Mar at 9:30 pm', showAdd: false },
    { ta: 'Karan Verma',   company: 'Arkatecture',             hrTitle: 'Project Manager',         hrId: 'HR081225133754', status: 'replacement',   priority: 'Medium',    rounds: '4', am: 'Saptarshi Banerjee', nbd: 'NBD',      pricing: 'Transparent',     payRate: '$2765', nrPct: '',    nrUsd: '$488', billRate: '$3890', activeTrs: '2', contractEor: 'EOR',      taskAm: 'Interview feedback pending', taskTa: 'Interview feedback pending', activeProfiles: '2', updates: '- Krupali Patel - L1 on\n- Haritha Kotte [9th Mar sub]\n- Murlitharan - L1 on 11th Mar at 2 pm', showAdd: false },
];

const goalVsAchievedData = [
    { ta: 'Debraj Bhattacharya', company: 'Mecalux',                  hrTitle: 'Database Administrator',              hrId: 'HR081225133754', target: '2', achieve: '',  l1: ''  },
    { ta: 'Komal Vilas Sutar',   company: 'Riskspan',                 hrTitle: 'Product Engineer (Software Engineer)',hrId: 'HR081225133754', target: '2', achieve: '',  l1: ''  },
    { ta: 'Komal Vilas Sutar',   company: 'Mecalux',                  hrTitle: 'Data Operations Analyst',             hrId: 'HR081225133754', target: '2', achieve: '',  l1: '2' },
    { ta: 'Mazahar Shariff',     company: 'Delightree',               hrTitle: 'Product Engineer (Software Engineer)',hrId: 'HR081225133754', target: '2', achieve: '2', l1: ''  },
    { ta: 'Mazahar Shariff',     company: 'Mecalux',                  hrTitle: 'QA Engineer (Manual and Automation)', hrId: 'HR081225133754', target: '2', achieve: '1', l1: '1' },
    { ta: 'Meghna Bagree',       company: 'For Real',                 hrTitle: 'Team Lead (Lead Software Engineer)',  hrId: 'HR081225133754', target: '2', achieve: '',  l1: ''  },
    { ta: 'Meghna Bagree',       company: 'Threat Modeler Software Inc', hrTitle: 'Founding AI/ML Engineer',          hrId: 'HR081225133754', target: '2', achieve: '',  l1: ''  },
    { ta: 'Mohammad Asif',       company: 'Arkatecture',              hrTitle: 'Senior ML/Ops Engineer',              hrId: 'HR081225133754', target: '3', achieve: '1', l1: '2' },
    { ta: 'Mohd Rizwan',         company: 'SCALE',                    hrTitle: 'Technical Data Analyst Developer',    hrId: 'HR081225133754', target: '3', achieve: '',  l1: ''  },
    { ta: 'Ruhi Saiyed',         company: 'Surties',                  hrTitle: 'Application Developer',               hrId: 'HR081225133754', target: '3', achieve: '',  l1: ''  },
    { ta: 'Sana Qadeer',         company: 'Traffic Radius Pty Ltd',   hrTitle: 'AI Workflow and Automation Expert',   hrId: 'HR081225133754', target: '3', achieve: '',  l1: '1' },
    { ta: 'Sana Qadeer',         company: 'Mecalux',                  hrTitle: 'E-commerce Performance Marketing Specialist', hrId: 'HR081225133754', target: '1', achieve: '',  l1: '1' },
];

const taOptions = ['Ravi Kumar', 'Priya Singh', 'Anjali Mehta', 'Suresh Reddy', 'Neha Joshi', 'Vikram Sharma', 'Sneha Gupta', 'Karan Verma'];

function getPageNumbers(currentPage, totalPages) {
    const pages = [];
    if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        const left = Math.max(2, currentPage - 1);
        const right = Math.min(totalPages - 1, currentPage + 1);
        pages.push(1);
        if (left > 2) pages.push("...");
        for (let i = left; i <= right; i++) pages.push(i);
        if (right < totalPages - 1) pages.push("...");
        pages.push(totalPages);
    }
    return pages;
}

function PaginationComponent({ currentPage, totalRecords, pageSize, onPageChange }) {
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
    const pages = getPageNumbers(currentPage, totalPages);
    return (
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <button className={taStyles["pagination-btn"]} disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
                <img src="images/arrow-left-ic.svg" alt="Previous" title="Previous Page" />
            </button>
            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={i}>...</span>
                ) : (
                    <button
                        key={i}
                        onClick={() => onPageChange(p)}
                        style={{
                            background: p === currentPage ? "#FFDA30" : "white",
                            border: "1px solid #ccc",
                            padding: "4px 8px",
                            cursor: "pointer",
                            borderRadius: "4px",
                            fontWeight: p === currentPage ? "600" : "400",
                        }}
                    >
                        {p}
                    </button>
                )
            )}
            <button className={taStyles["pagination-btn"]} disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
                <img src="images/arrow-right-ic.svg" alt="Next" title="Next Page" />
            </button>
        </div>
    );
}

export default function NewTADashboard() {
    const [activeTopTab, setActiveTopTab] = useState('Full-Time');
    const [activeBottomTab, setActiveBottomTab] = useState('Dashboard');
    const [searchValue, setSearchValue] = useState('');
    const [selectedTA, setSelectedTA] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [showHRLegend, setShowHRLegend] = useState(false);

    const [topPageIndex, setTopPageIndex] = useState(1);
    const [topPageSize, setTopPageSize] = useState(10);

    const [bottomPageIndex, setBottomPageIndex] = useState(1);
    const [bottomPageSize, setBottomPageSize] = useState(10);

    const pageSizeOptions = [10, 20, 50, 100];

    const topData = activeTopTab === 'Full-Time' ? fullTimeData : contractData;

    useEffect(() => {
        if (!showHRLegend) return;
        const close = (e) => {
            if (!e.target.closest(`.${taStyles['hr-legend-panel']}`) && !e.target.closest(`.${taStyles['hr-legend-toggle']}`)) {
                setShowHRLegend(false);
            }
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [showHRLegend]);

    return (
        <main className={taStyles["main-content"]}>
            <div className={taStyles["content-wrapper"]}>

                {/* ===================== SECTION 1 ===================== */}

                <div className={taStyles["tab-group"]}>
                    <button
                        className={`${taStyles["tab"]} ${activeTopTab === 'Full-Time' ? taStyles["tab-active"] : ''}`}
                        onClick={() => setActiveTopTab('Full-Time')}
                    >Full-Time</button>
                    <button
                        className={`${taStyles["tab"]} ${activeTopTab === 'Contract' ? taStyles["tab-active"] : ''}`}
                        onClick={() => setActiveTopTab('Contract')}
                    >Contract</button>
                </div>
                <section className={taStyles["card"]}>
                    

                    <div className={taStyles["table-container"]}>
                        <table className={taStyles["data-table"]}>
                            <thead>
                                <tr>
                                    <th>RECRUITER NAME</th>
                                    <th>TL</th>
                                    <th>TALENT NAME</th>
                                    <th>COMPANY NAME</th>
                                    <th>HR ID</th>
                                    <th>POSITION NAME</th>
                                    <th>NBD/EXISTING</th>
                                    <th>SOW SIGNED DATE</th>
                                    <th>JOINING DATE</th>
                                    <th>STATUS</th>
                                    <th>DP / CONTRACT</th>
                                    <th>TALENT PAYRATE</th>
                                    <th>NR% / DP%</th>
                                    <th>DP (INR)</th>
                                    <th>NR (USD)</th>
                                    <th>BILL RATE</th>
                                    <th>DP / MONTH (USD)</th>
                                    <th>TOTAL ACHIEVEMENT VALUE</th>
                                    <th>MONTH WISE</th>
                                    <th>BACKOUT</th>
                                    <th>CLOSURE MONTH</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topData.map((row, i) => (
                                    <tr key={i}>
                                        <td>{row.recruiter}</td>
                                        <td>{row.tl}</td>
                                        <td>{row.talent}</td>
                                        <td>{row.company}</td>
                                        <td>{row.hrId}</td>
                                        <td style={{ whiteSpace: 'pre-line' }}>{row.position}</td>
                                        <td>
                                            <div className={taStyles["inline-select-wrap"]}>
                                                <select className={taStyles["inline-select"]} defaultValue={row.nbd}>
                                                    <option>Existing</option>
                                                    <option>NBD</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td>{row.sowDate}</td>
                                        <td>{row.joiningDate}</td>
                                        <td>
                                            <div className={taStyles["inline-select-wrap"]}>
                                                <select className={taStyles["inline-select"]} defaultValue={row.status}>
                                                    <option>Joined</option>
                                                    <option>Backout</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={taStyles["inline-select-wrap"]}>
                                                <select className={taStyles["inline-select"]} defaultValue={row.dpContract}>
                                                    <option>DP</option>
                                                    <option>Contract</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td>{row.payRate}</td>
                                        <td>{row.nrDp}</td>
                                        <td>{row.dpInr}</td>
                                        <td>{row.nrUsd}</td>
                                        <td>{row.billRate}</td>
                                        <td>{row.dpMonthUsd}</td>
                                        <td>{row.totalAchievement}</td>
                                        <td>{row.monthWise}</td>
                                        <td>{row.backout}</td>
                                        <td>{row.closureMonth}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={taStyles["table-pagination-footer"]}>
                        <div className={taStyles["pagination"]}>
                            <div className={taStyles["pagination-right"]}>
                                <div className={taStyles["per-page-container"]}>
                                    <span>Rows per page:</span>
                                    <div className={taStyles["select-wrapper"]}>
                                        <select
                                            className={taStyles["rows-select"]}
                                            value={topPageSize}
                                            onChange={(e) => { setTopPageSize(Number(e.target.value)); setTopPageIndex(1); }}
                                        >
                                            {pageSizeOptions.map((size) => (<option key={size} value={size}>{size}</option>))}
                                        </select>
                                    </div>
                                </div>
                                <span className={taStyles["pagination-info"]}>{`1-${topData.length} of 13`}</span>
                                <div className={taStyles["pagination-buttons"]}>
                                    <PaginationComponent
                                        currentPage={topPageIndex}
                                        totalRecords={13}
                                        pageSize={topPageSize}
                                        onPageChange={(p) => setTopPageIndex(p)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===================== SECTION 2 ===================== */}
                <section className={taStyles["card"]}>
                    <h2 className={taStyles["section-title"]}>Total Achievement (Closure Month)</h2>
                    <div className={taStyles["achievement-grid"]}>
                        <div className={taStyles["achievement-table-wrap"]}>
                            <table className={taStyles["data-table"]}>
                                <thead>
                                    <tr>
                                        <th>RECRUITER NAME</th>
                                        <th>DECEMBER</th>
                                        <th>NOVEMBER</th>
                                        <th>OCTOBER</th>
                                        <th>GRAND TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {achievementNumbersData.map((row, i) => (
                                        <tr key={i} className={row.isTotal ? taStyles["row-total"] : ''}>
                                            <td>{row.recruiter}</td>
                                            <td>{row.dec}</td>
                                            <td>{row.nov}</td>
                                            <td>{row.oct}</td>
                                            <td>{row.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={taStyles["achievement-table-wrap"]}>
                            <table className={taStyles["data-table"]}>
                                <thead>
                                    <tr>
                                        <th>RECRUITER NAME</th>
                                        <th>DECEMBER</th>
                                        <th>NOVEMBER</th>
                                        <th>OCTOBER</th>
                                        <th>GRAND TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {achievementPercentData.map((row, i) => (
                                        <tr key={i} className={row.isTotal ? taStyles["row-total"] : ''}>
                                            <td>{row.recruiter}</td>
                                            <td>{row.dec}</td>
                                            <td>{row.nov}</td>
                                            <td>{row.oct}</td>
                                            <td>{row.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* ===================== SECTION 3 ===================== */}
                <section className={taStyles["card"]}>
                    <div className={taStyles["section-3-header"]}>
                        <div className={taStyles["tab-group"]}>
                            <button
                                className={`${taStyles["tab"]} ${activeBottomTab === 'Dashboard' ? taStyles["tab-active"] : ''}`}
                                onClick={() => setActiveBottomTab('Dashboard')}
                            >Dashboard</button>
                            <button
                                className={`${taStyles["tab"]} ${activeBottomTab === 'Goal vs Achieved Targets' ? taStyles["tab-active"] : ''}`}
                                onClick={() => setActiveBottomTab('Goal vs Achieved Targets')}
                            >Goal vs Achieved Targets</button>
                        </div>
                        {activeBottomTab === 'Dashboard' && (
                            <button className={taStyles["btn-add-task"]}>Add new task</button>
                        )}
                    </div>

                    <div className={taStyles["filter-row"]}>
                        <div className={taStyles["filter-select-wrap"]}>
                            <select
                                className={taStyles["filter-select"]}
                                value={selectedTA}
                                onChange={(e) => setSelectedTA(e.target.value)}
                            >
                                <option value="">Select TA</option>
                                {taOptions.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <img src="images/select-dropdown-ic.svg" alt="" className={taStyles["filter-select-arrow"]} />
                        </div>

                        {activeBottomTab === 'Dashboard' ? (
                            <>
                                <button className={taStyles["filter-btn"]}>
                                    <span>Add Filters</span>
                                    <img src="images/filter-ic.svg" alt="Filter" />
                                </button>
                                <div className={taStyles["search-group"]}>
                                    <input
                                        type="text"
                                        className={taStyles["filter-input"]}
                                        placeholder="Search"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                    <img src="images/search-ic.svg" alt="Search" className={taStyles["input-icon"]} />
                                </div>
                            </>
                        ) : (
                            <div className={taStyles["calendarFilter"]}>
                                <DatePicker
                                    onKeyDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    className={taStyles["dateFilter"]}
                                    placeholderText="Select Date Range"
                                    selectsRange
                                    startDate={dateRange[0]}
                                    endDate={dateRange[1]}
                                    onChange={(update) => setDateRange(update)}
                                    isClearable={false}
                                />
                                <img src="images/calendar-ic.svg" alt="Calendar" className={taStyles["calendar-icon-right"]} />
                            </div>
                        )}
                    </div>

                    {activeBottomTab === 'Dashboard' && (
                        <>
                            <div className={taStyles["table-container"]}>
                                <table className={taStyles["data-table"]}>
                                    <thead>
                                        <tr>
                                            <th>TA NAME</th>
                                            <th>COMPANY NAME</th>
                                            <th>HR TITLE / ID</th>
                                            <th>PRIORITY</th>
                                            <th>INTERVIEW<br />ROUNDS</th>
                                            <th>AM</th>
                                            <th>NBD/EXISTING</th>
                                            <th>PRICING MODEL</th>
                                            <th>TALENT PAY RATE</th>
                                            <th>NR %</th>
                                            <th>NR (USD)</th>
                                            <th>BILL RATE</th>
                                            <th>ACTIVE TRS</th>
                                            <th>CONTRACT/EOR</th>
                                            <th>TASK FOR AM'S</th>
                                            <th>TASK FOR TA'S</th>
                                            <th>ACTIVE<br />PROFILES</th>
                                            <th>LATEST COMMUNICATION AND UPDATES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardTasksData.map((row, i) => {
                                            const statusMeta = HR_STATUS[row.status] || { color: '#DCDCDC', label: '' };
                                            return (
                                                <tr key={i}>
                                                    <td>{row.ta}</td>
                                                    <td>{row.company}</td>
                                                    <td>
                                                        <div className={taStyles["hr-title-cell"]}>
                                                            <span
                                                                className={taStyles["hr-status-box"]}
                                                                style={{ background: statusMeta.color }}
                                                            >
                                                                <span className={taStyles["hr-status-tooltip"]}>{statusMeta.label}</span>
                                                            </span>
                                                            <div className={taStyles["hr-title-text"]}>
                                                                <span>{row.hrTitle}</span>
                                                                <span className={taStyles["hr-id-chip"]}>{row.hrId}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={taStyles["inline-select-wrap"]}>
                                                            <select className={taStyles["inline-select"]} defaultValue={row.priority}>
                                                                <option>Fasttrack</option>
                                                                <option>Slow</option>
                                                                <option>Medium</option>
                                                                <option>Pause</option>
                                                                <option>Covered</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>{row.rounds}</td>
                                                    <td>{row.am}</td>
                                                    <td>
                                                        <div className={taStyles["inline-select-wrap"]}>
                                                            <select className={taStyles["inline-select"]} defaultValue={row.nbd}>
                                                                <option>Existing</option>
                                                                <option>NBD</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={taStyles["inline-select-wrap"]}>
                                                            <select className={taStyles["inline-select"]} defaultValue={row.pricing}>
                                                                <option>Transparent</option>
                                                                <option>Non-transparent</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>{row.payRate}</td>
                                                    <td>
                                                        <div className={taStyles["cell-input-wrap"]}>
                                                            <input type="text" className={taStyles["cell-input"]} defaultValue={row.nrPct} />
                                                        </div>
                                                    </td>
                                                    <td>{row.nrUsd}</td>
                                                    <td>{row.billRate}</td>
                                                    <td>{row.activeTrs}</td>
                                                    <td>
                                                        <div className={taStyles["inline-select-wrap"]}>
                                                            <select className={taStyles["inline-select"]} defaultValue={row.contractEor}>
                                                                <option>Contract</option>
                                                                <option>EOR</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>{row.taskAm}</td>
                                                    <td>{row.taskTa}</td>
                                                    <td>{row.activeProfiles}</td>
                                                    <td>
                                                        {row.showAdd ? (
                                                            <button className={taStyles["cell-add-btn"]}>Add</button>
                                                        ) : (
                                                            <>
                                                                <div className={taStyles["comm-updates"]}>{row.updates}</div>
                                                                <div className={taStyles["view-edit"]}>
                                                                    <button>View</button>
                                                                    <button>Edit</button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                
                                {showHRLegend && (
                                    <div className={taStyles["hr-legend-panel"]}>
                                        {Object.values(HR_STATUS).map((s, i) => (
                                            <div key={i} className={taStyles["hr-legend-item"]}>
                                                <span className={taStyles["hr-legend-swatch"]} style={{ background: s.color }} />
                                                <span className={taStyles["hr-legend-label"]}>{s.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className={taStyles["table-pagination-footer"]}>
                                <div className={taStyles["pagination"]}>
                                    <div className={taStyles["pagination-right"]}>
                                        <div className={taStyles["per-page-container"]}>
                                            <span>Rows per page:</span>
                                            <div className={taStyles["select-wrapper"]}>
                                                <select
                                                    className={taStyles["rows-select"]}
                                                    value={bottomPageSize}
                                                    onChange={(e) => { setBottomPageSize(Number(e.target.value)); setBottomPageIndex(1); }}
                                                >
                                                    {pageSizeOptions.map((size) => (<option key={size} value={size}>{size}</option>))}
                                                </select>
                                            </div>
                                        </div>
                                        <span className={taStyles["pagination-info"]}>{`1-${dashboardTasksData.length} of 13`}</span>
                                        <div className={taStyles["pagination-buttons"]}>
                                            <PaginationComponent
                                                currentPage={bottomPageIndex}
                                                totalRecords={13}
                                                pageSize={bottomPageSize}
                                                onPageChange={(p) => setBottomPageIndex(p)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeBottomTab === 'Goal vs Achieved Targets' && (
                        <div className={taStyles["table-container"]}>
                            <table className={taStyles["data-table"]}>
                                <thead>
                                    <tr>
                                        <th>TA</th>
                                        <th>COMPANY</th>
                                        <th>HR TITLE</th>
                                        <th>PROFILES SHARED<br />TARGET</th>
                                        <th>PROFILES SHARED<br />ACHIEVE</th>
                                        <th>L1 INTERVIEWS<br />SCHEDULED</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {goalVsAchievedData.map((row, i) => (
                                        <tr key={i}>
                                            <td>{row.ta}</td>
                                            <td>{row.company}</td>
                                            <td>
                                                <div className={taStyles["hr-title-text"]}>
                                                    <span>{row.hrTitle}</span>
                                                    <span className={taStyles["hr-id-chip"]}>{row.hrId}</span>
                                                </div>
                                            </td>
                                            <td>{row.target}</td>
                                            <td>{row.achieve}</td>
                                            <td>{row.l1}</td>
                                        </tr>
                                    ))}
                                    <tr className={taStyles["row-total"]}>
                                        <td>TOTAL</td>
                                        <td></td>
                                        <td></td>
                                        <td>27</td>
                                        <td>4</td>
                                        <td>7</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}
