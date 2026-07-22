import React from 'react';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import stylesOBj from './scrumStructure.module.css';
import {Popover, Divider, Button,   Space,
    Typography,
    Descriptions,
    Tooltip,
    message,} from 'antd'


import {
    CopyOutlined,
    ExportOutlined,
    LinkOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
export function HrStatusCell(props) {
    const { data } = props;
    return <div style={{display:'flex',justifyContent:'center',alignItems:"center",height:'100%'}}>{All_Hiring_Request_Utils.GETHRSTATUS(data?.tA_HR_StatusID, data?.tA_HR_Status)}</div>;
}

export function LatestNotesCell(props) {
    const { value,data } = props;
    const { AddComment, getRowIndex } = props.context;
    const i = getRowIndex(data);

    return (
        <div style={{lineHeight:'20px'}}>{data?.latestNotesTopRow?.length > 50 ? `${data?.latestNotesTopRow?.slice(0,50)}...`: data?.latestNotesTopRow}</div>
        // <button
        //     className={stylesOBj['cell-add-btn']}
        //     onClick={(e) => {
        //         e.stopPropagation();
        //         AddComment(data, i);
        //     }}
        // >
        //     {data?.latestNotes ? 'View / Edit' : 'Add'}
        // </button>
    );
}

export function LatestTouchCell (props){
    const { value,data } = props;
    const { AddComment, getRowIndex } = props.context;
    const i = getRowIndex(data);

    return (
        <div style={{lineHeight:'20px'}}>{data?.touchBasedNotesTopRow?.length > 50 ? `${data?.touchBasedNotesTopRow?.slice(0,50)}...`: data?.touchBasedNotesTopRow}</div>
     
    );
}

export const getGoogleFileId = (url) => {
    const patterns = [
        /\/file\/d\/([^/]+)/,
        /\/spreadsheets\/d\/([^/]+)/,
        /\/document\/d\/([^/]+)/,
        /\/presentation\/d\/([^/]+)/,
    ];

    for (const p of patterns) {
        const match = url.match(p);
        if (match) return match[1];
    }

    return null;
};

export const getPreviewUrl = (url) => {
    const fileId = getGoogleFileId(url);

    if (!fileId) return null;

    return `https://drive.google.com/file/d/${fileId}/preview`;
};

export const getDomain = (url) => {
    try {
        return new URL(url).hostname;
    } catch {
        return "";
    }
};


export default function PreviewCard({
    url,
    fileName,
    owner,
    modifiedDate,
    type,
}) {

    const previewUrl = getPreviewUrl(url);

    return (
        <div
            style={{
                width: "100%",
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                }}
            >

                <Space>

                    <img
                        src={`https://www.google.com/s2/favicons?domain=${getDomain(
                            url
                        )}&sz=64`}
                        width={20}
                        alt=""
                    />

                    <Text strong>
                        {fileName || "Preview"}
                    </Text>

                </Space>

                <Space>

                    <Tooltip title="Copy Link">

                        <Button
                            type="text"
                            icon={<CopyOutlined />}
                            onClick={() => {
                                navigator.clipboard.writeText(url);
                                message.success("Copied");
                            }}
                        />

                    </Tooltip>

                    <Tooltip title="Open Original" style={{marginRight:'10px'}}>

                        <Button
                            type="text"
                            icon={<ExportOutlined />}
                            onClick={() =>
                                window.open(url, "_blank")
                            }
                            style={{marginRight:'10px'}}
                        />

                    </Tooltip>

                </Space>

            </div>

            {/* PREVIEW */}

            {previewUrl ? (

                <iframe
                    src={previewUrl}
                    width="100%"
                    height="250"
                    style={{
                        border: 0,
                        borderRadius: 8,
            //                width: "125%",
            // height: "125%",
            // transform: "scale(0.6)",
            // transformOrigin: "top left",
                    }}
                />

            ) : (

                <div
                    style={{
                        height: 250,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >

                    <Button
                        type="primary"
                        icon={<LinkOutlined />}
                        onClick={() =>
                            window.open(url)
                        }
                    >
                        Open Link
                    </Button>

                </div>

            )}

            <Divider />


        </div>
    );
}

export function SubmissionSheetCell (props){
    const { value,data } = props;
    const { AddComment, getRowIndex } = props.context;
    const i = getRowIndex(data);

    return (
        // <div style={{lineHeight:'20px'}}><a target="__blank" href={value}>{value?.length > 50 ? `${value?.slice(0,50)}...`: value}</a> </div>
   <Popover
      placement="leftTop"
    overlayStyle={{
        width: 550,
        maxWidth: "600",
    }}
    trigger="hover"
    mouseEnterDelay={0.4}
    // content={<GooglePreview url={value} />}
     content={<PreviewCard url={value} fileName={data.submissionSheetFileName} />}
>
    <div style={{lineHeight:'20px'}}>
  <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        
    >
        {data.submissionSheetFileName ? data.submissionSheetFileName :  value?.length > 50 ? `${value?.slice(0,50)}...`: value}
    </a>
    </div>
  
</Popover>
    );
}
