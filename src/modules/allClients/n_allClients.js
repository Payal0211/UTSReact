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
import { useNavigate } from "react-router-dom";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { downloadToExcel } from "modules/report/reportUtils";
import {
    InputType,
    UserAccountRole,
} from "constants/application";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { allClientRequestDAO} from 'core/allClients/allClientsDAO';
import { Modal, message, Radio, Skeleton, Spin, Tooltip } from "antd";

import { ReactComponent as ReopenHR } from "assets/svg/reopen.svg";
import RePostHRModal from "modules/hiring request/components/repostHRModal/repostHRModal";
import CloneHR from 'modules/hiring request/screens/allHiringRequest/cloneHRModal';
import { MasterDAO } from "core/master/masterDAO";

import { ReportDAO } from "core/report/reportDAO";
import { useForm } from "react-hook-form";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";

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
  { title: 'Credit Utilization', dataIndex: 'creditUtilization' },
  { title: 'Client', dataIndex: 'clientName' },
  { title: 'Client Email', dataIndex: 'clientEmail' },
  { title: 'Access Type', dataIndex: 'accessType' },
  { title: 'NBD', dataIndex: 'poc' },
  { title: 'AM', dataIndex: 'aM_UserName' },
  { title: 'Source (Category)', dataIndex: 'inputSource' },
  { title: 'Status', dataIndex: 'status' },
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


const TableRowComponent = ({data, index}) =>{
    
}

export default function New_all_clients_company(){
    const navigate = useNavigate()
     const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
        const [isLoading, setLoading] = useState(false);
      const [totalRecords, setTotalRecords] = useState(0);
        const [pageSize, setPageSize] = useState(20);    
        const [pageIndex, setPageIndex] = useState(1);
  const pageSizeOptions = [20,100, 200, 300, 500, 1000,5000];
    const [tableFilteredState, setTableFilteredState] = useState({       
        pagenumber:1,
        totalrecord:20,
        filterFields_Client:{
            companyStatus: "",
            geo: "",
            addingSource: "",
            category: "",
            poc: "",
            fromDate: "",
            toDate: "",
            searchText: "",
            SearchSourceCategory:"",
            amIds:''
        }
    });

 const [allClientsList,setAllClientList] = useState([]);

        const [debouncedSearch, setDebouncedSearch] = useState('');
            const [debouncedSearchSourceCategory, setDebouncedSearchSourceCategory] = useState('');
    const[isShowAddClientCredit,setIsShowAddClientCredit] =  useState(false); 
   const [userData, setUserData] = useState({});
        useEffect(() => {
            const getUserResult = async () => {
                let userData = UserSessionManagementController.getUserSession();
                if (userData) setUserData(userData);
            };
            getUserResult();
        }, []);
    

    const TableColumnsData = isShowAddClientCredit === true ? columnsShowAddEdit : userData?.LoggedInUserTypeID == 2 ? columnsUSERTYPEID2 : columnsMeta

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

        useEffect(() => {
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
        },[tableFilteredState]);

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


    return   <div className={`${stylesOBj["dashboard-container"]}`}>
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
                                            <button className={`${stylesOBj["filter-btn"]}`} onClick={{}} >
                
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    
                                                     <img src="images/filter-ic.svg" alt="Filter Icon" />
                                                    <span>Add Filters</span>
                
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }} >
                                                     <div className={stylesOBj.filterCount}>0</div>
                                                     {<Tooltip title="Reset Filters">
                                                        <span style={{ color: 'red', fontWeight: 'bold', fontSize: 'Large' }} onClick={e=> {
                                                    e.stopPropagation();
                                                    // clearFilters()
                                                }}>X</span>
                                                     </Tooltip> }
                
                                                </div>
                                            </button>        

                                             <div className={`${stylesOBj["filter-group"]} ${stylesOBj['control-btns-group']}`} >
                                            <button className={`${stylesOBj["btn-add-hr"]} ${stylesOBj["control-btns"]}`} onClick={() => {
                                              
                                        
                                            }}>ADD Company</button>
                                            <button className={`${stylesOBj["btn-export"]} ${stylesOBj['control-btns']}`} onClick={() => {}}>Export</button>
                                           
                                        </div>                           
                                    </div>

                                    {/* Data Table */}
                                          <div className={`${stylesOBj["table-container"]}`}>

                                            {isLoading? <TableSkeleton /> :<table className={`${stylesOBj["data-table"]}`}>
                                                    <thead>
                                    <tr>
                                        {TableColumnsData?.map(head=><th>{head?.title}</th>)}
                                       
                                    </tr>
                                </thead>

                                 <tbody>
                                     {allClientsList?.length === 0 ? <tr>
                                        <td colSpan={12} style={{ textAlign: "center", padding: "20px" }}>
                                            No data available
                                        </td>
                                    </tr> :
                                        <>
                                        {allClientsList.map((data,index)=>{
                                          return <tr key={data.key}>
{TableColumnsData?.map(col=><td>{data[col.dataIndex]}</td>)}

<TableRowComponent data={data} index={index}  />
                                          </tr> 
                                        })}
                                        </>}
                                 </tbody>
                                             </table>
                                            }
                                             
                                          </div>
            </div>

            </main>

    </div>
}