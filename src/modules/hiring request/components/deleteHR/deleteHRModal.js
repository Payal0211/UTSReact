import React from "react";
import closeHRStyle from "./deleteHRModal.module.css";

const DeleteHRModal = ({
  onCancel,
  deleteHRDetail,
}) => {
  return (
    <div className={closeHRStyle.engagementModalContainer}>
      <div className={closeHRStyle.updateTRTitle}>
        <h2>Delete HR</h2>
        <h4>Are you sure you want to delete this HR?</h4>
      </div>  
        <>
          <div className={closeHRStyle.formPanelAction}>
            <button
              onClick={() => {
                onCancel();
              }}
              className={closeHRStyle.btn}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={closeHRStyle.btnPrimary}
              onClick={deleteHRDetail}
            >
              Delete HR
            </button>
          </div>
        </>
 
    </div>
  );
};

export default DeleteHRModal;
