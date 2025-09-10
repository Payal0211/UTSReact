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
    getHRID
}) => {
    const navigate = useNavigate();

	

  const [isLoading, setIsLoading] = useState(false);
  const [selectedHead, setSelectedHead] = useState("");
  const [selectedNewHead, setSelectedNewHead] = useState("");
  const [pODList, setPODList] = useState([]);
  const [pODUsersList, setPODUsersList] = useState({});

  const [groupList,setGroupList] = useState([{
    pod:'',amLead:'', amLeadAmount:'',am:'',amAmount:'',taLead:'',taLeadAmount:'',ta:'', taAmount:'' ,currency:''
  }])

  const  getLeadsForPOD = async (ID) =>{
  let filterResult = await ReportDAO.getAllPODGroupUsersDAO(ID);
  if(filterResult.statusCode === HTTPStatusCode.OK){
    return filterResult?.responseBody
  }else{
    return []}
  }


 const modifyResponseforPOD =async (data)=>{
    let categories = []
    let modData = []

    data.forEach(item=>{
        if(!categories.includes(item.category)){
            categories.push(item.category)
        }
    })

    categories.forEach( async cat=>{
       let cats = data.filter(item=> item.category === cat)
        let podObj = {
            pod:'',amLead:'', amLeadAmount:'',am:'',amAmount:'',taLead:'',taLeadAmount:'',ta:'', taAmount:'' ,currency:''
        }

  podObj.pod = cats[0]?.poD_ID
    podObj.currency = cats[0]?.currencyCode
        cats.forEach(itm=>{
            switch(itm.roW_Value){
                case 'AM Lead':{
                    podObj.amLead = (itm.userID !== 0) ? itm.userID : ''
                    podObj.amLeadAmount = itm.revenue
                    break
                }
                case 'AM':{
                    podObj.am = (itm.userID !== 0 )? itm.userID : ''
                    podObj.amAmount = itm.revenue
                    break
                }
                case 'TA Lead':{
                    podObj.taLead = (itm.userID !== 0 )? itm.userID : ''
                    podObj.taLeadAmount = itm.revenue
                    break
                }
                case 'TA':{
                    podObj.ta = (itm.userID !== 0 )? itm.userID : ''
                    podObj.taAmount = itm.revenue
                    break
                }
                default : break
            }
        })
console.log('podData',podObj)
        modData.push(podObj)
       
    })

 
    return modData
 }


     const getPODList = async () => {
        setIsLoading(true);
let pl = {hrNo:getHRID,podid :0}
        let filterResult = await ReportDAO.getAllPODUsersGroupDAO(pl);
        setIsLoading(false); 
        if (filterResult.statusCode === HTTPStatusCode.OK) {
          console.log('filterResult',filterResult?.responseBody)
          let modData = await modifyResponseforPOD(filterResult?.responseBody)
          
        //   let datawithList = await adduserListToEachPOD(modData)
        //   console.log('set g list',modData,datawithList)
         setGroupList(modData) 
        } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
          // setLoading(false); 
          return navigate(UTSRoutes.LOGINROUTE);
        } else if (
          filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
          // setLoading(false);
          return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            setGroupList([{
    pod:'',amLead:'', amLeadAmount:'',am:'',amAmount:'',taLead:'',taLeadAmount:'',ta:'', taAmount:'' ,currency:''
  }])
          return "NO DATA FOUND";
        }
      };

        const getHeads = async () => {
          setIsLoading(true);
      
          let filterResult = await ReportDAO.getAllPODGroupDAO();
          setIsLoading(false);
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
          setIsLoading(true);
      
          let filterResult = await ReportDAO.getAllPODGroupUsersDAO(ID);
          setIsLoading(false);
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
        getPODList()
        getHeads()
    },[getHRID])

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
            "POD_User_Id": item.amLead,
            "Revenue": item.amLeadAmount ? parseFloat(item.amLeadAmount) : 0
           
        })   
          payload.push({
            "poD_ID": item.pod,
            "HR_ID": getHRID,
            "POD_User_Id": item.am,
            "Revenue": item.amAmount ? parseFloat(item.amAmount) : 0
           
        })
          payload.push({
            "poD_ID": item.pod,
            "HR_ID": getHRID,
            "POD_User_Id": item.taLead,
            "Revenue": item.taLeadAmount ? parseFloat(item.taLeadAmount) : 0
           
        })
        payload.push({
            "poD_ID": item.pod,
            "HR_ID": getHRID,
            "POD_User_Id": item.ta,
            "Revenue": item.taAmount ? parseFloat(item.taAmount) : 0
           
        })
           
        })
    console.log('payload',payload)
    setIsLoading(true);
    let filterResult = await ReportDAO.saveSplitHRDAO(payload);
    setIsLoading(false); 
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
	

console.log('groupList',groupList)
	return (
		<div className={CloneHRModalStyle.cloneHRConfContent}>
			<h2>Split Pipeline {getHRnumber}</h2>

		{isLoading ? <Skeleton active /> : 
        groupList?.map((item,index)=>{
            return <>
            <div className={CloneHRModalStyle.colMd12}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px',justifyContent:'space-between'}}> 
                  <label style={{marginBottom:"12px"}}>
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
                  <label style={{marginBottom:"12px",width:'135px'}}>
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
             <Input type='number' style={{ width: "270px", height:'54px', borderRadius:'8px' }} value={item.amLeadAmount}   onChange={e=>{setGroupList(prev=>{
                    let newArr = [...prev]
                    newArr[index].amLeadAmount = e.target.value
                    return newArr
               })}}/>
                 <p>{item.currency}</p>
							</div>
            </div>

              <div className={CloneHRModalStyle.colMd12}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px',justifyContent:'space-between'}}> 
                  <label style={{marginBottom:"12px",width:'135px'}}>
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
               <Input type='number' style={{ width: "270px", height:'54px', borderRadius:'8px' }} value={item.amAmount}  onChange={e=>{setGroupList(prev=>{
                    let newArr = [...prev]
                    newArr[index].amAmount = e.target.value
                    return newArr
               })}}/>
                 <p>{item.currency}</p>
							</div>
            </div>

            <div className={CloneHRModalStyle.colMd12}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px',justifyContent:'space-between'}}> 
                  <label style={{marginBottom:"12px",width:'135px'}}>
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
              <Input type='number' style={{ width: "270px", height:'54px', borderRadius:'8px' }} value={item.taLeadAmount}  onChange={e=>{setGroupList(prev=>{
                    let newArr = [...prev]
                    newArr[index].taLeadAmount = e.target.value
                    return newArr
               })}}/>
                 <p>{item.currency}</p>
							</div>
            </div>


   <div className={CloneHRModalStyle.colMd12}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px',justifyContent:'space-between'}}> 
                  <label style={{marginBottom:"12px",width:'135px'}}>
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
               <Input type='number' style={{ width: "270px", height:'54px', borderRadius:'8px' }} value={item.taAmount}  onChange={e=>{setGroupList(prev=>{
                    let newArr = [...prev]
                    newArr[index].taAmount = e.target.value
                    return newArr
               })}}/>
               <p>{item.currency}</p>
							</div>
            </div>
<Divider />
            </>
        })}

        
           <div className={CloneHRModalStyle.colMd12}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px',justifyContent:'space-between'}}> 
                  <label style={{marginBottom:"12px",width:'135px'}}>
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


			

			<div className={CloneHRModalStyle.formPanelAction}>
					<button
                    disabled={isLoading}
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