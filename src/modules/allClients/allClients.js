import React, {
	useState,
	useEffect,
	Suspense,
	useCallback,
    useMemo,
} from 'react';
import { Dropdown, Menu, Table, Modal,Select, AutoComplete,message, Tooltip } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
	InputType,
} from 'constants/application';
import UTSRoutes from 'constants/routes';
import { IoChevronDownOutline } from 'react-icons/io5';
import _debounce from 'lodash/debounce';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import WithLoader from 'shared/components/loader/loader';
import clienthappinessSurveyStyles from '../survey/client_happiness_survey.module.css';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { allClientRequestDAO} from 'core/allClients/allClientsDAO';
import { HTTPStatusCode } from 'constants/network';
import { allClientsConfig } from 'modules/hiring request/screens/allClients/allClients.config';
import { downloadToExcel } from 'modules/report/reportUtils';
import EditAMModal from './components/allClients/editAMModal/editAMModal';
import { GSpaceEmails } from 'constants/network';
import { HttpStatusCode } from 'axios';
import LogoLoader from 'shared/components/loader/logoLoader';
import PreviewClientModal from 'modules/client/components/previewClientDetails/previewClientModal';

const AllClientFiltersLazy = React.lazy(() =>
	import('modules/allClients/components/allClients/allClientsFilter'),
);
function AllClients() {
    const navigate = useNavigate();
    const {
		register,
		setValue,
		control,
		watch,		
		formState: { errors },
	} = useForm();   

    const pageSizeOptions = [100, 200, 300, 500, 1000,5000];
    const [tableFilteredState, setTableFilteredState] = useState({       
        pagenumber:1,
        totalrecord:100,
        filterFields_Client:{
            companyStatus: "",
            geo: "",
            addingSource: "",
            category: "",
            poc: "",
            fromDate: "",
            toDate: "",
            searchText: "",
            SearchSourceCategory:""
        }
	});
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(100);    
	const [pageIndex, setPageIndex] = useState(1);
	const [isLoading, setLoading] = useState(false);

    /*--------- React DatePicker ---------------- */
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
    const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [SearchSourceCategory, setSearchSourceCategory] = useState('');
    const [debouncedSearchSourceCategory, setDebouncedSearchSourceCategory] = useState(SearchSourceCategory);

    const [filteredTagLength, setFilteredTagLength] = useState(0);
    const [filtersList, setFiltersList] = useState([]);
    const [getHTMLFilter, setHTMLFilter] = useState(false);
    const [isAllowFilters, setIsAllowFilters] = useState(false);
    const [appliedFilter, setAppliedFilters] = useState(new Map());
    const [checkedState, setCheckedState] = useState(new Map());
    const [allClientsList,setAllClientList] = useState([]);
    const [editAM,setEditAM]= useState(false)
    const [amToFetch,setAMToFetch] = useState({})
    const[isShowAddClientCredit,setIsShowAddClientCredit] =  useState(false); 
    const [messageAPI, contextHolder] = message.useMessage();
    const [isPreviewModal,setIsPreviewModal] = useState(false);
    const [getcompanyID,setcompanyID] = useState();

	const getFilterRequest = useCallback(async () => {
        setLoading(true);
		// const response = await hiringRequestDAO.getAllFilterDataForHRRequestDAO();
        const  response = await allClientRequestDAO.getClientFilterDAO();

		if (response?.statusCode === HTTPStatusCode.OK) {
			setFiltersList(response && response?.responseBody?.Data);
            setLoading(false)
		} else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            setLoading(false)
			return navigate(UTSRoutes.LOGINROUTE);
		} else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
            setLoading(false)
			return navigate(UTSRoutes.SOMETHINGWENTWRONG);
		} else {
            setLoading(false)
			return 'NO DATA FOUND';
		}
	}, [navigate]);

	useEffect(()=>{
		getFilterRequest();
	},[getFilterRequest])

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('clientEmail');
    const authToken = urlParams.get('Token');
    const name = urlParams.get('SpaceName');
    const spaceName = urlParams.get('clientName')

