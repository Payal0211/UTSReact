import React, {
  useState,
  useEffect,
  Suspense,
  useMemo,
  useCallback,
} from "react";
import { Dropdown, Menu, message, Table, Tooltip, Modal, Checkbox, Select,Skeleton, Radio } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import {
  AddNewType,
  DayName,
  InputType,
  UserAccountRole,
} from "constants/application";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReactComponent as ArrowDownSVG } from "assets/svg/arrowDown.svg";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as LockSVG } from "assets/svg/lock.svg";
import { ReactComponent as UnlockSVG } from "assets/svg/unlock.svg";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { useAllHRQuery } from "shared/hooks/useAllHRQuery";
import { hrUtils } from "modules/hiring request/hrUtils";
import { IoChevronDownOutline } from "react-icons/io5";
import allHRStyles from "./all_hiring_request.module.css";
import UTSRoutes from "constants/routes";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";

import HROperator from "modules/hiring request/components/hroperator/hroperator";
import { DateTimeUtils } from "shared/utils/basic_utils";
import { allHRConfig } from "./allHR.config";
import WithLoader from "shared/components/loader/loader";
import { HTTPStatusCode } from "constants/network";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import DownArrow from "assets/svg/arrowDown.svg";
import Prioritycount from "assets/svg/priority-count.svg";
import Remainingcount from "assets/svg/remaining-count.svg";
import CloneHR from "./cloneHRModal";
import { MasterDAO } from "core/master/masterDAO";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import _debounce from "lodash/debounce";
import ReopenHRModal from "../../components/reopenHRModal/reopenHrModal";
import CloseHRModal from "../../components/closeHRModal/closeHRModal";
import { downloadToExcel } from "modules/report/reportUtils";
import LogoLoader from "shared/components/loader/logoLoader";
import PreviewHRModal from "./previewHR/previewHRModal";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import RePostHRModal from "modules/hiring request/components/repostHRModal/repostHRModal";
import SplitHR from "./splitHR";
import { ReportDAO } from "core/report/reportDAO";
import { useForm } from "react-hook-form";

/** Importing Lazy components using Suspense */
const HiringFiltersLazyComponent = React.lazy(() =>
  import("modules/hiring request/components/hiringFilter/hiringFilters")
);


let defaaultFilterState = {  pagesize: 20,
	pagenum: 1,
	sortdatafield: "CreatedDateTime",
	sortorder: "desc",
	searchText: "",
	IsDirectHR: false,
  hrTypeIds:''
}

