import { InputType } from "constants/application";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Table } from "antd";
import { reportConfig } from 'modules/report/report.config';
import UTSRoutes from "constants/routes";
import { useNavigate } from "react-router-dom";
import i2sPopupStyle from "./i2sPopupModal.module.css";
import { HTTPStatusCode } from "constants/network";
// import SpinLoader from "shared/components/spinLoader/spinLoader";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { I2SReports } from "core/i2s/i2sDAO";
import {
	downloadToExcel
} from 'modules/report/reportUtils';
import moment from "moment";

const I2SPopupModal = ({
  closeHR,
  setUpdateTR,
  onCancel,
  popupData,
  apiData,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [listData, setListData] = useState([]);

  const tableColumnsMemo = useMemo(
    () =>
        reportConfig.i2spopupReportConfig(
            listData && listData,
        ),
    [listData],
);

  const i2sPopupDetail = async (data) => {
    setIsLoading(true);
    const response = await I2SReports.getI2SpopupReport(data);
    if (response.statusCode === HTTPStatusCode.OK) {
      let details = response.responseBody.details;

      console.log("popup report", details);
      setListData(details)
      setIsLoading(false);
    } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      setIsLoading(false);
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      setIsLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      setIsLoading(false);
      return "NO DATA FOUND";
    }
  };

  useEffect(() => {
    i2sPopupDetail(popupData);
  }, [popupData]);


  const exportHandler = (listData) => {
    let DataToExport =  listData.map(data => {
      let obj = {}
      tableColumnsMemo.map(val => obj[`${val.title}`] = data[`${val.key}`])
    return obj;
  }
     )

    downloadToExcel(DataToExport, `I2S_${moment().format('MMDDYYhhmm')}`)
  }

  return (
    <div className={i2sPopupStyle.engagementModalContainer}>
      <div className={i2sPopupStyle.i2sPopupTitle}>
        <h2> {popupData.i2SLabel}</h2>
        <div className={i2sPopupStyle.formPanelAction}>
          <button
            type="submit"
            className={i2sPopupStyle.btnPrimary}
            onClick={() => { listData && exportHandler(listData)}}
          >
            Export
          </button>
        </div>
      </div>

         {isLoading ? (
            <div style={{height:'200px', overflow:'hidden'}}>
        <TableSkeleton />
        </div>
      ) : (
        <Table
          id="i2sPopupTable"
          columns={tableColumnsMemo}
          bordered={false}
          dataSource={listData}
          scroll={{
            y: 400,
          }}
          pagination={false}
        />
      )}
     
      <div className={i2sPopupStyle.formPanelAction}>
        <button
          onClick={() => {
            onCancel();
          }}
          className={i2sPopupStyle.btn}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default I2SPopupModal;