const updateSpaceIDForClientFun = async () =>{
    setLoading(true);
    let payload = {
        "clientEmail": email,
        "SpaceID": name,
        "TokenObject": authToken
    }
    await allClientRequestDAO.updateSpaceIDForClientDAO(payload)
    if(email && authToken && name){
       setDebouncedSearch(email);
       setTimeout(()=>{
        setTableFilteredState(prevState => ({
        ...prevState,
        pagenumber:1,
        filterFields_Client: {
        ...prevState.filterFields_Client,
        searchText: email,
        }
        }));  
    },2000)
        messageAPI.open(
            {
                type: 'success',
                content: `G-Space created sucsssfully for ${spaceName}`,
            },
            1000,
        )
   }
   setLoading(false);
}

    useEffect(() => {
        updateSpaceIDForClientFun()
    }, []);
    
    useEffect(() => {
        getAllClientsList(tableFilteredState);
    },[tableFilteredState]);

    const reloadClientList = ()=>{
        getAllClientsList(tableFilteredState);
    }

    const modifyResponseData = (data) => {
    return data.map((item) => ({...item,
        addedDate:item.addedDate.split(' ')[0],
    }))
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
            localStorage.setItem("isShowAddClientCredit",response?.responseBody?.ShowAddClient)
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
        if(e.target.value.length >= 2 || e.target.value === ''){
            setTimeout(()=>{
                setTableFilteredState(prevState => ({
                ...prevState,
                pagenumber:1,
                filterFields_Client: {
                ...prevState.filterFields_Client,
                searchText: e.target.value,
                }
                }));  
            },2000)         
        }           
        setDebouncedSearch(e.target.value)
        setPageIndex(1); 
    };

    const debouncedSearchSourceCategoryHandler = (e) => {
        if(e.target.value.length > 3 || e.target.value === ''){
            setTimeout(()=>{
                setTableFilteredState(prevState => ({
                ...prevState,
                pagenumber:1,
                filterFields_Client: {
                ...prevState.filterFields_Client,
                SearchSourceCategory:e.target.value,
                }
                }));  
            },2000)         
        }           
        setDebouncedSearchSourceCategory(e.target.value)
        setPageIndex(1); 
    };
  
	const clearFilters = useCallback(() => {
		setAppliedFilters(new Map());
		setCheckedState(new Map());
		setFilteredTagLength(0);
        setPageSize(100);
        setPageIndex(1);
        setDebouncedSearch(search);
        setDebouncedSearchSourceCategory(SearchSourceCategory)
		setTableFilteredState({       
            pagenumber:1,
            totalrecord:100,
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

    const onRemoveSurveyFilters = () => {
		setIsAllowFilters(false);
	};

    const toggleSurveyFilter = useCallback(() => {		
        !getHTMLFilter
            ? setIsAllowFilters(true)
            : setTimeout(() => {
                    setIsAllowFilters(true);
            }, 300);
        setHTMLFilter(!getHTMLFilter);
    }, [getHTMLFilter]);

    const editAMHandler = (data)=>{
        setEditAM(true)
        setAMToFetch(data)
    }

    let LoggedInUserTypeID = JSON.parse(localStorage.getItem('userSessionInfo'))
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

    const allClientsColumnsMemo = useMemo(
		() => allClientsConfig.tableConfig(editAMHandler,isShowAddClientCredit,createGspaceAPI,LoggedInUserTypeID,setIsPreviewModal,setcompanyID),
		[isShowAddClientCredit],
	); 

    const handleExport = async () => {          
        let DataToExport =  allClientsList.map(data => {
            let obj = {}
            allClientsColumnsMemo.map(val => val.title !== ' ' && (obj[`${val.title}`] = data[`${val.key}`]))
            return obj;
        })
    	downloadToExcel(DataToExport,"AllClient");
    }
    return(
        <>
        <div className={clienthappinessSurveyStyles.hiringRequestContainer}>
                {/* <WithLoader className="pageMainLoader" showLoader={debouncedSearch?.length?false:isLoading}> */}
        {contextHolder}
                <div className={clienthappinessSurveyStyles.addnewHR}>
                    <div className={clienthappinessSurveyStyles.hiringRequest}>All Company Clients</div>
                    <LogoLoader visible={isLoading} />
                    <div className={clienthappinessSurveyStyles.btn_wrap}>
                        {/* <button className={clienthappinessSurveyStyles.btnwhite} onClick={()=>setIsPreviewModal(true)}>Preview Company Details</button> */}
                       {isShowAddClientCredit && <Tooltip title="Invite Client"  placement="bottom">
                        <button className={clienthappinessSurveyStyles.btnwhite}
                        // onClick={() => navigate(UTSRoutes.ABOUT_CLIENT)}
                        onClick={() => navigate(`/addNewCompany/0`)}
                        >Add Company</button>
                       </Tooltip> }
                        <button className={clienthappinessSurveyStyles.btnwhite} onClick={() => handleExport()}>Export</button>
                    </div>
                </div>

                <div className={clienthappinessSurveyStyles.filterContainer}>
                        <div className={clienthappinessSurveyStyles.filterSets}>
                            <div className={clienthappinessSurveyStyles.filterSetsInner} >
                                <div className={clienthappinessSurveyStyles.addFilter} onClick={toggleSurveyFilter}>
                                    <FunnelSVG style={{ width: '16px', height: '16px' }} />

                                    <div className={clienthappinessSurveyStyles.filterLabel}>Add Filters</div>
                                    <div className={clienthappinessSurveyStyles.filterCount}>{filteredTagLength}</div>                            
                                </div>
                                <p onClick={()=> clearFilters() }>Reset Filters</p>                        
                            </div>                        
                            <div className={clienthappinessSurveyStyles.filterRight}>
                            <div className={clienthappinessSurveyStyles.searchFilterSet}>
                                    <SearchSVG style={{ width: '16px', height: '16px' }} />
                                    <input
                                        type={InputType.TEXT}
                                        className={clienthappinessSurveyStyles.searchInput}
                                        placeholder="Search Source Category"
                                        onChange={debouncedSearchSourceCategoryHandler}
                                        value={debouncedSearchSourceCategory}
                                    />
                                </div>
                                <div className={clienthappinessSurveyStyles.searchFilterSet}>
                                    <SearchSVG style={{ width: '16px', height: '16px' }} />
                                    <input
                                        type={InputType.TEXT}
                                        className={clienthappinessSurveyStyles.searchInput}
                                        placeholder="Search Table"
                                        onChange={debouncedSearchHandler}
                                        value={debouncedSearch}
                                    />
                                </div>
                            
                                <div className={clienthappinessSurveyStyles.calendarFilterSet}>
                                    <div className={clienthappinessSurveyStyles.label}>Date</div>
                                    <div className={clienthappinessSurveyStyles.calendarFilter}>
                                        <CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
                                        <DatePicker
                                            style={{ backgroundColor: 'red' }}
                                            onKeyDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            className={clienthappinessSurveyStyles.dateFilter}
                                            placeholderText="Start date - End date"
                                            selected={startDate}
                                            onChange={onCalenderFilter}
                                            dateFormat='dd/MM/yyyy'
                                            startDate={startDate}
                                            endDate={endDate}
                                            selectsRange
                                        />
                                    </div>
                                </div>
                                
                                <div className={clienthappinessSurveyStyles.priorityFilterSet}>
                                    <div className={clienthappinessSurveyStyles.label}>Showing</div>
                                    <div className={clienthappinessSurveyStyles.paginationFilter}>
                                        <Dropdown
                                            trigger={['click']}
                                            placement="bottom"
                                            overlay={
                                                <Menu onClick={(e) => {
                                                    setPageSize(parseInt(e.key));                                           
                                                    if (pageSize !== parseInt(e.key)) {
                                                        setTableFilteredState(prevState => ({
                                                            ...prevState,
                                                            totalrecord: parseInt(e.key),
                                                            pagenumber: pageIndex,
                                                        }));                                             
                                                    }
                                                }}>
                                                    {pageSizeOptions.map((item) => {
                                                        return <Menu.Item key={item}>{item}</Menu.Item>;
                                                    })}
                                                </Menu>
                                            }>
                                            <span>
                                                {pageSize}
                                                <IoChevronDownOutline
                                                    style={{ paddingTop: '5px', fontSize: '16px' }}
                                                />
                                            </span>									
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>

                        </div>
                </div>    

                <div className={clienthappinessSurveyStyles.tableDetails}>
                                {isLoading ? (
                                    <TableSkeleton />
                                ) : (
                                    <WithLoader className="mainLoader">
                                        <Table 
                                        scroll={{  y: '100vh' }} 
                                        dataSource={allClientsList} 
                                        columns={allClientsColumnsMemo}
                                        pagination={
                                            search && search?.length === 0
                                                ? null
                                                : {
                                                        onChange: (pageNum, pageSize) => {
                                                            setPageIndex(pageNum);
                                                            setPageSize(pageSize);
                                                            setTableFilteredState(prevState => ({
                                                                ...prevState,                                                        
                                                                pagenumber: pageNum,
                                                              }));
                                                        },
                                                        size: 'small',
                                                        pageSize: pageSize,
                                                        pageSizeOptions: pageSizeOptions,
                                                        total: totalRecords,
                                                        showTotal: (total, range) =>
                                                            `${range[0]}-${range[1]} of ${totalRecords} items`,
                                                        defaultCurrent: pageIndex,
                                                  }
                                        }       
                                        
                                        />
                                    </WithLoader>
                            )} 
                </div>

            {/* </WithLoader> */}
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

            <PreviewClientModal setIsPreviewModal={setIsPreviewModal} isPreviewModal={isPreviewModal} setcompanyID={setcompanyID} getcompanyID={getcompanyID} />
            </>
    )
}





export default AllClients;