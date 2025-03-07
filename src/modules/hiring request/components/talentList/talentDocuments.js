import { Skeleton, Divider, Tooltip } from "antd";
import TalentListStyle from "./talentList.module.css";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import { engagementRequestDAO } from "core/engagement/engagementDAO";
import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { IconContext } from "react-icons";

export default function TalentListDocuments({ talentID,companyId }) {
  const [documentsList, setDocumentsList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const getDocumentsDetails = async (talentID) => {
    setLoading(true);
    const result = await engagementRequestDAO.viewDocumentsDetailsDAO(talentID,companyId);
    setLoading(false);

    if (result.statusCode === HTTPStatusCode.OK) {
      setDocumentsList(result.responseBody.details);
    }
    if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
      setDocumentsList([]);
    }
  };

  useEffect(() => {
    getDocumentsDetails(talentID);
  }, [talentID]);


  return (
    <div>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <>
          {documentsList.length > 0 && (
            <>
              <Divider
                style={{
                  margin: "10px 0",
                  // border: `1px solid var(--uplers-border-color)`,
                }}
              />
              <ul>
                {documentsList.map((doc) => (
                  <li>
                    <div className={TalentListStyle.interviewSlots}>
                      <span>{doc?.documentType}:</span>&nbsp;&nbsp;
                      <span style={{ fontWeight: "500" }}>
                        {doc?.documentName?.length > 20 ?
                          `${doc?.documentName?.substring(0, 20)}...` : doc?.documentName}
                      </span>
                      <span style={{ marginLeft: "auto" }}>
                        <IconContext.Provider
                          value={{
                            color: "green",
                            style: {
                              width: "15px",
                              height: "15px",
                              cursor: "pointer",
                            },
                          }}
                        >
                          {" "}
                          <Tooltip title="Download" placement="top">
                            <span
                              // style={{
                              //   background: 'green'
                              // }}
                              onClick={() =>
                                window.open(
                                  `${NetworkInfo.NETWORK}Media/TalentDocuments/${doc?.unique_FileName}`,
                                  "_blank"
                                )
                              }
                            >
                              {" "}
                              <FaDownload />
                            </span>{" "}
                          </Tooltip>
                        </IconContext.Provider>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
