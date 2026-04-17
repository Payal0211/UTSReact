import React, { useState, useEffect } from "react";
import taStyles from "./n_tadashboard.module.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// ==================== CONTRACT TAB DATA ====================
const contractSection1Data = [
    { recruiter: 'Parul Jaiswal', tl: 'Smriti', talent: 'Santhisri', company: 'Remofirst', hrId: 'HR081225133754', position: 'Frontend developer', nbd: 'Existing', sowDate: '1-Sept-2025', joiningDate: '1-Sept-2025', status: 'Joined', dpContract: 'DP', payRate: '3143520', nrDp: '10%', dpInr: '264804.9', nrUsd: '', billRate: '1000', dpMonthUsd: '1000', totalAchievement: '', monthWise: '1st - Sept', backout: '', closureMonth: 'Sept' },
    { recruiter: 'Kritika Khanna', tl: 'Shelly', talent: 'Saikrishna Kotagiri', company: 'Delightree', hrId: 'HR081225133754', position: 'Sr React Native Developer\nSaaS Platform', nbd: 'Existing', sowDate: '3-Sept-2025', joiningDate: '3-Sept-2025', status: 'Joined', dpContract: 'DP', payRate: '2800000', nrDp: '10%', dpInr: '280000', nrUsd: '', billRate: '1057', dpMonthUsd: '1057', totalAchievement: '', monthWise: '1st - Sept', backout: '', closureMonth: 'Sept' },
    { recruiter: 'Kritika Kahana', tl: 'Shelly', talent: 'Rishabh Raizada', company: 'Finrep AI', hrId: 'HR081225133754', position: 'Founding\nBackend Engineer', nbd: 'NBD', sowDate: '25-Sept-2025', joiningDate: '25-Sept-2025', status: 'Joined', dpContract: 'DP', payRate: '500000', nrDp: '12.50%', dpInr: '625000', nrUsd: '', billRate: '2360', dpMonthUsd: '2360', totalAchievement: '', monthWise: '1st - Sept', backout: '', closureMonth: 'Sept' },
    { recruiter: 'Reshmi', tl: 'Shelly', talent: 'Ranjan Yadav', company: 'Spectrocloud', hrId: 'HR081225133754', position: 'Security Engineer', nbd: 'Existing', sowDate: '22-Sept-2025', joiningDate: '22-Sept-2025', status: 'Backout', dpContract: 'Contract', payRate: '1607', nrDp: '35%', dpInr: '', nrUsd: '', billRate: '2170', dpMonthUsd: '', totalAchievement: '0', monthWise: '', backout: '563', closureMonth: '' },
    { recruiter: 'Hudda', tl: 'Smriti', talent: 'Aarav Mehta', company: 'Remofirst', hrId: 'HR081225133754', position: 'Data Engineer', nbd: 'Existing', sowDate: '12-Sept-2025', joiningDate: '12-Sept-2025', status: 'Joined', dpContract: 'DP', payRate: '2100000', nrDp: '11%', dpInr: '210000', nrUsd: '', billRate: '1200', dpMonthUsd: '1200', totalAchievement: '', monthWise: '1st - Sept', backout: '', closureMonth: 'Sept' },
];

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

