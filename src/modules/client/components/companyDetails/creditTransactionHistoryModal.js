import { Modal, Table } from "antd";
import CompanyDetailsStyle from "./companyDetails.module.css";
import greenArrowLeftImage from "assets/svg/greenArrowLeft.svg";
import redArrowRightImage from "assets/svg/redArrowRight.svg";
const CreditTransactionHistoryModal = ({creditTransactionModal,setTransactionModal,creditTransactionData}) =>{

  // const getInvoiceDetailsModal = async(paymentHistoryID)=>{
  //   setIsLoading(true);
  //   let response = await getInvoiceDetail(paymentHistoryID);
  //   if(response?.responseBody?.statusCode === 200){
  //     setViewInvoiceModal(true)
  //     getInvoiceDetails(response?.responseBody?.details)
  //   }
  //   setIsLoading(false);
  // }
    const dataSource = creditTransactionData?.map((data,index)=>({
        key: index,
        date: data?.actionDate,
        description: <div className="userThumbWrap">{data?.actionDescription}</div>,
        role: data?.jobRole,
        // status: (
        //   <div className="userThumbWrap">
        //     <span class="green">
        //       {typeof data?.hrStatus === 'string' && data?.hrStatus.toLowerCase() === "completed"
        //         ? "Paid"
        //         : data?.hrStatus}
        //     </span>{" "}
        //   </div>
        // ),
        status: (
          <div className={CompanyDetailsStyle.userThumbWrap}>
          {data.creditDebit ==="Credit"?<span className="green">
              {/* {data?.hrStatus?.toLowerCase() === "completed"
                ? "Paid"
                : data?.hrStatus} */}
                {data.creditDebit}
            </span>:<span className="red">
              {/* {data?.hrStatus?.toLowerCase() === "completed"
                ? "Paid"
                : data?.hrStatus} */}
                {data.creditDebit}
            </span> }
            {/* {data?.paymentHistoryID > 0  && (
              <a class="viewJob" href="#" onClick={() => getInvoiceDetailsModal(data?.paymentHistoryID)}>
                View Invoice
              </a>
            )}{" "} */}
          </div>
        ),
        creditDebit:data.creditDebit,
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
      
      // const columns = [
      //   {
      //       title: "Date",
      //       dataIndex: "date",
      //       key: "date",
      //     },
      //     {
      //       title: "Description",
      //       dataIndex: "description",
      //       key: "description",
      //     },
      //     {
      //       title: "Job Role/Package",
      //       dataIndex: "role",
      //       key: "role",
      //     },
      //     {
      //       title: "Status",
      //       dataIndex: "status",
      //       key: "status",
      //     },
      //     {
      //       title: "Credit/Debit",
      //       dataIndex: "creditDebit",
      //       key: "creditDebit",
      //   },
      //     {
      //       title: "Credits Spent",
      //       dataIndex: "credits",
      //       key: "credits",
      //   },
      // ];

      const columns = [
        {
          title: "Date",
          dataIndex: "date",
          key: "date",
        },
        {
          title: "Type",
          dataIndex: "description",
          key: "description",
        },
        {
          title: "Description",
          dataIndex: "role",
          key: "role",
        },
        {
          title: "Credit/Debit",
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
				width={'991px'}
				centered
				footer={false}
				open={creditTransactionModal}
				className="creditTransactionModal customTransactionModal"
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