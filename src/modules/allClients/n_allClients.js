import React, {
    useState,
    useEffect,
    Suspense,
    useMemo,
    useCallback,
} from "react";
import stylesOBj from './n_all_clients_company.module.css';
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { hrUtils } from "modules/hiring request/hrUtils";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes, { NewPagesRouts } from "constants/routes";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { useNavigate, Link } from "react-router-dom";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { downloadToExcel } from "modules/report/reportUtils";

import { GSpaceEmails } from 'constants/network';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import { allClientRequestDAO } from 'core/allClients/allClientsDAO';
import { Modal, Tooltip,Switch } from "antd";


import { allClientsConfig } from 'modules/hiring request/screens/allClients/allClients.config';



import { ReactComponent as PencilSVG } from 'assets/svg/pencil.svg';

import eyeIcon from 'assets/svg/eye.svg'
import PreviewClientModal from "modules/client/components/previewClientDetails/previewClientModal";
import EditAMModal from "./components/allClients/editAMModal/editAMModal";


const AllClientFiltersLazy = React.lazy(() =>
    import('modules/allClients/components/allClients/allClientsFilter'),
);

const columnsShowAddEdit = [
    { title: 'SSO Login', dataIndex: 'ssO_Login' },
    { title: '', dataIndex: 'Edit' },
    { title: 'Added Date', dataIndex: 'addedDate' },
    { title: 'Company', dataIndex: 'companyName' },
    { title: 'Company Type', dataIndex: 'companyModel' },
    { title: 'Engagement Type ( % )', dataIndex: 'engagementType' },
    { title: 'Client', dataIndex: 'clientName' },
    { title: 'Client Email', dataIndex: 'clientEmail' },
    { title: 'AM', dataIndex: 'aM_UserName' },
    { title: 'NBD', dataIndex: 'poc' },
    { title: 'Access Type', dataIndex: 'accessType' },
    { title: 'Source (Category)', dataIndex: 'inputSource' },
    { title: 'Invited By', dataIndex: 'inviteName' },
    { title: 'Invited Date', dataIndex: 'inviteDate' },
    { title: 'Is Active', dataIndex: 'isActive' },
    { title: 'Email Notification', dataIndex: 'isClientNotificationSend' }
];

const columnsUSERTYPEID2 = [
    { title: 'Create G-Space', dataIndex: 'create_gspace' },
    { title: '', dataIndex: 'Edit' },
    { title: '', dataIndex: 'PreviewPage' },
    { title: 'Added Date', dataIndex: 'addedDate' },
    { title: 'Company', dataIndex: 'companyName' },
    { title: 'Company Type', dataIndex: 'companyModel' },
    // { title: 'Credit Utilization', dataIndex: 'creditUtilization' },
    { title: 'Client', dataIndex: 'clientName' },
    { title: 'Client Email', dataIndex: 'clientEmail' },
    { title: 'Access Type', dataIndex: 'accessType' },
    { title: 'NBD', dataIndex: 'poc' },
    { title: 'AM', dataIndex: 'aM_UserName' },
    { title: 'Source (Category)', dataIndex: 'inputSource' },
    // { title: 'Status', dataIndex: 'status' },
    { title: 'Invited By', dataIndex: 'inviteName' },
    { title: 'Invited Date', dataIndex: 'inviteDate' },
    { title: 'Is Active', dataIndex: 'isActive' },
    { title: 'Email Notification', dataIndex: 'isClientNotificationSend' }
];

const columnsMeta = [
    { title: '', dataIndex: 'Edit' },
    { title: '', dataIndex: 'PreviewPage' },
    { title: 'Added Date', dataIndex: 'addedDate' },
    { title: 'Company', dataIndex: 'companyName' },
    { title: 'Company Type', dataIndex: 'companyModel' },
    //   { title: 'Credit Utilization', dataIndex: 'creditUtilization' },
    { title: 'Client', dataIndex: 'clientName' },
    { title: 'Client Email', dataIndex: 'clientEmail' },
    { title: 'Access Type', dataIndex: 'accessType' },
    { title: 'NBD', dataIndex: 'poc' },
    { title: 'AM', dataIndex: 'aM_UserName' },
    { title: 'Source (Category)', dataIndex: 'inputSource' },
    //   { title: 'Status', dataIndex: 'status' },
    { title: 'Invited By', dataIndex: 'inviteName' },
    { title: 'Invited Date', dataIndex: 'inviteDate' },
    { title: 'Is Active', dataIndex: 'isActive' },
    { title: 'Email Notification', dataIndex: 'isClientNotificationSend' }
];


