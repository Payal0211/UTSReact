import React, { useEffect, useState, useMemo, useCallback } from "react";
import AddNewClientStyle from "../../modules/client/screens/addnewClient/add_new_client.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import {
  Avatar,
  Tabs,
  Table,
  Skeleton,
  Checkbox,
  message,
  Modal,
  Select,
} from "antd";

import { engagementRequestDAO } from "core/engagement/engagementDAO";
import EngagementOnboard from "modules/engagement/screens/engagementOnboard/engagementOnboard";

export default function ViewOnBoardDetails() {
  const [title, setTitle] = useState("OnBoard Details");
  const { onboardID } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [getOnboardFormDetails, setOnboardFormDetails] = useState({});
  const [allBRPRlist, setAllBRPRList] = useState([]);

  const columns = useMemo(() => {
    return [
      {
        title: "Months",
        dataIndex: "monthNames",
        key: "monthNames",
        align: "left",
        render: (value, data) => {
          return `${data.monthNames} ( ${data.years} )`;
        },
      },
      {
        title: "Contract Type",
        dataIndex: "contractType",
        key: "contractType",
        align: "left",
        render: (value, data) => {
          return value;
        },
      },
      {
        title: "BR",
        dataIndex: "br",
        key: "br",
        align: "left",
        render: (value, data) => {
          return value;
        },
      },
      {
        title: "PR",
        dataIndex: "pr",
        key: "pr",
        align: "left",
        render: (value, data) => {
          return value;
        },
      },
      {
        title: "NR",
        dataIndex: "nR_DP_Value",
        key: "nR_DP_Value",
        align: "left",
      },
      {
        title: "NR%",
        dataIndex: "actual_NR_Percentage",
        key: "actual_NR_Percentage",
        align: "left",
      },
    ];
  }, [allBRPRlist]);

  const getAllBRPRTableData = async (onboardID) => {
    let result = await engagementRequestDAO.getAllBRPRListDAO(onboardID);
    // console.log("getAllBRPRTableData",result)
    if (result.statusCode === HTTPStatusCode.OK) {
      setAllBRPRList(result.responseBody);
    }
  };

  const getOnboardingForm = async (getOnboardID) => {
    setOnboardFormDetails({});
    setLoading(true);
    const response = await engagementRequestDAO.viewOnboardDetailsDAO(
      getOnboardID
    );
    if (response?.statusCode === HTTPStatusCode.OK) {
      setOnboardFormDetails(response?.responseBody?.details);
      setLoading(false);
    } else {
      setOnboardFormDetails({});
      setLoading(false);
    }
  };

  useEffect(() => {
    if (onboardID !== undefined) {
      getOnboardingForm(onboardID);
      getAllBRPRTableData(onboardID);
    }
  }, [onboardID]);

  const DetailComp = () => {
    return (
      <div className={AddNewClientStyle.onboardDetailsContainer}>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <EngagementOnboard
            getOnboardFormDetails={getOnboardFormDetails}
            getHRAndEngagementId={{
              onBoardId: onboardID,
              talentName: `${getOnboardFormDetails?.onboardContractDetails?.talentName} (${getOnboardFormDetails?.onboardContractDetails?.talentEmail})`,
            }}
            getOnboardingForm={getOnboardingForm}
          />
        )}
      </div>
    );
  };

  const HrsDetails = () => {
    return (
      <div className={AddNewClientStyle.onboardDetailsContainer}>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <Table
            scroll={{ y: "100vh" }}
            dataSource={allBRPRlist ? allBRPRlist : []}
            columns={columns}
            pagination={false}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className={AddNewClientStyle.addNewContainer}>
        <div className={AddNewClientStyle.addHRTitle}>Engagement Report Details</div>

        <Tabs
          onChange={(e) => setTitle(e)}
          defaultActiveKey="1"
          activeKey={title}
          animated={true}
          tabBarGutter={50}
          tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
          items={[
            {
              label: "OnBoard Details",
              key: "OnBoard Details",
              children: <DetailComp />,
            },
            {
              label: "BR PR Details",
              key: "BR PR Details",
              children: <HrsDetails />,
            },
            // companyPreviewData?.engagementDetails?.companyTypeID && {
            //   label: "Credit Utilize",
            //   key: "Credit Utilize",
            //   children: <CredUtilize />,
            // },
          ]}
        />
      </div>
    </>
  );
}
