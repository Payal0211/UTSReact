import React, {
  Fragment,
  useState,
  useMemo,
  Suspense,
  useEffect,
  useRef,
} from "react";
import ActivityFeedStyle from "../hiring request/components/activityFeed/activityFeed.module.css";
import moment from "moment";
import { DateTimeUtils } from "shared/utils/basic_utils";
import { SlGraph } from "react-icons/sl";
import { BsTag } from "react-icons/bs";
import {
  Divider,
  TabsProps,
  Space,
  Table,
  Tag,
  Modal,
  Skeleton,
  Tooltip,
} from "antd";
import infoIcon from "assets/svg/info.svg";
import DOMPurify from "dompurify";
import Editor from "modules/hiring request/components/textEditor/editor";
import { engagementRequestDAO } from "core/engagement/engagementDAO";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";

export default function OnboardNotes({ onboardID, getOnboardFormDetails }) {
  const [loading, setLoading] = useState(false);
  const [UsersToTag, setUsersToTag] = useState([]);
  const [notesData, setNotesData] = useState([]);
  const observerRef = useRef();

  const getNotes = async (id) => {
    setLoading(true);
    const response = await engagementRequestDAO.viewOnboardNotesDetailsDAO(id);
    setLoading(false);
    console.log(response);
    if (response.statusCode === 200) {
      setUsersToTag(
        response.responseBody.details.UsersToTag.map((usr) => ({
          Disabled: usr.disabled,
          Group: usr.group,
          Selected: usr.selected,
          Text: usr.text,
          Value: usr.value,
        }))
      );
      if (response.responseBody.details.Notes.length) {
        setNotesData(response.responseBody.details.Notes);
      } else {
        setNotesData([]);
      }
    } else {
      setNotesData([]);
    }
  };

  useEffect(() => {
    getNotes(onboardID);
  }, [onboardID]);
  console.log("getOnboardFormDetails", getOnboardFormDetails);
  const saveNote = async (note) => {
    setLoading(true);
    let payload = {
      id: 0,
      notes: note,
      onBoardID: onboardID,
      talentID: getOnboardFormDetails?.talentID,
      hiringRequestID: getOnboardFormDetails?.hR_ID,
    };
    const response = await engagementRequestDAO.saveOnboardNotesDetailsDAO(
      payload
    );
    setLoading(false);

    if (response.statusCode === 200) {
      getNotes(onboardID);
    }
  };

  const sanitizer = DOMPurify.sanitize;
  const displayNotes = (notes) => {
    const notesTemplate = new DOMParser().parseFromString(notes, "text/html");
    return notesTemplate.body;
  };

  const notesColumns = useMemo(() => {
    return [
      {
        title: "Created On",
        dataIndex: "createdByDateTime",
        key: "createdByDateTime",
        align: "left",
        width: "150px",
        render: (text) => {
          return (
            <>
              {moment(text).format("DD/MM/YYYY")}
              <br />
              {moment(text).format("hh:mm A")}
            </>
          );
        },
      },
      {
        title: "Notes",
        dataIndex: "notes",
        key: "notes",
        align: "left",
        render: (text) => {
          return <div dangerouslySetInnerHTML={{ __html: text }}></div>;
        },
      },
      {
        title: "Tagged Users",
        dataIndex: "taggedUsers",
        key: "taggedUsers",
        align: "left",
        width: "200px",
      },
      {
        title: "Added By",
        dataIndex: "noteAddedBy",
        key: "noteAddedBy",
        align: "left",
        width: "160px",
      },
    ];
  }, [notesData]);

  return (
    <div className={ActivityFeedStyle.contentGrid}>
      <Suspense>
        <div style={{ position: "relative", marginBottom: "10px" }}>
          {!loading && (
            <Editor
              tagUsers={UsersToTag && UsersToTag}
              hrID={getOnboardFormDetails?.hR_ID}
              saveNote={(note) => saveNote(note)}
            />
          )}
        </div>
      </Suspense>

      {loading ? (
        <TableSkeleton />
      ) : (
        <Table
          scroll={{ y: "100vh" }}
          dataSource={notesData ? notesData : []}
          columns={notesColumns}
          pagination={false}
        />
      )}
    </div>
  );
}
