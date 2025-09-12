import CloneHRModalStyle from '../allHiringRequest/cloneHRModal.module.css';
import {useEffect, useState} from 'react'
import { Radio,Checkbox, Select, Input, Divider, Skeleton , message} from 'antd';
import { ReportDAO } from 'core/report/reportDAO';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { useNavigate } from 'react-router-dom';

const SplitHR = ({
	cloneHRhandler,
	onCancel,
	getHRnumber,
	navigateToCloneHR,
	isHRHybrid,
	companyID,
    getHRID,impHooks
}) => {
    const navigate = useNavigate();
    const {groupList,setGroupList,isSplitLoading, setIsSplitLoading} = impHooks

	

  const [selectedHead, setSelectedHead] = useState("");
  const [selectedNewHead, setSelectedNewHead] = useState("");
  const [pODList, setPODList] = useState([]);
  const [pODUsersList, setPODUsersList] = useState({});

  

  const  getLeadsForPOD = async (ID) =>{
  let filterResult = await ReportDAO.getAllPODGroupUsersDAO(ID);
  if(filterResult.statusCode === HTTPStatusCode.OK){
    return filterResult?.responseBody
  }else{
    return []}
  }





    

        const getHeads = async () => {
          setIsSplitLoading(true);
      
          let filterResult = await ReportDAO.getAllPODGroupDAO();
          setIsSplitLoading(false);
          if (filterResult.statusCode === HTTPStatusCode.OK) {
            setPODList(filterResult && filterResult?.responseBody);
            let podsID = filterResult?.responseBody?.map(item=> item.dd_value)
            podsID.forEach(id=>{
                getGroupUsers(id)})
          } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            // setLoading(false);
            return navigate(UTSRoutes.LOGINROUTE);
          } else if (
            filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
          ) {
            // setLoading(false);
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
          } else {
            return "NO DATA FOUND";
          }
        };
      
        const getGroupUsers = async (ID, ind) => {
          setIsSplitLoading(true);
      
          let filterResult = await ReportDAO.getAllPODGroupUsersDAO(ID);
          setIsSplitLoading(false);
          if (filterResult.statusCode === HTTPStatusCode.OK) {
            setPODUsersList(prev=> ({...prev,[ID]: filterResult?.responseBody}));
          } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            // setLoading(false);
            return navigate(UTSRoutes.LOGINROUTE);
          } else if (
            filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
          ) {
            // setLoading(false);
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
          } else {
            return "NO DATA FOUND";
          }
        };


    useEffect(()=>{
        // getPODList()
        getHeads()
    },[])

const addNewPOD =async () => {
    if(selectedNewHead){
        if(groupList.map(item=> item.pod).includes(selectedNewHead)){
            message.error('POD already added')
            return
        }
        let newObj = {
            pod:selectedNewHead,amLead:'', amLeadAmount:'',am:'',amAmount:'',taLead:'',taLeadAmount:'',ta:'', taAmount:'' ,currency:groupList[0]?.currency
        }
        setGroupList(prev=> [...prev,newObj])
        setSelectedNewHead('')
    }else{
        message.error('Please select a POD')
    }
}

const saveSplitHR = async () =>{
    let payload = []
    groupList.forEach(item=> {
           payload.push({
            "poD_ID": item.pod,
            "HR_ID": getHRID,
            "POD_User_Id": item.amLead !== '' ? item.amLead : null,
            "Revenue": item.amLeadAmount ? parseFloat(item.amLeadAmount) : 0
           
        })   
          payload.push({
            "poD_ID": item.pod,
            "HR_ID": getHRID,
            "POD_User_Id": item.am !== '' ? item.am : null,
            "Revenue": item.amAmount ? parseFloat(item.amAmount) : 0
           
        })
          payload.push({
            "poD_ID": item.pod,
            "HR_ID": getHRID,
            "POD_User_Id": item.taLead !== '' ? item.taLead : null,
            "Revenue": item.taLeadAmount ? parseFloat(item.taLeadAmount) : 0
           
        })
        payload.push({
            "poD_ID": item.pod,
            "HR_ID": getHRID,
            "POD_User_Id": item.ta !== '' ? item.ta : null,
            "Revenue": item.taAmount ? parseFloat(item.taAmount) : 0
           
        })
           
        })
    // console.log('payload',payload)
    setIsSplitLoading(true);
    let filterResult = await ReportDAO.saveSplitHRDAO({'hrpodDetails':payload});
    setIsSplitLoading(false); 
    if (filterResult.statusCode === HTTPStatusCode.OK) {
      onCancel()
    } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      // setLoading(false); 
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (
      filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
    ) {
      // setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      return "NO DATA FOUND";
    }
}
	

