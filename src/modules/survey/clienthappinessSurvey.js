import React, {
	useState,
	useEffect,
	Suspense,
	useCallback,
} from 'react';
import { Dropdown, Menu, Table, Modal,Select, AutoComplete } from 'antd';
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
import clienthappinessSurveyStyles from './client_happiness_survey.module.css';

import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { Controller, useForm } from 'react-hook-form';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useNavigate } from 'react-router-dom';
import { clientHappinessSurveyRequestDAO } from 'core/clientHappinessSurvey/clientHappinessSurveyDAO';
import { HTTPStatusCode } from 'constants/network';
import { downloadToExcel } from 'modules/report/reportUtils';
import { clientHappinessSurveyConfig } from 'modules/hiring request/screens/clientHappinessSurvey/clientHappinessSurvey.config';

const SurveyFiltersLazyComponent = React.lazy(() =>
	import('modules/survey/components/surveyFilter/surveyfilters'),
);

 const ClienthappinessSurvey =()=> {
    const navigate = useNavigate();
    const [generateLink, setGenerateLink] = useState(false);
    const {
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		getValues,
		watch,
		reset,
		resetField,
		unregister,
		formState: { errors },
	} = useForm();   

    const pageSizeOptions = [100, 200, 300, 500, 1000,5000];
    const [tableFilteredState, setTableFilteredState] = useState({       
        pagenumber:1,
        totalrecord:100,
        filterFields_HappinessSurvey:{}
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

    const [filteredTagLength, setFilteredTagLength] = useState(0);
    const [filtersList, setFiltersList] = useState([]);
    const [getHTMLFilter, setHTMLFilter] = useState(false);
    const [isAllowFilters, setIsAllowFilters] = useState(false);

    const [clientHappinessSurveyList,setClientHappinessSurveyList] = useState([]);
    const [autoCompleteCompanyList,setAutoCompleteCompanyList] = useState([]);

    const watchCompany = watch('company');
    const watchClient = watch('client');
    const watchEmail = watch('email');

    const [generateLinkData,setGenerateLinkData ] = useState({company: '',client: "",email: ""});

    useEffect(() => {
        let _generateLinkData = {...generateLinkData};
        if (watchCompany) {
            _generateLinkData.company = watchCompany;
            getAutoCompleteComapany(watchCompany);
        }
        if(watchClient){
            _generateLinkData.client = watchClient;
        }
        if(watchEmail) {
            _generateLinkData.email = watchEmail;
        }   
        setGenerateLinkData(_generateLinkData);
    },[watchCompany,watchClient,watchEmail])
    

    const getAutoCompleteComapany = useCallback(
		async (watchCompany) => {
			let response = await clientHappinessSurveyRequestDAO.getAutoCompleteCompanyDAO(watchCompany);
			if (response?.statusCode === HTTPStatusCode.OK) {				
                setAutoCompleteCompanyList(response?.responseBody ?? []);				
			} else if (
				response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
				response?.statusCode === HTTPStatusCode.NOT_FOUND
			) {			
				setAutoCompleteCompanyList([]);
			}
		},
		[],
	); 

    const columns = [
        {
            title: 'Date',
            dataIndex: 'addedDate',
            key: 'addedDate',
            width: '130px',
        },
        {
            title: 'Feedback Date',
            dataIndex: 'feedbackDate',
            key: 'feedbackDate',
            width: '160px',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: '100px',
        },
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
            width: '240px',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '200px',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: '100px',
        },
        {
            title: 'Feedback Status',
            dataIndex: 'feedbackStatus',
            key: 'feedbackStatus',
            width: '160px',
        },
        {
            title: 'Sales Rep',
            dataIndex: 'sales',
            key: 'sales',
            width: '100px',
        },
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
            width: '250px',
        },
        {
            title: 'Options',
            dataIndex: 'options',
            key: 'options',
            width: '250px',
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
            width: '250px',
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
            width: '400px',
        },
    ];
    
    useEffect(() => {
        getClientHappinessSurveyList(tableFilteredState);
    },[tableFilteredState]);

    const modifyResponseData = (data) => {
    return data.map((item) => ({...item,
        addedDate:item.addedDate.split(' ')[0],
        feedbackDate:item.feedbackDate.split(' ')[0]
    }))
    }
   
    const getClientHappinessSurveyList = useCallback(async (requestData) => {
        setLoading(true);
        let response = await clientHappinessSurveyRequestDAO.getClientHappinessSurveyListDAO(requestData);
        if (response?.statusCode === HTTPStatusCode.OK) {                 
            setClientHappinessSurveyList(modifyResponseData(response?.responseBody?.rows));
            setTotalRecords(response?.responseBody?.totalrows);
            setLoading(false);
          
        } else if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
            setLoading(false);
            setTotalRecords(0);
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
	}, [navigate]); 


    const onCalenderFilter = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);    

        if (start && end) {
			setTableFilteredState({
				...tableFilteredState,
				filterFields_HappinessSurvey: {
					StartDate: new Date(start).toLocaleDateString('en-US'),
					EndDate: new Date(end).toLocaleDateString('en-US'),
				},
			});
			getClientHappinessSurveyList({
				...tableFilteredState,
				filterFields_HappinessSurvey: {
					StartDate: new Date(start).toLocaleDateString('en-US'),
					EndDate: new Date(end).toLocaleDateString('en-US'),
				},
			});
		}

    };

    const debouncedSearchHandler = (e) => {
        setTableFilteredState({
            ...tableFilteredState,
            pagenum:1,
            filterFields_HappinessSurvey: {
                search: e.target.value,
            },
        });
        setDebouncedSearch(e.target.value)
        // setPageIndex(1)  
    };

  
	const clearFilters = useCallback(() => {
		// setAppliedFilters(new Map());
		// setCheckedState(new Map());
		setFilteredTagLength(0);
		// setTableFilteredState({
		// 	tableFilteredState:{...tableFilteredState,...{
		// 		pagesize: 100,
		// 		pagenum: 1,
		// 		sortdatafield: 'CreatedDateTime',
		// 		sortorder: 'desc',
		// 		searchText: '',
		// 	}},
		// 	filterFields_ViewAllHRs: {},
		// });
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
		// setEndDate(null)
		// setStartDate(null)
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

    const handleExport = () => {
		 downloadToExcel(clientHappinessSurveyList)
	}

  return (
    <>
    <div className={clienthappinessSurveyStyles.hiringRequestContainer}>
        <div className={clienthappinessSurveyStyles.addnewHR}>
            <div className={clienthappinessSurveyStyles.hiringRequest}>Client Happiness Survey</div>
            <div className={clienthappinessSurveyStyles.btn_wrap}>
                <div className={clienthappinessSurveyStyles.priorities_drop_custom}>
                    {/* {priorityCount?.length === 1 ? (
                        <button className={clienthappinessSurveyStyles.togglebtn}>
                            <span className={clienthappinessSurveyStyles.blank_btn}>
                                <img
                                    src={Prioritycount}
                                    alt="assignedCount"
                                />{' '}
                                Priority Count: <b>{`${priorityCount[0].assignedCount}`}</b>{' '}
                            </span>
                            <span className={clienthappinessSurveyStyles.blank_btn}>
                                <img
                                    src={Remainingcount}
                                    alt="remainingCount"
                                />{' '}
                                Remaining Count: <b>{`${priorityCount[0].remainingCount}`}</b>{' '}
                            </span>
                        </button>
                    ) : (
                        <button
                            className={clienthappinessSurveyStyles.togglebtn}
                            onBlur={() => setIsOpen(false)}
                            onClick={() => {
                                setIsOpen(!isOpen);
                            }}>
                            Priorities{' '}
                            <img
                                src={DownArrow}
                                alt="icon"
                            />
                        </button>
                    )} */}
                    {/* {isOpen && (
                        <div className={clienthappinessSurveyStyles.toggle_content}>
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
                    )} */}
                </div>
                <button type="button" className={clienthappinessSurveyStyles.btnPrimary}	
                    onClick={() => {
                        setGenerateLink(true);
                    }}>
                    Generate Link
                </button>
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
                        {/* <p onClick={()=> clearFilters() }>Reset Filters</p> */}
                    </div>

					<div className={clienthappinessSurveyStyles.filterRight}>

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

                        <div className={clienthappinessSurveyStyles.ratingFilterWrap}>
                            <div className={clienthappinessSurveyStyles.label}>Rating</div>
                            <div className={clienthappinessSurveyStyles.ratingFilter}>
                                <Select
                                    defaultValue="01"
                                    style={{ width: 42 }}
                                    dropdownMatchSelectWidth={false}
                                    // placement={placement}
                                    className="ratingNumber"
                                    options={[
                                    {
                                        value: '01',
                                        label: '01',
                                    },
                                    {
                                        value: '02',
                                        label: '02',
                                    },
                                    {
                                        value: '03',
                                        label: '03',
                                    },
                                    {
                                        value: '04',
                                        label: '04',
                                    },
                                    {
                                        value: '05',
                                        label: '05',
                                    },
                                    {
                                        value: '06',
                                        label: '06',
                                    },
                                    {
                                        value: '07',
                                        label: '07',
                                    },
                                    {
                                        value: '08',
                                        label: '08',
                                    },
                                    {
                                        value: '09',
                                        label: '09',
                                    },
                                    {
                                        value: '10',
                                        label: '10',
                                    },
                                    ]}
                                />  

                                <Select
                                    defaultValue="10"
                                    style={{ width: 42 }}
                                    dropdownMatchSelectWidth={false}
                                    className="ratingNumber"
                                    options={[
                                    {
                                        value: '01',
                                        label: '01',
                                    },
                                    {
                                        value: '02',
                                        label: '02',
                                    },
                                    {
                                        value: '03',
                                        label: '03',
                                    },
                                    {
                                        value: '04',
                                        label: '04',
                                    },
                                    {
                                        value: '05',
                                        label: '05',
                                    },
                                    {
                                        value: '06',
                                        label: '06',
                                    },
                                    {
                                        value: '07',
                                        label: '07',
                                    },
                                    {
                                        value: '08',
                                        label: '08',
                                    },
                                    {
                                        value: '09',
                                        label: '09',
                                    },
                                    {
                                        value: '10',
                                        label: '10',
                                    },
                                    ]}
                                />
                            </div>
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
									startDate={startDate}
									endDate={endDate}
									selectsRange
								/>
							</div>
						</div>
						{/* <div className={clienthappinessSurveyStyles.priorityFilterSet}>
							<div className={clienthappinessSurveyStyles.label}>Set Priority</div>
							<div
								className={clienthappinessSurveyStyles.priorityFilter}
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
                                                getClientHappinessSurveyList();
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
                                scroll={{ x: '100vw', y: '100vh' }} 
                                bordered={false} 
                                dataSource={clientHappinessSurveyList} 
                                columns={columns} 
                                pagination={
                                    search && search?.length === 0
                                        ? null
                                        : {
                                                onChange: (pageNum, pageSize) => {
                                                    setPageIndex(pageNum);
                                                    setPageSize(pageSize);                                               
                                                   
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
                                />;

                            </WithLoader>
                       )} 
         </div>
    </div>

    {isAllowFilters && (
				<Suspense fallback={<div>Loading...</div>}>
					<SurveyFiltersLazyComponent						
						setIsAllowFilters={setIsAllowFilters}						
						setFilteredTagLength={setFilteredTagLength}
						getHTMLFilter={getHTMLFilter}
                        filtersType={clientHappinessSurveyConfig.clientSurveyFilterTypeConfig()}
						clearFilters={clearFilters}
                        onRemoveSurveyFilters={onRemoveSurveyFilters}
					/>
				</Suspense>
			)}
    <Modal 
        transitionName=""
        className="commonModalWrap"
        centered
        open={generateLink}
        width="904px"
        footer={null}
        onCancel={() => {
            setGenerateLink(false);
        }}>

        <div className={`${clienthappinessSurveyStyles.engagementModalWrap} ${clienthappinessSurveyStyles.generateLinkModal}`}>
			<div className={`${clienthappinessSurveyStyles.headingContainer} ${clienthappinessSurveyStyles.addFeebackContainer}`}>
				<h1>Generate Link</h1>
			</div>

			<div className={clienthappinessSurveyStyles.row}>
				<div className={clienthappinessSurveyStyles.colMd12}>
                    <div className={clienthappinessSurveyStyles.InputGroup}>
                        {/* <HRInputField
                            register={register}
                            label={'Company'}
                            name="company"
                            type={InputType.TEXT}
                            placeholder="Suninda Solutions Pvt Ltd"
                        /> */}
                                <label>
                                    Company <b style={{ color: 'black' }}>*</b>
								</label>
								<Controller
									render={({ ...props }) => (
										<AutoComplete
											options={autoCompleteCompanyList}
											// onSelect={(clientName) => getClientNameValue(clientName)}
											filterOption={true}
											onSearch={(searchValue) => {
												getAutoCompleteComapany(searchValue);
											}}
											onChange={(company) => {
												setValue('company', company);
											}}
										/>
									)}
									// {...register('clientName', {
									// 	validate,
									// })}
									name="company"
									control={control}
									
								/>
                    
                    </div>
				</div>
                <div className={clienthappinessSurveyStyles.colMd12}>
                    <div className={clienthappinessSurveyStyles.InputGroup}>
                        <HRInputField
                            register={register}
                            label={'Client'}
                            name="client"
                            type={InputType.TEXT}
                            placeholder="Velma Balaji Reddy"
                        />
                    </div>
				</div>

                <div className={clienthappinessSurveyStyles.colMd12}>
                    <div className={clienthappinessSurveyStyles.InputGroup}>
                        <HRInputField
                            register={register}
                            label={'Email'}
                            name="email"
                            type={InputType.TEXT}
                            placeholder="sv@nuecluesx.io"                            
                        />
                    </div>
				</div>

				
			</div>

			<div className={clienthappinessSurveyStyles.formPanelAction}>
				<button
					className={clienthappinessSurveyStyles.btn} 
                    onClick={() => setGenerateLink(false)}
                    >
					Cancel
				</button>
                <button
					type="submit"
					// onClick={handleSubmit(submitEndEngagementHandler)}
					className={clienthappinessSurveyStyles.btnPrimary}>
					Generate Link
				</button>
			</div>
		</div>

    </Modal>
    
    </>
  )
}
export default ClienthappinessSurvey