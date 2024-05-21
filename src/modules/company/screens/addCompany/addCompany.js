import React from 'react'
import AddNewClientStyle from './addclient.module.css';
import { ReactComponent as EditSVG } from "assets/svg/EditField.svg";

function AddCompany() {
  return (
    <div className={AddNewClientStyle.addNewContainer}>
			<div className={AddNewClientStyle.addHRTitle}>Add New Company/Client Details</div>

            <div className={AddNewClientStyle.tabsFormItem}>
      <div className={AddNewClientStyle.tabsFormItemInner}>
      <div className={AddNewClientStyle.tabsLeftPanel}>
          <h3>Basic Company Details</h3>
          {/* <p>Please provide the necessary details</p> */}
          <p>The Talents would be able to see <br/> fields highlighted in blue.</p>
        </div>

        <div className={AddNewClientStyle.tabsRightPanel}>
        <div className={AddNewClientStyle.row}>
        <div className={AddNewClientStyle.colMd12}>
              <div
                style={{
                  width: "145px",
                  height: "145px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "145px",
                    height: "145px",
                    backgroundColor: "#EBEBEB",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >         <p>Upload Company Logo</p>
                  {/* {!getUploadFileData ? (
                    // <p>Upload Company Logo</p>
                    <Avatar 
                    style={{ width: "100%",
                    height: "100%", display: "flex",alignItems: "center"}} 
                    size="large">
                      {companyDetail?.companyName?.substring(0, 2).toUpperCase()}
                      </Avatar>
                  ) : (
                    <img
                      style={{
                        width: "145px",
                        height: "145px",
                        borderRadius: "50%",
                      }}
                      src={
                        base64Image
                          ? base64Image
                          : NetworkInfo.PROTOCOL +
                            NetworkInfo.DOMAIN +
                            "Media/CompanyLogo/" +
                            getUploadFileData
                      }
                      alt="preview"
                    />
                  )} */}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{background:'var(--color-sunlight)',marginTop:'-25px',marginRight:'11px',display:'flex',padding:'2px',borderRadius:'50%',cursor:'pointer',zIndex:50}}>
                       <EditSVG
                  
                    width={24}
                    height={24}
                    onClick={() => {}}
                  /> 
                    </div>
                  
                </div>
              </div>
            </div>
            </div>
        </div>
        </div>
        </div>
    </div>
  )
}

export default AddCompany