// console.log('groupList',groupList)
	return (
		<div className={CloneHRModalStyle.cloneHRConfContent}>
			<h2>Split Pipeline {getHRnumber}</h2>

		{isSplitLoading ? <Skeleton active /> : 
        groupList?.map((item,index)=>{
            return <div key={index + 1} className={CloneHRModalStyle.podContainer}>
            <div className={CloneHRModalStyle.colMd12}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px',justifyContent:'space-between'}}> 
                  <label style={{marginBottom:"12px", fontSize:'15px'}}>
                  POD
                  {/* <span style={{color:'#E03A3A',marginLeft:'4px', fontSize:'14px',fontWeight:700}}>
                    *
                  </span> */}
                </label>
                <Select
              id="selectedValue"
              placeholder="Select Head"
              style={{ width: "270px" }}
              // mode="multiple"
              value={item.pod}
              showSearch={true}
              onChange={(value, option) => {
                // setSelectedHead(value);
                 setGroupList(prev=>{
                let newArr = [...prev]
                newArr[index].pod = value
                return newArr
               })
                // getGroupUsers(value, index);
              }}
              options={pODList?.map((v) => ({
                label: v.dd_text,
                value: v.dd_value,
              }))}
              optionFilterProp="label"
            />
							</div>
            </div>

             <div className={CloneHRModalStyle.colMd12}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px',justifyContent:'space-between'}}> 
                  <label style={{marginBottom:"12px",width:'135px', fontSize:'15px'}}>
                  AM Lead
                  {/* <span style={{color:'#E03A3A',marginLeft:'4px', fontSize:'14px',fontWeight:700}}>
                    *
                  </span> */}
                </label>
                <Select
              id="selectedValue"
              placeholder="AM Lead"
              style={{ width: "270px" }}
              // mode="multiple"
              value={item.amLead}
            //   showSearch={true}
              onChange={(value, option) => {
               setGroupList(prev=>{
                let newArr = [...prev]
                newArr[index].amLead = value
                return newArr
               })
              }}
              options={pODUsersList[item.pod]?.filter(item=> item.usertype === 'AM' && item.leadtype === "leaduser")?.map((v) => ({
                label: v.dd_text,
                value: v.dd_value,
              }))}
            //   optionFilterProp="label"
            />
             <Input type='number' style={{ width: "270px", height:'40px', borderRadius:'8px' }} value={item.amLeadAmount}   onChange={e=>{setGroupList(prev=>{
                    let newArr = [...prev]
                    newArr[index].amLeadAmount = e.target.value
                    return newArr
               })}}/>
                 <p>{item.currency}</p>
							</div>
            </div>

              <div className={CloneHRModalStyle.colMd12}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px',justifyContent:'space-between'}}> 
                  <label style={{marginBottom:"12px",width:'135px', fontSize:'15px'}}>
                  AM 
                  {/* <span style={{color:'#E03A3A',marginLeft:'4px', fontSize:'14px',fontWeight:700}}>
                    *
                  </span> */}
                </label>
                   <Select
              id="selectedValue"
              placeholder="AM"
              style={{ width: "270px" }}
              // mode="multiple"
              value={item.am}
            //   showSearch={true}
              onChange={(value, option) => {
               setGroupList(prev=>{
                let newArr = [...prev]
                newArr[index].am = value
                return newArr
               })
              }}
              options={pODUsersList[item.pod]?.filter(item=> item.usertype === 'AM' && item.leadtype !== "leaduser")?.map((v) => ({
                label: v.dd_text,
                value: v.dd_value,
              }))}
              optionFilterProp="label"
            />
               <Input type='number' style={{ width: "270px", height:'40px', borderRadius:'8px' }} value={item.amAmount}  onChange={e=>{setGroupList(prev=>{
                    let newArr = [...prev]
                    newArr[index].amAmount = e.target.value
                    return newArr
               })}}/>
                 <p>{item.currency}</p>
							</div>
            </div>

            <div className={CloneHRModalStyle.colMd12}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px',justifyContent:'space-between'}}> 
                  <label style={{marginBottom:"12px",width:'135px', fontSize:'15px'}}>
                  TA Lead
                  {/* <span style={{color:'#E03A3A',marginLeft:'4px', fontSize:'14px',fontWeight:700}}>
                    *
                  </span> */}
                </label>
                <Select
              id="selectedValue"
              placeholder="Select Head"
              style={{ width: "270px" }}
              // mode="multiple"
              value={item.taLead}
            //   showSearch={true}
              onChange={(value, option) => {
                setGroupList(prev=>{
                    let newArr = [...prev]
                    newArr[index].taLead = value
                    return newArr
                })
              }}
              options={pODUsersList[item.pod]?.filter(item=> item.usertype === 'TA' && item.leadtype === "leaduser")?.map((v) => ({
                label: v.dd_text,
                value: v.dd_value,
              }))}
              optionFilterProp="label"
            />
              <Input type='number' style={{ width: "270px", height:'40px', borderRadius:'8px' }} value={item.taLeadAmount}  onChange={e=>{setGroupList(prev=>{
                    let newArr = [...prev]
                    newArr[index].taLeadAmount = e.target.value
                    return newArr
               })}}/>
                 <p>{item.currency}</p>
							</div>
            </div>


   <div className={CloneHRModalStyle.colMd12}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px',justifyContent:'space-between'}}> 
                  <label style={{marginBottom:"12px",width:'135px', fontSize:'15px'}}>
                  TA 
                  {/* <span style={{color:'#E03A3A',marginLeft:'4px', fontSize:'14px',fontWeight:700}}>
                    *
                  </span> */}
                </label>
                   <Select
              id="selectedValue"
              placeholder="Select Head"
              style={{ width: "270px" }}
              // mode="multiple"
              value={item.ta}
            //   showSearch={true}
              onChange={(value, option) => {
                setGroupList(prev=>{
                    let newArr = [...prev]
                    newArr[index].ta = value
                    return newArr
                })
              }}
              options={pODUsersList[item.pod]?.filter(item=> item.usertype === 'TA' && item.leadtype !== "leaduser")?.map((v) => ({
                label: v.dd_text,
                value: v.dd_value,
              }))}
              optionFilterProp="label"
            />
               <Input type='number' style={{ width: "270px", height:'40px', borderRadius:'8px' }} value={item.taAmount}  onChange={e=>{setGroupList(prev=>{
                    let newArr = [...prev]
                    newArr[index].taAmount = e.target.value
                    return newArr
               })}}/>
               <p>{item.currency}</p>
							</div>
            </div>
<Divider />
            </div>
        })}

        
           <div className={`${CloneHRModalStyle.colMd12} ${CloneHRModalStyle.podContainer}`}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px',justifyContent:'space-between'}}> 
                  <label style={{marginBottom:"12px",width:'135px', fontSize:'15px'}}>
                  New POD
                </label>
               <Select
              id="selectedValue"
              placeholder="Select Head"
              style={{ width: "270px" }}
              // mode="multiple"
              value={selectedNewHead}
              showSearch={true}
              onChange={(value, option) => {
                setSelectedNewHead(value);
              }}
              options={pODList?.map((v) => ({
                label: v.dd_text,
                value: v.dd_value,
              }))}
              optionFilterProp="label"
            />

            <button
						className={CloneHRModalStyle.btnADDPrimary}
						onClick={() => {
                            addNewPOD()
                        }}>
						Add POD
					</button>
							</div>
            </div>


			

			<div className={CloneHRModalStyle.formPanelAction} style={{marginBottom:'5px'}}>
					<button
                    disabled={isSplitLoading}
						className={CloneHRModalStyle.btnPrimary}
						onClick={() => {
						saveSplitHR()
							}}>
						Save
					</button>
				
				<button
					className={CloneHRModalStyle.btn}
					onClick={() => onCancel()}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default  SplitHR