const contractDashboardData = [
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

// ==================== FULL-TIME TAB DATA ====================
const ftSection1Summary = {
    carryFwdPipeline: '5,65,76,139',
    carryFwdNotIncluded: '1,94,37,266',
    addedHrNew: '2,58,19,093',
    achievePipeline: '1,63,57,020',
    lostPipeline: '1,88,23,954',
    totalActivePipeline: '4,05,63,235',
    todayTargetShared: '57',
    todayAchievedShared: '3',
    todayL1Scheduled: '14',
    yesterdayTargetShared: '88',
    yesterdayAchievedShared: '34',
    yesterdayL1Scheduled: '24',
};

const ftSection2Data = [
    { ta: 'Parul Jaiswal' },
    { ta: 'Kritika Khanna' },
    { ta: 'Reshmi' },
    { ta: 'Total', isTotal: true },
];

const ftDashboardData = [
    { ta: 'Debraj Bhattacharya', company: 'Mecalux',    diamond: true, hrTitle: 'Database Administrator',  hrId: 'HR081225133754', priority: 'P1', status: 'Fasttrack', profilesShared: '0 / NA / 2',  contractFt: 'DP',       talentBudget: '₹25,00,000', uplersFee: '10', uploadsFees: '₹2,50,000', activeTr: '1', totalRevenue: '₹2,50,000', activeProfiles: '11', latestUpdate: 'Add',      inboundOutbound: 'DP', interviewRounds: '', hrStatus: 'Info pending', sales: 'Saptarshi Banerjee', hrCreatedDate: '22-Mar-2025', openOneMonth: 'Yes' },
    { ta: '',                    company: 'Delightree', diamond: true, hrTitle: 'UI/UX Designer',          hrId: 'HR081225133754', priority: 'P1', status: 'Slow',      profilesShared: '0 / NA / NA', contractFt: 'DP',       talentBudget: '₹25,00,000', uplersFee: '10', uploadsFees: '₹2,50,000', activeTr: '1', totalRevenue: '₹2,50,000', activeProfiles: '3',  latestUpdate: 'ViewEdit', inboundOutbound: 'DP', interviewRounds: '', hrStatus: 'In process',   sales: 'BA Pragati Shree',   hrCreatedDate: '15-Jan-2025', openOneMonth: 'No'  },
    { ta: 'Komal Vilas Sutar',   company: 'Mecalux',    diamond: true, hrTitle: 'Systems Architect',       hrId: 'HR081225133754', priority: 'P1', status: 'Pause',     profilesShared: '0 / NA / 2',  contractFt: 'DP',       talentBudget: '₹25,00,000', uplersFee: '10', uploadsFees: '₹2,50,000', activeTr: '1', totalRevenue: '₹2,50,000', activeProfiles: '11', latestUpdate: 'Add',      inboundOutbound: 'DP', interviewRounds: '', hrStatus: 'Completed',    sales: 'Saptarshi Banerjee', hrCreatedDate: '30-Nov-2025', openOneMonth: 'Yes' },
    { ta: '',                    company: 'Riskspan',   diamond: false,hrTitle: 'Network Administrator',   hrId: 'HR081225133754', priority: 'P1', status: 'Medium',    profilesShared: '0 / NA / 1',  contractFt: 'Contract', talentBudget: '₹25,00,000', uplersFee: '10', uploadsFees: '₹2,50,000', activeTr: '1', totalRevenue: '₹2,50,000', activeProfiles: '4',  latestUpdate: 'Add',      inboundOutbound: 'DP', interviewRounds: '', hrStatus: 'Lost',         sales: 'BA Pragati Shree',   hrCreatedDate: '19-Sep-2025', openOneMonth: 'No'  },
    { ta: '',                    company: 'Delightree', diamond: true, hrTitle: 'DevOps Engineer',         hrId: 'HR081225133754', priority: 'P1', status: 'Covered',   profilesShared: '0 / NA / 1',  contractFt: 'Contract', talentBudget: '₹25,00,000', uplersFee: '10', uploadsFees: '₹2,50,000', activeTr: '1', totalRevenue: '₹2,50,000', activeProfiles: '7',  latestUpdate: 'ViewEdit', inboundOutbound: 'DP', interviewRounds: '', hrStatus: 'Canceled',     sales: 'Saptarshi Banerjee', hrCreatedDate: '11-Feb-2026', openOneMonth: 'Yes' },
    { ta: 'Mazahar Shariff',     company: 'Delightree', diamond: true, hrTitle: 'Data Analyst',            hrId: 'HR081225133754', priority: 'P1', status: 'Slow',      profilesShared: '0 / NA / 2',  contractFt: 'DP',       talentBudget: '₹25,00,000', uplersFee: '10', uploadsFees: '₹2,50,000', activeTr: '1', totalRevenue: '₹2,50,000', activeProfiles: '2',  latestUpdate: 'Add',      inboundOutbound: 'DP', interviewRounds: '', hrStatus: 'Covered',      sales: 'Saptarshi Banerjee', hrCreatedDate: '27-Apr-2026', openOneMonth: 'Yes' },
    { ta: '',                    company: 'Mecalux',    diamond: false,hrTitle: 'Software Engineer',       hrId: 'HR081225133754', priority: 'P1', status: 'Pause',     profilesShared: '0 / NA / NA', contractFt: 'Contract', talentBudget: '₹25,00,000', uplersFee: '10', uploadsFees: '₹2,50,000', activeTr: '1', totalRevenue: '₹2,50,000', activeProfiles: '3',  latestUpdate: 'ViewEdit', inboundOutbound: 'DP', interviewRounds: '', hrStatus: 'HR accepted',  sales: 'Saptarshi Banerjee', hrCreatedDate: '04-Jul-2025', openOneMonth: 'No'  },
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

function PaginationFooter({ pageIndex, pageSize, totalRecords, onPageSizeChange, onPageChange, pageSizeOptions, currentLength }) {
    return (
        <div className={taStyles["table-pagination-footer"]}>
            <div className={taStyles["pagination"]}>
                <div className={taStyles["pagination-right"]}>
                    <div className={taStyles["per-page-container"]}>
                        <span>Rows per page:</span>
                        <div className={taStyles["select-wrapper"]}>
                            <select
                                className={taStyles["rows-select"]}
                                value={pageSize}
                                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            >
                                {pageSizeOptions.map((size) => (<option key={size} value={size}>{size}</option>))}
                            </select>
                        </div>
                    </div>
                    <span className={taStyles["pagination-info"]}>{`1-${currentLength} of ${totalRecords}`}</span>
                    <div className={taStyles["pagination-buttons"]}>
                        <PaginationComponent
                            currentPage={pageIndex}
                            totalRecords={totalRecords}
                            pageSize={pageSize}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            </div>
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

    const [sec2PageIndex, setSec2PageIndex] = useState(1);
    const [sec2PageSize, setSec2PageSize] = useState(10);

    const [bottomPageIndex, setBottomPageIndex] = useState(1);
    const [bottomPageSize, setBottomPageSize] = useState(10);

    const [ftDiamondFlags, setFtDiamondFlags] = useState(
        () => ftDashboardData.map(r => !!r.diamond)
    );
    const toggleFtDiamond = (idx) =>
        setFtDiamondFlags(prev => prev.map((v, i) => i === idx ? !v : v));

    const pageSizeOptions = [10, 20, 50, 100];

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

    const isFT = activeTopTab === 'Full-Time';

    return (
        <main className={taStyles["main-content"]}>
            <div className={taStyles["content-wrapper"]}>

                {/* ===== Top Tabs (outside all sections) ===== */}
                <div className={taStyles["tab-group"]}>
                    <button
                        className={`${taStyles["tab"]} ${isFT ? taStyles["tab-active"] : ''}`}
                        onClick={() => setActiveTopTab('Full-Time')}
                    >Full-Time</button>
                    <button
                        className={`${taStyles["tab"]} ${!isFT ? taStyles["tab-active"] : ''}`}
                        onClick={() => setActiveTopTab('Contract')}
                    >Contract</button>
                </div>

                {/* ===================== SECTION 1 ===================== */}
                <section className={taStyles["card"]}>
                    {isFT ? (
                        <div className={taStyles["table-container"]}>
                            <table className={taStyles["data-table"]}>
                                <thead>
                                    <tr>
                                        <th>CARRY FWD<br />PIPELINE (INR)</th>
                                        <th>CARRY FWD NOT<br />INCLUDED PIPELINE (INR)</th>
                                        <th>ADDED HR (NEW)</th>
                                        <th>ACHIEVE PIPELINE (INR)</th>
                                        <th>LOST PIPELINE (INR)</th>
                                        <th>TOTAL ACTIVE PIPELINE (INR)</th>
                                        <th>TODAY TOTAL PROFILE<br />SHARED TARGET</th>
                                        <th>TODAY TOTAL PROFILE<br />SHARED ACHIEVED</th>
                                        <th>TODAY TOTAL L1<br />ROUND SCHEDULED</th>
                                        <th>YESTERDAY TOTAL PROFILE<br />SHARED TARGET</th>
                                        <th>YESTERDAY TOTAL PROFILE<br />SHARED ACHIEVED</th>
                                        <th>YESTERDAY TOTAL L1<br />ROUND SCHEDULED</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{ftSection1Summary.carryFwdPipeline}</td>
                                        <td>{ftSection1Summary.carryFwdNotIncluded}</td>
                                        <td>{ftSection1Summary.addedHrNew}</td>
                                        <td>{ftSection1Summary.achievePipeline}</td>
                                        <td>{ftSection1Summary.lostPipeline}</td>
                                        <td>{ftSection1Summary.totalActivePipeline}</td>
                                        <td>{ftSection1Summary.todayTargetShared}</td>
                                        <td>{ftSection1Summary.todayAchievedShared}</td>
                                        <td>{ftSection1Summary.todayL1Scheduled}</td>
                                        <td>{ftSection1Summary.yesterdayTargetShared}</td>
                                        <td>{ftSection1Summary.yesterdayAchievedShared}</td>
                                        <td>{ftSection1Summary.yesterdayL1Scheduled}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <>
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
                                        {contractSection1Data.map((row, i) => (
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

                            <PaginationFooter
                                pageIndex={topPageIndex}
                                pageSize={topPageSize}
                                totalRecords={13}
                                currentLength={contractSection1Data.length}
                                pageSizeOptions={pageSizeOptions}
                                onPageSizeChange={(v) => { setTopPageSize(v); setTopPageIndex(1); }}
                                onPageChange={(p) => setTopPageIndex(p)}
                            />
                        </>
                    )}
                </section>

                {/* ===================== SECTION 2 ===================== */}
                <section className={taStyles["card"]}>
                    {isFT ? (
                        <>
                            <div className={taStyles["table-container"]}>
                                <table className={taStyles["data-table"]}>
                                    <thead>
                                        <tr>
                                            <th>TA</th>
                                            <th>REVENUE GOAL</th>
                                            <th>TOTAL CARRY<br />FORWARD PIPELINE</th>
                                            <th>CUR. MONTH<br />PIPELINE (INR)</th>
                                            <th>TOTAL PIPELINE<br />IN A MONTH TO PLAY</th>
                                            <th>MULTIPLIER OF GOAL</th>
                                            <th>NUMBER PROFILES<br />SHARED</th>
                                            <th>NO. OF R1 INTERVIEW<br />COMPLETED (CURRENT MONTH)</th>
                                            <th>NO. OF R2 INTERVIEW<br />COMPLETED (CURRENT MONTH)</th>
                                            <th>NO. OF R3 INTERVIEW<br />COMPLETED (CURRENT MONTH)</th>
                                            <th>PROFILE TO<br />R1 RATIO</th>
                                            <th>NO. OF TALENTS<br />REJECTED IN INTERVIEW</th>
                                            <th>NO. OF OFFERS</th>
                                            <th>OFFER DROPOUT /<br />BACKOUT</th>
                                            <th>INTERVIEW DONE TO<br />SELECTED (I2S %)</th>
                                            <th>NUMBER OF OFFER<br />SIGNED (DIRECT PLACEMENT)</th>
                                            <th>OFFER SIGNED<br />REVENUE</th>
                                            <th># OF JOINED<br />TALENTS IN THE MONTH</th>
                                            <th>JOINING<br />REVENUE</th>
                                            <th>GOAL VS<br />ACHIVED</th>
                                            <th>TOTAL PIPELINE<br />TO JOINING %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ftSection2Data.map((row, i) => (
                                            <tr key={i}>
                                                <td>{row.ta}</td>
                                                <td></td><td></td><td></td><td></td><td></td><td></td>
                                                <td></td><td></td><td></td><td></td><td></td><td></td>
                                                <td></td><td></td><td></td><td></td><td></td><td></td>
                                                <td></td><td></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <PaginationFooter
                                pageIndex={sec2PageIndex}
                                pageSize={sec2PageSize}
                                totalRecords={13}
                                currentLength={ftSection2Data.length}
                                pageSizeOptions={pageSizeOptions}
                                onPageSizeChange={(v) => { setSec2PageSize(v); setSec2PageIndex(1); }}
                                onPageChange={(p) => setSec2PageIndex(p)}
                            />
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
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
                            {isFT ? (
                                <div className={taStyles["table-container"]}>
                                    <table className={taStyles["data-table"]}>
                                        <thead>
                                            <tr>
                                                <th>TA NAME</th>
                                                <th>COMPANY NAME</th>
                                                <th>HR TITLE / ID</th>
                                                <th>PRIORITY</th>
                                                <th>STATUS</th>
                                                <th>PROFILES SHARED TARGET<br />/ ACHIEVED / L1 ROUND</th>
                                                <th>CONTRACT / FT</th>
                                                <th>TALENT BUDGET</th>
                                                <th>UPLERS<br />FEES %</th>
                                                <th>UPLOADS FEES</th>
                                                <th>ACTIVE TR'S</th>
                                                <th>TOTAL REVENUE<br />OPPORTUNITY</th>
                                                <th>ACTIVE PROFILES<br />TILL DATE</th>
                                                <th>LATEST UPDATES</th>
                                                <th>INBOUND /<br />OUTBOUND</th>
                                                <th># INTERVIEW<br />ROUNDS</th>
                                                <th>HR STATUS</th>
                                                <th>SALES</th>
                                                <th>HR<br />CREATED DATE</th>
                                                <th>OPEN SINCE &gt;<br />ONE MONTH (YES/NO)</th>
                                                <th>ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ftDashboardData.map((row, i) => (
                                                <tr key={i}>
                                                    <td>{row.ta}</td>
                                                    <td>
                                                        <div className={taStyles["company-cell"]}>
                                                            <span className={taStyles["company-name"]}>{row.company}</span>
                                                            <button
                                                                className={taStyles["diamond-toggle"]}
                                                                data-tooltip={ftDiamondFlags[i] ? "Remove Diamond" : "Add Diamond"}
                                                                onClick={() => toggleFtDiamond(i)}
                                                            >
                                                                {ftDiamondFlags[i]
                                                                    ? <img src="images/diamond-active-ic.svg" alt="Diamond Active" className={`${taStyles["diamond-icon"]} ${taStyles["diamond-active"]}`} />
                                                                    : <img src="images/diamond-ic.svg" alt="Diamond" className={`${taStyles["diamond-icon"]} ${taStyles["diamond-inactive"]}`} />}
                                                            </button>
                                                            <button className={taStyles["plus-task-btn"]} data-tooltip="Add new task">
                                                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M13 0C10.4288 0 7.91543 0.762437 5.77759 2.1909C3.63975 3.61935 1.97351 5.64968 0.989572 8.02512C0.0056327 10.4006 -0.251811 13.0144 0.249797 15.5362C0.751405 18.0579 1.98953 20.3743 3.80762 22.1924C5.6257 24.0105 7.94208 25.2486 10.4638 25.7502C12.9856 26.2518 15.5995 25.9944 17.9749 25.0104C20.3503 24.0265 22.3807 22.3603 23.8091 20.2224C25.2376 18.0846 26 15.5712 26 13C25.9957 9.55351 24.6247 6.2494 22.1876 3.81236C19.7506 1.37532 16.4465 0.00430006 13 0ZM18 14H14V18C14 18.2652 13.8946 18.5196 13.7071 18.7071C13.5196 18.8946 13.2652 19 13 19C12.7348 19 12.4804 18.8946 12.2929 18.7071C12.1054 18.5196 12 18.2652 12 18V14H8.00001C7.73479 14 7.48044 13.8946 7.2929 13.7071C7.10536 13.5196 7.00001 13.2652 7.00001 13C7.00001 12.7348 7.10536 12.4804 7.2929 12.2929C7.48044 12.1054 7.73479 12 8.00001 12H12V8C12 7.73478 12.1054 7.48043 12.2929 7.29289C12.4804 7.10536 12.7348 7 13 7C13.2652 7 13.5196 7.10536 13.7071 7.29289C13.8946 7.48043 14 7.73478 14 8V12H18C18.2652 12 18.5196 12.1054 18.7071 12.2929C18.8946 12.4804 19 12.7348 19 13C19 13.2652 18.8946 13.5196 18.7071 13.7071C18.5196 13.8946 18.2652 14 18 14Z" fill="#8A8A8A" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={taStyles["hr-title-text"]}>
                                                            <span>{row.hrTitle}</span>
                                                            <span className={taStyles["hr-id-chip"]}>{row.hrId}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={taStyles["inline-select-wrap"]}>
                                                            <select className={taStyles["inline-select"]} defaultValue={row.priority}>
                                                                <option>P1</option>
                                                                <option>P2</option>
                                                                <option>P3</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={taStyles["inline-select-wrap"]}>
                                                            <select className={taStyles["inline-select"]} defaultValue={row.status}>
                                                                <option>Fasttrack</option>
                                                                <option>Slow</option>
                                                                <option>Medium</option>
                                                                <option>Pause</option>
                                                                <option>Covered</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={taStyles["cell-input-wrap"]}>
                                                            <input type="text" className={taStyles["cell-input"]} defaultValue={row.profilesShared} readOnly />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={taStyles["inline-select-wrap"]}>
                                                            <select className={taStyles["inline-select"]} defaultValue={row.contractFt}>
                                                                <option>DP</option>
                                                                <option>Contract</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>{row.talentBudget}</td>
                                                    <td>{row.uplersFee}</td>
                                                    <td>{row.uploadsFees}</td>
                                                    <td>{row.activeTr}</td>
                                                    <td>{row.totalRevenue}</td>
                                                    <td>
                                                        <div className={taStyles["cell-input-wrap"]}>
                                                            <input type="text" className={taStyles["cell-input"]} defaultValue={row.activeProfiles} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {row.latestUpdate === 'Add' ? (
                                                            <button className={taStyles["cell-add-btn"]}>Add</button>
                                                        ) : (
                                                            <div className={taStyles["view-edit"]}>
                                                                <button>View</button>
                                                                <button>Edit</button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className={taStyles["inline-select-wrap"]}>
                                                            <select className={taStyles["inline-select"]} defaultValue={row.inboundOutbound}>
                                                                <option>DP</option>
                                                                <option>Inbound</option>
                                                                <option>Outbound</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={taStyles["cell-input-wrap"]}>
                                                            <input type="text" className={taStyles["cell-input"]} defaultValue={row.interviewRounds} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={taStyles["inline-select-wrap"]}>
                                                            <select className={taStyles["inline-select"]} defaultValue={row.hrStatus}>
                                                                <option>Info pending</option>
                                                                <option>In process</option>
                                                                <option>Completed</option>
                                                                <option>Lost</option>
                                                                <option>Canceled</option>
                                                                <option>Covered</option>
                                                                <option>HR accepted</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>{row.sales}</td>
                                                    <td>{row.hrCreatedDate}</td>
                                                    <td>{row.openOneMonth}</td>
                                                    <td>
                                                        <button className={taStyles["action-edit-btn"]} title="Edit">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#4C4E64DE"/>
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
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
                                            {contractDashboardData.map((row, i) => {
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
                            )}

                            <PaginationFooter
                                pageIndex={bottomPageIndex}
                                pageSize={bottomPageSize}
                                totalRecords={13}
                                currentLength={isFT ? ftDashboardData.length : contractDashboardData.length}
                                pageSizeOptions={pageSizeOptions}
                                onPageSizeChange={(v) => { setBottomPageSize(v); setBottomPageIndex(1); }}
                                onPageChange={(p) => setBottomPageIndex(p)}
                            />
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
