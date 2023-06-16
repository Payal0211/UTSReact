import { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, Tag, Radio } from 'antd';
import slaReportStyle from './slaReportFilter.module.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { ReactComponent as ArrowRightSVG } from 'assets/svg/arrowRight.svg';
import { ReactComponent as CrossSVG } from 'assets/svg/cross.svg';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { InputType } from 'constants/application';

const SlaReportFilerList = ({
  setAppliedFilters,
  appliedFilter,
  setCheckedState,
  setFilteredTagLength,
  onRemoveHRFilters,
  checkedState,
  filtersType,
  getHTMLFilter,
  handleHRRequest,
  setTableFilteredState,
  tableFilteredState,
  setSlaReportDetailsState,
  slaReportDetailsState,
  getSlaReportDetailsState,
}) => {
  const [toggleBack, setToggleBack] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [filterSubChild, setFilterSubChild] = useState(null);


  useEffect(() => {
    getHTMLFilter ?
      setTimeout(() => {
        document.querySelector(`.${slaReportStyle.aside}`).classList.add(`${slaReportStyle.closeFilter}`)
      }, 300) :
      document.querySelector(`.${slaReportStyle.aside}`).classList.remove(`${slaReportStyle.closeFilter}`)
  }, [getHTMLFilter])

  const toggleFilterSubChild = (item) => {
    setToggleBack(true);
    setFilterSubChild(item);
  };

    const handleAppliedFilters = useCallback(
        (isChecked, filterObj) => {
            let tempAppliedFilters = new Map(appliedFilter);
            let tempCheckedState = new Map(checkedState);
            console.log(isChecked,"filterObj");
            console.log(tempCheckedState,"tempCheckedState");
            if (isChecked) {
                tempCheckedState.set(`${filterObj.filterType}${filterObj.id}`, true);
                setFilteredTagLength((prev) => prev + 1);
            } else {
                tempCheckedState.set(`${filterObj.filterType}${filterObj.id}`, false);
                setFilteredTagLength((prev) => prev - 1);
            }
            if (tempAppliedFilters.has(filterObj.filterType)) {
                let filterAddress = tempAppliedFilters.get(filterObj.filterType);
                if (isChecked) {
                    if(filterSubChild?.label === "Engagement Tenure"){
                        filterAddress.value = filterAddress?.value ;
                        filterAddress.id = filterAddress.id;
                        tempAppliedFilters.set(filterObj.filterType, filterAddress);
                    }else{
                        filterAddress.value = filterAddress?.value + ',' + filterObj.value;
                        filterAddress.id = filterAddress.id + ',' + filterObj.id;
                        tempAppliedFilters.set(filterObj.filterType, filterAddress);
                    }
                } else {
                    let splittedID = filterAddress.id.split(',');
                    let splittedIDIndex = splittedID.indexOf(filterObj.id);
                    splittedID = [
                        ...splittedID.slice(0, splittedIDIndex),
                        ...splittedID.slice(splittedIDIndex + 1),
                    ];
                    let splittedValue = filterAddress.value.split(',');
                    let splittedValueIndex = splittedValue.indexOf(filterObj.value);
                    splittedValue = [
                        ...splittedValue.slice(0, splittedValueIndex),
                        ...splittedValue.slice(splittedValueIndex + 1),
                    ];
                    filterAddress.value = splittedValue.toString();
                    filterAddress.id = splittedID.toString();
                    splittedID.length === 0
                        ? tempAppliedFilters.delete(filterObj.filterType)
                        : tempAppliedFilters.set(filterObj.filterType, filterAddress);
                }
            } else {
                tempAppliedFilters.set(filterObj.filterType, filterObj);
            }
            setAppliedFilters(tempAppliedFilters);
            setCheckedState(tempCheckedState);
        },
        [appliedFilter, checkedState, setFilteredTagLength],
    );
// Clear filter
  const clearFilters = useCallback(() => {
    setAppliedFilters(new Map());
    setCheckedState(new Map());
    setFilteredTagLength(0);
    setTableFilteredState({
      totalrecord: 100,
      pagenumber: 1,
      isExport: false,
      filterFieldsSLA: {
          startDate: "2023-06-01",
          endDate: "2023-06-30",
          hrid: 0,
          sales_ManagerID: 0,
          ops_Lead: 0,
          salesPerson: 0,
          stages: "",
          isAdHoc: 0,
          role: "",
          slaType: 0,
          type: 0,
          hR_Number: "",
          company: "",
          actionFilter: 0,
          stageIDs:"",
				actionFilterIDs:"",
				CompanyIds:"",
          // ambdr: 0
      }
    });
    setSlaReportDetailsState({
        totalrecord: 100,
        pagenumber: 1,
        isExport: false,
        filterFieldsSLA: {
            startDate: "2023-06-01",
            endDate: "2023-06-30",
            hrid: 0,
            sales_ManagerID: 0,
            ops_Lead: 0,
            salesPerson: 0,
            stages: "",
            isAdHoc: 0,
            role: "",
            slaType: 0,
            type: 0,
            hR_Number: "",
            company: "",
            actionFilter: 0,
            stageIDs:"",
				actionFilterIDs:"",
				CompanyIds:"",
            // ambdr: 0
        }
    });
    onRemoveHRFilters()
    // setSlaReportDetailsState(reqFilter);
  }, [
    handleHRRequest,
    setAppliedFilters,
    setCheckedState,
    setFilteredTagLength,
    setTableFilteredState,
    setSlaReportDetailsState,
    tableFilteredState,
  ]);
// OnClick for apply filter
  const handleFilters = useCallback(() => {

    let filters = {};
    appliedFilter.forEach((item) => {
      filters = { ...filters, [item.filterType]: item?.value };
    });
    // setTableFilteredState({
    //   ...tableFilteredState,
    //   //  ...filters ,
    // });
    // const reqFilter = {
    //   ...tableFilteredState,
    // };
    // console.log(reqFilter,"sasdasdasdasdasd")
    
    for (let key in filters) {
      const newState = { ...slaReportDetailsState };
      newState.filterFieldsSLA[key] = filters[key];
      setSlaReportDetailsState(newState);
      handleHRRequest(newState);
    }
    onRemoveHRFilters()
}, [
    appliedFilter,
    handleHRRequest,
    setTableFilteredState,
    setSlaReportDetailsState,
    slaReportDetailsState,
    tableFilteredState,
]);

  const slaFilterSearch = (e, data) => {
    let filteredData = data.filter((val) => {
      return val?.text?.toLowerCase().includes(e.target.value.toLowerCase());
    });
    return filteredData;
  }

  const filteredTags = useMemo(() => {
    if (appliedFilter.size > 0) {
      return Array.from(appliedFilter?.values()).map((item) => {
        const splittedTags = item?.value.split(',');
        const splittedIDs = item?.id.split(',');
        if (splittedTags.length > 0) {
          return splittedTags?.map((splittedItem, index) => {
            return (
              <Tag
                key={`${item.filterType}_${splittedIDs[index]}`}
                closable={true}
                onClose={(e) => {
                  e.preventDefault();
                  handleAppliedFilters(false, {
                    filterType: item?.filterType,
                    value: splittedItem,
                    id: splittedIDs[index],
                  });
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  backgroundColor: `var(--color-sunlight)`,

                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '.8rem',
                  margin: '0',
                  fontWeight: '600',
                  padding: '10px 20px',
                }}>
                {splittedIDs[index]}&nbsp;
              </Tag>
            );
          });
        }
        return (
          <Tag
            key={`${item.filterType}_${item?.id}`}
            closable={true}
            onClose={(e) => {
              e.preventDefault();
              handleAppliedFilters(false, {
                filterType: item?.filterType,
                value: item.value,
                id: item.id,
              });
            }}
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              backgroundColor: `var(--color-sunlight)`,
              border: 'none',
              borderRadius: '10px',
              fontSize: '.8rem',
              margin: '0',
              fontWeight: '600',
              padding: '10px 20px',
            }}>
            {item?.value}&nbsp;
          </Tag>
        );
      });
    }
  }, [appliedFilter, handleAppliedFilters]);

  return (
    <aside className={slaReportStyle.aside}>
      <div className={slaReportStyle.asideBody}>
        <div className={toggleBack ? slaReportStyle.asideHead : ""}>
          {toggleBack && (
            <span
              className={slaReportStyle.goback}
              onClick={() => {
                setToggleBack(false);
                setSearchData([]);
              }}
            >
              <ArrowLeftSVG />
              &nbsp;&nbsp; Go back
            </span>
          )}
          <span
            style={{
              display: "flex",
              justifyContent: "end",
              cursor: "pointer",
            }}
          >
            <CrossSVG
              style={{ width: "26px" }}
              onClick={() => {
                onRemoveHRFilters();
              }}
            />
          </span>
        </div>

        <div className={slaReportStyle.asideFilters}>
          {toggleBack ? (
            <>
              <span className={slaReportStyle.label}>
                {filterSubChild?.label}
              </span>
              <br />
              {filterSubChild?.isSearch && (
                <div className={slaReportStyle.searchFiltersList}>
                  <AiOutlineSearch
                    style={{ fontSize: "20px", fontWeight: "800" }}
                  />
                  <input
                    className={slaReportStyle.searchInput}
                    type={filterSubChild?.label === "Engagement Tenure"?InputType.NUMBER:InputType.TEXT}
                    id="search"
                    placeholder={`Search ${filterSubChild?.label}`}
                    onChange={(e) => {
                      return setSearchData(
                        slaFilterSearch(e, filterSubChild?.child)
                      );
                    }}
                  />
                </div>
              )}
              <br />

                <div className={slaReportStyle.filtersListType}>
                  { searchData && searchData.length > 0 ? (
                    searchData.map((item, index) => {
                      return (
                        <div
                          className={slaReportStyle.filterItem}
                          key={index}>
                          <Checkbox
                          // disabled={
                          //   appliedFilter?.get(`${filterSubChild.name}`) &&
                          //   !checkedState.get(
                          //     `${filterSubChild.name}${item.text}`,
                          //   )
                          // }
                            checked={checkedState.get(
                              `${filterSubChild?.name}${item.text}`,
                            )}
                            onChange={(e) => {
                              handleAppliedFilters(e.target.checked, {
                                filterType: filterSubChild?.name,
                                value: item?.value,
                                id: item?.text,
                              })
                            }}
                            id={item?.value + `/${index + 1}`}
                            style={{
                              fontSize: `${!item.label && '1rem'}`,
                              fontWeight: '500',
                            }}>
                            {item.text}
                          </Checkbox>
                        </div>
                      );
                    })
                  ) : (
                    <>
                      {filterSubChild?.child?.map((item, index) => {
                        return (
                          <div
                            className={slaReportStyle.filterItem}
                            key={index}
                          >
                            <Checkbox
                            // disabled={
														// 	appliedFilter?.get(`${filterSubChild.name}`) &&
														// 	!checkedState.get(
														// 		`${filterSubChild.name}${item.text}`,
														// 	)
														// }
                              checked={checkedState.get(
                                `${filterSubChild?.name}${item.text}`
                              )}
                              onChange={(e) => {
                                handleAppliedFilters(e.target.checked, {
                                  filterType: filterSubChild?.name,
                                  value: item?.value,
                                  id: item?.text,
                                });
                              }}
                              id={item?.value + `/${index + 1}`}
                              style={{
                                fontSize: `${!item.label && "1rem"}`,
                                fontWeight: "500",
                              }}
                            >
                              {item.text}
                            </Checkbox>
                          </div>
                        );
                      })}
                  </>
                  )}
              </div>
            </>
          ) : (
            <>
              <span className={slaReportStyle.label}>Filters</span>
              <div className={slaReportStyle.filtersChips}>
                {filteredTags}
              </div>
              <div className={slaReportStyle.filtersListType}>
                {filtersType.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={slaReportStyle.filterItem}
                      onClick={() => toggleFilterSubChild(item)}
                    >
                      <span style={{ fontSize: "1rem" }}>{item.label}</span>
                      <ArrowRightSVG style={{ width: "26px" }} />
                    </div>
                  );
                })}
              </div>
            </>
          )}
          <br />
          <br />
          <hr />
          <div className={slaReportStyle.operationsFilters}>
            <button
              className={slaReportStyle.clearAll}
              onClick={clearFilters}
            >
              Clear All
            </button>
            <button
              className={slaReportStyle.applyFilters}
              onClick={handleFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SlaReportFilerList;
