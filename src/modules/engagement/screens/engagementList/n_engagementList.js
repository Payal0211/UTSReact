import React, {
    useState,
    useEffect,
    useCallback,
} from "react";
import engagementStyles from './n_engagementList.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Tooltip } from 'antd';


const dummyData = [
    { engagementID: 'EN081225133754_1', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 1, typeOfHR: 'Full-Time', company: 'Delightree', clientName: 'Arjun Patel', talentName: 'Vikram Joshi', amName: 'Saptarshi Banerjee', currentStatus: 'Ongoing', contractStartDate: '08-08-2026', joiningDate: '08-08-2026', jobTitle: 'Support ReactJS Developer', lwd: '15-03-2023', feedbackStatus: ['Green', 'Green', 'Red'], clientFeedbackAction: 'View/Add', lastFeedbackDate: '12-07-2023', brft: 'AUD 4,450.00', pr: 'AUD 3,560.00', feePercent: '37.14', fee: 'AUD 890.00', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-567890', clientEmail: 'arjun.patel@example.com', talentEmail: 'vikram.joshi@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
    { engagementID: 'EN081225133754_2', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 2, typeOfHR: 'Full-Time', company: 'Riskspan', clientName: 'Harpreet Singh', talentName: 'Sneha Verma', amName: 'Sushmita Gurjar', currentStatus: 'Lost - Backout', contractStartDate: '29-09-2026', joiningDate: '29-09-2026', jobTitle: 'General Engineering Manager - Onsite Mumbai', lwd: '', feedbackStatus: [], clientFeedbackAction: 'Add', lastFeedbackDate: '', brft: 'INR 1,350,000.00', pr: 'INR 1,08,000.00', feePercent: '38.02', fee: 'INR 27,000.00', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-456789', clientEmail: 'harpreet.singh@example.com', talentEmail: 'sneha.verma@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
    { engagementID: 'EN081225133754_3', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 3, typeOfHR: 'Full-Time', company: 'RemoFirst', clientName: 'Chloe Adams', talentName: 'Karan Gupta', amName: 'Sushmita Gurjar', currentStatus: 'Awaiting Joining', contractStartDate: '02-04-2026', joiningDate: '02-04-2026', jobTitle: 'Full Stack Developer', lwd: '', feedbackStatus: [], clientFeedbackAction: 'Add', lastFeedbackDate: '', brft: 'USD 3,375.00', pr: 'USD 2,700.00', feePercent: '53.85', fee: 'USD 675.00', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-345678', clientEmail: 'chloe.adams@example.com', talentEmail: 'karan.gupta@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
    { engagementID: 'EN081225133754_4', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 4, typeOfHR: 'Full-Time', company: 'Calyx Global', clientName: 'Sophie Leclerc', talentName: 'Ananya Singh', amName: 'Nikita Sharma', currentStatus: 'Ongoing', contractStartDate: '18-05-2026', joiningDate: '18-05-2026', jobTitle: 'AWS Devops Engineer', lwd: '22-07-2023', feedbackStatus: ['Green', 'Red', 'Red'], clientFeedbackAction: 'View/Add', lastFeedbackDate: '09-11-2023', brft: 'USD 4,185.00', pr: 'USD 3,348.00', feePercent: '41.84', fee: 'USD 837.00', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-123456', clientEmail: 'sophie.leclerc@example.com', talentEmail: 'ananya.singh@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
    { engagementID: 'EN081225133754_5', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 5, typeOfHR: 'Full-Time', company: 'DeepMatrix', clientName: 'Ravi Sharma', talentName: 'Neha Bhatia', amName: 'Nikita Sharma', currentStatus: 'Ongoing', contractStartDate: '14-02-2026', joiningDate: '14-02-2026', jobTitle: 'Support Desk Coordinator', lwd: '', feedbackStatus: [], clientFeedbackAction: 'View/Add', lastFeedbackDate: '05-05-2023', brft: 'USD 4,000.00', pr: 'USD 3,200.00', feePercent: '34.96', fee: 'USD 800.00', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-099765', clientEmail: 'ravi.sharma@example.com', talentEmail: 'neha.bhatia@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
    { engagementID: 'EN081225133754_6', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 6, typeOfHR: 'Full-Time', company: 'Delightree', clientName: 'Emily Johnson', talentName: 'Rahul Desai', amName: 'Nikita Sharma', currentStatus: 'Awaiting Joining', contractStartDate: '23-03-2026', joiningDate: '23-03-2026', jobTitle: 'AWS Devops Engineer', lwd: '30-01-2024', feedbackStatus: [], clientFeedbackAction: 'View/Add', lastFeedbackDate: '30-08-2023', brft: 'USD 3,835.00', pr: 'USD 3,068.00', feePercent: '35.01', fee: 'USD 767.00', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-012345', clientEmail: 'emily.johnson@example.com', talentEmail: 'rahul.desai@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
    { engagementID: 'EN081225133754_7', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 7, typeOfHR: 'Full-Time', company: 'Threat Modeler Software Inc', clientName: 'Aisha Khan', talentName: 'Aarav Sharma', amName: 'Sushmita Gurjar', currentStatus: 'Cancelled - Backout', contractStartDate: '23-07-2026', joiningDate: '23-07-2026', jobTitle: 'Backend Engineer', lwd: '', feedbackStatus: [], clientFeedbackAction: 'Add', lastFeedbackDate: '', brft: 'EUR 1,866.00', pr: 'EUR 1,493.00', feePercent: '26.89', fee: 'EUR 373.20', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-234567', clientEmail: 'aisha.khan@example.com', talentEmail: 'aarav.sharma@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
    { engagementID: 'EN081225133754_8', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 8, typeOfHR: 'Full-Time', company: 'Arkatecture', clientName: 'John Smith', talentName: 'Priya Kapoor', amName: 'Saptarshi Banerjee', currentStatus: 'Lost - Backout', contractStartDate: '15-01-2026', joiningDate: '15-01-2026', jobTitle: 'Technical Data Analyst Developer', lwd: '', feedbackStatus: ['Green', 'Green'], clientFeedbackAction: 'View/Add', lastFeedbackDate: '17-04-2023', brft: 'ZAR 52,500.00', pr: 'ZAR 42,000.00', feePercent: '40.03', fee: 'ZAR 10,500.00', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-045678', clientEmail: 'john.smith@example.com', talentEmail: 'priya.kapoor@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
];

function NewEngagementList() {
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const pageSizeOptions = [10, 20, 50, 100, 200];

    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [appliedFilter, setAppliedFilters] = useState(new Map());
    const [checkedState, setCheckedState] = useState(new Map());
    const [filteredTagLength, setFilteredTagLength] = useState(0);

    const [isAllowFilters, setIsAllowFilters] = useState(false);
    const [getHTMLFilter, setHTMLFilter] = useState(false);

    const [startDate, setStartDate] = useState(new Date());
    const [searchType, setSearchType] = useState('');
    const [selectedCell, setSelectedCell] = useState(null);

    // Calendar filter (month-year)
    const onCalenderFilter = (dates) => {
        setStartDate(dates);
    };

    // Type toggle (All / FT / Contract)
    const handleTypeToggle = (type) => {
        setSearchType(type);
    };

    // Toggle filter sidebar
    const toggleHRFilter = useCallback(() => {
        !getHTMLFilter
            ? setIsAllowFilters(true)
            : setTimeout(() => { setIsAllowFilters(true); }, 300);
        setHTMLFilter(!getHTMLFilter);
    }, [getHTMLFilter]);

    const onRemoveHRFilters = () => {
        setTimeout(() => { setIsAllowFilters(false); }, 300);
        setHTMLFilter(false);
    };

    // Clear all filters
    const clearFilters = useCallback(() => {
        setAppliedFilters(new Map());
        setCheckedState(new Map());
        setFilteredTagLength(0);
        onRemoveHRFilters();
        setDebouncedSearch('');
        setStartDate(new Date());
        setSearchType('');
    }, []);

    const handleExport = () => {
    };

    // Client-side search on dummy data
    const handleSearchInput = (e) => {
        setDebouncedSearch(e.target.value);
    };


    // Pagination helpers
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
        const totalPages = Math.ceil(totalRecords / pageSize);
        const pages = getPageNumbers(currentPage, totalPages);
        return (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button className={engagementStyles["pagination-btn"]} disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
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
                <button className={engagementStyles["pagination-btn"]} disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => onPageChange(currentPage + 1)}>
                    <img src="images/arrow-right-ic.svg" alt="Next" title="Next Page" />
                </button>
            </div>
        );
    }

    // Action dropdown state
    const [openActionIndex, setOpenActionIndex] = useState(null);
    const [copiedEmail, setCopiedEmail] = useState(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = () => setOpenActionIndex(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Cell selection handler
    const handleCellClick = (cellKey) => {
        setSelectedCell(prev => prev === cellKey ? null : cellKey);
    };

    // Get cell class for grid cells
    const getCellClass = (cellKey, isTotal = false) => {
        let cls = engagementStyles["stats-cell"];
        if (isTotal) cls += ` ${engagementStyles["stats-cell-total"]}`;
        if (selectedCell === cellKey) cls += ` ${engagementStyles["stats-cell-selected"]}`;
        return cls;
    };

    // Copy to clipboard helper
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedEmail(text);
        setTimeout(() => setCopiedEmail(null), 1500);
    };

    // Feedback color mapping
    const getFeedbackDotClass = (color) => {
        switch (color) {
            case 'Green': return engagementStyles["feedback-dot-green"];
            case 'Red': return engagementStyles["feedback-dot-red"];
            case 'Orange': return engagementStyles["feedback-dot-orange"];
            default: return '';
        }
    };


    return (
        <main className={engagementStyles["main-content"]}>
            <div className={engagementStyles["content-wrapper"]}>

                {/* ===== Filter Controls Row ===== */}
                <div className={engagementStyles["filter-controls"]}>
                    {/* 1. Search */}
                    <div className={`${engagementStyles["filter-group"]} ${engagementStyles["search-group"]}`}>
                        <input
                            type="text"
                            className={engagementStyles["filter-input"]}
                            placeholder="Search"
                            value={debouncedSearch}
                            onChange={handleSearchInput}
                        />
                        {debouncedSearch.length > 0 && (
                            <Tooltip title="Clear search">
                                <span style={{ position: 'absolute', right: '36px', color: 'red', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                                    onClick={() => { setDebouncedSearch(''); }}>
                                    X
                                </span>
                            </Tooltip>
                        )}
                        <img src="images/search-ic.svg" alt="Search" className={engagementStyles["input-icon"]} />
                    </div>

                    {/* 2. Type Toggle */}
                    <div className={engagementStyles["toggle-group"]}>
                        <button
                            className={`${engagementStyles["toggle-btn"]} ${searchType === '' ? engagementStyles["toggle-btn-active"] : ''}`}
                            onClick={() => handleTypeToggle('')}
                        >All</button>
                        <button
                            className={`${engagementStyles["toggle-btn"]} ${searchType === 'FT' ? engagementStyles["toggle-btn-active"] : ''}`}
                            onClick={() => handleTypeToggle('FT')}
                        >FT</button>
                        <button
                            className={`${engagementStyles["toggle-btn"]} ${searchType === 'Contract' ? engagementStyles["toggle-btn-active"] : ''}`}
                            onClick={() => handleTypeToggle('Contract')}
                        >Contract</button>
                    </div>

                    {/* 3. Month-Year Picker */}
                    <div className={engagementStyles["calendarFilter"]}>
                        <img src="images/calendar-ic.svg" alt="Calendar" className={engagementStyles["calendar-icon-left"]} />
                        <DatePicker
                            onKeyDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            className={engagementStyles["dateFilter"]}
                            placeholderText="Month - Year"
                            selected={startDate}
                            onChange={onCalenderFilter}
                            dateFormat="MMM yyyy"
                            showMonthYearPicker
                        />
                        <img src="images/select-dropdown-ic.svg" alt="Dropdown" className={engagementStyles["calendar-dropdown-icon"]} />
                    </div>

                    {/* 4. Add Filters */}
                    <button className={engagementStyles["filter-btn"]} onClick={toggleHRFilter}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <img src="images/filter-ic.svg" alt="Filter" />
                            <span>Add Filters</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div className={engagementStyles["filterCount"]}>{filteredTagLength}</div>
                            {filteredTagLength > 0 && (
                                <Tooltip title="Reset Filters">
                                    <span style={{ color: 'red', fontWeight: 'bold', cursor: 'pointer' }}
                                        onClick={(e) => { e.stopPropagation(); clearFilters(); }}>
                                        X
                                    </span>
                                </Tooltip>
                            )}
                        </div>
                    </button>

                    {/* 5. Export */}
                    <button className={engagementStyles["btn-export"]} onClick={() => handleExport(dummyData)}>
                        EXPORT
                    </button>
                </div>

                {/* ===== Stats Section ===== */}
                <div className={engagementStyles["stats-row"]}>
                    {/* FULL-TIME: 2x2 grid */}
                    <div className={engagementStyles["stats-section"]}>
                        <div className={engagementStyles["stats-section-header"]}>FULL-TIME</div>
                        <div className={engagementStyles["stats-table-ft"]}>
                            <div className={getCellClass('ft-added')} onClick={() => handleCellClick('ft-added')}>
                                <span className={engagementStyles["stats-number"]}>39</span>
                                <span className={engagementStyles["stats-label"]}>ADDED</span>
                            </div>
                            <div className={getCellClass('ft-active')} onClick={() => handleCellClick('ft-active')}>
                                <span className={engagementStyles["stats-number"]}>53</span>
                                <span className={engagementStyles["stats-label"]}>ACTIVE</span>
                            </div>
                            <div className={getCellClass('ft-eor')} onClick={() => handleCellClick('ft-eor')}>
                                <span className={engagementStyles["stats-number"]}>12</span>
                                <span className={engagementStyles["stats-label"]}>EOR</span>
                            </div>
                            <div className={getCellClass('ft-total', true)} onClick={() => handleCellClick('ft-total')}>
                                <span className={engagementStyles["stats-number"]}>57</span>
                                <span className={engagementStyles["stats-label"]}>TOTAL</span>
                            </div>
                        </div>
                    </div>

                    {/* CONTRACTS: row1=4cols, row2=3cols */}
                    <div className={engagementStyles["stats-section"]}>
                        <div className={engagementStyles["stats-section-header"]}>CONTRACTS</div>
                        <div className={engagementStyles["stats-grid-contracts"]}>
                            <div className={getCellClass('c-active')} onClick={() => handleCellClick('c-active')}>
                                <span className={engagementStyles["stats-number"]}>113</span>
                                <span className={engagementStyles["stats-label"]}>ACTIVE</span>
                            </div>
                            <div className={getCellClass('c-added')} onClick={() => handleCellClick('c-added')}>
                                <span className={engagementStyles["stats-number"]}>13</span>
                                <span className={engagementStyles["stats-label"]}>ADDED</span>
                            </div>
                            <div className={getCellClass('c-recurring')} onClick={() => handleCellClick('c-recurring')}>
                                <span className={engagementStyles["stats-number"]}>96</span>
                                <span className={engagementStyles["stats-label"]}>RECURRING</span>
                            </div>
                            <div className={getCellClass('c-renew')} onClick={() => handleCellClick('c-renew')}>
                                <span className={engagementStyles["stats-number"]}>1</span>
                                <span className={engagementStyles["stats-label"]}>RENEW ENGAGEMENT</span>
                            </div>
                            <div className={getCellClass('c-eor')} onClick={() => handleCellClick('c-eor')}>
                                <span className={engagementStyles["stats-number"]}>26</span>
                                <span className={engagementStyles["stats-label"]}>EOR</span>
                            </div>
                            <div className={getCellClass('c-lost')} onClick={() => handleCellClick('c-lost')}>
                                <span className={engagementStyles["stats-number"]}>8</span>
                                <span className={engagementStyles["stats-label"]}>LOST</span>
                            </div>
                            <div className={getCellClass('c-total', true)} onClick={() => handleCellClick('c-total')}>
                                <span className={engagementStyles["stats-number"]}>123</span>
                                <span className={engagementStyles["stats-label"]}>TOTAL</span>
                            </div>
                        </div>
                    </div>

                    {/* FEEDBACK: row1=2cols, row2=1col */}
                    <div className={engagementStyles["stats-section"]}>
                        <div className={engagementStyles["stats-section-header"]}>FEEDBACK</div>
                        <div className={engagementStyles["stats-grid-feedback"]}>
                            <div className={getCellClass('fb-amber')} onClick={() => handleCellClick('fb-amber')}>
                                <span className={`${engagementStyles["stats-number"]} ${engagementStyles["stats-number-amber"]}`}>5</span>
                                <span className={engagementStyles["stats-label"]}>AMBER</span>
                            </div>
                            <div className={getCellClass('fb-red')} onClick={() => handleCellClick('fb-red')}>
                                <span className={`${engagementStyles["stats-number"]} ${engagementStyles["stats-number-red"]}`}>9</span>
                                <span className={engagementStyles["stats-label"]}>RED</span>
                            </div>
                            <div className={getCellClass('fb-received')} onClick={() => handleCellClick('fb-received')}>
                                <span className={engagementStyles["stats-number"]}>127</span>
                                <span className={engagementStyles["stats-label"]}>FEEDBACK RECEIVED</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== Data Table ===== */}
                <div className={engagementStyles["table-container"]}>
                    <table className={engagementStyles["data-table"]}>
                        <thead>
                            <tr>
                                <th rowSpan={2} style={{ minWidth: '80px' }}>SHORTCUTS</th>
                                <th rowSpan={2} style={{ minWidth: '160px' }}>ENG. ID / HR#</th>
                                <th rowSpan={2}>TYPE</th>
                                <th rowSpan={2} style={{ minWidth: '160px' }}>COMPANY NAME</th>
                                <th rowSpan={2} style={{ minWidth: '130px' }}>CLIENT</th>
                                <th rowSpan={2} style={{ minWidth: '130px' }}>TALENT</th>
                                <th rowSpan={2} style={{ minWidth: '140px' }}>AM</th>
                                <th rowSpan={2} style={{ minWidth: '130px' }}>STATUS</th>
                                <th rowSpan={2} style={{ minWidth: '100px' }}>JOINING DATE</th>
                                <th rowSpan={2} style={{ minWidth: '160px' }}>JOB TITLE</th>
                                <th rowSpan={2} style={{ minWidth: '90px' }}>LWD</th>
                                <th rowSpan={2} style={{ minWidth: '100px' }}>FEEDBACK STATUS</th>
                                <th rowSpan={2} style={{ minWidth: '130px' }}>CLIENT FEEDBACK<br/>LAST FEEDBACK DATE</th>
                                <th rowSpan={2} style={{ minWidth: '110px' }}>BR/FT</th>
                                <th rowSpan={2} style={{ minWidth: '110px' }}>PR</th>
                                <th rowSpan={2} style={{ minWidth: '60px' }}>FEE %</th>
                                <th colSpan={3} className={engagementStyles["th-grouped"]}>UPLERS FEE</th>
                                <th rowSpan={2} style={{ minWidth: '100px' }}>INVOICE NO.</th>
                            </tr>
                            <tr>
                                <th className={engagementStyles["th-sub"]}><span className={engagementStyles["th-sub-label"]}>FEE</span></th>
                                <th className={engagementStyles["th-sub"]}><span className={engagementStyles["th-sub-label"]}>USD</span></th>
                                <th className={engagementStyles["th-sub"]}><span className={engagementStyles["th-sub-label"]}>INR</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyData?.length === 0 ? (
                                <tr>
                                    <td colSpan={20} style={{ textAlign: "center", padding: "20px" }}>
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                dummyData.map((data, index) => {
                                    const engIds = data?.engagementId_HRID?.split(' / ') || [];
                                    return (
                                        <tr key={data?.engagementID || index}>
                                            {/* SHORTCUTS */}
                                            <td>
                                                <div className={engagementStyles["action-btn-wrapper"]}>
                                                    <button
                                                        className={engagementStyles["action-btn"]}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenActionIndex(openActionIndex === index ? null : index);
                                                        }}
                                                    >
                                                        Action
                                                        <span className={engagementStyles["action-btn-arrow"]}><img src="images/select-dropdown-ic.svg" alt="Dropdown" className={engagementStyles["action-dropdown-icon"]} /></span>
                                                    </button>
                                                    <div className={`${engagementStyles["action-dropdown"]} ${openActionIndex === index ? engagementStyles["show"] : ''}`}>
                                                        <button className={engagementStyles["action-item"]}
                                                            onClick={() => {
                                                                setOpenActionIndex(null);
                                                                if (data?.hrID) {
                                                                    window.open(`/allhiringrequest/${data.hrID}`, '_blank');
                                                                }
                                                            }}>
                                                            HR Details
                                                        </button>
                                                        <button className={engagementStyles["action-item"]}
                                                            onClick={() => setOpenActionIndex(null)}>
                                                            Add Invoice Details
                                                        </button>
                                                        <button className={engagementStyles["action-item"]}
                                                            onClick={() => setOpenActionIndex(null)}>
                                                            End Engagement
                                                        </button>
                                                        <button className={engagementStyles["action-item"]}
                                                            onClick={() => setOpenActionIndex(null)}>
                                                            Cancel Engagement
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* ENG. ID / HR# */}
                                            <td>
                                                <a href={data?.hrID ? `/allhiringrequest/${data.hrID}` : '#'} target="_blank" rel="noreferrer" className={engagementStyles["eng-id"]}>
                                                    {engIds[0] || data?.engagementId_HRID}
                                                </a>
                                                {engIds[1] && <a href={data?.hrID ? `/allhiringrequest/${data.hrID}` : '#'} target="_blank" rel="noreferrer" className={engagementStyles["eng-id-sub"]}>{engIds[1]?.trim()}</a>}
                                            </td>
                                            {/* TYPE */}
                                            <td>{data?.typeOfHR || 'Full-Time'}</td>
                                            {/* COMPANY NAME */}
                                            <td style={{ whiteSpace: 'normal', maxWidth: '220px' }}>{data?.company}</td>
                                            {/* CLIENT - with tooltip */}
                                            <td>
                                                <div className={engagementStyles["tooltip-wrapper"]}>
                                                    {data?.clientName}
                                                    <div className={engagementStyles["tooltip-content"]}>
                                                        <span>{data?.clientEmail}</span>
                                                        <button className={engagementStyles["tooltip-copy-btn"]} onClick={() => copyToClipboard(data?.clientEmail)} title="Copy email">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 6H3.75C3.55109 6 3.36032 6.07902 3.21967 6.21967C3.07902 6.36032 3 6.55109 3 6.75V20.25C3 20.4489 3.07902 20.6397 3.21967 20.7803C3.36032 20.921 3.55109 21 3.75 21H17.25C17.4489 21 17.6397 20.921 17.7803 20.7803C17.921 20.6397 18 20.4489 18 20.25V6.75C18 6.55109 17.921 6.36032 17.7803 6.21967C17.6397 6.07902 17.4489 6 17.25 6ZM16.5 19.5H4.5V7.5H16.5V19.5ZM21 3.75V17.25C21 17.4489 20.921 17.6397 20.7803 17.7803C20.6397 17.921 20.4489 18 20.25 18C20.0511 18 19.8603 17.921 19.7197 17.7803C19.579 17.6397 19.5 17.4489 19.5 17.25V4.5H6.75C6.55109 4.5 6.36032 4.42098 6.21967 4.28033C6.07902 4.13968 6 3.94891 6 3.75C6 3.55109 6.07902 3.36032 6.21967 3.21967C6.36032 3.07902 6.55109 3 6.75 3H20.25C20.4489 3 20.6397 3.07902 20.7803 3.21967C20.921 3.36032 21 3.55109 21 3.75Z" fill="black"/></svg>
                                                        </button>
                                                        {copiedEmail === data?.clientEmail && <span className={engagementStyles["copied-text"]}>Copied!</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* TALENT - with tooltip */}
                                            <td>
                                                <div className={engagementStyles["tooltip-wrapper"]}>
                                                    {data?.talentName}
                                                    <div className={engagementStyles["tooltip-content"]}>
                                                        <span>{data?.talentEmail}</span>
                                                        <button className={engagementStyles["tooltip-copy-btn"]} onClick={() => copyToClipboard(data?.talentEmail)} title="Copy email">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 6H3.75C3.55109 6 3.36032 6.07902 3.21967 6.21967C3.07902 6.36032 3 6.55109 3 6.75V20.25C3 20.4489 3.07902 20.6397 3.21967 20.7803C3.36032 20.921 3.55109 21 3.75 21H17.25C17.4489 21 17.6397 20.921 17.7803 20.7803C17.921 20.6397 18 20.4489 18 20.25V6.75C18 6.55109 17.921 6.36032 17.7803 6.21967C17.6397 6.07902 17.4489 6 17.25 6ZM16.5 19.5H4.5V7.5H16.5V19.5ZM21 3.75V17.25C21 17.4489 20.921 17.6397 20.7803 17.7803C20.6397 17.921 20.4489 18 20.25 18C20.0511 18 19.8603 17.921 19.7197 17.7803C19.579 17.6397 19.5 17.4489 19.5 17.25V4.5H6.75C6.55109 4.5 6.36032 4.42098 6.21967 4.28033C6.07902 4.13968 6 3.94891 6 3.75C6 3.55109 6.07902 3.36032 6.21967 3.21967C6.36032 3.07902 6.55109 3 6.75 3H20.25C20.4489 3 20.6397 3.07902 20.7803 3.21967C20.921 3.36032 21 3.55109 21 3.75Z" fill="black"/></svg>
                                                        </button>
                                                        {copiedEmail === data?.talentEmail && <span className={engagementStyles["copied-text"]}>Copied!</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* AM */}
                                            <td>{data?.amName}</td>
                                            {/* STATUS */}
                                            <td>{data?.currentStatus}</td>
                                            {/* JOINING DATE */}
                                            <td>{data?.joiningDate}</td>
                                            {/* JOB TITLE */}
                                            <td style={{ whiteSpace: 'normal', maxWidth: '200px' }}>{data?.jobTitle}</td>
                                            {/* LWD */}
                                            <td>{data?.lwd}</td>
                                            {/* FEEDBACK STATUS */}
                                            <td>
                                                {data?.feedbackStatus?.length > 0 && (
                                                    <div className={engagementStyles["feedback-status-wrapper"]}>
                                                        {data.feedbackStatus.map((color, i) => (
                                                            <span key={i} className={`${engagementStyles["feedback-dot"]} ${getFeedbackDotClass(color)}`} />
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            {/* CLIENT FEEDBACK / LAST FEEDBACK DATE */}
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                                    <span className={engagementStyles["feedback-action-btn"]}>{data?.clientFeedbackAction}</span>
                                                    {data?.lastFeedbackDate && <span className={engagementStyles["feedback-date"]}>{data.lastFeedbackDate}</span>}
                                                </div>
                                            </td>
                                            {/* BR/FT */}
                                            <td>{data?.brft}</td>
                                            {/* PR */}
                                            <td>{data?.pr}</td>
                                            {/* FEE % */}
                                            <td>{data?.feePercent}</td>
                                            {/* FEE - with tooltip */}
                                            <td className={engagementStyles["td-fee-sub"]}>
                                                <div className={engagementStyles["tooltip-wrapper"]}>
                                                    {data?.fee}
                                                    <div className={engagementStyles["tooltip-content"]}>
                                                        Exch. Rate - {data?.exchRateFee}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* USD */}
                                            <td className={engagementStyles["td-fee-sub"]}>
                                                <div className={engagementStyles["tooltip-wrapper"]}>
                                                    {data?.usd}
                                                    <div className={engagementStyles["tooltip-content"]}>
                                                        Exch. Rate - {data?.exchRateUsd}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* INR - with tooltip */}
                                            <td className={engagementStyles["td-fee-sub"]}>
                                                <div className={engagementStyles["tooltip-wrapper"]}>
                                                    {data?.inr}
                                                    <div className={engagementStyles["tooltip-content"]}>
                                                        Exch. Rate - {data?.exchRateInr}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* INVOICE NO. */}
                                            <td>{data?.invoiceNo}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ===== Pagination Footer ===== */}
                <div className={engagementStyles["table-pagination-footer"]}>
                    <div className={engagementStyles["pagination"]}>
                        <div className={engagementStyles["pagination-right"]}>
                            <div className={engagementStyles["per-page-container"]}>
                                <span>Rows per page:</span>
                                <div className={engagementStyles["select-wrapper"]}>
                                    <select
                                        className={engagementStyles["rows-select"]}
                                        value={pageSize}
                                        onChange={(e) => {
                                            setPageSize(Number(e.target.value));
                                            setPageIndex(1);
                                        }}
                                    >
                                        {pageSizeOptions.map((size) => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <span className={engagementStyles["pagination-info"]}>
                                {`1-${dummyData.length} of ${dummyData.length}`}
                            </span>
                            <div className={engagementStyles["pagination-buttons"]}>
                                <PaginationComponent
                                    currentPage={pageIndex}
                                    totalRecords={dummyData.length}
                                    pageSize={pageSize}
                                    onPageChange={(p) => setPageIndex(p)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </main>
    );
}

export default NewEngagementList;