const TableRowComponent = ({ data, index, TableColumnsData, isShowAddClientCredit, setIsPreviewModal, setcompanyID ,editAMHandler,updateEmailNotification ,createGspaceAPI,LoggedInUserTypeID}) => {
   
    return TableColumnsData?.map(col => { 
        let colIndVal = col.dataIndex
        if (colIndVal === 'ssO_Login') {
            let url = data[colIndVal] + `&isInternal=${true}`
            return <td>
                {data?.isActive === "yes" && data?.companyID !== 0 && data?.clientID !== 0 &&
                    <a
                        href={url}
                        target="_blank"
                        className={stylesOBj.linkForSSO}
                    >
                        <button className={stylesOBj.btnPrimaryResendBtn}>Login with SSO</button>
                    </a>}
            </td>
        }

        if (colIndVal === 'Edit') {
            
            if(isShowAddClientCredit === true){
                return <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {isShowAddClientCredit === true && data?.companyID !== 0 && data?.clientID !== 0 && <Link
                        target="_blank"
                        to={`/addNewCompany/${data.companyID}`}
                        style={{ color: 'black', textDecoration: 'underline', display: 'inline-flex' }}
                        onClick={() => localStorage.setItem("clientID", data?.clientID)}>
                        <PencilSVG />
                    </Link>}
                    {(data.companyID !== 0 || data.clientID !== 0) && <div style={{ marginLeft: 'auto', cursor: 'pointer', marginLeft: '10px', minWidth: '22px' }}>
                        <Tooltip title="Preview Company Profile" placement="right" >
                            {/* <a href={`/viewCompanyDetails/${data.companyID}`} target="_blank">
                                    <img src={eyeIcon} alt='info' width="22" height="22"  />	
                                    {/* <EyeIcon /> 
                                    </a>         */}
                            <img src={eyeIcon} alt='info' style={{ cursor: 'pointer' }} width="22" height="22" onClick={() => { localStorage.setItem("clientID", data?.clientID); setIsPreviewModal(true); setcompanyID(data?.companyID) }} />

                        </Tooltip>
                    </div>}
                </div>
            </td>
            }

            return <td>
                    {isShowAddClientCredit=== true && data?.companyID !==0 && data?.clientID!==0 &&<Link
                            to={`/editclient/${data.companyID}`}
                            style={{ color: 'black', textDecoration: 'underline' }}
                            onClick={()=>localStorage.setItem("clientID",data?.clientID)}>
                            <PencilSVG />
                        </Link>}
                </td>

            
        }

        if(colIndVal === 'PreviewPage'){
            return <td>
                { isShowAddClientCredit=== true && data?.companyID !==0 && data?.clientID!==0 &&<div
                            // to={`/editclient/${data.companyID}`}
                            style={{ color: 'black', textDecoration: 'underline',cursor:"pointer" }}
                            onClick={()=>{localStorage.setItem("clientID",data?.clientID);setIsPreviewModal(true)}}>
                            <PencilSVG />
                        </div>}
            </td>
        }

        if (colIndVal === 'companyName') {
            return <td>
                {(data.companyID === 0 || data.clientID === 0) ? data[colIndVal] :
                    <div style={{ display: 'flex', alignItems: 'center' }}> <Link
                        to={`/viewCompanyDetails/${data.companyID}`}
                        // to={`/viewClient/${result.companyID}/${result.clientID}`}
                        target="_blank"
                        style={{
                            color: `var(--uplers-black)`,
                            textDecoration: 'underline',
                        }}>
                        {data[colIndVal]}
                    </Link>
                    </div>
                }

            </td>
        }

        if(colIndVal === 'engagementType'){
           return <td>
            {`${data[colIndVal] ?? ''}   ${data.engPercent ? `( ${data.engPercent} % )` : ''} `}
           </td> 
        }

        if(colIndVal === 'aM_UserName'){
             let amData = {clientID: data?.clientID, companyID: data?.companyID }
                        return <td>{data[colIndVal] ? <div className={stylesOBj.AMNAME}  onClick={()=>editAMHandler(amData)}>{data[colIndVal]}</div> : null}</td> 
        }

        if(colIndVal === 'isClientNotificationSend'){
              return <td><Switch defaultChecked={!data[col.dataIndex]} disabled={data.companyModel !== "Pay Per Hire"} checkedChildren="ON" unCheckedChildren="OFF" onChange={val=>updateEmailNotification(data.clientID,data.companyID,!val)}/></td> 
        }

        if(colIndVal === 'create_gspace'){
              if(data?.isGSpaceCreated === false){
                            return (                                    
                                <button  className={stylesOBj.btnPrimaryResendBtn} onClick={()=>createGspaceAPI(data?.companyName,data?.clientEmail)}>Create G-Space</button>
                            );
                        }else{
                            return <span 
                             style={{color:"green",fontSize:"11px",fontWeight:"500"}} >G-Space Created</span>
                        }
        }



        return <td>{data[col.dataIndex]}</td>

    })
}