const AllHiringRequestScreen = () => {
  const [tableFilteredState, setTableFilteredState] = useState(defaaultFilterState);

  const [isLoading, setLoading] = useState(false);

  const pageSizeOptions = [20,100, 200, 300, 500, 1000, 5000];
  // const hrQueryData = useAllHRQuery();
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [filtersList, setFiltersList] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState([]);
  const [apiData, setAPIdata] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const navigate = useNavigate();
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [isOpen, setIsOpen] = useState(false);
  const [priorityCount, setPriorityCount] = useState([]);
  const [messageAPI, contextHolder] = message.useMessage();
  const [openCloneHR, setCloneHR] = useState(false);
   const [openSplitHR, setSplitHR] = useState(false);
  const [getHRnumber, setHRNumber] = useState({hrNumber:'', isHybrid:false});
  const [getHRID, setHRID] = useState("");
  const [reopenHrData, setReopenHRData] = useState({});
  const [reopenHrModal, setReopenHrModal] = useState(false);
  const [repostHrModal,setRepostHrModal] = useState(false)
  const [closeHRDetail, setCloseHRDetail] = useState({});
  const [closeHrModal, setCloseHrModal] = useState(false);
  const [isFrontEndHR, setIsFrontEndHR] = useState(false);
  const [isOnlyPriority, setIsOnlyPriority] = useState(false);
  const [isOnlyDiamond,setIsOnlyDiamond] = useState(false);
  const [userData, setUserData] = useState({});
  const [isShowDirectHRChecked, setIsShowDirectHRChecked] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [HRTypesList,setHRTypesList] = useState([])
  const [selectedHRTypes, setSelectedHRTypes] = useState([]);

  const [ isPreviewModal, setIsPreviewModal ] = useState(false);
  const [ previewIDs, setpreviewIDs ] = useState();
  const [jobPreview, setJobPreview] = useState();
  const [allData,setAllData] = useState(null);
  const [hrIdforPreview, setHrIdforPreview] = useState("");
  const [hrNumber, sethrNumber] = useState("");
  const [ispreviewLoading,setIspreviewLoading] = useState(false)

  const [showDiamondRemark, setShowDiamondRemark] = useState(false);
  const [showAddDiamondRemark, setShowAddDiamondRemark] = useState(false);
  const [companyIdForRemark, setCompanyIdForRemark] = useState(0);
  const [remDiamondLoading, setRemDiamondLoading] = useState(false);
  const [addDiamondReason, setAddDiamondReason] = useState("As Per Formula");

  const [isSplitLoading, setIsSplitLoading] = useState(false);
  const [groupList,setGroupList] = useState([{
    pod:'',amLead:'', amLeadAmount:'',am:'',amAmount:'',taLead:'',taLeadAmount:'',ta:'', taAmount:'' ,currency:''
  }])

    const {
      watch,
      register,
      setError,
      handleSubmit,
      resetField,
      clearErrors,
      formState: { errors },
    } = useForm();


  // UTS-7517: Code for clone HR in demo acccount starts

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);  
  const [showCloneHRToDemoAccount, setShowCloneHRToDemoAccount] = useState(false);

  const handleDemoCloneCheckboxChange = (value) => {     
    const obj = {'companyId':value.companyID, 'hRID':value.HRID, 'hR_Number': value.HR_ID};
  
    setSelectedCheckboxes(prev => {
      if(prev.map(item=> item.hRID)?.includes(value.HRID)){
        return prev.filter(item=> item.hRID !== value.HRID);
      }
      return [...prev, obj]});    
  };

  const CloneHRDemoAccountAPICall = async () => {    
    if(selectedCheckboxes.length > 0)
    {      
      setLoading(true);
      let payload = { "cloneHRLists" : selectedCheckboxes  }
      let result = await hiringRequestDAO.cloneHRToDemoAccountDAO(payload);
      if (result.statusCode === 200) {      
        message.success("Operation performed successfully, you will get an email with detailed information"); 
        setSelectedCheckboxes([]); 
      }
      setLoading(false);
    }
    else{
      message.error("Please select atleast one HR.");
    }
  };

  // UTS-7517: Code for clone HR in demo acccount ends

  useEffect(() => {
    const getUserResult = async () => {
      let userData = UserSessionManagementController.getUserSession();
      if (userData) setUserData(userData);
    };
    getUserResult();
  }, []);

  const onRemoveHRFilters = () => {
    setTimeout(() => {
      setIsAllowFilters(false);
    }, 300);
    setHTMLFilter(false);
  };

  /* const togglePriority = useCallback(
		async (payload) => {
			setLoading(true);
			let response = await hiringRequestDAO.sendHRPriorityForNextWeekRequestDAO(
				payload,
			);
			if (response.statusCode === HTTPStatusCode.OK) {
				const { tempdata, index } = hrUtils.hrTogglePriority(response, apiData);
				setAPIdata([
					...apiData.slice(0, index),
					tempdata,
					...apiData.slice(index + 1),
				]);
				setLoading(false);
				messageAPI.open({
					type: 'success',
					content: `${tempdata.HR_ID} priority has been changed.`,
				});
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
				return 'NO DATA FOUND';
			}
		},
		[apiData, messageAPI, navigate],
	); */
  const togglePriority = useCallback(
    async (payload) => {
      setLoading(true);
      localStorage.setItem("hrid", payload.hRID);
      let response = await hiringRequestDAO.setHrPriorityDAO(
        payload.isNextWeekStarMarked,
        payload.hRID,
        payload.person
      );
      if (response.statusCode === HTTPStatusCode.OK) {
        getPriorityCount();
        const { tempdata, index } = hrUtils.hrTogglePriority(response, apiData);
        //if priprity filter enable then remove priority from list otherwise update
        if (isOnlyPriority) {
          handleHRRequest(tableFilteredState);
        } else {
          setAPIdata([
            ...apiData.slice(0, index),
            tempdata,
            ...apiData.slice(index + 1),
          ]);
          setLoading(false);
        }

        messageAPI.open({
          type: "success",
          content: `${tempdata?.HR_ID} priority has been changed.`,
        });
      } else if (response.statusCode === HTTPStatusCode.NOT_FOUND) {
        setLoading(false);
        messageAPI.open({
          type: "error",
          content: response.responseBody,
        });
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
        return "NO DATA FOUND";
      }
    },
    [apiData, messageAPI, navigate]
  );
  const cloneHRhandler = async (isHybrid, payload,resetFields) => {
    let data = {
      hrid: getHRID,
    };
    if(isHybrid){
      data = {...data,...payload}
    }
    const response = data?.hrid && (await MasterDAO.getCloneHRDAO(data));
    // console.log(response, '--response');
    if (response.statusCode === HTTPStatusCode.OK) {
      setCloneHR(false);
      resetFields && resetFields()
      // localStorage.setItem("hrID", response?.responseBody?.details);
      localStorage.removeItem("dealID");
      navigate(`${UTSRoutes.ADDNEWHR}/${response?.responseBody?.details}`, { state: { isCloned: true } });
    }
  };
  const miscData = UserSessionManagementController.getUserMiscellaneousData();

  const getPreviewPostData = async (hrId, hrNumber,companyId) => {
    setHrIdforPreview(hrId);
    setIspreviewLoading(true);
    let data = {};
   
    // data.contactId = 810;
    data.companyId= companyId;
    data.hrId = hrId;
 
    let res = await allCompanyRequestDAO.getHrPreviewDetailsDAO(data);


    if (res.statusCode === 200) {
      let details = res?.responseBody;
      const previewData = { ...details.JobPreview, hrNumber: hrNumber, HRID: hrId,atSJoblocation: details.atSJoblocation};
      sethrNumber(hrNumber);
      setJobPreview(previewData);
      setAllData(details);
    }
    setIspreviewLoading(false);
  };

  const handleReopen = async (d) => {
    setLoading && setLoading(true)
    let data = { hrID: reopenHrData?.HR_Id , updatedTR: reopenHrData?.ClientDetail?.NoOfTalents };
    const response = await hiringRequestDAO.ReopenHRDAO(data);
    // console.log("reoprn ",response)
    if (response?.statusCode === HTTPStatusCode.OK) {                            
      
      setLoading && setLoading(false)
      if(response?.responseBody?.details?.isReopen){
         window.location.reload();
      }else{
        message.error(response?.responseBody?.details?.message,10)
      }
    }
    if(response?.statusCode === HTTPStatusCode.BAD_REQUEST){
      message.error(response?.responseBody,10)
      setLoading && setLoading(false)
    }
    setLoading && setLoading(false)
  };

    const getPODList = async (getHRID) => {
          setIsSplitLoading(true);
  let pl = {hrNo:getHRID,podid :0} 
          let filterResult = await ReportDAO.getAllPODUsersGroupDAO(pl);
          setIsSplitLoading(false); 
          if (filterResult.statusCode === HTTPStatusCode.OK) {
          //   console.log('filterResult',filterResult?.responseBody)
            let modData = await modifyResponseforPOD(filterResult?.responseBody)
            
          //   let datawithList = await adduserListToEachPOD(modData)
          //   console.log('set g list',modData,datawithList)
           setGroupList(modData) 
          } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            // setLoading(false); 
            return navigate(UTSRoutes.LOGINROUTE);
          } else if (
            filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
          ) {
            // setLoading(false);
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
          } else {
              setGroupList([{
      pod:'',amLead:'', amLeadAmount:'',am:'',amAmount:'',taLead:'',taLeadAmount:'',ta:'', taAmount:'' ,currency:''
    }])
            return "NO DATA FOUND";
          }
        };

         const modifyResponseforPOD =async (data)=>{
            let categories = []
            let modData = []
        
            data.forEach(item=>{
                if(!categories.includes(item.category)){
                    categories.push(item.category)
                }
            })
        
            categories.forEach( async cat=>{
               let cats = data.filter(item=> item.category === cat)
                let podObj = {
                    pod:'',amLead:'', amLeadAmount:'',am:'',amAmount:'',taLead:'',taLeadAmount:'',ta:'', taAmount:'' ,currency:''
                }
    
          podObj.pod = cats[0]?.poD_ID
            podObj.currency = cats[0]?.currencyCode
                cats.forEach(itm=>{
                    switch(itm.roW_Value){
                        case 'AM Lead':{
                            podObj.amLead = (itm.userID !== 0) ? itm.userID : ''
                            podObj.amLeadAmount = itm.revenue
                            break
                        }
                        case 'AM':{
                            podObj.am = (itm.userID !== 0 )? itm.userID : ''
                            podObj.amAmount = itm.revenue
                            break
                        }
                        case 'TA Lead':{
                            podObj.taLead = (itm.userID !== 0 )? itm.userID : ''
                            podObj.taLeadAmount = itm.revenue
                            break
                        }
                        case 'TA':{
                            podObj.ta = (itm.userID !== 0 )? itm.userID : ''
                            podObj.taAmount = itm.revenue
                            break
                        }
                        default : break
                    }
                })
                modData.push(podObj)
               
            })
        
         
            return modData
         }

         const updateHRCategory = async (cat,hrID) => {
          let pl = {hrID:hrID,category:cat ==='None' ? '' : cat} 
      
          let Result = await hiringRequestDAO.updateHRCategoryDAO(pl);
          if (Result.statusCode === HTTPStatusCode.OK) {
            handleHRRequest(tableFilteredState);
          }else{
            message.error("Something went wrong, please try again later.");
          }
         }

        const setDiamondCompany = async (row, index) => {
          let payload = {
            basicDetails: {
              companyID: row.companyID,
              companyCategory: "Diamond",
            },
            // IsUpdateFromPreviewPage: true,
          };
         
          let res = await allCompanyRequestDAO.updateCompanyCategoryDAO(payload);
          if(res.statusCode === 200){
             handleHRRequest(tableFilteredState);
          }else{
            message.error("Something went wrong, please try again later.");
          }
        };

  const handleRemoveDiamond = async (d) => {
      let payload = {
        CompanyID: companyIdForRemark.companyID,
        DiamondCategoryRemoveRemark: d.diamondCategoryRemoveRemark,
      };
      setRemDiamondLoading(true);
      let res = await allCompanyRequestDAO.removeCompanyCategoryDAO(payload);
      setRemDiamondLoading(false);
      //   console.log("response", res);
      if (res.statusCode === 200) {
      
        setShowDiamondRemark(false);
        resetField("diamondCategoryRemoveRemark");
        clearErrors("diamondCategoryRemoveRemark");
        handleHRRequest(tableFilteredState);
      } else {
        message.error("Something Went Wrong!");
      }
    };

     const handleAddDiamond = async (d) => {
      let payload = {
        CompanyID: companyIdForRemark.companyID,
        DiamondCategoryRemoveRemark: addDiamondReason ==='Other' ? d.diamondCategoryAddRemark : addDiamondReason,
      };
      setRemDiamondLoading(true);
      // console.log("payload", payload);
      let res = await allCompanyRequestDAO.addCompanyDiamondCategoryDAO(payload);
      setRemDiamondLoading(false);
      //   console.log("response", res);
      if (res.statusCode === 200) {
      
        setShowAddDiamondRemark(false);
        resetField("diamondCategoryAddRemark");
        clearErrors("diamondCategoryAddRemark");
        handleHRRequest(tableFilteredState);
      } else {
        message.error("Something Went Wrong!");
      }
    };


  const tableColumnsMemo = useMemo(
    () =>
      allHRConfig.tableConfig(
        {togglePriority,
        setCloneHR,
        setHRID,
        setHRNumber,
        setReopenHRData,
        setReopenHrModal,
        setCloseHRDetail,
        setCloseHrModal,
        LoggedInUserTypeID:userData?.LoggedInUserTypeID,
        setLoading,
        handleDemoCloneCheckboxChange, 
        selectedCheckboxes,       
        showCloneHRToDemoAccount,
        setIsPreviewModal,
        setpreviewIDs,
        getPreviewPostData,
        setRepostHrModal,setSplitHR,getPODList,userData,updateHRCategory,setDiamondCompany,
        setShowDiamondRemark,setCompanyIdForRemark,setShowAddDiamondRemark}
      ),
    [togglePriority, userData.LoggedInUserTypeID,selectedCheckboxes]
  );
  const handleHRRequest = useCallback(
    async (pageData) => {      
      setLoading(true);
      // save filter value in localstorage
      if (pageData.filterFields_ViewAllHRs) {
        localStorage.setItem(
          "filterFields_ViewAllHRs",
          JSON.stringify(pageData.filterFields_ViewAllHRs)
        );
      }else{
		localStorage.removeItem('filterFields_ViewAllHRs');
	  }

      let response = await hiringRequestDAO.getPaginatedHiringRequestDAO({
        ...pageData,
        isFrontEndHR: isFrontEndHR,
        StarNextWeek: isOnlyPriority,
        OnlyDiamond: isOnlyDiamond ? 'diamond' : ''
      });

      if (response?.statusCode === HTTPStatusCode.OK) {
        setTotalRecords(response?.responseBody?.totalrows);
        setLoading(false);
        setAPIdata(hrUtils.modifyHRRequestData(response && response));
        setShowCloneHRToDemoAccount(response?.responseBody?.ShowCloneToDemoAccount);
      } else if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
        setLoading(false);
        setTotalRecords(0);
        setAPIdata([]);
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
        return "NO DATA FOUND";
      }
    },
    [navigate, isFrontEndHR, isOnlyPriority,isOnlyDiamond]
  );

  useEffect(() => {
    getPriorityCount();
  }, []);

  let getPriorityCount = async () => {
    let priorityCount = await hiringRequestDAO.getRemainingPriorityCountDAO();
    setPriorityCount(priorityCount?.responseBody?.details);
  };

  const debounceFun = useMemo(
    (value) => _debounce(handleHRRequest, 4000),
    [handleHRRequest]
  );
  const debouncedSearchHandler = (e) => {
    if (e.target.value.length > 1 || e.target.value === "") {
      setTimeout(() => {
        setTableFilteredState({
          ...tableFilteredState,
          pagenum: 1,
          searchText: e.target.value,
        });
      }, 2000);
    }

    setDebouncedSearch(e.target.value);
    setPageIndex(1);
    //debounceFun(e.target.value);
  };

  const handleRequetWithDates = useCallback(() => {
    if (startDate && endDate) {
      handleHRRequest({
        ...tableFilteredState,
        filterFields_ViewAllHRs: {
          ...tableFilteredState.filterFields_ViewAllHRs,
          fromDate: new Date(startDate).toLocaleDateString("en-US"),
          toDate: new Date(endDate).toLocaleDateString("en-US"),
        },
      });
    } else {
      let appliedFilter = localStorage.getItem("filterFields_ViewAllHRs");

      if (
        appliedFilter?.length > 0 &&
        tableFilteredState.filterFields_ViewAllHRs === undefined
      ) {
        return;
      } else {
        handleHRRequest(tableFilteredState);
      }
    }
  }, [tableFilteredState, endDate, startDate, isFrontEndHR, isOnlyPriority,isOnlyDiamond]);

  useEffect(() => {
    // handleHRRequest(tableFilteredState);
    handleRequetWithDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableFilteredState, isFrontEndHR, isOnlyPriority,isOnlyDiamond]);

  const getHRFilterRequest = useCallback(async () => {
    const response = await hiringRequestDAO.getAllFilterDataForHRRequestDAO();
     const rejectionResponse = await hiringRequestDAO.getAllFilterDataForHRRejectedReasonRequestDAO();
    if (response?.statusCode === HTTPStatusCode.OK) {
      setFiltersList(response && response?.responseBody?.details?.Data);
      setHRTypesList(response && response?.responseBody?.details?.Data.hrTypes.map(i => ({id:i.text, value:i.value})))
    } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      return "NO DATA FOUND";
    }

    if (rejectionResponse?.statusCode === HTTPStatusCode.OK) {
      setRejectionReasons(rejectionResponse.responseBody.details.Data)
    }
  }, [navigate]);

  useEffect(() => {
    getHRFilterRequest();
  }, [getHRFilterRequest]);

  const toggleHRFilter = useCallback(() => {
    !getHTMLFilter
      ? setIsAllowFilters(true)
      : setTimeout(() => {
          setIsAllowFilters(true);
        }, 300);
    setHTMLFilter(!getHTMLFilter);
  }, [getHTMLFilter]);

  /*--------- React DatePicker ---------------- */

  const onCalenderFilter = (dates) => {
    const [start, end] = dates;

    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      setTableFilteredState({
        ...tableFilteredState,
        filterFields_ViewAllHRs: {
          ...tableFilteredState.filterFields_ViewAllHRs,
          fromDate: new Date(start).toLocaleDateString("en-US"),
          toDate: new Date(end).toLocaleDateString("en-US"),
        },
      });
      // handleHRRequest({
      //   ...tableFilteredState,
      //   filterFields_ViewAllHRs: {
      //     ...tableFilteredState.filterFields_ViewAllHRs,
      //     fromDate: new Date(start).toLocaleDateString("en-US"),
      //     toDate: new Date(end).toLocaleDateString("en-US"),
      //   },
      // });
    }
  };

 
  useEffect(() => {
    localStorage.removeItem("hrID");
    localStorage.removeItem("fromEditDeBriefing");

    // console.log("filter list",response?.responseBody?.details?.Data)
    let appliedFilter = localStorage.getItem("filterFields_ViewAllHRs");
    let filterList = localStorage.getItem("appliedHRfilters");
    let checkedState = localStorage.getItem("HRFilterCheckedState");

    if (appliedFilter?.length > 0 && filterList?.length > 0) {
      setTableFilteredState((prev) => ({
        ...prev,
        filterFields_ViewAllHRs: JSON.parse(appliedFilter),
      }));
      let mapData = JSON.parse(filterList);
      let checkedData = JSON.parse(checkedState);

      let newMap = new Map();
      let newCheckedmap = new Map();
      let filterCount = mapData.reduce((total, item) => {
        return total + item.value.split(",").length;
      }, 0);
      mapData.forEach((item) => {
        newMap.set(item.filterType, item);
      });
      if (checkedData?.length > 0) {
        checkedData.forEach((item) => {
          newCheckedmap.set(item.key, item.value);
        });
      }
      setFilteredTagLength(filterCount);
      setAppliedFilters(newMap);
      setCheckedState(newCheckedmap);
      setTimeout(() => {}, 5000);
    }
  }, []);

  const handleExport = (apiData) => {
    let DataToExport = apiData.map((data) => {
      let obj = {};
      tableColumnsMemo.map(
        (val) =>
          val.title !== " " && (obj[`${val.title}`] = data[`${val.dataIndex}`])
      );
      return obj;
    });
    downloadToExcel(DataToExport,'HR');
  };

  useEffect(()=>{
    if(selectedHRTypes.length > 0) {
      let typeIds = selectedHRTypes.reduce((val, hr, ind) => {
        let str = ind === (selectedHRTypes.length -1) ?  val + `${hr.id}` : val + `${hr.id},`
        return str },'')
      setTableFilteredState(prev=> ({...prev, hrTypeIds:typeIds}))
    }else{
      setTableFilteredState(prev=> ({...prev, hrTypeIds:''}))
    }
  },[selectedHRTypes])

  const clearFilters = useCallback(() => {
    setAppliedFilters(new Map());
    setCheckedState(new Map());
    setFilteredTagLength(0);
    setTableFilteredState(defaaultFilterState);
    // const reqFilter = {
    //   ...tableFilteredState,
    //   ...{
    //     pagesize: 100,
    //     pagenum: 1,
    //     sortdatafield: "CreatedDateTime",
    //     sortorder: "desc",
    //     searchText: "",
    //     // filterFields_ViewAllHRs: {},
    //     IsDirectHR: false,
    //   },
    // };

    localStorage.removeItem("filterFields_ViewAllHRs");
    localStorage.removeItem("appliedHRfilters");
    localStorage.removeItem("HRFilterCheckedState");
    // handleHRRequest(defaaultFilterState);
    setIsAllowFilters(false);
    setEndDate(null);
    setStartDate(null);
    setDebouncedSearch("");
    setIsFrontEndHR(false);
    setIsOnlyPriority(false);
    setIsOnlyDiamond(false);
    setIsShowDirectHRChecked(false);
    setSelectedHRTypes([])
    setPageIndex(1);
    setPageSize(20);
  }, [
    // handleHRRequest,
    setAppliedFilters,
    setCheckedState,
    setFilteredTagLength,
    setIsAllowFilters,
    setTableFilteredState,
    // tableFilteredState,
  ]);  

  return (
    <div className={allHRStyles.hiringRequestContainer}>
      {contextHolder}
      <div className={allHRStyles.addnewHR}>
      {/* <WithLoader className="pageMainLoader" showLoader={debouncedSearch?.length?false:isLoading}> */}
      <LogoLoader visible={isLoading} />
        <div className={allHRStyles.hiringRequest}></div>
        <div className={allHRStyles.btn_wrap}>
        {/* {showCloneHRToDemoAccount && <button
        style={{marginRight:'15px'}}
            className={allHRStyles.btnPrimary}
            onClick={() => CloneHRDemoAccountAPICall()} >
            Clone HR(s) to Demo Account
          </button>} */}
          {/* <div className={allHRStyles.priorities_drop_custom}>
            {priorityCount?.length === 1 ? (
              <button className={allHRStyles.togglebtn}>
                <span className={allHRStyles.blank_btn}>
                  <img src={Prioritycount} alt="assignedCount" /> Priority
                  Count: <b>{`${priorityCount[0].assignedCount}`}</b>{" "}
                </span>
                <span className={allHRStyles.blank_btn}>
                  <img src={Remainingcount} alt="remainingCount" /> Remaining
                  Count: <b>{`${priorityCount[0].remainingCount}`}</b>{" "}
                </span>
              </button>
            ) : (
              <button
                className={allHRStyles.togglebtn}
                onBlur={() => setIsOpen(false)}
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              >
                Priorities <img src={DownArrow} alt="icon" />
              </button>
            )}
            {isOpen && (
              <div className={allHRStyles.toggle_content}>
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Priority Count</th>
                      <th>Remaining Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priorityCount?.map((data, index) => {
                      return (
                        <tr key={`Priorities_${index}`}>
                          <td>{data.fullName}</td>
                          <td>{data.assignedCount}</td>
                          <td>{data.remainingCount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div> */}

          {(miscData?.loggedInUserTypeID === UserAccountRole.ADMINISTRATOR ||
            miscData?.loggedInUserTypeID === UserAccountRole.SALES ||
            miscData?.loggedInUserTypeID === UserAccountRole.SALES_MANAGER ||
            miscData?.loggedInUserTypeID === UserAccountRole.BDR ||
            miscData?.loggedInUserTypeID === UserAccountRole.MARKETING ||
            miscData?.loggedInUserTypeID === UserAccountRole.OPS_TEAM_MANAGER ||
            miscData?.loggedInUserTypeID === UserAccountRole.TALENTOPS 
          ) && (
            <HROperator
            title={"Add New HR"}
              // title={
              //   miscData?.loggedInUserTypeID === UserAccountRole.BDR ||
              //   miscData?.loggedInUserTypeID === UserAccountRole.MARKETING
              //     ? "Add New Direct HR"
              //     : "Add New HR"
              // }
              icon={<ArrowDownSVG style={{ width: "16px" }} />}
              backgroundColor={`var(--color-sunlight)`}
              iconBorder={`1px solid var(--color-sunlight)`}
              isDropdown={true}
              listItem={
                // miscData?.loggedInUserTypeID === UserAccountRole.ADMINISTRATOR
                //   ? [
                //       {
                //         label: "Add New HR",
                //         key: AddNewType.HR,
                //         IsEnabled: true,
                //       },
                //       // {
                //       //   label: "Add New Direct HR",
                //       //   key: AddNewType.DIRECT_HR,
                //       //   IsEnabled: true,
                //       // },
                //       {
                //         label: "Add New Client",
                //         key: AddNewType.CLIENT,
                //         IsEnabled: true,
                //       },
                //     ]
                //   : 
                miscData?.loggedInUserTypeID ===
                      UserAccountRole.TALENTOPS ||
                    miscData?.loggedInUserTypeID ===
                      UserAccountRole.OPS_TEAM_MANAGER || miscData?.loggedInUserTypeID === UserAccountRole.BDR ||
                    miscData?.loggedInUserTypeID === UserAccountRole.MARKETING ||
                    miscData?.loggedInUserTypeID === UserAccountRole.OPS_TEAM_MANAGER ||
                    miscData?.loggedInUserTypeID === UserAccountRole.TALENTOPS
                  ? [
                      {
                        label: "Add New HR",
                        key: AddNewType.HR,
                        IsEnabled: true,
                      },
                    ]
                
                  : [
                      {
                        label: "Add New HR",
                        key: AddNewType.HR,
                        IsEnabled: true,
                      },
                      // {
                      //   label: "Add New Client",
                      //   key: AddNewType.CLIENT,
                      //   IsEnabled: true,
                      // },
                    ]
              }
              menuAction={(item) => {
                switch (item.key) {
                  case AddNewType.HR: {
                    localStorage.removeItem('hrID')
                    navigate(UTSRoutes.ADDNEWHR);
                    break;
                  }
                  case AddNewType.DIRECT_HR: {
                    navigate(UTSRoutes.ADD_HR);
                    break;
                  }
                  case AddNewType.CLIENT: {
                    navigate(UTSRoutes.ADDNEWCLIENT);
                    break;
                  }
                  default:
                    break;
                }
              }}
            />
          )}

          <button
            className={allHRStyles.btnPrimary}
            onClick={() => handleExport(apiData)}
          >
            Export
          </button>
        </div>
      </div>
      {/*
       * --------- Filter Component Starts ---------
       * @Filter Part
       */}
      <div className={allHRStyles.filterContainer}>
        <div className={allHRStyles.filterSets}>
          <div className={allHRStyles.filterSetsInner}>
            <div className={allHRStyles.addFilter} onClick={toggleHRFilter}>
              <FunnelSVG style={{ width: "16px", height: "16px" }} />

              <div className={allHRStyles.filterLabel}>Add Filters</div>
              <div className={allHRStyles.filterCount}>{filteredTagLength}</div>
            </div>
            <p onClick={() => clearFilters()}>Reset Filters</p>

           

          </div>
          <div className={allHRStyles.filterRight}>
            {/* <Checkbox
              checked={isOnlyPriority}
              onClick={() => setIsOnlyPriority((prev) => !prev)}
            >
              Show only Priority
            </Checkbox> */}
            {/* <Checkbox
              checked={isFrontEndHR}
              onClick={() => setIsFrontEndHR((prev) => !prev)}
              className={allHRStyles.focusCheckBox}
            >
              Show Self Sign Up Only
            </Checkbox> */}

            {/* <Checkbox
              checked={isOnlyDiamond}
              onClick={() => setIsOnlyDiamond((prev) => !prev)}
            >
              Only Diamond Client
            </Checkbox>  */}

            {/* <Select 
                mode="multiple"
                size='small'
                style={{ width: '150px' }}
                search={false}
                placeholder="Select HR Type"
                value={selectedHRTypes}
                onChange={(data,datawithID)=>{setSelectedHRTypes(datawithID)}}
                options={HRTypesList} 
            /> */}

           
            <div className={allHRStyles.searchFilterSet}>
              <SearchSVG style={{ width: "16px", height: "16px" }} />
              <input
                type={InputType.TEXT}
                className={allHRStyles.searchInput}
                placeholder="Search via HR#, Role , Company , Client , HR Type"
                onChange={debouncedSearchHandler}
                value={debouncedSearch}
              />
            </div>
            <div className={allHRStyles.calendarFilterSet}>
              <div className={allHRStyles.label}>Date</div>
              <div className={allHRStyles.calendarFilter}>
                <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                <DatePicker
                  style={{ backgroundColor: "red" }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={allHRStyles.dateFilter}
                  placeholderText="Start date - End date"
                  selected={startDate}
                  onChange={onCalenderFilter}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                />
              </div>
            </div>
            {/* <div className={allHRStyles.priorityFilterSet}>
							<div className={allHRStyles.label}>Set Priority</div>
							<div
								className={allHRStyles.priorityFilter}
								style={{
									cursor:
										DateTimeUtils.getTodaysDay() === DayName.FRIDAY
											? 'not-allowed'
											: 'pointer',
								}}>
								{DateTimeUtils.getTodaysDay() === DayName.FRIDAY ? (
									<Tooltip
										placement="bottom"
										title="Locked">
										<LockSVG
											style={{
												width: '18px',
												height: '18px',
												cursor:
													DateTimeUtils.getTodaysDay() === DayName.FRIDAY
														? 'not-allowed'
														: 'pointer',
											}}
										/>
									</Tooltip>
								) : (
									<Tooltip
										placement="bottom"
										title="Unlocked">
										<UnlockSVG style={{ width: '18px', height: '18px' }} />
									</Tooltip>
								)}
							</div>
						</div> */}
            <div className={allHRStyles.priorityFilterSet}>
              <div className={allHRStyles.label}>Showing</div>

              <div className={allHRStyles.paginationFilter}>
                <Dropdown
                  trigger={["click"]}
                  placement="bottom"
                  overlay={
                    <Menu
                      onClick={(e) => {
                        setPageSize(parseInt(e.key));
                        if (pageSize !== parseInt(e.key)) {
                          handleHRRequest({
                            ...tableFilteredState,
                            pagesize: parseInt(e.key),
                            pagenum: pageIndex,
                          });
                        }
                      }}
                    >
                      {pageSizeOptions.map((item) => {
                        return <Menu.Item key={item}>{item}</Menu.Item>;
                      })}
                    </Menu>
                  }
                >
                  <span>
                    {pageSize}
                    <IoChevronDownOutline
                      style={{ paddingTop: "5px", fontSize: "16px" }}
                    />
                  </span>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*
       * ------------ Table Starts-----------
       * @Table Part
       */}
      <div className={`${allHRStyles.tableDetails} ${allHRStyles.hiringRequestTable}`}>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <WithLoader className="mainLoader">
            <Table
              scroll={{ x: "100vw", y: "100vh" }}
              id="hrListingTable"
              columns={tableColumnsMemo}
              bordered={false}
              dataSource={
                // search && search.length > 0 ? [...search] : [...apiData]
                search && search?.length === 0
                  ? []
                  : search && search.length > 0
                  ? [...search]
                  : [...apiData]
              }
              pagination={
                search && search?.length === 0
                  ? null
                  : {
                      onChange: (pageNum, pageSize) => {
                        setPageIndex(pageNum);
                        setPageSize(pageSize);
                        setTableFilteredState({
                          ...tableFilteredState,
                          pagesize: pageSize,
                          pagenum: pageNum,
                        });
                        // handleHRRequest({
                        //   pagesize: pageSize,
                        //   pagenum: pageNum,
                        // });
                      },
                      size: "small",
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

      {isAllowFilters && (
        <Suspense fallback={<div>Loading...</div>}>
          <HiringFiltersLazyComponent
            setAppliedFilters={setAppliedFilters}
            appliedFilter={appliedFilter}
            setCheckedState={setCheckedState}
            setIsAllowFilters={setIsAllowFilters}
            checkedState={checkedState}
            handleHRRequest={handleHRRequest}
            setPageIndex={setPageIndex}
            setTableFilteredState={setTableFilteredState}
            tableFilteredState={tableFilteredState}
            setFilteredTagLength={setFilteredTagLength}
            onRemoveHRFilters={onRemoveHRFilters}
            getHTMLFilter={getHTMLFilter}
            isShowDirectHRChecked={isShowDirectHRChecked}
            setIsShowDirectHRChecked={setIsShowDirectHRChecked}
            hrFilterList={allHRConfig.hrFilterListConfig()}
            filtersType={allHRConfig.hrFilterTypeConfig(
              filtersList && filtersList,rejectionReasons
            )}
            clearFilters={clearFilters}
          />
        </Suspense>
      )}
      <Modal
        width={"700px"}
        centered
        footer={false}
        open={openCloneHR}
        className="cloneHRConfWrap"
        onCancel={() => setCloneHR(false)}
      >
        <CloneHR
          cloneHRhandler={cloneHRhandler}
          onCancel={() => setCloneHR(false)}
          getHRnumber={getHRnumber.hrNumber}
          isHRHybrid={getHRnumber.isHybrid}
          companyID={getHRnumber.companyID}
        />
      </Modal>

            <Modal
        width={"700px"}
        centered
        footer={false}
        open={openSplitHR}
        className="cloneHRConfWrap"
        onCancel={() => setSplitHR(false)}
      >
        <SplitHR
          onCancel={() => {setSplitHR(false);setHRID('')}}
          getHRID={getHRID}
          getHRnumber={getHRnumber.hrNumber}
          isHRHybrid={getHRnumber.isHybrid}
          companyID={getHRnumber.companyID}
          impHooks={{groupList,setGroupList,isSplitLoading, setIsSplitLoading}}
        />
      </Modal>

      {reopenHrModal && (
        <Modal
          width={"864px"}
          centered
          footer={false}
          open={reopenHrModal}
          className="updateTRModal"
          onCancel={() => setReopenHrModal(false)}
        >
          <ReopenHRModal
            onCancel={() => setReopenHrModal(false)}
            apiData={reopenHrData}
          />
        </Modal>
      )}

    {repostHrModal && (
        <Modal
          width={"864px"}
          centered
          footer={false}
          open={repostHrModal}
          className="updateTRModal"
          onCancel={() => setRepostHrModal(false)}
        >
          <RePostHRModal
            onCancel={() => setRepostHrModal(false)}
            apiData={reopenHrData}
            handleReopen={()=>handleReopen()}
          />
        </Modal>
      )}

            {showDiamondRemark && (
              <Modal
                transitionName=""
                width="1000px"
                centered
                footer={null}
                open={showDiamondRemark}
                className="engagementModalStyle"
                onCancel={() => {
                  setShowDiamondRemark(false);
                  resetField("diamondCategoryRemoveRemark");
                  clearErrors("diamondCategoryRemoveRemark");
                }}
              >
                <div style={{ padding: "35px 15px 10px 15px" }}>
                  <h3>Add Remark</h3>
                </div>
      
                <div style={{ padding: "10px 20px" }}>
                  {remDiamondLoading ? (
                    <Skeleton active />
                  ) : (
                    <HRInputField
                      isTextArea={true}
                      register={register}
                      errors={errors}
                      label="Remark"
                      name="diamondCategoryRemoveRemark"
                      type={InputType.TEXT}
                      placeholder="Enter Remark"
                      validationSchema={{
                        required: "please enter remark",
                      }}
                      required
                    />
                  )}
                </div>
      
                <div style={{ padding: "10px 20px" }}>
                  <button
                    className={allHRStyles.btnPrimary}
                    onClick={handleSubmit(handleRemoveDiamond)}
                    disabled={remDiamondLoading}
                  >
                    Save
                  </button>
                  <button
                    className={allHRStyles.btnCancle}
                    disabled={remDiamondLoading}
                    onClick={() => {
                      setShowDiamondRemark(false);
                      resetField("diamondCategoryRemoveRemark");
                      clearErrors("diamondCategoryRemoveRemark");
                    }}
                  >
                    Close
                  </button>
                </div>
              </Modal>
            )}


      {showAddDiamondRemark && (
              <Modal
                transitionName=""
                width="800px"
                centered
                footer={null}
                open={showAddDiamondRemark}
                className="engagementModalStyle"
                onCancel={() => {
                  setShowAddDiamondRemark(false);
                  resetField("diamondCategoryAddRemark");
                  clearErrors("diamondCategoryAddRemark");
               
                }}
              >
                <div style={{ padding: "35px 15px 10px 15px" }}>
                  <h3>Mark Diamond</h3>
                </div>

                 <div style={{ padding: "10px 20px" }}>
                  {remDiamondLoading ? (
                    <Skeleton active />
                  ) : (
                    <Radio.Group
                                 onChange={(e) => {
                                  setAddDiamondReason(e.target.value);
                                 }}
                                 value={addDiamondReason}
                                 style={{flexDirection:'column'}}
                               >
                                 <Radio value={"As Per Formula"}>As Per Formula</Radio>
                                 <Radio value={"Other"}>Other</Radio>
                               </Radio.Group>
                  )}
                </div>
                  
                  {
                    addDiamondReason === 'Other' && <div style={{ padding: "10px 20px" }}>
                  {remDiamondLoading ? (
                    <Skeleton active />
                  ) : (
                    <HRInputField
                      isTextArea={true}
                      register={register}
                      errors={errors}
                      label="Other Remark"
                      name="diamondCategoryAddRemark"
                      type={InputType.TEXT}
                      placeholder="Enter Remark"
                      validationSchema={{
                        required:addDiamondReason ==='Other'?"please enter remark" : false,
                      }}
                      required={addDiamondReason ==='Other'?true :false }
                    />
                  )}
                </div>
                  }
                
      
                <div style={{ padding: "10px 20px" }}>
                  <button
                    className={allHRStyles.btnPrimary}
                    onClick={handleSubmit(handleAddDiamond)}
                    disabled={remDiamondLoading}
                  >
                    Save
                  </button>
                  <button
                    className={allHRStyles.btnCancle}
                    disabled={remDiamondLoading}
                    onClick={() => {
                      setShowAddDiamondRemark(false);
                      resetField("diamondCategoryAddRemark");
                      clearErrors("diamondCategoryAddRemark");
                    }}
                  >
                    Close
                  </button>
                </div>
              </Modal>
            )}      

      {closeHrModal && (
        <Modal
          width={"864px"}
          centered
          footer={false}
          open={closeHrModal}
          className="updateTRModal"
          onCancel={() => setCloseHrModal(false)}
        >
          <CloseHRModal
            closeHR={() => {}}
            setUpdateTR={() => setCloseHrModal(true)}
            onCancel={() => setCloseHrModal(false)}
            closeHRDetail={closeHRDetail}
          />
        </Modal>
      )}

      <PreviewHRModal 
        setChangeStatus={()=>{}}
        setViewPosition={setIsPreviewModal}
        ViewPosition={isPreviewModal}
        setJobPreview={setJobPreview}
        allData={allData}
        jobPreview={jobPreview}
        hrIdforPreview={hrIdforPreview}
        hrNumber={hrNumber}
        ispreviewLoading={ispreviewLoading}
        previewIDs={previewIDs}
      />
    {/* </WithLoader> */}
    </div>
  );
};

export default AllHiringRequestScreen;
