import { Modal, Table } from "antd";
import CompanyDetailsStyle from "./companyDetails.module.css";
import greenArrowLeftImage from "assets/svg/greenArrowLeft.svg";
import redArrowRightImage from "assets/svg/redArrowRight.svg";
const CreditTransactionHistoryModal = ({creditTransactionModal,setTransactionModal,creditTransactionData}) =>{
    const dataSource = creditTransactionData?.map((data,index)=>({
        key: index,
        date: data?.actionDate,
        description: <div className="userThumbWrap">{data?.actionDescription}</div>,
        role: data?.jobRole,
        status: (
          <div className="userThumbWrap">
            <span class="green">
              {data?.hrStatus.toLowerCase() === "completed"
                ? "Paid"
                : data?.hrStatus}
            </span>{" "}
          </div>
        ),
        credits: (
          <div className="balanceCredit">
            <h4>
              {data?.creditSpent}{" "}
              <img
                src={
                  data?.creditDebit.toLowerCase() === "credit"
                    ? greenArrowLeftImage
                    : redArrowRightImage
                }
                alt="icon"
              />
            </h4>
            <p>{data?.creditBalanceAfterSpent}</p>
          </div>
        ),
    }))
      
      const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Job Role/Package",
            dataIndex: "role",
            key: "role",
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
          },
          {
            title: "Credits Spent",
            dataIndex: "credits",
            key: "credits",
        },
      ];
      
    return(
        <Modal
				width={'1200px'}
				centered
				footer={false}
				open={creditTransactionModal}
				className="creditTransactionModal"
				onOk={() => setTransactionModal(false)}
				onCancel={() => setTransactionModal(false)}
			>
				<h2>Credits Transaction History</h2>
				 <div className={CompanyDetailsStyle.creditTransactionContent}>
            <Table dataSource={dataSource} columns={columns} className="CustomTable"/>
				</div>
			</Modal>
    )
}

export default CreditTransactionHistoryModal;