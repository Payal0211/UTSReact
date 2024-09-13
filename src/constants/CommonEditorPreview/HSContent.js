import React, { useEffect } from 'react';
import "../CommonEditorPreview/hsContent.css";

const HSContent = ({ data }) => {
  useEffect(() => {
    const styleTag = document.querySelector('style[data-custom-style]'); 
    if (styleTag) {
      styleTag.parentNode.removeChild(styleTag);
    }
  }, []);

  return (
    <div className='HSContentWrap'>
      <div
        className="HSContent"
        id="hsContent"
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </div>
  );
};

export default HSContent;