export default function New_all_clients_company() {
    const navigate = useNavigate()
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [pageIndex, setPageIndex] = useState(1);
    const pageSizeOptions = [20, 100, 200, 300, 500, 1000, 5000];
    const [tableFilteredState, setTableFilteredState] = useState({
        pagenumber: 1,
        totalrecord: 20,
        filterFields_Client: {
            companyStatus: "",
            geo: "",
            addingSource: "",
            category: "",
            poc: "",
            fromDate: "",
            toDate: "",
            searchText: "",
            SearchSourceCategory: "",
            amIds: ''
        }
    });

    const [allClientsList, setAllClientList] = useState([]);

    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [debouncedSearchSourceCategory, setDebouncedSearchSourceCategory] = useState('');
    const [isShowAddClientCredit, setIsShowAddClientCredit] = useState(false);
    const [isPreviewModal, setIsPreviewModal] = useState(false);
    const [getcompanyID, setcompanyID] = useState();

    const [filteredTagLength, setFilteredTagLength] = useState(0);
    const [filtersList, setFiltersList] = useState([]);
    const [getHTMLFilter, setHTMLFilter] = useState(false);
    const [isAllowFilters, setIsAllowFilters] = useState(false);
    const [appliedFilter, setAppliedFilters] = useState(new Map());
    const [checkedState, setCheckedState] = useState(new Map());

     const [editAM,setEditAM]= useState(false)
        const [amToFetch,setAMToFetch] = useState({})

    const [userData, setUserData] = useState({});
    useEffect(() => {
        const getUserResult = async () => {
            let userData = UserSessionManagementController.getUserSession();
            if (userData) setUserData(userData);
        };
        getUserResult();
    }, []);


    const TableColumnsData = isShowAddClientCredit === true ? columnsShowAddEdit : userData?.LoggedInUserTypeID == 2 ? columnsUSERTYPEID2 : columnsMeta

    const getFilterRequest = useCallback(async () => {
            // setLoading(true);
            // const response = await hiringRequestDAO.getAllFilterDataForHRRequestDAO();
            const  response = await allClientRequestDAO.getClientFilterDAO();
    
            if (response?.statusCode === HTTPStatusCode.OK) {
                setFiltersList(response && response?.responseBody?.Data);
                // setLoading(false)
            } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
                // setLoading(false)
                return navigate(UTSRoutes.LOGINROUTE);
            } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
                // setLoading(false)
                return navigate(UTSRoutes.SOMETHINGWENTWRONG);
            } else {
                // setLoading(false)
                return 'NO DATA FOUND';
            }
        }, [navigate]);
    
        useEffect(()=>{
            getFilterRequest();
        },[getFilterRequest])

    const modifyResponseData = (data) => {
        return data.map((item) => ({
            ...item,
            addedDate: item.addedDate.split(' ')[0],
        }))
    }

    
    function getPageNumbers(currentPage, totalPages) {
        const pages = [];

        if (totalPages <= 6) {
            // show all pages
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first and last
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


      function Pagination({
            currentPage,
            totalRecords,
            pageSize,
            onPageChange,
        }) {
            const totalPages = Math.ceil(totalRecords / pageSize);
    
            const pages = getPageNumbers(currentPage, totalPages);
    
            return (
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    {/* Prev */}
    
                    <button className={`${stylesOBj["pagination-btn"]}`} disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
                        <img src="images/arrow-left-ic.svg" alt="Previous" title="Previous Page" />
                    </button>
    
                    {/* Page Buttons */}
                    {pages.map((p, i) =>
                        p === "..." ? (
                            <span key={i}>...</span>
                        ) : (
                            <button
                                key={i}
                                onClick={() => onPageChange(p)}
                                style={{
                                    background: p === currentPage ? "gold" : "white",
                                    border: "1px solid #ccc",
                                    padding: "4px 8px",
                                    cursor: "pointer",
                                }}
                            >
                                {p}
                            </button>
                        )
                    )}
    
                    {/* Next */}
                    <button className={`${stylesOBj["pagination-btn"]}`} disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}>
                        <img src="images/arrow-right-ic.svg" alt="Next" title="Next Page" />
                    </button>
                </div>
            );
        }
  
     const toggleSurveyFilter = useCallback(() => {		
            !getHTMLFilter
                ? setIsAllowFilters(true)
                : setTimeout(() => {
                        setIsAllowFilters(true);
                }, 300);
            setHTMLFilter(!getHTMLFilter);
        }, [getHTMLFilter]);
    
   

    const reloadClientList = ()=>{
        const startDate_parts = new Date(startDate).toLocaleDateString('en-US').split('/'); 
        const sDate = `${startDate_parts[2]}-${startDate_parts[0].padStart(2, '0')}-${startDate_parts[1].padStart(2, '0')}`;
        const endDate_parts = new Date(endDate).toLocaleDateString('en-US').split('/'); 
        const eDate = `${endDate_parts[2]}-${endDate_parts[0].padStart(2, '0')}-${endDate_parts[1].padStart(2, '0')}`;
        let payload = { ...tableFilteredState,
            "filterFields_Client":{
                ...tableFilteredState.filterFields_Client,
                    fromDate: startDate ? sDate : '',
                    toDate:endDate ? eDate : '',
                    SearchSourceCategory:debouncedSearchSourceCategory,
                    searchText:debouncedSearch
            }
        

        }
        getAllClientsList(payload);
    }

    const getAllClientsList = useCallback(async (requestData) => {
        setLoading(true);
        let response = await allClientRequestDAO.getAllClientsListDAO(requestData);
        if (response?.statusCode === HTTPStatusCode.OK) {
            // if(isExport){
            //     setLoading(false); 
            //     let _data = modifyResponseData(response?.responseBody?.rows);
            //     downloadToExcel(_data);
            //     return 
            // }
            setAllClientList(modifyResponseData(response?.responseBody?.Data?.rows));
            setIsShowAddClientCredit(response?.responseBody?.ShowAddClient);
            setTotalRecords(response?.responseBody?.Data?.totalrows);
            localStorage.setItem("isShowAddClientCredit", response?.responseBody?.ShowAddClient)
            setLoading(false);
        } else if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
            setLoading(false);
            setTotalRecords(0);
            setAllClientList([]);
        } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            setLoading(false);
            return navigate(UTSRoutes.LOGINROUTE);
        } else if (
            response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
            setLoading(false);
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            setLoading(false);
            setAllClientList([]);
            return 'NO DATA FOUND';
        }
    }, [navigate]);

    useEffect(() => {
        const startDate_parts = new Date(startDate).toLocaleDateString('en-US').split('/');
        const sDate = `${startDate_parts[2]}-${startDate_parts[0].padStart(2, '0')}-${startDate_parts[1].padStart(2, '0')}`;
        const endDate_parts = new Date(endDate).toLocaleDateString('en-US').split('/');
        const eDate = `${endDate_parts[2]}-${endDate_parts[0].padStart(2, '0')}-${endDate_parts[1].padStart(2, '0')}`;
        let payload = {
            ...tableFilteredState,
            "filterFields_Client": {
                ...tableFilteredState.filterFields_Client,
                fromDate: startDate ? sDate : '',
                toDate: endDate ? eDate : '',
                SearchSourceCategory: debouncedSearchSourceCategory,
                searchText: debouncedSearch
            }


        }
        getAllClientsList(payload);
    }, [tableFilteredState]);

    const onCalenderFilter = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if (start && end) {
            const startDate_parts = new Date(start).toLocaleDateString('en-US').split('/');
            const sDate = `${startDate_parts[2]}-${startDate_parts[0].padStart(2, '0')}-${startDate_parts[1].padStart(2, '0')}`;
            const endDate_parts = new Date(end).toLocaleDateString('en-US').split('/');
            const eDate = `${endDate_parts[2]}-${endDate_parts[0].padStart(2, '0')}-${endDate_parts[1].padStart(2, '0')}`;
            setTableFilteredState(prevState => ({
                ...prevState,
                filterFields_Client: {
                    ...prevState.filterFields_Client,
                    fromDate: sDate,
                    toDate: eDate,
                }
            }));
        }
    };

    const debouncedSearchHandler = (e) => {
        if (e.target.value.length >= 2 || e.target.value === '') {
            setTimeout(() => {
                setTableFilteredState(prevState => ({
                    ...prevState,
                    pagenumber: 1,
                    filterFields_Client: {
                        ...prevState.filterFields_Client,
                        searchText: e.target.value,
                    }
                }));
            }, 2000)
        }
        setDebouncedSearch(e.target.value)
        setPageIndex(1);
    };

    const debouncedSearchSourceCategoryHandler = (e) => {
        if (e.target.value.length > 3 || e.target.value === '') {
            setTimeout(() => {
                setTableFilteredState(prevState => ({
                    ...prevState,
                    pagenumber: 1,
                    filterFields_Client: {
                        ...prevState.filterFields_Client,
                        SearchSourceCategory: e.target.value,
                    }
                }));
            }, 2000)
        }
        setDebouncedSearchSourceCategory(e.target.value)
        setPageIndex(1);
    };

    const updateEmailNotification = async (clientID,companyId,val)=>{
            let payload = {
                contactId:clientID,
                companyId: companyId,
                val
            }
            setLoading(true);
            const result = await allClientRequestDAO.UpdateEmailNotificationStateDAO(payload)
            setLoading(false);    
            if(result.statusCode === HTTPStatusCode.OK){
                let newArr = [...allClientsList]
                    let ind = newArr.findIndex(item => (item.clientID === clientID && item.companyID === companyId))
                    newArr[ind] = {...newArr[ind],isClientNotificationSend : val}   
                    setAllClientList(newArr)
            }
        }

            const clearFilters = useCallback(() => {
                setAppliedFilters(new Map());
                setCheckedState(new Map());
                setFilteredTagLength(0);
                setPageSize(20);
                setPageIndex(1);
                setDebouncedSearch('');
                setDebouncedSearchSourceCategory('')
                setTableFilteredState({       
                    pagenumber:1,
                    totalrecord:20,
                    filterFields_Client:{
                        RatingFrom :0,
                        RatingTo :10,
                    }
                });
                // const reqFilter = {
                // 	tableFilteredState:{...tableFilteredState,...{
                // 		pagesize: 100,
                // 		pagenum: 1,
                // 		sortdatafield: 'CreatedDateTime',
                // 		sortorder: 'desc',
                // 		searchText: '',
                // 	}},
                // 	filterFields_ViewAllHRs: {},
                // };
                // handleHRRequest(reqFilter);
                setIsAllowFilters(false);
                setEndDate(null)
                setStartDate(null)
                // setDebouncedSearch('')
                // setIsFocusedRole(false)
                // setPageIndex(1);
                // setPageSize(100);
            }, [
                // handleHRRequest,
                // setAppliedFilters,
                // setCheckedState,
                // setFilteredTagLength,
                // setIsAllowFilters,
                // setTableFilteredState,
                // tableFilteredState,
            ]);

     const editAMHandler = (data)=>{
        setEditAM(true)
        setAMToFetch(data)
    }

     const handleExport = async () => {          
            let DataToExport =  allClientsList.map(data => {
                let obj = {}
                TableColumnsData.map(val => val.title !== ' ' && (obj[`${val.title}`] = data[`${val.dataIndex}`]))
                return obj;
            })
            downloadToExcel(DataToExport,"AllClient");
        }

        
    const onRemoveSurveyFilters = () => {
		setIsAllowFilters(false);
	};

     const createGspaceAPI = async (clientName,clientEmail) =>{
                const getEmails = await allClientRequestDAO.getSalesUserWithHeadDAO(clientEmail);
                const checkEmail = /^[a-zA-Z0-9._%+-]+@(uplers\.in|uplers\.com)$/i;
                var emailString = GSpaceEmails.EMAILS.split(',');
                if(getEmails?.statusCode === HTTPStatusCode.OK){
                    getEmails?.responseBody?.forEach((emails)=>{
                        if(emails?.salesUserEmail && checkEmail.test(emails?.salesUserEmail)){
                            emailString.push(emails?.salesUserEmail);
                        }
                        if(emails?.salesUserHeadEmail && checkEmail.test(emails?.salesUserHeadEmail)){
                            emailString.push(emails?.salesUserHeadEmail);
                        }
                    })
                }
                var updatedEmailString = emailString.join(',');  
                const response = await allClientRequestDAO.createGspaceDAO(`${clientName}-UTS`,updatedEmailString,clientEmail)
                window.open(response?.responseBody?.authUrl, '_blank');
            }


    return <div className={`${stylesOBj["dashboard-container"]}`}>
        {/* <!-- Main Content Area --> */}
        <main className={`${stylesOBj["main-content"]}`}>
            <div className={`${stylesOBj["content-wrapper"]}`}>



                {/* <!-- Filter Controls --> */}
                <div className={`${stylesOBj["filter-controls"]}`}>
                    {/* <div className={`${stylesOBj["filter-group"]}`}>
                                            <input type="text" className={`${stylesOBj["filter-input"]} ${stylesOBj['date-input']}`} placeholder="Select Date Range" />
                                            <img src="images/calendar-ic.svg" alt="Calendar Icon" className={`${stylesOBj["input-icon"]}`} />
                                        </div> */}

                    <div className={`${stylesOBj.calendarFilter}`} >
                        <DatePicker
                            style={{ backgroundColor: "red" }}
                            onKeyDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className={stylesOBj.dateFilter}
                            placeholderText="Select Date Range"
                            selected={startDate}
                            onChange={onCalenderFilter}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                        />
                        <img src="images/calendar-ic.svg" alt="Calendar Icon" className={`${stylesOBj["input-icon"]}`} />

                    </div>

                    {/* {(startDate && endDate) &&  <img src="images/close-hr-ic.svg" alt="Close Icon" onClick={()=>{setStartDate(null);setEndDate(null)}} className={`${stylesOBj["input-icon"]}`} />} */}
                    {/* <div className={`${stylesOBj["filter-group"]} ${stylesOBj['search-group']}`}>
                                            <input type="text" className={`${stylesOBj["filter-input"]} ${stylesOBj['search-input']}`} placeholder="Search Source Category "
                                                 onChange={debouncedSearchSourceCategoryHandler}
                                        value={debouncedSearchSourceCategory}
                                            />
                                            <img src="images/search-ic.svg" alt="Search Icon" className={`${stylesOBj["input-icon"]}`} />
                                        </div> */}
                    <div className={`${stylesOBj["filter-group"]} ${stylesOBj['search-group']}`}>
                        <input type="text" className={`${stylesOBj["filter-input"]} ${stylesOBj['search-input']}`} placeholder="Search Table"
                            onChange={debouncedSearchHandler}
                            value={debouncedSearch}
                        />
                        <img src="images/search-ic.svg" alt="Search Icon" className={`${stylesOBj["input-icon"]}`} />
                    </div>

                    {/* <div style={{ display: 'flex', gap: '10px', width: 'max-content' }}> */}
                    <button className={`${stylesOBj["filter-btn"]}`} onClick={toggleSurveyFilter} >

                        <div style={{ display: 'flex', gap: '10px' }}>

                            <img src="images/filter-ic.svg" alt="Filter Icon" />
                            <span>Add Filters</span>

                        </div>
                        <div style={{ display: 'flex', gap: '10px' }} >
                            <div className={stylesOBj.filterCount}>{filteredTagLength}</div>
                            {(filteredTagLength > 0 || startDate || debouncedSearch) &&<Tooltip title="Reset Filters">
                                <span style={{ color: 'red', fontWeight: 'bold', fontSize: 'Large' }} onClick={e => {
                                    e.stopPropagation();
                                    clearFilters()
                                }}>X</span>
                            </Tooltip>}

                        </div>
                    </button>

                    <div className={`${stylesOBj["filter-group"]} ${stylesOBj['control-btns-group']}`} >
                     {isShowAddClientCredit &&    <button className={`${stylesOBj["btn-add-hr"]} ${stylesOBj["control-btns"]}`} onClick={() => {
navigate(`/addNewCompany/0`)

                        }}>ADD Company</button>}
                        <button className={`${stylesOBj["btn-export"]} ${stylesOBj['control-btns']}`} onClick={() => { handleExport()}}>Export</button>

                    </div>
                </div>

                {/* Data Table */}
                <div className={`${stylesOBj["table-container"]}`}>

                    {isLoading ? <TableSkeleton /> : <table className={`${stylesOBj["data-table"]}`}>
                        <thead>
                            <tr>
                                {TableColumnsData?.map(head => <th>{head?.title}</th>)}

                            </tr>
                        </thead>

                        <tbody>
                            {allClientsList?.length === 0 ? <tr>
                                <td colSpan={12} style={{ textAlign: "center", padding: "20px" }}>
                                    No data available
                                </td>
                            </tr> :
                                <>
                                    {allClientsList.map((data, index) => {
                                        return <tr key={data.key}>

                                            <TableRowComponent data={data} index={index}
                                                TableColumnsData={TableColumnsData}
                                                isShowAddClientCredit={isShowAddClientCredit}
                                                setIsPreviewModal={setIsPreviewModal} setcompanyID={setcompanyID} editAMHandler={editAMHandler} 
                                                updateEmailNotification={updateEmailNotification} createGspaceAPI={createGspaceAPI} LoggedInUserTypeID={userData?.LoggedInUserTypeID}
                                            />

                                        </tr>
                                    })}
                                </>}
                        </tbody>
                    </table>
                    }

                </div>

                {/* <!-- Pagination Footer - Outside table container --> */}
                                    <div className={`${stylesOBj["table-pagination-footer"]}`}>
                                        <div className={`${stylesOBj["pagination"]}`}>
                                            <div className={`${stylesOBj["pagination-right"]}`}>
                                                <div className={`${stylesOBj["per-page-container"]}`}>
                                                    <span>Rows per page:</span>
                                                    <div className={`${stylesOBj["select-wrapper"]}`}>
                                                        <select className={`${stylesOBj["rows-select"]}`} value={pageSize} onChange={(e) => {
                
                                                            setPageSize(Number(e.target.value));
                                                            setPageIndex(1)
                                                            if (pageSize !== parseInt(e.target.value)) {
                                                                setTableFilteredState({
                                                                    ...tableFilteredState,
                                                                    totalrecord: parseInt(e.target.value),
                                                                    pagenumber: 1,
                                                                });
                                                            }
                                                        }}>
                                                            {pageSizeOptions.map((size) => (
                                                                <option key={size} value={size}>{size}</option>
                                                            ))}
                
                                                        </select>
                                                    </div>
                                                </div>
                                                <span className={`${stylesOBj["pagination-info"]}`}>{`${(pageIndex - 1) * pageSize + 1}-${Math.min(pageIndex * pageSize, totalRecords)}`}  of {totalRecords}</span>
                                                <div className={`${stylesOBj["pagination-buttons"]}`}>
                
                                                    <Pagination
                                                        currentPage={pageIndex}
                                                        totalRecords={totalRecords}
                                                        pageSize={pageSize}
                                                        onPageChange={(p) => {
                                                            setPageIndex(p)
                                                             setTableFilteredState({
                                                                    ...tableFilteredState,
                                                                    totalrecord: pageSize,
                                                                    pagenumber: parseInt(p),
                                                                });
                                                        }}
                                                    />
                
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                
                
            </div>

              {isAllowFilters && (
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <AllClientFiltersLazy				
                                            setIsAllowFilters={setIsAllowFilters}						
                                            setFilteredTagLength={setFilteredTagLength}
                                            getHTMLFilter={getHTMLFilter}
                                            filtersType={allClientsConfig.allClientsTypeConfig(filtersList && filtersList)}
                                            clearFilters={clearFilters}
                                            onRemoveSurveyFilters={onRemoveSurveyFilters}
                                            setAppliedFilters={setAppliedFilters}
                                            appliedFilter={appliedFilter}
                                            setPageIndex={setPageIndex}
                                            setCheckedState={setCheckedState}
                                            checkedState={checkedState}
                                            setTableFilteredState={setTableFilteredState}
                                            tableFilteredState={tableFilteredState}                        
                                        />
                                    </Suspense>
                        )}

             {editAM && 
            	<Modal
                transitionName=""
                width="1256px"
                centered
                footer={null}
                open={editAM}
                // onOk={() => setVersantModal(false)}
                onCancel={() => setEditAM(false)}>
               <EditAMModal amToFetch={amToFetch} closeModal={() => setEditAM(false)} reloadClientList={reloadClientList} />
            </Modal>}  


            <PreviewClientModal setIsPreviewModal={setIsPreviewModal} isPreviewModal={isPreviewModal} setcompanyID={setcompanyID} getcompanyID={getcompanyID} filtersList={filtersList} />
        </main>

    </div>
}