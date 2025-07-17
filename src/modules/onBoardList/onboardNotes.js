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
import { allCompanyRequestDAO } from "core/company/companyDAO";

export default function OnboardNotes({ onboardID, getOnboardFormDetails }) {
  const [loading, setLoading] = useState(false);
  const [UsersToTag, setUsersToTag] = useState([]);
  const [notesData, setNotesData] = useState([]);
  const observerRef = useRef();

  const getNotes = async (id) => {
    setLoading(true);
    const response = await engagementRequestDAO.viewOnboardNotesDetailsDAO(id);
    setLoading(false);
    // console.log(response);
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
 

  const base64ToBlob = (base64Data, contentType = '') => {
    const byteString = atob(base64Data.split(',')[1]);
    const byteArrays = [];
  
    for (let i = 0; i < byteString.length; i++) {
      byteArrays.push(byteString.charCodeAt(i));
    }
  
    return new Blob([new Uint8Array(byteArrays)], { type: contentType });
  };

  const base64ToFile = async (base64, filename) => {
    const mimeType = base64.match(/data:(.*?);base64/)[1]; // Extract MIME type
    const blob = base64ToBlob(base64, mimeType);
    const file = new File([blob], filename, { type: mimeType });  
    return file;
  };

  const saveNote = async (note) => {
    setLoading(true); 
    let payload = {
      id: 0,
      notes: note,
      onBoardID: +onboardID,
      talentID: getOnboardFormDetails?.talentID,
      hiringRequestID: getOnboardFormDetails?.hR_ID,
    };

    const imgTags = note?.match(/<img[^>]*>/g) || [];
    const list = [];
    const base64Srcs = []; 
    
    for (const imgTag of imgTags) {
      if (!imgTag) continue;
  
      const srcMatch = imgTag.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        const src = srcMatch[1];
        const filename = src.split('/').pop();
        const timestamp = new Date().getTime();
        const name = filename.split(/\.(?=[^\.]+$)/);
        const uniqueFilename = `${name}_${timestamp}`;
        if (src.startsWith('data:image/')) {
          base64Srcs.push(src)
          const file = await base64ToFile(src, uniqueFilename);
          list.push(file);
        }
      }
    }
  
    if(list.length>0){
      const formData = new FormData();
      list.forEach(file => formData.append("Files", file));
      formData.append('IsCompanyLogo', false);
      formData.append('IsCultureImage', false);
      formData.append("Type", "eng_notes");

      let Result = await allCompanyRequestDAO.uploadImageDAO(formData);
      const uploadedUrls = Result?.responseBody || [];
      let updatedContent = note;
  
      base64Srcs.forEach((src, index) => {
        if (uploadedUrls[index]) {
          const escapedSrc = src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
          const regex = new RegExp(`src="${escapedSrc}"`, 'g');
          updatedContent = updatedContent.replace(regex, `src="${uploadedUrls[index]}"`);
        }
      });
      payload.notes = updatedContent 
    }

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
              allowAttachment={true}
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
